---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《树莓派raspberry》



![](/docs/docs_image/software/hardware/raspberrypi/raspberrypi_pinout.png)
[pinout](https://pinout.xyz/)

## 1. [快速入门 Setup](https://www.raspberrypi.com/documentation/computers/getting-started.html)

### format micro sdcard

sandisk extreme plus

Then format Sdcard with [‘SD Card Formatter’](https://www.sdcard.org/downloads/formatter/)

if your sdcard more than 32G, windows disk manager may not be able to format it correctly, I am not sure abt mac and other os, use sdcard formatter instead

### burn image 烧录镜像

+ 方法一：使用官方的[Raspberry Pi Imager](https://www.raspberrypi.com/software/)

+ 方法二：使用三方软件如 Win32DiskImage ，然后自行下载image
  write image into the sdcard with [‘Win32DiskImage’](https://sourceforge.net/projects/win32diskimager/)
  
树莓派支持多种镜像：

+ 默认是官方的 [Raspberry Pi OS](https://www.raspberrypi.com/documentation/computers/os.html)
+ kali linux
+ (ubuntu mate for raspberry)[https://ubuntu-mate.org/raspberry-pi/]
+ multiple boot with berryboot (predefined os: rasbian/ubuntu mate,core/kali,etc.

### 如果有显示器:可以连接显示器
Connect to monitor(change monitor setting) 

### 如果没有显示器:可以用headless无头模式 headless install
插上microsd,目录boot下创建wpa_supplicant.conf:
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=<Insert 2 letter ISO 3166-1 country code here>

network={
        scan_ssid=1
        ssid="<Name of your wireless LAN>"
        psk="<Password for your wireless LAN>"
        proto=RSN
        key_mgmt=WPA-PSK
        pairwise=CCMP
        auth_alg=OPEN
}
```
注意：wifi5G连不到多半是因为country code没有设置

而ssh开启很简单，创建一个ssh文件就ok
```
touch ssh
```

### 启动 boot
For headless install only:
Using [ip scanner](https://www.advanced-ip-scanner.com) or router admin to find out the ip for ssh connect

Default login: pi/raspberry

Once login, Enable SSH/VNC/wifi/CAMERA….

#### Extend sdcard to full use

+ Method 1
  "sudo raspi-config" then selecting "Advanced Options" then "Expand Filesystem".
+ Method 2
  使用fdisk、resize2fs命令扩展


Note:
+ if you find there are some unallocated spaces, then your sdcard may has been corrupted due to some improper operations, then you definitely need to delete the partition and repartition it.
+ remember partition it as primary not logic, and better choose FAT32 format

测速：安装之后可以使用 raspbian自带的Raspberry Pi Diagnostic

[高级配置：延长sd卡的寿命](https://domoticproject.com/extending-life-raspberry-pi-sd-card/)

#### Set hostname
If you are using the raspian distribution from raspberrypi.org, raspberrypi.local is the default hostname. sudo nano /etc/hosts sudo nano /etc/hostname

#### Remote Access 
+ ssh
  Enter sudo raspi-config in a terminal window
  Select Interfacing Options
  Navigate to and select SSH
  Choose Yes
  Select Ok
+ VNC
  sudo apt update
  sudo apt install realvnc-vnc-server realvnc-vnc-viewer
  sudo raspi-config
  Navigate to Interfacing Options.
  Scroll down and select VNC › Yes.

[Remote Access](https://www.raspberrypi.com/documentation/computers/remote-access.html)

#### Configuration
[全部配置参考](https://www.raspberrypi.com/documentation/computers/configuration.html)

enable bluetooth
```
bluetoothctl 
agent on
default agent
```

### 最佳实践：备份镜像
sd卡会随时损坏！所以备份很重要！
Win32DiskImage 

launch the Win32 Disk Imager tool with administrator privileges
Select the location to save your backup files. ...
Click on the Read option to start the backup process.

### firmware config

enable/disable the onboard WiFi/bluetooth from the firmware on the Pi3 / Pi4:
/boot/config.txt:
dtoverlay=enable-wifi
dtoverlay=enable-bt
or
dtoverlay=disable-wifi
dtoverlay=disable-bt

### Handy tools
tools for raspbery pi:
+ virtual keyboard: 
  sudo  apt-get install matchbox
+ CanaKit Raspberry Pi 3 B+ (B Plus) with 2.5A Power Supply (UL Listed) 
  https://www.amazon.com.au/CanaKit-Raspberry-Power-Supply-Listed/dp/B07BC6WH7V/?tag=wnbau-22
+ Rii Mini Wireless 2.4GHz Keyboard Black MWK01 (X1) K01 https://www.amazon.com.au/Rii-Wireless-Keyboard-Touchpad-Control/dp/B00I5SW8MC/?tag=wnbau-22&th=1
+ 
tools for desktop users:
+ RealVNC
+ [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
+ [‘SD Card Formatter’](https://www.sdcard.org/downloads/formatter/)
+ [‘Win32DiskImage’](https://sourceforge.net/projects/win32diskimager/)


tools for android phone user all you need are here: 
+ AndFTP
  supporting FTP, FTPS, SCP, and SFTP
+ RPiREF
  this app has a full reference of all pins and headers.
+ Fing
  network scanning tool
+ ConnectBot/JuicySSH
+ Hacker's Keyboard
+ AndroidVNC
  remote connection to the GUI 
  

## 2. 常用命令 Common Used commands
Config
```
sudo raspi-config
```

Checking Raspberry Pi Revision Number & Board Version
```
$ pinout
$ cat /proc/cpuinfo
$ cat /proc/device-tree/model

```

## 3. 高级模式 Advanced Setup
### Connect to Mobile via USB only(otg)
Edit /etc/network/interfaces and append these two lines:

allow-hotplug usb0

iface usb0 inet dhcp

on Android, I enable USB tethering 

plug in Pi. 

install ping&net app, find the ip address assigned to the Pi

install ssh client - juicy ssh

### Connect to laptop via USB only(Gadget Mode)
Note: this only works on Zero and A boards, not RPi 3, which is B.

SD card mount on your computer:

append to config.txt:
dtoverlay=dwc2

touch ssh

edit the file called cmdline.txt. Look for rootwait, and add modules-load=dwc2,g_ether immediately after.

Note the formatting of cmdline.txt is very strict. Commands are separated by spaces, and newlines are not allowed.

Now you can eject the SD card, and insert it into the the Pi. Using a USB cable, connect to the Raspberry Pi from your computer.

After the Pi boots up (this will take a while initially), the Pi should appear as a USB Ethernet device, and you can SSH into it using:

ssh pi@raspberrypi.local

### laptop

![example: Pi-Top](/docs/docs_image/software/hardware/raspberrypi/pi-top.jpg)
https://pimylifeup.com/pi-top-review/
https://3dprint.com/45158/pi-top-version-3/
pi-top install hands on
http://makezine.com/2015/11/16/hands-on-with-pi-top-the-raspberry-pi-powered-laptop/
run standard raspbian on pi-top
https://www.raspberrypi.org/forums/viewtopic.php?f=29&t=149151&p=990308
https://github.com/rricharz/pi-top-install

### Cooling system
yes, you need, http://raspberrypi.stackexchange.com/questions/22928/does-the-raspberry-pi-need-a-cooling-system, https://www.zhihu.com/question/20767376
heat sink
https://www.youtube.com/watch?v=1AYGnw6MwFM
https://www.youtube.com/watch?v=1AYGnw6MwFM
water cooling
https://www.youtube.com/watch?v=RggpIEYh9VU

## 4. Developing

### 4.1 Read analog 数模转换
https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=137207
https://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi/overview

https://www.labno3.com/2021/02/23/raspberry-pi-adc-analog-to-digital-converter-2/

DA转换例子：连接老式 analog 电视（A cathode-ray tube (CRT) TV）

#### Raspberry Pi's GPIO expansion board

通常扩展板都带AD或DA转换

+ Gertboard
+ Laika Explorer Board


### 4.2 模块 

#### Camera

picamera
sudo apt-get install python3
sudo apt-get install python3-pip 
pip3 install picamera 

树莓派摄像头安装 https://www.rs-online.com/designspark/chi-pi-cam-setup-tutorial
https://linux.cn/article-3650-1.html
非官方
./mjpg_streamer -i './input_raspicam.so' -o './output_http.so -w ./www'

Time lapse film https://projects.raspberrypi.org/en/projects/cress-egg-heads
https://projects.raspberrypi.org/en/projects/cress-egg-heads/10
```
sudo apt-get install ffmpeg
#avconv -r 10 -i image%04d.jpg -r 10 -vcodec libx264 -crf 20 -g 15 timelapse.mp4
ffmpeg -r 10 -i image%04d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p out.mp4
```
https://stackoverflow.com/questions/24961127/how-to-create-a-video-from-images-with-ffmpeg

Image viewer
https://raspberrypi.stackexchange.com/questions/1391/can-anyone-recommend-a-simple-image-viewer
```
sudo apt-get install feh
feh -d -S filename ./
```

## 5. Use Cases

### VPN Server / Anonymously with a DIY Raspberry Pi VPN/TOR Router
https://medium.com/@rasmurtech/step-by-step-guide-to-configuring-a-raspberry-pi-as-a-tor-router-and-installing-the-tor-browser-dd0df49a9e8a

https://makezine.com/projects/browse-anonymously-with-a-diy-raspberry-pi-vpntor-router/
How to Make a Raspberry Pi VPN Server https://www.electromaker.io/tutorial/blog/raspberry-pi-vpn-server

### retro gaming emulator

### 5.1 Auto Watering system
Arduino, solenoid valve with a power supply, breadboard, electronic water sensor, rain bird sprinkler head, and a relay.
http://blogs.sourceallies.com/2014/06/automated-plant-watering-system/
http://makezine.com/2015/04/13/video-walkthrough-automatic-garden-watering-data-logging-arduino/


https://www.hackster.io/ben-eagan/raspberry-pi-automated-plant-watering-with-website-8af2dc
http://nuke666.cn/2018/04/14/auto-water-flowers/

比较器模块
土壤湿度探头
继电器模块
黑胶布

https://www.raspberrypi.org/forums/viewtopic.php?t=169666

### 5.2 智能小车
[化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！](https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG)

### Cluster

https://www.youtube.com/watch?v=i_r3z1jYHAc
https://www.youtube.com/watch?v=KJKhRLKXr-Q

### Ethereum Node
http://ethembedded.com/?page_id=171
Build a RespNode http://raspnode.com/diyEthereumGeth.html#homenet
中文安装全记录： http://blog.csdn.net/iracer/article/details/51620051

### 黑客基站 Kali
run kali on raspberry

### 树莓派 太阳能板 + nxtcoin pos +移动硬盘
https://www.nxter.org/how-to-set-up-a-nxt-node-on-a-raspberry-pi-2/

### Raspberry Pi Recovery Kit 
https://doscher.com/work/recovery-kit

### 挖矿
images for miner: http://cryptomining-blog.com/tag/raspberry-pi-mining/
http://www.digital-coins.net/wordpress/index.php/2014/12/20/setup-your-raspberry-pi-as-mining-device-controller/

## Troubleshooting

### 关于显示器无法显示：
/boot/config.txt
都是sdcard上config文件的配置问题，比如我买的pi top，用了pi top的distro就可以显示，而自己烧录的raspbian就无法显示，
然后我只是文件compare了一下config，改成跟pi top的distro一样就ok了

### Network access
A. wifi connected, no internet access
B. cannot connect to wifi
C. static ip address

check points:

ethnet wlan
ifconfig wconfig
/etc/network/intefaces
/etc/wpa_suppliant/wpa_suppliant.conf
/etc/resolv.conf
sudo ifdown wlan0
sudo ifup wlan0

**2.4G working but not 5G**
set country code
```
sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
country=SG
....
```
https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
dns flush: sudo apt-get nscd     sudo /etc/init.d/nscd restart
http://raspberrypi.stackexchange.com/questions/4275/dns-resolution-failure
https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=31238
http://askubuntu.com/questions/572152/i-cant-access-the-internet-through-my-raspberry-pi-when-connected-through-ssh
https://www.raspberrypi.org/forums/viewtopic.php?t=23344
https://www.raspberrypi.org/forums/viewtopic.php?f=91&t=98903
How to Set Up WiFi on the Raspberry Pi
www.circuitbasics.com/raspberry-pi-wifi-installing-wifi-dongle/
http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/
raspberrypihq.com/how-to-add-wifi-to-the-raspberry-pi/
wifi country code
http://raspberrypi.stackexchange.com/questions/44183/wifi-country-code-resetting
https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=81021

### Screen Display/Monitor & Resolution
if your monitor supports multiple ports, config the correct one
![](/docs/docs_image/software/hardware/raspberrypi/raspberry01.png)

7 Inch 1024*600 HDMI LCD Display with Touch Screen https://www.elecrow.com/wiki/index.php?title=7_Inch_1024*600_HDMI_LCD_Display_with_Touch_Screen

http://hackaday.com/2014/11/02/using-cell-phone-screens-with-any-hdmi-interface/
https://howtoraspberrypi.com/raspberry-pi-hdmi-not-working/

VGA Adapter: RGB IN DVI-D DVI-I
It turns out that a typical digital monitor only accepts DVI-D connectors. A standard DVI-I connector (left) may be converted to a DVI-D (right) by removing the 4 additional pins surround the big pin.
This extraction is easily done using a long-nose plier.

https://www.youtube.com/watch?v=FWSHrTHKg0w#t=156.177646

### keyboard & mouse
laggy wifi mouse
```
vim /boot/cmdline.txt
usbhid.mousepoll=8
You can change the number to anything from 0-8. The lower the number the smoother the mouse movement will be, but the higher the load on the CPU. 

for readonly:
 LibreELEC mounts /flash as read-only, so you need to look which device and partition it is and remount it as writeable:
eg: df -h (to see mounted partitions), then:
mount -o remount,rw /dev/mmcblk0p8 /flash
```
keyboard issue, e.g quotes key
https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=24751

### Power supply
5V 2.1A
if power brownout you will see a lighting bolt on top right corner.
Don't use usb connected your computer, it may burn your motherboard, be carefully when use phone power supply, USB connectors normally imply 5V (but note that some cheap USB connected chargers [not "power supplies"] may be unregulated, and when lightly loaded may output more than 5Volt, even 6Volt or more),
generally all micro USB cables should be adhering to the USB standards and output at around 5V, but we specifically mention the 5V to make sure people are checking the voltage levels put out by their charger before blindly plugging it in.So once we're sure people make sure it's a 5V PSU, since they're already looking down there, check for how many mA (or Amps) it puts out.  The Model B needs ~700mA (0.7A) to run.  As such it will not run off your computer's USB port as that only provides 500mA. --https://www.raspberrypi.org/forums/viewtopic.php?f=5&t=4812
http://raspberrypi.stackexchange.com/questions/26705/will-any-external-battery-power-a-raspberry-pi
http://raspi-ups.appspot.com/en/index.jsp
power supply switch https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=79cba1185463
https://www.youtube.com/watch?v=YpAYDcW_Jx0

### Raspbian related issue:
+ VNC raspbian cannot currently show the desktop
Enable boot to desktop(lite version by default boot to console)
sudo apt-get install lxsession https://www.raspberrypi.org/forums/viewtopic.php?t=216737#p1486094

+ Raspbian buster lite no wireless interfaces found
https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
ip link show
https://raspberrypi.stackexchange.com/questions/89704/rpi3-model-b-no-wireless-interface-found


InRelease' changed its 'Suite' value from 'testing' to 'stable'
apt-get --allow-releaseinfo-change update
HOW TO FIX INRELEASE’ CHANGED ITS ‘SUITE’ VALUE FROM ‘STABLE’ TO ‘OLDSTABLE’
sudo nano /etc/apt/sources.list.d/raspi.list
deb https://archive.raspberrypi.org/debian/ bullseye main

### Ubuntu related issue:
?#pro01： ubuntu welcome to emergency mode
Using a VNC client that requests the wrong amount of colors, will crash the application (displaying an “emergency recovery shell” on screen).
http://www.berryterminal.com/doku.php/berryboot/headless_installation
http://raspberrypi.stackexchange.com/questions/37558/how-to-troubleshoot-a-headless-pi-that-boots-into-emergency-mode
https://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/3
https://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/5
https://www.raspberrypi.org/forums/viewtopic.php?f=56&t=124149

## ref:
[SSH the Pi from computer with a USB cable only](https://raspberrypi.stackexchange.com/questions/55928/ssh-the-pi-from-computer-with-a-usb-cable-only)

<disqus/>