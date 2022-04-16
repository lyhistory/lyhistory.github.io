---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《硬件基础与物联网IOT》

## 1.Fundamentals 
Electronics Foundations: https://www.linkedin.com/learning/electronics-foundations-fundamentals

### 公式
欧姆公式
http://www.54benniao.com/view/28.html
![](/docs/docs_image/software/hardware/basic/02_ohm.png)
https://zhidao.baidu.com/question/78519916

### 电子元器件  Electronic Components
https://en.wikipedia.org/wiki/Electronic_symbol

R 电阻：
色环图
![](/docs/docs_image/software/hardware/basic/01_resistor.png)
快速：两个红色 220欧， 一个红色 10k，一个黄一个紫色 4.7k，没有比较亮的颜色(棕黑黑) 1k

LED
长正短负

C 电容

铜线/杜邦线能通过的最大电流

模拟引脚（analog）
频率HZ 周期（微秒） 100Hz不是直接等于多少毫秒的问题；它是交流电频率与周期的关系，并且是倒数关系：周期T=1/100=0.01秒=10毫秒。


1.杜邦线 dupont line
贴片元件的焊接教程 - 拖焊技巧 http://www.elecfans.com/article/89/140/2012/20120522273004.html
Solderless Breadboard  http://www.petervis.com/Raspberry_PI/Solderless_Breadboard/Solderless_Breadboard.html
spring clips 弹簧卡子  copper strips 铜带
multimeter 万用表
jumper 跳线
rail 引脚

![](/docs/docs_image/software/hardware/basic/03_schematicsymbol.png)

power regulator
oxidation
semiconductor
transistor 晶体管
MB102 Breadboard Power Supply Module 3.3V 5V
http://www.petervis.com/Raspberry_PI/Breadboard_Power_Supply/YwRobot_Breadboard_Power_Supply.html
http://www.petervis.com/Raspberry_PI/Breadboard_Power_Supply/Breadboard_Power_Supply.html
Provide two different voltages on the two supply lines of the breadboard as needed.However, you should be careful about on which side of the breadboard the module been attached. Check that is minus (-) really is on the blue line and plus (+) on the red line, otherwise it may cause the circuit arrangement evil confusing!
Specifications:
jumper adjustable output voltage: 3.3V and / or 5V DC – directly on the breadboard
additional: 2x 3.3V and 2x 5V plug connections on top
USB connector
power supply connector (input voltage 6.5V – 12V DC, already tested with 6V)
maximum output current: 700mA
status LED
on/off switch
suitable breadboard types: MB-102, ZY-60
dimensions: 52mm x 34mm
可编程逻辑电源/新能源MEMS/传感技术测量仪表嵌入式技术制造/封装模拟技术连接器EMC/EMI设计光电显示存储技术EDA/IC设计处理器/DSP接口/总线/驱动控制/MCURF/无线

引脚高低电平
	 内部拉起？拉电流弱
	外部：接电阻，又5v引脚供电，又称低电平控制/负极控制，灌电流强


### IC板 逻辑门电路

### PCB-Printed Circuit Board 印制电路板 - 芯片的载体
PCB类型，如何通过板子画出电路图？
如何用万用表测找出电路板的坏的地方？电容爆炸？

http://news.eeworld.com.cn/Test_and_measurement/ic514591.html
1、看元件的状态
拿到一块出故障的电路板，首先观察电路板有没有明显的元件损坏，如电解电容烧毁和鼓胀、电阻烧坏以及功率器件的烧损等。

2、看电路板的焊接
如印制电路板有没有变形翘曲；有没有焊点脱落、明显虚焊；电路板覆铜皮有没有翘起、烧糊变黑。

3、观察元件的插件
如集成电路、二极管、电路板电源变压器等方向有没插错。

4、电阻电容电感的简单测试
使用万用表对量程内的电阻、电容、电感等可怀疑元件进行简单的测试，测试有否电阻阻值变大、电容短路、开路和容值变化、电感短路和开路等现象。

5、上电测试
经过上述简单观察和测试后，无法排除故障，可进行上电测试。首先测试电路板供电是否正常。如电路板的交流电源是否异常、稳压器输出是否异常、开关电源输出和波形是否异常等

6、刷程序
对于有单片机、DSP、CPLD等可编程元件，可考虑重新刷一遍程序，排除程序运行异常造成的电路故障。

## 2.常见芯片-程序烧录

