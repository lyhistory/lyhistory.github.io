---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《java实用基础》

## 1.Install 
Jdk vs Openjdk

https://www.oracle.com/technetwork/java/javase/downloads/index.html
archive
https://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html

Runtime source: rt.jar	/java/jre18XXX/lib

UBUNTU
```
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jdk
apt-cache search jdk
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
export PATH=$PATH:$JAVA_HOME/bin
java -version
```

No compiler is provided in this environment. Perhaps you are running on a JRE rather than a JDK? 
https://stackoverflow.com/questions/19655184/no-compiler-is-provided-in-this-environment-perhaps-you-are-running-on-a-jre-ra

## 2.Tools&IDE

### 2.1 Decompiler
Reverse class to view code http://java-decompiler.github.io/
分析JVM	
JVisualVM https://www.cnblogs.com/xifengxiaoma/p/9402497.html
Java ServiceabilityAgent(HSDB)使用和分析
https://liuzhengyang.github.io/2017/05/27/serviceabilityagent/

### 2.2 Cmdline 
https://stackoverflow.com/questions/19843096/how-to-debug-a-java-application-without-access-to-the-source-code/58555431#58555431
https://stackoverflow.com/questions/3668379/use-a-jar-with-source-as-source-for-jdb/58603802#58603802
java -cp vs java -jar
https://stackoverflow.com/questions/11922681/differences-between-java-cp-and-java-jar
基本区别就是，如果jar包，比如springboot的包将依赖都已经打入了META-INF，则用-jar，否则如果需要依赖外部的lib，则需要用cp指定classpath
java -server -jar *.jar
java程序启动参数-D含义详解 https://www.cnblogs.com/grefr/p/6087955.html
Jdb
https://stackoverflow.com/questions/20018866/specifying-sourcepath-in-jdb-what-am-i-doing-wrong

Debug jar file

~~-sourcepath -classpath com.quantdo.framework.websocket.WebSocketApplication
java -jar -agentlib:jdwp=transport=dt_shmem,address=jdbconn,server=y,suspend=n C:\Workspace\EclipseWorkspace\quantdo-websocket\quantdo-websocket.jar
jdb -attach jdbconn
jdb -sourcepath BOOT-INF/classes/ -classpath . org.springframework.boot.loader.JarLauncher~~

```

jdb -sourcepath BOOT-INF/classes/ -classpath .;BOOT-INF/classes/
stop at com.quantdo.framework.websocket.endpoint.GeneralWebSocketEndpoint:54
stop at com.quantdo.framework.websocket.handler.DefaultWebSocketMessageHandler:32
stop in DefaultWebSocketMessageHandler.receiveMessage
stop in com.quantdo.framework.websocket.endpoint.GeneralWebSocketEndpoint.onMessage
stop in com.alibaba.fastjson.parser.JSONLexerBase.scanString
	  public final void scanString() {
	  public String scanString(char expectNextChar) {
stop at com.alibaba.fastjson.parser.JSONLexerBase:880
run org.springframework.boot.loader.JarLauncher

jdb -sourcepath BOOT-INF/classes/ -classpath .;BOOT-INF/classes/;BOOT-INF/lib/
	stop at com.quantdo.framework.cache.autoconfigure.support.WebsocketMessageListener:35
	stop at org.springframework.data.redis.listener.RedisMessageListenerContainer:968
	stop at com.quantdo.framework.websocket.endpoint.GeneralWebSocketEndpoint:54
stop at com.quantdo.framework.websocket.handler.DefaultWebSocketMessageHandler:32
stop at com.alibaba.fastjson.parser.JSONLexerBase:880
run org.springframework.boot.loader.JarLauncher

next
cont
step up
step out
locals
print 
where
where all
list
threads
thread <THREADID>

```
![测试例子](/docs/docs_image/software/java/java01.png)

Refer:
https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jdb.html
http://hengyunabc.github.io/spring-boot-application-start-analysis/
https://www.oschina.net/question/1263216_2267259
https://blog.csdn.net/arkblue/article/details/39718947
https://www.bilibili.com/read/cv1844967/

### 2.3 IDE
Eclipse/STS 
Project Explorer-> Projects Presentation (select hierarchy)

