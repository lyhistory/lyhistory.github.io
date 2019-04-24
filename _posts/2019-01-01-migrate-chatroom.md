---
title: Online chat room from NULL 聊天室开发
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

chat room version 1.0 functionality demonstration by gif

![](/content/images/post/20190101/chatroom.gif)

# 1.Planning
(all the domains below are fictional)

Now I have a web site website.com, an Oauth2 server oauth.com, and an API server/Resource server api.com,access restricted through oauth only, now I am asked to create an online chatting room for website.com, which will be embedded in website.com using iframe, assume domain is chatroom.com.

General workflow will be: user log on website.com through oauth.com, on oauth successfully website.com pass access_token to chatroom.com, then last step, chatroom use access_token to retrieve user info from API.com, this process is also considered as logon chatroom.

My colleague suggests me to use signalr, compare to super socket, it's much more easy to draw UI because UI for such an online chatting room is very complicated, another advantage of signalr is that it supports long-polling, means those browsers not supporting websocket will also works fine, while the disadvantage is I need to maintain my own 'sessions', signalr or most web sockets do not support session feature by default.( why? answer in my blog '[About Session](/migrate-session/)' )
# 2.Business Modeling
Domain Modeling ( use case driven approach,the task of discovering 'objects' that represent those business entities and concepts)

User(name,online status)

Friends

Conversation Room -- chat group (name, creator,members,status)

Message -- Private Message, Group Message

Recently chat list
# 3.Requirements
when user successfully connected with server,If he doesn't have nickname yet, required to update user info through api.com.

after checking nickname, he will be auto assigned to one of the lobbies(system setting channels);

user can switch channels, can check users online status and add friends,

start private conversation with friends,

create chat group with selected friends,manage chat group, invite friend, kick out member.

system will keep track of users' recently chat records,

missed messages will push to user as soon as he get online.
# 4.Analysis & Design
## 4.1 Tech
MVC for presentation layer

