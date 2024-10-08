---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---


## Basic 

### 系统参数：	

```
查看命令类型:	type 'cmd' 

cat /etc/os-release

修改hostname:  hostnamectl set-hostname 
```

### 帮助文档：

man AND tldr:	https://tldr.sh/

```
npm install -g tldr 
或者
pip install tldr

cd /usr/bin
sudo ln -s /home/lyhistory/.local/bin/tldr tldr (/usr/bin/tldr)
或者修改.bashrc
export PATH=$PATH:$HOME/.local/bin
```

## user and groups

```
查看用户：
id username
W
Whoami
groups
vim /etc/passwd
cut -d: -f1 /etc/passwd

用户组：
groups username
less /etc/group
groupadd groupname
groupdel groupname
su username #切换用户 
添加新用户： 
useradd username
passwd username
usermod -g groupname username -d /home/test
useradd -g groupname username -d /home/test （注意，最好用home目录，之前碰到过一个问题：用其他系统盘或数据盘，其他人更改了文件夹权限，造成.ssh/id_rsa权限过大，不满足系统安全要求，造成passwordless login失败）
userdel username
gpasswd -d groupname username

/etc/sudoers
visudo

---------------------------------------------------------------------------------------
--- ubuntu
---------------------------------------------------------------------------------------
Enable SUDO:
	By default sudo is not installed on Debian, but you can install it. First enable su-mode:
	You can use sudo -i which will ask for your password. You need to be in the sudoers group for that or have an entry in the /etc/sudoers file.
	Another way is the command su - which will ask for the password of root, but accomplish the same.
	su -
	apt-get install sudo -y
	
    usermod -aG sudo yourusername
    Make sure your sudoers file have sudo group added. Run:
    visudo to modify sudoers file and add following line into it (if it is missing):

    # Allow members of group sudo to execute any command
    %sudo   ALL=(ALL:ALL) ALL
    OR
    chmod u+w /etc/sudoers
    username ALL=(ALL) ALL
    chmod u-w /etc/sudoers

adduser username 
sudo passwd USERNAME
sudo usermod -aG sudo username
su - username
exit;
sudo useradd test -s /bin/bash -m
usermod -aG docker peter


---------------------------------------------------------------------------------------
--- centos
---------------------------------------------------------------------------------------
Enable SUDO:
    By default, on CentOS, members of the wheel group have sudo privileges.
    https://support.hostway.com/hc/en-us/articles/115001509750-How-To-Install-and-Configure-Sudo

useradd -s /bin/bash -m -G wheel username
sudo usermod -aG wheel username
Wheel group https://www.centos.org/forums/viewtopic.php?t=63386


ssh-keygen 
or
ssh-keygen -t rsa

chmod 400 id_rsa

ssh-copy-id username@serveripOrhostname
or 
ssh-copy-id -i ~/.ssh/id_rsa.pub username@serveripOrhostname

scp ~/.ssh/id_rsa grs@adp116:~/.ssh

ssh-keygen -R ip/hostname

```

## String Operation

```
多行变成一行，逗号隔开（去掉最后一个逗号）
tr '\n' ',' < input.txt | sed 's/,$/\n/'


cut -f 1 -d: /etc/passwd | xargs -n 1 -I {} bash -c " echo -e '\n{}' ; chage -l {}"
```

## File Operation

### vim

replace:
%s:/A/B/g

```

for readonly file:
:w !sudo tee %

```

### compress
tar -zxvf file.tar
tar -zcvf file.tar /path/to/target

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

find zookeeper/ -group root

