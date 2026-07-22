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
cat /proc/cpuinfo
uptime

修改hostname:  hostnamectl set-hostname 
HOSTNAME
vim /etc/hosts
vim /etc/sysconfig/network
hostnamectl set-hostname liuyuelocal
/etc/init.d/network restart
查看主机名	hostname
修改主机名(重启后永久生效)	vim /etc/sysconfig/network
    
修改IP(重启后永久生效)	vim /etc/sysconfig/network-scripts/ifcfg-eth0
修改/设置IP和主机名映射	vim /etc/hosts

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
find /datadir -name “hello*” -ls 按文件名称查找，可以使用通配符*
find /home/hadoop  -user hadoop -ls 按照文件所属用户查找，在/home/hadoop路径下查找属于用户hadoop的文件
find / -type d -name "dir-name-here" 2>/dev/null
	https://www.digitalocean.com/community/tutorials/how-to-use-find-and-locate-to-search-for-files-on-a-linux-vps
Find newer than ***
	https://stackoverflow.com/questions/6964747/recursively-find-all-files-newer-than-a-given-time
find . -mtime 1  (find all the files modified exact 1 day)
The + sign is used to search for greater than, - sign is used to search for less than and without a sign is used for exact
find -atime which denotes the last accessed time of the file
find –ctime denotes last changed time
find . -perm 644
find . –iname "error" –print ( -i is for ignore )
find . -maxdepth 1 -type f -newer first_file
find /home/ -type f -size +512M -exec ls -lh {} \;

find . -empty -delete
find . -empty | xargs rm -r
find . -empty -type d -exec rm -r {} \;

find with xargs
find . -name .bash_history -print0 | xargs -0 -I{} grep nohup {}
	Same as find . -name .bash_history -print0 | xargs -0 grep nohup 
	Because what -I {} does is pass param to the next placeholder and the pipeline default put param to the end of the line, no need
find . -name *.txt -prnt0 | xargs -0 -I {} mv {} {}.csv
find . -name "*.tmp" -print | xargs rm –f


find . -size +1G -ls | sort -k7n

find / -type f -name "mysql-connector-java-5.1.24.jar" -print

find / -type f -name "Locations.xml" -print

find / -type d -name 'bin' -print          	

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
-i non case sensitive 
-n  line number
--color    highlight
use `\<' and `\>' to match the start and end of words
grep -l ERROR *.log display only the file names which match the given pattern
grep -w ERROR logfile.txt searches only for instances of 'ERROR' that are entire words; it does not match `SysERROR'.
grep 'ERROR>' * Searches only for words ending in 'ERROR', so it matches the word `SysERROR'
egrep	http://man.linuxde.net/egrep
Grep vs egrep https://blog.csdn.net/qq_41201816/article/details/80767308

pgrep  get pid	


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

### Zip/Unzip
```
1.zip压缩/解压缩，压缩文件后缀名.zip
	zip tes.zip test.txt
	压缩文件夹
	zip -r dirtest.zip dirtest
	解压缩文件/文件夹
	unzip tes.zip/dirtest.zip
2.gzip压缩/解压缩，压缩文件后缀名.gz
	gzip test.txt
	解压gz文件：
	gzip -d test.gz
3.bzip2压缩/解压缩，压缩文件后缀名.bz2
	bzip2 test1
	解压bz2文件
	bzip2 -d test1.bz2
4.打包/解包，打包文件后缀名.tar
	打包：tar -cvf barball.tar ball/
	可以将多个文件打在一个包里
	tar –cvf files.tar file1 file2 file3
	解包：tar -xvf barball.tar
5.一次性完成打包和gzip压缩的操作，文件后缀名.tar.gz
	打压缩包：tar -zcvf tarball.tar.gz ball/
	解压缩包：tar -zxvf tarball.tar.gz
	解压缩到指定路径下
	tar -zxvf tarball.tar.gz -C ./tardir
6.一次性完成打包和bzip2压缩的操作，文件后缀名.tar.bz2
	tar -jcvf bz2dir.tar.bz2 bz2dir/
	将bz2dir.tar.bz2解压到/usr目录下面
	tar -jxvf bz2dir.tar.bz2

tar
Tar -xzvf ***.tar.gz -C **
Check info:: 	tar -ztvf my-data.tar.gz
Unzip: tar -xvzf
https://www.cyberciti.biz/faq/list-the-contents-of-a-tar-or-targz-file/

```
## process
Ps
		Ps -p <PID>
Ps -aux
		Ps -lef | grep Prometheus	WITH HEADER ps -lef|egrep “prometheus|PID”
		ps -ef | grep java | grep JMeter
		Docker ps -a | grep “dev”
		 ls -l /proc/35/exe
 cat /proc/35/cmdline | xargs -0 echo
 ps -p 35 -o cmd

netstat
		Netstat -anp | grep -w 9126
		netstat -lntp | grep :80 https://blog.csdn.net/ibmfahsion/article/details/8997342
		command_here | grep --color -E '^|pattern1|pattern2'
lsof
		 lsof -i :9090
Show more:
ls -l /proc/pid/exe
cat /proc/pid/cmdline
cat /proc/PID/cmdline | xargs -0 echo

