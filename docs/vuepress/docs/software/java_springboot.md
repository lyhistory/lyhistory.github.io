[official documents](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-documentation)

自动配置、起步依赖、Actuator、命令行界面(CLI) 是Spring Boot最重要的4大核心特性

Servlet->EJB->Struts->SpringMVC->SpringBoot

New->Factory->容器

## 1.知识点Overview

### 1.1 Spring IoC容器

IoC容器是大管家，你只需要告诉它需要某个bean，它就把对应的实例（instance）扔给你，至于这个bean是否依赖其他组件，怎样完成它的初始化，根本就不需要你关心。

bean是什么？
> The objects that form the backbone of your application and that are managed by the Spring IoC container are called beans. A bean is an object that is instantiated, assembled, and otherwise managed by a Spring IoC container. 
> https://www.tutorialspoint.com/spring/spring_bean_definition.htm

IoC容器想要管理各个业务对象以及它们之间的依赖关系，需要通过某种途径来记录和管理这些信息。 
BeanDefinition对象就承担了这个责任：容器中的每一个bean都会有一个对应的BeanDefinition实例，该实例负责保存bean对象的所有必要信息，包括bean对象的class类型、是否是抽象类、构造方法和参数、其它属性等等。
当客户端向容器请求相应对象时，容器就会通过这些信息为客户端返回一个完整可用的bean实例；
默认是单例模式；

事先这些bean需要向大管家注册，BeanDefinitionRegistry抽象出bean的注册逻辑，BeanFactory则抽象出了bean的管理逻辑，而各个BeanFactory的实现类就具体承担了bean的注册以及管理工作
然后大管家生成bean也是通过这个工厂模式；
DefaultListableBeanFactory作为一个比较通用的BeanFactory实现，它同时也实现了BeanDefinitionRegistry接口，因此它就承担了Bean的注册管理工作，
具体的beanFactory实现类就是实现了DefaultListableBeanFactory这个接口；

![spring揭秘](/docs/docs_image/software/java/spring/java_spring_bean01.png)

Spring提供了两种容器类型：BeanFactory和ApplicationContext：

![spring揭秘](/docs/docs_image/software/java/spring/java_spring_bean02.png)

**Spring IoC容器的整个工作流程大致可以分为两个阶段：**

+ 容器启动阶段

	容器启动时，会通过某种途径加载 ConfigurationMetaData，
	ConfigurationMetaData可能定义在代码中，比如注解方式，也可能在在外部配置文件(XML/Properties)中，
	，容器需要依赖某些工具类如BeanDefinitionReader，BeanDefinitionReader会对加载的 ConfigurationMetaData进行解析和分析，并将分析后的信息组装为相应的BeanDefinition，
	最后把这些保存了bean定义的BeanDefinition，注册到相应的BeanDefinitionRegistry，
	这样容器的启动工作就完成了。

+ Bean的实例化阶段

	这个阶段触发是:当某个请求通过容器的getBean方法请求某个对象，或者因为依赖关系容器需要隐式的调用getBean时（如bean的注解@DependsOn 或者Autowired）;
	容器会首先检查所请求的对象之前是否已经实例化完成。如果没有，则会根据注册的BeanDefinition所提供的信息实例化被请求对象，并为其注入依赖。当该对象装配完毕后，容器会立即将其返回给请求方法使用。

	_Notes:Autowire vs getbean_
	> Injecting a Prototype Bean into a Singleton Bean Problem https://www.logicbig.com/tutorials/spring-framework/spring-core/injecting-singleton-with-prototype-bean.html

	> You can then use getBean to retrieve instances of your beans. The ApplicationContext interface has a few other methods for retrieving beans, but, ideally, your application code should never use them. Indeed, your application code should have no calls to the getBean() method at all and thus have no dependency on Spring APIs at all.
	> https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html

	BeanFactory只是Spring IoC容器的一种实现，如果没有特殊指定，它采用采用延迟初始化策略：只有当访问容器中的某个对象时，才对该对象进行初始化和依赖注入操作。
	对于资源有限，并且功能要求不是很严格的场景，BeanFactory是比较合适的IoC容器选择。

	而在实际场景下，我们更多的使用另外一种类型的容器： ApplicationContext，它构建在BeanFactory之上，属于更高级的容器，除了具有BeanFactory的所有能力之外，还提供对事件监听机制以及国际化的支持等。它管理的bean，在容器启动时全部完成初始化和依赖注入操作。
	ApplicationContext所管理的对象，在该类型容器启动之后，默认全部初始化并绑定完成。所以，相对于BeanFactory来说，ApplicationContext要求更多的系统资源，同时，因为在启动时就完成所有初始化，容器启动时间较之BeanFactory也会长一些。
	在那些系统资源充足，并且要求更多功能的场景中，ApplicationContext类型的容器是比较合适的选择。

