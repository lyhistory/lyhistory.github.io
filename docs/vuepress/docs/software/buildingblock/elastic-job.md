---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

历史：

当当网的分布式作业框架dangdang

->io.elasticjob

->org.apache.shardingsphere.elasticjob



## Origin: dangdang ddframe

```
dangdang:
<dependency>
    <groupId>com.dangdang</groupId>
    <artifactId>elastic-job-lite-core</artifactId>
    <version>${elastic-job.version}</version>
</dependency>
```

https://www.infoq.cn/article/dangdang-distributed-work-framework-elastic-job/

https://cloud.tencent.com/developer/article/1465039?from=15425

https://cloud.tencent.com/developer/article/1137622

https://github.com/dangdang-arch/elastic-job-example

## Legacy: io.elasticjob

```
legacy:        
https://shardingsphere.apache.org/elasticjob/legacy/lite-2.x/01-start/quick-start/
<dependency>
    <groupId>io.elasticjob</groupId>
    <artifactId>elastic-job-lite-core</artifactId>
    <version>${latest.release.version}</version>
</dependency>
```

## Current: shardingsphere.elasticjob

https://www.infoq.cn/article/ZcEsH20kUCB9QP1O1PNt

https://github.com/apache/shardingsphere-elasticjob

https://shardingsphere.apache.org/elasticjob/current/en/quick-start/elasticjob-lite/

```

current:

<dependency>
    <groupId>org.apache.shardingsphere.elasticjob</groupId>
    <artifactId>elasticjob-lite-core</artifactId>
    <version>${latest.release.version}</version>
</dependency>
```



## config

```
//zookeeper server address, comma delimited 
    private String zookeeperServer;
    //namespace(root path on zookeeper)
    private String namespace;
    //min time interval waiting for next retry
    private int baseSleepTimeMilliseconds = 1000;
    //max time interval waiting for next retry
    private int maxSleepTimeMilliseconds = 3000;
    //max retry times
    private int maxRetries = 3;
    //session timeout
    private int sessionTimeoutMilliseconds = 60000;
    //connection timeout
    private int connectionTimeoutMilliseconds = 15000;

    //if true, local config will overwrite the config registered in zookeeper
    private boolean overwrite = true;
    //if true, the unfinished job on the crashed node will continue to execute on other live nodes
    private boolean failover = false;
    //if true, will trigger task if misfire
    private boolean misfire = true;
    //whether disable job at start (one scenario is set it to true when deploying jobs and then start all jobs only after done the deployment)
    private boolean disabled = false;
    
    
[zk: 127.0.0.1:2181(CONNECTED) 14] ls /test/someJob/leader 
[election, sharding]
[zk: 127.0.0.1:2181(CONNECTED) 15] ls /test/someJob/servers
[172.16.200.68, 172.16.200.128]
[zk: 127.0.0.1:2181(CONNECTED) 16] ls /test/someJob/config 
[]
[zk: 127.0.0.1:2181(CONNECTED) 17] ls /test/someJob/instances
[]
[zk: 127.0.0.1:2181(CONNECTED) 18] ls /test/someJob/sharding 
[0]
[zk: 127.0.0.1:2181(CONNECTED) 19] ls /test/someJob/leader/election
[latch]
[zk: 127.0.0.1:2181(CONNECTED) 20] ls /test/someJob/leader/sharding
[]
```

<disqus/>