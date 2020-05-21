日常：浏览器挂代理，xray+burpsuite
基本：根据target搜集subdomain，交给爬虫（crawllergo是不是也是会扫subdomain），爬虫爬url，交给xray，xray扫洞，发送结果通知
升级：自己编写扫描器，集合各种工具（或自定义工具）

## Xray基本用法
https://xray.cool/

**基本:**

.\xray_windows_386.exe version
.\xray_windows_amd64.exe genca
.\xray_windows_amd64.exe webscan --listen 127.0.0.1:7777 --html-output xray-testphp.html
./xray_windows_amd64 webscan --basic-crawler http://testphp.vulnweb.com/ --html-output xray-crawler-testphp.html
快速检测单个目标 ./xray servicescan --target 127.0.0.1:8009 
批量检查的 1.file 中的目标, 一行一个目标，带端口 ./xray servicescan --target-file 1.file
将检测结果输出到 json 文件中 ./xray servicescan --target 127.0.0.1:8099 --json-output 1.json

注意，速度太快会被ban，最好调整速度：
max_qps 每秒最大请求数，默认值为 500
max_parallel 插件调度并发数，默认值为 30

**挂浏览器被动扫：**

第一次启动 xray 之后，当前目录会生成 config.yml
```
mitm:
  ...
  restriction:
    includes:
    - "target.com"
```
.\xray_windows_386.exe webscan --listen 127.0.0.1:7777 --html-output xray-report.html

**browser->burp->xray**

启动xray：
.\xray_windows_386.exe webscan --listen 127.0.0.1:7777 --html-output xray-report.html

启动burp：
更改User Options->Upstream Proxy Servers->Add
	Destination host: *target.com*
	Proxy host:	127.0.0.1
	Proxy port: 7777

## 基本联爬工具

我捡到一个10W的洞 https://mp.weixin.qq.com/s/lxm38p7fSIfC6kPPE5HFGw

https://github.com/ehsahil/recon-my-way/tree/master/aquatone

**Step 1: crawlergo+xray**

crawlergo
https://github.com/0Kee-Team/crawlergo

https://github.com/lyhistory/crawlergo_x_XRAY
./xray.exe webscan --listen 127.0.0.1:7777 --html-output proxy.html

launcher.py:
```
proxies = {
		'http': 'http://127.0.0.1:7777',
		'https': 'http://127.0.0.1:7777',
		}
cmd = ["./crawlergo", "-c", "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe","-t", "20","-f","smart","--fuzz-path", "--output-mode", "json", target]

```

https://github.com/ngalongc/bug-bounty-reference
https://github.com/djadmin/awesome-bug-bounty

xray 与 crawlergo 动态爬虫联动
https://assassins-white.github.io/2020/03/29/crawlergo%E8%81%94%E5%8A%A8xray%E5%AF%B9%E6%8E%A5%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E5%AE%9E%E7%8E%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%97%A5%E7%AB%99%E4%B8%80%E6%9D%A1%E9%BE%99/


**Step 2 加通知：**

xray.exe webscan --listen 127.0.0.1:7777 --webhook-output http://你服务器IP:5000/webhook


自定义webhook或email
https://www.cnblogs.com/yuki-nana/p/9775836.html
https://assassins-white.github.io/2020/03/29/crawlergo%E8%81%94%E5%8A%A8xray%E5%AF%B9%E6%8E%A5%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E5%AE%9E%E7%8E%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%97%A5%E7%AB%99%E4%B8%80%E6%9D%A1%E9%BE%99/

```
#接收漏洞,发送通知
python xray_notify.py

#接收爬虫url,扫描漏洞
.\xray_windows_amd64.exe webscan --listen 127.0.0.1:7777 --webhook-output http://127.0.0.1:5000/webhook_dingding

#开启爬虫
python launcher.py
```

**Step 3 分布式celery升级**

个采用 celery 的分布式扫描器原型，使得单个爬虫节点能结合多个扫描节点
https://paper.seebug.org/1119/
使用Celery加速你的爬虫 
https://www.cnblogs.com/TM0831/p/11405077.html
https://blog.csdn.net/Lijuhao_blog/article/details/88983273
https://blog.csdn.net/jclian91/article/details/86750042
https://www.hongweipeng.com/index.php/archives/1676/


---

