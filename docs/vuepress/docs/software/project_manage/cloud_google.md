GCP: google cloud platform

## google cloud products

In the project drop down ( My Project arrow_drop_down) at the top of the Google Cloud Console page

进入 https://console.cloud.google.com/

默认选中某个Project，点击下拉菜单可以切换和新建

或者去dashboard：

https://console.cloud.google.com/projectselector2/home/dashboard

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
gcloud auth list
gcloud config list project
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
cd php-docs-samples/appengine/php72/helloworld
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
gcloud app create

# Deploying with Cloud Shell
gcloud app deploy

Congratulations! Your app has been deployed. The default URL of your app is a subdomain on appspot.com that starts with your project's ID: windy-watch-303800.appspot.com.
You can monitor the status of your app on the App Engine dashboard: Open the Navigation menu in the upper-left corner of the console, Then, select the App Engine section.


```

**Disable your application**
Go to the AppEngine->Settings page. Click Disable Application.

This is sufficient to stop billing from this app. More details on the relationship between apps and projects and how to manage each can be found here.

**Delete your project**
If you would like to completely delete the app, you must delete the project in the Manage resources page. This is not reversible, and any other resources that you have in your project will be destroyed:

Go to "IAM & admin", Click Manage resources. Click Delete.

https://console.cloud.google.com/cloud-resource-manager



## Cloud Run

[Cloud Run](https://cloud.google.com/run) is a managed compute platform that enables you to run stateless containers that are invocable via HTTP requests. Cloud Run is serverless: it abstracts away all infrastructure management, so you can focus on what matters most — building great applications.

[Knative](https://cloud.google.com/knative/), letting you choose to run your containers either fully managed with Cloud Run, or in your [Google Kubernetes Engine](https://cloud.google.com/kubernetes) cluster with Cloud Run on GKE.

Cloud Run automatically and horizontally scales your container image to handle the received requests, then scales down when demand decreases. In your own environment, you only pay for the CPU, memory, and networking consumed during request handling.



实验:

https://cloud.google.com/run/docs/quickstarts/build-and-deployss

https://www.qwiklabs.com/focuses/5162?parent=catalog

### 创建project

top left menu

### 开启Cloud Run API

去到页面 https://console.cloud.google.com/run   the **APIs & Services** section 点击 Enable the Cloud Run API按钮

或者去到cloud shell执行：

```
gcloud services enable run.googleapis.com
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
获取 PROJECT-ID: gcloud config get-value project
gcloud builds submit --tag gcr.io/[PROJECT-ID]/helloworld
gcloud container images list
```

Cloud Build is a service that executes your builds on GCP. It executes a series of build steps, where each build step is run in a Docker container to produce your application container (or other artifacts) and push it to Cloud Registry, all in one command.

Once pushed to the registry, you will see a SUCCESS message containing the image name (`gcr.io/[PROJECT-ID]/helloworld`). The image is stored in Container Registry and can be re-used if desired.



本地测试：

To run and test the application locally from Cloud Shell, start it using this standard `docker` command 

```
docker run -d -p 8080:8080 gcr.io/[PROJECT-ID]/helloworld
# If the docker command cannot pull the remote container image then try running this : 
gcloud auth configure-docker
```

In the Cloud Shell window, click on Web preview and select "Preview on port 8080". This should open a browser window showing the "Hello World!" message. You could also simply use `curl localhost:8080`.

### 部署 Deploy to Cloud Run

```
gcloud beta run deploy --image gcr.io/[PROJECT-ID]/helloworld
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
gcloud container images delete gcr.io/[PROJECT-ID]/helloworld
gcloud beta run services delete helloworld
```

同时尽量去“Billing账单”部分disable相应的账单绑定，以防有错误的扣款！