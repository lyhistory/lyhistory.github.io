
刚参加工作生活踩过的一些坑，刚开始觉着都很诡异，现在看来都很简单，不值一哂，算是曾经青春的印记吧。。。

基本思路：
找到log（db log[由于没有及时commit，所以db log没法及时显示，建议采用写入log server代替直接把log存入db的做法]，event log，文本log，如果采用log server小心，由于数据量大web ui往往不显示超长的内容，比如response之类的，所以要查到文件本身）），分段调试逐步逼近，隐藏的文件（配置文件），config的加载位置（phpinfo）
当前的版本
换种语言测试（比如db连接问题）
比较特别的调试，比如手机app，采用fiddler+proxy的方式，具体参见个人setup文档
相信科学


# 1.编码问题
1) 最基本的文件处理:
文件传输过程要注意编码,最好使用binary,比如ftp或scp传输,否则会造成乱码
文件读写,在读写打开文件的时候指定编码和读取方式,比如 utf-8, binary mode
2).隐藏的字符，
不显示的字符special character, invisiable character hiding ,"不显示"的原因是因为系统语言或编辑器的原因
很容易出现的问题，比如 从word中copy出来贴到html editor里面，或者是某条命令贴到cmd窗体,尤其是hyphen，cmd命令 比如 ×××.exe install -servicename "test"， 如果从word文档copy出来就会出错
另外在测试geth的时候遇到过，不小心敲了某个按键，看到打出来的命名是对的，执行却遇到如下问题：
No visible cause for “Unexpected token ILLEGAL” https://stackoverflow.com/questions/12719859/no-visible-cause-for-unexpected-token-illegal
3) 换行符，
windows下和linux下不同，尤其是在非utf-8编码的时候，所以优先转成utf-8编码尝试，winscp修改上传一些shell脚本的时候，执行时出现类似问题
4) DB编码（sqlserver N'中文')；html编码，编辑器本身编码，传输方式的编码
5).版本库repository的编码, 多说一句,千万注意大小写, 由于windows系统对文件大小写不敏感,而造成有时候手误敲错branch的某个字母大小写跟remote repository不同造成无法提交
6) 缩进符（tab）
yaml/python
7）serialize and deserialize， 比如
{'timestamp': u'2018-01-02T07:59:16.141Z', 'data': u'{"ID":1,"inner":{}}'}
此处两个问题，一个是u'编码，可以替换成'，一个是data的类型需要反序列化为string
8).配置文件config文件，
比如DB连接配置文件，字符串转义，比如小于号< (&lt)，所以还是建议用加密字符串，

9)utf-8 or unicode
Be careful with using Unicode text, as similar looking (or even identical) characters can have different code points and as such will be encoded as a different byte array (from solidity documentation)

## 2. 时间的坑
1).各种标准，有的mm代表minute，有的代表month， yyyy-MM-dd，oracle yyyy-mm-dd  hh24:mi:ss
2).unix timestamp（10位，13位数）注意是精确到毫秒还是秒，不然转成日期会有溢出
3).时间 精度（同一秒数据重叠问题）,所以对于高频写入精度需要至少到毫秒
所以    <2017-01-01 23:59:59 和 <2017-01-02 00:00:00是不同的，
4).跨月/年计算（日期计算循环极易出错）
2016-12-31 2017-01-01 , dayOfYear
5).时区问题（跟不同时区的第三方同步数据不一致）
6).24小时or12小时制, 千万小心尽量使用24小时,否则有可能造成有时候上午测试好的，下午测试挂的

## 3.开源软件的坑
http://www.techug.com/post/open-source-licenses.html
开源不等于免费软件，免费软件也不等于开源软件，开源软件固然很有诱惑力，目前知道的坑有：
1).IT Law 版权 copyright，如果你的产品中涉及到开源软件，要小心你软件的版权问题，很有可能你开发出来的软件并不属于你自己
2).免费版和商业版，往往免费版存在各种潜在的危险，代码开源意味着对黑客来说也是开源的，所以你将继承其所有的弱点；当然各种潜规则也将耗费你大量的时间来调查，甚至是付出昂贵的金钱代价
3).升级问题
a.server端升级，客户端lib没有升级引发问题，如果redis server升级，stackexchange.redis client未升级导致无法连接server
b.由于框架本身升级没有官方支持，或者因为已经对当前版本做了太多customize导致升级成本升高，以及升级带来的一连串影响，比如第三方的集成出现问题（加密方式）
4).用法问题, 比如redis用做缓存是很好的,但是如果非要用来精确的业务逻辑相关则会有致命的问题,比如数据丢失: https://redis.io/topics/replication

