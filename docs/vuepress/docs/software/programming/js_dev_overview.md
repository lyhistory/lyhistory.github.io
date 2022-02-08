npm, nodejs, reactjs, javascript, typescript ?

javascript是nodejs、reactjs和浏览器都在使用的一种编程语言, nodejs reactjs和浏览器用的都是javascript;

nodejs reactjs及浏览器用的都是V8引擎，但是不同的是：

reactjs是前端框架(当然也提供了部分server-side功能，但是我理解是有限的功能，主要还是client端)，reactjs和浏览器都有DOM API， 所以浏览器可以直接识别JavaScript操作dom，reactjs又增加了virtual dom（ReactDOM.render）来提升performance；
而nodejs是server-side后端框架，跟前端没有半毛钱关系，虽然都是用JavaScript，V8引擎，它没有DOM API，不能操作DOM，但是有其他API，比如可以访问硬件的电源，它跟java php这些没有区别，

可以比较下truffle的web3-nodejs和web3-react的区别： web3-react里面index.html基本只有一个root div，其他全靠index.js去画，而web3-nodejs的index.html则基本要写好，然后调用index.js里面的JavaScript互动，
然后这个JavaScript因为是nodejs所以操作dom的时候只能用原始的document.getElementById，当然了这里并没有体现出nodejs的特别之处，因为并没有访问特别的api；

总体来说nodejs和reactjs都是用npm来管理package，只不过有些module只能在nodejs或者reactjs下面才工作，有些则是两者都可以用;
而在实际前端项目中，一般也会用到nodejs，因为为了开发方便，一般都会提供脚本运行开启一个web server，比如webpack使用的noop-service-worker-middleware就是一个express middleware，
当然如果不用这些现成的包，可以自己集成reactjs和nodejs从而创建一个full dev environment，然后开发完成则是编译成静态html，扔给比如nginx托管，当然了如果这些静态html请求的后端服务可能就是nodejs提供的；

安装nodejs会自带npm，所以一般reactjs的安装也就是安装nodejs的npm；

TypeScript是JavaScript类型的超类，可以使用JavaScript中的所有代码和编程概念，TypeScript是为了使JavaScript的开发变得更加容易而创建的, TypeScript代码需要被编译（成JavaScript）。

Node and browser(javascript) both uses V8 engine, but browser has DOM, node doesn't, nodejs has other kind of APIs, 
nodejs has more freedom to access the os (because it has modules like filesystem, http server, even batteries, so you can create mobile app from nodejs),
both nodejs and reactjs use npm for moduel managment, but what's the difference??

> The confusing bit is that npm is a package manager for JavaScript, not necessarily node (even though node is in the name..). Therefore, we can use npm also for web applications. (If we do, we need to use a bundler like webpack though).
> Some npm modules might work both in the browser and in node, but some will only work on one of them. If the npm module requires some platform-spcific API (DOM for the browser for example) then it will not work for the other platform.
> https://stackoverflow.com/questions/58985983/general-question-about-reactjs-nodejs-and-npm

javascript?ECMAScript?Typescript?
> JavaScript is a scripting language which helps you create interactive web pages. It followed rules of client-side programming, so it runs in the user's web browser without the need of any resources forms the web server. You can also use Javascript with other technologies like REST APIs, XML, and more.
> The idea behind developing this script is to make it a complementary scripting language like Visual Basic was to C++ in Microsoft's language families. However, JavaScript is not designed for large complex applications. It was developed for applications with a few hundred lines of code!

> ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准,ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）。日常场合，这两个词是可以互换的。
> https://es6.ruanyifeng.com/#docs/intro

> TypeScript is a **strict superset of ECMAScript 2015**, which is itself a superset of ECMAScript 5, commonly referred to as JavaScript. As such, a JavaScript program is also a valid TypeScript program, and a TypeScript program can seamlessly consume JavaScript.
> Typescript is a modern age Javascript development language. It is a statically compiled language to write clear and simple Javascript code. It can be run on Node js or any browser which supports ECMAScript 3 or newer versions.
> Typescript provides optional static typing, classes, and interface. For a large JavaScript project adopting Typescript can bring you more robust software and easily deployable with a regular JavaScript application.


ECMAScript6 VS ECMAScript5
http://es6-features.org/#Constants

