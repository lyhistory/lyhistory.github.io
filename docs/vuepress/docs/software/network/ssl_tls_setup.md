https secure http

wss secure socket

## SSL/TLS Certificate

refer to 《network.md/tls》

https / secure websocket

### 证书类型：

证书可以单纯只是包含ca认证的证书链（CA的签名）或自签名，以及公钥，也可以同时包含私钥，私钥当然可以独立于证书生成单独存储；

带密码：spring boot mvc程序，这样好处是双重保护，因为需要同时需要密码和私钥才可以

不带密码：ngnix，私钥或者是含有私钥的证书一定要控制读取权限

按照生成方式分为：

+ self-sgined certificate

```
sudo mkdir /etc/ssl/privatekey
sudo chmod 700 /etc/ssl/privatekey
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/privatekey/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```



+ let's encrypt

```
//自动化工具
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
./certbot-auto certonly --standalone -d  www.demoProject.com   # www.demoProject.com为你想要配置https的域名
ls /etc/letsencrypt/live/

//证书定时自动更新
crontab -e    #编辑crontab
30 2 * * 1 /root/certbot-auto renew --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx" >> /var/log/le-renew.log 2>&1 &
root/certbot-auto renew --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"

```

+ “购买”免费证书

  https://www.cztcms.cn/?p=826

+ dns解析提供商免费证书

  cloudflare dns over tls

  https://www.cloudflare.com/learning/dns/dns-over-tls/



### 工具：

keytool

openssl



## Products supporting https

### browser

浏览器自然是全面支持https的，不过不同浏览器的特性不同，比如

chrome是采用了操作系统本身的CA证书链，

而firefox是有完整自己的一套证书，所以对于渗透测试者来说，firefox是首选，因为不需要改变操作系统本身的证书，只需要安装给firefox本身就行了，当然firefox还有个特性是支持proxy，chrome还得装插件才行；

注意：如果是自签证书，浏览器会提示，可以手动信任，之后就可以正常访问，但是下面的js http client则不同

访问后端的时候需要注意cors也就是same origin的问题，比如reactjs项目本地测试默认开启nodejs服务：http://localhost:3000，这样访问后端服务，如果后端服务没有设置allow origin，因为后端服务端口一般不会刚好是3000，如果是其他端口，即使也是localhost服务，因为端口不同，不属于same origin，无法请求

### js http client

注意：跟上面不同的是，这里是没有用户交互的，而是js代码自动请求到后端，如果是自签证书，浏览器是不信任的，解决办法就是想办法手动从浏览器地址栏访问一次后端，然后手动加信任，之后应该就可以了，或者另外一种方式是

```
import axios from 'axios'
import https from 'https'
const result = await axios.post(
    `https://${url}/login`,
    body,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }
  )
```

这样会完全忽略证书验证，不太好，所以更好的方法是：

https://stackoverflow.com/questions/51363855/how-to-configure-axios-to-use-ssl-certificate

```
const httpsAgent = new https.Agent({ ca: MY_CA_BUNDLE });
```



### nginx

refer to 《buildingblock/nginx.md》

```

nginx.conf:
 server {
        listen       80;
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name  localhost;

        ssl_certificate /etc/ssl/certs/clear-selfsigned.crt;
        ssl_certificate_key /etc/ssl/privatekey/clear-selfsigned.key;
        ssl_dhparam /etc/ssl/certs/dhparam.pem;
```



### springboot mvc

首先MVC有自己的端口比如10001，内置的tomcat默认的http端口是8080，

所有请求到spring mvc这个后台的都是通过 http://IP:10001 过来的，然后内部再交由tomcat 8080端口处理，

如果设置https比如8443，如下：

```
yml：
#debug: true
server:
  servlet:
    context-path: /test
  port:
    10001
  ssl:
    key-store: tomcat.keystore
    key-store-password: 123456
    keyStoreType: JKS
    keyAlias: tomcat
    
@EnableAsync
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * http重定向到https
     * @return
     */
    @Bean
    public TomcatServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint constraint = new SecurityConstraint();
                constraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                constraint.addCollection(collection);
                context.addConstraint(constraint);
            }
        };
        //这里tomcat.getPort拿到的就是8080
        tomcat.addAdditionalTomcatConnectors(httpConnector(tomcat.getPort()));
        return tomcat;
    }

    @Bean
    public Connector httpConnector(int port) {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        //Connector监听的http的端口号
        connector.setPort(port);
        connector.setSecure(false);
        //监听到http的端口号后转向到的https的端口号
        connector.setRedirectPort(8443);
        return connector;
    }
}

```

注意到上面server本身就监听10001（应该是内置tomcat监听），然后为了https，需要创建tomcatfatory又出现一个http端口8080，为什么不可以直接扩展或override postProcessContext方法，可能是跟整个spring mvc的生命周期启动过程相关：

https://zhuanlan.zhihu.com/p/81807865

### netty

https://blog.csdn.net/invadersf/article/details/80337380



## Basic model: client-server

这里的client就是浏览器或手机端，

这里的server指的是前后端代码集成一起的后端服务，

比较直白，只有两方参与，浏览器不需要什么设置，后端服务如果是self host则需要其本身实现https，比如spring mvc，如果不是self host，而是host在比如nginx或iis中，则需要对nginx或iis配置https支持即可；



## Complicated model: separated frontend/backend前后端分离

举例前后端分离项目：
1.(user interact ) browser request nginx for frontend resource 
create self-signed cert and config nignx, so browser will talk to nginx through https (unsafe warning will be alert as it's self signed)

2.(no user interact) js codes will make http call to backend service to retrieve data through nginx, nginx forward http request to backend service
backend service has to implement and support https, and nginx also have to act as a https client to handshake with mgr

3.(no user interact) js codes will connect to websocket server directly

假设前端项目用的是create-reactjs-app脚手架，npm run start会开启一个nodejs服务，如下

![](/docs/docs_image/software/network/local_env01.png)

这种情况下显然是不可行的，首先：

1.默认情况下，origin是https://127.0.0.1:3000，axios http client请求的host是 https://127.0.0.1:10001 ，会被same origin policy阻挡，

注意如果是`<img src=https://127.0.0.1:3000/verifycode` 这种图片src的验证码是不会被block住的，因为img link script等标签不会受制于same origin policy

2.浏览器用户互动的部分请求到的host是nodejs，而非用户互动的axios请求到的host是spring mvc，因为开发环境肯定都是自签证书，即使给nodejs设置好了自签证书，浏览器第一次会提醒用户不安全，用户选择继续访问后浏览器则记住该证书，但是axios请求的是spring mvc程序的证书，跟nodejs一般是不同的，这种情况下就会有问题

1的一个解决办法是通过设置chrome浏览器，允许其跨域： https://segmentfault.com/a/1190000021711445

2的一个解决方法是nodejs跟spring mvc用相同的证书，或者手动给浏览器安装证书：https://qastack.cn/superuser/27268/how-do-i-disable-the-warning-chrome-gives-if-a-security-certificate-is-not-trusted

但是其实更完美的解决方法是加一个nginx，nginx作为proxy转发两者的流量到nodejs和springmvc，这样浏览器本身和其中的js代码axios http client只需要跟nginx进行handshake即可，参考下面这张图：

![](/docs/docs_image/software/network/local_env02.png)

而最终部署到服务器上则会简化，因为就不需要nodejs开发环境了：

![](/docs/docs_image/software/network/product_env.png)