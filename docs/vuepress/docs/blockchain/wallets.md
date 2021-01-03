---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《钱包使用技巧》

## bitshare

永远无法被关闭的去中心化交易所:
[openledger](http://openledger.io/?r=liu-yue)和[wallet.bitshares](https://wallet.bitshares.org/?r=liu-yue)


bitshares.org vs bitshares.openledger.info (OBITS https://obits.io/)
https://bitcointalk.org/index.php?topic=1399878.0
https://coinmarketcap.com/currencies/obits/#markets
https://bitsharestalk.org/index.php/topic,13104.msg171728.html#msg171728

## brave

最喜欢的浏览器推荐下，屏蔽各种广告和js追踪，由javascript之父创建的brave，内置tor，正常浏览网页还可以赚取BAT：

[点击官方链接](https://brave.com/lyh992)

国内可能需要翻QIANG

然后可以看到brave有rewards（只要使用浏览器就有奖励BAT），还内置了各种虚拟币钱包

[chrome://wallet/](chrome://wallet/)

![](/docs/docs_image/blockchain/wallet/brave01.png)

如果你也是站长可以申请创作者：
https://brave.com/creators/
https://publishers.basicattentiontoken.org/log-in

userful links：

https://community.brave.com/
https://brave.com/faq/
https://uphold.com/en/brave

[Where is my BAT wallet address is Brave?](https://www.reddit.com/r/BATProject/comments/8ta0m4/where_is_my_bat_wallet_address_is_brave/)

[Help center](https://support.brave.com/hc/)

[Brave Browser, BATs, and the Attention Economy](https://www.youtube.com/watch?v=yR-ayASDdrE&feature=youtu.be)
https://news.ycombinator.com/item?id=13940613



## decred
有两个daemon，比如 %localappdata%打开会看到默认两个Dcrd和Decrediton，可以看到Decrediton里面主要是配置，而Dcrd主要是区块数据和日志，

可以找到%localappdata%/Decrediton/dcrwallet.conf 更改appdata,钱包信息


然后根据文档的https://docs.decred.org/wallets/cli/dcrd-and-dcrwallet-cli-arguments/#dcrd

找到 %localappdata%/Decrediton/dcrd.conf 添加：
datadir=newPath\Dcrd
logdir=newPath\Dcrd

即可更改区块数据和日志的文件夹


Assurances in Crypto edit https://blog.goodaudience.com/1-assurances-in-crypto-14c55a1fd616


##zec

根据 https://docs.zecwallet.co/faq/#can-i-change-the-location-of-the-data-directory

%HOMEPATH%\AppData\Roaming\Zcash\zcash.conf
或
%AppData%\Roaming\Zcash\zcash.conf

添加：
datadir=/your/new/path

https://zecpages.com/



## 如何投资

推荐笔者使用了六年的AEX（前身比特时代），目前有赠送活动，可以直接注册体验，扫描图片二维码：

![](/docs/docs_image/blockchain/aex_1.jpg)