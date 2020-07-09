org.slf4j.Logger是一个规范接口，然后每个三方框架可能都有引入自己的日志系统或者自己的实现,

比如最基础的springframework就有自己的日志系统；

最佳实践，参考《阿里巴巴java开发手册终极版1.3.0》

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

第一点的意思是采用实现了slf4j接口的实现，这样以后切换日志系统比较容易，因为只要是实现了slf4j的日志系统都是兼容的，比如

```MAVE
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



这些日志都是写入到磁盘文件，然后springboot程序默认会打印到终端，一般我们会对终端日志重定向：

```
 nohup java -server -jar ./latest/$1.jar -XX:+VerifyBeforeGC -XX:+VerifyAfterGC > ./logs/`date +\%F`_${target_arr[-1]}_`date +\%T`.log 2>&1 &
```

注意一个细小的细节，springboot打印到终端的日志并非 完全 跟 我们主程序打印的+主程序dependency的springframework等这些框架打印的日志一致，唯一的差别我看到的 就是这个 springboot banner，应该是system直接print出来的



log4j log4j2 slf4j logback?

https://examples.javacodegeeks.com/enterprise-java/log4j/log4j-rootlogger-example/

```
From log4j-2.9 onward, log4j2 will print all internal logging to the console if system property log4j2.debug is defined (with any or no value).
https://logging.apache.org/log4j/2.x/faq.html
```

