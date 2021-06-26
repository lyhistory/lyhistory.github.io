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

### keepalived 

Keepalived是一个基于VRRP协议-Virtual Router Redundancy Protocol 来实现的服务高可用方案

VRRP:

VRRP全称 Virtual Router Redundancy Protocol，即 虚拟路由冗余协议。可以认为它是实现路由器高可用的容错协议，即将N台提供相同功能的路由器组成一个路由器组(Router Group)，这个组里面有一个master和多个backup，但在外界看来就像一台一样，构成虚拟路由器，拥有一个虚拟IP（vip，也就是路由器所在局域网内其他机器的默认路由），占有这个IP的master实际负责ARP相应和转发IP数据包，组中的其它路由器作为备份的角色处于待命状态。master会发组播消息，当backup在超时时间内收不到vrrp包时就认为master宕掉了，这时就需要根据VRRP的优先级来选举一个backup当master，保证路由器的高可用。

在VRRP协议实现里，虚拟路由器使用 00-00-5E-00-01-XX 作为虚拟MAC地址，XX就是唯一的 VRID （Virtual Router IDentifier），这个地址同一时间只有一个物理路由器占用。在虚拟路由器里面的物理路由器组里面通过多播IP地址 **224.0.0.18** 来定时发送通告消息。每个Router都有一个 1-255 之间的优先级别，级别最高的（highest priority）将成为主控（master）路由器。通过降低master的优先权可以让处于backup状态的路由器抢占（pro-empt）主路由器的状态，两个backup优先级相同的IP地址较大者为master，接管虚拟IP。



keepalived可以认为是VRRP协议在Linux上的实现，主要有三个模块，分别是core、check和vrrp。core模块为keepalived的核心，负责主进程的启动、维护以及全局配置文件的加载和解析。check负责健康检查，包括常见的各种检查方式。

keepalived工作在TCP/IP 参考模型的 三层、四层、五层，也就是分别为：网络层，传输层和应用层, Layer3,4,5 工作在IP/TCP协议栈的IP层，TCP层，及应用层,原理分别如下：

    Layer3：Keepalived使用Layer3的方式工作式时，Keepalived会定期向服务器群中的服务器发送一个ICMP的数据包（既我们平时用的Ping程序）,如果发现某台服务的IP地址没有激活，Keepalived便报告这台服务器失效，并将它从服务器群中剔除，这种情况的典型例子是某台服务器被非法关机。Layer3的方式是以服务器的IP地址是否有效作为服务器工作正常与否的标准。
    Layer4:如果您理解了Layer3的方式，Layer4就容易了。Layer4主要以TCP端口的状态来决定服务器工作正常与否。如web server的服务端口一般是80，如果Keepalived检测到80端口没有启动，则Keepalived将把这台服务器从服务器群中剔除。
    Layer7：Layer7就是工作在具体的应用层了，比Layer3,Layer4要复杂一点，在网络上占用的带宽也要大一些。Keepalived将根据用户的设定检查服务器程序的运行是否正常，如果与用户的设定不相符，则Keepalived将把服务器从服务器群中剔除。
1.选举策略    

  首先，每个节点有一个初始优先级，由配置文件中的priority配置项指定，MASTER节点的priority应比BAKCUP高。运行过程中keepalived根据vrrp_script的weight设定，增加或减小节点优先级。规则如下：

     当weight > 0时，vrrp_script script脚本执行返回0(成功)时优先级为priority + weight, 否则为priority。当BACKUP发现自己的优先级大于MASTER通告的优先级时，进行主从切换。
     当weight < 0时，vrrp_script script脚本执行返回非0(失败)时优先级为priority + weight, 否则为priority。当BACKUP发现自己的优先级大于MASTER通告的优先级时，进行主从切换。
    当两个节点的优先级相同时，以节点发送VRRP通告的IP作为比较对象，IP较大者为MASTER。

2.priority和weight的设定     

    主从的优先级初始值priority和变化量weight设置非常关键，配错的话会导致无法进行主从切换。比如，当MASTER初始值定得太高，即使script脚本执行失败，也比BACKUP的priority + weight大，就没法进行VIP漂移了。
    所以priority和weight值的设定应遵循: abs(MASTER priority - BAKCUP priority) < abs(weight)。一般情况下，初始值MASTER的priority值应该比较BACKUP大，但不能超过weight的绝对值。 另外，当网络中不支持多播(例如某些云环境)，或者出现网络分区的情况，keepalived BACKUP节点收不到MASTER的VRRP通告，就会出现脑裂(split brain)现象，此时集群中会存在多个MASTER节点。

