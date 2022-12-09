---
sidebar: auto
sidebarDepth: 4
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

## 编程语言类型

OOP VS FP



## 编程语言术语

Class and Object

Static templates and Objects



Functions/Methods, anonymous Functions/Methods, or lambda expressions.

First-class function https://en.wikipedia.org/wiki/First-class_function



Type safe

Thread safe



## 举例:

### Scala 的 function 类型:

+ Methods

  a method is a function that is a member of an object. It is defined like and works the same as a function. The only difference is that a method has access to all the fields of the object to which it belongs

+ Local functions

  a function defined inside another function or method is called a local function. It has access to the variables and input parameters of the enclosing function. A local function is visible only within the function in which it is defined. This is a useful feature that allows you to group statements within a function without polluting your application's namespace.

+ Higher-Order Methods

  a method that takes a function as an input parameter is called a higher-order method. Similarly, a high-order function is a function that takes another function as input. Higher-order methods and functions help reduce code duplication. In addition, they help you write concise code.

  The following example shows a simple higher-order function

  ```
  def encode(n: Int, f:(Int)=>Long): Long = {
  	val x = n*10
  	f(x)
  }
  The encode function takes two input parameters and returns a Long value. The first input type is an Int. The second input is a function f that takes an Int as input and returns a Long. The body of the encodes function multiplies the first input by 10 and then calls the function that it received as an input.
  ```

  

+ Function Literals

  a function literal is an unnamed or anonymous function in source code. It can be used in an application just like a string literal. It can be passed as an input to a higher-order method or function. It can also be assigned to a variable.

  a function literal is defined with input parameters in parenthesis, followed by a right arrow and the body of the function. The body of a functional literal is enclosed in optional curly braces. An example is shown next.

  ```
  (x: Int) => {
  	x + 100
  }
  In the function body consists of a single statement, the curly braces can be omitted. A concise version of the same function literal is shown next.
  (x: Int) => x + 100
  The higher-order function encode defined earlier can be used with a function literal, as shown next.
  val code = encode(10, (x: Int) => x + 100)
  
  ```

  

+ Closures

  The body of a function literal typically uses only input parameters and local variable defined within the function literal. However, Scala allows a function literal to use a variable from its environment. A closure is a function literal that uses a non-local non-parameter variable captured from its environment. Sometimes people uses the terns function literal and closure interchangeably, but technically, they are not the same. The following code shows an example of a closure.

  ```
  def encodeWithSeed(num: Int, seed: Int): Long = {
  	def encode(x: Int, func: (Int) => Int): Long = {
  		val y = x + 1000
  		func(y)
  	}
  	val result = encode(num, (n: Int) => (n * seed))
  	result
  }
  
  In the preceding code, the local function encode takes a function as its second paramter. The function literal passed to encode uses two variables n and seed. The variable n was passed to it as a parameter; however, seed is not passed as parameter. The function literal passed to the encode function captures the variable seed from its environment and uses it.
  ```

  

### .NET

LINQ, LAMBDA

\###########

委托 （参数，返回=>协变，逆变）

Delegate

Extend=>  Business Delegate pattern VS OO.ProxyPattern

*Well, the idea of the Proxy pattern is that you have an object that stays in front of another object and has the same interface as this object. So, if some operation has to be performed before another operation, you can make use of a proxy, to abstract the caller and simplify its code. For example, we have an object that has a getter method that retrieves a list of Strings, but we have to go to the database to retrieve this list. If there's a proxy, the caller simply invokes this getter method on the proxy object, and the proxy verifies whether the target object already has the list. If not, it goes to the database, retrieves the list, sets it on the target object and returns to the caller. Therefore, the proxy object can execute code before and after the code of the actual targeted object.* 

*The original idea of the Business Delegate was to abstract the presentation layer from knowing how to look EJB objects up. The presentation layer (i.e. a Servlet) would have to know how to retrieve EJB objects that would execute business logic. You could then make use of a Business Delegate, so the Servlet could simply invoke a method on it, which would then retrieve the appropriate EJB object and delegate the execution of the business logic to it, simplifying the code of the presentation layer.* 

*I have to confess that I have worked 95% of the time with Spring, but I believe that the Business Delegate pattern is retired nowadays. And yes, both patterns delegate the execution of things to other objects, but their purpose are different.*

*https://coderanch.com/t/637844/Difference-Proxy-Delegate*

OO.ProxyPattern

http://www.php5dp.com/php-proxy-design-pattern-protect-your-assets/

\##############

Delegate is a very powerful feature available in the .NET Framework

https://www.codeproject.com/Articles/741064/Delegates-its-Modern-Flavors-Func-Action-Predicate

https://stackoverflow.com/questions/4317479/func-vs-action-vs-predicate

https://stackoverflow.com/questions/11009890/delegate-pattern-vs-delegate-keyword-in-c-sharp

http://www.infoworld.com/article/3057152/application-development/how-to-work-with-action-func-and-predicate-delegates-in-c.html

Action<> Func<> general delegate

http://www.c-sharpcorner.com/UploadFile/ff0d0f/action-and-func-delegates-in-C-Sharp-net/

event delegate

http://www.tracefact.net/CSharp-Programming/Delegates-and-Events-in-CSharp.aspx

https://msdn.microsoft.com/en-us/library/orm-9780596516109-03-09.aspx

delegate observer pattern

 

FileSystemWatcher

watcher.Created += (sender, e) =>

CallBackFunction(sender, e);