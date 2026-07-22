---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---


## Basics
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