[SignalR](http://www.asp.net/signalr) for communication layer

Mongodb for db layer
## 4.2 Detail
user persistence: session

security: form authentication

[CookieAuthenticationSample](https://github.com/gustavo-armenta/CookieAuthenticationSample)
[Using ajaxSetup beforeSend for Basic Auth is breaking SignalR connection](http://stackoverflow.com/questions/16190148/using-ajaxsetup-beforesend-for-basic-auth-is-breaking-signalr-connection)

Understanding and Handling Connection Lifetime Events in SignalR
<iframe src="//channel9.msdn.com/Events/TechEd/NorthAmerica/2014/DEV-B416/player" width="960" height="540" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
[Emoticons （Verify Code e4d6） 聊天表情源码 提取码 e4d6](http://yunpan.cn/cVH3p99JWi94R)

# 5.implement
## Logic:
signalr reconnect?

rejoin room ? missed message push?

session lost handling? token expired handling?

fallback handling,go back to client side, ask for new token ?

performance enhancement?

code refactor?
## UI:
Show Loading tips before enter/switch room and disable page event
## Technical:
### 1.signalR life cycle
SignalR connection OnConnected OnReConnected OnDisconnected

Transport connection

negotiate --> connect --> start--> send....---> reconnect

(reconnect every 5s,on 30s throw hub error:

Error: Couldn't reconnect within the configured timeout of 30000 ms, disconnecting. {source: "TimeoutException", stack: (...), message: "Couldn't reconnect within the configured timeout of 30000 ms, disconnecting."}

Error: The client has been inactive since Wed May 13 2015 15:27:25 GMT+0800 (China Standard Time) and it has exceeded the inactivity timeout of 50000 ms. Stopping the connection. {source: "TimeoutException", stack: (...), message: "The client has been inactive since Wed May 13 2015…ity timeout of 50000 ms. Stopping the connection."}

), then abort (check network)
$.signalR.connectionState
Object{connecting:0, connected:1, reconnecting:2, disconnected:4}
error: connect before call

solution: block user before connected,e.g. using overlap loading.
### 2. send failed error
```
ChatHub.Send failed:
chatroom.js:351 Error: Error: Send failed.
at Object.r._.error (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:4512)
at i.l (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:34125)
at Object.<anonymous> (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:35652)
at Object.<anonymous> (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:11987)
at Object.n.event.dispatch (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:8066)
at Object.r.handle (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:4774)
at Object.n.event.trigger (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:7167)
at n.fn.extend.triggerHandler (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:15006)
at s (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:18319)
at Object.u.ajax.success (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:18593)
chatroom.js:118 SignalR error: Error: Send failed.
chatroom.js:662 ChatHub.Send failed:
chatroom.js:663 Error: Connection was disconnected before invocation result was received.
at Object.r._.error (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:4512)
at i.l (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:34125)
at f (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:32687)
at Object.<anonymous> (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:35854)
at Object.<anonymous> (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:12085)
at Object.n.event.dispatch (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:8066)
at Object.r.handle (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:4774)
at Object.n.event.trigger (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:7167)
at n.fn.extend.triggerHandler (http://chatroom.24popcorn.com/Content/js/jquery-latest.min.js:3:1
```5006)
at Object.r.fn.r.stop (http://chatroom.24popcorn.com/Scripts/jquery.signalR-2.2.0.min.js:8:13160)

reason:another asynchronous call still in processing, may cause dead lock

solution:

queue before send calling, using Jquery.defferred Promise

<iframe src="//jsfiddle.net/kre9qvqL/2/embedded/" width="100%" height="300" frameborder="0" allowfullscreen="allowfullscreen"></iframe>



http://stackoverflow.com/questions/17308172/deferred-versus-promise

http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/

http://www.vasanthk.com/jquery-promises-and-deferred-objects/

![](/content/images/post/20190101/chatroom1.png)
![](/content/images/post/20190101/chatroom2.png)
![](/content/images/post/20190101/chatroom3.png)

Finally!!! Let's meet the murderer !!!

[InvalidOperationException]: An asynchronous module or handler completed while an asynchronous operation was still pending.

http://stackoverflow.com/questions/17659603/async-void-asp-net-and-count-of-outstanding-operations
Regarding "fire and forget":
I personally never use this phrase for async void methods. For one thing, the error handling semantics most certainly do not fit in with the phrase "fire and forget"; I half-jokingly refer to async void methods as "fire and crash". A true async "fire and forget" method would be an async Task method where you ignore the returned Task rather than waiting for it.
That said, in ASP.NET you almost never want to return early from requests (which is what "fire and forget" implies). This answer is already too long, but I have a description of the problems on my blog, along with some code to support ASP.NET "fire and forget" if it's truly necessary.

http://www.wiliam.com.au/wiliam-blog/async-void-dont-use-it
https://msdn.microsoft.com/en-us/magazine/jj991977.aspx

### 3.query in MongoDB using C# Driver
http://stackoverflow.com/questions/24169849/searching-an-array-of-objects-in-mongodb-using-the-c-sharp-driver

http://stackoverflow.com/questions/5457637/mongodb-field-array-searching-c-how-to?rq=1

http://stackoverflow.com/questions/25727553/querying-an-array-of-arrays-with-the-mongodb-c-sharp-driver?rq=1

### 4.httpcontext session/cookie is null with IE
You can try the following code by adding in Global.asax file

protected void Application_BeginRequest(object sender, EventArgs e)
{
HttpContext.Current.Response.AddHeader("p3p", "CP=\"CAO PSA OUR\"");
}
The problem lies with a W3C standard called Platform for Privacy Preferences or P3P. This will allow Internet Explorer to accept your cookie. You will need to send the header on every page that sets a cookie.
### 5.Page refresh, SignalR disconnect and connect again and assign new connectionID, but how to maintain state(First Connection Time and current conversation state)

http://kevgriffin.com/maintaining-signalr-connectionids-across-page-instances/

solution: Maitain your own SessionList, OnDisconnected mark check session state, if previous online=true, set online=false and remove connectionID from , else remove session, when OnConnected check session, if find user in session and previous online=false, set it true, and add new connectionID

# 6.Configuration Management
release maintenance

# 7.Continuous Integration
another system which is the back end system need to interact with chatroom, e.g. from back end system, admin can 'push' messages to all clients connected with chatroom,

back end system was implemented using .net c# technology,

issues: I am using Form Authenticate with ChatHub which is the only hub I have so far. JS Clients connect to it after authentication.

solution: add one more hub to interact with .net client, this new hub need also keep reference of ChatHub to notify all JS Clients connected to it.

http://www.asp.net/signalr/overview/guide-to-the-api/hubs-api-guide-server#callfromoutsidehub

http://henriquat.re/server-integration/signalr/integrateWithSignalRHubs.html

errors encountered:

signalr Unexpected character encountered while parsing value: <. Path '', line 2, position 1.

reason: failed to connect to the hub, check whether you called the correct path or is there any authentication requires towards your hub.

b.further more, I was asked to make the 'push' message be periodic, so I decided to use timer, soon I found the issue, I cannot do async operations inside a timer(threading timer)

solution in my the other blog [Code Snippets Series – C#](/migrate-codesnippets_csharp/)

Debug:
![](/content/images/post/20190101/chatroom4.png)

**SignalR Message Format**
>-- http://blogs.microsoft.co.il/applisec/2014/03/12/signalr-message-format/
>
>Messages are serialized as JSON objects and contain metadata about the handlers and the connection as well as payload (i.e. the data to transfer) The following information is included in the messages:
>
>- Hubs (H): Handlers (i.e methods) on the server as well as on the clients are grouped in "Hubs".
>- Method (M): The name of the Handler that will process the message.
>- Groups: Clients can be grouped on the servers in "groups" for pub-sub implementation.
>- Arguments (A): The actual content to be passed to the hander on the client or on the server.
>- Cursor (C): Represents a position in the message stream.
>- Index (I): The Id of the handler or Callback.
>Hub Message Format
>
>Hub Request format ("send" request)
>
>Data={"I":index,"H":"samplingstreaminghub","M":"ConnectToStream","A":["StreamUri"]}
>
>Hubs messages format (server to client)
>
>- {"C":"messageId value", "M":[{"H":"HubName","M":"HandlerName","A": ["argument list as json"]}]}
>
>- {"C":"messageId value", "G": ["groupName"],"g": ["groupName"],"T":1,
>"M":[{"H":"HubName","M":"HandlerName","A": ["argument list as json"]}]}
>
>Hub Payloads format ("send" request or inside "M" element of Hub message)
>
>- {"H":"HubName","M":"HandlerName","A": [argument list as json],                                    "S":{state as json},"I":index}
>- {"H":"HubName","M":"HandlerName","A": [argument list as json],"I":index}
>Hub Response examples ("send" response)
>- {"I":"0","R":{"return object as json}}
>- {"I": 0} -> no result
>- {"I": 0, "S":{"x":1},"R":1} –> result
>- {"I": 0, "E":"This is an error"} –> error
>- {"I": 0, "E":"This is an error", "T": "Some stack trace here"} -> error + stack
>The following is a complete list of the messages elements:
>Hub Messages:
>
>C – Cursor
>M – Messages
>T – Timeout (only if true) value is 1
>D – Disconnect (only if true) value is 1
>R – All Groups (Client groups should be reset to match this list exactly)
>G – Groups added
>g – Groups removed
>
>Hub payload:
>
>I – Callback Operation index
>H – Hub name
>M – method name
>A – arguments
>S – state (if not null)
>
>Hub Method return value:
>
>I – Operation index
>R – Result
>S – State
>E – Error
>T – stack trace
>D – Error Data
>
>The cursor mechanism
>As described above the message contains a cursor for identifying the location in the stream. A cursor represents where a particular client is in an infinite stream of messages. If the client disconnects and then reconnects, it asks the OI streaming API for any messages that arrived after the client’s cursor value. The same thing happens when a connection uses long polling. After a long poll request completes, the client opens a new connection and asks for messages that arrived after the cursor.
>
>To find more information download the signalR source code from github. To find the message format just search for json serialization attributes (by searching for “M” for example).

# reference:

MongoDB:

[High Performance Search using MongoDB and ASP.NET MVC](http://www.codeproject.com/Articles/784660/High-Performance-Search-using-MongoDB-and-ASP-NET)

Authentication:
[Storing Custom Data in Forms Authentication Tickets](http://www.danharman.net/2011/07/07/storing-custom-data-in-forms-authentication-tickets/)
[form authentication timeout not working](http://forum.winhost.com/threads/form-authentication-timeout-not-working.9017/)
[Authentication with SignalR and OAuth Bearer Token](http://blog.marcinbudny.com/2014/05/authentication-with-signalr-and-oauth.html#.VTRVVSGqqko)
[Set Context User Principal for Customized Authentication in SignalR](http://geekswithblogs.net/shaunxu/archive/2014/05/27/set-context-user-principal-for-customized-authentication-in-signalr.aspx)

Session:
[Real-time User Notification and Session Management with SignalR](https://syfuhs.net/2013/03/24/real-time-user-notification-and-session-management-with-signalr-part-2/)

UI:
[jQuery plugin to style emoticons with pure CSS3 properties (no images)](http://jspkg.com/packages/css-emoticons)
[Open sourcing Twitter emoji for everyone](https://blog.twitter.com/2014/open-sourcing-twitter-emoji-for-everyone)
[jquery.qqFace.js](http://www.jq22.com/jquery-info365)
[纯JS+MVC 打造Web实时聊天室](http://www.tuicool.com/articles/yii63y)

relevant question:
[How to do forms authentication with SignalR (separate domains)?](http://stackoverflow.com/questions/22472078/how-to-do-forms-authentication-with-signalr-separate-domains)
[SignalR 2.0 in VS2012 registration and Dependency Injection](http://stackoverflow.com/questions/19626244/signalr-2-0-in-vs2012-registration-and-dependency-injection)
[Passing and verifying the OWIN Bearer token in Query String in WebAPI](http://stackoverflow.com/questions/21925367/passing-and-verifying-the-owin-bearer-token-in-query-string-in-webapi)
[Web API / OWIN, SignalR & Authorization](http://stackoverflow.com/questions/22989209/web-api-owin-signalr-authorization)
[Unable to Identify User Context in SignalR hub decorated with “Authorize” attribute](http://stackoverflow.com/questions/25509162/unable-to-identify-user-context-in-signalr-hub-decorated-with-authorize-attrib)
[Context.User is Null on Authorized SignalRHub Task OnDisconnected](https://github.com/SignalR/SignalR/issues/2753)
[Integrating SignalR with existing Authorization](http://stackoverflow.com/questions/14343531/integrating-signalr-with-existing-authorization)
[How do I authorize access to ServiceStack resources using OAuth2 access tokens via DotNetOpenAuth?](http://stackoverflow.com/questions/18257753/how-do-i-authorize-access-to-servicestack-resources-using-oauth2-access-tokens-v)
[JSON Web Token in ASP.NET Web API 2 using Owin](http://bitoftech.net/2014/10/27/json-web-token-asp-net-web-api-2-jwt-owin-authorization-server/)
[【打破砂鍋系列】SignalR傳輸方式剖析](http://blog.darkthread.net/post-2013-12-03-inside-signalr-transport.aspx)

A chatroom for all! http://blogs.msdn.com/b/cdndevs/archive/2014/09/04/node-js-tutorial-series-a-chatroom-for-all-part-1-introduction-to-node.aspx