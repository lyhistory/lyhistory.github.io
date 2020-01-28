---
sidebar: auto
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《分布式系统开发》

## 1.关于一致性

基本可以分为两大类：
>最终一致性 eventual consistent，代表协议如gossip/multicast protocols，redis集群就是采用gossip

>共识算法一致性 consensus protocols，代表协议有 PBFT, RAFT, 经典的比特币共识算法nakamoto consensus等

The former includes things like epidemic broadcast trees, bimodal multicast, SWIM, HyParView, and NeEM. These tend to be eventually consistent and/or stochastic. 
The latter, which I’ve described in more detail here, includes 2PC/3PC, Paxos, Raft, Zab, and chain replication. These tend to favor strong consistency over availability.
https://bravenewgeek.com/tag/leader-election/

## 2.从中心化到去中心化

中心化系统有单点故障的风险，所以引入多个节点，但是多个节点之间如何保持数据同步，基于一致性算法有两种思路：
>1.最直接的办法是动态选出一个leader，只由leader单节点负责管理竞争资源，然后其他节点作为follower保存副本，当leader发生故障，重新从follower中选举新的leader，从而既避免了单点故障又保持了数据一致

>2.节点之间通过共识算法保持数据同步，这是个经典的拜占庭将军问题，经典的共识算法是BFT拜占庭共识算法

### 1.1.分布式产品和zookeeper

>分布式产品

>分布式服务框架 zookeeper的ZAP协议

>分布式消息队列集群Kafka

>分布式实时计算storm以及Hadoop mapreduce2.0

>分布式存储系统：hbase基于zookeeper, 而ETCD采用RAFT协议 https://raft.github.io/

>分布式任务调度：Elastic-Job等

可以看几个产品的架构图

![Kafka](/docs/docs_image/software/distrubuted_system1.png)
![HDFS](/docs/docs_image/software/distrubuted_system2.png)
![HADOOP](/docs/docs_image/software/distrubuted_system3.png)

Since Hadoop 2.0, ZooKeeper has become an essential service for Hadoop clusters, providing a mechanism for enabling high-availability of former single points of failure, specifically the HDFS NameNode and YARN ResourceManager.
https://www.datadoghq.com/blog/hadoop-architecture-overview/

观察可以发现一个问题，为啥大部分都需要依赖分布式框架zookeeper？？

简单来说，不要重复造轮子，zookeeper可以用于集群管理，只不过有些可以脱离zookeeper单机部署，有些则是只支持集群模式，跟zookeeper耦合紧密，
Quartz就是支持单机版也支持集群，但是其集群基于数据库锁，严重耦合，所以有人也将其改造成为基于zookeeper集群管理的模式，当然我们谈的是分布式系统，所以这里不讨论单机版本

举一个例子：

![分布式管理例子](/docs/docs_image/software/distrubuted_system4.png)
中央就是zookeeper，本身是集群，政治协商，一个挂掉还会迅速选一个，中央的主要工作是做集群管理，具体的生产生活还要交由Apache/Storm这些地方政府节点来做，
地方节点之间也是一个集群，比如分布式商务系统集群（商务部是集群的leader，向中央注册），分布式农业系统集群等

Zookeeper适用的场景：
https://www.ibm.com/developerworks/cn/opensource/os-cn-zookeeper/index.html

>统一命名服务（Name Service）

>配置管理（Configuration Management）

>集群管理（Group Membership）

>共享锁（Locks）：共享锁在同一个进程中很容易实现，但是在跨进程或者在不同 Server 之间就不好实现了

### 1.2.Build distributed system from scratch

假设我们需要创建一个分布式任务调度，当然是从零开始，不采用市面上的分布式任务调度产品，假设这些任务存在数据库

首先我们肯定需要一些干活的workers，负责执行具体任务，想象一下我们创建了一个java程序执行具体的任务逻辑；

由于正常情况下一般除非是定制了class loader否则一个java程序是跑在一个单独的jvm实例当中，
所以分布式部署的情况下，每个worker都在一个独立的jvm实例中，部署在多台机器上，多个互相独立的jvm实例之间需要协商分配这些任务，
同时去读写数据库的任务列表很容易造成冲突，显然如果我们不采用共识算法，处理起来会毫无头绪，
最直接简单的想法就是从中找一个特别的worker作为leader来做这个分配，这里就引入了zookeeper，
你可能会说不引入zookeeper，自己写一个单独的leader程序不行吗，确实可以，不过leader程序也要做成集群式的，不可以引入单点故障，
所以为了简单，直接让这些workers都注册zookeeper，不同的java程序微服务之间通过zookeeper的observer监听模式实现同步节点信息，
这样每个worker都可以保存一份同步的worker list，怎么从worker list中选出一个leader呢，两个思路：

>可以简单设计一些规则来实现选举，比如通过配置文件定义好是否是leader候选人，然后选的时候就通过排序找到第一个活着的候选人即可；

>基于zookeeper 的临时节点实现选举，zookeeper除了手动才能删除的持久节点，还有一种ephemeral临时节点，如果临时节点的创建者客户，失去zookeeper连接，临时节点就会自动删除，
然后zookeeper的架构是基于观察者模式，加上共享锁，所有注册的客户端都抢注比如/leader节点，不管是谁抢注成功其他客户端都会收到通知；

