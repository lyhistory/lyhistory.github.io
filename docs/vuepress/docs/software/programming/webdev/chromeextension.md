https://developer.chrome.com/extensions/overview

##0X00 chrome extension基础

chrome插件本质就是一堆HTML,CSS,JavaScript和一些配置文件的集合，可以拓展用户的浏览器体验

chrome://extensions


+ Manifest

Json格式的文件，声明基本的版本，权限，图标，browser action或page action，background脚本
```
{
    "name": "Getting Started Example",
    "version": "1.0",
    "description": "Build an Extension!",
    "permissions": ["activeTab", "declarativeContent", "storage"],
    "background": {
        "scripts": ["background.js"],
        "persistent": false
    },
    "page_action": {
        "default_popup": "popup.html",
        "default_icon": {
            "16": "images/get_started16.png",
            "32": "images/get_started32.png",
            "48": "images/get_started48.png",
            "128": "images/get_started128.png"
        }
    },
    "icons": {
        "16": "images/get_started16.png",
        "32": "images/get_started32.png",
        "48": "images/get_started48.png",
        "128": "images/get_started128.png"
    },
    "options_page": "options.html",
    "manifest_version": 2
  }
```

+ Background Script

插件的事件处理器，基本包括browser listener，比如插件安装事件，页面变化事件，快捷键监听事件
```
background.js:
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
```

+ UI Elements

插件的用户界面，通常插件都有browser action或page action，不过也可以有其他形式的用户界面，比如context menu菜单，omnibox，甚至可以没有用户界面，比如只用快捷键keyboard shortcut；
通常默认界面我们叫popup.html，一般包含普通的html，插件也可以调用tabs.create或window.open()显示额外的更丰富的用户界面；
默认我们是在manifest里面通过browser action或page action定义好popup.html，除此之外，我们还允许通过 chrome.declarativeContent API来做更多自定义rules控制
```
popup.html:
<body>
    <button id="changeColor"></button>
    <script src="popup.js"></script>
  </body>
```

+ Content Script

插件读写操作web页面dom就是利用这个content script，这个脚本就是将javascript装载到web页面的上下文中运行，可见content script和上面的其他script上下文是不同的，他们可以交互吗？可以，就是通过chrome.storage API
```
popup.js
chrome.tabs.executeScript(targetTabID, {
      file: '/scripts/content_script.js',
      allFrames: true
    });
```

+ Option Page

这个是额外选项，默认安装的extension只有一个background的view可以inpsect，这个是额外的选项可以让用户直接做相应的设置，比如让用户选择需要的功能，这个需要在manifest中定义好options_page；
当然从前面的popup页面中也可以设置，只不过这里提供了另外一种方式；

还需要注意chromeAPI基本都是异步的，所以如果你的代码逻辑有依赖，需要放到callback里面


##0X01 我遇到的问题

首先我想加入一个快捷键功能，不用鼠标点来点去，很简单，manifest加入
"commands": {
    "your-command-name": {
      "suggested_key": {
        "default": "Ctrl+X"

      },
      "description": ""

    }
  },
然后background.js：
chrome.commands.onCommand.addListener(function(command) {
  if(command === "your-command-name") {
    //to implement

....



另外我更改的开源的插件都只能在该tab页面打开一个poppup窗口，

![](/docs/docs_image/software/webdev/chrom_extension02.png)

我老婆之前用的比较好的一个插件是可以开启新tab操作别的tab窗口内容，我自己试了下

Cannot access contents of url "chrome-extension://l". Extension manifest must request permission to access this host.
原来操作tabs还是要加权限的
但是我不太明白新开tab之后如何在之前的tab也就是target页面上加载执行脚本，所以参考了下别人的插件，开发者模式下chrome这里有个很好的debug功能，可以直接点击inspect，设置脚本断点，当然默认是minified一行脚本，可以点击{}格式化一下：

![](/docs/docs_image/software/webdev/chrom_extension01.png)

参考主要逻辑如下：
默认popup页面加载：

拿到你想要操作的tab即targetTab

var tabId=targetTab.id;
chrome.storage.sync.set({'targetTabID': tabId}, function() {
     chrome.tabs.create({
         url: chrome.extension.getURL("你的新tab页面")
      }, function(a) {
           targetTab(a);
      });
新tab页面加载：

chrome.storage.sync.get(['targetTabID'], function(result) {
    chrome.tabs.executeScript(result.targetTabID, {
      file: '/scripts/<YOUR SCRIPTS>',
      allFrames: true

    });
  });
  
![](/docs/docs_image/software/webdev/chrom_extension03.png)

<disqus/>