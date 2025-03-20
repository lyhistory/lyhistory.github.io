
Basically an electric motor is a mechanical device that switches electric energy into mechanical energy by passing an electric current through a wire loop contained within a magnetic field. 

## 电机分类

　　1.按工作电源种类划分：可分为直流电机和交流电机。

　　1)直流电动机按结构及工作原理可划分：无刷直流电动机和有刷直流电动机。

　　有刷直流电动机可划分：永磁直流电动机和电磁直流电动机。

　　电磁直流电动机划分：串励直流电动机、并励直流电动机、他励直流电动机和复励直流电动机。

　　永磁直流电动机划分：稀土永磁直流电动机、铁氧体永磁直流电动机和铝镍钴永磁直流电动机。

　　2)其中交流电机还可划分：单相电机和三相电机。

　　2.按结构和工作原理可划分：可分为直流电动机、异步电动机、同步电动机。

　　1)同步电机可划分：永磁同步电动机、磁阻同步电动机和磁滞同步电动机。

　　2)异步电机可划分：感应电动机和交流换向器电动机。

　　感应电动机可划分：三相异步电动机、单相异步电动机和罩极异步电动机等。

　　交流换向器电动机可划分：单相串励电动机、交直流两用电动机和推斥电动机。

　　3.按起动与运行方式可划分：电容起动式单相异步电动机、电容运转式单相异步电动机、电容起动运转式单相异步电动机和分相式单相异步电动机。

### 普通电机

### 减速电机
TT电机/310电机/370电机选型对比原创

#### TT马达减速电机
减速比=》扭矩

电压

电流

### 步进电机

步进电机上的“A+A-B+B-”就是电机的驱动线，“A+”、“ A-”代表一相，“B+”、“B-”代表另一相。

步进电机的定子是几个串联的线圈构成的磁体。有两个线圈绕组，每个线圈两个头，出线一般是四条线标记为A+，A-，B+，B-。

A相与B相是不通的，用万用表很容易区分出来，至于各相的+-出线实际是不用考虑的，任意一相正负对调电机将反转。

步进驱动器A+A-B+B-控制步进电机运行。两相四线电机一般采用可逆驱动，所以线圈有正负。

### 伺服电机

### 舵机

### Solenoid Lock
 A solenoid, universally used in all types of motors from power door locks to starters and is simply a round coil of wire that's been insulated and used to create a magnetic field in the atmosphere of this current.

## motor drive

为什么要驱动

典型的 Arduino 开发板信号引脚每个只能输出大约 20mA 的电流，这远远不足以驱动电机。

那么，如何通过 Arduino 控制电机呢？这时，一个关键组件——电机驱动器就派上用场了。可以把电机驱动器看作是 Arduino 和电机之间的桥梁。它接收来自 Arduino 的低电流控制信号，将其放大后传送给电机，驱动电机旋转。
https://docs.sunfounder.com/projects/galaxy-rvr/zh-cn/latest/lesson4_motor.html

+ L9110
+ L293D
+ L298
  - L298P 
  - L298N motor driver

### L298N 

#### pinout
The motor driver has a two-terminal block on each side for each motor. OUT1 and OUT2 at the left and OUT3 and OUT4 at the right.

- OUT1: DC motor A + terminal
- OUT2: DC motor A – terminal
- OUT3: DC motor B + terminal
- OUT4: DC motor B – terminal

At the bottom, you have a three-terminal block with +12V, GND, and +5V. The +12V terminal block is used to power up the motors. The +5V terminal is used to power up the L298N chip. However, if the jumper is in place, the chip is powered using the motor’s power supply and you don’t need to supply 5V through the +5V terminal.

Important: despite the +12V terminal name, you can supply any voltage between 5V and 35V (but 6V to 12V is the recommended range).

Note: if you supply more than 12V, you need to remove the jumper and supply 5V to the +5V terminal.

In summary:

- +12V: The +12V terminal is where you should connect the motor’s power supply
- GND: power supply GND
- +5V: provide 5V if jumper is removed. Acts as a 5V output if jumper is in place
- Jumper: jumper in place – uses the motor power supply to power up the chip. Jumper removed: you need to provide 5V to the +5V terminal. If you supply more than 12V, you should remove the jumper

At the bottom right you have four input pins and two enable terminals. The input pins are used to control the direction of your DC motors, and the enable pins are used to control the speed of each motor.

- IN1: Input 1 for Motor A
- IN2: Input 2 for Motor A
- IN3: Input 1 for Motor B
- IN4: Input 2 for Motor B
- EN1: Enable pin for Motor A
- EN2: Enable pin for Motor B
There are jumper caps on the enable pins by default. You need to remove those jumper caps to control the speed of your motors. Otherwise, they will either be stopped or spinning at the maximum speed.

**Enable pins**

The enable pins are like an ON and OFF switch for your motors. For example:

- If you send a HIGH signal to the enable 1 pin, motor A is ready to be controlled and at the maximum speed;
- If you send a LOW signal to the enable 1 pin, motor A turns off;
- If you send a PWM signal, you can control the speed of the motor. The motor speed is proportional to the duty cycle. However, note that for small duty cycles, the motors might not spin, and make a continuous buzz sound.

**Input pins**

The input pins control the direction the motors are spinning. Input 1 and input 2 control motor A, and input 3 and 4 control motor B.

