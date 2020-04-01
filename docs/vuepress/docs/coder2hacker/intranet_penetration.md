
《内网穿透》

在渗透测试中，由于防火墙设置和各种权限设置，经常会遇到无法直接连接内网中某台机器的情况，内网中的机器自然是不对外的，躲在NAT和防火墙后面，所以就产生了内网穿透的需求；
另外即使平常家庭使用也会用到内网穿透，要知道由于ipv4资源耗尽，部分宽带运营商ISP开始对用户进行NAT，所以普通用户可能得不到独立的外网IP，而是相当于在运行商组建的内网中，
有时候我们需要从外网访问家中的设备，这跟渗透测试的内网穿透场景基本一致，只不过安全防范没有那么强，所以对于家用情况：

如果有独立的外网ip，直接在路由器上设置端口转发或者DMZ映射即可通过外网访问内网电脑；
如果被NAT，可以利用[frp反向代理进行内网穿透](https://zhuanlan.zhihu.com/p/31924024)，从而对外网提供服务，
或者直接基于NAPT开发个[内网穿透工具](https://zhuanlan.zhihu.com/p/30351943)

对于公司来说，有时候需要work form remote，访问公司内网服务器就需要走特定的vpn，或者使用[NAT静态代理](https://blog.51cto.com/11970509/2046966)，
对于某些项目开发来说，经常也有这种开发上的需求，比如看到这个人想[从外网控制内网的一些机器人](https://yq.aliyun.com/articles/195878?spm=a2c4e.11163080.searchblog.127.32e02ec1I9PHCG)，
就使用了一个http server做中转，外网的客户端只需要跟http server建立一个socket长连接，然后发指令给http server，http server再转发机器人，机器人响应通过http server跟客户端的socket直接原路发回。

但是对于渗透测试，我们需要更强的方法和工具

补充说明：
基本的穿透工具：花生壳、frp、ngrok、teamviewer、smarGate，
其中很多的穿透类产品通常直接将访问入口定义到公网服务器上，就像将自家防盗门放到公共场所，即使需要钥匙，也难防技艺高超的开锁匠。
smarGate的做法是将防盗门随身携带，自主可控，可以自定义服务器来代替官方提供的免费代理服务器
当然对于渗透测试我们不需担心这个问题；

对于不熟悉NAT的朋友，首先复习一下在网络部分/docs/software/network讲到的：
Public ip vs nat：
NAT stands for Network Address Translation. In the context of our network, NAT is how one (public) IP address is turned into many (private) IP addresses. 
A public IP address is an address that is exposed to the Internet. If you search for "what's my IP" on the Internet, you'll find the public IP address your computer is using.
If you look up your computer's IP address, you'll see a different IP address: this is your device's private IP.
Chances are, if you check this on all of your devices, you'll see that all your devices are using the same public IP, but all have different private IPs. This is NAT in action. The network hardware uses NAT to route traffic going from the public IP to the private IP.
 


[ngrok - HTTP和TCP隧道](https://www.youtube.com/watch?v=tn2zbi8OnvM)
[渗透基础——端口转发与代理](https://3gstudent.github.io/%E6%B8%97%E9%80%8F%E5%9F%BA%E7%A1%80-%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91%E4%B8%8E%E4%BB%A3%E7%90%86/)

https://null-byte.wonderhowto.com/how-to/hacking-windows-10-use-ssh-tunnels-forward-requests-hack-remote-routers-0198465/

https://bob.kim/ngrok_theory


关键词： 内网穿透/映射	，端口映射（静态ip），动态ip映射（花生壳，frp） 动态域名解析DDNS（花生壳，nginx）