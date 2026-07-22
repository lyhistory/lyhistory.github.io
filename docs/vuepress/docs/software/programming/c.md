
[SDCC - Small Device C Compiler](https://sdcc.sourceforge.net/)

Makefiles are used to help decide which parts of a large program need to be recompiled. In the vast majority of cases, C or C++ files are compiled. Other languages typically have their own tools that serve a similar purpose as Make. Make can also be used beyond compilation too, when you need a series of instructions to run depending on what files have changed.


![Makefile不识别shell alias](/docs/docs_image/software/programming/makefile.png)

一．
在C语言家族程序中，头文件被大量使用。一般而言，每个C++/C程序通常由头文件(header files)和定义文件(definition files)组成。头文件作为一种包含功能函数、数据接口声明的载体文件，用于保存程序的声明(declaration)，而定义文件用于保存程序的实现(implementation)。
示例：C++/C程序的头文件以“.h”为后缀。以下是假设名称为 graphics.h的头文件：
 
#ifndef GRAPHICS_H (作用：防止graphics.h被重复引用)
#define GRAPHICS_H
#include.... (作用：引用标准库的头文件)
...
#include... (作用：引用非标准库的头文件)
...
void Function1(...); (作用：全局函数声明)
...
class Box (作用：类结构声明)
{
...
};
#endif
结论：头文件一般由三部分内容组成：
(1)头文件开头处的版权和版本声明；
(2)预处理块；
(3)函数和类结构声明等。在头文件中，用ifndef/define/endif结构产生预处理块，用 #include 格式来引用库的头文件。头文件的这种结构，是利用C语言进行开发软件所通常具备的，属于公有知识。
补充：一般在一个应用开发体系中，功能的真正逻辑实现是以硬件层为基础，在驱动程序、功能层程序以及用户的应用程序中完成的。
根据以上示例，可以发现头文件的主要作用在于调用库功能，对各个被调用函数给出一个描述，其本身不包含程序的逻辑实现代码，它只起描述性作用，告诉应用程序通过相应途径寻找相应功能函数的真正逻辑实现代码。用户程序只需要按照头文件中的接口声明来调用库功能，编译器会从库中提取相应的代码。
从以上结构图来看，头文件是用户应用程序和函数库之间的桥梁和纽带。在整个软件中，头文件不是最重要的部分，但它是C语言家族中不可缺少的组成部分。做一个不算很恰当的比喻，头文件就像是一本书中的目录，读者(用户程序)通过目录，可以很方便就查阅其需要的内容(函数库)。在一本书中，目录固然重要，但绝对不是一本书的核心的、最重要的部分。
 
二．C++中，头文件与命名空间的关系
问题：有些书说有些头文件不在std里是什么意思？std里包含些什么？为什么不用std就不能使用cout？头文件中声明的东西为什么在使用的时候需要先using namespace std；一下？
问题补充：如果我不用＃include<iostream>和其他头文件。只用using namespace std 的话，是不能用cout的。这说明cout是在iostream里声明的，想不通既然声明了为什么还要using namespace一下？但是不using的话vc6报错cout 没有声明。不懂。
我的答案：只要声明了命名空间std就可以用cout，方法是std::cout,<iostream>中只是声明了std，而不是具体到其中的东东，在整个作用域中std是可见的，cout还藏在std里呢
高手解答：那些书那样说会造成困惑，因为名字空间，就像函数、 结构、类等等，是用代码来表达的一种语言机制。 std（standard的缩写）是标准C++里必须存在的一个名字空间的名字。所有实现标准C++的编译器都必须确保这空间的存在。
名字空间声明是这样表达的：
namespace x {
// 创建新名字
}
x是该名字空间的名字。
我的小Demo：
#include<iostream>
//using namespace std;
using std::cout;
using std::endl;
 
namespace Tom{
          int Sum1To3()
          {
              return 1+2+3;
              }
          void PrintString()
          {
               cout<<"C++ Programming is Great!"<<endl;
               }
         // void Tom():int a(1),b(2),c(3){}    //only constructors take base initializers
          class Tom{
                public:
                Tom(int na,int nb,int nc):a(na),b(nb),c(nc)
                {
       	         cout<<a<<' '<<b<<' '<<c<<' '<<endl;
                    }
                private:
                        int a,b,c;
                    };
                    }
int main()
{
    cout<<Tom::Sum1To3()<<endl;
    Tom::PrintString();
    Tom::Tom Little_Tom(1,2,3);
    system("pause");
    return 0;
}
补充：头文件装代码，代码表达名字空间。所以应该说“有些头文件的内容不在std里”。 具体的意思就是，在那些头文件里，没有任何代码是在“namespace std { }”的括号里的。std里包含标准C++库里的所有名字（类名、函数名...）。用某个名字做名字空间声明的时候，若已有同名的名字空间存在，就是仅仅把括号里的名字加进去，否则先创建空间，后加入括号里的名字。加入名字空间后的名字都是对全局空间隐藏的， 但该名字空间的名字却不隐藏（除非该空间在另一个名字空间里）。
cout隐藏在std里，但std本身不隐藏，所以你“#include<iostream>”了之后，不做使用声明便可直接用std，通过它访问cout。
若你做了使用声明，对该使用声明所处的作用域的隐藏便被抵消（作用域的开端到声明之间的那段除外），即不必使用空间名和名字空间限制符作为前缀。
Another Demo：
#include<iostream>
using std::cout;
using std::endl;
namespace std{
          int new_one()
          {
              cout<<"Hello everyone!I am a new one!"<<endl;
              }
              }
using std::new_one;
int main(int argc,char *argv[])
{
    new_one();
    system("pause");
    return 0;
}
我们作个总结性的复习吧：
iostream头文件里有std的声明。在编译之前，预处理器会用iostream里的全部内容来代替“#include<iostream>”这个预处理器指示符。效果是，这程序包含iostream里的所有代码。 包含指示是在全局空间里，所以在指示之后的任何地方，std这个名字是可见、可访问的。
