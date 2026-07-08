---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《concurrency并发》

标题：Core Concept: Consistency & Coordination (从单机锁到分布式共识)

## 引子：并发与并行（Concurrency vs Parallelism）
(引言)

简述一致性是计算机科学的底层逻辑，从单线程的无脑一致性，到多线程的可见性问题，再到多节点的共识难题。

注意本篇的叙事线是：

抽象（Consistency）→ 手段（CC） → 分级（Isolation） 

这是架构师视角，是给“设计师”看的。

而另一篇 [线程安全 single_machine_threadsafe](/software/highlevel/single_machine_threadsafe.md) 是：

锁实现（偏向/轻量/重量） → JMM → 指令重排 → CAS底层

这是工程师视角，是给“施工队”看的。


Consistency Models (顶层抽象), Concurrency Control (实现手段, 跟 CM 正交)

首先要明确个词的意思，首先引用：

> Concurrency means multiple tasks which start, run, and complete in overlapping time periods, in no specific order. Parallelism is when multiple tasks OR several part of a unique task literally run at the same time, e.g. on a multi-core processor. Remember that Concurrency and parallelism are NOT the same thing.
> https://howtodoinjava.com/java/multi-threading/concurrency-vs-parallelism/

> "concurrent" is used only for events that occur over a period of time, whereas "simultaneous" can also be used for events that occur at a point in time.

可以看到，concurrency 并发是只在一段时间内很多 events 一起发生，但是在这段时间内的任意一个时刻可能只有一个 event 发生；而 parallelism 是指 events 发生是 simultaneously，某个时刻他们是可以同时发生：

以吃饭和说话举例：
- 有些人吃饭的时候不喜欢说话，只有吃完饭才说话 → 不支持并发、不支持并行
- 有些人吃饭的时候说话比较优雅礼貌，每次都是先吞下嘴里的食物才说话，然后说了一句再吃一口 → 支持并发、不支持并行
- 有些人吃饭不讲究，嘴里还没咽下去，同时还高声阔谈，食物有时候喷的对方一脸 → 同时支持并发和并行

所以并发只是强调可以在一段时间内同时处理多个事务，并行是强调可以在某一个时刻处理多个事务，**并发可以不并行，并行一定是并发**。

