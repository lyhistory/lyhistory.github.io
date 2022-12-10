---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

NFC: Near Field Communication

RFID： Radio-frequency identification

## 类型

### magnetic card


### ID卡 / Identification card
习惯称 EM 卡、普通射频卡。最简单、最常见的射频卡就是低频125KHz的ID卡，这也是安防领域所说的ID卡，现在很多老式小区的门禁还是这种卡，需要接触使用，可以随便复制，但是手机不能模拟ID门禁卡。ID 卡具有只读功能，含有唯一 的 64b 防改写密码，其卡号在出厂时已被固化并保证在全球的唯一性，永远不能改变。其成本低，较多应用在低成本领域。它靠读卡器感应供电并读出存储在芯片 EEPROM 中的唯一卡 号，卡号在封卡前一次写入，封卡后不能更改。无源和免接触是该芯片两个最突出的特点。 它从读卡器接收射频能量，为芯片产生电源和时钟，并采用无线通信技术实现卡与读卡器间的无线通讯。 

The ID card is called the Identification Card. It is a non-writable proximity card with a fixed number, mainly SYRIS's EM format in Taiwan, and HIDMOTOROLA in the United States. Like as magnetic card, the ID card only uses the "card number". In addition to the card number, the card has no security function, and its "card number" is open and bare, So the ID card is "inductive magnetic card." The specification of the ISO standard ID card is: 85.5x54x0.80±0.04mm (height/width/thickness). There are also some thick, thin or special cards on the market.

### IC卡/ integrated circuit card

门禁领域的普通IC卡是非接触式 IC 卡(射频卡，工作在 13.56M 频率)的芯片全部封于卡基内，无暴露部分，通过无线电波或电磁场的感应来交换信息，通常用于门禁、公交收费、地铁收费等需要"一晃而过"的场合。如手机 sim 卡、门禁卡、员工卡、 会员卡都属于 IC 卡，但生活中，身份证被称为ID卡，其实本质上是IC卡。手机（具有NFC功能）模拟门禁卡需要同时满足两个条件：门禁IC卡是13.56MHZ的频率，同时无加密。非接触射频IC卡也叫做MF1卡，全称 mifare one 卡。因为以荷兰飞利浦公司生产的 MIFARE ONE PHILIPS IC S50 已经成为一种类似行业性的标准，所以市面上常把它称为 MF1原装卡片，而把兼容MF1S50 这款芯片的卡片叫做MF1兼容卡，如利用上海复旦公司的 FM11RF08 芯片生产的卡片，还有利用上海华 虹公司、上海贝岭公司、杭州士兰微、德国西门子（现改名为英飞凌）、美国 ISSI 公司等 的兼容 S50 芯片生产的卡片。 MF1卡内的集成电路包括加密逻辑电路和可编程只读存储器 EEPROM，加密逻辑电路可在一定程度上保护卡和卡中数据的安全，但只是低层次防护，无法防止恶意攻击。

 An IC card with a memory is also called a memory card or a memory card. An IC card with a microprocessor is also called Memory card or smart card. Memory cards can store large amounts of information; smart cards not only have memory capabilities but also have the ability to process the information.

 The IC card can store car expenses, telephone charges, subway ride fees, canteen dining expenses, highway tolls, shopping tours, and trade services conveniently.

### M1 card

 Another kind of card with similar function to IC card is called M1 card. M1 is the abbreviation of chips produced by NXP, a subsidiary of Philips. At present, the company's M1 chip is compatible with domestic chips. In fact, M1 card also belongs to non-contact IC. card.


M1 card, the advantage is a multi-function card, can be read and write, the disadvantage is: the price is a little expensive, sensing distance is short, suitable for non-fixed consumption system, parking system, access control and attendance systems.

### CPU卡

CPU卡芯片通俗地讲就是指芯片内含有一个微处理器，它的功能相当于一台微型计算机。人们经常使用的集成电路卡（IC 卡）上的金属片就是 CPU卡芯片，换言之，CPU卡是IC卡的一种，频率也是13.56MHZ。CPU 卡关键优势是加密技术，支持PBOC金融级别的安全标准，银行卡小额免密交易 。可适用于金融、保 险、交警、政府行业等多个领域，具有用户空间大、读取速度快、支持一卡多用等特点，并已经通过中国人民银行和国家商秘委的认证。CPU卡从外型上来说和普通 IC卡，射频卡并无差异，但是性能上有巨大提升，安全性和普通IC卡比，提高录入很多。通常CPU卡内含有随机数发生器，硬件DES、3DES加密算法等，配合操作系统即片上 COS，也称 SOC。

CPU 卡的硬件结构：由 CPU、内存和存储三大部分组成。COS操作系统一般是紧紧围绕着它所服务的智能卡的特点而开发的。 由于不可避免地受到了智能卡内微处理器芯片的性能及内存容量的影响，因此，COS 在很大程度上不同于我们通常所能见到的微机上的操作系统(例如 DOS、UNIX 等)。一种 COS 一般都只能应用于特定的某种(或者是某些)智能卡，不同卡内的 COS 一般是不相同的。

The advantage of the CPU card is the characteristics of large storage space, fast reading speed, support for multiple functions of one card, etc. The CPU card is not much different from the ordinary IC card and RF card in appearance, but its performance is greatly improved, compared with ordinary IC cards, the number of cards is increased. Generally, the CPU card contains random number generators, hardware DES, 3DES encryption algorithms, etc., and the COS operating system on the CPU card chip can achieve a financial-grade security level.


The CPU card can be used as an M1 card or an ID card;

The M1 card can be used as an ID card, but it cannot be used as a CPU card;

ID card can not be used as M1 card, nor can it be used as CPU card.

## 工具：
NFC Tool
如果门禁读卡器不支持手机或者手环模拟的卡，就只能使用NFC手机贴


