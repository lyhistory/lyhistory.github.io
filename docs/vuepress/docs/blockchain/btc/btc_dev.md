
Completely Offline Bitcoin Transactions https://medium.com/hackernoon/completely-offline-bitcoin-transactions-4e58324637bd

## 1. References

** Statistics **

Nodes 
https://bitnodes.earn.com/nodes/leaderboard/
Fees
https://bitcoinfees.earn.com/
Bitcoin Network Momentum
http://charts.woobull.com/bitcoin-network-momentum/

Current/prevailing  market rate:
https://www.cmegroup.com/trading/cryptocurrency-indices/cf-bitcoin-reference-rate.html
https://coincap.io/
https://bitcoinaverage.com/

Btc explorer
https://insight.bitpay.com/
https://www.blockchain.com/explorer
https://live.blockcypher.com/


** Codes/Demo **
https://github.com/lyhistory/blockchain_btc

http://www.righto.com/2014/02/bitcoins-hard-way-using-raw-bitcoin.html
https://github.com/shirriff/bitcoin-code/blob/master/txnUtils.py

Rpc learn
https://github.com/bitcoin/bitcoin/tree/c033c4b5cef89a654e4d9d5c5f9bd823871b068b/test/functional

** Course/ community **

https://crypto.stanford.edu/cs251_fall15/cs251p.html
https://crypto.stanford.edu/cs251_fall15/syllabus.html
https://makecodecode.blogspot.sg/2016/12/blockchain-bitcoin-moocs.html
https://www.youtube.com/watch?v=7nQqN5MBcBo&index=1&list=PL68lGg7SjGZDKz8ut9oLkbDqK_ngqmJg-

https://lopp.net/bitcoin.html
https://bitcoin.page/
https://www.lopp.net/bitcoin-information.html
https://www.lopp.net/lightning-information.html

https://www.bitcoindesigned.com/

Bitcoin P2P e-cash paper by Satoshi Nakamoto https://www.mail-archive.com/search?l=cryptography%40metzdowd.com&q=subject:"Bitcoin+P2P+e%5C-cash+paper"&o=oldest&f=1

Money, blockchains, and social scalability https://unenumerated.blogspot.com/2017/02/money-blockchains-and-social-scalability.html?m=1


https://bitcoincore.slack.com/
http://learnmeabitcoin.com/
https://www.youtube.com/watch?v=6Fa04MnURhw

** Other **

https://twitter.com/MITBitcoinClub

Certified Bitcoin Professional https://cryptoconsortium.org/certifications/cbp/

## 2. Development and Deployment

bitcoin是开源项目，没有所谓官方，不过确实有bitcoin core项目，然后也有很多变种，首先从bitcoin core说起

### 2.1 Bitcoin Core

**reference**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch03.asciidoc

Feature Refer to release note
https://github.com/bitcoin/bitcoin/blob/master/doc/release-notes/release-notes-0.17.0.md#configuration-sections-for-testnet-and-regtest

Refer to test case and samples
https://github.com/bitcoin/bitcoin/blob/master/doc/zmq.md
https://github.com/bitcoin/bitcoin/blob/master/contrib/zmq/zmq_sub.py
https://github.com/bitcoin/bitcoin/blob/452bb90c718da18a79bfad50ff9b7d1c8f1b4aa3/contrib/debian/examples/bitcoin.conf
https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line/blob/master/bitcoin-cli-commands-help.md

**Setup**

git clone https://github.com/bitcoin/bitcoin.git
git tag        	 
git checkout v0.17.1
Usage Refer to <<https://github.com/lyhistory/blockchain_btc/blob/master/basic/bitcoincore_v0.17.1_cli.txt>>

Build instruction - tested version
https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md

![](/docs/docs_image/blockchain/btc/btc_dev01.png)

**Prerequisite**

ubuntu:
```
sudo apt-get install build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils python3 libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-test-dev libboost-thread-dev
```
The following removed https://github.com/bitcoin/bitcoin/commit/fa3148aacbea0e1a0ba8016b66b8d6b876c267b2
~~For ubuntu only(enable wallet mode dependency):~~
~~sudo apt-get install software-properties-common~~
~~sudo add-apt-repository ppa:bitcoin/bitcoin~~
~~sudo apt-get update~~
~~sudo apt-get install libdb4.8-dev libdb4.8++-dev~~

ZMQ dependencies (provides ZMQ API 4.x):
```
sudo apt-get install libzmq3-dev
```
GUI:
```
sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler
```

