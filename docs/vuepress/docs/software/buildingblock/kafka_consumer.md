---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html

https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#poll-long-

确定一个 Consumer Group 的 GroupCoordinator 的位置：

1. abs (GroupId.hashCode) % NumPartition，NumPartition 就是__consumer_offsets 的分区数
2. 计算结果表示了__consumer_offsets 的一个 partition比如`__consumer_offsets-10`
3.  找到该`__consumer_offsets-10` 的 leader 所在的 broker如broker id=3，即该consumer group的GroupCoordinator， 
4. 当该consumer group的GroupCoordinator挂掉时，也就是这个broker挂掉后，其他borkers（保存有`__consumer_offsets-10`的replica的节点）会选一个broker如broker id=1作为新的`__consumer_offsets-10`的leader，然后该broker会load 本机保存的`__consumer_offsets-10`replica到内存中，完成后，cient端就会discover该broker作为新的GroupCoordinator
5. 当broker id=3恢复正常后，会抢回broker id=1之前接管的`__consumer_offsets-10`，重新作为该topic的leader，然后client端就重新discover broker id=3作为group coordinator，这种抢回的方式可以保证kafka节点任务均衡（注意，broker id=3恢复之后，通过kafka-topics.sh --list 查看，`__consumer_offsets-10`的leader仍然会是broker id 1，需要等到再接收一条新的kafka消息后，leader才会切换成broker id 3，外部topic也是如此，`__transaction_state`也是类似，可能是生产一条消息时更新）

## 关键API及源码解读

keyword: heartbeat，rebalance

##### consumer groups

Don't Use Apache Kafka Consumer Groups the Wrong Way! https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa
1)	Having consumers as part of the same consumer group means providing the“competing consumers” pattern with whom the messages from topic partitions are spread across the members of the group.
2)	Having consumers as part of different consumer groups means providing the “publish/subscribe” pattern where the messages from topic partitions are sent to all the consumers across the different groups.
https://dzone.com/articles/dont-use-apache-kafka-consumer-groups-the-wrong-wa

线程安全：You can’t have multiple consumers that belong to the same group in one thread and you can’t have multiple threads safely use the same consumer. One consumer per thread is the rule. To run multiple consumers in the same group in one application, you will need to run each in its own thread. It is useful to wrap the consumer logic in its own object and then use Java’s ExecutorService to start multiple threads each with its own consumer. The Confluent blog has a tutorial that shows how to do just that.


##### 关键API

###### POLL

```
public ConsumerRecords<K,V> poll(long timeout)
```

The poll API returns fetched records based on the current position. 

