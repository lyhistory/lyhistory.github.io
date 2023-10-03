## 本地安装



## Kaggle安装 
Kaggle 是一个流行的数据科学和机器学习竞赛平台，也是数据科学家、机器学习工程师和研究人员分享、发现和交流知识的社区。

Kaggle 提供许多数据集和竞赛，鼓励用户分享并提交他们的解决方案。
该平台还提供了一个云端的 Jupyter Notebook 环境，提供对 GPU 和 TPU 的免费访问，以加速数据科学项目的执行速度。
Kaggle 每周有 30 小时免费使用时长，平均到每天可以使用 4 个多小时，完全可以用来免费学习使用了。

关键是提供可选 GPU : P100、T4 x2 显卡

https://www.kaggle.com/

Create->New Notebook

Add Data-> stable diffusion v2.0 config

在 Notebook options ，选择 ACCELERATOR，选择 GPU T4 x2。

设置 ENVIRONMENT=>Always use latest environment

Internet 默认off，选择on

左侧代码框中
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

运行启动 SD

用完记得点击关闭按钮。这是云服务，你不点云服务关闭按钮，关闭本机它还是在运行。

用完或者长时间不绘图的时候，记得关闭，毕竟 1 周只有 30 小时。

不过注意，

第一，默认的库有限，其他地方贴过来的绘图提示词有些库可能没有，需要手动调下

第二，图片参数还是不要调得太大，不然会报错，无法生成图片。

报错则需要重新启动服务。