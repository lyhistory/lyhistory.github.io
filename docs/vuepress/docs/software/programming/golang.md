## Get Start

### install

https://golang.org/doc/install
https://go.dev/doc/install
```
1. Extract the archive you downloaded into /usr/local, creating a Go tree in /usr/local/go.

$ rm -rf /usr/local/go && tar -C /usr/local -xzf go1.17.8.linux-amd64.tar.gz

2.Add /usr/local/go/bin to the PATH environment variable

$HOME/.profile or /etc/profile (for a system-wide installation)
export PATH=$PATH:/usr/local/go/bin

$ source $HOME/.profile.

$ go version
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

### PATH

GOPATH
```
$HOME/go on Unix-like systems
%USERPROFILE%\go on Windows
```
GOPATH/bin
GOPATH/pkg


GOROOT


### Debug with vscode

+ Delve
    ```
    go install github.com/go-delve/delve/cmd/dlv@latest
    ```

    vscode go debug Delve DAP server (PID: 5884) is not responding

    ctrl+shift+P open settings.json，最后添加
    ```
    "go.delveConfig": {
            "debugAdapter": "legacy",
        }
    ``
    https://github.com/golang/vscode-go/blob/master/docs/debugging.md

    字符限制
    launch.json
    ```
    "dlvLoadConfig": {
                "followPointers": true,
                "maxVariableRecurse": 1,
                "maxStringLen": 400,
                "maxArrayValues": 64,
                "maxStructFields": -1
            }
    ```
+ GDB
+ PrintIn

## Grama

refer:
https://go.dev/doc/effective_go
《an introduction to programming in go》

### The blank identifier
https://stackoverflow.com/questions/27764421/what-is-underscore-comma-in-a-go-declaration

### todo

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


<disqus/>