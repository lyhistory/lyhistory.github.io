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
  rm $(where connect.sh)

  dos2unix $(find . -type f)

  echo $(cmd) 和 echo "$(cmd)"，结果差不多，但是仍然有区别。注意观察，双引号转义完成的结果会自动增加单引号，而前者不会， 如果 $ 读取出的参数字符串包含空格，应该用双引号括起来，否则就会出错。

  管道：

  ps -aef | grep -v grep | grep "java -server -jar" | awk '{print $2}'
  $(2)获取管道前面等输出结果第二列,此时可以用$2替代；

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

## 用户身份

```
su _gvm
This account is currently not available.

sudo -u _gvm gvmd --migrate
sudo su -l _gvm -s /bin/bash

sudo sh -c "cmds"
```



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
  
  ​	ii) system wide全局PATH /etc/profile或/root/.bashrc
  
  2) or just mv it into /usr/local/bin/
  
  3) or link
  
  ​	`cd /usr/bin sudo ln -s /home/lyhistory/.local/bin/tldr tldr` OR
  
  ​	`sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin`
  
  缺点: if there is dependencies, you have to manually install them
  
+ 源码编译安装

  configuration或cmake之后make install，通常安装的路径在 install_manifest.txt，所以删除方式：`cat install_manifest.txt | xargs echo sudo rm | sh`

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
```





