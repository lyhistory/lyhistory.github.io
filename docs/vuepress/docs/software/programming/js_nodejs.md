---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 基本语法:

模块系统 Modules

事件 Event

函数 function

路由 route

全局对象 Global Object

event loop

```
console.log('script start')

const interval = setInterval(() => {	1-TASK
  console.log('setInterval')
}, 0)

setTimeout(() => {						1-TASK
  console.log('setTimeout 1')
  Promise.resolve().then(() => {
    console.log('promise 3')
  }).then(() => {
    console.log('promise 4')
  }).then(() => {
    setTimeout(() => {
      console.log('setTimeout 2')
      Promise.resolve().then(() => {
        console.log('promise 5')
      }).then(() => {
        console.log('promise 6')
      }).then(() => {
        clearInterval(interval)
      })
    }, 0)
  })
}, 0)

Promise.resolve().then(() => {			1-MICROTASK
  console.log('promise 1')
}).then(() => {
  console.log('promise 2')
})

stack:
	script start
	<STACK empty>
	<run 1-MICROTASK>
	promise 1
	promise 2
	<MICROTASK empty>
	<STACK empty>
	<run 1-TASK>
	setInterval [ and schedule a new interval after timeout in 2-TASK queue]
	<MICROTASK empty>
	<run 1-TASK>
	setTimeout 1 [ and schedule promise 3, promise 4 as micro task, and schedule timeout2 as 2-TASK after previous interval]
	promise 3
	promise 4
	<MICROTASK empty>
	<run 2-TASK>
	setInterval [ and schedule a new interval after timeout in 3-TASK queue]
	setTimeout 2
	promise 5
	promise 6
	clearInterval
	
```



https://www.quora.com/What-is-the-difference-between-Node-js-front-end-and-Node-js-server-side

https://stackoverflow.com/questions/41247687/how-to-deploy-separated-frontend-and-backend

 

REACTJS

https://pro.ant.design/

 

Redux 

Sass

Jsx

 

npm install geoip-lite

npm install smoothie

 

 

nodejs部署

process.env.PORT

https://github.com/tjanczuk/iisnode/issues/282

 

http://cnodejs.org/topic/5775d5af0b982e0450b74649

 

https://github.com/sheila1227/FE-blog/issues/1

 

https://yq.aliyun.com/articles/80217

 

https://segmentfault.com/a/1190000009368204

## online install
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm -v
nvm install 17

```
## offline install

```
tar xvf node-v16.17.0-linux-x64.tar.xz
vim /etc/profile.d/nodejs.sh:
#!/bin/sh
export PATH=/opt/node-v12.16.2-linux-s390x/bin:$PATH
```

## PM2

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

https://pm2.keymetrics.io/docs/usage/application-declaration/

### install

**online:**

npm install pm2 -g

**offline:**

Download pm2 package here: https://github.com/Unitech/pm2/releases (current used in production v4.4)

if install on offline vm, need to run 'npm install ' inside the pm2 folder first on a online machine to generate the node_modules, and then upload to the offline vm

```
Check npm install path:
npm config get prefix

copy the pm2 package to node_module path, unzip and create soft link:
cp -p pm2.tar.gz /usr/local/lib/nodejs/node-v16.15.0-linux-x64/lib/node_modules/
cd /usr/local/lib/nodejs/node-v16.15.0-linux-x64/lib/node_modules/ 
tar -xzvf pm2.tar.gz
ln -s /usr/local/lib/nodejs/node-v16.15.0-linux-x64/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2

Test if pm2 installed successfully:
su - express
pm2 -v
## if use root to execute pm2 -v, there will be a pm2 process running under root
```

**Updating PM2**
```
# Install latest PM2 version
$ npm install pm2@latest -g
# Save process list, exit old PM2 & restore all processes
$ pm2 update
```

### run app

#### Basic
```
// normal mode:
pm2 start app.js

// cluster mode that will leverage all CPUs available:
$ pm2 start api.js -i <processes> //<processes> can be 'max', -1 (all cpu minus 1) or a specified number of instances to start.

