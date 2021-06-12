## 简介

Nginx 和 Apache 各有什么优缺点？ https://www.zhihu.com/question/19571087

Reverse Proxy vs. Load Balancer https://www.nginx.com/resources/glossary/reverse-proxy-vs-load-balancer/



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


Firewalls
sudo firewall-cmd --add-service=http
sudo firewall-cmd --add-service=https
sudo firewall-cmd --runtime-to-permanent
or
sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT


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
Organization Name (eg, company) [Default Company Ltd]:LYHISTORY
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
--- 强制 enforce https
---------------------------------------------------------------------------------
server {
        listen       80;
        server_name  test.local;
		if ($scheme = "http") {
      		return 301 https://$server_name$request_uri;
  		}
	}

下面的方法有时候会报错 redirect too many times：
一种方法
server {
        listen       80;
        server_name  test.local;
		rewrite ^/(.*) https://$server_name$request_uri? permanent;
	}
	
另一种方法
the default Nginx configuration file allows us to easily add directives to the default port 80 server block by adding files in the /etc/nginx/default.d directory. Create a new file called ssl-redirect.conf

vim /etc/nginx/default.d/ssl-redirect.conf：
return 301 https://$host$request_uri/;

sudo /usr/local/nginx/sbin/nginx -t
```



优化

SSL operations consume extra CPU resources. On multi-processor systems several [worker processes](https://nginx.org/en/docs/ngx_core_module.html#worker_processes) should be run, no less than the number of available CPU cores. The most CPU-intensive operation is the SSL handshake. There are two ways to minimize the number of these operations per client: the first is by enabling [keepalive](https://nginx.org/en/docs/http/ngx_http_core_module.html#keepalive_timeout) connections to send several requests via one connection and the second is to reuse SSL session parameters to avoid SSL handshakes for parallel and subsequent connections. The sessions are stored in an SSL session cache shared between workers and configured by the [ssl_session_cache](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache) directive. One megabyte of the cache contains about 4000 sessions. The default cache timeout is 5 minutes. It can be increased by using the [ssl_session_timeout](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_timeout) directive. Here is a sample configuration optimized for a multi-core system with 10 megabyte shared session cache:

```
worker_processes auto;

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen              443 ssl;
        server_name server_IP_address;
        keepalive_timeout   70;

        ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
        ssl_certificate_key /etc/ssl/privatekey/nginx-selfsigned.key;
        ssl_dhparam /etc/ssl/certs/dhparam.pem;
        ...
```



**client端验证**

估计是有些情况下，比如client端是手机app，可能需要安装client端证书，

（或者是自签的证书可以手动安装到浏览器，这样浏览器就不再提醒危险了，对于开发调试意义不大，浏览器可以直接选择相信）

https://www.ktanx.com/blog/p/581

```
**ssl_client_certificate** *file*;
```



### WSS

https://nginx.org/en/docs/http/websocket.html

**proxy_read_timeout** 

By default, the connection will be closed if the proxied server does not transmit any data within 60 seconds. This timeout can be increased with the [proxy_read_timeout](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout) directive. Alternatively, the proxied server can be configured to periodically send WebSocket ping frames to reset the timeout and check if the connection is still alive.

**proxy_connect_timeout**

Default: proxy_connect_timeout 60s;

Defines a timeout for establishing a connection with a proxied server. It should be noted that this timeout cannot usually exceed 75 seconds.

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

?# websocket is closed before the connection is established

网络问题 防火墙

### TCP/UDP

https://blog.csdn.net/jeikerxiao/article/details/87863341

```
Normal:

stream {
    server {
        listen 443;
        proxy_connect_timeout 8s;
    	proxy_timeout 24h;
        proxy_pass admin;
    }

    upstream admin {
        server admin.uim.cloud:443;
    }
}

