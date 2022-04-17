---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《玩转mybatis》

三种方式教你玩转mybatis的各种姿势，再也不怕各种config注解错误！

首先还是引用官方mybatis有什么好处吧：
> MyBatis is an open source, lightweight, persistence framework. It is an alternative to JDBC and Hibernate. It automates the mapping between SQL databases and objects in Java, .NET, and Ruby on Rails. The mappings are decoupled from the application logic by packaging the SQL statements in XML configuration files.
> It abstracts almost all of the JDBC code, and reduces the burden of setting of parameters manually and retrieving the results. It provides a simple API to interact with the database. It also provides support for custom SQL, stored procedures and advanced mappings.
> It was formerly known as IBATIS, which was started by Clinton Begin in 2002. MyBatis 3 is the latest version. It is a total makeover of IBATIS.
> A significant difference between MyBatis and other persistence frameworks is that MyBatis emphasizes the use of SQL, while other frameworks such as Hibernate typically uses a custom query language i.e. the Hibernate Query Language (HQL) or Enterprise JavaBeans Query Language (EJB QL).

> MYBATIS offers the following advantages −
> Supports stored procedures − MyBatis encapsulates SQL in the form of stored procedures so that business logic can be kept out of the database, and the application is more portable and easier to deploy and test.
> Supports inline SQL − No pre-compiler is needed, and you can have the full access to all of the features of SQL.
> Supports dynamic SQL − MyBatis provides features for dynamic building SQL queries based on parameters.
> Supports O/RM − MyBatis supports many of the same features as an O/RM tool, such as lazy loading, join fetching, caching, runtime code generation, and inheritance.

以下所有code均在私人repository: https://github.com/lyhistory/learn_coding/tree/master/java/Components/mybatis-demo

## 1. 最基本的使用方法
https://mybatis.org/mybatis-3/getting-started.html
https://www.tutorialspoint.com/mybatis/index.htm

** step 1. 依赖**

```
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.4.5</version>
</dependency>
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>8.0.15</version>
</dependency>
```

** step 2. 配置config datasource and config mapper**

mybatis-config.xml:
```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://127.0.0.1/test?characterEncoding=utf-8&amp;autoReconnect=true&amp;useSSL=false&amp;serverTimezone=Singapore"/>
        <property name="username" value="dbuser"/>
        <property name="password" value="password"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="mybatis/mapping/StudentMapper.xml"/>
  </mappers>
</configuration>	
```

StudentMapper.xml
```
<?xml version = "1.0" encoding = "UTF-8"?>

<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
	
<mapper namespace = "com.lyhistory.mybatis.StudentMapper">

   <insert id = "insert" parameterType = "com.lyhistory.mybatis.table.StudentTable" useGeneratedKeys="true">
   	  <selectKey resultType="int" keyProperty="id" order="AFTER">
            SELECT LAST_INSERT_ID()
      </selectKey>
      INSERT INTO student (NAME, BRANCH, PERCENTAGE, PHONE, EMAIL ) VALUES (#{name}, #{branch}, #{percentage}, #{phone}, #{email})
   </insert>
    	
</mapper>
```
mapper.xml:注意Mapped Statements类型不要用错，比如mapper namespace, parameterType，resultMaps

> Mapper XML is an important file in MyBatis, which contains a set of statements to configure various SQL statements such as select, insert, update, and delete. These statements are known as Mapped Statements or Mapped SQL Statements.


** step 3. 调用 **
```
Reader reader = Resources.getResourceAsReader("mybatis/config/mybatis-config.xml");
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
		SqlSession session = sqlSessionFactory.openSession();

StudentTable student = new StudentTable("LY", "LYHISTORY.COM", 80, 88888888, "LYHISTORY@gmail.com");

session.insert("com.lyhistory.mybatis.StudentMapper.insert", student);
System.out.println("record inserted successfully"); session.commit();
session.close();
```

## 2.集成Springboot

基本有两种方式：使用mybatis-spring或者用mybatis-spring-boot-starter，
前者需要自定义mybatis config和scanner，后者starter已经都做好了，基本只需要配置，如果需要自定义需要严格按照文档来，不然会出现各种问题；

先创建一个spring boot程序，首先添加依赖
```
<!-- integrate with spring boot -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
	<version>2.1.4.RELEASE</version>
</dependency>

<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid</artifactId>
	<version>1.1.10</version>
</dependency>
```

然后删除mybatis-config.xml里面的配置-mapper及db Connection，因为我们要采用auto mapper，并且用jdbc或者mybatis-starter的auto config spring.datasource的方式读取db配置；

### 2.1 使用mybatis-spring

添加依赖：
```
<!--Method 1 Mybatis Spring -->
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.4.5</version>
</dependency>
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis-spring</artifactId>
	<version>1.3.1</version>
</dependency>
```

application.properties:
```
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1/test?characterEncoding=utf-8&autoReconnect=true&useSSL=false&serverTimezone=Singapore
spring.datasource.username=user
spring.datasource.password=password
```

