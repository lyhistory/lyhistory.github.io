---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 基本概念
Routing is the process of selecting a path for traffic in a network or between or across multiple networks. Broadly, routing is performed in many types of networks, including circuit-switched networks, such as the public switched telephone network (PSTN), and computer networks, such as the Internet.

In packet switching networks, routing is the higher-level decision making that directs network packets from their source toward their destination through intermediate network nodes by specific packet forwarding mechanisms. Packet forwarding is the transit of network packets from one network interface to another. Intermediate nodes are typically network hardware devices such as:
+ routers, 
+ gateways, 
+ firewalls, 
+ or switches. 
General-purpose computers also forward packets and perform routing, although they have no specially optimized hardware for the task.

The routing process usually directs forwarding on the basis of routing tables. Routing tables maintain a record of the routes to various network destinations. Routing tables may be specified by an administrator, learned by observing network traffic or built with the assistance of routing protocols.

Routing, in a narrower sense of the term, often refers to IP routing and is contrasted with bridging. IP routing assumes that network addresses are structured and that similar addresses imply proximity within the network. Structured addresses allow a single routing table entry to represent the route to a group of devices. In large networks, structured addressing (routing, in the narrow sense) outperforms unstructured addressing (bridging). Routing has become the dominant form of addressing on the Internet. Bridging is still widely used within local area networks.

### ARP
ARP协议位于TCP/IP协议栈的网络层和数据链路层之间,可以看作是这两层之间的一个接口。具体来说,ARP协议工作在TCP/IP协议中的网络层,
‌主要负责将网络层地址（‌如IPv4地址）‌解析为链路层地址（‌如MAC地址）‌。‌当主机需要向另一个主机发送数据时，‌它会发送ARP请求广播，‌询问网络中哪个设备的IP地址与目标IP地址匹配。‌收到请求的设备会回应自己的MAC地址，‌这样发送方就知道了目标设备的MAC地址，‌进而可以直接发送数据到目标设备，‌而不需要再进行广播。‌

虽然交换机和ARP在计算机网络中扮演不同的角色，‌但它们之间有一定的联系。‌交换机通过学习MAC地址进行数据帧的转发，‌而ARP协议则负责将IP地址解析为MAC地址，‌确保数据能够正确发送到目标设备。‌在大型网络中，‌ARP和交换机共同工作，‌使得数据能够高效、‌准确地传输到目的设备。‌

路由器和ARP的关系主要体现在路由器通过ARP协议获取物理地址，‌以及通过绑定IP和MAC地址来防止ARP欺骗。‌
路由器作为网络通信的关键设备，‌其功能之一是通过ARP（‌地址解析协议）‌将网络中的IP地址转换为对应的物理地址，‌从而确保数据包能够准确地发送到目标设备。‌ARP协议允许主机发送包含目标IP地址的ARP请求广播到网络上的所有主机，‌并接收返回消息来确定目标的物理地址。‌这个过程是TCP/IP协议栈中的一部分，‌确保了数据包的正确路由。‌

