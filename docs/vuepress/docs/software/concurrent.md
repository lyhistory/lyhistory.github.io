---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《concurrent》

concurrent control或者并发控制是关乎系统的consistency一致性，
最直接的想法是先来后到，但是先来后到也有问题，先来的可能做了一系列的读写操作，后到的就要一直等着吗，显然这种处理很粗暴，
所以对于单机系统来说，比如数据库，一般都是通过隔离水平isolation level来控制不同的粒度；
对于分布式系统来说，不同的产品的promise和guarantee也是不同的，比如zookeeper通过ZAP协议保证顺序一致性sequential consistency，但是zookeeper并不保证每个客户端看到的东西是一致的，
这个可以看我的zookeeper讲解，再比如kafka提供了exactly once的语义，意思是不会重复或丢失消息，但是也是取决于client的实现，实际项目中因为会涉及到跟其他产品比如数据库交互，
其实从业务角度或者项目角度是难以实现exactly once的，所以要分清产品本身（server端和client端）能做到什么，以及结合到实际项目中又是会如何；

另外关于并发的一个误区：handle并发并不一定需要多线程，比如nodejs，redis都是单线程处理的，原理就算通过event loop，再比如Disruptor框架

## 1. 数据库Database Isolation
 
Isolation (database systems) https://en.wikipedia.org/wiki/Isolation_(database_systems)#Read_committed

幻读

解决办法：整个区间加锁

![](/docs/docs_image/software/concurrent/concurrent_db01.png)

不可重复读

解决办法： 记录级别加锁 select for update

![](/docs/docs_image/software/concurrent/concurrent_db02.png)

脏读取

解决办法：commit之后才生效

![](/docs/docs_image/software/concurrent/concurrent_db03.png)

Common scenarios

1) no matter what the db level lock settings, it’s better to add extra lock when doing transaction update

![](/docs/docs_image/software/concurrent/concurrent_db04.png)

2) ‘duplicate’ issue

这里只举例一个用户手快点了多次的情况（真实发生过），解决方法是不要在function或者存储过程中生成id，而是从外部传入；
不过如果发生另外一个极端情况，不同用户同一时刻注册相同用户名，则需要另想办法，因为这样的话id肯定不同，username又不是主键不会冲突，
所以要么从username生成id，比如hash运算，要么去掉username的概念，只允许手机号或者邮箱注册；

![](/docs/docs_image/software/concurrent/concurrent_db05.png)

## 2. 应用层面的高并发

从单个应用来讲，有几种方式：
a.采用多线程，多开几个线程或线程池，充分利用cpu和内存，尤其是当遇到比较复杂的计算时，单个线程处理时间过长会阻塞影响性能，所以可以用java等forkjoinpool之类的方式处理；
b.采用多进程，多个应用协同，比如前面加个load balance分流，然后几个应用之间share session之类的；
c.采用队列，比如消息队列

以上从应用层面说的三种方式，换个角度从整体架构上看，第三种方式比较有优势，比如采用FIFO排队方式来处理高并发，
额外的好处：解耦了消息的生产者和消费者，生产者负责把消息放到队列尾部，消费者则从队列头拉取消息进行处理，
由于解耦了生产者和消费者，互相就不需要等待对方处理，所以是异步操作，生产者不需要等待消费者处理某条消息的结果；

如果有同步需求怎么办，比如有些场景生产者还是要等待消费者处理结果才能进入下一步的，
这种完全可以拆解成消费者处理完之后将处理之后的结果放入另一个队列，然后生产者再作为消费者去消费这个队列即可，
然后可以对刚才这个过程做一个封装，将第二个队列的生产消费做成回调，就可以做成同步请求，比如类似：

```
producer1.sendTransaction({from: '0x123...', data: '0x432...'})
.on('confirmation', function(confNumber, receipt){ //回调 })
.on('error', function(error){ ... })
.then(function(receipt){
});
```
架构也是建立在一个个等应用之上的，所以落实到对应架构中要直面高并发情况的某个应用程序，如何去实现这个队列呢？

java sdk默认提供了非线程安全的队列和线程安全的队列，实际项目多涉及到多线程，所以我们只说后者，线程安全队列又分为两类队列:
+ 无界的队列 
不用锁的队列：LinkedTransferQueue，ConcurrentLinkedQueue，由于无界，所以有内存溢出的风险

+ 有界队列
加锁的队列： ArrayBlockingQueue，LinkedBlockingQueue，但是有锁就有阻塞，所以性能会比较低

但是，
要处理高并发，肯定要考虑性能，有没有性能高即无锁non-blocking并且有界的队列呢，LMAX开发的Disruptor就是这么一个无锁高性能有界循环队列，

“It ensures that any data is owned by only one thread for write access, therefore reducing write contention compared to other structures.”

现在Disruptor已经成为很多交易所的基础框架一部分，[性能对比参考](https://github.com/LMAX-Exchange/disruptor/wiki/Performance-Results)
可以看到越来越多的框架集成了disruptor队列，比如log4j，storm，solr
https://mvnrepository.com/artifact/com.lmax/disruptor/3.2.1/usages
https://mvnrepository.com/artifact/com.lmax/disruptor/3.4.0/usages

---

ref:

[你应该知道的高性能无锁队列Disruptor](https://juejin.im/post/5b5f10d65188251ad06b78e3)
