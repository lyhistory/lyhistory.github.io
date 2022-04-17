---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《比特币：开发用例》

## 1. 作为支付手段 Deposit and Withdraw

本文中文版发表在：
[巴比特](https://www.8btc.com/article/381319)

[STEEMIT](https://steemit.com/btc/@lyhistory/tutorial-how-to-add-btc-payment-method)

Recently I was asked to provide a demo of BTC top up and withdraw services to integrate with our website.
As a Chinese saying goes that lay a brick to attract a jade, the purpose I wrote down my thoughts and some notes is only hoping more people would join the discussion and correct me.

Objectives: basically our website provides membership service for users to top up and enjoy attracted discounts and bonus awards, to cater for arising demands that more and more users prefer BTC than fiat currencies, we decide to introduce one more payment channel with requirements described as follows:
For ease of discussion, we ignore commission fee and mining fee from business feasible perspective

### 1.1 Functionalities
1)	Allow users to top up with BTC, so users can transfer in BTC and convert into platform supported fiat balance.

2)	Allow users to withdraw their remained balance and receive converted BTC amount with their own BTC address

### 1.2 Concerns
1)	How to generate and assign BTC address to each user safely without exposing private key

Can be solved by BIP32 Hierarchical deterministic key creation, 
basically we can generate child BTC address from XPUB(parent extension public key), so the web site that communicates to the insecure external network just need to know “parent extension public key”, but we still need to carefully store the XPUB, we shouldn’t treat XPUB as normal PUB, reason explained in BIP32 doc:
[Refer to https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki:
Deterministic wallets do not require such frequent backups, and elliptic curve mathematics permit schemes where one can calculate the public keys without revealing the private keys.
One weakness that may not be immediately obvious, is that knowledge of a parent extended public key plus any non-hardened private key descending from it is equivalent to knowing the parent extended private key (and thus every private and public key descending from it). This means that extended public keys must be treated more carefully than regular public keys. It is also the reason for the existence of hardened keys, and why they are used for the account level in the tree. This way, a leak of account-specific (or below) private key never risks compromising the master or other accounts. ]

2)	How to maintain so many BTC addresses that assigned to users and addresses that used in internal in an efficient manner 

By adopting BIP44 protocol, we can maintain BTC address in a structured and compatible format, for example, according to BIP44, we can design two main accounts for example:
External account(for users):	m/44’/0’/0’/0/address_index
Internal account(for internal use):	m/44’/0’/1’/0/address_index
we can derive fresh BTC key info with parent key and increment address index, 
And by linking btc address info(address,index,creationdate) with userid in the db table, later on we can even implement address recycle logic: simply cross check user top up history and btc address creation date to recycle for example those that haven’t been used for 3 months.

3)	How to manage those “small balance”(accurately should be utxo) received by thousands of BTC addresses that we have assigned to users

Aggregate and transfer the “small balance” into an internal wallet

4)	How do we handle user withdraw requests, should we simply transfer from ‘central wallet’

To be honest, I cannot think of more reasonable design than a central wallet, so in my design, central wallet serve as “settlement reserve funds”, we can use internal account mentioned above in 2) m/44’/0’/1’/0/address_index ,to keep it simple we can just use one fixed account m/44’/0’/1’/0/0, and we should also keep monitoring the balance of the internal account to ensure sufficient funds available for withdraw request.
Note: for monitor you can use https://grafana.com/dashboards/6973

5)	How to set up a so called cold and hot wallet, and where should we place them in our design

From the above discussion we already have a rough idea that there should be different level of security requirements:

i) security level for external accounts that assigned to users are low, for individual users, the amount they top up supposed to be relatively small amount of money, and we need to aggregate those small changes into a central account regularly, therefore external accounts are definitely hot wallet

ii) security level for internal accounts are high, because internal accounts hold a large amount of money, but can we really make it 100% cold storage? I don’t think so, because it still needs to transfer out BTC regularly corresponding to users withdraw requests, you may say that we can create raw transaction and sign it offline, but still you need to know the withdraw request first(connect to db), and you need to know unspent transactions of this account in order to compose raw transaction(connect to btc node), thus it can not be a physically disconnected cold wallet,but we can increase secure level by keeping it in secure intranet, let’s call it semi-cold wallet

