
## Grammar
### 1.Superglobals vs Variable variables
Translation faulty:
http://php.net/manual/en/language.variables.variable.php

Please note that variable variables cannot be used with PHP's Superglobal arrays within functions or class methods. The variable $this is also a special variable that cannot be referenced dynamically.
http://www.php.net/manual/zh/language.variables.variable.php

注意，在 PHP 的函数和类的方法中，超全局变量不能用作可变变量。$this 变量也是一个特殊变量，不能被动态引用。
My Post: [Use variable variables with PHP's Superglobal arrays outside of function and class](http://stackoverflow.com/questions/34367055/use-variable-variables-with-phps-superglobal-arrays-outside-of-function-and-cla)
BTW: Variable variables IN C#: dynamic or variable

php变量覆盖经验解说
http://zone.wooyun.org/content/1872
php全局变量漏洞 $GLOBALS  
http://www.2cto.com/Article/201207/143314.html
全局变量与超级全局变量什么区别 http://blog.sina.com.cn/s/blog_9c6ac47201010gye.html
[缓解PHP超全局变量带来的企业风险](http://netsecurity.51cto.com/art/201406/443327.htm)

Superglobals can't be accessed via variable variables in a function?
http://stackoverflow.com/questions/8071118/superglobals-cant-be-accessed-via-variable-variables-in-a-function
Variable variables and superglobals
http://stackoverflow.com/questions/12163183/variable-variables-and-superglobals
Accessing _POST and _GET dynamically using ${$varname}
http://stackoverflow.com/questions/15071907/accessing-post-and-get-dynamically-using-varname
Interesting Use of PHP Super Globals
http://pageconfig.com/post/interesting-use-of-php-super-globals
Are there any good use-cases for variable variables?
http://programmers.stackexchange.com/questions/154588/are-there-any-good-use-cases-for-variable-variables
Is using superglobals directly good or bad in PHP?
http://stackoverflow.com/questions/3498207/is-using-superglobals-directly-good-or-bad-in-php


### 2.Class and Function
Using namespaces: fallback to global function/constant
http://www.php.net/manual/en/language.namespaces.fallback.php
What is the difference between class and function in php?
http://stackoverflow.com/questions/20649820/what-is-the-difference-between-class-and-function-in-php

http://www.php.net/manual/en/langref.php
http://mamboforge.net/
todo...
高级PHP应用程序漏洞审核技术  https://code.google.com/archive/p/pasc2at/wikis/SimplifiedChinese.wiki
http://www.wooyun.org/bugs/wooyun-2012-013400
http://www.wooyun.org/bugs/wooyun-2015-0131548
https://www.google.com.sg/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=metinfo-variables-covering-bypass-sql-ids
https://www.google.com.sg/search?q=%24newpassword+%3D+password(%24_POST%5B%27info%27%5D%5B%27newpassword%27%5D%2C+%24this-%3Ememberinfo%5B%27encrypt%27%5D)%3B&oq=%24newpassword+%3D+password(%24_POST%5B%27info%27%5D%5B%27newpassword%27%5D%2C+%24this-%3Ememberinfo%5B%27encrypt%27%5D)%3B&aqs=chrome..69i57.1555j0j4&sourceid=chrome&es_sm=93&ie=UTF-8
http://www.imperva.com/docs/hii_php_superglobals_supersized_trouble.pdf
https://books.google.com.sg/books?id=_3dBGqq7eF4C&pg=PT408&lpg=PT408&dq=array(%27_GET%27,%27_POST%27,%27_COOKIE%27,%27_REQUEST%27)&source=bl&ots=PusiiP_Hfh&sig=wOMZWbK7dfiMBltbC18ajDoxomo&hl=en&sa=X&ved=0ahUKEwjknrzo8uXJAhWDkI4KHUVDC-YQ6AEIRjAJ#v=onepage&q=array('_GET'%2C'_POST'%2C'_COOKIE'%2C'_REQUEST')&f=false
https://books.google.com.sg/books?id=Gz_9qi0yRcoC&pg=PA133&lpg=PA133&dq=Superglobal+variable+variables+outside&source=bl&ots=Yb-7X9zyyX&sig=8MDQMYe35BSxanKIwDipmoiJXAc&hl=en&sa=X&ved=0ahUKEwiom87l3-XJAhVFGo4KHYH-BDQ4ChDoAQgZMAA#v=onepage&q=Superglobal%20variable%20variables%20outside&f=false
http://test.91toufang.com/test.php?_POST[GLOBALS][cfg_dbname]=X
http://web-archive-me.com/me/y/yaseng.me/2013-11-28_3239576-titles_2/webshell_xss_%E7%8C%A5%E7%90%90%E5%88%B7%E6%9F%90%E6%8A%95%E7%A5%A8_Yaseng_s_Blog/

### 3.Encoding Problem
page encoding, transport encoding, html header encoding, md5 sign encoding, database encoding, etc.
icov
header
1.send sms
2.html to object
```
public static function html_to_obj($html) {
	$pattern = "/<[^\/>]*>([\s]?)*<\/[^>]*>/";
	$html=preg_replace($pattern, '', $html);
	$meta = '';
	$dom = new DOMDocument();
	$dom->loadHTML($meta.$html);
	return Response::element_to_obj($dom->documentElement);
	}
	public static function element_to_obj($element) {
	$obj = array( "tag" => $element->tagName );
	foreach ($element->attributes as $attribute) {
	$obj[$attribute->name] = $attribute->value;
	}
	foreach ($element->childNodes as $subElement) {
	if ($subElement->nodeType == XML_TEXT_NODE) {
	$obj["html"] = $subElement->wholeText;
	}
	else {
	$obj["children"][] = Response::element_to_obj($subElement);
	}
	}
	return $obj;
}
```
中文一个字在不同的encoding下会有不同的字节长度 2-3

### $_REQUEST vs $_GET and $_POST
variables_order

### $_FILES tmp_name

https://www.php.net/manual/en/reserved.variables.files.php

windows默认是%AppData%\Local\Temp

linux默认是 /tmp

打印方法：sys_get_temp_dir()

设置方法：php.ini: upload_tmp_dir

## 搭建环境和IDE调试

### Versions
TS NTS(N)
ISAPI
CGI
Fast CGI
PHP版本中的VC6,VC9,VC11,TS,NTS区别
http://www.cnblogs.com/codersay/p/4301783.html

?#使用php5.2时遇到，error_incomplete_chunked_encoding，换用5.6即可

?# php5.5 changes:

ignore. Deprecated: mysql_connect(): The mysql extension is deprecated and will be removed in the future: use mysqli or PDO instead


### PHP.INI 常用配置

```
#php -ini | grep 'php.ini'
Configuration File (php.ini) Path => /etc/opt/rh/rh-php72
Loaded Configuration File => /etc/opt/rh/rh-php72/php.ini

<?php
phpinfo();
?>

php version
php extension

short_open_tag = On #php显示源码/代码   https://www.oschina.net/question/5029_79046
```
### phpstudy+vscode+xdebug
**step 1: 给vscode配置外部php executor（phpstudy)**
https://code.visualstudio.com/docs/languages/php

ctrl+shift+P 打开 setting.json
php.validate.executablePath

```
{
    "workbench.colorTheme": "Relax Eyes",
    "diffEditor.ignoreTrimWhitespace": false,
    "C_Cpp.updateChannel": "Insiders",
    "php.executablePath": "",
    "php.validate.executablePath": "D:/phpstudy_pro/Extensions/php/php7.3.4nts/php.exe"
}
```
**step 2: 开启listen for xdebug**
vscode开启debug，deubg=》新建配置选择 listen for xdebug，

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for XDebug",
            "type": "php",
            "request": "launch",
            "port": 9000,
            "xdebugSettings": {
                "max_children": 1000,
                "max_data": 512,
                "max_depth": 3
                }
      }
            
        },
        {
            "name": "Launch currently open script",
            "type": "php",
            "request": "launch",
            "program": "${file}",
            "cwd": "${fileDirname}",
            "port": 9000
        }
    ]
}
```
注意xdebug settings是为了vscode watch变量的时候不受默认限制
https://github.com/xdebug/vscode-php-debug#supported-launchjson-settings

**step 3: phpstudy php配置xdebug extenstion**
PHP Debug Extension

https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug

创建phpinfo文件，访问获取相应php的路径：

```
phpinfo.php放到网站根目录:
<?php
phpinfo();
?>

