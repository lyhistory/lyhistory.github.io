Since the 0.11.0.0 release, Kafka has added support to allow its producers to send messages to different topic partitions in a transactional and idempotent manner https://kafka.apache.org/documentation/#semantics

https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html

## 关键API及源码解读

### 事务型 Transactional Producer 
![](./kafka_producer_0.png)


+ initTransactions - Sets up a producer to use transactions.
+ beginTransaction - Starts a new transaction.
+ send messages - Almost ordinary production of messages, but with an extra step. We will get to it in a minute.
+ sendOffsetsToTransaction - Notifies the broker about consumed offsets, which should be committed at the same time as the transaction.
+ commitTransaction - This includes committing consumed offsets and marking produced messages as committed.


#### 1. initTransactions

**Summary: **
If you want to use transactions, you have to initialize some things upfront. This should be called once in the lifetime of your producer. This call involves resolving the state of the previous transactions, which might have been started by the previous instance of this producer. Maybe it crashed before committing a transaction, and we have to clean it up. This is the place where the fencing of an old producer is done.

**[SourceCode](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L618): **
```
public void initTransactions() {
    throwIfNoTransactionManager();
    throwIfProducerClosed();
    TransactionalRequestResult result = transactionManager.initializeTransactions();
    sender.wakeup();
    result.await(maxBlockTimeMs, TimeUnit.MILLISECONDS);
}
```
We can see some preliminary checks. The first one ensures that we have set the transactional.id property.

What is a transactional.id? It is a value that identifies a producer instance across restarts. If your particular service instance has a transactional.id 1234, after the restart it should still have a value of 1234. Although, it is tricky if you are using auto-assignment of partitions and multiple instances. This case is covered in this great blog post: “When Kafka transactions might fail”

In line 4 we are initializing producer’s internal transactionManager, which is responsible for managing all transactions features of producer. The implementation looks like this [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L275):

```
public synchronized TransactionalRequestResult initializeTransactions() {
    return handleCachedTransactionRequestResult(() -> {
        transitionTo(State.INITIALIZING);
        setProducerIdAndEpoch(ProducerIdAndEpoch.NONE);
        InitProducerIdRequestData requestData = new InitProducerIdRequestData()
                .setTransactionalId(transactionalId)
                .setTransactionTimeoutMs(transactionTimeoutMs);
        InitProducerIdHandler handler = new InitProducerIdHandler(new InitProducerIdRequest.Builder(requestData));
        enqueueRequest(handler);
        return handler.result;
    }, State.INITIALIZING);
}
```
The most important logic is contacting the remote transaction coordinator, which resides on a broker. This involves two steps:

    Line 4 - 7 - We are preparing a request to the broker’s transaction coordinator. The producer includes transactional.id, and transaction timeout. This request is called InitProducerId.
    Line 8 - The aforementioned request is enqueued for sending. The class that is responsible for sending enqueued requests is called Sender, and it is a background thread created by every producer. Eventually, the request will be sent.

What does the group coordinator do when it received an initProducerId call? First, it checks if it has any more information on this transactional.id.

Here come the transaction states. A transaction is in one particular state and is allowed to switch to different states according to some rules. States and transitions look like this:

![](./kafka_transaction_state.png)

In case there is no information about the transaction, the coordinator creates an Empty state. However, if there is already a transaction for this id, there are three possible results. Those depend on the transaction state:
+ Ongoing - There is an ongoing transaction started by the previous instance of the producer, so the broker will assume the old producer is dead, and abort this transaction. It has to do some cleaning, so it asks the new producer instance to retry later. While aborting the transaction, the broker will fence off the old producer preventing him from committing the transaction, if it was not dead but just disappear for a while.
+ PrepareAbort or PrepareCommit - The transaction is in the middle of finishing. The coordinator is waiting for nodes taking part in the transaction to respond. When all of them will respond, the transaction will transition to CompleteAbort or CompleteCommit state, and the new producer can continue. In the meantime, the coordinator is asking the new producer to retry this request.
+ CompleteAbort, CompleteCommit or Empty - There is no transaction in progress, so the new producer receives a producerId and a new epoch and can continue with making new transactions.

The response on a producer side is handled in InitProducerIdHandler in this way [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L1126):

