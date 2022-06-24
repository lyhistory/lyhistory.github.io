
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/index.html

Pgpool-II



## 1.Knowledge base

### 1.1 What is
Pgpool-II is a proxy server sitting between clients and PostgreSQL. Pgpool-II understands the wire level protocol used by PostgreSQL called "frontend and backend protocol". For more details of the protocol, see the PostgreSQL manual. No modified PostgreSQL is required to use Pgpool-II (more precisely, you will need a few extensions to use full functions of Pgpool-II). So Pgpool-II can cope with variety of PostgreSQL versions. In theory, even the earliest version of PostgreSQL can be used with Pgpool-II. Same thing can be said to client side. As long as it follows the protocol, Pgpool-II happily accept connections from it, no matter what kind of languages or drivers it uses.

Pgpool-II consists of multiple process. There is a **main process**, which is the parent process of all other process. It is responsible for forking child process each of which accepts connections from clients. There are some **worker process** those are forked from the main process as well, which is responsible for detecting streaming replication delay. There is also a special process called **"pcp process"**, which is solely used for management of Pgpool-II itself. Pgpool-II has a built-in high availability function called **"watchdog"**. Watchdog consists of some process. For more details of watchdog, see Chapter 4.

![](https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/process-diagram.gif)

It provides the following features:

+ Connection Pooling
Pgpool-II maintains established connections to the PostgreSQL servers, and reuses them whenever a new connection with the same properties (i.e. user name, database, protocol version, and other connection parameters if any) comes in. It reduces the connection overhead, and improves system's overall throughput.

+ Load Balancing
If a database is replicated (because running in either replication mode or master/slave mode), performing a SELECT query on any server will return the same result. Pgpool-II takes advantage of the replication feature in order to reduce the load on each PostgreSQL server. It does that by distributing SELECT queries among available servers, improving the system's overall throughput. In an ideal scenario, read performance could improve proportionally to the number of PostgreSQL servers. Load balancing works best in a scenario where there are a lot of users executing many read-only queries at the same time.

+ Automated fail over
If one of the database servers goes down or becomes unreachable, Pgpool-II will detach it and will continue operations by using the rest of database servers. There are some sophisticated features that help the automated failover including timeouts and retries.

+ Online Recovery
Pgpool-II can perform online recovery of database node by executing one command. When the online recovery is used with the automated fail over, a detached node by fail over is possible to attach as standby node automatically. It is possible to synchronize and attach new PostgreSQL server too.

+ Replication
Pgpool-II can manage multiple PostgreSQL servers. Activating the replication feature makes it possible to create a real time backup on 2 or more PostgreSQL clusters, so that the service can continue without interruption if one of those clusters fails. Pgpool-II has built-in replication (native replication). However user can use external replication features including streaming replication of PostgreSQL.

+ Limiting Exceeding Connections
There is a limit on the maximum number of concurrent connections with PostgreSQL, and new connections are rejected when this number is reached. Raising this maximum number of connections, however, increases resource consumption and has a negative impact on overall system performance. Pgpool-II also has a limit on the maximum number of connections, but extra connections will be queued instead of returning an error immediately. However, you can configure to return an error when the connection limit is exceeded (4.1 or later).

+ Watchdog
Watchdog can coordinate multiple Pgpool-II, create a robust cluster system and avoid the single point of failure or split brain. Watchdog can perform lifecheck against other pgpool-II nodes, to detect a fault of Pgpoll-II. If active Pgpool-II goes down, standby Pgpool-II can be promoted to active, and take over Virtual IP.

+ In Memory Query Cache
In memory query cache allows to save a pair of SELECT statement and its result. If an identical SELECTs comes in, Pgpool-II returns the value from cache. Since no SQL parsing nor access to PostgreSQL are involved, using in memory cache is extremely fast. On the other hand, it might be slower than the normal path in some cases, because it adds some overhead of storing cache data.

### 1.2 Restrictions
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/restrictions.html

https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/admin.html

### 1.3 Installation of Pgpool-II

**install from source or rpm**

build from source: https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/install-requirements.html

install from rpm:
```
yum install http://www.pgpool.net/yum/rpms/4.0/redhat/rhel-7-x86_64/pgpool-II-release-4.0-1.noarch.rpm
yum install pgpool-II-pg11

rpm direct download: https://yum.postgresql.org/rpmchart/

pg11 means PostgreSQL 11. Pgpool-II needs PostgreSQL's library and extensions directory. Since the directory paths are different in the particular PostgreSQL versions, You must choose appropriate RPM for your PostgreSQL rpm installation. We also assume you are using PostgreSQL community rpms. Optionally you can install:
yum install pgpool-II-pg11-debuginfo
which makes it easier to retrieve debugging symbols from the core or the backtrace. We recommend to install it. There is an optional package for developers.
yum install pgpool-II-pg11-devel
This installs header files which developers are interested in

On all the PostgreSQL servers you need to install:
yum install pgpool-II-pg11-extensions

systemctl enable pgpool.service
systemctl start pgpool.service 
systemctl stop pgpool.service 
```

**firewall**
```
#allow to access port that Pgpool-II use.
firewall-cmd --permanent --zone=public --add-port=9999/tcp --add-port=9898/tcp --add-port=9000/tcp  --add-port=9694/tcp
firewall-cmd --permanent --zone=public --add-port=9999/udp --add-port=9898/udp --add-port=9000/udp  --add-port=9694/udp
firewall-cmd --reload

#access to PostgreSQL
firewall-cmd --permanent --zone=public --add-service=postgresql
firewall-cmd --reload
```

**(optional) online recovery**
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/install-pgpool-recovery.html

**(optional) native replication mode**
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/create-installlock-table.html

**(optional) Compiling and installing documents**
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/install-docs.html



### 1.4 Configuration(Server Setup and Operation)

+ if installed from rpm: all the Pgpool-II configuration files live in **/etc/pgpool-II**
+ if installed from source code: **$prefix/etc/pgpool.conf by default** (/usr/local/etc )

**create The Pgpool-II User Account**
As with any server daemon that is accessible to the outside world, it is advisable to run Pgpool-II under a separate user account. This user account should only own the data that is managed by the server, and should not be shared with other daemons. (For example, using the user nobody is a bad idea.) It is not advisable to install executables owned by this user because compromised systems could then modify their own binaries.

```
useradd -m -d /home/pgpool pgpool

```
**Configuring pcp.conf**

