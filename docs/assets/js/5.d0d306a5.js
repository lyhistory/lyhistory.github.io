(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{225:function(e,t,i){e.exports=i.p+"assets/img/05_1.d714a61b.png"},226:function(e,t,i){e.exports=i.p+"assets/img/05_2.52358234.png"},227:function(e,t,i){e.exports=i.p+"assets/img/05_3.0f37a643.png"},228:function(e,t,i){e.exports=i.p+"assets/img/05_4.4c979f34.png"},229:function(e,t,i){e.exports=i.p+"assets/img/05_5.c641835a.png"},230:function(e,t,i){e.exports=i.p+"assets/img/05_6.63fcb004.png"},231:function(e,t,i){e.exports=i.p+"assets/img/05_7.1cb2aa0d.png"},263:function(e,t,i){"use strict";i.r(t);var s=i(0),a=Object(s.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("p",[e._v("随着逐渐深入，可能大家注意到我之前“漏掉”了一个关键的知识链条，就是 签名Signature 的生成，签名的目的是证明你拥有该私钥，普通软件中签名是证明你是该信息或文档的拥有者，而对于不比特币来说，签名是证明你是这笔资金的拥有者，即你有权限使用该私钥控制的资金,")]),e._v(" "),s("p",[e._v("所以我现在有必要对比特币用到的椭圆曲线函数 ecc以及相应的签名算法 ecdsa 展开讲解，同时我会讲解一个实例，就是应alphawallet CTO 张韡武学长的邀请开发的一个小工具："),s("a",{attrs:{href:"https://github.com/lyhistory/TokenScriptTool",target:"_blank",rel:"noopener noreferrer"}},[e._v("express of trust address"),s("OutboundLink")],1)]),e._v(" "),s("p",[s("img",{attrs:{src:i(225),alt:""}})]),e._v(" "),s("h2",{attrs:{id:"digital-signature"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#digital-signature"}},[e._v("#")]),e._v(" Digital Signature")]),e._v(" "),s("p",[e._v("数字签名,又称公钥数字签名,是一种用于验证数字消息或文档的真实性的数学方案,具体来说是对消息或者文档的digest摘要进行签名计算生成的数字，有效的数字签名具有以下属性 ：")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("完整性 integrity")]),e._v(" "),s("p",[e._v("保证该消息在传输过程中没有发生更改，简单的说就是如果消息被更改，则签名失效；")]),e._v(" "),s("p",[e._v("对于比较长的消息或大的文档来说，通常需要对其先进行压缩 通常是进行"),s("strong",[e._v("哈希方法 Hash Function")]),e._v("获取哈希值作为可以代表该消息或文档的指纹 fingerprint  ，然后对哈希值进行签名，这里选用的哈希函数需要具备以下属性：")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("抗原像性 Preimage resistance：对于给定的输出z，不可能找到任何输入x使得h（x）= z，即h（x）是单向的计算。")])]),e._v(" "),s("li",[s("p",[e._v("抗第二原像性 Second preimage resistance：给定x1，因此给定h（x1），通过计算找到任何x2使得h（x1）= h（x2）是不可行的。")])]),e._v(" "),s("li",[s("p",[e._v("耐碰撞性：通过计算找到任何一对值 x1≠x2使得h（x1）= h（x2）是不可行的")])])]),e._v(" "),s("p",[e._v("除此之外，特别对于签名的有效性来说，还需要具备另外一个属性：找不到有效可行的方法来修改信息或哈希摘要以及签名，并且让修改后的新签名变成新消息的有效签名")])]),e._v(" "),s("li",[s("p",[e._v("真实性 authenticity")]),e._v(" "),s("p",[e._v("某个签名必须只能是对应的私钥持有者签的名，所以通过签名可以认定其身份，使接收者非常有理由相信该消息是由已知的发件人创建的；")]),e._v(" "),s("p",[e._v("反例：对称加密算法就不适用于签名，因为大家持有的是一样的密钥")])]),e._v(" "),s("li",[s("p",[e._v("不可否认性 Non-repudiation")]),e._v(" "),s("p",[e._v("已对某些信息进行签名的有关方不能否认自己做过这个签名，当然其他人也不能仅通过访问公钥来伪造有效签名；")])])]),e._v(" "),s("p",[s("img",{attrs:{src:i(226),alt:""}})]),e._v(" "),s("p",[e._v("虽然不能篡改签名，但很多digital signature 算法都不能免疫于 forgery/replay attack 伪造攻击，因为当Alice做了足够的多的签名，黑客Craig可以从从选择某个签名和信息对，作为中间人replay发给Bob，所以签名只是一方面，整个程序的安全性还需要建立在整体的设计上，比如比特币就不会受到forgery attack的影响，如果受影响就相当于出现double spend，而这个正是比特币的设计所避免的。")]),e._v(" "),s("h3",{attrs:{id:"note-关于哈希-hash-function和mac-message-authentication-codes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#note-关于哈希-hash-function和mac-message-authentication-codes"}},[e._v("#")]),e._v(" Note: 关于哈希 Hash Function和MAC-message authentication codes")]),e._v(" "),s("p",[e._v("哈希方法 Hash Function是不带key的/keyless，常用于最重要的两个应用：\n数字签名 和 MAC-message authentication codes，")]),e._v(" "),s("p",[e._v("digital signature VS Hmac")]),e._v(" "),s("table",[s("thead",[s("tr",[s("th",[e._v("-")]),e._v(" "),s("th",[e._v("Hash")]),e._v(" "),s("th",[e._v("MAC(keyed hash function)")]),e._v(" "),s("th",[e._v("Digital signature")])])]),e._v(" "),s("tbody",[s("tr",[s("td",[e._v("Integrity")]),e._v(" "),s("td",[e._v("Yes")]),e._v(" "),s("td",[e._v("Yes")]),e._v(" "),s("td",[e._v("Yes")])]),e._v(" "),s("tr",[s("td",[e._v("Authentication")]),e._v(" "),s("td",[e._v("No")]),e._v(" "),s("td",[e._v("Yes")]),e._v(" "),s("td",[e._v("Yes")])]),e._v(" "),s("tr",[s("td",[e._v("Non-repudiation")]),e._v(" "),s("td",[e._v("No")]),e._v(" "),s("td",[e._v("No")]),e._v(" "),s("td",[e._v("Yes")])]),e._v(" "),s("tr",[s("td",[e._v("Kind of keys")]),e._v(" "),s("td",[e._v("None")]),e._v(" "),s("td",[e._v("Symmetric")]),e._v(" "),s("td",[e._v("Asymmetric")])])])]),e._v(" "),s("p",[e._v("The three security requirements for hash functions are one-wayness, second\npreimage resistance and collision resistance.\nHash functions should have at least 160-bit output length in order to withstand\ncollision attacks; 256 bit or more is desirable for long-term security.\nMD5, which was widely used, is insecure. Serious security weaknesses have\nbeen found in SHA-1, and the hash function should be phased out. The SHA-\n2 algorithms all appear to be secure.\nThe ongoing SHA-3 competition will result in new standardized hash functions\nin a few years.\n哈希方法length extension attack 长度延展攻击\n像md5 sha1等基于 Merkle–Damgård construction 的哈希算法并不安全，\n由此构造的MAC=》BadMAC(secret,message)= H(secret ‖ message)  is the concatenation of the Key and the Message.容易受到 length extension attack 长度延展攻击：\nhttps://en.wikipedia.org/wiki/Length_extension_attack\nhttps://www.bilibili.com/video/BV1uy4y1h7Qr/\nhttps://crypto.stackexchange.com/questions/3978/understanding-the-length-extension-attack")]),e._v(" "),s("p",[e._v("安全的MAC实现：HMAC")]),e._v(" "),s("h2",{attrs:{id:"rsa-signature"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#rsa-signature"}},[e._v("#")]),e._v(" RSA Signature")]),e._v(" "),s("p",[e._v("公钥加密，私钥解密反过来就是RSA的签名算法即：")]),e._v(" "),s("p",[e._v("私钥加密，公钥验证")]),e._v(" "),s("p",[e._v("P.S. 有意思的是RSA后两个字母刚好跟 Signatrue Algorithm缩写一样，但实际上是 Rivest–Shamir–Adleman 三位大佬姓氏的缩写")]),e._v(" "),s("p",[e._v("RSA安全性是基于大素数分解问题 Large Prime factorization\n"),s("img",{attrs:{src:i(227),alt:""}})]),e._v(" "),s("h2",{attrs:{id:"elgamal-digital-signature"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#elgamal-digital-signature"}},[e._v("#")]),e._v(" Elgamal Digital Signature")]),e._v(" "),s("p",[e._v("Elgamal signature")]),e._v(" "),s("p",[e._v("其安全性是基于离散对数问题 discrete logarithms\n"),s("img",{attrs:{src:i(228),alt:""}})]),e._v(" "),s("h2",{attrs:{id:"dsa-digital-service-standards"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dsa-digital-service-standards"}},[e._v("#")]),e._v(" DSA - Digital Service Standards")]),e._v(" "),s("p",[e._v("正如其名字本身数字签名算法，这是由美国国家标准学会提议与技术National Institute of Standards and Technology （NIST）基于Elgamal signature scheme 提出的美国联邦政府数字标准签名Digital Service Standards (DSS)")]),e._v(" "),s("p",[e._v("签名只有320位，但是签名验证比RSA慢，因为是基于Elgamal signature scheme 所以其安全性也是基于离散对数问题 discrete logarithms\n"),s("img",{attrs:{src:i(229),alt:""}})]),e._v(" "),s("h2",{attrs:{id:"ecdsa-elliptic-curve-digital-signature-algorithm"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ecdsa-elliptic-curve-digital-signature-algorithm"}},[e._v("#")]),e._v(" ECDSA - Elliptic Curve Digital Signature Algorithm")]),e._v(" "),s("p",[e._v("ECDSA secp256k1")]),e._v(" "),s("p",[e._v("keccak")]),e._v(" "),s("p",[e._v("secp256k1's elliptic curve y"),s("sup",[e._v("2")]),e._v(" = x"),s("sup",[e._v("3")]),e._v(" + ax+b (a=0,b=7) over the real numbers:\nthe graph is")]),e._v(" "),s("p",[e._v("secp256k1 is actually defined over the field:\ny"),s("sup",[e._v("2")]),e._v(" = x"),s("sup",[e._v("3")]),e._v("+ax+b over Fp\ngraph will in reality look like random scattered points...")]),e._v(" "),s("p",[e._v("ECC位长度在160–256位的范围内, 其安全性与1024–3072位的RSA和DL相同，更短的位长，处理时间越短，并且签名也短，由于这些原因，1998年椭圆曲线数字签名算法（ECDSA）被ANSI 美国国家标准研究所进行了标准化。")]),e._v(" "),s("p",[e._v("ECDSA的构建步骤跟DSA很接近，但是其离散对数问题是构造在基于素数域Zp或者是伽罗华域 Galois fields GF(2^m) 的椭圆曲线上，所以在实际计算过程上完全跟DSA不同。")]),e._v(" "),s("p",[e._v("https://hackernoon.com/hacking-a-bitcoin-wallet-642u36sa")]),e._v(" "),s("p",[e._v("https://github.com/bitcoinbook/bitcoinbook/blob/db678d15c08e7be4180ba9e9fbc60ee004eb5c3c/ch06.asciidoc")]),e._v(" "),s("p",[e._v("Sig = Fsig(Fhash(m),dA)")]),e._v(" "),s("p",[e._v("dA is the signing private key")]),e._v(" "),s("p",[e._v("m is the transaction")]),e._v(" "),s("p",[e._v("Fhash is the hashing function")]),e._v(" "),s("p",[e._v("Fsig is the signing algorithm")]),e._v(" "),s("p",[e._v("Sig is the resulting signature")]),e._v(" "),s("p",[e._v("The signing function (Fsig) produces a signature (Sig) that comprises of two values: R and S:")]),e._v(" "),s("p",[e._v("Sig = (R, S)")]),e._v(" "),s("p",[e._v("Once R and S have been calculated, they are serialized into a byte stream that is encoded using an international standard encoding scheme that is known as the Distinguished Encoding Rules (or DER). In order to verify that the signature is valid, a signature verification algorithm is used. Verification of a digital signature requires the following:")]),e._v(" "),s("p",[e._v("Signature (R and S)")]),e._v(" "),s("p",[e._v("Transaction hash")]),e._v(" "),s("p",[e._v("The public key that corresponds to the private key that was used to create the signature")]),e._v(" "),s("p",[e._v("Verification of a signature effectively means that only the owner of the private key (that generated the public key) could have produced the signature on the transaction. The signature verification algorithm will return ‘TRUE’ if the signature is indeed valid.")]),e._v(" "),s("p",[e._v("Sig = (R, S, SIGHASH) R and S are serialized into a byte-stream using an international standard encoding scheme called the Distinguished Encoding Rules, or DER. Signature Hash Types (SIGHASH): - ALL - NONE - SINGLE - ANYONECANPAY\n"),s("img",{attrs:{src:i(230),alt:""}}),e._v("\nECDSA Math AND The Importance of Randomness in Signatures If the same value k is used in the signing algorithm on two different transactions, the private key can be calculated and exposed to the world! To avoid this vulnerability, the industry best practice is to not generate k with a random-number generator seeded with entropy, but instead to use a deterministic-random process seeded with the transaction data itself. This ensures that each transaction produces a different k. The industry-standard algorithm for deterministic initialization of k is defined in RFC 6979, published by the Internet Engineering Task Force")]),e._v(" "),s("h2",{attrs:{id:"express-of-trust-address"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#express-of-trust-address"}},[e._v("#")]),e._v(" Express of Trust address")]),e._v(" "),s("p",[e._v("理论:")]),e._v(" "),s("p",[e._v("https://mail.google.com/mail/u/0/#search/TokenScriptTool/FMfcgxwCgzFSrzCzLpxqwZrtPznWswpj")]),e._v(" "),s("p",[e._v("https://github.com/TokenScript/TokenScript/blob/main/doc/authenticity+trustworthiness.md")]),e._v(" "),s("p",[e._v("工具：https://github.com/lyhistory/TokenScriptTool")]),e._v(" "),s("p",[e._v("https://community.tokenscript.org/t/demo-tool-for-express-of-trust/235")]),e._v(" "),s("p",[e._v("https://github.com/lyhistory/TokenScriptTool/releases/tag/0.0.1")]),e._v(" "),s("p",[e._v("https://github.com/TokenScript/TokenScript/pull/193")]),e._v(" "),s("p",[e._v("Produce a command line tool which\nTaking a TokenScript file for input, and provide the proof-of-trust")]),e._v(" "),s("pre",[s("code",[e._v("address and the proof-of-revoke address for that TokenScript.\n")])]),e._v(" "),s("p",[e._v("First, how do you get the digest of a TokenScript?")]),e._v(" "),s("pre",[s("code",[e._v(" Here is a short instruction:\n\n\n\n - Assume you already have xmlsectool installed.\n\n - Clone the TokenScript project https://github.com/AlphaWallet/TokenScript\n\n - Enter directory examples/nft\n\n - Observe the unsigned TokenScript EntryToken.xml\n\n - Sign it. (try to run Make and follow the instructions)\n\n - Observe the signed TokenScript EntryToken.tsml and notice the value in\n\n <DigestValue>\n")])]),e._v(" "),s("p",[e._v("Now, notice that the DigestValue is obtained with xmlsectool, you should")]),e._v(" "),s("pre",[s("code",[e._v(" be able to study the source code of xmlsectool and manage to get a\n\n DigestValue for any TokenScript file.\n\n\n\n If you have a problem getting the DigestValue, Sangalli knows the answer.\n")])]),e._v(" "),s("p",[e._v("Second, how do you get the proof-of-trust address and proof-of-revoke")]),e._v(" "),s("p",[e._v("address?")]),e._v(" "),s("pre",[s("code",[e._v(" security.md document is exactly what you need.\n\n\n\n If you have a problem understanding that, Tore knows the answer.\n")])]),e._v(" "),s("p",[e._v("I believe you will need to ask some questions to Sangalli regarding")]),e._v(" "),s("p",[e._v("getting the DigestValue or ask Tore regarding getting proof-of-trust")]),e._v(" "),s("p",[e._v("address. Please register an account on tokenscript.org and ask")]),e._v(" "),s("p",[e._v("there. It's better than asking by email since others might seek this")]),e._v(" "),s("p",[e._v("knoweldge. Sangalli will make sure someone attends your")]),e._v(" "),s("p",[e._v("questions. e.g. he will whisle Tore if the issue about him goes")]),e._v(" "),s("p",[e._v("un-answered.")]),e._v(" "),s("p",[e._v("You can also join us for a design meeting next Thursday's weekly")]),e._v(" "),s("p",[e._v("meeting at 7 pm Sydney time in which Tore will show up.")]),e._v(" "),s("p",[e._v("hi,")]),e._v(" "),s("p",[e._v("sorry a little bit busy yesterday, today I just got time go through the info you mentioned, and still got some questions need your clarification.")]),e._v(" "),s("p",[e._v("below is the step I finalized from my current understanding,\n"),s("img",{attrs:{src:i(231),alt:""}}),e._v("\nso the purpose of the tool is to generate proof of trust address:")]),e._v(" "),s("p",[e._v("question 1: where to use digest value of Tokenscript, is it to get the s = keccak(digest value of the tokenscript file)")]),e._v(" "),s("p",[e._v("question 2: my cryptographic basis knowledge is not strong enough, it took me some time to recall the basic, is here Y=gˣ using RSA, at first I thought it's ecc, but ecc is scala multiplicative, something like Y=nG, but if it's RSA, we can't get eth address from RSA key, I'm confused refer to statements in Security.md \" Assume that TokenScript project's donation address' public key is known, which is Y. In multiplicative group notation, its value is gˣ where 𝑥 is the private key held by TokenScript administration. \"")]),e._v(" "),s("p",[e._v("I understand that you might be concerned that there are math")]),e._v(" "),s("p",[e._v("expressions in your question so you weren't sure if they would be")]),e._v(" "),s("p",[e._v("displayed correctly if you post to TokenScript.org")]),e._v(" "),s("p",[e._v("Here is the key math expression I typed for you, which you can copy")]),e._v(" "),s("p",[e._v("and paste to the forum.")]),e._v(" "),s("p",[e._v("Y' = Yʰ = (𝑔ˣ)ʰ = 𝑔ˣʰ = RSA.generate(Y, 𝑒=ℎ)\nWhen you post, be specific about the problem (to get the")]),e._v(" "),s("p",[e._v("express-of-trust address by following the guide on the document):")]),e._v(" "),s("p",[e._v("https://github.com/AlphaWallet/TokenScript/blob/master/doc/security.md")]),e._v(" "),s("p",[e._v("Regards")]),e._v(" "),s("p",[e._v("(I would share my math keyboard layout with you but they are for Linux)")]),e._v(" "),s("h2",{attrs:{id:"authenticity-and-trustworthiness-of-a-tokenscript"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#authenticity-and-trustworthiness-of-a-tokenscript"}},[e._v("#")]),e._v(" Authenticity and trustworthiness of a TokenScript")]),e._v(" "),s("p",[e._v("(This document is not about the runtime security of Token Enclave - which will be documented separately. This deals with the authenticity and trustworthiness of a TokenScript on a textual level.)")]),e._v(" "),s("p",[e._v("A TokenScript file can be signed. A TokenScript can also be trusted. Ideally, both should be done.")]),e._v(" "),s("p",[e._v('At the moment, TokenScript is trusted through an "Express-of-Trust" transaction from the smart contract deployment key. In the future, a smart contract might be able to return the signing key needed for TokenScript. Both should work towards asserting the relationship between a Smart Contract and a TokenScript, hence establishing trust.')]),e._v(" "),s("p",[e._v("However, trust coming from smart contract alone isn't sufficient to the end user, since the user has otherwise no way to assert if the smart contract is the one he intends to interact with, or a phishing contract. But when that trust is not available, having the TokenScript signed helps the end-user to ascribe trust by authenticity.")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("If a TokenScript is trusted, through an Express-of-Trust transaction, then the Smart Contract owner has either created or read the TokenScript and recommended the end-users to use it.")])]),e._v(" "),s("li",[s("p",[e._v("If a TokenScript is signed, the end-user can ascribe authenticity (the author and integrity), and if that author is known to the end-user, he is likely to trust it without the Express-of-Trust; otherwise, he makes his own decision.")])])]),e._v(" "),s("p",[e._v("Or in other words:")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("signing a TokenScript establish authenticity of the TokenScript but not how much the token contract trusts it;")])]),e._v(" "),s("li",[s("p",[e._v("the express-of-trust transaction expresses that the token contract author trusts the TokenScript, but nothing about authenticity (who wrote it).")])])]),e._v(" "),s("p",[e._v("Or in layman's terms:")]),e._v(" "),s("ul",[s("li",[s("p",[e._v('Signing a TokenScript "connects" it to identity (e.g. a website, an organisation), with no guarantee if that identity is of a trustworthy entity.')])]),e._v(" "),s("li",[s("p",[e._v("Express-of-trust claims the  TokenScript trustworthy, without connecting it to any identity.")])])]),e._v(" "),s("p",[e._v("Both have their uses. If you are a token contract author, you can do express-of-trust to a TokenScript; however, there are cases that signed TokenScripts are needed:")]),e._v(" "),s("p",[e._v("Case 1:")]),e._v(" "),s("p",[e._v("A token issuer (custodian) want to reassure a user who trusts it by an external (non-blockchain) identity (e.g. website domain name) that he/she is using the correct contract. For example, a token issuer changed its main contract after discovering some security exploitation. It knows that its user trust it by domain name, so it might issue a token script that is signed by the same domain name with expressed trust from both the old and new contract to help the user to migrate.")]),e._v(" "),s("p",[e._v("Case 2:")]),e._v(" "),s("p",[e._v("A token issuer discarded his deployment key (or lost it), but still wish to let its user trust the TokenScript they provided by the help of providing authenticity (revealing the authorship).")]),e._v(" "),s("p",[e._v("Case 3:")]),e._v(" "),s("p",[e._v("A token issuer did not write a TokenScript, but a 3rd party did it; or that the 3rd party has provided additional features. If the 3rd party gained trust (e.g. through social media or within a community), it can sign and release its own TokenScript, and the users can accept them by the reputation of the 3rd part without the token contract's Express-of-Trust.")]),e._v(" "),s("p",[e._v('(The cases of "mixed configuration", like when a 3rd party writes a TokenScript providing action in addition to the one written by the token issuer, is not covered in this introductory document. Instead, they are covered in the future modularisation documents.)')]),e._v(" "),s("h2",{attrs:{id:"signed"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#signed"}},[e._v("#")]),e._v(" Signed")]),e._v(" "),s("p",[e._v("A signed TokenScript file is a TokenScript file signed through the use of an XML Signature. Any signature signing algorithm supported by XML Signature (including ECDSA supported through XML Signature 1.1) is accepted.")]),e._v(" "),s("p",[e._v("At this moment, user agents should only accept such XML Signatures if certified by a certificate authority (CA). For convenience, a website certificate will do at this moment. In the years to come, implementations might require certificates from issuers who can validate an organisation or various forms of decentralised certificate issuers.")]),e._v(" "),s("p",[e._v("When a signed TokenScript is used, the user agent displays the domain name or organisation name of the certificate. It's up to the user if they allow the use of such a TokenScript. We expect users to assert judgement based on whether or not they recognise the CommonName of the certificate.")]),e._v(" "),s("p",[e._v("Revocation follows the same principles as these certificates normally do.")]),e._v(" "),s("h3",{attrs:{id:"signing-of-external-data"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#signing-of-external-data"}},[e._v("#")]),e._v(" Signing of external data")]),e._v(" "),s("p",[e._v("Any data reference - icons, images and language packs - used by the TokenScript must be referred to in the "),s("code",[e._v("<SignedInfo>")]),e._v(" section of the XML signature using "),s("code",[e._v("<Reference>")]),e._v(" element, or they will be considered not available (TokenScript implementations decide how to treat unavailable data). Each reference is downloaded and its digest verified as part of the TokenScript signature verification process. If any of the references fail to download or the digest doesn't match, the entire XML signature is bad.")]),e._v(" "),s("h2",{attrs:{id:"trusted-ethereum"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#trusted-ethereum"}},[e._v("#")]),e._v(" Trusted (Ethereum)")]),e._v(" "),s("p",[e._v("A trusted TokenScript file is one explicitly trusted by the author of a token contract on Ethereum. Such trust is expressed by an Ethereum transaction. Only one signing algorithm, ECDSA (secp256k1), is used in express-of-trust because trust is expressed by an Ethereum transaction.")]),e._v(" "),s("p",[e._v("Such trust is also revoked by a transaction.")]),e._v(" "),s("p",[e._v("The transaction consists of a simple To address, with no data attached.")]),e._v(" "),s("h3",{attrs:{id:"the-from-address"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#the-from-address"}},[e._v("#")]),e._v(' The "from" address')]),e._v(" "),s("p",[e._v("If the smart contract has no key-management on its own, the transaction should be sent from the smart contracts deployment key. If the smart contract has a key management function, the transaction should be sent from the current administrative key.")]),e._v(" "),s("h3",{attrs:{id:"the-to-address"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#the-to-address"}},[e._v("#")]),e._v(' The "to" address')]),e._v(" "),s("ul",[s("li",[s("p",[e._v("to express trust, send any amount (e.g. 0Ξ) to a special address that represents the trust from the token contract (𝑡) to the TokenScript.")])]),e._v(" "),s("li",[s("p",[e._v("to express revocation, send any amount (e.g. 0Ξ) to another special address that represents the revocation of such trust.")])])]),e._v(" "),s("p",[e._v("The express-of-trust special address is calculated in this way:")]),e._v(" "),s("p",[e._v("TokenScript project's donation address is: "),s("code",[e._v("0x000bd52fb4f46f148b0ff0cc651048e283d2d000")]),e._v(". Its public key is "),s("em",[e._v("Y")]),e._v(", its value is:")]),e._v(" "),s("p",[e._v("0x483d69cc4377d318da81402f2488f588ccae3d22a37be36457a574487d9ca4d9c38cd62d83113e440c7bdc682ced6d05ee739b831c6d5cb01982367f76fc8ce0")]),e._v(" "),s("p",[e._v("In multiplicative group notation, its value is 𝑔ˣ where 𝑥 is the private key held by TokenScript administration.")]),e._v(" "),s("p",[e._v("First, we obtain a SHA256 digest 𝑑 from the exclusive canonicalization of the TokenScript. If this TokenScript happens to be signed as well, and the "),s("code",[e._v("<DigestMethod>")]),e._v(" used for its root is SHA256 (it usually is), you can find the value encoded in base64 in the "),s("code",[e._v("<DigestValue>")]),e._v(" if it is signed. (Of course, you need to calculate this value if the TokenScript isn't signed.)")]),e._v(" "),s("p",[e._v("Then compute "),s("em",[e._v('h=H(𝑡|"TRUST"|𝑑)')]),e._v(" where "),s("em",[e._v("H")]),e._v(" denotes Keccak. "),s("code",[e._v("|")]),e._v(" is used to denote concatenation. The text "),s("em",[e._v("TRUST")]),e._v(" is simply an ASCII encoding of the literal word TRUST.")]),e._v(" "),s("p",[e._v("Then, we generate the secp256k1 elliptic curve point Yʰ, and hash it to get an address. This is the special address for express-of-trust of this specific TokenScript.")]),e._v(" "),s("p",[e._v("This address can be independently generated by TokenScript implementations, without the knowledge of 𝑥. Hence trust can be verified independently. In the meanwhile, if an implementation has the TokenScript file, it can calculate the private key of that address by 𝑥·ℎ given that (𝑔ˣ)ʰ = (gʰ)ˣ.")]),e._v(" "),s("p",[e._v("For revocation, the idea is the same, except the point used for the special address is now "),s("em",[e._v('h=H(𝑡|"REVOKE"|s)')]),e._v(".")]),e._v(" "),s("h2",{attrs:{id:"difference-between-trusted-and-signed"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#difference-between-trusted-and-signed"}},[e._v("#")]),e._v(" difference between trusted and signed")]),e._v(" "),s("h3",{attrs:{id:"symantec-signing-express-authorship-not-trust"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#symantec-signing-express-authorship-not-trust"}},[e._v("#")]),e._v(" Symantec: signing express authorship, not trust")]),e._v(" "),s("p",[e._v("A signed TokenScript is no more trustworthy than the signer identified by CommonName. It has no cryptographically provable tie to the token itself. For example, we know by reputation that MakerDAO has the stewardship of the DAI token, so a TokenScript for DAI Token signed by MakerDAO.com is probably trustworthy.")]),e._v(" "),s("p",[e._v("In other words, whether or not a signed TokenScript is trustworthy is the judgement of the user.")]),e._v(" "),s("p",[e._v("Express-of-trust is stronger and more direct. The key holder which deployed (or manages) the DAI token contract explicitly expressed trust to that TokenScript by sending a transaction. It's time locked in a blockchain.")]),e._v(" "),s("p",[e._v("It's worth noticing that Express-of-trust isn't authorship - a smart contract author can express trust to a signed TokenScript authored by someone else. While signed a TokenScript implies authorship.")]),e._v(" "),s("h3",{attrs:{id:"signing-isn-t-on-the-file-trust-is"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#signing-isn-t-on-the-file-trust-is"}},[e._v("#")]),e._v(" Signing isn't on the file; trust is")]),e._v(" "),s("p",[e._v("A signed TokenScript is signed by an XML signature which usually is (but not required to) be embedded in an XML file. The cryptographic signature is not in the file; it's in the "),s("code",[e._v("<SignedInfo>")]),e._v(" element of the XML Signature. The XML signature is not in the file either, it's on a collection of references which typically contains the root node of the TokenScript.")]),e._v(" "),s("h3",{attrs:{id:"signing-doesn-t-use-keccak-at-all-express-of-trust-only-uses-keccak"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#signing-doesn-t-use-keccak-at-all-express-of-trust-only-uses-keccak"}},[e._v("#")]),e._v(" Signing doesn't use Keccak at all; express of trust only uses Keccak")]),e._v(" "),s("p",[e._v("Keccak isn't defined as a valid hashing method in XMLSIG11, so it can't be used in an XML Signature without extending the w3 recommendation behind it, which leads to trouble when validating with existing tools. Therefore we restrict the signing of TokenScript to the algorithms allowed in XMLSIG11.")]),e._v(" "),s("p",[e._v("For the same reason, since developers might be habitually using Keccak in blockchain applications, we use Keccak to hash the TokenScript as well as the express-of-trust.")]),e._v(" "),s("p",[e._v("参考资料:")]),e._v(" "),s("p",[e._v("https://lyhistory.com/docs/blockchain/btc/btc_dev.html#_3-5-transactions")]),e._v(" "),s("p",[e._v("https://lyhistory.com/docs/software/highlevel/publickey_infrastructure.html")])])}),[],!1,null,null,null);t.default=a.exports}}]);