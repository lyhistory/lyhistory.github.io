---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《区块链：深度解析》

## 1. 区块链深度基础

### 1.1 Mining AND Consensus Algorithm 挖矿与共识

**详解在另一篇[ 《区块链基础：解密挖矿与共识的误解》](/docs/blockchain/consensus)**

Consensus is a form of automated governance that populates and publishes ledger entries every x period. The “blockchain” is proof that this automated governance structure actually works as designed, providing near ABSOLUTE assurance over the integrity of the ledger data.
-	https://blog.goodaudience.com/1-assurances-in-crypto-14c55a1fd616

POW POS DAG are not consensus protocol, they are “mining mechanism” or “sybil control mechanisms” specifically https://twitter.com/el33th4xor/status/1006931658338177024
Consensus Protocol is the process of accepting transactions(validate transactions on receive) and blocks(validate pow/pos[block headers] and actual payloads[block transactions] on receive)
PoW, PoS and DAGs are NOT consensus protocols https://medium.com/coinmonks/a-primer-on-blockchain-design-89605b287a5a

#### 1.1.1 Mining mechanism
Lottery game, find solve for puzzle
Proof of Work vs. Proof of Stake – What’s the Difference, and Which is Better? www.livebitcoinnews.com/proof-work-vs-proof-stake-whats-difference-better/
https://ethereum.stackexchange.com/questions/15176/logic-of-ethereum-consensus-part-1
https://ethereum.stackexchange.com/questions/15177/logic-of-ethereum-consensus-part-2
https://medium.com/@robertgreenfieldiv/explaining-proof-of-stake-f1eae6feb26f
https://blockgeeks.com/guides/proof-of-work-vs-proof-of-stake/
Understanding Blockchain Fundamentals, Part 2: Proof of Work & Proof of Stake https://medium.com/loom-network/understanding-blockchain-fundamentals-part-2-proof-of-work-proof-of-stake-b6ae907c7edb
https://medium.com/@simoncheong/how-it-works-high-speed-super-large-ledger-technology-83b4d9a7e114

##### 1.1.1.1 POW

Find nonce for block (block level)
https://en.wikipedia.org/wiki/Proof-of-work_system

##### 1.1.1.2 POS

Find utxo for coinstake transaction (transaction level)
Coinstake transactions
Staking transactions

Eth casper
https://github.com/ethereum/wiki/wiki/Proof-of-Stake-FAQ

POS V1
Peercoin 
https://peercoin.net/whitepapers/peercoin-paper.pdf
https://github.com/peercoin/rfcs

The proof-of-stake in the new type of blocks is a special transaction called coinstake (named after Bitcoin’s special transaction coinbase). In the coinstake transaction block owner pays himself thereby consuming his coin age, while gaining the privilege of generating a block for the network and minting for proof-of-stake. The first input of coinstake is called kernel and is required to meet certain hash target protocol, thus making the generation of proof-of-stake blocks a stochastic process similar to proof-ofwork blocks. However an important difference is that the hashing operation is done over a limited search space (more specifically one hash per unspent wallet-output per second) instead of an unlimited search space as in proof-of-work, thus no significant consumption of energy is involved. 
POS V3
The missing explanation of Proof of Stake Version 3
http://earlz.net/view/2017/07/27/1904/the-missing-explanation-of-proof-of-stake-version
Qtum
https://blog.qtum.org/qtums-proof-of-stake-consensus-at-a-high-level-ea53e051ac66

Implementation:

Stake(stay online, hold UTXOs of himself)
=> try every time interval, with ‘next block timestamp’, find “coinbase kernel”/”staking transaction”/coinstake transaction, that meets the target difficulty (calculated by utxo value)
// Hash256("Stake Modifier V2" + "UTXO Transaction Timestamp" + "UTXO Transaction Hash" + "UTXO Output Number" + "Coinstake Transaction Time") < Target * Weight
https://bitcoin.stackexchange.com/questions/52321/how-is-a-proof-of-stake-block-mined-at-the-block-level-and-how-does-it-accompli
Proof-of-Stake (PoS) implementation https://academy.stratisplatform.com/FullNode/PoS/PoS-introduction.html

https://academy.stratisplatform.com/FullNode/ProvenHeaders/proven-headers-introduction.html

##### 1.1.1.3 DPOS

DPOS共识算法—缺失的白皮书 https://lilymoana.github.io/DPOS.html

缺失的白皮书：DPOS共识算法工作原理及鲁棒性根源分析 
https://www.leiphone.com/news/201706/JfsBmaf6Y0ZtV11R.html

