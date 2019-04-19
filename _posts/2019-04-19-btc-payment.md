---
title: Tutorial-How to add BTC payment method
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

Recently I've been asked to provide a demo of BTC top up and withdraw services to integrate with our website.
As a Chinese saying goes that lay a brick to attract a jade, the purpose I wrote down my thoughts and some notes is only hoping more people would join the discussion and correct me.

Objectives: basically our website provides membership service for users to top up and enjoy attracted discounts and bonus awards, to cater for arising demands that more and more users prefer BTC than fiat currencies, we decide to introduce one more payment channel with requirements described as follows:

# 1.1 Functionalities
1> Allow users to top up with BTC, so users can transfer in BTC and convert into platform supported fiat balance.
2> Allow users to withdraw their remained balance and receive converted BTC amount with their own BTC address

# 1.2 Concerns
1> How to generate and assign BTC address to each user safely without exposing private key
Can be solved by BIP32 Hierarchical deterministic key creation,
basically we can generate child BTC address from XPUB(parent extension public key), so the web site that communicates to the insecure external network just need to know “parent extension public key”.
[Refer to https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki:
Deterministic wallets do not require such frequent backups, and elliptic curve mathematics permit schemes where one can calculate the public keys without revealing the private keys.]

2> How to maintain so many BTC addresses that assigned to users in an efficient manner
By adopting BIP44 protocol, we can maintain BTC address in a structured and compatible format, for example, according to BIP44, we can design two main accounts for example:
External account(for users): m/44’/0’/0’/0/address_index
Internal account(for internal use): m/44’/0’/1’/0/address_index
we can derive fresh BTC key info with parent key and increment address index,
And by linking BTC address info(address, index, creationdate) with userid in the DB table, later on, we can even implement address recycle logic: simply cross check user top up history and BTC address creation date to recycle for example those that haven’t been used for 3 months.

3> How to manage those “small balance”(accurately should be utxo) received by thousands of BTC addresses that we have assigned to users
Aggregate and transfer the “small balance” into internal wallet

4> How do we handle user withdraw requests, should we simply transfer from ‘central wallet’
To be honest, I cannot think of more reasonable design than a central wallet, so in my design, central wallet serve as “settlement reserve funds”, we can use internal account mentioned above in 2> m/44’/0’/1’/0/address_index , to keep it simple we can just use one fixed account m/44’/0’/1’/0/0, and we should also keep monitoring the balance of the internal account to ensure sufficient funds available for withdraw requests.

5> How to set up a so-called cold and hot wallet, and where should we place them in our design
From the above discussion we already have a rough idea that there should be different levels of security requirements:
i) security level for external accounts that assigned to users are low, for individual users, the amount they top up supposed to be relatively small amount of money, and we need to aggregate those small amount into a central account regularly, therefore external accounts are definitely hot wallet
ii) security level for internal accounts are high, because internal accounts hold a large amount of money, but can we really make it 100% cold storage? I don’t think so, because it still needs to transfer out BTC regularly corresponding to users withdraw requests, you may say that we can create raw transaction and sign it offline, but still you need to know the withdraw requests first(connect to DB), and you need to know unspent transactions of this account in order to compose raw transaction(connect to BTC node), thus it can not be a physically disconnected cold wallet,but we can increase secure level by keeping it in secure intranet, let’s call it semi-cold wallet
iii) as long as BTC is not stored on a physically isolated machine, it’s not 100% safe, we shouldn’t put all the eggs in one basket, so what we can do is put some percentage of the BTC into cold wallet, let’s say 60% in cold wallet, 40% in semi-cold wallet to handle withdraw.

# 1.3 Workflow
1> Top-up Flow
i) The user selects BTC payment method and key in 15000 CNY, the website app automatically displays 0.5 BTC based on the current exchange rate, the user confirms and clicks on submit
ii) Website app generates a BTC top up address(m/44’/0’/0’/0/address_index) for the user and create a pending order record [insert into topup_order <uuid,userid,btcaddress,btcindex,requestamt,exchangerate,createdate,status>]
iii) The user transfers BTC to the top up address assigned to him (he may transfer BTC from any exchanges or wallets as he like)
iv) The scheduler service will periodically retrieve pending top-up requests from DB, and check transactions by RPC call to the BTC node, once detecting transactions to addresses that are in watchlist, update the user’s balance accordingly and update the record with txid/vout/scriptPub[update topup_order<uuid,userid,btcaddress,btcindex,requestamt,exchangerate,createdate,status,realamt,txid,vout,scriptpub>].
v) the scheduler service will then compose raw transaction based on realamt,txid,vout,scriptpub to transfer btc from users topup address(external account) to internal account, aggregate 40% of received BTC to a semi-cold wallet address(e.g m/44’/0’/1’/0/index), 60% of received BTC to a cold wallet(e.g m/44’/0’/2’/0/index)

