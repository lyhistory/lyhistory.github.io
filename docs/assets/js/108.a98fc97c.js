(window.webpackJsonp=window.webpackJsonp||[]).push([[108],{352:function(e,t,r){"use strict";r.r(t);var n=r(0),s=Object(n.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[r("a",{attrs:{href:"/docs/software"}},[e._v("回目录")]),e._v("  《Servlet到底是什么？》")]),e._v(" "),r("h2",{attrs:{id:"what-is"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#what-is"}},[e._v("#")]),e._v(" What is?")]),e._v(" "),r("p",[r("strong",[e._v("Web/HTTP Server,Application Server, Web/Servlet Container(Servlet Engines)关系和区别？")])]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/buildingblock/servlet01.png",alt:""}})]),e._v(" "),r("blockquote",[r("p",[e._v("The servlet container is attached to a webserver which listens on HTTP requests on a certain port number, which is usually 80.\nWhen a client (user with a web-browser) sends a HTTP request, the servlet container will create new HttpServletRequest and HttpServletResponse objects and pass it through the methods of the already-created Filter and Servlet instances whose URL-pattern matches the request URL, all in the same thread.\nWhen the HTTP response is committed and finished, then both the request and response objects will be trashed.\nhttps://medium.com/@viveklata/how-web-servers-work-d880cc99b676")])]),e._v(" "),r("ul",[r("li",[r("p",[e._v("Web/HTTP Servers:")]),e._v(" "),r("ul",[r("li",[e._v("接收客户端http request，返回http response;")]),e._v(" "),r("li",[e._v("meant for receiving the user request and identifying the resource to be processed and sending the response to the client; Web servers are responsible for serving static content and interat with servlet for dynamic content;")]),e._v(" "),r("li",[e._v("Apache and IIS are two popular web servers, Apache is used everywhere including Java world but IIS is more popular in Microsoft ASP .NET world.")])])]),e._v(" "),r("li",[r("p",[e._v("Web/Servlet container:")]),e._v(" "),r("ul",[r("li",[e._v("接收web server的http servlet request，返回http servlet response;")]),e._v(" "),r("li",[e._v("only responsible for generating HTML by executing JSP and Servlet on Server side, compiling the servlet using the javac and then executing the class file, The output of the servlet excution would be routed to the Web/HTTP Servers which would send it as a response to the client.")]),e._v(" "),r("li",[e._v("Apache Tomcat and Jetty are two of the most popular Servlet engine in Java web world.")])])]),e._v(" "),r("li",[r("p",[e._v("Application Server:")]),e._v(" "),r("ul",[r("li",[e._v("一般就是将Web/Servlet container wrap up作为一个应用程序服务；")]),e._v(" "),r("li",[e._v("is responsible for serving dynamic content, managing EJB pool, facilitating distributed transaction, facilitating application lookup over JNDI, application security and others;")]),e._v(" "),r("li",[e._v("From Java EE perspective couple of popular application servers are IBM WebSphere, Oracle WebLogic, Glassfish and Redhat's JBoss.")])])])]),e._v(" "),r("p",[r("strong",[e._v("spring mvc， tomcat， servlet？")])]),e._v(" "),r("blockquote",[r("p",[e._v("Tomcat：The Apache Tomcat software is an open source implementation of the Java Servlet, JavaServer Pages, Java Expression Language and Java WebSocket technologies.\nSpringMVC：Spring推出的基于Servlet标准的MVC框架实现。\n可以看出SpringMVC和Tomcat的结合点是Servlet。其实SpringMVC的DispatchServlet实现了HttpServlet，那么SpringMVC在Tomcat看来，其实就是一个Servlet")])]),e._v(" "),r("blockquote",[r("p",[e._v("Tomcat下Servlet的配置文件：web.xml: web.xml的作用是配置Http和Servlet之间的映射关系、filter、context参数等。这样通过这份约定的配置文件，Tomcat可以把Http请求映射到不同的Servlet实例上。所以，在Servlet时代(structs时代)的web.xml中，会有很多的项配置。\nSpringMVC的改变: SpringMVC也是Servlet的实现，只不过SpringMVC增加了一个DispatchServlet，所有的http请求都是映射到这个Servlet上，请求进入到这个Servlet中之后，就算进入到了框架之中了，由这个Servlet来统一的分配http请求到各个Controller")])]),e._v(" "),r("blockquote",[r("p",[e._v("https://blog.csdn.net/achenyuan/article/details/77246395")]),e._v(" "),r("p",[e._v("Tomcat连接器（Connector）是处理请求的主要组件，它负责接收请求，创建Request和Response对象用于和前端进行数据的交换；然后分配线程让Servlet容器来处理这个请求，并把产生的Request和Response对象传给Servlet容器。当Engine处理完请求后，也会通过Connector将结果返回给请求端。即Connector进行请求的调度和控制。\n根据协议的不同，可以分为Http Connector和AJP Connector,\nTomcat处理连接请求的模式：\nBIO：阻塞模型\nNIO：非阻塞模型 ,好像servlet3.0之后的版本都是采用NIO模式，比如tomcat7应该用的是3.1版本\nAPR： 高性能，可扩展的模式，Tomcat8版本默认模式\nhttps://www.jianshu.com/p/c4fab2a30c3a")]),e._v(" "),r("p",[e._v("比如spring mvc程序开启，默认tomcat会开启10个线程，如果并发请求大于10个，则创建新线程名字大概是http-nio-（nio就是说当前tomcat的连接模式是非阻塞的），最多限制貌似是200")])]),e._v(" "),r("blockquote",[r("p",[e._v("servlet让客户端和服务器端不仅仅是进行简单的静态资源传输， 它可以实现动态的资源和一些复杂的业务逻辑。")]),e._v(" "),r("p",[e._v("我们使用的spring mvc和后面的springboot，都是基于dispatcherServlet来调用的")]),e._v(" "),r("p",[e._v("Tomcat，Nio和Servlet的一些笔记")]),e._v(" "),r("p",[e._v("https://blog.csdn.net/zzzgd_666/article/details/92078433")])]),e._v(" "),r("p",[r("strong",[e._v("servlet filter拦截器")])]),e._v(" "),r("p",[e._v("这里稍微扩展下，在关于shiro讲解的一文中也提到有个坑，就是自定义shiro拦截器如果交给spring IOC容器管理，会注册到servlet的filter中，脱离了shiro的控制，从而导致servlet直接过滤掉，不交给shiro处理，\nshiro对servlet的filter进行了扩展/继承，所以我们实现的shiro拦截器本身也是继承自servlet拦截器，web容器接收到http 请求，转交给servlet，servlet的拦截器生效，filter之后再internal dofilter转交给shiro；")]),e._v(" "),r("p",[r("strong",[e._v(".NET中对应的servlet概念是？")])]),e._v(" "),r("blockquote",[r("p",[e._v("Microsoft® ASP.NET does not provide a direct equivalent to the servlet class.")])]),e._v(" "),r("blockquote",[r("p",[e._v("Instead, there are two basic alternatives.")])]),e._v(" "),r("blockquote",[r("p",[e._v("The first alternative, which is used by the Java Language Conversion Assistant (JLCA), is to encapsulate the functionality of a servlet in the codebehind of a "),r("strong",[e._v("non-graphical ASP.NET page")]),e._v(".")])]),e._v(" "),r("blockquote",[r("p",[e._v("The other alternative is to create a new "),r("strong",[e._v("HttpHandler")]),e._v(" and direct a URL request to a specified class. The HTTPHandler is actually closer to the new Filter functionality in the servlet specification.")])]),e._v(" "),r("blockquote",[r("p",[e._v("https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/aa478987(v=msdn.10)?redirectedfrom=MSDN")])]),e._v(" "),r("p",[e._v("可以看到的是servlet并不只是一个web概念，它在non-graphical的环境一样工作，\n比如一个很常见的shiro登录组件也是基于servlet，当然了shiro增加了其他特性比如利用built-in enterprise session management从而还支持非servlet/web环境，\n而.NET对应于web环境引入了httphandler，非web环境用了其他的方式；")]),e._v(" "),r("p",[e._v("tomcat vs netty, 既然前面说了tomcat也支持nio，比如现在spring mvc很多默认的tomcat版本就是采用了nio，为什么说基于nio的netty'性能更高?")]),e._v(" "),r("blockquote",[r("p",[e._v("Netty和Tomcat最大的区别就在于通信协议，Tomcat是基于Http协议的，他的实质是一个基于http协议的web容器，但是Netty不一样，他能通过编程自定义各种协议，因为netty能够通过codec自己来编码/解码字节流，完成类似redis访问的功能，这就是netty和tomcat最大的不同。")]),e._v(" "),r("p",[e._v("有人说netty的性能就一定比tomcat性能高，其实不然，tomcat从6.x开始就支持了nio模式，并且后续还有arp模式——一种通过jni调用apache网络库的模式，相比于旧的bio模式，并发性能得到了很大提高，特别是arp模式，而netty是否比tomcat性能更高，则要取决于netty程序作者的技术实力了。")]),e._v(" "),r("p",[e._v("https://www.cnblogs.com/pangguoming/p/9353536.html")]),e._v(" "),r("p",[e._v("https://www.iteye.com/problems/92400")])]),e._v(" "),r("p",[e._v("由此，又产生另外一个问题：tomcat 源码为啥不采用netty 处理并发？")]),e._v(" "),r("p",[e._v("tomcat 内部的connector 是基于JDK NIO处理并发请求的，既然netty 性能稳定性远超JDK NIO,为什么不采用netty代替JDK NIO？")]),e._v(" "),r("blockquote",[r("p",[e._v("因为servlet规范，tomcat要实现servlet规范所以不能最大发挥NIO的特性，servlet3.0之前完全是同步阻塞模型，在read http body 以及 response的情况下，即使tomcat选择 NIO的 connector也是模拟阻塞的行为，因为servlet规范规定的就是这样。")]),e._v(" "),r("p",[e._v("netty不用遵循servlet规范，可以最大化发挥NIO的特性，性能更高一些。但对于多数业务来讲tomcat的connector已经足够了。")]),e._v(" "),r("p",[e._v("https://www.zhihu.com/question/53498767")])]),e._v(" "),r("p",[e._v("具体的NIO参考"),r("a",{attrs:{href:"/docs/software/java"}},[e._v("《java基础》")]),e._v("关于IO-BIO-NIO-多路复用部分讲解；")]),e._v(" "),r("h2",{attrs:{id:"基础"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#基础"}},[e._v("#")]),e._v(" 基础")]),e._v(" "),r("h3",{attrs:{id:"servlet生命周期"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#servlet生命周期"}},[e._v("#")]),e._v(" Servlet生命周期")]),e._v(" "),r("p",[e._v("1，初始化阶段:调用init()方法：")]),e._v(" "),r("p",[e._v("init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用，在后续每次用户请求时不再调用；")]),e._v(" "),r("p",[e._v("Servlet 创建于用户第一次调用对应于该 Servlet 的 URL 时，但是您也可以指定 Servlet 在服务器第一次启动时被加载。")]),e._v(" "),r("p",[e._v("当第一个用户调用某一个 Servlet 时，就会创建一个该Servlet 实例，init() 方法简单地创建或加载一些数据，这些数据将被用于 Servlet 的整个生命周期。")]),e._v(" "),r("p",[e._v("2，响应客户请求阶段:调用service()方法")]),e._v(" "),r("p",[e._v("每一个用户请求都会产生一个新的线程，每次服务器接收到一个 Servlet 请求时，服务器会产生一个新的线程并调用服务；\nservice() 方法检查 HTTP 请求类型（GET、POST、PUT、DELETE 等），并在适当的时候调用 doGet、doPost、doPut，doDelete 等方法。")]),e._v(" "),r("p",[e._v("3，终止阶段:调用destroy()方法")]),e._v(" "),r("h3",{attrs:{id:"servlet的单例多线程安全"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#servlet的单例多线程安全"}},[e._v("#")]),e._v(" Servlet的单例多线程安全")]),e._v(" "),r("blockquote",[r("p",[e._v("Java里有个API叫做ThreadLocal，spring单例模式下用它来切换不同线程之间的参数。用ThreadLocal是为了保证线程安全，实际上ThreadLoacal的key就是当前线程的Thread实例。单例模式下，spring把每个线程可能存在线程安全问题的参数值放进了ThreadLocal。这样虽然是一个实例在操作，但是不同线程下的数据互相之间都是隔离的，因为运行时创建和销毁的bean大大减少了，所以大多数场景下这种方式对内存资源的消耗较少，而且并发越高优势越明显。")])]),e._v(" "),r("p",[e._v("单例：Servlet只在用户第一次请求时被实例化，并且是单例的，在服务器重启或关闭时才会被销毁。")]),e._v(" "),r("p",[e._v("多线程：当请求到达时，Servlet容器(Tomcat...)通过线程池中可用的线程给请求者并执行Service方法，每个线程执行一个单一的 Servlet 实例的 service() 方法")]),e._v(" "),r("p",[e._v("有人说单例处理多线程会有性能问题，因为并发请求肯定要排队，其实未必，很多高并发的框架都是单例模式；")]),e._v(" "),r("p",[e._v("有人提出了实例池，但是我没有找到太多信息，仅供参考：")]),e._v(" "),r("p",[e._v("Servlet thread pool vs Servlet instance pool： https://stackoverflow.com/questions/7826452/servlet-thread-pool-vs-servlet-instance-pool-by-the-web-container\nServlet的单例模式的理解 https://www.breakyizhan.com/java/5016.html")]),e._v(" "),r("h2",{attrs:{id:"应用"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#应用"}},[e._v("#")]),e._v(" 应用")]),e._v(" "),r("p",[r("strong",[e._v("spring boot supports")])]),e._v(" "),r("blockquote",[r("p",[e._v("Spring Boot supports the following embedded servlet containers:")])]),e._v(" "),r("blockquote",[r("p",[e._v("You can also deploy Spring Boot applications to any Servlet 3.1+ compatible container.")])]),e._v(" "),r("blockquote",[r("p",[e._v("https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-system-requirements-servlet-containers")])]),e._v(" "),r("table",[r("thead",[r("tr",[r("th",[e._v("Name")]),e._v(" "),r("th",[e._v("Servlet Version")])])]),e._v(" "),r("tbody",[r("tr",[r("td",[e._v("Tomcat 9.0")]),e._v(" "),r("td",[e._v("4.0")])]),e._v(" "),r("tr",[r("td",[e._v("Jetty 9.4")]),e._v(" "),r("td",[e._v("3.1")])]),e._v(" "),r("tr",[r("td",[e._v("Undertow 2.0")]),e._v(" "),r("td",[e._v("4.0")])])])]),e._v(" "),r("p",[e._v("spring boot Framework支持的三种环境：\n"),r("img",{attrs:{src:"/docs/docs_image/software/buildingblock/servlet02.png",alt:""}})]),e._v(" "),r("hr"),e._v(" "),r("h2",{attrs:{id:"源码解读"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#源码解读"}},[e._v("#")]),e._v(" 源码解读")]),e._v(" "),r("p",[e._v("springmvc request参数解析@RequestBody和Controller方法调用")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v('///\norg.apache.catalina.core;\npublic final class ApplicationFilterChain implements FilterChain {\ndoFilter=>\ninternalDoFilter=>\nservlet.service(request, response);\n\n\norg.springframework.web.servlet\npublic class DispatcherServlet extends FrameworkServlet {\nservice\ndoPost=>\nprocessRequest=>\ndoService=>\ndoDispatch=>\nmv = ha.handle(processedRequest, response, mappedHandler.getHandler());\n\n## processedRequest\n\n\norg.springframework.web.servlet.mvc.method.annotation\npublic class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter\n\t\timplements BeanFactoryAware, InitializingBean {\nhandleInternal\n=>mav = invokeHandlerMethod(request, response, handlerMethod);\n\norg.springframework.web.servlet.mvc.method.annotation\npublic class ServletInvocableHandlerMethod extends InvocableHandlerMethod {\ninvokeAndHandle=>\nObject returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);\n\n\norg.springframework.web.method.support\npublic class InvocableHandlerMethod extends HandlerMethod {\n\npublic Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,\n\t\t\tObject... providedArgs) throws Exception {\n\n\t\tObject[] args = getMethodArgumentValues(request, mavContainer, providedArgs);\n\t\tif (logger.isTraceEnabled()) {\n\t\t\tlogger.trace("Invoking \'" + ClassUtils.getQualifiedMethodName(getMethod(), getBeanType()) +\n\t\t\t\t\t"\' with arguments " + Arrays.toString(args));\n\t\t}\n\t\tObject returnValue = doInvoke(args);\n\t\tif (logger.isTraceEnabled()) {\n\t\t\tlogger.trace("Method [" + ClassUtils.getQualifiedMethodName(getMethod(), getBeanType()) +\n\t\t\t\t\t"] returned [" + returnValue + "]");\n\t\t}\n\t\treturn returnValue;\n\t}\n\n## getMethodArgumentValues 解析参数\n\norg.springframework.web.servlet.mvc.method.annotation\npublic class RequestResponseBodyMethodProcessor extends AbstractMessageConverterMethodProcessor {\n\nresolveArgument\n\n## doInvoke 调用Controller方法\n\n')])])]),r("hr"),e._v(" "),r("p",[e._v("ref")]),e._v(" "),r("p",[e._v("https://www.w3cschool.cn/servlet/servlet-life-cycle.html")]),e._v(" "),r("p",[e._v("https://blog.csdn.net/u010763324/article/details/80747559\nServlet的多线程和线程安全\nhttps://www.cnblogs.com/binyue/p/4513577.html")])])}),[],!1,null,null,null);t.default=s.exports}}]);