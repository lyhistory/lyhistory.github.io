
[AI News](https://aisecret.us/)

## todo

[AI模型训练到底在训练什么？](https://mp.weixin.qq.com/s/tY-4z-D_IezAOeFgKZqedA)

[图解深度学习 - 数据蒸馏和知识蒸馏 Data Distillation](https://mp.weixin.qq.com/s/6QipKFVDPSsKMpz8oyguBg)

[Model Distillation 终于把神经网络中的知识蒸馏搞懂了！！](https://mp.weixin.qq.com/s/ISC68FL9p7tYqTYs9b7uBw)

[Transformer Explained Visually: Learn How LLM Transformer Models Work with Interactive Visualization](https://github.com/poloclub/transformer-explainer)

[终于有人将深度学习中重点做成了动画](https://mp.weixin.qq.com/s/rMtbq2UDwCGFNB9WUMLGrw)

[GPT4All: Run Local LLMs on Any Device. Open-source and available for commercial use.](https://github.com/nomic-ai/gpt4all/)

[AI首席情报官 Wiseflow](https://github.com/TeamWiseFlow/wiseflow)


[保姆级教程~本地微调DeepSeek-R1-8b模型](https://mp.weixin.qq.com/s/uooA_ag1dI7DUCdBKJnuSQ)




[Axolotl微调Qwen2-7b开源大模型！AutoGen+Marker自动生成数据集！AutoGen Studio+GPT4评估Qwen2文章能力 ](https://www.youtube.com/watch?v=7zw2B8upP00)

rtvi-ai + pipecat 
  https://github.com/rtvi-ai
  https://github.com/pipecat-ai/pipecat



[我让AI当黑客！基于DeepSeek+ollama的网安神器开发实录，效率提升300%](https://mp.weixin.qq.com/s/ffTEVgGloVFhL08YauxxOQ)

[Aider + Claude + Invoke + Udio ：从头到尾使用 AI 创建游戏！（音乐、代码、动画）](https://mp.weixin.qq.com/s/kHtujRmlteH1ZVP_Tjn5OQ)

[LLM在金融交易领域的实际应用:FinRobot开源平台的创新突破](https://mp.weixin.qq.com/s/FSSHrorj0SD9sxVX7SDPPg)


[Restoration for TEMPEST images using deep-learning](https://github.com/emidan19/deep-tempest)

多模态 multimodal 
  [Mini-Omni: Language Models Can Hear, Talk While Thinking in Streaming](https://github.com/gpt-omni/mini-omni)


API脚本
+ API管理分发
    - [LLM API 管理 & 分发系统](https://github.com/songquanpeng/one-api)

+ 思考过程脚本：
    - [显示思考过程转换项目](https://github.com/liandu2024/DeepSeek2URL) 源自：[chadyi 大佬的 显示思考+搜索项目](https://github.com/chadyi/Search-for-LLMAPI)

[openwebui](https://openwebui.com/)

```
// Before proceeding, ensure you're using Python 3.11 to avoid compatibility issues.
pip install open-webui
open-webui serve //Running on  http://0.0.0.0:8080
```

Setting:
1. Enable Web Search Engine
2. Connections 
    - OpenAI API
        - https://groq.com/
        - https://build.nvidia.com/
        - 硅基流动API官网：https://cloud.siliconflow.cn/i/jPI17VGX  
        - 火山方舟API官网：https://console.volcengine.com 
        - 阿里百炼API官网：https://www.aliyun.com/product/bailian  
        - 深度求索API官网：https://platform.deepseek.com  
    - Ollama API
        - http://localhost:11434



desktop 
+ [cherry-ai](https://cherry-ai.com/)
没有联网搜索功能，不过其中小程序如秘塔搜索使用了满血的deepseek可以补足

brower Extension
+ Page Assist


AI+RAG
[AnythingLLM The all-in-one Desktop & Docker AI application with built-in RAG, AI agents](https://anythingllm.com/)


## 基础

### Protocol
Model Context Protocol vs Function Calling:

[Model Context Protocol Clearly Explained](https://www.youtube.com/watch?v=tzrwxLNHtRY)

[Sample MCP client](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-chatbot/mcp_simple_chatbot/main.py)
[Google maps MCP server](https://github.com/modelcontextprotocol/servers/blob/main/src/google-maps/index.ts#L297)
[MCP Schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2024-11-05/schema.ts)
[Simple tool, resource, prompt servers](https://github.com/modelcontextprotocol/python-sdk/tree/main/examples/servers)
[Example servers](https://modelcontextprotocol.io/examples)
[MCP inspector (postman like tool)](https://modelcontextprotocol.io/docs/tools/inspector)

### 私人部署 

+ 推理框架
  允许开发人员轻松地在本地部署和运行 LLM
  - [Ollama](/software/bigdata/ai_ollama.md) 
  - [vllm](/software/bigdata/ai_vllm.md)
+ AI 应用开发平台 
  提供了一套完整的工具和 API，用于构建、管理和部署 AI 应用
  - [Dify](https://github.com/langgenius/dify)
  
https://mp.weixin.qq.com/s/iwsSKjGloNe7SCM4-5nzDA

#### NextJS+Vercel
https://sdk.vercel.ai/

https://www.youtube.com/watch?v=5_JT9H8j1Us
https://github.com/a-bit-of-saas/examples/tree/main/next/chat-gpt?ref=ethanmick.com

#### FastGPT

代理方案：
+ nginx 方案 - 需要一台国外服务器 (商用)
+ sealos nginx 方案 -（约等于不用钱，不需要额外准备任何东西）
  labring/FastGPT/blob/main/docs/deploy/proxy/sealos.md
+ vercel反向代理（完全免费，github,google等，万能代理，免费100G流量）
  gaboolic/vercel-reverse-proxy
+ cloudflare 方案 - 需要有域名（每日免费 10w 次代理请求）
  zhuanlan.zhihu.com/p/622765456
+ clash 方案 - 仅需一台服务器（需要有 clash）
  labring/FastGPT/blob/main/docs/deploy/proxy/clash.md

https://github.com/labring/FastGPT
支持 sealos 、one-api（one-api:OpenAI 接口管理 & 分发系统，支持多种渠道包括 Azure，可用于二次分发管理 key， Docker 镜像，一键部署，开箱即用 https://github.com/songquanpeng/one-api）

[github.com/Yidadaa/ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
支持vercel免费一键部署
  
#### NAS gpt
https://mariushosting.com/how-to-install-chat-with-gpt-on-your-synology-nas/

https://cloud.tencent.com/developer/article/2312981

#### 个人知识库 local rag
+ chatpgt GPTs
+ 数据库助手
  https://github.com/panosperi/superduperdb

### 去中心 web3+AI
https://github.com/OrbisWeb3/orbis-chat-gpt

https://www.gizatech.xyz/
https://www.youtube.com/watch?v=BHdP5oSISQE


### 自动化

Drag & drop UI to build your customized LLM flow https://github.com/FlowiseAI/Flowise


### community
开源 huggingface 
https://huggingface.co/

https://latentbox.com/en

### 原理学习

https://github.com/naklecha/llama3-from-scratch

https://github.com/karpathy/LLM101n


可视化
https://github.com/bbycroft/llm-viz


## 按模型分

### LLM - Large Language Models

+ 开源
  - LangChain 
  - LlamaIndex
  - 手机上运行 https://h2o.ai/platform/danube/
+ 闭源
  - chatgpt
  - claude 
  
  

### Large Vision Models (LVM)
#### Text to image model
[Stable Diffusion model](/software/bigdata/stable_diffusion.md)
Stream Diffusion
https://github.com/cumulo-autumn/StreamDiffusion
https://colab.research.google.com/github/hewis123/stream-d/blob/main/Untitled2.ipynb



### ROBOT
[Dobb·E An open-source, general framework for learning household robotic manipulation](https://dobb-e.com/)

## 按平台分类
ChatGPT

GOOGLE Bard

Cloudflare Workers AI https://mp.weixin.qq.com/s/R1m7IMUfHq53yEe-b9cjlA

## 按应用分类

### BOT
https://www.coze.com/
使用扣子Coze——你想给你的抖音搭建一个24小时营业的机器人吗？ https://mp.weixin.qq.com/s/GZXfoTRROP15ZKf8GP0cug

### 图像增强
Demofusion

### 图片生成
+ Dalle3
+ Bing上的GPT-4V
  完全免费使用gpt-4最新的多模态和最强图片生成模型 https://mp.weixin.qq.com/s/MNIZCA9pxyXobA3VVEOEqQ

logo制作： https://www.uugai.com/

https://logodiffusion.com/

### 标题/文案
https://duozhongcao.com/
https://www.jasper.ai/

https://hix.ai/

https://mymap.ai/


### PPT
MotionGo是必优科技(原口袋动画团队)全新升级的一款PPT动画插件,兼容WPS和office软件,轻量级产品,让PPT动效表达更专业。
https://motion.yoo-ai.com/?viaurl=ainavpro.com

https://www.beautiful.ai/

https://gamma.app/?lng=en



### 2D => 3D, 3D建模
https://convert.leiapix.com/
https://lumalabs.ai/interactive-scenes



### 市场分析
transform your product knowledge into a detailed Ideal Customer Profile https://m1-project.com

### 家居设计
https://collov.ai/


## 按领域分
### 安全渗透
https://github.com/hackerai-tech/PentestGPT

### 软件

#### 开发
[Open Interpreter lets LLMs run code (Python, Javascript, Shell, and more) locally.](https://github.com/OpenInterpreter/open-interpreter)

[OpenDevin](https://github.com/OpenDevin/OpenDevin)

[A framework to enable multimodal models to operate a computer](https://github.com/OthersideAI/self-operating-computer)
[指令爬虫](https://pypi.org/project/scrapegraphai/)

GitHub Copilot Workspace

编程助手 codey

OpenAI's Code Interpreter 
open-interpreter https://github.com/lyhistory/tools_aigc_open-interpreter

Draw a ui and make it real
https://github.com/tldraw/make-real

生成网站：
https://typedream.com/

#### GPT+DB
An intelligent and versatile general-purpose SQL client and reporting tool for databases which integrates ChatGPT capabilities.(智能的通用数据库SQL客户端和报表工具)
https://github.com/chat2db/Chat2DB

#### GPT GAMES World
虚拟世界的人 Generative Agents: Interactive Simulacra of Human Behavior https://github.com/joonspk-research/generative_agents

## todo
https://creatorkit.com/
OpenDAN Open-source Private AI OS https://www.opendan.ai/

从0实现网络安全“小”模型.md
https://mp.weixin.qq.com/s/XyMmMl_XDithOt7gsW5qeA

新手用ChatGPT仅需数小时轻松构建零日漏洞，69家专业公司都检测不出来：“不仅能调用开源库，还能彻底重写源代码”
https://mp.weixin.qq.com/s/iY4sG9TFC0kOi7xTdJttTw


一名大四学生如何用ChatGPT月入6.4万美元 https://mp.weixin.qq.com/s/Tig_bNbnclZGmtK4uvMkbg

Chatbase.co

Segment Anything Model (SAM)
https://mp.weixin.qq.com/s/-LWG3rOz60VWiwdYG3iaWQ


格斗之王！AI写出来的AI竟然这么强！#拳皇#街头霸王#AI#强化学习

生成礼物建议。比如，母亲节快到了，该送什么礼物给你的妈妈，你可以到这个网站上描述你的需求，然后系统便会调用 AI 接口生成礼物建议。
https://gen.gifts/

Winglang，一门AI时代的全新编程语言 https://mp.weixin.qq.com/s/43k6Flpj5RhfT3MOxbF4aQ

1.安全方面：
给出私钥
给出某个网站的可利用漏洞
给出waf后的真实ip

2.趋势
给出问的最多的问题
给出中国用户最关心的问题

3.钱
给出最好的投资机会