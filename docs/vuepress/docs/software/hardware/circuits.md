## 基本概念 Basic Electrical Concepts:

+ Voltage (V) 
    is the potential difference that drives current through a circuit. It’s like the pressure in a water pipe that pushes the water.
    Voltage is like the force that moves electrons (current) through a conductor.
    Voltage is fixed by the power supply and must match the requirements of your circuit.
+ Current (I) 
    is the flow of electrons through a conductor. It’s like the amount of water flowing through a pipe. Current depends on the load (resistance) in the circuit and how much voltage is applied.

+ Power and Load
    In electrical terms, the "load" refers to any component or device in a circuit that consumes electrical power. It is typically something that resists the flow of electrical current and converts electrical energy into another form of energy (e.g., light, motion, heat).
    The load could be:
    - A motor (e.g., DC motor, stepper motor) The motor "resists" the flow of current by creating torque or rotational force.
    - A light bulb (resistive load) The light bulb "resists" current flow, converting electrical energy into light and heat.
    - A resistor (purely resistive load) A resistor restricts the flow of current by offering resistance.
    - Any other component: sensors, actuators, etc., that draw current and convert it into a different form of energy.
    The load determines the current flow in the circuit. The current depends on:
    - The voltage applied to the load.
    - The resistance of the load (according to Ohm's Law: I= U/R , where R is the resistance).
    In the case of a motor, the load would refer to how much mechanical force the motor is working against, such as:
    - The torque the motor needs to apply.
    - The friction or inertia the motor is trying to overcome.
    If the motor is spinning freely, it draws less current (low load). However, if the motor is under a heavy load (e.g., lifting something), it will require more current.This increased current results in more power being consumed by the motor, which is calculated using the formula:
    P = U * I (Power Formula)
    - P is the power (measured in watts, W).
    - U (or V) is the voltage (measured in volts, V) applied across the load.
    - I is the current (measured in amperes, A) flowing through the load.
    Let’s say you have a 12V DC motor and you're using the L298N motor driver to control it.

    If you apply 12V to the motor and it draws 1A of current, the motor consumes 12V×1A=12W of power.
    This is the power requirement for the motor.
    If the motor is under a heavy load, the motor might draw 2A of current at the same voltage (12V). Now, the power consumed would be 12V×2A=24W.

    The concept of load is applicable to all electrical components, not just motors:
    For a resistor, the load is the resistance value.
    Example: If you have a 10Ω resistor across a 5V supply, the current through the resistor will be I= 5V/10Ω =0.5A.The power dissipated by the resistor is P=5V×0.5A=2.5W, which will be converted into heat.

+ Resistance (R) and Energy Conversion
    Resistance is a property of a material or component that opposes the flow of electrical current. It's like the friction in a pipe that resists the flow of water. The higher the resistance, the harder it is for current to flow through the material or component.

    When a current flows through a resistive material (like a resistor or a motor's windings), electrical energy is converted into another form of energy (like heat, light, or motion). The amount of energy converted depends on the amount of resistance in the path and the amount of current flowing.

    Here’s how this works in different scenarios:  
    1. Resistance and Heat (Joule Heating)
    In purely resistive components (like a resistor), the electrical energy is converted into heat due to the resistance. This is known as Joule heating.

    Example: Resistor

    Let’s consider a simple resistor in a circuit. If you apply 5V across a 100Ω resistor, according to Ohm's law  , the current flowing through the resistor will be: I= 5V/100Ω=0.05A
    The power dissipated by the resistor as heat is given by: P=U×I=5V×0.05A=0.25W
    This 0.25 watts of electrical power is converted into heat in the resistor, causing it to warm up.
    In this case, the resistor resists the flow of current, and in doing so, it converts electrical energy into thermal energy (heat). The more the resistance, the more heat is generated, assuming the same amount of current is flowing.

    High resistance means the component will generate more heat because it resists the flow of electrons more, which results in more energy being dissipated as heat.

    2. Resistance and Motion (Motor)
    In motors, resistance exists within the windings of the motor, and when current flows through the windings, it creates a magnetic field that interacts with the rotor, causing it to turn and produce mechanical motion.

    However, unlike resistors, motors are not purely resistive components; they also rely on electromagnetic induction to generate motion. But even in motors, resistance plays a role in energy conversion.

    Example: DC Motor
    - A DC motor has windings (coils of wire) through which current flows. As current flows through these windings, resistance in the motor windings causes some of the electrical energy to be converted into heat (like the heat generated in a resistor).
    - The remaining electrical energy is converted into mechanical motion. The amount of current flowing through the motor is influenced by the load (how heavy the object the motor is driving is), and the resistance in the motor windings.
    - Higher resistance in the windings leads to more energy being lost as heat, meaning the motor becomes less efficient at converting electrical energy into mechanical motion.
    In this case, resistance still resists the flow of electrical current, but the current also creates a magnetic field in the motor that causes the rotor to spin, which results in motion.

    3. Resistance and Light (Light Bulb)
    A light bulb is another example where resistance plays a role in converting electrical energy into another form—light. In the filament of a traditional incandescent light bulb, the resistance is so high that it causes the filament to heat up to a point where it glows and emits light.

    Example: Incandescent Light Bulb
    - In an incandescent light bulb, electric current flows through the tungsten filament, which has high resistance.
    - As the current flows through the filament, the resistance causes the filament to heat up, and at a certain temperature, the filament emits light (this is called incandescence).
    - Some of the electrical energy is converted into heat (due to resistance), but a small portion is converted into light.
    Here, resistance causes the electrical energy to be converted into heat, but because of the high temperature of the filament, a portion of the energy is also emitted as light.


**Questions:**Why does a motor draw more current when it is under a heavy load, even though the resistance may be the same or even increase when the motor is powered by a constant voltage source ?

**Answers:**
The confusion arises from the mechanical load the motor faces. When a motor is under load, the **mechanical resistance** increases, but this does not directly translate to a simple increase in **electrical resistance** as per Ohm’s law. Here's how it works:

Back EMF([What is Back EMF & what is its significance ](https://www.youtube.com/watch?v=JgnPSOUoVJI&t=321s)): In a motor, there is also something called back electromotive force (back EMF), which is the **voltage generated by the motor itself** as it turns. The faster the motor spins, the higher the back EMF.
When the motor is under load, it slows down a bit, and the back EMF decreases. This allows more current to flow because the motor is not opposing the voltage from the power supply as much.
Back EMF essentially opposes the applied voltage. When the motor slows down under load, the back EMF decreases, so more current can flow through the motor to provide the necessary torque.

The circuit current (the current provided to the motor) and the internal current (the current used within the motor to generate magnetic fields and torque) are related, but back EMF plays a significant role in regulating how much current the motor draws(is there physic meanings : 1. the electrons flow fast/slow 2. the number of electrons flow over one point per second).



## 电路公式

欧姆定律计算

计算多个串联或并联连接的电阻的总阻值

计算多个串联或并联连接的电容器的总容值

电阻分压计算

电流分流器-电阻计算

电抗计算

RC时间常数计算

LED串联电阻器计算器

dBm转W换算

电感换算
电容器换算表

电池续航时间=电池容量(mAh)/负载电流(mA)

PCB印制线宽度计算

功率W(P)=电流A(I)*电压V(U)

Q=It

W=UIt=UQ

输入功率 = 输入电压 × 输入电流 > 输出功率=输出电压 × 输出电流
https://www.zhihu.com/question/358163960/answer/913684940


怎么理解电源的输出功率和输入功率?

既然题主问的是高中物理，那么就只在高中物理的框架里谈谈吧。我觉得题主提到对的问题应该属于《选修3-1》里的恒定电流这一章出现的问题，在这一章提到的电源是抽象的电源，也就是从各种具体的电源（例如干电池、蓄电池、发电机等等）中找到它们的共同点——它们都是将其他形式能转换为电能的装置。为了描述电源这种能量转换能力的大小，教材中引入了“电动势”这个概念，而且由于这章讨论的是恒定电流，所以同一个电源的电动势被认为是个不变量；而做为一个电源，它也是一个导体，同样也有电阻，电源的电阻我们称为“内阻”，当然同一个电源的内阻也是不变得。好了，既然讨论的是功率的问题，那么我们就从闭合电路中的功和能量转化角度来考虑：首先，电源利用非静电力做功，将其他形式能转化为电能，这就是电源的总功率；由于电路闭合，在电路中产生了电流，电流通过内阻，会将一部分电能转化为焦耳热，这部分我们一般称为电源的内耗或者电源的热功率，电流通过外电路的用电器时做功，又将其余电能转化成为其他形式能，这部分就是电源的输出功率了。也即：电源的总功率=电源热功率+电源输出功率；电源的输出功率=外电路总功率=路端电压*总电流。其实根据能量守恒定律，电源输入到用电器的功率和用电器输出的总功率肯定是相等的，用电器的输入功率和它的输出总功率也肯定是相等的。但容易出错的地方就是如果这个用电器是将电能转化为了多种不同形式的能量，那么它的输出总功率是将这些不同形式能量合计之后，比如电动机。电动机是将电能转化为机械能，同时还有一部分焦耳热。但习惯上，我们只把机械能那部分称为电动机的“输出功率”，所以对于电动机来说：输入功率=输出功率+热功率。虽然题目中对电动机很少用“消耗的功率”这个说法，但我们也应该知道，电动机消耗的功率=输入功率而对于纯电阻用电器来说，由于它只将电能转化为焦耳热，所以它消耗的功率、输入功率和输出功率是相等的。

## 常见电路学习

### pwm

Pulse Width Modulation (PWM) is a technique where a digital signal is turned on and off very quickly. By varying the amount of time the signal is “on” versus “off” (this is called the duty cycle), you can control the power delivered to a device. This is very useful for controlling things like motor speed or LED brightness.

PWM, or pulse width modulation is a technique which allows us to adjust the average value of the voltage that’s going to the electronic device by turning on and off the power at a fast rate. The average voltage depends on the duty cycle, or the amount of time the signal is ON versus the amount of time the signal is OFF in a single period of time.
[L298N Motor Driver – Arduino Interface, How It Works, Codes, Schematics](https://howtomechatronics.com/tutorials/arduino/arduino-dc-motor-control-tutorial-l298n-pwm-h-bridge/)

+ PWM Frequency
    Definition: Frequency is the number of times per second that the PWM signal cycles on and off. It is measured in Hertz (Hz).
    Example: A PWM frequency of 25,000 Hz means the signal cycles 25,000 times per second.
    Why it Matters:
    - Audible Noise: If the frequency is too low (for example, 500 Hz or 1 kHz), you might hear a buzzing sound from motors or drivers like the L298N. Increasing the frequency (e.g., to 25 kHz) moves the cycle above the range of human hearing, reducing noise.
    - Performance: A higher frequency can sometimes make the control smoother, but it may also demand more processing power. For most applications (like controlling a motor), a frequency around 25 kHz is a good balance.
+ PWM Resolution
    Definition: Resolution describes how many distinct levels you can set for the duty cycle. It is often expressed in bits. For instance, 8-bit resolution means there are 2⁸ (256) possible levels (0 to 255), while 10-bit resolution gives you 2¹⁰ (1024) levels (0 to 1023).
    Example: With 8-bit resolution, a duty cycle of 128 means the output is “on” 50% of the time, since 128 is about half of 255.
    Why it Matters:
    - Control Granularity: Higher resolution means you can fine-tune the power delivered more precisely. For instance, when dimming an LED or controlling a motor, you might want very smooth changes.
    - Limitation: On ESP8266, the default PWM resolution is 10 bits (0–1023). Sometimes, you might map your values from a different scale (like 0–255) to match your application.

Putting It All Together:
- Frequency: How fast the PWM signal is switching on and off.
    A higher frequency (like 25 kHz) is good for motor drivers because it reduces audible noise.
- Resolution: How finely you can adjust the on/off time.
    A higher resolution means more precise control over the average power output.

为什么有些时候需要PWM比如控制电机转动 why need the off time in the frequency when I want the motor running?
A: Why Not Just a Constant High Signal?
- Full Speed Only: If you apply a constant high signal (i.e., 100% duty cycle), the motor always gets the full supply voltage. This means it runs at full speed, with no way to slow it down.
- Inefficient Speed Control: To reduce the motor's speed without PWM, you’d need to lower the voltage with a variable resistor or a linear regulator. These methods waste energy as heat.
How PWM Helps:
- Varying Average Voltage: With PWM, the signal rapidly switches between HIGH (full voltage) and LOW (zero voltage). By adjusting the duty cycle (the percentage of time the signal is HIGH), you effectively change the average voltage seen by the motor.
    For example, a 50% duty cycle at a 5V supply gives an average voltage of about 2.5V, so the motor runs slower.
- Efficiency: The switching is done by transistors operating in saturation or cutoff. This switching mode is very efficient since little power is wasted as heat.
- Motor Inertia: Motors are inductive loads. Their windings smooth out the rapid pulses, so the motor doesn’t “see” the individual on and off states but rather a smooth average voltage.

基本电学单位：电流、电压、功率 https://zh.khanacademy.org/science/physics/circuits-topic/circuits-resistance/a/ee-voltage-and-current


"The Art of Electronics" by Paul Horowitz and Winfield Hill
    Basic circuits (resistors, capacitors, diodes, transistors, etc.)
    How to build circuits and analyze them
    PWM and signal processing
    How to design and troubleshoot real-world circuits

"Practical Electronics for Inventors" by Paul Scherz and Simon Monk
"Make: Electronics: Learning Through Discovery" by Charles Platt

YouTube Channels:
Paul McWhorter’s Arduino Tutorials (great for both Arduino projects and circuit basics)
GreatScott! (provides practical electronics knowledge, including PWM and circuit design)
EEVblog (covers various electronics topics, often with deep dives into circuit analysis)