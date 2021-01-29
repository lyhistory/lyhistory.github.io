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

举例，client端发起：

```
Request:
GET ws://10.136.100.45/websocket HTTP/1.1
Host: 10.136.100.45
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Origin: http://10.136.100.45
Sec-WebSocket-Version: 13
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Sec-GPC: 1
Sec-WebSocket-Key: rlNWZDD4jGOrhYjTYv5UEA==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits

Response:
HTTP/1.1 101 Switching Protocols
Server: nginx/1.16.1
Date: Fri, 29 Jan 2021 06:17:07 GMT
Connection: upgrade
upgrade: websocket
sec-websocket-accept: l+0+vEsZvDECt5AGda7vPI3BwME=

```







