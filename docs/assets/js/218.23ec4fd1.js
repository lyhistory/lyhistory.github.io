(window.webpackJsonp=window.webpackJsonp||[]).push([[218],{643:function(e,t,r){"use strict";r.r(t);var a=r(65),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[r("a",{attrs:{href:"/docs/software"}},[e._v("回目录")]),e._v("  《架构》")]),e._v(" "),r("h2",{attrs:{id:"where-are-we"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#where-are-we"}},[e._v("#")]),e._v(" Where are we?")]),e._v(" "),r("p",[e._v("以java开发举例:")]),e._v(" "),r("ul",[r("li",[e._v("第一层 操作系统")]),e._v(" "),r("li",[e._v("第二层 开源的openjdk或收费的jdk 包含jvm虚拟机 java security math等基础包")]),e._v(" "),r("li",[e._v("第三层 公司或个人基于java开发的类库中间件产品包括服务端产品以及客户端框架等等，甚至有如spring cloud一条龙全家桶")]),e._v(" "),r("li",[e._v("第四层 架构师基于选择的技术栈设计的特定业务运行的底层框架或者引擎或者核心代码，比如基于kafka构建的消息队列处理引擎")]),e._v(" "),r("li",[e._v("第五层 普通开发者基于核心引擎框架开发业务代码")])]),e._v(" "),r("p",[e._v("理想情况下大家各司其职，上一层通过文档理解下一层的思想，但是实际很骨感：")]),e._v(" "),r("ul",[r("li",[e._v("第二层 遇到过openjdk security padding的错误，跟其他机器的padding策略不一致，造成无法tls握手成功")]),e._v(" "),r("li",[e._v("第三层 比如kafka的文档相对完善但是有些部分并不友好，有时候也需要稍微扒一下源码加深理解，还有些文档相当不友好比如Disruptor不断的强调其单线程的设计思想，如果不看源码我还以为默认就是single writer mode，结果默认是multiple producers+lock strategy；如果想要深刻理解某些中间件的设计思想比如Disruptor，就需要对第二层用户态的jvm以及更下一层的os操作系统有深刻理解；")]),e._v(" "),r("li",[e._v("第四层 架构师如果对第三层理解错误或者不全面会造成写的核心代码出现漏洞，甚至是误以为市面产品达不到要求自己造出更加残缺的轮子难以维护")]),e._v(" "),r("li",[e._v("第五层 业务开发，普通开发者日常基本是copy paste的工作模式按照样例进行业务代码开发，如果出现架构师的核心代码缺乏文档或者缺乏示范用例，普通开发者甚至是高级开发者会用错误的方式绕过架构师的设计造成核心代码失效或者业务代码工作但是功能在异常情况下有问题")])]),e._v(" "),r("p",[e._v("基本上每一层都是盲人摸象，不同的任务属性或者问题根源决定是否要停留在该层解决，盲人摸象是正常状态，不是轮子的建造者不可能对轮子有完全的了解，黑客关心的是如何在这头大象找到一条路径进入系统并实现权限控制，开发者关心的是这头大象是否能解决核心需求痛点，在实际的过程中不得不跨层研究，但是不能深陷其中，因为不可能重造每个轮子。")]),e._v(" "),r("p",[e._v("我们谈过"),r("a",{attrs:{href:"/docs/software/highlevel/distrubuted_system"}},[e._v("分布式系统")]),e._v("，谈过"),r("a",{attrs:{href:"/docs/software/highlevel/concurrent"}},[e._v("并发和并行")]),e._v("，\n也谈过"),r("a",{attrs:{href:"/docs/software/highlevel/microservice"}},[e._v("微服务框架")]),e._v("和"),r("a",{attrs:{href:"/docs/software/java_spring"}},[e._v("spring cloud微服务框架")]),e._v(",\n前面说了很多“系统system”、“框架Framework”，现在来站的更高一层谈谈“架构architecture”（跟前面提到第四层架构师的工作不同，这里是更高层次的抽象）")]),e._v(" "),r("p",[e._v("谈到架构默认就是 OOA - object-oriented architecture")]),e._v(" "),r("p",[e._v("面向过程是算法模型，面向对象是交互模型。\n面向对象的封装，继承，多态是在架构起到很大作用，按对象和类形成多种设计模式。这是架构的核心。")]),e._v(" "),r("p",[e._v("面向切面 AOP(Aspect-Oriented Programming) complements OOP by enabling modularity of cross-cutting concerns. The Key unit of Modularity(breaking of code into different modules) in Aspect-Oriented Programming is Aspect. one of the major advantages of AOP is that it allows developers to concentrate on business logic. It is more convenient to use because changes need to be done in only one place.\nNote: Cross cutting concerns are one of the concerns in any application such as logging, security, caching, etc. They are present in one part of the program but they may affect other parts of the program too.\nAOP is used along with Oop as it also works around classes and objects, etc. We can also say that Oop is a basic term for AOP. Different Frameworks used in Aop are AspectJ, JBoss, and Spring. AOP makes the program loosely coupled. AOP separates business logic from cross-cutting concerns.")]),e._v(" "),r("h2",{attrs:{id:"_1-terminology"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-terminology"}},[e._v("#")]),e._v(" 1. Terminology")]),e._v(" "),r("p",[r("strong",[e._v("architecture VS framework")]),e._v("\n首先架构跟框架的关系，简单说就是架构是设计蓝图， 框架是摸得到看得到的建筑脚手架和钢筋结构；一个是概念类，一个是实例；")]),e._v(" "),r("p",[e._v("**Architectural Styles vs. Architectural Patterns vs. Design Patterns **\nhttps://herbertograca.com/2017/07/28/architectural-styles-vs-architectural-patterns-vs-design-patterns/")]),e._v(" "),r("p",[e._v("https://stackoverflow.com/questions/4243187/whats-the-difference-between-design-patterns-and-architectural-patterns")]),e._v(" "),r("p",[r("strong",[e._v("patterns vs frameworks")]),e._v("\nPatterns: facilitate reuse of architecture and design in similar contexts\nFramework: facilitate reuse of detailed design and code in related applications.")]),e._v(" "),r("p",[e._v("Levels of Abstraction--Patterns can be classified by the level of abstraction of the problem they solve:\nArchitecture - organizes a system as a set of communicating subsystems.\nDesign - solves a design problem using a set of communicating design objects\nFramework - solves a specific domain problem using a set of communicating design patterns.\nImplementation - solves an implementation problem using platform/language-specific features")]),e._v(" "),r("h2",{attrs:{id:"_2-principles"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-principles"}},[e._v("#")]),e._v(" 2. Principles")]),e._v(" "),r("p",[e._v("todo: https://drive.google.com/file/d/0B01BZttEuPVvR2V5QnZXXzlTYUE/view?ths=true")]),e._v(" "),r("p",[e._v("Single-Responsibility\nSeparate of concern (interception,cross-cutting concerns: logging, auditing, access control, validation)\nHigh level objects don’t care the detail of lower level objects ( IOC)\nLiskov substitution principle\nOpen/Closed Principle - programming to an interface - Loose coupling\nresponsibility and segregation")]),e._v(" "),r("h2",{attrs:{id:"_3-high-level-design-architectural-patterns-and-styles"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-high-level-design-architectural-patterns-and-styles"}},[e._v("#")]),e._v(" 3. High level design - Architectural Patterns and Styles")]),e._v(" "),r("h3",{attrs:{id:"_3-1-architecture-style"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-architecture-style"}},[e._v("#")]),e._v(" 3.1 Architecture Style")]),e._v(" "),r("p",[e._v("Microsoft Application Architecture Guide, 2nd Edition\nhttps://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff650706(v%3dpandp.10)")]),e._v(" "),r("p",[e._v("https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ee658117(v=pandp.10)")]),e._v(" "),r("p",[e._v("https://github.com/mspnp")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture01.png",alt:""}})]),e._v(" "),r("h3",{attrs:{id:"_3-2-samples"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-samples"}},[e._v("#")]),e._v(" 3.2 Samples")]),e._v(" "),r("h4",{attrs:{id:"_3-2-1-soa-vs-microservices"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-1-soa-vs-microservices"}},[e._v("#")]),e._v(" 3.2.1 SOA VS Microservices")]),e._v(" "),r("p",[e._v("https://www.youtube.com/watch?v=EpyPFnjue38")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture02.png",alt:""}})]),e._v(" "),r("h4",{attrs:{id:"_3-2-2-cqrs-command-query-responsibility-segregation"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-2-cqrs-command-query-responsibility-segregation"}},[e._v("#")]),e._v(" 3.2.2 CQRS - Command-Query Responsibility Segregation")]),e._v(" "),r("p",[e._v("Principle: responsibility and segregation")]),e._v(" "),r("p",[e._v("https://kalele.io/blog-posts/really-simple-cqrs/\nhttps://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs")]),e._v(" "),r("h2",{attrs:{id:"_4-detail-design-technical-architecture"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-detail-design-technical-architecture"}},[e._v("#")]),e._v(" 4. Detail design - technical architecture")]),e._v(" "),r("h3",{attrs:{id:"_4-1-n-tier"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-n-tier"}},[e._v("#")]),e._v(" 4.1 N-tier")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture03.png",alt:""}})]),e._v(" "),r("h3",{attrs:{id:"_4-2-layer-and-related-concepts"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-layer-and-related-concepts"}},[e._v("#")]),e._v(" 4.2 Layer and related concepts")]),e._v(" "),r("p",[r("strong",[e._v("Presentation Layer")]),e._v("\nMVC, Domain Object(Domain objects can have logic (depending on whether you are using domain-driven design or have anemic data model) and they are usually related to the database structure.)\n"),r("strong",[e._v("Application layer / service layer")]),e._v(" "),r("strong",[e._v("Business Layer")]),e._v("\nBusiness Object DTO (DTOs don't have any logic. They only have fields (state). They are used when transferring data from one layer/subsystem to another)\n"),r("strong",[e._v("Data Access Layer")]),e._v("\nDAO\nThe Data Access Layer(DAL) is the layer of a system that exists between the business logic layer and the persistence / storage layer.\nA DAL might be a single class, or it might be composed of multiple Data Access Objects(DAOs). It may have a facade over the top for the business layer to\ntalk to, hiding the complexity of the data access logic. It might be a third-party object-relational mapping tool(ORM) such as Hibernate.\n"),r("strong",[e._v("Persistence Layer")]),e._v("\nORM(Entity framework) (POCO/entity)")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",[r("code",[e._v("1. MVC framework is for Presentation layer\n2. About Persistence layer \n\ta. PL == DAL\n\tb. PL == Storage, BL - DAL - PL\n")])])]),r("p",[e._v("what is the difference between 3 tier architecture and a mvc?\nhttps://stackoverflow.com/questions/10739914/what-is-the-difference-between-3-tier-architecture-and-a-mvc")]),e._v(" "),r("p",[e._v("At first glance, the three tiers may seem similar to the model-view-controller (MVC) concept; however, topologically they are different.\nA fundamental rule in a three tier architecture is the client tier never communicates directly with the data tier;\nin a three-tier model all communication must pass through the middle tier. Conceptually the three-tier architecture is linear.\nHowever, the model-view-controller MVC architecture is triangular: the view sends updates to the controller, the controller updates the model,\nand the view gets updated directly from the model.")]),e._v(" "),r("h3",{attrs:{id:"_4-3-bl-dal-pl-patterns"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-3-bl-dal-pl-patterns"}},[e._v("#")]),e._v(" 4.3 BL/DAL/PL - patterns")]),e._v(" "),r("p",[r("strong",[e._v("Domain layer(Domain Driven Design)")]),e._v("\nDomain Module Pattern Table Module Pattern Transaction Script Pattern")]),e._v(" "),r("p",[r("strong",[e._v("BL/DAL:")]),e._v("\nData Layer: DAO pattern VS Repository(+unitOfWork) pattern\n"),r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture11.png",alt:""}}),e._v("\nKey Word: Long connection, short connection, connection pool, connection time out,thread safe\nDTO, DAO, Repository, ORM,\nleaky abstraction,code duplication,abstraction inversion")]),e._v(" "),r("p",[e._v("Concerns: resource consuming(frequency of opening/closing connection), too many calculation logic in DB(SP) may cause time out issue, concurrency issue,avoid sharing connections between threads(seems no need to concern this,connection drivers already handle it very well)\nleaky abstraction(The SQL language abstracts away the procedural steps for querying a database, allowing one to merely define what one wants. But certain SQL queries are thousands of times slower than other logically equivalent queries. On an even higher level of abstraction, ORM systems, which isolate object-oriented code from the implementation of object persistence using a relational database, still force the programmer to think in terms of databases, tables, and native SQL queries as soon as performance of ORM-generated queries becomes a concern.)")]),e._v(" "),r("p",[e._v("Tools: DB Profile, db connector\nFramework:\nORM: ORMLite, Asp.Net Entity Framework, "),r("a",{attrs:{href:"https://en.wikipedia.org/wiki/Comparison_of_object-relational_mapping_software",target:"_blank",rel:"noopener noreferrer"}},[e._v("Comparison of object-relational mapping software"),r("OutboundLink")],1),e._v("\nCommon Data Access Layer: ClownFish "),r("a",{attrs:{href:"http://dev.mysql.com/doc/refman/5.7/en/connector-net-info.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("MySQL Connector/Net"),r("OutboundLink")],1),e._v("\nDesign Guidelines&Patterns:\n"),r("a",{attrs:{href:"https://msdn.microsoft.com/en-us/library/ee658127.aspx",target:"_blank",rel:"noopener noreferrer"}},[e._v("Chapter 8: Data Layer Guidelines"),r("OutboundLink")],1),e._v(" "),r("a",{attrs:{href:"https://msdn.microsoft.com/en-us/library/ee658113.aspx",target:"_blank",rel:"noopener noreferrer"}},[e._v("Appendix C: Data Access Technology Matrix"),r("OutboundLink")],1),e._v(" "),r("a",{attrs:{href:"https://msdn.microsoft.com/en-us/library/ms971568.aspx",target:"_blank",rel:"noopener noreferrer"}},[e._v("Writing a Portable Data Access Layer"),r("OutboundLink")],1),e._v(" "),r("a",{attrs:{href:"http://www.agiledata.org/essays/mappingObjects.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Mapping Objects to Relational Databases: O/R Mapping In Detail"),r("OutboundLink")],1),e._v("\nDecisions on DAO pattern VS Repository(+unitOfWork) pattern\nMy previous school assignment was using DAO pattern.\nJSP Servlets send http request, controllers process request, forward to other controllers if needed, controllers call delegates which will invoke relevant services,\nservices call dao(dao interface implemented by daoImpl), dao will do the crud operation.\nDAO would be considered closer to the database, often table-centric. Repository would be considered closer to the Domain, dealing only in Aggregate Roots. A Repository could be implemented using DAO's, but you wouldn't do the opposite.\n--quotes from stackoverflow\n"),r("a",{attrs:{href:"http://hoolihan.net/blog-tim/2010/06/09/datalayer-decisions-repository-dao-services-in-domain-driven-design-applications/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Datalayer Decisions (Repository, DAO, Services) in Domain-Driven-Design Applications"),r("OutboundLink")],1),e._v("\nDB Features:\nMongoDB: Support asynchronous connection")]),e._v(" "),r("p",[e._v("references:\n"),r("a",{attrs:{href:"https://msdn.microsoft.com/en-us/library/8xx3tyca.aspx",target:"_blank",rel:"noopener noreferrer"}},[e._v("SQL Server Connection Pooling (ADO.NET)"),r("OutboundLink")],1),e._v(" "),r("a",{attrs:{href:"https://www.vividcortex.com/blog/2015/01/19/gos-connection-pool-retries-and-timeouts/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Go's Connection Pool, Retries, and Timeouts"),r("OutboundLink")],1),e._v(" "),r("a",{attrs:{href:"http://www.cnblogs.com/fish-li/archive/2012/07/17/ClownFish.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("ClownFish：比手写代码还快的通用数据访问层"),r("OutboundLink")],1),e._v("\nsome misunderstanding and arguments:\n"),r("a",{attrs:{href:"http://stackoverflow.com/questions/4037251/dao-vs-ormhibernate-pattern/4037454#4037454",target:"_blank",rel:"noopener noreferrer"}},[e._v("DAO vs ORM(hibernate) pattern"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Data Access Layer to Business Layer: Repository Pattern:")]),e._v(" "),r("p",[e._v("Key Focus:\n1.Loosely coupled system : components have little or no knowledge about the rest of the components in the application.\n2.Ease of maintain\nAdvantage:\n1.Different components can be changed in isolation without affecting the rest of the components thus making application easier to maintain.\n2.It is more suited to the agile methodology in which changes happen very frequently thus tight coupling will not allow future enhancement.\n3.Creating mock tests is easier as the actual objects can be easily replaced with mock objects.")]),e._v(" "),r("p",[e._v("question: repository vs dal/orm ? repository with DDD? repository and business logic ? dbcontext vs repository?")]),e._v(" "),r("p",[e._v("from http://stackoverflow.com/questions/14092234/how-does-the-repository-pattern-differ-from-a-simple-data-access-layer::")]),e._v(" "),r("blockquote",[r("p",[e._v("Take a look at the \"Using the IQueryable interface\" section and beyond at Extending and Enhancing the Orders and Registrations Bounded Context. It provides an insightful and balanced discussion of DAO/Repository implementations.\nAs subsequently highlighted by Bob Horn, the Persistence Patterns articles summarises that:\n[highlight]Basically, the Repository pattern just means putting a façade over your persistence system so that you can shield the rest of your application code from having to know how persistence works.[/highlight]\nIn general I agree with author's statements, but I'd like to add some details\nDifference between Repository and DAL/ORM that first not only abstracts the persistence mechanism, but also provides collection-like interface for accessing domain objects … andisolates domain objects from details of the database access code:\nDifferences\nFor external layers, such as Business Logic:\n●\tHelps to avoid leaky abstraction. External layers depend on abstraction of Repository, rather than a specific implementation of DAL/ORM. Thus you could avoid all infrastructure and logical dependencies while working with Repository.\n●\toperates with domain objects, rather then a instances of POJO/POCO/DTO\n●\tCRUD operations applied to collection-like interface provided by Repository, rather then specificDAL/ORM methods. For example .net: working with collection that implements IEnumerable, rather then entity-framework context or nhibernate session\nSimilarities\nRepository contains DAL/ORM underneath and serves same purpose")])]),e._v(" "),r("p",[e._v("From msdn")]),e._v(" "),r("blockquote",[r("p",[e._v("Use a repository to separate the logic that retrieves the data and maps it to the entity model from the business logic that acts on the model. The business logic should be agnostic to the type of data that comprises the data source layer. For example, the data source layer can be a database, a SharePoint list, or a Web service.\nThe repository mediates between the data source layer and the business layers of the application. It queries the data source for the data, maps the data from the data source to a business entity, and persists changes in the business entity to the data source. A repository separates the business logic from the interactions with the underlying data source or Web service. The separation between the data and business tiers has three benefits:\n●\tIt centralizes the data logic or Web service access logic.\n●\tIt provides a substitution point for the unit tests.\n●\tIt provides a flexible architecture that can be adapted as the overall design of the application evolves.\nThere are two ways that the repository can query business entities. It can submit a query object to the client's business logic or it can use methods that specify the business criteria. In the latter case, the repository forms the query on the client's behalf. The repository returns a matching set of entities that satisfy the query. The following diagram shows the interactions of the repository with the client and the data source.\nInteractions of the repository")])]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture12.png",alt:""}}),e._v("\nEF/Nhibernate/Dapper already using repository pattern ?  http://stackoverflow.com/questions/19796223/repository-vs-service-pattern-in-dal-ef-and-dapper\nhttps://www.codeproject.com/Tips/572761/Generic-repository-pattern-using-EF-with-Dependenc\nORM VS SQL/stored procedures\nRepository Pattern VS Sql\nRespository Pattern & Unit-of-work Pattern\nhttp://geekswithblogs.net/Aligned/archive/2013/03/12/herersquos-how-the-unit-of-work-is-useful-to-me.aspx\nhttps://msdn.microsoft.com/en-us/magazine/dd882510.aspx\nhttp://codetunnel.io/how-to-combine-the-unit-of-work-pattern-and-repository-pattern-in-an-easy-and-intuitive-way/\nUnit of Work Concurrency")]),e._v(" "),r("p",[e._v("Generic Unit of Work & (Extensible) Repositories Framework https://genericunitofworkandrepositories.codeplex.com/\nGeneric Repository and Unit of Work Pattern, Entity Framework, Unit Testing, Autofac IoC Container and ASP.NET MVC\nhttp://techbrij.com/generic-repository-unit-of-work-entity-framework-unit-testing-asp-net-mvc\nThe Repository Pattern\nhttps://msdn.microsoft.com/en-us/library/ff649690.aspx\nDesign pattern – Inversion of control and Dependency injection\nhttp://www.codeproject.com/Articles/29271/Design-pattern-Inversion-of-control-and-Dependency\nSay No to the Repository Pattern in your DAL  http://tech.pro/blog/1191/say-no-to-the-repository-pattern-in-your-dal\nhttps://cockneycoder.wordpress.com/2013/04/07/why-entity-framework-renders-the-repository-pattern-obsolete/")]),e._v(" "),r("p",[e._v("Business Layer - Facade Pattern:")]),e._v(" "),r("p",[e._v("Provide a unified interface to a set of interfaces in a subsystem. Façade defines a higher-level interface that makes the subsystem easier to use.")]),e._v(" "),r("p",[e._v("Sessions in ASP.NET MVC using Dependency Injection\nDon’t Do Role-Based Authorization Checks; Do Activity-Based Checks")]),e._v(" "),r("p",[e._v("Customer Relationship Management (CRM)")]),e._v(" "),r("p",[e._v("Cross Cutting Layer - AOP")]),e._v(" "),r("p",[e._v("AutoFac/Unity\nResolver Container ILifetimescope\nhttp://blog.darkthread.net/post-2013-11-03-autofac-notes-3-lifetime-scope.aspx\nhttp://www.asp.net/web-api/overview/advanced/dependency-injection")]),e._v(" "),r("p",[e._v("Thinking out of box:\nDDD + EVENT BUS EVENT HANDLER + REPOSITORY\nThe false myth of encapsulating data access in the DAL\ndb connection long or short? default pool? queue?\nstatic class pros&cons (concurrency cache)")]),e._v(" "),r("p",[e._v("**DAL/PL: **\nData Mapper Pattern, ORM Pattern(entity framework or NHibernate), DAO Pattern")]),e._v(" "),r("p",[e._v("**PL/DB: **\nORM (vs Stored Procedure https://rob.conery.io/2015/02/20/its-time-to-get-over-that-stored-procedure-aversion-you-have/)\n.NET 主流的ORM:https://segmentfault.com/a/1190000011676744\nDapper\nClownFish：比手写代码还快的通用数据访问层 https://www.cnblogs.com/fish-li/archive/2012/07/17/ClownFish.html#!comments\nEntity framework (buit on ADO.NET https://stackoverflow.com/questions/22328889/entityframework-vs-pure-ado-net,\nhttps://stackoverflow.com/questions/40506382/what-is-the-difference-between-an-orm-and-ado-net)")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture04.png",alt:""}})]),e._v(" "),r("p",[e._v("Perfomance\nDataReaders, Entity Framework, NHibernate and Dapper\nhttp://www.luisrocha.net/2011/12/data-access-performance-comparison-in.html\nhttps://github.com/lerocha/DotNetDataAccessPerformance/tree/c2a71ede37f3dd9ee437221a84054e504773b626")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/architecture/architecture05.png",alt:""}})]),e._v(" "),r("p",[e._v("Refer:\nPattern vs Data Mapper Pattern\nhttp://www.bradoncode.com/blog/2013/08/repository-vs-domain-model-vs-data.html")]),e._v(" "),r("p",[e._v("Generic repository pattern using EF with Dependency injection\nhttps://www.codeproject.com/Tips/572761/Generic-repository-pattern-using-EF-with-Dependenc\nDesigning the infrastructure persistence layer https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design\nDAL、DAO、ORM、Active Record辨析\nhttps://blog.csdn.net/suiye/article/details/7824943")]),e._v(" "),r("p",[e._v("https://stackoverflow.com/questions/6732124/difference-between-transfer-objects-and-domain-objects\nPO, VO, TO, BO, DAO, POJO https://www.programering.com/a/MDM2kjNwATc.html\nDTO, DAO, and VO in Java https://www.quora.com/What-is-DTO-DAO-and-VO-in-Java")]),e._v(" "),r("p",[e._v("Repository pattern vs DAO pattern\n4 Common Mistakes with the Repository Pattern\nhttps://programmingwithmosh.com/entity-framework/common-mistakes-with-the-repository-pattern/\nDon’t use DAO, use Repository https://thinkinginobjects.com/2012/08/26/dont-use-dao-use-repository/")]),e._v(" "),r("p",[e._v("https://www.thoughtfulcode.com/orm-active-record-vs-data-mapper/\nhttps://social.msdn.microsoft.com/Forums/en-US/aed501f8-d7e4-40d9-8a98-32c5cdc78243/help-with-the-orm-vs-stored-procedures-argument?forum=architecturegeneral\nhttps://www.quora.com/What-are-the-pros-and-cons-of-using-SQL-Stored-Procs-versus-ORM-for-database-quering\nDAO Pattern https://www.baeldung.com/java-dao-pattern")]),e._v(" "),r("h3",{attrs:{id:"_4-4-communication-style"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-communication-style"}},[e._v("#")]),e._v(" 4.4 Communication Style")]),e._v(" "),r("p",[e._v("Webservice VS RPC, refer to "),r("a",{attrs:{href:"/docs/software/java"}},[e._v("java实用基础")]),e._v("\nIPC (microkernel) https://en.wikipedia.org/wiki/Inter-process_communication")]),e._v(" "),r("h2",{attrs:{id:"_5-network-physical-design"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_5-network-physical-design"}},[e._v("#")]),e._v(" 5.Network/Physical design")]),e._v(" "),r("p",[e._v("《参考network部分内容》\nDMZ区面向公网，核心区托管数据库等重要信息，办公区（公司内网）存放公司重要的内部信息（财务、法律文书、人力资源等），外网和办公区都只能通过DMZ访问核心区数据，\n办公区跟外网需要做防火墙、硬盘加密；")]),e._v(" "),r("h2",{attrs:{id:"_6-实际经验-架构和框架演进"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_6-实际经验-架构和框架演进"}},[e._v("#")]),e._v(" 6.实际经验：架构和框架演进")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://www.processon.com/view/link/5cb6c8a4e4b059e209fbf369#map",target:"_blank",rel:"noopener noreferrer"}},[e._v("JAVA架构师学习路线图"),r("OutboundLink")],1)]),e._v(" "),r("p",[e._v("Web framework https://iris-go.com/donate")]),e._v(" "),r("p",[e._v("architect will get evolved along with business growing when critical issues emerge.\nIt's impossible to design an architect which will keep unchanged\nfor example, at the beginning we are limited to one server, some design can not be adopt to such\nsituation which may be time consuming and meaningless.\nLayered Application Guidelines\nhttps://msdn.microsoft.com/en-us/library/ee658109.aspx#ServicesLayers")]),e._v(" "),r("p",[e._v("学习"),r("a",{attrs:{href:"https://segmentfault.com/a/1190000018626163",target:"_blank",rel:"noopener noreferrer"}},[e._v("服务端高并发分布式架构演进之路"),r("OutboundLink")],1)]),e._v(" "),r("p",[r("a",{attrs:{href:"https://hackernoon.com/how-a-first-time-cto-can-choose-the-right-techstack-for-their-startup-nc4m32uk",target:"_blank",rel:"noopener noreferrer"}},[e._v("How a First Time CTO Can Choose the Right Techstack for Their Startup "),r("OutboundLink")],1),e._v(" "),r("img",{attrs:{src:"https://hackernoon.com/drafts/79333yx3.png",alt:""}})]),e._v(" "),r("p",[e._v("对话独角兽得物（毒）App CTO 陈思淼：组建技术团队的十件事\nhttps://mp.weixin.qq.com/s/TNgbzCzqSCWy_ZcK_ZZC_w")]),e._v(" "),r("p",[e._v("Why We Leverage Multi-tenancy in Uber’s Microservice Architecture\nhttps://eng.uber.com/multitenancy-microservice-architecture/")]),e._v(" "),r("p",[e._v(".NET技术+25台服务器怎样支撑世界第54大网站 https://www.csdn.net/article/2014-07-22/2820774-stackoverflow-update-560m-pageviews-a-month-25-servers")]),e._v(" "),r("p",[e._v("可伸缩性最佳实践：来自eBay的经验 https://kb.cnblogs.com/page/157745/")]),e._v(" "),r("disqus")],1)}),[],!1,null,null,null);t.default=n.exports}}]);