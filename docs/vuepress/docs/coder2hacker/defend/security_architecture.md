---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[Center of Internet security](https://www.cisecurity.org/cis-benchmarks/)

Security reference architecture based on Technology Risk Management - TRM

example: 零信任模型 Zero trust model
+ [华为云零信任能力成熟度模型白皮书](https://res-static.hc-cdn.cn/cloudbu-site/china/zh-cn/TrustCenter/WithePaper/HUAWEICLOUD_ZTCMM.pdf)
+ [AWS Security Reference Architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html)

## 人员安全

+ 身份标签管理
+ 持续身份认证
+ 动态权限管理
+ 特权账号管理

### IAM
[Difference between Active directory and Identity and Access managment](https://stackoverflow.com/questions/43987531/difference-between-active-directory-and-identity-and-access-managment)


## 设备安全
+ 设备属性管理
+ 设备动态访问
+ 设备合规
+ 终端设备保护

## 网络安全
### 微分段
[微分段](https://info.support.huawei.com/info-finder/encyclopedia/zh/%E5%BE%AE%E5%88%86%E6%AE%B5.html)
在传统的数据中心网络中，普遍认为数据中心网络内部的流量是安全的，外部的流量是不安全的。因此，通常在网络内、外部的边界部署防火墙，对进、出网络的流量（即南北向流量）进行分析和处理。这种在边界设备上对流量进行安全分析的技术，也称为边界安全技术。

随着数据存储、应用的不断增多， 数据中心网络流量从以前的南北向流量为主转变为东西向流量为主，这样对内部流量进行安全管控就变得尤为重要。一旦攻击者冲破边界防护，那么数据中心内部的安全将受到严重威胁，攻击者可以随意攻击数据中心内部的服务。因此在云化的数据中心内部，需要针对数据中心内外部的流量做全面的防护，如果将数据中心内部虚拟机间的流量全部绕行集中式防火墙，很难满足数据中心灵活分布式、可扩展部署的要求和挑战，容易形成性能和扩容的瓶颈。

微分段可以提供比子网粒度更细的分组规则，并对数据中心的内部网络进行分组，然后对所有分组之间的流量部署安全策略。这样就可以实现更精细的业务策略控制，限制攻击行为在网络内部横向移动的能力，以增强安全性。这就类似于我们将船体分成若干个相互隔离的独立船舱，能保证因破损造成某一船舱进水时，不会波及其他船舱而导致整船进水，从而提高船舶的抗沉性。

**微分段与VLAN、ACL、防火墙对比**
网络分段不是新技术，传统网络通常依赖防火墙、虚拟局域网（VLAN）和访问控制列表(ACL)用于网络分段，对业务流量进行隔离。但是这些技术存在其局限性：

+ VLAN子网隔离：
    VLAN只能基于子网进行隔离，其不能实现同一子网内不同服务器之间的隔离，是一种非常粗糙的分段方式。
+ 配置ACL
    配置ACL规则可以实现不同服务器之间的隔离。但是数据中心网络中，服务器的数量非常庞大，若要实现服务器之间的隔离，则需要部署海量的ACL规则，配置维护相当复杂。同时，网络设备的ACL资源有限，不能满足客户部署海量ACL规则的需求。
+ 防火墙
    - 数据中心一般只在对外的网络边界上设置防火墙，因为原则上认为入侵风险来自于外部，数据中心内部是相对安全的。理论上，也可以在数据中心内每个互联节点上部署防火墙来进行内部隔离，但是这需要部署大量的防火墙，是一笔很大的硬件投资，而且防火墙的设置和维护也是一个巨大的工作量。
    - 虚拟化技术的应用使得安全的边界难以界定，如果将数据中心内部虚拟机之间的流量全部引到防火墙设备上集中分析，很难满足数据中心灵活分布式、可扩展部署的要求和挑战，容易在性能和扩容等方面形成瓶颈

而微分段可以提供更细粒度、更灵活的分段方式。微分段定义强调“微”和“分段”。
+ “微”是相对于“物理网络分段”（基于广播域VLAN/VNI划分子网）而言的，相比“物理网络分段”，微分段粒度更细，因为它可以基于IP地址、IP网段、MAC地址、VM名等细粒度来分段，即属于相同VLAN的不同设备之间也能实现相互隔离。
+ “分段”是指将网络按照一定的分组规则划分为若干个子网络，不同子网络之间通过策略控制流量，从而实现数据报文仅能在约定的节点之间相互发送，而不是发送给所有节点。

微分段借鉴了安全设备Security Zone的概念，将数据中心业务单元按照一定的原则分组，然后通过分组间策略实现流量控制。微分段基于以下两个元素实现精细分组隔离：
+ EPG（End Point Group）：基于IP地址、MAC地址、VM名、应用等分组策略，对服务器、虚拟机等承载业务的实体进行的分组。
+ GBP（Group Based Policy）：基于EPG分组的流量控制策略，规定了分组内部、分组之间的流量控制策略。

### 双向传输安全
### 威胁防护
### 软件定义边界 SDP

## 工作负责/应用安全

+ 应用安全访问
+ 开源与第三方安全
+ DevSecOps
+ 安全配置

## 数据安全

+ 数据发现与分类
+ 数据脱敏
+ 数据防泄露
+ 数据血缘

## todo

### Endpoint Detection and Response - EDR 
also referred to as endpoint detection and threat response (EDTR), is an endpoint security solution that continuously monitors end-user devices to detect and respond to cyber threats like ransomware and malware.

### DDOS
[About Anti-DDoS](https://support.huaweicloud.com/intl/en-us/antiddos_faq/antiddos_01_0018.html)

DDoS全称:分布式拒绝服务(DDoS:Distributed Denial of Service)，该攻击方式利用目标系统网络服务功能缺陷或者直接消耗其系统资源，使得该目标系统无法提供正常的服务。攻击者进行拒绝服务攻击，实际上让服务器实现两种效果：一是迫使服务器的缓冲区满，不接收新的请求；二是使用IP欺骗，迫使服务器把合法用户的连接复位，影响合法用户的连接。CC攻击全称Challenge Collapsar，中文意思是挑战黑洞，因为以前的抵抗DDoS攻击的安全设备叫黑洞，顾名思义挑战黑洞就是说黑洞拿这种攻击没办法，新一代的抗DDoS设备已经改名为ADS(Anti-DDoS System)，基本上已经可以完美的抵御CC攻击了。CC攻击的原理是通过代理服务器或者大量肉鸡模拟多个用户访问目标网站的动态页面，制造大量的后台数据库查询动作，消耗目标CPU资源，造成拒绝服务。

DDoS攻击打的是网站的服务器，而CC攻击是针对网站的页面攻击的，用术语来说就是，一个是WEB网络层拒绝服务攻击（DDoS），一个是WEB应用层拒绝服务攻击（CC）。CC攻击模拟用户对一些比较消耗资源的网页进行攻击，而DDoS攻击则是针对ip进行攻击，两者的危害也是不一样的，DDoS的攻击会比CC攻击更难防御，造的危害会更大

DDOS attack DNS
A DNS flood is a type of distributed denial-of-service attack (DDoS) where an attacker floods a particular domain's DNS servers in an attempt to disrupt DNS resolution for that domain.