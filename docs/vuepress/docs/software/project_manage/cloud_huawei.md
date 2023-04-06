---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 产品

+ 虚拟私有云 VPC
+ 专属云 DEC
Dedicated Cloud（以下简称DeC）是华为面向企业、政府、金融等用户，提供计算、存储、网络、管控多级隔离方式的综合解决方案。用户像乘坐“头等舱”一样，享受各种专属服务，如独享自己的资源池，与其他公共租户物理隔离，同时提供企业级维护、迁移、优化服务，满足用户特定业务性能、应用场景以及安全合规的不同要求。
+ 弹性计算服务ECS
+ 裸金属服务 BMS bare metal
+ 专属主机 DEH
    场景：某交易系统需要udp广播，但是华为普通的ECS机器所在的网络的交换机是跟其他租户共用的，所以华为会限流(带宽可以购买，但是这种属于内部线路的而且是广播流量，估计不太好控制，所以只能限流)，以免量大了对其他租户造成影响，造成丢包，这种情况下只能使用专属主机，可以自行设置交换机频段

## 网络

### 虚拟私有云VPC virtual private cloud
you can configure IP address range
faciliates internal network management and configuration and allows you to implement secure and quick network changes, you can also customize the ECS access rule within a security group and between security groups to improve ECS security

华为云可以在同一个子网中跨不同的az可用区，其他的云商一般只能在同一个可用区内创建子网；

