https://github.com/f1xpl/openauto

## ECU - Engine control unit 发动机控制器
是一种控制内燃机各个部分运作的电子装置。 最简单的ECU只控制每个引擎周期的注油量。 在现代汽车上配备的更高级的发动机控制器还控制点火时间、可变阀门时间（VVT）、涡轮增压器维持的推进级别（配备涡轮增压的汽车）和其他外围设备。

## head unit 抬头显示器

## CAN BUS 控制器局域网总线技术（Controller Area Network-BUS）
[CAN Bus Explained - A Simple Intro [v1.0 | 2019]](https://www.youtube.com/watch?v=FqLDpHsxvf8)
[CAN Bus Explained - A Simple Intro [v2.0 | 2021](https://www.youtube.com/watch?v=oYps7vT708E)

[How to hack your car | Part 1 - The basics of the CAN bus](https://www.youtube.com/watch?v=cAAzXM5vsi0)

Arduino + CAN driver MCP2515 + OBD-2 Plug pintout(female) by SAE J1962 standard

## odb2
odb socket location:
 above the pedals on the right


Why is so important to buy a good adapter? Isn’t it just a simple transmitter?

In fact, ELM327 based adapter is not just a transmitter. It’s a “small computer” that actually handles all communication with the car.

It’s not the software that actually connects to your car’s ECU, it’s ELM327 chip. It can handle about 10 base protocols variations and interprets information from this protocols to a single one.

So, if you have a bad “interpreter”, your software (Car Scanner) and your car ECU wouldn’t understand each other. But if you have a good “interpreter”, they would have a very interesting conversation and you would get all the information you need.

### ELM327
> ELM327原版采用PIC18F2480芯片方案，成本比较高。如果用PIC18F25K80做，成本可以降低不少，并且25K80资源要比2480要好很多，芯片与上位机通讯是UART连接，在此基础上可以转换成多种连接方式，如串口转USB、串口转蓝牙、串口转WIFI等，可以用的上位机软件有PC版的，也有手机版的，市场广阔，销量大利润高。
> 实现方法
> 方案具体工作就是把代码从PIC18F2480移植到PIC18F25K80，经过分析Datasheet，发现这两颗IC属于同一系列、在引脚功能、内部资源、ROM大小、EEPROM大小、A/D位数都差别不大，这就满足了转码的最基本要求，首先反编译2480，再用25K80编译，一次就全部通过，很好，但不代表就可以直接使用，因为从资料上看，25K80的寄存器位置、有些位标置、有些寄存器配置方法不一样，我们选定2480来反编译刚得到的25K80代码，得到的ASM再与原2480的ASM对比，发现有几十行代码不一样，这说明这里面所涉及到的寄存器在两个IC中处于不同位，我们重点核对这些寄存器在两个IC中的功能，如果一致，就不用更改，不一致就要人工修正。这个产品用到了ADC和CAN，原2480是10位，而25K80是12位，配置方法也不同，我们人工修正配置方法，再把采样结果从12位修改成10位的，新加入的代码放在了空白的地方，经过上机测试，功能完全OK。依托我们强大的反编译技术，项目得到顺利完成。
> https://blog.csdn.net/xqhrs232/article/details/84939286

### ELM327 USB
ELM327 USB的两大主要芯片。

第一个是主控芯片：主要负责对ODB接口传输协议的翻译转换，简单来说就是降PC传过来的指令，转换成电讯号发到HS,MS总线上的模块

第二个是RS232芯片:主要作用就是将usb线上收到的PC指令传给主控芯片。

车友会和做外贸的朋友都会留意ELM327 USB系列的两个IC，一个是Main Control

Chip，顾名思义主控IC，另一个是USB Drive Chip，USB驱动IC，以下是我们厂常做的几种款式：

Main Control Chip： PIC18F2580 ／ PIC18F2480 ／PIC18F25K80 （最便宜） USB Drive Chip: FT232BL /FT 232RL

（FT232BL较贵） 混搭模式：IC各选一种，价格不会相同的

非FT232RL芯片，我们叫ELM327 USB with CP2102（这种最便宜）

> 目前正品ELM327使用的是FT232的芯片。国内山寨厂商用CP2102比较多，目前也有很多开始使用FT232芯片的山寨ELM出现了。不过有些使用FT232芯片的山寨ELM会有跟FoCCCus 软件不兼容，不能辨认ELM的情况。FT232芯片比CP2102有一个好处，可以设置传输的timeout时间，而CP2102是做不到的。 这个timeout值得最大作用就是，主控芯片转换信号时如果处理的比较慢，就可能会托更长的时间才会给PC返回指令结果。而这个timeout就是等待的时间，如果在这段等待时间内没有收到结果，就会放弃等待，软件也会认为发生了错误，或者指令没有响应。所以刷固件失败的同学在修改了timeout时间之后，ELM327的稳定性增强了，说到底还是山寨的ELM处理速度太慢了。
> https://a.xcar.com.cn/bbs/thread-20413239-0.html

最低端：PL2303HX的USB-RS232芯片 加上 RS232-OBD II协议的25K80芯片
次低端：CP2012(CP201X)的USB-RS232芯片 加上 RS232-OBD II协议的25K80芯片
中端：CH340的USB-RS232芯片 加上 RS232-OBD II协议的25K80芯片
中高端：进口原装FTDI FT232RL的USB-RS232芯片 加上 RS232-OBD II协议的2480芯片
高端：进口原装的FTDI FT232RL的USB-RS232芯片 加上 RS232-OBD II ELM327正版芯片（这个就是常见的320元左右的ELS27线了）

### ELM327蓝牙OBD和QBD66蓝牙OBD

CSR芯片 VS 国产芯片

ELM327是早年加拿大公司开发的一种OBD协议芯片。市面上后期很多APP，软件，硬件工具都采用327的格式指令。所以后续基于ELM327指令开发OBD蓝牙就叫ELM327蓝牙。芯方案的QBD61 QBD327完全兼容ELM327所有指令 QBD61更是硬件可以完全兼容。 QBD327价格超级低廉。

QBD66是深圳芯方案自行开发的一款进阶OBD协议芯片。

ELM327 蓝牙是一款手动， 低成本 品质低，量大的低端OBD蓝牙产品。开发使用者需要熟悉OBD原始指令，及深厚的相关专业经验知识。且ELM327在无线通讯下容易断线，造成开发应用场景受限，行程数据统计丢失不够精确。 QBD66 蓝牙就是高级全自动版本，高性价比，高可靠性。且QBD66自带OBD逻辑，完成了327很多上位机的功能，相比ELM327多了一层封包，更适合开发者定制，大大方便简化开发周期，提供高可靠的硬件固化解决方案。且QDB66固件可以自带OTA升级，可以拓展更多应用。
https://www.eechina.com/thread-568843-1-1.html

### Android
+ Torque Pro (OBD 2 & Car)
+ (推荐) [开源 AndrOBD](https://github.com/lyhistory/tools_car_AndrOBD)
  
## 测试：基本数据读取 odb2 bluetooth adapter + raspberry pi(usb tethering to android phone)
notice that the Bluetooth light comes on even though the car is off this is, because the obd2 port has an always-on 12 volt power supply which means that the Bluetooth adapter is always going to be on.

```
$ bluetoothctl
[bluetooth] # power on
[bluetooth] # pairable on
[bluetooth] # agent on
[bluetooth] # default-agent
[bluetooth] # scan on
//find Device <MAC ADDRESS> Name: OBDII
[bluetooth] # scan off
[bluetooth] # pair <MAC ADDRESS>
// default pin code: 1234
[bluetooth] # trust <MAC ADDRESS>
[bluetooth] # quit

$ sudo rfcomm bind rfcomm0 <MAC ADDRESS>
$ cat /dev/rfcomm0
$ sudo apt-get install screen
$ screen /dev/rfcomm0
>atz
>atl1
>ath1
>atsp<n> (n is 0-9, set desired commnunication protocol, if not sure, atsp0 will auto search)
><Command HEX Value: Mode|PID>
OBD-II PIDs https://en.wikipedia.org/wiki/OBD-II_PIDs
OBD-II PIDs (On-board diagnostics Parameter IDs) are codes used to request data from a vehicle, used as a diagnostic tool.
>
```

## 测试：物体检测、屏幕展示
[Make A Smart Car Digital Display - DIY Smart Car (Part 4)](https://www.youtube.com/watch?v=VCU81PfSlcI)
[Simple Car Object Detection - DIY Smart Car (Part 2)](https://www.youtube.com/watch?v=FH015Pzys-8)

refer:

ELM327 hacking https://area515.org/elm327-hacking/
当心“山寨”版本的ELM327 OBD-II蓝牙适配器 https://cnx-software.cn/2022/09/01/elm327-obd-ii-bluetooth-adapters/

(Car Diagnostics With A Raspberry PI - DIY Smart Car (Part 3))[https://www.youtube.com/watch?v=DABytIdutKk]


[DIFFERENCES BETWEEN ELM327 SCANNER FIRMWARE VERSION 1.5 AND 2.1](https://elm327scantool.wordpress.com/2018/11/03/differences-between-elm327-firmware-version-1-5-and-2-1/)

[How to choose odp adapter](https://www.carscanner.info/choosing-obdii-adapter/)