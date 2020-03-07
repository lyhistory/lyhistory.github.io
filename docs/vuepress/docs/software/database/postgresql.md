---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《postgresql实用基础》

## 1. Setup
https://www.tutorialspoint.com/postgresql/index.htm
https://serverfault.com/questions/110154/whats-the-default-superuser-username-password-for-postgres-after-a-new-install

Postgresql
https://serverfault.com/questions/110154/whats-the-default-superuser-username-password-for-postgres-after-a-new-install

Server based database
Replication

su - postgres
psql

Client
    Offical: Pgadmin 4    https://www.pgadmin.org/download/
    Pgadmin3 LTS by BigSQL (don’t support 11g)
    DBeaver (not good)

CLI
C# 连接 PostgreSQL --- Npgsql的安装和使用 https://blog.csdn.net/chencglt/article/details/77706226 

删除“重复”的function或stored procedure，比如：bpchar和varchar：
![](/docs/docs_image/software/postgresql/postgresql01.png)

## 2. Gaps between Oracle PLSQL and PostgreSQL
https://github.com/digoal/blog/blob/master/201607/20160714_01.md

https://wiki.postgresql.org/wiki/Oracle_to_Postgres_Conversion

### 2.1 oracle keep dense_rank to postgresql 
https://www.eversql.com/rank-vs-dense_rank-vs-row_number-in-postgresql/

### 2.2 oracle is record, is table to postgresql
