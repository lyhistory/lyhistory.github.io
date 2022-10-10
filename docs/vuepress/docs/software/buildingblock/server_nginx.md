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


locate actually using config:
nginx -t

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

### rewirte
break last permnant
https://serverfault.com/questions/379675/nginx-reverse-proxy-url-rewrite

### proxy_pass or proxy_redirect


port_in_redirect 

https://blog.51cto.com/miaocbin/1893701

https://stackoverflow.com/questions/59852217/nginx-proxy-pass-or-proxy-redirect

https://stackoverflow.com/questions/17738088/rewrite-root-address-to-a-subdirectory-in-nginx

https://stackoverflow.com/questions/15414810/whats-the-difference-of-host-and-http-host-in-nginx

设置了 proxy_pass target_ip:port 后，nginx默认会将 host header值设置为 proxy_host即target_ip:port，
如果 target_ip:port对应的服务对这个header没有检查要求则不重要，否则可能会有问题，比如：
https://stackoverflow.com/questions/14352690/change-host-header-in-nginx-reverse-proxy
https://serverfault.com/questions/598202/make-nginx-to-pass-hostname-of-the-upstream-when-reverseproxying
https://stackoverflow.com/questions/5834025/how-to-preserve-request-url-with-nginx-proxy-pass

$http_host equals always the HTTP_HOST request header.
$host equals $http_host, lowercase and without the port number (if present), except when HTTP_HOST is absent or is an empty value. In that case, $host equals the value of the server_name directive of the server which processed the request.

https://stackoverflow.com/questions/73169860/proxy-pass-forward-request-to-specific-server-according-to-the-host-header-on

