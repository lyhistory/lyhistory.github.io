---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

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

high availability强调consistency，但是failover时数据也可能会因为不同的策略丢失掉某个时间窗口的数据；

Disaster Recovery强调的是在发生重大灾难事件时，至少大部分的数据还在，并不强调立刻恢复或者自动切换；


案例：

参考《gitlab_server》 《postgresql》

<disqus/>