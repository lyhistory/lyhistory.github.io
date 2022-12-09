---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

关于ipv4可以参考《vm_env_network》

## 基础

https://docs.microsoft.com/en-us/previous-versions/aa917150(v=msdn.10)?redirectedfrom=MSDN#address-space-allocation

http://www.steves-internet-guide.com/ipv6-guide/

```
The Google Public DNS IP addresses (IPv4) are as follows:
8.8.8.8
8.8.4.4
The Google Public DNS IPv6 addresses are as follows:
2001:4860:4860::8888
2001:4860:4860::8844
```

**Great Feature: dual stack**
只需要监听ipv6，同时可以通过ipv4访问了！
IPv6 only bound services accessible from IPv4 on dual stack Linux host: how does it work?
https://serverfault.com/questions/992612/ipv6-only-bound-services-accessible-from-ipv4-on-dual-stack-linux-host-how-does?rq=1

## 路由器-宿主机-virtualbox

使用virtualbox的kali os在用gvm的时候，community的feed只能通过ipv6访问，没办法需要设置，初次使用ipv6，没有经验，只好一点点排查

### 虚拟机初诊

```
root@kali:/home/lyhistory# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.109  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::a00:27ff:febf:e259  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:bf:e2:59  txqueuelen 1000  (Ethernet)
        RX packets 24570460  bytes 17931282838 (16.6 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 26028492  bytes 3906774798 (3.6 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 921143  bytes 586075462 (558.9 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 921143  bytes 586075462 (558.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
上面默认只有一个 link类型的ipv6，后来知道需要一个global的才行，所以肯定ping不通：

root@kali:/home/lyhistory# ping6 ipv6.google.com
ping6: connect: Network is unreachable
root@kali:/home/lyhistory# traceroute ipv6.google.com
traceroute to ipv6.google.com (2404:6800:4003:c04::65), 30 hops max, 80 byte packets
connect: Network is unreachable

看看路由信息：
root@kali:/home/lyhistory# ip -6 route show
::1 dev lo proto kernel metric 256 pref medium
fe80::/64 dev eth0 proto kernel metric 256 pref medium
可以看到路由都是在本地，一个localhost，一个link网关，没有到宿主机上的

root@kali:/home/lyhistory# route -6
Kernel IPv6 routing table
Destination                    Next Hop                   Flag Met Ref Use If
localhost/128                  [::]                       U    256 1     0 lo
fe80::/64                      [::]                       U    256 1     0 eth0
[::]/0                         [::]                       !n   -1  1     0 lo
localhost/128                  [::]                       Un   0   4     0 lo
fe80::a00:27ff:febf:e259/128   [::]                       Un   0   2     0 eth0
ff00::/8                       [::]                       U    256 2     0 eth0
[::]/0                         [::]                       !n   -1  1     0 lo

```

### 宿主机诊断

发现宿主机也就是我的win10的ipv6都不工作，所以vm自然更不工作

```
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Dual Band Wireless-AC 8265
   Physical Address. . . . . . . . . : 00-28-F8-22-E9-5D
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::61e4:8e32:fb58:74a4%26(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.0.141(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Tuesday, 17 November 2020 10:59:55 AM
   Lease Expires . . . . . . . . . . : Tuesday, 24 November 2020 10:59:54 AM
   Default Gateway . . . . . . . . . : 192.168.0.1
   DHCP Server . . . . . . . . . . . : 192.168.0.1
   DHCPv6 IAID . . . . . . . . . . . : 134228216
   DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-21-C8-05-55-00-28-F8-22-E9-5D
   DNS Servers . . . . . . . . . . . : 172.17.5.36
                                       172.17.5.4
   NetBIOS over Tcpip. . . . . . . . : Enabled
   
这里也只是有一个link-local地址
```

首先确定下是否开启了ipv6协议：

Control Panel\Network and Internet\Network Connections找到wifi右键属性

确实看到已经开启了"Internet协议版本6(TCP/IPV6)"

但是不管是检测还是ping都是提示“windows Ping request could not find host ipv6.google.com”

找到两种方法修复windows的ipv6

