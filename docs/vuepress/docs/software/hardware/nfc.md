---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

NFC: Near Field Communication

RFID： Radio-frequency identification

## 类型

### 磁条卡 magnetic card

磁条卡利用磁性材料记录信息，磁条卡在卡片背面一般会有黑色长条，如超市积分会员卡等。磁条卡的主要优点在于价格低廉、使用方便。但是，磁条卡也存在容易磨损和被其它磁场干扰，产生消磁现象从而导致无法使用的缺陷。

The core part of the magnetic stripe card is the magnetic stripe stuck on the card. The typical magnetic stripe card is the widely used bank card.

The biggest advantage of magnetic stripe cards is that they are easy to read and write, low in cost, and easy to promote.

The disadvantage is that it is easily worn out and interfered with by other magnetic fields. As a bank card, its safety is relatively poor. Many people in life have encountered the problem of magnetic stripe failure after multiple use, or being scratched by a hard object such as a key.


### 芯片卡
#### ID卡 / Identification card
习惯称 EM 卡、普通射频卡。最简单、最常见的射频卡就是低频125KHz的ID卡，这也是安防领域所说的ID卡，现在很多老式小区的门禁还是这种卡，**需要接触使用**，可以随便复制，但是手机不能模拟ID门禁卡。ID 卡具有只读功能，含有唯一 的 64b 防改写密码，其卡号在出厂时已被固化并保证在全球的唯一性，永远不能改变。其成本低，较多应用在低成本领域。它靠读卡器感应供电并读出存储在芯片 EEPROM 中的唯一卡 号，卡号在封卡前一次写入，封卡后不能更改。无源和免接触是该芯片两个最突出的特点。 它从读卡器接收射频能量，为芯片产生电源和时钟，并采用无线通信技术实现卡与读卡器间的无线通讯。 

The ID card is called the Identification Card. It is a non-writable proximity card with a fixed number, mainly SYRIS's EM format in Taiwan, and HIDMOTOROLA in the United States. Like as magnetic card, the ID card only uses the "card number". In addition to the card number, the card has no security function, and its "card number" is open and bare, So the ID card is "inductive magnetic card." The specification of the ISO standard ID card is: 85.5x54x0.80±0.04mm (height/width/thickness). There are also some thick, thin or special cards on the market.

#### IC卡/ integrated circuit card

门禁领域的普通IC卡是**非接触式** IC 卡(射频卡，工作在 13.56M 频率)的芯片全部封于卡基内，无暴露部分，通过无线电波或电磁场的感应来交换信息，通常用于门禁、公交收费、地铁收费等需要"一晃而过"的场合。如手机 sim 卡、门禁卡、员工卡、 会员卡都属于 IC 卡，但生活中，身份证被称为ID卡，其实本质上是IC卡。手机（具有NFC功能）模拟门禁卡需要同时满足两个条件：门禁IC卡是13.56MHZ的频率，同时无加密。非接触射频IC卡也叫做MF1卡，全称 mifare one 卡。因为以荷兰飞利浦公司生产的 MIFARE ONE PHILIPS IC S50 已经成为一种类似行业性的标准，所以市面上常把它称为 MF1原装卡片，而把兼容MF1S50 这款芯片的卡片叫做MF1兼容卡，如利用上海复旦公司的 FM11RF08 芯片生产的卡片，还有利用上海华 虹公司、上海贝岭公司、杭州士兰微、德国西门子（现改名为英飞凌）、美国 ISSI 公司等 的兼容 S50 芯片生产的卡片。 MF1卡内的集成电路包括加密逻辑电路和可编程只读存储器 EEPROM，加密逻辑电路可在一定程度上保护卡和卡中数据的安全，但只是低层次防护，无法防止恶意攻击。

 An IC card with a memory is also called a memory card or a memory card. An IC card with a microprocessor is also called Memory card or smart card. Memory cards can store large amounts of information; smart cards not only have memory capabilities but also have the ability to process the information.

 The IC card can store car expenses, telephone charges, subway ride fees, canteen dining expenses, highway tolls, shopping tours, and trade services conveniently.

##### IC卡：M1 card / NXP Mifare1系列
M1 is the abbreviation of chips produced by NXP, a subsidiary of Philips. At present, the company's M1 chip is compatible with domestic chips. In fact, M1 card also belongs to non-contact IC. card.

M1 card, the advantage is a multi-function card, can be read and write, the disadvantage is: the price is a little expensive, sensing distance is short, suitable for non-fixed consumption system, parking system, access control and attendance systems.

每张M1卡都有一个全球唯一的UID号，这个UID号保存在卡的第一个扇区（0扇区）的第一段（0段），也称为厂商段，其中前4个字节(就是前8位，两位一个字节)是卡的UID，第5个字节是卡UID的校验位，剩下的是厂商数据。并且这个段在出厂之前就会被设置了写入保护，只能读取不能修改，当然也有例外，有种叫UID卡的特殊卡，UID是没有设置保护的，**其实就是厂家不按规范生产的卡--后门卡**，M1卡出厂是要求要锁死UID的。

