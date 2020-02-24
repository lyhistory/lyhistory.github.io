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
redis-cli --cluster create 10.136.100.48:6379 10.136.100.48:6380 10.136.100.48:6381 \
10.136.100.49:6379 10.136.100.49:6380 10.136.100.49:6381 \
10.136.100.50:6379 10.136.100.50:6380 10.136.100.50:6381 \
--cluster-replicas 2

Start and shutdown
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

