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

https://www.huaweicloud.com/articles/b59be8ffdcfbd1f8a1fe28bffe848d20.html

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



@bean方法调用的特殊性：

https://www.racecoder.com/archives/787/

https://stackoverflow.com/questions/27990060/calling-a-bean-annotated-method-in-spring-java-configuration



[Spring Boot 2.0 ：深入分析Spring Boot原理](https://blog.csdn.net/TheLudlows/article/details/81360067)

spring boot之自动装配（spring-boot-autoconfigure） https://blog.csdn.net/wangjie5540/article/details/99542777

原创 | 我被面试官给虐懵了，竟然是因为我不懂Spring中的@Configuration
https://juejin.im/post/5d005860f265da1b7f297630

#### Spring装配bean的三种方法：

The interface `org.springframework.context.ApplicationContext` represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the aforementioned beans. The container gets its instructions on what objects to instantiate, configure, and assemble by reading configuration metadata. The configuration metadata is represented in：

XML, Java annotations, or Java code:

https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html

- [Annotation-based configuration](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html#beans-annotation-config) 使用注解Annotation定义Bean

  Spring 2.5 introduced support for annotation-based configuration metadata.

  spring从两个角度实现自动化装配：组件扫描和自动装配

  1) 创建可被发现的bean

  ```java
  @Component
  这个简单的注解表明该类会作为组件类,并告知Spring要为这个类创建bean
  
  ----------------------------------------------------------------------------------------
  --- 命名 bean id
  ---------------------------------------------------------------------------------------- 
  如果没有个bean设置ID,Spring会根据类名为其指定一个ID,默认名字就是把类名的第一个字母变为小写.
  @Component("lonelyHeartsClub") //设置期望的ID
  	public class SgtPeppers implements CompactDisc{
  }
  另外还一种为bean命名的方式,使用Java依赖注入规范中所提供的@Named注解来为bean设置ID
  @Named("lonelyHeartsClub")
  public class SgtPeppers implements CompactDisc{
  }
  
  ----------------------------------------------------------------------------------------
  --- 设置组件扫描的基础包
  ----------------------------------------------------------------------------------------
  当对一个类标注@Component注解时，表明该类会作为组件类，spring将为这个类创建bean。当在应用文中引用这个bean，spring会自动扫描事先指定的包查找这个  bean。但spring默认是不启用组件扫描的，可以在XML中配置加上。还有一种方法：在新建一个配置类，类中可以什么不用写，在配置类上加上@ComponentScan注解，spring会自动扫描改配置类所在的包。
  //直接在value属性中指明包的名称
  @Configuration
  @ComponentScan("soundsystem")
  public class CDPlayerConfig{}
  
  //通过basePackages属性配置
  @Configuration
  @ComponentScan(basePackages="soundsystem")
  public class CDPlayerConfig{}
  
  //设置多个基础包,用数组表示
  @Configuration
  @ComponentScan(basePackages={"soundsystem","video"})
  public class CDPlayerConfig{}
  
  //基础包以String类型表示是不安全的,如果重构代码的话,指定的基础包可能会出现错误,用指定为包中所包含的类或接口的方法
  @Configuration
  @ComponentScan(basePackageClasses={CDPlayer.class,DVDPlayer.class})
  public class CDPlayerConfig{}
  
  ----------------------------------------------------------------------------------------
  --- 添加注解自动装配Autowired
  @Autowired可以换成@Inject,@Inject注解来源于Java依赖注入规范,该规范同时还为我们定义了@Named注解.
  尽管@Inject和@Autowierd有细微的差别,但大多数场景下,它们都可以互换.
  ----------------------------------------------------------------------------------------
  @Autowired注解构造器：
  @Component
  public class CDPlayer implements MediaPlayer{
    private CompactDisc cd;
  
    @Autowired//这表明当Spring创建CDPlayer bean的时候,会通过这个构造器来进行实例化并且会传入一个可设置给CompactDisc类型的bean.
    public CDPlayer(CompactDisc cd){//构造器
      this.cd = cd;
    }
  
    public void paly(){
      cd.paly();
    }
  }
  
  @Autowired注解属性的Setter方法：
  @Autowired
  public void setCompactDisc(CompactDisc cd){
    this.cd = cd;
  }
  
  如果没有匹配的bean,那么在应用上下文创建的时候,Spring会抛出一个异常,为了避免异常的出现,你可以将@Autowired的requied属性设置为false
  @Autowired(required=false)
  public void setCompactDisc(CompactDisc cd){
    this.cd = cd;
  }
  
  如果有多个bean都能满足依赖关系的话,Spring将会抛出一个异常,表明没有明确指定要选择哪个bean进行自动装配, 一般在组件类上添加注解@Qualifier()括号写这个bean的id，在注入时也加上@Qualifier(),写上bean的id
  @Component
  @Qualifier("postdao")
  public interface Postdao{
  . . . .
  }
  
  @Component
  @Qualifier("userdao")
  public interface Userdao{
  . . . .
  }
  
  @Autowired
  @Qualifier("usedao")
  public void setUserdao(Userdao userdao)
  {. . .
  }
  
  @Autowired
  @Qualifier("postdao")
  public void setUserdao(Postdao postdao)
  {. . .
  }
  ```

- [Java-based configuration](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html#beans-java) 基于java类提供Bean定义信息

  所谓java based 我的理解是这里是说不需要依赖于spring，普通的java项目也可以用

  Starting with Spring 3.0, many features provided by the [Spring JavaConfig project](http://www.springsource.org/javaconfig) became part of the core Spring Framework. Thus you can define beans external to your application classes by using Java rather than XML files. To use these new features, see the `@Configuration`, `@Bean, @Import` and `@DependsOn` annotations.

  有些情况下,比如说,要将第三方库的组件装配到你的应用中,就不能使用前面的自动化装配方法 到第三方库中去给类加@Component和@Autowired注解,
  在这种情况下,就需要采用显示装配的方式.在进行显示配置有Java和XML两种方案显示装配bean.

  使用java代码，先新建一个配置类JavaConfig，里面都是配置所需的bean，不应该有业务逻辑代码，所以单独建一个类。

  ```java
  @Configuration
  public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
  }
  public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
  }
  
  public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
  }
  
  //创建JavaConfig类的关键在于为其添加@Configruation注解,表明这是一个配置类
  @Configuration
  public class CDPlayerConfig{
      @Bean
      public CompactDisc sgtPeppers(){
        return new SgtPeppers();
      }
      //@Bean注解会告诉Spring这个方法将会返回一个对象,该对象要注册为Spring应用上下文的bean,默认情况下,
      bean的ID于带有@Bean注解的方法名一样,也可以重命名
  
      @Bean(name="lonelyHeartsClubBand")
      public CompactDisc sgtPeppers(){
        return new SgtPeppers();
      }
  	
      声明CompactDisc bean是非常简单,它自身没有其他依赖,但现在,我们需要声明CDPlayer bean,它依赖于CompactDisc,在JavaConfig中,如何将他们装配在一起呢?
      @Bean
      public CDPlayer cdPlayer(){
        return new CDPlayer(sgtPeppers()); //因为sgtPeppers()方法上添加了@Bean注解,Spring将会拦截所有对它的调用,
      //并确保直接返回该方法创建的bean,而不是每次都对其进行实际的调用.
      }
      等价于下面这种方式
          
      @Bean
      public CDPlayer cdPlayer(CompactDisc compactDisc){//在这里,cdPlayer()方法请求一个CompactDisc作为参数,当Springs调用cdPlayer()创建CDPlayer bean的时候,
  //它会自动装配一个CompactDisc到配置方法之中,然后方法体按照合适的方法来使用它.
        return new CDPlayer(compactDisc);
      }
  	@Bean(name="lonelyHeartsClubBandPlayer")
      public CDPlayer cdPlayer(CompactDisc lonelyHeartsClubBand){
  		return new CDPlayer(compactDisc);
      }
  }
  
  More example：
  
  @Configuration
  @ContextConfiguration(locations = {"classpath:spring/spring-dao.xml","classpath:scan.xml"}）
  public class bbsConfig{
  　　private Postdao postdao;
  　　private Userdao userdao;
  　　@Bean(name="postservice")
     public PostService getPost()
  　　{
  　　return new PostserviceImpl(postdao,userdao);
  　　}
  }
  
  在对PostService的bean注入时，同时又依赖了两个bean，postdao和userdao。直接引用beanID就可以，spring会自动地从容器中获取这些bean，只要他们的配置是正确的就行。这个例子中userdao、postdao是Mybatis配置自动扫描将dao接口生成代理注入到spring的，其实也算是xml装配bean
  这里如果再声明一个bean，返回的仍是postserviceImpl对象，和之前的那个bean完全一样，是同一个实例。一般spring @bean如果是同一个beanID，默认返回的是一个单例bean，注入的是同一个实例。如果修改其中一个会都改变的。
  不过在这里要注意进行测试时，由于spring的单元测试和springIoc容器是完全独立的，postdao和userdao注入检测时是使用locations加载xml文件，而postservice使用classes加载config类的，但是两个不能同时混用在@ContextConfiguration中。所以非要都测试的话，就分开测试吧。
  ```

  

- 基于xml配置Bean

  Configuration metadata is traditionally supplied in a simple and intuitive XML format

  https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html

  ```java
  //XML装配bean的缺点
  //1.当Spring发现这个<bean>元素时,它将会调用SgtPeppers的默认构造器来创建bean.在XML配置中,bean的创建显得更加被动
  //2.不如JavaConfig强大,在JavaConfig配置中,可以通过任何想象到的方法来创建bean实例(构造器,set方法等)
  //3.在简单的<bean>声明中,将bean的类型以字符串的形式设置在了class属性中,不能保证设置给class属性的值是真正的类
  //4.重命名了类,也会引起麻烦
  
  --------------------------------------------------------------------------------------
  ---基本
  --------------------------------------------------------------------------------------
  <?xml version="1.0" encoding="UTF-8">
  <beans xmlns="http://........"
               xmlns:xsi="http://.....''>
    <!--  configuration details go here -->
  	<bean class="soundsystem.SgtPeppers" />
  	//这里声明一个很简单的bean,因为没有明确给定ID,所以这个bean将会根据全限定类名来进行命名,
  	//这里的bean的ID将会是"soundsystem.SgtPeppers#0".其中,"#0"是一个计数的形式,来区分相同类型的bean.
  
  	//更好的方法是借助id属性
  	<bean id="compactDisc" class="soundsystem.SgtPeppers" />
  
  	
   	//当Spring遇到<bean>这个元素时,它会创建一个CDPlayer实例.<constructor-arg>元素会告知Spring要将
      //一个ID为compactDisc的bean引用传递到CDPlayer的构造器中.
      <bean id="cdPlayer" class="soundsystem.CDPlayer">
        <constructor-arg ref="compactDisc">
      </bean>
          
  </beans>
  
  作为替代方案,也可以使用Spring的c-命名空间（Spring3.0所引入的c-命名空间）
  <?xml version="1.0" encoding="UTF-8">
  <beans xmlns="http://........"
              xmlns:c="http://www.springframework.org/schema/c"
               xmlns:xsi="http://.....''>
    <!--  configuration details go here -->
  	<bean id="cdPlayer" class="soundsystem.CDPlayer"
     	c:cd-ref="compactDisc">
      //"c:" 命名空间的前缀
      //"cd" 构造器参数名
      //"-ref"注入bean引用
      //"compactDisc" 要注入bean 的ID
  	
      如果在优化构建的过程,将调试标志移除掉,那么这种方式可能无法正常执行.代替方案：
  	<bean id="cdPlayer" class="soundsystem.CDPlayer"
     c:_0-ref="compactDisc">
  	//把参数名换成"0",也就是参数的索引,但XML中不允许数字作为属性的第一个字符,因此添加下划线"_"
  
  </beans>
  --------------------------------------------------------------------------------------
  --- 字面量string注入
  --------------------------------------------------------------------------------------
  public class BlankDisc implements CompactDisc{
    private String title;
    private String artist;
    
    public BlandDisc(String title,String artist){
      this.title = title;
      this.artist = artist;
    }
  
    public void paly(){
      System.out.println("Playing"+title+"by"+artist);
    }
  
  }
  
  <bean id="compactDisc"
      class="soundysytem.BlankDisc">
    <constructor-arg value="Sgt.Peper's Lonely Hearts" />
    <constructor-arg value="The beatles"/>
  </bean>
  等价
  <bean id="compactDisc"
      class="soundsystem.BlanDisc"
      c:_title="Sgt.Peper's Lonely Hearts"
      c:_artist="The beatles"/>
  </bean>
  或
  <bean id="compactDisc"
      class="soundsystem.BlanDisc"
      c:_0="Sgt.Peper's Lonely Hearts"
      c:_1="The beatles"/>
  </bean>
  
  --------------------------------------------------------------------------------------
  --- 集合注入
  -------------------------------------------------------------------------------------- 
  public class BlankDisc implements CompactDisc{
  
    private String title;
    private String artist;
    private List<String> tracks;
  
     public void setTitel(String title){
      this.title = title;
      }
  
      public void setArtist(String artist){
        this.artist= artist;
      }
     public void setTracks(List<String> tracks){
      this.tracks= tracks;
      }
  
      public void play(){
        ....
      }
  }
  
  <bean id="compactDisc"
      class="soundsystem.BlankDisc">
    <constructor-arg value="Sgt.Peper's Lonely Hearts" />
    <constructor-arg value="The beatles" />
    <constructor-arg>
      <list>
        <value>Sgt. Pepper's Lonely Heats</value>
        <value>With a Little Help</value>
        <value>Lucy in the Sky</value>
        <value>Getting Better</value>
        <value>Fixing a Hole</value>
      </list>
    </constructor-arg>
  </bean>
  等价于p命名空间
  <bean id="compactDisc"
        class="soundsystem.BlankDisc"
        p:title="Sgt.peper's loney hearts club"
        p:artist="The Beatles">
    <property name="tracks">
      <list>
        <value>Sgt.peper's loney hearts club</value>
        <value>loney hearts club</value>
        <value>hearts club</value>
        <value>club hearts</value>
        ...
      </list>
     </property>
  注意list不能直接使用p空间，可以借用util-命名空间
  <util:list id="trackList">
       <value>Sgt.peper's loney hearts club</value>
       <value>loney hearts club</value>
       <value>hearts club</value>
       <value>club hearts</value>
  </util:lsit>
  <bean id="compactDisc"
             class = "soundsystem.BlankDisc"
             p:title="Sgt.pepers lonely hearts"
             p:artist="The Beatles"
             p:tracks-ref="trackList">     
  
  复杂类型的list：
  public Discography(String artist,List<CompactDisc> cds){...}
  
  <bean id="beatlesDiscography" class="soundsystem.Discography">
    <constructor-arg value="The Beatles" />
    <constructor-arg>
      <list>
        <ref bean="sgtPeppers" />
        <ref bean="whiteAlbum" />
        ...
      </lsit>
    </constructor-arg>
  
  --------------------------------------------------------------------------------------
  --- 属性注入
  --------------------------------------------------------------------------------------    
  import soundsystem.CompactDisc;
  import soundsystem.MediaPlayer;
  
  public class CDPlayer implements MediaPlayer{
    private CompactDisc compactDisc;
  
    @Autowired
    public void setCompactDisc(CompactDisc compactDisc){
      this.compactDisc = compactDisc; 
    }
  
    public void paly(){
      compactDisc.play();
    }
  } 
  <bean id="cdPlayer" class="soundsystem.CDPlayer">
      <property name="compactDisc" ref="compactDisc" />
  </bean>
  //通过ref引用了ID为compactDisc的bean,将其注入到compactDisc属性中(通过setCompactDisc()方法)
  
  等价于通过p命名空间
  <?xml version="1.0" encoding="UTF-8">
  <beans xmlns="http://........"
         xmlns:p="http://www.springframework.org/schema/p"
         xmlns:xsi="http://.....''>
    <!--  configuration details go here -->
    <bean id="cdPlayer" class="soundsystem.CDPlayer"
      p:compactDisc-ref="compactDisc" />
  </bean>
  //"p:" :前缀
  //前面的compactDisc: 属性名
  //-ref:  注入bean引用
  //后面的compactDisc: 所注入bean的ID
  
  </beans>
   
  
  <?xml version="1.0" encoding="UTF-8" ?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
              http://www.springframework.org/schema/beans/spring-beans.xsd
              http://www.springframework.org/schema/context">
      <import resource="spring/spring-dao.xml"/>
  
      <bean id="postservice" class="com.bbs.service.impl.PostserviceImpl">
            <constructor-arg ref="postdao"/>
              <constructor-arg ref="userdao"/>
      </bean>
  </beans>
  
  配置postservice的bean时需要引入两个bean，postdao和userdao，放到constructor-arg的标签中，ref指的是依赖的bean的ID。如果是在javaConfig中配置的，就写@Bean的内容。如果是@Component就写@Qualifier的内容。这里是引入的是动态实现的dao接口的bean，是在spring-dao.xml中配置的，引入这个配置文件就可以自动获得beanID。
  ```

  

  **混合使用三种装配**

  1. 在类上可以使用 @import(bbsConfig.class)组合其他java注解
  2. 在类上使用 @importResource("classpath:spring-dao.xml")组合其他xml注解
  3. 在类上可以使用@ContenxtConfiguration包含class或者xml
  4. 在xml中可以用引入xml注解，也可以使用引入java注解

#### 基于XML的三种注入方式：

https://www.cnblogs.com/wuchanming/p/5426746.html

+ 属性注入

  ```java
  package com.java.entity;
  
  public class People {
      private int id;
      private String name;
      private int age;
  
      public People() {
          //调用默认的构造方法
      }
  
      public int getId() {
          return id;
      }
  
      public void setId(int id) {
          this.id = id;
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  
      public int getAge() {
          return age;
      }
  
      public void setAge(int age) {
          this.age = age;
      }
      
        @Override
      public String toString() {
          return "People{" +
                  "id=" + id +
                  ", name='" + name + '\'' +
                  ", age=" + age +
                  '}';
      }
  }
  
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd">
  
      <bean id="people" class="com.java.entity.People"></bean>
      //属性注入
      <bean id="people2" class="com.java.entity.People">
              <property name="id" value="1"></property>
              <property name="age" value="18"></property>
              <property name="name" value="张三"></property>
          </bean>
  </beans>
          
  public class Test2 {
      public static void main(String[] args) {
          //加载beans.xml文件，调用Spring接口
          ApplicationContext ac=new ClassPathXmlApplicationContext("beans.xml");
          //通过id获取bean，返回一个对象
          People people=(People)ac.getBean("people");
          //调用方法
          System.out.println(people);
  		
          //属性注入
          People people2=(People)ac.getBean("people2");
          System.out.println(people2);
      }
  }
  ```

  

+ 构造函数注入

  ```java
  public People(int id, String name, int age) {
          this.id = id;
          this.name = name;
          this.age = age;
      }
  <!--类型注入-->
      <bean id="people3" class="com.java.entity.People">
          <constructor-arg type="int" value="2"></constructor-arg>
          <constructor-arg type="String" value="李四"></constructor-arg>
          <constructor-arg type="int" value="19"></constructor-arg>
      </bean>
  
      <!--索引注入-->
      <bean id="people4" class="com.java.entity.People">
          <constructor-arg index="0" value="3"></constructor-arg>
          <constructor-arg index="1" value="王五"></constructor-arg>
          <constructor-arg index="2" value="20"></constructor-arg>
      </bean>
  
      <!--联合使用-->
      <bean id="people5" class="com.java.entity.People">
          <constructor-arg type="int" index="0" value="4"></constructor-arg>
          <constructor-arg type="String" index="1" value="赵六"></constructor-arg>
          <constructor-arg type="int" index="2" value="21"></constructor-arg>
      </bean>
  
  //类型注入
  People people3=(People)ac.getBean("people3");
  System.out.println(people3);
  
  //类型注入
  People people4=(People)ac.getBean("people4");
  System.out.println(people4);
  
  //联合使用
  People people5=(People)ac.getBean("people5");
  System.out.println(people5);
  ```

  

+ 工厂方法注入，分为静态工厂和非静态工厂； 一般用得多的都是静态工厂；

  ```java
  package com.java.factory;
  
  import com.java.entity.People;
  
  public class PeopleFactory {
      //非静态工厂
      public People createPeople(){
          People p=new People();
          p.setId(5);
          p.setName("阿七");
          p.setAge(22);
          return p;
      }
  
      //静态工厂
      public static People createPeople1(){
          People p=new People();
          p.setId(6);
          p.setName("阿八");
          p.setAge(23);
          return p;
      }
  }
  
   <!--工厂模式的非静态方法-->
      <bean id="peopleFactory" class="com.java.factory.PeopleFactory"></bean>
  
      <bean id="people6" factory-bean="peopleFactory" factory-method="createPeople"></bean>
  
      <!--工厂模式的静态方法-->
      <bean id="people7" class="com.java.factory.PeopleFactory" factory-method="createPeople1"></bean>
          
   //工厂方式注入，非静态
  People people6=(People)ac.getBean("people6");
  System.out.println(people6);
  
  //工厂方式注入，静态
  People people7=(People)ac.getBean("people7");
  System.out.println(people7);
  ```



#### 基于Autowired 的三种注入方式

https://stackoverflow.com/questions/39890849/what-exactly-is-field-injection-and-how-to-avoid-it

https://medium.com/@ilyailin7777/all-dependency-injection-types-spring-336da7baf51b

 如果你使用的是构造器注入
恭喜你，当你有十几个甚至更多对象需要注入时，你的构造函数的参数个数可能会长到无法想像。

如果你使用的是field反射注入
如果不使用Spring框架，这个属性只能通过反射注入，太麻烦了！这根本不符合JavaBean规范。
还有，当你不是用过Spring创建的对象时，还可能引起NullPointerException。
并且，你不能用final修饰这个属性。

如果你使用的是setter方法注入
那么你将不能将属性设置为final。
两者取其轻

Spring3.0官方文档建议使用setter注入覆盖构造器注入。
Spring4.0官方文档建议使用构造器注入。
结论

如果注入的属性是必选的属性，则通过构造器注入。
如果注入的属性是可选的属性，则通过setter方法注入。
至于field注入，不建议使用。

+ 通过field反射注入, field injection (不推荐)

  ```java
  @Component
  public class Dependency(){
  }
  @Component
  public class DI(){
  	@Autowired
  	private Dependency dependency;
  }
       
  ```

+ 通过构造器注入

  ```
  public class DI(){
  	//通过构造器注入
  	private DependencyA a;
  	@Autowired
  	public DI(DependencyA a){
  		this.a = a;
  	}
     
  }
  ```

  

+ 通过setter方法注入

  ```
  public class DI(){
  	//通过setter方法注入
  	private DependencyB b;
  	@Autowired
  	public void setDependencyB(DependencyB b){
  		this.b = b;
  	}
      
  }
       
  ```

  

  

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

### 3.0 项目技巧

#### include

application.yml

application-datasource.yml

```
spring:
  profiles:
    #split into multiple profile files
    include: datasource
```

#### multiple env: dev prod

application.properties

```
spring.profiles.active:@spring.profiles.active@
```

application-dev.yml

application-prod.yml

```
mvn spring-boot:run -Dspring.profiles.active=dev
mvn clean install -Dspring.profiles.active=dev
```

~pom.xml(不需要）~

```
<profiles>
        <profile>
            <id>dev</id>
            <properties>
                <myActiveProfile>dev</myActiveProfile>
            </properties>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <myActiveProfile>prod</myActiveProfile>
            </properties>
        </profile>
    </profiles>
```



### 3.1 业务开发

#### 3.1.1 使用starter

##### POM depenedency

spring boot官方提供了很多现成的starter，可以直接引用其depdendency使用比如 
[starters](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)

| `spring-boot-starter`    | Core starter, including auto-configuration support, logging and YAML |
| ------------------------ | ------------------------------------------------------------ |
| spring-boot-starter-web  | Starter for building web, including RESTful, applications using Spring MVC. Uses Tomcat as the default embedded container |
| spring-boot-starter-jdbc | Starter for using JDBC with the HikariCP connection pool     |

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

##### Configuration

默认是 application.properties，也可以使用yaml

都在这里：

https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html

另外一种稍微硬核的通过查阅代码获取的方式：

所有的配置都可以在 spring-boot-autoconfigure里面找到，比如

org.springframework.boot.autoconfigure.data.redis/RedisProperties

```java
@ConfigurationProperties(prefix = "spring.redis")
public class RedisProperties {

	/**
	 * Database index used by the connection factory.
	 */
	private int database = 0;

	/**
	 * Connection URL. Overrides host, port, and password. User is ignored. Example:
	 * redis://user:password@example.com:6379
	 */
	private String url;

	/**
	 * Redis server host.
	 */
	private String host = "localhost";

	/**
	 * Login password of the redis server.
	 */
	private String password;

	/**
	 * Redis server port.
	 */
	private int port = 6379;

	/**
	 * Whether to enable SSL support.
	 */
	private boolean ssl;

	/**
	 * Connection timeout.
	 */
	private Duration timeout;

	private Sentinel sentinel;

	private Cluster cluster;

	private final Jedis jedis = new Jedis();

	private final Lettuce lettuce = new Lettuce();

	public int getDatabase() {
		return this.database;
	}

	public void setDatabase(int database) {
		this.database = database;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getHost() {
		return this.host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getPort() {
		return this.port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public boolean isSsl() {
		return this.ssl;
	}

	public void setSsl(boolean ssl) {
		this.ssl = ssl;
	}

	public void setTimeout(Duration timeout) {
		this.timeout = timeout;
	}

	public Duration getTimeout() {
		return this.timeout;
	}

	public Sentinel getSentinel() {
		return this.sentinel;
	}

	public void setSentinel(Sentinel sentinel) {
		this.sentinel = sentinel;
	}

	public Cluster getCluster() {
		return this.cluster;
	}

	public void setCluster(Cluster cluster) {
		this.cluster = cluster;
	}

	public Jedis getJedis() {
		return this.jedis;
	}

	public Lettuce getLettuce() {
		return this.lettuce;
	}

	/**
	 * Pool properties.
	 */
	public static class Pool {

		/**
		 * Maximum number of "idle" connections in the pool. Use a negative value to
		 * indicate an unlimited number of idle connections.
		 */
		private int maxIdle = 8;

		/**
		 * Target for the minimum number of idle connections to maintain in the pool. This
		 * setting only has an effect if it is positive.
		 */
		private int minIdle = 0;

		/**
		 * Maximum number of connections that can be allocated by the pool at a given
		 * time. Use a negative value for no limit.
		 */
		private int maxActive = 8;

		/**
		 * Maximum amount of time a connection allocation should block before throwing an
		 * exception when the pool is exhausted. Use a negative value to block
		 * indefinitely.
		 */
		private Duration maxWait = Duration.ofMillis(-1);

		public int getMaxIdle() {
			return this.maxIdle;
		}

		public void setMaxIdle(int maxIdle) {
			this.maxIdle = maxIdle;
		}

		public int getMinIdle() {
			return this.minIdle;
		}

		public void setMinIdle(int minIdle) {
			this.minIdle = minIdle;
		}

		public int getMaxActive() {
			return this.maxActive;
		}

		public void setMaxActive(int maxActive) {
			this.maxActive = maxActive;
		}

		public Duration getMaxWait() {
			return this.maxWait;
		}

		public void setMaxWait(Duration maxWait) {
			this.maxWait = maxWait;
		}

	}

	/**
	 * Cluster properties.
	 */
	public static class Cluster {

		/**
		 * Comma-separated list of "host:port" pairs to bootstrap from. This represents an
		 * "initial" list of cluster nodes and is required to have at least one entry.
		 */
		private List<String> nodes;

		/**
		 * Maximum number of redirects to follow when executing commands across the
		 * cluster.
		 */
		private Integer maxRedirects;

		public List<String> getNodes() {
			return this.nodes;
		}

		public void setNodes(List<String> nodes) {
			this.nodes = nodes;
		}

		public Integer getMaxRedirects() {
			return this.maxRedirects;
		}

		public void setMaxRedirects(Integer maxRedirects) {
			this.maxRedirects = maxRedirects;
		}

	}
    ..........
        /**
	 * Lettuce client properties.
	 */
	public static class Lettuce {

		/**
		 * Shutdown timeout.
		 */
		private Duration shutdownTimeout = Duration.ofMillis(100);

		/**
		 * Lettuce pool configuration.
		 */
		private Pool pool;

		public Duration getShutdownTimeout() {
			return this.shutdownTimeout;
		}

		public void setShutdownTimeout(Duration shutdownTimeout) {
			this.shutdownTimeout = shutdownTimeout;
		}

		public Pool getPool() {
			return this.pool;
		}

		public void setPool(Pool pool) {
			this.pool = pool;
		}

	}

}
```

可以看到前缀是 spring.redis ，具体配置举例：

+ 其中最简单的string类型

  ```
  spring.redis.host=10.136.100.48
  spring.redis.port=6379
  ```

+ 复杂类型如private Cluster cluster，很简单，进去看Cluster的成员即可，只是注意maxRedirects在application.properties写作：

  ```
  spring.redis.cluster.nodes=10.136.100.48:6379,10.136.100.48:6380,10.136.100.48:6381,10.136.100.49:6379,10.136.100.49:6380,10.136.100.49:6381,10.136.100.50:6379,10.136.100.50:6380,10.136.100.50:6381
  spring.redis.cluster.max-redirects=3
  ```

+ 使用yaml

  ```
  spring:
    #Redis缓存配置(RedisProperties)
    redis:
  #    database: 0
  #    host: localhost
  #    port: 6380
  #    password:
      #timeout: 6000
      #redis cluster
      cluster:
        nodes: 1.1.1.1:6379,1.1.1.1:6380,1.1.1.1:6381
        maxRedirects: 3
      lettuce:
        pool:
          max-active: 200
          max-wait: 3000
          max-idle: -1
          min-idle: 10
  ```

###### 案例分析：

某次项目使用 spring-boot-starter版本为2.0.5

```
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.5.RELEASE</version>
        <relativePath />
    </parent>
```

使用其 spring-boot-starter-data-redis 遇到RedisExcpetion 后来没能重现，不过也能重现出类似的WARN级别信息：

l.c.c.t.ClusterTopologyRefresh^[[m : Unable to connect to xxxx:6379

java.util.concurrent.CompletionException: io.netty.channel.ConnectTimeoutException: connection timed out: /xxxx:6379

经过查阅，client端的RedisConnectionFactory需要增加 ClusterTopologyRefreshOptions  这个option，

```java
    @Autowired
    private RedisProperties redisProperties;
 
    @Value("${redis.maxRedirects:3}")
    private int maxRedirects;
 
    @Value("${redis.refreshTime:5}")
    private int refreshTime;
 
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
 
        RedisClusterConfiguration redisClusterConfiguration = new RedisClusterConfiguration(redisProperties.getCluster().getNodes());
 
        redisClusterConfiguration.setMaxRedirects(maxRedirects);
 
        / / Support adaptive cluster topology refresh and static refresh source
        ClusterTopologyRefreshOptions clusterTopologyRefreshOptions =  ClusterTopologyRefreshOptions.builder()
                .enablePeriodicRefresh()
                .enableAllAdaptiveRefreshTriggers()
                .refreshPeriod(Duration.ofSeconds(refreshTime))
                .build();
 
        ClusterClientOptions clusterClientOptions = ClusterClientOptions.builder()
                .topologyRefreshOptions(clusterTopologyRefreshOptions).build();
 
                 / / From the priority, read and write separation, read from the possible inconsistency, the final consistency CP
        LettuceClientConfiguration lettuceClientConfiguration = LettuceClientConfiguration.builder()
                .readFrom(ReadFrom.SLAVE_PREFERRED)
                .clientOptions(clusterClientOptions).build();
 
        return new LettuceConnectionFactory(redisClusterConfiguration, lettuceClientConfiguration);
    }
```

而实际上为什么这个不提供配置呢，查阅了前面说的官方配置：

https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html

发现实际有这个选项

```
spring.redis.lettuce.cluster.refresh.dynamic-refresh-sources
spring.redis.lettuce.cluster.refresh.period
```

而进一步看到第一个config是在spring boot 2.4.0引入的

https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.4.0-Configuration-Changelog

而第二个period是2.3.0

https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.3.0-Configuration-Changelog

直接搜源码 ClusterTopologyRefreshOptions 确认下：

https://github.com/spring-projects/spring-boot/blob/47516b50c39bd6ea924a1f6720ce6d4a71088651/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/data/redis/LettuceConnectionConfiguration.java

点击blame，找到这行

```
			if (refreshProperties.getPeriod() != null) {
				refreshBuilder.enablePeriodicRefresh(refreshProperties.getPeriod());
			}
```

点击左侧对应的提交：

https://github.com/spring-projects/spring-boot/commit/dfac3a282b98bd480c5acf778dbfbce994051dad

可以看到这次提交的comment：Add configuration to enable Redis Cluster topology refresh      

然后从左上角可以看到是从 [v2.3.0.M4](https://github.com/spring-projects/spring-boot/releases/tag/v2.3.0.M4) 最开始引入的，之后是 v2.3.0.RC1，v2.3.0.RELEASE，直到最新的v2.5.0-RC1



---

REFERENCE:

https://github.com/javastacks/spring-boot-best-practice
https://github.com/YunaiV/SpringBoot-Labs

[给你一份超详细 Spring Boot 知识清单](https://mp.weixin.qq.com/s/1yxsCD3IxopIWYceA54Ayw)

[一站式starter](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-starter)

[About AutoConfig](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-auto-configuration)
Gradually Replacing Auto-configuration
Disabling Specific Auto-configuration Classes
(exclude={DataSourceAutoConfiguration.class})

spring boot 中的 Parent POM 和 Starter 的作用什么
https://cloud.tencent.com/developer/article/1362790

EnvironmentPostProcessor
BeanPostProcessor



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

Create a Custom Auto-Configuration with Spring Boot

https://www.baeldung.com/spring-boot-custom-auto-configuration

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



## 4. Troubleshooting

### BeanDefinitionOverrideException 

https://www.baeldung.com/spring-boot-bean-definition-override-exception

### BeanCurrentlyInCreationException/circular reference

Caused by: org.springframework.beans.factory.BeanCurrentlyInCreationException: Error creating bean with name 'AAAA': Bean with name 'AAAA' has been injected into other beans [BBBB] in its raw version as part of a circular reference, but has eventually been wrapped. This means that said other beans do not use the final version of the bean. This is often the result of over-eager type matching - consider using 'getBeanNamesForType' with the 'allowEagerInit' flag turned off, for example.

解决：加@Lazy

### nohup: ignoring input no main manifest attribute

```
执行 
nohup java -server -jar test.jar > `date +\%F`_funding-rate-datasource_`date +\%H.%M.%S`.log 2>&1
log中内容为：
nohup: ignoring input no main manifest attribute
解决方法，pom增加：
<build>
        <finalName>funding-rate-datasource</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <configuration>
                    <attach>true</attach>
                </configuration>
                <executions>
                    <execution>
                        <phase>compile</phase>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- package -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                </configuration>
            </plugin>
            <!-- deploy -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-deploy-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

