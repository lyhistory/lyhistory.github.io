---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

+ At least once—Messages are never lost but may be redelivered.
    Prior to 0.11.0.0, if a producer failed to receive a response indicating that a message was committed, it had little choice but to resend the message. This provides at-least-once delivery semantics since the message may be written to the log again during resending if the original request had in fact succeeded. 
+ At most once—Messages may be lost but are never redelivered.
    Since 0.11.0.0, the Kafka producer also supports an idempotent delivery option which guarantees that resending will not result in duplicate entries in the log. To achieve this, the broker assigns each producer an ID and deduplicates messages using a sequence number that is sent by the producer along with every message. 
+ Exactly once—this is what people actually want, each message is delivered once and only once.
    Also beginning with 0.11.0.0, the producer supports the ability to send messages to multiple topic partitions using transaction-like semantics: i.e. either all messages are successfully written or none of them are. The main use case for this is exactly-once processing between Kafka topics 

## 1. 关键配置

### Producer Client
[KafkaProducer](https://kafka.apache.org/23/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html)

+ enable.idempotence
    Whether or not idempotence is enabled (false by default). If disabled, the producer will not set the PID field in produce requests and the current producer delivery semantics will be in effect. Note that idempotence must be enabled in order to use transactions.

    When idempotence is enabled, we enforce that acks=all, retries > 1, and max.inflight.requests.per.connection=1. Without these values for these configurations, we cannot guarantee idempotence. If these settings are not explicitly overridden by the application, the producer will set acks=all, retries=Integer.MAX_VALUE, and max.inflight.requests.per.connection=1 when idempotence is enabled.

+ transactional.id

    For instance, in a distributed stream processing application, suppose topic-partition tp0 was originally processed by transactional.id T0. If, at some point later, it could be mapped to another producer with transactional.id T1, there would be no fencing between T0 and T1. So it is possible for messages from tp0 to be reprocessed, violating the exactly once processing guarantee.

    Practically, one would either have to store the mapping between input partitions and transactional.ids in an external store（存储每个partition和这个transactional.id的map）, or have some static encoding of it（设置为静态的变量，比如the transactionId Prefix appended with <group.id>.<topic>.<partition>.The drawback is that it will require separate transactional producer for each partition）.

    Note that enable.idempotence must be enabled if a TransactionalId is configured.
+ delivery.timeout.ms
    An upper bound on the time to report success or failure after a call to send() returns. This limits the total time that a record will be delayed prior to sending, the time to await acknowledgement from the broker (if expected), and the time allowed for retriable send failures. The producer may report failure to send a record earlier than this config if either an unrecoverable error is encountered, the retries have been exhausted, or the record is added to a batch which reached an earlier delivery expiration deadline. The value of this config should be greater than or equal to the sum of request.timeout.ms and linger.ms.

    Type:	int
    Default:	120000 (2 minutes)
    Valid Values:	[0,...]
    Importance:	medium
+ producer.id.expiration.ms
    The time in ms that a topic partition leader will wait before expiring producer IDs. Producer IDs will not expire while a transaction associated to them is still ongoing. Note that producer IDs may expire sooner if the last write from the producer ID is deleted due to the topic's retention settings. Setting this value the same or higher than delivery.timeout.ms can help prevent expiration during retries and protect against message duplication, but the default should be reasonable for most use cases.
    Type:	int
    Default:	86400000 (1 day)
    Valid Values:	[1,...]
    Importance:	low
    Update Mode:	cluster-wide
+ transactional.id.expiration.ms
    The time in ms that the transaction coordinator will wait without receiving any transaction status updates for the current transaction before expiring its transactional id. Transactional IDs will not expire while a the transaction is still ongoing.

    Type:	int
    Default:	604800000 (7 days)
    Valid Values:	[1,...]
    Importance:	high
    Update Mode:	read-only

    Internally broker keeps a map of producer IDs to transaction IDs to maintain aforementioned fencing functionality. However broker will expire these entries based on transactional.id.expiration.ms setting which is by default 604800000 ms or 1 week.

    This means that if your producer sends messages slower than once a week it will be fenced (crash) every time it tries to send after that prolonged period. One could put that value to Integer.MAX, but that still will be around 24 days. In case of very rare events, this should be solved differently, e.g. by having separate producer ping topic, that producer will periodically send messages to.

+  transaction.timeout.ms
    The maximum amount of time in ms that the transaction coordinator will wait for a transaction status update from the producer before proactively aborting the ongoing transaction.If this value is larger than the transaction.max.timeout.ms setting in the broker, the request will fail with a InvalidTxnTimeoutException error.

    This config value will be sent to the transaction coordinator along with the InitPidRequest.

    Default is 60000. This makes a transaction to not block downstream consumption more than a minute, which is generally allowable in real-time apps.

    Type:	int
    Default:	60000 (1 minute)
    Valid Values:	
    Importance:	low
    
+ retries = 2147483647
    The default value for the producer's retries config was changed to Integer.MAX_VALUE, as we introduced delivery.timeout.ms in KIP-91, which sets an upper bound on the total time between sending a record and receiving acknowledgement from the broker. By default, the delivery timeout is set to 2 minutes.
+ retry.backoff.ms = 150
    The amount of time to wait before attempting to retry a failed request to a given topic partition. This avoids repeatedly sending requests in a tight loop under some failure scenarios.

### Brokers

+ transactional.id.expiration.ms	
    The maximum amount of time in ms that the transaction coordinator will wait before proactively expire a producer TransactionalId without receiving any transaction status updates from it.

    Default is 604800000 (7 days). This allows periodic weekly producer jobs to maintain its id.
+ max.transaction.timeout.ms	
    The maximum allowed timeout for transactions. If a client’s requested transaction time exceeds this, then the broker will return an error in InitPidRequest. This prevents a client from too large of a timeout, which can stall consumers reading from topics included in the transaction.

    efault is 900000 (15 min). This is a conservative upper bound on the period of time a transaction of messages will need to be sent.
+ transaction.state.log.min.isr	
    The minimum number of insync replicas for the transaction state topic. 
    Default: 2
+ transaction.state.log.replication.factor	
    The number of replicas for the transaction state topic.
    Default: 3
+ transaction.state.log.num.partitions	
    The number of partitions for the transaction state topic.
    Default: 50
+ transaction.state.log.segment.bytes	
    The segment size for the transaction state topic.
    Default: 104857600 bytes.
+ transaction.state.log.load.buffer.size	
    The loading buffer size for the transaction stat topic.
    Default: 5242880 bytes.

## 2. 客户端关键API及源码解读

+ **transaction coordinator**
    The first part of the design is to enable producers to send a group of messages as a single transaction that either succeeds or fails atomically. In order to achieve this, we introduce a new server-side module called transaction coordinator, to manage transactions of messages sent by producers, and commit / abort the appends of these messages as a whole. 

+ **transaction log**
    The transaction coordinator maintains a transaction log, which is stored as an internal topic (we call it the transaction topic) to persist transaction status for recovery. Similar to the “offsets log” which maintains consumer offsets and group state in the internal __consumer_offsets topic, producers do not read or write directly to the transaction topic. Instead they talk to their transaction coordinator who is the leader broker of the hosted partition of the topic. The coordinator can then append the new state of the indicated transactions to its owned transaction topic partition.

+ **control message** 
    For messages appended to Kafka log partitions, in order to indicate whether they are committed or aborted, a special type of message called control message will be used (some of the motivations are already discussed in KAFKA-1639). Control messages do not contain application data in the value payload and should not be exposed to applications. It is only used for internal communication between brokers and clients. 

+ **transaction markers**
    For producer transactions, we will introduce a set of transaction markers implemented as control messages, such that the consumer client can interpret them to determine whether any given message has been committed or aborted. And based on the transaction status, the consumer client can then determine whether and when to return these messages to the application.

+ **Producer Identifiers and Idempotency**
    - **sequence number**
    Within a transaction, we also need to make sure that there is no duplicate messages generated by the producer. To achieve this, we are going to add sequence numbers to messages to allow the brokers to de-duplicate messages per producer and topic partition. For each topic partition that is written to, the producer maintains a sequence number counter and assigns the next number in the sequence for each new message. The broker verifies that the next message produced has been assigned the next number and otherwise returns an error. 
    - **TransactionalId & epoch number** 
    In addition, since the sequence number is per producer and topic partition, we also need to uniquely identify a producer across multiple sessions (i.e. when the producer fails and recreates, etc). Hence we introduce a new TransactionalId to distinguish producers, along with an epoch number so that zombie writers with the same TransactionalId can be fenced.

producer id VS transaction id, transaction id是client端给Transactional producer设置的，而producer id是broker分配的，如果是Transactional producer，borker会维护 producer id和Transaction id的mapping:
[Producer clientId=producer-3, transactionalId=TEST-PROGRAM-TID-0] 

+ **CorrelationId** 
    This is a user-supplied integer. It will be passed back in the response by the server, unmodified. It is useful for matching request and response between the client and server.
    correlationId is a per TCP connection artifact that allows the client (producer or consumer) to map a response from the broker to a previous request by the client, it has no meaning outside that specific TCP connection.


### Data Flow
![](/docs/docs_image/software/buildingblock/kafka/kafka_transactional_messaging_dataflow.png)

In the diagram above, the sharp edged boxes represent distinct machines. The rounded boxes at the bottom represent Kafka topic partitions, and the diagonally rounded boxes represent logical entities which run inside brokers.
Each arrow represents either an RPC, or a write to a Kafka topic. These operations occur in the sequence indicated by the numbers next to each arrow. The sections below are numbered to match the operations in the diagram above, and describe the operation in question.

#### 1. Finding a transaction coordinator -- the FindCoordinatorRequest
Since the transaction coordinator is at the center assigning PIDs and managing transactions,the first thing a producer has to do is issue a FindCoordinatorRequest (previously known as GroupCoordinatorRequest, but renamed for general usage) to any broker to discover the location of its coordinator. Note that if no TransactionalId is specified in the configuration, this step can be skipped.

#### 2. Getting a producer Id -- the InitPidRequest
The producer must send an InitPidRequest to get idempotent delivery or to use transactions. Which semantics are allowed depends on whether or not the transactional.id configuration is provided or not.

##### 2.1 When a TransactionalId is specified
After discovering the location of its coordinator, the next step is to retrieve the producer’s PID. This is achieved by sending an InitPidRequest to the transaction coordinator. 
The TransactionalId is passed in the InitPidRequest along with the transaction timeout, and the mapping to the corresponding PID is logged in the transaction log in step 2a. This enables us to return the same PID for the TransactionalId to future instances of the producer, and hence enables recovering or aborting previously incomplete transactions. 

In addition to returning the PID, the InitPidRequest performs the following tasks:
+ Bumps up the epoch of the PID, so that any previous zombie instance of the producer is fenced off and cannot move forward with its transaction.
+ Recovers (rolls forward or rolls back) any transaction left incomplete by the previous instance of the producer.

The handling of the InitPidRequest is synchronous. Once it returns, the producer can send data and start new transactions.

##### 2.2 When a TransactionalId is not specified
If no TransactionalId is specified in the configuration, the InitPidRequest can be sent to any broker. A fresh PID is assigned, and the producer only enjoys idempotent semantics and transactional semantics within a single session. 

#### 3. Starting a Transaction -- the beginTransaction API
The new KafkaProducer will have a beginTransaction() method which has to be called to signal the start of a new transaction. The producer records local state indicating that the transaction has begun, but the transaction won’t begin from the coordinator’s perspective until the first record is sent.

#### 4. The consume-transform-produce loop
In this stage, the producer begins to consume-transform-produce the messages that comprise the transaction. This is a long phase and is potentially comprised of multiple requests.

##### 4.1 AddPartitionsToTxnRequest
The producer sends this request to the transaction coordinator the first time a new TopicPartition is written to as part of a transaction. The addition of this TopicPartition to the transaction is logged by the coordinator in step 4.1a. We need this information so that we can write the commit or abort markers to each TopicPartition (see section 5.2 for details). If this is the first partition added to the transaction, the coordinator will also start the transaction timer.

##### 4.2 ProduceRequest
The producer writes a bunch of messages to the user’s TopicPartitions through one or more ProduceRequests (fired from the send method of the producer). These requests include the PID, epoch, and sequence number as denoted in 4.2a.

##### 4.3 AddOffsetsToTxnRequest
The producer has a new sendOffsets API method, which enables the batching of consumed and produced messages. This method takes a map of the offsets to commit and a groupId argument, which corresponds to the name of the associated consumer group.
The sendOffsets method sends an AddOffsetsToTxnRequests with the groupId to the transaction coordinator, from which it can deduce the TopicPartition for this consumer group in the internal __consumer_offsets topic. The transaction coordinator logs the addition of this topic partition to the transaction log in step 4.3a.

##### 4.4 TxnOffsetCommitRequest
Also as part of sendOffsets, the producer will send a TxnOffsetCommitRequest to the consumer coordinator to persist the offsets in the __consumer_offsets topic (step 4.4a). The consumer coordinator validates that the producer is allowed to make this request (and is not a zombie) by using the PID and producer epoch which are sent as part of this request. 
The consumed offsets are not visible externally until the transaction is committed, the process for which we will discuss now.

#### 5. Committing or Aborting a Transaction
Once the data has been written, the user must call the new commitTransaction or abortTransaction methods of the KafkaProducer. These methods will begin the process of committing or aborting the transaction respectively. 

##### 5.1 EndTxnRequest
When a producer is finished with a transaction, the newly introduced KafkaProducer.commitTranaction or KafkaProducer.abortTransaction must be called. The former makes the data produced in step 4 above available to downstream consumers. The latter effectively erases the produced data from the log: it will never be accessible to the user (at the READ_COMMITTED isolation level), ie. downstream consumers will read and discard the aborted messages.
Regardless of which producer method is called, the producer issues an EndTxnRequest to the transaction coordinator, with a field indicating whether the transaction is to be committed or aborted. Upon receiving this request, the coordinator:

1.	Writes a PREPARE_COMMIT or PREPARE_ABORT message to the transaction log. (step 5.1a)
2.	Begins the process of writing the command messages known as COMMIT (or ABORT) markers to the user logs through the WriteTxnMarkerRequest. (see section 5.2 below).
3.	Finally writes the COMMITTED (or ABORTED) message to transaction log. (see 5.3 below).

##### 5.2 WriteTxnMarkerRequest
This request is issued by the transaction coordinator to the leader of each TopicPartition which is part of the transaction. Upon receiving this request, each broker will write a COMMIT(PID) or ABORT(PID) control message to the log. (step 5.2a)
This message indicates to consumers whether messages with the given PID should be delivered or dropped. As such, the broker will not return messages which have a PID (meaning these messages are part of a transaction) until it reads a corresponding COMMIT or ABORT message of that PID, at which point it will deliver or skip the messages respectively. In addition, in order to maintain offset ordering in message delivery, brokers would maintain an offset called last stable offset (LSO) below which all transactional messages have either been committed or aborted.
Note that, if the __consumer_offsets topic is one of the TopicPartitions in the transaction, the commit (or abort) marker is also written to the log, and the consumer coordinator is notified that it needs to materialize these offsets in the case of a commit or ignore them in the case of an abort (step 5.2a on the left).

##### 5.3 Writing the final Commit or Abort Message
After all the commit or abort markers are written the data logs, the transaction coordinator writes the final COMMITTED or ABORTED message to the transaction log, indicating that the transaction is complete (step 5.3 in the diagram). At this point, most of the messages pertaining to the transaction in the transaction log can be removed. 
We only need to retain the PID of the completed transaction along with a timestamp, so we can eventually remove the TransactionalId->PID mapping for the producer. See the Expiring PIDs section below.

In the rest of this design doc we will provide a detailed description of the above data flow along with the proposed changes on different modules.


### 事务型 Transactional Producer 

**Powers the applications to produce to multiple TopicPartitions atomically.** All writes to these TopicPartitions will either succeed or fail as a single unit. The application must provide a unique id, TransactionalId, to the producer which is stable across all sessions of the application. There is a 1-1 mapping between TransactionalId and PID.

![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_0.png)


+ initTransactions - Sets up a producer to use transactions.
+ beginTransaction - Starts a new transaction.
+ send messages - Almost ordinary production of messages, but with an extra step. We will get to it in a minute.
+ sendOffsetsToTransaction - Notifies the broker about consumed offsets, which should be committed at the same time as the transaction.
+ commitTransaction - This includes committing consumed offsets and marking produced messages as committed.


#### 1. initTransactions

**Summary: **
If you want to use transactions, you have to initialize some things upfront. This should be called once in the lifetime of your producer. This call involves resolving the state of the previous transactions, which might have been started by the previous instance of this producer. Maybe it crashed before committing a transaction, and we have to clean it up. This is the place where the fencing of an old producer is done.

The following steps will be taken when initTransactions() is called:
1.	If no TransactionalId has been provided in configuration, skip to step 3.
2.	Send a FindCoordinatorRequest with the configured TransactionalId and with CoordinatorType encoded as “transaction” to a random broker. Block for the corresponding response, which will return the assigned transaction coordinator for this producer.
3.	Send an InitPidRequest to the transaction coordinator or to a random broker if no TransactionalId was provided in configuration. Block for the corresponding response to get the returned PID.


**[SourceCode](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L618): **
```
    public void initTransactions() {
        throwIfNoTransactionManager();
        throwIfProducerClosed();
[4]     TransactionalRequestResult result = transactionManager.initializeTransactions();
        sender.wakeup();
        result.await(maxBlockTimeMs, TimeUnit.MILLISECONDS);
    }
```
We can see some preliminary checks. The first one ensures that we have set the transactional.id property.

What is a transactional.id? It is a value that identifies a producer instance across restarts. If your particular service instance has a transactional.id 1234, after the restart it should still have a value of 1234. Although, it is tricky if you are using auto-assignment of partitions and multiple instances. This case is covered in the section: [“When Kafka transactions might fail”](#fence机制实例)

+ In line 4 we are initializing producer’s internal transactionManager, 
    which is responsible for managing all transactions features of producer. The implementation looks like this [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L275):

```
    public synchronized TransactionalRequestResult initializeTransactions() {
        return handleCachedTransactionRequestResult(() -> {
            transitionTo(State.INITIALIZING);
[4]         setProducerIdAndEpoch(ProducerIdAndEpoch.NONE);
[5]         InitProducerIdRequestData requestData = new InitProducerIdRequestData()
[6]                .setTransactionalId(transactionalId)
[7]                .setTransactionTimeoutMs(transactionTimeoutMs);
[8]         InitProducerIdHandler handler = new InitProducerIdHandler(new InitProducerIdRequest.Builder(requestData));
            enqueueRequest(handler);
            return handler.result;
        }, State.INITIALIZING);
    }

    private void enqueueRequest(TxnRequestHandler requestHandler) {
        log.debug("Enqueuing transactional request {}", requestHandler.requestBuilder());
        pendingRequests.add(requestHandler);
    }
```
The most important logic is contacting the remote transaction coordinator, which resides on a broker. This involves two steps:

+ Line 4 - 7 - We are preparing a request to the broker’s transaction coordinator. The producer includes transactional.id, and transaction timeout. This request is called InitProducerId.
+ Line 8 - The aforementioned request is enqueued for sending. The class that is responsible for sending enqueued requests is called Sender, and it is a background thread created by every producer. Eventually, the request will be sent.
    
##### Sender: 就是KafkaProducer 新建并启动的新的线程Runnable Sender
    ```
    KafkaProducer(Map<String, Object> configs,
                  Serializer<K> keySerializer,
                  Serializer<V> valueSerializer,
                  Metadata metadata,
                  KafkaClient kafkaClient,
                  ProducerInterceptors interceptors,
                  Time time) {
                    this.sender = newSender(logContext, kafkaClient, this.metadata);
                    String ioThreadName = NETWORK_THREAD_PREFIX + " | " + clientId;
                    this.ioThread = new KafkaThread(ioThreadName, this.sender, true);
                    this.ioThread.start();
    ｝
    public class Sender implements Runnable {
        void run(long now) {
            if (transactionManager != null) {
            ........ 
                    } else if (transactionManager.hasInFlightTransactionalRequest() || maybeSendTransactionalRequest(now)) {
                ........
        private boolean maybeSendTransactionalRequest(long now) {
            if (transactionManager.isCompleting() && accumulator.hasIncomplete()) {
                if (transactionManager.isAborting())
                    accumulator.abortUndrainedBatches(new KafkaException("Failing batch since transaction was aborted"));
                // There may still be requests left which are being retried. Since we do not know whether they had
                // been successfully appended to the broker log, we must resend them until their final status is clear.
                // If they had been appended and we did not receive the error, then our sequence number would no longer
                // be correct which would lead to an OutOfSequenceException.
                if (!accumulator.flushInProgress())
                    accumulator.beginFlush();
            }

            TransactionManager.TxnRequestHandler nextRequestHandler = transactionManager.nextRequestHandler(accumulator.hasIncomplete());
            if (nextRequestHandler == null)
                return false;

            AbstractRequest.Builder<?> requestBuilder = nextRequestHandler.requestBuilder();
            while (!forceClose) {
                Node targetNode = null;
                try {
                    if (nextRequestHandler.needsCoordinator()) {
                        targetNode = transactionManager.coordinator(nextRequestHandler.coordinatorType());
                        if (targetNode == null) {
                            transactionManager.lookupCoordinator(nextRequestHandler);
                            break;
                        }
                        if (!NetworkClientUtils.awaitReady(client, targetNode, time, requestTimeoutMs)) {
                            transactionManager.lookupCoordinator(nextRequestHandler);
                            break;
                        }
                    } else {
                        targetNode = awaitLeastLoadedNodeReady(requestTimeoutMs);
                    }

                    if (targetNode != null) {
                        if (nextRequestHandler.isRetry())
                            time.sleep(nextRequestHandler.retryBackoffMs());
                        ClientRequest clientRequest = client.newClientRequest(
                            targetNode.idString(), requestBuilder, now, true, requestTimeoutMs, nextRequestHandler);
                        transactionManager.setInFlightTransactionalRequestCorrelationId(clientRequest.correlationId());
                        log.debug("Sending transactional request {} to node {}", requestBuilder, targetNode);
                        client.send(clientRequest, now);
                        return true;
                    }
                } catch (IOException e) {
                    log.debug("Disconnect from {} while trying to send request {}. Going " +
                            "to back off and retry.", targetNode, requestBuilder, e);
                    if (nextRequestHandler.needsCoordinator()) {
                        // We break here so that we pick up the FindCoordinator request immediately.
                        transactionManager.lookupCoordinator(nextRequestHandler);
                        break;
                    }
                }
                time.sleep(retryBackoffMs);
                metadata.requestUpdate();
            }
            transactionManager.retry(nextRequestHandler);
            return true;
        }
    ```

What does the group coordinator do when it received an initProducerId call? First, it checks if it has any more information on this transactional.id.

Here come the transaction states. A transaction is in one particular state and is allowed to switch to different states according to some rules. States and transitions look like this:

![](/docs/docs_image/software/buildingblock/kafka/kafka_transaction_state.png)

In case there is no information about the transaction, the coordinator creates an Empty state. However, if there is already a transaction for this id, there are three possible results. Those depend on the transaction state:
+ Ongoing - There is an ongoing transaction started by the previous instance of the producer, so the broker will assume the old producer is dead, and abort this transaction. It has to do some cleaning, so it asks the new producer instance to retry later. While aborting the transaction, the broker will fence off the old producer preventing him from committing the transaction, if it was not dead but just disappear for a while.
+ PrepareAbort or PrepareCommit - The transaction is in the middle of finishing. The coordinator is waiting for nodes taking part in the transaction to respond. When all of them will respond, the transaction will transition to CompleteAbort or CompleteCommit state, and the new producer can continue. In the meantime, the coordinator is asking the new producer to retry this request.
+ CompleteAbort, CompleteCommit or Empty - There is no transaction in progress, so the new producer receives a producerId and a new epoch and can continue with making new transactions.

The response on a producer side is handled in InitProducerIdHandler in this way [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L1126):

```
private class InitProducerIdHandler extends TxnRequestHandler {
    ........
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


#### 2. beginTransaction
**Summary: **
Right now we have a producer ready to start the transaction. It received its producerId and epoch, so Kafka knows about it. We are ready to begin. We start the first transaction by calling beginTransaction.

The following steps are executed on the producer when beginTransaction is called:
1.	Check if the producer is transactional (i.e. init has been called), if not throw an exception (we omit this step in the rest of the APIs, but they all need to execute it).
2.	Check whether a transaction has already been started. If so, raise an exception.

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

With an ongoing transaction (i.e. after beginTransaction is called but before commitTransaction or abortTransaction is called), the producer will maintain the set of partitions it has produced to. When send is called, the following steps will be added:
1.	Check if the producer has a PID. If not, send an InitPidRequest following the procedure above.
2.	Check whether a transaction is ongoing. If so, check if the destination topic partition is in the list of produced partitions. If not, then send an AddPartitionToTxnRequest to the transaction coordinator. Block until the corresponding response is received, and update the set. This ensures that the coordinator knows which partitions have been included in the transaction before any data has been written.

Discussion on Thread Safety. The transactional producer can only have one outstanding transaction at any given time. A call to beginTransaction() with another ongoing transaction is treated as an error. Once a transaction begins, it is possible to use the send() API from multiple threads, but there must be one and only one subsequent call to commitTransaction() or abortTransaction().
Note that with a non-transactional producer, the first send call will be blocking for two round trips (GroupCoordinatorRequest and InitPidRequest).


Deep inside the send method you can find a call to the transactionManager’s method [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L914):

```
private Future<RecordMetadata> doSend(ProducerRecord<K, V> record, Callback callback) {
    .........
    serializedValue = valueSerializer.serialize(record.topic(), record.headers(), record.value());
    .........
    int partition = partition(record, serializedKey, serializedValue, cluster);
    tp = new TopicPartition(record.topic(), partition);
    .........
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
[8]     newPartitionsInTransaction.add(topicPartition);
    }
```

Take a look at lines 8. Producer is adding partition to newPartitionsInTransaction. It's simple data structures (Set), so do not have any logic, but it remember what partitions take part in a transaction.

You might ask, when does the Kafka broker gets to know that those partitions are part of a transaction?

The thing is, Kafka producer does not send records immediately. It batches those records, and the internal thread periodically sends them. The aforementioned Sender class takes care of it and in the very same place lies a request informing coordinator about new partitions in a transaction. If you head over to Sender code you can find a method that is responsible for one single run of an almost endless loop. The short version without all the boilerplate looks like this [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/Sender.java#L299):

```
void run(long now) {
        if (transactionManager != null) {
            try {
                if (transactionManager.shouldResetProducerStateAfterResolvingSequences())
                    // Check if the previous run expired batches which requires a reset of the producer state.
                    transactionManager.resetProducerId();
                if (!transactionManager.isTransactional()) {
                    // this is an idempotent producer, so make sure we have a producer id
                    maybeWaitForProducerId();
                } else if (transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()) {
                    transactionManager.transitionToFatalError(
                        new KafkaException("The client hasn't received acknowledgment for " +
                            "some previously sent messages and can no longer retry them. It isn't safe to continue."));
                } else if (transactionManager.hasInFlightTransactionalRequest() || maybeSendTransactionalRequest(now)) {
                    // as long as there are outstanding transactional requests, we simply wait for them to return
                    client.poll(retryBackoffMs, now);
                    return;
                }
```

If we jump further to maybeSendTransactionalRequest() implementation, and later on to the transaction manager, we will see [(source code)](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/internals/TransactionManager.java#L724):

```
private boolean maybeSendTransactionalRequest(long now) {
        if (transactionManager.isCompleting() && accumulator.hasIncomplete()) {
            if (transactionManager.isAborting())
                accumulator.abortUndrainedBatches(new KafkaException("Failing batch since transaction was aborted"));
            // There may still be requests left which are being retried. Since we do not know whether they had
            // been successfully appended to the broker log, we must resend them until their final status is clear.
            // If they had been appended and we did not receive the error, then our sequence number would no longer
            // be correct which would lead to an OutOfSequenceException.
            if (!accumulator.flushInProgress())
                accumulator.beginFlush();
        }

        TransactionManager.TxnRequestHandler nextRequestHandler = transactionManager.nextRequestHandler(accumulator.hasIncomplete());
        if (nextRequestHandler == null)
            return false;
=>
这里的newPartitionsInTransaction就是上面doSend里面将新的Transaction添加进入的那个Set，KafkaProducer启动的Sender线程在run的时候会调用这个同步的程序nextRequestHandler，然后前面doSend添加到了newPartitionsInTransaction 所以非空调用 enqueueRequest(addPartitionsToTransactionHandler());
synchronized TxnRequestHandler nextRequestHandler(boolean hasIncompleteBatches) {
        if (!newPartitionsInTransaction.isEmpty())
            enqueueRequest(addPartitionsToTransactionHandler());

        TxnRequestHandler nextRequestHandler = pendingRequests.peek();
        if (nextRequestHandler == null)
            return null;

        // Do not send the EndTxn until all batches have been flushed
        if (nextRequestHandler.isEndTxn() && hasIncompleteBatches)
            return null;

        pendingRequests.poll();
        if (maybeTerminateRequestWithError(nextRequestHandler)) {
            log.trace("Not sending transactional request {} because we are in an error state",
                    nextRequestHandler.requestBuilder());
            return null;
        }

        if (nextRequestHandler.isEndTxn() && !transactionStarted) {
            nextRequestHandler.result.done();
            if (currentState != State.FATAL_ERROR) {
                log.debug("Not sending EndTxn for completed transaction since no partitions " +
                        "or offsets were successfully added");
                completeTransaction();
            }
            nextRequestHandler = pendingRequests.poll();
        }

        if (nextRequestHandler != null)
            log.trace("Request {} dequeued for sending", nextRequestHandler.requestBuilder());

        return nextRequestHandler;
    }
=》
enqueueRequest(addPartitionsToTransactionHandler())：
private synchronized TxnRequestHandler addPartitionsToTransactionHandler() {
        pendingPartitionsInTransaction.addAll(newPartitionsInTransaction);
        newPartitionsInTransaction.clear();
        AddPartitionsToTxnRequest.Builder builder = new AddPartitionsToTxnRequest.Builder(transactionalId,
                producerIdAndEpoch.producerId, producerIdAndEpoch.epoch, new ArrayList<>(pendingPartitionsInTransaction));
        return new AddPartitionsToTxnHandler(builder);
    }
private void enqueueRequest(TxnRequestHandler requestHandler) {
        log.debug("Enqueuing transactional request {}", requestHandler.requestBuilder());
        pendingRequests.add(requestHandler);
    }
```

##### Send 详解

```
 private Future<RecordMetadata> doSend(ProducerRecord<K, V> record, Callback callback) {
        TopicPartition tp = null;
        try {
            throwIfProducerClosed();// 如果Producer已经关闭跑出异常
            // 1.首先确保topic的metadata可用
            ClusterAndWaitTime clusterAndWaitTime;
            try {
                clusterAndWaitTime = waitOnMetadata(record.topic(), record.partition(), maxBlockTimeMs);
            } catch (KafkaException e) {
                // matadata关闭抛出异常
                if (metadata.isClosed())
                    throw new KafkaException("Producer closed while send in progress", e);
                throw e;
            }
            long remainingWaitMs = Math.max(0, maxBlockTimeMs - clusterAndWaitTime.waitedOnMetadataMs);
            Cluster cluster = clusterAndWaitTime.cluster;
            // 2.序列化record的topic,header,Key,Value
            byte[] serializedKey;
            try {
                serializedKey = keySerializer.serialize(record.topic(), record.headers(), record.key());
            } catch (ClassCastException cce) {
                throw new SerializationException("Can't convert key of class " + record.key().getClass().getName() +
                        " to class " + producerConfig.getClass(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG).getName() +
                        " specified in key.serializer", cce);
            }
            byte[] serializedValue;
            try {
                serializedValue = valueSerializer.serialize(record.topic(), record.headers(), record.value());
            } catch (ClassCastException cce) {
                throw new SerializationException("Can't convert value of class " + record.value().getClass().getName() +
                        " to class " + producerConfig.getClass(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG).getName() +
                        " specified in value.serializer", cce);
            }
            // 3.获取record的partition的值(可以在Record指定,也可以根据算法生成)
            int partition = partition(record, serializedKey, serializedValue, cluster);
            tp = new TopicPartition(record.topic(), partition);

            setReadOnly(record.headers());
            Header[] headers = record.headers().toArray();

            int serializedSize = AbstractRecords.estimateSizeInBytesUpperBound(apiVersions.maxUsableProduceMagic(),
                    compressionType, serializedKey, serializedValue, headers);
            ensureValidRecordSize(serializedSize); // 如果record的字节超出限制或大于内存限制,会抛出异常
            long timestamp = record.timestamp() == null ? time.milliseconds() : record.timestamp();
            log.trace("Sending record {} with callback {} to topic {} partition {}", record, callback, record.topic(), partition);
            // producer callback will make sure to call both 'callback' and interceptor callback
            Callback interceptCallback = new InterceptorCallback<>(callback, this.interceptors, tp);

            if (transactionManager != null && transactionManager.isTransactional())
                transactionManager.maybeAddPartitionToTransaction(tp);

            // 4.向accumulator追加数据
            RecordAccumulator.RecordAppendResult result = accumulator.append(tp, timestamp, serializedKey,
                    serializedValue, headers, interceptCallback, remainingWaitMs);
            // 5.如果batch满了,唤醒sender线程发送数据
            if (result.batchIsFull || result.newBatchCreated) {
                log.trace("Waking up the sender since topic {} partition {} is either full or getting a new batch", record.topic(), partition);
                this.sender.wakeup();
            }
            return result.future;


```
=》获取topic的metadata信息
```
// 等待Metadata的更新
private ClusterAndWaitTime waitOnMetadata(String topic, Integer partition, long maxWaitMs) throws InterruptedException {
    // 将topic添加到元数据topic列表（如果尚未存在），并重置过期时间
    Cluster cluster = metadata.fetch();

    if (cluster.invalidTopics().contains(topic))
        throw new InvalidTopicException(topic);

    metadata.add(topic);

    Integer partitionsCount = cluster.partitionCountForTopic(topic); // 如果topic已经存在meta中,则返回该topic的partition数,否则返回null
    // 如果有缓存的元数据,并且记录的分区未定义或在已知分区范围内,则返回该元数据
    if (partitionsCount != null && (partition == null || partition < partitionsCount))
        return new ClusterAndWaitTime(cluster, 0);

    long begin = time.milliseconds();
    long remainingWaitMs = maxWaitMs;
    long elapsed;
    // 发送metadata请求,直到获取这个topic的metadata或者请求超时
    do {
        log.trace("Requesting metadata update for topic {}.", topic);
        metadata.add(topic);
        int version = metadata.requestUpdate(); // 返回当前版本号,初始值为0,每次更新时会自增,并将needUpdate设置为true
        sender.wakeup(); // 唤起sender,发送metadata请求
        try {
            metadata.awaitUpdate(version, remainingWaitMs); // 等待metadata的更新
        } catch (TimeoutException ex) {
            // Rethrow with original maxWaitMs to prevent logging exception with remainingWaitMs
            throw new TimeoutException("Failed to update metadata after " + maxWaitMs + " ms.");
        }
        cluster = metadata.fetch();
        elapsed = time.milliseconds() - begin;
        if (elapsed >= maxWaitMs)
            throw new TimeoutException("Failed to update metadata after " + maxWaitMs + " ms."); // 超时
        if (cluster.unauthorizedTopics().contains(topic))
            throw new TopicAuthorizationException(topic); // 认证失败
        if (cluster.invalidTopics().contains(topic))
            throw new InvalidTopicException(topic);
        remainingWaitMs = maxWaitMs - elapsed;
        partitionsCount = cluster.partitionCountForTopic(topic);
    } while (partitionsCount == null); // 不停循环,直到partitionsCount不为null(直到metadata出现这个topic的相关信息)

    if (partition != null && partition >= partitionsCount) {
        throw new KafkaException(
                String.format("Invalid partition given with record: %d is not in the range [0...%d).", partition, partitionsCount));
    }

    return new ClusterAndWaitTime(cluster, elapsed);
}
```
=>Metadata更新操作

```
// 更新metadata信息(根据version值判断)
public synchronized void awaitUpdate(final int lastVersion, final long maxWaitMs) throws InterruptedException {
    if (maxWaitMs < 0)
        throw new IllegalArgumentException("Max time to wait for metadata updates should not be < 0 milliseconds");
    long begin = System.currentTimeMillis();
    long remainingWaitMs = maxWaitMs;
    while ((this.version <= lastVersion) && !isClosed()) { // 不断循环,直到metadata更新成功,version自增
        AuthenticationException ex = getAndClearAuthenticationException();
        if (ex != null)
            throw ex;
        if (remainingWaitMs != 0)
            wait(remainingWaitMs); // 阻塞线程,等待metadata更新
        long elapsed = System.currentTimeMillis() - begin;
        if (elapsed >= maxWaitMs) // 超时
            throw new TimeoutException("Failed to update metadata after " + maxWaitMs + " ms.");
        remainingWaitMs = maxWaitMs - elapsed;
    }
    if (isClosed())
        throw new KafkaException("Requested metadata update after close");
}
```
至此,Producer线程会阻塞在两个while循环中,直到metadata更新.metadata更新主要通过sender.wakeup()来唤醒sender线程,间接唤醒NetworkClient线程,NetworkClient线程来负责发送Metadata请求,并处理Server端的响应.在唤醒NetworkClient后会调用poll方法进行实际操作,如下:

唤醒 sender:

```
void run(long now) {
        if (transactionManager != null) {
            try {
                .......
                } else if (transactionManager.hasInFlightTransactionalRequest() || maybeSendTransactionalRequest(now)) {
                    // as long as there are outstanding transactional requests, we simply wait for them to return
                    client.poll(retryBackoffMs, now);
                    return;
                }
```
client.poll=>

```
package org.apache.kafka.clients;
public class NetworkClient implements KafkaClient {
    @Override
    public List<ClientResponse> poll(long timeout, long now) {
        if (!abortedSends.isEmpty()) {
            // If there are aborted sends because of unsupported version exceptions or disconnects,
            // handle them immediately without waiting for Selector#poll.
            List<ClientResponse> responses = new ArrayList<>();
            handleAbortedSends(responses);
            completeResponses(responses);
            return responses;
        }

        long metadataTimeout = metadataUpdater.maybeUpdate(now); // 判断是否需要更新meta,如果需要就更新(请求更新metadata的地方)
        try {
            this.selector.poll(Utils.min(timeout, metadataTimeout, defaultRequestTimeoutMs));
        } catch (IOException e) {
            log.error("Unexpected error during I/O", e);
        }

        // process completed actions
        long updatedNow = this.time.milliseconds();
        List<ClientResponse> responses = new ArrayList<>();
        // 通过selector中获取Server端的response
        //  for (Send send : this.selector.completedSends()) {
        handleCompletedSends(responses, updatedNow); 
        // 在返回的handler中,会处理metadata的更新
        // metadataUpdater.handleCompletedMetadataResponse(req.header, now, (MetadataResponse) body);
        handleCompletedReceives(responses, updatedNow); 
        handleDisconnections(responses, updatedNow);
        handleConnections();
        handleInitiateApiVersionRequests(updatedNow);
        handleTimedOutRequests(responses, updatedNow);
        completeResponses(responses);

        return responses;
    }
=> 判断Metadata是否需要更新,如果需要更新,先与Broker建立连接,然后发送更新metadata请求
    public long maybeUpdate(long now) {
        // should we update our metadata?
        // metadata是否应该更新
        long timeToNextMetadataUpdate = metadata.timeToNextUpdate(now); // metadata下次更新的时间(需要判断是强制更新还是metadata过期更新,前者是立马更新,后者是计算metadata的过期时间)
        // 如果一条metadata的fetch请求还未从server收到回复,那么时间设置为waitForMetadataFetch(默认30s)
        long waitForMetadataFetch = this.metadataFetchInProgress ? defaultRequestTimeoutMs : 0;

        long metadataTimeout = Math.max(timeToNextMetadataUpdate, waitForMetadataFetch);

        if (metadataTimeout > 0) { // 时间未到时,直接返回下次应该更新的时间
            return metadataTimeout;
        }

        // 选择一个连接数最小的节点
        Node node = leastLoadedNode(now);
        if (node == null) {
            log.debug("Give up sending metadata request since no node is available");
            return reconnectBackoffMs;
        }

        return maybeUpdate(now, node); // 可以发送metadata请求的话,就发送metadata请求
    }

    // 判断是否可以发送请求,可以的话将metadata请求加入到发送列表中
    private long maybeUpdate(long now, Node node) {
        String nodeConnectionId = node.idString();
        if (canSendRequest(nodeConnectionId, now)) { // 通道已经准备好,并且支持发送更多的请求
            this.metadataFetchInProgress = true; // 准备开始发送数据,将metadataFetchInProgress置为true
            MetadataRequest.Builder metadataRequest; // // 创建metadata请求
            if (metadata.needMetadataForAllTopics()) // 强制更新所有topic的metadata(虽然默认不会更新所有topic的 metadata信息,但是每个Broker会保存所有topic的meta信息)
                metadataRequest = MetadataRequest.Builder.allTopics();
            else // 只更新metadata中的topics列表(列表中的topics由metadata.add()得到)
                metadataRequest = new MetadataRequest.Builder(new ArrayList<>(metadata.topics()),
                        metadata.allowAutoTopicCreation());
            log.debug("Sending metadata request {} to node {}", metadataRequest, node);
            sendInternalMetadataRequest(metadataRequest, nodeConnectionId, now); // 发送metadata请求
            return defaultRequestTimeoutMs;
        }
        // 如果client正在与任何一个node的连接状态是connecting,那么就进行等待
        if (isAnyNodeConnecting()) {
            // Strictly the timeout we should return here is "connect timeout", but as we don't
            // have such application level configuration, using reconnect backoff instead.
            return reconnectBackoffMs;
        }
        // 如果没有连接这个node,那就初始化连接
        if (connectionStates.canConnect(nodeConnectionId, now)) {
            // we don't have a connection to this node right now, make one
            log.debug("Initialize connection to node {} for sending metadata request", node);
            initiateConnect(node, now); // 初始化连接
            return reconnectBackoffMs;
        }
        // connected, but can't send more OR connecting
        // In either case, we just need to wait for a network event to let us know the selected
        // connection might be usable again.
        return Long.MAX_VALUE;
    }

    // 发送metadata请求
    private void sendInternalMetadataRequest(MetadataRequest.Builder builder,String nodeConnectionId, long now) {
        ClientRequest clientRequest = newClientRequest(nodeConnectionId, builder, now, true);
        doSend(clientRequest, true, now);
    }

    / 处理任何已经完成的接收响应
    private void handleCompletedReceives(List<ClientResponse> responses, long now) {
        for (NetworkReceive receive : this.selector.completedReceives()) {
            String source = receive.source();
            InFlightRequest req = inFlightRequests.completeNext(source);
            Struct responseStruct = parseStructMaybeUpdateThrottleTimeMetrics(receive.payload(), req.header,
                throttleTimeSensor, now);
            if (log.isTraceEnabled()) {
                log.trace("Completed receive from node {} for {} with correlation id {}, received {}", req.destination,
                    req.header.apiKey(), req.header.correlationId(), responseStruct);
            }
            // If the received response includes a throttle delay, throttle the connection.
            AbstractResponse body = AbstractResponse.parseResponse(req.header.apiKey(), responseStruct);
            maybeThrottle(body, req.header.apiVersion(), req.destination, now);
            if (req.isInternalRequest && body instanceof MetadataResponse) // 如果是meta响应
                metadataUpdater.handleCompletedMetadataResponse(req.header, now, (MetadataResponse) body);
            else if (req.isInternalRequest && body instanceof ApiVersionsResponse)
                handleApiVersionsResponse(responses, req, now, (ApiVersionsResponse) body);
            else
                responses.add(req.completed(body, now));
        }
    }

class DefaultMetadataUpdater implements MetadataUpdater {
    / 处理Server端对Metadata请求处理后的响应
    @Override
    public void handleCompletedMetadataResponse(RequestHeader requestHeader, long now, MetadataResponse response) {
        this.metadataFetchInProgress = false;
        Cluster cluster = response.cluster();

        // If any partition has leader with missing listeners, log a few for diagnosing broker configuration
        // issues. This could be a transient issue if listeners were added dynamically to brokers.
        List<TopicPartition> missingListenerPartitions = response.topicMetadata().stream().flatMap(topicMetadata ->
            topicMetadata.partitionMetadata().stream()
                .filter(partitionMetadata -> partitionMetadata.error() == Errors.LISTENER_NOT_FOUND)
                .map(partitionMetadata -> new TopicPartition(topicMetadata.topic(), partitionMetadata.partition())))
            .collect(Collectors.toList());
        if (!missingListenerPartitions.isEmpty()) {
            int count = missingListenerPartitions.size();
            log.warn("{} partitions have leader brokers without a matching listener, including {}",
                    count, missingListenerPartitions.subList(0, Math.min(10, count)));
        }

        // check if any topics metadata failed to get updated
        Map<String, Errors> errors = response.errors();
        if (!errors.isEmpty())
            log.warn("Error while fetching metadata with correlation id {} : {}", requestHeader.correlationId(), errors);

        // don't update the cluster if there are no valid nodes...the topic we want may still be in the process of being
        // created which means we will get errors and no nodes until it exists
        if (cluster.nodes().size() > 0) {
            // 更新meta信息
            this.metadata.update(cluster, response.unavailableTopics(), now);
        } else {
            // 如果metadata中node信息无效,则不更新信息
            log.trace("Ignoring empty metadata response with correlation id {}.", requestHeader.correlationId());
            this.metadata.failedUpdate(now, null);
        }
    }

```

每次Producer请求更新metadata时的情况

    如果node可以发送请求,则直接发送请求
    如果该node正在建立连接,则直接返回
    如果该node还没建立连接,则向broker初始化连接

KafkaProducer线程被两个while循环阻塞,直到metadata更新

    sender线程第一次调用poll,初始化与node的连接 if (connectionStates.canConnect(nodeConnectionId, now)) {
    sender线程第二次调用poll,发送Metadata请求   if (canSendRequest(nodeConnectionId, now)) {
    sender线程第三次调用poll,获取metadataResponse,更新metadata  

当不阻塞之后,Producer才会开始发送信息
NetworkClient接收到Server端对Metadata请求的响应后,更新metadata信息

KafkaProducer第一次发送信息时强制更新,其他时间周期性更新,通过lastRefreshMs,lastSuccessfulRefreshMs两个字段实现
强制更新:调用Metadata.requestUpdate()将needUpdate置为true

Metadata更新策略
强制更新触发:
    initConnect()初始化连接
    poll()对handleDisconnections()处理连接断开情况
    poll()对handleTimedOutRequests()处理请求超时
    发送信息时找不到partition的leader
    处理Producer响应(handleProduceResponse),如果返回关于metadata过期的异常

强制更新主要用于处理各种异常情况

获取Partition值

```
// 1.指明partition的情况下,直接将指明的值作为partition值
// 2.没有指明partition值但有key的情况下,将key的hash值与topic的partition数进行取余得到partition值
// 3.既没有partition值又没有key值,第一次调用时随机生成一个整数(后面每次调用在这个整数上自增),将这个值与topic的partition数进行取余得到partition值(Round-robin算法)

// record有partition值时直接返回,不然调用partitioner的partition方法去计算
private int partition(ProducerRecord<K, V> record, byte[] serializedKey, byte[] serializedValue, Cluster cluster) {
    Integer partition = record.partition();
    return partition != null ?
            partition :
            partitioner.partition(
                    record.topic(), record.key(), serializedKey, record.value(), serializedValue, cluster);
}

// Producer默认使用DefaultPartitioner,可以自定义partition策略
public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
    List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
    int numPartitions = partitions.size();
    if (keyBytes == null) { // 没有Key的情况下
        int nextValue = nextValue(topic); // 第一次生成随机整数,后面每次调用都自增
        List<PartitionInfo> availablePartitions = cluster.availablePartitionsForTopic(topic);
        // leader不为null,即为可用的partition
        if (availablePartitions.size() > 0) {
            int part = Utils.toPositive(nextValue) % availablePartitions.size();
            return availablePartitions.get(part).partition();
        } else {
            // no partitions are available, give a non-available partition
            return Utils.toPositive(nextValue) % numPartitions;
        }
    } else { // 有Key的情况,使用key的hash值进行计算
        // hash the keyBytes to choose a partition
        return Utils.toPositive(Utils.murmur2(keyBytes)) % numPartitions;
    }
}

private int nextValue(String topic) {
    AtomicInteger counter = topicCounterMap.get(topic);
    if (null == counter) { // 第一次调用,随机整数
        counter = new AtomicInteger(ThreadLocalRandom.current().nextInt());
        AtomicInteger currentCounter = topicCounterMap.putIfAbsent(topic, counter);
        if (currentCounter != null) {
            counter = currentCounter;
        }
    }
    return counter.getAndIncrement(); // 自增
}      
```
向Accumulator写数据
```
// Producer先将record写入到buffer中,当达到一个batch.size的大小时,唤起sender线程取发送ProducerBatch
// Producer通过RecordAccumulator实例追加数据,主要变量为ConcurrentMap<TopicPartition, Deque<ProducerBatch>> batches
// 每个TopicPartition都对应一个Deque<ProducerBatch>
// 当添加数据时,会向其topic-partition对应的这个queue最新创建的一个ProducerBatch中添加record
// 而发送数据时,则会先从queue中最老的那个RecordBatch开始发送

// 向accumulator添加一条record,并返回添加后的结果(结果包含,future metadata,batch是否满的标志以及新batch是否创建)
// 其中,maxTimeToBlock是buffer.memory的block的最大时间
public RecordAppendResult append(TopicPartition tp,
                                     long timestamp,
                                     byte[] key,
                                     byte[] value,
                                     Header[] headers,
                                     Callback callback,
                                     long maxTimeToBlock) throws InterruptedException {
    // We keep track of the number of appending thread to make sure we do not miss batches in
    // abortIncompleteBatches().
    appendsInProgress.incrementAndGet();
    ByteBuffer buffer = null;
    if (headers == null) headers = Record.EMPTY_HEADERS;
    try {
        // check if we have an in-progress batch
        Deque<ProducerBatch> dq = getOrCreateDeque(tp); // 每个topicPartition对应一个queue
        synchronized (dq) { // 在对一个queue进行操作时,会保证线程安全
            if (closed)
                throw new KafkaException("Producer closed while send in progress");
            RecordAppendResult appendResult = tryAppend(timestamp, key, value, headers, callback, dq); // 追加数据
            if (appendResult != null)
                return appendResult; // 这个topic-partition已经有记录了
        }

        // we don't have an in-progress record batch try to allocate a new batch
        // 为topic-partition创建一个新的ProducerBatch,需要初始化相应的ProducerBatch,要为其分配的大小是:max(batch.size,加上头文件的本条消息的大小)
        byte maxUsableMagic = apiVersions.maxUsableProduceMagic();
        int size = Math.max(this.batchSize, AbstractRecords.estimateSizeInBytesUpperBound(maxUsableMagic, compression, key, value, headers));
        log.trace("Allocating a new {} byte message buffer for topic {} partition {}", size, tp.topic(), tp.partition());
        buffer = free.allocate(size, maxTimeToBlock); // 给这个ProducerBatch初始化一个buffer
        synchronized (dq) {
            // Need to check if producer is closed again after grabbing the dequeue lock.
            if (closed)
                throw new KafkaException("Producer closed while send in progress");

            RecordAppendResult appendResult = tryAppend(timestamp, key, value, headers, callback, dq);
            if (appendResult != null) { // 如果突然发现这个queue已经存在,直接返回
                // Somebody else found us a batch, return the one we waited for! Hopefully this doesn't happen often...
                return appendResult;
            }

            // 给topic-partition创建一个ProducerBatch
            MemoryRecordsBuilder recordsBuilder = recordsBuilder(buffer, maxUsableMagic);
            ProducerBatch batch = new ProducerBatch(tp, recordsBuilder, time.milliseconds());
            // 向新的ProducerBatch中追加数据
            FutureRecordMetadata future = Utils.notNull(batch.tryAppend(timestamp, key, value, headers, callback, time.milliseconds()));

            // 将RecordBatch添加到对应的queue中
            dq.addLast(batch);
            // 向未ack的batch集合添加这个batch
            incomplete.add(batch);

            // Don't deallocate this buffer in the finally block as it's being used in the record batch
            buffer = null;
            // 如果dp.size()>1就证明这个queue有一个batch是可以发送了
            return new RecordAppendResult(future, dq.size() > 1 || batch.isFull(), true);
        }
    } finally {
        if (buffer != null)
            free.deallocate(buffer);
        appendsInProgress.decrementAndGet();
    }
}
```

发送ProducerBatch

```
// 当record写入成功后,如果发现ProducerBatch满足发送的条件(通常是queue中有多个Batch,那么最先添加的batch肯定是可以发送的)
// 那么就会唤醒sender线程,发送ProducerBatch
// sender线程对ProducerBatch的处理是在run()方法中进行的
void run(long now) {
    if (transactionManager != null) {
        try {
            if (transactionManager.shouldResetProducerStateAfterResolvingSequences())
                // Check if the previous run expired batches which requires a reset of the producer state.
                transactionManager.resetProducerId();
            if (!transactionManager.isTransactional()) {
                // this is an idempotent producer, so make sure we have a producer id
                maybeWaitForProducerId();
            } else if (transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()) {
                transactionManager.transitionToFatalError(
                    new KafkaException("The client hasn't received acknowledgment for " +
                        "some previously sent messages and can no longer retry them. It isn't safe to continue."));
            } else if (transactionManager.hasInFlightTransactionalRequest() || maybeSendTransactionalRequest(now)) {
                // as long as there are outstanding transactional requests, we simply wait for them to return
                client.poll(retryBackoffMs, now);
                return;
            }

            // do not continue sending if the transaction manager is in a failed state or if there
            // is no producer id (for the idempotent case).
            if (transactionManager.hasFatalError() || !transactionManager.hasProducerId()) {
                RuntimeException lastError = transactionManager.lastError();
                if (lastError != null)
                    maybeAbortBatches(lastError);
                client.poll(retryBackoffMs, now);
                return;
            } else if (transactionManager.hasAbortableError()) {
                accumulator.abortUndrainedBatches(transactionManager.lastError());
            }
        } catch (AuthenticationException e) {
            // This is already logged as error, but propagated here to perform any clean ups.
            log.trace("Authentication exception while processing transactional request: {}", e);
            transactionManager.authenticationFailed(e);
        }
    }

    // 发送Producer数据
    long pollTimeout = sendProducerData(now);
    client.poll(pollTimeout, now);
}

private long sendProducerData(long now) {
    Cluster cluster = metadata.fetch();
    // 获取那些已经可以发送的ProducerBatch对应的nodes
    RecordAccumulator.ReadyCheckResult result = this.accumulator.ready(cluster, now);

    // 如果有topic-partition的leader是未知的,就强制更新metadata
    if (!result.unknownLeaderTopics.isEmpty()) {
        for (String topic : result.unknownLeaderTopics)
            this.metadata.add(topic);

        log.debug("Requesting metadata update due to unknown leader topics from the batched records: {}",
            result.unknownLeaderTopics);
        this.metadata.requestUpdate();
    }

    // 如果与node没有连接(如果可以连接,同时初始化该连接),就证明该node暂时不能发送数据,暂时移除该node
    Iterator<Node> iter = result.readyNodes.iterator();
    long notReadyTimeout = Long.MAX_VALUE;
    while (iter.hasNext()) {
        Node node = iter.next();
        if (!this.client.ready(node, now)) {
            iter.remove();
            notReadyTimeout = Math.min(notReadyTimeout, this.client.pollDelayMs(node, now));
        }
    }

    // 返回该node对应的所有可以发送的ProducerBatch组成的batches(key是node.id),并将ProducerBatch从对应的queue中移除
    Map<Integer, List<ProducerBatch>> batches = this.accumulator.drain(cluster, result.readyNodes, this.maxRequestSize, now);
    addToInflightBatches(batches);
    if (guaranteeMessageOrder) {
        // 记录将要发送的ProducerBatch
        for (List<ProducerBatch> batchList : batches.values()) {
            for (ProducerBatch batch : batchList)
                this.accumulator.mutePartition(batch.topicPartition);
        }
    }

    accumulator.resetNextBatchExpiryTime();
    List<ProducerBatch> expiredInflightBatches = getExpiredInflightBatches(now);
    List<ProducerBatch> expiredBatches = this.accumulator.expiredBatches(now);
    expiredBatches.addAll(expiredInflightBatches);

    if (!expiredBatches.isEmpty())
        log.trace("Expired {} batches in accumulator", expiredBatches.size());
    // 将由于元数据不可用而导致发送超时的ProducerBatch移除
    for (ProducerBatch expiredBatch : expiredBatches) {
        String errorMessage = "Expiring " + expiredBatch.recordCount + " record(s) for " + expiredBatch.topicPartition
            + ":" + (now - expiredBatch.createdMs) + " ms has passed since batch creation";
        failBatch(expiredBatch, -1, NO_TIMESTAMP, new TimeoutException(errorMessage), false);
        if (transactionManager != null && expiredBatch.inRetry()) {
            transactionManager.markSequenceUnresolved(expiredBatch.topicPartition);
        }
    }
    sensors.updateProduceRequestMetrics(batches);

    long pollTimeout = Math.min(result.nextReadyCheckDelayMs, notReadyTimeout);
    pollTimeout = Math.min(pollTimeout, this.accumulator.nextExpiryTimeMs() - now);
    pollTimeout = Math.max(pollTimeout, 0);
    if (!result.readyNodes.isEmpty()) {
        log.trace("Nodes with data ready to send: {}", result.readyNodes);
        pollTimeout = 0;
    }
    // 发送ProducerBatch
    sendProduceRequests(batches, now);
    return pollTimeout;
}

private void sendProduceRequests(Map<Integer, List<ProducerBatch>> collated, long now) {
    for (Map.Entry<Integer, List<ProducerBatch>> entry : collated.entrySet())
        sendProduceRequest(now, entry.getKey(), acks, requestTimeoutMs, entry.getValue());
}

// 发送哦Produce请求
// 将batches中leader为同一个node的所有ProducerBatch放在一个请求中进行发送
private void sendProduceRequest(long now, int destination, short acks, int timeout, List<ProducerBatch> batches) {
    if (batches.isEmpty())
        return;

    Map<TopicPartition, MemoryRecords> produceRecordsByPartition = new HashMap<>(batches.size());
    final Map<TopicPartition, ProducerBatch> recordsByPartition = new HashMap<>(batches.size());

    // find the minimum magic version used when creating the record sets
    byte minUsedMagic = apiVersions.maxUsableProduceMagic();
    for (ProducerBatch batch : batches) {
        if (batch.magic() < minUsedMagic)
            minUsedMagic = batch.magic();
    }

    for (ProducerBatch batch : batches) {
        TopicPartition tp = batch.topicPartition;
        MemoryRecords records = batch.records();

        // down convert if necessary to the minimum magic used. In general, there can be a delay between the time
        // that the producer starts building the batch and the time that we send the request, and we may have
        // chosen the message format based on out-dated metadata. In the worst case, we optimistically chose to use
        // the new message format, but found that the broker didn't support it, so we need to down-convert on the
        // client before sending. This is intended to handle edge cases around cluster upgrades where brokers may
        // not all support the same message format version. For example, if a partition migrates from a broker
        // which is supporting the new magic version to one which doesn't, then we will need to convert.
        if (!records.hasMatchingMagic(minUsedMagic))
            records = batch.records().downConvert(minUsedMagic, 0, time).records();
        produceRecordsByPartition.put(tp, records);
        recordsByPartition.put(tp, batch);
    }

    String transactionalId = null;
    if (transactionManager != null && transactionManager.isTransactional()) {
        transactionalId = transactionManager.transactionalId();
    }
    ProduceRequest.Builder requestBuilder = ProduceRequest.Builder.forMagic(minUsedMagic, acks, timeout,
            produceRecordsByPartition, transactionalId);
    RequestCompletionHandler callback = new RequestCompletionHandler() {
        public void onComplete(ClientResponse response) {
            handleProduceResponse(response, recordsByPartition, time.milliseconds());
        }
    };

    String nodeId = Integer.toString(destination);
    ClientRequest clientRequest = client.newClientRequest(nodeId, requestBuilder, now, acks != 0,
            requestTimeoutMs, callback);
    client.send(clientRequest, now);
    log.trace("Sent produce request to {}: {}", nodeId, requestBuilder);
}
```
#### 4. sendOffsetsToTransaction

**Summary: **
Apart from adding newly produced messages to the transaction, we have to take care of consumed offsets, as those should be committed at the same time as the transaction,
adding those offsets to the transaction, so the transaction coordinator can commit them when we are done with the transaction.

The following steps are executed on the producer when sendOffsetsToTransaction is called:
1.	Check if it is currently within a transaction, if not throw an exception; otherwise proceed to the next step.
2.	Check if this function has ever been called for the given groupId within this transaction. If not then send an AddOffsetsToTxnRequest to the transaction coordinator, block until the corresponding response is received; otherwise proceed to the next step.
3.	Send a TxnOffsetCommitRequest to the coordinator return from the response in the previous step, block until the corresponding response is received.


**[SourceCode](https://github.com/apache/kafka/blob/2.3/clients/src/main/java/org/apache/kafka/clients/producer/KafkaProducer.java#L669): **
```
    public void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets,
                                     String consumerGroupId) throws ProducerFencedException {
        throwIfNoTransactionManager();
        throwIfProducerClosed();
[5]     TransactionalRequestResult result = transactionManager.sendOffsetsToTransaction(offsets, consumerGroupId);
[6]     sender.wakeup();
        result.await();
    }
```
This is fairly simple:

    Line 5 - We are preparing a request with consumed offsets and queueing it to be sent.
    Line 6 - Here, the Sender thread is being wakened up. It will send the aforementioned request.



#### 5. commitTransaction/abortTransaction

**Summary: **
As a last step, the producer is informing the transaction coordinator that it should finish the transaction and inform all involved nodes about that:

The following steps are executed on the producer when commitTransaction is called:
1.	Check if there is an active transaction, if not throw an exception; otherwise proceed to the next step.
2.	Call flush to make sure all sent messages in this transactions are acknowledged.
3.	Send an EndTxnRequest with COMMIT command to the transaction coordinator, block until the corresponding response is received.

The following steps are executed on the producer when abortTransaction is called:
1.	Check if there is an active transaction, if not throw an exception; otherwise proceed to the next step.
2.	Immediately fail and drop any buffered messages that are transactional. Await any in-flight messages which haven’t been acknowledged. 
3.	Send an EndTxnRequest with ABORT command to the transaction coordinator, block until the corresponding response is received.


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

#### Fence机制实例
下面图示来自[When Kafka transactions might fail](https://tgrez.github.io/posts/2019-04-13-kafka-transactions.html)
wrong:
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_1.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_2.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_3.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_4.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_5.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_6.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_7.png)

correct:
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_8.png)
![](/docs/docs_image/software/buildingblock/kafka/kafka_producer_9.png)

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

### 幂等性 idempotent producer

https://cwiki.apache.org/confluence/display/KAFKA/Idempotent+Producer

Idempotent producer ensures **exactly once message delivery per partition**

> To enable idempotence, the enable.idempotence configuration must be set  to true. If set, the retries config will be defaulted to  Integer.MAX_VALUE, the max.in.flight.requests.per.connection config will be defaulted to 1, and acks config will be defaulted to all. There are  no API changes for the idempotent producer, so existing applications  will not need to be modified to take advantage of this feature.

简单说幂等性就是，当发生网络异常或者其他情况时，producer会重试，但是kafka集群会保证消息不重复，重试某条信息1万次即使全部成功，kafka集群也只会保存一条信息，

设置 enable.idempotence=true 即可，

**尽量不要设置retries这个配置参数，使用默认的最大值即可，不然可能会丢失数据**，如果显示设置了retries就一定要设置 max.in.flight.requests.per.connection=1，不然可能会乱序

Setting a value greater than zero will cause the client to resend any record whose send fails with a potentially transient error. Note that this retry is no different than if the client resent the record upon receiving the error. Allowing retries without setting  MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1 will potentially change the ordering of records because if two batches are sent to a single partition, and the first fails and is retried but the second succeeds, then the records in the second batch may appear first.

https://stackoverflow.com/questions/55192852/transactional-producer-vs-just-idempotent-producer-java-exception-outoforderseq/66579532#66579532



How does this feature work? Under the  covers, it works in a way similar to TCP: each batch of messages sent to Kafka will contain a sequence number that the broker will use to dedupe any duplicate send. Unlike TCP, though—which provides guarantees only  within a transient in-memory connection—this sequence number is  persisted to the replicated log, so even if the leader fails, any broker that takes over will also know if a resend is a duplicate. The overhead of this mechanism is quite low: it’s just a few extra numeric fields  with each batch of messages. As you will see later in this article, this feature adds negligible performance overhead over the non-idempotent  producer.

## 3. brokers 服务端

### Transaction Coordinator

Each broker will construct a transaction coordinator module during the initialization process. The transaction coordinator handles requests from the transactional producer to keep track of their transaction status, and at the same time maintain their PIDs across multiple sessions via client-provided TransactionalIds. The transaction coordinator maintains the following information in memory:
1.	A map from TransactionalId to assigned PID, plus current epoch number, and 2) the transaction timeout value.
2.	A map from PID to the current ongoing transaction status of the producer indicated by the PID, plus the participant topic-partitions, and the last time when this status was updated.
In addition, the transaction coordinator also persists both mappings to the transaction topic partitions it owns, so that they can be used for recovery.

#### Transaction Log
the transaction log is stored as an internal transaction topic partitioned among all the brokers. Log compaction is turned on by default on the transaction topic. Messages stored in this topic have versions for both the key and value fields:
```
/* Producer TransactionalId mapping message */
Key => Version TransactionalId  
  Version => 0 (int16)
  TransactionalId => String
Value => Version ProducerId ProducerEpoch TxnTimeoutDuration TxnStatus [TxnPartitions] TxnEntryLastUpdateTime TxnStartTime
  Version => 0 (int16)
  ProducerId => int64
  ProducerEpoch => int16
  TxnTimeoutDuration => int32
  TxnStatus => int8
  TxnPartitions => [Topic [Partition]]
     Topic => String
     Partition => int32
  TxnLastUpdateTime => int64
  TxnStartTime => int64

```
The status field above has the following possible values:
BEGIN	The transaction has started.
PREPARE_COMMIT	The transaction will be committed.
PREPARE_ABORT	The transaction will be aborted.
COMPLETE_COMMIT	The transaction was committed.
COMPLETE_ABORT	The transaction was aborted.

Writing of the PREPARE_XX transaction message can be treated as the synchronization point: once it is appended (and replicated) to the log, the transaction is guaranteed to be committed or aborted. And even when the coordinator fails, upon recovery, this transaction will be rolled forward or rolled back as well.
Writing of the TransactionalId message can be treated as persisting the creation or update of the TransactionalId -> PID entry. Note that if there are more than one transaction topic partitions owned by the transaction coordinator, the transaction messages are written only to the partition that the TransactionalId entry belongs to.
We will use the timestamp of the transaction status message in order to determine when the transaction has timed out using the transaction timeout from the InitPidRequest (which is stored in the TransactionalId mapping message). Once the difference between the current time and the timestamp from the status message exceeds the timeout, the transaction will be aborted. 
This works similarly for expiration of the TransactionalId, but note 1) that the transactionalId will not be expired if there is an on-going transaction, and 2) if the client corresponding to a transactionalId has not begun any transactions, we use the timestamp from the mapping message for expiration.
When a transaction is completed (whether aborted or committed), the transaction state of the producer is changed to Completed and we clear the set of topic partitions associated with the completed transaction.


#### Transaction Coordinator Startup

Upon assignment of one of the transaction log partitions by the controller (i.e., upon getting elected as the leader of the partition), the coordinator will execute the following steps:
1.	Read its currently assigned transaction topic partitions and bootstrap the Transaction status cache. The coordinator will scan the transaction log from the beginning, verify basic consistency, and materialize the entries. It performs the following actions as it reads the entries from the transaction log:
a.	Check whether there is a previous entry with the same TransactionalId and a higher epoch. If so, throw an exception. In particular, this indicates the log is corrupt. All future transactional RPCs to this coordintaor will result in a `NotCoordinatorForTransactionalId` error code, and this partition of the log will be effectively disabled.
b.	Update the transaction status cache for the transactionalId in question with the contents of the current log entry, including the last update time, and partitions in the transaction, and status. If there are multiple log entries with the same transactionalId, the last copy will be the one which remains materialized in the cache. The log cleaner will eventually compact out the older copies.

When committing a transaction, the following steps will be executed by the coordinator:
1.	Send an WriteTxnMarkerRequest with the COMMIT marker to all the leaders of the transaction’s added partitions.
2.	When all the responses have been received, append a COMPLETE_COMMIT transaction message to the transaction topic. We do not need to wait for this record to be fully replicated since otherwise we will just redo this protocol again.

When aborting a transaction, the following steps will be executed by the coordinator:
1.	Send an WriteTxnMarkerRequest with the ABORT marker to all the host brokers of the transaction partitions.
2.	When all the responses have been received, append a COMPLETE_ABORT transaction message to the transaction topic. Do not need to wait for this record to be fully replicated since otherwise we will just redo this protocol again.

Discussion on Unavailable Partitions. When committing or aborting a transaction, if one of the partitions involved in the commit is unavailable, then the transaction will be unable to be completed. Concretely, say that we have appended a PREPARE_COMMIT message to the transaction log, and we are about to send the WriteTxnMarkerRequest, but one of the partitions is unavailable. We cannot complete the commit until the partition comes back online, at which point the “roll forward” logic will be executed again. This may cause a transaction to be delayed longer than the transaction timeout, but there is no alternative since consumers may be blocking awaiting the transaction’s completion. It is important to keep in mind that we  strongly rely on partition availability for progress. Note, however, that consumers in READ_COMMITTED mode will only be blocked from consumption on the unavailable partition; other partitions included in the transaction can be consumed before the transaction has finished rolling forward.

#### Transaction Coordinator Request Handling
When receiving the InitPidRequest from a producer with a non-empty TransactionalId (see here for handling the empty case), the following steps will be executed in order to send back the response:
1.	Check if it is the assigned transaction coordinator for the TransactionalId, if not reply with the NotCoordinatorForTransactionalId error code.
2.	If there is already an entry with the TransactionalId in the mapping, check whether there is an ongoing transaction for the PID. If there is and it has not been completed, then follow the abort logic. If the transaction has been prepared, but not completed, await its completion. We will only move to the next step after there is no incomplete transaction for the PID.
3.	Increment the epoch number, append the updated TransactionalId message. If there is no entry with the TransactionalId in the mapping, construct a PID with the initialized epoch number; append an TransactionalId message into the transaction topic, insert into the mapping and reply with the PID / epoch / timestamp. 
4.	Respond with the latest PID and Epoch for the TransactionalId.
Note that coordinator’s PID construction logic does NOT guarantee that it will always result in the same PID for a given TransactionalId (more details discussed here). In fact, in this design we make minimal assumptions about the PID returned from this API, other than that it is unique (across the Kafka cluster) and will never be assigned twice. One potential way to do this is to use Zookeeper to reserve blocks of the PID space on each coordinator. For example, when broker 0 is first initialized, it can reserve PIDs 0-100, while broker 1 can reserve 101-200. In this way, the broker can ensure that it provides unique PIDs without incurring too much additional overhead.

When receiving the AddPartitionsToTxnRequest from a producer, the following steps will be executed in order to send back the response.
1.	If the TransactionalId does not exist in the TransactionalId mapping or if the mapped PID is different from that in the request, reply with InvalidPidMapping; otherwise proceed to next step.
2.	If the PID’s epoch number is different from the current TransactionalId PID mapping, reply with the InvalidProducerEpoch error code; otherwise proceed to next step.
3.	Check if there is already an entry in the transaction status mapping.
a.	If there is already an entry in the transaction status mapping, check if its status is BEGIN and the epoch number is correct, if yes append an transaction status message into the transaction topic with the updated partition list, wait for this message to be replicated, update the transaction status entry and timestamp in the TransactionalId map and reply OK; otherwise reply with InvalidTxnRequest error code.
b.	Otherwise append a BEGIN transaction message into the transaction topic, wait for this message to be replicated and then insert it into the transaction status mapping and update the timestamp in the TransactionalId map and reply OK.

When receiving the AddOffsetsToTxnRequest from a producer, the following steps will be executed in order to send back the response.
1.	If the TransactionalId does not exist in the TransactionalId mapping or if the mapped PID is different from that in the request, reply with InvalidPidMapping; otherwise proceed to next step.
2.	If the PID’s epoch number is different from the current TransactionalId mapping, reply with the InvalidProducerEpoch error code; otherwise proceed to next step.
3.	If there is already an entry in the transaction status mapping, check if its status is BEGIN and the epoch number is correct, if yes calculate the internal offset topic partition based on the ConsumerGroupID field, append a BEGIN transaction message into the transaction topic with updated partition list, wait for this message to be replicated, update the transaction status entry and the timestamp in the TransactionalId map and reply OK with the calculated partition’s lead broker as the consumer coordinator; otherwise reply with InvalidTxnRequest error code.
4.	If there is no entry in the transaction status mapping reply with InvalidTxnRequest error code.

When receiving the EndTxnRequest from a producer, the following steps will be executed in order to send back the response.
1.	If the TransactionalId does not exist in the TransactionalId mapping or if the mapped PID is different from that in the request, reply with InvalidPidMapping; otherwise proceed to next step.
2.	Check if the PID’s epoch number is correct against the TransactionalId mapping. If not, reply with the InvalidProducerEpoch error code; otherwise proceed to the next step.
3.	If there is already an entry in the transaction status mapping, check its status
a.	If the status is BEGIN, go on to step 4.
b.	If the status is COMPLETE_COMMIT and the command from the EndTxnRequest is COMMIT, return OK.
c.	If the status is COMPLETE_ABORT and the command from the EndTxnRequest is ABORT, return OK.
d.	Otherwise, reply with InvalidTxnRequest error code.
4.	Update the timestamp in the TransactionalId map.
5.	Depending on the command field of the request, append a PREPARE_XX transaction message to the transaction topic with all the transaction partitions kept in the transaction status map, wait until the message is replicated.
6.	Commit or abort the transaction following the procedure depending on the command field. 
7.	Reply OK.

Discussion on Coordinator Committing Transactions. The main motivation for having the transaction coordinator complete the commit / abort protocol after the PREPARE_XXX transaction message is appended to the transaction log is to keep the producer client thin (i.e. not letting producers to send the request to brokers to write transaction markers), and to ensure that transactions will always eventually be completed. However, it comes with an overhead of increased inter-broker communication traffic: suppose there are N producers sending messages in transactions, and each producer’s transaction rate is M/sec, and each transaction touches P topic partitions on average, inter-broker communications will be increased by M * N * P round trips per sec. We need to conduct some system performance test to make sure this additional inter-broker traffic would not largely impact the broker cluster.

Discussion on Coordinator Failure During Transaction Completion: It is possible for the coordinator to fail at any time during the completion of a transaction. In general, the client responds by finding the new coordinator and retrying the EndTxnRequest. If the coordinator had already written the PREPARE_COMMIT or PREPARE_ABORT status to the transaction log, and had begun writing the corresponding markers to the data partitions, then the new coordinator may repeat some of this work (i.e. there may be duplicate COMMIT or ABORT markers in the log), but this is not a problem as long as no new transactions have been started by the same producer. It is also possible for the coordinator to fail after writing the COMPLETE_COMMIT or COMPLETE_ABORT status, but before the EndTxnRequest had returned to the user. In this case, the client will retry the EndTxnRequest after finding the new coordinator. As long as the command matches the completed state of the transaction after coordinator recovery, the coordinator will return a successful response. If not for this, there would be no way for the client to determine what happened to the transaction.

#### Coordinator-side Transaction Expiration
When a producer fails, its transaction coordinator should be able to pro-actively expire its ongoing transaction. In order to do so, the transaction coordinator will periodically trigger the following procedure:
1.	Scan the transaction status map in memory. For each transaction:
a.	If its status is BEGIN, and its corresponding expire timestamp is smaller than the current timestamp, pro-actively expire the transaction by doing the following:
i.	First void the PID by bumping up the epoch number in the TransactionalId map and writing a new TransactionalId message into the transaction log. Wait for it to be fully replicated.
ii.	Then rollback the transaction following the procedure with the bumped up epoch number, so that brokers can update their cached PID as well in order to fence Zombie writers (see more discussions below).
b.	If its status is PREPARE_COMMIT, then complete the committing process of the transaction.
c.	If its status is PREPARE_ABORT, then complete the aborting process of the transaction.

Discussion on Pro-active Transaction Timeout. One motivation to let transaction coordinator to pro-actively timeout transactions is that upon producer failure, we do not want to rely on the producer eventually recovering and completing the transaction: for example, if a producer fails within a transaction and the coordinator does not pro-actively abort it, this transaction will become a “dangling” transaction that will not be completed until the producer resumes with the same TransactionalId, and any consumers fetching on the partitions included in this transaction in READ_COMMITTED will be effectively blocked waiting for the LSO to advance. This issue will be more severe if one topic partition has multiple transactional producers writing to it in an interleaving交错 manner, since one dangling transaction will cause all other transactions to not be able to be consumed due to the offset ordering.
One question though, is whether a pro-active timeout of a transaction will still fence a zombie writer. The short answer is yes. Upon timing out and aborting the transaction, the coordinator will bump the epoch associated with the PID and write ABORT markers to all partitions which had been included in the transaction. If the zombie is still attempting to write to any of these partitions, it will be fenced as soon as the ABORT marker is written. Alternatively, if it attempts to commit or abort the transaction, it will also be fenced by the coordinator.

#### Coordinator TransactionalId Expiration
Ideally, we would like to keep TransactionalId entries in the mapping forever, but for practical purposes we want to evict the ones that are not used any longer to avoid having the mapping growing without bounds. Consequently, we need a mechanism to detect inactivity and evict the corresponding identifiers. In order to do so, the transaction coordinator will periodically trigger the following procedure:
1.	Scan the TransactionalId map in memory. For each TransactionalId -> PID entry, if it does NOT have a current ongoing transaction in the transaction status map, AND the age of the last completed transaction is greater than the TransactionalId expiration config, remove the entry from the map. We will write the tombstone for the TransactionalId, but do not care if it fails, since in the worst case the TransactionalId will persist for a little longer (ie. the transactional.id.expration.ms duration).

Discussion on PID Expiration: It is possible for a producer to continue using the PID that its TransactionalId was mapped to in a non-transactional way even after the TransactionalId has been expired. If the producer continues writing to partitions without starting a new transaction, its PID will remain in the broker’s sequence table as long as the messages are still present in the log. It is possible for another producer using the same TransactionalId to then acquire a new PID from the transaction coordinator and either begin using transactions or “idempotent mode.” This does not violate any of the guarantees of either the idempotent or transactional producers. 
1.	For the transactional producer, we guarantee that there can be only one active producer at any time. Since we ensure that active transactions are completed before expiring an TransactionalId, we can guarantee that a zombie producer will be fenced when it tries to start another one (whether or not a new producer with the same TransactionalId has generated a new PID mapping).
2.	For the idempotent producer (i.e., producer that do not use transactional APIs), currently we do not make any cross-session guarantees in any case. In the future, we can extend this guarantee by having the producer to periodically send InitPidRequest to the transaction coordinator to keep the TransactionalId from expiring, which preserves the producer’s zombie defence.

### Broker

Besides fencing duplicate messages and Zombie writers based on the PID, epoch and sequence number in the produce request as described in the Transactional Producer section, each broker must also handle requests sent from the transaction coordinators for writing the commit and abort markers into the log.
At the same time, brokers also need to handle requests from clients asking for their assigned coordinator, which will be the leader broker of the transaction topic’s partition calculated from the producer’s TransactionalId.

### Consumer Coordinator
As mentioned in the summary, many Kafka streaming applications need to both consume from input topics and produce to output topics at the same time. When consumer offsets are committed for the input topics, they need to be done along with the produced transactions as well, such that for each message consumed from the input Kafka topics, the result message(s) of processing this message will be reflected in the output Kafka topics exactly once, even under failures. 
In order to support this scenario, we need to make the consumer coordinator transaction-aware. More specifically, we need a new API which allows the producer to send offset commits as part of a transaction. For this we introduce the TxnOffsetCommitRequest API.


## 4. Troubleshooting

### ERROR CODES
+ InvalidProducerEpoch: 
    this is a fatal error, meaning the producer itself is a zombie since another instance of the producer has been up and running, stop this producer and throw an exception.
+ InvalidPidMapping:
    the coordinator has no current PID mapping for this TransactionalId.  Establish a new one via the InitPidRequest with the TransactionalId.
+ NotCoordinatorForTransactionalId: 
    the coordinator is not assigned with the TransactionalId, try to re-discover the transaction coordinator from brokers via the FindCoordinatorRequest with the TransactionalId.
+ InvalidTxnRequest: 
    the transaction protocol is violated, this should not happen with the correct client implementation; so if it ever happens it means your client implementation is wrong.
+ CoordinatorNotAvailable: 
    the transaction coordinator is still initializing, just retry after backing off.
+ DuplicateSequenceNumber: 
    the sequence number from ProduceRequest is lower than the expected sequence number. In this case, the messages are duplicates and hence the producer can ignore this error and proceed to the next messages queued to be sent.
+ InvalidSequenceNumber: 
    this is a fatal error indicating the sequence number from ProduceRequest is larger than expected sequence number. Assuming a correct client, this should only happen if the broker loses data for the respective partition (i.e. log may have been truncated). Hence we should stop this producer and raise to the user as a fatal exception. 
+ InvalidTransactionTimeout: 
    fatal error sent from an InitPidRequest indicating that the timeout value passed by the producer is invalid (not within the allowable timeout range).


#### initTransactions - TimeoutException

Gets the internal producer id and epoch, used in all future transactional messages issued by the producer. Note that this method will raise TimeoutException if the transactional state cannot be initialized before expiration of max.block.ms. 
Additionally, it will raise InterruptException if interrupted. It is safe to retry in either case, but once the transactional state has been successfully initialized, this method should no longer be used.

#### beginTransaction / sendOffsetsToTransaction / commitTransaction / abortTransaction - ProducerFencedException

这些方法都会抛 ProducerFencedException 原理就是调用这些方法之前必须要先调用 initTransactions， initTransactions会分配每个transaction.id新的epoch，从而阻止zombie程序继续发送kafka transaction;
当然也会由于服务端的问题导致client这边Producer Transaction timeout从而引发reset pid和epoch 造成后续请求ProducerFencedException

### kafka某个节点所在机房突然断电又恢复后 transactional producer异常

```
2023-02-08 15:42:18.189 [32m INFO[m [35m21664GG[m [TEST-MANAGER] [36mo.a.k.c.FetchSessionHandler[m : 
[Consumer clientId=consumer-1, groupId=TEST-PRICEENGINE-SZL] 
Error sending fetch request (sessionId=132458226, epoch=271322) to node 0: org.apache.kafka.common.errors.DisconnectException.

2023-02-08 15:42:22.815 [33m WARN[m [35m21664GG[m [ad | producer-3] [36mo.a.k.c.p.i.Sender[m : 
[Producer clientId=producer-3, transactionalId=TEST-TID-0] 
Got error produce response with correlation id 851515 on topic-partition T-QUOTATION-SNP-0, retrying (2147483646 attempts left). Error: REQUEST_TIMED_OUT

2023-02-08 15:42:52.967 [33m WARN[m [35m21664GG[m [ad | producer-3] [36mo.a.k.c.p.i.Sender[m : 
[Producer clientId=producer-3, transactionalId=TEST-TID-0] 
Got error produce response with correlation id 851516 on topic-partition T-QUOTATION-SNP-0, retrying (2147483645 attempts left). Error: REQUEST_TIMED_OUT

2023-02-08 15:43:21.260 [32mDEBUG[m [35m21664GG[m [TEST-MANAGER] [36mc.q.c.c.b.SimpleWorkerManager[m : 
	Received 2 message(s)
2023-02-08 15:43:21.260 [32mDEBUG[m [35m21664GG[m [TEST-MANAGER] [36mc.q.c.c.b.SimpleWorkerManager[m : 
	Message header payload:P=0,O=2520208,C=com.lyhistory.test.TestMsgToKafka,V=1
2023-02-08 15:43:21.260 [32mDEBUG[m [35m21664GG[m [TEST-MANAGER] [36mc.q.c.c.b.SimpleWorkerManager[m : 
	Message header payload:P=0,O=2520209,C=com.lyhistory.test.TestMsgToKafka,V=1
2023-02-08 15:43:21.260 [32mDEBUG[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.c.b.AbstractWorker[m : 
	R=false, P=0, O=2520208, F=com.lyhistory.test.TestMsgToKafka
2023-02-08 15:43:21.260 [32m INFO[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.p.h.TestMsgHandler[m : 
	Offset [2520208], Partition [0], Handling TestMsgToKafka{tradableInstrumentId='BTC2303', priceType=LAST, marketPriceSource=EXTERNAL, price=23.465000, currency='USD', publishTime=1675842201252, updateUser='null', updateTime=1675842201252, tradeDate='20230208'}
2023-02-08 15:43:21.262 [32m INFO[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.p.h.TestMsgHandler[m : 
	Updated spot rate in price engine storage and REDIS. trade-date [20230208], tradable-instrument-id [BTC2303], price-type [LAST], price [23.465000]
2023-02-08 15:43:21.262 [32mDEBUG[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.c.b.AbstractWorker[m : 
	R=false, P=0, O=2520209, F=com.lyhistory.test.TestMsgToKafka
2023-02-08 15:43:21.262 [32m INFO[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.p.h.TestMsgHandler[m : 
	Offset [2520209], Partition [0], Handling TestMsgToKafka{tradableInstrumentId='BTC2302', priceType=LAST, marketPriceSource=EXTERNAL, price=23.320000, currency='USD', publishTime=1675842201252, updateUser='null', updateTime=1675842201252, tradeDate='20230208'}
2023-02-08 15:43:21.263 [32m INFO[m [35m21664GG[m [TEST-p0-1] [36mc.q.c.p.h.TestMsgHandler[m : 
	Updated spot rate in price engine storage and REDIS. trade-date [20230208], tradable-instrument-id [BTC2302], price-type [LAST], price [23.320000]
2023-02-08 15:43:22.789 [32m INFO[m [35m21664GG[m [EENGINE-TID-0-1] [36mc.l.d.IgnoreExceptionHandler[m : 
	Exception processing: 309941 ProduceActionWrapper{}

org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
	at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
	at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
	at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
	at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
	at com.lyhistory.core.producer.DisruptorProducer$$Lambda$914/1553377810.onEvent(Unknown Source)
	at com.lmax.disruptor.BatchEventProcessor.processEvents(BatchEventProcessor.java:168)
	at com.lmax.disruptor.BatchEventProcessor.run(BatchEventProcessor.java:125)
	at java.lang.Thread.run(Thread.java:745)
Caused by: org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker.
.....


2023-02-08 16:03:38.938 [32m INFO[m [35m21664GG[m [EENGINE-TID-2-1] [36mc.l.d.IgnoreExceptionHandler[m : Exception processing: 120 ProduceActionWrapper{}

org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
	at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
	at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
	at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
	at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
	at com.lyhistory.core.producer.DisruptorProducer$$Lambda$914/1553377810.onEvent(Unknown Source)
	at com.lmax.disruptor.BatchEventProcessor.processEvents(BatchEventProcessor.java:168)
	at com.lmax.disruptor.BatchEventProcessor.run(BatchEventProcessor.java:125)
	at java.lang.Thread.run(Thread.java:745)
Caused by: org.apache.kafka.common.KafkaException: The client hasn't received acknowledgment for some previously sent messages and can no longer retry them. It isn't safe to continue.
	at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:283)
	at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:235)
	... 1 more

.......


```
可以清楚的看到有两类错误信息，下面分别分析

#### ProducerFencedException


2023-02-08 15:43:22.789 [32m INFO[m [35m21664GG[m [EENGINE-TID-0-1] [36mc.l.d.IgnoreExceptionHandler[m : 
	Exception processing: 309941 ProduceActionWrapper{}

org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
	at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
	at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
	at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
	at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
	at com.lyhistory.core.producer.DisruptorProducer$$Lambda$914/1553377810.onEvent(Unknown Source)
	at com.lmax.disruptor.BatchEventProcessor.processEvents(BatchEventProcessor.java:168)
	at com.lmax.disruptor.BatchEventProcessor.run(BatchEventProcessor.java:125)
	at java.lang.Thread.run(Thread.java:745)
Caused by: org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker.

```
#at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
private void maybeFailWithError() {
        if (hasError())
            throw new KafkaException("Cannot execute transactional method because we are in an error state", lastError);
    }
synchronized boolean hasError() {
        return currentState == State.ABORTABLE_ERROR || currentState == State.FATAL_ERROR;
    }
《=
at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
public synchronized TransactionalRequestResult beginAbort() {
        ensureTransactional();
        if (currentState != State.ABORTABLE_ERROR)
            maybeFailWithError();
        transitionTo(State.ABORTING_TRANSACTION);

        // We're aborting the transaction, so there should be no need to add new partitions
        newPartitionsInTransaction.clear();
        return beginCompletingTransaction(TransactionResult.ABORT);
    }
所以确认 currentState == State.FATAL_ERROR
《=
at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
 /**
     * Aborts the ongoing transaction. Any unflushed produce messages will be aborted when this call is made.
     * This call will throw an exception immediately if any prior {@link #send(ProducerRecord)} calls failed with a
     * {@link ProducerFencedException} or an instance of {@link org.apache.kafka.common.errors.AuthorizationException}.
     *
     * @throws IllegalStateException if no transactional.id has been configured or no transaction has been started
     * @throws ProducerFencedException fatal error indicating another producer with the same transactional.id is active
     * @throws org.apache.kafka.common.errors.UnsupportedVersionException fatal error indicating the broker
     *         does not support transactions (i.e. if its version is lower than 0.11.0.0)
     * @throws org.apache.kafka.common.errors.AuthorizationException fatal error indicating that the configured
     *         transactional.id is not authorized. See the exception for more details
     * @throws KafkaException if the producer has encountered a previous fatal error or for any other unexpected error
     */
    public void abortTransaction() throws ProducerFencedException {
        throwIfNoTransactionManager();
        TransactionalRequestResult result = transactionManager.beginAbort();
        sender.wakeup();
        result.await();
    }
《=
at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
            try {
                rawProducer.commitTransaction();
                logger.debug("处理进度：P={}, BS={}, QO={}", id, transactionSize, queueOffset);
            } catch (Exception ex) {
                rawProducer.abortTransaction();
                throw new RuntimeException("处理信息时出现故障", ex);
            } finally {
                inTransactions = false;
            }

66行也就是rawProducer.abortTransaction();  
为什么此处的"处理信息时出现故障"没有打印出来，看到这里只是throw出去，然后实际上代码里用的是disruptor：

public DisruptorProducer(ProducerConfig config, int id) {
        this.config = Objects.requireNonNull(config, "生产配置信息不能为null");
        this.id = id;
        String transactionId = id >= 0 ? String.format("%s-TID-%d", config.getApplicationName(), id) : "TID-BLAST";
        this.rawProducer = new KafkaProducer<>(config.prepareFor(transactionId));
        this.rawProducer.initTransactions();

        this.disruptor = new Disruptor<>(ProduceActionWrapper::new, 1 << config.getQueueBitSize(), new NamedThreadFactory(transactionId));
        this.disruptor.handleEventsWith(this::realProduce);
        this.disruptor.setDefaultExceptionHandler(new IgnoreExceptionHandler());
        this.disruptor.start();
    }

    @SuppressWarnings("unchecked")
    private void realProduce(ProduceActionWrapper eventWrapper, long queueOffset, boolean endOfBatch) {
        if (!inTransactions) {
            rawProducer.beginTransaction();
            inTransactions = true;
            transactionSize = 0;
        }

        ProduceAction[] actions = eventWrapper.getActions();
        transactionSize = transactionSize + 1;
        for (ProduceAction action : actions) {
            rawProducer.send(action.getProducerRecord(), action.getCallback());
        }
        if (transactionSize >= config.getBatchSize() || endOfBatch) {
            try {
                rawProducer.commitTransaction();
                logger.debug("处理进度：P={}, BS={}, QO={}", id, transactionSize, queueOffset);
            } catch (Exception ex) {
                rawProducer.abortTransaction();
                throw new RuntimeException("处理信息时出现故障", ex);
            } finally {
                inTransactions = false;
            }
        }
    }

设置的是默认的这个 this.disruptor.setDefaultExceptionHandler(new IgnoreExceptionHandler());

public final class IgnoreExceptionHandler implements ExceptionHandler<Object>
{

    @Override
    public void handleEventException(final Throwable ex, final long sequence, final Object event)
    {
        logger.log(Level.INFO, "Exception processing: " + sequence + " " + event, ex);
    }
所以对应上了整个输出是INFO
2023-02-08 15:43:22.789 [32m INFO[m [35m21664GG[m [EENGINE-TID-0-1] [36mc.l.d.IgnoreExceptionHandler[m : 
	Exception processing: 309941 ProduceActionWrapper{}
但是为啥没有打印出“处理信息时出现故障”？IgnoreExceptionHandler拿到的ex不是 new RuntimeException("处理信息时出现故障", ex)？
又或者IgnoreExceptionHandler并不是处理这里throw的Exception的，所以外部也没有catch到这个exception？

anyway，我们确定的是最后的这段Exception是由 66行也就是rawProducer.abortTransaction() 引发的，然后引发的原因也分析了是因为有FATAL_ERROR，所以执行失败，而触发
} catch (Exception ex) {
                rawProducer.abortTransaction();
这段逻辑的cause则是：

Caused by: org.apache.kafka.common.errors.ProducerFencedException: Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker.

并没有给出stack trace 而是只给了这个ProducerFencedException，但是肯定是在执行
try {
                rawProducer.commitTransaction();
                logger.debug("处理进度：P={}, BS={}, QO={}", id, transactionSize, queueOffset);
            } catch (Exception ex) {
                rawProducer.abortTransaction();
这个try的这段的时候出错的，也就是在commitTransaction的时候抓到的，
=>
package org.apache.kafka.clients.producer;
public class KafkaProducer<K, V> implements Producer<K, V> {
    /**
     * Commits the ongoing transaction. This method will flush any unsent records before actually committing the transaction.
     *
     * Further, if any of the {@link #send(ProducerRecord)} calls which were part of the transaction hit irrecoverable
     * errors, this method will throw the last received exception immediately and the transaction will not be committed.
     * So all {@link #send(ProducerRecord)} calls in a transaction must succeed in order for this method to succeed.
     *
     * @throws IllegalStateException if no transactional.id has been configured or no transaction has been started
     * @throws ProducerFencedException fatal error indicating another producer with the same transactional.id is active
     * @throws org.apache.kafka.common.errors.UnsupportedVersionException fatal error indicating the broker
     *         does not support transactions (i.e. if its version is lower than 0.11.0.0)
     * @throws org.apache.kafka.common.errors.AuthorizationException fatal error indicating that the configured
     *         transactional.id is not authorized. See the exception for more details
     * @throws KafkaException if the producer has encountered a previous fatal or abortable error, or for any
     *         other unexpected error
     */
    public void commitTransaction() throws ProducerFencedException {
        throwIfNoTransactionManager();
        TransactionalRequestResult result = transactionManager.beginCommit();
        sender.wakeup();
        result.await();
    }

    public synchronized TransactionalRequestResult beginCommit() {
        ensureTransactional();
        maybeFailWithError();
        transitionTo(State.COMMITTING_TRANSACTION);
        return beginCompletingTransaction(TransactionResult.COMMIT);
    }
    private void maybeFailWithError() {
        if (hasError())
            throw new KafkaException("Cannot execute transactional method because we are in an error state", lastError);
    }
    synchronized boolean hasError() {
        return currentState == State.ABORTABLE_ERROR || currentState == State.FATAL_ERROR;
    }

倒查状态：
package org.apache.kafka.clients.producer.internals;
    public class TransactionManager {
        synchronized void transitionToAbortableError(RuntimeException exception) {
            if (currentState == State.ABORTING_TRANSACTION) {
                log.debug("Skipping transition to abortable error state since the transaction is already being " +
                        "aborted. Underlying exception: ", exception);
                return;
            }
            transitionTo(State.ABORTABLE_ERROR, exception);
        }

        synchronized void transitionToFatalError(RuntimeException exception) {
            transitionTo(State.FATAL_ERROR, exception);
        }
《=
    private void failBatch(ProducerBatch batch, long baseOffset, long logAppendTime, RuntimeException exception,
        boolean adjustSequenceNumbers) {
        if (transactionManager != null) {
            if (exception instanceof OutOfOrderSequenceException
                    && !transactionManager.isTransactional()
                    && transactionManager.hasProducerId(batch.producerId())) {
                log.error("The broker returned {} for topic-partition " +
                            "{} at offset {}. This indicates data loss on the broker, and should be investigated.",
                        exception, batch.topicPartition, baseOffset);

                // Reset the transaction state since we have hit an irrecoverable exception and cannot make any guarantees
                // about the previously committed message. Note that this will discard the producer id and sequence
                // numbers for all existing partitions.
                transactionManager.resetProducerId();
            } else if (exception instanceof ClusterAuthorizationException
                    || exception instanceof TransactionalIdAuthorizationException
                    || exception instanceof ProducerFencedException
                    || exception instanceof UnsupportedVersionException) {
                transactionManager.transitionToFatalError(exception);
            } else if (transactionManager.isTransactional()) {
                transactionManager.transitionToAbortableError(exception);
            }
《=
public class Sender implements Runnable {
    private long sendProducerData(long now) {
        ....................
        accumulator.resetNextBatchExpiryTime();
        List<ProducerBatch> expiredInflightBatches = getExpiredInflightBatches(now);
        List<ProducerBatch> expiredBatches = this.accumulator.expiredBatches(now);
        expiredBatches.addAll(expiredInflightBatches);

        // Reset the producer id if an expired batch has previously been sent to the broker. Also update the metrics
        // for expired batches. see the documentation of @TransactionState.resetProducerId to understand why
        // we need to reset the producer id here.
        if (!expiredBatches.isEmpty())
            log.trace("Expired {} batches in accumulator", expiredBatches.size());
        for (ProducerBatch expiredBatch : expiredBatches) {
            String errorMessage = "Expiring " + expiredBatch.recordCount + " record(s) for " + expiredBatch.topicPartition
                + ":" + (now - expiredBatch.createdMs) + " ms has passed since batch creation";
            failBatch(expiredBatch, -1, NO_TIMESTAMP, new TimeoutException(errorMessage), false);
            if (transactionManager != null && expiredBatch.inRetry()) {
                // This ensures that no new batches are drained until the current in flight batches are fully resolved.
                transactionManager.markSequenceUnresolved(expiredBatch.topicPartition);
            }
        }

        ...................
《=
/**
     * Run a single iteration of sending
     *
     * @param now The current POSIX time in milliseconds
     */
    void run(long now) {
        if (transactionManager != null) {
            try {
                if (transactionManager.shouldResetProducerStateAfterResolvingSequences())
                    // Check if the previous run expired batches which requires a reset of the producer state.
                    transactionManager.resetProducerId();
                if (!transactionManager.isTransactional()) {
                    // this is an idempotent producer, so make sure we have a producer id
                    maybeWaitForProducerId();
                } else if (transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()) {
                    transactionManager.transitionToFatalError(
                        new KafkaException("The client hasn't received acknowledgment for " +
                            "some previously sent messages and can no longer retry them. It isn't safe to continue."));
                } else if (transactionManager.hasInFlightTransactionalRequest() || maybeSendTransactionalRequest(now)) {
                    // as long as there are outstanding transactional requests, we simply wait for them to return
                    client.poll(retryBackoffMs, now);
                    return;
                }

                // do not continue sending if the transaction manager is in a failed state or if there
                // is no producer id (for the idempotent case).
                if (transactionManager.hasFatalError() || !transactionManager.hasProducerId()) {
                    RuntimeException lastError = transactionManager.lastError();
                    if (lastError != null)
                        maybeAbortBatches(lastError);
                    client.poll(retryBackoffMs, now);
                    return;
                } else if (transactionManager.hasAbortableError()) {
                    accumulator.abortUndrainedBatches(transactionManager.lastError());
                }
            } catch (AuthenticationException e) {
                // This is already logged as error, but propagated here to perform any clean ups.
                log.trace("Authentication exception while processing transactional request: {}", e);
                transactionManager.authenticationFailed(e);
            }
        }

        long pollTimeout = sendProducerData(now);
        client.poll(pollTimeout, now);
    }
    ...........

猜测事情经过应该是：
Producer send消息，然后sender在批量发送的时候sendProducerData因为broker那边的故障超时了，造成一些batch record处理超时，所以这里Sender会重置ProducerId
if (transactionManager.shouldResetProducerStateAfterResolvingSequences())
                    // Check if the previous run expired batches which requires a reset of the producer state.
                    transactionManager.resetProducerId();

但是继续阅读源码发现不管是failbatch还是resetProducerId都不会改变事务型producer的状态，：
 synchronized void resetProducerId() {
        if (isTransactional())
            throw new IllegalStateException("Cannot reset producer state for a transactional producer. " +
                    "You must either abort the ongoing transaction or reinitialize the transactional producer instead");
        setProducerIdAndEpoch(ProducerIdAndEpoch.NONE);
        this.nextSequence.clear();
        this.lastAckedSequence.clear();
        this.inflightBatchesBySequence.clear();
        this.partitionsWithUnresolvedSequences.clear();
        this.lastAckedOffset.clear();
    }

然后注意到failbatch里的
else if (transactionManager.isTransactional()) {
                transactionManager.transitionToAbortableError(exception);
            }

```
所以再次猜测事情经过应该是 failbatch这里将状态变成AbortableError，然后触发了前面的 maybeFailWithError 抛出
throw new KafkaException("Cannot execute transactional method because we are in an error state", lastError);
然后调用者抛出 commitTransaction 抛出 ProducerFencedException，
也不对，因为caused抛出的信息内容是(注意我这里分析的是stacktrace的第二段caused部分)：
Producer attempted an operation with an old epoch. Either there is a newer producer with the same transactionalId, or the producer's transaction has been expired by the broker.
并非
Cannot execute transactional method because we are in an error state

所以查到这个错误信息的error是对应代码的：
https://github.com/apache/kafka/blob/2.2/clients/src/main/java/org/apache/kafka/common/protocol/Errors.java

INVALID_PRODUCER_EPOCH(47, "Producer attempted an operation with an old epoch. Either there is a newer producer " +
            "with the same transactionalId, or the producer's transaction has been expired by the broker.",
            ProducerFencedException::new),
搜索reference可以发现，都是kafka client这边处理服务器端的response部分的代码：
kafka-clients-2.2.0.jar - C:\Users\yue.liu\.m2\repository\org\apache\kafka\kafka-clients\2.2.0
org.apache.kafka.clients.producer.internals
AddOffsetsToTxnHandler
handleResponse(AbstractResponse)
AddPartitionsToTxnHandler
handleResponse(AbstractResponse)
EndTxnHandler
handleResponse(AbstractResponse)
TxnOffsetCommitHandler
handleResponse(AbstractResponse)

所以答案实际上是在server端 [Coordinator-side Transaction Expiration](#coordinator-side-transaction-expiration)

##### 事情过程
```
at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
            try {
                rawProducer.commitTransaction();
                logger.debug("处理进度：P={}, BS={}, QO={}", id, transactionSize, queueOffset);
            } catch (Exception ex) {
                rawProducer.abortTransaction();
                throw new RuntimeException("处理信息时出现故障", ex);
            } finally {
                inTransactions = false;
            }
=>
 public void commitTransaction() throws ProducerFencedException {
        throwIfNoTransactionManager();
        TransactionalRequestResult result = transactionManager.beginCommit();
        sender.wakeup(); 唤醒sender
        result.await(); 等待
    }
=>
    public synchronized TransactionalRequestResult beginCommit() {
        ensureTransactional();
        maybeFailWithError();
        transitionTo(State.COMMITTING_TRANSACTION);
        return beginCompletingTransaction(TransactionResult.COMMIT);
    }
=>    
    private TransactionalRequestResult beginCompletingTransaction(TransactionResult transactionResult) {
        if (!newPartitionsInTransaction.isEmpty())
            enqueueRequest(addPartitionsToTransactionHandler());
        EndTxnRequest.Builder builder = new EndTxnRequest.Builder(transactionalId, producerIdAndEpoch.producerId,
                producerIdAndEpoch.epoch, transactionResult);
        EndTxnHandler handler = new EndTxnHandler(builder);
        enqueueRequest(handler);
        return handler.result;
    }
服务端返回response
private class EndTxnHandler extends TxnRequestHandler {
        
        @Override
        public void handleResponse(AbstractResponse response) {
            EndTxnResponse endTxnResponse = (EndTxnResponse) response;
            Errors error = endTxnResponse.error();

            if (error == Errors.NONE) {
                completeTransaction();
                result.done();
            } else if (error == Errors.COORDINATOR_NOT_AVAILABLE || error == Errors.NOT_COORDINATOR) {
                lookupCoordinator(FindCoordinatorRequest.CoordinatorType.TRANSACTION, transactionalId);
                reenqueue();
            } else if (error == Errors.COORDINATOR_LOAD_IN_PROGRESS || error == Errors.CONCURRENT_TRANSACTIONS) {
                reenqueue();
            } else if (error == Errors.INVALID_PRODUCER_EPOCH) {
                fatalError(error.exception());
            } else if (error == Errors.TRANSACTIONAL_ID_AUTHORIZATION_FAILED) {
                fatalError(error.exception());
            } else if (error == Errors.INVALID_TXN_STATE) {
                fatalError(error.exception());
            } else {
                fatalError(new KafkaException("Unhandled error in EndTxnResponse: " + error.message()));
            }
        }
    }
因为client在server端恢复期间通信超过transaction timeout的默认1分钟时间，所以kafka brokers bump epoch，使得当前的producer过期，返回response INVALID_PRODUCER_EPOCH，然后commitTransaction抛出ProducerFencedException被 try catch抓住后执行了 abortTransaction，然后就是前面stacktrace的过程了has error抛出org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
```
##### 验证

###### Client端配置 transaction.timeout.ms
```
// visible for testing
    @SuppressWarnings("unchecked")
    KafkaProducer(Map<String, Object> configs,
                  Serializer<K> keySerializer,
                  Serializer<V> valueSerializer,
                  Metadata metadata,
                  KafkaClient kafkaClient,
                  ProducerInterceptors interceptors,
                  Time time) {
        ProducerConfig config = new ProducerConfig(ProducerConfig.addSerializerToConfig(configs, keySerializer,
                valueSerializer));
                ...............
                this.transactionManager = configureTransactionState(config, logContext, log);
                ...............
}
private static TransactionManager configureTransactionState(ProducerConfig config, LogContext logContext, Logger log) {

        TransactionManager transactionManager = null;

        ...............

        if (idempotenceEnabled) {
            String transactionalId = config.getString(ProducerConfig.TRANSACTIONAL_ID_CONFIG);
            int transactionTimeoutMs = config.getInt(ProducerConfig.TRANSACTION_TIMEOUT_CONFIG);
            long retryBackoffMs = config.getLong(ProducerConfig.RETRY_BACKOFF_MS_CONFIG);
            transactionManager = new TransactionManager(logContext, transactionalId, transactionTimeoutMs, retryBackoffMs);
            if (transactionManager.isTransactional())
                log.info("Instantiated a transactional producer.");
            else
                log.info("Instantiated an idempotent producer.");
        }

        return transactionManager;
    }
 public synchronized TransactionalRequestResult initializeTransactions() {
        ensureTransactional();
        transitionTo(State.INITIALIZING);
        setProducerIdAndEpoch(ProducerIdAndEpoch.NONE);
        this.nextSequence.clear();
        InitProducerIdRequest.Builder builder = new InitProducerIdRequest.Builder(transactionalId, transactionTimeoutMs);
        InitProducerIdHandler handler = new InitProducerIdHandler(builder);
        enqueueRequest(handler);
        return handler.result;
    }
``` 
###### 服务端逻辑

接收配置 handleInitProducerIdRequest
```
core\src\main\scala\kafka\server\KafkaApis.scala
case ApiKeys.INIT_PRODUCER_ID => handleInitProducerIdRequest(request, requestLocal)

def handleInitProducerIdRequest(request: RequestChannel.Request, requestLocal: RequestLocal): Unit = {
    val initProducerIdRequest = request.body[InitProducerIdRequest]
    val transactionalId = initProducerIdRequest.data.transactionalId

    if (transactionalId != null) {
      if (!authHelper.authorize(request.context, WRITE, TRANSACTIONAL_ID, transactionalId)) {
        requestHelper.sendErrorResponseMaybeThrottle(request, Errors.TRANSACTIONAL_ID_AUTHORIZATION_FAILED.exception)
        return
      }
    } else if (!authHelper.authorize(request.context, IDEMPOTENT_WRITE, CLUSTER, CLUSTER_NAME, true, false)
        && !authHelper.authorizeByResourceType(request.context, AclOperation.WRITE, ResourceType.TOPIC)) {
      requestHelper.sendErrorResponseMaybeThrottle(request, Errors.CLUSTER_AUTHORIZATION_FAILED.exception)
      return
    }

    def sendResponseCallback(result: InitProducerIdResult): Unit = {
      def createResponse(requestThrottleMs: Int): AbstractResponse = {
        val finalError =
          if (initProducerIdRequest.version < 4 && result.error == Errors.PRODUCER_FENCED) {
            // For older clients, they could not understand the new PRODUCER_FENCED error code,
            // so we need to return the INVALID_PRODUCER_EPOCH to have the same client handling logic.
            Errors.INVALID_PRODUCER_EPOCH
          } else {
            result.error
          }
        val responseData = new InitProducerIdResponseData()
          .setProducerId(result.producerId)
          .setProducerEpoch(result.producerEpoch)
          .setThrottleTimeMs(requestThrottleMs)
          .setErrorCode(finalError.code)
        val responseBody = new InitProducerIdResponse(responseData)
        trace(s"Completed $transactionalId's InitProducerIdRequest with result $result from client ${request.header.clientId}.")
        responseBody
      }
      requestHelper.sendResponseMaybeThrottle(request, createResponse)
    }

    val producerIdAndEpoch = (initProducerIdRequest.data.producerId, initProducerIdRequest.data.producerEpoch) match {
      case (RecordBatch.NO_PRODUCER_ID, RecordBatch.NO_PRODUCER_EPOCH) => Right(None)
      case (RecordBatch.NO_PRODUCER_ID, _) | (_, RecordBatch.NO_PRODUCER_EPOCH) => Left(Errors.INVALID_REQUEST)
      case (_, _) => Right(Some(new ProducerIdAndEpoch(initProducerIdRequest.data.producerId, initProducerIdRequest.data.producerEpoch)))
    }

    producerIdAndEpoch match {
      case Right(producerIdAndEpoch) => txnCoordinator.handleInitProducerId(transactionalId, initProducerIdRequest.data.transactionTimeoutMs,
        producerIdAndEpoch, sendResponseCallback, requestLocal)
      case Left(error) => requestHelper.sendErrorResponseMaybeThrottle(request, error.exception)
    }
  }
  
core\src\main\scala\kafka\coordinator\transaction\TransactionCoordinator.scala

txnCoordinator.handleInitProducerId(transactionalId, initProducerIdRequest.data.transactionTimeoutMs,
        producerIdAndEpoch, sendResponseCallback, requestLocal)
		
 def handleInitProducerId(transactionalId: String,
                           transactionTimeoutMs: Int,
                           expectedProducerIdAndEpoch: Option[ProducerIdAndEpoch],
                           responseCallback: InitProducerIdCallback,
                           requestLocal: RequestLocal = RequestLocal.NoCaching): Unit = {

    if (transactionalId == null) {
      // if the transactional id is null, then always blindly accept the request
      // and return a new producerId from the producerId manager
      val producerId = producerIdManager.generateProducerId()
      responseCallback(InitProducerIdResult(producerId, producerEpoch = 0, Errors.NONE))
    } else if (transactionalId.isEmpty) {
      // if transactional id is empty then return error as invalid request. This is
      // to make TransactionCoordinator's behavior consistent with producer client
      responseCallback(initTransactionError(Errors.INVALID_REQUEST))
    } else if (!txnManager.validateTransactionTimeoutMs(transactionTimeoutMs)) {
      // check transactionTimeoutMs is not larger than the broker configured maximum allowed value
      responseCallback(initTransactionError(Errors.INVALID_TRANSACTION_TIMEOUT))
    } else {
      val coordinatorEpochAndMetadata = txnManager.getTransactionState(transactionalId).flatMap {
        case None =>
          val producerId = producerIdManager.generateProducerId()
          val createdMetadata = new TransactionMetadata(transactionalId = transactionalId,
            producerId = producerId,
            lastProducerId = RecordBatch.NO_PRODUCER_ID,
            producerEpoch = RecordBatch.NO_PRODUCER_EPOCH,
            lastProducerEpoch = RecordBatch.NO_PRODUCER_EPOCH,
            txnTimeoutMs = transactionTimeoutMs,
            state = Empty,
            topicPartitions = collection.mutable.Set.empty[TopicPartition],
            txnLastUpdateTimestamp = time.milliseconds())
          txnManager.putTransactionStateIfNotExists(createdMetadata)

        case Some(epochAndTxnMetadata) => Right(epochAndTxnMetadata)
      }

      val result: ApiResult[(Int, TxnTransitMetadata)] = coordinatorEpochAndMetadata.flatMap {
        existingEpochAndMetadata =>
          val coordinatorEpoch = existingEpochAndMetadata.coordinatorEpoch
          val txnMetadata = existingEpochAndMetadata.transactionMetadata

          txnMetadata.inLock {
            prepareInitProducerIdTransit(transactionalId, transactionTimeoutMs, coordinatorEpoch, txnMetadata,
              expectedProducerIdAndEpoch)
          }
      }

      result match {
        case Left(error) =>
          responseCallback(initTransactionError(error))

        case Right((coordinatorEpoch, newMetadata)) =>
          if (newMetadata.txnState == PrepareEpochFence) {
            // abort the ongoing transaction and then return CONCURRENT_TRANSACTIONS to let client wait and retry
            def sendRetriableErrorCallback(error: Errors): Unit = {
              if (error != Errors.NONE) {
                responseCallback(initTransactionError(error))
              } else {
                responseCallback(initTransactionError(Errors.CONCURRENT_TRANSACTIONS))
              }
            }

            endTransaction(transactionalId,
              newMetadata.producerId,
              newMetadata.producerEpoch,
              TransactionResult.ABORT,
              isFromClient = false,
              sendRetriableErrorCallback,
              requestLocal)
          } else {
            def sendPidResponseCallback(error: Errors): Unit = {
              if (error == Errors.NONE) {
                info(s"Initialized transactionalId $transactionalId with producerId ${newMetadata.producerId} and producer " +
                  s"epoch ${newMetadata.producerEpoch} on partition " +
                  s"${Topic.TRANSACTION_STATE_TOPIC_NAME}-${txnManager.partitionFor(transactionalId)}")
                responseCallback(initTransactionMetadata(newMetadata))
              } else {
                info(s"Returning $error error code to client for $transactionalId's InitProducerId request")
                responseCallback(initTransactionError(error))
              }
            }

            txnManager.appendTransactionToLog(transactionalId, coordinatorEpoch, newMetadata,
              sendPidResponseCallback, requestLocal = requestLocal)
          }
      }
    }
  }
```

```
  
/**
   * Startup logic executed at the same time when the server starts up.
   */
  def startup(retrieveTransactionTopicPartitionCount: () => Int, enableTransactionalIdExpiration: Boolean = true): Unit = {
    info("Starting up.")
    scheduler.startup()
    scheduler.schedule("transaction-abort",
      () => abortTimedOutTransactions(onEndTransactionComplete),
      txnConfig.abortTimedOutTransactionsIntervalMs,
      txnConfig.abortTimedOutTransactionsIntervalMs
    )
    txnManager.startup(retrieveTransactionTopicPartitionCount, enableTransactionalIdExpiration)
    txnMarkerChannelManager.start()
    isActive.set(true)

    info("Startup complete.")
  }

=>
private[transaction] def abortTimedOutTransactions(onComplete: TransactionalIdAndProducerIdEpoch => EndTxnCallback): Unit = {

    txnManager.timedOutTransactions().foreach { txnIdAndPidEpoch =>
      txnManager.getTransactionState(txnIdAndPidEpoch.transactionalId).foreach {
        case None =>
          error(s"Could not find transaction metadata when trying to timeout transaction for $txnIdAndPidEpoch")

        case Some(epochAndTxnMetadata) =>
          val txnMetadata = epochAndTxnMetadata.transactionMetadata
          val transitMetadataOpt = txnMetadata.inLock {
            if (txnMetadata.producerId != txnIdAndPidEpoch.producerId) {
              error(s"Found incorrect producerId when expiring transactionalId: ${txnIdAndPidEpoch.transactionalId}. " +
                s"Expected producerId: ${txnIdAndPidEpoch.producerId}. Found producerId: " +
                s"${txnMetadata.producerId}")
              None
            } else if (txnMetadata.pendingTransitionInProgress) {
              debug(s"Skipping abort of timed out transaction $txnIdAndPidEpoch since there is a " +
                "pending state transition")
              None
            } else {
              Some(txnMetadata.prepareFenceProducerEpoch())
            }
          }

          transitMetadataOpt.foreach { txnTransitMetadata =>
            endTransaction(txnMetadata.transactionalId,
              txnTransitMetadata.producerId,
              txnTransitMetadata.producerEpoch,
              TransactionResult.ABORT,
              isFromClient = false,
              onComplete(txnIdAndPidEpoch),
              RequestLocal.NoCaching)
          }
      }
    }
  }
=>
core\src\main\scala\kafka\coordinator\transaction\TransactionStateManager.scala
// this is best-effort expiration of an ongoing transaction which has been open for more than its
  // txn timeout value, we do not need to grab the lock on the metadata object upon checking its state
  // since the timestamp is volatile and we will get the lock when actually trying to transit the transaction
  // metadata to abort later.
  def timedOutTransactions(): Iterable[TransactionalIdAndProducerIdEpoch] = {
    val now = time.milliseconds()
    inReadLock(stateLock) {
      transactionMetadataCache.flatMap { case (_, entry) =>
        entry.metadataPerTransactionalId.filter { case (_, txnMetadata) =>
          if (txnMetadata.pendingTransitionInProgress) {
            false
          } else {
            txnMetadata.state match {
              case Ongoing =>
                txnMetadata.txnStartTimestamp + txnMetadata.txnTimeoutMs < now 判断是否过期
              case _ => false                                   
            }
          }
        }.map { case (txnId, txnMetadata) =>
          TransactionalIdAndProducerIdEpoch(txnId, txnMetadata.producerId, txnMetadata.producerEpoch)
        }
      }
    }
  }

txnMetadata.prepareFenceProducerEpoch()

 def prepareFenceProducerEpoch(): TxnTransitMetadata = {
    if (producerEpoch == Short.MaxValue)
      throw new IllegalStateException(s"Cannot fence producer with epoch equal to Short.MaxValue since this would overflow")

    // If we've already failed to fence an epoch (because the write to the log failed), we don't increase it again.
    // This is safe because we never return the epoch to client if we fail to fence the epoch
    val bumpedEpoch = if (hasFailedEpochFence) producerEpoch else (producerEpoch + 1).toShort

    prepareTransitionTo(PrepareEpochFence, producerId, bumpedEpoch, RecordBatch.NO_PRODUCER_EPOCH, txnTimeoutMs,
      topicPartitions.toSet, txnStartTimestamp, txnLastUpdateTimestamp)
  }
可以看到这里将epoch加1

```
#### The client hasn't received acknowledgment for some previously sent messages and can no longer retry them. It isn't safe to continue.
有了上面的基础，这部分时间很简单

2023-02-08 16:03:38.938 [32m INFO[m [35m21664GG[m [EENGINE-TID-2-1] [36mc.l.d.IgnoreExceptionHandler[m : Exception processing: 120 ProduceActionWrapper{}

org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
	at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
	at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
	at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
	at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
	at com.lyhistory.core.producer.DisruptorProducer$$Lambda$914/1553377810.onEvent(Unknown Source)
	at com.lmax.disruptor.BatchEventProcessor.processEvents(BatchEventProcessor.java:168)
	at com.lmax.disruptor.BatchEventProcessor.run(BatchEventProcessor.java:125)
	at java.lang.Thread.run(Thread.java:745)
Caused by: org.apache.kafka.common.KafkaException: The client hasn't received acknowledgment for some previously sent messages and can no longer retry them. It isn't safe to continue.
	at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:283)
	at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:235)
	... 1 more

```
前面这段跟上面的ProducerFencedException的stackstrace完全一样：
org.apache.kafka.common.KafkaException: Cannot execute transactional method because we are in an error state
	at org.apache.kafka.clients.producer.internals.TransactionManager.maybeFailWithError(TransactionManager.java:785)
	at org.apache.kafka.clients.producer.internals.TransactionManager.beginAbort(TransactionManager.java:230)
	at org.apache.kafka.clients.producer.KafkaProducer.abortTransaction(KafkaProducer.java:716)
	at com.lyhistory.core.producer.DisruptorProducer.realProduce(DisruptorProducer.java:66)
	at com.lyhistory.core.producer.DisruptorProducer$$Lambda$914/1553377810.onEvent(Unknown Source)
	at com.lmax.disruptor.BatchEventProcessor.processEvents(BatchEventProcessor.java:168)
	at com.lmax.disruptor.BatchEventProcessor.run(BatchEventProcessor.java:125)
	at java.lang.Thread.run(Thread.java:745)
不过下面一段多了更深入的stacktrace：

然后是 currentState == State.FATAL_ERROR的原因：
at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:283)
at org.apache.kafka.clients.producer.internals.Sender.run(Sender.java:235)

package org.apache.kafka.clients.producer.internals;
public class Sender implements Runnable {
 void run(long now) {
        if (transactionManager != null) {
            try {
                if (transactionManager.shouldResetProducerStateAfterResolvingSequences())
                    // Check if the previous run expired batches which requires a reset of the producer state.
                    transactionManager.resetProducerId();
                if (!transactionManager.isTransactional()) {
                    // this is an idempotent producer, so make sure we have a producer id
                    maybeWaitForProducerId();
                } else if (transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()) {
                    transactionManager.transitionToFatalError(
                        new KafkaException("The client hasn't received acknowledgment for " +
                            "some previously sent messages and can no longer retry them. It isn't safe to continue."));
transactionManager.hasUnresolvedSequences() && !transactionManager.hasFatalError()
=>
package org.apache.kafka.clients.producer.internals;
public class TransactionManager {
    synchronized boolean hasUnresolvedSequences() {
        return !partitionsWithUnresolvedSequences.isEmpty();
    }

    synchronized boolean hasUnresolvedSequence(TopicPartition topicPartition) {
        return partitionsWithUnresolvedSequences.contains(topicPartition);
    }

    synchronized void markSequenceUnresolved(TopicPartition topicPartition) {
        log.debug("Marking partition {} unresolved", topicPartition);
        partitionsWithUnresolvedSequences.add(topicPartition);
    }

这里没什么好说的，很直接

```
#### 尝试解决：
当前配置
```
delivery.timeout.ms = 120000
transaction.timeout.ms = 60000

request.timeout.ms = 30000
retries = 2147483647
retry.backoff.ms = 150
linger.ms = 5
```
延长：
delivery.timeout.ms >= request.timeout.ms + linger.ms
对于我们前面的问题应该不需要改变delivery timeout，这个是跟send有关，我们的问题是出在commit，所以延长
transaction.timeout.ms <= broker(transaction.max.timeout.ms)
在服务端故障恢复的几分钟内，让客户端有足够的时间重试而不是直接被服务端expire

注意数值不能超过服务端broker的配置（默认15分钟）：
transaction.max.timeout.ms
    The maximum allowed timeout for transactions. If a client’s requested transaction time exceed this, then the broker will return an error in InitProducerIdRequest. This prevents a client from too large of a timeout, which can stall consumers reading from topics included in the transaction.

    Type:	int
    Default:	900000 (15 minutes)
    Valid Values:	[1,...]
    Importance:	high
    Update Mode:	read-only

另外结合我们之前分析的另外一个事故“kafka client端程序读取 metadata 超过默认 30s 抛错”，当时实测读取meta data需要5分钟，所以可以设置 transaction.timeout.ms 为10分钟即 600000

[未来的改进：KIP-691: Enhance Transactional Producer Exception Handling](https://cwiki.apache.org/confluence/display/KAFKA/KIP-691%3A+Enhance+Transactional+Producer+Exception+Handling)

#### 后记
看到 [这里](https://stackoverflow.com/questions/56460688/kafka-ignoring-transaction-timeout-ms-for-producer)有人说设置transaction.timeout.ms不生效，不过他的问题是将timeout设置为比默认1分钟还要小的时间，然后brokers默认好像是每间隔分钟去检查一次是否timeout，所以设置transaction.timeout.ms小于1分钟是没有作用的，他的情况实际上是需要用另一个配置解决transaction.abort.timed.out.transaction.cleanup.interval.ms

---
REFER:
https://www.cnblogs.com/luozhiyun/p/12079527.html
https://docs.spring.io/spring-kafka/reference/#transactional-id
https://www.confluent.io/blog/transactions-apache-kafka/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging
https://docs.google.com/document/d/11Jqy_GjUGtdXJK94XGsEIK7CP1SnQGdp2eF0wSw9ra8/
<disqus/>