**bean生命周期接口**

IoC容器负责管理容器中所有bean的生命周期，而在bean生命周期的不同阶段，Spring提供了不同的扩展点来改变bean的命运，例如EnvironmentPostProcessor、BeanFactoryPostProcessor等（具体参照：第2节 SpringApplication启动流程）:

**单例模式**

spring boot默认bean是单例的，spring mvc默认的servlet也是单例的，当然bean @Controller也是单例的，多线程体现在httpservletrequest本身是线程间互相隔离的，
一般都是通过ThreadLocal实现，
之所以默认单例是因为，springboot本身就是ioc容器，启动过程很长，启动时会实例化加载bean（当然也有lazy模式），bean的实例化通常需要读取配置文件或者有很多其他bean的依赖，
所以每次都重建销毁性能很差，而且浪费内存；
https://stackoverflow.com/questions/10096483/is-threadlocal-preferable-to-httpservletrequest-setattributekey-value

单例就是为了共享从而减少内存开销，多线程就是为了区别每个线程的上下文或者working thread context，所以线程上下文一定不能被共享，
比如ThreadLocal不能跟ExecutorService共用，就是因为ExecutorService破坏了线程间的隔离
Do Not Use ThreadLocal With ExecutorService
https://www.baeldung.com/java-threadlocal 
https://www.cnblogs.com/MrSaver/p/11191028.html

单例模式 工厂模式 建造者模式

> Spring单例Bean与单例模式的区别在于它们关联的环境不一样，单例模式是指在一个JVM进程中仅有一个实例，而Spring单例是指一个Spring Bean容器(ApplicationContext)中仅有一个实例。
> 首先看单例模式，在一个JVM进程中（理论上，一个运行的JAVA程序就必定有自己一个独立的JVM）仅有一个实例，于是无论在程序中的何处获取实例，始终都返回同一个对象，以Java内置的Runtime为例（现在枚举是单例模式的最佳实践），无论何时何处获取，下面的判断始终为真：
> Runtime.getRuntime() == Runtime.getRuntime()
> 与此相比，Spring的单例Bean是与其容器（ApplicationContext）密切相关的，所以在一个JVM进程中，如果有多个Spring容器，即使是单例bean，也一定会创建多个实例，代码示例如下：
```
//  第一个Spring Bean容器
ApplicationContext context_1 = new FileSystemXmlApplicationContext("classpath:/ApplicationContext.xml");
Person yiifaa_1 = context_1.getBean("yiifaa", Person.class);
//  第二个Spring Bean容器
ApplicationContext context_2 = new FileSystemXmlApplicationContext("classpath:/ApplicationContext.xml");
Person yiifaa_2 = context_2.getBean("yiifaa", Person.class);
//  这里绝对不会相等，因为创建了多个实例
System.out.println(yiifaa_1 == yiifaa_2);

<!-- 即使声明了为单例，只要有多个容器，也一定会创建多个实例 -->
<bean id="yiifaa" class="com.stixu.anno.Person" scope="singleton">
    <constructor-arg name="username">
        <value>yiifaa</value>
    </constructor-arg>
</bean>
```
> https://blog.csdn.net/yiifaa/java/article/details/74852425

