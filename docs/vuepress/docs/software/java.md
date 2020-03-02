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

~~
jdb -sourcepath -classpath com.quantdo.framework.websocket.WebSocketApplication
java -jar -agentlib:jdwp=transport=dt_shmem,address=jdbconn,server=y,suspend=n C:\Workspace\EclipseWorkspace\quantdo-websocket\quantdo-websocket.jar
jdb -attach jdbconn
jdb -sourcepath BOOT-INF/classes/ -classpath . org.springframework.boot.loader.JarLauncher
~~

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
**Remote Debug(attach jar)
https://stackoverflow.com/questions/6855520/attach-debugger-to-application-using-eclipse/23297651
Confg: 
	Remote Java Application->Connect 
	&
	Remote Java Application->Source
then Start jar and expose port:
java -Xdebug -Xrunjdwp:transport=dt_socket,address=127.0.0.1:8008,server=y,suspend=y -jar target\test.jar

For remote debug war hosting in remote tomcat:
vim /etc/tomcat/tomcat.conf
JAVA_OPTS or CATALINA_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=10001,server=y,suspend=n"
Failed using port 8000

For mvn project another way can be found in Maven->debug below

**Debug into jar without sourcecode using decompiler
My original post
https://stackoverflow.com/questions/58534925/eclipse-not-decompile-rt-jar-when-debugging-but-idea-does/58535553#58535553
For eclipse install:
Enhanced Class Decompiler https://ecd-plugin.github.io/ecd/ or jd plugin http://java-decompiler.github.io/
	Haven’t try another one Bytecode Visualizer https://www.crowdstrike.com/blog/native-java-bytecode-debugging-without-source-code/
For intellj idea, it’s auto:

**Run external jar 

Program-> create -> Locatoin:jdk/java.exe Argument:-jar XXX.jar

But how to debug ? can try woring with jdb.exe
https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jdb.html
https://stackoverflow.com/questions/19843096/how-to-debug-a-java-application-without-access-to-the-source-code/58555431#58555431


java -jar -agentlib:jdwp=transport=dt_shmem,address=jdbconn,server=y,suspend=n C:\Workspace\EclipseWorkspace\test.jar

Debug dependencies, keep in mind that don’t set debugger in project view, change to debugger view and set it


---
todo

-agentlib VS -X

---

ref:

[圣经《JAVA Performance》](https://github.com/PlamenStilyianov/Java/blob/master/Charlie%20Hunt%2C%20Binu%20John%20-%20Java%20Performance%20-%202011.pdf)