#### 2.3.1 Folder structure
**About resources folder
Missing resources: manually create resources folder in src/main, and then Manve->update project
src/main/resources https://stackoverflow.com/questions/18875635/cant-access-files-from-src-main-resources-via-a-test-case

New Maven project -> Tick "Create a simple project(skip archetype selection) [auto create resource folder]
https://stackoverflow.com/questions/49351806/eclipse-adds-an-exclusion-pattern-of-to-src-main-resources-how-to-read-a-res

**Missing src/test/java
manual add in file system, then in java build path, remove first, then Add Folder

#### 2.3.2 compiler
**default compiler & project build path & runtime/debug JRE& compiler compliance
Set project compiler compliance settings to 1.7 Set project JRE build path entry to 'JavaSE-1.7' https://docs.infor.com/help_m3_coreit_13.4/index.jsp?topic=%2Fcom.lawson.help.administration%2Fcom.lawson.help.makag-w_10.1.2%2FL157071229479555.html

java->Compiler/Installed JREs

run config-> maven build->maven debug-> jre

show jdk version that maven dependent on: mvn -version

#### 2.3.3 Debug
**基本debug技巧**
1）调试依赖比如maven dependencies的时候，注意在eclipse里面设置断点有可能不生效，因为debugger view下会有很多空行，技巧是多设置一些断点，调试起来之后再在debugger view下设置断点
2）比如pom.xml在eclipse里面可以查看Dependency hierarchy view，可以比较清晰的看到所有依赖的层级关系

**Remote Debug(attach jar)**
https://stackoverflow.com/questions/6855520/attach-debugger-to-application-using-eclipse/23297651
Debug Configurations: 
	Remote Java Application->Connect: Remote Host & Port 
	&
	Remote Java Application->Source: Add Source code (& dependencies sourcecode if needed)
then Start jar and expose port:
java -Xdebug -Xrunjdwp:transport=dt_socket,address=127.0.0.1:8008,server=y,suspend=y -jar target\test.jar

For remote debug war hosting in remote tomcat:
vim /etc/tomcat/tomcat.conf
JAVA_OPTS or CATALINA_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=10001,server=y,suspend=n"
Failed using port 8000

For mvn project another way can be found in Maven->debug below

**Debug into jar without sourcecode using decompiler**
My original post
https://stackoverflow.com/questions/58534925/eclipse-not-decompile-rt-jar-when-debugging-but-idea-does/58535553#58535553

手动方式：
	可以先手动decompile出来，然后再添加
	![add source path](/docs/docs_image/software/java/java02.png)
自动方式：
	For eclipse install:
	Enhanced Class Decompiler https://ecd-plugin.github.io/ecd/ or jd plugin http://java-decompiler.github.io/
		Haven’t try another one Bytecode Visualizer https://www.crowdstrike.com/blog/native-java-bytecode-debugging-without-source-code/
	For intellj idea, it’s auto;

**Run and Debug external jar without sourcecode**

RUN external jar in eclipse:
Program-> create -> Locatoin:jdk/java.exe Argument:-jar XXX.jar

DEBUG:
But how to debug ? can try woring with jdb.exe
https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jdb.html
https://stackoverflow.com/questions/19843096/how-to-debug-a-java-application-without-access-to-the-source-code/58555431#58555431

run jar with:
java -jar -agentlib:jdwp=transport=dt_shmem,address=jdbconn,server=y,suspend=n C:\Workspace\EclipseWorkspace\test.jar
then debug in eclipse:
Program-> create -> Locatoin:jdk/jdb.exe Argument:-attach jdbconn

#### 2.3.4 其他
Install new software/ marketpalce 如果报错
![](/docs/docs_image/software/java/java03.png)

---

## 3.Project Management Framework

### 3.1 Gradle
todo Refer to Project:alpha-wallet

### 3.2 MAVEN

#### 3.2.1 Install 

manual:
http://maven.apache.org/download.cgi
https://www.mkyong.com/maven/how-to-install-maven-in-windows/
https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html

