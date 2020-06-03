
[web基础 关于抓包部分](/docs/coder2hacker/ch2_web)有大概介绍，这里详细介绍burp的用法

burp is the main-in-the-middle proxy software.

https://portswigger.net/burp/communitydownload

irc.freenode.net

## Setup

### Target:
add in scope

### Proxy

Options->Miscellaneous->Don't send items to proxy history or other Burp tools, if out of scope

intercept request & reponse

match and replace

response modification:
	unhiden field
	

## Usage

### Repeater

rename tab: double click tagb 

response: auto-scroll to match when text changes

右上角显示Target
	可以修改request的host header，发起domain fronting
	
Http Pipelining:
案例：cache poisoning
设置 Project Option->Http->Streaming response
在repeater单个request窗口中可以copy多个请求，注意要设置keep-alive
但是还要注意，这样response返回的另外的请求会乱码，解决方法是去掉header中的Accept-Encoding:gzip, deflate

### Intruder - Escalating toward automation

Payloads:
+ Sniper
	single set of payloads then try them all on each position you mark
+ Battering ram
	instead of separately it just puts each payload in every position all at once, each position will always have the same value that the other positions have
+ Pitchfork
	take a payload set for each parameter and iterates over all of them at once
+ Cluster bomb
	generates a payload for each parameter and independently iterates over all of those per position

Custom Word List / Configure predefined payload lists
https://github.com/danielmiessler/SecLists

Extract Mission Titles:
	Options->Grep - Extract, eanble and add 
	ctrl+click on the response column

Intruder Results:
filter:
e.g 'User not exist' Negative search User+not+exist

admin' AND password LIKE '%%' AND 1='1

### Scanner - bug-bounty oriented scanning

+ Passive
	default
+ Active:
	scan the target or custom scope or 
	from http history right click 'do a active scan'

Options->Scan Issues:
+ normal scan: by default "Select by scan type"
+ Select individual issues:
	tick "Extension generated issues"; then click "Distribute Damage"

right click will show the detailed descriptions

Usful Plugins:
Extender->BApp Store-> 
		Backslash Powered Scanner
		Distribute Damage

To customize scanner:
Scan check Builder(高版本才有)
https://github.com/PortSwigger/active-scan-plus-plus

Scanner Performance&Problem solving - beyond downloading extra RAM

+ disable extension

+ Option->Static Code Analysis

+ Target->Site map filter: setup scope and use Burp Search instead of sitemap filter

+ Sometimes it may automatically logout the session, better install extension: logger++ and Flow, 
then you can observe the current status of every request

+ User options->Connections->Upgream Proxy Servers

### Advance
Burp Collaborator
https://portswigger.net/burp/documentation/collaborator

## tips

Save copy of project -> Target/Proxy/Spider/Save in-scope items only

auto url encode:select a text and hit Ctrl+U 

burp->search e.g 'syntax' 'http://'

http history->right click->engagement tools->generate CSRF PoC

http history->right click->engagement tools->find references

invisable proxy?
	for desktop/mobile app behaves differnently when go through a proxy?
	
projecte options->client ssl certificate
	for embbed device
