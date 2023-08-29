---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

single thread queue - LMAX DisruptorHigh Performance Inter-Thread Messaging Library 
https://lmax-exchange.github.io/disruptor/

http://lmax-exchange.github.io/disruptor/files/Disruptor-1.0.pdf
https://github.com/LMAX-Exchange/disruptor/wiki/Getting-Started

## 
https://www.youtube.com/watch?v=DCdGlxBbKU4

## key concepts

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

<disqus/>