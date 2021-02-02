---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE

---

[回目录](/docs/software)  《Gitlab Server》

## 1. Architecture

https://docs.gitlab.com/ee/development/architecture.html

https://about.gitlab.com/handbook/engineering/infrastructure/production/architecture/#service-architecture

https://juejin.im/post/5cf67d355188255508118def

完整文档

https://docs.gitlab.com/omnibus/README.html#installation-and-configuration-using-omnibus-package

![](/docs/docs_image/software/project_manage/git/gitlab01.png)



```
sudo gitlab-ctl status
run: alertmanager: (pid 16828) 499486s; run: log: (pid 10270) 584166s
run: gitaly: (pid 15594) 499829s; run: log: (pid 9538) 584281s
run: gitlab-exporter: (pid 15618) 499829s; run: log: (pid 10090) 584184s
run: gitlab-workhorse: (pid 15624) 499828s; run: log: (pid 9929) 584207s
run: grafana: (pid 17718) 498697s; run: log: (pid 10420) 584117s
run: logrotate: (pid 9004) 2937s; run: log: (pid 10015) 584196s
run: nginx: (pid 15677) 499827s; run: log: (pid 9980) 584200s
run: node-exporter: (pid 15689) 499827s; run: log: (pid 10050) 584190s
run: postgres-exporter: (pid 15696) 499826s; run: log: (pid 10299) 584160s
run: postgresql: (pid 15789) 499823s; run: log: (pid 9636) 584274s
run: prometheus: (pid 15805) 499823s; run: log: (pid 10224) 584170s
run: puma: (pid 16874) 499480s; run: log: (pid 9832) 584220s
run: redis: (pid 15829) 499822s; run: log: (pid 9405) 584287s
run: redis-exporter: (pid 15834) 499822s; run: log: (pid 10179) 584178s
run: sidekiq: (pid 16818) 499486s; run: log: (pid 9864) 584214s

[root@sgkc2-cicd-v02 liuyue]# netstat -anp|grep "15789"
unix  2      [ ACC ]     STREAM     LISTENING     1264397  15789/postgres       /var/opt/gitlab/postgresql/.s.PGSQL.5432

一个是Active Internet connections，称为有源TCP连接，其中"Recv-Q"和"Send-Q"指%0A的是接收队列和发送队列。这些数字一般都应该是0。如果不是则表示软件包正在队列中堆积。这种情况只能在非常少的情况见到。

另一个是Active UNIX domain sockets，称为有源Unix域套接口(和网络套接字一样，但是只能用于本机通信，性能可以提高一倍)。
Proto显示连接使用的协议,RefCnt表示连接到本套接口上的进程号,Types显示套接口的类型,State显示套接口当前的状态,Path表示连接到套接口的其它进程使用的路径名。
https://blog.csdn.net/u012598668/java/article/details/40080245
```



接入层

- Nginx：静态 web 服务器

- gitlab-shell：负责处理ssh请求,用于处理 Git 命令和修改 authorized keys 列表

- gitlab-workhorse: 负责处理http/https请求,轻量级的反向代理服务器, gitlab workhorse对于本地静态文件请求（例如浏览器请求的html、js、css文件）会自己处理掉，对于纯git操作请求会转发给gitaly，对于其他动态请求会转发给unicorn处理

  

- unicorn：An HTTP server for Rack applications，GitLab Rails 应用是托管在这个服务器上面的，相当于java里面的tomcat，是一个开源项目

  unicorn就是gitlab的主server程序，它会调用其他各个组件完成复杂的动态请求处理
  https://blog.csdn.net/gg_18826075157/java/article/details/107117595

- logrotate：日志文件管理工具

- sidekiq：用于在后台执行队列任务（异步执行）

  

底层存储：

+ PostgreSQL：类似于mysql，存储业务数据，比如有哪些项目组，某个项目组下有哪些项目，某项目下哪些人有权限等等
+ redis：用于缓存热点数据以及存储异步任务，sidekiq这组件会定期拉取分发异步任务给worker执行
+ gitaly：存储底层代码文件，提供rpc接口对外提供git操作服务



*-exporter+grafana+prometheus: 监控



### 1.1 http/https over nginx:

git request: http://172.26.101.133:8088/root/test-gitaly-cluster.git

user/admin dashboard request: http://172.26.101.133:8088/root/test-gitaly-cluster

grafana request: http://172.26.101.133:8088/-/grafana/?orgId=1

sudo vim /var/opt/gitlab/nginx/conf/nginx.conf

```
upstream gitlab-workhorse {
    server unix:/var/opt/gitlab/gitlab-workhorse/socket;
  }

  include /var/opt/gitlab/nginx/conf/gitlab-http.conf;
```

这个upstream名字是gitlab-workhorse，对应是转发到的地方，这里可以看到是一个unix socket；

再来看include的这个配置文件：

sudo vim /var/opt/gitlab/nginx/conf/gitlab-http.conf

8088是我们在/etc/gitlab/gitlab.rb中reconfigure的外部访问端口，

可以看到proxy_pass将路由匹配到了`http://<upstream name>`也就是`http://gitlab-workhorse`

```
server {
  listen *:8088;


  server_name 172.26.101.134;
  
location / {
    proxy_cache off;
    proxy_pass  http://gitlab-workhorse;
  }

  location /assets {
    proxy_cache gitlab;
    proxy_pass  http://gitlab-workhorse;
  }
  
 location ~ ^/(404|500|502)(-custom)?\.html$ {//特别匹配这么几个错误页面
    root /opt/gitlab/embedded/service/gitlab-rails/public;
    internal; //限制为内部用户
  }
  
 location ~ (.git/git-receive-pack$|.git/info/refs?service=git-receive-pack$|.git/gitlab-lfs/objects|.git/info/lfs/objects/batch$) {
    proxy_cache off;
    proxy_pass http://gitlab-workhorse;
    proxy_request_buffering off;
  }
  location /-/grafana/ {
    proxy_pass http://localhost:3000/;
  }
```

可以看到不管是什么请求（除了grafana和那几个特定的静态页面）都是转给gitlab-workhorse来处理，

https://juejin.im/post/5cf680f86fb9a07ed5248cda

最后再来查查gitlab-workhorse，如下可以看到是监听的正是前面upstream转发的那个/var/opt/gitlab/gitlab-workhorse/socket

然后authBackend对应8080端口，这个可以参考

> ```
> https://gitlab.com/gitlab-org/gitlab-workhorse/blob/master/README.md
> 
> -authBackend string
>    Authentication/authorization backend (default "http://localhost:8080")
> ```

估计应该是API接口

documentRoot前端的对应目录是/opt/gitlab/embedded/service/gitlab-rails/public 

```
[root@sgkc2-cicd-v01 liuyue]# ps -lef | grep "rail"
4 S root      5033 22189  0  80   0 - 28203 pipe_w 14:52 pts/1    00:00:00 grep --color=auto rail
4 S git       6848  6504  0  80   0 - 166286 ep_pol Jun29 ?       00:10:55 /opt/gitlab/embedded/bin/gitlab-workhorse -listenNetwork unix -listenUmask 0 -listenAddr /var/opt/gitlab/gitlab-workhorse/socket -authBackend http://localhost:8080 -authSocket /var/opt/gitlab/gitlab-rails/sockets/gitlab.socket -documentRoot /opt/gitlab/embedded/service/gitlab-rails/public -pprofListenAddr  -prometheusListenAddr localhost:9229 -secretPath /opt/gitlab/embedded/service/gitlab-rails/.gitlab_workhorse_secret -logFormat json -config config.toml
4 S git       7038  6502  0  80   0 - 257481 poll_s Jun29 ?       00:09:25 puma 4.3.3.gitlab.2 (unix:///var/opt/gitlab/gitlab-rails/sockets/gitlab.socket,tcp://127.0.0.1:8080) [gitlab-puma-worker]
4 S git       7056  6503  0  80   0 - 32362 poll_s Jun29 ?        00:00:23 ruby /opt/gitlab/embedded/service/gitlab-rails/bin/sidekiq-cluster -e production -r /opt/gitlab/embedded/service/gitlab-rails -m 50 --timeout 25 *
```



8080这个端口是哪个服务呢

根据 https://docs.gitlab.com/ee/development/architecture.html 架构图，可以看到8080是指向unicorn

但是查一下，可以看到是puma：

```
netstat -anp|grep :8080
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN      7038/puma 4.3.3.git

ps -lef|grep "puma"
4 S root      6502  6498  0  80   0 -  1058 poll_s Jun29 ?        00:00:00 runsv puma
4 S root      6517  6502  0  80   0 -  1094 poll_s Jun29 ?        00:00:00 svlogd -tt /var/log/gitlab/puma
4 S git       6845  6508  4  80   0 - 173898 poll_s Jun29 ?       15:54:47 puma 4.3.3.gitlab.2 (tcp://localhost:9168) [gitlab-exporter]
4 S git       7038  6502  0  80   0 - 257481 poll_s Jun29 ?       00:09:26 puma 4.3.3.gitlab.2 (unix:///var/opt/gitlab/gitlab-rails/sockets/gitlab.socket,tcp://127.0.0.1:8080) [gitlab-puma-worker]
```



https://docs.gitlab.com/ee/administration/operations/unicorn.html#unicorn

