(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{629:function(t,e,a){"use strict";a.r(e);var s=a(65),n=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata01.png",alt:""}})]),t._v(" "),a("h2",{attrs:{id:"_1-big-data-engineering-for-analytics"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-big-data-engineering-for-analytics"}},[t._v("#")]),t._v(" 1.Big Data Engineering for Analytics")]),t._v(" "),a("p",[t._v("Data type: big data, fast data, dark data, thick data")]),t._v(" "),a("h3",{attrs:{id:"_1-1-distributed-and-parallel-computing"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-distributed-and-parallel-computing"}},[t._v("#")]),t._v(" 1.1 Distributed and Parallel computing")]),t._v(" "),a("p",[t._v("Distributed System\nA distributed system is one in which components located at networked computers communicate and coordinate their actions only by passing messages.\nDistributed Transaction\nDistributed Shared Memory (DSM)\nDistributed File System (DFS)")]),t._v(" "),a("p",[t._v("Concurrency Control https://www.slideshare.net/wahabtl/chapter-12-transactions-and-concurrency-control\nDistributed Computing VS Parallel Computing Systems\n●\tIn parallel computing, all processors may have access to a shared memory to exchange information between processors.[18]\n●\tIn distributed computing, each processor has its own private memory (distributed memory). Information is exchanged by passing messages between the processors.\nhttps://en.wikipedia.org/wiki/Distributed_computing")]),t._v(" "),a("p",[t._v("Parallel computing is subset of concurrency computing\nThere are various different ways of accomplishing concurrency. One of them is parallelism--having multiple CPUs working on the different tasks at the same time. But that's not the only way. Another is by task switching, which works like this: Task A works up to a certain point, then the CPU working on it stops and switches over to task B, works on it for a while, and then switches back to task A. If the time slices are small enough, it may appear to the user that both things are being run in parallel, even though they're actually being processed in serial by a multitasking CPU.\n--https://softwareengineering.stackexchange.com/questions/190719/the-difference-between-concurrent-and-parallel-execution")]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata02.png",alt:""}})]),t._v(" "),a("p",[t._v("Distributed system Architecture style\nA style reflects the basic principle that is followed in organizing the interaction between the software components comprising a distributed system. Examples:\n•Layered architectures\n•Multi-Tiered architectures\n•Object-based architectures\n•Data-centered architectures\n•Event-based architectures")]),t._v(" "),a("h3",{attrs:{id:"_1-2-hadoop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-hadoop"}},[t._v("#")]),t._v(" 1.2 Hadoop")]),t._v(" "),a("p",[t._v("Hadoop (HDFS+MapReduce) => specify hadoop map-reduce or map-reduce for short\nhttp://ercoppa.github.io/HadoopInternals/HadoopArchitectureOverview.html\nRack awareness\nhttps://www.youtube.com/watch?v=Z7XUVQjI2EE\nRack is basically collection of some machines which are physically placed close and are connected to same network switch\nHadoop ecosystem refers to the various components of the Apache Hadoop software library, as well as to the accessories and tools provided by the Apache Software Foundation for these types of software projects, and to the ways that they work together.")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Data Processing type")]),t._v(" "),a("th",[t._v("solution")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("Batch processing")]),t._v(" "),a("td",[t._v("Apache Hadoop(hadoop map reduce) Spark is more efficient compare to hadoop Map reduce")])]),t._v(" "),a("tr",[a("td",[t._v("Realtime processing")]),t._v(" "),a("td",[t._v("storm(distributed and fault-tolerant realtime computation),Storm does not run on Hadoop clusters but uses Zookeeper and its own minion worker to manage its processes. Stormcan read and write files to HDFS.")])])])]),t._v(" "),a("p",[t._v("https://www.dezyre.com/article/spark-vs-hadoop-vs-storm/145\nHadoop(Apache hadoop map reduce)  is not designed for real time processing but for batch processing,\nhttps://www.ethz.ch/content/dam/ethz/special-interest/gess/computational-social-science-dam/documents/education/Spring2015/datascience/real-time-data-analytics.pdf")]),t._v(" "),a("p",[t._v("Big Data defines a situation in which data sets have grown to such enormous sizes that conventional information technologies can no longer effectively handle either the size of the data set or the scale and growth of the data set.\n1.Understand the growth of Big Data and need for a scalable processing framework.\n2.Use distributed and shared memory architecture.\n3.Understand the various data storage options, choose an appropriate storage model based on the application requirements.\n4.Perform Data manipulation and querying on Big Data solutions dealing with high volume using NoSQL.\n5.Gain  expertise with the fault-tolerant and computing framework for processing Big Data.\n6.Understand the distributed computing essentials, storage needs, and relevant architectural mechanism in processing large amounts of structured and unstructured data.\n7.Understand various in memory, batch processing and machine learning algorithms to perform analytics.")]),t._v(" "),a("p",[a("strong",[t._v("hadoop ecosystem")]),t._v(" "),a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata03_hadoop01.png",alt:""}})]),t._v(" "),a("p",[t._v("Distributions\nCloudera, Hortonworks, MapR, Amazon Elastic MapReduce")]),t._v(" "),a("p",[t._v("Hadoop Solution Examples\n• Extract/Transform/Load (ETL)\n• Text mining\n• Index building\n• Graph creation and analysis\n• Pattern recognition\n• Collaborative filtering\n• Prediction models\n• Sentiment analysis\n• Risk assessment\n• Log processing\n• Recommendation systems\n• Business intelligence/data warehousing\n• Video and image analysis\n• Archiving")]),t._v(" "),a("p",[t._v("https://subscription.packtpub.com/book/big_data_and_business_intelligence/9781784396688")]),t._v(" "),a("p",[a("strong",[t._v("Hadoop MapReduce")])]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata04_mapreduce01.png",alt:""}})]),t._v(" "),a("h2",{attrs:{id:"_2-components"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-components"}},[t._v("#")]),t._v(" 2 Components")]),t._v(" "),a("p",[t._v("Fundamentals of distributed and parallel computing platforms for building Big Data Solutions.\nData Source==Ingestion(ETL)==\n==>Data Storage\n==Computing and Analytics(Query/Compute/Processing(batch process/streaming/machine learning)\n==Report/Presentation(visualization dashboard or other forms)")]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata05.png",alt:""}})]),t._v(" "),a("h3",{attrs:{id:"_2-1-data-source"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-data-source"}},[t._v("#")]),t._v(" 2.1 Data Source")]),t._v(" "),a("p",[t._v("Structured, semi-structured, unstructured, polymorphic data\nBig Data are large corpse of datasets with characteristics such as volume, variety, velocity, veracity and value.")]),t._v(" "),a("h3",{attrs:{id:"_2-2-data-ingestion"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-data-ingestion"}},[t._v("#")]),t._v(" 2.2 Data Ingestion")]),t._v(" "),a("p",[t._v("Discusses the fundamentals of data ingestion, patterns used and tools available.")]),t._v(" "),a("p",[a("strong",[t._v("Process Stages")]),t._v(":\nInput=>Filter=>Enrich=>Process=>Segregate=>Output")]),t._v(" "),a("p",[t._v("step 1. Input: Discover and fetch the data for ingestion. The discovery of data may be from File System, messaging queues, web services, sensors, databases or even the outputs of other ingestion apps.\nstep 2. Filter: Analyse the raw data and identify the interesting subset. The filter stage is typically used for quality control or to simply sample the dataset or parse the data.\nstep 3. Enrich: Plug in the missing pieces in the data. This stage often involves talking to external data sources to plug in the missing data attributes. Data may be transformed from a specific form into a form to make it suitable for downstream processes.\nstep 4. Process – This stage is meant to do some lightweight processing to either further enrich the event or transform the event from one form into another. The process stage usually computes using the existing attributes of the data and at times using external systems.\nstep 5. Segregate – Often times before the data is given to downstream systems, it makes sense to bundle similar data sets together. While this stage may not always be necessary for compaction, segregation does make sense most of the time.\nstep 6. Output – Outputs are almost always mirrors of inputs in terms of what they can do and are as essential as inputs. While the input stage requires fetching the data, the output stage requires resting the data – either on durable storage systems or other processing systems.")]),t._v(" "),a("p",[a("strong",[t._v("Ingestion types and tools")])]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Objective")]),t._v(" "),a("th",[t._v("Tools")]),t._v(" "),a("th",[t._v("Solution Characteristics")]),t._v(" "),a("th",[t._v("Details")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("Handling large data volume")]),t._v(" "),a("td",[t._v("Apache Flume;Apache Storm;Apache Spark")]),t._v(" "),a("td",[t._v("Data extraction with load balancing using a distributed solution or a cluster of nodes.")]),t._v(" "),a("td",[t._v("Apache Flume is useful in processing log-data. Apache Storm is desirable for operations monitoring and Apache Spark for streaming data, graph processing and machine-learning")])]),t._v(" "),a("tr",[a("td",[t._v("Messaging for distributed ingestion")]),t._v(" "),a("td",[t._v("Apache Kafka")]),t._v(" "),a("td",[t._v("Messaging system should ensure scalable and reliable communication across nodes involved in data-ingestion.")]),t._v(" "),a("td",[t._v("LinkedIn makes use of Apache Kafka to achieve fast communication between the cluster-nodes.")])]),t._v(" "),a("tr",[a("td",[t._v("Real-time or near realtime ingestion")]),t._v(" "),a("td",[t._v("Apache Storm, Apache Spark")]),t._v(" "),a("td",[t._v("Data-ingestion process should be able to handle highfrequency of incoming or streaming data.")]),t._v(" "),a("td",[t._v("NA")])]),t._v(" "),a("tr",[a("td",[t._v("Batch-mode ingestion")]),t._v(" "),a("td",[t._v("Apache Sqoop;Apache Kafka;Apache Chukwa")]),t._v(" "),a("td",[t._v("Ability to ingest data in bulkmode.")]),t._v(" "),a("td",[t._v("Apache Chukwa process data in batch-mode and are useful when data needs to be ingested at an interval of few minutes/hours/days.")])]),t._v(" "),a("tr",[a("td",[t._v("Detecting incremental data")]),t._v(" "),a("td",[t._v("DataBus, Infosphere and Goldengate")]),t._v(" "),a("td",[t._v("Ability to handle structured and unstructured data, lowlatency.")]),t._v(" "),a("td",[t._v("Databus from LinkedIn is a distributed solution that provides a timeline-consistent stream of change capture events for a database. – Infosphere and Goldengate are Data Integrators")])])])]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata06.png",alt:""}})]),t._v(" "),a("p",[t._v("example：\nSqoop & Sqoop V2：\nUsing hadoop MapReduce\nSqoop helps to move data between hadoop and other databases and it can transfer data in parallel for performance.")]),t._v(" "),a("p",[t._v("Flume：\nFlume helps to collect data from a variety of sources, like logs, jms, Directory etc. Multiple flume agents can be configured to collect high volume of data. It scales horizontally.")]),t._v(" "),a("p",[a("strong",[t._v("Ingestion Patterns")])]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata07.png",alt:""}})]),t._v(" "),a("p",[t._v("https://link.springer.com/chapter/10.1007/978-1-4302-6293-0_3\n• Multisource Extractor Pattern: An approach to ingest multiple data source types in an efficient manner.\n• Protocol Converter Pattern: Employs a protocol mediator to provide abstraction for the incoming data from the different protocol layers.\n• Multi-destination Pattern: Used in a scenario where the ingestion layer has to transport the data to multiple storage components like DFS, data marts, or real-time analytics engines.\n• Just-in-Time Transformation Pattern: Large quantities of unstructured data can be uploaded in a batch mode using traditional ETL (extract, transfer and load) tools and methods. Data is transformed only when required to save compute time.\n• Real-Time Streaming patterns: Real-time ingestion and analysis of the in-streaming data is required for instant analysis of data.")]),t._v(" "),a("h3",{attrs:{id:"_2-3-data-storage"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-data-storage"}},[t._v("#")]),t._v(" 2.3 Data Storage")]),t._v(" "),a("p",[t._v("Design features of the scalable, fault-tolerant, cost-efficient storage for Big Data.")]),t._v(" "),a("p",[a("strong",[t._v("HDFS - Distributed File System")])]),t._v(" "),a("p",[t._v("Naming: add hostname to file names,mouting remote directories to local ones, all files in the system belong to a single namespace.\nCache: memory/disk; writing policy; cache consistency\nAvailability: replica\nScalability\nSemantics")]),t._v(" "),a("p",[t._v("HDFS shares many common features with other distributed file systems while supporting some important differences. One significant difference is HDFS's write-once-read-many model that relaxes concurrency control requirements, simplifies data coherency, and enables high-throughput access.\nhttps://hadoop.apache.org/docs/r1.2.1/hdfs_design.html\nA comic-like explanation of HDFS https://docs.google.com/file/d/0B-zw6KHOtbT4MmRkZWJjYzEtYjI3Ni00NTFjLWE0OGItYTU5OGMxYjc0N2M1/edit?pli=1")]),t._v(" "),a("p",[t._v("NameNode: meta information about files and blocks\nDataNode: files and blocks\nhttp://hadoopinrealworld.com/namenode-and-datanode/\nhttp://stackoverflow.com/questions/13577767/file-path-in-hdfs")]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata08_hdfs01.png",alt:""}})]),t._v(" "),a("p",[t._v("https://hadoop.apache.org/docs/r1.2.1/hdfs_design.html")]),t._v(" "),a("p",[a("strong",[t._v("HBASE-NoSQL")])]),t._v(" "),a("p",[t._v("NonSQL->NoRel->NoSQL->NewSQL\nRDMS: provided successful persistence, concurrency control, and an integration mechanism, but has disadvantage of : declarative, expensive when scaling, impedance mismatch between the relational model and the in-memory data structures.(ORM)\nWhy NoSQL:\n1, Exponential growth of data generated by new systems and users\n2, Increasing interdependence and complexity of data\nbut hard to achieve ACID in distributed databases, BASE(Basically Available, soft State, Eventual consistency) instead\nStorage structures and information retrieval on distributed Big Data platforms using NoSQL.\nComputational Engine: Computational components responsible for scheduling, distributing, and monitoring applications consisting of types of tasks across computing cluster.")]),t._v(" "),a("p",[t._v("ACID\nSharding and Replication")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Pattern")]),t._v(" "),a("th",[t._v("Product")]),t._v(" "),a("th",[t._v("Description")]),t._v(" "),a("th",[t._v("Typical uses")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("Key-value store")]),t._v(" "),a("td",[t._v("Redis")]),t._v(" "),a("td",[t._v("A simple way to associate a large data file with a simple text string")]),t._v(" "),a("td",[t._v("Dictionary, image store, document/file store, query cache, lookup tables")])]),t._v(" "),a("tr",[a("td",[t._v("Graph store")]),t._v(" "),a("td",[t._v("neo4j;flockDB;InfiniteGraphy")]),t._v(" "),a("td",[t._v("A way to store nodes and arcs of a graph")]),t._v(" "),a("td",[t._v("Social network queries, friend-of-friends queries, inference, rules system, and pattern matching")])]),t._v(" "),a("tr",[a("td",[t._v("Column family (Bigtable) store")]),t._v(" "),a("td",[t._v("HBase;bigtable(google)")]),t._v(" "),a("td",[t._v("A way to store sparse matrix data using a row and a column as the key")]),t._v(" "),a("td",[t._v("Web crawling, large sparsely populated tables, highly-adaptable systems, systems that have high variance")])]),t._v(" "),a("tr",[a("td",[t._v("Document store")]),t._v(" "),a("td",[t._v("MongoDB")]),t._v(" "),a("td",[t._v("A way to store tree-structured hierarchical information in a single unit")]),t._v(" "),a("td",[t._v("Any data that has a natural container structure including office documents, sales orders, invoices, product descriptions, forms, and web pages; popular in publishing, document exchange, and document search")])])])]),t._v(" "),a("p",[t._v("•Projects where RDBMS SQL is ideal:\nlogical related discrete data requirements which can be identified up-front data integrity is essential standards-based proven technology with good developer experience and support.\n•Projects where NoSQL is ideal:\nunrelated, indeterminate or evolving data requirements simpler or looser project objectives, able to start coding immediately speed and scalability is imperative.")]),t._v(" "),a("p",[t._v("Benchmark postgresql vs mongodb: https://www.sisense.com/blog/postgres-vs-mongodb-for-storing-json-data/\nWhy We Moved From NoSQL MongoDB to PostgreSQL https://dzone.com/articles/why-we-moved-from-nosql-mongodb-to-postgresql")]),t._v(" "),a("p",[t._v("Sample case:\n"),a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata09.png",alt:""}})]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("HDFS")]),t._v(" "),a("th",[t._v("HBase")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("HDFS is a Java-based file system utilized for storing large data sets.")]),t._v(" "),a("td",[t._v("HBase is a Java based Not Only SQL database")])]),t._v(" "),a("tr",[a("td",[t._v("HDFS has a rigid architecture that does not allow changes. It doesn’t facilitate dynamic storage.")]),t._v(" "),a("td",[t._v("HBase allows for dynamic changes and can be utilized for standalone applications.")])]),t._v(" "),a("tr",[a("td",[t._v("HDFS is ideally suited for write-once and read-many times use cases")]),t._v(" "),a("td",[t._v("HBase is ideally suited for random write and read of data that is stored in HDFS.")])])])]),t._v(" "),a("p",[t._v("HBASE Architecture")]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata10_hbase01.png",alt:""}})]),t._v(" "),a("p",[t._v("https://mapr.com/blog/in-depth-look-hbase-architecture/")]),t._v(" "),a("h3",{attrs:{id:"_2-4-data-analytics"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-data-analytics"}},[t._v("#")]),t._v(" 2.4 Data Analytics")]),t._v(" "),a("p",[a("strong",[t._v("Query")])]),t._v(" "),a("p",[t._v("Impala\nHive")]),t._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/bigdata/bigdata11.png",alt:""}})]),t._v(" "),a("p",[a("strong",[t._v("Computing cluster and Analytics")])]),t._v(" "),a("p",[t._v("High-performance & Highavailability Computing Systems\nMapReduce, Apache YARN, Apache Spark……")]),t._v(" "),a("p",[t._v("Analytics: Introduction to use the distributed Big Data platforms for analytics problem solving.\nComputing Cluster: Architecting the distributed Big Data engineering solutions on cluster computing platform designed to be fast and general-purpose.\nParallel Computing: Using functional programming frameworks and the resilient distributed dataset(RDD) inside a distributed shell for solving different types of analytics problems.")]),t._v(" "),a("p",[t._v("Categories :")]),t._v(" "),a("ol",[a("li",[t._v("Descriptive Analytics\nWhat was the sales volume over the past 12 months? What is the number of support calls received as categorized by severity and geographic location? What is the monthly commission earned by each sales agent?")]),t._v(" "),a("li",[t._v("Diagnostic Analytics\nWhy were Q2 sales less than Q1 sales? Why have there been more support calls originating from the Eastern region than from the Western region? Why was there an increase in patient re-admission rates over the past three months?")]),t._v(" "),a("li",[t._v("Predictive Analytics\nWhat are the chances that a customer will default on a loan if they have missed a monthly payment? What will be the patient survival rate if Drug B is administered instead of Drug A? If a customer has purchased Products A and B, what are the chances that they will also purchase Product C?")]),t._v(" "),a("li",[t._v("Prescriptive Analytics\nPrescriptive analytics build upon the results of predictive analytics by prescribing actions that should be taken. The focus is not only on which prescribed option is best to follow, but why.")])]),t._v(" "),a("p",[t._v("Major Types Of Clusters:")]),t._v(" "),a("p",[t._v("• Storage Clusters\nAllows the  servers to simultaneously read and write to a single shared file system Simplifies storage administration, supports a cluster-wide file system and simplifies backup and disaster recovery.\n• High-availability Clusters\nProvide continuous availability of services by eliminating single points of failure Maintains data integrity and node failures are transparent to external world\n• Load-balancing Clusters\nDispatch network service requests to multiple cluster nodes to balance the request load Provides cost-effective scalability, detects the failure and redirects requests to other cluster nodes.\n• High-performance Clusters\nPerform concurrent calculations, allow applications to work in parallel, and enhances performance Referred to as computational clusters")]),t._v(" "),a("ol",[a("li",[t._v("Batch Processing\nApache Yarn(MapReduce V2)\nworks on the philosophy that moving computation is cheaper than moving data.\nhttps://chongyaorobin.wordpress.com/2015/07/01/step-by-step-of-installing-singlenode-yarn-on-ubuntu/\nhttp://backtobazics.com/big-data/setup-multi-node-hadoop-2-6-0-cluster-with-yarn/\nApache Spark (rdd, sql)")])]),t._v(" "),a("p",[t._v("MapReduce 2 vs YARN applications https://stackoverflow.com/questions/31044575/mapreduce-2-vs-yarn-applications")]),t._v(" "),a("p",[t._v("You cannot compare Yarn and Spark directly per say. Yarn is a distributed container manager, like Mesos for example, whereas Spark is a data processing tool. Spark can run on Yarn, the same way Hadoop Map Reduce can run on Yarn. It just happens that Hadoop Map Reduce is a feature that ships with Yarn, when Spark is not.\n--https://stackoverflow.com/questions/29568533/what-is-the-difference-between-yarn-and-spark-processing-engine-based-on-real-ti")]),t._v(" "),a("p",[t._v("https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html")]),t._v(" "),a("p",[t._v("https://backtobazics.com/big-data/spark/understanding-apache-spark-architecture/")]),t._v(" "),a("p",[t._v("Spark vs MapReduce(v1)\nhttps://www.quora.com/Apache-Spark/What-is-the-difference-in-idea-design-and-code-between-Apache-Spark-and-Apache-Hadoop")]),t._v(" "),a("ol",{attrs:{start:"2"}},[a("li",[a("p",[t._v("Streaming")])]),t._v(" "),a("li",[a("p",[t._v("Machine Learning")])])]),t._v(" "),a("hr"),t._v(" "),a("p",[t._v("todo")]),t._v(" "),a("p",[t._v("Storm\nhttps://hortonworks.com/apache/storm\nKafka\nhttps://hortonworks.com/apache/kafka/\nZookeeper\nhttps://hortonworks.com/apache/zookeeper/")]),t._v(" "),a("p",[t._v("class notes:\nAmazon EMR https://aws.amazon.com/emr/\nHadoop(HDFS) vs. RDBMS\thttps://www.linkedin.com/pulse/hadoop-vs-rdbms-thiensi-le\nhbase vs rdbms\nsql nosql https://docs.microsoft.com/en-us/azure/documentdb/documentdb-nosql-vs-sql\nTraditional Business Intelligence VS Big Data Technology\nhttps://www.linkedin.com/pulse/traditional-business-intelligence-vs-big-data-steven-murhula\nprocessing type:\nhttp://searchdatamanagement.techtarget.com/feature/Understanding-and-comparing-six-types-of-processing-systems\nhttp://www.datasciencecentral.com/profiles/blogs/batch-vs-real-time-data-processing\nHIVE VS Relational Database- cannot update at row level\nhttp://stackoverflow.com/questions/17810537/how-to-delete-and-update-a-record-in-hive")]),t._v(" "),a("p",[t._v("**Hadoop distribution\nCloudera vs Hortonworks vs MapR: Comparing Hadoop Distributions\nhttps://wiki.apache.org/hadoop/Distributions%20and%20Commercial%20Support")]),t._v(" "),a("p",[t._v("https://www.cloudera.com/more/about/faqs.html\nhttps://www.cloudera.com/documentation/enterprise/latest/topics/cdh_intro.html\nhttp://tecadmin.net/hadoop-commands-to-manage-files-on-hdfs/#\nhttps://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.4.3/bk_installing_manually_book/content/start_stop_restart_hue.html")]),t._v(" "),a("p",[t._v("How To Setup Multi Node Hadoop 2 (YARN) Cluster http://arturmkrtchyan.com/how-to-setup-multi-node-hadoop-2-yarn-cluster\nhttps://github.com/lyhistory/reference-apps")]),t._v(" "),a("p",[t._v("Building a real time, solr-powered recommendation engine https://www.slideshare.net/treygrainger/building-a-real-time-solrpowered-recommendation-engine")]),t._v(" "),a("p",[t._v("hadoop -> hdfs (NameNode DataNode)\nhttp://spark.apache.org/examples.html\nhttp://www.cnblogs.com/laov/p/3433994.html\nhttp://f.dataguru.cn/thread-539253-1-1.html\nhttp://blog.csdn.net/sunrising_hill/article/details/53559398\nhttp://www.cnblogs.com/forget-me-not/archive/2016/07/27/5710122.html\nhttp://blog.csdn.net/yangjl38/article/details/7595465\n"),a("property",[a("name",[t._v("dfs.namenode.rpc-address")]),t._v(" "),a("value",[t._v("http://localhost:9000")])],1)],1),t._v(" "),a("p",[t._v("**Spark\n大数据实战高手进阶之路：Machine Learning on Spark彻底揭秘学习编程拼图理论的框架整理\nhttps://cloud.tencent.com/developer/article/1084717")]),t._v(" "),a("p",[t._v("Spark的RDD原理以及2.0特性的介绍 www.open-open.com/lib/view/open1463655510676.html\nhttp://www.dataguru.cn/article-9353-1.html\nInstalling and Running Spark on YARN http://dmtolpeko.com/2015/02/06/installing-and-running-spark-on-yarn/\nhttp://spark.apache.org/docs/latest/running-on-yarn.html\nhttps://nofluffjuststuff.com/blog/mark_johnson/2016/02/5_steps_to_get_started_running_spark_on_yarn_with_a_hadoop_cluster\nhttps://www.gitbook.com/book/jaceklaskowski/mastering-apache-spark/details\nhttp://spark.apache.org/docs/latest/running-on-yarn.html\nhttps://chongyaorobin.wordpress.com/2015/07/01/step-by-step-of-installing-apache-spark-on-apache-hadoop/\nhttp://freecontent.manning.com/wp-content/uploads/how-to-start-developing-spark-applications-in-eclipse.pdf\nhttps://www.quora.com/How-do-I-set-up-Apache-Spark-with-Yarn-Cluster\nhttp://www.cnblogs.com/BYRans/p/5889374.html\nsubmit jobs\nhttp://spark.apache.org/docs/latest/submitting-applications.html\nhttps://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.3.0/bk_spark-quickstart/content/run_spark_pi.html\nhttps://github.com/apache/spark/tree/98ede49496d0d7b4724085083d4f24436b92a7bf/examples/src/main/scala/org/apache/spark/examples/mllib")]),t._v(" "),a("p",[t._v("Scala Tutorial 01 (download + test run the Scala Eclipse plugin)\nhttps://www.youtube.com/watch?v=sj53BGwFs9U\nLearning Scala? Learn the Fundamentals First!\nhttps://www.youtube.com/watch?v=ugHsIj60VfQ\nHow to use Apache ZooKeeper zkCli Command Line Interface https://www.youtube.com/watch?v=6jAVjiAo8cU\nHBase keeps doing SIMPLE authentication stackoverflow.com/questions/21338874/hbase-keeps-doing-simple-authentication")]),t._v(" "),a("p",[t._v("Apache Spark vs. MapReduce https://dzone.com/articles/apache-spark-introduction-and-its-comparison-to-ma\nFive things you need to know about Hadoop v. Apache Spark https://www.infoworld.com/article/3014440/big-data/five-things-you-need-to-know-about-hadoop-v-apache-spark.html")]),t._v(" "),a("p",[t._v("Why Apache Spark is a Crossover Hit for Data Scientists blog.cloudera.com/blog/2014/03/why-apache-spark-is-a-crossover-hit-for-data-scientists/")]),t._v(" "),a("p",[t._v("Spark Tips\nSpark shell Related:\n#1 cannot load library into class declaration,\nsolution:\nscala> :paste\n// Entering paste mode (ctrl-D to finish)\nSacla related:\nPARALLEL COLLECTIONS\nhttp://docs.scala-lang.org/overviews/parallel-collections/overview.html")]),t._v(" "),a("p",[t._v("org.apache.spark.sql.AnalysisException Exception when joining DataFrames\ntry not to join two dataframe with the same column name\nhttps://issues.apache.org/jira/browse/SPARK-10925")]),t._v(" "),a("p",[t._v("Caused by: java.lang.ClassCastException\ncheck whether you are using the wrong column index")]),t._v(" "),a("p",[t._v("Scala\nScala is one of the hottest modern programming languages. It is the Cadillac of programming languages. It is not only powerful but also a beautiful language. Spark is written in Scala, but it supports multiple programming languages, including Scala, Java, Python, and R.\nScala is a great language for developing big data applications. It provides a number of benefits. First, a developer can achieve a significant productivity jump by using Scala. Second, it helps developers write robust code with reduced bugs. Third, Spark is written in Scala, so Scala is a\nnatural fit for developing Spark applications. Functional programming is a programming style that uses functions as a building block and avoids mutable variables, loops, and other imperative control structures. It treats computation as an evaluation of mathematical functions, where the output of a function depends only on the arguments to the function. A program is composed of such functions. In addition, functions are first-class citizens in a functional programming language.\nFirst, functional programming provides a tremendous boost in developer productivity. It enables you to solve a problem with fewer lines of code compared to imperative languages. Second, functional programming makes it easier to write concurrent or multithreaded applications. The ability to write multi-threaded applications has become very important with the advent of multi-CPU or multi-core computers. Third, functional\nprogramming helps you to write robust code. It helps you avoid common programming errors. Finally, functional programming languages make it easier to write elegant code, which is easy to read, understand, and reason about. A properly written functional code looks beautiful; it is not complex or messy. You get immense joy and satisfaction from your code.\nFunctional Programming")]),t._v(" "),a("ol",[a("li",[t._v("is composed of 'Functions' - First-class citizens: Composable, No Side Effects, Simple")]),t._v(" "),a("li",[t._v("has immutable data structure")]),t._v(" "),a("li",[t._v("is expression language\nFunction types:")]),t._v(" "),a("li",[t._v("Methods")]),t._v(" "),a("li",[t._v("Local Functions")]),t._v(" "),a("li",[t._v("High-order methods http://fruzenshtein.com/scala-higher-order-anonymous-functions/")]),t._v(" "),a("li",[t._v("Function Literals")]),t._v(" "),a("li",[t._v("Closures\nclass\nsingleton\ncase class\ncase statement\nMap, Map and flatMap in Scala http://www.brunton-spall.co.uk/post/2011/12/02/map-map-and-flatmap-in-scala/\nhttps://twitter.github.io/scala_school/\nhttp://spark.apache.org/examples.html\nhttps://github.com/apache/spark/tree/master/examples\nlearn scala https://www.scala-exercises.org/\npage rank\nhttps://github.com/eBay/Spark/blob/master/examples/src/main/scala/org/apache/spark/examples/SparkPageRank.scala")])]),t._v(" "),a("p",[t._v("mapPartitions vs map vs flatmap\nhttp://blog.csdn.net/lsshlsw/article/details/48627737\nhttp://lxw1234.com/archives/2015/07/348.htm")]),t._v(" "),a("p",[t._v("https://databricks.com/blog/2016/07/14/a-tale-of-three-apache-spark-apis-rdds-dataframes-and-datasets.html\nhttp://www.brunton-spall.co.uk/post/2011/12/02/map-map-and-flatmap-in-scala/")]),t._v(" "),a("p",[t._v("Apache Spark快速入门  https://www.iteblog.com/archives/1410.html\ndataframe nested value http://stackoverflow.com/questions/37391241/how-to-explode-columns/37392793#37392793\njson in dataframe\nhttp://xinhstechblog.blogspot.sg/2015/06/reading-json-data-in-spark-dataframes.html\nscala json\nhttp://stackoverflow.com/questions/31852602/scala-play-json-how-to-read-a-single-element-from-a-element-in-an-array")]),t._v(" "),a("p",[t._v("Data mining\nA Programmer's Guide to Data Mining\nhttp://guidetodatamining.com\nhttps://legacy.gitbook.com/book/wizardforcel/guide-to-data-mining/details\nhttps://legacy.gitbook.com/@wizardforcel")]),t._v(" "),a("p",[t._v("Machine Learning\n/docs/software/bigdata/machinelearning")]),t._v(" "),a("p",[t._v("Deep Learning\nHow To Develop and Evaluate Large Deep Learning Models with Keras on Amazon Web Services machinelearningmastery.com/develop-evaluate-large-deep-learning-models-keras-amazon-web-services/")]),t._v(" "),a("p",[t._v("Keras:基于Theano和TensorFlow的深度学习库 https://keras-cn.readthedocs.io/en/latest/")]),t._v(" "),a("p",[t._v("https://github.com/aaxwaz/NUS_ISS_DeepLearningWorkshop")]),t._v(" "),a("p",[t._v("机器学习(Machine Learning)&深度学习(Deep Learning)资料\nhttps://ask.julyedu.com/article/58")]),t._v(" "),a("p",[t._v("Risk Management 大数据之风控\n中国风控之蛮荒，正如金融危机前的美国… http://mp.weixin.qq.com/s?__biz=MzIxNjM3MDc4Mg==&mid=2247484694&idx=1&sn=f8f867ea55d5d4ed8a3feba95260efad&chksm=978b5e27a0fcd731fef42c96bdd7aa634b1c7ace41362df580391890237ff4c9179176b0e744&mpshare=1&scene=1&srcid=0413s4Xtcc8iNxgk78kfrXrn#rd\nhttp://v2.shendunfengkong.com/")]),t._v(" "),a("p",[t._v("https://spark-summit.org/east-2016/events/realtime-risk-management-using-kafka-python-and-spark-streaming/")]),t._v(" "),a("p",[t._v("https://databricks.com")]),t._v(" "),a("p",[t._v("京东基于Spark的风控系统架构实践和技术细节 www.infoq.com/cn/articles/jingdong-risk-control-system-architecture-based-on-spark\nhttps://www.slideshare.net/SparkSummit/realtime-risk-management-using-kafka-python-and-spark-streaming-by-nick-evans")]),t._v(" "),a("p",[t._v("Setup hortonwork cluster (spark standalone clusters) in local\nApache Ambari Installation https://docs.hortonworks.com/HDPDocuments/Ambari-2.6.1.5/bk_ambari-installation/content/ch_Getting_Ready.html")]),t._v(" "),a("p",[t._v("What is the difference between using Ambari for HDP and not using it in Hortonworks? https://www.quora.com/What-is-the-difference-between-using-Ambari-for-HDP-and-not-using-it-in-Hortonworks\nAmbari and HDP Installation: Quick Start for new Virtual Machine Users https://community.hortonworks.com/articles/69385/ambari-and-hdp-installation-quick-start-for-new-vi.html")]),t._v(" "),a("disqus")],1)}),[],!1,null,null,null);e.default=n.exports}}]);