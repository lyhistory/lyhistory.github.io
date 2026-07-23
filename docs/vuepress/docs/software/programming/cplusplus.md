---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

Refers to
<<Blockchain:EOS>>

Preface:
    	 Container通过Allocator取得存储空间；
       Algorithm通过Iterator存取Container的内容；
       Functor通过Algorithm完成不同策略变化；
       Adapter可修饰或套接Functor；
                               	                By 李胜睿
PartⅠAnalysis Knowledge Points
Container容器？Iterator迭代器？Adapter适配器？Allocator配置器？
1.Container Types and Members in Detail
---In the following subsections,container means the container type thar provides the member
A.
Container::value_type
Container::reference
Container::const_reference
Container::iterator
Container::const_iterator
Container::reverse_iterator
Container::const_reverse_iterator
Container::size_type
Container::difference_type
Container::key_type
Container::mapped_type
Container::key_compare
Container::value_compare
Container::allocator_type
 
Container
Iterator Category
Vector
Random access
Deque
Random access
List
Bidirectional
Set
Bidirectional, element is constant
Multiset
Bidirectional, element is constant
Map
Bidirectional, key is constant
Multimap
Bidirectional, key is constant
String
Random access

     B．Special Containers
       C++标准库不只提供构架整个标准库的容器，还提供了满足特殊需要和简单接口的容器
       a．The so-called container adapter（见4 Adapter）
       b．bitset
 
2,Iterators
An iterator is an object that can “iterate”(navigate) over elements.They do this via a common interface that is adapted from ordinary pointers.Iterators follow the concept of pure abstraction:Anything that behaves like an iterator is an iterator:However,iterators have different abilities.These abilities are important because some algorithms require special iterator abilities.For example,sorting algorithms require iterators that can perform random access because otherwise the runtime would be poor.For this reason,iterators have different categories（not class）:
 
Iterator Category
Ability
Providers
Input iterator
Reads forward
istream
Output iterator
Writes forward
ostream, inserter
Forward iterator
Reads and writes forward
 
Bidirectional iterator
Reads and writes forward and backward
list, set, multiset, map, multimap
Random access iterator
Reads and writes with random access
vector, deque string, array


Input Iterator
Output Iterator
Bidirectional Iterator
Radom Access Iterator
Forward Iterator

All containers define their own iterator types,so you don’t need a special header file for using iterators of containers.However,there are several definitions for special iterators,such as reverse iterators.These are introduced by the <iterator> headerfile,but as containers had defined their reverse iterator types and thus it is included by them.
  3.Adapter
  “An adaptor is a general concept in the library.There are container,iterator,and function adaptors.Essentially,an adaptor is a mechanism for making one thing act like another.A container adaptor takes an existing container type and makes it act like a different abstract type.”
I.Container Adapter
In addition to the fundamental container classes,the C++ standard library provides special needs.These are implemented by using the fundamental containers classes☹ （Container adapters are historically part of the STL.However,from a programmer’s   view point,they are just special containers that use the general framework of the containers,iterators,and algorithms provided by the STL.）
 
Container Adapter
 
Default Container
Stack
LIFO
Deque
Queue
FIFO
Deque
Priority Queue
Priority managed queue
Vector

II.Iterator Adapter
Iterator are pure abstractions:Anything that behaves like an iterator is an iterator.For this reason,you can write classes that have the interface of iterators but do something(completely)different.The C++ standard library provides several predefined special iterators---iterator adapters.They are more than auxiliary classes;they give the whole concept a lot more power.
Insert iterators
Stream iterators
Reverse iterators
III.Functor Adapter .etc
4.Allocators
  “C++标准程式库在许多地方采用特殊物件来处理记忆体配置和地址，这样的物件被称为配置器。”
“They represent a special memory model and are an abstraction used to translate the need to use memory into a raw call for memory.”
--“配置器表现出一种特定的记忆体模型，成为一个抽象表征，表现出『记忆体需求』至『记忆体低阶呼叫』的转换。
 
迭代器失效?
Some container operations change the internal state of acontainer or cause the elements in the container to be moved.Such operations invalidate all iterators that refer to the elements that are moved and may invalidate other iterators as well.Using an invalidated iterator is undefined,and likely to lead to the same kinds of problems as using a dangling pointer.
 
