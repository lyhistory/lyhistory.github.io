---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---


[回目录](/docs/software)  《spring分布式微服务入门》



##  Overview

我们今天来梳理归纳一下java的开发框架，首先为什么需要框架？

1. 节约成本

不可能所有东西都从零造起，成本太高，spring融合了市场上大部分的开源项目，可以直接‘免费’利用

2. 安全考虑

当前网络环境复杂，攻击无处不在，成熟的框架已经被主流公司接受使用，很多坑已经被前人踩过，站在巨人的肩膀上是明智之选，不用交额外的智商税

3. 业务发展

spring boot不只是框架，还是spring cloud的一部分，spring cloud是微服务架构的一套完整是有序框架集合，
spring是建筑材料，spring boot是脚手架，spring cloud就是行业规范，采用行业规范的开发模式有利于IT更好的服务business和业务拓展

### SOA?微服务?
我们常说用spring boot构建微服务，又说spring cloud构建微服务，他们到底是什么关系？

引用我在[微服务架构](/docs/software/highlevel/microservice)一章中关于微服务的解释：
> 首先微服务是啥，微服务首先是一种架构思想，
> 首先最初的很多产品都是单体monolithic架构，所有的服务都紧紧耦合在一个解决方案中，难以扩展，只能通过加cpu加内存的方式扩展，举例一个电商平台,
> 刚开始所有功能都放在一个解决方案，比如托管在Apache的一个war或者托管在iis的一个.net mvc程序，
> 随着项目的发展，团队的壮大，单体会变得庞大而难以维护，我们需要将功能拆分开，比如商家系统、买家系统、管理后台系统等，面向业务或者叫服务切分，分而治之，这种粒度的就是SOA架构，
> 其显著缺点：
> 1.从技术的角度，其实业务的切分在技术层面上仍然会有大面积的重叠，因此如果业务切割的不好，形成各种依赖，有可能在修改时牵一发而动全身
> 2.从业务角度来说，由于是业务的切分，所以当需要发展新的业务时就需要重新构建一个完全新的服务，不利于基于业务创新和发现
> 所以引入微服务的概念，微服务进一步将服务自底向上或自上到下做更细的切分，最下面是基础系统服务（短信、邮件、存储、缓存、消息推送等），中间是共享服务（支付系统、订单系统、仓储系统等），
> 最上面则是业务层（零售系统、团购系统、采购系统），比如我们要加一个闪购业务也是很轻松的，不用从底到上再来一遍，只需要基于基础服务和共享服务做业务开发

### spring VS Springboot
#### Spring Boot 不是一个新的 IoC 容器，它只是 Spring Framework 的上层封装。

Rod Johnson创建的开源框架interface21是 Spring的前身，随着spring从小框架发展为大而全的企业级框架，spring对市面上主流的开源软件都有了对应的组件支持，
人们发现使用spring项目开发变得难用，往往需要引入很多配置，难以维护容易出错，spring因此冠名配置地狱；

Spring boot是基于spring抽象出来的开发框架，是快速开发的scaffold脚手架，spring boot丧心病狂的运用依赖注入DI的思想，配置文件可以auto config，用户只需要定义好需要的bean，
spring boot的大容器会进行管理，丰富的starter让开发者可以集中精力在业务逻辑上而不是依赖的配置管理；

依赖注入的思想简单来说就比如小孩要从冰箱拿吃的，但是不应该自己拿，应该交由家长来处理，因为小孩可能会忘记关冰箱门，可能会打乱冰箱里面其他东西，总之小孩这个组件应该只关心自己的事情，不要做这些大人才能做好的事情，
所以从冰箱拿东西吃要交由家长处理，在spring boot中，小孩可以采用构造函数注入或者setter based如autowired方式来使用家长组件；

Spring Boot 不是对 Spring 的替代，而是在 Spring 基础上的"封装和增强"，解决的是 Spring 自身的痛点。核心差异：
1. 配置方式：从"XML地狱"到"零配置启动"
2. 依赖管理：从"版本地狱"到"起步依赖"
3. 内嵌服务器：从"部署战争"到"java -jar"
4. 自动配置（Auto-Configuration）：最核心的差异
这是 Spring Boot 的灵魂。原理一句话：根据 classpath 里有什么依赖，自动帮你配好对应的 Bean。
5. 生产级特性：Actuator
Spring 本身没有内置的运维监控能力。Spring Boot Actuator 提供：spring-boot-starter-actuator
6. 开发体验：DevTools spring-boot-devtools

