https://docs.parrotlinux.org/mirror-list/

https://community.parrotsec.org/



Temporary failure resolving 'deb.parrot.sh'

```
https://community.parrotsec.org/t/apt-get-update-problem/11736/3
if you have’nt yet solve it :
a)sudo rm /etc/resolv.conf
b)sudo ln -s /run/resolvconf/resolv.conf /etc/resolv.conf
c)reboot and repeat the above and sudo parrot-upgrade
i was informed that the issue occur when one upgrades while anonsurf is on,so it’s better to do it while anon off.
```



RPC failed; curl 56 GnuTLS recv error (-54): Error in the pull function.

https://blog.csdn.net/bingyu9875/article/details/102568686

```
https://gist.github.com/pescobar/6ae5634f92d75d23c36a
#!/usr/bin/env bash

# Clear out all previous attempts
rm -rf "/tmp/source-git/"

# Get the dependencies for git, then get openssl
sudo apt-get install build-essential fakeroot dpkg-dev -y
sudo apt-get build-dep git -y
sudo apt-get install libcurl4-openssl-dev -y
mkdir -p "/tmp/source-git/"
cd "/tmp/source-git/"
apt-get source git //遇到 You must put some 'deb-src' URIs in your sources.list,很简单:
vim /etc/apt/sources.list.d/parrot.list
将注释起来的两行 deb-src 注释去掉

# We need to actually go into the git source directory
# find -type f -name "*.dsc" -exec dpkg-source -x \{\} \;
cd $(find -mindepth 1 -maxdepth 1 -type d -name "git-*")
pwd

# This is where we actually change the library from one type to the other.
sed -i -- 's/libcurl4-gnutls-dev/libcurl4-openssl-dev/' ./debian/control
# Compile time, itself, is long. Skips the tests. Do so at your own peril.
sed -i -- '/TEST\s*=\s*test/d' ./debian/rules

# Build it.
#dpkg-buildpackage -rfakeroot -b 遇到signature失败问题,换用:
dpkg-buildpackage -rfakeroot -b -uc -us

# Install
#find .. -type f -name "git_*ubuntu*.deb" -exec sudo dpkg -i \{\} \;
find .. -type f -name "git_*.deb" -exec sudo dpkg -i \{\} \;
```

遇到新错误

error: RPC failed; curl 56 OpenSSL SSL_read: Connection reset by peer, errno 104

最后发现是设置的静态IP冲突了！！！



