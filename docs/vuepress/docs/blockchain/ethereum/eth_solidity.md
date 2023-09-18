---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/blockchain)  《以太坊：solidity》

## 1. Basis

https://remix.ethereum.org/

### 1.1 Structure

State variable 
Function 
	Function modifier 
Events

### 1.2 Type:

**Elementary types：**

Enum type

Uint256 uint512
Fixed size byte array: Bytes4 bytes32
Dynamic sized: bytes, string
https://ethfiddle.com/XgOiXL2gfs
Rational and Integer Literals
Hexadecimal Literals
String Literals

Function types：
	Internal
	External
	![](/docs/docs_image/blockchain/eth/eth_solidity01.png)
	https://gist.github.com/lyhistory/a67e4b40f31e294678a1ccf93337fa36

Reference Types and Value Types:

Currently, reference types comprise structs, arrays and mappings. If you use a reference type, you always have to explicitly provide the data area where the type is stored:memory(whose lifetime is limited to a function call),storage(the location where the state variables are stored) or calldata(special datalocation that contains the function arguments, only available for external function call parameters).

Data location：

Assignments between storage and memory (or from calldata) always create an independent copy. Assignments from memory to
memory only create references, Assignments from storage to a local storage variables also only assign a reference
https://gist.github.com/lyhistory/a17ec9bc21a8fe85ff832de8f24b060f


Struct type
https://gist.github.com/lyhistory/b163f41299b87bb363e2cceba6004666
Map type
https://gist.github.com/lyhistory/259283f6d6bc078c1accfa2d74ce02dc

**Address type**

Address literal: Address vs address payable
addr.transfer() vs send

Add a "safe way to send ether" i.e. address.transfer https://github.com/ethereum/solidity/issues/610
Transfer, send, payable fallback
https://medium.com/daox/three-methods-to-transfer-funds-in-ethereum-by-means-of-solidity-5719944ed6e9

![](/docs/docs_image/blockchain/eth/eth_solidity02.png)

Warning:
You should avoid using.call()whenever possible when executing another contract function as it bypasses type checking, function existence check, and argument packing.
Warning:
There are some dangers in using send: The transfer fails if the call stack depth is at 1024 (this can always be  forced by the caller) and it also fails if the recipient runs out of gas. So in order to make safe Ether transfers, always check the return value of send, use transfer or even better: Use a pattern where the recipient withdraws the money.
Call, delegatecall, staticcall
https://gist.github.com/lyhistory/d168c5c69d5a3da8838596bd713e5895
https://ethfiddle.com/Ezu7qNkA1N
https://www.youtube.com/watch?v=esL6N3iF9g8
https://zupzup.org/smart-contract-interaction/

msg.sender.call() https://ethereum.stackexchange.com/questions/42521/what-does-msg-sender-call-do-in-soliditymsg.sender.call() https://ethereum.stackexchange.com/questions/42521/what-does-msg-sender-call-do-in-solidity
address.call.value(amount)( ) https://medium.com/daox/three-methods-to-transfer-funds-in-ethereum-by-means-of-solidity-5719944ed6e9


**Contract type**

Can convert to address type address(this)

**Array**

dynamic Array from Solidity
https://delegatecall.com/questions/workaround-for-return-dynamic-array-from-solidity69924f08-a061-426f-a326-2bed3f566e53
Store and retrieve data in an array in Solidity https://ethereum.stackexchange.com/questions/57340/store-and-retrieve-data-in-an-array-in-solidity
Create a new fixed size array in solidity https://stackoverflow.com/questions/51817121/create-a-new-fixed-size-array-in-solidity
Ethereum Solidity: Memory vs Storage & How to initialize an array inside a struct https://medium.com/loom-network/ethereum-solidity-memory-vs-storage-how-to-initialize-an-array-inside-a-struct-184baf6aa2eb


### 1.3 Operations

**Delete**

https://gist.github.com/lyhistory/bde8b0a967c7dae1fe7dadf302812e99
delete mapping[‘tokenid’]

**Conversion**

https://gist.github.com/lyhistory/af1a486fa6ac8464ac5f850ac7404ef0

**Bit Operation**

