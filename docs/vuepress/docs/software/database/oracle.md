---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《oracle实用基础》

## 1. Basics

### 1.1 Concepts
tablespace datafiles
![](/docs/docs_image/software/oracle/oracle00.png)

### 1.2 Setup

**server**:
配置TNSNAMES.ORA files are located on both client and server systems.
https://www.orafaq.com/wiki/Tnsnames.ora

oracle+tomcat连接池
在实际应用开发中，特别是在WEB应用系统中，如果JSP、Servlet或EJB使用JDBC直接访问数据库中的数据，每一次数据访问请求都必须经历建立数据库连接、打开数据库、存取数据和关闭数据库连接等步骤，而连接并打开数据库是一件既消耗资源又费时的工作，如果频繁发生这种数据库操作，系统的性能必然会急剧下降，甚至会导致系统崩溃。数据库连接池技术是解决这个问题最常用的方法，在许多应用程序服务器（例如：Weblogic, WebSphere,JBoss）中，基本都提供了这项技术，无需自己编程，但是，深入了解这项技术是非常必要的。
https://www.cnblogs.com/lbangel/p/3406084.html

**client**:

Oracle Client
http://www.oracle.com/technetwork/database/enterprise-edition/downloads/112010-win32soft-098987.html

Full installation
Oracle SQL Developer
http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html
Register Oracle DLL into global assembly cache.
http://msdn.microsoft.com/en-us/library/dkkx7f79(v=vs.110).aspx

Oracle.DataAccess.dll


** oracle for .net developer **

download http://www.oracle.com/us/products/tools/utilsoft-087491.html

install.bat all <Path> odac
addling assembly to GAC: Gacutil.exe -i  Oracle.DataAccess.dll
adding assembly to GAC without Gacutil.exe: http://www.totaldotnet.com/sub/adding-assembly-to-gac-using-command-prompt-without-gacutil-exe
Problem you may encounter: The provider is not compatible with the version of Oracle client
This is Oracle.DataAccess Issue with .net and 64 bit
https://community.oracle.com/thread/3537075?start=0&tstart=0


Oracle.DataAccess.Client.OracleException: The provider is not compatible with the version of Oracle client
For web projects, the iis express by default will use 32bit as standard, two ways can solve this issue:
1.	install 32 bit ODAC https://www.oracle.com/technetwork/topics/dotnet/utilsoft-086879.html
2.	enale iis express settings to 64 bit version: vs2017 for example, tools=>Options=>Projects and Solutions => Web Projects => Use the 64 bit version
ODAC 11.2 Release 5 and Oracle Developer Tools for Visual Studio (11.2.0.3.20) https://www.oracle.com/technetwork/topics/dotnet/utilsoft-086879.html

Oracle.DataAccess Version compatible issue:

Register to global cache

Change  newVersion in dependentAssembly in web.config
```
  <dependentAssembly>
       <assemblyIdentity name="Oracle.DataAccess" publicKeyToken="31bf3856ad364e35" culture="neutral"/>
       <bindingRedirect oldVersion="2.111.6.0" newVersion="4.112.3.0"/>
     </dependentAssembly>
```
Reference:
https://docs.oracle.com/html/E10927_01/InstallVersioningScheme.htm
http://www.oracle.com/technetwork/database/windows/downloads/utilsoft-087491.html


**using sql developer**

before debug need to 'compile for debug'
missing connection menu： https://amoratech.wordpress.com/2011/09/25/sql-developer-3-0-3-0-04-34-connection-menu-is-missing/
Import from Excel into Oracle www.thatjeffsmith.com/archive/2012/04/how-to-import-from-excel-to-oracle-with-sql-developer/

**execute store procedure manually**
```
var RESULT refcursor;
exec sp('id1;6?id2;2?id3;4?id5;11?id4:10',:RESULT);
print RESULT;
```

## 2.常用语法

### 2.1 CRUD
update with inner join:
http://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle

