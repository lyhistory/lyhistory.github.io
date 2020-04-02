
visual studio code不是visual studio哦，这个工具实在是强大，可以开发各种程序：
Python、c++、nodejs等等，
还有各种插件，比如PlatformIO，可以方便的开发各种硬件；

## 1.基本概念

### 1.1 快捷键：

```
ctrl+shift+P 调出command palette，各种命令自动补全

ctrl+P go to file

ctrl+shift+F Find in files

F5 Start Debugging

Ctrl+` / ctrl+shift+` Toggle Terminal

Go to Definition (F12) or Peek Definition (Alt+F12).

```

### 1.2 Command palette 

theme:
设置color theme, file icon

language:
markdown etc.

settings:
Preferences: Open User Settings
Preferences: Open Workspace Settings
Preferences: Config language specific settings

git version control

## 2. Develop

### 2.1 常用

IntelliSense

emmet abbreviation or emmet syntax
	shorthand syntax for web languages out of the box
	exclamation mark-!

Debugging in Visual Studio Code
https://code.visualstudio.com/docs/introvideos/debugging


### 2.2 reactJS

安装reactjs生成器create-react-app generator(会安装到node module path： %appdata%\Roaming\npm\node_modules)：
```
首先需要安装nodejs，nodejs自带npm：

node --version 
npm --version

create-react-app generator
```
然后可以生成项目
```
create-react-app hello-react

结果：
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
click "create a launch.json file", select environment "chrome":
```
	{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
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
The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy
```