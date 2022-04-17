## 日志系统

Simple Logging Facade for Java (abbreviated SLF4J) – acts as a [facade](https://en.wikipedia.org/wiki/Facade_pattern) for different logging frameworks (e.g. [java.util.logging, logback, Log4j](https://www.baeldung.com/java-logging-intro)). It offers a generic API making the logging independent of the actual implementation.

org.slf4j.Logger是一个规范接口，然后每个三方框架可能都有引入自己的日志系统或者自己的实现,

比如最基础的springframework就有自己的日志系统；

```
<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-starter</artifactId>
				<version>${spring.boot.version}</version>
				<exclusions>
					<exclusion>
						<groupId>ch.qos.logback</groupId>
						<artifactId>logback-classic</artifactId>
					</exclusion>
					<exclusion>
						<groupId>org.springframework.boot</groupId>
						<artifactId>spring-boot-starter-logging</artifactId>
					</exclusion>
				</exclusions>
			</dependency>
```

主程序可以选用：

```
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>
或者
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </dependency>
```



### SLF4J Facade

**Log4j2**

working: [log4j-api](https://search.maven.org/classic/#search|gav|1|g%3A"org.apache.logging.log4j" AND a%3A"log4j-api"), [log4j-core](https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core), 

working with slf4j: [log4j-slf4j-impl](https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-slf4j-impl).(example: spring-boot-starter-log4j2)

The actual logging configuration is adhering to native Log4j 2 configuration

日志配置：

https://www.cnblogs.com/lzb1096101803/p/5796849.html

https://www.jdon.com/48406

https://logging.apache.org/log4j/2.x/manual/layouts.html#PatternLayout

```java
>>springboot application.yml:
logging:
  #以jar包部署运行时,如果需要修改log4j2.yml配置,请开放如下配置,默认log4j2.yml是为生产环境准备的
  #config: file:./config/log4j2.yml
  config: classpath:log4j2.yml	#按顺序优先生效
  level:						#按顺序后生效
    com:
      lyhistory: debug
>>springboot application.properties
logging.config=classpath:log4j2.yml	#按顺序优先生效
logging.level.com.lyhistory=debug		#按顺序后生效

>>log4j2.yml
# 共有8个级别，按照从低到高为：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF。
Configuration:
  status: info	/*日志系统内部日志，The level of internal Log4j events that should be logged to the console. Valid values for this attribute are "trace", "debug", "info", "warn", "error" and "fatal". Log4j will log details about initialization, rollover and other internal actions to the status logger. Setting status="trace" is one of the first tools available to you if you need to troubleshoot log4j.
(Alternatively, setting system property log4j2.debug will also print internal Log4j2 logging to the console, including internal logging that took place before the configuration file was found.)*/
      
  monitorInterval: 30
  Properties: # 定义全局变量
    Property: # 缺省配置（用于开发环境）。其他环境需要在VM参数中指定，如下：
    #测试：-Dlog.level.console=warn -Dlog.level.lyhistory=debug
    #生产：-Dlog.level.console=warn -Dlog.level.lyhistory=info
    - name: log.level.lyhistory
      value: info
    - name: log.level.console
      value: info
    - name: log.path
      value: logs
    - name: project.name
      value: mgr-rest
    - name: log.pattern
      value: "%-d{yyyy-MM-dd HH:mm:ss,SSS}-[%l]-[%p] ${PID:-} %m%n"
  Appenders:
    #控制台
    Console:
      name: CONSOLE
      target: SYSTEM_OUT
#      ThresholdFilter:
#        level: ${sys:log.level.console} # “sys:”表示：如果VM参数中没指定这个变量值，则使用本文件中定义的缺省全局变量值
#        onMatch: ACCEPT
#        onMismatch: DENY
      PatternLayout:
        pattern: ${log.pattern}
    #日志文件
    RollingFile:
    - name: ROLLING_FILE
      fileName: ../${log.path}/${project.name}.log	//日志文件名字
      filePattern: "${log.path}/$${date:yyyy-MM}/${project.name}-%d{yyyy-MM-dd}-%i.log.gz" //压缩方式
      PatternLayout:
        pattern: ${log.pattern}
      Policies:
        TimeBasedTriggeringPolicy:  # 按天分类
          modulate: true
          interval: 1
        SizeBasedTriggeringPolicy:
          size: "128 MB"
      DefaultRolloverStrategy:     # 文件最多100个
        max: 1000

  Loggers:
    Root:	/*默认级别，控制所有业务代码及依赖的输出，除了极少的springFramework的输出，比如
[org.springframework.boot.StartupInfoLogger.logStarting(StartupInfoLogger.java:53)]-[DEBUG]  Running with Spring Boot v2.0.5.RELEASE, Spring v5.0.9.RELEASE*/
      level: info #root的级别为info，如果为debug的话，输出的内容太多
      AppenderRef:
      - ref: CONSOLE
      - ref: ROLLING_FILE
#    Logger:
#    监听具体包下面的日志
#    Logger: # 为com.lyhistory包配置特殊的Log级别,方便调试
#    - name: com.lyhistory
#      additivity: false
#      #level: ${sys:log.level.lyhistory}
#      AppenderRef:
#      - ref: CONSOLE
#      - ref: ROLLING_FILE
```



**Logback**

working: [logback-classic](https://search.maven.org/classic/#search|gav|1|g%3A"ch.qos.logback" AND a%3A"logback-classic").

working with slf4j: nothing need to do, because logback-classic will transitively pull in another two dependencies, the *logback-core* and *slf4j-api*. 

日志配置：https://www.cnblogs.com/EasonJim/p/7801486.html

**outdated log4j**

for log4j2 and logback working with slf4j: SLF4J “sits” on top of the particular logging implementation. Used like this, it completely abstracts away the underlying framework;

but for log4j to working with slf4j, slf4j can be configured as a bridge by using [log4j-over-slf4j](https://search.maven.org/classic/#search|gav|1|g%3A"org.slf4j" AND a%3A"log4j-over-slf4j") ( spring-boot-starter-logging is using log4j-to-slf4j instead)

**jcl**

same as outdated log4j, use [jcl-over-slf4j.](https://search.maven.org/classic/#search|gav|1|g%3A"org.slf4j" AND a%3A"jcl-over-slf4j")

### SLF4J Improvement

log4j `logger.debug(**"Printing variable value: "** + variable);`

vs

slf4j `logger.debug(**"Printing variable value: {}"**, variable);`

Log4j will concatenate *Strings* regardless of *debug* level being enabled or not. In high-load applications, this may cause performance issues. SLF4J will concatenate *Strings* only when the *debug* level is enabled, To do the same with Log4J you need to add extra *if* block which will check if *debug* level is enabled or not:

```
if (logger.isDebugEnabled()) {
    logger.debug("Printing variable value: " + variable);
}
```

但是需要注意的是，如果打印exception stacktrace，一定要保证e不能有占位符！

https://stackoverflow.com/questions/5951209/how-to-log-exception-and-message-with-placeholders-with-slf4j/66019806#66019806

```
String s = "Hello world";
try {
  Integer i = Integer.valueOf(s);
} catch (NumberFormatException e) {
  logger.error("Failed to format {}", s, e);
}
```



## 日志类型

> From log4j-2.9 onward, log4j2 will print all internal logging to the console if system property log4j2.debug is defined (with any or no value).
> https://logging.apache.org/log4j/2.x/faq.html

这些日志默认应该都是输出到终端，至于输出到文件需要配置，然后springboot程序默认会打印到终端，一般我们会对终端日志重定向：

```
 nohup java -server -jar ./latest/$1.jar -XX:+VerifyBeforeGC -XX:+VerifyAfterGC > ./logs/`date +\%F`_${target_arr[-1]}_`date +\%T`.log 2>&1 &
```

注意一个细小的细节，springboot打印到终端的日志并非 完全 跟 我们主程序打印的+主程序dependency的springframework等这些框架打印的日志一致，唯一的差别我看到的 就是这个 springboot banner，应该是system直接print出来的

重定向到文件跟配置日志直接输出到文件的区别是配置输出可以压缩，可以分成不同的日志级别输出到不同文件，但是重定向就无法做到



## 日志级别：

整体依据：《阿里巴巴java开发手册终极版》

> 【推荐】谨慎地记录日志。生产环境禁止输出 debug 日志；有选择地输出 info 日志；如果使 用 warn 来记录刚上线时的业务行为信息，一定要注意日志输出量的问题，避免把服务器磁盘 撑爆，并记得及时删除这些观察日志。 说明：大量地输出无效日志，不利于系统性能提升，也不利于快速定位错误点。记录日志时请 思考：这些日志真的有人看吗？看到这条日志你能做什么？能不能给问题排查带来好处
>

INFO/info 业务代码，基本输入输出记录，比如收到一条kafka消息，计算完发送kafka消息或websocket，不记录中间计算过程

DEBUG/debug	调试程序相关的信息，比如计算步骤内部信息

WARN/warn	空数据或者非法数据，可能会出现潜在错误的信息

TRACE/trace（可选）  更详细的debug信息，比如每一步的调试信息或者步骤计时信息后者其他数据量比较大的输出信息 finest debug steps and large volume of data output

ERROR/error 处理异常,不允许记录日志后又抛出异常，因为这样会多次记录日志，只允许记录一次日志,异常信息应该包括两类信息：案发现场信息和异常堆栈信息。

Fatal (dropped)

不允许出现System print(包括System.out.println和System.error.println)语句。
不允许出现printStackTrace。



关于info和debug：

例子1：

```java

public void sendMsg(Info msg, String topic, Integer partition, Producer<Object, Object> producer){
	...
    logger.info("Topic:"+topic+",Partition:"+partition+"; Kafka Message send success!");
}

修改建议：
这个方法很多地方调用，比如计算完XXX，返回给scheduler response等等，但是现在log的结果是：Topic:T-TEST,Partition:0,Value:{....}; Kafka Message send success!
通过log追查问题的时候这种log会比较麻烦，因为从这一行看不出这条信息具体是做什么的，信息量不够，建议先写这条信息的目的，再将
Topic:T-TEST,Partition:0,Value:{....}附上，比如：
finished ****; send message: Topic:T-TEST,Partition:0,Value:{....}
finished ****; send response: Topic:T-TEST2,Partition:0,Value:{....}

```

例子2：

```java
private void calculate(){
	 logger.info("calculate fee , id : " + id + ", calculate 1 start");
	 logger.info("calculate fee , id : " + id + ", consumed " + Time + " ms");
}

修改建议：
1. 这种一步步调试信息，使用debug或者trace而不是业务信息info
2. 建议deubg级别日志使用占位符形式输出，比如
    logger.debug("Processing *** with id: {} and symbol : {} ", id, symbol); 
```



关于warn和error：

例子1：

```java
public void parse() {
    if (seq == null) {
        logger.error("seq=null");
        return;
    }
public void calculate(){
	if (checknull) {
    	logger.error("calculate id is null");
    	return;
        }
    
修改建议：以上空数据或非法数据建议使用warn而不是error, "error 级别只记录系统逻辑出错、异常等重要的错误信息。如非必 要，请不要在此场景打出 error 级别。 "
```

例子2：

```java
public void test() {
    try {....
    } catch (IOException e) {
        logger.error("IOException", e);
    }

修改建议：异常信息应该包括两类信息：案发现场信息和异常堆栈信息：
logger.error("test"+ "_" + e.getMessage(),e);

```

例子3：

```java
try{
    // do something
}catch(Exception e){
    LOGGER.error(e.getMessage(), e);
    throw new Exception("error");
}
    
修改建议：不允许记录日志后又抛出异常，因为这样会多次记录日志，只允许记录一次日志
```





## 最佳实践，参考《阿里巴巴java开发手册终极版1.3.0》

```
1. 【强制】应用中不可直接使用日志系统（Log4j、Logback）中的 API，而应依赖使用日志框架 SLF4J 中的 API，使用门面模式的日志框架，有利于维护和各个类的日志处理方式统一。 import org.slf4j.Logger;  import org.slf4j.LoggerFactory;  private static final Logger logger = LoggerFactory.getLogger(Abc.class);  
2. 【强制】日志文件推荐至少保存 15 天，因为有些异常具备以“周”为频次发生的特点。 
3. 【强制】应用中的扩展日志（如打点、临时监控、访问日志等）命名方式： appName_logType_logName.log。logType:日志类型，推荐分类有 stats/desc/monitor/visit 等；logName:日志描述。这种命名的好处：通过文件名就可知 道日志文件属于什么应用，什么类型，什么目的，也有利于归类查找。 
正例：mppserver 应用中单独监控时区转换异常，如：                                 mppserver_monitor_timeZoneConvert.log 说明：推荐对日志进行分类，如将错误日志和业务日志分开存放，便于开发人员查看，也便于 通过日志对系统进行及时监控。 
4. 【强制】对 trace/debug/info 级别的日志输出，必须使用条件输出形式或者使用占位符的方 式。 说明：logger.debug("Processing trade with id: " + id + " and symbol: " + symbol); 如果日志级别是 warn，上述日志不会打印，但是会执行字符串拼接操作，如果 symbol 是对象， 会执行 toString()方法，浪费了系统资源，执行了上述操作，最终日志却没有打印。 正例：（条件） if (logger.isDebugEnabled()) {    logger.debug("Processing trade with id: " + id + " and symbol: " + symbol);   }       正例：（占位符） logger.debug("Processing trade with id: {} and symbol : {} ", id, symbol);  
5. 【强制】避免重复打印日志，浪费磁盘空间，务必在 log4j.xml 中设置 additivity=false。
 正例：<logger name="com.taobao.dubbo.config" additivity="false">  
6. 【强制】异常信息应该包括两类信息：案发现场信息和异常堆栈信息。如果不处理，那么通过 关键字 throws 往上抛出。 正例：logger.error(各类参数或者对象 toString + "_" + e.getMessage(), e); 
7. 【推荐】谨慎地记录日志。生产环境禁止输出 debug 日志；有选择地输出 info 日志；如果使 用 warn 来记录刚上线时的业务行为信息，一定要注意日志输出量的问题，避免把服务器磁盘 撑爆，并记得及时删除这些观察日志。 说明：大量地输出无效日志，不利于系统性能提升，也不利于快速定位错误点。记录日志时请 思考：这些日志真的有人看吗？看到这条日志你能做什么？能不能给问题排查带来好处？ 
8. 【参考】可以使用 warn 日志级别来记录用户输入参数错误的情况，避免用户投诉时，无所适 从。注意日志输出的级别，error 级别只记录系统逻辑出错、异常等重要的错误信息。如非必 要，请不要在此场景打出 error 级别。 
```

第一点的意思是采用实现了slf4j接口的实现，这样以后切换日志系统比较容易，因为只要是实现了slf4j的日志系统都是兼容的



---

reference:

https://www.baeldung.com/slf4j-with-log4j2-logback

https://www.baeldung.com/java-logging-intro

<disqus/>