iii) as long as BTC is not stored on a physically isolated machine, it’s not 100% safe, we shouldn’t put all the eggs in one basket, so what we can do is put some percentage of the BTC into cold wallet, let’s say 60% in cold wallet, 40% in semi-cold wallet to handle withdraw.

Note：至于冷钱包如何跟系统交互，在我这个demo中是忽略掉的，我在网上看到资料，大概知道这么两种方式

a. 先说一个比较奇葩的设计是通过几台电脑摄像头互扫二维码，比如热钱包生成rawtransaction的二维码，冷钱包摄像头扫描二维码签名，生成signedtransaction二维码，热钱包再扫描进行广播

b. 通过BIP32我们知道，我们给一个地址转账，这个地址的私钥可以不需要被算出来，换句话说可以压根在这个世界上没有出现过，那么好了，我们都不需要有一个机器存储了，我们可以直接拿一个私钥没有出现过的账号当成冷钱包，每次冷钱包发生转账时就全部花掉，零钱放到另外一个新的冷钱包

我很好奇真正的交易所是如何定义冷热钱包并实现交互的

### 1.3 Workflow

1)	Top-up Flow

i) The user selects the BTC payment method and key in 15000 CNY, the website app automatically displays 0.5 BTC based on the current exchange rate, the user confirms and clicks on submit

ii) Website app generates a BTC top up address(m/44’/0’/0’/0/address_index) for the user and create a pending order record [insert into topup_order <uuid,userid,btcaddress,btcindex,requestamt,exchangerate,createdate,status>];
And also generate a qrcode contains payment URI, format:bitcoin:<address>?amount=<value>&message=<message>

iii) The user transfers BTC to the top up address assigned to him (he may transfer BTC from any exchanges or wallets as he like), or the user can scan the qrcode using his mobile wallet to make the transfer.

iv) The scheduler service will periodically retrieve pending top up requests from DB,and check transactions by RPC call to the BTC node, once detecting transactions to addresses that are in watchlist, update the user’s balance accordingly and update the record with txid/vout/scriptPub[update topup_order<uuid,userid,btcaddress,btcindex,requestamt,exchangerate,createdate,status,realamt,txid,vout,scriptpub>].

v) the scheduler service will then compose raw transaction based on realamt,txid,vout,scriptpub to transfer btc from users topup address(external account) to internal account,  aggregate 40% of received BTC to a semi-cold wallet address(e.g m/44’/0’/1’/0/index), 60% of received BTC to a cold wallet(e.g m/44’/0’/2’/0/index)

2)	Withdraw Flow

i) The user chooses to convert remained balance to BTC, key in 15000 CNY and provides a valid btc address, the website app automatically displays 0.5 BTC based on the current exchange rate, the user confirms and submits withdraw request

ii) Website app validates user balance and btc address, then creates a pending withdraw record[insert into withdraw_order <uuid,userid,btcaddress,btcindex,balance,btcamt,exchangerate,createdate,status>]

iii) The scheduler service will periodically process all the pending withdraw request, transfer BTC from semi-cold wallet to the user’s BTC address

### 1.4 Tech spec
1) Bitcoin core v0.17.1
https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md

2) Bx tool (libbitcoin)
https://github.com/libbitcoin/libbitcoin-explorer
https://github.com/libbitcoin/libbitcoin-explorer/wiki

Note: to config for testnet
 vim /home/peter/libbitcoin-explorer/etc/libbitcoin/bx.cfg

![](/docs/docs_image/blockchain/btc/btc_dev_usecase01.png)

