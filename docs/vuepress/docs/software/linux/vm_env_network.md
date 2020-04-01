
## 1.Virtualbox network mode

https://www.virtualbox.org/manual/ch06.html

| Mode        | VM->Host           | VM<-Host  |VM1<->VM2|VM->Net/LAN|VM<-Net/LAN|
| ------------- |:-------------:|:-------------:|:-----:|:-----:|:-------------:|
| Host-only      | + | + |+ | - |- |
| Internal      |  - | - |+ | - |- |
| Bridged |  + | + |+ | + |+ |
| NAT |  + | PortForward |- | + |PortForward |
| NATservice |  + | PortForward |+ | + |PortForward |

### 1.1 NAT Network. 
A NAT network is a type of internal network that allows outbound connections. See Section 6.4, “Network Address Translation Service”.

有虚拟路由，所以guest可以直接通过10.0.2.2:<PORT>访问host的服务,b包括vpn服务等
Port forwarding for NAT:
https://www.virtualbox.org/manual/ch06.html#natforward

![](/docs/docs_image/software/linux/vm_network01.png)

![](/docs/docs_image/software/linux/vm_network02.png)
![](/docs/docs_image/software/linux/vm_network03.png)

netstat -aon | findstr 'PORT'
tasklist | findstr 'PID'
tasklist /fi "pid eq 4444"

"c:\Program Files\Oracle\VirtualBox\VBoxManage" modifyvm Test_centos7 --natpf1 "guestssh,tcp,,2222,,22"
But failed on the second rule??? "c:\Program Files\Oracle\VirtualBox\VBoxManage" modifyvm Test_centos7 --natpf2 "guestkafka,tcp,,9092,,9092", work around: add in VB Network settings
![](/docs/docs_image/software/linux/vm_network04.png)

?#No network access for NAT, change dns settings, for centos:
```
vim /etc/sysconfig/network-scripts/ifcfg-enp0s3
	DNS1=8.8.8.8
	ONBOOT=yes
```

### 1.2 Bridged networking. 
This is for more advanced networking needs, such as network simulations and running servers in a guest. When enabled, Oracle VM VirtualBox connects to one of your installed network cards and exchanges network packets directly, circumventing your host operating system's network stack.
![](/docs/docs_image/software/linux/vm_network05.png)

### 1.3 Internal networking. 
This can be used to create a different kind of software-based network which is visible to selected virtual machines, but not to applications running on the host or to the outside world.
![](/docs/docs_image/software/linux/vm_network06.png)

### 1.4 Host-only networking. 
This can be used to create a network containing the host and a set of virtual machines, without the need for the host's physical network interface. Instead, a virtual network interface, similar to a loopback interface, is created on the host, providing connectivity among virtual machines and the host.

![](/docs/docs_image/software/linux/vm_network07.png)

?#host-only模式下客户机vm无法访问位于host宿主机上面的web服务，比如192.168.207.1:8080
原因：不像在NAT和bridge模式下有virtual route虚拟路由，host only是直接连接的，所以宿主机访问主机如同访问外网(没有经过虚拟路由)，所以会受到宿主机上面的一些权限限制，比如
可以看到下图，10.0.2.2就是NAT模式的虚拟路由，所以可以直接通过这个路由访问宿主机host的服务
![](/docs/docs_image/software/linux/vm_network08.png)

Ping不通：如果宿主机是win10，文件与打印机共享开启

Port telnet不通:如果宿主机是win10，Turn Windows Defender Firewall off

Video::NAT, Bridged and Internal Networking 
https://www.youtube.com/watch?v=iEj42l4otNY
https://www.youtube.com/watch?v=cDF4X7RmV4Q
https://www.youtube.com/watch?v=VWKZqa2RjpA

## 2 Build local Lab network

### 2.1 Linux configuration
Golden trace rule:
https://forums.kali.org/showthread.php?20846-Troubleshooting-Internet-Network-Access

Networkmanager configuration
https://wiki.debian.org/NetworkConfiguration
Kali network configuration
The default network configuration relies on DHCP to obtain an IP address, DNS server, and gateway
https://kali.training/topic/configuring-the-network/
http://www.solutionsatexperts.com/ip-address-configuration-in-kali-linux/

How to configure Network Adapter in Kali Linux using Command Line Interface https://www.youtube.com/watch?v=JL2_fnzCZbE
Allow-hotplug ?

Restart network after change config
https://www.cyberciti.biz/faq/linux-restart-network-interface/
reload /etc/resolv.conf
https://askubuntu.com/questions/224966/how-do-i-get-resolvconf-to-regenerate-resolv-conf-after-i-change-etc-network-in

常用命令：

```
Ifconfig
Ip route show
ip a show eth0
Route -n
Ip addr
Ip route

cat /etc/network/interfaces

echo "iface eth0 inet dhcp" >> /etc/network/interfaces
/etc/init.d/networking restart

ifdown eth0
ifup eth0
dhclient eth0
Or manually::
Ifconfig eth0 192.168.1.1 netmask 255.255.255.0 up
	route add default gw 192.168.0.1 eth0
	ip route add default via 192.168.0.1 dev eth0

sudo service network-manager restart 

```

