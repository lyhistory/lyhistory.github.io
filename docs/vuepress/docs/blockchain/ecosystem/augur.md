
## 1. Q&A

### 1.1 about two way peg [from their old white paper]

augur白皮书上说的Augur is built as an extension to the source code of bitcoin core… our intention is to use the ‘pegged sidechain’ mechanism to make augur fully interoperable
这个具体是怎么做的，目前公开的代码实现情况跟一开始的计划有不同吗
白皮书：http://www.augur.net/whitepaper.pdf
	https://bravenewcoin.com/assets/Whitepapers/Augur-A-Decentralized-Open-Source-Platform-for-Prediction-Markets.pdf
http://www.8btc.com/augur%EF%BC%9Awhy-ethereum
https://www.youtube.com/watch?v=64ArAtF0flw
https://www.youtube.com/watch?v=Zbz_U3KrN2Y

For lean startup ,the project will iterate faster on ethereum than on bitcoin

### 1.2 augur系统中有几种不同的token存在，代码结构是怎样的

```
 enum TokenType{
        ReputationToken,
        ShareToken,
        DisputeCrowdsourcer,
        FeeWindow,
        FeeToken
    }
https://github.com/AugurProject/augur-core/blob/25fdf9cae210f0af0d9643614adc84cab4262e8e/source/contracts/Augur.sol
```

**REP/attoREP**

https://github.com/AugurProject/augur-core/blob/6b3f7e9e9106a6079ffd4bae0dd7d89edcce0964/source/contracts/reporting/ReputationToken.sol

**Ether/attoETH == CASH wrapper**

**Share token**

https://github.com/AugurProject/augur-core/blob/65561b0a0b7064c9f83bad6b8f9883911576ce65/source/contracts/trading/ShareToken.sol

**FeeToken**

https://github.com/AugurProject/augur-core/blob/6b3f7e9e9106a6079ffd4bae0dd7d89edcce0964/source/contracts/reporting/FeeToken.sol

> Fee Tokens are not tokens that users interact with directly; however, they are used internally by Augur’s Solidity smart contracts to allow users to redeem REP Staked either in a First Public Report or in a Crowdsourcer. When a First Public Reporter submits a First Public Report in a given Fee Window, Augur creates an amount of Fee Tokens equal to the amount of REP they Staked and associates those Fee Tokens with the Ethereum address of the First Public Reporter. Similarly, when a user Stakes REP in a Crowdsourcer to Challenge a Tentative Outcome, Augur creates an amount of Fee Tokens equal to the amount of REP they Staked and associates those Fee Tokens with the Ethereum address of that user. Once the Fee Window is over, and a user redeems their Staked REP, Augur uses the amount of Fee Tokens associated their Ethereum address to determine what proportion of the Fee Window’s Reporting Fees (in ETH) to distribute to them.
> https://docs.augur.net/#fee-token

**Dispute Token / Crowdsourcer**

> When a user Stakes REP in a Crowdsourcer, that Crowdsourcer will allocate an equal amount of Dispute Tokens to that user. Then, when the Crowdsourcer’s Market is Finalized, these Dispute Tokens are used by Augur’s smart contracts to determine the payout that user should receive. Dispute Tokens are only used internally by Augur, and users do not interact with them directly; however, they are implemented as ERC-20 tokens, so they potentially can be traded between users. (For example, a user might want to sell their Dispute Tokens to another user at a discounted price if a Market is being Disputed for a long time and the user wishes to cash out their Dispute Tokens before the Market is Finalized.)
> https://docs.augur.net/#dispute-token
> Each Outcome of a Market has its own Crowdsourcer, which is a Solidity smart contract that keeps track of how much REP has been Staked on a particular Outcome during a given Fee Window. If users Stake enough REP on that Outcome to fill the Dispute Bond and Challenge the Tentative Outcome, that Outcome will become the new Tentative Outcome (and the Market will go through another Dispute Round), or the Market will Fork (if a Dispute Bond greater than the Fork Threshold is filled). If the Dispute Bond is successfully filled, and that Outcome becomes the Final Outcome for the Market, the users who Staked REP on that Outcome can get back 1.5x the amount of REP they originally Staked, once the Market is Finalized. If the Dispute Bond is successfully filled, but that Outcome does not become the Final Outcome for the Market, the users who Staked REP on that Outcome will forfeit all of the REP they Staked. If the Dispute Bond is not successfully filled, the users who Staked on that Outcome can redeem their REP once the Fee Window has elapsed.
> https://docs.augur.net/#creator-fee

