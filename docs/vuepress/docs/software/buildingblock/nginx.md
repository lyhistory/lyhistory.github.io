Nginx 和 Apache 各有什么优缺点？ https://www.zhihu.com/question/19571087

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



#### install nginx

https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/

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
$ wget http://www.openssl.org/source/openssl-1.1.1g.tar.gz
$ tar -zxf openssl-1.1.1g.tar.gz
$ cd openssl-1.1.1g
$ ./Configure darwin64-x86_64-cc --prefix=/usr
$ make
$ sudo make install
```

nginx

```
$ wget https://nginx.org/download/nginx-1.18.0.tar.gz
$ tar zxf nginx-1.18.0.tar.gz
$ cd nginx-1.18.0

# ./configure --with-http_ssl_module --with-openssl=/opt/openssl-1.0.0s
# make
# sudo make install

修改配置文件nginx.conf
# cd /usr/local/nginx/conf
# vi nginx.conf (找到对应配置并修改成如下，备注不需要)

worker_processes  8;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    upstream clearingCenter {
        server 172.101.2.100:8080;   备注： 市场前置服务器ip地址
        server 172.101.2.101:8080;   备注： 市场前置服务器ip地址
    }



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
    server {
        listen       443 ssl;
        server_name  localhost;
        ssl_certificate      /usr/local/nginx/conf/ssl.crt;
        ssl_certificate_key  /usr/local/nginx/conf/ssl.key;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
        location ~ /clearingCenter/{
           proxy_pass http://clearingCenter;  
           proxy_redirect off;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";    
        }
}
}

注意：		
在172.100.3.100和172.100.3.101配置nginx时 /usr/local/nginx/conf/nginx.conf中
上面的配置改为：   
 upstream clearingCenter {
        server 172.100.3.100:8080;   备注： 清算中心页面服务器ip地址
        server 172.100.3.101:8080;   备注： 清算中心页面服务器ip地址   
 }
同时在location ~ /clearingCenter/{	XXXXXXXXXXXXXX
}后面添加以下内容
location ~ /sso/{
           proxy_pass http://clearingCenter;  
           proxy_redirect off;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";    
        }


生成nginx秘钥（生产环境需要购买正版）
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
拷贝业务前端程序至nginx
该操作只有172.100.3.100和172.100.3.101的服务器需要。
使用root用户登录，将页面代码clearingCenter_page和sso_page上传至/usr/local/nginx/html中

启停nginx
启动
$ /usr/local/nginx/sbin/nginx
停止
$ /usr/local/nginx/sbin/nginx -s quit
重启
$ /usr/local/nginx/sbin/nginx -s reload

```

