---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 基本安装

server: V2ray-core
client: v2rayN
V2ray Linux客户端V2rayA

### 官方(不推荐小白，需要自行配置)：

#### 服务端
https://github.com/v2fly/fhs-install-v2ray

// 安裝和更新 V2Ray 安裝執行檔和 .dat 資料檔
```
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)

OUTPUT:
warning: The following are the actual parameters for the v2ray service startup.
warning: Please make sure the configuration file path is correctly set.
# /etc/systemd/system/v2ray.service
[Unit]
Description=V2Ray Service
Documentation=https://www.v2fly.org/
After=network.target nss-lookup.target

[Service]
User=nobody
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json
Restart=on-failure
RestartPreventExitStatus=23

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/v2ray.service.d/10-donot_touch_single_conf.conf
# In case you have a good reason to do so, duplicate this file in the same directory and make your customizes there.
# Or all changes you made will be lost!  # Refer: https://www.freedesktop.org/software/systemd/man/systemd.unit.html
[Service]
ExecStart=
ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json

installed: /usr/local/bin/v2ray
installed: /usr/local/share/v2ray/geoip.dat
installed: /usr/local/share/v2ray/geosite.dat
installed: /usr/local/etc/v2ray/config.json
installed: /var/log/v2ray/
installed: /var/log/v2ray/access.log
installed: /var/log/v2ray/error.log
installed: /etc/systemd/system/v2ray.service
installed: /etc/systemd/system/v2ray@.service
removed: /tmp/tmp.lsnPmuFuXo
info: V2Ray v5.3.0 is installed.
You may need to execute a command to remove dependent software: apt purge curl unzip
Please execute the command: systemctl enable v2ray; systemctl start v2ray

```
//配置
```
sudo vim /usr/local/etc/v2ray/config.json

{
    "log":{
        "loglevel":"warning"
    },
    "routing":{
        "domainStrategy":"AsIs",
        "rules":[
            {
                "type":"field",
                "ip":[
                    "geoip:private"
                ],
                "outboundTag":"block"
            }
        ]
    },
    "inbounds":[
        {
            "listen":"127.0.0.1",
            "port":10000,
            "protocol":"vmess",
            "settings":{
                "clients":[
                    {
                        "id":"9dfe7fee-d08f-44f8-ad2d-300d4c9c3a0e",
                        "alterId":0
                    }
                ]
            }
        }
    ],
    "outbounds":[
        {
            "protocol":"freedom",
            "tag":"direct"
        },
        {
            "protocol":"blackhole",
            "tag":"block"
        }
    ]
}

```
port：V2Ray 的 WebSocket 所监听的内网端口，取值范围是 1 ~ 65535，但为了避免端口占用，所以不能填常用的端口号（如 22 是 ssh 的端口号，80 是 HTTP 的端口号，443 是 HTTPS 的端口号等），此处设我为 10000
id：用户的主 ID。可通过 UUID 生成器 - v2fly 或者 Online UUID Generator 生成（任选其中一个网站生成就行），此处我设为 9dfe7fee-d08f-44f8-ad2d-300d4c9c3a0e
alterId：根据新 V2Ray 白话文指南 – VMess，推荐值为 0，代表启用 VMessAEAD


//启动
```
service v2ray start
```

// 安裝最新發行的 geoip.dat 和 geosite.dat 只更新 .dat 資料檔
```
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-dat-release.sh)
```

//移除 V2Ray
```
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh) --remove
```

---Discarded start:
~~https://www.v2ray.com/en/welcome/install.html~~

```
curl -Ls https://install.direct/go.sh | sudo bash

The script installs the following files.

/usr/bin/v2ray/v2ray: V2Ray executable
/usr/bin/v2ray/v2ctl: Utility
/etc/v2ray/config.json: Config file
/usr/bin/v2ray/geoip.dat: IP data file
/usr/bin/v2ray/geosite.dat: domain data file
This script also configures V2Ray to run as service, if systemd is available.

Configurations are at the following places.

/etc/systemd/system/v2ray.service: Systemd
/etc/init.d/v2ray: SysV
After installation, we will need to:

Update /etc/v2ray/config.json file for your own scenario.
Run service v2ray start command to start V2Ray.
Optionally run service v2ray start|stop|status|reload|restart|force-reload to control V2Ray service.

```
---Discarded END


#### 客户端：
https://github.com/v2ray/V2RayN

linux客户端：
https://v2raya.org/docs/prologue/introduction/
https://www.xiaoglt.top/v2ray-linux客户端v2raya下载安装及使用教程-支持vmess-vless-ss-ssr-trojan/

### 民间脚本(推荐小白，保姆式一步步即可)：

#### 服务端
https://github.com/githubvpn007/V2Ray
```
bash <(curl -s -L https://git.io/v2ray.sh)

# v2ray bbr

ufw allow 端口号
ufw status

```

#### 客户端：
https://github.com/githubvpn007/v2rayNvpn

选择服务器=》选择对应的协议（V2RAY默认VMESS);
添加后,在右下角托盘右键切换到pac模式;

https://www.xiaoglt.top/category/%e7%a7%91%e5%ad%a6%e4%b8%8a%e7%bd%91%e7%b3%bb%e5%88%97%e6%95%99%e7%a8%8b/v2ray%e6%95%99%e7%a8%8b/

 
## V2ray Config

v2ray  "protocol": "socks",
https://umaint.github.io/2019/01/04/v2ray-ubuntu/

理解
https://iitii.github.io/2020/02/04/1/

我们可以将 v2ray 看成一个带加密功能的 switch , 将 inbound 看成 LAN 口，将 outbound 看成 WAN 口。
如果我们想正常上网，那么我们就得添加路由规则。也就是 routing 下面的 rule 。
v2ray 接收来着 LAN口 的流量（也就是用户的流量），经过 rule 的匹配筛选后，转发给对应的 WAN口 ，从而实现正常上网。
配置：
routing https://www.v2ray.com/en/configuration/routing.html
https://www.v2ray.com/en/configuration/overview.html#inboundobject
https://www.v2ray.com/en/configuration/protocols.html

## 流量伪装

### V2ray web+http2+tls
理论上http2省去了upgrade的请求，性能更好。但实际使用中两者没有明显区别，加之某些web服务器（例如Nginx）不支持后端服务器为http2，所以websocket的方式更流行。如果你要上http2，记得web服务器不能用Nginx，要用支持反代http2的Caddy等软件。

V2ray HTTP/2+TLS+WEB 一键部署
https://iitii.github.io/2022/03/02/1

### V2ray web+websocket+tls 和 

V2Ray (WebSocket + TLS + Web + Cloudflare) 手动配置详细说明
https://ericclose.github.io/V2Ray-TLS-WebSocket-Nginx-with-Cloudflare.html

https://www.xiaoglt.top/v2ray%e9%ab%98%e7%ba%a7%e6%8a%80%e5%b7%a7%ef%bc%9a%e6%b5%81%e9%87%8f%e4%bc%aa%e8%a3%85/


