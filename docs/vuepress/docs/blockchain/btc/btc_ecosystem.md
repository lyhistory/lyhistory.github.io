比特币生态新趋势：闪电网络、Ordinal、Atomical、bitVM
https://www.odaily.news/en/post/5191447

When discussing Bitcoin, it is important to recognize its limitations, especially in its ability to execute complex programs and smart contracts. Therefore, to discuss the development of the Bitcoin ecosystem, we need to first summarize and summarize what problems the Bitcoin ecosystem needs to solve.

Generally speaking, there are three aspects: 
+ first, how to improve network efficiency and reduce transaction fees without affecting the security of the Bitcoin network; 
+ second, how to solve the problem of native problems on the Bitcoin network without causing a burden on the Bitcoin network. The issuance of assets; 
+ the third is how to solve the problem of carrying more smart contracts and complex applications on the Bitcoin network under the condition of Turing incompleteness.

Here are some directions to explore:

Enhanced Bitcoin scripting capabilities: Although Bitcoin’s scripting language is relatively simple, developers have been exploring how to add more functionality within the existing framework. This includes developing more complex transaction types and conditions, such as improved multi-signature mechanisms and complex locking conditions.

Sidechain technology: Sidechains are independent blockchains that are separate from the Bitcoin main chain but connected to it. This allows for more complex functionality to be implemented on sidechains, including Turing-complete smart contracts, without compromising the security and stability of the Bitcoin main chain.

Lightning Network: As a second-layer solution for Bitcoin, the Lightning Network aims to provide faster and lower-cost micropayments while reducing congestion on the blockchain. While this is primarily intended to address Bitcoin’s scalability issues, it also provides developers with a platform to experiment with new features.

Rootstock (RSK): RSK is a smart contract platform that is connected to the Bitcoin blockchain via sidechains. RSK aims to bring Turing completeness to the Bitcoin ecosystem, enabling users to create and execute complex smart contracts within Bitcoin’s security framework.

RGB: The core goal of the project is to implement smart contracts and asset issuance on the Bitcoin blockchain while maintaining its decentralization and security features. By using Bitcoin’s Layer 2 technology, the RGB project allows users to create and manage non-fungible tokens (NFTs) and other types of complex assets on top of the Bitcoin network. This means that RGB brings more advanced features to Bitcoin, such as tokenized assets, smart contracts, and digital identities, without affecting the stability and security of the Bitcoin main chain. The RGB project represents the Bitcoin community’s efforts to explore expanding its basic functionality and may have a broader impact on Bitcoin’s application scenarios and value. However, such attempts also present challenges in technical implementation and community acceptance.

Taproot/Schnorr Signatures: These upgrades bring more privacy and efficiency to the Bitcoin network. While these upgrades do not directly make Bitcoin Turing complete, they provide a foundation for possible future feature expansions.

Stacks (STX): Bitcoin smart contract layer, designed to extend the functionality of Bitcoin to support smart contracts and decentralized applications. The main goal is to introduce smart contract functionality on the Bitcoin blockchain, allowing developers to build decentralized applications (DApps) and smart contracts to expand the uses of Bitcoin. Stacks 2.0 adopts the POX consensus, and participants are rewarded with more stable, underlying chain cryptocurrencies. Compared with the new blockchain’s cryptocurrencies, the underlying chain cryptocurrency rewards are more motivating to early participants, which helps attract early participation. The consensus is stronger.

Empower BTC: Increase the vitality of the Bitcoin economy by converting BTC into assets for building DApps and smart contracts.

Ordinal Protocol: Introduces an innovative method of data storage and tokenization to the Bitcoin network without changing the infrastructure of Bitcoin itself. This protocol utilizes the transaction output sequence number (ordinal number) on the Bitcoin blockchain to allow users to embed small pieces of data in specific Bitcoins. While this increases the need for data storage on the Bitcoin blockchain, it also opens up new possibilities for exploring Bitcoin as a versatile, multi-dimensional asset platform.