Signal 
SIGHUP
Kill -HUP \<PID\>

```
List processes
    chkconfig:
    # chkconfig --list
    systemd:
    # systemctl list-units
Enable a service
    chkconfig:
    # chkconfig <servicename> on
    systemd:
    # systemctl enable <servicename>.service
Disable a service
    chkconfig:
    # chkconfig <servicename> off
    systemd:
    # systemctl disable <servicename>.service
Start a service
    chkconfig:
    # service <servicename> start
    systemd:
    # systemctl start <servicename>.service
Stop a service
    chkconfig:
    # service <servicename> stop
    systemd:
    # systemctl stop <servicename>.service
Check the status of a service
    chkconfig:
    # service <servicename> status
    systemd:
    # systemctl status <servicename>.service
vim /etc/inittab

   0：关闭所有进程并终止系统。（不要设置）
    1：单用户模式，只能系统管理员进入，在该模式下处理在有登录用户时不能进行更改的文件。
    2：多用户的模式，但并不支持文件共享，这种模式很少应用。
    3：最常用的运行模式，主要用来提供真正的多用户模式，也是多数服务器的缺省模式。
    4：一般不被系统使用。
    5：桌面启动模式，如果关闭将不启动桌面程序。
    6：关闭所有运行的进程并重新启动系统。（不要设置）

	Kernel version: Uname -a
	Os version/distribution: lsb_release -a / cat /etc/*-release
Ps kill
https://www.digitalocean.com/community/tutorials/how-to-use-ps-kill-and-nice-to-manage-processes-in-linux
Pkill
Kill -9
Pstree
http://www.linfo.org/pstree.html
	ls /proc
File size:	Ls -lh	du -h
https://www.tecmint.com/find-top-large-directories-and-files-sizes-in-linux/
du -hs * | sort -rh | head -5
 du -sh /opt/* | grep G
df -T
Ss
Top/Htop

systemctl list-units
tune2fs -l /dev/sda1
http://www.361way.com/mke2fs-dumpe2fs-tune2fs/4091.html

监控
tail -f
watch	watch ss -tunpl4
-l | tee dat
sudo sh -c 'tcpdump -i eth0 -c 2 -X port 10001 -l | tee dat'

```

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

CURL
curl -I http://www.example.org
下载 curl -LO 
diff 
	diff -y file1 file2 (side by side)
Cut	cut -d: -f1 /etc/passwd
		https://www.cnblogs.com/wxgblogs/p/6876189.html
wget/sed/sort


## editor vim

replace:
%s:/A/B/g

```

for readonly file:
:w !sudo tee %


VIM
一般模式	ESC
Editor Mode	i/I/a/A/o/O
Visual Mode	V
Visual Block Mode	Ctrl+V(use ctrl+shift+v instead when conflict with windows paste)=> j => Shift+I => type => ESC
底行命令模式	: /
D i “
一般模式
	i  从一般模式进入编辑模式，此模式下可以输入内容；
	o  从一般模式进入编辑模式并且是光标所在行的下一行开始输入内容；
a  在光标后一位开始插入
	A  在该行的最后插入
	I  在该行的最前面插入
	gg 直接跳到文件的首行
	G  直接跳到文件的末行
	dd 删除行，输入2dd，则一次性删除光标所在行一下的2行
	yy 复制当前行,复制多行“num+yy”，如复制三行3yy，则复制当前行和后2行
	p  粘贴
	u  撤销到上一步操作，多次撤销按多次u；shift u
	Ctl+r : redo
Visual Mode
	v  进入字符选择模式，选择完成后，按y复制，按p粘贴,v+w (select word)
Visual Block Mode
	ctrl+v  进入块选择模式，选择完成后，按y复制，按p粘贴
	shift+v  进入行选择模式，选择完成后，按y复制，按p粘贴

底行命令模式
	在一般模式下按:冒号进入命令模式操作，输入 %s/被替换的内容/新替换的内容，如下：
	%s/hello/hi 查找文件中所有hello，替换为hi

	在一般模式下输入“/查找的内容”，如下：
	/hi查找文件中出现的hi，并定位到第一个找到的地方，按n可以定位到下一个匹配位置（按N定位到上一个）

```

Color https://alvinalexander.com/linux/vi-vim-editor-color-scheme-colorscheme
	如何优雅地使用 Vim？ https://www.zhihu.com/question/20833248
	https://www.server-world.info/en/note?os=CentOS_7&p=initial_conf&f=7

Sudo vim 不会读取/home/user/.vimrc所以如果apply到所有user,需要append给/etc/vimrc

