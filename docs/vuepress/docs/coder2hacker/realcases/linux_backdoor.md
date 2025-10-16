[网络安全技能大赛之Linux后门排查](https://mp.weixin.qq.com/s/SVxAYhdGbUhUT5AurmmJtw)

一、tcpdump 捕获检测流量
如果比赛的检测脚本使用明文流量进行检测，当检测某个webshell是否被删除，检测脚本会发起对webshell的访问，这时我们可以采用抓包的方式，就可以获得需要删除的webshell名字和路径。

监听指定网卡 ens33 的所有传输数据包
`> tcpdump  -i  ens33`

捕获主机 192.168.100.10 经过网卡 ens33 的所有数据包

`> tcpdump -i ens33 host 192.168.100.10  `

捕获主机 192.168.56.210 接收和发出的 tcp 协议的 ssh 的数据包

`> tcpdump tcp port 22 and host 192.168.56.210`

过滤端口号 22-433 内的数据包

`>  tcpdump portrange 22-433 -i ens33 -n -c 8`

保存捕获的数据包

`>  tcpdump  -i ens33 -w ./1.pcap`

二、查看网站日志

以webshell为例，比赛时检测某个webshell是否被删除，检测脚本会发起对webshell的访问，这时我们通过查看web日志，就可以获得需要删除的webshell名字和路径。

三、常用命令

查看历史命令

`history`
查找某时间段修改的文件

`find / -newermt '2024-07-10 18:00:00' ! -newermt '2024-07-10 19:00:00'`
查看后门用户

`查找uid为0的后门账户 cat /etc/passwd`

`cat auth.log.1 | grep -a "new user"`
查找webshell

可下载网站源码后用D盾扫描

`find ./ -name "*.php" | xargs grep --color=auto "eval("`
免杀马可能使用base64进行加密 特征肯定会有GET接收参数或POST也可以当做一个过滤点

`find ./ -name "*.php" | xargs grep "base"`
`find ./ -name "*.php" | xargs grep GET`
查看可疑进程

`netstat -anopt`

查看可疑PID进程的cmdline

`cat /proc/pid/cmdline`

查看ssh登录IP

ssh登录日志位于/var/log/secure或/var/log/auth.log文件中

` cat /var/log/secure | grep -a "Accept”`

ssh登录失败情况

`cat auth.log.1 | grep -a "Failed password for root" | awk '{print $11}' |sort | uniq -c `
find查找Mysql的配置文件

`find ./ -name "*.php" | xargs grep "127.0.0.1”`
查找黑链

`find ./ -name "*.php" | xargs grep "黑链"`
find查找隐藏的文件

`find / -type f -name '.*' 2>/dev/null | grep -v "sys"`
find查找隐藏的文件夹

`find / -type d -name '.*' 2>/dev/null | grep -v "sys"`

查找木马文件

linux下的木马文件一般为elf后缀 可以直接搜索elf后缀的文件

`find ./ -name "*.elf"`
查看计划任务

`查看计划任务  crontab -l`

`隐藏的计划任务后门查看 cat -A /var/spool/cron/root`

`编辑用户的计划任务     crontab -e`

`删除计划任务          crontab -r`

查看alias后门

`alias`
删除alias后门

`unalias 后门名字`
可能隐藏在/etc/profile 、 /etc/bashrc 、~/.bashrc 、~/.bash_profile 、~/.profile、~/.bash_logout、~/.bash_aliases 等文件里。

TCP Wrapper后门

`查看 /etc/hosts.allow`

软链接SSH后门命令

```
查看可疑端口 netstat -antlp

查看可执行文件 ls -al /tmp/su

禁止PAM认证  vim /etc/ssh/sshd_config  UsePAM no
关闭可疑进程 kill -s 9 PID

重启SSH服务
```

文件锁定（权限隐藏）
```lsattr evil.php #属性查看
chattr -i evil.php #解除锁定
rm -rf evil.php #彻底删除⽂件
```

查找SUID文件

利用SUID提权的思路就是运行root用户所拥有的SUID的文件，那么我们运行该文件的时候就需要获得root用户的身份了。
```
find / -user root -perm -4000 -exec ls -ldb {} \;

取消s权限例如 chmod u-s /usr/bin/find
```