(window.webpackJsonp=window.webpackJsonp||[]).push([[290],{718:function(e,t,n){"use strict";n.r(t);var a=n(65),r=Object(a.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("p",[e._v("AOP是aspect oriented programing的简称，意为面向切面编程，对OOP的补充。")]),e._v(" "),n("p",[e._v("AOP is used along with spring Ioc to provide a very capable middleware solution.")]),e._v(" "),n("p",[e._v("Note: Cross cutting concerns are one of the concerns in any application such as logging, security, caching, etc. They are present in one part of the program but they may affect other parts of the program too.")]),e._v(" "),n("h2",{attrs:{id:"概念对比"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#概念对比"}},[e._v("#")]),e._v(" 概念对比")]),e._v(" "),n("p",[e._v("通知（Advice）包含了需要用于多个应用对象的横切行为，完全听不懂，没关系，通俗一点说就是定义了“什么时候”和“做什么”。It’s the behavior that addresses system-wide concerns (logging, security checks, etc…). This behavior is represented by a method to be executed at a JoinPoint. This behavior can be executed Before, After, or Around the JoinPoint according to the Advice type as we will see later.")]),e._v(" "),n("p",[e._v("interceptor == Advice")]),e._v(" "),n("p",[e._v("连接点（Join Point）是程序执行过程中能够应用通知的所有点。a JoinPoint is a point in the execution flow of a method where an Aspect (new behavior) can be plugged in.")]),e._v(" "),n("p",[e._v("切点（Poincut）是定义了在“什么地方”进行切入，哪些连接点会得到通知。显然，切点一定是连接点。A Pointcut is an expression that defines at what JoinPoints a given Advice should be applied.")]),e._v(" "),n("p",[e._v("切面（Aspect）是通知和切点的结合。通知和切点共同定义了切面的全部内容——是什么，何时，何地完成功能。Aspect is a class in which we define Pointcuts and Advices.")]),e._v(" "),n("p",[e._v("引入（Introduction）允许我们向现有的类中添加新方法或者属性。")]),e._v(" "),n("p",[e._v("织入（Weaving）是把切面应用到目标对象并创建新的代理对象的过程，分为编译期织入、类加载期织入和运行期织入。")]),e._v(" "),n("h3",{attrs:{id:"java-aop-aspectj-vs-spring-aop"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#java-aop-aspectj-vs-spring-aop"}},[e._v("#")]),e._v(" java aop(aspectj) VS spring aop")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://www.baeldung.com/spring-aop-vs-aspectj",target:"_blank",rel:"noopener noreferrer"}},[e._v("Comparing Spring AOP and AspectJ"),n("OutboundLink")],1),e._v(" "),n("a",{attrs:{href:"https://www.credera.com/insights/aspect-oriented-programming-in-spring-boot-part-2-spring-jdk-proxies-vs-cglib-vs-aspectj",target:"_blank",rel:"noopener noreferrer"}},[e._v("Spring JDK Proxies vs CGLIB vs AspectJ"),n("OutboundLink")],1)]),e._v(" "),n("h3",{attrs:{id:"spring-web-mvc-http拦截"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#spring-web-mvc-http拦截"}},[e._v("#")]),e._v(" spring web mvc http拦截")]),e._v(" "),n("p",[e._v("MVC Interceptor is a MVC only concept. They are more or less like Servlet Filters. They can intercept requests to the controller only. AOP can be used to intercept calls to any public method in any Spring loaded bean.")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://www.jianshu.com/p/64355d8cb1ee",target:"_blank",rel:"noopener noreferrer"}},[e._v("rpc系列5-添加拦截器链，实现rpc层面的AOP"),n("OutboundLink")],1),e._v("\n在spring web mvc中实现拦截功能时，有三种方式")]),e._v(" "),n("ol",[n("li",[n("p",[e._v("使用功能servlet filter")])]),e._v(" "),n("li",[n("p",[e._v("使用springmvc 提供的 HandlerInterceptor")])]),e._v(" "),n("li",[n("p",[e._v("使用spring core 提供的 MethodInterceptor（spring aop）")])])]),e._v(" "),n("h4",{attrs:{id:"servlet的过滤器filter"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#servlet的过滤器filter"}},[e._v("#")]),e._v(" servlet的过滤器Filter")]),e._v(" "),n("p",[e._v("我们自己写的Filter类，Filter是Servlet规范的一部分，是Servlet容器（如Tomcat）实现的。")]),e._v(" "),n("p",[e._v("在spring boot下注册一个filter的三种方式（servlet、listener也是如此）")]),e._v(" "),n("p",[e._v("方式1：可以使用@WebFilter+@ServletComponentScan的方式")]),e._v(" "),n("p",[e._v("方式2：可以使用FilterRegistrationBean 进行API级别的注册，注意，在这种情况下可以对Filter order进行设置，而使用spring @Order注解是无效的")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('@Bean\npublic ServletRegistrationBean asyncServletServletRegistrationBean(){\n    ServletRegistrationBean registrationBean =  new ServletRegistrationBean(new AsyncServlet(),"/");\n    registrationBean.setName("MyAsyncServlet");\n    registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);\n    return registrationBean;\n}\n')])])]),n("p",[e._v("方式3：创建一个类去实现 ServletContextInitializer 接口，并把它注册为一个 Bean，Spring Boot 会负责调用这个接口的 onStartup 方法。")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('@Bean\npublic ServletContextInitializer servletContextInitializer() {\n    return servletContext -> {\n        CharacterEncodingFilter filter = new CharacterEncodingFilter();\n        FilterRegistration.Dynamic registration = servletContext.addFilter("filter", filter);\n        registration.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), false, "/");\n    };\n}\n')])])]),n("p",[e._v("FilterRegistrationBean其实也是通过 ServletContextInitializer 来实现的，它实现了 ServletContextInitializer 接口")]),e._v(" "),n("p",[e._v("特点：\n可以拿到原始的http请求和响应的信息，但是拿不到真正处理这个请求的方法的信息")]),e._v(" "),n("p",[e._v("存在的问题：\n通过Filter只能拿到http的请求和响应，只能从请求和响应中获得一些参数。当前发过来的这个请求实际上真正是由哪个控制器的哪个方法来处理的，在Filter里面是不知道的，因为javax.servlet.Filter是J2EE规范中定义的，J2EE规范里面实际上并不知道与spring相关的任何内容。而我们的controller实际上是spring mvc定义的一套机制。如果你需要这些信息，那么就需要使用拦截器Interceptor")]),e._v(" "),n("h4",{attrs:{id:"springmvc的拦截器interceptor"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#springmvc的拦截器interceptor"}},[e._v("#")]),e._v(" springmvc的拦截器Interceptor")]),e._v(" "),n("p",[e._v("在我们真正访问的Controller的某个方法被调用之前，会调用preHandler方法，在Controller的方法调用之后，会调用postHandler方法，如果你的controller中的方法抛出了异常，那么postHandler这个方法不会被调用。但无论controller中的方法是否抛出异常，afterCompletion方法都是会被调用的。")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("public class TimeInterceptor implements HandlerInterceptor {}\n\n@Override\npublic boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){}\n\n最后一个参数，Object handler，这个是我真正用来处理这个请求的Controller的方法声明\n\npublic void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {}\n")])])]),n("h2",{attrs:{id:"aspectj"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#aspectj"}},[e._v("#")]),e._v(" AspectJ")]),e._v(" "),n("p",[e._v("跟 spring aop的区别是：\n1.apsectj支持自我调用的时候也能触发AOP 代码\n2. spring aop是run time weaving，而aspectj:\nBuild-time weaving weaves classes and aspects together during the build process before deploying the application.\nLoad-time weaving (LTW) weaves just in time as the classes are loaded by the VM, obviating any pre-deployment weaving.")]),e._v(" "),n("h3",{attrs:{id:"原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[e._v("#")]),e._v(" 原理")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://dzone.com/articles/different-types-of-aspectj-weaving",target:"_blank",rel:"noopener noreferrer"}},[e._v("Different Types of AspectJ Weaving"),n("OutboundLink")],1)]),e._v(" "),n("h4",{attrs:{id:"compile-time-weaving"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#compile-time-weaving"}},[e._v("#")]),e._v(" Compile-time Weaving")]),e._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/software/programming/ctw.png",alt:""}}),e._v("\nThe weaving process in compile-time weaving happens (obviously) at compile time. As you can see from the diagram above, the left-hand side describes our source codes which are java files, java classes with @Aspect annotation, and the last one are traditional aspect classes. They are then compiled by ajc (AspectJ Compiler) to be woven into a compiled class called woven system. To give more perspective on this, take a look at several code snippets below.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('Target class to be woven:\n@Component\npublic class Target {\n  public void greet(String name) {\n    System.out.println("[Actual] Hi " + name + " from target!");\n  }\n}\n\nBefore Advice:\n@Aspect\n@Component\npublic class GdnBeforeAspect {\n  @Before("execution(* greet(..))")\n  public void beforeGreet(final JoinPoint joinPoint) {\n    doBefore(joinPoint);\n  }\n  private void doBefore(final JoinPoint joinPoint) {\n    System.out.println("[ASPECTJ BEFORE]");\n    System.out.println("Target class\' name: " + joinPoint.getTarget().getClass());\n    System.out.println("Target method\'s name: " + joinPoint.getSignature().getName());\n    System.out.println("Target method\'s arguments: " + Arrays.toString(joinPoint.getArgs()));\n    System.out.println("[ASPECTJ BEFORE]");\n  }\n}\nThose 2 code snippets are just regular steps to do if we want to do AOP. The 2 snippets above mean that we want to advise the greet() method (which resides inside Target class) with before advice. Nothing fancy happens in the aspect, it’ll just print some information about the method invocation.\n\nNow, this is where something is getting interesting. Let’s define a plugin inside our pom.xml.\nAspectJ Maven Plugin:\n<plugin>\n                <groupId>org.codehaus.mojo</groupId>\n                <artifactId>aspectj-maven-plugin</artifactId>\n                <version>1.11</version>\n                <configuration>\n                    <complianceLevel>1.8</complianceLevel>\n                    <source>1.8</source>\n                    <target>1.8</target>\n                    <showWeaveInfo>true</showWeaveInfo>\n                    <verbose>true</verbose>\n                    <Xlint>ignore</Xlint>\n                    <encoding>UTF-8 </encoding>\n                </configuration>\n                <executions>\n                    <execution>\n                        <goals>\n                            \x3c!-- use this goal to weave all your main classes --\x3e\n                            <goal>compile</goal>\n                        </goals>\n                    </execution>\n                </executions>\n            </plugin>\nThe AspectJ Maven plugin stated above will weave the aspects when we execute mvn clean compile. Now, let’s try to do just that and see what happens.\nIf you see inside the target directory (which consists of every compiled class) and open Target.class, you’ll see this.\n\nTarget class woven using CTW (Compile-time Weaving):\n@Component\npublic class Target {\n  public Target() {\n  }\n  public void greet(String name) {\n    JoinPoint var2 = Factory.makeJP(ajc$tjp_0, this, this, name);\n    GdnBeforeAspect.aspectOf().beforeGreet(var2);\n    System.out.println("[Actual] Hi " + name + " from target!");\n  }\n  static {\n    ajc$preClinit();\n  }\n}\nYou see that on lines 7–8, the compiler inserts additional functionality which calls the aspect we defined before. This way, the before advice will be executed before the actual process done by the target. Now you know how CTW works internally.\n\n')])])]),n("h4",{attrs:{id:"post-compile-binary-weaving"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#post-compile-binary-weaving"}},[e._v("#")]),e._v(" Post-compile (binary) weaving")]),e._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/software/programming/pctw.png",alt:""}})]),e._v(" "),n("p",[e._v("Basically, binary weaving is similar to CTW (Compile-time Weaving), the weaving process is also done on compile-time. The difference is that with Binary Weaving, we’re able to weave aspects into 3rd party library’s source code. Let’s take a look at the code snippets below.")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('Add the new library as dependency to our main project’s pom.xml:\n<dependency>\n            <groupId>com.axell</groupId>\n            <artifactId>aspectj-aop-lib</artifactId>\n            <version>0.0.1-SNAPSHOT</version>\n        </dependency>\nAdvising greetFromLib() method which exists inside our 3rd party library added previously:\n\n@Aspect\n@Component\npublic class GdnBeforeAspect {\n  @Before("execution(* greetFromLib(..))")\n  public void beforeGreetLib(final JoinPoint joinPoint) {\n    doBefore(joinPoint);\n  }\n\n  private void doBefore(final JoinPoint joinPoint) {\n    System.out.println("[ASPECTJ BEFORE]");\n    System.out.println("Target class\' name: " + joinPoint.getTarget().getClass());\n    System.out.println("Target method\'s name: " + joinPoint.getSignature().getName());\n    System.out.println("Target method\'s arguments: " + Arrays.toString(joinPoint.getArgs()));\n    System.out.println("[ASPECTJ BEFORE]");\n  }\n}\nAt this point, we know that greetFromLib() exists inside our 3rd party library, which means in form of .jar file instead of our own written source codes. We need to do several modifications to our AspectJ Maven plugin to accommodate this.\n\nAdding our third-party lib into weave dependency to be woven:\n<plugin>\n...\n                <configuration>\n                    ...\n                    <weaveDependencies>\n                        <weaveDependency>\n                            <groupId>com.axell</groupId>\n                            <artifactId>aspectj-aop-lib</artifactId>\n                        </weaveDependency>\n                    </weaveDependencies>\n                </configuration>\n...\n</plugin>\nNow that we’ve added necessary information to our AspectJ maven plugin, we simply just have to execute mvn clean compile again, and let’s see what changes inside our target directory.\n\nTargetLib class woven using Binary Weaving:\npublic class TargetLib {\n  public TargetLib() {\n  }\n  public void greetFromLib(final String name) {\n    JoinPoint var2 = Factory.makeJP(ajc$tjp_0, this, this, name);\n    GdnBeforeAspect.aspectOf().beforeGreetLib(var2);\n    System.out.println("[ACTUAL] Hi " + name + " from target lib!");\n  }\n  static {\n    ajc$preClinit();\n  }\n}\nSimilar to what we’ve observed from CTW, the TargetLib class (in which the source code exists on 3rd party library, we don’t host the source code in our main project) got woven by Binary Weaving by using a similar mechanism.\n')])])]),n("h4",{attrs:{id:"load-time-weaving"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#load-time-weaving"}},[e._v("#")]),e._v(" Load-time weaving")]),e._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/software/programming/ltw.png",alt:""}})]),e._v(" "),n("p",[e._v("Load-time weaving happens when the classes are about to be loaded into JVM. This means that after compilation, nothing will be added into our compiled classes (unlike CTW and Binary Weaving).")]),e._v(" "),n("ul",[n("li",[e._v("Deploy an application.")]),e._v(" "),n("li",[e._v("VM initializes the weaving agent.")]),e._v(" "),n("li",[e._v("The weaving agent loads all aop.xml files (Yes, we can define multiple aop.xml files and everything gets loaded).")]),e._v(" "),n("li",[e._v("Weaving agent loads listed aspects in aop.xml files.")]),e._v(" "),n("li",[e._v("The system starts normal execution.")]),e._v(" "),n("li",[e._v("VM loads classes during execution (as usual).")]),e._v(" "),n("li",[e._v("The VM notifies the weaving agent whenever it loads a class.")]),e._v(" "),n("li",[e._v("The weaving agent (after being notified), inspects the to-be-loaded class to determine if any of the aspects need to be woven to the to-be-loaded class.")]),e._v(" "),n("li",[e._v("If so, the weaving agent will weave the class and the aspect.")]),e._v(" "),n("li",[e._v("The woven byte code will be loaded to VM and used.")])]),e._v(" "),n("h3",{attrs:{id:"用法"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#用法"}},[e._v("#")]),e._v(" 用法")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://www.baeldung.com/aspectj",target:"_blank",rel:"noopener noreferrer"}},[e._v("Intro to AspectJ"),n("OutboundLink")],1)]),e._v(" "),n("p",[e._v("handle self-invocation within one class:\nhttps://stackoverflow.com/questions/49159666/how-to-intercept-each-method-call-within-given-method-using-spring-aop-or-aspect")]),e._v(" "),n("p",[e._v("https://blog.csdn.net/gavin_john/article/details/80252414")]),e._v(" "),n("h2",{attrs:{id:"spring-boot-aop"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#spring-boot-aop"}},[e._v("#")]),e._v(" Spring(Boot) AOP")]),e._v(" "),n("h3",{attrs:{id:"原理-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原理-2"}},[e._v("#")]),e._v(" 原理")]),e._v(" "),n("p",[e._v("Spring AOP uses either JDK dynamic proxies or CGLIB to create the proxy for a given target object. JDK dynamic proxies are built into the JDK, whereas CGLIB is a common open-source class definition library (repackaged into spring-core).")]),e._v(" "),n("p",[e._v("If the target object to be proxied implements at least one interface, a JDK dynamic proxy is used. All of the interfaces implemented by the target type are proxied. If the target object does not implement any interfaces, a CGLIB proxy is created.")]),e._v(" "),n("p",[e._v("利用"),n("RouterLink",{attrs:{to:"/software/highlevel/designpattern.html#proxy"}},[e._v("动态代理")]),e._v("也能实现AOP(spring aop vs aspectj)：动态代理提供了一种方式，能够将分散的方法调用转发到一个统一的处理函数处理。AOP的实现需要能够提供这样一种机制，即在执行函数前和执行函数后都能执行自己定义的钩子。那么，首先使用动态代理让代理类忠实的代理被代理类，然后处理函数中插入我们的自定义的钩子。之后让代理类替换被代理类需要使用的场景，这样，相当于对该类的所有方法定义了一个切面。")],1),e._v(" "),n("p",[e._v("spring aop使用了动态代理技术在运行期织入增强的代码，使用了两种代理机制：\n一种是基于jdk的动态代理，另一种是基于CGLib的动态代理。\n详细请看深入理解代理模式设计模式：代理模式")]),e._v(" "),n("p",[e._v("在spring中，Advice的实现接口就是Interceptor")]),e._v(" "),n("p",[e._v("注意，Advice和Interceptor都是在org.aopalliance包下，并非在spring包下，为spring引入的外部依赖")]),e._v(" "),n("p",[e._v("Interceptor接口在spring中的实现类MethodInterceptor，通过before, after, afterReturing, afterThrowing等增强器来对目标方法进行增强")]),e._v(" "),n("p",[e._v("spring aop源码解析参考："),n("a",{attrs:{href:"https://blog.csdn.net/u013905744/article/details/91852692",target:"_blank",rel:"noopener noreferrer"}},[e._v("spring aop源码解析1: 创建、初始化并注册AnnotationAwareAspectJAutoProxyCreator"),n("OutboundLink")],1)]),e._v(" "),n("p",[e._v("AOP API: MethodInterceptor")]),e._v(" "),n("p",[e._v("managed components & proxy(jdk proxy&cglib)")]),e._v(" "),n("blockquote",[n("p",[e._v("Whenever you declare a bean in XML or use @Component, @Service, or @Repository on a class targeted by Spring’s annotation component scanning (which is enabled by default for Spring Boot), that class is instantiated and managed as a singleton bean by the Spring framework.\nHowever, Spring doesn’t actually provide a literal reference to the original bean when it’s injected—it wraps the bean in a proxy class to give Spring a chance to weave in AOP code if needed.\nhttps://docs.spring.io/spring/docs/2.5.x/reference/aop.html")])]),e._v(" "),n("p",[e._v("https://www.credera.com/blog/technology-insights/open-source-technology-insights/aspect-oriented-programming-in-spring-boot-part-2-spring-jdk-proxies-vs-cglib-vs-aspectj/")]),e._v(" "),n("h3",{attrs:{id:"用法-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#用法-2"}},[e._v("#")]),e._v(" 用法")]),e._v(" "),n("h4",{attrs:{id:"spring-aop"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#spring-aop"}},[e._v("#")]),e._v(" Spring AOP")]),e._v(" "),n("p",[e._v("https://www.baeldung.com/spring-aop")]),e._v(" "),n("h4",{attrs:{id:"springboot-aop-starter"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#springboot-aop-starter"}},[e._v("#")]),e._v(" Springboot AOP starter")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-aop</artifactId>\n</dependency>\n")])])]),n("p",[e._v("AOP in Spring, if you have an interface, use the JDK dynamic proxy, no interface, use Cglib dynamic proxy.\nSpring Boot AOP, before 2.0 and Spring the same; 2.0 after the preferred Cglib dynamic proxy, if users want to use JDK dynamic proxy, you need to manually configure their own.")]),e._v(" "),n("ul",[n("li",[e._v("https://www.springcloud.io/post/2022-01/springboot-aop/#gsc.tab=0")])]),e._v(" "),n("p",[n("a",{attrs:{href:"https://www.cnblogs.com/sgh1023/p/13363679.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Spring Boot使用AOP的正确姿势"),n("OutboundLink")],1)]),e._v(" "),n("h2",{attrs:{id:"example"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[e._v("#")]),e._v(" example:")]),e._v(" "),n("h3",{attrs:{id:"log-使用aop做日志切面"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#log-使用aop做日志切面"}},[e._v("#")]),e._v(" log 使用AOP做日志切面")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-aop</artifactId>\n</dependency>\n\n@Aspect\t// 添加Aspect注解\n@Component\t// 注册为SpringBean\npublic class LogAspect {\n    \n    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);\n    \n    // 定义该切面的切入点为allCtlMethod(), 需要被切入的方法为: ctl这个包下的所有带@RequestMapping, @PostMapping, @GetMapping的方法\n    @Pointcut("execution(* com.welldone.calcprogram.ctl..*.*(..)) "\n            + "&& "\n            + "(@annotation(org.springframework.web.bind.annotation.RequestMapping)"\n            + "|| @annotation(org.springframework.web.bind.annotation.PostMapping)"\n            + "|| @annotation(org.springframework.web.bind.annotation.GetMapping)"\n            + ")"\n    )\n    public void allCtlMethod() {}\n\t\n    \n    /** allCtlMethod()指定的目标方法执行前执行before方法\n     * @param call 切入点，即目标方法\n     */\n    @Before("allCtlMethod()")\n    public void before(JoinPoint call) {\n        if (log.isInfoEnabled()) {\n            String clazzName = call.getTarget().getClass().getName();\n            String methodName = call.getSignature().getName();\n            Object[] args = call.getArgs();\n            StringBuffer sb = new StringBuffer()\n                    .append("[start]").append(clazzName).append(".").append(methodName).append(", args: ");\n            for (Object arg : args) {\n                sb.append(arg);\n            }\n            log.info(sb.toString());\n        }\n    }\n    \n\t/** allCtlMethod()指定的目标方法返回后执行afterReturning方法\n\t\treturning的值要和Object的参数名obj一致\n     * @param call 切入点，即目标方法\n     * @param obj 目标方法返回值\n     */\n    @AfterReturning(pointcut = "allCtlMethod()", returning = "obj")\n    public void afterReturning(JoinPoint call, Object obj) {\n        if (log.isInfoEnabled()) {\n            String clazzName = call.getTarget().getClass().getName();\n            String methodName = call.getSignature().getName();\n            String output = obj != null ? obj.toString() : "";\n            log.info("[end]" + clazzName + "." + methodName + ", returnValue: " + output);\n        }\n    }\n}\n\n\n')])])]),n("p",[e._v("https://stackoverflow.com/questions/38494974/use-spring-aop-and-get-respective-class-name-in-log-file")]),e._v(" "),n("h3",{attrs:{id:"mybatis-plugin插件开发"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#mybatis-plugin插件开发"}},[e._v("#")]),e._v(" MyBatis Plugin插件开发")]),e._v(" "),n("p",[e._v("Spring / MyBatis——插件机制（AOP）\nhttps://blog.csdn.net/qq_22078107/article/details/85781594\nhttps://blog.csdn.net/u012525096/article/details/82389240")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://www.cnblogs.com/study-everyday/p/7429298.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("记一次Spring的aop代理Mybatis的DAO所遇到的问题"),n("OutboundLink")],1)]),e._v(" "),n("hr"),e._v(" "),n("p",[e._v("refer:\n"),n("a",{attrs:{href:"https://blog.csdn.net/u013905744/article/details/91363203",target:"_blank",rel:"noopener noreferrer"}},[e._v("spring aop(MethodInterceptor), springmvc (HandlerInterceptor), servlet Filter有什么区别？"),n("OutboundLink")],1)]),e._v(" "),n("p",[e._v("使用spring的MethodInterceptor实现aop功能的三种方式 https://blog.csdn.net/u013905744/article/details/91364736")]),e._v(" "),n("p",[e._v("Why in Spring AOP the object are wrapped into a JDK proxy that implements interfaces? https://stackoverflow.com/questions/29650355/why-in-spring-aop-the-object-are-wrapped-into-a-jdk-proxy-that-implements-interf")])])}),[],!1,null,null,null);t.default=r.exports}}]);