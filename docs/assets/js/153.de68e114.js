(window.webpackJsonp=window.webpackJsonp||[]).push([[153],{581:function(e,a,t){"use strict";t.r(a);var s=t(65),n=Object(s.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p",[e._v("参考")]),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"/docs/software/programming/programming"}},[e._v("计算机基础-编程")])]),e._v(" "),t("li",[t("a",{attrs:{href:"/docs/software/programming/js_dev_overview"}},[e._v("计算机基础-JS编程")])]),e._v(" "),t("li",[t("a",{attrs:{href:"/docs/software/programming/python"}},[e._v("计算机基础-python编程")])]),e._v(" "),t("li",[t("a",{attrs:{href:"/docs/software/programming/php"}},[e._v("计算机基础-php编程")])]),e._v(" "),t("li",[t("a",{attrs:{href:"/docs/software/programming"}},[e._v("more:")])])]),e._v(" "),t("p",[e._v("语言本身的灵活性会给黑客带来很多机会，比如占了客户端漏洞很大比重的csrf/xss，基本是围绕着html js的context展开，")]),e._v(" "),t("p",[e._v("reactjs等前端框架通过剥离开用户数据和html tag，约束了初级开发者直接操作dom的权利，从而从框架层面做了很大限度的防护，当然也有其优越的性能提升，\n笔者出入行开发web的时候还是很原始的使用jqueyr和js操作dom，现在想来当年也是给黑客留下了不少后门；")]),e._v(" "),t("p",[e._v("当然reactjs也并非100% xss protected:\nhttps://stackoverflow.com/questions/33644499/what-does-it-mean-when-they-say-react-is-xss-protected")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function createMarkup() {\n  return {__html: 'First &middot; Second'};\n}\n\nfunction MyComponent() {\n  return <div dangerouslySetInnerHTML={createMarkup()} />;\n}\n\nReact.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED\n")])])]),t("p",[e._v("同理，最基础的sql simple query拼接贡献了大量数据库漏洞，而进化出的extended protocol剥离了用户数据prepare和sql执行execute，从而阻挡了sql注入；")]),e._v(" "),t("blockquote",[t("p",[e._v("Remember: SQL injection happens when the SQL parser is fooled into believing that a parameter string is in fact a SQL query, and then the SQL engine goes on and executes that SQL statement. When the SQL query string lives in your application code, and the user-supplied parameters are sent separately on the network, there’s no way that the SQL parsing engine might get confused.\nhttps://tapoueh.org/blog/2018/11/preventing-sql-injections/")])]),e._v(" "),t("p",[e._v("众多的库lib里面也隐藏着彩蛋，比如BUFFER未初始化内存泄漏数据；")]),e._v(" "),t("p",[e._v("java的很多buildingblock component都有过经典的serialization序列化漏洞；")]),e._v(" "),t("p",[e._v("即使语言和库本身都很完美，编程逻辑也会送出逻辑漏洞，比如github oath流程漏洞")]),e._v(" "),t("p",[e._v("程序员的思维是尽可能找出所有漏洞，黑客的思维是找出一个漏洞一击致命!")]),e._v(" "),t("p",[e._v("Programming is an important part of being a successful hacker. This isn’t a comprehensive list of programming languages and nearly any can be used for most hacking tasks, especially on the web, but rather a list of languages we find especially useful or notable.")]),e._v(" "),t("h2",{attrs:{id:"javascript"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#javascript"}},[e._v("#")]),e._v(" JavaScript")]),e._v(" "),t("p",[e._v("https://javascript.info/")]),e._v(" "),t("p",[e._v("This is the language used on the majority of web pages. Understanding it is useful for bug hunting because many bugs actually stem from JS code.")]),e._v(" "),t("p",[e._v("Can be used for the same tasks as Python and Ruby (albeit with fewer relevant libraries), but mostly useful to know for analysis of code on the web, as well as exploitation.")]),e._v(" "),t("h2",{attrs:{id:"python-and-ruby"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#python-and-ruby"}},[e._v("#")]),e._v(" Python and Ruby")]),e._v(" "),t("p",[e._v("https://docs.python.org/3/tutorial/")]),e._v(" "),t("p",[e._v("Useful for automation and quick testing and analysis, particularly for web hacking.")]),e._v(" "),t("h2",{attrs:{id:"java-and-kotlin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java-and-kotlin"}},[e._v("#")]),e._v(" Java and Kotlin")]),e._v(" "),t("p",[e._v("The ability to read these will be essential if you plan to do source code review of Android applications. Java is produced by decompilers for Android applications, which allows you to read code (roughly) equivalent to the original source, even when you only have a compiled application.")]),e._v(" "),t("h2",{attrs:{id:"haskell"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#haskell"}},[e._v("#")]),e._v(" Haskell")]),e._v(" "),t("p",[e._v("https://itnext.io/hacking-with-haskell-28887c1f2d06")]),e._v(" "),t("p",[e._v("http://learnyouahaskell.com/chapters")]),e._v(" "),t("h2",{attrs:{id:"sql"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sql"}},[e._v("#")]),e._v(" SQL")]),e._v(" "),t("p",[e._v("https://sqlbolt.com/\nUsed by most applications for accessing and manipulating data. Knowledge of SQL will help in discovering and exploiting critical SQL Injection vulnerabilities.")]),e._v(" "),t("h2",{attrs:{id:"objective-c-and-swift"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#objective-c-and-swift"}},[e._v("#")]),e._v(" Objective-C and Swift")]),e._v(" "),t("p",[e._v("The ability to read these will be essential if you plan to do source code review of iOS applications.")]),e._v(" "),t("h2",{attrs:{id:"aarch64-assembly"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#aarch64-assembly"}},[e._v("#")]),e._v(" AArch64 assembly")]),e._v(" "),t("p",[e._v("汇编对于内存攻防很重要 参考《0 day》")]),e._v(" "),t("p",[e._v("For advanced embedded and mobile hacking, understanding the very lowest level of abstraction is essential.")]),e._v(" "),t("p",[e._v("https://www.tutorialspoint.com/assembly_programming/index.htm")])])}),[],!1,null,null,null);a.default=n.exports}}]);