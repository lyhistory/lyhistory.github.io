---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

关键词： 内网穿透/映射	，端口映射（静态ip），动态ip映射（花生壳，frp） 动态域名解析DDNS（花生壳，nginx）

内网穿透的英文叫做NAT traversal，又被称为端口映射或内网映射，内网穿透是网络连接术语，即在计算机是局域网内的时候，外网与内网的计算机的节点进行连接时所需要的连接通信，有时候就会出现内网穿透不支的情况。

在渗透测试中，由于防火墙设置和各种权限设置，经常会遇到无法直接连接内网中某台机器的情况，内网中的机器自然是不对外的，躲在NAT和防火墙后面，所以就产生了内网穿透的需求；
另外即使平常家庭使用也会用到内网穿透，要知道由于ipv4资源耗尽，部分宽带运营商ISP开始对用户进行NAT，所以普通用户可能得不到独立的外网IP，而是相当于在运行商组建的内网中，
有时候我们需要从外网访问家中的设备，这跟渗透测试的内网穿透场景基本一致，只不过安全防范没有那么强

## 基本端口转发
### 拥有静态公网IP情况下，比如新加坡家庭网络或公司网络:

直接在路由器上设置一下端口映射（使用带端口映射功能的路由器，或者使用DMZ主机功能，把内网中的一台主机完全暴露给互联网，开放所有端口，等同于全部端口映射。等于直接使用公网IP。），将内网IP与端口映射到公网IP的一个端口上。当外界需要访问内网端口的服务时，只需要向公网IP对应的端口发起请求即可。（当然不要忘记先固定内网IP）


### 拥有动态公网IP情况下（动态NAT设备），比如中国家庭网络：
这种情况下依然可以做端口映射，但是由于IP地址不固定，所以需要通过方法来告知连接者IP到底是多少。解决这个问题可以采用DDNS（动态域名解析）技术。

DDNS（动态域名解析）技术就是首先获得一个域名，并要求内网设备每隔一段时间对于DDNS服务器发起请求，DNS服务器将请求的IP记录下来并且刷新相关域名的解析记录。最终可以通过该域名找到当前的IP地址。

## 内网穿透技术

但是以下两种情况无法使用前面的基本端口转发：
+ 家庭路由器上面一层连接的是ISP的另一层路由器，甚至有层层链接情况下：
+ NAT类型为NAPT（非Full Cone）情况下
  
这两种情况下，通过固定IP并在自己的路由器上设置映射是没有作用的。需要使用内网穿透技术。

### 原理

#### 温习NAT常识
![](/docs/docs_image/software/network/nat_traversal_1.png)

Your laptop sends UDP packets from 192.168.0.20:1234 to 7.7.7.7:5678. This is exactly the same as if the laptop had a public IP. But that won’t work on the internet: 192.168.0.20 is a private IP address, which appears on many different peoples’ private networks. The internet won’t know how to get responses back to us.

Enter the home router. The laptop’s packets flow through the home router on their way to the internet, and the router sees that this is a new session that it’s never seen before.

It knows that 192.168.0.20 won’t fly on the internet, but it can work around that: it picks some unused UDP port on its own public IP address — we’ll use 2.2.2.2:4242 — and creates a NAT mapping that establishes an equivalence: 192.168.0.20:1234 on the LAN side is the same as 2.2.2.2:4242 on the internet side.

From now on, whenever it sees packets that match that mapping, it will rewrite the IPs and ports in the packet appropriately.

Resuming our packet’s journey: the home router applies the NAT mapping it just created, and sends the packet onwards to the internet. Only now, the packet is from 2.2.2.2:4242, not 192.168.0.20:1234. It goes on to the server, which is none the wiser. It’s communicating with 2.2.2.2:4242, like in our previous examples sans NAT.

Responses from the server flow back the other way as you’d expect, with the home router rewriting 2.2.2.2:4242 back to 192.168.0.20:1234. The laptop is also none the wiser, from its perspective the internet magically figured out what to do with its private IP address.

Our example here was with a home router, but the same principle applies on corporate networks. The usual difference there is that the NAT layer consists of multiple machines (for high availability or capacity reasons), and they can have more than one public IP address, so that they have more public ip:port combinations to choose from and can sustain more active clients at once.


#### 引入问题

![](/docs/docs_image/software/network/nat_traversal_2.png)

