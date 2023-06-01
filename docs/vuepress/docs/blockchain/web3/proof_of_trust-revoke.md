软件全称:基于椭圆曲线生成表达授权与撤销授权地址的独立程序

英文呢: express/proof of trust/revoke


intel i7-7500 CPU@2.70GHz,RAM 16G

无特殊要求，兼容windows/linux

windows10

Eclipse IDE

支持jdk的任意系统

jdk8.0以上

基于研究发现区块链领域有很多场景中跟链下的交互存在很多缺失的环节，比如用户交互安全性难以保证

不限行业，面向区块链领域和传统互联网领域这两个领域的连接

基于椭圆曲线ECC，利用循环群的特性，可以通过公钥和对应文件摘要的哈希计算获取该文件的授权许可地址以及授权撤销地址

中间件工具，其他服务可以直接集成我们的代码逻辑或者直接集成生成的jar程序


ECDSA (secp256k1),

ECC位长度在160–256位的范围内, 其安全性与1024–3072位的RSA和DL相同，更短的位长，处理时间越短，并且签名也短，由于这些原因，1998年椭圆曲线数字签名算法（ECDSA）被ANSI 美国国家标准研究所进行了标准化。

ECDSA的构建步骤跟DSA很接近，但是其离散对数问题是构造在基于素数域Zp或者是伽罗华域 Galois fields GF(2^m) 的椭圆曲线上，所以在实际计算过程上完全跟DSA不同。

java -jar target/tokenscripttool-0.0.1-SNAPSHOT-jar-with-dependencies.jar --trust 4660664bb150ca6db3d71f8f1873db9ba6c535716fa0ab39940b24aa8db0ece7 --pubkey 04856747172fcad0f0defbc8ebef218624964791e8431115fd09e74c35cfa2b9111c15511e7c6a2ca10916e97a0befd197de9800b71cb44a96fc5e0ccae0fcd0dd

## Express of Trust address

理论:

https://mail.google.com/mail/u/0/#search/TokenScriptTool/FMfcgxwCgzFSrzCzLpxqwZrtPznWswpj


https://github.com/TokenScript/TokenScript/blob/main/doc/authenticity+trustworthiness.md

工具：https://github.com/lyhistory/TokenScriptTool

https://community.tokenscript.org/t/demo-tool-for-express-of-trust/235

https://github.com/lyhistory/TokenScriptTool/releases/tag/0.0.1

https://github.com/TokenScript/TokenScript/pull/193

Produce a command line tool which
    Taking a TokenScript file for input, and provide the proof-of-trust

    address and the proof-of-revoke address for that TokenScript.

First, how do you get the digest of a TokenScript?



     Here is a short instruction:



     - Assume you already have xmlsectool installed.

     - Clone the TokenScript project https://github.com/AlphaWallet/TokenScript

     - Enter directory examples/nft

     - Observe the unsigned TokenScript EntryToken.xml

     - Sign it. (try to run Make and follow the instructions)

     - Observe the signed TokenScript EntryToken.tsml and notice the value in

     <DigestValue>

Now, notice that the DigestValue is obtained with xmlsectool, you should

     be able to study the source code of xmlsectool and manage to get a

     DigestValue for any TokenScript file.



     If you have a problem getting the DigestValue, Sangalli knows the answer.



Second, how do you get the proof-of-trust address and proof-of-revoke

address?



     security.md document is exactly what you need.



     If you have a problem understanding that, Tore knows the answer.





I believe you will need to ask some questions to Sangalli regarding

getting the DigestValue or ask Tore regarding getting proof-of-trust

address. Please register an account on tokenscript.org and ask

there. It's better than asking by email since others might seek this

knoweldge. Sangalli will make sure someone attends your

questions. e.g. he will whisle Tore if the issue about him goes

un-answered.



You can also join us for a design meeting next Thursday's weekly

meeting at 7 pm Sydney time in which Tore will show up.

hi, 

sorry a little bit busy yesterday, today I just got time go through the info you mentioned, and still got some questions need your clarification.

below is the step I finalized from my current understanding, 
![](./05_7.png)
so the purpose of the tool is to generate proof of trust address:

question 1: where to use digest value of Tokenscript, is it to get the s = keccak(digest value of the tokenscript file)