比如早期一个核的 cpu 也可以处理多个任务就是属于并发但是不是并行，在任何一个 cpu 时刻，只能处理一件任务；而多核则同一个时刻，多个 cpu 并行处理不同任务。
关于 cpu 这个层面的概念可以参考[被神话的 Linux, 一文带你看清 Linux 在多核可扩展性设计上的不足](https://mp.weixin.qq.com/s/ntGv1ObIgi4SeCf7GhfAnQ)

所以我们并不太关心并行，因为这个涉及到硬件和底层操作系统的处理，现在只关心并发的处理。

> 💡 一般谈到并发基本都是暗指高并发，实际上也有低并发的情况需要处理——比如低并发但是每个任务都是需要消耗长处理时间，下面也会提到。


## 一致性模型：顶层抽象 (Consistency Models)
定位：这里是“What”。ZK、Kafka 的理论部分。这是系统对外承诺的语义。

对于分布式系统来说，不同产品的 promise 和 guarantee 也是不同的：

- 比如 ZooKeeper 通过 ZAB 协议保证顺序一致性（sequential consistency），但 ZooKeeper 并不保证每个客户端看到的东西是一致的（这点可以看我的 ZooKeeper 讲解）
- 再比如 Kafka 提供了 exactly-once 的语义，意思是不会重复或丢失消息，但也是取决于 client 的实现。实际项目中因为会涉及到跟其他产品比如数据库交互，其实从业务角度或项目角度是难以实现 exactly-once 的——**要分清产品本身（server 端和 client 端）能做到什么，以及结合到实际项目中又是如何**。
  

> **核心定义**：一致性模型定义了分布式系统中多个节点对数据共享状态所达成的共识程度的**语义承诺**。它是系统设计者对外部（Client）提供的关于数据可见性、有序性和可靠性的最高级契约。

本文档的完整深度解析请移步至专题文章：
➡️ **[分布式系统全景分析：从故障容错到拜占庭容错](https://lyhistory.com/docs/software/highlevel/distrubuted_system.html)**

**要点速览**：
*   **理论基石**：CAP 定理、BASE 理论、FLP 不可能原理。
*   **强度谱系**：线性一致性 (Linearizability) $\rightarrow$ 顺序一致性 (Sequential Consistency) $\rightarrow$ 因果一致性 $\rightarrow$ 最终一致性 (Eventual Consistency)。
*   **共识算法**：
    *   **故障容错 (CFT)**：Paxos、Raft、ZAB（ZooKeeper）。
    *   **拜占庭容错 (BFT)**：PBFT、PoW（中本聪共识）。
*   **典型实现**：ZooKeeper (Sequential)、Etcd (Linearizable)、Kafka (Sequential/Read Committed)、Bitcoin (Probabilistic Finality)。


## 并发控制：一致性的实现手段 (Concurrency Control)
定位：这里是“How”。Java 并发、Disruptor、CAS 等内容。这些是达成一致性的工具。

concurrent control 或者并发控制是关乎系统的 consistency 一致性。

最直接的想法是先来后到，但是先来后到也有问题——先来的可能做了一系列的读写操作，后到的就要一直等着吗，显然这种处理很粗暴。

另外关于并发的一个误区：**handle 并发并不一定需要多线程**。比如 Node.js、Redis 都是单线程处理的，原理是靠 event loop；再比如 [Disruptor 框架](/software/buildingblock/disruptor.md) 是通过 ringbuffer。


### 为什么需要 CC（先来后到的粗暴问题）。

### 单线程也能 Handle 并发（Node.js / Redis / Disruptor）。

### 高并发

在实际工程中，并发已经从单纯的线程维度上升到了系统架构层面。在互联网语境下，「并发」与「并行」的界限往往变得模糊，核心在于如何在重叠的时间窗口内处理海量请求。

#### 关键指标

评估高并发系统的能力，离不开以下几个核心指标：

*   **响应时间 (Response Time)**: 系统对请求做出响应的时间。
*   **吞吐量 (Throughput)**: 单位时间内系统处理的请求数量。
*   **每秒查询率 QPS (Query Per Second)**: 常用于衡量特定服务器的处理能力（如 DNS）。
*   **每秒事务处理量 TPS (Transaction Per Second)**: 衡量一个完整业务流程（请求-处理-响应）的能力。
    *   *注：访问一个页面可能包含 1 个 T 和 N 个 Q（如 html/css/js）。*
*   **同时在线用户数量**: 保持连接但未必定在发包的用户数。

#### 指标的统计维度

单纯的平均值往往掩盖问题，工程上更关注以下维度：

*   **平均值**: 小时平均、日平均、月平均。
*   **Top 百分数 (TP - Top Percentile)**: 如 TP50、TP90、TP99、TP4个9。
    *   *含义：99% 的请求都能在该时间内完成，这是衡量系统稳定性的关键。*
*   **最大值**: 极端情况下的系统表现。
*   **趋势**: 随时间变化的负载走向。

#### 业务引申指标

由于“同时”的定义随业务粒度变化，衍生出了业务视角的度量指标：

*   **活跃用户数**: 日活 DAU (Daily Active User)、月活 MAU (Monthly Active Users)。
*   **点击量 PV (Page View)**: 页面浏览总量。
*   **独立访客 UV (Unique Visitor)**: 通过 Cookie 去重的访问者。
*   **独立 IP 数 IP (Internet Protocol)**: 基于公网 IP 的访问者（局域网内多人可能共享一个 IP）。
*   **日单量**: 电商场景下的核心业务指标。

> 💡 **延伸阅读**：
> *   [亿级(无限级)并发](https://mp.weixin.qq.com/s/ULxJqfZyDyzgfqSsTNGFhQ)
> *   [1000W长连接，如何建立和维护？千万用户IM ，如何架构设计?](https://mp.weixin.qq.com/s/juLGcZL2jkThbldPwRLNnw)

阿里巴巴亿级流量并发手册

### 应用层并发控制的实现手段

在实际工程的应用层，并发控制主要通过三种范式落地，不同范式的适用场景和性能特性差异显著：
#### 应用层并发的三种范式

从单个应用视角出发，常见的并发处理思路分为三类：

a. 多线程：通过多开线程或线程池充分利用CPU和内存，尤其适合复杂计算场景——单线程处理过长会阻塞影响性能，可通过Java的ForkJoinPool等方式拆分任务。

b. 多进程+负载均衡：通过多应用实例协同分担压力，前端搭配HAProxy、Nginx等反向代理分流（如淘宝CDN采用HAProxy）。若应用间需要业务协同（如用户Session管理），可通过共享Session工具或框架实现。

c. 队列解耦：通过消息队列异步化处理请求。

补充说明：第一种多线程方案通常并非为高并发场景设计，当前生产环境极少通过给单体应用叠加CPU/内存的方式扩容，多线程更多用于解决低并发但长耗时任务的阻塞问题。而后两种方案（多进程LB、队列）底层原理相通，HAProxy、Nginx内部也大量采用队列思想实现请求调度。

从整体架构视角看，队列方案的扩展性优势更明显：基于FIFO的排队机制天然解耦生产者和消费者，生产者仅需将消息追加到队列尾部，消费者从队列头部拉取处理，双方无需互相等待，是典型的异步操作。若业务需要同步语义，可将消费者的处理结果写入第二个队列，生产者作为该队列的消费者订阅结果，再通过回调封装即可模拟同步请求，例如以太坊交易的回调模式：
```
producer1.sendTransaction({from: '0x123...', data: '0x432...'})
.on('confirmation', function(confNumber, receipt){ //回调 })
.on('error', function(error){ ... })
.then(function(receipt){
});
```

落实到应用实现层面，Java SDK提供了丰富的队列实现：非线程安全队列（如ArrayDeque、LinkedList）不适用于多线程场景，我们仅关注线程安全队列，其分为两类：

无界队列：LinkedTransferQueue、ConcurrentLinkedQueue等无锁实现，但无界特性可能导致内存溢出风险。

有界队列：ArrayBlockingQueue、LinkedBlockingQueue等加锁实现，锁竞争会带来显著的性能损耗。

但需要注意：多线程不代表高性能，性能瓶颈主要来自三个方面：

缓存伪共享（Cache Line False Sharing）：CPU缓存行失效导致的额外开销。

线程维护开销：线程创建、上下文切换的成本。

锁升级开销：重量级锁会触发内核态切换，大幅降低性能。

因此高并发场景下需要兼顾「无锁（非阻塞）」和「有界」的队列实现，LMAX开发的Disruptor正是满足这两个特性的高性能环形队列。

#### Java线程模型与基础并发工具

Java平台从1.0版本开始就通过Thread类和Runnable接口支持多线程编程，Java 5.0进一步引入了java.util.concurrent包强化并发能力。

线程的创建与生命周期

定义线程有两种方式：一是继承Thread类并重写run()方法；二是实现Runnable接口，将其实例传入Thread构造函数。调用start()方法后，JVM会创建新线程执行run()方法，原线程继续执行后续逻辑：
```
/** 用来在后台对List排序的Thread类*/
class BackgroundSorter extends Thread {
    List l;
    public BackgroundSorter(List l) { this.l = l; } // 构造函数
    public void run() { Collections.sort(l); } // 线程主体
}
// 创建BackgroundSorter线程
Thread sorter = new BackgroundSorter(list);
// 开始运行；在原来的线程继续执行接下来的语句时，新的线程会执行run() method
sorter.start();

// 另一种定义线程的方法
Thread t = new Thread(new Runnable() { // 创建一个新的线程
    public void run() { Collections.sort(list); } // 为对象列表排序
});
t.start(); // 开始运行
```
线程的生命周期分为6种状态，可通过getState()方法查询：

NEW 线程已创建，但start()未调用
RUNNABLE    线程正在运行或可调度运行    
BLOCKED 等待获取锁进入同步方法/代码块
WAITING 调用Object.wait()/Thread.join()后未运行
TIMED_WAITING   调用带超时的sleep()/wait()/join()后未运行
TERMINATED  run()方法执行完毕或因异常终止

线程调度与任务执行

Java提供了多层次的异步任务调度能力：

1. 基础调度：Timer类：Java 1.3引入的Timer和TimerTask可实现定时/重复任务执行：
```
import java.util.*;
// 定义显示时间的任务
TimerTask displayTime = new TimerTask() {
    public void run() { System.out.printf("%tr%n", System.currentTimeMillis()); }
};
// 创建timer对象执行任务
Timer timer = new Timer();
// 每1000毫秒执行一次，立即开始
timer.schedule(displayTime, 0, 1000);
// 停止显示时间的任务
displayTime.cancel();
```
2. Executor框架：Java 5.0引入的Executor接口解耦了任务提交和执行策略，无需手动创建Thread对象。ExecutorService扩展了Executor，支持执行Callable（有返回值的任务）并返回Future对象获取结果；ScheduledExecutorService进一步支持延迟/周期性任务调度：
```
import java.util.concurrent.*;
import java.math.BigInteger;
import java.util.Random;
import java.security.SecureRandom;

/** 计算大质数的Callable实现 */
public class RandomPrimeSearch implements Callable<BigInteger> {
    static Random prng = new SecureRandom();
    int n;
    public RandomPrimeSearch(int bitsize) { n = bitsize ; }
    public BigInteger call() { return BigInteger.probablePrime(n, prng); }
}

// 使用示例：同时计算两个512位质数
ExecutorService threadpool = Executors.newFixedThreadPool(2);
Future<BigInteger> p = threadpool.submit(new RandomPrimeSearch(512));
Future<BigInteger> q = threadpool.submit(new RandomPrimeSearch(512));
// 获取结果（会阻塞直到任务完成）
BigInteger product = p.get().multiply(q.get());
```

互斥与锁机制

1. 多线程访问共享数据时必须通过锁保证线程安全：

内置锁（Synchronized）：通过synchronized修饰方法或代码块，线程需获取对象的内置锁才能执行，退出时自动释放锁。也可通过Collections.synchronizedList()等工具包装非线程安全的集合：
```
// synchronized代码块示例：交换数组两个元素
public static void swap(Object[] array, int index1, int index2) {
    synchronized(array) {
        Object tmp = array[index1];
        array[index1] = array[index2];
        array[index2] = tmp;
    }
}
// 包装非线程安全集合
List synclist = Collections.synchronizedList(list);
Map syncmap = Collections.synchronizedMap(map);
```

2. 显式锁（Lock接口）：Java 5.0引入的java.util.concurrent.locks.Lock支持更灵活的锁定策略，需手动释放锁（通常通过try/finally保证），可实现细粒度的锁控制，例如链表的交叉前进遍历：
```
import java.util.concurrent.locks.*;
public class LinkList<E> {
    private final Lock lock = new ReentrantLock();
    private E value;
    private LinkList<E> rest;
    // 交叉前进追加节点：每次只锁定当前节点，获取下一节点锁后立即释放当前锁
    public void append(E value) {
        LinkList<E> node = this;
        node.lock.lock();
        while(node.rest != null) {
            LinkList<E> next = node.rest;
            try { next.lock.lock(); }
            finally { node.lock.unlock(); }
            node = next;
        }
        try {
            node.rest = new LinkList<E>(value);
        } finally { node.lock.unlock(); }
    }
}
```
3. 死锁防范：当两个线程互相等待对方持有的锁时会触发死锁，需保证所有线程按相同顺序获取锁避免死锁。

线程协调与同步器

Java提供了多种线程协调机制：

1. wait()/notify()：线程调用对象的wait()会释放锁并进入等待队列，其他线程调用同一对象的notifyAll()会唤醒所有等待线程。Java 5.0后推荐使用BlockingQueue替代手写等待通知逻辑。

2. join()：等待其他线程执行完毕后再继续当前线程。

3. 同步器工具类：java.util.concurrent包提供了四类通用同步器：

Semaphore：信号量，控制同时访问资源的线程数量。

CountDownLatch：闭锁，等待指定数量的倒计时完成后唤醒所有等待线程，一次性使用。

Exchanger：允许两个线程交换数据，第一个调用exchange()的线程会阻塞直到第二个线程调用。

CyclicBarrier：循环屏障，支持N个线程互相等待到同步点，可重复使用，适合并行算法的阶段同步。

阻塞队列与原子变量

1. 阻塞队列（BlockingQueue）：java.util.concurrent提供了5种BlockingQueue实现，天然适配生产者-消费者模型：

实现类特性
ArrayBlockingQueue  基于数组的有界队列，FIFO顺序
LinkedBlockingQueue 基于链表的可选有界队列，默认无界
PriorityBlockingQueue   无界优先级队列，按Comparator或自然顺序排序
DelayQueue  无界延迟队列，元素需实现Delayed接口，仅过期后可被取出
SynchronousQueue    容量为0的队列，生产者和消费者必须配对操作

2. 原子变量（Atomic Variables）：java.util.concurrent.atomic包提供了无锁的原子操作类，通过CAS（Compare-And-Swap）指令实现字段的原子更新，避免了锁开销：
```
import java.util.concurrent.atomic.AtomicInteger;
public class Counters {
    AtomicInteger count = new AtomicInteger(0);
    // 原子递增，等价于synchronized的count++，但无锁
    public int increment() { return count.getAndIncrement(); }
    // 乐观锁实现：循环重试直到CAS成功
    public int optimisticIncrement() {
        int result;
        do {
            result = count.get();
        } while(!count.compareAndSet(result, result+1));
        return result;
    }
}

```
#### 高性能无锁队列：Disruptor

Disruptor是LMAX交易所开发的高性能有界环形队列，2011年获得Duke's程序框架创新奖，单线程可支撑每秒600万订单，目前已被Apache Storm、Log4j2、Solr等知名框架集成，替代JDK原生队列以提升性能。

性能对比

官方性能测试显示，Disruptor的平均每跳延迟仅为52纳秒，远低于ArrayBlockingQueue的32757纳秒，性能差距主要来自锁竞争和缓存失效：

测试环境：2.2Ghz Core i7-2720QM，Java 1.6.0_25 64-bit，Ubuntu 11.04

参考：Disruptor Performance Results

相关解析：你应该知道的高性能无锁队列Disruptor

Maven依赖使用情况：3.2.1版本    3.4.0版本

三大核心优化（Disruptor的"杀器"）

1. CAS无锁实现：摒弃ArrayBlockingQueue的重量级ReentrantLock，使用CAS原子操作实现队列下标更新，避免了线程挂起/唤醒的内核态切换开销。需注意：这里的"无锁"并非完全没有锁，而是避免了导致线程阻塞的重锁，底层仍依赖CPU的原子指令。

2. 缓存行填充解决伪共享：CPU缓存以缓存行（通常64字节）为单位加载数据，当多个变量位于同一缓存行时，一个变量的更新会导致整个缓存行失效。Disruptor通过填充无用变量，将核心数据（如序列号）独占一个缓存行，避免伪共享问题。JDK 8后提供了@Contended注解实现类似优化，ConcurrentHashMap的计数器就使用了该注解。

3. RingBuffer环形数组：

基于数组实现，连续内存布局充分利用CPU缓存。

大小必须为2的N次方，通过位运算index & (size - 1)替代取模运算，提升访问速度。

环形复用内存，避免频繁的内存分配和GC，减少垃圾回收压力。

使用模式

Disruptor支持两种生产者模式：

单生产者模式（ProducerType.SINGLE）：无锁，性能最优，适用于单线程写场景。

多生产者模式（ProducerType.MULTI）：通过CAS保证线程安全，适用于多线程写场景，竞争时间短、开销低。

核心组件包括：

ThreadFactory：线程工厂，用于创建消费者线程。

EventFactory：事件工厂，初始化时预填充RingBuffer，避免运行时频繁创建对象。

EventHandler/WorkHandler：事件处理器，EventHandler每个实例独立消费队列，WorkHandler多个实例共享队列、竞争消费。

WaitStrategy：等待策略，定义无数据时的消费者行为，例如BlockingWaitStrategy（阻塞等待）、YieldingWaitStrategy（自旋+yield让出CPU）、BusySpinWaitStrategy（忙等，耗CPU但延迟最低）。

与Kafka的分工

Disruptor是单机内存级的高性能队列，适合低延迟场景；若业务需要Pub/Sub、消息持久化、消费位点重置等高级特性，则需使用Kafka等分布式消息队列。Kafka基于ZAB协议实现了顺序一致性，可提供exactly-once语义：生产者幂等性保证无重复发送，消费者通过自主管理Offset和事务提交保证无重复消费、无丢失。
#### 并发控制的形式化抽象：状态机

前面介绍的线程、队列、锁都是具体的并发控制手段，而状态机（State Machine）是并发控制的通用抽象模型，可同时适用于单机和分布式场景。

Lamport在《Time, Clocks and the Ordering of Events in a Distributed System》中提出了基于逻辑时钟的分布式状态机同步方案：

问题定义：分布式资源分配的互斥要求：① 已获取资源的进程必须先释放再分配给其他进程；② 请求按发起顺序授予；③ 若所有进程最终释放资源，则所有请求最终都会被授予。

集中式方案的缺陷：单纯的中心Master分配无法满足顺序性要求——若进程P0先后发起请求R0（给Master）和R1（给P1），P1收到R1后向Master发起R2，R2可能先于R0到达Master，导致顺序违反。

分布式状态机方案：

每个进程向所有其他进程广播带逻辑时钟戳的资源请求，本地存储请求。

收到请求后，每个进程存储请求并向发送者发送带时间戳的ACK。

进程Pi获得资源的条件：① 本地存储的请求req:Pi:Ti的时间戳Ti是所有请求中最小的；② Pi已收到所有其他进程发送的、时间戳大于Ti的消息。

释放资源时，Pi向所有进程广播释放消息，各进程删除本地的req:Pi记录。

该方案的通用化抽象即为复制状态机（Replicated State Machine）：每个进程都是一个状态机，初始状态一致，通过广播带时间戳的命令，所有进程按相同顺序执行命令，最终会达到完全一致的状态。该思想是Paxos、Raft等共识算法，以及TLA+形式化验证工具的核心基础。

参考：[State Machine and Synchronization | Lu’s blog](https://blog.the-pans.com/state-machine-and-sync/#/)

#### 系统与框架层面的并发限制

应用层的并发逻辑（如多线程、队列）最终都要依赖操作系统和网络框架的能力。当连接数达到十万、百万级别时，系统层面的限制往往先于应用逻辑成为瓶颈。

##### IO 的高并发演进：从 BIO 到 Netty

要实现百万级连接，核心在于如何处理海量的网络 IO。这经历了从阻塞到非阻塞、从同步到异步的演进过程。

BIO (Blocking I/O)：传统的一连接一线程模型。每个连接占用一个线程，当连接数达到上万时，线程上下文切换和资源消耗（内存）将压垮系统。无法支撑高并发长连接。

NIO (Non-blocking I/O) / 多路复用：引入 Selector机制，单线程可以监听多个连接（Channel）的就绪状态（可读、可写）。这是高并发的基石。

Netty：基于 NIO 封装的高性能网络通信框架。它通过事件驱动模型（Reactor 线程模型）、零拷贝和内存池等技术，极大地简化了 NIO 编程的复杂性，并成为构建百万级连接网关的事实标准。

案例研究：爱奇艺百万级 WebSocket 网关架构

爱奇艺在面对用户评论、实名认证等实时推送场景时，旧方案因技术栈不统一、与业务耦合、缺乏监控等问题无法满足需求。新方案选择了 Netty​ 作为核心，其架构设计完美诠释了系统层面的并发处理：

1. 架构解耦：

将 WebSocket 连接管理能力从业务系统中剥离，形成独立的网关层。

业务系统通过简单的 HTTP 接口调用网关进行推送，无需关心底层长连接细节。

2. 分布式会话与广播（解决有状态问题）：

WebSocket 是有状态的，客户端只连接集群中的一个节点。

爱奇艺选择了事件广播方案而非集中式注册中心。网关将所有推送消息写入 RocketMQ，并以广播模式消费。集群内所有节点都能收到消息，然后各自判断目标连接是否存在于本机内存中，存在则推送，不存在则忽略。

对比：这种方案实现轻量，避免了注册中心的强依赖，适合中等规模集群。

3. 会话管理（内存优化）：

设计了 SessionManager -> UserSession -> ChannelSession的多级结构。

SessionManager维护 UID 与 UserSession的映射。

UserSession内部维护 Channel映射，支持同一用户的多端登录同步。

设置了连接数上限，当同一用户的连接过多时，自动关闭最早的连接，防止资源耗尽。

4. 监控一体化：

集成 Micrometer​ 暴露连接数、用户数等指标。

对接 Prometheus​ 采集和 Grafana​ 展示，实现了与现有微服务监控体系的打通。

压测数据佐证：

在 4核16G 的虚拟机上，爱奇艺网关成功支撑了 100万+​ 的长连接。

内存占用：约 4.5GB（主要用于维护连接对象和缓冲区）。

推送耗时：百万连接下发一条消息，单线程平均耗时约 10秒（主要受网络带宽和内核发包逻辑限制，而非 CPU）。

接口性能：在并发 600、持续 120s 的条件下，推送接口 TPS 稳定在 1600+，平均响应时间 347ms。

💡 启示：该案例展示了如何通过 Netty + 消息队列 + 合理的会话管理，在有限的硬件资源下突破单机并发瓶颈。同时也指出了优化方向：通过优化广播逻辑（如引入一致性哈希路由），可以减少全量广播带来的网络风暴。

##### 操作系统层面的硬性限制

即使应用框架（如 Netty）性能再强，如果操作系统层面不放开限制，连接数依然无法提升。最常见的限制是文件句柄数。

在 Linux 中，一切皆文件。网络连接（Socket）也被视为文件，受文件句柄数（File Descriptor）限制。

检查当前限制：
```
ulimit -n
# 默认通常是 1024，这意味着一个进程最多只能打开 1024 个文件/连接，远远无法满足高并发需求。
```
修改限制：

编辑 /etc/security/limits.conf文件，设置软限制和硬限制：
```
* soft nofile 102400
* hard nofile 102400
# * 代表所有用户，也可以指定特定用户（如运行网关的用户）
```

修改后需注销或重启才能生效。

延伸：网络栈排查

在高并发场景下，除了句柄数，TCP 协议栈的参数也至关重要。在我的网络笔记中，曾记录过一次关于 Send-Q（发送队列）的排查案例（详见 [### 4.2 一次排查send-q](/docs/software/network)）。当应用发送速率超过对端接收速率或网络带宽时，Send-Q会持续积压，导致内存上涨、延迟增加甚至连接断开。这提醒我们，系统层面的并发限制不仅在于“连接数”，更在于“吞吐能力”和“缓冲区管理”。



## 隔离级别：跨领域的一致性分级 (Isolation Levels)
定位：这里是“Standard”。这是连接数据库和分布式系统的桥梁。数据库隔离级别和 Kafka 的隔离级别放在一起对比。

对于单机系统来说，比如数据库，一般就是通过隔离水平（isolation level）来控制不同的粒度。

### ANSI SQL 标准隔离级别


MySQL：默认 REPEATABLE READ，通过 MVCC + Next-Key Lock​ 在避免脏读、不可重复读的同时，一定程度上防止幻读，适合传统业务系统。
    在 MySQL 的 InnoDB 引擎中，当你处于默认的 REPEATABLE READ​ 级别时，如果你执行了一个范围查询（比如 SELECT * FROM orders WHERE amount > 100），InnoDB 不仅会给找到的现有行加上锁，还会给这个范围的“间隙”（Gap）加上锁（这被称为 Next-Key Lock，即记录锁+间隙锁）。

    结果：其他事务根本无法在这个范围内插入新数据。

    结论：既然插不进来，MySQL 的 RR 级别在物理层面上彻底杜绝了幻读的发生。这也是为什么很多老司机会说“MySQL 的 RR 已经等同于 Serializable 了”。

PostgreSQL：默认 READ COMMITTED，实现更简单，每个语句看到的是语句开始时的已提交数据，符合大多数应用场景，且并发性能较好。

    PostgreSQL 在 REPEATABLE READ​ 级别使用了一种叫做“谓词锁”的机制。它不会真正去锁住数据表不让别人写，而是在事务提交时进行比对。

    场景：如果你的事务在运行期间，有其他事务偷偷插入了符合你查询条件的新数据。

    结果：当你尝试提交当前事务时，PostgreSQL 会直接抛出一个错误：ERROR: could not serialize access due to concurrent update（由于并发更新导致无法序列化访问）。

    结论：PG 通过“强制报错回滚”的方式，在 RR 级别也达成了防幻读的业务语义。

Oracle 数据库：默认的 READ COMMITTED

根据 Oracle 官方文档，Oracle 数据库默认的隔离级别确实是 读已提交（READ COMMITTED）。
但是！Oracle 在处理这个隔离级别时，依托其强大的 MVCC（多版本并发控制）​ 机制，展现出了一些非常优秀的特性：
绝不允许“脏读”：这是底线。
不会出现“死锁”：Oracle 采用了“一路读快照、写操作排队”的巧妙设计。读数据永远不会加锁，也不会被写操作阻塞（即著名的 Readers don't block writers, writers don't block readers）。这让它在高并发的 OLTP（在线事务处理）系统中表现极佳。

可能出现“不可重复读”和“幻读”：因为每次执行查询时，它看到的都是以当前时间为基准的已提交数据快照。如果其他事务在你两次查询之间提交了修改，你就会看到不一样的结果。

非常有意思的是，Oracle 没有实现 SQL 标准中的 READ UNCOMMITTED（读未提交）和 REPEATABLE READ（可重复读）。

如果你觉得 READ COMMITTED不够用，Oracle 直接为你提供了两个跳跃级的选项：
SERIALIZABLE（串行化）：提供绝对的强一致性，防幻读。但如果并发冲突严重，很容易抛出 ORA-08177错误，需要业务代码做重试机制。
READ ONLY（只读）：顾名思义，整个事务只能查询，不能修改，适合做数据报表拉取。

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

### 快照隔离 (Snapshot Isolation)

照隔离是 ANSI SQL 标准之外的**事实标准**，由 Jim Gray 等人提出，并被 PostgreSQL、Oracle、Microsoft SQL Server 等主流数据库广泛采用（尽管实现细节各异）。
它介于 `REPEATABLE READ` 和 `SERIALIZABLE` 之间，是解决读写冲突的经典方案。

*   **核心机制**：事务启动时获取一个**数据快照**。在整个事务期间，所有读操作都基于这个静态快照，不受其他事务提交的影响（解决了不可重复读和幻读的问题）。
*   **写冲突检测**：SI 的关键在于**写-写冲突检测**。如果两个并发事务读取了同一份数据并尝试修改，只有第一个提交的事务会成功，第二个事务会因冲突而回滚（这就是常说的 "First-committer-wins" 规则）。
*   **与 ANSI 标准的关系**：
    *   **PostgreSQL**：在 `REPEATABLE READ` 级别下实质使用的是 SI（通过谓词锁验证，冲突时报错）。
    *   **Oracle**：`SERIALIZABLE` 级别实质上实现的是 SI 的增强版（SSI，可序列化快照隔离）。
*   **局限性**：
    快照隔离无法完全防止**写偏斜（Write Skew）**。例如，两个医生同时检查值班人数，发现都多于一人，于是都决定请假。在 SI 下，两人都能成功提交（因为没有修改同一行数据），但最终导致只剩一人值班，违反了业务约束。解决写偏斜通常需要 `SERIALIZABLE` 级别或显式的范围锁。

> 💡 **面试考点**：很多面试官会把 PG/Oracle 的默认隔离级别（RC/RR）当成标准实现，但了解它们底层基于 SI 或 MVCC 的原理，能体现出你对数据库内核的理解深度。

### 消息系统中的隔离：以 Kafka 为例



<disqus/>