centos
```
yum -y install epel-release
yum install -y autoconf automake boost-devel gcc-c++ git libdb4-cxx libdb4-cxx-devel libevent-devel libtool openssl-devel wget
https://ma.ttias.be/run-a-bitcoin-core-full-node-on-centos-7/
```

**Build**
```
./autogen.sh
./configure
make
make install 
```
![](/docs/docs_image/blockchain/btc/btc_dev02.png)

**<span style="color:red;">Latest Version</span>**

1)	Auto script
./contrib/install_db4.sh `pwd`

2)	Manually install
```
BITCOIN_ROOT=$(pwd)
# Pick some path to install BDB to, here we create a directory within the bitcoin directory
BDB_PREFIX="${BITCOIN_ROOT}/db4"
mkdir -p $BDB_PREFIX
# Fetch the source and verify that it is not tampered with
wget 'http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz'
echo '12edc0df75bf9abd7f82f821795bcee50f42cb2e5f76a6a281b85732798364ef db-4.8.30.NC.tar.gz' | sha256sum -c
# -> db-4.8.30.NC.tar.gz: OK
tar -xzvf db-4.8.30.NC.tar.gz
# Build the library and install to our prefix
cd db-4.8.30.NC/build_unix/
# Note: Do a static build so that it can be embedded into the executable, instead of having to find a .so at runtime
../dist/configure --enable-cxx --disable-shared --with-pic --prefix=$BDB_PREFIX
make install
# Configure Bitcoin Core to use our own-built instance of BDB
cd $BITCOIN_ROOT
./autogen.sh
./configure LDFLAGS="-L${BDB_PREFIX}/lib/" CPPFLAGS="-I${BDB_PREFIX}/include/" # (other args…)

```

~~Old version:~~
```
# Update & Upgrade the System
sudo apt-get update
sudo apt-get upgrade

# Install dependencies there might be more based on your system
# However below instructions are for the fresh Ubuntu install/server
# Please carefully watch the logs because if something could not be install
# You have to make sure it is installed properly by trying the command or that particular
# dependency again

sudo apt-get install build-essential libtool autotools-dev autoconf pkg-config libssl-dev
sudo apt-get install libboost-all-dev
sudo apt-get install libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools libprotobuf-dev protobuf-compiler
sudo apt-get install libqrencode-dev autoconf openssl libssl-dev libevent-dev
sudo apt-get install libminiupnpc-dev

# Download Bitcoin Source code
cd ~
git clone https://github.com/bitcoin/bitcoin.git

# Bitcoin uses the Berkley DB 4.8
# We need to install it as well
# Download & Install Berkley DB
cd ~
mkdir bitcoin/db4/
wget 'http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz'
tar -xzvf db-4.8.30.NC.tar.gz
cd db-4.8.30.NC/build_unix/
../dist/configure --enable-cxx --disable-shared --with-pic --prefix=/home/theusername/bitcoin/db4/
make install

# Compile Bitcoin with Berkley DB 4.8
cd ~/bitcoin/
./autogen.sh
# below command ./configure may return with error for dependencies
# you need to make sure that it returns with no error
# If it does please install the dependencies and rerun the /autogen.sh command again and then below command again
./configure LDFLAGS="-L/home/theusername/bitcoin/db4/lib/" CPPFLAGS="-I/home/theusername/bitcoin/db4/include/"

# below command may take 5-10 minutes based on your system
make -s -j5

./autogen.sh
./configure LDFLAGS="-L/home/lyhistory/workspace/blockchain/bitcoin/bitcoin/db4/lib/" CPPFLAGS="-I/home/lyhistory/workspace/blockchain/bitcoin/bitcoin/db4/include/"
make -s -j5
```

**Questions:**

GUI to remote bitcoin core
https://bitcoin.stackexchange.com/questions/44408/how-to-connect-to-a-remote-bitcoin-core-remotely

Dump peers.dat
https://bitcoin.stackexchange.com/questions/75324/how-to-dump-peers-dat-file-to-a-plain-text-file

Mq notification
https://bitcoin.stackexchange.com/questions/40752/what-is-the-use-case-of-bitcoind-zeromq

### 2.2 Libbitcoin

Amir Taaki’s libbitcoin has come to be one of the most advanced alternative implementations of the Bitcoin protocol in existence. Although there are now dozens of alternative implementations on the market, libbitcoin is one of the few that re-implements the complete Bitcoin standard, allowing users to run a deterministic wallet, an elliptic curve message signing interface and, of course, a fully functional Bitcoin node.
sx=>libbitcoin