- If you apply LOW to input1 and HIGH to input 2, the motor will spin forward;
- If you apply power the other way around: HIGH to input 1 and LOW to input 2, the motor will rotate backwards. Motor B can be controlled using the same method but applying HIGH or LOW to input 3 and input 4.

**Controlling 2 DC Motors – ideal to build a robot**

If you want to build a robot car using 2 DC motors, these should be rotating in specific directions to make the robot go left, right, forward, or backward.

For example, if you want your robot to move forward, both motors should be rotating forward. To make it go backward, both should be rotating backward.

To turn the robot in one direction, you need to spin the opposite motor faster. For example, to make the robot turn right, enable the motor at the left, and disable the motor at the right.

[ESP32 with DC Motor and L298N Motor Driver – Control Speed and Direction](https://randomnerdtutorials.com/esp32-dc-motor-l298n-motor-driver-control-speed-direction/)


#### 原理

The L298N motor driver acts as an interface between your power supply and motors. It doesn’t have a fixed current requirement because it’s determined by the load (motors) connected to it. However, the L298N has voltage requirements because it needs a certain voltage to operate.

+ Motor Supply Voltage (V_s):
The L298N requires a voltage supply for the motors (the V_s pin).
The V_s pin determines the voltage you want to apply to the motors.
Motors have a voltage rating (e.g., 12V), and the V_s pin must be powered with a voltage that matches the motor's requirements.

The current drawn by the motors depends on the voltage applied to them and the load on the motor (e.g., whether it's moving freely or under a heavy load).
The motor’s current draw can vary significantly based on the torque required by the load.

+ Logic Supply Voltage (Vcc):
  The Vcc pin on the L298N powers the logic circuits inside the L298N that control the motors' speed, direction, and operation.
  The L298N can use a 5V supply for the logic (from the 5V pin of the microcontroller or from an external 5V power source). This pin does not require a lot of current—typically 50mA to 100mA for the logic circuits.
  If you don’t provide a 5V supply to the Vcc pin, the L298N will still work because it can generate 5V internally from the 12V (motor supply) using its built-in voltage regulator.

The L298N motor driver actually has a built-in 5V regulator that allows it to function even when the 5V pin is not connected to anything. Here's how it works:

1. How the L298N Works with Only the 12V Pin Connected:

When you connect a 12V power supply to the 12V (V_s) pin, the L298N uses this 12V input to power the motor outputs (OUT1, OUT2, OUT3, OUT4) and its internal logic circuit via a built-in voltage regulator.

The built-in 5V regulator in the L298N can step down the 12V (or any higher voltage within the motor supply range, typically 4.5V to 46V) to supply 5V to the internal logic.

This is why the L298N can function without the 5V pin being connected to an external 5V source. The L298N generates its own 5V internally from the 12V input.

2. Why the 5V Pin is Optional for Powering the L298N:

The 5V pin on the L298N is connected to the output of the internal voltage regulator. This is a convenient way to power the L298N's logic circuits if you need to use an external 5V power supply.
For example, you might want to connect this pin to the 5V pin of an Arduino or ESP32 if you want to power the microcontroller from the L298N.(Current Limitations: The internal 5V regulator is limited in current output, usually around 500mA. )
If you don't use the 5V pin, the L298N will still work as long as the 12V supply is connected, since the internal regulator will still power the logic circuit.

3. Current Requirements
+ Motor Current Requirements (For V_s Pin)
  The most important factor for selecting a power supply is the current draw of the motors you plan to drive with the L298N.
  The L298N can drive motors that draw significant amounts of current, especially when under load.
  The current drawn by the motor is determined by its voltage and load. For example, a small DC motor might draw 100mA at idle, but could draw 1A or more under load.
  Current Limits: The L298N can handle up to 2A per motor (4A max for both motors), but this depends on your motor's current draw and the specific model of L298N you're using.
  So, for the motor power supply (V_s), your power supply must be able to supply enough current to meet the demands of your motors. For example:
  - For low-power motors: A 5V-12V power supply rated for at least 2A (depending on the number of motors and their load).
  - For high-power motors: You may need a 12V-24V power supply rated for 5A or more if you're driving motors that draw a lot of current under load.

+ Logic Power (Vcc Pin)
  The Vcc pin of the L298N, which powers the logic circuits, typically requires 5V.
  Current requirements for the logic circuit are relatively low — typically around 50mA to 100mA.
  If you're powering the L298N's logic from the 5V pin of an external microcontroller (e.g., ESP32, Arduino), the current demand here is negligible compared to the motor current.

4. Important Considerations:
+ Power Supply Wattage: 
  Ensure your power supply has a high enough wattage to supply the required voltage and current. The total wattage P=V×I. For example, a 12V, 5A power supply would provide 60W of power.
+ Overcurrent Protection: 
  It's a good idea to use a power supply with overcurrent protection to avoid damage to your components if the current draw exceeds safe limits.
+ Heat Dissipation: 
  The L298N can get hot, especially if the current draw is near its maximum (2A per motor), so ensure adequate cooling or use a heat sink.

### RZ7889

###  L9110S
双驱动

[Comprehensive Guide to the L9110S Motor Driver: Technical Insights and Applications](https://www.ic-components.com/blog/comprehensive-guide-to-the-l9110s-motor-driver-technical-insights-and-applications.jsp)

### TB6612FNG 
[Simple 2 Wheel ESP32 Robot Using the TB6612FNG Dual Motor Controller](https://www.instructables.com/Simple-2-Wheel-ESP32-Robot-Using-the-TB6612FNG-Dua/)