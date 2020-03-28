---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 20200325 github https证书问题

关键词：https劫持、ssl劫持、dns劫持

[Github pages 的 HTTPS 是不是出问题了？](https://www.v2ex.com/t/656367?p=1)
[Cloudflare 的一个节点疑似也被中间人](https://www.v2ex.com/t/656505)
[京东 HTTPS 也被劫持了？](https://www.v2ex.com/t/656444)

![](/docs/docs_image/software/network/network2github01.png)

因为人在海外，不方便测试，就总结了网友的测试分析结果如下

国内访问提示证书错误，SSL劫持？

[这是网友导出的证书](https://gist.github.com/chenshaoju/52bb7a12572a752433bd51a4dce79d94)

![](/docs/docs_image/software/network/network2github02.png)

 
目前许多翻墙软件是基于（或伪装成）TLS(HTTPS)的。

> 以v2ray(N)为例，若部署服务端的时候没有使用有效的证书，客户端启用了allowInsecure的情况下（默认），若被中间人攻击了客户端可能也无法进行警告。

我的评论：未必吧，不可以配置客户端信任自己的证书吗，这样不就可以挡住其他的非法证书了么（当然了这个需要再研究下）

> 不过正确配置了加密方式的情况下，数据还是安全的，只是攻击者可能会知道你在用v2ray。 

我的评论：刚开始看到这句话觉着有问题，如果选择相信中间人的证书，中间人就完全可以解密流量，不过细想下，v2ray是伪装成https流量，其本身也是有加密的，
所以应该指的是解密开的流量本身仍然是v2ray加密内容，直到走到我们配置的vpn服务器端，然后vpn服务器端才能解密开流量，除非中间人在vpn服务器和我们的目标之间劫持；

![](/docs/docs_image/software/network/network2github03.png)

这是网友从国内测试正常恢复之后的tcproute：

![](/docs/docs_image/software/network/network2github04.png)

我对图上的cert有点好奇，为啥到6月就过期，所以看看我自己的

![](/docs/docs_image/software/network/network2github05.png)

可以看到因为我最近前两天刚换成了cloudflare的dns解析，所以显示的cert是cloudflare颁发的，不过我有点好奇的是，我以为只是dns解析交给cloudflare，
但是https cert是github page自己的呢，这个不是很熟悉，以后再研究下

然后我对网友的tcproute结果不太明白，所以自己验证了下

tcproute -p 443 github.io

![](/docs/docs_image/software/network/network2github06.png)

果然github.io是同一个ip网段，不过我有点不明白的是，中间人如果劫持了，一样可以放行流量到达github page，tcp route里面从哪看出来这里没有中间人呢？
还是说如果有中间人tcproute的内容会不同，我看了下网友提供的他认为是劫持的tcproute截图，不同点是remote ip也就是终点是不同的ip段，我才想起来，
我们这里是指定了443端口的请求，中间人劫持的正是443，可能tcproute用的这个协议本身（是IMCP?)并不存在流量放行的问题，谁劫持的就到他那里，
如果是用浏览器打开目标网站，劫持者的cert是非法的，浏览器会提示危险，但是如果我们手动或者电脑设置自动放行，会拿到劫持者的cert，
但是http流量到中间人那里肯定是会放行通过的，毕竟中间人的目的不是阻塞流量，而是在中间监听流量，所以我猜应该是因为如此，所以从tcproute 443的终点就能看出来是否被劫持，
终点也自然是劫持者的位置；

## more

参考：

https://twitter.com/FledgeXu/status/1243073941138096129

https://twitter.com/chenshaoju/status/1243078679380426753