
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
https://bitatom.io


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
### SyntaxError....yarn-metadata.json Unexpected token '', is not valid json
yarn cache clean 
### 500 error
open .env and replace
https://ep.atomicals.xyz/proxy
to
https://ep.atomicalmarket.com/proxy

[ElectrumX API and Public Endpoints](https://docs.atomicals.xyz/reference-and-tools/electrumx-api-and-public-endpoints)