>前一种方式比较低级，其实可以通过curator高级API封装好的leader election recipes，curator利用zookeeper的共享锁机制加观察模式封装了两种leader选举，leader latch和leader election，
默认都是普通worker，在抢到leadership的时候激活为leader，不过这种方式有个缺点，其他普通的worker无法得知选举结果，所以在某些场景下，当worker需要向leader汇报情况的时候就做不了了，
需要额外再做点处理，比如leader election的方式可以在take leadership的时候，通过rpc通知其他节点自己是leader，或者也可以将自己的id注册在zookeeper的一个特定的path上，比如/leader/result，
这样其他节点就可以通过监听获取到leader选举结果；

现在还没有结束，现在有了动态选举的leader和一群worker，leader要怎么分发任务给worker，他们是互不想干的独立进程，可能部署在不同的机器上，通过zookeeper吗？
zookeeper只支持最简单的推拉消息，每次节点注册时，只会通知各节点有nodechange事件，各节点自行去zookeeper pull拉取具体变化信息，
所以我们无法通过zookeeper实现worker及leader节点之间的要求，这里就引入了rpc通信协议，相比较基于HTTP的web service，基于TCP的rpc性能更优，然后结合proxy代理模式对调用方法接口进行封装，
可以让微服务在调用远程方法的时候就像调用自身方法一样透明。
然后因为所有worker及leader节点都保存了一份节点列表，所以leader分发任务的时候就可以采取一定的策略，比如round robin或load balance方式rpc调用worker分发任务；
至于worker节点，虽然也保存了一份节点列表但一般只需要跟leader通信，当然如果leader挂掉，worker变成leader还是要用这个列表的；

![分布式任务调度](/docs/docs_image/software/distrubuted_system5.png)

还需要思考的问题：

>上面不管是直接通过使用zookeeper的临时节点还是使用curator recipes进行选举，都无法避免一种场景的出现，比如选举出的leader无法连接数据库获取任务，
针对这种异常场景，需要额外增加监控逻辑，比如心跳检测leader跟数据库的连接，一旦出现问题就断开跟zookeeper的连接，下线故障leader，去主动触发重新选举；

>如何保证leader选举的唯一性，
前面这个问题的一个类似场景是，leader断开了跟zookeeper的连接，但是还保持跟数据库及其他节点的连接，由于他已经断开了zookeeper的连接，无法通过观察者模式获取新leader的选举，
他还认为自己是leader，这个场景比较容易解决，可以在通过监控跟zookeeper的心跳连接情况，一旦断开就直接剥夺leader的头衔并下线机器，
但是在剥夺之前的时间窗口内还是存在多个leader问题，从而会产生下游任务重复触发并发执行的问题；

>在上面这个问题无法解决的情况下，应该还要从下游去控制，比如从具体任务执行层面，精度不要放太高，比如放秒级或者分钟级，这样可以通过检查该秒或分钟内是否该任务已经触发来挡住重复的触发命令

>如何在leader宕机的瞬间保持数据不丢失，新leader如何恢复旧leader宕机之前的状态

>前面只是简单说leader会做任务分发，但是没有说谁会来判断任务触发是否满足条件，比如一种方式是leader来判断所有事件依赖以及是否满足触发条件，然后如果满足才会分发下去，
另一种方式是，leader将任务直接简单的根据比如round robin策略分发出去，由具体的worker来判断依赖关系及等待其达到触发条件后再执行；
后一种方式的问题是，如果某个任务的依赖任务分发给了另外一个worker，这些worker需要频繁的请求leader中心节点同步任务状态，
所以第二种做法更简单的处理是分发任务时将一组有依赖关系的任务都分发给同一个worker，这样就避免了多节点之间的任务依赖，前面引用的一个用quartz基于zookeeper的实现架构就是第二种做法；

## 3.From distributed system to distributed ledger


![网络类型](/docs/docs_image/software/distrubuted_system6.png)

我们前面谈到的分布式系统都不是不是真正的分布式，只能算是多中心的系统，zookeeper也不是真正的分布式框架，因为其本身集群也是有leader和follower的，
所以基于zookeeper的分布式系统更会不是真的分布式，只有是基于共识算法实现的系统才有可能是真正的分布式系统；

谈到去中心化，分布式，最广为人知的就是区块链，区块链技术，又被称作DLT，Distributed Ledger Technology，区块链大致分为permissioned 和 non-permissioned blockchain，前者基本都是私有链和联盟链，后者是公链，
目前来看，只有公链才算是真正意义的分布式系统，因为所有节点基本上都是公平的，可以随时加入退出，不影响公链的运行，大家遵循同一个规则来运行节点，维护网络，
运行节点的目的以及维护网络的方式具体就是挖矿（打包区块），发布交易，验证交易等；

关于共识算法，参考我在巴比特上面的文章：
[区块链基础：解密挖矿与共识的误解](https://www.8btc.com/media/393154)

ref:
基于quartz和zookeeper的分布式调度设计 https://juejin.im/post/5c55ac0bf265da2da771a216




