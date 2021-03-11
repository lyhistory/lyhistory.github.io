---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《kafka》



## 1. Basic concepts
+ zookeeper：kafka 通过 zookeeper 来存储集群的 meta 信息。

+ broker：kafka 集群中包含的服务器。Each server acts as a leader for some of its partitions and a follower for others so load is well balanced within the cluster. 

  Kafka service = kafka broker, kafka cluster=multiple instances of kafka broker

+ controller：kafka 集群中的其中一个服务器，用来进行 leader election 以及 各种 failover。

+ producer：消息生产者，发布消息到 kafka 集群的终端或服务。

+ consumer：从 kafka 集群中消费消息的终端或服务。

+ Consumer group：high-level consumer API 中，每个 consumer 都属于一个 consumer group，每条消息只能被 consumer group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。

  consumer group leader
  group coordinator
  User group rebalance
  Standby

  

  By having a notion of parallelism—the partition—within the topics, Kafka is able to provide both ordering guarantees and load balancing over a pool of consumer processes. This is achieved by assigning the partitions in the topic to the consumers in the consumer group so that **each partition is consumed by exactly one consumer in the group. **By doing this we ensure that the consumer is the only reader of that partition and consumes the data in order. Since there are many partitions this still balances the load over many consumer instances. **Note however that there cannot be more consumer instances in a consumer group than partitions. **

  **If we add more consumers to a single group with a single topic than we  have partitions, some of the consumers will be idle and get no messages  at all.**

  

+ Topics & logs (Logical concept)：每条发布到 kafka 集群的消息属于的类别，即 kafka 是面向 topic 的。

  	LEO:: log end offset	offset+1
  	ISR:: in-sync replicas

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
zookeeper.connect=10.136.100.48:2181,10.136.100.49:2181,10.136.100.50:2181

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



### 2.2 使用 Usage

GUI：

+ KafkaEsque  https://kafka.esque.at

+ https://github.com/airbnb/kafkat

### 2.1 本地调试 

#### 2.1.1 单机 Local 调试

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

##### Producer 

```
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my-replicated-topic
```

##### Consumer 

```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-replicated-topic

bin/kafka-console-consumer.sh --bootstrap-server <你的kafka配置> --topic T-RISK --partition 0 --offset 3350 --max-messages 1
```

#### 2.1.2  虚拟机远程调试 Remote 

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

### 2.2 集成开发 springboot

```

```



#### spring-kafka

https://www.baeldung.com/spring-kafka

org.springframework.kafka包含：

+ spring-context
+ spring-messaging
+ spring-tx
+ spring-retry
+ kafka-clients

#### apache-kafka

https://docs.confluent.io/clients-kafka-java/current/overview.html

https://www.baeldung.com/kafka-exactly-once

https://kafka.apache.org/20/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html



org.apache.kafka.kafka-client 



### 2.3 管理维护 Maintain

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

#### 2.3.2 日志排查

KAFKA Internal consumer topic log：

```
./bin/kafka-dump-log.sh --files ./kafka-logs/T-TOPIC-1/00000000000000000192.log --print-data-log
```

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



#### 2.3.3 Backup (point-in-time snapshot) & Restore

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



https://kafka.apache.org/documentation/#design

Since the 0.11.0.0 release, Kafka has added support to allow its producers to send messages to different topic partitions in a transactional and idempotent manner https://kafka.apache.org/documentation/#semantics
KIP-129: Streams Exactly-Once Semantics https://cwiki.apache.org/confluence/display/KAFKA/KIP-129%3A+Streams+Exactly-Once+Semantics

### 4.1 Common

#### schema registry

https://docs.confluent.io/current/schema-registry/schema_registry_tutorial.html

#### clean up

__consumer_offsets

#### partition

1 partition 2 replica, where is the replica?? On the same parition but different segment??

Alter:
	bin/kafka-topics.sh --bootstrap-server broker_host:port --alter --topic my_topic_name \
      --partitions 40
kafka-reassign-partitions命令是针对Partition进行重新分配，而不能将整个Topic的数据重新均衡到所有的Partition中。
https://segmentfault.com/a/1190000011721643
https://cloud.tencent.com/developer/article/1349448

Be aware that one use case for partitions is to semantically partition data, and adding partitions doesn't change the partitioning of existing data so this may disturb consumers if they rely on that partition. That is if data is partitioned by hash(key) % number_of_partitions then this partitioning will potentially be shuffled by adding partitions but Kafka will not attempt to automatically redistribute data in any way.

https://dzone.com/articles/kafka-producer-and-consumer-example

