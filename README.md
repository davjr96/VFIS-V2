# Virginia Flood Information System Web-App V2

> UVA Hydroinformatics

This repository contains code for a prototype cloud based flood warning system. This system provide warnings for flooded transportation infrastructure in coastal virginia, specifically, Hampton Road District. The system contains 3 components: A windows server to run the model, a linux webserver to visualize the results in a browser, and a storage bucket for data archival. This repository contains the webserver code.

## Installing / Getting started

First clone this repository.

There are two parts to the webserver code. A python back-end and a ReactJS front-end. Each requires the installation of dependencies and running a script.

The google cloud command line API must be installed so that the timeseries CSV files can be obtained from the storage bucket. Follow these instructions https://cloud.google.com/sdk/docs/how-to
Then run the following command

```shell
gcloud auth application-default login
```

to allow the python library to access the account credentials.

To start the back-end python,

```shell
pip install -r requirements.txt
python server.py
```

For the front-end ReactJS

```shell
cd front-end
npm install
npm start
```

A browser window should open and display the website.

### Deploying / Publishing

To deploy on a server the code must be cloned, libraries installed, and then the code built.
We run our webserver using NGINX to handle connections and PM2 to handle process management. Instructions for setting them up are below.

First clone this repo.
Then

```shell
pip install -r requirements.txt
```

to install python dependencies.

To install the react dependencies and build the code for production.

First install nodejs using the correct [instructions](https://nodejs.org/en/download/package-manager/) for your system.
Run

```shell
cd front-end
npm install
npm run build
```

To install and configure NGINX:

```shell
    sudo apt-get update
    sudo apt-get install -y nginx
```

```shell
   sudo /etc/init.d/nginx start
   sudo rm /etc/nginx/sites-enabled/default
   sudo touch /etc/nginx/sites-available/app
   sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app
   sudo vim /etc/nginx/sites-available/app
```

and the copy and paste the following configuration into the new file

```NGINX
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /home/uvahydroinformaticslab/server/front-end/dist;

        index index.html index.htm
                server_name _;
                error_page 404 =200 /index.html;
                location /api {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $http_host;
                proxy_pass http://127.0.0.1:8000;
        }
}
```

Restart NGINX

```bash
sudo /etc/init.d/nginx restart
```

To install pm2:

```bash
 npm install pm2 -g
```

Then run the following command to start the python server.

```bash
pm2 start server/server.py
```
