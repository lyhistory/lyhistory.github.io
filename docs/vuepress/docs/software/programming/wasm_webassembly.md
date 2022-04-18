https://webassembly.org/

https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts

https://www.youtube.com/watch?v=cbB3QEwWMlA

WebAssembly (abbreviated *Wasm*) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

基本上就是可以在浏览器的vm中执行的二进制程序，该程序可以通过各种语言如c/c++/c#等开发，然后通过一些工具进行转换，比如emscripten: convert a c/c++ program to webassembly

当然对于web开发者最容易的方式是通过assemblyscript开发，通过nodejs npm安装创建项目：

```
npm install --save-dev assemblyscript

npx asinit .
```

然后使用ts文件格式即typescript（必须使用强类型，而不是普通的js的动态弱类型）开发，开发之后，编译成wasm格式的binary文件，然后在普通的js中就可以使用webassembly api来实例化调用

```
<html>
  <head>
    <meta charset="utf-8">
    <title>WASM instantiateStreaming() test</title>
  </head>
  <body>
    <script>
      var importObject = { imports: { imported_func: arg => console.log(arg) } };

      WebAssembly.instantiateStreaming(fetch('simple.wasm'), importObject)
      .then(obj => obj.instance.exports.exported_func());
    </script>
  </body>
</html>
```



所以浏览器的vm会同时执行js和wasm，两者不是替代，而是并存关系

<disqus/>