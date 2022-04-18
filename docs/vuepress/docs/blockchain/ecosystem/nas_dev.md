**ref:**

https://github.com/nebulasio/wiki/wiki/roadmap
https://github.com/nebulasio/wiki/blob/master/tutorials.md

Don’t use sudo for ‘make dep’ and ‘make build’
Change ~/.bashrc and source ~/.bashrc, close terminal and reopen
GOPATH

## 1. Install

### 1.1 Pre-insall 

**Nodejs**

Download https://nodejs.org/en/
Cd /tmp/mozila
	tar -xf node-v6.9.2-linux-x64.tar.gz --directory /usr/local --strip-components 1
https://github.com/nodejs/help/issues/418
node --version
npm --version

**GIT/MAKE/WGET**

sudo apt-get install git make wget

**Go Lang Installation**

https://golang.org/doc/install
```
	wget https://dl.google.com/go/go1.9.3.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.9.3.linux-amd64.tar.gz
$HOME/.bashrc	vim ~/.bashrc
# Added for golang
export PATH=$PATH:/usr/local/go/bin
export GOPATH=<change_this_path>/go

source ~/.bashrc
```
Go version
Go env

GOPATH="/home/lyhistory/go"

**Dep**

	cd /usr/local/bin/
	wget https://github.com/golang/dep/releases/download/v0.3.2/dep-linux-amd64
	ln -s dep-linux-amd64 dep

### 1.2 Install

**Set up project**

mkdir -p $HOME/go/src

	git clone -b v0.5.0 https://github.com/nebulasio/go-nebulas.git --depth=1

**V8**

	cd go/src/github.com/go-nebulas
	make deploy-v8

**Build**

```
cd <path>/go-nebulas
	make dep
waiting for lockfile /home/lyhistory/go/pkg/dep/sm.lock: open /home/lyhistory/go/pkg/dep/sm.lock.759162448: permission denied
unable to lock /home/lyhistory/go/pkg/dep/sm.lock: open /home/lyhistory/go/pkg/dep/sm.lock.759162448: permission denied
Makefile:53: recipe for target 'dep' failed
make: *** [dep] Error 1
	sudo rm -r /home/lyhistory/go/pkg
	dep ensure -v
/home/lyhistory/go/src/github.com/nebulasio/go-nebulas is not within a known GOPATH/src
Makefile:53: recipe for target 'dep' failed
make: *** [dep] Error 1
#######
bin/sh go: not found
	go env (check GOPATH)

	/usr/local/bin$ sudo chmod 755 dep-linux-amd64

cd go/src/github.com/go-nebulas
make build
cd cmd/neb; go build -ldflags "-X main.version=0.5.0 -X main.commit=ed37beae37d984b1f5760e3b6a58f94a1fff3ebf -X main.branch=HEAD -X main.compileAt=`date +%s`" -o ../../neb
/bin/sh: 1: go: not found
Makefile:64: recipe for target 'build' failed
make: *** [build] Error 127

PS: if you get an error like cannot find package. Step 1: export proxy to terminal $ export https_proxy=http://127.0.0.1:1087. Step 2 make dep or dep ensure. Now you should be able to make build.

Developers note: The Nebulas Go main function is in cmd/neb/main.go

```

## 2. Test V0.5

```
curl -i -H Accept:application/json -X POST http://localhost:8685/v1/user/accountstate -d '{"address":"1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c"}'

./neb -c conf/default/config.conf


curl -i -H Accept:application/json -X GET http://localhost:8685/v1/user/accounts
curl -i -H Accept:application/json -X POST http://localhost:8685/v1/admin/account/unlock -d '{"address":"1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c", "passphrase":"passphrase"}'

curl -i -H 'Accept: application/json' -X POST http://localhost:8685/v1/user/transaction  -d '{"from":"1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c","to":"e6dea0d0769fbf71ab01f8e0d78cd59e78361a450e1f4f88","nonce":1,"value":"10"}'



curl -i -H 'Accept: application/json' -X POST http://localhost:8685/v1/user/transaction -H 'Content-Type: application/json' -d '{"from":"1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c","to":"1a263547d167c74cf4b8f9166cfa244de0481c514a45aa2c", "value":"0","nonce":1,"gasPrice":"1000000","gasLimit":"2000000","contract":{"source":"\"use strict\";var DepositeContent=function(text){if(text){var o=JSON.parse(text);this.balance=new BigNumber(o.balance);this.expiryHeight=new BigNumber(o.expiryHeight)}else{this.balance=new BigNumber(0);this.expiryHeight=new BigNumber(0)}};DepositeContent.prototype={toString:function(){return JSON.stringify(this)}};var BankVaultContract=function(){LocalContractStorage.defineMapProperty(this,\"bankVault\",{parse:function(text){return new DepositeContent(text)},stringify:function(o){return o.toString()}})};BankVaultContract.prototype={init:function(){},save:function(height){var from=Blockchain.transaction.from;var value=Blockchain.transaction.value;var bk_height=new BigNumber(Blockchain.block.height);var orig_deposit=this.bankVault.get(from);if(orig_deposit){value=value.plus(orig_deposit.balance)}var deposit=new DepositeContent();deposit.balance=value;deposit.expiryHeight=bk_height.plus(height);this.bankVault.put(from,deposit)},takeout:function(value){var from=Blockchain.transaction.from;var bk_height=new BigNumber(Blockchain.block.height);var amount=new BigNumber(value);var deposit=this.bankVault.get(from);if(!deposit){throw new Error(\"No deposit before.\");}if(bk_height.lt(deposit.expiryHeight)){throw new Error(\"Can not takeout before expiryHeight.\");}if(amount.gt(deposit.balance)){throw new Error(\"Insufficient balance.\");}var result=Blockchain.transfer(from,amount);if(result!=0){throw new Error(\"transfer failed.\");}Event.Trigger(\"BankVault\",{Transfer:{from:Blockchain.transaction.to,to:from,value:amount.toString()}});deposit.balance=deposit.balance.sub(amount);this.bankVault.put(from,deposit)},balanceOf:function(){var from=Blockchain.transaction.from;return this.bankVault.get(from)}};module.exports=BankVaultContract;","sourceType":"js", "args":""}}'

```