**什么是transpiling:**

React components are mostly written in modern JavaScript syntax. Take the class keyword for example. Stateful React components can be declared as classes, or as arrow (or regular functions). But older browsers don't understand ECMAScript 2015, thus we need some kind of transformation.
That transformation is called transpiling. Webpack per-se doesn’t know how to transform JavaScript. Instead it relies on loaders: think of them as of transformers. A webpack loader takes something as the input and produces an output, called bundle.

for latest ECMAScript syntax support (like ES5, ES6). React.js library itself insists you to make use of the latest JavaScript’s offerings for cleaner, less and more readable code. But unfortunately our browsers do not understands most of the syntax and this is where we need Babel’s help. 

babel-loader is the webpack loader responsible for talking to Babel. Babel on the other hand must be configured to use presets. We need two of them:
- babel preset env for compiling modern Javascript down to ES5
- babel preset react for compiling JSX and other stuff down to Javascript

create-react-app已经在package-lock.json锁定了webpack和Babel依赖

核心概念：event loop

**Java Script is a Single threaded, non-blocking asynchronous concurrent language.**

> With other languages, when server receives request, it allocates a thread to fulfill it. As part of handling the request let’s say it queries the database and the thread waits till it gets the response back from database. So it requires new thread to server the another request. If we have large number of concurrent requests then server capacity is most likely to be run out and new requests may need to wait until some thread is available or we need more hardware for more concurrent requests.
>
> Where as in JS (non-blocking IO), it is asynchronous by default. It has single thread to handle all requests. Thread doesn’t wait for the IO (for example DB response) and thread can be used to serve another request. In this example if there is a response from DB then it will be put in **Event Queue**. Node will monitor the queue and when there is an event in the queue, it will be processed in FIFO order.
>
> This is why Node (btw, node is just a run time environment to run java script at server side) is suitable for I/O intensive apps (e.g. DB read or network access). In contrast, Node shouldn’t be used for CPU intensive apps like video encoding etc.
>
> [Understanding Important Concepts in JavaScript](https://dzone.com/articles/java-script-important-concepts)

![](/docs/docs_image/software/programming/javascript01.png)

![](/docs/docs_image/software/programming/javascript02.png)

![](/docs/docs_image/software/programming/javascript03.png)

![](/docs/docs_image/software/programming/javascript04.png)

## 1. JavaScript

latest version:ES6

> Unlike most programming languages, the JavaScript language has no concept of input or output. It is designed to run as a scripting language in a host environment, and it is up to the host environment to provide mechanisms for communicating with the outside world. The most common host environment is the browser, but JavaScript interpreters can also be found in a huge list of other places, including Adobe Acrobat, Adobe Photoshop, SVG images, Yahoo's Widget engine, server-side environments such as Node.js, NoSQL databases like the open source Apache CouchDB, embedded computers, complete desktop environments like GNOME (one of the most popular GUIs for GNU/Linux operating systems), and others.
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/

+ Number
+ String
+ Boolean
+ Symbol (new in ES2015)
+ Object:
	- Function
	- Array
	- Date
	- RegExp
+ null
+ undefined

JavaScript objects can be thought of as simple collections of name-value pairs. As such, they are similar to:

- Dictionaries in Python.
- Hashes in Perl and Ruby.
- Hash tables in C and C++.
- HashMaps in Java.
- Associative arrays in PHP.

In classic Object Oriented Programming, objects are collections of data and methods that operate on that data. JavaScript is a prototype-based language that contains no class statement, as you'd find in C++ or Java (this is sometimes confusing for programmers accustomed to languages with a class statement). Instead, JavaScript uses functions as classes. 

prototype:
```
function Person(first, last) {
  this.first = first;
  this.last = last;
}
Person.prototype.fullName = function() {
  return this.first + ' ' + this.last;
};
Person.prototype.fullNameReversed = function() {
  return this.last + ', ' + this.first;
};
Person.prototype is an object shared by all instances of Person. It forms part of a lookup chain (that has a special name, "prototype chain"): any time you attempt to access a property of Person that isn't set, JavaScript will check Person.prototype to see if that property exists there instead. As a result, anything assigned to Person.prototype becomes available to all instances of that constructor via the this object.

```

Closures:
```
Inner functions leads us to one of the most powerful abstractions that JavaScript has to offer — but also the most potentially confusing. What does this do?

function makeAdder(a) {
  return function(b) {
    return a + b;
  };
}
var add5 = makeAdder(5);
var add20 = makeAdder(20);
add5(6); // ?
add20(7); // ?

The name of the makeAdder() function should give it away: it creates new 'adder' functions, each of which, when called with one argument, adds it to the argument that it was created with.

What's happening here is pretty much the same as was happening with the inner functions earlier on: a function defined inside another function has access to the outer function's variables. The only difference here is that the outer function has returned, and hence common sense would seem to dictate that its local variables no longer exist. But they do still exist — otherwise, the adder functions would be unable to work. What's more, there are two different "copies" of makeAdder()'s local variables — one in which a is 5 and the other one where a is 20. So the result of that function calls is as follows:

add5(6); // returns 11
add20(7); // returns 27

Here's what's actually happening. Whenever JavaScript executes a function, a 'scope' object is created to hold the local variables created within that function. It is initialized with any variables passed in as function parameters. This is similar to the global object that all global variables and functions live in, but with a couple of important differences: firstly, a brand new scope object is created every time a function starts executing, and secondly, unlike the global object (which is accessible as this and in browsers as window) these scope objects cannot be directly accessed from your JavaScript code. There is no mechanism for iterating over the properties of the current scope object, for example.

So when makeAdder() is called, a scope object is created with one property: a, which is the argument passed to the makeAdder() function. makeAdder() then returns a newly created function. Normally JavaScript's garbage collector would clean up the scope object created for makeAdder() at this point, but the returned function maintains a reference back to that scope object. As a result, the scope object will not be garbage-collected until there are no more references to the function object that makeAdder() returned.

Scope objects form a chain called the scope chain, similar to the prototype chain used by JavaScript's object system.

A closure is the combination of a function and the scope object in which it was created. Closures let you save state — as such, they can often be used in place of objects.

```

Var, let and const- what's the difference?
https://dev.to/sarah_chima/var-let-and-const--whats-the-difference-69e

## 2. nodejs/reactjs开发环境

### 2.1 共同环境配置

```
---------------------------------------------------------------------------------------
--- ubuntu
---------------------------------------------------------------------------------------
一般安装nodejs就自动自带按照npm，但是Ubuntu貌似并非如此
apt install npm
但是默认版本很低，升级：
sudo npm install -g npm
hash -d npm
---------------------------------------------------------------------------------------
--- centos
---------------------------------------------------------------------------------------
yum install nodejs
yum uninstall nodejs

---------------------------------------------------------------------------------------
--- redhat
---------------------------------------------------------------------------------------
https://github.com/nodesource/distributions/blob/master/README.md#rpminstall

$ curl -fsSL https://rpm.nodesource.com/setup_15.x | sudo bash -

$ yum repolist
Loaded plugins: product-id, search-disabled-repos, subscription-manager
This system is not registered with an entitlement server. You can use subscription-manager to register.
repo id           repo name     											status
nodesource/x86_64 Node.js Packages for Enterprise Linux 7 - x86_64          37
repolist: 55,117

## Inspecting system...
+ rpm -q --whatprovides redhat-release || rpm -q --whatprovides centos-release || rpm -q --whatprovides cloudlinux-release || rpm -q --whatprovides sl-release
+ uname -m
## Confirming "el7-x86_64" is supported...
+ curl -sLf -o /dev/null 'https://rpm.nodesource.com/pub_15.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm'
## Downloading release setup RPM...
+ mktemp
+ curl -sL -o '/tmp/tmp.YhLB6BeGzL' 'https://rpm.nodesource.com/pub_15.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm'
## Installing release setup RPM...
+ rpm -i --nosignature --force '/tmp/tmp.YhLB6BeGzL'
## Cleaning up...
+ rm -f '/tmp/tmp.YhLB6BeGzL'
## Checking for existing installations...
+ rpm -qa 'node|npm' | grep -v nodesource

## Run `sudo yum install -y nodejs` to install Node.js 15.x and npm.
## You may also need development tools to build native addons:
     sudo yum install gcc-c++ make
## To install the Yarn package manager, run:
     curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
     sudo yum install yarn
     
---------------------------------------------------------------------------------------
--- Upgrade to nodejs8
---------------------------------------------------------------------------------------
https://tech.amikelive.com/node-663/quick-tip-installing-nodejs-8-on-centos-7/
yum install epel-release
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum install gcc-c++ make
yum install -y nodejs

在console运行，会提示找不到module，比如 cannot find module 'request'
只需要执行npm -request即可，如果提示 Error: ENOENT, stat '\AppData\Roaming\npm'
只需要当前目录下创建npm即可

---------------------------------------------------------------------------------------
--- windows安装node js
---------------------------------------------------------------------------------------
Windows upgrade npm
npm install -g npm-windows-upgrade npm-windows-upgrade
```

安装验证：
```
node --version 
npm --version
npx -version

node -v
npm -v
```

**npm包路径node module path： **
```
%appdata%\Roaming\npm\node_modules
或
~/node_modules/
```



npm私有仓库搭建 https://www.jianshu.com/p/cf2e9f580e6d



**项目package.json： **

不管是手动创建还是自动创建的nodejs或者reactjs项目，比如：
nodejs的webpack（比如truffle的https://www.trufflesuite.com/boxes/webpack），
reactjs的create-react-app（truffle也有react版本https://www.trufflesuite.com/boxes/react），
最终生成的项目都必有package.json，其中也必然含有：

a)依赖 dependencies
```
"devDependencies": {
    "copy-webpack-plugin": "^5.0.5",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.9.0"
  },
  "dependencies": {
    "web3": "^1.2.4"
  }
```

