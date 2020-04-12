---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《比特币：深度解析》

## 1.bitcoin source code

Walk through Sourcecode 源码解读

<span style="color:red">
refer: https://github.com/lyhistory/blockchain_btc/blob/master/basic/bitcoincore_v0.17.1_sourcecode.txt
</span>

Nobody Understands Bitcoin (And That’s OK)
https://blog.lopp.net/nobody-understands-bitcoin-and-thats-ok/

### 1.1 Overview architecture

Bitcoin Core architecture overview 
http://diyhpl.us/wiki/transcripts/scalingbitcoin/tokyo-2018/edgedevplusplus/overview-bitcoin-core-architecture/

Dev++ 02-22-EN | An overview of Bitcoin Core architecture - James O'Beirne | Platforms:
	- slides: http://jameso.be/dev++2018/
	- video: https://www.youtube.com/watch?v=L_sI_tXmy2U

![](/docs/docs_image/blockchain/btc/btc_indepth_sourcecode01.png) 

### 1.2 Code Anatomy

![](/docs/docs_image/blockchain/btc/btc_indepth_sourcecode02.png) 

[Bitcoin Core 0.11 (ch 3): Initialization and Startup](https://en.bitcoin.it/wiki/Bitcoin_Core_0.11_(ch_3):_Initialization_and_Startup)

[Bitcoin Core 0.11 (ch 5): Initial Block Download](https://en.bitcoin.it/wiki/Bitcoin_Core_0.11_(ch_5):_Initial_Block_Download)

**network sync: net_processing:**

Header first IBD
https://bitcoin.org/en/glossary/headers-first-sync
https://bitcoin.org/en/glossary/initial-block-download
https://bitcoin.org/en/developer-guide#headers-first
https://bitcoin.stackexchange.com/questions/44400/can-there-be-stale-blocks-in-header-first-implementation

**request management system**

![](/docs/docs_image/blockchain/btc/btc_indepth_sourcecode03.png) 
> To minimize information spread in the network,  messages are propagated in the Bitcoin network with the help of an advertisement-based request management system. Namely, if node A receives information about a new Bitcoin object (e.g., a transaction or a block)from another node,A will advertise this object to its other connections (e.g. nodeV) by sending them an inv message; these messages are much smaller in size than the actual objects, because they only contain the hash and the type of object which is advertised. Only if node V has not previously received the object advertised by the inv message,V will request the object from A with a getdata request.Following the Bitcoin protocol, nodeAwill subsequently respondwith a Bitcoin object, e.g., the contents of a transaction or a block.By doing so, inventory messages limit the amount of data broadcast in the network. Notice that in case the object advertised corresponds to a block, neighbor V first requests the block header before the actual block data.  Here, when a block header is advertised via a headers message, the receiving node internally stores the highest block known by the sending peer. The receiving node also validates any received header, by verifying its corresponding PoW. Transactions, on the other hand, are requested directly using a transaction inv message. 
> https://eprint.iacr.org/2015/578.pdf

## 2. topic

### 2.1 Atomic transactions

atomic transaction       	http://www.ofnumbers.com/2014/01/28/what-is-an-atomic-transaction/
Atomic cross-chain trading https://en.bitcoin.it/wiki/Atomic_cross-chain_trading
In short, when exchanging one cryptocoin with another (such as a Bitcoin for a Litecoin or colored coins), either the trade occurs or it does not.  Michael Goldstein explains this concisely over at Lex Cryptographia:
Two parties agree to exchange one cryptocurrency for another, and the transaction is done in such a way that neither side can execute their portion of the trade without releasing funds to the other party. The trade either happens in its entirety, or not at all, which means nobody can walk away empty-handed. The worse possible outcome is that no trade occurs at all and everybody keeps what they had.
The key is the nLockTime function described in Atomic cross-chain trading.  I also recommend looking through the Bitcointalk thread Alt chains and atomic transfers.


### 2.2 Transaction Malleability
            	闪电网络解决方法 sighash no input
            	Segregate witness方法（transaction id不包含签名）
### 2.3 仲裁交易

### 2.4 微支付通道 Micropayment Channel

### 2.5 闪电网络
Revocable Sequence Maturity Contract
HLTC

Ever wanted to run a c-lightning node without having to run bitcoind? Your problems are over: with the new `trustedcoin` plugin you can rely on block explorers for everything!
Still better than Paypal. And it works!

More: https://github.com/fiatjaf/lightningd-gjson-rpc/tree/x1/cmd
Binary: https://github.com/fiatjaf/lightningd-gjson-rpc/releases/tag/x1

手把手教你在树莓派上部署比特币闪电节点+全节点 https://www.weibo.com/ttarticle/p/show?id=2309404252965299998074

### 2.6 segregated witness

## 3. 知识碎片
**# Why Separate execution of unlocking and locking scripts**

https://bitcointalk.org/index.php?topic=5095376.new#new
https://en.bitcoin.it/wiki/Common_Vulnerabilities_and_Exposures
Here you can see a list of all Bitcoin CVEs, including the one you are talking about.

To understand what happened in CVE-2010-5141 you need to understand Script execution and OP_PUSHDATA. When validating a script, bitcoin-core used to use a stack and fusion script_sig with script_pubkey onto it, which led to a stack being :
Code:
<OP_CODEs from scriptsig><OP_CODEs from scriptpubkey>
You could simply use an OP_PUSHDATA in script_sig, which would push the scriptpubkey onto the stack without executing it.
The scriptpubkey not executed resulting in conditions under which you can spend the output that are not set. Thus you could spend any output using OP_PUSHDATA. Now, the code executes script_sig on a stack, copy it (to stackCopy), then executes script_pubkey on stack (the first one).
Here is the link to the function evaluating the script.

**# Timelock Defense Against Fee Sniping ??? don’t understand**

**# chater 07 Complex Script Example**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch07.asciidoc
A few more things to consider when reading this example. See if you can find the answers:
●	Why can’t the lawyer redeem the third execution path at any time by selecting it with FALSE on the unlocking script?
●	How many execution paths can be used 5, 35, and 105 days, respectively, after the UTXO is mined?
●	Are the funds lost if the lawyer loses his key? Does your answer change if 91 days have elapsed?
●	How do the partners "reset" the clock every 29 or 89 days to prevent the lawyer from accessing the funds?
●	Why do some CHECKSIG opcodes in this script have the VERIFY suffix while others don’t?

**# chater 10**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch10.asciidoc

In practice, a miner may intentionally mine a block taking less than the full reward. Such blocks have already been mined and more may be mined in the

Raw transactions
https://bitcoin.stackexchange.com/questions/32628/redeeming-a-raw-transaction-step-by-step-example-required
https://bitcoin.stackexchange.com/questions/29955/how-to-sign-bitcoin-transaction-with-bitcoind-and-non-bitcoind-wallet-private
https://bitcoin.stackexchange.com/questions/30550/is-it-possible-to-create-a-transaction-in-pure-python-without-needing-to-run-bit

**attack**

Grinding attack

https://en.bitcoin.it/wiki/Altcoin
There are also "stake grinding" attacks which require a trivial amount of currency. In a stake[2] grinding attack, the attacker has a small amount of stake and goes through the history of the blockchain and finds places where their stake wins a block. In order to consecutively win, they modify the next block header until some stake they own wins once again. This attack requires a bit of computation, but definately isn't impractical.
https://download.wpsoftware.net/bitcoin/alts.pdf
https://nxtforum.org/general/nxt-stake-grinding-attack/20/

Deep Dive of the History Revision Attack
https://medium.com/@julianwlsn/why-the-history-revision-attack-in-chain-based-proof-of-stake-is-improbable-but-not-impossible-19f9da33847f


## 其他

[比特币分叉历史](https://zhuanlan.zhihu.com/p/62895584)

![](/docs/docs_image/blockchain/btc/btc_indepth_fork01.png) 

Bitcoin Cold Storage Using a Bitcoin Core Wallet https://dev-notes.eu/2017/08/setup-and-manage-bitcoin-core-cold-storage-wallet/

[比特币开发日志](http://www.erisian.com.au/bitcoin-core-dev/)

[比特币背后的技术列表](https://en.bitcoin.it/wiki/Category:Technical)

[Bitcoin core tutorial & code walk through](http://embedded-design-vic.blogspot.com/2017/07/bitcoin-core-tutorial-and-source-code.html)

[比特币源码分析](https://cloud.tencent.com/developer/search/article-%E6%AF%94%E7%89%B9%E5%B8%81%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90)

[bitcoin源码分析](http://orientye.com/?s=bitcoin%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90)

[比特币学习](https://me.csdn.net/loy_184548)

[比特幣源碼分析](https://www.twblogs.net/a/5c840d32bd9eee35fc13cd84)

[比特币源码分析--深入理解比特币交易](https://blog.csdn.net/ztemt_sw2/article/details/81101717)

[从零开始学习比特币开发](https://blog.csdn.net/Ulord_123)

[比特币源码](https://so.csdn.net/so/search/s.do?q=比特币源码&t=blog&u=ITleaks)

[比特币源码研读](https://so.csdn.net/so/search/s.do?q=%E6%AF%94%E7%89%B9%E5%B8%81%E6%BA%90%E7%A0%81&t=blog&u=Fly_hps)

[BTECH](https://www.jianshu.com/u/1a445a76d25b)

https://zhuanlan.zhihu.com/p/25443501
https://github.com/cryptostu/blog/tree/master/source
https://www.jianshu.com/u/ef215107c407


https://www.quora.com/How-do-I-read-Bitcoin-source-code
https://bitcoinedge.org/tutorials
https://bitcoin.stackexchange.com/questions/41692/how-to-understand-bitcoin-source-code
https://bitcointalk.org/index.php?topic=41718.0