3) Python
Version 2.7, failed for 3.6
```
pip install python-bitcoinrpc
https://github.com/jgarzik/python-bitcoinrpc
	Failed for python3.6:
	Traceback (most recent call last):
  File "btc_monitor.py", line 94, in depositJob
	blockObj = rpc_connection.getblock(blockHash)
  File "/usr/lib/python3.6/site-packages/bitcoinrpc/authproxy.py", line 139, in __call__
	response = self._get_response()
  File "/usr/lib/python3.6/site-packages/bitcoinrpc/authproxy.py", line 192, in _get_response
	log.debug("<-%s- %s"%(response["id"], json.dumps(response["result"], default=EncodeDecimal)))
  File "/usr/lib64/python3.6/json/__init__.py", line 238, in dumps
	**kw).encode(obj)
  File "/usr/lib64/python3.6/json/encoder.py", line 199, in encode
	chunks = self.iterencode(o, _one_shot=True)
  File "/usr/lib64/python3.6/json/encoder.py", line 257, in iterencode
	return _iterencode(o, 0)
  File "/usr/lib/python3.6/site-packages/bitcoinrpc/authproxy.py", line 77, in EncodeDecimal
	return float(round(o, 8))
decimal.InvalidOperation: [<class 'decimal.InvalidOperation'>]
https://github.com/jgarzik/python-bitcoinrpc/issues/92
```

bip32utils
https://github.com/lyndsysimon/bip32utils
pip install .	or pip install bip32utils or python setup.py install

4) Nodejs

npm install bip39 bitcoinjs-lib bluebird body-parser cookie-parser debug ejs express express-session http-errors morgan pg pg-promise uuid

5) Others 

BTC-Fiat exchange rate api
https://blockchain.info/tobtc?currency=CNY&value=1
BTC transaction fees api
https://bitcoinfees.21.co/api

### 1.5 Hands on

#### 1.5.1 Generate keys for testnet that comply with bip32 bip39 and bip44

be aware that config your tools properly if testing on regtest or testnet, and also for regtest and testnet, cointype in bip44 path should be 1 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
So now, I’ll use bx tools to generate mnemonic and master node:

```
# bx seed
4f9687fcff3ba10d9dab22cf6ad837ee3ba516dbe51ddee2
# bx mnemonic-new 4f9687fcff3ba10d9dab22cf6ad837ee3ba516dbe51ddee2
exhibit reflect you wrist ring man issue gold sorry fine assume symbol ripple merge hurdle photo ten blood
# bx mnemonic-to-seed exhibit reflect you wrist ring man issue gold sorry fine assume symbol ripple merge hurdle photo ten blood
4c3d16b85c7c1d62157a77faf817f89eeda7101e88d843bd58f6145e3ff203bd4982feb9700c219dfa74b04605aa4ec5c0c21c3a6ed352c1f59f1511a7500c09
# bx hd-new 4c3d16b85c7c1d62157a77faf817f89eeda7101e88d843bd58f6145e3ff203bd4982feb9700c219dfa74b04605aa4ec5c0c21c3a6ed352c1f59f1511a7500c09
tprv8ZgxMBicQKsPdKFbPviThueMk82PYxf5wMeHWPQ4x8bp2huNDbx53Q4ToywGUsUTfV4KiMoHZWkYsqymdEK3i8eoj2UrDpn1KUUUDzgF5rJ
# echo tprv8ZgxMBicQKsPdKFbPviThueMk82PYxf5wMeHWPQ4x8bp2huNDbx53Q4ToywGUsUTfV4KiMoHZWkYsqymdEK3i8eoj2UrDpn1KUUUDzgF5rJ | \
     bip32gen -v \
     -i xprv -f - -x \
     -o privkey,wif,pubkey,addr,xprv,xpub -F - -X \
     44h/1h/0h/0 
Importing starting key from extended private key
Keyspec: 44h/1h/0h/0
privkey: a1799465078f52aa1967d5ac93a322e2ab8e6ce9040a4f36d1a70d0acf574b60
wif:     cSzb3Ze28dFCDzX7KvLmDm7wLq4CXSxquYUwpCQdNhDzYhjJ9z1A
pubkey:  02e31d9a51cd4bf105b2903359c177f86c20be60aa870aa65d0c59a00a79029cdc
addr:    mjzkzLhwFwXW2SRWqjBajn3emTHn7JyJ4x
xprv:    tprv8iWjgxv35LVr3gcLdpa7LtBWMzC8UX1jTUMAXu5kDtDn2BX4WJVAJ9sgMzFjuoiWjhUdamEeB7sxPS6uzkmcEAAXNAevuaRWYQFMwX713mP
xpub:    tpubDFCmqNxHDiBWw9e8XUEhkHqcw1i4drCe2mwwpR83eA2Arfmq8hJkUeVYY7hYaQWEo4HZDQ86FiRYj8Lr3e9UT8bYi7yLvbNbXgqyJeqLYii
# echo tprv8ZgxMBicQKsPdKFbPviThueMk82PYxf5wMeHWPQ4x8bp2huNDbx53Q4ToywGUsUTfV4KiMoHZWkYsqymdEK3i8eoj2UrDpn1KUUUDzgF5rJ | \
 	bip32gen -v \
 	-i xprv -f - -x \
 	-o privkey,wif,pubkey,addr,xprv,xpub -F - -X \
 	44h/1h/1h/0/0
Keyspec: 44h/1h/1h/0/0
privkey: e5b0929aa90ea7ec0e13f6b0f76733af87dcef285c2f01688678e8a7fb8840a6
wif: 	cVHBtHK7kzze7yqF5En4Psbw2ZZdUEJ8jF4KAMXhLpuSwUf4fZAU
pubkey:  0310c21deba4469806df5d514110bfc1af651488c67f1edce828caa838ff17f969
addr:	muz1awk6YXQkP29dt1tdRpBTonmqAqwdst
xprv:	tprv8kB5cr8narJ5b6xE1svr1mpXAUn3niuTGLkZX9uieNb4hNM1gbyco8vEF1mmqjxf3pXLVKaLPSEnZ6F64JeqZKeKoyLUVaQxmuaaryq1N9b
xpub:	tpubDGs7mGB2jDykUZz1uXbSRBUdjWHyx46MqeMLofx24ePTXrbnJzoCydY6R93dvvejjsCtpzXyYYN3sPSw7N2rzVQPsojtLGCdku2ZjhhSdZj

```

