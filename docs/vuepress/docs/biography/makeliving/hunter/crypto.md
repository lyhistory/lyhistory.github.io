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

## Hamster Kombat

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


