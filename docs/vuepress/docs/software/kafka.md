---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《kafka》

Kafka wordcount是stateful operation，因为每个task/consumer完全独立跑完整的topology，每个consumer处理某一个partition，所以要借助data store来存储ktable“中间”状态，data store也是多个consumer/task“协作”的结果
而storm wordcount是stateless operation，因为一个topology是分成sprout，bolt，每个sprout/bolt会开启一个或多个task，这些task在work process中执行，这些work process可能位于不同的机器，所以第一步是split bolt，然后将这些单词进行partition发送至相应的tasks，比如the这个单词会一直发送到某个特定的task进行count，所以对于最后一步count是很简单的，不需要reduce操作，每个count task都只统计相应的单词，互相之间没有重叠，不像kafka那样因为partition比较早，所以不同的parttion之间是有重叠的单词的，所以必须借助一个第三者存储来统计

## 1.Basic concepts
（1）producer：消息生产者，发布消息到 kafka 集群的终端或服务。
（2）broker：kafka 集群中包含的服务器。Each server acts as a leader for some of its partitions and a follower for others so load is well balanced within the cluster. 
（3）topic：每条发布到 kafka 集群的消息属于的类别，即 kafka 是面向 topic 的。
（4）partition：partition 是物理上的概念，每个 topic 包含一个或多个 partition。kafka 分配的单位是 partition。
（5）consumer：从 kafka 集群中消费消息的终端或服务。
（6）Consumer group：high-level consumer API 中，每个 consumer 都属于一个 consumer group，每条消息只能被 consumer group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。
（7）replica：partition 的副本，保障 partition 的高可用。
（8）leader：replica 中的一个角色， producer 和 consumer 只跟 leader 交互。
（9）follower：replica 中的一个角色，从 leader 中复制数据。
（10）controller：kafka 集群中的其中一个服务器，用来进行 leader election 以及 各种 failover。
（11）zookeeper：kafka 通过 zookeeper 来存储集群的 meta 信息。
https://blog.csdn.net/qq_37095882/article/details/81024048

Topics & logs (Logical concept)
	LEO:: log end offset	offset+1
	ISR:: in-sync replicas
Partition (Physical concept)
Kafka service = kafka broker, kafka cluster=multiple instances of kafka broker
Leader = topic leader = leader of replicas

Ordering (global order == one partition only)
	https://stackoverflow.com/questions/29820384/apache-kafka-order-of-messages-with-multiple-partitions
Each partition is a totally ordered log, but there is no global ordering between partitions (other than perhaps some wall-clock time you might include in your messages). The assignment of the messages to a particular partition is controllable by the writer, with most users choosing to partition by some kind of key (e.g. user id). Partitioning allows log appends to occur without co-ordination between shards and allows the throughput of the system to scale linearly with the Kafka cluster size.

Producers
Consumers
Group / Consumer group
	consumer group leader
	group coordinator
	User group rebalance
	Standby

https://www.confluent.io/blog/apache-kafka-data-access-semantics-consumers-and-membership

By having a notion of parallelism—the partition—within the topics, Kafka is able to provide both ordering guarantees and load balancing over a pool of consumer processes. This is achieved by assigning the partitions in the topic to the consumers in the consumer group so that each partition is consumed by exactly one consumer in the group. By doing this we ensure that the consumer is the only reader of that partition and consumes the data in order. Since there are many partitions this still balances the load over many consumer instances. Note however that there cannot be more consumer instances in a consumer group than partitions. 

Kafka设计解析（四）- Kafka Consumer设计解析
http://www.jasongj.com/2015/08/09/KafkaColumn4/

![](/docs/docs_image/software/kafka/kafka01.png)

## 2.Basic usage 
GUI KafkaEsque  https://kafka.esque.at

### 2.1 Local 
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

Create topic
```
bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 3 --partitions 1 --topic my-replicated-topic
#You can use kafka-topics.sh to see how the Kafka topic is laid out among the Kafka brokers. The ---describe will show partitions, ISRs, and broker partition leadership.
[test@localhost kafka_2.12-2.2.0]$ bin/kafka-topics.sh --describe --bootstrap-server localhost:9092 --topic my-replicated-topic
OpenJDK 64-Bit Server VM warning: If the number of processors is expected to increase from one, then you should configure the number of parallel GC threads appropriately using -XX:ParallelGCThreads=N
Topic:my-replicated-topic       PartitionCount:1        ReplicationFactor:3     Configs:segment.bytes=1073741824
        Topic: my-replicated-topic      Partition: 0    Leader: 1       Replicas: 1,2,0 Isr: 1,2,0
```

Producer 
```
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my-replicated-topic
```

Consumer 
```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic my-replicated-topic
```

### 2.2 Remote 

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
![](/docs/docs_image/software/kafka/kafka02.png)

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