Our problem is that our two peers don’t know what the ip:port of their peer is. Worse, strictly speaking there is no ip:port until the other peer sends packets, since NAT mappings only get created when outbound traffic towards the internet requires it. both sides have to speak first, but neither side knows to whom to speak, and can’t know until the other side speaks first.

How do we break the deadlock?

#### 初步原理（保底）
对于在NAT之后的节点来说，其不是不能主动访问公网端口，而是不能反过来有效的被公网访问。通过反向代理进行内网穿透的主要思路就是利用这一点，让在NAT之后的节点主动访问一个拥有公网IP地址的服务器，并由中间服务器搭桥（中继 relay），打通经过该服务器从其他主机到NAT之后节点的隧道。

同样该技术除了可以访问隐藏在NAT之后的节点，同样可以穿透防火墙。由于防火墙只拦截了入站没有拦截出站，所以可以让防火墙内的服务器主动连接到一个公网服务器打通隧道，并通过该隧道最终链接到本地的其他端口。

所谓隧道技术：
隧道技术是一种通过使用互联网络的基础设施在网络之间传递数据的方式。 使用隧道传递的数据(或负载)可以是不同协议的数据帧或包。 隧道协议将这些其他协议的数据帧或包重新封装在新的包头中发送。 新的包头提供了路由信息，从而使封装的负载数据能够通过互联网络传递。

#### P2P原理（可能不稳定）

很多时候，我们希望网络中的两台主机能够直接进行通信，即所谓的P2P通信，而不需要其他公共服务器的中转。由于主机可能位于防火墙或NAT之后，在进行P2P通信之前，我们需要进行检测以确认它们之间能否进行P2P通信以及如何通信。最常见的是基于UDP的技术，如RFC3489中定义的STUN协议。

STUN，首先在RFC3489中定义，作为一个完整的NAT穿透解决方案，英文全称是Simple Traversal of UDP Through NATs，即简单的用UDP穿透NAT。

在新的RFC5389修订中把STUN协议定位于为穿透NAT提供工具，而不是一个完整的解决方案，英文全称是Session Traversal Utilities for NAT，即NAT会话穿透效用。RFC5389与RFC3489除了名称变化外，最大的区别是支持TCP穿透。

TURN，首先在RFC5766中定义，英文全称是Traversal Using Relays around NAT:Relay Extensions to Session Traversal Utilities for NAT，即使用中继穿透NAT:STUN的扩展。简单的说，TURN与STURN的共同点都是通过修改应用层中的私网地址达到NAT穿透的效果，异同点是TURN是通过两方通讯的“中间人”方式实现穿透。

注意:
+ 虽然通过让nat后面的设备访问STUN server然后暴露其 公网ip:port，首先从STUN server的角度看到的是公网ip:port，然后如果nat后面的设备访问外网其他服务时NAT设备仍然是为其创建相同的公网ip:port则没问题，
但是有些NAT设备并非这样，他们会为nat后面的设备访问不同的目的创建不同的port，所以此时从 STUN server角度看到的也只是他看到的；
+ 通常是基于UDP打洞，TCP很复杂

### 实践：按隧道技术+传输协议划分

#### ICMP Tunnel