Atomic protocol: It is a simple and flexible protocol that has emerged recently. It is used to mint, transmit and update digital objects (i.e. digital objects) for unspent transaction output (UTXO) blockchains such as Bitcoin. The core is minting and transmitting. and some key simple rules to follow for update operations

BitVM: The bitVM project is an innovative attempt to enhance the functionality and flexibility of the Bitcoin network. bitVM is implemented as a virtual machine with the goal of providing more advanced programming capabilities and smart contract functions on the Bitcoin blockchain. This approach will allow developers to create more complex and versatile applications on the Bitcoin network, extending its use cases beyond just being a digital currency. By implementing such a virtual machine, bitVM aims to maintain the security and decentralized nature of Bitcoin Core while introducing more programmability and interoperability. This project represents the Bitcoin community’s exploration of technological innovation and expanding its blockchain capabilities, potentially bringing functionality to Bitcoin similar to the Ethereum smart contract platform. However, there may be challenges with technology and community consensus.

## About segwit and taproot
Before introducing many protocols and projects in the Bitcoin ecosystem, we need to have some brief understanding of segwit and taproot.

Taproot, a major Bitcoin protocol upgrade, was activated in November 2021.
It introduced several improvements, including better privacy for complex transactions, lower fees, and basic smart contract capabilities.

🌱 Schnorr Signatures are a key component of the Taproot upgrade. They enable signature aggregation, resulting in smaller transaction sizes and increased efficiency.

Taproot was a soft fork upgrade, meaning it's backwards compatible with the existing Bitcoin protocol. Nodes could choose to adopt the upgrade without affecting the core network.

With Taproot and Schnorr Signatures, Bitcoin continues to evolve, solving key challenges and providing an improved user experience for its vast, global userbase ⚡



Since the birth of Bitcoin, its simple and elegant technology and exquisite economic incentive design have become the belief of a large number of decentralists. In this process, after repeated demonstrations and iterations by the community, its network has gone through many important Upgrades, including BIP 34 introducing version numbers in blocks, laying the foundation for future protocol upgrades, BIP 66 enhancing the security of the network by requiring digital signatures in Bitcoin transactions to follow a determined format, BIP 65 (OP_CHECKLOCKTIMEVERIFY) Allows the creation of transactions with time-locking functions, thereby increasing the flexibility of creating complex transaction scripts, etc. Among the many upgrades, the most important to the expansion of the Bitcoin ecosystem are undoubtedly SegWit (Segregated Witness) and Taproot, which aim to improve Bitcoin The scalability and efficiency of the network also laid a solid foundation for subsequent technological innovations including Ordinal and other related protocols.

SegWit, first introduced in 2017, mainly solves the problem of transaction plasticity. By separating transaction signature information (witness data) from transaction data, it increases the effective capacity of the block, thereby improving the networks processing power and reducing transaction costs. cost. Additionally, SegWit provides a better foundation for Bitcoin’s second-layer solutions, such as the Lightning Network, making micropayments more viable.

Taproot, activated in 2021, is another major upgrade to the Bitcoin protocol. It improves privacy and security while optimizing the efficiency and flexibility of smart contracts by introducing Schnorr signatures. Taproot enhances user privacy by making all transactions, whether simple payments or complex smart contracts, look the same externally. In addition, this upgrade reduces the cost of multi-signature transactions by simplifying the data requirements for such transactions, making complex contracts more feasible on the Bitcoin network.

Overall, these two upgrades, SegWit and Taproot, have jointly improved the performance, scalability, and functionality of the Bitcoin network, laying a solid foundation for Bitcoins future development.

