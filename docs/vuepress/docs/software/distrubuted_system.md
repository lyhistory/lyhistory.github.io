---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《分布式系统开发》

_注意:_

_下面提到的节点根据上下文有不同的含义，说到zookeeper时主要是指注册在zookeeper的不同类型的node，说到集群时是指集群的不同实例_

谈到分布式系统就避免不了CAP理论，可用性、一致性、分区容错只能三者只能同时选其中两个，可用性和一致性是我们经常提到的，分区容错可能很多人不太清楚，
其定义是“The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes”，
可见对于分布式系统来说，分区容错并不是一个可选性，如果系统在发送节点之间通信延迟或丢包的情况下就停止工作，就失去了分布式的意义，
所以当因为网络问题或自身故障引起通信延迟或丢包时，只能在一致性和可用性之间选一个，想要保持一致，那么当前就不可以立即对外提供服务，想要保持对外随时可用，现在由于分区就达不成一致的要求；

对于单机系统来说就不存在上述多多节点通信的问题，比如关系型数据库就是取了CA，高可用和强一致性，并且由事务支持延伸出ACID；

而在分布式系统实践中，CAP并不是真的非黑即白的不可同时共存，基于大量实践衍生出了BASE理论，基本可用 Basically Available，软状态 Soft State，最终一致性Eventual Consistency，
可见基本上是在追求一种平衡，对于一个系统来说，尤其是分布式系统，如果都无法保持一致，基本也是不堪用的了，所以一致性还是基本上都要追求的，只不过一致性根据强弱程度可以进一步细分；

思维比较缜密的读者对于eventual consistency可能会有问题，这个最终一致性是在什么时间范围内in bounded time达到一致，换句话说对于外部的client客户端来说，要到什么程度的eventual consistency才能对外提供服务？
这里不得不提另一个理论FLP，即分布式共识的不可能理论，跟CAP类似，但是从另外一个角度解读，包含三点safety, liveness, fault tolerance，刚才的问题就是关于liveness，
用来指示分布式系统内的各个节点必须在合理的时间内达成一致，不能一致处于不一致的状态，否则不能够对外提供服务；

---

## 1.关于一致性

一致性的语义在不同的地方解释千差万别，从不同的角度看也有不同的含义，在谈到单机系统和分布式系统的时候，我简单的说下这个词的不同侧重点：

首先对于一个单机系统，一致性一般是强调在并发请求的情况下，该系统事务级别和会话级别下根据系统的设置表现出来的读写的一致和冲突，比如两个并发事务的读写冲突，
比如前面说的关系型数据库，不考虑主从数据库部署的情况下，单机部署，读写同一个数据库，根据ACID理论，一致性的表现是会根据数据库的隔离水平设置isolation level有所不同，有兴趣可以自己查阅<Isolation (database systems)>

对于分布式系统，一致性一般是指对于一个集群内部各个节点上面的相关数据保持同步；

本质上其实都是大同小异，只是说一个是宏观从集群角度看，一个是从微观的单机看，分布式系统当成一个整体看对外部系统来说就是一个大的“单机”系统；

分布式系统一致性的分类根据角度的不同有很多分类方式，比如简单根据强弱分为：
- 强一致性 strong consistency
- 最终一致性 eventual consistency
- 弱一致性 weak consistency

还有其他角度更细分的单调读一致性，单调写一致性，会话一致性，读后写一致性，写后读一致性等，
我还看到有人根据协议做如下划分：
- 留言/多播协议 gossip/multicast protocols，redis集群就是采用gossip
- 共识协议 consensus protocols

为了澄清更多的概念，我引用这个分类方式文中的一段话
>The former includes things like epidemic broadcast trees, bimodal multicast, SWIM, HyParView, and NeEM. These tend to be eventually consistent and/or stochastic. 
>The latter, which I’ve described in more detail here, includes 2PC/3PC, Paxos, Raft, Zab, and chain replication. These tend to favor strong consistency over availability.

