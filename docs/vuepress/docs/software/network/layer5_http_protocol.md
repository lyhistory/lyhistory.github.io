---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

http protocol http协议
https://developer.mozilla.org/en-US/docs/Web/HTTP/Connection_management_in_HTTP_1.x
Short-lived connections
=>Persistent connections(http 1.1默认）
=>HTTP pipelining(http2)


## Basic

chrome/network right click -> header options->protocol，可以看到http/1.1

### headers

#### 基础类型

**End-to-End headers:**

**Hop-by-hop headers:**

比如：

client->reverse proxy (e.g. nginx)->proxied server(e.g spring mvc/netty rpc)，

client到proxied server是end to end，而client和proxy以及，proxy和proxied server之间是跳到跳

````
 For the purpose of defining the behavior of caches and non-caching
   proxies, we divide HTTP headers into two categories:

      - End-to-end headers, which are  transmitted to the ultimate
        recipient of a request or response. End-to-end headers in
        responses MUST be stored as part of a cache entry and MUST be
        transmitted in any response formed from a cache entry.

      - Hop-by-hop headers, which are meaningful only for a single
        transport-level connection, and are not stored by caches or
        forwarded by proxies.

   The following HTTP/1.1 headers are hop-by-hop headers:

      - Connection
      - Keep-Alive
      - Proxy-Authenticate
      - Proxy-Authorization
      - TE
      - Trailers
      - Transfer-Encoding
      - Upgrade

````
#### header->X-Redirect-By

#### header->Link
[Adding CSS to a Page via HTTP Headers](https://www.impressivewebs.com/adding-css-to-a-page-via-http-headers/)

#### security - CORS

Exceptional Cases:
Firebase uses a fully-permissive cross-origin resource sharing (CORS) policy, meaning that you can make requests to the Firebase servers from any origin. This is possible because Firebase does not use cookies or traditional sessions to govern which requests are authorized and which are not.
[What is Firebase's cross-domain policy?](https://stackoverflow.com/questions/19486655/what-is-firebases-cross-domain-policy)

### methods

get post put option head preflight

**HTTP CONNECT method**
The most common form of HTTP tunneling is the standardized HTTP CONNECT method. In this mechanism, the client asks an HTTP proxy server to forward the TCP connection to the desired destination. The server then proceeds to make the connection on behalf of the client. Once the connection has been established by the server, the proxy server continues to proxy the TCP stream to and from the client. Only the initial connection request is HTTP - after that, the server simply proxies the established TCP connection. 

This mechanism is how a client behind an HTTP proxy can access websites using SSL or TLS (i.e. HTTPS). Proxy servers may also limit connections by only allowing connections to the default HTTPS port 443, whitelisting hosts, or blocking traffic which doesn't appear to be SSL.


### clients

jQuery.get is a wrapper for jQuery.ajax, which is a wrapper to XMLHttpRequest.
XMLHttpRequest and Fetch API (experimental at this time) are the only in DOM, so should be the fastest.

+ XMLHttpRequest 
  is the raw browser object that jQuery wraps into a more usable and simplified form and cross browser consistent functionality.

+ fetch
  fetch() allows you to make network requests similar to XMLHttpRequest (XHR). The main difference is that the Fetch API uses Promises, which enables a simpler and cleaner API, avoiding callback hell and having to remember the complex API of XMLHttpRequest.
  ```
  fetch('./api/some.json')
    .then(
    function(response) {
        if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status);
        return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
        console.log(data);
        });
    }
    )
    .catch(function(err) {
    console.log('Fetch Error :-S', err);
    });
  ```
+ jQuery.ajax 
  is a general Ajax requester in jQuery that can do any type and content requests.

+ jQuery.get and jQuery.post 
  on the other hand can only issue GET and POST requests. If you don't know what these are, you should check HTTP protocol and learn a little. Internally these two functions use jQuery.ajax but they use particular settings that you don't have to set yourself thus simplifying GET or POST request compared to using jQuery.ajax. GET and POST being the most used HTTP methods anyway (compared to DELETE, PUT, HEAD or even other seldom used exotics).

## websocket

**socket vs websocket:**
Even though they achieve (in general) similar things, yes, they are really different. WebSockets typically run from browsers connecting to Application Server over a protocol similar to HTTP that runs over TCP/IP. So they are primarily for Web Applications that require a permanent connection to its server. On the other hand, plain sockets are more powerful and generic. They run over TCP/IP but they are not restricted to browsers or HTTP protocol. They could be used to implement any kind of communication.

To turn a connection between a client and server from HTTP/1.1 into WebSocket, the [protocol switch](https://tools.ietf.org/html/rfc2616#section-14.42) mechanism available in HTTP/1.1 is used.

protocol switch 是要在http头部加上 "Upgrade"，但是这个header是跳对跳的，所以client-server没有问题，但是如果中间是带有proxy的，比如：

(client->forward proxy)->remote server

client->(reverse proxy->proxied server)

正向代理（对remote隐藏客户端）的情况下，client还可以通过使用http connect方法解决这个问题，因为client知道remote server，With forward proxying, clients may use the `CONNECT` method to circumvent this issue. 

但是这个方法无法在反向代理（对client隐藏proxied server）情况下使用，因为client只知道reverse proxy的存在，proxied server对其不可见  This does not work with reverse proxying however, since clients are not aware of any proxy servers, and special processing on a proxy server is required.

反向代理下，解决办法就是需要reverse proxy server本身要实现一种机制，可以让其设置这个Upgrade header，比如对于nginx来说：
Since version 1.3.13, nginx implements special mode of operation that allows setting up a tunnel between a client and proxied server if the proxied server returned a response with the code 101 (Switching Protocols), and the client asked for a protocol switch via the “Upgrade” header in a request，因为Upgrade header是跳到跳的，所以nginx需要设置如下

```
location /chat/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
 
```

举例，

### 客户端和服务端直连（注意如果使用浏览器测试，有可能浏览器默认采用系统proxy，未必是直连）

注意本地测试在brave浏览器下目前有问题，还是用chrome测试

https://community.brave.com/t/throw-unknown-reason-error-while-using-local-custom-domain-name-to-test-websocket/202155/2

nginx配置：

```
server {
		listen       80;
        server_name  test.local;
		
		location / {
			alias "C:/Workspace/test/";
		}
	}
```



client端代码：

```
index.html: 放在"C:/Workspace/test/"下

<!DOCTYPE html>
<script>

let socket = new WebSocket("ws://127.0.0.1:8089");

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
  socket.send("My name is LiuYue");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};
</script>
```

服务端代码：

```
// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(8089);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
      connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

npm install http
npm install websocket
node index.js
```

访问 

http://test.local

请求和响应：

```

Request:
GET ws://127.0.0.1:8089/ HTTP/1.1
Host: 127.0.0.1:8089
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36
Upgrade: websocket
Origin: http://test.local
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Sec-WebSocket-Key: 71Dt2w4d4cxOmBCOT9taTg==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits


Response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: QOGonnA91h4HMkaOCKTaNl7u1ac=
Origin: http://test.local

```



### 客户端通过nginx连服务端

nginx配置：

```
location /ws {
			proxy_pass http://127.0.0.1:8089;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection "Upgrade";
		}
```



client端代码：

```
let socket = new WebSocket("ws://127.0.0.1:8089");
改为
let socket = new WebSocket("ws://test.local/ws");
```

再来看请求和响应(可以看到返回里面的服务端信息nginx)：

```
Request:
GET ws://test.local/ws HTTP/1.1
Host: test.local
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36
Upgrade: websocket
Origin: http://test.local
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Sec-WebSocket-Key: n6GlfYzgjkKTEZ4xqG4ikw==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits

Response:
HTTP/1.1 101 Switching Protocols
Server: nginx/1.17.6
Date: Fri, 05 Feb 2021 08:35:29 GMT
Connection: upgrade
Upgrade: websocket
Sec-WebSocket-Accept: wE4LVzK8tjX9oOIt3bfOwNWA7+s=
Origin: http://test.local
```



测试websocket：

```
curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: example.com:80" \
     --header "Origin: http://example.com:80" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     http://example.com:80/
```


## http proxy

Web servers and web browsers need to communicate with each other. HTTP/S, or HyperText Transfer Protocol (Secure), serves as a means of retrieving desired information that lives on the web in specific scripting languages such as HTML and CSS. HTTP/HTTPS helps people connect with browsers in order to collect target data from certain browsers. This may include: Written text/Visuals/Videos/Web pages /Geolocation / Geospatial data,

Each individual request is individual, meaning that a new session is initiated on a per-case basis. HTTP/HTTPS proxies are purpose-built to serve as an intermediary between HTTP/HTTPS-based browsers, and the requesting party. As with other proxy-based tools, HTTP/HTTPS is meant to provide entities that are looking to collect information an extra layer of anonymity and protection.

HTTP proxies can be customized based on a business’s unique requirements. One major HTTP use case is ‘content caching’. What this essentially means is that it enables a reduction in pressure on servers from clients that are requesting the same information on a regular basis (this can be an entire website or specific web pages, for example). It makes the previously retrieved version available locally without creating a new server connection. This works especially well for international Content Distribution/Delivery Networks (CDNs). 

HTTP proxies can also serve as a form of “digital bouncer”, deciding which requesters and data packets receive entry to your server/database and which are given the boot. In this context, HTTP proxies are used for network security, especially when internal company networks are connected to the internet, which can increase the possibility of external malicious cyber-threats. 

HTTP proxies are also uniquely positioned in a way that can be conducive to better data collection by increasing success rates. HTTP proxies can accomplish this by adapting headers on an as-needed basis to match target site criteria. This may include criteria such as:

HTTP header User-Agent, e.g., Microsoft Edge: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393
HTTP header Accept-Language, e.g., FR- (French)

https://banzaicloud.com/blog/http-proxy-in-the-cloud-native-world/

## socks/socks5 proxy

SOCKS, otherwise known as SOCKet Secure, is similar to HTTP/HTTPS protocols in that they are used in order to connect “clients” with a third-party site, serving as a buffer and a tunnel of sorts through which requests can be safely routed. 

The key difference between HTTP/HTTPS and SOCKS protocols lies in the fact that SOCKS was built with the capability of being able to service requests that require high volumes of traffic. This may include things such as:

+ Load balancing
+ Peer-to-Peer activities
+ Music/video/data streaming
SOCKS empowers the user to circumvent geolocation-based restrictions, while maintaining complete anonymity. It also employs Transmission Control Protocol (TCP), which establishes a more stable/secure mode of connection, and delivery over networks. It uses the data equivalent of a “zip file” so that it can transmit a group of data points, related title tags, and other information that is crucial to processing and analyzing the information in question. It also uses end-to-end encryption, ensuring that only the requesting party can download and decipher the data parcel in question. It is also especially useful when attempting to access hard-to-reach open-source data that is being hidden or cordoned-off behind digital boundaries such as firewalls. 


What differentiates ‘SOCKS5’ from ‘SOCKS’?
SOCKS is categorized as a layer 5 protocol, meaning that it can only be used to tunnel protocols that are running on and above “layer 5” in the Open Systems Interconnection (OSI) model. The implications of this include the ability to take care of requests of the following varieties:

+ HTTP
+ HTTPS
+ POP3
+ SMTP
+ FTP
This is chiefly due to the fact that it operates at layer 5 – somewhere between SSL (layer 7) and TCP/UDP (layer 4). 

In an attempt to help dispel common confusion, one needs to know that SOCKS currently exist in 2 main formats:

SOCKS4: On the authentication level, SOCKS4 is not conducive to tasks requiring authentication, while SOCKS5 is purpose-built to handle a diverse assortment of authentication methods.
SOCKS5: SOCKS5 supports User Datagram Protocol (UDP) proxies, while SOCKS4 does not. 
To clarify: UDPs are useful when transferring ‘messages’ or ‘Datagrams’ without having to use handshakes, error checks, or flow controls. This means that it is conducive for low-latency / fast data transfers. But it also has its drawbacks, namely UDP cannot check for ordering/error functionalities meaning it is great when speed, and not error-checking is the main priority.  Additionally, UDP operates as part of its protocol, for a time in ‘connectionless mode’, a sort of ‘lawless’ state of being which can sometimes expose systems/activities to exploitation. 

Lastly, SOCKS5 is considered to establish a more secure connection as it does so using TCP authentication while employing a fully encrypted Secure Shell (SSH) tunneling methodology.

https://brightdata.com/blog/leadership/socks5-proxy-vs-http-proxy

## http3 Over QUIC(UDP)
[HTTP3为什么抛弃了经典的TCP，转而拥抱 QUIC 呢](https://mp.weixin.qq.com/s/HVNYiX9uNgUhp1u8PSBgIg)

## Learn:

http proxy转socks proxy: https://github.com/Equim-chan/h2s

记录一次面试中的HTTP请求相关问题 https://www.cnblogs.com/daisygogogo/p/10741597.html

HTTP/3: Everything you need to know about the next-generation web protocol
https://portswigger.net/daily-swig/http-3-everything-you-need-to-know-about-the-next-generation-web-protocol

<disqus/>