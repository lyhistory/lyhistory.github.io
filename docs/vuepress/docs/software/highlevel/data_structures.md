A data structure is a specialized format for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose. Data structures make it easy for users to access and work with the data they need in appropriate ways.

## Types of data structures / Data Structure Hierarchy

+ Primative Data Structure
    - Integer
    - Float
    - Character
    - Boolean

+ NonPrimative Data Structure
    - Linear Data Structure
        - Array
        - Stack
        - Queue
        - LinkedList
    - NonLinear Data Structure
        - Tree
        - Graph
        - Trie
        - Hashtable
## 底层实现

哈希表和数组区别#
哈希表可以理解为数组的扩展，数组一般是使用索引下标来寻址。

如果关键字key的索引范围较小且是数字，我们可以使用数组来存放。
如果关键字key的范围比较大，用数组的话，申请的内存空间就比较大了。这样内存空间利用率就比较低效。
所以人们开始想办法，能不能有一种方法，把它映射到特定的区域，这个“方法”就是哈希函数。
https://www.cnblogs.com/jiujuan/p/11109509.html#/

HashMap在jdk1.8之前结构为数组+链表，缺点就是哈希函数很难使元素百分百的均匀分布，这会产生一种极端的可能，就是大量的元素存在一个桶里，此时的复杂时间复杂度为O（n），极大的放慢了计算速率。 在jdk1.8之后，HashMap采用数组加链表或是红黑树的形式， 1、在HashMap添加元素时，按照数组+链表形式添加，当桶中的数量大于8时，链表会转换成红黑树的形式。 2、删除元素、扩容时，同上，数量大于8时，也是采用红黑树形式存贮，但是在数量较少时，即数量小于6时，会将红黑树转换回链表。 3、遍历、查找时，使用红黑树，他的时间复杂度O（log n），便于性能的提高。
https://www.cnblogs.com/FondWang/p/11910355.html#/
https://maimai.cn/article/detail?fid=1717181084&efid=l2yoT-ML3549-wpM3P0Rkg#/
https://www.cnblogs.com/aspirant/p/8902285.html#/

## Memory Evaluation

### java objects
Estimating the size of Java classes typically involves considering both their compiled bytecode size and their memory footprint when instantiated. Here are some guidelines to help you estimate these sizes:

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

### redis memory model
[](/software/buildingblock/redis.md#内存模型)

### flink memory model
[](/software/bigdata/flink.md#11-architecture)