May be something to do with:
https://forums.virtualbox.org/viewtopic.php?f=1&t=29990
https://github.com/trivago/gollum/issues/93

Telnet 127.0.0.1/guesthost 9092 WORKS, but it doesn’t mean can reach to the guest machine, simply because of port forwarding opened 9092 port on host

![](/docs/docs_image/software/kafka/kafka03.png)

**Final vm workaround (NAT+HOSTONLY)**
vim /etc/sysconfig/network-scripts/ifcfg-enp0s3

![](/docs/docs_image/software/kafka/kafka04.png)

## 3.Kafka stream
《Kafka Stream》调研：一种轻量级流计算模式 https://yq.aliyun.com/articles/58382
Kafka Streams - Not Looking at Facebook https://timothyrenner.github.io/engineering/2016/08/11/kafka-streams-not-looking-at-facebook.html
https://cloud.tencent.com/developer/ask/203192
https://www.codota.com/code/java/methods/org.apache.kafka.streams.kstream.KStream/groupBy
http://www.jasongj.com/kafka/kafka_stream/

### 3.1 Architecture 
https://kafka.apache.org/22/documentation/streams/architecture

**Stream Partitions and Tasks**

![](/docs/docs_image/software/kafka/kafka05.png)

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

![](/docs/docs_image/software/kafka/kafka06.png)

**Local State Stores**

**Fault Tolerance**

![](/docs/docs_image/software/kafka/kafka07.png)

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

![](/docs/docs_image/software/kafka/kafka08.png)

### 3.3 Basic usage

![](/docs/docs_image/software/kafka/kafka09.png)

![](/docs/docs_image/software/kafka/kafka10.png)

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

## 4.Kafka cluster

![](/docs/docs_image/software/kafka/kafka11.png)

http://www.linkedkeeper.com/detail/blog.action?bid=1016

## 5.Use case

https://mp.weixin.qq.com/s?spm=a2c4e.11153940.blogcont270421.21.7d142e7catwiNO&__biz=MzU1NDA4NjU2MA==&mid=2247486752&idx=1&sn=e9e789c18a6801af12db4c97dcb098e5&chksm=fbe9b4efcc9e3df9cb7d8f666335ed669a7339b27663fc223e5aacfbfa5d2d7404b431b3937d&scene=27#wechat_redirect
https://medium.com/@Pinterest_Engineering/using-kafka-streams-api-for-predictive-budgeting-9f58d206c996

kafka9重复消费问题解决 https://blog.csdn.net/u011637069/article/details/72899915


## 6.Indepth 
Kafka 数据可靠性深度解读 https://www.infoq.cn/article/depth-interpretation-of-kafka-data-reliability
震惊了！原来这才是kafka！ https://www.jianshu.com/p/d3e963ff8b70


https://kafka.apache.org/documentation/#design

Since the 0.11.0.0 release, Kafka has added support to allow its producers to send messages to different topic partitions in a transactional and idempotent manner https://kafka.apache.org/documentation/#semantics
KIP-129: Streams Exactly-Once Semantics https://cwiki.apache.org/confluence/display/KAFKA/KIP-129%3A+Streams+Exactly-Once+Semantics

### 6.1 consumer groups
Don't Use Apache Kafka Consumer Groups the Wrong Way! https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa
1)	Having consumers as part of the same consumer group means providing the“competing consumers” pattern with whom the messages from topic partitions are spread across the members of the group.
2)	Having consumers as part of different consumer groups means providing the “publish/subscribe” pattern where the messages from topic partitions are sent to all the consumers across the different groups.
https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa

### 6.2 API common
**producer:**
sendOffsetsToTransaction:
consuming and then producing messages based on what you consumed
https://stackoverflow.com/questions/45195010/meaning-of-sendoffsetstotransaction-in-kafka-0-11

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html
https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html

### 6.3 offset types
https://rongxinblog.wordpress.com/2016/07/29/kafka-high-watermark/

poll and timeout

https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153/ch04.html

TIMEOUTS IN KAFKA CLIENTS AND KAFKA STREAMS http://javierholguera.com/2018/01/01/timeouts-in-kafka-clients-and-kafka-streams/

### schema registry
https://docs.confluent.io/current/schema-registry/schema_registry_tutorial.html

### clean up
__consumer_offsets

### partition
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

###task 
Note however that there cannot be more consumer instances(task) in a consumer group than partitions. 
https://cwiki.apache.org/confluence/display/KAFKA/KIP-28+-+Add+a+processor+client

Kafka Stream有一些关键东西没有解决，例如在join场景中，需要保证来源2个Topic数据Shard个数必须是一定的，因为本身做不到MapJoin等技术

## Troubleshooting
?# [2019-05-07 21:45:48,648] ERROR [KafkaServer id=0] Fatal error during KafkaServer startup. Prepare to shutdown (kafka.server.KafkaServer)
org.apache.kafka.common.KafkaException: Failed to acquire lock on file .lock in /tmp/kafka-logs. A Kafka instance in another process or thread is using this directory.
 
