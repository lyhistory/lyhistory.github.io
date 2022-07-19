---
sidebar: auto
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《java实用基础》


## Misconception
Java always passes arguments by value, NOT by reference.
https://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by-value/12429953#12429953

## 1.jdk

refer<buildingblock/java_jdk>



## 2.Tools&IDE

### 2.1 Tools

#### Decompiler

Reverse class to view code http://java-decompiler.github.io/
分析JVM	
JVisualVM https://www.cnblogs.com/xifengxiaoma/p/9402497.html
Java ServiceabilityAgent(HSDB)使用和分析
https://liuzhengyang.github.io/2017/05/27/serviceabilityagent/

#### Linux tools

strace -ff -o prefix

#### JDK Tools

DEBUG:
tls/ssl:
java -jar -Djavax.net.debug=all

java -XX:ErrorFile=/var/log/java/java_error%p.log
If the -XX:ErrorFile=file flag is not specified, the default log file name is hs_err_pid.log, where pid is the PID of the process.

JVM参数 
https://stackoverflow.com/questions/43087831/complete-list-of-jvm-options
java -XX:+UnlockDiagnosticVMOptions -XX:+UnlockExperimentalVMOptions -XX:+PrintFlagsFinal -XX:+PrintFlagsWithComments -version
JVM启动参数大全 https://www.cnblogs.com/qlqwjy/p/8037797.html

jvm工具
jps
jstat
jmap
jstack
https://www.jianshu.com/p/c6a04c88900a



jps

jstack https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr016.html

jvisualvm

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

~~-sourcepath -classpath com.lyhistory.framework.websocket.WebSocketApplication
java -jar -agentlib:jdwp=transport=dt_shmem,address=jdbconn,server=y,suspend=n C:\Workspace\EclipseWorkspace\lyhistory-websocket\lyhistory-websocket.jar
jdb -attach jdbconn
jdb -sourcepath BOOT-INF/classes/ -classpath . org.springframework.boot.loader.JarLauncher~~

```

jdb -sourcepath BOOT-INF/classes/ -classpath .;BOOT-INF/classes/
stop at com.lyhistory.framework.websocket.endpoint.GeneralWebSocketEndpoint:54
stop at com.lyhistory.framework.websocket.handler.DefaultWebSocketMessageHandler:32
stop in DefaultWebSocketMessageHandler.receiveMessage
stop in com.lyhistory.framework.websocket.endpoint.GeneralWebSocketEndpoint.onMessage
stop in com.alibaba.fastjson.parser.JSONLexerBase.scanString
	  public final void scanString() {
	  public String scanString(char expectNextChar) {
stop at com.alibaba.fastjson.parser.JSONLexerBase:880
run org.springframework.boot.loader.JarLauncher

jdb -sourcepath BOOT-INF/classes/ -classpath .;BOOT-INF/classes/;BOOT-INF/lib/
	stop at com.lyhistory.framework.cache.autoconfigure.support.WebsocketMessageListener:35
	stop at org.springframework.data.redis.listener.RedisMessageListenerContainer:968
	stop at com.lyhistory.framework.websocket.endpoint.GeneralWebSocketEndpoint:54
stop at com.lyhistory.framework.websocket.handler.DefaultWebSocketMessageHandler:32
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

IDEA和eclipse各有优缺点，比如eclipse可以在同一个ide实例中操作多个project，而idea只能一个实例开一个project；
但是IDEA有智能的依赖查询、依赖冲突解决、依赖调试能力，eclipse就稍微麻烦，只能手动操作，举例：
我在查询一个AutoWired的依赖时，找到了这接口，然后直接找其引用reference是找不到的，可能是因为在不同的jar包中，
最后是在右键“Open type Hierarchy”找到，而在IDEA中，直接左侧会显示一个i的小图标，点击即可显示“is implemented in”；

Eclipse/STS 
Project Explorer-> Projects Presentation (select hierarchy)

#### 2.3.0 Code Style

统一代码以及配置文件的缩进，以eclipse为例：

1.代码缩进

Window->Preferences->Java->Code Style->Formatter:

Edit Tab Policy: Space only

2.配置xml缩进比如pom

Window->Preferences->XML->XML Files->Editor:

Indent with spaces, Indentation size 4

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

**基本debug技巧：**

1).调试依赖比如maven dependencies的时候，注意在eclipse里面设置断点有可能不生效，因为debugger view下会有很多空行，技巧是多设置一些断点，调试起来之后再在debugger view下设置断点
2).比如pom.xml在eclipse里面可以查看Dependency hierarchy view，可以比较清晰的看到所有依赖的层级关系
3).右键 quick outline
4).右键 Open type Hierarchy，可以显示依赖中的接口实现
5).选中class名字，然后Ctrl+shift+T，或者从菜单Navigate->Open Type，可以显示这个class是在哪个jar包中，及其物理位置；

**Remote Debug(attach jar)：**

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

**Debug into jar without sourcecode using decompiler：**

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

## 3.Package Management

### 3.1 Gradle
todo Refer to Project:alpha-wallet

### 3.2 MAVEN

#### 3.2.1 Install 

**eclipse maven path: Preferences->Maven->Installations**

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

#### 3.2.2 POM / Dependency Mechanism

- Do not attempt to import a POM that is defined in a submodule of the current POM. Attempting to do that will result in the build failing  since it won't be able to locate the POM.
- Never declare the POM importing a POM as the parent (or grandparent, etc) of the target POM. There is no way to resolve the circularity and  an exception will be thrown.
- When referring to artifacts whose POMs have transitive dependencies, the project needs to specify versions of those artifacts as managed  dependencies. Not doing so results in a build failure since the artifact may not have a version specified. (This should be considered a best  practice in any case as it keeps the versions of artifacts from changing from one build to the next).

##### Dependency mediation/Transitive Dependencies

```
  A
  ├── B
  │   └── C
  │       └── D 2.0
  └── E
      └── D 1.0