MAVEN_HOME:C:\dev\maven\apache-maven-3.6.1\bin\
JAVA_HOME:C:\Java\jdk1.6.0\
PATH=...%MAVEN_HOME/bin;%JAVA_HOME%/bin
自定义startup script： mvn.bat/mvn.cmd
```
@REM ==== START VALIDATION ====
set JAVA_HOME=C:\PROGRA~1\Java\jdk1.6.0_45
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo ERROR: JAVA_HOME not found in your environment.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto chkMHome
```
auto: choco install maven

特殊情况下比如研究测试旧版本的漏洞，需要降级maven和对应的jdk，可以利用Maven toolchain
https://maven.apache.org/guides/mini/guide-using-toolchains.html
在.m2/resposity下面建立toolchains.xml
```
<?xml version="1.0" encoding="UTF8"?>
<toolchains>
  <toolchain>
    <type>jdk</type>
    <provides>
      <version>1.6</version>
      <vendor>sun</vendor>
    </provides>
    <configuration>
       <jdkHome>C:\Program Files\Java\jdk1.6.0_45</jdkHome>
    </configuration>
  </toolchain>
</toolchains>
```

Generate project
mvn archetype:generate https://kafka.apache.org/22/documentation/streams/tutorial
https://stackoverflow.com/questions/31720328/maven-not-downloading-dependencies-in-eclipse
https://stackoverflow.com/questions/19655184/no-compiler-is-provided-in-this-environment-perhaps-you-are-running-on-a-jre-ra

Build a Java app with Maven https://jenkins.io/doc/tutorials/build-a-java-app-with-maven/

#### 3.2.2 POM 
https://maven.apache.org/guides/introduction/introduction-to-the-pom.html
https://maven.apache.org/guides/introduction/introduction-to-profiles.html
m2 repository
C:\Users\lyhistory\.m2\repository

Project Inheritance vs Project Aggregation
Project Interpolation and Variables
Guide to creating assemblies https://maven.apache.org/guides/mini/guide-assemblies.html

https://search.maven.org/

?#.Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:2.12:test (default-test) on project. 
https://stackoverflow.com/questions/36427868/failed-to-execute-goal-org-apache-maven-pluginsmaven-surefire-plugin2-12test

?#.invalid LOC header (bad signature)/repo.maven.apache.org: Unknown host repo.maven.apache.org/Maven install error: Dependency could not be resolved
1.	Delete \.m2\repository\org\apache\maven
2.	mvn dependency:resolve -X

#### 3.2.3 Lifecycle
https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html
Maven -> Update Projects
Maven package
ethereumj-core maven package https://github.com/ethereum/ethereumj/issues/1018

mvn clean build 
mvn clean install -P<profileName> 

https://gerardnico.com/maven/bin
Unsupported major.minor version 52.0 https://blog.csdn.net/qq_36769100/article/details/78880341
打包
maven 生成可执行jar并使用shell脚本运行 https://blog.csdn.net/hg_harvey/article/details/79076939
Maven打包的三种方式 https://blog.csdn.net/daiyutage/article/details/53739452

Maven 发布deploy到remote/internal repository
https://maven.apache.org/guides/introduction/introduction-to-repositories.html
https://maven.apache.org/plugins/maven-deploy-plugin/usage.html

Dependencies show in file icon
https://stackoverflow.com/questions/45291243/maven-dependency-jar-file-displayed-as-folder-icon/45291377
Set mvn version in eclipse: Preferences->Maven->Installations

?#issues: maven unknown lifecycle phase exec
Don’t use powershell , use cmd instead!!!!!!!https://stackoverflow.com/questions/7576265/maven-exec-plugin-throws-exception-for-no-apparent-reason

#### 3.2.4 Remote Debug

前面已经提到了很多debug方式包括远程调试，这里maven还有自己的特有方式：
https://maven.apache.org/surefire/maven-surefire-plugin/examples/debugging.html

命令行执行: mvnDebug -DforkCount=0 test
然后在ECLIPSE: Debug Configuration->Remote Java Application->maven surfire->Connect(Remote IP&Port)&Source

Haven’t solve, why mvn -Dmaven.surefire.debug test not working?
With , maybe because of using powershell, should try cmd instead
https://www.cnblogs.com/sylvia-liu/articles/4685130.html

