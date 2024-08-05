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
