---
title: 'Tutorial:Blockchain: create website with IPFS'
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

final result, my sample site:

ipfs.io/ipns/samsara.site

or

samsara.site

it's currently hosting on my pc, loading speed quite slow, please be patient


how to:

1. create simple site with hugo:

hugo new site samsara.site

git init

git submodule add <themes url>

hugo -s samsara.site\ -d \publish


2. publish to ipfs ipns peer

ipfs init

ipfs daemon

ipfs add -r \publish

ipfs name publish <hash>



3. port forwarding & reverse proxy

add port forwarding in route setting

dns record:

txt dlink=/ipns/<peer id>

start nginx