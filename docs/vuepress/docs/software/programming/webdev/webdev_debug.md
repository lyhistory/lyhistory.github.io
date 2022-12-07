## Basics

### TTFB
time to first byte
https://web.dev/ttfb/
[](./network_request_phase.png)

## web容器：

tomcat

apache

iis

nginx

phpstudy

## 工具

### html

inspect on disappering element，有些元素是鼠标mouse hover才显示，所以直接用开发者工具inspect是不行的，
需要在相关的parent上面右键设置一个Break on->subtree modifications

### network

network-> right click on requests -> Copy -> Copy as Curl(bash)

chrome:
chrome://net-export/
https://netlog-viewer.appspot.com/#sockets
https://chromium.googlesource.com/chromium/src/+/HEAD/net/docs/crash-course-in-net-internals.md
https://zhuanlan.zhihu.com/p/266622278

firefox:
web developer tool->performance->recording
https://firefox-source-docs.mozilla.org/networking/http/logging.html
about:networking#logging

When Mozilla’s built-in logging capabilities aren’t good enough, and you need a full-fledged packet tracing tool, two free products are [Wireshark](https://www.wireshark.org/) and [ngrep](https://github.com/jpr5/ngrep/)



## Troubleshooting

### Performance issue
#### website calling another api server
表现为：网站页面显示从api获取的数据很慢，内网访问ttfb半分钟，外网访问直接timeout

分别从网站服务器和api服务器本身测试，不是网站服务器和api服务器之间的网络问题，确实是api服务器的问题：
time_starttransfer - time_appconnect is practically the same as Time To First Byte (TTFB) 
```
vim curl-format.txt
{\n
"time_redirect": %{time_redirect},\n
"time_namelookup": %{time_namelookup},\n
"time_connect": %{time_connect},\n
"time_appconnect": %{time_appconnect},\n
"time_pretransfer": %{time_pretransfer},\n
"time_starttransfer": %{time_starttransfer},\n
"time_total": %{time_total},\n
"size_request": %{size_request},\n
"size_upload": %{size_upload},\n
"size_download": %{size_download},\n
"size_header": %{size_header}\n
}


curl -v -w "@curl-format.txt" -H "Connection: close" http://X.X.X.X/api/call
```

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
Location: https://www.xxx.com/
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Length: 0
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=UTF-8

```

注意到X-Redirect-By: Polylang，就是这个鬼，wordpress一个插件，最后查明原因是，dev的db配置成了生产的，所以估计这个polylang就使用了生产的域名！

### Auto follow redirection (3xx)

起因：

一个java程序使用spring web client RestTemplate 访问华为云上的elb url:
http://api.lyhistory.com/api/v1/testit/
，华为云上配置elb的策略是自动转到https即
https://api.lyhistory.com/api/v1/testit/

程序报错：
```
2022-10-14 18:45:58.891 ERROR 1540GG [scheduling-1] c.q.c.m.s.i.xxx : Failed to query xxx. Error:Could not extract response: no suitable HttpMessageConverter found for response type [class com.lyhistory.testmodel] and content type [text/html]

```


#### 调查：

```

正常应该是返回json，而不是text/html

curl一下试试

curl --header "Authorization: XXXXXX" http://api.lyhistory.com/api/v1/testit/

返回  301 Moved Permanently

加上auto follow redirection：
curl -L --header "Authorization: XXXXXX" http://api.lyhistory.com/api/v1/testit/
则返回正常！


使用hackbar测试华为云看看chrome network的请求长啥样

get

1st request:
>
GET /api/v1/testit/ HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36

<
HTTP/1.1 307 Internal Redirect
Location: https://api.lyhistory.com/api/v1/testit/
Cross-Origin-Resource-Policy: Cross-Origin
Non-Authoritative-Reason: HSTS


2nd request:
>
GET /api/v1/testit/ HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
Host: api.lyhistory.com
If-None-Match: W/"1ff-0SzbxxK5OAa9GvtZs8XPKShpiHo"
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36
authorization: XXXXXX
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"

<
HTTP/1.1 200 OK
Date: Fri, 14 Oct 2022 10:37:49 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 511
Connection: keep-alive
Access-Control-Allow-Origin: *
X-RateLimit-Limit: 360
X-RateLimit-Remaining: 359
X-RateLimit-Reset: 1665759419
Content-Security-Policy: default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
X-DNS-Prefetch-Control: off
Expect-CT: max-age=0
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
X-XSS-Protection: 0
ETag: W/"1ff-gghi4jHEutMe/7viD10y38cnRdU"
Server: elb

```

学习：HSTS 307 internal redirect:
The HTTP 307 Internal Redirect response is a variant of the 307 Temporary Redirect status code. It’s not defined by the HTTP standard and is just a local browser implementation.
302 to 307:https://rtfm.co.ua/en/http-redirects-post-and-get-requests-and-lost-data/
https://www.nginx.com/blog/http-strict-transport-security-hsts-and-nginx/
https://kinsta.com/knowledgebase/307-redirect/#understanding-http-307-internal-redirect-for-httpsonly-sites
Spring的RestTemplate自动重定向，如何拿到重定向后的地址？ https://blog.csdn.net/m0_37657841/article/details/107391699

看起来华为云elb http to https跳转没有问题，只要正常follow redirect就可以，看来我们的java程序RestTemplate应该是没有自动follow redirect所以得到了第一次返回的redirection的html响应结果，

#### 验证：
```
刚开始使用
java -Djavax.net.debug=all jarfile 
但是奇怪并没有额外输出http connection的信息？

只好用strace抓一下
strace -o strace.out -s 4096 -e trace=network -f -p <PID>


11937 accept(30,  <unfinished ...>
11938 socket(AF_INET, SOCK_STREAM, IPPROTO_IP) = 38
11938 connect(38, {sa_family=AF_INET, sin_port=htons(80), sin_addr=inet_addr("x.x.x.x")}, 16) = 0
11938 getsockname(38, {sa_family=AF_INET, sin_port=htons(42404), sin_addr=inet_addr("10.20.1.101")}, [16]) = 0
11938 setsockopt(38, SOL_TCP, TCP_NODELAY, [1], 4) = 0
11938 sendto(38, "GET /api/v1/testit/ HTTP/1.1\r\nAccept: application/json, application/*+json\r\nAuthorization: XXXXXX\r\nUser-Agent: Java/1.8.0_40\r\nHost: api.lyhistory.com\r\nConnection: keep-alive\r\n\r\n", 215, 0, NULL, 0) = 215
11938 recvfrom(38, "HTTP/1.1 301 Moved Permanently\r\nDate: Fri, 14 Oct 2022 01:40:00 GMT\r\nContent-Type: text/html\r\nContent-Length: 134\r\nConnection: keep-alive\r\nLocation: https://api.lyhistory.com:443/api/v1/testit/\r\nServer: elb\r\n\r\n<html>\r\n<head><title>301 Moved Permanently</title></head>\r\n<body>\r\n<center><h1>301 Moved Permanently</h1></center>\r\n</body>\r\n</html>\r\n", 8192, 0, NULL, NULL) = 360
14483 +++ exited with 0 +++

果然是 301 Moved Permanently
```

#### 重现：
本地暂时没法访问云上资源，直接本地用nginx模拟：
```

server {
        listen       80;
        server_name  test.local;
        return 307 https://$host$request_uri;
    }
server {
		underscores_in_headers on;
		#listen       80;
        listen 443 ssl;
        server_name  test.local;

		add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
		add_header Access-Control-Allow-Headers Authorization;
		
        ssl_certificate clear-selfsigned.crt;
        ssl_certificate_key clear-selfsigned.key;
		
        location /test{
			default_type application/json;
			return 200 '{"success":"true","error":"hello world"}';
		}
}

使用hackerbar对比一下华为云elb：
get http://test.local/test

1st request:
>
GET /test HTTP/1.1
Host: test.local
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
test: 111222333
authorization: B873PGZRZK4MVWGVKZ8HQHMTB92K

<
HTTP/1.1 307 Temporary Redirect
Server: nginx/1.17.6
Date: Fri, 14 Oct 2022 10:33:54 GMT
Content-Type: text/html
Content-Length: 171
Connection: keep-alive
Location: https://test.local/test

2nd request:
>
GET /test HTTP/1.1
Host: test.local
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: document
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
sec-ch-ua-mobile: ?0
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9

<
HTTP/1.1 200 OK
Server: nginx/1.17.6
Date: Fri, 14 Oct 2022 10:33:54 GMT
Content-Type: application/json
Content-Length: 40
Connection: keep-alive
Strict-Transport-Security: max-age=31536000; includeSubDomains
Access-Control-Allow-Headers: Authorization


```
然后本地启动java程序，可以重现出那个错误！

但是调试过程，发现 RestTempate默认的factory本身就是默认 auto follow redirect
```
public boolean getInstanceFollowRedirects() {
         return instanceFollowRedirects;
     }
instanceFollowRedirects=true
```
那为什么没有跳转呢，其实重现的时候，只要一步步调试就可以看到这个code
sun.net.www.protocol.http.HttpURLConnection
```
if (!this.url.getProtocol().equalsIgnoreCase(var3.getProtocol())) {
/* 2625 */                      return false;
/*      */ 
/*      */                   }
```
对比了当前协议和跳转的协议，不同就直接返回！

#### 根源 root cause：

"After discussion among Java Networking engineers, it is felt that we shouldn't automatically follow redirect from one protocol to another, for instance, from http to https and vise versa, doing so may have serious security consequences. Thus the fix is to return the server responses for redirect. Check response code and Location header field value for redirect information. It's the application's responsibility to follow the redirect."
-- https://bugs.openjdk.org/browse/JDK-8190312
-- https://stackoverflow.com/questions/1884230/httpurlconnection-doesnt-follow-redirect-from-http-to-https



调查中还发现nginx模拟的时候第二次请求的authorization header自动被抹掉了，debug Rest Template才发现这段代码
sun.net.www.protocol.http.HttpURLConnection
```
if (!this.isUserProxyAuth) {
/* 1686 */                         this.requests.remove("Proxy-Authorization");
/*      */                      }
```
nginx redirect 跳转不能带原有的header（安全问题），只能走反向代理才可以
https://segmentfault.com/q/1010000011377374
https://www.reddit.com/r/nginx/comments/ox1vfb/missing_headers_after_redirect/


### wordpress upload failed empty response

描述：

wordpress media上传，**开发环境**没有问题，**生产production**上却失败，大小3m也不是很大，

/wp-admin/async-upload.php

#### 初步观察

##### firefox下面：
Queued: 21.50 s	Started: 1.60 m	inDownloaded: 2.88 min
Request Timing
Blocked:
1.25 min
DNS Resolution:
0 ms
Connecting:
64 ms
TLS Setup:
69 ms
Sending:
1.27 min
Waiting:
0 ms
Receiving:
0 ms

可以发现Blocked时间很长（后面才知道是因为经过waf过滤才导致的）
https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor/request_details#Timings
Blocked解释：
Time spent in a queue waiting for a network connection.

The browser imposes a limit on the number of simultaneous connections that can be made to a single server. In Firefox this defaults to 6, but can be changed using the network.http.max-persistent-connections-per-server preference. If all connections are in use, the browser can't download more resources until a connection is released.

http://kb.mozillazine.org/Network.http.max-persistent-connections-per-server

http://kb.mozillazine.org/Editing_configuration

修改（先不要随便修改）：访问 about:config 搜索 Network.http.max-persistent-connections-per-server

##### chrome：
跟firefox稍有不同，
首先在status一列可以看到 (failed) net::ERR_EMPTY_RESPONSE 在network timing里面看到 stalled

搜索这两个关键词无果：

https://stackoverflow.com/questions/66036116/wordpress-err-empty-response-on-long-content

https://stackoverflow.com/questions/27740692/request-stalled-for-a-long-time-occasionally-in-chrome

注意力回到timing解释

https://developer.chrome.com/docs/devtools/network/reference/#timing-explanation

Queueing. The browser queues requests when:
	There are higher priority requests.
	There are already six TCP connections open for this origin, which is the limit. Applies to HTTP/1.0 and HTTP/1.1 only.
	The browser is briefly allocating space in the disk cache
Stalled. The request could be stalled for any of the reasons described in Queueing.
这里也提到了6个TCP连接的限制

Firefox和chrome都可以在network列名上右键添加 Protocol，从而确认确实是HTTP1.1，然后chrome还可以添加 connection id

下面这个解释很有帮助

> *Note 2: If a TCP handshake was needed for a HTTP request, you'll see an orange bar in the DevTools waterfall and, if you hover over it, you'll see "Initial connection" - this tells you how long the handshake took in milliseconds. TCP connections may be reused across tabs and windows so watch out -- you might see an ID for the first time but it may not have a TCP handshake! This likely because you visited the page previously and opened a connection with that host. It may also be because Chrome prefetched a resource from the host -- Chrome prefetches a favicon for example when you type an address in the bar.*
>
> https://stackoverflow.com/questions/34184994/chrome-developer-tools-connection-id

下面可以排除前面 https://stackoverflow.com/questions/27740692/request-stalled-for-a-long-time-occasionally-in-chrome

提到的 **persistent TCP connection**的原因



chrome://net-export/

https://netlog-viewer.appspot.com/#import

```
t=35069 [st=    0] +REQUEST_ALIVE  [dt=34115]
                    --> priority = "MEDIUM"
                    --> traffic_annotation = 101845102
                    --> url = "https://www.xxx.com/wp-admin/async-upload.php"
t=35069 [st=    0]    DELEGATE_INFO  [dt=108]
                      --> delegate_blocked_by = "Opening Files"
t=35177 [st=  108]    NETWORK_DELEGATE_BEFORE_URL_REQUEST  [dt=0]
t=35177 [st=  108]   +URL_REQUEST_START_JOB  [dt=34006]
                      --> initiator = "https://www.xxx.com"
                      --> load_flags = 2 (BYPASS_CACHE)
                      --> method = "POST"
                      --> network_isolation_key = "https://xxx.com https://xxx.com"
                      --> privacy_mode = "disabled"
                      --> request_type = "other"
                      --> site_for_cookies = "SiteForCookies: {site=https://xxx.com; schemefully_same=true}"
                      --> upload_id = "0"
                      --> url = "https://www.xxx.com/wp-admin/async-upload.php"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      COOKIE_INCLUSION_STATUS
                        --> operation = "send"
                        --> status = "INCLUDE, DO_NOT_WARN"
t=35177 [st=  108]      NETWORK_DELEGATE_BEFORE_START_TRANSACTION  [dt=0]
t=35177 [st=  108]      HTTP_CACHE_GET_BACKEND  [dt=0]
建立连接HTTP_STREAM_JOB_CONTROLLER和HTTP_STREAM_JOB
t=35177 [st=  108]     +HTTP_STREAM_REQUEST  [dt=3]
t=35177 [st=  108]        HTTP_STREAM_JOB_CONTROLLER_BOUND
                          --> source_dependency = 1174836 (HTTP_STREAM_JOB_CONTROLLER)
t=35180 [st=  111]        HTTP_STREAM_REQUEST_BOUND_TO_JOB
                          --> source_dependency = 1174837 (HTTP_STREAM_JOB)
t=35180 [st=  111]     -HTTP_STREAM_REQUEST
t=35181 [st=  112]      UPLOAD_DATA_STREAM_INIT  [dt=0]
                        --> is_chunked = false
                        --> net_error = 0 (?)
                        --> total_size = 3505027
t=35181 [st=  112]     +HTTP_TRANSACTION_SEND_REQUEST  [dt=6769]
t=35181 [st=  112]        HTTP_TRANSACTION_SEND_REQUEST_HEADERS
                          --> POST /wp-admin/async-upload.php HTTP/1.1
                              Host: www.xxx.com
                              Connection: keep-alive
                              Content-Length: 3505027
                              Pragma: no-cache
                              Cache-Control: no-cache
                              sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
                              sec-ch-ua-mobile: ?0
                              User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
                              Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryZinpNBEkQJmJWpBq
                              Accept: */*
                              Origin: https://www.xxx.com
                              Sec-Fetch-Site: same-origin
                              Sec-Fetch-Mode: cors
                              Sec-Fetch-Dest: empty
                              Referer: https://www.xxx.com/wp-admin/upload.php
                              Accept-Encoding: gzip, deflate, br
                              Accept-Language: en-US,en;q=0.9
                              Cookie: [717 bytes were stripped]
t=35181 [st=  112]        HTTP_TRANSACTION_SEND_REQUEST_BODY
                          --> did_merge = false
                          --> is_chunked = false
                          --> length = 3505027
开始上传                          
t=35181 [st=  112]        UPLOAD_DATA_STREAM_READ  [dt=0]
                          --> current_position = 0
t=35182 [st=  113]        UPLOAD_DATA_STREAM_READ  [dt=0]
                          --> current_position = 16384
..............
t=41949 [st= 6880]        UPLOAD_DATA_STREAM_READ  [dt=1]
                          --> current_position = 3505027
上传失败 net_error = -100，但是注意此时current_position = 3505027===length = 3505027
耗时
t = 41950-35181=6769
st = 6881-112=6769
大概6秒
t=41950 [st= 6881]     -HTTP_TRANSACTION_SEND_REQUEST
t=41950 [st= 6881]     +HTTP_TRANSACTION_READ_HEADERS  [dt=10169]
t=41950 [st= 6881]        HTTP_STREAM_PARSER_READ_HEADERS  [dt=10168]
                          --> net_error = -100 (ERR_CONNECTION_CLOSED)
t=52118 [st=17049]        HTTP_TRANSACTION_RESTART_AFTER_ERROR
                          --> net_error = -100 (ERR_CONNECTION_CLOSED)
chrome发起重试                          
t=52119 [st=17050]     -HTTP_TRANSACTION_READ_HEADERS
t=52119 [st=17050]     +HTTP_STREAM_REQUEST  [dt=399]
建立连接HTTP_STREAM_JOB_CONTROLLER和HTTP_STREAM_JOB
t=52119 [st=17050]        HTTP_STREAM_JOB_CONTROLLER_BOUND
                          --> source_dependency = 1174847 (HTTP_STREAM_JOB_CONTROLLER)
t=52518 [st=17449]        HTTP_STREAM_REQUEST_BOUND_TO_JOB
                          --> source_dependency = 1174848 (HTTP_STREAM_JOB)
t=52518 [st=17449]     -HTTP_STREAM_REQUEST
t=52518 [st=17449]      UPLOAD_DATA_STREAM_INIT  [dt=0]
                        --> is_chunked = false
                        --> net_error = 0 (?)
                        --> total_size = 3505027
t=52518 [st=17449]     +HTTP_TRANSACTION_SEND_REQUEST  [dt=6530]
t=52518 [st=17449]        HTTP_TRANSACTION_SEND_REQUEST_HEADERS
                          --> POST /wp-admin/async-upload.php HTTP/1.1
                              Host: www.xxx.com
                              Connection: keep-alive
                              Content-Length: 3505027
                              Pragma: no-cache
                              Cache-Control: no-cache
                              sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
                              sec-ch-ua-mobile: ?0
                              User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
                              Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryZinpNBEkQJmJWpBq
                              Accept: */*
                              Origin: https://www.xxx.com
                              Sec-Fetch-Site: same-origin
                              Sec-Fetch-Mode: cors
                              Sec-Fetch-Dest: empty
                              Referer: https://www.xxx.com/wp-admin/upload.php
                              Accept-Encoding: gzip, deflate, br
                              Accept-Language: en-US,en;q=0.9
                              Cookie: [717 bytes were stripped]
t=52518 [st=17449]        HTTP_TRANSACTION_SEND_REQUEST_BODY
                          --> did_merge = false
                          --> is_chunked = false
                          --> length = 3505027
t=52518 [st=17449]        UPLOAD_DATA_STREAM_READ  [dt=0]
                          --> current_position = 0
..............
又是上传完了但是另外一个错误 net_error = -324
t=59048 [st=23979]        UPLOAD_DATA_STREAM_READ  [dt=0]
                          --> current_position = 3505027
t=59048 [st=23979]     -HTTP_TRANSACTION_SEND_REQUEST
t=59048 [st=23979]     +HTTP_TRANSACTION_READ_HEADERS  [dt=10135]
t=59048 [st=23979]        HTTP_STREAM_PARSER_READ_HEADERS  [dt=10135]
                          --> net_error = -324 (ERR_EMPTY_RESPONSE)
t=69183 [st=34114]     -HTTP_TRANSACTION_READ_HEADERS
                        --> net_error = -324 (ERR_EMPTY_RESPONSE)
t=69183 [st=34114]   -URL_REQUEST_START_JOB
                      --> net_error = -324 (ERR_EMPTY_RESPONSE)
t=69183 [st=34114]    URL_REQUEST_DELEGATE_RESPONSE_STARTED  [dt=0]
t=69184 [st=34115] -REQUEST_ALIVE
                    --> net_error = -324 (ERR_EMPTY_RESPONSE)
                    
看下：HTTP_STREAM_JOB_CONTROLLER和HTTP_STREAM_JOB     
初次是
t=35177 [st=  108]        HTTP_STREAM_JOB_CONTROLLER_BOUND
                          --> source_dependency = 1174836 (HTTP_STREAM_JOB_CONTROLLER)
t=35180 [st=  111]        HTTP_STREAM_REQUEST_BOUND_TO_JOB
                          --> source_dependency = 1174837 (HTTP_STREAM_JOB)
1174836：
1174836: HTTP_STREAM_JOB_CONTROLLER
https://www.xxx.com/wp-admin/async-upload.php
Start Time: 2021-11-29 17:25:53.321

t=35177 [st=0] +HTTP_STREAM_JOB_CONTROLLER  [dt=4]
                --> is_preconnect = false
                --> url = "https://www.xxx.com/wp-admin/async-upload.php"
t=35177 [st=0]    HTTP_STREAM_JOB_CONTROLLER_BOUND
                  --> source_dependency = 1174835 (URL_REQUEST)
t=35177 [st=0]   +PROXY_RESOLUTION_SERVICE  [dt=3]
t=35178 [st=1]     +HOST_RESOLVER_IMPL_REQUEST  [dt=0]
                    --> allow_cached_response = true
                    --> dns_query_type = 1
                    --> host = "www.xxx.com:0"
                    --> is_speculative = false
                    --> network_isolation_key = "null null"
t=35178 [st=1]        HOST_RESOLVER_IMPL_CACHE_HIT
                      --> addresses = ["18.140.49.179","203.205.159.22","150.109.90.80","54.254.71.41","54.254.112.6","13.251.21.164"]
                      --> expiration = "13282651581632397"
t=35178 [st=1]        HOST_RESOLVER_IMPL_CACHE_HIT
                      --> addresses = ["18.140.49.179","203.205.159.22","150.109.90.80","54.254.71.41","54.254.112.6","13.251.21.164"]
                      --> expiration = "13282651581632397"
t=35178 [st=1]     -HOST_RESOLVER_IMPL_REQUEST
t=35180 [st=3]      PROXY_RESOLUTION_SERVICE_RESOLVED_PROXY_LIST
                    --> pac_string = "PROXY 172.16.101.100:8080"
t=35180 [st=3]   -PROXY_RESOLUTION_SERVICE
t=35180 [st=3]    HTTP_STREAM_JOB_CONTROLLER_PROXY_SERVER_RESOLVED
                  --> proxy_server = "PROXY 172.16.101.100:8080"
t=35180 [st=3]    HTTP_STREAM_REQUEST_STARTED_JOB
                  --> source_dependency = 1174837 (HTTP_STREAM_JOB)
t=35181 [st=4] -HTTP_STREAM_JOB_CONTROLLER

1174837: HTTP_STREAM_JOB
https://www.xxx.com/
Start Time: 2021-11-29 17:25:53.324

t=35180 [st=0] +HTTP_STREAM_JOB  [dt=0]
                --> expect_spdy = false
                --> original_url = "https://www.xxx.com/"
                --> priority = "MEDIUM"
                --> source_dependency = 1174836 (HTTP_STREAM_JOB_CONTROLLER)
                --> url = "https://www.xxx.com/"
                --> using_quic = false
t=35180 [st=0]    HTTP_STREAM_JOB_WAITING  [dt=0]
                  --> should_wait = false
t=35180 [st=0]   +HTTP_STREAM_JOB_INIT_CONNECTION  [dt=0]
t=35180 [st=0]      TCP_CLIENT_SOCKET_POOL_REQUESTED_SOCKET
                    --> group_id = "ssl/www.xxx.com:443"
t=35180 [st=0]     +SOCKET_POOL  [dt=0]
t=35180 [st=0]        SOCKET_POOL_REUSED_AN_EXISTING_SOCKET	#重用persistent TCP connection，所以就排除了最初查到的原因
                      --> idle_ms = 30348
t=35180 [st=0]        SOCKET_POOL_BOUND_TO_SOCKET
                      --> source_dependency = 1174753 (SOCKET)	#注意这里的SOCKET 1174753就是对应的前面说的connectionID
t=35180 [st=0]     -SOCKET_POOL
t=35180 [st=0]   -HTTP_STREAM_JOB_INIT_CONNECTION
t=35180 [st=0]    HTTP_STREAM_REQUEST_PROTO
                  --> proto = "http/1.1"
t=35180 [st=0]    HTTP_STREAM_JOB_BOUND_TO_REQUEST
                  --> source_dependency = 1174835 (URL_REQUEST)
t=35180 [st=0] -HTTP_STREAM_JO
                          
```

对比，正常的上传

```
1208145: URL_REQUEST
https://xxxx.com/wp-admin/async-upload.php
Start Time: 2021-11-30 14:27:56.488

t=5339 [st=   0] +REQUEST_ALIVE  [dt=1320]
                  --> priority = "MEDIUM"
                  --> traffic_annotation = 101845102
                  --> url = "https://xxxx.com/wp-admin/async-upload.php"
t=5339 [st=   0]    DELEGATE_INFO  [dt=140]
                    --> delegate_blocked_by = "Opening Files"
t=5479 [st= 140]    NETWORK_DELEGATE_BEFORE_URL_REQUEST  [dt=0]
t=5479 [st= 140]   +URL_REQUEST_START_JOB  [dt=1179]
                    --> initiator = "https://www.xxx.com"
                    --> load_flags = 2 (BYPASS_CACHE)
                    --> method = "POST"
                    --> network_isolation_key = "https://xxx.com https://xxx.com"
                    --> privacy_mode = "disabled"
                    --> request_type = "other"
                    --> site_for_cookies = "SiteForCookies: {site=https://xxx.com; schemefully_same=true}"
                    --> upload_id = "0"
                    --> url = "https://www.xxx.com/wp-admin/async-upload.php"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=5479 [st= 140]      NETWORK_DELEGATE_BEFORE_START_TRANSACTION  [dt=0]
t=5479 [st= 140]      HTTP_CACHE_GET_BACKEND  [dt=0]
t=5479 [st= 140]     +HTTP_STREAM_REQUEST  [dt=3]
t=5479 [st= 140]        HTTP_STREAM_JOB_CONTROLLER_BOUND
                        --> source_dependency = 1208146 (HTTP_STREAM_JOB_CONTROLLER)
t=5482 [st= 143]        HTTP_STREAM_REQUEST_BOUND_TO_JOB
                        --> source_dependency = 1208147 (HTTP_STREAM_JOB)
t=5482 [st= 143]     -HTTP_STREAM_REQUEST
t=5482 [st= 143]      UPLOAD_DATA_STREAM_INIT  [dt=0]
                      --> is_chunked = false
                      --> net_error = 0 (?)
                      --> total_size = 4792
t=5482 [st= 143]     +HTTP_TRANSACTION_SEND_REQUEST  [dt=1]
t=5482 [st= 143]        HTTP_TRANSACTION_SEND_REQUEST_HEADERS
                        --> POST /wp-admin/async-upload.php HTTP/1.1
                            Host: www.xxx.com
                            Connection: keep-alive
                            Content-Length: 4792
                            Pragma: no-cache
                            Cache-Control: no-cache
                            sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
                            sec-ch-ua-mobile: ?0
                            User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
                            Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryHCDeoH2gO9wCcNFe
                            Accept: */*
                            Origin: https://www.xxx.com
                            Sec-Fetch-Site: same-origin
                            Sec-Fetch-Mode: cors
                            Sec-Fetch-Dest: empty
                            Referer: https://www.xxx.com/wp-admin/upload.php
                            Accept-Encoding: gzip, deflate, br
                            Accept-Language: en-US,en;q=0.9
                            Cookie: [717 bytes were stripped]
t=5483 [st= 144]        HTTP_TRANSACTION_SEND_REQUEST_BODY
                        --> did_merge = false
                        --> is_chunked = false
                        --> length = 4792
t=5483 [st= 144]        UPLOAD_DATA_STREAM_READ  [dt=0]
                        --> current_position = 0
t=5483 [st= 144]        UPLOAD_DATA_STREAM_READ  [dt=0]
                        --> current_position = 4792
t=5483 [st= 144]     -HTTP_TRANSACTION_SEND_REQUEST
t=5483 [st= 144]     +HTTP_TRANSACTION_READ_HEADERS  [dt=1175]
t=5483 [st= 144]        HTTP_STREAM_PARSER_READ_HEADERS  [dt=1175]
t=6658 [st=1319]        HTTP_TRANSACTION_READ_RESPONSE_HEADERS
                        --> HTTP/1.1 200 OK
                            Server: nginx
                            Date: Tue, 30 Nov 2021 06:27:57 GMT
                            Content-Type: text/plain; charset=UTF-8
                            Expires: Wed, 11 Jan 1984 05:00:00 GMT
                            X-Frame-Options: SAMEORIGIN
                            Referrer-Policy: strict-origin-when-cross-origin
                            X-Content-Type-Options: nosniff
                            X-WP-Upload-Attachment-ID: 3447
                            X-XSS-Protection: 1; mode=block
                            Strict-Transport-Security: max-age=31536000; includeSubDomains;
                            X-Cache-Lookup: Cache Miss
                            Content-Encoding: gzip
                            Cache-Control: must-revalidate, no-cache, max-age=0
                            Transfer-Encoding: chunked
                            X-NWS-LOG-UUID: 7691670333191889
                            Connection: keep-alive
                            X-Cache-Lookup: Cache Miss
t=6658 [st=1319]     -HTTP_TRANSACTION_READ_HEADERS
t=6658 [st=1319]      NETWORK_DELEGATE_HEADERS_RECEIVED  [dt=0]
t=6658 [st=1319]      URL_REQUEST_FILTERS_SET
                      --> filters = "GZIP"
t=6658 [st=1319]   -URL_REQUEST_START_JOB
t=6658 [st=1319]    URL_REQUEST_DELEGATE_RESPONSE_STARTED  [dt=0]
t=6658 [st=1319]    HTTP_TRANSACTION_READ_BODY  [dt=0]
t=6658 [st=1319]    URL_REQUEST_JOB_BYTES_READ
                    --> byte_count = 845
t=6658 [st=1319]    URL_REQUEST_JOB_FILTERED_BYTES_READ
                    --> byte_count = 1868
t=6659 [st=1320]    HTTP_TRANSACTION_READ_BODY  [dt=0]
t=6659 [st=1320] -REQUEST_ALIVE
```



问题的核心在于为什么明明已经上传完成（current_position = 3505027===length = 3505027），但是

HTTP_STREAM_PARSER_READ_HEADERS net_error = -100 (ERR_CONNECTION_CLOSED)

为什么服务端会关掉？

想起来再抓一下dev环境的netlog，发现dev上速度确实快一点，

测试了  vim /etc/httpd/conf/httpd.conf	Timeout 以及 vim /etc/opt/rh/rh-php72/php.ini max_execution_time，把这些时间放到3秒都没有问题，前面测试3M文件上传大概6到10秒

并且检查了 /.htaccess 都没有问题

再查查其他timeout： 搜索apache httpd http connection closed timeout

https://httpd.apache.org/docs/2.4/mod/core.html

https://www.oreilly.com/library/view/http-the-definitive/1565925092/ch04s07.html

换个关键词吧，毕竟是大文件引起的，测试小图标确实上传没问题，搜索 large file ERR_CONNECTION_CLOSED

https://stackoverflow.com/questions/53736912/neterr-connection-reset-when-large-file-takes-longer-than-a-minute

但是这个答案总感觉有点不太对

```php
RequestReadTimeout header=20-40, MinRate=500 body=20, MinRate=500
https://httpd.apache.org/docs/current/mod/mod_reqtimeout.html
```

然后看到另外一个人的回答是因为 ProxyTimeout，回到netlog-viewer：

https://netlog-viewer.appspot.com/#sockets

| Name                                         | Handed Out | Idle                                                         | Connecting | Max  | Max Per Group | Generation |
| -------------------------------------------- | ---------- | ------------------------------------------------------------ | ---------- | ---- | ------------- | ---------- |
| direct:// (transport_socket_pool)            | 0          | [4](https://netlog-viewer.appspot.com/#events&q=id:1208669,1208667,1208111,1208329) | 0          | 256  | 6             | undefined  |
| 172.16.101.100:8080 (http_proxy_socket_pool) | 1          | [3](https://netlog-viewer.appspot.com/#events&q=id:1203134,1205602,1208691) | 0          | 32   | 6             | undefined  |
| 127.0.0.1:8888 (http_proxy_socket_pool)      | 0          | 0                                                            | 0          | 32   | 6             | undefined  |

| direct:// (transport_socket_pool) |         |              |        |                                                              |              |              |         |
| --------------------------------- | ------- | ------------ | ------ | ------------------------------------------------------------ | ------------ | ------------ | ------- |
| Name                              | Pending | Top Priority | Active | Idle                                                         | Connect Jobs | Backup Timer | Stalled |
| ssl/dev.xxx.com:443               | 0       | -            | 0      | [2](https://netlog-viewer.appspot.com/#events&q=id:1208669,1208667) | 0            | stopped      | false   |
| ssl/hrs.lyhistory.com:443     | 0       | -            | 0      | [2](https://netlog-viewer.appspot.com/#events&q=id:1208111,1208329) | 0            | stopped      | false   |



| 172.16.101.100:8080 (http_proxy_socket_pool) |         |              |        |                                                             |              |              |         |
| -------------------------------------------- | ------- | ------------ | ------ | ----------------------------------------------------------- | ------------ | ------------ | ------- |
| Name                                         | Pending | Top Priority | Active | Idle                                                        | Connect Jobs | Backup Timer | Stalled |
| pm/ssl/sdk.split.io:443                      | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1203134) | 0            | stopped      | false   |
| ssl/d27xxe7juh1us6.cloudfront.net:443        | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1205602) | 0            | stopped      | false   |
| ssl/www.xxx.com:443                          | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1208691) | 0            | stopped      | false   |
| ssl/www.google.com:443                       | 0       | -            | 1      | 0                                                           | 0            | stopped      | false   |

可以看到，dev.xxx.com是直接访问的，而www.xxx.com是通过proxy，所以是不是因为这个proxy的原因

#### 问题梳理

首先，chrome使用了机器本身设定的proxy，我是公司电脑，连vpn访问网站会经过默认的 proxy server，就是前面的 172.16.101.100，

firefox可以设定proxy，然后想起来最初使用firefox测试的时候，设置的是no-proxy，

经过一番查找，firefox貌似没有类似chrome的net log viewer，只有个

https://firefox-source-docs.mozilla.org/networking/http/logging.html
about:networking#logging

然后发现web developer tool下面有个performance capture，用了下，发现

```
Status:
Response received
URL:
https://www.xxx.com/wp-admin/async-upload.php
Priority:
Normal(0)
Thread:
Web Content (3/9)
URL:
https://www.xxx.com/wp-admin/upload.php (id: 42949673009)
Waiting for socket thread:
42,476ms
DNS request:
0.27ms
After DNS request:
1.2ms
TCP connection:
22,389ms
After TCP connection:
13ms
Establishing TLS session:
311ms
Waiting for HTTP request:
1,549ms
HTTP request and waiting for response:
14,964ms
HTTP response:
15,294ms
Waiting to transmit the response:
32ms
```

Response received显然是不对的，不过下面Waiting for socket thread:42,476ms和TCP connection:22,389ms加起来都超过一分钟了，在about:networking#dns可以看到www.xxx.com解析到了一堆ip，经过询问infra，同事说是waf public ip，所以原来是waf导致了tcp connection超时，

怪不得跟chrome的时间有点不同，chrome至少可以看到在重用reuse tcp socket connection的时候是很快的，那么就自然要确认下，重新设置firefox auto detect proxy，即使用跟chrome一样的机器的proxy，结果如下：

```
Status:
Response received
URL:
https://www.xxx.com/wp-admin/async-upload.php
Priority:
Normal(0)
Thread:
Web Content (1/8)
URL:
https://www.xxx.com/wp-admin/upload.php (id: 42949673012)
Waiting for socket thread:
44ms
HTTP request and waiting for response:
13,371ms
HTTP response:
15,701ms
Waiting to transmit the response:
4.3ms
```

先走了proxy，等待socket时间变短了，可能是reuse也不用重新建立tcp连接握手了，不过等待http reponse的时间很长，估计超时了（超过proxy服务器的timeout时长），至少这次跟chrome表现一样了；

最后自然是重新设置no-proxy，绕过proxy然后绕过waf（设置hosts直接指向web服务器的ip），果然上传成功！

```
Status:
Response received
URL:
https://www.xxx.com/wp-admin/async-upload.php
Priority:
Normal(0)
MIME type:
text/plain
Requested bytes:
2,259B
Thread:
Web Content (1/8)
URL:
https://www.xxx.com/wp-admin/upload.php (id: 42949673015)
Waiting for socket thread:
98ms
DNS request:
0.29ms
After DNS request:
1.3ms
TCP connection:
121ms
After TCP connection:
3.5ms
Establishing TLS session:
114ms
Waiting for HTTP request:
21ms
HTTP request and waiting for response:
18,930ms
HTTP response:
0.67ms
Waiting to transmit the response:
4.1ms
```

https://stackoverflow.com/questions/27740692/request-stalled-for-a-long-time-occasionally-in-chrome/70180892#70180892

https://stackoverflow.com/questions/53736912/neterr-connection-reset-when-large-file-takes-longer-than-a-minute/70180666#70180666

### websocket issues
#### websocket connection issue

这次遇到的问题：

firefox访问没有问题（浏览器连接服务器的nginx并转发到websocket端口），本地vscode debug（连接本地nginx，nginx转发到服务器上的websocket服务端）

原因跟上面wordpress large file upload failed一样都是因为公司机器chrome使用了proxy

通常websocket连接不成功大概率是client端或者服务端的问题，所以刚开始浪费了不少时间查看服务端的情况以及websocket client端代码，其实可以直接在dev tools里面执行代码片段进行调试

```
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

```

观察到，chrome下偶尔成功，多数时间失败，上chrome终极大杀器 netlog viewer，
chrome://net-export
https://netlog-viewer.appspot.com
发现跟前面一样的原因；

后来才有人反馈firefox可以，才意识到firefox默认proxy设置成了blank，chrome不使用插件的情况下默认是系统的proxy

#### websocket 301
nginx config:
```
  location /websocket/ {
            proxy_pass http://127.0.0.1:10001/websocket;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header X-Real-IP $remote_addr;
                        proxy_read_timeout 600s;
        }

```
请求 
```
Request URL: ws://X.X.X.X/websocket
Request Method: GET

结果
"GET /websocket HTTP/1.1" 301 169 "
```
测试：
```
# curl --include \
>      --no-buffer \
>      --header "Connection: Upgrade" \
>      --header "Upgrade: websocket" \
>      --header "Host: example.com:80" \
>      --header "Origin: http://X.X.X.X" \
>      --header "Sec-WebSocket-Key: wRPCh4fPSMIpX7yMcpgABA==" \
>      --header "Sec-WebSocket-Version: 13" \
>      "http://X.X.X.X/websocket"
HTTP/1.1 301 Moved Permanently
Server: nginx/1.22.0
Date: Mon, 12 Sep 2022 09:37:18 GMT
Content-Type: text/html
Content-Length: 169
Location: http://example.com/websocket/
Connection: keep-alive

<html>
<head><title>301 Moved Permanently</title></head>
<body>
<center><h1>301 Moved Permanently</h1></center>
<hr><center>nginx/1.22.0</center>
</body>
</html>


[root@sghc1-prod-acs-app-v01 ~]# curl --include \
>      --no-buffer \
>      --header "Connection: Upgrade" \
>      --header "Upgrade: websocket" \
>      --header "Host: example.com:80" \
>      --header "Origin: http://X.X.X.X" \
>      --header "Sec-WebSocket-Key: wRPCh4fPSMIpX7yMcpgABA==" \
>      --header "Sec-WebSocket-Version: 13" \
>      "http://X.X.X.X/websocket/"
HTTP/1.1 101 Switching Protocols
Server: nginx/1.22.0
Date: Mon, 12 Sep 2022 09:36:48 GMT
Connection: upgrade
upgrade: websocket
sec-websocket-accept: NwKFJc0S/lPR4qpqWC7LzZ7CQj4=

▒l{"code":0,"message":"welcome!","sessionId":"1a1050ad-bbb6-4ccd-bfce-a84688e6017d","success":true}
```
区别就在最后的 ending slash /

所以修改nginx配置
```
location /websocket/ 
=>
location /websocket
```
https://nginx.org/en/CHANGES-1.22
```
    *) Bugfix: special characters were not escaped during automatic redirect
       with appended trailing slash.
```

#### webscoket failed switch Protocol/lost upgrade header

**描述：**

华为云上配置：
浏览器/App => CDN或高防等代理 => Web应用防火墙 => 源站服务器

websocket服务位于源站服务器，通过nginx反向代理，nginx配置：
```
location /test/wsPublicMessage {
    if ( $http_upgrade = '' ){
        add_header debug $http_x_forwarded_for;
        return 465;
        }
        proxy_pass http://XXX ;
        #proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
               
```
发现从公网访问，到达nginx的时候 http_upgrade为空，
但是直接修改本地hosts文件域名指向源站服务器则没有问题，说明问题出在中间的CDN或高防等代理或者Web应用防火墙

**调查：**
修改域名的cname指向Web应用防火墙，绕过cdn，问题解决

**原因：**
华为云cdn服务限制：
>域名服务范围为中国大陆境外或全球时：
>支持HTTP、HTTPS协议；不支持其他协议，如FTP、TCP、UDP、WebSocket、WSS等协议。

### nginx location proxy_pass 404
```
server {
		listen       80;
        location /test {
            proxy_pass http://127.0.0.1:10001;
            proxy_redirect    off;
            proxy_set_header  Host $host;
            proxy_set_header  X-real-ip $remote_addr;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }
```
刚开始一直怀疑是nginx问题，结果发现10001对应的java服务挂了，开启debug模式发现问题：
java -Djavax.net.debug=all -jar teset.jar
原来是一个字体引起的
java: symbol lookup error: /lib64/libfontconfig.so.1: undefined symbol: FT_Get_Advance


$ ll /usr/lib64/libfontconfig.so.1
lrwxrwxrwx. 1 root root 23 Jun 15 17:05 /usr/lib64/libfontconfig.so.1 -> libfontconfig.so.1.11.1

nm -D /usr/lib64/libfontconfig.so.1 | grep FT_Get_Advance

$ nm -D /usr/lib64/libfontconfig.so.1 | grep FT_Get_Advance
                 U FT_Get_Advance


第一次尝试：
mv /usr/lib64/libfreetype.so.6 /usr/lib64/libfreetype.so.6_renamed

2022-06-17 19:50:55.845 ERROR 26353GG [io-10001-exec-2] c.q.f.w.a.CommonExceptionHandler : InternalException: Handler dispatch failed; nested exception is java.lang.UnsatisfiedLinkError: /opt/3rd-party/openjdk-8u312-b07/jre/lib/amd64/libfontmanager.so: libfreetype.so.6: cannot open shared object file: No such file or directory

org.springframework.web.util.NestedServletException: Handler dispatch failed; nested exception is java.lang.UnsatisfiedLinkError: /opt/3rd-party/openjdk-8u312-b07/jre/lib/amd64/libfontmanager.so: libfreetype.so.6: cannot open shared object file: No such file or directory
        at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1075)
        at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:962)
        at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)
        at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:626)
        at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:733)

第二次(solved)：
https://www.bookstack.cn/read/WeBASE-1.2.4-zh/96bb971c90544168.md
```
yum -y install gcc
yum -y install gcc-c++
```

### ClientAbortException
前端=》nginx=》后端服务
```
后端异常：
org.apache.catalina.connector.ClientAbortException: java.io.IOException: Broken pipe

nginx日志：

10.34.100.15 - - [17/Aug/2022:20:39:05 +0800] "POST /test HTTP/1.1" 499 0 "https://test.com/test" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
10.34.100.15 - - [17/Aug/2022:20:39:06 +0800] "POST /test HTTP/1.1" 200 12176 "https://test.com/test" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"

可以看到pattern是一直有两个同一个时间的日志，一个是 499 一个是200，499代表client端也就是浏览器关闭了请求，而服务端还在往buffer写返回，所以抛错
```
经调查发现前端页面渲染的两个组件内部有重复的api调用

### 请求大量数据时返回截断中断 net::ERR_INCOMPLETE_CHUNKED_ENCODING 

请求 size=100没问题
https://api.lyhistory.com/hismin?size=100&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35

请求 size=1000返回被截断
https://api.lyhistory.com/hismin?size=1000&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35

具体错误：
+ chrome显示：net::ERR_INCOMPLETE_CHUNKED_ENCODING 
+ firefox：SyntaxError: JSON.parse: end of data after property value in object at line 3606 column 23 of the JSON data

#### 浏览器=》cdn=》waf地址池=》防火墙（只开放访问给waf地址池）=》elb(elb 公网地址eip=>NAT=>内网elb ip)=》源服务器(nginx反向代理->proxy_pass to upstream)，


```
453138: URL_REQUEST
https://api.lyhistory.com/hismin?size=1000&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35
Start Time: 2022-10-21 08:53:14.450

t=23755 [st=  0] +REQUEST_ALIVE  [dt=760]
                  --> priority = "HIGHEST"
                  --> traffic_annotation = 63171670
                  --> url = "https://api.lyhistory.com/hismin?size=1000&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35"
t=23755 [st=  0]    NETWORK_DELEGATE_BEFORE_URL_REQUEST  [dt=0]
t=23755 [st=  0]   +URL_REQUEST_START_JOB  [dt=759]
                    --> initiator = "chrome-extension://ginpbkfigcoaokgflihfhhmglmbchinc"
                    --> load_flags = 65794 (BYPASS_CACHE | CAN_USE_RESTRICTED_PREFETCH | MAIN_FRAME_DEPRECATED)
                    --> method = "GET"
                    --> network_isolation_key = "https://lyhistory.com https://lyhistory.com"
                    --> privacy_mode = "disabled"
                    --> request_type = "main frame"
                    --> site_for_cookies = "SiteForCookies: {site=https://lyhistory.com; schemefully_same=true}"
                    --> url = "https://api.lyhistory.com/hismin?size=1000&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, EXCLUDE_NOT_ON_PATH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "EXCLUDE_DOMAIN_MISMATCH, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=23755 [st=  0]      COOKIE_INCLUSION_STATUS
                      --> operation = "send"
                      --> status = "INCLUDE, DO_NOT_WARN"
t=23755 [st=  0]      NETWORK_DELEGATE_BEFORE_START_TRANSACTION  [dt=6]
t=23761 [st=  6]      HTTP_CACHE_GET_BACKEND  [dt=0]
t=23761 [st=  6]      HTTP_CACHE_DOOM_ENTRY  [dt=0]
                      --> net_error = -2 (ERR_FAILED)
t=23761 [st=  6]      HTTP_CACHE_CREATE_ENTRY  [dt=0]
t=23761 [st=  6]      HTTP_CACHE_ADD_TO_ENTRY  [dt=0]
t=23761 [st=  6]     +HTTP_STREAM_REQUEST  [dt=442]
t=23761 [st=  6]        HTTP_STREAM_JOB_CONTROLLER_BOUND
                        --> source_dependency = 453146 (HTTP_STREAM_JOB_CONTROLLER)
t=24203 [st=448]        HTTP_STREAM_REQUEST_BOUND_TO_JOB
                        --> source_dependency = 453147 (HTTP_STREAM_JOB)
t=24203 [st=448]     -HTTP_STREAM_REQUEST
t=24203 [st=448]     +HTTP_TRANSACTION_SEND_REQUEST  [dt=0]
t=24203 [st=448]        HTTP_TRANSACTION_SEND_REQUEST_HEADERS
                        --> GET /hismin?size=1000&datatype=7&instrumentid=BTCP&startday=20221020&starttime=19:35 HTTP/1.1
                            Host: api.lyhistory.com
                            Connection: keep-alive
                            Pragma: no-cache
                            Cache-Control: no-cache
                            sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
                            sec-ch-ua-mobile: ?0
                            Upgrade-Insecure-Requests: 1
                            User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36
                            Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
                            Sec-Fetch-Site: cross-site
                            Sec-Fetch-Mode: navigate
                            Sec-Fetch-Dest: document
                            Accept-Encoding: gzip, deflate, br
                            Accept-Language: en-US,en;q=0.9
                            Cookie: [161 bytes were stripped]
t=24203 [st=448]     -HTTP_TRANSACTION_SEND_REQUEST
t=24203 [st=448]     +HTTP_TRANSACTION_READ_HEADERS  [dt=311]
t=24203 [st=448]        HTTP_STREAM_PARSER_READ_HEADERS  [dt=311]
t=24514 [st=759]        HTTP_TRANSACTION_READ_RESPONSE_HEADERS
                        --> HTTP/1.1 200 OK
                            Date: Fri, 21 Oct 2022 00:53:15 GMT
                            Content-Type: application/json; charset=utf-8
                            Transfer-Encoding: chunked
                            Connection: keep-alive
                            Server: CloudWAF
                            Content-Encoding: gzip
                            via: EA-SGP-EDGE1-CACHE5[90],EA-SGP-EDGE1-CACHE5[ovl,89],EA-MAS-cyberjaya-GLOBAL1-CACHE1[ovl,69]
t=24514 [st=759]     -HTTP_TRANSACTION_READ_HEADERS
t=24514 [st=759]      HTTP_CACHE_WRITE_INFO  [dt=0]
t=24514 [st=759]      HTTP_CACHE_WRITE_DATA  [dt=0]
t=24514 [st=759]      HTTP_CACHE_WRITE_INFO  [dt=0]
t=24514 [st=759]      NETWORK_DELEGATE_HEADERS_RECEIVED  [dt=0]
t=24514 [st=759]      URL_REQUEST_FILTERS_SET
                      --> filters = "GZIP"
t=24514 [st=759]   -URL_REQUEST_START_JOB
t=24514 [st=759]    URL_REQUEST_DELEGATE_RESPONSE_STARTED  [dt=1]
t=24515 [st=760]    HTTP_TRANSACTION_READ_BODY  [dt=0]
t=24515 [st=760]    URL_REQUEST_JOB_BYTES_READ
                    --> byte_count = 3086
t=24515 [st=760]    URL_REQUEST_JOB_FILTERED_BYTES_READ
                    --> byte_count = 65536
t=24515 [st=760]    URL_REQUEST_JOB_FILTERED_BYTES_READ
                    --> byte_count = 16211
t=24515 [st=760]    HTTP_TRANSACTION_READ_BODY  [dt=0]
                    --> net_error = -355 (ERR_INCOMPLETE_CHUNKED_ENCODING)
t=24515 [st=760]    FAILED
                    --> net_error = -355 (ERR_INCOMPLETE_CHUNKED_ENCODING)
t=24515 [st=760] -REQUEST_ALIVE
                  --> net_error = -355 (ERR_INCOMPLETE_CHUNKED_ENCODING)
```

#### 浏览器=》源服务器(nginx反向代理->proxy_pass to upstream)
200 但是 chrome network status: (failed)net::ERR_CONTENT_LENGTH_MISMATCH

curl测试：
```
1curl: (18) transfer closed with 235509 bytes remaining to read
```

#### 根源 root cause
```
tail -f vi /usr/local/nginx/logs/error.log

2022/10/21 14:20:25 [crit] 15692#0: *357 open() "/usr/local/nginx/proxy_temp/1/05/0000000051" failed (13: Permission denied) while reading upstream, client: 172.31.252.99, server: api.lyhistory.com, request: "POST /hismin HTTP/1.1", upstream: "http://127.0.0.1:8085/hismin", host: "172.31.252.69"

# ps -ef|grep nginx
root     15690     1  0 Oct20 ?        00:00:00 nginx: master process /usr/local/nginx/sbin/nginx
nobody   15691 15690  0 Oct20 ?        00:00:00 nginx: worker process
nobody   15692 15690  0 Oct20 ?        00:00:00 nginx: worker process
nobody   15693 15690  0 Oct20 ?        00:00:00 nginx: worker process
nobody   15694 15690  0 Oct20 ?        00:00:00 nginx: worker process

发现master是root权限，worker是nobody，莫非是：
请求size=100的时候 master就可以搞定，1000的时候要拉worker过来干活结果发现没有权限
（从之前的请求可以看到response Content-Length: 317256, 317256/1024=309KB,肯定upstream返回的数据量是超过了nginx某些默认的缓冲区大小，所以要写入临时文件中）

实际proxy_temp nobody有权限
drwx------. 12 nobody root   96 Oct 21 15:08 proxy_temp

发现nobody没有/usr/local/nginx这个路径的权限
修复：chmod a+rx nginx

```

<disqus/>