---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《分布式缓存redis》

## Install
https://redis.io/topics/quickstart
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make test
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/

> Installing Redis more properly
> Running Redis from the command line is fine just to hack a bit with it or for development. However at some point you'll have some actual application to run on a real server. For this kind of usage you have two different choices:
> 
> + Run Redis using screen.
> + Install Redis in your Linux box in a proper way using an init script, so that after a restart everything will start again properly.
> A proper install using an init script is strongly suggested. The following instructions can be used to perform a proper installation using the init script shipped with Redis 2.4 in a Debian or Ubuntu based distribution.
> 
> We assume you already copied redis-server and redis-cli executables under /usr/local/bin.
> + Create a directory in which to store your Redis config files and your data:
> sudo mkdir /etc/redis
> sudo mkdir /var/redis
> + Copy the init script that you'll find in the Redis distribution under the utils directory into /etc/init.d. We suggest calling it with the name of the port where you are running this instance of Redis. For example:
> sudo cp utils/redis_init_script /etc/init.d/redis_6379
> + Edit the init script.
> sudo vi /etc/init.d/redis_6379
> ...
> https://redis.io/topics/quickstart

### Single node
redis-server
Or start with config
redis-server redis.conf

### Cluster Mode
Redis cluster tutorial https://redis.io/topics/cluster-tutorial
Config:
```
daemonize yes  #后台运行模式
logfile “redis_6379_log”
pidfile /home/web/redis/var/run/redis_6379.pid  #修改pid文件
dir /home/web/redis/data/ #指定本地数据库存放目录
port 6379  #端口
dbfilename dump_6379.rdb #数据文件
appendfilename "appendonly_6379.aof"
cluster-enabled yes #打开注释，启动cluster模式
cluster-config-file nodes-6379.conf #打开注释，启动cluster模式
# Cluster node timeout is the amount of milliseconds a node must be unreachable
# for it to be considered in failure state.
# Most other internal time limits are multiple of the node timeout.
cluster-node-timeout 15000 #打开注释，启动cluster模式
```
参考最低配置：https://redis.io/topics/cluster-tutorial
_Note that the minimal cluster that works as expected requires to contain at least three master nodes._

redis-server conf/redis6379.conf
redis-server conf/redis6380.conf
redis-server conf/redis6381.conf
redis-cli --cluster create <HOSTIP1>:6379 <HOSTIP1>:6380 <HOSTIP1>:6381 \
<HOSTIP2>:6379 <HOSTIP2>:6380 <HOSTIP2>:6381 \
<HOSTIP3>:6379 <HOSTIP3>:6380 <HOSTIP3>:6381 \
--cluster-replicas 2

控制脚本：
```
REDIS_HOME=/opt/redis-5.0.5
pushd ${REDIS_HOME} &>/dev/null

while [ "${1:0:1}" == "-" ]; do
  case $1 in
    --start)
      echo "Starting redis nodes..."
      redis-server conf/redis6379.conf
      redis-server conf/redis6380.conf
      redis-server conf/redis6381.conf
      ;;
    --kill)
      echo "Stopping redis nodes..."
      redis-cli -p 6379 shutdown
      redis-cli -p 6380 shutdown
      redis-cli -p 6381 shutdown
          ;;
    *)
      echo "usage: --start|--kill"
      exit 1
      ;;
  esac
  shift
done

```

## 集群管理

### BASIC CMD&GUI

