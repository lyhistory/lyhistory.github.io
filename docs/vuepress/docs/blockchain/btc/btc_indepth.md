
## bitcoin source code

**# Why Separate execution of unlocking and locking scripts**

https://bitcointalk.org/index.php?topic=5095376.new#new
https://en.bitcoin.it/wiki/Common_Vulnerabilities_and_Exposures
Here you can see a list of all Bitcoin CVEs, including the one you are talking about.

To understand what happened in CVE-2010-5141 you need to understand Script execution and OP_PUSHDATA. When validating a script, bitcoin-core used to use a stack and fusion script_sig with script_pubkey onto it, which led to a stack being :
Code:
<OP_CODEs from scriptsig><OP_CODEs from scriptpubkey>
You could simply use an OP_PUSHDATA in script_sig, which would push the scriptpubkey onto the stack without executing it.
The scriptpubkey not executed resulting in conditions under which you can spend the output that are not set. Thus you could spend any output using OP_PUSHDATA. Now, the code executes script_sig on a stack, copy it (to stackCopy), then executes script_pubkey on stack (the first one).
Here is the link to the function evaluating the script.

**# Timelock Defense Against Fee Sniping ??? don’t understand**

**# chater 07 Complex Script Example**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch07.asciidoc
A few more things to consider when reading this example. See if you can find the answers:
●	Why can’t the lawyer redeem the third execution path at any time by selecting it with FALSE on the unlocking script?
●	How many execution paths can be used 5, 35, and 105 days, respectively, after the UTXO is mined?
●	Are the funds lost if the lawyer loses his key? Does your answer change if 91 days have elapsed?
●	How do the partners "reset" the clock every 29 or 89 days to prevent the lawyer from accessing the funds?
●	Why do some CHECKSIG opcodes in this script have the VERIFY suffix while others don’t?

**# chater 10**

https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch10.asciidoc

In practice, a miner may intentionally mine a block taking less than the full reward. Such blocks have already been mined and more may be mined in the

Raw transactions
https://bitcoin.stackexchange.com/questions/32628/redeeming-a-raw-transaction-step-by-step-example-required
https://bitcoin.stackexchange.com/questions/29955/how-to-sign-bitcoin-transaction-with-bitcoind-and-non-bitcoind-wallet-private
https://bitcoin.stackexchange.com/questions/30550/is-it-possible-to-create-a-transaction-in-pure-python-without-needing-to-run-bit




##
Bitcoin Cold Storage Using a Bitcoin Core Wallet https://dev-notes.eu/2017/08/setup-and-manage-bitcoin-core-cold-storage-wallet/

