---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《网络基础》

# 网络分层
The layers in the TCP/IP network model, in order, include:
+ Layer 5: Application
+ Layer 4: Transport
+ Layer 3: Network/Internet
+ Layer 2: Data Link
+ Layer 1: Physical

![网络分层](/docs/docs_image/software/network/network01.png)

比较早的layer1是采用hub技术，容易浪费带宽，比如A和B两台机器上面运行不同的服务，外面请求进来的时候，采用hub技术就要盲目广播，浪费带宽；
而采用layer2的交换机技术，由于交换机会学习mac地址（arp mapping），大大降低了广播的浪费；
而layer3进一步采用ip网段隔开不同的分区，根据外部请求的ip可以准确的找到不同的网关，网关的概念跟

## Layer 1: The physical layer
We often take the physical layer for granted ("did you make sure the cable is plugged in?"), 
but we can easily troubleshoot physical layer problems from the Linux command line. 
That is if you have console connectivity to the host, which might not be the case for some remote systems.

![physical network](/docs/docs_image/software/network/network02.png)

## Layer 2: The data link layer

Layer2是交换机switch（记住arp mapping）
The data link layer is responsible for local network connectivity; essentially, the communication of frames between hosts on the same Layer 2 domain (commonly called a local area network). The most relevant Layer 2 protocol for most sysadmins is the Address Resolution Protocol (ARP), which maps Layer 3 IP addresses to Layer 2 Ethernet MAC addresses. When a host tries to contact another host on its local network (such as the default gateway), it likely has the other host’s IP address, but it doesn’t know the other host’s MAC address. ARP solves this issue and figures out the MAC address for us.
A common problem you might encounter is an ARP entry that won’t populate, particularly for your host’s default gateway. If your localhost can’t successfully resolve its gateway’s Layer 2 MAC address, then it won’t be able to send any traffic to remote networks. This problem might be caused by having the wrong IP address configured for the gateway, or it may be another issue, such as a misconfigured switch port.

![data link](/docs/docs_image/software/network/network03.png)

Linux caches the ARP entry for a period of time, so you may not be able to send traffic to your default gateway until the ARP entry for your gateway times out. For highly important systems, this result is undesirable. Luckily, you can manually delete an ARP entry, which will force a new ARP discovery process

## Layer 3: The network/internet layer

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

## Layer 4: The transport layer
The transport layer consists of the TCP and UDP protocols, with TCP being a connection-oriented protocol and UDP being connectionless. Applications listen on sockets, which consist of an IP address and a port. Traffic destined to an IP address on a specific port will be directed to the listening application by the kernel. A full discussion of these protocols is beyond the scope of this article, so we’ll focus on how to troubleshoot connectivity issues at these layers.
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

# Network architecture
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


# Packet Sniffer

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

# 实战问题

## wireshark
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

可以看到还有SSH的请求干扰视线，所以果断关掉，但是发现黑色背景的tcp不断的出现，然后关掉网站，居然还在，决定根据端口查一下
netstat -aon | find /i "53072"
tasklist /fi "pid eq 81304"
居然是chrome，关掉chrome就完全停掉了

进一步看下http请求，看到左侧的箭头表示request和response，然后中间的两个点表示相关联的（https://www.wireshark.org/docs/wsug_html_chunked/ChUsePacketListPaneSection.html
），应该是http底层依赖的tcp请求，然后后面的TCP Keep Alive基本就是与之想的，应该是http header里面的keep alive起作用
https://www.imperva.com/learn/performance/http-keep-alive/

使用wireshark还有个要注意的是，比如 http.host contains lyhistory.github.io
因为我的域名是解析到github page  所以host不是我自己的lyhistory.com了

## 一次排查send-q

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

参考：记一次惊心的网站TCP队列问题排查经历https://zhuanlan.zhihu.com/p/36731397
https://juejin.im/post/5d8488256fb9a06b065cad98
https://cloud.tencent.com/developer/article/1143712

## 内网穿透

Ipv4 ipv6

:::ffff: 用于IPv4的IPv6套接字通信。应用和套接字方面，它是IPv6，但网络和就包而言，它是IPv4。
In IPv6, you are allowed to remove leading zeros, and then remove consecutive zeros, meaning ::ffff: actually translates to 0000:0000:ffff:0000, this address has been designated as the IPv4 to IPv6 subnet prefix, so any IPv6 processor will understand it's working with an IPv4 address and handle it accordingly.

内网穿透/映射	，端口映射（静态ip），动态ip映射（花生壳，frp） 动态域名解析DDNS（花生壳，nginx）
Public ip vs nat：
NAT stands for Network Address Translation. In the context of our network, NAT is how one (public) IP address is turned into many (private) IP addresses. 
A public IP address is an address that is exposed to the Internet. If you search for "what's my IP" on the Internet, you'll find the public IP address your computer is using.
If you look up your computer's IP address, you'll see a different IP address: this is your device's private IP.
Chances are, if you check this on all of your devices, you'll see that all your devices are using the same public IP, but all have different private IPs. This is NAT in action. The network hardware uses NAT to route traffic going from the public IP to the private IP.
 
ipv4资源耗尽，部分宽带运营商开始对用户进行NAT，意思是得不到独立的外网IP，
如果有独立的外网ip，直接在路由器上设置端口转发或者DMZ映射即可通过外网访问内网电脑；
如果被NAT，可以利用frp反向代理进行内网穿透，从而对外网提供服务；

DNS技术和NAT技术详解 https://blog.csdn.net/hansionz/article/details/86570290
https://bob.kim/ngrok_theory
利用NAT代理实现内网访问外网 https://www.ssgeek.com/linux/linux-technology/455.html
用静态NAT实现外网PC访问内网服务器 https://blog.51cto.com/11970509/2046966
使用 NAT 穿透访问 NAT 后面的 HTTP Server 还是用更加简单的方式？ https://yq.aliyun.com/articles/195878?spm=a2c4e.11163080.searchblog.127.32e02ec1I9PHCG



 内网穿透工具的原理与开发实战 https://zhuanlan.zhihu.com/p/30351943
frp和nginx内网服务器转发和建站 https://zhuanlan.zhihu.com/p/31924024
NAT 是IP 转IP ARP 是IP 转MAC


如何用30分钟快速优化家中Wi-Fi？阿里工程师有绝招 https://yq.aliyun.com/articles/692337?spm=a2c4e.11163080.searchblog.118.32e02ec1I9PHCG
化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！ https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG
技术宅之---用手机实现“移动网关” https://yq.aliyun.com/articles/702875?spm=a2c4e.11163080.searchblog.32.32e02ec1I9PHCG


https://www.redhat.com/sysadmin/beginners-guide-network-troubleshooting-linux


---

ref:

[A beginner's guide to network troubleshooting in Linux](https://www.redhat.com/sysadmin/beginners-guide-network-troubleshooting-linux)
[Packet sniffer basics for network troubleshooting](https://www.redhat.com/sysadmin/packet-sniffer-basics)

