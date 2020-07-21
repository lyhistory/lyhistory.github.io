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

### 1.1 dependency

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

### 1.2 rpm安装

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

log路径：

/var/log/gitlab/

### 1.3 Configuration

https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md

#### 1.3.1 前端gitlab-server url和api

/etc/gitlab/gitlab.rb

​	change external_url="http://172.26.101.133:8088"

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

#### 1.3.2 监控grafana

**基本登录**

首先login配置（通过gitlab server第三方登录）

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



#### 1.3.3 邮箱

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

#### 1.3.4 postgresql

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

#### 1.3.5 gitaly

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

#### 1.3.6 日志logrotate

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

#### 1.3.7 SSL & SSH

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



## 3. High Availability

gitlab内部可以做给个部分的ha，比如

1. [Configure the database](https://docs.gitlab.com/ee/administration/postgresql/replication_and_failover.html)
2. [Configure Redis](https://docs.gitlab.com/ee/administration/high_availability/redis.html)
3. [Configure NFS](https://docs.gitlab.com/ee/administration/high_availability/nfs.html)
4. [Configure the GitLab application servers](https://docs.gitlab.com/ee/administration/high_availability/gitlab.html)

不过需要注意的是，NFS在新版已经deprecated并且会被删除

high_availability['mountpoint'] 

https://docs.gitlab.com/ee/administration/high_availability/gitlab.html

https://docs.gitlab.com/ee/administration/high_availability/nfs.html

**Caution:** From GitLab 13.0, using NFS for Git repositories is deprecated. In GitLab 14.0, support for NFS for Git repositories is scheduled to be removed. Upgrade to [Gitaly Cluster](https://docs.gitlab.com/ee/administration/gitaly/praefect.html) as soon as possible.

可以看到官方已经不推荐了

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

/opt/gitlab/embedded/bin/psql -U postgres -d gitlabhq_production -h <POSTGRESQL_SERVER_ADDRESS>

登录失败！

切换成os root用户 sudo su

然后执行  su - postgres

进入bash，输入psql就进入到plsql命令窗口，执行\l就可以看到所有db

理解一下posgresql的用户概念

https://www.liquidweb.com/kb/what-is-the-default-password-for-postgresql/

本机如果直接通过plsql连接，可以修改local用户(默认用户postgres)：

https://www.hostinger.com/tutorials/how-to-install-postgresql-on-centos-7/

```
psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'NewPassword';"
```

https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge



远程连接：

https://blog.csdn.net/zhangzeyuaaa/article/details/77941039

开启监听：

 /var/lib/pgsql/12/data/postgresql.conf

listen_addresses = '*'          # what IP address(es) to listen on;

md5方式：

vim /var/lib/pgsql/12/data/pg_hba.conf

`host    all             all             0.0.0.0/0            md5`

```
su - postgres

psql
create user gitlabuser password 'gitlab';
CREATE ROLE praefect WITH LOGIN CREATEDB PASSWORD 'PRAEFECT_SQL_PASSWORD';

/opt/gitlab/embedded/bin/psql -U praefect -d template1 -h 172.26.101.134

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

开启端口：

firewall-cmd --permanent --add-port=5432/tcp

firewall-cmd --reload



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

```
postgresql server open port 5432 to praefect server;
​	on praefect server: sudo -u git /opt/gitlab/embedded/bin/praefect -config /var/opt/gitlab/praefect/config.toml sql-ping

praefect server open port 2305 and 9652 to gitlab server;
​	on gitlab server: gitlab-rake gitlab:gitaly:check

gitlab server open api 8080? to gitaly server;
​	on gitaly nodes: /opt/gitlab/embedded/service/gitlab-shell/bin/check -config /opt/gitlab/embedded/service/gitlab-shell/config.yml

gitaly server open 9236 to gitlab server;	

gitaly server open 8075 to praefect server; 
​	on praefect server: sudo /opt/gitlab/embedded/bin/praefect -config /var/opt/gitlab/praefect/config.toml dial-nodes

Praefect的9652 和 Gitaly的9236：
grafana打开explorer，输入gitlab_build_info
```

### 3.2 Load Balancer

https://docs.gitlab.com/ee/administration/high_availability/load_balancer.html#load-balancer-for-multi-node-gitlab

这个是在gitlab scope之外，采用外部的负载均衡，

在上面Gitaly cluster的官方文档关于Praefect部分是有load Balancer的要求，不过我们忽略了，可以加上，

另外gitlab-server nginx部分也可以用上load Balancer多个gitlab server，不过这个需要看官方的支持，主要是数据的同步问题



### 3.3 Postgresql Replication 

GEO 这个不需要https://docs.gitlab.com/ee/administration/geo/replication/index.html

需要的是gitlab-server Application Database和Praefect tracking database

### 3.4 HA Roles

https://docs.gitlab.com/omnibus/roles/README.html#

The majority of the following roles will only work on a GitLab Enterprise Edition, meaning a gitlab-ee Omnibus package. It will be mentioned next to each role.

没太搞懂，直接通过配置多个节点？ee才可以用

redis roles

https://docs.gitlab.com/omnibus/roles/README.html#redis-server-roles

## 4. Maintenance 维护

https://docs.gitlab.com/omnibus/maintenance/README.html

### 停止服务

gitlab-ctl stop的坑：如果刚好你还在某个console里面，stop虽然显示全部down，但是ps -e|grep gitlab以及ps -e|grep postgres还是会看到一堆服务，

~~所以退出正在使用的所有gitlab console，再一次执行gitlab-ctl stop，实在不行进行kill -9或者gitlab-ctl kill <service>~~

最终发现还需要关闭一个服务：

```
systemctl disable gitlab-runsvdir
systemctl stop gitlab-runsvdir
```

### 升级 卸载

1、停止gitlab
 `gitlab-ctl stop`

2、卸载gitlab（注意这里写的是gitlab-ce）
 `rpm -e gitlab-ce`

3、查看gitlab进程
 `ps aux | grep gitlab`

`ps -e | grep gitlab`

4、杀掉第一个进程（就是带有好多.............的进程）
 `kill -9 18777`

杀掉后，在ps aux | grep gitlab确认一遍，还有没有gitlab的进程

5、删除所有包含gitlab文件
 `find / -name gitlab | xargs rm -rf`

### gitlab server(workhorse)

gitlab-rails console >> users and products

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



## 5. 内置服务替换探索

！！强烈不建议，因为会影响后续升级！！



### 替换内置服务

nginx

jianshu.com/p/123778a515ca

grafana

postgresql



反向代理

https://cloud.tencent.com/developer/article/1437220

配置排查参考：blog.csdn.net/weixin_43748870/article/details/86178042



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