### 2.2 基于network类型构建复杂的环境

https://www.youtube.com/watch?v=AiWRmMzwwJM
https://sandilands.info/sgordon/building-internal-network-virtualbox
https://blog.pythian.com/test-lab-using-virtualbox-nat-networking/
https://vorkbaard.nl/set-up-a-testlab-in-virtualbox-with-a-virtual-lan/
'Bridged' and 'Host Only' network settings in Virtualbox https://superuser.com/questions/1352678/bridged-and-host-only-network-settings-in-virtualbox-advice-please

![](/docs/docs_image/software/linux/vm_network09.png)

https://askubuntu.com/questions/113604/how-to-run-virtualbox-on-bridged-and-host-only-networks
http://christophermaier.name/2010/09/01/host-only-networking-with-virtualbox/

VirtualBox: two network interfaces (NAT and host-only ones) https://unix.stackexchange.com/questions/37122/virtualbox-two-network-interfaces-nat-and-host-only-ones-in-a-debian-guest-on
Images 
https://developer.microsoft.com/en-us/microsoft-edge/tools/vms


## 3 troubleshooting 

#bridged mode not assign ip address and route
Tried: dhclient eth0 
https://unix.stackexchange.com/questions/174573/dhcp-kali-linux
Havne’t try this manual method::ip route add default via ip-of-router-on-local-network dev enp0s3 https://superuser.com/questions/1075988/virtualbox-bridged-network-is-unreachable
```
less /var/logs/messages 
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0124] device (eth0): carrier: link connected
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0127] device (eth1): carrier: link connected
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0129] device (eth0): state change: unavailable -> disconnected (reason 'carrier-changed', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0147] device (eth1): state change: unavailable -> disconnected (reason 'carrier-changed', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0167] modem-manager: ModemManager available
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0171] policy: auto-activating connection 'Wired connection 1' (36cfa611-f6b6-4a31-9c9e-468d2df788be)
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0174] policy: auto-activating connection 'Wired connection 1' (36cfa611-f6b6-4a31-9c9e-468d2df788be)
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0178] device (eth0): Activation: starting connection 'Wired connection 1' (36cfa611-f6b6-4a31-9c9e-468d2df788be)
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0178] device (eth0): state change: disconnected -> deactivating (reason 'new-activation', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0180] manager: NetworkManager state is now DISCONNECTING
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0182] device (eth1): Activation: starting connection 'Wired connection 1' (36cfa611-f6b6-4a31-9c9e-468d2df788be)
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0184] device (eth1): state change: disconnected -> prepare (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0185] manager: NetworkManager state is now CONNECTING
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0187] device (eth0): state change: deactivating -> disconnected (reason 'new-activation', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0210] device (eth1): state change: prepare -> config (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0229] device (eth1): state change: config -> ip-config (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.0440] dhcp4 (eth1): activation: beginning transaction (timeout in 45 seconds)
Apr  1 03:05:04 kali NetworkManager[431]: <info>  [1554102304.1160] dhcp4 (eth1): dhclient started with pid 515
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3910] dhcp4 (eth1):   address 192.168.99.100
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3911] dhcp4 (eth1):   plen 24 (255.255.255.0)
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3911] dhcp4 (eth1):   lease time 1200
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3911] dhcp4 (eth1): state changed unknown -> bound
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3927] device (eth1): state change: ip-config -> ip-check (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3937] device (eth1): state change: ip-check -> secondaries (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3941] device (eth1): state change: secondaries -> activated (reason 'none', sys-iface-state: 'managed')
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.3947] manager: NetworkManager state is now CONNECTED_LOCAL
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.4044] device (eth1): Activation: successful, device activated.
Apr  1 03:05:05 kali NetworkManager[431]: <info>  [1554102305.4072] manager: startup complete
```

dhclient eth0
```
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2543] keyfile: add connection /run/NetworkManager/system-connections/eth0.nmconnection (effc3b34-06a5-49dd-886b-d21223855eac,"eth0")
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2623] device (eth0): Activation: starting connection 'eth0' (effc3b34-06a5-49dd-886b-d21223855eac)
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2904] device (eth0): state change: disconnected -> prepare (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2911] device (eth0): state change: prepare -> config (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2913] device (eth0): state change: config -> ip-config (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2915] device (eth0): state change: ip-config -> ip-check (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2920] device (eth0): state change: ip-check -> secondaries (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.2922] device (eth0): state change: secondaries -> activated (reason 'none', sys-iface-state: 'external')
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.3028] device (eth0): Activation: successful, device activated.
Apr  1 03:09:49 kali NetworkManager[431]: <info>  [1554102589.3036] manager: NetworkManager state is now CONNECTED_GLOBAL
```

?#Can access internet but cannot ping
Firewall setting
Outbound port 
https://askubuntu.com/questions/608194/have-internet-connection-but-cant-ping-external-sites
https://networkengineering.stackexchange.com/questions/37896/ping-port-number

?#eth0 not found or not configured simply restart vm
https://askubuntu.com/questions/1060980/eth0-not-configured-but-it-was-working-earlier


![](/docs/docs_image/software/linux/vm_network03.png)