作者也很谨慎的用了tend to，需要说明的是，前者基本上是最终一致没有什么问题，
而后者就要分清上下文了，在传统的分布式系统上这个说法问题不大，因为传统的分布式共识算法是基于故障容错crash fault tolerance，前提是假设系统中只会存在故障节点（消息会丢失，重复），
而在区块链的世界中，共识算法是基于拜占庭容错Byzantine fault tolerance，前提是假设系统中存在恶意节点（会发送假消息），基本都是最终一致，而不是强一致，为了区分，故障容错又称作非拜占庭容错，下面会详细展开；

另外需要再指出一点，经过前面数据库的例子所以可以看到一个系统的一致性不是固定死的，很多情况下一致性会根据系统的设置或系统的架构不同发生变化，在同一个系统中不同类型的数据也可能有着不同类型的一致性；
单机系统都如此，分布式系统更是复杂，而对于区块链来说，一致性更加有着丰富的表现，比如比特币的6个确认，是中本聪基于泊松分布做的一种类似联合泊松分布的概率计算https://bitcoin.org/bitcoin.pdf，
以全网千分之一的算力来做恶意节点得出6个确认之后可以忽略不计，当然随着单节点算力越高，需要的确认也随之增长。
![bitcoin 6 confirmation](/docs/docs_image/software/distrubuted_system00.png)

## 2.基于故障容错Crash fault tolerance(或非拜占庭容错)的分布式系统

中心化系统有单点故障的风险，故障有两层含义，一个是自己发送故障，一个是遭受到攻击，所以引入多个节点来抵消单一节点的风险，故障容错的假设是多节点中可能会存在故障节点，消息会丢失或重复，但是不会有发送假消息的恶意节点；

在这种假设前提下，多个节点就需要协同工作，有两种思路：主备或一致性状态机

### 2.1 主备方案和一致性状态机

#### 2.1.1 主备方案

最直接的办法是指定一个leader，只由leader单节点负责管理竞争资源，然后其他节点作为follower保存副本
- 一致性，客户端写入数据请求都是交由或转发给leader，所以单节点维护保持了数据写的一致，所有节点都会接受客户端的读请求；
- 排除单点故障，当某个follower发生故障，leader就将follower从自己的通讯录中剔除或拉黑，如果该follower再次重新恢复上线，leader会将其再加回通讯录；

现在出现两个问题：

* 1） follower转发写数据请求给leader，如果他们转发的请求互相有冲突呢，比如对同一个数据同时修改

* 2） 如何动态选出的leader并且当leader节点发送故障如何从follower中选出leader呢

这两个问题都要依赖共识算法解决，比如zookeeper的ZAP协议就是解决这个问题的：

第一个问题解决方法是2PC即两阶段提交协议: 

leader直接收到或收到follower转发的写操作请求，都会按照FIFO顺序发送proposal给所有follower，如果收到半数以上的follower的ack响应，leader就会发送commit指令给所有follower（注意leader也是自己的follower）；

第二个问题解决方法是：

每个节点启动后默认都是looking模式，当有leader选出后，就立即变成follower模式，如果leader崩溃了，则跟follower的心跳连接失败，follower又会变回looking模式，然后崩溃恢复原则是采用
“Use a best-effort leader election algorithm that will elect a leader with the latest history from a quorum of servers.”
即选出同步了最新提交历史的节点，这样可以尽量保证崩溃的leader在崩溃之前广播出去的数据没有丢失，当然如果是没有广播出去的数据肯定是会丢了；
每次选举出新的leader都会有自己的标志，有的叫term有的叫epoch，总之是为了防止挂掉的leader突然恢复，通过这个标志可以知道自己已经过时了，然后转换成follower听从新的leader；

#### 2.1.2 一致性状态机

一致性状态机也是依赖于共识算法实现的，一致性状态机原则上不需要选举leader节点来维护写的一致，不过很多实际产品还是引入了leader来降低一些问题的实现难度，
但是跟前面的主备共识算法的侧重略有不同的是，前面是构建高可用的分布式主备系统，现在是为了构建分布式一致性状态机；

我们首先要从经典问题“paxos岛兼职议会问题”说起，这个故障问题描述为：
希腊岛屿Paxon上通过议会的方式来表决通过法律，议员们通过服务员传递纸条的方式交流信息，每个议员都将通过的法律记录在自己的本子上。
问题在于议员和服务员都是兼职的，他们随时会因为各种事情离开议会大厅，传递的消息也可能会重复，并随时可能有新的议员进入议会大厅进行法律表决，使用何种方式能够使得这个表决过程正常进行，且通过的法律不发生矛盾。
注意我们假设议员和服务员都是道德高尚的人，不会有恶意假消息

