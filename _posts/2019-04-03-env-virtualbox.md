---
title: Setup dev env - virtualbox
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

It's important for developers to setup local env to simulate production env, not only that we have a overview(god's eye view) of the whole project but also we can have a 'mini lab' to try out and get the result quickly.

And for blockchain developers it's even more crucial to setup multiple virtual instances to interact with each other, someone may debate that, most of the time you can simply run a single node: for bitcoin core you have regtest mode, for ETH you have ganache and truffle dev, for EOS you have docker composer, yet for a comprehensive project, there are much more bulding blocks beside the running nodes, normally you'll have a large portion of off-chain components like database, web api etc, and for consortium blockchain like hyperledger, you have to run multi nodes: peer nodes, orderer nodes.

It's always good for us to level up a little bit our knowledge on virtualbox.

For demonstration my hosting machine is windows, virtualbox version 6.0, 
one common requirement is that we need database and backend service running on internal network or intranet,  blockchain nodes and websites talking to both intranet and external internet.
based on the abilities comparision of different virtualbox network mode:

| Mode        | VM->Host           | VM<-Host  |VM1<->VM2|VM->Net/LAN|VM<-Net/LAN|
| ------------- |:-------------:|:-------------:|:-----:|:-----:|:-------------:|
| Host-only      | + | + |+ | - |- |
| Internal      |  - | - |+ | - |- |
| Bridged |  + | + |+ | + |+ |
| NAT |  + | PortForward |- | + |PortForward |
| NATservice |  + | PortForward |+ | + |PortForward |

> Host-only networking is particularly useful for preconfigured virtual appliances, where multiple virtual machines are shipped together and designed to cooperate. For example, one virtual machine may contain a web server and a second one a database, and since they are intended to talk to each other, the appliance can instruct Oracle VM VirtualBox to set up a host-only network for the two. A second, bridged, network would then connect the web server to the outside world to serve data to, but the outside world cannot connect to the database.

To achieve the requirement, we choose the following configuration for our virtualbox instance setup:

* vb1 to host database and backend service: host-only mode
* vb2 to host blockchain nodes and websites: bridged mode and host-only mode

, so the expected result would be:

host machine can talk to both vb1 and vb2 through ssh(default port 22, highly recommend winscp for windows users),
vb1 can only talk to vb2 and host machine
vb2 can talk to everything

1.Setup
host network manager for host-only network config
![](/content/images/post/20190403/1.png)

>>>vb1

![](/content/images/post/20190403/6.png)
![](/content/images/post/20190403/7.png)

>>>vb2

![](/content/images/post/20190403/2.png)
![](/content/images/post/20190403/3.png)
![](/content/images/post/20190403/4.png)

somehow dhcp not working sometimes for the bridged adapter, if you find that dhcp doesn't allocate ip for your bridged interface, you can manually fix it:
`dhclient eth0`
or you can edit network interface config to make it static
```
vim /etc/network/interfaces
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
	address yourip
	netmask 255.255.255.0
	gateway your gateway
```

![](/content/images/post/20190403/5.png)

2.Commands

```
ifconfig
ip route show
route -n
cat /etc/network/interfaces
/etc/init.d/networking restart
service network-manager restart 
ifdown eth0
ifup eth0
dhclient eth0
Ifconfig eth0 [ip] netmask 255.255.255.0 up
route add default gw [gateway] eth0
ip route add default via [gateway] dev eth0
```


3.Further learning

1) you can even config vb2 as a router by changing gateway of vb1, so you can do some data traffic monitoring easily

2) sometimes you may find your disk space used up, very common when you pull lots of dockers images or your blockchain nodes sync gigbytes of chain data, if you don't want to start over the setup again, good news is that you can always resize your vdi:

* resize before install os:
`VBoxVBoxManage.exe modifyhd your.vdi --resize [targetsize]`

* resize after install os:
use gparted, detail refer to http://derekmolloy.ie/resize-a-virtualbox-disk/

refer:
https://www.virtualbox.org/manual/ch06.html