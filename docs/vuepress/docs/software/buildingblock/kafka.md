---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《kafka》



sourcecode:

client:https://github.com/apache/kafka

server: https://github.com/a0x8o/kafka

## 1. Basic concepts

+ zookeeper：kafka 通过 zookeeper 来存储集群的 meta 信息。

+ broker：kafka 集群中包含的服务器。Each server acts as a leader for some of its partitions and a follower for others so load is well balanced within the cluster. 

  Kafka service = kafka broker, kafka cluster=multiple instances of kafka broker

+ controller：kafka 集群中的其中一个服务器，用来进行 leader election 以及 各种 failover。

+ producer：消息生产者，发布消息到 kafka 集群的终端或服务。

+ consumer：从 kafka 集群中消费消息的终端或服务。

+ Consumer group：high-level consumer API 中，每个 consumer 都属于一个 consumer group，每条消息只能被 consumer group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。

  + group coordinator: is nothing but one of the brokers which receives heartbeats (or polling for messages) from all consumers of a consumer group. Every consumer group has a group coordinator. If a consumer stops sending heartbeats, the coordinator will trigger a rebalance.
  + consumer coordinator: each kafkaconsumer instance has a private member of consumer coordinator
  + consumer group leader:  is one of the consumer in a consumer group. 

  + subscribe mode VS assign mode

    先来看一段话

    > By having a notion of parallelism—the partition—within the topics, Kafka is able to provide both ordering guarantees and load balancing over a pool of consumer processes. This is achieved by assigning the partitions in the topic to the consumers in the consumer group so that **each partition is consumed by exactly one consumer in the group. **By doing this we ensure that the consumer is the only reader of that partition and consumes the data in order. Since there are many partitions this still balances the load over many consumer instances. **Note however that there cannot be more consumer instances in a consumer group than partitions. **
    >
    > **If we add more consumers to a single group with a single topic than we  have partitions, some of the consumers will be idle and get no messages  at all.**

    注意到这句话：however that there cannot be more consumer instances in a consumer group than partitions. 

    实际上这个是指的是assign mode下，同一个consumer group不能多个consumer来assign到同一个partition:

    ```
    Properties props = new Properties();
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "MyConsumerGroup");
    props.put("enable.auto.commit", "false");
    consumer = new KafkaConsumer<>(props);
    TopicPartition partition0 = new TopicPartition("mytopic", 0);
    consumer.assign(Arrays.asList(partition0));
    ConsumerRecords<Integer, String> records = consumer.poll(1000);
    ```

    如果一个consumer group启动多个consumer都选择这种assign模式，那么就会有问题，因为

    It is important to recall that Kafka keeps one offset per [consumer-group, topic, partition]. That is the reason.

    就是kafka自动维护的__consumer_offset是按照[consumer-group, topic, partition]来的[但是这里已经置为false了，所以应该没有问题，如果是true就有问题了，多个consumer读写同一个[consumer-group, topic, partition]就会有冲突]

    而如果是使用subscribe mode，就会自动进行rebalance，如果同一个consumer group中的instance多于partition，那么没有问题，大不了consumer就idle或standby而已

  

+ Topics & logs (Logical concept)：每条发布到 kafka 集群的消息属于的类别，即 kafka 是面向 topic 的。

   + LEO:: log end offset	offset+1
   + ISR:: in-sync replicas

   + internal topic:

     + __consumer_offsets

       ```
       key:   <consumer_group>,<topic>,<partition>
       value: <offset>,<partition_leader_epoch>,<metadata>,<timestamp>
       ```

+ Partition (Physical concept): 是物理上的概念，每个 topic 包含一个或多个 partition。kafka 分配的单位是 partition。

  Ordering (global order == one partition only)
  	
  Each partition is a totally ordered log, but there is no global ordering between partitions (other than perhaps some wall-clock time you might include in your messages). The assignment of the messages to a particular partition is controllable by the writer, with most users choosing to partition by some kind of key (e.g. user id). Partitioning allows log appends to occur without co-ordination between shards and allows the throughput of the system to scale linearly with the Kafka cluster size.

+ replica：partition 的副本，保障 partition 的高可用。

  **high watermark**: indicated the offset of messages that are fully  replicated, while the end-of-log offset might be larger if there are  newly appended records to the leader partition which are not replicated  yet.

+ leader：replica 中的一个角色， producer 和 consumer 只跟 leader 交互。

  Leader = topic leader = leader of replicas

+ follower：replica 中的一个角色，从 leader 中复制数据。
  	

Overview:

![](/docs/docs_image/software/buildingblock/kafka/kafka_architect.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka11.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka01.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka22.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka_zookeeper_nodes.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka_zookeeper_nodes2.png)

图中不同topic的不同的partition可能位于同一个kafka broker或者不同的kafka broker，具体在哪里，完全可以去每个kafka节点下面寻找，路径：

`/kafka/kafka-logs/<TOPIC-PARTITION>`



## 2. 安装使用

### 2.1 安装 install

#### 安装kafka

```shell
------------------------------------------------------------------------
--- Creating a User for Kafka
------------------------------------------------------------------------
sudo useradd kafka -m
sudo passwd kafka
for ubuntu: sudo adduser kafka sudo
for centos: sudo usermod -aG wheel kafka
su -l kafka

------------------------------------------------------------------------
-- Downloading and Extracting the Kafka Binaries
------------------------------------------------------------------------
mkdir ~/Downloads
curl "https://www.apache.org/dist/kafka/2.1.1/kafka_2.11-2.1.1.tgz" -o ~/Downloads/kafka.tgz
mkdir ~/kafka && cd ~/kafka
tar -xvzf ~/Downloads/kafka.tgz --strip 1 （We specify the --strip 1 flag to ensure that the archive’s contents are extracted in ~/kafka/ itself and not in another directory (such as ~/kafka/kafka_2.11-2.1.1/) inside of it）

------------------------------------------------------------------------
--- Configuring the Kafka Server
------------------------------------------------------------------------
vim ~/kafka/config/server.properties:

# The id of the broker. This must be set to a unique integer for each broker.
broker.id=0

port=9092
host.name=10.136.100.48
advertised.host.name=10.136.100.48
advertised.port=9092

delete.topic.enable = true
log.retention.hours=168
log.dirs=/opt/kafka_2.12-2.2.0/kafka-logs
#外置zookeeper
zookeeper.connect=1.1.1.1:2181,1.1.1.2:2181,1.1.1.3:2181

------------------------------------------------------------------------
--- Option 1: Creating Systemd Unit Files and Starting the Kafka Server
------------------------------------------------------------------------
sudo vim /etc/systemd/system/zookeeper.service
[Unit]
Requires=network.target remote-fs.target
After=network.target remote-fs.target

[Service]
Type=simple
User=kafka
ExecStart=/home/kafka/kafka/bin/zookeeper-server-start.sh /home/kafka/kafka/config/zookeeper.properties
ExecStop=/home/kafka/kafka/bin/zookeeper-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target

The [Unit] section specifies that Zookeeper requires networking and the filesystem to be ready before it can start.
The [Service] section specifies that systemd should use the zookeeper-server-start.sh and zookeeper-server-stop.sh shell files for starting and stopping the service. It also specifies that Zookeeper should be restarted automatically if it exits abnormally.

sudo vim /etc/systemd/system/kafka.service
[Unit]
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
User=kafka
ExecStart=/bin/sh -c '/home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties > /home/kafka/kafka/kafka.log 2>&1'
ExecStop=/home/kafka/kafka/bin/kafka-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
The [Unit] section specifies that this unit file depends on zookeeper.service. This will ensure that zookeeper gets started automatically when the kafka service starts.
The [Service] section specifies that systemd should use the kafka-server-start.sh and kafka-server-stop.sh shell files for starting and stopping the service. It also specifies that Kafka should be restarted automatically if it exits abnormally. 

sudo systemctl start kafka
sudo journalctl -u kafka
sudo systemctl enable kafka

------------------------------------------------------------------------
--- Option 2: 编写启动脚本
------------------------------------------------------------------------
readonly PROGNAME=$(basename $0)
readonly PROGDIR=$(readlink -m $(dirname $0))

# source env
L_INVOCATION_DIR="$(pwd)"
L_CMD_DIR="/opt/scripts"

if [ "${L_INVOCATION_DIR}" != "${L_CMD_DIR}" ]; then
  pushd ${L_CMD_DIR} &> /dev/null
fi

#source ../set_env.sh

#--------------- Function Definition ---------------#
showUsage() {
  echo "Usage:"
  echo "$0 kafka start|kill"
  echo ""
  echo "--start or -b:  Start kafka"
  echo "--kill or -k:   Stop kafka"
}

#---------------  Main ---------------#

# Parse arguments
while [ "${1:0:1}" == "-" ]; do
  case $1 in
    --start)
      L_FLAG="B"
      ;;
    -b)
      L_FLAG="B"
      ;;
        --kill)
      L_FLAG="K"
          ;;
        -k)
      L_FLAG="K"
          ;;
    *)
      echo "Unknown option: $1"
          echo ""
      showUsage
          echo ""
      exit 1
      ;;
  esac
  shift
done

L_RETURN_FLAG=0 # 0 for success while 99 for failure

KAFKA_HOME=/opt/kafka_2.12-2.2.0/bin

pushd ${KAFKA_HOME} &>/dev/null

if [ "$L_FLAG" == "B" ]; then
        echo "Starting kafka service..."
        ./kafka-server-start.sh -daemon ../config/server.properties
else
        echo "Stopping kafka service..."
        ./kafka-server-stop.sh -daemon ../config/server.properties
fi

exit $L_RETURN_FLAG

------------------------------------------------------------------------
--- Restricting the Kafka User  as a security precaution. 
------------------------------------------------------------------------
This step in the prerequisite disables sudo access for the kafka user
for ubuntu:
sudo deluser kafka sudo
for centos:
sudo gpasswd -d kafka wheel

sudo passwd kafka -l (对应unlock：sudo passwd kafka -u)
sudo su - kafka


```

#### 使用external zookeeper

```
kafka配置：

# Zookeeper connection string (see zookeeper docs for details).
# This is a comma separated host:port pairs, each corresponding to a zk
# server. e.g. "127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002".
# You can also append an optional chroot string to the urls to specify the
# root directory for all kafka znodes.
zookeeper.connect=1.1.1.1:2181,1.1.1.2:2181,1.1.1.3:2181

# Timeout in ms for connecting to zookeeper
zookeeper.connection.timeout.ms=6000

zookeeper配置：
This example is for a 3 node ensemble：

# The number of milliseconds of each tick                      
tickTime=2000                                                  
# The number of ticks that the initial                         
# synchronization phase can take                               
initLimit=10                                                   
# The number of ticks that can pass between                    
# sending a request and getting an acknowledgement             
syncLimit=5                                                    
# the directory where the snapshot is stored.                  
# do not use /tmp for storage, /tmp here is just               
# example sakes.                                               
dataDir=/zookeeper-3.4.8/zkdata           
dataLogDir=/zookeeper-3.4.8/logs          
# the port at which the clients will connect                   
clientPort=2181                                                
server.1=1.1.1.1:2888:3888                               
server.2=1.1.1.2:2888:3888                               
server.3=1.1.1.3:2888:3888                               
SERVER_JVMFLAGS=-Xmx1024m'                                     
```



### 2.2 使用 Usage

GUI：

+ KafkaEsque  https://kafka.esque.at

+ https://github.com/airbnb/kafkat

#### 2.2.1 单机 Local 调试

Quick start
https://kafka.apache.org/quickstart 

```
Start zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

Start kafka server
bin/kafka-server-start.sh config/server.properties
bin/kafka-server-start.sh config/server-1.properties &
bin/kafka-server-start.sh config/server-2.properties &

config/server-1.properties:
    broker.id=1
    listeners=PLAINTEXT://:9093
    log.dirs=/tmp/kafka-logs-1

```

##### Create topic

```
bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 3 --partitions 1 --topic my-replicated-topic

bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1  --topic mytopic

#You can use kafka-topics.sh to see how the Kafka topic is laid out among the Kafka brokers. The ---describe will show partitions, ISRs, and broker partition leadership.
[test@localhost kafka_2.12-2.2.0]$ bin/kafka-topics.sh --describe --bootstrap-server localhost:9092 --topic my-replicated-topic
OpenJDK 64-Bit Server VM warning: If the number of processors is expected to increase from one, then you should configure the number of parallel GC threads appropriately using -XX:ParallelGCThreads=N
Topic:my-replicated-topic       PartitionCount:1        ReplicationFactor:3     Configs:segment.bytes=1073741824
        Topic: my-replicated-topic      Partition: 0    Leader: 1       Replicas: 1,2,0 Isr: 1,2,0
```

##### Reassign Partition

```
kafka-reassign-partitions.sh
-- 1.generate current assignment
kafka-reassign-partitions --zookeeper hostname:port --topics-to-move-json-file topics to move.json --broker-list broker 1, broker 2 --generate
-- 2.modify and apply
kafka-reassign-partitions --zookeeper hostname:port  --reassignment-json-file reassignment configuration.json --bootstrap-server hostname:port --execute
-- 3.verify
kafka-reassign-partitions --zookeeper hostname:port --reassignment-json-file reassignment configuration.json  --bootstrap-server hostname:port --verify
```



##### Producer 

```
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my-replicated-topic

# for test 
bin/kafka-verifiable-producer.sh --topic consumer-tutorial --max-messages 200000 --broker-list localhost:9092
```

##### Consumer 

```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-replicated-topic

bin/kafka-console-consumer.sh --bootstrap-server <你的kafka配置> --topic T-RISK --partition 0 --offset 3350 --max-messages 1

#inspect partition assignments and consumption progress 
bin/kafka-consumer-groups.sh --new-consumer --describe --group consumer-tutorial-group --bootstrap-server localhost:9092 
=>
shows all the partitions assigned within the consumer group, which consumer instance owns it, and the last committed offset (reported here as the “current offset”). The lag of a partition is the difference between the log end offset and the last committed offset. 

#!/usr/bin/bash
# Copyright (c) 2016 AsiaInvestment Pte. Ltd. Singapore
# All rights reserved.
BOOTS_STRAP_SERVER=127.0.0.1:9092
ZK_SERVER=127.0.0.1:2181
pushd /kafka_2.12-2.2.0/bin &>/dev/null
echo "#################################"
echo "### TOPICS"
echo "#################################"
topics=(`./kafka-topics.sh --list --zookeeper $ZK_SERVER | grep -v grep  | awk '{print $1}'`)
for topic in ${topics[@]}
do
./kafka-topics.sh --describe --bootstrap-server $BOOTS_STRAP_SERVER --topic $topic
done
echo "#################################"
echo "### CONSUMER GROUP"
echo "#################################"
consumer_groups=(`./kafka-consumer-groups.sh --list --bootstrap-server $BOOTS_STRAP_SERVER | grep -v grep | awk '{print $1}'`)
for group in ${consumer_groups[@]}
do
echo "                  >>>group:$group<<<"
./kafka-consumer-groups.sh --describe --group $group --bootstrap-server $BOOTS_STRAP_SERVER
done

popd &>/dev/null

```

#### 2.2.2  虚拟机远程调试 Remote 

**VM Host only mode**

```
systemctl stop firewalld

Test from windows bat
.\kafka-console-producer.bat --broker-list 192.168.56.101:9092 --topic test
C:\Workspace\Temp\kafka_2.12-2.2.1\bin\windows> .\kafka-console-consumer.bat --bootstrap-server 192.168.56.101:9092 --from-beginning --topic test

Test from windows with python
pip install python-kafka
#python NO brokeravaialble
producer = KafkaProducer(bootstrap_servers=['192.168.56.101:9092'], api_version=(0,10))
#assert type(value_bytes) in (bytes, bytearray, memoryview, type(None)) AssertionError
 producer.send('test', 'hi'.encode('utf-8'))

```
![](/docs/docs_image/software/buildingblock/kafka/kafka02.png)

**Failed on VM NAT mode**

Someone succeed: https://boristyukin.com/connecting-to-kafka-on-virtualbox-from-windows/
But keep got: org.apache.kafka.common.errors.TimeoutException: Topic not present in metadata after 60000 ms

Port forward: 9092
Changed vm hostname
And map on host machine

When producer/consumer accesses the Kafka broker, the Kafka broker returns its host name for data producer or consumer at default settings. So producers/consumers need to resolve broker's host name to IPAddress.
For broker returning an arbitrary host name, use the advertised.listeners settings.
listeners vs. advertised.listeners https://stackoverflow.com/questions/42998859/kafka-server-configuration-listeners-vs-advertised-listeners

Turned on log level to DEBUG

May be need to do something like:
https://forums.virtualbox.org/viewtopic.php?f=1&t=29990
https://github.com/trivago/gollum/issues/93

