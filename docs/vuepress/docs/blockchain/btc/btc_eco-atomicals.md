
## 市场
+ Atomicals
  https://twitter.com/atomicalsxyz
  https://docs.atomicals.xyz/
  https://github.com/atomicals/atomicals-js
+ Wizz Wallet（前 ATOM Wallet）钱包；https://wizzwallet.io
+ 铸造代打平台；https://satsx.io
  https://mirror.xyz/0x69c45F2ef4B15548451A01640bDBB3ED7B613E43/uP24w4QLVm6vOGRVKHRtVLvvg3M-tbJ-vjQ56Gp7678
+ 官方域名查询；https://realm.name/punk
+ ATOM 铭文浏览器；https://atomicalmarket.com/atomical/0
+ fees
  https://mempool.space/

三大市场：
https://atomicalmarket.com
https://satsx.io
https://satsx.io/wallet/atomicals
https://bitatom.io

## arc protocol
|       Text        |                                                                               Atomicals                                                                               |                                                                   Ordinals                                                                   |                            Ethereum ERC721                             |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Value Proposition |                                                                            Digital Objects                                                                            |                                                              Digital Artifacts                                                               |                          Digital Collectibles                          |
|    Blockchains    |                                                                   Bitcoin and all UTXO blockchains                                                                    |                                                       Bitcoin and all UTXO blockchains                                                       |                  Ethereum EVM compatible blockchains                   |
|  Mint Technique   |                                                             Bitcoin: Commit & reveal w/ "atom" envelope.                                                              |                                                 Bitcoin: Commit & reveal w/ "ord" envelope.                                                  |                    Fund and deploy contract account                    |
|   Data Storage    |                                                               Store one or multiple files upon minting                                                                |                                                       Store only one file upon minting                                                       |                              Not defined                               |
|   Dynamic State   |                                                   Define and update app state for basic and any complex file types                                                    |                                              Not defined - can be defined on app specific basis                                              |                Not defined - can be programmed up front                |
|    Validation     |                        Validation currently through the indexing service "electrumx" - in theory it's possible to validate 100% client-side.                          |               Validation currently through the indexing service "ord" - in theory it's possible to validate 100% client-side.                |   Trusts Ethereum  EVM nodes or in practice trust Metamask or Infura   |
|     Indexing      |                             Validation relies on elecrumx atomicals indexer (Python) at the moment for tracking ordinal numbering system.                             |                         Validation relies on ord indexer (Rust) at the moment for tracking ordinal numbering system.                         | Uses native Ethereum EVM nodes or in practice trust Metamask or Infura |
|  Address Format   |                                                       P2TR (Taproot) addresses required for mint and updates.                                                         |                                P2TR (Taproot) addresses are required for all uses such as mint and transfers                                 |                 Uses native Ethereum Account address.                  |
|    Collections    |                                              First-class "Container" NFT for updating collections, sealable permanently.                                              |                                        Not defined but is in progress with parent-child relationships                                        |                        Defined as separate ERC                         |
|   Atomics Swaps   |                                                             Partially Signed Bitcoin Transactions (PBSTs)                                                             |                                                Partially Signed Bitcoin Transactions (PBSTs)                                                 |                        Defined as separate ERC                         |
|  Fungible Tokens  |                 First-class "ARC20" using Satoshis as unit of account. Decentralized and direct minting modes available. Built-in ticker name service                 |  Not provided in base protocol. "BRC20" creates a JSON protocol in an Inscription to define the decentralized mint rules and ticker name.    |                      Defined as ERC20 type tokens                      |
|   Name Service    | Realms are first-class NFTs that represent domain names and digital identities. A new naming standard with no domain suffix, starts with plus "+" sign like +username | Not provided in base protocol. ".names" and ".sats" protocols exist as JSON protocol in an Inscription to define the claim and update rules. |         Existing services such as ENS and Unstoppable Domains          |


## ARC20 挖矿
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

## Realm Names 

Realm Names are human-readable identifiers which can be used to associate network addresses and resource information. A Realm name begins with the plus + sign and has at least one alphabetical character, such as +alice and +agent007 which are both valid names (top-level-realms or TLRs) in the Realm Name System (RNS). Realm names are self-owned and self-managed directly on the Bitcoin blockchain using the Atomicals Digital Object format — which basically means that there is no middle man or centralized registrar. Once you claim a name, it's yours forever or until you transfer it to someone else.

