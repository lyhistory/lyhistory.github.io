## Linux

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

## Windows

https://github.com/Chia-Network/chia-blockchain/wiki/INSTALL

https://github.com/Chia-Network/chia-blockchain/wiki/Quick-Start-Guide

default data path:

C:\Users\Admin\.chia\beta-1.0b9

cd %localappdata%\Chia-Blockchain\app-0.1.9\resources\app.asar.unpacked\daemon

```
chia.exe -h
>chia.exe -r "d:\miner\chia" start all

C:\Users\Admin\AppData\Local\Chia-Blockchain\app-0.1.9\resources\app.asar.unpacked\daemon>chia.exe -r "d:\miner\chia" start all
can't find d:\miner\chia\config\config.yaml
** please run `chia init` to migrate or create new config files **

C:\Users\Admin\AppData\Local\Chia-Blockchain\app-0.1.9\resources\app.asar.unpacked\daemon>chia.exe -r "d:\miner\chia" init
Chia directory d:\miner\chia
C:\Users\Admin\.chia\beta-1.0b8 not found - this is ok if you did not install this version.
Setting the xch destination address for coinbase fees reward to 16b6ac7453f8c51651ea169c320a1a7cf7dd46e103bf9a3e2cc64755ddc38754
Setting the xch destination address for coinbase reward to 16b6ac7453f8c51651ea169c320a1a7cf7dd46e103bf9a3e2cc64755ddc38754

To see your keys, run 'chia keys show'

C:\Users\Admin\AppData\Local\Chia-Blockchain\app-0.1.9\resources\app.asar.unpacked\daemon>chia.exe -r "d:\miner\chia" start all
Exception connecting to daemon: Multiple exceptions: [Errno 10061] Connect call failed ('::1', 55400, 0, 0), [Errno 10061] Connect call failed ('127.0.0.1', 55400)
chia_harvester: started
chia_timelord_launcher: chia_timelord_launcher failed to start. Error: start failed
chia_timelord: chia_timelord failed to start. Error: start failed
chia_farmer: started
chia_full_node: started
chia_wallet: started
```

https://github.com/Chia-Network/chia-blockchain/issues/336

正确方法:

C:\Users\Admin\.chia\beta-1.0b9\config\config.yaml 修改下面两个路径

```

full_node:
  database_path: d:/miner/chia/db/blockchain_v18.db
  enable_upnp: true
wallet:
  database_path: d:/miner/chia/wallet/db/blockchain_wallet_v18.db

```

C:\Users\Admin\AppData\Local\Chia-Blockchain\app-0.1.9\resources\app.asar.unpacked\daemon>chia.exe -r "d:\miner\chia" init

start wallet gui

在plot下设置temp和final路径

```
Starting plotting progress into temporary dirs: D:\miner\chia\plot_temp and D:\miner\chia\plot_final
Memo: a280cf675c7262cbe3745cf320d34a5d4a3399a8400fd3ca69263b6fe237e28a2582d3e58dd0bf30b8e14ae9aec04ff1a5908acb4de86fe42ef3756647d7a73278d62a645ffdbc95184da2c3c23cf5f6f8988732ca36be96222333a9dfa9728801a048fa6873e0e3531da7fed87b7c619caa9f7a85f43d80531f4e418e757d43
ID: 30afdf387f37f7a0a042dd594ac9b73cc28bfbb7c61bdf33f9fafa5e7aab5d95
Plot size is: 25
Buffer size is: 2097152000

Starting phase 1/4: Forward Propagation into "D:\\miner\\chia\\plot_temp\\plot-k25-2020-08-02-22-17-30afdf387f37f7a0a042dd594ac9b73cc28bfbb7c61bdf33f9fafa5e7aab5d95.plot.tmp" ... Sun Aug  2 22:17:46 2020
Wrote: 268
Computing table 1
```

其实最占空间的就是这个plot

https://github.com/Chia-Network/chia-blockchain/wiki/k-sizes