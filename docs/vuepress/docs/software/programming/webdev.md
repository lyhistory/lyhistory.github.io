---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《web开发》

## 1.web开发基础

### 1.1 web协议

Http 协议: http, https, web sockets

HTTP stateless
web API - intention restful
session - cookie OR cookieless - HTTP context (not necessary store user login info, can also store before login info)
token - authenticate and authorise between servers/applications

request handling pipeline

web sockets
WebSockets, caution required! https://samsaffron.com/archive/2015/12/29/websockets-caution-required

What’s the difference between JavaScript and ECMAScript? https://medium.freecodecamp.org/whats-the-difference-between-javascript-and-ecmascript-cba48c73a2b5

Https
https://groups.google.com/forum/#!topic/httpfiddler/RCkzE3HhhxY

1. When going through a proxy, HTTPS traffic flows through what are called "CONNECT Tunnels". The reason HTTPS traffic is special is that it encrypts all of the data so that an intermediary (like Fiddler) cannot normally see it. The problem with doing that is that if the intermediary proxy (like Fiddler) can't see the traffic, it doesn't know where to send it. So the client sends a HTTP CONNECT request to the proxy and specifies the target destination. E.g. CONNECT husband.umd.edu:443 HTTP/1.1. (Note that the request line doesn't include a URL, only the hostname). 

The proxy is expected to open a connection to the target and then just blindly shuffle bytes back and forth. Fiddler could show the hostname in the HOST column and in the URL column, but for readability in English it instead shows the HOST only in the URL column and shows "Tunnel to" in the host column.

2. Yes, the fact that the browser felt the need to establish a connection to ssl.google-analytics.com is a good sign that the page it loaded includes one or more tracking requests to the Google servers. If you enable HTTPS decryption, you can see the actual requests and not just the tunnels.

3. SPDY is a new protocol that sits between TCP/IP and HTTP; it reformats HTTP messages in a compressed binary way to improve performance. SPDY traffic is always over SSL and hence you see it in Tunnels. When a tunnel is established, Fiddler looks at flags in the client and server's handshakes to determine if SPDY is likely in use and if so, it shows this icon. Note that if you enable HTTPS decryption, SPDY will no longer be used because the flags sent in a SPDY handshake cannot be sent by Fiddler and thus the client and server speak plain HTTPS instead.

### 1.2 Web server技术-后端开发

Common Gateway Interface(CGI): c c++
Hypertext Preprocessor (PHP):

.net: 
	Request processor:: httphandler
	MVC framework based on httphandler/mvchandler
	web api
	IIS
	http://beletsky.net/2011/06/inside-aspnet-mvc-route-to-mvchanlder.html
Java:
	Request processor:Servlet VS reactive 
	Mvc framework based on servlet container
	Rest client and server
	tomcat/jetty/apache	
Ruby related
https://bundler.io/v1.3/rationale.html

### 1.2 宿主服务Hosts

**vps and free hosting:**
[点击这里去vultr官网领取100美金免费体验](https://www.vultr.com/?ref=8491735-6G)
https://www.000webhost.com/
https://firebase.google.com/docs

#### 1.2.1 tomcat
https://www.ionos.com/community/server-cloud-infrastructure/apache/install-and-use-apache-tomcat-on-centos-7/
```
sudo yum install tomcat
sudo yum install tomcat-webapps tomcat-admin-webapps tomcat-docs-webapp tomcat-javadoc
sudo systemctl status httpd
sudo systemctl start tomcat
sudo systemctl enable tomcat
sudo vim /usr/share/tomcat/conf/tomcat-users.xml
sudo sytemctl restart tomcat
sudo systemctl restart tomcat
```

#### 1.2.2 Github pages
https://lyhistory.github.io/
Understand jekyllrb and github pages
https://jekyllrb.com/docs/
https://jekyllrb.com/docs/github-pages/

Terminal based portfolio website for CodeNerve https://github.com/CodeNerve/CodeNerve.github.io
https://medium.com/pan-labs/dynamic-web-apps-on-github-pages-for-free-ffac2b776d45

**Setup:**
+ Easy way
https://pages.github.com/
https://help.github.com/en/articles/adding-a-jekyll-theme-to-your-github-pages-site

+ Advance way

step 1. Git fork
http://www.jekyllnow.com/
https://github.com/barryclark/jekyll-now#quick-start

step 2. Gem theme or Remote theme
https://github.com/mmistakes/minimal-mistakes
https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/

Commands::
https://rubyinstaller.org/downloads/
安装是勾选UTF-8，不然会遇到问题

```
ruby --version
gem install bundler
bundle install --force
bundle info "github-pages"
bundle info "jekyll-remote-theme"
bundle exec jekyll serve
```
To update::
If you followed our setup recommendations and installed Bundler, run bundle update github-pages or simply bundle update and all your gems will update to the latest versions.
If you don't have Bundler installed, run gem update github-pages

Debug locally
https://help.github.com/en/articles/setting-up-your-github-pages-site-locally-with-jekyll

Add admin dashboard(to manage blogs in local, github doesn’t support this plugin yet)
Native:: 	https://jekyll.github.io/jekyll-admin/
ThirdParty:: 	https://github.com/singh1114/theJekyllProject

Others 
Import from wordpress
http://import.jekyllrb.com/docs/wordpress/

Bind custom domain
https://help.github.com/en/articles/adding-or-removing-a-custom-domain-for-your-github-pages-site
https://help.github.com/en/articles/setting-up-an-apex-domain

![](/docs/docs_image/software/webdev/webdev01.png)

**Troubleshooting **
?# github pags=>setting, yml invalid
Your site is having problems building: You have an error on line 16 of your _config.yml file
https://help.github.com/en/articles/page-build-failed-config-file-error

?# failed load  jekyll-include-cache
Configuration file: D:/workspace/lyhistory.github.io/_config.yml
  Dependency Error: Yikes! It looks like you don't have jekyll-include-cache or one of its dependencies installed. In order to use Jekyll as currently configured, you'll need to install this gem. The full error message from Ruby is: 'cannot load such file -- jekyll-include-cache' If you run into trouble, you can find helpful resources at https://jekyllrb.com/help/!
Note: The theme uses the jekyll-include-cache plugin which will need to be installed in your Gemfile and added to the plugins array of _config.yml. Otherwise you'll throw Unknown tag 'include_cached' errors at build. {: .notice--warning}
https://github.com/mmistakes/minimal-mistakes/blob/2784b3ad431f9e0e9f262d1a06d23f389c93d95c/docs/_docs/03-installation.md

?# Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/main.scss':
                	Invalid GBK character "\xE2" on line 54
Fixed with powershell,https://williamwang.info/setup-jekyll-on-windows/

![](/docs/docs_image/software/webdev/webdev02.png)


### 1.3相关开发工具/插件/seo工具 

#### 1.3.1 开发辅助工具
https://codebeautify.org/yaml-validator

Visual studio code
Ctrl+Shift+V
Ctrl+K V

#### 1.3.2 常用插件

**Search provider**
lunr (default), algolia, google
https://cse.google.com/all

**Comments**
disqus
https://lyhistory.disqus.com/admin/
https://lyhistory.disqus.com/admin/install/complete

**Webmaster and Analytics**
https://marketingplatform.google.com
https://analytics.google.com/analytics/web/#/report-home/a55774263w89029290p92512103
https://support.google.com/analytics/answer/7532985?hl=en_SG&utm_id=ad

https://search.google.com/search-console

**Webhoster ads**
https://brave.com/creators/

## 2.Static page generator

### 2.1 Blog 
**jekyll**
Learn Jekyll https://learn.cloudcannon.com

Theme: Minimal-mistakes
https://github.com/mmistakes/minimal-mistakes
https://github.com/mmistakes/minimal-mistakes/blob/a2620d34f6e49a67f83bdc65163093c81e6c77b9/docs/_docs/02-structure.md
https://github.com/mmistakes/minimal-mistakes/tree/82e9aee6a8e5351f71ca4226bc6cb2085c9a8671/_layouts
https://github.com/mmistakes/minimal-mistakes/tree/gh-pages-3.1.6/_includes

Layouts
https://mmistakes.github.io/minimal-mistakes/docs/layouts/

Google ads
https://www.google.com/adsense/new/u/0/pub-9742852210287449/home
https://github.com/mmistakes/minimal-mistakes/issues/404

Comments
https://mmistakes.github.io/minimal-mistakes/docs/configuration/#comments
Multi language Jekyll  i18n
https://github.com/mmistakes/minimal-mistakes/issues/2195

### 2.2 Documentation

**gitbook**
https://docsify.js.org/#/more-pages

**Vuepress**
https://vuepress.vuejs.org/
```
	npm view vuepress versions/version
	npm ls vuepress -g
	npm install vuepress@^1.0
	npm install @vuepress/plugin-google-analytics
module.exports = {
- ga: 'UA-12345678-9'
+ plugins: [
+   [
+     '@vuepress/google-analytics',
+     { ga: 'UA-12345678-9' }
+   ]
+ ]
}
```

## 3.More to explore

http://archive.is/