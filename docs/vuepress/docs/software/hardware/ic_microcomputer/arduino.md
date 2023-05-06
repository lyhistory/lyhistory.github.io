---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《arduino》

## 1. Basics
Arduino Leonardo vs Uno
Uno is a suitable platform for early learners. It is used for multiple purposes which can also be used as a controller and directly powered from the USB battery or through an AC to DC adapter. It can be efficiently used for smaller projects. But Arduino Leonardo released a few years ago which gained more attention when compared to uno. The Arduino Leonardo is an ATmega 32U4 microcontroller with an inbuilt USB and a crystal oscillator.
https://www.educba.com/arduino-leonardo-vs-uno/

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

## PWM (Pulse Width Modulation) - Digital to Analog Converter
 is a technique for getting analog results with digital means. Digital control is used to create a square wave, a signal switched between on and off. This on-off pattern can simulate voltages in between the full Vcc of the board (e.g., 5 V on UNO, 3.3 V on a MKR board) and off (0 Volts) by changing the portion of the time the signal spends on versus the time that the signal spends off. The duration of "on time" is called the pulse width. To get varying analog values, you change, or modulate, that pulse width. If you repeat this on-off pattern fast enough with an LED for example, the result is as if the signal is a steady voltage between 0 and Vcc controlling the brightness of the LED.
 https://docs.arduino.cc/learn/microcontrollers/analog-output

## prototype shield
Prototype Shield V.5

## from Ardunino to permanent version on ATMega32/ATMega328
https://www.youtube.com/watch?v=Sww1mek5rHU
https://www.instructables.com/Using-Atmega32-with-Arduino-IDE/
most of the time I have used the Arduino Uno,
 the Uno is a very inexpensive Arduino especially when you get one of the clones and it's probably the most popular Arduino
,however there comes a time when you're finished with your project and you may like to make a permanent version of it and when you do you have a number of choices:
+ one of your choices of course is just to use the Uno itself and build it into an enclosure along with the rest of the components or shields that you need to complete your project and that's an excellent choice but naturally that ends up using your Arduino Uno and if you want to do some experimenting you'll need to get another Arduino Uno 
+ second choice is to go and use one of the smaller models of Arduino，
	- the Arduino Nano
	the Nano is a great little device that pretty well emulates everything in uno does, it even has two extra analog pins on it and it has a USB connector etc, it can be used in place of an Arduino Uno just fine and as it's much smaller it'll probably fit into a smaller enclosure 
	- the Arduino Pro Mini
	the Arduino Pro Mini is even tinier but it lacks the USB port but your project may not even need a USB port 
+ the third choice is to use the actual microcontroller unit that is on the Arduino Uno: ATMega328 
+ 
## todo
Arduino as ISP and Arduino Bootloaders https://docs.arduino.cc/built-in-examples/arduino-isp/ArduinoISP


<disqus/>