传说中的关联容器？
Associative containers,元素位置取决于特定的排序准则。如果你将六个元素置入这样的群集中，它们的位置取决于元素值，和插入次序无关。因此，关联容器也可视为特殊的sequence container，例如Smalltalk和NIHCL所提供者，在那些程式库中，sorted collections由ordered collections衍生而来，不过STL所提供的群集型别（collection types）彼此独立，各自实现，毫无关系（意指其间并无classes继承关系）
关联容器自动对其元素排序，这并不意味它们就是用来排序的。你也可以对序列式容器的元素手工排序。自动排序的优点是：搜索元素时可获得更佳效率，明确讲就是可放心的使用Binary search，只有对数复杂度，而非线性复杂度。
By default,the containers compare the elements or the keys with operator”<”.However,you can supply your own comparison function to define another ordering criterion.
Associative containers are typically implemented as binary trees.Thus,every element(every node)has one parent and two children.All ancestors to the left have lesser values,all ancestors to the right have greater values.The asscociative containers differ in the kind of elements they support and how they handle duplicates.
容器选用？When to use which container?
   
 
Vector
Deque
List
Set
Multiset
Map
Multimap
Typical internal data structure
Dynamic array
Array of arrays
Doubly linked list
Binary tree
Binary tree
Binary tree
Binary tree
Elements
Value
Value
Value
Value
Value
Key/value pair
Key/value pair
Duplicates allowed
Yes
Yes
Yes
No
Yes
Not for the key
Yes
Random access available
Yes
Yes
No
No
No
With key
No
Iterator category
Random access
Random access
Bidirectional
Bidirectional (element constant)
Bidirectional (element constant)
Bidirectional (key constant)
Bidirectional (key constant)
Search/find elements
Slow
Slow
Very slow
Fast
Fast
Fast for key
Fast for key
Inserting/removing of elements is fast
At the end
At the beginning and the end
Anywhere
—
—
—
—
Inserting/removing invalidates iterators, references, pointers
On reallocation
Always
Never
Never
Never
Never
Never
Frees memory for removed elements
Never
Sometimes
Always
Always
Always
Always
Always
Allows memory reservation
Yes
No
—
—
—
—
—
Transaction safe (success or no effect)
Push/pop at the end
Push/pop at the beginning and the end
All except sort() and assignments
All except multiple-element insertions
All except
multiple-element insertions
All except multiple-element insertions
All except multiple-element insertions

  By deault,you should use a vector.It has the simplest internal data structure and provides random access.Thus,data access is convenient and flexible,and data processing is often fast enough.
容器的能力---各种操作
容器类共享公共的接口，“Each container type offers a different set of time and functionality tradeoffs.Often a program using one type can be fine-tuned by substituting  another container without changing our code beyond the need to change type declarations.”
“In general,operations are not safe.The caller must ensure that the parameters of the operations meet the requirements.Violating these requirements.Usually the STL does not throw exceptions by itself.If user-defined operations called by the STL containers do throw”
 
1,Create,Copy,and Destroy Operations
2.Nonmodifying Operations
a) Size Operation
b)Capacity Operations
c)Comparison Operations
3.Common Modifying Operations
Inserting and Removing Elements
  Insert()push_back()push_front()remove()
  erase()pop_front()pop_back()resize()clear()
4.Assignments
a)operator=
b) assign
c)swap
5.Direct Element Access
Back()front()
6.Special Member Functions for (Lists)
  Unique()splice()sort()merge()reverse()
 
   	    Container Operations with Special Guarantees in face of Exception