Docker container 机器重启丢失

## 4. Cache问题
1）runtime缓存
比如很多php项目都会做伪静态，所以要检查
resource 缓存
静态页面缓存
2）编译缓存
对于.net有高速缓存（dll版本），所以需要clean掉，另外与之相关的比如通过nuget安装了某个package，会按照dependency，但是uninstall的时候没有remove dependency dll，造成一些问题，还有，project reference，dll property没有copy set true，所以造成一些问题
对于maven project，之前在做hadoop的时候遇到过，后来是删除了.mvn解决的，很多时候都是有类似的这种隐藏的缓存文件造成问题，所以先clean再build 不行就remove hidden file and try again

## 5. DB的坑
1) 关于mongodb
auth method，版本，
objectID
嵌套数组设计与使用的坑（嵌套还是引用）
MongoDB deployment. (standalone, replica set, sharded cluster).
2) 关于oracle
store procedure 参数跟字段千万不能同名，否则就各种诡异了
varchar nvarchar mismatch=> n'TestVarchar'
sysdate？now？
临时表 ON COMMIT DELETE ROWS ；ON COMMIT PRESERVE ROWS
view的坑, 有时候会报错(snapshot too old) 切换成表就可以了
Package level/schema level definition, refer to <Oracle code snippets: http://lyhistory.com/archives/1409.html>
Oracle.DataAccess.Client.OracleException ORA-04030
https://groups.google.com/forum/#!topic/comp.databases.oracle.server/ehe6hXgVQ2Y
输出别名，无法跟调用服务代码匹配，比如trunc(column1)的输出名字就是trunc(column1)而不是column1
int和decimal问题，比如oracle内部运算，max(date)-sysdate，在c#中会转成decimal，需要trunc一下
3) 关于 mssql
无需commit！这个很危险，有时候在sql manager操作的时候不小心就做错
4) 关于Mysql
5).常见：
5.1读写冲突
毫秒级别读写覆盖，使用select for update, 然后update后commit释放锁，产生的问题是无法使用rollback，因为释放锁必须commit，
https://www.techonthenet.com/oracle/cursors/for_update.php
5.2 开发过程连错db
5.3 由于archive无法读取到数据，archive and view (select from table or view)
5.4 字符问题
中文乱码或者
特殊字符需要escape/scrub 比如APOSTROPHE \u0027

5.5 预想出一条数据，结果出多条
5.6 长度截断
5.7 空格问题
字符比较，db存储‘DDFSDFS   '，比如：
在oracle中，char(20)，如果不满20就会填充空格，所以对应的不能用变长变量与其比较，比如varchar（20）
在postgresql中，bpchar(20) 如果不满20就会填充空格，所以对应的不能用变长变量与其比较，比如character varing
5.8 异常处理 回滚
6).特别情况：
database commit时间点，为了performance也许会写一个loop当每1千条才commit，问题是在loop的时间窗内，有外部程序刚好要访问loop已经完成的某条记录，而且占用loop剩下的资源（即将loop到的记录），此时死锁是必然的。解决方法：排序
7)auto commit, 比如dbeaver默认会auto commit，所以在调试temp table尤其是on commit drop的表时就无法追踪
8）时间
CURRENT_TIMESTAMP is an ANSI-SQL Standard variable you will find in many relational databases including PostgreSQL, SQL Server, Firebird, IBM DB2 and MySQL to name a few that records the start of the transaction. The important thing to keep in mind about it is there is only one entry per transaction so if you have a long running transaction, you won't be seeing it changing as you go along.
http://www.postgresonline.com/journal/archives/207-difference-between-current_timestamp-and-clock_timestamp-and-how-to-exploit-them.html

## 6. 开发常见的坑:

