---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## What's

Disruptor 是 LMAX开发的开源 Java library，是用来处理海量 transactions 并且低延迟（没有复杂的并发代码）的并发编程框架，其性能优化的思路是通过一种特殊的软件设计来充分发挥底层硬件的效率。 

single thread queue - LMAX DisruptorHigh Performance Inter-Thread Messaging Library 
https://lmax-exchange.github.io/disruptor/

http://lmax-exchange.github.io/disruptor/files/Disruptor-1.0.pdf
https://github.com/LMAX-Exchange/disruptor/wiki/Getting-Started


## Mechanical Sympathy

This is all about understanding how the underlying hardware operates and programming in a way that best works with that hardware.

For example, let's see how CPU and memory organization can impact software performance. The CPU has several layers of cache between it and main memory. When the CPU is performing an operation, it first looks in L1 for the data, then L2, then L3, and finally, the main memory. The further it has to go, the longer the operation will take.

If the same operation is performed on a piece of data multiple times (for example, a loop counter), it makes sense to load that data into a place very close to the CPU.

| Latency from CPU to |  CPU cycles   |      Time       |
|---------------------|---------------|-----------------|
|     Main memory     |   Multiple    |    ~60-80 ns    |
|      L3 cache       | ~40-45 cycles |     ~15 ns      |
|      L2 cache       |  ~10 cycles   |      ~3 ns      |
|      L1 cache       |  ~3-4 cycles  |      ~1 ns      |
|      Register       |    1 cycle    | Very very quick |

1. Distilling a Model
2. Understand the Safety Features
3. Importance of Testing
4. Let Data drive Decisions
5. Mechanical Sympathy in Action



A model is a representation of the domain in a given context.

Map != Territory
Model != Domain
Software != Real World

Distil the essence of what represents the domain

Testing is about gaining experimental evidence to prove the model

Apply telemetry and perform real-time monitoring on the data

Telemetry not only informs the design it also allows for the tuning of a system in production

https://www.infoq.com/presentations/mechanical-sympathy/#downloadPdf/

## Why

并发一定要多线程吗？多线程一定性能好（吞吐transaction per sec、延时 latency）吗？单线程一定不好吗？
开发者了解瓶颈在哪吗？
开发者对如何利用硬件（os架构）了解吗？

### Why Not Queues（普通的queue）

1. contention - solved by 'block' but switch to kernel invalid the cache（竞争导致锁升级会陷入内核态）
Queue implementations tend to have write contention on the head, tail, and size variables. (Queues are typically always close to full or close to empty due to the differences in pace between consumers and producers. They very rarely operate in a balanced middle ground where the rate of production and consumption is evenly matched.)

To deal with the write contention, a queue often uses locks（比如java的线程安全的blockingqueue）, which can cause a context switch to the kernel. When this happens the processor involved is likely to lose the data in its caches.

To get the best caching behavior, the design should have only one core writing to any memory location (multiple readers are fine, as processors often use special high-speed links between their caches). Queues fail the one-writer principle.

2. cache line false sharing issue
If two separate threads are writing to two different values, each core invalidates the cache line of the other (data is transferred between main memory and cache in blocks of fixed size, called cache lines). That is a write-contention between the two threads even though they're writing to two different variables. This is called false sharing, because every time the head is accessed, the tail gets accessed too, and vice versa.

## How Disruptor Work
### key concepts

+ Ring Buffer

它通常被认为是 `Disruptor` 的主要方面, 但从 `3.0` 开始, 它仅负责存储和更新在 `Disruptor` 中移动的数据(事件). 对某些高级用例, 可完全由用户代替.

+ Sequence

`Disruptor` 使用它作为一种手段来识别特定组件在哪里. 每个消费者 (`EventProcessor`) 和 `Disruptor` 本身一样都维护一个 `Sequence` . 大多数并发代码依赖于这些 `Sequence` 值的移动, 因此 `Sequence` 支持 `AtomicLong` 的许多当前功能. 实际上, 和版本 2 之间的唯一真正区别是, `Sequence` 包含其他功能, 以防止 `Sequence` 与其他值之间的伪共享.

+ Sequencer

它是 `Disruptor` 的真正核心. 此接口的两个实(单生产者, 多生产者)实现了所有并发算法, 这些算法用于在生产者和消费者之间快速正确地传递数据

+ Sequence Barrier

它是由 `Sequencer` 产生, 包含主要发布的 `Sequence` 的引用以及任何从属消费者的 `Sequence` . 它包含确定是否有任何事件可供消费者处理的逻辑.

+ Wait Strategy

它确定消费者如何等待生产者将事件放入 `Disruptor` 中. 更多详细, 在下面的 可选无锁 部分.

+ Event

从生产者到消费者的数据传递单元. 没有特定的代码来表示它, 完全是由用户定义的

+ EventProcessor

用来处理来自 `Disruptor` 的事件的主事件循环(event loop), 并拥有消费者的 `Sequence` 所有权. 有一个  `BatchEventProcessor` , 它包含事件循环的高效实现并回调到 `EventHandler` 接口的提供的实现中.

+ EventHandler

一个用于被用户实现的接口, 对于 `Disruptor` 来说, 就是一个消费者

+ Producer

它是用户定义的代码, 调用 `Disruptor` 将事件进队. 这个概念并没有特定的代码表示.

https://emacsist.github.io/2019/10/12/disruptor%E5%AD%A6%E4%B9%A0/



javadoc

https://javadoc.io/doc/com.lmax/disruptor/latest/index.html


https://www.youtube.com/watch?v=DCdGlxBbKU4

<disqus/>