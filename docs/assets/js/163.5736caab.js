(window.webpackJsonp=window.webpackJsonp||[]).push([[163],{587:function(e,t,n){"use strict";n.r(t);var i=n(65),r=Object(i.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h2",{attrs:{id:"原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[e._v("#")]),e._v(" 原理")]),e._v(" "),n("p",[e._v("Keepalived是一个基于VRRP协议-Virtual Router Redundancy Protocol 来实现的服务高可用方案")]),e._v(" "),n("p",[e._v("VRRP:")]),e._v(" "),n("p",[e._v("VRRP全称 Virtual Router Redundancy Protocol，即 虚拟路由冗余协议。可以认为它是实现路由器高可用的容错协议，即将N台提供相同功能的路由器组成一个路由器组(Router Group)，这个组里面有一个master和多个backup，但在外界看来就像一台一样，构成虚拟路由器，拥有一个虚拟IP（vip，也就是路由器所在局域网内其他机器的默认路由），占有这个IP的master实际负责ARP相应和转发IP数据包，组中的其它路由器作为备份的角色处于待命状态。master会发组播消息，当backup在超时时间内收不到vrrp包时就认为master宕掉了，这时就需要根据VRRP的优先级来选举一个backup当master，保证路由器的高可用。")]),e._v(" "),n("p",[e._v("在VRRP协议实现里，虚拟路由器使用 00-00-5E-00-01-XX 作为虚拟MAC地址，XX就是唯一的 VRID （Virtual Router IDentifier），这个地址同一时间只有一个物理路由器占用。在虚拟路由器里面的物理路由器组里面通过多播IP地址 "),n("strong",[e._v("224.0.0.18")]),e._v(" 来定时发送通告消息。每个Router都有一个 1-255 之间的优先级别，级别最高的（highest priority）将成为主控（master）路由器。通过降低master的优先权可以让处于backup状态的路由器抢占（pro-empt）主路由器的状态，两个backup优先级相同的IP地址较大者为master，接管虚拟IP。")]),e._v(" "),n("p",[e._v("keepalived可以认为是VRRP协议在Linux上的实现，主要有三个模块，分别是core、check和vrrp。core模块为keepalived的核心，负责主进程的启动、维护以及全局配置文件的加载和解析。check负责健康检查，包括常见的各种检查方式。")]),e._v(" "),n("p",[e._v("keepalived工作在TCP/IP 参考模型的 三层、四层、五层，也就是分别为：网络层，传输层和应用层, Layer3,4,5 工作在IP/TCP协议栈的IP层，TCP层，及应用层,原理分别如下：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("Layer3：Keepalived使用Layer3的方式工作式时，Keepalived会定期向服务器群中的服务器发送一个ICMP的数据包（既我们平时用的Ping程序）,如果发现某台服务的IP地址没有激活，Keepalived便报告这台服务器失效，并将它从服务器群中剔除，这种情况的典型例子是某台服务器被非法关机。Layer3的方式是以服务器的IP地址是否有效作为服务器工作正常与否的标准。\nLayer4:如果您理解了Layer3的方式，Layer4就容易了。Layer4主要以TCP端口的状态来决定服务器工作正常与否。如web server的服务端口一般是80，如果Keepalived检测到80端口没有启动，则Keepalived将把这台服务器从服务器群中剔除。\nLayer7：Layer7就是工作在具体的应用层了，比Layer3,Layer4要复杂一点，在网络上占用的带宽也要大一些。Keepalived将根据用户的设定检查服务器程序的运行是否正常，如果与用户的设定不相符，则Keepalived将把服务器从服务器群中剔除。\n")])])]),n("p",[e._v("1.选举策略")]),e._v(" "),n("p",[e._v("首先，每个节点有一个初始优先级，由配置文件中的priority配置项指定，MASTER节点的priority应比BAKCUP高。运行过程中keepalived根据vrrp_script的weight设定，增加或减小节点优先级。规则如下：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v(" 当weight > 0时，vrrp_script script脚本执行返回0(成功)时优先级为priority + weight, 否则为priority。当BACKUP发现自己的优先级大于MASTER通告的优先级时，进行主从切换。\n 当weight < 0时，vrrp_script script脚本执行返回非0(失败)时优先级为priority + weight, 否则为priority。当BACKUP发现自己的优先级大于MASTER通告的优先级时，进行主从切换。\n当两个节点的优先级相同时，以节点发送VRRP通告的IP作为比较对象，IP较大者为MASTER。\n")])])]),n("p",[e._v("2.priority和weight的设定")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v("主从的优先级初始值priority和变化量weight设置非常关键，配错的话会导致无法进行主从切换。比如，当MASTER初始值定得太高，即使script脚本执行失败，也比BACKUP的priority + weight大，就没法进行VIP漂移了。\n所以priority和weight值的设定应遵循: abs(MASTER priority - BAKCUP priority) < abs(weight)。一般情况下，初始值MASTER的priority值应该比较BACKUP大，但不能超过weight的绝对值。 另外，当网络中不支持多播(例如某些云环境)，或者出现网络分区的情况，keepalived BACKUP节点收不到MASTER的VRRP通告，就会出现脑裂(split brain)现象，此时集群中会存在多个MASTER节点。\n")])])]),n("p",[e._v("3.常用命令")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[e._v('查看当前VIP在哪个节点上： ip addr show|grep "scope global" (查看VIP是否在筛选结果中)  或者 ip addr show|grep <VIP>\n查看日志tail /var/log/messages\n抓包命令：tcpdump -nn vrrp\n可以用这条命令来查看该网络中所存在的vrid：tcpdump -nn -i any net 224.0.0.0/8\n\n解绑VIP：ip addr del <vip> dev <eth0>\n\n绑定VIP：ip addr add <vip> dev <eth0>\n')])])]),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("                   +-------------+\n                   |    uplink   |\n                   +-------------+\n                          |\n                          +\n    MASTER            keep|alived         BACKUP\n172.101.2.100      172.101.2.99      172.101.2.101\n+-------------+    +-------------+    +-------------+\n|   nginx01   |----|  virtualIP  |----|   nginx02   |\n+-------------+    +-------------+    +-------------+\n                          |\n       +------------------+------------------+\n       |                                     |\n+-------------+    \t\t\t\t     +-------------+\n|    web01    |    \t\t\t\t   \t |    web02    |\n————————————————   \t\t\t\t\t ———————————————\n")])])]),n("h2",{attrs:{id:"配置选项说明"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#配置选项说明"}},[e._v("#")]),e._v(" 配置选项说明：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("-------------------------------------------------------------------------------\nglobal_defs\n-------------------------------------------------------------------------------\n    notification_email ： keepalived在发生诸如切换操作时需要发送email通知地址，后面的 smtp_server 相比也都知道是邮件服务器地址。也可以通过其它方式报警，毕竟邮件不是实时通知的。\n    router_id ： 机器标识，通常可设为hostname。故障发生时，邮件通知会用到\n-------------------------------------------------------------------------------\nvrrp_instance\n-------------------------------------------------------------------------------\n    state ： 指定instance(Initial)的初始状态，就是说在配置好后，这台服务器的初始状态就是这里指定的，但这里指定的不算，还是得要通过竞选通过优先级来确定。如果这里设置为MASTER，但如若他的优先级不及另外一台，那么这台在发送通告时，会发送自己的优先级，另外一台发现优先级不如自己的高，那么他会就回抢占为MASTER\n    interface ： 实例绑定的网卡，因为在配置虚拟IP的时候必须是在已有的网卡上添加的\n    mcast_src_ip ： 发送多播数据包时的源IP地址，这里注意了，这里实际上就是在那个地址上发送VRRP通告，这个非常重要，一定要选择稳定的网卡端口来发送，这里相当于heartbeat的心跳端口，如果没有设置那么就用默认的绑定的网卡的IP，也就是interface指定的IP地址\n    virtual_router_id ： 这里设置VRID，这里非常重要，相同的VRID为一个组，他将决定多播的MAC地址\n    priority ： 设置本节点的优先级，优先级高的为master\n    advert_int ： 检查间隔，默认为1秒。这就是VRRP的定时器，MASTER每隔这样一个时间间隔，就会发送一个advertisement报文以通知组内其他路由器自己工作正常\n    authentication ： 定义认证方式和密码，主从必须一样\n    virtual_ipaddress ： 这里设置的就是VIP，也就是虚拟IP地址，他随着state的变化而增加删除，当state为master的时候就添加，当state为backup的时候删除，这里主要是有优先级来决定的，和state设置的值没有多大关系，这里可以设置多个IP地址\n    track_script ： 引用VRRP脚本，即在 vrrp_script 部分指定的名字。定期运行它们来改变优先级，并最终引发主备切换。\n-------------------------------------------------------------------------------\nvrrp_script\n-------------------------------------------------------------------------------\n告诉 keepalived 在什么情况下切换，所以尤为重要。可以有多个 vrrp_script\n\n    script ： 自己写的检测脚本。也可以是一行命令如killall -0 nginx\n    interval 2 ： 每2s检测一次\n    weight -5 ： 检测失败（脚本返回非0）则优先级 -5\n    fall 2 ： 检测连续 2 次失败才算确定是真失败。会用weight减少优先级（1-255之间）\n    rise 1 ： 检测 1 次成功就算成功。但不修改优先级\n\n这里要提示一下script一般有2种写法：\n\n    通过脚本执行的返回结果，改变优先级，keepalived继续发送通告消息，backup比较优先级再决定\n    脚本里面检测到异常，直接关闭keepalived进程，backup机器接收不到advertisement会抢占IP\n\n上文 vrrp_script 配置部分，killall -0 nginx属于第1种情况，/etc/keepalived/check_nginx.sh属于第2种情况（脚本中关闭keepalived）。个人更倾向于通过shell脚本判断，但有异常时exit 1，正常退出exit 0，然后keepalived根据动态调整的 vrrp_instance 优先级选举决定是否抢占VIP：\n\n    如果脚本执行结果为0，并且weight配置的值大于0，则优先级相应的增加\n    如果脚本执行结果非0，并且weight配置的值小于0，则优先级相应的减少\n\n其他情况，原本配置的优先级不变，即配置文件中priority对应的值。\n\n提示：\n    优先级不会不断的提高或者降低\n    可以编写多个检测脚本并为每个检测脚本设置不同的weight（在配置中列出就行）\n    不管提高优先级还是降低优先级，最终优先级的范围是在[1,254]，不会出现优先级小于等于0或者优先级大于等于255的情况\n    在MASTER节点的 vrrp_instance 中 配置 nopreempt ，当它异常恢复后，即使它 prio 更高也不会抢占，这样可以避免正常情况下做无谓的切换\n\n以上可以做到利用脚本检测业务进程的状态，并动态调整优先级从而实现主备切换。\n-------------------------------------------------------------------------------\nvirtual_server\n-------------------------------------------------------------------------------\n    虚拟服务器，来源vrrp_instance 中配置的 的虚拟IP地址，后面加空格加端口号\n-------------------------------------------------------------------------------\nvirtual_server_group\n-------------------------------------------------------------------------------\n    用来定义virtual_server 组，一般在超大型的LVS中用到，一般LVS用不过这东西。\n\n\n")])])]),n("h2",{attrs:{id:"troubleshooting"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#troubleshooting"}},[e._v("#")]),e._v(" Troubleshooting")]),e._v(" "),n("h3",{attrs:{id:"requires-libmysqlclient-so-18"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#requires-libmysqlclient-so-18"}},[e._v("#")]),e._v(" Requires: libmysqlclient.so.18")]),e._v(" "),n("p",[e._v("生产环境yum install keepalived报错：")]),e._v(" "),n("p",[e._v("error：")]),e._v(" "),n("p",[e._v("Error: Package: 1:net-snmp-agent-libs-5.7.2-49.....\nRequires: libmysqlclient.so.18")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("开发环境没有任何问题，所以对比下开发环境\n先根据错误信息查下开发环境的依赖\n$ sudo yum deplist keepalived \n\tdependency: libnetsnmp.so.31()(64bit)                                                                          provider: net-snmp-libs.x86_64 1:5.7.2-49.el7_9.1                                                         dependency: libnetsnmpagent.so.31()(64bit)                                                                      provider: net-snmp-agent-libs.x86_64 1:5.7.2-49.el7_9.1 \n$ sudo yum deplist net-snmp-agent-libs.x86_64 1:5.7.2-49.el7_9.1\n\tdependency: libmysqlclient.so.18()(64bit)\n   \t\tprovider: mariadb-libs.x86_64 1:5.5.68-1.el7\n  \tdependency: libmysqlclient.so.18(libmysqlclient_18)(64bit)\n   \t\tprovider: mariadb-libs.x86_64 1:5.5.68-1.el7\n果然这里是依赖libmysqlclient.so.18，安装位置是 /usr/lib64/mysql/\n但是奇怪，这里的provider为啥是mariadb，\n奇怪是因为我之前是安装安装手册步骤删除了mariadb安装了mysql\nRepeat following steps in both master DB server and secondary DB server.\n1)\tLogin as root. Copy mysql installation packages and its dependencies to /opt\n•\tmysql-community-client-5.7.32-1.el7.x86_64.rpm\n•\tmysql-community-common-5.7.32-1.el7.x86_64.rpm\n•\tmysql-community-libs-5.7.32-1.el7.x86_64.rpm\n•\tmysql-community-server-5.7.32-1.el7.x86_64.rpm\n2)\tUninstall mariadb as it conflicts with mysql\n$ yum remove mariadb-libs-5.5.44-2.el7.x86_64\n3)\tInstall mysql-community-server-5.7.18 on DB \n$ yum install mysql-community-{server,client,common,libs}-*\n\n继续看下mysql安装包\n$ yum list installed|grep mysql\nSkipping unreadable repository '/etc/yum.repos.d/redhat.repo'\nSkipping unreadable repository '/etc/yum.repos.d/rhel7_SIM.repo'\nmysql-community-client.x86_64         5.7.18-1.el7                @/mysql-community-client-5.7.18-1.el7.x86_64\nmysql-community-common.x86_64         5.7.18-1.el7                @/mysql-community-common-5.7.18-1.el7.x86_64\nmysql-community-libs.x86_64           5.7.18-1.el7                @/mysql-community-libs-5.7.18-1.el7.x86_64\nmysql-community-libs-compat.x86_64    5.7.25-1.el7                @/mysql-community-libs-compat-5.7.25-1.el7.x86_64\nmysql-community-server.x86_64         5.7.18-1.el7                @/mysql-community-server-5.7.18-1.el7.x86_64\n\n直觉怀疑缺少了 mysql-community-libs-compat.x86_64，对比生产环境，果然少了这个包\n\n$ sudo rpm -ql mysql-community-libs-compat\n/etc/ld.so.conf.d/mysql-x86_64.conf\n/usr/lib64/mysql\n/usr/lib64/mysql/libmysqlclient.so.18\n/usr/lib64/mysql/libmysqlclient.so.18.1.0\n/usr/lib64/mysql/libmysqlclient_r.so.18\n/usr/lib64/mysql/libmysqlclient_r.so.18.1.0\n/usr/share/doc/mysql-community-libs-compat-5.7.25\n/usr/share/doc/mysql-community-libs-compat-5.7.25/COPYING\n/usr/share/doc/mysql-community-libs-compat-5.7.25/README\n\n确定了，就是少了这个包\n\n补充，可以反查：\nsudo rpm -qf /usr/lib64/mysql/libmysqlclient.so.18\nmysql-community-libs-compat-5.7.25-1.el7.x86_64\n")])])]),n("h3",{attrs:{id:"failed-to-run-external-check-scripts"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#failed-to-run-external-check-scripts"}},[e._v("#")]),e._v(" failed to run external check scripts")]),e._v(" "),n("p",[e._v("selinux 开关！")]),e._v(" "),n("disqus")],1)}),[],!1,null,null,null);t.default=r.exports}}]);