## 4.JAVA TUTORIAL
https://github.com/lyhistory/java-learn?organization=lyhistory&organization=lyhistory
https://github.com/lyhistory/learn_coding

### 4.1 JAVA BASICS
List:
Design Note – There is no setter method for a List property. The getter returns the List by reference. An item can be added to the List returned by the getter method using an appropriate method defined on java.util.List. Rationale for this design in JAXB 1.0 was to enable the implementation to wrapper the list and be able to perform checks as content was added or removed from the List.

DateTime:
SimpleDateFormat https://dzone.com/articles/java-simpledateformat-guide
1384171247000+0800 https://blog.csdn.net/mingtianhaiyouwo/article/details/51336576
http://tutorials.jenkov.com/java-date-time/index.html#java-7-date-time-api

localdate calendar
https://stackoverflow.com/questions/21242110/convert-java-util-date-to-java-time-localdate
https://beginnersbook.com/2017/10/java-8-calculate-days-between-two-dates/
https://www.mkyong.com/java/java-how-to-add-days-to-current-date/

Number scale precision
https://www.baeldung.com/java-round-decimal-number

SortedDictionary treemap https://stackoverflow.com/questions/4621464/whats-the-equivalent-to-a-net-sorteddictionary-in-java

java parameter default value
https://stackoverflow.com/questions/997482/does-java-support-default-parameter-values

Java8 lambda expression, functional programming
https://rodrigouchoa.wordpress.com/2014/09/10/java-8-lambda-expressions-tutorial/

Stream 
Distinct https://howtodoinjava.com/java8/java-stream-distinct-examples/
https://stackoverflow.com/questions/42578210/filter-stream-with-values-from-another-stream

future
https://www.baeldung.com/java-future

Java serialization algorithm
https://www.javaworld.com/article/2072752/the-java-serialization-algorithm-revealed.html

### 4.2 JAVA ADVANCE
Functional reference
Functional Interfaces https://www.baeldung.com/java-8-functional-interfaces
https://www.codementor.io/eh3rrera/using-java-8-method-reference-du10866vx
https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-use-Javas-functional-Consumer-interface-example

#### 4.2.1 Concurrency handling

**method 1:Multi-thread** 

There is a new computeIfAbsent API introduced in Java 8. The javadocs for ConcurrentHashMap's impelementation of it state:
> The entire method invocation is performed atomically, so the function is applied at most once per key. 
> Some attempted update operations on this map by other threads may be blocked while computation is in progress, 
> **so the computation should be short and simple, and must not attempt to update any other mappings of this map**.
Conditional thread safe 
https://www.ibm.com/developerworks/java/library/j-jtp07233/index.html

Forkjoinpool
![](/docs/docs_image/software/java/java04.png)

ParallelStream的实现原理——ForkJoin线程池框架
http://tangxiaolin.com/learn/show?id=402881d2651d1bdf01651e51d8f80001
Java 并发编程笔记：如何使用 ForkJoinPool 以及原理
http://blog.dyngr.com/blog/2016/09/15/java-forkjoinpool-internals/
http://blog.nigol.cz/java-8-dont-be-afraid-of-streams.html
https://www.cnblogs.com/shijiaqi1066/p/4631466.html

聊聊并发（八）——Fork/Join 框架介绍 https://www.infoq.cn/article/fork-join-introduction/
分析jdk-1.8-ForkJoinPool实现原理 https://www.jianshu.com/p/44b09f52a225
https://blog.csdn.net/dweizhao/article/details/73480025

**method 2: Single thread queue - Disruptor**
LMAX DisruptorHigh Performance Inter-Thread Messaging Library 
https://lmax-exchange.github.io/disruptor/
http://lmax-exchange.github.io/disruptor/files/Disruptor-1.0.pdf
https://github.com/LMAX-Exchange/disruptor/wiki/Getting-Started


#### 4.2.2 JNI
Interface Definition Language IDL
https://www.ejbtutorial.com/corba/interface-definition-language-idl-hello-world-tutorial-with-java-and-c

https://www.baeldung.com/jni
https://www.jianshu.com/p/c708c2602db0
https://www3.ntu.edu.sg/home/ehchua/programming/java/JavaNativeInterface.html

