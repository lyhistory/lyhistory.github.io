
wireshark + [windows TCP viewer](https://learn.microsoft.com/en-us/sysinternals/downloads/tcpview)
wireshark + [linux netstat]

How to Decrypt SSL with Wireshark

monitor mode

## CaptureFilters 
https://wiki.wireshark.org/CaptureFilters


capture network:
You can run Get-NetAdapter -IncludeHidden in Windows PowerShell and match up the Name property. The InterfaceDescription property is what will be displayed in the Device Manager.


## DisplayFilters
https://wiki.wireshark.org/DisplayFilters
https://unit42.paloaltonetworks.com/using-wireshark-display-filter-expressions/

protocol

http contains searchText

ip.addr == 192.0.2.1 and not tcp.port in {80 25}


```
not ssh and ip.addr == 1.1.1.1
```


Wireshark 手动修正乱序和重传
考虑到 TCP 乱序、重传场景的复杂性，在 TCP 分析中对于 TCP Spurious Retransmission、TCP Out-Of-Order、TCP Fast Retransmission、TCP Retransmission 等是在一起判断并标记相关类型的，而在不少场景还会有判断出错的问题，当然 Wireshark 考虑到这种情况，也有手动修正的选项，这正好也侧面证明了上面的说法，关于 TCP 乱序、重传的复杂性。

可以通过两种方式进行手工修正：
1. 选取 TCP 数据包之后，通过 Menu -> Edit -> Preferences -> Protocols -> TCP -> Force interpretation to selected packet(s) ，包括以下选项：0(none)、1(Out-of-Order)、2(Retransmission)、3(Fast Retransmission)、4(Spurious Retransmission)。

2. 选取 TCP 数据包之后，直接右键 -> Protocol Preferences -> Transmission Control Protocol -> Force interpretation to selected packet(s) ，同样包括以下选项：0(none)、1(Out-of-Order)、2(Retransmission)、3(Fast Retransmission)、4(Spurious Retransmission)。