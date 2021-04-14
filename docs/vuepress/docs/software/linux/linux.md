整理 google doc：Basics: Linux Basic

## 命令执行本质

一个命令行终端是一个shell进程，在这个终端里执行的程序都是作为该shell进程的子进程。
如果子进程命令阻塞终端shell进程，shell进程就会等待子进程退出才能接收其他命令；
如果关掉了shell终端，，依附的所有子进程都会退出；
加上&号可以避免这种情况，原理是将命令挂在systemd系统守护进程名下，其他办法还有nohup或者开tmux或者screen，并且加&可以让shell进程不再阻塞，从而继续响应新命令；

set -x 可以显示shell在执行什么程序

当使用 sudo 时，系统会使用 /etc/sudoers 这个文件中规定的该用户的权限和环境变量

## 重定向/管道

![](/docs/docs_image/software/linux/linux_redirect01.png)

+ 重定向

  输入<+输出流>

  `exec 8<> /dev/tcp/www.baidu.com/80`

  重定向到文件：`> file`

  重定向到文件描述符要加&`>& fd`

  `echo -e "GET / HTTP/1.0\n" 1>& 8`
  `cat 0<& 8 或 cat<&8`

+ **标准输出重定向：**

  比如标准输出重定向 java -jar **.jar > log.txt

  2>&1 标准错误输出重定向到标准输出

  如果需要sudo权限，可以用tee：sudo tee

  ```
  cat shopee.sg.domain.uniq | filter-resolved > shopee.sg.domain.uniq.resolved
  cat shopee.sg.domain.uniq | filter-resolved | sudo tee shopee.sg.domain.uniq.resolved
  ```

+ **标准输入重定向：管道|和<<< 以及命令替换$()：**

  首先$()主要则是command substitution，比如

  ```
  rm $(where connect.sh)
  
  dos2unix $(find . -type f)
  ```

  

  echo $(cmd) 和 echo "$(cmd)"，结果差不多，但是仍然有区别。注意观察，双引号转义完成的结果会自动增加单引号，而前者不会， 如果 $ 读取出的参数字符串包含空格，应该用双引号括起来，否则就会出错。

  管道：

  `ps -aef | grep -v grep | grep "java -server -jar" | awk '{print $2}'`
  $(2)获取管道前面等输出结果第二列,此时可以用$2替代；

  `yes|cp -r source_folder target_folder/`

  标准输入重定向符：

  \<<< String 比如脚本中读取第一个参数并取分隔'\'的第一个值 ```IFS='/' read -ra target_arr <<< "$1"```

+ **位置参数${}：**

  ${}主要是作为positional parameter，

  $｛2｝还可以表示获取脚本输入参数等第二个，此时也可以用$2替代，$#是输入参数个数；

  ```
  $ animal=cat
  $ echo $animals
  # No such variable as “animals”.
  $ echo ${animal}s
  cats
  ```

  {}https://askubuntu.com/questions/339015/what-does-mean-in-the-find-command

  https://labuladong.gitbook.io/algo/di-wu-zhang-ji-suan-ji-ji-shu/linux-jin-cheng https://labuladong.gitbook.io/algo/di-wu-zhang-ji-suan-ji-ji-shu/linuxshell

  difference between ${} and $() in shell script https://superuser.com/questions/935374/difference-between-and-in-shell-scriptcd /proc/$$/fd $$代表当前解释程序

+ **哪些命令接受标准输入**

  命令默认都接受参数 -argument，有些命令还接受标准输入（可以使用管道符|和重定向符< <<<）,
  简单判别方式：命令是否可以阻塞终端（如cat不加任何命令会阻塞终端）
  如 echo"trade:trade"|chpasswd 

## 用户身份和权限

```
su _gvm
This account is currently not available.

sudo -u _gvm gvmd --migrate
sudo su -l _gvm -s /bin/bash

sudo sh -c "cmds"


```



Permissions take a different meaning for directories. Here's what they mean:

