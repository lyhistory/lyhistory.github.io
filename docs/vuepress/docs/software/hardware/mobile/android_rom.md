
Key Concepts:

ROM: Factory Images
> Read-only memory (ROM) is a type of non-volatile memory used in computers and other electronic devices. Data stored in ROM cannot be electronically modified after the manufacture of the memory device. Read-only memory is useful for storing software that is rarely changed during the life of the system, also known as firmware. 
> https://en.wikipedia.org/wiki/Read-only_memory
ROM Images:
> The contents of ROM chips can be extracted with special hardware devices and relevant controlling software. This practice is common for, as a main example, reading the contents of older video game console cartridges. Another example is making backups of firmware/OS ROMs from older computers or other devices - for archival purposes, as in many cases, the original chips are PROMs and thus at risk of exceeding their usable data lifetime.

> The resultant memory dump files are known as ROM images or abbreviated ROMs, and can be used to produce duplicate ROMs - for example to produce new cartridges or as digital files for playing in console emulators. The term ROM image originated when most console games were distributed on cartridges containing ROM chips, but achieved such widespread usage that it is still applied to images of newer games distributed on CD-ROMs or other optical media.

> ROM images of commercial games, firmware, etc. usually contain copyrighted software. The unauthorized copying and distribution of copyrighted software is a violation of copyright laws in many jurisdictions, although duplication for backup purposes may be considered fair use depending on location. In any case, there is a thriving community engaged in the distribution and trading of such software and abandonware for preservation/sharing purposes.

firmeware vs rom:
> Firmware also called as BIOS (Basic Input Output System) is usually small software package that is permanently installed/written (cannot not be uninstalled normally) on the memory chip that is “Read Only Memory” which mean the hard ware of the system is not allowed to make changes to it. How ever it can be be updated by specific procedure and if done wrongly it can make a machine permanently unusable. This BIOS/Firmware helps the hard ware to communicate with each other and assign their roles. It let the OS (operating system i.e. Windows etc) to be installed to do specific tasks and then other applications to do further complex tasks.
> https://www.quora.com/What-is-the-difference-between-firmware-and-a-ROM

OTA: Over the air, 分为incremental or full ota
What is the difference between Factory Images and Full OTA Images on the Android download site?
https://android.stackexchange.com/questions/207600/what-is-the-difference-between-factory-images-and-full-ota-images-on-the-android
> Factory images are bootloader compatible images, that is to say, they can be flashed using fastboot or alternative low-level tools or environment.
> Full OTA images are over-the-air updates that are to be flashed via recovery environment. OTA updates are usually either incremental or full. Incremental updates require the user to be running a specific Android build (not just Android version) as they increment in the existing build only. On the other hand, full OTA updates don't require a specific existing build to continue. They are handy when a user hasn't updated their system for a long time and wants to skip successive incremental updates.

rom又分为官方rom/stock firmware和custom rom
> Do you mean by installing stock Android? That's where XDA Developers come in, if any devs actually created custom ROMs for Mate 7.
> https://forums.hardwarezone.com.sg/mobile-communication-technology-9/how-format-huawei-ascend-mate-7-pure-android-5502081.html

我的旧手机华为mate7想改造成为一台黑客基站，需要升级android版本，但是要首先root一下，首先我还是清理了下手机，
卸载了几乎除了系统安装的所有软件，手动删除了很多我认为是垃圾文件夹，估计是不慎删多了，google play打开出错，
我直接reset工厂模式，然后下面是root的过程

为什么要root
> Rooting Huawei Ascend Mate 7 means you’re now the god of your Huawei device.
> You can do everything. you can Increase RAM of Huawei Ascend Mate 7 Device, Play HD Games, Increase Internal Memory, Delete Bloatware Android Apps, but you need to be careful about what you install because some apps can use root permission to damage or brick your Huawei Ascend Mate 7 device.

一些推荐的app
> Root Explorer, ES File Explorer, Lucky Patcher, Dumpster, Xposed Framework, Titanium Backup, apps2rom, Bloatfreezer, Link2SD, Android Wi-Fi Tether, Wireless Tether, ShootMe, Dropcap2, Greenify, Root Explorer, ClockworkMod Recovery, AdFree, Adaway, Droid Wall, Orbot, Cache Mate, Droid VNC Server, LBE Privacy Guard, Button Savior, gravitybox, xhangouts, xwhatsapp, Xprivacy, SetCPU, Overclock Widget, ROEHSOFT RAM-EXPANDER, Memory Swapper Free, ClockSync, AdBlock Plus, SuperSU, Titanium Backup, Wakelock Detector, ROM Manager, Quick Boot, LED Hack, TRIM, StickMount, busybox, Viper4Android

Model: HUAWEI MT7-L09
CPU: Hisilicon Kirin 925
RAM: 2.0G
Android Version：4.4.2
EMUI version：EMUI 3.0

root和unlock bootloader的区别
> Root是”取得”系统最高权限，你可以自由存取/删除系统档案，也可以增加对于系统的控制能力.
> Unlock Bootloader是解除系统启动加载器（Bootloader）的原厂限制，让用户可以使用到更多的功能（如刷新内核、刷ROM、修改超频….）
> https://blog.csdn.net/my_xxh/article/details/51638085