产品架构：
https://support.huaweicloud.com/vpc_faq/vpc_faq_0001.html
![](https://support.huaweicloud.com/vpc_faq/zh-cn_image_0000001184839114.png)

规划子网 subnet
https://support.huaweicloud.com/usermanual-vpc/vpc_0001.html

+ 通过VPC对等连接功能，实现同一区域内不同VPC下的私网IP互通。
    同一区域的VPC: 对等连接 https://support.huaweicloud.com/usermanual-vpc/zh-cn_topic_0046655036.html
+ 通过EIP或NAT网关，使得VPC内的云服务器可以与公网Internet互通。
+ 通过虚拟专用网络VPN、云连接、云专线及企业交换机将VPC和您的数据中心连通
    不同区域的VPC: 云连接 https://support.huaweicloud.com/cc/index.html



VPC拓扑：
+ VPC之间：对等网络
+ VPC内部：
    + 子网之间：路由表 三层
    + 子网内部：二层


路由表：
https://support.huaweicloud.com/intl/zh-cn/productdesc-vpc/zh-cn_topic_0038263963.html

DNS云解析服务：
    公网域名
    内网域名
   怎样切换内网DNS？ https://support.huaweicloud.com/intl/zh-cn/dns_faq/dns_faq_005.html

VIP: 虚拟IP
https://support.huaweicloud.com/intl/zh-cn/usermanual-vpc/vpc_vip_0001.html
1. 在华为云的控制台, 添加一个虚拟 IP, 然后绑定 vm1, vm2...vm6 这个 6 台云主机
2. 在其中一台上, 将 vip 配置到网卡上,为虚拟IP地址绑定弹性公网IP或弹性云服务器:
https://support.huaweicloud.com/intl/zh-cn/usermanual-vpc/zh-cn_topic_0067802474.html

但是这个配置不建议配置在网卡的持久化配置里面, 这个 IP 一般都是漂移用的
一般情况下, 都会用比如 keepalived, 或者 Pacemaker 这种集群管理软件去管理

弹性云服务器的网卡绑定虚拟IP地址后，该虚拟IP地址无法ping通时，如何排查？
https://support.huaweicloud.com/intl/zh-cn/vpc_faq/vpc_faq_0083.html

### NAT 网关

### 弹性负载均衡 ELB

+ 使用四层协议的负载均衡，监听器收到访问请求后，将请求直接转发给后端服务器。转发过程仅修改报文中目标IP地址和源IP地址，将目标地址改为后端云服务器的IP地址，源地址改为负载均衡器的IP地址。四层协议连接的建立，即三次握手是客户端和后端服务器直接建立的，负载均衡只是进行了数据的转发。
+ 使用七层协议的负载均衡，也称为“内容交换”。监听器收到访问请求后，需要识别并通过HTTP/HTTPS协议报文头中的相关字段，进行数据的转发。监听器收到访问请求后，先代理后端服务器和客户端建立连接（三次握手），接收客户端发送的包含应用层内容的报文，然后根据报文中的特定字段和流量分配策略判断需要转发的后端服务器。此场景中，负载均衡类似一个代理服务器，分别和客户端以及后端服务器建立连接。

ELB网络流量路径说明 https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/elb_ug_fz_0003_01.html 

企业交换机 https://support.huaweicloud.com/intl/zh-cn/productdesc-esw/esw_pd_0003.html

### 接入方式
#### VPN
#### 云专线 Direct Connect
https://support.huaweicloud.com/productdesc-dc/zh-cn_topic_0032053183.html
#### 云连接（Cloud Connect）
为用户提供一种能够快速构建跨区域VPC之间以及云上多VPC与云下多数据中心之间的高速、优质、稳定的网络能力，帮助用户打造一张具有企业级规模和通信能力的全球云上网络。
https://support.huaweicloud.com/intl/zh-cn/function-cc/index.html

#### 全球加速服务 GA
https://support.huaweicloud.com/intl/zh-cn/productdesc-ga/ga_01_0001.html

### WAF

浏览器/App => CDN或高防等代理 => Web应用防火墙 => 源站服务器

![](/docs/docs_image/software/project_manage/cloud/cloud_huawei_waf.png)

### 流量路径

#### 业务流量
https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/elb_ug_fz_0003_01.html#elb_ug_fz_0003_01__zh-cn_topic_0166333709_section133601141145610

**从公网进入的流量**

![](https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/zh-cn_image_0000001181376003.png)

从互联网进入的流量, 主要是访问VPC-COM中的应用, 如WEB等, 这些应用需要开放给互联网用户, 进入的流量首先云防火墙(IPS), 可以过滤掉恶意网络攻击流量, 再经过 VPC-FWOUT 的安全组的访问控制, 最后经过CheckPoint防火墙进行DNAT操作才能访问到目标服务器. 

example: www.lyhistory.com 云解析到 cdn
浏览器=》cdn=》waf地址池=》负载均衡器elb 公网地址<只开放访问给waf地址池>（ELB NAT到内网，后端指向防火墙服务inbound）=》 再转到内部http负载均衡器=》源服务器，

**访问公网的出去的流量**

![](https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/zh-cn_image_0000001135576398.png)

云上的云服务器要访问Internet资源, 需要先经过虚拟私有云VPC-COM中的proxy服务器(趋势科技), 再经过VPC-FWOUT中的安全组规则, 最后经过CheckPoint防火墙做SNAT后进入互联网.

example：
VPC-COM内网ecs实例机器访问google.com，内网路由表没有google.com对应的内网路径，所以路由匹配 0.0.0.0 走华为云的对等连接peering-com-fwout 到VPC-FWOUT，该VPC-FWOUT的路由表 **rtb-VPC-FWOUT**  0.0.0.0下一跳类型为虚拟IP--该虚拟ip是绑定到子网subnet-fwout，而子网subnet-fwout可以直接绑定ECS实例：ecs-fwout (上面运行防火墙服务比如checkpoint) ，最后经过防火墙进行DNAT操作才能访问到目标服务器. 

#### 运维流量

外部=》互联网=》[华为云]（VPN=》ssh=》云资源）
office=》AD域控=》[华为云]（堡垒机=》ssh/rdp=》云资源）

## 创建OS
硬盘加密，否则华为可以直接看到所有数据

## PASS产品
ECS

## 主机安全 Host Security Service
https://www.huaweicloud.com/product/hss.html

## 安全合规

[华为云零信任能力成熟度模型白皮书](https://res-static.hc-cdn.cn/cloudbu-site/china/zh-cn/TrustCenter/WithePaper/HUAWEICLOUD_ZTCMM.pdf)

安全组

[Cloud Certificate Manager，CCM](https://www.huaweicloud.com/intl/zh-cn/product/scm.html?agencyId=5e86556c08824ce6802d7aaf127f33a7&region=ap-southeast-3)


云防火墙 CFW

https://github.com/huaweicloudDocs