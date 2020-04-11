
Bitcoin Improvement Proposals
https://github.com/bitcoinbook/bitcoinbook/blob/second_edition_print3_rc2/appdx-bips.asciidoc
https://github.com/bitcoin/bips


HD wallet: BIP32&&BIP44

## BIP32
https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
http://bip32.org/

![](/docs/docs_image/blockchain/btc/btc_bip01.png)

knowing an extended private key allows reconstruction of all descendant private keys and public keys, and knowing an extended public keys allows reconstruction of all descendant non-hardened public keys. 
One weakness that may not be immediately obvious, is that knowledge of a parent extended public key plus any non-hardened private key descending from it is equivalent to knowing the parent extended private key (and thus every private and public key descending from it). This means that extended public keys must be treated more carefully than regular public keys. It is also the reason for the existence of hardened keys, and why they are used for the account level in the tree. This way, a leak of account-specific (or below) private key never risks compromising the master or other accounts. 

![](/docs/docs_image/blockchain/btc/btc_bip02.png)

https://www.youtube.com/watch?v=2HrMlVr1QX8
https://www.mobilefish.com/developer/blockchain/blockchain_quickguide_tutorial.html

Bip32 support
https://bitcoincore.org/en/2016/08/23/release-0.13.0/
Can we derive parent’s private key using child’s private key? https://bitcoin.stackexchange.com/questions/76296/can-we-derive-parent-s-private-key-using-child-s-private-key

## BIP39

![](/docs/docs_image/blockchain/btc/btc_bip03_01.png)

Asymmetric mnemonic
https://github.com/libbitcoin/libbitcoin-explorer/issues/366

![](/docs/docs_image/blockchain/btc/btc_bip03.png)

https://github.com/iancoleman/bip39
http://8btc.com/thread-65996-1-1.html

generate eos keys from Mnemonic/Seed
https://eosio.stackexchange.com/questions/397/generate-eos-keys-from-mnemonic-seed

```
const hdkey = require('hdkey')
const wif = require('wif')
const ecc = require('eosjs-ecc')
const bip39 = require('bip39')
const mnemonic = 'real flame win provide layer trigger soda erode upset rate beef wrist fame design merit'
const seed = bip39.mnemonicToSeedHex(mnemonic)
const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
const node = master.derive("m/44'/194'/0'/0/0")
console.log("publicKey: "+ecc.PublicKey(node._publicKey).toString())
console.log("privateKey: "+wif.encode(128, node._privateKey, false))
```

https://github.com/Nadejde/eos-token-sale
https://github.com/EOSIO/eos/issues/3816

数字货币钱包 - 助记词 及 HD 钱包密钥原理 https://blog.csdn.net/omnispace/article/details/79816141

## BIP44

https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
m / purpose' / coin_type' / account' / change / address_index

![](/docs/docs_image/blockchain/btc/btc_bip04.png)

https://www.arcblock.io/zh/post/2018/12/01/hd-wallets-design-and-implementation

## BIP38
https://docs.wasabiwallet.io/FAQ/FAQ-UseWasabi.html#wallet-manager
https://www.meetup.com/Open-Blockchain-Workshop-Series/events/269152809/


## HD Wallet Implementation

### Product Concern

![](/docs/docs_image/blockchain/btc/btc_bip06.png)

https://github.com/stvenyin/JUNAHAN-A/blob/master/blockchain/bitcoin-wallet-security.org

![](/docs/docs_image/blockchain/btc/btc_bip07.png)

### Standard

Python
https://github.com/primal100/pybitcointools

Web version
https://github.com/webhdwallet/webhdwallet.github.io

Javascript 
https://www.mobilefish.com/download/ethereum/hd_wallet.html

Android 
https://juejin.im/post/5bd47456f265da0ae5055aac

Making your own safety cold Ethereum HD wallet using Golang https://medium.com/@idhww/making-your-own-safety-cold-ethereum-hd-wallet-using-golang-b6f34b359c8f


Rubby 
https://github.com/GemHQ/money-tree

Hierarchical Deterministic Multisig - The Next Evolutionary Step for Bitcoin Wallets https://www.reddit.com/r/Bitcoin/comments/2sx793/hierarchical_deterministic_multisig_the_next/

### Mutltisig
The BitGo Platform and SDK makes it easy to build multi-signature Bitcoin applications
https://bitgo.github.io/bitgo-docs/zh-CN/index.html#getting-started

![](/docs/docs_image/blockchain/btc/btc_bip05.png)

For business 
https://www.youtube.com/watch?v=-54TzpEIGsY
https://www.youtube.com/watch?v=mWrILLg3Ueo
https://www.youtube.com/channel/UCtE0hm1_QuVUijoPaKfy0Eg


