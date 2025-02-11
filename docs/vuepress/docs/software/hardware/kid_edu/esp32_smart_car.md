## 小车模块
https://www.youtube.com/watch?v=E2raPpB2aJ0


底盘 2WD150A
ESP32-C3-DevKitM-1 (ESP32-C3-MINI-1)

超声避障

蓝牙控制
    Bluetooth electronic app


wifi控制

Arduino智能小车
https://www.hackster.io/goldscrew/arduino-obstacle-avoiding-robot-car-2wd-with-aa-battery-514b3c
https://www.codemahal.com/2wd-robotic-car-arduino
https://www.instructables.com/OSOYOO-2WD-Robot-Car-Starter-Kit/

树莓派 智能小车
[化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！](https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG)

## Remote Control 

### 基本控制器
Remote Control Options for an ESP32-C3 Smart Car

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

### 2wd esp8266小车 + esp32 遥控