基于Teredo隧道开启IPv6和手动用netsh命令开启：

```
首先尝试基于Teredo隧道开启IPv6
// 设置 Teredo 服务器，默认为：win10.ipv6.microsoft.com    
netsh interface teredo set state enterpriseclient server=default       
// 重置 IPv6 配置：netsh interface ipv6 reset
出现一个新的伪网卡：
Tunnel adapter Teredo Tunneling Pseudo-Interface:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Microsoft Teredo Tunneling Adapter
   Physical Address. . . . . . . . . : 00-00-00-00-00-00-00-E0
   DHCP Enabled. . . . . . . . . . . : No
   Autoconfiguration Enabled . . . . : Yes
   IPv6 Address. . . . . . . . . . . : 2001:0:2851:fcb0:85f:f5d:9a80:bd5b(Preferred)
   Link-local IPv6 Address . . . . . : fe80::85f:f5d:9a80:bd5b%18(Preferred)
   Default Gateway . . . . . . . . . : ::
   DHCPv6 IAID . . . . . . . . . . . : 301989888
   DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-21-C8-05-55-00-28-F8-22-E9-5D
   NetBIOS over Tcpip. . . . . . . . : Disabled

// 测试 IPv6 连接     
ping -6 ipv6.test-ipv6.com     
但是无法ping通，但是至少可以resolve了：
Pinging ipv6.test-ipv6.com [2001:470:1:18::115] with 32 bytes of data:
Request timed out.

然后看看另一种手动方式：
正常开启cmd 输入 netsh
netsh>int
netsh>interface>ipv6
netsh>interface>ipv6>isatap
netsh>interface>ipv6>isatap>set router xxxxxxx(xxxxxx用本地网络ipv6路由地址替代)
netsh>interface>ipv6>isatap>set state enabled
netsh>interface>ipv6>isatap>quit
但是这里说的本地网络ipv6路由地址怎么看，貌似要去路由器里面看
```

### 路由器设置

所以最后想到路由器，根据路由器型号google：dlink868L ipv6 setting，发现原来路由器这里并没有开启ipv6！

https://www.dlink.com.sg/dir-868l-how-to-enable-ipv6-starhub/

