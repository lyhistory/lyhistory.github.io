---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《钱包使用技巧》

注意事项：

如果使用在线钱包，比如uphold，一定要设置并备份好google验证恢复码；

如果是使用冷钱包，一定要备份好私钥或助记词；

## bitshare

永远无法被关闭的去中心化交易所:
[openledger](http://openledger.io/?r=liu-yue)和[wallet.bitshares](https://wallet.bitshares.org/?r=liu-yue)


bitshares.org vs bitshares.openledger.info (OBITS https://obits.io/)
https://bitcointalk.org/index.php?topic=1399878.0
https://coinmarketcap.com/currencies/obits/#markets
https://bitsharestalk.org/index.php/topic,13104.msg171728.html#msg171728



## decred
有两个daemon，比如 %localappdata%打开会看到默认两个Dcrd和Decrediton，可以看到Decrediton里面主要是配置，而Dcrd主要是区块数据和日志，

可以找到%localappdata%/Decrediton/dcrwallet.conf 更改appdata,钱包信息


然后根据文档的https://docs.decred.org/wallets/cli/dcrd-and-dcrwallet-cli-arguments/#dcrd

找到 %localappdata%/Decrediton/dcrd.conf 添加：
datadir=newPath\Dcrd
logdir=newPath\Dcrd

即可更改区块数据和日志的文件夹

Assurances in Crypto edit https://blog.goodaudience.com/1-assurances-in-crypto-14c55a1fd616

注意SPV轻量级钱包模式，stake购买ticket需要手动，不能自动，只有full node才支持自动购买ticket

## zec

根据 https://docs.zecwallet.co/faq/#can-i-change-the-location-of-the-data-directory

%HOMEPATH%\AppData\Roaming\Zcash\zcash.conf
或
%AppData%\Roaming\Zcash\zcash.conf

添加：
datadir=/your/new/path

https://zecpages.com/



## 如何投资

[推荐coinhako,目前有赠送活动](https://www.coinhako.com/affiliations/sign_up/LYHISTORY_76989)

<disqus/>