### 1.2. JavaConfig与常见Annotation

**1.2.1. JavaConfig**

@SpringBootApplication 等同于 @EnableAutoConfiguration + @ComponentScan + @Configuration, 后面启动原理部分有详解

All of your application components (@Component, @Service, @Repository, @Controller etc.) are automatically registered as Spring Beans.

Components(@Component @Service @Controller @Repository) VS Beans (@Beans):
all component types are treated in the same way. The subtypes are mere markers, think code readability rather than features.
https://www.tomaszezula.com/2014/02/09/spring-series-part-5-component-vs-bean/

**1.2.2. @ComponentScan**

**1.2.3. @Import**

在4.2之前， @Import注解只支持导入配置类，但是在4.2之后，它支持导入普通类

**1.2.4. @Conditional @ConditionalOn\***

表示在满足某种条件后才初始化一个bean或者启用某些配置。它一般用在由 @Component、 @Service、 @Configuration等注解标识的类上面，或者由 @Bean标记的方法上。如果一个 @Configuration类标记了 @Conditional，则该类中所有标识了 @Bean的方法和 @Import注解导入的相关类将遵从这些条件。

**1.2.5. @ConfigurationProperties与@EnableConfigurationProperties**

当某些属性的值需要配置的时候，我们一般会在 application.properties文件中新建配置项，然后在bean中使用 @Value注解来获取配置的值;

```
@Configuration
public class MyBatisConfiguration { 
	@Value("${spring.datasource.driverClassName}")
    private String jdbcDriverClassName;
	@Value("${spring.datasource.url}")
    private String jdbcUrl;
    @Value("${spring.datasource.username}")
    private String jdbcUsername;
    @Value("${spring.datasource.password}")
    private String jdbcPassword;
    
	@Bean(name = "dataSource",destroyMethod = "close")
    public DataSource dataSource() {
    	DruidDataSource datasource = new DruidDataSource();
    	datasource.setDriverClassName(jdbcDriverClassName);
    	datasource.setUrl(jdbcUrl);
    	datasource.setUsername(jdbcUsername);
    	datasource.setPassword(jdbcPassword);
        return datasource;
    }
	
	@Bean(name = {"sqlSessionFactory"})
	@ConditionalOnMissingBean(name = {"sqlSessionFactory"})
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
	....
```

但是如果同一个配置在多个地方使用，也存在不方便维护的问题，对于更为复杂的配置，Spring Boot提供了更优雅的实现方式，那就是 @ConfigurationProperties注解
而@EnableConfigurationProperties的作用是将其注册为bean，否则项目不会将其scan为bean，具体：

> In order to use a configuration class in our project, we need to register it as a regular Spring bean.

> First of all, we can annotate such a class with @Component. Alternatively, we can use a @Bean factory method.

> However, **in certain situations, we may prefer to keep a @ConfigurationProperties class as a simple POJO**. This is when @EnableConfigurationProperties comes in handy. We can specify all configuration beans directly on this annotation.

> This is a convenient way to quickly register @ConfigurationProperties annotated beans.

通过上面等表述，我们大概知道，如果用@component就会将其变成增强类，而不是plain old java object了，而是多了很多冗余的功能；

```
@ConfigurationProperties(prefix = "additional")
public class AdditionalProperties {
 
    private String unit;
    private int max;
 
    // standard getters and setters
}
@Configuration
@EnableConfigurationProperties(AdditionalProperties.class)
public class AdditionalConfiguration {
     
    @Autowired
    private AdditionalProperties additionalProperties;
     
    // make use of the bound properties
}
```

