---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

LINK:	https://github.com/apache/predictionio
	https://predictionio.apache.org
PredicitonIO: Build and Deploy ML Applications in a Fraction of the Time https://www.youtube.com/watch?v=yO0GcgpCyqk&t=2s

![](/docs/docs_image/software/bigdata/machinelearning_pio01.png)

Multiple Events and Multiple Algorithms https://predictionio.apache.org/templates/similarproduct/multi-events-multi-algos/
PredictionIO CLI Cheatsheet actionml.com/docs/pio_cli_cheatsheet
http://blog.monokkel.io/introduction-to-predictionio-by-example/

https://blog.openshift.com/day-4-predictionio-how-to-build-a-blog-recommender/


## 1.Set up(on ubuntu)

### 1.1 Host Selection 

**Run on virtualbox**

Method 1:
Download https://www.virtualbox.org/wiki/Linux_Downloads
Dpkg install 
https://www.virtualbox.org/manual/ch02.html#install-linux-host
Method 2:
https://tecadmin.net/install-oracle-virtualbox-on-ubuntu/

Ref:
[SOLVED] Setting up VirtualBox-5.1 and vboxconfig failing on Fedora24 https://forums.virtualbox.org/viewtopic.php?f=7&t=78826
https://askubuntu.com/questions/900118/vboxdrv-sh-failed-modprobe-vboxdrv-failed-please-use-dmesg-to-find-out-why
https://stegard.net/2016/10/virtualbox-secure-boot-ubuntu-fail/
http://blog.csdn.net/ziven2012/article/details/24244457

https://forums.virtualbox.org/viewtopic.php?f=7&t=77363&p=360166&hilit=ubuntu+modprob#p360166
sudo mokutil --disable-validation
https://wiki.ubuntu.com/SecurityTeam/SecureBoot

Tips:
Sudo apt-get remove virtualbox-{version}
Disable secure boot
www.rodsbooks.com/efi-bootloaders/secureboot.html#disablea
https://askubuntu.com/questions/815252/disabling-uefi-on-a-running-ubuntu-system

**Try run HDP sandbox**
 https://hortonworks.com/downloads/#data-platform

**Run on Docker**

https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#trusty-1404

https://askubuntu.com/questions/938869/docker-run-ubuntu-bin-bash-vs-docker-run-ubuntu

https://stackoverflow.com/questions/39169403/systemd-and-systemctl-within-ubuntu-docker-images

```
Docker images
Docker ps -a
Docker rm ‘’
Docker run -it ‘’ bash
Docker exec -it ‘’ bash
Docker login
Docker pull
```

### 1.2 Install PredictionIO

Tips:
	Refer to other Dockerfile https://github.com/steveny2k/docker-predictionio/blob/master/Dockerfile
	Refer to other pio-env.sh https://github.com/steveny2k/docker-predictionio/blob/master/files/pio-env.sh

#### 1.2.1 try docker images

Failed because of low version, doesn’t match with the template
https://github.com/steveny2k/docker-predictionio (the version not latest)
```
docker run -it -p 8000:8000 steveny/predictionio /bin/bash
pio-start-all
jps -l
Pio status
Apt-get install git
pip install -U setuptools
```
https://github.com/pypa/pip/issues/1064

#### 1.2.2 try local deployment through heroku

Failed because it charges during the process 
https://github.com/heroku/predictionio-buildpack/blob/master/DEV.md
https://github.com/heroku/predictionio-engine-ur
Requirements
●	Heroku account
●	Heroku CLI, command-line tools
●	git

https://dashboard.heroku.com/apps
```
root@be0576bd8d4e:/home/workspace/engine-dir# wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh
root@be0576bd8d4e:/home/workspace/engine-dir/pio-engine-ur# heroku create $ENGINE_NAME
Creating app... !
 ▸	Invalid credentials provided.
Enter your Heroku credentials:
Email: lyhistory@gmail.com
Password: ********
Creating app... done, ⬢ obscure-wave-35511
https://obscure-wave-35511.herokuapp.com/ | https://git.heroku.com/obscure-wave-35511.git
```