bx tool
https://github.com/libbitcoin/libbitcoin-explorer

https://bitcointalk.org/index.php?topic=259999.0
https://github.com/libbitcoin/libbitcoin-explorer/wiki/Wallet-Commands

![](/docs/docs_image/blockchain/btc/btc_dev03.png)

**Setup**

Manual install(failed):
Install dependency:
Libbitcoin-explorer => Libbitcoin-client => Libbitcoin-protocol => libbitcoin/libbitcoin-system
Auto install:
./libbitcoin-explorer.sh --prefix=/opt/tools/libbitcoin-sh --build-boost --build-zmq --disable-shared
Or
./install.sh --prefix=/opt/tools/libbitcoin-sh --build-boost --build-zmq --disable-shared

Direct download:https://github.com/libbitcoin/libbitcoin-explorer/wiki/Download-BX

bx tool:
	type-0 nondeterministic wallet
		bx seed | bx ec-new > privateKey
		bx ec-to-public <privateKey >publicKey
		bx ec-to-address < publicKey
	type-2 deterministic wallet:
		bx seed > seed
		bx hd-new < seed > master
		bx hd-private --hard < master > account
		bx hd-private -- index 0 < account
		bx hd-private --index 0 < account
		bx hd-private --index 1 < account
		bx hd-public --index 0 < account
		bx hd-public --index 1 < account
		bx hd-private --index 0 < account | bx hd-to-public
		bx hd-private --index 1 < account | bx hd-to-public
		bx mnemonic-new < seed > words
		bx mnemonic-to-seed < words

### 2.3 其他开发库
bip32utils
Pycoin -python lib
Install 
https://github.com/richardkiss/pycoin
virtualenvwrapper python3
make install

Bitcore https://bitcore.io

bitcoinJ https://bitcoinj.github.io/working-with-the-wallet#creating-multi-sends-and-other-contracts

?# Differ bitcore vs bitcoin core?
https://forum.bitcore.io/t/what-is-the-difference-between-bitcore-and-bitcored-and-bitcore-node/1304/6
?#how to set a fixed coinbase address https://bitcointalk.org/index.php?topic=5119652.msg50127572#msg50127572

### 2.4 应用架构


BTC企业级冷热钱包架构 https://my.oschina.net/u/3050295/blog/1824008
OKCoin开放比特币冷钱包技术方案 https://my.oschina.net/u/3050295/blog/1821609
小白秒懂的冷热钱包原理 https://www.chainnews.com/articles/696192635729.htm

https://github.com/bisq-network

Ever wanted to run a c-lightning node without having to run bitcoind? Your problems are over: with the new `trustedcoin` plugin you can rely on block explorers for everything!

Still better than Paypal. And it works!

More: https://github.com/fiatjaf/lightningd-gjson-rpc/tree/x1/cmd/trustedcoin…
Binary: https://github.com/fiatjaf/lightningd-gjson-rpc/releases/tag/x1


## 3. Theory