Pgpool-II provides a interface for administrators to perform management operation, such as getting Pgpool-II status or terminating Pgpool-II processes remotely. pcp.conf is the user/password file used for authentication by this interface. 

```
 $ pg_md5 your_password
 $ cp /etc/pgpool-II/pcp.conf.sample /etc/pgpool-II/pcp.conf
 username:[md5 encrypted password]

```

**Configuring Pgpool-II**

pgpool.conf is the main configuration file of Pgpool-II. You need to specify the path to the file when starting Pgpool-II using -f option.

There are four different running modes in Pgpool-II: streaming replication mode, logical replication mode, master slave mode (slony mode), native replication mode and raw mode. In any mode, Pgpool-II provides connection pooling, automatic fail over and online recovery.

pgpool.conf samples:
| Operation mode | Configuration file name |
| ---- | ---- |
| Streaming replication mode | - |	 
| Replication mode	| pgpool.conf.sample-replication
| Master slave mode	 | - |
| Raw mode	| pgpool.conf.sample |
| Logical replication mode	| pgpool.conf.sample-logical |

```
cp /etc/pgpool-II/pgpool.conf.sample-stream /etc/pgpool-II/pgpool.conf
```

https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/configuring-pgpool.html

**Configuring backend information**
For Pgpool-II to recognize PostgreSQL backend servers, you need to configure backend* in pgpool.conf. For starters, at least backend_hostname and backend_port parameters are required to be set up to start Pgpool-II server.

/etc/pgpool-II/pgpool.conf

https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/runtime-config-backend-settings.html

### 1.5 Watchdog
Watchdog is a sub process of Pgpool-II to add high availability. Watchdog is used to resolve the single point of failure by coordinating multiple pgpool-II nodes. 
To ensure the quorum mechanism properly works, the number of pgpool-II nodes must be odd in number and greater than or equal to 3.

#### Architecure of the watchdog
https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/tutorial-advanced-arch.html

+ Coordinating multiple Pgpool-II nodes
At the startup, if the watchdog is enabled, Pgpool-II node sync the status of all configured backend nodes from the master watchdog node. And if the node goes on to become a master node itself it initializes the backend status locally. When a backend node status changes by failover etc.., watchdog notifies the information to other Pgpool-II nodes and synchronizes them. When online recovery occurs, watchdog restricts client connections to other Pgpool-II nodes for avoiding inconsistency between backends.

Watchdog also coordinates with all connected Pgpool-II nodes to ensure that failback, failover and follow_master commands must be executed only on one pgpool-II node.

+ Life checking of other Pgpool-II nodes
Watchdog lifecheck is the sub-component of watchdog to monitor the health of Pgpool-II nodes participating in the watchdog cluster to provide the high availability. Traditionally Pgpool-II watchdog provides two methods of remote node health checking. "heartbeat" and "query" mode. 
Apart from remote node health checking watchdog lifecheck can also check the health of node it is installed on by monitoring the connection to upstream servers. If the monitoring fails, watchdog treats it as the local Pgpool-II node failure.

    + In heartbeat mode, watchdog monitors other Pgpool-II processes by using heartbeat signal. Watchdog receives heartbeat signals sent by other Pgpool-II periodically. If there is no signal for a certain period, watchdog regards this as the failure of the Pgpool-II. For redundancy you can use multiple network connections for heartbeat exchange between Pgpool-II nodes. This is the default and recommended mode to be used for health checking.

    + In query mode, watchdog monitors Pgpool-II service rather than process. In this mode watchdog sends queries to other Pgpool-II and checks the response.

    + external mode is introduced by Pgpool-II V3.5. This mode basically disables the built in lifecheck of Pgpool-II watchdog and expects that the external system will inform the watchdog about health of local and all remote nodes participating in the watchdog cluster.

+ Consistency of configuration parameters on all Pgpool-II nodes
At startup watchdog verifies the Pgpool-II configuration of the local node for the consistency with the configurations on the master watchdog node and warns the user of any differences.

+ Changing active/standby state when certain fault is detected
When a fault of Pgpool-II is detected, watchdog notifies the other watchdogs of it. If this is the active Pgpool-II, watchdogs decide the new active Pgpool-II by voting and change active/standby state.

+ Automatic virtual IP switching
When a standby Pgpool-II server promotes to active, the new active server brings up virtual IP interface. Meanwhile, the previous active server brings down the virtual IP interface. 

+ Automatic registration of a server as a standby in recovery
When the broken server recovers or new server is attached, the watchdog process notifies this to the other watchdogs in the cluster along with the information of the new server, and the watchdog process receives information on the active server and other servers. Then, the attached server is registered as a standby.

#### Restrictions
https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/tutorial-watchdog-restrictions.html

#### Starting/stopping watchdog

The watchdog process starts and stops automatically as sub-processes of the Pgpool-II, therefore there is no dedicated command to start and stop watchdog.

Watchdog controls the virtual IP interface, the commands executed by the watchdog for bringing up and bringing down the VIP require the root privileges. Pgpool-II requires the user running Pgpool-II to have root privileges when the watchdog is enabled along with virtual IP. This is however not good security practice to run the Pgpool-II as root user, the alternative and preferred way is to run the Pgpool-II as normal user and use either the custom commands for if_up_cmd, if_down_cmd, and arping_cmd using sudo or use setuid ("set user ID upon execution") on if_* commands

Lifecheck process is a sub-component of watchdog, its job is to monitor the health of Pgpool-II nodes participating in the watchdog cluster. The Lifecheck process is started automatically when the watchdog is configured to use the built-in life-checking, it starts after the watchdog main process initialization is complete. However lifecheck process only kicks in when all configured watchdog nodes join the cluster and becomes active. If some remote node fails before the Lifecheck become active that failure will not get caught by the lifecheck.

#### Integrating external lifecheck with watchdog
https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/tutorial-watchdog-integrating-external-lifecheck.html

### 1.6 Server Configuration
https://www.pgpool.net/docs/pgpool-II-4.1.1/en/html/runtime-config.html

**Setting Parameters**

Connections and Authentication

Running mode

Backend Settings

Connection Pooling

Error Reporting and Logging

Load Balancing

Health Check

Failover and Failback

Online Recovery

Streaming Replication Check

In Memory Query Cache

Secure Sockect Layer (SSL)

Watchdog

Misc Configuration Parameters

### 1.6 Client Authentication
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/client-authentication.html

The pool_hba.conf File

Authentication Methods

Using different methods for frontend and backend authentication

Using AES256 encrypted passwords in pool_passwd