Spring Boot 有什么缺点？
JAR 包体积大（内嵌容器+所有依赖）；启动时间比传统部署稍长；自动配置的"黑盒感"有时会让排查问题变难（需要理解自动配置原理）；对于极简场景有些"杀鸡用牛刀"。

#### 为什么叫 Spring Bean 而不是 Spring Boot Bean
Bean 的管理者是 Spring Framework，不是 Spring Boot
Spring Boot Application
    ↓ 启动
SpringApplication.run()
    ↓ 创建并启动
ApplicationContext（来自 Spring Framework）
    ↓ 管理
Bean 的整个生命周期

Spring Boot 做的事情是：

自动帮你创建了 ApplicationContext（以前你要自己写 new ClassPathXmlApplicationContext("app.xml")）

自动帮你扫描和注册 BeanDefinition（以前你要手动在 XML 里一个个 <bean>声明）

自动配置一堆常用组件（DataSource、WebMvc 等）

但它没有自己实现一套 Bean 的创建、注入、初始化、销毁流程。这些全是 Spring Framework 的 AbstractApplicationContext、DefaultListableBeanFactory、BeanFactory在做。

所以：Bean 的生命周期 = Spring Framework 的 Bean 生命周期。跟 Spring Boot 无关。

We usually say Spring Bean, not Spring Boot Bean. Because the IoC container and bean lifecycle management come from Spring Framework. Spring Boot is just a layer on top that simplifies configuration through auto-configuration and starter dependencies. Whether you define a bean with XML, @Component, or @Bean, it all goes through the same Spring container — same lifecycle, same scope, same proxy mechanism.

#### XML 和注解的本质区别 —— 只是"配置方式"不同
传统 Spring 用 XML，Spring Boot 用注解。但这只是 Bean 定义的来源不同，Bean 本身和生命周期完全一样。
关键认知：注解不是 Spring Boot 发明的

Spring 2.5 (2007) 引入的特性 @Autowired、@Component、@Service、@Repository
Spring 3.0 (2009) 引入的特性 @Configuration、@Bean、@ComponentScan
Spring 3.1 (2011) 引入的特性 	@Profile
Spring 4.x 引入的特性 @Conditional
Spring Boot 1.0 (2014) 引入的特性 啥新注解都没加，只是用上面的东西做了自动配置，没有发明任何新的 Bean 管理方式。​ 它只是把 Spring Framework 已有的注解能力组合成了"自动配置"（比如 @EnableAutoConfiguration背后就是一堆 @Conditional判断）。
refresh()里的 12 个步骤，从 Spring 2.x 到 Spring 6.x，核心流程几乎没变

#### Spring Boot 到底多了什么

| 能力 | 传统 Spring | Spring Boot |
|------|------------|-------------|
| 定义 Bean | XML `<bean>` 或 `@Component` | `@Component` / `@Bean`（一样） |
| 依赖注入 | `@Autowired` | `@Autowired`（一样） |
| 生命周期 | `@PostConstruct` | `@PostConstruct`（一样） |
| 扫描包 | XML 里配 `<context:component-scan>` | `@SpringBootApplication` 自动扫（底层还是 `ComponentScan`） |
| 第三方库集成 | 手写 XML 配置 | `spring-boot-starter-*` 自动配置（底层还是 `@Configuration` + `@Conditional`） |
| 嵌入 Web 容器 | 外置 Tomcat + WAR | 内嵌 Tomcat + JAR（容器变了，Bean 没变） |

### SpringBoot SpringCloud

spring-cloud是一套完整的微服务解决方案，是一系列框架的有序集合，提供了分布式的各种解决方案：
服务开发（springBoot spring springMVC）、服务配置中心（SpringCloudConfig Chef）、服务发现（eureka zookeeper）、服务调用（rest rpc）、负载均衡（ribbon nginx）、服务熔断器、服务监控、服务部署（docker kubernetes）、消息队列（kafka rabbitmq）

所以可见一个个具体的微服务(这里说的微服务就是具体的一个个应用了)是用spring boot开发，spring cloud又提供了服务配置中心、服务注册发现等所谓微服务治理的解决方案

1.spring boot是一个快速开发框架，应该说是spring系列的集大成者。我们可以简单的把spring boot理解成是一个快速开发的脚手架。
2.微服务往往是指Spring Cloud，微服务是一个框架。
3.如果把基于微服务架构的软件比作是一个大厦，钢筋混凝土结构就是spring cloud，而砖头瓦块等就是spring boot。微服务的一个一个服务是用spring boot开发的，spring cloud提供服务注册与发现、负载均衡、API网管、熔断路由、配置中心等框架性服务，当然一个完整的微服务系统有很多其他的内容，例如服务拆分、监控、限流降级等等。

