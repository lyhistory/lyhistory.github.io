[sudo提权这些门道](https://mp.weixin.qq.com/s/jQlKl45iwVE-iM4SFVohsw)
`user2 ALL=(root) NOPASSWD: /bin/*`
看起来没问题，但实际上这给了用户执行/bin/目录下所有命令的权限，包括/bin/bash。用户可以通过sudo /bin/bash直接获得root shell，这就等于给了完整的root权限。

给用户配置了vim的sudo权限，想让他能编辑某些配置文件：
`user3 ALL=(root) NOPASSWD: /usr/bin/vim /etc/nginx/nginx.conf`
但是vim这种编辑器可以执行shell命令，用户在vim中输入:!bash就能获得root shell。类似的还有less、more等命令。

sudo虽然方便，但如果配置不当，反而会带来安全风险。首先，永远不要给用户这样的权限：
`user ALL=(ALL) NOPASSWD: ALL`
这等于直接给了root权限，sudo就失去了意义。其次，要特别小心那些可以执行其他程序的命令，比如：
• 编辑器（vim, nano, emacs）
• 分页器（less, more）
• 解释器（python, perl, ruby）
• 文件传输工具（scp, rsync）
这些程序往往都有执行shell命令的功能，给了sudo权限就等于给了root权限。

还有一个容易忽略的点是环境变量。默认情况下，sudo会重置大部分环境变量，但有些变量会保留。如果需要更严格的控制，可以这样配置：

```
Defaults env_reset
Defaults env_keep="LANG LC_* HOME"
```