### 1.7 Performance Considerations
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/performance.html


## 2. Pgpool-II + Watchdog Setup Example
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/example-configs.html

### 2.1 Simple two Nodes Replication

#### 2.1.1 Installing Pgpool-II
```
$ ./configure
$ make
$ make install
```
configure script collects your system information and use it for the compilation procedure. You can pass command line arguments to configure script to change the default behavior, such as the installation directory. Pgpool-II will be installed to **/usr/local(if installed from rpm default path: /etc/pgpool-II/)** directory by default.

make command compiles the source code, and make install will install the executables. You must have write permission on the installation directory.

#### 2.1.2 Configuration
```
//Configuration Files
$ cp /usr/local/etc/pgpool.conf.sample /usr/local/etc/pgpool.conf
    listen_addresses = '*'
    port = 9999

//Configuring PCP Commands
$ /usr/local/bin/pg_md5 postgres
    e8a48653851e28c69d0506508fb27fc5
$ cp /usr/local/etc/pcp.conf.sample /usr/local/etc/pcp.conf
    postgres:e8a48653851e28c69d0506508fb27fc5
    

//Preparing Database Nodes
$ vim /etc/pgpool-II/pgpool.conf
    pcp_port = 9898
    backend_hostname0 = 'localhost'
    backend_port0 = 5432
    backend_weight0 = 1
    backend_hostname1 = 'localhost'
    backend_port1 = 5433
    backend_weight1 = 1
    backend_hostname2 = 'localhost'
    backend_port2 = 5434
    backend_weight2 = 1

```
#### 2.1.3 Starting/Stopping Pgpool-II
```
$ pgpool
The above command, however, prints no log messages because Pgpool-II detaches the terminal. If you want to show Pgpool-II log messages, you pass -n option to pgpool command so Pgpool-II is executed as non-daemon process, and the terminal will not be detached.
$ pgpool -n &
The log messages are printed on the terminal, so it is recommended to use the following options.
$ pgpool -n -d > /tmp/pgpool.log 2>&1 &
to rotate log files:
$ pgpool -n 2>&1 | /usr/local/apache2/bin/rotatelogs \
     -l -f /var/log/pgpool/pgpool.log.%A 86400 &
To delete old log files before rotation, you could use cron:
55 23 * * * /usr/bin/find /var/log/pgpool -type f -mtime +5 -exec /bin/rm -f '{}' \;
Please note that rotatelogs may exist as /usr/sbin/rotatelogs2 in some distributions. -f option generates a log file as soon as rotatelogs starts and is available in apache2 2.2.9 or greater. Also cronolog can be used.
$ pgpool -n 2>&1 | /usr/sbin/cronolog \
     --hardlink=/var/log/pgsql/pgpool.log \
     '/var/log/pgsql/%Y-%m-%d-pgpool.log' &


$ pgpool stop
If any client is still connected, Pgpool-II waits for it to disconnect, and then terminates itself. Run the following command instead if you want to shutdown Pgpool-II forcibly.
$ pgpool -m fast stop

```

#### 2.1.4 Configuring Replication
we'll use three database nodes,

```
$ vim /usr/local/etc/pgpool.conf
//When replication_mode is on, Pgpool-II will send a copy of a received query to all the database nodes.
replication_mode = true
//when load_balance_mode is set to true, Pgpool-II will distribute SELECT queries among the database nodes.
load_balance_mode = true

//restart pgpool

//create a database to be replicated,
//Use the createdb commands through Pgpool-II, and the database will be created on all the nodes.
$ createdb -p 9999 bench_replication
//initializes the database with pre-defined tables and data
$ pgbench -i -p 9999 bench_replication

//If, on all the nodes, the tables and data are created, replication is working correctly.
$ for port in 5432 5433 5434; do
     >     echo $port
     >     for table_name in pgbench_branches pgbench_tellers pgbench_accounts pgbench_history; do
     >         echo $table_name
     >         psql -c "SELECT count(*) FROM $table_name" -p $port bench_replication
     >     done
     > done
```

#### 2.1.5 Watchdog Configuration Example
What you need is 2 Linux boxes on which Pgpool-II is installed and a PostgreSQL on the same machine or in the other one. It is enough that 1 node for backend exists. You can use watchdog with Pgpool-II in any mode: replication mode, master/slave mode and raw mode.
This example uses use "osspc16" as an Active node and "osspc20" as a Standby node. "Someserver" means one of them.

**Common Config for all Pgpool-II**
```
$ vim /usr/local/etc/pgpool.conf

//Enabling watchdog
use_watchdog = on

//Configure Up stream servers
trusted_servers = ''
# trusted server list which are used
# to confirm network connection
# (hostA,hostB,hostC,...)
      
//Watchdog Communication
wd_port = 9000

//Specify the IP address to be used as a virtual IP address in the delegate_IP
delegate_IP = '133.137.177.143'
```
**Individual Configurations for each Pgpool-II**
```
//FOR Active (osspc16) Server configurations
other_pgpool_hostname0 = 'osspc20'
# Host name or IP address to connect to for other pgpool 0
other_pgpool_port0 = 9999
# Port number for other pgpool 0
other_wd_port0 = 9000
# Port number for other watchdog 0

//FOR Standby (osspc20) Server configurations
other_pgpool_hostname0 = 'osspc16'
# Host name or IP address to connect to for other pgpool 0
other_pgpool_port0 = 9999
# Port number for other pgpool 0
other_wd_port0 = 9000
# Port number for other watchdog 0

```
**First start the Pgpool-II on Active server.**
```
[user@osspc16]$ su -
[root@osspc16]# {installed_dir}/bin/pgpool -n -f {installed_dir}/etc/pgpool.conf > pgpool.log 2>&1

Log messages will show that Pgpool-II has the virtual IP address and starts watchdog process:
    LOG:  I am announcing my self as master/coordinator watchdog node
     LOG:  I am the cluster leader node
     DETAIL:  our declare coordinator message is accepted by all nodes
     LOG:  I am the cluster leader node. Starting escalation process
     LOG:  escalation process started with PID:59449
     LOG:  watchdog process is initialized
      LOG:  watchdog: escalation started
      LOG:  I am the master watchdog node
     DETAIL:  using the local backend node status

```