**participation token**

> At any time during a Fee Window, users can purchase Participation Tokens in exchange for REP. Once the Fee Window ends, users can redeem their Participation Tokens for a portion of the Reporting Fees (in Ether) that Augur collected during that Fee Window. The more Participation Tokens a user purchases, the bigger the portion of the Reporting Fees they will receive. Users are not required to purchase Participation Tokens, but their purpose is to incentivize users to be active on Augur in the event that they will be needed, such as when a Market Forks.
> https://docs.augur.net/#participation-token

**Cash/DenominationToken**

Cash is an ERC-20 token that is used within Augur’s Solidity smart contracts and acts as a wrapper for ETH to facilitate some of Augur’s functionality. Users do not interact directly with Cash tokens in Augur.
https://github.com/AugurProject/augur-core/blob/65561b0a0b7064c9f83bad6b8f9883911576ce65/source/contracts/trading/Cash.sol
https://github.com/AugurProject/augur-core/blob/433a8691ed2caaa92d4443dc4ae22e63fcb82c2a/source/contracts/reporting/Market.sol

Cash is an ERC-20 token that is used within Augur’s Solidity smart contracts and acts as a wrapper for ETH to facilitate some of Augur’s functionality. Users do not interact directly with Cash tokens in Augur.

**Legacy REP**

> Legacy Reputation Tokens, or Legacy REP, are REP that exist in the Legacy REP smart contract and have not been migrated to the Reputation Token smart contract, for a particular Universe. Legacy REP must be migrated to the Reputation Token smart contract by calling the augur.api.ReputationToken.migrateFromLegacyReputationToken function before they can be used within Augur.
> https://docs.augur.net/#legacy-rep

### 1.3 一次prediction交易从开始到结束的程序执行，各个环节具体是怎样实现的

four-stage progression: creation, trading, reporting, and settlement.

![](/docs/docs_image/blockchain/ecosystem/augur01.png)

#### 1.3.1 Create with REP and ETH

set the event start and end times
designated reporter
	resolution source
	Settlement Fee:https://docs.augur.net/#settlement-fees-explained
	validity bond: incentivizes market creators to create markets based on well-defined events with objective, unambiguous outcomes
 the designated report no-show bond 
Some details to consider for liquidity:
> 如果你提供了许多流动量，但是没有人使用你的市场，你可能将损失一部分资金。
> 如果你提供了许多流动量，并有许多人使用你的市场，你将从交易费用中赚到许多钱。
> 太少的流动量，人们将不会进行交易（因为购买少量的股份就会对价格造成巨大改变）。
> 太多的流动量，你将不能从交易费中赚到足够的钱，从而不能获得利润。这是一个微妙的平衡。
> http://www.8btc.com/augur59107

#### 1.3.2 Market trading with ETH GET shares

	The Augur contracts maintain an order book for every market created
	ASK / BID 
POSITION / EXIT POSITION (sell complete set)
Shares 
Number of ticks / price points
https://docs.augur.net/#trading
	
	trade shares in markets, purchase shares in Augur markets immediately after market creation, and offer shares at the current best price. Settlement fees are paid by traders when positions are settled within a market. After the event has occurred, the outcome is determined by the designed reporter, or ultimately, Augur’s decentralized oracle, if necessary.

#### 1.3.3 Reporting and dispute process

