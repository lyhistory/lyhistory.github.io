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


