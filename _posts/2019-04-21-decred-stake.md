---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: Tutorial:Blockchain:how to stake decred
---

official site:. decred.org

GUI setup: https://docs.decred.org/getting-started/user-guides/decrediton-setup/

CLI setup: https://docs.decred.org/getting-started/user-guides/cli-installation/

stats: https://dcrstats.com/

stakepool: https://decred.org/stakepools/

questions on stake: https://stakepool.dcrstats.com/faq

ultrapool pool stats: https://www.ultrapool.eu/stats

Decred PoS process explained

1) If you are completely new to Decred, read this first: decredible.com/mining/pos

2) Download one of the wallets from Decred’s download page. Recommended wallets are Decrediton or the Command-Line wallet. Your wallet will need time to sync itself to the latest block. This may take some time. It will do so automatically in the background.

3) Send your DCR to your wallet. Funds will show up if the wallet is synced to the latest block (sometimes a restart is required).

4) Pick a stakepool and sign up on the pool’s website. Copy the API key they will provide to you. A list of stakepools and their websites can be found at the bottom of the Decred website. They charge a small fee (5% or less) to be used. The pool API key can be found in the settings page on their website.

5) Go to the Tickets tab located within the Decredition wallet. Click Import Script and input your API key and password. Now you are connected to the pool.

6) Enter the number of tickets you would like to buy. The default transaction fee of 0.001 DCR is fine (it’s the minimum). The default Expiry of 16 blocks is fine too. Click Purchase. You will be asked to enter your password to complete the transaction. You should now see a ‘Success!’ message and the ticket hash.

7) Your ticket will enter the mempool and wait there to be mined.

8) After your ticket is mined it will go to immature status. You can see this in the Tickets tab. You will have to wait 256 blocks (about 21 hours) for your ticket to mature and go live. Once the ticket is live, you wait for your ticket to vote.

9) After a vote, your funds will need another 256 blocks to become spendable again. You receive the original ticket price plus the PoS reward of ~1.4 DCR minus the pool fee.

10) On average, live tickets vote within 28 days, but it can take as long as 142.22 days (40960 blocks) to vote. If a ticket does not vote within this window, it expires, and the ticket fee is lost (don’t worry, the cost price of the ticket is refunded). There is a chance of less than 0.5% that this will happen to you.

The estimated ROI is ~2% per ticket, depending on the ticket price and the PoS reward.

The importance of voting

The term vote is used because you will be voting on different proposals to change and improve Decred. It is the heart of the Decred governance model. You will notice there are Voting Preferences in the Tickets tab. This is where you can decide on your vote. Apart from voting, the PoS process is used to validate blocks from the PoW miners.

from https://www.decredible.com/how-to-stake-decred-beginners-guide/