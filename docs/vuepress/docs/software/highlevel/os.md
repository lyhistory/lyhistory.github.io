
+ CPU Processor
  - register
     寄存器是CPU内部的元件，寄存器拥有非常高的读写速度，所以在寄存器之间的数据传送非常快。它们可用来暂存指令、数据和位址。在中央处理器的控制部件中，包含的寄存器有指令寄存器(IR)和程序计数器(PC)。
  - program counter
  - Cache 高速缓存
    由于CPU的速度远高于主内存，CPU直接从内存中存取数据要等待一定时间周期，Cache中保存着CPU刚用过或循环使用的一部分数据，当CPU再次使用该部分数据时可从Cache中直接调用,这样就减少了CPU的等待时间,提高了系统的效率。Cache又分为一级Cache(L1 Cache)和二级Cache(L2 Cache)，L1 Cache集成在CPU内部，L2 Cache早期一般是焊在主板上,现在也都集成在CPU内部，常见的容量有256KB或512KB L2 Cache。
  
+ RAM:Main Memory
  RAM is also known as the main memory of the computer because the CPU of the computer can access all memory cells of the RAM directly. In modern computer, RAM is made up of semiconductor materials and found in the form of ICs.
  - SRAM Static RAM
  - DRAM - 
    Dynamic random access memory is a type of semiconductor memory that is typically used for the data or program code needed by a computer processor to function. DRAM is a common type of random access memory (RAM) that is used in personal computers (PCs), workstations and servers.
+ ROM:
  it is used to store those parts of computer instructions and programs that do not required to be changed like BIOS. Therefore, ROM is used to make computer firmware. Generally, data is stored in the RAM during the process of manufacturing. ROM is also a type of semiconductor memory and built in the form of ICs.

  ROM stores the data permanently, thus it is a non-volatile memory which means it holds the data even when the computer is switched off. The CPU of the computer can only read data from the memory cells of ROM, but cannot change.
+ Hard Disk

Processors 和 main memory 之间存在 different levels of caching: store buffer L1 L2 L3 

A memory buffer register (MBR) or memory data register (MDR) is the register in a computer's CPU that stores the data being transferred to and from the immediate access storage. It contains a copy of the value in the memory location specified by the memory address register. It acts as a buffer, allowing the processor and memory units to act independently without being affected by minor differences in operation. A data item will be copied to the MBR ready for use at the next clock cycle, when it can be either used by the processor for reading or writing, or stored in main memory after being written.

This register holds the contents of the memory which are to be transferred from memory to other components or vice versa. A word to be stored must be transferred to the MBR, from where it goes to the specific memory location, and the arithmetic data to be processed in the ALU first goes to MBR and then to accumulated register, and then it is processed in the ALU.

The MDR is a two-way register. When data is fetched from memory and placed into the MDR, it is written to go in one direction. When there is a write instruction, the data to be written is placed into the MDR from another CPU register, which then puts the data into memory.

The memory data register is half of a minimal interface between a microprogram and computer storage; the other half is a memory address register (MAR).


指令寄存器和程序计数器

https://www.baeldung.com/cs/registers-and-ram

## false sharing
sometimes false sharing can turn multithreading against us.

most modern processors not only cache the requested value but also cache a few more nearby values. This optimization is based on the idea of spatial locality and can significantly improve the overall performance of applications. Simply put, processor caches are working in terms of cache lines, instead of single cacheable values.

When multiple processors are operating on the same or nearby memory locations, they may end up sharing the same cache line. In such situations, it's essential to keep those overlapping caches in different cores consistent with each other. The act of maintaining such consistency is called cache coherency.

There are quite a few protocols to maintain the cache coherency between CPU cores. In this article, we're going to talk about the MESI protocol.

In the MESI protocol, each cache line can be in one of these four distinct states: 
- Modified, 
- Exclusive, 
- Shared, or 
- Invalid. 

todo 翻译 https://www.baeldung.com/java-false-sharing-contended

### example: LongAdder.java
[LongAdder.java](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/atomic/LongAdder.java)
[Striped64.java](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/atomic/Striped64.java)

https://acehjm.github.io/2020/01/08/Striped64%E5%AD%A6%E4%B9%A0/
https://zhuanlan.zhihu.com/p/65520633
https://juejin.cn/post/6844904031169593357
https://www.jianshu.com/p/30d328e9353b
https://juejin.cn/post/6914932805533171720