b)执行脚本 scripts
```
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

JSX: javascript extension 

#### **Debug**

```
.eslintrc.js
rules: {
    'no-debugger': 0,
    .....
  }
  
然后代码里面可以用 debugger 下断点

```



### 2.2 vscode

#### 离线安装

```
#安装插件 
插件市场搜索
https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
右侧有个 Download Extension 点击下载
放到vscode的安装目录如 D:\Microsoft VS Code\bin 
打开cmd
code --install-extension *.vsix

#安装npm
连线机器
>npm install -g npm-bundle
>npm install -g eslint
>npm-bundle eslint
eslint-7.8.1.tgz
目标机器
>npm install -g ./eslint-7.8.1.tgz

npm-bundle的本质是借助npm pack来实现打包的。npm pack会打包包本身以及bundledDependencies中的依赖，npm-bundle则是将pm2的所有dependencies记录到bundledDependencies，来实现所有依赖的打包。
这种方式不需要安装多余的devDependencies，并且不需要克隆pm2的源码
```



#### ESLINT

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

preference->settings->search eslint->edit in settings.json

```
   "editor.codeActionsOnSave": {
        "source.fixAll": true
    }
```





## 3.nodejs开发

https://www.tutorialsteacher.com/nodejs/nodejs-tutorials

后端框架，虽然是用JavaScript，但是是后端代码，当然一般不直接用JavaScript，而是用超类typescript，可以更好的管理大项目架构，需要编译成JavaScript；

**基本语法:**

模块系统 Modules

事件 Event

函数 function

路由 route

全局对象 Global Object

http://www.w3cschool.cc/nodejs
http://www.nodejs.org/
http://www.nodebeginner.org/index-zh-cn.html
https://channel9.msdn.com/Series/Building-Apps-with-Node-js?WT.mc_id=12833-DEV-sitepoint-othercontent


## 4.reactJS开发

前端框架，引入了[virtual dom的概念](https://www.codecademy.com/articles/react-virtual-dom)，
前面也说过，其实reactjs也是有server-side服务端功能的，不过一般都是说服务端动态渲染，[Demystifying server-side rendering in React](https://www.freecodecamp.org/news/demystifying-reacts-server-side-render-de335d408fe4/)

一般来说都只是将reactjs作为前端，然后搭配一个后端程序来获取动态数据，后端程序可以是nodejs、java等等；

reactjs learn roadmap:
https://www.freecodecamp.org/news/learning-react-roadmap-from-scratch-to-advanced-bff7735531b6/

react-indepth:
https://legacy.gitbook.com/book/developmentarc/react-indepth/details

## 4.1 基本语法

```js
if( value ) {
}
```

will evaluate to `true` if `value` is **not**:

- null
- undefined
- NaN
- empty string ("")
- 0
- false



## 4.2 开发

### 4.2.1 toolchain
**根据具体需求（放在服务端的静态页面或者动态渲染页面）有以下几种toolchain可以利用：**

+ If you’re learning React or creating a new single-page app, use Create React App.
+ If you’re building a server-rendered website with Node.js, try [Next.js](https://nextjs.org/learn/basics/getting-started).
+ If you’re building a static content-oriented website, try [Gatsby](https://www.gatsbyjs.org/docs/)
+ If you’re building a component library or integrating with an existing codebase, try More Flexible Toolchains:
	- Neutrino combines the power of webpack with the simplicity of presets, and includes a preset for React apps and React components.
	- Parcel is a fast, zero configuration web application bundler that works with React.
	- Razzle is a server-rendering framework that doesn’t require any configuration, but offers more flexibility than Next.js.
+ 自定义toolchain Creating a Toolchain from Scratch， A JavaScript build toolchain typically consists of:
	- A package manager, such as Yarn or npm. It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.
	- A bundler, such as webpack or Parcel. It lets you write modular code and bundle it together into small packages to optimize load time.
	- A compiler such as Babel. It lets you write modern JavaScript code that still works in older browsers.
	- 参考 https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658

### 4.2.2 create-react-app(highly recommend)	

**下面我们就采用第一种方式创建一个single-page app**

[完整文档](https://create-react-app.dev/docs/documentation-intro)

参考 https://code.visualstudio.com/docs/nodejs/reactjs-tutorial

使用reactjs生成器create-react-app generator有两种方法：

其一：直接用npx生成项目 ```npx create-react-app hello-react```

其二:安装到node module path
```
npm install -g create-react-app
```

然后可以生成项目
```
create-react-app hello-react

