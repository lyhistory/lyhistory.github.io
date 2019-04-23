---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: Mobile development strategy
---

# 1.Web
Websites are open, no need to install, and the websites are easy to deploy and update compared to native app, no need wait for app store approval and updating always on server side.

HTML5 is growing more robust and feature-rich, now with html5 device API, we are able to get access and control hardware like sensors/camera/battery. It enables web app to do most of the things that a native app can do.

Web applications are relatively easy to move to other platforms, although there will be some compatibility issues for different devices, but it’s much easier than translating a native app from swift to java

Web applications have gotten a bad reputation – sometimes slow, and websites always rely on network connectivity, and for game players, experience using mobile web may not as smooth as native apps.

HTML5 compatibility on mobile and tablet browsers with testing on real devices

**Framework:**
HTML5 powered framework like JQuery mobile/Sencha, etc

Bootstrap –HTML/CSS/JS toolkit, mobile first front end framework for responsible layout;

jquery mobile

it gives a lot of mobile-oriented features like swipe-events, page transitions, allows for single/multipage applications, AJAX page preload, and history manipulation API, and lots of touch-friendly components/widgets, because everything is done through HTML5 markup, jQuery Mobile application still needs to process that markup in the background during the application real-time execution, and JavaScript is a workhorse, in that case. This combined with mobile browsers will result in below-average performances

http://mobilehtml5.org/

sample: http://www.girliemac.com/presentation-slides/html5-mobile-approach/deviceAPIs.html

https://developer.mozilla.org/en/docs/Web/Guide/Mobile


# 2.Native
1.andoird

JIT JVM machine code, android runtime on linux os

https://www.quora.com/Why-is-ART-better-than-Dalvik

just-in-time compile java code to byte code or machine instruction code, which will later running on vm.

http://www.zdnet.com/article/how-android-works-the-big-picture/

2.ios
# 3.Hybrid:
Basically there are two types of hybrid frameworks:

Frameworks like phonegap/cordova use web view, wraps application in a browser with no url bar, developer then builds the application as a web site, but it is packaged and looks like a native app on the device with limited native API access, because mobile browser is sandboxed from native APIs to ensure battery performance and device security.

Another type of hybrid frameworks claims they are ‘truly native’ frameworks: react native/native script/xmaria, these frameworks are the huge improvements from the Phonegap/Cordova

## 1.webview
Phonegap client communicates with an application server to receive data using standard web protocols. Phonegap acts as a client for the user to interact with, the application server is normally a web server which performs business logic and calculations, and generally retrieves or persists data from a separate data repository.
## 2.truly native
Xamarin

is a runtime for building cross-platform mobile applications using c# and the .NET framework, the .NET framework is not supported on either IOS or Android, Xamarin provides a close approximation of the .NET framework for these platforms via an open source port of .NET called Mono.

native script:

 https://www.npmjs.com/package/nativescript#installation

https://www.thepolyglotdeveloper.com/2016/04/my-experience-developing-with-telerik-nativescript/


NativeScript simply executes JavaScript on the underlying native operating system.
![](/content/images/post/20190101/mobiledev1.png)
![](/content/images/post/20190101/mobiledev2.png)

NativeScript is following the classic approach like Android. Running JavaScript on the UI thread allows NativeScript to deliver on one of its core guiding principles: provide high-performance access to 100% of native platform APIs through JavaScript. Period. No trade-offs. No limits.

java script packaged by native script CLI(npm) to Java code/object-c, and finally compiled to byte code
https://www.nativescript.org/blog/nativescript-and-xamarin
Build Process

Both NativeScript and Xamarin support building Android applications on Windows. They also both support building directly to iOS on a Mac. Due to the fact that Apple has restricted the building of iOS applications to a macOS machine, neither NativeScript nor Xamarin can build iOS apps directly on Windows. However, there are solutions provided by both frameworks for this issue.

While iOS apps can be coded with Xamarin on a Windows machine, Xamarin requires ssh access to a macOS machine in order to do the actual build for iOS. There is no way around this. With Xamarin, the developer must have access to a Mac to build iOS binaries.

In the case of NativeScript, the AppBuilder extension from Telerik provides a cloud build service that does not require the developer to own a Mac. This is essentially a networked Mac that we own and provide to developers as a service. The developer then builds on the Windows machine, the code is compiled on our servers and sent back to you in IPA format, ready to be installed on iOS.

NativeScript also provides companion applications that can be downloaded from the iOS and Android app stores. These companion apps allow developers to load their applications on their devices without actually installing them. This is very helpful during the development process.

Mobile web views are slow, and worse, they behave differently on different platforms and platform versions.  It is difficult to get consistency when using them and results in inconsistent experiences for the users of your applications.

NativeScript instead maps the XML layouts and styles at build time to their native counterparts leaving you with a 100% native mobile application.  There are not inconsistencies in performance when it comes to native layouts and code.  Sure there may be differences in appearance, but that is normal between platform versions.

React Native

is using the Virtual DOM for updating the UI like React. React Native will calculate the changes in the background thread and keep the UI thread untouched if there is no change. So, UI will be very responsive. But, If the component makes a lot of calls to the native OS, then the app will be slow.

https://www.infoq.com/articles/react-native-introduction
##################################################

web vs native:

http://www.html5rocks.com/en/mobile/nativedebate/


http://stackoverflow.com/questions/95635/what-does-a-just-in-time-jit-compiler-do

A JIT compiler runs after the program has started and compiles the code (usually bytecode or some kind of VM instructions) on the fly (or just-in-time, as it's called) into a form that's usually faster, typically the host CPU's native instruction set. A JIT has access to dynamic runtime information whereas a standard compiler doesn't and can make better optimizations like inlining functions that are used frequently.

This is in contrast to a traditional compiler that compiles all the code to machine language before the program is first run.

To paraphrase, conventional compilers build the whole program as an EXE file BEFORE the first time you run it. For newer style programs, an assembly is generated with pseudocode (p-code). Only AFTER you execute the program on the OS (e.g., by double-clicking on its icon) will the (JIT) compiler kick in and generate machine code (m-code) that the Intel-based processor or whatever will understand.


http://www.infoworld.com/article/2621943/mobile-development/13-essential-programming-tools-for-the-mobile-web.html