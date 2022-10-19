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

准备

1.win10 shrink 系统盘，分出unlocated空余的磁盘空间，不用创建分区，不需要分配盘符

![](/docs/docs_image/software/linux/linux_install01.png)

2.用win32DiskImage 把 ISO 文件写入 U盘 / 移动硬盘
3. F10进入BIOS(hp laptop)修改 boot option，把USB 选项打开并且放在第一项

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
