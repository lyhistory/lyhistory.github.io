https://writesonic.com/chat?ref=producthunt

https://community.modelscope.cn/63ca5f30406cc1159771878f.html


v2ray:
http://git.io/v2ray.sh



```
server {
	listen       80;
    #listen 443 http2 ssl;
    #listen [::]:443 http2 ssl;

    #server_name server_IP_address;

    #ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    #ssl_certificate_key /etc/ssl/privatekey/nginx-selfsigned.key;
    #ssl_dhparam /etc/ssl/certs/dhparam.pem;

    location / {
        add_header Content-Type text/html;

        return 200 '<html><body>Hello World</body></html>';
    }

    location /chatbot {
        proxy_pass http://my_app_upstream;
        proxy_set_header Host $http_host;
    }
}


https://stackoverflow.com/questions/5834025/how-to-preserve-request-url-with-nginx-proxy-pass
https://serverfault.com/questions/1113782/using-nginx-as-a-forward-proxy-in-a-relay-server-for-v2ray-connection
```
curl --header "Host: google.com" http://shiyela.com/

https://www.4spaces.org/1073.html

```
inbound
"inbounds":[
         {
             "listen": "127.0.0.1",
             "port": 1081,
             "protocol": "http",
             "tag": "chatbot"
         }   
     ],

outbound

"type": "field",
        "outboundTag": "direct",
        "domain": [
            "domain:chatgpt.com"
        ]
rules
{
  "type": "field",
  "domain": [
    "baidu.com",
    "qq.com",
    "geosite:cn"
  ],
  "inboundTag": [
    "chatbot"
  ],
  "outboundTag": "direct",
  "balancerTag": "balancer"
}
```

enableHttp2
https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html