---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《mysql实用基础》

## 0. Knowledge Base

default storage engine: **InnoDB**

https://dev.mysql.com/doc/refman/5.6/en/innodb-introduction.html

other engine:

**MyISAM**: https://kinsta.com/knowledgebase/convert-myisam-to-innodb/

## 1.Setup 

### 1.1 Install on centos

**Method 1: Using rpm**

**Method 2: Using tar**

```
tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
yum install mysql-community-{server,client,common,libs}-* mysql-5.*­

?#Install error
https://princetonits.com/centos7-mysql-install-fails-due-conflict-libmysqlclient/
yum list installed mariadb\*
yum remove mariadb-libs.x86_64

vim /etc/my.cnf
Bind-address:0.0.0.0
service mysqld stop/start
```

Mysql默认密码：
/var/log/mysqld.log
	A temporary password
https://www.techietown.info/2017/08/mysql-default-root-password-on-centos7/

password policy:
```
mysql -uroot -p
SET PASSWORD = PASSWORD(‘1qaz#EDC’);
SHOW VARIABLES LIKE 'validate_password%';
SET GLOBAL validate_password_length = 6;
SET GLOBAL validate_password_number_count = 0;
SET PASSWORD = PASSWORD(‘123456’);
```
create database:
```
CREATE USER 'newuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON dbname.* TO 'newuser'@'%' identified by 'password';
#GRANT ALL PRIVILEGES ON *.* TO 'newuser'@'localhost';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'root'@'localhost';
SELECT user, host FROM mysql.user;
DROP USER ''@'localhost';

create database dbname;

```

### 1.2 Install on windows

![](/docs/docs_image/software/mysql/mysql01.png)

Setup replication
https://lyhistory.com/mysql_replication/#

### 1.3 Client Tools

**mysql built-in tools:**

mysql

mysqldump

mysqladmin

**3rd party:**

http://sqlfiddle.com/

Dbeaver export mysql
Export without data https://github.com/dbeaver/dbeaver/issues/2176

mysql workbench

## 2. DB Management

### 2.1 mysql-cli

千万不要用双引号，尤其是password，所有的-u -p -e等等后面不要加空格！

```
mysql -uroot -p123456
mysql --login-path=XXXX

mysql_config_editor/login-path
mysql_config_editor print --all
```

grep:
```
pager grep ***
\n
https://stackoverflow.com/questions/10177465/grep-in-mysql-cli-interpretter
```



### 2.2 database management



#### Users & Permissions

