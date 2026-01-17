---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

容器管理/虚拟机管理

Network：了解K8S的网络通信模型 https://mp.weixin.qq.com/s/377KvwujtxVVLDxLTYmt9A
容器网络中的 Iptables 包路径 https://mp.weixin.qq.com/s/PNl4fqvDZDvj3vzD2iRp4w

https://kubernetes.io/

针对 Docker 的网络缺陷，Kubernetes 提出了一个自己的网络模型，能够很好地适应集群系统的网络需求，它有下面的这 5 点基本假设：

• 集群里的每个 Pod 都会有唯一的一个 IP 地址。

• Pod 里的所有容器共享这个 IP 地址。

• 集群里的所有 Pod 都属于同一个网段。

• Pod 直接可以基于 IP 地址直接访问另一个 Pod，不需要做麻烦的网络地址转换（NAT）。

• 共享namespace : Pod里面的容器共享network namespace (IP and MAC address), 所以这些容器交互可以使用本地回环地址

Kubernetes 整体的网络模型细化来看，可以分为container-to-container的网络访问、Pod-to-Pod的网络访问、Service-to-Pod的网络访问。

Kubernetes and the JVM
The same concepts of resource requests and limits apply to the JVM running in a container in a Kubernetes cluster. The JVM will consume memory and CPU resources from the container, and these resources can be specified in the same way as any other application running in a container.