<span style="color:red;">
**主要参考：**
</span>
[Mastering Bitcoin](https://github.com/bitcoinbook/)
[Bitcoin白皮书: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)

### 3.1 introduction

Bitcoin consists of:
●	A decentralized peer-to-peer network (the bitcoin protocol)
●	A public transaction ledger (the blockchain)
●	A set of rules for independent transaction validation and currency issuance (consensus rules)
●	A mechanism for reaching global decentralized consensus on the valid blockchain (Proof-of-Work algorithm)
Three basic questions for anyone accepting digital money are:
1.	Can I trust that the money is authentic and not counterfeit?
2.	Can I trust that the digital money can only be spent once (known as the “double-spend” problem)?
3.	Can I be sure that no one else can claim this money belongs to them and not me?

counterfeiting problem, double spend issue

Confirmation: In traditional financial terms this is known as clearing

Change address
If you always use the largest bill in your pocket, you will end up with a pocket full of loose change. If you only use the loose change, you’ll always have only big bills. People subconsciously find a balance between these two extremes, and bitcoin wallet developers strive to program this balance.

Common trasaction forms
Transaction aggregating funds
Trrsanction distributing funds

a propagation technique known as flooding
A common misconception about bitcoin transactions is that they must be "confirmed" by waiting 10 minutes for a new block, or up to 60 minutes for a full six confirmations. Although confirmations ensure the transaction has been accepted by the whole network, such a delay is unnecessary for small-value items such as a cup of coffee. A merchant may accept a valid small-value transaction with no confirmations, with no more risk than a credit card payment made without an ID or a signature, as merchants routinely accept today.

### 3.2 Bitcoin Core: The Reference Implementation
Bitcoin Core architecture (Source: Eric Lombrozo) shows the architecture of Bitcoin Core.

![](/docs/docs_image/blockchain/btc/btc_dev04.png)

A transaction ID is not authoritative until a transaction has been confirmed. Absence of a transaction hash in the blockchain does not mean the transaction was not processed. This is known as "transaction malleability," because transaction hashes can be modified prior to confirmation in a block. After confirmation, the txid is immutable and authoritative.

### 3.3 Keys, Addresses

digital keys, bitcoin addresses/fingerprint(represent public key or scripts), and digital signatures/witness
The size of bitcoin’s private key space, (2^256) is an unfathomably large number. It is approximately 1077 in decimal. For comparison, the visible universe is estimated to contain 1080 atoms.
Base58 checksum-encoded format called the Wallet Import Format (WIF)

Most bitcoin implementations use the [OpenSSL cryptographic library](http://bit.ly/1ql7bn8) to do the elliptic curve math. For example, to derive the public key, the function EC_POINT_mul() is used.
The algorithms used to make a bitcoin address from a public key are the Secure Hash Algorithm (SHA) and the RACE Integrity Primitives Evaluation Message Digest (RIPEMD), specifically SHA256 and RIPEMD160.

![](/docs/docs_image/blockchain/btc/btc_dev05.png)

"compressed private key" really means "private key from which only compressed public keys should be derived,
"Compressed private keys" is a misnomer! They are not compressed; rather, WIF-compressed signifies that the keys should only be used to derive compressed public keys and their corresponding bitcoin addresses. Ironically, a "WIF-compressed" encoded private key is one byte longer because it has the added 01 suffix to distinguish it from an "uncompressed" one.

List of address prefixes
https://en.bitcoin.it/wiki/List_of_address_prefixes

**Advanced Keys and Addresses**
1)Encrypted Private Keys (BIP-38)
BIP-38 proposes a common standard for encrypting private keys with a passphrase and encoding them with Base58Check so that they can be stored securely on backup media, transported securely between wallets, or kept in any other conditions where the key might be exposed. The standard for encryption uses the Advanced Encryption Standard (AES)

2)Pay-to-Script Hash (P2SH) and Multisig Addresses

3)Vanity Addresses

### 3.4 Wallets

#### 3.4.1 Nondeterministic(Random) wallet/JBOK wallet(Just a Bunch Of Keys)
The disadvantage of random keys is that if you generate many of them you must keep copies of all of them, meaning that the wallet must be backed up frequently. Each key must be backed up, or the funds it controls are irrevocably lost if the wallet becomes inaccessible. This conflicts directly with the principle of avoiding address reuse, by using each bitcoin address for only one transaction. Address reuse reduces privacy by associating multiple transactions and addresses with each other.

Paper Wallets
Although you can deposit funds into a paper wallet several times, you should withdraw all funds only once, spending everything. This is because in the process of unlocking and spending funds some wallets might generate a change address if you spend less than the whole amount. Additionally, if the computer you use to sign the transaction is compromised, you risk exposing the private key. By spending the entire balance of a paper wallet only once, you reduce the risk of key compromise. If you need only a small amount, send any remaining funds to a new paper wallet in the same transaction.

#### 3.4.2 Deterministic (Seeded) Wallets
Deterministic wallet https://en.bitcoin.it/wiki/Deterministic_wallet

Type-1 deterministic (seeded) wallet: a deterministic sequence of keys derived from a seed
Type-2 HD wallet: a tree of keys generated from a single seed

**Mnemonic code words, based on BIP-39**