pm2 ls

$ pm2 stop     <app_name|namespace|id|'all'|json_conf>
$ pm2 restart  <app_name|namespace|id|'all'|json_conf>
$ pm2 delete   <app_name|namespace|id|'all'|json_conf>

Hot Reload allows to update an application without any downtime:

$ pm2 reload all

To have more details on a specific application:

$ pm2 describe <id|app_name>

Startup Scripts Generation
PM2 can generate and configure a Startup Script to keep PM2 and your processes alive at every server restart.

Init Systems Supported: systemd, upstart, launchd, rc.d

# Generate Startup Script
$ pm2 startup

# Freeze your process list across server restart
$ pm2 save

# Remove Startup Script
$ pm2 unstartup

```
#### Config
```
When managing multiple applications with PM2, use a JS configuration file to organize them.

Generate configuration
To generate a sample configuration file you can type this command:

$ pm2 init simple
This will generate a sample ecosystem.config.js:

module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }]
}
If you are creating your own configuration file, make sure it ends with .config.js so PM2 is able to recognize it as a configuration file.

Acting on Configuration File
Seamlessly than acting on an app you can start/stop/restart/delete all apps contained in a configuration file:

# Start all applications
pm2 start ecosystem.config.js

pm2 startOrGracefulReload ecosystem.config.js --env test --update-env

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
Act on a specific process
You can also act on a particular application by using its name and the option --only <app_name>:

pm2 start   ecosystem.config.js --only api-app
Note: the --only option works for start/restart/stop/delete as well

You can even specify multiple apps to be acted on by specifying each app name separated by a comma:

pm2 start ecosystem.config.js --only "api-app,worker-app"
Switching environments
You can specify different environment variable set via the env_* option.

Example:

module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
Now to switch between variables in different environment, specify the --env [env name] option:

pm2 start process.json --env production
pm2 restart process.json --env development
```

#### Monitor
```
To monitor logs, custom metrics, application information:
$ pm2 monit

PM2 allows to monitor your host/server vitals with a monitoring speedbar.

To enable host monitoring:

$ pm2 set pm2:sysmonit true
$ pm2 update

To consult logs just type the command:

$ pm2 logs

Standard, Raw, JSON and formated output are available.

Examples:

$ pm2 logs APP-NAME       # Display APP-NAME logs
$ pm2 logs --json         # JSON output
$ pm2 logs --format       # Formated output

$ pm2 flush               # Flush all logs
$ pm2 reloadLogs          # Reload all logs
To enable log rotation install the following module

$ pm2 install pm2-logrotate
```

[Discover the monitoring dashboard for PM2](https://app.pm2.io/)

## NextJs
```
npx create-next-app@latest my-nextjs-app

npm install next

/pages/api/test/index.js

npm run build
npm run start

 curl -s  http://127.0.0.1:3000/api/airdrop
```
## troubleshooting

### nodejs version 18 开始有改动
```
$ node -v
node: /lib64/libm.so.6: version `GLIBC_2.27' not found (required by node)
node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by node)
node: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by node)
node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by node)
node: /lib64/libc.so.6: version `GLIBC_2.28' not found (required by node)
node: /lib64/libc.so.6: version `GLIBC_2.25' not found (required by node)
[rapidapi@vultr ~]$ strings /lib64/libc.so.6 | grep GLIBC

```
### install phantomjs

缘由是安装安全工具:webscreenshot和snapper,其实正确的指引就在

https://github.com/lyhistory/webscreenshot/wiki/PhantomJS-installation

刚开始没发现,所以经历下面过程:

https://www.npmjs.com/package/phantomjs