![](/docs/docs_image/blockchain/btc/btc_dev_usecase02.png)

Website app uses 
```
xpub(m/44’/1’/0’/0)[tpubDFCmqNxHDiBWw9e8XUEhkHqcw1i4drCe2mwwpR83eA2Arfmq8hJkUeVYY7hYaQWEo4HZDQ86FiRYj8Lr3e9UT8bYi7yLvbNbXgqyJeqLYii] 
```
for user topup address generation;

The scheduler service uses 
```
xprv(m/44’/1’/0’/0)[tprv8iWjgxv35LVr3gcLdpa7LtBWMzC8UX1jTUMAXu5kDtDn2BX4WJVAJ9sgMzFjuoiWjhUdamEeB7sxPS6uzkmcEAAXNAevuaRWYQFMwX713mP] 
```
to aggregate and transfer btc from topup address to internal address(semi-cold and cold wallet, 

in this demo, we simply aggregate and transfer into addr(m/44’/1’/1’/0/0)[muz1awk6YXQkP29dt1tdRpBTonmqAqwdst]).

#### 1.5.2 Setup Test Env

1) use wallet app https://play.google.com/store/apps/details?id=de.schildbach.wallet_test

Or manually Create a btc key pair on testnet as user’s own btc account

注意：千万**不要**使用 https://bitcoinpaperwallet.com/ 这个网站是诈骗网站

	BTC address generator
	mg9H4QPYcjqTjURFVSNDQQkFBx3FCxD3JB
	91fVLr2vDHRFvmVKjABfqX9163oAFTCJAyQk63RacCX2rs1ruA1
Then import to gui wallet
Bitcoin core windows https://bitcoin.org/en/download
To import private key Help -> Debug Window -> Console-> importprivkey 91fVLr2vDHRFvmVKjABfqX9163oAFTCJAyQk63RacCX2rs1ruA1

![](/docs/docs_image/blockchain/btc/btc_dev_usecase03.png)

2) Faucet - Get BTC for testing

https://coinfaucet.eu/en/btc-testnet/

3) host btc node demon

vim ~/.bitcoin/bitcoin.conf
![](/docs/docs_image/blockchain/btc/btc_dev_usecase04.png)

bitcoind -testnet -printtoconsole/-daemon

And then import our internal account:

bitcoin-cli -testnet importprivkey cVHBtHK7kzze7yqF5En4Psbw2ZZdUEJ8jF4KAMXhLpuSwUf4fZAU "internal0" true

