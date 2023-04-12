## 类型

+ 模拟信号传感器
+ 数字传感器

## 模拟信号传感器和模数转换器（ADC）如何数字化世界
Sight -> Optical Sensor
Hearing -> Ultrasonic Sensor
Touch -> Piezoelectric Sensor
Smell -> Chemical Sensor
Taste -> Bio Sensor


传感器和模数转换器（ADC）如何数字化世界
Sensors collect information differently from one another and can return an output voltage in form of analog signals, sine or square waves, pulses, or DC voltages.
Some may output a varying electric current or change their electrical resistance in dependence of the measured physical quantity.
But most of these analog signals are very small in amplitude.
This causes problems for the next stages of the data acquisition chain to process the signal further.
This can be solved through signal conditioning.
One part of it means increasing the signal’s amplitude by using a special kind of electronic circuit known as an instrumentation amplifier.

It consists of 3 operational amplifiers, 7 resistors and is used in measurement equipment because of its superior features like high input impedance.
Our signal got amplified a lot and with it, the electrical noise inside which consists of high frequencies.
On the other hand, the sensor signal includes low-frequency components storing our collected information.
It seems cleaning up the signal and separating it from the noise would be a great idea.

The next step in converting the sensor voltages to digital values is to low pass filter the whole signal.
Electronic circuits like low pass filters are described by a graph called the frequency response curve.
The frequency response shows how strong different frequency components of the input signal are amplified or attenuated.
In the case of the low pass filter, high frequencies above a certain point are attenuated heavily.
As a result, disappearing from the signal.
After the sensor signal was low pass filtered, the amplitude of the signal is modified so it matches the voltage range of the next stage, the sample and hold circuit as well as the analog to digital converter.
Not adjusting the voltage range between the circuits may cause damage and distort the signal.
At the beginning of every analog to digital conversion, a signal must go through the sample and hold circuit.
It basically consists of one switch and one capacitor.
If the switch is closed, the analog voltage at the input is captured by the capacitor
and stored for a specific duration, the sampling period.
If the sampling period ends, the current voltage at the input is sampled again and saved, thus replacing the old voltage at the output.
This cycle repeats and is referred to as the sampling process.
Engineers follow the Shannon-Nyquist Theorem which states that the reciprocal of the sampling period, the sampling frequency, should always be greater than double the signal frequency to avoid a distortion of the signal and a loss of information.
The next stage of the data acquisition chain is the analog to digital converter.
It takes the sampled voltage in the rhythm of the sampling period,processes the voltage and outputs a corresponding digital value.
Afterward, the next sample is fed in, digitized, and new bits are sent out by the chip, repeating the cycle over and over again.
It exists a variety of different analog to digital converters, some feature a very fast digitization process like the Flash ADC, some like the Delta-Sigma converter approximate the original signal pretty good, making a compromise between resolution and sampling rate.
Each digital value generated in the process is passed to a computer over communication protocols.
There, the acquired data can be analyzed or processed further digitally with programming languages like MATLAB or Python.

And that’s basically how sensor signals are converted to digital signals that are stored in a computer.


## 常见传感器

heartbeat/Fingertip measuring heartbeat