```
bytes1 a = 0xb5; // [10110101] 
bytes1 b = 0x56; // [01010110]
AND	a & b; // Result: 0x14  [00010100]
OR	a | b; // Result: 0xf7  [11110111]
XOR	a ^ b; // Result: 0xe3  [11100011]
	Interesting property is that if you want to know what was the value of original b, just XOR result with a. In one sense a is the key to unlock b.
	0xe3 ^ a; // Result: 0x56 == b  [01010110]

Negation:
	an inversion operation usually associated with the character “~” 
	Solidity doesn’t have support for negate operation. Luckily negation is the same as to XOR input with all 1s.
	a ^ 0xff; // Result: 0x4a  [01001010]

Left Shift:
	var n = 3;
	var aInt = uint8(a); // Converting bytes1 into 8 bit integer
	var shifted = aInt * 2 ** n;
	bytes1(shifted); 	// Back to bytes. Result: 0xa8  [10101000]

Right Shift:
	var n = 2;
	var aInt = uint8(a); // Converting bytes1 into 8 bit integer
	var shifted = aInt / 2 ** n;
	bytes1(shifted); 	// Back to bytes. Result: 0x2d  [00101101]

Get First N Bits:
	We can create a mask of needed count of 1s in order to filter the part we’re looking for by applying AND operation
	var n = 5;
	var nOnes = bytes1(2 ** n - 1); // Creates 5 1s
	var mask = shiftLeft(nOnes, 8 - n); // Shift left by 3 positions
	a & mask; // Result: 0xb0  [10110000]

Get Last N Bits:
	var n = 5;
	var lastBits = uint8(a) % 2 ** n;
	bytes1(lastBits); // Result: 0x15  [00010101]

Data Packing:
	bytes1 c = 0x0d;
	bytes1 d = 0x07;
	var result = shiftLeft(c, 4) | d; // 0xd7 [11010111]

```

### 1.4 Unit

https://gist.github.com/lyhistory/57beb322a4df936c9f80a20dc4183f8b

![](/docs/docs_image/blockchain/eth/eth_solidity03.png)

### 1.5 Low level functions

Abi
Bytecode 
Get abi by address

![](/docs/docs_image/blockchain/eth/eth_solidity04.png)

?questions: Web3.js Get Contract Abi Knowing Only Contract Address https://ethereum.stackexchange.com/questions/15603/web3-js-get-contract-abi-knowing-only-contract-address?rq=1
get bytecode of contract at certain address https://www.reddit.com/r/ethdev/comments/6j7yw4/how_do_you_get_bytecode_of_contract_at_certain/

### 1.6 Hash and Encoding

Ecrecover
	ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address)
	Sample: https://github.com/davidmichaelakers/ecrecover
	ECRecoverFromPersonalMessage
原理参考 DSA: ![](/docs/docs_image/blockchain/draft/05_5.png)

Keccak256   https://github.com/status-im/nim-keccak-tiny/issues/1
https://emn178.github.io/online-tools/keccak_256.html

Keccak256:
The Ethereum hashing function, keccak256, sometimes (erroneously) called sha256 or sha3
keccak256 is the Ethereum-SHA-3 hash. Look at the Solidity docs under Mathematical and Cryptographic Functions: http://solidity.readthedocs.io/en/develop/units-and-global-variables.html
It's for creating random uint256 with the string it been passed in. When you need somthing radomly, you can use it.

abi.encode vs abi.encodePacked 
https://medium.com/@libertylocked/what-are-abi-encoding-functions-in-solidity-0-4-24-c1a90b5ddce8

![](/docs/docs_image/blockchain/eth/eth_solidity05.png)

### 1.7 Errror handling

revert throw
When exceptions happen in a sub-call, they “bubble up” (i.e.  exceptions are rethrown) automatically.  Exceptions tothis rule aresendand the low-level functionscall,delegatecallandstaticcall– those returnfalseastheir first return value in case of an exception instead of “bubbling up”
Note thatassert-style exceptionsconsume all gas available to the call, whilerequire-style exceptions will not consume any gas starting from theMetropolis release
Anassert-style exception 
Arequire-style exception 

https://gist.github.com/lyhistory/f1c92d06c42c65ede2c90c5f6d40c6b4

Does ether transfer consume all gas in case of exception? https://ethereum.stackexchange.com/questions/38605/does-ether-transfer-consume-all-gas-in-case-of-exception

### 1.8 Expressions and Control Structures 3.4.5

Function calls(internal and external)

