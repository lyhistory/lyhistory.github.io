

[](https://github.com/DFRobot/SportsButtonESP32C3)

## Basics

### How to choose

1. Esp32 vs ESP8266

2. ESP32各个型号

AI 选 ESP32S3



### references


+ ESP32 Architecture and Features
+ GPIOs and Pin Mapping
+ PWM (Pulse Width Modulation) and ADC (Analog to Digital Conversion)
+ Communication Protocols (e.g., I2C, SPI, UART)
+ Low Power Modes and Deep Sleep
+ Real-Time Operating Systems (RTOS) using FreeRTOS (multitasking on ESP32)
+ Low Power Consumption for battery-powered projects
+ Security Features like encryption, secure storage, and OTA updates

["Mastering ESP32" by Neil Kolban](https://archive.org/details/kolban-ESP32/mode/2up)

[projects](https://randomnerdtutorials.com/projects-esp32/)

### ESP32 Devices

https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/get-started/index.html

#### ESP32-C3-DevKitM-1 (ESP32-C3-MINI-1)
ESP32-C3-DevKitM-1 is an entry-level development board based on ESP32-C3-MINI-1, a module named for its small size. This board integrates complete Wi-Fi and Bluetooth LE functions.

[ESP32-C3-DevKitM-1 EN-pinout](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/hw-reference/esp32c3/user-guide-devkitm-1.html)

[中文-管脚](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32c3/hw-reference/esp32c3/user-guide-devkitm-1.html?highlight=esp32%20c3%20devkitm%201%20v1%20pinout)

#### ESP32-C3-DevKitC-02 (ESP32-C3-WROOM-02)
ESP32-C3-DevKitC-02 is an entry-level development board based on ESP32-C3-WROOM-02, a general-purpose module with 4 MB SPI flash. This board integrates complete Wi-Fi and Bluetooth LE functions.

[ESP32-C3-DevKitC-02 pinout](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/hw-reference/esp32c3/user-guide-devkitc-02.html?highlight=esp32%20c3%20wroom)

ESP32 With Integrated OLED (WEMOS/Lolin)
https://www.instructables.com/ESP32-With-Integrated-OLED-WEMOSLolin-Getting-Star/

这段文字是ESP32-C3的资料。
基础资料包括（原理图尺寸图等）：http://124.222.62.86/yd-data/YD-ESP32-C3/
如果查看引脚功能图可以参考链接如下：
https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32c3/_images/esp32-c3-devkitm-1-v1-pinout.jpg
如果计划使用官方的idf-C语言编程详细资料链接（例程就是的API参考）：
https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/get-started/index.html
如果计划使用Ardiuno编程资料链接：
https://docs.espressif.com/projects/arduino-esp32/en/latest/getting_started.html#about-arduino-esp32
如果计划使用micropython语言编程资料链接如下：
https://docs.micropython.org/en/latest/esp32/quickref.html
如需要安装核心板的硬件usb转串口驱动：
https://www.wch.cn/products/CH340.html?from=list
micropython的ESP32-C3固件注意有两个固件：https://micropython.org/download/

#### ESP32-S3-DevKitC-1

[ESP32-S3-DevKitC-1 PINOUT](https://docs.espressif.com/projects/esp-dev-kits/zh_CN/latest/esp32s3/esp32-s3-devkitc-1/user_guide.html)

## Core Libs 

### Arduino lib
[Arduino core for the ESP32, ESP32-P4, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6 and ESP32-H2](https://github.com/espressif/arduino-esp32)

### ESP-IDF libs
When using ESP-IDF (without Arduino-esp32 lib), the most common libraries you’ll use include:

+ GPIO Driver (driver/gpio.h) → Controls GPIO pins (replaces digitalWrite, pinMode, etc.).
+ LED Control (driver/ledc.h) → Provides PWM support for LEDs.
+ RMT (Remote Control) → Used for precise timing, including controlling NeoPixel (WS2812) RGB LEDs.
+ FreeRTOS (freertos/FreeRTOS.h) → For multitasking and delays (vTaskDelay instead of delay).
+ Log (esp_log.h) → For debugging/logging.
+ WiFi (esp_wifi.h) → To connect to WiFi.
+ I2C/SPI (driver/i2c.h, driver/spi_master.h) → For communicating with sensors/devices.

## Setup DEV Env and Test

Development Environment Differences:
+ Arduino IDE (Beginner-Friendly)
  - Simple and easy to use.
  - Uses Arduino's framework to program ESP32.
  - Limited debugging features.
+ VSCode + PlatformIO (Intermediate)
  - More flexibility and support for multiple frameworks.
  - Great for large projects with library management.
  - Requires some setup but has a user-friendly interface.
+ VSCode + ESP-IDF (Advanced, Official Espressif SDK)
  - Best for low-level control over ESP32.
  - More complex setup, but provides full access to ESP32 features.
  - Recommended for production-level projects.

### Mixly 米思奇
青少年编程首选 推拽式，不过很多模块他们是用自己的lib，不是通用的lib，比如espnow，不容易移植到其他平台
https://go.mixly.cn/

### Arduino IDE

[Installing ESP32 Add-on in Arduino IDE](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html?highlight=update#how-to-update-to-the-latest-code)

To add ESP32 Board in your Arduino IDE, follow these instructions :

1. Install ESP32 Board Support:
  Open your Arduino IDE, go to File>Preferences,
  In Additional Board Manager URLs, enter:
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

~~https://dl.espressif.com/dl/package_esp32_index.json(It may not be updated as frequently as the GitHub version.Some older tutorials may reference this, but it’s now less commonly recommended.)~~ into the “Additional Board Manager URLs” field as shown in the figure below. Then, click the “OK” button
   
Note: if you already have another boards (i.e ESP8266 boards URL), you can separate the URLs with a comma like this:

https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json, http://arduino.esp8266.com/stable/package_esp8266com_index.json

2. Install ESP32 Boards:
Tools > Board > Boards Manager

Search for ESP32 and install the latest esp32 by Espressif Systems.

3. Select Your Board:

Tools → Board.
example: 
  Select ESP32C3 Dev Module (matches your ESP32-C3-DevKitM-1).
  ESP32S3 Dev Module (matches your ESP32-S3-DevKitC-1 )

4. Open Blink Example:

Go to File → Examples → ESP32 → GPIO → BlinkRGB (don't use 01.Basics → Blink.)

Click Upload (ensure the correct COM port is selected under Tools → Port).

__Note:__
1. RGB LED
GPIO 8 is connected to an RGB LED instead of a regular LED, you should use the BlinkRGB example instead of the standard Blink example.

🎨 How is an RGB LED different?
A normal LED has just one color and turns ON/OFF with digitalWrite().
An RGB LED has three colors (Red, Green, Blue) in one package.
You control color intensity using PWM (Pulse Width Modulation) instead of just digitalWrite(HIGH/LOW).

2. predefined macro
In Arduino code, LED_BUILTIN is a predefined macro that represents the built-in LED pin of the board.

The Blink example uses LED_BUILTIN without any #include statements because it is already defined by the Arduino Core for ESP32.
When you select a board in Arduino IDE, the corresponding board definition file provides the value of LED_BUILTIN.

To know which pin LED_BUILTIN is assigned to, you need to check the board definition file inside the Arduino-ESP32 core.

🔎 Checking the definition:
Find the ESP32 Arduino Core folder on your computer:

If you're on Windows, it’s usually under:
C:\Users\<YourUser>\AppData\Local\Arduino15\packages\esp32\hardware\esp32\<version>\variants/esp32c3/pins_arduino.h

How to modify predefined macro pin:
+ Method 1:
  Change the built-in LED pin "LED_BUILTIN" to 8 (ESP32-C3’s onboard LED is on GPIO 8)
+ Method 2:
  override LED_BUILTIN
  #define LED_BUILTIN 8 
  This should be before setup(), and it will override the default value.

### PlatformIO

VSCode+PlatformIO extension

1. Open VSCode, click on the PlatformIO Home (Alien icon in the sidebar).
-> Click "New Project" and configure:
  Name: ESP32C3-BlinkRGB
  Board: Espressif ESP32-C3-DevKitM-1
  Framework: Arduino
  Click Finish (PlatformIO will set up your project).
-> auto generate project with platformio.ini:
```
[env:esp32-c3-devkitm-1]
platform = espressif32
board = esp32-c3-devkitm-1
framework = arduino
```

and VSCode also will auto install dependencies:
```
Resolving esp32-c3-devkitm-1 dependencies...
Tool Manager: Installing platformio/tool-scons @ ~4.40801.0
Downloading 0% 10% 20% 30% 40% 50% 60% 70% 80% 90% 100%
Unpacking 0% 10% 20% 30% 40% 50% 60% 70% 80% 90% 100%
Tool Manager: tool-scons@4.40801.0 has been installed!
Already up-to-date.
Updating metadata for the vscode IDE...
Project has been successfully updated!
```

2. run blink

Copy Code from:
\.platformio\packages\framework-arduinoespressif32\libraries\ESP32\examples\GPIO\BlinkRGB\BlinkRGB.ino
to 
src\main.cpp 
but remember add the header <Arduino.h>

```
#include <Arduino.h>

void setup() {
  // No need to initialize the RGB LED
}

// the loop function runs over and over again forever
void loop() {
#ifdef RGB_BUILTIN
  digitalWrite(RGB_BUILTIN, HIGH);   // Turn the RGB LED white
  delay(1000);
  digitalWrite(RGB_BUILTIN, LOW);    // Turn the RGB LED off
  delay(1000);

  neopixelWrite(RGB_BUILTIN,RGB_BRIGHTNESS,0,0); // Red
  delay(1000);
  neopixelWrite(RGB_BUILTIN,0,RGB_BRIGHTNESS,0); // Green
  delay(1000);
  neopixelWrite(RGB_BUILTIN,0,0,RGB_BRIGHTNESS); // Blue
  delay(1000);
  neopixelWrite(RGB_BUILTIN,0,0,0); // Off / black
  delay(1000);
#endif
}
```

Click the Checkmark (✔) in the PlatformIO toolbar to compile.
Click the Arrow (→) to upload the code to your ESP32-C3 board.
Open Serial Monitor (the socket icon) (PlatformIO -> Serial Monitor in VSCode) to see logs.

https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/

https://docs.platformio.org/en/latest/boards/espressif32/esp32-c3-devkitm-1.html

Ctrl + Shift + P
 PlatformIO: New Terminal



### ESP-IDF

[Standard Setup of Toolchain for Windows](https://docs.espressif.com/projects/esp-idf/en/stable/esp32c3/get-started/windows-setup.html)
[VSCODE + ESP-IDF EXTENTION](https://github.com/espressif/vscode-esp-idf-extension/blob/master/README.md)

[ESP32组件机制与依赖管理全解析：手把手构建高效ESP32项目](https://mp.weixin.qq.com/s/Rjb8U50tUL7m9Gai2oOfKg)

1. Config extension

in the ESP-IDF homepage, quick action->click Config extension
OR
Press Ctrl + Shift + P to open the Command Palette AND Search for "ESP-IDF: Configure ESP-IDF extension" and select it.

Follow the on-screen setup wizard:
+ Select download server: Espressif better speed for China
+ Select ESP-IDF version: important, be careful the compatibility between ESP-IDF and Arduino-as-component

confrim current active version:
Click vscode ESP-IDF icon, commands->Open ESP-IDF Terminal
run > idf.py reconfigure
> idf.py --version
ESP-IDF v5.4

2. Create a New ESP-IDF Project

Board:    ESP32-C3 chip (via built-in USB-JTAG) - This option allows you to flash and debug your ESP32-C3 directly using its built-in USB interface, without needing an external debugger like ESP-PROG.
Template: arduino-as-component 

__Note:__
+ arduino-as-component
  Allows you to use Arduino functions (like pinMode, digitalWrite) inside ESP-IDF.
  Best choice if you're familiar with Arduino and want to transition smoothly to ESP-IDF.
  You can still use ESP-IDF’s low-level features while writing Arduino-style code.
+ fibonacci-app
  A simple example demonstrating mathematical computations (Fibonacci sequence).
  More useful for testing ESP-IDF performance, not for hardware projects.
+ template-app
  A basic empty ESP-IDF project.
  Provides a simple main.c file where you write your code from scratch.
  Uses ESP-IDF functions instead of Arduino-style functions.
  Choose this if you want to learn "pure ESP-IDF" (without Arduino).
  Example:
  ```
  #include "freertos/FreeRTOS.h"
  #include "freertos/task.h"
  #include "driver/gpio.h"

  #define LED_PIN 8

  void app_main(void) {
      gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);

      while (1) {
          gpio_set_level(LED_PIN, 1); // Turn LED ON
          vTaskDelay(pdMS_TO_TICKS(500));
          gpio_set_level(LED_PIN, 0); // Turn LED OFF
          vTaskDelay(pdMS_TO_TICKS(500));
      }
  }
  ```
+ unity-app
  A project for unit testing code using the Unity test framework.
  Used for automated testing, not for hardware development.
3. Code 
CMakeLists.txt:
```
idf_component_register(SRCS "src/main.cpp"
                       INCLUDE_DIRS "."
                       REQUIRES arduino)

```
idf_component.yml:
```
dependencies:
  espressif/arduino-esp32: "^3.1.1"
```

main.cpp:
```
#include <Arduino.h>

void setup() {
  // No need to initialize the RGB LED
}

// the loop function runs over and over again forever
void loop() {
#ifdef RGB_BUILTIN
  digitalWrite(RGB_BUILTIN, HIGH);   // Turn the RGB LED white
  delay(1000);
  digitalWrite(RGB_BUILTIN, LOW);    // Turn the RGB LED off
  delay(1000);

  neopixelWrite(RGB_BUILTIN,RGB_BRIGHTNESS,0,0); // Red
  delay(2000);
  neopixelWrite(RGB_BUILTIN,0,RGB_BRIGHTNESS,0); // Green
  delay(2000);
  neopixelWrite(RGB_BUILTIN,0,0,RGB_BRIGHTNESS); // Blue
  delay(1000);
  neopixelWrite(RGB_BUILTIN,0,0,0); // Off / black
  delay(1000);
#endif
}

extern "C" void app_main()
{
    initArduino();
    setup();
    while (true) {
        loop();  // Manually call loop() to mimic Arduino behavior
    }
}
```

__Note:__
a. Why Is app_main() Used Instead of setup() and loop()?
In Arduino, you have setup() and loop() because the framework automatically handles initialization and looping.
In ESP-IDF, there’s no built-in loop mechanism like in Arduino. Instead, it requires an entry function called app_main().
extern "C" is used to prevent function name mangling in C++.
b. initArduino(); – Initializes the Arduino framework inside ESP-IDF.

4. Build the Code (Compile)

Press Ctrl + Shift + P → Select "ESP-IDF: Build your project"

BUT 

If you've modified any files, reconfigure the project by running:
`idf.py reconfigure`
Then, build again:
`idf.py build`

Ensure Arduino is Installed in Your ESP-IDF Environment:
`idf.py list-components | grep arduino`
install it manually:
`idf.py add-dependency "espressif/arduino-esp32"`

5. Downgrade ESP-IDF to Version 5.3

build error:
```
ERROR: Because no versions of espressif/arduino-esp32 match >3.1.1,<4.0.0

   and espressif/arduino-esp32 (3.1.1) depends on idf (>=5.3,<5.4), espressif/arduino-esp32 (>=3.1.1,<4.0.0) requires idf (>=5.3,<5.4).

  So, because no versions of idf match >=5.3,<5.4
```

check compatibility:
https://github.com/espressif/arduino-esp32/releases
https://components.espressif.com/components/espressif/arduino-esp32/versions/3.1.1


auto install:

back to step 1 Config extension, after install the correct version, then Ctrl + Shift + P → Select "ESP-IDF: select ESP-IDF version (5.3.2)"

manual install:
```
cd ~/esp  # Navigate to your ESP-IDF installation directory
git clone --branch v5.3--recursive https://github.com/espressif/esp-idf.git esp-idf-v5.3

cd ~/esp/esp-idf-v5.3
./install.sh esp32c3  # Install ESP-IDF 5.3 for ESP32-C3

cd ~/esp/esp-idf-v5.3
source export.sh  # This sets up ESP-IDF 5.3.x

idf.py --version
```

6. create a new project ，set target device and build
dont use the project created undder previous ESP-IDF 5.4, otherwise will fail build, so create a new project under the downgrade ESP-IDF5.3.2 and use the code above but update:
 CMakeLists.txt
  change REQUIRES arduino to REQUIRES arduino-esp32 (Starting from ESP-IDF 5.4, Espressif integrated Arduino-ESP32 directly into the ESP-IDF build system. Now, it is internally renamed from arduino-esp32 to just arduino.)

Press Ctrl + Shift + P → Select "ESP-IDF: set Espressif device target"
choose ESP32C3
then the sdkconfig will auto add:
CONFIG_IDF_TARGET_ESP32C3=y

continue, update sdkconfig 
  CONFIG_FREERTOS_HZ=1000

then idf.py reconfig and build (important: close all the terminals first, otherwise may cause errors: Project sdkconfig  was generated for target 'esp32c3', but environment variable IDF_TARGET is set to 'esp32'. Run 'idf.py set-target esp32' to generate new sdkconfig file for target esp32.)

7. Flash the Code (Upload)

Press Ctrl + Shift + P → Select "ESP-IDF: Flash your project"

If you see an error about the serial port, find your device's port in Device Manager (Windows) or run:

`idf.py --port COMx flash monitor`
Replace COMx with your actual serial port.

8. replace Arduino-esp32 with common used ESP-IDF libs

Remove "REQUIRES arduino-esp32" in CMakeLists.txt

idf_component:
```
dependencies:
  espressif/led_strip: "*"
```

main.cpp
```
#include "led_strip.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#define LED_STRIP_GPIO 8  // Built-in RGB LED on ESP32-C3
#define LED_STRIP_LENGTH 1 // Only 1 LED on the board

static led_strip_handle_t led_strip;

void init_led() {
        led_strip_config_t strip_config = {
        .strip_gpio_num = LED_STRIP_GPIO,
        .max_leds = LED_STRIP_LENGTH,  
        .led_model = LED_MODEL_WS2812, 
        .flags = {
            .invert_out = false
        }
    };

    led_strip_rmt_config_t rmt_config = {
        .resolution_hz = 10 * 1000 * 1000 // 10MHz
    };

    esp_err_t err = led_strip_new_rmt_device(&strip_config, &rmt_config, &led_strip);
    if (err != ESP_OK) {
        printf("LED Strip initialization failed!\n");
    }
}

extern "C" void app_main()
{
    init_led();

    while (1) {
        led_strip_set_pixel(led_strip, 0, 255, 0, 0);  // Red
        led_strip_refresh(led_strip);
        vTaskDelay(pdMS_TO_TICKS(1000));

        led_strip_set_pixel(led_strip, 0, 0, 255, 0);  // Green
        led_strip_refresh(led_strip);
        vTaskDelay(pdMS_TO_TICKS(1000));

        led_strip_set_pixel(led_strip, 0, 0, 0, 255);  // Blue
        led_strip_refresh(led_strip);
        vTaskDelay(pdMS_TO_TICKS(1000));

        led_strip_clear(led_strip); // Turn off LED
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

```

9. debugging

Set Up the USB Driver (if needed)

On Windows, install the USB driver from:
👉 https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
On Linux/macOS, your system should detect it automatically.

Press Ctrl + Shift + P → Select "ESP-IDF: show example projects"

https://github.com/espressif/esp-idf/tree/v5.4/examples


[Arduino as an ESP-IDF component](https://docs.espressif.com/projects/arduino-esp32/en/latest/esp-idf_component.html)
[Getting Started with Espressif’s ESP32-C3-DevKITM-1 on ESP-IDF](https://www.electronics-lab.com/getting-started-with-espressifs-esp32-c3-devkitm-1-on-esp-idf/)
[Controlling a LED with ESP32-C3-DevKITM-1 Development Board using ESP-IDF](https://www.electronics-lab.com/deep-dive-on-controlling-led-with-esp32-c3-devkitm-1-development-board-using-esp-idf/)


## DEV
### PWM
https://www.electronicwings.com/esp32/pwm-of-esp32

### Power Options
[如何给ESP32供电](https://mp.weixin.qq.com/s/JOmDmY3TJXq7wD9f76UtPw)
To power your ESP32 dev kit, you have three options:

+ Via the USB port.
+ Using unregulated voltage between 5V and 12V, connected to the 5V and GND pins. This voltage is regulated on-board.
+ Using regulated 3.3V voltage, connected to the 3.3V and GND pins. Be very careful with that: do not exceed the 3.3V limit, or your ESP32 module will be damaged.

Attention: be very, very careful to only use one of those options at the same time.

For example, do not power your ESP32 dev kit via the 5V pin using a 10V input while at the same time you have the module connected to your computer via USB. This will surely damage your module, and perhaps even your computer.

With this, you should have a good understanding of what the ESP32 is, and you must be eager to get hands-on with it. I totally understand :-). Let’s proceed with the next lesson, where I’ll show you how to set up the ESP32-Arduino Core on the Arduino IDE.

## Example

### RGB
“addressable” RGB LED,

ESP32-C3 Blink Test with Arduino IDE and DumbDisplay
https://www.youtube.com/watch?v=BAnvHOs5Fks

Guide for WS2812B Addressable RGB LED Strip with Arduino https://randomnerdtutorials.com/guide-for-ws2812b-addressable-rgb-led-strip-with-arduino/

https://espressif-docs.readthedocs-hosted.com/projects/arduino-esp32/en/latest/api/ledc.html

### turns radio signals into spatial intelligence
[让 WiFi 信号变成你的眼睛 RuView turns commodity WiFi signals into real-time spatial intelligence, vital sign monitoring, and presence detection — all without a single pixel of video](https://github.com/ruvnet/RuView)

### 亲眼看见原子！手搓隧穿显微镜项目开源
[A Scanning Tunneling Microscope Project](https://github.com/Dimsmary/OpenSTM)

### ESP32CAM

[pinout](https://microcontrollerslab.com/esp32-cam-ai-thinker-pinout-gpio-pins-features-how-to-program/)

[一起玩儿物联网人工智能小车（ESP32）——112 ESP32 CAM采集图像的TFT显示](https://mp.weixin.qq.com/s/PN3QBkWrgBeN53dOhVuLJA)

[用ESP32-CAM打造一个强大的智能监控系统](https://mp.weixin.qq.com/s/b95vnAO3ni6Xa82a20E8tQ)

[监控摄像头](https://mp.weixin.qq.com/s/7MMBJ6_GHoTg09xs6Cdv8Q)

[ESP32CAM系列：PC客户端远程播放实时录像](https://mp.weixin.qq.com/s/U1DeoTm8jRpZ4dZQ2ZYrfw)

[远程实时监控利器，为ESP32-CAM打造的流媒体服务器：ESP32CAM-RTSP](https://mp.weixin.qq.com/s/pLjD4ADI4W_JpsmiyidAxA)

#### 烧录方案
没有usb接口，解决方案：
+ 直接买带烧录座的
+ 自行连接一个USB转TTL模块：
  确保接线正确，ESP32-CAM 的IO0接口接地即为烧录模式，不接地悬空即为运作模式
  部分设备烧录前需要按一下RST键，或重新上电重启
+ [使用 ESP8266连线烧录](https://www.instructables.com/Programming-ESP32-CAM-With-ESP8266/)

#### STA模式
测试sample ESP32->Camera->CameraWebServer, 确定对应的板子model修改：
```
#define CAMERA_MODEL_AI_THINKER // Has PSRAM
const char *ssid = "wifi name";
const char *password = "password";

```

打开串口监视器，波特率修改为代码里的115200，按一次esp32-cam的RST复位键，即可打印出wifi摄像头的url地址，可以看到esp32使用80端口启动一个web服务，使用81端口传输视频流：

web服务（参数设置、视频播放）：http://x.x.x.x
视频流地址：http://x.x.x.x:81/stream

如果想单独显示视频，最简单的方法就是建个html页面，里边添加一个img即可：

`<img id="stream" src="http://192.168.0.102:81/stream">`
也可以直接jpage压缩后发送二进制流进行显示。

#### AP离线模式

```
#include <DNSServer.h>
DNSServer dnsServer;
#define DNS_PORT 53

const char *ssid = "ESP32-CAM_AP";
const char *password = "123456";

// Set ESP32-CAM to AP mode
WiFi.softAP(ssid, password);
IPAddress apIP = WiFi.softAPIP();
Serial.println("ESP32-CAM is in AP mode");
Serial.print("AP IP address: ");
Serial.println(apIP);

// Set up captive portal DNS server: redirect all queries to our AP IP
dnsServer.start(DNS_PORT, "*", apIP);
```

The IP 192.168.4.1 is the default IP address for the ESP32 in AP mode. This IP is assigned automatically when the ESP32 starts as an access point using WiFi.softAP(), can customize by:
```
WiFi.softAP(ssid, password, 1, false, 1);
IPAddress apIP(192, 168, 1, 1);
WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));

void loop() {
  // Process DNS requests for captive portal
  dnsServer.processNextRequest();  // 我没加这个也正常工作 This happens because DNS processing is often handled internally by the ESP32's network stack, and in some cases, the default DNS server behavior can automatically process requests without the need to call processNextRequest().However, in general practice, if you want to handle DNS requests explicitly, you would call processNextRequest() to ensure that the DNS server is running in the loop, especially if you are managing complex DNS resolutions or want more control over how requests are handled. 
}
```

dns劫持：
- DNS Query Mechanism: When a device connects to the ESP32-CAM’s Wi-Fi network, the device tries to resolve a domain name (e.g., when accessing a URL like http://example.com). The device sends a DNS request to the network's DNS server.
- DNS Redirection: The DNS server (dnsServer.start(DNS_PORT, "*", apIP)) intercepts these DNS requests and responds with the ESP32-CAM's IP address (apIP). This causes the device to navigate to the ESP32-CAM's web server (even if the client tried to access a random URL).
- Captive Portal Functionality: By intercepting DNS queries and always pointing them to 192.168.4.1, the ESP32-CAM forces the client to view the content hosted on the ESP32

### ESP32 12v solenoid lock 

清单：
+ 5v1a 微型电磁锁 ph2.0公头
+ 5v Relay开关
+ 5v1a 电源适配器
+ ph2.0母头转dc母头

https://www.circuito.io/app?components=9442,360217,842876

https://www.youtube.com/watch?v=kGkyvVwwuL8

https://esp32io.com/tutorials/esp32-solenoid-lock


https://creativepradeepthehomeofelectronics.blogspot.com/2021/07/smart-wifi-controlled-door-lock-system.html

https://esp32io.com/tutorials/esp32-door-lock-system-using-password

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

### [ESP32 Smart Car](/software/hardware/kid_edu/esp32_smart_car.md)

### ESP32 Robot Arm
[ESP32 Micro Robot Arm](https://www.instructables.com/ESP32-Micro-Robot-Arm/)

### [ESP32 AI Robot](/software/hardware/kid_edu/esp32_AI.md)


### ESP32 Mini Smart Farm 
https://www.elec-cafe.com/esp32-mini-smart-farm-micropython/


## troubleshooting

### Serial.print in the setup() not showing
是因为setup执行比较快，serial monitor还开始监控setup就跑完了，可以重新插电，或者加个延迟语句

```
Serial.println("Starting setup...");
  delay(10000);
  Serial.println("Setup complete.");
```
### 乱码
确认代码的波特率 `Serial.begin(115200);`和监视器的波特率一致，并且 board选择正确

### class WiFiClientSecure' has no member named 'setInsecure'

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

### ESP32CAM初始化失败
选择正确的model，比如
`#define CAMERA_MODEL_AI_THINKER // Has PSRAM`

wifi连接 2.4G，
连接的电脑最好关掉vpn，连接同一个wifi

### Soft WDT reset
使用espnow遥控的时候，接收信息打印日志会报这个错误，因为串口来不及打印，不影响使用，注释掉Serial.print即可
```
Soft WDT reset
Exception (4):
epc1=0x40204bc8 epc2=0x00000000 epc3=0x00000000 excvaddr=0x00000000 depc=0x00000000
```


[基于 Arduino IDE 搭建一个轻量的 ESP32 Web 服务器](https://mp.weixin.qq.com/s/Z5xEp-j2aRmmwlmxdoqKcg)

[用ESP32C3做了个专业的GPS手表，最长续航100天！](https://mp.weixin.qq.com/s/8xnrpHXgx2m8_hFQEXM-mw)

[非常好玩的一个嵌入式项目：GestureChef智能食谱伴侣（4.7寸电子纸+ESP32-S3+手势控制传感器）](https://mp.weixin.qq.com/s/GzDm6abq4KS0uG02cWFdPQ)