**Starting pgpool in Standby server (osspc20)**
```
[user@osspc20]$ su -
[root@osspc20]# {installed_dir}/bin/pgpool -n -f {installed_dir}/etc/pgpool.conf > pgpool.log 2>&1

Log messages will show that Pgpool-II has joind the watchdog cluster as standby watchdog.
    LOG:  watchdog cluster configured with 1 remote nodes
     LOG:  watchdog remote node:0 on Linux_osspc16_9000:9000
     LOG:  interface monitoring is disabled in watchdog
     LOG:  IPC socket path: "/tmp/.s.PGPOOLWD_CMD.9000"
     LOG:  watchdog node state changed from [DEAD] to [LOADING]
     LOG:  new outbound connection to Linux_osspc16_9000:9000
     LOG:  watchdog node state changed from [LOADING] to [INITIALIZING]
     LOG:  watchdog node state changed from [INITIALIZING] to [STANDBY]
           LOG:  successfully joined the watchdog cluster as standby node
      DETAIL:  our join coordinator request is accepted by cluster leader node "Linux_osspc16_9000"
      LOG:  watchdog process is initialized
```

**Try it out**
```
//Confirm to ping to the virtual IP address.
[user@someserver]$ ping 133.137.177.142

//Confirm if the Active server which started at first has the virtual IP address.
[root@osspc16]# ifconfig

//Confirm if the Standby server which started not at first doesn't have the virtual IP address.
[root@osspc20]# ifconfig

//Try to connect PostgreSQL by "psql -h delegate_IP -p port".
[user@someserver]$ psql -h 133.137.177.142 -p 9999 -l

```

**Switching virtual IP**
```
//Confirm how the Standby server works when the Active server can't provide its service. Stop Pgpool-II on the Active server.
[root@osspc16]# {installed_dir}/bin/pgpool stop
Then, the Standby server starts to use the virtual IP address

```

**More: Lifecheck**
```
There are the parameters about watchdog's monitoring. Specify the interval to check wd_interval and the type of lifecheck wd_lifecheck_method. The hearbeat method specify the time to detect a fault wd_heartbeat_deadtime, the port number to receive wd_heartbeat_port, the interval to send wd_heartbeat_keepalive, the IP address or hostname of destination heartbeat_destination<emphasis>0</emphasis> and finally the destination port number heartbeat_destination_port<emphasis>0</emphasis>.

wd_lifecheck_method = 'heartbeat'
# Method of watchdog lifecheck ('heartbeat' or 'query' or 'external')
# (change requires restart)
wd_interval = 10
# lifecheck interval (sec) > 0
wd_heartbeat_port = 9694
# Port number for receiving heartbeat signal
# (change requires restart)
wd_heartbeat_keepalive = 2
# Interval time of sending heartbeat signal (sec)
# (change requires restart)
wd_heartbeat_deadtime = 30
# Deadtime interval for heartbeat signal (sec)
# (change requires restart)
heartbeat_destination0 = 'host0_ip1'
# Host name or IP address of destination 0
# for sending heartbeat signal.
# (change requires restart)
heartbeat_destination_port0 = 9694
# Port number of destination 0 for sending
# heartbeat signal. Usually this is the
# same as wd_heartbeat_port.
# (change requires restart)

```

**More: Switching virtual IP address**
```
There are the parameters for switching the virtual IP address. Specify switching commands if_up_cmd, if_down_cmd, the path to them if_cmd_path, the command executed after switching to send ARP request arping_cmd and the path to it arping_path.

if_cmd_path = '/sbin'
# path to the directory where if_up/down_cmd exists
if_up_cmd = 'ip addr add $_IP_$/24 dev eth0 label eth0:0'
# startup delegate IP command
if_down_cmd = 'ip addr del $_IP_$/24 dev eth0'
# shutdown delegate IP command

arping_path = '/usr/sbin'           # arping command path

arping_cmd = 'arping -U $_IP_$ -w 1'
```

### 2.2 Pgpool-II+ Watchdog Setup (Streaming replication mode)
In this example, we use 3 Pgpool-II servers to manage PostgreSQL servers to create a robust cluster system and avoid the single point of failure or split brain.

![](https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/cluster_40.gif)

**REQUIREMENT:**
We assume that all the Pgpool-II servers and the PostgreSQL servers are in the same subnet.
We use 3 servers with CentOS 7.4. Let these servers be server1, server2, server3. We install PostgreSQL and Pgpool-II on each server.

#### 2.2.1 Stepup postgresql server (data nodes) 
##### 2.2.1.1 Install PostgreSQL by using PostgreSQL YUM repository.
```
# yum install https://download.postgresql.org/pub/repos/yum/11/redhat/rhel-7-x86_64/pgdg-centos11-11-2.noarch.rpm
# yum install postgresql11 postgresql11-libs postgresql11-devel postgresql11-server

mkdir -p /lyhistory/workspace/postgres
chown -R postgres:postgres /lyhistory/workspace/postgres
chmod 750 /lyhistory/workspace/postgres

vi /lib/systemd/system/postgresql-12.service
	Environment=PGDATA=/lyhistory/workspace/postgres/data
(default: /var/lib/pgsql/12/data/)

cd /lyhistory/workspace/postgres
/usr/pgsql-12/bin/postgresql-12-setup initdb

systemctl enable postgresql-12

vi /lyhistory/workspace/postgres/data/pg_hba.conf 
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            ident
# IPv6 local connections:
host    all             all             ::1/128                 ident
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
host    all             all             172.16.0.0/16           md5
host    all             all             10.36.100.0/24          md5
host    all             all             192.168.0.0/16          md5

vi data/postgresql.conf 
	listen_addresses = '*' 
	
systemctl start postgresql-12
vi data/log/postgresql-Fri.log 

su - postgres 
```

##### 2.2.1.2 Set up PostgreSQL streaming replication on the primary server.
```
//First, we create the directory /var/lib/pgsql/archivedir to store WAL segments on all servers. In this example, only Primary node archives WAL locally.
[all servers]# su - postgres
[all servers]$ mkdir /var/lib/pgsql/archivedir

//Then we edit the configuration file $PGDATA/postgresql.conf on server1 (primary) as follows. Enable wal_log_hints to use pg_rewind. Since the Primary may become a Standby later, we set hot_standby = on.

listen_addresses = '*'
archive_mode = on
archive_command = 'cp "%p" "/var/lib/pgsql/archivedir/%f"'
max_wal_senders = 10
max_replication_slots = 10
wal_level = replica
hot_standby = on
wal_log_hints = on

```
We use the online recovery functionality of Pgpool-II to setup standby server after the primary server is started.