In text, dependencies for A, B, and C are defined as A -> B -> C -> D 2.0 and A -> E -> D 1.0, then D 1.0 will be used when building A because the path from A to D through E is shorter. You could explicitly add a dependency to D 2.0 in A to force the use of D 2.0, as shown here:
  A
  ├── B
  │   └── C
  │       └── D 2.0
  ├── E
  │   └── D 1.0
  │
  └── D 2.0     
  
 
```

Suggestion: 最好指定需要的依赖，而不是使用隐式引用，原因：

Although transitive dependencies can implicitly include desired  dependencies, it is a good practice to explicitly specify the  dependencies your source code uses directly. This best practice proves  its value especially when the dependencies of your project change their  dependencies.

For example, assume that your project A specifies a dependency on  another project B, and project B specifies a dependency on project C. If you are directly using components in project C, and you don't specify  project C in your project A, it may cause build failure when project B  suddenly updates/removes its dependency on project C.

Another reason to directly specify dependencies is that it provides  better documentation for your project: one can learn more information by just reading the POM file in your project, or by executing **mvn dependency:tree -Dverbose**

##### Excluded dependencies

If project X depends on project Y, and  project Y depends on project Z, the owner of project X can explicitly  exclude project Z as a dependency, using the "exclusion" element.

If project Y depends on project Z, the owner of project Y can mark  project Z as an optional dependency, using the "optional" element. When  project X depends on project Y, X will depend only on Y and not on Y's  optional dependency Z. The owner of project X may then explicitly add a  dependency on Z, at her option. (It may be helpful to think of optional  dependencies as "excluded by default.")

##### Dependency Scope

compile/provided/runtime/test/system/import

##### Dependency Management

+ The dependency management section is a mechanism for centralizing dependency information

  ```
  Project A:
      <project>
        ...
        <dependencies>
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-a</artifactId>
            <version>1.0</version>
            <exclusions>
              <exclusion>
                <groupId>group-c</groupId>
                <artifactId>excluded-artifact</artifactId>
              </exclusion>
            </exclusions>
          </dependency>
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-b</artifactId>
            <version>1.0</version>
            <type>bar</type>
            <scope>runtime</scope>
          </dependency>
        </dependencies>
      </project>
  Project B:
      <project>
        ...
        <dependencies>
          <dependency>
            <groupId>group-c</groupId>
            <artifactId>artifact-b</artifactId>
            <version>1.0</version>
            <type>war</type>
            <scope>runtime</scope>
          </dependency>
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-b</artifactId>
            <version>1.0</version>
            <type>bar</type>
            <scope>runtime</scope>
          </dependency>
        </dependencies>
      </project>
  =>
  Parent:
      <project>
        ...
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>group-a</groupId>
              <artifactId>artifact-a</artifactId>
              <version>1.0</version>
       
              <exclusions>
                <exclusion>
                  <groupId>group-c</groupId>
                  <artifactId>excluded-artifact</artifactId>
                </exclusion>
              </exclusions>
       
            </dependency>
       
            <dependency>
              <groupId>group-c</groupId>
              <artifactId>artifact-b</artifactId>
              <version>1.0</version>
              <type>war</type>
              <scope>runtime</scope>
            </dependency>
       
            <dependency>
              <groupId>group-a</groupId>
              <artifactId>artifact-b</artifactId>
              <version>1.0</version>
              <type>bar</type>
              <scope>runtime</scope>
            </dependency>
          </dependencies>
        </dependencyManagement>
      </project>
      
  Project A:
      <project>
        ...
        <dependencies>
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-a</artifactId>
          </dependency>
       
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-b</artifactId>
            <!-- This is not a jar dependency, so we must specify type. -->
            <type>bar</type>
          </dependency>
        </dependencies>
      </project>
  Project B:
      <project>
        ...
        <dependencies>
          <dependency>
            <groupId>group-c</groupId>
            <artifactId>artifact-b</artifactId>
            <!-- This is not a jar dependency, so we must specify type. -->
            <type>war</type>
          </dependency>
       
          <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-b</artifactId>
            <!-- This is not a jar dependency, so we must specify type. -->
            <type>bar</type>
          </dependency>
        </dependencies>
      </project>
  ```

  

+ Very important use of the dependency management section is to control the versions of artifacts used in transitive dependencies

  ```
  Project A:
      <project>
       <modelVersion>4.0.0</modelVersion>
       <groupId>maven</groupId>
       <artifactId>A</artifactId>
       <packaging>pom</packaging>
       <name>A</name>
       <version>1.0</version>
       <dependencyManagement>
         <dependencies>
           <dependency>
             <groupId>test</groupId>
             <artifactId>a</artifactId>
             <version>1.2</version>
           </dependency>
           <dependency>
             <groupId>test</groupId>
             <artifactId>b</artifactId>
             <version>1.0</version>
             <scope>compile</scope>
           </dependency>
           <dependency>
             <groupId>test</groupId>
             <artifactId>c</artifactId>
             <version>1.0</version>
             <scope>compile</scope>
           </dependency>
           <dependency>
             <groupId>test</groupId>
             <artifactId>d</artifactId>
             <version>1.2</version>
           </dependency>
         </dependencies>
       </dependencyManagement>
      </project>
      
  Project B:
      <project>
        <parent>
          <artifactId>A</artifactId>
          <groupId>maven</groupId>
          <version>1.0</version>
        </parent>
        <modelVersion>4.0.0</modelVersion>
        <groupId>maven</groupId>
        <artifactId>B</artifactId>
        <packaging>pom</packaging>
        <name>B</name>
        <version>1.0</version>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>test</groupId>
              <artifactId>d</artifactId>
              <version>1.0</version>
            </dependency>
          </dependencies>
        </dependencyManagement>
       
        <dependencies>
          <dependency>
            <groupId>test</groupId>
            <artifactId>a</artifactId>
            <version>1.0</version>
            <scope>runtime</scope>
          </dependency>
          <dependency>
            <groupId>test</groupId>
            <artifactId>c</artifactId>
            <scope>runtime</scope>
          </dependency>
        </dependencies>
      </project>
  
  When maven is run on project B, version 1.0 of artifacts a, b, c, and d will be used regardless of the version specified in their POM:
  1. a and c both are declared as dependencies of the project so version 1.0 is used due to dependency mediation. Both also have runtime scope since it is directly specified.
  2. b is defined in B's parent's dependency management section and since dependency management takes precedence over dependency mediation for transitive dependencies, version 1.0 will be selected should it be referenced in a or c's POM. b will also have compile scope.
  3. Finally, since d is specified in B's dependency management section, should d be a dependency (or transitive dependency) of a or c, version 1.0 will be chosen - again because dependency management takes precedence over dependency mediation and also because the current POM's declaration takes precedence over its parent's declaration
  ```

+ projects can import managed dependencies from other projects

  ```
      <project>
        <modelVersion>4.0.0</modelVersion>
        <groupId>maven</groupId>
        <artifactId>B</artifactId>
        <packaging>pom</packaging>
        <name>B</name>
        <version>1.0</version>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>maven</groupId>
              <artifactId>A</artifactId>
              <version>1.0</version>
              <type>pom</type>
              <scope>import</scope>
            </dependency>
            <dependency>
              <groupId>test</groupId>
              <artifactId>d</artifactId>
              <version>1.0</version>
            </dependency>
          </dependencies>
        </dependencyManagement>
       
        <dependencies>
          <dependency>
            <groupId>test</groupId>
            <artifactId>a</artifactId>
            <version>1.0</version>
            <scope>runtime</scope>
          </dependency>
          <dependency>
            <groupId>test</groupId>
            <artifactId>c</artifactId>
            <scope>runtime</scope>
          </dependency>
        </dependencies>
      </project>
      
  Assuming A is the POM defined in the preceding example, the end result would be the same. All of A's managed dependencies would be incorporated into B except for d since it is defined in this POM.
  
  Project X:
      <project>
       <modelVersion>4.0.0</modelVersion>
       <groupId>maven</groupId>
       <artifactId>X</artifactId>
       <packaging>pom</packaging>
       <name>X</name>
       <version>1.0</version>
       
       <dependencyManagement>
         <dependencies>
           <dependency>
             <groupId>test</groupId>
             <artifactId>a</artifactId>
             <version>1.1</version>
           </dependency>
           <dependency>
             <groupId>test</groupId>
             <artifactId>b</artifactId>
             <version>1.0</version>
             <scope>compile</scope>
           </dependency>
         </dependencies>
       </dependencyManagement>
      </project>
  Project Y:
      <project>
       <modelVersion>4.0.0</modelVersion>
       <groupId>maven</groupId>
       <artifactId>Y</artifactId>
       <packaging>pom</packaging>
       <name>Y</name>
       <version>1.0</version>
       
       <dependencyManagement>
         <dependencies>
           <dependency>
             <groupId>test</groupId>
             <artifactId>a</artifactId>
             <version>1.2</version>
           </dependency>
           <dependency>
             <groupId>test</groupId>
             <artifactId>c</artifactId>
             <version>1.0</version>
             <scope>compile</scope>
           </dependency>
         </dependencies>
       </dependencyManagement>
      </project>
  Project Z:
      <project>
        <modelVersion>4.0.0</modelVersion>
        <groupId>maven</groupId>
        <artifactId>Z</artifactId>
        <packaging>pom</packaging>
        <name>Z</name>
        <version>1.0</version>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>maven</groupId>
              <artifactId>X</artifactId>
              <version>1.0</version>
              <type>pom</type>
              <scope>import</scope>
            </dependency>
            <dependency>
              <groupId>maven</groupId>
              <artifactId>Y</artifactId>
              <version>1.0</version>
              <type>pom</type>
              <scope>import</scope>
            </dependency>
          </dependencies>
        </dependencyManagement>
      </project>
      
  In the example above Z imports the managed dependencies from both X and Y. However, both X and Y contain dependency a. Here, version 1.1 of a would be used since X is declared first and a is not declared in Z's dependencyManagement.
  
  This process is recursive. For example, if X imports another POM, Q, when Z is processed it will simply appear that all of Q's managed dependencies are defined in X.
  ```

+ Bill of Materials (BOM) POMs

  Imports are most effective when used for defining a "library" of  related artifacts that are generally part of a multiproject build. It is fairly common for one project to use one or more artifacts from these  libraries. However, it has sometimes been difficult to keep the versions in the project using the artifacts in synch with the versions  distributed in the library. The pattern below illustrates how a "bill of materials" (BOM) can be created for use by other projects.

  

  ```
  The root of the project is the BOM POM. It defines the versions of  all the artifacts that will be created in the library. Other projects  that wish to use the library should import this POM into the  dependencyManagement section of their POM.
  
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.test</groupId>
        <artifactId>bom</artifactId>
        <version>1.0.0</version>
        <packaging>pom</packaging>
        <properties>
          <project1Version>1.0.0</project1Version>
          <project2Version>1.0.0</project2Version>
        </properties>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>com.test</groupId>
              <artifactId>project1</artifactId>
              <version>${project1Version}</version>
            </dependency>
            <dependency>
              <groupId>com.test</groupId>
              <artifactId>project2</artifactId>
              <version>${project2Version}</version>
            </dependency>
          </dependencies>
        </dependencyManagement>
       
        <modules>
          <module>parent</module>
        </modules>
      </project>
      
  The parent subproject has the BOM POM as its parent. It is a normal multiproject pom.
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
          <groupId>com.test</groupId>
          <version>1.0.0</version>
          <artifactId>bom</artifactId>
        </parent>
       
        <groupId>com.test</groupId>
        <artifactId>parent</artifactId>
        <version>1.0.0</version>
        <packaging>pom</packaging>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>log4j</groupId>
              <artifactId>log4j</artifactId>
              <version>1.2.12</version>
            </dependency>
            <dependency>
              <groupId>commons-logging</groupId>
              <artifactId>commons-logging</artifactId>
              <version>1.1.1</version>
            </dependency>
          </dependencies>
        </dependencyManagement>
        <modules>
          <module>project1</module>
          <module>project2</module>
        </modules>
      </project>
      
  Next are the actual project POMs.
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
          <groupId>com.test</groupId>
          <version>1.0.0</version>
          <artifactId>parent</artifactId>
        </parent>
        <groupId>com.test</groupId>
        <artifactId>project1</artifactId>
        <version>${project1Version}</version>
        <packaging>jar</packaging>
       
        <dependencies>
          <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
          </dependency>
        </dependencies>
      </project>
       
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <parent>
          <groupId>com.test</groupId>
          <version>1.0.0</version>
          <artifactId>parent</artifactId>
        </parent>
        <groupId>com.test</groupId>
        <artifactId>project2</artifactId>
        <version>${project2Version}</version>
        <packaging>jar</packaging>
       
        <dependencies>
          <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
          </dependency>
        </dependencies>
      </project>
      
  The project that follows shows how the library can now be used in another project without having to specify the dependent project's versions.
      <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.test</groupId>
        <artifactId>use</artifactId>
        <version>1.0.0</version>
        <packaging>jar</packaging>
       
        <dependencyManagement>
          <dependencies>
            <dependency>
              <groupId>com.test</groupId>
              <artifactId>bom</artifactId>
              <version>1.0.0</version>
              <type>pom</type>
              <scope>import</scope>
            </dependency>
          </dependencies>
        </dependencyManagement>
        <dependencies>
          <dependency>
            <groupId>com.test</groupId>
            <artifactId>project1</artifactId>
          </dependency>
          <dependency>
            <groupId>com.test</groupId>
            <artifactId>project2</artifactId>
          </dependency>
        </dependencies>
      </project>
  ```
+ sub Project不需要指定parent的版本号

  https://stackoverflow.com/questions/10582054/maven-project-version-inheritance-do-i-have-to-specify-the-parent-version

  Starting with Maven 3.5.0-beta-1 you can use the `${revision}`, `${sha1}`  and/or `${changelist}` as placeholders for the version in your pom file.  https://maven.apache.org/maven-ci-friendly.html

##### 遇到的实际问题

```
 
  Project A: some-framework version 1.2.0-SNAPSHOT
  │			[
  │				sub moduels: 
  │				some-framework-model ${project.version}
  │				......
  │			]
  ├── SubProject A-1: test-A
  │						└── Dependency: some-framework-model
  │   
  └── Project B: some-project version 0.8.0-SNAPSHOT
      └── SubProejct B-1: some-project-service 
      		└── Dependency: some-framework-model
      		