[python-mnemonic](https://github.com/trezor/python-mnemonic)
The reference implementation of the standard by the SatoshiLabs team that proposed BIP-39, in Python
[bitcoinjs/bip39](https://github.com/bitcoinjs/bip39)
An implementation of BIP-39, as part of the popular bitcoinJS framework, in JavaScript

https://iancoleman.github.io/bip39/

**HD wallets, based on BIP-32**

Advantages:
First, the tree structure can be used to express additional organizational meaning, such as when a specific branch of subkeys is used to receive incoming payments and a different branch is used to receive change from outgoing payments. Branches of keys can also be used in corporate settings, allocating different branches to departments, subsidiaries, specific functions, or accounting categories.
The second advantage of HD wallets is that users can create a sequence of public keys without having access to the corresponding private keys. This allows HD wallets to be used on an insecure server or in a receive-only capacity, issuing a different public key for each transaction. The public keys do not need to be preloaded or derived in advance, yet the server doesn’t have the private keys that can spend the funds.

![](/docs/docs_image/blockchain/btc/btc_dev06.png)

An extended key consists of a private or public key and chain code. An extended key can create children, generating its own branch in the tree structure. Sharing an extended key gives access to the entire branch.
This shortcut can be used to create very secure public key–only deployments where a server or application has a copy of an extended public key and no private keys whatsoever. That kind of deployment can produce an infinite number of public keys and bitcoin addresses, but cannot spend any of the money sent to those addresses. Meanwhile, on another, more secure server, the extended private key can derive all the corresponding private keys to sign transactions and spend the money.

Hardened child key derivation: ```m / purpose' / coin_type' / account' / change / address_index```

Multipurpose HD wallet structure, based on BIP-43

Multicurrency and multiaccount wallets, based on BIP-44

### 3.5 Transactions

global double-entry bookkeeping ledger
Although an output can have any arbitrary value, once created it is indivisible. This is an important characteristic of outputs that needs to be emphasized: outputs are discrete and indivisible units of value, denominated in integer satoshis. An unspent output can only be consumed in its entirety by a transaction.

![](/docs/docs_image/blockchain/btc/btc_dev07_1.png)

**Transaction Outputs**

●	An amount of bitcoin, denominated in satoshis, the smallest bitcoin unit
●	A cryptographic puzzle/locking script, a witness script, or a scriptPubKey that determines the conditions required to spend the output

![](/docs/docs_image/blockchain/btc/btc_dev07.png)

**Transaction Inputs**
![](/docs/docs_image/blockchain/btc/btc_dev08.png)

**Transaction Fees**

In Bitcoin Core, fee relay policies are set by the minrelaytxfee option. The current default minrelaytxfee is 0.00001 bitcoin or a hundredth of a millibitcoin per kilobyte. Therefore, by default, transactions with a fee less than 0.00001 bitcoin are treated as free and are only relayed if there is space in the mempool; otherwise, they are dropped. 
third-party services for fee calculations: http://bitcoinfees.21.co
<span style="color:red">If you forget to add a change output in a manually constructed transaction, you will be paying the change as a transaction fee. "Keep the change!" might not be what you intended.</span>

multiple input and output addresses in bitcoin transactions https://bitcoin.stackexchange.com/questions/74003/multiple-input-and-output-addresses-in-bitcoin-transactions

**Reclaming disk space**
![](/docs/docs_image/blockchain/btc/btc_dev08_2.png)

#### 3.5.1 Transaction Scripts and Script Language

Historically, the locking script was called a scriptPubKey, because it usually contained a public key or bitcoin address (public key hash). In this book we refer to it as a "locking script" to acknowledge the much broader range of possibilities of this scripting technology. In most bitcoin applications, what we refer to as a locking script will appear in the source code as scriptPubKey. You will also see the locking script referred to as a witness script (see [segwit]) or more generally as a cryptographic puzzle. These terms all mean the same thing, at different levels of abstraction.
Historically, the unlocking script was called scriptSig, because it usually contained a digital signature. In most bitcoin applications, the source code refers to the unlocking script as scriptSig. You will also see the unlocking script referred to as a witness (see [segwit]). In this book, we refer to it as an "unlocking script" to acknowledge the much broader range of locking script requirements, because not all unlocking scripts must contain signatures.

![](/docs/docs_image/blockchain/btc/btc_dev09.png)

#### 3.5.2 Pay-to-Public-Key-Hash (P2PKH)
**Digital Signatures (ECDSA**

First, the signature proves that the owner of the private key, who is by implication the owner of the funds, has authorized the spending of those funds. Secondly, the proof of authorization is undeniable (nonrepudiation). Thirdly, the signature proves that the transaction (or specific parts of the transaction) have not and cannot be modified by anyone after it has been signed.

![](/docs/docs_image/blockchain/btc/btc_dev10.png)

Sig = (R, S, SIGHASH)
R and S are serialized into a byte-stream using an international standard encoding scheme called the Distinguished Encoding Rules, or DER.
Signature Hash Types (SIGHASH)

![](/docs/docs_image/blockchain/btc/btc_dev11.png)

**ECDSA Math AND The Importance of Randomness in Signatures**
If the same value k is used in the signing algorithm on two different transactions, the private key can be calculated and exposed to the world!
To avoid this vulnerability, the industry best practice is to not generate k with a random-number generator seeded with entropy, but instead to use a deterministic-random process seeded with the transaction data itself. This ensures that each transaction produces a different k. The industry-standard algorithm for deterministic initialization of k is defined in RFC 6979, published by the Internet Engineering Task Force.

### 3.6 Advanced Transactions and Scripting

Transaction Script Language Operators, Constants, and Symbols
https://en.bitcoin.it/wiki/Script

Common Bitcoin Script Templates https://bitcoinedge.org/tutorial/EN:scripting-transactions-p2pkh-p2wpkh-p2sh-p2wsh

#### 3.6.1 Multisignature
0 <Signature B> <Signature C> 2 <Public Key A> <Public Key B> <Public Key C> 3 CHECKMULTISIG

#### 3.6.2 Pay-to-Script-Hash (P2SH)

<Sig1> <Sig2> <2 PK1 PK2 PK3 PK4 PK5 5 CHECKMULTISIG>
<2 PK1 PK2 PK3 PK4 PK5 5 CHECKMULTISIG> HASH160 <redeem scriptHash> EQUAL
<Sig1> <Sig2> 2 PK1 PK2 PK3 PK4 PK5 5 CHECKMULTISIG

P2SH locking scripts contain the hash of a redeem script, which gives no clues as to the content of the redeem script itself. The P2SH transaction will be considered valid and accepted even if the redeem script is invalid. You might accidentally lock bitcoin in such a way that it cannot later be spent.

#### 3.6.3 Data Recording Output (RETURN)

In version 0.9 of the Bitcoin Core client, a compromise was reached with the introduction of the RETURN operator. RETURN allows developers to add 80 bytes of nonpayment data to a transaction output. However, unlike the use of "fake" UTXO, the RETURN operator creates an explicitly provably unspendable output, which does not need to be stored in the UTXO set.
RETURN <data>

#### 3.6.4 Timelocks

**Transaction level lock**

1)Transaction Locktime (nLocktime)

If nLocktime is nonzero and below 500 million, it is interpreted as a block height, meaning the transaction is not valid and is not relayed or included in the blockchain prior to the specified block height. If it is above 500 million, it is interpreted as a Unix Epoch timestamp (seconds since Jan-1-1970) and the transaction is not valid prior to the specified time. 

2)Relative Timelocks - nSequence as a consensus-enforced relative timelock
BIP-68, Relative lock-time using consensus-enforced sequence numbers 

**UTXO level lock**

1)Check Lock Time Verify (CLTV )

