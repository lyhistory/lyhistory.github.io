web容器：

tomcat

apache

iis

nginx

phpstudy



## Troubleshooting

### 301 auto redirect

事件：dev.site.com 总是自动跳转到www.site.com

初步整个服务器上grep -r -l "www.site.com" / 没有结果

1.通过nslookup查看了cname，确定没有cname重定向

2.查看了apache配置

```
vim /etc/httpd/conf/httpd.conf 
vim /etc/httpd/conf.d/demo_http.conf 
vim /etc/httpd/conf.d/demo_https.conf
```

确定没有重定向，唯一的重定向是http里面有到https的重定向，不过测试的时候完全可以直接访问
https://dev.site.com 来排除http重定向的问题，依然自动跳转

3.怀疑是代码问题，此站点使用的是WordPress代码，备份删除整站代码，创建 index.html: hello world，

发现访问https://dev.site.com/index.html不跳转，访问https://dev.site.com依然跳转，

刚开始我因此排除了是代码问题，其实301跳转有缓存，此时的跳转是

后来才发现network里面这个301 Moved Permanently 是from disk cache！！！

清理缓存后（或者浏览器开发者工具，直接勾选Disable cache更容易），再访问https://dev.site.com，发现response如下：

```

HTTP/1.1 301 Moved Permanently
Date: Thu, 28 Oct 2021 07:31:15 GMT
Server: Apache
X-Redirect-By: Polylang
Location: https://www.asiapacificfutures.com/
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Length: 0
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=UTF-8

```

注意到X-Redirect-By: Polylang，就是这个鬼，wordpress一个插件，最后查明原因是，dev的db配置成了生产的，所以估计这个polylang就使用了生产的域名！