https://redis.io/topics/rediscli
```
redis-cli --cluster help
redis-cli -c -h <HOSTIP> -p <PORT>
	cluster help
	cluster info
	cluster nodes
	cluster slots
	replicate NODEID
	cluster failover (on slave node)
		keys * (Check empty)
		flushdb/flushall (on master nodes)
		cluster reset(soft/hard, chang slave to an empty ‘standalone’ master)
		Slaveof no one (change slave to master, cannot execute in cluster mode)
	Slave host port (change slave to replicate another master, cannot execute in cluster mode)
	
redis-cli --cluster check <HOSTIP>:<PORT>

redis-cli --cluster fix <HOSTIP>:<PORT>
redis-cli -h <HOSTIP> -p <PORT> cluster meet <TARGETHOSTIP> <TARGETPORT>
redis-cli cluster forget <NODEID> (cannot perform on itself or it’s slave)
redis-cli --cluster del-node <HOSTIP>:<PORT> <NODEID>
#add-node默认是empty master，也可以加参数指定为slave ()
redis-cli --cluster add-node <HOSTIP>:<PORT> <ANOTHER HOSTIP>:<PORT> --cluster-slave --cluster-master-id <NODEID>

redis-cli -p 7002 shutdown
redis-cli -p 7002 debug segfault

redis-cli --cluster reshard <ANYHOSTIP>:<ANYPORT> --cluster-yes
redis-cli --cluster rebalance --cluster-threshold 1 <ANYHOSTIP>:<ANYPORT>

More:
Database
https://stackoverflow.com/questions/50534492/redis-how-to-get-current-database-name
https://redis.io/commands/client-list

client list
redis-cli INFO|grep db
redis-cli INFO|grep db|wc -l
redis-cli INFO keyspace

redis implement stored procedure 
https://redis.io/commands/eval

```

** GUI:
use colon as separator https://redisdesktop.com/
Dbeaver support nosql but only for enterprise edition
Optionally we can choose fastoredis https://fastoredis.com/anonim_users_downloads


### 理论基础 Theory

学习redis源码过程笔记、问题记录，通过代码阅读熟悉分布式NOSQL数据库redis cluster集群功能、主从复制，节点扩容、槽位迁移、failover故障切换、一致性选举完整分析，对理解redis源码很有帮助  https://github.com/daniel416/Reading-and-comprehense-redis/

https://redis.io/topics/cluster-spec

An introduction to Redis data types and abstractions https://redis.io/topics/data-types-intro

**TCP PORTS:
Every Redis Cluster node requires two TCP connections open. The normal Redis TCP port used to serve clients, for example 6379, plus the port obtained by adding 10000 to the data port, so 16379 in the example.

**DATA SHARDING:
16384 slots, hash slot ,why ? https://cloud.tencent.com/developer/article/1042654
16384这个数字也不是作者随意指定的，Redis集群内部使用位图（bit map）来标志一个slot是否被占用，为了减少集群之间信息交换的大小，信息的大小被固定为2048字节
2048 bytes = 2^11 * 8 bit= 2^14 bit= 16384
14 out of 16 CRC16 output bits are used (this is why there is a modulo 16384 operation in the formula above).

Hash tag and multiple key operations 
this{foo}key and another{foo}key are guaranteed to be in the same hash slot, and can be used together in a command with multiple keys as arguments

**ConfigEpoch and current epoch
This mechanism in Redis Cluster is called last failover wins.
When a slave fails over its master, it obtains a configuration epoch which is guaranteed to be greater than the one of its master (and more generally greater than any other configuration epoch generated previously). For example node B, which is a slave of A, may failover B with configuration epoch of 4. It will start to send heartbeat packets (the first time mass-broadcasting cluster-wide) and because of the following second rule, receivers will update their hash slot tables

The same happens during reshardings. When a node importing a hash slot completes the import operation, its configuration epoch is incremented to make sure the change will be propagated throughout the cluster.

>Practical example of configuration epoch usefulness during partitions
>This section illustrates how the epoch concept is used to make the slave promotion process more resistant to partitions.

> + A master is no longer reachable indefinitely. The master has three slaves A, B, C.
> + Slave A wins the election and is promoted to master.
> + A network partition makes A not available for the majority of the cluster.
> + Slave B wins the election and is promoted as master.
> + A partition makes B not available for the majority of the cluster.
> + The previous partition is fixed, and A is available again.
>At this point B is down and A is available again with a role of master (actually UPDATE messages would reconfigure it promptly, but here we assume all UPDATE messages were lost). At the same time, slave C will try to get elected in order to fail over B. This is what happens:

> 1.C will try to get elected and will succeed, since for the majority of masters its master is actually down. It will obtain a new incremental configEpoch.
> 2.A will not be able to claim to be the master for its hash slots, because the other nodes already have the same hash slots associated with a higher configuration epoch (the one of B) compared to the one published by A.
> 3.So, all the nodes will upgrade their table to assign the hash slots to C, and the cluster will continue its operations.
> https://redis.io/topics/cluster-spec

**CONSISTENCY GUARANTEE:
Redis Cluster is not able to guarantee strong consistency. In practical terms this means that under certain conditions it is possible that Redis Cluster will lose writes that were acknowledged by the system to the client.
Tradeoff between Synchronous write and Performance

Redis Sentinel vs Redis Cluster:
https://redislabs.com/redis-features/high-availability

### 自动方式管理

1.Replicas migration
> # Cluster replicas are able to migrate to orphaned masters, that are masters
> # that are left without working replicas. This improves the cluster ability
> # to resist to failures as otherwise an orphaned master can't be failed over
> # in case of failure if it has no working replicas.
> #
> # Replicas migrate to orphaned masters only if there are still at least a
> # given number of other working replicas for their old master. This number
> # is the "migration barrier". A migration barrier of 1 means that a replica
> # will migrate only if there is at least 1 other working replica for its master
> # and so forth. It usually reflects the number of replicas you want for every
> # master in your cluster.
> #
> # Default is 1 (replicas migrate only if their masters remain with at least
> # one replica). To disable migration just set it to a very large value.
> # A value of 0 can be set but is useful only for debugging and dangerous
> # in production.
> #
> # cluster-migration-barrier 1

2.consider use failover whenever make changes to master nodes
1)	Remove master node (one option is reshard the data to the other master nodes and then remove, An alternative to remove a master node is to perform a manual failover of it over one of its slaves and remove the node after it turned into a slave of the new master.)
2)	Before shutdown
3)	Upgrade master node (failover to its slave node first before upgrading, upgrade when it becomes a slave node)

Use failover rather than manual allocate replica using “REPLICATE <NODEID>”

> 1.The replica tells the master to stop processing queries from clients.
> 2.The master replies to the replica with the current replication offset.
> 3.The replica waits for the replication offset to match on its side, to make sure it processed all the data from the master before it continues.
> 4.The replica starts a failover, obtains a new configuration epoch from the majority of the masters, and broadcasts the new configuration.
> 5.The old master receives the configuration update: unblocks its clients and starts replying with redirection messages so that they'll continue the chat with the new master.
> https://redis.io/commands/cluster-failover

3.migration between clusters
--cluster import

### 手动方式管理 Manual way (not recommend)
如果主从都是在集群模式下（cluster-enable=yes），那么是无法使用非集群模式的命令，比如slaveof/replicaof
** 1.del-node/add-node
del-node如果是slave十分不推荐，因为启动时依然会记得其他节点，虽然可以forget大部分节点，但是无法forget它的master，所以再add-node会有问题，所以此时只能采用meet
Del-node如果是master，首先要将master做reshard转移到其他master nodes，然后将其对应的slave nodes全部replicate其他的master nodes，以防重启master后，slave nodes仍然记得该master node

redis-cli --cluster del-node <HOSTIP>:<PORT> <NODEID>
Redis-server conf/redis6379.conf
add-node默认是master，也可以加参数指定为slave
redis-cli --cluster add-node <NEW HOSTIP>:<PORT> <ANY EXIST HOSTIP>:<PORT> --cluster-slave --cluster-master-id 

** 2.slaveof/replicaof注意再cluster集群模式下，是不可以手动分配的，可以更改slave配置，cluster-enabled=no然后再尝试
Slaveof no one (change slave to master)
Slave host port (change slave to replicate another master)

** 3.reset and meet
After reset, node become a standalone master node, and then execute meet 
$redis-cli -p 6379
127.0.0.1:6379> flushall
127.0.0.1:6379> cluster reset
127.0.0.1:6379> exit
redis-cli -h <HOSTIP> -p <PORT> cluster meet <TARGETHOSTIP> <TARGETPORT>

