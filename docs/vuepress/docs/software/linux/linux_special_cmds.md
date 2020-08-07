

## exec	

参考<network/network>

replace the shell by given command 执行完端口shell，有点类似scp

比如exec ls 执行完退出

也可以加非命令：

`exec 8<> /dev/tcp/www.baidu.com/80`

`find /home/ -type f -size +512M -exec ls -lh {} \;`



## jail

参考<buildingblock/haproxy>

chroot

https://baike.baidu.com/item/chroot/3267609?fr=aladdin

https://blog.csdn.net/napolunyishi/article/details/21078799

setuid

https://www.cs.utexas.edu/~shmat/courses/cs380s_fall09/09setuid.pdf

错误用法会导致attacker可以越权



## watch 

实时监控