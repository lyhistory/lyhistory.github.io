https://flink.apache.org/

![](https://flink.apache.org/img/flink-home-graphic.png)

## Intro
### Architecture
https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/concepts/flink-architecture/
![](https://nightlies.apache.org/flink/flink-docs-release-1.15/fig/processes.svg)

### Key Concepts
#### Streams
Obviously, streams are a fundamental aspect of stream processing. However, streams can have different characteristics that affect how a stream can and should be processed. Flink is a versatile processing framework that can handle any kind of stream.

**Bounded and unbounded streams:** 
Streams can be unbounded or bounded, i.e., fixed-sized data sets. Flink has sophisticated features to process unbounded streams, but also dedicated operators to efficiently process bounded streams.
    
    + Unbounded streams 
    have a start but no defined end. They do not terminate and provide data as it is generated. Unbounded streams must be continuously processed, i.e., events must be promptly handled after they have been ingested. It is not possible to wait for all input data to arrive because the input is unbounded and will not be complete at any point in time. Processing unbounded data often requires that events are ingested in a specific order, such as the order in which events occurred, to be able to reason about result completeness.

    + Bounded streams 
    have a defined start and end. Bounded streams can be processed by ingesting all data before performing any computations. Ordered ingestion is not required to process bounded streams because a bounded data set can always be sorted. Processing of bounded streams is also known as batch processing.

**Real-time and recorded streams:** 
All data are generated as streams. There are two ways to process the data. Processing it in real-time as it is generated or persisting the stream to a storage system, e.g., a file system or object store, and processed it later. Flink applications can process recorded or real-time streams.

#### State
Every non-trivial streaming application is stateful, i.e., only applications that apply transformations on individual events do not require state. Any application that runs basic business logic needs to remember events or intermediate results to access them at a later point in time, for example when the next event is received or after a specific time duration.
Application state is a first-class citizen in Flink. You can see that by looking at all the features that Flink provides in the context of state handling.

+ Multiple State Primitives: 
Flink provides state primitives for different data structures, such as atomic values, lists, or maps. Developers can choose the state primitive that is most efficient based on the access pattern of the function.
+ Pluggable State Backends: 
Application state is managed in and checkpointed by a pluggable state backend. Flink features different state backends that store state in memory or in RocksDB, an efficient embedded on-disk data store. Custom state backends can be plugged in as well.
+ Exactly-once state consistency: 
Flink’s checkpointing and recovery algorithms guarantee the consistency of application state in case of a failure. Hence, failures are transparently handled and do not affect the correctness of an application.
+ Very Large State: 
Flink is able to maintain application state of several terabytes in size due to its asynchronous and incremental checkpoint algorithm.
+ Scalable Applications: 
Flink supports scaling of stateful applications by redistributing the state to more or fewer workers.

#### Time
+ Event-time Mode: 
Applications that process streams with event-time semantics compute results based on timestamps of the events. Thereby, event-time processing allows for accurate and consistent results regardless whether recorded or real-time events are processed.
+ Watermark Support: 
Flink employs watermarks to reason about time in event-time applications. Watermarks are also a flexible mechanism to trade-off the latency and completeness of results.
+ Late Data Handling: 
When processing streams in event-time mode with watermarks, it can happen that a computation has been completed before all associated events have arrived. Such events are called late events. Flink features multiple options to handle late events, such as rerouting them via side outputs and updating previously completed results.
+ Processing-time Mode: 
In addition to its event-time mode, Flink also supports processing-time semantics which performs computations as triggered by the wall-clock time of the processing machine. The processing-time mode can be suitable for certain applications with strict low-latency requirements that can tolerate approximate results.

#### Terms

+ Cluster
  + **Flink Cluster**
    A distributed system consisting of (typically) one JobManager and one or more Flink TaskManager processes.
  + **Flink Application Cluster**
    A Flink Application Cluster is a dedicated Flink Cluster that only executes Flink Jobs from one Flink Application. The lifetime of the Flink Cluster is bound to the lifetime of the Flink Application.
  + **Flink Job Cluster**
    A Flink Job Cluster is a dedicated Flink Cluster that only executes a single Flink Job. The lifetime of the Flink Cluster is bound to the lifetime of the Flink Job. This deployment mode has been deprecated since Flink 1.15.
  + **Flink Session Cluster**
    A long-running Flink Cluster which accepts multiple Flink Jobs for execution. The lifetime of this Flink Cluster is not bound to the lifetime of any Flink Job. Formerly, a Flink Session Cluster was also known as a Flink Cluster in session mode. Compare to Flink Application Cluster.

+ Manager
  + **Flink TaskManager**
    TaskManagers are the worker processes of a Flink Cluster. Tasks are scheduled to TaskManagers for execution. They communicate with each other to exchange data between subsequent Tasks.
  + **Flink JobManager**
  The JobManager is the orchestrator of a Flink Cluster. It contains three distinct components: 
    + **Flink Resource Manager**, 
    + **Flink Dispatcher** 
    + and one  **Flink JobMaster** per running Flink Job.
      JobMasters are one of the components running in the JobManager. A JobMaster is responsible for supervising the execution of the Tasks of a single job.

+ Term    
  + **Flink Application**
    A Flink application is a Java Application that submits one or multiple Flink Jobs from the main() method (or by some other means). Submitting jobs is usually done by calling execute() on an execution environment.
    The jobs of an application can either be submitted to a long running Flink Session Cluster, to a dedicated Flink Application Cluster, or to a Flink Job Cluster.
  + **Flink Job**
    A Flink Job is the runtime representation of a logical graph (also often called dataflow graph) that is created and submitted by calling execute() in a Flink Application.
  + **JobGraph / Logical Graph**
    A logical graph is a directed graph where the nodes are Operators and the edges define input/output-relationships of the operators and correspond to data streams or data sets. A logical graph is created by submitting jobs from a Flink Application.
    Logical graphs are also often referred to as dataflow graphs. 
    + **Operator Chain**
      An Operator Chain consists of two or more consecutive Operators without any repartitioning in between. Operators within the same Operator Chain forward records to each other directly without going through serialization or Flink’s network stack.
  + **ExecutionGraph/Physical Graph**
    A physical graph is the result of translating a Logical Graph for execution in a distributed runtime. The nodes are Tasks and the edges indicate input/output-relationships or partitions of data streams or data sets.
    + **Task**
      Node of a Physical Graph. A task is the basic unit of work, which is executed by Flink’s runtime. Tasks encapsulate exactly one parallel instance of an Operator or Operator Chain.
    + **Sub-Task**
      A Sub-Task is a Task responsible for processing a partition of the data stream. The term “Sub-Task” emphasizes that there are multiple parallel Tasks for the same Operator or Operator Chain.
  + **Record**
    Records are the constituent elements of a data set or data stream. Operators and Functions receive records as input and emit records as output.
  + **Event**
    An event is a statement about a change of the state of the domain modelled by the application. Events can be input and/or output of a stream or batch processing application. Events are special types of records.
  + **Instance**
    The term instance is used to describe a specific instance of a specific type (usually Operator or Function) during runtime. As Apache Flink is mostly written in Java, this corresponds to the definition of Instance or Object in Java. In the context of Apache Flink, the term parallel instance is also frequently used to emphasize that multiple instances of the same Operator or Function type are running in parallel.
      + **Operator**
        Node of a Logical Graph. An Operator performs a certain operation, which is usually executed by a Function. Sources and Sinks are special Operators for data ingestion and data egress.
        https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/dev/datastream/operators/overview/
      + **Function**
        Functions are implemented by the user and encapsulate the application logic of a Flink program. Most Functions are wrapped by a corresponding Operator.
        https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/dev/datastream/user_defined_functions/
  + **JobResultStore**
    The JobResultStore is a Flink component that persists the results of globally terminated (i.e. finished, cancelled or failed) jobs to a filesystem, allowing the results to outlive a finished job. These results are then used by Flink to determine whether jobs should be subject to recovery in highly-available clusters.
  + **Managed State**
    Managed State describes application state which has been registered with the framework. For Managed State, Apache Flink will take care about persistence and rescaling among other things.
  + **Checkpoint Storage**
    The location where the State Backend will store its snapshot during a checkpoint (Java Heap of JobManager or Filesystem). 
  + **Partition**
    A partition is an independent subset of the overall data stream or data set. A data stream or data set is divided into partitions by assigning each record to one or more partitions. Partitions of data streams or data sets are consumed by Tasks during runtime. A transformation which changes the way a data stream or data set is partitioned is often called repartitioning.
  + **(Runtime) Execution Mode**
    DataStream API programs can be executed in one of two execution modes: BATCH or STREAMING. See Execution Mode for more details.
  + **State Backend**
    For stream processing programs, the State Backend of a Flink Job determines how its state is stored on each TaskManager (Java Heap of TaskManager or (embedded) RocksDB).
  + **Table Program**
    A generic term for pipelines declared with Flink’s relational APIs (Table API or SQL).
  + **Transformation**
    A Transformation is applied on one or more data streams or data sets and results in one or more output data streams or data sets. A transformation might change a data stream or data set on a per-record basis, but might also only change its partitioning or perform an aggregation. While Operators and Functions are the “physical” parts of Flink’s API, Transformations are only an API concept. Specifically, most transformations are implemented by certain Operators.

## install&deployment
### local Standalone
https://nightlies.apache.org/flink/flink-docs-release-1.15//docs/try-flink/local_installation/
https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/try-flink/flink-operations-playground/
https://nightlies.apache.org/flink/flink-docs-release-1.14//docs/try-flink/local_installation/

```
$ java -version
$ tar -xzf flink-*.tgz
$ cd flink-* && ls -l
$ ./bin/start-cluster.sh

localhost:8081 to view the Flink dashboard 

$ ./bin/stop-cluster.sh

$ ./bin/flink run examples/streaming/WordCount.jar
$ tail log/flink-*-taskexecutor-*.out
```

WordCount:
```
public class WordCount
{
  public static void main(String[] args) throws Exception {
    MultipleParameterTool params = MultipleParameterTool.fromArgs(args);
    StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
    env.getConfig().setGlobalJobParameters(params);

    DataStreamSource dataStreamSource = null;
    if (params.has("input")) {
      DataStream dataStream;
      for (String input : params.getMultiParameterRequired("input")) {
        if (dataStreamSource == null) {
          DataStreamSource dataStreamSource1; dataStreamSource1 = env.readTextFile(input); continue;
        } 
        dataStream = dataStreamSource1.union(new DataStream[] { env.readTextFile(input) });
      }      
      Preconditions.checkNotNull(dataStream, "Input DataStream should not be null.");
    } else {
      System.out.println("Executing WordCount example with default input data set.");
      System.out.println("Use --input to specify file input.");
      
      dataStreamSource = env.fromElements(WordCountData.WORDS);
    } 
 
    SingleOutputStreamOperator singleOutputStreamOperator = dataStreamSource.flatMap(new Tokenizer()).keyBy(value -> (String)value.f0).sum(1);

    if (params.has("output")) {
      singleOutputStreamOperator.writeAsText(params.get("output"));
    } else {
      System.out.println("Printing result to stdout. Use --output to specify output path.");
      singleOutputStreamOperator.print();
    } 
    env.execute("Streaming WordCount");
  }
  
  public static final class Tokenizer extends Object implements FlatMapFunction<String, Tuple2<String, Integer>> {
    public void flatMap(String value, Collector<Tuple2<String, Integer>> out) { // Byte code:
      //   0: aload_1
      //   1: invokevirtual toLowerCase : ()Ljava/lang/String;
      //   4: ldc '\W+'
      //   6: invokevirtual split : (Ljava/lang/String;)[Ljava/lang/String;
      //   9: astore_3
      //   10: aload_3
      //   11: astore #4
      //   13: aload #4
      //   15: arraylength
      //   16: istore #5
      //   18: iconst_0
      //   19: istore #6
      //   21: iload #6
      //   23: iload #5
      //   25: if_icmpge -> 68
      //   28: aload #4
      //   30: iload #6
      //   32: aaload
      //   33: astore #7
      //   35: aload #7
      //   37: invokevirtual length : ()I
      //   40: ifle -> 62
      //   43: aload_2
      //   44: new org/apache/flink/api/java/tuple/Tuple2
      //   47: dup
      //   48: aload #7
      //   50: iconst_1
      //   51: invokestatic valueOf : (I)Ljava/lang/Integer;
      //   54: invokespecial <init> : (Ljava/lang/Object;Ljava/lang/Object;)V
      //   57: invokeinterface collect : (Ljava/lang/Object;)V
      //   62: iinc #6, 1
      //   65: goto -> 21
      //   68: return
      // Line number table:
      //   Java source line number -> byte code offset
      //   #115	-> 0
      //   #118	-> 10
      //   #119	-> 35
      //   #120	-> 43
      //   #118	-> 62
      //   #123	-> 68
      // Local variable table:
      //   start	length	slot	name	descriptor
      //   35	27	7	token	Ljava/lang/String;
      //   0	69	0	this	Lorg/apache/flink/streaming/examples/wordcount/WordCount$Tokenizer;
      //   0	69	1	value	Ljava/lang/String;
      //   0	69	2	out	Lorg/apache/flink/util/Collector;
      //   10	59	3	tokens	[Ljava/lang/String;
      // Local variable type table:
      //   start	length	slot	name	signature
      //   0	69	2	out	Lorg/apache/flink/util/Collector<Lorg/apache/flink/api/java/tuple/Tuple2<Ljava/lang/String;Ljava/lang/Integer;>;>; }
  }
}

```

#### Job Manager Log
vim log/flink-root-standalonesession-0-vm01.log 

##### 启动
```
2022-05-26 14:14:26,762 INFO  org.apache.flink.runtime.dispatcher.DispatcherRestEndpoint   [] - Rest endpoint listening at localhost:8081
2022-05-26 14:14:26,763 INFO  org.apache.flink.runtime.dispatcher.DispatcherRestEndpoint   [] - http://localhost:8081 was granted leadership with leaderSessionID=00000000-0000-0000-0000-000000000000
2022-05-26 14:14:26,765 INFO  org.apache.flink.runtime.dispatcher.DispatcherRestEndpoint   [] - Web frontend listening at http://localhost:8081.
2022-05-26 14:14:26,816 INFO  org.apache.flink.runtime.dispatcher.runner.DefaultDispatcherRunner [] - DefaultDispatcherRunner was granted leadership with leader id 00000000-0000-0000-0000-000000000000. Creating new DispatcherLeaderProcess.
2022-05-26 14:14:26,823 INFO  org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess [] - Start SessionDispatcherLeaderProcess.
2022-05-26 14:14:26,825 INFO  org.apache.flink.runtime.resourcemanager.ResourceManagerServiceImpl [] - Starting resource manager service.
2022-05-26 14:14:26,827 INFO  org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess [] - Recover all persisted job graphs.
2022-05-26 14:14:26,827 INFO  org.apache.flink.runtime.resourcemanager.ResourceManagerServiceImpl [] - Resource manager service is granted leadership with session id 00000000-0000-0000-0000-000000000000.
2022-05-26 14:14:26,827 INFO  org.apache.flink.runtime.dispatcher.runner.SessionDispatcherLeaderProcess [] - Successfully recovered 0 persisted job graphs.
2022-05-26 14:14:27,481 INFO  org.apache.flink.runtime.rpc.akka.AkkaRpcService             [] - Starting RPC endpoint for org.apache.flink.runtime.dispatcher.StandaloneDispatcher at akka://flink/user/rpc/dispatcher_0 .
2022-05-26 14:14:27,516 INFO  org.apache.flink.runtime.rpc.akka.AkkaRpcService             [] - Starting RPC endpoint for org.apache.flink.runtime.resourcemanager.StandaloneResourceManager at akka://flink/user/rpc/resourcemanager_1 .
2022-05-26 14:14:27,543 INFO  org.apache.flink.runtime.resourcemanager.StandaloneResourceManager [] - Starting the resource manager.
2022-05-26 14:14:27,927 INFO  org.apache.flink.runtime.resourcemanager.StandaloneResourceManager [] - Registering TaskManager with ResourceID 10.136.100.48:35016-a4d337 (akka.tcp://flink@10.136.100.48:35016/user/rpc/taskmanager_0) at ResourceManager
```

##### 接收job，create->running/schedule->deploy
```
2022-05-27 16:13:00,098 INFO  org.apache.flink.runtime.dispatcher.StandaloneDispatcher     [] - Received JobGraph submission 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,100 INFO  org.apache.flink.runtime.dispatcher.StandaloneDispatcher     [] - Submitting job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,151 INFO  org.apache.flink.runtime.rpc.akka.AkkaRpcService             [] - Starting RPC endpoint for org.apache.flink.runtime.jobmaster.JobMaster at akka://flink/user/rpc/jobmanager_2 .
2022-05-27 16:13:00,165 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Initializing job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,211 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Using restart back off time strategy NoRestartBackoffTimeStrategy for Streaming WordCount (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,279 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Running initialization on master for job Streaming WordCount (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,279 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Successfully ran initialization on master in 0 ms.
2022-05-27 16:13:00,321 INFO  org.apache.flink.runtime.scheduler.adapter.DefaultExecutionTopology [] - Built 1 pipelined regions in 0 ms
2022-05-27 16:13:00,393 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - No state backend has been configured, using default (HashMap) org.apache.flink.runtime.state.hashmap.HashMapStateBackend@3a91353f
2022-05-27 16:13:00,394 INFO  org.apache.flink.runtime.state.StateBackendLoader            [] - State backend loader loads the state backend as HashMapStateBackend
2022-05-27 16:13:00,396 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Checkpoint storage is set to 'jobmanager'
2022-05-27 16:13:00,417 INFO  org.apache.flink.runtime.checkpoint.CheckpointCoordinator    [] - No checkpoint found during restore.
2022-05-27 16:13:00,444 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Using failover strategy org.apache.flink.runtime.executiongraph.failover.flip1.RestartPipelinedRegionFailoverStrategy@6e20b54e for Streaming WordCount (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,460 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Starting execution of job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467) under job master id 00000000000000000000000000000000.
2022-05-27 16:13:00,463 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Starting scheduling with scheduling strategy [org.apache.flink.runtime.scheduler.strategy.PipelinedRegionSchedulingStrategy]
2022-05-27 16:13:00,463 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Job Streaming WordCount (f69c1ca4892ecbc08d4247ded254f467) switched from state CREATED to RUNNING.
2022-05-27 16:13:00,468 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Source: Collection Source -> Flat Map (1/1) (c83c41ff9f43c36e7a6aea483e073ec1) switched from CREATED to SCHEDULED.
2022-05-27 16:13:00,468 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1) (a602bd7b23ece40a69422f7b36701083) switched from CREATED to SCHEDULED.
2022-05-27 16:13:00,492 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Connecting to ResourceManager akka.tcp://flink@localhost:6123/user/rpc/resourcemanager_*(00000000000000000000000000000000)
2022-05-27 16:13:00,499 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Resolved ResourceManager address, beginning registration
2022-05-27 16:13:00,502 INFO  org.apache.flink.runtime.resourcemanager.StandaloneResourceManager [] - Registering job manager 00000000000000000000000000000000@akka.tcp://flink@localhost:6123/user/rpc/jobmanager_2 for job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:00,509 INFO  org.apache.flink.runtime.resourcemanager.StandaloneResourceManager [] - Registered job manager 00000000000000000000000000000000@akka.tcp://flink@localhost:6123/user/rpc/jobmanager_2 for job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:00,512 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - JobManager successfully registered at ResourceManager, leader id: 00000000000000000000000000000000.
2022-05-27 16:13:00,514 INFO  org.apache.flink.runtime.resourcemanager.slotmanager.DeclarativeSlotManager [] - Received resource requirements from job f69c1ca4892ecbc08d4247ded254f467: [ResourceRequirement{resourceProfile=ResourceProfile{UNKNOWN}, numberOfRequiredSlots=1}]
2022-05-27 16:13:00,636 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Source: Collection Source -> Flat Map (1/1) (c83c41ff9f43c36e7a6aea483e073ec1) switched from SCHEDULED to DEPLOYING.
2022-05-27 16:13:00,637 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Deploying Source: Collection Source -> Flat Map (1/1) (attempt #0) with attempt id c83c41ff9f43c36e7a6aea483e073ec1 to 10.136.100.48:35016-a4d337 @ sgkc2-devclr-v08 (dataPort=59281) with allocation id 3b41f2b6c9f47bf531ac47e91afde9fb
2022-05-27 16:13:00,646 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1) (a602bd7b23ece40a69422f7b36701083) switched from SCHEDULED to DEPLOYING.
2022-05-27 16:13:00,646 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Deploying Keyed Aggregation -> Sink: Print to Std. Out (1/1) (attempt #0) with attempt id a602bd7b23ece40a69422f7b36701083 to 10.136.100.48:35016-a4d337 @ sgkc2-devclr-v08 (dataPort=59281) with allocation id 3b41f2b6c9f47bf531ac47e91afde9fb
2022-05-27 16:13:00,905 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1) (a602bd7b23ece40a69422f7b36701083) switched from DEPLOYING to INITIALIZING.
2022-05-27 16:13:00,908 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Source: Collection Source -> Flat Map (1/1) (c83c41ff9f43c36e7a6aea483e073ec1) switched from DEPLOYING to INITIALIZING.
2022-05-27 16:13:01,166 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Source: Collection Source -> Flat Map (1/1) (c83c41ff9f43c36e7a6aea483e073ec1) switched from INITIALIZING to RUNNING.
2022-05-27 16:13:01,196 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1) (a602bd7b23ece40a69422f7b36701083) switched from INITIALIZING to RUNNING.
2022-05-27 16:13:01,223 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Source: Collection Source -> Flat Map (1/1) (c83c41ff9f43c36e7a6aea483e073ec1) switched from RUNNING to FINISHED.
2022-05-27 16:13:01,246 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1) (a602bd7b23ece40a69422f7b36701083) switched from RUNNING to FINISHED.
2022-05-27 16:13:01,249 INFO  org.apache.flink.runtime.executiongraph.ExecutionGraph       [] - Job Streaming WordCount (f69c1ca4892ecbc08d4247ded254f467) switched from state RUNNING to FINISHED.
2022-05-27 16:13:01,249 INFO  org.apache.flink.runtime.checkpoint.CheckpointCoordinator    [] - Stopping checkpoint coordinator for job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:01,250 INFO  org.apache.flink.runtime.resourcemanager.slotmanager.DeclarativeSlotManager [] - Clearing resource requirements of job f69c1ca4892ecbc08d4247ded254f467
2022-05-27 16:13:01,279 INFO  org.apache.flink.runtime.dispatcher.StandaloneDispatcher     [] - Job f69c1ca4892ecbc08d4247ded254f467 reached terminal state FINISHED.
2022-05-27 16:13:01,314 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Stopping the JobMaster for job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:01,320 INFO  org.apache.flink.runtime.checkpoint.StandaloneCompletedCheckpointStore [] - Shutting down
2022-05-27 16:13:01,322 INFO  org.apache.flink.runtime.jobmaster.slotpool.DefaultDeclarativeSlotPool [] - Releasing slot [3b41f2b6c9f47bf531ac47e91afde9fb].
2022-05-27 16:13:01,328 INFO  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Close ResourceManager connection 4a2508526d0621625a55daa90f37e499: Stopping JobMaster for job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:01,330 INFO  org.apache.flink.runtime.resourcemanager.StandaloneResourceManager [] - Disconnect job manager 00000000000000000000000000000000@akka.tcp://flink@localhost:6123/user/rpc/jobmanager_2 for job f69c1ca4892ecbc08d4247ded254f467 from the resource manager.
```
#### Task Manager Log
vim flink-root-taskexecutor-0-vm01.log
##### 启动
```
INFO  [] - Final TaskExecutor Memory configuration:
INFO  [] -   Total Process Memory:          1.688gb (1811939328 bytes)
INFO  [] -     Total Flink Memory:          1.250gb (1342177280 bytes)
INFO  [] -       Total JVM Heap Memory:     512.000mb (536870902 bytes)
INFO  [] -         Framework:               128.000mb (134217728 bytes)
INFO  [] -         Task:                    384.000mb (402653174 bytes)
INFO  [] -       Total Off-heap Memory:     768.000mb (805306378 bytes)
INFO  [] -         Managed:                 512.000mb (536870920 bytes)
INFO  [] -         Total JVM Direct Memory: 256.000mb (268435458 bytes)
INFO  [] -           Framework:             128.000mb (134217728 bytes)
INFO  [] -           Task:                  0 bytes
INFO  [] -           Network:               128.000mb (134217730 bytes)
INFO  [] -     JVM Metaspace:               256.000mb (268435456 bytes)
INFO  [] -     JVM Overhead:                192.000mb (201326592 bytes)

2022-05-26 14:14:23,738 INFO  org.apache.flink.runtime.taskexecutor.TaskManagerRunner      [] - --------------------------------------------------------------------------------
2022-05-26 14:14:23,739 INFO  org.apache.flink.runtime.taskexecutor.TaskManagerRunner      [] -  Starting TaskManager (Version: 1.14.4, Scala: 2.11, Rev:895c609, Date:2022-02-25T11:57:14+01:00)
................
2022-05-26 14:14:27,050 INFO  org.apache.flink.runtime.io.network.NettyShuffleEnvironment  [] - Starting the network environment and its components.
2022-05-26 14:14:27,134 INFO  org.apache.flink.runtime.io.network.netty.NettyClient        [] - Transport type 'auto': using EPOLL.
2022-05-26 14:14:27,137 INFO  org.apache.flink.runtime.io.network.netty.NettyClient        [] - Successful initialization (took 86 ms).
2022-05-26 14:14:27,143 INFO  org.apache.flink.runtime.io.network.netty.NettyServer        [] - Transport type 'auto': using EPOLL.
2022-05-26 14:14:27,186 INFO  org.apache.flink.runtime.io.network.netty.NettyServer        [] - Successful initialization (took 47 ms). Listening on SocketAddress /0.0.0.0:59281.
2022-05-26 14:14:27,187 INFO  org.apache.flink.runtime.taskexecutor.KvStateService         [] - Starting the kvState service and its components.
2022-05-26 14:14:27,519 INFO  org.apache.flink.runtime.rpc.akka.AkkaRpcService             [] - Starting RPC endpoint for org.apache.flink.runtime.taskexecutor.TaskExecutor at akka://flink/user/rpc/taskmanager_0 .
2022-05-26 14:14:27,541 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Start job leader service.
2022-05-26 14:14:27,543 INFO  org.apache.flink.runtime.filecache.FileCache                 [] - User file cache uses directory /tmp/flink-dist-cache-b87b98d1-b215-449a-b134-71cb2efd67e5
2022-05-26 14:14:27,546 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Connecting to ResourceManager akka.tcp://flink@localhost:6123/user/rpc/resourcemanager_*(00000000000000000000000000000000).
....
2022-05-26 14:14:24,566 INFO  org.apache.flink.runtime.util.LeaderRetrievalUtils           [] - Trying to select the network interface and address to use by connecting to the leading JobManager.
....
2022-05-26 14:14:27,812 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Resolved ResourceManager address, beginning registration
2022-05-26 14:14:27,950 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Successful registration at resource manager akka.tcp://flink@localhost:6123/user/rpc/resourcemanager_* under registration id 82d6263f9d0c12c01c047caa988f2d1a.
```
##### 接收task,具体执行
```
2022-05-27 16:13:00,529 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Receive slot request 3b41f2b6c9f47bf531ac47e91afde9fb for job f69c1ca4892ecbc08d4247ded254f467 from resource manager with leader id 00000000000000000000000000000000.
2022-05-27 16:13:00,548 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Allocated slot for 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,551 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Add job f69c1ca4892ecbc08d4247ded254f467 for job leader monitoring.
2022-05-27 16:13:00,554 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Try to register at job manager akka.tcp://flink@localhost:6123/user/rpc/jobmanager_2 with leader id 00000000-0000-0000-0000-000000000000.
2022-05-27 16:13:00,589 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Resolved JobManager address, beginning registration
2022-05-27 16:13:00,613 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Successful registration at job manager akka.tcp://flink@localhost:6123/user/rpc/jobmanager_2 for job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:00,614 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Establish JobManager connection for job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:00,618 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Offer reserved slots to the leader of job f69c1ca4892ecbc08d4247ded254f467.
2022-05-27 16:13:00,682 INFO  org.apache.flink.runtime.taskexecutor.slot.TaskSlotTableImpl [] - Activate slot 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,706 INFO  org.apache.flink.runtime.state.changelog.StateChangelogStorageLoader [] - Creating a changelog storage with name 'memory'.
2022-05-27 16:13:00,737 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Received task Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1), deploy into slot with allocation id 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,739 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1) switched from CREATED to DEPLOYING.
2022-05-27 16:13:00,746 INFO  org.apache.flink.runtime.taskexecutor.slot.TaskSlotTableImpl [] - Activate slot 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,748 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Loading JAR files for task Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1) [DEPLOYING].
2022-05-27 16:13:00,754 INFO  org.apache.flink.runtime.taskexecutor.slot.TaskSlotTableImpl [] - Activate slot 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,754 INFO  org.apache.flink.runtime.blob.BlobClient                     [] - Downloading f69c1ca4892ecbc08d4247ded254f467/p-1e9bc735196982c3db4e502b3af82b3579da2836-dbdb712e9143718fee67e7aab9708f9a from localhost/127.0.0.1:34934
2022-05-27 16:13:00,782 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Received task Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083), deploy into slot with allocation id 3b41f2b6c9f47bf531ac47e91afde9fb.
2022-05-27 16:13:00,784 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083) switched from CREATED to DEPLOYING.
2022-05-27 16:13:00,786 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Loading JAR files for task Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083) [DEPLOYING].
2022-05-27 16:13:00,867 INFO  org.apache.flink.streaming.runtime.tasks.StreamTask          [] - No state backend has been configured, using default (HashMap) org.apache.flink.runtime.state.hashmap.HashMapStateBackend@47ff2446
2022-05-27 16:13:00,867 INFO  org.apache.flink.runtime.state.StateBackendLoader            [] - State backend loader loads the state backend as HashMapStateBackend
2022-05-27 16:13:00,870 INFO  org.apache.flink.streaming.runtime.tasks.StreamTask          [] - Checkpoint storage is set to 'jobmanager'
2022-05-27 16:13:00,874 INFO  org.apache.flink.streaming.runtime.tasks.StreamTask          [] - No state backend has been configured, using default (HashMap) org.apache.flink.runtime.state.hashmap.HashMapStateBackend@4f8c0490
2022-05-27 16:13:00,874 INFO  org.apache.flink.runtime.state.StateBackendLoader            [] - State backend loader loads the state backend as HashMapStateBackend
2022-05-27 16:13:00,874 INFO  org.apache.flink.streaming.runtime.tasks.StreamTask          [] - Checkpoint storage is set to 'jobmanager'
2022-05-27 16:13:00,894 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083) switched from DEPLOYING to INITIALIZING.
2022-05-27 16:13:00,895 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1) switched from DEPLOYING to INITIALIZING.
2022-05-27 16:13:01,162 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1) switched from INITIALIZING to RUNNING.
2022-05-27 16:13:01,165 INFO  org.apache.flink.runtime.state.heap.HeapKeyedStateBackendBuilder [] - Finished to build heap keyed state-backend.
2022-05-27 16:13:01,178 INFO  org.apache.flink.runtime.state.heap.HeapKeyedStateBackend    [] - Initializing heap keyed state backend with stream factory.
2022-05-27 16:13:01,194 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083) switched from INITIALIZING to RUNNING.
2022-05-27 16:13:01,197 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1) switched from RUNNING to FINISHED.
2022-05-27 16:13:01,197 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Freeing task resources for Source: Collection Source -> Flat Map (1/1)#0 (c83c41ff9f43c36e7a6aea483e073ec1).
2022-05-27 16:13:01,199 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Un-registering task and sending final execution state FINISHED to JobManager for task Source: Collection Source -> Flat Map (1/1)#0 c83c41ff9f43c36e7a6aea483e073ec1.
2022-05-27 16:13:01,240 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083) switched from RUNNING to FINISHED.
2022-05-27 16:13:01,240 INFO  org.apache.flink.runtime.taskmanager.Task                    [] - Freeing task resources for Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 (a602bd7b23ece40a69422f7b36701083).
2022-05-27 16:13:01,242 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Un-registering task and sending final execution state FINISHED to JobManager for task Keyed Aggregation -> Sink: Print to Std. Out (1/1)#0 a602bd7b23ece40a69422f7b36701083.
2022-05-27 16:13:01,338 INFO  org.apache.flink.runtime.taskexecutor.slot.TaskSlotTableImpl [] - Free slot TaskSlot(index:0, state:ACTIVE, resource profile: ResourceProfile{cpuCores=1, taskHeapMemory=384.000mb (402653174 bytes), taskOffHeapMemory=0 bytes, managedMemory=512.000mb (536870920 bytes), networkMemory=128.000mb (134217730 bytes)}, allocationId: 3b41f2b6c9f47bf531ac47e91afde9fb, jobId: f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:01,342 INFO  org.apache.flink.runtime.taskexecutor.DefaultJobLeaderService [] - Remove job f69c1ca4892ecbc08d4247ded254f467 from job leader monitoring.
2022-05-27 16:13:01,343 INFO  org.apache.flink.runtime.taskexecutor.TaskExecutor           [] - Close JobManager connection for job f69c1ca4892ecbc08d4247ded254f467.
```
##### 具体执行输出
vim log/flink-root-taskexecutor-0-vm01.out
```
(to,1)
(be,1)
(or,1)
(not,1)
(to,2)
(be,2)
(that,1)
(is,1)
(the,1)
```
#### Client Log
vim log/flink-root-client-vm01.log
```
2022-05-27 16:12:57,601 INFO  org.apache.flink.client.cli.CliFrontend                      [] -  Program Arguments:
2022-05-27 16:12:57,603 INFO  org.apache.flink.client.cli.CliFrontend                      [] -     run
2022-05-27 16:12:57,603 INFO  org.apache.flink.client.cli.CliFrontend                      [] -     examples/streaming/WordCount.jar
2022-05-27 16:12:58,065 INFO  org.apache.flink.client.cli.CliFrontend                      [] - Running 'run' command.
2022-05-27 16:12:58,098 INFO  org.apache.flink.client.cli.CliFrontend                      [] - Building program from JAR file
2022-05-27 16:12:58,118 INFO  org.apache.flink.client.ClientUtils                          [] - Starting program (detached: false)
2022-05-27 16:12:59,179 INFO  org.apache.flink.configuration.Configuration                 [] - Config uses fallback configuration key 'jobmanager.rpc.address' instead of key 'rest.address'
2022-05-27 16:12:59,310 INFO  org.apache.flink.client.program.rest.RestClusterClient       [] - Submitting job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467).
2022-05-27 16:13:00,207 INFO  org.apache.flink.client.program.rest.RestClusterClient       [] - Successfully submitted job 'Streaming WordCount' (f69c1ca4892ecbc08d4247ded254f467) to 'http://localhost:8081'.
2022-05-27 16:13:03,555 INFO  org.apache.flink.configuration.Configuration                 [] - Config uses fallback configuration key 'jobmanager.rpc.address' instead of key 'rest.address'
```

### production
https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/overview/
hdfs

https://flink.apache.org/training.html

#### Job Manager Log
vim log/flink-root-standalonesession-0-vm01.log 
```

```

#### Task Manager Log
vim flink-root-taskexecutor-0-vm01.log

```
2022-05-26 19:05:08,330 INFO  org.apache.flink.runtime.util.LeaderRetrievalUtils            - Trying to select the network interface and address to use by connecting to the leading JobManager.
2022-05-26 19:05:08,330 INFO  org.apache.flink.runtime.util.LeaderRetrievalUtils            - TaskManager will try to connect for PT10S before falling back to heuristics
2022-05-26 19:05:08,474 INFO  org.apache.flink.runtime.net.ConnectionUtils                  - Retrieved new target address /X.X.X.3:13002.
```

## API&Libs
### Layered APIs
![](https://nightlies.apache.org/flink/flink-docs-release-1.15/fig/levels_of_abstraction.svg)
#### Stateful Event-Driven Applications - ProcessFunctions(events,state,time)
ProcessFunctions are the most expressive function interfaces that Flink offers. Flink provides ProcessFunctions to process individual events from one or two input streams or events that were grouped in a window. ProcessFunctions provide fine-grained control over time and state. A ProcessFunction can arbitrarily modify its state and register timers that will trigger a callback function in the future. Hence, ProcessFunctions can implement complex per-event business logic as required for many stateful event-driven applications.
```
/**
 * Matches keyed START and END events and computes the difference between 
 * both elements' timestamps. The first String field is the key attribute, 
 * the second String attribute marks START and END events.
 */
public static class StartEndDuration
    extends KeyedProcessFunction<String, Tuple2<String, String>, Tuple2<String, Long>> {

  private ValueState<Long> startTime;

  @Override
  public void open(Configuration conf) {
    // obtain state handle
    startTime = getRuntimeContext()
      .getState(new ValueStateDescriptor<Long>("startTime", Long.class));
  }

  /** Called for each processed event. */
  @Override
  public void processElement(
      Tuple2<String, String> in,
      Context ctx,
      Collector<Tuple2<String, Long>> out) throws Exception {

    switch (in.f1) {
      case "START":
        // set the start time if we receive a start event.
        startTime.update(ctx.timestamp());
        // register a timer in four hours from the start event.
        ctx.timerService()
          .registerEventTimeTimer(ctx.timestamp() + 4 * 60 * 60 * 1000);
        break;
      case "END":
        // emit the duration between start and end event
        Long sTime = startTime.value();
        if (sTime != null) {
          out.collect(Tuple2.of(in.f0, ctx.timestamp() - sTime));
          // clear the state
          startTime.clear();
        }
      default:
        // do nothing
    }
  }

  /** Called when a timer fires. */
  @Override
  public void onTimer(
      long timestamp,
      OnTimerContext ctx,
      Collector<Tuple2<String, Long>> out) {

    // Timeout interval exceeded. Cleaning up the state.
    startTime.clear();
  }
}
```

#### Stream-&Batch Data Processing - DataStream API(streams,windows)
The DataStream API provides primitives for many common stream processing operations, such as windowing, record-at-a-time transformations, and enriching events by querying an external data store. The DataStream API is available for Java and Scala and is based on functions, such as map(), reduce(), and aggregate(). Functions can be defined by extending interfaces or as Java or Scala lambda functions.
```
// a stream of website clicks
DataStream<Click> clicks = ...

DataStream<Tuple2<String, Long>> result = clicks
  // project clicks to userId and add a 1 for counting
  .map(
    // define function by implementing the MapFunction interface.
    new MapFunction<Click, Tuple2<String, Long>>() {
      @Override
      public Tuple2<String, Long> map(Click click) {
        return Tuple2.of(click.userId, 1L);
      }
    })
  // key by userId (field 0)
  .keyBy(0)
  // define session window with 30 minute gap
  .window(EventTimeSessionWindows.withGap(Time.minutes(30L)))
  // count clicks per session. Define function as lambda function.
  .reduce((a, b) -> Tuple2.of(a.f0, a.f1 + b.f1));
```

#### High-level Analytics API - SQL/TableAPI(dynamic tables)
Flink features two relational APIs, the Table API and SQL. Both APIs are unified APIs for batch and stream processing, i.e., queries are executed with the same semantics on unbounded, real-time streams or bounded, recorded streams and produce the same results. The Table API and SQL leverage Apache Calcite for parsing, validation, and query optimization. They can be seamlessly integrated with the DataStream and DataSet APIs and support user-defined scalar, aggregate, and table-valued functions.
```
SELECT userId, COUNT(*)
FROM clicks
GROUP BY SESSION(clicktime, INTERVAL '30' MINUTE), userId
```
### Advanced APIs
#### Stateful Functions: A Platform-Independent Stateful Serverless Stack
https://nightlies.apache.org/flink/flink-statefun-docs-stable/

#### Flink ML: Apache Flink Machine Learning Library
https://nightlies.apache.org/flink/flink-ml-docs-stable/
https://nightlies.apache.org/flink/flink-ml-docs-release-2.0/docs/try-flink-ml/quick-start/

### Libraries

#### Complex Event Processing (CEP): 
Pattern detection is a very common use case for event stream processing. Flink’s CEP library provides an API to specify patterns of events (think of regular expressions or state machines). The CEP library is integrated with Flink’s DataStream API, such that patterns are evaluated on DataStreams. Applications for the CEP library include network intrusion detection, business process monitoring, and fraud detection.

#### DataSet API: 
The DataSet API is Flink’s core API for batch processing applications. The primitives of the DataSet API include map, reduce, (outer) join, co-group, and iterate. All operations are backed by algorithms and data structures that operate on serialized data in memory and spill to disk if the data size exceed the memory budget. The data processing algorithms of Flink’s DataSet API are inspired by traditional database operators, such as hybrid hash-join or external merge-sort.

#### Gelly: 
Gelly is a library for scalable graph processing and analysis. Gelly is implemented on top of and integrated with the DataSet API. Hence, it benefits from its scalable and robust operators. Gelly features built-in algorithms, such as label propagation, triangle enumeration, and page rank, but provides also a Graph API that eases the implementation of custom graph algorithms.

## Operations

### Run Your Applications Non-Stop 24/7
Machine and process failures are ubiquitous in distributed systems. A distributed stream processors like Flink must recover from failures in order to be able to run streaming applications 24/7. Obviously, this does not only mean to restart an application after a failure but also to ensure that its internal state remains consistent, such that the application can continue processing as if the failure had never happened.

+ Consistent Checkpoints: 
Flink’s recovery mechanism is based on consistent checkpoints of an application’s state. In case of a failure, the application is restarted and its state is loaded from the latest checkpoint. In combination with resettable stream sources, this feature can guarantee exactly-once state consistency.
+ Efficient Checkpoints: 
Checkpointing the state of an application can be quite expensive if the application maintains terabytes of state. Flink’s can perform asynchronous and incremental checkpoints, in order to keep the impact of checkpoints on the application’s latency SLAs very small.
+ End-to-End Exactly-Once: 
Flink features transactional sinks for specific storage systems that guarantee that data is only written out exactly once, even in case of failures.
+ Integration with Cluster Managers: 
Flink is tightly integrated with cluster managers, such as Hadoop YARN, Mesos, or Kubernetes. When a process fails, a new process is automatically started to take over its work.
+ High-Availability Setup: 
Flink feature a high-availability mode that eliminates all single-points-of-failure. The HA-mode is based on Apache ZooKeeper, a battle-proven service for reliable distributed coordination.

### Update, Migrate, Suspend, and Resume Your Applications
Streaming applications that power business-critical services need to be maintained. Bugs need to be fixed and improvements or new features need to be implemented. However, updating a stateful streaming application is not trivial. Often one cannot simply stop the applications and restart a fixed or improved version because one cannot afford to lose the state of the application.

Flink’s Savepoints are a unique and powerful feature that solves the issue of updating stateful applications and many other related challenges. A savepoint is a consistent snapshot of an application’s state and therefore very similar to a checkpoint. However in contrast to checkpoints, savepoints need to be manually triggered and are not automatically removed when an application is stopped. A savepoint can be used to start a state-compatible application and initialize its state. Savepoints enable the following features:

+ Application Evolution: 
Savepoints can be used to evolve applications. A fixed or improved version of an application can be restarted from a savepoint that was taken from a previous version of the application. It is also possible to start the application from an earlier point in time (given such a savepoint exists) to repair incorrect results produced by the flawed version.
+ Cluster Migration: 
Using savepoints, applications can be migrated (or cloned) to different clusters.
+ Flink Version Updates: 
An application can be migrated to run on a new Flink version using a savepoint.
+ Application Scaling: 
Savepoints can be used to increase or decrease the parallelism of an application.
+ A/B Tests and What-If Scenarios: 
The performance or quality of two (or more) different versions of an application can be compared by starting all versions from the same savepoint.
+ Pause and Resume: 
An application can be paused by taking a savepoint and stopping it. At any later point in time, the application can be resumed from the savepoint.
+ Archiving: 
Savepoints can be archived to be able to reset the state of an application to an earlier point in time.

### Monitor and Control Your Applications
Just like any other service, continuously running streaming applications need to be supervised and integrated into the operations infrastructure, i.e., monitoring and logging services, of an organization. Monitoring helps to anticipate problems and react ahead of time. Logging enables root-cause analysis to investigate failures. Finally, easily accessible interfaces to control running applications are an important feature.

Flink integrates nicely with many common logging and monitoring services and provides a REST API to control applications and query information.

+ Web UI: Flink features a web UI to inspect, monitor, and debug running applications. It can also be used to submit executions for execution or cancel them.
+ Logging: Flink implements the popular slf4j logging interface and integrates with the logging frameworks log4j or logback.
+ Metrics: Flink features a sophisticated metrics system to collect and report system and user-defined metrics. Metrics can be exported to several reporters, including JMX, Ganglia, Graphite, Prometheus, StatsD, Datadog, and Slf4j.
+ REST API: Flink exposes a REST API to submit a new application, take a savepoint of a running application, or cancel an application. The REST API also exposes meta data and collected metrics of running or completed applications.