## Sidechain or Layer 2 solutions represented by Lightning Network
For a long time, sidechains and Layer 2 solutions have been the focus of the Bitcoin ecosystem and are key technological innovations to address the scalability and efficiency issues of the Bitcoin network. Projects in this category include Lightning Network, Rootstock (RSK) , Stacks, Liquid, MintLayer, RGB, etc. Among them, the Lightning Network, as the king of legitimacy, was born out of the payment channel concept conceived by Satoshi Nakamoto. From 2016 to the outbreak of the Ordinal ecosystem, it attracted the attention of the Bitcoin ecosystem. More than half of the developers and participants, around 2020, the Lightning Network became known to the entire crypto community with the help of Nostr.

A sidechain is an independent blockchain that runs parallel to the main Bitcoin chain and interacts with the main chain through a specific anchoring mechanism. This design allows users to move assets from the Bitcoin main chain to side chains, which can provide faster transaction confirmations, lower handling fees, and even support more complex smart contracts and applications. Since sidechains handle a large number of transactions on the main chain, they help reduce the burden on the main chain and improve the performance of the entire network.

The Lightning Network is a layer 2 solution built on top of Bitcoin's blockchain. It uses smart contracts to create payment channels, allowing for instant transactions with minimal fees.

This scalability solution addresses Bitcoin's capacity constraints. ⚡

With the Lightning Network, users can transact with each other off-chain, reducing the burden on the main Bitcoin blockchain.

Funds are locked in a multi-signature wallet, and the channel is updated with each transaction.

When users want to settle their transactions on-chain, they can simply close the payment channel, and the final state of the channel is recorded on the blockchain.

This innovative approach has opened the door for micropayments and new use cases. 🔓

The Lightning Network is still growing and evolving. Its development demonstrates the potential for further innovation and expansion in the world of Bitcoin, ensuring its continued relevance in the digital economy. 🌐


Layer 2 solutions, such as the famous Lightning Network, are protocol layers built on top of the Bitcoin main chain. These solutions achieve fast and efficient transaction processing by creating off-chain transaction channels that only need to interact with the Bitcoin main chain when opening or closing the channel. They are especially effective for supporting small-amount, high-frequency transactions, greatly expanding the Bitcoin’s application possibilities in areas such as daily payments and micro-transactions.

However, for a long time, the Lightning Network was only used for small payments and did not support the issuance of other assets. With limited use cases, it was overtaken by Ordinal in popularity. In October 2023, lightning labs released the Taproot Assets protocol on the main network, supporting the issuance of stablecoins and other assets on Bitcoin and the Lightning Network. As development director Ryan Gentry mentioned, Taproot Assets will provide developers with “the tools needed to make Bitcoin a multi-asset network, but in a scalable way that maintains Bitcoin’s core value.”

With a Taproot-centric design, Taproot Assets delivers assets on Bitcoin and the Lightning Network in a more private and scalable way. Assets issued on Taproot Assets can be deposited into Lightning Network channels, where nodes can provide atomic conversions from Bitcoin to Taproot Assets. This enables Taproot Assets to interoperate with the wider Lightning Network, benefiting from its reach and enhancing its network effects.

However, as@blockpunk 2077 As mentioned, at the current stage, “users cannot directly send transactions on the BTC main network to mint Tokens on their own. Instead, there is a project party address that issues (or registers) all Tokens at once, and then the project party transfers them. into the Lightning Network for distribution. Therefore, Taproot Assets Tokens are not distributed fairly through free casting, and often require a centralized project party to conduct airdrops. The project party itself can also reserve tokens, as is the case with the just-issued $trick $treat . This centralized feature has attracted some criticism and is not entirely in line with the Bitcoin communitys pursuit of decentralization and disintermediation.

## Ordinal, BRC 20 and the Pandora’s box it opens

Regarding Ordinal and the BRC 20 protocol, we will not go into details here. As an innovative application, Ordinal implements a new data storage method on the Bitcoin blockchain, which gives each Satoshi a unique serial number and tracks them in transactions, allowing users to Transactions embed non-homogeneous, complex data. With the inscription allowing the use of NFTs on Bitcoin, the natural progression of development shifted towards fungible tokens. On March 9, an anonymous Crypto Twitter user named @domo published a thread theorizing a method called BRC-20 that could create a fungible token standard on top of the Ordinals protocol. Essentially, the method is to inscribe text on sats to create fungible tokens. The original design allowed only three different operations: deploy, cast, and transfer.

