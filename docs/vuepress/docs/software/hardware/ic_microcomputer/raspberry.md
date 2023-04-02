---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《树莓派raspberry》

关于显示器无法显示：
都是sdcard上config文件的配置问题，比如我买的pi top，用了pi top的distro就可以显示，而自己烧录的raspbian就无法显示，
然后我只是文件compare了一下config，改成跟pi top的distro一样就ok了

关于headless无头模式，一个是wifi，一个是ssh，要注意不同的os版本相应的wifi的配置不同，
Raspbian Jessie 系统
network={
  ssid="WiFi名字"
  psk="WiFi密码"
  key_mgmt=WPA-PSK
}
Raspbian Stretch 系统
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="WiFi名字"
    psk="WiFi密码"
    key_mgmt=WPA-PSK
}

所以熟悉下raspbian的不同版本还是有必要的，比如Jessie Stretch
而ssh开启很简单，给一个ssh文件就ok

主要配置
raspi-config

pi/raspberry

黑客基站https://www.linuxidc.com/Linux/2015-11/124762.htm

ls /usr/lib/python3/dist-packages/

Set hostname
If you are using the raspian distribution from raspberrypi.org, raspberrypi.local is the default hostname. sudo nano /etc/hosts sudo nano /etc/hostname
https://www.raspberrypi.org/forums/viewtopic.php?t=7280
dtoverlay=pi3-enable-wifi
https://www.raspberrypi.org/forums/viewtopic.php?t=211383

## 1. Setup
### Step 1: burn image
Download image 
Then format Sdcard with ‘SD Card Formatter’ and write image into the sdcard with ‘Win32DiskImage’
https://www.raspberrypi.org/downloads/
https://www.raspberrypi.org/documentation/installation/installing-images/README.md

https://www.sdcard.org/downloads/formatter/
https://sourceforge.net/projects/win32diskimager/

### Step 2: config
Connect to monitor(change monitor setting) or config for headless install:

Config wifi manually and enable ssh
SETTING UP A RASPBERRY PI HEADLESS https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
https://blog.twofei.com/772/

Issue: auto wifi not working
Raspbian version: buster 

### Step 3: boot
Using ip scanner https://www.advanced-ip-scanner.com/ or router admin to find out the ip for ssh connect
Default login: pi/raspberry
Once login, Enable SSH/VNC/wifi/CAMERA….
Sudo raspi-config
	https://www.raspberrypi.org/documentation/remote-access/vnc/README.md
Extend sdcard to full use

sudo apt-get install python3
sudo apt-get install python3-pip 
pip3 install picamera https://www.raspberrypi.org/documentation/linux/software/python.md

Run ssh on startup/boot
https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=86950
http://raspberrypi.stackexchange.com/questions/1747/starting-ssh-automatically-at-boot-time

### Step 4. Handy tools
tools for android phone user all you need are here: http://www.makeuseof.com/tag/6-android-apps-every-raspberry-pi-owner/
virtual keyboard: sudo  apt-get install matchbox
remote access： https://www.raspberrypi.org/documentation/remote-access/

## Connection
### Scenario 1 - connect to Mobile via USB only(otg)
Edit /etc/network/interfaces and append these two lines:

allow-hotplug usb0

iface usb0 inet dhcp

on Android, I enable USB tethering 

plug in Pi. 

install ping&net app, find the ip address assigned to the Pi

install ssh client - juicy ssh

### Scenario 2 - connect to laptop via USB only(Gadget Mode)
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

## Troubleshooting
### sdcard format and partition
+ a. if your sdcard more than 32G, windows disk manager may not be able to format it correctly, I am not sure abt mac and other os, use sdcard formatter instead
+ b. if you find there are some unallocated spaces, then your sdcard may has been corrupted due to some improper operations, then you definitely need to delete the partition and repartition it.
+ c. remember partition it as primary not logic, and better choose FAT32 format
format tool: https://www.sdcard.org/downloads/formatter_4/eula_windows/index.html
partition tool: http://www.partition-tool.com/partner/app.htm

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
![](/docs/docs_image/software/hardware/raspberry01.png)

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

