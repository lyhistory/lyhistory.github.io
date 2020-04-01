---
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《spring分布式微服务入门》

我们今天来梳理归纳一下java的开发框架，首先为什么需要框架？

1. 节约成本

不可能所有东西都从零造起，成本太高，spring融合了市场上大部分的开源项目，可以直接‘免费’利用

2. 安全考虑

当前网络环境复杂，攻击无处不在，成熟的框架已经被主流公司接受使用，很多坑已经被前人踩过，站在巨人的肩膀上是明智之选，不用交额外的智商税

3. 业务发展

spring boot不只是框架，还是spring cloud的一部分，spring cloud是微服务架构的一套完整是有序框架集合，
spring是建筑材料，spring boot是脚手架，spring cloud就是行业规范，采用行业规范的开发模式有利于IT更好的服务business和业务拓展

## 1. Overview
### 1.1 SOA?微服务?
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

### 1.2 SpringBoot SpringCloud
Rod Johnson创建的开源框架interface21是 Spring的前身，随着spring从小框架发展为大而全的企业级框架，spring对市面上主流的开源软件都有了对应的组件支持，
人们发现使用spring项目开发变得难用，往往需要引入很多配置，难以维护容易出错，spring因此冠名配置地狱；

Spring boot是基于spring抽象出来的开发框架，是快速开发的scaffold脚手架，spring boot丧心病狂的运用依赖注入DI的思想，配置文件可以auto config，用户只需要定义好需要的bean，
spring boot的大容器会进行管理，丰富的starter让开发者可以集中精力在业务逻辑上而不是依赖的配置管理；

依赖注入的思想简单来说就比如小孩要从冰箱拿吃的，但是不应该自己拿，应该交由家长来处理，因为小孩可能会忘记关冰箱门，可能会打乱冰箱里面其他东西，总之小孩这个组件应该只关心自己的事情，不要做这些大人才能做好的事情，
所以从冰箱拿东西吃要交由家长处理，在spring boot中，小孩可以采用构造函数注入或者setter based如autowired方式来使用家长组件；

spring-cloud是一套完整的微服务解决方案，是一系列框架的有序集合，提供了分布式的各种解决方案：
服务开发（springBoot spring springMVC）、服务配置中心（SpringCloudConfig Chef）、服务发现（eureka zookeeper）、服务调用（rest rpc）、负载均衡（ribbon nginx）、服务熔断器、服务监控、服务部署（docker kubernetes）、消息队列（kafka rabbitmq）

所以可见一个个具体的微服务(这里说的微服务就是具体的一个个应用了)是用spring boot开发，spring cloud又提供了服务配置中心、服务注册发现等所谓微服务治理的解决方案

1.spring boot是一个快速开发框架，应该说是spring系列的集大成者。我们可以简单的把spring boot理解成是一个快速开发的脚手架。
2.微服务往往是指Spring Cloud，微服务是一个框架。
3.如果把基于微服务架构的软件比作是一个大厦，钢筋混凝土结构就是spring cloud，而砖头瓦块等就是spring boot。微服务的一个一个服务是用spring boot开发的，spring cloud提供服务注册与发现、负载均衡、API网管、熔断路由、配置中心等框架性服务，当然一个完整的微服务系统有很多其他的内容，例如服务拆分、监控、限流降级等等。

dubbo常常拿来跟spring cloud对比，实际目前已经不具有可比性了，Dubbo现在只是一款高性能的Java RPC框架，只能跟spring cloud集合中的服务调用部分REST RPC做对比

spring cloud alibaba是spring cloud的其中一个微服务解决方案

## 2. Spring Framework

https://docs.spring.io/spring/docs/current/spring-framework-reference/
Project generator
https://start.spring.io/
https://www.tutorialspoint.com/spring/spring_quick_guide.htm
https://docs.spring.io/spring/docs/5.1.6.RELEASE/spring-framework-reference/ (spring boot 2.1.4 depend on spring 5.1.6)

** architecture
![](/docs/docs_image/software/java/java_spring01.png)

** Beans
https://www.tutorialspoint.com/spring/spring_bean_definition.htm

Components(@Component @Service @Controller @Repository) vs beans (@Beans)
all component types are treated in the same way. The subtypes are mere markers, think code readability rather than features.
https://www.tomaszezula.com/2014/02/09/spring-series-part-5-component-vs-bean/