We believe that the design of the Ordinal protocol and its derivative BRC 20 is very exquisite. It solves the big problem of asset issuance in a simple and fast way. It coincides with the design concept of Bitcoin, making it easier to attract Bitcoin ecological participants. widespread attention and support. **And it plays more of a connecting role in the Bitcoin ecosystem. **It inherits and utilizes the new features after the Bitcoin Taproot upgrade, making it possible to store a large amount of data in a single transaction. In this way, the Ordinals protocol can directly create and transfer digital artworks, collectibles, etc. on the Bitcoin chain, bringing the concept of NFT (non-fungible tokens) to the Bitcoin blockchain, which is similar to Ethereum, etc. NFT implementations on platforms vary.

The BRC 20 standard is derived from the Ordinals protocol and aims to implement a token standard on the Bitcoin blockchain similar to Ethereum’s ERC 20. The goal of BRC 20 is to provide a standardized definition and interface for tokens in the Bitcoin ecosystem, allowing developers to create, issue and manage tokens on the Bitcoin blockchain, similar to token operations on Ethereum . This means that in the future, complex token transactions and smart contract operations can also be performed on the Bitcoin chain, although this requires complex programming and data storage technology. The proposal of the BRC 20 standard is an expansion of the functions of Bitcoin, showing the continuous maturity and diversification of the Bitcoin ecosystem. However, implementing such a standard requires broad community support and further technical development.

The innovation of Ordinals is mainly reflected in the fact that before this, Bitcoin was fungible or interchangeable, and one Satoshi on the blockchain could not be distinguished from another Satoshi. Ordinal changes this by leveraging two updates to the original Bitcoin protocol:Segregated Witness(SegWit) and Taproot. Simply put, SegWit allows cheaper data to be put into the witness portion of a transaction and effectively increases the block size, while Taproot allows for advanced scripting in the witness portion. Combined, these two updates are critical to Inscription as they allow for more arbitrary data storage within the witness portion of any Bitcoin block.

In general, the emergence of Ordinals and BRC 20 not only detonated the Bitcoin market (the source of miners income completely changed, please see the figure below), but also pointed the direction for some subsequent improved protocols. For example, the BRC 20 standard TRAC deployed by Beny, an active developer in the Bitcoin community, and the first Cursed Inscription-CRSD with a total amount of 21 million, based on this, launched the BRC-20 improved version of Tap Protocol positioned at OrdFi. Tap Protocol is an improvement on the BRC-20 protocol level. Based on Tap Protocol, TAP and -TAP were released, and the Pipe protocol was also launched, which is an improved version of Runes.

Miner income analysis

In September, another anonymous developer in the Bitcoin community, after a period of polishing, believed that the Ordinal protocol had some design flaws. Based on this, he launched the Atomics Protocol. From a technical aesthetic point of view, Atomics is minted and disseminated based on BTCs UTXO, which does not bring additional burdens to the BTC network. It is more consistent with Bitcoin technology and has won the support of some Bitcoin fundamentalists. On the other hand, because the Ordinal protocol is more experimental and a more natural and spontaneous product, its BRC 20 protocol is unexpected in another sense that Ordinal founder Casey did not expect. Derivatives, so the Ordinal ecology is not planning. Atomics is different. After thinking and polishing, as well as the founders own foresight, the Atomics ecosystem has a clear blueprint.

Here we give a brief introduction to the Atomicals protocol.

The Atomics protocol is a simple and flexible protocol for minting, transmitting and updating digital objects (i.e. digital objects, traditionally called NFTs) for Unspent Transaction Output (UTXO) blockchains such as Bitcoin. Atomic considers NFTs to be A very technical term that fails to convey the multitude of uses available, the choice to use the term digital object to draw out all the potential uses of the protocol is more familiar to the average person and more developer friendly).

