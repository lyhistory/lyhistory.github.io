(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{218:function(e,t,r){"use strict";r.r(t);var n=r(0),o=Object(n.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[r("a",{attrs:{href:"/docs/software"}},[e._v("回目录")]),e._v("  《concurrent》")]),e._v(" "),r("p",[e._v("concurrent control或者并发控制是关乎系统的consistency一致性，\n最直接的想法是先来后到，但是先来后到也有问题，先来的可能做了一系列的读写操作，后到的就要一直等着吗，显然这种处理很粗暴，\n所以对于单机系统来说，比如数据库，一般都是通过隔离水平isolation level来控制不同的粒度；\n对于分布式系统来说，不同的产品的promise和guarantee也是不同的，比如zookeeper通过ZAP协议保证顺序一致性sequential consistency，但是zookeeper并不保证每个客户端看到的东西是一致的，\n这个可以看我的zookeeper讲解，再比如kafka提供了exactly once的语义，意思是不会重复或丢失消息，但是也是取决于client的实现，实际项目中因为会涉及到跟其他产品比如数据库交互，\n其实从业务角度或者项目角度是难以实现exactly once的，所以要分清产品本身（server端和client端）能做到什么，以及结合到实际项目中又是会如何；")]),e._v(" "),r("p",[e._v("另外关于并发的一个误区：handle并发并不一定需要多线程，比如nodejs，redis都是单线程处理的，原理就算通过event loop，再比如Disruptor框架")]),e._v(" "),r("h2",{attrs:{id:"_1-数据库database-isolation"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-数据库database-isolation"}},[e._v("#")]),e._v(" 1. 数据库Database Isolation")]),e._v(" "),r("p",[e._v("Isolation (database systems) https://en.wikipedia.org/wiki/Isolation_(database_systems)#Read_committed")]),e._v(" "),r("p",[e._v("幻读")]),e._v(" "),r("p",[e._v("解决办法：整个区间加锁")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/concurrent/concurrent_db01.png",alt:""}})]),e._v(" "),r("p",[e._v("不可重复读")]),e._v(" "),r("p",[e._v("解决办法： 记录级别加锁 select for update")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/concurrent/concurrent_db02.png",alt:""}})]),e._v(" "),r("p",[e._v("脏读取")]),e._v(" "),r("p",[e._v("解决办法：commit之后才生效")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/concurrent/concurrent_db03.png",alt:""}})]),e._v(" "),r("p",[e._v("Common scenarios")]),e._v(" "),r("ol",[r("li",[e._v("no matter what the db level lock settings, it’s better to add extra lock when doing transaction update")])]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/concurrent/concurrent_db04.png",alt:""}})]),e._v(" "),r("ol",{attrs:{start:"2"}},[r("li",[e._v("‘duplicate’ issue")])]),e._v(" "),r("p",[e._v("这里只举例一个用户手快点了多次的情况（真实发生过），解决方法是不要在function或者存储过程中生成id，而是从外部传入；\n不过如果发生另外一个极端情况，不同用户同一时刻注册相同用户名，则需要另想办法，因为这样的话id肯定不同，username又不是主键不会冲突，\n所以要么从username生成id，比如hash运算，要么去掉username的概念，只允许手机号或者邮箱注册；")]),e._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/concurrent/concurrent_db05.png",alt:""}})]),e._v(" "),r("h2",{attrs:{id:"_2-应用层面的高并发"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-应用层面的高并发"}},[e._v("#")]),e._v(" 2. 应用层面的高并发")]),e._v(" "),r("p",[e._v("从单个应用来讲，有几种方式：\na.采用多线程，多开几个线程或线程池，充分利用cpu和内存，尤其是当遇到比较复杂的计算时，单个线程处理时间过长会阻塞影响性能，所以可以用java等forkjoinpool之类的方式处理；\nb.采用多进程，多个应用协同，比如前面加个load balance分流，然后几个应用之间share session之类的；\nc.采用队列，比如消息队列")]),e._v(" "),r("p",[e._v("以上从应用层面说的三种方式，换个角度从整体架构上看，第三种方式比较有优势，比如采用FIFO排队方式来处理高并发，\n额外的好处：解耦了消息的生产者和消费者，生产者负责把消息放到队列尾部，消费者则从队列头拉取消息进行处理，\n由于解耦了生产者和消费者，互相就不需要等待对方处理，所以是异步操作，生产者不需要等待消费者处理某条消息的结果；")]),e._v(" "),r("p",[e._v("如果有同步需求怎么办，比如有些场景生产者还是要等待消费者处理结果才能进入下一步的，\n这种完全可以拆解成消费者处理完之后将处理之后的结果放入另一个队列，然后生产者再作为消费者去消费这个队列即可，\n然后可以对刚才这个过程做一个封装，将第二个队列的生产消费做成回调，就可以做成同步请求，比如类似：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("producer1.sendTransaction({from: '0x123...', data: '0x432...'})\n.on('confirmation', function(confNumber, receipt){ //回调 })\n.on('error', function(error){ ... })\n.then(function(receipt){\n});\n")])])]),r("p",[e._v("架构也是建立在一个个等应用之上的，所以落实到对应架构中要直面高并发情况的某个应用程序，如何去实现这个队列呢？")]),e._v(" "),r("p",[e._v("java sdk默认提供了非线程安全的队列和线程安全的队列，实际项目多涉及到多线程，所以我们只说后者，线程安全队列又分为两类队列:")]),e._v(" "),r("ul",[r("li",[r("p",[e._v("无界的队列\n不用锁的队列：LinkedTransferQueue，ConcurrentLinkedQueue，由于无界，所以有内存溢出的风险")])]),e._v(" "),r("li",[r("p",[e._v("有界队列\n加锁的队列： ArrayBlockingQueue，LinkedBlockingQueue，但是有锁就有阻塞，所以性能会比较低")])])]),e._v(" "),r("p",[e._v("但是，\n要处理高并发，肯定要考虑性能，有没有性能高即无锁non-blocking并且有界的队列呢，LMAX开发的Disruptor就是这么一个无锁高性能有界循环队列，")]),e._v(" "),r("p",[e._v("“It ensures that any data is owned by only one thread for write access, therefore reducing write contention compared to other structures.”")]),e._v(" "),r("p",[e._v("现在Disruptor已经成为很多交易所的基础框架一部分，"),r("a",{attrs:{href:"https://github.com/LMAX-Exchange/disruptor/wiki/Performance-Results",target:"_blank",rel:"noopener noreferrer"}},[e._v("性能对比参考"),r("OutboundLink")],1),e._v("\n可以看到越来越多的框架集成了disruptor队列，比如log4j，storm，solr\nhttps://mvnrepository.com/artifact/com.lmax/disruptor/3.2.1/usages\nhttps://mvnrepository.com/artifact/com.lmax/disruptor/3.4.0/usages")]),e._v(" "),r("hr"),e._v(" "),r("p",[e._v("ref:")]),e._v(" "),r("p",[r("a",{attrs:{href:"https://juejin.im/post/5b5f10d65188251ad06b78e3",target:"_blank",rel:"noopener noreferrer"}},[e._v("你应该知道的高性能无锁队列Disruptor"),r("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=o.exports}}]);