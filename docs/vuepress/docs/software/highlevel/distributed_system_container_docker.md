---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---


## Basics

JVM 已经实现了“一次编译，到处运行”，为什么还要 Docker？

1. 跨平台 ≠ 环境完全一致
JVM​ 解决的是“字节码跨平台”，但 JVM 本身还是需要针对不同操作系统编译（Windows 版、Linux 版等），而且 Java 程序运行时还会依赖操作系统的库、字体、时区、文件路径等。
Docker​ 解决的是“环境完全一致”：它把你的应用、JVM、系统库、配置文件、甚至整个文件系统都打包成一个镜像。无论在开发机、测试服务器还是云上，跑的都是同一个镜像，彻底杜绝“在我机器上能跑”的问题。

2. 隔离性：进程级 vs 操作系统级
JVM​ 是进程内的虚拟机，多个 Java 进程跑在同一台机器上时，它们共享同一个操作系统内核，只是内存、线程被 JVM 管理，隔离性较弱。一个 JVM 崩溃可能影响其他进程，资源（CPU、内存）也难以精细限制。
Docker​ 利用 Linux 内核的命名空间（namespace）和控制组（cgroup），为每个容器提供独立的进程树、网络、文件系统，强隔离，并且可以精确限制每个容器能用的 CPU、内存，互不干扰。

3. 部署与分发：不只是代码，而是整个交付单元
用 JVM 时，你交付的是 JAR/WAR 包，但还需要目标机器上预装合适版本的 JDK、配置环境变量、安装依赖库等。
用 Docker，你交付的是一个镜像，里面已经包含了：
基础操作系统（如 Alpine Linux）
指定版本的 JDK
你的应用 JAR
所有配置文件、脚本
别人拿到镜像直接 docker run 就能启动，无需关心宿主机环境。

4. 生态与编排：微服务时代的刚需
现代应用往往是微服务架构，需要快速扩缩容、滚动更新、服务发现等。
Docker 镜像天然适合被 Kubernetes 等编排系统管理，实现自动化部署、弹性伸缩、负载均衡。
JVM 本身不提供这些集群管理能力，它只是运行单个应用的运行时。

5. 不仅仅是 Java：统一技术栈
Docker 可以运行任何语言的应用（Node.js、Python、Go、Ruby 等），用同一套工具（Dockerfile、镜像仓库、编排系统）管理所有服务，降低运维复杂度。
如果只用 JVM，非 Java 技术栈就需要另一套部署方案。


我所理解的docker-compose是编排容器的。例如，你有一个php镜像，一个mysql镜像，一个nginx镜像。如果没有docker-compose，那么每次启动的时候，你需要敲各个容器的启动参数，环境变量，容器命名，指定不同容器的链接参数等等一系列的操作，相当繁琐。而用了docker-composer之后，你就可以把这些命令一次性写在docker-composer.ym文件中，以后每次启动这一整个环境(含3个容器)的时候，你只要敲一个docker-composer up命令就ok了。
而dockerfile的作用是从无到有的构建镜像。
两个完全不是一码事
### Volumes

Volumes are the primary way to store persistent data in Docker. They solve the problem that containers are ephemeral — meaning when you delete or recreate a container (e.g., docker-compose down or docker stop), any data inside it (files, databases, etc.) is lost unless you save it somewhere outside the container.

```
services:
  app:
    image: postgres
    volumes:
      # Named volume (recommended for databases)
      - postgres-data:/var/lib/postgresql/data

      # Bind mount (great for development)
      - ./my-local-folder:/app/config

      # Anonymous volume (auto-created)
      - /app/cache

volumes:
  postgres-data:    # ← this creates/reuses the named volume
```

Key advantages of volumes (especially named volumes):

Data survives docker-compose down, container recreation, even docker system prune (unless you explicitly remove volumes)
Easy backup/restore/migration
Better performance than writing to container's writable layer
Can be shared between multiple containers/services
In Docker Desktop you can see named volumes in the Volumes tab.
Bind mounts just appear as normal folders on your computer.


## setup

### offline install

https://docs.docker.com/engine/install/binaries/

https://noknow.info/it/os/install_xz_utils_from_source

https://tukaani.org/xz/


Docker里面有 null、host 和 bridge 三种网络模式

## usage

### run
```
docker-compose up --build

docker-compose build backend --no-cache
docker-compose up -d --force-recreate backend
docker compose logs --follow

docker cp <container_name_or_id>:/app <local_host_path>

windows:
docker logs backend 2>&1| findstr /C:"searchtext"

linux:
docker logs backend 2>&1| grep "searchtext"
```

```
Docker start ‘container id’
Detach ctrl+p+q
Docker attach ‘name’
Docker exec -it ‘container’ bash
https://stackoverflow.com/questions/30172605/how-to-get-into-a-docker-container
 
Docker run
 
Docker cp
https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container
 
Docker export import
Docker save load
http://tuhrig.de/difference-between-save-and-export-in-docker/
 
Create private repository: docker registry  	https://docs.docker.com/registry/deploying/

Docker basic:
Docker images	Docker ps -a
docker rmi <ImageID>	Docker rm <Container ID>
### start docker
docker run --name python3 -d python:3.6
Use the command docker exec -it <container name> /bin/bash to get a bash shell in the container
Generically, use docker exec -it <container name> <command> to execute whatever command you specify in the container.
### get into docker
docker exec -it <container name> /bin/bash
http://phase2.github.io/devtools/common-tasks/ssh-into-a-container/
sudo docker exec -ti redis_exporter_loadtest /bin/sh


### transfer data between host and docker
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|- 
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
		https://docs.docker.com/engine/reference/commandline/cp/
### persist data on host machine
	docker volume
	https://docs.docker.com/storage/volumes/
### more
 	sudo docker top <containerid>

```

### enter linux container
1. method 1

find id:
`docker compose ps`

`docker-compose exec <service-name> bash  /    docker-compose exec -it <container-id> bash`

`docker-compose exec <service-name> sh  / docker-compose exec -it <container-id> bash # or sh `i f no bash

To run as non-root: If the container has a user (e.g., node in Node images), use:
`docker-compose exec -u node app bash`


2. method 2 Alternative: SSH into the Container (Rarely Needed)
   
```
find ip:

docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-id>

or

docker inspect <container-id> | grep IPAddress
```

Username: Often root or the USER from Dockerfile (e.g., appuser).

Password: Not set by default — containers don't have SSH passwords unless you configured them (e.g., via environment: - PASSWORD=secret and SSH setup).

Most projects don't enable SSH — it's insecure and unnecessary. Stick to docker exec.


https://docs.docker.com/get-started/#container-diagram

https://docs.docker.com/get-started/swarm-deploy/

https://hub.docker.com/

https://www.vagrantup.com/downloads.html

## Troubleshooting

Error response from daemon: ports are not available: exposing port TCP 0.0.0.0:8081 -> 127.0.0.1:0: listen tcp 0.0.0.0:8081: bind: An attempt was made to access a socket in a way forbidden by its access permissions.

```
# 查看当前的动态端口范围（记下起始和结束，以便恢复）
netsh int ipv4 show dynamicportrange tcp

# 设置新的动态端口范围（通常 49152-65535 是标准的高位范围）
netsh int ipv4 set dynamicportrange tcp start=49152 num=16384
```