[ 'User'@'%' and 'User'@'localhost'](https://stackoverflow.com/questions/11634084/are-users-user-and-userlocalhost-not-the-same)

````
SELECT user,host FROM mysql.user;

SHOW GRANTS FOR 'test'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'test'@'localhost' WITH GRANT OPTION;
REVOKE ALL ON *.* FROM 'test'@'localhost';
flush privileges;

DROP USER 'test'@'localhost';
````



#### Global Status

```
show global variables like '%timeout'; 
show variables like '%engine%';
SHOW VARIABLES LIKE "max_connections";
select @@wait_timeout;
show variables like '%error%';

show global status like '%connection%';
show global status like '%errors%';
show global status like '%thread%';
show processlist;

select * from mysql.user;

show variables like "%time_zone%";
show processlist;
select substring_index(host,':' ,1) as client_ip,Command,Time from information_schema.processlist;
show variables like 'max_connections';
SHOW GLOBAL STATUS LIKE "Threads_connected";
show variables like 'log_error';

use mysql;
SHOW CREATE TABLE innodb_index_stats;
```



#### Security

**disable remote Access**

```
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
FLUSH PRIVILEGES;

my.ini:
[mysqld]
.....
skip-networking

vim /etc/my.cnf
Bind-address:127.0.0.1
service mysqld stop/start
```

**turn off local_infile**

https://dev.mysql.com/doc/refman/8.0/en/load-data-local-security.html

```
SHOW VARIABLES WHERE Variable_name = 'local_infile';
SET GLOBAL local_infile = 'OFF';
```



#### backup&restore

backup https://dev.mysql.com/doc/refman/5.7/en/mysqldump-sql-format.html

基本用法

```
--------------------------------------------------------------
--- all db
--------------------------------------------------------------
mysqldump -uroot -p123456--all-databases > mysqldump_20190524.sql

--------------------------------------------------------------
--- schema only
--------------------------------------------------------------
mysqldump -uXXX -pXXX --no-tablespaces --routines --events --no-data --set-gtid-purged=OFF DBName > schema.sql

mysql -uXXX -pXXX  DBName < schema.sql

--------------------------------------------------------------
--- options
--------------------------------------------------------------
If you used the **–set-gtid-purged=ON** option, you would see the value of the [Global Transaction Identifier’s](http://dev.mysql.com/doc/refman/5.6/en/replication-gtids-concepts.html) (GTID’s):
--
--GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED='';

-routines
Include stored routines (procedures and functions) 
```



脚本：

```
-----------------------------------------------------------------
--- db_backup.sh
-----------------------------------------------------------------
#!/bin/bash
# Shell script to backup MySQL database

# Set variables
V_USER="root"	# DB_USERNAME
V_PASS="123456"	# DB_PASSWORD

V_DBS="db1
db2"

V_DEST="/opt/backup/" # Backup Dest directory
V_DAYS=365 # How many days old files must be to be removed

# Linux bin paths
MYSQL="$(which mysql)"
MYSQLDUMP="$(which mysqldump)"
GZIP="$(which gzip)"

# Create Backup sub-directories
NOW="$(date +"%Y%m%d")"
MBD="$V_DEST/$NOW/mysql"
install -d $MBD


# Archive database dumps
for db in $V_DBS
do
    FILE="$MBD/$db.sql"
    echo "Start to backup $db ...."
    $MYSQLDUMP -u$V_USER -p$V_PASS $db > $FILE
    echo "Done!"
done

# Archive the directory, send mail and cleanup
cd $V_DEST
tar -cf $NOW.tar $NOW
$GZIP -9 $NOW.tar

echo "MySQL backup is completed! Backup name is $NOW.tar.gz"
#echo "MySQL backup is completed! Backup name is $NOW.tar.gz" | mail -s "MySQL backup" $EMAIL
rm -rf $NOW

# Remove old files
find $V_DEST -mtime +$V_DAYS -exec rm -f {} \;

-----------------------------------------------------------------
--- db_restore.sh
-----------------------------------------------------------------
#!/bin/bash - 
# Shell script to restore MySQL database

# Set Variables
V_USER="root"
V_SOURCE="/opt/backup/"

MYSQL="$(which mysql)"
MYSQLADMIN="$(which mysqladmin)"

pushd ${V_SOURCE} &> /dev/null

if [ $# -eq 0 ]
  then
    echo "Please speicifed the date, USAGE:./db_restore 20200101"
    exit 0
fi

# Look for sql.gz files:
if [ "$(ls -A $1.tar.gz 2> /dev/null)" ]  ; then
  echo "sql.gz files found extracting..."
  tar -zxvf $1.tar.gz
else
  echo "target file $1.tar.gz not found in ${V_SOURCE}"
  exit 0
fi
pushd ${V_SOURCE}/$1/mysql &> /dev/null
# Exit when folder doesn't have .sql files:
if [ "$(ls -A *.sql 2> /dev/null | wc -l)" == 0 ]; then
  echo "No *.sql files found in $(pwd)"
  exit 0
fi

# Read mysql root password:
echo -n "Type mysql $V_USER password: "
read -s V_PASS
echo ""


# Get all database list first
DBS="$($MYSQL -u$V_USER -p$V_PASS -Bse 'show databases')"

# Ignore list, won't restore the following list of DB:
SKIP="db2"


# Restore DBs:
for filename in *.sql
do
  dbname=${filename%.sql}
  
  skipdb=-1
  if [ "$SKIP" != "" ]; then
    for ignore in $SKIP
    do
        [ "$dbname" == "$ignore" ] && skipdb=1 || :
        
    done
  fi      

  # If not in ignore list, restore:
  if [ "$skipdb" == "-1" ] ; then
  
    skip_create=-1
    for existing in $DBS
    do      
      [ "$dbname" == "$existing" ] && skip_create=1 || :
    done
  
    if [ "$skip_create" ==  "1" ] ; then 
      echo "Database: $dbname already exist, skiping create"
    else
      echo "Creating DB: $dbname"
      #mysqladmin create $dbname -u $V_USER -p$V_PASS
    fi
    
    echo "Importing DB: $dbname from $filename"
    #mysql $dbname < $filename -u $V_USER -p$V_PASS
  fi    
done

```





#### upgrade 

EXAMPLE: from 5.7.18 to 5.7.26

```
SHOW VARIABLES WHERE Variable_name LIKE "version";

https://dev.mysql.com/doc/refman/5.7/en/upgrading.html
yum list installed | grep "^mysql"

$ yum list installed | grep "^mysql"
Repodata is over 2 weeks old. Install yum-cron? Or run: yum makecache fast
mysql-community-client.x86_64         5.7.18-1.el7                @/mysql-community-client-5.7.18-1.el7.x86_64
mysql-community-common.x86_64         5.7.18-1.el7                @/mysql-community-common-5.7.18-1.el7.x86_64
mysql-community-libs.x86_64           5.7.18-1.el7                @/mysql-community-libs-5.7.18-1.el7.x86_64
mysql-community-server.x86_64         5.7.18-1.el7                @/mysql-community-server-5.7.18-1.el7.x86_64

$ find / -name "mysql" -o -name "mysqld" -type f -print 2>/dev/null
/usr/sbin/mysqld
$ find / -name "mysql" -type d -print 2>/dev/null
/var/lib/mysql
/usr/lib64/mysql
/usr/share/mysql

```

Upgrading MySQL with Directly-Downloaded RPM Packages 
https://dev.mysql.com/doc/refman/5.7/en/updating-direct-rpms.html
https://dev.mysql.com/doc/refman/5.7/en/linux-installation-rpm.html

https://dev.mysql.com/downloads/mysql/

??rpm -qpl mysql-community-server-5.7.26-1.el7.x86_64.rpm
For Red Hat Enterprise Linux/Oracle Linux/CentOS systems:
yum install mysql-community-{server,client,common,libs}-* mysql-5.*­

For Red Hat Enterprise Linux, Oracle Linux, CentOS, and Fedora systems, use the following command to start MySQL:
service mysqld start
mysql-upgrade -uroot -pPassword
Once the server restarts, run mysql_upgrade to check and possibly resolve any incompatibilities between the old data and the upgraded software. mysql_upgrade also performs other functions; see Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables” for details.
If you use replication, review Section 16.4.3, “Upgrading a Replication Setup”.
warning Table mysql/innodb_table_stats has length mismatch in the column name table_name. Please run mysql_upgrade
https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-23.html

Installation of previous versions of MySQL using older packages might have created a configuration file named /usr/my.cnf. It is highly recommended that you examine the contents of the file and migrate the desired settings inside to the file /etc/my.cnf file, then remove /usr/my.cnf.



#### plugins
https://dev.mysql.com/doc/refman/5.7/en/server-plugins.html
https://dev.mysql.com/doc/refman/5.7/en/plugin-loading.html#server-plugin-installing

```
SHOW VARIABLES WHERE Variable_name = 'plugin_dir';
	/usr/lib64/mysql/plugin/
SELECT * FROM INFORMATION_SCHEMA.PLUGINS\G 
SELECT * FROM mysql.plugin;
INSTALL PLUGIN myplugin SONAME 'validate_password.so';

SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'validate%';
	   
The following lines should be present in the global configuration:
plugin-load=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
https://dev.mysql.com/doc/refman/5.7/en/validate-password-installation.html

vim /etc/my.cnf
[mysqld]
plugin-load-add=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
```
If it is desired to prevent the server from running without the password-validation plugin, use --validate-password with a value of FORCE or FORCE_PLUS_PERMANENT to force server startup to fail if the plugin does not initialize successfully.

service mysqld start --validate-password=FORCE_PLUS_PERMANENT

### 2.3 Troubleshooting 

#### Host 'xxx.xx.xxx.xxx' is not allowed to connect to this MySQL server**

```
CREATE USER 'test'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON * . * TO 'test'@'%';
FLUSH PRIVILEGES;
```

#### mysql workbench The type initializer for 'HtmlRenderer.Utils.FontsUtils' threw an exception.**
http://stackoverflow.com/questions/32020024/upgrading-to-windows-10-breaks-mysql-workbench
https://bugs.mysql.com/bug.php?id=75344

#### script import issue;

```
-- Set new delimiter '$$'
DELIMITER $$
$$
-- Set default delimiter ';'
DELIMITER ;
```

#### Fixing “Lock wait timeout exceeded; try restarting transaction” for a 'stuck" Mysql table?

https://stackoverflow.com/questions/5836623/getting-lock-wait-timeout-exceeded-try-restarting-transaction-even-though-im

```
show processlist;
kill <put_process_id_here>; 先干掉耗时长的process
```

#### upgrade trouble shooting

https://dev.mysql.com/doc/refman/5.7/en/upgrade-troubleshooting.html

#### Access denied for user 'root'@'localhost' (using password: NO) when trying to connect**

通常是因为输入了中文字符的dash -- 或者从word文档copy出来的错误编码的参数符号--

#### 随机出现的connection timeout

##### 起因是duird连接池报错

我们的一个springboot程序 使用了阿里druid，之前都好好的，上到生产遇到几次比较随机的错误：

```
Caused by: com.alibaba.druid.pool.GetConnectionTimeoutException: wait millis 60000, active 0, maxActive 500, creating 1, createElapseMillis 120001
	at com.alibaba.druid.pool.DruidDataSource.getConnectionInternal(DruidDataSource.java:1682)
	at com.alibaba.druid.pool.DruidDataSource.getConnectionDirect(DruidDataSource.java:1395)
	at com.alibaba.druid.pool.DruidDataSource.getConnection(DruidDataSource.java:1375)
	at com.alibaba.druid.pool.DruidDataSource.getConnection(DruidDataSource.java:1365)
	at com.alibaba.druid.pool.DruidDataSource.getConnection(DruidDataSource.java:109)
	at org.springframework.jdbc.datasource.DataSourceTransactionManager.doBegin(DataSourceTransactionManager.java:262)

```

核心的提示就是这个：

Caused by: com.alibaba.druid.pool.GetConnectionTimeoutException: wait millis 60000, active 0, maxActive 500, creating 1, createElapseMillis 120001

根据我目前查到的，能知道的是，抛出异常时，池子里的active Connection是0，所以不存在池子满了的情况，另外creating 1应该是代表需要创建一个connection，但是不知道因为什么原因，创建超过了我们设置的maxWait=60000也就是1分钟，createElapseMillis 120001意思应该是创建超过了两分钟

 

由于之前其他环境没有遇到过，比较倾向于是服务端问题或网络问题，总结可能的问题如下 

1.服务端：
 1）mysql：根据log的warn，好像这个版本是经过升级的，但是没有升级完全，需要执行下mysql_upgrade，不知道是否有影响；

[Warning] InnoDB: Table mysql/innodb_table_stats has length mismatch in the column name table_name.  Please run mysql_upgrade

 2）网络波动，不清楚两台机器的部署情况

2.配置问题：
 1）mysql connection string使用的是serverTimezone=Asia/Shanghai，服务器使用的应该是SGT Asia/Singapore，不过这个感觉应该没有影响，因为都是东八区
 2）druid配置问题，官方建议mysql不要开启maxPoolPreparedStatementPerConnectionSize，目前状态是开启了

3.druid本身问题：
 1）版本过低，目前使用的1.1.20是19年的版本，但是我没有看到任何新版本的release note提到了我们遇到的问题，不过有人通过升级解决了问题
 2）druid本身的缺陷，我看到duird 一些开放的issue和关闭的issue从几年前到最近都有人提到这个问题，但是官方没有给出任何回应和解决，然后有人通过放弃阿里的druid，使用其他连接池解决了

https://github.com/alibaba/druid/issues/3720
 https://github.com/alibaba/druid/issues/2130
 [https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8](https://github.com/alibaba/druid/wiki/DruidDataSource配置属性列表)

##### 脚本连接数据库也随机出错

接着，同事反馈cron job也遇到过几次类似问题:

error 2003 (hy000) can't connect to mysql server 110



https://blog.csdn.net/qq1137623160/article/details/78927741

最后其实感觉目前缺少的是：

监控和load test performance test

https://segmentfault.com/a/1190000022336871

##### 发现端倪 Aborted_connects

瞄了眼这篇文章，想到忘记认真看下连接数

https://www.jianshu.com/p/07c85b8a7997

执行 netstat -anp|grep 3306 大概三十多个，还算正常，然后

show global status like '%connection%';

结果：Connections=7772 Max_used_connections=60 

查了下，好像是指服务器启动之后累积的，所以没有什么参考意义

Connections：The number of connection attempts (successful or not) to the MySQL server. 
Max_used_connections：The maximum number of connections that have been in use simultaneously since the server started. 

show global status like '%thread%';

结果：Threads_cached=8	Threads_connected=34	Threads_created=2232	Threads_running=1

Threads_created应该也是累计的，Threads_connected应该是当前的，确实跟前面netstat差不多

show processlist;

结果显示三十多个程序，大部分都是sleep状态，唯一running的是我当前查询的这个线程；

确认了下最大连接数

SHOW VARIABLES LIKE "max_connections";

结果是151默认值，远超34，应该没什么问题，但是总感觉这些sleep状态的threads/connections有些问题，

然后看到了这个

show global status like '%aborted%';

结果：Aborted_clients 1095	Aborted connections 9

这个有点意思：

Aborted_clients：The number of connections that were aborted because the client died without closing the connection properly.

Aborted_connects：The number of failed attempts to connect to the MySQL server. 

然后猜测如下：
Aborted_clients=1095, big number, probably means that we have some clients(app or scripts) connected to mysql, but failed to close mysql connections properly, caused lots of sleep threads/connections in mysql processlist;
at some point in time, it may reached the max connections limit;
and then some new connection request coming in, mysql then start to recycle zombies, most of the time is fine, but sometimes may delayed some seconds because of recycle taking time, caused Aborted_connects=9, small number, quite random

根据Aborted_connects文档提示：

For additional connection-related information, check the   [`Connection_errors_*`xxx`*`](https://dev.mysql.com/doc/refman/8.0/en/server-status-variables.html#statvar_Connection_errors_xxx)   status variables and the [`host_cache`](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-host-cache-table.html) table.       

show global status like '%errors%';

select * from performance_schema.host_cache;

不过并没有什么发现

 

## 4. SQL

### Basic

a mysql db can have many schema,**like a building have many rooms, and users can get access to different room, so schema can have more than one user.**

```
SELECT DATE_FORMAT(date_add(date_column,INTERVAL 8 HOUR),'%b %d %Y %h %p'),COUNT(distinct(count_column))
FROM db.table
where date_add(date_column,INTERVAL 8 HOUR) between '2015-02-01 00:00:00' and '2015-03-01 00:00:00'
GROUP BY DATE_FORMAT(date_column,'%b %d %Y %h %p')
order by DATE_FORMAT(date_add(date_column,INTERVAL 8 HOUR),'%b %d %Y %h %p');
```
CRUD
```
insert into phoenix.`program-slot`(duration,dateOfProgram,startTime,`weekly-schedule_id`,presenter_id,producer_id,program_id)
select duration,date_add(dateOfProgram,INTERVAL 2 DAY), IFNULL(date_add(startTime,INTERVAL 2 DAY),null) ,100,presenter_id,producer_id,program_id from phoenix.`program-slot` where `weekly-schedule_id` =3;

```

### Advance

**批量生成truncate**

```
mysql -h'HOST' -u'USERNAME' -p'PASSWORD' -e'SELECT CONCAT("TRUNCATE TABLE ",TABLE_NAME,";") FROM information_schema.TABLES WHERE TABLE_SCHEMA="clear" into outfile "/var/lib/mysql-files/truncate_db_clear.sql";'

SHOW VARIABLES LIKE "secure_file_priv" 查看能写到哪个目录
```



**Performance on index : when join a large table**

```
bad:
select user.*, log.LoginTime
from users user
left join login_log log on user.id=log.userid and log.LoginTime=(select max(LoginTime) from login_log where userid=log.userid and status='true');
good:
select user.*, log.LoginTime
from users user
left join (
select max(LoginTime) LoginTime,userid from login_log
where  status='true'
group by userid) temp on temp.userid=user.userid;
```

**存储过程互相调用**

```
DELIMITER $$
CREATE DEFINER=`dbuser`@`%` PROCEDURE `PROCE1`(
in _param varchar(50)
)
root:BEGIN
declare _count int;
select count(1) into _count from table where column=_param;
if _count<>1 then
select -1 as result;
leave root;
end if;
call PROCE2(_param);
do something else
select 0 as result;
END

DELIMITER $$
CREATE DEFINER=`dbuser`@`%` PROCEDURE `PROCE2`(
in _param int
)
BEGIN
DECLARE done INT DEFAULT FALSE;
declare _variable1 int;
declare _variable2 decimal(10,2);
declare resultCur cursor for select column1,column2 from table where column=_param;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
DECLARE exit handler for sqlexception
BEGIN
ROLLBACK;
get diagnostics condition 1 @p1 = MESSAGE_TEXT;
select -1 as result, @p1 as message from dual;
END;
open resultCur;
operaLoop:Loop
fetch resultCur into _variable1,_variable2;
if done then
leave operaLoop;
end if;
do something...
end Loop;
close resultCur;
END

```

**Multiple cursors in mysql stored procedure**

```
DROP PROCEDURE IF EXISTS `multipleCursorsAtOne`;
DELIMITER $$
CREATE PROCEDURE `multipleCursorsAtOne`()
BEGIN
DROP TABLE IF EXISTS userNames;
CREATE TEMPORARY TABLE userNames
(userName varchar(200) NOT NULL);
BEGIN
DECLARE done BOOLEAN DEFAULT false;
DECLARE p_first_name VARCHAR(200);
DECLARE cursor_a CURSOR FOR SELECT user_name FROM user_info LIMIT 1,3;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
OPEN cursor_a;
cursor_a_loop: LOOP
FETCH cursor_a INTO p_first_name;
IF done THEN
LEAVE cursor_a_loop;
END IF;
-- cursor loop statements
IF p_first_name IS NOT NULL AND p_first_name <> "" THEN
INSERT INTO userNames(userName) VALUES(p_first_name);
END IF;
END LOOP;
CLOSE cursor_a;
END;
BEGIN
DECLARE done BOOLEAN DEFAULT false;
DECLARE p_first_name VARCHAR(200);
DECLARE cursor_a CURSOR FOR SELECT user_name FROM user_info LIMIT 4,3;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
OPEN cursor_a;
cursor_a_loop: LOOP
FETCH cursor_a INTO p_first_name;
IF done THEN
LEAVE cursor_a_loop;
END IF;
-- cursor loop statements
IF p_first_name IS NOT NULL AND p_first_name <> "" THEN
INSERT INTO userNames(userName) VALUES(p_first_name);
END IF;
END LOOP;
CLOSE cursor_a;
END;
SELECT * FROM userNames;
END
$$

```

**Recursive query**

就是针对存在parent id的存在层级关系的表

Hierarchical data in MySQL: parents and children in one query

https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

Managing Hierarchical Data in MySQL

https://www.mysqltutorial.org/mysql-adjacency-list-tree/



## 5. HA

### 理论

https://dev.mysql.com/doc/refman/8.0/en/replication.html

In MySQL, replication involves the source database writing down every  change made to the data held within one or more databases in a special  file known as the *binary log*

Once the replica instance has been initialized, it creates two threaded processes:

+ master-binary log=>slave-relay log

  The first, called the *IO thread*, connects to the source MySQL instance and reads the binary log events  line by line, and then copies them over to a local file on the replica’s server called the *relay log*. 

+ slave-relay log=>slave db changes

  The second thread, called the *SQL thread*, reads events from the relay log and then applies them to the replica instance as fast as possible.

### 两种模式

+ 基于binary log, *binary log file position-based replication*

  When you turn a MySQL instance into a replica using this method, you  must provide it with a set of binary log coordinates. These consist of  the name of the binary log file on the source which the replica must  read and a specific position within that file which represents the first database event the replica should copy to its own MySQL instance. 

  These coordinates are important since replicas receive a copy of their  source’s entire binary log and, without the right coordinates, they will begin replicating every database event recorded within it. This can  lead to problems if you only want to replicate data after a certain  point in time or only want to replicate a subset of the source’s data.

  Binary log file position-based replication is viable for many use cases, but this method can become clunky in more complex setups.

+ 基于 global transaction identifier GTID [starting with version 5.6 and above]

  GTID stands for global transaction identifier (GTID) which uniquely  identifies a transaction committed on the server of origin (master). A  unique GTID is created when any transaction occurs. The GTID is not  just unique to the server on which it originates, but also across the  servers in any given replication setup. In other words, each transaction is mapped to a GTID.

  MySQL GTIDs are displayed as a pair of coordinates, separated by a colon character (:) `GTID = source_id:transaction_id`

  

  This method involves creating a global transaction identifier (GTID)  for each transaction — or, an isolated piece of work performed by a  database — that the source MySQL instance executes.

  The mechanics of transaction-based replication are similar to binary log file-based replication: whenever a database transaction occurs on the  source, MySQL assigns and records a GTID for the transaction in the  binary log file along with the transaction itself. The GTID and the  transaction are then transmitted to the source’s replicas for them to  process.

  

  When the replication takes place, the slave makes use of the same  GTIDs, irrespective of whether it acts as a master for any other nodes  or not. With each transaction replication, the same GTIDs and  transaction numbers also come along from the master and the slave will  write these to the binlog if it’s configured to write its data events.

  To ensure a smooth, consistent and fault-tolerant replication, the  slave will then inform the master of the GTIDs that were a part of the  execution, which helps master node identify if any transaction did not  take place. The master node then informs the slave to carry out the  left-over transactions and thereby ensures that data replication takes  place accurately.

  

  MySQL’s transaction-based replication has a number of benefits over its  traditional replication method. For example, because both a source and  its replicas preserve GTIDs, if either the source or a replica encounter a transaction with a GTID that they have processed before they will  skip that transaction. This helps to ensure consistency between the  source and its replicas. Additionally, with transaction-based  replication replicas don’t need to know the binary log coordinates of  the next database event to process. This means that starting new  replicas or changing the order of replicas in a replication chain is far less complicated.

### 相关权限

REPLICATION CLIENT权限: replication user使用shell命令 SHOW MASTER STATUS, SHOW SLAVE STATUS和 SHOW BINARY LOGS来确定复制状态。

REPLICATION SLAVE权限: SLAVE 进行replication，使用 show slave hosts ，show binlog events;等命令；

假设想要在Slave上有权限运行"LOAD TABLE FROM MASTER" 或 "LOAD DATA FROM MASTER"语句的话，必须授予全局的 FILE 和 SELECT 权限：

RELOAD 权限：Reset slave: Access denied; you need (at least one of) the RELOAD privilege(s) for this operation

super权限：start slave，stop slave；

### Replication Solution

主机器需要允许从机器访问其3306端口

#### 主从 - 基于binary log replication

https://www.digitalocean.com/community/tutorials/how-to-set-up-replication-in-mysql

```
----------------------------------------------------------------------------
step 1: config master and slave /etc/my.cnf And restart:
----------------------------------------------------------------------------
Master:
server-id=1
log-bin=mysql-bin #This defines the base name and location of MySQL’s binary log file,When commented out, as this directive is by default, binary logging is disabled. Your replica server must read the source’s binary log file so it knows when and how to replicate the source’s data

binlog_do_db          = include_database_name 需要复制的数据库
binlog_do_db          = db_1
binlog_do_db          = db_2

replicate-ignore-db = mysql  #忽略数据库，不需要复制
replicate-ignore-db = information_schema
replicate-ignore-db = performance_schema
replicate-ignore-db = sys

Slave:
[mysqld]
server-id=2
log_bin                 = /var/log/mysql/mysql-bin.log
binlog_do_db            =  跟master一致
relay-log               = /var/log/mysql/mysql-relay-bin.log

> sudo systemctl restart mysql

----------------------------------------------------------------------------
step 2: on master, create and grant repl user
----------------------------------------------------------------------------

good:
mysql> CREATE USER 'replica_user'@'replica_server_ip' IDENTIFIED WITH mysql_native_password BY 'password';
# Note that this command specifies that replica_user will use the mysql_native_password authentication plugin. It’s possible to instead use MySQL’s default authentication mechanism, caching_sha2_password, but this would require setting up an encrypted connection between the source and the replica. This kind of setup would be optimal for production environment: https://dev.mysql.com/doc/refman/8.0/en/replication-solutions-encrypted-connections.html

bad: 任意ip都可以访问，不安全
mysql> CREATE USER 'replica_user'@'%' IDENTIFIED BY '123456';


mysql> GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'replica_server_ip';

----------------------------------------------------------------------------
step 3: on master: Retrieving Binary Log Coordinates from the Source
----------------------------------------------------------------------------
To make sure that no users change any data while you retrieve the coordinates, which could lead to problems, you’ll need to lock the database to prevent any clients from reading or writing data as you obtain the coordinates. 

mysql> FLUSH TABLES WITH READ LOCK;
mysql> SHOW MASTER STATUS; # return the current status information for the source’s binary log files

Output
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000001 |      899 | db           |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)

输出的file和position即下面用到的MASTER_LOG_FILE和MASTER_LOG_POS

----------------------------------------------------------------------------
step 4: dump and import, If Your Source Has Existing Data to Migrate
----------------------------------------------------------------------------
on master::
If you have data on your source MySQL instance that you want to migrate to your replicas, you can do so by creating a snapshot of the database with the mysqldump utility. However, your database should still be currently locked. If you make any new changes in the same window, the database will automatically unlock. Likewise, the tables will automatically unlock if you exit the client. 
For this reason, you must open a new terminal window or tab on your local machine so you can create the database snapshot without unlocking MySQL.

> mysqldump -u root db > db.sql
or
> mysqldump -u repl -p 123456 --all-databases --master-data > dbdump.db


Following that you can close this terminal window or tab and return to your first one, which should still have the MySQL shell open, then:
mysql> UNLOCK TABLES;


on slave:: import data
> mysql -u root -p < dbdump.db
or
mysql> CREATE DATABASE db; 
> mysql db < /tmp/db.sql


----------------------------------------------------------------------------
step 5: Slave: setting and start
----------------------------------------------------------------------------

mysql> CHANGE MASTER TO MASTER_HOST='source_server_ip',MASTER_PORT=3306,MASTER_USER='replica_user',MASTER_PASSWORD='password',MASTER_LOG_FILE='mysql-bin.000001',MASTER_LOG_POS=52113;

mysql> START SLAVE;
 
mysql> SHOW SLAVE STATUS\G;

其中，Slave_IO_Running和Slave_SQL_Running均显示yes表示Replication工作正常，可通过其余参数来了解Replication的工作状态。



Note: If your replica has an issue in connecting or replication stops unexpectedly, it may be that an event in the source’s binary log file is preventing replication. In such cases, you could run the SET GLOBAL SQL_SLAVE_SKIP_COUNTER command to skip a certain number of events following the binary log file position you defined in the previous command. This example only skips the first event:
mysql> SET GLOBAL SQL_SLAVE_SKIP_COUNTER = 1;

Following that, you’d need to start the replica again:
mysql> START REPLICA;


```

#### 主从 - 基于GTID replication

https://hevodata.com/learn/mysql-gtids-and-replication-set-up/

gtid_executed：这个是已经执行过的所有的事物的GTID的一个系列串，也就是binary log里面已经落盘的事物的序列号。这个参数是只读的，不能够进行设置。

gtid_purged：这个序列是指我们在binary log删除的事物的GTID的序列号。我们可以手动进行设置，方便我们做一些管理。

```
----------------------------------------------------------------------------
step 1: config master and slave /etc/my.cnf And restart:
----------------------------------------------------------------------------
for master: 
The Master server needs to be started with GTID mode enabled by setting the gtid_mode variable to ON. It is also essential that the enforce_gtid_consistency variable is enabled to make sure that only the statements which are safe for MySQL GTIDs Replication are logged. 
[mysqld]
server-id=1
log-bin = mysql-bin
binlog_format = row
gtid-mode=ON
enforce-gtid-consistency
log-slave-updates

for slave:
[mysqld]
server-id = 2
log-bin = mysql-bin
relay-log = relay-log-server
relay-log = relay-log-server
read-only = ON
gtid-mode=ON
enforce-gtid-consistency
log-slave-updates

----------------------------------------------------------------------------
step 2: lock master&slave
----------------------------------------------------------------------------
on both master & slave:
mysql> SET @@GLOBAL.read_only = ON;
这次跟前面的lock方法不同，注意**不会影响slave同步复制的功能**

----------------------------------------------------------------------------
step 3: on master create replicator user
----------------------------------------------------------------------------

> mysql -uroot -p

mysql> DROP USER 'replicator'@'localhost';
--- mysql> REVOKE ALL ON *.* FROM 'replicator'@'localhost';

# replicator@localhost可以管理master本机
mysql> CREATE USER replicator@localhost IDENTIFIED BY 'password';
mysql> GRANT SUPER,RELOAD,REPLICATION SLAVE ON *.* TO 'replicator'@'localhost' IDENTIFIED BY 'password';

# 'replicator'@'replication_server_ip'在slave机器上replication_server_ip远程连接管理master以及进行基本的复制（最低需要REPLICATION SLAVE权限）
mysql> CREATE USER replicator@replication_server_ip IDENTIFIED BY 'password';
mysql> GRANT SUPER,RELOAD,REPLICATION SLAVE ON *.* TO 'replicator'@'replication_server_ip' IDENTIFIED BY 'password';

mysql> flush privileges;

mysql_config_editor set --login-path=host-rpl --host=localhost --port=3306 --user=replicator --password

----------------------------------------------------------------------------
step 4: on master: Retrieving Binary Log Coordinates from the Source
----------------------------------------------------------------------------

mysql> show master status
mysql> show global variables like 'gtid_executed';
两者输出的gtid_executed应该是一样的

----------------------------------------------------------------------------
step 5: dump and import, If Your Source Has Existing Data to Migrate
----------------------------------------------------------------------------

> mysqldump --all-databases -flush-privileges --single-transaction --flush-logs --triggers --routines --events -hex-blob --host=54.89.xx.xx --port=3306 --user=root  --password=XXXXXXXX > mysqlbackup_dump.sql
# head -n30 mysqlbackup_dump.sql


on slave:: import data
mysql> show global variables like 'gtid_executed';
如果是第一次，应该是空的
mysql> source mysqlbackup_dump.sql ;
mysql> show global variables like 'gtid_executed';
导入完应该跟master一样了


----------------------------------------------------------------------------
step 6: Slave: setting and start
----------------------------------------------------------------------------
The slave should be configured to use the master with GTID based transactions as the source for data replication and to use GTID-based auto-positioning rather than file-based positioning.

> mysql -uroot -p
mysql> CHANGE MASTER TO
MASTER_HOST = '54.89.xx.xx',
MASTER_PORT = 3306,
MASTER_USER = 'repl_user',
MASTER_PASSWORD = 'XXXXXXXXX',
MASTER_AUTO_POSITION = 1;

mysql> start slave;
mysql> show slave status\G

mysql> SET @@GLOBAL.read_only = OFF;


```

https://www.cnblogs.com/shengdimaya/p/6897584.html

#### 主主

https://www.huaweicloud.com/articles/e85563c3c3c75c7d980466d800a8c43c.html

上面的操作反过来操作一遍即可，但是注意：

两个主自增id要分别为奇数偶数，不然有冲突

```
----------------------------------------------------------------------------
step 1: config master & slave /etc/my.cnf And restart:
----------------------------------------------------------------------------
master:

[mysqld]
server-id = 1
auto_increment_offset = 1
auto_increment_increment = 2  #奇数ID


log-bin = mysql-bin  #打开二进制功能,MASTER主服务器必须打开此项
binlog-format=ROW
log-slave-updates=true
gtid-mode=on
enforce-gtid-consistency=true
master-info-repository=TABLE
relay-log-info-repository=TABLE
sync-master-info=1
slave-parallel-workers=0
sync_binlog=0
binlog-checksum=CRC32
master-verify-checksum=1
slave-sql-verify-checksum=1
binlog-rows-query-log_events=1
max_binlog_size=1024M       #binlog单文件最大值

replicate-ignore-db = mysql  #忽略不同步主从的数据库
replicate-ignore-db = information_schema
replicate-ignore-db = performance_schema
replicate-ignore-db = sys

max_connections = 3000
max_connect_errors = 30

lower_case_table_names=1      
skip-name-resolve

slave:
[mysqld]
server-id = 2
auto_increment_offset = 2
auto_increment_increment = 2    #偶数ID


log-bin = mysql-bin    #打开二进制功能,MASTER主服务器必须打开此项
binlog-format=ROW
log-slave-updates=true
gtid-mode=on
enforce-gtid-consistency=true
master-info-repository=TABLE
relay-log-info-repository=TABLE
sync-master-info=1
slave-parallel-workers=0
sync_binlog=0
binlog-checksum=CRC32
master-verify-checksum=1
slave-sql-verify-checksum=1
binlog-rows-query-log_events=1
max_binlog_size=1024M         #binlog单文件最大值

replicate-ignore-db = mysql   #忽略不同步主从的数据库
replicate-ignore-db = information_schema
replicate-ignore-db = performance_schema
replicate-ignore-db = sys

max_connections = 3000
max_connect_errors = 30

lower_case_table_names=1      
skip-name-resolve



----------------------------------------------------------------------------

----------------------------------------------------------------------------
```

#### Reset Replication

```
on slave:
mysql > stop slave;
mysql > reset slave (all);
	RESET SLAVE 不会改变复制连接使用的参数，例如master host, master port, master user, or master password
	RESET SLAVE ALL 则会；
    清除slave 复制时的master binlog的位置
    清空master info, relay log info
    删除所有的relay log文件，并创建一个新的relay log文件。
    重置复制延迟(CHANGE MASTER TO 的 MASTER_DELAY参数指定的)为0。
    
on master:

mysql > RESET MASTER

    删除binlog索引文件中列出的所有binlog文件
    清空binlog索引文件
    创建一个新的binlog文件
    清空系统变量gtid_purged和gtid_executed
    在MySQL 5.7.5 及后续版本中, RESET MASTER还会会清空 mysql.gtid_executed 数据表。

```

### Sync Replication

Synchronize both servers by setting them to read-only if the replication is running already by using the following command:

```
mysql> SET @@GLOBAL.read_only = ON;
```

解释：

对于Mysql数据库读写状态，主要靠"read_only"全局参数来设定；默认情况下, 数据库是用于**读写操作**的，所以read_only参数也是0或faluse状态，这时候不论是本地用户还是远程访问数据库的用户，都可以进行读写操作；

如需设置为**只读状态**，将该read_only参数设置为1或TRUE状态，但设置 read_only=1 状态有两个需要注意的地方：

1) read_only=1只读模式，**不会影响slave同步复制的功能**，所以在MySQL slave库中设定了read_only=1后，通过 "show slave status\G" 命令查看salve状态，可以看到salve仍然会读取master上的日志，并且在slave库中应用日志，保证主从数据库同步一致；

2) read_only=1只读模式，限定的是普通用户进行数据修改的操作，但不会限定具有super权限的用户的数据修改操作 (但是如果设置了"**super_read_only=on**"， 则就会限定具有super权限的用户的数据修改操作了)；在MySQL中设置read_only=1后，普通的应用用户进行insert、update、delete等会产生数据变化的DML操作时，都会报出数据库处于只读模式不能发生数据变化的错误，但具有super权限的用户，例如在本地或远程通过root用户登录到数据库，还是可以进行数据变化的DML操作；**(也就是说"real_only"只会禁止普通用户权限的mysql写操作，不能限制super权限用户的写操作； 如果要想连super权限用户的写操作也禁止，就使用"flush tables with read lock;"，这样设置也会阻止主从同步复制！)**

https://www.cnblogs.com/kevingrace/p/10095332.html



### Replication Troubleshooting 

https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-problems.html

不要轻易在两种不同的replication模式间切换：

MySQL 5.7复制配置不规范修改导致的坑：http://blog.itpub.net/28218939/viewspace-2142235/

https://www.cnblogs.com/shengdimaya/p/6897584.html

ref:

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7

benchmark: http://www.itsecure.hu/library/image/CIS_Oracle_MySQL_Enterprise_Edition_5.7_Benchmark_v1.0.0.pdf