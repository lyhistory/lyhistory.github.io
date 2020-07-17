## Architecture

https://docs.gitlab.com/ee/development/architecture.html

https://about.gitlab.com/handbook/engineering/infrastructure/production/architecture/#service-architecture

https://juejin.im/post/5cf67d355188255508118def

完整文档

https://docs.gitlab.com/omnibus/README.html#installation-and-configuration-using-omnibus-package



![](./gitlab-server.png)



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



### http/https over nginx:

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



### ssh over gitlab-shell

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

## Install 安装

https://git-scm.com/book/en/v2/Git-on-the-Server-GitLab

ce版本源码：https://gitlab.com/gitlab-org/gitlab-foss/-/tree/master

官方安装文档：https://about.gitlab.com/install/#centos-7

下面采用离线安装 https://docs.gitlab.com/omnibus/manual_install.html

### dependency

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

### 手动rpm安装

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
```

启动：

sudo gitlab-ctl reconfigure



安装后路径：

/var/opt/gitlab/

/var/opt/gitlab/nginx/conf/gitlab-http.conf

log路径：

/var/log/gitlab/

### Configuration

https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md

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

这个reconfigure会将配置进行“分发”：

比如端口和ip赋值给：

/var/opt/gitlab/nginx/conf/gitlab-http.conf（模板/opt/gitlab/embedded/conf/nginx.conf ?）

 /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml（模板：/opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml.exmaple）

#### 前端 dashboard & grafana

http://172.26.101.133:8088

默认用户名root/ admin@example.com 可以从log中获取：

sudo grep -nr "admin" /var/log/gitlab/

​	/var/log/gitlab/gitlab-rails/application.log

监控前端（从nginx配置获取）：

172.26.101.134:8088/-/grafana/login

注意这个8088也将会是Gitaly集群的internal_api_url



/opt/gitlab/embedded/service/gitlab-shell/config.yml

~~注意此处要手动修改gitlab_url，不知为何reconfigure没有生效到这里~~ 应该不需要修改，默认就是8080，对应puma-worker的端口

auth_key?



grafana:

login

172.26.101.134:8088/-/grafana/login

http://172.26.101.134:8088/oauth/authorize?access_type=online&client_id=a797f89033dee951dac900905d7b447191f743bcd9afa3a970be4a6864ee0661&redirect_uri=http%3A%2F%2F172.26.101.134%3A8088%2F-%2Fgrafana%2Flogin%2Fgitlab&response_type=code&scope=api&state=o2t3bzD7ek3TPoIPHqDVaLc_HSInTqdBK9IlS2dHhnc%3D

?# gitlab The redirect URI included is not valid.

https://grafana.com/docs/grafana/latest/auth/gitlab/

login gitlab, Applications->Add 

callback url: http://172.26.101.134:8088/-/grafana/login/gitlab

got to: /var/opt/gitlab/grafana/grafana.ini

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



#### 邮箱

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



#### postgresql

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

#### gitaly

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

#### 日志logrotate

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



## Maintenance 维护

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