Warning:
Any interaction with another contract imposes a potential danger, especially if the source code of
the contract is not known in advance. The current contract hands over control to the called contract and that
may potentially do just about anything. Even if the called contract inherits from a known parent contract, the
inheriting contract is only required to have a correct interface. The implementation of the contract, however, can
be completely arbitrary and thus, pose a danger. In addition, be prepared in case it calls into other contracts of your
system or even back into the calling contract before the first call returns. This means that the called contract can
change state variables of the calling contract via its functions. Write your functions in a way that, for example, calls
to external functions happen after any changes to state variables in your contract so your contract is not vulnerable
to a reentrancy exploit.
Named Calls and Anonymous Function Parameter
Creating Contracts via new
Destructuring Assignments and Returning Multiple Values
Complications for Arrays and Structs
Scoping and Declarations
https://gist.github.com/lyhistory/ab764cc9b000ed54b4f5213c8d5dbfa6


### 1.9 Contract 

Create
	Contracts can be created “from outside” via Ethereum transactions or from within Solidity contracts.

Visibility and Getters
	Modifier: pure view payable Internal external constant 
	Since Solidity knows two kinds of function calls (internal ones that do not create an actual EVM call (also called a“message call”) and external ones that do), there are four types of visibilities for functions and state variables.
	The compiler automatically creates getter functions for all public state variables,The getter functions have external visibility. If the symbol is accessed internally (i.e. without this.), it evaluates to a state variable. If it is accessed externally (i.e. with this.), it evaluates to a function.If you have a public state variable of array type, then you can only retrieve single elements of the array via the generated getter function.for exampledata(0). If you want to return an entire array in one call, then you need to write a function
view function

pure function
Functions can be declaredpurein which case they promise not to read from or modify the state

**Fallback function**

Warning:The fallback function is also executed if the caller meant to call a function that is not available.  Ifyou want to implement the fallback function only to receive ether, you should add a check likerequire(msg.data.length == 0)to prevent invalid calls.
Warning:Contracts that receive Ether directly (without a function call, i.e.  usingsendortransfer) butdo not define a fallback function throw an exception, sending back the Ether (this was different before Solidityv0.4.0). So if you want your contract to receive Ether, you have to implement a payable fallback function
Warning:A contract without a payable fallback function can receive Ether as a recipient of acoinbase transaction(akaminer block reward) or as a destination of aselfdestruct.A contract cannot react to such Ether transfers and thus also cannot reject them.  This is a design choice of theEVM and Solidity cannot work around it.It also means thataddress(this).balancecan be higher than the sum of some manual accounting imple-mented in a contract (i.e. having a counter updated in the fallback function).

Fallback functions and the fundamental limitations of using send() in Ethereum & Solidity https://github.com/ConsenSys/Ethereum-Development-Best-Practices/wiki/Fallback-functions-and-the-fundamental-limitations-of-using-send()-in-Ethereum-&-Solidity
https://programtheblockchain.com/posts/2017/12/16/be-careful-when-using-the-solidity-fallback-function/
https://ethereum.stackexchange.com/questions/45419/msg-sender-transferpurchaseexcess-failure-in-solidity-test
https://programtheblockchain.com/posts/2017/12/15/writing-a-contract-that-handles-ether/
https://stackoverflow.com/questions/48351077/accepting-ether-in-smart-contract

Function Overloading
Events
Inheritance
Constructors
Multiple Inheritance and Linearization
Note that a function without implementation is different from aFunction Typeeven though their syntax looks verysimilar

Interfaces

Types defined inside interfaces and other contract-like structures can be accessed from other contracts (struct, enum..)

Libraries

https://gist.github.com/lyhistory/2976c80aa8772c257df76d936104852e

**interact:**
Tx.origin vs msg.sender
https://dappsforbeginners.wordpress.com/tutorials/interactions-between-contracts/
Get address from newly created Contract
https://gist.github.com/lyhistory/08646fc88d96ecf11680272f098b8924
https://ethfiddle.com/oJR5ovpJTt

Type address is not implicitly convertible to expected type contract ERC20 https://ethereum.stackexchange.com/questions/57030/type-address-is-not-implicitly-convertible-to-expected-type-contract-erc20/57032

Deprecated function address.call.value(amount)( )
https://medium.com/daox/three-methods-to-transfer-funds-in-ethereum-by-means-of-solidity-5719944ed6e9

## 2. Advance

### 2.1 Security
Common attacks in Solidity and how to defend against them https://medium.com/coinmonks/common-attacks-in-solidity-and-how-to-defend-against-them-9bc3994c7c18

**Overflow attack**
```
/* Check if sender has balance and for overflows */ if (balanceOf[msg.sender] < _value || balanceOf[_to] + _value < balanceOf[_to]) throw;
```

**re-entrance attacks**

https://ethereum.stackexchange.com/questions/19737/security-implications-in-solidity?noredirect=1

