---
sidebar: auto
sidebarDepth: 2
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/coder2hacker)  《Chapter 2．网络基础和web技术》

## 1.网络

### 1.1 网络基础

详解具体参考：
+ [网络基础](/docs/software/network/network)
+ [Github系列网络事件记录](/docs/software/network/network2github)
	

网络分层根据协议栈有四层五层七层的不同分法

+ Layer 5: Application
+ Layer 4: Transport
+ Layer 3: Network/Internet
+ Layer 2: Data Link
+ Layer 1: Physical


比较早的layer1是采用hub技术，容易浪费带宽，比如A和B两台机器上面运行不同的服务，外面请求进来的时候，采用hub技术就要盲目广播，浪费带宽；
而采用layer2的交换机技术，由于交换机会学习mac地址（arp mapping），大大降低了广播的浪费；
而layer3进一步采用ip网段隔开不同的分区，根据外部请求的ip可以准确的找到不同的网关；
layer4则是负责为信源和信宿提供应用程序进程间的数据传输服务，这一层上主要定义了两个传输协议，传输控制协议即TCP和用户数据报协议UDP；
layer5支持网络应用，应用协议仅仅是网络应用的一个组成部分，运行在不同主机上的进程则使用应用层协议进行通信。主要的协议有：http、ftp、telnet、smtp、pop3等

我们通过抓包工具，比如：
chrome的开发者工具，通常抓的都是简单的应用层的包，比如http请求，web socket等；
而通过重量级的抓包工具比如wireshark，通常是抓取从物理层到应用层的所有信息：

·Frame: 物理层的数据帧概况

·Ethernet II: 数据链路层以太网帧头部信息

·Internet Protocol Version 4: 互联网层IP包头部信息

·Transmission Control Protocol: 传输层T的数据段头部信息，此处是TCP

·Hypertext Transfer Protocol: 应用层的信息，此处是HTTP协议

### 1.2 网络架构

#### 1.2.1 经典CS/BS架构
B代表browser，c代表client
client-server架构是最常见的，S自然是server，实际上现在BC没有太大的区分，比如手机app也就是一种富客户端，本质也就是一种浏览器，
跟服务端的通信都可以通过抓包工具抓取；
而server服务端最基本的就是一个普通计算机，上面运行特定的程序，比如各种web host软件，如php host：apache/PHP study等，asp.net或web api host：iis，
jsp host：nginx等等，每种语言编写的程序不管是网站还是web api接口都有各自的特点和共同点，特点比如每种语言编写的程序采用的开发框架不同，php有thinkphp等，asp有MVC等，
jsp有spring web starter，因此框架本身的漏洞就可以被利用，他们的依赖也是不同的，依赖的漏洞也可以被利用，比如shiro序列化漏洞；
共同点比如都可能需要访问数据库和缓存，因此都可能存在sql注入；
而且他们的宿主host程序本身的漏洞也是可以被利用的对象；

#### 1.2.2 小型公司DMZ架构
一般公司的网络架构都不会是简单的一台服务器，而是会由多个服务器组成的，而且根据网络安全的考虑，基本上都会将面向外网internet facing的服务器，比如邮箱服务器，web服务器放在DMZ隔离区；
从外网internet访问位于隔离区的web服务需要穿过外部的防火墙，防火墙会有端口和流量限制，通常不允许DMZ访问外网，也有些例外，比如邮箱服务器，
然后位于intranet内网的用户则通过位于内网的防火墙访问位于DMZ开放给内网用户的服务，一般不允许DMZ访问内网，如果DMZ被突破，至少可以避免位于内网的内部数据不被泄露；

![网络架构](/docs/docs_image/coder2hacker/ch2web/web01.png)

所以渗透测试时，可以有两种角度：
白盒测试：站在insider内部人员的角度，从intranet内网出发，了解网络架构；
黑盒测试：从外网的角度一步步探测内部构造；

同样对于黑客来说，也有两种思路：
社会学攻击：想办法通过钓鱼/鱼叉/水坑等攻击手但甚至是物理接触的方式获取内网的控制权，然后从内网实施更多的攻击；
web攻击：通过扫描收集分析面向外网的web服务或者防火墙的漏洞，进而从外网发起攻击；