注意到，
当我在 Project A的parent的pom里面的dependencyManagement里使用 ${project.version} 来声明 some-framework-model的版本，编译SubProject A-1: test-A的时候可以正确找到 some-framework-model 1.2.0-SNAPSHOT；
但是当编译Project B的时候就出现问题了，因为SubProejct B-1: some-project-service 并不是去找some-framework-model 1.2.0-SNAPSHOT 而是去找 some-framework-model 0.8.0-SNAPSHOT；
显然SubProejct B-1找错了，可能是maven的这个${project.version}被Project B继承下来，然后简单的替换成了0.8.0，而不是沿用Project A的版本1.2.0-SNAPSHOT
```

引入第三方jar资源 注意事项: 

1、引入任何第三方jar之前,查看一下平台framework-parent.pom中是否已经包含(或间接依赖引入),存在时请不要再次引入; 
2、如果引入的第三方jar与平台存在版本不一致的地方,请在此处做maven依赖引用剔除,剔除方法还是参见framework-parent.pom中的dependencyManagement部分; 
3、在当前dependencyManagement依赖管理中定义jar版本信息必须在properties属性中统一明确定义,便于集中版本维护管理与问题排查; 
4、在当前业务工程内的各业务子模块禁止出现版本(version)标签信息。 



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

自定义maven repository: e.g nexus repository
#### 3.2.3 Lifecycle

https://maven.apache.org/plugins/index.html

+ Standard Lifecycle using core plugin：
  https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html
  + validate - validate the project is correct and all necessary information is available
  + compile - compile the source code of the project
  + test - test the compiled source code using a suitable unit testing framework. These tests should not require the code be packaged or deployed
  + package - take the compiled code and package it in its distributable format, such as a JAR.
  + verify - run any checks on results of integration tests to ensure quality criteria are met
  + install - install the package into the local repository, for use as a dependency in other projects locally
  + deploy - done in the build environment, copies the final package to the remote repository for sharing with other developers and projects.

+ Non-Standard Lifecycle, for example Tools:
  + mvn version https://www.mojohaus.org/versions-maven-plugin/usage.html
  + mvn release https://maven.apache.org/maven-release/maven-release-plugin/

##### Config

**项目pom配置plugin**

maven & maven.plugins & dependencies

https://stackoverflow.com/questions/11881663/what-is-the-difference-in-maven-between-dependency-and-plugin-tags-in-pom-xml

spring-boot-maven-plugin vs maven-compiler-plugin

https://stackoverflow.com/questions/57687485/whats-the-difference-between-spring-boot-maven-plugin-and-maven-compiler-plu

```
<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