```
npm ERR! code 1
npm ERR! path /usr/local/lib/node_modules/phantomjs
npm ERR! command failed
npm ERR! command sh -c node install.js
npm ERR! Considering PhantomJS found at /usr/local/bin/phantomjs
npm ERR! Looks like an `npm install -g`
npm ERR! Error checking path, continuing Error: Cannot find module '/usr/local/lib/node_modules/phantomjs/lib/location'
npm ERR! Require stack:
npm ERR! - /usr/local/lib/node_modules/phantomjs/install.js
npm ERR!     at Function.Module._resolveFilename (internal/modules/cjs/loader.js:831:15)
npm ERR!     at Function.Module._load (internal/modules/cjs/loader.js:687:27)
npm ERR!     at Module.require (internal/modules/cjs/loader.js:903:19)
npm ERR!     at require (internal/modules/cjs/helpers.js:74:18)
npm ERR!     at getLocationInLibModuleIfMatching (/usr/local/lib/node_modules/phantomjs/install.js:332:19)
npm ERR!     at Promise._successFn (/usr/local/lib/node_modules/phantomjs/install.js:389:28)
npm ERR!     at nextTickCallback (/usr/local/lib/node_modules/phantomjs/node_modules/kew/kew.js:47:28)
npm ERR!     at processTicksAndRejections (internal/process/task_queues.js:79:11) {
npm ERR!   code: 'MODULE_NOT_FOUND',
npm ERR!   requireStack: [ '/usr/local/lib/node_modules/phantomjs/install.js' ]
npm ERR! }
npm ERR! Phantom installation failed TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
npm ERR!     at validateString (internal/validators.js:120:11)
npm ERR!     at Object.join (path.js:1039:7)
npm ERR!     at findSuitableTempDirectory (/usr/local/lib/node_modules/phantomjs/install.js:127:30)
npm ERR!     at /usr/local/lib/node_modules/phantomjs/install.js:476:19
npm ERR!     at nextTickCallback (/usr/local/lib/node_modules/phantomjs/node_modules/kew/kew.js:47:28)
npm ERR!     at processTicksAndRejections (internal/process/task_queues.js:79:11) {
npm ERR!   code: 'ERR_INVALID_ARG_TYPE'
npm ERR! } TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
npm ERR!     at validateString (internal/validators.js:120:11)
npm ERR!     at Object.join (path.js:1039:7)
npm ERR!     at findSuitableTempDirectory (/usr/local/lib/node_modules/phantomjs/install.js:127:30)
npm ERR!     at /usr/local/lib/node_modules/phantomjs/install.js:476:19
npm ERR!     at nextTickCallback (/usr/local/lib/node_modules/phantomjs/node_modules/kew/kew.js:47:28)
npm ERR!     at processTicksAndRejections (internal/process/task_queues.js:79:11)

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2021-01-01T08_03_17_613Z-debug.log
```

fix也没用

sudo npm audit fix

最后使用手动安装的方式,参考:

https://gist.github.com/julionc/7476620

```
sudo apt-get update
sudo apt-get install build-essential chrpath libssl-dev libxft-dev
sudo apt-get install libfreetype6 libfreetype6-dev
sudo apt-get install libfontconfig1 libfontconfig1-dev
cd ~
export PHANTOM_JS="phantomjs-1.9.8-linux-x86_64"
wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2
sudo tar xvjf $PHANTOM_JS.tar.bz2
sudo mv $PHANTOM_JS /usr/local/share
sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin
```

测试 phantomjs --version 在kali上出现:

```
139743462616704:error:25066067:DSO support routines:DLFCN_LOAD:could not load the shared
```

**Solution:**

http://ubuntuhowtoo.blogspot.com/2019/05/linux-nodejs-phantomjs-error-loading.html

open `/etc/ssl/openssl.cnf` and comment out the line under `[default_conf]` (it is at the end of the config file):
`#ssl_conf = ssl_sect`



http://www.w3cschool.cc/nodejs
http://www.nodejs.org/
http://www.nodebeginner.org/index-zh-cn.html
https://channel9.msdn.com/Series/Building-Apps-with-Node-js?WT.mc_id=12833-DEV-sitepoint-othercontent

https://www.tutorialsteacher.com/nodejs/nodejs-tutorials

<disqus/>