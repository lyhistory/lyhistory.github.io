(window.webpackJsonp=window.webpackJsonp||[]).push([[314],{739:function(t,a,e){"use strict";e.r(a);var c=e(65),s=Object(c.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"产品"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#产品"}},[t._v("#")]),t._v(" 产品")]),t._v(" "),e("ul",[e("li",[t._v("虚拟私有云 VPC")]),t._v(" "),e("li",[t._v("专属云 DEC\nDedicated Cloud（以下简称DeC）是华为面向企业、政府、金融等用户，提供计算、存储、网络、管控多级隔离方式的综合解决方案。用户像乘坐“头等舱”一样，享受各种专属服务，如独享自己的资源池，与其他公共租户物理隔离，同时提供企业级维护、迁移、优化服务，满足用户特定业务性能、应用场景以及安全合规的不同要求。")]),t._v(" "),e("li",[t._v("弹性计算服务ECS")]),t._v(" "),e("li",[t._v("裸金属服务 BMS bare metal")]),t._v(" "),e("li",[t._v("专属主机 DEH\n场景：某交易系统需要udp广播，但是华为普通的ECS机器所在的网络的交换机是跟其他租户共用的，所以华为会限流(带宽可以购买，但是这种属于内部线路的而且是广播流量，估计不太好控制，所以只能限流)，以免量大了对其他租户造成影响，造成丢包，这种情况下只能使用专属主机，可以自行设置交换机频段")])]),t._v(" "),e("h2",{attrs:{id:"网络"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#网络"}},[t._v("#")]),t._v(" 网络")]),t._v(" "),e("h3",{attrs:{id:"虚拟私有云vpc-virtual-private-cloud"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#虚拟私有云vpc-virtual-private-cloud"}},[t._v("#")]),t._v(" 虚拟私有云VPC virtual private cloud")]),t._v(" "),e("p",[t._v("you can configure IP address range\nfaciliates internal network management and configuration and allows you to implement secure and quick network changes, you can also customize the ECS access rule within a security group and between security groups to improve ECS security")]),t._v(" "),e("p",[t._v("华为云可以在同一个子网中跨不同的az可用区，其他的云商一般只能在同一个可用区内创建子网；")]),t._v(" "),e("p",[t._v("产品架构：\nhttps://support.huaweicloud.com/vpc_faq/vpc_faq_0001.html\n"),e("img",{attrs:{src:"https://support.huaweicloud.com/vpc_faq/zh-cn_image_0000001184839114.png",alt:""}})]),t._v(" "),e("p",[t._v("规划子网 subnet\nhttps://support.huaweicloud.com/usermanual-vpc/vpc_0001.html")]),t._v(" "),e("ul",[e("li",[t._v("通过VPC对等连接功能，实现同一区域内不同VPC下的私网IP互通。\n同一区域的VPC: 对等连接 https://support.huaweicloud.com/usermanual-vpc/zh-cn_topic_0046655036.html")]),t._v(" "),e("li",[t._v("通过EIP或NAT网关，使得VPC内的云服务器可以与公网Internet互通。")]),t._v(" "),e("li",[t._v("通过虚拟专用网络VPN、云连接、云专线及企业交换机将VPC和您的数据中心连通\n不同区域的VPC: 云连接 https://support.huaweicloud.com/cc/index.html")])]),t._v(" "),e("p",[t._v("VPC拓扑：")]),t._v(" "),e("ul",[e("li",[t._v("VPC之间：对等网络")]),t._v(" "),e("li",[t._v("VPC内部：\n"),e("ul",[e("li",[t._v("子网之间：路由表 三层")]),t._v(" "),e("li",[t._v("子网内部：二层")])])])]),t._v(" "),e("p",[t._v("路由表：\nhttps://support.huaweicloud.com/intl/zh-cn/productdesc-vpc/zh-cn_topic_0038263963.html")]),t._v(" "),e("p",[t._v("DNS云解析服务：\n公网域名\n内网域名\n怎样切换内网DNS？ https://support.huaweicloud.com/intl/zh-cn/dns_faq/dns_faq_005.html")]),t._v(" "),e("p",[t._v("VIP: 虚拟IP\nhttps://support.huaweicloud.com/intl/zh-cn/usermanual-vpc/vpc_vip_0001.html")]),t._v(" "),e("ol",[e("li",[t._v("在华为云的控制台, 添加一个虚拟 IP, 然后绑定 vm1, vm2...vm6 这个 6 台云主机")]),t._v(" "),e("li",[t._v("在其中一台上, 将 vip 配置到网卡上,为虚拟IP地址绑定弹性公网IP或弹性云服务器:\nhttps://support.huaweicloud.com/intl/zh-cn/usermanual-vpc/zh-cn_topic_0067802474.html")])]),t._v(" "),e("p",[t._v("但是这个配置不建议配置在网卡的持久化配置里面, 这个 IP 一般都是漂移用的\n一般情况下, 都会用比如 keepalived, 或者 Pacemaker 这种集群管理软件去管理")]),t._v(" "),e("p",[t._v("弹性云服务器的网卡绑定虚拟IP地址后，该虚拟IP地址无法ping通时，如何排查？\nhttps://support.huaweicloud.com/intl/zh-cn/vpc_faq/vpc_faq_0083.html")]),t._v(" "),e("h3",{attrs:{id:"nat-网关"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#nat-网关"}},[t._v("#")]),t._v(" NAT 网关")]),t._v(" "),e("h3",{attrs:{id:"弹性负载均衡-elb"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#弹性负载均衡-elb"}},[t._v("#")]),t._v(" 弹性负载均衡 ELB")]),t._v(" "),e("ul",[e("li",[t._v("使用四层协议的负载均衡，监听器收到访问请求后，将请求直接转发给后端服务器。转发过程仅修改报文中目标IP地址和源IP地址，将目标地址改为后端云服务器的IP地址，源地址改为负载均衡器的IP地址。四层协议连接的建立，即三次握手是客户端和后端服务器直接建立的，负载均衡只是进行了数据的转发。")]),t._v(" "),e("li",[t._v("使用七层协议的负载均衡，也称为“内容交换”。监听器收到访问请求后，需要识别并通过HTTP/HTTPS协议报文头中的相关字段，进行数据的转发。监听器收到访问请求后，先代理后端服务器和客户端建立连接（三次握手），接收客户端发送的包含应用层内容的报文，然后根据报文中的特定字段和流量分配策略判断需要转发的后端服务器。此场景中，负载均衡类似一个代理服务器，分别和客户端以及后端服务器建立连接。")])]),t._v(" "),e("p",[t._v("ELB网络流量路径说明 https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/elb_ug_fz_0003_01.html")]),t._v(" "),e("p",[t._v("企业交换机 https://support.huaweicloud.com/intl/zh-cn/productdesc-esw/esw_pd_0003.html")]),t._v(" "),e("h3",{attrs:{id:"接入方式"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#接入方式"}},[t._v("#")]),t._v(" 接入方式")]),t._v(" "),e("h4",{attrs:{id:"vpn"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vpn"}},[t._v("#")]),t._v(" VPN")]),t._v(" "),e("h4",{attrs:{id:"云专线-direct-connect"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#云专线-direct-connect"}},[t._v("#")]),t._v(" 云专线 Direct Connect")]),t._v(" "),e("p",[t._v("https://support.huaweicloud.com/productdesc-dc/zh-cn_topic_0032053183.html")]),t._v(" "),e("h4",{attrs:{id:"云连接-cloud-connect"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#云连接-cloud-connect"}},[t._v("#")]),t._v(" 云连接（Cloud Connect）")]),t._v(" "),e("p",[t._v("为用户提供一种能够快速构建跨区域VPC之间以及云上多VPC与云下多数据中心之间的高速、优质、稳定的网络能力，帮助用户打造一张具有企业级规模和通信能力的全球云上网络。\nhttps://support.huaweicloud.com/intl/zh-cn/function-cc/index.html")]),t._v(" "),e("h4",{attrs:{id:"全球加速服务-ga"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#全球加速服务-ga"}},[t._v("#")]),t._v(" 全球加速服务 GA")]),t._v(" "),e("p",[t._v("https://support.huaweicloud.com/intl/zh-cn/productdesc-ga/ga_01_0001.html")]),t._v(" "),e("h3",{attrs:{id:"waf"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#waf"}},[t._v("#")]),t._v(" WAF")]),t._v(" "),e("p",[t._v("浏览器/App => CDN或高防等代理 => Web应用防火墙 => 源站服务器")]),t._v(" "),e("p",[e("img",{attrs:{src:"/docs/docs_image/software/project_manage/cloud/cloud_huawei_waf.png",alt:""}})]),t._v(" "),e("h3",{attrs:{id:"流量路径"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#流量路径"}},[t._v("#")]),t._v(" 流量路径")]),t._v(" "),e("h4",{attrs:{id:"业务流量"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#业务流量"}},[t._v("#")]),t._v(" 业务流量")]),t._v(" "),e("p",[t._v("https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/elb_ug_fz_0003_01.html#elb_ug_fz_0003_01__zh-cn_topic_0166333709_section133601141145610")]),t._v(" "),e("p",[e("strong",[t._v("从公网进入的流量")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/zh-cn_image_0000001181376003.png",alt:""}})]),t._v(" "),e("p",[t._v("从互联网进入的流量, 主要是访问VPC-COM中的应用, 如WEB等, 这些应用需要开放给互联网用户, 进入的流量首先云防火墙(IPS), 可以过滤掉恶意网络攻击流量, 再经过 VPC-FWOUT 的安全组的访问控制, 最后经过CheckPoint防火墙进行DNAT操作才能访问到目标服务器.")]),t._v(" "),e("p",[t._v("example: www.lyhistory.com 云解析到 cdn\n浏览器=》cdn=》waf地址池=》负载均衡器elb 公网地址<只开放访问给waf地址池>（ELB NAT到内网，后端指向防火墙服务inbound）=》 再转到内部http负载均衡器=》源服务器，")]),t._v(" "),e("p",[e("strong",[t._v("访问公网的出去的流量")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://support.huaweicloud.com/intl/zh-cn/productdesc-elb/zh-cn_image_0000001135576398.png",alt:""}})]),t._v(" "),e("p",[t._v("云上的云服务器要访问Internet资源, 需要先经过虚拟私有云VPC-COM中的proxy服务器(趋势科技), 再经过VPC-FWOUT中的安全组规则, 最后经过CheckPoint防火墙做SNAT后进入互联网.")]),t._v(" "),e("p",[t._v("example：\nVPC-COM内网ecs实例机器访问google.com，内网路由表没有google.com对应的内网路径，所以路由匹配 0.0.0.0 走华为云的对等连接peering-com-fwout 到VPC-FWOUT，该VPC-FWOUT的路由表 "),e("strong",[t._v("rtb-VPC-FWOUT")]),t._v("  0.0.0.0下一跳类型为虚拟IP--该虚拟ip是绑定到子网subnet-fwout，而子网subnet-fwout可以直接绑定ECS实例：ecs-fwout (上面运行防火墙服务比如checkpoint) ，最后经过防火墙进行DNAT操作才能访问到目标服务器.")]),t._v(" "),e("h4",{attrs:{id:"运维流量"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#运维流量"}},[t._v("#")]),t._v(" 运维流量")]),t._v(" "),e("p",[t._v("外部=》互联网=》[华为云]（VPN=》ssh=》云资源）\noffice=》AD域控=》[华为云]（堡垒机=》ssh/rdp=》云资源）")]),t._v(" "),e("h2",{attrs:{id:"创建os"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#创建os"}},[t._v("#")]),t._v(" 创建OS")]),t._v(" "),e("p",[t._v("硬盘加密，否则华为可以直接看到所有数据")]),t._v(" "),e("h2",{attrs:{id:"pass产品"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#pass产品"}},[t._v("#")]),t._v(" PASS产品")]),t._v(" "),e("p",[t._v("ECS")]),t._v(" "),e("h2",{attrs:{id:"主机安全-host-security-service"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#主机安全-host-security-service"}},[t._v("#")]),t._v(" 主机安全 Host Security Service")]),t._v(" "),e("p",[t._v("https://www.huaweicloud.com/product/hss.html")]),t._v(" "),e("h2",{attrs:{id:"安全合规"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安全合规"}},[t._v("#")]),t._v(" 安全合规")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://res-static.hc-cdn.cn/cloudbu-site/china/zh-cn/TrustCenter/WithePaper/HUAWEICLOUD_ZTCMM.pdf",target:"_blank",rel:"noopener noreferrer"}},[t._v("华为云零信任能力成熟度模型白皮书"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("网络ACL对子网进行防护，子网下的资源都受网络ACL保护。")]),t._v(" "),e("p",[t._v("安全组对弹性云服务器进行防护。")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.huaweicloud.com/intl/zh-cn/product/scm.html?agencyId=5e86556c08824ce6802d7aaf127f33a7&region=ap-southeast-3",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cloud Certificate Manager，CCM"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("云防火墙 CFW")]),t._v(" "),e("p",[t._v("https://github.com/huaweicloudDocs")]),t._v(" "),e("h2",{attrs:{id:"troubleshooting"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#troubleshooting"}},[t._v("#")]),t._v(" Troubleshooting")]),t._v(" "),e("p",[t._v("?# ECS减配后之前配置的静态IP失效\n减配后，虚拟的ECS下面的物理机器肯定会变化，可能引起虚拟mac地址发生变化？从而导致绑定的ip跟mac不再匹配，\n解决办法:使用华为云的dhcp自动配置")])])}),[],!1,null,null,null);a.default=s.exports}}]);