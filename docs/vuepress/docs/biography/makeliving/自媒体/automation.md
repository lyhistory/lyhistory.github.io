从选材到制作上传视频-全自动化脚本运行
https://mp.weixin.qq.com/s/ZJeNBar21dILzSEiBHI01Q

我自己也创立了油管频道，所以对于油管的教程关注比较多，今天介绍这个教程是关于如何从YouTube Shorts获得免费流量以及如何解放劳动力，使用 python自动化该过程。



教程有些许门槛，涉及一些基础的编程知识，本文涉及很多的下载链接，如果确实没法消化或者不感兴趣，可直接划到最下方领取免费脚本。建议收藏，等到后期需要的时候再拿出来测试。



介绍的是思维以及运作的方法，你需要自己寻找不同的利基市场和货币化选项。



不应该简单地复制本电子书中提到的示例方法。此教程并非致富指南，而是一种经过充分研究的流量变现方法。



在本指南中分享的所有代码都经过测试，并在发布时可正常运行。考虑到YouTube算法可能会发生变化，因此请理解您可能需要调整您的频道策略。



洞察：对于垂直短视频，YouTube和Tiktok还有有一些区别，Youtube并不关心帐户的年龄，只要您可以验证与帐户关联的电话号码和电子邮件就能解锁额外的高级功能，例如在社区帖子和描述中添加链接。不过，YouTube和TikTok一样都是从原籍国推送内容。这意味着，如果您创建一个频道并上传来自爱尔兰的短视频，则超过 90%的视频观看者将来自爱尔兰，YouTube会尝试尽可能将其推送到本地。幸运的是，Youtube可以有办法克服这个问题，这个教程推荐的方法是专用 VPS。全自动短频道运行在具有2GB内存的共享 VPS 上。具有此类规格的虚拟服务器的价格可低至 5 美元/月。如果你不愿意在没赚钱的情况下进行任何投资，你可以先在你的电脑上运行。知道这个算法以及解决的方法就行了。



接来下进入正题：



获取YouTube shorts内容的方法数不胜数，但在本指南中，我将展示卡通和Reddit 故事的示例。这两个示例想法都可以获得大量的日常流量，但这些可能不是货币化的理想的利基。您可以简单地调整下面演示的方法来适应您自己的想法和利基。



栗子1：Short Reddit horror stories

栗子2：Random funny cartoon clips



步骤1：

您将需要Python来运行自动化。截至本指南发布,最稳定的版本将是 3.9.16（不是最新版本）



下载链接：https://www.python.org/downloads/



步骤2：

安装所需的库。为了让事情变得更简单，我们将安装一些 Python库来帮助我们完成自动化过程。要安装库，只需打开终端并输入 pip install library-name



为您的项目创建一个新文件夹，输入 cd 并将该文件夹拖放到终端窗口顶部。然后我们就可以开始安装库了。它应该看起来像这样：

这是我们需要的所有库的列表：

-MoviePy   https://pypi.org/project/moviepy/

-Requests  https://pypi.org/project/requests/

-Naked      https://pypi.org/project/Naked/

-NLTK        https://pypi.org/project/nltk/

-TTS          https://pypi.org/project/TTS/

-BS4          https://pypi.org/project/beautifulsoup4/

其他需求：

-eSpeak TTS module for Windows

https://github.com/espeak-ng/espeak-ng/releases/tag/1.51

-Some sort of text editor of your choice

https://notepad-plus-plus.org/

-FFMPEG library for Windows

https://github.com/BtbN/FFmpeg-Builds/releases

-lmageMagic editor software

https://imagemagick.org/



步骤3：

我们需要一些内容来使用，第一个示例将包括Reddit。没有多少人知道 Reddit 有这个功能。如果您转到任何 Reddit子版块并在 URL 栏中输入/random，您就会从该 Reddit 子版块中获得一个随机帖子。这意味着获取内容的系统已经就位，我们只需要“刮掉它”。我个人喜欢恐怖故事，所以让我们尝试使用 /r/shortscarystories 中的故事创建一些恐怖短片。



