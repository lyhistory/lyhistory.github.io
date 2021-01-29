## 简介

Nginx 和 Apache 各有什么优缺点？ https://www.zhihu.com/question/19571087

## 安装

https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/

包安装：yum install apt install

手动按照：

[PCRE](http://pcre.org/) – Supports regular expressions. Required by the NGINX [Core](https://nginx.org/en/docs/ngx_core_module.html) and [Rewrite](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html) modules.

```
$ wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.44.tar.gz
$ tar -zxf pcre-8.44.tar.gz
$ cd pcre-8.44
$ ./configure
$ make
$ sudo make install
```

[zlib](https://www.zlib.net/) – Supports header compression. Required by the NGINX [Gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html) module.

```
$ wget http://zlib.net/zlib-1.2.11.tar.gz
$ tar -zxf zlib-1.2.11.tar.gz
$ cd zlib-1.2.11
$ ./configure
$ make
$ sudo make install
```

[OpenSSL](https://www.openssl.org/) – Supports the HTTPS protocol. Required by the NGINX [SSL](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) module and others.

```
方法一：
$ wget http://www.openssl.org/source/openssl-1.1.1g.tar.gz
$ tar -zxf openssl-1.1.1g.tar.gz
$ cd openssl-1.1.1g
$ ./Configure darwin64-x86_64-cc --prefix=/usr
$ make
$ sudo make install

方法二：
yum -y install pcre  pcre-devel zlib  zlib-devel openssl openssl-devel
```



nginx

```
$ wget https://nginx.org/download/nginx-1.18.0.tar.gz
$ tar zxf nginx-1.18.0.tar.gz
$ cd nginx-1.18.0

如果使用前面openssl方法一：
# ./configure --with-http_ssl_module --with-openssl=/opt/openssl-1.0.0s
方法二：
# ./configure --with-http_ssl_module

# make
# sudo make install

# vim /usr/local/nginx/conf/nginx.conf

worker_processes  8;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        rewrite ^(.*)https://$server_name$1 permanent;
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

启动
$ /usr/local/nginx/sbin/nginx
停止
$ /usr/local/nginx/sbin/nginx -s quit
重启
$ /usr/local/nginx/sbin/nginx -s reload

```

/usr/local/nginx/conf/nginx.conf

/usr/local/nginx/html

/usr/local/nginx/sbin/nginx

## 语法

```
--- 变量 Variables
https://nginx.org/en/docs/varindex.html
The $http_upgrade use the value from client header upgrade, in nginx conf, $http_HEADER get the HEADER from client.

--- map
map $args $foo {
    default 0;
    debug   1;
}
$args 是nginx内置变量，就是获取的请求 url 的参数。 如果 $args 匹配到 debug 那么 $foo 的值会被设为 1 ，如果 $args 一个都匹配不到 $foo 就是default 定义的值，在这里就是 0
https://www.cnblogs.com/cangqinglang/p/12174407.html
```



## 配置

### HTTPS

官方：

https://nginx.org/en/docs/http/configuring_https_servers.html

centos：

https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-centos-7

Ubuntu：

https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

如果前面安装的时候忘记添加openssl模块

```
 ./configure --with-http_ssl_module --with-openssl=/opt/openssl-1.0.0s
```

可以动态添加：

https://www.cnblogs.com/zoulixiang/p/10196671.html

即按照前面的方法安装openssl并执行 config，之后执行make，但是不要执行make install，直接覆盖新编译的nginx

```
cp /usr/local/nginx/sbin/nginx nginx.bk
cp /nginx  /usr/local/nginx/sbin/nginx 
```

生成nginx秘钥（生产环境需要购买正版）

```
---------------------------------------------------------------------------------
--- 这是一种方法
---------------------------------------------------------------------------------
First, you should have a non-root user configured with sudo privileges

sudo mkdir /etc/ssl/privatekey
sudo chmod 700 /etc/ssl/privatekey
 
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/privatekey/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt

Country Name (2 letter code) [XX]:SG
State or Province Name (full name) []:
Locality Name (eg, city) [Default City]:
Organization Name (eg, company) [Default Company Ltd]:APEX
Organizational Unit Name (eg, section) []:IT
Common Name (eg, your name or your server's hostname) []:10.136.100.48
Email Address []:tech-mgmt@asiapacificex.com

-nodes: This tells OpenSSL to skip the option to secure our certificate with a passphrase. We need Nginx to be able to read the file, without user intervention, when the server starts up. A passphrase would prevent this from happening because we would have to enter it after every restart.
-newkey rsa:2048: This specifies that we want to generate a new certificate and a new key at the same time. We did not create the key that is required to sign the certificate in a previous step, so we need to create it along with the certificate. The rsa:2048 portion tells it to make an RSA key that is 2048 bits long.

创建一个跟客户端进行key exchange协商的秘钥：
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

---------------------------------------------------------------------------------
--- 这是另一种方法
---------------------------------------------------------------------------------

1. 使用root用户登录，生成一个ssl.key，命令如下
# openssl genrsa -des3 -out ssl.key 1024
2.输入密码，密码输入后再删除，命令如下
# mv ssl.key xxx.key
# openssl rsa -in xxx.key -out ssl.key
# rm xxx.key
3.根据生成的ssl.key再生成证书请求文件，命令如下
# openssl req -new -key ssl.key -out ssl.csr
4.按提示输入信息，可随便输入
5.根据这两个文件生成最终的crt证书文件，命令如下
# openssl x509 -req -days 3650 -in ssl.csr -signkey ssl.key -out ssl.crt
6.拷贝文件至/usr/local/nginx/conf目录中
# cp ssl.key /usr/local/nginx/conf
# cp ssl.crt /usr/local/nginx/conf

```



```
sudo vim /usr/local/nginx/conf/nginx.conf:
include /usr/local/nginx/conf/ssl.conf

sudo vim /usr/local/nginx/conf/ssl.conf:

---------------------------------------------------------------------------------
--- 同时支持http https
---------------------------------------------------------------------------------

server {
	listen       80;
    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;

    server_name server_IP_address;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/privatekey/nginx-selfsigned.key;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
}

---------------------------------------------------------------------------------
--- 强制 https
---------------------------------------------------------------------------------
server {
        listen       80;
        server_name  test.local;
		rewrite ^/(.*) https://$server_name$request_uri? permanent;
	}
	
sudo /usr/local/nginx/sbin/nginx -t
```

### WSS

https://nginx.org/en/docs/http/websocket.html

By default, the connection will be closed if the proxied server does not transmit any data within 60 seconds. This timeout can be increased with the [proxy_read_timeout](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) directive. Alternatively, the proxied server can be configured to periodically send WebSocket ping frames to reset the timeout and check if the connection is still alive.

```
--------------------------------------------------------------
--- 标准设置
--------------------------------------------------------------
location /chat/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

--------------------------------------------------------------
--- 自定义变量
--------------------------------------------------------------
http {
    map $http_upgrade $connection_upgrade {
        default upgrade; //如果client发生request的header含有Upgrade，则赋值变量connection_upgrade=upgrade
        ''      close;	 //否则则赋值变量connection_upgrade=close
    }

    server {
        ...

        location /chat/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade; //使用上面map的变量
        }
    }
    
```



### 其他

enable list files : autoindex on 注意location写法

```
server {
        listen        80;
        server_name  ctf.local;
        root   "E:/workspace/WWW/ctf.local";
        location / {
            index index.php index.html error/index.html;
            error_page 400 /error/400.html;
            error_page 403 /error/403.html;
            error_page 404 /error/404.html;
            autoindex  off;
        }
        location ~ \.php(.*)$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_split_path_info  ^((?U).+\.php)(/?.+)$;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            fastcgi_param  PATH_INFO  $fastcgi_path_info;
            fastcgi_param  PATH_TRANSLATED  $document_root$fastcgi_path_info;
            include        fastcgi_params;
        }
        location ~ /.* {
            autoindex on;
        }
}

```

internal

https://www.cnblogs.com/lowmanisbusy/p/11718345.html

Nginx常见基本配置---upstream 使用指南

https://blog.csdn.net/LL845876425/article/details/97621365



what is the difference between proxy_request_buffering and proxy_buffering on nginx?

https://serverfault.com/questions/741610/what-is-the-difference-between-proxy-request-buffering-and-proxy-buffering-on-ng



**切换 root路径 从默认的相对路径 到 绝对路径**

出现 (13: permission denied)

https://stackoverflow.com/questions/25774999/nginx-stat-failed-13-permission-denied

方法一 更改默认用户为root

```
user  root;
worker_processes  1;
```

方法二 添加文件权限给这个用户nobody或者将用户加到相应group

```
user  nobody;
worker_processes  1;
```



windows path

```
location /test {
			alias "C:/Workspace/task/setup/nginx-1.17.6/conf/test/";
		}
```

