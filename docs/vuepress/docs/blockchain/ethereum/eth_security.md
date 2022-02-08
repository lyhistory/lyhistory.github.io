
##  safe smart contract

### theory

安全漏洞--整数溢出漏洞(IOV)分析 https://blog.csdn.net/microzone/article/details/70240553

以太坊蜜罐智能合约分析 https://paper.seebug.org/631/

Token Contract Risk List — A Joint Open Source Project by Loopring & SECBIT https://medium.com/loopring-protocol/token-contract-risk-list-a-joint-open-source-project-by-loopring-secbit-85df8fff55e1
https://github.com/sec-bit/awesome-buggy-erc20-tokens

https://learnblockchain.cn/2018/04/25/bec-overflow/
https://blog.csdn.net/ITleaks/article/details/80094536
https://peckshield.com/2018/05/23/allowAnyone/

https://arxiv.org/abs/1802.06038
https://github.com/nud3l/github-search-crawler
ATN 披露特殊场景下的以太坊合约重大漏洞并与慢雾科技达成战略合作 https://mp.weixin.qq.com/s/S5Oq4TxxW5OgEkOmy8ZSzQ

大量以太坊Token合约没有遵守EIP20规范
据SECBIT实验室研究发现，至少2603份ERC20 Token合约没有遵守EIP20规范，涉及17种市值排名前100币种。以太坊智能合约编译器Solidity升级后，编译产生的合约代码将会无法兼容一些非标准的智能合约。这些非标准合约将会对DAPP的生态造成严重影响，这个问题可能造成如去中心化交易所无法正常交易或转账等严重问题。

加密货币的“黑暗森林”
https://mp.weixin.qq.com/s/uBH62HOwnUgTQLJQBJwlKg

SECBIT智能合约实验室创始人郭宇在欧链主办的“EOS开发者大会”上表示，该实验室分析了三万多个token，发现1703个token用了错误的代码。这些项目方要想彻底解决这些安全问题，必须重新发币。郭宇回溯此前发生的BEC智能合约漏洞时称，BEC仅142行代码就暴露出如此大的安全漏洞。

example： airdrop
> This airdropper also has a method to self-destruct which is called as soon as tokens have been distributed to all recipients.
> This prevents it from being used as an attack vector in any future zero-day exploits 
> https://github.com/odemio/airdropper?utm_source=ODEM&utm_campaign=2ee088b2ca-EMAIL_CAMPAIGN_2018_05_18&utm_medium=email&utm_term=0_a3edf4f43c-2ee088b2ca-34114279

https://github.com/odemio/ico/tree/960d1e485644b2e4ef58ce7522d0db91fb902756


todo：
https://www.jianshu.com/p/de1d15f0986b
https://github.com/theupdateframework/notary/blob/master/docs/service_architecture.md

3step rule: check prerequisites, update statevariables, and perform actions.
https://github.com/zeppelinos/labs
https://blog.zeppelinos.org/smart-contract-upgradeability-using-eternal-storage/

https://docs.zeppelinos.org/docs/start.html#getting-started
http://solidity.readthedocs.io/en/v0.4.24/assembly.html
https://github.com/ewasm/design
https://www.youtube.com/channel/UCd8CDrm6rvwBZc6g7BYAkfQ

https://github.com/protofire/MultiSigWallet
https://medium.com/poa-network/cross-chain-bridges-paving-the-way-to-internet-of-blockchains-422ac94bc2e5
Monitor
https://github.com/oraclize/state-of-the-dapps
https://valanter.com/academy/tutorials/install-ethereum-node-explorer-and-ethstats-with-net-intelligence/
https://blog.neufund.org/how-to-get-real-time-alerts-for-your-smart-contracts-63938f4fc768

https://github.com/Capgemini-AIE/ethereum-docker
https://github.com/CamTosh/Ethereum
https://github.com/misterch0c/Ethereum-ICO-Monitoring

https://blog.ippon.tech/monitoring-the-ethereum-blockchain/
https://github.com/oraclize/bitcoin-network-monitor

https://quickblocks.io/


## MAIAN Tool

Report Claims 34,000 Ethereum Smart Contracts Are Vulnerable to Bugs https://news.bitcoin.com/report-claims-34000-ethereum-smart-contracts-vulnerable-bugs/

https://github.com/MAIAN-tool/MAIAN

### Dependence 

Install web3py for python

Installing Go Ethereum 
https://ethereum.github.io/go-ethereum/install/#install-on-ubuntu-via-ppas
Installing the Solidity Compiler 
http://solidity.readthedocs.io/en/develop/installing-solidity.html

Installing z3
https://github.com/Z3Prover/z3 

Installing PyQt5 http://pyqt.sourceforge.net/Docs/PyQt5/installation.html
pip install pyqt5

### troubleshooting 

?#issues: KeepAliveRPCProvider
https://web3py.readthedocs.io/en/stable/releases.html?highlight=KeepAliveRPCProvider

Deprecated KeepAliveRPCProvider
Use HTTPProvider

？#issues: hashlib / sha3

？#issues: decode_hex
from rlp.utils import decode_hex, encode_hex, ascii_chr, str_to_bytes

https://github.com/ethereum/pyethereum/issues/868
https://github.com/ethereum/pyrlp/issues/87

？#issues: Gcc error / fatal error: Python.h: No such file or directory
https://stackoverflow.com/questions/21530577/fatal-error-python-h-no-such-file-or-directory
https://github.com/ethereum/web3.py/issues/531
sudo apt-get install python-dev
sudo apt-get install python3-dev

？#issues: Queue
https://docs.python.org/3/library/queue.html
https://stackoverflow.com/questions/29687837/queue-importerror-in-python-3

### debug

```
c:\dev\cygwin64\bin\run.exe --quote /usr/bin/bash.exe -l -c "cd; /usr/bin/xinit /etc/X11/xinit/startxwinrc -- /usr/bin/XWin :1 -multiwindow -listen tcp"
 source ~/.venv-py3/bin/activate
/opt/idea-IC-181.5281.24/bin/idea.sh&
Cd /home/blockchain/workspace/eth/security/MAIAN/tool
python gui-maian.py
```

![](/docs/docs_image/blockchain/eth/eth_security01.png)



