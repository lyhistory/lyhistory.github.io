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

## common system log

dmesg -T

journalctl -f

https://unix.stackexchange.com/questions/314985/combining-tail-journalctl



## 案例

### who killed java process?

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

