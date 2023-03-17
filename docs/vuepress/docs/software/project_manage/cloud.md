---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 云商
+ [Huawei Cloud](/docs/software/project_manage/cloud_huawei)
+ [Google Cloud](/docs/software/project_manage/cloud_google)
+ [AWS Cloud](/docs/software/project_manage/cloud_aws)

## 云分类
+ 私有云 Private Cloud
+ 虚拟私有云 VPC
+ 公有云
+ 混合云 
+ 专属云 DEC
    Dedicated Cloud（以下简称DeC）是华为面向企业、政府、金融等用户，提供计算、存储、网络、管控多级隔离方式的综合解决方案。用户像乘坐“头等舱”一样，享受各种专属服务，如独享自己的资源池，与其他公共租户物理隔离，同时提供企业级维护、迁移、优化服务，满足用户特定业务性能、应用场景以及安全合规的不同要求。
+ 弹性计算服务ECS
+ 裸金属服务 BMS bare metal
+ 专属主机 DEH

公有云（多租户） =》 私有云（单租户）=》虚拟私有云 VPC（多租户）

首先从服务的角度来看，虚拟私有云 VPC指的是一种云（Cloud），这与它的字面意思相符。对于基础架构服务（IaaS），云就是指资源池。你或许听过公有云（Public Cloud）、私有云（Private Cloud）、混合云（Hybrid Cloud）。不过，VPC不属于这三种云中任一种。这是一种运行在公有云上，将一部分公有云资源为某个用户隔离出来，给这个用户私有使用的资源的集合。VPC是这么一种云，它由公有云管理，运行在公共资源上，但是保证每个用户之间的资源是隔离，用户在使用的时候不受其他用户的影响，感觉像是在使用自己的私有云一样。
从这种意义上看，VPC不是网络，我们可以对比VPC和它一个字面上相近的概念：VPN（Virtual Private Network）。VPN在公共的网络资源上虚拟隔离出一个个用户网络，例如IPsec VPN可以是在互联网上构建连接用户私有网络的隧道，MPLS VPN更是直接在运营商的PE设备上划分隔离的VRF给不同的用户。从提供服务的角度来，说如果VPC指的只是网络的话，那它跟VPN的概念是重复的。所以，从公有云所提供的服务来说，VPC应该理解成，向用户提供的隔离资源的集合。

ECS经典网络与专有网络VPC特点介绍
https://help.aliyun.com/document_detail/160096.html?spm=5176.19540786.0.0.c2904689sczbCL


私有云、公有云、专属云间的商业逻辑
https://bbs.huaweicloud.com/blogs/114839

专属主机与专属云区别：
场景方面
专属云可以配套专属分布式存储、专属企业存储、专属裸金属服务器等专属服务，提供完整的资源隔离方案。

专属主机则只能提供计算隔离主机，使用更灵活，适合对计算资源隔离、使用灵活性有要求的客户。

功能方面
专属云需要独立开通专属云帐号，专属云资源和公共ECS属于不同VPC，虚拟机不能相互迁移。

专属主机上创建的虚拟机和公共ECS属于同一VPC，虚拟机可以相互冷迁移。

专有宿主机DDH（Dedicated Host），指由一个租户独享物理资源的云主机。作为该云主机的唯一租户，您不需要与其他租户共享云主机所有物理资源。您还可以获得这台物理服务器的物理属性信息，包括CPU数量（Socket数）、物理CPU核数、内存大小，并根据宿主机规格创建指定规格族的ECS实例，基于虚拟化技术的云服务器。

弹性裸金属服务器（ECS Bare Metal Instance，简称为EBM）是一款同时兼具虚拟机弹性和物理机性能及特性的新型计算类产品，是基于阿里云完全自主研发的下一代虚拟化技术而打造的新型计算类服务器产品


## 安全：
TLS:
应用之间;


## VPN (IPSEC vs MPLS)
### IPSEC
Traditionally, the biggest obstacle standing in the way of more widespread adoption of cloud services has been security. While many organizations focus on whether a cloud service provider is capable of keeping data secure, the connection between the organization and the cloud is at least as critical to security. An unsecured Internet connection is a major weakness that can be easily infiltrated.
A virtual private network (VPN) is viewed as the solution to this problem because it provides a secure pipeline to the cloud. There are two main types of VPNs. An IPSec VPN uses encryption protocols to securely transport data packets via the public Internet. 

IPSEC:
+ point-to-site VPN network connection via a public network,
+ site-to-site VPN connection across region and countries;
+ point-to-point IPSEC VPN can also be implemented for connecting an internal workstation to another internal workstation;

### MPLS
However, the public Internet isn’t capable of distinguishing and prioritizing different applications.
This can cause problems when dealing with a number of different applications, especially real-time applications that are delay-sensitive. Because IPSec was designed to encrypt traffic between two fixed sites, there is less network capacity for application traffic, resulting in congestion when users are dispersed across multiple sites. As a result, this approach requires costly additional connections and complex configurations to handle peak traffic.

VPNs based upon Multi-Protocol Label Switching (MPLS), on the other hand, are set up over service provider backbones and support additional security. With MPLS VPNs, data packets are prioritized according to application performance metrics. Traffic can be automatically re-routed in milliseconds and encryption is not required. As we discussed in a previous post, this ensures that Quality of Service (QoS) requirements are met for multimedia applications such as voice and video.
MPLS VPNs are also ideal for cloud connectivity and to support mobile users. Because they provide infrastructure redundancy, Class of Service (CoS) capabilities for prioritizing traffic, any-to-any connectivity and single-operator management, they create an enterprise-class application networking platform on top of a secure transport mechanism.

Private leased line (also known as MPLS) :
can be use to connect between a Cloud Service Provider and the company on-premise.

[MPLS简介](https://bbs.huaweicloud.com/blogs/313996)


## 云专线 Direct Connect

用于搭建用户本地数据中心与云VPC之间高速、低时延、稳定安全的专属连接通道，充分利用云服务优势的同时，继续使用现有的IT设施，实现灵活一体，可伸缩的混合云计算环境。

