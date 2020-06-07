---
sidebar: auto
sidebarDepth: 2
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/coder2hacker)  《Chapter 3．基于Kali Linux搭建渗透环境》

常用：

Kali 

Parrot-Security https://parrotlinux.org/

Blackarch https://blackarch.org/tools.html



Kalinux环境
Kali linux for virtualbox或者手动安装
https://www.offensive-security.com/kali-linux-vm-vmware-virtualbox-image-download/#1572305786534-030ce714-cc3b
建议用官方优化过的virtualbox版本

OWASP 
bee-box

Kali Linux是基于Debian的GNS/Linux发行版，预装了众多开箱即用的hacking工具，专门用于执行安全任务，我们也将使用kali linux提供的工具包来完成渗透实验。
Kali Linux的前身是BackTrack，直至2013年被Kali Linux取代，
2015年8月，Kali Linux第二版Kali Sana发布，2016年1月转为滚动发布，滚动发布意味着软件会持续更新而不需要更改操作系统版本，目前由Offensive Security公司进行维护



## kaili setup

Virtualbox 选择 **Debian 64bit**

SSH

/etc/ssh/sshd_config

​	PermitRootLogin yes

disable default ssh key:
update-rc.d -f ssh remove
update-rc.d -f ssh defaults
update-rc.d -f ssh enable 2 3 4 5



**Kali****自带基本工具**

apt-get update

apt-get full upgrade

apt-get install **kali-linux-web**

![](/docs/docs_image/coder2hacker/kali/kali_linux_web.png)



为什么要用firefox，因为firfox自己有一套证书系统，而且可以直接设置proxy，所以不需要整个电脑安装证书，以及设置全局proxy，所以firefox对于渗透测试来说是很好的工具

**Firefox plugin****黑客插件**

https://github.com/FelisCatus/SwitchyOmega/releases

wappalyzer 

FoxyProxy

Cookies Manager+。

HackBar。hackbar quantum

HttpRequester。

RESTClient。

User-Agent Switcher。

Tampermonkey。

Tamper Data and Tamper Data Icon Redux.

XSS Me

SQL Inject Me

iMacros

FirePHP



## 靶机 Vulnerable Virtual Machine

OWASP Broken Web Applications Project 

https://sourceforge.net/projects/owaspbwa/files/

https://code.google.com/archive/p/owaspbwa/wikis/UserGuide.wiki

Download *.ova for virtualbox

**root/owaspbwa**

我们的主要靶机是OWASP和bee-box，靶机是模拟重现真实生产环境发现的web应用漏洞。

+ OWASP

![](/docs/docs_image/coder2hacker/kali/owasp.png)

The applications in the home page are organized in the following six groups:

1)**Training applications**: These are the ones that have sections dedicated to practice-specific vulnerabilities or attack techniques; some of them include tutorials, explanations, or other kinds of guidance. 

2)**Realistic, intentionally vulnerable applications**: Applications that act as real-world applications (stores, blogs, and social networks) and are intentionally left vulnerable by their developers for the sake of training. 

**3)Old (vulnerable) versions of real applications**: Old versions of real applications, such as WordPress and Joomla, are known to have exploitable vulnerabilities; these are useful to test our vulnerability identification skills. 

4)**Applications for testing tools**: The applications in this group can be used as benchmarks for automated vulnerability scanners. 

5)**Demonstration pages/small applications**: These are small applications that have only one or a few vulnerabilities, for demonstration purposes only. 

6)**OWASP demonstration application**: OWASP AppSensor is an interesting application; it simulates a social network and could have some vulnerabilities in it. But it will log any attack attempts, which is useful when trying to learn, for example, how to bypass some security devices such as a web application firewall.

+ Beebox

  https://sourceforge.net/projects/bwapp/files/bee-box/

+ More：

  DVWA

  Metasploitable2 3

  https://www.vulnhub.com/

  https://sourceforge.net/projects/samurai

  https://www.mavensecurity.com/resources/web-security-dojo



关于beebox：

http://itsecgames.com/

默认密码：bee/bug root/bug

可以直接用 **OWASP Broken Web Applications Project** 里的bWAPP；

或者

直接下载bWAPP安装在自己host比如php study下面

或者

直接下载beebox这个vm

![](/docs/docs_image/coder2hacker/kali/beebox.png)



关于DVWA:

OWASP BWA doesn't yet include an application that uses WebSockets, so we will need to use Damn Vulnerable Web Sockets (DVWS) (https://www.ow asp.org/index.php/OWASP_Damn_Vulnerable_Web_Sockets_(DVWS)

 

git clone https://github.com/interference-security/DVWS/

apt install php-mysqli

​      Replacing config file /etc/php/7.3/cli/php.ini with new version

vim /etc/php/7.3/apache2/php.ini

​      extension=mysqli

service mysql start

 

/etc/apache2/sites-available

​      │000-default.conf

cp -r DVWS /var/www/html/

mysql

​	create database dvws_db;

​	create user 'test'@'localhost' identified by '123456';

​	grant all privileges on *.* to 'test'@'localhost' with grant option;

​	flush privileges;

mysql dvws_db < /var/www/html/DVWS/includes/dvws_db.sql

vim /etc/hosts

127.0.0.1 dvws.local

service apache2 start

http://dvws.local/DVWS/



vim /var/www/html/DVWS/includes/connect-db.php

cd var/www/html/DVWS

php ws-socket.php