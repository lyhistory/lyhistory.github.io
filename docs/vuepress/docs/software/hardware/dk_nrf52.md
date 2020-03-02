---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 1.terminalogy
evk: evaluation kit
ble: bluetooth low energy

MDK=Microcontroller Development Kit

Softdevice是Nordic蓝牙协议栈的名称

mbr: Master Boot Record主引导记录是位于磁盘最前边的一段引导（Loader）代码

## 2.环境搭建

### 2.1 驱动Driver

CH341SER.zip
	
安装成功的标志是usb连接开发板时会在设备管理器device manager里面会出现：
端口Ports(COM & LPT)，展开后看到USB-SERIAL CH340(COM6)
	
### 2.2 开发工具IDE

+ Keil 仅支持Windows
+ IAR 仅支持Windows
+ SES 支持Windows，Mac和Linux
+ GCC 支持Windows，Mac和Linux

以keil5为例使用nrf52 SDK 16.0，
首先SDK下载地址：http://developer.nordicsemi.com/nRF5_SDK/nRF5_SDK_v16.x.x/

keil4是直接安装sdk下面的nRF_MDK_8_27_0_Keil4_NordicLicense.msi，
而keil5是需要下载pack包，要注意使用SDK16必须要用8.27的pack，由于8.27.0有bug，所以需要下载8.27.1，
但是刚开始我下载的是BSD license版本的[NordicSemiconductor.nRF_DeviceFamilyPack.8.27.1.packs](https://developer.nordicsemi.com/nRF5_SDK/pieces/nRF_DeviceFamilyPack/),
然后我使用的时候总是编译失败:
```
*** Using Compiler 'V5.06 update 4 (build 422)', folder: 'C:\Keil_v5\ARM\ARMCC\Bin'
Build target 'nrf52840_xxaa'
Error instantiating RTE components
Error #544: Required Software Pack 'NordicSemiconductor.nRF_DeviceFamilyPack_NordicLicense.8.27.0' is not installed
Error #541: 'NordicSemiconductor::Device:Startup:8.27.0' component is missing (previously found in pack 'NordicSemiconductor.nRF_DeviceFamilyPack_NordicLicense.8.27.0')
Target not created.
Build Time Elapsed:  00:00:00
```
经过一番折腾，才知道原来我安装的是BSD license，需要安装Nordic license版本的，
下载地址：https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-MDK/Download，
在页面左侧选择Pack, 5-clause Nordic license，版本我还是用8.27.1，安装时可能会出现这个错误：
SVDConv returned with an error, No uVision SystemViewer file created

但是不用管，点击确定结束；

然后使用SDK16还要安装ARM.CMSIS.4.5.0.pack，最后安装完成打开keil5的pack installer就会看到下面的对应版本：

![keil5 nrf5 SDK](/docs/docs_image/software/hardware/dk_nrf52_01.png)	

如果打开SDK16提供的例子项目可能弹出要求按照8.27.0的要求，直接点击no，不要安装，然后到路径
Project->Manage->Select Software Packs下面，更改NordicSemiconductor::nRF_DeviceFamilyPack_NordicLicense，选择latest，即刚才安装的8.27.1；
然后再到路径Project->Manage->Run-time Environment/Select Software Packs下面，打开Device，如果看到Startup Version是旧的比如8.27.0，并且是红色的，
则勾掉那个勾，然后点击OK，然后再次打开之后会发现Version会变成8.27.1，然后再勾选起来就行了；

![keil5 nrf5 SDK](/docs/docs_image/software/hardware/dk_nrf52_02.png)

安装nRF-Command-Line-Tools

[nRF5x command line tools](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Command-Line-Tools/Download#infotabs)
包括Jlink驱动以及Nordic自己开发的一些命令行工具，具体包括Jlink驱动，nrfjprog，nrfutil以及mergehex等

安装nRF connect手机版和桌面版，通过蓝牙连接开发板，包括Jlink驱动

安装nRF toolbox

~~安装nRFgo studio 图形化flash烧录工具~~

## 3. 入门

[Getting started with MDK Create applications with µVision® for ARM® Cortex®-M microcontrollers](http://www2.keil.com/docs/default-source/default-document-library/mdk5-getting-started.pdf?sfvrsn=2[NC,L])

### 3.1 keil5创建工程项目

建立工程，创建工程文件夹，创建文件，添加文件到工程，添加文件路径，生成机器可读的HEX文件<sup>[ref](https://blog.csdn.net/qq_44713454/article/details/98889913)</sup>

[how to create new project in keil from scracth](https://devzone.nordicsemi.com/f/nordic-q-a/9098/how-to-create-new-project-in-keil-from-scracth)
	 
	
### 3.2 使用SDK

+ nRF52832和nRF52810对应开发板编号为PCA10040。虽然52832和52810共用同一块开发板，但是他们在SDK中的项目编号是不一样的，52832对应PCA10040目录，52810对应PCA10040e目录
+ nRF52840和nRF52811对应开发板编号为PCA10056。虽然52840和52811共用同一块开发板，但是他们在SDK中的项目编号是不一样的，52840对应PCA10056目录，52811对应PCA10056e目录，由于52811和52840 PIN to PIN兼容，软件也是完全兼容的
+ nRF52840 dongle编号为PCA10059
+ nRF51系列对应开发板编号为PCA10028

Nordic SDK例程目录结构为：SDK版本/ examples /协议角色/例子名称/开发板型号/协议栈型号/工具链类型/具体工程

Nordic每一个例子都支持5种工具链：Keil5/Keil4/IAR/GCC/SES

[Nordic nRF5 SDK(16.0) 例子介绍example&docs](https://www.cnblogs.com/iini/p/9095551.html)

[开发你的第一个BLE应用程序—Blinky](https://www.cnblogs.com/iini/p/8996025.html)
	
[在线文档](https://infocenter.nordicsemi.com/topic/sdk_nrf5_v16.0.0/getting_started_softdevice.html?cp=7_1_1_3)

### 3.3 烧录

通过JLINK V9

Keil5提示“the selected device NRF52840 is unkown to this version of the J-Link software”

解决方法：有人说是因为keil5的版本问题，有人说是因为nRF Studio的版本已经停止更新的问题，
所以去控制面板卸载了nRF Studio和基本所有带JLINK和SEGGER的东西，重新安装JLINK驱动发现SEGGER不可写，重启电脑安装即可，
安装Jlink会弹出 Keil MDK-ARM(DLL V5.12f in "C:\Keil_v5\ARM\Segger")，一定要勾选，
发现360杀毒会删除jflashapi几个文件，去恢复区恢复并禁止再次查杀，
然后安装了nRF Connect，从中安装了Programmer

![keil5 nrf5 SDK](/docs/docs_image/software/hardware/dk_nrf52_03.png)

[Jlink Download](https://www.segger.com/downloads/jlink/#J-LinkSoftwareAndDocumentationPack)

[nRF Connect](https://www.nordicsemi.com/Software-and-tools/Development-Tools/nRF-Connect-for-desktop/Download#infotabs)

### 3.4 通信

I2C UART

[手把手教你开发BLE数据透传应用程序](https://www.cnblogs.com/iini/p/9095622.html)
E:\workspace\iot\nRF52840\2 sdk\nRF5_SDK_16.0.0_98a08e2\examples\ble_peripheral\ble_app_uart\pca10056\s140\arm5_no_packs
Load "flash_s140_nrf52_7.0.1_softdevice"
then Load nrf52840_xxaa

build failed
"RTE\Device\nRF52840_xxAA\system_nrf52840.c(29): error: #5: cannot open source input file "nrf_erratas.h": No such file or directory"
 replace examples /ble_peripheral /ble_app_uart /pca10056/s140/arm5_no_packs/ RTE/Device/nRF52840_xxAA/system_nrf52840.c  with  modules / nrfx / mdk / system_nrf52840.c.
https://devzone.nordicsemi.com/f/nordic-q-a/54749/sdk16-0-keil5-26-building-error


BLE连接建立过程 http://www.mamicode.com/info-detail-2275982.html

todo:
bootloader烧写
https://www.arduino.cn/thread-92918-1-1.html

mcu（arm）系列一般i2c做烧录，或者用jlink转i2c（swd，swc）我们叫serial wire；通常uart是mcu烧录好bootloader后，用来跟电脑或者其他系统通信的；uart是应用层面

开发板通过SWD或者JTAG的连接方式连接到仿真器，然后仿真器接电脑,
使用仿真器之前先安装对应的仿真器的驱动 

jlink烧录比较快与直接；uart烧录，就是烧录最终程序；系统安全开发，用uart通信完成；我们加密后的mcu，只留uart接口，做与外界系统交流

串口烧录

通过pc的uart烧录；这个看nrf的pc app有无支持

STM32通过串口烧录程序  原理跟这片soc差不多的
这片soc里面跑的是cortex M4的内核  应该都是万变不离其中


 	
---

Rerference：

[Nordic nRF51/nRF52开发环境搭建](https://www.cnblogs.com/iini/p/9043565.html)	

[nRF52 Using nRF5 SDK step by step 1. from nothing for KEIL](https://www.youtube.com/watch?v=UnssEw1G_Zg)

[自动生成 Keil MDK 工程](https://help.aliyun.com/document_detail/143497.html)
