 
## 原理解析

全网最全AI绘画Stable Diffusion关键技术解析
https://mp.weixin.qq.com/s/i_0d6qw1kgQ9McMnOaW9Sw

Stable Diffusion 模型演进：LDM、SD 1.0, 1.5, 2.0、SDXL、SDXL-Turbo 等
https://mp.weixin.qq.com/s/q3n01GEq5eGeSXKnB6-Wkg


## 安装

Version:
[Stable Diffusion 3](https://mp.weixin.qq.com/s/4Lf-G3iBdvKNXtrgAcOT3w)

### 本地安装

#### 官方版本
[Repo-Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

[WIKI-Stable Diffusion web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki)

[Install and Run on NVidia GPUs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs)
[Install and Run on AMD GPUs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-AMD-GPUs)

1. Install Python 3.10.6 (Newer version of Python does not support torch), checking "Add Python to PATH".
2. git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git.
3. Run webui-user.bat from Windows Explorer as normal, non-administrator, user.

#### 秋叶大佬Stable Diffusion整合包

### Docker安装
[Install and run via container (i.e. Docker)](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Containers)

[Maintained by neggles](https://github.com/neggles/sd-webui-docker)

### Online Sevice- Googlecolab

### Online Sevice-Kaggle安装
[Kaggle](https://www.kaggle.com/) 是一个流行的数据科学和机器学习竞赛平台，也是数据科学家、机器学习工程师和研究人员分享、发现和交流知识的社区。

Kaggle 提供许多数据集和竞赛，鼓励用户分享并提交他们的解决方案。
该平台还提供了一个云端的 Jupyter Notebook 环境，提供对 GPU 和 TPU 的免费访问，以加速数据科学项目的执行速度。
Kaggle 每周有 30 小时免费使用时长，平均到每天可以使用 4 个多小时，完全可以用来免费学习使用了。

关键是提供可选 GPU : P100、T4 x2 显卡

**Fork:**
+ [Maintained by roguewild](https://www.kaggle.com/code/roguewild/automatic1111-s-stable-diffusion-webui)
+ [Maintained by camenduru](https://www.kaggle.com/code/camenduru/stable-diffusion-webui-kaggle)

**自行安装：**

1. Create->New Notebook

2. Add Data-> stable diffusion v2.0 config

3. 在 Notebook options ，选择 ACCELERATOR，选择 GPU T4 x2。

4. 设置 ENVIRONMENT=>Always use latest environment

5. Internet 默认off，选择on

6. 左侧代码框中
```
!python --version
!rm -rf /kaggle/working/stable-diffusion-webui
!git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
%cd /kaggle/working/stable-diffusion-webui
!wget -O /kaggle/working/stable-diffusion-webui/models/Stable-diffusion/majicmixRealistic_v5.safetensors -L https://civitai.com/api/download/models/82446

%cd /kaggle/working/stable-diffusion-webui/extensions

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/sd-webui-controlnet
!git clone https://github.com/Mikubill/sd-webui-controlnet.git

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/openpose-editor
!git clone https://github.com/fkunn1326/openpose-editor.git

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/sd-dynamic-thresholding
!git clone https://github.com/mcmonkeyprojects/sd-dynamic-thresholding.git

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/sd-webui-bilingual-localization
!git clone https://github.com/journey-ad/sd-webui-bilingual-localization.git

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/stable-diffusion-webui-chinese
!git clone https://github.com/VinsonLaro/stable-diffusion-webui-chinese.git

!rm -rf /kaggle/working/stable-diffusion-webui/extensions/ultimate-upscale-for-automatic1111
!git clone https://github.com/Coyote-A/ultimate-upscale-for-automatic1111.git

!wget -O /kaggle/working/stable-diffusion-webui/extensions/sd-webui-controlnet/models/control_v11p_sd15_openpose.pth -L https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_openpose.pth
%cd /kaggle/working/stable-diffusion-webui

!python launch.py --share --gradio-auth user:password --no-half
```

7.运行启动 SD

**注意：**
+ 用完记得点击关闭按钮。这是云服务，你不点云服务关闭按钮，关闭本机它还是在运行。用完或者长时间不绘图的时候，记得关闭，毕竟 1 周只有 30 小时。
+ 默认的库有限，其他地方贴过来的绘图提示词有些库可能没有，需要手动调下
+ 图片参数还是不要调得太大，不然会报错，无法生成图片。
+ 报错则需要重新启动服务。

### 在线UI
https://www.esheep.com/
pro.aikobo.cn
https://www.lanrui-ai.com/

## 基本使用

### Basic
[Stable Diffusion WebUI AUTOMATIC1111: A Beginner’s Guide](https://stable-diffusion-art.com/automatic1111/)
[Generate High-Quality Image Using Stable Diffusion WebUI](https://betterprogramming.pub/generate-high-quality-image-using-stable-diffusion-webui-de96d6947d85)

### promopt

[Stable Diffusion prompt: a definitive guide](https://stable-diffusion-art.com/prompt-guide/)

反向prompt：cartoon,painting,illustration,(worst quality, low quality, normal quality:2)

## 插件 Extension

https://mp.weixin.qq.com/s/z_rD7HP_yJLXiMIBu4nAug

### Extension: Prompt
【Stable Diffusion】提示词插件
https://mp.weixin.qq.com/s/oPY2CYBSl6wx237lTQuYmA

### Extension: ControlNet
ControlNet is a Stable Diffusion model that lets you copy compositions or human poses from a reference image.

https://www.youtube.com/watch?v=mmZSOBSg2E4
Controlnet Github: https://github.com/Mikubill/sd-webui-controlnet
Controlnet Models Download: https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main
Segmentation Color Sheet: https://docs.google.com/spreadsheets/d/1se8YEtb2detS7OuPE86fXGyD269pMycAWe2mtKUj2W8/

### Extension: inpaint anything
https://github.com/Uminosachi/sd-webui-inpaint-anything
https://mp.weixin.qq.com/s/gSUNdSKP-cZzIouJLBU9Ag

### Extension:LightFlow 工作流复用插件
https://mp.weixin.qq.com/s/UXg777w3F7wggA3F29cACg

## 常用模型分类

五大类，分别是Stable diffusion模型、VAE模型、Lora模型、Embedding模型以及Hypernetwork模型。

https://www.53ai.com/news/qianyanjishu/2444.html
https://zhuanlan.zhihu.com/p/649749094

从用途上看，还分为官方模型、二次元模型（动漫）、真实系模型和2.5D模型四大类

### lora
深入浅出学习Stable diffusion之使用Lora（入门篇）
https://mp.weixin.qq.com/s/EpfUH6yfCt934UnbiRjgcg
stable diffusion模特换装服装换ai模特软件整合包，含大模型、LORA模型和必备插件，解压即用
https://mp.weixin.qq.com/s/witSptyfBKhy1pPCPRQSkg

Stable Diffusion 角色一致性LoRA训练
https://mp.weixin.qq.com/s/EpnZiw51eMF7JQj3H5-Xdw

AI字体+城市海报制作 https://mp.weixin.qq.com/s/LJjGYBrigK0rB0FSMqbe8g
电商模型 https://mp.weixin.qq.com/s/yiCc_u_W21w_PbeWHSJ7Mg

### ControlNet和IP-Adapter塑造风格化的头像
https://mp.weixin.qq.com/s/k4rSCOAYYKNHkIvjJDGPhg

### AnimateDiff 文生动图gif
https://mp.weixin.qq.com/s/AiA_Rkz35FD1uv2deXPIKg
https://mp.weixin.qq.com/s/K7eWwxcPeUDggt9P6A9UcQ

### EasyPhoto AI 写真照片生成器
https://mp.weixin.qq.com/s/zSwXJY14hECwHrDIc5X4ZA

### Deforum 
全息动画 https://mp.weixin.qq.com/s/27rK6S9YSrtTM2icDDNm-g
Deforum和AE https://mp.weixin.qq.com/s/n_jz-wliJXTRKio_lqBDPA

### Latent Consistency Models
https://mp.weixin.qq.com/s/-eBJndDRNOjvjJMeN2UZEw

### SDXL-Turbo 快速
https://mp.weixin.qq.com/s/pArAPDESJXTG2OLzHjUbxQ
https://mp.weixin.qq.com/s/Vm4eusltNrx5XCXNxARnQw

## 场景应用

### AI商品图

#### 人台 mannequin=》真人
negative prompt
```
(((canvas frame))),cartoon,3d,((disfigured)),((bad art)),((extra limbs)),deformed face,((deformed)),((close up)),((b&w)),wierd colors,blurry,((duplicate)),((morbid)),((mutilated)),[out of frsme],extrs fingers,mutsted hands,((poorly drawn hands)),((poorly drawn face)),((mutation)),((deformed)),((ugly)),(bad anatomy),gross proportions,(malformed limbs),((missing arms)),((missing legs)),((extra legs)),mutated hands,(fused fingers),(too many fingers),((longneck)),video game,tiling,poorly,poorly drawn feet,poorly drawn face,extra arms,cross-eye,bodyoutof frame,3d render,16-token-negative-deliberate-neg,bad-hands-5,
```

positive prompt:
```
a woman in white tights and white sneakers is doing a split in the air with her leg up,david rudnick,superflat,a digital rendering,Évariste Vital Luminais,
```

https://www.youtube.com/watch?v=GxFljO22cM4

https://www.youtube.com/watch?v=wJX4bBtDr9Y

#### OOTDiffusion
https://github.com/levihsu/OOTDiffusion?tab=readme-ov-file

### 儿童绘本全流程制作分享
https://mp.weixin.qq.com/s/Q42AQQ7YVLuMCZF1uA3V2Q
本文将会用到“Stable Diffusion”、“极虎漫剪”、“剪映”以及一个Stable Diffusion的插件“Agent Scheduler”。对了，还有绘本内容，绘本内容可以用AI语言大模型生成，或者如果有现成也可以，然后直接复制粘贴到一个Word文档上即可。

## Troubleshooting

### 肢体变形
ControlNet Depth Libra https://github.com/jexom/sd-webui-depth-lib
https://www.youtube.com/watch?v=_YLKg_k_sYQ

### 角色一致性
Midjourney 实现角色一致性的新方法 https://mp.weixin.qq.com/s/OQgb3jDGmmBsId-k5pMpOA

## 市面产品
https://clipdrop.co/stable-doodle

Ai 绘图：模特生成与换装 https://www.douyin.com/video/7220447504221965627

抠图：https://www.remove.bg/

Toonme - Cartoon

DragGAN

https://magicstudio.com/magiceraser/ Remove unwanted things in seconds

图片修复 https://pixfix.com/

AI商品图片：https://design.meitu.com/product-shoot/?from=home_icon


tryondiffusion https://tryondiffusion.github.io/