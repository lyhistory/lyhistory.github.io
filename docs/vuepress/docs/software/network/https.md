https secure http

wss secure socket

## SSL/TLS Certificate

refer to 《network.md/tls》

证书类型：

self-sgined certificate：

带密码：spring boot mvc程序

不带密码：ngnix

工具：

keytool

openssl



## Products supporting https

### browser

浏览器自然是全面支持https的，不过不同浏览器的特性不同，比如

chrome是采用了操作系统本身的CA证书链，

而firefox是有完整自己的一套证书，所以对于渗透测试者来说，firefox是首选，因为不需要改变操作系统本身的证书，只需要安装给firefox本身就行了，当然firefox还有个特性是支持proxy，chrome还得装插件才行；

### js http client



### nginx

refer to 《buildingblock/nginx.md》

```
 server {
        listen       80;
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name  localhost;

        ssl_certificate /etc/ssl/certs/clear-selfsigned.crt;
        ssl_certificate_key /etc/ssl/privatekey/clear-selfsigned.key;
        ssl_dhparam /etc/ssl/certs/dhparam.pem;
```



### springboot mvc



### netty

https://blog.csdn.net/invadersf/article/details/80337380



## Basic model: client-server





## Complicated model: separated frontend/backend前后端分离