为了防止ARP欺骗，‌路由器支持IP和MAC地址的绑定功能。‌这种绑定可以通过两种方式进行：‌手动添加和通过ARP扫描导入条目。‌手动添加虽然操作复杂，‌但安全性高，‌适用于存在ARP欺骗的情况下；‌而通过ARP扫描导入条目则简单快捷，‌但要求网络中没有ARP欺骗，‌否则可能会绑定错误的IP MAC条目导致某些主机无法上网。‌此外，‌为了防止ARP欺骗，‌不仅需要在路由器上绑定主机的MAC地址，‌还必须在主机上绑定路由器的MAC地址，‌进行双向绑定，‌以确保网络安全。‌
### 路由器 VS 三层交换机
[三层交换机和路由器啥区别](https://mp.weixin.qq.com/s/0bULeAB9kA5etngHrAXvcw)

1、性能不同：三层交换机硬件转发数据而路由基于CPU转发数据，三层交换机比路由器更强大的转发性能

Re：不对。为了保护CPU资源，对于跨三层转发的数据包不论是路由器还是三层交换都采用的是“一次CPU路由，多次硬件转发”机制。
自己找台千兆路由和千兆三层交换配置VLAN，去对比测试不同网段终端交互的吞吐量就知道了，肯定都要到千兆才算合格！但别跟我说你能接受千兆路由器跨三层转发吞吐量达不到千兆，那我真的给你👍👍，代表厂商感谢你的理解！

2.路由功能不同：路由器支持丰富的路由功能，三层交换机只具备基本的路由功能

Re：不对。这个不多讲了吧，静态路由、OSPF、ISIS、RIP、PBR、BGP、PIM、路由策略等路由功能三层交换机基本都支持。比如锐捷的RG-S5750C-24GT8XS-X：

3.规格不同：路由器端口数少而三层交换端口数多

Re：是区别但不是重点。我们讨论的是本质区别，有硬件需求让厂商定制个十几、二十个LAN口的路由器给你用都行，无非是内部堆硬件交换芯片而已。

4.机制不同：三层交换机基于MAC和IP转发数据，路由器基于IP转发数据

Re：不对。路由器LAN-LAN转发不就是基于MAC的么？如果路由器是基于IP转发的，那么二层arp(无IP头部)等报文就不要在LAN转发了，这样LAN下的设备之间就无法通信了。

首先，大家可以想想什么时候会去使用路由器而不会用三层交换机？

我就提1个最简单的且最常见的：NAT功能，用路由器来区分内外网而不用交换机。

想必你们可能会很疑惑：目前具备丰富路由功能的三层交换机为啥基本不支持NAT功能？路由器会有WAN口而三层交换机没有。是因为路由器的设计能基于“会话”去控制连接，可以工作在第四层，从而实现数据包的NAT转发。

比如NAPT机制，一条LAN内网TCP连接会转换成WAN外网TCP连接，源/目的端口也会转换，这样就会在路由器内部生成1条“会话映射表”，基于这条TCP连接的数据流就会被路由器内网<--->外网放行和双向转发。

而三层交换机无“会话”的概念，它只能处理数据包无法处理“会话”，最多工作在第三层。

路由器基于“session”的特性，它能实现NAT、DMZ、PPPoE拨号、虚拟服务器、防火墙(访问控制)等基于连接的功能，能够提供广域网服务。路由器和防火墙一样，是有iptable链表的。很多教材中说路由器是工作在三层的设备，我其实更愿意说它是工作在第四层的设备，因为它能基于TCP/UDP连接实现交换机所没有的功能和需求。
举个实际的例子：任何项目招投标，路由器都要求有这个参数:带机量
带机量是在有线场景下根据设备支持的上网流量最大会话数除以每个用户占用的应用连接数估算的结果，供选型参考，不构成商业承诺。

这个就是会话数规格，交换机是没有的。

那么什么时候会去使用三层交换机而不会用路由器呢？

承载大量交换业务的时候用交换机而不是路由器。交换机的使命就是“数据交换”。所谓术业有专攻，控制会话的任务交给你“路由器或防火墙”，核心数据交换的任务则交给我“三层交换机”。

举个最直接的例子就是Fabric网络中的VXLAN技术仅三层交换机才支持，这种纯“MAC in UDP”的封包转发技术在10G甚至上100G的东西流量网络架构中不会涉及“会话处理”，三层交换机只需要全力去实现路由交换的能力即可。

总结:
+ 路由器和三层交换机的本质区别在于，前者可以基于“session”去控制连接而后者不行；后者的主要工作是全力承载高速流量的交换转发。

+ 基于此，也就能知道两者在网络架构中的基本位置：出口连接外网的位置使用路由器，而核心做路由交换的位置用三层交换机，各司其职为IT网络保驾护航。

### 路由器 VS 网关（不是具体某一层）
路由器是产品，网关是概念

路由器用于连接两个相似类型的网络，网关用于连接两个不同的网络。由于这种逻辑，路由器可能被视为网关，但网关并不总是被视为路由器。路由器是最常用的网关，用于将家庭或企业网络连接到互联网。

所有网络都有一个边界，限制与直接连接到它的设备的通信。因此，如果网络想要与该边界之外的设备，节点或网络通信，则它们需要网关的功能。网关通常被表征为路由器和调制解调器的组合。

网关在网络边缘实现，并管理从该网络内部或外部定向的所有数据。当一个网络想要与另一个网络通信时，数据包将传递到网关，然后通过最有效的路径路由到目的地。除路由数据外，网关还将存储有关主机网络内部路径的信息以及遇到的任何其他网络的路径。

网关基本上是协议转换器，促进两个协议之间的兼容性，并在开放系统互连（OSI）模型的任何层上操作。

### 路由器 网关（网络层） 网卡 网桥
+ 网关 网桥 网卡
网关是邮电局,所有的信息必须通过这里的打包、封箱、寻址，才能发出去与收进来；网卡是设备，也就是邮电局邮筒，你家的信箱；而网桥是邮递员，但他只负责一个镇里面(局域网)不负责广域网

网桥你可以理解为少口交换机，他们都能转发MAC地址，工作在前两层（物理层和数据链路层），只能分析MAC地址不能解析IP地址，只不过一般的网桥没有交换机插口多，是早期的网络产品，现在基本已经淘汰。路由器更好理解了，他能工作在前三层(物理层，数据链路层和网络层），一般只工作在第三层，顾名思义，他能“路由”网络层里的重要东西，就是IP地址，举个例子，两台主机如果IP地址在同一网段，比如192.168.1.1和192.168.1.2，它们之间通讯只要有个网桥或交换机就行了，甚至什么设备不用直接一个网线连就行(现在的操作系统都很智能，不像以前的95，98），但是如果他们工作在不同网段，像172.16.50.1和192.168.1.1，明显IP不同类，这是要通讯就得需要一个路由，帮助他们选择路径，select path(选择路径)在中文意思里就叫路由，能完成这个工作的设备叫路由器，当然你光有设备还不行，你的设置它，就是规定它如何选择路径，这是你就得给他一个网关地址，告诉它如果机器A要访问B,通讯IP地址不同类，就让A把数据包给网关地址，让网关来处理，而网关就是路由器的IP地址，说白了就是给路由器，让它来处理，替主机A来找到主机B

+ 网卡和路由器
要说网卡和路由器的区别，他们存在着很大的区别，唯一的连接就是它们之间的那根网线。网卡工作在物理层，路由器工作在网络层，网卡是用来连上路由的，就像手机与基站的区别，网卡是你你电脑上面的，通过网卡你才能和路由相连，路由是用来连上外网的，只有连上外网你才能上网。。电脑(网卡)-路由-上网。一个是接收器，一个是发射器。网卡是安装在电脑里面的!算是电脑连上网络的最基础层吧!有了网卡你就可以连上网,路由器是连接网卡和网卡之间,就是电脑和电脑的那个工具!有可路由器你就可以建个局域网和多台机用一个帐号上网！所以说网卡是地基,路由器就是连接网卡的桥梁!

+ 网关和路由器
顾名思义，网关（Gateway）就是一个网络连接到另一个网络的“关口”。        
按照不同的分类标准，网关也有很多种。TCP/IP协议里的网关是最常用的，在这里我们所讲的“网关”均指TCP/IP协议下的网关。 
那么网关到底是什么呢？网关实质上是一个网络通向其他网络的IP地址。比如有网络A和网络B，网络A的IP地址范围为“192.168.1.1~192. 168.1.254”，子网掩码为255.255.255.0；网络B的IP地址范围为“192.168.2.1~192.168.2.254”，子网掩码为255.255.255.0。在没有路由器的情况下，两个网络之间是不能进行TCP/IP通信的，即使是两个网络连接在同一台交换机（或集线器）上，TCP/IP协议也会根据子网掩码（255.255.255.0）判定两个网络中的主机处在不同的网络里。而要实现这两个网络之间的通信，则必须通过网关。如果网络A中的主机发现数据包的目的主机不在本地网络中，就把数据包转发给它自己的网关，再由网关转发给网络B的网关，网络B的网关再转发给网络B的某个主机。网络B向网络A转发数据包的过程也是如此。
所以说，只有设置好网关的IP地址，TCP/IP协议才能实现不同网络之间的相互通信。那么这个IP地址是哪台机器的IP地址呢？网关的IP地址是具有路由功能的设备的IP地址，具有路由功能的设备有路由器、启用了路由协议的服务器（实质上相当于一台路由器）、代理服务器（也相当于一台路由器）。     
路由器（Router）是一种负责寻径的网络设备，它在互连网络中从多条路径中寻找通讯量最少的一条网络路径提供给用户通信。路由器用于连接多个逻辑上分开的网络。对用户提供最佳的通信路径，路由器利用路由表为数据传输选择路径，路由表包含网络地址以及各地址之间距离的清单，路由器利用路由表查找数据包从当前位置到目的地址的正确路径。路由器使用最少时间算法或最优路径算法来调整信息传递的路径，如果某一网络路径发生故障或堵塞，路由器可选择另一条路径，以保证信息的正常传输。路由器可进行数据格式的转换，成为不同协议之间网络互连的必要设备。     
路由器使用寻径协议来获得网络信息，采用基于“寻径矩阵”的寻径算法和准则来选择最优路径。按照OSI参考模型，路由器是一个网络层系统。路由器分为单协议路由器和多协议路由器。     
比如如果给你一个IP地址为116.24.143.126,子网掩码255.255.255.224,也就是在这段地址中有32个地址,其中30个可用,去掉网关,还有29个可分配.地址是从116.24.143.96-127,第一个可用的IP是97,最后一个是126,这个例子里,你拿126做网关了,所以从97至125这29个地址是可被你分配的. 同理.116.24.143.126,掩码255.255.255.0,那你就有253个地址可被你分配使用.也就是1-125,127-254. 116.24.143.166,掩码是255.255.255.128,就是有125个地址可被你分配使用.即129-165,167-254.  每段地址有多少可用,不是看IP的最后一位数,而是看子网掩码

### 路由 VS NAT
本质区别：数据包通过路由可以从一个网络到另一个网络，他是通过数据包的目的IP和源IP实现的，当一个数据包进入路由器是，路由器会根据她的目标ip和源ip在路由表中查找，并将数据包原封不动的传向路由器的某个端口。而数据包通过NAT，NAT将会根据规则将数据包中的源ip和目标IP改变，并在NAT机器上做改变记录。

简而言之，路由不改变数据包包头信息，NAT则改变;

表面区别:路由打通的两个网段地位是公平的，既都是公网或都是私网，理解起来比较简单，因为路由不改变包头信息，所以如果用路由连接公网和私网的话，目的地址为私网(192.168.1.2)的数据包在公网上找不到归宿。其实路由表里面也没有相关的路由信息。

**NAT打通的可以是两个公平的网络，也可以是一个内网和一个外网。**
内网机器访问外网肯定要NAT

### MPLS VS IP Routing
In MPLS, the switching of traffic is based on the labels assigned to the network packets. While in IP routing, it is based on the destination IP address. In MPLS, a fixed and dedicated path is established for the routing of network packets.

IP Routing:
Before routers can forward a packet to its final IP address, they must first determine where the packet needs to go. Routers do this by referencing and maintaining a routing table, which tells them how to forward each packet. Each router examines the packet's headers, consults its internal routing table, and forwards the packet to the next network. A router in the next network goes through the same process, and the process repeats until the packet arrives at its destination.

This approach to routing works well for most purposes; most of the Internet runs using IP addresses and routing tables. However, some users or organizations want their data to travel faster over paths they can directly control.

MPLS:
In typical Internet routing, each individual router makes decisions independently based on its own internal routing table. Even if two packets come from the same place and are going to the same destination, they may take different network paths if a router updates its routing table after the first packet passes through. However, with MPLS, packets take the same path every time.
MPLS can be "private" in the sense that only one organization uses certain MPLS paths. However, MPLS does not encrypt traffic. If packets are intercepted along the paths, they can be read. A virtual private network (VPN) does provide encryption and is one method for keeping network connections truly private.

## 路由表 routing table

计算机和路由器既有ARP表，也有路由表

windows路由表详解
https://mp.weixin.qq.com/s/Dep37CyOd0Szr_fzjQFOkA

理解Windows中的路由表和默认网关
https://developer.aliyun.com/article/447528

### 工具

#### route VS ip route:

route is a fairly simple tool, perfect for creating static routes. It's still present in many distributions for compatibility. ip route is much more powerful, it has much more functionality, and can create more specialized rules.

```
ip route add default via 子网网关 dev 网卡名称 table 路由表名称

ip route add 子网网段 dev 网卡名称 table 路由表名称

ip rule add from 网卡地址 table 路由表名称

EXAMPLE:

ip route add default via 10.0.0.1 dev eth0 table 10

ip route add 10.0.0.0/24 dev eth0 table 10

ip rule add from 10.0.0.115 table 10

```
#### arpspoof ARP欺骗攻击


### 路由类型分类一：
+ 主机路由
主机路由是路由选择表中指向单个IP地址或主机名的路由记录。主机路由的Flags字段为H。例如，在下面的示例中，本地主机通过IP地址192.168.1.1的路由器到达IP地址为 172.0.0.5 的主机。
```
Destination    Gateway        Genmask             Flags  Metric    Ref  Use  Iface
-----------    ------         -------             -----  -----     ---  ---  -----      
172.0.0.5      192.168.1.1    255.255.255.255     UH     0         0    0    eth0
```
+ 网络路由
网络路由是代表主机可以到达的网络。网络路由的Flags字段为N。例如，在下面的示例中，本地主机将发送到网络 128.1.1.0 的数据包转发到IP地址为192.168.1.1的路由器。

```
Destination    Gateway        Genmask             Flags  Metric    Ref  Use  Iface
-----------    ------         -------             -----  -----     ---  ---  -----      
128.1.1.0      192.168.1.1    255.255.255.255     UN     0         0    0    eth0
```

+ 默认路由
当主机不能在路由表中查找到目标主机的IP地址或网络路由时，数据包就被发送到默认路由（默认网关 default 0.0.0.0）上。默认路由的Flags字段为G。例如，在下面的示例中，默认路由是IP地址为192.168.1.1的路由器
```
Destination    Gateway        Genmask             Flags  Metric    Ref  Use  Iface
-----------    ------         -------             -----  -----     ---  ---  -----      
default        192.168.1.1    255.255.255.255     UG     0         0    0    eth0
```
### 路由类型分类二

+ destination based routing

+ source based routing
     Scenario:
     [How do I create routing table so packet are returned via the interface where the packet coming from ie : "if packet coming to eth0, it should come out from eth0 using eth0 gateway. If packet is coming from eth1, then the outgoing response also coming out from eth1 using eth1 gateway"](https://serverfault.com/questions/226114/linux-2-network-card-routing-depending-on-the-interface-used)
     [A simple introduction (with a nice easy example) to source based routing](http://wiki.wlug.org.nz/SourceBasedRouting)

### **Example: VPN 改变路由**
```
===========================================================================

IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.5.1     192.168.5.24     50
          0.0.0.0        128.0.0.0      100.64.38.1      100.64.38.3      6
		128.0.0.0        128.0.0.0      100.64.38.1      100.64.38.3      6
```
0.0.0.0/128.0.0.0 covers 0.0.0.0 – 127.255.255.255
128.0.0.0/128.0.0.0 covers 128.0.0.1 – 255.255.255.255

The reason this works is because when it comes to routing, a more specific route is always preferred over a more general route. And 0.0.0.0/0.0.0.0 (the default gateway) is as general as it gets. But if we insert the above two routes, the fact they are more specific means one of them will always be chosen before 0.0.0.0/0.0.0.0 since those two routes still cover the entire IP spectrum (0.0.0.0 thru 255.255.255.255).

VPNs do this to avoid messing w/ existing routes. They don’t need to delete anything that was already there, or even examine the routing table. They just add their own routes when the VPN comes up, and remove them when the VPN is shutdown. Simple.

[Understanding Routing Table with OpenVPN](https://superuser.com/questions/851462/understanding-routing-table-with-openvpn)

### 路由收敛 Routing Convergence
https://network-insight.net/2014/08/25/routing-convergence/

## Protocols
OSPF and RIP are Interior Gateway Protocols (IGP) and distribute routing information within an autonomous system, 
Therefore, both are confined to a single domain for routing (intra-domain). whereas BGP is a Exterior Gateway Protocol, primarily designed to be used to route between routing domains (inter-domain).

一般会先使用IGP协议在自治系统内部计算和发现路由条目，再通过BGP协议将IGP协议产生的路由传递至其他的AS（自治系统）。

BGP解决的是AS之间的路由学习问题，当今互联网是全球互联，在中国，互联网运营商有移动、电信和联通。每个公司都有自己的自治系统，并且内部运行IGP协议。但是互联网又要求互联，所以通过BGP就可以在电信和联通等之间学习对方的AS内部路由，使电信和联通的用户之间互相通信。


### 内部网关协议 Interior Gateway Protocol，IGP

主要包含RIP、OSPF、ISIS、EIGRP

IGP路由协议运行在AS内部，解决的是AS内部的选路问题。主要作用是发现、计算路由。

OSPF
Open Shortest Path First (OSPF) is a link-state routing protocol that was developed for IP networks and is based on the Shortest Path First (SPF) algorithm. OSPF is an Interior Gateway Protocol (IGP).

### 外部网关协议 Exterior Gateway Protocol，EGP

通常就是指BGP，它运行在AS与AS之间，解决的是AS之间的选路问题。BGP的主要作用是控制路由条目的传播和选择最优路由。

https://support.huawei.com/enterprise/zh/doc/EDOC1000089018/c3e1df01

在BGP术语中，全球互联网是由成千上万相关联的自治系统(AS)组成，其中每一个AS代表每一个特定运营商提供的一个网络管理域（据说，美国前总统乔治.布什都有自己的 AS 编号）

+ 单线：服务器上只接一根网线。优点就是超级稳定，速度很快。缺点是不能访问其他运营商的网络 
+ 双线：服务器上接两根不同通讯运营商的网线。为了解决联通不能访问电信网络，电信不能访问联通网络的问题，双线应运而生。优点可以访问其他运营商的网络，缺点就是不稳定，访问别家网络时延迟较高。 
+ 三线、多线：服务器上接三或以上根不同通讯运营商的网线。通常三线也被称为多线。国内除了电信联通外，还有移动和众多小的通讯运营商，所以多线就问世了。多线的优点和缺点和其实和双线一样， 
+ BGP线路：无论是单线，双线，还是多线，都需要有对应的IP地址，即双线双IP、多线多IP，访问速度还是非常有限制的。但BGP可以做到多线单IP，通过每个供应商独有的AS号来实现互联互通。还有个优点就是当其中一条线路挂了，能实现迅速链接其他网络，减少故障带来的损失。当然BGP也是有缺点的，最大的一点就是费用比较高。

BGP

Private leased line (also known as MPLS) provides a dedicated connection that offers lots of bandwidth and it does not route through the Internet. The connection is routed using BGP (border gateway protocol) usually via a telecom provider at their backend infrastructure to establish the secure connection.

[Quagga 把 LINUX 变成 BGP 路由器](https://linux.cn/article-4609-1.html)

如何注册BGP，可以找一个本地互联网注册机构 Local Internet Registry (LIR) 或  区域互联网注册机构 RIR:
[BGP简介和如何申请个人ASN](https://linuxword.com/?p=6287)

[Advice for getting my own ASN](https://www.reddit.com/r/ipv6/comments/yoesvg/advice_for_getting_my_own_asn/)

## Troubleshooting
### intranet access issue raised by wrong arp

I got an issue access the shared folder on the other pc in the same intranet at home, actually it was working fine a few days ago.
both pc are win10 os.

without firm knowlege on networking I started to google without thinking, tried all the online suggestions but no luck;

ok, it could be something wrong either on my win10 or the other one, so I turned off firewall, started all the "file and printer sharing" realted services, turned on sharing for private/public network, grant remote access to both everyone and guest with full permissions, 
even tried modify regedit(registry editor) to enable AllowInsecureGuestAuth, still no luck;

finally I come to think of ping, source ip:192.168.0.141, target ip:192.168.0.113, so ping 192.168.0.113 result in:
```
Pinging 192.168.0.113 with 32 bytes of data:
Reply from *192.168.0.141*: Destination host unreachable.
```
the ip "Reply from " is the source machine, it indicates that it's something wrong with the source machine, 
then I run 'arp -a', 
![](/docs/docs_image/software/network/arp.png)
now things get a bit clear, the target ip isn't in the arp table, I tried arp -d to reset arp, but not working, so I decided the easiest way is to restart router to clear the arp table;
after restarting router, all settled!

finally thoughts: I should spare some time to learn networking.
refer:
https://www.coursera.org/learn/network-protocols-architecture

整理了8张图详解ARP原理
https://zhuanlan.zhihu.com/p/395157603

### Win10下设置自动跳跃数
跃点：即路由。一个路由为一个跃点。传输过程中需要经过多个网络，每个被经过的网络设备点（有能力路由的）叫做一个跃点，地址就是它的ip。跃点数是经过了多少个跃点的累加器，为了防止无用的数据包在网上流散。 为路由指定所需跃点数的整数值（范围是 1 ~ 9999），它用来在路由表里的多个路由中选择与转发包中的目标地址最为匹配的路由。所选的路由具有最少的跃点数。跃点数能够反映跃点的数量、路径的速度、路径可靠性、路径吞吐量以及管理属性。
自动跃点这个功能适用于有多个相同速度的网络接口的场合，例如，当每个网络接口都被分配了一个默认网关时。在这种情况下，用户可能需要手动配置一个网络接口上的跃点数，然后启用“自动跃点计数”功能来配置其他网络接口上的跃点数。使用这种设置可以控制在 IP 流量路由中首先使用的网络接口。
简单来说电脑两张网卡，一个内网一个外网，如果使用一个必须断开另外一个非常麻烦，使用自动跃点就可以轻松在两个网络中进行切换。

先用win+R打开命令提示符，输入“route print”即可显示当前计算机的路由表，我们可以看出第一条是我们本地计算机，最后一个35表示优先级，

在我们连接了WiFi热点后，再次输入命令查看路由表，发现路由表多出一行，这就是我的WiFi，优先级为50，低于以太网；

现在我们设置自动跳跃数，打开“网络连接”，右键以太网，选择“属性”；
在以太网状态窗口中单击“属性”按钮；
在以太网属性窗口中双击“Internet协议版本4（TCP/IPV4）”；
双击“高级”按钮；
把勾选的“自动跳跃点”去掉，把接口跃点数改为35，单击“确定”；
打开命令提示符再次查看一下路由表，发现WiFi热点的路由优先级已经高于以太网了
[Windows主机连接WIFI无法访问内网的网络故障](https://baijiahao.baidu.com/s?id=1757152878290441136&wfr=spider&for=pc#/)
### Asymmetric Routing 非对称路由
What is Asymmetric Routing?
In Asymmetric routing, a packet traverses from a source to a destination in one path and takes a different path when it returns to the source. This is commonly seen in Layer-3 routed networks.

Issues to Consider with Asymmetric Routing
Asymmetric routing is not a problem by itself, but will cause problems when Network Address Translation (NAT) or firewalls are used in the routed path. For example, in firewalls, state information is built when the packets flow from a higher security domain to a lower security domain. The firewall will be an exit point from one security domain to the other. If the return path passes through another firewall, the packet will not be allowed to traverse the firewall from the lower to higher security domain because the firewall in the return path will not have any state information. The state information exists in the first firewall.

[Finding & Fixing Asymmetric Routing Issues](https://www.auvik.com/franklyit/blog/asymmetric-routing-issue/)


#### 双网卡路由问题

为什么需要双网卡，场景：
+ 1. 降低成本，缩减虚拟机，一台虚拟机上跑两个应用，程序代码中做了 IP 地址限制，所以需要在一台虚拟机上配置两个内网 IP 地址
+ 2. 隔离业务（程序运行）网和管理（运维）网，以免运维的时候影响业务网的流量带宽，并且业务网内有安全组设置，而管理网则是通过跳板机

一般云上的虚拟机默认是给主网卡一个路由表，然后扩展网卡需要手动创建路由，如果不创建则会出现下面的问题：

[如何配置多网卡弹性云服务器的策略路由？](https://support.huaweicloud.com/intl/zh-cn/vpc_faq/vpc_faq_0079.html?utm_campaign=ua&utm_content=ecs&utm_term=detail_nics#section2)
[为多网卡Linux云服务器配置策略路由 (IPv4/IPv6)](https://support.huaweicloud.com/intl/zh-cn/bestpractice-vpc/bestpractice_0020.html)

例子：
虚拟机上有两个内网 IP 地址分别是：172.16.173.158/24 和 172.16.174.31/24 ，和一条去往 172.16.173.1 的默认路由
```
[root@XXX ~]# ip add | grep 172
inet 172.16.173.158/24 brd 172.16.173.255 scope global noprefixroute dynamic eth0
inet 172.16.174.31/24 brd 172.16.174.255 scope global noprefixroute dynamic eth1
[root@XXX ~]# 
[root@XXX ~]# ip route
default via 172.16.173.1 dev eth0 proto dhcp metric 100 
169.254.169.254 via 172.16.173.254 dev eth0 proto dhcp metric 100 
172.16.173.0/24 dev eth0 proto kernel scope link src 172.16.173.158 metric 100 
172.16.174.0/24 dev eth1 proto kernel scope link src 172.16.174.31 metric 101 
[root@XXX ~]#
```
假设现在有一台服务器 A ，想去访问 172.16.174.31 上的应用（ A 发起一个目的 IP 为 172.16.174.31 的 TCP 连接）。

那么 172.16.174.31 在往回发送数据包时，数据包会通过默认路由从 eth0 网卡发送给 172.16.173.1（ eth0 网卡上配置的 IP 地址是 172.16.173.158 ），这也就意味着在回包的时候不是 172.16.174.31 回的，而是 172.16.173.158 回的（即 IP 数据包的源 IP 地址是 172.16.173.158 ）。

对于服务器 A 来说，A 是要跟 172.16.174.31 建立 TCP 连接，结果却收到来自 172.16.173.158 的回复，那么这个 TCP 连接自然是建立不起来的。如何解决这个问题呢？针对不同的网卡使用不同的路由表进行路由（即根据源 IP 地址进行路由）即可：

```
[root@XXX ~]# echo 1 > /proc/sys/net/ipv4/ip_forward    # 开启 IP 路由转发功能
[root@XXX ~]# ip rule add from 172.16.173.158 table 10  # 针对不同的网卡（或 IP 地址）配置多个路由表
[root@XXX ~]# ip rule add from 172.16.174.31 table 20

[root@XXX ~]# ip route add default via 172.16.173.1 table 10  # 在不同的路由表中配置默认路由
[root@XXX ~]# ip route add default via 172.16.174.1 table 20
[root@XXX ~]# ip route flush cache  # 刷新
```
虚拟机重启后上述配置就失效了。如果希望重启后还能生效，可以将上述命令加 -p 或者添加到 /etc/rc.local 。

```
[root@XXX ~]# ip route list table 10
default via 172.16.173.1 dev eth0 
[root@XXX ~]# ip route list table 20
default via 172.16.174.1 dev eth1 
[root@XXX ~]#
```

[双网卡设备因路由配置不规范导致通信异常](https://support.huawei.com/enterprise/zh/knowledge/EKB1000028248)

### 路由环路

在维护路由表信息的时候，如果在拓扑发生改变后，网络收敛缓慢产生了不协调或者矛盾的路由选择条目，就会发生路由环路的问题，这种条件下，路由器对无法到达的网络路由不予理睬，导致用户的数据包不停在网络上循环发送，最终造成网络资源的严重浪费。

### 路由黑洞 vs 黑洞路由

> 路由黑洞：
> 路由黑洞一般是在网络边界做汇总回程路由的时候产生的一种不太愿意出现的现象，就是汇总的时候有时会有一些网段并不在内网中存在，但是又包含在汇总后的网段中，如果在这个汇总的边界设备上同时还配置了缺省路由，就可能出现一些问题。这时，如果有数据包发向那些不在内网出现的网段（但是又包含在汇总网段）所在的路由器，根据最长匹配原则，并没有找到对应的路由，只能根据默认路由又回到原来的路由器，这就形成了环路，直到TTL值超时，丢弃。

> 黑洞路由：
> 一条路由无论是静态还是动态，都需要关联到一个出接口，在众多的出接口中，有一种接口非常特殊，即Null（无效）接口，这种类型的接口只有一个编号0，类似（交换机、路由器）的出接口Interface g或e 0/0/0; Null0是系统保留的逻辑接口，当转发网络设备在转发某些数据包时，如果使用出接口为Null0的路由，那么这些报文会被直接丢弃，就像直接丢进一个黑洞里，因此出接口为Null0的路由被称为黑洞路由。

> https://www.cnblogs.com/ggc-gyx/p/16745273.html


什么是云路由？
云路由使用边界网关协议（BGP）动态管理两个虚拟云网络之间或云网络与本地网络之间的连接。云路由可自动适应云中不断变化的网络条件。  云路由器（虚拟化路由器功能的软件）可促进云路由。

什么是 DNS 路由？
域名系统（DNS）将人类可读的域名（例如，www.amazon.com）转换为机器可读的 IP 地址（例如，192.0.2.44）。将此名称信息映射到计算机信息的数据单独存储在 DNS 服务器上。在将数据发送到任何网站之前，路由器必须与 DNS 服务器通信，以确定数据包的确切机器地址。

DNS 服务器通信可能会成为瓶颈，尤其是当许多用户想要同时访问网站时。DNS 路由是指管理与 DNS 服务器通信的各种路由策略和算法。基于延迟的路由和基于地理位置的路由等多种策略有助于管理 DNS 服务器通信负载。