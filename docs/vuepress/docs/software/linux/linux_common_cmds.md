type 'cmd' 查看命令类型



cat /etc/os-release

$ tmux -f ~/.tmux.conf
$ echo $TMUX
/tmp/tmux-1001/default,22984,0



GREP

https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/



grep -H -r "syscript" ~ | cut -d: -f1 | sort -u

grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u

find / -type f -name "mysql-connector-java-5.1.24.jar" -print

find / -type f -name "Locations.xml" -print

grep -H -r "/apex/apps/clearing/lib" ~ | cut -d: -f1 | sort -u

由一次磁盘告警引发的血案 | 你知道 du 和 ls 区别吗？

https://mp.weixin.qq.com/s/BMeSEcQbhC4dcH-oYEtE-g