```
Setup -> IPv6 
步骤少了：from section "MANUAL IPV6 INTERNET CONNECTION SETUP", click "Manual IPv6 Internet Connection Setup"
Select Autoconfiguration (SLAAC / DHCPv6) from the drop down list as shown. 
Click on Save Settings. 
设置后，路由器参数：
勾选状态：Obtain IPv6 DNS Servers automatically
未勾选：Use the following IPv6 DNS Servers
	Primary DNS Server:2404:e800:3:5::4
	Secondary DNS Server:2404:e800:3:3::36
勾选状态：Enable DHCP-PD
	LAN IPv6 Address:2404:e801:2001:15cc:12be:f5ff:fe23:ff84 /64
	LAN IPv6 Link-Local Address:fe80::12be:f5ff:fe23:ff84 /64
勾选状态：Enable Automatic IPv6 address assignment和Enable Automatic DHCP-PD in LAN

重启电脑后终于成功了！
C:\WINDOWS\system32>ping -6 ipv6.google.com
Pinging ipv6.l.google.com [2404:6800:4003:c03::64] with 32 bytes of data:
Reply from 2404:6800:4003:c03::64: time=5ms

再来看下宿主机的网卡信息：
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Dual Band Wireless-AC 8265
   Physical Address. . . . . . . . . : 00-28-F8-22-E9-5D
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv6 Address. . . . . . . . . . . : 2404:e801:2001:15cc:61e4:8e32:fb58:74a4(Preferred)
   Temporary IPv6 Address. . . . . . : 2404:e801:2001:15cc:50a0:58ff:5929:498f(Preferred)
   Link-local IPv6 Address . . . . . : fe80::61e4:8e32:fb58:74a4%26(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.0.141(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Wednesday, 9 December 2020 8:37:52 AM
   Lease Expires . . . . . . . . . . : Wednesday, 16 December 2020 8:37:31 AM
   Default Gateway . . . . . . . . . : fe80::12be:f5ff:fe23:ff84%26
                                       192.168.0.1
   DHCP Server . . . . . . . . . . . : 192.168.0.1
   DHCPv6 IAID . . . . . . . . . . . : 134228216
   DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-21-C8-05-55-00-28-F8-22-E9-5D
   DNS Servers . . . . . . . . . . . : 2404:e800:3:5::4
                                       2404:e800:3:3::36
                                       172.17.5.36
                                       172.17.5.4
                                       2404:e800:3:5::4
                                       2404:e800:3:3::36
   NetBIOS over Tcpip. . . . . . . . : Enabled
   
跟前面对比，多了：
IPv6 Address / Temporary IPv6 Address / Default Gateway / DNS Servers
再看看路由信息：
IPv6 Route Table
===========================================================================
Active Routes:
 If Metric Network Destination      Gateway
 26    306 ::/0                     fe80::12be:f5ff:fe23:ff84
 26    306 2404:e801:2001:15cc::/64 On-link
 26    306 2404:e801:2001:15cc:61e4:8e32:fb58:74a4/128
                                    On-link
 26    306 2404:e801:2001:15cc:6de3:d30a:6465:2a2f/128
 26    306 fe80::/64                On-link
 26    306 fe80::61e4:8e32:fb58:74a4/128
                                    On-link
 26    306 ff00::/8                 On-link
 
 发现这个26应该就是对应前面的那个%26
 
不过发现现在
ping google.com也直接是用ipv6了
当然可以调整，让ipv4优先 prefer ipv4 over ipv6：
C:\WINDOWS\system32>netsh interface ipv6 show prefixpolicies
Querying active state...

Precedence  Label  Prefix
----------  -----  --------------------------------
        50      0  ::1/128
        40      1  ::/0
        35      4  ::ffff:0:0/96
        30      2  2002::/16
         5      5  2001::/32
         3     13  fc00::/7
         1     11  fec0::/10
         1     12  3ffe::/16
         1      3  ::/96

https://superuser.com/questions/436574/ipv4-vs-ipv6-priority-in-windows-7

```

### 回到virtualbox

