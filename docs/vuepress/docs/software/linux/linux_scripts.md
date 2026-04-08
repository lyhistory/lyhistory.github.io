---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## Bash script VS Shell Script

Bash scripting is scripting specifically for Bash	

Shell scripting is scripting in any shell

## bash parameter expansion
${parameter//find/replace}

```
INSTALL_TARGET_SERVERs='IP1,IP2'
for i in ${INSTALL_TARGET_SERVERs//,/ }; do echo "$i"; done
for i in ${INSTALL_TARGET_SERVERs//,/$IFS}; do echo "$i"; done
```

## bash variables

$0、$1、$2、$#、$@、$*、$? 

```
./test.sh a b
$0	对应 ./test.sh 这个值。如果执行的是 ./work/test.sh， 则对应 ./work/test.sh 这个值
$1	a
$2	b
${10} 表示获取第 10 个参数的值	$10 相当于 ${1}0，也就是先获取 $1 的值，后面再跟上 0
$#	2	对应传入脚本的参数个数，统计的参数不包括 $0
$@	会获取到 "a" "b" ，也就是所有参数的列表，不包括 $0。
$*	a b 把所有参数合并成一个字符串	
$?	可以获取到执行 ./test.sh a b 命令后的返回值。在执行一个前台命令后，可以立即用 $? 获取到该命令的返回值：
	当执行系统自身的命令时，$? 对应这个命令的返回值
	当执行 shell 脚本时，$? 对应该脚本调用 exit 命令返回的值。如果没有主动调用 exit 命令，默认返回为 0。 
	当执行自定义的 bash 函数时，$? 对应该函数调用 return 命令返回的值。如果没有主动调用 return 命令，默认返回为 0。
```

The default value of IFS is a three-character string comprising a space, tab, and newline:
```
$ echo "$IFS" | cat -et
 ^I$
$

$ echo "$IFS" | cat -et
 ^I$
$
$ string="foo bar foo:bar"
$ for i in $string; do echo "[$i] extracted"; done
[foo] extracted
[bar] extracted
[foo:bar] extracted
$ IFS=":"  && echo "$IFS" | cat -et
:$
$ for i in $string; do echo "[$i] extracted"; done
[foo bar foo] extracted
[bar] extracted
$ unset IFS  && echo "$IFS" | cat -et
$
$ for i in $string; do echo "[$i] extracted"; done
[foo] extracted
[bar] extracted
[foo:bar] extracted


input.csv:
Record is : SNo,Quantity,Price,Value
Record is : 1,2,20,40
Record is : 2,5,10,50

#! /bin/bash
while IFS="," read -r rec1 rec2
do
  echo "Displaying Record-$rec1"
  echo "Price: $rec2"
done < <(cut -d "," -f1,3 input.csv | tail -n +2)

```

## bash's operators

https://tldp.org/LDP/abs/html/comparison-ops.html

```bsh
-n
   string is not null.

-z
  string is null, that is, has zero length
  
|| : 
https://superuser.com/questions/1022374/what-does-mean-in-the-context-of-a-shell-script
```

命令1 && 命令2→ 只有当命令1执行成功（退出状态码为0）时，才会执行命令2；如果命令1执行失败（退出状态码非0），则命令2不会执行。
```
# 每天8点执行：如果是假期，则运行test.sh
0 8 * * * /home/user/scripts/condition.sh && /home/user/scripts/test.sh

# condition.sh 片段
Holiday="202601011,20260401"
if [[ $Holiday = *$today* ]]; then
  echo "今天是假期"
  exit 0  # 条件成立，成功退出
else
  echo "今天不是假期"
  exit 1  # 条件不成立，失败退出
fi
```
## fork

例子1：Shell运行程序的底层逻辑（fork + exec组合）​

当你在终端输入 ./myapp时，Shell（比如bash）实际执行的代码逻辑如下（伪代码+C混合示意）：
```
// Shell的main函数中，处理用户输入"./myapp"的部分
void run_command(char* program_path) {
    pid_t pid;  // 用于存储fork返回的进程ID

    // 1. fork：创建子进程（分身术）
    pid = fork();  // 关键：fork会返回两次！

    if (pid == -1) {
        // fork失败（如内存不足）
        perror("fork failed");
        return;
    } else if (pid == 0) {
        // 2. 子进程逻辑：exec替换自身为新程序（夺舍术）
        // 参数说明：程序路径、命令行参数、环境变量
        execve(program_path, argv, envp);  
        // ❗️如果execve成功，子进程后续代码不会执行！
        // 如果失败（如文件不存在），才会走到下面
        perror("execve failed");
        exit(1);
    } else {
        // 3. 父进程（Shell）逻辑：等待子进程结束
        int status;
        waitpid(pid, &status, 0);  // 阻塞等待子进程退出
        printf("子进程（PID=%d）已结束，退出状态：%d\n", pid, status);
    }
}
```
pid = fork()
  父进程（Shell）分裂出子进程（几乎复制父进程的所有状态：内存、文件描述符、环境变量等）。
  关键：fork返回两次：
  - 父进程得到子进程PID（正整数，如1234）
  - 子进程得到0
  演员A（Shell）施展“影分身”，变出演员B（子进程）。
  演员A拿到“新演员B的编号”（子PID），演员B拿到“0”标记自己刚出生
if (pid == 0)
  子进程专属逻辑：调用execve加载新程序（如./myapp）。
  演员B（子进程）发现“自己是分身”（pid=0），于是撕掉旧的Shell剧本，换上./myapp的新剧本。
execve(...)
  覆盖当前进程内存：释放旧代码/数据段，加载新程序的ELF镜像（代码、全局变量等）。不创建新进程，仅替换“灵魂”。
  演员B的“肉体”（PID、打开的文件）不变，但“灵魂”（运行的程序）换成./myapp，从头执行其main函数。
waitpid(pid, ...)
  父进程（Shell）等待子进程结束，避免僵尸进程。
  演员A（Shell）站在后台，等演员B（子进程）演完新剧本后退场。 

例子2：验证exec后PID不变的实验代码​
这个C程序直接演示：exec不会创建新进程，PID保持不变（因为“夺舍”而非“新生”）。
```
#include <stdio.h>    // printf, perror
#include <unistd.h>   // getpid, execlp
#include <stdlib.h>   // exit

int main() {
    // 1. 打印exec前的PID（当前进程ID）
    printf("Before exec: PID = %d (PPID = %d)\n", getpid(), getppid());
    
    // 2. 执行exec：替换为系统命令"ls -l"（列出当前目录文件）
    // 参数说明：程序名("ls")、命令行参数("ls", "-l", NULL)、环境变量默认继承
    int ret = execlp("ls", "ls", "-l", NULL);
    
    // 3. ❗️如果exec成功，以下代码永远不执行！
    if (ret == -1) {
        perror("execlp failed");  // 仅当exec失败时执行（如"ls"命令不存在）
        exit(1);
    }
    
    // 4. 理论上不会走到这里，但写上证明"exec后不返回"
    printf("After exec: PID = %d (This line will NOT print!)\n", getpid());
    return 0;
}
```
编译与运行结果​

编译：gcc exec_demo.c -o exec_demo

运行：./exec_demo

预期输出（假设当前目录有file1.txt和dir1）：
```
Before exec: PID = 12345 (PPID = 6789)  # 12345是当前进程PID，6789是父进程（Shell）PID
total 8
-rw-r--r-- 1 user user  0 Apr  6 22:00 file1.txt
drwxr-xr-x 2 user user 40 Apr  6 22:00 dir1
```
关键观察：

第一行打印了Before exec的PID（如12345）。

之后execlp("ls", ...)执行，当前进程被替换为ls程序，输出了ls -l的结果。

After exec那行永远不打印！因为exec成功后，原程序的代码被完全覆盖，不会返回。

虽然输出的是ls的结果，但整个过程的PID始终是12345（可通过ps aux | grep 12345验证，进程名会从exec_demo变为ls，但PID不变）。

补充：简单版fork返回值示例（验证“返回两次”）​

如果想直观感受fork的“分裂魔法”，可运行这个更简单的代码：
```
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();  // 分裂进程

    if (pid < 0) {
        perror("fork failed");
        return 1;
    } else if (pid == 0) {
        // 子进程：fork返回0
        printf("👶 子进程：我的PID=%d，父进程PID=%d\n", getpid(), getppid());
    } else {
        // 父进程：fork返回子进程PID（>0）
        printf("👨 父进程：我的PID=%d，子进程PID=%d\n", getpid(), pid);
        wait(NULL);  // 等待子进程结束（避免僵尸进程）
    }
    return 0;
}
```
运行结果（示例）：

👨 父进程：我的PID=12345，子进程PID=12346
👶 子进程：我的PID=12346，父进程PID=12345

结论：fork后，父子进程同时执行后续代码，但通过pid值区分身份（父得子PID，子得0）。

## tips

```
#list folders only
ls -d */

L_FOLER_LIST=( $(ls -d */ 2>/dev/null) )
echo "$folder list count: ${#L_FOLER_LIST[@]}"

```

