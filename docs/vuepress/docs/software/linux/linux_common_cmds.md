## Basic 

查看命令类型:	type 'cmd' 

查看系统：	cat /etc/os-release

man

tldr:	https://tldr.sh/

```
npm install -g tldr 
或者
pip install tldr

sudo ln -s /home/lyhistory/.local/bin/tldr tldr
或者修改.bashrc
export PATH=$PATH:$HOME/.local/bin
```



## GREP

https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/



grep -H -r "syscript" ~ | cut -d: -f1 | sort -u

grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u

find / -type f -name "mysql-connector-java-5.1.24.jar" -print

find / -type f -name "Locations.xml" -print

grep -H -r "/apps/lib" ~ | cut -d: -f1 | sort -u



## du/df

由一次磁盘告警引发的血案 | 你知道 du 和 ls 区别吗？

https://mp.weixin.qq.com/s/BMeSEcQbhC4dcH-oYEtE-g



## crontab

`/etc/crontab`是系统级别的crontab，系统的设置
`crontab -e`是用户级的crontab
linux下实际保存在`/var/spool/cron/username`中

