picow

https://projects.raspberrypi.org/en/projects/get-started-pico-w


## Set up your Raspberry Pi Pico W

Download the latest version of Raspberry Pi Pico W firmware at https://rpf.io/pico-w-firmware

Connect the small end of your micro USB cable to the Raspberry Pi Pico W.
Hold down the BOOTSEL button on your Raspberry Pi Pico W.
Connect the other end to your desktop computer, laptop, or Raspberry Pi.

Your file manager should open up, with Raspberry Pi Pico being show as an externally connected drive. Drag and drop the firmware file you downloaded into the file manager. Your Raspberry Pi Pico should disconnect and the file manager will close.

## IDE - Thonny
[Install Thonny](https://thonny.org/)

Open the Thonny editor.

Look at the text in the bottom right-hand corner of the Thonny editor. It will show you the version of Python that is being used.

If it does not say ‘MicroPython (Raspberry Pi Pico)’ there, then click on the text and select ‘MicroPython (Raspberry Pi Pico)’ from the options.

To complete the projects in this path, you need to install the picozero library as a Thonny package.

In Thonny, choose Tools > Manage packages.

In the pop-up ‘Manage packages for Raspberry Pi Pico’ window, type picozero and click Search on PyPi.

Click on picozero in the search results.

Click on Install.

When installation has completed, close the package window, then quit and reopen Thonny.

### offline:
You can use another internet connected computer to download the file you need and then store the file on a USB flash memory stick.

Go to the picozero.py file in the picozero GitHub repository using a web browser.

Right click on the picozero page, and choose to Save page as.

Choose a download location, and keep the file name the same - picozero.py
Option 1 - Transfer files using Thonny file manager
On the computer connect your Raspberry Pi Pico using a microUSB cable.

Load Thonny from your application menu, then from the View menu, choose to see files.

## HelloWorld

web_server.py:
```

import network,rp2
import socket
from time import sleep
from picozero import pico_temp_sensor, pico_led
import machine

## Connect your Raspberry Pi Pico W to a WLAN
ssid = 'NAME OF YOUR WIFI NETWORK'
password = 'YOUR SECRET PASSWORD'

def connect():
    #Connect to WLAN
    #SET COUNTRY for 5G
    rp2.country('SG')
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    #set power mode to get WiFi power-saving off(if need)
    wlan.config(pm = 0xa11140)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip

## Open a socket
def open_socket(ip):
    # Open a socket
    address = (ip, 80)
    connection = socket.socket()
    connection.bind(address)
    connection.listen(1)
    print(connection)
    return connection

def webpage(temperature, state):
    #Template HTML
    html = f"""
            <!DOCTYPE html>
            <html>
            <form action="./lighton">
            <input type="submit" value="Light on" />
            </form>
            <form action="./lightoff">
            <input type="submit" value="Light off" />
            </form>
            <p>LED is {state}</p>
            <p>Temperature is {temperature}</p>
            </body>
            </html>
            """
    return str(html)

def serve(connection):
    #Start a web server
    state = 'OFF'
    pico_led.off()
    temperature = 0
    while True:
        client = connection.accept()[0]
        request = client.recv(1024)
        request = str(request)
        try:
            request = request.split()[1]
        except IndexError:
            pass
        if request == '/lighton?':
            pico_led.on()
            state = 'ON'
        elif request =='/lightoff?':
            pico_led.off()
            state = 'OFF'
        temperature = pico_temp_sensor.temp
        html = webpage(temperature, state)
        client.send(html)
        client.close()    

try:
    ip = connect()
    connection = open_socket(ip)
    serve(connection)
except KeyboardInterrupt:
    machine.reset()
```

index.html
```
<!DOCTYPE html>
<html>
<body>
<form action="./lighton">
<input type="submit" value="Light on" />
</form>
<form action="./lightoff">
<input type="submit" value="Light off" />
</form>
<p>LED is {state}</p>
<p>Temperature is {temperature}</p>
</body>
</html>
```


[树莓派 Pico 也能支持强大且可靠的自动化测试！](https://mp.weixin.qq.com/s/lAilR2PP_YBErNkxa0FOwA)