自定义MyBatisConfiguration
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
    	datasource.setMaxActive(20);
    	datasource.setMinIdle(5);
        return datasource;
    }
	
	@Bean(name = {"sqlSessionFactory"})
	@ConditionalOnMissingBean(name = {"sqlSessionFactory"})
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
			
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setTypeAliasesPackage("com.lyhistory.mybatis.table");
		sqlSessionFactoryBean.setConfigLocation(new ClassPathResource("mybatis/config/mybatis-config.xml"));
		sqlSessionFactoryBean.setMapperLocations(
				(new PathMatchingResourcePatternResolver()).getResources("classpath*:mybatis/mapping/*_spring.xml"));
		return sqlSessionFactoryBean.getObject();
	}
}
```
然后自定义MapperScanner
```
@Configuration
@AutoConfigureAfter(MyBatisConfiguration.class)
public class MyBatisMapperScannerConfig {

	@Bean(name = "MapperScannerConfigurer")
	public MapperScannerConfigurer mapperScannerConfigurer() {
		MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
		mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
		mapperScannerConfigurer.setBasePackage("com.lyhistory.mybatis.springboot.mybatis_spring");
		return mapperScannerConfigurer;
	}
}
```

发现无法读取
@Value("${spring.datasource.driverClassName}")
private String jdbcDriverClassName;

所以需要resolve config spring.datasource.\* in application.properties，添加jdbc starter依赖,
不然因为我们配置了application.properties或者ymal的spring.datasource，会引起报错 Spring Security : java.lang.ClassNotFoundException: org.springframework.dao.support.DaoSupport
不得不感叹spring boot太智能了！

```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-jdbc</artifactId>
	<version>2.1.4.RELEASE</version>
</dependency>
```
这个jdbc starter用org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration和DataSourceProperties来从配置文件读取装配spring.datasource

StudentMapper.xml跟前面类似，只是因为我们改成了@Mapper interface，所以xml里面的mapper namespace相应改下即可

### 2.2 使用mybatis starter

offical intruction: http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/

添加依赖：
```
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>2.1.1</version>
</dependency>
```
而且可以删除前面的jdbc依赖，因为这个starter已经引入了spring-boot-starter-jdbc

application.properties:
```
mybatis.mapper-locations=classpath*:mybatis/mapping/*_starter.xml
```
StudentMapper.xml跟前面类似

默认不需要自定义mybatis mapper config和scanner，因为mybatis starter已经默认在autoconfigure实现了，全在org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration里面，
顺便学习下人家的依赖顺序定义
```
@org.springframework.context.annotation.Configuration
@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class })
@ConditionalOnBean(DataSource.class)
@EnableConfigurationProperties(MybatisProperties.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
public class MybatisAutoConfiguration {
```
可以看到是先等待@AutoConfigureAfter(DataSourceAutoConfiguration.class)，DataSourceAutoConfiguration就是jdbc根据配置初始化的类；

## 3.troubleshooting

?# mybatis java.lang.NullPointerException: nullat java.util.concurrent.ConcurrentHashMap.putVal(C

solved：极有可能是连不上db

?# Autowired的Mapper是null:

solved： 创建restController，在service中autowired，原因：
> 在SpringMVC框架中，我们经常要使用@Autowired注解注入Service或者Mapper接口，我们也知道，在controller层中注入service接口，在service层中注入其它的service接口或者mapper接口都是可以的，但是如果我们要在我们自己封装的Utils工具类中或者非controller普通类中使用@Autowired注解注入Service或者Mapper接口，直接注入是不可能的，因为Utils使用了静态的方法，我们是无法直接使用非静态接口的，当我们遇到这样的问题，我们就要想办法解决了。
> https://blog.csdn.net/qiulingxin/article/details/78068314

?# The @ConfigurationProperties annotation injects null values when decorates a @Bean method in a @Configuration class
https://github.com/micronaut-projects/micronaut-spring/issues/19
https://www.bbsmax.com/A/B0zqgpZr5v/

---

ref：

The Multiple DataSource Demo for MyBatis Spring Boot  
https://github.com/kazuki43zoo/mybatis-spring-boot-multi-ds-demo
https://github.com/mybatis/spring-boot-starter/issues/78

spring(boot) mybatis整合
https://www.cnblogs.com/liliqiang/articles/8723490.html

SpringBoot整合mybatis的mybatis-spring的配置方式
https://my.oschina.net/bianxin/blog/1602958

@ConfigurationProperties 注解使用姿势，这一篇就够了
https://www.cnblogs.com/jimoer/p/11374229.html

Resolving “Failed to Configure a DataSource” Error

By design, Spring Boot auto-configuration tries to configure the beans automatically based on the dependencies added to the classpath.
https://www.baeldung.com/spring-boot-failed-to-configure-data-source


Guide to @ConfigurationProperties in Spring Boot
https://www.baeldung.com/configuration-properties-in-spring-boot

SpringBoot中DataSource配置@ConfigurationProperties注解的坑
https://www.jianshu.com/p/8ebf0b51538d


<disqus/>