** Scan&Autowire
```
package org.springframework.beans.factory.annotation;
/**
	 * Class representing injection information about an annotated field.
	 */
	private class AutowiredFieldElement extends InjectionMetadata.InjectedElement {

		private final boolean required;

		private volatile boolean cached = false;

		@Nullable
		private volatile Object cachedFieldValue;

		public AutowiredFieldElement(Field field, boolean required) {
			super(field, null);
			this.required = required;
		}

		@Override
		protected void inject(Object bean, @Nullable String beanName, @Nullable PropertyValues pvs) throws Throwable {
			Field field = (Field) this.member;
			Object value;
			if (this.cached) {
				value = resolvedCachedArgument(beanName, this.cachedFieldValue);
			}
			else {
				DependencyDescriptor desc = new DependencyDescriptor(field, this.required);
				desc.setContainingClass(bean.getClass());
				Set<String> autowiredBeanNames = new LinkedHashSet<>(1);
				Assert.state(beanFactory != null, "No BeanFactory available");
				TypeConverter typeConverter = beanFactory.getTypeConverter();
				try {
					value = beanFactory.resolveDependency(desc, beanName, autowiredBeanNames, typeConverter);
				}
				catch (BeansException ex) {
					throw new UnsatisfiedDependencyException(null, beanName, new InjectionPoint(field), ex);
				}
				synchronized (this) {
					if (!this.cached) {
						if (value != null || this.required) {
							this.cachedFieldValue = desc;
							registerDependentBeans(beanName, autowiredBeanNames);
							if (autowiredBeanNames.size() == 1) {
								String autowiredBeanName = autowiredBeanNames.iterator().next();
								if (beanFactory.containsBean(autowiredBeanName) &&
										beanFactory.isTypeMatch(autowiredBeanName, field.getType())) {
									this.cachedFieldValue = new ShortcutDependencyDescriptor(
											desc, autowiredBeanName, field.getType());
								}
							}
						}
						else {
							this.cachedFieldValue = null;
						}
						this.cached = true;
					}
				}
			}
			if (value != null) {
				ReflectionUtils.makeAccessible(field);
				field.set(bean, value);
			}
		}
	}
```

Autowire vs getbean
Injecting a Prototype Bean into a Singleton Bean Problem https://www.logicbig.com/tutorials/spring-framework/spring-core/injecting-singleton-with-prototype-bean.html

> You can then use getBean to retrieve instances of your beans. The ApplicationContext interface has a few other methods for retrieving beans, but, ideally, your application code should never use them. Indeed, your application code should have no calls to the getBean() method at all and thus have no dependency on Spring APIs at all.
> https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html

** Spring AOP
https://docs.spring.io/spring/docs/2.5.x/reference/aop.html


** 代理
动态代理 静态代理
cglib 通过使用proxy设计模式 远程调用看起来像本地调用
增强类 如mybatis，fastclassbyspringcglib
```
保存生成的动态代理类或者增强类
@EnableAsync
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
    	System.setProperty(DebuggingClassWriter.DEBUG_LOCATION_PROPERTY,"C:\\Workspace\\debug");
        SpringApplication.run(Application.class, args);
    }
```
MyBatis is a fork from iBATIS,

---

## 3.SpringBoot Framework

> While the Spring framework focuses on providing flexibility to you, Spring Boot aims to shorten the code length and provide you with the easiest way to develop a web application. With annotation configuration and default codes, Spring Boot shortens the time involved in developing an application.
> https://www.tutorialspoint.com/spring_boot/index.htm

<span style="color:red">https://spring.io/tools3/sts/all</span>

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

Spring boot web default web server:
Asp.net default is IIS Express, how about spring boot web?
Tomcat vs. Jetty vs. Undertow: Comparison of Spring Boot Embedded Servlet Containers 
https://examples.javacodegeeks.com/enterprise-java/spring/tomcat-vs-jetty-vs-undertow-comparison-of-spring-boot-embedded-servlet-containers/

### 3.1 Plugins

** spring-boot-maven-plugin
```
<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<version>${spring-boot-maven-plugin.version}</version>
				<executions>
					<execution>
						<goals>
							<goal>repackage</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>
```

