https://twitter.com/atomicalsxyz

https://docs.atomicals.xyz/

https://github.com/atomicals/atomicals-js

## 挖矿
```
# Download the github repo:
git clone https://github.com/atomicals/atomicals-js.git

cd atomicals-js

# Build:
# If you don't have yarn & node installed
# npm install -g node
# npm install -g yarn

yarn install
yarn run build

#See all commands at:

yarn run cli --help


创建钱包并修改为自己的地址
执行命令：yarn cli wallet-init
成功执行后会新建一个wallets文件夹，文件夹下有一个 wallet.json 文件，编辑文件，
基本上都要修改，
phrase是收币钱包助记词，primary下是收币的钱包信息，funding下是付gas钱包信息，我用的都是同一个钱包

开始挖矿： 执行 yarn cli mint-dft quark --satsbyte=100
100是gas费，
当前链上手续https://mempool.space/zh/ 

https://bitatom.io/token/quark
```

## 代打 Satsx
https://www.feixiaohao.com/news/11777263.html


## Troubleshooting
### SyntaxError....yarn-metadata.json Unexpected token '', is not valid json
yarn cache clean 
### 500 error
open .env and replace
https://ep.atomicals.xyz/proxy
to
https://ep.atomicalmarket.com/proxy

[ElectrumX API and Public Endpoints](https://docs.atomicals.xyz/reference-and-tools/electrumx-api-and-public-endpoints)