(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{254:function(e,t,a){"use strict";a.r(t);var s=a(0),r=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[e._v("正则表达式 Regex\n个人感觉正则表达才是计算机高级语言，超越了人眼的匹配，直追人脑的匹配能力。\n我们经常与正则表达打交道,多数情况下我们都是用基本的匹配,比如简单的javascript验证手机\\email有效性等,但是遇到复杂的需求,每次都是苦战。\n,去除起来如果是用html parser的匹配有时候又费力又慢，正则用起来很犀利，可是写出来很难，所以建议先用好搜索引擎，\n用适当的关键词获取类似的例子，改造一番。然后茶余饭后再阅读本文做进一步的学习理解。")]),e._v(" "),a("p",[e._v("http://www.regexr.com/: This is a really good site where we can get examples and references and test our own expressions to check whether a string matches or not.\nhttp://www.regular-expressions.info: This site contains tutorials and examples to learn how to use regular expressions. It also has a useful reference on the particular implementations of the most popular languages and tools. http://www.princeton.edu/~mlovett/reference/Regular-Expressions.pdf (Regular Expressions The Complete Tutorial) by Jan Goyvaerts: As its title states, this is a very complete tutorial on RegEx, including examples in many languages.")]),e._v(" "),a("h2",{attrs:{id:"common-used"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#common-used"}},[e._v("#")]),e._v(" Common used")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("/([^:]+):.*/\t192.1.1.1:9100\t192.1.1.1\n")])])]),a("p",[e._v("常用正则表达式 useful regular expression\n10+ Useful JavaScript Regular Expression Functions to improve your web applications efficiency\nhttp://ntt.cc/2008/05/10/over-10-useful-javascript-regular-expression-functions-to-improve-your-web-applications-efficiency.html\n里面有信用卡的验证 http://www.virtuosimedia.com/dev/php/37-tested-php-perl-and-javascript-regular-expressions")]),e._v(" "),a("h2",{attrs:{id:"_1-tutorial"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-tutorial"}},[e._v("#")]),e._v(" 1.Tutorial")]),e._v(" "),a("p",[e._v("Basic https://regexone.com/lesson/introduction_abcs\nit's always good to be precise, and that applies to coding, talking, and even regular expressions.\nFor example, you wouldn't write a grocery list for someone to Buy more .* because you would have no idea what you could get back.\n"),a("a",{attrs:{href:"https://www.princeton.edu/~mlovett/reference/Regular-Expressions.pdf",target:"_blank",rel:"noopener noreferrer"}},[e._v("<"),a("Regular",{attrs:{"Expressions:":"",The:"",Complete:"",Tutorial:""}},[e._v(">"),a("OutboundLink")],1)],1)]),e._v(" "),a("p",[e._v("正则表达式30分钟入门教程 http://www.jb51.net/tools/zhengze.html\nEssential Guide To Regular Expressions: Tools and Tutorials http://www.smashingmagazine.com/2009/06/01/essential-guide-to-regular-expressions-tools-tutorials-and-resources/")]),e._v(" "),a("h3",{attrs:{id:"_1-1-false-positive"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-false-positive"}},[e._v("#")]),e._v(" 1.1 False positive")]),e._v(" "),a("p",[e._v("we've been writing regular expressions that partially match pieces across all the text. Sometimes this isn't desirable, imagine for example we wanted to match the word \"success\" in a log file. We certainly don't want that pattern to match a line that says \"Error: unsuccessful operation\"! That is why it is often best practice to write as specific regular expressions as possible to ensure that we don't get false positives when matching against real world text.")]),e._v(" "),a("p",[e._v("Advance Regex tutorial — A quick cheatsheet by examples https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285")]),e._v(" "),a("p",[e._v("test\nhttps://www.regextester.com/")]),e._v(" "),a("p",[e._v("**Metacharacter **")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("//metacharacters by using their upper case letters means opposite sets of each of these metacharacters\n\\d\n\\w\talphanumeric letters and digits [A-Za-z0-9_]\n\\s\tthe space (␣), the tab (\\t), the new line (\\n) and the carriage return (\\r) \n\\b which matches the boundary between a word and a non-word character. It's most useful in capturing entire words (pattern \\w+\\b).\n^ (hat) \n\tStart of the line\n\t[^abc] will match any single character except for the letters a, b, or c.\n$ (dollar sign)\t\n\tEnd of the line\n.\t\n\t? + *\n\t|\n\t[] options\n\t{} range\n\t() match groups\nQuantifier ? + * {}\nMatch groups and nested groups\n\tImagine for example that you had a command line tool to list all the image files you have in the cloud. You could then use a pattern such as ^(IMG\\d+\\.png)$ to capture and extract the full filename, but if you only wanted to capture the filename without the extension, you could use the pattern ^(IMG\\d+)\\.png$ which only captures the part before the period.\nCharacter class\n")])])]),a("h3",{attrs:{id:"_1-2-backtracking-trackback"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-backtracking-trackback"}},[e._v("#")]),e._v(" 1.2 Backtracking / trackback")]),e._v(" "),a("p",[e._v("My Findings\nhttps://github.com/dotnet/docs/issues/8216")]),e._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/programming/regex01.png",alt:""}})]),e._v(" "),a("p",[e._v("https://stackoverflow.com/questions/33706215/why-do-w-and-s-handle-backtracking-differently/33706273\nhttps://docs.microsoft.com/en-us/dotnet/standard/base-types/backtracking-in-regular-expressions")]),e._v(" "),a("p",[e._v("Image there are two cursor pointers for regex expression and test string respectively,\nNamingly: cursor1 for regex expression, cursor2 for test string;\nExample regex: \\S+:\nThe basic rules are:\nAt a new pos(except start points), if cursor1 not at the beginning of regex meaning the position is at :, it will always traceback first to the first pattern \\S+\nIf these adjacent partial patterns have overlap abilities, then when the later pattern find a mismatch it will ask its previous pattern to spit out characters one by one to do backtrack matching;\nSimilarly, if the outside pattern is repetition of the inside pattern, example (x+x+)+y, then the inside iteration, the second x+ need to give up some x also to match (x+x+)(x+x+)..., example")]),e._v(" "),a("p",[e._v("Runaway Regular Expressions: Catastrophic Backtracking https://www.regular-expressions.info/catastrophic.html")]),e._v(" "),a("p",[a("strong",[e._v("attack using backtrack")]),e._v("\nRegular Expression Denial of Service (ReDoS) and Catastrophic Backtracking https://snyk.io/blog/redos-and-catastrophic-backtracking")]),e._v(" "),a("p",[a("strong",[e._v("Back reference")]),e._v('\nmany systems allow you to reference your captured groups by using \\0 (usually the full matched text), \\1 (group 1), \\2 (group 2), etc. This is useful for example when you are in a text editor and doing a search and replace using regular expressions to swap two numbers, you can search for "(\\d+)-(\\d+)" and replace it with "\\2-\\1" to put the second captured number first, and the first captured number second for example.\n回溯引用、前后查找、嵌入条件 https://blog.csdn.net/wzzfeitian/article/details/8867888')]),e._v(" "),a("h2",{attrs:{id:"_2-application"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-application"}},[e._v("#")]),e._v(" 2.Application")]),e._v(" "),a("h3",{attrs:{id:"_2-1-notepad"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-notepad"}},[e._v("#")]),e._v(" 2.1 notepad++")]),e._v(" "),a("p",[a("strong",[e._v("1.multiple line to single line")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Wrong!:\t[\\R\\s]\nCorrect:\t(\\h*\\R)+ \t\\x20\n\thttps://notepad-plus-plus.org/community/topic/14791/how-to-make-all-data-in-one-line/2\n")])])]),a("p",[a("strong",[e._v("2.complicated case")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('(?<="author_name": ")((?:(?!" ").)*?)[:"]\n\\nhttps://shopee.tw/\\1\\n \n\n Step1:\ninspect -> network -> xhr -> right click (copy link address)\nchange tw to com\n\nhttps://shopee.com/api/v1/comment_list/?item_id=25679461&shop_id=4788349&offset=0&limit=10&flag=1&type=5&filter=0 \n\n\nStep2:\nctrl+f author_name\n\nStep3:\nhttps://shopee.tw/bb601211 \nhttps://shopee.com/shop/44094574/rating/api/?&rating_type=0&offset=0&limit=20 \n\n')])])]),a("p",[e._v("https://superuser.com/questions/477628/export-all-regular-expression-matches-in-textpad-or-notepad-as-a-list\nhttps://stackoverflow.com/questions/43218000/use-regex-to-search-for-a-specific-word-between-an-exact-string-and-the-first-oc\nhttps://stackoverflow.com/questions/16878829/notepad-regex-how-do-i-replace-what-is-found-with-the-same-value-but-with-a-sp")]),e._v(" "),a("p",[e._v("A Few Tricks in Notepad++ a PHP-developer Should Know https://tournasdimitrios1.wordpress.com/2012/09/01/a-few-tricks-in-notepad-a-php-developer-should-know-2/\nNotepad++ tips and tricks https://www.youtube.com/watch?v=PzjPu5F9K9Y")]),e._v(" "),a("p",[a("strong",[e._v("1. find {} pairs")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("find->Mark(bookmark line, regular expression) \\{.*?\\}\nSearch -> bookmark -> copy /delete unmarked lines\n")])])]),a("p",[a("strong",[e._v("2. find everything after }, for each line")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("\\},.*\n")])])]),a("p",[e._v("questions:\nhow to remove everything unmarked text\nAnswer:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Workaround\nhttps://superuser.com/questions/477628/export-all-regular-expression-matches-in-textpad-or-notepad-as-a-list\nfind:(modificationTime=\\d+)\nReplace with: \\n\\1\\n\n")])])]),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/programming/regex02.png",alt:""}})]),e._v(" "),a("h3",{attrs:{id:"_2-2-codes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-codes"}},[e._v("#")]),e._v(" 2.2 Codes")]),e._v(" "),a("p",[a("strong",[e._v("JavaScript")]),e._v("\nRegExp Reference http://www.w3schools.com/jsref/jsref_obj_regexp.asp\njs常用正则表达式表单验证代码 http://wenku.baidu.com/link?url=H6XlUOl26kNCD6HuUxVBbXX5hXf-4_9BrWAYXAh4WBslNtaZHBqui9TdvTaA3gFg4G-CVCSPeB4vqo5--WhnfytCY7Ab8wBgDZnEx6XgT8i")]),e._v(" "),a("p",[a("strong",[e._v("C#")]),e._v("\nhttp://www.rexegg.com/regex-csharp.html\nRegular Expression Language - Quick Reference http://msdn.microsoft.com/en-us/library/az24scfc(v=vs.110).aspx\nBest Practices for Regular Expressions in the .NET Frameworkhttp://msdn.microsoft.com/en-us/library/gg578045(v=vs.110).aspx")]),e._v(" "),a("p",[a("strong",[e._v("java")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('(\\\\+\\\\d{4}|\\\\-\\\\d{4})\n\nimport java.text.DateFormat;\nimport java.text.ParseException;\nimport java.text.SimpleDateFormat;\nimport java.util.Date;\nimport java.util.TimeZone;\nimport java.util.regex.Matcher;\nimport java.util.regex.Pattern;\npublic class MyClass {\n    public static void main(String args[]) {\n        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyyMMddHHmmssZZZZ");\n        Pattern p = Pattern.compile("(\\\\+\\\\d{4}|\\\\-\\\\d{4})");\n        Matcher m = p.matcher("20180900-0500");\n        if (m.find()) {\n            System.out.println(m.group(1));\n        }else{\n            throw new IllegalArgumentException("not Generlized Time");\n        }\n\n\n    }\n}\n\n')])])]),a("p",[e._v("http://www.mkyong.com/regular-expressions/how-to-extract-html-links-with-regular-expression/\nhttp://www.mkyong.com/regular-expressions/10-java-regular-expression-examples-you-should-know/")]),e._v(" "),a("p",[a("strong",[e._v("python")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("#python 3.5.2\nimport re\n\nmsg = ‘[test] : ddd’\nm = re.search(r’(\\[test\\])’, msg)\npos = msg.replace(m.group(0), ‘’).replace(‘:’, ‘’)\npos = re.sub(‘[\\s+]’, ‘’, pos)\nresult = re.sub(‘,.*’, ‘’, pos)\n")])])]),a("p",[e._v("Regular Expression HOWTO https://docs.python.org/2/howto/regex.html\nA collection of useful regular expressions http://nbviewer.ipython.org/github/rasbt/python_reference/blob/master/tutorials/useful_regex.ipynb")]),e._v(" "),a("p",[a("strong",[e._v("linux")])]),e._v(" "),a("p",[a("img",{attrs:{src:"/docs/docs_image/software/programming/regex03.png",alt:""}})]),e._v(" "),a("p",[e._v("https://www.gnu.org/software/findutils/manual/html_node/find_html/Regular-Expressions.html#Regular-Expressions")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("ref:")]),e._v(" "),a("p",[e._v("图文并茂讲解：")]),e._v(" "),a("ol",[a("li",[e._v("Matching a Username 匹配用户名\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex04.png",alt:""}})])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:\n/^[a-z0-9_-]{3,16}$/\nDescription:\nWe begin by telling the parser to find the beginning of the string (^), followed by any lowercase letter (a-z), number (0-9), an underscore, or a hyphen. Next, {3,16} makes sure that are at least 3 of those characters, but no more than 16. Finally, we want the end of the string ($).\n")])])]),a("p",[e._v("扩展思考:想下中文用户名怎么写？")]),e._v(" "),a("ol",{attrs:{start:"2"}},[a("li",[e._v("Matching a Password 匹配密码\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex05.png",alt:""}})])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:/^[a-z0-9_-]{6,18}$/\nDescription:\nMatching a password is very similar to matching a username. The only difference is that instead of 3 to 16 letters, numbers, underscores, or hyphens, we want 6 to 18 of them ({6,18}).\n")])])]),a("p",[e._v("扩展思考：如何检测密码强度（是否有大写结合+特殊字符+数字）")]),e._v(" "),a("p",[e._v("3.Matching a Hex Value 匹配十六进制\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex06.png",alt:""}})]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/\nDescription:\nWe begin by telling the parser to find the beginning of the string (^). Next, a number sign is optional because it is followed a question mark. The question mark tells the parser that the preceding character — in this case a number sign — is optional, but to be \"greedy\" and capture it if it's there. Next, inside the first group (first group of parentheses), we can have two different situations. The first is any lowercase letter between a and f or a number six times. The vertical bar tells us that we can also have three lowercase letters between a and f or numbers instead. Finally, we want the end of the string ($).\nThe reason that I put the six character before is that parser will capture a hex value like #ffffff. If I had reversed it so that the three characters came first, the parser would only pick up #fff and not the other three f's.\n")])])]),a("p",[e._v("4.Matching a Slug 匹配短标签\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex07.png",alt:""}})]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:/^[a-z0-9-]+$/\nDescription:\nYou will be using this regex if you ever have to work with mod_rewrite and pretty URL's. We begin by telling the parser to find the beginning of the string (^), followed by one or more (the plus sign) letters, numbers, or hyphens. Finally, we want the end of the string ($).\n")])])]),a("p",[e._v("5.Matching an Email 匹配邮箱\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex08.png",alt:""}})]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/\nDescription:\nWe begin by telling the parser to find the beginning of the string (^). Inside the first group, we match one or more lowercase letters, numbers, underscores, dots, or hyphens. I have escaped the dot because a non-escaped dot means any character. Directly after that, there must be an at sign. Next is the domain name which must be: one or more lowercase letters, numbers, underscores, dots, or hyphens. Then another (escaped) dot, with the extension being two to six letters or dots. I have 2 to 6 because of the country specific TLD's (.ny.us or .co.uk). Finally, we want the end of the string ($).\n")])])]),a("ol",{attrs:{start:"6"}},[a("li",[e._v("Matching a URL 匹配URL\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex09.png",alt:""}})])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('Pattern:/^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/\nDescription:\nThis regex is almost like taking the ending part of the above regex, slapping it between "http://" and some file structure at the end. It sounds a lot simpler than it really is. To start off, we search for the beginning of the line with the caret.\nThe first capturing group is all option. It allows the URL to begin with "http://", "https://", or neither of them. I have a question mark after the s to allow URL\'s that have http or https. In order to make this entire group optional, I just added a question mark to the end of it.\nNext is the domain name: one or more numbers, letters, dots, or hypens followed by another dot then two to six letters or dots. The following section is the optional files and directories. Inside the group, we want to match any number of forward slashes, letters, numbers, underscores, spaces, dots, or hyphens. Then we say that this group can be matched as many times as we want. Pretty much this allows multiple directories to be matched along with a file at the end. I have used the star instead of the question mark because the star says zero or more, not zero or one. If a question mark was to be used there, only one file/directory would be able to be matched.\nThen a trailing slash is matched, but it can be optional. Finally we end with the end of the line.\n')])])]),a("ol",{attrs:{start:"7"}},[a("li",[e._v("Matching an IP Address 匹配IP地址\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex10.png",alt:""}})])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('Pattern:/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/\nDescription:\nNow, I\'m not going to lie, I didn\'t write this regex; I got it from here. Now, that doesn\'t mean that I can\'t rip it apart character for character.\nThe first capture group really isn\'t a captured group because(?:(?:was placed inside which tells the parser to not capture this group (more on this in the last regex). We also want this non-captured group to be repeated three times — the {3} at the end of the group. This group contains another group, a subgroup, and a literal dot. The parser looks for a match in the subgroup then a dot to move on.\nThe subgroup is also another non-capture group. It\'s just a bunch of character sets (things inside brackets): the string "25" followed by a number between 0 and 5; or the string "2" and a number between 0 and 4 and any number; or an optional zero or one followed by two numbers, with the second being optional.\nAfter we match three of those, it\'s onto the next non-capturing group. This one wants: the string "25" followed by a number between 0 and 5; or the string "2" with a number between 0 and 4 and another number at the end; or an optional zero or one followed by two numbers, with the second being optional.\nWe end this confusing regex with the end of the string.\n')])])]),a("p",[e._v("8.Matching an HTML Tag 匹配HTML标签\n"),a("img",{attrs:{src:"/docs/docs_image/software/programming/regex11.png",alt:""}})]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Pattern:/^<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)$/\nDescription:\nOne of the more useful regexes on the list. It matches any HTML tag with the content inside. As usually, we begin with the start of the line.\nFirst comes the tag's name. It must be one or more letters long. This is the first capture group, it comes in handy when we have to grab the closing tag. The next thing are the tag's attributes. This is any character but a greater than sign (>). Since this is optional, but I want to match more than one character, the star is used. The plus sign makes up the attribute and value, and the star says as many attributes as you want.\nNext comes the third non-capture group. Inside, it will contain either a greater than sign, some content, and a closing tag; or some spaces, a forward slash, and a greater than sign. The first option looks for a greater than sign followed by any number of characters, and the closing tag. \\1 is used which represents the content that was captured in the first capturing group. In this case it was the tag's name. Now, if that couldn't be matched we want to look for a self closing tag (like an img, br, or hr tag). This needs to have one or more spaces followed by \"/>\".\nThe regex is ended with the end of the line.\n扩展思考：如何匹配带有attribute的html标签，以及如何匹配多层嵌套的html标签？\n")])])]),a("p",[e._v("免费书籍：\nRegular Expressions Google Analytics.pdf\nRegular Expressions Cookbook.pdf\nregular expression pocket reference second edition.pdf\nRegular Expressions the complete tutorial.pdf")]),e._v(" "),a("p",[e._v("免费工具:\n在线工具:\n专业工具 https://regex101.com/\n站长简单工具 http://tool.chinaz.com/regex/ http://tool.oschina.net/regex\n免费软件：正则表达式工具绿色版\n收费软件: http://www.regular-expressions.info/tutorial.html")])])}),[],!1,null,null,null);t.default=r.exports}}]);