---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

剖析Linux网络包接收过程：掌握数据如何被捕获和分发的全过程 https://mp.weixin.qq.com/s/zyqIN3G5xwkQfa1uaU8DmQ

## 基本命令

查端口找pid netstat -anp|grep :80 

pid查程序：

```
//查看程序完整启动命令
cat /proc/21268/cmdline

//查看程序路径
ls -l /proc/21268/exe

ps -lef|grep 21268
ps -eo pid,lstart,cmd |grep pid //程序启动时间
```

### 软硬限制

要知道,在linux的世界里,一切皆文件.因此要实现大的并发量的第一步,修改linux系统的文件标识符限制数,也就是文件打开数量的限制

Soft nofile:开启文件数软限制
 Hard nofile:开启文件数硬限制
 Soft proc:进程数软限制
 Hard proc:进程数硬限制

[Linux最大文件数限制的那些事](https://www.huaweicloud.com/articles/31d10c0fcca16be1e0c478c748bc0c08.html)


```
vim /etc/security/limits.conf
Add inside limits.conf below 2 lines
usrename           hard    core    unlimited
usrename           soft    core    unlimited

$ ulimit -c unlimited
No error shall be seen after executing the command


$ulimit -Hn //查看硬件资源限制
65536
$ulimit -Sn ////软件资源限制
4096

$ps -lef|grep "kafka"

$ls /proc/<kafka pid>/fd | wc -l
```
### Socket Statistics
ss是Socket Statistics的缩写。顾名思义，ss命令可以用来获取socket统计信息，它可以显示和netstat类似的内容。ss的优势在于它能够显示更多更详细的有关TCP和连接状态的信息，而且比netstat更快速更高效。
当服务器的socket连接数量变得非常大时，无论是使用netstat命令还是直接cat /proc/net/tcp，执行速度都会很慢。
ss快的秘诀在于，它利用到了TCP协议栈中tcp_diag。tcp_diag是一个用于分析统计的模块，可以获得Linux 内核中第一手的信息，这就确保了ss的快捷高效。

```
#查看进程使用的socket
# ss -pl
显示所有UDP Sockets
ss -u -a
查看建立的 TCP 连接
ss -tna

使用 -p 选项查看监听端口的程序名称
ss -tlp


```
### dns
/etc/dhcp/dhclient.conf // Change #prepend domain-name-servers line, add the dns you want. Example:
prepend domain-name-servers 1.1.1.1, 8.8.8.8;
https://unix.stackexchange.com/questions/174349/what-overwrites-etc-resolv-conf-on-every-boot



## 端口TCP流量

查看某个端口的tcp连接记录：

https://serverfault.com/questions/193600/how-to-get-a-linux-network-log/193602

```
------------------------------------------------------
--- 通过 iptables
------------------------------------------------------
--- 创建
$iptables -I INPUT -p tcp --dport 9092 -j LOG
$tail -f /var/log/messages

--- 删除
$iptables -L INPUT --line-numbers
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    LOG        tcp  --  anywhere             anywhere             tcp dpt:XmlIpcRegSvc LOG level warning
$iptables -D INPUT 1

--- More
iptables -A INPUT -p tcp --destination-port 9092 -j DROP

------------------------------------------------------
--- 其他
------------------------------------------------------
ss sport eq :10101

ss -tanp | grep 10101
ESTAB      0      0      172.22.16.15:10101              172.22.16.7:9092                users:(("java",pid=21268,fd=46))

ls -al  /proc/21268/fd/46
```



## 检查网卡 network card adapter

```
grep -r -H "eth0" /var/log/
```

## 案例

https://blog.cloudflare.com/this-is-strictly-a-violation-of-the-tcp-specification/



https://serverfault.com/questions/199434/how-do-i-make-curl-use-keepalive-from-the-command-line

```
while :;do echo -e "GET / HTTP/1.1\nhost: $YOUR_VIRTUAL_HOSTNAME\n\n";sleep 1;done|telnet $YOUR_SERVERS_IP 80
```