**1.2.6 配置属性加载顺序**
```
1、开发者工具 `Devtools` 全局配置参数；

2、单元测试上的 `@TestPropertySource` 注解指定的参数；

3、单元测试上的 `@SpringBootTest` 注解指定的参数；

4、命令行指定的参数，如 `java -jar springboot.jar --name="Java技术栈"`；

5、命令行中的 `SPRING_APPLICATION_JSONJSON` 指定参数, 如 `java -Dspring.application.json='{"name":"Java技术栈"}' -jar springboot.jar`

6、`ServletConfig` 初始化参数；

7、`ServletContext` 初始化参数；

8、JNDI参数（如 `java:comp/env/spring.application.json`）；

9、Java系统参数（来源：`System.getProperties()`）；

10、操作系统环境变量参数；

11、`RandomValuePropertySource` 随机数，仅匹配：`ramdom.*`；

12、JAR包外面的配置文件参数（`application-{profile}.properties（YAML）`）

13、JAR包里面的配置文件参数（`application-{profile}.properties（YAML）`）

14、JAR包外面的配置文件参数（`application.properties（YAML）`）

15、JAR包里面的配置文件参数（`application.properties（YAML）`）

16、`@Configuration`配置文件上 `@PropertySource` 注解加载的参数；

17、默认参数（通过 `SpringApplication.setDefaultProperties` 指定）；
```

### 1.3. 启动加载器 SpringFactoriesLoader

JVM提供了3种类加载器： BootstrapClassLoader、 ExtClassLoader、 AppClassLoader分别加载Java核心类库、扩展类库以及应用的类路径( CLASSPATH)下的类库。JVM通过双亲委派模型进行类的加载，我们也可以通过继承 java.lang.classloader实现自己的类加载器。

何为双亲委派模型？当一个类加载器收到类加载任务时，会先交给自己的父加载器去完成，因此最终加载任务都会传递到最顶层的BootstrapClassLoader，只有当父加载器无法完成加载任务时，才会尝试自己来加载。

采用双亲委派模型的一个好处是保证使用不同类加载器最终得到的都是同一个对象，这样就可以保证Java 核心库的类型安全，比如，加载位于rt.jar包中的 java.lang.Object类，不管是哪个加载器加载这个类，最终都是委托给顶层的BootstrapClassLoader来加载的，这样就可以保证任何的类加载器最终得到的都是同样一个Object对象。

SpringFactoriesLoader，它本质上属于Spring框架私有的一种扩展方案，类似于SPI，Spring Boot在Spring基础上的很多核心功能都是基于此

### 1.4. Spring容器的事件监听机制

Java提供了实现事件监听机制的两个基础类：自定义事件类型扩展自 java.util.EventObject、事件的监听器扩展自 java.util.EventListener

Spring的ApplicationContext容器内部中的所有事件类型均继承自 org.springframework.context.AppliationEvent，容器中的所有监听器都实现 org.springframework.context.ApplicationListener接口，并且以bean的形式注册在容器中。一旦在容器内发布ApplicationEvent及其子类型的事件，注册到容器的ApplicationListener就会对这些事件进行处理。

ApplicationEvent继承自EventObject，Spring提供了一些默认的实现，比如： ContextClosedEvent表示容器在即将关闭时发布的事件类型， ContextRefreshedEvent表示容器在初始化或者刷新的时候发布的事件类型......

容器内部使用ApplicationListener作为事件监听器接口定义，它继承自EventListener。ApplicationContext容器在启动时，会自动识别并加载EventListener类型的bean，一旦容器内有事件发布，将通知这些注册到容器的EventListener。

ApplicationContext接口继承了ApplicationEventPublisher接口，该接口提供了 voidpublishEvent(ApplicationEventevent)方法定义，不难看出，ApplicationContext容器担当的就是事件发布者的角色。如果有兴趣可以查看 AbstractApplicationContext.publishEvent(ApplicationEventevent)方法的源码：ApplicationContext将事件的发布以及监听器的管理工作委托给 ApplicationEventMulticaster接口的实现类。在容器启动时，会检查容器内是否存在名为applicationEventMulticaster的ApplicationEventMulticaster对象实例。如果有就使用其提供的实现，没有就默认初始化一个SimpleApplicationEventMulticaster作为实现。

