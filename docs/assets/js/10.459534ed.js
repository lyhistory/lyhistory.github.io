(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{210:function(e,t,n){"use strict";n.r(t);var s=n(0),a=Object(s.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("p",[n("a",{attrs:{href:"/docs/coder2hacker"}},[e._v("回目录")]),e._v("  《Chapter 2．网络基础和web技术》")]),e._v(" "),n("h2",{attrs:{id:"_1-网络基础"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-网络基础"}},[e._v("#")]),e._v(" 1.网络基础")]),e._v(" "),n("p",[e._v("网络分层根据协议栈有四层五层七层的不同分法")]),e._v(" "),n("ul",[n("li",[e._v("Layer 5: Application")]),e._v(" "),n("li",[e._v("Layer 4: Transport")]),e._v(" "),n("li",[e._v("Layer 3: Network/Internet")]),e._v(" "),n("li",[e._v("Layer 2: Data Link")]),e._v(" "),n("li",[e._v("Layer 1: Physical")])]),e._v(" "),n("p",[e._v("比较早的layer1是采用hub技术，容易浪费带宽，比如A和B两台机器上面运行不同的服务，外面请求进来的时候，采用hub技术就要盲目广播，浪费带宽；\n而采用layer2的交换机技术，由于交换机会学习mac地址（arp mapping），大大降低了广播的浪费；\n而layer3进一步采用ip网段隔开不同的分区，根据外部请求的ip可以准确的找到不同的网关；\nlayer4则是负责为信源和信宿提供应用程序进程间的数据传输服务，这一层上主要定义了两个传输协议，传输控制协议即TCP和用户数据报协议UDP；\nlayer5支持网络应用，应用协议仅仅是网络应用的一个组成部分，运行在不同主机上的进程则使用应用层协议进行通信。主要的协议有：http、ftp、telnet、smtp、pop3等")]),e._v(" "),n("p",[e._v("我们通过抓包工具，比如：\nchrome的开发者工具，通常抓的都是简单的应用层的包，比如http请求，web socket等；\n而通过重量级的抓包工具比如wireshark，通常是抓取从物理层到应用层的所有信息：")]),e._v(" "),n("p",[e._v("·Frame: 物理层的数据帧概况")]),e._v(" "),n("p",[e._v("·Ethernet II: 数据链路层以太网帧头部信息")]),e._v(" "),n("p",[e._v("·Internet Protocol Version 4: 互联网层IP包头部信息")]),e._v(" "),n("p",[e._v("·Transmission Control Protocol: 传输层T的数据段头部信息，此处是TCP")]),e._v(" "),n("p",[e._v("·Hypertext Transfer Protocol: 应用层的信息，此处是HTTP协议")]),e._v(" "),n("h2",{attrs:{id:"_2-网络架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-网络架构"}},[e._v("#")]),e._v(" 2.网络架构")]),e._v(" "),n("h3",{attrs:{id:"_2-1-经典cs-bs架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-经典cs-bs架构"}},[e._v("#")]),e._v(" 2.1 经典CS/BS架构")]),e._v(" "),n("p",[e._v("B代表browser，c代表client\nclient-server架构是最常见的，S自然是server，实际上现在BC没有太大的区分，比如手机app也就是一种富客户端，本质也就是一种浏览器，\n跟服务端的通信都可以通过抓包工具抓取；\n而server服务端最基本的就是一个普通计算机，上面运行特定的程序，比如各种web host软件，如php host：apache/PHP study等，asp.net或web api host：iis，\njsp host：nginx等等，每种语言编写的程序不管是网站还是web api接口都有各自的特点和共同点，特点比如每种语言编写的程序采用的开发框架不同，php有thinkphp等，asp有MVC等，\njsp有spring web starter，因此框架本身的漏洞就可以被利用，他们的依赖也是不同的，依赖的漏洞也可以被利用，比如shiro序列化漏洞；\n共同点比如都可能需要访问数据库和缓存，因此都可能存在sql注入；\n而且他们的宿主host程序本身的漏洞也是可以被利用的对象；")]),e._v(" "),n("h3",{attrs:{id:"_2-2-小型公司dmz架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-小型公司dmz架构"}},[e._v("#")]),e._v(" 2.2 小型公司DMZ架构")]),e._v(" "),n("p",[e._v("一般公司的网络架构都不会是简单的一台服务器，而是会由多个服务器组成的，而且根据网络安全的考虑，基本上都会将面向外网internet facing的服务器，比如邮箱服务器，web服务器放在DMZ隔离区；\n从外网internet访问位于隔离区的web服务需要穿过外部的防火墙，防火墙会有端口和流量限制，通常不允许DMZ访问外网，也有些例外，比如邮箱服务器，\n然后位于intranet内网的用户则通过位于内网的防火墙访问位于DMZ开放给内网用户的服务，一般不允许DMZ访问内网，如果DMZ被突破，至少可以避免位于内网的内部数据不被泄露；")]),e._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/coder2hacker/ch2web/web01.png",alt:"网络架构"}})]),e._v(" "),n("p",[e._v("所以渗透测试时，可以有两种角度：\n白盒测试：站在insider内部人员的角度，从intranet内网出发，了解网络架构；\n黑盒测试：从外网的角度一步步探测内部构造；")]),e._v(" "),n("p",[e._v("同样对于黑客来说，也有两种思路：\n社会学攻击：想办法通过钓鱼/鱼叉/水坑等攻击手但甚至是物理接触的方式获取内网的控制权，然后从内网实施更多的攻击；\nweb攻击：通过扫描收集分析面向外网的web服务或者防火墙的漏洞，进而从外网发起攻击；")]),e._v(" "),n("h3",{attrs:{id:"_2-3-大型公司架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-大型公司架构"}},[e._v("#")]),e._v(" 2.3 大型公司架构")]),e._v(" "),n("p",[e._v("除了防火墙还有IDS,IPS,甚至有honeypot蜜罐；\n多个部门用不同的VLAN以保证不同部门之间的安全；\n另外大型公司的核心业务一般也会放在核心区，不能把所有服务都放在DMZ,并将是面向外网的，相对比较容易被突破；\n如果是互联网类型的公司还会将staging，uat和product分开在不同的分区上；")]),e._v(" "),n("h3",{attrs:{id:"_2-4-更多架构"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-更多架构"}},[e._v("#")]),e._v(" 2.4 更多架构")]),e._v(" "),n("p",[e._v("IOT架构")]),e._v(" "),n("p",[e._v("架构中会有智能设备，比如智能家电，终端传感器，BLE设备等，当然我们这里不会考虑跟这些设备的近距离通信比如nfc或者蓝牙，而是通过远程控制，\n所以一定会有一个基站或者云服务向外部以web api或者web站点的形式暴露服务，所以仍然属于CS架构；\nhttps://resources.infosecinstitute.com/beginners-guide-to-pentesting-iot-architecture-network-and-setting-up-iot-pentesting-lab-part-1/")]),e._v(" "),n("p",[e._v("去中心化系统区块链")]),e._v(" "),n("p",[e._v("主流的公链都是P2P通信方式，跟传统的中心化架构不同，节点是完全分布式的，公链本身的安全由区块链技术本身来保证，比如密码学+共识算法，所以直接突破区块链技术是比较困难的，\n但是从线上到链上的连接是我们可以考虑的：")]),e._v(" "),n("ul",[n("li",[e._v("跟区块链通信的中心化系统比如交易所，钱包app，举例btc，都是要链下管理私钥和构造交易，然后再用私钥签名之后通过rpc通信比如python-bitcoinrpc的方式“发送到区块链上”，https://www.8btc.com/media/381319")]),e._v(" "),n("li",[e._v("另外以太坊还有智能合约的概念，智能合约本身的安全也是一个新的领域，另外跟前面比特币rpc的例子类似，跟以太坊“沟通”一般是通过abi调用")])]),e._v(" "),n("h2",{attrs:{id:"_3-web基础"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-web基础"}},[e._v("#")]),e._v(" 3.Web基础")]),e._v(" "),n("p",[e._v("http协议等\nhttps")]),e._v(" "),n("p",[e._v("抓包方法总结 gdoc realcase")]),e._v(" "),n("p",[e._v("1.4 Web应用总览")]),e._v(" "),n("p",[e._v("1.4.1 HTTP协议\n1.4.2 HTTP Headers\n1.4.3 利用cookies进行session追踪\n1.4.4 HTML\n1.4.5 Web应用架构")]),e._v(" "),n("p",[e._v("Proactive security testing\nDifferent testing methodologies\nEthical hacking\nPenetration testing\nVulnerability assessment\nSecurity audits\nConsiderations when performing penetration testing\nRules of Engagement\nThe type and scope of testing\nClient contact details\nClient IT team notifications\nSensitive data handling\nStatus meeting and reports\nThe limitations of penetration testing\nThe need for testing web applications\nReasons to guard against attacks on web applications\nKali Linux\nA web application overview for penetration testers\nHTTP protocol\nKnowing an HTTP request and response\nThe request header\nThe response header\nHTTP methods\nThe GET method\nThe POST method\nThe HEAD method\nThe TRACE method\nThe PUT and DELETE methods\nThe OPTIONS method\nKeeping sessions in HTTP\nCookies\nCookie flow between server and client\nPersistent and nonpersistent cookies\nCookie parameters\nHTML data in HTTP response\nThe server-side code\nMultilayer web")])])}),[],!1,null,null,null);t.default=a.exports}}]);