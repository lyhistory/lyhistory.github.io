(window.webpackJsonp=window.webpackJsonp||[]).push([[229],{660:function(t,e,r){"use strict";r.r(e);var a=r(65),s=Object(a.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("p",[r("a",{attrs:{href:"/docs/software"}},[t._v("回目录")]),t._v("  《树莓派raspberry》")]),t._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/hardware/raspberrypi/raspberrypi_pinout.png",alt:""}}),t._v(" "),r("a",{attrs:{href:"https://pinout.xyz/",target:"_blank",rel:"noopener noreferrer"}},[t._v("pinout"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"_1-快速入门-setup"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-快速入门-setup"}},[t._v("#")]),t._v(" 1. "),r("a",{attrs:{href:"https://www.raspberrypi.com/documentation/computers/getting-started.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("快速入门 Setup"),r("OutboundLink")],1)]),t._v(" "),r("h3",{attrs:{id:"format-micro-sdcard"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#format-micro-sdcard"}},[t._v("#")]),t._v(" format micro sdcard")]),t._v(" "),r("p",[t._v("sandisk extreme plus")]),t._v(" "),r("p",[t._v("Then format Sdcard with "),r("a",{attrs:{href:"https://www.sdcard.org/downloads/formatter/",target:"_blank",rel:"noopener noreferrer"}},[t._v("‘SD Card Formatter’"),r("OutboundLink")],1)]),t._v(" "),r("p",[t._v("if your sdcard more than 32G, windows disk manager may not be able to format it correctly, I am not sure abt mac and other os, use sdcard formatter instead")]),t._v(" "),r("h3",{attrs:{id:"burn-image-烧录镜像"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#burn-image-烧录镜像"}},[t._v("#")]),t._v(" burn image 烧录镜像")]),t._v(" "),r("ul",[r("li",[r("p",[t._v("方法一：使用官方的"),r("a",{attrs:{href:"https://www.raspberrypi.com/software/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Raspberry Pi Imager"),r("OutboundLink")],1)])]),t._v(" "),r("li",[r("p",[t._v("方法二：使用三方软件如 Win32DiskImage ，然后自行下载image\nwrite image into the sdcard with "),r("a",{attrs:{href:"https://sourceforge.net/projects/win32diskimager/",target:"_blank",rel:"noopener noreferrer"}},[t._v("‘Win32DiskImage’"),r("OutboundLink")],1)])])]),t._v(" "),r("p",[t._v("树莓派支持多种镜像：")]),t._v(" "),r("ul",[r("li",[t._v("默认是官方的 "),r("a",{attrs:{href:"https://www.raspberrypi.com/documentation/computers/os.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Raspberry Pi OS"),r("OutboundLink")],1)]),t._v(" "),r("li",[t._v("kali linux")]),t._v(" "),r("li",[t._v("(ubuntu mate for raspberry)[https://ubuntu-mate.org/raspberry-pi/]")]),t._v(" "),r("li",[t._v("multiple boot with berryboot (predefined os: rasbian/ubuntu mate,core/kali,etc.")])]),t._v(" "),r("h3",{attrs:{id:"如果有显示器-可以连接显示器"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#如果有显示器-可以连接显示器"}},[t._v("#")]),t._v(" 如果有显示器:可以连接显示器")]),t._v(" "),r("p",[t._v("Connect to monitor(change monitor setting)")]),t._v(" "),r("h3",{attrs:{id:"如果没有显示器-可以用headless无头模式-headless-install"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#如果没有显示器-可以用headless无头模式-headless-install"}},[t._v("#")]),t._v(" 如果没有显示器:可以用headless无头模式 headless install")]),t._v(" "),r("p",[t._v("插上microsd,目录boot下创建wpa_supplicant.conf:")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v('ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=<Insert 2 letter ISO 3166-1 country code here>\n\nnetwork={\n        scan_ssid=1\n        ssid="<Name of your wireless LAN>"\n        psk="<Password for your wireless LAN>"\n        proto=RSN\n        key_mgmt=WPA-PSK\n        pairwise=CCMP\n        auth_alg=OPEN\n}\n')])])]),r("p",[t._v("注意：wifi5G连不到多半是因为country code没有设置")]),t._v(" "),r("p",[t._v("而ssh开启很简单，创建一个ssh文件就ok")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("touch ssh\n")])])]),r("h3",{attrs:{id:"启动-boot"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#启动-boot"}},[t._v("#")]),t._v(" 启动 boot")]),t._v(" "),r("p",[t._v("For headless install only:\nUsing "),r("a",{attrs:{href:"https://www.advanced-ip-scanner.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("ip scanner"),r("OutboundLink")],1),t._v(" or router admin to find out the ip for ssh connect")]),t._v(" "),r("p",[t._v("Default login: pi/raspberry")]),t._v(" "),r("p",[t._v("Once login, Enable SSH/VNC/wifi/CAMERA….")]),t._v(" "),r("h4",{attrs:{id:"extend-sdcard-to-full-use"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#extend-sdcard-to-full-use"}},[t._v("#")]),t._v(" Extend sdcard to full use")]),t._v(" "),r("ul",[r("li",[t._v('Method 1\n"sudo raspi-config" then selecting "Advanced Options" then "Expand Filesystem".')]),t._v(" "),r("li",[t._v("Method 2\n使用fdisk、resize2fs命令扩展")])]),t._v(" "),r("p",[t._v("Note:")]),t._v(" "),r("ul",[r("li",[t._v("if you find there are some unallocated spaces, then your sdcard may has been corrupted due to some improper operations, then you definitely need to delete the partition and repartition it.")]),t._v(" "),r("li",[t._v("remember partition it as primary not logic, and better choose FAT32 format")])]),t._v(" "),r("p",[t._v("测速：安装之后可以使用 raspbian自带的Raspberry Pi Diagnostic")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://domoticproject.com/extending-life-raspberry-pi-sd-card/",target:"_blank",rel:"noopener noreferrer"}},[t._v("高级配置：延长sd卡的寿命"),r("OutboundLink")],1)]),t._v(" "),r("h4",{attrs:{id:"set-hostname"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#set-hostname"}},[t._v("#")]),t._v(" Set hostname")]),t._v(" "),r("p",[t._v("If you are using the raspian distribution from raspberrypi.org, raspberrypi.local is the default hostname. sudo nano /etc/hosts sudo nano /etc/hostname")]),t._v(" "),r("h4",{attrs:{id:"remote-access"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#remote-access"}},[t._v("#")]),t._v(" Remote Access")]),t._v(" "),r("ul",[r("li",[t._v("ssh\nEnter sudo raspi-config in a terminal window\nSelect Interfacing Options\nNavigate to and select SSH\nChoose Yes\nSelect Ok")]),t._v(" "),r("li",[t._v("VNC\nsudo apt update\nsudo apt install realvnc-vnc-server realvnc-vnc-viewer\nsudo raspi-config\nNavigate to Interfacing Options.\nScroll down and select VNC › Yes.")])]),t._v(" "),r("p",[r("a",{attrs:{href:"https://www.raspberrypi.com/documentation/computers/remote-access.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Remote Access"),r("OutboundLink")],1)]),t._v(" "),r("h4",{attrs:{id:"configuration"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#configuration"}},[t._v("#")]),t._v(" Configuration")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://www.raspberrypi.com/documentation/computers/configuration.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("全部配置参考"),r("OutboundLink")],1)]),t._v(" "),r("p",[t._v("enable bluetooth")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("bluetoothctl \nagent on\ndefault agent\n")])])]),r("h3",{attrs:{id:"最佳实践-备份镜像"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#最佳实践-备份镜像"}},[t._v("#")]),t._v(" 最佳实践：备份镜像")]),t._v(" "),r("p",[t._v("sd卡会随时损坏！所以备份很重要！\nWin32DiskImage")]),t._v(" "),r("p",[t._v("launch the Win32 Disk Imager tool with administrator privileges\nSelect the location to save your backup files. ...\nClick on the Read option to start the backup process.")]),t._v(" "),r("h3",{attrs:{id:"firmware-config"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#firmware-config"}},[t._v("#")]),t._v(" firmware config")]),t._v(" "),r("p",[t._v("enable/disable the onboard WiFi/bluetooth from the firmware on the Pi3 / Pi4:\n/boot/config.txt:\ndtoverlay=enable-wifi\ndtoverlay=enable-bt\nor\ndtoverlay=disable-wifi\ndtoverlay=disable-bt")]),t._v(" "),r("h3",{attrs:{id:"handy-tools"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#handy-tools"}},[t._v("#")]),t._v(" Handy tools")]),t._v(" "),r("p",[t._v("tools for raspbery pi:")]),t._v(" "),r("ul",[r("li",[t._v("virtual keyboard:\nsudo  apt-get install matchbox")]),t._v(" "),r("li",[t._v("CanaKit Raspberry Pi 3 B+ (B Plus) with 2.5A Power Supply (UL Listed)\nhttps://www.amazon.com.au/CanaKit-Raspberry-Power-Supply-Listed/dp/B07BC6WH7V/?tag=wnbau-22")]),t._v(" "),r("li",[t._v("Rii Mini Wireless 2.4GHz Keyboard Black MWK01 (X1) K01 https://www.amazon.com.au/Rii-Wireless-Keyboard-Touchpad-Control/dp/B00I5SW8MC/?tag=wnbau-22&th=1")]),t._v(" "),r("li")]),t._v(" "),r("p",[t._v("tools for desktop users:")]),t._v(" "),r("ul",[r("li",[t._v("RealVNC")]),t._v(" "),r("li",[r("a",{attrs:{href:"https://www.raspberrypi.com/software/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Raspberry Pi Imager"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("a",{attrs:{href:"https://www.sdcard.org/downloads/formatter/",target:"_blank",rel:"noopener noreferrer"}},[t._v("‘SD Card Formatter’"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("a",{attrs:{href:"https://sourceforge.net/projects/win32diskimager/",target:"_blank",rel:"noopener noreferrer"}},[t._v("‘Win32DiskImage’"),r("OutboundLink")],1)])]),t._v(" "),r("p",[t._v("tools for android phone user all you need are here:")]),t._v(" "),r("ul",[r("li",[t._v("AndFTP\nsupporting FTP, FTPS, SCP, and SFTP")]),t._v(" "),r("li",[t._v("RPiREF\nthis app has a full reference of all pins and headers.")]),t._v(" "),r("li",[t._v("Fing\nnetwork scanning tool")]),t._v(" "),r("li",[t._v("ConnectBot/JuicySSH")]),t._v(" "),r("li",[t._v("Hacker's Keyboard")]),t._v(" "),r("li",[t._v("AndroidVNC\nremote connection to the GUI")])]),t._v(" "),r("h2",{attrs:{id:"_2-常用命令-common-used-commands"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-常用命令-common-used-commands"}},[t._v("#")]),t._v(" 2. 常用命令 Common Used commands")]),t._v(" "),r("p",[t._v("Config")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("sudo raspi-config\n")])])]),r("p",[t._v("Checking Raspberry Pi Revision Number & Board Version")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("$ pinout\n$ cat /proc/cpuinfo\n$ cat /proc/device-tree/model\n\n")])])]),r("h2",{attrs:{id:"_3-高级模式-advanced-setup"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-高级模式-advanced-setup"}},[t._v("#")]),t._v(" 3. 高级模式 Advanced Setup")]),t._v(" "),r("h3",{attrs:{id:"connect-to-mobile-via-usb-only-otg"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#connect-to-mobile-via-usb-only-otg"}},[t._v("#")]),t._v(" Connect to Mobile via USB only(otg)")]),t._v(" "),r("p",[t._v("Edit /etc/network/interfaces and append these two lines:")]),t._v(" "),r("p",[t._v("allow-hotplug usb0")]),t._v(" "),r("p",[t._v("iface usb0 inet dhcp")]),t._v(" "),r("p",[t._v("on Android, I enable USB tethering")]),t._v(" "),r("p",[t._v("plug in Pi.")]),t._v(" "),r("p",[t._v("install ping&net app, find the ip address assigned to the Pi")]),t._v(" "),r("p",[t._v("install ssh client - juicy ssh")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://weixin.qq.com/sph/AOcRXe",target:"_blank",rel:"noopener noreferrer"}},[t._v("视频演示"),r("OutboundLink")],1)]),t._v(" "),r("h3",{attrs:{id:"connect-to-laptop-via-usb-only-gadget-mode"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#connect-to-laptop-via-usb-only-gadget-mode"}},[t._v("#")]),t._v(" Connect to laptop via USB only(Gadget Mode)")]),t._v(" "),r("p",[t._v("Note: this only works on Zero and A boards, not RPi 3, which is B.")]),t._v(" "),r("p",[t._v("SD card mount on your computer:")]),t._v(" "),r("p",[t._v("append to config.txt:\ndtoverlay=dwc2")]),t._v(" "),r("p",[t._v("touch ssh")]),t._v(" "),r("p",[t._v("edit the file called cmdline.txt. Look for rootwait, and add modules-load=dwc2,g_ether immediately after.")]),t._v(" "),r("p",[t._v("Note the formatting of cmdline.txt is very strict. Commands are separated by spaces, and newlines are not allowed.")]),t._v(" "),r("p",[t._v("Now you can eject the SD card, and insert it into the the Pi. Using a USB cable, connect to the Raspberry Pi from your computer.")]),t._v(" "),r("p",[t._v("After the Pi boots up (this will take a while initially), the Pi should appear as a USB Ethernet device, and you can SSH into it using:")]),t._v(" "),r("p",[t._v("ssh pi@raspberrypi.local")]),t._v(" "),r("h3",{attrs:{id:"laptop"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#laptop"}},[t._v("#")]),t._v(" laptop")]),t._v(" "),r("p",[r("img",{attrs:{src:"/docs/docs_image/software/hardware/raspberrypi/pi-top.jpg",alt:"example: Pi-Top"}}),t._v("\nhttps://pimylifeup.com/pi-top-review/\nhttps://3dprint.com/45158/pi-top-version-3/\npi-top install hands on\nhttp://makezine.com/2015/11/16/hands-on-with-pi-top-the-raspberry-pi-powered-laptop/\nrun standard raspbian on pi-top\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=29&t=149151&p=990308\nhttps://github.com/rricharz/pi-top-install")]),t._v(" "),r("h3",{attrs:{id:"cooling-system"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cooling-system"}},[t._v("#")]),t._v(" Cooling system")]),t._v(" "),r("p",[t._v("yes, you need, http://raspberrypi.stackexchange.com/questions/22928/does-the-raspberry-pi-need-a-cooling-system, https://www.zhihu.com/question/20767376\nheat sink\nhttps://www.youtube.com/watch?v=1AYGnw6MwFM\nhttps://www.youtube.com/watch?v=1AYGnw6MwFM\nwater cooling\nhttps://www.youtube.com/watch?v=RggpIEYh9VU")]),t._v(" "),r("h2",{attrs:{id:"_4-developing"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-developing"}},[t._v("#")]),t._v(" 4. Developing")]),t._v(" "),r("h3",{attrs:{id:"_4-1-read-analog-数模转换"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-read-analog-数模转换"}},[t._v("#")]),t._v(" 4.1 Read analog 数模转换")]),t._v(" "),r("p",[t._v("https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=137207\nhttps://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi/overview")]),t._v(" "),r("p",[t._v("https://www.labno3.com/2021/02/23/raspberry-pi-adc-analog-to-digital-converter-2/")]),t._v(" "),r("p",[t._v("DA转换例子：连接老式 analog 电视（A cathode-ray tube (CRT) TV）")]),t._v(" "),r("ul",[r("li",[t._v("Option 1: Analog Converter Chip\n"),r("ul",[r("li",[t._v("analogzero")])])]),t._v(" "),r("li",[t._v("Option 2: Raspberry Pi's GPIO expansion board\n"),r("ul",[r("li",[t._v("Gertboard 带AD或DA转换")])])]),t._v(" "),r("li",[t._v("Option 3: 直接连接自带AD/DA的 Arduino")])]),t._v(" "),r("h3",{attrs:{id:"_4-2-模块"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-模块"}},[t._v("#")]),t._v(" 4.2 模块")]),t._v(" "),r("h4",{attrs:{id:"camera"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#camera"}},[t._v("#")]),t._v(" Camera")]),t._v(" "),r("p",[t._v("picamera\nsudo apt-get install python3\nsudo apt-get install python3-pip\npip3 install picamera")]),t._v(" "),r("p",[t._v("树莓派摄像头安装 https://www.rs-online.com/designspark/chi-pi-cam-setup-tutorial\nhttps://linux.cn/article-3650-1.html\n非官方\n./mjpg_streamer -i './input_raspicam.so' -o './output_http.so -w ./www'")]),t._v(" "),r("p",[t._v("Time lapse film https://projects.raspberrypi.org/en/projects/cress-egg-heads\nhttps://projects.raspberrypi.org/en/projects/cress-egg-heads/10")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("sudo apt-get install ffmpeg\n#avconv -r 10 -i image%04d.jpg -r 10 -vcodec libx264 -crf 20 -g 15 timelapse.mp4\nffmpeg -r 10 -i image%04d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p out.mp4\n")])])]),r("p",[t._v("https://stackoverflow.com/questions/24961127/how-to-create-a-video-from-images-with-ffmpeg")]),t._v(" "),r("p",[t._v("Image viewer\nhttps://raspberrypi.stackexchange.com/questions/1391/can-anyone-recommend-a-simple-image-viewer")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("sudo apt-get install feh\nfeh -d -S filename ./\n")])])]),r("h2",{attrs:{id:"_5-use-cases"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_5-use-cases"}},[t._v("#")]),t._v(" 5. Use Cases")]),t._v(" "),r("h3",{attrs:{id:"vpn-server-anonymously-with-a-diy-raspberry-pi-vpn-tor-router"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#vpn-server-anonymously-with-a-diy-raspberry-pi-vpn-tor-router"}},[t._v("#")]),t._v(" VPN Server / Anonymously with a DIY Raspberry Pi VPN/TOR Router")]),t._v(" "),r("p",[t._v("https://medium.com/@rasmurtech/step-by-step-guide-to-configuring-a-raspberry-pi-as-a-tor-router-and-installing-the-tor-browser-dd0df49a9e8a")]),t._v(" "),r("p",[t._v("https://makezine.com/projects/browse-anonymously-with-a-diy-raspberry-pi-vpntor-router/\nHow to Make a Raspberry Pi VPN Server https://www.electromaker.io/tutorial/blog/raspberry-pi-vpn-server")]),t._v(" "),r("h3",{attrs:{id:"retro-gaming-emulator"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#retro-gaming-emulator"}},[t._v("#")]),t._v(" retro gaming emulator")]),t._v(" "),r("h3",{attrs:{id:"_5-1-auto-watering-system"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_5-1-auto-watering-system"}},[t._v("#")]),t._v(" 5.1 Auto Watering system")]),t._v(" "),r("p",[t._v("Arduino, solenoid valve with a power supply, breadboard, electronic water sensor, rain bird sprinkler head, and a relay.\nhttp://blogs.sourceallies.com/2014/06/automated-plant-watering-system/\nhttp://makezine.com/2015/04/13/video-walkthrough-automatic-garden-watering-data-logging-arduino/")]),t._v(" "),r("p",[t._v("https://www.hackster.io/ben-eagan/raspberry-pi-automated-plant-watering-with-website-8af2dc\nhttp://nuke666.cn/2018/04/14/auto-water-flowers/")]),t._v(" "),r("p",[t._v("比较器模块\n土壤湿度探头\n继电器模块\n黑胶布")]),t._v(" "),r("p",[t._v("https://www.raspberrypi.org/forums/viewtopic.php?t=169666")]),t._v(" "),r("h3",{attrs:{id:"cluster"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cluster"}},[t._v("#")]),t._v(" Cluster")]),t._v(" "),r("p",[t._v("https://www.youtube.com/watch?v=i_r3z1jYHAc\nhttps://www.youtube.com/watch?v=KJKhRLKXr-Q")]),t._v(" "),r("h3",{attrs:{id:"ethereum-node"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ethereum-node"}},[t._v("#")]),t._v(" Ethereum Node")]),t._v(" "),r("p",[t._v("http://ethembedded.com/?page_id=171\nBuild a RespNode http://raspnode.com/diyEthereumGeth.html#homenet\n中文安装全记录： http://blog.csdn.net/iracer/article/details/51620051")]),t._v(" "),r("h3",{attrs:{id:"黑客基站-kali"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#黑客基站-kali"}},[t._v("#")]),t._v(" 黑客基站 Kali")]),t._v(" "),r("p",[t._v("run kali on raspberry")]),t._v(" "),r("h3",{attrs:{id:"树莓派-太阳能板-nxtcoin-pos-移动硬盘"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#树莓派-太阳能板-nxtcoin-pos-移动硬盘"}},[t._v("#")]),t._v(" 树莓派 太阳能板 + nxtcoin pos +移动硬盘")]),t._v(" "),r("p",[t._v("https://www.nxter.org/how-to-set-up-a-nxt-node-on-a-raspberry-pi-2/")]),t._v(" "),r("h3",{attrs:{id:"raspberry-pi-recovery-kit"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#raspberry-pi-recovery-kit"}},[t._v("#")]),t._v(" Raspberry Pi Recovery Kit")]),t._v(" "),r("p",[t._v("https://doscher.com/work/recovery-kit")]),t._v(" "),r("h3",{attrs:{id:"挖矿"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#挖矿"}},[t._v("#")]),t._v(" 挖矿")]),t._v(" "),r("p",[t._v("images for miner: http://cryptomining-blog.com/tag/raspberry-pi-mining/\nhttp://www.digital-coins.net/wordpress/index.php/2014/12/20/setup-your-raspberry-pi-as-mining-device-controller/")]),t._v(" "),r("h3",{attrs:{id:"private-tracker魔力值"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#private-tracker魔力值"}},[t._v("#")]),t._v(" Private Tracker魔力值")]),t._v(" "),r("p",[t._v("基于这个开源项目 https://github.com/linuxserver/docker-qbittorrent")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v('# 创建用于存储下载资源的文件夹（推荐将外接硬盘挂载到这个位置，有效提升提升树莓派的存储上限）\nmkdir /opt/sda1\n# 创建文件夹\nmkdir /opt/server-qbittorrent\ncd /opt/server-qbittorrent\n# 创建用于存储配置的文件夹\nmkdir /opt/server-qbittorrent/appdata\n# 创建配置文件\ntouch /opt/server-qbittorrent/docker-compose.yml\n\n---\nversion: "2.1"\nservices:\n  qbittorrent:\n    image: lscr.io/linuxserver/qbittorrent:latest\n    container_name: qbittorrent\n    environment:\n      - PUID=1000\n      - PGID=1000\n      - TZ=Etc/UTC\n      - WEBUI_PORT=8080\n    volumes:\n      - /opt/server-qbittorrent/appdata/config:/config\n      - /opt/sda1/pt/downloads:/downloads\n    ports:\n      - 8080:8080\n      - 6881:6881\n      - 6881:6881/udp\n    restart: unless-stopped\n\ncd /opt/server-qbittorrent/\nsudo docker-compose up -d\n\n在树莓派frpc.ini文件添加端口映射，将树莓派的8080端口映射到服务器8081端口实例配置\n[qbit-8080]\ntype = tcp\nlocal_ip = 127.0.0.1\nlocal_port = 8080\nremote_port = 8081\n最后记得重启树莓派的frpc服务，服务器放行8081端口，公网可以通过Web访问，开始愉快做种，赚魔力值吧。\n')])])]),r("h2",{attrs:{id:"troubleshooting"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#troubleshooting"}},[t._v("#")]),t._v(" Troubleshooting")]),t._v(" "),r("h3",{attrs:{id:"关于显示器无法显示"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#关于显示器无法显示"}},[t._v("#")]),t._v(" 关于显示器无法显示：")]),t._v(" "),r("p",[t._v("/boot/config.txt\n都是sdcard上config文件的配置问题，比如我买的pi top，用了pi top的distro就可以显示，而自己烧录的raspbian就无法显示，\n然后我只是文件compare了一下config，改成跟pi top的distro一样就ok了")]),t._v(" "),r("h3",{attrs:{id:"network-access"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#network-access"}},[t._v("#")]),t._v(" Network access")]),t._v(" "),r("p",[t._v("A. wifi connected, no internet access\nB. cannot connect to wifi\nC. static ip address")]),t._v(" "),r("p",[t._v("check points:")]),t._v(" "),r("p",[t._v("ethnet wlan\nifconfig wconfig\n/etc/network/intefaces\n/etc/wpa_suppliant/wpa_suppliant.conf\n/etc/resolv.conf\nsudo ifdown wlan0\nsudo ifup wlan0")]),t._v(" "),r("p",[r("strong",[t._v("2.4G working but not 5G")]),t._v("\nset country code")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("sudo vi /etc/wpa_supplicant/wpa_supplicant.conf\ncountry=SG\n....\n")])])]),r("p",[t._v("https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md\ndns flush: sudo apt-get nscd     sudo /etc/init.d/nscd restart\nhttp://raspberrypi.stackexchange.com/questions/4275/dns-resolution-failure\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=91&t=31238\nhttp://askubuntu.com/questions/572152/i-cant-access-the-internet-through-my-raspberry-pi-when-connected-through-ssh\nhttps://www.raspberrypi.org/forums/viewtopic.php?t=23344\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=91&t=98903\nHow to Set Up WiFi on the Raspberry Pi\nwww.circuitbasics.com/raspberry-pi-wifi-installing-wifi-dongle/\nhttp://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/\nraspberrypihq.com/how-to-add-wifi-to-the-raspberry-pi/\nwifi country code\nhttp://raspberrypi.stackexchange.com/questions/44183/wifi-country-code-resetting\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=28&t=81021")]),t._v(" "),r("h3",{attrs:{id:"screen-display-monitor-resolution"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#screen-display-monitor-resolution"}},[t._v("#")]),t._v(" Screen Display/Monitor & Resolution")]),t._v(" "),r("p",[t._v("if your monitor supports multiple ports, config the correct one\n"),r("img",{attrs:{src:"/docs/docs_image/software/hardware/raspberrypi/raspberry01.png",alt:""}})]),t._v(" "),r("p",[t._v("7 Inch 1024"),r("em",[t._v("600 HDMI LCD Display with Touch Screen https://www.elecrow.com/wiki/index.php?title=7_Inch_1024")]),t._v("600_HDMI_LCD_Display_with_Touch_Screen")]),t._v(" "),r("p",[t._v("http://hackaday.com/2014/11/02/using-cell-phone-screens-with-any-hdmi-interface/\nhttps://howtoraspberrypi.com/raspberry-pi-hdmi-not-working/")]),t._v(" "),r("p",[t._v("VGA Adapter: RGB IN DVI-D DVI-I\nIt turns out that a typical digital monitor only accepts DVI-D connectors. A standard DVI-I connector (left) may be converted to a DVI-D (right) by removing the 4 additional pins surround the big pin.\nThis extraction is easily done using a long-nose plier.")]),t._v(" "),r("p",[t._v("https://www.youtube.com/watch?v=FWSHrTHKg0w#t=156.177646")]),t._v(" "),r("h3",{attrs:{id:"keyboard-mouse"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#keyboard-mouse"}},[t._v("#")]),t._v(" keyboard & mouse")]),t._v(" "),r("p",[t._v("laggy wifi mouse")]),t._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[t._v("vim /boot/cmdline.txt\nusbhid.mousepoll=8\nYou can change the number to anything from 0-8. The lower the number the smoother the mouse movement will be, but the higher the load on the CPU. \n\nfor readonly:\n LibreELEC mounts /flash as read-only, so you need to look which device and partition it is and remount it as writeable:\neg: df -h (to see mounted partitions), then:\nmount -o remount,rw /dev/mmcblk0p8 /flash\n")])])]),r("p",[t._v("keyboard issue, e.g quotes key\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=28&t=24751")]),t._v(" "),r("h3",{attrs:{id:"power-supply"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#power-supply"}},[t._v("#")]),t._v(" Power supply")]),t._v(" "),r("p",[t._v("5V 2.1A\nif power brownout you will see a lighting bolt on top right corner.\nDon't use usb connected your computer, it may burn your motherboard, be carefully when use phone power supply, USB connectors normally imply 5V (but note that some cheap USB connected chargers [not \"power supplies\"] may be unregulated, and when lightly loaded may output more than 5Volt, even 6Volt or more),\ngenerally all micro USB cables should be adhering to the USB standards and output at around 5V, but we specifically mention the 5V to make sure people are checking the voltage levels put out by their charger before blindly plugging it in.So once we're sure people make sure it's a 5V PSU, since they're already looking down there, check for how many mA (or Amps) it puts out.  The Model B needs ~700mA (0.7A) to run.  As such it will not run off your computer's USB port as that only provides 500mA. --https://www.raspberrypi.org/forums/viewtopic.php?f=5&t=4812\nhttp://raspberrypi.stackexchange.com/questions/26705/will-any-external-battery-power-a-raspberry-pi\nhttp://raspi-ups.appspot.com/en/index.jsp\npower supply switch https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=79cba1185463\nhttps://www.youtube.com/watch?v=YpAYDcW_Jx0")]),t._v(" "),r("h3",{attrs:{id:"raspbian-related-issue"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#raspbian-related-issue"}},[t._v("#")]),t._v(" Raspbian related issue:")]),t._v(" "),r("ul",[r("li",[r("p",[t._v("VNC raspbian cannot currently show the desktop\nEnable boot to desktop(lite version by default boot to console)\nsudo apt-get install lxsession https://www.raspberrypi.org/forums/viewtopic.php?t=216737#p1486094")])]),t._v(" "),r("li",[r("p",[t._v("Raspbian buster lite no wireless interfaces found\nhttps://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md\nip link show\nhttps://raspberrypi.stackexchange.com/questions/89704/rpi3-model-b-no-wireless-interface-found")])])]),t._v(" "),r("p",[t._v("InRelease' changed its 'Suite' value from 'testing' to 'stable'\napt-get --allow-releaseinfo-change update\nHOW TO FIX INRELEASE’ CHANGED ITS ‘SUITE’ VALUE FROM ‘STABLE’ TO ‘OLDSTABLE’\nsudo nano /etc/apt/sources.list.d/raspi.list\ndeb https://archive.raspberrypi.org/debian/ bullseye main")]),t._v(" "),r("h3",{attrs:{id:"ubuntu-related-issue"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ubuntu-related-issue"}},[t._v("#")]),t._v(" Ubuntu related issue:")]),t._v(" "),r("p",[t._v("?#pro01： ubuntu welcome to emergency mode\nUsing a VNC client that requests the wrong amount of colors, will crash the application (displaying an “emergency recovery shell” on screen).\nhttp://www.berryterminal.com/doku.php/berryboot/headless_installation\nhttp://raspberrypi.stackexchange.com/questions/37558/how-to-troubleshoot-a-headless-pi-that-boots-into-emergency-mode\nhttps://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/3\nhttps://ubuntu-mate.community/t/getting-emergency-mode-screen-on-boot-up-every-time/2626/5\nhttps://www.raspberrypi.org/forums/viewtopic.php?f=56&t=124149")]),t._v(" "),r("h2",{attrs:{id:"ref"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#ref"}},[t._v("#")]),t._v(" ref:")]),t._v(" "),r("p",[r("a",{attrs:{href:"https://raspberrypi.stackexchange.com/questions/55928/ssh-the-pi-from-computer-with-a-usb-cable-only",target:"_blank",rel:"noopener noreferrer"}},[t._v("SSH the Pi from computer with a USB cable only"),r("OutboundLink")],1)]),t._v(" "),r("disqus")],1)}),[],!1,null,null,null);e.default=s.exports}}]);