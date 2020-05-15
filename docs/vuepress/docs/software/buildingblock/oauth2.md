
首先传统的登录方式是，用户之间在某个网站网页登录，然后登录信息传到网站服务端，服务端验证授权，然后生成cookie和session，session保存在服务端，cookie则通过response的set cookie返回到用户浏览器，
cookie一般包含sessionid，后面的请求携带sessionid，则可以从服务端的session表查询到用户信息，一般这个都是比如asp或php框架实现的；
可见sessionid一般不包含任何额外的信息，所以如果有第三方合作网站可能想用我们的网站登录功能就会比较麻烦，通过下面的oauth2.0分析我们就会反向推导中为什么我说会很麻烦，
下面开始讲解oath2.0；

oauth2.0 framework standard
https://tools.ietf.org/html/rfc6749

https://docs.spring.io/spring-security-oauth2-boot/docs/current/reference/htmlsingle/

https://www.cnblogs.com/cjsblog/p/9174797.html



    resource owner（资源所有者）
    resource server（资源服务器）
    client（客户端）：代表资源所有者并且经过所有者授权去访问受保护的资源的应用程序
    authorization server（授权服务器）：在成功验证资源所有者并获得授权后向客户端发出访问令牌


    Resource Owner：资源所有者。即用户。
    Client：客户端（第三方应用）。如云冲印。
    HTTP service：HTTP服务提供商，简称服务提供商。如上文提到的github或者Google。
    User Agent：用户代理。本文中就是指浏览器。
    Authorization server：授权（认证）服务器。即服务提供商专门用来处理认证的服务器。
    Resource server：资源服务器，即服务提供商存放用户生成的资源的服务器。它与认证服务器，可以是同一台服务器，也可以是不同的服务器。
    Access Token：访问令牌。使用合法的访问令牌获取受保护的资源。


    （A）客户端向资源所有者请求授权。授权请求可以直接对资源所有者(如图所示)进行，或者通过授权服务器作为中介进行间接访问（首选方案）。
    （B）资源所有者允许授权，并返回凭证（如code）。
    （C）客户端通过授权服务器进行身份验证，并提供授权凭证（如code），请求访问令牌（access token）。
    （D）授权服务器对客户端进行身份验证，并验证授权凭证，如果有效，则发出访问令牌。
    （E）客户端向资源服务器请求受保护的资源，并通过提供访问令牌来进行身份验证。
    （F）资源服务器验证访问令牌，如果正确则返回受保护资源。


授权类型有四种：authorization code, implicit, resource owner password credentials, and client credentials

+ 授权码模式（authorization code）


    (A)  客户端向资源所有者请求其授权
    (B)  客户端收到资源所有者的授权许可，这个授权许可是一个代表资源所有者授权的凭据
    (C)  客户端向授权服务器请求访问令牌，并出示授权许可
    (D)  授权服务器对客户端身份进行认证，并校验授权许可，如果都是有效的，则发放访问令牌
    (E)  客户端向资源服务器请求受保护的资源，并出示访问令牌
    (F)  资源服务器校验访问令牌，如果令牌有效，则提供服务




github验证授权例子 https://segmentfault.com/a/1190000013467122

完整的过程：

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
**注意，用户端只需要获得access token即可，refresh token需要由网站在服务器端保存，否则客户端不安全，这也是为什么access token比较短命的原因

还有一个细节上面没有提到，就是资源服务器如何知道这个access token所对应的用户权限scope等等，这个在上面标准中并未提到，这个是涉及到具体实现，
github貌似是从token直接解密出来相关scope和权限，具体看https://spring.io/guides/tutorials/spring-boot-oauth2/，

首先access token通过密码的方式一般都会把用户id放入里面，资源服务器通过跟授权服务器事先配置或者设计好加解密方法，可以解密出user id，然后其他信息呢，一般有如下方式：
+ self-encoded access tokens： verifying the tokens can be done entirely in the resource server without interacting with a database or external servers.
 JSON Web Token (JWT)
https://www.oauth.com/oauth2-servers/access-tokens/self-encoded-access-tokens/
+ If your tokens are stored in a database, then verifying the token is simply a database lookup on the token table.
+ use the Token Introspection spec to build an API to verify access tokens
可以放在单独的server或者直接扔到授权服务器上
https://www.oauth.com/oauth2-servers/token-introspection-endpoint/

https://www.oauth.com/oauth2-servers/the-resource-server/

注意，spring security的oauth2.0貌似是采用了上面第三种方式，通过:
> Spring security oauth exposes two endpoints for checking tokens (/oauth/check_token and /oauth/token_key) which are by default protected behind denyAll(). tokenKeyAccess() and checkTokenAccess() methods open these endpoints for use.
> [Spring Boot 2 – OAuth2 Auth and Resource Server](https://howtodoinjava.com/spring-boot2/oauth2-auth-server/)

implementation：
Spring Boot OAuth 2.0 separating Authorization Service and Resource Service
https://medium.com/@buddhiprabhath/spring-boot-oauth-2-0-separating-authorization-service-and-resource-service-1641ebced1f0
https://github.com/buddhiprab/springboot-oauth2-separating-authorization_server-and-resource_server

https://github.com/Baeldung/spring-security-oauth
https://github.com/longfeizheng/sso-merryyou
https://github.com/fengcharly/spring-security-oauth2.0
https://github.com/lyhistory/oauth2-sso-demo