采坑：
1）maven打包dll和so的时候会默认更改文件，所以加了pom过滤，我是直接用获取路径，动态添加路径到system path，再loadlibrary
Can't load this .dll (machine code=0xbd) on a AMD 64-bit platform

https://stackoverflow.com/questions/38244970/running-my-generated-jar-yields-cant-load-this-dll-machine-code-0xbd-on-a
https://stackoverflow.com/questions/19500458/maven-resource-binary-changes-file-size-after-build/24282250#24282250
https://blog.csdn.net/azrael6619/article/details/83761225
https://stackoverflow.com/questions/1403788/java-lang-unsatisfiedlinkerror-no-dll-in-java-library-path
https://www.imooc.com/article/14702

2）jni调用的时候有个大坑，native函数所在的class包名必须跟c++那边的包名一致，否则会报unsatifisfield错误
https://blog.csdn.net/xiaoyaoerxing/article/details/80461015
https://www.cnblogs.com/harrymore/p/10570284.html

3）java, c++联调debug
https://www.cnblogs.com/yejg1212/archive/2013/06/07/3125392.html
C++ ide attach javaw

## 5.JAVA framework

### 5.1 Reactive and Streaming Framework
(java8 stream is only for Collections, means that the input is fixed collections, not realtime stream, after processed, the input cannot be changed )
Reactive framework: Akka, Vert.x, Java 9 “Flow” API, spring flux

> 通常，我们写服务器处理模型的程序时，有以下几种模型：
> 
> (1)每收到一个请求，创建一个新的进程，来处理该请求；
> (2)每收到一个请求，创建一个新的线程，来处理该请求；
> (3)每收到一个请求，放入一个事件列表，让主进程通过非阻塞I/O方式来处理请求
> 
> 上面的几种方式，各有千秋，
> 第(1)中方法，由于创建新的进程的开销比较大，所以，会导致服务器性能比较差,但实现比较简单。
> 第(2)种方式，由于要涉及到线程的同步，有可能会面临死锁等问题。
> 第(3)种方式，在写应用程序代码时，逻辑比前面两种都复杂。
> 综合考虑各方面因素，一般普遍认为第(3)种方式是大多数网络服务器采用的方式
> https://blog.csdn.net/m0_37886429/article/details/78292300

Non-blocking React 对应于blocking servlet，举例餐厅比喻web应用，传统的blocking做法是，有个http pool（.net的http handler或java的servlet），pool就是一个工作组，工作组里的每个服务员都是处理线程，当一个客人即web request进来时，餐厅立马分配一个服务员给这个客户，全程服务，直到客人离开（http response或者websocket断开连接），整个过程中这个服务员是被独占的，所以是阻塞式；而假设换一种做法，类似于nodejs和netty的event loop单线程处理方式，餐厅只请一个服务员，第一个客人过来之后，服务员过来安排座位，记下菜单，然后发送给后厨，然后同时第二个客人来了，服务员立马过去做同样的事情，因为是非阻塞式的，在后厨做好饭，服务员端给第一个客人之前，服务员可以利用空余时间去服务其他客人，比如刚才的场景，或者其他服务员要加餐等等，这就是所谓的java响应式编程；
可能有人会疑惑具体什么机制让单线程可以处理并发，很多人之前还以为只有多线程才能产生并发，换个问题：单核时代是如何实现的并发，并发是个宏观的概念，单核微观上同一个时刻只可能处理一个task，只是其他线程在排队等待，然后分片迅速切换，所以nodejs的单线程也是一样的办法，进行排队；再进一步上升到架构角度看，架构中采用message queue的方式也是一种排队处理的扩展方式，下游可以增加多个消费者；
这里多引入一个问题，如果是多线程，还可以通过增加线程池中服务员的数量来扩展，既然是单线程，那么怎么扩展scale呢？

一种方法就是nodejs的新feature cluster 
node.js scalability problems and how to solve them https://softwareontheroad.com/nodejs-scalability-issues/#resources
Good practices for high-performance and scalable Node.js applications https://medium.com/iquii/good-practices-for-high-performance-and-scalable-node-js-applications-part-1-3-bb06b6204197

