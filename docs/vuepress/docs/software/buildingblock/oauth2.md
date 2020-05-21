
## 1. 基本场景
用户登录或认证授权有几个基本场景：
+ 普通登录： 
	用户+网站 
+ 单点登录sso：
	用户+企业各种网站+企业SSO服务器
+ 第三方登录3rd party：
	用户+各种网站+某企业提供的SSO服务（第三方登录）
+ 无普通用户，只有application级别用户，这种一般是系统集成，需要系统之间的身份验证

注意这里的“第三方”由角度不同产生不同的叫法，比如：
我是某个网站主，想要集成google登录，那么用户和我网站就是两方，google登录就是第三方登录提供商；
如果我是某个登录提供商，比如我开发了一个登录系统，提供给外部网站集成我的登录方式，那外部网站就是我的Client或者叫第三方应用，用户和我的登录服务器就是两方；
场景不同读者自行脑补切换；

以下oauth2.0就是围绕着这几个场景衍生出不同的规范

首先第一种普通登录采用传统的登录方式是，
用户直接登录某个网站网页，然后登录信息传到网站服务端，服务端验证授权，然后生成cookie和session，session保存在服务端，cookie则通过response的set cookie返回到用户浏览器，
cookie一般包含sessionid，后面的请求携带sessionid，则可以从服务端的session表查询到用户信息，一般这个都是比如asp或php框架实现的；
可见sessionid一般不包含任何额外的信息；

如果改造称为第二种单点登录，可以将session信息存到一个共享内存比如redis中，这样多个网站就可以通过读取redis来实现“单点登录”；

但是如果有第三方合作网站可能想用我们的网站登录功能就会比较麻烦，通过下面的oauth2.0分析我们就会反向推导中为什么我说会很麻烦。

下面开始讲解oath2.0；

## 2. oauth2.0 framework standard

协议： https://tools.ietf.org/html/rfc6749

协议安全： https://tools.ietf.org/html/rfc6819

基本概念：
+ Resource Owner：资源所有者。即用户。
	An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.
+ Client：客户端（第三方应用），代表资源所有者并且经过所有者授权去访问受保护的资源的应用程序，比如某个网站。
	An application making protected resource requests on behalf of the resource owner and with its authorization.  The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).
+ HTTP service：HTTP服务提供商，简称服务提供商。这里是用来指第三方登录如github或者Google。
+ User Agent：用户代理。本文中就是指浏览器。
+ Authorization server：授权（认证）服务器。即服务提供商专门用来处理认证的服务器，在成功验证资源所有者并获得授权后向客户端发出访问令牌。
	The server issuing access tokens to the client after successfully authenticating the resource owner and obtaining authorization.
+ Resource server：资源服务器，即服务提供商存放用户生成的资源的服务器。它与认证服务器，可以是同一台服务器，也可以是不同的服务器。
	The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
+ Access Token：访问令牌。使用合法的访问令牌获取受保护的资源，一般存储在User Agent浏览器端。
+ Refresh Token：用来更新获取Access Token，一般存储在服务器端（实际是指这里的Client第三方应用端）；

标准流程：
(A) The client requests authorization from the resource owner. 
	The authorization request can be made directly to the resource owner(as shown), or preferably indirectly via the authorization server as an intermediary.

(B) The client receives an authorization grant, which is a credential representing the resource owner's authorization, 
	expressed using one of four grant types defined in this specification or using an extension grant type. 
	The authorization grant type depends on the method used by the client to request authorization and the types supported by the authorization server.
	
(C) The client requests an access token by authenticating with the authorization server and presenting the authorization grant.

(D) The authorization server authenticates the client and validates the authorization grant, and if valid, issues an access token.

(E) The client requests the protected resource from the resource server and authenticates by presenting the access token.

(F) The resource server validates the access token, and if valid,serves the request.

根据**Authorization Grant**的方式授权类型分为四种：authorization code, implicit, resource owner password credentials, and client credentials

__An authorization grant is a credential representing the resource owner's authorization (to access its protected resources) used by the client to obtain an access token.__
__This specification defines four grant types -- authorization code, implicit, resource owner password credentials, and client credentials -- as well as an extensibility mechanism for defining additional types.__
   


### 2.1 授权码模式（authorization code）

	 +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)

   Note: The lines illustrating steps (A), (B), and (C) are broken into
   two parts as they pass through the user-agent.

                     Figure 3: Authorization Code Flow