https://crashtest-security.com/invalid-host-header/

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
Common Name (eg, your name or your server's hostname) []:x.x.x.48
Email Address []:tech-mgmt@asiapacificex.com

-nodes: This tells OpenSSL to skip the option to secure our certificate with a passphrase. We need Nginx to be able to read the file, without user intervention, when the server starts up. A passphrase would prevent this from happening because we would have to enter it after every restart.
-newkey rsa:2048: This specifies that we want to generate a new certificate and a new key at the same time. We did not create the key that is required to sign the certificate in a previous step, so we need to create it along with the certificate. The rsa:2048 portion tells it to make an RSA key that is 2048 bits long.

创建一个跟客户端进行key exchange协商的秘钥：
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048 # nginx默认采用1024位的diffie-hellman，强度太低不安全

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



#### 优化

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

https://mikemiao.com/nginx%E5%A2%9E%E5%BC%BAhttps%E5%AE%89%E5%85%A8%E9%85%8D%E7%BD%AE/

https://gist.github.com/fotock/9cf9afc2fd0f813828992ebc4fdaad6f

```
server {
  listen 443 ssl http2;
  server_name www.example.com;
  ssl on;
  ssl_certificate /etc/ssl/certs/ssl-bundle.crt;#证书文件
  ssl_certificate_key /etc/ssl/private/www_example_com.key;#私钥
  ssl_dhparam /etc/ssl/certs/dhparam.pem;#刚刚生成的那个pem文件的路径
  ssl_session_cache shared:SSL:10m;#开启缓存，有利于减少ssl握手开销
  ssl_session_timeout 10m;#SSL会话过期时间，有利于减少服务器开销
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;#指定可用的ssl协议，排除sslV3等容易被攻击的协议
  ssl_stapling on;#开启证书吊销状态检查
  ssl_trusted_certificate  /etc/ssl/certs/ssl-bundle.crt;#这个证书路径跟上面一样
  ssl_ciphers "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA";#屏蔽不安全的加密方式
  ssl_prefer_server_ciphers on;
  add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";#开启HSTS，强制全站加密，如果你的网站要引用不加密的资源，或者考虑将来取消加密，就不要开这个
  location / {
    ……………………
  }
}
```



#### client端验证

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

利用 proxy_ pass可以将请求代理到后端服务器，如果需要指向多台服务器就要用到 ngx_ http_ upstream_ module。它为反向代理提供了负载均衡及故障转移等重要功能。

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
  + nginx plus实际上也是基于keepalived实现的：
  +  https://docs.nginx.com/nginx/admin-guide/high-availability/ha-keepalived-nodes/
+ heartbeat、corosync、pacemaker

### keepalived + nginx高可用模式

1）Nginx+keepalived active‑passive 双机主从模式：即前端使用两台服务器，一台主服务器和一台热备服务器，正常情况下，主服务器绑定一个公网虚拟IP，提供负载均衡服务，热备服务器处于空闲状态；当主服务器发生故障时，热备服务器接管主服务器的公网虚拟IP，提供负载均衡服务；但是热备服务器在主机器不出现故障的时候，永远处于浪费状态，对于服务器不多的网站，该方案不经济实惠。

2）Nginx+keepalived 双机主主模式：即前端使用两台负载均衡服务器，互为主备，且都处于活动状态，同时各自绑定一个公网虚拟IP，提供负载均衡服务；当其中一台发生故障时，另一台接管发生故障服务器的公网虚拟IP（这时由非故障机器一台负担所有的请求）。



1. 增加dns， 域名解析到virtual ip上，然后访问域名，先解析到virtual ip，然后keepalived决定解析到哪台机器上，那么两台机器可以装同一个https证书
2. 通过weight自动调整，默认是负载均衡？默认的双活可否设置为热备或冷备

https://segmentfault.com/a/1190000016294818

https://blog.csdn.net/u012599988/article/details/82152224

https://blog.csdn.net/super_lixiang/article/details/82707805

### keepalived 配置

以机器x.x.x.48和x.x.x.49为举例

```
-------------------------------------------------------------------------------
1.	两台服务都安装nginx和keepalived
-------------------------------------------------------------------------------
yum install nginx
yum install keepalived

-------------------------------------------------------------------------------
2．修改Nginx配置文件
-------------------------------------------------------------------------------
Nginx配置文件
/etc/nginx/conf.d/health.conf
server {
    listen       8000;
    server_name  localhost;
    default_type text/html;
    return 200 'Health';
}

ip addr show eth0 | grep '10.' | awk '{print $2}' > /usr/share/nginx/html/index.html

-------------------------------------------------------------------------------
3. nginx check linux scripts
-------------------------------------------------------------------------------
vim /etc/keepalived/scripts/check_nginx.sh
#!/bin/bash
set -x
timeout=30

if [ `ps -C nginx --no-header |wc -l` -eq 0 ];then
    echo "$(date) nginx pid not found">>/etc/keepalived/keepalived.log
    #keepalived stop
    killall keepalived
    exit 1
fi

if [ -n ${timeout} ];then
    httpcode=`curl -sL -w %{http_code} -m ${timeout} http://localhost:8000 -o /dev/null`
else
    httpcode=`curl -sL -w %{http_code}  http://localhost:8000 -o /dev/null`
fi

if [ ${httpcode} -ne 200 ];then
    echo `date`':  nginx is not healthy, return http_code is '${httpcode} >> /etc/keeperalived/keepalived.log
    killall keepalived
    exit 1
else
    exit 0
fi

-------------------------------------------------------------------------------
4. 修改keepalived配置文件
-------------------------------------------------------------------------------
Vi  /etc/keepalived/keepalived.conf

! Configuration File for keepalived

global_defs {
   notification_email {	#指定keepalived在发生事件时(比如切换)发送通知邮件的邮箱
     test@firewall.loc	设置报警邮件地址，可以设置多个，每行一个。 需开启本机的sendmail服务
   }
   notification_email_from test@firewall.loc #keepalived在发生诸如切换操作时需要发送email通知地址
   smtp_server 192.168.200.1	#指定发送email的smtp服务器
   smtp_connect_timeout 30
   router_id LVS_BACKUPS	#运行keepalived的机器的一个标识，通常可设为hostname。故障发生时，发邮件时显示在邮件主题中的信息。
}

vrrp_script check_run { #检测nginx服务是否在运行。有很多方式，比如进程，用脚本检测等等
    script "/etc/keepalived/scripts/check_nginx.sh" #这里通过脚本监测
    interval 300  #脚本执行间隔 300秒
    weight -5                    #脚本结果导致的优先级变更，检测失败（脚本返回非0）则优先级 -5
    fall 2                    #检测连续2次失败才算确定是真失败。会用weight减少优先级（1-255之间）
    rise 1                    #检测1次成功就算成功。但不修改优先级
}

vrrp_instance VI_1 { #keepalived在同一virtual_router_id中priority（0-255）最大的会成为master，也就是接管VIP，当priority最大的主机发生故障后次priority将会接管
    state MASTER	#指定keepalived的角色，MASTER表示此主机是主服务器，BACKUP表示此主机是备用服务器。注意这里的state指定instance(Initial)的初始状态，就是说在配置好后，这台服务器的初始状态就是这里指定的，但这里指定的不算，还是得要通过竞选通过优先级来确定。如果这里设置为MASTER，但如若他的优先级不及另外一台，那么这台在发送通告时，会发送自己的优先级，另外一台发现优先级不如自己的高，那么他会就回抢占为MASTER
    interface eth0	#指定HA监测网络的接口。实例绑定的网卡，因为在配置虚拟IP的时候必须是在已有的网卡上添加的
    # mcast_src_ip x.x.x.48 # 发送多播数据包时的源IP地址，这里注意了，这里实际上就是在哪个地址上发送VRRP通告，这个非常重要，一定要选择稳定的网卡端口来发送，这里相当于heartbeat的心跳端口，如果没有设置那么就用默认的绑定的网卡的IP，也就是interface指定的IP地址
    virtual_router_id 51	#虚拟路由标识，这个标识是一个数字，同一个vrrp实例使用唯一的标识。即同一vrrp_instance下，MASTER和BACKUP必须是一致的
    priority 101	#定义优先级，数字越大，优先级越高，在同一个vrrp_instance下，MASTER的优先级必须大于BACKUP的优先级
    advert_int 1	#设定MASTER与BACKUP负载均衡器之间同步检查的时间间隔，单位是秒
    authentication {	#设置验证类型和密码。主从必须一样
        auth_type PASS	#设置vrrp验证类型，主要有PASS和AH两种
        auth_pass 1111	#设置vrrp验证密码，在同一个vrrp_instance下，MASTER与BACKUP必须使用相同的密码才能正常通信
    }
	track_script { #执行监控的服务。注意这个设置不能紧挨着写在vrrp_script配置块的后面，否则nginx监控失效！！        	
        check_run	#引用VRRP脚本，即在 vrrp_script 部分指定的名字。定期运行它们来改变优先级，并最终引发主备切换。     
    }
    virtual_ipaddress {	#VRRP HA 虚拟地址 如果有多个VIP，继续换行填写
        x.x.x.44
    }
}

virtual_server x.x.x.44 443 {
    delay_loop 6
    lb_algo rr
    lb_kind NAT
    nat_mask 255.255.255.0
    persistence_timeout 50
    protocol TCP

    real_server x.x.x.48 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
   
    real_server x.x.x.49 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
}

在x.x.x.49上，只需要改变:
state MASTER -> state BACKUP，priority 101 -> priority 100，mcast_src_ip x.x.x.48 -> mcast_src_ip x.x.x.49即可。


-------------------------------------------------------------------------------
5. 启动
-------------------------------------------------------------------------------

systemctl start keepalived

ip addr show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP qlen 1000
    link/ether 56:6f:18:fa:00:08 brd ff:ff:ff:ff:ff:ff
    inet x.x.x.49/24 brd x.x.x.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet x.x.x.44/32 scope global eth0
       valid_lft forever preferred_lft forever

再启动另外一个机器的keepalived，执行 ip addr show eth0 并不会有类似上面的输出，除非是在前面的机器上执行 systemctl stop keepalived

某台机器被选中的时候会出现如下日志，/var/log/messages ：

Jun 15 17:01:08 vm2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Transition to MASTER STATE
Jun 15 17:01:09 vm2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Entering MASTER STATE
Jun 15 17:01:09 vm2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) setting protocol VIPs.
Jun 15 17:01:09 vm2-devclr-v08 Keepalived_vrrp[4850]: Sending gratuitous ARP on eth0 for x.x.x.44
Jun 15 17:01:09 vm2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Sending/queueing gratuitous ARPs on eth0 for x.x.x.44
Jun 15 17:01:09 vm2-devclr-v08 Keepalived_vrrp[4850]: Sending gratuitous ARP on eth0 for x.x.x.44

-------------------------------------------------------------------------------
5. 状态检测
-------------------------------------------------------------------------------
sudo tcpdump -vvv -n -i eth0 dst 224.0.0.18 and src x.x.x.48
```







### 检测脚本

#### nginx 

该脚本检测ngnix的运行状态，并在nginx进程不存在时尝试重新启动ngnix，如果启动失败则停止keepalived，准备让其它机器接管:

```
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
```


<disqus/>