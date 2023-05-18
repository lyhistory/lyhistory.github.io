
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

+ L9110
+ L293D
+ L298
  - L298P 
  - L298N motor driver

## 原理
PWM, or pulse width modulation is a technique which allows us to adjust the average value of the voltage that’s going to the electronic device by turning on and off the power at a fast rate. The average voltage depends on the duty cycle, or the amount of time the signal is ON versus the amount of time the signal is OFF in a single period of time.
https://howtomechatronics.com/tutorials/arduino/arduino-dc-motor-control-tutorial-l298n-pwm-h-bridge/


##
Arduino智能小车
https://www.hackster.io/goldscrew/arduino-obstacle-avoiding-robot-car-2wd-with-aa-battery-514b3c
https://www.codemahal.com/2wd-robotic-car-arduino
https://www.instructables.com/OSOYOO-2WD-Robot-Car-Starter-Kit/

树莓派 智能小车
[化繁为简！开发者尝鲜阿里小程序云平台，实操讲解如何打造智能小车！](https://yq.aliyun.com/articles/700749?spm=a2c4e.11163080.searchblog.48.32e02ec1I9PHCG)