而解决这个问题的paxos共识算法就是经典的故障容错算法，很多其他的基于故障容错的共识算法都是基于paxos改进发展产生的，paxos本身也有很多变种，
甚至有这种说法：“there is only one consensus protocol, and that’s Paxos — all other approaches are just broken versions of Paxos” .
我们来简单讲一下Basic Paxos这个算法的基本原理：
引用斯坦福的教学内容Basic Paxos的基本流程图：
![paxos](/docs/docs_image/software/distrubuted_system01.png)
   
前面2PC及两阶段提交协议，实际paxos也是基于2PC，这里引入了提议者proposer和接受者acceptor的概念，
为了简化描述：
假设我们有5个节点Node1|Node2|Node3|Node4|Node5 ，其中Node1和Node2是proposer角色，然后Node3|Node4|Node5都是acceptor角色，
实际上一个节点可以是多种角色，而且注意到上面引用的图中是说broadcast to all servers，实际上对于一个2F+1的节点配置来说，只需要得到F+1个节点响应即可，我们例子中忽略这些细节，集中分析主要的逻辑，
然后算法主要分两步或两阶段，提议propose和决议commit，第一阶段主要是为了将已经落实的最新决议状态（数据）同步给其他节点（所有proposer），第二阶段主要是挡住旧的决议（并落实新决议）

