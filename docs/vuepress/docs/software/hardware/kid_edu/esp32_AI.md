https://www.hackster.io/longpth/esp32-cam-ai-robot-50173c
https://github.com/lyhistory/tools_iot_aigc-ESP32CamAI

## 小智项目：
https://github.com/78/xiaozhi-esp32
https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb

自定义后端：
  https://github.com/78/xiaozhi-esp32/issues/119
  https://github.com/xinnan-tech/xiaozhi-esp32-server

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