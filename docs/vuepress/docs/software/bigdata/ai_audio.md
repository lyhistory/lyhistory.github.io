[开源的、模块化的GPT-4级语音对话系统](https://github.com/huggingface/speech-to-speech)


## 语音克隆

[VoxCPM: Tokenizer-Free TTS for Context-Aware Speech Generation and True-to-Life Voice Cloning](https://github.com/OpenBMB/VoxCPM)


OpenVoice
https://mp.weixin.qq.com/s/QDPX7D1mnwwmmv1pb_TbOA

### 在 Colab 免费 GPU 上微调 GPT-SoVITS,然后本地 CPU 跑推理
准备语音素材：

第一部分：基础音素与声调测试（字正腔圆，稳定叙述）绿草如茵的足球场上，朝气蓬勃的运动员们正在挥洒汗水。阳光透过茂密的梧桐树叶，斑驳地洒在古老而宁静的青石板路上。远处，巍峨的雪山与蔚蓝的天空连成一线，宛如一幅绝美的泼墨山水画。蜻蜓在清澈的荷塘水面上轻轻点水，荡起一圈圈细小的涟漪。第二部分：情绪起伏与句式变换（自然说话，带有正常情感）“明天的天气怎么样？我们真的要按原计划出发去郊游吗？”他望着窗外阴沉的天空，有些犹豫地问道。哇！这真是一次不可思议的奇妙旅行！无论是追逐梦想的艰辛，还是收获成功时的喜悦，都是我们人生中不可或缺的宝贵财富。科学技术的迅猛发展，不仅深刻地改变了我们的日常生活，也为整个人类的未来带来了无限的可能。第三部分：高难度绕口字词与韵母组合（咬字清晰，速度放慢）传统手工艺人凭借着精湛的手艺和坚韧的匠心，赋予了每一件艺术品独特的生命力。钟表发出滴答滴答的声响，在空旷而静谧的走廊里显得格外清晰。酸甜苦辣咸，这五种滋味交织在一起，才是生活最真实的写照。经过反复的权衡与思考，他终于在繁杂的选项中做出了最终的抉择。第四部分：日常旁白与结束语（收尾，保持呼吸平稳）无论是清晨迎着第一缕曙光奔跑，还是深夜独自在台灯下挑灯夜战，每一步努力都算数。感谢你的倾听，今天的分享到这里就全部结束了，祝你拥有美好的一天。

win10 声音输入选择蓝牙耳机

优化降噪： https://podcast.adobe.com/ https://app.cleanvoice.ai/

[GPT-SoVITS 官方 Colab-WebUI](https://colab.research.google.com/github/RVC-Boss/GPT-SoVITS/blob/main/Colab-Inference.ipynb) 

切换 T4 GPU：点击 Colab 菜单栏的 代码执行程序 (Runtime) -> 更改运行时类型 (Change runtime type) -> 选择 T4 GPU -> 点击 保存。

Colab 界面是由一个个“代码块”组成的，你只需要从上到下，看懂提示并点击代码块左侧的 “播放/运行” 按钮即可：

运行第 1 步：挂载 Google Drive运行代码后，网页会弹窗请求访问你的谷歌云盘，点击“允许”。好处：挂载后，训练出来的模型会自动存在你的云盘里，就算 Colab 网页不小心断开，数据和模型也不会丢失。

运行第 2 步：安装依赖环境这一步会自动下载 GPT-SoVITS 的源码并安装 PyTorch、FFmpeg 等必要组件。注意：这步需要耗时 3~5 分钟，请耐心等待它运行完毕（左侧出现绿色对勾）。

运行第 3 步：启动 WebUI 映射运行最后一个启动代码块。运行后注意观察下方的日志输出。稍等片刻，日志最后会输出两个链接。找到名为 Public URL 的链接（通常是以 xxxx.gradio.live 结尾）。点击这个链接，就会在浏览器新标签页中打开熟悉的 GPT-SoVITS 网页操作界面。步骤 3：在 WebUI 中一站式训练进入 gradio.live 网页后，接下来的操作和在本地完全一样（由于是公网映射，网页反馈可能会稍有延迟，每点一下请等 2 秒）：上传与切片：在 0-前置数据集获取工具 标签页，填入你的音频路径，点击语音切片和降噪。打标 ASR：在 0b-ASR自动化音频文本标注工具 中，推荐选择 SenseVoice 或 FastWhisper，点击开启ASR。开始微调：切换到 1-GPT-SoVITS微调 标签页。版本选择：根据官方推荐，目前的版本迭代到了 V2、V3、V4，建议直接选择 V2Pro 或 V2。依次点击 开启SoVITS训练 和 开启GPT训练。时间参考：5分钟的音频，SoVITS 跑 10 轮 (Epoch)，GPT 跑 15 轮，在 T4 GPU 上大约只需 20~30 分钟。步骤 4：去谷歌云盘下载模型训练完成后，你可以关闭 Colab 网页。直接打开你的 Google Drive（谷歌云盘），在项目输出目录下找到并下载这两个模型文件：GPT_weights_v2/（或对应的版本文件夹）下的 .ckpt 文件SoVITS_weights_v2/（或对应的版本文件夹）下的 .pth 文件第二部分：本地 CPU 推理环境极简配置回到你的本地电脑（没有显卡或不想用显卡的设备），按以下步骤配置纯 CPU 推理：下载本地整合包：去 B 站或 GitHub 搜索“GPT-SoVITS 本地整合包 V2/V2Pro”（最好和你在云端训练选择的版本一致）。下载国内开发者打包好的“一键解压即用版”。放置模型：把从谷歌云盘下载的 .ckpt 和 .pth 文件，分别丢进本地整合包根目录下的 GPT_weights_v2 和 SoVITS_weights_v2 文件夹里。强制切换为 CPU 模式（关键！）：在本地整合包根目录下，用记事本打开 config.py。找到 device = "cuda"，将其修改为 device = "cpu"。找到 is_half = True，将其修改为 is_half = False。（原因：CPU 不支持半精度/浮点16计算，必须关闭，否则本地会无限报错爆内存）。启动推理：双击本地的 go-webui.bat，等待弹出的本地网页。切换到 1C-推理 页面，刷新并勾选你的模型，丢入一段 5 秒的参考音频，就可以输入文字让 CPU 帮你合成语音了！
## 文字 转 语音
ElevenLabs

https://ttsmaker.com/

google bart
open-source text-to-speech+ model.
https://github.com/suno-ai/bark

https://www.notta.ai/en

https://chattts.com/
方言:
https://github.com/rany2/edge-tts
https://mp.weixin.qq.com/s/HhIE3QUfr6kh6-6jA2Tk_g


## 说话者识别
[A Repository for Single- and Multi-modal Speaker Verification, Speaker Recognition and Speaker Diarization](https://github.com/modelscope/3D-Speaker)

[Silero VAD: pre-trained enterprise-grade Voice Activity Detector](https://github.com/snakers4/silero-vad)

## 实时语音
[Multilingual Voice Understanding Model](https://github.com/FunAudioLLM/SenseVoice)

[VibeVoice](https://github.com/microsoft/VibeVoice)

## 语音翻译

rask ai
https://www.rask.ai/

## 电子书
[Generate audiobooks from e-books, voice cloning & 1158+ languages!](https://github.com/DrewThomasson/ebook2audiobook)

## 播客

[SoulX-Podcast](https://github.com/Soul-AILab/SoulX-Podcast)
