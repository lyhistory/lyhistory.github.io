---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《cheatsheet》

## LINUX

常用路径： 
```
	/etc/**.conf
	/var/log/**
	/usr/bin/
```

Linux中查看日志文件的正确姿势，求你别tail走天下了
https://mp.weixin.qq.com/s/Q-NfY2sr4n2XiJwy8SsXDA

watch ss -tunpl4
ss -at 'sport = :9870'

常用命令：

ps -lef | grep "java"

netstat -antp | grep "8080"



vim:

```
turn off auto indent

:set paste
:set nopaste
.vimrc
set pastetoggle=<F3>

yy copy line
p
y2w copy 2 words

"ay
"ap
```



## WINDOWS

======个

常用路径：%APPDATA%

中文 chcp 65001

netstat -aon | findstr 'PORT'
tasklist | findstr 'PID'
taskkill /F /PID 'PID'

ping to start:
%SystemRoot%\system32\cmd.exe /C "path to jar"

Magnifier：Windows logo key‌  + Plus sign (+) 

Shortcut:
folder nav: alt+arrow
select/deselect: ctrl+space
right-click: shift+win10