## 小车概述

+ 底盘 
    - 2WD150A
    - 履带
+ 控制器
    - ESP8266
    - ESP32-C3-DevKitM-1 (ESP32-C3-MINI-1)
+ 遥控器
    - 手机连接小车控制器提供的webserver进行网页操控
    - 手机app
    - 控制手柄
+ 模块
    - 图传
    - 超声波 [HC-SR04 Ultrasonic Sensor](https://randomnerdtutorials.com/esp32-hc-sr04-ultrasonic-arduino/)

参考链接：
[YFROBOT Motor Driver Library for Arduino 可用模块： L298P / PM-R3 / MD01 / MD02 / MD03 / MD04 / MD_GB36 / IIC_MOTORDRIVER / IIC_MOTORDRIVER_RZ7889 小车套件： VALON / 4WD Mecanum Wheel](https://github.com/YFROBOT-TM/Yfrobot-Motor-Driver-Library)

[由 ESP32 驱动的 FPV 汽车](https://www.espressif.com/zh-hans/news/ESP32_Powered_FPV_Car)

https://www.youtube.com/watch?v=E2raPpB2aJ0

Arduino智能小车
https://www.hackster.io/goldscrew/arduino-obstacle-avoiding-robot-car-2wd-with-aa-battery-514b3c
https://www.codemahal.com/2wd-robotic-car-arduino
https://www.instructables.com/OSOYOO-2WD-Robot-Car-Starter-Kit/

树莓派 智能小车
[化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！](https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG)

## Remote Control 

https://www.youtube.com/watch?v=SVlm7QU5Nkk
https://www.seeedstudio.com/blog/2023/04/13/ble-wifi-remote-using-seeed-studio-xiao-esp32c3/

https://www.e-tinkers.com/2019/11/build-an-esp32-web-server-and-ir-remote/

https://oshwhub.com/satun/c3mini-yao-kong-qi_copy
https://www.youtube.com/watch?v=SVlm7QU5Nkk
https://www.hackster.io/techstudycell/esp32-bluetooth-home-automation-with-ir-remote-control-relay-10d4e8?f=1
https://www.youtube.com/watch?v=dODmsoAu0D4

### 基本控制器
Remote Control Options for an ESP32-C3 Smart Car

+ 低成本、短距离：蓝牙、红外（IR）。

+ 中距离、低功耗：ZigBee、LoRa。
    - 大夏龙雀
+ 远距离、实时性：4G/5G （LTE LTE stands for Long-Term Evolution. It is a standard for wireless broadband communication, commonly used for high-speed data transfer in cellular networks.)。
    - 4g模块： 中移远
    - 4g模块：EC20
+ 复杂功能、高扩展性：云平台（如AWS IoT、阿里云IoT）、ROS（机器人操作系统）。

| Method                    | Technology                         | Range         | Latency         | Power Consumption | Ease of Implementation | Pros                                                          | Cons                                                  |
|---------------------------|------------------------------------|---------------|-----------------|-------------------|------------------------|---------------------------------------------------------------|-------------------------------------------------------|
| Wi-Fi Web Server          | Wi-Fi (ESP32-C3 as AP/STA)         | Up to 100m    | Medium (~50ms)  | High              | ⭐⭐⭐⭐                   | - Control via any browser. - No app required.                 | - Requires Wi-Fi network. - Higher power usage.       |
| Wi-Fi WebSocket           | Wi-Fi (Real-time)                  | Up to 100m    | Low (~10ms)     | High              | ⭐⭐⭐⭐                   | - Faster than HTTP. - Works on a local network.               | - Requires a stable connection.                       |
| Wi-Fi MQTT                | Wi-Fi + MQTT Broker                | Internet-wide | Medium (~100ms) | Medium            | ⭐⭐⭐                    | - Remote control from anywhere. - Supports cloud integration. | - Needs an MQTT broker. - Slight delay.               |
| Bluetooth Classic         | Bluetooth BR/EDR                   | ~10m          | Low (~10ms)     | Low               | ⭐⭐⭐                    | - Works with classic Bluetooth controllers.                   | - ESP32-C3 lacks Bluetooth Classic.                   |
| Bluetooth LE (BLE)        | Bluetooth Low Energy               | ~10m          | Low (~20ms)     | Very Low          | ⭐⭐⭐⭐                   | - Energy-efficient. - Works with smartphones.                 | - Less bandwidth than Wi-Fi. - Limited range.         |
| ESP-NOW                   | Proprietary ESP32 Protocol         | ~50m (LOS)    | Very Low (~5ms) | Very Low          | ⭐⭐⭐⭐⭐                  | - No Wi-Fi required. - Very low latency.                      | - Limited to ESP-based devices.                       |
| LoRa                      | Long Range Radio (433MHz - 915MHz) | Up to 10km    | High (~500ms+)  | Very Low          | ⭐                      | - Very long-range.                                            | - Very slow data rate. - Needs extra LoRa module.     |
| NRF24L01                  | 2.4GHz RF Module                   | Up to 1km     | Low (~10ms)     | Low               | ⭐⭐                     | - Simple, fast, and reliable.                                 | - Requires additional module. - Not internet-capable. |
| IR Remote                 | Infrared (38kHz)                   | Up to 5m      | Low (~10ms)     | Very Low          | ⭐⭐⭐                    | - Cheap and simple.                                           | - Needs line-of-sight. - Can be affected by sunlight. |
| RF Remote (433MHz/315MHz) | Radio Frequency (RF)               | Up to 100m    | Low (~20ms)     | Low               | ⭐⭐                     | - Cheap modules available. - No pairing needed.               | - No encryption. - Prone to interference.             |
| ZigBee | ZigBee（IEEE 802.15.4） | 100m | low | low | - | 低功耗，支持多设备组网 | 通信距离较短（通常100米以内） |
| 4g/5g LTE | 基站 | 不限距离 | low | low | 不限距离 全球可用 | 流量费用贵 | 



#### Wi-Fi WebSocket
WebSocket provides real-time, low-latency communication between a Web UI or another ESP32 device and your ESP32-C3 smart car over Wi-Fi.

(A) WebSocket Server (Receiver - ESP32-C3 on Smart Car)
This ESP32-C3 will receive commands from a WebSocket client (e.g., a web browser or another ESP32).
```
#include <WiFi.h>
#include <WebSocketsServer.h>
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

WebSocketsServer webSocket(81);

void handleWebSocketMessage(uint8_t *payload) {
    Serial.printf("Received: %s\n", payload);
    if (strcmp((char*)payload, "FORWARD") == 0) {
        // Move car forward
    } else if (strcmp((char*)payload, "STOP") == 0) {
        // Stop the car
    }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
    if (type == WStype_TEXT) {
        handleWebSocketMessage(payload);
    }
}

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("Connected!");

    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();
}

```

(B) WebSocket Client (Sender - Web Browser)
Use this simple HTML/JavaScript webpage to control the ESP32 smart car from a browser.
```
<!DOCTYPE html>
<html>
<head>
    <title>ESP32 Car Controller</title>
</head>
<body>
    <button onclick="sendCommand('FORWARD')">Move Forward</button>
    <button onclick="sendCommand('STOP')">Stop</button>
    
    <script>
        const socket = new WebSocket("ws://ESP32_IP:81");

        socket.onopen = () => console.log("Connected to ESP32");
        socket.onmessage = (event) => console.log("Received:", event.data);

        function sendCommand(cmd) {
            socket.send(cmd);
        }
    </script>
</body>
</html>
```

#### ESP-NOW (ESP32-to-ESP32 Communication)
ESP-NOW is fast (low latency ~5ms), lightweight, and doesn’t require Wi-Fi.

(A) ESP-NOW Receiver (ESP32-C3 on Smart Car)
```
#include <esp_now.h>
#include <WiFi.h>

typedef struct {
    char message[32];
} CarCommand;

void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
    CarCommand command;
    memcpy(&command, incomingData, sizeof(command));
    Serial.printf("Received: %s\n", command.message);
}

void setup() {
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    if (esp_now_init() != ESP_OK) {
        Serial.println("ESP-NOW Init Failed");
        return;
    }
    esp_now_register_recv_cb(OnDataRecv);
}

void loop() {
}
```
(B) ESP-NOW Sender (ESP32 Remote)
```
#include <esp_now.h>
#include <WiFi.h>

typedef struct {
    char message[32];
} CarCommand;

CarCommand command;
esp_now_peer_info_t peerInfo;
uint8_t receiverMAC[] = {0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX}; // Replace with receiver ESP32 MAC

void sendCommand(const char* cmd) {
    strcpy(command.message, cmd);
    esp_now_send(receiverMAC, (uint8_t*)&command, sizeof(command));
}

void setup() {
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);

    if (esp_now_init() != ESP_OK) {
        Serial.println("ESP-NOW Init Failed");
        return;
    }

    memcpy(peerInfo.peer_addr, receiverMAC, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    esp_now_add_peer(&peerInfo);
}

void loop() {
    sendCommand("FORWARD");
    delay(2000);
    sendCommand("STOP");
    delay(2000);
}

```
Note: Replace receiverMAC with the receiver ESP32's MAC Address (use WiFi.macAddress() to get it).

#### NRF24L01 (2.4GHz RF Communication)
NRF24L01 allows ESP32-to-ESP32 communication without Wi-Fi, using radio signals.

Hardware Setup
Connect the NRF24L01 module to ESP32 via SPI:
MISO → GPIO 19
MOSI → GPIO 23
SCK → GPIO 18
CSN → GPIO 5
CE → GPIO 4

(A) NRF24L01 Receiver (ESP32-C3 on Smart Car)
```
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

RF24 radio(4, 5); // CE, CSN pins
const byte address[] = "00001";
char receivedCommand[32];

void setup() {
    Serial.begin(115200);
    radio.begin();
    radio.openReadingPipe(0, address);
    radio.setPALevel(RF24_PA_MIN);
    radio.startListening();
}

void loop() {
    if (radio.available()) {
        radio.read(&receivedCommand, sizeof(receivedCommand));
        Serial.printf("Received: %s\n", receivedCommand);
        // Handle command
    }
}

```

(B) NRF24L01 Sender (ESP32 Remote)
```
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

RF24 radio(4, 5); // CE, CSN pins
const byte address[] = "00001";

void setup() {
    Serial.begin(115200);
    radio.begin();
    radio.openWritingPipe(address);
    radio.setPALevel(RF24_PA_MIN);
    radio.stopListening();
}

void loop() {
    char text[] = "FORWARD";
    radio.write(&text, sizeof(text));
    Serial.println("Sent FORWARD");
    delay(2000);

    char stopText[] = "STOP";
    radio.write(&stopText, sizeof(stopText));
    Serial.println("Sent STOP");
    delay(2000);
}

```

#### LORA

#### 4G/5G

1. 通信协议

| 通信协议       | 描述                                                                 | 特点                                                                 | 适用场景                             |
|----------------|--------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------|
| **4G Cat.1**   | 中等速率通信协议，适合物联网设备                                     | - 下行速率约10Mbps<br>- 低功耗<br>- 成本较低                        | 智能表计、共享设备、物流追踪         |
| **4G Cat.4**   | 高速率通信协议，适合中高带宽需求                                     | - 下行速率约150Mbps<br>- 支持语音和定位功能                         | 远程监控、智能交通、工业物联网       |
| **5G**         | 超高速率通信协议，支持低延迟和高带宽                                 | - 下行速率可达Gbps级别<br>- 超低延迟                                | 自动驾驶、远程医疗、工业自动化       |
| **NB-IoT**     | 窄带物联网协议，适合低功耗、低速率场景                               | - 超低功耗<br>- 覆盖范围广<br>- 成本低                              | 智能表计、环境监测、农业物联网       |

2. 4G/5G通信模块

| 模块名称       | 描述                                                                 | 特点                                                                 | 适用场景                             | 与其他模块的区别                                                                 |
|----------------|--------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------|--------------------------------------------------------------------------------|
| **ML307R**     | 中移物联推出的4G Cat.1通信模块                                      | - 支持4G LTE Cat.1<br>- 低功耗<br>- 内置GNSS定位                    | 智能表计、共享设备、物流追踪         | 速率较低，适合低成本场景；SIM7600和EC20速率更高，功能更强大                       |
| **SIM7600**    | SIMCom推出的4G LTE Cat.4模块                                        | - 支持4G LTE Cat.4<br>- 内置GNSS<br>- 支持语音通话                  | 远程监控、智能交通、工业物联网       | 速率较高，功能丰富；ML307R速率较低，适合低成本场景                                |
| **Quectel EC20** | Quectel推出的4G LTE Cat.4模块                                     | - 支持全球频段<br>- 下行速率150Mbps<br>- 内置GNSS                   | 远程监控、智能交通、工业物联网       | 速率较高，适合全球化应用；ML307R速率较低，适合低成本场景                          |
| **Quectel RM500Q** | Quectel推出的5G模块                                           | - 支持5G超高速率和低延迟<br>- 适合高带宽应用                        | 自动驾驶、远程医疗、工业自动化       | 速率和性能远超4G模块（如ML307R、SIM7600、EC20），但成本较高                       |


3. 固件

| 固件类型       | 描述                                                                 | 特点                                                                 | 适用场景                             |
|----------------|--------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------|
| **AT固件**     | 基于AT指令的通信模块固件                                             | - 简单易用<br>- 支持多种通信模块（如ML307R、SIM7600、Quectel模块）   | 嵌入式开发、模块控制                 |
| **QuecOpen**   | Quectel提供的开发平台固件                                           | - 提供高级API和功能<br>- 支持二次开发                               | 工业物联网、车联网、远程监控         |
| **自定义固件** | 用户根据需求开发的固件                                               | - 高度定制化<br>- 适合特定应用场景                                  | 特殊需求项目、科研开发               |


### Transmitter with Joysticks 

#### ESP32 + ESP-NOW Joystick Controller Tutorial
https://www.instructables.com/ESP-NOW-Remote-Control/

#### ESP32 + nrf24l01 joystick
https://github.com/walcht/nRF-transmitter
https://forum.dronebotworkshop.com/2018/the-nrf24l01-wireless-joystick-for-arduino-robot-car-with-nrf24l01/
https://www.youtube.com/watch?v=lhGXAJj8rJw

## Image/Video Transmission 图传



| Option                                                 | Resolution      | Latency     | Range             | Difficulty Level | Use Case                                |
|--------------------------------------------------------|-----------------|-------------|-------------------|------------------|-----------------------------------------|
| ESP32-CAM (Wi-Fi Streaming)                            | Up to 1600x1200 | Medium      | Short (~30m)      | Medium           | Live video to mobile/web browser        |
| ESP32-CAM (ESP-NOW + Wi-Fi Hybrid)                     | Up to 1600x1200 | Medium      | Medium (~100m)    | Hard             | Streaming with low-latency control      |
| ESP32-CAM + NRF24L01                                   | Up to 800x600   | Medium-High | Long (~1km)       | Hard             | Video + control over radio              |
| Analog FPV (Dedicated FPV Camera + 5.8GHz Transmitter) | 480p-720p       | Very Low    | Very Long (~5km)  | Medium           | FPV drone/car setup                     |
| ESP32 with LoRa (for images, not real-time video)      | Low  800x600    | High        | Very Long (~10km) | Hard             | Slow image transfer over long distances |
| ESP32-S3 + OV5640 (Higher Resolution Camera)           | 2592x1944       | Medium      | Short (~30m)      |
| ESP32 with USB Camera (UVC)                            | 1080p           | Medium      | Short (~50m)      |
| ESP32 + RTSP Streaming (ESP32-CAM or S3)               | 1080p           | Medium      | Medium(~100m)     |
| 5.8GHz FPV Camera (Dedicated FPV System)               | 720p-1080p      | Very Low    | Very Long (~5km)  |
| ESP32 + LTE Module (4G Streaming)                      | 1080p           | Medium-High | Unlimited (cellular)     |
| Raspberry Pi + CSI Camera ESP32 Sends Control Commands via UART or I2C to Raspberry Pi | 4K           | Low      | Long (~300m with Wi-Fi)      |

### ESP32-S3 + OV5640 (Higher Resolution Camera)

### enable 360-degree camera rotation

| Method                                                | Description                                                                          | Pros                                                   | Cons                                                     |
|-------------------------------------------------------|--------------------------------------------------------------------------------------|--------------------------------------------------------|----------------------------------------------------------|
| 1. Servo-Based Pan-Tilt Mechanism                     | Uses two servo motors (one for pan, one for tilt) to move the camera.                | ✅ Simple to implement  ✅ Works with all cameras        | ❌ Limited movement speed  ❌ Servo jitter                 |
| 2. Stepper Motor 360° Rotation Base                   | Uses a stepper motor to rotate the entire camera module.                             | ✅ Precise 360° rotation  ✅ Stable movement             | ❌ More complex than servos  ❌ Requires driver circuit    |
| 3. DC Motor with Slip Ring (Continuous Rotation)      | Uses a DC motor + slip ring to allow continuous, unrestricted 360° rotation.         | ✅ Infinite rotation  ✅ Smooth movement                 | ❌ Harder to control positioning  ❌ Requires motor driver |
| 4. ESP32-CAM with a Rotating Mirror (Periscope Style) | Uses a small rotating mirror in front of the fixed camera lens to redirect the view. | ✅ No need to move camera  ✅ Works with fixed ESP32-CAM | ❌ Optical distortion possible  ❌ Complex mirror system   |

## 控制器+图传

Recommended Libraries and Frameworks to Search on GitHub

- [ESP32 Camera Library: The esp32-camera library for integrating cameras with the ESP32. This can be used in conjunction with other remote control methods.](https://github.com/espressif/esp32-camera)

- [ESP32 WebSocket Libraries: For controlling your robot via a WebSocket server, you can use libraries like ESPAsyncWebServer or WebSocketsServer.](https://github.com/me-no-dev/ESPAsyncWebServer)

- ESP32 Joystick Library: You can use a library like ESP32 Joystick to help interface with joysticks.



### Option 1 Mobile App for Remote Control

WebSocket Control + Video Streaming

Search on GitHub: You can search for active repositories on GitHub by searching these terms:
"ESP32-CAM WebSocket control"
"ESP32 robot WiFi camera"
"ESP32-CAM live video feed control"


### Option 2 ESP32 and Joystick/Controller with Display
TFT Display
OLED Display

Search on GitHub: Similarly, you can search for "ESP32 Joystick TFT control" or "ESP32 robot joystick with display" to find available joystick-controlled robot projects.

### Option 3 ESP32 and  Joystick/Controller + Mobile app for Image/Video transmission

就是前两者的配合，典型的就是遥控器配上手机


## 实战

### 2wd esp8266小车 + esp32 遥控 (espnow)

#### 小车接线和代码
清单：
+ 2wd小车底盘
+ 电机*2
+ 万向轮
+ [超声波 HC-SR04 Ultrasonic Sensor](https://www.instructables.com/Distance-Measurement-Using-HC-SR04-Via-NodeMCU/)
+ ESP8266
+ [L298N电机驱动](https://randomnerdtutorials.com/esp32-dc-motor-l298n-motor-driver-control-speed-direction/)
+ todo [SG90舵机云台](https://www.techcoil.com/blog/how-to-control-a-sg90-servo-motor-with-the-esp8266-nodemcu-lua-development-board/)
+ todo ESP23CAM

接线
```

电源    --------------  L298N电机驱动
正极 -------------------------  12V
负极 -------------------------  GND

ESP8266  --------------  超声波 HC-SR04 
3.3V    -------------------------   VCC
GND -------------------------   GND
D8  -------------------------   Trigger Pin
D7  -------------------------   Echo Pin

ESP8266  --------------  L298N电机驱动
VIN -------------------------   5V (电机给ESP供电)
GND -------------------------   GND
D6  -------------------------   ENA 
D5  -------------------------   IN1	(motorPinA1)
D4  -------------------------   IN2	(motorPinA2)
D3  -------------------------   IN3 (motorPinB2)
D2  -------------------------   IN4 (motorPinB1)
D1  -------------------------   ENB
 

电机 -------------- L298N电机驱动
电机的两级输入线头朝内，然后上面的线接电机驱动的最前面，下面的线接电机驱动的后面第二个

左边电机接电机驱动A侧，右边电机接电机驱动B侧。
前进时如果哪边电机有反转的情况，将该电机的两电线反接即可。


```
代码
```

```
#### 遥控接线和代码

接线
```
ESP32  -----------------  OLED屏
22  --------------------  SCL（SCK）
21  --------------------  SDA
3V  --------------------- VCC
GND  ------------------- GND

ESP32  -----------------  摇杆模块
34  ---------------------  Y轴
35 ----------------------  X轴
26 ----------------------- VCC

ESP32  -----------------  电位器模块（上）
32  --------------------  信号（OUT）
27 ---------------------   VCC

ESP32  -----------------  电位器模块（下）
33  --------------------  信号（OUT）
14  ---------------------   VCC

ESP32  -----------------  按钮模块
25  --------------------  信号（S）
12  ---------------------   GND

稳压电源模块  ----------------- 各模块
5V  ---------------------   ESP32的Vin
GND  -------------------   ESP32的GND
GND  -------------------   摇杆模块的GND
GND  -------------------   电位器模块（上）的GND
GND  -------------------   电位器模块（下）的GND
GND  -------------------   按钮模块的VCC

```

代码
```

```

### L298N => rz7889
换成 rz7889驱动

连线图:
```
ESP8266  --------------  RZ7886电机驱动
VIN  -------------------------  5V
GND  -----------------------  GND
D1  --------------------------   A-1
D2  ---------------------- ----  A-2
D3   --------------------------  B-1
D4   --------------------------  B-2

左边电机接电机驱动A侧，右边电机接电机驱动B侧。
前进时如果哪边电机有反转的情况，将该电机的两电线反接即可。

```

代码：
```

#include <ESP8266WiFi.h>
#include <espnow.h>

volatile int enableAvoidCollision;
volatile int joystickYMedian;
volatile int joystickXMedian;
volatile int joystickY;
volatile int joystickX;
volatile int rotationSensorSpeed;
volatile int rotationSensorSpeedAdj;
volatile int connectionLostCountdown;
volatile int motorASpeed;
volatile int motorBSpeed;
volatile int motorASpeedAdj;
volatile int motorBSpeedAdj;
volatile int detour;

unsigned long now = millis();
unsigned long lastTrigger = 0;
#define timeSeconds 10					  
const int trigPin = 12;
const int echoPin = 14;

//define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;

// Motor A
int motorPinA1 = D1; 
int motorPinA2 = D2; 

// Motor B
int motorPinB1 = D4; 
int motorPinB2 = D5; 

void OnDataRecv(uint8_t * mac, uint8_t *incomingData, uint8_t len) {
  //Serial.printf("Recived Message from MAC:%02X:%02X:%02X:%02X:%02X:%02X\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  String message = "";
  for (int i = 0; i < static_cast<int>(len); i++) {
    message += String(static_cast<char>(incomingData[i]));
  }
  //Serial.println(message);
  connectionLostCountdown = 10;
  lastTrigger = millis();
  enableAvoidCollision = String(String(message).substring(0,1)).toInt();
  joystickY = String(String(message).substring(1,String(message).indexOf(String("Y")))).toInt();
  joystickX = String(String(message).substring((String(message).indexOf(String("Y")) + 1),String(message).indexOf(String("X")))).toInt();
  rotationSensorSpeed = String(String(message).substring((String(message).indexOf(String("X")) + 1),String(message).indexOf(String("A")))).toInt();
  rotationSensorSpeedAdj = String(String(message).substring((String(message).indexOf(String("A")) + 1),String(message).indexOf(String("B")))).toInt();
  RemoteControlMotorsLogic();
}

void ConnectionLostCountdownTimer() {
  if (connectionLostCountdown > 0) {
    connectionLostCountdown = connectionLostCountdown - 1;

  }
  if (connectionLostCountdown == 0) {
    motorASpeed = 0;
    motorBSpeed = 0;
    enableAvoidCollision = 0;

  }
}

void RemoteControlMotorsLogic() {
  if (joystickY < joystickYMedian - 4) {
    if (joystickX > joystickXMedian + 4) {
      motorASpeed = (map(joystickY, 37, 0, 0, 255)) + (map(joystickX, 49, 99, 0, 255));
      motorBSpeed = (map(joystickY, 37, 0, 0, 255)) - (map(joystickX, 49, 99, 0, 255));

    }
    if (joystickX >= joystickXMedian - 4 && joystickX <= joystickXMedian + 4) {
      motorBSpeed = (map(joystickY, 37, 0, 0, 255));
      motorASpeed = (map(joystickY, 37, 0, 0, 255));

    }
    if (joystickX < joystickXMedian - 4) {
      motorASpeed = (map(joystickY, 37, 0, 0, 255)) + (map(joystickX, 37, 0, 0, (-256)));
      motorBSpeed = (map(joystickY, 37, 0, 0, 255)) - (map(joystickX, 37, 0, 0, (-256)));

    }

  }
  if (joystickY >= joystickYMedian - 4 && joystickY <= joystickYMedian + 4) {
    if (joystickX > joystickXMedian + 4) {
      motorASpeed = (map(joystickX, 49, 99, 0, 255));
      motorBSpeed = (map(joystickX, 49, 99, 0, (-256)));

    }
    if (joystickX >= joystickXMedian - 4 && joystickX <= joystickXMedian + 4) {
      motorASpeed = 0;
      motorBSpeed = 0;

    }
    if (joystickX < joystickXMedian - 4) {
      motorASpeed = (map(joystickX, 37, 0, 0, (-256)));
      motorBSpeed = (map(joystickX, 37, 0, 0, 255));

    }

  }
  if (joystickY > joystickYMedian + 4) {
    if (joystickX > joystickXMedian + 4) {
      motorASpeed = (map(joystickY, 49, 99, 0, (-256))) - (map(joystickX, 49, 99, 0, 255));
      motorBSpeed = (map(joystickY, 49, 99, 0, (-256))) + (map(joystickX, 49, 99, 0, 255));

    }
    if (joystickX >= joystickXMedian - 4 && joystickX <= joystickXMedian + 4) {
      motorBSpeed = (map(joystickY, 49, 99, 0, (-256)));
      motorASpeed = (map(joystickY, 49, 99, 0, (-256)));

    }
    if (joystickX < joystickXMedian - 4) {
      motorASpeed = (map(joystickY, 49, 99, 0, (-256))) - (map(joystickX, 37, 0, 0, (-256)));
      motorBSpeed = (map(joystickY, 49, 99, 0, (-256))) + (map(joystickX, 37, 0, 0, (-256)));

    }

  }
}

float checkdistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculate the distance
  distanceCm = duration * SOUND_SPEED/2;
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  delay(10);
  return distanceCm;
}

void AvoidCollision() {
  if (detour == 0) {
    if (checkdistance() <= 40) {
      detour = 1;

    }

  } else {
    if (checkdistance() >= 80) {
      detour = 0;

    }

  }
  if (detour == 1) {
    analogWrite(5, 120);
    analogWrite(4, 0);
    analogWrite(0, 0);
    analogWrite(2, 120);

  } else {
    analogWrite(5, 150);
    analogWrite(4, 0);
    analogWrite(0, 150);
    analogWrite(2, 0);

  }
}

void setup(){
  Serial.begin(9600);
  enableAvoidCollision = 0;
  joystickYMedian = 43;
  joystickXMedian = 43;
  joystickY = 43;
  joystickX = 43;
  rotationSensorSpeed = 0;
  rotationSensorSpeedAdj = 0;
  connectionLostCountdown = 0;
  motorASpeed = 0;
  motorBSpeed = 0;
  motorASpeedAdj = 0;
  motorBSpeedAdj = 0;
  detour = 0;

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  //WiFi.persistent(false);
  //WiFi.mode(WIFI_AP);
  //WiFi.disconnect();
  //WiFi.softAP("ESPNOW", nullptr, 3);
  //WiFi.softAPdisconnect(false);

  Serial.print("Device MAC:");
  Serial.println(WiFi.softAPmacAddress());

  // Init ESP-NOW
  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    //ESP.restart();
    return;
  }

  // Once ESPNow is successfully Init, we will register for recv CB to
  // get recv packer info
  esp_now_set_self_role(ESP_NOW_ROLE_SLAVE);
  esp_now_register_recv_cb(OnDataRecv);

  pinMode(5, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(0, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(motorPinA1, OUTPUT);
  pinMode(motorPinA2, OUTPUT);
  pinMode(motorPinB1, OUTPUT);
  pinMode(motorPinB2, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop(){
  now = millis();
  if(now - lastTrigger > (timeSeconds*1000)) {
    
    ConnectionLostCountdownTimer();
    
  }

  if (rotationSensorSpeedAdj < 40) {
    motorASpeedAdj = (map(rotationSensorSpeedAdj, 0, 39, 120, 3));
    motorBSpeedAdj = (map(rotationSensorSpeedAdj, 0, 39, (-120), (-3)));

  } else {
    if (rotationSensorSpeedAdj > 59) {
      motorASpeedAdj = (map(rotationSensorSpeedAdj, 60, 99, (-3), (-120)));
      motorBSpeedAdj = (map(rotationSensorSpeedAdj, 60, 99, 3, 120));

    } else {
      motorASpeedAdj = 0;
      motorBSpeedAdj = 0;

    }

  }
  if (enableAvoidCollision) {
    AvoidCollision();

  } else {
    // Gear0
    if (rotationSensorSpeed < 33) {
      analogWrite(motorPinA1, 0);
      analogWrite(motorPinA2, 0);
      analogWrite(motorPinB1, 0);
      analogWrite(motorPinB1, 0);

    }
    // Gear1
    if (rotationSensorSpeed >= 33 && rotationSensorSpeed < 66) {
      if (motorBSpeed > 0) {
        analogWrite(motorPinA1, (map(constrain(motorBSpeed + motorBSpeedAdj, 0, 255), 0, 255, 70, 120)));
        analogWrite(motorPinA2, 0);

      } else {
        if (motorBSpeed < 0) {
          analogWrite(motorPinA1, 0);
          analogWrite(motorPinA2, (map(constrain(abs(motorBSpeed - motorBSpeedAdj), 0, 255), 0, 255, 70, 120)));

        } else {
          analogWrite(motorPinA1, 0);
          analogWrite(motorPinA2, 0);

        }

      }
      if (motorASpeed > 0) {
        analogWrite(motorPinB1, (map(constrain(motorASpeed + motorASpeedAdj, 0, 255), 0, 255, 70, 120)));
        analogWrite(motorPinB2, 0);

      } else {
        if (motorASpeed < 0) {
          analogWrite(motorPinB1, 0);
          analogWrite(motorPinB2, (map(constrain(abs(motorASpeed - motorASpeedAdj), 0, 255), 0, 255, 70, 120)));

        } else {
          analogWrite(motorPinB1, 0);
          analogWrite(motorPinB2, 0);

        }

      }

    }
    // Gear2
    if (rotationSensorSpeed >= 66) {
      if (motorBSpeed > 0) {
        analogWrite(motorPinA1, (map(constrain(motorBSpeed + motorBSpeedAdj, 0, 255), 0, 255, 100, 255)));
        analogWrite(motorPinA2, 0);

      } else {
        if (motorBSpeed < 0) {
          analogWrite(motorPinA1, 0);
          analogWrite(motorPinA2, (map(constrain(abs(motorBSpeed - motorBSpeedAdj), 0, 255), 0, 100, 70, 255)));

        } else {
          analogWrite(motorPinA1, 0);
          analogWrite(motorPinA2, 0);

        }

      }
      if (motorASpeed > 0) {
        analogWrite(motorPinB1, (map(constrain(motorASpeed + motorASpeedAdj, 0, 255), 0, 255, 100, 255)));
        analogWrite(motorPinB2, 0);

      } else {
        if (motorASpeed < 0) {
          analogWrite(motorPinB1, 0);
          analogWrite(motorPinB2, (map(constrain(abs(motorASpeed - motorASpeedAdj), 0, 255), 0, 100, 70, 255)));

        } else {
          analogWrite(motorPinB1, 0);
          analogWrite(motorPinB2, 0);

        }

      }

    }

  }

}
```

### ESP32CAM car

[ESP32-CAM远程视频监控&底盘控制](https://yanjingang.com/blog/?p=6598)

[Building a Webserver-Controlled Spy Car with ESP32-Cam: A Step Guide](https://www.embeddedbrew.com/post/building-a-webserver-controlled-spy-car-with-esp32-cam-a-step-guide)


### 4g小车 2wd esp8266小车+mobile app（MQTTClient）

ESP8266 + SIM7600 → Connects to MQTT Broker via Cellular
Batteries (for powering motors and ESP8266)
Voltage Regulator (if needed for SIM7600)
Web/Mobile App → Publishes commands to MQTT Broker
MQTT Broker (e.g., HiveMQ Cloud, EMQX, or Mosquitto) → Routes messages

#### 连线 Wiring

L298N:
Connect IN1, IN2, IN3, IN4 to ESP8266 GPIO pins (e.g., D1, D2, D3, D4).
Enable pins (ENA, ENB) can be connected to PWM pins (e.g., D5, D6) for speed control.

SIM7600:
Connect TX (SIM7600) → RX (ESP8266)
Connect RX (SIM7600) → TX (ESP8266)

Power the SIM7600 with 5V/12V (check datasheet).
Ensure common ground between all components.



#### 小车代码 ESP8266 Code (MQTT + Cellular)

```
#include <SoftwareSerial.h>

// Motor Control Pins
#define IN1 D1
#define IN2 D2
#define IN3 D3
#define IN4 D4

// SIM7600 Configuration
SoftwareSerial sim7600(D7, D8); // RX, TX

// Secure MQTT Configuration
const char* BROKER = "broker.emqx.io"; // SSL-enabled public broker
const int PORT = 8883; // Standard MQTT SSL port
const char* CLIENT_ID = "SecureCar_01";
const char* TOPIC = "smartcar/secure/control";
const char* USER = "your_username";
const char* PASS = "your_password";

// SSL Configuration
const char* CA_CERT = ""; // Add CA certificate if required

void setup() {
  Serial.begin(115200);
  sim7600.begin(115200);

  // Initialize Motor Control
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  stopCar();

  // Initialize Cellular and Secure MQTT
  setupCellular();
  setupSSL();
  connectMQTT();
}

void loop() {
  checkMQTTMessages();
  // Add periodic keep-alive if needed
}

// ================== SSL Configuration ==================
void setupSSL() {
  // Configure SSL context
  sendAT("AT+CMQTTSSLCFG=0,0", "OK", 2000); // Context 0, SSL version (0=ALL)
  sendAT("AT+CMQTTSSLCFG=0,3,1", "OK", 2000); // Verify mode (1=peer verify)
  sendAT("AT+CMQTTSSLCFG=0,4,1", "OK", 2000); // SSL version (1=TLS 1.2)

  // Load CA certificate (if using)
  if(strlen(CA_CERT) > 0) {
    sendAT("AT+CMQTTSSLCFG=0,1,\"ca.crt\"", "OK", 2000);
    // Use AT+FSUPLOAD to upload certificate first
  }
}

// ================== Secure MQTT Connection ==================
void connectMQTT() {
  sendAT("AT+CMQTTSTART", "OK", 5000);
  
  // Acquire client
  String accqCmd = String("AT+CMQTTACCQ=0,\"") + CLIENT_ID + "\",1";
  sendAT(accqCmd.c_str(), "OK", 5000);

  // Set credentials
  if(strlen(USER) > 0) {
    String userCmd = String("AT+CMQTTUSERNAME=0,") + String(strlen(USER)+2) + ",\"" + USER + "\"";
    sendAT(userCmd.c_str(), "OK", 2000);
  }
  
  if(strlen(PASS) > 0) {
    String passCmd = String("AT+CMQTTPASSWORD=0,") + String(strlen(PASS)+2) + ",\"" + PASS + "\"";
    sendAT(passCmd.c_str(), "OK", 2000);
  }

  // SSL Connection
  String connCmd = String("AT+CMQTTCONNECT=0,\"ssl://") + BROKER + ":" + PORT + "\",60,1";
  sendAT(connCmd.c_str(), "OK", 15000);

  // Subscribe to topic
  String subCmd = String("AT+CMQTTSUB=0,") + String(strlen(TOPIC)+2) + ",1";
  sendAT(subCmd.c_str(), "OK", 5000);
  sendAT(TOPIC, "OK", 5000);
}

// ================== Message Handling ==================
void checkMQTTMessages() {
  sendAT("AT+CMQTTSUBTOPIC=0,100", ">", 2000);
  sendAT("", "OK", 5000);

  while(sim7600.available()) {
    String response = sim7600.readStringUntil('\n');
    if(response.indexOf("+CMQTTSUBRECV: 0") != -1) {
      String payload = sim7600.readStringUntil('\n');
      processCommand(payload.charAt(0));
    }
  }
}

// ================== Motor Control Functions ==================
void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void turnLeft() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void turnRight() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void stopCar() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}


// ================== AT Command Utility ==================
void sendAT(const char* cmd, const char* expected, int timeout) {
  sim7600.println(cmd);
  uint64_t start = millis();
  String response;
  
  while(millis() - start < timeout) {
    while(sim7600.available()) {
      char c = sim7600.read();
      response += c;
      if(response.indexOf(expected) != -1) {
        Serial.print("Success: ");
        Serial.println(cmd);
        return;
      }
    }
  }
  Serial.print("Timeout: ");
  Serial.println(cmd);
}
```

#### Controller控制器网页版
```
<!DOCTYPE html>
<html>
<head>
    <title>Smart Car Control</title>
    <style>
        .control-pad {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            gap: 10px;
            margin: 50px auto;
            width: 300px;
        }
        button {
            padding: 20px;
            font-size: 1.2em;
            border-radius: 10px;
        }
        .center {
            grid-column: 2;
        }
    </style>
</head>
<body>
    <div class="control-pad">
        <button onclick="sendCommand('F')">↑</button>
        <button class="center" onclick="sendCommand('S')">Stop</button>
        <button onclick="sendCommand('L')">←</button>
        <button onclick="sendCommand('B')">↓</button>
        <button onclick="sendCommand('R')">→</button>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js"></script>
    <script>
        // Use secure WebSocket
        const client = new Paho.MQTT.Client(
        "wss://" + "broker.emqx.io:8084/mqtt", 
        "webClient_" + Math.random().toString(16)
        );

        client.connect({
        onSuccess: () => console.log("Secure connection established"),
        onFailure: (err) => console.error("SSL error:", err.errorMessage)
        });

        function sendCommand(cmd) {
            const message = new Paho.MQTT.Message(cmd);
            message.destinationName = "smartcar/control";
            client.send(message);
        }
    </script>
</body>
</html>
```
#### Controller控制器MOBILE APP

+ MQTT Dashboard (Android/iOS) - Pre-built app
    Configure connection to your MQTT broker
    Create buttons to publish to smartcar/control
+ MIT App Inventor - Custom app:
    Use MQTT extension
    Create similar button interface


参考：
[ESP8266采用AT指令连接华为云服务器(MQTT固件)](https://juejin.cn/post/7315126213696716838)

[ESP32 远程图传遥控车，基于 MQTT](https://www.techfens.com/posts/esp32mqttcar.html)

[MCU with 4G LTE Modem. Connecting with the server anywhere!](https://www.youtube.com/watch?app=desktop&v=kOYJ-4oZ8Ws)



## Troubleshooting

### L298N电机驱动蜂鸣声 beep buzz

从[这个帖子](https://ask.csdn.net/questions/7475568)的评论得到启示

pwm分频可以小点，这样频率高出20000hz就听不到了

在esp32中有配置：`ledcAttachChannel(enable1Pin, freq, resolution, pwmChannel);`
但是 esp8266 中我没有配置，加上：

```
// Set PWM frequency to 25 kHz (above the audible range)
  analogWriteFreq(25000);
  
  // Optionally set PWM resolution; default range is 1023 on ESP8266 (10-bit resolution)
  analogWriteRange(1023);

  int dutyCycle = map(desiredValue, 0, 255, 0, 1023); // convert from 0-255 to 0-1023
  analogWrite(enablePin, dutyCycle);

```


### L298N两边电机不一致
原来是一边加了注释，一边没加，可能导致执行快慢有区别，最好是计算好两个轮子的功率后，同时赋值，给pin输出的逻辑之间间隔太久