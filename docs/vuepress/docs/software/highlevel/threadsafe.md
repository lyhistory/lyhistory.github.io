---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《线程安全》

什么时候需要多线程

1.处理并发，关于并发我说过不一定要用多线程，单线程也可以处理并且效率更高，
但是实际情况下仅仅靠单线程是不够的，一般是主线程为单线程，加上辅助线程处理；
另外有时候不算是很高的并发还是用多线程处理比较简便；

比如数据库的连接，
webscoket的连接等；

2.需要长时间处理的程序，要开线程放到后台处理，比如生成报告；

多线程自然设计到线程安全问题，根本在于是否存在critical resource竞争资源，
如果多线程不会访问竞争资源就不存在安全问题，否则则要处理，

volatile和synchronized到底啥区别？多图文讲解告诉你
https://mp.weixin.qq.com/s/MHqXNRI6udI1wGCU0NVBaQ

多线程编程安全最“简单”的方式就是加锁；

另一种方式自然是“不加锁”，网上经常混淆各种概念，总结一下无锁基本两种思路：
+ 引入一个有界或无界队列来排队，实际上队列也分为有锁和无锁的，具体可以看我前面写的[并发控制concurrent](/docs/software/highlevel/concurrent)，
所以相当于把多线程的水龙头对接到一个队列上，把对共享资源的访问通过排队的方式隔离开，至于队列本身的实现同样可以参考我写的并发控制一章，所以多线程安全问题转换成了如何排队的问题；

+ 乐观锁方式比如CAS Atomic https://blog.csdn.net/javazejian/article/details/72772470

## 拓展：进程安全

对于分布式系统来说，同样存在着访问竞争资源的问题，比如最基本的是竞争称为leader，这个一般就需要采用一种“分布式锁”来进行资源保护，

分布式锁的常见实现方式：
+ 基于数据库 select for update
+ 基于redis
+ 基于zookeeper的ephemeral sequential node

