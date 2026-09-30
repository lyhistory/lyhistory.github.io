[泡泡机的结构和原理](https://www.bilibili.com/video/BV1414y1S7bJ/?vd_source=3c7db6c464ce22629be3830e049bb553)

[Bubble Machine DIY](https://www.instructables.com/Bubble-Machine/)

[How to make a bubble machine](https://thepracticalengineer.com/blog/bubblemachine)

[How to Make a Bubble Blower](https://education.ucdavis.edu/video/how-make-bubble-blower-fun-summer-dyi-project)

## 拆卸某玩具泡泡机

电路图
```Mermaid
flowchart LR
    %% 定义电池和开关
    Battery[电池组 6V]:::power
    Switch[三脚开关]:::switch

    %% 定义马达
    Motor[主马达 风扇/水泵齿轮]:::motor

    %% 定义LED支路
    Resistor[限流电阻 100Ω~1kΩ]:::res
    LED[LED 指示灯]:::led

    %% 定义电容
    Cap[消火花电容]:::cap

    %% 主回路连线
    Battery -->|正极| Switch
    Switch -->|红线| Motor

    %% LED并联支路连线 (红线连马达B端)
    Motor -->|红线 正极侧| LED
    LED --> Resistor
    Resistor -->|蓝线 负极侧| Motor

    %% 马达负极回路
    Motor -->|黑线 负极| Battery

    %% 电容并联在马达两端
    Motor -.-> Cap

    %% 样式定义
    classDef power fill:#f9f,stroke:#333,stroke-width:2px;
    classDef switch fill:#bbf,stroke:#333,stroke-width:2px;
    classDef motor fill:#fbb,stroke:#333,stroke-width:2px;
    classDef res fill:#bfb,stroke:#333,stroke-width:2px;
    classDef led fill:#fbf,stroke:#333,stroke-width:2px;
    classDef cap fill:#ffcc99,stroke:#333,stroke-width:2px;
```

机械挤压泵（齿轮带动压管装置），它本身没有电机，是靠主马达通过齿轮链条带动的

无极性小电容（通常是棕色的瓷片电容，标号为104即0.1μF）。
作用：直流小马达内部有电刷，转动时会产生微小的电火花和高频电磁干扰。并联这个电容是为了吸收火花、滤除干扰。它不影响马达转动，如果拆掉它，马达依然能转。

用3节7号电池（共4.5V）替代原装的4节5号电池（共6V）能够驱动这个泡泡机火箭，主要是电压兼容：
玩具电机的宽容度很高，标称电压与实际电压：原装设计4节5号电池，标称总电压是 4*1.5V = 6V。但你改用3节7号电池，标称总电压是 3*1.5V = 4.5V。
电机的工作范围：这种小型直流玩具电机（如常见的130电机）电压兼容性非常宽。一个标称6V的电机，通常在 3V到9V​ 的范围内都能正常运转。4.5V虽然低于原设计的6V，但已经足够让电机启动并带动齿轮和挤压泵了。
