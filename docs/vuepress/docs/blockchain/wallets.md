---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《钱包使用技巧》

## decred
有两个daemon，比如 %localappdata%打开会看到默认两个Dcrd和Decrediton，可以看到Decrediton里面主要是配置，而Dcrd主要是区块数据和日志，

可以找到%localappdata%/Decrediton/dcrwallet.conf 更改appdata,钱包信息


然后根据文档的https://docs.decred.org/wallets/cli/dcrd-and-dcrwallet-cli-arguments/#dcrd

找到 %localappdata%/Decrediton/dcrd.conf 添加：
datadir=newPath\Dcrd
logdir=newPath\Dcrd

即可更改区块数据和日志的文件夹

##zec

根据 https://docs.zecwallet.co/faq/#can-i-change-the-location-of-the-data-directory

%HOMEPATH%\AppData\Roaming\Zcash\zcash.conf
或
%AppData%\Roaming\Zcash\zcash.conf

添加：
datadir=/your/new/path

https://zecpages.com/


