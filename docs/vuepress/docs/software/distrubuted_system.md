---
sidebar: auto
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

---

## 1.关于一致性

我个人理解，在谈到单机系统和分布式系统的一致性，这个词的侧重点还是有所区别的：

首先对于一个单机系统，一致性一般是强调在并发请求的情况下，该系统事务级别和会话级别下根据系统的设置表现出来的读写的一致和冲突，比如两个并发事务的读写冲突，
比如前面说的关系型数据库，不考虑主从数据库部署的情况下，单机部署，读写同一个数据库，根据ACID理论，一致性的表现是会根据数据库的隔离水平设置isolation level有所不同，有兴趣可以自己查阅<Isolation (database systems)>

对于分布式系统，一致性一般是指对于一个集群内部各个节点上面的相关数据保持同步；

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
而在区块链的世界中，共识算法是基于拜占庭容错Byzantine fault tolerance，前提是假设系统中存在恶意节点（会发送假消息），基本都是最终一致，而不是强一致，为了区分，故障容错又称作非拜占庭容错这个问题下面会详细展开；

另外需要再指出一点，经过前面数据库的例子所以可以看到一致性不是固定死的，很多情况下一致性会根据系统的设置或系统的架构不同发生变化，在同一个系统中不同类型的数据也可能有着不同类型的一致性；
单机系统都如此，分布式系统更是复杂，而对于区块链来说，一致性更加有着丰富的表现，比如比特币的6个确认，主要是基于挖矿难度和比特币价值的一个估算，但是同样的相同或类似共识算法的其他分叉币却可能需要更多的确认，
因为对价格比较低的以及节点比较少的虚拟币发起51%攻击比较容易，这是数学和经济学对一致性的影响；

## 2.基于故障容错Crash fault tolerance(或非拜占庭容错)的分布式系统

中心化系统有单点故障的风险，所以引入多个节点，故障容错的假设是多节点中可能会存在故障节点，消息会丢失或重复，但是不会有发送假消息的恶意节点；

在这种假设前提下，多个节点就需要协同工作，有两种思路：

* 1.主备方案
最直接的办法是指定一个leader，只由leader单节点负责管理竞争资源，然后其他节点作为follower保存副本
- 一致性，客户端写入数据请求都是交由或转发给leader，所以单节点维护保持了数据写的一致，所有节点都会接受客户端的读请求，follower不断同步保存的副本也保证了最终一致性；
- 排除单点故障，当某个follower发生故障，leader就将follower从自己的通讯录中剔除或拉黑，如果该follower再次重新恢复上线，leader会将其再加回通讯录；

现在出现两个问题：
** 1） follower转发写数据请求给leader，如果他们转发的请求互相有冲突呢，比如对同一个数据同时修改
** 2） 如何动态选出的leader并且当leader节点发送故障如何从follower中选出leader呢

这两个问题都要依赖共识算法解决zookeeper的ZAP协议就是解决这个问题的：

第一个问题解决方法是2PC及两阶段提交协议: 

leader直接收到或收到follower转发的写操作请求，都会按照FIFO顺序发送proposal给所有follower，如果收到半数以上的follower的ack响应，leader就会发送commit指令给所有follower（注意leader也是自己的follower）；

第二个问题解决方法是：

每个节点启动后默认都是looking模式，当有leader选出后，就立即变成follower模式，如果leader崩溃了，即断开跟follower的连接（心跳失败），follower又会变回looking模式，然后崩溃恢复选举leader采取的算法是
“Use a best-effort leader election algorithm that will elect a leader with the latest history from a quorum of servers.”
即选出同步了最新提交历史的节点，这样可以尽量保证崩溃的leader在崩溃之前广播出去的数据没有丢失，当然如果是没有广播出去的数据肯定是会丢了；
每次选举出新的leader都会有自己的标志，有的叫term有的叫epoch，总之是为了防止挂掉的leader突然恢复，通过这个标志可以知道自己已经过气了；

* 2.一致性状态机 
上面是靠共识算法选举单节点leader节点来维护写的一致，现在我们完全采用共识算法来保证写的一致，不再需要leader，换句话说节点之间通过共识算法保持数据同步，具体是怎么工作的呢?

