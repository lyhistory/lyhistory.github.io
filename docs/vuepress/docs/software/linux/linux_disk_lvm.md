
---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

磁盘 disk (/dev/vda)=》分区 part (vda1 vda2.., fdisk /dev/vda) =》physical volume 物理卷 =》logic volume 逻辑卷

## built-in tools

```
df / lsblk - allows you to list available drives, including block devices.
mount / umount - simple tools allowing you to detach a partition to change its properties.
fdisk - management tool. It will recreate partitions with newly specified bounds.
e2fsck - allows checking of the modified file system for errors.
resize2fs - modifies existing file system to fit new size bounds.
```

## file sharing protocol

Linux: NFS
Win: SMB

## LVM
keywords:
lvm lun


![](/docs/docs_image/software/linux/linux_disk_lvm01.jpg)

https://landoflinux.com/linux_lvm_command_examples.html
```

pvdisplay
    pvdisplay -m    #显示逻辑卷和物理卷的关系 Display the mapping of physical extents to LVs and logical extents.
vgdisplay
lvdisplay

pvs - Display information about physical volumes
vgs - Display information about volume groups
lvs  - Display information about logical volumes

df -TH

fdisk -l

blkid

lsblk

/dev/mapper

```

mount new disk
https://support-intl.huaweicloud.com/zh-cn/qs-evs/evs_01_0033.html

### example mount raw disk
```
fdisk -l /dev/vdb

mkfs -t ext4 /dev/vdb1
mkdir /test
mount /dev/vdb1 /test

mount -a

##auto mount:

 vim /etc/fstab
    /dev/vdb        /lyhistory/  xfs     defaults        0 0

```
### example mount lvm
```
new:
fdisk -l
fdisk -l /dev/vdb
pvcreate /dev/vdb1
vgdisplay -l
pvs
vgcreate lyhistory-vg /dev/vdb1
vgs
lvcreate -l 100%FREE -n lyhistory lyhistory-vg
lvdisplay
mkfs.xfs /dev/lyhistory-vg/lyhistory
vi /etc/fstab
    /dev/lyhistory-vg/lyhistory       /lyhistory                    xfs    defaults        0 0

mkdir /lyhistory
mount -a
mount -l
fdisk -l

---------------------
extend:
lvs
pvs
pvcreate /dev/vdc
vgextend rhel /dev/vdc
lvcreate -n optgitlab -L 50G rhel
lvcreate -n loggitlab -L 50G rhel
vgs
cd /var/opt/
mkdir gitlab
cd /var/log/
mkdir gitlab
mkfs.xfs /dev/rhel/optgitlab
mkfs.xfs /dev/rhel/loggitlab
vi /etc/fstab
    /dev/rhel/optgitlab     /var/opt/gitlab xfs     defaults        0 0
    /dev/rhel/loggitlab     /var/log/gitlab xfs     defaults        0 0

mount -a
```

### example lvm resize
https://stackoverflow.com/questions/51663585/centos-disk-lvm-extension/52312111#52312111

```

1) pvresize /dev/sda2

    ,after execute, pls run pvs to check whether the pv size increased, if not, stop here

2) vgextend centos /dev/sda2

    ,after execute,pls check your vgs, see whether the size increased, if so go on to the next

3) lvextend -l 100%FREE /dev/mapper/centos-root

    ,after this, check lvs, if the root size not increased, go on

4) try:

    xfs_growfs /dev/mapper/centos-root or resize2fs /dev/mapper/centos-root

```


<disqus/>