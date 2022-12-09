---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

GCP: google cloud platform

## google cloud products

### 广义产品对比

App Engine VS Cloud Run

https://stackoverflow.com/questions/55696299/when-to-use-google-app-engine-flex-vs-google-cloud-run

https://dev.to/pcraig3/cloud-run-vs-app-engine-a-head-to-head-comparison-using-facts-and-science-1225#:~:text=Overview%3A%20Cloud%20Run&text=Cloud%20Run%20runs%20containers%2C%20so,you%20focus%20on%20during%20development.

### 狭义产品管理

In the project drop down ( My Project arrow_drop_down) at the top of the Google Cloud Console page

进入 https://console.cloud.google.com/

默认选中某个Project，点击下拉菜单可以切换和新建

或者去dashboard：

https://console.cloud.google.com/projectselector2/home/dashboard

https://console.cloud.google.com/cloud-resource-manager



## Billing 账单

https://console.cloud.google.com/billing/01CC2F-E265EF-CB7ED4/manage?project=windy-watch-303800

Billing->Account Management->Actions(Disable or Change billing)

## Cloud shell&gcloud

Cloud Shell is a built-in command-line tool for the console. 

Open Cloud Shell by clicking the Activate Cloud Shell button in the navigation bar in the upper-right corner of the console.

in the top right toolbar, click the **Activate Cloud Shell** button.

https://cloud.google.com/sdk/gcloud

Cloud Shell is a virtual machine that is loaded with development tools. It offers a persistent 5GB home directory and runs on the Google Cloud. Cloud Shell provides command-line access to your Google Cloud resources.

`gcloud` is the command-line tool for Google Cloud. It comes pre-installed on Cloud Shell and supports tab-completion.

```
lyhistory@cloudshell:~ (windy-watch-303800)$gcloud auth list
Only listing images in gcr.io/windy-watch-303800. Use --repository to list images in other repositories.
lyhistory@cloudshell:~ (windy-watch-303800)$ gcloud auth list
   Credentialed Accounts
ACTIVE  ACCOUNT
*       lyhistory@gmail.com

To set the active account, run:
    $ gcloud config set account `ACCOUNT`
    
lyhistory@cloudshell:~ (windy-watch-303800)$ gcloud config list project
[core]
project = windy-watch-303800
Your active configuration is: [cloudshell-5094]
```

## App Engine

https://console.cloud.google.com/projectselector2/appengine/quotadetails

https://cloud.google.com/appengine/docs/standard/python3/an-overview-of-app-engine?hl=en-GB

https://cloud.google.com/appengine/docs/standard/php7/console/?hl=en-GB