#### 1.2.3 大型公司架构
除了防火墙还有IDS,IPS,甚至有honeypot蜜罐；
多个部门用不同的VLAN以保证不同部门之间的安全；
另外大型公司的核心业务一般也会放在核心区，不能把所有服务都放在DMZ,并将是面向外网的，相对比较容易被突破；
如果是互联网类型的公司还会将staging，uat和product分开在不同的分区上；
通常大型公司的渗透测试都是针对uat环境做的，尤其涉及到敏感数据，一般都会避免直接测试生产环境；

#### 1.2.4 更多架构

IOT架构

架构中会有智能设备，比如智能家电，终端传感器，BLE设备等，当然我们这里不会考虑跟这些设备的近距离通信比如nfc或者蓝牙，而是通过远程控制，
所以一定会有一个基站或者云服务向外部以web api或者web站点的形式暴露服务，所以仍然属于CS架构；
https://resources.infosecinstitute.com/beginners-guide-to-pentesting-iot-architecture-network-and-setting-up-iot-pentesting-lab-part-1/

去中心化系统区块链

主流的公链都是P2P通信方式，跟传统的中心化架构不同，节点是完全分布式的，公链本身的安全由区块链技术本身来保证，比如密码学+共识算法，所以直接突破区块链技术是比较困难的，
但是从线上到链上的连接是我们可以考虑的：
+ 跟区块链通信的中心化系统比如交易所，钱包app，举例btc，都是要链下管理私钥和构造交易，然后再用私钥签名之后通过rpc通信比如python-bitcoinrpc的方式“发送到区块链上”，https://www.8btc.com/media/381319
+ 另外以太坊还有智能合约的概念，智能合约本身的安全也是一个新的领域，另外跟前面比特币rpc的例子类似，跟以太坊“沟通”一般是通过abi调用

## 2. Web应用

web应用一般分为website网站和web api接口，两者最主要的区别就是前者有presentation layer，后者则没有；
网站当然是一种典型的web应用，我们只需要通过浏览器即可访问，浏览器只认识html，所以需要向web服务器请求，然后web服务器会直接返回静态页面或者
根据网站的类型和编码方式解释或者编译生成html response并返回，有时候网站甚至会有自己的所谓view engine来动态生成html页面放在缓存中；
手机app或者其他类型的富客户端背后也一定对应着web应用，比如即使是手机离线地图或者词典，在同步的时候也一定需要跟远程的服务器通信上传或者下载相关数据，
远程服务一般会以web api形式提供服务，通信方式多数是基于http https，当然也有定制化的加密方式，或者直接采用其他的协议如XMPP等；

### 2.1 基础协议
http协议等
HTTP Headers
利用cookies进行session追踪
https
其他协议:XMPP

HTTP request and response
	The request header
	The response header
HTTP methods:GET/POST/HEAD/TRACE/PUT/DELETE/OPTION

+ "Simple" HTTP requests(can made by simple html, no javascript needed: form post, image src get..)
	- An HTTP/1.1 GET, HEAD or a POST is the request method
	- In the case of a POST, the Content-Type of the request body is one of application/x-www-form-urlencoded, multipart/form-data, or text/plain
	- No custom HTTP headers are set (or, only CORS-safelisted headers are set)
+ "Preflighted" HTTP requests
	- Before a "preflighted" requests can be sent to the target server, the browser must check that it is safe to send, 
	So it first sends an HTTP request with the OPTIONS method to the same URL，
	Browser sends OPTIONS request first to ask the server if the request we want to send is okay
	- If server doesn't support OPTIONS (either because it is old or because it doesn't want to support preflighted requests) then, preflighted requests are denied

Keeping sessions in HTTP
Cookies
	Cookie flow between server and client
	Persistent and nonpersistent cookies
	Cookie parameters
HTML data in HTTP response:
	服务端收到客户端的请求，根据请求的类型，比如.php扩展代表请求的页面是php代码，需要服务端对应的php引擎或者解释器根据客户端的参数和指定的页面路由找到对应的服务端代码，
	解释执行并返回请求格式的结果，比如HTML/JSON/XML；

Web Services
	rest vs soap；
	ajax：html/json/xml
	websocket
	
### 2.2 web应用架构和WAF
前面谈了网络架构，现在具体到web应用架构，

从物理架构上说，一般是经典的3 tier：

presentation tier放在位于DMZ的web服务器上；
application tier或者business layer放在intranet内网服务器上；
database tier也是放在intranet内网服务器上；

从逻辑架构上讲，一般是经典的三层 3 layer：

