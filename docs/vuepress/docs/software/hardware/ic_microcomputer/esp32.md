[](https://github.com/DFRobot/SportsButtonESP32C3)





ESP32 With Integrated OLED (WEMOS/Lolin)
https://www.instructables.com/ESP32-With-Integrated-OLED-WEMOSLolin-Getting-Star/

## esp32 12v solenoid lock 

清单：
+ 5v1a 微型电磁锁 ph2.0公头
+ 5v Relay开关
+ 5v1a 电源适配器
+ ph2.0母头转dc母头

https://www.circuito.io/app?components=9442,360217,842876

https://www.youtube.com/watch?v=kGkyvVwwuL8

https://esp32io.com/tutorials/esp32-solenoid-lock


https://creativepradeepthehomeofelectronics.blogspot.com/2021/07/smart-wifi-controlled-door-lock-system.html

https://www.hackster.io/robocircuits/iot-door-lock-project-0601f5

## troubleshooting

?# class WiFiClientSecure' has no member named 'setInsecure'

```
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
board_build.partitions = no_ota.csv
lib_deps = h2zero/NimBLE-Arduino@^1.3.1
	   AugustESP32
```
=> upgrade to latest
```
[env:esp32dev]
platform = https://github.com/platformio/platform-espressif32.git
board = esp32dev
framework = arduino
platform_packages =
    framework-arduinoespressif32 @ https://github.com/espressif/arduino-esp32#master
monitor_speed = 115200
board_build.partitions = no_ota.csv
lib_deps = h2zero/NimBLE-Arduino@^1.3.1
    AugustESP32
```