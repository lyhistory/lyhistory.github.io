
参考
+ [计算机基础-编程](/docs/software/programming/programming.md)
+ [计算机基础-JS编程](/docs/software/programming/nodejs&reactjs.md)
+ [计算机基础-python编程](/docs/software/programming/python.md)
+ [计算机基础-python编程](/docs/software/programming/php.md)
+ more: /docs/software/programming/*

语言本身的灵活性会给黑客带来很多机会，比如占了客户端漏洞很大比重的csrf/xss，基本是围绕着html js的context展开，

reactjs等前端框架通过剥离开用户数据和html tag，约束了初级开发者直接操作dom的权利，从而从框架层面做了很大限度的防护，当然也有其优越的性能提升，
笔者出入行开发web的时候还是很原始的使用jqueyr和js操作dom，现在想来当年也是给黑客留下了不少后门；

当然reactjs也并非100% xss protected:
https://stackoverflow.com/questions/33644499/what-does-it-mean-when-they-say-react-is-xss-protected
```
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
```

同理，最基础的sql simple query拼接贡献了大量数据库漏洞，而进化出的extended protocol剥离了用户数据prepare和sql执行execute，从而阻挡了sql注入；
> Remember: SQL injection happens when the SQL parser is fooled into believing that a parameter string is in fact a SQL query, and then the SQL engine goes on and executes that SQL statement. When the SQL query string lives in your application code, and the user-supplied parameters are sent separately on the network, there’s no way that the SQL parsing engine might get confused.
> https://tapoueh.org/blog/2018/11/preventing-sql-injections/

众多的库lib里面也隐藏着彩蛋，比如BUFFER未初始化内存泄漏数据；

java的很多buildingblock component都有过经典的serialization序列化漏洞；

即使语言和库本身都很完美，编程逻辑也会送出逻辑漏洞，比如github oath流程漏洞

程序员的思维是尽可能找出所有漏洞，黑客的思维是找出一个漏洞一击致命!

Programming is an important part of being a successful hacker. This isn’t a comprehensive list of programming languages and nearly any can be used for most hacking tasks, especially on the web, but rather a list of languages we find especially useful or notable.

## JavaScript
https://javascript.info/

This is the language used on the majority of web pages. Understanding it is useful for bug hunting because many bugs actually stem from JS code.

Can be used for the same tasks as Python and Ruby (albeit with fewer relevant libraries), but mostly useful to know for analysis of code on the web, as well as exploitation.

## Python and Ruby
https://docs.python.org/3/tutorial/

Useful for automation and quick testing and analysis, particularly for web hacking.

## Java and Kotlin
The ability to read these will be essential if you plan to do source code review of Android applications. Java is produced by decompilers for Android applications, which allows you to read code (roughly) equivalent to the original source, even when you only have a compiled application.

## SQL
https://sqlbolt.com/
Used by most applications for accessing and manipulating data. Knowledge of SQL will help in discovering and exploiting critical SQL Injection vulnerabilities.

## Objective-C and Swift
The ability to read these will be essential if you plan to do source code review of iOS applications.

## AArch64 assembly

For advanced embedded and mobile hacking, understanding the very lowest level of abstraction is essential.