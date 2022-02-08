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

## tips

```
#list folders only
ls -d */

L_FOLER_LIST=( $(ls -d */ 2>/dev/null) )
echo "$folder list count: ${#L_FOLER_LIST[@]}"

```

