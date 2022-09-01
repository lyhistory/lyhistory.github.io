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
| ssl/hrs.asiapacificex.com:443     | 0       | -            | 0      | [2](https://netlog-viewer.appspot.com/#events&q=id:1208111,1208329) | 0            | stopped      | false   |



| 172.16.101.100:8080 (http_proxy_socket_pool) |         |              |        |                                                             |              |              |         |
| -------------------------------------------- | ------- | ------------ | ------ | ----------------------------------------------------------- | ------------ | ------------ | ------- |
| Name                                         | Pending | Top Priority | Active | Idle                                                        | Connect Jobs | Backup Timer | Stalled |
| pm/ssl/sdk.split.io:443                      | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1203134) | 0            | stopped      | false   |
| ssl/d27xxe7juh1us6.cloudfront.net:443        | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1205602) | 0            | stopped      | false   |
| ssl/www.xxx.com:443                          | 0       | -            | 0      | [1](https://netlog-viewer.appspot.com/#events&q=id:1208691) | 0            | stopped      | false   |
| ssl/www.google.com:443                       | 0       | -            | 1      | 0                                                           | 0            | stopped      | false   |

可以看到，dev.xxx.com是直接访问的，而www.xxx.com是通过proxy，所以是不是因为这个proxy的原因

#### 问题梳理

首先，chrome使用了机器本身设定的proxy，我是公司电脑，连vpn访问网站会经过默认的proxy server，就是前面的172.16.101.100，

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

### websocket connection issue

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

第一次尝试：
mv /usr/lib64/libfreetype.so.6 /usr/lib64/libfreetype.so.6_renamed

2022-06-17 19:50:55.845 ERROR 26353GG [io-10001-exec-2] c.q.f.w.a.CommonExceptionHandler : InternalException: Handler dispatch failed; nested exception is java.lang.UnsatisfiedLinkError: /apex/apps/clearing/3rd-party/openjdk-8u312-b07/jre/lib/amd64/libfontmanager.so: libfreetype.so.6: cannot open shared object file: No such file or directory

org.springframework.web.util.NestedServletException: Handler dispatch failed; nested exception is java.lang.UnsatisfiedLinkError: /apex/apps/clearing/3rd-party/openjdk-8u312-b07/jre/lib/amd64/libfontmanager.so: libfreetype.so.6: cannot open shared object file: No such file or directory
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


<disqus/>