from: https://solidity.readthedocs.io/en/develop/solidity-by-example.html
![](/docs/docs_image/blockchain/eth/eth_solidity06.png)

**Replay attack**

![](/docs/docs_image/blockchain/eth/eth_solidity07.png)

### 2.2 Learn to debug

Remix -> Instructions
https://ethereum.stackexchange.com/questions/38605/does-ether-transfer-consume-all-gas-in-case-of-exception

https://ethfiddle.com/z75IN-MXC-
https://ethfiddle.com/IQPrEvR1Jm
https://ethfiddle.com/R4tVnZEiIS
https://ethfiddle.com/nxcIJztXhd

### 2.3 EVM

The Ethereum Virtual Machine or EVM is the runtime environment for smart contracts in Ethereum.  It is not onlysandboxed but actually completely isolated, which means that code running inside the EVM has no access to network,filesystem or other processes. Smart contracts even have limited access to other smart contracts.

Storage, Memory and the Stack https://medium.com/coinmonks/what-the-hack-is-memory-and-storage-in-solidity-6b9e62577305
Instruction Set
	Opcodes

Getting Deep Into EVM: How Ethereum Works Backstage https://hackernoon.com/getting-deep-into-evm-how-ethereum-works-backstage-ac7efa1f0015

### 2.4 Sample

Blind auction

Safe remote purchase

Payment channel
EIP762		https://github.com/ethereum/EIPs/pull/712


## 3. Notes

All identifiers (contract names, function names and variable names) are restricted to the ASCII character set.
It is possible to store UTF-8 encoded data in string variables
Be careful with using Unicode text, as similar looking (or even identical) characters can have different
code points and as such will be encoded as a different byte array.

If you use this contract to send coins to an address, you will not see anything when you look at that address on
a blockchain explorer, because the fact that you sent coins and the changed balances are only stored in the data storage
of this particular coin contract. By the use of events it is relatively easy to create a “blockchain explorer” that tracks
transactions and balances of your new coin, but you have to inspect the coin contract address and not the addresses of
the coin owners

Transactions are not guaranteed to be included in the next block or any specific future block, since it is not up
to the submitter of a transaction, but up to the miners to determine in which block the transaction is included.
If you want to schedule future calls of your contract, you can use the alarm clock or a similar oracle service.

Regardless of whether or not the account stores code, the two types are treated equally by the EVM.
Every account has a persistent key-value store mapping 256-bit words to 256-bit words called storage.
Furthermore, every account has a balance in Ether (in “Wei” to be exact,1 ether is 10\*\*18 wei) which can be modifiedby sending transactions that include Ether

While a contract is being created, its code is still empty. Because of that, you should not call back into the
contract under construction until its constructor has finished executing

**Message call vs Transaction**

Contracts can call other contracts or send Ether to non-contract accounts by the means of message calls. Message calls
are similar to transactions, in that they have a source, a target, data payload, Ether, gas and return data. In fact, every
transaction consists of a top-level message call which in turn can create further message calls
Calls are limited to a depth of 1024, which means that for more complex operations, loops should be preferred over
recursive calls. Furthermore, only 63/64th of the gas can be forwarded in a message call, which causes a depth limit
of a little less than 1000 in practice.

**Delegatecall / Callcode and Libraries**

There exists a special variant of a message call, named delegatecall which is identical to a message call apart from the fact that the code at the target address is executed in the context of the calling contract and msg.sender and msg.value do not change their values.
This means that a contract can dynamically load code from a different address at runtime. Storage, current address and balance still refer to the calling contract, only the code is taken from the called address.
This makes it possible to implement the “library” feature in Solidity: Reusable library code that can be applied to a contract’s storage, e.g. in order to implement a complex data structure.


Note:
Even if a contract’s code does not contain a call to selfdestruct, it can still perform that operation using delegatecall or callcode.


## troubleshooting

?#empty value (0x) returned from contract
Error or revert in the function
?# cannot find the function
Because it’s an internal function, not public function

---

refer:

The following represents a list of tutorials/resources that could help to learn specifics of developing smart-contracts:
+ Full guide about smart-contract development: https://blockgeeks.com/guides/solidity/
+ ICO/DApp development, additional list of useful resources: https://medium.com/@robbertvermeulen/learn-solidity-the-ethereum-smart-contract-programming-language-7f106fc26d6
+ Official solidity tutorials: https://ethereumbuilders.gitbooks.io/guide/content/en/solidity_tutorials.html
+ Official solidity documentation: http://solidity.readthedocs.io/en/latest/

<disqus/>