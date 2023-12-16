


## 磁盘知识

Network-attached storage (NAS) is dedicated file storage that enables multiple users and heterogeneous client devices to retrieve data from centralized disk capacity. Users on a local area network (LAN) access the shared storage via a standard Ethernet connection.

NAS（Network Attached Storage：网络附属存储）按字面简单说就是连接在网络上，具备资料存储功能的装置，因此也称为“网络存储器”。它是一种专用数据存储服务器。它以数据为中心，将存储设备与服务器彻底分离，集中管理数据，从而释放带宽、提高性能、降低总拥有成本、保护投资。其成本远远低于使用服务器存储，而效率却远远高于后者。目前国际著名的NAS企业有Netapp、EMC、OUO等。

SSD 固态硬盘

HDD 普通硬盘（机械硬盘）

长期存储数据还是选择机械硬盘比较好

Q: Does the Windows 10 "fast startup" feature decrease the lifespan of your HDD or SSD? It has very little difference on the life of either an HDD or an SSD. As others have said, writing to SSDs will gradually reduce the life of the drive.

A redundant array of independent disks, or RAID, is a group of two or multiple hard drives. It offers improved data security, read-write speed performance, and fault tolerance. On the other hand, a hard drive is an individual storage media drive used to store and manage digital data.

External Hard Drive VS Internal Hard Drive (Discussion)
https://www.reddit.com/r/pcmasterrace/comments/948atg/external_hard_drive_vs_internal_hard_drive/
https://www.youtube.com/watch?v=wN2-jGVjnGM

External Hard Drive vs. Flash Drive: What’s the Difference?
https://www.lifewire.com/external-hard-drive-vs-flash-drive-5208546

+ portable hard disk drive
  external hard drive
+ non-portable hard disk drive(with power supply)
  can be used both internal(plug into the motherboard directly) and external(through usb)
  - computer disk
    2.5-inch disks that spin at 5400 RPM
  - RAID disk drives
    3.5-inch disk that spins at 7200 RPM

Types of Interfaces(These names come from the way they connect to the computer. )
+ Parallel Advanced Technology Attachment (PATA)
+ Serial Advanced Technology Attachment (SATA)
+ Small Computer System Interface (SCSI)
+ NVMe (Non-volatile Memory Express)

机械硬盘(HDD)磁头PMR、CMR、SMR
不买SMR叠瓦盘！！！
SMR一般128M起步，256m确定是SMR，CMR通常64mb

https://www.reddit.com/r/qnap/comments/hdzaeu/if_you_have_wd_red_disks_in_your_nas_watch_this/

https://nascompares.com/answer/list-of-wd-cmr-and-smr-hard-drives-hdd/

https://post.smzdm.com/p/a90xmo3o/

西部数据拆机盘（多数是寿命短的视频监控紫盘）

清零盘(不要买,不清楚具体状态)