#### 1.2.3 Build from src
http://predictionio.incubator.apache.org/install/install-sourcecode/

**1.2.3.1 Install java**

http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
export JAVA_HOME=/usr/local/java/jdk1.8.0_151
export PATH=$JAVA_HOME/bin:$PATH

**1.2.3.2 Install postgresql**

https://www.postgresql.org/download/linux/ubuntu/
How To Install and Use PostgreSQL on Ubuntu 16.04 https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04
https://dba.stackexchange.com/questions/50906/why-wont-postgresql-9-3-start-on-ubuntu
#/etc/init.d/postgresql start
Switch account: su postgres
Postgres
Psql

```
root@be0576bd8d4e:/home/workspace/postgresql# /etc/init.d/postgresql start
 * Starting PostgreSQL 9.6 database server                                                                                                                                                       	[ OK ]
root@be0576bd8d4e:/home/workspace/postgresql# ps -ef | grep post
postgres  6367 	0  0 08:35 ?    	00:00:00 /usr/lib/postgresql/9.6/bin/postgres -D /var/lib/postgresql/9.6/main -c config_file=/etc/postgresql/9.6/main/postgresql.conf
postgres  6369  6367  0 08:35 ?    	00:00:00 postgres: 9.6/main: checkpointer process   
postgres  6370  6367  0 08:35 ?    	00:00:00 postgres: 9.6/main: writer process   
postgres  6371  6367  0 08:35 ?    	00:00:00 postgres: 9.6/main: wal writer process   
postgres  6372  6367  0 08:35 ?    	00:00:00 postgres: 9.6/main: autovacuum launcher process   
postgres  6373  6367  0 08:35 ?    	00:00:00 postgres: 9.6/main: stats collector process   
root  	6387  6332  0 08:36 pts/1	00:00:00 grep --color=auto post
root@be0576bd8d4e:/home/workspace/postgresql# postgres
bash: postgres: command not found
root@be0576bd8d4e:/home/workspace/postgresql# su postgres
postgres@be0576bd8d4e:/home/workspace/postgresql$ psql

```

**1.2.3.3 install PredictionIO**

+ Step 1 make distribution:
```
docker cp /home/lyhistory/Downloads/apache-predictionio-0.12.0-incubating.tar.gz.asc frosty_wescoff:/home/workspace

gpg --import KEYS
gpg --verify apache-predictionio-0.12.0-incubating.tar.gz.asc apache-predictionio-0.12.0-incubating.tar.gz

tar zxvf apache-predictionio-0.12.0-incubating.tar.gz -C ./apache-predictionio-0.12.0-incubating/

export JAVA_HOME=/usr/local/java/jdk1.8.0_151
export PATH=$JAVA_HOME/bin:$PATH
./make-distribution.sh
```
![](/docs/docs_image/software/bigdata/machinelearning_pio02.png)

+ Step 2 Spark config:

http://spark.apache.org/
Spark-2.1.1-bin-hadoop2.6.tgz
PredictionIO-0.12.0-incubating/conf/pio-env.sh and change the SPARK_HOME

+ Step 3 Storage:

1)	Postgresql 9.6 refer to 4.3.2

2)	Mysql
```
Docker pull mysql:5.7		https://hub.docker.com/_/mysql/
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

$PIO_HOME/lib/mysql-connector jar
Create pio db
```
3)	HBase and Elasticsearch 
Elasticsearch-5.5.2.tar.gz:
	PredictionIO-0.12.0-incubating/conf/pio-env.sh and change the PIO_STORAGE_SOURCES_ELASTICSEARCH_HOME
Hbase-1.2.6-bin.tar.gz:
http://www.apache.org/dyn/closer.cgi/hbase/1.2.6/hbase-1.2.6-bin.tar.gz
	PredictionIO-0.12.0-incubating/conf/pio-env.sh and change the PIO_STORAGE_SOURCES_HBASE_HOME
	
Edit PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/conf/hbase-site.xml.
```
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>file:///home/abc/PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/data</value>
  </property>
  <property>
    <name>hbase.zookeeper.property.dataDir</name>
    <value>/home/abc/PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/zookeeper</value>
  </property>
</configuration>

```
Edit PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/conf/hbase-env.sh to set JAVA_HOME for the cluster. For example:

export JAVA_HOME=/usr/local/java/jdk1.8.0_151

```
root@be0576bd8d4e:/home/workspace/apache-predictionio-0.12.0-incubating# PredictionIO-0.12.0-incubating/bin/pio status
[INFO] [Management$] Inspecting PredictionIO...
[INFO] [Management$] PredictionIO 0.12.0-incubating is installed at /home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating
[INFO] [Management$] Inspecting Apache Spark...
[INFO] [Management$] Apache Spark is installed at /home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/vendors/spark-2.1.1-bin-hadoop2.6
[INFO] [Management$] Apache Spark 2.1.1 detected (meets minimum requirement of 1.3.0)
[INFO] [Management$] Inspecting storage backend connections...
[INFO] [Storage$] Verifying Meta Data Backend (Source: ELASTICSEARCH)...
[INFO] [Storage$] Verifying Model Data Backend (Source: LOCALFS)...
[INFO] [Storage$] Verifying Event Data Backend (Source: HBASE)...
[INFO] [Storage$] Test writing to Event Store (App Id 0)...
[INFO] [HBLEvents] The namespace pio_event doesn't exist yet. Creating now...
[INFO] [HBLEvents] The table pio_event:events_0 doesn't exist yet. Creating now...
[INFO] [HBLEvents] Removing table pio_event:events_0...
[INFO] [Management$] Your system is all ready to go.

```

#### 1.2.4 Use existing pio image 

**Step 1: Set static ip**

```
apt-get install openssh-server

Configure Node Networking https://www.swiftstack.com/docs/install/configure_networking.html
cat /etc/network/interfaces
# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

# The primary network interface
auto eth0
iface eth0 inet static
	address 1.2.3.4
	netmask 255.255.255.0
	#network 10.0.0.0
	#broadcast 10.20.130.255
	gateway 1.2.3.254
	dns-nameservers 8.8.8.8
	#dns-domain acme.com
	#dns-search acme.com

```

**Step 2: Setup docker mysql:5.7**

```
Docker pull mysql:5.7

sudo docker run -d --name mysql_dev \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=password \
-d mysql:5.7

sudo docker exec -ti mysql_dev mysql -uroot -ppassword

create database pio DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
CREATE USER 'pio'@'localhost' IDENTIFIED BY 'pio';
CREATE USER 'pio'@'%' IDENTIFIED BY 'pio';
GRANT ALL ON *.* TO 'pio'@'localhost';
GRANT ALL ON *.* TO 'pio'@'%';
flush privileges;

Exit

Reset mysql container:
docker rm -f mysql_dev

```

**Step 3: Setup docker predictionio:0.12.0**

1) Load predictionio image:
```
scp root@10.20.130.83:/root/*.xz ./

pxz -cd ./pio-0.12.0.tar.xz | sudo docker load
```

2) Download sample template - MyRecommendation:
git clone https://github.com/apache/incubator-predictionio-template-recommender.git MyRecommendation

3) Config vendor:
```
scp root@10.20.130.83:/root/*.gz ./
Hbase-1.1.2
Spark-2.1.0-bin-hadoop2.7
zookeeper
```

**Step 4: Run and config PIO**

1) conf/pio-env.sh:
```
sudo docker run -ti -p 7080:7070 -p 8110:8000 \
-v $(readlink -e ~/PIO/vendors):/PredictionIO-0.12.0-incubating/vendors \
-v $(readlink -e ~/MyRecommendation):/MyRecommendation \
--link mysql_dev \
--name pio_$(whoami) \
pio:0.12.0 bash
```

Then check linked folders: MyRecommendation and vendors
Try ping mysql_dev container servicep