regex：
backtracking (performance issue)
false positives: We certainly don't want that pattern to match a line that says "Error: unsuccessful operation"! That is why it is often best practice to write as specific regular expressions as possible to ensure that we don't get false positives when matching against real world text.

6.1 delimiter的坑
通常偷懒的做法是用delimiter，如果是换行也许是基本没问题的，但是普通的字符就很难保证被分割的字符中不包含该字符，
解决方法：用换行作为分隔符；array list替代string，或者用正则匹配
6.2 scheduler
如System.Timer，前一个process没有结束，新的又触发，所以要用autoreset=false，在process完成的时候再enable timer
6.3 timeout的坑
ftp connection, ef connection, db connection, cache etc.
http://stackoverflow.com/questions/21221300/fixing-system-net-webexception-the-remote-server-returned-an-error-500-syn
redis synctimeout issue: https://azure.microsoft.com/en-us/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/
6.4 messagequeue: rabbitmq, reject msg会放到队头，堵塞queue，造成IO增长，应该reject到其他queue or at least, ack first and publish again, the msg will be add into the tail of the queue for later processing
6.5 redis 模糊匹配 keys The key word here, oddly enough, is the last one: database. Because StackExchange.Redis aims to target scenarios such as cluster, it is important to know which commands target the database (the logical database that could be distributed over multiple nodes), and which commands target the server. The following commands all target a single server: KEYS...
redis没有设置expire，造成空间爆满,即使设置过期也未必有用 A Key Expired In Redis, You Won't Believe What Happened Next http://engineering.grab.com/a-key-expired-in-redis-you-wont-believe-what-happened-next
redis没有检查stringset是否成功
6.6 dns解析的坑
6.7 线程安全的坑
Timer https://stackoverflow.com/questions/34759722/can-system-timers-timer-elapsed-event-if-previous-event-still-working, http://www.albahari.com/threading/part3.aspx#_Timers
cocurrency的坑
同步异步的坑
是否资源死锁/冲突
6.8 replication，如果一个node发生异常（数据异常），replicate也极有可能是被“同步”错误的信息进来，high availability 不等于 high reliability

6.9. Web开发弱智坑：
http 405 not allowed , get/post method called wrongly
server post跟client post不同，client post，浏览器会帮忙处理携带cookie并且会呈现返回值
一旦绑定的事情触发失败，可能是被父或子元素接受，或者是自身没有占位置（js和游戏中同样存在这个问题）
空字符 'test   ' != 'test'
HTTP HTTPS同时兼容的坑
跨域资源访问 Ajax跨域（CROS）请求中的Preflighted requests

6.10. 第三方集成的坑：
熟悉各种加密算法，注意字典排序，参数名 参数值
userid重复，用户改变用户名，使用openid（对外部的id，对内mapping）

6.11 语言相关
1)..NET JAVA
强引用 弱引用
.NET session state ,session lock, break signalR duplex messaging (remove session state related block in web.config)
C# code int类型 .equal string出错
C# datetime default value is not null, it is == DateTime.MinValue
如果程序运行，即使物理替换了某个dll，内存中使用的可能还是旧的（需要检测重新加载或强制重启程序）
当使用两个相同名字的class（虽然命名空间不同）仍然会引起错误（两个class字段不一致）
GAC引用，如果安装过 比如oracle .net data provider x64, gac存在x64，而project refer x32，会引发错误
2).IIS:
3).spark eclipse - maven, sbt
4).scala json读取-ArrayBuffer（一行一行的json）
5）C++

int uninitialized

https://bbs.archlinux.org/viewtopic.php?id=206619

