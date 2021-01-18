
# About Me

笔者毕业于新加坡国立大学，在传统行业软件开发、大数据、区块链、安全等领域都有实战技术积累，并且在物联网机器学习等方面也有知识积累，
经历从普通程序员到全栈开发，从.NET开发到JAVA Microservice，从windows服务器到Linux服务器，从中心化的平台到去中心化的应用，实践出真知，
而现在由系统开发者切入道德黑客的视角学习实践，由于看到目前很多资料都是没有经过实际测试错误百出，所以决定开始创立这个圈子，
笔者本着科班的系统学习态度，翻译专业材料，整理资源，分享经验，答疑解惑
这里只是公开部分资源，需要更多资源或者答疑请扫描加入我的知识星球：coder2hacker

![](/docs/resources/images/zhishixingqiu.jpg)

# About the site

## general setting

domain provider: cn.aliyun.com
dns resolver: cloudflare.com

## blog：lyhistory.com

- jekyll
- Minimal-mistakes

## docs: lyhistory.com/docs

- vuepress
```
cd docs\vuepress
npm install -D vuepress
vim package.json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
mkdir docs
npm run docs:build
config docs\vuepress\docs\.vuepress\config.js
npm run docs:build
cp \docs\.vuepress\dist\* ..\docs\ (from \lyhistory.github.io\docs\vuepress\docs\.vuepress\dist\* to \lyhistory.github.io\docs)

gitignore nodemodules

config: \docs\vuepress\docs\.vuepress\config.js
resources: \docs\vuepress\docs\.vuepress\public
custom css: \docs\vuepress\docs\.vuepress\styles
build result: \docs\vuepress\docs\.vuepress\dist
finally publish to: ..\docs\
```