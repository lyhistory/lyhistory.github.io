## Overview

Purpose: Stores electrical energy in an electric field between two plates separated by a dielectric.
Key Property: Capacitance (measured in farads, F; practical units: µF, nF, pF).
Symbol: || (two parallel lines).

### History
Invention: The capacitor’s origins trace back to the Leyden Jar, invented in 1745 by Ewald Georg von Kleist, a German cleric and physicist, and independently in 1746 by Pieter van Musschenbroek, a Dutch physicist at the University of Leiden (hence the name). The Leyden Jar was a glass jar with metal foil on the inside and outside, capable of storing static electricity.
Evolution: The term "capacitor" came later, coined by Alessandro Volta in the late 18th century. Over time, capacitors evolved from crude jars to modern components with diverse materials (ceramics, electrolytes, films) by the 20th century, driven by advances in electronics.

### Key Formulas

Basic Relationship:

Q=C⋅V
Q: Charge stored (coulombs, C)
C: Capacitance (farads, F)
V: Voltage across the capacitor (volts, V)

Energy Stored:
E = (1/2) * C * V^2
E: Energy (joules, J)

Capacitors in Series:
When connected end-to-end, the total capacitance decreases:
1/C_total = 1/C_1 + 1/C_2 + 1/C_3 + ...
Example: Two 10 µF capacitors in series:
1/C_total=1/10+1/10=2/10=> C_total=5μF.
Capacitors in Parallel:
When connected side-by-side, the total capacitance adds up:
C_total=C_1 + C_2 + C_3 + ...
​
Example: Two 10 µF capacitors in parallel:
C_total=10+10=20μF.

Time Constant (RC Circuit):
In a resistor-capacitor (RC) circuit:
τ=R⋅C
τ: Time constant (seconds)
R: Resistance (ohms, Ω)
Used for timing or filtering.

Impedance (AC):

X_C = 1 / (2π * f * C)

X_C: Capacitive reactance (ohms, Ω)
f: Frequency (hertz, Hz)

### How It Works
Stores charge between plates; dielectric prevents direct current flow.
Blocks DC, passes AC (impedance decreases with higher frequency).

Materials: Ceramic, tantalum, aluminum oxide, plastic films.
Sizes: pF (tiny) to thousands of µF (large cans).
Failure: Overvoltage or reverse polarity → leaks, bulging, or explosion.


Ceramic: Small, non-polarized, high-frequency use (e.g., noise filtering).
Electrolytic: Polarized, high capacitance, power supplies (e.g., smoothing).
Tantalum: Polarized, compact, stable (e.g., portable devices).
Film: Non-polarized, reliable (e.g., audio, timing).

制作材料：非半导体材料
They consist of two conductive plates separated by a dielectric material. The conductive plates can be made of various materials such as metal, while the dielectric material can be non-conductive substances like ceramic, plastic, or electrolytic materials.

电容种类
瓷片

### Polarized Capacitors
Capacitors with a positive (+) and negative (–) terminal, like electrolytic (aluminum) and tantalum types. They use a chemical electrolyte or oxide layer as the dielectric, which requires correct polarity for operation.
Marked with a stripe or “+” sign (negative side on electrolytics).

What Happens if Connected Incorrectly?:

Reverse Polarity Effects:
The dielectric breaks down due to reversed electric field.
Electrolytic: May leak electrolyte, overheat, bulge, or explode (gas buildup from chemical reaction).
Tantalum: Can short-circuit, overheat, or catch fire (more catastrophic due to solid electrolyte).

Example: A 47 µF electrolytic cap rated at 25 V, connected backward in a 12 V circuit, might swell and pop within seconds, releasing a foul smell or hot electrolyte.

Prevention: Always check polarity markings and circuit voltage before connecting.


## Real-World Usage

### Discharge 放电

**Why High-Voltage Caps Are Dangerous:**

Per Q=C⋅V, charge (Q) depends on both capacitance (C) and voltage (V).

Energy Danger: 

E = (1/2) * C * V^2 shows energy increases with the square of voltage, making high-voltage caps store significantly more energy, even with moderate C. This stored energy can deliver a lethal shock or cause burns (e.g., capacitors in old CRT TVs or power supplies).
Example: A 100 µF, 50 V cap: 

E=1/2⋅100×10^−6 ⋅50^2=0.125J. Discharge with a 10 kΩ resistor (takes ~1 s, τ=R⋅C) before handling.

Rule of Thumb: 

Discharge if V>25V or E>0.1J (potentially harmful threshold). No strict standard exists, but:

Low Risk: V<25V and C<10μF → Direct shorting may be okay (e.g., with a screwdriver).
High Risk: V>25V or C>100μF → Use a resistor (e.g., 1 kΩ–10 kΩ) to discharge slowly and avoid sparks or damage.

Method: Short terminals with a resistor or insulated tool. For large caps, monitor voltage with a multimeter until < 5 V.

**Do We Need a Resistor?**

Direct Shorting: Shorting with a screwdriver could work (low voltage), but the high capacitance (1000 µF) means a large instantaneous current (I=C⋅ dV/dt), causing a spark or pitting the tool.

Resistor Use: A resistor limits current, preventing sparks and safely dissipating energy as heat


Understanding I=C⋅ dV/dt

​I: Current (amperes, A)
C: Capacitance (farads, F)
dV/dt: Rate of change of voltage across the capacitor (volts per second, V/s)

