---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《vpn梯子基础》

如有疑问可以[加我知识星球](https://t.zsxq.com/3BayjMb)一对一指导；

## 1.防火墙(你懂的)强的方法:

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
将SSR改为V2ray或者Trojan，V2ray可以将流量设置为mkcp，

### 1.3 服务器的ip被强

表现为ping不通，ssh，ssr等都连不上，当然kcptun也无法使用；

解决方法：

+ 等待自动解封（几个月）；
+ 使用cloudflare cdn中转服务器流量；
+ 换ip：

	如果用Vultr（[点击这里去vultr官网领取100美金免费体验](https://www.vultr.com/?ref=8491735-6G)），可以随时删除服务，重新创建新的服务就会分配新的IP；
	如果用[搬瓦工，官网地址](https://bandwagonhost.com/aff.php?aff=58544)，需要花点钱几美金就可以换ip，不用删除服务重新创建；
	联系vps服务器服务商；


被强检测：

ping.pe
ipcheck.need.sh


## 安全使用方法：

1.遵纪守法，老实使用vpn进行学习研究工作，如果某端口被封就是一种警告，不要做害人害己的事情；

2.选择小众的国外vps，然后服务器地点也选择一些小众的地址，避免大众热门城市；

3.不要安装国产杀毒软件/国产浏览器/国产输入法；

4.避免全流量走海外ip，ssr客户端全局代理模式，电脑端可以使用GFWList模式，手机端可以只设置浏览器走代理模式；