https://docs.atomicals.xyz/realm-names

You can query and search Realm names on https://realm.name 

```
git clone https://github.com/atomicals/atomicals-js.git
cd atomicals-js
npm install
npm run build
npm run cli wallet-init
npm run cli wallets
npm run cli mint-realm "myrealmname"

#Query Realm name
npm run cli get +myrealmname

#You can query the global feed of registered Realms and Atomicals
npm run cli list

```

## Troubleshooting
### Q&A

1.为什么ARC20资产会燃烧?
ARC20作为BTC上的铭文,它的本质与普通BTC别无二致,只是这些聪带有了特殊的ARC20标记, 从而在索引里会被识别为铭文。
因此当ARC20资产和普通BTC混合在一起的时候,有一定几率,ARC20的铭文会被作为普通的BTC 花出去。这种铭文被不小心损耗的现象,叫做铭文燃烧。

2.如何避免ARC20资产被燃烧?
a. 必须使用可以识别ARC20资产的钱包,如Wizz, Unisat。
b. 推荐ARC20铭文与普通BTC资产分开存放。
c. 如果要从钱包包含ARC20铭文的钱包中转出资产/BTC,请确保钱包里有足够的gas (去掉ARC20 资产意外的非铭文BTC)。
d. 如果要从刚刚交易过的,包含ARC20的钱包中转出资产/BTC,请等待ARC20的索引确认。什么 叫等待索引确认?就是钱包里你可以能看到正确的ARC20数量。比如刚买了10张夸克,一定要等 你确认看到了这10张夸克,再去操作你的钱包。

3.夸克之战之后,我现在手里有多个Atomicals的funding钱包,里面的钱能转出来吗?
可以。把funding钱包的私钥导入普通的BTC钱包,把钱转出来。私钥就是Atomicals-js文件夹下面 wallets/wallet.json中Funding对应的WIF。

1. 我手里的Primary钱包里有打废的铭文,可以转出来吗?
可以。把Primary钱包的私钥导入普通的BTC钱包,把钱转出来。私钥就是Atomicals-js文件夹下面 wallets/wallet.json中Primary对应的WIF。

1. Atomicals-js文件夹下的wallets/wallet.json如何理解?
O
wallet.json的初始结构是一组你的钱包,它由一组助记词+Primary钱包+Funding钱包组
成。
O
三者是绑定关系,因为由助记词是可以间接推算得到这两个钱包的。
o
可以整体转移wallet.json中的内容,但是修改其中一部分是不行的。
O 任意修改其中一个钱包,程序是会报错的,因为程序会校验它们的关系。

1. 夸克之战之后,我有多组钱包,我怎么能再接下来的mint中使用它们?
请研究一下 yarn cli wallet import <钱包WIF> <钱包名称> 这个命令,它可以导入别的钱
包,这个钱包可以用来支付gas fee,也可以用来接收铭文。你可以导入多个钱包。

1. 我如何用当前这个funding钱包出gas,铭文打进我的另一个归集铭文的钱包(非当前Primary 钱包)?
首先把你的另一个钱包根据6中的命令导入,然后在未来mint铭文的过程中尝试以下命令:
yarn cli mint-dft dragon --satsbyte 60 --initialowner <导入钱包名称>

1. 我如何用我的另一个funding钱包中的钱付gas,铭文打进当前的Primary钱包?
首先把你的另一个钱包根据6中的命令导入,然后在未来mint铭文的过程中尝试以下命令: yarn cli mint-dft dragon --satsbyte 60 --funding <导入钱包名称>

9.为什么我的钱包里明明有余额,却无法继续打铭文了? Atomicals-js提醒我余额不足。 你的钱包里有余额,但是没有单笔utxo的余额满足当前铭文的需求。你需要归集小额utxo,推荐阅 读:BTC"废“铭文价值回收 & OKX & Sparrow使用技巧
。

### SyntaxError....yarn-metadata.json Unexpected token '', is not valid json
yarn cache clean 
### 500 error
open .env and replace
https://ep.atomicals.xyz/proxy
to
https://ep.atomicalmarket.com/proxy

[ElectrumX API and Public Endpoints](https://docs.atomicals.xyz/reference-and-tools/electrumx-api-and-public-endpoints)