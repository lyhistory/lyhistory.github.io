---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《ShadowsocksR梯子》

ShadowsocksR是Shadowsock的升级版，本文教你简单三步实现ShadowsocksR搭建,如有疑问可以[加我知识星球](https://t.zsxq.com/3BayjMb)一对一指导；

---

## 第一步：购买VPS服务器

搭梯子只能用国外vps,推荐知名的vultr，价格优惠速度快且稳定,而且最近有提供100美金的免费体验,基本上你可以免费使用一年:

[点击这里去vultr官网领取100美金免费体验](https://www.vultr.com/?ref=8491735-6G)

如果对英文不熟悉也没有关系,可以鼠标右键可以选择翻译成中文,浏览器都有这个功能;

vultr充值方式很多：

+ 支付宝(2017年8月30日之后Vutrl就支持支付宝付款了）

+ paypal（paypal是国际知名的第三方支付服务商，相当于国内的支付宝。注册后绑定银行卡还可以购买国外商品）

+ 信用卡

![](/docs/docs_image/software/network/vps/vultr01.png)

购买vps服务器时，系统推荐选择CentOS 6.X64位的系统（系统版本不要选的太高，不要选centos7！centos7默认的防火墙可能会干扰ssr的正常连接！）

vultr按小时计费，可以随时删掉重新部署。

![](/docs/docs_image/software/network/vps/vultr02.png)

## 第二步：部署VPS服务器

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

## 第三步:

对速度要求不高的话，此步骤可省略

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

[利用shadowsocks打造局域网翻墙透明网关](https://medium.com/@oliviaqrs/%E5%88%A9%E7%94%A8shadowsocks%E6%89%93%E9%80%A0%E5%B1%80%E5%9F%9F%E7%BD%91%E7%BF%BB%E5%A2%99%E9%80%8F%E6%98%8E%E7%BD%91%E5%85%B3-fb82ccb2f729)