所以我们找到了我们想要的内容，但我们不想每次都自己复制粘贴。让我们编写一个简短的脚本来为我们完成这件事。在撰写本指南时，Reddit 的旧移动网站仍然处于活动状态，这非常方便抓取，因为它简单且加载速度快。我们可以通过输入 i 来访问它。在reddit.com前面。



该脚本的主要目标：

1.导航至https://i.reddit.com/r/shortscarvstories/random

2.找到正文的元素

3.从元素中提取故事文本

4. 将故事保存到文件

正如您所看到的，帖子的主体文本位于一些带有名为 usertext-body 的类的 div 标签之间，我们所要做的就是告诉我们的机器人导航到网页，找到具有相同类的元素，并获取文本。对于此任务，我们将使用 Requests库 来访问站点，并使用 BS4 来解释站点的HTML。就像任何流行网站一样，Reddit不喜欢机器人抓取他们的页面，但幸运的是，只要你不这样做，他们对此并没有那么严格。

为避免造成太多麻烦，让我们使用随机用户代理以防万一。如果您想抓取更多数据，可以使用他们的 API 来实现，但在本教程中，我们将保持简单。



它应该以 .py 文件扩展名保存，并且可以通过打开终端并输入py yourscript.py 进行测试脚本应该在同一目录中创建一个新的 .txt 文件。



步骤4：

通过上面的操作，我们有了内容，让我们制作视频吧！

您可以手动完成，但这并不有趣，所以让我们编写另一个python 脚本，将其转换为视频。



该视频将包括：

- 库存背景素材

- 叠加故事字幕

- 文字转语音

- 旁白背景音乐



该脚本的目标是将库存背景素材裁剪为 9:16 的宽高比，使用 TTS 将 Reddit 故事转换为音频，将其切成适合屏幕的单独文本行，使用 TTS 将这些行转换为音频并叠加，让它带有一些背景氛围。



在此代码的开头，我们定义必要的库并下载 NLTK 模块，该模块有助于将我们的脚本分成更小的句子，以使字幕适合屏幕。然后我们选择所需的 TTS 语音。第一次尝试此代码时，TTS 库将下载所选的语音。除了英语之外，还有相当多的语言，只需更改型号名称即可选择您想要的声音。



注意：

我标记了更改字幕速度的数字（更少 = 更快），但是要更改每 1 个字幕行的最大字数，您需要将所有 4 更改为所需的数字。当前设置为每个字幕行最多 4 个单词，因为使用当前字体很难在垂直视频中容纳更多单词。



以上自动化的方法也适用与其他平台，例如tiktok。



Image完整且可复制的脚本如下：



从 Reddit 上抓取内容

->https://pastebin.com/ZYU3KRZn

```
#Import the required libraries
import requests
from bs4 import BeautifulSoup
#Link to the subreddit of your choice
url = 'https://i.reddit.com/r/shortscarystories/random'
#Set a random useragent to avoid suspicion
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#Go the the url and get the sites data, allow redirects to get random story
response = requests.get(url, headers=headers, allow_redirects=True)
#Use BS4 (BeautifulSoup4 HTML library) to read the data
soup = BeautifulSoup(response.text, 'html.parser')
# Get the main body text of the post
main_text = soup.find('div', {'class': 'usertext-body'}).text.strip()
# Write the title and main text to a file
with open('video_script.txt', 'w') as f:
    f.write(main_text + '\n')
```
从故事生成视频 

->https://pastebin.com/gXHZ98Hz

