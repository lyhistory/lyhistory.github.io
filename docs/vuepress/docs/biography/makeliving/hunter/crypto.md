## Airdrop

### 比特币生态重点项目

+ [比特币BTCFi 赛道中的霸主 @SolvProtocol](https://app.solv.finance/points/77YGEW)，28 亿美金的锁仓量，在未发币协议的资金量排名中，它自称第二，估计没人敢说第一
    玩法：
    - 1. SolvBTC：点击Deposit ，存入BTC转成SolvBTC（1 美金 2个积分/天），可以在eth公链操作，建议在BSC链上操作
    - 2. Babylon：点击上方的 Staking，把刚才的 SolvBTC 兑换为 SolvBTC.BBN，这时你可以同时获得 Babylon 与 Solv 两个积分（1 美金 12个积分/天）
    - 3. Avalon：点击上方的 Defi，点击 BNB 链，把 SolvBTC.BBN 选一个协议存进去，SatLayer、Avalon、Sumer、Kinza 等这些协议都未发币，都有机会获得空投
    - 4. 如果不嫌麻烦，可以继续从容Avalon借贷同币种，然后存入其他的协议比如Kinza
    - 5. 最后必须记得点击 Points System，然后点击左侧的 invite friends，输入solv邀请码: 77YGEW ,solvBTC邀请码是必填的，然后绑定Twitter，钱包验证签名，坐等每天被动收入的空投

+ [比特币金融重磅项目CoreBTC，比特币质押革命，早期奖励进行中，点击链接注册参与！](https://ignition.coredao.org/registration/code?code=1E9201)

### Free NFT Claim
[BERA FAUCET x BRICKS MINT](https://bricksmint.com/bera-faucet?r=0x93b4eC8eD7F1FAD2107CDAd30fd9ECEC3f7975fE)

### DEPIN - Decentralized Physical Infrastructure Networks

DePIN are blockchain protocols that bring decentralized communities together to create and maintain physical infrastructure.

Participants who contribute their resources receive rewards in tokens, thereby incentivizing network growth.

The DePIN sector has several unique advantages:

- Global availability and low barrier to entry.
- Decentralized infrastructure management.
- Economic incentives for participants: Active participants are rewarded, motivating them to invest more resources and effort into the network’s development.

+ [intract所有depin入口](https://www.intract.io/?referralCode=2DzB2V&referralSource=REFERRAL_PAGE&referralLink=https%3A%2F%2Fwww.intract.io%2Freferral)

+ [Galxe WEB3所有最新项目](https://t.me/Galxe_app_bot/GalxeMiniapp?startapp=GICzZGj1Iq3TZGonzwos5xFnaMK7UiqZsWF)

+ [Grass小草](https://app.getgrass.io/register/?referralCode=jVAWeVwPdlcwoIP)

+ [Nodepay](https://app.nodepay.ai/register?ref=UP8LaqAjdyJaQHz)

+ [DATs](https://t.me/DATSAPP_bot/datsapp?startapp=350644282)

+ [rivalz最大的空投](https://rivalz.ai?r=liuyue) ， [节点安装文档](https://docs.rivalz.ai/rclients-ocy-depin/rclient-cli-guide)

+ [Cloud Rebellion](https://rebellion.acurast.com/?ref=7o2ag6) 

+ [UPLINK](https://explorer.uplink.xyz/register?referralCode=WwCZsH)

### 自动化脚本
#### Telegram minigame->Hamster Kombat(done)

手机检测：
web.telegram => UI显示 Play on your mobile
=> source js:
["android", "android_x", "ios"].indexOf((Kt = (Jt = window 

绕过：
chrome extension: Resource Override => Add Rule->Select Inject File->Edit File, then paste the code:
```
if (location.hostname === "hamsterkombatgame.io") {
    const original_indexOf = Array.prototype.indexOf;
    Array.prototype.indexOf = function(...args) {
        if (JSON.stringify(this) === JSON.stringify(["android", "android_x", "ios"])) {
            setTimeout(() => {
                Array.prototype.indexOf = original_indexOf;
            });
            return 0;
        }
        return original_indexOf.apply(this, args);
    }
}

```

login Telegram Web, go to Hamster Kombat https://t.me/haMster_kombat_bot/start?startapp=kentId7352585642, start the game, open devleoper tool, go to Console tab, select clicker(hamsterkombatgame.io) and then paste the code:
```
(function() {
    const evt1 = new PointerEvent('pointerdown', {
        clientX: 150,
        clientY: 300
    });
    const evt2 = new PointerEvent('pointerup', {
        clientX: 150,
        clientY: 300
    });
    setInterval((function fn() {
        const energy = parseInt(document.getElementsByClassName("user-tap-energy")[0].getElementsByTagName("p")[0].textContent.split(" / ")[0]);
        if (energy > 25) {
            document.getElementsByClassName('user-tap-button')[0].dispatchEvent(evt1);
            document.getElementsByClassName('user-tap-button')[0].dispatchEvent(evt2);
        }
        return fn;
    })(), 300);
})();
```

#### Telegram minigame->Blumbot

[Blumbot 入口链接](https://t.me/blum/app?startapp=ref_J1fzmOwIsm)

##### 猴子脚本
1. fix "refused connection"
install Ignore X-Frame headers
https://chromewebstore.google.com/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe

1. 
Violentmonkey https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag

```
// ==UserScript==
// @name         BlumBot
// @version      2.2
// @namespace    Violentmonkey Scripts
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// ==/UserScript==

let GAME_SETTINGS = {
    minBombHits: Math.floor(Math.random() * 2),
    minIceHits: Math.floor(Math.random() * 2) + 2,
    flowerSkipPercentage: Math.floor(Math.random() * 11) + 15,
    minDelayMs: 2000,
    maxDelayMs: 5000,
    autoClickPlay: false
};

let isGamePaused = false;

try {
    let gameStats = {
        score: 0,
        bombHits: 0,
        iceHits: 0,
        flowersSkipped: 0,
        isGameOver: false,
    };

    const originalPush = Array.prototype.push;
    Array.prototype.push = function (...items) {
        if (!isGamePaused) {
            items.forEach(item => handleGameElement(item));
        }
        return originalPush.apply(this, items);
    };

    function handleGameElement(element) {
        if (!element || !element.item) return;

        const { type } = element.item;
        switch (type) {
            case "CLOVER":
                processFlower(element);
                break;
            case "BOMB":
                processBomb(element);
                break;
            case "FREEZE":
                processIce(element);
                break;
        }
    }

    function processFlower(element) {
        const shouldSkip = Math.random() < (GAME_SETTINGS.flowerSkipPercentage / 100);
        if (shouldSkip) {
            gameStats.flowersSkipped++;
        } else {
            gameStats.score++;
            clickElement(element);
        }
    }

    function processBomb(element) {
        if (gameStats.bombHits < GAME_SETTINGS.minBombHits) {
            gameStats.score = 0;
            clickElement(element);
            gameStats.bombHits++;
        }
    }

    function processIce(element) {
        if (gameStats.iceHits < GAME_SETTINGS.minIceHits) {
            clickElement(element);
            gameStats.iceHits++;
        }
    }

    function clickElement(element) {
        element.onClick(element);
        element.isExplosion = true;
        element.addedAt = performance.now();
    }

    function checkGameCompletion() {
        const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
        if (rewardElement && !gameStats.isGameOver) {
            gameStats.isGameOver = true;
            resetGameStats();
        }
    }

    function resetGameStats() {
        gameStats = {
            score: 0,
            bombHits: 0,
            iceHits: 0,
            flowersSkipped: 0,
            isGameOver: false,
        };
    }

    function getNewGameDelay() {
        return Math.floor(Math.random() * (GAME_SETTINGS.maxDelayMs - GAME_SETTINGS.minDelayMs + 1) + GAME_SETTINGS.minDelayMs);
    }

    function checkAndClickPlayButton() {
        const playButtons = document.querySelectorAll('button.kit-button.is-large.is-primary, a.play-btn[href="/game"], button.kit-button.is-large.is-primary');

        playButtons.forEach(button => {
            if (!isGamePaused && GAME_SETTINGS.autoClickPlay && (/Play/.test(button.textContent) || /Continue/.test(button.textContent))) {
                setTimeout(() => {
                    button.click();
                    gameStats.isGameOver = false;
                }, getNewGameDelay());
            }
        });
    }

    function continuousPlayButtonCheck() {
        checkAndClickPlayButton();
        setTimeout(continuousPlayButtonCheck, 1000);
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                checkGameCompletion();
            }
        }
    });

    const appElement = document.querySelector('#app');
    if (appElement) {
        observer.observe(appElement, { childList: true, subtree: true });
    }

    continuousPlayButtonCheck();

    const settingsMenu = document.createElement('div');
    settingsMenu.className = 'settings-menu';
    settingsMenu.style.display = 'none';

    const menuTitle = document.createElement('h3');
    menuTitle.className = 'settings-title';
    menuTitle.textContent = 'BlumBot by @DefiWimar';

    const closeButton = document.createElement('button');
    closeButton.className = 'settings-close-button';
    closeButton.textContent = '×';
    closeButton.onclick = () => {
        settingsMenu.style.display = 'none';
    };

    menuTitle.appendChild(closeButton);
    settingsMenu.appendChild(menuTitle);

    function updateSettingsMenu() {
        document.getElementById('flowerSkipPercentage').value = GAME_SETTINGS.flowerSkipPercentage;
        document.getElementById('flowerSkipPercentageDisplay').textContent = GAME_SETTINGS.flowerSkipPercentage;
        document.getElementById('minIceHits').value = GAME_SETTINGS.minIceHits;
        document.getElementById('minIceHitsDisplay').textContent = GAME_SETTINGS.minIceHits;
        document.getElementById('minBombHits').value = GAME_SETTINGS.minBombHits;
        document.getElementById('minBombHitsDisplay').textContent = GAME_SETTINGS.minBombHits;
        document.getElementById('minDelayMs').value = GAME_SETTINGS.minDelayMs;
        document.getElementById('minDelayMsDisplay').textContent = GAME_SETTINGS.minDelayMs;
        document.getElementById('maxDelayMs').value = GAME_SETTINGS.maxDelayMs;
        document.getElementById('maxDelayMsDisplay').textContent = GAME_SETTINGS.maxDelayMs;
        document.getElementById('autoClickPlay').checked = GAME_SETTINGS.autoClickPlay;
    }

    settingsMenu.appendChild(createSettingElement('Flower Skip (%)', 'flowerSkipPercentage', 'range', 0, 100, 1, ''));
    settingsMenu.appendChild(createSettingElement('Min Freeze Hits', 'minIceHits', 'range', 1, 10, 1, ''));
    settingsMenu.appendChild(createSettingElement('Min Bomb Hits', 'minBombHits', 'range', 0, 10, 1, ''));
    settingsMenu.appendChild(createSettingElement('Min Delay (ms)', 'minDelayMs', 'range', 10, 10000, 10, ''));
    settingsMenu.appendChild(createSettingElement('Max Delay (ms)', 'maxDelayMs', 'range', 10, 10000, 10, ''));
    settingsMenu.appendChild(createSettingElement('Auto Click Play', 'autoClickPlay', 'checkbox', null, null, null, ''));

    const pauseResumeButton = document.createElement('button');
    pauseResumeButton.textContent = 'Pause';
    pauseResumeButton.className = 'pause-resume-btn';
    pauseResumeButton.onclick = toggleGamePause;
    settingsMenu.appendChild(pauseResumeButton);

    document.body.appendChild(settingsMenu);

    const settingsButton = document.createElement('button');
    settingsButton.className = 'settings-button';
    settingsButton.textContent = '⚙️';
    settingsButton.onclick = () => {
        settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
    };
    document.body.appendChild(settingsButton);

    const style = document.createElement('style');
    style.textContent = `
        .settings-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(40, 44, 52, 0.95);
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          color: #abb2bf;
          font-family: 'Arial', sans-serif;
          z-index: 10000;
          padding: 20px;
          width: 300px;
        }
        .settings-title {
          color: #61afef;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .settings-close-button {
          background: none;
          border: none;
          color: #e06c75;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }
        .setting-item {
          margin-bottom: 12px;
        }
        .setting-label {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        .setting-label-text {
          color: #e5c07b;
          margin-right: 5px;
        }
        .setting-input {
          display: flex;
          align-items: center;
        }
        .setting-slider {
          flex-grow: 1;
          margin-right: 8px;
        }
        .setting-value {
          min-width: 30px;
          text-align: right;
          font-size: 11px;
        }
        .pause-resume-btn {
          display: block;
          width: calc(100% - 10px);
          padding: 8px;
          margin: 15px 5px;
          background-color: #98c379;
          color: #282c34;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        .pause-resume-btn:hover {
          background-color: #7cb668;
        }
        .social-buttons {
          margin-top: 15px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .social-button {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          margin: 2px;
          border-radius: 4px;
          background-color: #282c34;
          color: #abb2bf;
          text-decoration: none;
          font-size: 12px;
          transition: background-color 0.3s;
          flex: 1 1 auto;
          min-width: 100px;
          max-width: 150px;
          box-sizing: border-box;
        }
        .social-button:hover {
          background-color: #4b5263;
        }
        .social-button img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        .settings-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: rgba(36, 146, 255, 0.8);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 9999;
        }
      `;
    document.head.appendChild(style);

    function createSettingElement(label, id, type, min, max, step, tooltipText) {
        const container = document.createElement('div');
        container.className = 'setting-item';

        const labelContainer = document.createElement('div');
        labelContainer.className = 'setting-label';

        const labelElement = document.createElement('span');
        labelElement.className = 'setting-label-text';
        labelElement.textContent = label;

        labelContainer.appendChild(labelElement);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'setting-input';

        let input;
        if (type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.id = id;
            input.checked = GAME_SETTINGS[id];
            input.addEventListener('change', (e) => {
                GAME_SETTINGS[id] = e.target.checked;
                saveSettings();
            });
            inputContainer.appendChild(input);
        } else {
            input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = GAME_SETTINGS[id];
            input.className = 'setting-slider';

            const valueDisplay = document.createElement('span');
            valueDisplay.id = `${id}Display`;
            valueDisplay.textContent = GAME_SETTINGS[id];
            valueDisplay.className = 'setting-value';

            input.addEventListener('input', (e) => {
                GAME_SETTINGS[id] = parseFloat(e.target.value);
                valueDisplay.textContent = e.target.value;
                saveSettings();
            });

            inputContainer.appendChild(input);
            inputContainer.appendChild(valueDisplay);
        }

        container.appendChild(labelContainer);
        container.appendChild(inputContainer);
        return container;
    }

    function saveSettings() {
        localStorage.setItem('BlumAutoclickerSettings', JSON.stringify(GAME_SETTINGS));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('BlumAutoclickerSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            GAME_SETTINGS = {
                ...GAME_SETTINGS,
                ...parsedSettings
            };
        }
    }

    loadSettings();
    updateSettingsMenu();

    function toggleGamePause() {
        isGamePaused = !isGamePaused;
        pauseResumeButton.textContent = isGamePaused ? 'Resume' : 'Pause';
        pauseResumeButton.style.backgroundColor = isGamePaused ? '#e5c07b' : '#98c379';
    }
} catch (e) {
    console.error("Blum Autoclicker error:", e);
}
```

升级代码

1). re-launch the app every 8 hours(window reload) and click on the "Claim" button with class "kit-button is-large is-primary is-fill button" and it has a child span with text "Claim"
```
// Reload the window every 8 hours
setInterval(() => {
    window.location.reload();
}, 8 * 60 * 60 * 1000); // 8 hours in milliseconds

// After the page reloads, try to find and click the "Claim" button
function checkAndClickClaimButton() {
    const claimButtons = document.querySelectorAll('button.kit-button.is-large.is-drop.is-fill.button.is-done');
    
    Array.from(claimButtons).forEach(button => {
        // Find all descendant div elements inside the button
        const divs = Array.from(button.getElementsByTagName('div'));
        
        // Loop through divs to find the one with the text "Claim"
        divs.forEach(div => {
            if (div.textContent.trim() === 'Claim') {
                setTimeout(() => {
                    button.click();  // Click the button if the "Claim" div is found
                }, getNewGameDelay());  // Adjust delay function as needed
            }
        });
    });
}

// Add event listener to run the claim check when the page loads
window.addEventListener('load', () => {
    checkAndClickClaimButton();
});

```

2). click the button with class "kit-button is-large is-primary is-fill button" and it has a child span with text "Start farming" when the playButtons empty
```
function checkAndClickPlayButton() {
    const resetButton=document.getElementsByClassName("reset");
    if(resetButton){
        resetButton[0].click();
    }

        const playButtons = document.querySelectorAll('button.kit-button.is-large.is-primary, a.play-btn[href="/game"], button.kit-button.is-large.is-primary');

        playButtons.forEach(button => {
            if (!isGamePaused && GAME_SETTINGS.autoClickPlay && (/Play/.test(button.textContent) || /Continue/.test(button.textContent))) {
                setTimeout(() => {
                    button.click();
                    gameStats.isGameOver = false;
                }, getNewGameDelay());
            }else if(/Start farming/.test(button.textContent)){
                setTimeout(() => {
                    button.click();
                    gameStats.isGameOver = false;
                }, getNewGameDelay());
            }else if(/Continue/.test(button.textContent)){
                setTimeout(() => {
                    button.click();
                    gameStats.isGameOver = false;
                }, getNewGameDelay());
            }
        });

        checkAndClickClaimButton();
    }

```
3. Open BlumBot in the browser
make sure the Violentmonkey enabled the scripts, reload Blumbot if necessary until you see a gadget setting symbol over the game

##### 简单js
chrome developer tool-> network -> 找到 balance请求，保存Auth Token/Bearer token

Open "Console" Tab
✓ Enter following code:

```


const play = 5
const authen = "YOUR_TOKEN"

clear()
async function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

async function playAndClaimGame() {
for (let i = 0; i < play; i++) {
console.log(` - ${i}. Start Play game..`)
const _points = Math.floor(Math.random() * (120 -80 + 1)) + 110;

const headers =  {
'accept': 'application/json, text/plain, */*',
'accept-language': 'en-US,en;q=0.9',
'authorization': authen,
'origin': 'https://telegram.blum.codes',
'priority': 'u=1, i',
'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128", "Microsoft Edge WebView2";v="128"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-site',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
}
delete headers["content-type"]
const response = await fetch('https://game-domain.blum.codes/api/v1/game/play', {
method: 'POST',
headers: headers,
});
const responseData = await response.json();
const gameid = responseData.gameId;
console.log(` - GameId: ${gameid}`)

const _sleep = Math.floor(Math.random() * 11 + 50) * 1000
console.log(` - sleep: ${_sleep/1000}s`)
await sleep(_sleep)
headers["content-type"] = 'application/json'
delete headers["content-length"]
const claim = await fetch('https://game-domain.blum.codes/api/v1/game/claim', {
method: 'POST',
headers: headers,
body: JSON.stringify({
'gameId': gameid,
'points': _points
})
});
const claimText = await claim.text();
console.log(` - Play status: ${claimText}. Points: ${_points}`)

const _sleep2 = Math.floor(Math.random() * 6 + 15) * 1000
console.log(` - sleep: ${_sleep2/1000}s`)
await sleep(_sleep2);
}
console.log(" - [ DONE ALL ] ")
}

(async () => {
await playAndClaimGame();
})();
```

##### 其他方法，通过gpt prompt:
```
Create a bot to play BlumCryptoBot, a Telegram mini-game

When the Bot open the app, it click on the Play button. Then we will only click on the green snowflakes until the timer on the top left expires.

Improve the code, when 5 mini games are completed, the bot will click on the "Start Farming" button on the homepage. After that, the bot should re-launch the app every 8 hours and click on the "Claim" button, re-click on "Start Farming" and repeat these actions

Add anti-detection measures for this bot and security

Add to the code the ability to perform all these actions from multitude of telegram accounts

How do l run a bot if i don't understand programming, tell me a step by step guide how do i run this bot
```


#### Telegram minigame->Not Pixel
[Not Pixel 入口链接](https://t.me/notpixel/app?startapp=f350644282)

[Violentmonkey脚本](https://pastes.dev/7obFPcDYq9)


location.reload 重启有问题，增加自动启动脚本
[telegram_minigame_autostart](https://github.com/lyhistory/hunter_automation.git)

#### Telegram minigame->Bybit Coinsweeper
[Bybit Coinsweeper 入口链接](https://t.me/BybitCoinsweeper_Bot?start=referredBy=350644282)

脚本 https://api.pastes.dev/ZcHOhADQy9

#### Telegram minigame->Clayton

[Clayton入口链接](https://t.me/claytoncoinbot/game?startapp=350644282)

Resource Override
规则：url-url

https://tonclayton.fun/assets/index-CM8DCHvL.js - https://api.pastes.dev/5imvKtcxhb

猴子脚本 https://api.pastes.dev/lLE804hn10

#### Telegram minigame->Binance Moonbix

[Moonbix入口链接 Join the Moonbix Journey! Get 1000 Coins as a new player and stay tuned for exciting airdrops and special rewards from Binance!](https://t.me/Binance_Moonbix_bot/start?startapp=ref_350644282&startApp=ref_350644282)

最早有人找到漏洞：https://pastebin.com/rHJvz2uw
```
import requests
import pyautogui
import random
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Auth Token and Proxy setup
AUTH_TOKEN = "your_auth_token_here"  # Replace with your actual auth token
PROXY = {
    'http': 'http://your_proxy:port',  # Replace with your proxy details
    'https': 'https://your_proxy:port'
}

# Headers for authorization
HEADERS = {
    'Authorization': f'Bearer {AUTH_TOKEN}',
    'Content-Type': 'application/json'
}

# Configure retries for network issues
retry_strategy = Retry(
    total=3,  # Number of retries
    status_forcelist=[429, 500, 502, 503, 504],
    method_whitelist=["HEAD", "GET", "OPTIONS"]
)

adapter = HTTPAdapter(max_retries=retry_strategy)
http = requests.Session()
http.mount("https://", adapter)
http.mount("http://", adapter)

# Function to get game data using API with Auth Token and Proxy
def get_game_data():
    url = "https://moonbixapi.com/game_data"  # Example API endpoint for game data
    
    try:
        # Send a GET request with Auth Token and Proxy
        response = http.get(url, headers=HEADERS, proxies=PROXY)

        # Raise an error for bad responses (like 401 Unauthorized)
        response.raise_for_status()

        # Process the JSON response
        game_data = response.json()
        return game_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching game data: {e}")
        return None

# Adjust click coordinates with random offsets
def click_object_randomized(object_location):
    if object_location:
        # Get the center of the object
        x, y = pyautogui.center(object_location)

        # Add a small random offset to simulate natural movement
        offset_x = random.randint(-5, 5)  # Random offset between -5 to +5 pixels
        offset_y = random.randint(-5, 5)

        # Click with the randomized offset
        pyautogui.click(x + offset_x, y + offset_y)

# Main function to collect boxes and coins with randomization
def collect_boxes_and_coins_via_api_randomized():
    while True:
        # Randomize how many items to collect in this cycle
        points_to_collect = random.randint(5, 10)  # Collect between 5 and 10 items per cycle
        collected_points = 0

        # Fetch game data from API
        game_data = get_game_data()

        if game_data:
            # Loop through game items (boxes and coins)
            for item in game_data['items']:
                if item['type'] == 'box' or item['type'] == 'coin':
                    x, y = item['x'], item['y']
                    
                    # Randomized click location
                    offset_x = random.randint(-5, 5)
                    offset_y = random.randint(-5, 5)
                    pyautogui.click(x + offset_x, y + offset_y)

                    # Increment collected points
                    collected_points += 1

                    # Break once we've collected the random number of points
                    if collected_points >= points_to_collect:
                        break

        # Randomized sleep between collection cycles to simulate human behavior
        sleep_time = random.uniform(1.5, 3.0)  # Sleep between 1.5 to 3 seconds
        time.sleep(sleep_time)

# Start collecting boxes and coins
collect_boxes_and_coins_via_api_randomized()
```

binance风控后：

promot:
envision yourself as a seasoned programmer with a decade of experience, Develop a bot designed to engage with the Moonbix mini-app, a Telegram mini-game

promot:
When the Bot open the app, it click on the "Play Game" button, after that the screen will show another button "Play Again(Left x)", x means how many times left, note there is a emoj between Left and x,
click on the button if left more than 0 times, when the game start, capture all the Boxes And Coins within the game. 

gpt implement it using selenium

promot:

your implementation using selenium won't work because moonbix blocking access from telegram web, now we can only play it using desktop, so we have no idea of the elements, change to use pyautogui lib to implement

promot:

seems you misundertood the game play sequence, please update it according to this:
first the bot will click on "play" button to start play the games, then the game start it will capture_items, 
after that the game end, then it will click on "play again", then the game will start over again, the maixum play is 5 times

Summary of Key Steps:
Find Coordinates: Use pyautogui.position() to get the exact screen coordinates for the "Play Game" and "Play Again" buttons.
Image Recognition: Save images of boxes and coins and use pyautogui.locateCenterOnScreen() to detect and click them.
Automation Loop: Continuously loop to click buttons and capture items

promot:
what do you mean by Find Coordinates Use pyautogui.position(), i don't see it in the code, and for Image Recognition,do you mean I have to Save images of boxes and coins manually?
what else should I do or How do l run a bot or fine-tune it step by step

[telegram minigame_moonbix.py](https://github.com/lyhistory/hunter_automation.git)

How to Find Coordinates,Run this simple Python script to display the current mouse position in real-time, Move your mouse over the desired location (like the "Play Game" button), and note down the coordinates printed in the terminal.Once you have the coordinates, you can use them in your bot for clicking:

+ METHOD 1: 
  ```
  import pyautogui
  pyautogui.mouseInfo()
  ```
+ METHOD 2:
    ```

    import pyautogui
    import time

    # Continuously print the current mouse position every second
    while True:
        x, y = pyautogui.position()
        print(f"Mouse position: {x}, {y}")
        time.sleep(1)

    ```

for image recognition, you need to manually capture images (screenshots) of the objects you want the bot to interact with—like the boxes and coins.

RUN BOT:
```
pip install pyautogui
pip install pillow

```
more promot:
Add anti-detection measures for this bot and security

现在又加上了验证码，所以不再可行

## Meme Trading （Copy Trade 跟买 & Sniper 狙击）
### 基本概念
+ 内盘/外盘：

    当一个新项目使用自动发币工具 pump.fun 成功部署后，用户可以使用 sol去购买该项目的代币，
    当其市值达到69000美元时，该项目的流动性会自动从 pump.fun 添加到 Raydium。在达到69000美元之前，我们称其为内盘。此时项目处于非常早期的阶段，风险极高；
    达到69000美元、并成功在 Raydium 添加流动性后，我们称其为外盘。此时项目已经有了进一步的发展，风险有所降低。

    注意，代币进入外盘不代表100%会上涨，同样存在大量代币在外盘开盘后迅速归零的案例

+ 滑点
    滑点是指单笔交易时，声明本次交易最大可接受代币数量偏差。提高滑点，交易速度越快。大部分时候建议0.5%左右的滑点，行情波动剧烈可以提高到10%
+ 防夹模式(Anti-MEV)
    MEV三明治攻击是指 MEV 机器人读取传入的交易信息并抢先执行订单，从而推高你买入时的代币价格，打开防夹模式可以有效防止三明治攻击。

+ 需要注意的是，所有Telegram bot都面临私钥是服务器托管的安全问题


### 代币分析
在購買代幣之前，你需要對其進行分析。

這樣做是為了避免詐騙並防止資金損失。

#### 分类
具体要根据热点、叙事、市值、社区和市场动态来判断是否买入，不同类型的Meme币策略也有所不同： 

+ 1、热点类
    这类代币很多是短时间内因特定事件或趋势而迅速走红的小市值代币，可能在初期有很高的涨幅，潜在空间可达10倍以上，从百万级别市值达到千万级别市值。但是如果热点不可持续、价格没有支撑点、名人没有喊单、未达到新叙事级别、未形成影响力大的社区、未经历振奋人心的小概率事件。很可能逐渐丧失流动性，价格不断下跌。
    近期的$BITCAT。在链上情绪正围绕着“吉祥物”概念不断发酵时，Bitcon官方推特突然发了一张黑猫图片，有一波人认为这暗示着比特币吉祥物，随着共识不断蔓延，相关代币$BITCAT迅速拉盘，当晚3小时内经历了从几十万市值到一亿市值的价格飙升，后半夜维持在5千万市值左右。

+ 2、叙事类
    这类标的往往不是依赖于短期热点上涨，而是围绕某种叙事或社区逐步从小市值涨到大市值。不同于瞬间暴涨的热点类代币，它们可能会经历多个阶段的稳定增长，通常市值在几百万到几千万美元之间，最高时甚至破亿。例如 $RIF，背景是抗生素用于治疗结核，目前是DeSci + Meme 龙头。该代币拉盘是因为链上对DeSci（去中心化科技）叙事的关注度攀升，作为Pump science首发代币，随着叙事热度提高，其买单不断增加，并且地位逐渐巩固在赛道龙一。

#### 思路
First of all, the idea of a meme coin should not be copied from a famous token, often creators want to supposedly repeat the success of the coin they copy.

In 99% of cases, it's could be a rug.

Also when looking for meme coins, pay attention to the logo of the coin.

Make sure the logo is not created by artificial intelligence or the picture is simply not copied from the internet.

This means that dev did not pay much time to the meme coin and there is a great chance that the price at any moment can fall by more than 70%.

When it comes to a website, not all projects create one, but if they do, that's a good sign.

But you still need to pay attention to it, check if it works? Or is it just a mockup with supposedly working buttons and so on.

Creators might not invest much in a site, creating the illusion of substantial time and money spent on the web site for meme coin.

That was the simplest analysis, now we need to go deeper.

Check the project's Telegram group; devs spend nothing on it.

But also be vigilant. Pay attention to the messages of the community.

Make sure that the community is positive and the messages don't look too simple, because there are bots that write fake comments.

The next equally important thing is to check the address of the token.

⫸ For $SOL: http://rugcheck.xyz
⫸ For EVM: http://coinscan.com

With these tools, we can uncover details like Risk Assessment, Key Stakeholders, and Community Opinions, among others.

Simply enter the token address on any of the sites to access all the information.

The latest analyses is to check the project's Twitter account.

You should pay attention to how often the project publishes, news, memes and all important information.

In addition, using 
@getmoni_io
 you can easily see the project's scoring, which depends on “smart followers”.

If the project has at least 15-20 followers at the early stage, it is a good sign that KOLs are interested in the project.

Let's check

⫸ Attend http://discover.getmoni.io
⫸ Paste username of twitter in the seach line
⫸ Click "Enter"

By the way, in addition to speed, you can also see a graph of how people signed up for this account and the number of mentions.

A mention graph is useful as many mentions of a project can boost a meme coin's price.


#### 工具

+ 代币分析  @Rugcheckxyz https://rugcheck.xyz/

+ 社交媒體分析
    - @getmoni_io https://getmoni.io/
    - tweetscout.io

聪明钱、KOL/VC、鲸鱼、新钱包、狙击者、持币大户、开发者、已关注、老鼠仓

### 聪明钱地址搜集



（1）收集大流量的KOLs钱包，他们的钱包常常是最容易被发现的，而且流量就是最大金钱，任何永远流量的Kol一定是在市场上有自己的长处的，我们使用GMGN就可以直接在左上角的探索页面—KOL\VC 这里去寻找我们需要的Kol钱包了，这也是GMGN最强的地方，钱包与数据收集，那比如你收集到了我的钱包，这就是属于你自己认知的数据库了，因为你已经在寻找的过程中看到了，这个Kol地址的盈利与大概操作等等，这才是属于你真正的认知，而不知识冰冷的地址，我也会在推文底部分享几个我认为很好的Kol钱包，附带我的认知，新人有需要可以自取，并进行练习。

（2）建立当下活跃的聪明钱信息库，方法也很简单，请把每日金狗的前20盈利的钱包，分析并且筛选出是最近赚钱最猛的，且不是新钱包的聪明钱，做好监控，我们可以直接在GMGN交易界面里点击 持有者—总利润\从高排序 比如：某A钱包最近大仓位的交易都是赚钱的，我们可以标记为“11月大仓位高胜率”，大家可以通过列子进行举一反三，一旦你做好了以上这2点，恭喜你，你现在可以称自己为加密猎人了！！！



地址分享
Cooker（母语英文，在国外大叙事上他的反应是最快的，所以ai行情龙头几乎都吃到了，同时也是顶级的交易者，列为重点关注地址）：8deJ9xeUvXSJwicYptA9mHsU2rN2pDx37KWzkDkEXhU6
鸡块（经常内盘高胜率，但是全是阴谋，列为参考地址）：8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5
扫链哥（打新选标频繁，作为新狗筛选器）：73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B


### 实操
+ DEX (可以直接连接钱包操作)
    - gmgn
+ 伪DEX/CEX（需要充值）
    - bullx

注意：如果是挂限价单或者自动操作一般需要连接电报telegram充币，注意风险

#### GMGN AI
+ [电报入口](https://t.me/gmgnaibot?start=i_sxpTtAih)
+ [官网入口](https://gmgn.ai/?ref=sxpTtAih)
+ [教程](https://docs.gmgn.ai/cn)

**指数：**

Bluechip 蓝筹代币：蓝筹代币是指各条链上经过市场验证与认可，具有较高价值，不会轻易归零的代币，例如sol链 neiro、popcat

蓝筹持有者：拥有一定蓝筹代币的持有者

蓝筹指数：蓝筹指数是指该代币的持有者中同时拥有蓝筹代币的比例

蓝筹指数意义：在一个代币中，拥有蓝筹代币的持有者越多，即蓝筹指数越高，蓝筹持有者越看好这个币，这个币越有可能成为下一个高价值蓝筹代币

**聪明钱地址搜集**

追踪聪明钱也就是追踪那些在链上获得较高收益的用户钱包地址，观察它们所选择的投资对象。以下三个链接是GMGN不同链上的聪明钱列表：
ETH链 https://gmgn.ai/discover?chain=eth
Solana链 https://gmgn.ai/discover/?chain=sol
Blast 链 https://gmgn.ai/discover?chain=blast

**交易追蹤**

GMGN还提供了绑定Telegram通知的功能，这样一旦关注的钱包进行任何操作，就能立即收到通知。

**Sniper New 狙击新币**

GMGN左下角的“Sniper New 狙击新币”部分，发现新代币后，点击进入代币交易界面进行详细分析

首先，看右下角几个指标：

+ Pair-Lid/Initial 流动性池大小：理想情况下，流动性池应在100 SOL以上。虽然小于此值（如几十SOL）也可以参与，但风险较高，因为容易受到大户的砸盘影响。不过，也要警惕一些骗子利用大池子来误导用户。
+ 真实交易笔数：观察开盘后的真实交易笔数。若在1分钟内交易笔数超过60笔，或在5分钟内超过600笔，则说明该代币相对安全。确保这些交易是真实的，而非刷量。+ NoMint Mint权限丢弃：如果项目方已丢弃增发代币的权限，则相对安全。这意味着他们无法随意增发代币，从而降低了砸盘的风险。
+ Blacklist 黑名单：确认项目方是否有权拉黑任意钱包。如果“否”，则相对安全；如果“是”，则可能存在风险，因为这意味着某些用户可能会被限制出售代币。
+ Burnt 烧池子：检查流动性池（LP）是否被烧毁。烧毁比例越高，意味着项目方无法撤回流动性，风险较低。100%的烧毁表示项目方无法撤回资金，安全性最高。如果LP没有被烧毁，那么存在约60%的可能性会出现“rug pull”（即开发者突然撤走资金）。这一步骤是判断项目安全性的关键。
+ Top10持仓：观察前10大持币者的持仓总量是否小于总供应量的30%。如果是，说明代币的持有分散，减少了单一大户操纵市场的风险。

其次，看中间K线下方的持仓指标：
+ Insiders 监测老鼠仓：
    观察是否存在老鼠仓现象，老鼠仓比例越低越好。高比例可能表明项目方在操控市场，增加了投资风险。建议老鼠仓比例不超过20%。如果完全没有老鼠仓，通常是更理想的情况。

最后，查看上方包括社交媒体、狙击者在内的指标：\

分析大户狙击：如果在开盘时有大户迅速介入，而流动性池的深度较浅，这种情况下有90%的可能性会导致价格暴跌，因此需要谨慎。


**限价交易、自动交易:**

在GMGN搜索框输入代币地址，或者直接在GMGN代币看板上筛选你认为有潜力的代币后，点击进入代币交易界面。绑定TG钱包：在代币交易界面右侧，点击“抄底”，转到Telegram机器人并绑定你的TG钱包。

使用 GMGN 网站创建限价挂单设置挂单：返回GMGN网站，点击绑定的钱包。点击“抄底”，再输入买入数量、滑点和防夹设置。创建挂单：点击“创建挂单买入”，成功完成限价挂单。挂单卖出也是同理，点击“自动卖出” 输入数量、滑点和防夹等参数，点击“创建挂单卖出”，成功完成限价挂单。

使用 Telegram Bot 进阶交易相比网站挂单，还有一种更便捷快速的交易方式：使用 Telegram Bot 。当你发送代币合约地址给Telegram机器人，机器人将根据预设条件自动进行购买，或者自动将代币按照预设值卖出，无需进行其他操作。如何实现呢？首先，添加GMGN Telegram狙击机器人为好友。https://t.me/GMGN_sol_bot


1、使用 Telegram Bot 限价买入发送合约：在TG狙击机器人输入 /start，选择“买”，并输入代币合约地址。设置挂单：输入合约后，选择“挂单”标签。设置要购买的SOL数量，可以自定义数量或使用预设值。设置触发价格，可以是具体价格或百分比，并选择挂单有效期（如6小时、24小时、2天）。完成挂单：点击“创建挂单”，成功设置限价买入。

2、使用 Telegram Bot 限价卖出发送合约：在TG狙击机器人输入 /start，选择“卖”，并输入代币合约地址。设置挂单：输入合约后，点击“挂单”，选择“挂单卖”区域。设置你要卖出的数量比例，也可以自定义数量或使用预设值。设置触发价格：设置触发价格，可以是具体价格或百分比，并选择挂单的有效期（如6小时、24小时、2天）。完成挂单：点击“创建挂单”，成功设置限价卖出。 

3、使用 Telegram Bot 自动买入
设置自动买入：在聊天中输入 /start，然后选择“设置”进入自动买入选项。点击“开启自动买”，并设置每笔交易的SOL数量。设置代币池的最低金额限制，确保只有当池子大于该值时才会自动买入。例如，输入2000表示当代币池超过2000美元时才会触发购买。设置市值的最大限制，确保只购买市值低于该值的代币，例如输入200000表示市值小于200000美元时才会买入。执行购买：一旦设置完成，发送代币合约地址给机器人，机器人将根据预设条件自动进行购买。

4、使用 Telegram Bot 自动卖出

设置自动卖预设值：在聊天中输入 /start，然后选择“设置”进入自动卖设置，或者直接发送 /autosell。点击“开启自动卖”，然后添加预设挂单。配置止损和止盈单：止损单：填写负的百分比（例如，-30%表示当价格下跌30%时自动卖出），并设置卖出数量的比例（不超过100%）。止盈单：填写正的百分比（例如，30%表示当价格上涨30%时自动卖出），建议所有卖出数量加起来等于100%。执行卖出：一旦配置完成，机器人将自动创建有效期为24小时的止盈和止损限价卖单。


#### photon-sol.tinyastro.io

#### dexscreener+BullX

**聪明钱地址搜集**

前往“頂級交易者”標籤，選擇多個錢包。

接下來，我們需要找到那些在幣價起飛前買入的交易者。

我們將使用 
@solanasniffer https://solsniffer.com/?utm_source=Social%20Media&utm_medium=Twitter&utm_campaign=Page/
 來完成這個任務。插入錢包地址並分析該錢包。

注意查看已實現損益（Realized PNL）和勝率（WinRate）部分。


**交易追蹤**

選擇合適的錢包後，我們需要確切知道交易者何時購買了什麼。

這樣你就不會錯過購買時機，並有時間跟著買入。

我使用 
@RayBot_sol https://t.me/ray_cyan_bot
 來完成這個任務。

**交易操作**
bullx.io


### 自动化脚本

#### Memecoin Sniper
1. build a sniper bot
Write a python script to snipe memecoin launches on the Solana network for building a sniper bot
2. analyze the coin
Upgrade this code to verify the token contract via rugcheck.xyz and analyze the coin before buying,based on this analysis, the bot will determine if it's a rug pull

some other metrics/criteria:
+ FDV
+ liquidity
+ Volume
+ social metrics
+ number of holders
+ number of tokens launched by the dev

3. set buy/sell conditions

Define the "Slippage" and "Price Impact" parameters in the code, recommended settings:
+ Max Slippage: 5-10%
+ Max Price Impact: 5%

set by/sell conditions and set max slippage at 5-10% and max price impact at 5%

4. Improve your bot adapt to your needs

for example: add standard buy/sell amounts to perform these actions even faster


### 案例
#### coinmarketcap treading - MAD
https://coinmarketcap.com/trending-cryptocurrencies/

## Sell point 卖出时机判断

+ Bitcoin Dominance drop
BTC market cap percentage vs ETH VS others

https://coinmarketcap.com/charts/bitcoin-dominance/
https://www.tradingview.com/symbols/BTC.D/

+ Altcoin double the price or 10 times

monitor top20