Common tips 
1.install correct drive
2.cannot find serial port
Change the usb cable
3.Upload speed 波特率
Device Manager
Port(Com and LRT)
USB-SERIAL CH340/341 (pre-install successful,  install ' 驱动精灵' and connect USB will auto detect drive)
芯片类型 STC90C5XX
晶振频率
调整波特率一超时 -- 改用低速下载

：atmel,stc,pic,avr,凌阳，80C51，arm
 
https://hackaday.io/
 
http://www.yeelink.net/
 
http://www.elecfans.com/
 
http://www.robotsky.com/
 
PCB 入门教程  http://dword1511.info/dword/gswpcb_zhcn/
news:
http://www.guancha.cn/Industry/2015_12_09_344069.shtml

Tools
http://fritzing.org

### 2.1 NodeMCU
official site: http://www.nodemcu.com
forum: http://bbs.nodemcu.com/
source code: https://github.com/nodemcu
 
Setup:
download: http://yunpan.cn/c3qQbdCTK7dtb  访问密码 ef05
win7 users may need cp2102 usb to uart bridge controller driver,
CP210x USB to UART Bridge VCP Drivers https://www.silabs.com/products/mcu/Pages/USBtoUARTBridgeVCPDrivers.aspx

NodeMCU Amica
Driver: https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
Sample:
WebServer
https://www.teachmemicro.com/simple-nodemcu-web-server/
MessageQueue-PubSub
https://www.losant.com/blog/getting-started-with-platformio-esp8266-nodemcu
https://github.com/Losant/losant-mqtt-arduino/blob/master/examples/esp8266/esp8266.ino


### 2.2 ESP*** Based Development Board

Esp32 vs esp8266
https://makeradvisor.com/esp32-vs-esp8266/
M5stack
https://docs.m5stack.com/#/en/core/basic
M5stickC
https://docs.m5stack.com/#/zh_CN/core/m5stickc
https://docs.m5stack.com/#/zh_CN/quick_start/m5stickc/m5stickc_quick_start_with_arduino_Windows
https://github.com/m5stack/M5StickC/tree/master
https://www.hackster.io/herbert-stiebritz/very-simple-m5stickc-clock-08275b

https://docs.platformio.org/en/latest/boards/espressif32/m5stick-c.html


esp8266
A Beginner's Guide to the ESP8266
https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html
esp8266 esp-12
https://www.youtube.com/watch?v=8J7zflVO8K0

ESP32 ESP8266
ESP8266真会是Arduino Killer么？ https://blog.csdn.net/eezata/article/details/49884179
https://esp32.com/viewtopic.php?t=86
Arduino for esp32&esp8266开发环境搭建 https://www.jianshu.com/p/8088d461fd11


## 3. 简单案例

![自动浇花](/docs/docs_image/software/hardware/basic/04_autowatering.png) 

## 4. IOT
what?
The Internet of Things - IOT is the network of physical objects - devices, vehicles, buildings and other items embedded with electronics, software, sensors, and network connectivity - that enables these objects to collect and exchange data.
A global infrastructure for the information society, enabling advanced services by interconnecting(physical and virtual) things based on existing and evolving interoperable information and communication technologies.
Pervasive computing+Networking

when we talk about IOT, what's in/ comes to your mind? question marks? circuit board.
collect data,visualize data,analysis data,perform actions
show business case:
self-driven car / robot arm automation
now we talk about smart city, smart nation, but from my point of view, these ideas are somehow unrealistic for now.
but smart home and smart factory are relatively much more easy to achieve.
At least, machines can take over such kind of tedious jobs like :
https://mp.weixin.qq.com/s?__biz=MzA3OTM2NDM2Mw==&mid=2649732684&idx=5&sn=37c3be90ebcf347d9e637066c57aed8b&scene=0#rd
someone may feel worried that our jobs may be taken over by machines, but think in this way, we humans can spend more time on tasks require more creative energy.

