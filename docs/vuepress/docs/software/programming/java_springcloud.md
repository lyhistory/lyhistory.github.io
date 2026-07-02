Spring Cloud Config Refresh Strategies https://soshace.com/spring-cloud-config-refresh-strategies/


[spring cloud定义了接口标准，然后各家各组件做了不同实现；](https://mp.weixin.qq.com/s/bIcnzhOM-ZEGjoFg7u4i4Q)

### 从总体上看：

+ 从入口开始，DNS动态解析 - -> 机房内负载均衡(LVS+Keepalived) 
	动静分离可以放这里做，
	

静态找FastDFS集群（便宜）或cdn服务（贵）；
	动态则进入下面流量网关
	
	LVS的virtual ip概念，大概是一个数据包发送给192.168.1.1这个服务器，但是负载均衡给了192.168.1.2这个服务器，按照TCP协议，参考我在network的讲解，2这个服务器应该拒绝这个包，因此才引入了VIP的概念；

+ 然后进入流量网关（强调性能）=路由+waf+负载
	不是用纯的nginx，一般是用基于netty的nginx做负载均衡，拦截无效非法流量/定向流量分发（挡爬虫、攻击、频控），此处可以放WAF Kona Openresty(nginx+lua) 定向流量分发(一致性哈希) 数亿万个文件 item.jd.com/1234.html
	hash(1234) mod 服务器个数
		引入流量倾斜问题，秒杀（水平扩展热门产品所在的服务器）
	
+ 然后进入业务网关（强调功能）
	一般是基于filter的Netfix zuul和spring cloud gateway，权限认证比如spring security+jwt或者CAS也可以放这里
	
	netty的性能比filter高，所以一般nginx放前面，zuul放后面，当然zuul和spring cloud gateway也可以作为流量网关；

+ 最后到具体微服务内部
	基于servlet的springmvc（内置tomcat服务器）；
	更高性能的基于netty的spring reactive webflux（内置netty服务器）；
	页面渲染有	Thymleaf Eniov FreeMaker JSON；
	微服务内部一般都有Acurator用于上报健康信息给比如springcloud admin；
	微服务之间调用：先通过服务治理的注册中心获取服务列表到本地
		=>经过断路器用hystrix，sentinel（限流，服务降级）
	
	​		hystrix 服务降级（从try catch升级为面向切面编程AOP ，比如redis连不上降级查数据库）熔断 隔离（线程池[远程服务]/信号量[本地服务] 线程池之间隔离） 
​	=>经过负载均衡用netflix ribbon或springcloud loadbanlancer，
	​	=>最后通过封装的http或者tcp client端调用远程服务，一般用Feigin或者其底层的restTemplate，
	
	​		open-feign可以识别spring-mvc接口，直接调用接口就可以调用对应的服务；
	
	​		feign必须在代码里显示写出调用哪一个服务才能调用；
	
+ 服务治理
	springcloud admin；
	服务注册中心eureka nacos zookeeper
	

​	前面网关部分，假如业务网关有多个节点，流量网关的nginx可以通过访问注册中心获得业务网关列表，从而对业务网关进行负载均衡；然后业务网关访问注册中心可以获取对应的微服务；当然所有的业务网关和微服务都是注册到注册中心的；
​	
​	企业消息总线springcloud bus，kafka

+ 分布式事务及微服务之间链路
	=> 先走分布式事务alibaba seata
	=> 再连接微服务链路追踪 springcloud-sleuth，zokin，skvwalking
	=> 最后获取分布式锁 zookeeper acurator，redlock
	

### 从厂家看:

+ netflix全家桶：

全局外部流量入口：zuul 动态路由 Hystrix熔断降级
微服务内部负载均衡：feign
https://blog.csdn.net/zhou920786312/article/details/84982290
feign和ribbon都属于客户端负载均衡（正向代理，当然这里意图并不是说要隐藏客户端，而是反而客户端通过使用feignClient，feiginclient调用微服务B[多个节点在注册中心注册为B服务]，从而隐藏具体的调用过程，比如怎么动态选择哪个节点的B服务，通过什么协议等等），nginx属于服务端负载均衡（反向代理），nginx不易于剔除非健康节点；

+ spring cloud alibaba全家桶：
https://github.com/alibaba/spring-cloud-alibaba

spring cloud gateway 网关代替zuul+hystrix，既有路由又有熔断降级

nacos代替了spring boot的properties或者yml配置，并且可以用于dns注册和rpc服务的注册和服务发现；

Feign 默认采用http，用于微服务的数据共享，微服务可以像调用自己的服务一样调用其他微服务提供的服务，类似于dubbo等rpc框架（rpc+动态代理）


bpm-business process management比如工单流程等： activiti or flowable

Spring Cloud 万字总结，真不错！
https://mp.weixin.qq.com/s/YGtKoKBE1jxFaEUpEFSaLg

Azure Spring Cloud workshop
https://docs.microsoft.com/en-us/learn/modules/azure-spring-cloud-workshop/

https://github.com/macrozheng/mall
https://github.com/zhangdaiscott/jeecg-boot

https://github.com/ZhongFuCheng3y/msc-Demo
https://github.com/forezp/SpringCloudLearning
https://github.com/zhoutaoo/SpringCloud