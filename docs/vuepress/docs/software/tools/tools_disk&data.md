
## 磁盘知识

Network-attached storage (NAS) is dedicated file storage that enables multiple users and heterogeneous client devices to retrieve data from centralized disk capacity. Users on a local area network (LAN) access the shared storage via a standard Ethernet connection.

NAS（Network Attached Storage：网络附属存储）按字面简单说就是连接在网络上，具备资料存储功能的装置，因此也称为“网络存储器”。它是一种专用数据存储服务器。它以数据为中心，将存储设备与服务器彻底分离，集中管理数据，从而释放带宽、提高性能、降低总拥有成本、保护投资。其成本远远低于使用服务器存储，而效率却远远高于后者。目前国际著名的NAS企业有Netapp、EMC、OUO等。


SSD HDD

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

+ 硬盘盒
+ 磁盘阵列柜 raid
  - 单盘模式
  - 互备模式
+ 个人云产品 - 联想个人云
  
## 工具
TestDisk
https://www.cgsecurity.org/wiki/TestDisk

crystal disk info
https://crystalmark.info/en/software/crystaldiskinfo/


How to Fix the “File or Directory is Corrupted and Unreadable” Error on a Windows 10 Computer https://www.makeuseof.com/windows-10-fix-the-file-or-directory-is-corrupted-and-unreadable-error/

https://zhuanlan.zhihu.com/p/32304270

## TrueNAS
TrueNAS（12.0 版前称为 FreeNAS）是一套基于 FreeBSD 操作系统核心的开放源代码的网络存储设备（英语：NAS）服务器系统，支持众多服务，用户访问权限管理，提供网页设置接口。FreeNAS 当前版本整个系统总共需 2GB 以上 USB 驱动器进行安装，并支持 USB 存储设备、LiveCD、CF 卡（转接成 IDE 设备）及硬盘等引导方式。目前有 LiveCD、镜像档、VMware 磁盘映像档三种发行方式。

## File Server
Caddy file server

## troubleshooting
WD External Hard Drive Not Recognized But the Light is On https://www.easeus.com/storage-media-recovery/wd-external-hard-drive-not-recognized-working-with-light-on.html#:~:text=Change%20the%20USB%20Port%2FCable%20to%20Detect%20WD%20External%20Hard,shows%20up%20on%20the%20PC.