BIP-65 (CHECKLOCKTIMEVERIFY).
<now + 3 months> CHECKLOCKTIMEVERIFY DROP DUP HASH160 <Bob's Public Key Hash> EQUALVERIFY CHECKSIG

2)Relative Timelocks - (CSV)

BIP-112, CHECKSEQUENCEVERIFY.
Relative timelocks with CSV are especially useful when several (chained) transactions are created and signed, but not propagated, when they’re kept "off-chain." A child transaction cannot be used until the parent transaction has been propagated, mined, and aged by the time specified in the relative timelock. One application of this use case can be seen in [state_channels] and [lightning_network].

**Median-Time-Past**

BIP-113.The consensus time calculated by Median-Time-Past is always approximately one hour behind wall clock time. If you create timelock transactions, you should account for it when estimating the desired value to encode in nLocktime, nSequence, CLTV, and CSV.

**Timelock Defense Against Fee Sniping**

#### 3.6.5 Scripts with Flow Control (Conditional Clauses)

Bitcoin implements flow control using the IF, ELSE, ENDIF, and NOTIF opcodes. Additionally, conditional expressions can contain boolean operators such as BOOLAND, BOOLOR, and NOT.
Conditional Clauses with VERIFY Opcodes

An opcode such as EQUAL will push the result (TRUE/FALSE) onto the stack, leaving it there for evaluation by subsequent opcodes. In contrast, the opcode EQUALVERIFY suffix does not leave anything on the stack. Opcodes that end in VERIFY do not leave the result on the stack.

#### 3.6.6 Segregated Witness

In the context of bitcoin, a digital signature is one type of witness, but a witness is more broadly any solution that can satisfy the conditions imposed on an UTXO and unlock that UTXO for spending. The term “witness” is a more general term for an “unlocking script” or “scriptSig.”
BIP-141
The main definition of Segregated Witness.
BIP-143
Transaction Signature Verification for Version 0 Witness Program
BIP-144
Peer Services—New network messages and serialization formats
BIP-145
getblocktemplate Updates for Segregated Witness (for mining)
BIP-173
Base32 address format for native v0-16 witness outputs