### Ubuntu related issue:
?#pro01： ubuntu welcome to emergency mode
Using a VNC client that requests the wrong amount of colors, will crash the application (displaying an “emergency recovery shell” on screen).
http://www.berryterminal.com/doku.php/berryboot/headless_installation
http://raspberrypi.stackexchange.com/questions/37558/how-to-troubleshoot-a-headless-pi-that-boots-into-emergency-mode
https://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/3
https://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/5
https://www.raspberrypi.org/forums/viewtopic.php?f=56&t=124149

## 2.More

### 2.1. Camera
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

### 2.2.Cooling system
yes, you need, http://raspberrypi.stackexchange.com/questions/22928/does-the-raspberry-pi-need-a-cooling-system, https://www.zhihu.com/question/20767376
heat sink
https://www.youtube.com/watch?v=1AYGnw6MwFM
https://www.youtube.com/watch?v=1AYGnw6MwFM
water cooling
https://www.youtube.com/watch?v=RggpIEYh9VU

### 2.3 Read analog
https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=137207
https://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi/overview

## 3. Use Cases

### 3.1 Auto Watering system
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

### 3.2 智能小车
[化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！](https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG)

### Cluster

https://www.youtube.com/watch?v=i_r3z1jYHAc
https://www.youtube.com/watch?v=KJKhRLKXr-Q

### Pi-Top
![](/docs/docs_image/software/hardware/pi-top.png)
https://pimylifeup.com/pi-top-review/
https://3dprint.com/45158/pi-top-version-3/
pi-top install hands on
http://makezine.com/2015/11/16/hands-on-with-pi-top-the-raspberry-pi-powered-laptop/


### Ethereum Node
Build a RespNode http://raspnode.com/diyEthereumGeth.html#homenet
中文安装全记录： http://blog.csdn.net/iracer/article/details/51620051

### Kali
run kali on raspberry
http://www.thesecurityblogger.com/installing-and-troubleshooting-kali-linux-on-raspberry-pi/

### 树莓派 太阳能板 + nxtcoin pos +移动硬盘
https://www.nxter.org/how-to-set-up-a-nxt-node-on-a-raspberry-pi-2/

## todo:
37 in 1 sensor kit: https://www.modmypi.com/download/37-piece-sensor-description.pdf
heartbeat/Fingertip measuring heartbeat
http://forum.arduino.cc/index.php?topic=230713.0
https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=114615
tracking
I2C ADC
https://www.raspberrypi.org/forums/viewtopic.php?f=93&t=18138
shift register(sn74hc595n)
Graphic Display(R61526 16PIN)

Images:
images for miner: http://cryptomining-blog.com/tag/raspberry-pi-mining/
http://www.digital-coins.net/wordpress/index.php/2014/12/20/setup-your-raspberry-pi-as-mining-device-controller/
ubuntu mate for raspberry https://ubuntu-mate.org/raspberry-pi/
run standard raspbian on pi-top
https://www.raspberrypi.org/forums/viewtopic.php?f=29&t=149151&p=990308
https://github.com/rricharz/pi-top-install

multiple boot with berryboot (predefined os: rasbian/ubuntu mate,core/kali,etc.
http://www.geekfan.net/5244/
www.howtogeek.com/141325/how-to-multi-boot-your-raspberry-pi-with-berryboot/
https://www.youtube.com/watch?v=BGCeLct5SUg
add custom os www.howtogeek.com/141325/how-to-multi-boot-your-raspberry-pi-with-berryboot/
www.youtube.com/watch?v=GYamNsUXC8M
https://forums.kali.org/showthread.php?449-Booting-Kali-Linux-with-Berryboot
http://www.berryterminal.com/doku.php/berryboot
ethereum version: ethembedded.com/?page_id=171
http://www.multibootpi.com/

How to Make a Raspberry Pi VPN Server https://www.electromaker.io/tutorial/blog/raspberry-pi-vpn-server

[SSH the Pi from computer with a USB cable only](https://raspberrypi.stackexchange.com/questions/55928/ssh-the-pi-from-computer-with-a-usb-cable-only)
<disqus/>