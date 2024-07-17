network:
could you name the layers of TCP/IP Model and You can elaborate on the functions of each layer

you should know the 3 way handshake for tcp connection, how about tcp termination, is it the same 3 way or different? why?

you devlelped restful api before, I assume your restful api was built on http protocol, 
could you name another protocol or products build on the protocol and elaborate the differences between http?

please brief the tcp/ip model (OR the Open Systems Interconnection model )
https://lyhistory.com/docs/software/network/network.html#_1-%E7%BD%91%E7%BB%9C%E5%88%86%E5%B1%82-tcp-ip%E5%8D%8F%E8%AE%AE%E7%BB%84

could you name some of the typical protocols for the top 3 layer（application/transport/network）

do you know why TCP uses 4 way finishing connection termination instead of 3 way like the establishment handshake?

explain the difference between HTTP and HTTTPS

which layer does the tls/ssl work on

does TLS handshake happen after or before TCP handshake?

https://lyhistory.com/docs/software/highlevel/publickey_infrastructure.html#clarification

## java
nio https://lyhistory.com/docs/software/buildingblock/nio_epoll.html#%E5%9F%BA%E4%BA%8Eepoll%E7%9A%84%E6%A1%86%E6%9E%B6%E5%92%8C%E4%BA%A7%E5%93%81-netty-redis-haproxy%E7%AD%89

is i++ thread safe?
https://lyhistory.com/docs/software/highlevel/threadsafe.html#%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B%E4%B8%8E%E7%AB%9E%E4%BA%89%E8%B5%84%E6%BA%90

concurrency并发 VS Parallelism并行
https://lyhistory.com/docs/software/highlevel/concurrent.html#concurrency%E5%B9%B6%E5%8F%91-vs-parallelism%E5%B9%B6%E8%A1%8C


how do you resolve dependency conflicts

can you name the JVM class loader?

spring bean vs java bean?

the default scope of bean in springboot (singleton prototype)
https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html

spring bean lifecycle
https://medium.com/@TheTechDude/spring-bean-lifecycle-full-guide-f865966e89ce

what is dependency injection or invesion of control?
https://www.linkedin.com/pulse/spring-ioc-boot-bandewar-shiva-krishna/

+ Inversion of Control (IoC), in the context of the Spring framework is a central design pattern with a primary focus on dependency injection (DI). IoC not only limited to Dependency Injection(DI), but also involves the complete lifecycle management of dependencies within the Spring framework.
+ At its core, IoC revolves around the concept of the Spring application context. This context encapsulates the IoC container, often referred to as the Bean Factory, which is responsible for managing beans throughout the application's runtime. Spring Boot further enhances this by providing automatic configuration for the Application Context.
+ The IoC container is responsible for managing the dependencies of objects throughout their lifecycle. This includes injecting dependencies into other objects, as well as releasing dependencies when objects are no longer needed. In Spring, dependencies are typically injected during application startup, as they are added to the Bean Factory. However, it is also possible to inject dependencies at runtime. This can be useful for certain types of applications, such as those that need to be able to dynamically load new components.

benefit:
+ One of the key benefits of IoC is that it allows objects to be loosely coupled. This means that objects do not need to know how to create or manage their dependencies. Instead, the IoC container takes care of this for them.
+ This is achieved by having objects declare their dependencies, and then the IoC container injects those dependencies into the objects when they are created. The IoC container can also manage the lifecycle of the dependencies, which helps to prevent memory leaks and other problems.
+ In Spring, the IoC container is typically initialized from the main class of the application. The main class then configures the IoC container by telling it about the beans that need to be created and managed. The IoC container then creates the beans and injects their dependencies. 

can you name the IOC container in spring?
https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html


can you name the annotations in spring or spring boot？
example：@components 
@Conditional @ConditionalOn

https://lyhistory.com/docs/software/programming/java_springboot.html#_1-1-spring-ioc%E5%AE%B9%E5%99%A8

## frontend

what's the difference between javascript typescript?
how about nodejs and reactjs, what's differences and things in common

closure

cross origin resource sharing
javascript typescript?

闭包 closure

responsive layout

cross origin resource sharing

virtual dom（

webpage loading speed optimize
https://lyhistory.com/docs/software/programming/interview_frontend.html#%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96

## high level

what does CAP theory actually say ： consistency availability partition tolerance

BASEtheory

https://lyhistory.com/docs/software/highlevel/distrubuted_system.html#_2-1-2-%E4%B8%80%E8%87%B4%E6%80%A7%E7%8A%B6%E6%80%81%E6%9C%BA

## monolithic application to microservice
https://lyhistory.com/docs/software/highlevel/microservice.html#%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1

is it correct if I say microservices is just to slice into smaller services based on business logic for example, or can i say microservices is only comprised of small services, what else is missing?

what problems does microservices arcthitecture bring in and how can we solve them

could you give me some examples of how microservices communicated with each other

single point of failure
transactions consistency



have you ever heard of CRUD, what's it? what's the method in a http request to do CRUD respectively?
GET for Read, POST is for CREATE, PUT is for UPDATE and DELETE is for DELETE

for a typical client-server model, what's 
SQL:


blockchain:

blockchain aka distributed ledger, what do you think is the fundmental differences between distributed ledger and traditional distributed system like spark flink kafka  
byzantine general problem

what's the property of Digital Signature
