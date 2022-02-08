---
title: Mysql replication test between different version
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---



Master: mysql5.7
![](/content/images/post/20190519/master1.png)
Slave: mysql8.0
![](/content/images/post/20190519/slave1.png)

# step 1: config master and dump data
conf my.ini And restart:
```
server-id=1
log-bin=mysql-bin
```
create and grant repl user:
```
C:\Program Files\MySQL\MySQL Server 5.7\bin>mysqld -V
mysqld  Ver 5.7.24 for Win64 on x86_64 (MySQL Community Server (GPL))

mysql> CREATE USER 'repl'@'%' IDENTIFIED BY '123456';
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
Query OK, 0 rows affected (0.01 sec)
```
dump existing data
`c:\Program Files\MySQL\MySQL Server 5.7\bin>mysqldump -u repl -p 123456 --all-databases --master-data > dbdump.db`
![](/content/images/post/20190519/master2.png)

# step 2: config slave and import data
conf my.ini And restart:
```
[mysqld]
server-id=2
```
import data:
`mysql -u root -p < dbdump.db`
![](/content/images/post/20190519/slave2.png)

# step 3: unlock tables on master and change master on slave
## On master
```
mysql> UNLOCK TABLES;
Query OK, 0 rows affected (0.00 sec)
```
find out master log file and position:
![](/content/images/post/20190519/master3.png)

## On slave
```
CHANGE MASTER TO MASTER_HOST='192.168.0.141',MASTER_PORT=3306,MASTER_USER='repl',MASTER_PASSWORD='123456',MASTER_LOG_FILE='mysql-bin.000001',MASTER_LOG_POS=52113;

 START SLAVE;
```
![](/content/images/post/20190519/slave3.png)

reference:
https://dev.mysql.com/doc/refman/5.7/en/
https://dev.mysql.com/doc/refman/5.7/en/replication-configuration.html
https://dev.mysql.com/doc/refman/5.7/en/replication-howto-masterbaseconfig.html
https://www.youtube.com/watch?v=u8klgz4BU1A

#promote/change salve to master
https://sysadmin.compxtreme.ro/mysql-promoting-a-slave-to-master/
#switch master
https://mysqlhighavailability.com/mysql-5-7-6-it-is-easier-to-switch-master-now/