question 2: my cryptographic basis knowledge is not strong enough, it took me some time to recall the basic, is here Y=gˣ using RSA, at first I thought it's ecc, but ecc is scala multiplicative, something like Y=nG, but if it's RSA, we can't get eth address from RSA key, I'm confused refer to statements in Security.md " Assume that TokenScript project's donation address' public key is known, which is Y. In multiplicative group notation, its value is gˣ where 𝑥 is the private key held by TokenScript administration. " 

I understand that you might be concerned that there are math

expressions in your question so you weren't sure if they would be

displayed correctly if you post to TokenScript.org

Here is the key math expression I typed for you, which you can copy

and paste to the forum.

   Y' = Yʰ = (𝑔ˣ)ʰ = 𝑔ˣʰ = RSA.generate(Y, 𝑒=ℎ)
When you post, be specific about the problem (to get the

express-of-trust address by following the guide on the document):



https://github.com/AlphaWallet/TokenScript/blob/master/doc/security.md



Regards

(I would share my math keyboard layout with you but they are for Linux)

## Authenticity and trustworthiness of a TokenScript



(This document is not about the runtime security of Token Enclave - which will be documented separately. This deals with the authenticity and trustworthiness of a TokenScript on a textual level.)



A TokenScript file can be signed. A TokenScript can also be trusted. Ideally, both should be done.



At the moment, TokenScript is trusted through an "Express-of-Trust" transaction from the smart contract deployment key. In the future, a smart contract might be able to return the signing key needed for TokenScript. Both should work towards asserting the relationship between a Smart Contract and a TokenScript, hence establishing trust.



However, trust coming from smart contract alone isn't sufficient to the end user, since the user has otherwise no way to assert if the smart contract is the one he intends to interact with, or a phishing contract. But when that trust is not available, having the TokenScript signed helps the end-user to ascribe trust by authenticity.



- If a TokenScript is trusted, through an Express-of-Trust transaction, then the Smart Contract owner has either created or read the TokenScript and recommended the end-users to use it.



- If a TokenScript is signed, the end-user can ascribe authenticity (the author and integrity), and if that author is known to the end-user, he is likely to trust it without the Express-of-Trust; otherwise, he makes his own decision.



Or in other words:



- signing a TokenScript establish authenticity of the TokenScript but not how much the token contract trusts it;



- the express-of-trust transaction expresses that the token contract author trusts the TokenScript, but nothing about authenticity (who wrote it).



Or in layman's terms:



- Signing a TokenScript "connects" it to identity (e.g. a website, an organisation), with no guarantee if that identity is of a trustworthy entity.

- Express-of-trust claims the  TokenScript trustworthy, without connecting it to any identity.



Both have their uses. If you are a token contract author, you can do express-of-trust to a TokenScript; however, there are cases that signed TokenScripts are needed:



Case 1:



A token issuer (custodian) want to reassure a user who trusts it by an external (non-blockchain) identity (e.g. website domain name) that he/she is using the correct contract. For example, a token issuer changed its main contract after discovering some security exploitation. It knows that its user trust it by domain name, so it might issue a token script that is signed by the same domain name with expressed trust from both the old and new contract to help the user to migrate.



Case 2:



A token issuer discarded his deployment key (or lost it), but still wish to let its user trust the TokenScript they provided by the help of providing authenticity (revealing the authorship).



Case 3:



A token issuer did not write a TokenScript, but a 3rd party did it; or that the 3rd party has provided additional features. If the 3rd party gained trust (e.g. through social media or within a community), it can sign and release its own TokenScript, and the users can accept them by the reputation of the 3rd part without the token contract's Express-of-Trust.



(The cases of "mixed configuration", like when a 3rd party writes a TokenScript providing action in addition to the one written by the token issuer, is not covered in this introductory document. Instead, they are covered in the future modularisation documents.)



## Signed



A signed TokenScript file is a TokenScript file signed through the use of an XML Signature. Any signature signing algorithm supported by XML Signature (including ECDSA supported through XML Signature 1.1) is accepted.



At this moment, user agents should only accept such XML Signatures if certified by a certificate authority (CA). For convenience, a website certificate will do at this moment. In the years to come, implementations might require certificates from issuers who can validate an organisation or various forms of decentralised certificate issuers.



When a signed TokenScript is used, the user agent displays the domain name or organisation name of the certificate. It's up to the user if they allow the use of such a TokenScript. We expect users to assert judgement based on whether or not they recognise the CommonName of the certificate.



Revocation follows the same principles as these certificates normally do.



### Signing of external data