Why?
this concept came out many years ago, why iot is rising today, why now:
http://iotindiamag.com/2016/08/10-reasons-iot-rising-today/
sensors developing fast, and getting cheaper
https://www.linkedin.com/pulse/iot-business-boost-economy-next-decades-posted-success-scodiero?articleId=8372849347531761698
show raspberry pi & arduino price comparison
main stream
with these, you can quickly build up your prototype from scratch.
comparison:
raspberry is a computer looks not like a computer
microcomputer, just like your smart phone, besides standard inputs like keysroke/camera/your voice/GPS singal/Radio singal, it also can read from all kinds of sensors
it's cheap and full functional, but the downside is it's a single computer,the kernel is a microprocessor, but
aruino: controller board, an old fashioned feature phone without os.
Microcontrollers are designed to perform specific tasks. Specific means applications where the relationship of input and output is defined.
for example, the drone, quadrocopter, 6 channles, yaw, rotate, forward/backward... fly control is a microcontroller
https://www.quora.com/How-feasible-is-it-to-use-a-Raspberry-Pi-as-the-control-system-on-an-autonomously-flying-quadcopter
http://www.engineersgarage.com/tutorials/difference-between-microprocessor-and-microcontroller

How?
I will show you a video
https://www.youtube.com/watch?v=0kzjqBacF1k
https://www.youtube.com/watch?v=onZ4KMM94yI
because we can do it?
that's not enough, why we build it?
back to 'auto driven car',
shared economy

if the car hit someone or another car, who will be responsible for it? programmer?
liabilities must be clear.
right? agree?

business value, security, risks emerged

how are we going to build IOT system.
I would like to introduce some tools here.
raspberry pi&arduino facilitate us play with IOT.

tools facilitate your iot development
python script
i2tool
https://www.shodan.io/

The last job on Earth: imagining a fully automated world – video  https://www.theguardian.com/sustainable-business/video/2016/feb/17/last-job-on-earth-automation-robots-unemployment-animation-video



LPWAN+CNN低功耗加卷积网络
https://www.matchx.io/getstarted/

IoT Live Demo: 100.000 Connected Cars With Kubernetes, Kafka, MQTT, TensorFlow
https://dzone.com/articles/iot-live-demo-100000-connected-cars-with-kubernete

---

ref:

Blogs&Forum
https://www.teachmemicro.com/tutorials/


废物利用：改造旧充电宝
https://ezo.biz/Technolog/fix-powerbank.html
树莓派UPS：用充电宝改造的不间断电源
https://www.quwj.com/2018/12/13/ups-for-raspberry-pi.html

微雪学堂 http://www.waveshare.net/study/portal.php
物联网快速开发（基础篇）
http://edu.csdn.net/course/detail/923
DemoBoard 开发板专题：
raspberrypi
树莓派 https://www.raspberrypi.org/
https://www.pretzellogix.net/2015/01/14/the-best-raspberry-pi-starter-kits-compared-and-reviewed/
https://learn.adafruit.com/category/learn-raspberry-pi
nodemcu
http://www.nodemcu.com/
http://www.doit.am/
http://www.doit.am/
Microduino
https://www.microduino.cc/
http://www.leiphone.com/tag/Microduino
http://www.geekpark.net/topics/212704
arduino
https://www.arduino.cc/
http://www.leiphone.com/tag/arduino
TinyDuino
 
物联网工具
https://www.relayr.io/
http://nodered.org/
http://thethingsystem.com/

Shopping:
http://www.ickey.cn/

开源工具：
https://processing.org/tutorials/electronics/
http://www.datamation.com/open-source/35-open-source-tools-for-the-internet-of-things-1.html
 
产品：
http://www.faxsun.com/
http://skyworksas.com/eedu/
 
http://36kr.com/p/5038505.html
http://www.leiphone.com/news/201509/vp9Fi4Oeuwgx0CU6.html
 
单片机入门 http://www.elecfans.com/soft/33/2012/20120821285311.html
51、AVR、PIC、MSP430、ARM、DSP
http://www.eeskill.com/article/index/id/20643
51单片机 vs 8051
ESP8266 http://www.esp8266.com/
nodemcu based on ESP8266
Arduino 与树莓派 Raspberry P
http://www.zhihu.com/question/20755144
https://www.quora.com/What-can-the-Arduino-do-that-the-Raspberry-Pi-cant-and-vice-versa
arduino or 8051
https://www.quora.com/Which-is-better-arduino-or-8051-microcontroller
 
http://www.elecfans.com/zhuanti/DIY_Robot.html
http://www.leiphone.com/news/201501/iSmdLPJvuDFiJuVF.html
http://www.instructables.com/contest/robotics2015/
 
MEETINGS:
http://solidcon.com/internet-of-things-2015/public/schedule/detail/40797



automated dinosaur game bot https://www.reddit.com/r/arduino/comments/c5o4kf/i_made_an_automated_dinosaur_game_bot/
	LDR sensor 光敏电阻