###leader epoch & high watermark
https://cwiki.apache.org/confluence/display/KAFKA/KIP-101+-+Alter+Replication+Protocol+to+use+Leader+Epoch+rather+than+High+Watermark+for+Truncation
Kafka数据丢失及最新改进策略 http://lday.me/2017/10/08/0014_kafka_data_loss_and_new_mechanism/
kafka ISR设计及水印与leader epoch副本同步机制深入剖析-kafka 商业环境实战 https://juejin.im/post/5bf6b0acf265da612d18e931
leader epoch与watermark https://www.cnblogs.com/huxi2b/p/7453543.html
High watermark
If you want to improve the reliability of the data, set the request.required.acks = -1, but also min.insync.replicas this parameter (which can be set in the broker or topic level) to achieve maximum effectiveness. 
https://medium.com/@mukeshkumar_46704/in-depth-kafka-message-queue-principles-of-high-reliability-42e464e66172

###comsumer group coordinator
https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Client-side+Assignment+Proposal

###Log Compaction 
https://kafka.apache.org/22/documentation/#compaction
Kafka技术内幕-日志压缩 https://segmentfault.com/a/1190000005312891


Note however that there cannot be more consumer instances(task) in a consumer group than partitions. 
https://cwiki.apache.org/confluence/display/KAFKA/KIP-28+-+Add+a+processor+client

#### offset types

https://rongxinblog.wordpress.com/2016/07/29/kafka-high-watermark/

poll and timeout

https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153/ch04.html

TIMEOUTS IN KAFKA CLIENTS AND KAFKA STREAMS http://javierholguera.com/2018/01/01/timeouts-in-kafka-clients-and-kafka-streams/

#### kafka offset not increase by 1

https://stackoverflow.com/questions/54636524/kafka-streams-does-not-increment-offset-by-1-when-producing-to-topic

https://issues.apache.org/jira/browse/KAFKA-6607

