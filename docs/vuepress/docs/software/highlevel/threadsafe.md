---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《线程安全》

关键词：
并发 并行 高并发 低并发 互斥 同步 异步 单线程 多线程

程序，进程 线程 协程/纤程quasar

程序是静态的编码，是有序指令的集合，是存放在硬盘的文件，被组织成：正文段（指令集） + 用户数据段（数据）；
进程是动态的，程序加载到内存中，分配内存空间，存放正文段（指令集） + 用户数据段（栈 + 堆） + 系统数据段（PCB等系统用到的数据结构），正式定义：所谓进程是由正文段（text）、用户数据段（user segment）以及系统数据段（system　segment）共同组成的一个执行环境；
线程是一个进程的最小执行单元；


## 1.线程安全：多线程与单线程

![](/docs/docs_image/software/threadsafe/threadsafe00.png)

**同步 异步 单线程 多线程?**
同步，意思是后面操作的输入依赖于前面操作的输出，只能按顺序执行，如果所有操作都是同步的，这种情况一般都是用单线程；
当然了并不是说同步一定是单线程编程，多个线程设置进程之间一样可以实现同步，只不过是互相等待；
因为真实的程序世界并不是非同步就异步，而是两者都有；
异步也并不意味着要多线程，异步强调的是非阻塞，是一种编程模式（pattern），多线程只是一种实现方式，另一种实现方式就是单线程event loop，
引用我在[java实用基础](/docs/software/java)一文中的描述:
> 举例餐厅比喻web应用，传统的blocking做法是，有个http pool（.net的http handler或java的servlet），pool就是一个工作组，工作组里的每个服务员都是处理线程，当一个客人即web request进来时，餐厅立马分配一个服务员给这个客户，全程服务，直到客人离开（http response或者websocket断开连接），整个过程中这个服务员是被独占的，所以是阻塞式；
> 而假设换一种做法，类似于nodejs和netty的event loop单线程处理方式，餐厅只请一个服务员，第一个客人过来之后，服务员过来安排座位，记下菜单，然后发送给后厨，然后同时第二个客人来了，服务员立马过去做同样的事情，因为是非阻塞式的，在后厨做好饭，服务员端给第一个客人之前，服务员可以利用空余时间去服务其他客人，比如刚才的场景，或者其他服务员要加餐等等，这就是所谓的java响应式编程；
> 可能有人会疑惑具体什么机制让单线程可以处理并发，很多人之前还以为只有多线程才能产生并发，换个问题：单核时代是如何实现的并发，并发是个宏观的概念，单核微观上同一个时刻只可能处理一个task，只是其他线程在排队等待，然后分片迅速切换，所以nodejs的单线程也是一样的办法，进行排队；再进一步上升到架构角度看，架构中采用message queue的方式也是一种排队处理的扩展方式，下游可以增加多个消费者；

**什么时候需要多线程?**

1).处理并发，关于并发我说过不一定要用多线程，单线程也可以处理并且效率更高，
但是实际情况下仅仅靠单线程是不够的，一般是主线程为单线程，加上辅助线程处理；
另外有时候不算是很高的并发还是用多线程处理比较简便；

比如数据库的连接，
webscoket的连接等；

2).需要长时间处理的程序，要开线程放到后台处理，比如生成报告；

**什么是critical resource竞争资源？**
跟前面同步完全相反的概念是互斥，互斥是指进程间相互排斥的使用临界资源的现象；
多线程自然涉及到线程安全问题，根本在于是否存在互斥，critical resource竞争资源，
如果多线程不会访问竞争资源就不存在安全问题，否则则要处理，首先要看不同的线程是否在竞争同一个资源：
	如果是各自访问其上下文context的资源，比如kafka consumer partition worker线程访问各自的storage则是互相不打扰的；
	如果执行的某个方法内只用到了局部变量，由于局部变量位于各自thread的栈里，所以互不干扰；
	如果执行的某个方法用到了传入的变量，也就是所谓的形式参数变量，则要看这个传入的变量是否是object，如果只是普通的参数则没关系，如果是对象，要看对象是否是同一个引用，不同引用没有关系；
	如果执行的某个方法内用到了同一个引用，不管是传入的还是外部全局的变量，比如log4的logger，由于log4已经做好了线程安全写log，所以不用担心；
	如果执行的某个方法内用到了同一个引用：
		i)但是只是读没有写，读和读是没有冲突的，也没有关系;
		ii)都有写，但是写不依赖于读，即线程不需要获取“最新”数据就可以直接写入覆盖，这种情况也没有关系；
		iii)都有写，而且写依赖于读到最新数据，则需要处理；
		iv)补充一种情况，两个线程A和B,A先读取，然后B再写入修改同一个数据，这种情况不会有线程安全问题，读写不会竞争，但是会有可见性问题（根据下面提到的缓存模型，线程A可能看不到B修改后的数据）