```
@Override
public void handleResponse(AbstractResponse response) {
    InitProducerIdResponse initProducerIdResponse = (InitProducerIdResponse) response;
    Errors error = initProducerIdResponse.error();

    if (error == Errors.NONE) {
        ProducerIdAndEpoch producerIdAndEpoch = new ProducerIdAndEpoch(initProducerIdResponse.data.producerId(),
                initProducerIdResponse.data.producerEpoch());
        setProducerIdAndEpoch(producerIdAndEpoch);
        transitionTo(State.READY);
        lastError = null;
        result.done();
    } else if (error == Errors.NOT_COORDINATOR || error == Errors.COORDINATOR_NOT_AVAILABLE) {
        lookupCoordinator(FindCoordinatorRequest.CoordinatorType.TRANSACTION, transactionalId);
        reenqueue();
    } else if (error == Errors.COORDINATOR_LOAD_IN_PROGRESS || error == Errors.CONCURRENT_TRANSACTIONS) {
        reenqueue();
    } else if (error == Errors.TRANSACTIONAL_ID_AUTHORIZATION_FAILED) {
        fatalError(error.exception());
    } else {
        fatalError(new KafkaException("Unexpected error in InitProducerIdResponse; " + error.message()));
    }
}
```

As you see, in case of no error, the producer remembers the producerId and producerEpoch. Those values are used for fencing zombie producers. In case this producer becomes a zombie, while another one comes and replaces it when the zombie producer gets back to live, it will realize that it has been replaced, because Kafka will not allow it to do anything with the transaction.

On the other hand, if the producer sees an error regarding the coordinator not being wrong or not ready, it will retry the request. Retry will also happen when the broker is in the middle of finishing transaction (states: PrepareAbort and PrepareCommit)

Any other error will result in you receiving an exception.


-----------------------------------------