6.12 开发常见问题考虑
1） sql injection
https://github.com/npgsql/npgsql/issues/2078
we're talking about different kinds of parameters. I meant the ability to use parameter placeholders:
CALL my_procedure(@param1, @param2)
This allows you to integrate user-provided data without risk of SQL injection, since parameters aren't integrated into the SQL but are send separately. This is extremely important and not supported with the simple protocol, which is what you use in your implementation.
refer to Simple Query & Extend Query
https://www.postgresql.org/docs/9.3/static/protocol-flow.html#AEN99742
2）
performance and accuracy , check user name（放到cache，比如redis，不用每次hit database）
cluster？load balancer, shared memory（session server etc.）, disk,db
load balance -》 high availability or high performance
resource exhausted ： dead loop dead lock
3） 不要依赖协议或者框架本身
oauth协议本身并不保证实现的安全，oauth的实现比如owin security也并不保证访问的安全，安全在于实现的细节（refresh token保存方式，验证方法）
db的行级锁并不保证，引起死锁问题
thread safe并不保证线程安全
cocurrency
4） 竞争问题
多个consumer,消费同一个producer, 在开发使用rabbitmq的时候,曾经部署了多个consumer,但是忘记,结果旧版本的consumer一直在消费message, 造成新版本的consumer无法接收到信息
多个entry造成路由问题, 在web api的开发过程中,曾经对一个project重命名, 从 A命名成B, 几个A的dll还在bin folder中未被清除，结果  public class WebApiApplication : HttpApplication，A中的这个让请求的http无法找到正确的route，http请求进入了旧的管道；发布publish的时候不会带旧的dll，这是本地才有的问题，重命名一定要小心，清除掉冗余的dll

5） 认知不足/错误的坑
5.1）http请求，服务器端未断开连接，netstat tcp waiting ，高并发，服务器端拒绝，解决客户端connection=close，或者服务端设置，并且要考虑用ha proxy
https://msdn.microsoft.com/en-us/library/ff647782.aspx
Turn Off HTTP Keep-Alives When Using IIS
The HTTP protocol provides a mechanism to prevent browsers from having to open several connections, just to bring back all the data for a page. HTTP keep-alives enable the browser to open one connection with the server and maintain that connection for the life of the communication. This can greatly increase the browser's performance because it can make multiple requests for several different graphics to render a page.
A .NET remote method call does not require the connection to remain open across requests. Instead, each method call is a self-contained request. By turning off HTTP keep-alives, the server is allowed to free unneeded connections as soon as a method call completes.
To turn off HTTP keep-alives in IIS
	Open the Internet Information Services Microsoft Management Console (MMC) snap-in.
	Right-click your Web site (not the application's virtual directory), and then click Properties.
	Clear the HTTP Keep-Alives Enabled checkbox.
5.2）redis 写入失败问题，如果是做缓存不重要，否则要处理，另外expire也很重要，要设置，否则会撑爆内存（如果设置默认加载在内存中）
5.3）message queue，进queue的速度（生产速度）大于出queue的速度
5.4）db 时间精度，高峰值情况，造成同一秒甚至毫秒有多条数据，造成根据时间来判断的use case不成立，比如timeline或者time series问题

## 7.windows的坑
1).文件大小写不区分：
cdn不更新
2).路径问题（大小写，中文，反斜线，Windows上run docker tool遇到很多类似问题，需要手工导入文件或数据）
3）MaxUserPort www.dba-oracle.com/t_ora_12542_tns_address_already_in_use.htm
4).其他问题
The program can't start because VCRUNTIME140.dll is missing from your computer. Try reinstalling the program to fix this problem.
Try installing Update for Universal C Runtime in Windows(https://www.google.com/url?q=https%3A%2F%2Fsupport.microsoft.com%2Fen-us%2Fhelp%2F2999226%2Fupdate-for-universal-c-runtime-in-windows&sa=D&sntz=1&usg=AFQjCNEq3tFRVwynwN2WFUdz2MYzse-F1w) first.
This may be caused by your Windows Operating System missing the update patch.
If you are still having this problem after the above attempt, please provide:
Specific Windows version that you have. i.e. Windows Server 2012 R2, etc.
Specific MongoDB version that you have i.e. 3.4.2
If you are installing the binaries from MongoDB zip files, what is the name of the zip files ? This should contain the specific build of the binaries
Any other information that can be used to replicate the problem
https://groups.google.com/forum/#!msg/mongodb-user/j_PHaiqoV70/umYkGE37DgAJ

## 8.Server/Host的坑
0) working fine in local, but not work on server
0a) wrong port, path, folder permission, test ping/telnet
0b) hosting provider
0c) 32/64 compile, version, assembly dependent
<dependentAssembly>
<assemblyIdentity name="Oracle.DataAccess" publicKeyToken="31bf3856ad364e35" culture="neutral"/>
<bindingRedirect oldVersion="2.111.6.0" newVersion="4.112.3.0"/>
</dependentAssembly>
nodejs iisnode
https://stackoverflow.com/questions/45076039/deploy-nodejs-on-azure-but-get-404
https://stackoverflow.com/questions/35558099/node-js-post-mysite-uploads-404-not-found-when-uploaded-to-azure-but-works-loc/35568094#35568094
1).磁盘写满（不要随便在循环体中加log，debug级别的log在product及时关闭）；
例如在用grafana+pgwatch2 监控数据库的时候，用到influxdb，如果没有设置retention policy，大数据会很快吞掉磁盘，比如docker /var/lib/docker/volumes，应该学会使用挂载volumes，将‘物理磁盘’隔离开，避免因为占用系统磁盘而引起系统崩溃
，然后设置influx retention policy，只保留一定时间内的数据，https://docs.influxdata.com/influxdb/v1.2/query_language/database_management/#create-retention-policies-with-create-retention-policy，https://community.influxdata.com/t/what-is-the-retention-policy-and-how-exactly-it-work/1080/3；
定期做housekeeping