## root

本来是想参照[How to ROOT Huawei Ascend Mate 7](https://huaweiflash.com/how-to-root-huawei-ascend-mate-7/)，
结果他这种方法的prerequisite是按照twrp，然后安装twrp的前提是unlock bootloader解锁，然后解锁的申请通道被华为关闭了！
所以参考解锁的另一种办法[绕过官方unlock code](http://www.usbmi.com/4280.html),但是他这种方法的前提是root！循环回来了，
不过幸运的是，我用了[kingo Root](https://www.kingoapp.com/android-root.htm)，或者用“刷机精灵的一键root”
一键root成功！

以后不想买华为了，还是买one plus吧！

root本质应该就是在/system/bin/su或者/system/xbin/su下面增加一个superuser

## 解锁手机 Unlock Bootloader

我们使用ADB命令行获取解锁码，首先下载[ADB](https://developer.android.google.cn/studio/releases/platform-tools)
ps:本来想使用[秋之盒](https://atmb.sm9.top/AutumnBox/%E4%B8%BB%E7%A8%8B%E5%BA%8F/)，结果其内置adb启动不了

Enable USB debugging & OEM unlocking:
Go to Settings ==> About Phone and tap 8 times on Build Number until it says You’re a developer.
usb连接电脑 手机里面USB连接方式选择PC助手（HiSuite）

打开cmd或powershell，到ddb目录下
```
adb.exe devices
adb.exe shell
#进入手机shell
su
#sdcard0 内置存储 sdcard1外部存储
cd storage/sdcard1/
mkdir -p PartitionBackup
cd PartitionBackup
#把nvme路径下的文件复制到PartitionBackup
dd of=nvme \
if=/dev/block/platform/ff1fe000.dwmmc0/by-name/nvme
dd of=oeminfo \
if=/dev/block/platform/ff1fe000.dwmmc0/by-name/oeminfo 
dd of=recovery \
if=/dev/block/platform/ff1fe000.dwmmc0/by-name/recovery

strings nvme | grep WVDEVID -B 1
```
在host机器上可以直接将文件pull下来
```
.\adb.exe pull /storage/sdcard1/PartitionBackup/nvme .
```

下载[winhex](https://www.x-ways.net/winhex/),
打开nvme，搜索WVLOCK

解锁unlock bootloader
打开“华为工具箱” 点击 解锁bootloader

正在检查设备连接。。
设备连接成功。。
正在重启你的手机，即将进入FastBoot模式。。。(为保证解锁成功，请等待10秒)。。。
正在尝试解锁。。
如果手机重启，说明你成功解锁BootLoader。。。否则，请你重新获取正确的解锁码后再试。。。

手机重启并进入 FASTBOOT&RESCUE MODE，显示机器人页面，提示：Phone Unlocked
至此解锁成功！

## 刷firmware

华为fireware:
http://huawei-firmware.com/?q=MT7-L09&load_page=search&page=1
https://forum.xda-developers.com/mate-7/general/huawei-mt7-l09-l10-stock-firmware-ota-t3275784

线刷：
连usb 用工具刷，工具可以是第三方工具，也可以是FASTBOOT ，

https://www.androidcentral.com/android-z-what-fastboot

https://forum.xda-developers.com/showthread.php?t=2317790

安装adb，利用adb和fastboot

卡刷：
自己下载到手机
通过手机工具刷，工具可以是手机默认的recovery模式，或者是第三方recovery，比如安装TWRP 或cmw



终于找到了MT7-L09的包
https://forum.xda-developers.com/mate-7/general/huawei-mt7-l09-l10-stock-firmware-ota-t3275784

这个刷机方法原理可以学习下
https://huaweiflash.com/how-to-flash-huawei-stock-firmware-all-methods/

噩梦一般的刷机经历！前面说华为关闭了unlock code通道，现在又关闭了EMUI卡刷包通道，再也不买华为了

自己手动下载了所谓的官方固件update.app和update.zip，全部失败，搞笑的是EMUI updater有时候都无法识别到我放在sdcard（sdcard1）或者internal存储（sdcard0）上面的dload，
必须要一个放zip，一个放app才识别！
而且是不会成功，一更新重启就卡住在开机logo页面

然后试了firmwarefinder for huawei，也是手动下载，也尝试了proxy下载，都一样
https://www.jb51.net/shouji/615464.html

通过updater更新以及三键强刷都没用，甚至测试了三键的各种姿势：
> 三键强刷方法： 1、下载固件到手机的根目录中，下载下来解压出来，复制dload文件夹到手机根目录。 2、关闭手机。 3、按住音量+和音量- 、再按开机键，手机出现LOGO时放开机键，黑屏时全部放开，就进行强刷模式，开始强刷系统。


甚至也试过 按*#*#2846579#*#*进入工程模式系统升级 https://www.cnblogs.com/jifeng/p/7734117.html

在花粉俱乐部club.huawei.com也没有什么结果，社区好烂

最后发现了一些关键词：中转包 rec双清

才想明白，之所以刷不进去是因为官方的loader应该是做了检测，所以想强刷还是要刷入一个所谓的recovery！
理论：https://club.huawei.com/thread-2558980-1-1.html
> 手机启动的基本顺序为bootloader、recovery、系统（第三方）。我们对系统的升级、恢复出厂等都是基于recovery操作的，这个recovery，一般理解为镜像小系统，类似与ghost。是一个非常的小的文件系统，一般用来对系统进行操作。
> 也就是说，我们能不能刷第三方系统，能不能救砖，能不能刷回官方系统，取决于recovery是否能用，是否对系统有限制。
> 第三方recovery和官方recovery的最大不同在于是否对即将刷入的系统rom提供校验。一般官方的recovery会限制非官方的系统刷入，确保刷入的系统的可靠性和安全性
> 第三方的recovery一般可以刷更多的系统（第三方），更好的界面，更多的功能。其余2者差别不大。在个别功能上2者也有不同。rom制作者一般发布的rom只可以通过第三方recovery来刷。
> 当准备刷的rom对recovery的要求和本机一致时，则无需刷recovery，相反，则需要先刷recovery。

刷recovery需要首先unlock bootloader，这个前面已经做过了
> 一般能否卡刷第三方系统，取决于recovery能否更改。而能否刷recovery则取决于bootloader是否锁定。锁定，recovery则不可刷，反之则可刷。
> 注意的是：这个的可刷与否并不是指recovery文件分区是否可擦写，而是修改过的recovery是否可以顺利启动，修改过的系统是否可以顺利进入。

fastboot flash recovery XXX.img

## 安装 TWRP (Team Win Recovery Project)

所以我们现在要刷recovery，TWRP是其中一种第三方recovery

重复下TWRP可以干啥：
> Through TWRP you can flash official ROMs, Custom ROMs, kernels, add-ons, zip files Xposed Module on your Huawei Ascend Mate 7, install SuperSU or Magiskthat gives you root access to your Huawei Ascend Mate 7. the custom recovery has more additional features, restore & repair a soft-bricked Huawei Ascend Mate 7 device, Wiping, backing up, restoring partition, Make a Nandroid backup, create and restore Huawei Ascend Mate 7 backups, & Wipe data or factory reset your Huawei Ascend Mate 7 mobile. & There are a few Advanced section of TWRP like Fix permissions ADB Sideload File Manager Wrap up.
> https://huaweiflash.com/how-to-install-twrp-recovery-on-huawei-ascend-mate-7/

twrp.me/Deivces/Huawei没有找到mate7！
https://hwmate.blogspot.com/2016/05/twrp-recovery-mate7-mt7-for-android-51.html

```
adb reboot bootloader
fastboot flash recovery twrp_3.0.2_mate7_6.0.img
fastboot reboot
```
进入twrp：
```
adb reboot recovery
```
重启还是卡死在Huawei Ascend logo页面，同样三键power+volume+-也进不去，

试了twrp_2.8.7.0_mate7_6.0.img 也是一样


又试了 https://www.huaweirom.com/guide/3526.html

查了下，有人说是因为底包问题，要刷到3.1：
https://club.huawei.com/thread-6915106-1-1.html
有人说“先三建强刷4.4.2的133底包然后本地升级357”

又陷入死循环，就是因为我无法刷包才想办法通过recovery来刷，但是现在不升级底包就刷不了

最终我发现了CMW - clockworkmode CWM-based Recovery V6.0.5.1 ONLY FOR Huawei MT7-TL10
http://www.romleyuan.com/lec/read?id=247

但是这个在刷机的时候出现各种错误,比如

E:unknown command [errno]
file_getprop: failed to stat

甚至clear cache的时候都有错误
unkonw volume for path /sd-ext

我试了internal和external sdcard以及通过连接电脑，用adb工具发送：
```
 .\adb.exe sideload update.zip
```
又提示 error /tmp/update.zip 
我甚至还测试了
```
.\adb.exe push update.zip /tmp/update.zip
```
都没有成功，

查了下
https://forum.xda-developers.com/mate-7/help/softbricked-device-fix-t3159742
https://forum.xda-developers.com/mate-7/help/5-1-to-4-4-2-bootloop-t3132888

还是没有解决,最后发现了原来可以直接用play store搜索clockworkmod下载rom manager,
rom manager的使用前提是手机要先root过，不然会提示
"You must root your phone for ROM Mnager to function. Superuser was not found at /system/bin/su or /system/xbin/su "

首次进去会提示设置custom recovery,然后选择INSTALL OR UPDATE RECOVERY->ClockworkMod Recovery，
Confirm Phone Model，如果没有检测到，选择show all，然后手动选择，我的是Huawei Ascend，
然后点击Flash ClockworkMod Recovery，等待下载，不要离开，下载完会弹出root权限授权，点击allow，
最后提示flash successful，说明刷入CMW recovery成功！
当然你也可以手动触发上面的设置过程，点击首页的Recovery setup即可

提示：最好backup一下当前的rom，默认路径/mnt/shell/emulated/clockworkmod/backup

然后我用这个cmw刷了下这个包，~~说是3.1其实是3.0 http://rom.7to.cn/romdetail/50356~~，实际我后来又看了下应该是
http://www.romleyuan.com/rom/info?romid=39ec2c69-a131-4a97-a7f2-19147f33252e这个包，因为我刷的时候用了很多包，
所以混淆很正常，我是从sdcard拷贝出来的包名看到的，而且我确认了这个里面是有supersu的，因为我确实刷好之后可以直接用rom manager，
说明是有root权限，所以ycjeson那个包里面实际没有supersu，所以可以排除了，
结果我前面用了那个rom乐园的EMUI3.0-4.4的工具包刷入的cmw有很多垃圾，reset factory会预装很多垃圾软件，
结果我用了这个包神奇的将系统重置回我之前的版本

~~然后我觉着ycjeson这个人开发的rom包还不错，所以想继续尝试高版本，结果其说明里面明确了说：必须基于底包3.1/4，不然无法刷入，基于前面的坑，我强刷没戏，~~
这个思路是没错的，
不过这时候我想起，刚才不是看到了EMUI的recovery页面吗，我岂不是可以重新尝试刷官方stock firmware，
然后我就下载了这个全量包，update.zip，里面看起来挺全的，不只是有update.app，还有
system,cust,patch,META-INF
http://huawei-firmware.com/rom/huawei-mate-7/mt7-tl00/15076

将update.zip放入外置sdcard的dload里面，结果updater不识别，不过根据前面的姿势，知道可以解压开，
把update.app也放出来，果然updater识别了，显示一个incremental增量update.app包，一个integrate zip包，
我当然是点击刷全量zip包，重启果然成功了，哎呀赶紧多下载下这个网站的rom备份下：
注意链接，根据型号来，我的是L09，根据版本的区别：渠道版TL，移动版，电信版，联通版，这里T100应该是TL10
FullOTA-MF vs FullOTA-MF-PV： 
According to team MT. PV means point version and is used to move between android versions e.g. 7 to 8. MF means multi file e.g. more than one update is contained in the package.
> MT7-CL00是电信版型号，可以是标配版，也可以是高配版。
MT7-TL10是高配版移动联通双4G版（公开版），一定是高配版。

mate7总共分为标配版和高配版。
标配版有电信版、移动版、联通版。
高配版有移动版、电信版、公开版。
电信版：CLOO   移动版：TL00  联通版：UL00   公开版：TL10
只有高配和标配有区别，运营商版本配置都是一样的。
> https://wenwen.sogou.com/z/q703188238.htm

http://huawei-firmware.com/phone-list/huawei-ascend-mate-7

根据上面的说法，我应该找我L09对应的
http://huawei-firmware.com/phone-list/huawei-ascend-mate-7/jazz-l09
或者公开版
http://huawei-firmware.com/phone-list/huawei-ascend-mate-7/jazz-tl10
但是貌似里面都没有full ota PV版本，
而实际上我前面成功的版本是在tl00也就是移动版下找到的
http://huawei-firmware.com/phone-list/huawei-mate-7/mt7-tl00



思路总结
如果系统recovery卡死，通过三方recovery刷新同版本rom，然后再通过系统recovery升级底包，然后你可以开心的升级其他三方的custom rom

几点建议：
做操作之前先备份，通过命令行或者工具备份你的数据 
```
//backup
adb backup -apk -shared -all -nosystem -f backup08262012.ab
adb restore backup08262012.ab
//restore

```
同样也要备份当前rom，如果你也是孤儿版，估计找到原厂firmware的几率比较低，所以备份很重要，备份别忘了存到电脑，如果你存到了sdcard又format了相当于啥都没备份
rom manager有备份功能，备份默认存在
/mnt/shell/emulated/clockworkmod/backup
普通用户无法查看操作，可以通过adb命令用superuser权限查看获取
adb shell "su -c '[your command goes here]'"
.\adb.exe shell "su -c 'ls /storage/sdcard0/clockworkmod/download'"
但是有时候rom manager可能不工作 http://www.droidforums.net/threads/rom-manager-will-not-backup-my-current-rom.55511/
另一种方法就是直接通过adb命令backup image，然后通过fastboot或者shell命令re-install image：
```
-- backup/dump image(include system.img recovery.img etc)
https://forum.xda-developers.com/showthread.php?t=2771411
method1 via adb shell dd：
首先要明确 Android MMC/EMMC/MTD Partition Layout
https://wossoneri.github.io/2018/11/06/[Android]MTD-MMC-EMMC-partition-layout/
https://www.cnblogs.com/shangdawei/p/4514128.html

1|root@hwmt7:/ # cat /proc/mtd
dev:    size   erasesize  name
mtd0: 00020000 00001000 "block2mtd: /dev/block/mmcblk0p1"
mtd1: 00020000 00001000 "block2mtd: /dev/block/mmcblk0p2"
mtd2: 00400000 00001000 "block2mtd: /dev/block/mmcblk0p7"
mtd3: 00400000 00001000 "block2mtd: /dev/block/mmcblk0p23"
mtd4: 00400000 00001000 "block2mtd: /dev/block/mmcblk0p25"
mtd5: 03c00000 00001000 "block2mtd: /dev/block/mmcblk0p26"
mtd6: 00400000 00001000 "block2mtd: /dev/block/mmcblk0p27"
mtd7: 01800000 00001000 "block2mtd: /dev/block/mmcblk0p29"
mtd8: 00400000 00001000 "block2mtd: /dev/block/mmcblk0p6"

root@hwmt7:/ # ls -l /dev/block/platform/hi_mci.0/by-name
lrwxrwxrwx root     root              2020-06-01 20:13 3rdmodem -> /dev/block/mmcblk0p31
lrwxrwxrwx root     root              2020-06-01 20:13 3rdmodemnvm -> /dev/block/mmcblk0p32
lrwxrwxrwx root     root              2020-06-01 20:13 3rdmodemnvmbkp -> /dev/block/mmcblk0p33
lrwxrwxrwx root     root              2020-06-01 20:13 boot -> /dev/block/mmcblk0p13
lrwxrwxrwx root     root              2020-06-01 20:13 cache -> /dev/block/mmcblk0p39
lrwxrwxrwx root     root              2020-06-01 20:13 cust -> /dev/block/mmcblk0p37
lrwxrwxrwx root     root              2020-06-01 20:13 dfx -> /dev/block/mmcblk0p22
lrwxrwxrwx root     root              2020-06-01 20:13 dts -> /dev/block/mmcblk0p20
lrwxrwxrwx root     root              2020-06-01 20:13 fastboot -> /dev/block/mmcblk0p4
lrwxrwxrwx root     root              2020-06-01 20:13 fw_hifi -> /dev/block/mmcblk0p9
lrwxrwxrwx root     root              2020-06-01 20:13 fw_lpm3 -> /dev/block/mmcblk0p5
lrwxrwxrwx root     root              2020-06-01 20:13 hibench -> /dev/block/mmcblk0p8
lrwxrwxrwx root     root              2020-06-01 20:13 hisitest0 -> /dev/block/mmcblk0p35
lrwxrwxrwx root     root              2020-06-01 20:13 hisitest1 -> /dev/block/mmcblk0p36
lrwxrwxrwx root     root              2020-06-01 20:13 misc -> /dev/block/mmcblk0p11
lrwxrwxrwx root     root              2020-06-01 20:13 modem -> /dev/block/mmcblk0p26
lrwxrwxrwx root     root              2020-06-01 20:13 modem_dsp -> /dev/block/mmcblk0p27
lrwxrwxrwx root     root              2020-06-01 20:13 modem_om -> /dev/block/mmcblk0p28
lrwxrwxrwx root     root              2020-06-01 20:13 modemnvm_backup -> /dev/block/mmcblk0p23
lrwxrwxrwx root     root              2020-06-01 20:13 modemnvm_factory -> /dev/block/mmcblk0p7
lrwxrwxrwx root     root              2020-06-01 20:13 modemnvm_img -> /dev/block/mmcblk0p24
lrwxrwxrwx root     root              2020-06-01 20:13 modemnvm_system -> /dev/block/mmcblk0p25
lrwxrwxrwx root     root              2020-06-01 20:13 modemnvm_update -> /dev/block/mmcblk0p29
lrwxrwxrwx root     root              2020-06-01 20:13 nvme -> /dev/block/mmcblk0p6
lrwxrwxrwx root     root              2020-06-01 20:13 oeminfo -> /dev/block/mmcblk0p16
lrwxrwxrwx root     root              2020-06-01 20:13 recovery -> /dev/block/mmcblk0p14
lrwxrwxrwx root     root              2020-06-01 20:13 recovery2 -> /dev/block/mmcblk0p30
lrwxrwxrwx root     root              2020-06-01 20:13 recovery3 -> /dev/block/mmcblk0p15
lrwxrwxrwx root     root              2020-06-01 20:13 reserved1 -> /dev/block/mmcblk0p3
lrwxrwxrwx root     root              2020-06-01 20:13 reserved2 -> /dev/block/mmcblk0p12
lrwxrwxrwx root     root              2020-06-01 20:13 secure_storage -> /dev/block/mmcblk0p21
lrwxrwxrwx root     root              2020-06-01 20:13 sensorhub -> /dev/block/mmcblk0p17
lrwxrwxrwx root     root              2020-06-01 20:13 splash -> /dev/block/mmcblk0p18
lrwxrwxrwx root     root              2020-06-01 20:13 splash2 -> /dev/block/mmcblk0p34
lrwxrwxrwx root     root              2020-06-01 20:13 splash3 -> /dev/block/mmcblk0p19
lrwxrwxrwx root     root              2020-06-01 20:13 system -> /dev/block/mmcblk0p38
lrwxrwxrwx root     root              2020-06-01 20:13 teeos -> /dev/block/mmcblk0p10
lrwxrwxrwx root     root              2020-06-01 20:13 userdata -> /dev/block/mmcblk0p40
lrwxrwxrwx root     root              2020-06-01 20:13 vrl -> /dev/block/mmcblk0p1
lrwxrwxrwx root     root              2020-06-01 20:13 vrl_backup -> /dev/block/mmcblk0p2

cd storage/sdcard1/
mkdir -p RomBackup
cd RomBackup

dd of=boot.img if=/dev/block/platform/hi_mci.0/by-name/boot
dd of=recovery.img if=/dev/block/platform/hi_mci.0/by-name/recovery
dd of=recovery2.img if=/dev/block/platform/hi_mci.0/by-name/recovery2
dd of=recovery3.img if=/dev/block/platform/hi_mci.0/by-name/recovery3
dd of=system.img if=/dev/block/platform/hi_mci.0/by-name/system

//dd if=/dev/block/hi_mci.0 of=/mnt/external_sd/backup/metadata.img
//dd if=/dev/block/mtdblock0 of=/mnt/external_sd/backup/misc.img
//dd if=/dev/block/mtdblock1 of=/mnt/external_sd/backup/kernel.img
//dd if=/dev/block/mtdblock4 of=/mnt/external_sd/backup/backup.img
// /data/busybox-armv7l_1.21.1 ls -ltr /mnt/external_sd/backup/
more if need:
//dd if=/dev/block/mtdblock5 of=/mnt/external_sd/backup/cache.img
//dd if=/dev/block/mtdblock6 of=/mnt/external_sd/backup/userdata.img
//dd if=/dev/block/mtdblock7 of=/mnt/external_sd/backup/kpanic.img
//dd if=/dev/block/mtdblock9 of=/mnt/external_sd/backup/user.img

method2 via romdump：
https://forum.xda-developers.com/showthread.php?p=28732414#post28732414

-- re-install image
https://android.stackexchange.com/questions/22473/install-system-img-on-android-phone
method1 fastboot:
If you have a fastboot-enabled bootloader
fastboot flash system /path/to/system.img

method2 adb shell dd:
adb push system.img /sdcard/
adb shell
dd if=/sdcard/system.img of=/your/system/partition

```

升级的时候要一个版本一个版本来，不要直接从android4升到6，先升到5，这样成功概率更高，步子太大容易扯着
如果发现你的系统recovery不好用，建议通过三方recovery刷一下当前的版本，我的意思是找个custom或者official的rom，版本跟你当前版本一致，原因是也许你当前的版本有特别的限制，所以你刷个同等版本的首先容易成功，如果成功你再测试recovery就更容易成功
手机这个玩意还是很多变量：
	比如外置sdcard是否要format，我甚至看到有人三键强刷升级的时候是等系统重启到logo页面，黑掉之后才迅速插入sdcard，所以需要多试试不同的姿势；
	再比如，有时候你以为是卡死，但是请耐心多等待一会，比如放20十分钟或者一个小时，也许就会不同；
时刻清楚当前的机器的状态，比如是reset factory之后还是clear cache之后，还是刷了三方recovery之后，再比如每次reset factory和升级之后，你的root权限是否还在，这些状态是你下一步的判断依据
通过细小的差异，观察系统的反应，你会找到跟机器交流的感觉





其他思路：通过fastboot直接刷https://www.youtube.com/watch?v=AIyEO4uoWLc
MagiskManager



## 后续

用了AsiaPacific571的包Update.APP通过updater更新到了android6 emui4，注意更新后手机的解锁状态和root状态都会变掉；

我重新root，但是发现root失效，然后尝试了手机kingoroot和电脑的各种一键root皆失败，重新解锁后再尝试也不可以，查了下原因，应该是这个作者说的

> 坛子里很多花粉用一键ROOT工具，过程很顺利，却发现不能获取ROOT权限。这与工具无关，与P7的保护机制有关。
>
> 在system目录下，有一个set_immutable.list文件，这个文件设置了以下目录/文件不能被修改/删除/增加等操作：
> /system/build.prop
> /system/etc
> /system/fonts
> /system/framework
> /system/isp.bin
> /system/lib
> /system/ons.bin
> /system/usr
> /system/vendor
> /system/xbin
> /system/app/HwLauncher6.apk
> /system/app/HwLauncher6.odex
> /system/app/Syst[EMUI](https://club.huawei.com/forum.php?gid=2867).apk
> /system/app/SystemUI.odex
> /system/priv-app/SettingsProvider.apk
> /system/priv-app/SettingsProvider.odex
> /system/priv-app/Keyguard.apk
> /system/priv-app/Settings.apk
> /system/priv-app/Settings.odex
> /system/priv-app/Keyguard.apk
>
> 对一键ROOT工具而言，需要将su文件写入/system/xbin或者/system/bin目录，而P7则设置这两个目录无法写入，也就导致了最终结果是superuser.apk能写入system/app目录，但su文件没有写入，也就无法获取全部root权限。
>
> 即便是刷入第三方REC，然后刷入通用的ROOT包，仍然是这样的结果。
>
> 原因就在于set_immutable.list文件的功能相当于linux下将这些目录和文件增加了特殊权限i。想要刷入ROOT包，必须先解除i权限，但这些操作对小白而言太繁琐。所以通用的ROOT对P7而言是无效的，必须要针对P7的ROOT包。
>
> 本人将通用的ROOT包的刷机脚本加入了解除i权限并删除set_immutable.list，这样刷入可完美ROOT。ROOT包见附件。
>
> https://club.huawei.com/thread-6551920-1-1.html

发现网上有教师用magisk来patch boot.img，试了下如下的方案，但是失败，在fastboot boot magisk_patched.img时报错“remote cmd not allowed”

https://cn.ui.vmall.com/thread-20997307-1-1.html

https://sspai.com/post/53043

然后去到官网看指导，果然我的手机根本不符合这种patch方式安装，所以还是老老实实用三方recovery刷入

https://topjohnwu.github.io/Magisk/install.html

前面在刷twrp的时候失败，但是此时我已经升级到了emui4 android6，所以就再尝试一次

下载这个版本twrp-v1-hi3630.img
https://forum.xda-developers.com/mate-7/development/twrp-t3741830
https://forum.xda-developers.com/devdb/project/dl/?id=28340

```
要保证手机状态是unlock解锁状态：
判断方法：adb reboot bootloader可以看到手机状态
开始刷twrp：
adb reboot bootloader
fastboot flash recovery twrp-v1-hi3630.img
fastboot reboot
判断是否成功：
adb reboot recovery

```

注意，一定要及时用twrp做备份，并且存到电脑上，我后面实验adoptable storage的时候从网上下载了一个boot.img kernel文件，由于通过twrp刷不进去，所以用fastboot flash boot boot.img，但是失败，但是估计是刷入了部分内容，手机直接变砖，幸运的是三键还可以进入到twrp，所以直接用之前的备份restore即可（注意restore重启之后需要等待挺长时间，耐心等待）

ROOT Huawei Ascend Mate 7 via Magisk

```
1- Copy and paste the **Magisk zip file** to the internal storage or SD card of your phone.
https://github.com/topjohnwu/Magisk/releases
2- Reboot your **Huawei Ascend Mate 7** to TWRP Recovery

- Power off the **Huawei Ascend Mate 7** completely.
- Press & Hold the **Power key** and **Volume up key.**
- The phone should enter into the TWRP Recovery mode.

3- Tap on **Install** button, and select the **Magisk zip file** that you have copied.

4- Swiping **Swipe to Confirm Flash** to Confirm the installation
```





### 扩展内部存储

当然很多人觉着直接插入一个大容量的external sdcard不就可以了，然后可以从手机的storage设置中将默认的安装位置切换到external sdcard，但是问题是，手机的很多partition 比如/data还是用的internal storage，所以另一个思路就是：extend interal storage with sdcard ，要注意的是，在这个之前要买一个好的sdcard。

什么是好的sdcard？

首先不要买错，手机用的通常都是MicroSD:

MicroSD vs. SD Card. MicroSD is a smaller variant of the SD (Secure Digital) card and is used in certain cell phones, PDAs and smaller, lighter devices. MicroSD cards can be read by regular SD card slots through an adaptor.

注意不要贪便宜，据说市场上4成的sandisk是假的，所以还是去官方店购买；

普通的sdcard在扩展为内部存储时，手机会告警：low speed SD card may seriously affect system performance, Class 10 or higher is recommended，所以推荐sandisk exterem pro

microSD: Has a capacity up to 2GB, and works in any microSD slot.
microSDHC: Has a capacity of more than 2GB and up to 32GB, and works in hardware that supports either SDHC and SDXC.
microSDXC: Has a capacity of more than 32GB and up to 2TB (although at the time of writing, 1TB is the largest available card), and is only supported in SDXC-compatible devices.
microSDUC: Supports cards up to 128TB, and will require a compatible device.

格式化：一般是fat32,

下面说扩展方法：

**method 1 via ext4 partition and link2sd app **
https://www.diskpart.com/articles/partition-sd-card-1203.html
注意，partition type ext2 3 4 尽量跟系统本身一致，可以用adb shell查看系统partition type ：cat /proc/mounts

**method 2 via Adoptable storage:**
https://fossbytes.com/android-sd-card-internal-storage-adoptable-storage/

发布文章：
https://mp.weixin.qq.com/s/b2HGQptEMExLeVL4Jo9_rw

huawei 禁用了，至少emui4我是没找到！

然后尝试rom essential，没什么效果，

尝试了https://forum.xda-developers.com/honor-4x/how-to/adoptable-storage-emui-4-4-4x-4c-g-play-t3515712，

结果变砖；

尝试了下面的手动命令，一样没用

shell@hwmt7:/ $ sm has-adoptable
false

shell@hwmt7:/ $ sm list-volumes all
private mounted null
public:179:169 mounted 0CB1-0A4C
emulated mounted null

shell@hwmt7:/ $ sm list-disks
disk:179:168
shell@hwmt7:/ $ sm partition disk:179:168 private
shell@hwmt7:/ $ sm list-volumes all
emulated:179:170 unmounted null
private:179:170 mounted 91aab7e7-cba6-4de1-909b-e746b0a3bcc9
private mounted null
emulated mounted null
shell@hwmt7:/ $ reboot

https://stackoverflow.com/questions/38044532/how-to-turn-a-portable-sd-card-into-internal-storage-via-adb-command

```
某些Android裝置設定並未提供Adoptable Storage（也許手機商認為這限制重重的功能無異脫褲子放x、且有影響效能的疑慮），但若執意啟用也可透過ADB以指令方式完成。
1.首先手機先開啟「開發人員模式」、進入設定中的「開發人員選項」開啟USB除錯，接著透過USB線與PC連接（PC端必要的驅動請自行尋求安裝）
2.在PC（以下操作為Windows環境）透過指令adb shell進入遠端操作模式
3.在shell模式可透過sm指令與相應參數進行操作（可直接執行sm列出可用參數）
sm list-disks 列出已安裝可支援Adoptable Storage的SD卡（預設參數adoptable可免打）
sm list-volumes [public|private|emulated|all]
  sm list-volumes all 可列出SD卡全部容體（等同磁碟分割區）
  sm list-volumes public 或 emulated 列出SD卡上的一般儲存區（FAT32或exFAT)
  sm list-volumes private 列出SD 卡上掛載為Adpotable Storage的儲存區
sm has-adoptable 可查詢系統是否啟用Adpotable Storage功能
sm get-primary-storage-uuid 可讀取SD卡UUID
sm set-force-adoptable [true|false] 若系統未開啟Adoptable Storage功能、可透過sm set-force-adoptable true強行開啟，或以sm set-force-adoptable false關閉。
sm partition DISK [public|private|mixed] [ratio] 設定SD卡Adoptable Storage空間。注意、進行此操作將完全刪除SD卡內容、務必先備份SD卡。
  sm partition DISK public 將SD卡完全格式化為一般儲存空間（FAT32或exFAT)
  sm partition DISK private 將SD卡完全格式化為Adoptable Storage（加密EXT4）
  sm partition DISK mixed [ratio] 將SD卡按比例格式化為一般儲存空間與Adoptable Storage。[ratio]為百分比指定Adoptable Storage比例、剩餘則為一般儲存區。並非所有裝置皆可支援混和模式、有可能回報儲存區損毀，此時請重新格式化SD卡避免使用mixed混和模式。
sm mount VOLUME 掛載指定容體
sm unmount VOLUME 卸載指定容體
sm format VOLUME 格式化指定容體
sm benchmark VOLUME 測試指定容體效能
sm forget [UUID|all] 退出指定UUID或全部可卸除裝置（SD卡）
```



新买的micro sdcard extreme pro，通过桌面分区工具AOMEI Partition Assistant Standard改成ext4后，link2sd 无法mount，总是弹出重试脚本，
刚开始怀疑是不是因为这个sdcard太新了，不兼容，然后发现这个帖子
https://forum.xda-developers.com/showthread.php?t=2544602
查了下mount2sd，居然没找到，但是找到了 App2SD Pro: All in One Tool [ROOT]
这个东西用了下居然可以mount上去，但是有个问题是从settings->storage看到ext4的那个分区状态是corrupted，
刚开始没在意，继续使用，发现app并没有默认安装到扩展的ext4分区，但是看到有auto link，并且进到app info，可以手动link data lib等到sdcard，
所以就尝试了下，貌似起作用，但是还是有问题，

其他待测工具
https://apkpure.com/force2sd-lite-root/mobi.pruss.force2sd_lite



https://www.partitionwizard.com/partitionmanager/increase-internal-storage-space-of-android.html

try ext2 ext3?



## XIAOMI

HM NOTE 1LTE - Xiaomi Redmi Note 4G (Single SIM) 
https://twrp.me/xiaomi/xiaomiredminote4gsinglesim.html

Hm note 1s cu(gucci)
Volume up + power => Recovery Mode
Volume down + power => fastboot mode , usb connect to pc,



[ROMs] Sailfish Os For Redmi 1s 
http://en.miui.com/thread-146982-1-1.html
https://www.youtube.com/watch?v=Np5woYmJN24

#issues: Signature Enforcement
http://en.miui.com/thread-237673-1-1.html



Offical
https://twrp.me/xiaomi/xiaomiredmi1s.html
Work
[TWRP] Redmi Note Prime (Gucci) TWRP English Recovery http://en.miui.com/forum.php?mod=viewthread&tid=212961&mobile=2

Not work
https://forum.xda-developers.com/redmi-1s/help/unlock-bootloader-flash-twrp-redmi-1s-t3772595
http://en.miui.com/thread-29291-1-1.html
https://www.jianshu.com/p/c348d419023b
Failed install with fastboot



https://github.com/CyanogenMod?utf8=%E2%9C%93&q=android_device_xiaomi&type=&language=

Can I update my hm note 1s cu(gucci) to other version??
https://forum.xda-developers.com/wiki/Xiaomi
https://github.com/MiCode/Xiaomi_Kernel_OpenSource/


使用adb查看小米设备的代号

http://cuminlo.github.io/2016/06/02/%E4%BD%BF%E7%94%A8adb%E6%9F%A5%E7%9C%8B%E5%B0%8F%E7%B1%B3%E8%AE%BE%E5%A4%87%E7%9A%84%E4%BB%A3%E5%8F%B7/

adb shell getprop | ack name



## more 


<disqus/>