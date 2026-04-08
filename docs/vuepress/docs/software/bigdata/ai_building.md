
## 方法论
[AI Code Guide is a roadmap to start coding with AI](https://github.com/automata/aicodeguide)

### build on existing github projects
1. 方法1
[Put an end to code hallucinations! GitMCP is a free, open-source, remote MCP server for any GitHub project](https://github.com/idosal/git-mcp)

Step 1: Choose the type of server you want
Choose one of these URL formats depending on what you want to connect to:

For GitHub repositories: gitmcp.io/{owner}/{repo}
For GitHub Pages sites: {owner}.gitmcp.io/{repo}
For a generic tool that supports any repository (dynamic): gitmcp.io/docs
Replace {owner} with the GitHub username or organization name, and {repo} with the repository name.

Step 2: Connect your AI assistant
Select your AI assistant from the options below and follow the configuration instructions:

```
Connecting Cursor
Update your Cursor configuration file at ~/.cursor/mcp.json:

{
  "mcpServers": {
    "gitmcp": {
      "url": "https://gitmcp.io/{owner}/{repo}"
    }
  }
}
Connecting Claude Desktop
In Claude Desktop, go to Settings > Developer > Edit Config
Replace the configuration with:
{
  "mcpServers": {
    "gitmcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://gitmcp.io/{owner}/{repo}"
      ]
    }
  }
}
Connecting Windsurf
Update your Windsurf configuration file at ~/.codeium/windsurf/mcp_config.json:

{
  "mcpServers": {
    "gitmcp": {
      "serverUrl": "https://gitmcp.io/{owner}/{repo}"
    }
  }
}
Connecting VSCode
Update your VSCode configuration file at .vscode/mcp.json:

{
  "servers": {
    "gitmcp": {
      "type": "sse",
      "url": "https://gitmcp.io/{owner}/{repo}"
    }
  }
}
Connecting Cline
Update your Cline configuration file at ~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json:

{
  "mcpServers": {
    "gitmcp": {
      "url": "https://gitmcp.io/{owner}/{repo}",
      "disabled": false,
      "autoApprove": []
    }
  }
}
Connecting Highlight AI
Open Highlight AI and click the plugins icon (@ symbol) in the sidebar
Click Installed Plugins at the top of the sidebar
Select Custom Plugin
Click Add a plugin using a custom SSE URL
Plugin name: gitmcp SSE URL: https://gitmcp.io/{owner}/{repo}

For more details on adding custom MCP servers to HighlightAI, refer to the documentation.

Connecting Augment Code
Open Augment Code settings
Navigate to the MCP section
Add a new MCP server with the following details:
Name the MCP server: git-mcp Docs

Use this command:

npx mcp-remote https://gitmcp.io/{owner}/{repo}
Or use the following configuration:

{
  "mcpServers": {
    "git-mcp Docs": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://gitmcp.io/{owner}/{repo}"
      ]
    }
  }
}
Connecting Msty AI
Open Msty Studio
Go to Tools > Import Tools from JSON Clipboard
Paste the following configuration:
{
  "mcpServers": {
    "git-mcp Docs": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://gitmcp.io/{owner}/{repo}"
      ]
    }
  }
}
```
2. 方法2
STEP 1: [Injest code - Turn any Git repository into a simple text digest of its codebase.](https://gitingest.com/)

STEP 2: Feed previous result(Directory Structure AND File Content) to LLM

STEP 3: Give requirement

## Protocol
Model Context Protocol vs Function Calling:

[Model Context Protocol Clearly Explained](https://www.youtube.com/watch?v=tzrwxLNHtRY)

[Sample MCP client](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-chatbot/mcp_simple_chatbot/main.py)
[Google maps MCP server](https://github.com/modelcontextprotocol/servers/blob/main/src/google-maps/index.ts#L297)
[MCP Schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2024-11-05/schema.ts)
[Simple tool, resource, prompt servers](https://github.com/modelcontextprotocol/python-sdk/tree/main/examples/servers)
[Example servers](https://modelcontextprotocol.io/examples)
[MCP inspector (postman like tool)](https://modelcontextprotocol.io/docs/tools/inspector)


## coding

[antigravity](https://antigravity.google/)

https://github.com/google-gemini/gemini-cli

codex

阿里百炼 多模态

GitHub Copilot Workspace

编程助手 codey

OpenAI's Code Interpreter 
open-interpreter https://github.com/lyhistory/tools_aigc_open-interpreter

[AutoGLM: Autonomous Foundation Agents for GUIs](https://xiao9905.github.io/AutoGLM/)

[Omni Engineer：无需等待，几秒内生成应用程序！（ 支持 Ollama & Code Agent ）](https://mp.weixin.qq.com/s/Pu7ucvoYudcci9ukZ1xDhw)

[Open Interpreter lets LLMs run code (Python, Javascript, Shell, and more) locally.](https://github.com/OpenInterpreter/open-interpreter)

[OpenDevin](https://github.com/OpenDevin/OpenDevin)

[A framework to enable multimodal models to operate a computer](https://github.com/OthersideAI/self-operating-computer)

### 流程控制

[An open source toolkit that allows you to focus on product scenarios and predictable outcomes instead of vibe coding every piece from scratch.](https://github.com/github/spec-kit)

[BuildingAI is an enterprise-grade open-source intelligent agent platform designed for AI developers, AI entrepreneurs, and forward-thinking organizations. ](https://github.com/BidingCC/BuildingAI)

[Vibe Coding 是一个与 AI 结对编程的终极工作流程，旨在帮助开发者丝滑地将想法变为现实。本指南详细介绍了从项目构思、技术选型、实施规划到具体开发、调试和扩展的全过程，强调以规划驱动和模块化为核心，避免让 AI 失控导致项目混乱。](https://github.com/2025Emma/vibe-coding-cn)

[Antigravity -> Customize->workflow](https://github.com/JStaRFilms/VibeCode-Protocol-Suite)

[MetaGPT: The Multi-Agent Framework](https://github.com/FoundationAgents/MetaGPT)

### UI 
https://typedream.com/
[前端v0.dev](https://v0.dev/)

Google lab stitch

Draw a ui and make it real
https://github.com/tldraw/make-real

### GPT+DB
An intelligent and versatile general-purpose SQL client and reporting tool for databases which integrates ChatGPT capabilities.(智能的通用数据库SQL客户端和报表工具)
https://github.com/chat2db/Chat2DB

### GPT GAMES World
虚拟世界的人 Generative Agents: Interactive Simulacra of Human Behavior https://github.com/joonspk-research/generative_agents

## hardware

[Create hardware prototype designs by chatting with AI](https://www.blueprint.am/)

[LeRobot: Making AI for Robotics more accessible with end-to-end learning](https://github.com/huggingface/lerobot)

[LeKiwi - Low-Cost Mobile Manipulator](https://github.com/SIGRobotics-UIUC/LeKiwi)

[玩转树莓派4B-部署LLM大模型-1](https://mp.weixin.qq.com/s/-BcvjR4Dntz2M9NH4VayoQ)

[A wireless mod for the TI-84 (not CE).](https://github.com/chromalock/TI-32)

#### open glass
[Turn any glasses into AI-powered smart glasses](https://github.com/BasedHardware/OpenGlass)
#### GPT+Eyes
https://www.youtube.com/watch?v=w-wxguIs-0I
#### GPT Robot
https://hackaday.io/project/189041-a-workbench-companion-from-an-amazon-echo-dot
https://www.youtube.com/watch?v=bO-DWWFolPw&embeds_referring_euri=https%3A%2F%2Fhackaday.io%2F&source_ve_path=MjM4NTE&feature=emb_title


[花60元，DIY了一个AI机器人，能聊天，会认人……](https://mp.weixin.qq.com/s/qQcO0oS01DtwiU9-OXhgAw)
