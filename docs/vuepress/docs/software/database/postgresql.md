---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《postgresql实用基础》

## 1. Setup
### 1.1 Baisc Setup

#### 1.1.1 install



#### 1.1.2 client连接

直接psql连接是不行的，要切换成os root用户 sudo su

然后执行  su - postgres

进入bash，输入psql就进入到plsql命令窗口，执行\l就可以看到所有db

理解一下posgresql的用户概念

https://www.liquidweb.com/kb/what-is-the-default-password-for-postgresql/

本机如果直接通过plsql连接，可以修改local用户(默认用户postgres)：

https://www.hostinger.com/tutorials/how-to-install-postgresql-on-centos-7/

```
psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'NewPassword';"
```

https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge



**开启远程连接：**

https://blog.csdn.net/zhangzeyuaaa/article/details/77941039

step 1：开启监听：

 /var/lib/pgsql/12/data/postgresql.conf

`listen_addresses = '*'          # what IP address(es) to listen on;`

step 2：修改访问规则

md5方式：

vim /var/lib/pgsql/12/data/pg_hba.conf 

`host    all             all             0.0.0.0/0            md5`

---------------------------------------------

https://www.tutorialspoint.com/postgresql/index.htm
https://serverfault.com/questions/110154/whats-the-default-superuser-username-password-for-postgres-after-a-new-install

Postgresql
https://serverfault.com/questions/110154/whats-the-default-superuser-username-password-for-postgres-after-a-new-install

Server based database
Replication

su - postgres
psql

Client
    Offical: Pgadmin 4    https://www.pgadmin.org/download/
    Pgadmin3 LTS by BigSQL (don’t support 11g)
    DBeaver (not good)

CLI
C# 连接 PostgreSQL --- Npgsql的安装和使用 https://blog.csdn.net/chencglt/article/details/77706226 

删除“重复”的function或stored procedure，比如：bpchar和varchar：
![](/docs/docs_image/software/postgresql/postgresql01.png)

### 1.2 High Availability

> Database servers can work together to allow a second server to take over quickly if the primary server fails (high availability), or to allow several computers to serve the same data (load balancing). Ideally, database servers could work together seamlessly. Web servers serving static web pages can be combined quite easily by merely load-balancing web requests to multiple machines. In fact, read-only database servers can be combined relatively easily too. Unfortunately, most database servers have a read/write mix of requests, and read/write servers are much harder to combine. This is because though read-only data needs to be placed on each server only once, a write to any server has to be propagated to all servers so that future read requests to those servers return consistent results.
>
> This synchronization problem is the fundamental difficulty for servers working together. Because there is no single solution that eliminates the impact of the sync problem for all use cases, there are multiple solutions. Each solution addresses this problem in a different way, and minimizes its impact for a specific workload.
>
> https://www.postgresql.org/docs/current/high-availability.html

#### 1.2.1 Replication不同方案：

https://www.postgresql.org/docs/current/different-replication-solutions.html

+ Shared Disk Failover：

​	Shared hardware functionality is common in network storage devices.

+ File System (Block Device) Replication

A modified version of shared hardware functionality 

DRBD is a popular file system replication solution for Linux.

+ Write-Ahead Log Shipping

