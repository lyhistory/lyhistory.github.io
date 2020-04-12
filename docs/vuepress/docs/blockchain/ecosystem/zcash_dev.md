
## 1. Development and Deployment

### 1.1 reference 

Electric Coin Comapny https://twitter.com/zcashco?lang=en
https://github.com/ZcashFoundation
https://forum.z.cash  	login use github account
https://chat.zcashcommunity.com/home lyhistory@gmail.com

Zero Knowledge Proofs: An illustrated primer https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/

### 1.2 setup
Set up on ubuntu (debian based)
https://z.cash/download.html
https://zcash.readthedocs.io/en/latest/rtd_pages/install_debian_bin_packages.html 
https://zcash.readthedocs.io/en/latest/rtd_pages/user_guide.html

![](/docs/docs_image/blockchain/ecosystem/zcash01.png)

### 1.3 Questions and Info

?#Export issues
https://forum.z.cash/t/cannot-export-wallet-until-the-zcashd-exportdir-option-has-been-set/14704
https://forum.zcashcommunity.com/t/cannot-export-wallet-until-the-zcashd-exportdir-option-has-been-set/14704/2

![](/docs/docs_image/blockchain/ecosystem/zcash02.png)
![](/docs/docs_image/blockchain/ecosystem/zcash03.png)

https://forum.z.cash/t/transactions-are-private-but-what-about-balances/1667
https://forum.z.cash/t/the-balance-shown-in-wallet/2079

## 2. Theory

zk-SNARK
https://z.cash/technology/zksnarks/
https://www.bdaily.club/news/区块链100讲新型零知识证明背后的隐身大法是什么
Demystifying Zero-Knowledge Proofs
https://docs.google.com/presentation/d/1gfB6WZMvM9mmDKofFibIgsyYShdf0RV_Y8TLz3k1Ls0/edit#slide=id.p

Lagrange interpolation
Fourier transform algorithms
Quadratic Arithmetic https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649


https://github.com/leanthebean/puzzle-hunt

https://www.youtube.com/watch?time_continue=747&v=0Sy6nb72gCk

It bridges the existing transparentpaymentschemeusedbyBitcoinwitha shieldedpaymentschemesecuredbyzero-knowledge succinct non-interactive arguments of knowledge (zk-SNARKs).

Transparent value
Shielded value: notes(amount, indirectly shielded payment address)
Spending key (private key)
Tree of note commitment (note with nullifier)
Computing the nullifier requires the associated private spending key (or the nullifier deriving key for Sapling notes). It is infeasible to correlate the note commitment or note position with the corresponding nullifier without knowledge of at least this key.
An unspent valid note, at a given point on the block chain, is one for which the note commitment has been publically revealed on the blockchain prior to that point,but the nullifier has not

In Sapling, for each spending key there is a full viewing key that allows recognizing both incoming and outgoing notes without having spend authority. This is implemented by an additional ciphertext in each Output description.

Sapling provides a mechanism to allow the efficient creation of diversified payment addresses with the same spending authority. A group of such addresses shares the same full viewing key and incoming viewing key, and so creating as many unlinkable addresses as needed does not increase the cost of scanning the block chain for relevant transactions.

![](/docs/docs_image/blockchain/ecosystem/zcash04.png)

A note (denoted n) can be a Sprout note or a Sapling note. In either case it represents that a valuevis spendable by the recipient who holds the spending key corresponding to a given shielded payment address.


Notation — definitions of notation used throughout the document; 

Concepts — the principal abstractions needed to understand the protocol; 

Abstract Protocol — a high-level description of the protocol in terms of ideal cryptographic components; 

Concrete Protocol — how the functions and encodings of the abstract protocol are instantiated; 

Network Upgrades — the strategy for upgrading to Overwinter and then Sapling; 

Consensus Changes from Bitcoin — how Zcash differs from Bitcoin at the consensus layer, including the Proof of Work; 

Differences from the Zerocash protocol

Zcash Protocol Specification https://github.com/zcash/zips/blob/master/protocol/protocol.pdf
Sprout 
https://z.cash/blog/anatomy-of-zcash/

![](/docs/docs_image/blockchain/ecosystem/zcash05.png)

Sample:
https://explorer.zcha.in/transactions/4dccd4e296fabd1a597968aeedf8158fec6c49f1b650f3ddbbc12298b0467e5a

Sapling
https://z.cash/blog/sapling-transaction-anatomy/
Sample:
https://explorer.testnet.z.cash/tx/abbd823cbd3d4e3b52023599d81a96b74817e95ce5bb58354f979156bd22ecc8

How Transactions Between Shielded Addresses Work https://z.cash/blog/zcash-private-transactions/


#to delete
Mining
https://forum.z.cash/t/unofficial-guide-to-zcash-solo-mining/700
https://forum.z.cash/t/who-belongs-the-mined-zec-balance-until-a-t-or-z-address-is-created/6231/2

POOL
	https://zmine.io/ working
	https://www2.coinmine.pl/zec/           	working
	./src/zcash-miner -stratum=stratum+tcp://zmine.io:1337 \ -user=t1J1uyuQuPJrgBGpJjf8mB9QvMjGuCWrv4C -equihashsolver=tromp \ -genproclimit=-1

	https://zec.suprnova.cc/index.php?page=gettingstarted

	./src/zcash-miner -stratum=stratum+tcp://zec-apac.suprnova.cc:2142 -user=lyhistory.zec -password=zec -debug -printtoconsole

	http://zcash.flypool.org/
	nheqminer.exe -cd -l <server> -u <address>.<worker>
	nheqminer.exe -cd -l cn1-zcash -u t1J1uyuQuPJrgBGpJjf8mB9QvMjGuCWrv4C.rig1
	
	https://zcash.nicehash.com/getting_started
	nheqminer_zcash.exe -l eu -u ZEC-ADDRESS -t 6 -od 0 1
	nheqminer_zcash.exe -l eu -u t1J1uyuQuPJrgBGpJjf8mB9QvMjGuCWrv4C -t 6 -od 0 1
	nheqminer_zcash -l usa -u t1J1uyuQuPJrgBGpJjf8mB9QvMjGuCWrv4C -t 4 -cd 0
	nheqminer_zcash -l usa -u t1J1uyuQuPJrgBGpJjf8mB9QvMjGuCWrv4C -t 6

