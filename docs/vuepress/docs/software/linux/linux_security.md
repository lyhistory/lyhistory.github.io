user file-creation mode mask (*umask*)

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-file-permissions_configuring-basic-system-settings#user-file-creation-mode-mask_assembly_managing-file-permissions

## firewall

define your own service name in /usr/lib/firewalld/services/
```
firewall-cmd --get-services
firewall-cmd --permanent --zone=public --add-service=postgresql
firewall-cmd --reload
```
## selinux
chcon 会被重新标记

使用semanage
getenforce 

## /etc/cron.allow 


## example

### troubleshoot passwordless ssh login
Machine A need to access B using pub key instead of password

1. Setup

on A:
ssh-keygen -t rsa 重命名生成id_rsa_B/id_rsa_B.pub
ssh-copy-id -i .ssh/id_rsa_B.pub root@B
ssh root@B still prompt password require, 仍然弹出密码要求

2. Troubleshoot: 
+ selinux 
+ make sure correct permission for .ssh(700 at least) and .ssh/authorized_keys (400 at least)
Both the host and the client should have the following permissions and owners:

~/.ssh permissions should be 700
~/.ssh should be owned by your account
~/.ssh/authorized_keys permissions should be 600
~/.ssh/authorized_keys should be owned by your account
Client environments should additionally have the following permissions and owners:

~/.ssh/config permissions should be 600
~/.ssh/id_* permissions should be 600
+ remote server firewall
+ /etc/ssh/sshd_config
    PubkeyAuthentication yes
    RSAAuthentication yes

[root@os-node3 apps]# tail -f /var/log/secure
Apr 26 13:58:29 os-node3 su: pam_unix(su-l:session): session opened for user fundingrate by root(uid=0)
Apr 26 13:58:59 os-node3 sshd[31048]: reprocess config line 44: Deprecated option RSAAuthentication
systemctl status sshd 也可以看到这个日志

有意思，之前我手动在 开启了 
RSAAuthentication yes
日志的意思是，rsa的选项已经是废弃的了，难道ssh升级了？
果然查了下，最新的ssh Protocol=2，之前的1可能不支持了，测试：
on A:
ssh -1 root@B
Protocol major versions differ: 1 vs. 2
说明B不支持 ssh Protocol 1了，only Protocol 2 is supported

不过最后发现原因竟然是因为我创建秘钥对的时候重命名了id_rsa/id_rsa.pub 为 id_rsa_B/id_rsa_B.pub
ssh默认只会找id_rsa（之前已经生成了一对id_rsa/id_rsa.pub），所以跟copy到B上的id_rsa_B.pub对不上，
需要指定
ssh -i id_rsa_B root@B 即可！
查看版本号：ssh -v localhost