Physical Meaning:
When a charged capacitor is shorted, it tries to discharge all its stored charge (Q=C⋅V) as quickly as possible.
The current depends on how fast the voltage drops from its initial value (16 V) to 0 V.
dV/dt is the speed of that voltage change, which is extremely high in a direct short due to negligible resistance.

Calculating the Instantaneous Current（16 V, 1000 µF）:

In a real-world direct short (e.g., with a screwdriver), the resistance is near zero, and the discharge time is limited by parasitic resistance (e.g., in the capacitor, wires, or contact) and inductance. This makes an exact dV/dt hard to pin down without specifics, but we can estimate the peak current and behavior:

Step 1: Theoretical Peak Current (Ideal Short)

Ideal Case: If resistance = 0 Ω, the discharge is instantaneous (dt→0), and current would theoretically approach infinity.
Charge Stored:
Q = C * V
Q = 1000 × 10⁻⁶ * 16
Q = 0.016 C (coulombs)

If dt were, say, 1 microsecond (10⁻⁶ s, an unrealistically fast ideal):

I = Q / dt = 0.016 / 10⁻⁶ = 16,000 A

Step 2: Realistic Estimate

Real Discharge Time: In practice, internal resistance (ESR, equivalent series resistance, typically 0.1–1 Ω for electrolytics) and contact resistance slow the discharge. Let’s assume:
ESR + Contact Resistance: ~0.1 Ω
Initial Voltage: 16 V
Peak Current (Ohm’s Law Approximation):

I_peak = V / R = 16 / 0.1 = 160 A

Time Scale: The discharge time is roughly τ=R⋅C=0.1∗0.001=0.0001s (100 µs).

Average dV/dt:
Voltage drops from 16 V to ~0 V in ~100 µs:
dV/dt = 16 / 0.0001 = 160,000 V/s

Current Using I=C⋅ dV/dt I = 0.001 * 160,000 = 160 A Matches the Ohm’s Law estimate, confirming consistency.

Step 3: Practical Outcome
Peak Current: Approximately 160 A for a tiny fraction of a second (microseconds).
Behavior: This high current causes a spark, audible “pop,” and possible damage (e.g., pitting the screwdriver, welding contacts, or stressing the capacitor).


**Example: 16v 1000 µF**

Step 1: Assess the Danger

We’ll use the energy stored formula to determine if this capacitor poses a risk:
E = (1/2) * C * V^2

E = (1/2) * 0.001 * 16^2
E = 0.0005 * 256
E = 0.128 J

Conclusion: While 16 V is relatively low, the 1000 µF capacitance stores enough energy (0.128 J) to warrant careful discharge, especially to avoid sparks or damage to tools/components. Using a resistor is safer than shorting directly.

Step 2: Choosing the Resistor

To select a resistor, we need:

Resistance Value (R): Determines discharge speed via the time constant (τ=R⋅C).
Power Rating: Ensures the resistor can handle the energy without overheating.

A. Calculate Time Constant (τ)

Goal: Discharge to a safe voltage (e.g., < 5 V) in a reasonable time (e.g., 1–5 seconds).
Formula: Voltage decays exponentially:

V(t) = V_0 * e^(-t / (R * C))

V_0=16V (initial voltage)
C=0.001F
t=τ (time constant) when voltage drops to ~37% of initial (16 V * 0.37 ≈ 5.9 V).

Desired τ: Let’s aim for τ=1second (practical for manual discharge):

τ = R * C
1 = R * 0.001
R = 1000 Ω (1 kΩ)

Discharge Time:
After 1 τ (1 s), V≈5.9V.
After 3 τ (3 s), V≈0.8V (99% discharged, very safe).

B. Calculate Peak Current

Initial Current:

I = V / R = 16 / 1000 = 0.016 A (16 mA)

This is low, so no significant heat or spark risk.

C. Calculate Power Rating

Initial Power:
P = V^2 / R = 16^2 / 1000 = 256 / 1000 = 0.256 W

Energy Dissipated: Total energy (0.128 J) is spread over time, so peak power is brief.

Resistor Choice: A 1 kΩ, 0.5 W resistor is sufficient (common and exceeds 0.256 W).

D. Alternative Resistor Options

Faster Discharge: R=500Ω, τ=0.5s, P=0.512W → Use a 1 W resistor.
Slower Discharge: R=10kΩ, τ=10s, P=0.0256W → Use a 0.25 W resistor.


### Classic Usage in Circuits 电容八大用途：
1. Power Supply Smoothing:
Example: 1000 µF electrolytic cap smooths DC in a rectifier circuit.
How: Charges on peaks, discharges on troughs for steady output.

2. Timing Circuits:
Example: 10 µF cap + 10 kΩ resistor in a 555 timer:

τ = 10,000 * 10e-6 = 0.1 s

Used for LED blinking.
How: Charges through resistor, triggers at threshold.

3. Signal Filtering:
Example: 0.1 µF ceramic cap removes high-frequency noise in audio.
How: Shunts high frequencies to ground.

4. Coupling:
Example: 1 µF cap passes AC audio signals, blocks DC bias.
How: Allows AC, stops DC between stages.


### 创意案例

#### 点焊笔

四个电容 2.7v 500法拉 并联， 充电端串联一个二极管

定时继电器模块 
信号控制开关（可以固定在点焊笔上）

硅胶线（耐高温）

点焊笔