Cross Join
http://www.w3resource.com/oracle/joins/oracle-cross-join.php
![](/docs/docs_image/software/oracle/oracle01.png)

Merge Statement
merge into table t1 using  table t2 on (t1.id=t2.id)
when match then update set XXX
when not match then insert XXX;

Insert All when else
https://docs.oracle.com/cloud/latest/db112/SQLRF/statements_9014.htm#i2111652
INSERT ALL
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date, sales_sun)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+1, sales_mon)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+2, sales_tue)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+3, sales_wed)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+4, sales_thu)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+5, sales_fri)
INTO sales (prod_id, cust_id, time_id, amount)
VALUES (product_id, customer_id, weekly_start_date+6, sales_sat)
SELECT product_id, customer_id, weekly_start_date, sales_sun,
sales_mon, sales_tue, sales_wed, sales_thu, sales_fri, sales_sat
FROM sales_input_table;

### 2.2 Handle Exception
https://docs.oracle.com/cd/A97630_01/appdev.920/a96624/07_errs.htm

### 2.3 temp table
**create temp table inside sp need extral permission**
1）ON COMMIT DELETE ROWS 事务级 transaction
2）ON COMMIT PRESERVE ROWS 会话级 session

**split string into temp table**
http://stackoverflow.com/questions/27786412/oracle-stored-procedure-split-string-for-insert-or-update-to-a-table
http://stackoverflow.com/questions/29557207/split-string-and-iterate-for-each-value-in-a-stored-procedure
http://www.techonthenet.com/oracle/index.php

### 2.4 Transpose Column to Row 列转行
PIVOT https://oracle-base.com/articles/11g/pivot-and-unpivot-operators-11gr1
http://www.2cto.com/database/201206/136218.html
http://blog.sina.com.cn/s/blog_4adc4b090101ges3.html

### 2.5 Dynamic SQL
http://docs.oracle.com/cd/B28359_01/appdev.111/b28370/dynamic.htm
       https://docs.oracle.com/cd/B28359_01/appdev.111/b28370/dynamic.htm#i13057
Dynamic PL/SQL date parameter with time value retained https://stackoverflow.com/questions/18455867/dynamic-pl-sql-date-parameter-with-time-value-retained