```
# Import the necessary libraries and modules
import nltk  # for natural language processing tasks
import datetime  # for date and time manipulation
from TTS.api import TTS  # text to speech package
from moviepy.editor import *  # video editing package
from nltk.tokenize import sent_tokenize  # sentence tokenization from natural language
from moviepy.video.tools.subtitles import SubtitlesClip # tools for reading and displaying subtitles
# Download the 'punkt' module used for sentence tokenization if it has not already been downloaded
nltk.download('punkt')
 
# Select the model for text-to-speech conversion
model_name = TTS.list_models()[12]
# Create an instance of the selected text-to-speech model
tts = TTS(model_name)
# Open the text file containing the video script, and read the contents
video_script = open('video_script.txt', 'r').read()
# Convert the video script to an audio file using the selected text-to-speech model
tts.tts_to_file(text=video_script, file_path="voiceover.wav")
# Load the newly created audio file, and adjust the volume of the background music
new_audioclip = CompositeAudioClip([
    AudioFileClip("voiceover.wav"),
    AudioFileClip('background_music.mp3').volumex(0.2)
])
# Load the video file that will be used as the background of the final clip
video = VideoFileClip('background_video.mp4')
# Determine the dimensions of the video, and calculate the desired width based on the aspect ratio of 16:9
width, height = video.size
new_width = int(height * 9/16)
# Crop the video to the desired width, centered horizontally
clip = video.crop(x1=(width - new_width) / 2, x2=(width - new_width) / 2 + new_width)
# Set the audio of the cropped video to the adjusted background music and voiceover audio
clip.audio = new_audioclip
 
# Define a function to create subtitles for the video
def subtitles(sentences):
    # Initialize an empty list to store the SRT file contents
    srt_lines = []
    # Initialize the start and end time to zero
    start = datetime.timedelta(seconds=0)
    end = datetime.timedelta(seconds=0)
    # Initialize a counter to keep track of subtitle numbers
    counter = 1
    # Loop over each sentence in the list of sentences passed to the function
    for sentence in sentences:
        # Split the sentence into words
        words = sentence.split()
        # Calculate the number of lines needed for this sentence (assuming each line has 4 words)
        num_lines = len(words) // 4 + 1
        # Loop over each line of the sentence
        for j in range(num_lines):
            # Get the words for this line
            line_words = words[j * 4: (j + 1) * 4]
            # Join the words into a single string to form the line
            line = ' '.join(line_words)
            # Calculate the end time for this line based on the length of the line
            end += datetime.timedelta(seconds=len(line_words) * 0.35)
            # Check if the line is not empty
            if line:
                # Format the start and end times as strings in the SRT format
                start_str = '{:02d}:{:02d}:{:02d},{:03d}'.format(
                    start.seconds // 3600,
                    (start.seconds // 60) % 60,
                    start.seconds % 60,
                    start.microseconds // 1000
                )
                end_str = '{:02d}:{:02d}:{:02d},{:03d}'.format(
                    end.seconds // 3600,
                    (end.seconds // 60) % 60,
                    end.seconds % 60,
                    end.microseconds // 1000
                )
                # Add the subtitle number, start and end times, and line to the SRT list
                srt_lines.append(str(counter))
                srt_lines.append(start_str + ' --> ' + end_str)
                srt_lines.append(line)
                srt_lines.append('')
                # Increment the subtitle counter
                counter += 1
            # Update the start time for the next line
            start = end
    # Join the lines of the SRT file into a single string
    srt_file = '\n'.join(srt_lines)
    # Write the SRT file to disk
    with open("subtitles.srt", "w") as f:
        f.write(srt_file)
 
# Call the 'subtitles' function with a list of sentences, which are obtained by tokenizing the video script
subtitles(list(filter(None, (sent_tokenize(video_script)))))
# Define a lambda function to generate the subtitle clips from the SRT file
generator = lambda txt: TextClip(txt, font='Arial-Bold', fontsize=20, color='white', bg_color='rgba(0,0,0,0.4)')
# Create the subtitle clip from the SRT file
subtitle_source = SubtitlesClip("subtitles.srt", generator)
# Combine the video clip and the subtitle clip, and adjust the speed and length of the result
clip = CompositeVideoClip([clip, subtitle_source.set_pos(('center', 400))]).speedx(factor=1.1).subclip(0, 60)
# Write the final video clip to disk
clip.write_videofile("clip.mp4")
```
从电视剧集剪辑

->https://pastebin.com/U5RpYK70

