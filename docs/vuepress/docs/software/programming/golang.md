## install

```
https://golang.org/doc/install

tar -C /usr/local -xzf go1.15.4.linux-amd64.tar.gz

$HOME/.profile or /etc/profile (for a system-wide installation)
export PATH=$PATH:/usr/local/go/bin

go version
/usr/local/go/bin/go

但是我可能对 system-wide installation 有误解，因为使用其他用户比如root之后无法找到 go,
发现 https://askubuntu.com/questions/118263/some-programs-not-found-when-used-with-sudo
不能直接vim /etc/sudoers,执行 sudo visudo
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/go/bin"

https://www.cnblogs.com/chr-wonder/p/8464224.html
当我们使用了自己 GOPATH 中的包时，sudo go run xxxx 并不会在我们环境变量指定的目录去查找包。
我们需要设置 /etc/sudoers 文件中的 Defaults env_keep 项。向其中加入我们的 GOPATH 环境变量:
Defaults    env_keep += "GOPATH"
```



## grama

refer《an introduction to programming in go》

Page25
Type 
byte uint8 rune int32
Float point number computing are inexact why?
Boolean 1 bit integer

Dot single period
Quote double qutation mark
Back tick
Space : white space ,tab, newline

Character represent by byte

Parentheses bracket
Map assiocate array

Function procedures subroutine

https://golang.org/dl/
https://github.com/golang/go/wiki/SettingGOPATH
make build.

go get vs git clone