```

举例，机票预订系统，基本场景：

Node1收到客户端请求Alice要买一张广州到新加坡的scoot100，座位号选择A1,

Node1用提议者proposer的角色发起一个写数据的提议proposal:Prepare(【Node1-P-1】)，其中P是Proposal，1是编号
（Node1是因为每个节点都维护自己的编号，如果Node1同步到其他节点Node2的最新编号是100的话，就会重置自己维护的编码并加1变成101）

现在Node3|Node4|Node5这三个acceptor都收到了提议proposal，假设当前三个acceptor上面的minProposal=0，acceptedProposal=null，acceptedValue=null，因为minProposal<1此时三个节点都会更新为
minProposal=1，acceptedProposal=null，acceptedValue=null，并返回【P-OK,acceptedProposal=null，acceptedValue=null】,P-OK代表同意这个Proposal

Node1收到了全部是P-OK，而且收到的acceptedProposal=null，acceptedValue=null跟自己的数据没有冲突，所以开始提出决议commit:Accept(【Node1-C-1，"Alice航班scoot100，座位号A1"】)

现在Node3|Node4|Node5这三个acceptor都收到了决议commit，而且1>=minProposal=1，所以三个节点都会更新
acceptedProposal=minProposal=1，acceptedValue=“Alice航班scoot100，座位号A1”，并且都返回【C-OK,minProposal=1】;

Node1收到了result=1 判断result>n 1>1是false，所以没有问题，注意假设任何一个返回的是result>1就证明该Acceptor已经接受了另外一个proposer的更新的一个决议，所以Node1要立即放弃决议，重新回到第一步

接着上面的场景延伸以下两个场景：

场景1：

假设接着Node2收到客户端请求Bob要买一张广州到新加坡的scoot100，座位号也是选择A1,
假设Node2上面的计数器没有同步最新的，所以发起一个写数据的提议proposal:Prepare(【Node2-P-1】)

Node3|Node4|Node5这三个acceptor都收到了提议proposal，因为需要n>minProposal=1但是1>1是false，所以会返回【P-FAIL,acceptedProposal=1，acceptedValue="Alice航班scoot100，座位号A1"】

Node2收到了全部的P-FAIL，而且acceptedProposal=1，acceptedValue="Alice航班scoot100，座位号A1"，所以跟自己的数据"Bob航班scoot100，座位号A1"有冲突，同步最新决议，
注意，在simple paxos算法中，不管P-FAIL还算P-OK，只要任何一个返回中的acceptedValue有值都要立即同步，因为是代表通过的最新的决议，
所以Node2会同步更新本地的value="Alice航班scoot100，座位号A1"，并且继续广播决议commit：Accept【Node2-C-1,"Alice航班scoot100，座位号A1"】
看到这里可以感觉是无用功，实际上PAXOS算法却是复杂，而且有很多变种，我们只是讲解基本的逻辑，
实际中可以做各种优化，不过这一步可能还真有用，比如可以同步之前掉线的Acceptor节点，要看具体实现中的考虑；

Node3|Node4|Node5这三个acceptor都收到了决议，更新并返回【C-OK,minProposal=1】;

Node2收到了result=1 判断result>n 1>1是false，所以没有问题

场景2：

其他跟场景1一样，只是改成Node2已经同步到了最新的ID=1，所以自增ID 1+1=2 发起一个写数据的提议proposal:Prepare(【Node2-P-2】)

Node3|Node4|Node5这三个acceptor都收到了提议proposal，2>1,所以更新minProposal=2，然后返回【P-OK,acceptedProposal=1，acceptedValue="Alice航班scoot100，座位号A1"】

Node2收到了全部的P-OK，而且收到的acceptedProposal=1，acceptedValue="Alice航班scoot100，座位号A1"，所以跟自己的数据"Bob航班scoot100，座位号A1"有冲突，
跟场景1中一样“simple paxos算法中，不管P-FAIL还算P-OK，只要任何一个返回中的acceptedValue有值都要立即同步，因为是代表通过的最新的决议”,
更新自己的value="Alice航班scoot100，座位号A1"，并且继续广播决议commit：Accept【Node2-C-2,"Alice航班scoot100，座位号A1"】
后面跟场景1的后面也是一样的结果

场景3：

接着场景1，因为bob因为座位被抢所以订票失败，他又选了个新位置A2，
这次又是Node2收到了客户端请求，所以自增ID 2+1=3 并发起一个写数据的提议proposal:Prepare(【Node2-P-3】)

Node3|Node4|Node5这三个acceptor都收到了提议proposal，会返回【P-OK,acceptedProposal=2，acceptedValue="Alice航班scoot100，座位号A1"】

Node2收到了全部的P-OK，而且acceptedProposal=2，acceptedValue="Alice航班scoot100，座位号A1"，再次强调“simple paxos算法中，不管P-FAIL还算P-OK，只要任何一个返回中的acceptedValue有值都要立即同步，因为是代表通过的最新的决议”,
而此时本地的数据状态为：｛"Alice航班scoot100，座位号A1"，"Bob航班scoot100，座位号A2"｝，所以无冲突，同步的结果是没有变化，
Node2继续广播决议commit：Accept【Node2-C-3,"Bob航班scoot100，座位号A2"】

现在Node3|Node4|Node5这三个acceptor都收到了决议commit，而且3>=minProposal=2，所以三个节点都会更新
acceptedProposal=minProposal=3，acceptedValue="Bob航班scoot100，座位号A2"，此时本地数据完整状态为：｛"Alice航班scoot100，座位号A1"，"Bob航班scoot100，座位号A2"｝
并且都返回【C-OK,minProposal=3】;

```
这些场景都是假设节点正常运作，paxos算法的意义就是可以在某些节点崩溃及通信延迟的情况下仍然可以达到最终一致的效果，所以你可以自行想一下如果proposer节点或者acceptor节点掉线会不会影响系统稳定，
这里需要多提一个概念叫做活锁livelock
```
Node1发起一个写数据的提议proposal:Prepare(【Node1-P-1】),假设Node1已经完成了Prepre，意思是Node3|4|5都返回了，现在开始提交决议【Node1-C-1,Value】
此时Node2发起一个写数据的提议proposal:Prepare(【Node2-P-2】)，根据前面的分析，Node3|4|5收到后会更新minimalProposal=2,从而会拒绝Node1的决议【Node1-C-1,Value】，
再根据前面的分析，Node1会从头开始重新提议【Node1-P-3】，
然后刚刚Node2完成了提议，开始提交决议【Node2-C-2,Value】，但是Node3|4|5已经收到了Node1的新提议【Node1-P-3】，所以minimalProposal=3，所以会拒绝Node2的决议【Node2-C-2,Value】，
所以Node2也只好放弃重头开始重新提议【Node2-P-4】...如此循环，谁也无法成功实现决议
```
解决上面的活锁问题有两种方法，一个是在每次重头开始提新提议的时候加一个随机的delay延迟，这样会可以给机会让其中一个proposer成功完成提议和决议；
另一种比较更多采用的做法就是从proposer中选一个leader出来，由leader统一提议决议，避免冲突。

