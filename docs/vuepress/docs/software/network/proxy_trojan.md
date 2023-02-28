---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《trojan梯子》

首先当然是先购买vps了，[推荐：传送前去机场](/docs/software/network/vps)

## 1.前置准备

trojan是近两年兴起的网络工具，与强调加密和混淆的SS/SSR等工具不同，trojan将通信流量伪装成互联网上最常见的https流量，从而有效防止流量被检测和干扰。

## 2.安装

### 2.1 服务端 

**方法1**

执行一键脚本
```
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/trojan-gfw/trojan-quickstart/master/trojan-quickstart.sh)"
```
安装完打开配置文件
/usr/local/etc/trojan/config.json

local_port：监听的端口默认443；
remote_addr/remote_port：非trojan协议时，将请求转发处理的地址（ip地址或者域名）和端口, 默认是本机和80端口；
password：最后一行结尾不能有逗号；
cert和key：域名的证书和密钥，Let’s Encrypt申请的证书可用 certbot certificates 查看证书路径；
key_password：证书密码；
alpn：建议http/1.1和h2。

---
更改后，设置开机自动启动并启动：
systemctl enable trojan
systemctl start trojan

然后访问remote_addr域名或ip，应该出现Nginx欢迎页。更换伪装网站页面只需上传文件到 /usr/share/nginx/html 目录即可

**方法2**

首先要申请域名，并绑定A记录，地址就是你的vps；

然后执行一键脚本
```
curl -O https://raw.githubusercontent.com/atrandys/trojan/master/trojan_mult.sh && chmod +x trojan_mult.sh && ./trojan_mult.sh
```
执行的时候需要绑定刚才的域名

---

设置防火墙：
```
#配置端口
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
#或者直接关闭
systemctl stop firewalld
systemctl disable firewalld
```

### 2.2 客户端使用

trojan跟ssr不同，不是说客户端下载直接用，使用有如下几种方式：

#### 2.2.1 使用Trojan客户端

首先[下载客户端](https://github.com/trojan-gfw/trojan/releases)
打开config.json，
修改remote_addr,remote_port，然后启动；
启动之后，然后可以

a.配置系统代理：

windows设置->网络internet->代理，手动设置代理地址和端口

b.或者借助v2rayN：

下载v2ray客户端v2rayN，解压进入v2rayN-Core，启动v2rayN.exe，双击桌面右下角v2rayN图标，添加socks5服务器。

c.浏览器代理：
如果只是想用浏览器走海外流量可以直接设置浏览器的代理或者用SwitchOmega等插件，
同理适用于支持代理模式的所有其他软件（包括手机软件）。

#### 2.2.2 使用软路由

直接用大佬的固件包；

或者自己编译为openwrt编译Trojan固件包，比较纯净；

## 3.加速

对速度要求不高的话，此步骤可省略

```
cd /usr/src && wget -N --no-check-certificate "https://raw.githubusercontent.com/chiakge/Linux-NetSpeed/master/tcp.sh" && chmod +x tcp.sh && ./tcp.sh
```

---

ref:

[trojan](https://trojan-gfw.github.io/trojan/)

[谷歌云搭建Trojan节点](https://www.youtube.com/watch?v=HytuSwW90rI&t=127s)
[最简单的Trojan一键脚本](https://www.atrandys.com/2019/1963.html)
[自建梯子教程 --Trojan版本](https://trojan-tutor.github.io/2019/04/10/p41.html)
[trojan教程](https://tlanyan.me/trojan-tutorial/)
[软路由安装LEDE固件及科学上网设置教程](https://www.youtube.com/watch?v=Q7D8iSHzyDg)
[openwrt使用trojan教程](https://www.atrandys.com/2020/2324.html)

<disqus/>