最后，如果我们业务需要在容器内部发布事件，只需要为其注入ApplicationEventPublisher依赖即可：实现ApplicationEventPublisherAware接口或者ApplicationContextAware接口

### 1.5. 自动配置原理

@SpringBootApplication开启**组件扫描和自动配置**，
而 SpringApplication.run则负责**启动引导应用程序**。 @SpringBootApplication是一个复合 Annotation，它将三个注解组合在一起：

- **@SpringBootConfiguration**就是 @Configuration，它是Spring框架的注解，标明该类是一个 JavaConfig配置类; allow to register extra beans in the context or import additional configuration classes;

- **@ComponentScan**启用组件扫描;enable @Component scan on the package where the application is located;

- **@EnableAutoConfiguration**注解：
	表示开启Spring Boot自动配置功能，Spring Boot会根据应用的依赖、自定义的bean、classpath下有没有某个类 等等因素来猜测你需要的bean，然后注册到IOC容器中;
	enable [Spring Boot’s auto-configuration mechanism](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-auto-configuration)

_Notes:_
> You should only ever add one @SpringBootApplication or @EnableAutoConfiguration annotation. We generally recommend that you add one or the other to your primary @Configuration class only.
> https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-auto-configuration

开始讲解原理，先看EnableAutoConfiguration：
```
@Target(value=TYPE)
 @Retention(value=RUNTIME)
 @Documented
 @Inherited
 @AutoConfigurationPackage
 @Import(value=AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration
```
重点是@Import(EnableAutoConfigurationImportSelector.class)，这里它将把 EnableAutoConfigurationImportSelector作为bean注入到容器中，
```
@Override
	public String[] selectImports(AnnotationMetadata metadata) {
		try {
			AnnotationAttributes attributes = getAttributes(metadata);
			List<String> configurations = getCandidateConfigurations(metadata,
					attributes);
			configurations = removeDuplicates(configurations);
			Set<String> exclusions = getExclusions(metadata, attributes);
			configurations.removeAll(exclusions);
			configurations = sort(configurations);
			recordWithConditionEvaluationReport(configurations, exclusions);
			return configurations.toArray(new String[configurations.size()]);
		}
		catch (IOException ex) {
			throw new IllegalStateException(ex);
		}
	}
```
EnableAutoConfigurationImportSelector.selectImports()是何时执行的？其实这个方法会在容器启动过程中执行： AbstractApplicationContext.refresh(),
这个EnableAutoConfigurationImportSelector类会扫描所有的jar包，将所有符合条件的@Configuration配置类注入的容器中，何为符合条件，看看 META-INF/spring.factories的文件内容：
```
https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
.....
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
.....
```
然后举例看 DataSourceAutoConfiguration：
```
https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/jdbc/DataSourceAutoConfiguration.java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, EmbeddedDatabaseType.class })
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")
@EnableConfigurationProperties(DataSourceProperties.class)
@Import({ DataSourcePoolMetadataProvidersConfiguration.class, DataSourceInitializationConfiguration.class })
public class DataSourceAutoConfiguration {
```
@ConditionalOnClass({DataSource.class,EmbeddedDatabaseType.class})：当Classpath中存在DataSource或者EmbeddedDatabaseType类时才启用这个配置，否则这个配置将被忽略。
注意上面的DataSourceProperties，
@EnableConfigurationProperties(DataSourceProperties.class)：将DataSource的默认配置类注入到IOC容器中，DataSourceproperties定义为：
```
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties implements BeanClassLoaderAware, InitializingBean {
	private ClassLoader classLoader;
	/**
	 * Name of the datasource. Default to "testdb" when using an embedded database.
	 */
	private String name;
	/**
	 * Whether to generate a random datasource name.
	 */
	private boolean generateUniqueName = true;
	/**
	 * Fully qualified name of the connection pool implementation to use. By default, it
	 * is auto-detected from the classpath.
	 */
	private Class<? extends DataSource> type;

	/**
	 * Fully qualified name of the JDBC driver. Auto-detected based on the URL by default.
	 */
	private String driverClassName;

	/**
	 * JDBC URL of the database.
	 */
	private String url;

	/**
	 * Login username of the database.
	 */
	private String username;

	/**
	 * Login password of the database.
	 */
	private String password;
	
```
很清晰对应配置spring.datasource，然后是连接池配置：