```
import os  # importing os module for interacting with operating system
import random  # importing random module for generating random values
from moviepy.editor import *  # importing necessary classes from moviepy module
from moviepy.video.VideoClip import TextClip
 
# creating a list of .mp4 files in the 'Episodes' directory using list comprehension
mp4_files = [file for file in os.listdir('Episodes') if file.endswith('.mp4')]
# randomly choosing a file from the list
random_file = random.choice(mp4_files)
# creating the full path of the chosen video file
video_file = os.path.join('Episodes', random_file)
# loading the video file using VideoFileClip() class
video = VideoFileClip(video_file)
# getting the duration of the video
duration = video.duration
# choosing a random start time between 30 seconds and 60 seconds before the end of the video
start = random.uniform(30, max(30, duration - 60))
# choosing a random length between 20 seconds and 40 seconds
lenght = random.randint(20, 40)
# extracting the clip from the video using the chosen start time and length
clip = video.subclip(start, start + lenght)
# getting the width and height of the clip
width, height = clip.size
# calculating the aspect ratio of the clip
aspect_ratio = width / height
# calculating the new width of the clip with a 16:9 aspect ratio
new_width = int(height * 9/16)
# calculating the left margin to center the clip horizontally
left_margin = (width - new_width) / 2
# cropping the clip to the new width and centering it horizontally
clip = clip.crop(x1=left_margin, x2=left_margin + new_width)
# increasing the speed of the clip by 10%
clip = clip.speedx(factor=1.1)
# flipping the clip horizontally
clip = clip.fx(vfx.mirror_x)
# creating a TextClip object with the desired text and properties
text = "Surprise in comments\nEnter & WIN!"
txt_clip = TextClip(text, fontsize=15, color='white', font='Arial-Bold')
# setting the position of the text clip to be centered near the bottom of the screen
txt_clip = txt_clip.set_position(('center', 0.8), relative=True)
# creating a CompositeVideoClip object by combining the clip and text clip
final_clip = CompositeVideoClip([clip, txt_clip])
# setting the duration of the final clip to be the same as the cropped clip
final_clip.duration = clip.duration
# writing the final clip to a file named 'clip.mp4'
final_clip.write_videofile("clip.mp4")
```
Reddit 到视频

->https://pastebin.com/TdyF60wF