** 4. Final step: reshard or rebalance
redis-cli --cluster reshard <HOSTIP>:<PORT> --cluster-yes
redis-cli --cluster rebalance --cluster-threshold 1 <HOSTIP>:<PORT>

** 5. allocate slave for master
cluster replicate <NODEID>

the other failed attempt:
~~
redis-cli --cluster del-node <HOSTIP>:<PORT> <NODEID>
redis-cli cluster forget <NODEID>
redis-cli --cluster add-node <HOSTIP>:<PORT> <ANY EXIST HOSTIP>:<PORT> --cluster-slave --cluster-master-id <MASTER NODEID>
https://www.jianshu.com/p/ff173ae6e478
Failed because cannot forget itself and it’s master!
~~

### Overall Admin
Read https://redis.io/topics/admin
http://antirez.com/news/96

> Securing Redis
> 1.Make sure the port Redis uses to listen for connections (by default 6379 and additionally 16379 if you run Redis in cluster mode, plus 26379 for Sentinel) is firewalled, so that it is not possible to contact Redis from the outside world.
> 2.Use a configuration file where the bind directive is set in order to guarantee that Redis listens on only the network interfaces you are using. For example only the loopback interface (127.0.0.1) if you are accessing Redis just locally from the same computer, and so forth.
> 3.Use the requirepass option in order to add an additional layer of security so that clients will require to authenticate using the AUTH command.
> 4.Use spiped or another SSL tunneling software in order to encrypt traffic between Redis servers and Redis clients if your environment requires encryption.

> Disabling of specific commands
> It is possible to disable commands in Redis or to rename them into an unguessable name, so that normal clients are limited to a specified set of commands.
> For instance, a virtualized server provider may offer a managed Redis instance service. In this context, normal users should probably not be able to call the Redis CONFIG command to alter the configuration of the instance, but the systems that provide and remove instances should be able to do so.
> In this case, it is possible to either rename or completely shadow commands from the command table. This feature is available as a statement that can be used inside the redis.conf configuration file. For example:
> rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
> In the above example, the CONFIG command was renamed into an unguessable name. It is also possible to completely disable it (or any other command) by renaming it to the empty string, like in the following example:
> rename-command CONFIG ""
> https://redis.io/topics/security

**Upgrade
If you are using Redis Sentinel or Redis Cluster, the simplest way in order to upgrade to newer versions, is to upgrade a slave after the other, then perform a manual fail-over in order to promote one of the upgraded replicas as master, and finally promote the last slave.

**Monitor
redis-cli memory doctor
redis-cli latency doctor

Monitor:
https://redis.io/commands/MONITOR

## 系统集成 Integration

**StackExchange.Redis
Driver for .net: StackExchange.Redis 1.2https://github.com/StackExchange/StackExchange.Redis
for partial matching
Where are KEYS, SCAN, FLUSHDB etc? https://github.com/StackExchange/StackExchange.Redis/blob/41f427bb5ed8c23d0992a1411d0c92667b133d8e/docs/KeysScan.md

**Python
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org redis-py-cluster
 from rediscluster import StrictRedisCluster
 rc = StrictRedisCluster(startup_nodes=redis_nodes, decode_responses=True)
>>> rc.smembers("bitcoin:stg_testnet:1514360")
set([u'812853c7fe8bfa3f7d625895b3270245861f974f6ff19f8ce21317b5378be41e'])
https://github.com/Grokzen/redis-py-cluster/blob/unstable/tests/test_commands.py

**Spring boot integration
Spring-Data-Redis 解析 https://juejin.im/post/5bac97606fb9a05cd8492e48

spring.redis.database=5
# Redis服务器地址
spring.redis.host=127.0.0.1
# Redis服务器连接端口
spring.redis.port=6379