DPOS Consensus Algorithm - The Missing White Paper https://steemit.com/dpos/@dantheman/dpos-consensus-algorithm-this-missing-white-paper

#### 1.1.2 共识算法 Consensus Protocol

拜占庭将军问题具体参考[《从故障容错分布式系统到拜占庭容错分布式账本》](/docs/software/highlevel/distrubuted_system)

**Nakamoto consensus**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch10.asciidoc#decentralized-consensus
Check pow (target difficulty)
Check timestamp(between last 11 median and future 2 hours)
Check transactions

https://www.youtube.com/watch?v=fw3WkySh_Ho
Consensus Algorithms, Blockchain Technology and Bitcoin UCL - by Andreas M. Antonopoulos

**PBFT**

PBFT PracticalByzantineFaultTolerance
http://pmg.csail.mit.edu/papers/osdi99.pdf
区块链共识算法 PBFT（拜占庭容错）、PAXOS、RAFT简述 https://blog.csdn.net/jerry81333/article/details/74303194
从Paxos到区块链 http://catkang.github.io/2018/03/24/paxos-pbft-pow.html
[区块链] 共识算法之争（PBFT，Raft，PoW，PoS，DPoS，Ripple） https://www.cnblogs.com/X-knight/p/9157814.html

DPOS+PBFT 
https://bbs.asch.io/topic/1883/阿希的dpos-pbft共识机制是如何运作的


### 1.2 Permission design

whether permission is needed to
access the blockchain;

### 1.3 cryptocurrency & smart contract

都是在矿工节点上验证执行，储存位置

### 1.4 安全问题-共识算法和智能合约

#### 1.4.1 Consensus attack 共识漏洞

重放攻击 replay attack
Dos denial-of-service
Double spend
Sybil attacks: Protected by mining mechanism (pow/pos)

opportunistic attacks
Nothing-At-Stake problem 
https://www.youtube.com/watch?v=-XXV2q6206Q
https://ethereum.stackexchange.com/questions/2402/what-exactly-is-the-nothing-at-stake-problem
https://medium.com/coinmonks/understanding-proof-of-stake-the-nothing-at-stake-theory-1f0d71bc027
Long range attack
https://www.youtube.com/watch?v=cct-YpOqOpA

Resource exhaustion attack(on pos)
	https://medium.com/@dsl_uiuc/fake-stake-attacks-on-chain-based-proof-of-stake-cryptocurrencies-b8b05723f806
	http://fc19.ifca.ai/preproceedings/180-preproceedings.pdf
	https://github.com/initc3/i-cant-believe-its-not-stake

Time warp attack
	The Bitcoin Protocol (consensus rules) has two relevant rules for the timestamps in block headers:
	1.	A node will not accept a block whose timestamp is more than two hours in the future.
	2.	A node will not accept a block unless it has a timestamp greater than the median of the previous 11 blocks. In Bitcoin, we call this Median-Time-Past (MTP).

Blocks are considered valid if their time is greater than the median of the last 11 blocks and less than currentTime + 2 hours, so it's legal for an attacker to create a new version of an old block with a time far in the future. If this is the first block in a retarget period, then the difficulty will quadruple after that period. If it's the last block, then the difficulty will be divided by four. (Difficulty adjustments are limited to *4 or /4.) 
https://bitcoin.stackexchange.com/questions/75831/what-is-time-warp-attack-and-how-does-it-work-in-general
https://blog.theabacus.io/the-verge-hack-explained-7942f63a3017
https://bitcoin.stackexchange.com/questions/1511/gaming-the-off-by-one-bug-difficulty-re-target-based-on-2015-instead-of-2016
https://bitcoin.stackexchange.com/questions/20597/where-exactly-is-the-off-by-one-difficulty-bug
https://bitcointalk.org/index.php?topic=43692.msg521772#msg521772
https://bitcointalk.org/index.php?topic=43692.msg521772#msg521772
https://bitcointalk.org/index.php?topic=3256693.0

What prevents similar time-warp attacks in Bitcoin as happened to Verge? https://bitcoin.stackexchange.com/questions/75438/what-prevents-similar-time-warp-attacks-in-bitcoin-as-happened-to-verge
https://forum.zcashcommunity.com/t/how-does-someone-find-a-17-blocks-in-4-seconds-time-warp-attack/1583/17

#### 1.4.2 Contract attack 合约漏洞

DAO攻击
SmartMesh Announcement on Ethereum Smart Contract Overflow Vulnerability https://medium.com/@smartmesh/smartmesh-announcement-on-ethereum-smart-contract-overflow-vulnerability-f1ded8777720

干货分享：Qtum量子链开发者公开经典PoS协议的一个DoS攻击向量 www.8btc.com/qtum-pos-dos

