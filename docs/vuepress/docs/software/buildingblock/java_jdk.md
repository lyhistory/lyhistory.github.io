## jdk

```
查看系统安装的所有java版本
update-alternatives --config java
```

difference between JAVA_HOME and update-alternatives

https://unix.stackexchange.com/questions/123412/what-is-the-difference-between-java-home-and-update-alternatives

update-java-alternatives vs update-alternatives --config java

https://askubuntu.com/questions/315646/update-java-alternatives-vs-update-alternatives-config-java

## jdk troubleshooting

验证码无法显示，需要输出完整的错误日志

```
使用的是log4j2

logger.error("exception: {} " , e.getMessage());
改为
logger.error("exception: {} " , e);

config加上 %ex{full}：
PatternLayout:
  pattern: "%-d{yyyy-MM-dd HH:mm:ss.SSS}-[%l]-[%p] ${PID:-} %m%n - %ex{full}"

- java.lang.NullPointerException
        at sun.awt.FontConfiguration.getVersion(FontConfiguration.java:1264)
        at sun.awt.FontConfiguration.readFontConfigFile(FontConfiguration.java:219)
        at sun.awt.FontConfiguration.init(FontConfiguration.java:107)
        at sun.awt.X11FontManager.createFontConfiguration(X11FontManager.java:776)
        at sun.font.SunFontManager$2.run(SunFontManager.java:431)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.font.SunFontManager.<init>(SunFontManager.java:376)
        at sun.awt.X11FontManager.<init>(X11FontManager.java:57)
```



搜索openjdk sun.awt.FontConfiguration.getVersion nullpointer基本都是：

```
yum install fontconfig
fc-cache --force
```

去到openjdk官网

https://github.com/openjdk/jdk/search?q=FontConfiguration

没有人反应有问题，说明还是系统的问题



从

https://stackoverflow.com/questions/30626136/cannot-load-font-in-jre-8/50802170

得到启发

Also one might need to install at least one font (`dejavu`, `liberation`, etc).

应该是找不到系统上任何字体

对比了一个正常的环境，发现有

```
[sgkc2-devclr-v08@SG/home/clear]$ll /usr/share/fonts/
total 4
drwxr-xr-x 2 root root 4096 Nov 25  2019 dejavu
```

但是另外还有一个可以工作的正常环境，里面并没有上述任何字体，

然后又看到

https://docs.oracle.com/javase/9/intl/font-configuration-files.htm

https://docs.oracle.com/javase/8/docs/technotes/guides/intl/fontconfig.html

```
[sgkc2-devclr-v05@SG/root]#find / -name "fontconfig*"
/var/cache/fontconfig
/usr/lib64/girepository-1.0/fontconfig-2.0.typelib
/usr/share/doc/fontconfig-2.10.95
/usr/share/doc/fontconfig-2.10.95/fontconfig-user.html
/usr/share/doc/fontconfig-2.10.95/fontconfig-user.txt
/usr/share/fontconfig
/usr/share/xml/fontconfig
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.RedHat.5.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.RedHat.5.properties.src
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.RedHat.6.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.RedHat.6.properties.src
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.SuSE.10.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.SuSE.10.properties.src
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.SuSE.11.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.SuSE.11.properties.src
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.Turbo.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.Turbo.properties.src
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.bfc
/usr/java/jre1.8.0_221-amd64/lib/fontconfig.properties.src

]#update-alternatives --config java

There are 3 programs which provide 'java'.

  Selection    Command
-----------------------------------------------
   1           /usr/java/jre1.8.0_221-amd64/bin/java
   2           java-11-openjdk.x86_64 (/usr/lib/jvm/java-11-openjdk-11.0.5.10-0.el7_7.x86_64/bin/java)
*+ 3           java-1.8.0-openjdk.x86_64 (/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.232.b09-0.el7_7.x86_64/jre/bin/java)

#echo $JAVA_HOME
/apps/dependency/java-se-8u40-ri
#echo $PATH
/apps/dependency/java-se-8u40-ri/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
#which java
/apps/dependency/java-se-8u40-ri/bin/java
#java -version
openjdk version "1.8.0_40"
OpenJDK Runtime Environment (build 1.8.0_40-b25)
OpenJDK 64-Bit Server VM (build 25.40-b25, mixed mode)


```

但是也不对，这个jre版本明显跟我们设置的JAVA_HOME版本不一样

最终找到如何在redhat配置fonts

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/desktop_migration_and_administration_guide/configure-fonts

```
#fc-list : file
/usr/share/X11/fonts/Type1/c0649bt_.pfb:
/usr/share/X11/fonts/Type1/UTRG____.pfa:
/usr/share/X11/fonts/Type1/c0611bt_.pfb:
/usr/share/X11/fonts/Type1/c0419bt_.pfb:
/usr/share/X11/fonts/Type1/UTI_____.pfa:
/usr/share/X11/fonts/Type1/cursor.pfa:
/usr/share/X11/fonts/Type1/c0633bt_.pfb:
/usr/share/X11/fonts/Type1/UTB_____.pfa:
/usr/share/X11/fonts/Type1/c0648bt_.pfb:
/usr/share/X11/fonts/Type1/c0583bt_.pfb:
/usr/share/X11/fonts/Type1/UTBI____.pfa:
/usr/share/X11/fonts/Type1/c0632bt_.pfb:
/usr/share/X11/fonts/Type1/c0582bt_.pfb:

```

上面是在可以工作的机器上看到的结果，有问题的机器上输出是空，所以查了下redhat linux 7 install X11 fonts，发现这个字体叫做

xorg-x11-fonts ，继而搜索 linux install xorg-x11-fonts，得到

```
yum install xorg-x11-fonts-Type1
```