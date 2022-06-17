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

### web server nginx not responding?

可以ping，可以telnet 80端口，但是网站无法访问，之前遇到过一次，是因为路由器或交换机等设备的网络防火墙设置问题，

但是这次是直接在该服务器本机上进行 curl http://127.0.0.1 都没有反应（nginx是监听的0.0.0.0:80），/var/log/messages里面有报错信息，跟一个crontab调用的python有关，猜测是因为crontab由于错误消耗了内存或cpu，导致nginx资源被占用而死掉，重启nginx恢复