---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 基础概念

镜像 image VS 固件 firmware



知识：
	mbr gpt
	Fat32 NTFS
	LVM
	EFI
	WINDOWS BOOT MANAGER
坑：
U盘和移动硬盘启动
Win10 MBR 引导启动
Linux可能对ntfs支持不好，所以建议fat32格式化
安装位置（不要覆盖另外一个系统，不要装到了U盘上，除非是安装到raspberry pi的存储卡上）
分区 swap / /home /boot /boot/efi


![](/docs/docs_image/software/tools/linux_boot_process.png)
1.BIOS(Basic Input/Output System)
2.MBR(Master Boot Record)
3.LILO or GRUB
LILO:-LInux LOader
GRUB:-GRand Unified Bootloader
4.Kernel
5.init
6.Run Levels
1.BIOS:
i.When we power on BIOS performs a Power-On Self-Test (POST) for all of the different hardware components in the system to make sure everything is working properly
ii.Also it checks for whether the computer is being started from an off position (cold boot) or from a restart (warm boot) is
stored at this location.
iii.Retrieves information from CMOS (Complementary Metal-Oxide Semiconductor) a battery operated memory chip on the motherboard that stores time, date, and critical system information.
iv.Once BIOS sees everything is fine it will begin searching for an operating system Boot Sector on a valid master boot sector
on all available drives like hard disks,CD-ROM drive etc.
v.Once BIOS finds a valid MBR it will give the instructions to boot and executes the first 512-byte boot sector that is the first
sector (“Sector 0″) of a partitioned data storage device such as hard disk or CD-ROM etc .
2.MBR
i. Normally we use multi-level boot loader.Here MBR means I am referencing to DOS MBR.
ii.Afer BIOS executes a valid DOS MBR,the DOS MBR will search for a valid primary partition marked as bootable on the hard disk.
iii.If MBR finds a valid bootable primary partition then it executes the first 512-bytes of that partition which is second level MBR.
iv. In linux we have two types of the above mentioned second level MBR known as LILO and GRUB
3.LILO
i.LILO is a linux boot loader which is too big to fit into single sector of 512-bytes.
Page on ii.so it is divided into two parts :an installer and a runtime module.
iii.The installer module places the runtime module on MBR.The runtime module has the info about all operating systems installed.
iv.When the runtime module is executed it selects the operating system to load and transfers the control to kernel.
v.LILO does not understand filesystems and boot images to be loaded and treats them as raw disk offsets
GRUB
i.GRUB MBR consists of 446 bytes of primary bootloader code and 64 bytes of the partition table.
ii.GRUB locates all the operating systems installed and gives a GUI to select the operating system need to be loaded.
iii.Once user selects the operating system GRUB will pass control to the karnel of that operating system.
see below what is the difference between LILO and GRUB
4.Kernel
i.Once GRUB or LILO transfers the control to Kernel,the Kernels does the following tasks

Intitialises devices and loads initrd module
mounts root filesystem
5.Init
i.The kernel, once it is loaded, finds init in sbin(/sbin/init) and executes it.
ii.Hence the first process which is started in linux is init process.
iii.This init process reads /etc/inittab file and sets the path, starts swapping, checks the file systems, and so on.
Page on iv.it runs all the boot scripts(/etc/rc.d/*,/etc/rc.boot/*)
v.starts the system on specified run level in the file /etc/inittab
6.Runlevel
i.There are 7 run levels in which the linux OS runs and different run levels serves for different purpose.The descriptions are
given below.

0 – halt
1 – Single user mode
2 – Multiuser, without NFS (The same as 3, if you don’t have networking)
3 – Full multiuser mode
4 – unused
5 – X11
6 – Reboot
ii.We can set in which runlevel we want to run our operating system by defining it on /etc/inittab file.

## U盘启动
市面上很多一键u盘启动制作工具都有病毒，比如某某菜某某桃等，不小心电脑就成为别人的肉鸡，还是选用开源透明的工具比较靠谱：
https://github.com/pbatard/rufus

## sdcard启动

Win32DiskImager

## win10安装linux双系统
准备

1.win10 shrink 系统盘，分出unlocated空余的磁盘空间，不用创建分区，不需要分配盘符

![](/docs/docs_image/software/linux/linux_install01.png)

2.用win32DiskImage 把 ISO 文件写入 U盘 / 移动硬盘
1. F10进入BIOS(hp laptop)修改 boot option，把USB 选项打开并且放在第一项

![](/docs/docs_image/software/linux/linux_install02.png)

![](/docs/docs_image/software/linux/linux_install03.png)

安装：


![](/docs/docs_image/software/linux/linux_install04.png)

![](/docs/docs_image/software/linux/linux_install05.png)

![](/docs/docs_image/software/linux/linux_install06.png)

![](/docs/docs_image/software/linux/linux_install07.png)

![](/docs/docs_image/software/linux/linux_install08.png)

重启：注意拔掉移动硬盘或U盘，否则再次进入安装页面，如果忘记，可以拔掉，手动输入reboot重启
完成后，最后改回bios的boot顺序，我的情况是把OS boot manager放在第一位
最后 由于之前U盘/移动硬盘被写入了iso，所以他们是有mbr引导区的，意味着不能被windows默认的disk manager格式化了，所以这里用了EaseUS partition manager home edition，wipe data and format

参考：
BIOS 
	HP SPECTRE F10 / ESC+F10
win10 shrink format? fat32 ntfs

usb installer - win32 image
https://wiki.centos.org/HowTos/InstallFromUSBkey
https://syaifulnizamyahya.wordpress.com/2015/05/27/how-to-create-centos-7-bootable-usb-drive-in-windows/


https://jingyan.baidu.com/article/148a1921dd2ee64d70c3b16a.html
https://jingyan.baidu.com/article/20b68a88b2077f796cec621b.html
http://www.jianshu.com/p/b43b4ec976a4

http://cache.baiducontent.com/c?m=9d78d513d9861af34fece47d0f01d6160e2482744cd7c7637ac3e34a84652b10103aa5e666351174d6d13b275fa0131aacb22173441e3df2de8d9f4aaafdc82d388850652c01c70a53954ef0d6187e9d3d9058eaaa1be7a7f03093add9d4c854248b094325de&p=c033d716d9c114e812bd9b7d0d1592&newp=882a9645d58259fc57efd3277f4a9e231610db2151d6d301298ffe0cc4241a1a1a3aecbf2122150ed0ce7e6d0aa44f5cedf630733d0434f1f689df08d2ecce7e6e90&user=baidu&fm=sc&query=win10%B0%B2%D7%B0centos7&qid=e9cc01290005cac0&p1=1

https://www.youtube.com/watch?v=4zKjJ0MKL50

http://www.cnblogs.com/xiaozhupo/p/5333854.html

http://www.cnblogs.com/LeisureLak/p/6215520.html


写入多个iso
https://fossbytes.com/how-to-put-multiple-iso-files-in-one-bootable-usb-disk-create-multiboot-usb-disk/

找不到引导区
http://blog.csdn.net/ergouge/article/details/49836913