## Troubleshooting
1.org.springframework.data.redis.RedisSystemException: Redis exception; nested exception is io.lettuce.core.RedisException: io.lettuce.core.RedisConnectionException: DENIED Redis is running in protected mode because protected mode is enabled, no bind address was specified, no authentication password is requested to clients. In this mode connections are only accepted from the loopback interface. If you want to connect from external computers to Redis you may adopt one of the following solutions: 1) Just disable protected mode sending the command 'CONFIG SET protected-mode no' from the loopback interface by connecting to Redis from the same host the server is running, however MAKE SURE Redis is not publicly accessible from internet if you do so. Use CONFIG REWRITE to make this change permanent. 2) Alternatively you can just disable the protected mode by editing the Redis configuration file, and setting the protected mode option to 'no', and then restarting the server. 3) If you started the server manually just for testing, restart it with the '--protected-mode no' option. 4) Setup a bind address or an authentication password. NOTE: You only need to do one of the above things in order for the server to start accepting connections from the outside.

SOLUTION: redis-server redis.conf

2."Unable to connect to Redis; nested exception is io.lettuce.core.RedisException: Cannot retrieve initial cluster partitions from initial URIs [RedisURI [host='192.168.56.101', port=6379]]",
telnet result:

SOLUTION:
CONFIG SET protected-mode no
CONFIG REWRITE

3.ERR Protocol error: invalid bulk length

https://github.com/xetorthio/jedis/issues/1034
https://stackoverflow.com/questions/6752894/predis-protocol-error-invalid-bulk-length

4.Timeout issue
Line 15222: 2018-05-16 18:23:43,536 [32] DEBUG LaxinoV2Plugin - [Debug      ]Exception :
Timeout performing GET USERREPORT:SSSLZ:LZ:20658216:2bc1af86-d47c-45b8-b552-2d0b1f2078e5, inst: 1, mgr: ExecuteSelect, err: never, queue: 4750554, qu: 0, qs: 4750554, qc: 0, wr: 0, wq: 0, in: 65536, ar: 0, 
clientName: TW-SSS-UGS, serverEndpoint: 10.22.103.166:6379, keyHashSlot: 5897, IOCP: (Busy=0,Free=1000,Min=2,Max=1000), WORKER: (Busy=1,Free=32766,Min=2,Max=32767), 
Local-CPU: 37.95% (Please take a look at this article for some common client-side issues that can cause timeouts: 

https://github.com/StackExchange/StackExchange.Redis/tree/master/Docs/Timeouts.md

5.[ERR] Node XXXX:6379 is not empty. Either the node already knows other nodes (check with CLUSTER NODES) or contains some key in database 0

$redis-cli -p 6379
127.0.0.1:6379> flushall
OK
127.0.0.1:6379> cluster reset
OK
127.0.0.1:6379> exit

6. issue raised by above ‘cluster rest’, the node become a standalone node, forgot other nodes!!!!

redis-cli --cluster help
redis-cli --cluster add-node <HOSTIP>:<PORT> <ANY EXIST HOSTIP>:<PORT> --cluster-slave
Redis [ERR] Nodes don’t agree about configuration!
https://hzkeung.com/2018/02/25/redis-trib-check
redis-cli --cluster check <HOSTIP>:<PORT>
redis-cli -h <ANY EXIST HOSTIP> -p <PORT> cluster meet <HOSTIP> <PORT>

7. promote slave node to master

simply delete it and then meet or re-add it

redis-cli --cluster del-node <HOSTIP>:<PORT> <NODEID>
>>> Removing node xxxx from cluster xxxxx:6379
>>> Sending CLUSTER FORGET messages to the cluster...
>>> SHUTDOWN the node.
redis-cli -h <ANY EXIST HOSTIP> -p 6379 cluster meet <NEW HOSTIP> <PORT>
redis-cli --cluster add-node <NEW HOSTIP>:<PORT> <ANY EXIST HOSTIP>:<PORT>
redis-cli --cluster rebalance <NEW HOSTIP>:<PORT>

8. failed delete node

Solv: meet then delete
$redis-cli --cluster del-node <HOSTIP>:<PORT> <NODEID>
>>> Removing node XXXXXXX from cluster XXXXX:6379
>>> Sending CLUSTER FORGET messages to the cluster...
Node XXXXX:6381 replied with error:
ERR Unknown node XXXXXXXX

redis-cli -h <ANY EXIST HOSTIP> -p <PORT> cluster meet <HOSTIP> <PORT>