VS

<build>
        <plugins>
            <!-- JDK level -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <configuration>
                    <nonFilteredFileExtensions>
                        <nonFilteredFileExtension>dll</nonFilteredFileExtension>
                        <nonFilteredFileExtension>so</nonFilteredFileExtension>
                    </nonFilteredFileExtensions>
                </configuration>
            </plugin>

            <!-- 更新: mvn versions:set -DnewVersion=1.0.4-SNAPSHOT versions:update-child-modules
                回滚: mvn versions:revert 提交: mvn versions:commit -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>versions-maven-plugin</artifactId>
                <version>2.7</version>
            </plugin>

        </plugins>

        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <excludes>
                    <exclude>application.properties</exclude>
                </excludes>
            </resource>
        </resources>

    </build>

```

**项目pom配置repository**

https://stackoverflow.com/questions/35317118/repository-tag-under-distributionmanagement-vs-repositories

- Repositories declared under the `distributionManagement` element will be used for deployment, i.e. when running `mvn deploy`.
- The `repositories` element will be used for downloading dependencies of the project. The command is not necessarily `mvn install` but any command that requires Maven to fetch artifacts from a repository.

```
<distributionManagement>
    <repository>
        <id>...</id>
        <name>...</name>
        <url>...</url>
    </repository>
