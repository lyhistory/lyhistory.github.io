(window.webpackJsonp=window.webpackJsonp||[]).push([[88],{512:function(e,t,n){"use strict";n.r(t);var o=n(65),a=Object(o.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h2",{attrs:{id:"_1-key-concepts"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-key-concepts"}},[e._v("#")]),e._v(" 1. Key concepts:")]),e._v(" "),n("p",[e._v("EOA: Ether owner account")]),e._v(" "),n("h2",{attrs:{id:"_1-fungible-token-erc20-eip20"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-fungible-token-erc20-eip20"}},[e._v("#")]),e._v(" 1. Fungible token - ERC20 - EIP20")]),e._v(" "),n("p",[e._v("https://github.com/ethereum/eips/issues/20\nhttps://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md")]),e._v(" "),n("h3",{attrs:{id:"_1-1-anatomy"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-anatomy"}},[e._v("#")]),e._v(" 1.1 Anatomy")]),e._v(" "),n("p",[e._v("https://medium.com/@jgm.orinoco/understanding-erc-20-token-contracts-a809a7310aa5\nmapping<address, balance>\nName symbol decimal (decide by purpose)\nTotal supply\nIncrease: mint\nDecrease: burn")]),e._v(" "),n("p",[e._v("Function:\nbalanceOf()\ntransfer()\ttwo party, message sender to another address\nBe aware that, when a EOA call transfer function directly, the sender is the EOA,\nBut if in smart contract function ABC() calls transfer(), the sender is always this contract\nIn EOS, in function ABC() you can call transfer() with another one’s permission granted to the contract\napprove()\nallowance()\t\ntransferFrom() three party, msg.sender, from address, to address,\ntransFrom is usually used at exchange, deposit and withdraw in represent of token owner\nThis is kind of permission control,\nThink about how EOS achieve this, permission control")]),e._v(" "),n("p",[e._v("Event: These can be used to keep track of balance and allowance changes for addresses without needing to poll the blockchain.\nTransfer()\nApproval()")]),e._v(" "),n("p",[e._v("Address(0):\nMinting tokens emits a Transfer() event with the 0 address as the source.\nbalances[minter] = balances[minter].add(mintAmount)\nemit Transfer(0,minter,mintAmount)\nThere is no event emitted when tokens are burned. Due to this, ERC-20 token contracts that burn tokens commonly transfer() the tokens to the 0 address in lieu of real burning. Total supply no change, because address(0) also included in the mapping records")]),e._v(" "),n("p",[n("strong",[e._v("Walkthrough")])]),e._v(" "),n("p",[e._v("Ethereum, tokens & smart contracts. Notes on getting started : Part 11. Some intermediate considerations.\nhttps://medium.com/@k3no/ethereum-tokens-smart-contracts-743b8b634e7a\n终极指南https://blockgeeks.com/guides/ethereum-token/\nEthereum smart service payment with tokens https://medium.com/@jgm.orinoco/ethereum-smart-service-payment-with-tokens-60894a79f75c")]),e._v(" "),n("p",[n("strong",[e._v("Questions")])]),e._v(" "),n("p",[e._v("?:How if the sender who call transfrom(from, to, value) and from is himself? Will fail")]),e._v(" "),n("p",[e._v("?: Send token to a contract address\nAttention! Be careful using Ethereum tokens. https://www.reddit.com/r/ethereum/comments/60ql37/attention_be_careful_using_ethereum_tokens/")]),e._v(" "),n("p",[e._v("?: transfer token to the token contract itself(not the EOA/admin account who deploy it)\nIntially all the token belongs to admin,here the msg.sender is admin,and how about\ntransfer(EIP20_address,token amount)?")]),e._v(" "),n("p",[e._v("It doesn’t matter whether the contract has fallback, because only ether require fallback, token no need,refer to”Deposit and withdraw token / escrow token”")]),e._v(" "),n("p",[e._v("My anwser\nhttps://ethereum.stackexchange.com/questions/46457/send-tokens-using-approve-and-transferfrom-vs-only-transfer/61362#61362\nhttps://ethereum.stackexchange.com/questions/25891/unable-to-transfer-ether-from-one-contract-to-another/61423#61423")]),e._v(" "),n("h3",{attrs:{id:"_1-2-issue-token"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-issue-token"}},[e._v("#")]),e._v(" 1.2 Issue token")]),e._v(" "),n("p",[n("strong",[e._v("Mainstream Standard")])]),e._v(" "),n("p",[e._v("There are already plenty of ERC20-compliant tokens deployed on the Ethereum network. Different implementations have been written by various teams that have different trade-offs: from gas saving to improved security.\nOfficial Implementation\nhttps://www.ethereum.org/token\nConsenSys ERC20 Implementation\nLatest: https://github.com/ConsenSys/Tokens\nHumanstandard: https://github.com/ConsenSys/Tokens/tree/humanstandard/Token_Contracts/contracts\nhttps://github.com/ConsenSys/Tokens/blob/fdf687c69d998266a95f15216b1955a4965a0a6d/contracts/eip20/EIP20.sol\nOpenZeppelin implementation\nhttps://github.com/OpenZeppelin/openzeppelin-solidity/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol\nzeppelin-solidity/contracts/token/StandardToken.sol")]),e._v(" "),n("p",[n("strong",[e._v("ICO implementation end to end")])]),e._v(" "),n("p",[e._v("ICO stands for a token or cryptocurrency initial offering crowdsale. It is a common method in blockchain space, decentralized applications and in-game tokens for bootstrap funding of your project.\nhttps://github.com/TokenMarketNet/ico")]),e._v(" "),n("p",[e._v("Open Source Dashboard and smart-contract for your ICO\nhttps://bitcointalk.org/index.php?topic=3009880.0\nhttps://github.com/JincorTech/backend-ico-dashboard - Backend\nhttps://github.com/JincorTech/frontend-ico-dashboard - Frontend\nhttps://github.com/JincorTech/ico - Smart-contracts")]),e._v(" "),n("p",[e._v("zipper\nhttps://github.com/zipperglobal/zipt_token\nloopring\nhttps://github.com/Loopring/ico")]),e._v(" "),n("p",[n("strong",[e._v("Audit")])]),e._v(" "),n("p",[e._v("Zilliqa Token Audit https://docs.zilliqa.com/ZKLabs-Zilliqa-Audit.pdf\nPolymath Audit\nhttps://blog.zeppelin.solutions/polymath-audit-be55e9936aba\nother\nhttps://blog.coinfabrik.com/dreamteam-token-audit/")]),e._v(" "),n("h3",{attrs:{id:"_1-3-use-token"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-use-token"}},[e._v("#")]),e._v(" 1.3 Use Token")]),e._v(" "),n("ol",[n("li",[e._v("Use token with ether\nRefer to my TokenShop implementation\nStill the gas has to pay with ether\nhttps://ethereum.stackexchange.com/questions/23420/using-token-vs-ether-in-contract\nDeposit and withdraw token / escrow token /\nhttps://ethereum.stackexchange.com/questions/46318/how-can-i-transfer-erc20-tokens-from-a-contract-to-an-user-account")])]),e._v(" "),n("p",[e._v("2.Use token without ether\nYou don’t Need Ether to Transfer Tokens\nhttps://hackernoon.com/you-dont-need-ether-to-transfer-tokens-f3ae373606e1, https://github.com/dreamteam-gg/smart-contracts/\nAnnouncing The ERC-20 Transporter — Now Anyone Can Send ERC-20 Tokens Without Holding ETH\nhttps://hackernoon.com/announcing-the-erc-20-transporter-now-anyone-can-send-erc-20-tokens-without-holding-eth-1c1aae361e89\nhttps://github.com/bokkypoobah/BokkyPooBahsTokenTeleportationServiceSmartContract")]),e._v(" "),n("h3",{attrs:{id:"example-weth"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#example-weth"}},[e._v("#")]),e._v(" Example: WETH")]),e._v(" "),n("p",[e._v("All of decentralized finance (DeFi) is built upon smart contracts, which can be thought of as decentralized programs. Those smart contracts are designed to handle ERC-20 tokens. ERC-20 is a token standard, a kind of blueprint that is universally recognized not only on the Ethereum blockchain, but many other compatible blockchains such as Avalanche and Polygon. The ERC-20 standard allows the efficient building of software, for example getting rid of custom code that would be needed to handle each new token. Since ETH is the Ethereum native currency, and because it preceded the development of the ERC-20 standard, it isn’t ERC-20 compatible. This means custom software would have to be written on every DeFi decentralized application (DApp) in order to accept ETH. Instead, a smart contract was written that envelopes ETH in an ERC-20 wrapper so that any DApp with ERC-20 support can effectively support ETH.")]),e._v(" "),n("h2",{attrs:{id:"_2-fungible-token-erc223"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-fungible-token-erc223"}},[e._v("#")]),e._v(" 2. Fungible token: ERC223")]),e._v(" "),n("ol",[n("li",[e._v("you can't react on any incoming transactions, as it's just a change in the bookkeeping")]),e._v(" "),n("li",[e._v("if you transfer tokens to a contract, the only entity that can transfer them from the contract to another address would be the contract. If your contract doesn't know how to do this (which most contracts can't), the tokens would be stuck forever.")])]),e._v(" "),n("h2",{attrs:{id:"_3-non-fungible-token-erc721"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-non-fungible-token-erc721"}},[e._v("#")]),e._v(" 3. Non fungible token: ERC721")]),e._v(" "),n("p",[e._v("https://github.com/ethereum/EIPs/issues/721\nhttps://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md")]),e._v(" "),n("h3",{attrs:{id:"_3-1-anatomy"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-anatomy"}},[e._v("#")]),e._v(" 3.1 Anatomy")]),e._v(" "),n("p",[e._v("https://medium.com/crypto-currently/the-anatomy-of-erc721-e9db77abfc24\nhttps://medium.com/decentraland/dars-nfts-and-the-new-erc-721-132a705eab42")]),e._v(" "),n("p",[e._v("**basic **")]),e._v(" "),n("p",[e._v("mapping (uint256 => address) internal idToOwner;\t\ntokenID => owner\nmapping (address => uint256) internal ownerToNFTokenCount;\ncompatible to erc20, balance/quantity of token\nmapping (uint256 => address) internal idToApprovals;\t\ncan transfer\nmapping (address => mapping (address => bool))\ncan transfer and operate\ninternal ownerToOperators; equivalent to EOS permission level")]),e._v(" "),n("p",[n("strong",[e._v("Extension")])]),e._v(" "),n("p",[e._v("Enumeration:\nmapping(address => uint256[]) internal ownerToIds;\nMapping from owner to list of owned NFT IDs.\nMetadata:\nstoring data on the blockchain that tell the defining characteristics of each token is extremely expensive and not recommended. To combat this, we can store references, like an IPFS hash or HTTP(S) link, to each token’s attributes on the chain so that a program outside of the chain can execute logic to find more information about the token. These references are data about data, or metadata")]),e._v(" "),n("h3",{attrs:{id:"_3-2-implement"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-implement"}},[e._v("#")]),e._v(" 3.2 Implement")]),e._v(" "),n("p",[e._v("https://github.com/0xcert/ethereum-erc721\ncryptokitties")]),e._v(" "),n("h2",{attrs:{id:"_4-non-fungible-token-erc873"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-non-fungible-token-erc873"}},[e._v("#")]),e._v(" 4.Non Fungible token: ERC873")]),e._v(" "),n("h2",{attrs:{id:"_5-swap-tokens"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_5-swap-tokens"}},[e._v("#")]),e._v(" 5.Swap tokens")]),e._v(" "),n("p",[e._v("Atomic Swap Marketplaces for Non-Fungible Tokens\nhttps://hackernoon.com/test-bd14e0e1170d")]),e._v(" "),n("disqus")],1)}),[],!1,null,null,null);t.default=a.exports}}]);