### 磁盘阵列柜 raid
[家用NAS到底要不要组raid](https://mp.weixin.qq.com/s/HIwASV2sWZIWtmDKDmDaKg)
+ raid0
  大家应该大都听过raid一时爽，数据火葬场这个梗，而且应该已经很久了。其实这里主要说的就是raid0。Raid0最低需要两块硬盘，它把数据分散到每块硬盘上进行存储，所以raid0拥有所有raid种类中最强的存储性能。而raid0的总可用空间容量就是你硬盘数量乘以最低容量硬盘的容量，连续读写性能就是单盘的倍数（随机性能除外，单盘是多少，raid之后还是多少）。

+ raid1
  相比安全性低的爆炸的raid0，raid1就显得很安全了。Raid1只支持两块硬盘组raid阵列，而实际容量只有最小的那块硬盘的容量。这是因为raid1并没有对存储性能有任何提高，只是提高了数据的安全性。两块硬盘组成的raid1阵列中，每块硬盘的数据都是完全一样的，两个硬盘是互相的镜像关系。
  
+ raid5
  Raid5的初衷是raid0以及raid1的折衷方案。通过前面两个最基本的raid种类介绍，我们可以知道raid0和raid都有自己的不足，一个是安全性，一个是容量和性能。而raid5是在这中间的方案。Raid5采用了硬盘分割的技术，最少需要三块硬盘才可以组建raid5阵列，它没有数据冗余，而是把数据奇偶校验的方式存储到每块硬盘上，而其中一块硬盘用于备用，支持在线更换。Raid5允许一块硬盘损坏或者离线，这时候阵列依旧可以读取，但是处于降级状态，需要重建。所以Raid5硬盘的总容量是所有硬盘中最小硬盘容量的N-1倍。比如你用4块12T的硬盘组raid5阵列，实际你会得到一个36T的raid5阵列。性能上raid5比单盘情况下要高，不管是读取写入，但是不如raid0。
+ raid10
  其实raid10很简单，就是我们前面介绍过的raid1和raid0的合体版本，Raid10阵列需要最低4块硬盘，两块硬盘两两组建raid1阵列，然后再组成raid0阵列，这就是raid10，也叫raid1+0。实际建立好之后的阵列容量和raid1一样，是所有硬盘数量的一半乘以最低容量硬盘的大小。不过要注意，raid10不是raid01，raid10是先进行镜像再组raid0，而raid01是先组raid0再组raid1。Raid10可以在其中一块硬盘完全离线的情况下依旧正常工作，并且在插入新硬盘替换坏盘后会按照raid1的规则进行数据重建，安全性相比单纯的raid0有了大幅度提高。

+ 群晖SHR Synology Hybrid RAID
  SHR其实是群晖专用的专用的磁盘阵列，叫群晖混合raid阵列。相比传统的raid，SHR有一定的优势。SHR有两种，单盘的SHR-1以及四块硬盘以上的SHR-2。不过和传统的raid阵列不同的是，SHR允许随意添加新的磁盘。并且不会因为其中一块磁盘小对整个磁盘空间造成浪费，因为SHR阵列会自动把大容量硬盘分成较小的区块并创建冗余存储，实际可用空间比传统raid要大（硬盘容量不一致的情况下）。
+ 软raid和硬raid
  最后就是软raid和硬raid了。软raid很简单，就是由操作系统来构建的raid阵列。软raid会吃掉一部分的主机CPU资源用于raid阵列的开销，比如数据计算等。相比硬件raid，软raid只要系统支持即可，成本较低。但是同样的，因为吃CPU，所以速度比硬件raid较慢，安全性也低。但是我们目前在入门级NAS上见到的raid阵列基本都是软raid阵列。
  硬件raid则是由专门的raid设备来实现的raid，一般是raid卡，或者主板集成的raid功能。硬件raid有自己的raid控制器以及IO芯片，而高端一些的raid卡往往还有电池以DRAM等硬件，整体性能是比软raid好一些的。而且因为硬件raid独立于操作系统，安全性也相对较高。但是同样的，因为需要额外的硬件，所以价格相对也较高。

## 硬件产品

个人云产品 - 联想个人云

西数

### 群晖 synology

[工具](https://www.synology.cn/zh-cn/support/download/DS224+?version=7.2#utilities)

[视频教程](https://www.synology.cn/zh-cn/knowledgebase/DSM/video)

#### 安装操作系统DSM-Disk Station Manager：
Mobile:
+ 群晖管家 DS Finder

Desktop：
+ Synology Assistant
Synology Assistant 是一款桌面实用程序，可在局域网中搜索 Synology 服务器。使您可以搜索并连接到 Synology 服务器或设置 Wake on LAN (WOL)。

配置：

+ 远程连接 Quick Connect 

#### 备份

移动硬盘：USB copy

电脑整机备份： 使用 Active Backup for Business ,客户端 Synology Active Backup for Business Agent

文件备份（手机/电脑）：
Synology Drive Client
Synology Drive Client 是 DSM 附加套件 Synology Drive Server 的桌面实用程序，让您可以在集中化的 Synology NAS 与多台客户端计算机之间，同步和共享您拥有的文件或他人与您共享的文件。



Synology Note Station Client
Synology Note Station Client讓您連線至 Synology NAS 上的 Note Station。從本機電腦便可離線管理筆記及待辦清單。

#### 同步
Active Backup for Business

#### ssh docker

通过SSH访问群晖NAS并运行Docker https://www.jianshu.com/p/1d01326016fc


## 硬件工具
### 测试
crystal disk info
https://crystalmark.info/en/software/crystaldiskinfo/

### 同步备份
https://freefilesync.org/download.php

### 恢复
TestDisk
https://www.cgsecurity.org/wiki/TestDisk

https://recoverit.wondershare.com/free-data-recovery/open-source-data-recovery-software.html


How to Fix the “File or Directory is Corrupted and Unreadable” Error on a Windows 10 Computer https://www.makeuseof.com/windows-10-fix-the-file-or-directory-is-corrupted-and-unreadable-error/

https://zhuanlan.zhihu.com/p/32304270

手机恢复：drfone

## 软件系统
### TrueNAS
TrueNAS（12.0 版前称为 FreeNAS）是一套基于 FreeBSD 操作系统核心的开放源代码的网络存储设备（英语：NAS）服务器系统，支持众多服务，用户访问权限管理，提供网页设置接口。FreeNAS 当前版本整个系统总共需 2GB 以上 USB 驱动器进行安装，并支持 USB 存储设备、LiveCD、CF 卡（转接成 IDE 设备）及硬盘等引导方式。目前有 LiveCD、镜像档、VMware 磁盘映像档三种发行方式。

### File Server
Caddy file server

### 专门工具

[微信聊天记录备份](https://github.com/greycodee/wechat-backup)


## troubleshooting
WD External Hard Drive Not Recognized But the Light is On https://www.easeus.com/storage-media-recovery/wd-external-hard-drive-not-recognized-working-with-light-on.html#:~:text=Change%20the%20USB%20Port%2FCable%20to%20Detect%20WD%20External%20Hard,shows%20up%20on%20the%20PC.