Telnet 127.0.0.1/guesthost 9092 WORKS, but it doesn’t mean can reach to the guest machine, simply because of port forwarding opened 9092 port on host

![](/docs/docs_image/software/buildingblock/kafka/kafka03.png)

**Final vm workaround (NAT+HOSTONLY)**
vim /etc/sysconfig/network-scripts/ifcfg-enp0s3

![](/docs/docs_image/software/buildingblock/kafka/kafka04.png)

#### 2.2.3 集成开发 springboot

##### spring-kafka

https://www.baeldung.com/spring-kafka

org.springframework.kafka包含：

+ spring-context
+ spring-messaging
+ spring-tx
+ spring-retry
+ kafka-clients

##### apache-kafka

org.apache.kafka.kafka-client 

https://docs.confluent.io/clients-kafka-java/current/overview.html

https://www.baeldung.com/kafka-exactly-once

https://kafka.apache.org/20/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html

https://dzone.com/articles/kafka-producer-and-consumer-example

默认配置：

https://kafka.apache.org/documentation/



### 2.3 管理维护 Maintain

https://kafka.apache.org/documentation/#operations

#### 2.3.1 节点状态

```
------------------------------------------
--- zookeeper status
------------------------------------------
/zookeeper/bin/zkServer.sh status

------------------------------------------
--- 查看kafka broker节点
------------------------------------------
>/zookeeper/bin/zkCli.sh -server localhost:2181 #Make sure your Broker is already running
#ls /brokers/ids # Gives the list of active brokers
#ls /brokers/topics #Gives the list of topics
#get /brokers/ids/0 #Gives more detailed information of the broker id '0'
```

#### 2.3.2 House keeping

##### kafka offset not increase by 1

https://stackoverflow.com/questions/54636524/kafka-streams-does-not-increment-offset-by-1-when-producing-to-topic

https://issues.apache.org/jira/browse/KAFKA-6607