@Import({ Registrar.class, DataSourcePoolMetadataProvidersConfiguration.class })：导入其他额外的配置，就以DataSourcePoolMetadataProvidersConfiguration为例吧,
DataSourcePoolMetadataProvidersConfiguration是数据库连接池提供者的一个配置类，即Classpath中存在 org.apache.tomcat.jdbc.pool.DataSource.class，则使用tomcat-jdbc连接池，如果Classpath中存在 HikariDataSource.class则使用Hikari连接池。

## 2. SpringApplication启动流程

### 2.1. SpringApplication初始化

SpringBoot整个启动流程分为两个步骤：初始化一个SpringApplication对象、执行该对象的run方法。看下SpringApplication的初始化流程，SpringApplication的构造方法：

```
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
	this.resourceLoader = resourceLoader;
	Assert.notNull(primarySources, "PrimarySources must not be null");
	this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
	this.webApplicationType = WebApplicationType.deduceFromClasspath();
	setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
	setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
	this.mainApplicationClass = deduceMainApplicationClass();
}
```

初始化流程中最重要的就是通过 SpringFactoriesLoader 找到 spring.factories 文件中配置的 ApplicationContextInitializer 和 ApplicationListener 两个接口的实现类名称，以便后期构造相应的实例。 ApplicationContextInitializer 的主要目的是在 ConfigurableApplicationContext 做 refresh之前，对ConfigurableApplicationContext实例做进一步的设置或处理。ConfigurableApplicationContext继承自 ApplicationContext ，其主要提供了对 ApplicationContext 进行设置的能力。

Spring Boot提供两种方式来添加**自定义监听器**：

通过 SpringApplication.addListeners()或者 SpringApplication.setListeners()两个方法来添加一个或者多个自定义监听器

既然SpringApplication的初始化流程中已经从 spring.factories中获取到 ApplicationListener的实现类，那么我们直接在自己的jar包的 META-INF/spring.factories文件中新增配置即可：

### 2.2. 启动流程

Spring Boot应用的整个启动流程都封装在 SpringApplication.run 方法中，其整个流程真的是太长太长了，但本质上就是在Spring容器启动的基础上做了大量的扩展，按照这个思路来看看源码
```
/**
	 * Run the Spring application, creating and refreshing a new
	 * {@link ApplicationContext}.
	 * @param args the application arguments (usually passed from a Java main method)
	 * @return a running {@link ApplicationContext}
	 */
	public ConfigurableApplicationContext run(String... args) {
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		ConfigurableApplicationContext context = null;
		Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
		configureHeadlessProperty();
		SpringApplicationRunListeners listeners = getRunListeners(args);
		listeners.starting();
		try {
			ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
			ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
			configureIgnoreBeanInfo(environment);
			Banner printedBanner = printBanner(environment);
			context = createApplicationContext();
			exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
					new Class[] { ConfigurableApplicationContext.class }, context);
			prepareContext(context, environment, listeners, applicationArguments, printedBanner);
			refreshContext(context);
			afterRefresh(context, applicationArguments);
			stopWatch.stop();
			if (this.logStartupInfo) {
				new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
			}
			listeners.started(context);
			callRunners(context, applicationArguments);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, listeners);
			throw new IllegalStateException(ex);
		}

		try {
			listeners.running(context);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, null);
			throw new IllegalStateException(ex);
		}
		return context;
	}
```