[Ping Power — ICMP Tunnel](https://infosecwriteups.com/ping-power-icmp-tunnel-31e2abb2aaea)
ICMP Tunneling can be done by changing the Payload Data so it will contain the data we want to send.

#### HTTP Tunnel

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

#### TCP Tunnel 

跟http tunnel利用http connect，还需要一个proxy server来建立双向通道并做流量转发的操作；
tcp tunnel一般不需要通过一个proxy server，而是借助安装在本地或者远程的软件来做“端口转发”，比如利用ssh将两台电脑的端口进行映射；

##### SSH 隧道穿透 

最简单的方式，只要目标机器可以访问外网或者某个跳板机即可，

> 是安全壳(SSH) 为网络安全通信使用的一种方法。SSH可以利用端口转发技术来传输其他TCP/IP协议的报文，当使用这种方式时，SSH就为其他服务在客户端和服务器端建立了一条安全的传输管道。端口转发利用本客户机端口映射到服务器端口来工作，SSH可以映射所有的服务器端口到本地端口，但要设置1024以下的端口需要根用户权限。在使用防火墙的网络中，如果设置为允许SSH服务通过(开启了22端口)，而阻断了其他服务，则被阻断的服务仍然可以通过端口转发技术转发数据包
> https://baike.baidu.com/item/%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91

所以这种端口转发方式中ssh就充当了代理服务器的角色

###### **场景1 Port Forwarding：**
比如在公司连接家里某个电脑的远程桌面，但是公司屏蔽了出流量的3389端口，可以通过ssh把3389的流量伪装成走端口3390的流量
```
ssh -L <NEW LOCAL PORT:3390>:<REMOTE IP>:<REMOTE PORT:3389> <USERNAME>@<REMOTE IP>

REMOTE IP自然是家里的公网IP，家里的电脑上需要运行ssh服务，至于家里公网IP如何映射到家里的局域网设备这里就略过；
```

###### **场景2 dynamic Port Forwarding：**
公司网络屏蔽了对某些网站的访问，
```
在公司电脑执行：
ssh -D <LOCAL PORT:3000> <USERNAME>@<REMOTE IP>
REMOTE IP是指运行了ssh服务的公网服务器或者同上家里的机器（但是要设置好NAT转发)

然后设置proxy：
Internet Options=>LAN Settings=>Proxy Settings=>Socks: ip:localhost port:3000

这样浏览网站请求都是通过远程ssh服务器访问
```
注意： 

###### **场景3 reverse Port Forwarding：**
从家里的电脑连接公司电脑
```
在公司电脑上执行:
ssh -R <REMOTE PORT:20>:localhost:<LOCAL PORT:22> <USERNAME>@<REMOTE IP>

REMOTE IP自然是家里的公网IP，家里的电脑上需要运行ssh服务，至于家里公网IP如何映射到家里的局域网设备这里就略过；

然后再家里执行:
ssh <USERNAME>@localhost:20 就能连上公司电脑的ssh服务器


免费host Expose local servers to the internet
ssh -R 80:localhost:3000 serveo.net 

其实不限于只能把本地开发机上运行的服务映射到外网服务器上去，还可以把任何本地开发机可以访问的服务映射到外网服务器上去。例如在本地开发机上能访问 github.com:80，在本地开发机上执行：

ssh -R 8080:A.com:80 <USERNAME>@<REMOTE IP>

就能通过 <REMOTE IP>:8080 去访问 A.com:80 了。
```

###### 保持运行

基于场景3，你会发现从家里的电脑登入到了公司电脑，如果此时你logout，就会发现 localhost:20 无法访问了。导致这个问题的原因是你登出时，在公司电脑上本次操作对应的 SSH 进程也跟着退出了，而这个退出的进程曾负责监听在 20 端口进行转发到22端口的操作。

为了让 SSH 隧道一直保持在后台执行，有以下方法。

+ 通过 SSH 自带的参数
    N参数：表示只连接远程主机，不打开远程shell；
    T参数：表示不为这个连接分配TTY；
    f参数：表示连接成功后，转入后台运行；
    因此要让 SSH 隧道一直保持在后台执行，可以通过以下命令：
    `ssh -NTf -R <REMOTE PORT:20>:localhost:<LOCAL PORT:22> <USERNAME>@<REMOTE IP>`
+ 通过 AutoSSH
    SSH 隧道是不稳定的，在网络恶劣的情况下可能随时断开。如果断开就需要手动去本地开发机再次向外网服务器发起连接。
    AutoSSH 能让 SSH 隧道一直保持执行，他会启动一个 SSH 进程，并监控该进程的健康状况；当 SSH 进程崩溃或停止通信时，AutoSSH 将重启动 SSH 进程。

    使用AutoSSH 只需在本地开发机上安装 AutoSSH ，方法如下：

    Mac 系统：brew install autossh；
    Linux 系统：apt-get install autossh；
    安装成功后，在本地开发机上执行：

    `autossh -N -R <REMOTE PORT:20>:localhost:<LOCAL PORT:22> <USERNAME>@<REMOTE IP>`

###### **ssh tunnel control**
SSH tunneling is a powerful tool, but it can also be abused. 
Controlling tunneling is particularly important when moving services to Amazon AWS or other cloud computing services.

ssh连接由强加密来保护,这对于流量监控和过滤系统是有效的，因为traffic是不可解读的.但是这种不可见也存在着很大的风险，比如数据泄露。恶意软件可以利用ssh来隐藏未授权通信，或者从目标网络中漏出偷窃的数据.

在一个ssh back-tunneling攻击中，攻击者在目标网络(比如AWS)以外建立一个server,一旦攻击者进到目标系统中,他就能够从里面连接到外部的ssh server.大多数的组织都允许outgoing的ssh连接(至少如果他们在公有云上有server的话).这个ssh连接在建立的时候使能了tcp port forwarding:从外部server上的一个port到内部网络中server的一个ssh端口。建立这么一个ssh back-tunnel仅需要在inside中一条命令，并且容易自动化.大多数防火墙对这种情况基本无能为力.
CryptoAuditor是一个基于network的解决方案,它可以在防火墙处阻止未授权的ssh tunnel.它可以在防火墙处基于policy来解密ssh session，当然需要能够访问到host keys. 它也可以控制文件传输

##### Ssocks
sSocks是一个socks代理工具套装，可用来开启socks代理服务

下载连接：http://sourceforge.net/projects/ssocks

##### VPN隧道-全端口穿透
如果您需要远程访问机器的所有端口（或者整个内网），同时保持安全性的话，穿透一个VPN用于访问内网服务会是个不错的选择。

A VPN tunnel, however, is fully encrypted. The "P in VPN indicates private. VPN tunnels are typically achieved with IPSeC, SSL, PPTP,  TCP Crypt (this is a new protocol), etc.

Generally VPNs use TCP or UDP protocols to communicate, VPN protocols themselves just negotiate the connection (OpenVPN, IKEv2, Wireguard, PPTP, SSTP, L2TP/IPSec)

> A VPN is created by establishing a virtual point-to-point connection through the use of dedicated circuits or with tunneling protocols over existing networks. A VPN available from the public Internet can provide some of the benefits of a wide area network (WAN). From a user perspective, the resources available within the private network can be accessed remotely
> https://en.wikipedia.org/wiki/Virtual_private_network

+ IPSec
    In computing, Internet Protocol Security (IPsec) is a secure network protocol suite that authenticates and encrypts packets of data to provide secure encrypted communication between two computers over an Internet Protocol network. It is used in virtual private networks (VPNs).

### 实践：按通信方式+应用协议划分

综合对比

| -/- | 代理穿透 | P2P穿透 | 自主代理 | 公网IP | 备注 |
| --- | --- | --- | --- | --- | --- |
| 花生壳 | YES | NO | NO | 不需要 | 限速到怀疑人生 |
| teamviewer | YES | NO | NO | 不需要 | 烦人的商用提示 |
| Ngrok | YES | NO | YES | 需要 | |
| [Frp](https://github.com/fatedier/frp) | YES | YES/UDP | YES | 需要 | 三种方式选其一 |
| smarGate | YES | YES/TCP | YES | 不需要 | 同时支持，P2P优先 |

其他工具：
+ nps是一款轻量级、高性能、功能强大的内网穿透代理服务器。目前支持tcp、udp流量转发，可支持任何tcp、udp上层协议（访问内网网站、本地支付接口调试、ssh访问、远程桌面，内网dns解析等等……），此外还支持内网http代理、内网socks5代理、p2p等，并带有功能强大的web管理端。
  https://github.com/ehang-io/nps/releases
+ EW 是一套便携式的网络穿透工具，具有 SOCKS v5服务架设和端口转发两大核心功能，可在复杂网络环境下完成网络穿透。但是，现在工具已经不更新了。。。
+ Serveo
  官网地址：https://serveo.net/ ↗

    优点：

    Serveo 是一个免费的 SSH 服务，允许你远程访问你的设备。

    它不需要客户端和服务器之间安装任何软件，只需一个简单的 SSH 命令就可以启动。

    它支持 HTTP，HTTPS 和 TCP 穿透，可以满足你的不同需求。

    它可以保存你的连接记录，你可以随时查看之前的请求信息。
+ 
#### （反向）代理穿透
说白了，就是通过公网的服务器转发，本质跟nginx反向代理web服务或者负载均衡器的角色一样，把内网中的服务挡在身后，自己向外网开放端口，

但是普通的反向代理比如nginx是有限制的:
nginx 可以提供本机不同端口之间的相互代理;
如果nginx配置其他机器的代理，其他机器的IP地址必须可以被其直接访问，所以只能代理另一台公网服务器，或者代理同一内网下的其他机器;

所以如果想要代理不在同一个内网的其他的内网机器就不行了,必须使用第三方的如：花生壳/teamviewer/Ngrok/Frp/smarGate，
这些产品之间的区别是：
+ 花生壳/teamviewer肯定不开源，流量经过他们的服务器；
+ frp开源，可以设置自己的代理服务器，
+ smarGate不开源，貌似为了保证连通性也默认会走他们的服务器；


##### Frp反向代理模式流程
![](/docs/docs_image/software/network/nat_traversal_frp.png)

1) frps 监听端口7000端口（对内端口），等待fprc的连接
2) frpc会请求frps x.x.x.x:7000端口，并建立TCP连接，此后会一直维持 这个链接， 因为后面所有客户端请求frpc后面的服务时，数据都会通过这个TCP连接进行，而不再建立新的连接。
3) frpc连接到frps的对内端口7000，同时告诉frps要监听的对外端口6000和转发类型tcp；
4) frps服务端fork新的进程监听客户端对外端口6000；
5) 客户端请求frps x.x.x.x:6000时：ssh -oPort=6000 test@x.x.x.x，frps会把数据转发7000（对内端口）给frpc，frpc会把数据发给22端口服务ssh

