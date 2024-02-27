https://lyhistory.com/hadoop_eco/

三大组件HDFS、MapReduce、Yarn

```
第一种：全部启动集群所有进程
启动：sbin/start-all.sh
停止：sbin/stop-all.sh

第二种：单独启动hdfs【web端口50070】和yarn【web端口8088】的相关进程
启动：sbin/start-dfs.sh  sbin/start-yarn.sh
停止：sbin/stop-dfs.sh  sbin/stop-yarn.sh
每次重新启动集群的时候使用

第三种：单独启动某一个进程
启动hdfs：sbin/hadoop-daemon.sh start (namenode | datanode)
停止hdfs：sbin/hadoop-daemon.sh stop (namenode | datanode)
启动yarn：sbin/yarn-daemon.sh start (resourcemanager | nodemanager)
停止yarn：sbin/yarn-daemon.sh stop(resourcemanager | nodemanager)
用于当某个进程启动失败或者异常down掉的时候，重启进程
```

https://lyhistory.com/hdfs/

./bin/hdfs haadmin -getServiceState nn1
./bin/hdfs haadmin -getServiceState nn2



[三大组件HDFS、MapReduce、Yarn框架结构的深入解析](https://cloud.tencent.com/developer/article/1878444)

## HDFS

https://hadoop.apache.org/docs/r1.2.1/hdfs_design.html#

两个NameNode为了数据同步，会通过一组称作JournalNodes的独立进程进行相互通信。当active状态的NameNode的命名空间有任何修改时，会告知大部分的JournalNodes进程。

standby状态的NameNode有能力读取JNs中的变更信息，并且一直监控edit log的变化，把变化应用于自己的命名空间。standby可以确保在集群出错时，命名空间状态已经完全同步了

Hadoop HDFS基于ZK的高可用配置 https://chenzhonzhou.github.io/2021/10/12/hadoop-hdfs-ji-yu-zk-de-gao-ke-yong-pei-zhi/

HDFS集群搭建：完全分布式 https://www.cnblogs.com/Courage129/p/17528827.html

https://open.alipay.com/portal/forum/post/126001299

## troubleshooting
?# Operation category JOURNAL is not supported in state standby
两个namenode都是standby状态
hdfs haadmin -transitionToActive --forcemanual nn1