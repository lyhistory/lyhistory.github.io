
## OAuth2 using DotNetOpenAuth

Start by Example of Communication through RSA

 Client/Hacker1: HI
 Server/Hacker2: Hi,I am server,( server send digital certificate)
 Client: (Action:Validate the certificate and got the public key[2048Bits],confirmed and then send random string *** to Server,Hacker2 failed)
 //Hacker1: (Action: send a simple string to server like 123456)
 Server: (Action: Calculated hash of the string,encrypt with private key, send message to Client/Hacker1)
 Client: (Action: decrypt message with public key and equal to hash(***), confirmed, Hacker1 failed)
 {ok, let's communicate with my Symmetric-key algorithm.}
 (Send the algorithm and key encrypt with public key)
 Server: &lt;Symmetric-key&amp;algorithm&gt;{Ok,what I can do for you}
 Client: &lt;Symmetric-key&amp;algorithm&gt;{I wanna check my bank balance}
 ..................
 上面描述了HTTPS通信握手的过程，简短描述就是：
 1.浏览器发出https请求
 2.服务器回应发送包含公钥的证书（由CA颁发）
 3.浏览器生成随机密钥，并用公钥加密，发送给服务器
 4.服务器用私钥解密获取随机密钥
Browser connects to a web server (website) secured with SSL (https). Browser requests that the server identify itself.
Server sends a copy of its SSL Certificate, including the server’s public key.
Browser checks the certificate root against a list of trusted CAs and that the certificate is unexpired, unrevoked, and that its common name is valid for the website that it is connecting to. If the browser trusts the certificate, it creates, encrypts, and sends back a symmetric session key using the server’s public key.
Server decrypts the symmetric session key using its private key and sends back an acknowledgement encrypted with the session key to start the encrypted session.
Server and Browser now encrypt all transmitted data with the session key.
OAUTH2 flow

![](/docs/docs_image/software/programming/auth01.png)

What Is SSL (Secure Sockets Layer) and What Are SSL Certificates?
https://www.digicert.com/ssl.htm

### 1.1 install certificates
open visual studio developer command prompt, and run command
makecert.exe -sr LocalMachine -ss My -a sha1 -n CN=AuthSrv -sky exchange -pe
makecert.exe -sr LocalMachine -ss My -a sha1 -n CN=ResSrv -sky exchange -pe

Attention:
here this two digital certification is not for https or SSL, is only for OAuth2 token encryption,
for https https://sg.godaddy.com/help/request-an-ssl-certificate-562
relation between Oauth2 and https:
Security considerations

The OAuth2 protocol does not guarantee confidentiality and integrity of communications. That means you must protect HTTP communications using an additional layer. One possible solution is the usage of SSL/TLS (HTTPS) to encrypt the communication channel from the client to the server.
The first version of OAuth (OAuth1) supported an authentication mechanism based on the HMAC algorithm to guarantee confidentiality and integrity; OAuth2 does not (although a Draft proposal exists to support MAC tokens). The lack of message hashing is the primary concern raised regarding the security of OAuth2, and the one most developers complain about (e.g. this blog post by Eran Hammer, the ex-lead of the OAuth specifications).
In a nutshell, always use HTTPS for OAuth2, as it's the only way to guarantee message confidentiality and integrity with this protocol!

![](/docs/docs_image/software/programming/auth02.png)

### 1.2.grant full control of certificates to iis_iusrs

![](/docs/docs_image/software/programming/auth03.png)

then right click, select All Tasks/Manage Private Keys/Add/Advanced/Find Now,select IIS_IUSRS(if you can not find,look up and confirm your Locations, make sure it's under your own PC)
Be aware, this is to demonstrate oauth2 on iis, in practice, Auth Server holds Auth Key pair(public&private key)+ResSrv(public key), Res Server holds Res Key pair(public&private key)+AuthSrv(public key), that's
make it RSA, but actually this two server don't communicate with each other directly, Client will request access token from Auth Server, and then send request to Resource Server,Resource Server decrypt user info by authsrv public key.

assumption : user agent(browser), client web site cl.com and Client app, oauth server web site srv.com, api web site: api.com,in this scenario,api web site is actually the resource server
user visit client site and  oauth login on srv.com, client site server can get access api site to retrieve data
oauth server code:
```
oauth2.class
[CustomizeAuthorize, HttpGet]
[HttpHeader("X-Frame-Options", "SAMEORIGIN")]
public ActionResult Index(){//Authorize Page 授权页面
var pendingRequest = AuthorizationServer.ReadAuthorizationRequest(); //generate Code
pendingRequest.ExtraData["User"] = this.User.Identity.Name;
if (((OAuthServerHost)this.authorizationServer.AuthorizationServerServices).CanBeAutoApproved(pendingRequest))
{
var approval = this.authorizationServer.PrepareApproveAuthorizationRequest(pendingRequest, this.User.Identity.Name);
var response = this.authorizationServer.Channel.PrepareResponse(approval);
return response.AsActionResult();
}
var client = DB.Instance.GetClient(pendingRequest.ClientIdentifier);
var model = new OAuthViewModel
{
AppKey = pendingRequest.ClientIdentifier,
AppName = client.Name,
Scope = pendingRequest.Scope,
ResponseType = pendingRequest.ResponseType == EndUserAuthorizationResponseType.AccessToken ? "token" : "code",
Redirect = pendingRequest.Callback.AbsoluteUri,
State = pendingRequest.ClientState
};
return View(model);
}
[CustomAuthorize, HttpPost]

public ActionResult Index(bool approve)
{
var pendingRequest = this.authorizationServer.ReadAuthorizationRequest(); //will use Code and models
IProtocolMessage responseMessage = null;
if (approve)
{
DB.Instance.AddAuthorization(new ClientAuthorization
{
ClientIdentifier = pendingRequest.ClientIdentifier,
Scope = pendingRequest.Scope,
OpenId = this.User.Identity.Name,
IssueDate = DateTime.UtcNow
});
responseMessage = this.authorizationServer.PrepareApproveAuthorizationRequest(pendingRequest, this.User.Identity.Name, pendingRequest.Scope); // change response to 302 redirect,redirect url is in pendingRequest
}
else
{
responseMessage = this.authorizationServer.PrepareRejectAuthorizationRequest(pendingRequest);
}
var response = this.authorizationServer.Channel.PrepareResponse(responseMessage);
return response.AsActionResult();
}
[AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
public ActionResult Token()
{
return this.authorizationServer.HandleTokenRequest(this.Request).AsActionResult();
}
CustomizeAuthorize.class :AuthorizeAttribute
override bool AuthorizeCore(HttpContextBase httpContext){
//check HttpContext.Request.IsAuthenticated
//sometimes can check session also(set identity if session exists)
}
override void HandleUnauthorizedRequest(AuthorizationContext filterContext)

```

according to The OAuth 2.0 Authorization Framework
Authorization Grant ........................................8
1.3.1. Authorization Code ..................................8
1.3.2. Implicit ............................................8
1.3.3. Resource Owner Password Credentials .................9
1.3.4. Client Credentials ..................................9

## Type 1: Authorization Code:

```
client Code:
private readonly WebServerClient client;
private readonly static AuthorizationServerDescription authServerDesc = new AuthorizationServerDescription()
{
TokenEndpoint = new Uri(TOKEN_ENDPOINT),
AuthorizationEndpoint = new Uri(AUTHZ_ENDPOINT),
ProtocolVersion = ProtocolVersion.V20
};
client = new WebServerClient(authServerDesc, clientId);
[HttpGet]
public ActionResult Index()
{
client.RequestUserAuthorization(new[] { "" }, new Uri(Url.Action("login", "home", null, this.Request.Url.Scheme)));
return new EmptyResult();
}
[HttpGet]
public async Task Login()
{
client.ClientCredentialApplicator = ClientCredentialApplicator.PostParameter(clientSecret);
var authorization = client.ProcessUserAuthorization();//wait for token generated by oauthServer
if (authorization != null)
{
if (authorization.AccessTokenExpirationUtc.HasValue)
{
client.RefreshAuthorization(authorization, TimeSpan.FromSeconds(30));
}
string token = authorization.AccessToken;
string scope = "user_name,nick_name,avatar_url";
using (var httpClient = new ApiHttpClient(token))
{
var content = new StringContent(JsonConvert.SerializeObject(new { user_scope = scope }), Encoding.UTF8, "application/json");
//// setting for https only
//System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, errors) => true;
var apiResponse = await httpClient.PostAsync(ApiEndPoint, content);
if (apiResponse.IsSuccessStatusCode)
{
return new WrapperHttpResponseMessageResult(apiResponse);
}
return Content("call api failed");
}
}
return Content("authorize failed");
}
public class ApiHttpClient : HttpClient
{
public ApiHttpClient(string accessToken)
: base(new ApiMessageHandler(accessToken))
{ }
class ApiMessageHandler : MessageProcessingHandler
{
string accessToken;
public ApiMessageHandler(string accessToken)
: base(new HttpClientHandler())
{
this.accessToken = accessToken;
}
protected override HttpRequestMessage ProcessRequest(HttpRequestMessage request, CancellationToken cancellationToken)
{
request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", this.accessToken);
return request;
}
protected override HttpResponseMessage ProcessResponse(HttpResponseMessage response, CancellationToken cancellationToken)
{
return response;
}
}
}

```

## Request capturing analysis

1.cl.com/home/login
2.srv.com/oauth2?response_type=code&client_id=123456&redirect_uri=http:%2F%2Fcl.com%2Fhome%2Flogin&scope=
run CustomizeAuthorize, if not login yet(AuthorizeCore) will kick to (HandleUnauthorizedRequest)
3.srv.com/home/login?customizeReturnUrl=%2Foauth2%3Fresponse_type%3Dcode%26client_id%3D123456%26redirect_uri%3Dhttp%3A%252F%252Fcl.com%252Fhome%252Flogin%26scope%3D
at this point, you need to log return url for later redirection after successfully login.
then post to login, success then redirect to customizeReturnUrl,
run CustomizeAuthorize again,then enter action Index continue previous request
4.srv.com/oauth2?response_type=code&client_id=123456&redirect_uri=http:%2F%2Fcl.com%2Fhome%2Flogin&scope=
first time will show Authorization Page(render with
@using (Html.BeginForm())
{
@Html.Hidden("client_id", this.Model.AppKey)
@Html.Hidden("redirect_uri", this.Model.Redirect)
@Html.Hidden("state", this.Model.State)
@Html.Hidden("scope", DotNetOpenAuth.OAuth2.OAuthUtilities.JoinScopes(this.Model.Scope))
@Html.Hidden("response_type", this.Model.ResponseType)
@Html.Hidden("approve", true)
<button class="btn1" type="submit">Authorize Now</button>
}
) , when you click button 'Authorize Now',will post data back to oauth2/index?approve=true,after this redirect to original url:
5.cl.com/home/login?code=*******
now, client side start to post Client Secrect
client.ClientCredentialApplicator = ClientCredentialApplicator.PostParameter(clientSecret);
var authorization = client.ProcessUserAuthorization();[server side will check secrect and create token]
successfully!!!
 
## Way 2: Client Credentials: app level oauth

```
public async Task AppClient()
{
var token = await GetToken();
string result = String.Empty;
using (var apiHttpClient = new ApiHttpClient(token))
{
//// setting for https only
//System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, errors) => true;
var content = new StringContent("{\"param_key\":\"param_value\"}", Encoding.UTF8, "application/json");
var apiResponse = apiHttpClient.PostAsync(APIEndPoint, content).Result;
if (apiResponse.IsSuccessStatusCode)
{
result = apiResponse.Content.ReadAsStringAsync().Result;
return Content(result);
}
return Content("failed: " + apiResponse.StatusCode.ToString());
}
}
private async Task GetToken()
{
using (var httpClient = new OAuthHttpClient(clientId, clientSecret))
{
var content = new FormUrlEncodedContent(new Dictionary<string, string>
{
{"grant_type", "client_credentials"}
});
var response = await httpClient.PostAsync(TOKEN_ENDPOINT, content);
var responseContent = await response.Content.ReadAsStringAsync();
if (response.StatusCode == System.Net.HttpStatusCode.OK)
{
return JObject.Parse(responseContent)["access_token"].ToString();
}
return responseContent.ToString();
}
}

```

Case Study:
oauth2 server implementation interactive with third party oauth login

![](/docs/docs_image/software/programming/auth04.png)

协议：

The OAuth 2.0 Authorization Framework
http://tools.ietf.org/html/rfc6749

参考书籍：
Pro ASP.NET Web API Security.pdf
ASP.NET Identity
参考阅读：
http://bitoftech.net/2014/09/24/decouple-owin-authorization-server-resource-server-oauth-2-0-web-api/

Security and cryptography
http://dotnetcodr.com/security-and-cryptography/

Makecert.exe（证书创建工具）
http://msdn.microsoft.com/zh-cn/library/bfsktky3(v=vs.110).aspx

IIS中的SSL Certificate 证书配置
http://www.cnblogs.com/chyspace/archive/2011/02/17/1957326.html

DotNetOpenAuth
http://www.cnblogs.com/chyspace/archive/2011/02/17/1957326.html

Real World OAuth using ASP.NET MVC
http://www.dotnetcurry.com/showarticle.aspx?ID=907

ASP.NET MVC 中实现真实世界中的 OAuth 身份认证
http://www.oschina.net/translate/real-world-oauth-using-aspnet-mvc?cmp&p=2

用DotNetOpenAuth实现基于OAuth 2.0的web api授权
http://www.cnblogs.com/fengwenit/p/3542566.html

使用DotNetOpenAuth搭建OAuth2.0授权框架
http://www.cnblogs.com/newton/p/3409984.html

各种语言实现的oauth认证
http://www.supesoft.com/News_Disp.asp?ID=4926

Asp.Net MVC 4 Web API 中的安全认证-使用OAuth
http://www.supesoft.com/News_Disp.asp?ID=4926

[OAuth]基于DotNetOpenAuth实现Client Credentials Grant
http://www.cnblogs.com/dudu/p/oauth-dotnetopenauth-client-credentials-grant.html

扩展阅读：

数字证书原理
http://www.cnblogs.com/jeffreysun/archive/2010/06/24/1627247.html
网上银行安全证书工作原理
http://lordecho.wordpress.com/2009/02/17/%E7%BD%91%E4%B8%8A%E9%93%B6%E8%A1%8C%E5%AE%89%E5%85%A8%E8%AF%81%E4%B9%A6%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86/

WCF开发框架之证书加密使用说明书
http://www.cnblogs.com/wuhuacong/archive/2012/07/09/2582297.html
 
OAuth 2.0 (without Signatures) is Bad for the Web
http://hueniverse.com/2010/09/15/oauth-2-0-without-signatures-is-bad-for-the-web/

## AUTH flow:
https://b.zmxy.com.cn/technology/openDoc.htm?relInfo=zhima.auth.info.authorize@1.0@1.3
http://open.taobao.com/docs/doc.htm?articleId=102635&docType=1&treeId=1
http://open.taobao.com/docs/doc.htm?spm=a219a.7629140.0.0.4PMVGd&treeId=12&articleId=105590&docType=1
http://www.junge85.com/post/859.html
淘宝OAuth2.0服务 http://www.ganzhishi.com/txt.asp?id=1305
OAuth2.0 用户验证授权标准 理解 www.cnblogs.com/hilow/p/3826425.html