> **Note:** Starting with GitLab 13.0, Puma is the default web server used in GitLab all-in-one package based installations as well as GitLab Helm chart deployments.
>
> GitLab uses [Unicorn](https://yhbt.net/unicorn/), a pre-forking Ruby web server, to handle web requests (web browsers and Git HTTP clients). Unicorn is a daemon written in Ruby and C that can load and run a Ruby on Rails application; in our case the Rails application is GitLab Community Edition or GitLab Enterprise Edition.

unicorn是一个开源项目，当unicorn不再满足需求时才引入了puma和workhorse

https://juejin.im/post/5cf6832c51882520724c84ff



### 1.2 ssh over gitlab-shell

git@172.26.101.133:root/test-gitaly-cluster.git



注意安装gitlab后，会创建很多用户

```
vim /etc/passwd
gitlab-www:x:996:993::/var/opt/gitlab/nginx:/bin/false
git:x:995:992::/var/opt/gitlab:/bin/sh
gitlab-redis:x:994:991::/var/opt/gitlab/redis:/bin/false
gitlab-psql:x:993:990::/var/opt/gitlab/postgresql:/bin/sh
gitlab-prometheus:x:992:989::/var/opt/gitlab/prometheus:/bin/sh
```

注意到git用户的home是/var/opt/gitlab，然后从/var/opt/gitlab/gitlab-shell/config.yml可以获取到配置

auth_file: /var/opt/gitlab/.ssh/authorized_keys，打开可以看到

`command="/opt/gitlab/embedded/service/gitlab-shell/bin/gitlab-shell key-1"`

原理就是一句话：ssh可以执行命令 https://research.kudelskisecurity.com/2013/05/14/restrict-ssh-logins-to-a-single-command/

http://williamherry.com/blog/2015/07/19/from-git-push-to-commit-show-on-page/

https://juejin.im/post/5cf686b85188253cec305fa7



my internal sharing talk:

```
I'll give a overview about what we have and how git server works
I believe everyone should be already familiar with git,
Git is a distributed version-control system for tracking changes in source code during software development.
it enables us to collaborate more effiently especially when working remotely on the software project,

//and by integrating with other automation tools like jenkins and others, you can have the ability to Continuous Integration and Continuous Deployment;
actually for some of the git server implementations like gitlab, we notice that it already has built in CICD Solutions, 
but we haven't expolore that portion yet, today we'll only cover the basic usage;

although most of us are familiar with git, but probably limited to the git client, whether it's git commands or gui tools, 
now let's talk about how git server side looks like;

at the start, we set up a standalone git lab server, you can see it is comprised of a lot services, some of the non important services are not listed here;
when the users make a git pull or push through http or ssh, it will go to nginx or gitlab shell respectively, if the git request goes through http request, 
gitlab workhorse will redirect it to unicorn, other request like access to the dashboard or grafana monitor will handled by workhorse itself,
intially there is only unicorn, and then gitlab introduced workhorse to share the load of unicorn, 
unicorn is an open source project, it's a web server in ruby, analogy to tomcat in java;

redis is for cache, postgresql is for the application data storing, sidekiq is for backgroud job, it may be related to the CICD futionality;

the most crital system is gitaly, it's for the git repository storage

as we have very limited internal users, for the high availability concerns, the first thing we need to do is make sure there is no single point of failure
for the gitaly storage, based on the documentation, we come out with this gitaly cluster;

it has a praefect as router between gitlab server and gitaly nodes;
```

## 2. Install 安装(手动)

https://git-scm.com/book/en/v2/Git-on-the-Server-GitLab

ce版本源码：https://gitlab.com/gitlab-org/gitlab-foss/-/tree/master

官方安装文档：https://about.gitlab.com/install/#centos-7

下面采用离线安装 https://docs.gitlab.com/omnibus/manual_install.html

### 2.1 硬件准备

一台Praefect Server（存储空间可以给最低没关系）和三台gitaly server（git高可用的核心服务器，要求high CPU, high memory, fast storage）

挂载磁盘大小需要注意，因为gitlab会写入一些数据到 /var/opt/gitlab，所以如果/var单独挂载需要注意

### 2.2 dependency

```
# open HTTP, HTTPS and SSH access in the system firewall.

sudo yum install -y curl policycoreutils-python openssh-server
sudo systemctl enable sshd
sudo systemctl start sshd
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

# install Postfix to send notification emails.
# If you want to use another solution to send emails please skip this step and configure an external SMTP server after GitLab has been installed.
# 此处我已经忽略，奇怪的是我并没有安装，但是后面却发现postfix不知何时已经运行了，估计是gitlab自己搞的
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
```

### 2.3 rpm安装

```
# GitLab Community Edition
# Debian/Ubuntu
dpkg -i gitlab-ce-<version>.deb

# CentOS/RHEL
rpm -Uvh gitlab-ce-<version>.rpm

下载 https://packages.gitlab.com/gitlab/gitlab-ce

sudo mv gitlab-ce-13.0.7-ce.0.el7.x86_64.rpm /opt/

rpm -ivh gitlab-ce-13.0.7-ce.0.el7.x86_64.rpm 

for firstime install use -i or -U, for upgrade use -U

总结：
cd /opt/
rpm -ivh gitlab-ce-13.0.7-ce.0.el7.x86_64.rpm 
vim /etc/gitlab/gitlab.rb (change external_url="http://172.26.101.133:8088")
sudo gitlab-ctl reconfigure
firewall-cmd --zone=public --add-port=8088/tcp --permanent
firewall-cmd --reload

after all this:
access from your browser
http://172.26.101.133:8088

it will ask for changing password, default username: admin@example.com

```

启动：

sudo gitlab-ctl reconfigure



安装后路径：

/var/opt/gitlab/

/var/opt/gitlab/nginx/conf/gitlab-http.conf

log路径：也是排查错误的路径

/var/log/gitlab/



### 2.4 Configuration

https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md

#### 2.4.1 前端gitlab-server url和api

/etc/gitlab/gitlab.rb

​	change external_url="http://172.26.101.133:8088" 这个端口会写入到/var/opt/gitlab/nginx/conf/gitlab-http.conf

sudo gitlab-ctl reconfigure

注意，刚开始我用了8080，~~刚好跟内置的nginx冲突~~，是跟gitlab-puma-worker冲突，

```
sudo netstat -anp|grep :8080

sudo ps -lef|grep 18251

puma 4.3.3.gitlab.2 (unix:///var/opt/gitlab/gitlab-rails/sockets/gitlab.socket,tcp://127.0.0.1:8080) [gitlab-puma-worker]

```

所以访问出现502 Whoops, GitLab is taking too much time to respond.

只需要换一个端口即可，端口也要开通：

```
firewall-cmd --zone=public --add-port=8088/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-all
firewall-cmd --list-ports
```

**这个reconfigure会将配置进行“分发”，所以后面所有修改配置都要注意优先修改gitlab.rb，而不是直接改具体各个服务的配置：**

比如端口和ip赋值给：

/var/opt/gitlab/nginx/conf/gitlab-http.conf（模板/opt/gitlab/embedded/conf/nginx.conf ?）

 /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml（模板：/opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml.exmaple）

说回到 前端http://172.26.101.133:8088

默认用户名root/ admin@example.com 可以从log中获取：

sudo grep -nr "admin" /var/log/gitlab/

​	/var/log/gitlab/gitlab-rails/application.log

监控前端（从nginx配置获取）：

172.26.101.134:8088/-/grafana/login

注意这个8088也将会是Gitaly集群的internal_api_url

/opt/gitlab/embedded/service/gitlab-shell/config.yml

~~注意此处要手动修改gitlab_url，不知为何reconfigure没有生效到这里~~ 应该不需要修改，默认就是8080，对应puma-worker的端口

auth_key?

#### 2.4.2 监控grafana

第一种基本登录 

​	grafana['disable_login_form'] = false

​	gitlab-ctl set-grafana-password

第二种方法：通过gitlab server第三方登录

首先login配置

172.26.101.134:8088/-/grafana/login

http://172.26.101.134:8088/oauth/authorize?access_type=online&client_id=a797f89033dee951dac900905d7b447191f743bcd9afa3a970be4a6864ee0661&redirect_uri=http%3A%2F%2F172.26.101.134%3A8088%2F-%2Fgrafana%2Flogin%2Fgitlab&response_type=code&scope=api&state=o2t3bzD7ek3TPoIPHqDVaLc_HSInTqdBK9IlS2dHhnc%3D

?# gitlab The redirect URI included is not valid.

https://grafana.com/docs/grafana/latest/auth/gitlab/

配置：

回到gitlab前端的管理员area， Applications->Add 

callback url: http://172.26.101.134:8088/-/grafana/login/gitlab

将clientid和secret配置到：/var/opt/gitlab/grafana/grafana.ini

```
[auth.gitlab]
client_id
client_secret
root_url = http://172.26.101.134:8088/-/grafana
auth_url = http://172.26.101.134:8088/oauth/authorize
token_url = http://172.26.101.134:8088/oauth/token
api_url = http://172.26.101.134:8088/api/v4
```

gitlab-ctl restart grafana

**监控其他节点**

这个是在安装了Gitaly cluster之后的配置

9090 prometheus

9100 node_exporter

这两个都是可以看到metrics:

curl 127.0.0.1:9090/metrics -s | head

curl 127.0.0.1:9100/metrics -s | head

应该只有prometheus自带UI:

http://172.26.101.133:9090/graph

但是浏览器无法打开，netstat发现9090只监听本地端口，所以要修改

grep :9090 /var/opt/* -r

找到/var/opt/gitlab/prometheus/prometheus.yml和/var/opt/gitlab/gitlab-rails/etc/gitlab.yml

但是还是建议去/etc/gitlab/gitlab.rb里面去修改：

 prometheus['listen_address'] = 'localhost:9090'

最后可以打开了prometheus ui，

测试dashboard：Gitaly，先修改variable

```
label_values(up{job="gitaly"}, instance)
改成
label_values(gitlab_build_info{job="praefect-gitaly"}, instance)
果然可以看到其他三个instance
```

然后继续修改dashboard页面内部的metrics，比如Gitaly的cpu查询一下，

rate(process_cpu_seconds_total{job="gitaly"}[1m])

发现只有一条localhost记录，再来查查node exporter配置：

 grep :9100 /var/opt/* -r
/var/opt/gitlab/prometheus/prometheus.yml:    - localhost:9100

```
- job_name: node
  static_configs:
  - targets:
    - localhost:9100
```

果然这个是问题所在，并没有去监听Gitaly cluster 上面的9100

但是正确的做法仍然是不要直接修改，应该去修改/etc/gitlab/gitlab.rb

突然想到我们在创建gitaly cluster的时候其实修改过，刚好在这个prometheus.yml里面验证下：

```
- job_name: praefect-gitaly
  static_configs:
  - targets:
    - 172.26.101.136:9236
    - 172.26.101.137:9236
    - 172.26.101.138:9236
```

果然是有，我们依样画葫芦，可以同样修改上面的node

```
 {                                          
   'job_name' => 'praefect-gitaly-nodes',   
   'static_configs' => [                    
     'targets' => [                         
       '172.26.101.136:9100', # gitaly-1    
       '172.26.101.137:9100', # gitaly-2    
       '172.26.101.138:9100', # gitaly-3    
     ]                                      
   ]                                        
 }                                          
```

但是还不够，还要确认Gitaly的9100端口对gitlab server可见，但是发现实际上Gitaly上面并没有开启9100端口，意思是node_exporter并没有启动，怀疑是gitlab程序会默认根据gitaly['enable'] = true来disable掉node_exporter,所以我尝试主动去开启node_exporter:

```
################################################################################
## Prometheus Node Exporter
##! Docs: https://docs.gitlab.com/ee/administration/monitoring/prometheus/node_exporter.html
################################################################################

node_exporter['enable'] = true
# node_exporter['home'] = '/var/opt/gitlab/node-exporter'
# node_exporter['log_directory'] = '/var/log/gitlab/node-exporter'
# node_exporter['flags'] = {
#   'collector.textfile.directory' => "/var/opt/gitlab/node-exporter/textfile_collector"
# }
# node_exporter['env_directory'] = '/opt/gitlab/etc/node-exporter/env'
# node_exporter['env'] = {
#   'SSL_CERT_DIR' => "/opt/gitlab/embedded/ssl/certs/"
# }

##! Advanced settings. Should be changed only if absolutely needed.
node_exporter['listen_address'] = '0.0.0.0:9100'
```

刚好同时将node_exporter监听也改掉

firewall-cmd --zone=public --add-port=9100/tcp --permanent

firewall-cmd --reload

回到gitlab-server，在http://172.26.101.133:9090/graph

rate(process_cpu_seconds_total{job="praefect-gitaly-nodes"}[1m])

果然看到了三个instance的metrics（注意重启服务后要多等一会）

最后试着保存dashboard，居然弹出错误“ Cannot save provisioned dashboard"

https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards

vim /var/opt/gitlab/grafana/provisioning/dashboards/gitlab_dashboards.yml

```
---
apiVersion: 1
providers:
- name: GitLab Omnibus
  orgId: 1
  folder: GitLab Omnibus
  type: file
  disableDeletion: true
  updateIntervalSeconds: 600
  options:
    path: "/opt/gitlab/embedded/service/grafana-dashboards"
```

继而找到

 vim /opt/gitlab/embedded/service/grafana-dashboards/gitaly.json



#### 2.4.3 邮箱

前面跳过了邮箱配置，这里采用external mail server gmail，但是奇怪的是postfix自动运行

https://docs.gitlab.com/omnibus/settings/smtp.html

**Use smtp instead of sendmail/postfix.**

注意要更改gitlab_rails['smtp_设置，不要改错

测试：

```
Look at the ActionMailer `delivery_method` to make sure it matches what you intended. If you configured SMTP, it should say `:smtp`. If you’re using Sendmail, it should say `:sendmail`:

ActionMailer::Base.delivery_method

gitlab-rails console
Notify.test_email('lyhistory@gmail.com', 'test gitlab', 'test').deliver_now
ActionMailer::Base.smtp_settings

```

#### 2.4.4 postgresql

https://docs.gitlab.com/omnibus/settings/database.html#connecting-to-the-bundled-postgresql-database

https://docs.gitlab.com/ee/administration/troubleshooting/postgresql.html#postgresql

/var/opt/gitlab/postgresql/data/postgresql.conf

```
sudo gitlab-rails dbconsole

sudo gitlab-psql -d gitlabhq_production
```

plsql cmds

https://www.postgresql.org/docs/12/app-psql.html

注意下面这种方式是无法连接的，因为gitlab本机内部不是用tcp协议，而是用Unix域套接口

/opt/gitlab/embedded/bin/psql -U postgres -d gitlabhq_production -h <POSTGRESQL_SERVER_ADDRESS>

#### 2.4.5 gitaly

vim /var/opt/gitlab/gitaly/config.toml

可以清晰的看到 /var/opt/gitlab/git-data/repositories 这个就是git最终存储的位置

```
socket_path = '/var/opt/gitlab/gitaly/gitaly.socket'

internal_socket_dir = '/var/opt/gitlab/gitaly/internal_sockets'
bin_dir = '/opt/gitlab/embedded/bin'

# Optional: export metrics via Prometheus
prometheus_listen_addr = 'localhost:9236'

[[storage]]
name = 'defau://www.postgresql.org/docs/12/app-psql.htmlt'
path = '/var/opt/gitlab/git-data/repositories'

[logging]
format = 'json'
dir = '/var/log/gitlab/gitaly'

[auth]

[git]

[gitaly-ruby]
dir = "/opt/gitlab/embedded/service/gitaly-ruby"
rugged_git_config_search_path = "/opt/gitlab/embedded/etc"

[gitlab-shell]
dir = "/opt/gitlab/embedded/service/gitlab-shell"
gitlab_url = 'http://127.0.0.1:8080'
```

#### 2.4.6 日志logrotate

/var/opt/gitlab/logrotate/logrotate.conf

```
include /var/opt/gitlab/logrotate/logrotate.d/nginx
include /var/opt/gitlab/logrotate/logrotate.d/puma
include /var/opt/gitlab/logrotate/logrotate.d/actioncable
include /var/opt/gitlab/logrotate/logrotate.d/unicorn
include /var/opt/gitlab/logrotate/logrotate.d/gitlab-rails
include /var/opt/gitlab/logrotate/logrotate.d/gitlab-shell
include /var/opt/gitlab/logrotate/logrotate.d/gitlab-workhorse
include /var/opt/gitlab/logrotate/logrotate.d/gitlab-pages
```

#### 2.4.7 SSL & SSH

https://docs.gitlab.com/omnibus/settings/ssl.html

刚开始想用let's ecrypt，发现

https://certbot.eff.org/lets-encrypt/centosrhel7-nginx

这自动更新得联网啊，而且我连个域名都没有，直接是ip访问

还是用自签吧，但是又发现有坑：[Unable to perform Git operations due to an internal or self-signed certificate](https://docs.gitlab.com/ee/administration/troubleshooting/ssl.html#unable-to-perform-git-operations-due-to-an-internal-or-self-signed-certificate)

大概意思是，自签没问题，但是git客户端无法验证自签证书，要么得一个个git客户端安装一遍，要么disable ssl verify，总归是坑

ssh

https://docs.gitlab.com/ee/gitlab-basics/create-your-ssh-keys.html#create-and-add-your-ssh-key-pair

```
ssh-keygen -t ed25519 -C "<comment>"
```

### 2.5 商业版

[https://docs.gitlab.com/ee/user/admin_area/license.html#:~:text=Add%20your%20license%20at%20install,and%20filename%20for%20the%20license.](https://docs.gitlab.com/ee/user/admin_area/license.html#:~:text=Add your license at install,and filename for the license.)

https://packages.gitlab.com/gitlab/gitlab-ee

### 2.6 替换内置服务

！！强烈不建议，因为会影响后续升级！！

nginx

jianshu.com/p/123778a515ca

grafana

postgresql



反向代理

https://cloud.tencent.com/developer/article/1437220

配置排查参考：blog.csdn.net/weixin_43748870/article/details/86178042

## 3. High Availability

总体上说，

+ CE版本

  结合gitlab服务端架构，随便搜一下可以看到都是抄来抄去的同类文章https://www.cnblogs.com/wangshuyang/p/10946099.html

  网上大多建议装两个单机版（all in one），前面用Virtual IP或floating IP，然后两个单机通过NFS共享磁盘，由于NFS即将被移除，其他思路就是DRBD或者rsync整个磁盘同步，所以这个方案实际是主备（冷备），每次只是开一个机器，当挂掉之后，可以启动备用

  https://www.digitalocean.com/community/tutorials/how-to-set-up-highly-available-web-servers-with-keepalived-and-floating-ips-on-ubuntu-14-04

+ EE版本

  采用主主（热备）

  切分成两大部分，gitlab-server和Gitaly cluster，Gitaly cluster本身就是集群模式，gitlab-server需要借助load Balancer搞成ha，比如借助haproxy，然后多个gitlab-server节点之间共享Application database和Gitaly cluster；

  gitlab-sever跟Gitaly cluster之间是通过Praefect连接，Praefect本身只是路由，所以可以做成多节点，加一个loadBalancer；

  注意loadBalancer本身也是可以做成多节点的，参考haproxy的文章；

> gitlab内部可以做给个部分的ha，比如
>
> 1. [Configure the database](https://docs.gitlab.com/ee/administration/postgresql/replication_and_failover.html)
> 2. [Configure Redis](https://docs.gitlab.com/ee/administration/high_availability/redis.html)
> 3. [Configure NFS](https://docs.gitlab.com/ee/administration/high_availability/nfs.html)
> 4. [Configure the GitLab application servers](https://docs.gitlab.com/ee/administration/high_availability/gitlab.html)
>
> 不过需要注意的是，NFS在新版已经deprecated并且会被删除
>
> high_availability['mountpoint'] 
>
> https://docs.gitlab.com/ee/administration/high_availability/gitlab.html
>
> https://docs.gitlab.com/ee/administration/high_availability/nfs.html
>
> **Caution:** From GitLab 13.0, using NFS for Git repositories is deprecated. In GitLab 14.0, support for NFS for Git repositories is scheduled to be removed. Upgrade to [Gitaly Cluster](https://docs.gitlab.com/ee/administration/gitaly/praefect.html) as soon as possible.
>
> 可以看到官方已经不推荐了



### 3.1 gitlay cluster

https://docs.gitlab.com/ee/administration/gitaly/praefect.html

- 1 load balancer
- 1 PostgreSQL server (PostgreSQL 11 or newer)
- 3 Praefect nodes
- 3 Gitaly nodes (1 primary, 2 secondary)

#### 3.1.1 postgresql server:

https://www.postgresql.org/download/linux/redhat/

https://yum.postgresql.org/12/redhat/rhel-7-x86_64/repoview/postgresql12-libs.html

find direct rpm download:

https://yum.postgresql.org/rpmchart/

- [postgresql12](https://yum.postgresql.org/12/redhat/rhel-7-x86_64/repoview/postgresql12.html) - PostgreSQL client programs and libraries
- [postgresql12-contrib](https://yum.postgresql.org/12/redhat/rhel-7-x86_64/repoview/postgresql12-contrib.html) - Contributed source and binaries distributed with PostgreSQL
- [postgresql12-libs](https://yum.postgresql.org/12/redhat/rhel-7-x86_64/repoview/postgresql12-libs.html) - The shared libraries required for any PostgreSQL clients
- [postgresql12-server](https://yum.postgresql.org/12/redhat/rhel-7-x86_64/repoview/postgresql12-server.html) - The programs needed to create and run a PostgreSQL server

```
 ## 安装postgresql：：
 
 40  cd /opt/
   43  sudo mkdir postgresql
   44  mv ~/postgresql12-* postgresql/
   45  sudo mv ~/postgresql12-* postgresql/
   47  cd postgresql/
   50  sudo yum localinstall postgresql12-libs-12.3-5PGDG.rhel7.x86_64.rpm
   52  sudo yum localinstall postgresql12-12.3-5PGDG.rhel7.x86_64.rpm
   53  sudo yum localinstall postgresql12-server-12.3-5PGDG.rhel7.x86_64.rpm
   54  sudo yum localinstall postgresql12-contrib-12.3-5PGDG.rhel7.x86_64.rpm
   55  ll /usr/
   56  /usr/pgsql-12/bin/postgresql-12-setup initdb
   57  sudo /usr/pgsql-12/bin/postgresql-12-setup initdb
   58  sudo systemctl enable postgresql-12
   59  sudo systemctl start postgresql-12
   
   [liuyue@sgkc2-cicd-v02 ~]$ sudo ps -lef|grep "postgre"
4 S postgres   987     1  0  80   0 - 99348 poll_s 16:59 ?        00:00:00 /usr/pgsql-12/bin/postmaster -D /var/lib/pgsql/12/data/
1 S postgres   989   987  0  80   0 - 62944 ep_pol 16:59 ?        00:00:00 postgres: logger
1 S postgres   991   987  0  80   0 - 99348 ep_pol 16:59 ?        00:00:00 postgres: checkpointer
1 S postgres   992   987  0  80   0 - 99381 ep_pol 16:59 ?        00:00:00 postgres: background writer
1 S postgres   993   987  0  80   0 - 99348 ep_pol 16:59 ?        00:00:00 postgres: walwriter
1 S postgres   994   987  0  80   0 - 99486 ep_pol 16:59 ?        00:00:00 postgres: autovacuum launcher
1 S postgres   995   987  0  80   0 - 62943 ep_pol 16:59 ?        00:00:00 postgres: stats collector
1 S postgres   996   987  0  80   0 - 99486 ep_pol 16:59 ?        00:00:00 postgres: logical replication launcher

```

下一步 为Praefect创建数据库

```
刚开始想着从Praefect服务器直接连过来，发现失败

# the database template1 is used because it is created by default on all PostgreSQL servers.
/opt/gitlab/embedded/bin/psql -U postgres -d template1 -h POSTGRESQL_SERVER_ADDRESS

```



登录失败！ 需要修改监听端口和登录的方式，具体参考《database/postgresql》的设置说明

另外如果有防火墙还要开端口

firewall-cmd --permanent --add-port=5432/tcp

firewall-cmd --reload

```
su - postgres

psql
create user gitlabuser password 'gitlab';
CREATE ROLE praefect WITH LOGIN CREATEDB PASSWORD 'PRAEFECT_SQL_PASSWORD';
ALTER ROLE praefect with PASSWORD 'test';
然后再从Praefect服务器用新创建的用户连过来
/opt/gitlab/embedded/bin/psql -U praefect -d template1 -h 172.26.101.134

> CREATE DATABASE praefect_production WITH ENCODING=UTF8;
 By creating the database while connected as the praefect user, we are confident they have access.


template1=> \du
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 praefect  | Create DB                                                  | {}
 
template1=> CREATE DATABASE praefect_production WITH ENCODING=UTF8;
CREATE DATABASE
template1=> \l
                                       List of databases
        Name         |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
---------------------+----------+----------+-------------+-------------+-----------------------
 postgres            | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 praefect_production | praefect | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0           | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                     |          |          |             |             | postgres=CTc/postgres
 template1           | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
                     |          |          |             |             | postgres=CTc/postgres
(4 rows)
template1-> use tempalte1
template1-> \dt
Did not find any relations.
template1-> use template0
template1-> \dt
Did not find any relations.
template1-> use postgres
template1-> \dt
Did not find any relations.
template1-> use praefect_production
template1-> \dt
Did not find any relations.

!!!
我发现后面我连了Praefect过来，同样全部为空，难道一台Praefect并没有用到这个db？？？
!!!
我错了，跟mysql语法不同！！！ Postgresql是用 \c praefect_production; 切换数据库！！！

/opt/gitlab/embedded/bin/psql -U praefect -d praefect_production -h <POSTGRESQL_SERVER_ADDRESS>

# create database gitlabdb with owner gitlab;
# alter database gitlabdb set search_path to sgc2,public;
# alter user gitlab set search_path to sgc2,public;

# create schema sgc2backup;
# create user arch password 'gitlab';
# alter user arch set search_path to sgc2backup;
# alter schema sgc2backup owner to arch;

# grant connect on database gitlabdb to arch;
# grant usage, create on schema sgc2backup to arch;

# GRANT USAGE ON SCHEMA sgc2backup TO gitlab;
# grant select on all tables in schema sgc2backup to gitlab;
# revoke insert,update,delete on all tables in schema sgc2backup from gitlab;

# GRANT USAGE ON SCHEMA sgc2 TO arch;
# grant select on all tables in schema sgc2 to arch;
# revoke insert,update,delete on all tables in schema sgc2 from arch;

```



卸载：

```
rpm -e postgresql-server	
rpm -e postgresql-contrib	
rpm -e postgresql	
rpm -e postgresql-libs
```

#### 3.1.2 Gitaly Nodes

这次采用了yum localinstall 没有采用rpm -ivh 不知道后续再用rpm -uvh升级是否有问题

```
Installing:.......

Thank you for installing GitLab!
GitLab was unable to detect a valid hostname for your instance.
Please configure a URL for your GitLab instance by setting `external_url`
configuration in /etc/gitlab/gitlab.rb file.
Then, you can start your GitLab instance by running the following command:
  sudo gitlab-ctl reconfigure

For a comprehensive list of configuration options please see the Omnibus GitLab readme
https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md
.....                                                                                             8/8

Installed:
  gitlab-ce.x86_64 0:13.0.7-ce.0.el7

Dependency Installed:
  audit-libs-python.x86_64 0:2.8.5-4.el7     checkpolicy.x86_64 0:2.5-8.el7        libcgroup.x86_64 0:0.41-21.el7     libsemanage-python.x86_64 0:2.5-14.el7     policycoreutils-python.x86_64 0:2.5-34.el7
  python-IPy.noarch 0:0.75-6.el7             setools-libs.x86_64 0:3.3.8-4.el7

Complete!
```

gitaly['listen_addr'] = '0.0.0.0:8075'

gitaly['auth_token'] = 'PRAEFECT_INTERNAL_TOKEN'	对应 praefect

```
praefect['virtual_storages'] = {
  'storage-1' => {
    'gitaly-1' => {
      'address' => 'tcp://GITALY_HOST:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN',
      'primary' => true
    },
    'gitaly-2' => {
      'address' => 'tcp://GITALY_HOST:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN'
    },
    'gitaly-3' => {
      'address' => 'tcp://GITALY_HOST:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN'
    }
  }
}
```



下面这两个是git push需要回调的

gitlab_shell['secret_token'] = 'GITLAB_SHELL_SECRET_TOKEN' 这个是对应gitlab server配置的同样的token

\# Don't forget to copy `/etc/gitlab/gitlab-secrets.json` from Gitaly client to Gitaly server. （？这句话是因为什么，是不是跟gitlab_shell['secret_token'] 不同的验证方式，公私钥验证？）

gitlab_rails['internal_api_url'] = '172.26.101.133:8088' 对应gitlab server API，

internal_api_url 会在gitlab-ctl reconfigure的时候被赋值到/opt/gitlab/embedded/service/gitlab-shell/config.yml以及

/var/opt/gitlab/gitlab-shell/config.yml，注意我发现gitlab server上的这个配置文件内容却是8080端口，可能对外统一都是8088，然后对内是8080

```
# Url to gitlab instance. Used for api calls. May but need not end with a slash.
gitlab_url: "http://127.0.0.1:8080"
```

就是对应的gitlab server上面的puma web服务（unicorn）

#### 3.1.3 测试连通性

单机版gitlab可以执行`gitlab-rake gitlab:check`即可全面单机检测

但是对于我们的HA方案，即gitlab server->praefect->gitaly分开部署，则需要执行：

```
postgresql server open port 5432 to praefect server;
​	on praefect server: sudo -u git /opt/gitlab/embedded/bin/praefect -config /var/opt/gitlab/praefect/config.toml sql-ping
/opt/gitlab/embedded/bin/psql -U praefect -d template1 -h 172.26.101.134

praefect server open port 2305 and 9652 to gitlab server;
​	on gitlab server: gitlab-rake gitlab:gitaly:check
 sudo gitlab-rake gitlab:check SANITIZE=true

gitlab server open api 8080? to gitaly server;
​	on gitaly nodes: 
/opt/gitlab/embedded/service/gitlab-shell/bin/check -config /opt/gitlab/embedded/service/gitlab-shell/config.yml
or
/opt/gitlab/embedded/bin/gitaly-hooks check /var/opt/gitlab/gitaly/config.toml


gitaly server open 9236 to gitlab server;	

gitaly server open 8075 to praefect server; 
​	on praefect server: sudo /opt/gitlab/embedded/bin/praefect -config /var/opt/gitlab/praefect/config.toml dial-nodes

prometheus_listen_addr
Praefect的9652 和 Gitaly的9236：
grafana打开explorer，输入gitlab_build_info 结果中可以看到localhost的gitlab server，Praefect，以及三个Gitaly，如果看不到，就说明端口没有开启或者防火墙挡住
```

通信TOKEN

可以用`tool: openssl rand -base64 32` 生成

```
GITLAB_SHELL_SECRET_TOKEN: this is used by Git hooks to make callback HTTP API requests to GitLab when accepting a Git push. This secret is shared with GitLab Shell for legacy reasons.

PRAEFECT_EXTERNAL_TOKEN: repositories hosted on your Praefect cluster can only be accessed by Gitaly clients that carry this token.

PRAEFECT_INTERNAL_TOKEN: this token is used for replication traffic inside your Praefect cluster. This is distinct from PRAEFECT_EXTERNAL_TOKEN because Gitaly clients must not be able to access internal nodes of the Praefect cluster directly; that could lead to data loss.

PRAEFECT_SQL_PASSWORD: this password is used by Praefect to connect to PostgreSQL.

--------------------------------------------------------------------
--- gitlab server:
--------------------------------------------------------------------
git_data_dirs({
  "default" => {
    "gitaly_address" => "tcp://<PRAEFECT IP>:2305",
    "gitaly_token" => 'PRAEFECT_EXTERNAL_TOKEN'
  }
})

gitlab_shell['secret_token'] = 'GITLAB_SHELL_SECRET_TOKEN'

--------------------------------------------------------------------
--- praefect:
--------------------------------------------------------------------
praefect['auth_token'] = 'PRAEFECT_EXTERNAL_TOKEN'


praefect['database_host'] = '<TRACKING POSTGRESQL DATABASE IP>'
praefect['database_port'] = 5432
praefect['database_user'] = 'praefect'
praefect['database_password'] = 'PRAEFECT_SQL_PASSWORD'
praefect['database_dbname'] = 'praefect_production'

# Name of storage hash must match storage name in git_data_dirs on GitLab
# server ('praefect') and in git_data_dirs on Gitaly nodes ('gitaly-1')
praefect['virtual_storages'] = {
  'default' => {
    'gitaly-1' => {
      'address' => 'tcp://<GITALY VM1 IP>:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN',
    },
    'gitaly-2' => {
      'address' => 'tcp://<GITALY VM2 IP>:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN'
    },
    'gitaly-3' => {
      'address' => 'tcp://<GITALY VM3 IP>:8075',
      'token'   => 'PRAEFECT_INTERNAL_TOKEN'
    }
  }
}
--------------------------------------------------------------------
--- gitaly:
--------------------------------------------------------------------
gitaly['auth_token'] = 'PRAEFECT_INTERNAL_TOKEN'

gitlab_shell['secret_token'] = 'GITLAB_SHELL_SECRET_TOKEN'
```



### 3.2 gitrail-server multi-nodes

#### 官方方案

https://docs.gitlab.com/ee/administration/geo/replication/multiple_servers.html#geo-for-multiple-nodes-premium-only

然后我顺着找到这个https://docs.gitlab.com/ee/administration/reference_architectures/index.html#traffic-load-balancer-starter-only

> This requires separating out GitLab into multiple application nodes with an added [load balancer](https://docs.gitlab.com/ee/administration/high_availability/load_balancer.html). The load balancer will distribute traffic across GitLab application nodes. Meanwhile, each application node connects to a shared file server and database systems on the back end. This way, if one of the application servers fails, the workflow is not interrupted. [HAProxy](https://www.haproxy.org/) is recommended as the load balancer.
>
> Supported tiers: [GitLab Starter, Premium, and Ultimate](https://about.gitlab.com/pricing/)

可以看到这个是要付费后才支持的，主要就是如何配置share db；

还有几个疑问：redis不需要分离吗？ session存储在哪里，如何share？有几种可能：
1.load Balancer可以有策略让一个用户整个session期间只连接固定一个Application server，所以不会有session共享问题
2.session写到了db，按这里文档所说分离share db即可
3.session写到redis，分离share redis即可（但是文档此处没有提redis）
4.session写到Application memory，这个解决只能用方法1

https://docs.gitlab.com/ee/administration/high_availability/load_balancer.html#load-balancer-for-multi-node-gitlab

这个是在gitlab scope之外，采用外部的负载均衡，



跟gitlab沟通的结果发现，他们故意这种搞，就是为了卖他们的premium account所带的技术支持服务，

当然我推测了下，上面说的 shared file server应该是指Gitaly nodes，那么database system是指postgresql，然后我从gitlab server的config里面看到

```
### GitLab database settings
###! Docs: https://docs.gitlab.com/omnibus/settings/database.html
###! **Only needed if you use an external database.**
# gitlab_rails['db_adapter'] = "postgresql"
# gitlab_rails['db_encoding'] = "unicode"
# gitlab_rails['db_collation'] = nil
# gitlab_rails['db_database'] = "gitlabhq_production"
# gitlab_rails['db_pool'] = 1
# gitlab_rails['db_username'] = "gitlab"
# gitlab_rails['db_password'] = nil
# gitlab_rails['db_host'] = nil
# gitlab_rails['db_port'] = 5432
# gitlab_rails['db_socket'] = nil
# gitlab_rails['db_sslmode'] = nil
# gitlab_rails['db_sslcompression'] = 0
# gitlab_rails['db_sslrootcert'] = nil
# gitlab_rails['db_sslcert'] = nil
# gitlab_rails['db_sslkey'] = nil
# gitlab_rails['db_prepared_statements'] = false
# gitlab_rails['db_statements_limit'] = 1000


### GitLab Redis settings
###! Connect to your own Redis instance
###! Docs: https://docs.gitlab.com/omnibus/settings/redis.html

#### Redis TCP connection
# gitlab_rails['redis_host'] = "127.0.0.1"
# gitlab_rails['redis_port'] = 6379
# gitlab_rails['redis_ssl'] = false
# gitlab_rails['redis_password'] = nil
# gitlab_rails['redis_database'] = 0
# gitlab_rails['redis_enable_client'] = true
```



所以推测只需要按照如下文档建立一个外部db即可

https://docs.gitlab.com/omnibus/settings/database.html

https://docs.gitlab.com/omnibus/settings/database.html#using-a-non-packaged-postgresql-database-management-server

https://docs.gitlab.com/ee/install/requirements.html#database

但是还有个问题，redis是不是也要剥离到外部？从配置文件看确实可以，但是这些弄下来需要的机器实在不少，而且也是难以维护，所3以我没有尝试；

#### 备份方案

method 1： back & restore

https://docs.gitlab.com/ee/raketasks/backup_restore.html

https://docs.gitlab.com/omnibus/settings/backups.html

```
uninstall...
install same version as the source machine
systemctl start gitlab-runsvdir
sudo gitlab-ctl reconfigure
sudo gitlab-ctl start
from source:
sudo scp root@172.26.101.133:/var/opt/gitlab/backups/1600046306_2020_09_14_13.3.0-ee_gitlab_backup.tar /var/opt/gitlab/backups/
sudo chown git.git /var/opt/gitlab/backups/1600046306_2020_09_14_13.3.0-ee_gitlab_backup.tar

sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop puma
sudo gitlab-ctl stop sidekiq
# Verify
sudo gitlab-ctl status

# This command will overwrite the contents of your GitLab database! 
sudo gitlab-backup restore BACKUP=/var/opt/gitlab/backups/1600046306_2020_09_14_13.3.0-ee_gitlab_backup.tar
The backup file 1600046306_2020_09_14_13.3.0-ee_gitlab_backup_gitlab_backup.tar does not exist!

sudo gitlab-backup restore 不加参数居然是可以工作的，所以/var/opt/gitlab/backups下面只放一个tar

restore `/etc/gitlab/gitlab-secrets.json`
sudo scp root@172.26.101.133:/etc/gitlab/config_backup/gitlab_config_1598345534_2020_08_25.tar /etc/gitlab/
sudo mv /etc/gitlab /etc/gitlab.$(date +%s)
sudo tar -xf gitlab_config_1598345534_2020_08_25.tar -C /
tar: Removing leading `/' from member names 这句话不知道什么意思

vim /etc/gitlab/gitlab.rb 修改external_url
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
注意执行上面一句的时候要等一会才开始执行下面的检查，否则会抛很多错误
sudo gitlab-rake gitlab:check SANITIZE=true
  
开放相应的端口，并进行连通性检测
gitlab server open api 8080? to gitaly server;

修改Gitaly nodes的internal_api_url
```



method 2：rsync

安装rsync实现自动增量同步到远端

参考《linux/rsync》

https://www.jianshu.com/p/bc45631aa561

```
------------------------------------------------
--- 服务器端
------------------------------------------------
yum install rsync

vim /etc/rsyncd.conf
​```
# /etc/rsyncd: configuration file for rsync daemon mode

# See rsyncd.conf man page for more options.

# configuration example:

uid = root
gid = root
use chroot = no
#port = 973
# max connections = 4
pid file = /var/run/rsyncd.pid
log file = /var/rsync/rsyncd.log
secrets file = /etc/rsync.password
# exclude = lost+found/
# transfer logging = yes
# timeout = 900
# ignore nonreadable = yes
# dont compress   = *.gz *.tgz *.zip *.z *.Z *.rpm *.deb *.bz2

# [ftp]
#        path = /home/ftp
#        comment = ftp export area
[gitlab_path1]
comment = "/opt/gitlab"
path = /opt/gitlab
auth users = root, rsync_backup
read only = yes 
list = yes 
hosts allow = <DEST IP>
hosts deny = *
[gitlab_path2]
comment = "/var/opt/gitlab"
path = /var/opt/gitlab
auth users = root, rsync_backup
read only = yes
list = yes 
hosts allow = <DEST IP>
hosts deny = *
[gitlab_path3]
comment = "/etc/gitlab"
path = /etc/gitlab
auth users = root, rsync_backup
read only = yes 
list = yes 
hosts allow = <DEST IP>
hosts deny = *
[gitlab_path4]
comment = "/var/log/gitlab"
path = /var/log/gitlab
auth users = root, rsync_backup
read only = yes 
list = yes 
hosts allow = <DEST IP>
hosts deny = *
[gitlab_path5]
comment = "/run/gitlab"
path = /run/gitlab
auth users = root, rsync_backup
read only = yes 
list = yes 
hosts allow = <DEST IP>
hosts deny = *
​```

echo "rsync_backup:1" >/etc/rsync.password  
chmod 600 /etc/rsync.password

firewall-cmd --permanent --add-port=873/tcp
firewall-cmd --reload

------------------------------------------------
--- 客户端
------------------------------------------------
yum install rsync

echo "1" >/etc/rsync.password  
chmod 600 /etc/rsync.password

vim /opt/gitlab_rsync.sh

rsync -avz --delete rsync_backup@<SOURCE IP>::gitlab_path1 /opt/gitlab --password-file=/etc/rsync.password >/dev/null 2>&1
rsync -avz --delete rsync_backup@<SOURCE IP>::gitlab_path2 /var/opt/gitlab --password-file=/etc/rsync.password >/dev/null 2>&1
rsync -avz --delete rsync_backup@<SOURCE IP>::gitlab_path3 /etc/gitlab --password-file=/etc/rsync.password >/dev/null 2>&1
rsync -avz --delete rsync_backup@<SOURCE IP>::gitlab_path4 /var/log/gitlab --password-file=/etc/rsync.password >/dev/null 2>&1
rsync -avz --delete rsync_backup@<SOURCE IP>::gitlab_path5 /run/gitlab --password-file=/etc/rsync.password >/dev/null 2>&1

chmod 755 /opt/gitlab_rsync.sh

echo "00 3 * * * root /opt/gitlab_rsync.sh" >> /etc/crontab

```





### 3.3 Postgresql Replication 

GEO 这个不需要https://docs.gitlab.com/ee/administration/geo/replication/index.html

需要的是gitlab-server Application Database和Praefect tracking database



### 3.4 ？？HA Roles

https://docs.gitlab.com/omnibus/roles/README.html#

The majority of the following roles will only work on a GitLab Enterprise Edition, meaning a gitlab-ee Omnibus package. It will be mentioned next to each role.

没太搞懂，直接通过配置多个节点？ee才可以用

redis roles

https://docs.gitlab.com/omnibus/roles/README.html#redis-server-roles

## 4. Maintenance 维护

https://docs.gitlab.com/omnibus/maintenance/README.html

### 数据管理

#### gitlab server(workhorse)

##### gitlab-rails dbconsole

gitlabhq_production=>\dt

##### gitlab-rails console >> users and products

https://docs.gitlab.com/ee/administration/troubleshooting/navigating_gitlab_via_rails_console.html

密码默认8位

```
user=User.where(username: 'test1').first
user.password
user.password='12345678'
user.password_confirmation='12345678'
user.save
Enqueued ActionMailer::DeliveryJob (Job ID: 1fd0a22c-6908-45bd-b0b1-35f4da4aad25) to Sidekiq(mailers) with arguments: "DeviseMailer", "password_change", "deliver_now", #<GlobalID:0x00007fd3a9a03370 @uri=#<URI::GID gid://gitlab/User/2>>
=> true
```

Access control

https://docs.gitlab.com/ee/security/README.html#securing-your-gitlab-installation

#### praefect database

```
su - postgres
-bash-4.2$ psql
postgres-# \c praefect_production;
praefect_production-# \dt
```



#### gitaly repository

 ls /var/opt/gitlab/git-data/repositories



### 备份迁移

https://docs.gitlab.com/omnibus/settings/backups.html

#### 配置备份 Backup and restore Omnibus GitLab configuration

It is recommended to keep a copy of `/etc/gitlab`, or at least of `/etc/gitlab/gitlab-secrets.json`, in a safe place. If you ever need to restore a GitLab application backup you need to also restore `gitlab-secrets.json`. If you do not, GitLab users who are using two-factor authentication will lose access to your GitLab server and ‘secure variables’ stored in GitLab CI will be lost.

Your machines SSH host keys are stored in a separate location at `/etc/ssh/`. Be sure to also [backup and restore those keys](https://superuser.com/questions/532040/copy-ssh-keys-from-one-server-to-another-server/532079#532079) to avoid man-in-the-middle attack warnings if you have to perform a full machine restore.

do not store your GitLab application backups (Git repositories, SQL data) in the same place as your configuration backup (`/etc/gitlab`). The `gitlab-secrets.json` file (and possibly also the `gitlab.rb` file) contain database encryption keys to protect sensitive data in the SQL database:

- GitLab two-factor authentication (2FA) user secrets (‘QR codes’)
- GitLab CI ‘secure variables’

```
MANUAL BACKUP:
`gitlab-ctl backup-etc`
Configuration backup archive complete: /etc/gitlab/config_backup/gitlab_config_1598345534_2020_08_25.tar

AUTO BACKUP:
sudo crontab -e -u root
schedule the backup to run every morning after a weekday, Tuesday (day 2) through Saturday (day 6):
15 04 * * 2-6  gitlab-ctl backup-etc && cd /etc/gitlab/config_backup && cp $(ls -t | head -n1) /secret/gitlab/backups/

注意要设置好Limit backup lifetime for local files (prune old backups)
否则会磁盘写满
## Limit backup lifetime to 7 days - 604800 seconds
gitlab_rails['backup_keep_time'] = 604800

RESTORE:
# Rename the existing /etc/gitlab, if any
sudo mv /etc/gitlab /etc/gitlab.$(date +%s)
# Change the example timestamp below for your configuration backup
sudo tar -xf gitlab_config_1487687824_2017_02_21.tar -C /
sudo gitlab-ctl reconfigure
```

#### Creating an application backup

https://docs.gitlab.com/ee/raketasks/backup_restore.html

GitLab provides a simple command line interface to back up your whole instance. It backs up your:

- Database
- Attachments
- Git repositories data
- CI/CD job output logs
- CI/CD job artifacts
- LFS objects
- Container Registry images
- GitLab Pages content

The [backup Rake task](https://docs.gitlab.com/ee/raketasks/backup_restore.html#back-up-gitlab) GitLab provides does **not** store your configuration files. The primary reason for this is that your database contains encrypted information for two-factor authentication, the CI/CD ‘secure variables’, and so on. Storing encrypted information along with its key in the same place defeats the purpose of using encryption in the first place.

**prerequisites：**

sudo yum install rsync

**START**

```
#手动
sudo gitlab-backup create GZIP_RSYNCABLE=yes 
Creating backup archive: 1599013473_2020_09_02_13.3.0-ee_gitlab_backup.tar ... done
Uploading backup archive to remote storage  ... skipped
Deleting tmp directories ... done
done
done
done
done
done
done
done
Deleting old backups ... skipping
Warning: Your gitlab.rb and gitlab-secrets.json files contain sensitive data
and are not included in this backup. You will need these files to restore a backup.
Please back them up manually.
Backup task is done.

/var/opt/gitlab/backups/1599013473_2020_09_02_13.3.0-ee_gitlab_backup.tar

#自动
sudo su -
crontab -e
0 2 * * * /opt/gitlab/bin/gitlab-backup create GZIP_RSYNCABLE=yes CRON=1
```

```
##STRATEGY:
default streaming strategy:
sudo gitlab-backup create

sudo gitlab-backup create STRATEGY=copy

To make sure the generated archive is intelligently transferable by rsync, the GZIP_RSYNCABLE=yes option can be set. This will set the --rsyncable option to gzip：
sudo gitlab-backup GZIP_RSYNCABLE=yes

##STORE:
Backup create will store a tar file in `/var/opt/gitlab/backups`.

If you want to store your GitLab backups in a different directory, add the following setting to `/etc/gitlab/gitlab.rb` and run `sudo gitlab-ctl reconfigure`:
gitlab_rails['backup_path'] = '/mnt/backups'

##SKIP:
db (database)
uploads (attachments)
repositories (Git repositories data)
builds (CI job output logs)
artifacts (CI job artifacts)
lfs (LFS objects)
registry (Container Registry images)
pages (Pages content)

sudo gitlab-backup create SKIP=db,uploads

In some cases (for example, if the backup is picked up by other backup software) creating a .tar file might be wasted effort or even directly harmful, so you can skip this step by adding tar to the SKIP environment variable:
sudo gitlab-backup create SKIP=tar

##UPLOAD:

Upload to Remote: Specifying a custom directory for backups:
sudo gitlab-backup create DIRECTORY=daily
sudo gitlab-backup create DIRECTORY=weekly

Upload to Local mounted shares:
gitlab_rails['backup_upload_connection'] = {
  :provider => 'Local',
  :local_root => '/mnt/backups'
}

# The directory inside the mounted folder to copy backups to
# Use '.' to store them in the root directory
gitlab_rails['backup_upload_remote_directory'] = 'gitlab_backups'

##PERMISSION:
gitlab_rails['backup_archive_permissions'] = 0644 # Makes the backup archives world-readable


## Limit backup lifetime to 7 days - 604800 seconds
gitlab_rails['backup_keep_time'] = 604800

```

Daily Backup:

```
sudo su -
crontab -e

to schedule the backup for everyday at 2 AM:
0 2 * * * /opt/gitlab/bin/gitlab-backup create CRON=1
```

#### Restore:

**prerequisites**

!!You can only restore a backup to **exactly the same version and type (CE/EE)** of GitLab that you created it on, for example CE 9.1.0!!

need to restore `/etc/gitlab/gitlab-secrets.json`This file contains the database encryption key, [CI/CD variables](https://docs.gitlab.com/ee/ci/variables/README.html#gitlab-cicd-environment-variables), and variables used for [two-factor authentication](https://docs.gitlab.com/ee/user/profile/account/two_factor_authentication.html). If you fail to restore this encryption key file along with the application data backup, users with two-factor authentication enabled and GitLab Runners will lose access to your GitLab server.

- You have run `sudo gitlab-ctl reconfigure` at least once.
- GitLab is running. If not, start it using `sudo gitlab-ctl start`.

**Note:** There is currently a [known issue](https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/3470) for restore not working with `pgbouncer`. In order to workaround the issue, the Rails node will need to bypass `pgbouncer` and connect directly to the primary database node. This can be done by setting `gitlab_rails['db_host']` and `gitlab_rails['port']` to connect to the primary database node and [reconfiguring GitLab](https://docs.gitlab.com/ee/administration/restart_gitlab.html#omnibus-gitlab-reconfigure).

**START:**

make sure your backup tar file is in the backup directory described in the `gitlab.rb` configuration `gitlab_rails['backup_path']`. The default is `/var/opt/gitlab/backups`. It needs to be owned by the `git` user.

```
sudo cp 11493107454_2018_04_25_10.6.4-ce_gitlab_backup.tar /var/opt/gitlab/backups/
sudo chown git.git /var/opt/gitlab/backups/11493107454_2018_04_25_10.6.4-ce_gitlab_backup.tar
```

Stop the processes that are connected to the database. Leave the rest of GitLab running:

```
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop puma
sudo gitlab-ctl stop sidekiq
# Verify
sudo gitlab-ctl status
```

Restore the backup, specifying the timestamp of the backup you wish to restore:

```
# This command will overwrite the contents of your GitLab database! 
sudo gitlab-backup restore BACKUP=11493107454_2018_04_25_10.6.4-ce
```

Next, restore `/etc/gitlab/gitlab-secrets.json` if necessary as mentioned above.

Reconfigure, restart and check GitLab:

```
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
sudo gitlab-rake gitlab:check SANITIZE=true
```



### 服务升级(update policy)+卸载

这里有关于升级的policy：

要注意：大小版本、ce还是ee及安装方法

https://docs.gitlab.com/ee/update/

比如如果是手动rpm package安装，参考：

https://docs.gitlab.com/omnibus/update

有个坑：Praefect和Gitaly升级都没问题，但是对于gitlab server，如果是在停止状态下升级，会出现错误，因为gitlab server升级时会进行自动备份，服务都停了就无法备份了，所以要`sudo touch /etc/gitlab/skip-auto-backup`关掉自动backup即可

另外注意：

When upgrading to a new major version, remember to first [check for background migrations](https://docs.gitlab.com/ee/update/README.html#checking-for-background-migrations-before-upgrading).

关于upgrade path，gitlab不保证每次升级都是100%成功的：

“Although you can generally upgrade through multiple GitLab versions in one go, sometimes this can cause issues.Find where your version sits in the upgrade path below, and upgrade GitLab accordingly, while also consulting the [version-specific upgrade instructions](https://docs.gitlab.com/ee/update/README.html#version-specific-upgrading-instructions)” 例如参考Troubleshooting中的“版本升级后出现500无法访问project”

其他如下：

gitlab-ctl stop的坑：如果刚好你还在某个console里面，stop虽然显示全部down，但是ps -e|grep gitlab以及ps -e|grep postgres还是会看到一堆服务，

~~所以退出正在使用的所有gitlab console，再一次执行gitlab-ctl stop，实在不行进行kill -9或者gitlab-ctl kill <service>~~

如果是卸载还需要关闭一个服务：

```
systemctl disable gitlab-runsvdir
systemctl stop gitlab-runsvdir
```

注意:升级之后,之前的备份就会失效,意思是无法用之前的backup restore,只能降级,所以升级之后建立尽快做备份

```
(optional)
gitlab-ctl cleanse

/root/gitlab-cleanse-2020-08-20T16:28/config_backup

1、停止gitlab
gitlab-ctl stop
2、卸载gitlab（注意这里写的是gitlab-ce）
rpm -e gitlab-ce
#systemctl disable gitlab-runsvdir (如果不想重装)
systemctl stop gitlab-runsvdir
3、查看gitlab进程
ps -lef | grep gitlab
4、杀掉第一个进程（就是带有好多.............的进程）
 kill -9 18777
杀掉后，在ps aux | grep gitlab确认一遍，还有没有gitlab的进程
5、删除所有包含gitlab文件
find / -name gitlab | xargs rm -rf
yum localinstall gitlab-ce-13.0.7-ce.0.el7.x86_64.rpm
scp root@172.26.101.136:/etc/gitlab/gitlab.rb /etc/gitlab/
vim /etc/gitlab/gitlab.rb
# ruby_block[wait for praefect service socket] action run
systemctl start gitlab-runsvdir
gitlab-ctl reconfigure

升级后查看版本号：
https://docs.gitlab.com/omnibus/package-information/
Once the Omnibus GitLab package is installed, all versions of the bundled libraries are located in /opt/gitlab/version-manifest.txt.

gitlab server上可以执行： gitlab-rake gitlab:env:info
Praefect和Gitaly上面不可以，可以通过：
yum list installed|grep "gitlab"
或
cat /opt/gitlab/version-manifest.txt
```

## 5. CICD

https://docs.gitlab.com/ee/ci/README.html

### Overview

CICD 典型workflow

![](/docs/docs_image/software/project_manage/git/gitlab_workflow_example.png)

![](/docs/docs_image/software/project_manage/git/gitlab_workflow_example_extended.png)

1. Verify:
   - Automatically build and test your application with Continuous Integration.
   - Analyze your source code quality with [GitLab Code Quality](https://docs.gitlab.com/ee/user/project/merge_requests/code_quality.html).
   - Determine the browser performance impact of code changes with [Browser Performance Testing](https://docs.gitlab.com/ee/user/project/merge_requests/browser_performance_testing.html). 
   - Determine the server performance impact of code changes with [Load Performance Testing](https://docs.gitlab.com/ee/user/project/merge_requests/load_performance_testing.html). 
   - Perform a series of tests, such as [Container Scanning](https://docs.gitlab.com/ee/user/application_security/container_scanning/index.html) , [Dependency Scanning](https://docs.gitlab.com/ee/user/application_security/dependency_scanning/index.html) , and [Unit tests](https://docs.gitlab.com/ee/ci/unit_test_reports.html).
   - Deploy your changes with [Review Apps](https://docs.gitlab.com/ee/ci/review_apps/index.html) to preview the app changes on every branch.
2. Package:
   - Store Docker images with the [Container Registry](https://docs.gitlab.com/ee/user/packages/container_registry/index.html).
   - Store packages with the [Package Registry](https://docs.gitlab.com/ee/user/packages/package_registry/index.html).
3. Release:
   - Continuous Deployment, automatically deploying your app to production.
   - Continuous Delivery, manually click to deploy your app to production.
   - Deploy static websites with [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/index.html).
   - Ship features to only a portion of your pods and let a percentage of your user base to visit the temporarily deployed feature with [Canary Deployments](https://docs.gitlab.com/ee/user/project/canary_deployments.html). 
   - Deploy your features behind [Feature Flags](https://docs.gitlab.com/ee/operations/feature_flags.html).
   - Add release notes to any Git tag with [GitLab Releases](https://docs.gitlab.com/ee/user/project/releases/index.html).
   - View of the current health and status of each CI environment running on Kubernetes with [Deploy Boards](https://docs.gitlab.com/ee/user/project/deploy_boards.html). 
   - Deploy your application to a production environment in a Kubernetes cluster with [Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/stages.html#auto-deploy).

With GitLab CI/CD you can also:

- Easily set up your app’s entire lifecycle with [Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/index.html).
- Deploy your app to different [environments](https://docs.gitlab.com/ee/ci/environments/index.html).
- Install your own [GitLab Runner](https://docs.gitlab.com/runner/).
- [Schedule pipelines](https://docs.gitlab.com/ee/ci/pipelines/schedules.html).
- Check for app vulnerabilities with [Security Test reports](https://docs.gitlab.com/ee/user/application_security/index.html).

### Setup

```
配置：
GitLab CI/CD is configured by a file called .gitlab-ci.yml placed at the repository’s root. 
逻辑：
This file creates a pipeline, which runs for changes to the code in the repository. Pipelines consist of one or more stages that run in order and can each contain one or more jobs that run in parallel. These jobs (or scripts) get executed by the GitLab Runner agent.
```

.gitlab-ci.yml模板：

https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates



**Pipeline**

https://docs.gitlab.com/ee/ci/pipelines/pipeline_architectures.html

编写.gitlab-ci.yml时可以通过visualize查看pipeline

**Runner&executor**

https://docs.gitlab.com/runner/

https://docs.gitlab.com/runner/executors/README.html

```
配置/注册：
前端UI->Admin Area->Runners 以及 Settings > CI/CD and expand Runners
https://docs.gitlab.com/runner/configuration/advanced-configuration.html
/etc/gitlab-runner/config.toml

After a runner is configured and available for your project, your CI/CD jobs can use the runner.

Specify the name of the runner or its tags in your .gitlab-ci.yml file. Then, when you commit to your repository, the pipeline runs, and the runner’s executor processes the commands.
```

### 案例：JAVA application with Maven

https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/lib/gitlab/ci/templates/Maven.gitlab-ci.yml

```
# Build JAVA applications using Apache Maven (http://maven.apache.org)
# For docker image tags see https://hub.docker.com/_/maven/
#
# For general lifecycle information see https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html

# This template will build and test your projects
# * Caches downloaded dependencies and plugins between invocation.
# * Verify but don't deploy merge requests.
# * Deploy built artifacts from master branch only.

variables:
  # This will suppress any download for dependencies and plugins or upload messages which would clutter the console log.
  # `showDateTime` will show the passed time in milliseconds. You need to specify `--batch-mode` to make this work.
  MAVEN_OPTS: "-Dhttps.protocols=TLSv1.2 -Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=WARN -Dorg.slf4j.simpleLogger.showDateTime=true -Djava.awt.headless=true"
  # As of Maven 3.3.0 instead of this you may define these options in `.mvn/maven.config` so the same config is used
  # when running from the command line.
  # `installAtEnd` and `deployAtEnd` are only effective with recent version of the corresponding plugins.
  MAVEN_CLI_OPTS: "--batch-mode --errors --fail-at-end --show-version -DinstallAtEnd=true -DdeployAtEnd=true"

# This template uses jdk8 for verifying and deploying images
image: maven:3.3.9-jdk-8

# Cache downloaded dependencies and plugins between builds.
# To keep cache across branches add 'key: "$CI_JOB_NAME"'
cache:
  paths:
    - .m2/repository

# For merge requests do not `deploy` but only run `verify`.
# See https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html
.verify: &verify
  stage: test
  script:
    - 'mvn $MAVEN_CLI_OPTS verify'
  except:
    - master

# Verify merge requests using JDK8
verify:jdk8:
  <<: *verify

# To deploy packages from CI, create a ci_settings.xml file
# For deploying packages to GitLab's Maven Repository: See https://docs.gitlab.com/ee/user/project/packages/maven_repository.html#creating-maven-packages-with-gitlab-cicd for more details.
# Please note: The GitLab Maven Repository is currently only available in GitLab Premium / Ultimate.
# For `master` branch run `mvn deploy` automatically.
deploy:jdk8:
  stage: deploy
  script:
    - if [ ! -f ci_settings.xml ];
        then echo "CI settings missing\! If deploying to GitLab Maven Repository, please see https://docs.gitlab.com/ee/user/project/packages/maven_repository.html#creating-maven-packages-with-gitlab-cicd for instructions.";
      fi
    - 'mvn $MAVEN_CLI_OPTS deploy -s ci_settings.xml'
  only:
    - master
```



### 案例：自动生成merge request

https://about.gitlab.com/blog/2017/09/05/how-to-automatically-create-a-new-mr-on-gitlab-with-gitlab-ci/

### 案例 gitlab pages

https://docs.gitlab.com/ee/user/project/pages/getting_started/pages_from_scratch.html

注意这里job的名字是特定的pages，而且不需要配置runner: GitLab executes it in the background and doesn’t use runner.

## 6. Troubleshooting

常用工具

```
gitlab-ctl tail
```



### 创建project以及浏览已有project出现500

经过排查，放弃，重新安装，但是问题依旧，

通过gitlab-ctl tail查log

首先观察gitlab server log

```
==> /var/log/gitlab/gitlab-rails/production_json.log <==
{"method":"POST","path":"/projects","format":"html","controller":"ProjectsController","action":"create","status":500,"time":"2020-08-21T06:41:34.153Z","params":[{"key":"utf8","value":"✓"},{"key":"authenticity_token","value":"[FILTERED]"},{"key":"project","value":{"ci_cd_only":"false","name":"helloworld","namespace_id":"1","path":"helloworld","description":"[FILTERED]","visibility_level":"0"}}],"remote_ip":"10.30.30.94","user_id":1,"username":"root","ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36","queue_duration_s":0.010634,"correlation_id":"s6jJ3TyP8a1","meta.user":"root","meta.caller_id":"ProjectsController#create","gitaly_calls":2,"gitaly_duration_s":0.011436,"redis_calls":14,"redis_duration_s":0.003358,"cpu_s":0.71,"exception.class":"ActionView::Template::Error","exception.message":"7:permission denied","exception.backtrace":["lib/gitlab/gitaly_client.rb:192:in `execute'","lib/gitlab/gitaly_client.rb:170:in `block in call'","lib/gitlab/gitaly_client.rb:198:in `measure_timings'","lib/gitlab/gitaly_client.rb:169:in `call'","lib/gitlab/gitaly_client/ref_service.rb:42:in `default_branch_name'","lib/gitlab/git/repository.rb:90:in `root_ref'","app/models/repository.rb:509:in `root_ref'","lib/gitlab/repository_cache_adapter.rb:84:in `block (2 levels) in cache_method_asymmetrically'","lib/gitlab/repository_cache.rb:44:in `fetch_without_caching_false'","lib/gitlab/repository_cache_adapter.rb:179:in `block (2 levels) in cache_method_output_asymmetrically'","lib/gitlab/safe_request_store.rb:12:in `fetch'","lib/gitlab/repository_cache.rb:25:in `fetch'","lib/gitlab/repository_cache_adapter.rb:178:in `block in cache_method_output_asymmetrically'","lib/gitlab/utils/strong_memoize.rb:30:in `strong_memoize'","lib/gitlab/repository_cache_adapter.rb:192:in `block in memoize_method_output'","lib/gitlab/repository_cache_adapter.rb:201:in `no_repository_fallback'","lib/gitlab/repository_cache_adapter.rb:191:in `memoize_method_output'","lib/gitlab/repository_cache_adapter.rb:177:in `cache_method_output_asymmetrically'","lib/gitlab/repository_cache_adapter.rb:83:in `block in cache_method_asymmetrically'","app/models/repository.rb:646:in `head_commit'","app/models/repository.rb:657:in `tree'","app/models/repository.rb:1010:in `file_on_head'","app/models/repository.rb:561:in `block in avatar'","lib/gitlab/gitaly_client.rb:335:in `allow_n_plus_1_calls'","app/models/repository.rb:560:in `avatar'","lib/gitlab/repository_cache_adapter.rb:21:in `block (2 levels) in cache_method'","lib/gitlab/repository_cache.rb:25:in `fetch'","lib/gitlab/repository_cache_adapter.rb:152:in `block in cache_method_output'","lib/gitlab/utils/strong_memoize.rb:30:in `strong_memoize'","lib/gitlab/repository_cache_adapter.rb:192:in `block in memoize_method_output'","lib/gitlab/repository_cache_adapter.rb:201:in `no_repository_fallback'","lib/gitlab/repository_cache_adapter.rb:191:in `memoize_method_output'","lib/gitlab/repository_cache_adapter.rb:151:in `cache_method_output'","lib/gitlab/repository_cache_adapter.rb:20:in `block in cache_method'","app/models/project.rb:1308:in `avatar_in_git'","app/models/project.rb:1312:in `avatar_url'","app/models/concerns/avatarable.rb:24:in `avatar_url'","app/helpers/page_layout_helper.rb:52:in `page_image'","app/views/layouts/_head.html.haml:27","app/views/layouts/application.html.haml:6","app/controllers/application_controller.rb:132:in `render'","app/controllers/projects_controller.rb:68:in `create'","app/controllers/application_controller.rb:496:in `set_current_admin'","lib/gitlab/session.rb:11:in `with_session'","app/controllers/application_controller.rb:487:in `set_session_storage'","app/controllers/application_controller.rb:481:in `set_locale'","lib/gitlab/error_tracking.rb:48:in `with_context'","app/controllers/application_controller.rb:546:in `sentry_context'","app/controllers/application_controller.rb:474:in `block in set_current_context'","lib/gitlab/application_context.rb:52:in `block in use'","lib/gitlab/application_context.rb:52:in `use'","lib/gitlab/application_context.rb:20:in `with_context'","app/controllers/application_controller.rb:467:in `set_current_context'"],"db_duration_s":0.07781,"view_duration_s":0.0,"duration_s":0.77791}
```

可以看到gitaly-client的permission denied error

然后从Praefect测试到Gitaly nodes的连通性

```
2020/08/21 15:25:38 [tcp://172.26.101.137:8075]: checking health...
2020/08/21 15:25:38 [tcp://172.26.101.138:8075]: dialed successfully!
2020/08/21 15:25:38 [tcp://172.26.101.138:8075]: checking health...
2020/08/21 15:25:38 [tcp://172.26.101.136:8075]: dialed successfully!
2020/08/21 15:25:38 [tcp://172.26.101.136:8075]: checking health...
2020/08/21 15:25:38 [tcp://172.26.101.138:8075]: ERROR: unable to request health check: rpc error: code = PermissionDenied desc = permission denied
2020/08/21 15:25:38 [tcp://172.26.101.137:8075]: ERROR: unable to request health check: rpc error: code = PermissionDenied desc = permission denied
2020/08/21 15:25:38 [tcp://172.26.101.136:8075]: ERROR: unable to request health check: rpc error: code = PermissionDenied desc = permission denied
rpc error: code = PermissionDenied desc = permission denied
```

查到说不是shared secret就是clock drift问题 https://gitlab.com/gitlab-org/gitaly/-/issues/1762

我确认了配置无误，所以应该是clock drift，

通过ntp配置

```
yum install ntp
vim /etc/ntp.conf
systemctl start ntpd
systemctl enable ntpd
```

同步之后再测试，终于可以了

```
WARN[0000] ignoring configured election strategy as failover is disabled  election_strategy=local pid=6972
2020/08/21 17:02:07 [tcp://172.26.101.138:8075]: dialing...
2020/08/21 17:02:07 [tcp://172.26.101.136:8075]: dialing...
2020/08/21 17:02:07 [tcp://172.26.101.137:8075]: dialing...
2020/08/21 17:02:07 [tcp://172.26.101.138:8075]: dialed successfully!
2020/08/21 17:02:07 [tcp://172.26.101.138:8075]: checking health...
2020/08/21 17:02:07 [tcp://172.26.101.136:8075]: dialed successfully!
2020/08/21 17:02:07 [tcp://172.26.101.136:8075]: checking health...
[root@sgkc2-cicd-proxy-v03 opt]# .101.137:8075]: dialed successfully!
```

然后从前端访问测试，发现创建的时候报错503 not available，这又是啥，结果测试从gitlab server到Praefect的连通性，发现Praefect不通，最后发现Praefect忘记启动了！

```
[root@sgkc2-cicd-v01 opt]# gitlab-rake gitlab:gitaly:check
Checking Gitaly ...

Gitaly: ... default ... OK

Checking Gitaly ... Finished
```

总结：

一定要确保连通性！

### repository migration问题

由于安装Gitaly cluster之前已经创建了一个repository，所以需要migration，

https://docs.gitlab.com/ee/administration/gitaly/praefect.html#migrating-existing-repositories-to-praefect

```
curl --request POST --header "Private-Token: <your_access_token>" --header "Content-Type: application/json" \
--data '{"destination_storage_name":"praefect"}' "https://gitlab.example.com/api/v4/projects/123/repository_storage_moves"
```

这个token如何获取呢？

Admin头像->settings->Access Tokens，创建api权限获取token：测试

http://172.26.101.133/api/v4/projects?access_token=5L74k2hxQrKYdKNNG8Ne



api

https://docs.gitlab.com/ee/api/README.html

https://docs.gitlab.com/ee/api/api_resources.html

https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html

### push失败问题

https://gitlab.com/gitlab-org/gitaly/-/issues/3327

```
λ git push upstream someBranch
Enumerating objects: 40, done.
Counting objects: 100% (40/40), done.
Delta compression using up to 8 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (26/26), 18.56 KiB | 1.33 MiB/s, done.
Total 26 (delta 6), reused 0 (delta 0)
remote:
remote: Create merge request for someBranch:
remote:
To http://****.git
   018fd712..ea76148f  someBranch -> someBranch
这个成功了
λ git push origin master
Enumerating objects: 267, done.
Counting objects: 100% (229/229), done.
Delta compression using up to 8 threads
Compressing objects: 100% (63/63), done.
Writing objects: 100% (174/174), 49.63 KiB | 5.51 MiB/s, done.
Total 174 (delta 35), reused 162 (delta 24), pack-reused 0
remote: Resolving deltas: 100% (35/35), completed with 12 local objects.
这个就卡死在这里了
λ git fsck
Checking object directories: 100% (256/256), done.
Checking objects: 100% (29945/29945), done.
dangling blob 9706bd0d4e4b57714071d2f9cfb08461c0600fff
dangling blob 9052226fc23fa9e83043335ea5ec13bc2f724bdc
过了一天再执行就没有dangling blob了，所以这个应该没有什么关系
```

#### git client排查：
https://confluence.atlassian.com/bitbucketserverkb/git-push-fails-fatal-the-remote-end-hung-up-unexpectedly-779171796.html

.git/config
```
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
	packedGitLimit = 512m 
	packedGitWindowSize = 512m
[pack] 
	deltaCacheSize = 2047m 
	packSizeLimit = 2047m 
	windowMemory = 2047m	
[remote "upstream"]
	url = http://****.git
	fetch = +refs/heads/*:refs/remotes/upstream/*
[branch "master"]
	remote = upstream
	merge = refs/heads/master
[gui]
	wmstate = zoomed
	geometry = 1109x563+224+224 442 255
[branch "someBranch"]
	remote = upstream
	merge = refs/heads/someBranch
[remote "origin"]
	url = http://*****.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

#### server端排查：
nginx
https://docs.gitlab.com/omnibus/settings/nginx.html
client_max_body_size 200M;
proxy_read_timeout

/var/log/gitlab/gitlab-workhorse/current
```
{"correlation_id":"FiyLbvdSzA9","error":"handleReceivePack: smarthttp.ReceivePack: rpc error: code = Unavailable desc = PostReceivePack: exit status 128","level":"error","method":"POST","msg":"error","time":"2020-11-25T15:36:17+08:00","uri":"/test/git-receive-pack"}
{"correlation_id":"FiyLbvdSzA9","duration_ms":932,"host":"172.16.101.160","level":"info","method":"POST","msg":"access","proto":"HTTP/1.1","referrer":"","remote_addr":"127.0.0.1:0","remote_ip":"127.0.0.1","status":200,"system":"http","time":"2020-11-25T15:36:17+08:00","uri":"/test/git-receive-pack","user_agent":"git/2.29.2.windows.2","written_bytes":779}
                                                                                                                                                             
{"correlation_id":"CRxXsx22P13","error":"handleReceivePack: smarthttp.ReceivePack: rpc error: code = Internal desc = failed proxying to secondary: rpc error: code = Unavailable desc = PostReceivePack: exit status 128","level":"error","method":"POST","msg":"error","time":"2020-11-25T16:32:25+08:00","uri":"/test/git-receive-pack"}
{"correlation_id":"CRxXsx22P13","duration_ms":548,"host":"172.16.101.160","level":"info","method":"POST","msg":"access","proto":"HTTP/1.1","referrer":"","remote_addr":"127.0.0.1:0","remote_ip":"127.0.0.1","status":200,"system":"http","time":"2020-11-25T16:32:25+08:00","uri":"/test/git-receive-pack","user_agent":"git/2.29.2.windows.2","written_bytes":703}
```
/var/log/gitlab/gitaly/current 或者通过 gitlab-ctl tail gitaly
```
{"correlation_id":"guaTaM5Wcq4","grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"InfoRefsReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/InfoRefsReceivePack","grpc.request.glProjectPath":"test/...","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T01:22:46Z","grpc.time_ms":4.995,"level":"info","msg":"finished streaming call with code OK","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:46.594Z"}
{"correlation_id":"mqo8zmozsw6","diskcache":"25dd57ac-cd11-46e1-9085-e7323e817a0d","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-web","grpc.meta.deadline_type":"regular","grpc.method":"Cleanup","grpc.request.deadline":"2020-11-26T01:22:57Z","grpc.request.fullMethod":"/gitaly.RepositoryService/Cleanup","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.RepositoryService","grpc.start_time":"2020-11-26T01:22:48Z","level":"info","msg":"diskcache state change","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.683Z"}
{"correlation_id":"mqo8zmozsw6","grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-web","grpc.meta.deadline_type":"regular","grpc.method":"Cleanup","grpc.request.deadline":"2020-11-26T01:22:57Z","grpc.request.fullMethod":"/gitaly.RepositoryService/Cleanup","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.RepositoryService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":4.464,"level":"info","msg":"finished unary call with code OK","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.683Z"}
{"correlation_id":"mqo8zmozsw6","grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-web","grpc.meta.deadline_type":"regular","grpc.method":"GetNewLFSPointers","grpc.request.deadline":"2020-11-26T01:23:17Z","grpc.request.fullMethod":"/gitaly.BlobService/GetNewLFSPointers","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.BlobService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":10.164,"level":"info","msg":"finished streaming call with code OK","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.777Z"}
{"correlation_id":"BSJbCoB1SJ8","duration_ms":568,"level":"info","method":"POST","msg":"Finished HTTP request","status":200,"time":"2020-11-26T01:22:48.813Z","url":"http://172.16.101.160/api/v4/internal/allowed"}
{"correlation_id":"UxinibJuxD","duration_ms":45,"level":"info","method":"POST","msg":"Finished HTTP request","status":200,"time":"2020-11-26T01:22:48.859Z","url":"http://172.16.101.160/api/v4/internal/pre_receive"}
{"grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"PreReceiveHook","grpc.request.fullMethod":"/gitaly.HookService/PreReceiveHook","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":616.497,"level":"info","msg":"finished streaming call with code OK","peer.address":"@","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.860Z"}
{"grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"UpdateHook","grpc.request.fullMethod":"/gitaly.HookService/UpdateHook","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":0.222,"level":"info","msg":"finished streaming call with code OK","peer.address":"@","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.877Z"}

{"error":"error voting on transaction: error voting on transaction: transaction was aborted","grpc.code":"Internal","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"ReferenceTransactionHook","grpc.request.fullMethod":"/gitaly.HookService/ReferenceTransactionHook","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":14.148,"level":"error","msg":"finished streaming call with code Internal","peer.address":"@","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.905Z"}
{"error":"error voting on transaction: error voting on transaction: rpc error: code = Internal desc = subtransaction has failed","grpc.code":"Internal","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"ReferenceTransactionHook","grpc.request.fullMethod":"/gitaly.HookService/ReferenceTransactionHook","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T01:22:48Z","grpc.time_ms":1.25,"level":"error","msg":"finished streaming call with code Internal","peer.address":"@","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.919Z"}
{"correlation_id":"CqyeiP2Iyc8","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"PostReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/PostReceivePack","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T01:22:48Z","level":"error","msg":"error executing git hookerror executing git hookfatal: ref updates aborted by hook\\n","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.920Z"}
{"correlation_id":"CqyeiP2Iyc8","diskcache":"3764ffdd-944a-4977-b2ee-faa1360827ca","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"PostReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/PostReceivePack","grpc.request.glProjectPath":"test/....","grpc.request.glRepository":"project-11","grpc.request.repoPath":"@hashed/4f/c8/4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8.git","grpc.request.repoStorage":"gitaly-1","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T01:22:48Z","level":"info","msg":"diskcache state change","peer.address":"172.16.101.162:39070","pid":6702,"span.kind":"server","system":"grpc","time":"2020-11-26T01:22:48.922Z"}
```

log的时区不同？
https://docs.gitlab.com/ee/administration/timezone.html

又尝试清缓存 通过rail console try to clear cache

gitlab-rails console
https://docs.gitlab.com/ee/administration/troubleshooting/gitlab_rails_cheat_sheet.html

```
p=Project.find_by(id:11)

irb(main):026:0> pp p.statistics

irb(main):027:0> p.statistics.refresh!

irb(main):028:0> pp p.statistics

=> #<ProjectStatistics id: 10, project_id: 11, namespace_id: 12, commit_count: 1355, storage_size: 8074035, repository_size: 7990149, lfs_objects_size: 0, build_artifacts_size: 0, shared_runners_seconds: 0, shared_runners_seconds_last_reset: nil, packages_size: 0, wiki_size: 83886, snippets_size: 0, pipeline_artifacts_size: 0>
irb(main):029:0>
```



经过搜索最接近的是这里 https://gitlab.com/gitlab-org/gitaly/-/issues/3128 大概意思因为gitlab今年好像引入了Gitaly的新voting策略 所以看到不少类似问题，我们的不是primary failed vote，而是直接是vote error，因为我们的版本是13.4 他这里说是13.5做了一些关于voting的修正，这也许是为啥gitlab提醒我们 upgrade asap的原因



#### 最终重现

回想过程，想起来是先推送的其他分支，然后才推送了master，重现成功，虽然git client端错误有点不同，不再卡死，而是报错：

```
λ git push origin master
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
error: RPC failed; HTTP 500 curl 22 The requested URL returned error: 500
fatal: the remote end hung up unexpectedly
fatal: the remote end hung up unexpectedly
Everything up-to-date
```

但是服务器端是相同的错误

```
{"correlation_id":"WurcwnEEsXa","error":"handleReceivePack: smarthttp.ReceivePack: rpc error: code = Unavailable desc = PostReceivePack: exit status 128","level":"error","method":"POST","msg":"error","time":"2020-11-26T17:47:48+08:00","uri":"/yue.liu/test-mgr.git/git-receive-pack"}
{"correlation_id":"WurcwnEEsXa","duration_ms":534,"host":"172.16.101.160","level":"info","method":"POST","msg":"access","proto":"HTTP/1.1","referrer":"","remote_addr":"127.0.0.1:0","remote_ip":"127.0.0.1","status":500,"system":"http","time":"2020-11-26T17:47:48+08:00","uri":"/yue.liu/test-mgr.git/git-receive-pack","user_agent":"git/2.29.2.windows.2","written_bytes":0}

{"grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"PreReceiveHook","grpc.request.fullMethod":"/gitaly.HookService/PreReceiveHook","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T09:47:58Z","grpc.time_ms":236.395,"level":"info","msg":"finished streaming call with code OK","peer.address":"@","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.387Z"}
{"grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"UpdateHook","grpc.request.fullMethod":"/gitaly.HookService/UpdateHook","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T09:47:58Z","grpc.time_ms":0.369,"level":"info","msg":"finished streaming call with code OK","peer.address":"@","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.410Z"}
{"error":"error voting on transaction: error voting on transaction: transaction was aborted","grpc.code":"Internal","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"ReferenceTransactionHook","grpc.request.fullMethod":"/gitaly.HookService/ReferenceTransactionHook","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T09:47:58Z","grpc.time_ms":4.137,"level":"error","msg":"finished streaming call with code Internal","peer.address":"@","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.429Z"}
{"error":"error voting on transaction: error voting on transaction: rpc error: code = Internal desc = subtransaction has failed","grpc.code":"Internal","grpc.meta.auth_version":"v2","grpc.meta.deadline_type":"none","grpc.method":"ReferenceTransactionHook","grpc.request.fullMethod":"/gitaly.HookService/ReferenceTransactionHook","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.HookService","grpc.start_time":"2020-11-26T09:47:58Z","grpc.time_ms":1.062,"level":"error","msg":"finished streaming call with code Internal","peer.address":"@","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.444Z"}
{"correlation_id":"WurcwnEEsXa","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"PostReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/PostReceivePack","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T09:47:58Z","level":"error","msg":"error executing git hookerror executing git hookfatal: ref updates aborted by hook\\n","peer.address":"172.16.101.162:54626","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.446Z"}
{"correlation_id":"WurcwnEEsXa","diskcache":"e0a52ce2-2bda-474f-8df5-5ca5537df98c","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"PostReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/PostReceivePack","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T09:47:58Z","level":"info","msg":"diskcache state change","peer.address":"172.16.101.162:54626","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.448Z"}
{"correlation_id":"WurcwnEEsXa","error":"rpc error: code = Canceled desc = rpc error: code = Unavailable desc = PostReceivePack: exit status 128","grpc.code":"Canceled","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-workhorse","grpc.meta.deadline_type":"none","grpc.method":"PostReceivePack","grpc.request.fullMethod":"/gitaly.SmartHTTPService/PostReceivePack","grpc.request.glProjectPath":"yue.liu/test-mgr","grpc.request.glRepository":"project-15","grpc.request.repoPath":"@hashed/e6/29/e629fa6598d732768f7c726b4b621285f9c3b85303900aa912017db7617d8bdb.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.SmartHTTPService","grpc.start_time":"2020-11-26T09:47:58Z","grpc.time_ms":328.75,"level":"info","msg":"finished streaming call with code Canceled","peer.address":"172.16.101.162:54626","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:58.448Z"}
{"correlation_id":"ldjgtuTb099","grpc.code":"OK","grpc.meta.auth_version":"v2","grpc.meta.client_name":"gitlab-web","grpc.meta.deadline_type":"regular","grpc.method":"FindCommit","grpc.request.deadline":"2020-11-26T09:48:28Z","grpc.request.fullMethod":"/gitaly.CommitService/FindCommit","grpc.request.glProjectPath":"test/...","grpc.request.glRepository":"project-9","grpc.request.repoPath":"@hashed/19/58/19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7.git","grpc.request.repoStorage":"gitaly-2","grpc.request.topLevelGroup":"@hashed","grpc.service":"gitaly.CommitService","grpc.start_time":"2020-11-26T09:47:59Z","grpc.time_ms":6.662,"level":"info","msg":"finished unary call with code OK","peer.address":"172.16.101.162:54626","pid":6188,"span.kind":"server","system":"grpc","time":"2020-11-26T09:47:59.660Z"}
```

### 版本升级后出现500无法访问project

```
还是常规操作查看gitlab server日志，刚开始我是一个个日志去/var/log/gitlab里面看，结果没发现异常，然后又去到Praefect和Gitaly都没异常，说明从gitlab server到Praefect到Gitaly一路畅通，最后其实是我漏了gitlab server的一些日志，通过这个命令可以看全面：
gitlab-ctl tail
==> /var/log/gitlab/nginx/gitlab_access.log <==
10.30.30.94 - - [11/Dec/2020:11:15:26 +0800] "GET /assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png HTTP/1.1" 200 1611 "http://172.26.101.133/dummyproject/dummy_project" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36" -

==> /var/log/gitlab/puma/puma_stdout.log <==
{"timestamp":"2020-12-11T03:15:27.086Z","pid":10524,"message":"PumaWorkerKiller: Consuming 7400.09765625 mb with master and 8 workers."}

==> /var/log/gitlab/gitlab-rails/production.log <==
Started GET "/dummyproject/dummy_project" for 10.30.30.94 at 2020-12-11 11:15:30 +0800
Processing by ProjectsController#show as HTML
  Parameters: {"namespace_id"=>"dummyproject", "id"=>"dummy_project"}
Completed 500 Internal Server Error in 123ms (ActiveRecord: 11.4ms | Elasticsearch: 0.0ms | Allocations: 30989)

==> /var/log/gitlab/gitlab-rails/production_json.log <==
{"method":"GET","path":"/dummyproject/dummy_project","format":"html","controller":"ProjectsController","action":"show","status":500,"time":"2020-12-11T03:15:30.561Z","params":[{"key":"namespace_id","value":"dummyproject"},{"key":"id","value":"dummy_project"}],"remote_ip":"10.30.30.94","user_id":1,"username":"root","ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0","correlation_id":"QlUs3cmwEw6","meta.user":"root","meta.project":"dummyproject/dummy_project","meta.root_namespace":"dummyproject","meta.caller_id":"ProjectsController#show","meta.feature_category":"projects","gitaly_calls":2,"gitaly_duration_s":0.015953,"redis_calls":18,"redis_duration_s":0.0048839999999999995,"redis_read_bytes":2804,"redis_write_bytes":2499,"redis_cache_calls":17,"redis_cache_duration_s":0.004227,"redis_cache_read_bytes":2621,"redis_cache_write_bytes":973,"redis_shared_state_calls":1,"redis_shared_state_duration_s":0.000657,"redis_shared_state_read_bytes":183,"redis_shared_state_write_bytes":1526,"queue_duration_s":0.136449,"cpu_s":0.26,"exception.class":"ActionView::Template::Error","exception.message":"undefined method `change_reviewer_merge_request' for #<NotificationSetting:0x00007f75ceb68438>","exception.backtrace":["app/views/shared/notifications/_custom_notifications.html.haml:29:in `public_send'","app/views/shared/notifications/_custom_notifications.html.haml:29","app/views/shared/notifications/_custom_notifications.html.haml:25:in `each'","app/views/shared/notifications/_custom_notifications.html.haml:25:in `each_with_index'","app/views/shared/notifications/_custom_notifications.html.haml:25","app/views/shared/notifications/_custom_notifications.html.haml:14","app/views/shared/notifications/_new_button.html.haml:34","app/views/shared/notifications/_new_button.html.haml:33","app/views/shared/notifications/_new_button.html.haml:12","app/views/projects/_home_panel.html.haml:47","app/views/projects/show.html.haml:12","app/controllers/application_controller.rb:134:in `render'","app/controllers/application_controller.rb:548:in `block in allow_gitaly_ref_name_caching'","lib/gitlab/gitaly_client.rb:318:in `allow_ref_name_caching'","app/controllers/application_controller.rb:547:in `allow_gitaly_ref_name_caching'","ee/lib/gitlab/ip_address_state.rb:10:in `with'","ee/app/controllers/ee/application_controller.rb:44:in `set_current_ip_address'","app/controllers/application_controller.rb:493:in `set_current_admin'","lib/gitlab/session.rb:11:in `with_session'","app/controllers/application_controller.rb:484:in `set_session_storage'","lib/gitlab/i18n.rb:73:in `with_locale'","lib/gitlab/i18n.rb:79:in `with_user_locale'","app/controllers/application_controller.rb:478:in `set_locale'","lib/gitlab/error_tracking.rb:52:in `with_context'","app/controllers/application_controller.rb:543:in `sentry_context'","app/controllers/application_controller.rb:471:in `block in set_current_context'","lib/gitlab/application_context.rb:54:in `block in use'","lib/gitlab/application_context.rb:54:in `use'","lib/gitlab/application_context.rb:21:in `with_context'","app/controllers/application_controller.rb:463:in `set_current_context'","lib/gitlab/metrics/elasticsearch_rack_middleware.rb:16:in `call'","lib/gitlab/middleware/rails_queue_duration.rb:33:in `call'","lib/gitlab/metrics/rack_middleware.rb:16:in `block in call'","lib/gitlab/metrics/transaction.rb:61:in `run'","lib/gitlab/metrics/rack_middleware.rb:16:in `call'","lib/gitlab/request_profiler/middleware.rb:17:in `call'","lib/gitlab/jira/middleware.rb:19:in `call'","lib/gitlab/middleware/go.rb:20:in `call'","lib/gitlab/etag_caching/middleware.rb:13:in `call'","lib/gitlab/middleware/multipart.rb:218:in `call'","lib/gitlab/middleware/handle_null_bytes.rb:19:in `call'","lib/gitlab/middleware/read_only/controller.rb:51:in `call'","lib/gitlab/middleware/read_only.rb:18:in `call'","lib/gitlab/middleware/same_site_cookies.rb:27:in `call'","lib/gitlab/middleware/basic_health_check.rb:25:in `call'","lib/gitlab/middleware/handle_ip_spoof_attack_error.rb:25:in `call'","lib/gitlab/middleware/request_context.rb:23:in `call'","config/initializers/fix_local_cache_middleware.rb:9:in `call'","lib/gitlab/metrics/requests_rack_middleware.rb:49:in `call'","lib/gitlab/middleware/release_env.rb:12:in `call'"],"db_duration_s":0.01144,"view_duration_s":0.0,"duration_s":0.12355,"db_count":26,"db_write_count":0,"db_cached_count":4}
==> /var/log/gitlab/gitlab-rails/production.log <==

ActionView::Template::Error (undefined method `change_reviewer_merge_request' for #<NotificationSetting:0x00007f75ceb68438>):
    26:                   - field_id = "#{notifications_menu_identifier("modal", notification_setting)}_notification_setting[#{event}]"
    27:                   .form-group
    28:                     .form-check{ class: ("gl-mt-0" if index == 0) }
    29:                       = check_box("notification_setting", event, id: field_id, class: "js-custom-notification-event form-check-input", checked: notification_setting.public_send(event))
    30:                       %label.form-check-label{ for: field_id }
    31:                         %strong
    32:                           = notification_event_name(event)

app/views/shared/notifications/_custom_notifications.html.haml:29:in `public_send'
app/views/shared/notifications/_custom_notifications.html.haml:29
app/views/shared/notifications/_custom_notifications.html.haml:25:in `each'
app/views/shared/notifications/_custom_notifications.html.haml:25:in `each_with_index'
app/views/shared/notifications/_custom_notifications.html.haml:25
app/views/shared/notifications/_custom_notifications.html.haml:14
app/views/shared/notifications/_new_button.html.haml:34
app/views/shared/notifications/_new_button.html.haml:33
app/views/shared/notifications/_new_button.html.haml:12
app/views/projects/_home_panel.html.haml:47
app/views/projects/show.html.haml:12
app/controllers/application_controller.rb:134:in `render'
app/controllers/application_controller.rb:548:in `block in allow_gitaly_ref_name_caching'
lib/gitlab/gitaly_client.rb:318:in `allow_ref_name_caching'
app/controllers/application_controller.rb:547:in `allow_gitaly_ref_name_caching'
ee/lib/gitlab/ip_address_state.rb:10:in `with'
ee/app/controllers/ee/application_controller.rb:44:in `set_current_ip_address'
app/controllers/application_controller.rb:493:in `set_current_admin'
lib/gitlab/session.rb:11:in `with_session'
app/controllers/application_controller.rb:484:in `set_session_storage'
lib/gitlab/i18n.rb:73:in `with_locale'
lib/gitlab/i18n.rb:79:in `with_user_locale'
app/controllers/application_controller.rb:478:in `set_locale'
lib/gitlab/error_tracking.rb:52:in `with_context'
app/controllers/application_controller.rb:543:in `sentry_context'
app/controllers/application_controller.rb:471:in `block in set_current_context'
lib/gitlab/application_context.rb:54:in `block in use'
lib/gitlab/application_context.rb:54:in `use'
lib/gitlab/application_context.rb:21:in `with_context'
app/controllers/application_controller.rb:463:in `set_current_context'
lib/gitlab/metrics/elasticsearch_rack_middleware.rb:16:in `call'
lib/gitlab/middleware/rails_queue_duration.rb:33:in `call'
lib/gitlab/metrics/rack_middleware.rb:16:in `block in call'
lib/gitlab/metrics/transaction.rb:61:in `run'
lib/gitlab/metrics/rack_middleware.rb:16:in `call'
lib/gitlab/request_profiler/middleware.rb:17:in `call'
lib/gitlab/jira/middleware.rb:19:in `call'
lib/gitlab/middleware/go.rb:20:in `call'
lib/gitlab/etag_caching/middleware.rb:13:in `call'
lib/gitlab/middleware/multipart.rb:218:in `call'
lib/gitlab/middleware/handle_null_bytes.rb:19:in `call'
lib/gitlab/middleware/read_only/controller.rb:51:in `call'
lib/gitlab/middleware/read_only.rb:18:in `call'
lib/gitlab/middleware/same_site_cookies.rb:27:in `call'
lib/gitlab/middleware/basic_health_check.rb:25:in `call'
lib/gitlab/middleware/handle_ip_spoof_attack_error.rb:25:in `call'
lib/gitlab/middleware/request_context.rb:23:in `call'
config/initializers/fix_local_cache_middleware.rb:9:in `call'
lib/gitlab/metrics/requests_rack_middleware.rb:49:in `call'
lib/gitlab/middleware/release_env.rb:12:in `call'

==> /var/log/gitlab/gitlab-workhorse/current <==
{"content_type":"text/html; charset=utf-8","correlation_id":"QlUs3cmwEw6","duration_ms":297,"host":"172.26.101.133","level":"info","method":"GET","msg":"access","proto":"HTTP/1.1","referrer":"http://172.26.101.133/","remote_addr":"127.0.0.1:0","remote_ip":"127.0.0.1","status":500,"system":"http","time":"2020-12-11T11:15:30+08:00","uri":"/dummyproject/dummy_project","user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0","written_bytes":2926}

很容易就发现：
ActionView::Template::Error (undefined method `change_reviewer_merge_request'这段，通过在gitlab.com 搜索后面的详情第一个error：“app/views/shared/notifications/_custom_notifications.html.haml:29:in `public_send'”
得到：
https://gitlab.com/gitlab-org/gitlab/-/issues/5752
然后根据提示检查db migration：

gitlab-rake db:migrate:status
发现很多down的
[root@sgkc2-cicd-v01 opt]# gitlab-rake db:migrate:status|grep notification
   up     20190115054216  Add error notification sent to remote mirrors
   up     20190320174702  Add lets encrypt notification email to application settings
   up     20190327163904  Add notification email to notification settings
   up     20190606014128  Add last ci minutes notification at to namespaces
   up     20190621022810  Add last ci minutes usage notification level to namespaces
   up     20190930082942  Add new release to notification settings
   up     20191014123159  Add expire notification delivered to personal access tokens
   up     20191111165017  Add fixed pipeline to notification settings
   up     20200311192351  Add index on noteable type and noteable id to sent notifications
   up     20200717163656  Add moved project to notification settings
   up     20200729151021  Add after expiry notification delivered to personal access tokens
  down    20200909083339  Add change reviewer merge request to notification settings
  down    20200912152943  Rename admin notification email application setting
  down    20200912153218  Cleanup admin notification email application setting rename
  
gitlab-rails dbconsole
\d notification_settings
确实没有 change_reviewer_merge_request
然后 gitlab-rake db:migrate:status|grep notification_settings 会看到相关的脚本基本都down
修复很简单，执行
gitlab-rake db:migrate
	
```

### Malformed configuration JSON file found at /opt/gitlab/embedded/nodes/XXXX.json

```
# yum history info 21
Loaded plugins: product-id, search-disabled-repos, subscription-manager

This system is not registered with an entitlement server. You can use subscription-manager to register.

Transaction ID : 21
Begin time     : Wed Dec 23 10:30:02 2020
Begin rpmdb    : 428:92019b90dfb62522e2602a67ec8bb622df3d807c
End time       :            10:30:10 2020 (8 seconds)
End rpmdb      : 428:92019b90dfb62522e2602a67ec8bb622df3d807c
User           : root <root>
Return-Code    : Failure: 1
Command Line   : -d 2 -y install /opt/gitlab-ee-13.5.1-ee.0.el7.x86_64.rpm
Transaction performed with:
    Installed     rpm-4.11.3-43.el7.x86_64                    @APEX
    Installed     subscription-manager-1.24.26-3.el7_8.x86_64 @APEX
    Installed     yum-3.4.3-167.el7.noarch                    @APEX
Packages Altered:
 ** Updated gitlab-ee-13.5.0-ee.0.el7.x86_64 @/gitlab-ee-13.5.0-ee.0.el7.x86_64
 ** Update            13.5.1-ee.0.el7.x86_64 ?
Scriptlet output:
   1 Malformed configuration JSON file found at /opt/gitlab/embedded/nodes/xxxxx.json.
   2 This usually happens when your last run of `gitlab-ctl reconfigure` didn't complete successfully.
   3 This file is used to check if any of the unsupported configurations are enabled,
   4 and hence require a working reconfigure before upgrading.
   5 Please run `sudo gitlab-ctl reconfigure` to fix it and try again.
   6 error: %pre(gitlab-ee-13.5.1-ee.0.el7.x86_64) scriptlet failed, exit status 1
```



1. 升级报错“Malformed configuration JSON file found at /opt/gitlab/embedded/nodes/XXX.json.”
2. 然后根据这个错误我看了下这个文件内只是一个简单的hostname，而且是正常Jason格式，根据 https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/4385 中有人提到删除该文件即可正常升级
3. 然后根据log提示 “Please run `sudo gitlab-ctl reconfigure` to fix it and try again”决定执行 reconfigure看看，结果仍然报错，不过错误信息是：“ruby_block[directory resource: /var/opt/gitlab/git-data/repositories] (/opt/gitlab/embedded/cookbooks/cache/cookbooks/package/resources/storage_directory.rb line 34) had an error: Mixlib::ShellOut::ShellCommandFailed: Failed asserting that mode permissions on "/var/opt/gitlab/git-data/repositories"”
4.根据第3的错误搜索，发现 https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/5743，确定是版本13.5.0自己的问题，说是升级到13.5.1就解决了
4. 所以，13.5.0的一个bug造成无法reconfigure，只能通过升级解决，但是升级又遇到所谓malformed json错误，提示reconfigure解决，deadlock！
5. 最终解决，采用别人提到的尝试删除/opt/gitlab/embedded/nodes/XXXX.json，再次升级成功！

### gitlab-backup备份定时任务失败

通过查crontab的相关日志以及 /var/mail/root，发现是配置的目录没有权限

但是实际上改目录已经chown给了git用户，最后发现是git对这个目录的父目录没有权限！



## Appendix

防火墙状态：

sudo firewall-cmd --list-all

### gitlab-ctl

```
[liuyue@sgkc2-cicd-v02 ~]$ gitlab-ctl help
omnibus-ctl: command (subcommand)
check-config
  Check if there are any configuration in gitlab.rb that is removed in specified version
deploy-page
  Put up the deploy page
diff-config
  Compare the user configuration with package available configuration
get-redis-master
  Get connection details to Redis master
prometheus-upgrade
  Upgrade the Prometheus data to the latest supported version
remove-accounts
  Delete *all* users and groups used by this package
reset-grafana
  Reset Grafana instance to its initial state by removing the data directory
set-grafana-password
  Reset admin password for Grafana
upgrade
  Run migrations after a package upgrade
General Commands:
  cleanse
    Delete *all* gitlab data, and start from scratch.
  help
    Print this help message.
  reconfigure
    Reconfigure the application.
  show-config
    Show the configuration that would be generated by reconfigure.
  uninstall
    Kill all processes and uninstall the process supervisor (data will be preserved).
Service Management Commands:
  graceful-kill
    Attempt a graceful stop, then SIGKILL the entire process group.
  hup
    Send the services a HUP.
  int
    Send the services an INT.
  kill
    Send the services a KILL.
  once
    Start the services if they are down. Do not restart them if they stop.
  restart
    Stop the services if they are running, then start them again.
  service-list
    List all the services (enabled services appear with a *.)
  start
    Start services if they are down, and restart them if they stop.
  status
    Show the status of all the services.
  stop
    Stop the services, and do not restart them.
  tail
    Watch the service logs of all enabled services.
  term
    Send the services a TERM.
  usr1
    Send the services a USR1.
  usr2
    Send the services a USR2.
Backup Commands:
  backup-etc
    Backup GitLab configuration [accepts directory path]
Let's Encrypt Commands:
  renew-le-certs
    Renew the existing Let's Encrypt certificates
Database Commands:
  pg-password-md5
    Generate MD5 Hash of user password in PostgreSQL format
  pg-upgrade
    Upgrade the PostgreSQL DB to the latest supported version
  revert-pg-upgrade
    Run this to revert to the previous version of the database
  set-replication-password
    Set database replication password
Container Registry Commands:
  registry-garbage-collect
    Run Container Registry garbage collection.
```

### gitlab-rails

```
[liuyue@sgkc2-cicd-v02 opt]$ sudo gitlab-rails help
[sudo] password for liuyue:
The most common rails commands are:
 generate     Generate new code (short-cut alias: "g")
 console      Start the Rails console (short-cut alias: "c")
 server       Start the Rails server (short-cut alias: "s")
 test         Run tests except system tests (short-cut alias: "t")
 test:system  Run system tests
 dbconsole    Start a console for the database specified in config/database.yml
              (short-cut alias: "db")

 new          Create a new Rails application. "rails new my_app" creates a
              new application called MyApp in "./my_app"


All commands can be run with -h (or --help) for more information.
In addition to those commands, there are:

--------------------------------------------------------------------------------
 GitLab:       13.0.7 (bcfbac449a7) FOSS
 GitLab Shell: 13.2.0
 PostgreSQL:   11.7
--------------------------------------------------------------------------------
  about
  acts_as_taggable_on_engine:install:migrations
  acts_as_taggable_on_engine:tag_names:collate_bin
  acts_as_taggable_on_engine:tag_names:collate_ci
  app:template
  app:update
  assets:clean[keep]
  assets:clobber
  assets:environment
  assets:precompile                                              
brakeman                                                       
cache:clear:redis                                              
cache_digests:dependencies                                     
cache_digests:nested_dependencies                              
ci:cleanup:builds                                              
clean                                                          
clobber                                                        
config_lint                                                    
credentials:edit                                               
credentials:show                                               
danger_local                                                   
db:create                                                      
db:drop                                                        
db:environment:set                                             
db:fixtures:load                                               
db:load_config                                                 
db:migrate                                                     
db:migrate:status                                              
db:obsolete_ignored_columns                                    
db:prepare                                                     
db:rollback                                                    
db:schema:cache:clear                                          
db:schema:cache:dump                                           
db:schema:dump                                                 
db:schema:load                                                 
db:seed                                                        
db:seed:replant                                                
db:seed_fu                                                     
db:setup                                                       
db:structure:dump                                              
db:structure:load                                              
db:system:change                                               
db:version                                                     
destroy                                                        
dev:cache                                                      
dev:load                                                       
dev:setup                                                      
downtime_check                                                 
encrypted:edit                                                 
encrypted:show                                                 
file_hooks:validate
  gemojione:aliases
  gemojione:install_assets
  gettext:add_language[language]
  gettext:find
  gettext:lint
  gettext:pack
  gettext:po_to_json
  gettext:regenerate
  gettext:store_model_attributes
  gitlab:app:check
  gitlab:artifacts:check
  gitlab:artifacts:migrate
  gitlab:assets:clean
  gitlab:assets:compile
  gitlab:assets:compile_webpack_if_needed
  gitlab:assets:fix_urls
  gitlab:assets:purge
  gitlab:assets:purge_modules
  gitlab:assets:vendor
  gitlab:backup:create
  gitlab:backup:restore
  gitlab:check
  gitlab:cleanup:block_removed_ldap_users
  gitlab:cleanup:moved
  gitlab:cleanup:orphan_job_artifact_files
  gitlab:cleanup:orphan_lfs_file_references
  gitlab:cleanup:orphan_lfs_files
  gitlab:cleanup:project_uploads
  gitlab:cleanup:remote_upload_files
  gitlab:cleanup:sessions:active_sessions_lookup_keys
  gitlab:db:clean_structure_sql
  gitlab:db:composite_primary_keys_add
  gitlab:db:composite_primary_keys_drop
  gitlab:db:configure
  gitlab:db:downtime_check[ref]
  gitlab:db:drop_tables
  gitlab:db:mark_migration_complete[version]
  gitlab:db:setup_ee
   gitlab:env:info
  gitlab:exclusive_lease:clear[scope]
  gitlab:features:enable_rugged
  gitlab:generate_sample_prometheus_data[environment_id]
  gitlab:git:fsck
  gitlab:gitaly:check
  gitlab:gitaly:install[dir,storage_path,repo]
  gitlab:gitlab_shell:check
  gitlab:import:all_users_to_all_groups
  gitlab:import:all_users_to_all_projects
  gitlab:import:repos[import_path]
  gitlab:import:user_to_groups[email]
  gitlab:import:user_to_projects[email]
  gitlab:import_export:bump_version
  gitlab:import_export:data
  gitlab:import_export:export[username,namespace_path,project_path,archive_path]
  gitlab:import_export:import[username,namespace_path,project_path,archive_path]
  gitlab:import_export:version
  gitlab:incoming_email:check
  gitlab:ldap:rename_provider[old_provider,new_provider]
  gitlab:lfs:check
  gitlab:lfs:migrate
  gitlab:orphans:check
  gitlab:orphans:check_namespaces
  gitlab:orphans:check_repositories
  gitlab:praefect:replicas[project_id]
  gitlab:seed:group_seed[subgroups_depth,username]
  gitlab:seed:issues[project_full_path,backfill_weeks,average_issues_per_week]
  gitlab:setup
  gitlab:shell:build_missing_projects
  gitlab:shell:install[repo]
  gitlab:shell:setup
  gitlab:sidekiq:check
  gitlab:snippets:list_non_migrated
  gitlab:snippets:migrate[ids]
  gitlab:snippets:migration_status
  gitlab:storage:hashed_attachments
  gitlab:storage:hashed_projects
  gitlab:storage:legacy_attachments
  gitlab:storage:legacy_projects
  gitlab:storage:list_hashed_attachments
  gitlab:storage:list_hashed_projects
   gitlab:storage:list_legacy_attachments
  gitlab:storage:list_legacy_projects
  gitlab:storage:migrate_to_hashed
  gitlab:storage:rollback_to_legacy
  gitlab:tcp_check[host,port]
  gitlab:test
  gitlab:two_factor:disable_for_all_users
  gitlab:two_factor:rotate_key:apply
  gitlab:two_factor:rotate_key:rollback
  gitlab:update_project_templates
  gitlab:update_templates
  gitlab:uploads:check
  gitlab:uploads:migrate:all
  gitlab:uploads:migrate[uploader_class,model_class,mounted_as]
  gitlab:uploads:migrate_to_local:all
  gitlab:uploads:migrate_to_local[uploader_class,model_class,mounted_as]
  gitlab:uploads:sanitize:remove_exif[start_id,stop_id,dry_run,sleep_time,uploader,since]
  gitlab:web_hook:add
  gitlab:web_hook:list
  gitlab:web_hook:rm
  gitlab:workhorse:install[dir,repo]
  gitlab:x509:update_signatures
  grape:path_helpers
  grape:routes
  hipchat:send[message]
  import:github[token,gitlab_username,project_path]
  initializers
  jira:generate_consumer_key
  jira:generate_public_cert
  log:clear
  metrics:setup_common_metrics
  middleware
  migrate_iids
  notes
  postgresql_md5_hash
  restart
  routes
  runner
  secret
  secrets:edit
  secrets:setup
  secrets:show
  setup
  stats
  test:db
  time:zones[country_or_offset]
  tmp:clear
  tmp:create
  tokens:reset_all_email
  tokens:reset_all_feed
  version
  webpack:compile
  yarn
  yarn:available
  yarn:check
  yarn:clobber
  yarn:install
  zeitwerk:check
```
