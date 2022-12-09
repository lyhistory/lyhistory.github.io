---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---



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

## offline install

```
tar xvf node-v16.17.0-linux-x64.tar.xz
vim /etc/profile.d/nodejs.sh:
#!/bin/sh
export PATH=/opt/node-v12.16.2-linux-s390x/bin:$PATH
```

## troubleshooting

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

<disqus/>