[http://trumandu.github.io/2019/04/13/%E5%A6%82%E4%BD%95%E7%9B%91%E6%8E%A7kafka%E6%B6%88%E8%B4%B9Lag%E6%83%85%E5%86%B5/](http://trumandu.github.io/2019/04/13/如何监控kafka消费Lag情况/)

https://stackoverflow.com/questions/54544074/how-to-make-restart-able-producer

 https://github.com/confluentinc/confluent-kafka-go/issues/195

##### clean up 

__consumer_offsets https://stackoverflow.com/questions/41429053/how-to-change-consumer-offsets-cleanup-plicy-to-delete-from-compact

##### partition

1 partition 2 replica, where is the replica?? On the same parition but different segment??

Alter:
	bin/kafka-topics.sh --bootstrap-server broker_host:port --alter --topic my_topic_name \
      --partitions 40
kafka-reassign-partitions命令是针对Partition进行重新分配，而不能将整个Topic的数据重新均衡到所有的Partition中。
https://segmentfault.com/a/1190000011721643
https://cloud.tencent.com/developer/article/1349448

Be aware that one use case for partitions is to semantically partition data, and adding partitions doesn't change the partitioning of existing data so this may disturb consumers if they rely on that partition. That is if data is partitioned by hash(key) % number_of_partitions then this partitioning will potentially be shuffled by adding partitions but Kafka will not attempt to automatically redistribute data in any way.

#### 2.3.3 工具/日志排查

https://kafka.apache.org/documentation/#monitoring

##### 系统排查

```
$ jps
17303 Jps
29819 Kafka
$ ll /proc/29819/fd
```



##### 日志位置

+ /kafka/logs

  controller.log.2021-03-01-00 kafka集群选举出的Controller负责通信
  server.log.2021-03-01-00 具体负责某个partition replica的leader的日志以及负责某个consumer group的group coordinator日志
  state-change.log.2021-03-01 记录topic partition的online offline等状态信息

  kafkaServer.out跟server.log一样，只是会定期archive到server.log

+ /kafka/kafka-logs

   __consumer_offsets-0/

  __transaction_state-0/

  [TOPIC]-[PARTITION]/

##### kafka server端日志解析

```
---------------------------------------------------------------------------
--- create/delete topic, from controller.log
1）这个是命令创建的
./kafka-topics.sh --create --bootstrap-server $KFK_CLUSTER --replication-factor 2 --partitions 3 --topic T-XXX
replica是2，所以对应两个broker，所以后面还要选一个prefer replica作为leader
[2021-04-14 11:04:11,239] INFO [Controller id=0] New topics: [Set(T-XXX)], deleted topics: [Set()], new partition replica assignment [Map(T-XXX-2 -> Vector(3, 0), T-XXX-1 -> Vector(0, 1), T-XXX-0 -> Vector(1, 3))] (kafka.controller.KafkaController)

--- elect TOPIC-PARTITION replica leader
INFO [Controller id=0] Partition T-XXX-2 completed preferred replica leader election. New leader is 3 (kafka.controller.KafkaController)

2）下面这个内部topic是何时被创建的（更准确的应该是说其各个分区是何时创建的）
https://cloud.tencent.com/developer/news/19958
__consumer_offsets创建的时机有很多种，主要包括：
broker响应FindCoordinatorRequest请求时
broker响应MetadataRequest显式请求__consumer_offsets元数据时
其中以第一种最为常见，而第一种时机的表现形式可能有很多，比如用户启动了一个消费者组(下称consumer group)进行消费或调用kafka-consumer-groups --describe等

注意，各自分区都是对应到一个broker，所以consumer group也就是直接对应到了相应的broker（group coordinator）
[2021-04-14 11:14:20,601] INFO [Controller id=0] New topics: [Set(__consumer_offsets)], deleted topics: [Set()], new partition replica assignment [Map(__consumer_offsets-22 -> Vector(3), __consumer_offsets-30 -> Vector(1), __consumer_offsets-8 -> Vector(0), __consumer_offsets-21 -> Vector(1), __co
对应到项目代码应该就是消费组 consumer group启动的时候

3）这个是代码创建的：
auto.create.topics.enable=true，代码读取T-XXX-SNP就会创建：
SNP就是我们后面会提到的所谓自己维护的增量快照
默认用了1个replica，所以直接就对应某个broker
[2021-04-14 11:14:27,347] INFO [Controller id=0] New topics: [Set(T-XXX-SNP)], deleted topics: [Set()], new partition replica assignment [Map(T-sss-SNP-2 -> Vector(3), T-XXX-SNP-1 -> Vector(1), T-XXX-SNP-0 -> Vector(0))] (kafka.controller.KafkaController)
[2021-04-14 11:14:27,347] INFO [Controller id=0] New partition creation callback for T-XXX-SNP-2,T-XXX-SNP-1,T-XXX-SNP-0 (kafka.controller.KafkaController)

最后变成一张broker map：
[2021-04-14 11:18:36,979] DEBUG [Controller id=0] Preferred replicas by broker Map(1 -> Map(T-JOB-SNP-0 -> Vector(1),  __consumer_offsets-27 -> Vector(1), T-TEST-1 -> Vector(1, 0), __transaction_state-2 -> Vector(1, 3), __transaction_state-20 -> Vector(1, 3), __consumer_offsets-33 -> Vector(1), T-DBMS-SNP-0 -> Vector(1), T-CAPTURE-0 -> Vector(1, 0), __consumer_offsets-36 -> Vector(1), __transaction_state-29 -> Vector(1, 0), __consumer_offsets-42 -> Vector(1), __consumer_offsets-3 -> Vector(1), __consumer_offsets-18 -> Vector(1), __transaction_state-38 -> Vector(1, 3), T-CLEAR-SNP-2 -> Vector(1, 3), T-MEMBER-1 -> Vector(1, 0), __consumer_offsets-15 -> Vector(1), __consumer_offsets-24 -> Vector(1), T-EOD-1 -> Vector(1, 0), T-QUOTATION-2 -> Vector(1, 0), __transaction_state-14 -> Vector(1, 3), __transaction_state-44 -> Vector(1, 3), T-RISK-0 -> Vector(1, 3), T-RISK-SNP-2 -> Vector(1), __transaction_state-32 -> Vector(1, 3), __consumer_offsets-48 -> Vector(1), T-CAPTURE-SNP-1 -> Vector(1), T-CLEAR-0 -> Vector(1, 0), T-EOD-SNP-1 -> Vector(1), __transaction_state-17 -> Vector(1, 0), __transaction_state-23 -> Vector(1, 0), __transaction_state-47 -> Vector(1, 0), __consumer_offsets-6 -> Vector(1), T-QUOTATION-SNP-1 -> Vector(1), __transaction_state-26 -> Vector(1, 3), T-JOB-2 -> Vector(1, 0), __transaction_state-5 -> Vector(1, 0), __transaction_state-8 -> Vector(1, 3)

---------------------------------------------------------------------------
--- elect Controller from controller.log
[2021-04-14 10:53:31,013] DEBUG [Controller id=1] Broker 0 has been elected as the controller, so stopping the election process. (kafka.controller.KafkaController)


---------------------------------------------------------------------------
--- rebalance by group coordinator broker 3,from server.log or kafkaServer.out
[2021-04-15 08:24:20,809] INFO [GroupCoordinator 3]: Preparing to rebalance group XXXX-SZL in state PreparingRebalance with old generation 0 (__consumer_offsets-28) (reason: Adding new member consumer-1-11aac9d7-8a72-44fe-bf5c-0519941bbb6a) (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:20,811] INFO [GroupCoordinator 3]: Stabilized group XXX-SZL generation 1 (__consumer_offsets-28) (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:20,823] INFO [GroupCoordinator 3]: Assignment received from leader for group XXXX-SZL for generation 1 (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:22,543] INFO [TransactionCoordinator id=3] Initialized transactionalId XXX-TID-0 with producerId 1004 and producer epoch 1 on partition __transaction_state-15 (kafka.coordinator.transaction.TransactionCoordinator)
[2021-04-15 08:24:23,957] INFO [GroupCoordinator 3]: Preparing to rebalance group XXXX-SZL in state PreparingRebalance with old generation 0 (__consumer_offsets-49) (reason: Adding new member consumer-1-416c9379-0f89-48f4-b125-eadf648d57c7) (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:23,959] INFO [GroupCoordinator 3]: Stabilized group XXXXE-SZL generation 1 (__consumer_offsets-49) (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:23,972] INFO [GroupCoordinator 3]: Assignment received from leader for group XXX-SZL for generation 1 (kafka.coordinator.group.GroupCoordinator)
[2021-04-15 08:24:25,524] INFO [TransactionCoordinator id=3] Initialized transactionalId XXXX-TID-0 with producerId 1005 and producer epoch 1 on partition __transaction_state-18 (kafka.coordinator.transaction.TransactionCoordinator)

---------------------------------------------------------------------------
--- closed kafka client, from server.log or kafkaServer.out

[2021-04-16 17:51:05,705] INFO [GroupCoordinator 3]: Member consumer-1-416c9379-0f89-48f4-b125-eadf648d57c7 in group CLEAR-REALTIME-SZL has failed, removing it from the group (kafka.coordinator.group.GroupCoordinator)
[2021-04-16 17:51:05,707] INFO [GroupCoordinator 3]: Preparing to rebalance group CLEAR-REALTIME-SZL in state PreparingRebalance with old generation 1 (__consumer_offsets-49) (reason: removing member consumer-1-416c9379-0f89-48f4-b125-eadf648d57c7 on heartbeat expiration) (kafka.coordinator.group.GroupCoordinator)
客户端consumer group所有的consumer都停掉了，所以是empty，然后整个group宣布dead
[2021-04-16 17:51:05,707] INFO [GroupCoordinator 3]: Group XXX-SZL with generation 2 is now empty (__consumer_offsets-49) (kafka.coordinator.group.GroupCoordinator)
[2021-04-16 17:53:56,956] INFO [GroupMetadataManager brokerId=3] Group XXX-SZL transitioned to Dead in generation 2 (kafka.coordinator.group.GroupMetadataManager)

---------------------------------------------------------------------------
---shutdown kafka borker 3, from server.log or kafkaServer.out
[2021-04-15 08:59:31,965] INFO Terminating process due to signal SIGTERM (org.apache.kafka.common.utils.LoggingSignalHandler)
[2021-04-15 08:59:31,973] INFO [KafkaServer id=3] shutting down (kafka.server.KafkaServer)
[2021-04-15 08:59:31,977] INFO [KafkaServer id=3] Starting controlled shutdown (kafka.server.KafkaServer)
[2021-04-15 08:59:32,066] INFO [ReplicaFetcherManager on broker 3] Removed fetcher for partitions Set(__transaction_state-45, __transaction_state-27, __transaction_state-9, T-XXX-2, T-XXX-1, __transaction_state-39, __transaction_state-36, ...... __transaction_state-0) (kafka.server.ReplicaFetcherManager)


```



##### kafka client端日志解析

```
---------------------------------------------------------------------------
--- metadata
this.kafkaConsumer.partitionsFor(context.getConfig().getTaskTopic())
=>
2021-04-01 14:37:00.622  INFO 32380GG [main] o.a.k.c.Metadata : Cluster ID: uEekh0baSnKon5ENwtY9dg

consumer.endOffsets(Collections.singleton(topicPartition)).get(topicPartition) 
=>
2021-04-01 14:37:51.146  INFO 32380GG [RKER-RECOVERY-2] o.a.k.c.Metadata : Cluster ID: uEekh0baSnKon5ENwtY9dg
或
2021-03-27 15:40:29 395-[org.apache.kafka.clients.Metadata.update(Metadata.java:365)]-[INFO]  Cluster ID: pjnHKkklRtuSQjVDsUbgVw

---------------------------------------------------------------------------
--- subscribe to topic or to topic|partition

this.kafkaConsumer.subscribe(Collections.singleton(context.getConfig().getTaskTopic()), new SimpleWorkBalancer(context.getRestorer(), this::removeWorker, this::addWorker));
=>
2021-04-01 14:37:00.639  INFO 32380GG [main] o.a.k.c.c.KafkaConsumer : [Consumer clientId=consumer-1, groupId=XXXX-SZL] Subscribed to topic(s): T-XXXX

consumer.assign(Collections.singleton(topicPartition));
=>
2021-04-01 14:38:09.783  INFO 32380GG [RKER-RECOVERY-2] o.a.k.c.c.KafkaConsumer : [Consumer clientId=consumer-2, groupId=RESTORE-1] Subscribed to partition(s): T-XXXX-SNP-1

---------------------------------------------------------------------------
--- Discover group
consumer.poll(Duration.ofMillis(10_000L));
=>
如果是assign mode，如果前面没有调用endOffsets之类获取metadata，此时会打印（估计跟consumer.seek(topicPartition, checkpointOffset);有关，当然如果之前调用过就会在调用时打印，此时不会打印）：
2021-04-01 15:56:50.755  INFO 22064GG [RKER-RECOVERY-1] o.a.k.c.Metadata : Cluster ID: uEekh0baSnKon5ENwtY9dg 
然后打印
2021-04-01 14:37:40.379  INFO 32380GG [XXXX-MANAGER] ordinator$FindCoordinatorResponseHandler : [Consumer clientId=consumer-1, groupId=XXX-SZL] Discovered group coordinator 1.1.1.1:9092 (id: 2147483647 rack: null)
2021-04-01 14:38:41.369  INFO 32380GG [RKER-RECOVERY-2] ordinator$FindCoordinatorResponseHandler : [Consumer clientId=consumer-2, groupId=RESTORE-1] Discovered group coordinator 1.1.1.1:9092 (id: 2147483647 rack: null)

如果触发了rebalance，则接着打印
2021-03-31 08:59:01.727  INFO 20080GG [XXX-MANAGER] o.a.k.c.c.i.AbstractCoordinator : [Consumer clientId=consumer-1, groupId=CLEAR-PRICEENGINE-SZL] (Re-)joining group
2021-03-31 08:59:01.904  INFO 20080GG [XXX-MANAGER] o.a.k.c.c.i.AbstractCoordinator : [Consumer clientId=consumer-1, groupId=CLEAR-PRICEENGINE-SZL] (Re-)joining group
2021-03-31 08:59:04.122  INFO 20080GG [XXX-MANAGER] o.a.k.c.c.i.AbstractCoordinator$1 : [Consumer clientId=consumer-1, groupId=CLEAR-PRICEENGINE-SZL] Successfully joined group with generation 10

---------------------------------------------------------------------------
--- todo
Leader imbalance ratio for broker 3 is 0.0
https://stackoverflow.com/questions/57475580/whats-the-difference-between-kafka-preferred-replica-election-sh-and-auto-leade

```

##### kafka 常见异常Exceptions

Kafka常见错误整理 https://cloud.tencent.com/developer/article/1508919

```
--- NotEnoughReplicasException
The size of the current ISR Set(0) is insufficient to satisfy the min.isr requirement
https://stackoverflow.com/questions/62770272/notenoughreplicasexception-the-size-of-the-current-isr-set2-is-insufficient-t

--- LEADER_NOT_AVAILABLE: 
topic 可能不存在，kafka api默认会自动创建

--- offset commit failed on partition this is not the correct coordinator

--- Offset commit failed on partition xxx at offset 957: The coordinator is not aware of this member
https://www.cnblogs.com/chuijingjing/p/12797035.html

--- topic not presetn in metadata after 6000ms
partition 可能不存在或者是其他问题，比如
https://blog.csdn.net/bay_bai/article/details/104799498
https://github.com/wurstmeister/kafka-docker/issues/553

--- Connection to node -1 could not be established. Broker may not be available.
listener设置不对
https://blog.csdn.net/Mr_hou2016/article/details/79484032

--- Connection to node -2 could not be established. Broker may not be available.

--- org.apache.kafka.common.errors.TimeoutException: Failed to get offsets by times in 30000ms
endOffsets()->fetchOffsetsByTimes

--- UNKNOWN_MEMBER_ID
Attempt to heartbeat failed for since member id consumer-1-c4ff67d3-b776-4994-9179-4a19f9ff87a6 is not valid
可能1：如果当前 group 的状态为 Dead，则说明对应的 group 不再可用，或者已经由其它 GroupCoordinator 实例管理，直接响应 UNKNOWN_MEMBER_ID 错误，消费者可以再次请求获取新接管的 GroupCoordinator 实例所在的位置信息。
可能2：消费者会在轮询获取消息或提交偏移量时发送心跳，如果消费者停止发送心跳的时间足够长，会话就会过期，组协调器认为它已经死亡，就会触发一次再均衡，至于原因，有可能是：
一般来说producer的生产消息的逻辑速度都会比consumer的消费消息的逻辑速度快，当producer在短时间内产生大量的数据丢进kafka的broker里面时，可能出现类似错误：Offset commit failed on partition : The coordinator is not aware of this member.
1) kafka的consumer会从broker里面取出一批数据，给消费线程进行消费；
2) 由于取出的一批消息数量太大，consumer在session.timeout.ms时间之内没有消费完成；
3) consumer coordinator 会由于没有接受到心跳而挂掉；
4) 由于自动提交offset失败，reblance之后又重新消费之前的一批数据（offset提交失败），恶性循环，越积越多；
- https://www.cnblogs.com/chuijingjing/p/12797035.html

--- Group coordinator is unavailable or invalid
Group coordinator 192.168.11.55:9092 (id: 2147483647 rack: null) is unavailable or invalid, will attempt rediscovery

--- CommitFailedException
If a simple consumer(assign mode) tries to commit offsets with a group id which matches an active consumer group, the coordinator will reject the commit (which will result in a CommitFailedException). However, there won’t be any errors if another simple consumer instance shares the same group id.

--- INVALID_FETCH_SESSION_EPOCH.
Node 1 was unable to process the fetch request with (sessionId=1972558084, epoch=904746): INVALID_FETCH_SESSION_EPOCH.
```



##### kafka-log-dirs.sh

```
./bin/kafka-log-dirs.sh --describe --bootstrap-server hostname:port --broker-list broker 1, broker 2 --topic-list topic 1, topic 2
```

##### kafka-dump-log.sh

KAFKA Internal consumer topic log：

```
./bin/kafka-dump-log.sh --files ./kafka-logs/T-TOPIC-1/00000000000000000192.log --print-data-log
```

##### kafka-console-consumer.sh 

KAFKA Internal offset topic: `__consumer_offsets`:

```
#Create consumer config
echo "exclude.internal.topics=false" > /tmp/consumer.config
#Consume all offsets
./kafka-console-consumer.sh --consumer.config /tmp/consumer.config \
--formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" \
--bootstrap-server localhost:9092 --topic __consumer_offsets --from-beginning
```



KAFKA Internal transaction log:

暂时没找到方法看，参考

> You can look to source code of `TransactionLogMessageParser` class inside `kafka/tools/DumpLogSegments.scala` file as an example.  It uses `readTxnRecordValue` function from `TransactionLog` class.  The first argument for this function could be retrieved via `readTxnRecordKey` function of the same class.
>
> https://stackoverflow.com/questions/47670477/reading-data-from-transaction-state-topic-in-kafka-0-11-0-1

KAFKA Internal transaction topic: `__transaction_state`

```
echo "exclude.internal.topics=false" > consumer.config
./bin/kafka-console-consumer.sh --consumer.config consumer.config --formatter "kafka.coordinator.transaction.TransactionLog\$TransactionLogMessageFormatter" --bootstrap-server 0.136.100.45:9092,10.136.100.46:9092,10.136.100.47:9092 --topic __transaction_state --from-beginning
```



#### 2.3.4 Backup (point-in-time snapshot) & Restore

为什么需要备份？

https://medium.com/@anatolyz/introducing-kafka-backup-9dc0677ea7ee

> Replication handles many error cases but by far not all. What about the case that  there is a bug in Kafka that deletes old data? What about a  misconfiguration of the topic (are you sure, that your value of  retention.ms is a millisecond value?)? What about an admin that  accidentally deleted the whole Prod Cluster because they thought they  were on dev? What about security breaches? If an attacker gets access to your Kafka Management interface, they can do whatever they like.
>
> Of course, this does not matter too much if you are using Kafka to  distribute click-streams data for your analytics department and it is  tolerable to loose some data. But if you use Kafka as your “central  nervous system” for your company and you store your core business data  in Kafka you better think about a cold storage backup for your Kafka  Cluster.
>
> 

##### 停机备份

https://www.digitalocean.com/community/tutorials/how-to-back-up-import-and-migrate-your-apache-kafka-data-on-ubuntu-18-04

```
单机版例子，集群类似，只是需要停掉所有的zookeeper和kafka，然后备份其中一台机器的zookeeper和kafka，然后在所有机器上恢复

sudo -iu kafka

~/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic BackupTopic

echo "Test Message 1" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic BackupTopic > /dev/null

~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic BackupTopic --from-beginning

-----------------------------------------------------------------------------------
--- Backing Up the ZooKeeper State Data
-----------------------------------------------------------------------------------
kafka内置zookeeper：
ZooKeeper stores its data in the directory specified by the dataDir field in the /kafka/config/zookeeper.properties:
dataDir=/tmp/zookeeper
使用外置zookeeper：
/zookeeper/conf/zoo.cfg
dataDir=/opt/zookeeper-3.4.8/zkdata
dataLogDir=/opt/zookeeper-3.4.8/logs

compressed archive files are a better option over regular archive files to save disk space:
tar -czf /opt/kafka_backup/zookeeper-backup.tar.gz /opt/zookeeper-3.4.8/zkdata/*
忽略错误 tar: Removing leading `/' from member names

-----------------------------------------------------------------------------------
--- Backing Up the Kafka Topics and Messages
-----------------------------------------------------------------------------------
Kafka stores topics, messages, and internal files in the directory that the log.dirs field specifies 
/kafka/config/server.properties:
log.dirs=/opt/kafka_2.12-2.2.0/kafka-logs

stop the Kafka service so that the data in the log.dirs directory is in a consistent state when creating the archive with tar

sudo systemctl stop kafka (前面安装时移除了kafka的sudo权限，需要使用其他有sudo权限的非root用户执行)
sudo -iu kafka

tar -czf /opt/kafka_backup/kafka-backup.tar.gz /opt/kafka_2.12-2.2.0/kafka-logs/*

sudo systemctl start kafka （同样切换其他用户）
sudo -iu kafka

-----------------------------------------------------------------------------------
--- Restoring the ZooKeeper Data & Kafka Data
-----------------------------------------------------------------------------------
You need to stop the Kafka and ZooKeeper services as a precaution against the data directories receiving invalid data during the restoration process.

sudo systemctl stop kafka
sudo systemctl stop zookeeper
sudo -iu kafka

rm -r /opt/zookeeper-3.4.8/zkdata/*
tar -C /opt/zookeeper-3.4.8/zkdata -xzf /opt/kafka_backup/zookeeper-backup.tar.gz --strip-components 2
（specify the --strip 2 flag to make tar extract the archive’s contents in /tmp/zookeeper/ itself and not in another directory (such as /tmp/zookeeper/tmp/zookeeper/) inside of it.）

rm -r /opt/kafka_2.12-2.2.0/kafka-logs/*
tar -C /opt/kafka_2.12-2.2.0/kafka-logs -xzf /opt/kafka_backup/kafka-backup.tar.gz --strip-components 2
sudo systemctl start kafka
sudo systemctl start zookeeper
sudo -iu kafka

-----------------------------------------------------------------------------------
--- Verifying the Restoration
-----------------------------------------------------------------------------------
~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic BackupTopic --from-beginning

```

https://stackoverflow.com/questions/47791039/backup-restore-kafka-and-zookeeper/48337651

##### 在线备份

> Still no. You’re dealing with a distributed system. It’s not magic. Any  attempt to trigger a snapshot ‘simultaneously’ across multiple  hosts/disks is going to be subject to some small level of timing  difference whether those are VMs managed by you in the Cloud or  containers in K8s with persistent disks managed by the Cloud provider.  It’d probably work in small scale tests, but break under significant  production load.

https://www.reddit.com/r/apachekafka/comments/jb400p/kafka_backup_and_recovery/g8vkju7/

https://www.reddit.com/r/apachekafka/comments/g73nk9/how_to_take_full_backupsnapshot_of_kafka/

解决方案：

Support point-in-time backups :

提出需求：https://github.com/itadventurer/kafka-backup/issues/52

解决方案：

1）当前版本在一定场景下可以使用：

- Let Kafka Backup running in the background
- Kafka Backup writes data continuously in the background to the file system
- `kill -9` Kafka Backup as soon as it is "finished", i.e.  it finished writing your data. This should be promptly after you  finished producing data
- move the data of Kafka Backup to your new destination.

```
需要用到kafka自带的connect-standalone.sh 所以要配置环境变量
export PATH=$PATH:~/kafka/bin


backup：
sudo env "PATH=$PATH" backup-standalone.sh --bootstrap-server localhost:9092 --target-dir /path/to/backup/dir --topics 'topic1,topic2'

~/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic topic1

~/kafka/bin/kafka-topics.sh --zookeeper localhost:2181 --delete --topic 'topic.*'

restore：
restore-standalone.sh --bootstrap-server localhost:9092 --target-dir /path/to/backup/dir --topics 'topic1,topic2'

~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic BackupTopic --from-beginning
```

2）新增的支持 https://github.com/itadventurer/kafka-backup/pull/99 但是没有发布



https://www.confluent.io/blog/3-ways-prepare-disaster-recovery-multi-datacenter-apache-kafka-deployments/

## 3.Kafka stream
《Kafka Stream》调研：一种轻量级流计算模式 https://yq.aliyun.com/articles/58382
Kafka Streams - Not Looking at Facebook https://timothyrenner.github.io/engineering/2016/08/11/kafka-streams-not-looking-at-facebook.html
https://cloud.tencent.com/developer/ask/203192
https://www.codota.com/code/java/methods/org.apache.kafka.streams.kstream.KStream/groupBy
http://www.jasongj.com/kafka/kafka_stream/

### 3.1 Architecture 
https://kafka.apache.org/22/documentation/streams/architecture

**Stream Partitions and Tasks**

![](/docs/docs_image/software/buildingblock/kafka/kafka05.png)

Task(consumer, run topology over one or more partition), Thread can run one or multiple Task, Instance ID is consumer group ID,multiple instance with same group ID belong to one consumer group, 
4 partition, 1 instance will start 4 task, (thread quantity is defined by code), now start a new instance, join the consumer group, relocate 4 partition, each instance got 2 partition, so each instance run 2 task
Kafka Stream的并行模型中，最小粒度为Task，而每个Task包含一个特定子Topology的所有Processor。因此每个Task所执行的代码完全一样，唯一的不同在于所处理的数据集互补。这一点跟Storm的Topology完全不一样。Storm的Topology的每一个Task只包含一个Spout或Bolt的实例。因此Storm的一个Topology内的不同Task之间需要通过网络通信传递数据，而Kafka Stream的Task包含了完整的子Topology，所以Task之间不需要传递数据，也就不需要网络通信。这一点降低了系统复杂度，也提高了处理效率。

如果某个Stream的输入Topic有多个(比如2个Topic，1个Partition数为4，另一个Partition数为3)，则总的Task数等于Partition数最多的那个Topic的Partition数（max(4,3)=4）。这是因为Kafka Stream使用了Consumer的Rebalance机制，每个Partition对应一个Task。
Kafka Stream可被嵌入任意Java应用（理论上基于JVM的应用都可以）中，下图展示了在同一台机器的不同进程中同时启动同一Kafka Stream应用时的并行模型。注意，这里要保证两个进程的StreamsConfig.APPLICATION_ID_CONFIG完全一样。因为Kafka Stream将APPLICATION_ID_CONFI作为隐式启动的Consumer的Group ID。只有保证APPLICATION_ID_CONFI相同，才能保证这两个进程的Consumer属于同一个Group，从而可以通过Consumer Rebalance机制拿到互补的数据集。
https://yq.aliyun.com/articles/222900?spm=5176.10695662.1996646101.searchclickresult.13d4446d1xNbRq


图二:上图中的Consumer和Producer并不需要开发者在应用中显示实例化，而是由Kafka Stream根据参数隐式实例化和管理，从而降低了使用门槛。开发者只需要专注于开发核心业务逻辑，也即上图中Task内的部分。

图三: 两图都是同一个机器，都只有一个instance,都是4个task，分别运行在一个thread和2个thread

图四:左图一台机器，两个instance，4个task分别属于两个instance；而右图是部署两台机器上

**Threading Model**

Kafka Streams work allocation https://medium.com/@andy.bryant/kafka-streams-work-allocation-4f31c24753cc

https://www.slideshare.net/ConfluentInc/robust-operations-of-kafka-streams

![](/docs/docs_image/software/buildingblock/kafka/kafka06.png)

**Local State Stores**

**Fault Tolerance**

![](/docs/docs_image/software/buildingblock/kafka/kafka07.png)

### 3.2 Concepts 
https://kafka.apache.org/22/documentation/streams/core-concepts
Task ⇔ 一个consumer可以包含多个task，consumer本身是隐式管理
Task vs thread
https://stackoverflow.com/questions/48106568/kafka-streams-thread-number

Kstream ktable

https://www.slideshare.net/vitojeng/streaming-process-with-kafka-connect-and-kafka-streams-80721215
**Stream Processing Topology**
	Kafka Streams DSL 
	Processor API 
**Time**
	Event time
	Processing time
	Ingestion time
	Stream time, wall-clock time
**Aggregation**

**Windowing**
Late arriving records
**Duality of Stream and table**

**States**

**Processing guarantees**

 Lambda Architecture http://lambda-architecture.net/

**Out-of-order handling**
For stateless operations, out-of-order data will not impact processing logic since only one record is considered at a time, without looking into the history of past processed records; for stateful operations such as aggregations and joins, however, out-of-order data could cause the processing logic to be incorrect.

Physical order = offset order
Logical order = timestamp order
https://dl.acm.org/citation.cfm?id=3242155

Since timestamps, in contrast tooffsets, are not necessarily unique, we use the record offsetas “tie breaker” [15] to derive a logical order that isstrictandtotalover all records.
In theKafka Streams DSL, there are two first-class abstractions:aKStreamand aKTable. AKStreamis an abstraction ofa record stream, while a KTable is an abstraction of both a table changelog stream and its corresponding materializedtables in the Dual Streaming Model. In addition, users of theDSL can query a KTable’s materialized state in real-time.
Whenever a record is received from the source Kafka topics,it will be processed immediately by traversing through allthe connected operators specified in the Kafka Streams DSL until it has been materialized to some result KTable, or writ-ten back to a sink Kafka topic. During the processing, therecord’s timestamp will be maintained/updated according toeach operator’s semantics as defined in Section 4
Handling out-of-order records injoins requires several strategies. For stream-table joins, out-of-order records do not require special handling. However,out-of-order table updates could yield incorrect join results, ifnot treated properly. Assume that the table update in Figure 6from⟨A,a,2⟩to⟨A,a′,5⟩is delayed. Stream record⟨A,α′,6⟩would join with the first table version and incorrectly emit⟨A,α′▷◁a,6⟩. To handle this case, it is required to buffer record stream input record in the stream-table join operatorand re-trigger the join computation for late table updates.Thus, if a late table update occurs, corresponding updaterecords are sent downstream to “overwrite” previously emit-ted join records. Note, that the result of stream-table joinsis not a record stream but a regular data stream because itmight contain update records.

Record stream , normal data stream
Time window , session window

https://kafka.apache.org/22/documentation/streams/developer-guide/

![](/docs/docs_image/software/buildingblock/kafka/kafka08.png)

### 3.3 Basic usage

![](/docs/docs_image/software/buildingblock/kafka/kafka09.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka10.png)

```
mvn clean package
mvn exec:java -Dexec.mainClass=myapps.WordCount
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-plaintext-input
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-wordcount-output \
    --config cleanup.policy=compact
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic my_topic_name

bin/kafka-run-class.sh myapps.WordCount
/home/test/workspace/kafka/kafka_2.12-2.2.0/bin/kafka-run-class.sh myapps.WordCount
mvn exec:java -Dexec.mainClass=myapps.WordCount

bin/kafka-run-class.sh org.apache.kafka.streams.examples.wordcount.WordCountDemo

bin/kafka-console-producer.sh --broker-list localhost:9092 --topic streams-plaintext-input
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
    --topic streams-wordcount-output \
    --from-beginning \
    --formatter kafka.tools.DefaultMessageFormatter \
    --property print.key=true \
    --property print.value=true \
    --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer \
    --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer

```

https://kafka.apache.org/22/documentation/streams/tutorial
https://github.com/apache/kafka/tree/2.2/streams/examples

https://www.draw.io/#G13TFIxfbM3VN9R5Pg7nFwNguUUNUXKChO

?# Windowed

``` 
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-plaintext-input
bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic streams-windowed-wordcount-output \
    --config cleanup.policy=compact
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
    --topic streams-windowed-wordcount-output \
    --from-beginning \
    --formatter kafka.tools.DefaultMessageFormatter \
    --property print.key=true \
    --property print.value=true \
    --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer \
    --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer
```

### 3.4 kafka stream VS storm (wordcount)

Kafka wordcount是stateful operation，因为每个task/consumer完全独立跑完整的topology，每个consumer处理某一个partition，所以要借助data store来存储ktable“中间”状态，data store也是多个consumer/task“协作”的结果
而storm wordcount是stateless operation，因为一个topology是分成sprout，bolt，每个sprout/bolt会开启一个或多个task，这些task在work process中执行，这些work process可能位于不同的机器，所以第一步是split bolt，然后将这些单词进行partition发送至相应的tasks，比如the这个单词会一直发送到某个特定的task进行count，所以对于最后一步count是很简单的，不需要reduce操作，每个count task都只统计相应的单词，互相之间没有重叠，不像kafka那样因为partition比较早，所以不同的parttion之间是有重叠的单词的，所以必须借助一个第三者存储来统计

### 3.5 Advance

Ktables vs global ktables
Kafka has several features for reducing the need to move data on startup 

- Standby Replicas 
- Disk Checkpoints
- Compacted topics
  Command and Query Responsibility Segregation (CQRS) pattern [with event sourcing]

![](/docs/docs_image/software/buildingblock/kafka/kafka12.png)

Using an event-streaming approach, we can materialize the data locally via the Kafka Streams API. We define a query for the data in our grid: “select * from orders, payments, customers where…” and Kafka Streams executes it, stores it locally, keeps it up to date. This ensures highly available should the worst happen and your service fails unexpectedly (this approach is discussed in more detail here).
To combat the challenges of being stateful, Kafka ships with a range of features to make the storage, movement, and retention of state practical: notably standby replicas and disk checkpointsto mitigate the need for complete rebuilds, and compacted topics to reduce the size of datasets that need to be moved.



State store, global or local?
Ktable, globalktable

Kafka Stream有一些关键东西没有解决，例如在join场景中，需要保证来源2个Topic数据Shard个数必须是一定的，因为本身做不到MapJoin等技术




## 4.Indepth 
nothing to guarantee/at-most-once => at-least-once => exactly-once

https://kafka.apache.org/documentation/#design

### 4.0 Config

https://docs.confluent.io/platform/current/installation/configuration

#### Server Config

```
############################# Server Basics #############################
# The id of the broker. This must be set to a unique integer for each broker.
broker.id=0

############################# Socket Server Settings #############################
port=9092
host.name=10.136.100.48
advertised.host.name=10.136.100.48
advertised.port=9092
listeners = PLAINTEXT://your.host.name:9092
#advertised.listeners=PLAINTEXT://your.host.name:9092 //This is the metadata that’s passed back to clients.
listener.security.protocol.map=PLAINTEXT:PLAINTEXT,SSL:SSL,SASL_PLAINTEXT:SASL_PLAINTEXT,SASL_SSL:SASL_SSL
#Kafka brokers communicate between themselves, usually on the internal network (e.g., Docker network, AWS VPC, etc.). To define which listener to use, specify：
inter.broker.listener.name //https://cwiki.apache.org/confluence/display/KAFKA/KIP-103%3A+Separation+of+Internal+and+External+traffic

You need to set advertised.listeners (or KAFKA_ADVERTISED_LISTENERS if you’re using Docker images) to the external address (host/IP) so that clients can correctly connect to it. Otherwise, they’ll try to connect to the internal host address—and if that’s not reachable, then problems ensue.

https://stackoverflow.com/questions/42998859/kafka-server-configuration-listeners-vs-advertised-listeners
https://cwiki.apache.org/confluence/display/KAFKA/KIP-103%3A+Separation+of+Internal+and+External+traffic
https://cwiki.apache.org/confluence/display/KAFKA/KIP-291%3A+Separating+controller+connections+and+requests+from+the+data+plane

############################# Group Coordinator Settings #############################
# The following configuration specifies the time, in milliseconds, that the GroupCoordinator will delay the initial consumer rebalance.
# The rebalance will be further delayed by the value of group.initial.rebalance.delay.ms as new members join the group, up to a maximum of max.poll.interval.ms.
# The default value for this is 3 seconds.
# We override this to 0 here as it makes for a better out-of-the-box experience for development and testing.
# However, in production environments the default value of 3 seconds is more suitable as this will help to avoid unnecessary, and potentially expensive, rebalances during application startup.
group.initial.rebalance.delay.ms=0

还看到配置 scheduled.rebalance.max.delay.ms，
https://medium.com/streamthoughts/apache-kafka-rebalance-protocol-or-the-magic-behind-your-streams-applications-e94baf68e4f2
但是这好像是confluence提供的产品，并不是kafka默认的

############################# Log Retention Policy #############################
# The minimum age of a log file to be eligible for deletion due to age
log.retention.hours=336
# The maximum size of a log segment file. When this size is reached a new log segment will be created.
#log.segment.bytes=1073741824
log.segment.bytes=2147483647
https://stackoverflow.com/questions/65507232/kafka-log-segment-bytes-vs-log-retention-hours

```



##### 测试 listener工具：

关于host

[Kafka Listeners – Explained](https://www.confluent.io/blog/kafka-listeners-explained/)

+ kafkacat:

  https://github.com/edenhill/kafkacat

  https://docs.confluent.io/platform/current/app-development/kafkacat-usage.html

  ```
  kafkacat -b kafka0:9092 -L
  ```

+ python scripts

  https://github.com/lyhistory/kafka-listeners/blob/master/python/python_kafka_test_client.py

  https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/

+ nc

  ```
   nc -vz 1.1.1.1 9092
  ```


##### replica factor

很重要，对于普通的topic replica factor来说，replica多一些没有问题，但是对internal topic要特别注意，尤其是对于 __transaction_state来说，如果min.isr设置跟replication.factor设置一样，那么任何一个kafka节点down掉，都会造成无法写入kafka（transactional producer写入会报错 NotEnoughReplicasException）

https://stackoverflow.com/questions/47483016/recommended-settings-for-kafka-internal-topics-after-upgrade-to-1-0

```
############################# Internal Topic Settings  #############################
# The replication factor for the group metadata internal topics "__consumer_offsets" and "__transaction_state"                                                                        
# For anything other than development testing, a value greater than 1 is recommended for to ensure availability such as 3.                                                            
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=2
```



#### Client Config

```
--- auto.create.topics.enable

Enable auto creation of topic on the server
Type:	boolean
Default:	true
Valid Values:	
Importance:	high
Update Mode:	read-only

--- request.timeout.ms
The configuration controls the maximum amount of time the client will wait for the response of a request. If the response is not received before the timeout elapses the client will resend the request if necessary or fail the request if retries are exhausted.

Type:	int
Default:	30000 (30 seconds)

--- scheduled.rebalance.max.delay.ms
The maximum delay that is scheduled in order to wait for the return of one or more departed workers before rebalancing and reassigning their connectors and tasks to the group. During this period the connectors and tasks of the departed workers remain unassigned

Type:	int
Default:	300000 (5 minutes)

--- session.timeout.ms
 After every rebalance, all members of the current generation begin sending periodic heartbeats to the group coordinator. As long as the coordinator continues receiving heartbeats, it assumes that members are healthy. On every received heartbeat, the coordinator starts (or resets) a timer. If no heartbeat is received when the timer expires, the coordinator marks the member dead and signals the rest of the group that they should rejoin so that partitions can be reassigned. The duration of the timer is known as the session timeout and is configured on the client with the setting session.timeout.ms. 
  The only problem with this is that a spurious rebalance might be triggered if the consumer takes longer than the session timeout to process messages. You should therefore set the session timeout large enough to make this unlikely. The default is 30 seconds, but it’s not unreasonable to set it as high as several minutes. The only downside of a larger session timeout is that it will take longer for the coordinator to detect genuine consumer crashes.
```



### 4.1 Consumer Indepth

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html

https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll-long-

#### 4.1.1 跟borker交互

keyword: heartbeat，rebalance

##### consumer groups

Don't Use Apache Kafka Consumer Groups the Wrong Way! https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa
1)	Having consumers as part of the same consumer group means providing the“competing consumers” pattern with whom the messages from topic partitions are spread across the members of the group.
2)	Having consumers as part of different consumer groups means providing the “publish/subscribe” pattern where the messages from topic partitions are sent to all the consumers across the different groups.
https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa

##### 配合事务型producer

**we can indicate with \*isolation.level\* that we should wait to read transactional messages until the associated transaction has been committed**:

```java
consumerProps.put("isolation.level", "read_committed");
```

在消费端有一个参数isolation.level，设置为“read_committed”，表示消费端应用不可以看到尚未提交的事务内的消息。如果生产者开启事务并向某个分区值发送3条消息 msg1、msg2 和 msg3，在执行 commitTransaction() 或 abortTransaction()  方法前，设置为“read_committed”的消费端应用是消费不到这些消息的，不过在 KafkaConsumer  内部会缓存这些消息，直到生产者执行 commitTransaction() 方法之后它才能将这些消息推送给消费端应用。反之，如果生产者执行了  abortTransaction() 方法，那么 KafkaConsumer 会将这些缓存的消息丢弃而不推送给消费端应用。

https://stackoverflow.com/questions/56047968/kafka-isolation-level-implications

##### 关键API

###### POLL

```
public ConsumerRecords<K,V> poll(long timeout)
```

The poll API returns fetched records based on the current position. 

On each poll, consumer will try to use the last consumed offset as the starting offset and fetch sequentially. The last consumed offset can be manually set through [`seek(TopicPartition, long)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#seek-org.apache.kafka.common.TopicPartition-long-) or automatically set as the last committed offset for the subscribed list of partitions 即如果不显示调用 seek来设置其位置，将会自动使用interal offset来定位其最后一次消费的位置。

更完整的：

When the group is **first created**, the position will be set according to the reset policy (which is typically either set to the earliest or latest offset for each partition defined by the auto.offset.reset). Once the consumer begins committing offsets, then each **later rebalance** will reset the position to the last committed offset. The parameter passed to poll controls the maximum amount of time that the consumer will block while it awaits records at the current position. The consumer returns immediately as soon as any records are available, but it will wait for the full timeout specified before returning if nothing is available.

注意：只是subscribe topic并不能立即引发rebalance，可以在subscribe之后poll，从而立即引发rebalance：

https://stackoverflow.com/questions/38754865/kafka-pattern-subscription-rebalancing-is-not-being-triggered-on-new-topic/66758840#66758840

https://cwiki.apache.org/confluence/display/KAFKA/KIP-568%3A+Explicit+rebalance+triggering+on+the+Consumer

**consumer poll timeout**

> The way consumers maintain membership in a consumer group and ownership of the partitions assigned to them is by sending *heartbeats* to a Kafka broker designated as the *group coordinator* (this broker can be different for different consumer groups). As long as the consumer is sending heartbeats at regular intervals, it is assumed to be alive, well, and processing messages from its partitions. Heartbeats are sent when the consumer polls (i.e., retrieves records) and when it commits records it has consumed.
>
> https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153/ch04.html

TIMEOUTS IN KAFKA CLIENTS AND KAFKA STREAMS http://javierholguera.com/2018/01/01/timeouts-in-kafka-clients-and-kafka-streams/

###### ConsumerRebalanceListener 

onPartitionsRevoked && onPartitionsAssigned

> It is guaranteed that all the processes in a consumer group will execute their [`onPartitionsRevoked(Collection)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/ConsumerRebalanceListener.html#onPartitionsRevoked-java.util.Collection-) callback before any instance executes its [`onPartitionsAssigned(Collection)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/ConsumerRebalanceListener.html#onPartitionsAssigned-java.util.Collection-) callback. 

发生rebalance时，kafka会保证所有之前的consumer无法继续消费消息（连heartbeat都停止了，提示消息 Attempt to heartbeat failed since group is rebalancing），然后会先通过 onPartitionsRevoked 回调所有的consumer，待所有consumer的onPartitionsRevoked完成之后，才会继续回调onPartitionsAssigned（笔者测试到一种情况，就是consumergroup有服务A和B，A因为网络问题，导致kafka集群决定将所有partition分配给B，所以kafka集群发送revoke给A和B，因为A有网络问题，B就没有等待A完成revoke，直接启动了，而过了两分钟，A才收到kafka集群的消息，后面exactly once笔者给出了场景图示）

#### 4.1.2 依赖internal offset

直接poll，不通过 seek来设置位置，自动使用interal offset来定位其最后一次消费的位置，注意下面的前两个使用方法 at-least-once 至少一次当然可能会重复消费，**但是也可能丢失信息**

##### 自动提交offset，at-least-once

Setting `enable.auto.commit` **means that offsets are committed automatically with a frequency controlled by** the config `auto.commit.interval.ms`. 

```
  Properties props = new Properties();
     props.put("bootstrap.servers", "localhost:9092");
     props.put("group.id", "test");
     props.put("enable.auto.commit", "true");
     props.put("auto.commit.interval.ms", "1000");
     props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
     props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
     KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
     consumer.subscribe(Arrays.asList("foo", "bar"));
     while (true) {
         ConsumerRecords<String, String> records = consumer.poll(100);
         for (ConsumerRecord<String, String> record : records)
             System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
     }
```

![](/docs/docs_image/software/buildingblock/kafka/kafka_consumer_position.png)

图中 high waterMark和log end offset是上游producer发布的消息offset，其中high watermark是代表全部replicate结束，所以consumer最多能读取到high watermark位置，last committed log是指consumer消费完之后，自动提交的offset

When a partition gets reassigned to another consumer in the group, the initial position is set to the last committed offset. If the consumer in the example above suddenly crashed, then the group member taking over the partition would begin consumption from offset 1. In that case, it would have to reprocess the messages up to the crashed consumer’s position of 6.

The diagram also shows two other significant positions in the log. The log end offset is the offset of the last message written to the log. The high watermark is the offset of the last message that was successfully copied to all of the log’s replicas. From the perspective of the consumer, the main thing to know is that you can only read up to the high watermark. This prevents the consumer from reading unreplicated data which could later be lost.

##### 手动提交offset，at-least-once

Instead of relying on the consumer to periodically commit consumed  offsets, users can also control when records should be considered as consumed and hence commit their offsets. This  is useful when the consumption of the messages is coupled with some processing logic and hence a message should not be considered as consumed until it is completed processing.  

```
 Properties props = new Properties();
     props.put("bootstrap.servers", "localhost:9092");
     props.put("group.id", "test");
     props.put("enable.auto.commit", "false");
     props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
     props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
     KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
     consumer.subscribe(Arrays.asList("foo", "bar"));
     final int minBatchSize = 200;
     List<ConsumerRecord<String, String>> buffer = new ArrayList<>();
     while (true) {
         ConsumerRecords<String, String> records = consumer.poll(100);
         for (ConsumerRecord<String, String> record : records) {
             buffer.add(record);
         }
         if (buffer.size() >= minBatchSize) {
             insertIntoDb(buffer);
             consumer.commitSync();
             buffer.clear();
         }
     }
```

In this example we will consume a batch of records and batch them up in memory. When we have enough records batched, we will insert them into a database. If we allowed offsets to auto commit as in the previous example, records would be considered consumed after they were returned to the user in [`poll`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll-long-). It would then be possible for our process to fail after batching the records, but before they had been inserted into the database. 

 To avoid this, we will manually commit the offsets only after the corresponding records have been inserted into the database. This gives us exact control of when a record is considered consumed. This raises the opposite possibility: the process could fail in the interval after the insert into the database but before the commit (even though this would likely just be a few milliseconds, it is a possibility). In this case the process that took over consumption would consume from last committed offset and would repeat the insert of the last batch of data. Used in this way Kafka provides what is often called "at-least-once" delivery guarantees, as each record will likely be delivered one time but in failure cases could be duplicated. 

**上面at-least-once 也不是绝对的，也可能丢数据(nothing to guarantee)：**

**Note: Using automatic offset commits can also give you "at-least-once" delivery, but the requirement is that you must consume all data returned from each call to [`poll(long)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll-long-) before any subsequent calls, or before [`closing`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#close--) the consumer. If you fail to do either of these, it is possible for the committed offset to get ahead of the consumed position, which results in missing records. The advantage of using manual offset control is that you have direct control over when a record is considered "consumed."**



 The above example uses [`commitSync`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#commitSync--) to mark all received records as committed. In some cases you may wish to have even finer control over which records have been committed by specifying an offset explicitly. In the example below we commit offset after we finish handling the records in each partition. 

 

```
     try {
         while(running) {
             ConsumerRecords<String, String> records = consumer.poll(Long.MAX_VALUE);
             for (TopicPartition partition : records.partitions()) {
                 List<ConsumerRecord<String, String>> partitionRecords = records.records(partition);
                 for (ConsumerRecord<String, String> record : partitionRecords) {
                     System.out.println(record.offset() + ": " + record.value());
                 }
                 long lastOffset = partitionRecords.get(partitionRecords.size() - 1).offset();
                 consumer.commitSync(Collections.singletonMap(partition, new OffsetAndMetadata(lastOffset + 1)));
             }
         }
     } finally {
       consumer.close();
     }
Note: The committed offset should always be the offset of the next message that your application will read. Thus, when calling commitSync(offsets) you should add one to the offset of the last message processed. 
```

##### 手动提交 exactly-once

参考后面的 atomic-read-process-write例子

#### 4.1.3 不依赖interal offset，自己维护offset exactly-once

The consumer application need not use Kafka's built-in offset storage, it can store offsets in a store of its own choosing, example usage:

+ If the results of the consumption are being stored in a relational database, storing the offset in the database as well can allow committing both the results and offset in a single transaction. Thus either the transaction will succeed and the offset will be updated based on what was consumed or the result will not be stored and the offset won't be updated. 
+ If the results are being stored in a local store it may be possible to store the offset there as well. For example a search index could be built by subscribing to a particular partition and storing both the offset and the indexed data together. If this is done in a way that is atomic, it is often possible to have it be the case that even if a crash occurs that causes unsync'd data to be lost, whatever is left has the corresponding offset stored as well. This means that in this case the indexing process that comes back having lost recent updates just resumes indexing from what it has ensuring that no updates are lost. 

比如存储offset到自己维护的一个topic T-SNP 作为增量数据主题

消费时：

Configure `enable.auto.commit=false` 

因为每条record 都携带其offset信息根据后面的 atomic-read-process-write模型，将write和mark read（Use the offset provided with each [`ConsumerRecord`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/ConsumerRecord.html) to save your position）作为一个transaction提交；

启动或“重启”时：

则找到最后一个消息，即存储的最后一个offset，方法:

endOffsets（返回the offset of the upcoming message, i.e. the offset of the last available message + 1. 所以-1就是到了last available message的位置，还要再-1才能再后面poll到这条消息） --> assign ---> seek（不能用seekToEnd，用了则poll不到任何消息，只能等待新消息） ---> poll

，然后通过获取的offset定位恢复restore到上一次这个topic的position处理位置 [`seek(TopicPartition, long)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#seek-org.apache.kafka.common.TopicPartition-long-)，然后再poll

注意：

+ 如果想要zombie fence生效，除了用对transaction.id，这个顺序也很重要，要先去initTransaction注册 transaction.id（形象的说就是争取到合法身份先），然后才是去restore（读取增量快照做恢复），否则，如果你先去restore，再去注册（创建Transactional Producer并initTransactions），有可能restore的时候读取到增量快照是 1000，但是根据我后面在4.3小节提供的流程图，旧的disruptorProducer仍然可以继续写入kafka（之前曾经遇到过一次disruptor ringbuffer在rebalance之后继续工作重复落库的事情，相同的原理），因此等到 去注册（争取合法身份）的时候，增量快照可能已经到了2000，然后因为你先做的restore，你会定位到1000，将1001开始的都当做新消息：

  每个consumer group中的服务rebalance的正确启动顺序应该是：
  1. 先根据 kafka分配的partition创建好worker（主要是Transactional Producer），这个做完后，会立即让fence生效，不用再担心 其他服务上仍在等待shutdown的disruptorWorker继续消费ringbuffer的缓存消息
  2. 读取增量快照进行restore，由于第1步做完，我们完全相信kafka可以履行zombie fence，所以这里可以100%确定可以拿到准确的 last offset，从而准确的恢复

+ 有一个缺点是，虽然我们启动时可以判断，比如[0,1000]是之前处理过的，1001开始是新的数据，但是为了使内存恢复到之前的状态，仍然需要对[0,1000]这个区间的数据进行计算（只不过不进行任何事务处理比如落数据库，只是单纯为了restore memory），所以一个改进策略就是，增加全量快照，系统停止之前或定期将内存序列化存起来，注意存的时候同时存下当时的offset，比如1000，然后在增量快照中记录下这个全量快照的位置（当然还有我们要保存的offset）即可，由于为了记录下全量快照的kafka位置，需要等待kafka send的回调，所以记录到增量快照没有办法跟保存全量快照作为一个事务处理，不过没关系：

  比如主题T-TARGET ，现在处理到了offset=1000，决定做一次全量快照，此时全量快照中保存下内存状态和start offset=1000，kafka send全量快照到 T-QuanLiang中，然后在callback时，可以获取到全量快照在T-QuanLiang的 quanliang offset比如=0，T-TARGET进来新的消息（或者之前做全量快照的指令本身就是条消息），继续事务性的记录增量快照 T-ZengLiang，此时最新记录的增量消息的内容是 quanliang offset=0&&end offset=1001

  恢复的时候，先 找到T-ZengLiang最后一个消息 ，获取到quanliang offset=0&&end offset=1001，然后通过quanliang offset=0去seek(T-QuanLiang, 0) 拿到 start offset=1000和当时的内存数据，从而恢复内存数据，然后从1000开始(1000,1001],只需要重新计算下1001这条数据更新下内存即可，从1002开始往后都是新的消息





### 4.2 Producer Indepth

Since the 0.11.0.0 release, Kafka has added support to allow its producers to send messages to different topic partitions in a transactional and idempotent manner https://kafka.apache.org/documentation/#semantics

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html

#### 4.2.1 跟broker交互

##### 关键配置

acks=all

if the producer receives an  acknowledgement (ack) from the Kafka broker and acks=all, it means that  the message has been written exactly once to the Kafka topic

##### 关键API

initTransactions

> The following steps will be taken when initTransactions() is called:
>
> 1. If no TransactionalId has been provided in configuration, skip to step 3.
> 2. Send a [FindCoordinatorRequest](https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit#heading=h.97qeo7mkx9jx) with the configured TransactionalId and with CoordinatorType encoded as “transaction” to a random broker. Block for the corresponding response, which will return the assigned transaction coordinator for this producer.
> 3. Send an [InitPidRequest](https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit#heading=h.z99xar1h2enr) to the transaction coordinator or to a random broker if no TransactionalId was provided in configuration. Block for the corresponding response to get the returned PID.
>
> https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit
>
> ### 2. Getting a producer Id -- the InitPidRequest
>
> After discovering the location of its coordinator, the next step is to retrieve the producer’s PID. This is achieved by issuing a InitPidRequest to the transaction coordinator
>
> #### 2.1 When an TransactionalId is specified
>
> If the transactional.id configuration is set, this TransactionalId passed along with the InitPidRequest, and the mapping to the corresponding PID is logged in the transaction  log in step 2a. This enables us to return the same PID for the  TransactionalId to future instances of the producer, and hence enables  recovering or aborting previously incomplete transactions.
>
> In addition to returning the PID, the InitPidRequest performs the following tasks:
>
> 1. Bumps up the epoch of the PID, so that the any previous zombie instance of  the producer is fenced off and cannot move forward with its transaction.
> 2. Recovers (rolls forward or rolls back) any transaction left incomplete by the previous instance of the producer.
>
> The handling of the InitPidRequest is synchronous. Once it returns, the producer can send data and start new transactions.
>
> https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging



#### 4.2.2 幂等性 idempotent producer

https://cwiki.apache.org/confluence/display/KAFKA/Idempotent+Producer

Idempotent producer ensures **exactly once message delivery per partition**

> To enable idempotence, the enable.idempotence configuration must be set  to true. If set, the retries config will be defaulted to  Integer.MAX_VALUE, the max.in.flight.requests.per.connection config will be defaulted to 1, and acks config will be defaulted to all. There are  no API changes for the idempotent producer, so existing applications  will not need to be modified to take advantage of this feature.

简单说幂等性就是，当发生网络异常或者其他情况时，producer会重试，但是kafka集群会保证消息不重复，重试某条信息1万次即使全部成功，kafka集群也只会保存一条信息，

设置 enable.idempotence=true 即可，

**尽量不要设置retries这个配置参数，使用默认的最大值即可，不然可能会丢失数据**，如果显示设置了retries就一定要设置 max.in.flight.requests.per.connection=1，不然可能会乱序

Setting a value greater than zero will cause the client to resend any record whose send fails with a potentially transient error. Note that this retry is no different than if the client resent the record upon receiving the error. Allowing retries without setting  MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1 will potentially change the ordering of records because if two batches are sent to a single partition, and the first fails and is retried but the second succeeds, then the records in the second batch may appear first.

https://stackoverflow.com/questions/55192852/transactional-producer-vs-just-idempotent-producer-java-exception-outoforderseq/66579532#66579532



How does this feature work? Under the  covers, it works in a way similar to TCP: each batch of messages sent to Kafka will contain a sequence number that the broker will use to dedupe any duplicate send. Unlike TCP, though—which provides guarantees only  within a transient in-memory connection—this sequence number is  persisted to the replicated log, so even if the leader fails, any broker that takes over will also know if a resend is a duplicate. The overhead of this mechanism is quite low: it’s just a few extra numeric fields  with each batch of messages. As you will see later in this article, this feature adds negligible performance overhead over the non-idempotent  producer.

#### 4.2.3 事务性 Transactional Producer 

https://www.cnblogs.com/luozhiyun/p/12079527.html

https://tgrez.github.io/posts/2019-04-13-kafka-transactions.html

**Powers the applications to produce to multiple TopicPartitions atomically.** All writes to these TopicPartitions will either succeed or fail as a single unit. The application must provide a unique id, TransactionalId, to the producer which is stable across all sessions of the application. There is a 1-1 mapping between TransactionalId and PID.



依据：

**org.apache.kafka.clients.producer.ProducerConfig.TRANSACTIONAL_ID_CONFIG**

```
    For instance, in a distributed stream processing application, suppose topic-partition tp0 was originally processed by transactional.id T0. If, at some point later, it could be mapped to another producer with transactional.id T1, there would be no fencing between T0 and T1. So it is possible for messages from tp0 to be reprocessed, violating the exactly once processing guarantee.

    Practically, one would either have to store the mapping between input partitions and transactional.ids in an external store（存储每个partition和这个transactional.id的map）, or have some static encoding of it（设置为静态的变量，比如the transactionId Prefix appended with <group.id>.<topic>.<partition>.The drawback is that it will require separate transactional producer for each partition）.
-- https://www.confluent.io/blog/transactions-apache-kafka/

2.1.11 Transactional Id When a transaction is started by the listener container, the transactional.id is now the transactionIdPrefix appended with <group.id>.<topic>.<partition>. This is to allow proper fencing of zombies as described here.
-- https://docs.spring.io/spring-kafka/reference/#transactional-id
```

**initTransactions**

```
Needs to be called before any other methods when the transactional.id is set in the configuration. This method does the following: 
1. Ensures any transactions initiated by previous instances of the producer with the same transactional.id are completed. If the previous instance had failed with a transaction in progress, it will be aborted. If the last transaction had begun completion, but not yet finished, this method awaits its completion. 

2. Gets the internal producer id and epoch, used in all future transactional messages issued by the producer. Note that this method will raise TimeoutException if the transactional state cannot be initialized before expiration of max.block.ms. 
Additionally, it will raise InterruptException if interrupted. It is safe to retry in either case, but once the transactional state has been successfully initialized, this method should no longer be used.
```

**beginTransaction / sendOffsetsToTransaction / commitTransaction / abortTransaction**

这些方法都会抛 ProducerFencedException 原理就是调用这些方法之前必须要先调用 initTransactions， initTransactions会分配每个transaction.id新的epoch，从而阻止zombie程序继续发送kafka transaction



代码示例：

```java
-------------------------------------------------------------------
--- 正确：使用固定的 TRANSACTIONAL_ID_CONFIG
-------------------------------------------------------------------
Map<String, Object> configs = new HashMap<>();
configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
configs.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "anyValue");

KafkaProducer<String, String> producer = new KafkaProducer<>(configs);
producer.initTransactions();
producer.beginTransaction();

producer.send(new ProducerRecord<>("Topic-Test", "thisIsMessageKey", "thisIsMessageValue1")).get();
        
KafkaProducer<String, String> producer2 = new KafkaProducer<>(configs);
producer2.initTransactions();
producer2.beginTransaction();

producer2.send(new ProducerRecord<>("Topic-Test", "thisIsMessageKey", "thisIsMessageValue2")).get();

producer2.commitTransaction();

# ./bin/kafka-dump-log.sh --files ./kafka-logs/Topic-Test-0/00000000000000000192.log --print-data-log
Starting offset: 0
offset: 0 ... producerId: 0 producerEpoch: 5 ... payload: thisIsMessageValue1
offset: 1 ... producerId: 0 producerEpoch: 6 ... endTxnMarker: ABORT coordinatorEpoch: 0
offset: 2 ... producerId: 0 producerEpoch: 7 ... payload: thisIsMessageValue2
offset: 3 ... producerId: 0 producerEpoch: 7 ... endTxnMarker: COMMIT coordinatorEpoch: 0
    
In such scenario, second producer tries to initiate transactions for the same transactional id. This results in ABORT marker written directly into the partition, together with data.
-------------------------------------------------------------------
--- 错误：使用不固定的 TRANSACTIONAL_ID_CONFIG
-------------------------------------------------------------------
...
configs.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "differentValue");
KafkaProducer<String, String> producer2 = new KafkaProducer<>(configs);
producer2.initTransactions();
...

# ./bin/kafka-dump-log.sh --files ./kafka-logs/Topic-Test-0/00000000000000000192.log --print-data-log
Starting offset: 0
offset: 0 ... producerId: 0 producerEpoch: 0 ... payload: thisIsMessageValue1
offset: 1 ... producerId: 1 producerEpoch: 0 ... payload: thisIsMessageValue2
offset: 2 ... producerId: 1 producerEpoch: 0 ... endTxnMarker: COMMIT coordinatorEpoch: 0

There is no ABORT marker, so first producer could still commit its transaction. Epoch numbers are not incremented.
    
-------------------------------------------------------------------
--- 实际项目代码
-------------------------------------------------------------------
ProducerConfig.java:
public Properties prepareFor(String transactionId) {
        Properties result = new Properties();
        properties.stringPropertyNames().forEach(name -> result.put(name, properties.getProperty(name)));
        if (StringUtils.hasText(transactionId)) {
            result.put(org.apache.kafka.clients.producer.ProducerConfig.TRANSACTIONAL_ID_CONFIG, transactionId);
        }
        return result;
    }

String transactionId = partition-id >= 0 ? String.format("%s-TID-%d", config.getApplicationName(), partition-id) : "TID";
this.rawProducer = new KafkaProducer<>(config.prepareFor(transactionId));
this.rawProducer.initTransactions();
```

如果出现

```
org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with 
an old epoch. Either there is a newer producer with the same transactionalId, or the producer's 
transaction has been expired by the broker.
```



### 4.3 Exactly-Once

#### 4.3.1 Exactly-Once-Message-Processing

> there are only two hard problems in distributed systems: 
>
> 1. Guaranteed order of messages 
> 2. Exactly-once delivery

https://www.confluent.io/online-talk/introducing-exactly-once-semantics-in-apache-kafka/

https://www.confluent.io/blog/transactions-apache-kafka/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging

https://blog.csdn.net/alex_xfboy/article/details/82988259

KIP-129: Streams Exactly-Once Semantics https://cwiki.apache.org/confluence/display/KAFKA/KIP-129%3A+Streams+Exactly-Once+Semantics

**重点：**

+ Producer：

  开启幂等enable.idempotence和事务 transactional.id，并维护offset

+ Consumer：

  设置isolation.level=read_committed（配合事务型Producer）

+ 跟 kafka borker交互：

  consumer根据kafka broker的rebalance来为每个partition创建producer，事务型 producer通过initTransaction操作来fence zombie（仍然是依靠kafka broker），从而屏蔽掉其他过时的producer（rebalance过程中被收回了partition的consumer之前所创建的producer）消费消息的可能性，然后consumer可以放心的restore



The first generation of stream  processing applications could tolerate inaccurate processing. For  instance, applications which consumed a stream of web page impressions  and produced aggregate counts of views per web page could tolerate some  error in the counts. 

However, the demand for stream  processing applications with stronger semantics has grown along with the popularity of these applications. For instance, some financial  institutions use stream processing applications to process debits and  credits on user accounts. In these situations, there is no tolerance for errors in processing: we need every message to be processed exactly  once, without exception.



从某个Topic的某个Partition的数据流看 atomic read-process-write pattern（对于使用kafka stream 的应用来说就是 consume-transform-produce）：

More formally, if a stream processing application consumes message *A* and produces message *B* such that *B = F(A)*, then exactly  once processing means that *A* is considered consumed if and only if *B* is successfully produced, and vice versa.

message *A* will be considered consumed from topic-partition *tp0* only when its offset *X* is marked as consumed. Marking an offset as consumed is called *committing an offset.* In Kafka, we record offset commits by writing to an internal Kafka topic called the *offsets topic*. A message is considered consumed only when its offset is committed to the offsets topic

Thus since an offset commit is just  another write to a Kafka topic, and since a message is considered  consumed only when its offset is committed, atomic writes across  multiple topics and partitions also enable atomic read-process-write  cycles: the commit of the offset *X* to the offsets topic and the write of message *B* to *tp1* will be part of a single transaction, and hence atomic.

设计：

每个application订阅一个主题，创建一个KafkaConsumer，发生rebalance之后根据分配的partition，每个partition都创建一个Transactional KafkaProducer

1.上游KafkaProducer：

+ 保证不会重复发送：

  1) retry 重发场景：The producer.send() could result in duplicate writes of message *B* due to internal retries. 

  解决方法：This is addressed by the idempotent producer: enable.idempotence=true

  2) Reprocessing may happen if the stream processing application crashes after writing *B* but before marking *A* as consumed. Thus when it resumes, it will consume *A* again and write *B* again, causing a duplicate. 

  解决方法：使用transaction，将 write B和mark A consumed（self main consumer offset on kafka topic partition）作为一个transaction

  3) 挂起后又恢复场景，applications will crash  or—worse!—temporarily lose connectivity to the rest of the system.  Typically, new instances are automatically started to replace the ones  which were deemed lost. Through this process, we may have multiple  instances processing the same input topics and writing to the same  output topics, causing duplicate outputs and violating the exactly once  processing semantics. We call this the problem of “zombie instances.”

  比如Producer发送Kafka消息（commitTransaction之前）突然挂起，然后transaction.id被新起的Producer占用，当之前的Producer又恢复的时候再commitTransaction会被Fence屏蔽掉，并且KafkaConsumer的read_committed隔离级别也可以保证不读取这些尚未提交的事务消息（The Kafka consumer will only deliver  transactional messages to the application if the transaction was  actually committed. Put another way, the consumer will not deliver  transactional messages which are part of an open transaction, and nor  will it deliver messages which are part of an aborted transaction.

  when using a Kafka consumer to consume  messages from a topic, an application will not know whether these  messages were written as part of a transaction, and so they do not know  when transactions start or end. 

  In short: Kafka guarantees that a  consumer will eventually deliver only non-transactional messages or  committed transactional messages. It will withhold messages from open  transactions and filter out messages from aborted transactions.）

  解决方法：通过 transaction.id 进行 zombie Fence

  4）consumer group中多个服务发生rebalance后重启的场景：服务A处理Paritition 0和1，然后服务B进入引起rebalance，分配结果为B接管Partition 0，当B创建KafkaProducer处理partition 0时，首先要定位到partition 0之前被处理到哪里了，这种场景仍然是先使用 Transaction.id进行zombie fence，以防服务A的处理Partition 0的kafkaproducer还在工作（比如使用了disruptor有ringbuffer缓存，即使没有用disruptor这种东西，由于A和B是两个独立的进程，B也无法保证A的kafka producer没有继续再处理某条消息，所以先小人后君子），然后才读取offset，定位到之前A在Partition 0成功提交的最后一条消息（换句话就是被zombie fence之前成功的最后一条消息）

+ 保证不漏发：
  + KafkaProducer需要使用幂等性，并且千万不要设置 ETRIES_CONFIG = "retries"，使用默认的Integer.MAX_VALUE
  + 首先上游不要漏掉处理某个信息，此时如果上游的角色就是kafkaConsumer，问题进一步分解为：
    + 上游不要漏掉某条kafka消息，这个完全由kafka保证
    + 收到kafka消息后，处理到发送给下游的过程不要“漏”，即这个过程要保证鲁棒性和一致性
  + 其次处理完后调用kafkaProducer接口send给下游，这个调用完全是kafka来保证不会漏

2.下游KafkaConsumer：

+ 保证不要重复处理：

  + 默认这个是由kafka offset来控制，_consumer_offset，但是在某些场景下使用 _consumer_offset 会有问题：

    比如KafkaConsumer处理数据的过程包括作为KafkaProducer继续往下游发送消息，那么可以通过KafkaProducer的transaction处理，同时发送一个增量快照保存起当前的offset，这样就可以脱离开系统默认的__consumer_offset

  + 另外一个比较隐含的场景就是上游出了问题，参考上游的场景3）和4）

+ 保证不要丢失消息：

  1）不要使用 auto commit，因为调用poll之后，消息offset可能已经被自动提交，但是此时如果没有处理完程序崩溃，再启动就会丢失消息；

  而是采用 atomic read-process-write模型，将write和Mark read作为一个transaction，这样不会出现前面的： 消息被标记为已读，但是还没处理完程序崩溃，重启之后丢失的问题；

  2）一旦producer成功将事务型的消息或非事务型的消息发送给了kafka（成功调用send api或commit transaction），接下来就是kafka的集群来保证消息不会丢掉了（比如关于replication high watermark）

![](/docs/docs_image/software/buildingblock/kafka/kafka_exactly_once01.png)

如图中所示，solution A不完美，因为解决不了服务A因为网络跟kafka集群断开又恢复的场景下有可能在极短的时间窗口发生的重复消费问题，solution B是最完美的设计，充分利用了kafka的exactly once能力

![](/docs/docs_image/software/buildingblock/kafka/kafka_exactly_once02.png)

example 1：

```
public class KafkaTransactionsExample {
  
  public static void main(String args[]) {
    KafkaConsumer<String, String> consumer = new KafkaConsumer<>(consumerConfig);
 
 
    // Note that the ‘transactional.id’ configuration _must_ be specified in the
    // producer config in order to use transactions.
    KafkaProducer<String, String> producer = new KafkaProducer<>(producerConfig);
 
    // We need to initialize transactions once per producer instance. To use transactions,
    // it is assumed that the application id is specified in the config with the key
    // transactional.id.
    //
    // This method will recover or abort transactions initiated by previous instances of a
    // producer with the same app id. Any other transactional messages will report an error
    // if initialization was not performed.
    //
    // The response indicates success or failure. Some failures are irrecoverable and will
    // require a new producer  instance. See the documentation for TransactionMetadata for a
    // list of error codes.
    producer.initTransactions();
     
    while(true) {
      ConsumerRecords<String, String> records = consumer.poll(CONSUMER_POLL_TIMEOUT);
      if (!records.isEmpty()) {
        // Start a new transaction. This will begin the process of batching the consumed
        // records as well
        // as an records produced as a result of processing the input records.
        //
        // We need to check the response to make sure that this producer is able to initiate
        // a new transaction.
        producer.beginTransaction();
         
        // Process the input records and send them to the output topic(s).
        List<ProducerRecord<String, String>> outputRecords = processRecords(records);
        for (ProducerRecord<String, String> outputRecord : outputRecords) {
          producer.send(outputRecord);
        }
         
        // To ensure that the consumed and produced messages are batched, we need to commit
        // the offsets through
        // the producer and not the consumer.
        //
        // If this returns an error, we should abort the transaction.
         
        sendOffsetsResult = producer.sendOffsetsToTransaction(getUncommittedOffsets());
         
      
        // Now that we have consumed, processed, and produced a batch of messages, let's
        // commit the results.
        // If this does not report success, then the transaction will be rolled back.
        producer.endTransaction();
      }
    }
  }
}
```



example 2：

```
KafkaProducer producer = createKafkaProducer(
  “bootstrap.servers”, “localhost:9092”,
  “transactional.id”, “my-transactional-id”);

producer.initTransactions();

KafkaConsumer consumer = createKafkaConsumer(
  “bootstrap.servers”, “localhost:9092”,
  “group.id”, “my-group-id”,
  "isolation.level", "read_committed");

consumer.subscribe(singleton(“inputTopic”));

while (true) {
  ConsumerRecords records = consumer.poll(Long.MAX_VALUE);
  producer.beginTransaction();
  for (ConsumerRecord record : records)
    producer.send(producerRecord(“outputTopic”, record));
  producer.sendOffsetsToTransaction(currentOffsets(consumer), group);  
  producer.commitTransaction();
}
```

#### 4.3.2 Exactly-Once-Stream-Processsing

or stream processing applications built  using Kafka’s Streams API, we leverage the fact that the source of truth for the state store and the input offsets are Kafka topics. Hence we  can transparently fold this data into transactions that atomically write to multiple partitions, and thus provide the exactly-once guarantee for streams across the read-process-write operations.

```
processing.guarantee=exactly_once

Note that exactly-once semantics is guaranteed within the scope of Kafka Streams’ internal processing only; for example, if the event streaming app written in Streams makes an RPC call to update some remote stores, or if it uses a customized client to directly read or write to a Kafka topic, the resulting side effects would not be guaranteed exactly once. 
```

### 4.4 Diving into Kafka

前面4.1 4.2 4.3 主要是将kafka当做黑盒，然后通过kafka开放的API来达到跟kafka交互的exactly-once，

但是kafka本身的很多细节也会影响到使用性能甚至是可用性，所以还需要深入kafka，了解比如：

副本 replication 等细节

https://www.cnblogs.com/luozhiyun/p/12079527.html

#### leader epoch & high watermark

Kafka is a highly available, persistent, durable system where every message written to a partition is persisted  and replicated some number of times (we will call it *n*). As a result, Kafka can tolerate *n-1* broker failures, meaning that a partition is available as long as there is at least one broker available. Kafka’s replication protocol  guarantees that once a message has been written successfully to the  leader replica, it will be replicated to all available replicas. 

https://rongxinblog.wordpress.com/2016/07/29/kafka-high-watermark/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-101+-+Alter+Replication+Protocol+to+use+Leader+Epoch+rather+than+High+Watermark+for+Truncation
Kafka数据丢失及最新改进策略 http://lday.me/2017/10/08/0014_kafka_data_loss_and_new_mechanism/
kafka ISR设计及水印与leader epoch副本同步机制深入剖析-kafka 商业环境实战 https://juejin.im/post/5bf6b0acf265da612d18e931
leader epoch与watermark https://www.cnblogs.com/huxi2b/p/7453543.html
High watermark
If you want to improve the reliability of the data, set the request.required.acks = -1, but also min.insync.replicas this parameter (which can be set in the broker or topic level) to achieve maximum effectiveness. 
https://medium.com/@mukeshkumar_46704/in-depth-kafka-message-queue-principles-of-high-reliability-42e464e66172

#### Consumer coordinator & Group coordinator & Rebalance

https://matt33.com/2017/10/22/consumer-join-group/

https://cloud.tencent.com/developer/news/19958

> While the old consumer depended on Zookeeper for group management, the new consumer uses a group coordination protocol built into Kafka itself. For each group, one of the brokers is selected as the *group coordinator*. The coordinator is responsible for managing the state of the group. Its main job is to mediate partition assignment when new members arrive, old members depart, and when topic metadata changes. The act of reassigning partitions is known as *rebalancing* the group.
>
> https://www.confluent.io/blog/tutorial-getting-started-with-the-new-apache-kafka-0-9-consumer-client/

keyword: 

+ GroupCoordinator  服务端 borker（Kafka 会依据请求的 group 的 ID 查找对应 offset topic [__consumer_offsets?]分区 leader 副本所在的 broker 节点：__

  每个 Group 都会选择一个 Coordinator 来完成自己组内各 Partition 的 Offset 信息，选择的规则如下： 1. 计算 Group 对应在 __consumer_offsets` 上的 `Partition 2. 根据对应的Partition寻找该Partition的leader所对应的Broker，该Broker上的Group Coordinator即就是该Group的Coordinator）

+ ConsumerCoordinator 

+ Consumer leader/follower 第一个申请加入group的consumer作为leader，在服务端确定好分区分配策略之后，具体执行分区分配的工作则交由 leader 消费者负责，并在完成分区分配之后将分配结果反馈给服务端

https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Client-side+Assignment+Proposal

https://www.zhenchao.org/2019/06/25/kafka/kafka-group-coordinator/

在 kafka-0.10 版本，Kafka 在**服务端引入了组协调器(GroupCoordinator)**，每个 Kafka Server 启动时都会创建一个 GroupCoordinator 实例，**用于管理部分消费者组和该消费者组下的每个消费者的消费偏移量**。同时**在客户端引入了消费者协调器(ConsumerCoordinator)**，实例化一个消费者就会实例化一个 ConsumerCoordinator 对象，ConsumerCoordinator **负责同一个消费者组下各消费者与服务端的 GroupCoordinator 进行通信**。

##### 客户端-消费者协调器(ConsumerCoordinator)

To control this assignment, users can either write an implementation of the [`PartitionAssignor`](https://github.com/apache/kafka/blob/2.2/clients/src/main/java/org/apache/kafka/clients/consumer/internals/PartitionAssignor.java) interface or use one of the three provided implementations (configured through the `partition.assignment.strategy` config):

- [`RangeAssignor`](https://github.com/apache/kafka/blob/b6d1450012734a841fdf85400636593092cf7e2b/clients/src/main/java/org/apache/kafka/clients/consumer/RangeAssignor.java#L29): For each topic, divide its partitions by the number of consumers subscribed to it and assign X to each (lexicographically sorted) consumer. If it does not evenly divide, the first consumers will have more partitions.
- [`RoundRobinAssignor`](https://github.com/apache/kafka/blob/2.2/clients/src/main/java/org/apache/kafka/clients/consumer/RoundRobinAssignor.java): Assign all partitions from all the subscribed topics to each consumer sequentially, one by one.
- [`StickyAssignor`](https://github.com/apache/kafka/blob/2.2/clients/src/main/java/org/apache/kafka/clients/consumer/StickyAssignor.java): Assign partitions so that they are distributed as evenly as possible. During rebalances, partitions stay with their previously assigned consumers as much as possible.

Additionally, the `PartitionAssignor` interface exposes a `metadata()` method. Every consumer in the group can use this method to send generic metadata about itself to the broker when joining a group. Once a rebalance is in the works, every consumer’s metadata is propagated to the group leader. This enables the leader to make a well-informed decision about assigning partitions (e.g., by considering a consumer application’s datacenter rack).

```java
public class KafkaConsumer<K, V> implements Consumer<K, V> {
    private final ConsumerCoordinator coordinator;
}
public final class ConsumerCoordinator extends AbstractCoordinator {
    private final List<PartitionAssignor> assignors;
    private final OffsetCommitCallback defaultOffsetCommitCallback;
    private final SubscriptionState subscriptions;
    private final ConsumerInterceptors<?, ?> interceptors;
    private boolean isLeader = false;
    private MetadataSnapshot metadataSnapshot;
    private MetadataSnapshot assignmentSnapshot;
    
    省略了部分代码....
}


public abstract class AbstractCoordinator implements Closeable {
    private enum MemberState {
        UNJOINED,    // the client is not part of a group
        REBALANCING, // the client has begun rebalancing
        STABLE,      // the client has joined and is sending heartbeats
    }

    private final Heartbeat heartbeat;
    protected final ConsumerNetworkClient client;
    private HeartbeatThread heartbeatThread = null;
    private MemberState state = MemberState.UNJOINED;
    private RequestFuture<ByteBuffer> joinFuture = null;
    
    省略了部分代码....
}
```

ConsumerCoordinator 是 KafkaConsumer 的一个私有的成员变量，因此 ConsumerCoordinator 中存储的信息也只有与之对应的消费者可见，不同消费者之间是看不到彼此的 ConsumerCoordinator 中的信息的。

ConsumerCoordinator 的作用：

- 处理更新消费者缓存的 Metadata 请求
- 向组协调器发起加入消费者组的请求
- 对本消费者加入消费者前后的相应处理
- 请求离开消费者组(例如当消费者取消订阅时)
- 向组协调器发送提交偏移量的请求
- 通过一个定时的心跳检测任务来让组协调器感知自己的运行状态
- Leader消费者的 ConsumerCoordinator 还负责执行分区的分配，一个消费者组中消费者 leader 由组协调器选出，leader 消费者的 ConsumerCoordinator 负责消费者与分区的分配，然后把分配结果发送给组协调器，然后组协调器再把分配结果返回给其他消费者的消费者协调器，这样减轻了服务端的负担

ConsumerCoordinator 实现上述功能的组件是 ConsumerCoordinator 类的私有成员或者是其父类的私有成员：

![](/docs/docs_image/software/buildingblock/kafka/kafka_consumercoordinator.png)

##### 服务端-组协调器(GroupCoordinator)

```
class GroupCoordinator(
                       val brokerId: Int, // 所属的 broker 节点的 ID
                       val groupConfig: GroupConfig, // Group 配置对象，记录了 group 中 session 过期的最小时长和最大时长，即超时时长的合法区间
                       val offsetConfig: OffsetConfig, // 记录 OffsetMetadata 相关的配置项
                       val groupManager: GroupMetadataManager, // 负责管理 group 元数据以及对应的 offset 信息
                       val heartbeatPurgatory: DelayedOperationPurgatory[DelayedHeartbeat], // 管理 DelayedHeartbeat 延时任务的炼狱
                       val joinPurgatory: DelayedOperationPurgatory[DelayedJoin], // 管理 DelayedJoin 延时任务的炼狱
                       time: Time) extends Logging {

    /** 标识当前 GroupCoordinator 实例是否启动 */
    private val isActive = new AtomicBoolean(false)

    // ... 省略方法定义

}

