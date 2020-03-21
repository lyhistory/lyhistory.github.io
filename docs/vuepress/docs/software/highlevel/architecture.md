---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《架构》

architecture VS framework

https://docs.google.com/document/d/1fOjh7ujeIfuRazSW4W23Ijz5PdMU2UemnI-ieJ1Jrh8/edit

我们谈过[分布式系统](/docs/software/highlevel/distrubuted_system)，谈过[并发和并行](/docs/software/highlevel/concurrent)，
也谈过[微服务框架](/docs/software/java_spring),

学习[服务端高并发分布式架构演进之路](https://segmentfault.com/a/1190000018626163)

对话独角兽得物（毒）App CTO 陈思淼：组建技术团队的十件事
https://mp.weixin.qq.com/s/TNgbzCzqSCWy_ZcK_ZZC_w


## Recommended frameworks for SME or small projects
Web framework https://iris-go.com/donate

architect will get evolved along with business growing when critical issues emerge.
It's impossible to design an architect which will keep unchanged
for example, at the beginning we are limited to one server, some design can not be adopt to such
situation which may be time consuming and meaningless.
Layered Application Guidelines
https://msdn.microsoft.com/en-us/library/ee658109.aspx#ServicesLayers

Architectural Styles vs. Architectural Patterns vs. Design Patterns https://herbertograca.com/2017/07/28/architectural-styles-vs-architectural-patterns-vs-design-patterns/

## Principles
https://drive.google.com/file/d/0B01BZttEuPVvR2V5QnZXXzlTYUE/view?ths=true

Single-Responsibility
Separate of concern (interception,cross-cutting concerns: logging, auditing, access control, validation)
High level objects don’t care the detail of lower level objects ( IOC)
Liskov substitution principle
Open/Closed Principle - programming to an interface - Loose coupling
responsibility and segregation

## Theorem 
1. CAP 
C-Consistency A-Availability P-Performance/Partition Tolerance
Types of Consistency
• Consistency with other users: If two users query the database at the same time, will they see the same data? Traditional relational systems would generally try to ensure that they do, while non-relational databases often take a more relaxed stance. 
• Consistency within a single session: Does the data maintain some logical consistency within the context of a single database session? For instance, if we modify a row and then read it again, do we see our own update? 
• Consistency within a single request: Does an individual request return data that is internally coherent? For instance, when we read all the rows in a relational table, we are generally guaranteed to see the state of the table as it was at a moment in time. Modifications to the table that occurred after we began our query are not included. 
• Consistency with reality: Does the data correspond with the reality that the database is trying to reflect? For example, it’s not enough for a banking transaction to simply be consistent at the end of the transaction; it also has to correctly represent the actual account balances. Consistency at the expense of accuracy is not usually acceptable.

## High level design - Architectural Patterns and Styles 

### Architecture Style
Microsoft Application Architecture Guide, 2nd Edition 
https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff650706(v%3dpandp.10)

https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ee658117(v=pandp.10)

https://github.com/mspnp

![](/docs/docs_image/software/architecture/architecture01.png)

### Samples

#### SOA VS Microservices
https://www.youtube.com/watch?v=EpyPFnjue38

![](/docs/docs_image/software/architecture/architecture02.png)

#### CORS - Command-Query Responsibility Segregation
Principle: responsibility and segregation

https://kalele.io/blog-posts/really-simple-cqrs/
https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs

## Detail design - technical architecture

### N-tier

![](/docs/docs_image/software/architecture/architecture03.png)

### Layer and related concepts

Presentation Layer
	MVC, Domain Object(Domain objects can have logic (depending on whether you are using domain-driven design or have anemic data model) and they are usually related to the database structure.)
Application layer / service layer
Business Layer
	Business Object DTO (DTOs don't have any logic. They only have fields (state). They are used when transferring data from one layer/subsystem to another)
Data Access Layer
	DAO
	The Data Access Layer(DAL) is the layer of a system that exists between the business logic layer and the persistence / storage layer.
	A DAL might be a single class, or it might be composed of multiple Data Access Objects(DAOs). It may have a facade over the top for the business layer to 
	talk to, hiding the complexity of the data access logic. It might be a third-party object-relational mapping tool(ORM) such as Hibernate.
Persistence Layer
	ORM(Entity framework) (POCO/entity)

	1. MVC framework is for Presentation layer
	2. About Persistence layer 
		a. PL == DAL
		b. PL == Storage, BL - DAL - PL

### BL/DAL/PL - patterns
BL/DAL: Repository Pattern(+ Unit Of Work), DAO Pattern
DAL/PL: Data Mapper Pattern, ORM Pattern(entity framework or NHibernate), DAO Pattern 
PL/DB: ORM (vs Stored Procedure https://rob.conery.io/2015/02/20/its-time-to-get-over-that-stored-procedure-aversion-you-have/)
	.NET 主流的ORM:https://segmentfault.com/a/1190000011676744
		Dapper
		ClownFish：比手写代码还快的通用数据访问层 https://www.cnblogs.com/fish-li/archive/2012/07/17/ClownFish.html#!comments
		Entity framework (buit on ADO.NET https://stackoverflow.com/questions/22328889/entityframework-vs-pure-ado-net,
https://stackoverflow.com/questions/40506382/what-is-the-difference-between-an-orm-and-ado-net)

![](/docs/docs_image/software/architecture/architecture04.png)

Perfomance
DataReaders, Entity Framework, NHibernate and Dapper
http://www.luisrocha.net/2011/12/data-access-performance-comparison-in.html
https://github.com/lerocha/DotNetDataAccessPerformance/tree/c2a71ede37f3dd9ee437221a84054e504773b626

![](/docs/docs_image/software/architecture/architecture05.png)

Refer:
Pattern vs Data Mapper Pattern
http://www.bradoncode.com/blog/2013/08/repository-vs-domain-model-vs-data.html

Generic repository pattern using EF with Dependency injection
https://www.codeproject.com/Tips/572761/Generic-repository-pattern-using-EF-with-Dependenc
Designing the infrastructure persistence layer https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design
DAL、DAO、ORM、Active Record辨析
https://blog.csdn.net/suiye/article/details/7824943

https://stackoverflow.com/questions/6732124/difference-between-transfer-objects-and-domain-objects
PO, VO, TO, BO, DAO, POJO https://www.programering.com/a/MDM2kjNwATc.html
DTO, DAO, and VO in Java https://www.quora.com/What-is-DTO-DAO-and-VO-in-Java

Repository pattern vs DAO pattern
4 Common Mistakes with the Repository Pattern
https://programmingwithmosh.com/entity-framework/common-mistakes-with-the-repository-pattern/
Don’t use DAO, use Repository https://thinkinginobjects.com/2012/08/26/dont-use-dao-use-repository/

https://www.thoughtfulcode.com/orm-active-record-vs-data-mapper/
https://social.msdn.microsoft.com/Forums/en-US/aed501f8-d7e4-40d9-8a98-32c5cdc78243/help-with-the-orm-vs-stored-procedures-argument?forum=architecturegeneral
https://www.quora.com/What-are-the-pros-and-cons-of-using-SQL-Stored-Procs-versus-ORM-for-database-quering
DAO Pattern https://www.baeldung.com/java-dao-pattern

## Network/Physical design

正向代理 反向代理Forward proxy and reverse proxy
forward proxy proxies in behalf of clients (or requesting hosts), a reverse proxy proxies in behalf of servers
https://www.jscape.com/blog/bid/87783/Forward-Proxy-vs-Reverse-Proxy
Example: 
	Grafana-server runs its own service and hosts dashboard on 3000, if bind to domain, to the normal use access domain, default using 80, need a proxy server who use 80 to forward request to grafana-server for example nginx


## Framework misconception 
what is the difference between 3 tier architecture and a mvc? https://stackoverflow.com/questions/10739914/what-is-the-difference-between-3-tier-architecture-and-a-mvc

At first glance, the three tiers may seem similar to the model-view-controller (MVC) concept; however, topologically they are different. A fundamental rule in a three tier architecture is the client tier never communicates directly with the data tier; in a three-tier model all communication must pass through the middle tier. Conceptually the three-tier architecture is linear. However, the [model-view-controller] MVC architecture is triangular: the view sends updates to the controller, the controller updates the model, and the view gets updated directly from the model.

SOAP vs REST
https://www.soapui.org/learn/api/soap-vs-rest-api.html

## Application misconception

### Static及singleton and thread safe
首先要看不同的线程是否在竞争同一个资源：
	如果是各自访问其上下文context的资源，比如kafka consumer partition worker线程访问各自的storage则是互相不打扰的；
	如果执行的某个方法内只用到了局部变量，由于局部变量位于各自thread的栈里，所以互不干扰；
	如果执行的某个方法用到了传入的变量，也就是所谓的形式参数变量，则要看这个传入的变量是否是object，如果只是普通的参数则没关系，如果是对象，要看对象是否是同一个引用，不同引用没有关系；
	如果执行的某个方法内用到了同一个引用，不管是传入的还是外部全局的变量，比如log4的logger，由于log4已经做好了线程安全写log，所以不用担心；
	如果执行的某个方法内用到了同一个引用，但是只是读没有写，读和读是没有冲突的，也没有关系，只有涉及到写才有关系；
关于static及singleton：
	Singleton可以是static的，static是vm级别的静态变量，singleton可以是application级别的单例，如果是vm级别的，需要考虑application之间的冲突,如果是standalone程序，则可以使用vm static，引用一段shiro关于SecurityManager的注释：
The Shiro development team prefers that SecurityManager instances are non-static application singletons
 	* and <em>not</em> VM static singletons.  Application singletons that do not use static memory require some sort
 	* of application configuration framework to maintain the application-wide SecurityManager instance for you
 	* (for example, Spring or EJB3 environments) such that the object reference does not need to be static.

#### OOP static
Static method defeat OOP, because static method is not object behavior, 
For thread safe, we should look at static variable not static method/instruction
t’s not the static methods that you have to watch out for – it’s the static fields.

https://stackoverflow.com/questions/7026507/why-are-static-variables-considered-evil

#### Framework level(.net framework and other plugins) threadsafe
Many of the classes in the .NET framework have the following remark in the “Thread Safety” section: "Any public static (Shared in Visual Basic) members of this type are thread safe. Any instance members are not guaranteed to be thread safe."Does this mean static methods are inherently thread safe? The answer is no. Classes with the above note will have thread safe static methods because the Microsoft engineers wrote the code in a thread safe manner, perhaps by using locks or other thread synchronization mechanisms
File.Open(XXX)
String.XXX

Plugin Example: log4net
Log4net Thread-Safe but not Process-Safe
http://hectorcorrea.com/blog/log4net-thread-safe-but-not-process-safe/17

#### Application global state thread safe
init(write at application start) and used(read) from everywhere, that’s fine
ConcurrentDictionary

#### Use it in thread-safe way
System.timer
It will Continue Executing on different thread
So set autoreset=false

Message queue, multiple consumer retrieve messages from queue.

Refer:
https://odetocode.com/articles/313.aspx

#### Class-load time 

![](/docs/docs_image/software/architecture/architecture111.png)

### DB Connection misconception
Difference between driver and provider https://stackoverflow.com/questions/19293744/difference-between-driver-and-provider
Driver is a program installed on a workstation or a server; it allows programs to interact with a Database Management System (DBMS). Such as, JDBC driver provides database connectivity through the standard JDBC application program interface (APIs) available in J2EE.
A data provider is a set of libraries that is used to communicate with data source. Such as, SQL data provider for SQL, Oracle data provider for Oracle, OLE DB data provider for access, excel and MySQL. It serves as a bridge between an application and a data source and is used to retrieve data from a data source and to reconcile changes to that data back to the data source.


DB Access => DB provider(ODP.NET) => DB driver(Oracle for .net ODAC, JDBC)
DB Driver maintain connection pool (closed put into pool)

### Connection pool
https://www.youtube.com/watch?v=3JMK1JK5UEo

https://docs.oracle.com/cd/E15586_01/fusionapps.1111/e20836/conn_pool.htm
https://social.msdn.microsoft.com/Forums/vstudio/en-US/a5239fc6-151b-4e3a-97e3-286c8c785f7b/c-net-in-iis-connection-pooling-question?forum=csharpgeneral

Pgbouncer and pg pooling cannot use together
https://pgbouncer.github.io/usage.html#quick-start

Performance monitor config
https://docs.oracle.com/cd/E15296_01/doc.111/e15167/featConnecting.htm#CJAFIDDC