Reporter with REP token stake report,Augur oracle and Oracle reporting dispute - crowd wisdom
REP (Reputation) token holders can participate in the Augur reporting system. REP token holders have the ability to dispute the tentative outcome of any Augur market within 7 days of resolution by staking a dispute bond. When doing so, the Augur market will go into a dispute round, where REP holders can stake REP tokens on one of the markets possible outcomes. If the tentative outcome is overturned, users who participated by staking on the new winning outcome will receive a 50% ROI. There is always a financial incentive to keep the Augur oracle reflecting reality.
https://docs.augur.net/#reporting

![](/docs/docs_image/blockchain/ecosystem/augur02.png)

https://pasteboard.co/1FcgIDWR2.png
https://www.websequencediagrams.com/files/render?link=kUm7MBHLoO87M3m2dXzE
https://pasteboard.co/1WHGfXjB3.png

#### 1.3.4 Settlement and Final payout

Redemption for fee and REP

https://github.com/AugurProject/augur-core/blob/d7054f12f4d3ff6f70866e5e5de9c3c3e5807de4/source/contracts/reporting/FeeWindow.sol
https://github.com/AugurProject/augur-core/blob/433a8691ed2caaa92d4443dc4ae22e63fcb82c2a/source/contracts/trading/ClaimTradingProceeds.sol

### 1.4 已经公开的代码中每个package的功能是什么

https://github.com/AugurProject

![](/docs/docs_image/blockchain/ecosystem/augur03.png)

#### 1.4.1 augur core
Smart contracts based on ethereum

#### 1.4.2 augur and augur app
User Interface

https://github.com/AugurProject/augur-app
http://docs.augur.net/

#### 1.4.3 augur js

All the business API to talk with the blockchain

#### 1.4.4 augur node
A layer over augur js to store the market data into traditional db for faster access

#### 1.4.5 walkthrough
https://github.com/AugurProject/augur-walkthrough

### 1.5 还有哪些计划中的feature仍未实现 什么困难使得相关功能尚未完成

https://medium.com/@AugurProject/a-roadmap-for-augur-and-whats-next-930fe6c7f75a

## 2. More Info

### 2.1 decentralized oracle
Augur is a decentralized oracle and prediction market platform. 
Users feed real world information into Augur's contracts. 
Augur ensures the accuracy of this real world information by providing a financial incentive for REP token holders to correct markets they believe have been reported on incorrectly. 

### 2.2 incentive and penalize for different participants
Creator: 
	validity bonds, no-show bonds, settlement fee
Reporters:
	Reporting fee
Normal ether users: 
	first public report incentive for open reporting
REP holders: 
	dispute outcome;
	redeem fee by buying participation token;
	Get bonus for selecting the true universe at 60 days forking period
Attacker:
	Staked rep on the false outcome;
	Costs for initial a forking;

### 2.3 keep market integrity and secure by math

![](/docs/docs_image/blockchain/ecosystem/augur04.png)

### 2.4 code quality is good
https://github.com/AugurProject/augur-walkthrough
For example they have very good and comprehensive test cases and API documents
But need further study on this

## 3. Tryout on beta test
Tested address:
	https://rinkeby.etherscan.io/address/0xEcFfBC6904Cfcf0925c36a10bb6bCb8DB6FBeC95
Screen shots:

![](/docs/docs_image/blockchain/ecosystem/augur05.png)

---

Reference
Links

https://docs.augur.net
https://github.com/AugurProject
https://github.com/AugurProject/augur.js/commit/d7ca99319d894a5b8dc05f5090977635d128140d

Roadmap
https://medium.com/@AugurProject/a-roadmap-for-augur-and-whats-next-930fe6c7f75a

Community followup
https://augur.stackexchange.com/
https://medium.com/@AugurProject

https://twitter.com/joeykrug/status/995037050985316352?ref_src=twsrc%5Etfw&ref_url=https%3A%2F%2Fmedium.com%2Fmedia%2Fb6beb2641906d3243be9cf3a542e5835%3FpostId%3De5413ff9fb65

<disqus/>