## tmux / screen
```
keep a process alive after closing the putty session / keep process working after terminating the current session
Tmux: (window & pane, recommend)
	tmux ls
	tmux attach -t **
	Ctrl b + % Split vertially
Ctrl b + “ Split horizontally
Ctrl b + c New window
Ctrl b + arrow switch between pane
Ctrl b + p/n switch between window
Exit 
Ctrl b + d/D deattach 
tmux new -s database
tmux rename-session -t 0 database
	Ctrl b + ? more
https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/
	Copy mode: 
ctrl b+[ =>enter copy mode, then hit space to start, then arrow key to select, then ENTER to copy, finally ctrl b+] to paste
Copy and paste buffer to file
http://www.rushiagr.com/blog/2016/06/16/everything-you-need-to-know-about-tmux-copy-pasting-ubuntu/
https://unix.stackexchange.com/questions/26548/write-all-tmux-scrollback-to-a-file
Ctrl b+[=>copy mode, then hit space to start, then arrow key to select, then gg to copy the whole pane, then y, then go to another pane and open vim, enter edit mode, then ctrl b+] to paste

https://gist.github.com/MohamedAlaa/2961058
退出方式：
Ctrl+ b d or Ctrl+ b :detach
Exit 
Ctrl b + x (kill pane)
Ctrl b + & (kill window)
c           new window
,           name window
w           list windows
f           find window
&           kill window
.           move window - prompted for a new number
:movew<CR>  move window to the next unused number
:resize-p -D/-U/-L/-R
Force resize tmux: tmux attach -d
Tmux plugin manager
	https://github.com/tmux-plugins/tpm
Tmux plugins / workflow
	https://github.com/tmux-plugins/tmux-resurrect
	https://github.com/tmux-plugins/tmux-resurrect/blob/master/docs/restoring_pane_contents.md
	set -g @resurrect-capture-pane-contents 'on'
	For manually install, don’t forget to 
		chown -R clear:gapp /home/clear/.tmux/plugins/tmux-resurrect/
		chmod u+x ~/.tmux/plugins/tmux-resurrect/resurrect.tmux
		chmod u+x ~/.tmux/plugins/tmux-resurrect/scripts/*.sh
		chown -R clear:gapp /home/clear/.tmux/plugins/tpm/
		chmod u+x /home/clear/.tmux/plugins/tpm/scripts/*.sh
		chmod u+x /home/clear/.tmux/plugins/tpm/tpm
	And run in root mode:
 ~/.tmux/plugins/tmux-resurrect/resurrect.tmux
Or tmux source-file ~/.tmux.conf (returned 126; check chown/chmod)
prefix + Ctrl-s - save
prefix + Ctrl-r - restore
Tmux tips: edit ~/.tmux.conf
	Customize bind key to synchronize operate
	bind-key X set-window-option synchronize-panes\; display-message "synchronize-panes is now #{?pane_synchronized,on,off}"
	set -g pane-border-status top
set -g pane-border-format '#(sleep 0.25; ps -t #{pane_tty} -o args= | tail -n 1)'
printf '\033]2;%s\033\\' 'title goes here'

```

## todo
```
Cmd execute logic
	&?
	&&
	||
Variable
env
	version=’uname’
	Echo $($version)
	Unset version

touch filename
mv -t DESTINATION file1 file2 file3
rm filename（会有提示是否删除）
rm –f filename（强制删除）
mkdir dirname
mkdir -p dir1/dir2/dir3（递归创建文件夹）
mkdir dir/{dir1,dir2}在dir在已存在的dir文件夹下同时创建dir1和dir2两个文件夹
rm -r dirname（会有提示是否删除文件夹）
rm -rf dirname（强制删除文件夹，没有提示）
cat filename 全部输出到控制台
more filename 分页显示，按空格下翻页，按b字母键上翻页，按q字母键退出
less filename 分页显示，按空格下翻页，按b字母键上翻页，按上箭头（↑）上翻一行，按下箭头（↓）下翻一行
tail -f filename	Linux中每一个文件有一个inode，文件名修改inode编号不变，当文件修改名称后tail -f 继续跟踪原inode编号文件；不支持文件滚动。
tail -F filename	按照文件名称跟踪文件，文件修改名称后，有新的文件如果使用原文件名称，则继续跟踪该名称文件；支持文件滚动。
tail -num filename
head -num filename

chmod u/g/o +/- r/w/x 表示给文件的用户/组/其他添加或者取消读写执行权限
chmod u+x filename表示为文件/文件夹所属用户添加可执行权限
chmod u-x filename 表示为文件/文件夹所属用户删除可执行权限
chmod g-rw filename表示将文件/文件夹对所属组的rw权限取消
chmod o-rw filename表示将文件/文件夹对其他人的rw权限取消
chmod 774 finame rwxrwxr--对应的二进制111111100每组换算成十进制数字774
chmod -R 777 dirname/ 将一个文件夹的所有内容权限统一修改，则可以使用-R参数
chmod 400 id_rsa
	chmod 777 script.sh
chmod -R o+w ./data
Umask (change new file)
		umask 0022 >> /etc/profile echo umask 0022 >> sudo /etc/profile
		https://teczuz.com/whats-behind-the-linux-umask/
chown <username>:<groupname> targefolder -R 修改文件owner chown
  
注意：目录没有执行权限的时候普通用户不能进入，owner也不可以,当文件具有读写权限时，虽然没有执行权限，如果该文件父文件夹具有写权限普通用户可以在文件夹中删除该文件，这样的删除操作属于对父级文件夹的修改。如果父文件夹没有写权限普通用户是不能再文件夹中删除文件的。

```