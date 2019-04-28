---
title: Hadoop ecosystem
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

# 1.Distributed and Parrallel computing
A distributed system is one in which components located at networked computers communicate and coordinate their actions only by passing messages.

Distributed Transaction

Distributed Shared Memory (DSM)

Distributed File System (DFS)

Parallel Computing Systems(subset of Concurrency Computing)

* In parallel computing, all processors may have access to a shared memory to exchange information between processors.
* In distributed computing, each processor has its own private memory (distributed memory). Information is exchanged by passing messages between the processors

Apache Hadoop = **HDFS**+MapReduce, Apache Hadoop is not designed for real time processing but for batch processing
Hadoop ecosystem includes more than Apache Hadoop MapReduce, it refers to the various components of the Apache Hadoop software library, as well as to the accessories and tools provided by the Apache Software Foundation for these types of software projects, and to the ways that they work together.

# 2.BigData components
## 2.1 Data Storage
### File System:
HDFS
### NoSQL:
* Column Family:
HBASE 

* Key-Value:
REDIS

* Document:
MONGODB

* Graphy
neo4j
flockDB
InfiniteGraphy


## 2.2 Data Ingestion
### normal batch mode
sqoop
flume

### Messaging:
kafaka

### Realtime:
storm

## 2.3 Data Processing
### batch processing
MapReduce( v2 shipped with YARN)
SPARK

### realtime processing
Storm