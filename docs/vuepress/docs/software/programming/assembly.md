https://www.tutorialspoint.com/assembly_programming/index.htm

## 架构

x86架构 x64(x86_64) 高功耗计算机和服务器
ARM架构： 低功耗处理器 嵌入式系统

ARM既是指令集或架构又可指ARM处理器。

X86表示的是baiCPU指令集类型du。

x64全称”x86-64”也是CPU的指zhi令集类型。

ARM处理器是Acorn计算机有限公dao司面向低预算市场设计的第一款RISC微处理器。更早称作Acorn RISC Machine。ARM处理器本身是32位设计，但也配备16位指令集，一般来讲比等价32位代码节省达35%，却能保留32位系统的所有优势。

    X86是由Intel推出的一种复杂指令集，用于控制芯片的运行的程序，现在X86已经广泛运用到了家用PC领域。
    
    “x86-64”，有时会简称为“x64”，是64位微处理器架构及其相应指令集的一种，也是Intel x86架构的延伸产品。“x86-64”1999由AMD设计，AMD首次公开64位集以扩充给IA-32，称为x86-64（后来改名为AMD64）。其后也为英特尔所采用，现时英特尔称之为“Intel 64”，在之前曾使用过Clackamas Technology (CT)、IA-32e及EM64T。外界多使用"x86-64"或"x64"去称呼此64位架构，从而保持中立，不偏袒任何厂商。
## 寄存器

段地址 偏移地址

https://zhuanlan.zhihu.com/p/72016353

不同的CPU，寄存器的个数、结构是不相同的，8086CPU有14个寄存器，每个寄存器有一个名称，我们对它进行分类：

1． 通用寄存器：AX、BX、CX、DX

2． 段寄存器：CS、SS、DS、ES

3． 指针寄存器：SP、BP

4． 变址寄存器：SI、DI

5． 指令指针寄存器：IP

6． 标志寄存器：FR

以上寄存器都是16位的，更古老的CPU的寄存器是8位的，这个就不讲了。现在的CPU的寄存器是32位的



EAX 是"累加器"(accumulator), 它是很多加法乘法指令的缺省寄存器。

EBX 是"基地址"(base)寄存器, 在内存寻址时存放基地址。

ECX 是计数器(counter), 是重复(REP)前缀指令和LOOP指令的内定计数器。

EDX 则总是被用来放整数除法产生的余数。

ESI/EDI分别叫做"源/目标索引寄存器"(source/destination index),因为在很多字符串操作指令中, DS:ESI指向源串,而ES:EDI指向目标串.

EBP是"基址指针"(BASE POINTER), 它最经常被用作高级语言函数调用的"框架指针"(frame pointer). 在破解的时候,经常可以看见一个标准的函数起始代码:

https://blog.csdn.net/chenlycly/article/details/37912755



栈一次入栈数据 16位的倍数？ 一个栈地址不是对应一个字节数据吗？

出栈入栈都是以字节为单位的



https://bbs.csdn.net/topics/370193730

AT&T汇编语法：

mov  %esp,%ebp  是指esp寄存器的内容存入ebp

Intel汇编语法：

mov opd ops	是将ops传送至opd



AX VS EAX 2字节 4字节

[] 代表寄存器的值所代表的内存地址对应的内容

堆栈地址

简单以windows为例

假设内存从0x00000000 0xFFFFFFFF，堆从0x00000000 往上增长，栈从0xFFFFFFFF往下增长，也是比较合理的设计；



https://blog.csdn.net/changyourmind/article/details/51839395

栈空间 增长方向 大端 小端

小端是第一个字节在高位，从高到低，跟栈的增长方向一致

虽然栈空间增长方向是从高（栈底）到低（栈顶），

但是

假设整个栈空间是 0xFFFFFFFF 到 0x00000000

父函数占用了空间 0x40000000 到 0x30000000 

父函数分配给子函数栈空间，0012FFFC  到 00104000   

从ollydbg cpu页面右下角的栈空间可以看到，返回到父函数地址是 30F0B5FB，该函数的

00123DA0   30F0B5FB  RETURN to mso.30F0B5FB
00123DA4   012E07AC	//参数一 源地址
00123DA8   00123DC0 //参数二 目的地址
00123DAC   00000000 //参数三

子函数内 使用 栈的方式肯定也是从高地址到低地址，

不过当从源地址复制到目的地址的时候，假设目的地址分配了8个字节，所以范围是[00123DC0, 00123DC7]

函数执行的时候写入还是从00123DC0开始写到00123DC7，这并不违背分配空间的时候还是从高地址到低地址；



更复杂的情况，比如子函数内调用其他函数都是类似的

[https://bboyjing.github.io/2019/03/19/%E6%A0%88%E7%A9%BA%E9%97%B4%E5%92%8C%E5%A4%A7%E3%80%81%E5%B0%8F%E7%AB%AF/](https://bboyjing.github.io/2019/03/19/栈空间和大、小端/)



```assembly
https://stackoverflow.com/questions/12234817/what-does-this-instruction-do-mov-gs0x14-eax

mov    %gs:0x14,%eax
it means reading 4 bytes into eax from memory at address gs:0x14. gs is a segment register. Most likely thread-local storage (AKA TLS) is referenced through this register. 

https://stackoverflow.com/questions/4228261/understanding-the-purpose-of-some-assembly-statements
lea    -0x4(%ecx),%esp             ; esp := [ecx-4]

xor    %eax,%eax  
Explaining this requires some history of the X86 architecture


https://stackoverflow.com/questions/19692418/x86-assembly-compare-with-null-terminated-array
test  cl, cl                ; will be zero when NUL

EB 06 之后，跳转到6字节之后

```