说到这里，还有一个问题，上面说了对于2F+1个节点，只需要F+1个节点达成一致就可以move forward，即对外部提供服务了，所以paxos为了前面提到的FLP理论的liveness要求，引入了一个learner的概念，
>Learners act as the replication factor for the protocol. Once a Client request has been agreed upon by the Acceptors, the Learner may take action (i.e.: execute the request and send a response to the client). To improve availability of processing, additional Learners can be added.
>Model application as a deterministic state machine
acceptor接受数据后会通知给每一个learner节点，learner在判断已经有F+1个节点达成共识后就可以返回给客户端以及同步给其他Acceptor节点，
当然paxos算法本身并不保证liveness，只是引入learner可以改善提升liveness。

PAXOS很经典但是也是比较臭名昭著的复杂，RAFT是其实现的简化版本，实际上前面“主备方案”中提到的zookeeper的ZAP也都是跟RAFT类似的思想，RAFT主要包含选举leader election和日志拷贝log replication：
比如leader election也是利用心跳和过半数选举的机制，并且leader也是有第几代leader的term标志，ZAP用的是epoch，paxos使用Ballot Number；
然后log replication跟simple paxos的2PC类似但又不同，首先所有客户端的写请求都会转发给leader来处理，然后leader写入日志，状态是uncommitted，通过心跳发给所有followers，
follower收到后也写入自己的日志，状态是uncommitted，等得到过半数的followers的ack响应后将状态改为committed，然后再通知所有follower，follower收到后也更新数据更改状态为committed，

下面拿RAFT协议来覆盖一下前面没提到的分区容错partition tolerance，以网络分区的例子来说明下为什么前面提到的分布式算法思想可以实现分布式一致性状态机，

![raft](/docs/docs_image/software/distrubuted_system02.png)

可以看到网络分为两个分区，两个leader，他们的时代是不同的一个是term=1一个是term=2，互相不知道彼此，但是由于term=1在更改数据的时候无法得到超过半数的响应，
所以所有数据更改都会处于uncommit未提交状态；而反之在另一边term=2这里，是可以达成共识的；
最后一旦网络恢复正常，term=1的分区就会发现自己全部过时了，就会放弃自己的uncommit日志，同步term=2的提交日志；


### 2.2 分布式产品和zookeeper

前面讲了很多理论，现在我们落实到市面上的各种分布式产品，看看具体大家都是如何实现的，然后再讲下如何动手自己写一个简单的分布式系统

- 分布式服务框架 zookeeper的ZAP协议

- 分布式消息队列集群Kafka

- 分布式计算 spark, storm以及Hadoop mapreduce2.0

- 分布式存储系统：hbase基于zookeeper, 而ETCD采用RAFT协议

- 分布式任务调度：Elastic-Job等

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

### 2.3 动手写一个简单的分布式系统

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

>前一种方式比较低级，其实可以通过curator高级API封装好的leader election recipes，curator利用zookeeper的EPHEMERAL_SEQUENTIAL实现分布式锁加观察模式封装了两种leader选举，leader latch和leader election，
默认都是普通worker，在抢到leadership的时候激活为leader，不过这种方式有个缺点，其他普通的worker无法得知选举结果，所以在某些场景下，当worker需要向leader汇报情况的时候就做不了了，
需要额外再做点处理，比如leader election的方式可以在take leadership的时候，通过rpc通知其他节点自己是leader，或者也可以将自己的id注册在zookeeper的一个特定的path上，比如/leader/result，
这样其他节点就可以通过监听获取到leader选举结果；分布式计算引擎Spark采用了curator的leader latch方式选举leader;

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

>上面是假设数据都是放到数据库的，而且只允许leader单节点去维护，设想一下数据分布在每个节点上，比如每个节点都有完整的数据备份，同步起来就只能采取共识算法来做比较合理；

## 3.基于拜占庭容错Byzantine fault tolerance的分布式账本技术

![网络类型](/docs/docs_image/software/distrubuted_system6.png)

