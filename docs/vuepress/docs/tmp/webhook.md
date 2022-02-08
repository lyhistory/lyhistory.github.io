So, what exactly is a **webhook**? A **webhook** (also called a web callback or HTTP push API) is a way for an app to provide other applications with real-time information. A **webhook** delivers data to other applications as it happens, meaning you get data immediately.

webhook就是一种消息通知方式，通常是指通过聊天机器人 chat bot发送信息

## telegram chat bot

Setup Telegram Notifications for your Shell
https://blog.r0b.re/automation/bash/2020/06/30/setup-telegram-notifications-for-your-shell.html

```

1. telegram搜索@BotFather，点击发送/start，/newbot 开始创建，提供username和bot name，保存token
2. 搜索创建的bot，比如我的 liuyue_bot，点击发送 /start，然后随便发送点信息（否则下面一步拿不到chat id）
3. 开一个shell，执行：
telegram_api_token=<YOUR TOKEN>
curl "https://api.telegram.org/bot$telegram_api_token/getUpdates" | jq '.result[0].message.chat.id'

{"ok":true,"result":[{"update_id":263393628,
"message":{"message_id":2,"from":{"id":350644282,"is_bot":false,"first_name":"YUE","last_name":"LIU","username":"lyhistory","language_code":"en"},"chat":{"id":350644282,"first_name":"YUE","last_name":"LIU","username":"lyhistory","type":"private"},"date":1605021071,"text":"no chat id returned, try again by sending this msg"}}]}

4. 使用例子：
.bashrc

tnotify(){
 message=$1
 token="XXXXXXXXXXXX"
 chatid="350644282"
 curl -s -X POST https://api.telegram.org/bot$token/sendMessage -d chat_id=$chatid -d text="$message"
}

tnotify "hi"
```



