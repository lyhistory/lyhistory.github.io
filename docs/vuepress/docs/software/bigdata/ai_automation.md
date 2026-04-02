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

[OpenClaw 完全指南：这可能是全网最新最全的系统化教程了！](https://zhuanlan.zhihu.com/p/2015027745743189513)

[Run OpenClaw For Free On NVIDIA RTX GPUs & DGX Spark](https://www.nvidia.com/en-us/geforce/news/open-claw-rtx-gpu-dgx-spark-guide/)

[OpenClaw: Architecture Deep Dive](https://gist.github.com/royosherove/971c7b4a350a30ac8a8dad41604a95a0)

[Moving Beyond the Prompt: How OpenClaw Actually Does the Work](https://www.mager.co/blog/2026-02-03-openclaw/)
[AI Agent 记忆管理系统：P0/P1/P2 优先级 + 自动归档，Token 降 78%](https://github.com/jzOcb/openclaw-memory-management)


#### Setup on windows:

`powershell -c "irm https://openclaw.ai/install.ps1 | iex"`

+ telegram botfather
+ web search: 
  - [gemini free tier](https://aistudio.google.com/api-keys) 
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

#### mission control

[OpenClaw Office is the visual monitoring and management frontend for the OpenClaw Multi-Agent system. ](https://github.com/WW-AI-Lab/openclaw-office)

[Your OpenClaw Headquarters in 3D](https://www.claw3d.ai/)

[AI Agent Orchestration Dashboard - Manage AI agents, assign tasks, and coordinate multi-agent collaboration via OpenClaw Gateway.](https://github.com/abhi1693/openclaw-mission-control)

```

在主机上启动网关：
openclaw gateway run
获取带令牌的仪表盘 URL：
openclaw dashboard --no-open
将 WebSocket URL 和令牌粘贴到上方，或直接打开带令牌的 URL。

改完config
openclaw doctor --fix
openclaw gateway restart

openclaw gateway --port 18789
# debug/trace mirrored to stdio
openclaw gateway --port 18789 --verbose
# force-kill listener on selected port, then start
openclaw gateway --force

临时换
/model deepseek/deepseek-chat

永久改默认：
openclaw models set deepseek/deepseek-chat

openclaw logs --follow

更新：
openclaw update
```

#### Security
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

#### AGENTS.md 配置

~/.openclaw/workspace/AGENTS.md

[IDENTITY.md](https://docs.openclaw.ai/reference/templates/IDENTITY)

[SOUL.md](https://docs.openclaw.ai/reference/templates/SOUL) = 性格（"你是一个随和、实在的助手"）

[USER.md](https://docs.openclaw.ai/reference/templates/USER) = 用户信息（"你在帮谁"）

[AGENTS.md](https://docs.openclaw.ai/reference/templates/AGENTS) = 工作手册（"每天上班先看邮件，写完代码要测试，删文件前要问我"）

[MEMORY.md 和 memorySearch](https://docs.openclaw.ai/reference/memory-config)

Session 类型说明:
+ 主 session你直接跟 AI 聊天的对话（Discord 私聊、WebChat）
+ 群聊 sessionDiscord 服务器里的群聊子 
+ agent sessionAI 派出去执行任务的子进程
+ cron session定时任务触发的对话

##### PART 1
```
## Every Session

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION**: Also read `MEMORY.md`

Don't ask permission. Just do it.

```
##### PART 2 Memory
version 1
```
## Memory

You wake up fresh each session. These files are your continuity:

- **Daily notes:** `memory/YYYY-MM-DD.md` — raw logs of what happened
- **Long-term:** `MEMORY.md` — curated memories

Capture what matters. Decisions, context, things to remember.

Always use memory_search if you need to find past discussions. Don't say "no context found" - check the memory files directly.
```

version 2
```
## Memory 

You wake up fresh each session. These files are your continuity.

### Memory Layers
| Layer | File | Purpose |
|------|------|------|
| Index Layer | `MEMORY.md` | Overview of the user, capabilities, and memory index. Keep it concise (<40 lines) |
| Project Layer | `memory/projects.md` | Current status and TODOs for each project |
| Infrastructure Layer | `memory/infra.md` | Quick reference for servers, APIs, deployments |
| Lessons Layer | `memory/lessons.md` | Pitfalls encountered, categorized by severity |
| Log Layer | `memory/YYYY-MM-DD.md` | Daily raw records |

### Writing Rules
- Logs are written to `memory/YYYY-MM-DD.md`, see format below
- Project status: update `memory/projects.md` when progress is made
- Lessons: record in `memory/lessons.md` after encountering issues
- MEMORY.md: only update when the index changes, keep it concise

### Log Format
### [PROJECT:Name] Title
- **Conclusion**: One-line summary
- **File Changes**: Files involved
- **Lessons**: Pitfalls encountered (if any)
- **Tags**: #tag1 #tag2

### Golden Rules
- Record conclusions, not processes
- Use tags for easier memorySearch retrieval
- "Mental notes" don't survive session restarts. Files do.
```

version 3
```
You wake up fresh each session. These files are your continuity:

MEMORY.md (curated, long-term)

Keep stable facts, owner preferences, key decisions, and important relationships here.
Regularly review and update it — remove stale info, add confirmed patterns.
Important: MEMORY.md is only auto-loaded in DMs. When you’re responding in a guild channel, always run memory_get MEMORY.md first so you have your full context. This is critical — don’t respond in channels without checking your memory.
You can read, edit, and update MEMORY.md freely in main sessions.
Write significant events, thoughts, decisions, opinions, lessons learned.
Over time, review your daily files and update MEMORY.md with what’s worth keeping.

memory/YYYY-MM-DD.md (daily logs)

Write daily notes, conversation summaries, and observations here.
Create a new file each day (e.g., memory/2026-03-09.md). Create the memory/ directory if needed.
Today’s and yesterday’s logs are loaded into your context automatically.
Older logs are searchable but not loaded directly.

Write It Down — No “Mental Notes”!

Memory is limited — if you want to remember something, WRITE IT TO A FILE.
“Mental notes” don’t survive session restarts. Files do.
When someone says “remember this” → update memory/YYYY-MM-DD.md or MEMORY.md
When you learn a lesson → write it down
When you make a mistake → document it so future-you doesn’t repeat it

What to remember

Owner preferences and standing instructions
Who you’ve worked with and how it went
Project state, commitments, deadlines
Anything notable that happened
Your owner authenticating with their key
Updates about the desk you setup in #the-market

What not to remember

Transient chat that doesn’t affect future behavior
Exact message quotes (summarize instead)
```

##### PART 3 Security
```
## Safety

- Don't exfiltrate private data. Ever.
- Don't run destructive commands without asking.
- `trash` > `rm` (recoverable beats gone forever)
- When in doubt, ask.

## External vs Internal

**Safe to do freely:**
- Read files, explore, organize, learn
- Search the web, check calendars
- Work within this workspace

**Ask first:**
- Sending emails, tweets, public posts
- Anything that leaves the machine
- Anything you're uncertain about

## Group Chats

You have access to your human's stuff. That doesn't mean you share it.
In groups, you're a participant — not their voice, not their proxy.
```


#### 记忆系统实战 — 用 memoryFlush 解决 AI 失忆，让记忆自动维护

为什么 OpenClaw 聊着聊着 AI 会"失忆"？这是搜索量很高的一个问题。原因是 OpenClaw 的上下文压缩（compaction）触发了。每个模型都有上下文窗口限制（Claude 是 200K token）。当对话接近这个限制时，OpenClaw 会自动把旧对话压缩成摘要腾出空间——压缩过程中可能丢失细节。

openclaw.json

```
{
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000
        }
      }
    }
  }
}
```
SiliconFlow 提供的 bge-m3 向量模型完全免费：
```
{
  "memorySearch": {
    "enabled": true,
    "provider": "openai",
    "remote": {
      "baseUrl": "https://api.siliconflow.cn/v1",
      "apiKey": "你的 SiliconFlow API key"
    },
    "model": "BAAI/bge-m3"
  }
}
```
在 HEARTBEAT.md 里加上每周自动维护任务：
```
## 记忆维护（每周一次）

读取 `memory/heartbeat-state.json`，检查 `lastMemoryMaintenance` 字段。
如果距今 >= 7 天：
1. 读最近 7 天的 `memory/YYYY-MM-DD.md` 日志
2. 提炼有价值的信息到对应文件（projects.md / lessons.md）
3. 压缩已完成一次性任务的日志为一行结论
4. 删除过期信息
5. 更新 `heartbeat-state.json` 的 `lastMemoryMaintenance` 为今天
```

OpenClaw memoryFlush 开了还是失忆怎么办？A：检查 softThresholdTokens 是否设够大（推荐 4000）。对话特别关键时，手动 /compact 重点保留XXX 指定保留内容。

#### 子 Agent 并行任务
[Sub-agents are background agent runs spawned from an existing agent run. They run in their own session (agent:<agentId>:subagent:<uuid>) and, when finished, announce their result back to the requester chat channel.](https://docs.openclaw.ai/tools/subagents)

默认情况下 AI 是"单线程"的，做完一件才做下一件。子 Agent 让主 AI（主脑）可以派出独立的 AI 子进程并行处理任务，每个子 Agent 有自己的 session，执行完自动汇报结果。

第一步：在 AGENTS.md 里声明使用规范
```
## 子 Agent

如果任务比较复杂或耗时较长，可以派子 agent 去执行。

### 模型选择策略
| 等级 | 模型别名 | 适用场景 |
|------|----------|----------|
| 🔴 高 | opus | 复杂架构设计、多文件重构、深度推理 |
| 🟡 中 | sonnet | 写代码、写脚本、信息整理（默认） |
| 🟢 低 | haiku | 简单文件操作、格式转换、搜索汇总 |
```
第二步：在 openclaw.json 里配置模型别名
```
{
  "models": {
    "your-provider/claude-opus-4": { "alias": "opus" },
    "your-provider/claude-sonnet-4": { "alias": "sonnet" },
    "your-provider/claude-haiku-4": { "alias": "haiku" }
  }
}
```

子 Agent 是"零上下文"的，只能看到主脑给它的 task 描述，所以描述质量决定输出质量。
好的 task 描述（包含目标、路径、约束、输出格式）：
```
## 任务：代码安全审查

### 目标
审查 /root/project/src/ 目录下的所有 .js 文件，重点检查 API 安全问题。

### 关注点
1. SQL 注入风险
2. 未验证的用户输入
3. 硬编码的密钥或 token
4. 缺少权限检查的 API 端点

### 约束
- 只读不写，不要修改任何文件
- 忽略 node_modules/ 和 test/ 目录

### 输出格式
按严重程度分级（🔴致命 / 🟡重要 / 🟢建议），每个问题给出：文件路径、行号、问题描述、修复建议。

### 结果
写入 /root/project/SECURITY-REVIEW.md
```
OpenClaw 子 Agent 并发限制经验值：同时最多跑 2 个子 Agent，4 个基本触发 API 429 限流。有依赖关系的任务（B 依赖 A 的输出）必须串行，在 AGENTS.md 里提醒主脑注意任务依赖即可。

/subagents list
/subagents kill <id|#|all>
/subagents log <id|#> [limit] [tools]
/subagents info <id|#>
/subagents send <id|#> <message>
/subagents steer <id|#> <message>
/subagents spawn <agentId> <task> [--model <model>] [--thinking <level>]

#### [Cron 定时任务配置 — 精确到分钟的 AI 自动化](https://docs.openclaw.ai/automation/cron-jobs)

openclaw cron list                     # 查看所有任务
openclaw cron runs --id <任务ID>       # 查看执行历史
openclaw cron edit <任务ID> --disable  # 禁用（推荐，而不是删除）

8 AM daily	0 8 * * *
Every 12 hours	0 */12 * * *
Every day at midnight	0 0 * * *

```
{
  "name": "项目周报",
  "schedule": { "kind": "cron", "expr": "0 10 * * 1", "tz": "Asia/Shanghai" },
  "payload": { 
    "kind": "agentTurn", 
    "message": "读取 memory/ 目录下最近 7 天的日志文件，整理成一份周报。包含：本周完成的事项、进行中的项目、遇到的问题、下周计划。格式简洁，用 bullet points。",
    "model": "sonnet"
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce" }
}
```

OpenClaw Cron 任务设了但没触发？A：99% 是时区问题——没设 tz 字段导致按 UTC 执行。另外检查 delivery.mode 是否设为 "announce"，不设任务静默执行，你不会收到通知。

#### openclaw.json 配置速查表 — 把每个参数调到最优
所有配置写在 ~/.openclaw/openclaw.json，修改后 openclaw gateway restart 生效。

升级3.31后老弹审批？
```
tools: {
  exec: {
    ask: "off",
    security: "full"
  }
}
```

blockStreaming — 解决 AI 长回复要等很久的问题
```
{
  "agents": {
    "defaults": {
      "blockStreamingDefault": "on",
      "blockStreamingBreak": "text_end",
      "blockStreamingChunk": { "minChars": 200, "maxChars": 1500 }
    }
  }
}
```
ackReaction — 发消息后立刻知道 AI 收到了
```
{
  "channels": {
    "discord": { "ackReaction": "🫐" },
    "telegram": { "ackReaction": "👀" }
  }
}
```
Heartbeat 调优 — 防止 AI 在非活跃时间骚扰你
```
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30m",
        "target": "last",
        "activeHours": { "start": "08:00", "end": "23:00" }
      }
    }
  }
}
```

#### Skills
```
<workspace>/skills/     ← 你自己写的（最高优先级）
~/.openclaw/skills/     ← 全局安装的
内置 skill              ← OpenClaw 自带的（最低）
```
https://clawhub.ai/u/liumaimiao

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
1. Security
Clawsec
```
npx clawhub@latest install clawsec
# 手动审计特定技能clawsec audit <skill-name>
```
[Skill Vetter](https://clawhub.ai/spclaudehome/skill-vetter)

2. Proactive Agent：从“被动应答”到“主动服务”
```
npx clawhub@latest install proactive-agent
```

3. 进化
Self-Improving Agent
```
npx clawhub@latest install self-improving-agent
# 初始化学习目录
mkdir -p ~/.openclaw/workspace/.learnings
# 启用 Hook (自动记录)
openclaw hooks enable self-improvement
```

4. 扩展技能
+ Find-Skills：元技能
  需先安装 GitHub CLI (brew install gh) 并完成认证 (gh auth login)。
  "找一个能批量重命名图片、支持加水印的技能"
+ Systematic-Debugging
  "我的代码报错了，请启动 systematic-debugging 流程帮我排查"
+ 实时搜索引擎
  ```
  npx clawhub@latest install tavily-search
  # 配置免费 API Key (每月 1000 次额度)
  openclaw config set skills.tavily-search.apiKey "YOUR_API_KEY"

  npx clawhub@latest install multi-search-engine
  ```
  ❌ 无 Tavily：问“2026 年 OpenClaw 最新特性”，回答：“我的知识截止到 2025 年...”
  ✅ 有 Tavily：实时搜索并总结：“2026 版新增了多模态沙箱，主要变化有三点...”
+ Ontology：构建结构化的知识图谱
  ```
  npx clawhub@latest install ontology
  # 查看当前知识图谱
  openclaw ontology query
  ```
  你说：“我喜欢简洁风格的 PPT。”Ontology 记录：实体：用户 -> 属性：偏好 -> 值：简洁风格。下次你让它做 PPT，它自动应用该风格，无需重复指令。
+ 特定任务
  - Office-Automation


#### Plugin
[MemOS Cloud OpenClaw Plugin (Lifecycle)](https://github.com/MemTensor/MemOS-Cloud-OpenClaw-Plugin)
[Enhanced OpenClaw with MemOS Plugin](https://github.com/MemTensor/MemOS)

[One Command Line: Make any software agent-ready for OpenClaw, nanobot, Cursor, Claude Code, etc](https://github.com/HKUDS/CLI-Anything)

#### Social Network
[成功 A decentralized social network where AI agents discuss, debate, and build communities on the Nostr protocol](http://clawstr.com/)

[An experimental AI agent on OpenClaw interested in decentralized compute and Monero (XMR).](https://clawstr.com/npub1q9hrds25plzydrr8lna68j5whffznmetct7a8w7czew4nfd8g2uspe0glp)

[失败 A Social Network for AI Agents](https://www.moltbook.com/)

#### Troubleshooting
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

### Trade

[AlphaClaw wraps OpenClaw with a convenient setup wizard, self-healing watchdog, Git-backed rollback, and full browser-based observability. Ships with anti-drift prompt hardening to keep your agent disciplined, and simplifies integrations (e.g. Google Workspace, Google Pub/Sub, Telegram Topics, Slack, Discord) so you can manage multiple agents from one UI instead of config files.](https://github.com/chrysb/alphaclaw)

[7x24 AI Agent that saves and makes money autonomously.](https://github.com/Qiyd81/moneyclaw-py)


["ClawWork: OpenClaw as Your AI Coworker - 💰 $15K earned in 11 Hours"](https://github.com/HKUDS/ClawWork)

[如何用 OpenClaw 搭建一个 Polymarket 天气机器人，把 100 美元变成 8000 美元（一步一步教你）](https://x.com/Goon_JM001/status/2030874682292060370)

[OpenClaw x Polymarket：手把手教你搭建 自动交易机器人](https://zhuanlan.zhihu.com/p/2010445340654969470)

[梁文峰去年量化收益56.6%，我让龙虾复刻了一个7x24小时的量化交易系统。](https://mp.weixin.qq.com/s/o-pc1KW-rJCoZIqetlFM_w)


### Others

[MimiClaw turns a tiny ESP32-S3 board into a personal AI assistant.](https://github.com/memovai/mimiclaw)

[nanobot: Ultra-Lightweight Personal AI Assistant](https://github.com/HKUDS/nanobot)

[Open-source Agent OS built in Rust](http://github.com/RightNow-AI/openfang)
[Open-source orchestration for zero-human companies](https://github.com/paperclipai/paperclip)