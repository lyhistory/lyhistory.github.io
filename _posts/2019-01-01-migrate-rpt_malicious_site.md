---
title: Step by Step to report a malicious site
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

Recently I find my blog being injected with malicious js which redirects my site to a malicious website,  it took me some time to fix it, although now removed the injection, I really want to stop this malicious site from running, so I have the following steps for you to do if you face the same issue, at least the offender has been suspended by one of the hosting when they received my complaint.

![](/content/images/post/20190101/malicious-site1.png)
![](/content/images/post/20190101/malicious-site2.png)

## Step 1: NSLOOKUP: look up and find IP addresses in the DNS
http://www.kloth.net/services/nslookup.php

![](/content/images/post/20190101/malicious-site3.png)

## Step 2: Now, do a WHOIS lookup on the IP address at
https://www.arin.net/

Use the link arin.net provides to contact the owner of the IP address to report the abusive content.
![](/content/images/post/20190101/malicious-site4.png)
![](/content/images/post/20190101/malicious-site5.png)

## Step 3: send email to their abuse department
in my case, I need more steps because as the organization "The RIPE NCC" says that it is one of five Regional Internet Registries (RIRs) that allocates blocks of IP addresses to Internet service providers (ISPs) and other organizations, but has no involvement in how these addresses are used.
![](/content/images/post/20190101/malicious-site6.png)

## Step 4: go to Find Abuse Contacts in their network IP Database( my case the network provider is RIPE)
https://www.ripe.net/support/abuse
![](/content/images/post/20190101/malicious-site7.png)
![](/content/images/post/20190101/malicious-site8.png)
![](/content/images/post/20190101/malicious-site9.png)

## Step 5: email them or contact their customer service by opening a ticket
![](/content/images/post/20190101/malicious-site10.png)
wait for their feedback
![](/content/images/post/20190101/malicious-site11.png)

refer:

Reporting Malware and Phishing https://sg.godaddy.com/help/reporting-malware-and-phishing-12000