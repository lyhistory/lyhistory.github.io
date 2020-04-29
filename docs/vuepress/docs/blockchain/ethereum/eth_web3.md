
web3踩坑记录

什么是web3

web3j：
https://github.com/web3j/web3j

recover的方式：
recoverFromSignature
signedMessageToKey
testRecoverAddressFromSignature： https://github.com/web3j/web3j/blob/63facc546031c7ea2d9825b3100559ce459c202d/crypto/src/test/java/org/web3j/crypto/ECRecoverTest.java
https://github.com/web3j/web3j/issues/222
https://gist.github.com/megamattron/94c05789e5ff410296e74dad3b528613
https://github.com/AlphaWallet/alpha-wallet-android/blob/0ab199eca18aed4d4408d63c6a4de64e3cb55ca3/app/src/main/java/com/alphawallet/app/entity/CryptoFunctions.java
testRecoverAddressFromSignature：
https://github.com/AlphaWallet/alpha-wallet-android/blob/0ab199eca18aed4d4408d63c6a4de64e3cb55ca3/app/src/main/java/com/alphawallet/app/ui/DappBrowserFragment.java

Signatures differ in web3J and web3js
https://github.com/web3j/web3j/issues/208
https://github.com/web3j/web3j/issues/476
https://github.com/web3j/web3j/pull/424
https://github.com/gjeanmart/web3j/blob/2cce022e1bc30704ed7bac6241315f9b882f4f04/crypto/src/test/java/org/web3j/crypto/ECRecoverTest.java
这个主要是说web3js加了prefix的事情
实际上web3j的高版本，我测试的是4.1以上的版本提供了带prefix的签名方法Sign.signPrefixedMessage，但是recover没有提供自动的prefix，还是需要手动！

double hash问题：
原因：由于web3j默认的签名(Sign.signMessage)和recover(Sign.signedMessageToKey) internally hash(sha3) the input messageBytes before signing and on verification
https://ethereum.stackexchange.com/questions/17708/solidity-ecrecover-and-web3j-sign-signmessage-are-not-compatible-is-it
两种做法：
1.传入Sign.signedMessageToKey的时候不要进行sha3 hash
2.自定义recover方法signedMessageToKey，内部不要进行hash
这是网友实现的去掉hash版本
https://gist.github.com/xoriole/4c2a9630dba5a20ee28fb58edf193375

然后对于签名内部hash这个问题，web3j提供的新的signMessage方法提供了参数needhash来区分，但是recover的signedMessageToKey貌似没有提供额外参数!

尝试debugger web3js，由于文件太大，chrome卡死，放弃
```
var e = m.isHexStrict(t) ? m.hexToBytes(t) : t,
r = h.from(e),
n = "Ethereum Signed Message:\n" + e.length,
i = h.from(n),
o = h.concat([i, r]);
```

莫非这个webjs通过givenprovider比如metamask签名用了其他的信息？比如chainid，毕竟我本地测试没问题，一换成测试网就有问题，
搜索web3.eth.sign chainid metamask，并没有发现什么

想着换一个特定的provider不用given provider，比如infura，但是
文档里面这个只支持nodejs版本的！不支持前端js版本
https://infura.io/docs/ethereum/wss/introduction.md


然后想都tm升级到最新版本吧！
web3j core，maven：https://mvnrepository.com/artifact/org.web3j/core



最终解决！
发现 https://ethereum.stackexchange.com/questions/54715/metamask-verification-on-a-server-with-web3-personal-sign

web3.eth.personal.sign(dataToSign, address, password [, callback])
sign(keccak256("\x19Ethereum Signed Message:\n" + dataToSign.length + dataToSign)))
https://web3js.readthedocs.io/en/v1.2.7/web3-eth-personal.html


其他问题
metamask有时候没反应！websocket问题！
https://github.com/MetaMask/metamask-extension/issues/5425
---

refer:

SignTest
https://github.com/web3j/web3j/blob/master/crypto/src/test/java/org/web3j/crypto/SignTest.java