(window.webpackJsonp=window.webpackJsonp||[]).push([[146],{574:function(e,t,i){"use strict";i.r(t);var a=i(56),s=Object(a.a)({},(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[i("p",[i("a",{attrs:{href:"/docs/software"}},[e._v("回目录")]),e._v("  《公钥基础设施Public key infrastructure》")]),e._v(" "),i("p",[i("a",{attrs:{href:"HardDrive:/blockchain/cryptography"}},[e._v("private reference- cryptography")]),e._v(":")]),e._v(" "),i("p",[e._v("​\t\thttps://www.youtube.com/playlist?list=PLoJC20gNfC2gAB-eg7oaUTheB_JgQY4-q\n​\t\thttp://crypto-textbook.com/")]),e._v(" "),i("p",[i("strong",[e._v("PKI infrastructure:")])]),e._v(" "),i("ol",[i("li",[e._v("Ensuring the contents of the document are encrypted such that the document is kept confidential.")]),e._v(" "),i("li",[e._v("Ensuring the document is not altered during transmission.")]),e._v(" "),i("li",[e._v("Since Alice does not know Bob, he has to somehow prove that the document is indeed sent by him.")]),e._v(" "),i("li",[e._v("Ensuring Alice receives the document and that she cannot deny receiving it in future.\nPKI supports all the above four requirements with methods such as secure messaging, message digests, digital signatures, and non-repudiation services.")])]),e._v(" "),i("p",[i("strong",[e._v("Keys")])]),e._v(" "),i("ul",[i("li",[i("p",[e._v("Authentication")]),e._v(" "),i("p",[e._v("provides some degree of certainty that a given message has come from a legitimate source.\nDigital signature with private key")])]),e._v(" "),i("li",[i("p",[e._v("Integrity/Tamper detection")]),e._v(" "),i("p",[e._v("merely shows evidence that a message may have been altered.\nOver Distance: when communicate, hash function\nOver time: merkle tree\nCentralize integrity\nDecentralize integrity")])]),e._v(" "),i("li",[i("p",[e._v("Non-repudiation")]),e._v(" "),i("p",[e._v("is a concept, or a way, to ensure that the sender or receiver of a message cannot deny either sending or receiving such a message in future. One of the important audit checks for non-repudiation is a time stamp. The time stamp is an audit trail that provides information of the time the message is sent by the sender and the time the message is received by the receiver.")])])]),e._v(" "),i("p",[i("strong",[e._v("Public key cryptography")]),e._v("ss")]),e._v(" "),i("p",[e._v("Public key cryptography (negotiating exchange symmetric master secret key)\nRsa dsa ecdsa ecc\nSymmetric (Exchange message)\nDes …\nHash function (Integrity)\nMd5 hmac")]),e._v(" "),i("h2",{attrs:{id:"_1-overview"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_1-overview"}},[e._v("#")]),e._v(" 1.Overview")]),e._v(" "),i("h3",{attrs:{id:"_1-1-secure-messaging"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-secure-messaging"}},[e._v("#")]),e._v(" 1.1 Secure messaging")]),e._v(" "),i("p",[e._v("To ensure that the document is protected from eavesdropping and not altered during the transmission, Bob will first encrypt the document using Alice’s public key. This ensures two things: one, that the document is encrypted, and two, only Alice can open it as the document requires the private key of Alice to open it. To summarize, encryption is accomplished using the public key of the receiver and the receiver decrypts with his or her private key. In this method, Bob could ensure that the document is encrypted and only the intended receiver (Alice) can open it. However, Bob cannot ensure whether the contents are altered (Integrity) during transmission by document encryption alone.")]),e._v(" "),i("h3",{attrs:{id:"_1-2-message-digest"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-message-digest"}},[e._v("#")]),e._v(" 1.2 Message digest")]),e._v(" "),i("p",[e._v("In order to ensure that the document is not altered during transmission, Bob performs a hash function on the document. The hash value is a computational value based on the contents of the document. This hash value is known as the message digest. By performing the same hash function on the decrypted document the message, the digest can be obtained by Alice and she can compare it with the one sent by Bob to ensure that the contents are not altered.\nThis process will ensure the integrity requirement.")]),e._v(" "),i("h3",{attrs:{id:"_1-3-digital-signature"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-digital-signature"}},[e._v("#")]),e._v(" 1.3 Digital signature")]),e._v(" "),i("p",[e._v("https://en.wikipedia.org/wiki/Digital_signature\nIn order to prove that the document is sent by Bob to Alice, Bob needs to use a digital signature. Using a digital signature means applying the sender’s private key to the message, or document, or to the message digest. This process is known as as signing. Only by using the sender’s public key can the message be decrypted.")]),e._v(" "),i("p",[e._v("Bob will encrypt the message digest with his private key to create a digital signature. In the scenario illustrated in the image above, Bob will encrypt the document using Alice’s public key and sign it using his digital signature. This ensures that Alice can verify that the document is sent by Bob, by verifying the digital signature (Bob’s private key) using Bob’s public key. Remember a private key and the corresponding public key are linked, albeit mathematically. Alice can also verify that the document is not altered by validating the message digest, and also can open the encrypted document using her private key.\nMessage authentication is an authenticity verification procedure that facilitates the verification of the integrity of the message as well as the authenticity of the source from which the message is received.")]),e._v(" "),i("h3",{attrs:{id:"_1-4-digital-certificate"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-digital-certificate"}},[e._v("#")]),e._v(" 1.4 Digital certificate")]),e._v(" "),i("p",[e._v("By digitally signing the document, Bob has assured that the document is sent by him to Alice. However, he has not yet proved that he is Bob. To prove this, Bob needs to use a digital certificate.\nA digital certificate is an electronic identity issued to a person, system, or an organization by a competent authority after verifying the credentials of the entity. A digital certificate is a public key that is unique for each entity. A certification authority issues digital certificates.\nIn PKI, digital certificates are used for authenticity verification of an entity. An entity can be an individual, system, or an organization.\nAn organization that is involved in issuing, distributing, and revoking digital certificates is known as a Certification Authority (CA). A CA acts as a notary by verifying an entity’s identity.\nOne of the important PKI standards pertaining to digital certificates is X.509. It is a standard published by the International Telecommunication Union (ITU) that specifies the standard format for digital certificates.\nPKI also provides key exchange functionality that facilitates the secure exchange of public keys such that the authenticity of the parties can be verified.")]),e._v(" "),i("h2",{attrs:{id:"_2-methods"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_2-methods"}},[e._v("#")]),e._v(" 2.Methods")]),e._v(" "),i("h3",{attrs:{id:"_2-1-certificate-authority-or-self-signed-with-x-509"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-certificate-authority-or-self-signed-with-x-509"}},[e._v("#")]),e._v(" 2.1 Certificate authority or Self-signed with X.509")]),e._v(" "),i("p",[e._v("如果有域名建议用 CA的证书，可以用Let's Encrypt获取，或者可以使用第三方DNS解析自带的，比如cloudflare的证书；")]),e._v(" "),i("p",[e._v("如果没有域名比如本地测试环境那只能用自签名证书；")]),e._v(" "),i("p",[e._v("ca 证书链 chain of trust")]),e._v(" "),i("p",[e._v("PGP VS X.509\nhttp://world.std.com/~cme/html/web.html")]),e._v(" "),i("h3",{attrs:{id:"_2-2-wot"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-wot"}},[e._v("#")]),e._v(" 2.2 WOT")]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki01.png",alt:""}})]),e._v(" "),i("h3",{attrs:{id:"_2-3-pgp"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-pgp"}},[e._v("#")]),e._v(" 2.3 PGP")]),e._v(" "),i("p",[e._v("How PGP works ? and how to make it Pretty Great Privacy\nOpenPGP Message Format: https://tools.ietf.org/html/rfc4880")]),e._v(" "),i("p",[e._v("How PGP works https://users.ece.cmu.edu/~adrian/630-f04/PGP-intro.html\nExplanation of the web of trust of PGP https://www.rubin.ch/pgp/weboftrust.en.html")]),e._v(" "),i("p",[e._v("Both when encrypting messages and when verifying signatures, it is critical that the public key used to send messages to someone or some entity actually does 'belong' to the intended recipient. Simply downloading a public key from somewhere is not a reliable assurance of that association; deliberate (or accidental) impersonation is possible. From its first version, PGP has always included provisions for distributing user's public keys in an 'identity certification ', which is also constructed cryptographically so that any tampering (or accidental garble) is readily detectable. However, merely making a certificate which is impossible to modify without being detected is insufficient; this can prevent corruption only after the certificate has been created, not before. Users must also ensure by some means that the public key in a certificate actually does belong to the person or entity claiming it. From its first release, PGP products have included an internal certificate 'vetting scheme' to assist with this, a trust model which has been called a web of trust. A given public key (or more specifically, information binding a user name to a key) may be digitally signed by a third party user to attest to the association between someone (actually a user name) and the key. There are several levels of confidence which can be included in such signatures. Although many programs read and write this information, few (if any) include this level of certification when calculating whether to trust a key.")]),e._v(" "),i("p",[e._v("From Pretty Good To Great\nEnhancing PGP using Bitcoin and the Blockchain https://arxiv.org/abs/1508.04868\nBitcoin pgp?? https://bitcointalk.org/index.php?topic=186264.msg1929410#msg1929410\nhttps://www.quora.com/What-are-the-main-benefits-of-using-blockchain-techs-Vs-PGP")]),e._v(" "),i("h3",{attrs:{id:"_2-4-blockchain-based-pki"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-blockchain-based-pki"}},[e._v("#")]),e._v(" 2.4 Blockchain-based PKI")]),e._v(" "),i("h2",{attrs:{id:"_3-fundametal"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-fundametal"}},[e._v("#")]),e._v(" 3.Fundametal")]),e._v(" "),i("h3",{attrs:{id:"_3-1-ssl-tls"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-ssl-tls"}},[e._v("#")]),e._v(" 3.1 SSL/TLS")]),e._v(" "),i("p",[e._v("SSL is deprecated predecessor of TLS, latest version is TLS1.3\nhttps://en.wikipedia.org/wiki/Transport_Layer_Security#Protocol_details\nEncryption is through the following Algorithm and Protocol\nIdentification is guaranteed by CA")]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki02.png",alt:""}})]),e._v(" "),i("h4",{attrs:{id:"_3-1-1-implementation"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-1-implementation"}},[e._v("#")]),e._v(" 3.1.1 Implementation")]),e._v(" "),i("p",[e._v("https://en.wikipedia.org/wiki/Comparison_of_TLS_implementations")]),e._v(" "),i("ul",[i("li",[i("p",[e._v("openssl:")]),e._v(" "),i("p",[e._v("is a software library for applications that secure communications over computer networks against eavesdropping or need to identify the party at the other end. It is widely used by Internet servers, including the majority of HTTPS websites.")]),e._v(" "),i("p",[e._v("经常被用来配置https")])]),e._v(" "),i("li",[i("p",[e._v("Bouncy Castle (cryptography):")]),e._v(" "),i("p",[e._v("is a collection of APIs used in cryptography. It includes APIs for both the Java and the C# programming languages")]),e._v(" "),i("p",[e._v("参考我写的一个密码学小工具：《blockchain_cryptography.md》")])])]),e._v(" "),i("h4",{attrs:{id:"_3-1-2-certifications-x-509-cert-always-related-to-ca-party"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-2-certifications-x-509-cert-always-related-to-ca-party"}},[e._v("#")]),e._v(" 3.1.2 Certifications - X.509 cert - always related to CA party")]),e._v(" "),i("p",[e._v("a standard defining the format of public key certificates\nhttps://en.wikipedia.org/wiki/X.509")]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki03.png",alt:""}})]),e._v(" "),i("h4",{attrs:{id:"_3-1-3-algorithm-for-tls-whole-flow"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-3-algorithm-for-tls-whole-flow"}},[e._v("#")]),e._v(" 3.1.3 Algorithm for TLS whole flow")]),e._v(" "),i("p",[i("strong",[e._v("Step 1:Key exchange or key agreement algorithm")])]),e._v(" "),i("p",[e._v("​\tPurpose: to negotiate and generate master secret key\n​\thttps://www.ncbi.nlm.nih.gov/pmc/articles/PMC5551094/")]),e._v(" "),i("ul",[i("li",[i("p",[e._v("RSA")])]),e._v(" "),i("li",[i("p",[e._v("Diffie hellman Perfect Forward Secrecy https://www.youtube.com/watch?v=IkM3R-KDu44")])]),e._v(" "),i("li",[i("p",[e._v("ECC")])])]),e._v(" "),i("p",[e._v("服务端配置例子：")]),e._v(" "),i("div",{staticClass:"language- extra-class"},[i("pre",{pre:!0,attrs:{class:"language-text"}},[i("code",[e._v("-- redhat服务器配置:\nhttps://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-hardening_tls_configuration\n#openssl ciphers -v\n#openssl ciphers -v 'HIGH'\n\nCipher Suites are named combinations of:\nKey Exchange Algorithms (RSA, DH, ECDH, DHE, ECDHE, PSK)\nAuthentication/Digital Signature Algorithm (RSA, ECDSA, DSA)\nBulk Encryption Algorithms (AES, CHACHA20, Camellia, ARIA)\nMessage Authentication Code Algorithms (SHA-256, POLY1305)\nType of Encryption TLS v1.3, v1.2, v1.1, v1.0  or SSL v3, v2\nHere is an example of a TLS v1.2 cipher suite from Openssl command 'openssl ciphers -v' output:\nECDHE-RSA-AES256-GCM-SHA384 TLSv1.2 Kx=ECDH     Au=RSA  Enc=AESGCM(256) Mac=AEAD\nKey Exchange: ECDHE\nSignature: RSA\nBulk Encryption: AES256-GCM\nMessage Authentication: SHA384\n\n-- apache httpd服务端配置:\n/etc/httpd/conf.d/ssl.conf\n#   SSL Engine Switch:\n#   Enable/Disable SSL for this virtual host.\nSSLEngine on\n\n#   SSL Protocol support:\n# List the enable protocol levels with which clients will be able to\n# connect.  Disable SSLv2 access by default:\nSSLProtocol all -SSLv2 -SSLv3\n\n#   SSL Cipher Suite:\n#   List the ciphers that the client is permitted to negotiate.\n#   See the mod_ssl documentation for a complete list.\nSSLCipherSuite HIGH:3DES:!aNULL:!MD5:!SEED:!IDEA\n\n注意有些SSLCipherSuite存在风险，需要配置好\n")])])]),i("p",[i("strong",[e._v("Step 2-Part 1: Cipher to exchange message with master secret key")])]),e._v(" "),i("p",[i("strong",[e._v("Step 2-Part 2: Data integrity")])]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki04.png",alt:""}})]),e._v(" "),i("p",[e._v("解释：")]),e._v(" "),i("p",[e._v("1.秘钥交换一般都是用DH（什么情况用RSA ECC？）")]),e._v(" "),i("p",[e._v("2.第二步的通信过程一般都是采用对称加密，因为比非对称快")]),e._v(" "),i("p",[e._v("3.为什么有了第一步的DH和第二步的对称加密，很多情况还需要设置RSA，比如nginx需要设置ssl_certificate（RSA公钥和认证信息）和ssl_certificate_key（RSA私钥），因为第一步的key exchange过程，客户端也需要验证服务端的身份，所以服务端需要用私钥加密，然后客户端通过服务端的证书包含的公钥进行验证，防止通话对象是黑客而不是真正的服务器。")]),e._v(" "),i("p",[e._v("4.为什么第一步不干脆用RSA呢")]),e._v(" "),i("p",[e._v("简单讲，就是为了预防将来如果服务器私钥泄露，那么之前的对话如果没记录了，所有客户端跟服务端的对话将被解密，影响比较大，所以不应该使用私钥直接跟所有客户端对话，而应该进一步提升安全性（有点类似密码加盐的策略）")]),e._v(" "),i("blockquote",[i("p",[e._v("The downside of this handshake is that the messages secured by it are  only as safe as the private key. Suppose a third party has recorded the  handshake and the subsequent communication. If that party gets access to the private key in the future, they will be able to decrypt the  pre-main secret and derive the session key. With that they can decrypt  the entire message. This is true even if the certificate is expired or  revoked. This leads us to another form of handshake that can provide  confidentiality even if the private key is compromised.")]),e._v(" "),i("p",[e._v("https://blog.cloudflare.com/keyless-ssl-the-nitty-gritty-technical-details/")])]),e._v(" "),i("p",[e._v("5.为什么需要pre-master secret key，pre-master VS master key")]),e._v(" "),i("p",[e._v("The client generates a random number, called a "),i("strong",[e._v("Pre")]),e._v("-"),i("strong",[e._v("Master Secret key")]),e._v(". Upon receiving a Certificate message, it checks authentication of the server's certificate and extracts its public "),i("strong",[e._v("key")]),e._v(". The "),i("strong",[e._v("Pre")]),e._v("-"),i("strong",[e._v("Master Secret key")]),e._v(" is encrypted by the server's public "),i("strong",[e._v("key")]),e._v(" and sent via the ClientKeyExchange message to the server.")]),e._v(" "),i("blockquote",[i("p",[e._v("The point of the pre-master key is to have a uniform format for the  master key (e.g. this helps sharing session parameters between multiple  front-ends). SSL is generic: it supports several kinds of key exchange  algorithms, in particular RSA asymmetric encryption, and various "),i("a",{attrs:{href:"http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange",target:"_blank",rel:"noopener noreferrer"}},[e._v("Diffie-Hellman"),i("OutboundLink")],1),e._v(' variants. All these methods do not yield "shared secret" of the same  size and format. Notably, with DH, you get a group element, in whatever  group you are working, which can be an elliptic curve or something else; the shared secret is, as a binary string, somewhat biased, and is not  chosen by the client.')]),e._v(" "),i("p",[e._v("Defining that the key exchange mechanism yields a pre-master secret  (with characteristics derived from the actual key exchange mechanism),  to be hashed into a master secret, thus allows for a better modularity.")]),e._v(" "),i("p",[e._v("https://security.stackexchange.com/questions/54399/whats-the-point-of-the-pre-master-key")])]),e._v(" "),i("p",[e._v("https://crypto.stackexchange.com/questions/27131/differences-between-the-terms-pre-master-secret-master-secret-private-key")]),e._v(" "),i("p",[e._v("简单来说就是为了统一master key的格式，比如pre-master key可能是通过DH或者其他的方式交互产生的（比如服务端发给客户端8即2"),i("sup",[e._v("3")]),e._v(",客户端选一个比如4及2"),i("sup",[e._v("2")]),e._v("，然后将4发给服务端，然后客户端和服务端都各自可以算出 (2"),i("sup",[e._v("2")]),e._v(")"),i("sup",[e._v("3")]),e._v("=2"),i("sup",[e._v("6")]),e._v("=64，作为pre master key），然后至于master key何时生成：")]),e._v(" "),i("blockquote",[i("p",[e._v("3.The client generates a random number, called a Pre-Master Secret key. Upon receiving a Certificate message, it checks authentication of the  server’s certificate and extracts its public key. The Pre-Master Secret  key is encrypted by the server’s public key and sent via the  ClientKeyExchange message to the server. Meanwhile, the "),i("a",{attrs:{href:"https://www.sciencedirect.com/topics/computer-science/key-derivation-function",target:"_blank",rel:"noopener noreferrer"}},[e._v("Key Derivation Function"),i("OutboundLink")],1),e._v(" (KDF) generates a master key derived from the Pre-Secret Master key.")]),e._v(" "),i("p",[e._v("4.On the server side, the ClientKeyExchange message is decrypted by the  server’s private key, resulting in the Pre-Master Secret key. Using the  same KDF as the client, the master key is derived from the Pre-Master  Secret key.")]),e._v(" "),i("p",[e._v("https://www.sciencedirect.com/topics/computer-science/master-secret-key")])]),e._v(" "),i("p",[e._v("6.master key vs session key？")]),e._v(" "),i("p",[e._v("The client and server then use the master secret to calculate several  session keys for use in that session only – 4 session keys, to be  precise.")]),e._v(" "),i("p",[e._v("The 4 kinds of session keys created in each TLS handshake are:")]),e._v(" "),i("ul",[i("li",[e._v('The "client write key"')]),e._v(" "),i("li",[e._v('The "server write key"')]),e._v(" "),i("li",[e._v('The "client write MAC key"')]),e._v(" "),i("li",[e._v('The "server write MAC key"')])]),e._v(" "),i("p",[e._v("https://www.cloudflare.com/learning/ssl/what-is-a-session-key/")]),e._v(" "),i("p",[e._v("7.TLS handshakes occur after a TCP connection has been opened via a TCP handshake.")]),e._v(" "),i("h4",{attrs:{id:"_3-1-4-protocol-handshake"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-4-protocol-handshake"}},[e._v("#")]),e._v(" 3.1.4 Protocol - Handshake")]),e._v(" "),i("p",[e._v("Tcp handshake => TLS/SSL Handshake")]),e._v(" "),i("p",[e._v("The TLS handshake happens after the TCP handshake. For the TCP or for the transport layer, everything in the TLS handshake is just application data. Once the TCP handshake is completed the TLS layer will initiate the TLS handshake.")]),e._v(" "),i("p",[e._v("https://medium.facilelogin.com/nuts-and-bolts-of-transport-layer-security-tls-2c5af298c4be")]),e._v(" "),i("p",[e._v("A walk-through of a TCP handshake http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art058\nThe TLS Handshake at a High Level http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art057\nA walk-through of an SSL handshake http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art059\nSSL Certificate Exchange https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art061")]),e._v(" "),i("p",[e._v("https://www.youtube.com/watch?v=iQsKdtjwtYI")]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki05.png",alt:""}})]),e._v(" "),i("h3",{attrs:{id:"_3-2-manager-tools"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-manager-tools"}},[e._v("#")]),e._v(" 3.2 Manager tools")]),e._v(" "),i("p",[e._v("管理：private key public key certificate")]),e._v(" "),i("p",[e._v("比如我们可以使用openssl工具手动生成自签名的证书，也可以通过ca购买证书（也要先通过openssl工具生成csr）；")]),e._v(" "),i("p",[e._v("一个web应用如果需要提供以https的方式访问的服务的话，我们需要一个数字证书，这个证书的配置是在nginx或apache的配置文件或者其他web容器的配置文件中进行配置的。当然这个可以保存在keystore中。")]),e._v(" "),i("p",[e._v("例子：nginx https配置 参考《buildingblock/nginx.md》")]),e._v(" "),i("h4",{attrs:{id:"_3-2-1-交互工具-openssl-keytool"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-1-交互工具-openssl-keytool"}},[e._v("#")]),e._v(" 3.2.1 交互工具：Openssl keytool")]),e._v(" "),i("p",[e._v("openssl是常用的一个开源安全通信library，这里指其开源的toolkit")]),e._v(" "),i("p",[e._v("keytool是JDK里面内置的一个数字证书生产工具")]),e._v(" "),i("p",[e._v("证书类型：")]),e._v(" "),i("ul",[i("li",[i("p",[e._v(".PEM：")]),e._v(" "),i("p",[e._v("(originally “Privacy Enhanced Mail”) is the most common format for X.509 certificates, CSRs(Cerificate Signing Request), and cryptographic keys. A PEM file is a text file containing one or more items in Base64 ASCII encoding, each with plain-text headers and footers (e.g. -----BEGIN CERTIFICATE----- and -----END CERTIFICATE-----). A single PEM file could contain an end-entity certificate, a private key, or multiple certificates forming a complete chain of trust.")]),e._v(" "),i("p",[e._v("are usually seen with the extensions .crt, .pem, .cer, and .key (for private keys), but you may also see them with different extensions")])]),e._v(" "),i("li",[i("p",[e._v(".DER：")]),e._v(" "),i("p",[e._v("(Distinguished Encoding Rules) is a binary encoding for X.509 certificates and private keys. Unlike PEM, DER-encoded files do not contain plain text statements such as -----BEGIN CERTIFICATE-----. DER files are most commonly seen in Java contexts.")]),e._v(" "),i("p",[e._v("DER-encoded files are usually found with the extensions .der and .cer")])]),e._v(" "),i("li",[i("p",[e._v("PKCS")]),e._v(" "),i("ul",[i("li",[i("p",[e._v("PKCS#7 (also known as P7B)")]),e._v(" "),i("p",[e._v("is a container format for digital certificates that is most often found in Windows and Java server contexts, and usually has the extension .p7b. PKCS#7 files are not used to store private keys.")])]),e._v(" "),i("li",[i("p",[e._v("PKCS#12 (also known as PKCS12 or PFX)")]),e._v(" "),i("p",[e._v("is a common binary format for storing a certificate chain and private key in a single, encryptable file, and usually have the filename extensions .p12 or .pfx.")])])])])]),e._v(" "),i("div",{staticClass:"language- extra-class"},[i("pre",{pre:!0,attrs:{class:"language-text"}},[i("code",[e._v("#View contents of PEM certificate file\nopenssl x509 -in CERTIFICATE.pem -text -noout \n#Convert PEM certificate to DER\nopenssl x509 -outform der -in CERTIFICATE.pem -out CERTIFICATE.der\n#Convert PEM certificate with chain of trust to PKCS#7\nopenssl crl2pkcs7 -nocrl -certfile CERTIFICATE.pem -certfile MORE.pem -out CERTIFICATE.p7b\n#Convert PEM certificate with chain of trust and private key to PKCS#12\nopenssl pkcs12 -export -out CERTIFICATE.pfx -inkey PRIVATEKEY.key -in CERTIFICATE.crt -certfile MORE.crt\n\n#View contents of DER-encoded certificate file\nopenssl x509 -inform der -in CERTIFICATE.der -text -noout\n#Convert DER-encoded certificate to PEM\nopenssl x509 -inform der -in CERTIFICATE.der -out CERTIFICATE.pem\n#Convert DER-encoded certificate with chain of trust and private key to PKCS#12\nhttps://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/\n")])])]),i("h4",{attrs:{id:"_3-2-2-存储-truststore-keystore"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-2-存储-truststore-keystore"}},[e._v("#")]),e._v(" 3.2.2 存储：Truststore & Keystore")]),e._v(" "),i("p",[e._v("keystore可以看成一个放key的库，key就是公钥，私钥，数字签名等组成的一个信息。")]),e._v(" "),i("p",[e._v("truststore是放信任的证书的一个store\ntruststore和keystore的性质是一样的，都是存放key的一个仓库，区别在于，truststore里存放的是只包含公钥的数字证书，代表了可以信任的证书，而keystore是包含私钥的。")]),e._v(" "),i("ul",[i("li",[e._v("Truststore")])]),e._v(" "),i("p",[e._v("(as name suggest) is used to store certificates from trusted Certificate authorities(CA) which are used to verify certificate presented by Server in SSL Connection")]),e._v(" "),i("ul",[i("li",[e._v("Keystore")])]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki06.png",alt:""}})]),e._v(" "),i("p",[e._v("while keyStore is used to store private key and own identity certificate which program should present to other parties (Server or client) to verify its identity")]),e._v(" "),i("p",[e._v("https://en.wikipedia.org/wiki/Keystore\nImport a private key into a Java Key Store http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art049\nImport an encrypted private key into a Java KeyStore https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art050\nA Utility for Viewing Java Keystore Contents http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art045")]),e._v(" "),i("p",[e._v("KEYSTORE vs private key vs certificate")]),e._v(" "),i("p",[e._v("Difference between trustStore vs keyStore in Java SSLRead more: http://www.java67.com/2012/12/difference-between-truststore-vs.html#ixzz5UBSznugK www.java67.com/2012/12/difference-between-truststore-vs.html")]),e._v(" "),i("p",[e._v("Manage keys, certificates and keystores https://www.ibm.com/support/knowledgecenter/en/SSCQGF_7.2.0/com.ibm.IBMDI.doc_7.2/adminguide63.htm#ktrustmgmt")]),e._v(" "),i("p",[e._v("https://github.com/ethereum/go-ethereum/wiki/Mobile:-Account-management")]),e._v(" "),i("h2",{attrs:{id:"_4-use-case"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-use-case"}},[e._v("#")]),e._v(" 4. Use case")]),e._v(" "),i("p",[e._v("Encryption and decryption, digital signature, and key exchange are the three primary functions of a PKI.")]),e._v(" "),i("h3",{attrs:{id:"_4-1-authenticate-digital-signature"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-authenticate-digital-signature"}},[e._v("#")]),e._v(" 4.1 Authenticate / Digital Signature")]),e._v(" "),i("p",[e._v("https://en.wikipedia.org/wiki/Digital_signature\nschnorr signature")]),e._v(" "),i("p",[e._v("Example:\nSecurely install software with gnupg\nhttps://www.linuxbabe.com/security/verify-pgp-signature-software-downloads-linux\nhttps://medium.com/@lukedashjr/how-to-securely-install-bitcoin-9bfeca7d3b2a")]),e._v(" "),i("p",[e._v("JSON Web Token (JWT) Signing\nhttps://auth0.com/blog/json-web-token-signing-algorithms-overview/\nhttps://stackoverflow.com/questions/38588319/understanding-rsa-signing-for-jwt")]),e._v(" "),i("h3",{attrs:{id:"_4-2-ssl-tls-https"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-ssl-tls-https"}},[e._v("#")]),e._v(" 4.2 SSL/ TLS / HTTPS")]),e._v(" "),i("p",[e._v("TLS in redis https://docs.redis.com/latest/rc/security/database-security/tls-ssl/\nTLS in https => /software/network/http_ssl_tls_setup.md")]),e._v(" "),i("blockquote",[i("p",[e._v("SSL stands for Secure Sockets Layer and, in short, it's the standard technology for keeping an internet connection secure and safeguarding any sensitive data that is being sent between two systems, preventing criminals from reading and modifying any information transferred, including potential personal details.")])]),e._v(" "),i("blockquote",[i("p",[e._v("TLS (Transport Layer Security) is just an updated, more secure, version of SSL. We still refer to our security certificates as SSL because it is a more commonly used term, but when you are buying SSL from DigiCert you are actually buying the most up to date TLS certificates with the option of ECC, RSA or DSA encryption.")])]),e._v(" "),i("blockquote",[i("p",[e._v("HTTPS就是TLS over HTTP")])]),e._v(" "),i("blockquote",[i("p",[e._v("SSL和SSH是不同的protocol，原理类似，SSH is generally a tool for technicians, and SSL/TLS is a mechanism for securing websites that is transparent to the user.")])]),e._v(" "),i("p",[e._v("SSL Certificate Installation Instructions&Tutorials https://www.digicert.com/ssl-certificate-installation.htm\nHow about move from installed server to a new server? SSL Certificate Export/Import Explained https://www.digicert.com/import-export-ssl-certificate.htm")]),e._v(" "),i("p",[i("strong",[e._v("With .NET IIS")]),e._v("\nUsing Microsoft IIS to generate CSR and Private Key(export from mmc,later when complete importing certificate, it also managed by mmc) https://docs.druva.com/Knowledge_Base/inSync/How_To/Using_Microsoft_IIS_to_generate_CSR_and_Private_Key\nUse pfx file when you export the cert&privatekey to another server https://www.digicert.com/ssl-support/pfx-import-export-iis-7.htm")]),e._v(" "),i("p",[i("strong",[e._v("With Java Keytool https client and https server")]),e._v("\nUsually for web application, we generate private key stored in keystore, import to web server host, and get it signed by CA, get a cert file stored in truststore which contains public key and ca’s signature\nUse Keytool\nhttps://www.javacodegeeks.com/2013/06/java-security-tutorial-step-by-step-guide-to-create-ssl-connection-and-certificates.html\nUse Pure Java code(keytool shipped with jdk)\nGenerate keystore and truststore https://www.pixelstech.net/article/1409966488-Different-types-of-keystore-in-Java----JKS\nHttps client and https server demo https://www.pixelstech.net/article/1445603357-A-HTTPS-client-and-HTTPS-server-demo-in-Java")]),e._v(" "),i("p",[i("strong",[e._v("Self signed CA with openssl")]),e._v("\nPlay all parties:\nprvatekey-publickey pair => create csr with publickey => create ca => ca sign csr\nHow to setup your own CA with OpenSSL https://gist.github.com/Soarez/9688998\nOn windows for iis\nhttps://medium.com/the-new-control-plane/generating-self-signed-certificates-on-windows-7812a600c2d8\nhttps://medium.com/@tbusser/creating-a-browser-trusted-self-signed-ssl-certificate-2709ce43fd15\nhttps://www.sslshopper.com/article-how-to-create-a-self-signed-certificate-in-iis-7.html")]),e._v(" "),i("h3",{attrs:{id:"_4-3-ssh"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-3-ssh"}},[e._v("#")]),e._v(" 4.3 SSH")]),e._v(" "),i("p",[e._v("跟SSL的区别：\nSSL的公钥信息和身份信息（填的地区邮箱网址等）需要用x.509自签或者ca对证书进行签名（自签就是自己用自己的私钥签名，相当于我生成了一对公私钥，现在要对公钥认证，自己再拿着这个私钥签名，所以叫自签； 如果是ca签发，当然是ca机构用他们自己的私钥对请求认证的公钥进行签名），\n签名后生成证书，证书就包含了请求公证的公钥信息和身份信息以及ca的签名信息；\n而SSH生成的公私钥不需要认证，都是放在机器的某个目录下如.ssh，然后将公钥拷贝到互信的其他机器的相应.ssh目录，这样几台机器之间就可以免密登录（需要加载私钥到内存中）;当然如果是比如github，则需要拷贝到github的设置中：\n"),i("a",{attrs:{href:"https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account",target:"_blank",rel:"noopener noreferrer"}},[e._v("Adding a new SSH key to your GitHub account"),i("OutboundLink")],1)]),e._v(" "),i("div",{staticClass:"language- extra-class"},[i("pre",{pre:!0,attrs:{class:"language-text"}},[i("code",[e._v('ls -al ~/.ssh\nssh-keygen -t rsa -b 4096 -C "your_email@example.com"\n\n# start the ssh-agent in the background\n$ eval $(ssh-agent -s)\nssh-add ~/.ssh/id_rsa\n')])])]),i("blockquote",[i("p",[e._v("SSL presents public keys in the context of an X.509 certificate, which itself includes a lot of information about the principal identified by the public key as well as its own digital signature, signed by yet another keypair.\nSSH does not normally use certificates to contain public keys; instead, the identity associated with a public key is determined by its location in the file system (i.e. whose home directory it's installed in).\n"),i("a",{attrs:{href:"https://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art054",target:"_blank",rel:"noopener noreferrer"}},[e._v("SSL SSH"),i("OutboundLink")],1)])]),e._v(" "),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki07.png",alt:""}}),e._v("\nhttps://www.quora.com/What-is-the-difference-between-SSL-and-SSH-Are-they-both-just-a-way-to-safely-access-a-remote-computer-through-encryption-Do-they-also-transfer-data")]),e._v(" "),i("h3",{attrs:{id:"_4-4-authroize-authentication"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-4-authroize-authentication"}},[e._v("#")]),e._v(" 4.4 authroize&authentication")]),e._v(" "),i("p",[e._v("OAuth2.0\nJWT https://jwt.io/")]),e._v(" "),i("h3",{attrs:{id:"_4-5-blockchain-ecc"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_4-5-blockchain-ecc"}},[e._v("#")]),e._v(" 4.5 blockchain - ECC")]),e._v(" "),i("p",[e._v("https://wiki.openssl.org/index.php/Command_Line_Elliptic_Curve_Operations")]),e._v(" "),i("div",{staticClass:"language- extra-class"},[i("pre",{pre:!0,attrs:{class:"language-text"}},[i("code",[e._v("# Generate curve parameters\nopenssl ecparam -name secp521r1 -outform PEM -out secp521r1.pem\n# Generate the private key\nopenssl ecparam -inform PEM -in secp521r1.pem -genkey -outform PEM -out private-key.pem\n# Convert private key to pkcs8\nopenssl pkcs8 -topk8 -nocrypt -inform PEM -in private-key.pem -outform PEM -out private-key-pkcs8.pem\n# Generate the certificate for the private key\nopenssl req -new -x509 -key private-key-pkcs8.pem -outform PEM -out server.pem -days 365\n# Sign the document\n./xmlsectool.sh  --sign --signatureAlgorithm \n'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256' --inFile ../doc.xml --outFile ../sign.xml --key private-key-pkcs8.pem --certificate server.pem \n# Verify the signature\n./xmlsectool.sh --verifySignature --certificate server.pem -inFile ../sign.xml\n")])])]),i("p",[i("img",{attrs:{src:"/docs/docs_image/software/cryptography/pki08.png",alt:""}})]),e._v(" "),i("hr"),e._v(" "),i("p",[e._v("Genrally speaking:")]),e._v(" "),i("p",[e._v("If you have data in flight, use TLS;\nIf you have data at rest, use PGP;")]),e._v(" "),i("p",[e._v("ref:")]),e._v(" "),i("p",[e._v("How Certificates Use Digital Signatures\nhttps://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art012")]),e._v(" "),i("p",[i("a",{attrs:{href:"https://onezero.medium.com/the-untold-story-of-the-man-that-made-mainstream-encryption-possible-231c749d5005",target:"_blank",rel:"noopener noreferrer"}},[e._v("The Untold Story of the Man That Made Mainstream Encryption Possible"),i("OutboundLink")],1)]),e._v(" "),i("p",[e._v("https://en.wikipedia.org/wiki/Public_key_infrastructure\nhttps://hub.packtpub.com/public-key-infrastructure-pki-and-other-concepts-cryptography-cissp-exam/")]),e._v(" "),i("p",[e._v("From symmentic to man in the middle attack\nhttps://ssd.eff.org/en/module/deep-dive-end-end-encryption-how-do-public-key-encryption-systems-work\nhttps://en.wikipedia.org/wiki/Man-in-the-middle_attack")]),e._v(" "),i("p",[i("a",{attrs:{href:"https://stackoverflow.com/questions/21297139/how-do-you-sign-a-certificate-signing-request-with-your-certification-authority",target:"_blank",rel:"noopener noreferrer"}},[e._v("How do you sign a Certificate Signing Request with your Certification Authority?"),i("OutboundLink")],1)]),e._v(" "),i("disqus")],1)}),[],!1,null,null,null);t.default=s.exports}}]);