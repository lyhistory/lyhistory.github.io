

## 电池组

## 太阳能电池组

[12v 18650锂电池组 三串二并 3S2P](https://www.youtube.com/watch?v=LqwXgibRrBQ)

[请问锂电池2并3串（共6节锂电池），有没有对应的防过冲过放保护ic](https://e2echina.ti.com/support/power-management/f/power-management-forum/21048/2-3-6-ic)

参考：微信视频号 村里的阿彪=》自制了一套物联网远程智能控制给植物浇水的设备

采集线
正负极线
线鼻子

3s 60A均衡保护板
锂电池青稞纸

防水接线盒

电池电量显示模块

散热风扇

充电输入端 接线鼻

接线排

快速充电口（圆形）或者12v全协议快充模块=》接线排=》恒压恒流的可升降压模块（防过充保护模块，充满自动停，调整电压到12.6v，如果加了二极管可以在13.5v左右）=》二极管=》锂电池组输入

电池电量显示模块=》开关=》电池组

降压模块（5v）=》供电给：esp32

继电器=》恒压恒流的可升降压模块（24v）=》水泵


## reverse polarity protection
加一个二极管
[Reverse Polarity Protection for Your Circuit, Without the Diode Voltage Drop.](https://www.instructables.com/Reverse-polarity-protection-for-your-circuit-with/)


[树莓派UPS：用充电宝改造的不间断电源](https://shumeipai.nxez.com/2018/12/13/ups-for-raspberry-pi.html)

[DIY Professional 18650 Battery Pack](https://www.instructables.com/DIY-Professional-18650-Battery-Pack/)
