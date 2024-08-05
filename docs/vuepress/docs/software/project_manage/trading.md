期货 量化

TradeBlazer
http://www.tradeblazer.net/

开拓者 TBPlus

从Tick到K线：数据转换和计算方法 https://blog.alltick.co/from-tick-data-to-kline-chart/#/

market data vs orders book
Depth of market data is also known as the order book since it consists of a list of pending orders for a security or currency. The data in the book is used to determine which transactions can be processed.

交易系统开发系列：
https://blog.51cto.com/quantfabric/2536010?articleABtest=0#/


## 技术点
### 单线程无锁队列
LMAX disruptor

### 可靠的UDP

### Kernel bypass - RDMA（Remote Direct Memory Access）
这种技术是一种最早应用于高性能计算领域的网络通讯协议，目前已在数据中心逐渐普及。RDMA允许用户程序绕过操作系统内核（CPU），直接和网卡交互进行网络通信，从而提供高带宽和极小时延。所以RDMA网卡的工作原理是，与传统的TCP/CP网卡相比，RDMA网卡省略了内核（CPU）的参与，所有数据的传输直接从应用程序到达网卡。
The traditional TCP/IP network communication uses the kernel to send messages. This communication mode has high data movement and data replication overheads. The RDMA technology is developed to solve the data processing latency on the server side during network transmission. 
https://community.fs.com/article/roce-vs-infiniband-vs-tcp-ip.html

https://core.vmware.com/resource/basics-remote-direct-memory-access-rdma-vsphere#section2

RDMA (Remote Direct Memory Access) allows data to be transferred directly between the memory of two computers without involving the CPU or the operating system of either system in the data path. Here's what this means in detail:

+ Bypassing the CPU: RDMA minimizes CPU involvement in data transfer operations. Traditional data transfer methods require the CPU to process data and move it between the memory and the network interface. **With RDMA, once the transfer is set up, the CPU is not involved in the actual data movement, freeing it up for other tasks.**

+ Bypassing the Operating System: RDMA also reduces the involvement of the operating system in data transfers. In conventional data transfer, the operating system is heavily involved in handling interrupts, context switching, and managing buffers. RDMA allows the network interface card (NIC) to handle these operations directly, thus bypassing the OS for data movement operations.

+ Direct Interaction with the Network Card: RDMA-capable NICs (also known as RNICs) can directly read from and write to the memory of remote machines using RDMA. This means that data can be transferred directly between the NIC and the memory of the target system, bypassing the CPU and the operating system's networking stack.

When I mentioned "once the transfer is set up," I referred to the initial setup phase required for RDMA operations before the actual data transfer can occur. Here's a detailed explanation of how this setup works and the concepts involved:

+ RDMA Communication Channels:
    - Queue Pairs (QPs): RDMA communication relies on entities called Queue Pairs. A Queue Pair consists of two queues: a Send Queue and a Receive Queue. Both the source and destination systems have their own QPs.
    - Connection Setup: Similar to socket connections, RDMA requires a connection setup phase. This involves creating and exchanging Queue Pair information between the communicating systems. This setup phase uses a protocol like the InfiniBand Verbs API, RoCE (RDMA over Converged Ethernet), or iWARP (Internet Wide Area RDMA Protocol).
+ Memory Registration:
    - Before data can be transferred, the memory regions involved in the transfer must be registered with the RDMA NIC. This registration informs the NIC about the memory addresses that will be used for RDMA operations, ensuring the NIC has the necessary permissions to access these memory areas.
+ Establishing Communication:
    - Address Resolution: The RDMA-capable NICs need to resolve the network addresses of the systems involved. This is somewhat similar to the address resolution in TCP/IP networks.
    - Queue Pair Connection: After address resolution, the Queue Pairs on both systems need to be connected. This involves exchanging Queue Pair numbers and other connection parameters.
+ Data Transfer Operations:
    - RDMA Read/Write: Once the QPs are connected and memory is registered, actual data transfer can begin. RDMA supports operations like RDMA Read and RDMA Write, allowing direct memory access between the systems.
    - Send/Receive Operations: In addition to direct memory access, RDMA also supports send/receive operations, which involve placing data in the remote system’s receive queue.

Steps to Understand RDMA Setup and Transfer
+ Initialize RDMA Resources:
    - Allocate and register memory buffers.
    - Create Queue Pairs.
+ Establish Connections:
    - Resolve network addresses.
    - Exchange Queue Pair information.
    - Connect Queue Pairs.
+ Perform Data Transfer:
    - Use RDMA Read/Write or Send/Receive operations.
    - The NICs handle data movement directly between memory regions.

Analogy with Sockets - While RDMA setup is more complex, it can be likened to establishing a socket connection in the following way:
+ Socket Creation: Similar to creating Queue Pairs.
+ Address Binding: Similar to resolving addresses and exchanging Queue Pair information.
+ Connection Establishment: Similar to connecting Queue Pairs.
+ Data Transfer: Similar to sending and receiving data through a socket, but with RDMA, data bypasses the CPU and OS.

Key Differences
+ Efficiency: RDMA provides lower latency and higher throughput by bypassing the CPU and OS.
+ Memory Registration: RDMA requires explicit memory registration.
+ Complexity: RDMA setup is more complex due to the need for Queue Pairs and memory registration.

