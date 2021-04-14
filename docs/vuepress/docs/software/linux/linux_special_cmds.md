

## exec	

参考<network/network>

replace the shell by given command 执行完端口shell，有点类似scp

比如exec ls 执行完退出

也可以加非命令：

`exec 8<> /dev/tcp/www.baidu.com/80`

`find /home/ -type f -size +512M -exec ls -lh {} \;`



## jail

参考<buildingblock/haproxy>

chroot最佳实践 www.unixwiz.net/techtips/chroot-practices.html

How to break out of a chroot jail http://www.unixwiz.net/techtips/mirror/chroot-break.html

Setuid Demystified https://people.eecs.berkeley.edu/~daw/papers/setuid-usenix02.pdf



chroot

http://www.voidcn.com/article/p-upddvejj-bam.html

https://baike.baidu.com/item/chroot/3267609?fr=aladdin

https://blog.csdn.net/napolunyishi/article/details/21078799

setuid

http://www.selinuxplus.com/?tag=setuid

https://www.cs.utexas.edu/~shmat/courses/cs380s_fall09/09setuid.pdf

错误用法会导致attacker可以越权



## watch 

实时监控

```

watch ss -tunpl4
```

