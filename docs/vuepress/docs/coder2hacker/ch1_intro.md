---
sidebar: auto
sidebarDepth: 2
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/coder2hacker)  《Chapter 1．道德黑客和渗透测试介绍》

```
                                                                                   
.oPYo.             8              .oPYo.  o    o               8                   
8    8             8                  `8  8    8               8                   
8      .oPYo. .oPYo8 .oPYo. oPYo.    oP' o8oooo8 .oPYo. .oPYo. 8  .o  .oPYo. oPYo. 
8      8    8 8    8 8oooo8 8  `' .oP'    8    8 .oooo8 8    ' 8oP'   8oooo8 8  `' 
8    8 8    8 8    8 8.     8     8'      8    8 8    8 8    . 8 `b.  8.     8     
`YooP' `YooP' `YooP' `Yooo' 8     8ooooo  8    8 `YooP8 `YooP' 8  `o. `Yooo' 8     
:.....::.....::.....::.....:..::::.......:..:::..:.....::.....:..::...:.....:..::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                                                                   
8        8       o          o                                                      
8        8                  8                                                      
8 o    o 8oPYo. o8 .oPYo.  o8P .oPYo. oPYo. o    o    .oPYo. .oPYo. ooYoYo.        
8 8    8 8    8  8 Yb..     8  8    8 8  `' 8    8    8    ' 8    8 8' 8  8        
8 8    8 8    8  8   'Yb.   8  8    8 8     8    8    8    . 8    8 8  8  8        
8 `YooP8 8    8  8 `YooP'   8  `YooP' 8     `YooP8 88 `YooP' `YooP' 8  8  8        
..:....8 ..:::..:..:.....:::..::.....:..:::::....8 ..::.....::.....:..:..:..       
::::ooP'.:::::::::::::::::::::::::::::::::::::ooP'.:::::::::::::::::::::::::       
::::...:::::::::::::::::::::::::::::::::::::::...:::::::::::::::::::::::::::       
```



## 前言

笔者从业十年，从中国的外企到东南亚的本地的MNC公司以及到中国出海到东南亚的金融公司，从前端做到后端，从单机服务到分布式微服务，从框架使用到框架设计，体，验了不同公司的安全策略，
在没有接触到渗透测试之前，最初对于安全的认知只停留在公司在应对黑客攻击的一些基本手段：

最开始的经验是其中一家公司遭遇黑客攻击，那时候我还是普通的入门级开发者，停留在到处拿市面上的plugin使用，甚至是直接复制粘贴一段上传文件的后端代码，完全没有代码审计，只有QA测试一下，
长期不写代码的项目经理偶尔会扫几眼所谓code review，第一次公司遇到黑客攻击，黑客还留了个信息，意思是控制了我们的服务器，需要我们付费，否则会做破坏性的操作，当然我们后来没有付钱，
因为我们分析大概确定黑客并没有控制我们核心的数据库所在服务器，只是控制了一个跳板机，当然那时候我没有权限去跟项目经理讨论这些东西，我自己也没有生产环境的权限，
后来大概了解我们的补救措施也只是加强了权限控制和端口的控制，并且我记得我们的数据库权限控制很严格，不仅仅是从服务器层面的控制，还有从应用层面，禁止了所有账号的CRUD操作，
只允许特定用户通过存储过程进行操作。

后来我进入了东南亚某国一家受金融管理局监管的交易所，我接触到了可谓是网络架构十分复杂的一家企业，两个数据中心异地双活，网络分区十分严格，多条专用通信线路，层层防火墙，
连公司内部使用的电脑也是要定期打补丁，然后硬盘加固实时扫描，公司开发的软件也是会请专业的渗透测试公司提供检测。

大公司的安全性未必高于小公司：

通过上面的简单介绍，也许很多人会认为下面这家公司的安全等级要比前一家公司高，其实也是未必的：
首先第一家公司的核心逻辑基本都在数据库，基本上只要数据库的安全保障做的好，并且存储过程逻辑严密的话，基本上不太会有大问题，然后数据库管理员就请了三位资深的专业DBA，
总体来说虽然没有那么高级别的网络架构，还是相对比较安全的。
而第二家公司首先是为数不多的交易所，本来目标就很大，相对更容易吸引黑客，虽然说网络架构十分高大上，但是业务逻辑比较分散在多个网络分区，实际上各个分区之间并非完全不可以互相访问，
所以任何一个分区的服务有漏洞都会给整个网络带来危险，虽然公司请了专业的渗透测试公司做了检测，但是后面也会谈到这些公司做检测是跟黑客攻击还是有很大区别的，基本只能是检测常见常规的漏洞，
而且受限于不可以在渗透测试的时候影响生产环境，束手束脚，而黑客则不会管是否会造成生产环境的瘫痪。


短板效应明显：

企业安全是要方方面面的，水桶理论非常适合安全领域，任何一块短板都可能会让水大量漏出；
比如即使数据中心足够安全，由于公司内部办公环境不够安全，外来访客跟公司财务共用wifi，公司机器可以随意插入外来U盘，公司非IT部门被邮件钓鱼，公司客服被社工等等，可见人是很大的漏洞；
现在很多扫描工具做漏洞的自动检测，但是很难检测出逻辑上的漏洞，逻辑上的漏洞是由编程开发人员的水平决定的，水平高的人犯错可能会少但是未必会小；

软件架构的复杂性：

即使一个公司内部网络架构及其严密，但是由于依附于其上的软件产品是要想外部提供服务的，由于软件架构的复杂度很高，即使是外包给专业的软件公司来做，软件公司也不可能每个轮子都自己制造，
必然会参考和引入大量的开源软件和框架，一个软件产品的开发即使按照CMMI的标准严格执行，也很难确保每一个组件都是被正确的使用，比如某个组件配置的疏忽，比如忘记禁用一个内置monitor，造成向外部暴露了不必要的endpoint，
某个异常没有处理好，向外部暴露了内部的参数信息，甚至是某几个组件的组合刚好引入了一个利用链条，给黑客以可乘之机

web安全的复杂性：

如今几乎任何软件产品都离不开web应用的身影，电子商务网站，企业门户网站，数据API接口，手机app和富客户端桌面程序也是要通过各种web协议访问后台服务，即使iot设备也一样需要通过web协议跟基站通信

从上面简单的分析就可以看出软件产品安全的复杂性，一个公司内部的网络架构和软件架构都是相当复杂的，任何软件产品都少不了web应用，只要是有所谓线上服务，web应用必然会存在，
不管是以何种方式：web页面，web api，web组件等等，安全不仅仅是停留在网络架构层面，即使在数据中心花费了巨额的投入和精力，在web应用上面的一点漏洞也会使之功亏一篑；

系统安全永远处于攻守的动态之中

## 道德黑客、渗透测试、红队测试区别

简单概况，黑帽黑客就是以牟取钱财或所谓名气为目的进行非法入侵网络的反派，其中以使用工具脚本进行破坏性入侵的称为骇客或craker，
白帽黑客则是正面角色，白帽黑客又称道德黑客，ethical hacker，白帽黑客也可以为了获取经济收益而合法“入侵”网络，寻找漏洞并上报给相应厂商，
当然也会存在着不为名利只为维护网络的英雄，这些名词基本都是来源于美国西部片，通常是以白帽和黑帽表示正邪两派，而在这黑白的交接处还有一个灰帽子，
其实黑帽和白帽本来也很难做出界限区分，有人曾经是黑帽然后通过加入正规安全团队等方式“变成”白帽，有些白帽黑客也会在未授权的情况下进行渗透入侵，
尤其是针对一些黄赌毒的网站，更是灰色中的灰色，所以跟电视剧里的黑白分明不同，现实世界总是复杂的；

白帽黑客可以是自由职业，也可以通过渗透测试认证，加入公司组织的安全团队，称为渗透测试人员，
渗透测试是公司或组织机构在经过客户公司或组织机构委托授权的情况下，在约定的测试范围内根据测试要求对授权的测试标的进行安全漏洞检测，并最终提供渗透测试结果报告，并对漏洞给出修复意见；

渗透测试分为黑盒、白盒、灰盒测试，取决于甲方公司跟受聘渗透测试团队的约定，是否提供内部相应资料；

Black box Testing:
Advantage: the most realistic simulation of a hacker trying to break, or break into, a system;
Disadvantage: tend to be unnecessarily time consuming for the tester and therefore expensive for the stakeholder.

例子：fuzz测试

White box Testing:
Advantage: very time efficient for the tester
Disadvantage: usually not a realistic simulation of a hacker attack since the tester has inside knowledge of the system;

例子：代码审计

Gray box Testing:
Advantage: a good balance between a realistic hacker attack and saving time by providing the tester with some inside knowledge of how the target system works.
Disadvantage: the tester might not have access to the source code of the target application or other important bits of information.

例子：逆向工程

渗透测试通常是找出尽量多的漏洞，而红队测试则一般是攻击特定的目标，比如某公司的财务报表或者某台机器上的某个资料，
红队是模拟现实中可能受雇的黑客的行为，除了攻击特定目标，还能测试公司的安防措施（阻断（prevention）、检测（detection）和响应（response）），
通常渗透测试不会采用社工方式，但是红队可以采用一切有效方式甚至是物理接触的方式以达到目的；

有红队自然有蓝队，红队是矛，蓝队是盾，蓝队是构建公司安全防御系统，提升安防能力的团队，红队的作用是为了训练蓝队；

渗透测试的原则 C.I.A:
+ Confidentiality aims to prevent sensitive information from falling into the wrong hands. Credit card data, medical records, and usernames/passwords are three examples of such information.
When the confidentiality of a system has been violated, the information owner must(or a least should) do his best to limit the damage done.
+ Integrity seeks to prevent information from being altered by unauthorized users. An example would be an online-ecommerce system where a customer can view,
and change, the order information of other customers without leaving any trace of doing so. When the integrity of a system has been violated, 
the information it processes can no longer be fully trusted.
+ Availability aims to keep information accessible when it is needed. Power outages or distributed denial of service(DDOS) are two examples of how the availability of a system can be affected.
When the availability of a system has been violated, the system can no longer perform its intended function.

the idea behind the CIA concept is that all three aspects must be taken into consideration while trying to maintian an acceptable security level.
Not all three aspects are equally important for every kind of system, and some systems may do just fine without one or even two of them, 
but system owners should always consider all three.


#SRC挖洞
正是由于前面提到的web应用风险，很多企业都会采取组建自己的安全团队，有些还会组建src security response center，安全应急反应中心，用于响应漏洞入侵，以及向有能力的黑客提供奖励；
，同时各大厂商也提供奖励给发现漏洞的白帽黑客，当然每家的要求和奖励评分各不相同
有的公司也会将这种漏洞查找的奖励外包给一些专业的漏洞平台，比如阿里先知等等
https://security.alibaba.com/
https://security.tencent.com/
https://security.360.cn/en/

https://www.google.com/about/appsecurity/reward-program/index.html



## 开源渗透测试方法

1.OSSTMM开源手册
2.NIST SP 800-42网络安全测试指南
3.OWASP十大Web应用安全威胁项目
4.Web安全威胁分类标准
5.PTES渗透测试执行标准
www.pentest-standard.org
渗透测试过程：
Pre-Engagement Interaction
Information Gathering
Threat Modeling
Vulnerability Analysis
Exploitation
Post Exploitation
Reporting

## 基本渗透思路 Phases of Peneration Testing

Every penetration test, be it for a network or a web application, has a workflow; it has a series of stages that should be completed in order to increase our chances of finding and exploiting every possible vulnerability affecting our targets, such as: 

### Reconnaissance / Profiling the Web Server

Gatering preliminary data or intelligence on your target.

### Enumeration / Scanning
Application of technical tools to gather further inteligence

### Exploitation / Gaining Access
Taking control of one or more network devices or application

### Maintaining access 
Steps involved in being able to be persistently within the target environment

### Cleaning tracks / Covering tracks
Attacker must take the steps necessary to remove all traces of detection.



