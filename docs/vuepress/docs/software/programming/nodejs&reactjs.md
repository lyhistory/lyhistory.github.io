

npm, nodejs, reactjs, javascript, typescript ?

javascript是nodejs、reactjs和浏览器都在使用的一种编程语言, nodejs reactjs和浏览器用的都是javascript;

nodejs reactjs及浏览器用的都是V8引擎，但是不同的是：

reactjs是前端框架(当然也提供了部分server-side功能，但是我理解是有限的功能，主要还是client端)，reactjs和浏览器都有DOM API， 所以浏览器可以直接识别JavaScript操作dom，reactjs又增加了virtual dom（ReactDOM.render）来提升performance；
而nodejs是server-side后端框架，跟前端没有半毛钱关系，虽然都是用JavaScript，V8引擎，它没有DOM API，不能操作DOM，但是有其他API，比如可以访问硬件的电源，它跟java php这些没有区别，

总体来说nodejs和reactjs都是用npm来管理package，只不过有些module只能在nodejs或者reactjs下面才工作，有些则是两者都可以用；

安装nodejs会自带npm，所以一般reactjs的安装也就是安装nodejs的npm；

TypeScript是JavaScript类型的超类，可以使用JavaScript中的所有代码和编程概念，TypeScript是为了使JavaScript的开发变得更加容易而创建的, TypeScript代码需要被编译（成JavaScript）。

Node and browser(javascript) both uses V8 engine, but browser has DOM, node doesn't, nodejs has other kind of APIs, 
nodejs has more freedom to access the os (because it has modules like filesystem, http server, even batteries, so you can create mobile app from nodejs),
both nodejs and reactjs use npm for moduel managment, but what's the difference??

> The confusing bit is that npm is a package manager for JavaScript, not necessarily node (even though node is in the name..). Therefore, we can use npm also for web applications. (If we do, we need to use a bundler like webpack though).
> Some npm modules might work both in the browser and in node, but some will only work on one of them. If the npm module requires some platform-spcific API (DOM for the browser for example) then it will not work for the other platform.
> https://stackoverflow.com/questions/58985983/general-question-about-reactjs-nodejs-and-npm

javascript?typescript?
> JavaScript is a scripting language which helps you create interactive web pages. It followed rules of client-side programming, so it runs in the user's web browser without the need of any resources forms the web server. You can also use Javascript with other technologies like REST APIs, XML, and more.
> The idea behind developing this script is to make it a complementary scripting language like Visual Basic was to C++ in Microsoft's language families. However, JavaScript is not designed for large complex applications. It was developed for applications with a few hundred lines of code!
> Typescript is a modern age Javascript development language. It is a statically compiled language to write clear and simple Javascript code. It can be run on Node js or any browser which supports ECMAScript 3 or newer versions.
> Typescript provides optional static typing, classes, and interface. For a large JavaScript project adopting Typescript can bring you more robust software and easily deployable with a regular JavaScript application.

## 1. JavaScript

latest version:ES6

> Unlike most programming languages, the JavaScript language has no concept of input or output. It is designed to run as a scripting language in a host environment, and it is up to the host environment to provide mechanisms for communicating with the outside world. The most common host environment is the browser, but JavaScript interpreters can also be found in a huge list of other places, including Adobe Acrobat, Adobe Photoshop, SVG images, Yahoo's Widget engine, server-side environments such as Node.js, NoSQL databases like the open source Apache CouchDB, embedded computers, complete desktop environments like GNOME (one of the most popular GUIs for GNU/Linux operating systems), and others.
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript

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

## 2. nodejs/reactjs共同环境配置

```
#centos
yum install nodejs
yum uninstall nodejs

Upgrade to nodejs8
https://tech.amikelive.com/node-663/quick-tip-installing-nodejs-8-on-centos-7/
yum install epel-release
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum install gcc-c++ make
yum install -y nodejs

在console运行，会提示找不到module，比如 cannot find module 'request'
只需要执行npm -request即可，如果提示 Error: ENOENT, stat '\AppData\Roaming\npm'
只需要当前目录下创建npm即可

#windows安装node js
Windows upgrade npm
npm install -g npm-windows-upgrade npm-windows-upgrade
```

安装验证：
```
首先需要安装nodejs，nodejs自带npm：

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

## 3.nodejs开发

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

## 4.1 基本语法

https://reactjs.org/docs/hello-world.html
https://reactjs.org/tutorial/tutorial.html

Basic：
	+ element: first-class JavaScript objects
		https://reactjs.org/docs/react-api.html#createelement

	+ component&props
	https://reactjs.org/docs/react-component.html
		- controlled components: by lift up state 
		- pure components: by using immutable 
		- function components: are a simpler way to write components that only contain a render method and don’t have their own state
	
	+ State&Lifecycle

	+ handling events

	+ Conditional Rendering

	+ Lists Keys 

	+ Forms 

	[Lifting state up 联动](https://reactjs.org/docs/lifting-state-up.html)
	
	+ Composition vs Inheritance

Advanced:
	+ Fragment
	+ Higher-Order Components

## 4.2 开发

React Devtools extension

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

### 4.2.2 create-react-app	

[完整文档](https://create-react-app.dev/docs/documentation-intro)

**下面我们就采用第一种方式创建一个single-page app**

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

go to extension: install "debugger for chrome"

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