**如何保证多线程在竞争资源时的安全？**

1）多线程编程安全最“简单”的方式就是加锁；
	锁升级：偏向锁（不加锁，记录threadid）、自旋锁（占用cpu，死循环等待）、重量级锁（内核态，操作系统级别）

2）另一种方式自然是“不加锁”，网上经常混淆各种概念，总结一下无锁基本两种思路：

+ 引入一个有界或无界队列来排队，实际上队列也分为有锁和无锁的，具体可以看我前面写的[并发控制concurrent](/docs/software/highlevel/concurrent)，
所以相当于把多线程的水龙头对接到一个队列上，把对共享资源的访问通过排队的方式隔离开，至于队列本身的实现同样可以参考我写的并发控制一章，所以多线程安全问题转换成了如何排队的问题；

+ 乐观锁方式比如CAS Atomic https://blog.csdn.net/javazejian/article/details/72772470


**关于线程安全问题，还有两个不可忽视的重要问题，比如高并发下引起的jmm内存溢出，以及jvm优化的指令重排问题instruction reordering**

一般高并发引起的jmm full gc及内存溢出不归类于线程安全问题，因为其引起的原因是因为内存的分配不合理加上高并发/高频内存分配引起的问题，但是我这里并没有说“多”线程还是“单”线程，
所以总归也是属于线程问题，full gc到溢出也绝对属于安全问题；

而多线程会涉及到另外一个[指令重排的问题](https://efectivejava.blogspot.com/2013/07/what-is-reordering-in-java-when-you.html)，
指令重排有两个条件：
a)首先在单线程下，编译器、runtime和处理器都必须遵守as-if-serial语义，不管怎么重排序（编译器和处理器为了提高并行度），单线程序的执行结果不能被改变。
b)存在数据依赖关系的不允许重排序

**总结一下:**
不管并发问题需不需要多线程来处理，多线程本身自然是引入了并发问题，又是鸡生蛋蛋生鸡的问题，并发访问竞争资源就会产生：幻读、不可重复读、脏读等读写冲突问题，对于一个应用程序来说，
任何一个环节都可能有问题，数据库层面已经帮我们做好了一定程度的处理，参考我在[并发一文中提到的数据库隔离水平](/docs/software/highlevel/concurrent)，但是应用层还需要我们自己做好处理，另外过高的并发还可能引起内存溢出、指令重排，
这个又涉及到底层比如JVM级别的优化处理；

## 2.深入解读

### 2.1 锁升级

我们现在以java的上下文来探讨锁机制，

想想多线程竞争资源的本质，想安全的使用竞争资源就需要一种“锁”机制，注意，有人可能会说不是说不用锁也可以么，java的上下文中，“无锁”也是一种“锁”，java锁的本质就是在对象头的标志位更改；

然后再抽象的说，多线程竞争资源做到安全获取锁，本质就是通过锁这种机制获取对资源的临时占有，关键问题是在jvm中就完成，还是要下到内核中去完成，在jvm中完成就是相对轻量级的锁，如果需要操作系统介入，交给内核去处理就是相对重量级的锁，由于jvm用户态的线程跟内核态的线程是有一一对应关系的，所以再换句话说，线程的切换是在用户态就完成，还是要到内核态去切换

synchronized锁升级和jol https://www.cnblogs.com/katsu2017/p/12610002.html

synchronized锁升级优化 https://zhuanlan.zhihu.com/p/92808298

https://zhuanlan.zhihu.com/p/61892830
jvm用户态的线程和内核的线程的对应关系；

JDK1.2之前，绿色线程——用户线程。JDK1.2——基于操作系统原生线程模型来实现。Sun JDK,它的Windows版本和Linux版本都使用一对一的线程模型实现，一条Java线程就映射到一条轻量级进程之中。
Solaris同时支持一对一和多对多。

重量级是指需要内核态的参与（操作系统、内核、系统总线、南北桥）；

jdk1.6之前 synchronize是重量级，之后实现上变成了是轻量级

所谓的锁升级，各种级别的锁，实际判断或者改变的是实例的头部header