```
vim /etc/network/interfaces
iface eth0 inet6 dhcp

lyhistory@kali:~$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.109  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::a00:27ff:febf:e259  prefixlen 64  scopeid 0x20<link>
        inet6 2404:e801:2001:15cc:a00:27ff:febf:e259  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:bf:e2:59  txqueuelen 1000  (Ethernet)
        RX packets 1663  bytes 254846 (248.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1248  bytes 141779 (138.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 18  bytes 918 (918.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 18  bytes 918 (918.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

可以看到多了个global的2404:e801:2001:15cc
但是仍然无法ping通，看来dhcp还是有点问题，之前ipv4 也遇过类似问题，基本上是缺少gateway，通过设置静态ip解决

iface eth0 inet6 static
address 2404:e801:2001:15cc:a00:27ff:febf:e259
netmask 64
gateway fe80::12be:f5ff:fe23:ff84%26 这里的%26坑死我了，https://superuser.com/questions/99746/why-is-there-a-percent-sign-in-the-ipv6-address，前面也指出了26就是route里面的If列

ifup eth0出错：
RTNETLINK answers: File exists
原因参考讨论：https://unix.stackexchange.com/questions/100588/using-ip-addr-instead-of-ifconfig-reports-rtnetlink-answers-file-exists-on-de
解决方法是：
ip addr flush dev eth0 貌似只刷ipv4
ip -6 addr flush dev eth0 刷ipv6

root@kali:/home/lyhistory# ip -6 addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1000
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
    inet6 2404:e801:2001:15cc:a00:27ff:febf:e259/64 scope global 
       valid_lft forever preferred_lft forever
通过flush这一折腾
执行ifup eth0 又出错： Could not get a link-local address
貌似前面的 link address：fe80::a00:27ff:febf:e259 没有了
然后将static改成 iface eth0 inet6 dhcp
重启机器，又回来了
后来查到可以通过命令手动添加：ip address add dev eth0 scope link fe80::a00:27ff:febf:e259/64

/etc/init.d/networking status 依然停止状态，试着将ipv6的静态ip设置注释掉，
ip addr flush dev eth0
ifup eth0
/etc/init.d/networking restart 成功！
然后试着将ipv4静态ip设置注释掉，开启ipv6静态ip是
root@kali:/home/lyhistory# ifup eth0
Error: inet6 address is expected rather than "fe80::12be:f5ff:fe23:ff84%26".
ifup: failed to bring up eth0
这里终于给出真正原因了，就是%26的原因，修改静态ip设置，去除gateway后面的这个%26，并开启ipv4的静态ip设置，再试：
root@kali:/home/lyhistory# ifdown eth0
RTNETLINK answers: No such process
RTNETLINK answers: Cannot assign requested address
RTNETLINK answers: No such process
RTNETLINK answers: Cannot assign requested address
root@kali:/home/lyhistory# ifup eth0
Waiting for DAD... Done

root@kali:/home/lyhistory# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.109  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::a00:27ff:febf:e259  prefixlen 64  scopeid 0x20<link>
        inet6 2404:e801:2001:15cc:a00:27ff:febf:e259  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:bf:e2:59  txqueuelen 1000  (Ethernet)
        RX packets 6276  bytes 1036194 (1011.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 131  bytes 11424 (11.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 24  bytes 1152 (1.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 24  bytes 1152 (1.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

然后设置DNS:
vim /etc/resolv.conf
添加 2001:4860:4860::8888


root@kali:/home/lyhistory# ping6 ipv6.google.com
PING ipv6.google.com(2404:6800:4003:c04::8a (2404:6800:4003:c04::8a)) 56 data bytes
64 bytes from 2404:6800:4003:c04::8a (2404:6800:4003:c04::8a): icmp_seq=1 ttl=107 time=9.67 ms
成功了！

root@kali:/home/lyhistory# ip -6 route
::1 dev lo proto kernel metric 256 pref medium
2404:e801:2001:15cc::/64 dev eth0 proto kernel metric 256 pref medium
fe80::/64 dev eth0 proto kernel metric 256 pref medium
default via fe80::12be:f5ff:fe23:ff84 dev eth0 metric 1024 onlink pref medium
可以看到这里多了一个到宿主机的网关路由2404:e801:2001:15cc::/64

root@kali:/home/lyhistory# route -6
Kernel IPv6 routing table
Destination                    Next Hop                   Flag Met Ref Use If
localhost/128                  [::]                       U    256 2     0 lo
2404:e801:2001:15cc::/64       [::]                       U    256 1     0 eth0
fe80::/64                      [::]                       U    256 1     0 eth0
[::]/0                         fe80::12be:f5ff:fe23:ff84  UGH  1024 3     0 eth0
localhost/128                  [::]                       Un   0   5     0 lo
2404:e801:2001:15cc:a00:27ff:febf:e259/128 [::]                       Un   0   4     0 eth0
fe80::a00:27ff:febf:e259/128   [::]                       Un   0   3     0 eth0
ff00::/8                       [::]                       U    256 3     0 eth0
[::]/0                         [::]                       !n   -1  1     0 lo

当然还有命令行可以添加gateway和route，没有尝试：
The following CLI command configures the IPv6 default gateway.
#ipv6 default-gateway <ipv6-address> <cost>
                                         
The following CLI command configures static IPv6 routes.
#ipv6 route <ipv6-prefix/prefix-length> <ipv6-next-hop> <cost> <ipv6-next-hop>  = X:X:X:X::X 

```

参考：

https://www.365jz.com/article/24427

https://blog.csdn.net/Dzjian_/article/details/79886454

https://forums.he.net/index.php?topic=3489.0

静态ipv6

https://blog.csdn.net/aliaichidantong/article/details/102637413

https://blog.csdn.net/tjhon/article/details/12499329

https://blog.csdn.net/aliaichidantong/article/details/101208299

ipv6排错：

https://ssygw.com/91.html

https://zhuanlan.zhihu.com/p/128933023

vim /etc/sysctl.conf

net.ipv6.conf.all.forwarding=1

<disqus/>