我们前面谈到的不管是zookeeper的ZAP，paxos还是raft都不能算是真正的分布式，因为基本都是要选举出leader来主持大局，真正的分布式节点是完全平等的，不存在谁是leader，
所以基本都只能算是多中心的分布式系统；
而且我们看到实际的分布式产品大多是基于zookeeper，zookeeper本身也不是真正的分布式框架，因为其本身集群也是有leader和follower的，所以基于zookeeper的分布式系统更会不是真的分布式；

其实这里还隐含着另外一个问题，我们前面的分布式产品都是部署在内网中，不管是私有云公有云还是自己的机房，都不会给外界暴露端口，一般更不会允许外面的节点随便连进来，属于关在笼子里面的内部系统，
根源在于上面提到的算法都是基于故障容错的，都是假设节点不会有恶意节点，因为都是自己公司内部部署的，自己肯定不会搞自己，这也是为什么无法任意对接外部节点的重要原因；

所以区块链技术，尤其是比特币作为区块链的第一应用，到目前为止平稳运行了十多年，是真正意义上的去中心化分布式技术，不管是手机，普通电脑，还是矿机，都可以运行一个比特币节点，随时加入退出，
甚至你是恶意篡改了比特币源码的节点都没关系，不会影响比特币的正常运行，那么他的共识算法跟前面有什么区别呢？下面我开始给大家介绍下区块链技术的入门知识：

区块链技术又被称作DLT，Distributed Ledger Technology，
单纯从技术上来说区块链大致分为permissioned 和 non-permissioned blockchain，前者基本都是私有链和联盟链，后者是公链；
如果从去中心化角度来说只有公链技术才算区块链，当然这个涉及到关于中心化的辩论，属于哲学问题，不予讨论；

### 3.1 联盟链技术

私有链基本上没有任何意义，自己内部玩没有搞条链，唯一用武之处就是用来教学演示，对于正常的普通企业用传统的办法更高效，如果真的要搞行业级别的集成自然是选择联盟链，
我就以IBM的hyperledger为代表来讲解下联盟链：

直接看核心流程图，我只是简略说主要内容，不会讲解他的会员系统（节点的加入都是要经过审核后配置到系统中），也不会细分peer节点的类型
![网络类型](/docs/docs_image/software/distrubuted_system7.png)
客户端发一个transaction请求，实现了hyperledger sdk的客户端程序接收，会验证后发给peers节点，peers节点验证并进行endorse签名并返回结果给客户端，客户端收到一定数量的endorse之后，
如果满足了事前设定的policy，比如至少收到半数的endorse，则发起提交请求，将transaction及endorsement一起发给ordering service，像极了前面提到的2PC，
ordering service排序打包交易再发给peers，peers会验证打包好的每个交易，然后更新账本；
不过等等，这里的ordering service是一个单独的节点，不像peers那样有多个节点，意思是个中心化的排序服务，然后我们看IBM文档的说法如下：

![网络类型](/docs/docs_image/software/distrubuted_system8.png)

看到没，关键的ordering service可以是一个单节点或者kafka集群，单节点不用说了，kafka集群是基于故障容错的分布式产品；
不过共识这块hyperledger是可以插拔自定义的，实际上V1.4版本引入了RAFT算法，也是基于故障容错的，当然了随着进一步发展默认引入基于拜占庭容错算法是迟早的事情；

### 3.2 公链技术

谈到公链，代表就是区块链第一应用比特币及支持智能合约的超级计算机以太坊，当然还有EOS，BTS等等其他公链，他们的共识算法都是基于解决拜占庭将军问题的容错算法，
注意这里并非特指拜占庭容错算法BFT或PBFT，而是泛指，区块链的共识算法也经常被称作trustless consensus，意思是无信任共识，换句话说跟前面那些故障容错算法的假设不同，对于无信任共识，节点之间是不可以相互信任的，
会有好节点和坏节点，坏节点会恶意发送假信息，我们开始具体谈谈这些基础知识

#### 3.2.1 拜占庭将军问题和实用拜占庭容错算法PBFT

