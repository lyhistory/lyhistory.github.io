rsync是一个可以增量备份的工具，有时候又称为文件或系统镜像工具，常常跟虚拟IP一起，可以搞一个假的HA高可用方案，比如gitlab server就常常用rsync搞成所谓的高可用，其实是冷备

Rsync is a wonderful little utility that's amazingly easy to set up on your machines. Rather than have a scripted FTP session, or some other form of file transfer script -- rsync copies only the diffs of files that have actually changed, compressed and through ssh if you want to for security.  That's a mouthful -- but what it means is:

+ Diffs - Only actual changed pieces of files are transferred, rather than the whole file.  This makes updates faster, especially over slower links like modems.  FTP would transfer the  entire file, even if only one byte changed.   
+ Compression - The tiny pieces of diffs are then compressed on the fly, further saving  you file transfer time and reducing the load on the network.   
+ Secure Shell - The security concious of you out there would like this, and you should all be  using it.  The stream from rsync is passed through the ssh protocol to encrypt your session  instead of rsh, which is also an option (and required if you don't use ssh - enable it in your  /etc/inet.d and restart your inet daemon if you disabled it for security).

Rsync is rather versatile as a backup/mirroring tool, offering many features above and beyond the above.  I personally use it to synchronize Website trees from staging to production servers and to backup key areas of the filesystems both automatically through cron and by a CGI script.  Here are some other key features of rsync:

+ Support for copying links, devices, owners, groups and permissions   
+ Exclude and exclude-from options similar to GNU tar   
+ A CVS exclude mode for ignoring the same files that CVS would ignore   
+ Does not require root privileges   
+ Pipelining of file transfers to minimize latency costs   
+ Support for anonymous or authenticated rsync servers (ideal for mirroring)



## 原理

https://everythinglinux.org/rsync/index.html

You must set up one machine or another of a pair to be an "rsync server" by running rsync in a daemon mode ("*rsync --daemon*" at the commandline) and setting up a short, easy configuration file (*/etc/rsyncd.conf*).  Below I'll detail a sample configuration file.  The options are readily understood, few in number -- yet quite powerful.

Any number of machines with rsync installed may then synchronize to and/or from the machine running the rsync daemon.  You can use this to make backups, mirror filesystems, distribute files or any number of similar operations.  Through the use of the "rsync algorithm" which transfers only the diffs between files (similar to a patch file) and then compressing them -- you are left with a very efficient system.

For those of you new to secure shell ("ssh" for short), you should be using it!  There's a very useful and quite thourough [Getting Started with SSH](http://www.tac.nyc.ny.us/~kim/ssh/) document available.  You may also want to visit the [Secure Shell Web Site](http://www.ssh.org).  Or, just hit the [Master FTP Site](ftp://ftp.cs.hut.fi/pub/ssh/) in Finland and snag it for yourself. It provides a secure, encrypted "pipe" for your network traffic.  You should be using it instead of telnet, *rsh* or *rlogin* and use the replacement "*scp*" command instead of "*rcp*."



You must set up a configuration file on the machine meant to be the server and run the rsync binary in daemon mode.  Even your rsync client machines can run rsync in daemon mode for two-way transfers.  You can do this automatically for each connection via the inet daemon or at the commandline in standalone mode to leave it running in the background for often repeated rsyncs.  I personally use it in standalone mode, like Apache.  I have a crontab entry that synchronizes a Web site directory hourly.  Plus there is a CGI script that folks fire off frequently during the day for immediate updating of content.  This is a lot of rsync calls!  If you start off the rsync daemon through your inet daemon, then you incur much more overhead with each rsync call.  You basically restart the rsync daemon for every connection your server machine gets!  It's the same reasoning as starting Apache in standalone mode rather than through the inet daemon.  It's quicker and more efficient to start rsync in standalone mode if you anticipate a lot of rsync traffic.  Otherwise, for the occasional transfer follow the procedure to fire off rsync via the inet daemon.  This way the rsync daemon, as small as it is, doesn't sit in memory if you only use it once a day or whatever.  Your call.

Below is a sample rsync configuration file.  It is placed in your /etc directory as *rsyncd.conf*.

```
motd file = /etc/rsyncd.motd
log file = /var/log/rsyncd.log
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock

[simple_path_name]
   path = /rsync_files_here
   comment = My Very Own Rsync Server
   uid = nobody
   gid = nobody
   read only = no
   list = yes
   auth users = username
   secrets file = /etc/rsyncd.scrt
   
Various options that you would modify right from the start are the areas in italics in the sample above. I'll start at the top, line by line, and go through what you should pay attention to. What the sample above does is setup a single "path" for rsync transfers to that machine. 

 Starting at the top are four lines specifying files and their paths for rsync running in daemon mode. The first is a "message of the day" (motd) file like you would use for an FTP server. This file's contents get displayed when clients connect to this machine. Use it as a welcome, warning or simply identification. The next line specifies a log file to send diagnostic and norml run-time messages to. The PID file contains the "process ID" (PID) number of the running rsync daemon. A lock file is used to ensure that things run smoothly. These options are global to the rsync daemon.

The next block of lines is specific to a "path" that rsync uses. The options contained therein have effect only within the block (they're local, not global options). Start with the "path" name. It's somewhat confusing that rsync uses the term "path" -- as it's not necessarily a full pathname. It serves as an "rsync area nickname" of sorts. It's a short, easy to remember (and type!) name that you assign to a try filesystem path with all the options you specify. Here are the things you need to set up first and foremost: 

    path - this is the actual filesystem path to where the files are rsync'ed from and/or to.
    comment - a short, descriptive explanation of what and where the path points to for listings.
    auth users - you really should put this in to restrict access to only a pre-defined user that you specify in the following secrets file - does not have to be a valid system user.
    secrets file - the file containing plaintext key/value pairs of usernames and passwords. 

One thing you should seriously consider is the "hosts allow" and "hosts deny" options for your path. Enter the IPs or hostnames that you wish to specifically allow or deny! If you don't do this, or at least use the "auth users" option, then basically that area of your filesystem is wide open to the world by anyone using rsync! Something I seriously think you should avoid... 

Check the rsyncd.conf man page with "man rsyncd.conf" and read it very carefully where security options are concerned. You don't want just anyone to come in and rsync up an empty directory with the "--delete" option, now do you?

The other options are all explained in the man page for rsyncd.conf. Basically, the above options specify that the files are chmod'ed to uid/gid, the filesystem path is read/write and that the rsync path shows up in rsync listings. The rsync secrets file I keep in /etc/ along with the configuration and motd files, and I prefix them with "rsyncd." to keep them together. 
```



Now on to actually using, or initiating an rsync transfer with rsync itself.  It's the same binary as the daemon, just without the "--daemon" flag.  It's simplicity is a virtue.  I'll start with a commandline that I use in a script to synchronize a Web tree below.

```
rsync --verbose  --progress --stats --compress --rsh=/usr/local/bin/ssh \
      --recursive --times --perms --links --delete \
      --exclude "*bak" --exclude "*~" \
      /www/* webserver:simple_path_name
      
 Let's go through it one line at a time. The first line calls rsync itself and specifies the options "verbose," progress" and "stats" so that you can see what's going on this first time around. The "compress" and "rsh" options specify that you want your stream compressed and to send it through ssh (remember from above?) for security's sake.

The next line specifies how rsync itself operates on your files. You're telling rsync here to go through your source pathname recursively with "recursive" and to preserve the file timestamps and permissions with "times" and "perms." Copy symbolic links with "links" and delete things from the remote rsync server that are also deleted locally with "delete."

Now we have a line where there's quite a bit of power and flexibility. You can specify GNU tar-like include and exclude patterns here. In this example, I'm telling rsync to ignore some backup files that are common in this Web tree ("*.bak" and "*~" files). You can put whatever you want to match here, suited to your specific needs. You can leave this line out and rsync will copy all your files as they are locally to the remote machine. Depends on what you want.

Finally, the line that specifies the source pathname, the remote rsync machine and rsync "path." The first part "/www/*" specifies where on my local filesytem I want rsync to grab the files from for transmission to the remote rsync server. The next word, "webserver" should be the DNS name or IP address of your rsync server. It can be "w.x.y.z" or "rsync.mydomain.com" or even just "webserver" if you have a nickname defined in your /etc/hosts file, as I do here. The single colon specifies that you want the whole mess sent through your ssh tunnel, as opposed to the regular rsh tunnel. This is an important point to pay attention to! If you use two colons, then despite the specification of ssh on the commandline previously, you'll still go through rsh. Ooops. The last "www" in that line is the rsync "path" that you set up on the server as in the sample above.

Yes, that's it! If you run the above command on your local rsync client, then you will transfer the entire "/www/*" tree to the remote "webserver" machine except backup files, preserving file timestamps and permissions -- compressed and secure -- with visual feedback on what's happening.

Note that in the above example, I used GNU style long options so that you can see what the commandline is all about. You can also use abbreviations, single letters -- to do the same thing. Try running rsync with the "--help" option alone and you can see what syntax and options are available. 
```



## 实际用法

```
NAME
       rsync - a fast, versatile, remote (and local) file-copying tool

SYNOPSIS
       Local:  rsync [OPTION...] SRC... [DEST]

       Access via remote shell:
         Pull: rsync [OPTION...] [USER@]HOST:SRC... [DEST]
         Push: rsync [OPTION...] SRC... [USER@]HOST:DEST

       Access via rsync daemon:
         Pull: rsync [OPTION...] [USER@]HOST::SRC... [DEST]
               rsync [OPTION...] rsync://[USER@]HOST[:PORT]/SRC... [DEST]
         Push: rsync [OPTION...] SRC... [USER@]HOST::DEST
               rsync [OPTION...] SRC... rsync://[USER@]HOST[:PORT]/DEST

       Usages with just one SRC arg and no DEST arg will list the source files instead of copying.
```



不管是client还是server都要安装

```
# yum install rsync
从上面的man可以看到：
如果是local没什么好讲的，
如果是Access via remote shell，就是在src机器上执行rsync命令push或者dest机器上执行rsync命令pull，所以不存在服务端的概念；
如果是Access via rsync daemon就需要引入服务端守护进程的概念，然后client端就可以从服务端pull或者push到服务端；

# rpm -qc rsync
/etc/rsyncd.conf
/etc/sysconfig/rsyncd


[root@backup ~]# vi /etc/rsyncd.conf         先把原有的内容清除，这里要用vi进行编辑，不能使用vim

uid = rsync
gid = rsync
port = 873
fake super = yes
use chroot = no
max connections = 200
timeout = 600
ignore errors
read only = false
list = false
auth users = rsync_backup
secrets file = /etc/rsync.password
log file = /var/log/rsyncd.log

#####################################

[backup]
comment = welcome to  backup!
path = /backup


useradd -M -s /sbin/nologin rsync
mkdir /backup
chown -R rsync.rsync /backup/   
echo "rsync_backup:1" >/etc/rsync.password    密码设置为1
chmod 600 /etc/rsync.password
systemctl start rsyncd
systemctl enable rsyncd

客户端推送到服务端
rsync -avz /anything rsync_backup@172.16.1.41::backup

客户端从服务端拉取
rsync -avz rsync_backup@172.16.1.41::backup /opt
免密模式：
echo "1" >/etc/rsync.password  
chmod 600 /etc/rsync.password
rsync -avz rsync_backup@172.16.1.41::backup /opt --password-file=/etc/rsync.password
或者
export RSYNC_PASSWORD=1     设置RSYNC_PASSWORD环境变量=1  这里的1是密码，密码要和服务端的一致

https://www.cnblogs.com/zeq912/p/9593931.html

定时任务rsync.sh：
pull sample: 
rsync -avz rsync_backup@remote_server::backup /opt --password-file=/etc/rsync.password  >/dev/null 2>&1
push sample:
rsync -vrtL --progress /opt/* rsync_backup@remote_server::backup --password-file=/etc/rsync.password 
-v参数表示显示输出结果，r表示保持属性，t表示保持时间，L表示软link视作普通文件。


chmod 755  rsync.sh

echo "00 3 * * * root /home/rsync.sh" >> /etc/crontab #则每天凌晨3点运行同步。
or
crontab -e
		* * * * * /home/rsync.sh                 每分钟执行一次同步脚本；
        0 * * * * /home/rsync.sh                 每小时执行一次同步脚本；
        0 0 * * * /home/rsync.sh                 每天零点执行一次同步脚本； 
        0 9,18 * * * /home/rsync.sh            每天的9AM和6PM执行一次同步脚本； 
        
https://www.cnblogs.com/xiaozi/p/11018496.html
https://www.oschina.net/question/12_7446

安全性测试/匿名访问

列举整个同步目录或指定目录：
rsync 10.0.0.12::
rsync 10.0.0.12::www /

下载文件或目录到本地：
rsync – avz 10.0.0.12::WWW/  /var/tmp
rsync – avz 10.0.0.12::www/  /var/tmp

上传本地文件到服务端：
rsync -avz webshell 10.0.0.12::WWW /
```

https://www.cnblogs.com/f-ck-need-u/p/7220009.html



## 同类技术

drbd

https://www.tecmint.com/setup-drbd-storage-replication-on-centos-7/

https://cloud.tencent.com/developer/article/1523198