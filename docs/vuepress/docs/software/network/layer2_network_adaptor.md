
网络适配器网络适配器又称网卡或网络接口卡（NIC），英文名NetworkInterfaceCard

A network interface controller (NIC, also known as a network interface card, network adapter, LAN adapter or physical network interface, and by similar terms) is a computer hardware component that connects a computer to a computer network.


物理网卡 VS 虚拟网卡

包含以下MAC地址的前8个字节（前3段）是虚拟网卡(综合stackoverflow和github得出2016年10月8日)：
```
"00:05:69"; //vmware1
"00:0C:29"; //vmware2
"00:50:56"; //vmware3
"00:1c:14"; //vmware4
"00:1C:42"; //parallels1
"00:03:FF"; //microsoft virtual pc
"00:0F:4B"; //virtual iron 4
"00:16:3E"; //red hat xen , oracle vm , xen source, novell xen
"08:00:27"; //virtualbox
```

## 网卡与内核

物理网卡需网卡驱动程序向内核注册后方可工作，注册后一般会显示对应的网卡接口，网卡接口名称是给用户看的，内核不以接口名称来识别网卡

每个物理网卡都像门一样，都连接着两端：一端是内核(网络协议栈)，另一端是外界网络。
当本机要通过该网卡向外发送数据时，数据从内核协议栈写入到该网卡，然后网卡发送出去。

当该网卡接收到外界传来的数据时，网卡需要中断通知内核有数据来临(因为只有内核才具有读写数据的特权)，数据将从网卡读取到内核协议栈。这就像是带有门卫系统的门一样，有人来了先报告一声。

同时，网卡是一个带有芯片的硬件设备，带有芯片意味着除了硬件自身的基础功能外，还可以通过一些代码(网卡驱动程序)来控制网卡的工作，比如中断通知内核，比如DMA，等。

如果网卡没有DMA功能，网络协议栈和网卡之间的数据传输都将由内核完成读或写。网卡具备DMA功能时，网卡和网络协议栈之间的数据传输主要由网卡DMA完成，DMA传输完数据后，DMA控制器中断通知内核，表示数据已写入目标内存地址。

此外，物理网卡也有缓存。当内核想要通过某网卡发送数据时，该网卡可以将内核写入该网卡的数据缓存起来，然后由网卡自身来决定何时发送数据。同理，网卡接收数据时也可以缓存一部分后再通知内核来读取网卡中的数据。

举例实例分析参考：[BIO/NIO/多路复用/NETTY](/docs/software/buildingblock/nio_epoll)