4) Testnet explorer - monitor both user’s own btc address and our system generated external/internal addresses

https://live.blockcypher.com/btc-testnet/address/mg9H4QPYcjqTjURFVSNDQQkFBx3FCxD3JB/
https://live.blockcypher.com/btc-testnet/address/n3ENHgEF9CTb3KnJotGQEuWScA9aAKyR7W/
https://live.blockcypher.com/btc-testnet/address/muz1awk6YXQkP29dt1tdRpBTonmqAqwdst/

#### 1.5.3 Website app
You can use nodejs webpack to create a very simple web app
https://webpack.js.org/api/node/

And then to generate top up address from  xpub(m/44’/1’/0’/0) 

Simply import bitcoinjs lib and refer to sample code:
https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/bip32.js

![](/docs/docs_image/blockchain/btc/btc_dev_usecase05.png)

#### 1.5.4  The Scheduler Monitor Service

1) Topup

![](/docs/docs_image/blockchain/btc/btc_dev_usecase06.png)

2) Aggregation and transfer from external user top up addresses to internal account

![](/docs/docs_image/blockchain/btc/btc_dev_usecase07.png)

3) Withdraw

![](/docs/docs_image/blockchain/btc/btc_dev_usecase08.png)

Note:For withdraw btc from semi-cold wallet, I find it’s not feasible to use signtransactionwithkey, because that requires knowledge of all the utxo of the semi-cold wallet, and keep track of all the utxo requires lots of work and sophisticated design,I haven’t test it but one possible way to get unspent transactions is that, import pubkey into bitcoin core wallet as watch only address, then rpc listunspent by address, but another problem is that you can think of each utxo amount as different denomination of coins in your pocket, every time you have to combine your coins in your pocket, so you need to design a combination strategy so that not to result in more and more small changes in your pocket
~~and to get all the utxo there are mainly two ways:~~

~~One way is to import the address to wallet using importaddress, it will cause the bitcoin core to rescan the entire blockchain, which will take several minutes, not practical in programming; another way is to maintain all the transactions locally, the semi-cold wallet is used in two places: aggregation and withdraw, so you need to keep record of every transaction to extract the latest utxo each time, lots of work has to be done.~~
So in this demo, we choose an easy way,as we already importprivkey to bitcoin core upfront, just straightforward use sendmany to transfer BTC, so the bitcoin core wallet will do the dirty work for us

### 1.6 Reference 

BTC企业级冷热钱包架构 https://my.oschina.net/u/3050295/blog/1824008
OKCoin开放比特币冷钱包技术方案 https://my.oschina.net/u/3050295/blog/1821609
小白秒懂的冷热钱包原理 https://www.chainnews.com/articles/696192635729.htm

https://github.com/bisq-network

https://github.com/chainside/btcpy

红色警报：交易所接连被黑的防御建议 https://www.8btc.com/article/383011

Multi-sig for “aggregation account”, 归集
Simple multi-sig version::Building the World’s First Open Source Multi-Sig Bitcoin Exchange https://medium.com/@benedictchan/building-the-world-s-first-open-source-multi-sig-bitcoin-exchange-a6f1221eff46

Save Transaction fee:
Segwit P2sh instead of p2pkh , bip32 support? Signrawtransactionwithkey need redeemscript
https://bitcoin.stackexchange.com/questions/36919/clarification-of-bip32-hierarchical-deterministic-multisig-scripts

Calculate
https://bitcoinfees.earn.com/api
in*148 + out*34 + 10 plus or minus 'in'

https://bitcoin.stackexchange.com/questions/1195/how-to-calculate-transaction-size-before-sending-legacy-non-segwit-p2pkh-p2sh
https://bitcoin.stackexchange.com/questions/68712/what-bytes-are-calculated-on-the-transaction-fee




## 2.open source projects

Proof of authorship/proof of existence
http://docs.proofofexistence.com/#/
https://en.wikipedia.org/wiki/Proof_of_Existence



## 如何购买

[推荐coinhako,目前有赠送活动](https://www.coinhako.com/affiliations/sign_up/LYHISTORY_76989)

<disqus/>