## 3.小应用开发测试

### 3.1 APP:百人骰子王

**基本信息**

这是第一周参与并通过审核的小应用，目的是熟悉开发语言和环境
NAS开发者账户：lyhistory@gmail.com
网站：http://nas.lyhistory.com/
Hash: 4f01882a905abd162db9aec709697f358329655104b3620ae255d0b2e789cfbe
Contract: n21G4ouwWCnJRATpw5tmmVZF8EFmtT39UwF
功能：用户掷骰子，参与游戏，满10人后自动用随机数开奖，获奖者平分奖金

![](/docs/docs_image/blockchain/ecosystem/nas01.png)

**学习总结**

这是做的第一个简单的应用，基本想法是，每满10人参与后就开奖，开奖的随机数是自己简单计算的一个伪随机数，NAS上面的随机数这块需要进一步的学习，另外可以进一步完善的地方是，如果没有人中奖，奖金累积到资金池，另外安全方面也没有考虑太多，需要更多的安全设计

### 3.2 APP: 小借条

**基本信息**

这是第二周做的一个稍微复杂一些的小应用，目的是进一步的探索用户之间的各种交互
NAS开发者账户：lyhistory@gmail.com
网站: http://nas.lyhistory.com/jietiao/
hash：ad279a208b7c513948cb2a0ad7700fa9b06fffbd3959513ad83b1237eeaebbce
contract：n1zvfPDzvNaoCXRJ3mF8sCLrEysTzoyFMNh
功能：
1.出借者Lender创建借条，输入双方姓名，对方/借款人NAS地址(目前是必填项，已经留了接口，后续可以改成选填），金额，利息，备注（可选）
2.创建好后，双方都可以通过页面上的‘登录’功能（只需要提供NAS地址）来查询自己的借出和借入等所有借条信息和状态
3.出借者Lender可以确认收款或者撕掉/删除借条
4.借款人Borrower只可以接受借条或者通知Lender已经还款
所有信息公开透明，程序设计只给了出借者Lender确认或者撕掉借条的权限是因为出借者本身就是利益者，所以不会产生对自己不利的操作，从这个角度也保持了信息不可篡改的一致性

![](/docs/docs_image/blockchain/ecosystem/nas02.png)

**学习总结**

虽然有很多瑕疵没有通过审核，这个应用主要是探索学习用户之间的交互，通过用户之间共同维护某些记录的状态变化和用户之间的关系来控制逻辑走向，基本达成了设计的想法，需要进一步探索的是，这样的设计会造成用户隐私的泄露，完全公开透明会一定程度的削弱用户的使用意愿，需要探索公开透明和用户隐私的相对的关系，并通过技术手段实现

### 3.3 APP: 密码箱

**基本信息**

这是做的相对完整的一个应用，可惜因为排名算法没有通过
NAS开发者账户：597530534@qq.com
网站: http://nas.vouchain.one/codecase
hash：627a2b774e2182d8c1c6e717b781733bf851d15df7ada987c912f626f008453b
contract：n1vtR9pjPT7dPMtE8KSVuXSfveRDuRcbfe3
功能：主要目的是，让用户可以用一个或多个密钥来加密管理所有的密码本，包括私钥等等
1. 创建保存一条记录[典型记录比如：网站名，用户名，密码，密钥提示，备注信息]
2. 将某条记录分享给其他NAS用户，而且只有创建者才可以分享该记录给其他用户
3. 将某条记录公开给所有人，只有创建者可以执行
4. 删除用户指定的记录，如果用户是记录创建者，可以直接删除记录，如果用户只是分享者，只能删除自己的索引，而不会影响创建者及其他所有该记录的分享对象
5. 根据用户地址获取密码箱内容，然后通过输入密钥解锁关键的密码信息

视频演示
https://v.youku.com/v_show/id_XMzYxNTkxNzYxNg==.html

![](/docs/docs_image/blockchain/ecosystem/nas03.png)

**学习总结**

这个应用的目的是测试学习如何通过区块链保管一些用户敏感信息，只是做了很简单的尝试，可以进一步提升的是，可以在整个外层让用户创建多个保险箱，然后每个保险箱配备对应的密钥（用户线下保管），再进一步需要思考的是，实际上加密的仅仅是用户的密码，其他信息都是暴露的，这样可以让人通过用户nas地址查询到用户所有的其他记录信息，点点滴滴的信息拼接起来就可以对用户画像，也是一种隐私泄露，需要探索

## 4. 社区交流

https://github.com/nebulasio/wiki/issues/149

https://github.com/nebulasio/wiki/issues/153

![](/docs/docs_image/blockchain/ecosystem/nas04.png)
![](/docs/docs_image/blockchain/ecosystem/nas05.png)
![](/docs/docs_image/blockchain/ecosystem/nas06.png)



![](/docs/docs_image/blockchain/ecosystem/nas01.png)

<disqus/>