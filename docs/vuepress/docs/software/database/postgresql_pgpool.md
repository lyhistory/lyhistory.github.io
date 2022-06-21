
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/index.html

Pgpool-II

## What is

Pgpool-II is a proxy software that sits between PostgreSQL servers and a PostgreSQL database client. It provides the following features:

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

## Restrictions
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/restrictions.html

## Knowledge base
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/admin.html

### Installation of Pgpool-II

**install from source or rpm**

build from source: https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/install-requirements.html

install from rpm:
```
yum install http://www.pgpool.net/yum/rpms/4.0/redhat/rhel-7-x86_64/pgpool-II-release-4.0-1.noarch.rpm
yum install pgpool-II-pg11

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



### Configuration(Server Setup and Operation)

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

### Watchdog
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

### Server Configuration
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

### Client Authentication
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/client-authentication.html

The pool_hba.conf File

Authentication Methods

Using different methods for frontend and backend authentication

Using AES256 encrypted passwords in pool_passwd

### Performance Considerations
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/performance.html


## Pgpool-II + Watchdog Setup Example
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/example-configs.html

### Single Node
```

Installing Pgpool-II

### Configuring Replication

### Watchdog Configuration Example

```

### Cluster Mode

![](https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/cluster_40.gif)
```

```

## Manage a PostgreSQL cluster with streaming replication using Pgpool-II
https://www.pgpool.net/docs/pgpool-II-4.1.0/en/html/tutorial.html