Atomical (or Atom) is a way to organize the creation, transfer and update of digital objects - it is essentially a chain of digital ownership defined according to some simple rules. The protocol is open source and free for anyone to use. All libraries, frameworks, and services are released under MIT and GPL v3 to ensure that no one has control over these tools and protocols.

Atomic’s main advantage over other Bitcoin ecosystem protocols is that it does not require the use of a centralized service or middleman as a trusted indexer. It does not require any changes to Bitcoin, nor does it require sidechains or any auxiliary layers. It is intended to be compatible with other emerging protocols such asNostr、Ordinalsetc.) coordinate work. Each protocol has its own different benefits, and Atomics Digital Objects increases the range of options available to users, creators, and developers.

based on@bro.treeSaid, The Atomics protocol is the first protocol to use the POW process to mine token inscriptions. Everyone can personally mine tokens/realms/NFTs using the CPU. This is the most fascinating feature of the protocol.

In terms of future ecological scenarios and implementation, Atomical mainly considers three asset classes and their derived scenarios, namely ARC 20 (i.e., homogeneous tokens), non-homogeneous digital objects (i.e., NFT), and realm (digital identity). ), relevant implementation scenarios include: digital collectibles, media and art, digital identity, authentication and token-gated content, network hosting and file storage (Bitcoin native file system), peer-to-peer exchange and atomic swap (natural support for Swap) , digital namespace allocation (DAO construction and domain name revolution), virtual land and property rights registration, dynamic objects and states of games (Gamefi), social media profiles, posts and communities (verifiable SBT, Socialfi), etc.

In general, compared to the Ordinal protocol, ARC 20 and $ATOM are still very early and need to wait for the wallet and market to improve. However, because their technical design, mining settings, etc. are more consistent with Bitcoin, they are orthodox. Sex occupies a relatively high position, which is precious to the Bitcoin community. At the level of possibility, there is also an opportunity to achieve true BTC native DeFi. In terms of ecological development, there have been several small outbreaks in the community (see the picture below), but it has not experienced large-scale hype and still has great potential.

Atomic casting situation

In addition, it is worth mentioning that all tokens under the Atomic protocol use native Satoshi units to represent each token and can be split and combined like ordinary Bitcoins. 1 coin corresponds to 1 satoshi, and an atom is 1000 coins, which corresponds to 1000 satoshi BTC. This requires a period of adaptation for beginners in the ecosystem. If the atom is burned as an ordinary BTC handling fee during the transfer process, it will be destroyed.

## bitVM - the holy grail of the Bitcoin ecosystem?
In the Bitcoin ecosystem, bitVM, Ordinal, and atomicals protocols each represent technological innovation and expansion in different directions. The goal of bitVM is to provide the Bitcoin network with more advanced programming capabilities and smart contract functionality, thereby broadening its scope of applications and increasing its functionality. This approach attempts to introduce more programmability and flexibility while maintaining Bitcoin’s core properties such as security and decentralization.

Simply put, bitVM is a computing model that allows developers to run complex contracts on Bitcoin without changing its underlying rules. Since the bitVM concept was proposed and the white paper was released in October 2023, it has aroused widespread attention and expectations in the Bitcoin community. Bitcoin community developer Super Testnet once boldly declared that this may be the most exciting discovery in the history of Bitcoin scripts. In an abstract sense, bitVM works similar to the Lightning Network, considered by a section of the community to be the future of Bitcoin payments, as it also uses off-chain mechanisms to scale Bitcoin transactions.

As mentioned earlier, Bitcoin serves as the digital gold standard for cryptocurrency, but what lags behind other public chain ecosystems is its ability to handle complex, Turing-complete smart contracts. BitVM started from this point, the Bitcoin Virtual Machine created by Robin Linus. It is also worth mentioning that Robin also created ZeroSync, which is an exciting direction, introducing zero-knowledge proof into the Bitcoin ecosystem. Focus on the Bitcoin implementation of Stark Proofs.