Config pio:
```
MYSQL_JDBC_DRIVER=$PIO_HOME/lib/mysql-connector-java-5.1.41.jar
PIO_STORAGE_REPOSITORIES_METADATA_NAME=pio_meta
PIO_STORAGE_REPOSITORIES_METADATA_SOURCE=MYSQL

PIO_STORAGE_REPOSITORIES_EVENTDATA_NAME=pio_event
PIO_STORAGE_REPOSITORIES_EVENTDATA_SOURCE=HBASE

PIO_STORAGE_REPOSITORIES_MODELDATA_NAME=pio_model
PIO_STORAGE_REPOSITORIES_MODELDATA_SOURCE=MYSQL
PIO_STORAGE_SOURCES_MYSQL_TYPE=jdbc
PIO_STORAGE_SOURCES_MYSQL_URL=jdbc:mysql://mysql_dev:3306/pio?autoReconnect=true (here we use the cointainer name instead of ip, if you want to use ip, you can find it by docker inspect mysql_dev)
PIO_STORAGE_SOURCES_MYSQL_USERNAME=pio
PIO_STORAGE_SOURCES_MYSQL_PASSWORD=pio
PIO_STORAGE_SOURCES_HBASE_TYPE=hbase
PIO_STORAGE_SOURCES_HBASE_HOME=$PIO_HOME/vendors/hbase-${HBASE_VERSION}
```

2) start pio and check status

3) new app and import data
```
pio app new MyApp1

curl -i -X POST http://localhost:7070/events.json?accessKey=$ACCESS_KEY \
-H "Content-Type: application/json" \
-d '{
  "event" : "rate",
  "entityType" : "user",
  "entityId" : "u0",
  "targetEntityType" : "item",
  "targetEntityId" : "i0",
  "properties" : {
    "rating" : 5
  }
  "eventTime" : "2014-11-02T09:39:45.618-08:00"
}'

curl -i -X POST http://localhost:7070/events.json?accessKey=$ACCESS_KEY \
-H "Content-Type: application/json" \
-d '{
  "event" : "buy",
  "entityType" : "user",
  "entityId" : "u1",
  "targetEntityType" : "item",
  "targetEntityId" : "i2",
  "eventTime" : "2014-11-10T12:34:56.123-08:00"
}'

curl -i -X GET "http://localhost:7070/events.json?accessKey=$ACCESS_KEY"

curl https://raw.githubusercontent.com/apache/spark/master/data/mllib/sample_movielens_data.txt --create-dirs -o data/sample_movielens_data.txt
python data/import_eventserver.py --access_key $ACCESS_KEY

http://10.20.130.54:7080/events.json?accessKey=VDKnyk6NsoztkfoJCRD0Ym--gn6mgP78jtaOvGQjJHWVCPk_3MNUYOTas-pVyAm3
```

**Step 5: build and deploy**
```
Pio build --verbose
Pio train
Pio deploy
```

## 2. Quick start predictionio

http://predictionio.incubator.apache.org/templates/recommendation/quickstart/

PATH=$PATH:/home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/bin; export PATH

HBASE SHELL
http://hbase.apache.org/book.html#quickstart
http://www.tutorialspoint.com/hbase/hbase_shell.htm

Elasticsearch
https://www.elastic.co/guide/en/elasticsearch/hadoop/master/configuration.html#cfg-network