其中 GroupMetadataManager 类主要用于管理消费者 group 的元数据信息和 offset 相关信息

Kafka 服务在启动时针对每一个 broker 节点都会创建一个 GroupCoordinator 实例，并调用 GroupCoordinator#startup 方法启动运行。GroupCoordinator 在启动时主要是调用了 GroupMetadataManager#enableMetadataExpiration 方法启动 delete-expired-group-metadata 定时任务

定时任务 delete-expired-group-metadata 的主要作用在于从 group 的元数据信息中移除那些已经过期的 topic 分区对应的 offset 元数据，并将这些元数据以消息的形式记录到 offset topic 中，具体执行流程如下：

1.依据当前时间戳计算并获取已经过期的 topic 分区对应的 offset 元数据信息；
2.将状态为 Empty 且名下记录的所有 offset 元数据都已经过期的 group 切换成 Dead 状态；
3.如果 group 已经失效，则从 GroupCoordinator 本地移除对应的元数据信息，并与步骤 1 中获取到的 offset 元数据信息一起封装成消息记录到 offset topic 中。
具体逻辑由 GroupMetadataManager#cleanupGroupMetadata 方法实现


GroupState 特质定义了 group 的状态，并由 GroupCoordinator 进行维护。围绕 GroupState 特质，Kafka 实现了 5 个样例对象，分别用于描述 group 的 5 种状态：

