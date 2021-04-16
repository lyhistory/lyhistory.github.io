## Basic 

查看命令类型:	type 'cmd' 

查看系统：	cat /etc/os-release

man

tldr:	https://tldr.sh/

```
npm install -g tldr 
或者
pip install tldr

cd /usr/bin
sudo ln -s /home/lyhistory/.local/bin/tldr tldr (/usr/bin/tldr)
或者修改.bashrc
export PATH=$PATH:$HOME/.local/bin
```

## File Operation

### vim

```


```



### transfer

include hidden file: add the dot in the ending

```
scp -rp src/. user@server:dest/
```

### files&directory

```
创建文件夹
install -d /path/to/targetfolder
```

### FIND

```
find . -size +1G -ls | sort -k7n

find / -type f -name "mysql-connector-java-5.1.24.jar" -print

find / -type f -name "Locations.xml" -print

//kafka/logs下面有很多日志，格式为：[server|controller].log.YYYY-MM-DD-0X，如果想大概知道有哪几类文件，可以：
find . -type f -maxdepth 1 -exec basename "{}" \; | cut -d'.' -f1 | sort -u
```

### GREP/zgrep

https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/

```
grep/zgrep "pattern" file/file.gz

grep -r -l "eth[0-9]" /var/log/ #file name only
grep -r -H "eth[0-9]" /var/log/ #print each match and filename

grep -H -r "syscript" ~ | cut -d: -f1 | sort -u

grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u

grep -H -r "/apps/lib" ~ | cut -d: -f1 | sort -u


```

### split

```
split -a 4 -d -l 20000 2021-02-15_test.log ./test/test_
```



## du/df

由一次磁盘告警引发的血案 | 你知道 du 和 ls 区别吗？

https://mp.weixin.qq.com/s/BMeSEcQbhC4dcH-oYEtE-g

```
df -h
du -sh ./*
```

## crontab

`/etc/crontab`是系统级别的crontab，系统的设置
`crontab -e`是用户级的crontab
linux下实际保存在`/var/spool/cron/username`中

crontab是分用户的，默认为当前用户，可以通过-u指定用户

日志

/var/log/cron

/var/spool/mail/root

## history

```
#Delete your Linux history without leaving a trace!
history -d $((HISTCMD-1)) && history -d [line entry number]
```

## remote

ssh rsh 

https://blog.csdn.net/jiangyu1013/article/details/79721053