```
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# pio app new MyApp1
[INFO] [HBLEvents] The table pio_event:events_1 doesn't exist yet. Creating now...
[INFO] [App$] Initialized Event Store for this app ID: 1.
[INFO] [Pio$] Created a new app:
[INFO] [Pio$]   	Name: MyApp1
[INFO] [Pio$]     	ID: 1
[INFO] [Pio$] Access Key: UyQifiuvbOYcOJJArkNZZ6HJYQoD-FhiO22Bvk19zsy7RLo4EuLUkEe_PWPNNz5N
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation#

ACCESS_KEY=UyQifiuvbOYcOJJArkNZZ6HJYQoD-FhiO22Bvk19zsy7RLo4EuLUkEe_PWPNNz5N

root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl -i -X POST http://localhost:7070/events.json?accessKey=$ACCESS_KEY \
> -H "Content-Type: application/json" \
> -d '{
>   "event" : "rate",
>   "entityType" : "user",
>   "entityId" : "u0",
>   "targetEntityType" : "item",
>   "targetEntityId" : "i0",
>   "properties" : {
> 	"rating" : 5
>   }
>   "eventTime" : "2014-11-02T09:39:45.618-08:00"
> }'
HTTP/1.1 201 Created
Server: spray-can/1.3.3
Date: Sun, 12 Nov 2017 13:34:55 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 57

{"eventId":"illrLcpg1dDE2bvZZ1NpggAAAUlxl11SrFjDLEi9C6A"}root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl -i -X GET "http://localhost:7070/events.json?accessKey=$ACCESS_KEY"
HTTP/1.1 200 OK
Server: spray-can/1.3.3
Date: Sun, 12 Nov 2017 13:35:35 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 270

[{"eventId":"illrLcpg1dDE2bvZZ1NpggAAAUlxl11SrFjDLEi9C6A","event":"rate","entityType":"user","entityId":"u0","targetEntityType":"item","targetEntityId":"i0","properties":{"rating":5},"eventTime":"2014-11-02T09:39:45.618-08:00","creationTime":"2017-11-12T13:34:54.933Z"}]root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation#
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl -i -X POST http://localhost:7070/events.json?accessKey=$ACCESS_KEY \
> -H "Content-Type: application/json" \
> -d '{
>   "event" : "buy",
>   "entityType" : "user",
>   "entityId" : "u1",
>   "targetEntityType" : "item",
>   "targetEntityId" : "i2",
>   "eventTime" : "2014-11-10T12:34:56.123-08:00"
> }'
HTTP/1.1 201 Created
Server: spray-can/1.3.3
Date: Sun, 12 Nov 2017 13:36:09 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 57

{"eventId":"Z0813DMQIKz7N4VGxZhmngAAAUmbap37v3QoMu7STuI"}root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl -i -X POST http://localhost:7070/events.json?accessKey=$ACCESS_KEY -H "Content-root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl -i -X GET "http://localhost:7070/events.json?accessKey=$ACCESS_KEY"
HTTP/1.1 200 OK
Server: spray-can/1.3.3
Date: Sun, 12 Nov 2017 13:36:15 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 528

[{"eventId":"Z0813DMQIKz7N4VGxZhmngAAAUmbap37v3QoMu7STuI","event":"buy","entityType":"user","entityId":"u1","targetEntityType":"item","targetEntityId":"i2","properties":{},"eventTime":"2014-11-10T12:34:56.123-08:00","creationTime":"2017-11-12T13:36:08.992Z"},{"eventId":"illrLcpg1dDE2bvZZ1NpggAAAUlxl11SrFjDLEi9C6A","event":"rate","entityType":"user","entityId":"u0","targetEntityType":"item","targetEntityId":"i0","properties":{"rating":5},"eventTime":"2014-11-02T09:39:45.618-08:00","creationTime":"2017-11-12T13:34:54.933Z"}]root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation#
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation#

```

http://172.17.0.2:7070/events.json?accessKey=UyQifiuvbOYcOJJArkNZZ6HJYQoD-FhiO22Bvk19zsy7RLo4EuLUkEe_PWPNNz5N

![](/docs/docs_image/software/bigdata/machinelearning_pio03.png)

**interact with python sdk**

```
Install python
apt-get install -y python-pip
pip install --upgrade pip
pip install -U setuptools
Install python sdk
pip install predictionio

Import data:
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# curl https://raw.githubusercontent.com/apache/spark/master/data/mllib/sample_movielens_data.txt --create-dirs -o data/sample_movielens_data.txt
  % Total	% Received % Xferd  Average Speed   Time	Time 	Time  Current
                             	Dload  Upload   Total   Spent	Left  Speed
100 14351  100 14351	0 	0  17275  	0 --:--:-- --:--:-- --:--:-- 17290
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# ls
LICENSE.txt  README.md  build.sbt  data  engine.json  project  src  template.json
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# ls
LICENSE.txt  README.md  build.sbt  data  engine.json  project  src  template.json
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# ls -l
total 40
-rw-r--r-- 1 root root 11358 Nov 12 13:17 LICENSE.txt
-rw-r--r-- 1 root root  1233 Nov 12 13:17 README.md
-rw-r--r-- 1 root root   280 Nov 12 13:17 build.sbt
drwxr-xr-x 2 root root  4096 Nov 12 14:09 data
-rw-r--r-- 1 root root   384 Nov 12 13:17 engine.json
drwxr-xr-x 2 root root  4096 Nov 12 13:17 project
drwxr-xr-x 3 root root  4096 Nov 12 13:17 src
-rw-r--r-- 1 root root	53 Nov 12 13:17 template.json
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation# python data/import_eventserver.py --access_key $ACCESS_KEY
Namespace(access_key='UyQifiuvbOYcOJJArkNZZ6HJYQoD-FhiO22Bvk19zsy7RLo4EuLUkEe_PWPNNz5N', file='./data/sample_movielens_data.txt', url='http://localhost:7070')
Importing data...
1501 events are imported.
root@be0576bd8d4e:/home/workspace/engine-dir/MyRecommendation#

pio build --verbose
pio train
```

