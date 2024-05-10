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



刚开始工作的时候也曾天真的认为使用一些看起来线程安全的工具类就可以让程序线程安全，比如：[使用ConcurrentHashMap一定线程安全？](https://juejin.im/post/5cb846a85188253772753d36) 

实际情况复杂的多




## 线程安全概述

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

1）多线程编程安全最“简单”的方式就是加锁（悲观锁）；
锁升级：偏向锁（不加锁，记录threadid）、自旋锁（占用cpu，死循环等待）、重量级锁（内核态，操作系统级别）
Java 中实现悲观锁的方式主要有以下两种：
+ synchronized 关键字：Java 中最常见的实现悲观锁的方式就是使用 synchronized 关键字。当一个线程进入代码块时，其他线程会被阻塞，直到当前线程执行完毕。

+ Lock 接口：Java 5 提供了 Lock 接口来替代 synchronized 关键字。Lock 接口中定义了 lock() 和 unlock() 方法，用来上锁和解锁。与 synchronized 不同的是，Lock 接口支持公平锁和非公平锁两种方式，并且可以在特定时间内尝试获取锁。

悲观锁的优点是可以保证数据操作的一致性，避免并发冲突。但是它会导致系统资源利用不充分、效率低下，因为所有其他线程只有等待当前线程释放锁之后才能执行。

2）另一种方式自然是“不加锁”，网上经常混淆各种概念，总结一下无锁基本两种思路：

+ 乐观锁方式
	- 版本号机制：数据库中记录每条数据更新的版本号，在更新某条数据时，先取出当前的版本号，然后将新的版本号加 1，并且与原版本号进行比较。如果两个版本号相同，则说明数据未被其他线程修改，可以执行更新操作；如果不同，则表示有其他线程已经修改过该数据，需要重新获取最新版本号再试一次。

	- 时间戳机制：数据库中记录每条数据修改的时间戳。当有线程要更新数据时，它会通过比较自己持有的时间戳和数据库中的时间戳来判断该数据是否被其他线程修改过。如果时间戳相同，则更新成功；如果不同，则需要重新获取最新时间戳并重试。
	
	乐观锁的优点是能够充分利用系统资源，提高并发性。但是，由于多个线程可以同时对同一数据进行操作，因此会导致版本号（或时间戳）频繁变化，需要额外的开销用于维护版本号。
	本质就是基于CAS实现的，
	[java中常见的就是基于CAS AtomicInteger或AtomicReference（注意：1.AtomicInteger本身是自旋锁 2.AtomicInteger在多核的情况下依然会有锁LOCK_IF_MP） ](#cas-compare-and-swap-自旋锁java-atomicinteger-为例)
	
+ 引入一个有界或无界队列来排队，实际上队列也分为有锁和无锁的，具体可以看我前面写的[并发控制concurrent](/docs/software/highlevel/concurrent)，
	所以相当于把多线程的水龙头对接到一个队列上，把对共享资源的访问通过排队的方式隔离开，至于队列本身的实现同样可以参考我写的并发控制一章，所以多线程安全问题转换成了如何排队的问题；
	例如： LMAX开发的Disruptor就是这么一个无锁高性能有界循环队列，其内部实现没有研究过，估计也是乐观锁的方式

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



## 内存模型与竞争资源

到底什么是内存模型呢？看到有两种不同的观点：

A：内存模型是用来描述编程语言在支持多线程编程中对共享内存访问的顺序。
B：内存模型的本质是指在单线程情况下CPU指令在多大程度上发生指令重排(Reorder) [1]。

实际上A，B两种说法都是正确的，只不过是在尝试从不同的角度去说明memory model的概念。不过个人认为，内存模型表达为“内存顺序模型”可能更加贴切一点。
一个良好的memory model定义包含3个方面：

Atomic Operations
Partial order of operations
Visable effects of operations

这里要强调的是：

我们这里所说的内存模型和CPU的体系结构、编译器实现和编程语言规范（ C/C++和Java等不同的编程语言都有定义内存模型相关规范。）3个层面都有关系。

+ jmm
+ C++11引入memory order的意义在于：在语言层提供了一个与运行平台无关和编译器无关的标准库， 让我们可以在high level languange层面实现对多处理器对共享内存的交互式控制。 https://juejin.cn/post/7350089511291289615

https://www.youtube.com/watch?v=Sa08x_NMZIg

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

指令重排 memory reorder instruction reorder
编译期重排 运行期重排

## 锁机制解读

### CAS-compare and swap 自旋锁(java AtomicInteger 为例)

还是以 i++ 为例

```
public class AtomicIntegerTest {
    private static int count = 0;

    public static void increment() {
        count++;
    }

    public static void main(String[] args) {
        IntStream.range(0, 100)
                .forEach(i->
                        new Thread(()->IntStream.range(0, 1000)
                                .forEach(j->increment())).start());

        // 这里使用2或者1看自己的机器
        // 我这里是用run跑大于2才会退出循环
        // 但是用debug跑大于1就会退出循环了
        while (Thread.activeCount() > 1) {
            // 让出CPU
            Thread.yield();
        }

        System.out.println(count);
    }
}

这里起了100个线程，每个线程对count自增1000次，你会发现每次运行的结果都不一样，但它们有个共同点就是都不到100000次，所以直接使用int是有问题的。

public class AtomicIntegerTest {
    private static AtomicInteger count = new AtomicInteger(0);

    public static void increment() {
        count.incrementAndGet();
    }

    public static void main(String[] args) {
        IntStream.range(0, 100)
                .forEach(i->
                        new Thread(()->IntStream.range(0, 1000)
                                .forEach(j->increment())).start());

        // 这里使用2或者1看自己的机器
        // 我这里是用run跑大于2才会退出循环
        // 但是用debug跑大于1就会退出循环了
        while (Thread.activeCount() > 1) {
            // 让出CPU
            Thread.yield();
        }

        System.out.println(count);
    }
}
这里总是会打印出100000。
```
todo 整理：https://xie.infoq.cn/article/79fd68d510b0a52324d6ca7e1 + https://xie.infoq.cn/article/5b2731c61bd4e7966c898314d + https://my.oschina.net/u/4339514/blog/4181506/print

https://blog.csdn.net/fengyuyeguirenenen/article/details/123646048

https://juejin.cn/post/7075293889271169060#heading-10

多核仍然要lock - Java中CAS底层实现原理分析cpu的原语**LOCK_IF_MP**

自旋锁举例：实现CAS算法的乐观锁
```
/**
 * 题目：实现一个自旋锁
 * 自旋锁好处：循环比较获取没有类似wait的阻塞。
 *
 * 通过CAS操作完成自旋锁，A线程先进来调用myLock方法自己持有锁5秒钟，B随后进来后发现
 * 当前有线程持有锁，不是null，所以只能通过自旋等待，直到A释放锁后B随后抢到。
 */
public class SpinLockDemo
{
    AtomicReference<Thread> atomicReference = new AtomicReference<>();

    public void myLock()
    {
        Thread thread = Thread.currentThread();
        System.out.println(Thread.currentThread().getName()+"\t come in");
        while(!atomicReference.compareAndSet(null,thread))
        {

        }
    }

    public void myUnLock()
    {
        Thread thread = Thread.currentThread();
        atomicReference.compareAndSet(thread,null);
        System.out.println(Thread.currentThread().getName()+"\t myUnLock over");
    }

    public static void main(String[] args)
    {
        SpinLockDemo spinLockDemo = new SpinLockDemo();

        new Thread(() -> {
            spinLockDemo.myLock();
            try { TimeUnit.SECONDS.sleep( 5 ); } catch (InterruptedException e) { e.printStackTrace(); }
            spinLockDemo.myUnLock();
        },"A").start();

        //暂停一会儿线程，保证A线程先于B线程启动并完成
        try { TimeUnit.SECONDS.sleep( 1 ); } catch (InterruptedException e) { e.printStackTrace(); }

        new Thread(() -> {
            spinLockDemo.myLock();
            spinLockDemo.myUnLock();
        },"B").start();

    }
}

```

CAS虽然很高效的解决了原子操作问题，但是CAS仍然存在三大问题。
+ 循环时间长开销很大。
+ 只能保证一个共享变量的原子操作。
+ ABA问题。

https://cloud.tencent.com/developer/article/1614763

https://blog.csdn.net/javazejian/article/details/72772470

### 锁升级（状态变化）

Synchronized 使用的是用户态的CAS 而futex的 CAS是内核态 

Mutual exclusion (mutex) algorithms are used to prevent processes simultaneously using a common resource. A fast user-space mutex (futex) is a tool that allows a user-space thread to claim a mutex without requiring a context switch to kernel space, provided the mutex is not already held by another thread.

#### linux 锁 - futex

futex不是个完整的锁，他是“支持实现userspace的锁的building block“。也就是说，如果你想实现一个mutex，但不想把整个mutex都弄到内核里面去，可以通过futex来实现。但futex本身主要就是俩系统调用futex_wait和futex_wake.

https://www.zhihu.com/question/393124801/answer/1210081499


#### C++ 锁 - mutex

https://zhuanlan.zhihu.com/p/345530854
https://www.geeksforgeeks.org/mutex-lock-for-linux-thread-synchronization/

#### java锁 - synchronized/lock()

https://tech.meituan.com/2018/11/15/java-lock.html

|          锁/类型          | 公平/非公平锁 | 可重入/不可重入锁 |   共享/独享锁    | 乐观/悲观锁 |
|------------------------|---------|-----------|-------------|--------|
|      synchronized      |  非公平锁   |   可重入锁    |     独享锁     |  悲观锁   |
|     ReentrantLock      |   都支持   |   可重入锁    |     独享锁     |  悲观锁   |
| ReentrantReadWriteLock |   都支持   |   可重入锁    | 读锁-共享，写锁-独享 |  悲观锁   |


https://cloud.tencent.com/developer/article/1082708

想想多线程竞争资源的本质，想安全的使用竞争资源就需要一种“锁”机制，注意，有人可能会说不是说不用锁也可以么，java的上下文中，“无锁”也是一种“锁”，java锁的本质就是在对象头的标志位更改；

然后再抽象的说，多线程竞争资源做到安全获取锁，本质就是通过锁这种机制获取对资源的临时占有，关键问题是在jvm中就完成，还是要下到内核中去完成，在jvm中完成就是相对轻量级的锁，如果需要操作系统介入，交给内核去处理就是相对重量级的锁，由于jvm用户态的线程跟内核态的线程是有一一对应关系的，所以再换句话说，线程的切换是在用户态就完成，还是要到内核态去切换

synchronized锁升级和jol https://www.cnblogs.com/katsu2017/p/12610002.html

synchronized锁升级优化 https://zhuanlan.zhihu.com/p/92808298

https://zhuanlan.zhihu.com/p/61892830
jvm用户态的线程和内核的线程的对应关系；

JDK1.2之前，绿色线程——用户线程。JDK1.2——基于操作系统原生线程模型来实现。Sun JDK,它的Windows版本和Linux版本都使用一对一的线程模型实现，一条Java线程就映射到一条轻量级进程之中。
Solaris同时支持一对一和多对多。

重量级是指需要内核态的参与（操作系统、内核、系统总线、南北桥）；

JDK 1.6之前，synchronized 还是一个重量级锁，是一个效率比较低下的锁。但是在JDK 1.6后，JVM为了提高锁的获取与释放效率对synchronized 进行了优化，引入了偏向锁和轻量级锁 ，从此以后锁的状态就有了四种：无锁、偏向锁、轻量级锁、重量级锁。并且四种状态会随着竞争的情况逐渐升级，而且是不可逆的过程，即不可降级，这四种锁的级别由低到高依次是：无锁、偏向锁，轻量级锁，重量级锁。

无锁态

偏向锁

自旋锁（说白了就是死循环等待，一般是依赖于CAS实现，CAS是通过cpu原语LOCK_IF_MP锁定整个消息总线的方式保证原子性，所以可见整个过程没有真正的锁，是通过CAS底层原子性来实现的“锁机制”）
消耗内存
等待时间长；
等待线程多；

特别的对于CAS实现来说，如果大量写不适合；

升级到重量级


例子：blockingqueue https://www.cnblogs.com/WangHaiMing/p/8798709.html

## 编程考虑
### 局部变量线程安全?

+ 普通的局部变量确实是线程安全的,
  [方法里的局部变量，因为不会和其他线程共享，所以不会存在并发问题。这种解决问题的技术也叫做线程封闭。官方的解释为：仅在单线程内访问数据。由于不存在共享，所以即使不设置同步，也不会出现并发问题！](https://www.cnblogs.com/binghe001/p/12808419.html)
+ 但是如果引用的是全局变量就不安全了

### 静态static与单例singleton的线程安全

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


### Use it in thread-safe way
System.timer
It will Continue Executing on different thread
So set autoreset=false

Message queue, multiple consumer retrieve messages from queue.

Refer:
https://odetocode.com/articles/313.aspx


todo:
Java Concurrency issues and Thread Synchronization
https://www.callicoder.com/java-concurrency-issues-and-thread-synchronization/#:~:text=Memory%20inconsistency%20errors%20occur%20when,up%20using%20the%20old%20data.

----

concurrency queue

concurrency dictionary

C#在多线程环境中，进行安全遍历操作

http://stanzhai.github.io/2013/06/27/csharp-read-data-in-multithread-safely/

Implementing the Singleton Pattern in C#

http://csharpindepth.com/Articles/General/Singleton.aspx

Thread Safety In C# [www.c-sharpcorner.com/UploadFile/1c8574/thread-safety369/](http://www.c-sharpcorner.com/UploadFile/1c8574/thread-safety369/)

System.timer Thread.timer

腾讯面试官：如何停止一个正在运行的线程？
https://mp.weixin.qq.com/s/9xjGYbcNwl1aQY5GNOx58g

## 进程安全 - 分布式锁

对于分布式系统来说，同样存在着访问竞争资源的问题，比如最基本的是竞争称为leader，这个一般就需要采用一种“分布式锁”来进行资源保护，

分布式锁的常见实现方式：
+ 基于数据库 select for update
+ 基于redis
+ 基于zookeeper的ephemeral sequential node

## Troubleshooting
### Servlet Concurrent

```
2024-01-15 08:08:37.018 [31mERROR[m [35m26037GG[m [io-10001-exec-3] [36mc.q.f.w.a.CommonExceptionHandler[m : InternalException: null

java.util.ConcurrentModificationException
	at java.util.HashMap$HashIterator.nextNode(HashMap.java:1429)
	at java.util.HashMap$KeyIterator.next(HashMap.java:1453)
	at com.test.security.SessionInterceptor.preHandle(SessionInterceptor.java:36)
	at org.springframework.web.servlet.HandlerExecutionChain.applyPreHandle(HandlerExecutionChain.java:148)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1055)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:962)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)
	at org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:909)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:652)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:733)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:112)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:61)
	at org.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)
	at org.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
	at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)
	at org.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)
	at org.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
	at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)
	at org.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)
	at org.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
	at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)
	at org.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)
	at org.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
	at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)
	at org.apache.shiro.web.servlet.AbstractShiroFilter.executeChain(AbstractShiroFilter.java:449)
	at org.apache.shiro.web.servlet.AbstractShiroFilter$1.call(AbstractShiroFilter.java:365)
	at org.apache.shiro.subject.support.SubjectCallable.doCall(SubjectCallable.java:90)
	at org.apache.shiro.subject.support.SubjectCallable.call(SubjectCallable.java:83)
	at org.apache.shiro.subject.support.DelegatingSubject.execute(DelegatingSubject.java:387)
	at org.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:362)
	at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:358)
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:271)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at com.alibaba.druid.support.http.WebStatFilter.doFilter(WebStatFilter.java:123)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.boot.actuate.metrics.web.servlet.WebMvcMetricsFilter.doFilterInternal(WebMvcMetricsFilter.java:93)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:202)
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:542)
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:143)
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:357)
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:374)
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:893)
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1707)
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
	at java.lang.Thread.run(Thread.java:745)
```

对应代码是
```
@Component
public class SessionInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(SessionInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession httpSession = request.getSession();
        if(null == httpSession.getId()){
            return true;
        }
        ServletContext application = httpSession.getServletContext();
        SSOUser ssoUser = (SSOUser) httpSession.getAttribute("LoginSessionUser");
        // 在application范围由一个HashSet集保存所有的session
        HashSet<OnlineUserDto> onlineUserSet = (HashSet) application.getAttribute("onlineUser");
     。。。。。。。。。。。。。。。。。。。。。。。。。。
        }
        return true;
    }

}
```
统计在线人数，虽然是局部变量但是引用了全局的httpsession，每个请求进来 servlet就会新建一个线程拦截处理（调用service），那么自然这里就存在线程安全问题了，改成线程安全的set就行了

[深入研究Servlet线程安全性问题](https://www.cnblogs.com/gw811/archive/2012/09/07/2674859.html)

<disqus/>