**Pay-to-Witness-Public-Key-Hash (P2WPKH)**

The public key hash in P2WPKH is 20 bytes
P2WPKH should be constructed by the payee (recipient) by converting a compressed public key to a P2WPKH hash. You should never transform a P2PKH script, bitcoin address, or uncompressed public key to a P2WPKH witness script.

![](/docs/docs_image/blockchain/btc/btc_dev12.png)

**Pay-to-Witness-Script-Hash (P2WSH)**

The script hash in P2WSH is 32 bytes
While P2SH uses the 20-byte RIPEMD160(SHA256(script)) hash, the P2WSH witness program uses a 32-byte SHA256(script) hash. This difference in the selection of the hashing algorithm is deliberate and is used to differentiate between the two types of witness programs (P2WPKH and P2WSH) by the length of the hash and to provide stronger security to P2WSH (128 bits of security in P2WSH versus 80 bits of security in P2SH).

1)Pay-to-Witness-Public-Key-Hash inside Pay-to-Script-Hash

2)Pay-to-Witness-Script-Hash inside Pay-to-Script-Hash

Segregated Witness transactions have two IDs: txid and wtxid. The txid is the hash of the transaction without the witness data and the wtxid is the hash inclusive of witness data. The txid of a transaction where all inputs are segwit inputs is not susceptible to third-party transaction malleability.

### 3.7 The Bitcoin Network

![](/docs/docs_image/blockchain/btc/btc_dev13_1.png)

The term "bitcoin network" refers to the collection of nodes running the bitcoin P2P protocol. In addition to the bitcoin P2P protocol, there are other protocols such as Stratum that are used for mining and lightweight or mobile wallets. These additional protocols are provided by gateway routing servers that access the bitcoin network using the bitcoin P2P protocol and then extend that network to nodes running other protocols.

![](/docs/docs_image/blockchain/btc/btc_dev13.png)

Bitcoin Relay Networks => Fast Internet Bitcoin Relay Engine or FIBRE =>Falcon
Network Discovery

**SPV Nodes**

SPV verifies transactions by reference to their depth in the blockchain instead of their height.
when examining a transaction in block 300,000,the SPV node will establish a link between the transaction and the block that contains it, using a merkle path (see [merkle_trees]). Then, the SPV node waits until it sees the six blocks 300,001 through 300,006 piled on top of the block containing the transaction and verifies it by establishing its depth under blocks 300,006 to 300,001. 

Risks: 
1)	An SPV node can definitely prove that a transaction exists but cannot verify that a transaction, such as a double-spend of the same UTXO, doesn’t exist because it doesn’t have a record of all transactions. This vulnerability can be used in a denial-of-service attack or for a double-spending attack against SPV nodes.
Mitigate: random nodes
2)	privacy risk, for example, a third party monitoring a network could keep track of all the transactions requested by a wallet on an SPV node and use those to associate bitcoin addresses with the user of that wallet, destroying the user’s privacy.
Solve:  bloom filter The network protocol and bloom filter mechanism for SPV nodes is defined in BIP-37 (Peer Services).

**Encrypted and Authenticated Connections**

	there are two solutions that provide encryption of the communications: Tor Transport and P2P Authentication and Encryption with BIP-150/151
	
**Transaction Pools/mempool and orphan pool vs UTXO pool**

orphan pool: If a transaction’s inputs refer to a transaction that is not yet known, such as a missing parent
When a transaction is added to the transaction pool, the orphan pool is checked for any orphans that reference this transaction’s outputs (its children). Any matching orphans are then validated. If valid, they are removed from the orphan pool and added to the transaction pool, completing the chain that started with the parent transaction. In light of the newly added transaction, which is no longer an orphan, the process is repeated recursively looking for any further descendants, until no more descendants are found.
UTXO pool
Unlike the transaction and orphan pools, the UTXO pool is not initialized empty but instead contains millions of entries of unspent transaction outputs, everything that is unspent from all the way back to the genesis block. The UTXO pool may be housed in local memory or as an indexed database table on persistent storage.
Whereas the transaction and orphan pools represent a single node’s local perspective and might vary significantly from node to node depending upon when the node was started or restarted, the UTXO pool represents the emergent consensus of the network and therefore will vary little between nodes. Furthermore, the transaction and orphan pools only contain unconfirmed transactions, while the UTXO pool only contains confirmed outputs.

### 3.8 The Blockchain

![](/docs/docs_image/blockchain/btc/btc_dev14.png) 