A standby server can be implemented using file-based log shipping ([Section 26.2](https://www.postgresql.org/docs/current/warm-standby.html)) or streaming replication (see [Section 26.2.5](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION)), or a combination of both. For information on hot standby, see [Section 26.5](https://www.postgresql.org/docs/current/hot-standby.html).

+ Logical Replication

Allows a database server to send a stream of data modifications to another server.  [Chapter 30](https://www.postgresql.org/docs/current/logical-replication.html).([Chapter 48](https://www.postgresql.org/docs/current/logicaldecoding.html)

+ Trigger-Based Master-Standby Replication

The standby can answer read-only queries while the master server is running. The standby server is ideal for data warehouse queries.Slony-I is an example of this type of replication, with per-table granularity, and support for multiple standby servers. Because it updates the standby server asynchronously (in batches), there is possible data loss during fail over.

+ Statement-Based Replication Middleware

ach server operates independently. Read-write queries must be sent to all servers, so that every server receives any changes. But read-only queries can be sent to just one server, allowing the read workload to be distributed among them.Care must also be taken that all transactions either commit or abort on all servers, perhaps using two-phase commit ([PREPARE TRANSACTION](https://www.postgresql.org/docs/current/sql-prepare-transaction.html) and [COMMIT PREPARED](https://www.postgresql.org/docs/current/sql-commit-prepared.html)). Pgpool-II and Continuent Tungsten are examples of this type of replication.

+ Asynchronous Multimaster Replication

each server works independently, and periodically communicates with the other servers to identify conflicting transactions. The conflicts can be resolved by users or conflict resolution rules. Bucardo is an example of this type of replication.

+ Synchronous Multimaster Replication

PostgreSQL does not offer this type of replication

+ Commercial Solutions

+ Data Partitioning

Data partitioning splits tables into data sets. Each set can be modified by only one server. For example, data can be partitioned by offices, e.g., London and Paris,

+ Multiple-Server Parallel Query Execution

Many of the above solutions allow multiple servers to handle multiple queries, but none allow a single query to use multiple servers to complete faster. This solution allows multiple servers to work concurrently on a single query. It is usually accomplished by splitting the data among servers and having each server execute its part of the query and return results to a central server where they are combined and returned to the user. 

#### 1.2.2 具体方案1：warm standby or log shipping

https://www.postgresql.org/docs/current/warm-standby.html

The primary server operates in continuous archiving mode, while each standby server operates in continuous recovery mode, reading the WAL(write ahead logging) files from the primary(Directly moving WAL records from one database server to another is typically described as log shipping). 

#### 1.2.3 具体方案2：hot standby 

https://www.postgresql.org/docs/current/hot-standby.html

#### 1.2.4 具体配置 温备/热备

http://www.mamicode.com/info-detail-2466322.html



## 2. Gaps between Oracle PLSQL and PostgreSQL
https://github.com/digoal/blog/blob/master/201607/20160714_01.md

https://wiki.postgresql.org/wiki/Oracle_to_Postgres_Conversion

### 2.1 oracle keep dense_rank CHANGE in postgresql 
https://www.eversql.com/rank-vs-dense_rank-vs-row_number-in-postgresql/

### 2.2 oracle is record, is table CHANGE in postgresql
```
type rec_tk is record(
	tkno VARCHAR2(100),
	cg_zdj number(12, 0) := 0,
	cg_jsf number(12, 0) := 0
);
type tklist is table of rec_tk index by binary_integer;
```

修改为

```
create type rec_tk as(
tkno VARCHAR(100),
cg_zdj numeric(12,0),
cg_jsf numeric(12,0)
);

#函数外执行创建类型的SQL
create type rec_cjr as(
cjrid varchar(30),
tk rec_tk[]
);
#函数内对table的使用修改为数组的使用，数组的下标从1开始
p_cjrs rec_cjr[];
```

## 基本概念

表空间

postgres=# select * from pg_tablespace;
 oid  |  spcname   | spcowner | spcacl | spcoptions
------+------------+----------+--------+------------
 1663 | pg_default |       10 |        |
 1664 | pg_global  |       10 |        |
(2 rows)



## 3. Gramma

Assign null or empty ‘’ to numberic,  to_number(‘’) throw exception, use if else instead
Bigint default value is NULL not 0

### 3.1 Basic

**format**:
https://www.postgresql.org/docs/7.4/static/functions-formatting.html
	Oracle to_char(param)
	postgresql 	to_char(parma1, ‘999’)
	Oracle to_date(str, ‘yyyy-mm-dd hh24:mi:ss’)
	Postgresql to_timestamp(str, ‘yyyy-mm-dd hh24:mi:ss’)
**Datetime**
https://www.postgresql.org/docs/9.1/static/functions-datetime.html
select extract (day from timestamp '2011-01-01 01:01:01' - timestamp '2001-01-01 01:01:01');
**System**
Oracle rownum / now(), sysdate	
postgresql: limit / now(), CURRENT_DATE
https://thebuild.com/blog/2018/08/07/does-anyone-really-know-what-time-it-is/
**Concat**
	Character string connector (||) will fail in postgresql when there is ‘’ or null
	concat()
	Format	v_sql := format($$select * from table where col1=%s$$,’test’)
**NULL and empty string**
Assign null or empty ‘’ to numberic,  to_number(‘’) throw exception, use if else instead
Bigint default value is NULL not 0
Oracle NVL()
PGSQL coalesce()
**Returning into**
https://stackoverflow.com/questions/7191902/cannot-select-from-update-returning-clause-in-postgres
Oracle: SQL%ROWCOUNT
PG: GET DIAGNOSTICS integer_var = ROW_COUNT;

**Tables and Views**
The new query must generate the same columns that were generated by the existing view query (that is, the same column names in the same order and with the same data types) (...)

### 3.2 CRUD

```
Oracle bulk collect into
Pgsql Offset 
/*CREATE TYPE t_my AS (
    col1    numeric(16,6),
    col2    numeric,
    col3 bpchar(36)
    );*/
    
do $$DECLARE   
c cursor(os int) for select * from table limit 5 offset os;
r record;
v_name varchar(100)[];
recs t_my[];
BEGIN

    select array (select row(0, col, 'aaa') from table1 limit 5 offset 10 ) into recs;
    --v_games:= array_to_string(v_name,',');
    raise notice '%', recs[1].col1;
END
$$;
```

```
Oracle merge into
Pgsql insert into
https://www.postgresql.org/docs/9.5/static/sql-insert.html
insert into table1 as t1(col1,col2, col3)
select col1, col2,col3
from ( select col1,col2, max(col3) as col3
 from table2
 where col3 >= date'2012-01-01'
 and col3 <date'2013-01-01'
 and col1 is not null
 and col2 is not null
 group by col1, col2 ) a
on conflict(col1, col2) do
update set col3 = excluded.col3,
   	 col2 = case when excluded.col2 is null then t1.col2 else excluded.col2 end

```

For update

### 3.3 Functions & Stored Procedure
Use the right type, character to numeric
v_product := to_number(p_walletcode);

Dont use FROM DUAL in procedrue

Json

Json array
https://stackoverflow.com/questions/24006291/postgresql-return-result-set-as-json-array/24006432

PostgreSQL Error Codes:
array_length(array[1,2,3], 1) https://www.postgresql.org/docs/9.1/static/functions-array.html

**Transaction**
	
Cursor:
https://www.postgresql.org/docs/11/static/sql-call.html

cannot commit while a subtransaction is active to_json

https://hashrocket.com/blog/posts/faster-json-generation-with-postgresql
select row_to_json(t) from ( select id, text from words ) t

**Functions**

Perform function
https://stackoverflow.com/questions/18315633/calling-functions-with-exec-instead-of-select 

**Dynamic sql**
https://stackoverflow.com/questions/12780275/dynamic-sql-query-in-postgres
execute immediate v_sql into v_count;

**Cursor and fetch**
https://www.postgresql.org/docs/9.3/static/sql-fetch.html
https://www.postgresql.org/docs/9.3/static/plpgsql-cursors.html
![](/docs/docs_image/software/postgresql/postgresql02.png)

**Exception handling**
https://www.postgresql.org/docs/8.2/static/plpgsql-statements.html
No data found
Select into strict
```
SELECT * INTO myrec FROM emp WHERE empname = myname;
IF NOT FOUND THEN
	RAISE EXCEPTION 'employee % not found', myname;
END IF;
```
If the STRICT option is specified, the query must return exactly one row or a run-time error will be reported, either NO_DATA_FOUND (no rows) or TOO_MANY_ROWS (more than one row). You can use an exception block if you wish to catch the error, for example:
```
BEGIN
    SELECT * INTO STRICT myrec FROM emp WHERE empname = myname;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE EXCEPTION 'employee % not found', myname;
        WHEN TOO_MANY_ROWS THEN
            RAISE EXCEPTION 'employee % not unique', myname;
END;
```

### 3.4 Advanced
**Temp table**
https://github.com/yallie/pg_global_temp_tables
![](/docs/docs_image/software/postgresql/postgresql03.png)

**Sequence**
https://www.postgresql.org/docs/8.2/static/functions-sequence.html

**Customized Types**

https://www.postgresql.org/docs/9.6/static/sql-createtype.html

CREATE TYPE “XYZ” AS TABLE OF VARCHAR2(104) in postgresql https://stackoverflow.com/questions/24017175/create-type-xyz-as-table-of-varchar2104-in-postgresql

Array[] as input
https://www.postgresql.org/docs/9.1/static/arrays.html
https://stackoverflow.com/questions/570393/postgres-integer-arrays-as-parameters

https://stackoverflow.com/questions/3660787/how-to-list-custom-types-using-postgres-information-schema

**Analysis**
Window function
https://www.postgresql.org/docs/11/static/tutorial-window.html
https://gist.github.com/dialogbox/454380d6a68344556350bb8dbf1d64e5
```
select  col1, col2, min(col3)  points
 from (select t1.col1, t1.col2,
        	first_value(col3) over w as col3  
        	from table1  t1
        	where t1.date >= to_date('2018-01-01','yyyy-mm-dd')
        	and t1.date<to_date('2018-07-01','yyyy-mm-dd')
        	window w AS(
   			 partition by col1,col2
   			 order by date desc
   		 )      	 
) t group by col1, col2
order by 1,2;
```

**Dynamic cursor**

```
In sp pg_test:
	INOUT results refcursor)
	results := 'cur';
_query_:=’select * from table’;
perform pg_dyncursor('cur', _query_);
Then in plsql:
	Begin
		Call pg_test();
	End;
FETCH ALL IN cur;
close cur;

CREATE OR REPLACE FUNCTION pg_dyncursor(cursor_name text, query text)
	RETURNS void
	LANGUAGE plpgsql
AS $function$
DECLARE
BEGIN 
	EXECUTE 'DECLARE' || quote_ident(cursor_name) || ' CURSOR WITH HOLD FOR ' || query;
END 
$function$
```

**Scheduler**

https://github.com/citusdata/pg_cron
https://crontab.guru/

SELECT cron.schedule('0 2 * * *', $$TODO$$);
![](/docs/docs_image/software/postgresql/postgresql04.png)
https://www.pgadmin.org/docs/pgadmin3/1.22/pgagent.html

**Message Flow / Protocol Flow**
https://www.postgresql.org/docs/11/static/protocol-flow.html
Simple query:
Recommended practice is to code frontends in a state-machine style that will accept any message type at any time that it could make sense, rather than wiring in assumptions about the exact sequence of messages
Extended query:

## 4. Drivers

### 4.1 .NET npgsql
https://github.com/npgsql

**about composite array**
Normal Array

Array of Composite Type (custom type)
Feature added in 4.0
http://www.npgsql.org/doc/release-notes/4.0.html
https://github.com/npgsql/npgsql/blob/fc1e183103ac6246bcb5d7ceacbf509e18248583/test/Npgsql.Tests/Types/CompositeTests.cs
https://github.com/npgsql/npgsql/commit/fc1e183103ac6246bcb5d7ceacbf509e18248583

Composite 
https://github.com/npgsql/npgsql/issues/1678

Why do I get “Invalid attempt to call HasRows when reader is closed” with an open connection? https://stackoverflow.com/questions/13968342/why-do-i-get-invalid-attempt-to-call-hasrows-when-reader-is-closed-with-an-ope

**about inout parameters in stored procedure**
这个问题是我测试当时最新版本的postgresql并且用了最新的npgsql driver的时候遇到一个问题，
就是存储过程的inout参数拿不到返回结果，经过研究发现奇怪的行为：
1.通过更改npgsql的代码采用simple query这种不安全的协议就可以拿到结果；
2.但是用ngpsql自身默认的extend协议就拿不到；
后来跟ngpsql作者沟通，npgsql作者又跟pgsql的团队沟通，证明确实是pgsql的一个bug，沟通见下面我提的ticket：
INOUT parameters from Procedure 
https://github.com/npgsql/npgsql/issues/2078
https://github.com/npgsql/npgsql/issues/2006

下面是我思考并研究的大致过程，
大致思路就是我发现用某些pgsql客户端调用这种存储过程有返回，有些没有返回，比如pgadmin有返回，dbeaver没有返回，
所以就抓包pgadmin，对比通过npgsql调用的包，最后发现pgadmin是用simple query方式调用，
所以最终修改了npgsql驱动让其支持simple query，因为本身simple query就不安全，所以我没有给出代码，
当然如果有人感兴趣可以联系我

Test Scripts

```
call pg_test('9cc4afef-aab7-4c35-bdcd-a9f3d0152eb4','');

begin
call pg_test2('9cc4afef-aab7-4c35-bdcd-a9f3d0152eb4','');
fetch all in cur;
commit;
end

-- PROCEDURE: sgc2.pg_test(character varying, text)

-- DROP PROCEDURE sgc2.pg_test(character varying, text);

CREATE OR REPLACE PROCEDUREpg_test(
	userid character varying,
	INOUT results text)
LANGUAGE 'plpgsql'

AS $BODY$
DECLARE

BEGIN
	
	select cast(999 as decimal) as result;

END;
$BODY$;
```

c# code:
```
public string Execute2(string spName, IEnumerable<NpgsqlParameter> parameters)
       {
           string result;
           try
           {
               using (var conn = new NpgsqlConnection(_connectionString))
               {
                   conn.Open();
                   List<NpgsqlParameter> _params = parameters.ToList();
                   using (var cmd = conn.CreateCommand())
                   {
                       _params.Add(new NpgsqlParameter("", "")); // Add empty string for refcursor param
                       cmd.CommandText = BuildQuery(spName, _params);
                       //cmd.Parameters.Add(new NpgsqlParameter() { ParameterName = "results", Direction = ParameterDirection.InputOutput, Value = "" });
                       var res = cmd.ExecuteScalar();
                       result = res?.ToString();
                  
                   }
                   //string sql = "select pg_test3('9cc4afef-aab7-4c35-bdcd-a9f3d0152eb4');";
                   //var cmd2 = new NpgsqlCommand(sql, conn);
                   //var result2 = cmd2.ExecuteScalar();
                   //var test = JsonConvert.DeserializeObject<ResultModel>(result);
                   conn.Close();
               }
           }
           catch (Exception e)
           {
               _log.Exception(e);
               throw;
           }
           return result;
       }

```
debug output:
Check from Immediate window
System.Text.Encoding.Default.GetString(Buffer)

![](/docs/docs_image/software/postgresql/postgresql05.png)

然后用wireshark抓包请求call sp之后的返回
![](/docs/docs_image/software/postgresql/postgresql06.png)

Failed idea: Compare with SP which has return value(refcursor)
Not what I want!
![](/docs/docs_image/software/postgresql/postgresql07.png)

Idea: compare with pgadmin4, because pgadmin4 works!
![](/docs/docs_image/software/postgresql/postgresql08.png)

改源码 simple query 
![](/docs/docs_image/software/postgresql/postgresql09.png)
有返回，离成功近了

但是npg抛错
![](/docs/docs_image/software/postgresql/postgresql10.png)

Idea: Compare with simple function( and procedure) to observer the result
![](/docs/docs_image/software/postgresql/postgresql11.png)

最终
![](/docs/docs_image/software/postgresql/postgresql12.png)

Nuget
Update-Package –reinstall
https://docs.microsoft.com/en-us/nuget/consume-packages/reinstalling-and-updating-packages

Simple query
https://www.postgresql.org/docs/10/static/protocol-flow.html#id-1.10.5.7.4
Message flow
https://www.postgresql.org/docs/10/static/protocol-flow.html

Explain
https://www.postgresql.org/docs/9.5/static/sql-explain.html

Refer
https://www.asciitable.com