无锁态

偏向锁

自旋锁（说白了就是死循环等待，一般是依赖于CAS实现，CAS是通过cpu原语LOCK_IF_MP锁定整个消息总线的方式保证原子性，所以可见整个过程没有真正的锁，是通过CAS底层原子性来实现的“锁机制”）
消耗内存
等待时间长；
等待线程多；

特别的对于CAS实现来说，如果大量写不适合；

升级到重量级



自旋锁举例：实现CAS算法的乐观锁

Java中CAS底层实现原理分析cpu的原语**LOCK_IF_MP** https://my.oschina.net/u/4339514/blog/4181506/print



### 2.2 内存模型与竞争资源

![](/docs/docs_image/software/threadsafe/threadsafe01.png)

不同的系统内存缓存模型可能不同，甚至有的没有缓存，https://developpaper.com/what-exactly-does-volatile-solve/
[多核共享内存](https://software.intel.com/en-us/articles/software-techniques-for-shared-cache-multi-core-systems)
![共享内存模型](https://software.intel.com/sites/default/files/m/d/4/1/d/8/286506_286506.gif)

[volatile和synchronized到底啥区别？多图文讲解告诉你](https://mp.weixin.qq.com/s/MHqXNRI6udI1wGCU0NVBaQ)
synchronized 是独占锁/排他锁，而volatile不是排他的，根据下面内存模型可以知道，volatile只是说不用L1 L2缓存，直接读写主内存，只有在写入不依赖读的情况下才可以用volatile，
否则只要是竞争资源就不可以用volatile，换句话说volatile解决的是上面提到的“可见性”问题，但是不能解决线程安全问题，至于原因在/docs/software/java 关于JMM部分提到了

![](/docs/docs_image/software/java/java_jmm01.png)

JMM即java内存模型规范是个抽象概念，本质上跟上面所描述的cpu缓存模型是类似的，当然有其标准如[JSR 133规范](https://jcp.org/en/jsr/detail?id=133)

高并发下JMM的指令重排(volatile可以禁用指令重排)


### 2.3 静态static与单例singleton的线程安全

关于static及singleton：
	Singleton可以是static的，static是vm级别的静态变量，singleton可以是application级别的单例，如果是vm级别的，需要考虑application之间的冲突,如果是standalone程序，则可以使用vm static，引用一段shiro关于SecurityManager的注释：
```
The Shiro development team prefers that SecurityManager instances are non-static application singletons
 	* and <em>not</em> VM static singletons.  Application singletons that do not use static memory require some sort
 	* of application configuration framework to maintain the application-wide SecurityManager instance for you
 	* (for example, Spring or EJB3 environments) such that the object reference does not need to be static.
```

singleton is created at Class-load time:

![](/docs/docs_image/software/threadsafe/threadsafe02.png)

Static method defeat OOP, because static method is not object behavior, 
For thread safe, we should look at static variable not static method/instruction
t’s not the static methods that you have to watch out for – it’s the static fields.

https://stackoverflow.com/questions/7026507/why-are-static-variables-considered-evil

静态变量经常用作全局初始化的global state：
init(write at application start) and used(read) from everywhere, 比如ConcurrentDictionary

静态方法线程安全？No
	Many of the classes in the .NET framework have the following remark in the “Thread Safety” section: 
	> "Any public static (Shared in Visual Basic) members of this type are thread safe. Any instance members are not guaranteed to be thread safe.
	"Does this mean static methods are inherently thread safe? The answer is no. Classes with the above note will have thread safe static methods because the Microsoft engineers wrote the code in a thread safe manner, perhaps by using locks or other thread synchronization mechanisms
	File.Open(XXX)
	String.XXX	
	
单例模式例子：
	Plugin Example: log4net
	Log4net Thread-Safe but not Process-Safe
	http://hectorcorrea.com/blog/log4net-thread-safe-but-not-process-safe/17


#### Use it in thread-safe way
System.timer
It will Continue Executing on different thread
So set autoreset=false

Message queue, multiple consumer retrieve messages from queue.

Refer:
https://odetocode.com/articles/313.aspx



## 3.拓展：进程安全

对于分布式系统来说，同样存在着访问竞争资源的问题，比如最基本的是竞争称为leader，这个一般就需要采用一种“分布式锁”来进行资源保护，

分布式锁的常见实现方式：
+ 基于数据库 select for update
+ 基于redis
+ 基于zookeeper的ephemeral sequential node