[http://trumandu.github.io/2019/04/13/%E5%A6%82%E4%BD%95%E7%9B%91%E6%8E%A7kafka%E6%B6%88%E8%B4%B9Lag%E6%83%85%E5%86%B5/](http://trumandu.github.io/2019/04/13/如何监控kafka消费Lag情况/)

https://stackoverflow.com/questions/54544074/how-to-make-restart-able-producer

 https://github.com/confluentinc/confluent-kafka-go/issues/195





### 4.1 Consumer Indepth

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html

https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll-long-

#### 关键API

POLL

```
public ConsumerRecords<K,V> poll(long timeout)
```

On each poll, consumer will try to use the last consumed offset as the starting offset and fetch sequentially. The last consumed offset can be manually set through [`seek(TopicPartition, long)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#seek-org.apache.kafka.common.TopicPartition-long-) or automatically set as the last committed offset for the subscribed list of partitions 即如果不显示调用 seek来设置其位置，将会自动使用interal offset来定位其最后一次消费的位置。

#### 依赖internal offset

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

上面at-least-once 也不是绝对的，也可能丢数据：

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

#### 不依赖interal offset，自己维护offset exactly-once

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



有一个缺点是，虽然我们启动时可以判断，比如[0,1000]是之前处理过的，1001开始是新的数据，但是为了使内存恢复到之前的状态，仍然需要对[0,1000]这个区间的数据进行计算（只不过不进行任何事务处理比如落数据库，只是单纯为了restore memory），所以一个改进策略就是，增加全量快照，系统停止之前或定期将内存序列化存起来，注意存的时候同时存下当时的offset，比如1000，然后在增量快照中记录下这个全量快照的位置（当然还有我们要保存的offset）即可，由于为了记录下全量快照的kafka位置，需要等待kafka send的回调，所以记录到增量快照没有办法跟保存全量快照作为一个事务处理，不过没关系：

比如主题T-TARGET ，现在处理到了offset=1000，决定做一次全量快照，此时全量快照中保存下内存状态和start offset=1000，

kafka send全量快照到 T-QuanLiang中，然后在callback时，可以获取到全量快照在T-QuanLiang的 quanliang offset比如=0，

T-TARGET进来新的消息（或者之前做全量快照的指令本身就是条消息），继续事务性的记录增量快照 T-ZengLiang，此时最新记录的增量消息的内容是 quanliang offset=0&&end offset=1001

恢复的时候，先 找到T-ZengLiang最后一个消息 ，获取到quanliang offset=0&&end offset=1001，然后通过quanliang offset=0去seek(T-QuanLiang, 0) 拿到 start offset=1000和当时的内存数据，从而恢复内存数据，然后从1000开始(1000,1001],只需要重新计算下1001这条数据更新下内存即可，从1002开始往后都是新的消息

#### 配合事务型producer

注意前面的两种 exactly-once方法（依赖interal offset和维护自己的offset）都需要这个配置才能保证 exactly-once

**we can indicate with \*isolation.level\* that we should wait to read transactional messages until the associated transaction has been committed**:

```java
consumerProps.put("isolation.level", "read_committed");
```

在消费端有一个参数isolation.level，设置为“read_committed”，表示消费端应用不可以看到尚未提交的事务内的消息。如果生产者开启事务并向某个分区值发送3条消息 msg1、msg2 和 msg3，在执行 commitTransaction() 或 abortTransaction()  方法前，设置为“read_committed”的消费端应用是消费不到这些消息的，不过在 KafkaConsumer  内部会缓存这些消息，直到生产者执行 commitTransaction() 方法之后它才能将这些消息推送给消费端应用。反之，如果生产者执行了  abortTransaction() 方法，那么 KafkaConsumer 会将这些缓存的消息丢弃而不推送给消费端应用。

https://stackoverflow.com/questions/56047968/kafka-isolation-level-implications



#### consumer groups

Don't Use Apache Kafka Consumer Groups the Wrong Way! https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa
1)	Having consumers as part of the same consumer group means providing the“competing consumers” pattern with whom the messages from topic partitions are spread across the members of the group.
2)	Having consumers as part of different consumer groups means providing the “publish/subscribe” pattern where the messages from topic partitions are sent to all the consumers across the different groups.
https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa



### 4.2 Producer Indepth

#### 4.2.1 幂等性 idempotent producer

https://cwiki.apache.org/confluence/display/KAFKA/Idempotent+Producer

Idempotent producer ensures **exactly once message delivery per partition**

> To enable idempotence, the enable.idempotence configuration must be set  to true. If set, the retries config will be defaulted to  Integer.MAX_VALUE, the max.in.flight.requests.per.connection config will be defaulted to 1, and acks config will be defaulted to all. There are  no API changes for the idempotent producer, so existing applications  will not need to be modified to take advantage of this feature.

简单说幂等性就是，当发生网络异常或者其他情况时，producer会重试，但是kafka集群会保证消息不重复，重试某条信息1万次即使全部成功，kafka集群也只会保存一条信息，

设置 enable.idempotence=true 即可，

**尽量不要设置retries这个配置参数，使用默认的最大值即可，不然可能会丢失数据**，如果显示设置了retries就一定要设置 max.in.flight.requests.per.connection=1，不然可能会乱序

Setting a value greater than zero will cause the client to resend any record whose send fails with a potentially transient error. Note that this retry is no different than if the client resent the record upon receiving the error. Allowing retries without setting  MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1 will potentially change the ordering of records because if two batches are sent to a single partition, and the first fails and is retried but the second succeeds, then the records in the second batch may appear first.

https://stackoverflow.com/questions/55192852/transactional-producer-vs-just-idempotent-producer-java-exception-outoforderseq/66579532#66579532

#### 4.2.2 事务性 Transactional Producer 

https://www.cnblogs.com/luozhiyun/p/12079527.html

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html

https://tgrez.github.io/posts/2019-04-13-kafka-transactions.html

**Powers the applications to produce to multiple TopicPartitions atomically.** All writes to these TopicPartitions will either succeed or fail as a single unit. The application must provide a unique id, TransactionalId, to the producer which is stable across all sessions of the application. There is a 1-1 mapping between TransactionalId and PID.



依据：

```
    For instance, in a distributed stream processing application, suppose topic-partition tp0 was originally processed by transactional.id T0. If, at some point later, it could be mapped to another producer with transactional.id T1, there would be no fencing between T0 and T1. So it is possible for messages from tp0 to be reprocessed, violating the exactly once processing guarantee.

    Practically, one would either have to store the mapping between input partitions and transactional.ids in an external store（存储每个partition和这个transactional.id的map）, or have some static encoding of it（设置为静态的变量，比如the transactionId Prefix appended with <group.id>.<topic>.<partition>.The drawback is that it will require separate transactional producer for each partition）.
-- https://www.confluent.io/blog/transactions-apache-kafka/

2.1.11 Transactional Id When a transaction is started by the listener container, the transactional.id is now the transactionIdPrefix appended with <group.id>.<topic>.<partition>. This is to allow proper fencing of zombies as described here.
-- https://docs.spring.io/spring-kafka/reference/#transactional-id
```



org.apache.kafka.clients.producer.ProducerConfig.TRANSACTIONAL_ID_CONFIG

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

String transactionId =  UUID.randomUUID().toString();
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

https://www.confluent.io/online-talk/introducing-exactly-once-semantics-in-apache-kafka/

https://www.confluent.io/blog/transactions-apache-kafka/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging

https://blog.csdn.net/alex_xfboy/article/details/82988259

重点：

Producer：

开启幂等enable.idempotence和事务 transactional.id

Consumer：

设置isolation.level=read_committed 并且处理好offset



The first generation of stream  processing applications could tolerate inaccurate processing. For  instance, applications which consumed a stream of web page impressions  and produced aggregate counts of views per web page could tolerate some  error in the counts. 

However, the demand for stream  processing applications with stronger semantics has grown along with the popularity of these applications. For instance, some financial  institutions use stream processing applications to process debits and  credits on user accounts. In these situations, there is no tolerance for errors in processing: we need every message to be processed exactly  once, without exception.



从某个Topic的某个Partition的数据流看 atomic read-process-write pattern（对于使用kafka stream 的应用来说就是 consume-transform-produce’）：

More formally, if a stream processing application consumes message *A* and produces message *B* such that *B = F(A)*, then exactly  once processing means that *A* is considered consumed if and only if *B* is successfully produced, and vice versa.

message *A* will be considered consumed from topic-partition *tp0* only when its offset *X* is marked as consumed. Marking an offset as consumed is called *committing an offset.* In Kafka, we record offset commits by writing to an internal Kafka topic called the *offsets topic*. A message is considered consumed only when its offset is committed to the offsets topic

Thus since an offset commit is just  another write to a Kafka topic, and since a message is considered  consumed only when its offset is committed, atomic writes across  multiple topics and partitions also enable atomic read-process-write  cycles: the commit of the offset *X* to the offsets topic and the write of message *B* to *tp1* will be part of a single transaction, and hence atomic.

1.上游KafkaProducer：

+ 保证不会重复发送：

  1) retry 重发场景：The producer.send() could result in duplicate writes of message *B* due to internal retries. 

  解决方法：This is addressed by the idempotent producer: enable.idempotence=true

  2) Reprocessing may happen if the stream processing application crashes after writing *B* but before marking *A* as consumed. Thus when it resumes, it will consume *A* again and write *B* again, causing a duplicate. 

  解决方法：使用transaction，将 write B和mark A consumed（self main consumer offset on kafka topic partition）作为一个transaction

  3) 挂起后又恢复场景，applications will crash  or—worse!—temporarily lose connectivity to the rest of the system.  Typically, new instances are automatically started to replace the ones  which were deemed lost. Through this process, we may have multiple  instances processing the same input topics and writing to the same  output topics, causing duplicate outputs and violating the exactly once  processing semantics. We call this the problem of “zombie instances.”

  解决方法：通过 transaction.id 进行 zombie Fence

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

  + 另外一个比较隐含的场景是，当上游发生一些状况，比如上游的Producer发送Kafka消息（commitTransaction之前）突然挂起，然后transaction.id被新起的Producer占用，当之前的Producer又恢复的时候再commitTransaction会被Fence屏蔽掉，并且KafkaConsumer的read_committed隔离级别也可以保证不读取这些尚未提交的事务消息（The Kafka consumer will only deliver  transactional messages to the application if the transaction was  actually committed. Put another way, the consumer will not deliver  transactional messages which are part of an open transaction, and nor  will it deliver messages which are part of an aborted transaction.

    when using a Kafka consumer to consume  messages from a topic, an application will not know whether these  messages were written as part of a transaction, and so they do not know  when transactions start or end. 

    In short: Kafka guarantees that a  consumer will eventually deliver only non-transactional messages or  committed transactional messages. It will withhold messages from open  transactions and filter out messages from aborted transactions.）

+ 保证不要丢失消息：

  1）不要使用 auto commit，因为调用poll之后，消息offset可能已经被自动提交，但是此时如果没有处理完程序崩溃，再启动就会丢失消息；

  而是采用 atomic read-process-write模型，将write和Mark read作为一个transaction，这样不会出现前面的： 消息被标记为已读，但是还没处理完程序崩溃，重启之后丢失的问题；

  2）一旦producer成功将事务型的消息或非事务型的消息发送给了kafka（成功调用send api或commit transaction），接下来就是kafka的集群来保证消息不会丢掉了（比如关于replication high watermark）

![](/docs/docs_image/software/buildingblock/kafka/kafka_exactly_once01.png)

![](/docs/docs_image/software/buildingblock/kafka/kafka_exactly_once02.png)

简单例子：

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

### 4.4 Diving into Kafka

前面4.1 4.2 4.3 主要是将kafka当做黑盒，然后通过kafka开放的API来达到跟kafka交互的exactly-once，

但是kafka本身的很多细节也会影响到使用性能甚至是可用性，所以还需要深入kafka，了解比如：

副本 replication 等细节

https://www.cnblogs.com/luozhiyun/p/12079527.html

#### kafka idempotent 原理

http://matt33.com/2018/10/24/kafka-idempotent/

#### kafka Transaction 原理 Transaction Coordinator and Transaction Log

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



### Kafka Client Compatibility

https://spring.io/projects/spring-kafka
org.springframework.kafka org.apache.kafka
https://www.cnblogs.com/wangb0402/p/6187796.html

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