Block Identifiers: Block Header Hash and Block Height
The cryptographic hash algorithm used in bitcoin’s merkle trees is SHA256 applied twice, also known as double-SHA256
Merkle Trees and Simplified Payment Verification (SPV)
SPV node that is interested in incoming payments to an address contained in its wallet. The SPV node will establish a bloom filter (see [bloom_filters]) on its connections to peers to limit the transactions received to only those containing addresses of interest. When a peer sees a transaction that matches the bloom filter, it will send that block using a merkleblock message. The merkleblock message contains the block header as well as a merkle path that links the transaction of interest to the merkle root in the block. The SPV node can use this merkle path to connect the transaction to the block and verify that the transaction is included in the block. The SPV node also uses the block header to link the block to the rest of the blockchain. The combination of these two links, between the transaction and block, and between the block and blockchain, proves that the transaction is recorded in the blockchain.

### 3.9 Mining and Consensus

Decentralized Consensus
Independent Verification of Transactions

![](/docs/docs_image/blockchain/btc/btc_dev15.png)

**Mine **
mining is the process of hashing the block header repeatedly, changing one parameter, until the resulting hash matches a specific target.
Validating a New Block

![](/docs/docs_image/blockchain/btc/btc_dev16.png)

**Assembling and Selecting Chains of Blocks**

Nodes maintain three sets of blocks: those connected to the main blockchain, those that form branches off the main blockchain (secondary chains), and finally, blocks that do not have a known parent in the known chains (orphans). 
the longest chain or greatest cumulative work chain

**Blockchain forks and Consensus development**

temporary inconsistencies fork /spontaneous fork, reconverge 

Hark fork 

stages: a software fork, a network fork, a mining fork, and a chain fork.
Diverging Miners and Difficulty

Soft fork:is a forward-compatible change to the consensus rules that allows unupgraded clients to continue to operate in consensus with the new rules

how:
	redefining NOP opcodes
	Other ways like segwit
Soft Fork Signaling with Block Version
	BIP-34 Signaling and Activation:
		BIP-66 Strict DER Encoding of Signatures was activated by BIP-34 style signaling with a block version "3" and invalidating version "2" blocks.
		BIP-65 CHECKLOCKTIMEVERIFY was activated by BIP-34 style signaling with a block version "4" and invalidating version "3" blocks.
		After the activation of BIP-65, the signaling and activation mechanism of BIP-34 was retired and replaced with the BIP-9 signaling mechanism described next.
	BIP-9 Signaling and Activation


![](/docs/docs_image/blockchain/btc/btc_dev17.png)



### 3.10 Bitcoin Security

don’t take control of keys away from users and don’t take transactions off the blockchain.

Consensus Attacks，参考 blockchain_indepth btc_indepth

### 3.11 Blockchain Applications

#### 3.11.1 Building Blocks (Primitives)
No Double-Spend
Immutability
Neutrality
Secure Timestamping
Authorization
Auditability
Accounting
Nonexpiration
Integrity
Transaction Atomicity
Discrete (Indivisible) Units of Value
Quorum of Control
Timelock/Aging
Replication
Forgery Protection
Consistency
Recording External State (OP_RETURN)
Predictable Issuance

#### 3.11.2 Applications from Building Blocks
Proof-of-Existence (Digital Notary): Immutability + Timestamp + Durability
Kickstarter (Lighthouse): Consistency + Atomicity + Integrity. 
Payment Channels: Quorum of Control + Timelock + No Double Spend + Nonexpiration + Censorship Resistance + Authorization

Colored Coins

Counterparty

Payment Channels and State Channels:
Simple Trustless Channels with sequence Timelocks commitment

![](/docs/docs_image/blockchain/btc/btc_dev18.png)

**Asymmetric Revocable Commitments**
	Two asymmetric commitment transactions with delayed payment for the party holding the transaction
	The revocation key is composed of two secrets, each half generated independently by each channel participant.

**Hash Time Lock Contracts (HTLC)**

![](/docs/docs_image/blockchain/btc/btc_dev19.png)

**Routed Payment Channels (Lightning Network):**

Whitepaper: The Bitcoin Lightning Network:Scalable Off-Chain Instant Payments 
https://lightning.network/lightning-network-paper.pdf
Implementation:Basics of Lightning Technology (BOLT) paper 
https://github.com/lightningnetwork/lightning-rfc/blob/master/00-introduction.md
Lightning Network Transport and Routing
https://bitfury.com/content/downloads/whitepaper_flare_an_approach_to_routing_in_lightning_network_7_7_2016.pdf

![](/docs/docs_image/blockchain/btc/btc_dev20.png)

