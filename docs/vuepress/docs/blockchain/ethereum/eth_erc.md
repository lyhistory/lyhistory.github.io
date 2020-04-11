
## 1. Key concepts:

EOA: Ether owner account


## 1. Fungible token - ERC20 - EIP20

https://github.com/ethereum/eips/issues/20
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md

### 1.1 Anatomy

https://medium.com/@jgm.orinoco/understanding-erc-20-token-contracts-a809a7310aa5
mapping<address, balance>
Name symbol decimal (decide by purpose)
Total supply 
	Increase: mint
	Decrease: burn

Function:
	balanceOf()
	transfer()	two party, message sender to another address
			Be aware that, when a EOA call transfer function directly, the sender is the EOA, 
			But if in smart contract function ABC() calls transfer(), the sender is always this contract
			In EOS, in function ABC() you can call transfer() with another one’s permission granted to the contract
	approve()
	allowance()	
	transferFrom() three party, msg.sender, from address, to address,
			transFrom is usually used at exchange, deposit and withdraw in represent of token owner
			This is kind of permission control, 
			Think about how EOS achieve this, permission control

Event: These can be used to keep track of balance and allowance changes for addresses without needing to poll the blockchain.
	Transfer()
	Approval()

Address(0):
	Minting tokens emits a Transfer() event with the 0 address as the source.
		balances[minter] = balances[minter].add(mintAmount) 
		emit Transfer(0,minter,mintAmount)
	There is no event emitted when tokens are burned. Due to this, ERC-20 token contracts that burn tokens commonly transfer() the tokens to the 0 address in lieu of real burning. Total supply no change, because address(0) also included in the mapping records

**Walkthrough**

Ethereum, tokens & smart contracts. Notes on getting started : Part 11. Some intermediate considerations.
https://medium.com/@k3no/ethereum-tokens-smart-contracts-743b8b634e7a
终极指南https://blockgeeks.com/guides/ethereum-token/
Ethereum smart service payment with tokens https://medium.com/@jgm.orinoco/ethereum-smart-service-payment-with-tokens-60894a79f75c

**Questions**

?:How if the sender who call transfrom(from, to, value) and from is himself? Will fail

?: Send token to a contract address
Attention! Be careful using Ethereum tokens. https://www.reddit.com/r/ethereum/comments/60ql37/attention_be_careful_using_ethereum_tokens/

?: transfer token to the token contract itself(not the EOA/admin account who deploy it)
Intially all the token belongs to admin,here the msg.sender is admin,and how about
transfer(EIP20_address,token amount)?

It doesn’t matter whether the contract has fallback, because only ether require fallback, token no need,refer to”Deposit and withdraw token / escrow token” 

My anwser 
https://ethereum.stackexchange.com/questions/46457/send-tokens-using-approve-and-transferfrom-vs-only-transfer/61362#61362
https://ethereum.stackexchange.com/questions/25891/unable-to-transfer-ether-from-one-contract-to-another/61423#61423

### 1.2 Issue token

**Mainstream Standard**

There are already plenty of ERC20-compliant tokens deployed on the Ethereum network. Different implementations have been written by various teams that have different trade-offs: from gas saving to improved security.
Official Implementation
https://www.ethereum.org/token
ConsenSys ERC20 Implementation
Latest: https://github.com/ConsenSys/Tokens
Humanstandard: https://github.com/ConsenSys/Tokens/tree/humanstandard/Token_Contracts/contracts
https://github.com/ConsenSys/Tokens/blob/fdf687c69d998266a95f15216b1955a4965a0a6d/contracts/eip20/EIP20.sol
OpenZeppelin implementation
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol
	zeppelin-solidity/contracts/token/StandardToken.sol

**ICO implementation end to end**

ICO stands for a token or cryptocurrency initial offering crowdsale. It is a common method in blockchain space, decentralized applications and in-game tokens for bootstrap funding of your project.
https://github.com/TokenMarketNet/ico
 
Open Source Dashboard and smart-contract for your ICO
https://bitcointalk.org/index.php?topic=3009880.0
https://github.com/JincorTech/backend-ico-dashboard - Backend
https://github.com/JincorTech/frontend-ico-dashboard - Frontend
https://github.com/JincorTech/ico - Smart-contracts

zipper
https://github.com/zipperglobal/zipt_token
loopring
https://github.com/Loopring/ico

**Audit**

Zilliqa Token Audit https://docs.zilliqa.com/ZKLabs-Zilliqa-Audit.pdf
Polymath Audit
https://blog.zeppelin.solutions/polymath-audit-be55e9936aba
other
https://blog.coinfabrik.com/dreamteam-token-audit/

### 1.3 Use Token

1. Use token with ether
Refer to my TokenShop implementation 
Still the gas has to pay with ether
https://ethereum.stackexchange.com/questions/23420/using-token-vs-ether-in-contract
Deposit and withdraw token / escrow token / 
https://ethereum.stackexchange.com/questions/46318/how-can-i-transfer-erc20-tokens-from-a-contract-to-an-user-account

2.Use token without ether
You don’t Need Ether to Transfer Tokens 
https://hackernoon.com/you-dont-need-ether-to-transfer-tokens-f3ae373606e1, https://github.com/dreamteam-gg/smart-contracts/
Announcing The ERC-20 Transporter — Now Anyone Can Send ERC-20 Tokens Without Holding ETH
https://hackernoon.com/announcing-the-erc-20-transporter-now-anyone-can-send-erc-20-tokens-without-holding-eth-1c1aae361e89
https://github.com/bokkypoobah/BokkyPooBahsTokenTeleportationServiceSmartContract


## 2. Fungible token: ERC223

1) you can't react on any incoming transactions, as it's just a change in the bookkeeping 
2) if you transfer tokens to a contract, the only entity that can transfer them from the contract to another address would be the contract. If your contract doesn't know how to do this (which most contracts can't), the tokens would be stuck forever.

## 3. Non fungible token: ERC721

https://github.com/ethereum/EIPs/issues/721
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md

### 3.1 Anatomy

https://medium.com/crypto-currently/the-anatomy-of-erc721-e9db77abfc24
https://medium.com/decentraland/dars-nfts-and-the-new-erc-721-132a705eab42

**basic **

mapping (uint256 => address) internal idToOwner;	
tokenID => owner
mapping (address => uint256) internal ownerToNFTokenCount; 
compatible to erc20, balance/quantity of token
mapping (uint256 => address) internal idToApprovals;	
can transfer
mapping (address => mapping (address => bool)) 
can transfer and operate
internal ownerToOperators; equivalent to EOS permission level

**Extension**

Enumeration:
mapping(address => uint256[]) internal ownerToIds;
	Mapping from owner to list of owned NFT IDs.
Metadata:
storing data on the blockchain that tell the defining characteristics of each token is extremely expensive and not recommended. To combat this, we can store references, like an IPFS hash or HTTP(S) link, to each token’s attributes on the chain so that a program outside of the chain can execute logic to find more information about the token. These references are data about data, or metadata

### 3.2 Implement 
https://github.com/0xcert/ethereum-erc721
cryptokitties

## 4.Non Fungible token: ERC873


## 5.Swap tokens
Atomic Swap Marketplaces for Non-Fungible Tokens
https://hackernoon.com/test-bd14e0e1170d