用nodejs的朋友都有了解，node是单线程的，也就是说跑在8核CPU上，只能使用一个核的算力。
单线程一直是node的一个诟病，但随着0.6版本中引入cluster之后，这个情况则得到了改变，开发人员可以依靠cluster很轻松的将自己的Node服务器扩展为多线程服务器了。
另一种从微服务层面找到瓶颈，https://blog.risingstack.com/nodejs-microservices-scaling-case-study/

先上一张大图：
![Java reactive API VS java8 stream](/docs/docs_image/software/java/java05.png)

图开始是对比Java reactive API VS java8 stream，图片下部分是印证下面的内容：

Streaming framework: apache spark，storm，kafka stream等，感觉reactive响应式编程也是处理stream，有什么分别呢，reactive基本是request response的模式，而streaming最终是要做collection reduce合并计算的

> People tend to confuse between streaming frameworks and reactive programmings frameworks, 
> because they both deal with high throughput of real-time events. The different is with what they do after consuming the events: 
> **Reactive systems are used to provide a quick action for each event. Streaming systems are used to collect the data from the events and store it in files or databases after aggregations and other calculations.**

pipeline，method chaining，fluent Interface
我们可以看到从synchronous到asynchronous转换比较明显就是用callback，但是如果步骤过多就会出现类似这样的嵌套写法
process1().done( callback() ) 然后callback().done( anothercallback())；为了解决这个问题就出现了fluent interface，即
process1().done( callback() ) 然后callback().done( anothercallback())；为了解决这个问题就出现了fluent interface，即
process1().then(process2())

Streaming里面也是很多这种写法
他们的背后实现方法是什么我暂时不知道，也许是pub sub的观察着模式，比如前面的reactive响应式编程的发展路线：

前面提到非阻塞式基本都是采用nodejs的event loop单线程思想，而event loop就是基于观察者模式：
https://medium.com/@brianjleeofcl/what-they-probably-didnt-teach-you-pt-1-node-js-event-emitters-observer-pattern-7dd02b67c061
当然现在第四代的Reactor Library未必是用观察者模式，因为观察者模式是事件驱动，而响应式编程是消息驱动（比如抓获的异常也是消息）

从更高的角度来看，这些都可以称作是pipeline，比如有这么一篇文章《Kafka streams - From pub/sub to a complete stream processing platform》，kafka api and unix analogy
cat < in.txt | grep “apache” | tr a-z A-Z > out.txt

### 5.2 RPC / RMI / JMS / WebService(Rest/SOAP) 

#### 5.2.1 Overview

> Nowadays we use general purpose applications or libraries to communicate with each other. For example, we often use an HTTP client library to retrieve information from a web server and to invoke a remote procedure call via web services. However, a general purpose protocol or its implementation sometimes does not scale very well. It is like how we don't use a general purpose HTTP server to exchange huge files, e-mail messages, and near-realtime messages such as financial information and multiplayer game data. What's required is a highly optimized protocol implementation that is dedicated to a special purpose. For example, you might want to implement an HTTP server that is optimized for AJAX-based chat application, media streaming, or large file transfer. You could even want to design and implement a whole new protocol that is precisely tailored to your need. Another inevitable case is when you have to deal with a legacy proprietary protocol to ensure the interoperability with an old system. What matters in this case is how quickly we can implement that protocol while not sacrificing the stability and performance of the resulting application.

RPC is a protocol defined in https://tools.ietf.org/html/rfc1831 , netty is one of the non-blocking io implementation of RPC, 
and also sometimes refer as an architecture style (getUserById?id=1) when comparing with rest style(get /cat/1)
RMI is a protocol and also a low-level RPC implementation, “normally for server to server communication or inter micro services communication, service A invoke methods on service B just as its own function call”; dubbo is an advanced implementation on top of RMI and other protocols, is for distributed services;

WebServices is also a specific implementation of RPC using HTTP protocol, it is also called RPC-Style web service, and one more style is Restful style web service.
Compare: RMI is more performance better than web service, because RMI using tcp while web service using http;
https://www.jianshu.com/p/5b90a4e70783

![](/docs/docs_image/software/java/java06.png)