```
# Import the necessary libraries and modules
import nltk  # for natural language processing tasks
import datetime  # for date and time manipulation
import requests # for scraping reddit
from bs4 import BeautifulSoup # for reading html
from TTS.api import TTS  # text to speech package
from moviepy.editor import *  # video editing package
from nltk.tokenize import sent_tokenize  # sentence tokenization from natural language
from moviepy.video.tools.subtitles import SubtitlesClip # tools for reading and displaying subtitles
# Download the 'punkt' module used for sentence tokenization if it has not already been downloaded
nltk.download('punkt')
 
#Link to the subreddit of your choice
url = 'https://i.reddit.com/r/shortscarystories/random'
#Set a random useragent to avoid suspicion
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
#Go the the url and get the sites data, allow redirects to get random story
response = requests.get(url, headers=headers, allow_redirects=True)
#Use BS4 (BeautifulSoup4 HTML library) to read the data
soup = BeautifulSoup(response.text, 'html.parser')
# Get the main body text of the post
main_text = soup.find('div', {'class': 'usertext-body'}).text.strip()
# Write the title and main text to a file
with open('video_script.txt', 'w') as f:
    f.write(main_text + '\n')
 
# Select the model for text-to-speech conversion
model_name = TTS.list_models()[12]
# Create an instance of the selected text-to-speech model
tts = TTS(model_name)
# Open the text file containing the video script, and read the contents
video_script = open('video_script.txt', 'r').read()
# Convert the video script to an audio file using the selected text-to-speech model
tts.tts_to_file(text=video_script, file_path="voiceover.wav")
# Load the newly created audio file, and adjust the volume of the background music
new_audioclip = CompositeAudioClip([
    AudioFileClip("voiceover.wav"),
    AudioFileClip('background_music.mp3').volumex(0.2)
])
# Load the video file that will be used as the background of the final clip
video = VideoFileClip('background_video.mp4')
# Determine the dimensions of the video, and calculate the desired width based on the aspect ratio of 16:9
width, height = video.size
new_width = int(height * 9/16)
# Crop the video to the desired width, centered horizontally
clip = video.crop(x1=(width - new_width) / 2, x2=(width - new_width) / 2 + new_width)
# Set the audio of the cropped video to the adjusted background music and voiceover audio
clip.audio = new_audioclip
 
# Define a function to create subtitles for the video
def subtitles(sentences):
    # Initialize an empty list to store the SRT file contents
    srt_lines = []
    # Initialize the start and end time to zero
    start = datetime.timedelta(seconds=0)
    end = datetime.timedelta(seconds=0)
    # Initialize a counter to keep track of subtitle numbers
    counter = 1
    # Loop over each sentence in the list of sentences passed to the function
    for sentence in sentences:
        # Split the sentence into words
        words = sentence.split()
        # Calculate the number of lines needed for this sentence (assuming each line has 4 words)
        num_lines = len(words) // 4 + 1
        # Loop over each line of the sentence
        for j in range(num_lines):
            # Get the words for this line
            line_words = words[j * 4: (j + 1) * 4]
            # Join the words into a single string to form the line
            line = ' '.join(line_words)
            # Calculate the end time for this line based on the length of the line
            end += datetime.timedelta(seconds=len(line_words) * 0.35)
            # Check if the line is not empty
            if line:
                # Format the start and end times as strings in the SRT format
                start_str = '{:02d}:{:02d}:{:02d},{:03d}'.format(
                    start.seconds // 3600,
                    (start.seconds // 60) % 60,
                    start.seconds % 60,
                    start.microseconds // 1000
                )
                end_str = '{:02d}:{:02d}:{:02d},{:03d}'.format(
                    end.seconds // 3600,
                    (end.seconds // 60) % 60,
                    end.seconds % 60,
                    end.microseconds // 1000
                )
                # Add the subtitle number, start and end times, and line to the SRT list
                srt_lines.append(str(counter))
                srt_lines.append(start_str + ' --> ' + end_str)
                srt_lines.append(line)
                srt_lines.append('')
                # Increment the subtitle counter
                counter += 1
            # Update the start time for the next line
            start = end
    # Join the lines of the SRT file into a single string
    srt_file = '\n'.join(srt_lines)
    # Write the SRT file to disk
    with open("subtitles.srt", "w") as f:
        f.write(srt_file)
 
# Call the 'subtitles' function with a list of sentences, which are obtained by tokenizing the video script
subtitles(list(filter(None, (sent_tokenize(video_script)))))
# Define a lambda function to generate the subtitle clips from the SRT file
generator = lambda txt: TextClip(txt, font='Arial-Bold', fontsize=20, color='white', bg_color='rgba(0,0,0,0.4)')
# Create the subtitle clip from the SRT file
subtitle_source = SubtitlesClip("subtitles.srt", generator)
# Combine the video clip and the subtitle clip, and adjust the speed and length of the result
clip = CompositeVideoClip([clip, subtitle_source.set_pos(('center', 400))]).speedx(factor=1.1).subclip(0, 60)
# Write the final video clip to disk
clip.write_videofile("clip.mp4")
 
pos1 = ['Entry1', 'Entry2']
pos2 = ['Entry1', 'Entry2']
with open("count.txt", 'r') as file:
    counter = file.read()
title = f"Horror Story {random.choice(pos1)} #{counter} ({os.path.splitext(random_file)[0]})\n"
description = f"""{random.choice(pos2)} subscribe for more {os.path.splitext(random_file)[0]} | Special offer: yourcpalink
#tag1, #tag1, #tag3
"""
tag_list = ["tag1", "tag2", "tag3"]
tags = random.choice(tag_list)+','+random.choice(tag_list)+','+random.choice(tag_list)
with open("video_text.txt", 'w') as file:
    file.write(title+description+tags)
execute_js('upload.js')
```
卡通剪辑

->https://pastebin.com/1PEYc2tW