访问：
http://testphp.local/phpinfo.php

获得：
**Loaded Configuration File**：D:\phpstudy_pro\Extensions\php\php7.3.4nts\php.ini
```

https://xdebug.org/wizard

贴入phpinfo内容，根据提示下载配置，比如

```
Download php_xdebug-2.9.6-7.3-vc15-nts-x86_64.dll

如果找不到相应版本，可以去https://xdebug.org/download/historical 手动下载
注意要根据 phpinfo下载相应的版本，比如Architecture	x86则下载32位的
注意测试5.5的版本及以下都不成功，需要用php5.6版本以上

Move the downloaded file to D:\phpstudy_pro\Extensions\php\php7.3.4nts\ext
Edit D:\phpstudy_pro\Extensions\php\php7.3.4nts\php.ini and add the line
zend_extension = D:\phpstudy_pro\Extensions\php\php7.3.4nts\ext\php_xdebug-2.9.6-7.3-vc15-nts-x86_64.dll
Restart the webserver
```

php.ini添加：

```ini
[XDebug]
xdebug.remote_enable = 1
xdebug.remote_autostart = 1
xdebug.remote_host=localhost
xdebug.remote_port=9000（对应vscode的端口）
```
或者直接在phpstudy->系统环境找到php配置，enable xdebug，填上端口号（对应vscode的端口）

重启phpstudy

查看phpinfo是否有xdebug


PHP Intelephense
https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client


### XAMPP+PHPStorm+xdebug
集成了apache+mysql phpadmin+tomcat)+PHPStorm。

With a static IP/single developer
![](/docs/docs_image/software/programming/php01.gif)
With an unknown IP/multiple developers
![](/docs/docs_image/software/programming/php02.gif)

安装过程不必多说，好像有一步需要选择自动启动service（这样以后就无需开启xampp就自动service中启动apache mysql等等），不过没关系，以后手动启动也是可以
启动的时候总是不顺利的，一般来说80端口肯定是被占用的，你可以cmd命令行netstat -aon|findstr "80"查看端口是否被使用，如果被占用，更改下端口即可，还有SSL端口默认是443

小技巧，从xampp面板启动apache启动失败有时候提示的错误信息很少，请找到xampp的安装目录，执行apache_start.bat脚本，命令窗会提示更详细的信息
接下来是mysql了，默认的port是3306，user是root，password为空，如果3306被占用就改成其他端口，
xmapp work with mysql existing!
此处寡人遇到了一个问题，我的机器之前已经安装了完整的mysql（server和connector），所以就尴尬了，各种错误，比如
10:31:05 PM [mysql] MySQL Service detected with wrong path
10:31:05 PM [mysql] Change XAMPP MySQL and Control Panel settings or
10:31:05 PM [mysql] Uninstall/disable the other service manually first
10:31:05 PM [mysql] Found Path: "C:\Program Files\MySQL\MySQL Server 5.5\bin\mysqld" --defaults-file="C:\Program Files\MySQL\MySQL Server 5.5\my.ini" MySQL
10:31:05 PM [mysql] Expected Path: c:\xampp\mysql\bin\mysqld.exe --defaults-file=c:\xampp\mysql\bin\my.ini mysql
可见xampp被搞晕了，其实很简单，不要用xampp的mysql就好了嘛，改下phpMyAdmin的config.inc.php(比如我已经安装的mysql默认密码不是空)
现在打开localhost:81就看到效果了，点击phpadmin，会有两个红色的扎眼的error
The phpMyAdmin configuration storage is not completely configured, some extended features have been deactivated. To find out why click here.
Connection for controluser as defined in your configuration failed.
fixed:
1.import create_tables.sql, create database phpmyadmin
2.add user and grant privileges to user pma with pmapass
change phpmyadmin/config.inc.php
/* User used to manipulate with storage */
// $cfg['Servers'][$i]['controluser'] = 'pma';
// $cfg['Servers'][$i]['controlpass'] = 'pmapass';
3.logout phpmyadmin
find $cfg['Servers'][$i]['auth_type'] = 'config'; change config to 'cookie'
4.login with root,you query any table under phpmyadmin error 'phpmyadmin.pma_table_uiprefs doesn't exist',
change config again, table name has double underscore
$cfg['Servers'][$i]['bookmarktable'] = 'pma_bookmark';
to
$cfg['Servers'][$i]['bookmarktable'] = 'pma__bookmark';
congratulations! everything settled, enjoy now.

phpstrom IDE的使用和强大的远程调试功能，常用的调试方法有xdebug和zend debugger，
我们这里要介绍phpstorm+xdebug+xampp配置
首先php.ini要修改配置如下：
```
zend_extension = "C:\xampp\php\ext\php_xdebug.dll"
xdebug.remote_enable = 1
xdebug.remote_handler = "dbgp" 调试协议，xdebug两种调试协议，GDB和DBGP
xdebug.remote_host = "localhost"
xdebug.remote_mode = "req" 调试方式，req:php开始执行时，xdebug与IDE建立连接，jit:php稚轩到断点处或者error时，跟IDE建立连接
xdebug.remote_port = 9000 
```

然后phpstorm内配置：
File->Settings
找到PHP（最新版本是在Languages&Frameworks下面）-> Debug，设置xdebug prot同上9000，
继续在下面找到DBGp Proxy,IDE KEY:phpStorm, HOST:localhost, PORT:9000
然后是在浏览器设置：
chrome下载extension xdebug helper(IDEKEY选择phpstorm,DOMAIN FILTER加入whitelist)
firefox下载add on xdebug
其他浏览器访问 http://www.jetbrains.com/phpstorm/marklets/ 填上phpStorm，generate，把start、stop拖入工具栏
这样设置基本结束了
phpstorm中设置断点，启动监听（电话标识），chrome中启动xdebug helper并选择状态Debug，访问
原理：
开启xdeug远程调试需要get 迫使他或者是cookie方式传入XDEBUG_SESSION_START变量，结束是传入XDEBUG_SESSION_STOP

结合我们上篇安装的集成环境xampp，我们需要设置：
phpstorm的PHP interpreter
phpstorm的server localhost，端口跟上篇xampp的apache端口一致
并且注意一开始的php.ini要修改xampp内集成的php.ini，并且重启
强大的远程调试：
1.只需更改上面提到的phpstorm settings->php->server，host(ip/domain)和port，一定要勾选下面的use path mapping，对应server目录映射到本地目录

2.本地调试好远程对比同步，phpstorm创建project from existing files->Web server is on remote host,files are accessible via FTP/SFTP/FTPS,下一步选择default或者custom（比如exclude items by name[去除.git .svn等文件]，upload changed files automatically to the default server，这样比较危险，不过特殊需求的人喜欢），下一步就很简单了，提供ftp的相关信息即可，唯一注意的是如果ftp连接不上，请选择advanced->passive mode
参考阅读：
PhpStorm Best Practices - The Perfect Workflow for PHP Developers
https://www.youtube.com/watch?v=TejBj_N-3rI
phpstorm https://www.jetbrains.com/phpstorm/
Working with remote project in WebStorm PhpStorm
https://www.youtube.com/watch?v=cDWwPWy8E1M

Debugging remote CLI with phpstorm
https://www.adayinthelifeof.nl/2012/12/20/debugging-remote-cli-with-phpstorm/
xdeug document
http://xdebug.org/docs/

Bitnami for XAMPP
https://bitnami.com/stack/xampp?utm_source=bitnami&utm_medium=installer&utm_campaign=XAMPP%2BInstaller

详细讲述远程调试remote debugging的配置问题，上一篇只是大概描述了下基本配置，
理解远程调试的精髓首先要明确本地+浏览器+服务器的关系，即local develop env(phpstorm)+browser(chrome with xdebug helper)+php server(php+xdebug)的关系

这里有几个重点：
1.远程server，一定要注意下载的xdebug版本跟php版本一致（以及确定php是否是线程安全模式），下载对应的版本的nts或者ts版本，这些都可以在phpinfo中查看，并且注意，实际server上的环境可能是phpstudy或者其他环境（注意扩展xdebug设置的时候，开启的格式可能是extension="c:\***\xdebug.dll" zend_extension="c:\***\xdebug.dll" zend_extension_ts="..."），最后开启后再刷新phpinfo确认。
2.端口转发，路由器设置WAN-Virtual Server/port forwarding外网端口9000映射本机9000，并且注意防火墙允许该端口的进出规则
3.chrome xdebug helper设置正确，并且调试时开启小虫子（debug模式）
4.本机的phpstorm 编辑run/debug configuration，server需要validate remote environment，use  path mapping注意远程的path是否正确，如果是根目录 / 最好也填写以下
参考阅读：
1.Configuring PhpStorm, XDebug, and DBGp Proxy Settings for Remote Debugging with Multiple Users
http://matthardy.net/blog/configuring-phpstorm-xdebug-dbgp-proxy-settings-remote-debugging-multiple-users/
2.Debugging remote CLI with phpstorm
https://www.adayinthelifeof.nl/2012/12/20/debugging-remote-cli-with-phpstorm/
3.Zero-configuration Web Application Debugging with Xdebug and PhpStorm   Xdebug and You: Why You Should be Using a Real Debugger
http://confluence.jetbrains.com/display/PhpStorm/Zero-configuration+Web+Application+Debugging+with+Xdebug+and+PhpStorm
4.xdebug download    PHP的(Thread Safe与Non Thread Safe)
http://www.cnblogs.com/gaoxu387/p/3173194.html

### WAMP

Creating multiple virtual hosts/websites in Wampserver
https://www.virendrachandak.com/techtalk/creating-multiple-virtual-websites-in-wampserver/
http://sourceforge.net/projects/wampserver/?source=typ_redirect

### host php in IIS
https://docs.microsoft.com/en-us/iis/application-frameworks/scenario-build-a-php-website-on-iis/configure-a-php-website-on-iis

Upgraded to Windows 10 and now WAMP won't work, show up IIS page
iisreset /stop,
if got 404 not found error, open SERVICES.MSC  or Port 80 being used by Server: Microsoft-HTTPAPI/2.0 , stop "Web Deployment Agent Service"
Then Apache > Service > Install Service will prompt you to press Enter to install as normal.

### PHP Hosts Troubleshooting

multi-site :

httpd-vhosts.conf
```
<VirtualHost *:80>
ServerAdmin admin@localhost
DocumentRoot "c:/wamp/www"
ServerName localhost
ServerAlias www.localhost.com
ErrorLog "logs/localhost-error.log"
CustomLog "logs/localhost-access.log" common
</VirtualHost>
<VirtualHost *:80>
DocumentRoot "c:/wamp/www/site1"
ServerName site1.com
</VirtualHost>
<VirtualHost *:80>
DocumentRoot "c:/wamp/www/site2"
ServerName site2.com
<Directory "c:/wamp/www/site2">
Options Indexes FollowSymLinks MultiViews
AllowOverride None
Order allow,deny
Allow from all
</Directory>
</VirtualHost>
```

The server encountered an internal error or misconfiguration and was unable to complete your request
check logs/apache_error.log

.htaccess: Invalid command 'RewriteEngine',
LoadModule rewrite_module modules/mod_rewrite.so

.mysql error, check port, 127.0.0.1 instead of localhost

## PHP Troubleshooting
### ?#MD5withRSA
Recently when I made integration with a third-party payment supplier named '盛付通',somehow they mistakenly gave me a wrong documentation at first, in the 'wrong' document, the signature algorithm they are using is MD5withRSA,they require client to generate another private and public key pair, given steps:

tools:platform_private_key.pem openssl sn.exe

1.	generate cert from private key：
openssl req -new -x509 -days 365 -key platform_private_key.pem -out platform_cert.crt

2.	create pfx file：
openssl pkcs12 -export -out platform_cert.pfx -inkey platform_private_key.pem -in platform_cert.crt

3.	generate snk format public key file from pfx：
sn -p platform_cert.pfx platform_public.snk

4.convert platform_public.snk to Base64 encoding string and upload it to their '盛付通' platform.

At the very beginning, I was confused by above steps,why design in this manner, unforunately they don't provide any support and clarification, kept telling me I don't need to read that document..... curious driven, after google online,I guess the whole story might be that the platform holds platform-private-key and dispense platform-public-key to clients, while clients required to generate client-private-key and client-public-key,by uploading , platform keeps client-public-key also,this approach might intend to double secure, so work flow might be:

1. Client post payment info which encrypt using client-private-key,
   
2. Platform receive post info, decrypt using client-public-key, validation and processing payment successfully
   
3. Platform encrypt payment result using platform-private-key, then notify Client
   
4. Client received notification, decrypt it using platform-public-key.....

Let me make introduction of all the formats mentioned above:

PEM Format

It is the most common format that Certificate Authorities issue certificates in. It contains the ‘—–BEGIN CERTIFICATE—–” and “—–END CERTIFICATE—–” statements.
Several PEM certificates and even the Private key can be included in one file, one below the other. But most platforms(eg:- Apache) expects the certificates and Private key to be in separate files.

> They are Base64 encoded ACII files

> They have extensions such as .pem, .crt, .cer, .key

> Apache and similar servers uses PEM format certificates


PFX/PKCS#12

They are used for storing the Server certificate, any Intermediate certificates & Private key in one encryptable file.

> They are Binary format files

> They have extensions .pfx, .p12

> Typically used on Windows OS to import and export certificates and Private keys

.CER- 
stands for Microsoft X.509 certificate, certificate stored in the X.509 standard format. This certificate contains information about the certificate's owner... along with public and private keys.

.PVK- 
files are used to store private keys for code signing. You can also create a certificate based on .pvk private key file.

.PFX- 
stands for Personal Information Exchange format using a password-based symmetric key. It is used to exchange public and private objects in a single file. A pfx file can be created from .cer file. Can also be used to create a Software Publisher Certificate.

.SNK- 
stands for Assembly Signature Key Attribute, only contain the RSA key (public/private or public only)

there is also a coding approach to extract snk from pfx
```
///
/// Converts .pfx file to .snk file.
///
///.pfx file data. ///.pfx file password. /// .snk file data.
public static byte[] Pfx2Snk(byte[] pfxData, string pfxPassword)
{
// load .pfx
var cert = new X509Certificate2(pfxData, pfxPassword, X509KeyStorageFlags.Exportable);
// create .snk
var privateKey = (RSACryptoServiceProvider)cert.PrivateKey;
return privateKey.ExportCspBlob(true);
}
```

Simple Example OpenSSL: Encrypt Data With an RSA Key With PHP
https://rietta.com/blog/2013/06/13/openssl-encrypt-data-with-rsa-key-with/
OpenSSL for Windows
http://gnuwin32.sourceforge.net/packages/openssl.htm
Command Line Utilities
https://wiki.openssl.org/index.php/Command_Line_Utilities
php实现MD5withRSA签名算法
http://www.cnblogs.com/kennyhr/p/3746100.html
MD5 with RSA in php
http://stackoverflow.com/questions/22653640/md5-with-rsa-in-php
Difference between MakeCert and OpenSSL wrt C# SslStream
http://stackoverflow.com/questions/26186780/difference-between-makecert-and-openssl-wrt-c-sharp-sslstream
windows主机开启openssl的方法
http://www.feichang56.com/openssl.html
IIS6.0 + openssl执行版 + Windows2003--配置篇
http://mixangel.blog.51cto.com/286311/135267

### ?#failed to open stream: no suitable wrapper could be found
https://stackoverflow.com/questions/6551379/file-get-contents-error

### ?#PHP parse_url bad practice
identified an issue when install OneBase.org php framework( which is based on Thinkphp 5.0)
the root cause is callling of php internal function parse_url, when your password includes special character like #, the parse_url function wrongly split the string,
work around is by adding a / at the tail of $url
small issue, but may waste plenty of time investigating it because of layering and encapsulation


## PHP Code Snippets

### 伪随机 mt_rand()

https://www.cnblogs.com/zaqzzz/p/9997855.html

```
<?php  
mt_srand(12345);    //分发seed种子，
//然后种子有了后，靠mt_rand()生成随机数
echo mt_rand()."<br/>"; //第一次
echo mt_rand()."<br/>"; //第二次
....
echo mt_rand()."<br/>"; //第n次
?>  
任意执行上面程序，会发现每一次生成的“随机数”顺序都是一样的，第一次的永远是一样的，第二次的也是....
原因： 生成伪随机数是线性的，你可以理解为y=ax,x就是种子，知道种子后，可以确定你输出伪随机数的序列。
知道你的随机数序列，可以确定你的种子。当然实际上更复杂肯定。

