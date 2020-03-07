---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《mysql实用基础》

## 1.Setup 
### 1.1 Install on centos
**Using rpm**

**Using tar**

tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
yum install mysql-community-{server,client,common,libs}-* mysql-5.*­

?#Install error
https://princetonits.com/centos7-mysql-install-fails-due-conflict-libmysqlclient/
yum list installed mariadb\*
yum remove mariadb-libs.x86_64
```
vim /etc/my.cnf
Bind-address:0.0.0.0
service mysqld stop/start
```

Mysql default password
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

![](/docs/docs_image/software/mysql/mysq01.png)

Setup replication
https://lyhistory.com/mysql_replication/#

### 1.3 Tool
http://sqlfiddle.com/

Dbeaver export mysql
Export without data https://github.com/dbeaver/dbeaver/issues/2176

## 2. Common SQL
a mysql db can have many schema,like a building have many rooms, and users can get access to different room, so schema can have more than one user.
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

Performance on index : when join a large table
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

存储过程互相调用
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

Multiple cursors in mysql stored procedure
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

## 3.Troubleshooting 
#Host 'xxx.xx.xxx.xxx' is not allowed to connect to this MySQL server
```
CREATE USER 'test'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON * . * TO 'test'@'%';
FLUSH PRIVILEGES;
```
mysql workbench The type initializer for 'HtmlRenderer.Utils.FontsUtils' threw an exception.
http://stackoverflow.com/questions/32020024/upgrading-to-windows-10-breaks-mysql-workbench
https://bugs.mysql.com/bug.php?id=75344
 
script import issue;
delimiter http://buysql.com/mysql/42-delimiter-mysql.html
-- Set new delimiter '$$'
DELIMITER $$
$$
-- Set default delimiter ';'
DELIMITER ;
Recursive query
Hierarchical data in MySQL: parents and children in one query
Managing Hierarchical Data in MySQL


---

ref:

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7