RPC vs Restful, RPC vs RMI, Rest vs Restful:

![](/docs/docs_image/software/java/java07.png)

#### 5.2.2 RPC
RPC框架有很多，比较知名的如阿里的Dubbo、google的gRPC、Go语言的rpcx、Apache的thrift。当然了，还有Spring Cloud，不过对于Spring Cloud来说，RPC只是它的一个功能模块，还有netty，alipay基于netty的SOFA RPC
技术点：
●	元注解定义
●	网络IO，BIO\NIO\AIO，Socket编程，HTTP通信，一个就行。
●	动态代理，JDK或者Cglib的动态代理。
●	反射
●	序列化、反序列化，JDK序列化，JSON、Hessian、Kryo、ProtoBuffer、ProtoStuff、Fst知道一个就行。
●	网络通信
●	编解码
●	服务发现和注册
●	心跳与链路检测

利用动态代理也能实现AOP。仔细推演一下不能得出这个结论。我们知道：动态代理提供了一种方式，能够将分散的方法调用转发到一个统一的处理函数处理。AOP的实现需要能够提供这样一种机制，即在执行函数前和执行函数后都能执行自己定义的钩子。那么，首先使用动态代理让代理类忠实的代理被代理类，然后处理函数中插入我们的自定义的钩子。之后让代理类替换被代理类需要使用的场景，这样，相当于对该类的所有方法定义了一个切面。不过，使用动态代理实现AOP特别麻烦，啰嗦。这仅仅作为一个探讨的思路，来说明动态代理这一通用概念可以实现很多特定技术。实际使用中当然使用spring提供的AOP更为方便。
https://www.jianshu.com/p/64355d8cb1ee

基于Netty实现
https://netty.io/wiki/user-guide-for-4.x.html

https://github.com/luxiaoxun/NettyRpc/tree/b811cabebcf20a2551f4ffa746de68ba1e7ebafb
https://juejin.im/post/5c6d7640f265da2de80f5e9c#heading-4

SOFA RPC基于netty进一步封装，更容易使用

流程
●	Server端启动进行服务注册到zookeeper；
●	Client端启动获取zookeeper的服务注册信息，定期更新；
●	Client以本地调用方式调用服务（使用接口，例如helloService.sayHi("world"));
●	Client通过RpcProxy会使用对应的服务名生成动态代理相关类，而动态代理类会将请求的对象中的方法、参数等组装成能够进行网络传输的消息体RpcRequest；
●	Client通过一些的负载均衡方式确定向某台Server发送编码（RpcEncoder）过后的请求（netty实现）
●	Server收到请求进行解码（RpcDecoder），通过反射（cglib的FastMethod实现）会进行本地的服务执行
●	Server端writeAndFlush()将RpcResponse返回；
●	Clinet将返回的结果会进行解码，得到最终结果。

#### 5.2.3 RMI

**RMI VS RPC:**
Java RMI （Remote Method Invocation）- 远程方法调用，能够让客户端像使用本地调用一样调用服务端 Java 虚拟机中的对象方法。RMI 是面向对象语言领域对 RPC （Remote Procedure Call）的完善，用户无需依靠 IDL 的帮助来完成分布式调用，而是通过依赖接口这种更简单自然的方式。
RPC and RMI are the mechanisms which enable a client to invoke the procedure or method from the server through establishing communication between client and server. The common difference between RPC and RMI is that RPC only supports procedural programming whereas RMI supports object-oriented programming.

Getting Started Using Java™ RMI https://docs.oracle.com/javase/7/docs/technotes/guides/rmi/hello/hello-world.html

第一步 全手动本地发布
![](/docs/docs_image/software/java/java08.png)

Difference between classes java.rmi.registry.Registry and java.rmi.Naming 
https://stackoverflow.com/questions/3630329/difference-between-classes-java-rmi-registry-registry-and-java-rmi-naming
需要手动编译interface server 到当前目录下面，然后手动运行时需要指定classpath，需要手动启动rmiregistry

第二步 通过JNDI尝试远程发布并自动启动rmiregistry
RMI VS WebService
![](/docs/docs_image/software/java/java09.png)