presentation layer 表现层一般是static html或者基于比如ASP.NET MVC的dynamic html，托管在web host软件中，如iis/apache；
business layer 业务层，一般主要的核心业务逻辑都放在这一层，向上负责给presentation layer提供业务数据，向下负责跟数据访问层交互将数据转为业务数据以及将业务数据落库；
data access layer 数据访问层，跟数据库的通信都是放在这一层，负责数据库读写；

当然很多小公司会将逻辑上的三层作为一个完整的项目部署在web服务器上，因为小公司的技术栈比较简单，这样处理可以以最简单的方法获取最好的性能，弱点当然是安全性比较低，
通常一旦web应用产生漏洞，会被迅速“脱裤”，数据库也往往直接泄漏；

大中型公司会将业务层做成比如微服务端形式部署在内网或者核心区，然后DMZ的表现层的网站可以通过web api http或者rpc socket跟业务层的微服务进行通信；

一般来说Web应用不会直接将IP暴露在公网上，通常是躲在WAF后面，参考[](https://wooyun.js.org/drops/Bypass%20WAF%20Cookbook.html)拓扑图：
![burpsuite https](/docs/docs_image/coder2hacker/ch2web/waf01.png)

假设客户端访问web服务器完整过程：

1）首先会请求DNS，由于配置云waf的时候，会修改DNS的解析。我们发送DNS请求之后，域名会被解析到云WAF的ip上去。DNS解析完成之后，获取到域名信息，然后进入下一个步骤。

2）HTTP协议是应用层协议，且是tcp协议，因此会首先去做TCP的三次握手

3）发送HTTP请求过去，请求会依次经过云WAF，硬件IPS/IDS设备，硬件WAF设备，服务器，web服务器，主机防护软件/软WAF，WEB程序，数据库。 云WAF，硬件IPS/IDS，硬件WAF均有自己处理数据的方式。

在获取HTTP数据之前会做TCP重组，重组主要目的是针对互联网数据包在网络上传输的时候会出现乱序的情况，数据包被重组之后就会做协议解析，取出相关的值。如http_method=GET,http_payload=xxx等等。这些值就对应了IPS规则中相关规则的值。从而来判断规则匹配与不匹配。


### 2.3 抓包方法总结

对于网站，我们可以用浏览器加插件的方式进行抓包和测试，比如采用chrome的开发者工具+hackerbar，直接就可以查看http通信和web socket packet，
~~但是缺点是如果页面发生跳转，跳转前的记录就会清除，这种情况只能采用抓包工具~~chrome已经提供了Preserve Log选项可以保存跳转前的链接；而对于手机app、桌面软件等，我们只能采用抓包工具来抓取，下面就介绍下常用的抓包方式：

抓包工具分为cli命令行工具和带有UI界面的工具，cli工具如tcpdump，UI工具有fiddler/wireshark/burpsuite等；
Fiddler只适用于windows平台，burpsuite是java写的跨平台，Fiddler和burpsuite在抓包上偏向请求和响应的数据，但是wireshark偏向于数据帧，跟tcpdump一个级别；Proxifier主要是给没有提供代理设置的桌面软件，Proxifier Standard Edition uses Winsock Layered Service Provider (Winsock LSP) to capture TCP connections and Winsock Name Space Provider (Winsock NSP) to handle name resolution over proxy. Both providers have to be properly installed in the system；wireshark不提供代理，而是从底层抓取所有通过某个网卡的流量，如果需要监听某个特定程序的流量也很简单，只需要通过filter的本地端口过滤；
为什么有些网页版/桌面程序抓不到包? 常见原因:web.whatsapp走的不是https协议抓到包，无法解密：没有开启解密模式或安装代理软件的CA证书，或者网站或软件只接受自己设置的白名单列表CA

下面来具体分类说下：

#### TCPDUMP:

  最原始的方式是采用系统提供的基本工具比如linux的tcpdump嗅探监听，它是一个没有UI的cli形式的命令行工具，开启混杂模式，可以抓取任何经过本机任何一个网卡的数据包，windows上也有类似的windump；

  A tcpdump Tutorial with Examples — 50 Ways to Isolate Traffic https://danielmiessler.com/study/tcpdump/

  tcpdump -nnvS src X.X.X.X and dst port 8080
  从这个命令很容易理解其逻辑，抓取源地址是X.X.X.X，目的端口是8080的数据包

https://hackertarget.com/tcpdump-examples/

+ burpsuite：
https://support.portswigger.net/customer/portal/articles/1783087-Installing_Installing%20CA%20Certificate%20-%20FF.html
https://medium.com/@faridhashmi733/fix-burp-suite-ssl-secure-connection-failed-8de2146e21fa

![burpsuite https](/docs/docs_image/coder2hacker/ch2web/web02.png)


#### fiddler

本机+可设置代理的软件（浏览器，百度网盘等允许设置代理的软件）：
	Filters->breakpoints
	Right click -> Replay->reissue and edit
	Decrypt https

![fiddler https](/docs/docs_image/coder2hacker/ch2web/web03.png)

Fiddler+proxifier(付费) / [ProxyBridge（免费）](https://github.com/InterceptSuite/ProxyBridge) 

本机+桌面软件（不可以设置代理的软件）：配合Proxifier或其他

![fiddler proxifier](/docs/docs_image/coder2hacker/ch2web/web04.png)

_千万不要那个default走fiddler的proxy，不然会造成死循环，因为fiddler的流量也会被Proxifier拦截住，然后再发给自己，报错“proxifier detected that the application fiddler.exe get into an infinite connection loop”，另一个解决方案是增进Fiddler.exe Action放direct_

另外还有一款 wsockexpert  已经没人维护了

手机抓包：
	设置远程连接并只设置解密远程连接的https
	
![fiddler mobile](/docs/docs_image/coder2hacker/ch2web/web05.png)

配置手机wifi代理：
wifi proxy manual=> host port 8888
	
下载证书：
手机打开http://\<host\>:\<port 8888\> 下载FiddlerRoot certificate 安装，默认选择APP/VPN即可

fiddler高级用法：

通过Rules->Custom rules可以修改脚本，做一些过滤或高亮及对request和response的修改，比如

```
高亮
static function OnBeforeResponse(oSession: Session) {
    if (m_Hide304s && oSession.responseCode == 304) {
    	oSession["ui-hide"] = "true";
    }
    if(oSession.GetResponseBodyAsString().Contains("xxxx")){
    	oSession["ui-color"] = "red";		
    }
}
显示websocket内容，注意需要双击请求右侧才会出现websocket
static function OnWebSocketMessage(oMsg: WebSocketMessage) {

	// Log Message to the LOG tab
	FiddlerApplication.Log.LogString(oMsg.ToString());

}
https://docs.telerik.com/fiddler/knowledgebase/fiddlerscript/modifyrequestorresponse
```

还有其他技巧比如下断点 bpafter：https://docs.telerik.com/fiddler/knowledgebase/quickexec



Fiddler+burpsuite
	Fiddler gateway 转发给burpsuite


#### Frida工具（也可使用Xposed）进行Hook 
使用Charles、Fiddle等抓包工具对淘系App进行抓包时，你会发现总是抓不到包，出现请求不走Charles代理的情况。这是因为淘系app底层网络通信的协议并不是普通的http协议，而是自己实现的一套私有协议Spdy。
[解决淘宝、闲鱼等淘系App无法抓包问题](https://hyb.life/archives/85)
#### wireshark 

  终极杀器wireshark,可以设置监听某些网卡的流量,怎么监听某个特定应用程序的流量呢? 很简单通过过滤条件:

  首先通过任务管理器查看pid或者tasklist | findstr SEARCH_STR获取pid,然后通过 netstat -ano|findstr PID 可以查到本机开启的client端端口，然后通过wireshark filter过滤：tcp.port=PORT_NUMBER

  其他过滤条件举例:	ip.addr == 10.20.70.101 and frame contains "CALL"

​	ssl解密：通过设置环境变量SSLKEYLOGFILE



**当然上面只是初步的抓包入门，实际情况会更复杂，比如很多app或网站程序都会利用各种策略和协议来阻止抓包，所以经常会遇到抓不到包的情况，进阶内容参照知识星球内的分享（知识号: coder2hacker）**


突破 SSL PIN: TrustMeAlready 

[最全Android 11 微信小程序抓包教程](https://mp.weixin.qq.com/s/DPUfK64J6SndX05wGM2Zng)

[App逆向之干掉vpn检测抓包](https://mp.weixin.qq.com/s/x3_zoPxLw7pcaFS1if11vA)

ref:
[大型企业网络架构](https://blog.csdn.net/qq_36119192/article/details/84427267)

比如内部maven的远程仓库泄漏，比如代码里面的acurator监控端口泄漏，比如内部的doc文档路径泄漏，
比如内部的staging或uat测试环境泄漏

#### [InterceptSuite](https://mp.weixin.qq.com/s/qOYvOMGZaaOtTVbtQJW9UQ) 

传统抓包工具（如 Burp）工作在 应用层（Application Layer），只认识 HTTP/HTTPS 请求。它们依赖浏览器或 App 主动配置代理，一旦对方绕过代理，或者根本不走 HTTP，那就彻底歇菜。

而 InterceptSuite 工作在更底层的 传输层（Transport Layer） 和 安全层（TLS/SSL），它可以：

- 拦截任何基于 TCP 或 UDP 的 TLS 加密流量
- 自动识别并处理 TLS 升级（比如 STARTTLS）
- 支持 PostgreSQL、MySQL、SMTP、IMAP、FTPS 等非 HTTP 协议
- 提供 Python 扩展接口，让你自己写解析器

#### 更多监控工具
[Nagios是个开源的监控系统，号称网络监控的“瑞士军刀”。它能盯着服务器、网络设备、服务状态，甚至还能看房间温度，啥都逃不过它的眼睛！](https://www.nagios.org/)

[Application to comfortably monitor your Internet traffic.](https://github.com/GyulyVGC/sniffnet)

[Zabbix：企业级的“监控大管家”](https://www.zabbix.com/)

[Prometheus：云时代的“监控新星”](https://prometheus.io/)

[SolarWinds NPM：商业界的“监控贵族”](https://www.solarwinds.com/network-performance-monitor)

## troubleshooting

### mobile app 抓包

通过Fiddler抓包看到的信息，能否等同于或揭示出别人在本地调试安卓App时从源码中获得的详细SSL错误信息。

简而言之，答案是：通常情况下，Fiddler抓包无法直接看到与安卓源码调试同样深度的SSL错误细节。您通过Fiddler看到的连接信息，和开发人员从日志中看到的 SSLHandshakeException，是站在不同视角观察同一事件的不同层面。

Fiddler的角色是“中间人”：Fiddler能解密HTTPS的前提是，客户端（您的App）必须信任Fiddler自己生成的根证书。当您设置好代理后，App的所有网络请求先发给Fiddler，Fiddler再以自己的身份与真实服务器通信。因此，从网络层面看，Fiddler与服务器的TLS握手可能是成功的（这就是您看到的200 Connection Established）。
错误发生在App内部：问题出在App接收到Fiddler返回的证书之后。App会按照自己的安全规则去验证这张证书。由于Android 7.0+默认不信任用户安装的证书（如Fiddler证书），或者App使用了SSL Pinning（证书绑定）​ 技术，只信任它自己预设的证书，就会在内部触发验证失败，抛出异常。这个错误发生在App进程内部，网络流量已经正常送达，因此Fiddler作为网络代理是无法感知到这个“应用层”的错误的。

### mobile app ssl pin

Android apps that use SSL pinning will block Fiddler from decrypting their HTTPS traffic by default. This is an intentional security measure designed to prevent man-in-the-middle (MITM) attacks, even if the Fiddler root certificate is installed on the device. 

Understanding the Interaction
+ Standard Apps: For most Android applications that rely on the default system trust store, installing the Fiddler Root certificate and configuring the device's proxy settings is sufficient to intercept and decrypt HTTPS traffic.
+ Pinned Apps: Applications with SSL pinning have the expected server certificate or public key hardcoded within the app itself. When Fiddler intercepts the connection, it presents its own dynamically generated certificate, which the pinned app does not recognize or trust, causing the connection to fail (often appearing as a CONNECT tunnel in Fiddler's log). 

Bypassing SSL pinning is possible for testing and debugging purposes, but it requires more advanced techniques and is generally done on a device you control, such as a rooted Android device or an emulator. Common methods include: 
+ Frida: A dynamic instrumentation toolkit that can inject scripts into the running application to hook and modify its certificate validation functions at runtime. Scripts like the "Universal Android SSL Pinning Bypass" are widely used for this purpose.
+ Objection: A runtime mobile exploration toolkit powered by Frida that provides a command-line interface to perform various tasks, including bypassing SSL pinning, without manual scripting.
+ Patched APKs: Tools like apk-mitm can automatically patch an APK file by modifying its network security configuration to trust user-installed certificates (like the Fiddler root CA) and disabling pinning logic before installation.
+ Xposed Modules: On devices with the Xposed framework, modules like TrustMeAlready can disable certificate checks system-wide. 