#### 1.4.3 交易漏洞

比如使用第三方的库要小心，可能会有坑

#### 1.4.3 案例分析  attack analysis

https://en.bitcoin.it/wiki/Weaknesses
https://en.bitcoin.it/wiki/Common_Vulnerabilities_and_Exposures


** CVE-2018-17144: DOS & Double spend**

BitcoinCore CVE-2018-17144 漏洞研究与分析 https://paper.seebug.org/742/
https://hackernoon.com/bitcoin-core-bug-cve-2018-17144-an-analysis-f80d9d373362
https://bitcoin.stackexchange.com/questions/84026/reproduce-cve-2018-17144-inflation-bug-on-regtest-for-learning/86101#86101
Validation.cpp UpdateCoins
CCoinsViewCache::SpendCoin()
CCoinsViewCache::FetchCoin()
CCoinsViewCache::AddCoin()
Coin Flag
	0	from parent(前驱区块）
	Dirty | FRESH （普通交易）
		
	DIRTY	 1<<0 = 1 （普通交易）
	FRESH 1<<1 = 2

![](/docs/docs_image/blockchain/blockchain_indepth01.png)

**header first - fill-disk attack**

https://bitcoin.stackexchange.com/questions/76018/how-does-headers-first-prevent-fill-disk-attack
checkpoints
https://en.bitcoin.it/wiki/Bitcoin_Core_0.11_(ch_5):_Initial_Block_Download#Checkpoints

![](/docs/docs_image/blockchain/blockchain_indepth02.png)

Compact block
https://bitcoincore.org/en/2016/06/07/compact-blocks-faq/

**deep reorg - network disruption **

On the new deep reorg protection https://www.reddit.com/r/btc/comments/9z1gjo/on_the_new_deep_reorg_protection/


**Other**

Pywallet安全事件https://www.chaindd.com/3125336.html


## 2. 張韡武学长讲座总结 Overview From zhang weiwu’s view

normal search - > binary search -> hastable -> collision (chain, prob)

Hash=>Digital Signature=>Blockchain

### 2.1 Hash
	Non encrypted hasdh
	Encrypted hash
		Hmac Length extension attack
	Encrypted hash -- along with other information, such as the hashing algorithm
		Digital signature
### 2.2 Digital signature
Integrity
	Information not tampered
Although encryption hides the contents of a message, it may be possible to change an encrypted message without understanding it. (Some encryption algorithms, known as nonmalleable ones, prevent this, but others do not.) However, if a message is digitally signed, any change in the message after signature invalidates the signature
Authenticity
	Message is sent by the user
Non-repudiation
an entity that has signed some information cannot at a later time deny having signed it. Similarly, access to the public key only does not enable a fraudulent party to fake a valid signature

**PKI based digital signature schema：**

Dsa
Rsa
ecc

**Blockchain based digital signature schema：**

why?
Example:
	I love you to someone face in face, that’s not unique, can be ‘double spend’ by saying I love you to someone else.
	I love you to someone broadcast to blockchain

Blockchain-Powered Digital Signatures https://sphereon.com/why-blockchain-powered-digital-signatures-are-better/
block chain, e-signature, and PKI/EIDAS https://www.quora.com/What-is-the-difference-between-block-chain-e-signature-and-PKI-EIDAS
Blockchain and Digital Signatures https://medium.com/@lyaffe/blockchain-and-digital-signatures-376954738b4a
Digital signatures and the blockchain https://www.linkedin.com/pulse/digital-signatures-blockchain-sean-au/
Using blockchains as an alternative to PKIs for digital signatures
http://blog.pdf-tools.com/2016/10/using-blockchains-as-alternative-to.html

Transaction hash and Ecrecover
Blockchain Transaction Authentication and Security www.ascdi.com/blockchain-transaction-authentication-and-security/

### 2.3 Merkle
1.someone hold private key sign the merke tree, like traditional ca sign it, or the gov will sign it
2.no central authority sign it, but it will be ‘signed’ by POW, by adding a nonuce or anymore values, to create a new hash preceding with enough 0s

the block in blockchain explained (merkle trees)
http://haroldcarr.com/posts/2017-07-31-the-block-in-blockchain-merkle-trees.html

ETH Patricia Tries:
	Merkle Trees and Patricia Tries - Blockchain for Developers [Lab 7] https://www.youtube.com/watch?v=wwrf87bq6jo
EOS Merkle tree - LCV:
	https://github.com/EOSIO/Documentation/blob/master/TechnicalWhitePaper.md
	通过EOS.IO的默克尔证明实现区块链间通信 https://www.weibo.com/ttarticle/p/show?id=2309404181938423384064
	> EOS 的 Block 上只存了 Merkle root，并没有存整个 tree。这个问题 Vitalik Buterin 和 Dan 辩论过一次，V 认为 EOS 这是投机取巧，Dan 认为 Merkle tree 的存在是为了校验状态（交易是否存在），而状态应该是区块链上的记录回放的结果，不应该属于共识的一部分，也不用记录在区块上，并且 EOS 也是支持利用 Merkle 做轻客户端证明的。但具体 EOS 怎么存这个，我自己还没看太明白。
	> https://zhuanlan.zhihu.com/p/34046714
	
Merkle in time 

Bitmap , bloom filter


黑客的黄金时代：区块链还有很长的路要走 https://zhuanlan.zhihu.com/p/34338934
公钥真是公开的吗？ https://alphawallet.com/公钥真是公开的吗？/
DXC 区块链架构师 张韡武 - 彪悍的区块链来了
https://myslide.cn/slides/4665#
解决集成需求才是未来区块链业务的重点 https://zhuanlan.zhihu.com/p/36113034
聊聊数字签名(Digital Signature) https://alphawallet.com/%E8%81%8A%E8%81%8A%E6%95%B0%E5%AD%97%E7%AD%BE%E5%90%8Ddigital-signature/



----

Blockchain will simplify business processes and ensure transparency and immutability while eliminating intermediaries in logistics and supply chains.
Courses 
https://github.com/tari-labs

A step by step guide to operate and tokenise your car ownership using Ethereum and IoT  https://link.medium.com/iCTVkYyW94
How to empower small business with Tokenisation, the true killer app for ethereum by  https://link.medium.com/zestYsbR84
Elizabeth Warren wants to break down Amazon — then what? https://link.medium.com/FQvCCv06h5
What is a token? Token-economy 101 https://link.medium.com/HMF3gyd6h5
What is Trust? A preparation for thinking in blockchain. https://link.medium.com/cZIMc9ZZh5
The way we treat data on the blockchain is wrong — this is how it’s supposed to work https://link.medium.com/zOb2EJZ6h5
I failed to purchase $70,000 crypto from CoinTree — that’s good news for you!  https://link.medium.com/dIHcbqe6h5
People fear cryptocurrency… and that’s good news for YOU! https://link.medium.com/Q5UcyDb6h5
Defying the banks with DeFi & AlphaWallet by  https://link.medium.com/dc1t4906h5

How does consensus protect from lying about transactions?
https://bitcoin.stackexchange.com/questions/64605/how-does-consensus-protect-from-lying-about-transactions
NO：
Nakamoto consensus
Miners have two separate functions in the consensus computer: checking that blocks are correctly constructed, or proof-of-work, and checking the validity of transactions in each block. While verifying correct block construction requires a relatively small amount of work (two SHA256 calculations), checking the validity of transactions contained in a block can take much more time for two reasons. First, the number of transactions per block may be large (≈ 800 in Bitcoin at the time of writing, and its capacity may soon be extended to support high transaction rates [6, 7]). Second, expressive transaction scripts in emerging cryptocurrencies such as Ethereum can require significant computational work to verify. These expressions create a new dilemma for miners — whether the miners should verify the validity of scripted transactions or accept them without verification. Miners are incentivized to verify all scripted transactions for the “common good” of the cryptocurrency so to speak. However, verifying scripts consumes computation resources and therefore delays honest miners in the race to mine the next block. We argue that this dilemma leaves open the possibility of attacks which result in unverified transactions on the blockchain. This means that some computation tasks outsourced to cryptocurrenncy-based consensus computers may not execute correctly.


Surviving Crypto Winter — Part One: Mattereum and the Internet of Agreements https://hackernoon.com/surviving-crypto-winter-part-one-mattereum-and-the-internet-of-agreements-19c99453060

作为一名区块链架构师，需要从哪几个纬度去做技术选型？
http://www.infoq.com/cn/articles/technology-selection-as-blockchain-architector

stratum协议原理 https://www.8btc.com/article/54210

全球交易所区块链最新发展及相关思考 https://mp.weixin.qq.com/s/MEN19UIawjjOb6OxqLyL9w

Alternatives to Blockchain https://medium.com/@jimmysong/alternatives-to-blockchain-9f858c0a1f2d
https://weibo.com/ttarticle/p/show?id=2309404248299317160730

Drupal meet Blockchain, Blockchain meet Drupal. https://medium.com/@chainfrog/drupal-meet-blockchain-blockchain-meet-drupal-fe2e4b7b9f47

<disqus/>