结果(package.json中的script定义)：
Success! Created hello-react at C:\Workspace\Repository\TestReact\hello-react
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd hello-react
  npm start

Happy hacking!

```

```
cd my-app
code .
```

**debug react**

new react dev tool
https://react-devtools-tutorial.now.sh/

go to vscode extension: install "debugger for chrome"
&
https://www.npmjs.com/package/@welldone-software/why-did-you-render

then go to run&debug:
click "create a launch.json file", select environment "chrome"，默认端口3000:
```
	{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

make sure "npm start" first, then F5 or click the debug button

Chrome React Devtools extension

**Linting**

frist install eslint module:
```
npm install -g eslint
```
then in vscode extension install "eslint"

ctrl+shift+P : create eslint config:
```
结果：
PS C:\Workspace\Repository\TestReact\hello-react> node_modules\.bin\eslint.cmd --init
? How would you like to use ESLint? To check syntax and find problems
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Does your project use TypeScript? No
? Where does your code run? Browser
? What format do you want your config file to be in? JSON
```


**打包部署**
```
npm run build
结果：
The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy
```

**more: dependencies/import/router/typescript:**
https://create-react-app.dev/docs

React.js and Spring Data REST
https://spring.io/guides/tutorials/react-and-spring-data-rest/

```
自定义环境变量
There is also a built-in environment variable called NODE_ENV. You can read it from process.env.NODE_ENV. When you run npm start, it is always equal to 'development', when you run npm test it is always equal to 'test', and when you run npm run build to make a production bundle, it is always equal to 'production'. You cannot override NODE_ENV manually. This prevents developers from accidentally deploying a slow development build to production.
https://create-react-app.dev/docs/adding-custom-environment-variables/

Windows (cmd.exe)#
set "REACT_APP_NODE_ENV=uat" && npm run start
Linux, macOS (Bash)#
export REACT_APP_NODE_ENV=uat && npm run start

package.json:
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",

    "startDevOnWinCmd": "set \"REACT_APP_NODE_ENV=dev\" && node scripts/start.js",
    "startDevOnLinux": "export REACT_APP_NODE_ENV=dev && node scripts/start.js",

    "buildQaOnWinCmd": "set \"REACT_APP_NODE_ENV=qa\" && node scripts/build.js",
    "buildQaOnLinux": "export REACT_APP_NODE_ENV=qa && node scripts/build.js",

usage:
​```
npm run start #default for dev/development start
npm run build #default for prod/produciton build
npm run startDevOnWinCmd #example for dev start
npm run buildQaOnWinCmd  #example for qa build
​```
```



### 4.2.3 webpack

https://webpack.js.org/concepts/

[Tutorial: How to set up React, webpack, and Babel from scratch (2020)](https://www.valentinog.com/blog/babel/)

**step 1: setting up the project**
```
mkdir webpack-react-tutorial && cd $_
mkdir -p src
npm init -y
```

**step 2: setting up webpack**

webpack will ingest raw React components for producing JavaScript code that (almost) every browser can understand.
```
npm i webpack webpack-cli --save-dev
```
package.json
```
  "name": "webpack-react-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  
"scripts": {
  "build": "webpack --mode production"
}
```
At this point there is no need to define a configuration file for webpack. Older webpack versions would automatically look for a configuration file. Since version 4 that is no longer the case.

**step 3: setting up Babel for transpiling our code**
```
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```
.babelrc
```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

webpack.config.js
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
The configuration is quite minimal. For every file with a js or jsx extension Webpack pipes the code through babel-loader. With this in place we're ready to write a React.

**step 4: writing React components**

pull in react
```
npm i react react-dom
mkdir -p src/js/components/
```

src/js/components/Form.js:
```
import React, { Component } from "react";
import ReactDOM from "react-dom";

class Form extends Component {
  constructor() {
    super();

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState(() => {
      return {
        value
      };
    });
  }

  render() {
    return (
      <form>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default Form;

const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;
```

src/index.js:
```
import Form from "./js/components/Form";
```

npm run build

**step 5:the HTML webpack plugin**

To display our React form we must tell webpack to produce an HTML page. The resulting bundle will be placed inside a \<script\> tag.

webpack needs two additional components for processing HTML: html-webpack-plugin and html-loader

```
npm i html-webpack-plugin html-loader --save-dev
```

Then update webpack.config.js:
```
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
```
src/index.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>How to set up React, Webpack, and Babel</title>
</head>
<body>
<div id="container"></div>
</body>
</html>
```

npm run build

result published to ./dist

**step 6: Configuring the webpack dev server**

You don't want to type npm run build every time you change a file.
Once configured webpack will launch your application inside a browser. Also, every time you save a file after a modification webpack dev server will refresh the browser's window.

```
npm i webpack-dev-server --save-dev
```
package.json
```
"start": "webpack-dev-server --open --mode development",
```

### 4.2.4 mobx

**concepts**

https://mobx.js.org/README.html
https://cn.mobx.js.org/
https://mobx.js.org/getting-started.html

+ Use the @observable decorator or observable(object or array) functions to make objects trackable for MobX.
+ The @computed decorator can be used to create functions that can automatically derive their value from the state.
+ Use autorun to automatically run functions that depend on some observable state. This is useful for logging, making network requests, etc.
+ reactions
	will not fire initially, only on change
+ transactions
+ actions
	
  ```
  strict mode: only allow data modified in actions
  "never" (default): State can be modified from anywhere
  "observed": All state that is observed somewhere needs to be changed through actions. This is the recommended strictness mode in non-trivial applications.
  "always": State always needs be updated (which in practice also includes creation) in actions.
  import { configure } from "mobx"
  // don't allow state modifications outside actions
  configure({ enforceActions: "always" })
  
  ```

**actions VS flow(function * (fn)**

通过我发现的一个“bug”来理解下单线程非阻塞的JS模型在mobx flow中的运用，flow会根据异步请求将代码段切分成多块，每块都是一个action，也就是每块如果有状态变化都会触发render：

https://github.com/mobxjs/mobx/issues/2715

https://mobx.js.org/actions.html#using-flow-instead-of-async--await-

```react
class testStore {
  @observable tableData = []
  @observable requestComplete = false
  @action //这里的action是没用的，因为下面用了flow！You don't need action when using flow... the point of flow is to automatically insert actions in between time-separated blocks of code - that is - in between individual awaits - which are replaced by yields (which allows us to insert these actions).
  retrieveTableData = (flow(function * () {
    try {
      console.log('Mark 1')
      this.requestComplete = false
      console.log('Mark 2')
      const tempTableData = yield axios.post('someEndpoints','someParam') //以此分割成两块action，代码运行到此处，因为这里是等待异步请求，而js是非阻塞的单线程，所以就会跑去做其他事情，即如果之前观测数据requestComplete是true，这里改成了false，此时js就刚好腾出手来去触发render！
      console.log('Mark 3')
      if (Array.isArray(tempTableData)) {
        this.tableData = doSthTo(tempTableData)
        console.log('Mark 4')  
      }
      this.requestComplete = true
      console.log('Mark 5')
    } catch (error) {
	  console.log('Mark -1')
      this.requestComplete = true
    }
  }))
}

@inject('testStore')
@observer
class testTable extends Component {
    componentDidMount () {
    const { testStore } = this.props
    testStore.retrieveTableData()
  }
  render () {
    console.log('Mark render...')
    return <Sth>
  }
```



#关于runInAction，在strict模式下，所有的setState操作都必须在action方法中，比如：
	loadWeather = city => {
	  fetch(
	    `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
	  )
	    .then(response => response.json())
	    .then(data => {
	      this.setWeatherData(data);   //   <==== here
	    });
	};
	

	@action
	setWeatherData = data => {
	  this.weatherData = data;   
	};
	
	可以看到这种写法为了设置weatherData还需要写一个action方法，可以通过runInAction简写成
	loadWeatherRunInThen = city => {
	  fetch(`https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`)
	    .then(response => response.json())
	    .then(data => {
	      runInAction(() => {
	        this.weatherData = data;         // <====== We dont have to define an action
	      });
	    });
	};
	```
	@action @action.bound https://stackoverflow.com/questions/48639891/difference-between-mobxs-action-bound-and-arrow-functions-on-class-functions

+ Use the @observer decorator from the mobx-react package to make your React components truly reactive. They will update automatically and efficiently. Even when used in large complex applications with large amounts of data.

  

mobx vs  redux:
https://blog.logrocket.com/redux-vs-mobx/
https://redux.js.org/introduction/getting-started

这个视频深入讲解了mobx的特性，如何转换现有js为mobx版本，并且对比react和加了mobx后的性能，调试技巧：
https://www.youtube.com/watch?v=XGwuM_u7UeQ

mobx-ract Provider Injection基本原理：hooks
https://reactjs.org/docs/hooks-overview.html

**create-react-app + mobx**

[Introduction to MobX and React](https://www.youtube.com/watch?v=Dp75-DnGFrU)

```
npx create-react-app hello-mobx

//This moves files around and makes your app’s configuration accessible.
npm run eject

```
eject result:
```
? Are you sure you want to eject? This action is permanent. Yes
Ejecting...

Copying files into C:\Workspace\Repository\learn_coding\frontend\hello-mobx
  Adding \config\env.js to the project
  Adding \config\getHttpsConfig.js to the project
  Adding \config\modules.js to the project
  Adding \config\paths.js to the project
  Adding \config\pnpTs.js to the project
  Adding \config\webpack.config.js to the project
  Adding \config\webpackDevServer.config.js to the project
  Adding \config\jest\cssTransform.js to the project
  Adding \config\jest\fileTransform.js to the project
  Adding \scripts\build.js to the project
  Adding \scripts\start.js to the project
  Adding \scripts\test.js to the project

Updating the dependencies
  Removing react-scripts from dependencies
  Adding @babel/core to dependencies
  Adding @svgr/webpack to dependencies
  Adding @typescript-eslint/eslint-plugin to dependencies
  Adding @typescript-eslint/parser to dependencies
  Adding babel-eslint to dependencies
  Adding babel-jest to dependencies
  Adding babel-loader to dependencies
  Adding babel-plugin-named-asset-import to dependencies
  Adding babel-preset-react-app to dependencies
  Adding camelcase to dependencies
  Adding case-sensitive-paths-webpack-plugin to dependencies
  Adding css-loader to dependencies
  Adding dotenv to dependencies
  Adding dotenv-expand to dependencies
  Adding eslint to dependencies
  Adding eslint-config-react-app to dependencies
  Adding eslint-loader to dependencies
  Adding eslint-plugin-flowtype to dependencies
  Adding eslint-plugin-import to dependencies
  Adding eslint-plugin-jsx-a11y to dependencies
  Adding eslint-plugin-react to dependencies
  Adding eslint-plugin-react-hooks to dependencies
  Adding file-loader to dependencies
  Adding fs-extra to dependencies
  Adding html-webpack-plugin to dependencies
  Adding identity-obj-proxy to dependencies
  Adding jest to dependencies
  Adding jest-environment-jsdom-fourteen to dependencies
  Adding jest-resolve to dependencies
  Adding jest-watch-typeahead to dependencies
  Adding mini-css-extract-plugin to dependencies
  Adding optimize-css-assets-webpack-plugin to dependencies
  Adding pnp-webpack-plugin to dependencies
  Adding postcss-flexbugs-fixes to dependencies
  Adding postcss-loader to dependencies
  Adding postcss-normalize to dependencies
  Adding postcss-preset-env to dependencies
  Adding postcss-safe-parser to dependencies
  Adding react-app-polyfill to dependencies
  Adding react-dev-utils to dependencies
  Adding resolve to dependencies
  Adding resolve-url-loader to dependencies
  Adding sass-loader to dependencies
  Adding semver to dependencies
  Adding style-loader to dependencies
  Adding terser-webpack-plugin to dependencies
  Adding ts-pnp to dependencies
  Adding url-loader to dependencies
  Adding webpack to dependencies
  Adding webpack-dev-server to dependencies
  Adding webpack-manifest-plugin to dependencies
  Adding workbox-webpack-plugin to dependencies

Updating the scripts
  Replacing "react-scripts start" with "node scripts/start.js"
  Replacing "react-scripts build" with "node scripts/build.js"
  Replacing "react-scripts test" with "node scripts/test.js"

Configuring package.json
  Adding Jest configuration
  Adding Babel preset

Running npm install...
audited 931631 packages in 24.439s

59 packages are looking for funding
  run `npm fund` for details

found 1 low severity vulnerability
  run `npm audit fix` to fix them, or `npm audit` for details
Ejected successfully!
```

```
npm install mobx --save
npm install mobx-react --save
```

由于create-react-app默认是不支持mobx的decorator的，为了enable decorator，需要这么做：
https://mobx.js.org/best/decorators.html

**Method 1 Babel 6: using babel-preset-mobx**

npm install --save-dev babel-preset-mobx
package.json OR .babelrc:
```
{
    "presets": ["mobx"]
}
```
实际上我在Babel 7也测试成功，

**Method 2 Babel 6: manually enabling decorators**

npm i --save-dev babel-plugin-transform-decorators-legacy
```
{
    "presets": ["es2015", "stage-1"],
    "plugins": ["transform-decorators-legacy"]
}
```
未测试

**Method 3 Babel 7**

```
npm install --save-dev @babel/plugin-proposal-decorators
npm install --save-dev @babel/plugin-proposal-class-properties
```

package.json:
```
"babel": {
  "plugins":[
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy":true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose":true
      }
    ]
  ],
  "presets":[
    "react-app"
  ]
}
```

### 4.2.5 npm packages



### 4.2.6 troubleshooting

?# resolve version by npm-force-resolutions
e.g. Can't resolve './locale' in 'node_modules\moment\src\lib\locale'
```
npm install --save-dev npm-force-resolutions
package.json:
	"resolutions": {
	"moment": "2.24.0"
	}
	"scripts":{
	"preinstall": "npx npm-force-resolutions"
	....
	}
npm install
```

mobx debug tools: google extension "MobX Developer Tools"

## 5.Storybook

导读：https://www.youtube.com/watch?v=va-JzrmaiUM

创建demo项目:
```
npx create-react-app hello-storybook
npx storybook
```
运行和发布:
```
npm run storybook
npm run builds
```


find all above code samples in https://github.com/lyhistory/learn_coding/tree/master/frontend

---

ref:


[Tutorial: How to set up React, webpack, and Babel from scratch (2020)](https://www.valentinog.com/blog/babel/)

[Getting started with REACT.js, using Webpack and Babel](https://medium.com/@siddharthac6/getting-started-with-react-js-using-webpack-and-babel-66549f8fbcb8)

[How to Setup React and Node JS in a project](https://www.codementor.io/@kakarganpat/how-to-setup-react-and-node-js-in-a-project-koxwqbssl)