Any data reference - icons, images and language packs - used by the TokenScript must be referred to in the `<SignedInfo>` section of the XML signature using `<Reference>` element, or they will be considered not available (TokenScript implementations decide how to treat unavailable data). Each reference is downloaded and its digest verified as part of the TokenScript signature verification process. If any of the references fail to download or the digest doesn't match, the entire XML signature is bad. 



## Trusted (Ethereum)

A trusted TokenScript file is one explicitly trusted by the author of a token contract on Ethereum. Such trust is expressed by an Ethereum transaction. Only one signing algorithm, ECDSA (secp256k1), is used in express-of-trust because trust is expressed by an Ethereum transaction.

Such trust is also revoked by a transaction.

The transaction consists of a simple To address, with no data attached.

### The "from" address

If the smart contract has no key-management on its own, the transaction should be sent from the smart contracts deployment key. If the smart contract has a key management function, the transaction should be sent from the current administrative key.

### The "to" address

- to express trust, send any amount (e.g. 0Ξ) to a special address that represents the trust from the token contract (𝑡) to the TokenScript.

- to express revocation, send any amount (e.g. 0Ξ) to another special address that represents the revocation of such trust.

The express-of-trust special address is calculated in this way:

TokenScript project's donation address is: `0x000bd52fb4f46f148b0ff0cc651048e283d2d000`. Its public key is *Y*, its value is:

0x483d69cc4377d318da81402f2488f588ccae3d22a37be36457a574487d9ca4d9c38cd62d83113e440c7bdc682ced6d05ee739b831c6d5cb01982367f76fc8ce0

In multiplicative group notation, its value is 𝑔ˣ where 𝑥 is the private key held by TokenScript administration.

First, we obtain a SHA256 digest 𝑑 from the exclusive canonicalization of the TokenScript. If this TokenScript happens to be signed as well, and the `<DigestMethod>` used for its root is SHA256 (it usually is), you can find the value encoded in base64 in the `<DigestValue>` if it is signed. (Of course, you need to calculate this value if the TokenScript isn't signed.)

Then compute *h=H(𝑡|"TRUST"|𝑑)* where *H* denotes Keccak. `|` is used to denote concatenation. The text *TRUST* is simply an ASCII encoding of the literal word TRUST.

Then, we generate the secp256k1 elliptic curve point Yʰ, and hash it to get an address. This is the special address for express-of-trust of this specific TokenScript.



This address can be independently generated by TokenScript implementations, without the knowledge of 𝑥. Hence trust can be verified independently. In the meanwhile, if an implementation has the TokenScript file, it can calculate the private key of that address by 𝑥·ℎ given that (𝑔ˣ)ʰ = (gʰ)ˣ.

For revocation, the idea is the same, except the point used for the special address is now *h=H(𝑡|"REVOKE"|s)*. 

## difference between trusted and signed



### Symantec: signing express authorship, not trust



A signed TokenScript is no more trustworthy than the signer identified by CommonName. It has no cryptographically provable tie to the token itself. For example, we know by reputation that MakerDAO has the stewardship of the DAI token, so a TokenScript for DAI Token signed by MakerDAO.com is probably trustworthy.



In other words, whether or not a signed TokenScript is trustworthy is the judgement of the user.



Express-of-trust is stronger and more direct. The key holder which deployed (or manages) the DAI token contract explicitly expressed trust to that TokenScript by sending a transaction. It's time locked in a blockchain.



It's worth noticing that Express-of-trust isn't authorship - a smart contract author can express trust to a signed TokenScript authored by someone else. While signed a TokenScript implies authorship. 



### Signing isn't on the file; trust is



A signed TokenScript is signed by an XML signature which usually is (but not required to) be embedded in an XML file. The cryptographic signature is not in the file; it's in the `<SignedInfo>` element of the XML Signature. The XML signature is not in the file either, it's on a collection of references which typically contains the root node of the TokenScript.



### Signing doesn't use Keccak at all; express of trust only uses Keccak



Keccak isn't defined as a valid hashing method in XMLSIG11, so it can't be used in an XML Signature without extending the w3 recommendation behind it, which leads to trouble when validating with existing tools. Therefore we restrict the signing of TokenScript to the algorithms allowed in XMLSIG11.



For the same reason, since developers might be habitually using Keccak in blockchain applications, we use Keccak to hash the TokenScript as well as the express-of-trust.



参考资料:

https://lyhistory.com/docs/blockchain/btc/btc_dev.html#_3-5-transactions

https://lyhistory.com/docs/software/highlevel/publickey_infrastructure.html
