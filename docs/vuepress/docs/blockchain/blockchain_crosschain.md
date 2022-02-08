
**Keyword **

Side chain VS status channel
Main chain / parent chain/第一层区块链, secondary chain / 第二层区块链
Peg 锚定 楔入
2WP two way peg
Spv proof
Opt code

IBC inter-blockchain communication
https://github.com/cosmos/relayer

## 1. Two way peg

### 1.1 Which is not 2WP

![](/docs/docs_image/blockchain/blockchain_crosschain01.png)

侧链和状态通道 https://m.8btc.com/%E2%80%8Edifference-between-sidechains-and-state-channels?from=singlemessage

### 1.2 2WP methods for a blockchain

#### 1.2.1 Centralized (basic third party authority)

![](/docs/docs_image/blockchain/blockchain_crosschain02.png)

#### 1.2.2 Federation - multisig federation

![](/docs/docs_image/blockchain/blockchain_crosschain03.png)

#### 1.2.3 Sidechain 
https://www.coursera.org/lecture/cryptocurrency/bitcoin-backed-altcoins-side-chains-awERi

为了不让更多第三方参与双向锚定，每个区块链可以通过协议来实现强制执行的共识。一个区块链系统性能能够理解其它区块链的共识系统，能够实现在获得其它区块链系统提供的锁定交易证明之后，自动释放比特币

![](/docs/docs_image/blockchain/blockchain_crosschain04.png)

**issues:**

How parent chain verify the secondary chain spv proof,
For example, in btc have to soft fork, add opt code
区块链纠缠

### 1.2.4 Drivechain
http://www.drivechain.info/

![](/docs/docs_image/blockchain/blockchain_crosschain05.png)

### 1.2.5 hybird - 驱动链 +公证人/侧链

![](/docs/docs_image/blockchain/blockchain_crosschain06.png)

https://zhuanlan.zhihu.com/p/26713463
https://www.reddit.com/r/Augur/comments/4mt484/how_quickly_could_augur_switch_from_ethereum_to/

侧链技术 双向锚定
Centralized proof
Fedrate proof

Spv proof 
https://www.youtube.com/watch?v=rzLhw7XI1uo
https://blockstream.com/sidechains.pdf

Rsk
https://www.youtube.com/watch?v=-ZpVEk51qwo
https://www.rsk.co/#resources

https://www.youtube.com/watch?v=LvTbCvU9_b8

https://media.rsk.co/sidechains-drivechains-and-rsk-2-way-peg-design/?winzoom=1

http://www.cocoachina.com/blockchain/20180408/22938.html

Sidechain, drive chain
BTC-Ethereum relay
https://medium.com/@ConsenSys/taking-stock-bitcoin-and-ethereum-4382f0a2f17

How the parent chain(BTC) verify spv from sidechain
https://medium.com/@Chris_Stewart_5/op-withdrawproofverify-the-op-code-that-powers-spv-sidechains-cefce996a324
https://medium.com/@Chris_Stewart_5/what-can-go-wrong-when-transferring-coins-into-a-sidechain-with-op-withdrawproofverify-b2f49b02ab60

谈一谈：侧链、驱动链和Rootstock双向挂钩设计 www.8btc.com/sidechains-drivechains-and-rsk-2-way-peg-design

How would SPV proofs be verified when moving assets back in 2-way pegged sidechains? https://bitcoin.stackexchange.com/questions/43445/how-would-spv-proofs-be-verified-when-moving-assets-back-in-2-way-pegged-sidecha

1 way ped - btc relay
http://btcrelay.org
https://www.reddit.com/r/ethereum/comments/45w9gc/btc_relay_why_does_it_matter/

Driving chain
http://www.drivechain.info/faq/

https://counterparty.io/
http://www.8btc.com/counterparty_protocol

## 2.Cross Chain Swaps

### 2.1 Bitcoin atomic swap with other coins
http://diyhpl.us/wiki/transcripts/scalingbitcoin/tokyo-2018/edgedevplusplus/cross-chain-swaps/

**Hashlocking funds:**

A hashlock is a requirement you place on funds such that to spend the transaction output you have to provide a value X such that the Hash(X) = Y. You have to use a hash function where it's hard to discover the preimage given the hash.A simple example of a hashlock is that Alice chooses a random value X and hashes it to get Y. Alice then creates and a posts a transaction which is locked under two conditions: (1) it needs a signature from Bob, and the second condition is that the input that spends it must also provide an X such that Hash(X) = Y. So if Bob learns the value X, then Bob can spend transaction 1 outputs by using Bob's secret key to generate a signature and also providing the X value. We can use this to make an atomic cross-chain trade. The idea here is that Alice is going to choose a random value X and hashes it to get Y and she is going to post transaction 1. She is not going to tell anyone what X is at this point, she keeps it as a secret. Bob waits for transaction 1 to be confirmed, and then posts transaction 2. At this point, Bob doesn't know what X is. But he knows that if he learns the value X then he can claim money from the outputs of transaction 1. Bob knows this is safe to do becaus ethe only way that Alice can take money out of transaction 2 is by revealing X, and if Bob learns X, then he gains the ability to get money out of transaction 1. So Alice waits for transaction 2 to be confirmed, and then posts transaction 3 which reveals X. This grants Bob the ability to get his money because he now has the preimage. He can get his litecoin now. This is the simplest version of an atomic swap. Alice has swapped litecoin for bitcoin, and Bob has swapped bitcoin for litecoin. They use a hash preimage to make sure that the transaction is atomic.

**TierNolan atomic trade protocol**

**Time lock**

You want the timelocks to probably do blockheight or blocktime which is the timestamp inside the block. Blockheight is fairly risky to do for different blockchains because the mining levels may increase or decrease in unexpected ways, and it's really important that Alice's refund happens after Bob's refund. If Alice's refund happens before Bob's refund then it's no longer safe, and Alice can cheat Bob in that case. So to keep these in sync, it makes more sense to use blocktime than to use blockheight ofr the timelock restriction.

### 2.2 Ethereum swap

**Btc relay**

How to: cross chain swaps between Ethereum and Bitcoin https://medium.com/alphawallet/how-to-cross-chain-swaps-between-ethereum-and-bitcoin-1a222e35412c
https://github.com/James-Sangalli/learn-solidity-with-examples/tree/master/Finance/bitcoin-to-ethereum-swap

**Atomic exchange fungible tokens**

**Atomic exchange non-fungible tokens**

https://hackernoon.com/test-bd14e0e1170d

https://uploads.strikinglycdn.com/files/ec5278f8-218c-407a-af3c-ab71a910246d/Drivechains_Sidechains_and_Hybrid_2-way_peg_Designs_R9.pdf
https://uploads.strikinglycdn.com/files/ec5278f8-218c-407a-af3c-ab71a910246d/RSK%20White%20Paper%20-%20Overview.pdf