Operation
Guarantee
vector::push_back()
Either succeeds or has no effect
vector::insert()
Either succeeds or has no effect if copying/assigning elements doesn't throw
vector::pop_back()
Doesn't throw
vector::erase()
Doesn't throw if copying/assigning elements doesn't throw
vector::clear()
Doesn't throw if copying/assigning elements doesn't throw
vector::swap()
Doesn't throw
deque::push_back()
Either succeeds or has no effect
deque::push_front()
Either succeeds or has no effect
deque::insert()
Either succeeds or has no effect if copying/assigning elements doesn't throw
deque::pop_back()
Doesn't throw
deque::pop_front()
Doesn't throw
deque::erase()
Doesn't throw if copying/assigning elements doesn't throw
deque::clear()
Doesn't throw if copying/assigning elements doesn't throw
deque::swap()
Doesn't throw
list::push_back()
Either succeeds or has no effect
list::push_front()
Either succeeds or has no effect
list::insert()
Either succeeds or has no effect
list::pop_back()
Doesn't throw
list::pop_front()
Doesn't throw
list::erase()
Doesn't throw
list:: clear()
Doesn't throw
list:: remove()
Doesn't throw if comparing the elements doesn't throw
list::remove_if()
Doesn't throw if the predicate doesn't throw
list::unique()
Doesn't throw if comparing the elements doesn't throw
list::splice()
Doesn't throw
list::merge()
Either succeeds or has no effect if comparing the elements doesn't throw
list::reverse()
Doesn't throw
list::swap()
Doesn't throw
[multi]set::insert()
For single elements either succeeds or has no effect
[multi]set::erase()
Doesn't throw
[multi]set::clear()
Doesn't throw
[multi]set::swap()
Doesn't throw if copying/assigning the comparison criterion doesn't throw
[multi]map::insert()
For single elements either succeeds or has no effect
[multi]map::erase()
Doesn't throw
[multi]map::clear()
Doesn't throw
[multi]map::swap()
Doesn't throw if copying/assigning the comparison criterion doesn't throw

 
泛型？算法！
“The generic concept of STL works with pure abstraction”
“Operations use the same interface but different types，so you can use the templates to formulate generic operations that work with arbitrary types that satisfy the interface”
“In general,all elements have an order.Thus,you can iterate one or many times over all elements in the same order.Each container type provides operations that return iterators to iterate over the elements.This is the key interface of the STL algorithms.”
标准库提供了一些标准的处理elements的算法，这些算法提供了一般的基本操作，比如：searching、copying、reordering、modifying、numeric processing
“The concept of the STL is based on a separation of data and operations.The data is managed by container classes,and the operations are defined by configurable algorithms.Iterators are the glue between these two components.They let any algorithm interact with any container”

Container
Container
Container
Algorithm
Iterator
Iterator
Iterator

Algorithms不是Container classes 的member functions，而是Global functions，带来的好处是所有算法可由任何容器类型加以实现而不是要一种算法对应于一个特定的容器类型，甚至可以应用于不同容器类型的元素，也可用于自定义的容器类型，总之是减少了代码量、提高了弹性。
注意到这并非物件导向设计的范例，是泛型设计的例子。在所谓的物件导向设计中，数据和操作是被统一起来的，这里确被严格区分开来并通过接口（特定界面）交互。
“However,this concept also has its price:”（《C++Standard Library》5.4节，由于英文不好，将这句理解为但是依然有它的价值，导致下面完全理解相反，嘿嘿，还是引用别人的翻译好了）“当然这需要付出代价：首先，用法有失直观，其次，某些资料结构和演算法之间并不相容。更有甚者，某些容器和演算法虽然勉强相容，却毫无用处（也许导致很糟的效能）。因此，深入学习STL的概念并了解其缺陷，显得十分重要，惟其如此，方能取其利而避其害。”
 
PartⅡ Aggregate Learning Points
引用：“在这个庞大的世界里，人们面临的是错综复杂、相互联系和处于不断变化中的工具、语言和系统，以及对任何东西都提出更多要求的无情压力。在这种情况下，人们很容易忘掉那些最基本的原则---简单性、清晰性和普通性---而正是这些东西，实际上是构成好软件的基石。”---《程序设计实践》前言Brian W。Kernighan
感想：学习C的时候编程做了很多无聊的东西，当然也是基础必须的，但是也养成了很坏的编程习惯，不是追求可移植性、健壮性，而是做好就完事，没有考虑到接口的问题以及各种潜在的薄弱点。直到学了一点C++点皮毛，矫正了编程的心态，C++很优美，完美的风格、语法，以及很Cool的算法给了我很多快乐。
PartⅢ Parse  Difficulties in Exercise
1.vector的capacity：自增长
2.string的操作：
   char *cp = "Hiya";
   string s1(cp);
   string s2(cp,2);    //s2=="Hi"
   string s3(s1, 2);    // s3 == "ya"
3.
 
 
Books Referenced：
《Effiective C++Program》
《C++ Standard Library》
《数据结构与算法C++描述》
《程序设计实践》


gcc&make
./configure is typically equivalent to ./configure --prefix=/usr/local https://askubuntu.com/questions/891835/what-does-prefix-do-exactly-when-used-in-configure

GCC and MakeCompiling, Linking and BuildingC/C++ Applications
https://www3.ntu.edu.sg/home/ehchua/programming/cpp/gcc_make.html

make --print-data-base | grep 'CXX'

 CPPFLAGS are flags that need to be passed to the C pre-processor before compilation, and LDFLAGS are flags that need to be passed to the linker to generate the final binary.
CFLAGS enables the addition of switches for the C compiler, while CXXFLAGS is meant to be used when invoking a C++ compiler. Similarly, a variable CPPFLAGS exists with switches to be passed to the C or C++ preprocessor.

The magic behind configure, make, make install https://robots.thoughtbot.com/the-magic-behind-configure-make-make-install

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