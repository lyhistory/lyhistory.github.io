
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
lvdisplay

vgdisplay

pvdisplay

lvs
df -TH

fdisk -l

blkid

lsblk

/dev/mapper

```

mount new disk
https://support-intl.huaweicloud.com/zh-cn/qs-evs/evs_01_0033.html

```
fdisk -l /dev/vdb

mkfs -t ext4 /dev/vdb1
mkdir /test
mount /dev/vdb1 /test

mount -a

```

auto mount:
```
 vim /etc/fstab
```

example:
https://stackoverflow.com/questions/51663585/centos-disk-lvm-extension/52312111#52312111


<disqus/>