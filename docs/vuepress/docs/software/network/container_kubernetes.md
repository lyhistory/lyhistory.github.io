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