(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{312:function(e,t,a){"use strict";a.r(t);var n=a(0),s=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[a("a",{attrs:{href:"/docs/software"}},[e._v("回目录")]),e._v("  《oracle实用基础》")]),e._v(" "),a("h2",{attrs:{id:"_1-basics"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-basics"}},[e._v("#")]),e._v(" 1. Basics")]),e._v(" "),a("h3",{attrs:{id:"_1-1-concepts"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-concepts"}},[e._v("#")]),e._v(" 1.1 Concepts")]),e._v(" "),a("p",[e._v("tablespace datafiles\n"),a("img",{attrs:{src:"/docs/docs_image/software/oracle/oracle00.png",alt:""}})]),e._v(" "),a("h3",{attrs:{id:"_1-2-setup"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-setup"}},[e._v("#")]),e._v(" 1.2 Setup")]),e._v(" "),a("p",[a("strong",[e._v("server")]),e._v(":\n配置TNSNAMES.ORA files are located on both client and server systems.\nhttps://www.orafaq.com/wiki/Tnsnames.ora")]),e._v(" "),a("p",[e._v("oracle+tomcat连接池\n在实际应用开发中，特别是在WEB应用系统中，如果JSP、Servlet或EJB使用JDBC直接访问数据库中的数据，每一次数据访问请求都必须经历建立数据库连接、打开数据库、存取数据和关闭数据库连接等步骤，而连接并打开数据库是一件既消耗资源又费时的工作，如果频繁发生这种数据库操作，系统的性能必然会急剧下降，甚至会导致系统崩溃。数据库连接池技术是解决这个问题最常用的方法，在许多应用程序服务器（例如：Weblogic, WebSphere,JBoss）中，基本都提供了这项技术，无需自己编程，但是，深入了解这项技术是非常必要的。\nhttps://www.cnblogs.com/lbangel/p/3406084.html")]),e._v(" "),a("p",[a("strong",[e._v("client")]),e._v(":")]),e._v(" "),a("p",[e._v("Oracle Client\nhttp://www.oracle.com/technetwork/database/enterprise-edition/downloads/112010-win32soft-098987.html")]),e._v(" "),a("p",[e._v("Full installation\nOracle SQL Developer\nhttp://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html\nRegister Oracle DLL into global assembly cache.\nhttp://msdn.microsoft.com/en-us/library/dkkx7f79(v=vs.110).aspx")]),e._v(" "),a("p",[e._v("Oracle.DataAccess.dll")]),e._v(" "),a("p",[e._v("** oracle for .net developer **")]),e._v(" "),a("p",[e._v("download http://www.oracle.com/us/products/tools/utilsoft-087491.html")]),e._v(" "),a("p",[e._v("install.bat all "),a("Path",[e._v(" odac\naddling assembly to GAC: Gacutil.exe -i  Oracle.DataAccess.dll\nadding assembly to GAC without Gacutil.exe: http://www.totaldotnet.com/sub/adding-assembly-to-gac-using-command-prompt-without-gacutil-exe\nProblem you may encounter: The provider is not compatible with the version of Oracle client\nThis is Oracle.DataAccess Issue with .net and 64 bit\nhttps://community.oracle.com/thread/3537075?start=0&tstart=0")])]),e._v(" "),a("p",[e._v("Oracle.DataAccess.Client.OracleException: The provider is not compatible with the version of Oracle client\nFor web projects, the iis express by default will use 32bit as standard, two ways can solve this issue:")]),e._v(" "),a("ol",[a("li",[e._v("install 32 bit ODAC https://www.oracle.com/technetwork/topics/dotnet/utilsoft-086879.html")]),e._v(" "),a("li",[e._v("enale iis express settings to 64 bit version: vs2017 for example, tools=>Options=>Projects and Solutions => Web Projects => Use the 64 bit version\nODAC 11.2 Release 5 and Oracle Developer Tools for Visual Studio (11.2.0.3.20) https://www.oracle.com/technetwork/topics/dotnet/utilsoft-086879.html")])]),e._v(" "),a("p",[e._v("Oracle.DataAccess Version compatible issue:")]),e._v(" "),a("p",[e._v("Register to global cache")]),e._v(" "),a("p",[e._v("Change  newVersion in dependentAssembly in web.config")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('  <dependentAssembly>\n       <assemblyIdentity name="Oracle.DataAccess" publicKeyToken="31bf3856ad364e35" culture="neutral"/>\n       <bindingRedirect oldVersion="2.111.6.0" newVersion="4.112.3.0"/>\n     </dependentAssembly>\n')])])]),a("p",[e._v("Reference:\nhttps://docs.oracle.com/html/E10927_01/InstallVersioningScheme.htm\nhttp://www.oracle.com/technetwork/database/windows/downloads/utilsoft-087491.html")]),e._v(" "),a("p",[a("strong",[e._v("using sql developer")])]),e._v(" "),a("p",[e._v("before debug need to 'compile for debug'\nmissing connection menu： https://amoratech.wordpress.com/2011/09/25/sql-developer-3-0-3-0-04-34-connection-menu-is-missing/\nImport from Excel into Oracle www.thatjeffsmith.com/archive/2012/04/how-to-import-from-excel-to-oracle-with-sql-developer/")]),e._v(" "),a("p",[a("strong",[e._v("execute store procedure manually")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("var RESULT refcursor;\nexec sp('id1;6?id2;2?id3;4?id5;11?id4:10',:RESULT);\nprint RESULT;\n")])])]),a("h2",{attrs:{id:"_2-常用语法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-常用语法"}},[e._v("#")]),e._v(" 2.常用语法")]),e._v(" "),a("h3",{attrs:{id:"_2-1-crud"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-crud"}},[e._v("#")]),e._v(" 2.1 CRUD")]),e._v(" "),a("p",[e._v("update with inner join:\nhttp://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle")]),e._v(" "),a("p",[e._v("Cross Join\nhttp://www.w3resource.com/oracle/joins/oracle-cross-join.php\n"),a("img",{attrs:{src:"/docs/docs_image/software/oracle/oracle01.png",alt:""}})]),e._v(" "),a("p",[e._v("Merge Statement\nmerge into table t1 using  table t2 on (t1.id=t2.id)\nwhen match then update set XXX\nwhen not match then insert XXX;")]),e._v(" "),a("p",[e._v("Insert All when else\nhttps://docs.oracle.com/cloud/latest/db112/SQLRF/statements_9014.htm#i2111652\nINSERT ALL\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date, sales_sun)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+1, sales_mon)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+2, sales_tue)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+3, sales_wed)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+4, sales_thu)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+5, sales_fri)\nINTO sales (prod_id, cust_id, time_id, amount)\nVALUES (product_id, customer_id, weekly_start_date+6, sales_sat)\nSELECT product_id, customer_id, weekly_start_date, sales_sun,\nsales_mon, sales_tue, sales_wed, sales_thu, sales_fri, sales_sat\nFROM sales_input_table;")]),e._v(" "),a("h3",{attrs:{id:"_2-2-handle-exception"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-handle-exception"}},[e._v("#")]),e._v(" 2.2 Handle Exception")]),e._v(" "),a("p",[e._v("https://docs.oracle.com/cd/A97630_01/appdev.920/a96624/07_errs.htm")]),e._v(" "),a("h3",{attrs:{id:"_2-3-temp-table"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-temp-table"}},[e._v("#")]),e._v(" 2.3 temp table")]),e._v(" "),a("p",[a("strong",[e._v("create temp table inside sp need extral permission")]),e._v("\n1）ON COMMIT DELETE ROWS 事务级 transaction\n2）ON COMMIT PRESERVE ROWS 会话级 session")]),e._v(" "),a("p",[a("strong",[e._v("split string into temp table")]),e._v("\nhttp://stackoverflow.com/questions/27786412/oracle-stored-procedure-split-string-for-insert-or-update-to-a-table\nhttp://stackoverflow.com/questions/29557207/split-string-and-iterate-for-each-value-in-a-stored-procedure\nhttp://www.techonthenet.com/oracle/index.php")]),e._v(" "),a("h3",{attrs:{id:"_2-4-transpose-column-to-row-列转行"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-transpose-column-to-row-列转行"}},[e._v("#")]),e._v(" 2.4 Transpose Column to Row 列转行")]),e._v(" "),a("p",[e._v("PIVOT https://oracle-base.com/articles/11g/pivot-and-unpivot-operators-11gr1\nhttp://www.2cto.com/database/201206/136218.html\nhttp://blog.sina.com.cn/s/blog_4adc4b090101ges3.html")]),e._v(" "),a("h3",{attrs:{id:"_2-5-dynamic-sql"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-dynamic-sql"}},[e._v("#")]),e._v(" 2.5 Dynamic SQL")]),e._v(" "),a("p",[e._v("http://docs.oracle.com/cd/B28359_01/appdev.111/b28370/dynamic.htm\nhttps://docs.oracle.com/cd/B28359_01/appdev.111/b28370/dynamic.htm#i13057\nDynamic PL/SQL date parameter with time value retained https://stackoverflow.com/questions/18455867/dynamic-pl-sql-date-parameter-with-time-value-retained")]),e._v(" "),a("h3",{attrs:{id:"_2-6-group"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-group"}},[e._v("#")]),e._v(" 2.6 Group")]),e._v(" "),a("p",[e._v("**by having **\nDates: Grouping date-time values into {n} minute buckets. http://steve-lyon.blogspot.sg/2011/08/bucketing-up-date-times-by-various.html\n** sum(decode( **\n** common table expression **\nwith r as (select username, productid, sum(amt) shoppingamt\nfrom transactionlog where transdate = date'2014-06-11'\ngroup by GROUPING SETS((username, productid), (productid))\n)")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("select * from r where username is null;\nwith r as (select productid, sum(amt) shoppingamt\nfrom transactionlog where transdate = date'2014-06-11'\ngroup by rollup(productid)\n)\nselect * from r ;\n")])])]),a("h3",{attrs:{id:"_2-7-package-level-schema-level"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-7-package-level-schema-level"}},[e._v("#")]),e._v(" 2.7 Package level&Schema level")]),e._v(" "),a("p",[a("strong",[e._v("Receive Array/Table as input")]),e._v("\na.Type in database level - can be used as a nested table")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("create or replace TYPE   associateArray     IS   TABLE   OF   varchar2(100);\narrayDatabaselevel  :=new associateArray();\narrayDatabaselevel.extend(1);\narrayDatabaselevel(1) := 'test';\nselect * from table(arrayDatabaselevel)\n")])])]),a("p",[e._v("b.Type in Package level - can only be used in loop")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("create or replace PACKAGE PKG_helloworld AS\nTYPE   associateArray IS TABLE OF varchar2(100) INDEX BY BINARY_INTEGER;\nEND PKG_helloworld ;\n-------------------\ncreate or replace PROCEDURE test(\narrayPackageLevelin PKG_helloworld.associateArray\n).........................\nif arrayPackageLevelis not null then\nfor i in 1 .. arrayPackageLevel.count loop\nif (arrayPackageLevel(i) is not null) then\nname := regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 1); number := to_number(regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 3))；date := to_date(regexp_substr(arrayPackageLevel(i), '[^,]+', 1, 2),'yyyy-mm-dd hh24:mi:ss');\n")])])]),a("p",[e._v("c.Mixed")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("arrayDatabaselevel  := associateArray();\narrayDatabaselevel.extend(arrayPackageLevel.count);\nfor i in arrayPackageLevel.first .. arrayPackageLevel.last loop\narrayDatabaselevel(i) := arrayPackageLevel(i);\nend loop;\n")])])]),a("p",[e._v("important deadlock issue here：")]),e._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/oracle/oracle02.png",alt:""}})]),e._v(" "),a("h3",{attrs:{id:"_2-8-exec-store-procedure-and-export-to-csv-file"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-8-exec-store-procedure-and-export-to-csv-file"}},[e._v("#")]),e._v(" 2.8 exec store-procedure and export to csv file")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("set colsep ','\nvar    input1 VARCHAR2(10);\nvar    input2 VARCHAR2(10);\nvar results REFCURSOR\nbegin\n:input1 := '2016-01-01';\n:input2 := '100';\nstoreProcedure(:input1,:input2,:results);\nend;\n/\nspool /tmp/results.csv\nprint results;\n\n### \n\n\ndeclare\nv_sql varchar2(5000);\nbegin\nv_sql := q'[select\ncol1||','||\ncol2\nfrom\n(\nselect * from ***\n)\norder by col1]';\ndump_sql_to_csv(v_sql, 'example.csv');\nend;\n/\n\n")])])]),a("h3",{attrs:{id:"_2-9-scheduler"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-9-scheduler"}},[e._v("#")]),e._v(" 2.9 Scheduler")]),e._v(" "),a("p",[e._v("https://docs.oracle.com/cd/B28359_01/server.111/b28310/schedadmin006.htm\nhttps://docs.oracle.com/cd/B28359_01/server.111/b28310/scheduse004.htm#ADMIN12413\nScheduler Running log https://docs.oracle.com/cd/E18283_01/server.112/e17120/scheduse008.htm")]),e._v(" "),a("h3",{attrs:{id:"_2-10-build-in-functions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-10-build-in-functions"}},[e._v("#")]),e._v(" 2.10 build-in functions")]),e._v(" "),a("p",[e._v("regexp_substr：\nhttps://www.techonthenet.com/oracle/functions/regexp_substr.php")]),e._v(" "),a("p",[e._v("analytic functions：\n--https://oracle-base.com/articles/misc/rank-dense-rank-first-last-analytic-functions\nselect t1.id, min(amt) keep (DENSE_RANK FIRST ORDER BY datecreated desc) as amount\nfrom money_transferlog t1\ngroup by t1.id")]),e._v(" "),a("h2",{attrs:{id:"_3-troubleshooting"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-troubleshooting"}},[e._v("#")]),e._v(" 3.troubleshooting")]),e._v(" "),a("p",[e._v("?# :ORA-01861: literal does not match format string\ne.g date format, need to convert\ns_dateList(i):= to_date(dateList(i),'yyyy-mm-dd hh24:mi:ss');")]),e._v(" "),a("p",[e._v("?#-1 No Data found:\nalways handle exception for 'select column into ***'")]),e._v(" "),a("p",[e._v("?#0 insert special character :  '  &\nhttp://www.blogjava.net/pengpenglin/archive/2008/01/16/175689.html")]),e._v(" "),a("p",[e._v("?#1 parameter name cannot be the same with column name !!!\nSELECT × FROM TABLE COL_NAME=INPUT_NAME\nexact fetch returns more than requested number of rows")]),e._v(" "),a("p",[e._v("?#2 date format\nwrong: to_char(DateColumn, 'yyyy-MM-dd hh:mm:ss')\ncorrect: to_char(DateColumn, 'yyyy-MM-dd hh24:mi:ss')")]),e._v(" "),a("p",[e._v("?#3 Input is too long (> 2499 characters) - line ignored\nSol: if it happens in store procedure, simply make it multi lines instead one long single line")]),e._v(" "),a("p",[e._v("?#4 no data found Exception\nselect sum(*) count(1) into won't cause exception,\nselect ")]),a("col"),e._v(" into "),a("name",[e._v(" may cause error:ORA-01403: no data found\none typical scenario: let's say we have two table t1 and t2 joined by userid, then in one sp you wrote like:"),a("p"),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("create or replace PROCEDURE\n(\nlist in PKG.associateArray,\nresult out sys_refcursor\n)\nAS\ncounter int;\nmsg varchar2(1000);\nBEGIN\nif list is not null then\nfor i in 1 .. list.count loop\nif (list(i) is not null) then\nBEGIN\nselect count(1) into counter from t1 where t1.userid='**';\nif(counter > 0) then\ndo something here\nselect col from t2 where t2.userid='***';\ndo somethingelse here...\nend if;\nEND\nend if;\nend loop;\nend if;\nend ;\n")])])]),a("p",[e._v("this is the common error we all may have write like that, correct one should be :")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("create or replace PROCEDURE\n(\nlist in PKG.associateArray,\nresult out sys_refcursor\n)\nAS\ncounter int;\nmsg varchar2(1000);\nBEGIN\nif list is not null then\nfor i in 1 .. list.count loop\nif (list(i) is not null) then\nBEGIN\nselect count(1) into counter\nfrom t1\ninner join t2 on t1.userid=t2.userid\nwhere t1.userid='**';\nif(counter > 0) then\ndo something here...\nselect col from t2 where t2.userid='***';\ndo somethingelse here...\nend if;\nEND\nend if;\nend loop;\nend if;\nend ;\n")])])]),a("p",[e._v("or you can add exception handling into your sp.")]),e._v(" "),a("p",[e._v("?#5 to_date error :ORA-01841: (full) year must be between -4713 and +9999, and not be 0\nselect regexp_instr('2016-08-01 23:59:59', '\\d{4}-\\d\\d-\\d\\d \\d{2}:\\d{2}:\\d{2}') from dual;")]),e._v(" "),a("p",[e._v("todo:\n/×\narray like parameters\nmethod 1: string split\nmethod 2: Array split\nmethod 3: clob split\n×/\n/×\nquotes\nhttp://www.techonthenet.com/oracle/questions/quotes.php\n×/\nConcatenation Operator https://docs.oracle.com/cd/B19306_01/server.102/b14200/operators003.htm")]),e._v(" "),a("p",[e._v("Best Practice:\nCOALESCE NVL\nNVL is Oracle specific, it was introduced in 80's before there were any standards.\nNVL always evaluates both arguments, while COALESCE usually stops evaluation whenever it finds the first non-NULL\nMaster DB (used by live system/application), Slave DB (readonly db, for backup),\nReporting DB (for analysis)")]),e._v(" "),a("p",[e._v("?#TNS:address already in use\nhttp://www.dba-oracle.com/t_ora_12542_tns_address_already_in_use.htm")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/lyhistory/learn_coding/",target:"_blank",rel:"noopener noreferrer"}},[e._v("私有库：oracle企业级存储过程"),a("OutboundLink")],1)]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("#################################################################################\n## Code snippets\n#################################################################################\n\nCREATE OR REPLACE TYPE \"Array\" IS TABLE OF VARCHAR2(100);\n\n\nCREATE OR REPLACE FUNCTION STR2ARRAY(\nstrSource IN VARCHAR2,\ndelimiter IN VARCHAR2 DEFAULT ','\n)\nRETURN Array\nAS\ncount NUMBER;\ntemp VARCHAR2(999999):=strSource||delimiter;\narray Array := Array();\nBEGIN\nLOOP\ncount := instr(temp, delimiter );\nEXIT WHEN (NVL(count,0) = 0);\narray.EXTEND;\narray(array.COUNT) := LTRIM(RTRIM(SUBSTR(temp, 1, count-1)));\ntemp := SUBSTR(temp,count+ LENGTH(delimiter) );\nEND LOOP;\nRETURN array;\nEND STR2ARRAY;\n\nselect distinct t1.AA as AA,t2.BB as BB\nfrom table1 t1\ninner join\n(\nselect\nt_1.column_value as A,\nt_2.column_value as B\nfrom\n(\nselect rownum id, column_value\nfrom table(STR2ARRAY('TEST'))) t_1\njoin\n(\nselect rownum id , column_value from table(STR2ARRAY('TEST2'))\n) t_2 on t_1.id = t_2.id\n) t2 on t1.AA= (case when t2.A = 'TEST then 'Y' else 'N' end)\nwhere not exists (\nselect 1\nfrom table3 t3\nwhere t3.C = t2.B\n);\nSELECT id,\nfield,\nDECODE(NVL(field, 'No'), 'Yes', 'Yes Result do this', NVL(field, 'No'), 'No result do this', 'catch all result do this')\nFROM   table\nor\nSELECT id,\nfield,\nCASE NVL(field, 'No')\nWHEN 'Yes' THEN 'Yes Result do this'\nWHEN 'No' THEN 'No result do this'\nELSE 'catch all result do this'\nEND\nFROM   table\n \n/*\nt1: id\nt2: id,t1_id,amt\nselect temp.totalAmt\nfrom t1 t1\nleft join (select t1_id,sum(amt) as totalAmt from t2 group by t1_id) temp on temp.t1_id=t1.id;\n*/\n/*select * from table where trunc(datefield)=trunc(TO_DATE('15/01/16', 'DD/MM/YY'));*/\n/*\nselect count,total,average\nfrom(\nselect t1_id,count,total,case when nvl(count,0)=0 then 0 else round(total/count,2) end as average\nfrom(\nselect t1_id, count(*) as count, sum(amt) as total\nfrom t2\ngroup by t1_id\n)\n)\nwhere average>5;\n*/\n/×\narray like parameters\nmethod 1: string split\nmethod 2: Array split\nmethod 3: clob split\n×/\n/×\nquotes\nhttp://www.techonthenet.com/oracle/questions/quotes.php\n×/\nConcatenation Operator https://docs.oracle.com/cd/B19306_01/server.102/b14200/operators003.htm\n \nBest Practice:\nMaster DB (used by live system/application), Slave DB (readonly db, for backup),\nReporting DB (for analysis)\nBig Data Sqoop ? Hbase？\n\n")])])])])],1)}),[],!1,null,null,null);t.default=s.exports}}]);