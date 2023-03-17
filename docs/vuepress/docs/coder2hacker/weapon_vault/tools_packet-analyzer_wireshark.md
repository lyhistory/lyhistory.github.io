
wireshark + [windows TCP viewer](https://learn.microsoft.com/en-us/sysinternals/downloads/tcpview)
wireshark + [linux netstat]

How to Decrypt SSL with Wireshark

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