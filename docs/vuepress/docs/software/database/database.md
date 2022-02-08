

##Protocol
simple query vs extended protocol
https://github.com/npgsql/npgsql/issues/370
Hacking SQL Server https://groupby.org/conference-session-abstracts/hacking-sql-server/
SQL server security https://cqureacademy.com/blog/secure-server/sql-server-security


## DB Connection misconception
Difference between driver and provider https://stackoverflow.com/questions/19293744/difference-between-driver-and-provider
Driver is a program installed on a workstation or a server; it allows programs to interact with a Database Management System (DBMS). Such as, JDBC driver provides database connectivity through the standard JDBC application program interface (APIs) available in J2EE.
A data provider is a set of libraries that is used to communicate with data source. Such as, SQL data provider for SQL, Oracle data provider for Oracle, OLE DB data provider for access, excel and MySQL. It serves as a bridge between an application and a data source and is used to retrieve data from a data source and to reconcile changes to that data back to the data source.


DB Access => DB provider(ODP.NET) => DB driver(Oracle for .net ODAC, JDBC)
DB Driver maintain connection pool (closed put into pool)

## Connection pool
数据库前加反向代理：tomcat或ngnix等
https://www.youtube.com/watch?v=3JMK1JK5UEo

https://docs.oracle.com/cd/E15586_01/fusionapps.1111/e20836/conn_pool.htm
https://social.msdn.microsoft.com/Forums/vstudio/en-US/a5239fc6-151b-4e3a-97e3-286c8c785f7b/c-net-in-iis-connection-pooling-question?forum=csharpgeneral

Pgbouncer and pg pooling cannot use together
https://pgbouncer.github.io/usage.html#quick-start

Performance monitor config
https://docs.oracle.com/cd/E15296_01/doc.111/e15167/featConnecting.htm#CJAFIDDC