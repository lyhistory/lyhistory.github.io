(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{466:function(t,e,n){"use strict";n.r(e);var o=n(56),a=Object(o.a)({},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("p",[n("a",{attrs:{href:"/docs/blockchain"}},[t._v("回目录")]),t._v("  《比特币：深度解析》")]),t._v(" "),n("h2",{attrs:{id:"_1-bitcoin-source-code"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-bitcoin-source-code"}},[t._v("#")]),t._v(" 1.bitcoin source code")]),t._v(" "),n("p",[t._v("Walk through Sourcecode 源码解读")]),t._v(" "),n("span",{staticStyle:{color:"red"}},[t._v("\nrefer: https://github.com/lyhistory/blockchain_btc/blob/master/basic/bitcoincore_v0.17.1_sourcecode.txt\n")]),t._v(" "),n("p",[t._v("Nobody Understands Bitcoin (And That’s OK)\nhttps://blog.lopp.net/nobody-understands-bitcoin-and-thats-ok/")]),t._v(" "),n("h3",{attrs:{id:"_1-1-overview-architecture"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-overview-architecture"}},[t._v("#")]),t._v(" 1.1 Overview architecture")]),t._v(" "),n("p",[t._v("Bitcoin Core architecture overview\nhttp://diyhpl.us/wiki/transcripts/scalingbitcoin/tokyo-2018/edgedevplusplus/overview-bitcoin-core-architecture/")]),t._v(" "),n("p",[t._v("Dev++ 02-22-EN | An overview of Bitcoin Core architecture - James O'Beirne | Platforms:\n- slides: http://jameso.be/dev++2018/\n- video: https://www.youtube.com/watch?v=L_sI_tXmy2U")]),t._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/blockchain/btc/btc_indepth_sourcecode01.png",alt:""}})]),t._v(" "),n("h3",{attrs:{id:"_1-2-code-anatomy"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-code-anatomy"}},[t._v("#")]),t._v(" 1.2 Code Anatomy")]),t._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/blockchain/btc/btc_indepth_sourcecode02.png",alt:""}})]),t._v(" "),n("p",[n("a",{attrs:{href:"https://en.bitcoin.it/wiki/Bitcoin_Core_0.11_(ch_3):_Initialization_and_Startup",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bitcoin Core 0.11 (ch 3): Initialization and Startup"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://en.bitcoin.it/wiki/Bitcoin_Core_0.11_(ch_5):_Initial_Block_Download",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bitcoin Core 0.11 (ch 5): Initial Block Download"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("strong",[t._v("network sync: net_processing:")])]),t._v(" "),n("p",[t._v("Header first IBD\nhttps://bitcoin.org/en/glossary/headers-first-sync\nhttps://bitcoin.org/en/glossary/initial-block-download\nhttps://bitcoin.org/en/developer-guide#headers-first\nhttps://bitcoin.stackexchange.com/questions/44400/can-there-be-stale-blocks-in-header-first-implementation")]),t._v(" "),n("p",[n("strong",[t._v("request management system")])]),t._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/blockchain/btc/btc_indepth_sourcecode03.png",alt:""}})]),t._v(" "),n("blockquote",[n("p",[t._v("To minimize information spread in the network,  messages are propagated in the Bitcoin network with the help of an advertisement-based request management system. Namely, if node A receives information about a new Bitcoin object (e.g., a transaction or a block)from another node,A will advertise this object to its other connections (e.g. nodeV) by sending them an inv message; these messages are much smaller in size than the actual objects, because they only contain the hash and the type of object which is advertised. Only if node V has not previously received the object advertised by the inv message,V will request the object from A with a getdata request.Following the Bitcoin protocol, nodeAwill subsequently respondwith a Bitcoin object, e.g., the contents of a transaction or a block.By doing so, inventory messages limit the amount of data broadcast in the network. Notice that in case the object advertised corresponds to a block, neighbor V first requests the block header before the actual block data.  Here, when a block header is advertised via a headers message, the receiving node internally stores the highest block known by the sending peer. The receiving node also validates any received header, by verifying its corresponding PoW. Transactions, on the other hand, are requested directly using a transaction inv message.\nhttps://eprint.iacr.org/2015/578.pdf")])]),t._v(" "),n("h2",{attrs:{id:"_2-topic"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-topic"}},[t._v("#")]),t._v(" 2. topic")]),t._v(" "),n("h3",{attrs:{id:"_2-1-atomic-transactions"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-atomic-transactions"}},[t._v("#")]),t._v(" 2.1 Atomic transactions")]),t._v(" "),n("p",[t._v("atomic transaction       \thttp://www.ofnumbers.com/2014/01/28/what-is-an-atomic-transaction/\nAtomic cross-chain trading https://en.bitcoin.it/wiki/Atomic_cross-chain_trading\nIn short, when exchanging one cryptocoin with another (such as a Bitcoin for a Litecoin or colored coins), either the trade occurs or it does not.  Michael Goldstein explains this concisely over at Lex Cryptographia:\nTwo parties agree to exchange one cryptocurrency for another, and the transaction is done in such a way that neither side can execute their portion of the trade without releasing funds to the other party. The trade either happens in its entirety, or not at all, which means nobody can walk away empty-handed. The worse possible outcome is that no trade occurs at all and everybody keeps what they had.\nThe key is the nLockTime function described in Atomic cross-chain trading.  I also recommend looking through the Bitcointalk thread Alt chains and atomic transfers.")]),t._v(" "),n("h3",{attrs:{id:"_2-2-transaction-malleability"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-transaction-malleability"}},[t._v("#")]),t._v(" 2.2 Transaction Malleability")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",[n("code",[t._v("        \t闪电网络解决方法 sighash no input\n        \tSegregate witness方法（transaction id不包含签名）\n")])])]),n("h3",{attrs:{id:"_2-3-仲裁交易"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-仲裁交易"}},[t._v("#")]),t._v(" 2.3 仲裁交易")]),t._v(" "),n("h3",{attrs:{id:"_2-4-微支付通道-micropayment-channel"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-微支付通道-micropayment-channel"}},[t._v("#")]),t._v(" 2.4 微支付通道 Micropayment Channel")]),t._v(" "),n("h3",{attrs:{id:"_2-5-闪电网络"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-闪电网络"}},[t._v("#")]),t._v(" 2.5 闪电网络")]),t._v(" "),n("p",[t._v("Revocable Sequence Maturity Contract\nHLTC")]),t._v(" "),n("p",[t._v("Ever wanted to run a c-lightning node without having to run bitcoind? Your problems are over: with the new "),n("code",[t._v("trustedcoin")]),t._v(" plugin you can rely on block explorers for everything!\nStill better than Paypal. And it works!")]),t._v(" "),n("p",[t._v("More: https://github.com/fiatjaf/lightningd-gjson-rpc/tree/x1/cmd\nBinary: https://github.com/fiatjaf/lightningd-gjson-rpc/releases/tag/x1")]),t._v(" "),n("p",[t._v("手把手教你在树莓派上部署比特币闪电节点+全节点 https://www.weibo.com/ttarticle/p/show?id=2309404252965299998074")]),t._v(" "),n("h3",{attrs:{id:"_2-6-segregated-witness"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-segregated-witness"}},[t._v("#")]),t._v(" 2.6 segregated witness")]),t._v(" "),n("h2",{attrs:{id:"_3-知识碎片"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-知识碎片"}},[t._v("#")]),t._v(" 3. 知识碎片")]),t._v(" "),n("p",[n("strong",[t._v("# Why Separate execution of unlocking and locking scripts")])]),t._v(" "),n("p",[t._v("https://bitcointalk.org/index.php?topic=5095376.new#new\nhttps://en.bitcoin.it/wiki/Common_Vulnerabilities_and_Exposures\nHere you can see a list of all Bitcoin CVEs, including the one you are talking about.")]),t._v(" "),n("p",[t._v("To understand what happened in CVE-2010-5141 you need to understand Script execution and OP_PUSHDATA. When validating a script, bitcoin-core used to use a stack and fusion script_sig with script_pubkey onto it, which led to a stack being :\nCode:\n<OP_CODEs from scriptsig><OP_CODEs from scriptpubkey>\nYou could simply use an OP_PUSHDATA in script_sig, which would push the scriptpubkey onto the stack without executing it.\nThe scriptpubkey not executed resulting in conditions under which you can spend the output that are not set. Thus you could spend any output using OP_PUSHDATA. Now, the code executes script_sig on a stack, copy it (to stackCopy), then executes script_pubkey on stack (the first one).\nHere is the link to the function evaluating the script.")]),t._v(" "),n("p",[n("strong",[t._v("# Timelock Defense Against Fee Sniping ??? don’t understand")])]),t._v(" "),n("p",[n("strong",[t._v("# chater 07 Complex Script Example")])]),t._v(" "),n("p",[t._v('https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch07.asciidoc\nA few more things to consider when reading this example. See if you can find the answers:\n●\tWhy can’t the lawyer redeem the third execution path at any time by selecting it with FALSE on the unlocking script?\n●\tHow many execution paths can be used 5, 35, and 105 days, respectively, after the UTXO is mined?\n●\tAre the funds lost if the lawyer loses his key? Does your answer change if 91 days have elapsed?\n●\tHow do the partners "reset" the clock every 29 or 89 days to prevent the lawyer from accessing the funds?\n●\tWhy do some CHECKSIG opcodes in this script have the VERIFY suffix while others don’t?')]),t._v(" "),n("p",[n("strong",[t._v("# chater 10")])]),t._v(" "),n("p",[t._v("https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch10.asciidoc")]),t._v(" "),n("p",[t._v("In practice, a miner may intentionally mine a block taking less than the full reward. Such blocks have already been mined and more may be mined in the")]),t._v(" "),n("p",[t._v("Raw transactions\nhttps://bitcoin.stackexchange.com/questions/32628/redeeming-a-raw-transaction-step-by-step-example-required\nhttps://bitcoin.stackexchange.com/questions/29955/how-to-sign-bitcoin-transaction-with-bitcoind-and-non-bitcoind-wallet-private\nhttps://bitcoin.stackexchange.com/questions/30550/is-it-possible-to-create-a-transaction-in-pure-python-without-needing-to-run-bit")]),t._v(" "),n("p",[n("strong",[t._v("attack")])]),t._v(" "),n("p",[t._v("Grinding attack")]),t._v(" "),n("p",[t._v('https://en.bitcoin.it/wiki/Altcoin\nThere are also "stake grinding" attacks which require a trivial amount of currency. In a stake[2] grinding attack, the attacker has a small amount of stake and goes through the history of the blockchain and finds places where their stake wins a block. In order to consecutively win, they modify the next block header until some stake they own wins once again. This attack requires a bit of computation, but definately isn\'t impractical.\nhttps://download.wpsoftware.net/bitcoin/alts.pdf\nhttps://nxtforum.org/general/nxt-stake-grinding-attack/20/')]),t._v(" "),n("p",[t._v("Deep Dive of the History Revision Attack\nhttps://medium.com/@julianwlsn/why-the-history-revision-attack-in-chain-based-proof-of-stake-is-improbable-but-not-impossible-19f9da33847f")]),t._v(" "),n("h2",{attrs:{id:"其他"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#其他"}},[t._v("#")]),t._v(" 其他")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://jimmysong.substack.com/people/1811560-jimmy-song",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bitcoin tech talk"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/62895584",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币分叉历史"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("img",{attrs:{src:"/docs/docs_image/blockchain/btc/btc_indepth_fork01.png",alt:""}})]),t._v(" "),n("p",[t._v("Bitcoin Cold Storage Using a Bitcoin Core Wallet https://dev-notes.eu/2017/08/setup-and-manage-bitcoin-core-cold-storage-wallet/")]),t._v(" "),n("p",[n("a",{attrs:{href:"http://www.erisian.com.au/bitcoin-core-dev/",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币开发日志"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://en.bitcoin.it/wiki/Category:Technical",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币背后的技术列表"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"http://embedded-design-vic.blogspot.com/2017/07/bitcoin-core-tutorial-and-source-code.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Bitcoin core tutorial & code walk through"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://cloud.tencent.com/developer/search/article-%E6%AF%94%E7%89%B9%E5%B8%81%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币源码分析"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"http://orientye.com/?s=bitcoin%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90",target:"_blank",rel:"noopener noreferrer"}},[t._v("bitcoin源码分析"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://me.csdn.net/loy_184548",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币学习"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://www.twblogs.net/a/5c840d32bd9eee35fc13cd84",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特幣源碼分析"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://blog.csdn.net/ztemt_sw2/article/details/81101717",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币源码分析--深入理解比特币交易"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://blog.csdn.net/Ulord_123",target:"_blank",rel:"noopener noreferrer"}},[t._v("从零开始学习比特币开发"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://so.csdn.net/so/search/s.do?q=%E6%AF%94%E7%89%B9%E5%B8%81%E6%BA%90%E7%A0%81&t=blog&u=ITleaks",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币源码"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://so.csdn.net/so/search/s.do?q=%E6%AF%94%E7%89%B9%E5%B8%81%E6%BA%90%E7%A0%81&t=blog&u=Fly_hps",target:"_blank",rel:"noopener noreferrer"}},[t._v("比特币源码研读"),n("OutboundLink")],1)]),t._v(" "),n("p",[n("a",{attrs:{href:"https://www.jianshu.com/u/1a445a76d25b",target:"_blank",rel:"noopener noreferrer"}},[t._v("BTECH"),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("https://zhuanlan.zhihu.com/p/25443501\nhttps://github.com/cryptostu/blog/tree/master/source\nhttps://www.jianshu.com/u/ef215107c407")]),t._v(" "),n("p",[t._v("https://www.quora.com/How-do-I-read-Bitcoin-source-code\nhttps://bitcoinedge.org/tutorials\nhttps://bitcoin.stackexchange.com/questions/41692/how-to-understand-bitcoin-source-code\nhttps://bitcointalk.org/index.php?topic=41718.0")])])}),[],!1,null,null,null);e.default=a.exports}}]);