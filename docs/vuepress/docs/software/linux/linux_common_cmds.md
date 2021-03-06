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
useradd -g groupname username -d /home/test
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
sudo useradd xiaofeng -s /bin/bash -m
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


ssh-keygen -t rsa
chmod 400 id_rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub username@serveripOrhostname
scp ~/.ssh/id_rsa grs@adp116:~/.ssh

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

find zookeeper/ -group root
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