##### 2.2.1.4 create users
Because of the security reasons, we create a user repl solely used for replication purpose, and a user pgpool for streaming replication delay check and health check of Pgpool-II.
```
[server1]# psql -U postgres -p 5432
postgres=# SET password_encryption = 'scram-sha-256';
postgres=# CREATE ROLE pgpool WITH LOGIN;
postgres=# CREATE ROLE repl WITH REPLICATION LOGIN;
postgres=# \password pgpool
postgres=# \password repl
postgres=# \password postgres

//If you want to show "replication_state" and "replication_sync_state" column in SHOW POOL NODES command result, role pgpool needs to be PostgreSQL super user or or in pg_monitor group (Pgpool-II 4.1 or later). Grant pg_monitor to pgpool:
GRANT pg_monitor TO pgpool;
```

##### 2.2.1.5 enable scram-sha-256 authentication method
Assuming that all the Pgpool-II servers and the PostgreSQL servers are in the same subnet and edit pg_hba.conf to enable scram-sha-256 authentication method.
```
vi /lyhistory/workspace/postgres/data/pg_hba.conf 
host    all             all             samenet                 scram-sha-256
     host    replication     all             samenet                 scram-sha-256
```

##### 2.2.1.6 passwordless SSH 
To use the automated failover and online recovery of Pgpool-II, the settings that allow passwordless SSH to all backend servers between Pgpool-II execution user (default root user) and postgres user and between postgres user and postgres user are necessary. Execute the following command on all servers to set up passwordless SSH. The generated key file name is id_rsa_pgpool.
```
[all servers]# cd ~/.ssh
[all servers]# ssh-keygen -t rsa -f id_rsa_pgpool
[all servers]# ssh-copy-id -i id_rsa_pgpool.pub postgres@server1
[all servers]# ssh-copy-id -i id_rsa_pgpool.pub postgres@server2
[all servers]# ssh-copy-id -i id_rsa_pgpool.pub postgres@server3

[all servers]# su - postgres
[all servers]$ cd ~/.ssh
[all servers]$ ssh-keygen -t rsa -f id_rsa_pgpool
[all servers]$ ssh-copy-id -i id_rsa_pgpool.pub postgres@server1
[all servers]$ ssh-copy-id -i id_rsa_pgpool.pub postgres@server2
[all servers]$ ssh-copy-id -i id_rsa_pgpool.pub postgres@server3

test:
ssh postgres@serverX -i ~/.ssh/id_rsa_pgpool
```

##### 2.2.1.7 allow repl user without specifying password for streaming replication and online recovery

```
[all servers]# su - postgres
[all servers]$ vi /var/lib/pgsql/.pgpass
server1:5432:replication:repl:<repl user password>
server2:5432:replication:repl:<repl user passowrd>
server3:5432:replication:repl:<repl user passowrd>
server1:5432:postgres:postgres:<postgres user passowrd>
server2:5432:postgres:postgres:<postgres user passowrd>
server3:5432:postgres:postgres:<postgres user passowrd>
[all servers]$ chmod 600  /var/lib/pgsql/.pgpass
    
```

##### 2.2.1.8 firewall for postgres
```
[all servers]# firewall-cmd --permanent --zone=public --add-service=postgresql
[all servers]# firewall-cmd --reload
```

##### 2.2.1.9 Summary

| **Item**             | **Value**                   | **Detail**                |
| -------------------- | --------------------------- | ------------------------- |
| PostgreSQL  Version  | 12.7                        | -                         |
| port                 | 5432                        | -                         |
| $PGDATA              | /apex/ngs/svl/postgres/data | -                         |
| Archive  mode        | on                          | /var/lib/pgsql/archivedir |
| Replication  Slots   | Enable ?                    | -                         |
| Start  automatically | Disable                     | -                         |

#### 2.2.2 Setup Pgpool-II+Watchdog

##### 2.2.2.1 Install Pgpool-II
```
# yum install http://www.pgpool.net/yum/rpms/4.1/redhat/rhel-7-x86_64/pgpool-II-release-4.1-1.noarch.rpm
# yum install pgpool-II-pg11-*
```
##### 2.2.2.2 Pgpool-II Configuration for streaming replicaton mode
**Common Config**
```
$ cp -p /etc/pgpool-II/pgpool.conf.sample-stream /etc/pgpool-II/pgpool.conf

listen_addresses = '*'
#Specify replication delay check user and password
sr_check_user = 'pgpool'
sr_check_password = ''

#Enable health check so that Pgpool-II performs failover
health_check_period = 5
# Health check period
# Disabled (0) by default
health_check_timeout = 30
# Health check timeout
# 0 means no timeout
health_check_user = 'pgpool'
health_check_password = ''

health_check_max_retries = 3

#Specify the PostgreSQL backend informations
# - Backend Connection Settings -

backend_hostname0 = 'server1'
# Host name or IP address to connect to for backend 0
backend_port0 = 5432
# Port number for backend 0
backend_weight0 = 1
# Weight for backend 0 (only in load balancing mode)
backend_data_directory0 = '/var/lib/pgsql/11/data'
# Data directory for backend 0
backend_flag0 = 'ALLOW_TO_FAILOVER'
# Controls various backend behavior
# ALLOW_TO_FAILOVER or DISALLOW_TO_FAILOVER
backend_hostname1 = 'server2'
backend_port1 = 5432
backend_weight1 = 1
backend_data_directory1 = '/var/lib/pgsql/11/data'
backend_flag1 = 'ALLOW_TO_FAILOVER'

backend_hostname2 = 'server3'
backend_port2 = 5432
backend_weight2 = 1
backend_data_directory2 = '/var/lib/pgsql/11/data'
backend_flag2 = 'ALLOW_TO_FAILOVER'

//To show "replication_state" and "replication_sync_state" column in SHOW POOL NODES command result, backend_application_name parameter is required
backend_application_name0 = 'server1'
...
backend_application_name1 = 'server2'
...
backend_application_name2 = 'server3'
```

**Failover configuration**
```
failover_command = '/etc/pgpool-II/failover.sh %d %h %p %D %m %H %M %P %r %R %N %S'
follow_master_command = '/etc/pgpool-II/follow_master.sh %d %h %p %D %m %M %H %P %r %R'


$ cp /etc/pgpool-II/failover.sh.sample /etc/pgpool-II/failover.sh
$ vi /etc/pgpool-II/follow_master.sh.sample  /etc/pgpool-II/follow_master.sh
$ chmod +x /etc/pgpool-II/{failover.sh,follow_master.sh}
```

