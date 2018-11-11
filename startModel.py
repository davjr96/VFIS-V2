import paramiko
import googleapiclient.discovery
import .constants
import time
import logging
logging.basicConfig()

compute = googleapiclient.discovery.build('compute', 'v1')

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

def line_buffered(f):
    line_buf = ""
    while not f.channel.exit_status_ready():
        line_buf += f.read(1)
        if line_buf.endswith('\n'):
            yield line_buf
            line_buf = ''

def runBatch(filename):
    print ("Running Script")
    result = compute.instances().start(project='flood-warning-system',
                                       zone='us-east1-c', instance='model-beta').execute()
    wait_for_operation(compute, 'flood-warning-system',
                       'us-east1-c', result['name'])
    time.sleep(60)
    result = compute.instances().list(
        project='flood-warning-system', zone='us-east1-c').execute()
    InstanceIP = result['items'][0]['networkInterfaces'][0]['accessConfigs'][0]['natIP']
    print ("cd " + constants.InstanceScriptLocation + " & " + constants.InstanceScript + " " + filename)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(InstanceIP, username=constants.InstanceUser, password=constants.InstancePass)
    ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(
        "cd " + constants.InstanceScriptLocation + " & " +  constants.InstanceScript + " " + filename)

    for l in line_buffered(ssh_stdout):
        print (l)

    print (ssh_stderr.readlines())
    ssh.close()