```
import os # Import the os module to handle file operations
import random # Import the random module to generate random numbers
from moviepy.editor import * # Import the necessary classes from the moviepy module
from moviepy.video.VideoClip import TextClip
from Naked.toolshed.shell import execute_js, muterun_js # Import execute_js and muterun_js from Naked.toolshed.shell
 
mp4_files = [file for file in os.listdir('Episodes') if file.endswith('.mp4')]  # Get all the .mp4 files in the Episodes directory
random_file = random.choice(mp4_files)  # Choose a random file from the list
video_file = os.path.join('Episodes', random_file)  # Construct the file path of the chosen video
video = VideoFileClip(video_file)  # Create a VideoFileClip object from the chosen video file
duration = video.duration  # Get the duration of the video in seconds
start = random.uniform(30, max(30, duration - 60))  # Choose a random starting time for the clip
length = random.randint(20, 40)  # Choose a random length for the clip
clip = video.subclip(start, start + length)  # Create a subclip from the chosen start time and length
width, height = clip.size  # Get the width and height of the clip
aspect_ratio = width / height  # Calculate the aspect ratio of the clip
new_width = int(height * 9/16)  # Calculate the new width of the clip based on a 16:9 aspect ratio
left_margin = (width - new_width) / 2  # Calculate the left margin needed to center the clip horizontally
clip = clip.crop(x1=left_margin, x2=left_margin + new_width)  # Crop the clip to the new dimensions
clip = clip.speedx(factor=1.1)  # Speed up the clip by 10%
clip = clip.fx(vfx.mirror_x)  # Apply a mirror effect to the clip
text = "Surprise in comments!\nSubscribe for more"  # Create the text to display in the video
txt_clip = TextClip(text, fontsize=15, color='white', font='Arial-Bold')  # Create a TextClip object with the specified text
txt_clip = txt_clip.set_position(('center', 0.8), relative=True)  # Set the position of the text relative to the center of the clip
final_clip = CompositeVideoClip([clip, txt_clip])  # Create a composite clip with the video clip and the text clip
final_clip.duration = clip.duration  # Set the duration of the final clip to match the duration of the video clip
final_clip.write_videofile("clip.mp4")  # Save the final clip as a new video file
 
pos1 = ['Entry1', 'Entry2']  # List of possible values for position 1 in the video title
pos2 = ['Entry1', 'Entry2']  # List of possible values for position 2 in the video description
with open("count.txt", 'r') as file:  # Open the count.txt file for reading
    counter = file.read()  # Read the current value of the counter from the file
title = f"Funny Cartoon {random.choice(pos1)} #{counter} ({os.path.splitext(random_file)[0]})\n"  # Construct the video title
description = f"""{random.choice(pos2)} subscribe for more {os.path.splitext(random_file)[0]} | Special offer: yourcpalink
#tag1, #tag1, #tag3
"""
tag_list = ["tag1", "tag2", "tag3"]
tags = random.choice(tag_list)+','+random.choice(tag_list)+','+random.choice(tag_list)
with open("video_text.txt", 'w') as file:
    file.write(title+description+tags)
 
# Execute a JavaScript file called "upload.js" to upload the video to YouTube
execute_js('upload.js')
 
# Increment a counter in a file called "count.txt" to keep track of the number of videos uploaded
with open("count.txt", 'r') as file:
    counter = int(file.read())
    counter += 1
with open("count.txt", 'w') as file:
    file.write(str(counter))
```

视频上传

->https://pastebin.com/USsm1pKC