**Pgpool-II Online Recovery Configurations**
```
$vim /etc/pgpool-II/pgpool.conf

recovery_user = 'postgres'
# Online recovery user
recovery_password = ''
# Online recovery password

recovery_1st_stage_command = 'recovery_1st_stage'

[server1]# su - postgres
[server1]$ vi /var/lib/pgsql/11/data/recovery_1st_stage
[server1]$ vi /var/lib/pgsql/11/data/pgpool_remote_start
[server1]$ chmod +x /var/lib/pgsql/11/data/{recovery_1st_stage,pgpool_remote_start}

```
##### 2.2.2.3 install pgpool_recovery
In order to use the online recovery functionality, the functions of pgpool_recovery, pgpool_remote_start, pgpool_switch_xlog are required, so we need install pgpool_recovery on template1 of PostgreSQL server server1.
```
[server1]# su - postgres
[server1]$ psql template1 -c "CREATE EXTENSION pgpool_recovery"
```

##### 2.2.2.4 Client Authentication Configuration
Because in the section Before Starting, we already set PostgreSQL authentication method to scram-sha-256, it is necessary to set a client authentication by Pgpool-II to connect to backend nodes
```
vim /etc/pgpool-II/pool_hba.conf
enable_pool_hba = on
host    all         pgpool           0.0.0.0/0          scram-sha-256
host    all         postgres         0.0.0.0/0          scram-sha-256

//The default password file name for authentication is pool_passwd. To use scram-sha-256 authentication, the decryption key to decrypt the passwords is required. We create the .pgpoolkey file in root user's home directory.
[all servers]# echo 'some string' > ~/.pgpoolkey 
[all servers]# chmod 600 ~/.pgpoolkey

//Execute command pg_enc -m -k /path/to/.pgpoolkey -u username -p to regist user name and AES encrypted password in file pool_passwd.
[all servers]# pg_enc -m -k /root/.pgpoolkey -u pgpool -p
db password: [pgpool user's password]
[all servers]# pg_enc -m -k /root/.pgpoolkey -u postgres -p
db password: [postgres user's passowrd]

# cat /etc/pgpool-II/pool_passwd 
pgpool:AESheq2ZMZjynddMWk5sKP/Rw==
postgres:AESHs/pWL5rtXy2IwuzroHfqg==
```

##### 2.2.2.5 Watchdog Configuration
```
//Enable watchdog functionality on server1, server2, server3.
   use_watchdog = on
//Specify virtual IP address that accepts connections from clients on server1, server2, server3
   delegate_IP = '192.168.137.150'
//To bring up/down the virtual IP and send the ARP requests, we set if_up_cmd, if_down_cmd and arping_cmd. The network interface used in this example is "enp0s8". Since root privilege is required to execute if_up/down_cmd or arping_cmd command, use setuid on these command or allow Pgpool-II startup user, postgres user (Pgpool-II 4.1 or later) to run sudo command without a password. If installed from RPM, the postgres user has been configured to run ip/arping via sudo without a password.
if_up_cmd = '/usr/bin/sudo /sbin/ip addr add $_IP_$/24 dev enp0s8 label enp0s8:0'
if_down_cmd = '/usr/bin/sudo /sbin/ip addr del $_IP_$/24 dev enp0s8'
arping_cmd = '/usr/bin/sudo /usr/sbin/arping -U $_IP_$ -w 1 -I enp0s8'

//Set if_cmd_path and arping_path according to the command path. If if_up/down_cmd or arping_cmd starts with "/", these parameters will be ignored.
if_cmd_path = '/sbin'
arping_path = '/usr/sbin'
   
//Specify the hostname and port number of each Pgpool-II server.
server1

      wd_hostname = 'server1'
      wd_port = 9000
     
server2

      wd_hostname = 'server2'
      wd_port = 9000
     
server3

      wd_hostname = 'server3'
      wd_port = 9000

//Specify the hostname, Pgpool-II port number, and watchdog port number of monitored Pgpool-II servers on each Pgpool-II server.

server1

      # - Other pgpool Connection Settings -

      other_pgpool_hostname0 = 'server2'
      # Host name or IP address to connect to for other pgpool 0
      # (change requires restart)
      other_pgpool_port0 = 9999
      # Port number for other pgpool 0
      # (change requires restart)
      other_wd_port0 = 9000
      # Port number for other watchdog 0
      # (change requires restart)
      other_pgpool_hostname1 = 'server3'
      other_pgpool_port1 = 9999
      other_wd_port1 = 9000
     
server2

      # - Other pgpool Connection Settings -

      other_pgpool_hostname0 = 'server1'
      # Host name or IP address to connect to for other pgpool 0
      # (change requires restart)
      other_pgpool_port0 = 9999
      # Port number for other pgpool 0
      # (change requires restart)
      other_wd_port0 = 9000
      # Port number for other watchdog 0
      # (change requires restart)
      other_pgpool_hostname1 = 'server3'
      other_pgpool_port1 = 9999
      other_wd_port1 = 9000
     
server3

      # - Other pgpool Connection Settings -

      other_pgpool_hostname0 = 'server1'
      # Host name or IP address to connect to for other pgpool 0
      # (change requires restart)
      other_pgpool_port0 = 9999
      # Port number for other pgpool 0
      # (change requires restart)
      other_wd_port0 = 9000
      # Port number for other watchdog 0
      # (change requires restart)
      other_pgpool_hostname1 = 'server2'
      other_pgpool_port1 = 9999
      other_wd_port1 = 9000

//Specify the hostname and port number of destination for sending heartbeat signal on server1, server2, server3.
server1

      heartbeat_destination0 = 'server2'
      # Host name or IP address of destination 0
      # for sending heartbeat signal.
      # (change requires restart)
      heartbeat_destination_port0 = 9694
      # Port number of destination 0 for sending
      # heartbeat signal. Usually this is the
      # same as wd_heartbeat_port.
      # (change requires restart)
      heartbeat_device0 = ''
      # Name of NIC device (such like 'eth0')
      # used for sending/receiving heartbeat
      # signal to/from destination 0.
      # This works only when this is not empty
      # and pgpool has root privilege.
      # (change requires restart)

      heartbeat_destination1 = 'server3'
      heartbeat_destination_port1 = 9694
      heartbeat_device1 = ''
     
server2

      heartbeat_destination0 = 'server1'
      # Host name or IP address of destination 0
      # for sending heartbeat signal.
      # (change requires restart)
      heartbeat_destination_port0 = 9694
      # Port number of destination 0 for sending
      # heartbeat signal. Usually this is the
      # same as wd_heartbeat_port.
      # (change requires restart)
      heartbeat_device0 = ''
      # Name of NIC device (such like 'eth0')
      # used for sending/receiving heartbeat
      # signal to/from destination 0.
      # This works only when this is not empty
      # and pgpool has root privilege.
      # (change requires restart)

      heartbeat_destination1 = 'server3'
      heartbeat_destination_port1 = 9694
      heartbeat_device1 = ''
     
server3

      heartbeat_destination0 = 'server1'
      # Host name or IP address of destination 0
      # for sending heartbeat signal.
      # (change requires restart)
      heartbeat_destination_port0 = 9694
      # Port number of destination 0 for sending
      # heartbeat signal. Usually this is the
      # same as wd_heartbeat_port.
      # (change requires restart)
      heartbeat_device0 = ''
      # Name of NIC device (such like 'eth0')
      # used for sending/receiving heartbeat
      # signal to/from destination 0.
      # This works only when this is not empty
      # and pgpool has root privilege.
      # (change requires restart)

      heartbeat_destination1 = 'server2'
      heartbeat_destination_port1 = 9694
      heartbeat_device1 = ''
     
```
##### 2.2.2.6 Logging
```
log_destination = 'syslog'
    # Where to log
    # Valid values are combinations of stderr,
    # and syslog. Default to stderr.

    syslog_facility = 'LOCAL1'
    # Syslog local facility. Default to LOCAL0
   
[all servers]# mkdir /var/log/pgpool-II
    [all servers]# touch /var/log/pgpool-II/pgpool.log
   
[all servers]# vi /etc/rsyslog.conf
    ...
    *.info;mail.none;authpriv.none;cron.none;LOCAL1.none    /var/log/messages
    LOCAL1.*                                                /var/log/pgpool-II/pgpool.log
[all servers]# vi /etc/logrotate.d/syslog
    ...
    /var/log/messages
    /var/log/pgpool-II/pgpool.log
    /var/log/secure
   
[all servers]# systemctl restart rsyslog
```
##### 2.2.2.7 PCP Command Configuration
```
//Since user authentication is required to use the PCP command, specify user name and md5 encrypted password in pcp.conf. Here we create the encrypted password for pgpool user, and add "username:encrypted password" in /etc/pgpool-II/pcp.conf.
[all servers]# echo 'pgpool:'`pg_md5 PCP passowrd` >> /etc/pgpool-II/pcp.conf
```
##### 2.2.2.8 .pcppass
```
//Since follow_master_command script has to execute PCP command without entering the password, we create .pcppass in the home directory of Pgpool-II startup user (root user).
[all servers]# echo 'localhost:9898:pgpool:pgpool' > ~/.pcppass
    [all servers]# chmod 600 ~/.pcppass
```
##### 2.2.2.9 other
```
//If you want to ignore the pgpool_status file at startup of Pgpool-II, add "- D" to the start option OPTS to /etc/sysconfig/pgpool.
[all servers]# vi /etc/sysconfig/pgpool 
    ...
    OPTS=" -D -n"
```
##### 2.2.2.10 firewall for Pgpool-II
```
[all servers]# firewall-cmd --permanent --zone=public --add-port=9999/tcp --add-port=9898/tcp --add-port=9000/tcp  --add-port=9694/udp
[all servers]# firewall-cmd --reload
```

