[](https://github.com/DFRobot/SportsButtonESP32C3)

## Setup

### Arduino IDE
Installing ESP32 Add-on in Arduino IDE
To add ESP32 Board in your Arduino IDE, follow these instructions :

1. Open your Arduino IDE, go to File>Preferences

2. Put https://dl.espressif.com/dl/package_esp32_index.json into the “Additional Board Manager URLs” field as shown in the figure below. Then, click the “OK” button
   
Note: if you already have another boards (i.e ESP8266 boards URL), you can separate the URLs with a comma like this:

https://dl.espressif.com/dl/package_esp32_index.json, http://arduino.esp8266.com/stable/package_esp8266com_index.json

3. Then go to the Boards Manager. Go to Tools > Board > Boards Manager
4. Go to the search bar and type ESP32 then install ESP32 by Espressif Systems
5. 
[install](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html?highlight=update#how-to-update-to-the-latest-code)

### ESP-IDF
https://www.electronics-lab.com/deep-dive-on-controlling-led-with-esp32-c3-devkitm-1-development-board-using-esp-idf/


## ESP32 Products
### ESP32-C3-DevKitM-1 (ESP32-C3-MINI-1)
ESP32-C3-DevKitM-1 is an entry-level development board based on ESP32-C3-MINI-1, a module named for its small size. This board integrates complete Wi-Fi and Bluetooth LE functions.

[EN-pinout](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/hw-reference/esp32c3/user-guide-devkitm-1.html)

[中文-管脚](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32c3/hw-reference/esp32c3/user-guide-devkitm-1.html?highlight=esp32%20c3%20devkitm%201%20v1%20pinout)

### ESP32-C3-DevKitC-02 (ESP32-C3-WROOM-02)
ESP32-C3-DevKitC-02 is an entry-level development board based on ESP32-C3-WROOM-02, a general-purpose module with 4 MB SPI flash. This board integrates complete Wi-Fi and Bluetooth LE functions.

[pinout](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/hw-reference/esp32c3/user-guide-devkitc-02.html?highlight=esp32%20c3%20wroom)

ESP32 With Integrated OLED (WEMOS/Lolin)
https://www.instructables.com/ESP32-With-Integrated-OLED-WEMOSLolin-Getting-Star/


## Power Options
To power your ESP32 dev kit, you have three options:

+ Via the USB port.
+ Using unregulated voltage between 5V and 12V, connected to the 5V and GND pins. This voltage is regulated on-board.
+ Using regulated 3.3V voltage, connected to the 3.3V and GND pins. Be very careful with that: do not exceed the 3.3V limit, or your ESP32 module will be damaged.

Attention: be very, very careful to only use one of those options at the same time.

For example, do not power your ESP32 dev kit via the 5V pin using a 10V input while at the same time you have the module connected to your computer via USB. This will surely damage your module, and perhaps even your computer.

With this, you should have a good understanding of what the ESP32 is, and you must be eager to get hands-on with it. I totally understand :-). Let’s proceed with the next lesson, where I’ll show you how to set up the ESP32-Arduino Core on the Arduino IDE.

## Example

###  “addressable” RGB LED,

ESP32-C3 Blink Test with Arduino IDE and DumbDisplay
https://www.youtube.com/watch?v=BAnvHOs5Fks

Guide for WS2812B Addressable RGB LED Strip with Arduino https://randomnerdtutorials.com/guide-for-ws2812b-addressable-rgb-led-strip-with-arduino/

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

```
//CreativePradeep//
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>


BlynkTimer timer;


int toggleState_1 = 1;
int pushButton1State = HIGH;


int toggleState_2 = 1;
int pushButton2State = HIGH;


int wifiFlag = 0;


#define AUTH "AUTH TOKEN"                 // You should get Auth Token in the Blynk App.  
#define WIFI_SSID "WIFI NAME"             //Enter Wifi Name
#define WIFI_PASS "WIFI PASSWORD"         //Enter wifi Password


#define RELAY_PIN_1      26   //D26
#define RELAY_PIN_2      27   //D27
#define WIFI_LED         25   //D25


#define PUSH_BUTTON_1    32   //D32
#define PUSH_BUTTON_2    33   //D33


#define VPIN_BUTTON_1    V1 
#define VPIN_BUTTON_2    V2


void relayOnOff(int relay){


    switch(relay){
      case 1: 
             if(toggleState_1 == 0){
              digitalWrite(RELAY_PIN_1, HIGH); // turn on relay 1
              toggleState_1 = 1;
              }
             else{
              digitalWrite(RELAY_PIN_1, LOW); // turn off relay 1
              toggleState_1 = 0;
              }
             delay(200);
      break;
      case 2: 
             if(toggleState_2 == 0){
              digitalWrite(RELAY_PIN_2, HIGH); // turn on relay 2
              toggleState_2 = 1;
              }
             else{
              digitalWrite(RELAY_PIN_2, LOW); // turn off relay 2
              toggleState_2 = 0;
              }
             delay(200);
      break;
      default : break;      
      } 
}


BLYNK_CONNECTED() {
  // Request the latest state from the server
  Blynk.syncVirtual(VPIN_BUTTON_1);
  Blynk.syncVirtual(VPIN_BUTTON_2);
}


// When App button is pushed - switch the state


BLYNK_WRITE(VPIN_BUTTON_1) {
  toggleState_1 = param.asInt();
  digitalWrite(RELAY_PIN_1, toggleState_1);
}


BLYNK_WRITE(VPIN_BUTTON_2) {
  toggleState_2 = param.asInt();
  digitalWrite(RELAY_PIN_2, toggleState_2);
}


void with_internet(){
  if (digitalRead(PUSH_BUTTON_1) == LOW) {
      relayOnOff(1);
      // Update Button Widget
      Blynk.virtualWrite(VPIN_BUTTON_1, toggleState_1);
    }
  if (digitalRead(PUSH_BUTTON_2) == LOW) {
      relayOnOff(2);
      // Update Button Widget
      Blynk.virtualWrite(VPIN_BUTTON_2, toggleState_2);
    }
}
void without_internet(){
  if (digitalRead(PUSH_BUTTON_1) == LOW) {
      relayOnOff(1);
    }
  if (digitalRead(PUSH_BUTTON_2) == LOW) {
      relayOnOff(2);
    }
}


void checkBlynkStatus() { // called every 3 seconds by SimpleTimer


  bool isconnected = Blynk.connected();
  if (isconnected == false) {
    wifiFlag = 1;
    digitalWrite(WIFI_LED, LOW);
  }
  if (isconnected == true) {
    wifiFlag = 0;
    digitalWrite(WIFI_LED, HIGH);
  }
}


void setup()
{
  Serial.begin(9600);


  pinMode(RELAY_PIN_1, OUTPUT);
  pinMode(PUSH_BUTTON_1, INPUT_PULLUP);
  digitalWrite(RELAY_PIN_1, toggleState_1);


  pinMode(RELAY_PIN_2, OUTPUT);
  pinMode(PUSH_BUTTON_2, INPUT_PULLUP);
  digitalWrite(RELAY_PIN_2, toggleState_2);


  pinMode(WIFI_LED, OUTPUT);


  WiFi.begin(WIFI_SSID, WIFI_PASS);
  timer.setInterval(3000L, checkBlynkStatus); // check if Blynk server is connected every 3 seconds
  Blynk.config(AUTH);
}


void loop()
{  
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Not Connected");
  }
  else
  {
    Serial.println(" Connected");
    Blynk.run();
  }


  timer.run(); // Initiates SimpleTimer
  if (wifiFlag == 0)
    with_internet();
  else
    without_internet();
}
```

## troubleshooting

?# class WiFiClientSecure' has no member named 'setInsecure'

upgrade to latest:
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