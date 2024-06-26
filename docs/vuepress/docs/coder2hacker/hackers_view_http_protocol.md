---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

HTTP基础

状态码：信息收集（**扫描后台，扫描文件**）

浏览器信息等其他：**http注入（sql注入）**

请求方式：提交方式注入（sql注入）

cookie：**sql注入，绕过授权，xss跨站** 

Contern-Type    标明发送或者接收的实体的MIME类型。**文件上传漏洞**

Refener      一种请求头标域，标明产生请求的初始资源。对于HTML表单，它包含此表单的Web页面的地址。**Csrf xss 授权**



 RFC2616  HTTP 1.1 标准



## 发送HTTP请求

通过连接，客户端写一个ASCII文本请求行，后跟0或多个HTTP头标，一个空行和实现请求的任意数据。一个请求由四个部分组成：请求行、请求头标、空行和请求数据

1.请求行：请求行由三个标记组成：请求方法、请求URI和HTTP版本，它们用空格分隔。

例如：GET /index.html HTTP/1.1

HTTP规范定义了8种可能的请求方法：

GET            检索URI中标识资源的一个简单请求
HEAD            与GET方法相同，服务器只返回状态行和头标，并不返回请求文档
POST            服务器接受被写入客户端输出流中的数据的请求
PUT            服务器保存请求数据作为指定URI新内容的请求
DELETE            服务器删除URI中命名的资源的请求
OPTIONS        关于服务器支持的请求方法信息的请求
TRACE            Web服务器反馈Http请求和其头标的请求
CONNECT        已文档化但当前未实现的一个方法，预留做隧道处理

2.请求头标：由关键字/值对组成，每行一对，关键字和值用冒号（:）分隔。
请求头标通知服务器有关于客户端的功能和标识，典型的请求头标有：
User-Agent        客户端厂家和版本
Accept            客户端可识别的内容类型列表
Content-Length    附加到请求的数据字节数
3.空行：最后一个请求头标之后是一个空行，发送回车符和退行，通知服务器以下不再有头标。
4.请求数据：使用POST传送数据，最常使用的是Content-Type和Content-Length头标。



## 服务端接受请求并返回HTTP响应

Web服务器解析请求，定位指定资源。服务器将资源副本写至套接字，在此处由客户端读取。
一个响应由四个部分组成；状态行、响应头标、空行、响应数据
1.状态行：状态行由三个标记组成：HTTP版本、响应代码和响应描述。
HTTP版本：向客户端指明其可理解的最高版本。
响应代码：3位的数字代码，指出请求的成功或失败，如果失败则指出原因。
响应描述：为响应代码的可读性解释。
例如：HTTP/1.1 200 OK
HTTP响应码：
1xx：信息，请求收到，继续处理
2xx：成功，行为被成功地接受、理解和采纳
3xx：重定向，为了完成请求，必须进一步执行的动作
4xx：客户端错误：
2.响应头标：像请求头标一样，它们指出服务器的功能，标识出响应数据的细节。
3.空行：最后一个响应头标之后是一个空行，发送回车符和退行，表明服务器以下不再有头标。
4.响应数据：HTML文档和图像等，也就是HTML本身。

200 存在 文件
403 存在 文件夹
404 不存在 文件及文件夹
500 错误 服务器配置错误



## 服务器关闭连接，浏览器解析响应

1.浏览器首先解析状态行，查看表明请求是否成功的状态代码。
2.然后解析每一个响应头标，头标告知以下为若干字节的HTML。
3.读取响应数据HTML，根据HTML的语法和语义对其进行格式化，并在浏览器窗口中显示它。
4.一个HTML文档可能包含其它需要被载入的资源引用，浏览器识别这些引用，对其它的资源再进行额外的请求，此过程循环多次。



## 无状态连接

HTTP模型是无状态的，表明在处理一个请求时，Web服务器并不记住来自同一客户端的请求。

## headers

### Client-Side Cache Control 

Use cache control in meta tags and in the server’s response header: 
Cache-Control: no-cache, no-store 

https://codeburst.io/demystifying-http-caching-7457c1e4eded

```
[~/.cache/mozilla/firefox] # grep -rail 'admin'
	output1
	output2
	....
	outputN
[~/.cache/mozilla/firefox] # strings outputN | grep "admin"
[~/.cache/mozilla/firefox] # head -n 10 outputN
[~/.cache/mozilla/firefox] #
```