To get the docker container ip address
docker inspect ForPredictionIO

![](/docs/docs_image/software/bigdata/machinelearning_pio04.png)
![](/docs/docs_image/software/bigdata/machinelearning_pio05.png)
```
docker container commit ForPredictionIO lyhistory/predictionio-0.12.0:deployed
docker push lyhistory/predictionio-0.12.0:deployed
docker save lyhistory/predictionio-0.12.0:deployed > /home/lyhistory/workspace/lyhistory_predictionio-0.12.0_tag_deployed.tar
Pxz ***.tar  -- to make the size smaller
```

## 3. Developement
IDE
https://www.jetbrains.com/help/idea/installing-and-launching.html

```
vi PredictionIO-0.12.0-incubating/conf/pio-env.sh

PredictionIO-0.12.0-incubating/bin/pio-start-all
PredictionIO-0.12.0-incubating/bin/pio-stop-all
PredictionIO-0.12.0-incubating/bin/pio status

/opt/idea-IC-172.4343.14/bin/idea.sh
```
![](/docs/docs_image/software/bigdata/machinelearning_pio06.png)


## 4. TroubleShooting

Basic idea:
	Refer to other people’s setting, for example docker images settings
	Check the log for detailed info
	Make sure the service has been started

### 4.1 jps not a command
export JAVA_HOME=/usr/local/java/jdk1.8.0_151
export PATH=$JAVA_HOME/bin:$PATH
Or because hbase not running properly, restart it.

### 4.2 connection refused
Check service status, find elasticsearch not running, then go to check the log:
Cat ~/pio.log

Go to check :
cat PredictionIO-0.12.0-incubating/vendors/elasticsearch-5.5.2/logs/predictionio.log

And then try manually start elasticsearch
PredictionIO-0.12.0-incubating/vendors/elasticsearch-5.5.2/bin/elasticsearch
Get the same error -- details

When using the root user, Elasticsearch cannot be started due to "don't run elasticsearch as root"

Then try this solution:
Run ElasticSearch 5 as Root
http://www.peecy.org/run-elasticsearch-5-as-root/

```
git clone -b v5.5.2 https://github.com/elastic/elasticsearch.git
vi core/src/main/java/org/elasticsearch/bootstrap/Bootstrap.java
wget https://services.gradle.org/distributions/gradle-3.4-all.zip
unzip gradle-3.4-all.zip
export GRADLE_HOME=~/tmp/gradle-3.4
export PATH=${GRADLE_HOME}/bin:${PATH}
gradle assemble
```

Build failed, upgrade gradle
https://services.gradle.org/distributions/

gradle assemble build error
Upgrade gradle version

How to clear gradle cache? 
Rm -r .gradle/
https://stackoverflow.com/questions/23025433/how-to-clear-gradle-cache

cp /home/workspace/elasticsearch/distribution/tar/build/distributions/elasticsearch-5.5.2-SNAPSHOT.tar.gz .

tar zxvfC elasticsearch-5.5.2-SNAPSHOT.tar.gz PredictionIO-0.12.0-incubating/vendors/
Try to run it 
PredictionIO-0.12.0-incubating/vendors/elasticsearch-5.5.2-SNAPSHOT/bin/elasticsearch