| 芯片名称 | 频率 | 可擦写 | 说明 |
| -- | -- | -- | -- |
| M1卡 | 13.56mhz | NO | 普通卡，0块（卡号块）出厂为锁定状态不可以用于复制，只能授权，物业卡均为此卡，俗称授权卡 |
| UID卡/GEN1 | 13.56mhz | YES | 经典复制卡，“魔术卡”，可以反复擦写 |
| CUID卡/GEN2 | 13.56mhz | YES | 防火墙IC复制卡，对于UID复制成功刷卡无效的情况下，可以使用此卡复制 |
| FUID卡/GEN2 | 13.56mhz | NO | 防火墙IC复制卡，对于CUID复制成功刷卡无效的情况下，可以使用此卡复制，一次性写入锁卡，不支持反复擦写 |
| UFUID卡 | 13.56mhz | NO | 功能与FUID一样，区别在于此卡支持手动锁卡，没有锁卡之前就是一张UID卡，可以理解为高级UID卡，锁卡后不支持擦写 |
| GTU卡 | 13.56mhz | YES | 可以自动复位数据的IC复制卡，用于滚动码防复制系统 |
| GDMIC卡 | 13.56mhz | YES | 与GTU功能一致，不同厂商 |

#### CPU卡

CPU卡芯片通俗地讲就是指芯片内含有一个微处理器，它的功能相当于一台微型计算机。人们经常使用的集成电路卡（IC 卡）上的金属片就是 CPU卡芯片，换言之，CPU卡是IC卡的一种，频率也是13.56MHZ。CPU 卡关键优势是加密技术，支持PBOC金融级别的安全标准，银行卡小额免密交易 。可适用于金融、保 险、交警、政府行业等多个领域，具有用户空间大、读取速度快、支持一卡多用等特点，并已经通过中国人民银行和国家商秘委的认证。CPU卡从外型上来说和普通 IC卡，射频卡并无差异，但是性能上有巨大提升，安全性和普通IC卡比，提高录入很多。通常CPU卡内含有随机数发生器，硬件DES、3DES加密算法等，配合操作系统即片上 COS，也称 SOC。

CPU 卡的硬件结构：由 CPU、内存和存储三大部分组成。COS操作系统一般是紧紧围绕着它所服务的智能卡的特点而开发的。 由于不可避免地受到了智能卡内微处理器芯片的性能及内存容量的影响，因此，COS 在很大程度上不同于我们通常所能见到的微机上的操作系统(例如 DOS、UNIX 等)。一种 COS 一般都只能应用于特定的某种(或者是某些)智能卡，不同卡内的 COS 一般是不相同的。

The advantage of the CPU card is the characteristics of large storage space, fast reading speed, support for multiple functions of one card, etc. The CPU card is not much different from the ordinary IC card and RF card in appearance, but its performance is greatly improved, compared with ordinary IC cards, the number of cards is increased. Generally, the CPU card contains random number generators, hardware DES, 3DES encryption algorithms, etc., and the COS operating system on the CPU card chip can achieve a financial-grade security level.


The CPU card can be used as an M1 card or an ID card;

The M1 card can be used as an ID card, but it cannot be used as a CPU card;

ID card can not be used as M1 card, nor can it be used as CPU card.

## 产品

https://www.wakdev.com/en/more/wiki/apps/nfc-chips-for-nfc-tools.html

MIFARE 系列：

    Mifare Ultralight，简称 MF0。
    Mifare Classic，简称 MF1
    Mifare Plus，简称 MF1P
    Mifare DESFire，简称 MF3

NTAG 是 NXP 的 NFC 卡系列，产品有：

    NTAG203 (144 bytes memory)
    NTAG210 (48 bytes memory)
    NTAG212 (128 bytes memory)
    NTAG213 (144 bytes memory)
    NTAG215 (504 bytes memory)
    NTAG216 (888 bytes memory)

NTAG 系列的卡符合 NFC Forum Type 2 Tag 标准，可以被所有 NFC 设备读取。兼容性最好。

Mifare 与 NTAG 系列的卡是什么关系？

NTAG 是符合 NFC 规范的卡。

Mifare 系列产品符合ISO/IEC 14443标准，但一些认证方式还是 NXP 公司专有的。比如 Mifare Ultralight C、Mifare Classic 等的认证方式。

Mifare Ultralight Nano/EV1 两个与 NTAG 很相似。

## 工具实践：

NFC Tool
NFC手机贴
手机钱包

nfc模块-PN532

### 手机复制M1卡

https://nfctool.cn/nfcphone_phone

华为钱包 + 蓝牙读卡器 + UID复制卡 + 原始母卡
复制母卡卡号
复制母卡数据

### 树莓派读写卡