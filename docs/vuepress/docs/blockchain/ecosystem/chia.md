
https://github.com/Chia-Network/chia-blockchain/blob/master/README.md

1.Python 3.7+ is required. Make sure your default python version is >=3.7 by typing python3.

2.If you are behind a NAT, it can be difficult for peers outside your subnet to reach you. You can enable UPnP on your router or add a NAT (for IPv4 but not IPv6) and firewall rules to allow TCP port 8444 access to your peer. These methods tend to be router make/model specific.
port forwarding

3. for windows

dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all

windows store: ubuntu

4.install

```
vim .bashrc
export CHIA_ROOT=/mnt/d/miner/chia/

sudo apt-get update
sudo apt-get install python3.7-venv python3.7-distutils git -y

# Either checkout the source and install
git clone https://github.com/Chia-Network/chia-blockchain.git
cd chia-blockchain

sh install.sh

. ./activate

# Or install chia-blockchain as a binary package
python3.7 -m venv venv
ln -s venv/bin/activate
. ./activate
pip install --upgrade pip
pip install -i https://hosted.chia.net/simple/ miniupnpc==2.0.2 setproctitle==1.1.10 cbor2==5.0.1

pip install chia-blockchain==1.0.beta3
```

5.

. ./activate


Migrate or set up configuration files
chia init

First, create some keys by running the following script:

chia-generate-keys

**Run a full node + wallet:

chia-start-node &
chia-start-wallet-server &


**Run a farmer + full node + wallet:

chia-create-plots -k 20 -n 10 -t /mnt/d/miner/chia/tmp_dir -d /mnt/d/miner/chia/final_dir
chia-start-farmer &
chia-start-wallet-server &


6. And then run chia.exe from the unzipped chia-win32-x64 directory in Windows (not Ubuntu/WSL 2.)
Download: Chia-Wallet-Install-0.1.3 https://hosted.chia.net/beta-1.3-win64-wallet/Chia-Wallet-Install-0.1.3.msi


7.

cd /home/lyhistory/chia-blockchain

. ./activate

chia-create-plots -k 20 -n 10 -t /mnt/d/miner/chia/tmp_dir -d /mnt/d/miner/chia/final_dir
chia-start-farmer &
chia-start-wallet-server &


