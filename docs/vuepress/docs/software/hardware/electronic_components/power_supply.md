## 电源分类
+ 蓄电池
  包括干电池、铅酸电池、锂电池
+ 开关电源
  包括DC/DC、AC/DC
+ 线性电源
  包括集成线性稳压器、桌面式线性电源

家用电 工业电（三相电）
## mAh和Wh

现在移动设备和照相机大多使用的是锂电池，而消费者大多数是不太懂这些电池标识上的容量标识的，比如mAh和Wh代表什么都是不懂的。其实学会看懂这些标识很简单，也非常实用。有一次我的朋友看着我桌面的摄像机电池说“看你摄像机电池的比我移动电源大这么多，怎么容量就只大一点点。”这个移动电源是5200mAh，大块头的摄像机电池只有6600mAh。论体积，摄像机锂电池至少是移动电源的两倍，但从数字上看6600绝没有5200的两倍，难道这块电池里面是空的？绝没有。里面放的是砖头？保证不是。其实如果这两块电池同样是手机电池的话，那他们的容量大小还是可以用mAh来进行比较的。但如果他们不是同类型的产品的话，直接这么对比可能就错了。它们不都是锂电池吗？不都一样吗？

为什么不可以比？虽然同样是锂电池，其实这两块电池的电压是不一样的，也就是由于电压的原因，所以单纯比mAh数字的大小是没有可比性的。通俗点讲电池容量的物理意思就是指该电池能够容纳或释放多少电荷，我们常用Ah（安时）或mAh（毫安时）来表示。根据电流的定义式：I=Q/t ，可知Q=It，电流I的单位时mA（毫安），t代表的是时间，单位hour(时)，因此我们的电池容量单位就为mAh。也就是说如果一块电池容量表示1000mAh，如果他工作时的电流时100mA，则理论上可以供电使用10小时。不过从公式中我们可以看到Q=It，并未涉及到电压，因此这一单位只能说明电池内部能够容纳多少库仑的电荷。但不能说明这个电池能够做多少的功， 以及电池可提供的至大功率是多少。不同类型的产品的工作电压是不同的。因此我们有常常会看到在mAh的旁边还会有一个以Wh为单位的数字。电池可做的功 W=UIt=UQ，电压U *电流I的单位为W（瓦），因此电池里的W用Wh来表示，它表示电池能够做多少的功。Wh它是和电压、电流、时间成正比关系的量。而mAh通常作为电池充、放电的指标，它是和电池的充（放）电电流、时间成正比的指标，要让它和Wh有可比性或可换算性，还必须知道电池的电压。简单来说Wh=mAh/1000*电压。而刚才上面说的6600mAh的电池的电压为14.4V，14.4*6600=95.04Wh，那们他全部释放可做的功就是6.6*14.4*3600=342144焦耳的功。而一般手机电压为3.7，因此上面的5200mAh移动电源理论上可做的功为3.7*5200=19.24WH，3.7*5.2*3600=69264焦耳的功。这样的对比讲解大家都明白了吧，所以以后买锂离子电池时一定要注意电压


一般干电池的额定容量大约是：一号电池2.5Ah；二号电池1.5Ah；五号电池500mAh；7号电池200mAh


## 升压电路原理 5V电源如何上升到12V？
boost

https://www.bilibili.com/video/BV1G34y1d7m4/?spm_id_from=autoNext&vd_source=3c7db6c464ce22629be3830e049bb553

## UNREGULATED POWER SUPPLY 太阳能和稳压模块

稳压器或电压调节器（英语：voltage stabilizer或voltage regulator

## 充电宝

[充电宝原理是什么?为何它能控制5v输出,1A电流呢?](https://www.zhihu.com/question/338889605)

## 电源适配器
[同样标称电压的电源，输出电流不同，能不能用在同一台笔记本上。基本的原则是大标称电流的电源可以代替小标称电流的电源](http://www.juda.cn/news/140594.html)

## benchtop supply 可调电源
产品/diy模块
实验
修手机/电脑

面包板+香蕉插头 banana plugs/Banana Jacks

## MH Breadboard Power Supply Module 面包板电源模块
https://shequ.stmicroelectronics.cn/thread-626548-1-1.html

![](/docs/docs_image/software/hardware/modules/breadboard_power_supply_module_mb102_pinout.jpg)

+ DC Input jack & USB Input jack: The DC power port and USB-A connector are provided to the module to power it up.
+ Power Switch & LED: A switch is embedded to provide extra control along with an LED to indicate the energizing of the module.
+ Left/Right rail jumper (voltage selection): The mb102 breadboard supply module is capable of giving out 3.3 volts or 5 volts to breadboard rails. They can be operated individually.
+ Berg Headers/Output Headers: The berg headers can be used to output power to other devices as well.

https://microcontrollerslab.com/mb102-breadboard-power-supply-module-pinout-and-how-to-use-it/

## 锂电池扩展板 18650 Battery Shields 
https://www.google.com/search?q=esp32+8650+Lithium+Battery+Shield&oq=esp32+8650+Lithium+Battery+Shield&aqs=chrome..69i57.4848j0j4&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:6e93affb,vid:m7LqbMuVaj4