1) 通过 SpringFactoriesLoader 查找并加载所有的 SpringApplicationRunListeners，通过调用starting()方法通知所有的SpringApplicationRunListener：应用开始启动了。SpringApplicationRunListener 其本质上就是一个事件发布者，它在SpringBoot应用启动的不同时间点发布不同应用事件类型(ApplicationEvent)，如果有哪些事件监听者(ApplicationListener)对这些事件感兴趣，则可以接收并且处理。前面的初始化流程中，SpringApplication 加载了一系列 ApplicationListener。发布事件的代码已经在SpringApplicationRunListeners中实现了。
SpringApplicationRunListener只有一个实现类： EventPublishingRunListener。此处的代码只会返回一个 SpringApplicationRunListeners ，注意后面多了一个s字母，看下源码就会发现该类就是包含了一个SpringApplicationRunListener的List。操作SpringApplicationRunListeners ，在内部会遍历每一个SpringApplicationRunListener，调用每一个SpringApplicationRunListener的实现类的starting方法

2) 创建并配置当前应用将要使用的 Environment，Environment用于描述应用程序当前的运行环境，其抽象了两个方面的内容：配置文件(profile)和属性(properties)，开发经验丰富的同学对这两个东西一定不会陌生：不同的环境(eg：生产环境、预发布环境)可以使用不同的配置文件，而属性则可以从配置文件、环境变量、命令行参数等来源获取。因此，当Environment准备好后，在整个应用的任何时候，都可以从Environment中获取资源。

	总结起来，主要完成以下几件事：
	
	- 判断Environment是否存在，不存在就创建（如果是web项目就创建 StandardServletEnvironment，否则创建 StandardEnvironment）
	
	- 配置Environment：配置profile以及properties
	
	- 调用SpringApplicationRunListener的 environmentPrepared()方法，通知事件监听者：应用的Environment已经准备好

3) 打印Banner图案

4) 根据不同的ApplicationType创建不同的Context，具体的类型回顾初始化中App类型的介绍

5) 初始化ApplicationContext，主要完成以下工作：

	- 将准备好的Environment设置给ApplicationContext
	
	- 遍历调用所有的ApplicationContextInitializer的 initialize()方法来对已经创建好的ApplicationContext进行进一步的处理
	
	- 调用SpringApplicationRunListener的 contextPrepared()方法，通知所有的监听者：ApplicationContext已经准备完毕
	
	- 将所有的bean加载到容器中
	
	- 调用SpringApplicationRunListener的 contextLoaded()方法，通知所有的监听者：ApplicationContext已经装载完毕

6) refresh完成配置类的解析、各种BeanFactoryPostProcessor和BeanPostProcessor的注册、国际化配置的初始化、web内置容器的构造等等。

以上就是Spring Boot的整个启动流程，其核心就是在Spring容器初始化并启动的基础上加入各种扩展点，这些扩展点包括：
- ApplicationContextInitializer
- ApplicationListener
- 自动配置自定义
	org.springframework.boot.env.EnvironmentPostProcessor:
	Allows for customization of the application's {@link Environment} prior to the application context being refreshed.
- 各种BeanFactoryPostProcessor等等
	org.springframework.beans.factory.config.BeanFactoryPostProcessor：
	允许我们在容器实例化相应对象之前，对注册到容器的BeanDefinition所保存的信息做一些额外的操作，比如修改bean定义的某些属性或者增加其他信息等。


## 3. 使用springboot开发应用

### 3.1 业务开发

spring boot官方提供了很多现成的starter，可以直接引用其depdendency使用比如 
spring-boot-starter-web，spring-boot-starter-jdbc
[starters](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)

但是问题是引用时需要加版本号，很多starter之间以及跟其他的dependency之间可能有版本依赖冲突，
所以官方推荐使用parent方式或者import方式引入某个版本的spring-boot-starter-parent，因为这个parent里面已经定义好了各个版本号，
所以在引用比如spring-boot-starter-web的时候就不需要添加版本号了

