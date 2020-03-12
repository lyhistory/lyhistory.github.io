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

