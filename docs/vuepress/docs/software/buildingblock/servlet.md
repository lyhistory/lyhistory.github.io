---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《Servlet到底是什么？》

## What is?

**Web/HTTP Server,Application Server, Web/Servlet Container(Servlet Engines)关系和区别？**

![](/docs/docs_image/software/buildingblock/servlet01.png)
> The servlet container is attached to a webserver which listens on HTTP requests on a certain port number, which is usually 80. 
> When a client (user with a web-browser) sends a HTTP request, the servlet container will create new HttpServletRequest and HttpServletResponse objects and pass it through the methods of the already-created Filter and Servlet instances whose URL-pattern matches the request URL, all in the same thread.
> When the HTTP response is committed and finished, then both the request and response objects will be trashed.
> https://medium.com/@viveklata/how-web-servers-work-d880cc99b676


+ Web/HTTP Servers: 

	- 接收客户端http request，返回http response;
	- meant for receiving the user request and identifying the resource to be processed and sending the response to the client; Web servers are responsible for serving static content and interat with servlet for dynamic content;
	- Apache and IIS are two popular web servers, Apache is used everywhere including Java world but IIS is more popular in Microsoft ASP .NET world.
	
+ Web/Servlet container: 

	- 接收web server的http servlet request，返回http servlet response;
	- only responsible for generating HTML by executing JSP and Servlet on Server side, compiling the servlet using the javac and then executing the class file, The output of the servlet excution would be routed to the Web/HTTP Servers which would send it as a response to the client.
	- Apache Tomcat and Jetty are two of the most popular Servlet engine in Java web world.
	
+ Application Server:
	
	- 一般就是将Web/Servlet container wrap up作为一个应用程序服务；
	- is responsible for serving dynamic content, managing EJB pool, facilitating distributed transaction, facilitating application lookup over JNDI, application security and others;
	- From Java EE perspective couple of popular application servers are IBM WebSphere, Oracle WebLogic, Glassfish and Redhat's JBoss. 
	

**.NET中对应的servlet概念是？**

> Microsoft® ASP.NET does not provide a direct equivalent to the servlet class. 

> Instead, there are two basic alternatives. 

> The first alternative, which is used by the Java Language Conversion Assistant (JLCA), is to encapsulate the functionality of a servlet in the codebehind of a **non-graphical ASP.NET page**. 

> The other alternative is to create a new **HttpHandler** and direct a URL request to a specified class. The HTTPHandler is actually closer to the new Filter functionality in the servlet specification.

> https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/aa478987(v=msdn.10)?redirectedfrom=MSDN

可以看到的是servlet并不只是一个web概念，它在non-graphical的环境一样工作，
比如一个很常见的shiro登录组件也是基于servlet，当然了shiro增加了其他特性比如利用built-in enterprise session management从而还支持非servlet/web环境，
而.NET对应于web环境引入了httphandler，非web环境用了其他的方式；

## 基础

### Servlet生命周期

1，初始化阶段:调用init()方法：

init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用，在后续每次用户请求时不再调用；

Servlet 创建于用户第一次调用对应于该 Servlet 的 URL 时，但是您也可以指定 Servlet 在服务器第一次启动时被加载。

当第一个用户调用某一个 Servlet 时，就会创建一个该Servlet 实例，init() 方法简单地创建或加载一些数据，这些数据将被用于 Servlet 的整个生命周期。

2，响应客户请求阶段:调用service()方法

每一个用户请求都会产生一个新的线程，每次服务器接收到一个 Servlet 请求时，服务器会产生一个新的线程并调用服务；
service() 方法检查 HTTP 请求类型（GET、POST、PUT、DELETE 等），并在适当的时候调用 doGet、doPost、doPut，doDelete 等方法。

3，终止阶段:调用destroy()方法

### Servlet的单例多线程安全

单例：Servlet只在用户第一次请求时被实例化，并且是单例的，在服务器重启或关闭时才会被销毁。

多线程：当请求到达时，Servlet容器(Tomcat...)通过线程池中可用的线程给请求者并执行Service方法，每个线程执行一个单一的 Servlet 实例的 service() 方法

有人说单例处理多线程会有性能问题，因为并发请求肯定要排队，其实未必，很多高并发的框架都是单例模式；

有人提出了实例池，但是我没有找到太多信息，仅供参考：

Servlet thread pool vs Servlet instance pool： https://stackoverflow.com/questions/7826452/servlet-thread-pool-vs-servlet-instance-pool-by-the-web-container
Servlet的单例模式的理解 https://www.breakyizhan.com/java/5016.html

## 应用

**spring boot supports**

> Spring Boot supports the following embedded servlet containers:

> You can also deploy Spring Boot applications to any Servlet 3.1+ compatible container.

> https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-system-requirements-servlet-containers

| Name | Servlet Version |
| -- | -- |
| Tomcat 9.0 | 4.0 |
| Jetty 9.4 | 3.1 |
| Undertow 2.0 | 4.0 |

spring boot Framework支持的三种环境：
![](/docs/docs_image/software/buildingblock/servlet02.png)

---

ref

https://www.w3cschool.cn/servlet/servlet-life-cycle.html

https://blog.csdn.net/u010763324/article/details/80747559
Servlet的多线程和线程安全
https://www.cnblogs.com/binyue/p/4513577.html