(A)  客户端向资源所有者请求其授权
	授权请求可以直接对资源所有者进行，或者通过授权服务器作为中介进行间接访问（首选方案）。
	用户点击客户端网站的（第三方）登录按钮或者某个需要权限的操作：
	如果是直接点击第三方登录，客户端直接向授权服务器发起请求，如果是用户直接访问了某个资源，客户端会向资源服务器发起请求，然后资源服务器发现没有Access token，则会转发到授权服务器，
	总之授权服务器返回一个授权页面（如果用户已经登录了则返回一个授权页面，否则返回登录页面）；
	(A)The client initiates the flow by directing the resource owner's user-agent to the authorization endpoint.  
	The client includes its client identifier, requested scope, local state, and a redirection URI to which the authorization server will send the user-agent back once access is granted (or denied).

		
(B)  客户端收到资源所有者的授权许可(用户点击允许或同意按钮)，返回凭证-授权码Code，这个授权许可是一个代表资源所有者授权的凭据
	(B)The authorization server authenticates the resource owner (via the user-agent) and establishes whether the resource owner grants or denies the client's access request.
	
	(C)Assuming the resource owner grants access, the authorization server redirects the user-agent back to the client using the redirection URI provided earlier (in the request or during client registration).  
	The redirection URI includes an authorization code and any local state provided by the client earlier.
	注意这个redirect URI一般是对应Client应用的服务器端，当然对于授权服务器来说这个就是一次URL跳转回client的url，然后client的服务器端收到这个请求后，拿到授权码，然后就可以从服务器端发起下面步骤的请求；
	
(C)  客户端向授权服务器请求访问令牌，并出示授权许可-授权码code，请求访问令牌（access token）。
	如果客户端访问的是第三方登录，则一般需要同时出示client secret，如果是内部系统，可能只是通过写死的自签名cert验证即可；
	
	(D)The client requests an access token from the authorization server's token endpoint by including the authorization code received in the previous step.  
	When making the request, the client authenticates with the authorization server.  
	The client includes the redirection URI used to obtain the authorization code for verification.
		
(D)  授权服务器对客户端身份进行认证，并校验授权许可，如果都是有效的，则发放访问令牌access token
	这个是两部分：一个是对客户端本身的身份认证，通过前面client secret对应的id以及绑定的比如网站domain，如果是内部系统，则简单通过比如写死的加解密或者白名单即可；
	另一个部分是验证授权码，如果资源服务器和认证服务器分开，则此时需要交互，或者访问一个共同的缓存或数据库；
	
	(E)The authorization server authenticates the client, validates the authorization code, and ensures that the redirection URI received matches the URI used to redirect the client in step (C).  
	If valid, the authorization server responds back with an access token and, optionally, a refresh token.
	注意这里是说授权服务器“responds back”，不是redirect，应该就是服务器对服务器通信了，前两步client从服务器端接收到授权码后直接发起请求，所以此时第三方服务器端直接返回，
	client的服务器端收到响应后，**可以将access token发送给自己的客户端，然后将refresh token留存在服务端（安全性考虑）**
	
(E)  客户端向资源服务器请求受保护的资源，并出示访问令牌access token
	
(F)  资源服务器校验访问令牌，如果令牌有效，则提供服务
	如果资源服务器和认证服务器是分开的，则此时需要交互，或者访问一个共同的缓存或数据库，或者如果这个access token本身可以解密出用户的足够信息，则不需要交互；

设计思想：

为什么需要授权码，授权码是用户resource owner跟第三方登录网站的协商过程，不然第三方网站不知道这个行为本身是否得到了用户的授权，
你可能问为啥不直接给Access token呢，因为后面还需要验证这个网站即client id secret，当然如果都是公司内部网站或服务，不涉及三方，则不需要这一步，可以直接给Access token，即下面的Implicit方式

The authorization code is obtained by using an authorization server as an intermediary between the client and resource owner.  
Instead of requesting authorization directly from the resource owner, the client directs the resource owner to an authorization server (via its user-agent as defined in [RFC2616]), which in turn directs the resource owner back to the client with the authorization code.

Before directing the resource owner back to the client with the authorization code, the authorization server authenticates the resource owner and obtains authorization.  
Because the resource owner only authenticates with the authorization server, the resource owner's credentials are never shared with the client.

The authorization code provides a few important security benefits, such as the ability to authenticate the client, 
as well as the transmission of the access token directly to the client without passing it through the resource owner's user-agent and potentially exposing it to others, 
including the resource owner.	
		