2).文件权限 （网络文件存储）;文件占用（service占用）；
3).service无法开启（x86 64问题）；
或者软件版本问题，python默认x86版本python-2.7.14.msi，如果64版本需要安装python-2.7.14.amd64.msi，另外如果服务器无法联网，需要的lib需要在本地用同样的版本进行pip install下载，然后从site-packages拷贝到服务器
或者
配置文件乱码或者不小心输入了脏字符，尤其是phpstudy，当时只是在软件界面上更改端口80为8080，结果软件自动改了vhost.conf，而且因为软件bug将其改的面目全非，无法启动
或者
之前安装某个软件的时候自带了某个版本的程序，造成冲突，比如HDP自带的grafana，再单独安装的时候可能有问题，所以有时候可以采用‘隔离’的策略，隔离到不同的机器，或者直接用docker container
4).重启假象（不起作用，进程没有重启，有时候资源被占用，造成重启失败，但是并没有提示）；
5).端口禁用/占用；
6).ip黑白名单；
hosting奇葩问题
环境变量（nodejs端口）
路由重写问题（就差一个？号）
web.config
<?xml version="1.0" encoding="UTF-8"?><?xml version="1.0" encoding="UTF-8"?><configuration>    <system.webServer> <rewrite> <rules> <rule name="OrgPage" stopProcessing="true"> <match url="^(.*)$" /> <conditions logicalGrouping="MatchAll"> <add input="{HTTP_HOST}" pattern="^(.*)$" /> <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /> <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /> </conditions> <action type="Rewrite" url="index.php?/{R:1}" /> </rule> </rules> </rewrite>    </system.webServer></configuration>
.htaccess
<IfModule mod_rewrite.c><IfModule mod_rewrite.c> Options +FollowSymlinks -Multiviews RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d RewriteCond %{REQUEST_FILENAME} !-f RewriteRule ^(.*)$ index.php?/$1 [QSA,PT,L]</IfModule>
使用phpstudy2018的时候产生的问题：
1）端口占用，很简单，参考iisreet /stop这篇文章
2）由于vhosts.conf内容错误（多了某个符号或排版错乱）造成，更奇葩的是当我更改默认端口设置为8080时，程序自动会更改这个conf，但是由于bug，它会改错，造成无法启动，找了很久这个原因

阿里云的坑:
mongodb的坑（连接池） https://bbs.aliyun.com/read/283922.html
linux server root 密码包含大小写字母和特殊字符(否则登录失败)

## 9.版本管理
git工具：
git找不到远程branch（大小写同名的branch）
git untracked死活无法添加（嵌套的.git）
git init (checkout new branch from which branch)
兼容：
angularJS的plugin
php与mongodb, PHP Startup Unable to load dynamic library php_mongo.dll