Byzantine originated from Lamport’s paper. It is no exaggeration to say that Byzantine fault tolerance (BFT) is the most complex and rigorous tolerance model. 
By analogy, some number of generals plan an attack on a castle together and each general can choose to start the attack or retreat. 
However, to successfully take the castle, all the generals must act synchronously. Next, given that the generals are too far from each other to use direct communication, 
messengers are used to carry messages. However, messages are not reliable. They may successfully delivery messages after a very long time, 
fail to deliver messages or even change with messages. 
The generals may not be reliable, either, for example, one of them may be a traitor who does not act in accordance with the plan. 
The messengers in this story represent communication channels in distributed networks and the generals represent nodes.

![PBFT](/docs/docs_image/software/distrubuted_system9.png)

主节点 p = v mod |R|。v：视图编号，|R|节点个数，p：主节点编号
现在R=4,v=0,p=0

1.client c客户端发送请求<REQUEST, o, t, c>给主节点0；
REQUEST: 包含消息内容m，以及消息摘要d(m)。客户端对请求进行签名。o: 请求的具体操作，t: 请求时客户端追加的时间戳，c：客户端标识。

2.主节点0 pre-prepare
主节点行以下交验消息签名并丢弃非法请求，
然后分配一个编号n，编号n主要用于对客户端的请求进行排序。然后多播<<PRE-PREPARE, v=0, n, d>,  m>消息给其他副本节点。
d客户端消息摘要，m消息内容。<PRE-PREPARE, v, n, d>进行主节点签名。n是要在某一个范围区间内的[h, H]，原因是垃圾回收。

3. 备份节点PREPARE：

副本节点1、2、3收到主节点的PRE-PREPARE消息，校验并丢弃非法请求：

a. 主节点PRE-PREPARE消息签名。

b. 当前副本节点是否已经收到了一条在同一v=0下并且编号也是n，但是签名不同的PRE-PREPARE信息。

c. d与m的摘要是否一致。

d. n是否在区间[h, H]内。

然后副本节点向其他节点包括主节点发送一条<PREPARE, v=0, n, d, i>消息, 
v, n, d, m与上述PRE-PREPARE消息内容相同，i是当前副本节点编号。
每个副本节点i对<PREPARE, v, n, d, i>进行签名。记录PRE-PREPARE和PREPARE消息到log中，用于View Change过程中恢复未完成的请求操作。

4. COMMIT：

主节点和副本节点收到PREPARE消息，需要进行以下交验：

a. 副本节点PREPARE消息签名是否正确。

b. 当前副本节点是否已经收到了同一视图v下的n。

c. n是否在区间[h, H]内。

d. d是否和当前已收到PRE-PPREPARE中的d相同

非法请求丢弃。如果副本节点i收到了2f+1个验证通过的PREPARE消息，则向其他节点包括主节点发送一条<COMMIT, v, n, d, i>消息，v, n, d,  i与上述PREPARE消息内容相同。<COMMIT, v, n, d, i>进行副本节点i的签名。记录COMMIT消息到日志中，用于View Change过程中恢复未完成的请求操作。记录其他副本节点发送的PREPARE消息到log中。

5. REPLY：

主节点和副本节点收到COMMIT消息，需要进行以下交验：

a. 副本节点COMMIT消息签名是否正确。

b. 当前副本节点是否已经收到了同一视图v下的n。

c. d与m的摘要是否一致。

d. n是否在区间[h, H]内。

非法请求丢弃。如果副本节点i收到了2f+1个验证通过的COMMIT消息，说明当前网络中的大部分节点已经达成共识，运行客户端的请求操作o，并返回<REPLY, v, t, c, i, r>给客户端，r：是请求操作结果，客户端如果收到f+1个相同的REPLY消息，说明客户端发起的请求已经达成全网共识，否则客户端需要判断是否重新发送请求给主节点。记录其他副本节点发送的COMMIT消息到log中。

6.客户端client c等待f+1个reply，如果结果都相同，则完成


拜占庭容错算法看起来感觉跟paxos有几分相似，确实，实际上paxos可以升级成BFT paxos，也有raft版本的BFT raft

