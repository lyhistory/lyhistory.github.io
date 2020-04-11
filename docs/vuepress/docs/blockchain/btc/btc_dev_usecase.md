
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

