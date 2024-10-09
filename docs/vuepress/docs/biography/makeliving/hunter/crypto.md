## Airdrop

### Free NFT Claim
[BERA FAUCET x BRICKS MINT](https://bricksmint.com/bera-faucet?r=0x93b4eC8eD7F1FAD2107CDAd30fd9ECEC3f7975fE)

### DEPIN - Decentralized Physical Infrastructure Networks

[Cloud Rebellion](https://rebellion.acurast.com/?ref=7o2ag6) 

## 自动化脚本
### Telegram minigame->Hamster Kombat(done)

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

### Telegram minigame->Blumbot

[Blumbot 入口链接](https://t.me/blum/app?startapp=ref_J1fzmOwIsm)

#### 猴子脚本
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

#### 简单js
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

#### 其他方法，通过gpt prompt:
```
Create a bot to play BlumCryptoBot, a Telegram mini-game

When the Bot open the app, it click on the Play button. Then we will only click on the green snowflakes until the timer on the top left expires.

Improve the code, when 5 mini games are completed, the bot will click on the "Start Farming" button on the homepage. After that, the bot should re-launch the app every 8 hours and click on the "Claim" button, re-click on "Start Farming" and repeat these actions

Add anti-detection measures for this bot and security

Add to the code the ability to perform all these actions from multitude of telegram accounts

How do l run a bot if i don't understand programming, tell me a step by step guide how do i run this bot
```


### Telegram minigame->Not Pixel
[Not Pixel 入口链接](https://t.me/notpixel/app?startapp=f350644282)

[Violentmonkey脚本](https://pastes.dev/7obFPcDYq9)


location.reload 重启有问题，增加自动启动脚本
[telegram_minigame_autostart](https://github.com/lyhistory/hunter_automation.git)

### Telegram minigame->Bybit Coinsweeper
[Bybit Coinsweeper 入口链接](https://t.me/BybitCoinsweeper_Bot?start=referredBy=350644282)

脚本 https://api.pastes.dev/ZcHOhADQy9

### Telegram minigame->Clayton

[Clayton入口链接](https://t.me/claytoncoinbot/game?startapp=350644282)

Resource Override
规则：url-url

https://tonclayton.fun/assets/index-CM8DCHvL.js - https://api.pastes.dev/5imvKtcxhb

猴子脚本 https://api.pastes.dev/lLE804hn10

### Telegram minigame->Binance Moonbix

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

### 更多
[DOGS 入口链接](https://t.me/dogshouse_bot/join?startapp=P3MoBOnmR_2RgwTxRQ6dKw)

## Memecoin Sniper
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