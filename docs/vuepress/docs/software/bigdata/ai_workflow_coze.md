

剪映小助手数据生成器

[剪映小助手](https://krxc4izye0.feishu.cn/wiki/APwFwznfQimfkgkz81ecfRsbnYc)


[speech_synthesis](https://bytedance.larkoffice.com/docx/WdDOdiB1BoRyBNxlkXWcn0n3nLc)

## 技巧
### 合并长语音

循环 LoopText2Audio

    输入：text_array->SplitLinesByComma.text_array
    中间变量：temp_audio
    输出：audio_list->speech_synthesis.link

    循环体 语音合成插件->speech_synthesis
        language 英文
        speaker_id Emily
        voice_id Anna
merge_audios
    format->mp3
    urls->LoopText2Audio.audio_list

    
## 案例
### 英文水平教学案例

LLM:

```
async def main(args: Args) -> Output:
    params = args.params
    # 构建输出对象
    prompt = f"""你是一名英国幼儿园教师，为3岁儿童设计{params['scene']}场景教学台词。请严格遵守：
1. **内容要求**  
   - 使用英式英语（例如"Tap"而非"Faucet"）  
   - 仅包含**动作指令短句**（动词开头，每句≤5单词）  
   - 覆盖6个洗手步骤：开水→湿手→抹皂→搓泡→冲洗→擦干  
   - 每步骤1-2句台词，共输出6到9句  

2. **格式要求**  
   - 每句英文单独一行  
   - 结尾**不加标点**（无句号/感叹号）  
   - 禁用编号、标题、额外说明  
   - 最终输出以逗号分隔的纯文本  

示例合格输出：  
Turn on the tap,  
Wet your hands,  
Rub the soap,
Rinse off bubbles,
Dry your hand
"""
    return {"custom_prompt": prompt}
```

SplitLinesByComma:

```
import re
from typing import List

async def main(args: Args) -> Output:
    params = args.params
    text = params['text'].strip()  # 获取输入文本并去除首尾空格
    # 构建输出对象
    def pure_punctuation_split(text: str) -> List[str]:
        # 1. 按换行符分割文本（保留段落结构）
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        sentences = []
        
        # 2. 遍历每行，按标点符号分句
        for line in lines:
            # 使用正则按标点分割，同时保留标点符号
            segs = re.split(r'([,.!?])', line)  # 关键点：捕获分组保留标点[1,7](@ref)
            buffer = ""
            for seg in segs:
                if seg in [',', '.', '!', '?']:
                    # 遇到标点时提交当前句子
                    if buffer:  # 避免空buffer追加标点
                        sentences.append(buffer.strip() + seg)  # 将标点附加到句尾
                    buffer = ""
                else:
                    buffer += seg
            # 收集剩余内容（无标号结尾的部分）
            if buffer: 
                sentences.append(buffer.strip())
        
        return sentences  # 直接返回按标点分割的句子列表
    
    # 返回分割结果
    return {"text_array": pure_punctuation_split(text)}
```


分支一：
    + 循环 LoopText2Audio

        输入：text_array->SplitLinesByComma.text_array
        中间变量：temp_audio
        输出：audio_list->speech_synthesis.link

        循环体 语音合成插件->speech_synthesis
            language 英文
            speaker_id Emily
            voice_id Anna

    + 插件剪映小助手数据生成器-> audio_timelines
        输入 links

分支二：
    + 循环 LoopText2Image
        输入：text_array->SplitLinesByComma.text_array
        输出：images-> 图像生成节点.data
        循环体 翻译节点--图像生成节点
  
两个分支合并：

+ 插件剪映小助手数据生成器 captions_infos
  texts->SplitLinesByComma.text_array
  timelines->audio_timelines.timelines
+ 插件剪映小助手数据生成器 audio_infos
  mp3_urls->LoopText2Audio.audio_list
  timelines->audio_timelines.timelines
+ 插件剪映小助手数据生成器 imgs_infos
  imgs->LoopText2Image.images
  timelines->audio_timelines.timelines
+ 插件剪映小助手 create_draft
  height 1080 width 1920
+ 插件剪映小助手 add_images
  draft_url->create_draft.draft_url
  image_infos->imgs_infos.infos
+ 插件剪映小助手 add_audio
  draft_url->create_draft.draft_url
  audio_infos->audio_infos.infos
+ 插件剪映小助手 add_captions
  draft_url->create_draft.draft_url
  captions_infos->captions_infos.infos
