---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《arduino》

## 1. Basics
ARDUINO UNO PINOUT针脚图
https://www.circuito.io/blog/arduino-uno-pinout/

The Arduino Uno WiFi is an Arduino Uno with an integrated WiFi module. The board is based on the ATmega328P with an ESP8266 WiFi Module integrated. ... One useful feature of Uno WiFi is support for OTA (over-the-air) programming, either for transfer of Arduino sketches or WiFi firmwar

Arduino UNO R3
http://detail.1688.com/offer/44411110860.html?spm=0.0.0.0.LGUcv9

https://www.arduino.cc/
http://www.arduino.cn/
http://tieba.baidu.com/f?kw=arduino&fr=ala0&tpl=5


## 2.IDE

### 2.1 Arduino.CC
![](/docs/docs_image/software/hardware/arduino01.png) 

### 2.2 PlatformIO
https://docs.platformio.org/en/latest/ide/vscode.html#quick-start
https://docs.platformio.org/en/latest/tutorials/espressif32/arduino_debugging_unit_testing.html

m5stick-c
```
[env:m5stick-c]
platform = espressif32
board = m5stick-c
framework = arduino

lib_deps =
  # Using a library name
  M5StickC

```
![](/docs/docs_image/software/hardware/arduino02.png) 


Debug
http://community.m5stack.com/topic/1135/please-allow-jtag-or-jtag-over-usb-on-next-version
JTAG probe
https://docs.platformio.org/en/latest/tutorials/espressif32/arduino_debugging_unit_testing.html

## Uno

真串口 软串口
![](/docs/docs_image/software/hardware/arduino03.png) 

+wifi 
ESP8266 With Arduino Uno R3 and WiFi Network https://www.youtube.com/watch?v=4CFFXeThH4c
https://www.instructables.com/id/Add-WiFi-to-Arduino-UNO/

https://forum.arduino.cc/index.php?topic=419858.0

Uno wifi ArduinoWiFi.h
https://www.c-sharpcorner.com/article/webserverblink-using-arduino-uno-wifi/
https://swf.com.tw/?p=884


Wifi web server
https://platformio.org/lib/show/1541/WiFi%20Link/examples

Wifi shield?
https://www.arduino.cc/en/Tutorial/WiFiWebServer

Test web3e
https://github.com/kopanitsa/web3-arduino

https://github.com/AlphaWallet/Web3E
https://platformio.org/lib/show/5781/Web3E/examples


<disqus/>