find ./* -type f -follow -name \*.log -daystart -mtime +1 -print0 | xargs -0 rm

find and delete::
https://unix.stackexchange.com/questions/167823/finds-exec-rm-vs-delete
find / -name ".DS_Store" -exec rm {} \;
find / -name .DS_Store -delete
A common method for avoiding the overhead of spawning an external process for each matched file is:
find / -name .DS_Store -print0 | xargs -0 rm
DO NOT do this: find / -delete -name .DS_Store

```

### GREP/zgrep

-a, --text
              Process a binary file as if it were text; this is
              equivalent to the --binary-files=text option.
-i, --ignore-case
              Ignore case distinctions in patterns and input data, so
              that characters that differ only in case match each other.

https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/

```
grep/zgrep "pattern" file/file.gz

grep -r -l "eth[0-9]" /var/log/ #file name only
grep -r -H "eth[0-9]" /var/log/ #print each match and filename

grep -H -r "syscript" ~ | cut -d: -f1 | sort -u

grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u

grep -H -r "/apps/lib" ~ | cut -d: -f1 | sort -u


cat Syslog.log | iconv -f GBK -t UTF-8|grep -ai "SEARCH TEXT"

```

#### batch replace string in folder
```
grep -rl oldtext . | xargs sed -i 's/oldtext/newtext/g'
```

### split

```
split -a 4 -d -l 20000 2021-02-15_test.log ./test/test_
```

### sed
https://www.runoob.com/linux/linux-comm-sed.html?ivk_sa=1023231z
`sed [-hnV][-e<script>][-f<script文件>][文本文件]`

参数说明：

-e<script>或--expression=<script> 以选项中指定的script来处理输入的文本文件。
-f<script文件>或--file=<script文件> 以选项中指定的script文件来处理输入的文本文件。
-h或--help 显示帮助。
-n或--quiet或--silent 仅显示script处理后的结果。
-V或--version 显示版本信息。

动作说明：

a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)～
c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行！
d ：删除，因为是删除啊，所以 d 后面通常不接任何东东；
i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)；
p ：打印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行～
s ：取代，可以直接进行取代的工作哩！通常这个 s 的动作可以搭配正则表达式！例如 1,20s/old/new/g 就是啦！

Example:
```
sed -i 's/#*port = .*/port = 5432/' /postgres/data/postgresql.conf
```

### awk 
[awk 是一种处理文本文件的语言，是一个强大的文本分析工具](https://www.runoob.com/linux/linux-comm-awk.html)

## du/df

由一次磁盘告警引发的血案 | 你知道 du 和 ls 区别吗？

https://mp.weixin.qq.com/s/BMeSEcQbhC4dcH-oYEtE-g

```
df -h
du -sh ./*
```

## xargs

```
ls | grep -xv "except this file.txt" | xargs rm -rf
```

## crontab

`/etc/crontab`是系统级别的crontab，系统的设置
`crontab -e`是用户级的crontab
linux下实际保存在`/var/spool/cron/username`中

crontab是分用户的，默认为当前用户，可以通过-u指定用户

日志

https://unix.stackexchange.com/questions/207/where-are-cron-errors-logged

/var/log/cron

/var/spool/mail/root

邮件： 

```
MAILTO=my.offsite.email@example.org
00 15 * * *  echo "Just testing if crond sends email"
```

You (trade) are not allowed to access to (crontab) because of pam configuration.

问题排查思路：

检查crond权限。
1、cat /etc/corn.deny，文件是空的。
2、ll /usr/bin/crontab，具备S权限位，正常。

检查PAM模块。
cat /etc/pam.d/crond

查看系统日志
cat /var/log/secure

Jan 24 19:20:01 sghc1-prod-mdapi-v01 crond[19391]: pam_unix(crond:account): expired password for user test (password aged)
设置永不过期
```
# chage -l test
# chage -M 99999 test
```

## history

history with datetime
```
~/.bashrc:
export HISTTIMEFORMAT="%d/%m/%y %H:%M "
```

Delete your Linux history without leaving a trace!
```
for i in {1..N}; do history -d START_NUM; done

#Delete your Linux history without leaving a trace!
history -d $((HISTCMD-1)) && history -d [line entry number]


```

## remote

ssh rsh 

https://blog.csdn.net/jiangyu1013/article/details/79721053


Linux 安全运维必备 150 个命令汇总
https://zhuanlan.zhihu.com/p/546399931

Linux 最常用命令：能解决 95% 以上的问题
https://mp.weixin.qq.com/s/jL-yDpKAI9Jiq8Qmi11kYg