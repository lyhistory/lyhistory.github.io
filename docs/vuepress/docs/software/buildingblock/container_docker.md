---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

https://docs.docker.com/get-started/#container-diagram

https://docs.docker.com/get-started/swarm-deploy/

https://hub.docker.com/



https://www.vagrantup.com/downloads.html

## Basics

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

## useage

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

### enter linux container
1. method 1

find id:
docker compose ps

docker-compose exec <service-name> bash  /    docker-compose exec -it <container-id> bash
docker-compose exec <service-name> sh  / docker-compose exec -it <container-id> bash # or sh if no bash

To run as non-root: If the container has a user (e.g., node in Node images), use:
docker-compose exec -u node app bash

2. method 2 Alternative: SSH into the Container (Rarely Needed)

find ip:
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-id>
or
docker inspect <container-id> | grep IPAddress

Username: Often root or the USER from Dockerfile (e.g., appuser).

Password: Not set by default — containers don't have SSH passwords unless you configured them (e.g., via environment: - PASSWORD=secret and SSH setup).

Most projects don't enable SSH — it's insecure and unnecessary. Stick to docker exec.