---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---



## 计算机基础教程：数据结构基础

> 本文档对应知识库分类：`架构经验 → Single-Machine Core 系统基础:数据结构 Data Structure`

### 什么是数据结构

数据结构是一种组织和存储数据的方式，旨在实现高效访问与修改。常见的数据结构包括数组、链表、树、哈希表等，它们是编写高效算法的基础。

A particular way of organizing, managing, and storing data to enable efficient access and modification. Examples include arrays, linked lists, trees, and hash tables, which are crucial for writing efficient algorithms​

A data structure is a specialized format for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose. Data structures make it easy for users to access and work with the data they need in appropriate ways.

## 数据结构分类 / Data Structure Hierarchy

### 基本数据结构 (Primitive Data Structure)

+ Primative Data Structure
    - Integer
    - Float
    - Character
    - Boolean

### 非基本数据结构 (Non-Primitive Data Structure)

#### 线性数据结构 (Linear Data Structure)

- Array
- Stack
- Queue
- LinkedList

#### 非线性数据结构 (Non-Linear Data Structure)
- **Tree（树）**
- **Graph（图）**
  - 有向图 (Directed Graph)
    - **有向无环图 DAG (Directed Acyclic Graph)** 
  - 无向图 (Undirected Graph)
  
- Trie（前缀树/字典树）
- Hashtable（哈希表）

---

## DAG（有向无环图）详解

### 定义
DAG 是“Directed Acyclic Graph”的缩写，指**有向无环图**。它满足：
- **有向**：每条边都有方向（A → B 表示依赖或流向）。
- **无环**：从任意节点出发，无法沿着边回到该节点（不存在循环依赖）。

### 与其他图结构的区别
| 类型 | 是否有向 | 是否有环 | 典型应用 |
|------|----------|----------|----------|
| 有向有环图 | 是 | 是 | 状态机、网络路由 |
| 无向图 | 否 | 可能有 | 社交网络、连通性分析 |
| **DAG** | **是** | **否** | 任务调度、版本控制、区块链 |

### 常见应用场景
1. **任务调度与工作流**：如 Apache Airflow、Dagster 中的 DAG 用于定义任务依赖，确保无循环依赖并可并行执行。
2. **数据管道/ETL**：dbt、Spark 等工具用 DAG 表达数据表之间的血缘关系。
3. **版本控制系统**：Git 的提交历史在某种意义上是 DAG（支持分支合并）。
4. **区块链与分布式账本**：IOTA、Hedera 等采用 DAG 结构代替单链，提高并发性能。
5. **编译器优化**：依赖图用于指令调度。

### 核心算法：拓扑排序 (Topological Sort)
DAG 的一个重要特性是**可以进行拓扑排序**，即给出一个线性序列，使得所有边的方向都从前指向后。常用于：
- 编译顺序确定
- 课程安排（先修课问题）
- 任务执行计划

---

## 底层实现与内存模型

### 哈希表与数组的区别
哈希表可以理解为数组的扩展，数组一般是使用索引下标来寻址。

如果关键字key的索引范围较小且是数字，我们可以使用数组来存放。
如果关键字key的范围比较大，用数组的话，申请的内存空间就比较大了。这样内存空间利用率就比较低效。
所以人们开始想办法，能不能有一种方法，把它映射到特定的区域，这个“方法”就是哈希函数。
https://www.cnblogs.com/jiujuan/p/11109509.html#/

