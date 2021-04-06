## 软硬限制

要知道,在linux的世界里,一切皆文件.因此要实现大的并发量的第一步,修改linux系统的文件标识符限制数,也就是文件打开数量的限制

Soft nofile:开启文件数软限制
 Hard nofile:开启文件数硬限制
 Soft proc:进程数软限制
 Hard proc:进程数硬限制

[Linux最大文件数限制的那些事](https://www.huaweicloud.com/articles/31d10c0fcca16be1e0c478c748bc0c08.html)



```
$ulimit -Hn //查看硬件资源限制
65536
$ulimit -Sn ////软件资源限制
4096

$ps -lef|grep "kafka"

$ls /proc/<kafka pid>/fd | wc -l
```

## 端口流量

查看某个端口的tcp连接记录：

https://serverfault.com/questions/193600/how-to-get-a-linux-network-log/193602

```
--- 创建
$iptables -I INPUT -p tcp --dport 9092 -j LOG
$tail -f /var/log/messages

--- 删除
$iptables -L INPUT --line-numbers
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    LOG        tcp  --  anywhere             anywhere             tcp dpt:XmlIpcRegSvc LOG level warning
$iptables -D INPUT 1


```

## 检查网卡 network card adapter

```
grep -r -H "eth0" /var/log/
```