2> Withdraw Flow
i) The user chooses to convert remained balance to BTC, key in 15000 CNY and provides a valid BTC address, the website app automatically displays 0.5 BTC based on the current exchange rate, the user confirms and submits withdraw request
ii) Website app validates user's balance and BTC address, and then creates a pending withdraw record[insert into withdraw_order <uuid,userid,btcaddress,btcindex,balance,btcamt,exchangerate,createdate,status>]
iii) The scheduler service will periodically process all the pending withdraw request, transfer BTC from semi-cold wallet to the user's BTC address


# 1.4 Tech spec

1> Bitcoin core v0.17
https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md
2> Bx tool (libbitcoin)
https://github.com/libbitcoin/libbitcoin-explorer
https://github.com/libbitcoin/libbitcoin-explorer/wiki
Note: to config for testnet
vim /home/peter/libbitcoin-explorer/etc/libbitcoin/bx.cfg
![](/content/images/post/20190419/1.png)
3> Python
pip install python-bitcoinrpc
https://github.com/jgarzik/python-bitcoinrpc
bip32utils
https://github.com/lyndsysimon/bip32utils
4> Others
BTC-Fiat exchange rate API
https://blockchain.info/tobtc?currency=CNY&value=1
BTC transaction fees API
https://bitcoinfees.21.co/api

# 1.5 Hands-on

## 1.5.1 Generate keys for testnet that comply with bip32 bip39 and bip44
be aware that config your tools properly if testing on regtest or testnet, and also for regtest and testnet, cointype in bip44 path should be 1 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
So now, I’ll use bx tools to generate mnemonic and master node:

![](/content/images/post/20190419/2.png)
The website app uses xpub(m/44’/1’/0’/0)[tpubDFCmqNxHDiBWw9e8XUEhkHqcw1i4drCe2mwwpR83eA2Arfmq8hJkUeVYY7hYaQWEo4HZDQ86FiRYj8Lr3e9UT8bYi7yLvbNbXgqyJeqLYii] for user topup address generation;
The scheduler service uses xprv(m/44’/1’/0’/0)[tprv8iWjgxv35LVr3gcLdpa7LtBWMzC8UX1jTUMAXu5kDtDn2BX4WJVAJ9sgMzFjuoiWjhUdamEeB7sxPS6uzkmcEAAXNAevuaRWYQFMwX713mP] to aggregate and transfer btc from topup address to internal address(semi-cold and cold wallet, in this demo, we simply aggregate and transfer into addr(m/44’/1’/1’/0/0)[muz1awk6YXQkP29dt1tdRpBTonmqAqwdst]).

## 1.5.2 Setup Test Env
1> Create a btc key pair on testnet as user’s own btc account
BTC address generator https://bitcoinpaperwallet.com/bitcoinpaperwallet/generate-wallet.html
mg9H4QPYcjqTjURFVSNDQQkFBx3FCxD3JB
91fVLr2vDHRFvmVKjABfqX9163oAFTCJAyQk63RacCX2rs1ruA1
2> Faucet - Get BTC for testing
https://coinfaucet.eu/en/btc-testnet/
3> GUI for user to transfer BTC
Bitcoin core windows https://bitcoin.org/en/download
To import private key Help -> Debug Window -> Console-> importprivkey 91fVLr2vDHRFvmVKjABfqX9163oAFTCJAyQk63RacCX2rs1ruA1
![](/content/images/post/20190419/3-1.png)
4> host btc node demon
vim ~/.bitcoin/bitcoin.conf
![](/content/images/post/20190419/3.png)
bitcoind -testnet -printtoconsole/-daemon
And then import our internal account:
bitcoin-cli -testnet importprivkey cVHBtHK7kzze7yqF5En4Psbw2ZZdUEJ8jF4KAMXhLpuSwUf4fZAU "internal0" true

5> Testnet explorer - monitor both user’s own btc address and our system generated external/internal addresses
https://live.blockcypher.com/btc-testnet/address/mg9H4QPYcjqTjURFVSNDQQkFBx3FCxD3JB/
https://live.blockcypher.com/btc-testnet/address/n3ENHgEF9CTb3KnJotGQEuWScA9aAKyR7W/
https://live.blockcypher.com/btc-testnet/address/muz1awk6YXQkP29dt1tdRpBTonmqAqwdst/

## 1.5.3 Website app
You can use nodejs webpack to create a very simple web app
https://webpack.js.org/api/node/
And then to generate top up address from xpub(m/44’/1’/0’/0)
Simply import bitcoinjs lib and refer to sample code:
https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/bip32.js
![](/content/images/post/20190419/4.png)

## 1.5.4 The Scheduler Monitor Service
1> Topup
![](/content/images/post/20190419/5.png)

2> Aggregation and transfer from external user top up addresses to internal account
![](/content/images/post/20190419/6.png)

3> Withdraw
![](/content/images/post/20190419/7.png)
Note:For withdraw btc from semi-cold wallet, I find it’s not feasible to use signtransactionwithkey, because that requires knowledge of all the utxo of the semi-cold wallet, and keep track of all the utxo requires lots of work and sophisticated design, so in this demo, I choose an easier way, as we already importprivkey of the internal account to bitcoin core upfront, just straightforward use sendmany to transfer BTC, so the bitcoin core wallet will do the dirty work for us