---每一次poll的行为：
**On each poll, consumer will try to use the last consumed offset as the starting offset and fetch sequentially**. The last consumed offset can be manually set through [`seek(TopicPartition, long)`](https://kafka.apache.org/10/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html#seek-org.apache.kafka.common.TopicPartition-long-) or automatically set as the last committed offset for the subscribed list of partitions 即如果不显示调用 seek来设置其位置，将会自动使用interal offset来定位其最后一次消费的位置。

更完整的：

When the group is **first created**, the position will be set according to the reset policy (which is typically either set to the earliest or latest offset for each partition defined by the auto.offset.reset). Once the consumer begins committing offsets, then each **later rebalance** will reset the position to the last committed offset. The parameter passed to poll controls the maximum amount of time that the consumer will block while it awaits records at the current position. The consumer returns immediately as soon as any records are available, but it will wait for the full timeout specified before returning if nothing is available.

---第一次（reblance之后的第一次）poll的行为：
：

The poll loop does a lot more than just get data. The first time you call poll() with a new consumer, it is responsible for finding the GroupCoordinator, joining the consumer group, and receiving a partition assignment.[注意：只是subscribe topic并不能立即引发rebalance，可以在subscribe之后第一次poll，从而立即引发rebalance] If a rebalance is triggered, it will be handled inside the poll loop as well. And of course the heartbeats that keep consumers alive are sent from within the poll loop. For this reason, we try to make sure that whatever processing we do between iterations is fast and efficient.

---连续poll的行为？看源码
从上一次的fetch positions继续往下拉取

```
private ConsumerRecords<K, V> poll(final Timer timer, final boolean includeMetadataInTimeout) {
    acquireAndEnsureOpen();
    try {
        if (this.subscriptions.hasNoSubscriptionOrUserAssignment()) {
            throw new IllegalStateException("Consumer is not subscribed to any topics or assigned any partitions");
        }

        do {
            client.maybeTriggerWakeup();

            if (includeMetadataInTimeout) {
                if (!updateAssignmentMetadataIfNeeded(timer)) {
                    return ConsumerRecords.empty();
                }
            } else {
                while (!updateAssignmentMetadataIfNeeded(time.timer(Long.MAX_VALUE))) {
                    log.warn("Still waiting for metadata");
                }
            }

            final Map<TopicPartition, List<ConsumerRecord<K, V>>> records = pollForFetches(timer);
            if (!records.isEmpty()) {
                if (fetcher.sendFetches() > 0 || client.hasPendingRequests()) {
                    client.pollNoWakeup();
                }

                return this.interceptors.onConsume(new ConsumerRecords<>(records));
            }
        } while (timer.notExpired());

        return ConsumerRecords.empty();
    } finally {
        release();
    }
}

boolean updateAssignmentMetadataIfNeeded(final Timer timer) {
    if (coordinator != null && !coordinator.poll(timer)) {
        return false;
    }

    return updateFetchPositions(timer);
}

1.Polling coordinator for updates — ensure we’re up-to-date with our group’s coordinator.
2.Updating fetch positions — ensure every partition assigned to this consumer has a fetch position. If it is missing then consumer uses auto.offset.reset value to set it (set it to earliest, latest or throw exception).

```
[Kafka Consumer poll behaviour](https://medium.com/@abhishekit00/kafka-tutorial-part-ii-cd1e6d1775b2)

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

## 场景分析 consume-transform-produce pattern

具体场景是：

上游(consume topic 1-transform-produce to topic 2)->下游(consume topic 2....)

目标：

对上游和下游都实现 atomic-read-process-write

### 1. 上游(consume topic 1) -依赖internal offset
先来看比较简单的场景就是只有 consumer topic

直接poll，不通过 seek来设置位置，自动使用interal offset来定位其最后一次消费的位置，注意下面的两个使用方法 at-least-once 至少一次当然可能会重复消费，**但是也可能丢失信息**

#### 自动提交offset，at-least-once

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

#### 手动提交offset，at-least-once

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

### 2. 上游(consume topic 1-transform-produce to topic 2) - 手动提交 exactly-once

接着看上游比较完整的 consumer-transform-produce 场景

#### 依赖interal offset,exactly-once

**重点：**
[前面的"上游(consume topic 1) -依赖internal offset"](#1-上游consume-topic-1--依赖internal-offset) 是依赖 consumer提交offset，而对于atomic-read-process-write需要Producer提交offset，[Producer#sendOffsetsToTransaction](https://stackoverflow.com/questions/45195010/meaning-of-sendoffsetstotransaction-in-kafka-0-11)

参考[深入Exactly-Once解析](/docs/software/buildingblock/kafka) 

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

注意：

+ 如果想要zombie fence生效，除了用对transaction.id，这个顺序也很重要，要先去initTransaction注册 transaction.id（形象的说就是争取到合法身份先），然后才是去restore（读取增量快照做恢复），否则，如果你先去restore，再去注册（创建Transactional Producer并initTransactions），有可能restore的时候读取到增量快照是 1000，但是根据我后面在4.3小节提供的流程图，旧的disruptorProducer仍然可以继续写入kafka（之前曾经遇到过一次disruptor ringbuffer在rebalance之后继续工作重复落库的事情，相同的原理），因此等到 去注册（争取合法身份）的时候，增量快照可能已经到了2000，然后因为你先做的restore，你会定位到1000，将1001开始的都当做新消息：

  每个consumer group中的服务rebalance的正确启动顺序应该是：
  1. 先根据 kafka分配的partition创建好worker（主要是Transactional Producer），这个做完后，会立即让fence生效，不用再担心 其他服务上仍在等待shutdown的disruptorWorker继续消费ringbuffer的缓存消息
  2. 读取增量快照进行restore，由于第1步做完，我们完全相信kafka可以履行zombie fence，所以这里可以100%确定可以拿到准确的 last offset，从而准确的恢复

+ 有一个缺点是，虽然我们启动时可以判断，比如[0,1000]是之前处理过的，1001开始是新的数据，但是为了使内存恢复到之前的状态，仍然需要对[0,1000]这个区间的数据进行计算（只不过不进行任何事务处理比如落数据库，只是单纯为了restore memory），所以一个改进策略就是，增加全量快照，系统停止之前或定期将内存序列化存起来，注意存的时候同时存下当时的offset，比如1000，然后在增量快照中记录下这个全量快照的位置（当然还有我们要保存的offset）即可，由于为了记录下全量快照的kafka位置，需要等待kafka send的回调，所以记录到增量快照没有办法跟保存全量快照作为一个事务处理，不过没关系：

  比如主题T-TARGET ，现在处理到了offset=1000，决定做一次全量快照，此时全量快照中保存下内存状态和start offset=1000，kafka send全量快照到 T-QuanLiang中，然后在callback时，可以获取到全量快照在T-QuanLiang的 quanliang offset比如=0，T-TARGET进来新的消息（或者之前做全量快照的指令本身就是条消息），继续事务性的记录增量快照 T-ZengLiang，此时最新记录的增量消息的内容是 quanliang offset=0&&end offset=1001

  恢复的时候，先 找到T-ZengLiang最后一个消息 ，获取到quanliang offset=0&&end offset=1001，然后通过quanliang offset=0去seek(T-QuanLiang, 0) 拿到 start offset=1000和当时的内存数据，从而恢复内存数据，然后从1000开始(1000,1001],只需要重新计算下1001这条数据更新下内存即可，从1002开始往后都是新的消息


### 3. 上游(produce to topic 2)->下游(consume topic 2) - isolation.level

**we can indicate with \*isolation.level\* that we should wait to read transactional messages until the associated transaction has been committed**:

```java
consumerProps.put("isolation.level", "read_committed");
```

在消费端有一个参数isolation.level，设置为“read_committed”，表示消费端应用不可以看到尚未提交的事务内的消息。如果生产者开启事务并向某个分区值发送3条消息 msg1、msg2 和 msg3，在执行 commitTransaction() 或 abortTransaction()  方法前，设置为“read_committed”的消费端应用是消费不到这些消息的，不过在 KafkaConsumer  内部会缓存这些消息，直到生产者执行 commitTransaction() 方法之后它才能将这些消息推送给消费端应用。反之，如果生产者执行了  abortTransaction() 方法，那么 KafkaConsumer 会将这些缓存的消息丢弃而不推送给消费端应用。

https://stackoverflow.com/questions/56047968/kafka-isolation-level-implications