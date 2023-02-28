---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《vpn梯子基础》

## 0. 序言
本文对象是明辨是非的研究者，请不要做中国法律规定范围之外的事情，
由于特殊的国情，我国屏蔽了一些海外的网络服务，作为IT从业者为了工作学习不得不通过一些技术手段访问海外服务，这种手段俗称：翻:)(:墙、梯子、科学上网，本文纯粹从技术角度出发普及计算机理论基础，比如IP TCP UDP协议，ping telent tracert 软路由等工具，正向代理反向代理，流量加密中转等等，

通常有两种常用方式：
+ VPN:)(:翻墙
+ Proxy server代理上网

[具体原理参考](/docs/software/network/network.html)

+ 推荐小白直接使用下面的现成产品即可；
+ 对于有基本知识或勇于尝试的同学们推荐机场：[传送前去机场](/docs/software/network/vps.html)

## 1. VPN:)(:翻墙

VPN的全名是virtual private network，缩写：VPN，是常用于连接中、大型企业或团体间私人网络的通讯方法。它利用隧道协议（Tunneling Protocol） 来达到发送端认证、消息保密与准确性等功能。值得注意的是VPN诞生的原因并不是为了翻墙，只是一些公司与公司间的网络通讯方式

### 1.1 现成产品(推荐小白使用)
购买之后直接安装使用，

比如有我个人经常用的
+ StrongVPN(推荐，一直比较稳)：

  + [StrongVPN 镜像1](https://intranet.strongconnectivity.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像2](https://intranet.reliablehosting.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像3](https://intranet.strongvpn.com/services/strongvpn/refer/204835b682517019/)
  + strongvpn legacy download:
      + [windows](https://mirror2.reliablehosting.com/win/StrongVPN_Win-latest.exe)
      + [mac](https://mirror2.reliablehosting.com/mac/StrongVPN_Mac-latest.dmg)
      + [android](https://mirror2.reliablehosting.com/android/1.7.0.apk)


+ ExpressVPN(最近不稳定):
  + [ExpressVPN 镜像1](https://tfiflve.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像2](https://upghsbc.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像3](https://www.expressrefer.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  

+ 还有开源的[protonvpn](https://protonvpn.com) (暂未尝试)

### 1.2 自行搭建(不推荐小白)

[OpenVPN](/docs/software/network/vpn_openvpn)

## 2. Proxy server代理上网

### 2.1 现成产品 - 力荐！Just My Socks（推荐小白)

justmysocks 是搬瓦工官方提供的优质 V2Ray / V2Fly 服务和 Shadowsocks 服务，质量最好的 CN2 GIA 线路，月付仅 $5.88 起，更有高达 5G 带宽的 CN2 GIA 线路可选！被墙自动换 IP，无须担心 IP 被墙

justmysocks 不同于那些国人的机场，justmysocks 是搬瓦工官方背书的，数据安全是绝对靠谱放心的。

+ [Just My Socks 官网镜像1](https://justmysocks5.net/members/aff.php?aff=25045)
+ [Just My Socks 官网镜像2](https://justmysocks3.net/members/aff.php?aff=25045)
+ [Just My Socks 官网 (已被墙)](https://justmysocks.net/members/aff.php?aff=25045)

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
+ [V2ray搭梯子](/docs/software/network/proxy_v2ray)
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