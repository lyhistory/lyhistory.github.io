![](/docs/docs_image/software/project_manage/monitor/cloudwise.png)

+ DOIM 基础监控 Digital Operation Infrastructure Management
    - 设备层面监控 
    - 对应的监测点（进程）监控
+ DOCC 采控平台 Digital Operation Collect & Control Center
    一站式提供各类采集任务的配置与自动化部署，支持针对各类日志、IT基础设备等数据的采集、清洗、转换、发送、以及监控、告警等功能，同时也对采集任务和采集行为进行统一规范的调度和管控，避免不规范操作导致宕机等异常，全面保障业务的正常运行；同时DOCC内置几十个开箱即用的采集模板（并且不断扩充中），内置数十种解析、转换、计算方式，兼容Linux、Windows、AIX、MacOS、国产麒麟OS等多种不同类型、不同版本的操作系统，从嵌入式设备、网页、服务器、程序等均能轻松接入。
+ DODB 数据平台 Digital Operation Database
    DODB产品是云智慧多年运维大数据处理经验积累的自主研发成果，是智能业务运维平台DOCP的数据基础支撑，为用户提供高性能的（PB级数据量、毫秒级响应）、一站式的运维数据服务，能够极大提升运维数据的处理效率；DODB产品可以实时高效地接入用户环境中的各类IT数据和业务数据，对这些运维数据进行低成本存储、高效计算、关联分析建模，能够通过接口的方式，利用标准查询语言提供各类数据检索服务；DODB产品能够支撑数字化运维工作中各种运维数据价值挖掘场景，如实时数据可视化管控、智能告警、时序数据的异常检测、根因分析与容量预测等。
    - CMDB 配置管理数据库
+ DOLA 日志平台 Digital Operation Log Analytics 	
    基于大数据技术与智能算法，助力企业实现对离散日志数据进行统一、安全、高效地采集、处理、存储与查询分析，全面提升企业对日志数据的应用水平和效率。        
+ DOMA 监控中心 
+ DOEM 事件中心 （Digital Operation Event Management）
    云智慧数字化运维事件中心基于大数据技术和机器学习算法，对来自于各种监控系统的告警消息与数据指标进行统一的接入与处理，支持告警事件的过滤、通知、响应、处置、定级、跟踪以及多维分析，利用多种算法实现告警事件的收敛、异常检测、根因分析等智能运维场景化应用，实现问题事件全生命周期的全局管控

+ Agent：代理服务，按功能通常分为采集类的和监控类的，按运行方式通常分为触发式的和周期运行式的等。
    - CJE 自动化系统Agent的简称。

## 日志采集流程
### 安装DOCC及插件agent


+ CDC 云智慧数据采集器
是自主研发的一款针对日志、监控信息等数据的专业采集工具。CDC采集器支持多种数据源的采集和监控，内置数十种解析、转换、计算方式，并支持发送到数字化运维数据库（DODB）和其它自有的服务（Kafka、HTTP服务等）。具备多数据源多终端支持、丰富的数据解析与变换方式、采集性能优异等特点与优势。
CDC Agent 采控中心管控Agent

+ CIM Agent，是一款用来监控服务器的agent，其安装在被监控服务器上，对被监控机器性能几乎没有任何影响，用户防火墙只需要开通一个专用端口即可监控到服务器性能指标，安装维护简单便捷

```
mkdir /cloudwise
chmod 755 /cloudwise 
cd cloudwise

export ipblacklist=;export isProxy=false;export rpcadressip=;export enable_deep_discover=false;export hostip=x.x.x.x:18084;export token=MTEwQDY0Nw==;export version=djEuNi4w;export agentIds=Y2ltLGNkYyxkb2Nj;export configIds=ZDY3OWQyZDBmYjQ2NTA3MTY5OWMzMjNmMGI4OWQ2YTYsNDBjM2Q0MWE5OWFlYTJlMmQ1ZTk4NGJlNDIyMDcxYzQsODM0OTFhMGIzMjAyOGFkZjEyNWI4NmZkODVlMmJiMjU=;export tagIds=;export customPath=;export isNeedAdministrator=ZmFsc2U=;export isDoccRemote=false;export doccTaskId=;export daemonInstanceId=;([[ 1 != $(command -v curl ||  echo $?) ]]  && (curl http://$hostip/api/ext/gaia/daemon/sh  -o doccsh.sh) || ([[ 1 != $(command -v wget ||  echo $?) ]] &&  (wget -O doccsh.sh http://$hostip/api/ext/gaia/daemon/sh))) && chmod u+x doccsh.sh && bash doccsh.sh -i

17:18:09 Check if doccAgent is installed
17:18:09 Path: /cloudwise
17:18:09 Detect CPU architecture
17:18:09 CPU architecture detected x86_64
17:18:09 Start download:
17:18:10 Download package completed. Start unzipping
17:18:10 unzip success
17:18:10 Unzipped and start running
17:18:10 Successfully executed filepath.
17:18:11 Successfully started.
17:18:11 Installation success
17:18:11 Symlink /root/cloudwise/agentdaemon -> /cloudwise/agentdaemon created
17:18:11 Removing installation lock file.
```

安装成功后，选择<节点管理/主机管理>导航栏打开<主机管理>页面，在<主机列表>中可查看到添加的主机以及对应的 Agent 信息。

### 添加采集监控任务

登录 DOCC 后，在左侧导航栏中单击<集成服务/任务管理>进入页面。

在<任务管理>页面，单击<新建自定义>打开<自定义采集模板>对话框。 

将鼠标悬停于目标模板图标上，单击<应用>，进入日志监控任务的配置页面。（日志采集通常使用文件读取-tailx模式）

配置数据源信息：配置采集任务名、日志文件路径、日志换行表达式及数据发送方式等

信息配置完成后，单击<下一步>按钮，选择需要执行任务的目的主机，点击完成。

在提交成功页面单击<查看任务>，在该页面可查看到新建的日志采集任务详情；单击“编辑”可跳对任务进行更改并重新提交。
通过任务“读取成功总数”可判断，是否能获取到日志文件数据

### dodb数据处理部分-pipeline流作业（数据处理-入表）

登录 DODB 后，在左侧导航栏中单击<数据资产/流式数据>进入页面，点击<新建>。

配置流式数据连接信息：名称、数据连接、选择对应的Kafka的topic

在左侧导航栏中单击<数据开发/作业开发>进入页面，新建pipeline流程处理数据

点击<任务配置>配置流程名称、逻辑集群；

拖拽添加组件“数据源”，选择目的流式数据，点击“消费一条样例数据”并保存

添加需要进行数据处理的组件，处理完数据，在最后一个流程节点“一键建表”，实现数据入库入表。
