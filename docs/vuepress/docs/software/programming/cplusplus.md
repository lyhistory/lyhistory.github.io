---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

Refers to
<<Blockchain:EOS>>

http://cpp.sh/
https://developers.google.com/edu/c++/

在函数外存取局部变量的一个比喻
https://coolshell.cn/articles/4907.html#/

GCC and MakeCompiling, Linking and BuildingC/C++ Applications
https://www3.ntu.edu.sg/home/ehchua/programming/cpp/gcc_make.html

8The Build Process - C/C++  https://www.hackerearth.com/practice/notes/build-process-cc/
http://faculty.cs.niu.edu/~mcmahon/CS241/Notes/compile.html
https://www.toptal.com/c-plus-plus/c-plus-plus-understanding-compilation

gcc -v -o hello.exe hello.c

ldd - print shared object dependencies


C++ Primer 5th
https://github.com/Mooophy/Cpp-Primer

expected unqualified-id before ‘(’ token
https://blog.csdn.net/dreamvyps/article/details/80658176
#undef errno

Virtual destructors are useful when you might potentially delete an instance of a derived class through a pointer to base class
https://stackoverflow.com/questions/461203/when-to-use-virtual-destructors#/
c++ free 原理

GPU编程CUBA
锁页内存

RAII模式（Resource Acquisition Is Initialization）资源获取即初始化，是 C++ 中最基本、应用最广范的惯用法（idiom）之一。

RAII 的基本思想是通过构造/析构函数，对资源的获取/释放进行封装，然后借助局部对象的自动生命周期来管理资源。使用 RAII 可以让用户无需手动管理资源的获取/释放，减少出错的机会。不仅如此，RAII 还是异常安全的：即使获取资源后，在使用资源的过程中抛出异常，也可以自动释放，避免资源泄露。

C++ 标准库里面有很多 RAII 的例子，如 unique_ptr、lock_guard、fstream、string 以及 vector 等各类容器。我们在实现自己的类时，也要尽量遵循 RAII。

## 内存模型
C++ 的内存模型（自 C++11 标准引入）更直接地映射到硬件。它没有“工作内存”和“主内存”这样的抽象概念，而是直接讨论内存位置和内存访问顺序。

核心概念：内存位置与内存序

1. ​内存位置​：

一个内存位置就是一个标量对象（如 int, char*）或相邻的位域。

基本规则是：​不同的线程可以安全地同时修改不同的内存位置，而不会发生数据竞争。​​

2. ​内存序​：

这是 C++ 内存模型的核心和难点。它定义了非原子操作相对于原子操作的可见性顺序。主要有以下几种：

memory_order_relaxed：只保证原子操作的原子性，不提供任何同步或排序约束。性能最好，但最难用对。

memory_order_acquire：通常用于读操作​（load）。保证在本操作之后的所有读写操作不会被重排序到本操作之前。

memory_order_release：通常用于写操作​（store）。保证在本操作之前的所有读写操作不会被重排序到本操作之后。

memory_order_acq_rel：同时具有 acquire 和 release 语义，用于读-改-写操作（如 fetch_add）。

memory_order_seq_cst：​顺序一致性。这是最严格的模式，也是默认模式。它保证所有线程看到的操作顺序是一致的。这最接近 Java 的 volatile语义，但性能开销也最大。

3. C++ 的工具（std::atomic, std::mutex）
​std::atomic​：用于定义原子变量。你可以为每个原子操作指定内存序。
```
std::atomic<int> data(0);
// 线程 A (生产者)
data.store(42, std::memory_order_release); // 相当于“发布”数据

// 线程 B (消费者)
int value = data.load(std::memory_order_acquire); // 相当于“获取”数据
if (value == 42) {
    // 这里能保证看到线程A在store之前的所有写操作
}
```

​std::mutex​：互斥锁。在锁的范围内，它天然地创建了一种最强的内存屏障（类似于 memory_order_seq_cst），保证临界区内的操作不会被重排序到锁外，并且解锁操作具有 release 语义，加锁操作具有 acquire 语义。