##### 2.2.2.11 Summary

| **Item**              | **Value**                                           | **Detail**                                                 |
| --------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Pgpool-II  Version    | 4.1.1                                               | -                                                          |
| port                  | 9999                                                | Pgpool-II  accepts connections                             |
| 9898                  | PCP  process accepts connections                    |                                                            |
| 9000                  | watchdog  accepts connections                       |                                                            |
| 9694                  | UDP  port for receiving Watchdog's heartbeat signal |                                                            |
| Config  file          | /etc/pgpool-II/pgpool.conf                          | Pgpool-II  config file                                     |
| Pgpool-II  start user | postgres  (Pgpool-II 4.1 or later)                  | Pgpool-II  4.0 or before, the default startup user is root |
| Running  mode         | streaming  replication mode                         | -                                                          |
| Watchdog              | on                                                  | Life  check method: heartbeat                              |
| Start  automatically  | Disable                                             | -                                                          |
#### 2.2.3 Starting/Stopping Pgpool-II
Before starting Pgpool-II, please start PostgreSQL servers first. Also, when stopping PostgreSQL, it is necessary to stop Pgpool-II first

```
//let's start Pgpool-II on server1, server2, server3
 # systemctl start pgpool.service
```

#### 2.2.4 Set up PostgreSQL standby server

