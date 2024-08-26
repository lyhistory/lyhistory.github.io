---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

首先当然是先购买vps了，[推荐：传送前去机场](/docs/software/network/vps)

## 基本安装

服务器端: V2ray-core

Windows客户端: v2rayN

Linux客户端：V2rayA

安卓客户端： V2rayNG

注意：如果多次安装不同版本的v2ray要注意最好移除之前安装的v2ray，如果不确定安装了哪个，通过which v2ray或者systemctl确定v2ray的位置，每个不同的安装版本提供的v2ray的功能有所区别，需要注意

### 官方(不推荐小白，需要自行配置)：

https://wiki.linuxchina.net/index.php/V2ray

#### 服务端

##### 基本安装

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
                        "id":"<这里访问https://www.uuidgenerator.net/生成UUID替换>",
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

//开防火墙
ufw allow <port> //后续如果通过nginx伪装流量则不需要对外开放v2ray的port
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

##### 更新
```
// 只更新 .dat 資料檔
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-dat-release.sh)
```
##### bbr加速
https://www.linuxv2ray.com/speedup/google-tcp-bbr-one-click-script-for-v2ray/

#### 客户端：

[三方下载地址](https://itlanyan.com/v2ray-clients-download/)

##### Windows客户端



下载安装[V2RayN下载地址](https://github.com/v2ray/V2RayN)后运行V2rayN.exe，根据提示下载 dotnet framework 并安装后重启，添加vmess服务器：
```
别名：任意
地址：域名
端口：443
用户id：对应v2ray config inbounds->clients->id
alertId:默认0
加密方式：auto
传输协议：ws
伪装域名：域名
路径：对应v2ray config streamSettings->wsSettings->path
传输层安全：tls
sni:域名
跳过证书验证 allowInsecure: false
```

添加后观察下方窗口输出结果，注意到：
在文件夹 (...\V2RAY\v2rayN\bin\Xray) 下未找到Core文件 (文件名:xray, wxray)，请下载后放入文件夹，[下载地址](https://github.com/XTLS/Xray-core/releases)

##### linux客户端：
https://v2raya.org/docs/prologue/introduction/

1. 安装 V2Ray 内核#
   可以直接安装V2RAY，不过还是推荐V2RayA的官方方法：
   ```
   curl -Ls https://mirrors.v2raya.org/go.sh | sudo bash
   //安装后可以关掉服务，因为 v2rayA 不依赖于该 systemd 服务
   sudo systemctl disable v2ray --now
   ```
2. 安装 v2rayA
   ```
   wget -qO - https://apt.v2raya.org/key/public-key.asc | sudo tee /etc/apt/trusted.gpg.d/v2raya.asc
   echo "deb https://apt.v2raya.org/ v2raya main" | sudo tee /etc/apt/sources.list.d/v2raya.list
   sudo apt update
   sudo apt install v2raya
   ```
3. 启动 v2rayA / 设置 v2rayA 自动启动
   ```
   sudo systemctl start v2raya.service
   sudo systemctl enable v2raya.service
   ```
4. http://localhost:2017/
   

##### 手机客户端：
https://itlanyan.com/v2ray-clients-download/


### 民间脚本(推荐小白，保姆式一步步即可)：

#### 服务端
[教程](https://github.com/githubvpn007/V2Ray)
[脚本作者](https://github.com/233boy/v2ray)

```
#安装
bash <(curl -s -L https://git.io/v2ray.sh)

# 一键加速v2ray bbr
v2ray bbr

#卸载
v2ray uninstall

貌似执行安装脚本也是可以卸载

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

案例学习：
https://github.com/nondanee/UnblockNeteaseMusic/issues/148
https://github.com/v2ray/v2ray-core/issues/663


## 流量伪装

### V2ray web+websocket+tls

#### v2ray 配置
```
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
                        "id":"<这里访问https://www.uuidgenerator.net/生成UUID替换>",
                        "alterId":0
                   }
                ]
            },
            "streamSettings":{
                "network":"ws",
                "wsSettings":{
                    "path":"/lyhistory"
                }
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

#### nginx安装及http配置
```
sudo apt install nginx
sudo ufw allow 'Nginx Full'

sudo rm /etc/nginx/sites-enabled/default
sudo mkdir -p /var/www/html/mysite
sudo chown -R $USER:$USER /var/www/html
sudo chmod -R 755 /var/www/
vim /var/www/html/mysite/index.html

<html>
    <head>
        <title>Welcome</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>This is a sample page.</p>
    </body>
</html>


sudo vim /etc/nginx/sites-available/mysite
server {
        listen 80;
        listen [::]:80;

        root /var/www/html/mysite;
        index index.html index.htm index.nginx-debian.html;

        server_name lyhistory.com www.lyhistory.com;

        location / {
                try_files $uri $uri/ =404;
        }
}

sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/

为了防止可能出现的内存问题，
sudo vim /etc/nginx/nginx.conf
http {
    ...
    server_names_hash_bucket_size 64;
    ...
}

nginx -s reload

ufw allow 'Nginx Full'
```

#### cloudflare保护
1. Cloudflare’s Origin CA生成：
cloudflare管理页面=>SSL/TLS=>Origin Server 点击生成证书；
保存证书至 /etc/ssl/cloudflare_cert.pem, 保存key至 /etc/ssl/cloudflare_key.pem

2. SSL/TLS 加密模式改为 Full (strict) 

3. Edge Certificates=>Minimum TLS Version」改为「TLS 1.2」

4. Enable authenticated origin pulls
   确保 Nginx 只接受来自 Cloudflare 服务器的请求，防止任何其他人直接连接到 Nginx 服务器,
   cloudflare管理页面=>SSL/TLS=>Origin Server,打开「Authenticated Origin Pulls」 。
   
   然后[访问该页面](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/zone-level/),可以找到下载client证书链接:
   [download authenticated_origin_pull_ca.pem](https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem)
   将证书 authenticated_origin_pull_ca.pem 的内容写入到服务器的 /etc/ssl/cloudflare_client.crt 中

#### nginx配置ssl
```
sudo vim /etc/nginx/sites-available/mysite

server {
  listen 80 default_server;
  listen [::]:80 default_server;

  server_name lyhistory.com www.lyhistory.com;

  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  ssl_certificate /etc/ssl/cloudflare_cert.pem;
  ssl_certificate_key /etc/ssl/cloudflare_key.pem;
  ssl_client_certificate /etc/ssl/cloudflare_client.crt;
  ssl_verify_client on;
  ssl_session_timeout 1d;
  ssl_session_cache shared:MozSSL:10m;  # about 40000 sessions
  ssl_session_tickets off;

  # intermediate configuration
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers off;

  # HSTS (ngx_http_headers_module is required) (63072000 seconds)
  add_header Strict-Transport-Security "max-age=63072000" always;

  server_name lyhistory.com www.lyhistory.com;

  root /var/www/html/mysite;
  index index.html index.htm index.nginx-debian.html;


  location / {
    try_files $uri $uri/ =404;
  }

  location /lyhistory {
    if ($http_upgrade != "websocket") {
      return 404;
    }
    proxy_redirect off;
    proxy_pass http://127.0.0.1:10000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}

```
nginx -s reload

#### V2ray client配置
```
地址（address）：可以填写您注册的域名（也可以是 Cloudflare 的 CDN IP）
端口（port）：HTTPS 端口号，即填写 443
用户 ID（id）：与 V2Ray 服务端的配置一致，也就是之前生成的 UUID
额外 ID（alterId）：与 V2Ray 服务端的配置一致，即 0
加密方式（security）：自动，即 auto
传输协议（network）：WebSocket，即 ws
伪装类型（type）：none
伪装域名（host）：填写您注册的域名
路径（path）：与 V2Ray 服务端的配置一致，即 /lyhistory
底层传输安全（tls）：tls
跳过证书验证（allowInsecure）：false 。
```

refer:
[V2Ray (WebSocket + TLS + Web + Cloudflare) 手动配置详细说明](https://ericclose.github.io/V2Ray-TLS-WebSocket-Nginx-with-Cloudflare.html)


https://www.xiaoglt.top/v2ray%e9%ab%98%e7%ba%a7%e6%8a%80%e5%b7%a7%ef%bc%9a%e6%b5%81%e9%87%8f%e4%bc%aa%e8%a3%85/

https://blog.cascade.moe/posts/nginx-proxy-v2ray-ws/

### V2ray web+http2+tls
理论上http2省去了upgrade的请求，性能更好。但实际使用中两者没有明显区别，加之某些web服务器（例如Nginx）不支持后端服务器为http2，所以websocket的方式更流行。如果你要上http2，记得web服务器不能用Nginx，要用支持反代http2的Caddy等软件。

V2ray HTTP/2+TLS+WEB 一键部署
https://iitii.github.io/2022/03/02/1

## Troubleshooting

### 基本检查和终极方法
+ 网卡属性 ipv4 ip gateway dns
+ proxy设置
+ 是否跟其他vpn软件冲突
+ 浏览器插件是否有开启（比如定位服务）
+ 防火墙

有时候观察到不稳定或者手机可以,windows不可以,完全可以通过升级客户端解决!

### app/proxyman/outbound: failed to process outbound traffic
一看就是出去的流量有问题，做了基本检查，防火墙也全关了，

Open Command Prompt and ping the loopback address:
ping 127.0.0.1
If this works (you get replies), it indicates that your TCP/IP stack is operational.

并且重置了network
netsh int ip reset
netsh winsock reset

ping本地没问题，但是ping局域网其他机器都有问题，报错 General failure

最后发现卸载其他vpn尤其是cloudflare的warp之后问题解决！


### v2ray failed to dial WebSocket
解决方案：
第一步：判断当前VPS主机时间是否有问题。判断方法参考“v2ray 主机时间同步问题”，如果确定没问题，则进行下一步，如果有问题则按照文章中的步骤同步一下时间即可。然后再次尝试v2ray客户端连接，看看还会不会报错，如果还是会报错，则进行第二步判断。

第二步：判断当前VPS主机端口是否有问题。首先安装一个nc

yum install -y nc
安装完后，随意开启监听一个端口，例如直接执行下面的命令。监听8181

nc -lv -p 8181
然后在本机打开cmd，尝试连接一下VPS的8181端口

telnet xxx.你VPS的IP.xx.xx 8181
如果没连进去，这里就要分析多种可能了。
例如：1、可能是你VPS没有关闭防火墙
2、可能是你电脑网络没办法访问互联网其他主机的端口，可能公司限制
3、你的VPS被墙了，只能考虑使用CloudFlare来做中转帮你自己恢复被墙的限制(CloudFlare恢复被墙方法)

如果没问题，那么你要注意以下你的V2RAY的配置，是否使用的WebSocket+TLS模式，或者你v2ray对外开放的是什么端口。是什么端口，你连接一下什么端口。WebSocket+TLS这个默认是443 你继续在你的电脑中telnet连接一下，我这边尝试连接我自己的VPS结果就是443端口是不通的，其他任何端口都没问题。

那就只能证明一个结果，我VPS的IP的443端口被墙了，所以只能更换其他端口。v2ray WebSocket+TLS 模式更换其他端口的方法如下：

vi /etc/caddy/Caddyfile
##注意，里面的内容第一行，绝对是你自己配置的域名，这里更改为如下，英文冒号，端口随意设置
www.你自己配置的域名.com:8080 {
    gzip
timeouts none
    proxy / https://www.baidu.com {
        except /ddd
    }
    proxy /ddd 127.0.0.1:40507 {
        without /ddd
        websocket
    }
}
http://www.你自己配置的域名.com {
    gzip
timeouts none
    proxy / https://woj.app {
    }
}
import sites/*

然后你使用v2ray 客户端连接的时候，把443端口更改成你设定的端口即可。例如我这里面设定的是8080，我更改为8080就搞定了。
后续就可以正常使用v2ray啦。

最新caddy的设置如下：

ltang.suning.com {
    reverse_proxy https://fanyi.baidu.com {
        header_up Host {upstream_hostport}
        header_up X-Forwarded-Host {host}
    }
    handle_path /search {
        reverse_proxy 127.0.0.1:20363
    }
}
http://ltang.suning.com {
    reverse_proxy  / https://woj.app {
    }
}
import sites/*