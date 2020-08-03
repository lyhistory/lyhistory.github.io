## 1. intro

https://cbonte.github.io/haproxy-dconv/2.3/intro.html

what it does, what it doesn't do, some known traps to avoid, some OS-specific limitations, how to get it, how it evolves, how to ensure you're running with all known fixes

Load balancing consists in aggregating multiple components in order to achieve a total processing capacity above each component's individual capacity, without any intervention from the end user and in a scalable way.

A good example of this is the number of lanes on a highway which allows as many cars to pass during the same time frame without increasing their individual speed

A load balancer may act :

  - at the link level : this is called link load balancing, and it consists in
    choosing what network link to send a packet to;
    L4 传输层（通过L3网络层的ip加传输层的端口决定流量负载） Stateful/Stateless

  - at the network level : this is called network load balancing, and it
    consists in choosing what route a series of packets will follow;
    L7 应用层（在L4基础上，还可以通过URL、头信息、浏览器等决定流量负载） Stateful
  - at the server level : this is called server load balancing and it consists
    in deciding what server will process a connection or request.



packet based VS proxy based:

[https://ipwithease.com/packet-based-design-vs-full-proxy-design-in-f5/#:~:text=Packet%20based%20designs%20have%20a,connection%20between%20client%20and%20server.&text=With%20full%20proxy%20mode%2C%20we,middle%20of%20client%20and%20server.](https://ipwithease.com/packet-based-design-vs-full-proxy-design-in-f5/#:~:text=Packet based designs have a,connection between client and server.&text=With full proxy mode%2C we,middle of client and server.)

Packet-based load balancers are generally deployed in cut-through mode, so they are installed on the normal path of the traffic and divert it according to the configuration.
Proxy-based load balancers are deployed as a server with their own IP addresses and ports, without architecture changes. 	Sometimes this requires to perform some adaptations to the applications so that clients are properly directed to the load balancer's IP address and not directly to the server's. 

Note: 

haproxy is not a packet-based load balancer: it will not see IP packets nor UDP datagrams, will not perform NAT or even less DSR. These are tasks for lower layers. Some kernel-based components such as IPVS (Linux Virtual Server) already do this pretty well and complement perfectly with HAProxy.

Linux Virtual Server (LVS or IPVS) is the layer 4 load balancer included within the Linux kernel. It works at the packet level and handles TCP and UDP.

所以网上说haproxy提供了L4转发能力，实际上haproxy只是借助内核来实现的

https://www.cnblogs.com/passzhang/p/12090657.html



HAProxy:

TCP Proxy: 

it can accept a TCP connection from a listening socket, connect to a server and attach these sockets together allowing traffic to flow in both directions; **IPv4, IPv6 and even UNIX sockets**are supported on either side

HTTP reverse-proxy/Gateway: 

it presents itself as a server, receives HTTP requests over connections accepted on a listening TCP socket, and passes the requests from these connections to servers using different connections

SSL terminator / initiator / offloader:

SSL/TLS may be used on the connection coming from the client, on the connection going to the server, or even on both connections.

TCP normalizer:

abnormal traffic such as invalid packets, flag combinations, window advertisements, sequence numbers, incomplete connections (SYN floods), or so will not be passed to the other side. This protects fragile TCP stacks from protocol attacks, and also allows to optimize the connection parameters with the client without having to modify the servers' TCP stack settings.

HTTP normalizer:

protects against a lot of protocol-based attacks

HTTP fixing tool:

fixing interoperability issues in complex environments.

content-based switch:

it can consider any element from the request to decide what server to pass the request or connection to. Thus it is possible to handle multiple protocols over a same port (e.g. HTTP, HTTPS, SSH).

server load balancer:

it can load balance TCP connections and HTTP requests. In TCP mode, load balancing decisions are taken for the whole connection. In HTTP mode, decisions are taken per request

traffic regulator:

it can apply some rate limiting at various points, protect the servers against overloading, adjust traffic priorities based on the contents, and even pass such information to lower layers and outer network components by marking packets.

protection against DDoS and service abuse:

it can maintain a wide number of statistics per IP address, URL, cookie, etc and detect when an abuse is happening, then take action (slow down the offenders, block them, send them to outdated contents, etc)

observation point for network troubleshooting:

due to the precision of the information reported in logs, it is often used to narrow down some network-related issues.

HTTP compression offloader:

it can compress responses which were not compressed by the server, thus reducing the page load time for clients with poor connectivity or using high-latency, mobile networks.

caching proxy:

Please note that this caching feature is designed to be maintenance free and focuses solely on saving haproxy's precious resources and not on save the server's resources.

FastCGI gateway:

FastCGI can be seen as a different representation of HTTP



 - process incoming connections;
  - periodically check the servers' status (known as health checks);
  - exchange information with other haproxy nodes.



```
  - accept incoming connections from listening sockets that belong to a
    configuration entity known as a "frontend", which references one or multiple
    listening addresses;

  - apply the frontend-specific processing rules to these connections that may
    result in blocking them, modifying some headers, or intercepting them to
    execute some internal applets such as the statistics page or the CLI;

  - pass these incoming connections to another configuration entity representing
    a server farm known as a "backend", which contains the list of servers and
    the load balancing strategy for this server farm;

  - apply the backend-specific processing rules to these connections;

  - decide which server to forward the connection to according to the load
    balancing strategy;

  - apply the backend-specific processing rules to the response data;

  - apply the frontend-specific processing rules to the response data;

  - emit a log to report what happened in fine details;

  - in HTTP, loop back to the second step to wait for a new request, otherwise
    close the connection.
```





## 2. management

https://cbonte.github.io/haproxy-dconv/2.3/management.html

how to start haproxy, how to manage it at runtime, how to manage it on multiple nodes, and how to proceed with seamless upgrades

### 2.1 install

```
-------------------------------------------------------------
--- step 1: dependencies::
-------------------------------------------------------------
yum install openssl-devel pcre-devel zlib-devel

-------------------------------------------------------------
--- step 2: make install
-------------------------------------------------------------
wget https://www.haproxy.org/download/2.2/src/haproxy-2.2.1.tar.gz
tar zxvf haproxy-2.2.1.tar.gz

cd haproxy-2.2.1
# uname -r
# 3.10.0-327.el7.x86_64
# make TARGET=linux2628 USE_PCRE=1 USE_OPENSSL=1 USE_ZLIB=1 USE_LIBCRYPT=1
make target=linux31 failed!
make TARGET=linux2628 removed from haproxy
make TARGET=linux-glibc

/*
make install
cp -R /usr/local/sbin/haproxy /usr/sbin
make install PREFIX=/usr/local/haproxy
*/

$make install	#默认会安装到 /usr/local/sbin下面
‘haproxy’ -> ‘/usr/local/sbin/haproxy’
‘doc/haproxy.1’ -> ‘/usr/local/share/man/man1/haproxy.1’
install: creating directory ‘/usr/local/doc’
install: creating directory ‘/usr/local/doc/haproxy’
‘doc/configuration.txt’ -> ‘/usr/local/doc/haproxy/configuration.txt’
‘doc/management.txt’ -> ‘/usr/local/doc/haproxy/management.txt’
‘doc/seamless_reload.txt’ -> ‘/usr/local/doc/haproxy/seamless_reload.txt’
‘doc/architecture.txt’ -> ‘/usr/local/doc/haproxy/architecture.txt’
‘doc/peers-v2.0.txt’ -> ‘/usr/local/doc/haproxy/peers-v2.0.txt’
‘doc/regression-testing.txt’ -> ‘/usr/local/doc/haproxy/regression-testing.txt’
‘doc/cookie-options.txt’ -> ‘/usr/local/doc/haproxy/cookie-options.txt’
‘doc/lua.txt’ -> ‘/usr/local/doc/haproxy/lua.txt’
‘doc/WURFL-device-detection.txt’ -> ‘/usr/local/doc/haproxy/WURFL-device-detection.txt’
‘doc/proxy-protocol.txt’ -> ‘/usr/local/doc/haproxy/proxy-protocol.txt’
‘doc/linux-syn-cookies.txt’ -> ‘/usr/local/doc/haproxy/linux-syn-cookies.txt’
‘doc/SOCKS4.protocol.txt’ -> ‘/usr/local/doc/haproxy/SOCKS4.protocol.txt’
‘doc/network-namespaces.txt’ -> ‘/usr/local/doc/haproxy/network-namespaces.txt’
‘doc/DeviceAtlas-device-detection.txt’ -> ‘/usr/local/doc/haproxy/DeviceAtlas-device-detection.txt’
‘doc/51Degrees-device-detection.txt’ -> ‘/usr/local/doc/haproxy/51Degrees-device-detection.txt’
‘doc/netscaler-client-ip-insertion-protocol.txt’ -> ‘/usr/local/doc/haproxy/netscaler-client-ip-insertion-protocol.txt’
‘doc/peers.txt’ -> ‘/usr/local/doc/haproxy/peers.txt’
‘doc/close-options.txt’ -> ‘/usr/local/doc/haproxy/close-options.txt’
‘doc/SPOE.txt’ -> ‘/usr/local/doc/haproxy/SPOE.txt’
‘doc/intro.txt’ -> ‘/usr/local/doc/haproxy/intro.txt’

-------------------------------------------------------------
--- step 3: Configuraiton
-------------------------------------------------------------
mkdir -p /etc/haproxy
cp -R examples/option-http_proxy.cfg /etc/haproxy/haproxy.cfg
vim /etc/haproxy/haproxy.cfg
	global
        maxconn         20000
        ulimit-n        16384
        log             127.0.0.1 local0
        uid             99
        gid             99
        chroot          /var/empty
        nbproc          4
        daemon
    listen test_nginx
        bind    0.0.0.0:82
        mode    http
        server A 127.0.0.1:80
	listen stats
        bind    0.0.0.0:1080
        mode    http
        maxconn 10
        stats refresh 30s
        stats uri /stats
	
frontend http-in
 bind *:80
 default_backend appZ-backend
backend appZ-backend
 balance roundrobin
 server appZ_01 IP_OF_MACHINE_01:8080 check
 server appZ_02 IP_OF_MACHINE_02:8080 check
 

-------------------------------------------------------------
--- step 4: 配置脚本启动与关闭haproxy
-------------------------------------------------------------
cp -R examples/haproxy.init /etc/init.d/haproxy
chmod +x /etc/init.d/haproxy
chkconfig --add haproxy ！刚开始我漏了这一步，所以造成后面的问题
vi /etc/rc.d/init.d/haproxy  #这里需要把BIN的值替换为BIN=haproxy安装目录/sbin/$BASENAME
	BIN=/usr/local/sbin/$BASENAME

启动 service haproxy start
关闭 service haproxy stop
重启 service haproxy restart

● haproxy.service - SYSV: HA-Proxy is a TCP/HTTP reverse proxy which is particularly suited for high availability environments.
   Loaded: loaded (/etc/rc.d/init.d/haproxy)
   Active: failed (Result: exit-code) since Tue 2020-07-28 19:52:56 SGT; 13min ago
     Docs: man:systemd-sysv-generator(8)

Jul 28 19:52:56 sgkc2-devclr-v08 haproxy[13682]: Errors found in configuration file, check it with 'haproxy check'.
Jul 28 19:52:56 sgkc2-devclr-v08 systemd[1]: haproxy.service: control process exited, code=exited status=1
Jul 28 19:52:56 sgkc2-devclr-v08 systemd[1]: Failed to start SYSV: HA-Proxy is a TCP/HTTP reverse proxy which is particularly suited for high availability environments..
Jul 28 19:52:56 sgkc2-devclr-v08 systemd[1]: Unit haproxy.service entered failed state.
Jul 28 19:52:56 sgkc2-devclr-v08 systemd[1]: haproxy.service failed.

/usr/local/sbin/haproxy -c -- /etc/haproxy/haproxy.cfg
检查无问题
/usr/local/sbin/haproxy -- /etc/haproxy/haproxy.cfg
试着启动无问题，测试也无问题，但是无法用systemctl控制启动停止
 killall haproxy
 
发现需要 
chkconfig --add haproxy
就可以通过systemctl启动和停止

启动后可通过http://ip:1080/stats页面查看

$find / -name "haproxy"
/run/lock/subsys/haproxy
/var/log/haproxy
/etc/rc.d/init.d/haproxy
/etc/haproxy
/usr/local/sbin/haproxy
/usr/local/doc/haproxy
/opt/haproxy-2.2.1/include/haproxy
/opt/haproxy-2.2.1/haproxy

https://blog.csdn.net/demon7639/article/details/76234306
https://blog.csdn.net/qq_28710983/article/details/82194404
```



haproxy集群技巧

```
 $ cat site1.env
  LISTEN=192.168.1.1
  CACHE_PFX=192.168.11
  SERVER_PFX=192.168.22
  LOGGER=192.168.33.1
  STATSLP=admin:pa$$w0rd
  ABUSERS=/etc/haproxy/abuse.lst
  TIMEOUT=10s

  $ cat haproxy.cfg
  global
      log "${LOGGER}:514" local0

  defaults
      mode http
      timeout client "${TIMEOUT}"
      timeout server "${TIMEOUT}"
      timeout connect 5s

  frontend public
      bind "${LISTEN}:80"
      http-request reject if { src -f "${ABUSERS}" }
      stats uri /stats
      stats auth "${STATSLP}"
      use_backend cache if { path_end .jpg .css .ico }
      default_backend server

  backend cache
      server cache1 "${CACHE_PFX}.1:18080" check
      server cache2 "${CACHE_PFX}.2:18080" check

  backend server
      server cache1 "${SERVER_PFX}.1:8080" check
      server cache2 "${SERVER_PFX}.2:8080" check
```

### 2.2 Logging

https://cbonte.github.io/haproxy-dconv/2.3/management.html#8

首先 为什么haproxy不能自己写log，要通过udp发送给linux系统自带的rsyslog，是因为安全考虑，haproxy的jail模式无法访问文件系统



/etc下面没有找到syslog或sysklogd，找到了rsyslog，而且确实看到有这个rsyslog在运行：

systemctl status rsyslog，根据文档修改配置（注意并没有给UDPServerAddress *）

```
mkdir -p /var/log/haproxy
chmod a+w /var/log/haproxy

#对于本机来说不需要设置，如果是作为中央日志服务器则需要！
vim /etc/sysconfig/rsyslog 
SYSLOGD_OPTIONS="-r -m 0 -c 2"	# “-r”选项以允许接受外来日志消息,-m 0表示给日志添加-- MARK --标记，0表示关闭标记。举例，-m 240，表示每隔240分钟（每天6次）在日志文件里增加一行时间戳消息。日志文件里的“--MARK--”消息可以让你知道中央日志服务器上的syslog守护进程没有停工偷懒。

vim /etc/rsyslog.conf
$ModLoad imudp
$UDPServerRun 514
....
#save haproxy log
local0.*                                                /var/log/haproxy/haproxy.log

对应到前面/etc/haproxy/haproxy.cfg配置的global：
log             127.0.0.1 local0
其他地方直接用log global引用即可

$systemctl restart rsyslog
```



haproxy提供了一个小工具halog，需要单独安装

https://www.haproxy.com/support/technical-notes/an-0054-en-how-to-analyze-haproxy-logs-with-halog-tool/



### 2.3 utilities 调试工具

Most of the time it runs as a single process, so the output of "ps aux" on a system will report only one "haproxy" process, unless a soft reload is in progress and an older process is finishing its job in parallel to the new one. It is thus always easy to trace its activity using the strace utility.

#### 2.3.1 socat管理haproxy以及haproxy调优 

https://cbonte.github.io/haproxy-dconv/2.3/management.html#9.3

https://www.cnblogs.com/nmap/p/6498224.html

##### Unix socket & socat

> socat是一个多功能的网络工具，名字来由是“Socket CAT”，可以看作是netcat的N倍加强版，socat的官方网站：http://www.dest-unreach.org/socat/ 。
> socat是一个两个独立数据通道之间的双向数据传输的继电器。
> 这些数据通道包含文件、管道、设备（终端或调制解调器等）、插座（Unix，IP4，IP6 - raw，UDP，TCP）、SSL、SOCKS4客户端或代理CONNECT。
> socat支持广播和多播、抽象Unix sockets、Linux tun/tap、GNU readline和PTY。
> 它提供了分叉、记录和进程间通信的不同模式。多个选项可用于调整socat和其渠道，Socat可以作为TCP中继（一次性或守护进程），作为一个守护进程基于socksifier，
> 作为一个shell Unix套接字接口，作为IP6的继电器，或面向TCP的程序重定向到一个串行线。
> socat的主要特点就是在两个数据流之间建立通道；且支持众多协议和链接方式：ip, tcp, udp, ipv6, pipe,exec,system,open,proxy,openssl,socket等。
>
> https://www.cnblogs.com/nmap/p/6498224.html



使用socat可以查看和设置HAProxy状态，首先得让HAProxy产生出一个sock出来(hatop ，socat都是基于这个的，没这个什么都做不了)。
设置配置文件开启unix socket
在global 下面 加一行：
stats socket /usr/local/haproxy/stats #路径和名字随意
然后重启服务就可以了。

```


global
        stats socket /var/run/haproxy.sock mode 600 level admin
        stats timeout 2m
        
查看有没有生成socket
ls /var/lib/haproxy/


To access the socket, an external utility such as "socat" is required. Socat is
a swiss-army knife to connect anything to anything. We use it to connect
terminals to the socket, or a couple of stdin/stdout pipes to it for scripts.
The two main syntaxes we'll use are the following :

    # socat /var/run/haproxy.sock stdio
    # socat /var/run/haproxy.sock readline

The first one is used with scripts. It is possible to send the output of a
script to haproxy, and pass haproxy's output to another script. That's useful
for retrieving counters or attack traces for example.

The second one is only useful for issuing commands by hand. It has the benefit
that the terminal is handled by the readline library which supports line
editing and history, which is very convenient when issuing repeated commands
(eg: watch a counter).

when debugging by hand, it's quite common to start with the
"prompt" command :

   # socat /var/run/haproxy readline
   prompt
   > show info
   
通过socat和socket通信，它是cocket cat的缩写，安装
 yum install -y socat
利用管道查看帮助命令
echo "help" | socat stdio /var/lib/haproxy/haproxy.sock
echo "show info" | socat stdio /var/lib/haproxy/haproxy.sock

通过disable或者enable可以关闭或者启动某台主机
echo "disable server http_back/linux-node2" | socat stdio /var/lib/haproxy/haproxy.sock
echo "enable server http_back/linux-node2" | socat stdio /var/lib/haproxy/haproxy.sock

haproxy调优的地方
1、不设置进程，默认就是1，单进程
2、网卡可能跑慢，换成万兆网卡，或者拆业务，拆成不同集群
3、haproxy的端口可能被用光，因为linux提供端口最多65535。

改local的端口范围。
cat /proc/sys/net/ipv4/ip_local_port_range
改tcp的tw端口的复用，启用reuse，禁用recycle，改成1　
cat /proc/sys/net/ipv4/tcp_tw_reuse
可以缩短tw的时间，默认是60秒。
cat /proc/sys/net/ipv4/tcp_fin_timeout
使用多个IP
```

##### Master CLI

The master CLI is a socket bound to the master process in master-worker mode. This CLI gives access to the unix socket commands in every running or leaving processes and allows a basic supervision of those processes.

```
# haproxy -W -S 127.0.0.1:1234 -f test1.cfg
# haproxy -Ws -S /tmp/master-socket,uid,1000,gid,1000,mode,600 -f test1.cfg
# haproxy -W -S /tmp/master-socket,level,user -f test1.cfg

echo &#x27;show proc' | socat /var/run/haproxy-master.sock -

socat /var/run/haproxy-master.sock readline
prompt
master> @1 show info; @2 show info
master> @1
1271> show info
[...]
1271> show stat
[...]
```



#### 2.3.2 tcpdump & strace

https://cbonte.github.io/haproxy-dconv/2.3/management.html#12

```
tcpdump sample:
run tcpdump to watch for port 514, for example on the loopback interface if
    the traffic is being sent locally : "tcpdump -As0 -ni lo port 514". If the
    packets are seen there, it's the proof they're sent then the syslogd daemon
    needs to be troubleshooted.

strace sample:
run "strace -tt -s100 -etrace=sendmsg -p <haproxy's pid>" 

When debugging some latency issues, it is important to use both strace and
tcpdump on the local machine, and another tcpdump on the remote system. The
reason for this is that there are delays everywhere in the processing chain and
it is important to know which one is causing latency to know where to act. In
practice, the local tcpdump will indicate when the input data come in. Strace
will indicate when haproxy receives these data (using recv/recvfrom). Warning,
openssl uses read()/write() syscalls instead of recv()/send(). Strace will also
show when haproxy sends the data, and tcpdump will show when the system sends
these data to the interface. Then the external tcpdump will show when the data
sent are really received (since the local one only shows when the packets are
queued). The benefit of sniffing on the local system is that strace and tcpdump
will use the same reference clock. Strace should be used with "-tts200" to get
complete timestamps and report large enough chunks of data to read them.
Tcpdump should be used with "-nvvttSs0" to report full packets, real sequence
numbers and complete timestamps.

```



```
haproxy -vv

haproxy -f /etc/haproxy.cfg \
           -D -p /var/run/haproxy.pid -sf $(cat /var/run/haproxy.pid)
           
strace -tt -s100 -etrace=sendmsg -p <haproxy's pid>

echo "show info" | socat - /var/run/haproxy.sock | grep ^Idle
```



## 3. configuration

https://cbonte.github.io/haproxy-dconv/2.3/configuration.html

### 安全设置

涉及到linux的chroot：修改haproxy的工作目录至指定的目录并在放弃权限之前执行chroot()操作,可以提升haproxy的安全级别，不过需要注意的是要确保指定的目录为空目录且任何用户均不能有写权限

HAProxy is designed to run with very limited privileges. The standard way to use it is to isolate it into a chroot jail and to drop its privileges to a non-root user without any permissions inside this jail so that if any future vulnerability were to be discovered, its compromise would not affect the rest of the system.

In order to perform a chroot, it first needs to be started as a root user. It is pointless to build hand-made chroots to start the process there, these ones are painful to build, are never properly maintained and always contain way more bugs than the main file-system. And in case of compromise, the intruder can use the purposely built file-system. Unfortunately many administrators confuse "start as root" and "run as root", **resulting in the uid change to be done prior to starting haproxy, and reducing the effective security restrictions.** ？？这段话没有搞懂

https://stackoverflow.com/questions/63150374/please-help-explain-the-haproxy-statment-unfortunately-many-administrators-conf



```
A safe configuration will have :

  - a chroot statement pointing to an empty location without any access
    permissions. This can be prepared this way on the UNIX command line :

      # mkdir /var/empty && chmod 0 /var/empty || echo "Failed"

    and referenced like this in the HAProxy configuration's global section :

      chroot /var/empty

  - both a uid/user and gid/group statements in the global section :

      user haproxy
      group haproxy

  - a stats socket whose mode, uid and gid are set to match the user and/or
    group allowed to access the CLI so that nobody may access it :

      stats socket /var/run/haproxy.stat uid hatop gid hatop mode 600
      
前面的配置中我们用了默认的linux nobody用户(id nobody)
uid 99
gid 99
当然也可以根据这里的建议创建haproxy用户
useradd haproxy -r -s /sbin/nologin 
getent passwd  haproxy
id haproxy
注意配置可以用uid gid也可以用user group

```



> ```
> insecure-setuid-wanted
> HAProxy doesn't need to call executables at run time (except when using
> external checks which are strongly recommended against), and is even expected
> to isolate itself into an empty chroot. As such, there basically is no valid
> reason to allow a setuid executable to be called without the user being fully
> aware of the risks. In a situation where haproxy would need to call external
> checks and/or disable chroot, exploiting a vulnerability in a library or in
> haproxy itself could lead to the execution of an external program. On Linux
> it is possible to lock the process so that any setuid bit present on such an
> executable is ignored. This significantly reduces the risk of privilege
> escalation in such a situation. This is what haproxy does by default. In case
> this causes a problem to an external check (for example one which would need
> the "ping" command), then it is possible to disable this protection by
> explicitly adding this directive in the global section. If enabled, it is
> possible to turn it back off by prefixing it with the "no" keyword.
> ```
>
> https://cbonte.github.io/haproxy-dconv/2.2/configuration.html#insecure-setuid-wanted



> ```
> BEFORE THE PATCH:
> =================
> 
> # rpm -q haproxy
> haproxy-1.4.22-3.el6.x86_64
> 
> # service haproxy start
> Starting haproxy: [  OK  ]
> 
> # ps axf -o pid,user,group,command | grep hapr
>  4661 root     root              \_ grep hapr
>  4602 haproxy  haproxy  /usr/sbin/haproxy -D -f /etc/haproxy/haproxy.cfg -p /var/run/haproxy.pid
> # grep Group /proc/4602/status 
> Groups: 0 
> 
> 
> AFTER THE PATCH:
> ================
> 
> # rpm -q haproxy
> haproxy-1.4.24-2.el6.x86_64
> 
> # service haproxy start
> Starting haproxy: [  OK  ]
> 
> # ps a -o pid,user,group,command | grep haproxy
>  1196 root     root     grep hapr
> 31712 haproxy  haproxy  haproxy -f /etc/haproxy/haproxy.cfg -d -V
> 
> # grep Group /proc/31712/status
> Groups:
> ```
>
> https://bugzilla.redhat.com/show_bug.cgi?id=903303



> chroot happens after bind, you need to:
> bind to `/var/emtpy/var/run/haproxy.sock`
>
> https://discourse.haproxy.org/t/trying-to-run-haproxy-as-non-root-not-working/3906/3

http://www.dscentral.in/2012/11/04/installing-haproxy-on-pfsense/



## coding-style



## proxy-protocol



## 一些问题

session问题：

https://blog.csdn.net/weixin_45537987/article/details/106759391

Gitlab behind Haproxy(SSL)

https://serverfault.com/questions/820114/gitlab-behind-haproxyssl



## 国内是如何使用的

https://www.cnblogs.com/hanshanxiaoheshang/p/10285962.html