?#Kafka Client Compatibility
https://spring.io/projects/spring-kafka
org.springframework.kafka org.apache.kafka
https://www.cnblogs.com/wangb0402/p/6187796.html

## More
https://cwiki.apache.org/confluence/display/KAFKA/Ecosystem

https://www.youtube.com/watch?v=p9wcx3aTjuo
http://benstopford.com/uploads/CraftMeetup.pdf
https://www.confluent.io/blog/author/ben-stopford/
https://www.confluent.io/blog/building-a-microservices-ecosystem-with-kafka-streams-and-ksql/
Interactive Queries https://kafka.apache.org/documentation/streams/developer-guide/interactive-queries.html
Ktables vs global ktables
Kafka has several features for reducing the need to move data on startup 
- Standby Replicas 
- Disk Checkpoints
- Compacted topics
Command and Query Responsibility Segregation (CQRS) pattern [with event sourcing]
https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs

![](/docs/docs_image/software/kafka/kafka12.png)

https://medium.com/eleven-labs/cqrs-pattern-c1d6f8517314
Materialized View pattern https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view

Using an event-streaming approach, we can materialize the data locally via the Kafka Streams API. We define a query for the data in our grid: “select * from orders, payments, customers where…” and Kafka Streams executes it, stores it locally, keeps it up to date. This ensures highly available should the worst happen and your service fails unexpectedly (this approach is discussed in more detail here).
To combat the challenges of being stateful, Kafka ships with a range of features to make the storage, movement, and retention of state practical: notably standby replicas and disk checkpointsto mitigate the need for complete rebuilds, and compacted topics to reduce the size of datasets that need to be moved.

Kafka实现淘宝亿万级数据统计 https://zhuanlan.zhihu.com/p/58747239
一文看懂Kafka消息格式的演变 https://blog.csdn.net/u013256816/article/details/80300225

http://support-it.huawei.com/docs/en-us/fusioninsight-all/maintenance-guide/en-us_topic_0035061142.html

---


![](/docs/docs_image/software/kafka/kafka01.png)
![](/docs/docs_image/software/kafka/kafka02.png)
![](/docs/docs_image/software/kafka/kafka03.png)
![](/docs/docs_image/software/kafka/kafka04.png)
![](/docs/docs_image/software/kafka/kafka05.png)

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



```
1.
basicaly kafka is a messaging system, compare to other messaging middleware like the one I used before called rabbit mq, with rabbit mq you can only process once,
after consuming the message, it's removed from the queue.
kafka provides durable storage of messages, sometimes kafka is used as a kind of database.
and now kafka has evolved from messaging queue to full-fleged event streaming platform, we're not using the streaming feature, so today the topic only cover messaging queue.

2.
why do we use kafka
Let's have a look at architecuture diagram next slides microservices approach vs traditional approach, 
in traditional approach, application stack multiple layers and compononets together as a single unit.
we can see microservice segregates functionalities into a set of autonamous services,so the circle connecting microservices is message queue system.
there are some advantages for microservice approach,
there is no single point of failure, one service broke down doesn't impact other services;
its easier to scale up, all these services are deployed independently, esier to identify the bottle neck and scale up;
from developer standpoint, it can save a lot of time troubleshooting the microservices compared to debug into the traditional application,
micorservice is designed based on single reponsiblity principle, you can find the paticular service responsible for the cause straightforward.

3.
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
Transactional delivery allows producers to send data to multiple partitions such that either all messages are successfully delivered, or none of them are.
```


---

ref

[Designing Event-Driven Systems Concepts and Patterns for Streaming Services with Apache Kafka --Ben Stopford](https://www.confluent.io/wp-content/uploads/confluent-designing-event-driven-systems.pdf)

[Building Event Driven Services with Apache Kafka and Kafka Streams by Ben Stopford](https://www.youtube.com/watch?v=p9wcx3aTjuo)
[How Netflix Handles Data Streams Up to 8M Events/sec](https://www.youtube.com/watch?v=WuRazsX-MBY)
https://github.com/confluentinc/kafka-streams-examples/tree/4.0.0-post
https://streamsets.com/resources/guide/best-practices-guide-for-simplifying-apache-kafka/

State store, global or local?
Ktable, globalktable
https://stackoverflow.com/questions/40274884/is-kafka-stream-statestore-global-over-all-instances-or-just-local
https://stackoverflow.com/questions/52488070/difference-between-ktable-and-local-store
https://stackoverflow.com/questions/50741186/how-to-filter-out-unnecessary-records-before-materializing-globalktable/50752095#50752095
https://github.com/confluentinc/kafka-streams-examples/issues/126
Cheatsheet
https://gist.github.com/filipefigcorreia/3db4c7e525581553e17442792a2e7489
