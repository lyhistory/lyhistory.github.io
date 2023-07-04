## Mysql server

```
tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
$> sudo yum install mysql-community-{server,client,client-plugins,icu-data-files,common,libs}-*
systemctl start mysqld
$> sudo grep 'temporary password' /var/log/mysqld.log
$> mysql -uroot -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

## wordpress

### Step 1: Download and Extract
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

### Step 2: Download and Extract

For other tools such as Plesk, cPanel, refer the article Creating Database for WordPress.
https://developer.wordpress.org/advanced-administration/before-install/creating-database/
#### Using the MySQL Client

```
$ mysql -u adminusername -p  
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

### Step 3: Set up wp-config.php
You can either create and edit the wp-config.php file yourself, or you can skip this step and let WordPress try to do this itself when you run the installation script (step 5). (you’ll still need to tell WordPress your database information).

(For more extensive details, and step by step instructions for creating the configuration file and your secret key for password security, please see [Editing wp-config.php](https://developer.wordpress.org/advanced-administration/wordpress/wp-config/)).

Return to where you extracted the WordPress package in Step 1, rename the file wp-config-sample.php to wp-config.php, and open it in a text editor.

Enter your database information under the section labeled
```
// ** MySQL settings - You can get this info from your web host ** //
DB_NAME
The name of the database you created for WordPress in Step 2.
DB_USER
The username you created for WordPress in Step 2.
DB_PASSWORD
The password you chose for the WordPress username in Step 2.
DB_HOST
The hostname you determined in Step 2 (usually localhost, but not always; see some possible DB_HOST values). If a port, socket, or pipe is necessary, append a colon (:) and then the relevant information to the hostname.
DB_CHARSET
The database character set, normally should not be changed (see Editing wp-config.php).
DB_COLLATE
The database collation should normally be left blank (see Editing wp-config.php).

Enter your secret key values under the section labeled
/* Authentication Unique Keys and Salts. */
```

## nginx

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


   ## woocommerce
   https://woocommerce.com/posts/woocommerce-pricing/
   
   https://woocommerce.com/storefront/