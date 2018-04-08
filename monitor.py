from pydap.client import open_url
from pydap.exceptions import ServerError
import subprocess
import datetime as dt
import numpy as np
import urllib2
import paramiko
import googleapiclient.discovery
from apscheduler.schedulers.blocking import BlockingScheduler
import constants

compute = googleapiclient.discovery.build('compute', 'v1')
sched = BlockingScheduler()

"""
Global parameters:
    -Study area location (LL and UR corners of TUFLOW model bounds)
    -Initial and average resolution values for longitude and latitude,
     needed for grid point conversion
    (source: http://nomads.ncep.noaa.gov:9090/dods/hrrr "info" link)
"""

initLon = -134.09548000000  # modified that to follow the latest values on the website
aResLon = 0.029

initLat = 21.14054700000  # modified that to follow the latest values on the website
aResLat = 0.027

# this values added to the original bounding box made the retrieved data to be
lon_lb = (-77.979315-0.4489797462)
lon_ub = (-76.649286-0.455314383)
lat_lb = (36.321159-0.133)
lat_ub = (37.203955-0.122955)

def getData(current_dt, delta_T):
    dtime_fix = current_dt + dt.timedelta(hours=delta_T)
    date = dt.datetime.strftime(dtime_fix, "%Y%m%d")
    fc_hour = dt.datetime.strftime(dtime_fix, "%H")
    hour = str(fc_hour)
    url = 'http://nomads.ncep.noaa.gov:9090/dods/hrrr/hrrr%s/hrrr_sfc_%sz' % (date, hour)
    try:
        dataset = open_url(url)
        if len(dataset.keys()) > 0:
            return dataset, url, date, hour
        else:
            print "Back up method - Failed to open : %s" % url
            return getData(current_dt, delta_T - 1)
    except ServerError:
        print "Failed to open : %s" % url
        return getData(current_dt, delta_T - 1)


def gridpt(myVal, initVal, aResVal):
    gridVal = int((myVal-initVal)/aResVal)
    return gridVal


def max_three(l):
    maxSum = 0
    for i in range(0,len(l)-3):
        if sum(l[i:i+3]) > maxSum:
            maxSum = sum(l[i:i+3])
    return maxSum


def max_six(l):
    maxSum = 0
    for i in range(0,len(l)-6):
        if sum(l[i:i+6]) > maxSum:
            maxSum = sum(l[i:i+6])
    return maxSum


def max_twelve(l):
    maxSum = 0
    for i in range(0,len(l)-12):
        if sum(l[i:i+12]) > maxSum:
            maxSum = sum(l[i:i+12])
    return maxSum

def wait_for_operation(compute, project, zone, operation):
    print('Waiting for operation to finish...')
    while True:
        result = compute.zoneOperations().get(project=project, zone=zone,
                                              operation=operation).execute()
        if result['status'] == 'DONE':
            print("done.")
            if 'error' in result:
                raise Exception(result['error'])
            return result
        time.sleep(1)


def runBatch(filename):
    print "Running Script"
    result = compute.instances().start(project='flood-warning-system',
                                       zone='us-east1-c', instance='model').execute()
    wait_for_operation(compute, 'flood-warning-system',
                       'us-east1-c', result['name'])
    result = compute.instances().list(
        project='flood-warning-system', zone='us-east1-c').execute()
    InstanceIP = result['items'][0]['networkInterfaces'][0]['accessConfigs'][0]['natIP']
    print "cd " + constants.InstanceScriptLocation + " & " + constants.InstanceScript + " " + filename
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(constants.InstanceIP, username=constants.InstanceUser, password=constants.InstancePass)
    ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(
        "cd " + constants.InstanceScriptLocation + " & " +  constants.InstanceScript + " " + filename)
    print ssh_stdout.readlines()
    print ssh_stderr.readlines()
    ssh.close()
    checkForFlooding(filename)

def checkForFlooding(filename):
    return 0


def data_monitor():

    with open("forecasts.txt") as f:
        ran = f.readlines()
    ran = [x.strip() for x in ran]
    print ran

    # Get newest available HRRR dataset by trying (current datetime - delta time) until
    # a dataset is available for that hour. This corrects for inconsistent posting
    # of HRRR datasets to repository
    utc_datetime = dt.datetime.utcnow()
    print "Open a connection to HRRR to retrieve forecast rainfall data.............\n"
    # get newest available dataset
    dataset, url, date, hour = getData(utc_datetime, delta_T=0)
    print ("Retrieving forecast data from: %s " % url)

    filename = str(date) + "-" + str(hour)+"0000"

    var = "apcpsfc"
    precip = dataset[var]
    print ("Dataset open")

    # Convert dimensions to grid points, source: http://nomads.ncdc.noaa.gov/guide/?name=advanced
    grid_lon1 = gridpt(lon_lb, initLon, aResLon)
    grid_lon2 = gridpt(lon_ub, initLon, aResLon)
    grid_lat1 = gridpt(lat_lb, initLat, aResLat)
    grid_lat2 = gridpt(lat_ub, initLat, aResLat)

    max_precip_value = []
    for hr in range(len(precip.time[:])):
        while True:
            try:
                grid = precip[hr, grid_lat1:grid_lat2, grid_lon1:grid_lon2]
                max_precip_value.append(np.amax(grid.array[:]))
                break
            except ServerError:
                'There was a server error. Let us try again'

    print "Rainfall",
    print max_precip_value

    response = urllib2.urlopen('http://www.nws.noaa.gov/data/ALR/FFGAKQ')
    html = response.read()

    threshold = []
    # Split into lines
    for line in html.splitlines():
        if line[0:6] == "VAZ088":  # Capture line of region of interest
            threshold = line.split(" ")  # Turn line into list

    threshold = filter(None, threshold)  # Remove empty items of list leaving only region and rainfall
    threshold = threshold[1:6]  # Remove region from list
    threshold = [s.strip('/') for s in threshold]  # Remove trailing / from raw data
    threshold = map(float, threshold)  # Convert to float
    threshold = [round(r * 25.4, 2) for r in threshold]  # Convert to mm from in, round to 2 decimal places
    print "Flooding threshold",
    print threshold

    triggered = False
    if max(max_precip_value) > threshold[0] and triggered is False:
        triggered = True
    if max_three(max_precip_value) > threshold[1] and triggered is False:
        triggered = True
    if max_six(max_precip_value) > threshold[2] and triggered is False:
        triggered = True
    if max_twelve(max_precip_value) > threshold[3] and triggered is False:
        triggered = True
    if sum(max_precip_value) > threshold[4] and triggered is False:
        triggered = True

    triggered = True
    if triggered and filename not in ran:
        print "Starting Model Run"
        f = open('forecasts.txt', 'w')
        f.write(filename + '\n')
        f.close()

        runBatch(filename)
        print "Done running the model at", dt.datetime.now()
    else:
        print "Model not started"


# sched.add_job(data_monitor, 'interval', hours=1)
# sched.start()
data_monitor()