</distributionManagement> 

<repositories>
    <repository>
        <id>...</id>
        <name>...</name>
        <layout>default</layout>
        <url>...</url>
    </repository>
</repositories>
```

**全局配置**

%USER_HOME%/.m2/settings.xml:

https://stackoverflow.com/questions/32057282/maven-distributionmanagement-or-server-user-and-password-as-parameter

**CI配置**

https://docs.gitlab.com/ee/user/packages/maven_repository/#create-maven-packages-with-gitlab-cicd-by-using-maven

##### Commands

+ mvn install command runs the install plugin used in the install phase to add artifact(s) to the local repository. The Install Plugin uses the information in the POM (groupId, artifactId, version) to determine the proper location of the artifact within the local repository.

  The local repository is the local cache where all artifacts needed for the build are stored. By default, it is located in the user's home directory (~/.m2/repository) but the location can be configured in ~/.m2/settings.xml using the localRepository element

+ mvn deploy runs the deploy plugin which deploys an artifact to the remote repository

+ mvn release command runs the release plugin which is responsible for tagging the current code in the source control. In order to use the maven release plugin, you need to add the SCM section with a developerConnection which contains the URL of the source control management system pointing to the folder containing the pom.xml.

  release:clean : performs clean-up after a release preparation.

  release:prepare : prepare for a release in SCM.

  release:rollback : rollback a previous release.

  release:perform :  perform a release from SCM. This is the command which actually does the release by downloading the tagged version from SCM e.g. SVN or CVS or Git



```

mvn clean build -Dmaven.test.skip=true
mvn clean install -DskipTests
mvn clean install -P<profileName> 
mvn compile exec:java (for sprint-boot alternative: mvn spring-boot:run)

mvn -q -Dexec.executable="echo" -Dexec.args='${project.version}' --non-recursive org.codehaus.mojo:exec-maven-plugin:1.6.0:exec

--------------------------------------------------------------------------------
--- release
--------------------------------------------------------------------------------
Target Project：
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.lyhistory.redis</groupId>
	<artifactId>test-spring-redis</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	...............
</project>

The standard Maven plugin used by a Release Process is the maven-release-plugin – the configuration for this plugin is minimal:
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-release-plugin</artifactId>
   <version>2.4.2</version>
   <configuration>
      <tagNameFormat>v@{project.version}</tagNameFormat>
      <autoVersionSubmodules>true</autoVersionSubmodules>
      <releaseProfiles>releases</releaseProfiles>
   </configuration>
</plugin>

The Release process will interact with the Source Control of the project – this means we first need to define the <scm> element in our pom.xml:
<scm>
    <connection>scm:git:http://xxxxx/test.git</connection>
    <developerConnection>scm:git:http://xxxxx/test.git
    </developerConnection>
    <url>http://xxxxx/test</url>
    <tag>HEAD</tag>
</scm>
or using the git protocol:
<scm>
   <connection>scm:git:git@github.com:user/project.git</connection>
   <url>scm:git:git@github.com:user/project.git</url>
   <developerConnection>scm:git:git@github.com:user/project.git</developerConnection>
</scm>
    
mvn clean -DskipTests -Darguments=-DskipTests release:prepare -e -DreleaseVersion=1.0.3 -DdevelopmentVersion=1.0.4-SNAPSHOT -Dtag="20211008-1.0.3" -DscmDevelopmentCommitComment="prepare for next development iteration 1.0.4-SNAPSHOT"

In order for Maven to be able to release to a Nexus Repository Server, we need to define the repository information via the distributionManagement element:
<distributionManagement>
   <repository>
      <id>nexus-releases</id>
      <url>http://localhost:8081/nexus/content/repositories/releases</url>
   </repository>
</distributionManagement>

mvn release:rollback
mvn release:perform -e -Darguments="-Dmaven.javadoc.skip=true" -s ci_settings.xml


#?Cannot prepare the release because you have local modifications :[pom.xml:modified]
提交pom改动到git
#?Caused by: org.apache.maven.shared.release.ReleaseFailureException: You don't have a SNAPSHOT project in the reactor projects list
pom中version必须是SNAPSHOT后缀 <version>XXX-SNAPSHOT</version>

