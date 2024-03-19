---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

参考：[Threat Hunting: Log Monitoring Lab Setup with ELK](https://www.hackingarticles.in/threat-hunting-log-monitoring-lab-setup-with-elk/)

1. **Elasticsearch:** It is a restful search engine that stores or holds all of the collected Data.
2. **Logstash:** It is the Data processing component that sends incoming Data to Elasticsearch.
3. **Kibana:** A web interface for searching and visualizing logs.
4. **Filebeat:** A lightweight Single-purpose Data forwarder that can send data from thousands of machines to either Logstash or Elasticsearch.


EFK（Elasticsearch，Fluentd，Kibana）技术栈用于提取，可视化和查询来自各种来源的日志

Loki / Promtail / Grafana
Promtail: 负责采集应用程序和系统的日志数据，并将其发送到 Loki 的集群中。

Loki: 负责存储日志数据，提供 HTTP API 的日志查询，以及数据过滤和筛选。

Grafana: 负责 UI 展示日志数据。

Loki vs ELK
Loki 和 ELK（Elasticsearch, Logstash, Kibana）都是常用的日志处理系统，它们各自具有一些优点。下面是 Loki 相对于 ELK 的几个优点：

存储效率更高：Loki 使用了压缩和切割日志数据的方法来减少存储空间的占用，相比之下，ELK 需要维护一个大的索引，需要更多的存储空间。

查询速度更快：Loki 使用类似 Prometheus 的标签索引机制存储和查询日志数据，这使得它能够快速地进行分布式查询和聚合，而不需要将所有数据都从存储中加载到内存中。而ELK需要将数据从存储中加载到内存中进行查询，查询速度相对较慢。

部署和管理更容易：Loki 是一个轻量级的日志聚合系统，相比之下，ELK 需要部署和管理多个组件，需要更多的资源和人力成本。

ES/ClickHouse/Loki三种核心日志分析软件比较与思考
https://blog.51cto.com/u_15468438/5788934