拜占庭容错算法的限制是保证网络上不超过1/3的节点作恶，
1/3的来源是，极端情况下有f个故障节点，f个恶意节点，那么至少要f+1个诚实节点才能保证少数服从多数，所以恶意节点最多是f/(f+f+f+1)，大概1/3
对于一个permissioned network比如公司内网或者类似类似hyperledger这有的联盟链来说比较容易监控，
但是对于一个开放式的网络，每分钟都可能有节点加入退出，根本无从监控和得知某个时间范围内到底有多少恶意节点，简单的数学模型是无法解决这个问题的，而且节点数过多会影响PBFT节点达成共识的速度，超过一定数目一般是不堪用的；
而且拜占庭容错算法本身是易于被[Sybil attack](https://www.geeksforgeeks.org/sybil-attack/)， 因为默认情况下一个节点不需要花费任何代价就很容易伪造多个身份
下面我们看下比特币是如何“解决”这些问题的

从故障容错到拜占庭容错，我们算是跳跃了一步，允许有恶意节点，但是限制为不超过全网1/3的恶意节点，
我们接下来还要再跳跃更大的一步，因为我们要面向全网，不做任何限制：不限制节点数，无法得知恶意节点数，节点可以任意时刻加入退出，同时我们还要保证节点达成正确的共识结果

#### 3.2.2 比特币共识算法

* 1.第一步 共识的门票：创造随机事件

很多人将POW和POS误解为共识算法，我在另外一篇文章是专门讲了这个问题[解密挖矿与共识的误解](https://lyhistory.com/docs/blockchain/consensus)，
这里就不再做讨论，
通过POW工作量证明，动态调整难度，限制了挖矿节点提交区块的速度，保证大概10分钟左右生成一个区块,随机数的加入也让每一次打包变成了一次相对独立的随机事件，为后面泊松分布的证明打下伏笔；
另外通过script脚本解决了
拜占庭将军传递假消息问题：密码学保证数据一致性，除了矿工奖励，新的交易必然是解锁已经存在的utxo，

destroying the Bitcoin system will also undermine the effectiveness of his own wealth

* 2.第二步 长链胜出：泊松分布的胜利

在一条链上无法double spent，但是可以在软分叉链上double spent，

![tamper block](/docs/docs_image/software/distrubuted_system10.png)

运行节点的目的以及维护网络的方式具体就是挖矿（打包区块），发布交易，验证交易等；

区块链 尤其是公链的共识算法跟分布式系统的共识算法有着本质的区别，分布式的共识算法如RAFT是基于系统容错，而公链的共识算法是基于拜占庭问题的容错算法，意思是要在节点作恶的情况下还能够达成共识



目前来看，只有公链才算是真正意义的分布式系统，因为所有节点基本上都是公平的，可以随时加入退出且不影响公链的运行；
paxos Byzantine ft

ref:
[Zab in words](https://cwiki.apache.org/confluence/display/ZOOKEEPER/Zab1.0)
[Paxos lecture (Raft user study)](https://www.youtube.com/watch?v=JEpsBg0AO6o)
[Paxos Made Simple](http://lamport.azurewebsites.net/pubs/pubs.html#paxos-simple)
[Paxos By Example](https://medium.com/@angusmacdonald/paxos-by-example-66d934e18522)
[Paxos 算法](https://baike.baidu.com/item/Paxos%20%E7%AE%97%E6%B3%95/10688635?fr=aladdin)
[图解分布式一致性协议Paxos](https://www.cnblogs.com/hugb/p/8955505.html)
[RAFT协议](https://raft.github.io/)
[Visualizations Raft: Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft/)
[基于quartz和zookeeper的分布式调度设计](https://juejin.im/post/5c55ac0bf265da2da771a216)
[Hyperledger Fabric](https://cloud.ibm.com/docs/services/blockchain?topic=blockchain-hyperledger-fabric)
[Building a Distributed Log from Scratch, Part 2: Data Replication](https://bravenewgeek.com/tag/leader-election/)


[Optimizing and Implementing Paxos](http://web.cse.ohio-state.edu/~wang.7564/cse5439/Paxos2.pdf)
[Analyzing Bitcoin Security](https://www.slideshare.net/philippecamacho/analyzing-bitcoin-security)

[Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf)

[From Distributed Consensus Algorithms to the Blockchain Consensus Mechanism](https://medium.com/datadriveninvestor/from-distributed-consensus-algorithms-to-the-blockchain-consensus-mechanism-75ee036abb65)