```



-DskipTests VS -Dmaven.test.skip=true

Maven -> Update Projects
Maven package
ethereumj-core maven package https://github.com/ethereum/ethereumj/issues/1018

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

#### 3.2.5 nexus maven-repositories

https://www.baeldung.com/maven-deploy-nexus

```
  <!-- Publish the versioned releases here -->
 <!-- 配置远程发布到私服,mvn deploy -->
    <distributionManagement>
        <repository>
            <id>nexus</id>
            <name>Nexus Release Repository</name>
            <url>http://XXXXX/repository/maven-releases/</url>
        </repository>
        <snapshotRepository>
            <id>nexus</id>
            <name>Nexus Snapshot Repository</name>
            <url>http://XXXXX/repository/maven-snapshots/</url>
        </snapshotRepository>
    </distributionManagement>

<!-- download artifacts from this repo -->    
<repositories>
        <repository>
            <id>nexus</id>
            <url>http://xxxxx/repository/maven-snapshots/</url>
        </repository>
        <repository>
            <id>aliyun-repo</id>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        </repository>
        <repository>
            <id>maven-repo</id>
            <url>http://xxxxx/repository/maven-central/</url>
        </repository>
    </repositories>
```







## 4.JAVA TUTORIAL
https://github.com/lyhistory/java-learn?organization=lyhistory&organization=lyhistory
https://github.com/lyhistory/learn_coding

### 4.1 JAVA BASICS

JAVA版本：J2SE vs J2ME vs J2EE
https://www.geeksforgeeks.org/j2se-vs-j2me-vs-j2ee-whats-the-difference/

**[POJO VS Java Beans](https://www.tutorialspoint.com/pojo-vs-java-beans)**
POJO: Plain-Old-Java-Object
Java Beans: The only difference between both the classes is Java make java beans objects serialized so that the state of a bean class could be preserved in case required.
So due to this a Java Bean class must either implements Serializable or Externalizable interface.

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
```
Map<String, Test> anotherDataMap = dataMap.entrySet().stream().filter(entry -> entry.getValue().getType() == "1")
.collect(Collectors.toMap(
		e->{return String.format("%s_ddd", e.getValue().getFoo()));}, 
		e->{
			Test test = new Test();
			test.setFoo(e.getValue().getFoo())
			return test;
		})); 