Failed to connect to localhost port 9200
Sometimes it may happen that:
This error is normal in the beginning since it takes a bit for elasticsearch to start up.
But eventually it will go away.
If the problem persists, please attach the entire output so that I can see what is wrong.

### 4.3 host machine run out space
The host is ubuntu, and docker defalut location/storage is in ‘/’ folder, but initially I only allocated 20 G to ‘/’, 
So I have to use Gparted(Live CD) to do resize, it’s very dangerous to move unallocated space around /boot, so you need to prepared to fix the booting issue, check https://gparted.org/faq.php
So finally I resize ‘/’ to 70G
Another lesson here is try to set the docker default location to /home, as normally we will allocate very large space to /home
https://stackoverflow.com/questions/19234831/where-are-docker-images-stored-on-the-host-machine


### 4.4 others:
Key not found PIO_STORAGE_SOURCES__TYPE 
Wrong spelling, case sensitive

run firefox
```
root@be0576bd8d4e:/usr/bin# firefox
Error: GDK_BACKEND does not match available displays
https://linuxmeerkat.wordpress.com/2014/10/17/running-a-gui-application-in-a-docker-container/

apt-get install xvfb

root@be0576bd8d4e:/usr/bin# Xvfb :1 -screen 0 1024x768x16 &> xvfb.log  &
[1] 4113
root@be0576bd8d4e:/usr/bin# ps aux | grep X
root   	705  0.9 14.6 5774512 2386180 pts/1 Sl   13:02   0:31 /usr/local/java/jdk1.8.0_151/bin/java -Xms2g -Xmx2g -XX:+UseConcMarkSweepGC -XX:CMSInitiatingOccupancyFraction=75 -XX:+UseCMSInitiatingOccupancyOnly -XX:+AlwaysPreTouch -server -Xss1m -Djava.awt.headless=true -Dfile.encoding=UTF-8 -Djna.nosys=true -Djdk.io.permissionsUseCanonicalPath=true -Dio.netty.noUnsafe=true -Dio.netty.noKeySetOptimization=true -Dio.netty.recycler.maxCapacityPerThread=0 -Dlog4j.shutdownHookEnabled=false -Dlog4j2.disable.jmx=true -Dlog4j.skipJansi=true -XX:+HeapDumpOnOutOfMemoryError -Des.path.home=/home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/vendors/elasticsearch-5.5.2-SNAPSHOT -cp /home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/vendors/elasticsearch-5.5.2-SNAPSHOT/lib/* org.elasticsearch.bootstrap.Elasticsearch -d -p /home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/es.pid
root   	806  1.0  1.9 6106224 321684 pts/1  Sl   13:02   0:33 /usr/local/java/jdk1.8.0_151/bin/java -Dproc_master -XX:OnOutOfMemoryError=kill -9 %p -XX:+UseConcMarkSweepGC -XX:PermSize=128m -XX:MaxPermSize=128m -Dhbase.log.dir=/home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/bin/../logs -Dhbase.log.file=hbase--master-be0576bd8d4e.log -Dhbase.home.dir=/home/workspace/apache-predictionio-0.12.0-incubating/PredictionIO-0.12.0-incubating/vendors/hbase-1.2.6/bin/.. -Dhbase.id.str= -Dhbase.root.logger=INFO,RFA -Dhbase.security.logger=INFO,RFAS org.apache.hadoop.hbase.master.HMaster start
root  	4113  0.3  0.2 215656 32832 pts/2	Sl   13:57   0:00 Xvfb :1 -screen 0 1024x768x16
root  	4121  0.0  0.0  11284   968 pts/2	S+   13:57   0:00 grep --color=auto X
root@be0576bd8d4e:/usr/bin#
```
Build error:
Scala version
https://stackoverflow.com/questions/42622587/no-engine-found-your-build-might-have-failed-aborting-predictionio
Predictionio version and template version

Hadoop: Cannot use Jps command https://stackoverflow.com/questions/11738070/hadoop-cannot-use-jps-command
https://medium.com/@nidhisatrawala1992/thank-you-vaghawan-ojha-7afaea05a27d

<disqus/>