首先什么是HA，

最严格的ha就是主主（双活或多活），都负责读写，对于数据库来说，写操作需要通知到所有节点，这种一般是利用共识算法来达成一致性，区块链是极限的HA，参考我的文章《distributed_system》；

其次是主备（热备 hot standby），主负责读写，备只是read only；

接着就是主备（温备 warm standby），主负责读写，备只是负责replication，不参与读写；

这三种种都是自动切换，zero downtime；

然后是主备（冷备），手动切换；

最次是backup restore；





load balance强调traffic load balance，一台机器挂掉不影响服务，但是数据可能会丢失；

high availability强调consistency，包括failover时数据不丢失；

当然实际的产品其实都会考虑到，具体要看集群或多节点的一致性算法，如果没有一致性算法保证就只能是普通的分流，如果有就是所谓的高可用；



案例：

参考《gitlab_server》 《postgresql》

