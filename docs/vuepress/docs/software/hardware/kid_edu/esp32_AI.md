https://www.hackster.io/longpth/esp32-cam-ai-robot-50173c
https://github.com/lyhistory/tools_iot_aigc-ESP32CamAI

## 小智项目：
https://github.com/78/xiaozhi-esp32
https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb


### building 

[Windows搭建 ESP IDF 5.3.2开发环境以及编译小智](https://icnynnzcwou8.feishu.cn/wiki/JEYDwTTALi5s2zkGlFGcDiRknXf)

1. 配置

+ 默认编译出的固件是面包板的，如果需要更换板子，需要输入 idf.py menuconfig=>Xiaozhi Assistant=>Board type
+ 如何修改唤醒词 idf.py menuconfig=> => ESP Speech Recognition 
+ 修改websocket api接口  idf.py menuconfig=>Xiaozhi Assistant=>Connection Type=> Websocket

2. build
```
idf.py set-target esp32s3
idf.py build

idf.py build flash monitor

```

3. issues
+ Partitions tables occupies 13.0MB of flash (13631488 bytes) which does not fit in configured flash size 2MB. Change the flash size in menuconfig under the 'Serial Flasher Config' menu.

    Solution:idf.py menuconfig => Serial Flasher Config => flash size

+ Target 'esp32s3' specified on command line is not consistent with target 'esp32' in the environment.
    Solution: open a new terminal

### 烧录启动
将设备保持接通电源，设备将进入配网模式（如果没有则按下开发板上的RST按钮，复位重启设备）。

如果 sRGB 彩灯为蓝色（开发板上的白色灯），并保持闪烁，表示设备处于配网状态。 

使用手机或电脑连接到设备的 WiFi 网络，通常以 Xiaozhi-XXXX 命名。选中并连接，等待几秒wifi热点连接成功，将自动进入选择界面，如果程序没有自动打开浏览器访问 http://192.168.4.1 ，请在确保无线局域网（WIFI）连接的网络是 Xiaozhi-XXXXXX 不要切换，使用浏览器 地址栏输入网址 http://192.168.4.1 进入设备的网络配置页面。

你的设备在WI-FI或4G联网后，需要到 小智AI聊天机器人-控制面板 添加设备验证通过，才能正常使用设备进行AI语音聊天，请按照以下步骤操作：
1) 电脑浏览器访问 小智AI聊天机器人-控制面板 后台：https://xiaozhi.me  创建智能体
2) 请先确保设备已连接到互联网，通过“你好，小智”唤醒，并出现要求添加设备的提示语6位设备验证码（可以重复唤醒重听）,然后去电脑上刚才创建的智能体上添加设备。


issues:
+ 找不到wifi热点，
  [如果是用面包板，保持天线伸出面包板，否则需要在天线上绕几圈导线](https://ccnphfhqs21z.feishu.cn/wiki/KGvIwjTQxiTxPCkRbbjcPnsLnMb)，
  临时用手触摸天线位置，用于WIFI连网。
+ 没有听到语音播报，喇叭没有发声，
  检查功放和喇叭接线是否正常，使用第三方开发板用户请检查固件是否匹配且正常运行。

### 自定义后端：
  https://github.com/78/xiaozhi-esp32/issues/119
  https://github.com/xinnan-tech/xiaozhi-esp32-server