## 10.罕见问题
对oracle db压力测试时，一个while loop持续不断的批量insert db，大概9个小时左右造成db out of process memory ，然后几个小时后db down；更改策略，换成三个timer，每个timer都是间隔1分钟批量insert db，没有出现db down的问题；
观察总结可能因为：当一个client链接db操作，db只分配了固定的内存应对，比如1G，然后持续不断的调用下，由于一般内存垃圾回收都是比较迟缓的，oracle应该也是如此，所以内存持续增长，直到用光，而3个timer一起做，反而，db每个都分配了1G，而且三个本身已经分散了客户端的流量，相当于开源节流，所以问题消失。
;
keyword冲突，比如刚好用了某个系统的关键词，因为系统不完善并没有给出准确的错误信息
https://github.com/npgsql/npgsql/issues/2002
https://www.postgresql.org/docs/current/static/sql-keywords-appendix.html

Ipv4 ipv6 host resolve
https://stackoverflow.com/questions/54970457/how-can-i-fix-it-mysql-remote-access-not-working/55084241#55084241

## IIS host & .NET version problems
1.iis 403 forbidden - HTTP Error 403.14 – Forbidden The Web server is configured to not list the contents of this directory
run mvc on iis 7.5, need install mvc first, then run cmd:
32bit (x86) Windows
%windir%\Microsoft.NET\Framework\v4.0.30319\aspnet_regiis.exe -ir
64bit (x64) Windows
%windir%\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe -ir

if still not resolved, try
open IIS -> Application Pools -> .NET Framework version -> Advanced Settings -> Enable 32-Bit Application