3.常用命令

    查看当前VIP在哪个节点上： ip addr show|grep "scope global" (查看VIP是否在筛选结果中)  或者 ip addr show|grep <VIP>
    查看日志tail /var/log/messages
    抓包命令：tcpdump -nn vrrp
    可以用这条命令来查看该网络中所存在的vrid：tcpdump -nn -i any net 224.0.0.0/8
    
    解绑VIP：ip addr del <vip> dev <eth0>
    
    绑定VIP：ip addr add <vip> dev <eth0>




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
       |                                     |
+-------------+    				     +-------------+
|    web01    |    				   	 |    web02    |
————————————————   					 ———————————————
```



### keepalived 配置例子

以机器10.136.100.48和10.136.100.49为举例

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
    # mcast_src_ip 10.136.100.48 # 发送多播数据包时的源IP地址，这里注意了，这里实际上就是在哪个地址上发送VRRP通告，这个非常重要，一定要选择稳定的网卡端口来发送，这里相当于heartbeat的心跳端口，如果没有设置那么就用默认的绑定的网卡的IP，也就是interface指定的IP地址
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
        10.136.100.44
    }
}

virtual_server 10.136.100.44 443 {
    delay_loop 6
    lb_algo rr
    lb_kind NAT
    nat_mask 255.255.255.0
    persistence_timeout 50
    protocol TCP

    real_server 10.136.100.48 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
   
    real_server 10.136.100.49 443 {
        weight 3
        TCP_CHECK {
            connect_timeout 3
            nb_get_retry 3
            delay_before_retry 3
        }
    }
}

在10.136.100.49上，只需要改变:
state MASTER -> state BACKUP，priority 101 -> priority 100，mcast_src_ip 10.136.100.48 -> mcast_src_ip 10.136.100.49即可。


-------------------------------------------------------------------------------
5. 启动
-------------------------------------------------------------------------------

systemctl start keepalived

ip addr show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP qlen 1000
    link/ether 56:6f:18:fa:00:08 brd ff:ff:ff:ff:ff:ff
    inet 10.136.100.49/24 brd 10.136.100.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet 10.136.100.44/32 scope global eth0
       valid_lft forever preferred_lft forever

再启动另外一个机器的keepalived，执行 ip addr show eth0 并不会有类似上面的输出，除非是在前面的机器上执行 systemctl stop keepalived

某台机器被选中的时候会出现如下日志，/var/log/messages ：

Jun 15 17:01:08 sgkc2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Transition to MASTER STATE
Jun 15 17:01:09 sgkc2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Entering MASTER STATE
Jun 15 17:01:09 sgkc2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) setting protocol VIPs.
Jun 15 17:01:09 sgkc2-devclr-v08 Keepalived_vrrp[4850]: Sending gratuitous ARP on eth0 for 10.136.100.44
Jun 15 17:01:09 sgkc2-devclr-v08 Keepalived_vrrp[4850]: VRRP_Instance(VI_1) Sending/queueing gratuitous ARPs on eth0 for 10.136.100.44
Jun 15 17:01:09 sgkc2-devclr-v08 Keepalived_vrrp[4850]: Sending gratuitous ARP on eth0 for 10.136.100.44

-------------------------------------------------------------------------------
5. 状态检测
-------------------------------------------------------------------------------
sudo tcpdump -vvv -n -i eth0 dst 224.0.0.18 and src 10.136.100.48
```



配置选项说明：