> The following steps will be taken when initTransactions() is called:
>
> 1. If no TransactionalId has been provided in configuration, skip to step 3.
> 2. Send a [FindCoordinatorRequest](https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit#heading=h.97qeo7mkx9jx) with the configured TransactionalId and with CoordinatorType encoded as “transaction” to a random broker. Block for the corresponding response, which will return the assigned transaction coordinator for this producer.
> 3. Send an [InitPidRequest](https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit#heading=h.z99xar1h2enr) to the transaction coordinator or to a random broker if no TransactionalId was provided in configuration. Block for the corresponding response to get the returned PID.
>
> https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/edit
>
> 2. Getting a producer Id -- the InitPidRequest
>
> After discovering the location of its coordinator, the next step is to retrieve the producer’s PID. This is achieved by issuing a InitPidRequest to the transaction coordinator
>
> 2.1 When an TransactionalId is specified
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

#### 2. beginTransaction
**Summary: **
Right now we have a producer ready to start the transaction. It received its producerId and epoch, so Kafka knows about it. We are ready to begin. We start the first transaction by calling beginTransaction.

[**(source code)**](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L639)

```
public void beginTransaction() throws ProducerFencedException {
    throwIfNoTransactionManager();
    throwIfProducerClosed();
    transactionManager.beginTransaction();
}
```

This code validates if we are dealing with a transactional producer in the first place, or if we have not closed the producer. After that it forwards the call to the TransactionManager [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L288):

```
public synchronized void beginTransaction() {
        ensureTransactional();
        maybeFailWithError();
        transitionTo(State.IN_TRANSACTION);
    }
```

Here is also some validation. This time we switch producer to the IN_TRANSACTION state. This is it. No fancy calls to the broker. I guess this is just a precaution to prevent some coding errors we might introduce in our code, like forgetting to abort or commit the transaction, but trying to start a new one.

#### 3. send
**Summary: **
we are publishing the events.

Deep inside the send method you can find a call to the transactionManager’s method [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L914):

```
if (transactionManager != null && transactionManager.isTransactional())
    transactionManager.maybeAddPartitionToTransaction(tp);
```

If we jump a little further [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L340):

```
public synchronized void maybeAddPartitionToTransaction(TopicPartition topicPartition) {
    failIfNotReadyForSend();

    if (isPartitionAdded(topicPartition) || isPartitionPendingAdd(topicPartition))
        return;

    log.debug("Begin adding new partition {} to transaction", topicPartition);
    topicPartitionBookkeeper.addPartition(topicPartition);
    newPartitionsInTransaction.add(topicPartition);
}
```

Take a look at lines 8 and 9. Producer is adding partition to topicPartitionBookkeeper and newPartitionsInTransaction. Those are simple data structures (Map and Set), so they do not have any logic, but they remember what partitions take part in a transaction.

You might ask, when does the Kafka broker gets to know that those partitions are part of a transaction?

The thing is, Kafka producer does not send records immediately. It batches those records, and the internal thread periodically sends them. The aforementioned Sender class takes care of it and in the very same place lies a request informing coordinator about new partitions in a transaction. If you head over to Sender code you can find a method that is responsible for one single run of an almost endless loop. The short version without all the boilerplate looks like this [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/Sender.java#L299):

```
void runOnce() {
    if (transactionManager != null) {
        try {
            if (!transactionManager.isTransactional()) {
                ...
            } else if (maybeSendAndPollTransactionalRequest()) {
```

If we jump further to maybeSendAndPollTransactionalRequest() implementation, and later on to the transaction manager, we will see [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L724):

```
if (!newPartitionsInTransaction.isEmpty())
    enqueueRequest(addPartitionsToTransactionHandler());
```

So along with every request to publish a batch of records, there is a request informing about the partitions in a transaction.


#### 4. sendOffsetsToTransaction
**Summary: **
Apart from adding newly produced messages to the transaction, we have to take care of consumed offsets, as those should be committed at the same time as the transaction,
adding those offsets to the transaction, so the transaction coordinator can commit them when we are done with the transaction.

**[SourceCode](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L669): **
```
public void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets,
                                     String consumerGroupId) throws ProducerFencedException {
    throwIfNoTransactionManager();
    throwIfProducerClosed();
    TransactionalRequestResult result = transactionManager.sendOffsetsToTransaction(offsets, consumerGroupId);
    sender.wakeup();
    result.await();
}
```
This is fairly simple:

    Line 5 - We are preparing a request with consumed offsets and queueing it to be sent.
    Line 6 - Here, the Sender thread is being wakened up. It will send the aforementioned request.



#### 5. commitTransaction/abortTransaction

**Summary: **
As a last step, the producer is informing the transaction coordinator that it should finish the transaction and inform all involved nodes about that:


**[SourceCode](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L701): **
```
public void commitTransaction() throws ProducerFencedException {
    throwIfNoTransactionManager();
    throwIfProducerClosed();
    TransactionalRequestResult result = transactionManager.beginCommit();
    sender.wakeup();
    result.await(maxBlockTimeMs, TimeUnit.MILLISECONDS);
}
```

Similarly, to the sendOffsetsToTransaction, we see some simple validation, as well as preparation of a request, and queuing of it.

What happens on a transaction coordinator’s side? I would like to cite the code, however, it is too complicated and fragmented. However, it is changing the transaction state to the PrepareCommit state, notifying all participants - partitions that have consumed offsets to commit and produced messages to mark as committed.

After it collects all the responses it will change the state to CompleteCommit state. After that, you can be sure that the offsets are committed, and messages you have produced are available for consumption.

## 幂等性 idempotent producer

https://cwiki.apache.org/confluence/display/KAFKA/Idempotent+Producer

Idempotent producer ensures **exactly once message delivery per partition**

> To enable idempotence, the enable.idempotence configuration must be set  to true. If set, the retries config will be defaulted to  Integer.MAX_VALUE, the max.in.flight.requests.per.connection config will be defaulted to 1, and acks config will be defaulted to all. There are  no API changes for the idempotent producer, so existing applications  will not need to be modified to take advantage of this feature.

简单说幂等性就是，当发生网络异常或者其他情况时，producer会重试，但是kafka集群会保证消息不重复，重试某条信息1万次即使全部成功，kafka集群也只会保存一条信息，

设置 enable.idempotence=true 即可，

**尽量不要设置retries这个配置参数，使用默认的最大值即可，不然可能会丢失数据**，如果显示设置了retries就一定要设置 max.in.flight.requests.per.connection=1，不然可能会乱序

Setting a value greater than zero will cause the client to resend any record whose send fails with a potentially transient error. Note that this retry is no different than if the client resent the record upon receiving the error. Allowing retries without setting  MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1 will potentially change the ordering of records because if two batches are sent to a single partition, and the first fails and is retried but the second succeeds, then the records in the second batch may appear first.

https://stackoverflow.com/questions/55192852/transactional-producer-vs-just-idempotent-producer-java-exception-outoforderseq/66579532#66579532



How does this feature work? Under the  covers, it works in a way similar to TCP: each batch of messages sent to Kafka will contain a sequence number that the broker will use to dedupe any duplicate send. Unlike TCP, though—which provides guarantees only  within a transient in-memory connection—this sequence number is  persisted to the replicated log, so even if the leader fails, any broker that takes over will also know if a resend is a duplicate. The overhead of this mechanism is quite low: it’s just a few extra numeric fields  with each batch of messages. As you will see later in this article, this feature adds negligible performance overhead over the non-idempotent  producer.

## 事务型 Transactional Producer 

https://www.cnblogs.com/luozhiyun/p/12079527.html

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

### Fence机制实例
下面图示来自[When Kafka transactions might fail](https://tgrez.github.io/posts/2019-04-13-kafka-transactions.html)
wrong:
![](./kafka_producer_1.png)
![](./kafka_producer_2.png)
![](./kafka_producer_3.png)
![](./kafka_producer_4.png)
![](./kafka_producer_5.png)
![](./kafka_producer_6.png)
![](./kafka_producer_7.png)

correct:
![](./kafka_producer_8.png)
![](./kafka_producer_9.png)

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
