(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{426:function(e,t,n){e.exports=n.p+"assets/img/ordinal.be032029.png"},513:function(e,t,n){"use strict";n.r(t);var o=n(65),a=Object(o.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("p",[o("a",{attrs:{href:"https://docs.ordinals.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("docs.ordinals.com"),o("OutboundLink")],1)]),e._v(" "),o("p",[e._v("https://en.foresightnews.pro/unveiling-the-mysteries-of-ordinal-inscriptions-a-comprehensive-and-in-depth-popular-science-interpretation/")]),e._v(" "),o("p",[e._v("ZK-proofs 是比特币序数和 BRC-20 问题的答案吗 https://zhuanlan.zhihu.com/p/629604259")]),e._v(" "),o("h2",{attrs:{id:"市场"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#市场"}},[e._v("#")]),e._v(" 市场")]),e._v(" "),o("p",[e._v("https://www.okx.com/web3/marketplace/ordinals/brc20/satx")]),e._v(" "),o("p",[e._v("https://satsx.io/wallet/ordinals")]),e._v(" "),o("h2",{attrs:{id:"ordinal-theory"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#ordinal-theory"}},[e._v("#")]),e._v(" Ordinal Theory")]),e._v(" "),o("p",[e._v("A satoshi is the smallest unit of the Bitcoin currency. 1 BTC is equal to 100 million satoshis. Ordinal theory describes how to label every satoshi with a unique number. The total supply of Bitcoin is 2,100,000,000,000,000 satoshis—which are numbered in the order in which they’re mined. When a new block is mined out, there are some new satoshis with new unique numbers in the coinbase transaction, so every satoshi can have its owner.")]),e._v(" "),o("p",[e._v("Satoshis only live in UTXO. When transactions destroy inputs and create new ones in outputs, satoshis transfer in a first-in-first-out order by Ordinal theory. In the following example, there are two inputs with 5 sats, which are labeled 1 to 5, and 2 sats which are labeled 11 to 12. To assign satoshi numbers to UTXO, go through each satoshi in the inputs in order (1-5 and then 11-12), and assign each to the first available slot in the outputs, which are 1-3, 4-5 and 11. The number 12 doesn’t disappear, it’s just the gas fee that’s sent to the coinbase transaction. You can check out "),o("a",{attrs:{href:"https://github.com/casey/ord/blob/master/bip.mediawiki#specification",target:"_blank",rel:"noopener noreferrer"}},[e._v("the whole algorithm here"),o("OutboundLink")],1),e._v(".\n"),o("img",{attrs:{src:n(426),alt:""}})]),e._v(" "),o("p",[e._v("Ordinal theory virtually converts these fungible token satoshis into non-fungible tokens. Next, we’re going to introduce a way to write something into the witness field(segwit taproot) of one satoshi.")]),e._v(" "),o("p",[e._v("Given a real-world example:\n"),o("a",{attrs:{href:"https://www.blockchain.com/explorer/transactions/btc/474604ceb83691eb44e862d1aaacef61c6b00435fde34f3cc53b74554094ab21",target:"_blank",rel:"noopener noreferrer"}},[e._v("commit(应该是mint出brc token的交易)"),o("OutboundLink")],1),e._v(" and "),o("a",{attrs:{href:"https://www.blockchain.com/explorer/transactions/btc/518d049cf9df009daa943d90b5c21905e682f8e37a4b7a84dfc0f8349b53f045",target:"_blank",rel:"noopener noreferrer"}},[e._v("reveal(用户花费该交易的时候)"),o("OutboundLink")],1),e._v(". At the commit stage, the transaction created two P2TR outputs and the first one is what we need to see. Then at the reveal stage, the Ordinals inscription is able to be found in the witness field.")]),e._v(" "),o("p",[o("a",{attrs:{href:"https://blocto.io/crypto-blog/ecosystem/how-bitcoin-ordinals-nfts-work",target:"_blank",rel:"noopener noreferrer"}},[e._v("Dive into How Bitcoin Ordinals NFTs Work"),o("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=a.exports}}]);