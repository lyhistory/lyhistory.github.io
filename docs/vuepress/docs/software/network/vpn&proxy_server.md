---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《vpn梯子基础》

## 0. 序言
本文对象是明辨是非的研究者，请不要做中国法律规定范围之外的事情，
由于特殊的国情，我国屏蔽了一些海外的网络服务，作为IT从业者为了工作学习不得不通过一些技术手段访问海外服务，这种手段俗称：翻:)(:墙、梯子、科学上网，本文纯粹从技术角度出发普及计算机理论基础，比如IP TCP UDP协议，ping telent tracert 软路由等工具，正向代理反向代理，流量加密中转等等，

通常有两种常用方式([具体原理参考这里](/docs/software/network/network)，小白请忽略这里，继续看下面)：
+ VPN:)(:翻墙
+ Proxy server代理上网

+ 推荐小白直接使用下面的现成产品即可；
  - [代理服务器产品](#21-现成产品---力荐just-my-socks推荐小白)
  - [VPN产品](#11-现成产品推荐小白使用)
+ 对于有基本知识或勇于尝试的同学们可以选择下面的自建方式；
+ 对于公司团队，可以两者都搞：购买现成产品+自建，互为备用；

## 1. VPN:)(:翻墙

VPN的全名是virtual private network，缩写：VPN，是常用于连接中、大型企业或团体间私人网络的通讯方法。它利用隧道协议（Tunneling Protocol） 来达到发送端认证、消息保密与准确性等功能。值得注意的是VPN诞生的原因并不是为了翻墙，只是一些公司与公司间的网络通讯方式

### 1.1 现成产品(推荐小白使用)
购买之后直接安装使用，

比如有我个人经常用的
+ LetsVPN(推荐，最稳，支持支付宝，注意安装后输入：505716601，可以获取免费使用额度，可以先用再购买)
  - [下载链接1](https://bitbucket.org/letsgo666/letsgo_en_1/src/main/README.md)
  - [下载链接2](https://github.com/LetsgoNetwork/LetsGo_EN_1/blob/main/README.md)

+ WS(推荐，这个的协议众多，当其他vpn有问题的时候这个都不会有问题，另外可以白嫖很多地址，当然如果你想省事购买也是性价比不错的) 
  [官网链接](https://windscribe.com/yo/w4aoykqp)

+ StrongVPN（一般，没有前面两个好）：

  + [StrongVPN 镜像1](https://intranet.strongconnectivity.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像2](https://intranet.reliablehosting.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像3](https://intranet.strongvpn.com/services/strongvpn/refer/204835b682517019/)
  + strongvpn legacy download:
      + [windows](https://mirror2.reliablehosting.com/win/StrongVPN_Win-latest.exe)
      + [mac](https://mirror2.reliablehosting.com/mac/StrongVPN_Mac-latest.dmg)
      + [android](https://mirror2.reliablehosting.com/android/1.7.0.apk)


+ ExpressVPN(不推荐，貌似已经无法在国内用了):
  + [ExpressVPN 镜像1](https://tfiflve.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像2](https://upghsbc.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像3](https://www.expressrefer.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  
+ Cloudflare WARP
  简而言之，你可以试试，免费不限流量：Preferences=>Account=>Login with Cloudflare Zero Trust(settings=>WARP Client=>Device enrollment permissions)，当然免费的你就不要奢望多么稳定了
  https://1.1.1.1/
  When you use WARP, your DNS queries are protected from snoopers using Cloudflare’s 1.1.1.1 DNS service. A layer of encryption is also added to secure your traffic from prying eyes on the internet. However, unlike traditional VPNs, WARP does not mask your IP address, which means you can’t use it to improve your privacy or stream geo-restricted content.
  WARP secures your data with encryption to keep your personal information safe, but it doesn’t provide any extra security. For instance, it doesn’t offer any form of anonymity protection. There’s no new IP address allocated to you, which means your traffic is not disguised from your ISP and other third parties – they can trace it back to you! 
+ 还有开源的[protonvpn](https://protonvpn.com) (暂未尝试)
+ [未来VPN?去中心化VPN](https://www.orchid.com/)
### 1.2 自行搭建(不推荐小白)

#### 1.2.1 理论

VPN虚拟专用网络发展至今已经不在是一个单纯的经过加密的访问隧道了，它已经融合了访问控制、传输管理、加密、路由选择、可用性管理等多种功能

VPN (Virtual Private Network) is no longer a simple encrypted access tunnel, it integrates multiple functions such as access control, transmission management, encryption, route selection, and availability management

###### PPTP
点对点隧道协议 (PPTP) 是由包括微软和3Com等公司组成的PPTP论坛开发的一种点对点隧道协，基于拨号使用的PPP协议使用PAP或CHAP之类的加密算法，或者使用 Microsoft的点对点加密算法MPPE。其通过跨越基于 TCP/IP 的数据网络创建 VPN 实现了从远程客户端到专用企业服务器之间数据的安全传输。PPTP 支持通过公共网络(例如 Internet)建立按需的、多协议的、虚拟专用网络。PPTP 允许加密 IP 通讯，然后在要跨越公司 IP 网络或公共 IP 网络(如 Internet)发送的 IP 头中对其进行封装。

The Point-to-Point Tunneling Protocol (PPTP) is a Point-to-Point Tunneling Protocol developed by PPTP forums consisting of companies such as Microsoft and 3com, the PPP protocol used for dialing uses encryption algorithms such as PAP or chap, or Microsoft's point-to-point encryption algorithm MPPE. It creates a VPN over a TCP/IP-based data network to implement secure data transmission from a remote client to a dedicated Enterprise Server. PPTP supports creating on-demand, multi-protocol, and virtual private networks through public networks (such as the Internet. PPTP allows encrypted IP communication.

  PPTP is mainly used for users who often go out for mobile or home office work

###### L2TP
L2TP第 2 层隧道协议 (L2TP) 是IETF基于L2F (Cisco的第二层转发协议)开发的PPTP的后续版本。是一种工业标准 Internet 隧道协议，其可以为跨越面向数据包的媒体发送点到点协议 (PPP) 框架提供封装。PPTP和L2TP都使用PPP协议对数据进行封装，然后添加附加包头用于数据在互联网络上的传输。PPTP只能在两端点间建立单一隧道。 L2TP支持在两端点间使用多隧道，用户可以针对不同的服务质量创建不同的隧道。L2TP可以提供隧道验证，而PPTP则不支持隧道验证。但是当L2TP 或PPTP与IPSEC共同使用时，可以由IPSEC提供隧道验证，不需要在第2层协议上验证隧道使用L2TP。 PPTP要求互联网络为IP网络。L2TP只要求隧道媒介提供面向数据包的点对点的连接，L2TP可以在IP(使用UDP)，桢中继永久虚拟电路 (PVCs),X.25虚拟电路(VCs)或ATM VCs网络上使用。

Layer 2 Tunneling Protocol (L2TP) is a later version of PPTP developed by IETF Based on l2f (Cisco's L2 forwarding protocol. It is an industrial standard Internet tunnel protocol that provides encapsulation for a Point-to-Point Protocol (PPP) framework that spans data packets. Both PPTP and L2TP use the PPP protocol to encapsulate data, and then add additional headers for data transmission over the Internet. PPTP can only establish a single tunnel between two points. L2TP supports multiple tunnels between two points. Users can create different tunnels for different service quality. L2TP can provide tunnel verification, while PPTP does not. However, when both L2TP or PPTP and IPSec are used together, IPSec can provide tunneling verification, without the need to verify that the tunneling uses L2TP on the layer-3 protocol.
PPTP requires the Internet to be an IP network. L2TP only requires the tunneling media to provide packet-oriented point-to-point connections. L2TP can relay permanent virtual circuits (PVCs), X.25 virtual circuits (VCS) at IP addresses (using UDP) or use it on an ATM VCs network.

###### IPSec
[开始“熟悉又陌生”的IPSec奇妙之旅](https://mp.weixin.qq.com/s/VwjKEX0EUvWz00yaDUvAhw)
IPSec 隧道模式隧道是封装、路由与解封装的整个 过程。隧道将原始数据包隐藏(或封装)在新的数据包内部。该新的数据包可能会有新的寻址与路由信息，从而使其能够通 过网络传输。隧道与数据保密性结合使用时，在网络上窃听通讯的人将无法获取原始数据包数据(以及原始的源和目标)。封装的数据包到达目的地后，会删除封 装，原始数据包头用于将数据包路由到最终目的地。

隧道本身是封装数据经过的逻辑数据路径，对原始的源和目的端，隧道是不可见的，而只能看到网络路径中的点对点连接。连接双方并不关心隧道起点和终点之间的任何路由器、交换机、代理服务器或其他安全网关。将隧道和数据保密性结合使用时，可用于提供VPN。

封装的数据包在网络中的隧道内部传输。在此示例中，该网络是 Internet。网关可以是外部 Internet 与专用网络间的周界网关。周界网关可以是路由器、防火墙、代理服务器或其他安全网关。另外，在专用网络内部可使用两个网关来保护网络中不信任的通讯。

当以隧道模式使用 IPSec 时，其只为 IP 通讯提供封装。使用 IPSec 隧道模式主要是为了与其他不支持 IPSec 上的 L2TP 或 PPTP VPN 隧道技术的路由器、网关或终端系统之间的相互操作。

The IPSec tunneling mode is the whole process of encapsulation, routing, and unencapsulation. The tunnel hides (or encapsulates) the original data packet inside the new data packet. The new data packet may have new addressing and routing information so that it can be transmitted over the network. When the tunnel is used in combination with data confidentiality, the person who listens to the communication on the network will not be able to obtain the original data packet (as well as the original source and target ). After the encapsulated data packet arrives at the destination, the encapsulation is deleted. The original data packet header is used to route the data packet to the destination.

A tunnel is a logical data path that encapsulates data. It is invisible to the source and destination, but only to point-to-point connections in the network path. Both parties do not care about any vrouters, switches, proxies, or other security gateways between the start and end points of the tunnel. A VPN can be used to provide a VPN when a tunnel is used in combination with data confidentiality.

The encapsulated data packet is transmitted within the tunnel of the network. In this example, the network is internet. A gateway can be a perimeter gateway between an external internet and a private network. Perimeter gateways can be routers, firewalls, proxy servers, or other security gateways. In addition, two gateways can be used inside a private network to protect untrusted communication in the network.

When using IPSec in tunneling mode, it only provides encapsulation for IP communication. The IPSec tunneling mode is used to interact with other routers, gateways, or terminal systems that do not support the L2TP or pptp vpn tunneling technology on IPSec.

###### SSL VPN
SSL VPN是一种基于SSL的VPN远程访问技术。 SSL VPN 允许用户从互联网的任何位置启动 Web 浏览器以建立远程访问 VPN 连接

![sslvpn](/docs/docs_image/software/network/sslvpn.png)

如图所示，FW作为企业的出口网关，接入Internet。 为远程用户提供SSL VPN接入服务。 远程用户可以随时随地使用笔记本电脑、Pad、智能手机等移动设备通过FW访问内网资源。

SSL VPNSSL VPN, SSL协议提供了数据私密性、端点验证、信息完整性等特性。SSL协议由许多子协议组成，其中两个主要的子协议是握手协议和记录协议。握手协议允许服务器 和客户端在应用协议传输第一个数据字节以前，彼此确认，协商一种加密算法和密码钥匙。在数据传输期间，记录协议利用握手协议生成的密钥加密和解密后来交换的数据。

SSL独立于应用，因此任何一个应用程序都可以享受它的安全性而不必理会执行细节。SSL置身于网络结构体系的 传输层和应用层之间。此外，SSL本身就被几乎所有的Web浏览器支持。这意味着客户端不需要为了支持SSL连接安装额外的软件。这两个特征就是SSL能 应用于VPN的关键点。

The SSL protocol provides features such as data privacy, endpoint verification, and information integrity. The SSL protocol consists of many sub-protocols, two of which are handshake protocol and record protocol. The handshake protocol allows the server and client to confirm each other before the application protocol transmits the First Data byte and negotiate an encryption algorithm and password key. During data transmission, the record protocol uses the key generated by the handshake protocol to encrypt and decrypt the data to be exchanged.

SSL is independent from the application, so any application can enjoy its security without worrying about the execution details. SSL is placed between the transport layer and the application layer of the network architecture. In addition, SSL is supported by almost all web browsers. This means that the client does not need to install additional software to support SSL connections. These two features are the key points that SSL can be applied to VPN.

  
虽然很多人提到sslvpn都说是browser based，但是实际并非如此，简单的当然可以是基于浏览器的，但是也仅仅只能访问基于浏览器的服务，如果需要全链路的访问比如公司网络（邮件服务器 办公软件等等）还需要安装客户端分配ip，两者区别：

**基于浏览器的 SSL Portal VPN / Clientless ssl vpn：**

特点：

  Requires web browser only to access resources.
  
  Need to install plugins to access some plugins.
  
  virtual interface is not created on computer/laptop.
  
  No IP address is assigned to the computer /laptop.

例子：
- sangfor ssl vpn

工作原理：

step 1: Initial handshake: The user points their browser at their company’s SSL VPN gateway server to begin a quick handshake process.

step 2: Server authentication: The server sends a certificate that the browser authenticates with a trusted certificate authority.

step 3: Negotiate encryption: Once authenticated, the server and browser negotiate the encryption algorithm they will use.

step 4: Key exchange: the server and browser exchange either a shared secret or public keys to establish the encrypted tunnel.

step 5: Once a secure, encrypted tunnel connects the user’s browser to the SSL VPN gateway server, things run a little differently from public websites. The gateway server presents the user with a login page that is integrated with the company’s authentication and authorization systems. Successfully logged in, the remote user has access to protected company resources, and the data has full E2EE protection.

**基于客户端的 SSL Tunnel VPN / Client based ssl vpn:**

特点：

  Need to install application to access resources.
  
  Supports all applications (Full Tunnel Mode)

  Virtual network interface is created on client computer/laptop.

  Vpn gateway assigns new IP address to the client computer/laptop.

例子：

- OpenVPN
- checkpoint VPN

#### 1.2.2 搭建步骤
[OpenVPN](/docs/software/network/vpn_openvpn)

## 2. Proxy server代理上网

### 2.1 现成产品

+ [（小白最友好，尤其推荐电商使用，只需要下载客户端充值之后即可点击客户端里的指纹浏览器无障碍访问）Piaproxy代理服务，前往官方站点](https://account.piaproxy.com/register?invitation_code=6GOJQ5ZE)
  Piaproxy代理服务是一家住宅代理提供商，提供独特的服务。该服务已获得来自全球 190 多个国家/地区的 IP，使其成为位置支持方面最好的服务之一：
  支持支付宝等支付方式；
  可以切换成繁体中文使用；
  使用更加简单，可以直接使用指纹浏览器；
  
+ justmysocks 是搬瓦工官方提供的优质 V2Ray / V2Fly 服务和 Shadowsocks 服务，质量最好的 CN2 GIA 线路，月付仅 $5.88 起，更有高达 5G 带宽的 CN2 GIA 线路可选！被墙自动换 IP，无须担心 IP 被墙，justmysocks 不同于那些国人的机场，justmysocks 是搬瓦工官方背书的，数据安全是绝对靠谱放心的。

  - [Just My Socks 官网镜像1](https://justmysocks5.net/members/aff.php?aff=25045)
  - [Just My Socks 官网镜像2](https://justmysocks3.net/members/aff.php?aff=25045)
  - [Just My Socks 官网 (已被墙)](https://justmysocks.net/members/aff.php?aff=25045)

### 2.2 自行搭建(不推荐小白)

#### 2.2.1 理论

Shadowsocks，Shadowsocks-R ，Socks5，VMess，VLESS，Trojann，V2Ray，Xray，Clash， 其中Shadowsocks，Shadowsocks-R，V2Ray，Trojan，Clash既是一种协议也是一个代理软件的名字。Shadowsocks和Shadowsocks-R的速度会更快，因为他少了很多加密伪装的中间算法，但据说Shadowsocks 很早就已经能被GFW精准探测了安全性不高。 但是最新的Xray，V2Ray等通过升级加密和伪装大大提高了安全性

进化之路：

http Proxy=>Socks=>Socks5=>Shadowsocks，Shadowsocks-R=>VMESS

+ Socks
  是会话层的协议，位于表示层和传输层之间，可以代理TCP和UDP的（报文）流量；socks是一种明文协议，一般用于本地代理。
  
  **特点：**强力的身份验证方案；验证方法的协商机制；地址解析的代理；UDP协议应用的代理支持。
  
  **缺点：**额外的验证协商的功能；  客户端和服务器的通信，加密完全依赖客户端和服务器的通信协议，如果服务器用的是HTTP协议，那么，通过代理走的的流量，就相当于明文在内网传输，安全性不高。

+ ShadowSocks
  shadowsocks将socks5服务器拆分成了两部分：sslocal和ssserver:
  
  - sslocal：相对于socks5客户端便是socks5服务器，对于socks5客户端是透明的，sslocal完成与socks5客户端的所有交互；
  - ssserver：相对于socks5客户端同样也是是socks5服务器，对于目标主机是透明的，完成与socks5服务器与目标主机的所有操作；
  
  工作原理:socks5的处理方式是将socks5客户端与socks5服务器的连接提前，socks5协议的交互完全实在本地进行的，在网络中传输完全是利用加密算法加密后的密文，很好的进行了去特征话，使得传输的数据不是很容易被特征识别。
  
  具体流程:sslocal接收到socks5客户端发送的数据，会将数据进行加密，并将配置信息发送到ssserver，ssserver接收到配置信息进行权限验证，然后再将配置信息发送到ssserver，ssserver接收到配置信息进行权限验证，然后将数据进行解密。然后，将明文发送到目标主机；当目标主机响应ssserver后，ssserver将接收到的数据进行解包，并将数据加密，发送到ssloacal，sslocal接收到加密后的数据进行解密，再发送给socks5客户端，这样就完成了一次交互。
  优点:
  具有较强的隐匿性，用于混淆数据，并不是加密；
  有较为完善的加密方案，使用的是工业级的加密算法；
  使用的是预共享密钥（pre-shared key, PSK），加密方式是预先定义好的，不需要协商。
  
  缺点:
  没有错误回报机制；
  没有考虑用户鉴别，使得服务端ACL（操作权限）或者流量统计无法实现。
  
  shadowsocks与socks的区别：
  - 隐匿性更好，更加安全；
  - PSK（预共享密钥）,预共享密钥是一个共享密钥，该密钥先前已在两方之间使用某些安全通道共享，然后才需要使用。
  - Access Control List，成为方问控制列表，包含了一个对象或者一条记录可进行何种操作的权限定义。

+ VMess
  VMess是V2Ray原创的加密通讯协议， 是一个基于 TCP 的协议，所有数据使用 TCP 传输。
  
  通讯过程:
  VMess是一个无状态协议，即客户端和服务端无需握手即可直接传输数据，每一次数据传输前和传输后对其他数据没有影响。VMess的客户端发起一次请求，服务器会验证并且判断该请求是否来自一个合法的客户端，如果合法则会转发该请求，并把获取的响应返回给客户端。VMess通过非对称格式，即客户端发出的请求和服务器的响应使用了不同的格式。
  
  与shadowsocks的区别
  - shadowsocks是一个简单的代理工具，而V2Ray 本身是一个内核，V2Ray图形界面客户端大多是调用V2Ray内核套了一个图形界面的外壳，任何开发者都可以利用V2Ray提供的模块开发出新的代理软件；
  - 分流：shadowsocks和V2Ray本身不支持PAC，都是客户端加进去的，shadowsocks分流使用ACL，V2Ray使用自己实现的路由功能；
  - 加密方式：V2Ray（特指VMess协议）不像shadowsocks那样看重对加密方式的选择，并且VMess的加密方式是由客户端指定的，服务器自适应；
  - 时间：V2Ray要保证时间准确，因为这是为了安全设计的；
  - 密码：VMess只有id（使用UUID的格式），作用类似于shadowsocks的密码，但是，随机性远好于shadowsocks的密码，只是不太方便记忆（安全与方便的矛盾）；
  - UDP转发：VMess是基于TCP的协议，对于UDP包V2Ray会转成TCP再传输的。要UDP转发功能在客户端的socks协议中开启UDP转发即可；
  - 路由器翻墙
  
  优点:
  更完善的协议
  更强大的性能，网络性能更好
  更丰富的功能：
  mKCP:KCP 协议在V2Ray上的实现，不必另行安装kcptun
  动态端口：动态改变通信的端口，对抗对长时间大流量端口的限速封锁
  路由功能：可随意设定指定数据包的流向，去广告、反跟踪都可以
  多重代理
  数据包伪装：类似于shadowsocks-rss的混淆，对与mKCP的数据包也可以伪装，伪装常见流量，使得别更困难
  WebSocket协议：可以PaaS平台搭建V2Ray，通过WebSocket代理。也可以通过CDN中转，抗封锁效果更好。
  Mux：多路复用，进一步太高科学上网的并发性能。（将多条TCP连接合成一条，节省资源，提高并发能力）
  
  缺点:
  配置复杂
  产业链不成熟

+ KCP 协议
  运用场景：在网络实时性和可靠性要求比较高的场景下可以考虑kcp协议代替tcp协议。
  KCP是一种具有可靠性的传输ARQ（自动重传）协议，设计是为了解决在网络拥堵的情况下tcp协议网络速度慢的问题。
  
  特点：
  重传机制：数据可靠性和提高传输速度；
  分片存储：当用户数据很大时，大于一个UDP包能承担的范围时（MSS最大分段大小），KCP会将用户数据分片存储在多个KCP包中；
  滑动窗口机制：为了提高发送速度，发送方不必每一个包都等待确认，而是发送多个包出去，然后等待接收方一一确认。然而，接收方不能同时处理无限多的数据，所以需要限制发送方的数据数量。因此，在接收方未确认之前，发送方只能发送wnd大小的数据；
  网络丢包严重可以考虑使用。

#### 2.2.2 搭建步骤

+ [shadowsocketR搭梯子](/docs/software/network/proxy_shadowsockr)
+ [V2ray搭梯子](/docs/software/network/proxy_v2ray)（推荐）
+ [trojan搭梯子](/docs/software/network/proxy_trojan)
+ more to explore

## 3. 问题排查 Troubleshooting

### 3.1 服务器的端口

如ssh 22端口或者SSR端口连不上,其他端口正常，也可以ping通；

解决方式:

防火墙放行端口；
如果是端口冲突就换端口；

### 3.2 服务器的ip黑名单

表现为ping不通，ssh，ssr等都连不上，当然kcptun也无法使用；
注意ping不通并不一定代表ip被屏蔽,因为有些服务器可能禁止了ping,所以也要看具体情况,辅助其他端口和协议来判断;

解决方法：

+ 等待自动解封（几个月）；
+ 使用cloudflare cdn中转服务器流量；
+ 换ip：
  - [现在 Hostwinds 提供免费更换IP了，没错，就是免费，免费，随意更换，可以一键解决 IP 被墙的问题了。](https://www.hostwinds.com/17007.html)

	- 如果用[Vultr](https://www.vultr.com/?ref=7398935)（[目前vultr还可以领取100美金免费体验，点击此处，没有门槛直接用](https://www.vultr.com/?ref=8972472-8H)），可以随时删除服务，重新创建新的服务就会分配新的IP；
  
	- 如果用[搬瓦工，官网地址](https://bandwagonhost.com/aff.php?aff=58544)，需要花点钱几美金就可以换ip，不用删除服务重新创建；
	联系vps服务器服务商；
+ 构建服务器群组，比如采用软路由openwrt，多几个节点，缺点当然是费用高，另外一种方式可以考虑购买现成的服务器群组比如[ButterflyVPN](https://www.youtube.com/watch?v=FeRgNwa0eOA)

被qiang检测：

ping.pe
ipcheck.need.sh

### 3.3 TCP阻断

TCP协议是大部分应用的基础协议，
TCP流量被阻断的表现是：
SSH无法连接，SSR连不上，网站打不开；
但是可以ping通，因为ping不是走TCP而是ICMP协议

解决方法：

安装KCPTUN，可以将TCP流量转成UDP流量（不稳定，但是副作用是可以加速）；
将SSR改为V2ray或者Trojan，V2ray可以将流量设置为mkcp

## 后记-安全使用方法

遵纪守法，老实使用vpn进行学习研究工作，不要搞其他乱七八糟的东西，如果某端口被封就是一种警告，不要做害人害己的事情；

选择小众的国外vps，然后服务器地点也选择一些小众的地址，避免大众热门城市；

不要安装国产杀毒软件/国产浏览器/国产输入法；

避免全流量走海外ip，不然就是找死，全部流量一直访问国外某ip，这不是自投罗网么，ssr客户端全局代理模式，电脑端可以使用GFWList模式，手机端可以只设置浏览器走代理模式；

refer:
https://github.com/githubvpn007/proxy


提问方式：[加我知识星球](https://t.zsxq.com/3BayjMb)；

<disqus/>