**实例:github验证授权例子**

https://segmentfault.com/a/1190000013467122

1）网站和Github之间的协商，注册获取，Github也给我发了两张门票，一张门票叫做Client Id，另一张门票叫做Client Secret。

2）用户和Github(资源服务器）之间的协商

用户进入我的网站，点击github登录按钮的时候，我的网站会将Github给我的Client Id交给用户，让他进入Github授权界面，如果此时用户没有登录，Github会提示登录（当然这不是OAuth2.0客户端部分应该关注的）。假设用户已经登录Github，那么Github看到用户手中的门票，就知道是我的网站让他过来的，于是就把我的网站获取的权限摆出来，并询问用户是否允许网站获取这些权限。

```
// 用户登录 github，协商
GET //github.com/login/oauth/authorize
// 协商凭证
params = {
  client_id: "xxxx",
  redirect_uri: "http://my-website.com"
}

如果用户同意，在授权页面点击了确认授权后，页面会跳转到我预先设定的 redirect_uri并附带一个盖了章的门票code。

// 协商成功后带着盖了章的 code
Location: http://my-website.com?code=xxx

这个时候，用户和 Github 之间的协商就已经完成，Github 也会在自己的系统中记录这次协商，表示该用户已经允许在我的网站访问上直接操作和使用他的部分资源。
```

3）告诉Github(授权服务器）我的网站要来访问

第二步中，我们已经拿到了盖过章的门票code（资源服务器授权码），但这个code 只能表明，用户允许我的网站从github上获取该用户的数据，如果我直接拿这个code去github访问数据一定会被拒绝，因为任何人都可以持有code，github并不知道code持有方就是该网站“本人”。

还记得之前申请应用的时候github给我的两张门票么，Client Id在上一步中已经用过了，接下来轮到另一张门票Client Secret。

```
// 网站和 github 之间的协商
POST //github.com/login/oauth/access_token
// 协商凭证包括 github 给用户盖的章和 github 发给我的门票
params = {
  code: "xxx",
  client_id: "xxx",
  client_secret: "xxx",
  redirect_uri: "http://my-website.com"
}
拿着用户盖过章的code和能够标识个人身份的client_id、client_secret去拜访 github，拿到最后的绿卡access_token。
// 拿到最后的绿卡
response = {
  access_token: "e72e16c7e42f292c6912e7710c838347ae178b4a"
  scope: "user,gist"
  token_type: "bearer",
  refresh_token: "xxxx"
}
```
4）用户开始使用Github账号在我的网站上留言

```
// 访问用户数据
GET //api.github.com/user?access_token=e72e16c7e42f292c6912e7710c838347ae178b4a

get中直接用access token是一种方式，还有一种方式是放在header中作为bearer token；

上一步github已经把最后的绿卡access_token给我了，通过github提供的 API 加绿卡就能够访问用户的信息了，能获取用户的哪些权限在response 中也给了明确的说明，scope为user和gist，也就是只能获取user组和gist组两个小组的权限，user组中就包含了用户的名字和邮箱等信息了。

// 告诉我用户的名字和邮箱
response = {
  username: "barretlee",
  email: "barret.china@gmail.com"
}
```

**注意:**
+ 用户端只需要获得access token即可，refresh token需要由网站在服务器端保存，否则客户端不安全，这也是为什么access token比较短命的原因

+ 还有一个细节上面没有提到，就是资源服务器如何知道这个access token所对应的用户权限scope等等，这个在上面标准中并未提到，这个是涉及到具体实现,
首先access token通过密码的方式一般都会把用户id放入里面，资源服务器通过跟授权服务器事先配置或者设计好加解密方法，可以解密出user id，然后其他信息呢，一般有如下方式:
	- self-encoded access tokens： verifying the tokens can be done entirely in the resource server without interacting with a database or external servers.
	JSON Web Token (JWT) https://www.oauth.com/oauth2-servers/access-tokens/self-encoded-access-tokens/
	github貌似是从token直接解密出来相关scope和权限，具体看https://spring.io/guides/tutorials/spring-boot-oauth2/，
	- If your tokens are stored in a database, then verifying the token is simply a database lookup on the token table.
	- use the Token Introspection spec to build an API to verify access tokens
		这个可以放在单独的server或者直接扔到授权服务器上
		https://www.oauth.com/oauth2-servers/token-introspection-endpoint/

注意，spring security的oauth2.0貌似是采用了上面第三种方式，通过:
> Spring security oauth exposes two endpoints for checking tokens (/oauth/check_token and /oauth/token_key) which are by default protected behind denyAll(). tokenKeyAccess() and checkTokenAccess() methods open these endpoints for use.
> [Spring Boot 2 – OAuth2 Auth and Resource Server](https://howtodoinjava.com/spring-boot2/oauth2-auth-server/)

### 2.2 Implicit

	 +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier     +---------------+
     |         -+----(A)-- & Redirection URI --->|               |
     |  User-   |                                | Authorization |
     |  Agent  -|----(B)-- User authenticates -->|     Server    |
     |          |                                |               |
     |          |<---(C)--- Redirection URI ----<|               |
     |          |          with Access Token     +---------------+
     |          |            in Fragment
     |          |                                +---------------+
     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
     |          |          without Fragment      |     Client    |
     |          |                                |    Resource   |
     |     (F)  |<---(E)------- Script ---------<|               |
     |          |                                +---------------+
     +-|--------+
       |    |
      (A)  (G) Access Token
       |    |
       ^    v
     +---------+
     |         |
     |  Client |
     |         |
     +---------+

   Note: The lines illustrating steps (A) and (B) are broken into two
   parts as they pass through the user-agent.

                       Figure 4: Implicit Grant Flow

(A)  The client initiates the flow by directing the resource owner's user-agent to the authorization endpoint.  
The client includes its client identifier, requested scope, local state, and a redirection URI to which the authorization server will send the user-agent back once access is granted (or denied).

(B)  The authorization server authenticates the resource owner (via the user-agent) and establishes whether the resource owner grants or denies the client's access request.

(C)  Assuming the resource owner grants access, the authorization server redirects the user-agent back to the client using the redirection URI provided earlier.  
The redirection URI includes the access token in the URI fragment.

(D)  The user-agent follows the redirection instructions by making a request to the web-hosted client resource (which does not include the fragment per [RFC2616]).  
The user-agent retains the fragment information locally.
浏览器还会帮忙retain fragment information？这个需要继续了解，不过感觉到这步就结束了，后面三步不太明白为啥要写这么细，因为我想已经redirect到client这边了，client的服务器端自然会读取Access token，
然后set cookie，不清楚为什么后面三步要写的这么具体，还说要javascript来读取这个url的Access token， 我猜测是不是为了防止CSRF攻击，
最终在rfc6819#section-4.4.2找到答案,因为url的fragment就是#部分不会发送到服务器端，所以只能用前端脚本去解读出来！
> In the implicit grant type flow, the access token is directly returned to the client as a fragment part of the redirect URI.  
> It is assumed that the token is not sent to the redirect URI target, as **HTTP user agents do not send the fragment part of URIs to HTTP servers.**  
> Thus, an attacker cannot eavesdrop the access token on this communication path, and the token cannot leak through HTTP referrer headers.
> https://tools.ietf.org/html/rfc6819#section-4.4.2

> 浏览器的redirect_uri是一个不安全信道，此方式不适合于传递敏感数据（如access_token）。因为uri可能通过HTTP referrer被传递给其它恶意站点，也可能存在于浏览器cacher或log文件中，这就给攻击者盗取access_token带来了很多机会。另外，此协议也不应该假设RO用户代理的行为是可信赖的，因为RO的浏览器可能早已被攻击者植入了跨站脚本用来监听access_token。因此，access_token通过RO的用户代理传递给Client，会显著扩大access_token被泄露的风险。 但authorization_code可以通过redirect_uri方式来传递，是因为authorization_code并不像access_token一样敏感。即使authorization_code被泄露，攻击者也无法直接拿到access_token，因为拿authorization_code去交换access_token是需要验证Client的真实身份。也就是说，除了Client之外，其他人拿authorization_code是没有用的。 此外，access_token应该只颁发给Client使用，其他任何主体（包括RO）都不应该获取access_token。协议的设计应能保证Client是唯一有能力获取access_token的主体。引入authorization_code之后，便可以保证Client是access_token的唯一持有人。当然，Client也是唯一的有义务需要保护access_token不被泄露。
> http://dearcharles.cn/2017/11/15/OAuth2-0%E5%8D%8F%E8%AE%AE%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3/

(E)  The web-hosted client resource returns a web page (typically an HTML document with an embedded script) capable of accessing the full redirection URI including the fragment retained by the user-agent, 
and extracting the access token (and other parameters) contained in the fragment.

(F)  The user-agent executes the script provided by the web-hosted client resource locally, which extracts the access token.

(G)  The user-agent passes the access token to the client.

设计思想：

The implicit grant is a simplified authorization code flow optimized for clients implemented in a browser using a scripting language such as JavaScript.  
In the implicit flow, instead of issuing the client an authorization code, the client is issued an access token directly (as the result of the resource owner authorization).  
The grant type is implicit, as no intermediate credentials (such as an authorization code) are issued (and later used to obtain an access token).

When issuing an access token during the implicit grant flow, the authorization server does not authenticate the client.  
In some cases, the client identity can be verified via the redirection URI used to deliver the access token to the client.  
The access token may be exposed to the resource owner or other applications with access to the resource owner's user-agent.

Implicit grants improve the responsiveness and efficiency of some clients (such as a client implemented as an in-browser application),
since it reduces the number of round trips required to obtain an access token.  
However, this convenience should be weighed against the security implications of using implicit grants, such as those described in Sections 10.3 and 10.16, especially when the authorization code grant type is available.
   
### 2.3 Resource Owner Password Credentials

	 +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          v
          |    Resource Owner
         (A) Password Credentials
          |
          v
     +---------+                                  +---------------+
     |         |>--(B)---- Resource Owner ------->|               |
     |         |         Password Credentials     | Authorization |
     | Client  |                                  |     Server    |
     |         |<--(C)---- Access Token ---------<|               |
     |         |    (w/ Optional Refresh Token)   |               |
     +---------+                                  +---------------+

            Figure 5: Resource Owner Password Credentials Flow

(A)  The resource owner provides the client with its username and password.

(B)  The client requests an access token from the authorization server's token endpoint by including the credentials received from the resource owner.  
	When making the request, the client authenticates with the authorization server.

(C)  The authorization server authenticates the client and validates the resource owner credentials, and if valid, issues an access token.

场景：
+ 内部系统，用户直接向client提供用户名密码	
+ 外部系统application级别的验证访问，相当于前面提到的client id和client secret注册！

设计思想：

The resource owner password credentials (i.e., username and password) can be used directly as an authorization grant to obtain an access token.  
The credentials should only be used when there is a high degree of trust between the resource owner and the client 
(e.g., the client is part of the device operating system or a highly privileged application), 
and when other authorization grant types are not available (such as an authorization code).

Even though this grant type requires direct client access to the resource owner credentials, 
the resource owner credentials are used for a single request and are exchanged for an access token.  
This grant type can eliminate the need for the client to store the resource owner credentials for future use, by exchanging the credentials with a long-lived access token or refresh token.

### 2.4 Client Credentials

	 +---------+                                  +---------------+
     |         |                                  |               |
     |         |>--(A)- Client Authentication --->| Authorization |
     | Client  |                                  |     Server    |
     |         |<--(B)---- Access Token ---------<|               |
     |         |                                  |               |
     +---------+                                  +---------------+

                     Figure 6: Client Credentials Flow

(A)  The client authenticates with the authorization server and requests an access token from the token endpoint.

(B)  The authorization server authenticates the client, and if valid, issues an access token.

场景：
通常就是外部系统application级别的验证访问，相当于前面提到的client id和client secret注册！这种情况下比前一种“Resource Owner Password Credentials”更适合！

设计思想：
		
The client credentials (or other forms of client authentication) can be used as an authorization grant when the authorization scope is limited to the protected resources under the control of the client,
or to protected resources previously arranged with the authorization server.  
Client credentials are used as an authorization grant typically when the client is acting on its own behalf (the client is also the resource owner) or is requesting access to protected resources based on an authorization previously arranged with the authorization server.

## 3.Oauth2.0 implementation：

https://docs.spring.io/spring-security-oauth2-boot/docs/current/reference/htmlsingle/

https://www.oauth.com/oauth2-servers/the-resource-server/
Spring Boot OAuth 2.0 separating Authorization Service and Resource Service
https://medium.com/@buddhiprabhath/spring-boot-oauth-2-0-separating-authorization-service-and-resource-service-1641ebced1f0
https://github.com/buddhiprab/springboot-oauth2-separating-authorization_server-and-resource_server

https://github.com/Baeldung/spring-security-oauth
https://github.com/longfeizheng/sso-merryyou
https://github.com/fengcharly/spring-security-oauth2.0
https://github.com/lyhistory/oauth2-sso-demo