---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---


## dist system log

https://unix.stackexchange.com/questions/88744/what-is-the-centos-equivalent-of-var-log-syslog-on-ubuntu

+ ubuntu

  /var/log/syslog

  /var/log/auth.log

  dmesg and /var/log/kern.log

  https://stackoverflow.com/questions/11412950/difference-between-dmesg-and-var-log-kern-log

+ centos

  /var/log/messages

  /var/log/secure

/var/log/messsages-20210415 可能包含几天前比如0401的内容，因为会archive

## common system log

dmesg -T

journalctl -f

https://unix.stackexchange.com/questions/314985/combining-tail-journalctl

## 查看 thread dump

https://blog.csdn.net/liwenxia626/article/details/80791704

通过top -Hp <PID>可以查看该进程下各个线程的cpu使用情况；

对于JAVA程序可以：

jstack -F <PID/Thread ID>



## 案例

### java程序莫名其妙“自动关闭” who killed java process?

https://qzy.im/blog/2020/07/oom-killer-killed-java-process-in-linux/

https://askubuntu.com/questions/709336/how-to-find-out-why-process-was-killed-on-server

没有找到 hs_err_pidXXX 文件

`dmesg -T | grep java` 也没有任何信息

https://stackoverflow.com/questions/726690/what-killed-my-process-and-why

https://superuser.com/questions/606448/how-to-discover-what-is-killing-a-process

free -h

看起来内存和swap都很不够

未尝试：

debug crashed application

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/developer_guide/debugging-crashed-application

最后仍然是根据/var/log/messages的错误信息关掉了crontab，从而解决

++ 又一次遇到，这次日志里面是：
Jun 13 19:15:12 sgsg3-clear-v01 kernel: type=1701 audit(1655118912.145:16370687): auid=1000 uid=1000 gid=500 ses=2267378 subj=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 pid=30986 comm="java" reason="memory violation" sig=6
memory violation，不是程序本身有问题就是jvm有问题或者其他os问题，~~只能对java程序加debug参数进行记录~~ 发现java crash之后会在程序路径下生产一个core.XXX文件

### systemd not working

设置的开机启动在某次异常断电重启后没有恢复：
\etc\systemd\system\zookeeper.service
```
[Unit]
Description=The Zookeeper Daemon
Wants=syslog.target

[Service]
Type=forking
User=zookeeper
ExecStart=/bin/zkCli.sh start

[Install]
WantedBy=multi-user.target
```

[An unexpected shutdown from power loss:(note that you have a system boot event without a prior system shutdown event)](https://unix.stackexchange.com/questions/9819/how-to-find-out-from-the-logs-what-caused-system-shutdown):
```
#last -x

runlevel (to lvl 3)   3.10.0-327.el7.x Sun Oct  2 12:34 - 11:20 (94+22:46) <-- the system was running since this momemnt
reboot   system boot  3.10.0-327.el7.x Sun Oct  2 12:34 - 11:20 (94+22:46) <-- then we've a boot WITHOUT a prior shutdown
```
系统异常停机（断电）


/var/log/audit/audit.log
```
type=SERVICE_START msg=audit(1664685262.826:27): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=rsyslog comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685262.944:28): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=NetworkManager comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685263.032:29): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=redis comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685263.239:30): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=kafka comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685263.255:31): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=NetworkManager-dispatcher comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685263.308:32): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=wpa_supplicant comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685263.430:33): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=polkit comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_STOP msg=audit(1664685263.731:34): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=kafka comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=failed'
type=SERVICE_START msg=audit(1664685263.837:35): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=zookeeper comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_STOP msg=audit(1664685263.837:36): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=zookeeper comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_START msg=audit(1664685268.223:37): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=NetworkManager-wait-online comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
type=SERVICE_STOP msg=audit(1664685268.223:38): pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=NetworkManager-wait-online comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
```
可以看到在zookeeper启动前后有 NetworkManager 相关的启动信息，比如NetworkManager-wait-online，所以也许zookeeper启动需要依赖network，再去查一下zookeeper的日志，没有太多发现，只是看到这个时间段确实有error

尝试解决：
```
[Unit]
Description=The Zookeeper Daemon
Documentation=http://zookeeper.apache.org
Wants=syslog.target
Requires=network.target
After=network.target

[Service]
Type=forking
User=zookeeper
Group=zookeeper
ExecStart=/bin/zkCli.sh start

[Install]
WantedBy=multi-user.target

```

https://stackoverflow.com/questions/45222669/centos-7-systemd-requires-and-after-values-for-kafka-to-depend-on-local-zookeepe

仍然无法启动

#systemctl status zookeeper
● zookeeper.service - The Zookeeper Daemon
   Loaded: loaded (/etc/systemd/system/zookeeper.service; enabled; vendor preset: disabled)
   Active: inactive (dead) since Fri 2023-01-27 16:27:07 SGT; 2s ago
  Process: 4032 ExecStart=/apex/apps/clearing/scripts/zookeeper.sh --start (code=exited, status=0/SUCCESS)
 Main PID: 3649 (code=exited, status=127)

vim /apex/apps/clearing/3rd-party/zookeeper/bin/zookeeper.out
Unable to find Java

最终修复
```
[Unit]
Description=The Zookeeper Daemon
Documentation=http://zookeeper.apache.org
Wants=syslog.target
Requires=network.target
After=network.target

[Service]
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin:/jdk/bin
Type=forking
User=zookeeper
Group=zookeeper
ExecStart=/bin/zkCli.sh start

[Install]
WantedBy=multi-user.target
```
### Linux system time temporally jumps
某交易系统时间瞬间（几百毫秒）加了16个小时，造成某条交易信息时间变成盘后，然后触发系统自动闭盘，然后又迅速恢复正常
temporally jump / sudden leap / time sudden shift
https://unix.stackexchange.com/questions/460983/linux-system-time-temporally-jumps

### web server nginx not responding?

可以ping，可以telnet 80端口，但是网站无法访问，之前遇到过一次，是因为路由器或交换机等设备的网络防火墙设置问题，

但是这次是直接在该服务器本机上进行 curl -v http://127.0.0.1 都没有反应（nginx是监听的0.0.0.0:80），/var/log/messages里面有报错信息，跟一个crontab调用的python有关，猜测是因为crontab由于错误消耗了内存或cpu，导致nginx资源被占用而死掉，重启nginx恢复

telnet 跟 curl还是有区别的，比如假设 /etc/profile 里面有设置http proxy，telnet会绕过，curl则不会，