PreparingRebalance ：表示 group 正在准备执行分区再分配操作。
AwaitingSync ：表示 group 正在等待 leader 消费者的分区分配结果，新版本已更名为 CompletingRebalance。
Stable ：表示 group 处于正常运行状态。
Dead ：表示 group 名下已经没有消费者，且对应的元数据已经（或正在）被删除。
Empty ：表示 group 名下已经没有消费者，并且正在等待记录的所有 offset 元数据过期。


```



GroupCoordinator 的作用：

- 负责对其管理的组员(消费者)提交的相关请求进行处理
- 与消费者之间建立连接，并从与之连接的消费者之间选出一个 leader
- 当 leader 分配好消费者与分区的订阅关系后，会把结果发送给组协调器，组协调器再把结果返回给各个消费者
- 管理与之连接的消费者的消费偏移量的提交，将每个消费者的消费偏移量保存到kafka的内部主题中
- 通过心跳检测消费者与自己的连接状态
- 启动组协调器的时候创建一个定时任务，用于清理过期的消费组元数据以及过去的消费偏移量信息

GroupCoordinator 依赖的组件及其作用：

![](/docs/docs_image/software/buildingblock/kafka/kafka_groupcoordinator.png)

- KafkaConfig：实例化 OffsetConfig 和 GroupConfig
- ZkUtils：分消费者分配组协调器时从Zookeeper获取内部主题的分区元数据信息。
- GroupMetadataManager：负责管理 GroupMetadata以及消费偏移量的提交，并提供了一系列的组管理的方法供组协调器调用。GroupMetadataManager 不仅把 GroupMetadata 写到kafka内部主题中，而且还在内存中缓存了一份GroupMetadata，其中包括了组员(消费者)的元数据信息，例如消费者的 memberId、leaderId、分区分配关系，状态元数据等。状态元数据可以是以下五种状态： 
  - PreparingRebalance：消费组准备进行平衡操作
  - AwaitingSync：等待leader消费者将分区分配关系发送给组协调器
  - Stable：消费者正常运行状态，心跳检测正常
  - Dead：处于该状态的消费组没有任何消费者成员，且元数据信息也已经被删除
  - Empty：处于该状态的消费组没有任何消费者成员，但元数据信息也没有被删除，知道所有消费者对应的消费偏移量元数据信息过期。
- ReplicaManager：GroupMetadataManager需要把消费组元数据信息以及消费者提交的已消费偏移量信息写入 Kafka 内部主题中，对内部主题的操作与对其他主题的操作一样，先通过 ReplicaManager 将消息写入 leader 副本，ReplicaManager 负责 leader 副本与其他副本的管理。
- DelayedJoin：延迟操作类，用于监视处理所有消费组成员与组协调器之间的心跳超时
- GroupConfig：定义了组成员与组协调器之间session超时时间配置

##### 消费者协调器和组协调器的交互 -(核心 rebalance)

https://chrzaszcz.dev/2019/06/kafka-rebalancing/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-429%3A+Kafka+Consumer+Incremental+Rebalance+Protocol

https://www.slideshare.net/ConfluentInc/the-silver-bullet-for-endless-rebalancing

![](/docs/docs_image/software/buildingblock/kafka/kafka_rebalance.png)

(1) 心跳

消费者协调器通过和组协调器发送心跳来维持它们和群组的从属关系以及它们对分区的所有权关系。只要消费者以正常的时间间隔发送心跳，就被认为是活跃的，说明它还在读取分区里的消息。消费者会在轮询获取消息或提交偏移量时发送心跳。

如果消费者停止发送心跳的时间足够长，会话就会过期，组协调器认为它已经死亡，就会触发一次再均衡。

在 0.10 版本里，心跳任务由一个独立的心跳线程来执行，可以在轮询获取消息的空档发送心跳。这样一来，发送心跳的频率（也就是组协调器群检测消费者运行状态的时间）与消息轮询的频率（由处理消息所花费的时间来确定）之间就是相互独立的。在0.10 版本的 Kafka 里，可以指定消费者在离开群组并触发再均衡之前可以有多长时间不进行消息轮询，这样可以避免出现活锁（livelock），比如有时候应用程序并没有崩溃，只是由于某些原因导致无法正常运行。这个配置与 session.timeout.ms 是相互独立的，后者用于控制检测消费者发生崩溃的时间和停止发送心跳的时间。

(2) 分区再均衡

发生分区再均衡的3种情况：

- 一个新的消费者加入群组时，它读取的是原本由其他消费者读取的消息。
- 当一个消费者被关闭或发生崩溃时，它就离开群组，原本由它读取的分区将由群组里的其他消费者来读取。如果一个消费者主动离开消费组，消费者会通知组协调器它将要离开群组，组协调器会立即触发一次再均衡，尽量降低处理停顿。如果一个消费者意外发生崩溃，没有通知组协调器就停止读取消息，组协调器会等待几秒钟，确认它死亡了才会触发再均衡。在这几秒钟时间里，死掉的消费者不会读取分区里的消息。
- 在主题发生变化时，比如管理员添加了新的分区，会发生分区重分配。

分区的所有权从一个消费者转移到另一个消费者，这样的行为被称为分区再均衡。再均衡非常重要，它为消费者群组带来了高可用性和伸缩性（我们可以放心地添加或移除消费者），不过在正常情况下，我们并不希望发生这样的行为。在再均衡期间，消费者无法读取消息，造成整个群组一小段时间的不可用。另外，当分区被重新分配给另一个消费者时，消费者当前的读取状态会丢失，它有可能还需要去刷新缓存，在它重新恢复状态之前会拖慢应用程序。

(3) leader 消费者分配分区的策略

当消费者要加入群组时，它会向群组协调器发送一个 JoinGroup 请求。第一个加入群组的消费者将成为leader消费者。leader消费者从组协调器那里获得群组的成员列表（列表中包含了所有最近发送过心跳的消费者，它们被认为是活跃的），并负责给每一个消费者分配分区。

每个消费者的消费者协调器在向组协调器请求加入组时，都会把自己支持的分区分配策略报告给组协调器(轮询或者是按跨度分配或者其他)，组协调器选出该消费组下所有消费者都支持的的分区分配策略发送给leader消费者，leader消费者根据这个分区分配策略进行分配。

完毕之后，leader消费者把分配情况列表发送给组协调器，消费者协调器再把这些信息发送给所有消费者。每个消费者只能看到自己的分配信息，只有leader消费者知道群组里所有消费者的分配信息。这个过程会在每次再均衡时重复发生。

(4) 消费者入组过程

- 消费者创建后，消费者协调器会选择一个负载较小的节点，向该节点发送寻找组协调器的请求

-  KafkaApis 处理请求，调用返回组协调器所在的节点，过程如下：

  ```
  def partitionFor(group: String): Int = groupManager.partitionFor(group)
  https://github.com/a0x8o/kafka/blob/master/core/src/main/scala/kafka/coordinator/group/GroupCoordinator.scala
  =>
  groupId的哈希值的绝对值对 __consumer_offset 这个topic的partition的个数（默认50）取余 得到一个分区的id
  def partitionFor(groupId: String): Int = Utils.abs(groupId.hashCode) % groupMetadataTopicPartitionCount
  https://github.com/a0x8o/kafka/blob/master/core/src/main/scala/kafka/coordinator/group/GroupMetadataManager.scala
  =>
  该分区的leader副本所在的节点就是组协调器所在的节点，该消费组的元数据信息以及消费者消费偏移量信息都会写到__consumer_offset的这个分区中
  ```

  

- 找到组协调器后，消费者协调器申请加入消费组，发送 JoinGroupRequest请求

- KafkaApis 调用 handleJoinGroup() 方法处理请求 

  - 把消费者注册到消费组中
  - 把消费者的clientId与一个UUID值生成一个memberId分配给消费者
  - 构造器该消费者的MemberMetadata信息
  - 把该消费者的MemberMetadata信息注册到GroupMetadata中
  - 第一个加入组的消费者将成为leader

- 把处理JoinGroupRequest请求的结果返回给消费者

- 加入组成功后，进行分区再均衡



#### kafka idempotent 原理

http://matt33.com/2018/10/24/kafka-idempotent/

#### kafka Transaction 原理 Transaction Coordinator and Transaction Log

https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging

The components introduced with the  transactions API in Kafka 0.11.0 are the Transaction Coordinator and the Transaction Log on the right hand side of the diagram above.

The transaction coordinator is a  module running inside every Kafka broker. The transaction log is an  internal kafka topic. Each coordinator owns some subset of the  partitions in the transaction log, ie. the partitions for which its  broker is the leader.

Every transactional.id is mapped to a specific partition of the transaction log through a simple hashing  function. This means that exactly one coordinator owns a given  transactional.id.

This way, we leverage Kafka’s rock  solid replication protocol and leader election processes to ensure that  the transaction coordinator is always available and all transaction  state is stored durably. 

It is worth noting that the transaction log just stores the latest *state* of a transaction and not the actual messages in the transaction. The  messages are stored solely in the actual topic-partitions. The  transaction could be in various states like “Ongoing,” “Prepare commit,” and “Completed.” It is this state and associated metadata that is  stored in the transaction log.

![](/docs/docs_image/software/buildingblock/kafka/kafka_transaction_coordinator.png)

**data flow**

A: the producer and transaction coordinator interaction

When executing transactions, the producer makes requests to the transaction coordinator at the following points:

1. The  initTransactions API registers a transactional.id with the coordinator.  At this point, the coordinator closes any pending transactions with that transactional.id and bumps the epoch to fence out zombies. This happens only once per producer session.
2. When the  producer is about to send data to a partition for the first time in a  transaction, the partition is registered with the coordinator first.
3. When the application calls *commitTransaction* or *abortTransaction,* a request is sent to the coordinator to begin the two phase commit protocol.

B: the coordinator and transaction log interaction

As the transaction progresses, the  producer sends the requests above to update the state of the transaction on the coordinator. The transaction coordinator keeps the state of each transaction it owns in memory, and also writes that state to the  transaction log (which is replicated three ways and hence is durable). 

The transaction coordinator is the  only component to read and write from the transaction log. If a given  broker fails, a new coordinator is elected as the leader for the  transaction log partitions the dead broker owned, and it reads the  messages from the incoming partitions to rebuild its in-memory state for the transactions in those partitions.

C: the producer writing data to target topic-partitions

After registering new partitions in a transaction with the coordinator, the producer sends data to the actual partitions as normal. This is exactly the same *producer.send* flow, but with some extra validation to ensure that the producer isn’t fenced.

D: the coordinator to topic-partition interaction

After the producer initiates a commit (or an abort), the coordinator begins the two phase commit protocol. 

In the first phase, the coordinator  updates its internal state to “prepare_commit” and updates this state in the transaction log. Once this is done the transaction is guaranteed to be committed no matter what. 

The coordinator then begins phase 2, where it writes *transaction commit markers* to the topic-partitions which are part of the transaction. 

These *transaction markers* are not exposed to applications, but are used by consumers in *read_committed* mode to filter out messages from aborted transactions and to not return messages which are part of open transactions (i.e., those which are in  the log but don’t have a *transaction marker* associated with them).

Once the markers are written, the  transaction coordinator marks the transaction as “complete” and the  producer can start the next transaction.

**Performance of the transactional producer**

Let’s turn our attention to how transactions perform. 

First, transactions cause only moderate write amplification. The additional writes are due to: 

1. For each  transaction, we have had additional RPCs to register the partitions with the coordinator. These are batched, so we have fewer RPCs than there  are partitions in the transaction.
2. When  completing a transaction, one transaction marker has to be written to  each partition participating in the transaction. Again, the transaction  coordinator batches all markers bound for the same broker in a single  RPC, so we save the RPC overhead there. But we cannot avoid one  additional write to each partition in the transaction.
3. Finally,  we write state changes to the transaction log. This includes a write for each batch of partitions added to the transaction, the “prepare_commit” state, and the “complete_commit” state. 

As we can see the overhead is independent of the *number* of messages written as part of a transaction. So the key to having  higher throughput is to include a larger number of messages per  transaction.

In practice, for a producer producing 1KB records at maximum throughput, committing messages every 100ms  results in only a 3% degradation in throughput. Smaller messages or  shorter transaction commit intervals would result in more severe  degradation. 

The main tradeoff when increasing the transaction duration is that it increases end-to-end latency. Recall  that a consumer reading transactional messages will not deliver messages which are part of open transactions. So the longer the interval between commits, the longer consuming applications will have to wait,  increasing the end-to-end latency.

**Performance of the transactional consumer**

The transactional consumer is much simpler than the producer, since all it needs to do is:

1. Filter out messages belonging to aborted transactions. 
2. Not return transactional messages which are part of open transactions.

As such, the transactional consumer shows no degradation in throughput when reading transactional messages in *read_committed* mode. The main reason for this is that we preserve zero copy reads when reading transactional messages. 

Further, the consumer does not need  to any buffering to wait for transactions to complete. Instead, the  broker does not allow it to advance to offsets which include open  transactions.



```
[main] [org.apache.kafka.clients.producer.internals.TransactionManager : [Producer clientId=producer-1, transactionalId=TID-PARTITION-0] ProducerId set to -1 with epoch -1
[ad | producer-1] [org.apache.kafka.clients.Metadata : Cluster ID: uEekh0baSnKon5ENwtY9dg
[ad | producer-1] [org.apache.kafka.clients.producer.internals.TransactionManager : [Producer clientId=producer-1, transactionalId=TID-PARTITION-0] ProducerId set to 16871 with epoch 85

```

之前一直困惑于这个 -1 -1，不过因为这三条log全部是org.apache.kafka的，所以刚开始抱着完全信任kafka的想法就先放一边了，后来忍不住大概debug进去瞅了下，确认是kafka正常的设计，第一条log直接就能debug到，step into initTransactions很容易看到，所以意思是默认就会先初始化一个-1 -1，我估计是先给个负值的epoch，等到完全注册好才给后面那个正数的epoch，是合理的，不然还没有注册好事务型的producer，直接给一个合法的epoch，会影响到现在正常工作的其他producer（比如万一因为问题这个新的producer初始化失败也不会影响到/zombie fence使用相同Transaction.id的其他producer）

#### NIO Selector

https://stackoverflow.com/questions/46185430/kafka-source-understanding-the-semantics-of-selector-poll

#### Log Compaction 
https://kafka.apache.org/22/documentation/#compaction
Kafka技术内幕-日志压缩 https://segmentfault.com/a/1190000005312891

Note however that there cannot be more consumer instances(task) in a consumer group than partitions. 
https://cwiki.apache.org/confluence/display/KAFKA/KIP-28+-+Add+a+processor+client

## 5. Troubleshooting

### Fatal error during KafkaServer startup. Prepare to shutdown (kafka.server.KafkaServer)

```
[2019-05-07 21:45:48,648] ERROR [KafkaServer id=0] Fatal error during KafkaServer startup. Prepare to shutdown (kafka.server.KafkaServer)
```

org.apache.kafka.common.KafkaException: Failed to acquire lock on file .lock in /tmp/kafka-logs. A Kafka instance in another process or thread is using this directory.

### UNKOWN_PRDOCUER_ID

got error produce response with correlation id on topic-partition UNKOWN_PRDOCUER_ID

https://stackoverflow.com/questions/51036351/kafka-unknown-producer-id-exception

基本上就是因为过期了

```
log.retention.hours=720
transactional.id.expiration.ms=2073600000

```

### kafka segment.bytes different for each topic

修改了其中一个broker节点的config，忘记同步到所有的节点

### Kafka Client Compatibility

https://spring.io/projects/spring-kafka
org.springframework.kafka org.apache.kafka
https://www.cnblogs.com/wangb0402/p/6187796.html

### Replica factor

```
############################# Internal Topic Settings  #############################
# The replication factor for the group metadata internal topics "__consumer_offsets" and "__transaction_state"                                                                        
# For anything other than development testing, a value greater than 1 is recommended for to ensure availability such as 3.          
offsets.topic.num.partitions = 50 （default）
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=2

kafka-topics.sh -describe --bootstrap-server ip:9092 --topic __consumer_offsets
kafka-topics.sh -describe --bootstrap-server ip:9092 --topic __transaction_state
```



## Reference
+ kafka原理

  + kafka架构/工作方式
    http://www.linkedkeeper.com/detail/blog.action?bid=1016
    https://www.cnblogs.com/qiu-hua/p/13388326.html
    https://blog.csdn.net/qq_37095882/article/details/81024048

    Kafka 数据可靠性深度解读 

    https://www.infoq.cn/article/depth-interpretation-of-kafka-data-reliability
    震惊了！原来这才是kafka！ 

    https://www.jianshu.com/p/d3e963ff8b70

  + kafka stream

    https://github.com/confluentinc/kafka-streams-examples/tree/4.0.0-post

    https://www.confluent.io/blog/building-a-microservices-ecosystem-with-kafka-streams-and-ksql/
    https://www.youtube.com/watch?v=p9wcx3aTjuo
    http://benstopford.com/uploads/CraftMeetup.pdf
    https://kafka.apache.org/documentation/streams/developer-guide/interactive-queries.html
    [Designing Event-Driven Systems Concepts and Patterns for Streaming Services with Apache Kafka --Ben Stopford](https://www.confluent.io/wp-content/uploads/confluent-designing-event-driven-systems.pdf)

    [Building Event Driven Services with Apache Kafka and Kafka Streams by Ben Stopford](https://www.youtube.com/watch?v=p9wcx3aTjuo)

    https://stackoverflow.com/questions/40274884/is-kafka-stream-statestore-global-over-all-instances-or-just-local
    https://stackoverflow.com/questions/52488070/difference-between-ktable-and-local-store
    https://stackoverflow.com/questions/50741186/how-to-filter-out-unnecessary-records-before-materializing-globalktable/50752095#50752095
    https://github.com/confluentinc/kafka-streams-examples/issues/126

  + Consumer

    consumer group:
    https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153/ch04.html
    https://www.confluent.io/blog/apache-kafka-data-access-semantics-consumers-and-membership

    Kafka Consumer设计解析
    http://www.jasongj.com/2015/08/09/KafkaColumn4/

    kafka9重复消费问题解决 

    https://blog.csdn.net/u011637069/article/details/72899915

  + other detail

    partition message ordering:
    https://stackoverflow.com/questions/29820384/apache-kafka-order-of-messages-with-multiple-partitions

    一文看懂Kafka消息格式的演变 

    https://blog.csdn.net/u013256816/article/details/80300225

    consuming and then producing messages based on what you consumed
    https://stackoverflow.com/questions/45195010/meaning-of-sendoffsetstotransaction-in-kafka-0-11

    seek seekToEnd

    https://stackoverflow.com/questions/48395934/how-to-get-last-committed-offset-from-read-committed-kafka-consumer

    assign() vs subscribe()

+ Dev doc

  https://www.tutorialspoint.com/apache_kafka/apache_kafka_quick_guide.htm

  https://kafka.apache.org/20/javadoc/org/apache/kafka/clients/

+ best practice

  https://go.streamsets.com/wc-guide-best-practices-for-simplifying-apache-kafka.html?assetpushed=guide-simplifying-apache-kafka

  https://www.digitalocean.com/community/tutorial_collections/how-to-install-apache-kafka

+ use case

  Kafka实现淘宝亿万级数据统计 https://zhuanlan.zhihu.com/p/58747239

  [How Netflix Handles Data Streams Up to 8M Events/sec](https://www.youtube.com/watch?v=WuRazsX-MBY)

  如何使用Kafka Streams构建广告消耗预测系统  https://mp.weixin.qq.com/s?spm=a2c4e.11153940.blogcont270421.21.7d142e7catwiNO&__biz=MzU1NDA4NjU2MA==&mid=2247486752&idx=1&sn=e9e789c18a6801af12db4c97dcb098e5&chksm=fbe9b4efcc9e3df9cb7d8f666335ed669a7339b27663fc223e5aacfbfa5d2d7404b431b3937d&scene=27#wechat_redirect
  https://medium.com/@Pinterest_Engineering/using-kafka-streams-api-for-predictive-budgeting-9f58d206c996

  Twitter

  Twitter is an online social networking service that provides a  platform to send and receive user tweets. Registered users can read and  post tweets, but unregistered users can only read tweets. Twitter uses  Storm-Kafka as a part of their stream processing infrastructure.

  LinkedIn

  Apache Kafka is used at LinkedIn for activity stream data and  operational metrics. Kafka mes-saging system helps LinkedIn with various products like LinkedIn Newsfeed, LinkedIn Today for online message  consumption and in addition to offline analytics systems like Hadoop.  Kafka’s strong durability is also one of the key factors in connection  with LinkedIn.

  Netflix

  Netflix is an American multinational provider of on-demand Internet  streaming media. Netflix uses Kafka for real-time monitoring and event  processing.

  Mozilla

  Mozilla is a free-software community, created in 1998 by members of  Netscape. Kafka will soon be replacing a part of Mozilla current  production system to collect performance and usage data from the  end-user’s browser for projects like Telemetry, Test Pilot, etc.

  Oracle

  Oracle provides native connectivity to Kafka from its Enterprise  Service Bus product called OSB (Oracle Service Bus) which allows  developers to leverage OSB built-in mediation capabilities to implement  staged data pipelines.


+ products
  https://cwiki.apache.org/confluence/display/KAFKA/Ecosystem

  schema registry https://docs.confluent.io/current/schema-registry/schema_registry_tutorial.html

+ Cheatsheet
  https://gist.github.com/filipefigcorreia/3db4c7e525581553e17442792a2e7489

+ related
https://medium.com/eleven-labs/cqrs-pattern-c1d6f8517314
https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs
https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view

## Presentaion

---

《Introduction to kafka》

1.Basic Concepts
	What’s Kafka
	Why use Kafka
	How it works
2.Exactly once Semantics

What’s Kafka

Apache Kafka is a community distributed streaming platform capable of handling trillions of events a day. 
Initially conceived as a messaging queue, Kafka is based on an abstraction of a distributed commit log. 
Since being created and open sourced by LinkedIn in 2011, 
Kafka has quickly evolved from messaging queue to a full-fledged event streaming platform.

Why use Kafka

Microservice and kafka already became a de-facto industry standard

1.
basicaly kafka is a messaging system, compare to other messaging middleware like the one I used before called rabbit mq, with rabbit mq you can only process once,
after consuming the message, it's removed from the queue.
kafka provides durable storage of messages, sometimes kafka is used as a kind of database.
and now kafka has evolved from messaging queue to full-fleged event streaming platform, we're not using the streaming feature, so today the topic only cover messaging queue.

2.
why do we use kafka

![](/docs/docs_image/software/buildingblock/kafka/kafka21.png)

Let's have a look at architecuture diagram next slides microservices approach vs traditional approach, 
in traditional approach, application stack multiple layers and compononets together as a single unit.
we can see microservice segregates functionalities into a set of autonamous services,so the circle connecting microservices is message queue system.
there are some advantages for microservice approach,
there is no single point of failure, one service broke down doesn't impact other services;
its easier to scale up, all these services are deployed independently, esier to identify the bottle neck and scale up;
from developer standpoint, it can save a lot of time troubleshooting the microservices compared to debug into the traditional application,
micorservice is designed based on single reponsiblity principle, you can find the paticular service responsible for the cause straightforward.

3.

![](/docs/docs_image/software/buildingblock/kafka/kafka22.png)

kafka works like this:
producers publish message to the topics on brokers, the consumers subscribe to the topic will continously poll from the brokers.
in the middle is the brokers, we have 4 brokers, each broker represents one instance of the kafka server, we have 2 topics allocated on the brokers:
topic 1 and topic 2, topic 1 have 2 paritions, topic 2 have 1 parition, each topic has two replications, to publish a message, the producers has to specify 3 params:
the topic name, which partition and the message itself, the messsage will be published on to leader partition, and the followers will replicate from leader,

consumers can join in the same group by config the same application id,
each one partition can be consumed by consumers from different consumer group, but one partition can only be consumed by one consumer in the same consumer group, 
in another word, consumers in the same consumer group load balance the topic partitions, consumers from different consumer group are idenpendent from each other.

4.
one critical concerns is how do we achieve exactly once semantics, how do we guarantee there is no missing or duplicated messages, there is a misconception that 
develop using kafka API will inherently has the capbility to achieve exactly once senmantics, truth is we have to design properly.
to discuss this concern, let's look at a typical application.

![](/docs/docs_image/software/buildingblock/kafka/kafka23.png)



we post a message to APP-1, APP-1 extract the data,transform and produce the message to kafka, APP-2 will consume the message.
very simple but it can go wrong from many aspects.
first, the http call, when we make a http post, it may happen that APP-1 recevied the post data and processed, 
but somehow failed to return the reposonse back to the http client due to may be network issue, so the http client side will be timeout, 
normally the http client library will retry for this secnario, if the network recovered, APP-1 will recevie duplicated message, 
in this case from my own experience, what we would do is that we use redis on APP-1 to check duplication. 
the same may happen when APP-1 publish message to kafka, good news is that in the latest kafka version, 
it already help us handled this secnario, all we need to do is simply config enable idempotence to be ture.
go on the consumer side, unfortunately, consumer side is too much complicated, there is no easy way to solve it, 
before further discuss, let me clarify the verb 'processing', there are mainly two types of processing: in-memory processing, the other type is data persist(for example 
store into database, write to kafka), if it's purly in-memory processing there is nothing to worry about, whenever it's broken, so I'm talking about type 2,
, let's assume processing here means write to kafka.

![](/docs/docs_image/software/buildingblock/kafka/kafka24.png)

Transactional delivery allows producers to send data to multiple partitions such that either all messages are successfully delivered, or none of them are.

1) Producer
However, idempotent producers don’t provide guarantees for writes across multiple TopicPartitions. For this, one needs stronger transactional guarantees, ie. the ability to write to several TopicPartitions atomically. By atomically, we mean the ability to commit a set of messages across TopicPartitions as a unit: either all messages are committed, or none of them are.
2) Consumer
maintain offset
Refer to https://kafka.apache.org/0102/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html
By default, kafka help maintains consumer offset in topic called "__consumer_offset", whenever the consumer dies and restart or failover to another consumer in the same consumer group, it will continue from last committed offset.For example, we have two consumers A and B in one consumer group, if A crashed, B will take over A and continue from where A left over(from last committed offset), sounds good? Actually no,  here is why? 
there are two ways to commit offset:
Automatically commit when receive the record by calling poll()[Let's say, you call poll each 10 ms, and set commit-interval to 100ms. Thus, in every 10th call to poll will commit (and this commit covers all messages from the last 10 poll calls).], the problem with this way is that the consumer may fail process the offset has already advanced(If auto-commit is enabled for the Kafka consumer, the event processor might already have commited the event offset and fail before finishing the event. The consumer must commit the event manually after all relevant sub-processes have completed.), the other way is manually commit after process the record, this method is still problematic as the consumer may crashed after processing the record(calculating some results and send it to the downstream consumers/send to kafka) but before sending the commit to the kafka broker.


**snapshot and recovery **

When the rebalance happen, for the example when a consumer crashed, the other consumer will take over the partition and continue from last committed offset, but hold on, what about the context, I mean the states stored in the memory, how do we recover the states.
So what we can do is that we reprocessing the partition from the beginning, but the problem is message processing is time consuming, and when the partition grows fast, there are too many messages, reprocessing the partition may take a long time.
So what we can improve is that we add a checkpoint to take snapshot of the memory state, we call it checkpoint, so when rebalance happens, we can recover from the latest checkpoint instead of beginning, so this will improve the performance, save time for recovery.
By design, the new clearing system process records from kafka one by one in sequence, during the data processing, the consumer generated many in memory results, for example currentPosition for each positionAccount, we want to have snapshot of the result from time to time, so in the case of recovery, the consumer can recover from snapshot, save a lot computing power to re-calculate the result.
By the way, Kafka do support stateful operation with kafka stream state store, but that’s mainly for aggregation operation, so in our framework we didn’t take advantage of it


业务流水线假设为：
微服务A->微服务B->微服务C

微服务B处理完来自微服务A的某条kafka信息，然后需要往下游也就是微服务C发送kafka消息SendKafkaMsg_InfoToC()时，同时会保存此时处理的来自微服务A的消息的offset SendKafkaMsg_SaveOffset()，我们成为增量快照，
SendKafkaMsg_InfoToC()和SendKafkaMsg_SaveOffset()可以作为一个事务一起提交，
这种情况下，增量快照保存的是一个offset，假设此时服务B挂掉，重启后，B会寻找offset，然后从头开始恢复内存状态，直到这个offset，恢复区段为【0, offset】；

为了更快的恢复，我们不想每次从0开始恢复，所以引入全量快照SendKafkaMsg_SaveMemory()，保存此时的内存状态，并且全量快照中还要保存此时对应的来自微服务A的消息的offset，也就是说这是处理完第几条消息之后的内存状态，
增量快照中保存了两个信息：全量快照的位置和恢复区段的终止位置即offsetEND，
然后根据全量快照的位置，再去取出全量快照，全量快照中保存了当时的内存信息以及恢复区段的起始位置即offsetSTART，
所以恢复时先找到增量快照，然后根据增量快照存的位置信息找到全量快照，恢复内存，剩下的一点差异再通过恢复区段【offsetSTART,offsetEND】，恢复到服务B挂掉之前的完整内存状态；

**注意一点**，跟前面的“SendKafkaMsg_InfoToC()和SendKafkaMsg_SaveOffset()可以作为一个事务一起提交”不同，
SendKafkaMsg_SaveMemory()不能跟SendKafkaMsg_SaveOffset()为一个事务一起提交，因为这两个是有前后依赖的，因为增量快照SendKafkaMsg_SaveOffset()还需要保存全量快照的位置信息，而全量快照SendKafkaMsg_SaveMemory()
本身发送给Kafka是异步操作，回调中才能拿到自己的位置信息，所以无法作为同一个事务一起提交，所以只能等异步回调之后拿到全量的位置再存到增量快照SendKafkaMsg_SaveOffset()或者另一种做法是将全量快照的位置先存在内存中，增量快照SendKafkaMsg_SaveOffset()在下一次提交，
即使挂掉也影响不大，大不了从头开始或者从更早的全量快照开始恢复；

因此就可以理解下图：

![](/docs/docs_image/software/buildingblock/kafka/kafka25.png)
