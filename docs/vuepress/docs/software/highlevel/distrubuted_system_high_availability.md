---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

A characteristic of a system that aims to ensure an agreed level of operational performance (uptime) for a higher-than-normal period. It is an emergent property​ achieved through redundancy, fault tolerance, and graceful degradation, often implemented within a Distributed System​ architecture. It is a key goal that influences architectural decisions.

## 首先什么是HA，

最严格的ha就是主主（双活或多活），都负责读写，对于数据库来说，写操作需要通知到所有节点，这种一般是利用共识算法来达成一致性，区块链是极限的HA，参考我的文章《distributed_system》；

其次是主备（热备 hot standby），主负责读写，备只是read only；

接着就是主备（温备 warm standby），主负责读写，备只是负责replication，不参与读写，注意温备实际上只是提供了disaster recovery，并不是真正的HA

这三种种都是自动切换，zero downtime；

然后是主备（冷备），手动切换；

最次是backup restore；



## load balance VS HA

高可用不一定是负载均衡的，比如主备模式，只有主在干活，多活模式也是要具体看：
+ 例1 [redis](/software/buildingblock/redis.md)高可用，但是每次failover之后都不会平均分布，节点恢复后也不会重新均衡分配，最终可能会让主节点都在一台机器上，从而负载不均衡，即使不发生failover正常使用也很容易产生数据倾斜；
+ 例2 [kafka](/software/buildingblock/kafka.md)高可用同时也是负载均衡的，failover之后其他节点会 takeover，节点恢复之后会重新拿回之前分配给自己的topic partition;
  
load balance强调traffic load balance，或者work load balance，是否高可用呢，这就要看是不是简单的分流还是智能分流，比如123交给A做，456交给B做，那A挂了之后，如果是简单的分流，那123就不会智能的重新分配给B，A上的数据就会丢失，如果是智能分流，A挂了之后，B会接管则数据就不容易丢失（也不能保证不丢失，要具体看），比如kafka集群就是高可用的负载均衡；
换言之，具体要看集群或多节点的一致性算法，如果没有一致性算法保证就只能是普通的分流，如果有就是所谓的高可用；

## 有无状态？
如果无状态，简单的failover即可，若是有状态则要考虑数据

high availability强调consistency，但是failover时数据也可能会因为不同的策略丢失掉某个时间窗口的数据；

Disaster Recovery强调的是在发生重大灾难事件时，至少大部分的数据还在，并不强调立刻恢复或者自动切换；

## 7*24
当要求一个系统支持“7乘24小时”不间断运行时，这确实是 高可用性（High Availability, HA）​ 最核心和最典型的目标,实现方式:
1. 减少停工时间​
    追求极致的可用性百分比（SLA），例如“4个9”（99.99%）的可用性意味着全年停机时间不能超过约53分钟。通过冗余设计（集群化）和自动故障转移来消除单点故障（SPOF）。
2. 自动化容错​
    系统在组件发生故障时，能够自动检测、切换并恢复，无需或极少需要人工干预。在各层（如负载均衡、服务、数据库）部署健康检查和管理员，实现故障的自动发现与流量切换。
3. 应对多种风险​
    不仅针对硬件故障，还需应对软件Bug、部署更新、突发流量、人为失误等导致的不可用。采用限流、降级、熔断、蓝绿部署等技术，保证核心业务在压力下的可用性。

### 业务层面
首先要明确 7*24 的含义，比如该系统是否要面向互联网用户，如果是比如交易系统或互联网应用，需要时刻接受用户的请求并响应，但是如果该系统是面向内部的，比如交易系统的下游系统清算系统，如果不强调非常实时的处理，其实是并不需要做到时刻响应的

### 硬件层面

磁盘空间：比如日志的定期备份清理，数据库历史数据的备份清理，缓存数据的有效时间等，并且清理不能影响到应用的访问；

cpu和内存：如果应用长时间的运行要确保应用本身不要积累垃圾引用从而造成oom等问题(比如JVM要观察老年代增长)

硬件本身的可用性: k8s

数据中心的可用性: 灾备：不要把多节点的应用部署到同一个数据中心

### 应用层面

首先应用层面肯定要做到HA(自动容错 failover),如果是面向互联网的应用还存在突发流量的问题；

然后应用的后续升级部署也要考虑到尽量热部署和在线升级，包括应用代码和数据库代码；

## 案例：

参考《gitlab_server》 《postgresql》

<disqus/>