```
<!-- Inherit defaults from Spring Boot -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.6.RELEASE</version>
</parent>

<dependencyManagement>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
	</dependencies>
</dependencyManagement>

<!--The spring-boot-starter-parent POM includes <executions> configuration to bind the repackage goal.-->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>

<!-- Dependence Override 
full list: https://github.com/spring-projects/spring-boot/blob/v2.2.6.RELEASE/spring-boot-project/spring-boot-dependencies/pom.xml
-->
<properties>
    <spring-data-releasetrain.version>Fowler-SR2</spring-data-releasetrain.version>
</properties>

```

[一站式starter](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)

[About AutoConfig](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-auto-configuration)
Gradually Replacing Auto-configuration
Disabling Specific Auto-configuration Classes
(exclude={DataSourceAutoConfiguration.class})



---

REFERENCE:

https://github.com/javastacks/spring-boot-best-practice
https://github.com/YunaiV/SpringBoot-Labs

[Spring Boot 2.0 ：深入分析Spring Boot原理](https://blog.csdn.net/TheLudlows/article/details/81360067)
[给你一份超详细 Spring Boot 知识清单](https://mp.weixin.qq.com/s/1yxsCD3IxopIWYceA54Ayw)



EnvironmentPostProcessor
BeanPostProcessor

spring boot之自动装配（spring-boot-autoconfigure） https://blog.csdn.net/wangjie5540/article/details/99542777

原创 | 我被面试官给虐懵了，竟然是因为我不懂Spring中的@Configuration
https://juejin.im/post/5d005860f265da1b7f297630

spring boot 中的 Parent POM 和 Starter 的作用什么
https://cloud.tencent.com/developer/article/1362790

#### 3.1.2 springboot mvc

so by default, tomcat will create some temp folder under /tmp and use it later on

[`spring.servlet.multipart.location`](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html#spring.servlet.multipart.location)

https://stackoverflow.com/questions/50523407/the-temporary-upload-location-tmp-tomcat-4296537502689403143-5000-work-tomcat/50523578





### 3.2 框架开发（starter）

ConfigurationProperties和EnableConfigurationProperties是一对，
前者定义对应配置文件的属性，后者是激活读取；
同样，
Configuration或AutoConfiguration跟EnableAutoConfiguration是一对，
前者相当于component就是定义为bean，而后者是激活这个自动配置/装配（具体参考springboot源码分析一文），

https://docs.spring.io/spring-boot/docs/1.3.8.RELEASE/reference/html/using-boot-auto-configuration.html

创建一个starter
hello-spring-boot-starter

```
写一个服务类
public class HelloService {

  private String msg;

  public String sayHello() {
    return "hello " + msg;
  }

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }
}
@ConfigurationProperties(prefix = "hello") //获取属性值
public class HelloProperties {

  private static final String MSG = "world";

  private String msg = MSG ;

  public String getMsg() {
    return msg;
  }

  public void setMsg(String msg) {
    this.msg = msg;
  }

}
@Configuration
//为带有@ConfigurationProperties注解的Bean提供有效的支持。
// 这个注解可以提供一种方便的方式来将带有@ConfigurationProperties注解的类注入为Spring容器的Bean。
@EnableConfigurationProperties(HelloProperties.class)//开启属性注入,通过@autowired注入
@ConditionalOnClass(Hello.class)//判断这个类是否在classpath中存在，如果存在，才会实例化一个Bean
// The Hello bean will be created if the hello.enable property exists and has a value other than false
// or the property doesn't exist at all.
@ConditionalOnProperty(prefix="hello", value="enabled", matchIfMissing = true)
public class HelloAutoConfiguration {

  @Autowired
  private HelloProperties helloProperties;

  @Bean
  @ConditionalOnMissingBean(Hello.class)//容器中如果没有Hello这个类,那么自动配置这个Hello
  public HelloService hello() {
    HelloService hello = new HelloService();
    hello.setMsg(helloProperties.getMsg());
    return hello;
  }

}

application.properties
\#可以不配置
hello.enabled=true

hello.msg=charmingfst

\#以debug模式运行
debug=true

\src\main\resources\META-INF\spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.chm.test.HelloAutoConfiguration

https://blog.csdn.net/zxc123e/article/details/80222967
```