If we sum it up in one sentence, that is, under BitVM, calculations will be performed off-chain and verified on-chain, similar to the op rollup mechanism on Ethereum.

Similarly, BitVM involves two main players: provers and verifiers. A prover is the party that initiates a computation or claim, essentially saying, Here is a program and here is what I assert it will do or produce. A verifier, on the other hand, is responsible for verifying that claim. This dual-role system allows for a level of checks and balances to ensure that calculations are accurate and trustworthy.

BitVMs originality lies in its handling of computing workloads. Unlike traditional blockchain operations that place much of the computational burden on-chain, most of BitVM’s complex calculations are performed off-chain. This significantly reduces the amount of data that needs to be stored directly on the Bitcoin blockchain, increasing efficiency and reducing costs. This off-chain approach also provides greater speed and flexibility, as developers or users can run complex programs or simulations without worrying about overwhelming the blockchain.

However, BitVM does employ on-chain verification when needed, especially in the event of a dispute. If a validator questions the legitimacy of a provers claim, the system will refer to the Bitcoin blockchains immutable decentralized ledger to resolve the issue. This is achieved through what is called a fraud proof.

If the provers claims turn out to be false, the verifier can submit a concise proof of fraud to the blockchain, thus exposing the dishonesty. This not only resolves disputes but also maintains the overall integrity of the system. By integrating off-chain computation and on-chain verification, BitVM achieves a balance of computational efficiency and strong security, known as Optimistic rollup. The basic idea is to assume that all trades are correct (optimistic) until proven otherwise. Only when a dispute arises will the relevant data and calculations be published and verified on the main blockchain. This significantly reduces the amount of data that must be stored on-chain, freeing up space and lowering transaction fees.

Optimistic rollup is particularly useful in BitVM. Most of the computational work occurs off-chain, reducing the amount of data that needs to be stored on the Bitcoin blockchain. When a transaction is initiated, BitVM can use Optimistic Rollups to bundle multiple off-chain transactions into a single on-chain transaction, further reducing the blockchain footprint.

Additionally, BitVMs use of fraud proofs aligns well with Optimistic Rollups inherent challenge-response system in the event of a dispute. If the prover makes a false claim, the verifier can quickly expose the dishonesty by providing concise evidence of the fraud. This evidence of fraud will then be reviewed within the Optimistic Rollup framework and, if verified, the dishonest party will be punished.

The difference is that although BitVM and Ethereums EVM (Ethereum Virtual Machine) both provide smart contract functions, their methods and functions are different. Ethereum’s EVM is more versatile in supporting multi-party contracts and provides a wider range of computational tasks on the blockchain, but this may lead to higher costs and a confusing blockchain. BitVM, on the other hand, mainly focuses on two-party contracts and performs most of the computing work off-chain. This minimizes the footprint on the Bitcoin blockchain and reduces transaction costs. However, BitVMs current design limits its applicability in complex multi-party environments, which is an area where Ethereum EVM excels.

Not everyone believes that BitVM deserves attention, and it has also caused concern among some people. As Dan from the paradigm institute said, the protocol only applies to two parties, so it cannot be used for rollups or other multi-party applications, and this itself does not For the parts that are too new, for example, programmer Greg Maxwell proposed a better protocol (ZK contingent payments) a long time ago to solve the same problem. But we have to admit that if bitVM works, BitVM may have a broad impact on what is built on top of Bitcoin. Another criticism is that even if the computation is done off-chain, on-chain verification can still incur significant overhead. And the BitVM proposal says it won’t add a lot of transaction volume to the network and cause gas fees to spike — like they did when Ordinals surged in popularity.

In general, bitVM is actually still in the conceptual stage. As Linus said, The purpose of publishing the white paper is to describe the idea in simple terms and stimulate community interest, but it is not yet a complete solution.


Restoring your standard wallet from seed https://bitcoinelectrum.com/restoring-your-standard-wallet-from-seed/