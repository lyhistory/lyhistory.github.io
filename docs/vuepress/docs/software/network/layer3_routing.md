

Routing is the process of selecting a path for traffic in a network or between or across multiple networks. Broadly, routing is performed in many types of networks, including circuit-switched networks, such as the public switched telephone network (PSTN), and computer networks, such as the Internet.

In packet switching networks, routing is the higher-level decision making that directs network packets from their source toward their destination through intermediate network nodes by specific packet forwarding mechanisms. Packet forwarding is the transit of network packets from one network interface to another. Intermediate nodes are typically network hardware devices such as:
+ routers, 
+ gateways, 
+ firewalls, 
+ or switches. 
General-purpose computers also forward packets and perform routing, although they have no specially optimized hardware for the task.

The routing process usually directs forwarding on the basis of routing tables. Routing tables maintain a record of the routes to various network destinations. Routing tables may be specified by an administrator, learned by observing network traffic or built with the assistance of routing protocols.

Routing, in a narrower sense of the term, often refers to IP routing and is contrasted with bridging. IP routing assumes that network addresses are structured and that similar addresses imply proximity within the network. Structured addresses allow a single routing table entry to represent the route to a group of devices. In large networks, structured addressing (routing, in the narrow sense) outperforms unstructured addressing (bridging). Routing has become the dominant form of addressing on the Internet. Bridging is still widely used within local area networks.

**路由器 网关 网卡 网桥**
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

**路由 VS NAT**
本质区别：数据包通过路由可以从一个网络到另一个网络，他是通过数据包的目的IP和源IP实现的，当一个数据包进入路由器是，路由器会根据她的目标ip和源ip在路由表中查找，并将数据包原封不动的传向路由器的某个端口。而数据包通过NAT，NAT将会根据规则将数据包中的源ip和目标IP改变，并在NAT机器上做改变记录。

简而言之，路由不改变数据包包头信息，NAT则改变;

表面区别:路由打通的两个网段地位是公平的，既都是公网或都是私网，理解起来比较简单，因为路由不改变包头信息，所以如果用路由连接公网和私网的话，目的地址为私网(192.168.1.2)的数据包在公网上找不到归宿。其实路由表里面也没有相关的路由信息。

NAT打通的可以是两个公平的网络，也可以是一个内网和一个外网。

## 路由表 routing table

计算机和路由器既有ARP表，也有路由表

windows路由表详解
https://mp.weixin.qq.com/s/Dep37CyOd0Szr_fzjQFOkA

理解Windows中的路由表和默认网关
https://developer.aliyun.com/article/447528

**Example: VPN 改变路由**
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

## Protocols
OSPF and RIP are Interior Gateway Protocols (IGP) and distribute routing information within an autonomous system, 
Therefore, both are confined to a single domain for routing (intra-domain). whereas BGP is a Exterior Gateway Protocol, primarily designed to be used to route between routing domains (inter-domain).
### BGP

### IGP
OSPF
Open Shortest Path First (OSPF) is a link-state routing protocol that was developed for IP networks and is based on the Shortest Path First (SPF) algorithm. OSPF is an Interior Gateway Protocol (IGP).

## 问题
路由环路

在维护路由表信息的时候，如果在拓扑发生改变后，网络收敛缓慢产生了不协调或者矛盾的路由选择条目，就会发生路由环路的问题，这种条件下，路由器对无法到达的网络路由不予理睬，导致用户的数据包不停在网络上循环发送，最终造成网络资源的严重浪费。