```

future
https://www.baeldung.com/java-future

Java serialization algorithm
https://www.javaworld.com/article/2072752/the-java-serialization-algorithm-revealed.html

java开发之线程（守护线程daemon和用户线程User Thread）
https://blog.csdn.net/mine_song/article/details/72651388

父线程捕获子线程异常需要利用executorservice

**JAXB**
```
xjc -XautoNameResolution -p com.lyhistory.test test.xsd
```
Xjc is a tool of JDK
JAXB2: Xsd to class
Failed with maven plugin generation, work around by using external xjc tool
JAXB Architecture https://docs.oracle.com/cd/E19316-01/819-3669/bnazf/index.html

Marshalling https://www.javatpoint.com/jaxb-marshalling-example

https://github.com/highsource/jaxb2-basics/wiki/Using-JAXB2-Basics-Plugins
http://websystique.com/java/jaxb/jaxb-codegeneration-maven-example/

?# issues: package org.jvnet.jaxb2_commons.lang does not exist https://stackoverflow.com/questions/16833340/jaxb-equals-and-hashcode-gives-error

?# issues: https://github.com/highsource/jaxb2-basics/issues/7
Solved by using external tools generation

GENERATED USING EXTERNAL TOOLS: jaxb-ri-2.3.1
https://javaee.github.io/jaxb-v2/
https://docs.oracle.com/javase/8/docs/technotes/tools/unix/xjc.html
https://thoughts-on-java.org/generate-your-jaxb-classes-in-second/

?#There's no ObjectFactory with an @XmlElementDecl 
JAXBContext jaxbContextForSpan = JAXBContext.newInstance("com.lyhistory.test");

https://stackoverflow.com/questions/12074317/theres-no-objectfactory-with-an-xmlelementdecl

?#customize boolean to 0 1
Customizing JAXB Bindings https://docs.oracle.com/javase/tutorial/jaxb/intro/custom.html
```
xjc -XautoNameResolution -p com.lyhistory.test -extension -b jaxb-bindings.xjb
```

### 4.2 JAVA ADVANCE

java魔术手法： 
	[demo參考](https://github.com/lyhistory/learn_coding/tree/master/java)
cglib增强类+代理
元注解

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

#### 4.2.3 others
Functional reference
Functional Interfaces https://www.baeldung.com/java-8-functional-interfaces
https://www.codementor.io/eh3rrera/using-java-8-method-reference-du10866vx
https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-use-Javas-functional-Consumer-interface-example

## 5.JAVA framework

java有众多的框架，想要理清楚就要清楚其历史和基本框架，比如，

springmvc基于内置tomcat，内置tomcat基于servlet规范实现，servlet支持多种协议，但是通常tomcat只是支持http协议，servlet从3.0之前的BIO发展为之后的NIO支持，而tomcat8又引入了高性能的APR;

从JAVA 1.4起，JDK支持NIO(New IO, 采用os non blocking的工作方式), 使用JDK原生的API开发NIO比较复杂，需要理解Selector、Channel、ByteBuffer三大组件，所以有了mina，netty的封装，很多产品dubbo、spark、zookeeper、elasticSearch都使用netty作为底层通信IO框架支持；

[重点参考我的另一篇笔记 IO发展历史 BIO-NIO-Netty详解](/docs/software/buildingblock/netty)



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

**总体来说，WebService通常是采用HTTP通信，而其他则通常是采用TCP通信，性能上当然是TCP更佳，不过TCP是面向流的，需要处理拆包粘包等底层问题，具体可以参考[network网络基础](https://lyhistory.com/docs/software/network/network)**
> Nowadays we use general purpose applications or libraries to communicate with each other. For example, we often use an HTTP client library to retrieve information from a web server and to invoke a remote procedure call via web services. However, a general purpose protocol or its implementation sometimes does not scale very well. It is like how we don't use a general purpose HTTP server to exchange huge files, e-mail messages, and near-realtime messages such as financial information and multiplayer game data. What's required is a highly optimized protocol implementation that is dedicated to a special purpose. For example, you might want to implement an HTTP server that is optimized for AJAX-based chat application, media streaming, or large file transfer. You could even want to design and implement a whole new protocol that is precisely tailored to your need. Another inevitable case is when you have to deal with a legacy proprietary protocol to ensure the interoperability with an old system. What matters in this case is how quickly we can implement that protocol while not sacrificing the stability and performance of the resulting application.
> https://netty.io/wiki/user-guide-for-4.x.html
RPC is a protocol defined in https://tools.ietf.org/html/rfc1831 , netty is one of the non-blocking io implementation of RPC, 
and also sometimes refer as an architecture style (getUserById?id=1) when comparing with rest style(get /cat/1)
RMI is a protocol and also a low-level RPC implementation, “normally for server to server communication or inter micro services communication, service A invoke methods on service B just as its own function call”; dubbo is an advanced implementation on top of RMI and other protocols, is for distributed services;

WebServices is also a specific implementation of RPC using HTTP protocol, it is also called RPC-Style web service, and one more style is Restful style web service.
Compare: RMI is more performance better than web service, because RMI using tcp while web service using http;
https://www.jianshu.com/p/5b90a4e70783

![](/docs/docs_image/software/java/java06.png)

RPC vs Restful, RPC vs RMI, Rest vs Restful:

![](/docs/docs_image/software/java/java07.png)

rest vs soap
https://www.soapui.org/learn/api/soap-vs-rest-api.html


#### 5.2.2 RPC
RPC框架有很多，比较知名的如阿里的Dubbo、google的gRPC、Go语言的rpcx、Apache的thrift。当然了，还有Spring Cloud，不过对于Spring Cloud来说，RPC只是它的一个功能模块，还有netty（zookeeper使用netty），alipay基于netty的SOFA RPC
技术点：
●	元注解定义
●	网络IO，BIO\[NIO](https://www.javatpoint.com/java-nio-vs-input-output)\AIO，Socket编程，HTTP通信，一个就行。
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
https://github.com/lyhistory/learn_coding/tree/master/java/Components/netty-demo
https://netty.io/wiki/user-guide-for-4.x.html
https://github.com/luxiaoxun/NettyRpc/tree/b811cabebcf20a2551f4ffa746de68ba1e7ebafb
https://juejin.im/post/5c6d7640f265da2de80f5e9c#heading-4

[SofaBolt](https://github.com/sofastack/sofa-bolt)是基于netty进一步封装，更容易使用；

然后SOFA RPC这个微服务中间件采用了SofaBolt基础组件,[蚂蚁通信框架实践](https://mp.weixin.qq.com/s/JRsbK1Un2av9GKmJ8DK7IQ)

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

### 5.3.JNA

Native access https://github.com/java-native-access/jna

外挂钩子

## 6.JVM/JMM

[JVM VS Python VM](https://medium.com/@rahul77349/difference-between-compiler-and-interpreter-with-respect-to-jvm-java-virtual-machine-and-pvm-22fc77ae0eb7)
	JAVA需要经过一次编译成class文件，然后交给JVM跑，Python不需要编译，直接py交给PVM解释运行
	
### 6.1 基本概念
java代码编译-->java class-->JDK安装的JVM翻译成对应操作系统的机器码

javap java.class 可以把汇编指令/机器码反编译成jvm指令/字节码指令；

工具hsdis打印汇编指令；

JVM,java虚拟机，只是给byte code提供解释翻译加载运行的一个工具（通常编程打包的程序都是直接到机器码，比如exe文件是windows的机器码可执行文件，Java语言设计只默认编译成中间语言byte code字节码，不编译成最终的机器码，然后jvm就会去解释执行），实际上不只是java语言，任何语言只要能转成bytecode 字节码都可以交由jvm加载，jvm会找到主程序并根据当前的操作系统解释成机器码运行；

JVM是一份本地化的程序，本质上是可执行的文件，是静态的概念。
/jre/bin/server/jvm.dll

程序运行起来成为进程，是动态的概念。java程序是跑在JVM上的，严格来讲，是跑在JVM实例上的，一个JVM实例其实就是JVM跑起来的进程，二者合起来称之为一个JAVA进程。各个JVM实例之间是相互隔离的。

![](/docs/docs_image/software/java/java_jvm01.png)

字节码引擎对应jvm指令:[Java bytecode instruction listings](https://en.wikipedia.org/wiki/Java_bytecode_instruction_listings)

线程栈：栈帧的先进先出（异步方法呢？）

栈帧：对应每个线程中调用的方法，相应概念：
	局部变量表
	操作数栈
	动态链接
	方法出口

本地方法：	Native method Stack，比如JNI调用c/C++程序

方法区 Method Area： 静态变量

**堆heap**

字节码引擎后在后台线程执行垃圾收集（minor gc和full gc），当发生垃圾收集的时候，会stop the world暂停当前活跃的线程

gc root

object header 分代年龄

minor gc： 对象new除了后先放到新生代，满了后触发minor gc，挪到from(survivor0)，后面就在from(survivor0) to(survivor1)之间周转，直到被回收，或者直到年龄到达15，被挪到老生代

老生代包含：
	1.长生不死的对象 （比如web服务的bean对象，线程池对象等）
	2.大对象
	3.动态年龄判断
	
full gc：老年代满了会触发

jdk调优工具jvisualvm （插件 visualgc）

![](/docs/docs_image/software/java/java_jvm02.png)

图中下部分给出了调优的例子

[双十一电商网站亿级流量JVM调优实战视频教程全集](https://www.bilibili.com/video/av74868832/)

**JMM**

[JSR 133规范](https://jcp.org/en/jsr/detail?id=133)

openJDK, IBM JDK, 阿里巴巴内部定制JVM

Java 内存模型对主内存与工作内存之间的具体交互协议定义了八种操作，具体如下：
+ lock（锁定）：作用于主内存变量，把一个变量标识为一条线程独占状态。
+ unlock（解锁）：作用于主内存变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
+ read（读取）：作用于主内存变量，把一个变量从主内存传输到线程的工作内存中，以便随后的 load 动作使用。
+ load（载入）：作用于工作内存变量，把 read 操作从主内存中得到的变量值放入工作内存的变量副本中。
+ use（使用）：作用于工作内存变量，把工作内存中的一个变量值传递给执行引擎，每当虚拟机遇到一个需要使用变量值的字节码指令时执行此操作。
+ assign（赋值）：作用于工作内存变量，把一个从执行引擎接收的值赋值给工作内存的变量，每当虚拟机遇到一个需要给变量进行赋值的字节码指令时执行此操作。
+ store（存储）：作用于工作内存变量，把工作内存中一个变量的值传递到主内存中，以便后续 write 操作。
+ write（写入）：作用于主内存变量，把 store 操作从工作内存中得到的值放入主内存变量中。

![](/docs/docs_image/software/java/java_jmm01.png)

默认如图采用缓存一致性：MESI一致性协议
	总线消息；总线嗅探；总线裁决；
	指令重排 https://efectivejava.blogspot.com/2013/07/what-is-reordering-in-java-when-you.html
	
总线锁，如果是跨多个缓存行则采取总线锁

volatile避免指令重排，图下部分可见，volatile并不能保证线程安全（线程1最终并非基于线程2的最新结果2加1，而是基于旧的值1计算，虽然知道线程2修改的结果，但是它的做法是直接覆盖！）	

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

### 6.2 JVM Crash debug
troubleshooting with hotspot vm
https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/index.html
https://enos.itcollege.ee/~jpoial/allalaadimised/reading/JVM_Troubleshooting_Guide.pdf
https://www.javaadvent.com/2021/12/diagnosing_a_jvm_crash.html

core file(core.XXX):
In case of a JVM crash, the operating system creates a core dump file which is a memory snapshot of a running process. A core dump is created by the operating system when a fatal or unhandled error like signal or system exception occurs.
https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/dumpfile.html

https://www.javaadvent.com/2021/12/diagnosing_a_jvm_crash.html

如果是Oracle的jdk，可以使用bin下面的 jvisualvm 可视化工具打开分析core文件

#### 6.2.1 Hsdb
```
hsdb> help
Available commands:
  assert true | false
  attach pid | exec core
  buildreplayjars [ all | app | boot ]  | [ prefix ]
  class name
  classes
  detach
  dis address [length]
  disassemble address
  dumpcfg { -a | id }
  dumpclass { address | name } [ directory ]
  dumpcodecache
  dumpheap [ file ]
  dumpideal { -a | id }
  dumpilt { -a | id }
  dumpreplaydata { <address > | -a | <thread_id> }
  echo [ true | false ]
  examine [ address/count ] | [ address,address]
  field [ type [ name fieldtype isStatic offset address ] ]
  findpc address
  flags [ flag | -nd ]
  help [ command ]
  history
  inspect expression
  intConstant [ name [ value ] ]
  jdis address
  jhisto
  jseval script
  jsload file
  jstack [-v]
  livenmethods
  longConstant [ name [ value ] ]
  mem address [ length ]
  pmap
  print expression
  printall
  printas type expression
  printmdo [ -a | expression ]
  printstatics [ type ]
  pstack [-v]
  quit
  reattach
  revptrs address
  scanoops start end [ type ]
  search [ heap | perm | rawheap | codecache | threads ] value
  source filename
  symbol address
  symboldump
  symboltable name
  sysprops
  thread { -a | id }
  threads
  tokenize ...
  type [ type [ name super isOop isInteger isUnsigned size ] ]
  universe
  verbose true | false
  versioncheck [ true | false ]
  vmstructsdump
  whatis address
  where { -a | id }


```


版本问题，如果产品上装了多个JVM环境的化，注意core dump要和JVM的分析的版本一致（比如用的是openjdk还是oracle的）
SA环境需要root权限

案例分享：如何通过JVM crash 的日志和core dump定位和分析Instrument引起的JVM crash
https://blog.csdn.net/raintungli/article/details/77790829
https://blog.csdn.net/qq_31865983/article/details/98480703



```

java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB
java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB $JAVA_HOME/bin/java /opt/core.10759
java -cp .:/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.x86_64/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.x86_64/bin/java /opt/core.10759

hsdb> threads
.....
30977 main
hsdb> where 30977
Thread 30977 Address: 0x00007fbd80008800

Java Stack Trace for main
Thread state = BLOCKED

hsdb> jhisto
```
### 6.3 More

#### 6.2.2 Java外挂
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

[Java和Spring全面demo源码](https://github.com/eugenp/tutorials)

[Java远程调试（Remote Debugging）的那些事](https://www.jianshu.com/p/d168ecdce022)

<disqus/>