整理 google doc：Basics: Linux Basic

## 重定向

![](C:/docs/docs_image/software/linux/linux_redirect01.png)

\< file 比如标准输出重定向 java -jar **.jar > log.txt

\<<< String 比如脚本中读取第一个参数并取分隔'\'的第一个值 ```IFS='/' read -ra target_arr <<< "$1"```

2>&1 标准错误输出重定向到标准输出
ps -aef | grep -v grep | grep "java -server -jar" | awk '{print $2}'
$(2)获取管道前面等输出结果第二列,此时可以用$2替代；
$｛2｝还可以表示获取脚本输入参数等第二个，此时也可以用$2替代，$#是输入参数个数；

${}主要是作为positional parameter，

```
$ animal=cat
$ echo $animals
                                # No such variable as “animals”.
$ echo ${animal}s
cats
```

而$()主要则是command substitution，比如
rm $(where connect.sh)


命令默认都接受参数 -argument，有些命令还接受标准输入（可以使用管道符|和重定向符< <<<）,
简单判别方式：命令是否可以阻塞终端（如cat不加任何命令会阻塞终端）
如 echo"trade:trade"|chpasswd 

一个命令行终端是一个shell进程，在这个终端里执行的程序都是作为该shell进程的子进程。
如果子进程命令阻塞终端shell进程，shell进程就会等待子进程退出才能接收其他命令；
如果关掉了shell终端，，依附的所有子进程都会退出；
加上&号可以避免这种情况，原理是将命令挂在systemd系统守护进程名下，其他办法还有nohup或者开tmux或者screen，并且加&可以让shell进程不再阻塞，从而继续响应新命令；

set -x 可以显示shell在执行什么程序

echo $(cmd) 和 echo "$(cmd)"，结果差不多，但是仍然有区别。注意观察，双引号转义完成的结果会自动增加单引号，而前者不会，
如果 $ 读取出的参数字符串包含空格，应该用双引号括起来，否则就会出错。

当使用 sudo 时，系统会使用 /etc/sudoers 这个文件中规定的该用户的权限和环境变量

特殊命令：
watch 
exec

{}https://askubuntu.com/questions/339015/what-does-mean-in-the-find-command

https://labuladong.gitbook.io/algo/di-wu-zhang-ji-suan-ji-ji-shu/linux-jin-cheng
https://labuladong.gitbook.io/algo/di-wu-zhang-ji-suan-ji-ji-shu/linuxshell

difference between ${} and $() in shell script https://superuser.com/questions/935374/difference-between-and-in-shell-script



cat /etc/os-release

$ tmux -f ~/.tmux.conf
$ echo $TMUX
/tmp/tmux-1001/default,22984,0

grep -H -r "syscript" ~ | cut -d: -f1 | sort -u

grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u

find / -type f -name "mysql-connector-java-5.1.24.jar" -print

find / -type f -name "Locations.xml" -print

grep -H -r "/apex/apps/clearing/lib" ~ | cut -d: -f1 | sort -u