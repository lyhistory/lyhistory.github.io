## Kafka Client Compatibility
Bidirectional Client Compatibility is now supported, you don't need to worry about the compatibility matrix anymore, for KIP-35 enabled clients, any version are good, KIP-35 is released from Broker protocol - 0.10.0, Java clients - 0.10.2
https://stackoverflow.com/questions/55691662/determine-the-kafka-client-compatibility-with-kafka-broker#/

https://cwiki.apache.org/confluence/display/KAFKA/KIP-35+-+Retrieving+protocol+version#/

https://spring.io/projects/spring-kafka
org.springframework.kafka org.apache.kafka
https://www.cnblogs.com/wangb0402/p/6187796.html



## Versions

### 2.3.0

https://archive.apache.org/dist/kafka/2.3.0/RELEASE_NOTES.html

Kafka 2.3.0 includes a number of significant new features. Here is a summary of some notable changes:

+ There have been several improvements to the Kafka Connect REST API.
+ Kafka Connect now supports incremental cooperative rebalancing.
+ Kafka Streams now supports an in-memory session store and window store.
+ The AdminClient now allows users to determine what operations they are authorized to perform on topics.
+ There is a new broker start time metric.
+ JMXTool can now connect to secured RMI ports.
+ An incremental AlterConfigs API has been added. The old AlterConfigs API has been deprecated.
+ We now track partitions which are under their min ISR count.
+ Consumers can now opt-out of automatic topic creation, even when it is enabled on the broker.
+ Kafka components can now use external configuration stores (KIP-421).
+ We have implemented improved replica fetcher behavior when errors are encountered.

### 2.4.0

https://archive.apache.org/dist/kafka/2.4.0/RELEASE_NOTES.html

Kafka 2.4.0 includes a number of significant new features. Here is a summary of some notable changes:

+ Allow consumers to fetch from closest replica.
+ Support for incremental cooperative rebalancing to the consumer rebalance protocol.
+ MirrorMaker 2.0 (MM2), a new multi-cluster, cross-datacenter replication engine.
+ New Java authorizer Interface.
+ Support for non-key joining in KTable.
+ Administrative API for replica reassignment.

### 2.5.0

https://archive.apache.org/dist/kafka/2.5.0/RELEASE_NOTES.html

Kafka 2.5.0 includes a number of significant new features. Here is a summary of some notable changes:

+ TLS 1.3 support (1.2 is now the default)
+ Co-groups for Kafka Streams
+ Incremental rebalance for Kafka Consumer
+ New metrics for better operational insight
+ Upgrade Zookeeper to 3.5.7
+ Deprecate support for Scala 2.11

### 2.6.0

https://archive.apache.org/dist/kafka/2.6.0/RELEASE_NOTES.html

Kafka 2.6.0 includes a number of significant new features. Here is a summary of some notable changes:

+ TLSv1.3 has been enabled by default for Java 11 or newer
+ Significant performance improvements, especially when the broker has large numbers of partitions
+ Smooth scaling out of Kafka Streams applications
+ Kafka Streams support for emit on change
+ New metrics for better operational insight
+ Kafka Connect can automatically create topics for source connectors when configured to do so
+ Improved error reporting options for sink connectors in Kafka Connect
+ New Filter and conditional SMTs in Kafka Connect
+ The default value for the `client.dns.lookup` configuration is now `use_all_dns_ips`
+ Upgrade Zookeeper to 3.5.8

### 2.7.0

https://archive.apache.org/dist/kafka/2.7.0/RELEASE_NOTES.html

Kafka 2.7.0 includes a number of significant new features. Here is a summary of some notable changes:

+ Configurable TCP connection timeout and improve the initial metadata fetch
+ Enforce broker-wide and per-listener connection creation rate (KIP-612, part 1)
+ Throttle Create Topic, Create Partition and Delete Topic Operations
+ Add TRACE-level end-to-end latency metrics to Streams
+ Add Broker-side SCRAM Config API
+ Support PEM format for SSL certificates and private key
+ Add RocksDB Memory Consumption to RocksDB Metrics
+ Add Sliding-Window support for Aggregations

```
public class PolyProducer<K, V> implements Producer<K, V> {

    @Override
    public void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets,
            ConsumerGroupMetadata groupMetadata) throws ProducerFencedException {
        // TODO Auto-generated method stub
        
    }
    
```
## Features

### Incremental rebalance
https://cwiki.apache.org/confluence/display/KAFKA/KIP-429%3A+Kafka+Consumer+Incremental+Rebalance+Protocol

explained:
https://www.confluent.io/blog/incremental-cooperative-rebalancing-in-kafka/

stop-the-world rebalancing => 

### Upgrade Zookeeper

### Significant performance improvements, especially when the broker has large numbers of partitions

### Configurable TCP connection timeout and improve the initial metadata fetch

https://issues.apache.org/jira/browse/KAFKA-9893

### Enforce broker-wide and per-listener connection creation rate (KIP-612, part 1)

### Throttle Create Topic, Create Partition and Delete Topic Operations


---

Expose Consumer Group Metadata for Transactional Producer
https://issues.apache.org/jira/browse/KAFKA-9383
https://github.com/apache/kafka/pull/7906