我们首先要从经典问题“paxos岛兼职议会问题”说起，这个故障问题描述为：
希腊岛屿Paxon上通过议会的方式来表决通过法律，议员们通过服务员传递纸条的方式交流信息，每个议员都将通过的法律记录在自己的本子上。
问题在于议员和服务员都是兼职的，他们随时会因为各种事情离开议会大厅，传递的消息也可能会重复，并随时可能有新的议员进入议会大厅进行法律表决，使用何种方式能够使得这个表决过程正常进行，且通过的法律不发生矛盾。
注意我们假设议员和服务员都是道德高尚的人，不会有恶意假消息

而解决这个问题的paxos共识算法就是经典的故障容错算法，很多其他的基于故障容错的共识算法都是基于paxos改进发展产生的，paxos本身也有很多变种，我们来简单讲一下Basic Paxos这个算法的基本原理：
引用斯坦福的教学内容Basic Paxos的基本流程图：
![paxos](/docs/docs_image/software/distrubuted_system00.png)
   
前面2PC及两阶段提交协议，实际paxos也是基于2PC，这里引入了提议者proposer和接受者acceptor的概念，
假设我们有5个节点Node1|Node2|Node3|Node4|Node5 ，其中Node1和Node2是proposer角色，然后Node3|Node4|Node5都是acceptor角色，实际上一个节点可以是多种角色，
我们这样是分是为了简化描述；
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
这些场景都是假设节点正常运作，paxos算法的意义就是可以在某些节点崩溃及通信延迟的情况下仍然可以达到最终一致的效果，

PAXOS比较复杂，RAFT是其实现的简化版本，实际上前面“主备方案”中提到的zookeeper的ZAP也都是跟RAFT类似的思想，RAFT主要包含选举leader election和日志拷贝log replication：
比如leader election也是利用心跳和半数选举的机制，并且leader也是有第几代leader的term标志，ZAP用的是epoch；
然后log replication跟simple paxos的2PC稍微不同，首先所有客户端的写请求都会转发给leader来处理，然后leader写入日志，状态是uncommitted，通过心跳发给所有followers，
follower收到后也写入自己的日志，状态是uncommitted，等得到过半数的followers的ack响应后将状态改为committed，然后再通知所有follower，follower收到后也更新数据更改状态为committed，

下面拿RAFT协议，以网络分区的例子来说明下为什么前面提到的分布式算法思想可以实现分布式一致性状态机，

![raft](/docs/docs_image/software/distrubuted_system01.png)

可以看到网络分为两个分区，两个leader，他们的时代是不同的一个是term=1一个是term=2，互相不知道彼此，但是由于term=1在更改数据的时候无法得到超过半数的响应，
所以所有数据更改都会处于uncommit未提交状态；而反之在另一边term=2这里，是可以达成共识的；
最后一旦网络恢复正常，term=1的分区就会发现自己全部过时了，就会放弃自己的uncommit日志，同步term=2的提交日志；


### 2.1.分布式产品和zookeeper

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

### 2.2.动手写一个简单的分布式系统

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

我们前面谈到的分布式系统都不是不是真正的分布式，只能算是多中心的系统，zookeeper也不是真正的分布式框架，因为其本身集群也是有leader和follower的，
所以基于zookeeper的分布式系统更会不是真的分布式，只有是基于共识算法实现的系统才有可能是真正的分布式系统；

谈到去中心化，分布式，最广为人知的就是区块链，区块链技术，又被称作DLT，Distributed Ledger Technology，区块链大致分为permissioned 和 non-permissioned blockchain，前者基本都是私有链和联盟链，后者是公链，
目前来看，只有公链才算是真正意义的分布式系统，因为所有节点基本上都是公平的，可以随时加入退出，不影响公链的运行，大家遵循同一个规则来运行节点，维护网络，
运行节点的目的以及维护网络的方式具体就是挖矿（打包区块），发布交易，验证交易等；

区块链 尤其是公链的共识算法跟分布式系统的共识算法有着本质的区别，分布式的共识算法如RAFT是基于系统容错，而公链的共识算法是基于拜占庭问题的容错算法，意思是要在节点作恶的情况下还能够达成共识

拜占庭容错算法是BFT，而我们这里是泛指基于解决拜占庭将军问题的所有共识算法
关于共识算法，参考我在巴比特上面的文章：
[区块链基础：解密挖矿与共识的误解](https://www.8btc.com/media/393154)


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
[Building a Distributed Log from Scratch, Part 2: Data Replication](https://bravenewgeek.com/tag/leader-election/)


