---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

公有云（多租户） =》 私有云（单租户）=》虚拟私有云 VPC（多租户）

首先从服务的角度来看，虚拟私有云 VPC指的是一种云（Cloud），这与它的字面意思相符。对于基础架构服务（IaaS），云就是指资源池。你或许听过公有云（Public Cloud）、私有云（Private Cloud）、混合云（Hybrid Cloud）。不过，VPC不属于这三种云中任一种。这是一种运行在公有云上，将一部分公有云资源为某个用户隔离出来，给这个用户私有使用的资源的集合。VPC是这么一种云，它由公有云管理，运行在公共资源上，但是保证每个用户之间的资源是隔离，用户在使用的时候不受其他用户的影响，感觉像是在使用自己的私有云一样。
从这种意义上看，VPC不是网络，我们可以对比VPC和它一个字面上相近的概念：VPN（Virtual Private Network）。VPN在公共的网络资源上虚拟隔离出一个个用户网络，例如IPsec VPN可以是在互联网上构建连接用户私有网络的隧道，MPLS VPN更是直接在运营商的PE设备上划分隔离的VRF给不同的用户。从提供服务的角度来，说如果VPC指的只是网络的话，那它跟VPN的概念是重复的。所以，从公有云所提供的服务来说，VPC应该理解成，向用户提供的隔离资源的集合。

ECS经典网络与专有网络VPC特点介绍
https://help.aliyun.com/document_detail/160096.html?spm=5176.19540786.0.0.c2904689sczbCL

专有宿主机DDH（Dedicated Host），指由一个租户独享物理资源的云主机。作为该云主机的唯一租户，您不需要与其他租户共享云主机所有物理资源。您还可以获得这台物理服务器的物理属性信息，包括CPU数量（Socket数）、物理CPU核数、内存大小，并根据宿主机规格创建指定规格族的ECS实例，基于虚拟化技术的云服务器。

弹性裸金属服务器（ECS Bare Metal Instance，简称为EBM）是一款同时兼具虚拟机弹性和物理机性能及特性的新型计算类产品，是基于阿里云完全自主研发的下一代虚拟化技术而打造的新型计算类服务器产品


安全：
TLS:
应用之间;


IPSEC:
point-to-site VPN network connection via a public network,
site-to-site VPN connection across region and countries;
point-to-point IPSEC VPN can also be implemented for connecting an internal workstation to another internal workstation;

Private leased line (also known as MPLS) :
can be use to connect between a Cloud Service Provider and the company on-premise.