#### HashMap 实现演进（JDK 1.8+）
HashMap在jdk1.8之前结构为数组+链表，缺点就是哈希函数很难使元素百分百的均匀分布，这会产生一种极端的可能，就是大量的元素存在一个桶里，此时的复杂时间复杂度为O（n），极大的放慢了计算速率。 在jdk1.8之后，HashMap采用数组加链表或是红黑树的形式， 1、在HashMap添加元素时，按照数组+链表形式添加，当桶中的数量大于8时，链表会转换成红黑树的形式。 2、删除元素、扩容时，同上，数量大于8时，也是采用红黑树形式存贮，但是在数量较少时，即数量小于6时，会将红黑树转换回链表。 3、遍历、查找时，使用红黑树，他的时间复杂度O（log n），便于性能的提高。
https://www.cnblogs.com/FondWang/p/11910355.html#/
https://maimai.cn/article/detail?fid=1717181084&efid=l2yoT-ML3549-wpM3P0Rkg#/
https://www.cnblogs.com/aspirant/p/8902285.html#/

### 内存评估 (Memory Evaluation)

#### Java 对象内存估算 java objects


Estimating the size of Java classes typically involves considering both their compiled bytecode size and their memory footprint when instantiated. Here are some guidelines to help you estimate these sizes:

Java 对象的内存占用包括：
- **对象头开销**：每个对象都有 header（通常 8~16 字节）。
- **字段大小**：基本类型按固定大小，引用类型占 4/8 字节。
- **静态字段**：属于类，被所有实例共享。
- **方法引用**：如事件监听器会增加内存。

**估算工具**：
- `javap -c ClassName`：查看字节码大小。
- Profiling 工具：VisualVM、YourKit 等分析运行时内存。
- 复杂度分析：SonarQube 等插件。

**对象大小类型**：
- **Shallow Size**：对象自身占用的内存，不包括它引用的对象。
- **Retained Size**：对象被 GC 回收后，能释放的总内存（包括其引用的对象）。
- **Deep Size**：对象及其所有直接或间接引用的对象的总大小。

1. Compiled Bytecode Size:
Method Count: Each method contributes to the size of the class.
Field Count: Each field adds to the size.
Import Statements: These affect the bytecode size but usually minimally.
Overall Complexity: More complex logic or extensive use of libraries/frameworks can increase bytecode size.
2. Memory Footprint:
Object Overhead: Each object in Java has an overhead due to the object header.
Field Sizes: Depending on their types (e.g., primitive vs. reference types), fields contribute differently.
Static Fields: These are shared among instances and affect memory usage.
Method References: References to methods (like event listeners) add to memory usage.
3. Tools and Methods to Estimate:
Bytecode Analysis Tools: Tools like javap (Java bytecode disassembler) can provide insight into the bytecode size of each class.
Profiling Tools: Tools like VisualVM or YourKit can profile memory usage of Java applications, including individual classes.
Code Complexity Analysis: Tools like SonarQube or IDE plugins can analyze code complexity metrics, which can correlate with bytecode size.
General Estimates:
Small Class: Typically, a small class with a few fields and methods might have a bytecode size of a few KBs.
Medium Class: Classes with moderate complexity (more fields, methods, some inheritance) could range from tens to hundreds of KBs.
Large Class: Very complex classes or those with extensive libraries imported can exceed several hundred KBs or even megabytes in bytecode size.
Example:
To estimate more accurately, you could use javap -c ClassName to disassemble the bytecode and see the size of methods and fields. For memory footprint, profiling tools provide insights into how much memory instances of your class consume at runtime.

Remember, actual sizes can vary significantly based on factors like compiler optimizations, runtime environment, and the specific details of your code. These estimates are meant to provide a general idea to start with.

Shallow, Retained, and Deep Object Sizes
https://www.baeldung.com/jvm-measuring-object-sizes#/

#### Redis 内存模型 redis memory model
[](/software/buildingblock/redis.md#内存模型)

#### Flink 内存模型 flink memory model
[](/software/bigdata/flink.md#11-architecture)

## 其他相关概念

- **拓扑排序**：见 DAG 章节。
- **最短路径算法**：Dijkstra、Bellman-Ford（可用于带权图，但 DAG 可用更简单的 DP）。
- **最小生成树**：Prim、Kruskal（用于无向图）。
- **强连通分量**：Tarjan 算法（用于有向图，但 DAG 中每个节点自成一个分量）。