```



工具: php_mt_seed (PHP mt_rand() seed cracker)

https://www.openwall.com/php_mt_seed/

```
tar zxvf php_mt_seed-4.0.tar.gz
cd php_mt_seed-4.0/
make
./php_mt_seed <给个随机数> 可以算出seed
```

### upload large files
upload images
export PDF tcpdf
https://www.sitepoint.com/upload-large-files-in-php/

Strict Standards: Only variables should be passed by reference
http://stackoverflow.com/questions/9848295/strict-standards-only-variables-should-be-passed-by-reference-error
SMS
XML PARSE

### Illegal string-offset

PHP safe check
from 5.3 upgrade to 5.4
http://stackoverflow.com/questions/24017096/deploying-cakephp-to-php-5-4-16-gives-illegal-string-offset-in-cakephps-core
And as it's working in PHP 5.3, it is not going to work in PHP 5.4 because as I have cast my array into a string, I should cast it back to an array (or to be more precise: use my previously created string from the array as an array) which gives this error/warning in PHP 5.4.
```
foreach(array('_GET','_POST','_COOKIE','_REQUEST') as $key) {
if (isset($$key)){
foreach($$key as $_key => $_value){
$$key[$_key] = safe_str($_value);
}
}
}
 ```
http://stackoverflow.com/questions/24151713/looping-variable-variables-illegal-string-offset
```
foreach(array('_GET','_POST','_COOKIE','_REQUEST') as $key) {
if (isset($$key)){
$temp=array();
foreach($$key as $_key => $_value){
if(is_array($$key)&&array_key_exists($_key,$$key)){
if($_key=='PHPSESSID' || $_value==''){
}else{
$temp[$_key] = safe_str($_value);
}
}
${$key}=$temp;
}
}
```
http://stackoverflow.com/questions/23895204/php-5-5-12-illegal-string-offset-on-a-valid-array
http://stackoverflow.com/questions/15361392/how-do-i-correct-this-illegal-string-offset

PHP magic_quotes_gpc的详细使用方法
http://developer.51cto.com/art/200911/165392.htm
http://php.net/manual/en/security.magicquotes.disabling.php
stackoverflow.com/questions/6661406/best-method-of-disabling-php-magic-quotes-without-php-ini-or-htaccess

Notice: Undefined index:
Ways to deal with the issue:

Recommended: Declare your variables. Or use isset() to check if they are declared before referencing them, as in: $value = isset($_POST['value']) ? $_POST['value'] : '';.
Set a custom error handler for E_NOTICE and redirect the messages away from the standard output (maybe to a log file). set_error_handler('myHandlerForMinorErrors', E_NOTICE | E_STRICT).
Disable E_NOTICE from reporting. A quick way to exclude just E_NOTICE is error_reporting( error_reporting() & ~E_NOTICE ).
Suppress the error with the @ operator.
Uninitialized string offset: 0
is_array()
Non-static method xxx:xxx() should not be called statically

### php session null

debug steps：
1、create phpinfo.php :

open using browser and check session portion.
2、cross domain issues: if set session.cookie_domain = A, session cookies is invalid in domain B.
you can set session.cookie_domain="" in php.ini
3、if set session.cookie_path = /abc/ in php.ini, only folder abc and its subdirectory is allowed to use session.in this case, set session.cookie_path = /
4、misuse of session.cookie_path and session.save_path, session.cookie_path specifies path to set in the session cookie, while session.save_path defines the argument which is passed to the save handler. If you choose the default files handler, this is the path where the files are created.
5、lack of write permission on session.save_path, or the path not exits, by default, windows uses '%SystemRoot%\TEMP', unix uses '/tmp'
6、when session.auto_start = on, execute session_start() will generate new session_id.and check whether session_start() at wrong position

### serialize unserialize
a:2:{i:0;a:3:{s:2:"id";s:1:"1";s:3:"num";s:1:"3";s:4:"desc";s:3:"50%";}i:1;a:3:{s:2:"id";s:1:"3";s:3:"num";s:1:"4";s:4:"desc";s:32:"交通便利";}}
http://blog.tanist.co.uk/files/unserialize/

How can I prevent SQL-injection in PHP?
http://stackoverflow.com/questions/60174/how-can-i-prevent-sql-injection-in-php

Protect Against Malicious POST Requests
https://perishablepress.com/protect-post-requests/

CURL
CURL exec - Curl failed with error 0,
http://stackoverflow.com/questions/8227909/curl-exec-always-returns-false
Using cURL in PHP to access HTTPS (SSL/TLS) protected sites
Return code is 0 SSL certificate problem: unable to get local issuer certificateCurl error: string(25) "Curl failed with error 0," NULL
http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/

Return code is 500 string(25) "Curl failed with error 0," NULL
this could be pramamter issues or other program handler problem.

refer：
http://www.cnblogs.com/suihui/p/4365107.html

<disqus/>