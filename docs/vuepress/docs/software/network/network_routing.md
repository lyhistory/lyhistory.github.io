Routing is the process of selecting a path for traffic in a network or between or across multiple networks. Broadly, routing is performed in many types of networks, including circuit-switched networks, such as the public switched telephone network (PSTN), and computer networks, such as the Internet.

In packet switching networks, routing is the higher-level decision making that directs network packets from their source toward their destination through intermediate network nodes by specific packet forwarding mechanisms. Packet forwarding is the transit of network packets from one network interface to another. Intermediate nodes are typically network hardware devices such as:
+ routers, 
+ gateways, 
+ firewalls, 
+ or switches. 
General-purpose computers also forward packets and perform routing, although they have no specially optimized hardware for the task.

The routing process usually directs forwarding on the basis of routing tables. Routing tables maintain a record of the routes to various network destinations. Routing tables may be specified by an administrator, learned by observing network traffic or built with the assistance of routing protocols.

Routing, in a narrower sense of the term, often refers to IP routing and is contrasted with bridging. IP routing assumes that network addresses are structured and that similar addresses imply proximity within the network. Structured addresses allow a single routing table entry to represent the route to a group of devices. In large networks, structured addressing (routing, in the narrow sense) outperforms unstructured addressing (bridging). Routing has become the dominant form of addressing on the Internet. Bridging is still widely used within local area networks.

## 路由表 routing table

windows路由表详解
https://mp.weixin.qq.com/s/Dep37CyOd0Szr_fzjQFOkA

理解Windows中的路由表和默认网关
https://developer.aliyun.com/article/447528

Example: VPN 改变路由
0.0.0.0/1 covers 0.0.0.0 – 127.255.255.255
127.0.0.0/1 covers 128.0.0.1 – 255.255.255.255

The reason this works is because when it comes to routing, a more specific route is always preferred over a more general route. And 0.0.0.0/0.0.0.0 (the default gateway) is as general as it gets. But if we insert the above two routes, the fact they are more specific means one of them will always be chosen before 0.0.0.0/0.0.0.0 since those two routes still cover the entire IP spectrum (0.0.0.0 thru 255.255.255.255).

VPNs do this to avoid messing w/ existing routes. They don’t need to delete anything that was already there, or even examine the routing table. They just add their own routes when the VPN comes up, and remove them when the VPN is shutdown. Simple.

[Understanding Routing Table with OpenVPN](https://superuser.com/questions/851462/understanding-routing-table-with-openvpn)

## Protocols
OSPF and RIP are Interior Gateway Protocols (IGP) and distribute routing information within an autonomous system, 
Therefore, both are confined to a single domain for routing (intra-domain). whereas BGP is a Exterior Gateway Protocol, primarily designed to be used to route between routing domains (inter-domain).
### BGP

### IGP
OSPF
Open Shortest Path First (OSPF) is a link-state routing protocol that was developed for IP networks and is based on the Shortest Path First (SPF) algorithm. OSPF is an Interior Gateway Protocol (IGP).

## 问题
路由环路

在维护路由表信息的时候，如果在拓扑发生改变后，网络收敛缓慢产生了不协调或者矛盾的路由选择条目，就会发生路由环路的问题，这种条件下，路由器对无法到达的网络路由不予理睬，导致用户的数据包不停在网络上循环发送，最终造成网络资源的严重浪费。


