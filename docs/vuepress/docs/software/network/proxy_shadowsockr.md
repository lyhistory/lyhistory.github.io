---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《ShadowsocksR梯子》

首先当然是先购买vps了，[推荐：传送前去机场](/docs/software/network/vps)

ShadowsocksR是Shadowsock的升级版

---

## 部署VPS服务器

连接服务器,可以使用Xshell、cmder或者putty等工具,输入前面记下来的ip地址用户密码,默认ssh端口是22;

连上后建议先关闭防火墙:
```
systemctl stop firewalld
systemctl disable firewalld
```

现在用下面这个脚本搭建(CentOS/Debian/Ubuntu ShadowsocksR单/多端口一键管理脚本):

```
yum -y install wget
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```

一步步按提示选择,主要是下面几个选项：

选择ShadowsocksR;

输入密码;

输入端口；

加密方式；

协议建议选择auth_aes128_md5开头的几种；

混淆方式随便选；

安装完成后会给出信息，主要是一些参数ip 端口等等，都记下来，后面客户端连接要用，建议重启下服务器；

重启后,ssr应该是自动运行,如果没有可以手动执行,常用命令：
```
启动：
/etc/init.d/shadowsocks-r start
退出：
/etc/init.d/shadowsocks-r stop
重启：
/etc/init.d/shadowsocks-r restart
查看状态：
/etc/init.d/shadowsocks-r status
卸载：
./shadowsocks-all.sh uninstall

配置手动修改：
/etc/shadowsocks-r/config.json
```

服务端安装好之后,现在可以下载客户端:

电脑PC: https://github.com/shadowsocksrr/shadowsocksr-csharp/releases

安卓：  https://github.com/shadowsocksrr/shadowsocksr-android/releases

苹果：  ios设备：淘宝上买一个美区ID，然后去App Store下载软件potatso lite

## 对速度要求不高的话，此步骤可省略

+ 1. BBR加速
https://ssr.tools/199
```
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh
```

+ 2.KVM架构加速:
https://ssr.tools/668

+ 3.OpenVZ架构加速:
https://ssr.tools/663

---

ref:
[OpenWrt 路由器 shadowsocks](https://github.com/softwaredownload/openwrt-fanqiang/blob/master/SUMMARY.md)
[shadowsocks + dnsmasq + ipset + iptables 实现公办网络透明代理](https://witee.github.io/2016/12/01/%E5%85%AC%E5%8F%B8%E7%BD%91%E5%85%B3%E4%BD%BF%E7%94%A8-shadowsocks-%E6%90%AD%E5%BB%BA%E7%BF%BB%E5%A2%99%E7%BD%91%E7%BB%9C/)
[利用shadowsocks打造局域网透明网关](https://medium.com/@oliviaqrs/%E5%88%A9%E7%94%A8shadowsocks%E6%89%93%E9%80%A0%E5%B1%80%E5%9F%9F%E7%BD%91%E7%BF%BB%E5%A2%99%E9%80%8F%E6%98%8E%E7%BD%91%E5%85%B3-fb82ccb2f729)
Squid 代理服务器
http://www.ciphermagic.cn/chrome-scientific-internet-access.html

<disqus/>