rm -rf ~/node_modules/

Centos install

yum install nodejs
yum uninstall nodejs
node -v
npm -v

Upgrade to nodejs8
https://tech.amikelive.com/node-663/quick-tip-installing-nodejs-8-on-centos-7/
yum install epel-release
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum install gcc-c++ make
yum install -y nodejs


windows安装node js
在console运行，会提示找不到module，比如 cannot find module 'request'
只需要执行npm -request即可，如果提示 Error: ENOENT, stat '\AppData\Roaming\npm'
只需要当前目录下创建npm即可
模块系统 Modules
事件 Event
函数 function
路由 route
全局对象 Global Object
http://www.w3cschool.cc/nodejs
http://www.nodejs.org/
http://www.nodebeginner.org/index-zh-cn.html
 
https://channel9.msdn.com/Series/Building-Apps-with-Node-js?WT.mc_id=12833-DEV-sitepoint-othercontent


Windows upgrade npm
npm install -g npm-windows-upgrade npm-windows-upgrade