这个plugin很重要，其中的repackage是把java程序打包成为executable程序，否则就只是普通的jar包（纠正：实际测试即使没用这个plugin，pom parent继承了org.springframework.boot，一样可以生成可执行程序，原因见后面关于这个包的解释），不能直接执行，比如hello world，需要javac之后生成的class，用java *.class才能执行，而且如果java程序比较负责，依赖了外部的包，还要给出classpath或libpath，极其麻烦，maven本身就是包管理器，最基本的职责就是mvn package打成普通的jar包，然后mvn install到本地.m2 repository，然后mvn deploy到远程的repository，当需要运行的时候就是用前面提到的java命令执行，当然也可以直接用mvn执行，好处是mvn会自动去.m2下面找到依赖的包，
mvn exec:java -Dexec.mainClass="com.example.Main" -Dexec.args="arg0 arg1"，可以看到mvn实际也就是调用java命令
首先使用这个plugin的情况下，正常的mvn clean package，生成XXX-0.0.1-SNAPSHOT.jar和XXX-0.0.1-SNAPSHOT.jar.origninal：
可以重命名一下orignial为jar，反编译对比下：

![](/docs/docs_image/software/java/java_springboot01.png)

对比可以看到，普通的jar包里面的东西被再次包入了BOOT-INF，然后增加了一个org.springframework.boot.loader的启动包
执行方法：
project里：mvn spring-boot:run
打成包后：java -server -jar XXXX.jar --spring.config.location=/config/

这里居然还有个比较傻逼的比较 https://www.baeldung.com/spring-boot-run-maven-vs-executable-jar
有点意思，还有人这么较真

然后我好奇测试了下mvn最原始的打包plugin，看打成一个fat jar会如何
![](/docs/docs_image/software/java/java_springboot02.png)
无法运行，估计是缺少springboot的上下文，spring boot的程序自然真正的入口应该是spring boot那个loader，加了annotation的那个所谓的入口main实际只是为spring boot loader准备的入口；

** maven-enforcer-plugin
这个是用来检查依赖问题的  mvn enforcer:enforce

### 3.2 Dependencies

Parent org.springframework.boot
https://www.baeldung.com/spring-boot-dependency-management-custom-parent

继承两种方式：
	直接写在parent里面；
	写在dependencymanagement里面
```
<dependencyManagement>
     <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>1.5.6.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

如果没有继承org.springframework.boot,如果有多个入口方法，在pom中指定：
```
<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<mainClass>com.lyhistory.rce.shiro.WebApp</mainClass>
				</configuration>
				<executions>
					<execution>
						<goals>
							<goal>repackage</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
```

如果继承org.springframework.boot,如果有多个入口方法，就多一种方式，在pom中指定：
```
<parent>
   	 <groupId>org.springframework.boot</groupId>
   	 <artifactId>spring-boot-starter-parent</artifactId>
   	 <version>1.5.9.RELEASE</version>
   	 <relativePath /> <!-- lookup parent from repository -->
</parent>

<properties>
  <start-class>com.xx.xx</start-class>
</properties>
```

### 3.3Integration 

#### 3.3.1 redis
@Autowired
Private RedisTemplate redisTemplate;
https://github.com/spring-projects/spring-boot/issues/7238

一文搞定 Spring Data Redis 详解及实战 https://cloud.tencent.com/developer/article/1349818
SpringBoot下Redis相关配置是如何被初始化的 https://my.oschina.net/u/3866531/blog/1858069

Which type of injection??
深度解析SpringBoot2.x整合Spring-Data-Redis https://www.itcodemonkey.com/article/13627.html

#### [3.3.2 Shiro](/docs/software/buildingblock/shiro)

## 4. Spring Cloud 

Spring Cloud 万字总结，真不错！
https://mp.weixin.qq.com/s/YGtKoKBE1jxFaEUpEFSaLg

https://github.com/macrozheng/mall
https://github.com/zhangdaiscott/jeecg-boot

https://github.com/ZhongFuCheng3y/msc-Demo
https://github.com/forezp/SpringCloudLearning
https://github.com/zhoutaoo/SpringCloud

todo:
Mvc
Thymeleaf
Realm


---

ref
[为什么说 Java 程序员到了必须掌握 Spring Boot 的时候？](https://www.cnblogs.com/ityouknow/p/9175980.html)
[聊一聊Spring中的代理](https://www.jianshu.com/p/b73a9bdb7612)
[Spring Cloud](https://spring.io/projects/spring-cloud)
[spring boot 和微服务的关系?](https://www.zhihu.com/question/286198868)
[重新理解微服务](https://zhuanlan.zhihu.com/p/25843782)
[架构设计漫步：从单体架构、SOA到微服务](https://www.jianshu.com/p/6fe0795c782d)
[Microservices](https://martinfowler.com/articles/microservices.html)