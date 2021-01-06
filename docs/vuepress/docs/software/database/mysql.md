---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《mysql实用基础》

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
http://sqlfiddle.com/

Dbeaver export mysql
Export without data https://github.com/dbeaver/dbeaver/issues/2176

mysql workbench

## 2. DB Management

### 2.1 mysql-cli

千万不要用双引号，尤其是password，所有的-u -p -e等等后面不要加空格！

```
mysql -uroot -pCappuccin0!
mysql --login-path=sgkc2-devclr-v01

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

**upgrade 5.7.18 5.7.26**
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

backup https://dev.mysql.com/doc/refman/5.7/en/mysqldump-sql-format.html
mysqldump -uroot -pCappuccin0! --all-databases > mysqldump_20190524.sql

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

trouble shooting
https://dev.mysql.com/doc/refman/5.7/en/upgrade-troubleshooting.html

**turn off local_infile**
SHOW VARIABLES WHERE Variable_name = 'local_infile';
SET GLOBAL local_infile = 'OFF';

**plugins**
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



## 3.Troubleshooting 

**?#Host 'xxx.xx.xxx.xxx' is not allowed to connect to this MySQL server**

```
CREATE USER 'test'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON * . * TO 'test'@'%';
FLUSH PRIVILEGES;
```

**?#mysql workbench The type initializer for 'HtmlRenderer.Utils.FontsUtils' threw an exception.**
http://stackoverflow.com/questions/32020024/upgrading-to-windows-10-breaks-mysql-workbench
https://bugs.mysql.com/bug.php?id=75344

**?#script import issue;**

```
-- Set new delimiter '$$'
DELIMITER $$
$$
-- Set default delimiter ';'
DELIMITER ;
```

**?#Fixing “Lock wait timeout exceeded; try restarting transaction” for a 'stuck" Mysql table?**

https://stackoverflow.com/questions/5836623/getting-lock-wait-timeout-exceeded-try-restarting-transaction-even-though-im

```
show processlist;
kill <put_process_id_here>; 先干掉耗时长的process
```



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





---

ref:

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7

benchmark: http://www.itsecure.hu/library/image/CIS_Oracle_MySQL_Enterprise_Edition_5.7_Benchmark_v1.0.0.pdf