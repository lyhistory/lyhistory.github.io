
## 1. Overview

### 1.1 基本概念

Ether vs token
Ether is registered in the Ethereum ledger and a Token in the ledger of a smart contract
https://ethereum.stackexchange.com/questions/26284/how-ethereum-token-transfer-works

World State

ethereum address: hash 160,  e.g. 0x599003E5817251833f5414ff9A40dCE6394A3125
One hexadecimal digit represents a nibble (4 bits), which is half of an octet or byte (8 bits).,  40*4=160bit

Smart contract解释
https://www.coindesk.com/information/how-ethereum-works/
https://www.coindesk.com/information/ethereum-smart-contracts-work/

黄皮书http://gavwood.com/paper.pdf
白皮书https://github.com/ethereum/wiki/wiki/White-Paper

Hackathon https://ethglobal.online/

Ok, so dragging out my aged printout of Gavin Wood's Yellow Paper updated here, to correct myself, the State trie is also an immutable data structure (a Patricia Merkle Trie), so a `change` to a contracts variable doesn't actually overwrite the older value but creates another branch (like Git). The rehashing of that state yields a new state root which is stored on the blockchain for that account.
A further correction, the bytecode of a contract is also stored in the state trie, and it is this copy that is executed rather than the bytecode data in the on chain transaction that created it.
The State trie database itself is a simple key/value mapping but given that it's data is immutable and prone to exponential bloat with age, what's called 'State Trie Pruning' was also implemented in order to keep only the most recent changes.
https://forum.ethereum.org/discussion/11444/Patricia%20Trees
https://forum.ethereum.org/discussion/11444/what-is-stored-in-the-blockchain-from-a-smart-contract
https://ethereum.stackexchange.com/questions/18885/where-are-the-variables-of-a-smart-contract-stored
https://github.com/ethereum/go-ethereum/issues/14713

### 1.2 ENS

ENS 域名终极指南 https://medium.com/@eric.conner/the-ultimate-guide-to-ens-names-aa541586067a

## 2. 开发基础-连接节点 RPC to Eth node

Web3 provides a facade and interface for interacting easily with the Ethereum blockchain and Ethereum server nodes. In other words, Web3 facilitates intercommunication between clients and the Ethereum Blockchain by way of JSON-RPC.

Web3j is the java port of web3 and web3js is the js port of web3.


### 2.1 Develop with Web3JS

**Truffle**

Unbox: https://www.trufflesuite.com/boxes/webpacknpx truffle unbox webpack

Npm uninstall -g truffle
Npm install -g truffle

?#issues: Source file requires different compiler version (current compiler is 0.4.24+commit.e67f0147.Emscripten.clang - note that nightly builds are considered to be strictly less than the released version
Manual change sol to pragma solidity ^0.4.24;

### 2.2 Develop with web3j
<span sytle="color:red">Refer to Personal Nodes: \BlockChain\ethereum\<<EthDevSetup.docx>></span>

**solc**

windows A problem occurred starting process 'command 'solc''
npm install -g solc

**web3j**

https://github.com/web3j/web3j/

在项目中使用maven/gradle 

还有测试工具install web3j，
web3j wallet create

**Ganache issue with web3j**

ganache networkid nothing to do with web3j chainid
Not the same thing after testing,debuging into web3j lib, it will always go to chainid==-1

txHashMismatch using Ganache
https://github.com/ethers-io/ethers.js/issues/275

### 2.3 Develop with python

Install web3py for python
https://web3py.readthedocs.io/en/stable/quickstart.html
https://web3py.readthedocs.io/en/stable/troubleshooting.html#setup-environment
```
# Install pip if it is not available:
$ which pip || curl https://bootstrap.pypa.io/get-pip.py | python

# Install virtualenv if it is not available:
$ which virtualenv || pip install --upgrade virtualenv

# *If* the above command displays an error, you can try installing as root:
$ sudo pip install virtualenv

# Create a virtual environment:
$ virtualenv -p python3 ~/.venv-py3

# Activate your new virtual environment:
$ source ~/.venv-py3/bin/activate
deactivate
# With virtualenv active, make sure you have the latest packaging tools
$ pip install --upgrade pip setuptools

# Now we can install web3.py...
$ pip install --upgrade web3

```

https://stackoverflow.com/questions/49934012/pip-install-web3-ubuntu
web3==3.2.0
pip install -r requirements.txt
https://github.com/ethereum/web3.py/blob/master/docs/README-linux.md#Developer-Setup

assertion error caused by rlp version upgrade https://github.com/ethereum/pyethereum/issues/440


### 2.3 Develop with Golang
https://goethereumbook.org/ethereum-development-with-go.pdf
https://goethereumbook.org/client-setup/

If you choose to build a dApp in Go, then you'll be using the go-ethereum libraries directly which means you can do everything the node can do. This is inherently the "web3.js" version for Go.
Interacting with the blockchain in simple terms means that you'll be making RPC calls over HTTP. Any language will be ok but compiled languages such as Golang will get you the best performance if you require it.

(https://ethereum.stackexchange.com/questions/51651/bower-vs-web3-vs-nodejs-vs-golang-apis)

### 2.4 Develop with Nethereum
Ethereum blockchain interaction with Nethereum https://mathieubrun.github.io/2018/04/29/ethereum-truffle-nethereum-docker.html

## 3.入门项目

区块链游戏设计必看网站——加密僵尸 https://zhuanlan.zhihu.com/p/34473272
Hell world DAPP https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2
How to use Brave Browser with Ethereum dApps https://blog.saturn.network/how-to-use-brave-browser-with-ethereum-dapps/


跨链
Cross blockchain https://polkadot.network/
https://polkadot.js.org/
