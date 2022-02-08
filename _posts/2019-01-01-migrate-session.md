---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: About Session
---

In my previous experience with ASP.NET session handling, I have lots of misunderstanding, list below:

## 1.Session has nothing to do with User!
It always come to me like that session only be set after use log on,  we have heart beat to keep it 'alive', this impression made me misunderstand session for a very long time, session has nothing to do with user status, as long as you access httpcontext.Session["XXX"], session will be created, of course if you have not set any value to it, session will be null , but you still got a ASP.NET_SessionId, however this value will ever change when page reload until you set some value to session(strategy by asp.net, for performance issues).Actually some website, online shopping sites for example allow user using shopping cart before their login, they do store shopping data in session.

## 2.Http transport VS WebSocket Transport, which one need session?
why http transport need session, because it's stateless, after one round request & response, disconnect, server need to know which client he communicates all the time, but for web socket, as it's long connection, duplex messaging, server already know the client very well after handshaking, no need session id anymore, so most web socket framework like signalr is session-less.

## 3.Mixed Session with Authentication(Form Authentication etc.)
In Practice, people always mixed these two, and get confused, produced many bugs hard to trace, there are some reason:

a.by default they all use cookie, ASP.NET_SessionId & ASPXAUTH (actually session can be cookie-less, you can dig it yourself)
b.they all have timeout setting, in process session default timeout is 20mins, while FormAuthentication is 2880mins
c.we are used to handling users data with session and FormAuthentication,when session timeout but authentication still not, bugs come out.

though they are very similar,but from previous two points you can see session has nothing to do with user, people like me who have weak foundation on asp.net( I jumped in asp.net mvc3 development without any web dev experience ), please refer to the link about 'ASP.NET Session and Forms Authentication'  attached at the end of this post , from some respect, you can use customized cache instead of session,session is only about store client info(no need to be a login user) , but FormAuthentication is used to handler user status,the tickets, used for role management, user permission checking.

Official Overview:

1.Session Process


2.Asp.net Session

Sotre : InProc / StateServer/ SqlServer

Underpinnings of the Session State Implementation in ASP.NET



reference:

Servlets: Persistance: Cookies and Sessions

ASP.NET Session and Forms Authentication

如何全面掌控session?且看WebSocket跨站劫持

你必须了解的Session的本质

ASP Session Object


Handling Session and Authentication Timeouts in ASP.NET MVC

深入理解HTTP Session