### 2.6 Group
**by having **
Dates: Grouping date-time values into {n} minute buckets. http://steve-lyon.blogspot.sg/2011/08/bucketing-up-date-times-by-various.html
** sum(decode( **
** common table expression **
with r as (select username, productid, sum(amt) shoppingamt
from transactionlog where transdate = date'2014-06-11'
group by GROUPING SETS((username, productid), (productid))
)
```
select * from r where username is null;
with r as (select productid, sum(amt) shoppingamt
from transactionlog where transdate = date'2014-06-11'
group by rollup(productid)
)
select * from r ;
```

### 2.7 Package level&Schema level
**Receive Array/Table as input**
a.Type in database level - can be used as a nested table
```
create or replace TYPE   associateArray     IS   TABLE   OF   varchar2(100);
arrayDatabaselevel  :=new associateArray();
arrayDatabaselevel.extend(1);
arrayDatabaselevel(1) := 'test';
select * from table(arrayDatabaselevel)
```

b.Type in Package level - can only be used in loop
```
create or replace PACKAGE PKG_helloworld AS
TYPE   associateArray IS TABLE OF varchar2(100) INDEX BY BINARY_INTEGER;
END PKG_helloworld ;
-------------------
create or replace PROCEDURE test(
arrayPackageLevelin PKG_helloworld.associateArray
).........................
if arrayPackageLevelis not null then
for i in 1 .. arrayPackageLevel.count loop
if (arrayPackageLevel(i) is not null) then
name := regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 1); number := to_number(regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 3))；date := to_date(regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 2),'yyyy-mm-dd hh24:mi:ss');
```

c.Mixed
```
arrayDatabaselevel  := associateArray();
arrayDatabaselevel.extend(arrayPackageLevel.count);
for i in arrayPackageLevel.first .. arrayPackageLevel.last loop
arrayDatabaselevel(i) := arrayPackageLevel(i);
end loop;
```

important deadlock issue here：

![](/docs/docs_image/software/oracle/oracle02.png)

### 2.8 exec store-procedure and export to csv file

```
set colsep ','
var    input1 VARCHAR2(10);
var    input2 VARCHAR2(10);
var results REFCURSOR
begin
:input1 := '2016-01-01';
:input2 := '100';
storeProcedure(:input1,:input2,:results);
end;
/
spool /tmp/results.csv
print results;

### 


declare
v_sql varchar2(5000);
begin
v_sql := q'[select
col1||','||
col2
from
(
select * from ***
)
order by col1]';
dump_sql_to_csv(v_sql, 'example.csv');
end;
/

```

### 2.9 Scheduler
https://docs.oracle.com/cd/B28359_01/server.111/b28310/schedadmin006.htm
       https://docs.oracle.com/cd/B28359_01/server.111/b28310/scheduse004.htm#ADMIN12413
Scheduler Running log https://docs.oracle.com/cd/E18283_01/server.112/e17120/scheduse008.htm

### 2.10 build-in functions
regexp_substr：
https://www.techonthenet.com/oracle/functions/regexp_substr.php

analytic functions：
--https://oracle-base.com/articles/misc/rank-dense-rank-first-last-analytic-functions
select t1.id, min(amt) keep (DENSE_RANK FIRST ORDER BY datecreated desc) as amount
from money_transferlog t1
group by t1.id

## 3.troubleshooting

?# :ORA-01861: literal does not match format string
e.g date format, need to convert
s_dateList(i):= to_date(dateList(i),'yyyy-mm-dd hh24:mi:ss');

?#-1 No Data found:
always handle exception for 'select column into ***'

?#0 insert special character :  '  &
http://www.blogjava.net/pengpenglin/archive/2008/01/16/175689.html

?#1 parameter name cannot be the same with column name !!!
SELECT × FROM TABLE COL_NAME=INPUT_NAME
exact fetch returns more than requested number of rows

?#2 date format
wrong: to_char(DateColumn, 'yyyy-MM-dd hh:mm:ss')
correct: to_char(DateColumn, 'yyyy-MM-dd hh24:mi:ss')

?#3 Input is too long (> 2499 characters) - line ignored
Sol: if it happens in store procedure, simply make it multi lines instead one long single line

?#4 no data found Exception
select sum(*) count(1) into won't cause exception,
select <col> into <name> may cause error:ORA-01403: no data found
one typical scenario: let's say we have two table t1 and t2 joined by userid, then in one sp you wrote like:
```
create or replace PROCEDURE
(
list in PKG.associateArray,
result out sys_refcursor
)
AS
counter int;
msg varchar2(1000);
BEGIN
if list is not null then
for i in 1 .. list.count loop
if (list(i) is not null) then
BEGIN
select count(1) into counter from t1 where t1.userid='**';
if(counter > 0) then
do something here
select col from t2 where t2.userid='***';
do somethingelse here...
end if;
END
end if;
end loop;
end if;
end ;
```
this is the common error we all may have write like that, correct one should be :
```
create or replace PROCEDURE
(
list in PKG.associateArray,
result out sys_refcursor
)
AS
counter int;
msg varchar2(1000);
BEGIN
if list is not null then
for i in 1 .. list.count loop
if (list(i) is not null) then
BEGIN
select count(1) into counter
from t1
inner join t2 on t1.userid=t2.userid
where t1.userid='**';
if(counter > 0) then
do something here...
select col from t2 where t2.userid='***';
do somethingelse here...
end if;
END
end if;
end loop;
end if;
end ;
```
or you can add exception handling into your sp.

?#5 to_date error :ORA-01841: (full) year must be between -4713 and +9999, and not be 0
select regexp_instr('2016-08-01 23:59:59', '\d{4}-\d\d-\d\d \d{2}:\d{2}:\d{2}') from dual;


todo:
/×
array like parameters
method 1: string split
method 2: Array split
method 3: clob split
×/
/×
quotes
http://www.techonthenet.com/oracle/questions/quotes.php
×/
Concatenation Operator https://docs.oracle.com/cd/B19306_01/server.102/b14200/operators003.htm

Best Practice:
COALESCE NVL
NVL is Oracle specific, it was introduced in 80's before there were any standards.
NVL always evaluates both arguments, while COALESCE usually stops evaluation whenever it finds the first non-NULL
Master DB (used by live system/application), Slave DB (readonly db, for backup),
Reporting DB (for analysis)

?#TNS:address already in use
http://www.dba-oracle.com/t_ora_12542_tns_address_already_in_use.htm

[私有库：oracle企业级存储过程](https://github.com/lyhistory/learn_coding/)



```
#################################################################################
## Code snippets
#################################################################################

CREATE OR REPLACE TYPE "Array" IS TABLE OF VARCHAR2(100);


CREATE OR REPLACE FUNCTION STR2ARRAY(
strSource IN VARCHAR2,
delimiter IN VARCHAR2 DEFAULT ','
)
RETURN Array
AS
count NUMBER;
temp VARCHAR2(999999):=strSource||delimiter;
array Array := Array();
BEGIN
LOOP
count := instr(temp, delimiter );
EXIT WHEN (NVL(count,0) = 0);
array.EXTEND;
array(array.COUNT) := LTRIM(RTRIM(SUBSTR(temp, 1, count-1)));
temp := SUBSTR(temp,count+ LENGTH(delimiter) );
END LOOP;
RETURN array;
END STR2ARRAY;

select distinct t1.AA as AA,t2.BB as BB
from table1 t1
inner join
(
select
t_1.column_value as A,
t_2.column_value as B
from
(
select rownum id, column_value
from table(STR2ARRAY('TEST'))) t_1
join
(
select rownum id , column_value from table(STR2ARRAY('TEST2'))
) t_2 on t_1.id = t_2.id
) t2 on t1.AA= (case when t2.A = 'TEST then 'Y' else 'N' end)
where not exists (
select 1
from table3 t3
where t3.C = t2.B
);
SELECT id,
field,
DECODE(NVL(field, 'No'), 'Yes', 'Yes Result do this', NVL(field, 'No'), 'No result do this', 'catch all result do this')
FROM   table
or
SELECT id,
field,
CASE NVL(field, 'No')
WHEN 'Yes' THEN 'Yes Result do this'
WHEN 'No' THEN 'No result do this'
ELSE 'catch all result do this'
END
FROM   table
 
/*
t1: id
t2: id,t1_id,amt
select temp.totalAmt
from t1 t1
left join (select t1_id,sum(amt) as totalAmt from t2 group by t1_id) temp on temp.t1_id=t1.id;
*/
/*select * from table where trunc(datefield)=trunc(TO_DATE('15/01/16', 'DD/MM/YY'));*/
/*
select count,total,average
from(
select t1_id,count,total,case when nvl(count,0)=0 then 0 else round(total/count,2) end as average
from(
select t1_id, count(*) as count, sum(amt) as total
from t2
group by t1_id
)
)
where average>5;
*/
/×
array like parameters
method 1: string split
method 2: Array split
method 3: clob split
×/
/×
quotes
http://www.techonthenet.com/oracle/questions/quotes.php
×/
Concatenation Operator https://docs.oracle.com/cd/B19306_01/server.102/b14200/operators003.htm
 
Best Practice:
Master DB (used by live system/application), Slave DB (readonly db, for backup),
Reporting DB (for analysis)
Big Data Sqoop ? Hbase？

```

<disqus/>