2.Session state can only be used when enableSessionState is set to true, either in a configuration file or in the Page directive. Please also make sure that System.Web.SessionStateModule or a custom session state module is included in the \\ section in the application configuration.
http://forums.asp.net/t/1891041.aspx?Session+state+can+only+be+used+when+enableSessionState+is+set+to+true
2.Server Error in '/' Application.
A potentially dangerous Request.Form value was detected from the client (webcountcode="<script src="http://...">// <![CDATA[
Description: ASP.NET has detected data in the request that is potentially dangerous because it might include HTML markup or script. The data might represent an attempt to compromise the security of your application, such as a cross-site scripting attack. If this type of input is appropriate in your application, you can include code in a web page to explicitly allow it. For more information, see http://go.microsoft.com/fwlink/?LinkID=212874.
Exception Details: System.Web.HttpRequestValidationException: A potentially dangerous Request.Form value was detected from the client (webcountcode="<script src="http://...").
solve: requestValidationMode="2.0"
3.500 error
a.check iis version, for higher version(7.5) place modules inside system.webserver instead of system.web
// ]]></script>

4. Unrecognized targetFramework
<!--
[ConfigurationErrorsException]: Unrecognized attribute 'targetFramework'. Note that attribute names are case-sensitive. (*****\web.config line 20)
at System.Web.HttpRuntime.HostingInit(HostingEnvironmentFlags hostingFlags)
[HttpException]: Unrecognized attribute 'targetFramework'. Note that attribute names are case-sensitive. (******\web.config line 20)
at System.Web.HttpRuntime.FirstRequestInit(HttpContext context)
at System.Web.HttpRuntime.EnsureFirstRequestInit(HttpContext context)
at System.Web.HttpRuntime.ProcessRequestNotificationPrivate(IIS7WorkerRequest wr, HttpContext context)
-->
open IIS -> Application Pools -> .NET Framework version

5. MVC yellow page, 'Ajax' not found
project reference System.Web.MVC right click , copy to local : true
6.Task.Factory.StartNew with uncaught Exceptions kills w3wp
http://stackoverflow.com/questions/5054750/task-factory-startnew-with-uncaught-exceptions-kills-w3wp

7. mismatch between processor architecture
in one solution, projects using different .net version or different build setting (extend: dependency loop)
WHERE CAN I FIND MY IIS LOG FILES? https://www.loganalyzer.net/log-analysis/iis-log-files.html
Below are for Windows Service
1. oracle client not compatible, check gactuil the version is 32bit or 64bit, and check project properties-> Build -> Platform target (Any CPU? Prefer 32-bit)
2.how to install windows service:
use windows cmd
use vs developer command prompt
3.can not stop windows service, end from task manager-> process
Integrated Mode


## 部署开发网站问题集合 - Website Deploy&Dev Pro Collection
1. 编码问题
ftp工具上传一定注意选择binary模式；代码编辑器轻量级选择notepad++等，中量级选择webmatrix等，重量级不用再说，注意使用notepad++时要注意去check编码，尤其是download过来的源码，实在不行就用其他重量级工具打开；尽量使用utf-8编码，对于国外服务器对中文字符集不友好的问题可以试着更改web request和response的编码，DB层面 mssql脚本可以加N解决;有时候不管是用ftp还是control panel下载以及各种压缩下来的中文文件乱码，可以试着在My computer窗口连接打开下载。
2.文件名case问题
尽量使用小写，否则会出现各种诡异问题，即使第一次没有问题，后面update之后也会出现意想不到的问题，如果发现某个文件或文件夹确实存在，但是一直500或404，优先考虑是不是case sensitive
3.url rewrite 伪静态问题
对于windows服务器和linux服务器有不同做法，一般Windows服务器iis都装有url rewrite，所以只要加一下web config更改即可（有时候需要更改php.ini），比如wordpress的Permalinks 404问题
4.文件读写权限问题
很多500问题因为这个，更异常的情形是极少条件发生iis占用文件问题
5.配置错误
DB ip port，db user grant rights，connection string
log4net folder，
6.由于版本控制+权限产生的问题
这个问题比较奇葩，我是在京东云引擎遇到的，是这样的，一般的php安装程序会根据./data/install.lock的玩意判断是否已经安装，然后决定跳转，然后京东云是git版本管理，正常来说初次不要上传install.lock就行了，因为finish install会touch('install.lock')，但是程序生成的这个玩意是不会出现在京东的git版本库里的，也就是你看不到，没办法，免费的东西就是受限制，所以问题是当第一次你一上来就传了install.lock到版本管理之后，再去删除，程序生成的install.lock会有问题，貌似是失败，因为你会发现再次打开网站又回到了安装界面，唯一的解释就是touch失败，罪因就是第一次已经把install.lock加入版本库了，浪费了朕一个晚上时间思考找鬼！！！
FOR DEV 开发时的错误点:
1.熟悉各种加密算法，注意字典排序对象是参数名 参数值
2.server post跟client post不同，client post，浏览器会帮忙处理携带cookie并且会呈现返回值
3，一旦绑定的事件触发失败，可能是被父或子元素接受，或者是自身没有占位置（js和游戏中同样存在这个问题）
4.关于时间，unix时间戳，注意是精确到毫秒还是秒，不然转成日期会有溢出
server time
Coordinated Universal Time (French: Temps Universel Coordonné, UTC) is the primary time standard by which the world regulates clocks and time. It is one of several closely related successors to Greenwich Mean Time (GMT). For most purposes, UTC is used interchangeably with GMT, but GMT is no longer precisely defined by the scientific community.
5.存储过程参数值一定要和传入参数值类型一致（注意空值处理），以及存储过程内定义的类型也必须正确，比如decimal的精度，否则会有截断的可能；大数据表联合查询字段加索引，尽量避免扫表操作以及对表字段的处理，比如ToUpper之类
6.js
0==false '0'==true
使用===
undefined size()>0 try catch
7.Concurrency issues
dictionary<key,value> as static cache, always use full name as string, because you may have the same class name in different namespace
8. Delimiter 慎用，尤其当被分隔开的字符里面包含相同字符 123&&&321&&&&&&132
9. 死循环引起的log疯狂写入，磁盘空间瞬间被吃完
網絡蒐集:http://www.cnblogs.com/zhibolife/p/3690596.html


Todo
1. cannot store into flash drive even the file size within its available space limits, try to format it to NTFS
U盘明明空间很大，但是无法存入东西，格式化成NTFS
2.boot from usb stick: cannot find usb drive in boot menu, it could be that your usb stick is not marked as active.
follow steps below to activate your flash drive

Windows:
Administrative Tools
System Information
window partition - disk manager
ubuntu partition - use another linux system to do it ( because you cannot umount the disk when use let alone partition it)

SSH auto close - try admin, or remote server cannot connected ( try other machine out of your current intranet)

cannot find the menu?
try tab for computer
try hardware/software menu button or home button

google chrome freezes my laptop
1. Try clearing your cache and cookies (Ctrl+Shift+Backspace). Start by clearing from the time period you started facing the issue, then expand to “beginning of time”.
2. Uncheck Use hardware acceleration (Menu > Settings > Show Advanced Settings > System menu).


主键？？unique id
UUID:原理、性质与应用 https://vonng.com/blog/uuid/
SnowflakeId算法思想及分析 https://www.doourbest.cn/2018/09/09/SnowflakeId算法思想及分析/index.html

![](/docs/docs_image/software/buglist/buglist01.png)


It works fine but sometimes throw exception/cause problem

## 事件记录
### 异常跳转

访问dev网站，自动跳转到生产网站，通过抓包分析找到x-redirect-by，发现是因为WordPress安装了一个多语言组件引起的，最后发现是因为dev网站错误指向了生产网站的数据库，多语言组件读取数据库默认的跳转连接

### 网站上传功能突然有问题

上传请求报错：failed net:Error_http2_protocol，但是实际上文件已经上传至服务端，好像是服务端无法正常返回

https://stackoverflow.com/questions/58215104/whats-the-neterr-http2-protocol-error-about

https://docs.microsoft.com/en-us/answers/questions/146869/neterr-http2-protocol-error-with-jquery-xmlhttpreq.html

结合其他人遇到的cdn问题，我们网站确实用了腾讯云并且开启了强制http2协议，所以可能是因为cdn供应商升级造成的



### 乱码问题

Maven java project 乱码
Step 1 首先在cmder下面测试乱码，设置cmder重启，并测试locale正确
![](/docs/docs_image/software/buglist/buglist02.png)

测试ls或dir列出中文文件正确，但是运行java程序依然输出乱码
Step 2 设置maven project pom utf8编码
![](/docs/docs_image/software/buglist/buglist03.png)
并用JD-GUI反编译查看正确
![](/docs/docs_image/software/buglist/buglist04.png)

Step 3 怀疑是windows系统问题，因为是在windows cmd和powershell下面乱码
查看system language设置有中英文没啥问题

最终发现chcp命令，https://www.cnblogs.com/liuchao102/p/5412050.html
验证并更改为中文 chcp 65001

https://www.ibm.com/developerworks/cn/java/analysis-and-summary-of-common-random-code-problems/index.html
测试普通的maven程序中文正常显示

Step 4 但是spring boot project仍然中文乱码
![](/docs/docs_image/software/buglist/buglist05.png)


---

ref：

Using HttpClient as it was intended (because you’re not) https://contrivedexample.com/2017/07/01/using-httpclient-as-it-was-intended-because-youre-not/
using() is in thread safe manner but not efficient
While HttpClient is thread safe, not all of its properties are. You can cause some very difficult to identify bugs by re-using the same instance but changing the URL and/or headers before each call. If this configuration will vary
so use HttpRequestMessage instead
http://byterot.blogspot.sg/2016/07/singleton-httpclient-dns.html
https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/
http://www.michaeltaylorp3.net/httpclient-is-it-really-thread-safe/
http://www.nimaara.com/2016/11/01/beware-of-the-net-httpclient/

httpclient
http://www.c-sharpcorner.com/UploadFile/dacca2/http-request-methods-get-post-put-and-delete/
WebClient vs HttpClient vs HttpWebRequest
http://www.diogonunes.com/blog/webclient-vs-httpclient-vs-httpwebrequest/
https://stackoverflow.com/questions/20530152/deciding-between-httpclient-and-webclient
httpClient容易忽略的细节-关闭连接 blog.csdn.net/zhongzh86/article/details/45875161
使用httpclient必须知道的参数设置及代码写法、存在的风险 blog.csdn.net/younger_z/article/details/51727551
Beware of the .NET HttpClient www.nimaara.com/2016/11/01/beware-of-the-net-httpclient/
C#中HttpClient使用注意：预热与长连接 www.cnblogs.com/dudu/p/csharp-httpclient-attention.html
How to correctly use PostAsync and PutAsync? RSS https://forums.asp.net/t/1773007.aspx?How+to+correctly+use+PostAsync+and+PutAsync+
Task.Run vs Task.Factory.StartNew https://blogs.msdn.microsoft.com/pfxteam/2011/10/24/task-run-vs-task-factory-startnew/

<disqus/>