-  **r**ead determines if a user can view the directory's contents, i.e. do ls in it.
-  **w**rite determines if a user can create new files or delete file in the directory. (Note here that this essentially means that a user with write access toa directory can delete files in the directory *even* if he/she doesn't have write permissions for the file! So be careful with this.)
-  e**x**ecute determines if the user can cd into the directory.

## 安装包管理

### 不同发行版选择

+ Ubuntu / kali / parrotOS

  based on debian,

+ Centos 

  for bigdata

+ Redhat 

  for databases(because those database companies use redhat, it’s tested)

### 基本安装方法

+ apt或yum安装

  add to apt/yum repository, and then apt-get/yum install *** 

  Normally will be put in **/usr/bin/**

  Additionally, you can use `yum localinstall <packagename>` to intelligently install dependencies as needed.

  Know the version before installing:

  `apt policy <packagename>`

  `yum info/search <packagename>`

+ deb或rpm安装 

  download deb for ubuntu or rpm for centos, and install it, it will help you install all related dependencies

  + 版本

    amd64, i386,x64[ https://askubuntu.com/questions/32402/amd64-i386-32bit-64bit-which-version-to-choose](https://askubuntu.com/questions/32402/amd64-i386-32bit-64bit-which-version-to-choose)

  + 包类型：dpkg(Ubuntu) , rpm(centos)

    http://linuxintro.org/index.php?title=Dpkg-rpm_equivalent_commands&redirect=no
    
    deb for debian
    
    ```
    dpkg -i google-chrome-stable_current_amd64.deb
    apt install ./google-chrome-stable_current_amd64.deb
    ```
    
    rpm for # CentOS/RHEL
    
    ```
    rpm -Uvh gitlab-ce-<version>.rpm
    如果是第一次安装可以用rpm -ivh gitlab-ce-<version>.rpm
    yum localinstall gitlab-ce-<version>.rpm
    ```
    
    

+ 解压直接使用 download tar file, and extract, then:

  1) set env variable or persist it in:
  
  ​	e.g. export PATH=$PATH:/usr/local/go/bin
  
  ​	i) 特定用户的PATH  ~/bashrc  ~/bash_profile
  
  ​	ii) system wide全局PATH /etc/profile或/root/.bashrc  (/etc/environment?)
  
  Anything in `~/.profile` and `~/.bashrc` is run *after* `/etc/profile` and `/bash.bashrc` 
  
  所以如果是修改了/etc/profile对root或sudo操作无效，要看下root下面的~/.bashXXX是不是有PATH设置，
  
  如果还不生效，就要看下 Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin，可以使用 sudo -E 绕过
  
  For some setups the `-E` switch will not work. To "workaround" it you can use `sudo env "PATH=$PATH" bash`. This will also carry your current `$PATH` forward to your `sudo` environment.
  
  2) or just mv it into /usr/local/bin/
  
  3) or link
  
  ​	`cd /usr/bin sudo ln -s /home/lyhistory/.local/bin/tldr tldr` OR
  
  ​	`sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin`
  
  缺点: if there is dependencies, you have to manually install them
  
+ 源码编译安装

  configuration或cmake之后make install，通常安装的路径在 install_manifest.txt，所以删除方式：`cat install_manifest.txt | xargs echo sudo rm | sh`
  
  > The steps:
  >
  > 1. The `autogen.sh` script generates the `configure` script (from `configure.ac`, using autoconf) and any files it needs (like creating `Makefile.in` from `Makefile.am` using automake). This requires autotools to be installed on your system, and it must be run when checking out the project from source control (if `configure` isn’t checked in). People who download source tarballs can usually skip this step, because output of this step is included in source tarballs.
  >
  >    **Note** This is usually equivalent to `autoreconf --install`. If there is not `autogen.sh` file, then just run `autoreconf --install` instead. If you have inherited a project with an `autogen.sh`, consider deleting it if you can use `autoreconf --install`.
  >
  > 2. The `configure` script generates `Makefile` and other files needed to build. Typically `Makefile.in` is used as a template to generate `Makefile` (and `config.h.in` to generate `config.h`). This process happens using only standard tools installed on your system, like sed and awk, and doesn't require autotools to be installed.
  >
  > 3. The `make` command builds the software.
  >
  > 4. The `make install` command installs it.
  >
  > https://stackoverflow.com/questions/50044091/what-is-the-job-of-autogen-sh-when-building-a-c-package-on-linux
  
  

常见问题：

+ 前面几种安装方法的比较：rpm -ivh -uvh VS yum install vs yum localinstall

  [https://serverfault.com/questions/825320/difference-between-rpm-ivh-package-and-yum-install-package#:~:text=there%20is%20no%20difference%20if,works%20with%20file(s).](https://serverfault.com/questions/825320/difference-between-rpm-ivh-package-and-yum-install-package#:~:text=there is no difference if,works with file(s).)

+ 安装后管理

  + rpm包安装的，可以用rpm -qa | grep "软件或者包的名字"。
  + deb包安装的，可以用dpkg -l | grep "软件或者包的名字"；
  + yum方法安装的，可以用yum list installed | grep "软件名或者包名"；
  + apt方法安装的，apt list --installed|grep "TEXT"
  + 如果是以源码包自己编译安装的，例如.tar.gz或者tar.bz2形式的，这个只能看可执行文件是否存在了，如果是以root用户安装的，可执行程序通常都在/sbin:/usr/bin目录下。

+ 安装后找不到命令，因为安装的位置不在系统path上，可以参考上面的“解压后使用”的方式中的，link或设置环境变量方式来搞；


### apt

```
apt vs apt-get
apt update
apt upgrade / apt full-upgrade
apt search "PKG"
apt list --installed | grep "PKG"

```



### yum

```
yum history
yum history info 21


[root@liuyuelocal ~]# yum repolist
Loaded plugins: fastestmirror, langpacks
Repodata is over 2 weeks old. Install yum-cron? Or run: yum makecache fast
Determining fastest mirrors
 * base: mirror.newmediaexpress.com
 * epel: mirrors.aliyun.com
 * extras: mirror.newmediaexpress.com
 * updates: mirror.newmediaexpress.com
repo id                                                                                   repo name                                                                                                       status

!base/7/x86_64                                                                            CentOS-7 - Base                                                                                                 10,097

!docker-ce-stable/x86_64                                                                  Docker CE Stable - x86_64                                                                                           63

!epel/x86_64                                                                              Extra Packages for Enterprise Linux 7 - x86_64                                                                  13,499

!extras/7/x86_64                                                                          CentOS-7 - Extras                                                                                                  307

!ius/x86_64                                                                               IUS for Enterprise Linux 7 - x86_64                                                                                714

!updates/7/x86_64                                                                         CentOS-7 - Updates                                                                                                 997

repolist: 25,677


#yum repolist
Loaded plugins: product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.
repo id                                                                              repo name                                                                                                            status

nodesource/x86_64                                                                    Node.js Packages for Enterprise Linux 7 - x86_64                                                                         37

repolist: 55,117
```

DNF, or Dandified Yum, which is the next major version of the Yum  package manager was introduced with Fedora 18. As of Fedora 22, it has  become the default package manager.

https://www.rootusers.com/how-to-install-dnf-package-manager-in-centosrhel/



## 基础服务

### 网络

**Ubuntu**

注意,对于Ubuntu 17.10 switched from ifupdown (which uses the /etc/network/interfaces file) to netplan,

所以新版本已经找不到 /etc/network/interfaces

netplan貌似只是个接口: https://netplan.io/examples/

具体的控制还是: NetworkManager 和 networkd, 其中desktop版本默认是 NetworkManager，而对于无UI的server版本只能用networkd
https://askubuntu.com/questions/1031439/am-i-running-networkmanager-or-networkd

```
To configure netplan, save configuration files under /etc/netplan/ with a .yaml extension (e.g. /etc/netplan/config.yaml), then run sudo netplan apply. This command parses and applies the configuration to the system. Configuration written to disk under /etc/netplan/ will persist between reboots.

---------------------------------------------------------
对于NetworkManager:
---------------------------------------------------------
First any interfaces defined in /etc/network/interfaces are ignored by network-manager. (man 5 NetworkManager)
systemctl status network-manager

vim /etc/netplan/01-network-manager-all.yaml
# Let NetworkManager manage all devices on this system
network:
  version: 2
  renderer: NetworkManager       

UI是使用NetworkManager,所以直接打开控制面板来设置静态IP和DNS即可
address 192.168.0.109
netmask 255.255.255.0
gateway 192.168.0.1
DNS: 8.8.8.8
设置完等一会即可    

---------------------------------------------------------
对于Networkd：
---------------------------------------------------------
systemd-networkd will only manage network addresses and routes for any link for which it finds a .network file with an appropriate [Match] section. (man 8 systemd-networkd).
systemctl status systemd-netword

vim /etc/netplan/01-network-manager-all.yaml
network:
    version: 2
    renderer: networkd
    ethernets:
        enp3s0:
            dhcp4: true

```



**Debain based : Kali**

```
--- for debain:
配置静态ip
/etc/network/interfaces：
#auto eth0
#iface eth0 inet dhcp
auto eth0
iface eth0 inet static
address 192.168.0.109
netmask 255.255.255.0
gateway 192.168.0.1

sudo ifdown eth0
sudo ifup eth0
or
sudo /etc/init.d/networking restart

如果还是无法上网（上面172.17.5.36是某ISP提供的，貌似虚拟机无法用）：
/etc/resolv.conf
nameserver 8.8.8.8

sudo systemctl restart systemd-resolved.service

解决后看下当前路由情况：
route -n

#Verify new IP settings:
ip a s eth0
#Verify new routing settings:
ip r
#Verify DNS servers settings:
cat /etc/resolv.conf
#Verify the internet connectivity:
ping -c 4 google.com

root@kali:/home/lyhistory# ip -4 addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    inet 192.168.0.109/24 brd 192.168.0.255 scope global eth0
       valid_lft forever preferred_lft forever

root@kali:/home/lyhistory# ip route
default via 192.168.0.1 dev eth0 onlink 
192.168.0.0/24 dev eth0 proto kernel scope link src 192.168.0.109 
```



**Centos**

```
--- for centos
vim /etc/sysconfig/network-scripts/ifcfg-eth0
HWADDR=00:08:A2:0A:BA:B8
TYPE=Ethernet
#BOOTPROTO=dhcp
BOOTPROTO=none	
# Server IP #
IPADDR=192.168.0.110
# Subnet #
PREFIX=24
# Set default gateway IP #
GATEWAY=192.168.0.1
# Set dns servers #
DNS1=8.8.8.8
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
# Disable ipv6 #
IPV6INIT=no
NAME=eth0
# This is system specific and can be created using 'uuidgen eth0' command #
UUID=41171a6f-bce1-44de-8a6e-cf5e782f8bd6
DEVICE=eth0
ONBOOT=yes

systemctl restart network


```