Having said that, monitoring the memory usage (remember, it's an incompressible resource) of the JVM in the container is essential to ensure that it does not exceed the limits specified in the deployment. If the JVM runs out of memory, it may result in the application crashing or other unexpected behavior. To avoid this, it's essential to set appropriate requests and limits for memory, as well as to monitor the JVM's memory usage and adjust the resource limits as needed.
https://xebia.com/blog/kubernetes-and-the-jvm/

## 基本概念

### kubernetes (k8s) 与 Docker 关系

Docker就像飞机，而Kubernetes就像飞机场。

- Docker: 是一个开源的应用容器引擎，开发者可以打包他们的应用及依赖到一个可移植的容器中，发布到流行的Linux机器上，也可实现虚拟化。
- kubernetes: 是一个开源的容器集群管理系统，可以实现容器集群的自动化部署、自动扩缩容、维护等功能。

Kubernetes 确实主要用于编排容器，而 Docker 是最流行的容器格式。但关键在于，Kubernetes 通过一套标准的 容器运行时接口（CRI）​ 来与底层容器引擎交互。任何实现了 CRI 的容器运行时都可以作为 Kubernetes 的底层引擎 。
出于追求更高效率、更轻量级和更开放的标准等原因，Kubernetes 社区已经转向了其他容器运行时，如 containerd（其本身也是从 Docker 项目中分离出来的）和 CRI-O​ 。自 Kubernetes v1.24 版本起，它已不再直接内置支持 Docker，而是需要通过额外的适配器来连接。
### kubernetes VS spring cloud
Spring Cloud 和 Kubernetes 在服务发现、负载均衡等功能上确实存在重叠，这常常是开发者从 Spring Cloud 转向 Kubernetes 时最直接的困惑。它们解决的是分布式系统不同层面的问题，定位有本质区别。

| 功能维度   | Spring Cloud (应用层面)                                                     | Kubernetes (平台层面)                                                                                          | 核心差异说明                                                                                           |
|--------|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 服务发现   | 通过 Eureka, Consul, Zookeeper 等客户端组件实现。服务实例主动上报到注册中心。       | 通过内置的 Service 资源和 DNS 自动实现。Pod 创建后，平台自动将其纳入 Service 的端点列表。                                    | Spring Cloud 是“主动注册”的客户端模式，Kubernetes 是“自动纳入”的服务器端模式。Kubernetes 的服务发现与语言无关，是平台基础设施。   |
| 配置管理   | 通过 Spring Cloud Config Server 等配置中心实现，支持动态刷新。              | 通过 ConfigMap 和 Secret 资源以卷挂载或环境变量的方式注入配置。                                                     | Spring Cloud Config 更灵活，支持动态推送；K8s ConfigMap 更简单，与部署流程结合更好。可根据复杂度选择，或结合使用。            |
| 负载均衡   | 客户端负载均衡。由应用程序内的组件（如 Ribbon）从注册中心获取服务器列表，在客户端决定转发到哪个实例。     | 服务器端负载均衡。由 kube-proxy 等平台组件在网络层进行流量分发（如 iptables 或 IPVS 模式）。                                  | 一个决策在应用内，一个在平台网络层。在 K8s 环境中，通常建议使用其原生的负载均衡机制。                                       |
| API 网关 | 提供 Spring Cloud Gateway, Zuul 等强大的应用层网关，可深度集成业务逻辑（如鉴权、限流）。 | 提供 Ingress 资源，作为流量入口，主要实现 HTTP/HTTPS 路由、SSL 终结等，通常需配合 Nginx, Traefik 等 Ingress Controller 使用。 | Ingress 是更基础的入口网关，而 Spring Cloud Gateway 是功能更强大的业务网关。两者并非互斥，可在不同层级协同工作。               |
| 弹性容错   | 通过 Hystrix, Resilience4j, Sentinel 等组件在应用代码层面实现精细化的熔断、降级和隔离。 | 通过健康检查、资源限制、自动重启和 Pod 驱逐等机制在进程/容器层面保证可用性。                                                       | 这是强互补性领域。Kubernetes 确保容器活着的“物理”高可用，Spring Cloud 处理业务错误的“逻辑”高可用。在实践中需要结合使用。          |
| 弹性伸缩   | 无自动伸缩能力，或能力较弱。                                                 | 通过 HPA (Horizontal Pod Autoscaler) 等，根据 CPU/内存或自定义指标自动调整 Pod 副本数量。                              | Kubernetes 在平台层提供了强大的自动伸缩能力，这是其核心优势之一。                                              |
| 部署与调度  | 不涉及。通常通过外部工具（如 Jenkins）完成 Jar 包的部署。                          | 核心能力。通过 Deployment, StatefulSet, DaemonSet 等资源定义应用的部署方式和生命周期，由调度器完成节点调度。                        | Kubernetes 提供了完整的、声明式的应用部署和调度管理能力。                                                  |
| 技术范围   | 专注于解决应用内部的分布式治理问题，是JVM/Java 生态的解决方案。                         | 提供平台级的运维管理能力，是语言无关的通用平台。                                                                      | 两者本质上是解决不同层次的问题，是互补关系而非替代关系。Spring Cloud 让 JVM 内的服务变得强大，Kubernetes 负责管理这些 JVM 实例本身。 |


### Kubernetes 的 11 个部分

**1. Pod**
Pod 是 Kubernetes 中最小的可互动单元。一个 Pod 可以由多个容器组成，这些容器共同部署在单个节点上形成一个单元。一个 Pod 具有一个 IP，该 IP 在其容器之间共享。

在微服务世界中，一个 Pod 可以是执行后台工作或服务请求的微服务的单个实例。

**2. Node（节点）**
Node 是机器。它们是 Kubernetes 用于部署 Pod 的“裸机”（或虚拟机）。Node 为 Kubernetes 提供可用的集群资源用于以保持数据、运行作业、维护工作负载、创建网络路由等。

**3. Label（标签）与 Annotation（注解）**
Label 是 Kubernetes 及其最终用户用于过滤系统中相似资源的方式，也是资源与资源相互“访问”或关联的粘合剂。比如说，为 Deployment 打开端口的 Service。不论是监控、日志、调试或是测试，任何 Kubernetes 资源都应打上标签以供后续查验。例如，给系统中所有 Worker Pod 打上标签：app=worker，之后即可在 kubectl 或 Kubernetes API 中使用 --selector 字段对其进行选择。

Annotation 与 Label 非常相似，但通常用于以自由的字符串形式保存不同对象的元数据，例如“更改原因: 安全补丁升级”。

**4. Service Discovery（服务发现）**
作为编排系统，Kubernetes 控制着不同工作负载的众多资源，负责管理 Pod、作业及所有需要通信的物理资源的网络。为此，Kubernetes 使用了 ETCD。

ETCD 是 Kubernetes 的“内部”数据库，Master 通过它来获取所有资源的位置。Kubernetes 还为服务提供了实际的“服务发现”——所有 Pod 使用了一个自定义的 DNS 服务器，通过解析其他服务的名称以获取其 IP 地址和端口。它在 Kubernetes 集群中“开箱即用”，无须进行设置。

**5. ReplicaSet（副本集）**
虽然 Pod 是一个物理性的运行任务，但通常使用单个实例是不够的。为了冗余并处理负载，出于某种原因（比如“伸缩”）需要对 Pod 进行复制。为了实现负责扩展和复制的层，Kubernetes 使用了 ReplicaSet。这个层以副本的数量表示系统的期望状态，并在任意给定时刻保持该系统的当前状态。

这也是配置自动伸缩的所在，在系统高负载时创建额外的副本，并在不再需要这些资源来支撑所运行的工作负载时进行缩容。

**6. DaemonSet（守护进程集）**
有时候，应用程序每个节点需要的实例不超过一个。比如 FileBeat 这类日志收集器就是个很好的例子。为了从各个节点收集日志，其代理需要运行在所有节点上，但每个节点只需要一个实例。Kubernetes 的 DaemonSet 即可用于创建这样的工作负载。

**7. StatefulSet（有状态集）**
尽管多数微服务涉及的都是不可变的无状态应用程序，但也有例外。有状态的工作负载有赖于磁盘卷的可靠支持。虽然应用程序容器本身可以是不可变的，可以使用更新的版本或更健康的实例来替代，但是所有副本还是需要数据的持久化。

StatefulSet 即是用于这类需要在整个生命周期内使用同一节点的应用程序的部署。它还保留了它的“名称”：容器内的 hostname 以及整个集群中服务发现的名称。3 个 ZooKeeper 构成的 StatefulSet 可以被命名 zk-1、zk-2 及 zk-3，也可以扩展到更多的成员 zk-4、zk-5 等等…… StatefulSets 还负责管理 PersistentVolumeClaim（Pod 上连接的磁盘）。

**8. Job（任务）**
Kubernetes 核心团队考虑了大部分使用编排系统的应用程序。虽然多数应用程序要求持续运行以同时处理服务器请求（比如 Web 服务器），但有时还是需要生成一批作业并在其完成后进行清理。比如，一个迷你的无服务器环境。为了在 Kubernetes 中实现这一点，可以使用 Job 资源。

正如其名，Job 的工作是生成容器来完成特定的工作，并在成功完成时销毁。举个例子，一组 Worker 从待处理和存储的数据队列中读取作业。一旦队列空了，就不再需要这些 Worker 了，直到下个批次准备好。

**9. ConfigMap（配置映射）及 Secret（机密配置）**
如果你还不熟悉[十二要素应用清单](https://12factor.net/?spm=a2c4e.10696291.0.0.323b19a4t8v4xF)，请先行了解。现代应用程序的一个关键概念是无环境，并可通过注入的环境变量进行配置。应用程序应与其位置完全无关。为了在 Kubernetes 中实现这个重要的概念，就有了 ConfigMap。实际上这是一个环境变量键值列表，它们会被传递给正在运行的工作负载以确定不同的运行时行为。在同样的范畴下，Secret 与正常的配置条目类似，只是会进行加密以防类似密钥、密码、证书等敏感信息的泄漏。

我个人认为 Hashicorp 的 Vault 是使用机密配置的最佳方案

**10. Deployment（部署）**
一切看起来都很美好，Pod 可以正常运行，如果上层有 ReplicaSet，还可以根据负载进行伸缩。不过，大家蜂拥而来，为的是能用新版本快速替换应用程序。我们想小规模地进行构建、测试和发布，以缩短反馈周期。使用 Deployments 即可持续地部署新软件，这是一组描述特定运行工作负载新需求的元数据。举个例子，发布新版本、错误修复，甚至是回滚（这是 Kubernetes 的另一个内部选项）。

在 Kubernetes 中部署软件可使用 2 个主要策略：

- 替换——正如其名，使用新需求替换全部负载，自然会强制停机。对于快速替换非生产环境的资源，这很有帮助。
- 滚动升级——通过监听两个特定配置慢慢地将容器替换成新的：

> - a. MaxAvailable——设置在部署新版本时可用的工作负载比例（或具体数量），100% 表示“我有 2 个容器，在部署时要保持 2 个存活以服务请求”；
> - b. MaxSurge——设置在当前存活容器的基础上部署的工作负载比例（或数量），100% 表示“我有 X个容器，部署另外 X 个容器，然后开始滚动移除旧容器”。

**11. Storage（存储）**
Kubernetes 在存储之上添加了一层抽象。工作负载可以为不同任务请求特定存储，甚至可以管理超过 Pod 生命周期的持久化。

https://blog.csdn.net/zf_yusen/article/details/104118839/

https://developer.aliyun.com/live/2603?utm_content=g_1000112014

## 灾备
控制平面组件 部署至少三个 Master 节点，并跨可用区分布
数据存储 (etcd)
工作节点 (Node)
应用负载 (Pod)

Velero

## 例子

### 程序
user-service/
├── src/
├── pom.xml
├── target/
│   └── user-service.jar  # Maven打包后生成在这里
└── Dockerfile              # 就放在这里！

```
@SpringBootApplication
@RestController
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    
    @GetMapping("/user/{id}")
    public String getUser(@PathVariable String id) {
        return "用户信息: ID=" + id;
    }
}

application.yml：
server:
  port: 8080
spring:
  application:
    name: user-service  # 这个名称在K8s服务发现中很重要

Dockerfile
FROM openjdk:8-jre-alpine
COPY target/user-service.jar app.jar //在Dockerfile和启动命令中，你可以使用一个通用的、简短的名称（如app.jar），而不需要随着项目版本号的变化而修改Dockerfile
ENTRYPOINT ["java", "-jar", "/app.jar"]

docker build -t user-service:latest .
```
### 搭建Kubernetes集群

1. 准备4台服务器
假设你有4台全新的CentOS 7/8云服务器，内网互通。规划如下：

Master节点 (1台): IP地址为 192.168.1.10。这是集群的“大脑”，负责管理。

Worker节点 (3台): IP地址为 192.168.1.11, 192.168.1.12, 192.168.1.13。这是“干活”的节点，运行你的应用。

2. 所有节点系统初始化（在4台服务器上都要执行）
这些命令为K8s运行准备基础环境，主要是关闭冲突服务、修改内核参数。
```
# 关闭防火墙
systemctl stop firewalld && systemctl disable firewalld
# 关闭SELinux
setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
# 关闭swap（K8s要求）
swapoff -a
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
# 配置内核参数并加载
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system
# 设置时间同步
yum install -y ntpdate
ntpdate time.windows.com
```
安装容器运行时和K8s组件：
```
# 安装Docker
yum install -y docker
systemctl enable docker && systemctl start docker

# 添加K8s源并安装kubeadm, kubelet, kubectl
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
EOF
sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
sudo systemctl enable --now kubelet
```

3. 初始化Master节点（仅在192.168.1.10上执行）
kubeadm init是初始化集群主节点的核心命令
```
sudo kubeadm init \
  --apiserver-advertise-address=192.168.1.10 \  # 告知其他组件API Server的地址
  --image-repository=registry.aliyuncs.com/google_containers \  # 使用国内镜像源
  --kubernetes-version=v1.28.0 \  # 指定版本
  --service-cidr=10.96.0.0/12 \    # 服务虚拟IP段
  --pod-network-cidr=10.244.0.0/16 \ # Pod网络段，与后续Flannel插件匹配
  --cri-socket=unix:///var/run/dockershim.sock
```
初始化成功后会输出加入集群的命令，请务必保存好，类似：
```
kubeadm join 192.168.1.10:6443 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:167d0176ccd1c90b7373917940620fb7a48b245913eb25a05726345902f6213c
```
配置kubectl（在Master节点上执行）：
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

4. 安装Pod网络插件（Flannel）（仅在Master节点上执行）
Pod之间要能通信，必须安装网络插件。Flannel比较简单。
```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

5. 将Worker节点加入集群（在3台Worker节点上执行）
使用第3步保存的 kubeadm join命令。
```
kubeadm join 192.168.1.10:6443 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:167d0176ccd1c90b7373917940620fb7a48b245913eb25a05726345902f6213c
```
在Master节点验证节点状态：
```
kubectl get nodes
```
如果所有节点 STATUS为 Ready，恭喜你，集群搭建成功！

### 部署UserServiceApplication
现在，在Master节点上操作，部署你的Spring Cloud应用。

Note: 部署多个SpringBoot应用
    对于UserServiceApplication和ReportApplication这两个独立的SpringBoot应用，标准的、推荐的做法是为每个应用创建独立的Deployment和Service。

    虽然可以将多个容器（例如UserServiceApplication和ReportApplication）定义在同一个Pod中
    ，但这通常仅适用于生命周期完全一致、需要紧密协作、共享本地存储和网络命名空间的辅助容器（即Sidecar模式，比如日志收集器或网络代理）
    。对于您的主要业务应用，将它们部署在独立的Pod中更利于各自的版本更新、伸缩和故障恢复。

```
创建Deployment​ (deployment.yaml) - 负责应用的副本管理和滚动更新

apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-deployment
spec:
  replicas: 3  # 多活模式：K8s自动维护3个副本,Kubernetes的自动化管理：当您应用此配置后，Kubernetes会确保始终有3个UserServiceApplication的Pod实例在运行。如果某个实例因故终止，Deployment会立即感知并自动创建一个新的Pod来替换它。同时，对应的Service会自动对发送到user-service的请求进行负载均衡，将其分发到所有健康的Pod实例上。
  # 主备模式呢? replicas: 1  始终只维持一个“主”实例在运行 虽然我定义了一个Deployment，但我只允许它运行一个Pod实例。当这个实例所在节点故障时，Deployment控制器会在其他健康节点上为我重新拉起一个新的Pod实例。
  # 对于像数据库这类有状态应用，简单的Pod重启可能不够，因为新实例需要继承旧实例的数据。这时方案会更复杂，通常需要有状态工作负载（StatefulSet）​ 并结合Leader Election机制。通常由数据库软件自身在其Kubernetes Operator中实现（例如，ZooKeeper、Redis Sentinel、PostgreSQL高可用集群等）。
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "k8s"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

创建Service​ (service.yaml) - 负责服务发现和负载均衡
apiVersion: v1
kind: Service
metadata:
  name: user-service  # 这个名称将作为服务发现地址
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP  # 集群内服务发现

部署到Kubernetes集群
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### 测试 检查部署状态：

1. 检查部署状态
```
# 查看Pod状态，应为Running
kubectl get pods -l app=user-service
# 查看Deployment状态
kubectl get deployment user-service-deployment
# 查看Service状态
kubectl get svc user-service
```

2. 测试
```
# 临时端口转发测试
kubectl port-forward svc/user-service 8080:80 &
curl http://localhost:8080/user/123
```

3. 关键运维命令
查看Pod日志：kubectl logs <pod-name>

进入Pod内部调试：kubectl exec -it <pod-name> -- /bin/bash

查看Pod详细描述（排查启动失败常用）：kubectl describe pod <pod-name>

节点维护（如要重启Worker节点）：
```
kubectl cordon <worker-node-name>   # 标记节点不可调度
kubectl drain <worker-node-name> --ignore-daemonsets  # 安全驱逐Pod
# ... 进行维护
kubectl uncordon <worker-node-name> # 恢复节点可调度
```

<disqus/>