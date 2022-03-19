---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《网络基础》

必读： <《图解TCP IP(第5版)》.((日)竹下隆史).[PDF].&ckook>

主要参考： [A beginner's guide to network troubleshooting in Linux](https://www.redhat.com/sysadmin/beginners-guide-network-troubleshooting-linux)

[Terminology guide](https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols)

[Common Port Numbers](https://www.utilizewindows.com/list-of-common-network-port-numbers/)

## 1.网络分层 TCP/IP协议组

Open Systems Interconnection model (OSI model) is a conceptual model that characterises and standardises the communication functions of a telecommunication or computing system without regard to its underlying internal structure and technology.

![网络分层](/docs/docs_image/software/network/network01.png)

网上找到这张图还不错，OSI Model和TCP/IP Model对应关系图：

![](/docs/docs_image/software/network/network_osi_model_2_tcpip_model.gif)

OSI七层是抽象的模型，而TCP/IP四层或五层是比较具体的协议；

五层模型

+ Layer 5: Application
	FTP、HTTP、HTTPS、websocket、TELNET、SMTP、DNS等协议;
+ Layer 4: Transport
	TCP协议与UDP协议
+ Layer 3: Network/Internet
	IP协议、ICMP协议、RIP，OSPF，BGP，IGMP
+ Layer 2: Data Link
	SLIP，CSLIP，PPP，ARP，RARP，MTU
+ Layer 1: Physical	
	ISO2110，IEEE802。IEEE802.2

注意：websocket是完整的应用层协议，所以不会访问raw tcp packets，但是常用的socket是可以的，因为它是基于应用层和传输层的抽象，并不是一个协议

七层模型：

+ Layer 7: Application layer(HTTP)
+ Layer 6: Presentation layer (none in this case)
+ Layer 5: Session layer (SSL/TLS)
+ Layer 4: Transport layer (TCP)
+ Layer 3: Network layer (IPv4)
+ Layer 2: Data link layer (ethernet)
+ Layer 1: Physical layer (network cable / wifi)



听了马士兵的关于TCP的讲解，还是感觉挺有收获的，大概总结下整体过程：



![网络分层](/docs/docs_image/software/network/network00_1.png)

![网络分层](/docs/docs_image/software/network/network00_2.png)



用户从应用层发起http get request，比如通过浏览器或者直接通过shell命令
```
https://www.tldp.org/LDP/abs/html/devref1.html

有一个特殊的文件/dev/tcp,打开这个文件就类似于发出了一个socket调用，建立一个socket连接，读写这个文件就相当于在这个socket连接中传输数据。
1.打开/dev/tcp
    以读写方式打开/dev/tcp，并指定服务器名为：www.baidu.com,端口号为：80,指定描述符为8
    要注意的是：/dev/tcp本身是不存在的。
exec 8<> /dev/tcp/www.baidu.com/80
2. 向文件中写入数据，向文件中随便写一些数据
echo -e "GET / HTTP/1.0\n" 1>& 8
3. 读文件
cat 0<& 8 或 cat<&8

查看
cd /proc/$$/fd
关闭
exec 8<& -
```
然后系统内核就会一层层往下打包，先打包“传输控制层”，这一层是需要通过三次握手建立连接的，
第一次握手就是发送SYN给服务器端（这里的百度），通过dns获取了百度的IP，TCP socket套接字需要用到local客户端的ip和port以及server端的ip和port，那么具体怎么发送出这第一个包呢，很多人误以为传输层就可以直接发送，其实这个层强调的是传输“控制”层，
所以还需要再下一层，网络层会根据目标ip地址，获取路由地址表（route -n），通过掩码来计算获取到走哪个网关，如果是内网就直接发送，如果是外网则走路由器网关，这就是所谓的下一跳的地址，
但是有个问题，我们是发送给百度服务器的，这里又多了一个下一跳的地址，怎么搞，链路层就是解决这个问题的，
通过arp表找到下一跳对应的mac地址，再包一层，最终通过物理层发送出去；

上面第二张图就很清楚的说明了网络层和链路层的工作过程：

网络层寻址，比如路由表：

| Destination | Gateway      | Genmask       | Iface |
| ----------- | ------------ | ------------- | ----- |
| 192.168.1.0 | 0.0.0.0      | 255.255.255.0 | eth1  |
| 0.0.0.0     | 10.20.30.254 | 0.0.0.0       | eth0  |

ping 192.168.1.111； ip是192.168.1.111，掩码是255.255.255.0，与运算结果就是192.168.1.0即网络号，111就是这个网络中的主机号111，然后路由器表中192.168.1.0对应的网关gw是0.0.0.0，意思是直接内网通过eth1网卡发送，

如果我们ping的是21.12.1.1，跟255.255.255.0运算结果是21.12.1.0，第一条不匹配，然后走到第二条，跟0.0.0.0与运算结果匹配Destination 0.0.0.0，所以走网关10.20.30.254出去；

链路层的工作过程就是，路由器接收到数据包之后，撕掉上面自己的mac地址，然后贴上下一跳比如isp路由器的mac地址（通过arp表获取），依次下去，直到到达百度服务器或者百度服务器所在局域网上的某个机器比如路由器，然后撕掉发现就是对应自己内网的ip，即可以通过上面说的主机号找到某台服务器；

下面展开说下开发常见的TCP协议，

![TCP协议](/docs/docs_image/software/network/network00_3.png)

TCP面向连接，三次握手的本质就是，双方（客户端和服务端）都需要确认自己发送的信息对方可以收到，所以精简下来就是三次握手：

第一次客户端发送syn空包给服务端，服务端收到，证明自己可以接收信息，然后返回ack以及syn，这是第二次，客户端收到就可以确认自己可以发送以及接受信息，第三次客户端发送ack，然后服务端收到就可以确认自己可以发送信息；

而socket和资源的开辟大概是这样，比如服务器端起来一个http server，端口是80，我们通过netstat -natp命令会看到有一条处于listen状态的进程，这是代表这个服务开启的主进程（通常是Daemon守护进程）；

假设此时客户端通过上面的命令或者浏览器发送http请求，通过前面解析的内核层的传输控制层三次握手建立连接，建立连接成功之后会发现服务端会spawn生成一个新的进程或线程（一般是线程，可以明确的看到其pid跟daemon的pid是相同的），状态是established，这就睡listen状态的主进程生成的worker线程，然后内核会分配资源给这个线程/进程，可以在`/proc/<pid>`下看到资源，在linux上面一切皆文件，包括这些进程线程，当然客户端也同样会开辟相应的资源，注意服务器端始终是一个端口，然后通过生成子线程来handle进来的请求，而客户端则是会用随机的端口，一个客户端耗尽所有端口最多同时可以产生65535个连接，不过需要注意的是客户端可以重用某个端口对另一个服务器B发起请求，这就是套接字socket的本质，套接字是src IP+PORT<-->dest IP+PORT，所以客户端同时通过端口比如21访问服务器A和B，tcp不会发生混乱，因为虽然sr IP+PORT相同，但是每对套接字的服务端是不同的，依然可以区分；

然后三次握手成功，资源开辟，就可以通信了，发送数据包；

结束是需要四次分手，也是因为双方都开辟了资源，所以双方不可以随意销毁资源，结束的方式是，客户端发送FIN给服务端，服务端收到后ACK，可能此时服务端还有东西要处理（假设是保存session），做完后服务端同样发起FIN，客户端ACK，所以总共是四次，

实际上在长时间无数据交互的时间段内，交互双方都有可能出现掉电、死机、异常重启等各种意外，当这些意外发生之后，这些 TCP 连接并未来得及正常释放，在软件层面上，连接的另一方并不知道对端的情况，它会一直维护这个连接，长时间的积累会导致非常多的半打开连接，造成端系统资源的消耗和浪费，为了解决这个问题，在传输层可以利用 TCP 的 KeepAlive 机制实现来实现。主流的操作系统基本都在内核里支持了这个特性（TCP协议本身并不约束使用keepalive，内核支持是允许应用层通过实现设置开启或关闭该特性，比如HTTP header keepalive或者其他的如quickfixj的socketkeepalive等）。

TCP KeepAlive 的基本原理是，隔一段时间给连接对端发送一个探测包，如果收到对方回应的 ACK，则认为连接还是存活的，在超过一定重试次数之后还是没有收到对方的回应，则丢弃该 TCP 连接。

![TCP协议](/docs/docs_image/software/network/network00_4.png)

![TCP协议](/docs/docs_image/software/network/network00_5.png)

以上过程可以通过抓包来数包：

```
curl www.baidu.com
tcpdump -nn -i eth0 port 80 or arp
```

**关于资源开辟或者资源分配：**

首先再明确下TCP连接的各种状态

```
LISTEN - 侦听来自远方TCP端口的连接请求； 
SYN-SENT -在发送连接请求后等待匹配的连接请求； 
SYN-RECEIVED - 在收到和发送一个连接请求后等待对连接请求的确认； 
ESTABLISHED- 代表一个打开的连接，数据可以传送给用户； 
FIN-WAIT-1 - 等待远程TCP的连接中断请求，或先前的连接中断请求的确认；
FIN-WAIT-2 - 从远程TCP等待连接中断请求； 
CLOSE-WAIT - 等待从本地用户发来的连接中断请求； 
CLOSING -等待远程TCP对连接中断的确认； 
LAST-ACK - 等待原来发向远程TCP的连接中断请求的确认； 
TIME-WAIT -等待足够的时间以确保远程TCP接收到连接中断请求的确认； 
CLOSED - 没有任何连接状态；
```



> 当[客户端](https://baike.baidu.com/item/客户端)和服务器在网络中使用TCP协议发起会话时，在[服务器内存](https://baike.baidu.com/item/服务器内存)中会开辟一小块[缓冲区](https://baike.baidu.com/item/缓冲区)来处理会话过程中消息的“握手”交换
>
> [https://baike.baidu.com/item/%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%8D%8F%E8%AE%AE](https://baike.baidu.com/item/三次握手协议)

所以我理解的是实际上在三次握手的过程中就会分配内存资源，这也是synflood攻击存在的原因，

然后我们也知道的是，对方第一次握手服务端处于listen状态的daemon主线程收到肯定会fork一个子线程来handle进来的新连接，状态即为SYN-RECEIVED，

比较早的layer1是采用hub技术，容易浪费带宽，比如A和B两台机器上面运行不同的服务，外面请求进来的时候，采用hub技术就要盲目广播，浪费带宽；
而采用layer2的交换机技术，由于交换机会学习mac地址（arp mapping），大大降低了广播的浪费；
而layer3进一步采用ip网段隔开不同的分区，根据外部请求的ip可以准确的找到不同的网关

![](/docs/docs_image/software/network/network16.png)
Switch:layer 2 datalink 
Router:layer 3 network(dhcp server, dns, gateway)

[The OSI model explained in simple terms](https://medium.com/@tomanagle/the-osi-model-explained-in-simple-terms-2abc3c7adadc)

DNS是域名转IP;NAT 是(外网)IP 转(内网)IP; ARP 是IP 转MAC

[40年前的协议战争，对区块链有什么启示？](https://mp.weixin.qq.com/s?__biz=MzI5Mjg1Mjk1OQ==&mid=2247483735&idx=1&sn=0f8fb9ea380c7fc6af00bd514d5927f2&chksm=ec7a44e7db0dcdf1e395793cd20c096e0b506004046f736b2501df363e52cc52d9589cd3c40e&scene=0&xtrack=1)

### 1.1 Layer 1: The physical layer 物理层
We often take the physical layer for granted ("did you make sure the cable is plugged in?"), 
but we can easily troubleshoot physical layer problems from the Linux command line. 
That is if you have console connectivity to the host, which might not be the case for some remote systems.

![physical network](/docs/docs_image/software/network/network02.png)

### 1.2 Layer 2: The data link layer 数据链路层

Layer2是交换机switch（记住arp mapping）
The data link layer is responsible for local network connectivity; essentially, the communication of frames between hosts on the same Layer 2 domain (commonly called a local area network). The most relevant Layer 2 protocol for most sysadmins is the Address Resolution Protocol (ARP), which maps Layer 3 IP addresses to Layer 2 Ethernet MAC addresses. When a host tries to contact another host on its local network (such as the default gateway), it likely has the other host’s IP address, but it doesn’t know the other host’s MAC address. ARP solves this issue and figures out the MAC address for us.
A common problem you might encounter is an ARP entry that won’t populate, particularly for your host’s default gateway. If your localhost can’t successfully resolve its gateway’s Layer 2 MAC address, then it won’t be able to send any traffic to remote networks. This problem might be caused by having the wrong IP address configured for the gateway, or it may be another issue, such as a misconfigured switch port.

![data link](/docs/docs_image/software/network/network03.png)

Linux caches the ARP entry for a period of time, so you may not be able to send traffic to your default gateway until the ARP entry for your gateway times out. For highly important systems, this result is undesirable. Luckily, you can manually delete an ARP entry, which will force a new ARP discovery process

所谓的[虚ip，ip漂移](https://xiaobaoqiu.github.io/blog/2015/04/02/xu-ni-iphe-ippiao-yi/)，就是利用了arp的高速缓存修改IP和mac地址的映射

Arpspoof https://www.youtube.com/watch?v=8SIP36Fym7U

### 1.3 Layer 3: The network/internet layer 网络层

layer3是路由器router（ip网段寻址）
Layer 3 involves working with IP addresses, which should be familiar to any sysadmin. IP addressing provides hosts with a way to reach other hosts that are outside of their local network (though we often use them on local networks as well).
The lack of an IP address can be caused by a local misconfiguration, such as an incorrect network interface config file, or it can be caused by problems with DHCP.

![network layer](/docs/docs_image/software/network/network04.png)

The most common frontline tool that most sysadmins use to troubleshoot Layer 3 is the ping utility. Ping sends an ICMP Echo Request packet to a remote host, and it expects an ICMP Echo Reply in return.
While ping can be an easy way to tell if a host is alive and responding, it is by no means definitive. Many network operators block ICMP packets as a security precaution, although many others disagree with this practice. Another common gotcha is relying on the time field as an accurate indicator of network latency. ICMP packets can be rate limited by intermediate network gear, and they shouldn’t be relied upon to provide true representations of application latency.
The next tool in the Layer 3 troubleshooting tool belt is the traceroute command. Traceroute takes advantage of the Time to Live (TTL) field in IP packets to determine the path that traffic takes to its destination. Traceroute will send out one packet at a time, beginning with a TTL of one. Since the packet expires in transit, the upstream router sends back an ICMP Time-to-Live Exceeded packet. Traceroute then increments the TTL to determine the next hop. The resulting output is a list of intermediate routers that a packet traversed on its way to the destination
Another common issue that you’ll likely run into is a lack of an upstream gateway for a particular route or a lack of a default route. When an IP packet is sent to a different network, it must be sent to a gateway for further processing. The gateway should know how to route the packet to its final destination. The list of gateways for different routes is stored in a routing table

While not a Layer 3 protocol, it’s worth mentioning DNS while we’re talking about IP addressing. Among other things, the Domain Name System (DNS) translates IP addresses into human-readable names, such as www.redhat.com. DNS problems are extremely common, and they are sometimes opaque to troubleshoot. Plenty of books and online guides have been written on DNS, but we’ll focus on the basics here.
A telltale sign of DNS trouble is the ability to connect to a remote host by IP address but not its hostname. Performing a quick nslookup on the hostname can tell us quite a bit. Taking a look at the /etc/hosts file, we can see an override that someone must have carelessly added. Host file override issues are extremely common, especially if you work with application developers who often need to make these overrides to test their code during development

**Ipv4 ipv6**

:::ffff: 用于IPv4的IPv6套接字通信。应用和套接字方面，它是IPv6，但网络和就包而言，它是IPv4。
In IPv6, you are allowed to remove leading zeros, and then remove consecutive zeros, meaning ::ffff: actually translates to 0000:0000:ffff:0000, this address has been designated as the IPv4 to IPv6 subnet prefix, so any IPv6 processor will understand it's working with an IPv4 address and handle it accordingly.

**CIDR notation**

```
IP address ranges are commonly expressed using CIDR notation, for example, 192.168.0.0/16.

IPv4 addresses consist of four 8-bit decimal values known as "octets", each separated by a dot. The value of each octet can range from 0 to 255, meaning that the lowest possible IPv4 address would be 0.0.0.0 and the highest 255.255.255.255.

In CIDR notation, the lowest IP address in the range is written explicitly, followed by another number that indicates how many bits from the start of the given address are fixed for the entire range. For example, 10.0.0.0/8 indicates that the first 8 bits are fixed (the first octet). In other words, this range includes all IP addresses from 10.0.0.0 to 10.255.255.255. 
```

**ABC类/段IP地址**

A类IP地址 
在IP地址的四段号码中，第一段号码为网络号码，剩下的三段号码为本地计算机的号码。如果用二进制表示IP地址的话，A类IP地址就由1字节的网络地址和3字节主机地址组成，网络地址的最高位必须是“0”。A类IP地址中网络的标识长度为8位，主机标识的长度为24位。
地址范围从1.0.0.1到127.255.255.254 （二进制表示为：00000001 00000000 00000000 00000001 - 01111111 11111111 11111111 11111110）。最后一个是广播地址。
子网掩码为255.0.0.0

B类IP地址
在IP地址的四段号码中，前两段号码为网络号码。如果用二进制表示IP地址的话，B类IP地址就由2字节的网络地址和2字节主机地址组成，网络地址的最高位必须是“10”。B类IP地址中网络的标识长度为16位，主机标识的长度为16位。
地址范围从128.0.0.1-191.255.255.254 （二进制表示为：10000000 00000000 00000000 00000001-10111111 11111111 11111111 11111110）。 最后一个是广播地址。
子网掩码为255.255.0.0

C类IP地址
在IP地址的四段号码中，前三段号码为网络号码，剩下的一段号码为本地计算机的号码。如果用二进制表示IP地址的话，C类IP地址就由3字节的网络地址和1字节主机地址组成，网络地址的最高位必须是“110”。C类IP地址中网络的标识长度为24位，主机标识的长度为8位。
范围从192.0.0.1-223.255.255.254 （二进制表示为: 11000000 00000000 00000000 00000001 - 11011111 11111111 11111111 11111110）。最后一个是广播地址。
子网掩码为255.255.255.0

Penetration Testing Tools Cheat Sheet https://highon.coffee/blog/penetration-testing-tools-cheat-sheet/



**Public ip vs NAT**

详细见后面 4.1 

NAT stands for Network Address Translation. In the context of our network, NAT is how one (public) IP address is turned into many (private) IP addresses. 
A public IP address is an address that is exposed to the Internet. If you search for "what's my IP" on the Internet, you'll find the public IP address your computer is using.
If you look up your computer's IP address, you'll see a different IP address: this is your device's private IP.
Chances are, if you check this on all of your devices, you'll see that all your devices are using the same public IP, but all have different private IPs. This is NAT in action. The network hardware uses NAT to route traffic going from the public IP to the private IP.

### 1.4 Layer 4: The transport layer 传输层

The transport layer consists of the TCP and UDP protocols, 
with TCP being a connection-oriented protocol and UDP being connectionless. 

TCP:
TCP achieves reliability in two ways. 
First, it orders packets by numbering them. 
Second, it error-checks by having the recipient send a response back to the sender saying that it has received the message. If the sender doesn’t get a correct response, it can resend the packets to ensure the recipient receives them correctly.
TCP三次握手，实际上是因为TCP是双向全工通信，所以彼此互相确认对方的初始序号seq（sequence number），确认的返回就是确认号ack（acknowledgement number）：

```
SYN SENT=>LISTEN	SYN=1,seq=x
SYN SENT<=SYN REVD	SYN=1,ACK=1,seq=y,ack=x+1
ESTAB=>SYN_REVD		ACK=1,seq=x+1,ack=y+1
ESTAB<=>ESTAB		开始数据传输

发送方在发送数据包（假设大小为 10 byte）时， 同时送上一个序号( 假设为 500)，那么接收方收到这个数据包以后， 就可以回复一个确认号（510 = 500 + 10） 告诉发送方 “我已经收到了你的数据包， 你可以发送下一个数据包， 序号从 510 开始”；
上面数据大小是1个字节，因为是三次握手阶段，数据包就是序号，一个字节足够
https://blog.csdn.net/lengxiao1993/article/details/82771768
```
UDP:
The sender doesn’t wait to make sure the recipient received the packet—it just continues sending the next packets. If the recipient misses a few UDP packets here and there, they are just lost—the sender won’t resend them. 
UDP is used when speed is desirable and error correction isn’t necessary. For example, UDP is frequently used for live broadcasts and online games.

Applications listen on sockets, which consist of an IP address and a port. 
Traffic destined to an IP address on a specific port will be directed to the listening application by the kernel. 
1.  localhost
The result can be useful if you can’t connect to a particular service on the machine, such as a web or SSH server. Another common issue occurs when a daemon or service won’t start because of something else listening on a port. The ss command is invaluable for performing these types of actions:

![transport layer](/docs/docs_image/software/network/network05.png)

2. Remote
TCP: telnet
UDP: netstat: nc 192.168.122.1 -u 80
The netcat utility can be used for many other things, including testing TCP connectivity. Note that netcat may not be installed on your system, and it’s often considered a security risk to leave lying around. You may want to consider uninstalling it when you’re done troubleshooting.
The examples above discussed common, simple utilities. However, a much more powerful tool is nmap,some of the things that it’s capable of doing:
●	TCP and UDP port scanning remote machines.
●	OS fingerprinting.
●	Determining if remote ports are closed or simply filtered.

### 1.5 Layer 5: Application Layer 应用层

对应了七层的上面三层：

+ Layer 7: Application layer(HTTP)
+ Layer 6: Presentation layer (none in this case)
+ Layer 5: Session layer (SSL)

HTTP协议是建立在请求/响应模型上的,
首先由客户建立一条与服务器的TCP链接，并发送一个请求到服务器，请求中包含请求方法、URI、协议版本以及相关的MIME样式的消息;
服务器响应一个状态行，包含消息的协议版本、一个成功和失败码以及相关的MIME式样的消息。

HTTP/1.0为每一次HTTP的请求/响应建立一条新的TCP链接，因此一个包含HTML内容和图片的页面将需要建立多次的短期的TCP链接。一次TCP链接的建立将需要3次握手。
另外，为了获得适当的传输速度，则需要TCP花费额外的回路链接时间（RTT）,每一次链接的建立需要这种经常性的开销，而其并不带有实际有用的数据，只是保证链接的可靠性，
因此HTTP/1.1提出了可持续链接的实现方法-默认启用Keep-Alive。HTTP/1.1将只建立一次TCP的链接而重复地使用它传输一系列的请求/响应 消息，因此减少了链接建立的次数和经常性的链接开销。
当然HTTP服务器端底层应该对tcp有超时设置，不然http client端如果不释放连接，有可能消耗掉TCP最大连接数，见后面的“一次排查send-q”；

ASN即自治系统号(AutonomousSystemNumber) 也是应用层的概念：

http://ip.yqie.com/tips/f94e7b8826754ce0a9fbe7c8a94f8b97.htm

https://www.obj-sys.com/asn1tutorial/node1.html



## 2.Packet Sniffer

[更多抓包方法](/docs/coder2hacker/ch2_web)

A packet sniffer is simply a piece of software that allows you to capture packets on your network. Tcpdump and Wireshark are examples of packet sniffers. Tcpdump provides a CLI packet sniffer, and Wireshark provides a feature-rich GUI for sniffing and analyzing packets.
By default, tcpdump operates in promiscuous mode. This simply means that all packets reaching a host will be sent to tcpdump for inspection. This setting even includes traffic that was not destined for the specific host that you are capturing on, such as broadcast and multicast traffic. Of course, tcpdump isn’t some magical piece of software: It can only capture those packets that somehow reach one of the physical interfaces on your machine.

Looking at the above captures provides us with basic information about the packets traversing our network. It looks like these packets contain Spanning Tree Protocol (STP) output, perhaps from an upstream switch. Technically, these aren’t packets, they’re layer two frames. However, you’ll hear the terms used interchangeably when discussing packet captures.
Knowing how to adjust the verbosity of your capture is important, as it allows you to dig deeper into the actual data contained within the packets.
The verbosity level of tcpdump is controlled by appending between one and three -v flags to the command:

![tcpdump](/docs/docs_image/software/network/network06.png)

處于LISTEN狀態的socket:
    Recv-Q表示了current listen backlog隊列元素數目(等待用戶調用accept的完成3次握手的socket)
    Send-Q表示了listen socket最大能容納的backlog.這個數目由listen時指定,且不能大於 /proc/sys/net/ipv4/tcp_max_syn_backlog;
    
對於非LISTEN socket:
    Recv-Q表示了receive queue中的位元組數目(等待接收的下一個tcp段的序號-尚未從內核空間copy到用戶空間的段最前面的一個序號)
    Send-Q表示發送queue中容納的位元組數(已加入發送隊列中最後一個序號-輸出段中最早一個未確認的序號)
	
More
https://blog.cloudflare.com/this-is-strictly-a-violation-of-the-tcp-specification/
https://102.alibaba.com/detail?id=140
http://netkiller.sourceforge.net/linux/system/network/ch14s02.html
https://www.jianshu.com/p/30b861cac826

netstat属于net-tools工具集,ss属于iproute工具集

ss比netstat快的主要原因是，netstat是遍历/proc下面每个PID目录，ss直接读/proc/net下面的统计信息。所以ss执行的时候消耗资源以及消耗的时间都比netstat少很多。
当服务器的socket连接数量非常大时（如上万个），无论是使用netstat命令还是直接cat /proc/net/tcp执行速度都会很慢，相比之下ss可以节省很多时间。ss快的秘诀在于，它利用了TCP协议栈中tcp_diag，这是一个用于分析统计的模块，可以获得Linux内核中的第一手信息。如果系统中没有tcp_diag，ss也可以正常运行，只是效率会变得稍微慢但仍然比netstat要快。

在服务器产生大量sockets连接时，我们会使用这个命令在做宏观统计
ss -s
查看所有打开的网络端口
ss -pl
查看这台服务器上所有的socket连接
TCP sockets -ta
UDP sockets -ua
RAW sockets -wa
UNIX sockets -xa

实时流量监听：
nethogs -v 2

## 3.实战问题

### 3.1 wireshark
配置如下

![nginx](/docs/docs_image/software/network/network07.png)

本地浏览器通过前端访问位于另一个vpn网段的server10.***.48的/wescoket，
然后nginx会forward到9090端口，首先我直接从server上抓(转发的)包
sudo tcpdump -c 1 -X port 9090
没有抓到，因为默认是抓取eth0，而这个是nginx通过本地lo转发，所以需要指定-i lo或者-i any
最终实时监控命令
```
sudo sh -c 'tcpdump -i any -X port 9090 -l | tee dat'
sudo sh -c 'tcpdump -i any -X host 192.168.207.4 -l | tee dat'
```

![packet](/docs/docs_image/software/network/network08.png)

这里看不懂这些ASCII‘乱码’,尝试用在线工具http://packetor.com/，https://hpd.gasmi.net/ 解析失败
所以想到直接在前端用wireshark抓包，interfaces这里显示了很多ipconfig下面没有的名字，然后试了半天，才知道内网走的是这个Local Area Connection*12

![wireshark](/docs/docs_image/software/network/network09.png)

可以看到还有SSH的请求干扰视线，所以果断关掉（其实也可以加过滤条件比如tcp.port!=22），但是发现黑色背景的tcp不断的出现，然后关掉网站，居然还在，决定根据端口查一下
netstat -aon | find /i "53072"
tasklist /fi "pid eq 81304"
居然是chrome，关掉chrome就完全停掉了

进一步看下http请求，看到左侧的箭头表示request和response，然后中间的两个点表示相关联的（https://www.wireshark.org/docs/wsug_html_chunked/ChUsePacketListPaneSection.html
），应该是http底层依赖的tcp请求，然后后面的TCP Keep Alive基本就是与之想的，应该是http header里面的keep alive起作用
https://www.imperva.com/learn/performance/http-keep-alive/

使用wireshark还有个要注意的是，比如 http.host contains lyhistory.github.io
因为我的域名是解析到github page  所以host不是我自己的lyhistory.com了

### 3.2 一次排查send-q

![send-q](/docs/docs_image/software/network/network10.png)

可以看到有 50 100 128
根据网上资料，排查系统参数

![tcp backlog](/docs/docs_image/software/network/network11.png)

可以看到128是因为这里的设置限制
然后 google了下50，看到

![server socket](/docs/docs_image/software/network/network12.png)

但是实际上我根据cat /proc/<PID>/cmdline查到实际上这个程序是quickfix server，然后查了下是用的
NioSocketAcceptor
https://mina.apache.org/mina-project/gen-docs/2.1.2/apidocs/org/apache/mina/transport/socket/SocketAcceptor.html

虽然这里没有写默认是多少，大概可以先猜测一下，java应该都是统一的默认50；
所以我在quickfix java提了个proposal https://github.com/quickfix-j/quickfixj/issues/248
同样的
```cat /proc/<PID>/cmdline```
查到了100的对应程序之一是我们的一个继承了spring-boot-starter-web程序，然后搜了下貌似tomcat默认就是100，所以查了下dependency，
这里确实是spring-boot-starter-web依赖于tomcat；
然后想到既然都是java程序受各种限制，比如socket默认的50以及tomcat默认的100，那么128又是怎么来的，搜了下，果然，比如websocket，这里是用了netty，然后有自定义的config

![backlog](/docs/docs_image/software/network/network13.png)

然后再查到其他的一些程序，比如kafka和zookeeper默认50
然后可以看到显示出来的redis-server和nginx都是128

再后来遇到另外一个问题：
[the ESTAB tcp connection remains even after closed initiator](https://github.com/quickfix-j/quickfixj/issues/269)
![server socket](/docs/docs_image/software/network/network15.png)
我配错了heartbeat，然后导致了一个神奇的现象，客户端连接服务端，由于他这个协议里面是客户端主动发起heartbeat，所以我配错了之后，即使客户端断掉(连接之后过二十分钟再断)，服务端就认为连接一直在，
所以会一直保持这个ESTABLISHED连接，除非重启服务端，然后因为quickfix不允许同一个配置的initiator多次连接，所以再连接都变成了TIME_WAIT;

参考：记一次惊心的网站TCP队列问题排查经历https://zhuanlan.zhihu.com/p/36731397
https://juejin.im/post/5d8488256fb9a06b065cad98
https://cloud.tencent.com/developer/article/1143712

### 3.3 死亡ping



```
ping -l 65500 目标ip -t （65500 表示数据长度上限，-t 表示不停地ping目标地址） 这就是简单的拒绝服务攻击。
```

> 首先是因为以太网长度有限，IP包片段被分片。当一个IP包的长度超过以太网帧的最大尺寸（以太网头部和尾部除外）时，包就会被分片，作为多个帧来发送。接收端的机器提取各个分片，并重组为一个完整的IP包。在正常情况下，IP头包含整个IP包的长度。当一个IP包被分片以后，头只包含各个分片的长度。分片并不包含整个IP包的长度信息，因此IP包一旦被分片，重组后的整个IP包的总长度只有在所在分片都接受完毕之后才能确定。
>     在IP协议规范中规定了一个IP包的最大尺寸，而大多数的包处理程序又假设包的长度超过这个最大尺寸这种情况是不会出现的。因此，包的重组代码所分配的内存区域也最大不超过这个最大尺寸。这样，超大的包一旦出现，包当中的额外数据就会被写入其他正常区域。这很容易导致系统进入非稳定状态，是一种典型的缓存溢出（Buffer Overflow）攻击。在防火墙一级对这种攻击进行检测是相当难的，因为每个分片包看起来都很正常。
>     由于使用ping工具很容易完成这种攻击，以至于它也成了这种攻击的首选武器，这也是这种攻击名字的由来。当然，还有很多程序都可以做到这一点，因此仅仅阻塞ping的使用并不能完全解决这个漏洞。预防死亡之ping的最好方法是对操作系统打补丁，使内核将不再对超过规定长度的包进行重组。
>
> https://zixuephp.net/article-99.html

### 3.4 大量TIME_WAIT状态的TCP 连接

https://mp.weixin.qq.com/s/t1ZUXvAUKlIt5UtiZFh1VQ

这个跟前面开篇介绍的TCP三次握手和端口有关，

在高并发的场景中，会出现批量的 `TIME_WAIT` 的 TCP 连接，短时间后，所有的 `TIME_WAIT` 全都消失，被回收，端口包括服务，均正常。即，在高并发的场景下，`TIME_WAIT` 连接存在，属于正常现象。

如果是持续的高并发场景：

- 一部分 `TIME_WAIT` 连接被回收，但新的 `TIME_WAIT` 连接产生；
- 一些极端情况下，会出现**大量**的 `TIME_WAIT` 连接。

这个对业务有何影响，如果服务器上是用nginx作为反向代理，意思是，客户端是请求到nginx，然后nginx再作为客户端请求到具体的程序或后台服务，比如java spring mvc程序，websocket等，get post请求mvc程序执行速度比较快，所以不好观察，除非是想办法模拟高并发，我觉着用websocket举例更容易，可以看到

```
[vm2-devclr-v08@SG/opt/haproxy-2.2.1]$netstat -anp|grep :80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      3945/nginx: master
tcp        0      0 x.x.x.48:80        10.30.30.94:25748       ESTABLISHED 15394/nginx: worker
tcp        0      0 127.0.0.1:80            127.0.0.1:10693         ESTABLISHED 15394/nginx: worker
tcp        0      0 127.0.0.1:10693         127.0.0.1:80            ESTABLISHED 25613/haproxy

这个10693的端口是做什么的先不用管，是我测试的haproxy；
我们主要看这个10.30.30.94:25748是客户端的连接，访问x.x.x.48:80，即nginx的监听的80端口，然后nginx立马会转发产生跟本地的websocket服务器也就是x.x.x.48:19090的连接，所以会占用一个nginx的端口，比如13576，下面可以看到，这里有两个连接，占用了两个nginx的端口13576和18973，因为是双向连接，所以还有反过来的连接

[vm2-devclr-v08@SG/opt/haproxy-2.2.1]$netstat -anp|grep :19090
tcp        0      0 0.0.0.0:19090           0.0.0.0:*               LISTEN      3136/java
tcp        0      0 x.x.x.48:13576     x.x.x.48:19090     ESTABLISHED 15394/nginx: worker
tcp        0      0 x.x.x.48:19090     x.x.x.48:13576     ESTABLISHED 3136/java
tcp        0      0 x.x.x.48:18973     x.x.x.48:19090     ESTABLISHED 15394/nginx: worker
tcp        0      0 x.x.x.48:19090     x.x.x.48:18973     ESTABLISHED 3136/java
```

所以Nginx 作为反向代理时，大量的短链接，可能导致 Nginx 上的 TCP 连接处于 `time_wait` 状态：

- 每一个 time_wait 状态，都会占用一个「本地端口」，上限为 `65535`(16 bit，2 Byte)；
- 当大量的连接处于 `time_wait` 时，新建立 TCP 连接会出错，**address already in use : connect** 异常

统计：各种连接的数量

`netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'`

TCP 本地端口数量，上限为 `65535`（6.5w），这是因为 TCP 头部使用 `16 bit`，存储「**端口号**」，因此约束上限为 `65535`。

大量的 `TIME_WAIT` 状态 TCP 连接存在，其本质原因是什么？

- 大量的**短连接**存在
- 特别是 HTTP 请求中，如果 `connection` 头部取值被设置为 `close` 时，基本都由「**服务端**」发起**主动关闭连接**
- 而，`TCP 四次挥手`关闭连接机制中，为了保证 `ACK 重发`和`丢弃延迟数据`，设置 `time_wait` 为 2 倍的 `MSL`（报文最大存活时间）

TIME_WAIT 状态：

- TCP 连接中，**主动关闭连接**的一方出现的状态；（收到 FIN 命令，进入 TIME_WAIT 状态，并返回 ACK 命令）
- 保持 2 个 `MSL` 时间，即，`4 分钟`；（MSL 为 2 分钟）

解决上述 `time_wait` 状态大量存在，导致新连接创建失败的问题，一般解决办法：

1、**客户端**，HTTP 请求的头部，connection 设置为 keep-alive，保持存活一段时间：现在的浏览器，一般都这么进行了 2、**服务器端**，

- 允许 `time_wait` 状态的 socket 被**重用**
- 缩减 `time_wait` 时间，设置为 `1 MSL`（即，2 mins）

更多细节，参考：

- https://www.cnblogs.com/yjf512/p/5327886.html

几个核心要点

1、 **time_wait 状态的影响**：

- TCP 连接中，「主动发起关闭连接」的一端，会进入 time_wait 状态
- time_wait 状态，默认会持续 `2 MSL`（报文的最大生存时间），一般是 2x2 mins
- time_wait 状态下，TCP 连接占用的端口，无法被再次使用
- TCP 端口数量，上限是 6.5w（`65535`，16 bit）
- 大量 time_wait 状态存在，会导致新建 TCP 连接会出错，**address already in use : connect** 异常

2、 **现实场景**：

- 服务器端，一般设置：**不允许**「主动关闭连接」
- 但 HTTP 请求中，http 头部 connection 参数，可能设置为 close，则，服务端处理完请求会主动关闭 TCP 连接
- 现在浏览器中， HTTP 请求 `connection` 参数，一般都设置为 `keep-alive`
- Nginx 反向代理场景中，可能出现大量短链接，服务器端，可能存在

3、 **解决办法：服务器端**，

- 允许 `time_wait` 状态的 socket 被重用
- 缩减 `time_wait` 时间，设置为 `1 MSL`（即，2 mins）



## 4. 协议详解

### 4.1 网络层的协议测试工具

1) **ICMP协议**：ping，tracert

如果是使用ipv6，加 -6

```
C:\WINDOWS\system32>tracert 101.OO.XX.39

Tracing route to 101.32.168.39 over a maximum of 30 hops

  1    69 ms    70 ms    69 ms  172.OO.XX.11
............................
 11   102 ms    91 ms    83 ms  203.208.152.81
 12   188 ms   175 ms   155 ms  203.208.169.54
 13     *        *        *     Request timed out.
 14     *        *        *     Request timed out.
 15     *        *        *     Request timed out.
 16     *        *        *     Request timed out.
 17   543 ms   164 ms   167 ms  101.OO.XX.39
 
 解释：
 1. asterisks：
 The asterisks indicate that the target server did not respond as traceroute expected before a timeout occurred - this does not always indicate packet loss. If you suspect packet loss because of asterisks in the output or because the server you are running a traceroute to is not reached, you can attempt to ping the server where problems have started occur 不过本例中，没有显示出对应ip，不过可以通过ping 最后的101可以确定是通的
 
 2. Request timed out: This is because the server at hop four is not accepting Internet Control Message Protocol (ICMP) traffic. As a result it ignores Traceroutes request for information. As you can see, however, it has still sent the data to the next hop as there are results that follow.

查询ip arin：
https://mxtoolbox.com/SuperTool.aspx?action=ptr%3a203.208.169.54&run=toolpage
```



2) **网络层NAT“协议”** VS 应用层代理服务器

为什么需要NAT技术？

首先NAT违反了基本的网络分层结构模型的设计原则。因为在传统的网络分层结构模型中，第N层是不能修改第N+1层的报头内容的。NAT破坏了这种各层独立的原则，NAT不算是真正的TCP/IP协议，而是一种工作在网络层和传输层的技术。

要真正了解NAT就必须先了解现在IP地址的使用情况，私有 IP 地址是指内部网络或[主机](https://baike.baidu.com/item/主机)的IP 地址，公有IP 地址是指在因特网上全球唯一的IP 地址。RFC 1918 为私有网络预留出了三个IP 地址块（不会在因特网上被分配，因此可以不必向ISP 或注册中心申请而在公司或企业内部自由使用）：

A 类：10.0.0.0～10.255.255.255

B 类：172.16.0.0～172.31.255.255

C 类：192.168.0.0～192.168.255.255

IPV4地址只有32位，随着接入Internet的计算机数量的不断猛增，IP地址资源也就愈加显得捉襟见肘，1994年提出NAT（Network Address Translation，网络地址转换）技术；

虽然NAT可以借助于某些[代理服务器](https://baike.baidu.com/item/代理服务器)来实现，但考虑到运算成本和网络性能，很多时候都是在[路由器](https://baike.baidu.com/item/路由器)上来实现的，这种方法需要在专用网（私网IP）连接到因特网（公网IP）的路由器上安装NAT软件。装有NAT软件的路由器叫做NAT路由器，它至少有一个有效的外部全球IP地址（公网IP地址）。这样，所有使用本地地址（私网IP地址）的主机在和外界通信时，都要在NAT路由器上将其本地地址转换成全球IP地址，才能和因特网连接。

NAT技术实现：

1）基本IP地址替换

![](/docs/docs_image/software/network/network_nat01.png)

- NAT路由器将源地址从10.0.0.10替换成全局的IP 202.244.174.37
- NAT路由器收到外部的数据时, 又会把目标IP从202.244.174.37替换回10.0.0.10
- 在NAT路由器内部, 有一张自动生成的用于`地址转换的表`
- 当 `10.0.0.10`第一次向`163.221.120.9` 发送数据时就会生成表中的映射关系

2）NAPT技术

如果局域网内, 有多个主机都访问同一个`外网服务器`， 那么对于服务器返回的数据中, 目的`IP`都是相同的。 那么`NAT`路由器如何判定将这个数据包转发给哪个局域网的主机? NAPT技术使用IP+Port来解决这个问题。

![](/docs/docs_image/software/network/network_nat02.png)

在使用`TCP`或`UDP`的通信当中，只有`目标地址、源地址、目标端口、源端口`以及协议类型（TCP还是UDP）五项内容都一致时才被认为是同一个通信连接。此时所使用的正是`NAPT`。

这种转换表在`NAT`路由器上自动生成。例如，在TCP情况下，建立TCP连接首次握手时的SYN包一经发出，就会生成这个表。而后又随着收到关闭连接时发出`FIN`包的确认应答从表中被删除。

3）NAT-PT（NAPT-PT）

现在很多互联网服务都基于IPv4。如果这些服务不能做到IPv6中也能正常使用的话，搭建IPv6网络环境的有时也就无从谈起。 为此，就产生了`NAT-PT（NAPT-PT）`规范，PT是Protocol Translation的缩写。**NAT-PT是将IPv6的首部转换为IPv4的首部的一种技术。有了这种技术，那些只有IPv6地址的主机也就能够与IPv4地址的其他主机进行通信了。**

![](/docs/docs_image/software/network/network_nat03.png)



代理服务器看起来和`NAT`设备有一点像， 客户端像代理服务器发送请求, 代理服务器将请求转发给真正要请求的`服务器`，服务器返回结果后代理服务器又把结果回传给客户端。

NAT技术无法从外部网络向内网建立连接，所以如果外网要访问内网中某台机器，需要在路由器上设置 port forward端口转发，或者利用代理服务器，明白了NAT的这个“缺点”就也会明白了为啥vm的NAT模式时如果host需要访问vm也是需要设置端口转发，这是同样的道理。

**NAT和代理服务器的区别：**

- NAT设备是网络基础设备之一，解决的是`IP`不足的问题，而代理服务器则是更贴近具体应用, 比如通过`代理服务器`进行翻墙，另外像迅游这样的加速器, 也是使用`代理服务器`。
- NAT是工作在`网络层`直接对IP地址进行替换。代理服务器往往工作在`应用层`。
- `NAT`一般在局域网的出口部署，代理服务器可以在局域网做也可以在广域网做也可以跨网。
- NAT一般集成在`防火墙`，路由器等硬件设备上。代理服务器则是一个`软件程序`, 需要部署在服务器上。

三层转发基本原理 https://blog.csdn.net/baidu_24553027/article/details/54928580
NAT地址转换 https://blog.csdn.net/hjgblog/article/details/23356409

### 4.2 传输层的协议测试工具

参见《/doc/software/network/vpn》
注意ping和trcert都是走ICMP协议，并不是tcp协议，如果想追踪tcp需要用：
tcproute TCPTraceroute 

tcproute安装使用：
	工具tcproute：
	https://www.elifulkerson.com/projects/tcproute.php
	win10需要安装qin10pcap
	http://www.win10pcap.org/download/
	tcproute -p 443 github.io 

```
https://serverfault.com/questions/199434/how-do-i-make-curl-use-keepalive-from-the-command-line

$ while :;do echo -e "GET / HTTP/1.1\nhost: $YOUR_VIRTUAL_HOSTNAME\n\n";sleep 1;done|telnet $YOUR_SERVERS_IP 80
```

### 4.3 应用层之“协议”
应用层的协议有FTP、HTTP、websocket、TELNET、SMTP、DHCP、DNS等协议：

#### **DHCP协议**
​	DHCP服务一般位于路由器（家用）或者服务器（公司用），内网中电脑上的dhcp client发出请求，
​	dhcp服务端返回分配ip地址、网关gateway、掩码及dns服务器地址；
​	[how dhcp works](https://www.youtube.com/watch?v=S43CFcpOZSI)
​	当我们配置静态IP或者一些内网渗透的测试环境时，需要[网络配置的四大基本要素： IP + Netmask + Gateway + DNS](https://blog.csdn.net/yuanbinquan/article/details/52963845)

​	参考私人笔记《hacker_theory/tools_metasploit》以及类似的vm实验环境配置；

#### **DNS协议 **
​	DNS测试工具windows:nslookup, linux: dig 

​	https://blog.csdn.net/hansionz/article/details/86570290

![](/docs/docs_image/software/network/network17.png)
Gateway: internal send packets to gateway
Dns: resolve hostname
https://superuser.com/questions/77914/whats-the-difference-between-default-gateway-and-preferred-dns-server

> 好了，既然 DNS 系统使用的是网路的查询，那么自然需要有监听的 port 啰！没错！很合理！那么 DNS 使用的是那一个 port 呢？那就是 53 这个 port 啦！你可以到你的 Linux 底下的 /etc/services 这个档案看看！搜寻一下 domain 这个关键字，就可以查到 53 这个 port 啦！
>
> 但是这里需要跟大家报告的是，通常DNS 查询的时候，是以udp 这个较快速的资料传输协定来查询的， 但是万一没有办法查询到完整的资讯时，就会再次的以tcp 这个协定来重新查询的！所以启动 DNS 的 daemon (就是 named 啦) 时，会同时启动 tcp 及 udp 的 port 53 喔！所以，记得防火墙也要同时放行 tcp, udp port 53 呢！
>
> http://linux.vbird.org/linux_server/0350dns.php

DNS防火墙： https://developer.aliyun.com/article/766501

#### Socket '协议'

前面也提到websocket是完整的应用层协议，所以不会访问raw tcp packets，但是常用的socket是可以的，因为它是基于应用层和传输层的抽象，并不是一个协议；

在《nio_epoll》中提到了ServerSocket，用来跟客户端建立连接，实际上socket也常常作为进程间通信的“协议”，有个特殊情况是，如果是本机进程间通信，有个特别的所谓socket Unix域套接字（Unix Domain Socket）https://blog.csdn.net/roland_sun/article/details/50266565，例子gitlab server、haproxy

#### HTTP协议和 RPC'协议'

HTTP则长作为一种general purpose的协议通常是用于客户端和服务端之间的通信，尤其是通过公网的通信，当然也可以用于组件之间或者系统内部之间的通信；
但是有些情况下，HTTP是不够的：首先HTTP是应用层，对于系统内部的调用尤其是分布式系统之间调用来说性能比较低，此时就引入了基于传输层TCP的架构--RPC(基于传输层,所以本身在会话层)；

RPC即远程过程调用，再加上proxy代理模式就可以让远程调用像本地调用一样，
这样讲起来rpc是基于TCP的，偏偏有个rpc over http，目的就是internet用户也可以通过http来进行远程过程调用RPC,比如[Using HTTP as an RPC Transport](https://docs.microsoft.com/en-us/windows/win32/rpc/using-http-as-an-rpc-transport),
一个完整的RPC架构里面包含了四个核心的组件，分别是Client ,Server,Client Stub以及Server Stub，
RPC框架众多，比如netty:

> Nowadays we use general purpose applications or libraries to communicate with each other. For example, we often use an HTTP client library to retrieve information from a web server and to invoke a remote procedure call via web services. However, a general purpose protocol or its implementation sometimes does not scale very well. It is like how we don't use a general purpose HTTP server to exchange huge files, e-mail messages, and near-realtime messages such as financial information and multiplayer game data. What's required is a highly optimized protocol implementation that is dedicated to a special purpose. For example, you might want to implement an HTTP server that is optimized for AJAX-based chat application, media streaming, or large file transfer. You could even want to design and implement a whole new protocol that is precisely tailored to your need. Another inevitable case is when you have to deal with a legacy proprietary protocol to ensure the interoperability with an old system. What matters in this case is how quickly we can implement that protocol while not sacrificing the stability and performance of the resulting application.
> https://netty.io/wiki/user-guide-for-4.x.html

要了解这些框架的原理首先要搞明白TCP本身的原理，最重要的一个问题是：
**TCP面向字节流，UDP面向报文段，TCP的报文段呢？**

> 问题的关键在于TCP是有缓冲区，作为对比，UDP面向报文段是没有缓冲区的。
> TCP发送报文时，是将应用层数据写入TCP缓冲区中，然后由TCP协议来控制发送这里面的数据，而发送的状态是按字节流的方式发送的，跟应用层写下来的报文长度没有任何关系，所以说是流。
> 作为对比的UDP，它没有缓冲区，应用层写的报文数据会直接加包头交给网络层，由网络层负责分片，所以是面向报文段的。
> https://www.zhihu.com/question/34003599/answer/204379413

所以说TCP本质是一个面向字节流的协议，本质是流式的，如同水流，没有分段，无法得知何时开始结束，
而TCP提供了可靠的流控方式：[滑动窗口sliding window](https://www.youtube.com/watch?v=klDhO9N01c4)，简单来说这个滑动窗口跟收发两端的缓存有关，可以控制“流速”；

由于这个滑动窗口的存在，跟发送端和接收端的收发节奏和表现出来的现象形象分为“拆包和粘包”问题：

首先包(Packet)的定义：在包交换网络里，单个消息被划分为多个数据块，这些数据块称为包，它包含发送者和接收者的地址信息。这些包然后沿着不同的路径在一个或多个网络中传输，并且在目的地重新组合。

打个比方，发送端先后发送两个信息 hello和world，接收端正常是期待同样先后收到hello和world，
但是因为tcp流，假设滑动窗口是1024字节，接收端可能会一次收到 helloworld连起来，这叫做“粘包”，
假设滑动窗口很小4个字节，接收端则会收到类似 hell o worl d 这种所谓“拆包”或者 hell owor ld 这种拆包+粘包；

粘包问题的处理一般是加“分隔符”来标志一个包packet结束；
拆包问题则是一般加上长度length字段，让接收方知道这个包的长度，比如10M，接收端可以把这些拆的包合并起来；

#### HTTPS

https通信是http建立在tls上，最新的tls1.3(SSL is deprecated predecessor of TLS)，TLS typically relies on a set of trusted third-party certificate authorities to establish the authenticity of certificates. 也就是CA

TLS握手发生在TCP握手结束之后，具体参考《publickey_infrastructure.md/[#](https://lyhistory.com/docs/software/highlevel/publickeyinfrastructure.html#_3-1-ssl-tls)3.1 SSL/TLS》

### 4.3 应用层之proxy代理服务器

前面说过NAT技术和代理服务器技术的区别，现在具体说下代理服务器

代理服务器的作用：

- VPN: 广域网中的代理。
- 负载均衡: 局域网中的代理。
- 端口转发: http/ssh tunnel 隧道技术

**正向代理/反向代理/端口转发:**

其实端口转发根据方向可以分为正向和反向代理

首先要了解两种代理模式：**forward proxy（正向代理），reverse proxy（反向代理）：**
正向代理，位于客户端，隐藏客户端信息，forward proxy proxies in behalf of clients (or requesting hosts)
例子：vpn技术基本都是正向代理，隐藏客户端信息
反向代理，位于服务器端，隐藏目标机器或服务信息，主要用于load balance等, a reverse proxy proxies in behalf of servers，另外很多WAF也是反向代理，隐藏服务器的真实ip，比如cloudflare可以防护对服务器真实IP的高频请求；
例子：nginx或者tomcat作为Oracle数据库的反向代理，再比如nginx作为监控UIgrafana的反向代理：Grafana-server runs its own service and hosts dashboard on 3000, if bind to domain, to the normal use access domain, default using 80, need a proxy server who use 80 to forward request to grafana-server for example nginx
https://www.jscape.com/blog/bid/87783/Forward-Proxy-vs-Reverse-Proxy

而**端口转发（Port forwarding）：**

由于NAT的缺点，从外网发起访问内网的主机是不行的，为了解决这个问题，可以在NAT路由器上做端口转发设置，除此之外，还可以借助代理服务器解决这个问题，比如借助ssh的正向反向或动态代理功能

> 是安全壳(SSH) 为网络安全通信使用的一种方法。SSH可以利用端口转发技术来传输其他TCP/IP协议的报文，当使用这种方式时，SSH就为其他服务在客户端和服务器端建立了一条安全的传输管道。端口转发利用本客户机端口映射到服务器端口来工作，SSH可以映射所有的服务器端口到本地端口，但要设置1024以下的端口需要根用户权限。在使用防火墙的网络中，如果设置为允许SSH服务通过(开启了22端口)，而阻断了其他服务，则被阻断的服务仍然可以通过端口转发技术转发数据包
> https://baike.baidu.com/item/%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91

所以这种端口转发方式中ssh就充当了代理服务器的角色

一般渗透测试中会利用代理模式（正向或者反向）加上端口转发来“绕过”防火墙对目标机器上端口的限制

例子：

https://medium.com/@ryanwendel/forwarding-reverse-shells-through-a-jump-box-using-ssh-7111f1d55e3a

https://www.offensive-security.com/metasploit-unleashed/portfwd/

#### 4.3.1 ICMP Tunnel

Ping Power — ICMP Tunnel https://infosecwriteups.com/ping-power-icmp-tunnel-31e2abb2aaea

#### 4.3.2 http tunnel

定义：
> HTTP tunneling is used to create a network link between two computers in conditions of restricted network connectivity including firewalls, NATs and ACLs, among other restrictions. The tunnel is created by an intermediary called a proxy server which is usually located in a DMZ.
> https://en.wikipedia.org/wiki/HTTP_tunnel

系统一般分为DMZ和核心区，位于DMZ的服务器A面向外网，位于核心区的B不可以通过外网直接访问，只能通过A进行流量转发；

http tunnel 一般都是采用 http connect 通过proxy server跟目标server之间建立双向连接
https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
> This mechanism is how a client behind an HTTP proxy can access websites using SSL or TLS (i.e. HTTPS). 
> Proxy servers may also limit connections by only allowing connections to the default HTTPS port 443, whitelisting hosts, or blocking traffic which doesn't appear to be SSL.
> https://en.wikipedia.org/wiki/HTTP_tunnel

[HTTP Tunnel使用的几种使用（经典）](https://blog.csdn.net/zhangxinrun/article/details/5942260)
[http tunnel和入侵检测的理解](https://blog.csdn.net/gx11251143/article/details/104518461)

#### 4.3.3 tcp tunnel

跟http tunnel利用http connect，还需要一个proxy server来建立双向通道并做流量转发的操作；
tcp tunnel一般不需要通过一个proxy server，而是借助安装在本地或者远程的软件来做“端口转发”，比如利用ssh将两台电脑的端口进行映射；

** ssh tunnel**

https://zhuanlan.zhihu.com/p/57630633

一般又被直接叫做port forwarding端口转发
forward local port to remote port, 比如在公司连接家里的远程桌面，但是公司的3389端口被屏蔽，可以走ssh转发
ssh -L <LOCAL PORT>:<REMOTE IP>:<REMOTE PORT> <USERNAME>@<REMOTE IP>

dynamic tunnel:
ssh -D <LOCAL PORT> <USERNAME>@<REMOTE IP>

reverse tunnel,比如在公司电脑上执行下面语句，然后回到家可以连接公司电脑
ssh -R <REMOTE PORT>:localhost:<LOCAL PORT> <USERNAME>@<REMOTE IP>
免费host网站
ssh -R 80:localhost:3000 serveo.net 

[例子来源](https://www.youtube.com/watch?v=AtuAdk4MwWw)

** ssh tunnel control **
SSH tunneling is a powerful tool, but it can also be abused. 
Controlling tunneling is particularly important when moving services to Amazon AWS or other cloud computing services.

ssh连接由强加密来保护,这对于流量监控和过滤系统是有效的，因为traffic是不可解读的.但是这种不可见也存在着很大的风险，比如数据泄露。恶意软件可以利用ssh来隐藏未授权通信，或者从目标网络中漏出偷窃的数据.

在一个ssh back-tunneling攻击中，攻击者在目标网络(比如AWS)以外建立一个server,一旦攻击者进到目标系统中,他就能够从里面连接到外部的ssh server.大多数的组织都允许outgoing的ssh连接(至少如果他们在公有云上有server的话).这个ssh连接在建立的时候使能了tcp port forwarding:从外部server上的一个port到内部网络中server的一个ssh端口。建立这么一个ssh back-tunnel仅需要在inside中一条命令，并且容易自动化.大多数防火墙对这种情况基本无能为力.
CryptoAuditor是一个基于network的解决方案,它可以在防火墙处阻止未授权的ssh tunnel.它可以在防火墙处基于policy来解密ssh session，当然需要能够访问到host keys. 它也可以控制文件传输

** for pentest **

参考渗透测试内网穿透部分 /doc/coder2hacker/intranet_penetration

[Proxy servers and tunneling](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling)



案例：

1.[实战课: 从"NAT端口转发"到"代理服务tunnel"拿shell](https://mp.weixin.qq.com/s?__biz=MzU1NTUyMzYzMg==&mid=2247483910&idx=1&sn=cdfe82e503449f46ad1a5f7f51876a33&chksm=fbd24959cca5c04f7f5cfbbb63e2230a7ba7c6134bc6f5c2241b394c8f9e57808f34bc9f2a8e&token=1983430103&lang=zh_CN#rd)

	+ NAT路由器端口转发
	+ 代理服务器tunnel `ssh -R443:localhost:443 -R444:localhost:444 -R445:localhost:445 -p8022 -lroot 云主机IP`

2.后渗透 pivot-内网扫描，参考《tools_metasploit》

```
通过控制的某个主机的meterpreter session来扫描整个内网
https://redteamnation.com/pivoting/

e.g. the compromised host 192.168.1.22 has access to a private network at 172.17.0.0/24.

方法一：使用proxychain
假设我们拿到主机192.168.1.22的ssh，我们可以开一个tunnel：
ssh -D 4444 admin@192.168.1.22
然后在attacker机器设置proxychains config：
注释掉proxy_dns，开启 socks4 127.0.0.1 4444
然后执行
proxychains nmap -Pn -sT 172.17.0.0/24
这样nmap就会通过444端口将流量转发到 192.168.1.22 主机上

方法二：使用 meterpreter autoroute
```



#### 4.3.4 VPN

A VPN tunnel, however, is fully encrypted. The "P in VPN indicates private. VPN tunnels are typically achieved with IPSeC, SSL, PPTP,  TCP Crypt (this is a new protocol), etc.

> A VPN is created by establishing a virtual point-to-point connection through the use of dedicated circuits or with tunneling protocols over existing networks. A VPN available from the public Internet can provide some of the benefits of a wide area network (WAN). From a user perspective, the resources available within the private network can be accessed remotely
> https://en.wikipedia.org/wiki/Virtual_private_network

### 4.4 其他network测试工具

network丢包延迟重复模拟器 https://jagt.github.io/clumsy/


## 5.Network architecture

Network Protocols and Architecture
https://www.coursera.org/learn/network-protocols-architecture

ipset vpn(一般对外走公网，不可靠) VS leased line（一般连接内网和数据中心）

vlan/vxlan技术（用于连接多个数据中心，让其变成逻辑上一个中心）

![network](/docs/docs_image/software/network/network14.png)

BB: underlay backbone core switch 
FW: Firewalls
DC: VXLAN overlay network Core switch
leaf access switch
一套配置是指一个BB+一个FW+一个DC，BB通过防火墙连接DC,DC再连接access layer，access layer连接服务器；
两个datacenter各自有两套配置，两个datacenter的两套配置各自通过一条黑色物理电缆连接，一条一个运营商，
然后可以看到逻辑上蓝色和黑色是分开的，但物理上是用黑色同一条线，逻辑上是通过协议来区分的，协议就是在通信的header里面加多一点信息来区分BB和DC

todo:

虚连接（VC:Virtual Connection）TCP虚连接？

---

ref:

[Packet sniffer basics for network troubleshooting](https://www.redhat.com/sysadmin/packet-sniffer-basics)

[网络7层协议，4层，5层？理清容易混淆的几个概念](https://blog.csdn.net/cc1949/article/details/79063439)
[Netty(三) 什么是 TCP 拆、粘包？如何解决？](https://juejin.im/post/5b67902f6fb9a04fc67c1a24)

如何用30分钟快速优化家中Wi-Fi？阿里工程师有绝招 https://yq.aliyun.com/articles/692337?spm=a2c4e.11163080.searchblog.118.32e02ec1I9PHCG

化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！ https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG
技术宅之---用手机实现“移动网关” https://yq.aliyun.com/articles/702875?spm=a2c4e.11163080.searchblog.32.32e02ec1I9PHCG