First, we should set up PostgreSQL standby server by using Pgpool-II online recovery functionality. Ensure that recovery_1st_stage and pgpool_remote_start scripts used by pcp_recovery_node command are in database cluster directory of PostgreSQL primary server (server1).
```
# pcp_recovery_node -h 192.168.137.150 -p 9898 -U pgpool -n 1
    Password: 
    pcp_recovery_node -- Command Successful

    # pcp_recovery_node -h 192.168.137.150 -p 9898 -U pgpool -n 2
    Password: 
    pcp_recovery_node -- Command Successful

//After executing pcp_recovery_node command, vertify that server2 and server3 are started as PostgreSQL standby server.
# psql -h 192.168.137.150 -p 9999 -U pgpool postgres -c "show pool_nodes"
    Password for user pgpool
    node_id | hostname | port | status | lb_weight |  role   | select_cnt | load_balance_node | replication_delay | replication_state | replication_sync_state | last_status_change  
    ---------+----------+------+--------+-----------+---------+------------+-------------------+-------------------+-------------------+------------------------+---------------------
    0       | server1  | 5432 | up     | 0.333333  | primary | 0          | false             | 0                 |                   |                        | 2019-08-06 11:13:17
    1       | server2  | 5432 | up     | 0.333333  | standby | 0          | true              | 0                 | streaming         | async                  | 2019-08-06 11:13:25
    2       | server3  | 5432 | up     | 0.333333  | standby | 0          | false             | 0                 | streaming         | async                  | 2019-08-06 11:14:20
    (3 rows)
```
#### 2.2.5 Switching active/standby watchdog
```
//Confirm the watchdog status by using pcp_watchdog_info. The Pgpool-II server which is started first run as MASTER.
  # pcp_watchdog_info -h 192.168.137.150 -p 9898 -U pgpool
    Password: 
    3 YES server1:9999 Linux server1 server1

    server1:9999 Linux server1 server1 9999 9000 4 MASTER  #The Pgpool-II server started first becames "MASTER".
    server2:9999 Linux server2 server2 9999 9000 7 STANDBY #run as standby
    server3:9999 Linux server3 server3 9999 9000 7 STANDBY #run as standby

//Stop active server server1, then server2 or server3 will be promoted to active server. To stop server1, we can stop Pgpool-II service or shutdown the whole system. Here, we stop Pgpool-II service.
[server1]# systemctl stop pgpool.service

    # pcp_watchdog_info -p 9898 -h 192.168.137.150 -U pgpool
    Password: 
    3 YES server2:9999 Linux server2 server2

    server2:9999 Linux server2 server2 9999 9000 4 MASTER     #server2 is promoted to MASTER
    server1:9999 Linux server1 server1 9999 9000 10 SHUTDOWN  #server1 is stopped
    server3:9999 Linux server3 server3 9999 9000 7 STANDBY    #server3 runs as STANDBY
//Start Pgpool-II (server1) which we have stopped again, and vertify that server1 runs as a standby.
[server1]# systemctl start pgpool.service

    [server1]# pcp_watchdog_info -p 9898 -h 192.168.137.150 -U pgpool
    Password: 
    3 YES server2:9999 Linux server2 server2

    server2:9999 Linux server2 server2 9999 9000 4 MASTER
    server1:9999 Linux server1 server1 9999 9000 7 STANDBY
    server3:9999 Linux server3 server3 9999 9000 7 STANDBY

```
#### 2.2.6 Failover
```
//First, use psql to connect to PostgreSQL via virtual IP, and verify the backend informations.
# psql -h 192.168.137.150 -p 9999 -U pgpool postgres -c "show pool_nodes"
    Password for user pgpool:
    node_id | hostname | port | status | lb_weight |  role   | select_cnt | load_balance_node | replication_delay | replication_state | replication_sync_state | last_status_change  
    ---------+----------+------+--------+-----------+---------+------------+-------------------+-------------------+-------------------+------------------------+---------------------
    0       | server1  | 5432 | up     | 0.333333  | primary | 0          | false             | 0                 |                   |                        | 2019-08-06 11:13:17
    1       | server2  | 5432 | up     | 0.333333  | standby | 0          | true              | 0                 | streaming         | async                  | 2019-08-06 11:13:25
    2       | server3  | 5432 | up     | 0.333333  | standby | 0          | false             | 0                 | streaming         | async                  | 2019-08-06 11:14:20
    (3 rows)

//Next, stop primary PostgreSQL server server1, and verify automatic failover.

    [server1]$ pg_ctl -D /var/lib/pgsql/11/data -m immediate stop
//After stopping PostgreSQL on server1, failover occurs and PostgreSQL on server2 becomes new primary DB.

    # psql -h 192.168.137.150 -p 9999 -U pgpool postgres -c "show pool_nodes"
    Password for user pgpool:
    node_id | hostname | port | status | lb_weight |  role   | select_cnt | load_balance_node | replication_delay | replication_state | replication_sync_state | last_status_change  
    ---------+----------+------+--------+-----------+---------+------------+-------------------+-------------------+-------------------+------------------------+---------------------
    0       | server1  | 5432 | down   | 0.333333  | standby | 0          | false             | 0                 |                   |                        | 2019-08-06 11:36:03
    1       | server2  | 5432 | up     | 0.333333  | primary | 0          | true              | 0                 |                   |                        | 2019-08-06 11:36:03
    2       | server3  | 5432 | up     | 0.333333  | standby | 0          | false             | 0                 | streaming         | async                  | 2019-08-06 11:36:15
    (3 rows)
//server3 is running as standby of new primary server2.

    [server3]# psql -h server3 -p 5432 -U pgpool postgres -c "select pg_is_in_recovery()"
    pg_is_in_recovery 
    -------------------
    t

    [server2]# psql -h server2 -p 5432 -U pgpool postgres -c "select pg_is_in_recovery()"
    pg_is_in_recovery 
    -------------------
    f

    [server2]# psql -h server2 -p 5432 -U pgpool postgres -c "select * from pg_stat_replication" -x
    -[ RECORD 1 ]----+------------------------------
    pid              | 11059
    usesysid         | 16392
    usename          | repl
    application_name | server3
    client_addr      | 192.168.137.103
    client_hostname  | 
    client_port      | 48694
    backend_start    | 2019-08-06 11:36:07.479161+09
    backend_xmin     | 
    state            | streaming
    sent_lsn         | 0/75000148
    write_lsn        | 0/75000148
    flush_lsn        | 0/75000148
    replay_lsn       | 0/75000148
    write_lag        | 
    flush_lag        | 
    replay_lag       | 
    sync_priority    | 0
    sync_state       | async
    reply_time       | 2019-08-06 11:42:59.823961+09
```

#### 2.2.7 Online Recovery
```
//Here, we use Pgpool-II online recovery functionality to restore server1 (old primary server) as a standby. Before restoring the old primary server, please ensure that recovery_1st_stage and pgpool_remote_start scripts exist in database cluster directory of current primary server server2.
  # pcp_recovery_node -h 192.168.137.150 -p 9898 -U pgpool -n 0
    Password: 
    pcp_recovery_node -- Command Successful
//Then verify that server1 is started as a standby.

    # psql -h 192.168.137.150 -p 9999 -U pgpool postgres -c "show pool_nodes"
    Password for user pgpool:
    node_id | hostname | port | status | lb_weight |  role   | select_cnt | load_balance_node | replication_delay | replication_state | replication_sync_state | last_status_change  
    ---------+----------+------+--------+-----------+---------+------------+-------------------+-------------------+-------------------+------------------------+---------------------
    0       | server1  | 5432 | up     | 0.333333  | standby | 0          | false             | 0                 | streaming         | async                  | 2019-08-06 11:48:05
    1       | server2  | 5432 | up     | 0.333333  | primary | 0          | false             | 0                 |                   |                        | 2019-08-06 11:36:03
    2       | server3  | 5432 | up     | 0.333333  | standby | 0          | true              | 0                 | streaming         | async                  | 2019-08-06 11:36:15
    (3 rows)
```
## pgpool_setup (Streaming replication mode)
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/tutorial.html
```
pgpool_setup


```


## Manage PgPool-II
```

psql -h <VirtualIP> -p 9999 -U pgpool postgres -c "show pool_nodes"

pgbench 

pg_ctl 

pcp_recovery_node 
```

