---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

http协议
https://developer.mozilla.org/en-US/docs/Web/HTTP/Connection_management_in_HTTP_1.x
Short-lived connections
=>Persistent connections(http 1.1默认）
=>HTTP pipelining(http2)


## Basic

chrome/network right click -> header options->protocol，可以看到http/1.1

### headers

**Hop-by-hop headers**

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



### methods

get post put option head preflight

**HTTP CONNECT method**
The most common form of HTTP tunneling is the standardized HTTP CONNECT method. In this mechanism, the client asks an HTTP proxy server to forward the TCP connection to the desired destination. The server then proceeds to make the connection on behalf of the client. Once the connection has been established by the server, the proxy server continues to proxy the TCP stream to and from the client. Only the initial connection request is HTTP - after that, the server simply proxies the established TCP connection. 

This mechanism is how a client behind an HTTP proxy can access websites using SSL or TLS (i.e. HTTPS). Proxy servers may also limit connections by only allowing connections to the default HTTPS port 443, whitelisting hosts, or blocking traffic which doesn't appear to be SSL.



## websocket

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



## refer:

记录一次面试中的HTTP请求相关问题 https://www.cnblogs.com/daisygogogo/p/10741597.html


<disqus/>