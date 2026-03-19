[Run your own AI cluster at home with everyday devices ](https://github.com/exo-explore/exo)

## 桌面端自动化

[Browser automation CLI for AI agents](https://github.com/vercel-labs/agent-browser) 给 AI 的指令：你甚至不需要专门写代码，只需要在和 AI（比如 Cursor 的 Composer 或 Claude）对话时强调：“请使用 agent-browser 命令来浏览 Hacker News，不要使用 fetch 或其他工具。”agent-browser 并不是一个全新的浏览器内核，它底层依然可能调用 Chromium。但它做了一件非常聪明的事：它在“笨重”的浏览器和“昂贵”的 AI 之间，做了一个极其高效的翻译层。

[AutoMouser：AI Chrome扩展程序，实时跟踪用户的浏览器操作，自动生成自动化操作脚本](https://mp.weixin.qq.com/s/wWce-aQRajT2ZCV36TSUcA)

[Nanobrowser is an open-source AI web automation tool that runs in your browser. A free alternative to OpenAI Operator with flexible LLM options and multi-agent system](https://github.com/nanobrowser/nanobrowser)

[Bytebot is a self-hosted AI desktop agent that automates computer tasks through natural language commands, operating within a containerized Linux desktop environment.](https://github.com/bytebot-ai/bytebot)


[Fara-7B: An Efficient Agentic Model for Computer Use](https://github.com/microsoft/fara)

[Hyperagent is Playwright supercharged with AI. No more brittle scripts, just powerful natural language commands. Just looking for scalable headless browsers or scraping infra? Go to Hyperbrowser to get started for free!](https://github.com/hyperbrowserai/HyperAgent)

## 手机自动化
[Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM)

## 特定任务
Xianyu AutoAgent - 智能闲鱼客服机器人系统
https://github.com/shaxiu/XianyuAutoAgent
https://github.com/zhinianboke/xianyu-auto-reply

## workflow

+ [COZE](/software/bigdata/ai_workflow_coze.md)
+ [N8N](/software/bigdata/ai_workflow_n8n.md)
+ [DIFY](/software/bigdata/ai_workflow_dify.md)
+ [COMFY](/software/bigdata/ai_workflow_comfy.md)

## 爬虫
[An adaptive Web Scraping framework that handles everything from a single request to a full-scale crawl!](https://github.com/D4Vinci/Scrapling)

[指令爬虫](https://pypi.org/project/scrapegraphai/)

## all-in-one

### [OpenClaw](https://github.com/openclaw/openclaw)

[OpenClaw Use Cases that are actually helpful...](https://www.youtube.com/watch?v=Q7r--i9lLck)

[使用受限 kimi claw](https://www.kimi.com/)

#### deploy
[OpenClaw 完全指南：这可能是全网最新最全的系统化教程了！](https://zhuanlan.zhihu.com/p/2015027745743189513)

[Run OpenClaw For Free On NVIDIA RTX GPUs & DGX Spark](https://www.nvidia.com/en-us/geforce/news/open-claw-rtx-gpu-dgx-spark-guide/)

##### Setup on windows:

`powershell -c "irm https://openclaw.ai/install.ps1 | iex"`

+ telegram botfather
+ web search: gemini https://aistudio.google.com/api-keys
+ AI model: openrouter/free

 Hooks let you automate actions when agent commands are issued.          |
|  Example: Save session context to memory when you issue /new or /reset.  |
|                                                                          |
|  Learn more: https://docs.openclaw.ai/automation/hooks


 Enabled 3 hooks: boot-md, bootstrap-extra-files, session-memory  |
|                                                                   |
|  You can manage hooks later with:                                 |
|    openclaw hooks list                                            |
|    openclaw hooks enable <name>                                   |
|    openclaw hooks disable <name>                                  |
|                                                                   |
+-------------------------------------------------------------------+
Config overwrite: \.openclaw\openclaw.json 

Health check failed: gateway closed (1006 abnormal closure (no close frame)): no close reason
  Gateway target: ws://127.0.0.1:18789
  Source: local loopback
  Config: C:\Users\meesi\.openclaw\openclaw.json
  Bind: loopback
|
o  Health check help --------------------------------+
|                                                    |
|  Docs:                                             |
|  https://docs.openclaw.ai/gateway/health           |
|  https://docs.openclaw.ai/gateway/troubleshooting  |
|

|
o  Control UI -------------------------------------------------------------------------------+
|                                                                                            |
|  Web UI: http://127.0.0.1:18789/                                                           |
|  Web UI (with token):                                                                      |
|  http://127.0.0.1:18789/#token=xxxxx      |
|  Gateway WS: ws://127.0.0.1:18789                                                          |
|  Gateway: not detected (gateway closed (1006 abnormal closure (no close frame)): no close  |
|  reason)                                                                                   |
|  Docs: https://docs.openclaw.ai/web/control-ui                                             |
|                                                                                            |
+--------------------------------------------------------------------------------------------+
|
o  Workspace backup ----------------------------------------+
|                                                           |
|  Back up your agent workspace.                            |
|  Docs: https://docs.openclaw.ai/concepts/agent-workspace  |
|                                                           |
+-----------------------------------------------------------+
|
o  Security ------------------------------------------------------+
|                                                                 |
|  Running agents on your computer is risky — harden your setup:  |
|  https://docs.openclaw.ai/security                              |
|                                                                 |
+-----------------------------------------------------------------+
|
o  Shell completion -------------------------------------------------------+
|                                                                          |
|  Shell completion installed. Restart your shell or run: source ~/.zshrc  |
|                                                                          |
+--------------------------------------------------------------------------+
|
o  Dashboard ready ----------------------------------------------------------------+
|                                                                                  |
|  Dashboard link (with token):                                                    |
|  http://127.0.0.1:18789/#token=xxxxx  |
|  Opened in your browser. Keep that tab to control OpenClaw.                      |
|                                                                                  |
+----------------------------------------------------------------------------------+
|
|
o  Web search ------------------------------------------------------------------+
|                                                                               |
|  Web search is enabled, so your agent can look things up online when needed.  |
|                                                                               |
|  Provider: Gemini (Google Search)                                             |
|  API key: stored in config.                                                   |
|  Docs: https://docs.openclaw.ai/tools/web                                     |
|                                                                               |
+-------------------------------------------------------------------------------+
|
o  What now -------------------------------------------------------------+
|                                                                        |
|  What now: https://openclaw.ai/showcase ("What People Are Building").  |
|                                                                        |
+------------------------------------------------------------------------+
|
—  Onboarding complete. Dashboard opened; keep that tab to control OpenClaw.

##### Security
[OpenClaw Exposure Watchboard](https://openclaw.allegro.earth/)

|  OpenClaw is a hobby project and still in beta. Expect sharp edges.                        |
|  By default, OpenClaw is a personal agent: one trusted operator boundary.                  |
|  This bot can read files and run actions if tools are enabled.                             |
|  A bad prompt can trick it into doing unsafe things.                                       |
|                                                                                            |
|  OpenClaw is not a hostile multi-tenant boundary by default.                               |
|  If multiple users can message one tool-enabled agent, they share that delegated tool      |
|  authority.  (👉 If many people can talk to the same bot,
then all of them can use its powers.)                                                                              |
|                                                                                            |
|  If you’re not comfortable with security hardening and access control, don’t run           |
|  OpenClaw.                                                                                 |
|  Ask someone experienced to help before enabling tools or exposing it to the internet.     |
|                                                                                            |
|  Recommended baseline:                                                                     |
|  - Pairing/allowlists + mention gating.                                                    |
|  - Multi-user/shared inbox: split trust boundaries (separate gateway/credentials, ideally  |
|    separate OS users/hosts).                                                               |
|  - Sandbox + least-privilege tools.                                                        |
|  - Shared inboxes: isolate DM sessions (`session.dmScope: per-channel-peer`) and keep      |
|    tool access minimal.                                                                    |
|  - Keep secrets out of the agent’s reachable filesystem.                                   |
|  - Use the strongest available model for any bot with tools or untrusted inboxes.          |
|                                                                                            |
|  Run regularly:                                                                            |
|  openclaw security audit --deep                                                            |
|  openclaw security audit --fix                                                             |
|                                                                                            |
|  Must read: https://docs.openclaw.ai/gateway/security

#### mission control

[OpenClaw Office is the visual monitoring and management frontend for the OpenClaw Multi-Agent system. ](https://github.com/WW-AI-Lab/openclaw-office)

[Your OpenClaw Headquarters in 3D](https://www.claw3d.ai/)

[AI Agent Orchestration Dashboard - Manage AI agents, assign tasks, and coordinate multi-agent collaboration via OpenClaw Gateway.](https://github.com/abhi1693/openclaw-mission-control)

#### Social Network
[成功 A decentralized social network where AI agents discuss, debate, and build communities on the Nostr protocol](http://clawstr.com/)

[An experimental AI agent on OpenClaw interested in decentralized compute and Monero (XMR).](https://clawstr.com/npub1q9hrds25plzydrr8lna68j5whffznmetct7a8w7czew4nfd8g2uspe0glp)

[失败 A Social Network for AI Agents](https://www.moltbook.com/)


#### Skills
https://clawhub.ai/u/liumaimiao

[Skill Vetter](https://clawhub.ai/spclaudehome/skill-vetter)

https://github.com/VoltAgent/awesome-openclaw-skills

```
# 从ClawHub安装FreeRide技能
clawhub install freeride
# 重启OpenClaw使技能生效
openclaw gateway restart
# 触发FreeRide拉取模型列表并配置
openclaw chat "启动FreeRide技能，自动配置OpenRouter免费模型，设置5个备用模型"

# 查看当前模型配置
openclaw config get model.providers
```


#### Plugin
[Enhanced OpenClaw with MemOS Plugin](https://github.com/MemTensor/MemOS)

[One Command Line: Make any software agent-ready for OpenClaw, nanobot, Cursor, Claude Code, etc](https://github.com/HKUDS/CLI-Anything)

#### Trade


[7x24 AI Agent that saves and makes money autonomously.](https://github.com/Qiyd81/moneyclaw-py)


["ClawWork: OpenClaw as Your AI Coworker - 💰 $15K earned in 11 Hours"](https://github.com/HKUDS/ClawWork)

[如何用 OpenClaw 搭建一个 Polymarket 天气机器人，把 100 美元变成 8000 美元（一步一步教你）](https://x.com/Goon_JM001/status/2030874682292060370)

[OpenClaw x Polymarket：手把手教你搭建 自动交易机器人](https://zhuanlan.zhihu.com/p/2010445340654969470)

[梁文峰去年量化收益56.6%，我让龙虾复刻了一个7x24小时的量化交易系统。](https://mp.weixin.qq.com/s/o-pc1KW-rJCoZIqetlFM_w)

#### troubleshooting
?# clawhub login
fix: clawhub login --token <token>

?# network issues
```
14:43:16 [telegram] autoSelectFamily=true (default-node22)
14:43:16 [telegram] dnsResultOrder=ipv4first (default-node22)
14:43:27 [telegram] fetch fallback: enabling sticky IPv4-only dispatcher (codes=UND_ERR_CONNECT_TIMEOUT)
14:43:37 [telegram] telegram deleteMyCommands failed: Network request for 'deleteMyCommands' failed!
14:43:38 [telegram] telegram deleteWebhook failed: Network request for 'deleteWebhook' failed!
14:43:38 [telegram] webhook cleanup failed: Network request for 'deleteWebhook' failed!; retrying in 30s.
14:43:59 [telegram] telegram setMyCommands failed: Network request for 'setMyCommands' failed!
14:43:59 [telegram] command sync failed: HttpError: Network request for 'setMyCommands' failed!
```
fix: enable Tun AND Global routing if using vpn like v2ray

### Others

[MimiClaw turns a tiny ESP32-S3 board into a personal AI assistant.](https://github.com/memovai/mimiclaw)

[nanobot: Ultra-Lightweight Personal AI Assistant](https://github.com/HKUDS/nanobot)

[Open-source Agent OS built in Rust](http://github.com/RightNow-AI/openfang)
[Open-source orchestration for zero-human companies](https://github.com/paperclipai/paperclip)