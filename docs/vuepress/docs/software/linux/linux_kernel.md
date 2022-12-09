
---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 系统参数

```
cat /etc/os-release

hostnamectl 

hostnamectl status
```



LVS - Linux Virtual Server，即 Linux 虚拟服务器, Linux2.4 内核以后，LVS 已经是 Linux 标准内核的一部分

```
uname -a
```
linux show architecture `uname -m`

## cpu/memory

```
cat /proc/cpuinfo
cat /proc/meminfo
```

top shift+E 切换 bytes Mb Gb

### 内存

![](/docs/docs_image/software/linux/linux_memory.png)
![](/docs/docs_image/software/linux/linux_memory01.png)

top - 17:14:51 up 419 days, 41 min,  1 user,  load average: 1.51, 1.40, 1.42
Tasks: 302 total,   1 running, 301 sleeping,   0 stopped,   0 zombie
%Cpu(s):  9.1 us,  0.4 sy,  0.0 ni, 90.4 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st
GiB Mem :     62.8 total,     16.9 free,     13.6 used,     32.2 buff/cache
GiB Swap:     20.0 total,     20.0 free,      0.0 used.     48.1 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
19363 flink     20   0   15.7g   7.1g  60792 S 147.0 11.4   1929:48 java
 2650 kafka     20   0   10.2g   1.2g  17980 S   2.3  1.8  39:12.25 java

https://serverfault.com/questions/85470/meaning-of-the-buffers-cache-line-in-the-output-of-free

#### GiB Mem total = free+used+buff/cache

+ total (Mem): 
Your total (physical) RAM (excluding a small bit that the kernel permanently reserves for itself at startup);
total installed memory (that is MemTotal from /proc/meminfo), this all the memory in RAM
+ used (Mem): 
used memory, equal to total - free - buffers - cache
+ free (Mem): 
unused memory (that is MemFree), this all the memory that is unused for anything (even caches) in RAM
+ shared (Mem): 
this is the amount of memory used mainly for tmpfs (Shmem)
+ buff/cache (Mem), 
sum of buffers and cache:
    + buffers: 
    memory used by kernel buffers (Buffers), which is memory that the kernel can take advantage of
    + cache: 
    memory used by the page cache and slabs (Cached and SReclaimable). The page cache contains the contents of files in the filesystem cached to RAM, and it is generally a good thing for this to be a high number. I presume "slabs" are a similar caching feature.
+ available (Mem): 
this is an estimate of how much memory is available for starting new applications, without swapping. It includes most of memory counted in the cache field (since the page cache can be dropped to start new applications), but it does not count swap (since it is generally preferable not to use slow swap space).

#### SWAP

+ total (Swap): 
this is the total amount of disk space reserved for swap (SwapTotal in proc/meminfo). You can check by checking that this matches with the output of swapon -s.
+ used (Swap): 
the amount of swap disk space that is currently being used. Again, you can check this by comparing it with the output of swapon -s
+ free (Swap): 
the amount of swap disk space that is currently not being used (SwapFree in /proc/meminfo). It is equal to total (Swap) - used (Swap)

#### virt RES SHR

+ %MEM: 
shows the percentage use of the total physical memory by a process
+ VIRT 
show total memory that a process has access to, including shared memory, swapped pages, and mapped pages
表示的是进程虚拟内存空间大小。
+ RES
shows the total physical memory used, including private and shared by a process
的含义是指进程虚拟内存空间中已经映射到物理内存空间的那部分的大小。

+ SHR
shows total physical shared memory used by a process
是share（共享）的缩写，它表示的是进程占用的共享内存大小。在上图中我们看到进程A虚拟内存空间中的A4和进程B虚拟内存空间中的B3都映射到了物理内存空间的A4/B3部分。咋一看很奇怪。为什么会出现这样的情况呢？其实我们写的程序会依赖于很多外部的动态库（.so），比如libc.so、libld.so等等。这些动态库在内存中仅仅会保存/映射一份，如果某个进程运行时需要这个动态库，那么动态加载器会将这块内存映射到对应进程的虚拟内存空间中。多个进展之间通过共享内存的方式相互通信也会出现这样的情况。这么一来，就会出现不同进程的虚拟内存空间会映射到相同的物理内存空间。这部分物理内存空间其实是被多个进程所共享的，所以我们将他们称为共享内存，用SHR来表示。**某个进程占用的内存除了和别的进程共享的内存之外就是自己的独占内存了。所以要计算进程独占内存的大小只要用RES的值减去SHR值即可。**
+ DATA: 
shows the total private memory used by a process, both physical and virtual
+ CODE: 
shows the total physical memory utilized to load applications
+ SWAP: 
shows the total amount of swap memory available


https://mp.weixin.qq.com/s/-WG0kjK_YQxrXuPi-OebsQ
https://wallenotes.github.io/2018/01/04/Linux/%E5%86%85%E5%AD%98/memory-standard-segment-layout/
https://www.orchome.com/298

### cpu


## 文件描述符 fd

cd /proc/pid/fd



