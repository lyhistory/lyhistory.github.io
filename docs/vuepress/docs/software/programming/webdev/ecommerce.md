## VM

```
useradd -G wheel ecommerce -d /home/ecommerce
passwd ecommerce
```

## Mysql server

```
$> tar -xvf  mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar
$> sudo yum localinstall mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
systemctl start mysqld
$> sudo grep 'temporary password' /var/log/mysqld.log
$> mysql -uroot -p<TEMP PASSWORD>
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'New Password';
```

For other tools such as Plesk, cPanel, refer the article Creating Database for WordPress.
https://developer.wordpress.org/advanced-administration/before-install/creating-database/

#### Using the MySQL Client

```
$ mysql -uroot -p<New password>
Enter password:  
Welcome to the MySQL monitor. Commands end with ; or \\g.  
Your MySQL connection id is 5340 to server version: 3.23.54  

Type 'help;' or '\\h' for help. Type '\\c' to clear the buffer.  

mysql> CREATE DATABASE databasename;  
Query OK, 1 row affected (0.00 sec)  

mysql> GRANT ALL PRIVILEGES ON databasename.* TO "wordpressusername"@"hostname"
\-> IDENTIFIED BY "password";  
Query OK, 0 rows affected (0.00 sec)  

mysql> FLUSH PRIVILEGES;  
Query OK, 0 rows affected (0.01 sec)   

mysql> EXIT  
Bye  
```

#### Using phpMyAdmin

phpMyAdmin Users Tab

1.Click Add user.
2.Choose a username for WordPress (‘wordpress’ is good) and enter it in the User name field. (Be sure Use text field: is selected from the dropdown.)
3.Choose a secure password (ideally containing a combination of upper- and lower-case letters, numbers, and symbols), and enter it in the Password field. (Be sure Use text field: is selected from the dropdown.) Re-enter the password in the Re-typefield.
4.Write down the username and password you chose.
5.Leave all options under Global privileges at their defaults.
6.Click Go.
7.Return to the Users screen and click the Edit privileges icon on the user you’ve just created for WordPress.
8.In the Database-specific privileges section, select the database you’ve just created for WordPress under the Add privileges to the following database dropdown, and click Go.
9.The page will refresh with privileges for that database. Click Check All to select all privileges, and click Go.
10.On the resulting page, make note of the host name listed after Server: at the top of the page. (This will usually be localhost.)

## wordpress

### php
```
sudo yum install epel-release yum-utils
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo yum-config-manager --enable remi-php72
sudo yum install php-cli php-fpm php-mysql php-json php-opcache php-mbstring php-xml php-gd php-curl
```

We installed PHP FPM because we will be using Nginx as a web server.

By default PHP FPM will run as user apache on port 9000. We’ll change the user to nginx and switch from TCP socket to Unix socket. To do so open the /etc/php-fpm.d/www.conf file edit the lines highlighted in yellow:
```
...
user = nginx
...
group = nginx
...
listen = /run/php-fpm/www.sock
...
listen.owner = nginx
listen.group = nginx
```

```
sudo chown -R root:nginx /var/lib/php
sudo systemctl enable php-fpm
sudo systemctl start php-fpm
```
### nginx
```
sudo yum install yum-utils

sudo vi /etc/yum.repos.d/nginx.repo
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

sudo yum update

sudo yum install nginx

sudo nginx

curl -I 127.0.0.1
HTTP/1.1 200 OK
Server: nginx/1.23.4
```

### Download and Extract
Download and unzip the WordPress package from wordpress.org/download/.

If you will be uploading WordPress to a remote web server, download the WordPress package to your computer with a web browser and unzip the package.
If you will be using FTP, skip to the next step – uploading files is covered later.
If you have shell access to your web server, and are comfortable using console-based tools, you may wish to download WordPress directly to your web server using wget (or lynx or another console-based web browser) if you want to avoid FTPing:
```
wget https://wordpress.org/latest.tar.gz
Then extract the package using:
tar -xzvf latest.tar.gz
```
The WordPress package will extract into a folder called wordpress in the same directory that you downloaded latest.tar.gz.

```
cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/example.com.conf

vi /etc/nginx/conf.d/example.com.conf

server {
    listen       80;
    server_name  example.com;

    root  /home/ecommerce/example;
    index  index.php;
    #access_log  /var/log/nginx/host.access.log  main;

    #location / {
     # try_files $uri $uri/ =404;
    #}


    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index   index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }


   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }


nginx -s reload

firewall-cmd --add-service=http

firewall-cmd --add-service=https

sudo chown -R nginx: example
#chmod 755 example
#cd example
#find . -type d -exec chmod 755 {} \;  # Change directory permissions rwxr-xr-x
#find . -type f -exec chmod 644 {} \;  # Change file permissions rw-r--r--
```

## install wordpress

Run the Install Script

http://example.com/wp-admin/install.php


## ssl
1. Cloudflare’s Origin CA生成：
cloudflare管理页面=>SSL/TLS=>Origin Server 点击生成证书；
保存证书至 /etc/ssl/cloudflare_cert.pem, 保存key至 /etc/ssl/cloudflare_key.pem

2. SSL/TLS 加密模式改为 Full (strict) 

3. Edge Certificates=>Minimum TLS Version」改为「TLS 1.2」

4. Enable authenticated origin pulls
   确保 Nginx 只接受来自 Cloudflare 服务器的请求，防止任何其他人直接连接到 Nginx 服务器,
   cloudflare管理页面=>SSL/TLS=>Origin Server,打开「Authenticated Origin Pulls」 。
   
   然后[访问该页面](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/),可以找到下载client证书链接:
   [download authenticated_origin_pull_ca.pem](https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem)
   将证书 authenticated_origin_pull_ca.pem 的内容写入到服务器的 /etc/ssl/cloudflare_client.crt 中


```
# Redirect HTTP -> HTTPS
server {
    listen 80;
    server_name www.example.com example.com;

    include snippets/letsencrypt.conf;
    return 301 https://example.com$request_uri;
}

# Redirect WWW -> NON WWW
server {
    listen 443 ssl http2;
    server_name www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    include snippets/ssl.conf;

    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    root /var/www/html/example.com;
    index index.php;

    # SSL parameters
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    include snippets/ssl.conf;
    include snippets/letsencrypt.conf;

    # log files
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index   index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }

}
```

## woocommerce
   https://woocommerce.com/posts/woocommerce-pricing/

   https://woocommerce.com/storefront/

## Set up wp-config.php
You can either create and edit the wp-config.php file yourself, or you can skip this step and let WordPress try to do this itself when you run the installation script (step 5). (you’ll still need to tell WordPress your database information).

(For more extensive details, and step by step instructions for creating the configuration file and your secret key for password security, please see [Editing wp-config.php](https://developer.wordpress.org/advanced-administration/wordpress/wp-config/)).