#### P2P穿透

Frp(xtcp模式)/smarGate

##### Frp(xtcp模式)
不知道底层协议是不是前面的标准P2P协议STUN/TURN
![](/docs/docs_image/software/network/nat_traversal_frp-p2p.png)

##### smarGate
不知道底层协议是不是前面的标准P2P协议STUN/TURN
![](/docs/docs_image/software/network/nat_traversal_smargate.png)

其中很多的穿透类产品通常直接将访问入口定义到公网服务器上，就像将自家防盗门放到公共场所，即使需要钥匙，也难防技艺高超的开锁匠。
smarGate的做法是将防盗门随身携带，自主可控，可以自定义服务器来代替官方提供的免费代理服务器

安全问题：
希望smarGate后续可以开源，至少移除默认的认证服务器，否则如何让用户相信smarGate没有收集用户数据

## 实例：
### Cloudfalre Tunnels
[使用Cloudfalre Tunnels实现内网穿透，同时突破80/443限制](https://mp.weixin.qq.com/s/W5ykzfYpLpmxpwxH6q_P4w)

### 实战课: 从"NAT端口转发"到"代理服务tunnel"拿shell
[实战课: 从"NAT端口转发"到"代理服务tunnel"拿shell](https://mp.weixin.qq.com/s?__biz=MzU1NTUyMzYzMg==&mid=2247483910&idx=1&sn=cdfe82e503449f46ad1a5f7f51876a33&chksm=fbd24959cca5c04f7f5cfbbb63e2230a7ba7c6134bc6f5c2241b394c8f9e57808f34bc9f2a8e&token=1983430103&lang=zh_CN#rd)

	+ NAT路由器端口转发
	+ 代理服务器tunnel `ssh -R443:localhost:443 -R444:localhost:444 -R445:localhost:445 -p8022 -lroot 云主机IP`

### 后渗透 pivot-内网扫描，参考《tools_metasploit》

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

## ref:

[What Is STUN?](https://info.support.huawei.com/info-finder/encyclopedia/en/STUN.html)
[STUN和TURN技术浅析](http://www.h3c.com/cn/d_201206/747038_97665_0.htm)
[[译] NAT 穿透是如何工作的：技术原理及企业级实践（Tailscale, 2020）](https://arthurchiao.art/blog/how-nat-traversal-works-zh/)
[How NAT traversal works](https://tailscale.com/blog/how-nat-traversal-works/)

[从外网控制内网的机器人](https://yq.aliyun.com/articles/195878?spm=a2c4e.11163080.searchblog.127.32e02ec1I9PHCG)
[ngrok - HTTP和TCP隧道](https://www.youtube.com/watch?v=tn2zbi8OnvM)
[渗透基础——端口转发与代理](https://3gstudent.github.io/%E6%B8%97%E9%80%8F%E5%9F%BA%E7%A1%80-%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91%E4%B8%8E%E4%BB%A3%E7%90%86/)

[实战中内网穿透的打法](https://cloud.tencent.com/developer/article/1622380)

[NAPT类型测试与XTCP点对点内网穿透适用例外](https://dengxj.blog.csdn.net/article/details/89187944)

[内网渗透初探(二) | 内网渗透全过程重新学习](https://xz.aliyun.com/t/10543)

[Proxy servers and tunneling](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling)

[SSH Tunneling Explained](https://www.youtube.com/watch?v=AtuAdk4MwWw)

https://zhuanlan.zhihu.com/p/57630633

https://null-byte.wonderhowto.com/how-to/hacking-windows-10-use-ssh-tunnels-forward-requests-hack-remote-routers-0198465/

https://bob.kim/ngrok_theory

https://medium.com/@ryanwendel/forwarding-reverse-shells-through-a-jump-box-using-ssh-7111f1d55e3a

https://www.offensive-security.com/metasploit-unleashed/portfwd/