TCP Load Balancing:
stream {
	upstream mysql_backends {
		server backend1.test.com:3306;
		server backend2.test.com:3306;
	}
	server {
		listen 3306;
		proxy_pass	mysql_backends;
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

## HA 高可用方案

nginx本身的高可用

+ nginx plus 收费
+ Keepalived
+ heartbeat、corosync、pacemaker



Keepalived是一个基于VRRP协议-Virtual Router Redundancy Protocol 来实现的服务高可用方案

keepalived可以认为是VRRP协议在Linux上的实现，主要有三个模块，分别是core、check和vrrp。core模块为keepalived的核心，负责主进程的启动、维护以及全局配置文件的加载和解析。check负责健康检查，包括常见的各种检查方式。

```
                   +-------------+
                   |    uplink   |
                   +-------------+
                          |
                          +
    MASTER            keep|alived         BACKUP
172.101.2.100      172.101.2.99      172.101.2.101
+-------------+    +-------------+    +-------------+
|   nginx01   |----|  virtualIP  |----|   nginx02   |
+-------------+    +-------------+    +-------------+
                          |
       +------------------+------------------+
       |                  |                  |
+-------------+    +-------------+    +-------------+
|    web01    |    |    web02    |    |    web03    |
————————————————
```





```
以机器172.101.2.100和172.101.2.101为举例

1.	两台服务都安装nginx和keepalived

2．修改配置文件
172.101.2.100
Nginx配置文件不用修改，只修改keepalived即可
Vi  /etc/keepalived/keepalived.conf
! Configuration File for keepalived

global_defs {
   notification_email {
     acassen@firewall.loc
     failover@firewall.loc
     sysadmin@firewall.loc
   }
   notification_email_from Alexandre.Cassen@firewall.loc
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   router_id LVS_BACKUPS
}

vrrp_script chk_http_port {
    script "/etc/keepalived/scripts/che_nginx.sh"   #检查nginx进程脚步位置
    interval 1               #1秒钟检查一次
    
}

vrrp_instance VI_1 {
    state BACKUP
    interface bond0
    virtual_router_id 51
    priority 90
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
	    track_script {           
        chk_http_port     #检查脚步的脚步名称，具体看上面vrrp_script chk_http_port
    }
    virtual_ipaddress {
        172.100.2.99
    }
}

virtual_server 172.100.2.99 443 {
    delay_loop 6
    lb_algo rr
    lb_kind NAT
    nat_mask 255.255.255.0
    persistence_timeout 50
    protocol TCP

    real_server 172.101.2.100 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
   
    real_server 172.101.2.101 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
}


其余的配置是keepalived双机集群配置，从keepalived服务172.101.2.100的也是添加修改有注释的地方即可

这样在停掉nginx时会自动将keepalived也停止掉

该脚本检测ngnix的运行状态，并在nginx进程不存在时尝试重新启动ngnix，如果启动失败则停止keepalived，准备让其它机器接管。

/etc/keepalived/check_nginx.sh ：
#!/bin/bash
counter=$(ps -C nginx --no-heading|wc -l)
if [ "${counter}" = "0" ]; then
    /usr/local/bin/nginx
    sleep 2
    counter=$(ps -C nginx --no-heading|wc -l)
    if [ "${counter}" = "0" ]; then
        /etc/init.d/keepalived stop
    fi
fi
你也可以根据自己的业务需求，总结出在什么情形下关闭keepalived，如 curl 主页连续2个5s没有响应则切换：
# curl -IL http://localhost/member/login.htm
# curl --data "memberName=fengkan&password=22" http://localhost/member/login.htm
 
count = 0
for (( k=0; k<2; k++ )) 
do 
    check_code=$( curl --connect-timeout 3 -sL -w "%{http_code}\\n" http://localhost/login.html -o /dev/null )
    if [ "$check_code" != "200" ]; then
        count = count +1
        continue
    else
        count = 0
        break
    fi
done
if [ "$count" != "0" ]; then
#   /etc/init.d/keepalived stop
    exit 1
else
    exit 0
fi
————————————————
版权声明：本文为CSDN博主「IT黑旋风」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u010391029/article/details/52071898
```