```
// Import required packages
const fs = require('fs'); // For reading files
const puppeteer = require('puppeteer-core'); // For browser automation
const url = 'https://studio.youtube.com/'; // URL to navigate to
const delayRandom = require('delay-random'); // For adding random delays
 
// Read the upload text that was created previously
fs.readFile('upload_text.txt', 'utf8', function(err, data) {
    if (err) throw err; // Show if something is wrong with the file
    lines = data.split('\n'); // Split the file into individual lines
});
 
// Launch Puppeteer browser instance with a local cache storage
puppeteer.launch({
  userDataDir: './uploader_cache', // The location where the cache will be stored
  executablePath: require('puppeteer').executablePath(), // Path to the executable of a specific version of Chrome (installed by Puppeteer)
  headless: false, // Run the browser in GUI mode
  args: ['--no-sandbox'] // Arguments to pass to the browser
})
.then(async browser => {
    const page = await browser.newPage(); // Open a new page
    await page.setCacheEnabled(true); // Enable the cache to save the sessions
    await page.setViewport({ width: 1280, height: 720 }); // Set the size for the browser window
    // Read the cookies from a JSON file
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    // Add the cookies to the page
    for (const cookie of cookies) {
    await page.setCookie(cookie);
    }
    await page.goto(url); // Go to the YouTube Studio website
    await delayRandom(14000, 26000); // Wait for the website to load (adjust based on your internet speed)
    // From this point on, the script interacts with the website by clicking buttons and entering text
    await page.click('#create-icon'); // Click on the 'Create' button
    await delayRandom(1000, 2000); // Wait for the next step to load
    await page.click('#text-item-0'); // Click on the 'Text' option
    await delayRandom(1000, 2000); // Wait for the next step to load
    await page.click('#select-files-button'); // Click on the 'Select files' button
    await delayRandom(1000, 2000); // Wait for the next step to load
    const elementHandle = await page.$("input[type=file]"); // Get the file input element
    await elementHandle.uploadFile('clip.mp4'); // Upload the video file (make sure everything is in the same folder)
    await delayRandom(8000, 10000); // Wait for the file to upload (adjust based on your file size)
    await page.keyboard.type(lines[0], {delay: 150}); // Enter the title of the video
    await delayRandom(1000, 2000); // Wait for the next step to load
    await page.keyboard.press('Tab'); // Move to the next input field
    await delayRandom(500, 600); // Wait for the next step to load
    await page.keyboard.press('Tab'); // Move to the next input field
    await delayRandom(1000, 2000); // Wait for the next step to load
    await page.focus('#description-container'); //focus on the description container
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.type(lines[1], {delay: 150}); //type the first line of the description with a delay between keystrokes
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.type(lines[2], {delay: 150}); //type the second line of the description with a delay between keystrokes
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.click('#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(2)'); //click the "No, it's not made for kids" radio button
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.press('Tab'); //press the Tab key
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.press('Tab'); //press the Tab key again
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.press('Enter'); //press the Enter key
    await delayRandom(1000, 2000); //wait for a random amount of time
    for (let i = 0; i < 8; i++) { //loop 8 times
        await page.keyboard.press('Tab'); //press the Tab key
        await delayRandom(300, 600); //wait for a random amount of time
    }
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.type(lines[3], {delay: 150}); //type the third line of the description with a delay between keystrokes
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.click('#next-button'); //click the "Next" button
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.click('#next-button'); //click the "Next" button again
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.click('#next-button'); //click the "Next" button a third time
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.click('#offRadio'); //click the "Not made for kids" radio button
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.press('Tab'); //press the Tab key
    await delayRandom(1000, 2000); //wait for a random amount of time
    await page.keyboard.press('ArrowUp'); //press the Up Arrow key
    await delayRandom(15000, 20000); //wait for a random amount of time
    await page.click('#done-button');
    await delayRandom(15000, 20000);
    // At this point, the video should be uploaded. The following code navigates to the newly uploaded video's page and leaves a comment.
    // Get the URL of the newly uploaded video
    const element = await page.$('#share-url');
    const share = await page.evaluate(el => el.innerHTML, element);
    await page.goto(share);
    await delayRandom(10000, 15000);
    // Click the "Comments" button to expand the comments section
    await page.click('#comments-button');
    await delayRandom(5000, 10000);
    // Press the "Tab" key several times to navigate to the comment text box
    await page.keyboard.press('Tab');
    await delayRandom(1000, 2000);
    await page.keyboard.press('Tab');
    await delayRandom(1000, 2000);
    await page.keyboard.press('Tab');
    await delayRandom(1000, 2000);
    // Type the comment text into the text box
    await page.keyboard.type('Special prize for you: cpalinkhere', {delay: 150});
    await delayRandom(1000, 2000);
    // Click the "Submit" button to post the comment
    await page.click('#submit-button');
    await delayRandom(15000, 20000);
    // Print a message to indicate that the upload and comment posting are complete, and exit the script
    console.log('Upload completed')
    process.exit();
})
.catch(function(error) {
    console.error(error);
    //process.exit();
});
```


对于脚本感兴趣的同学可以再深入研究，但是基于YouTube和Tiktok算法随时可能会发生变化，因此需要随时调整策略。

