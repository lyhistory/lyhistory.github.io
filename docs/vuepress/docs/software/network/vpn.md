---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《vpn梯子基础》

搭梯子或者跳墙是一项古老的体育运动，可以普及计算机理论基础，比如IP TCP UDP协议，ping telent tracert 软路由等工具，正向代理反向代理，流量加密中转等等，
不仅增强了体质，还提升了全民基础科技水平

## 1. 运动理论

### 1.1 服务器的端口

如ssh 22端口或者SSR端口连不上,其他端口正常，也可以ping通；

解决方式就是换端口

### 1.2 TCP阻断

TCP协议是大部分应用的基础协议，
TCP流量被阻断的表现是：
SSH无法连接，SSR连不上，网站打不开；
但是可以ping通，因为ping不是走TCP而是ICMP协议

解决方法：

安装KCPTUN，可以将TCP流量转成UDP流量（不稳定，但是副作用是可以加速）；
将SSR改为V2ray或者Trojan，V2ray可以将流量设置为mkcp

### 1.3 服务器的ip黑名单

表现为ping不通，ssh，ssr等都连不上，当然kcptun也无法使用；
注意ping不通并不一定代表ip被屏蔽,因为有些服务器可能禁止了ping,所以也要看具体情况,辅助其他端口和协议来判断;

解决方法：

+ 等待自动解封（几个月）；
+ 使用cloudflare cdn中转服务器流量；
+ 换ip：

	如果用Vultr（[点击这里去vultr官网领取100美金免费体验](https://www.vultr.com/?ref=7398935)），可以随时删除服务，重新创建新的服务就会分配新的IP；
	如果用[搬瓦工，官网地址](https://bandwagonhost.com/aff.php?aff=58544)，需要花点钱几美金就可以换ip，不用删除服务重新创建；
	联系vps服务器服务商；
+ 构建服务器群组，比如采用软路由openwrt，多几个节点，缺点当然是费用高，另外一种方式可以考虑购买现成的服务器群组比如[ButterflyVPN](https://www.youtube.com/watch?v=FeRgNwa0eOA)

被强检测：

ping.pe
ipcheck.need.sh

## 2. 运动姿势

### 2.1 手动

+ [openvpn](/docs/software/network/vpn_openvpn)
+ [shadowsocketR搭梯子](/docs/software/network/vpn_shadowsockr)
+ [trojan搭梯子](/docs/software/network/vpn_trojan)
+ more to explore

### 2.2 直接买

比如有我个人经常用的
+ ExpressVPN:
  + [ExpressVPN 镜像1](https://tfiflve.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像2](https://upghsbc.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  + [ExpressVPN 镜像3](https://www.expressrefer.com/refer-a-friend/30-days-free?referrer_id=68966376&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)
  
+ StrongVPN：

  + [StrongVPN 镜像1](https://intranet.strongconnectivity.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像2](https://intranet.reliablehosting.com/services/strongvpn/refer/204835b682517019/)
  + [StrongVPN 镜像3](https://intranet.strongvpn.com/services/strongvpn/refer/204835b682517019/)
  + strongvpn legacy download:
      + [windows](https://mirror2.reliablehosting.com/win/StrongVPN_Win-latest.exe)
      + [mac](https://mirror2.reliablehosting.com/mac/StrongVPN_Mac-latest.dmg)
      + [android](https://mirror2.reliablehosting.com/android/1.7.0.apk)

还有开源的[protonvpn](https://protonvpn.com)

可以多参考一些测评,比如[这个](https://10beasts.net/best-vpn-china-en/)


## 3. 运动安全使用方法

### 3.1.遵纪守法，老实使用vpn进行学习研究工作，不要搞其他乱七八糟的东西，如果某端口被封就是一种警告，不要做害人害己的事情；

### 3.2.选择小众的国外vps，然后服务器地点也选择一些小众的地址，避免大众热门城市；

### 3.3.不要安装国产杀毒软件/国产浏览器/国产输入法；

### 3.4.避免全流量走海外ip，不然就是找死，全部流量一直访问国外某ip，这不是自投罗网么，ssr客户端全局代理模式，电脑端可以使用GFWList模式，手机端可以只设置浏览器走代理模式；



## 4.搭建参考

https://github.com/ttlequals0/autovpn

提问方式：[加我知识星球](https://t.zsxq.com/3BayjMb)；

<disqus/>