**Important:** Each Cloud project can contain only a single App Engine application, and once created you cannot change the [location](https://cloud.google.com/appengine/docs/locations) of your App Engine application.



**选择环境 Standard Environment VS Flexible Environment **

https://cloud.google.com/appengine/docs/the-appengine-environments

+ standard

  Application instances run in a [sandbox](https://en.wikipedia.org/wiki/Sandbox_(computer_security)), using the runtime

  Applications that need to deal with rapid scaling.

  Intended to **run for free or at very low cost**, where you pay only for what you need and when you need it. For example, your application can scale to 0 instances when there is no traffic.

  Experiences **sudden and extreme spikes of traffic** which require immediate scaling.

+ flexible

  Application instances run within Docker containers on Compute Engine virtual machines (VM).

  Applications that receive consistent traffic, experience regular traffic fluctuations, or meet the parameters for scaling up and down gradually.

  Runs in a Docker container that includes a custom runtime or source code written in **other programming languages**.

  Uses or depends on frameworks that include **native code**.

  Accesses the resources or services of your Google Cloud project that reside in the **Compute Engine network**.

  



**Project setup**
GCP organises resources into projects, which collect all of the related resources for a single application in one place.

Begin by creating a new project or selecting an existing project for this tutorial.

Select a project, or create a new one

```
gcloud projects create
```



**create app**

```
git clone https://github.com/GoogleCloudPlatform/php-docs-samples
cd php-docs-samples/appengine/standard/helloworld/
#view your application code:
standard env: cat index.php
flexible env: cat web/index.php
#Exploring your configuration
#App Engine uses YAML files to specify a deployment's configuration. app.yaml files contain information about your application, like the runtime environment, URL handlers and more. refer: 
https://yaml.org/?hl=en-GB
https://cloud.google.com/appengine/docs/standard/php/config/appref?hl=en-GB
cat app.yaml
```

**Test your app on Cloud Shell**
Cloud Shell lets you test your app before deploying to make sure that it's running as intended, just like debugging on your local machine.

```
composer install
standard env: php -S localhost:8080
flexible env: php -S localhost:8080 -t web/
Your app is now running on Cloud Shell. You can access the app by clicking the Web preview  button at the top of the Cloud Shell pane and choosing Preview on port 8080.
Terminate the web server for previewing your application by pressing Ctrl+C in Cloud Shell.
```

**Deploying to App Engine**

```
: Open the Navigation menu in the upper-left corner of the console, # To deploy your app, you need to create an app in a region(Note: If you've already created an app, you can skip this step.):
lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app create
Please choose the region where you want your App Engine application
located:
...............
lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app describe
authDomain: gmail.com
codeBucket: staging.windy-watch-303800.appspot.com
databaseType: CLOUD_DATASTORE_COMPATIBILITY
defaultBucket: windy-watch-303800.appspot.com
defaultHostname: windy-watch-303800.df.r.appspot.com
featureSettings:
  splitHealthChecks: true
  useContainerOptimizedOs: true
gcrDomain: asia.gcr.io
id: windy-watch-303800
locationId: asia-east2
name: apps/windy-watch-303800
servingStatus: SERVING
lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app instances list
Listed 0 items.

# Deploying with Cloud Shell
lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app deploy
Services to deploy:

descriptor:      [/home/lyhistory/php-docs-samples/appengine/standard/helloworld/app.yaml]
source:          [/home/lyhistory/php-docs-samples/appengine/standard/helloworld]
target project:  [windy-watch-303800]
target service:  [default]
target version:  [20210213t151051]
target url:      [https://windy-watch-303800.df.r.appspot.com]
File upload done.
Updating service [default]...failed.
ERROR: (gcloud.app.deploy) Error Response: [7] Access Not Configured. Cloud Build has not been used in project windy-watch-303800 before or it is disabled. Enable it by visiting https://console.
developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=windy-watch-303800 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our s
ystems and retry.

失败的原因是：需要 Enable Cloud Build API

激活后再试一次
File upload done.
Updating service [default]...done.
Setting traffic split for service [default]...done.
Deployed service [default] to [https://windy-watch-303800.df.r.appspot.com]

You can stream logs from the command line by running:
  $ gcloud app logs tail -s default

To view your application in the web browser run:
  $ gcloud app browse

lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app browse
Did not detect your browser. Go to this link to view your app:
https://windy-watch-303800.df.r.appspot.com


Congratulations! Your app has been deployed. The default URL of your app is a subdomain on appspot.com that starts with your project's ID: windy-watch-303800.appspot.com.
You can monitor the status of your app on the App Engine dashboard: Open the Navigation menu in the upper-left corner of the console, Then, select the App Engine section.


```

**Disable your application**
Go to the AppEngine->Settings page. Click Disable Application.

This is sufficient to stop billing from this app. More details on the relationship between apps and projects and how to manage each can be found here.

```
lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app instances list
SERVICE  VERSION          ID                                                                                                                                        VM_STATUS  DEBUG_MODE
default  20210213t151501  00c61b117c001f3243951bc6da92fc207353d97d41ebe7fe867b120eea6f9a84f159820843dcb61ace9c127abc0695a9bb939148ae0ece59a72d3b784a496407201342e2  N/A
default  20210213t151501  00c61b117c6b73dd396d9c0010f55e91b36574a7183549d9e7de660988fe2f2253d72ca8e47687ee6f69d6500751199768d1d4e436ae7654037c816c659cae623cf95612  N/A

lyhistory@cloudshell:~/php-docs-samples/appengine/standard/helloworld (windy-watch-303800)$ gcloud app instances delete 00c61b117c001f3243951bc6da92fc207353d97d41ebe7fe867b120eea6f9a84f159820843dcb61ace9c127abc0695a9bb939148ae0ece59a72d3b784a496407201342e2 --service=default --version=20210213t151501
Deleting the instance [default/20210213t151501/00c61b117c001f3243951bc6da92fc207353d97d41ebe7fe867b120eea6f9a84f159820843dcb61ace9c127abc0695a9bb939148ae0ece59a72d3b784a496407201342e2].
Do you want to continue (Y/n)?  y

Deleted [https://appengine.googleapis.com/v1/apps/windy-watch-303800/services/default/versions/20210213t151501/instances/00c61b117c001f3243951bc6da92fc207353d97d41ebe7fe867b120eea6f9a84f159820843dcb61ace9c127abc0695a9bb939148ae0ece59a72d3b784a496407201342e2].

```



**Delete your project**
If you would like to completely delete the app, you must delete the project in the Manage resources page. This is not reversible, and any other resources that you have in your project will be destroyed:

Go to "IAM & admin", Click Manage resources. Click Delete.

https://console.cloud.google.com/cloud-resource-manager



## Cloud Run

[Cloud Run](https://cloud.google.com/run) is a managed compute platform that enables you to run stateless containers that are invocable via HTTP requests. Cloud Run is serverless: it abstracts away all infrastructure management, so you can focus on what matters most — building great applications.

[Knative](https://cloud.google.com/knative/), letting you choose to run your containers either fully managed with Cloud Run, or in your [Google Kubernetes Engine](https://cloud.google.com/kubernetes) cluster with Cloud Run on GKE.

Cloud Run automatically and horizontally scales your container image to handle the received requests, then scales down when demand decreases. In your own environment, you only pay for the CPU, memory, and networking consumed during request handling.



实验:

https://cloud.google.com/run/docs/quickstarts/build-and-deploy

https://www.qwiklabs.com/focuses/5162?parent=catalog

### 创建project

top left menu

### 开启Cloud Run API

去到页面 https://console.cloud.google.com/run   the **APIs & Services** section 点击 Enable the Cloud Run API按钮

或者去到cloud shell执行：

```
gcloud services enable run.googleapis.com

```

安装sdk

```
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-327.0.0-linux-x86_64.tar.gz

tar zxvf 

./google-cloud-sdk/install.sh

Backing up [/home/lyhistory/.bashrc] to [/home/lyhistory/.bashrc.backup].
[/home/lyhistory/.bashrc] has been updated.

==> Start a new shell for the changes to take effect.


For more information on how to get started, please visit:
  https://cloud.google.com/sdk/docs/quickstarts
  
lyhistory@cloudshell:~$ ./google-cloud-sdk/bin/gcloud init
Welcome! This command will take you through the configuration of gcloud.

Settings from your current configuration [cloudshell-1108] are:
core:
  account: lyhistory@gmail.com
  disable_usage_reporting: 'False'

Pick configuration to use:
 [1] Re-initialize this configuration [cloudshell-1108] with new settings
 [2] Create a new configuration
Pick cloud project to use:
 [1] api-project-313831293967
 [2] api-project-439776564184
 [3] api-project-443670569960
 [4] api-project-545211972163
 [5] cloudrun-304812
 [6] windy-watch-303800
 [7] Create a new project
Please enter numeric choice or text value (must exactly match list
item):  5
```



### 应用代码开发 Write the sample application

```
mkdir helloworld-nodejs
cd helloworld-nodejs

package.json:
{
  "name": "cloudrun-helloworld",
  "version": "1.0.0",
  "description": "Simple hello world sample in Node",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "",
  "license": "Apache-2.0",
  "dependencies": {
    "express": "^4.16.4"
  }
}

index.js:
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'World';
  res.send(`Hello ${target}!`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});
```

### 容器化应用并上传到容器注册 Containerize your app and upload it to Container Registry

To containerize the sample app, create a new file named `Dockerfile` in the same directory as the source files, and add the following content:

```
# Use the official Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:10

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "npm", "start" ]
```



build your container image using Cloud Build by running the following command from the directory containing the `Dockerfile`

```
lyhistory@cloudshell:~$ gcloud projects list
PROJECT_ID                NAME               PROJECT_NUMBER
api-project-313831293967  API Project        313831293967
api-project-439776564184  com.minyi          439776564184
api-project-443670569960  release-minyi-map  443670569960
api-project-545211972163  com.minyi.map      545211972163
cloudrun-304812           CloudRun           526315478861
windy-watch-303800        My First Project   497124201139

## 开始是忘记了设置第一步sdk安装和初始化
获取 PROJECT-ID:
lyhistory@cloudshell:~$ gcloud config get-value project
Your active configuration is: [cloudshell-1108]
(unset)
## 安装sdk并初始化后：
lyhistory@cloudshell:~ (cloudrun-304812)$ gcloud config get-value project
Your active configuration is: [cloudshell-1108]
cloudrun-304812

gcloud builds submit --tag gcr.io/[PROJECT-ID]/helloworld
gcloud builds submit --tag gcr.io/cloudrun-304812/helloworld
DONE
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

ID                                    CREATE_TIME                DURATION  SOURCE                                                                                         IMAGES                     STATUS
749adb9e-d249-410b-bb54-55f37833507e  2021-02-14T13:52:06+00:00  45S       gs://cloudrun-304812_cloudbuild/source/1613310724.296616-ec19672d4623442faf612ca587cc1317.tgz  gcr.io/cloudrun-304812/helloworld (+1 more)  SUCCESS


lyhistory@cloudshell:~/helloworld-nodejs (cloudrun-304812)$ gcloud container images list
NAME
gcr.io/cloudrun-304812/helloworld
Only listing images in gcr.io/cloudrun-304812. Use --repository to list images in other repositories.
```

Cloud Build is a service that executes your builds on GCP. It executes a series of build steps, where each build step is run in a Docker container to produce your application container (or other artifacts) and push it to Cloud Registry, all in one command.

Once pushed to the registry, you will see a SUCCESS message containing the image name (`gcr.io/[PROJECT-ID]/helloworld`). The image is stored in Container Registry and can be re-used if desired.



本地测试：

To run and test the application locally from Cloud Shell, start it using this standard `docker` command 

```
docker run -d -p 8080:8080 gcr.io/cloudrun-304812/helloworld
# If the docker command cannot pull the remote container image then try running this : 
gcloud auth configure-docker
```

In the Cloud Shell window, click on Web preview and select "Preview on port 8080". This should open a browser window showing the "Hello World!" message. You could also simply use `curl localhost:8080`.

### 部署 Deploy to Cloud Run

```
gcloud beta run deploy --image gcr.io/cloudrun-304812/helloworld

Done.
Service [helloworld] revision [helloworld-00001-liz] has been deployed and is serving 100 percent of traffic.
Service URL: https://helloworld-inosjuzkna-de.a.run.app
```

When prompted:

- select Cloud Run (fully managed)
- confirm the service name by pressing **Enter**
- select your region ( `us-central1`)
- respond `y` to allow unauthenticated invocations (that last step is important and can also be avoided by using the `--allow-unauthenticated` deploy option).

```
Service [helloworld] revision [helloworld-00001] has been deployed
and is serving traffic at https://helloworld-wdl7fdwaaa-uc.a.run.app
```

### 销毁

While Cloud Run does not charge when the service is not in use, you might still be charged for storing the built container image.

You can either decide to delete your GCP project to avoid incurring charges, which will stop billing for all the resources used within that project, or simply delete your `helloworld` image using this command. Make sure to replace your project id.

```
gcloud container images delete gcr.io/cloudrun-304812/helloworld
gcloud beta run services delete helloworld
```

同时尽量去“Billing账单”部分disable相应的账单绑定，以防有错误的扣款！

<disqus/>