dubbo常常拿来跟spring cloud对比，实际目前已经不具有可比性了，Dubbo现在只是一款高性能的Java RPC框架，只能跟spring cloud集合中的服务调用部分REST RPC做对比

spring cloud alibaba是spring cloud的其中一个微服务解决方案


## Spring Framework

https://docs.spring.io/spring/docs/current/spring-framework-reference/
Project generator
https://start.spring.io/
https://www.tutorialspoint.com/spring/spring_quick_guide.htm
https://docs.spring.io/spring/docs/5.1.6.RELEASE/spring-framework-reference/ (spring boot 2.1.4 depend on spring 5.1.6)

### architecture
![](/docs/docs_image/software/java/java_spring01.png)

### Beans

[**Spring uses the class name and converts the first letter to lowercase**.](https://www.baeldung.com/spring-bean-names)

Spring Bean 生命周期完整时序图
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Spring IoC Container Startup                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             
   │
│  1. 扫描 & 解析配置                                                           
   │
│     ├── 读取 @ComponentScan / @Import / XML                                  
   │
│     └── 将 BeanDefinition 注册到 BeanFactory                                 
   │
│                                                                             
   │
│  2. 实例化前 (Instantiation Aware)                                           
   │
│     ├── BeanFactoryPostProcessor 执行（可修改 BeanDefinition）                
   │
│     └── InstantiationAwareBeanPostProcessor.postProcessBeforeInstantiation() 
   │
│                                                                             
   │
│  3. 实例化 (Instantiation)                                                   
   │
│     └── 调用构造器创建对象（此时依赖还没注入，对象处于"半成品"状态）             
   │
│         ├── ★ 如果有构造器注入 → 递归触发依赖 Bean 的创建（回到步骤2）         
   │
│         └── ★ 这就是"构造器注入控制顺序"的底层原因                            
   │
│                                                                             
   │
│  4. 属性填充 (Populate Properties)                                           
   │
│     ├── 解析 @Autowired / @Value / @Resource                                 
   │
│     ├── 字段注入 & Setter 注入在这里完成                                      
   │
│     └── InstantiationAwareBeanPostProcessor.postProcessProperties()          
   │
│                                                                             
   │
│  5. Aware 回调                                                               
   │
│     ├── BeanNameAware.setBeanName()                                          
   │
│     ├── BeanClassLoaderAware.setBeanClassLoader()                            
   │
│     ├── BeanFactoryAware.setBeanFactory()                                    
   │
│     └── ApplicationContextAware.setApplicationContext()                      
   │
│                                                                             
   │
│  6. 初始化前 (Before Initialization)                                         
   │
│     └── BeanPostProcessor.postProcessBeforeInitialization()                  
   │
│         ├── @PostConstruct 就是在这里被调用的！                               
   │
│         └── ApplicationContext 里的 CommonAnnotationBeanPostProcessor         
   │
│                                                                             
│  7. 初始化 (Initialization)                                                  
│     ├── ★ @PostConstruct 标注的方法执行                                       
│     ├── InitializingBean.afterPropertiesSet()                                
│     └── 自定义 init-method / @Bean(initMethod=...)                           
│                                                                             
│  8. 初始化后 (After Initialization)                                          
│     └── BeanPostProcessor.postProcessAfterInitialization()                   
│         └── ★ AOP 代理就是在这里织入的（如果 Bean 需要被代理）                 
│                                                                             
│  9. Bean 就绪 — 放入单例池 (Singleton Objects)，可以被使用                     
│                                                                             
│  ───────────────────── 应用运行期间 ─────────────────────                     
│                                                                             
│  10. 销毁阶段 (Shutdown)                                                     
│      ├── @PreDestroy 标注的方法                                               
│      ├── DisposableBean.destroy()                                            
│      └── 自定义 destroy-method                                                
│                                                                             
└─────────────────────────────────────────────────────────────────────────────┘
```

键顺序速记口诀：

构 → 填 → Aware → @PostConstruct → afterPropertiesSet → initMethod → AOP代理 → 就绪

#### Autowired

https://www.baeldung.com/spring-autowire

#### Spring AOP
[refer to aop-spring aop](/software/programming/aop.md#spring-aop)

## Spring MVC
[spring mvc 处理流程源码解析](https://blog.csdn.net/u013905744/article/details/110263867)

Spring 是基础底盘；Spring MVC 是在 Spring 基础上专门干 Web 的那一层；SpringBoot 是把 Spring + SpringMVC + 一堆常用组件打包好、帮你省配置的脚手架。

## [SpringBoot Framework](docs/software/java_springboot)


## [Spring Cloud](/software/programming/java_springcloud.md) 

## Versions Compatibility

### Spring VS Spring Integration VS Spring Boot VS 3rd-party clients

+ 3rd-party

  通常是Apache library

+ Spring 集成了3rd party，比如 spring kafka，spring data redis，相当于在相应的3rd party，kafka-clients，redis的lettuce、jedis等基础上提供了统一的接口和规范，provides a "template" as a high-level abstraction，helps you apply core Spring concepts (dependency injection and declarative)，如果直接使用3rd-party，我们需要自定义@ConfigurationProperties来管理配置，以及@Configuration来定义比如kafkaProuducer等bean，从而使用autowired注入（在spring boot中，注入配置和定义bean都是在spring-boot-autoconfigure）

  例如：

  spring kafka 提供了 kafkaTemplate和KafkaListener，~~替代了kafka-clients的producer和consumer~~实际上通过pom dependency hierarchy可以看到spring-kafka是依赖于kafka-clients的，只需要引入spring-kafka即可 https://www.baeldung.com/spring-kafka

  但是有些时候不仅需要引用spring提供的lib，还需要引用3rd party lib，比如使用spring data redis也需要自己引入lettuce或者jedis https://www.baeldung.com/spring-data-redis-tutorial

  这个时候经常就会因为 spring data redis版本和三方包版本不同有冲突，这种情况下使用spring boot就可以解决这个烦恼，spring boot提供的starter帮我们引用好了相应版本的spring data redis以及 lettuce和jedis

  ```
  using spring:
  <dependency>
      <groupId>org.springframework.data</groupId>
      <artifactId>spring-data-redis</artifactId>
      <version>2.3.3.RELEASE</version>
   </dependency>
  
  <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>3.3.0</version>
      <type>jar</type>
  </dependency>
  
  using spring boot:
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
      <version>2.3.3.RELEASE</version>
  </dependency>
  ```

+ Spring Integration 

  based on Spring,  Extends the Spring programming model to support the well-known Enterprise Integration Patterns.

  https://spring.io/projects/spring-integration

+ Spring boot 

  如前面所说提供starter，集成了3rd party，所有的starter在这里

  https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-starters

### Compatibility Troubleshooting

+ general 

  查看release note，比如

  https://stackoverflow.com/questions/61118552/zookeeper-3-5-x-backwards-compability-with-zookeeper-3-4-x-clients

  - 3.4.x clients **compatible** with 3.5.x server
  - 3.4.x and 3.5.x clients can be mixed on 3.5 server
  - 3.5.x clients **incompatible** with 3.4 server

+ kafka

  Kafka is tested against the Zookeeper version it comes with.

  If you want to upgrade, you'll need to verify Zookeeper itself is  backwards compatible with older clients/protocols that Kafka may use.

  https://github.com/apache/kafka/search?q=zookeeper+version&type=commits

  https://archive.apache.org/dist/kafka/1.1.0/RELEASE_NOTES.html

  

+ curator

  curator-recipies 2.12.0=>

  ​      curator-framework 2.12.0=>

  ​      curator-client 2.12.0=>

  ​      zookeeper 3.4.8

+ 使用 springfox2.9.2，升级springboot从2.0.5到2.4.5，遇到错误：

  ```
  Description:
  
  An attempt was made to call a method that does not exist. The attempt was made from the following location:
  
      org.springframework.hateoas.server.core.DelegatingLinkRelationProvider.<init>(DelegatingLinkRelationProvider.java:36)
  
  The following method did not exist:
  
      org.springframework.plugin.core.PluginRegistry.of([Lorg/springframework/plugin/core/Plugin;)Lorg/springframework/plugin/core/PluginRegistry;
  
  The method's class, org.springframework.plugin.core.PluginRegistry, is available from the following locations:
  
      jar:file:/C:/Users/yue.liu/.m2/repository/org/springframework/plugin/spring-plugin-core/1.2.0.RELEASE/spring-plugin-core-1.2.0.RELEASE.jar!/org/springframework/plugin/core/PluginRegistry.class
  
  The class hierarchy was loaded from the following locations:
  
      org.springframework.plugin.core.PluginRegistry: file:/C:/Users/yue.liu/.m2/repository/org/springframework/plugin/spring-plugin-core/1.2.0.RELEASE/spring-plugin-core-1.2.0.RELEASE.jar
  
  
  Action:
  
  Correct the classpath of your application so that it contains a single, compatible version of org.springframework.plugin.core.PluginRegistry
  ```

  spring-boot-starter-data-rest
  => spring-data-rest-webmvc
  => spring-data-rest-core
  => spring-plugin-core 

  springfox-swagger2
  => spring-plugin-core

  https://github.com/springfox/springfox/issues/3052

  https://github.com/springfox/springfox/releases

  springfox 3.0: Requires SpringBoot 2.2+ (not tested with earlier versions)


### 3rd-party&wrapper: kafka

#### Client & Sever

+ 直接使用3rd-party

  ```
  <dependency>
       <groupId>org.apache.kafka</groupId>
       <artifactId>kafka-clients</artifactId>
       <version>2.2.0</version>
   </dependency>
  ```

  

+ 版本

  https://cwiki.apache.org/confluence/display/KAFKA/Compatibility+Matrix

  https://www.confluent.io/blog/upgrading-apache-kafka-clients-just-got-easier/

  Bidirectional Client Compatibility--- KIP-35 enabled clients: any version (Release: Broker protocol - 0.10.0, Java clients - 0.10.2)

  https://stackoverflow.com/questions/55691662/determine-the-kafka-client-compatibility-with-kafka-broker/67463949#67463949

#### Client & Client Wrapper

+ 使用 Spring-Kafka（spring-kafka自身依赖于kafka-clients）

  https://docs.spring.io/spring-kafka/reference/html/#introduction

  If you are not using Spring Boot, declare the `spring-kafka` jar as a dependency in your project.

  ```
  <dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
    <version>2.7.0</version>
  </dependency>
  ```

  When using Spring Boot, (and you haven’t used start.spring.io to create your project), omit the version and Boot will automatically bring in the correct version that is compatible with your Boot version: 

  ```
  <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.1.4.RELEASE</version>
  </parent>
      
  <dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
  </dependency>
  
  ```

  

+ 版本

  https://spring.io/projects/spring-kafka

### 3rd-party&wrapper: Redis

https://github.com/spring-projects/spring-data-redis/issues/2061

#### Client & Server

+ 直接使用3rd-party lettuce / jedis

  

+ 版本

  查看release note

  Redis 2.6+ up to Redis 6.x. In terms of Java runtime, Lettuce requires at least Java 8 and works with Java 16. It is tested continuously against the latest Redis source-build.

  https://github.com/lettuce-io/lettuce-core/releases

#### Client & Client Wrapper

+ 使用 

  spring-boot-starter-data-redis（自动引入spring-data-redis 和lettuce和jedis）

  

+ 版本

  https://search.maven.org/artifact/org.springframework.boot/spring-boot-starter-data-redis/2.4.5/jar

  spring-boot-starter-data-redis 2.4.5 

  => spring-data-redis 2.4.8 

  => lettuce 6.0.4.RELEASE

## ref
[为什么说 Java 程序员到了必须掌握 Spring Boot 的时候？](https://www.cnblogs.com/ityouknow/p/9175980.html)
[聊一聊Spring中的代理](https://www.jianshu.com/p/b73a9bdb7612)
[Spring Cloud](https://spring.io/projects/spring-cloud)
[spring boot 和微服务的关系?](https://www.zhihu.com/question/286198868)
[重新理解微服务](https://zhuanlan.zhihu.com/p/25843782)
[架构设计漫步：从单体架构、SOA到微服务](https://www.jianshu.com/p/6fe0795c782d)
[Microservices](https://martinfowler.com/articles/microservices.html)


guides:
https://spring.io/guides#gs
https://spring.io/guides/gs/spring-boot/
Starters samples code:
https://docs.spring.io/spring-boot/docs/2.1.4.RELEASE/reference/htmlsingle/#using-boot-starter
https://github.com/spring-projects/spring-boot/tree/master/spring-boot-samples
Docs:
https://docs.spring.io/spring-boot/docs/2.1.4.RELEASE/reference/htmlsingle/
Unit test:
https://stackabuse.com/how-to-test-a-spring-boot-application/
https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-testing.html

Spring Boot中如何干掉过多的if else！ https://mp.weixin.qq.com/s/Uf8KGTbNcuDtwIlpMJnaXg



todo:
Mvc
Thymeleaf
Realm

<disqus/>