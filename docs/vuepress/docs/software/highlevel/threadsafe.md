---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《线程安全》

## 1.多线程与竞争资源

**什么时候需要多线程?**

1).处理并发，关于并发我说过不一定要用多线程，单线程也可以处理并且效率更高，
但是实际情况下仅仅靠单线程是不够的，一般是主线程为单线程，加上辅助线程处理；
另外有时候不算是很高的并发还是用多线程处理比较简便；

比如数据库的连接，
webscoket的连接等；

2).需要长时间处理的程序，要开线程放到后台处理，比如生成报告；

**什么是critical resource竞争资源？**
多线程自然涉及到线程安全问题，根本在于是否存在critical resource竞争资源，
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

2）另一种方式自然是“不加锁”，网上经常混淆各种概念，总结一下无锁基本两种思路：

+ 引入一个有界或无界队列来排队，实际上队列也分为有锁和无锁的，具体可以看我前面写的[并发控制concurrent](/docs/software/highlevel/concurrent)，
所以相当于把多线程的水龙头对接到一个队列上，把对共享资源的访问通过排队的方式隔离开，至于队列本身的实现同样可以参考我写的并发控制一章，所以多线程安全问题转换成了如何排队的问题；

+ 乐观锁方式比如CAS Atomic https://blog.csdn.net/javazejian/article/details/72772470


**另一个引起线程安全问题的原因：JMM优化引起的指令重排instruction reordering**


## 2.深入解读

### 2.1 内存模型与竞争资源

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


### 2.2 静态static与单例singleton的线程安全

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