第三步 基于zookeeper发布
https://my.oschina.net/huangyong/blog/345164
http://wanglizhi.github.io/2016/06/12/RMI/

注意：我们首先需要使用 ZooKeeper 的客户端工具创建一个持久性 ZNode，名为“/registry”，该节点是不存放任何数据的，可使用如下命令：
create /registry null

![](/docs/docs_image/software/java/java10.png)

#### 5.2.4 Dubbo
RMI比较原始
Dependency
http://jm.taobao.org/2018/06/13/%E5%BA%94%E7%94%A8/

https://github.com/apache/dubbo/blob/master/dubbo-dependencies-bom/pom.xml
Admin ui
https://github.com/apache/dubbo-admin
https://dubbo.apache.org/en-us/docs/admin/introduction.html

Dubbo with multicast
	Multicast
Dubbo 支持多种协议，采用的协议在网络层级不同，performance
https://dubbo.apache.org/en-us/docs/user/perf-test.html

## 6.JVM

JVM是一份本地化的程序，本质上是可执行的文件，是静态的概念。
/jre/bin/server/jvm.dll

程序运行起来成为进程，是动态的概念。java程序是跑在JVM上的，严格来讲，是跑在JVM实例上的，一个JVM实例其实就是JVM跑起来的进程，二者合起来称之为一个JAVA进程。各个JVM实例之间是相互隔离的。

JVM,java虚拟机，只是给byte code提供解释翻译加载运行的一个工具（通常编程打包的程序都是直接到机器码，比如exe文件是windows的机器码可执行文件，Java语言设计只默认编译成中间语言byte code字节码，不编译成最终的机器码，然后jvm就会去解释执行），实际上不只是java语言，任何语言只要能转成bytecode 字节码都可以交由jvm加载，jvm会找到主程序并根据当前的操作系统解释成机器码运行；

入门到放弃
https://juejin.im/post/5b45ef49f265da0f5140489c

JMX Monitor
https://docs.oracle.com/javase/6/docs/technotes/guides/management/agent.html

JPDA
https://zhuanlan.zhihu.com/p/59639046

Load jni library from jar:
https://blog.csdn.net/Revivedsun/article/details/86562934
https://stackoverflow.com/questions/1611357/how-to-make-a-jar-file-that-includes-dll-files
http://www.jdotsoft.com/JarClassLoader.php#tempfiles

![](/docs/docs_image/software/java/java11.png)

file:/C:/Workspace/Temp/XXX.jar!/BOOT-INF/lib/XXX-1.0-SNAPSHOT.jar!/XXXJNI.dll

file:/opt/XXX.jar!/BOOT-INF/lib/XXX-1.0-SNAPSHOT.jar!/libXXXJNI.so

getClass().getResourceAsStream("/filename");
https://stackoverflow.com/questions/20389255/reading-a-resource-file-from-within-jar

### 6.1 Hsdb
java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB
java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB $JAVA_HOME/bin/java /opt/core.10759

案例分享：如何通过JVM crash 的日志和core dump定位和分析Instrument引起的JVM crash
https://blog.csdn.net/raintungli/article/details/77790829
https://blog.csdn.net/qq_31865983/article/details/98480703

java -cp .:/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.x86_64/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.x86_64/bin/java /opt/core.10759

### 6.2 Java外挂
https://www.codercto.com/a/18543.html
https://github.com/vipshop/vjtools
https://mp.weixin.qq.com/s/cwU2rLOuwock048rKBz3ew

## 7.JAVA experience
1）同步锁信号
synchronized(this), wati, notify, notifyall

2) 事件通信
Publish Events
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory,
   	 MessageSource, ApplicationEventPublisher, ResourcePatternResolver {

注解方法@EventListener并且其所在类也必须是@Component注解，或者直接extends ApplicationEvent

---
todo

-agentlib VS -X

---

ref:

[圣经《JAVA Performance》](https://github.com/PlamenStilyianov/Java/blob/master/Charlie%20Hunt%2C%20Binu%20John%20-%20Java%20Performance%20-%202011.pdf)
[Java远程调试（Remote Debugging）的那些事](https://www.jianshu.com/p/d168ecdce022)