```
-------------------------------------------------------------------------------
global_defs
-------------------------------------------------------------------------------
    notification_email ： keepalived在发生诸如切换操作时需要发送email通知地址，后面的 smtp_server 相比也都知道是邮件服务器地址。也可以通过其它方式报警，毕竟邮件不是实时通知的。
    router_id ： 机器标识，通常可设为hostname。故障发生时，邮件通知会用到
-------------------------------------------------------------------------------
vrrp_instance
-------------------------------------------------------------------------------
    state ： 指定instance(Initial)的初始状态，就是说在配置好后，这台服务器的初始状态就是这里指定的，但这里指定的不算，还是得要通过竞选通过优先级来确定。如果这里设置为MASTER，但如若他的优先级不及另外一台，那么这台在发送通告时，会发送自己的优先级，另外一台发现优先级不如自己的高，那么他会就回抢占为MASTER
    interface ： 实例绑定的网卡，因为在配置虚拟IP的时候必须是在已有的网卡上添加的
    mcast_src_ip ： 发送多播数据包时的源IP地址，这里注意了，这里实际上就是在那个地址上发送VRRP通告，这个非常重要，一定要选择稳定的网卡端口来发送，这里相当于heartbeat的心跳端口，如果没有设置那么就用默认的绑定的网卡的IP，也就是interface指定的IP地址
    virtual_router_id ： 这里设置VRID，这里非常重要，相同的VRID为一个组，他将决定多播的MAC地址
    priority ： 设置本节点的优先级，优先级高的为master
    advert_int ： 检查间隔，默认为1秒。这就是VRRP的定时器，MASTER每隔这样一个时间间隔，就会发送一个advertisement报文以通知组内其他路由器自己工作正常
    authentication ： 定义认证方式和密码，主从必须一样
    virtual_ipaddress ： 这里设置的就是VIP，也就是虚拟IP地址，他随着state的变化而增加删除，当state为master的时候就添加，当state为backup的时候删除，这里主要是有优先级来决定的，和state设置的值没有多大关系，这里可以设置多个IP地址
    track_script ： 引用VRRP脚本，即在 vrrp_script 部分指定的名字。定期运行它们来改变优先级，并最终引发主备切换。
-------------------------------------------------------------------------------
vrrp_script
-------------------------------------------------------------------------------
告诉 keepalived 在什么情况下切换，所以尤为重要。可以有多个 vrrp_script

    script ： 自己写的检测脚本。也可以是一行命令如killall -0 nginx
    interval 2 ： 每2s检测一次
    weight -5 ： 检测失败（脚本返回非0）则优先级 -5
    fall 2 ： 检测连续 2 次失败才算确定是真失败。会用weight减少优先级（1-255之间）
    rise 1 ： 检测 1 次成功就算成功。但不修改优先级

这里要提示一下script一般有2种写法：

    通过脚本执行的返回结果，改变优先级，keepalived继续发送通告消息，backup比较优先级再决定
    脚本里面检测到异常，直接关闭keepalived进程，backup机器接收不到advertisement会抢占IP

上文 vrrp_script 配置部分，killall -0 nginx属于第1种情况，/etc/keepalived/check_nginx.sh属于第2种情况（脚本中关闭keepalived）。个人更倾向于通过shell脚本判断，但有异常时exit 1，正常退出exit 0，然后keepalived根据动态调整的 vrrp_instance 优先级选举决定是否抢占VIP：

    如果脚本执行结果为0，并且weight配置的值大于0，则优先级相应的增加
    如果脚本执行结果非0，并且weight配置的值小于0，则优先级相应的减少

其他情况，原本配置的优先级不变，即配置文件中priority对应的值。

提示：
    优先级不会不断的提高或者降低
    可以编写多个检测脚本并为每个检测脚本设置不同的weight（在配置中列出就行）
    不管提高优先级还是降低优先级，最终优先级的范围是在[1,254]，不会出现优先级小于等于0或者优先级大于等于255的情况
    在MASTER节点的 vrrp_instance 中 配置 nopreempt ，当它异常恢复后，即使它 prio 更高也不会抢占，这样可以避免正常情况下做无谓的切换

以上可以做到利用脚本检测业务进程的状态，并动态调整优先级从而实现主备切换。
-------------------------------------------------------------------------------
virtual_server
-------------------------------------------------------------------------------
    虚拟服务器，来源vrrp_instance 中配置的 的虚拟IP地址，后面加空格加端口号
-------------------------------------------------------------------------------
virtual_server_group
-------------------------------------------------------------------------------
    用来定义virtual_server 组，一般在超大型的LVS中用到，一般LVS用不过这东西。


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



### keepalive+ngnix 高可用模式

1）Nginx+keepalived active‑passive 双机主从模式：即前端使用两台服务器，一台主服务器和一台热备服务器，正常情况下，主服务器绑定一个公网虚拟IP，提供负载均衡服务，热备服务器处于空闲状态；当主服务器发生故障时，热备服务器接管主服务器的公网虚拟IP，提供负载均衡服务；但是热备服务器在主机器不出现故障的时候，永远处于浪费状态，对于服务器不多的网站，该方案不经济实惠。

2）Nginx+keepalived 双机主主模式：即前端使用两台负载均衡服务器，互为主备，且都处于活动状态，同时各自绑定一个公网虚拟IP，提供负载均衡服务；当其中一台发生故障时，另一台接管发生故障服务器的公网虚拟IP（这时由非故障机器一台负担所有的请求）。



1. 增加dns， 域名解析到virtual ip上？然后访问域名，先解析到virtual ip，然后keepalived决定解析到哪台机器上，那么是否两台机器可以装同一个https证书
2. 通过weight自动调整，默认是负载均衡？默认的双活可否设置为热备或冷备
3. 

https://segmentfault.com/a/1190000016294818

https://blog.csdn.net/u012599988/article/details/82152224

https://blog.csdn.net/super_lixiang/article/details/82707805