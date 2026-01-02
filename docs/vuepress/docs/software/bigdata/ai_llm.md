## NexaSDK 

[Run frontier LLMs and VLMs with day-0 model support across GPU, NPU, and CPU, with comprehensive runtime coverage for PC (Python/C++), mobile (Android & iOS), and Linux/IoT (Arm64 & x86 Docker). Supporting OpenAI GPT-OSS, IBM Granite-4, Qwen-3-VL, Gemma-3n, Ministral-3, and more.](https://github.com/NexaAI/nexa-sdk)

## Ollama

Ollama is an open-source project that serves as a powerful and user-friendly platform for running LLMs on your local machine.

https://ollama.com/

chat mode
server mode

user env:
- OLLAMA_MODELS
- OLLAMA_HOST 0.0.0.0
- OLLAMA_ORIGIN *

Note: 如果系统变量不行，改成用户变量，Ollama prioritizes user environment variables over system ones when loading model paths; meaning the system-wide setting is being ignored unless explicitly configured otherwise. 

Port: 11434

Log path: \Users\meesi\AppData\Local\Ollama\Server.log

Models:

+ Deepseek
    - [越狱版huihui_ai/deepseek-r1-abliterated](https://ollama.com/huihui_ai/deepseek-r1-abliterated)
    `ollama run huihui_ai/deepseek-r1-abliterated`
+ other


### ollama+ AnythingLLM

0基础！一行代码部署Gemma！纯本地！主打一个快！不用搞依赖！7B尺寸超13B性能！附模型下载！
https://mp.weixin.qq.com/s/4hjewv3TFI5fqe66PaT6Tg

### 从零开始亲手训练一个极小的语言模型

[🚀🚀 「大模型」2小时完全从0训练26M的小参数GPT！🌏 Train a 26M-parameter GPT from scratch in just 2h!](https://github.com/jingyaogong/minimind)

## ChatGPT

+ tokens
  Prices are per 1,000 tokens. You can think of tokens as pieces of words, where 1,000 tokens is about 750 words. This paragraph is 35 tokens.
  https://platform.openai.com/tokenizer

ChatGPT is based on GPT-3. There are four main models that GPT-3 model offers:

Davinci — Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.
Curie — Very capable, but faster and lower cost than Davinci.
Babbage — Capable of straightforward tasks, very fast, and lower cost.
Ada — Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.

https://platform.openai.com/docs/models/gpt-3

Clip:
CLIP Contrastive Language-Image Pre-Training 是OpenAI于2021年提出的一个模型。CLIP将图像和文本编码成向量，可以在同一空间进行比较的表示。

https://mp.weixin.qq.com/s/wOqBjAfEGheevtVykpHeIg

https://mazzzystar.github.io/2022/12/29/Run-CLIP-on-iPhone-to-Search-Photos/

https://github.com/mazzzystar/Queryable

https://mp.weixin.qq.com/s/7McYXWaT8_q3IQgLq7iBEw

You can now create custom versions of ChatGPT that combine instructions, extra knowledge, and any combination of skills.
https://openai.com/blog/introducing-gpts


### API
https://platform.openai.com/docs/api-reference/authentication

https://platform.openai.com/account/api-keys


curl https://api.openai.com/v1/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
-d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'

curl https://api.openai.com/v1/models \
  -H 'Authorization: Bearer YOUR_API_KEY'


curl https://api.openai.com/v1/models/text-davinci-003 \
  -H 'Authorization: Bearer YOUR_API_KEY'


#### Create completion

+ Text
+ Code
  Saying "Hello" (Python)
  Create a MySQL query (Python)


```
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0
}'
```

#### Create edit

```
curl https://api.openai.com/v1/edits \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "model": "text-davinci-edit-001",
  "input": "What day of the wek is it?",
  "instruction": "Fix the spelling mistakes"
}'

```
#### Images
Create image
```
curl https://api.openai.com/v1/images/generations \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "prompt": "A cute baby sea otter",
  "n": 2,
  "size": "1024x1024"
}'

```
Create image edit
```
curl https://api.openai.com/v1/images/edits \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -F image='@otter.png' \
  -F mask='@mask.png' \
  -F prompt="A cute baby sea otter wearing a beret" \
  -F n=2 \
  -F size="1024x1024"

```
Create image variation
```
curl https://api.openai.com/v1/images/variations \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -F image='@otter.png' \
  -F n=2 \
  -F size="1024x1024"

```

#### Create embeddings
```
curl https://api.openai.com/v1/embeddings \
  -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "The food was delicious and the waiter...",
       "model": "text-embedding-ada-002"}'

```
#### Files

#### Fine-tunes

#### Moderations

#### Engines

### image generation
DALL·E 2 can create original, realistic images and art from a text description. It can combine concepts, attributes, and styles.
https://openai.com/product/dall-e-2

### develop

```
import openai
openai.api_key = "YOUR_API_KEY"

models = openai.Model.list()
print(models)
```

https://writesonic.com/chat?ref=producthunt

https://community.modelscope.cn/63ca5f30406cc1159771878f.html


v2ray:
http://git.io/v2ray.sh



```
server {
	listen       80;
    #listen 443 http2 ssl;
    #listen [::]:443 http2 ssl;

    #server_name server_IP_address;

    #ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    #ssl_certificate_key /etc/ssl/privatekey/nginx-selfsigned.key;
    #ssl_dhparam /etc/ssl/certs/dhparam.pem;

    location / {
        add_header Content-Type text/html;

        return 200 '<html><body>Hello World</body></html>';
    }

    location /chatbot {
        proxy_pass http://my_app_upstream;
        proxy_set_header Host $http_host;
    }
}


https://stackoverflow.com/questions/5834025/how-to-preserve-request-url-with-nginx-proxy-pass
https://serverfault.com/questions/1113782/using-nginx-as-a-forward-proxy-in-a-relay-server-for-v2ray-connection
```
curl --header "Host: google.com" http://shiyela.com/

https://www.4spaces.org/1073.html

```
inbound
"inbounds":[
         {
             "listen": "127.0.0.1",
             "port": 1081,
             "protocol": "http",
             "tag": "chatbot"
         }   
     ],

outbound

"type": "field",
        "outboundTag": "direct",
        "domain": [
            "domain:chatgpt.com"
        ]
rules
{
  "type": "field",
  "domain": [
    "baidu.com",
    "qq.com",
    "geosite:cn"
  ],
  "inboundTag": [
    "chatbot"
  ],
  "outboundTag": "direct",
  "balancerTag": "balancer"
}
```

enableHttp2
https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html