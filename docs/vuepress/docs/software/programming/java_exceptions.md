捕获到异常时，往往需要进行一些处理。比较简单直接的方式就是打印异常栈轨迹Stack Trace。说起栈轨迹，可能很多人和我一样，第一反应就是printStackTrace()方法。其实除了这个方法，还有一些别的内容也是和栈轨迹有关的。

## Exception & Error

+ 检查性异常：最具代表的检查性异常是用户错误或问题引起的异常，这是程序员无法预见的。例如要打开一个不存在文件时，一个异常就发生了，这些异常在编译时不能被简单地忽略。
+ 运行时异常： 运行时异常是可能被程序员避免的异常。与检查性异常相反，运行时异常可以在编译时被忽略。
+ 错误： 错误不是异常，而是脱离程序员控制的问题。错误在代码中通常被忽略。例如，当栈溢出时，一个错误就发生了，它们在编译也检查不到的。

Throwable
 |
 |
 +---Exception. 
 |    |
 |    |
 |    +--- IOException
 |    |     |
 |    |     + FileNotFoundException
 |    |
 |    +--- RuntimeException 
 |         |
 |         + NullPointerException
 |    
 +---Error
      |  
      + OutOfMemoryError
      |
      |
      + IOError
## StackTrace

1. 异常栈以FILO的顺序打印，位于打印内容最下方的异常最早被抛出，逐渐导致上方异常被抛出。位于打印内容最上方的异常最晚被抛出，且没有再被捕获。从上到下数，第i+1个异常是第i个异常被抛出的原因cause，以“Caused by”开头。
2. 异常栈中每个异常都由异常名+细节信息+路径组成。异常名从行首开始（或紧随”Caused by”），紧接着是细节信息（为增强可读性，需要提供恰当的细节信息），从下一行开始，跳过一个制表符，就是路径中的一个位置，一行一个位置。
3. 路径以FIFO的顺序打印，位于打印内容最上方的位置最早被该异常经过，逐层向外抛出。最早经过的位置即是异常被抛出的位置，逆向debug时可从此处开始；后续位置一般是方法调用的入口，JVM捕获异常时可以从方法栈中得到。对于cause，其可打印的路径截止到被包装进下一个异常之前，之后打印“… X more”，表示cause作为被包装异常，在这之后还逐层向外经过了6个位置，但这些位置与包装异常的路径重复，所以在此处省略，而在包装异常的路径中打印。“… X more”的信息不重要，可以忽略。

```
public class Throwable implements Serializable {
    /**
     * Prints this throwable and its backtrace to the
     * standard error stream. This method prints a stack trace for this
     * {@code Throwable} object on the error output stream that is
     * the value of the field {@code System.err}. The first line of
     * output contains the result of the {@link #toString()} method for
     * this object.  Remaining lines represent data previously recorded by
     * the method {@link #fillInStackTrace()}. The format of this
     * information depends on the implementation, but the following
     * example may be regarded as typical:
     * <blockquote><pre>
     * java.lang.NullPointerException
     *         at MyClass.mash(MyClass.java:9)
     *         at MyClass.crunch(MyClass.java:6)
     *         at MyClass.main(MyClass.java:3)
     * </pre></blockquote>
     * This example was produced by running the program:
     * <pre>
     * class MyClass {
     *     public static void main(String[] args) {
     *         crunch(null);
     *     }
     *     static void crunch(int[] a) {
     *         mash(a);
     *     }
     *     static void mash(int[] b) {
     *         System.out.println(b[0]);
     *     }
     * }
     * </pre>
     * The backtrace for a throwable with an initialized, non-null cause
     * should generally include the backtrace for the cause.  The format
     * of this information depends on the implementation, but the following
     * example may be regarded as typical:
     * <pre>
     * HighLevelException: MidLevelException: LowLevelException
     *         at Junk.a(Junk.java:13)
     *         at Junk.main(Junk.java:4)
     * Caused by: MidLevelException: LowLevelException
     *         at Junk.c(Junk.java:23)
     *         at Junk.b(Junk.java:17)
     *         at Junk.a(Junk.java:11)
     *         ... 1 more
     * Caused by: LowLevelException
     *         at Junk.e(Junk.java:30)
     *         at Junk.d(Junk.java:27)
     *         at Junk.c(Junk.java:21)
     *         ... 3 more
     * </pre>
     * Note the presence of lines containing the characters {@code "..."}.
     * These lines indicate that the remainder of the stack trace for this
     * exception matches the indicated number of frames from the bottom of the
     * stack trace of the exception that was caused by this exception (the
     * "enclosing" exception).  This shorthand can greatly reduce the length
     * of the output in the common case where a wrapped exception is thrown
     * from same method as the "causative exception" is caught.  The above
     * example was produced by running the program:
     * <pre>
     * public class Junk {
     *     public static void main(String args[]) {
     *         try {
     *             a();
     *         } catch(HighLevelException e) {
     *             e.printStackTrace();
     *         }
     *     }
     *     static void a() throws HighLevelException {
     *         try {
     *             b();
     *         } catch(MidLevelException e) {
     *             throw new HighLevelException(e);
     *         }
     *     }
     *     static void b() throws MidLevelException {
     *         c();
     *     }
     *     static void c() throws MidLevelException {
     *         try {
     *             d();
     *         } catch(LowLevelException e) {
     *             throw new MidLevelException(e);
     *         }
     *     }
     *     static void d() throws LowLevelException {
     *        e();
     *     }
     *     static void e() throws LowLevelException {
     *         throw new LowLevelException();
     *     }
     * }
     *
     * class HighLevelException extends Exception {
     *     HighLevelException(Throwable cause) { super(cause); }
     * }
     *
     * class MidLevelException extends Exception {
     *     MidLevelException(Throwable cause)  { super(cause); }
     * }
     *
     * class LowLevelException extends Exception {
     * }
     * </pre>
     * As of release 7, the platform supports the notion of
     * <i>suppressed exceptions</i> (in conjunction with the {@code
     * try}-with-resources statement). Any exceptions that were
     * suppressed in order to deliver an exception are printed out
     * beneath the stack trace.  The format of this information
     * depends on the implementation, but the following example may be
     * regarded as typical:
     *
     * <pre>
     * Exception in thread "main" java.lang.Exception: Something happened
     *  at Foo.bar(Foo.java:10)
     *  at Foo.main(Foo.java:5)
     *  Suppressed: Resource$CloseFailException: Resource ID = 0
     *          at Resource.close(Resource.java:26)
     *          at Foo.bar(Foo.java:9)
     *          ... 1 more
     * </pre>
     * Note that the "... n more" notation is used on suppressed exceptions
     * just at it is used on causes. Unlike causes, suppressed exceptions are
     * indented beyond their "containing exceptions."
     *
     * <p>An exception can have both a cause and one or more suppressed
     * exceptions:
     * <pre>
     * Exception in thread "main" java.lang.Exception: Main block
     *  at Foo3.main(Foo3.java:7)
     *  Suppressed: Resource$CloseFailException: Resource ID = 2
     *          at Resource.close(Resource.java:26)
     *          at Foo3.main(Foo3.java:5)
     *  Suppressed: Resource$CloseFailException: Resource ID = 1
     *          at Resource.close(Resource.java:26)
     *          at Foo3.main(Foo3.java:5)
     * Caused by: java.lang.Exception: I did it
     *  at Foo3.main(Foo3.java:8)
     * </pre>
     * Likewise, a suppressed exception can have a cause:
     * <pre>
     * Exception in thread "main" java.lang.Exception: Main block
     *  at Foo4.main(Foo4.java:6)
     *  Suppressed: Resource2$CloseFailException: Resource ID = 1
     *          at Resource2.close(Resource2.java:20)
     *          at Foo4.main(Foo4.java:5)
     *  Caused by: java.lang.Exception: Rats, you caught me
     *          at Resource2$CloseFailException.&lt;init&gt;(Resource2.java:45)
     *          ... 2 more
     * </pre>
     */
    public void printStackTrace() {
        printStackTrace(System.err);
    }

```

### 如何在异常类中添加成员变量

```
...
    public void printStackTrace() {
        printStackTrace(System.err);
    }
...
    public void printStackTrace(PrintStream s) {
        printStackTrace(new WrappedPrintStream(s));
    }
...
    private void printStackTrace(PrintStreamOrWriter s) {
        // Guard against malicious overrides of Throwable.equals by
        // using a Set with identity equality semantics.
        Set<Throwable> dejaVu =
            Collections.newSetFromMap(new IdentityHashMap<Throwable, Boolean>());
        dejaVu.add(this);
        synchronized (s.lock()) {
            // Print our stack trace
            s.println(this);
            StackTraceElement[] trace = getOurStackTrace();
            for (StackTraceElement traceElement : trace)
                s.println("\tat " + traceElement);
            // Print suppressed exceptions, if any
            for (Throwable se : getSuppressed())
                se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION, "\t", dejaVu);
            // Print cause, if any
            Throwable ourCause = getCause();
            if (ourCause != null)
                ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, "", dejaVu);
        }
    }
...
```
打印异常名和细节信息的代码为：
	
s.println(this);

JVM在运行期通过动态绑定实现this引用上的多态调用。继续追踪的话，最终会调用this实例的toString()方法。所有异常的最低公共祖先类是Throwable类，它提供了默认的toString()实现，大部分常见的异常类都没有覆写这个实现，我们自定义的异常也可以直接继承这个实现：

```
...
    public String toString() {
        String s = getClass().getName();
        String message = getLocalizedMessage();
        return (message != null) ? (s + ": " + message) : s;
    }
...
    public String getLocalizedMessage() {
        return getMessage();
    }
...
    public String getMessage() {
        return detailMessage;
    }
...
```
显然，默认实现的打印格式就是示例的异常信息格式：异常名（全限定名）+细节信息。detailMessage由用户创建异常时设置，因此，如果有自定义的成员变量，我们通常在toString()方法中插入这个变量。参考com.sun.javaws.exceptions包中的BadFieldException，看看它如何插入自定义的成员变量field和value：
```
public String toString() {
  return this.getValue().equals("https")?"BadFieldException[ " + this.getRealMessage() + "]":"BadFieldException[ " + this.getField() + "," + this.getValue() + "]";
}
```
严格的说，BadFieldException的toString中并没有直接插入field成员变量。不过这不影响我们理解，感兴趣的读者可自行翻阅源码。


## printStackTrace()

### 显示调用
首先需要明确，这个方法并不是来自于Exception类。Exception类本身除了定义了几个构造器之外，所有的方法都是从其父类继承过来的。而和异常相关的方法都是从java.lang.Throwable类继承过来的。而printStackTrace()就是其中一个。

这个方法会将Throwable对象的栈轨迹信息打印到标准错误输出流上。输出的大体样子如下：
```
java.lang.NullPointerException
         at MyClass.mash(MyClass.java:9)
         at MyClass.crunch(MyClass.java:6)
         at MyClass.main(MyClass.java:3)
```
输出的第一行是toString()方法的输出，后面几行的内容都是之前通过fillInStackTrace()方法保存的内容。
下面看一个例子：
```
public class TestPrintStackTrace {
    public static void f() throws Exception{
        throw new Exception("出问题啦！");
    }
    public static void g() throws Exception{
        f();
    }
    public static void main(String[] args) {
        try {
            g();
        }catch(Exception e) {
            e.printStackTrace();
        }
    }
}

java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)
    at TestPrintStackTrace.g(TestPrintStackTrace.java:6)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:10)
```

在这个例子中，在方法f()中抛出异常，方法g()中调用方法f()，在main方法中捕获异常，并且打印栈轨迹信息。因此，输出依次展示了f—>g—>main的过程。

### 隐式调用
```
package com.lyhistory.java;


class SelfException extends RuntimeException {
    SelfException() {
    }
    SelfException(String msg) {
        super(msg);
    }
}

public class TestPrintStackTrace {
    public static void main(String[] args) {
        firstMethod();
    }
    public static void firstMethod() {
        secondMethod();
    }
    public static void secondMethod() {
        thirdMethod();
    }
    public static void thirdMethod() {
        throw new SelfException("自定义异常信息");
    }
}
输出：
Exception in thread "main" com.lyhistory.java.SelfException: 自定义异常信息
	at com.lyhistory.java.TestPrintStackTrace.thirdMethod(TestPrintStackTrace.java:23)
	at com.lyhistory.java.TestPrintStackTrace.secondMethod(TestPrintStackTrace.java:20)
	at com.lyhistory.java.TestPrintStackTrace.firstMethod(TestPrintStackTrace.java:17)
	at com.lyhistory.java.TestPrintStackTrace.main(TestPrintStackTrace.java:14)

调用：    
Thread [main] (Suspended)	
	ThreadGroup.uncaughtException(Thread, Throwable) line: 1058	
	ThreadGroup.uncaughtException(Thread, Throwable) line: 1052	
	Thread.dispatchUncaughtException(Throwable) line: 1959	

public void uncaughtException(Thread t, Throwable e) {
        if (parent != null) {
            parent.uncaughtException(t, e);
        } else {
            Thread.UncaughtExceptionHandler ueh =
                Thread.getDefaultUncaughtExceptionHandler();
            if (ueh != null) {
                ueh.uncaughtException(t, e);
            } else if (!(e instanceof ThreadDeath)) {
                System.err.print("Exception in thread \""
                                 + t.getName() + "\" ");
                e.printStackTrace(System.err);
            }
        }
    }
```

```

public class ThreadExceptionTest implements Runnable {
    public void run() {
        firstMethod();
    }
    public void firstMethod() {
        secondMethod();
    }
    public void secondMethod() {
        int a = 5;
        int b = 0;
        int c = a / b;
    }
    public static void main(String[] args) {
        new Thread(new ThreadExceptionTest()).start();
    }
}


Exception in thread "Thread-0" java.lang.ArithmeticException: / by zero
            at Test.ThreadExceptionTest.secondMethod(ThreadExceptionTest.java:14)
            at Test.ThreadExceptionTest.firstMethod(ThreadExceptionTest.java:8)
            at Test.ThreadExceptionTest.run(ThreadExceptionTest.java:4)
            at java.lang.Thread.run(Unknown Source)
```

## 2.getStackTrace()方法
这个方法提供了对printStackTrace()方法所打印信息的编程访问。它会返回一个栈轨迹元素的数组。以上面的输出为例，输出的第2-4行每一行的内容对应一个栈轨迹元素。将这些栈轨迹元素保存在一个数组中。每个元素对应栈的一个栈帧。数组的第一个元素保存的是栈顶元素，也就是上面的f。最后一个元素保存的栈底元素。
```
public class TestPrintStackTrace {
    public static void f() throws Exception{
        throw new Exception("出问题啦！");
    }
    public static void g() throws Exception{
        f();
    }
    public static void main(String[] args) {
        try {
            g();
        }catch(Exception e) {
            e.printStackTrace();
            System.out.println("------------------------------");
            for(StackTraceElement elem : e.getStackTrace()) {
                System.out.println(elem);
            }
        }
    }
}

java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)
    at TestPrintStackTrace.g(TestPrintStackTrace.java:6)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:10)
TestPrintStackTrace.f(TestPrintStackTrace.java:3)
TestPrintStackTrace.g(TestPrintStackTrace.java:6)
TestPrintStackTrace.main(TestPrintStackTrace.java:10)

```
这样的输出和printStackTrace()的输出基本上是一样的

##  3.fillInStackTrace()

要说清楚这个方法，首先要讲一下捕获异常之后重新抛出的问题。在catch代码块中捕获到异常，打印栈轨迹，又重新throw出去。在上一级的方法调用中，再捕获这个异常并且打印出栈轨迹信息。这两个栈轨迹信息会一样吗？我们看一下代码：

```
public class TestPrintStackTrace {
    public static void f() throws Exception{
        throw new Exception("出问题啦！");
    }
    public static void g() throws Exception{
        try {
            f();
        }catch(Exception e) {
            e.printStackTrace();
            throw e;
        }
         
    }
    public static void main(String[] args) {
        try {
            g();
        }catch(Exception e) {
            e.printStackTrace();
        }
    }
}

java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)
    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:16)
java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)
    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:16)
```
在main方法中捕获的异常，是在g()方法中抛出的，按理说这两个打印栈轨迹的信息应该不同，第二次打印的信息应该没有关于f的信息。但是事实上，两次打印栈轨迹信息是一样的。

也就是说，捕获到异常又立即抛出，在上级方法调用中再次捕获这个异常，打印的栈轨迹信息是一样的。原因在于没有将当前线程当前状态下的轨迹栈的状态保存进Throwabe中。现在我们引入fillInStackTrace()方法。这个方法刚好做的就是这样的保存工作。我们看一下这个方法的原型：
public Throwable fillInStackTrace()

这个方法是有返回值的。返回的是保存了当前栈轨迹信息的Throwable对象。我们看看使用fillInStackTrace()方法处理后，打印的栈轨迹信息有什么不同，代码如下：

```
public class TestPrintStackTrace {
    public static void f() throws Exception{
        throw new Exception("出问题啦！");
    }
    public static void g() throws Exception{
        try {
            f();
        }catch(Exception e) {
            e.printStackTrace();
            //不要忘了强制类型转换
            throw (Exception)e.fillInStackTrace();
        }
         
    }
    public static void main(String[] args) {
        try {
            g();
        }catch(Exception e) {
            e.printStackTrace();
        }
    }
}

java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)
    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:17)
java.lang.Exception: 出问题啦！
    at TestPrintStackTrace.g(TestPrintStackTrace.java:11)
    at TestPrintStackTrace.main(TestPrintStackTrace.java:17)
```
我们看到，在main方法中打印栈轨迹已经没有了f相关的信息了

## CAUSED BY

```
package com.msh.demo.exceptionStack;
import java.io.IOException;
/**
 * Created by monkeysayhi on 2017/10/1.
 */
public class Test {
  private void fun1() throws IOException {
    throw new IOException("level 1 exception");
  }
  private void fun2() {
    try {
      fun1();
    } catch (IOException e) {
        throw new RuntimeException("level 2 exception", e);
    }
  }
  public static void main(String[] args) {
    try {
      new Test().fun2();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}

java.lang.RuntimeException: level 2 exception
	at com.msh.demo.exceptionStack.Test.fun2(Test.java:17)
	at com.msh.demo.exceptionStack.Test.main(Test.java:24)
	at sun.reflect.NativeMethodAccessorIm猴子pl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at com.intellij.rt.execution.application.AppMain.main(AppMain.java:147)
Caused by: java.io.IOException: level 1 exception
	at com.msh.demo.exceptionStack.Test.fun1(Test.java:10)
	at com.msh.demo.exceptionStack.Test.fun2(Test.java:15)
	... 6 more
```

根据上述异常信息，异常抛出过程中的事件顺序是：

    在Test.java的第10行，抛出了一个IOExceotion(“level 1 exception”) e1
    异常e1被逐层向外抛出，直到在Test.java的第15行被捕获
    在Test.java的第17行，根据捕获的异常e1，抛出了一个RuntimeException(“level 2 exception”， e1) e2
    异常e2被逐层向外抛出，直到在Test.java的第24行被捕获
    后续没有其他异常信息，经过必要的框架后，由程序自动或用户主动调用了e2.printStackTrace()方法



## 线程栈分析
程堆栈也称线程调用堆栈，是虚拟机中线程（包括锁）状态的一个瞬间状态的快照，即系统在某一个时刻所有线程的运行状态，包括每一个线程的调用堆栈，锁的持有情况。虽然不同的虚拟机打印出来的格式有些不同，但是线程堆栈的信息都包含：

1、线程名字，id，线程的数量等。

2、线程的运行状态，锁的状态（锁被哪个线程持有，哪个线程在等待锁等）

3、调用堆栈（即函数的调用层次关系）调用堆栈包含完整的类名，所执行的方法，源代码的行数。


Jstack是常用的排查工具，它能输出在某一个时间，Java进程中所有线程的状态，很多时候这些状态信息能给我们的排查工作带来有用的线索。 Jstack的输出中，Java线程状态主要是以下几种：

1、BLOCKED 线程在等待monitor锁(synchronized关键字)

2、TIMED_WAITING 线程在等待唤醒，但设置了时限

3、WAITING 线程在无限等待唤醒

4、RUNNABLE 线程运行中或I/O等待


## TROUBLESHOOT

### 编译通过但是运行时找不到方法
刚开始是页面上批量更改计划任务调整时间，但是报错，而数据库是成功刷新的，所以怀疑是内存状态有问题
```
jcmd <pid> GC.class_histogram | findstr JobTaskDto，看 com.lyhistory.test.job.dto.JobTaskDto 的实例数，和 t_job_task 里"窗口内"的行数对比；差得离谱就说明 map 少装了很多（JDK17 支持）。

heap dump + MAT/VisualVM（jcmd <pid> GC.heap_dump D:\dump.hprof，在 MAT 里查 JobStorageServiceImpl.taskInstanceMap）。arthas 其实在 OpenJDK 17 上也能跑（java -jar arthas-boot.jar），只是要能拿到 jar。
```
但是往前查看日志发现前面有个地方已经出错了
```
java.lang.NoSuchMethodError: 'boolean com.google.common.base.Platform.stringIsNullOrEmpty(java.lang.String)'
	at com.google.common.base.Strings.isNullOrEmpty(Strings.java:68)
```

猜测：
然后想到该springboot项目从2.4.5 升级到springboot3.5.7，jdk从openjdk8升级到JDK17 , kafka3.8.0

Strings.isNullOrEmpty 内部去调 com.google.common.base.Platform.stringIsNullOrEmpty，而这个方法在当前运行时的 Platform 类里不存在 → 说明 classpath 上有两个不一致的 guava（Strings 来自一个版本、Platform 来自另一个），或者某个 shaded/被裁剪的 guava 混进来了

调查：
```
jcmd 2346965 VM.command_line                                     
jcmd 2346965 VM.system_properties | grep -i "class.path" 

jcmd 2346965 VM.command_line
2346965:
VM Arguments:
jvm_args: -Dlog4j2.formatMsgNoLookups=true --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.lang.invoke=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED -Dfastjson2.parser.autoTypeSupport=true
java_command: ./current/test-job-engine.jar
java_class_path (initial): ./current/test-job-engine.jar
Launcher Type: SUN_STANDARD

JARBIN=$(dirname "$(readlink -f "$(command -v java)")")/jar
# 扫描 fat jar 内部的所有内嵌 jar（Spring Boot 解压后的缓存目录或直接从 jar 里读）
# 如果应用正在运行，Spring Boot 会把它解压到 /tmp 或工作目录，但最简单的是直接扫描 jar 本身
mkdir -p /tmp/jar_scan
cd /tmp/jar_scan
jar tf /path/to/test-job-engine.jar | grep '\.jar$' > jar_list.txt
while read j; do
  jar xf /path/to/test-job-engine.jar "$j" 2>/dev/null
done < jar_list.txt

# 现在扫描所有解压出来的 jar
for j in BOOT-INF/lib/*.jar; do
  if "$JARBIN" tf "$j" 2>/dev/null | grep -q '^com/google/common/base/Platform.class$'; then
    echo "FOUND Platform.class in: $j"
    "$JARBIN" tf "$j" 2>/dev/null | grep -c '^com/google/common/base/Strings.class$' | xargs -I {} echo "  hasStrings: {}"
  fi
done

FOUND Platform.class in: BOOT-INF/lib/google-collections-1.0-rc2.jar
  hasStrings: 0
FOUND Platform.class in: BOOT-INF/lib/guava-27.0-jre.jar
  hasStrings: 1


新包:
unzip -Z1 test-job-engine.jar | grep -nE '^BOOT-INF/lib/(guava|google-collections)'
237:BOOT-INF/lib/google-collections-1.0-rc2.jar
292:BOOT-INF/lib/guava-27.0-jre.jar

老包:
$ unzip -Z1 test-job-engine.jar |grep -nE '^BOOT-INF/lib/(guava|google-collections)'
186:BOOT-INF/lib/google-collections-1.0-rc2.jar
207:BOOT-INF/lib/guava-16.0.1.jar

新包:
mvn -pl test-job-engine -am dependency:tree -Dincludes=com.google.guava:guava -Dverbose
[INFO] --- dependency:3.8.1:tree (default-cli) @ test-job-engine ---
[INFO] com.lyhistory.test:test-job-engine:jar:2.0.0-SNAPSHOT
[INFO] \- com.lyhistory.test:test-job:jar:2.0.0-SNAPSHOT:compile
[INFO]    +- org.apache.curator:curator-recipes:jar:5.9.0:compile (version managed from 5.9.0)
[INFO]    |  \- org.apache.curator:curator-framework:jar:5.9.0:compile (version managed from 5.9.0)
[INFO]    |     \- org.apache.curator:curator-client:jar:5.9.0:compile (version managed from 5.9.0)
[INFO]    |        \- (com.google.guava:guava:jar:32.0.0-jre:compile - omitted for conflict with 27.0-jre)
[INFO]    \- com.alipay.sofa.common:sofa-common-tools:jar:2.1.1:compile (version managed from 2.1.1)
[INFO]       \- com.google.guava:guava:jar:27.0-jre:compile

mvn -pl test-job-engine -am dependency:tree -Dincludes=com.google.collections -Dverbose
[INFO] --- dependency:3.8.1:tree (default-cli) @ test-job-engine ---
[INFO] com.lyhistory.test:test-job-engine:jar:2.0.0-SNAPSHOT
[INFO] \- com.lyhistory.test:test-core:jar:2.0.0-SNAPSHOT:compile
[INFO]    \- com.google.collections:google-collections:jar:1.0-rc2:compile (version managed from 1.0-rc2)

老包:
mvn -pl test-job-engine -am dependency:tree -Dincludes=com.google.guava:guava -Dverbose
[INFO] --- dependency:3.1.2:tree (default-cli) @ test-job-engine ---
[INFO] Verbose not supported since maven-dependency-plugin 3.0
[INFO] com.lyhistory.test:test-job-engine:jar:1.4.0-SNAPSHOT
[INFO] \- com.lyhistory.test:test-job:jar:1.4.0-SNAPSHOT:compile
[INFO]    \- org.apache.curator:curator-recipes:jar:2.12.0:compile
[INFO]       \- org.apache.curator:curator-framework:jar:2.12.0:compile
[INFO]          \- org.apache.curator:curator-client:jar:2.12.0:compile
[INFO]             \- com.google.guava:guava:jar:16.0.1:compile

mvn -pl test-job-engine -am dependency:tree -Dincludes=com.google.collections -Dverbose
[INFO] --- dependency:3.1.2:tree (default-cli) @ test-job-engine ---
[INFO] Verbose not supported since maven-dependency-plugin 3.0
[INFO] com.lyhistory.test:test-job-engine:jar:1.4.0-SNAPSHOT
[INFO] \- com.lyhistory.test:test-core:jar:1.4.0-SNAPSHOT:compile
[INFO]    \- com.google.collections:google-collections:jar:1.0-rc2:compile
```
分析：

```
import com.google.common.base.Strings;
// ...
Strings.isNullOrEmpty(ret);
```
javac 编译这段代码时，需要做的事：

1. 在 classpath 上找 com/google/common/base/Strings.class（或源码）。

2. 检查 Strings 类里有没有 isNullOrEmpty(String) 这个方法（看方法签名）。

3. 只要这个方法存在，编译就通过，生成一条 invokestatic 指令，指向 Strings.isNullOrEmpty。

关键点：javac 完全不会去检查 Strings.isNullOrEmpty 方法内部是怎么实现的，也不会去加载或检查 Platform 类。因为 Platform 是 Strings 类的内部实现细节，不是你代码里直接引用的。

classpath 扫描过程（编译时）

classpath 上有两个相关 jar：google-collections-1.0-rc2.jar 和 guava-xx.jar。

javac 要找 Strings 类，它按顺序扫 classpath（顺序是 google-collections 在前）：
先在 google-collections 里找 com/google/common/base/Strings.class → 没有（这个 jar 只有 Platform）。
继续往下，在 guava jar 里找到了 Strings.class → 有 isNullOrEmpty 方法​ → 编译通过。
Platform 类呢？​ javac 根本没去加载它，因为你的代码里没有直接写 Platform.xxx，javac 不需要知道 Platform 存不存在、里面有什么方法。

所以编译时：

Strings 类来自 guava（有方法）✅
Platform 类完全没被用到​ ✅
编译顺利通过，跟 google-collections 里的 Platform 毫无关系。

运行时：JVM 需要加载 Platform，而且加载的是 google-collections 里的

运行时，当你的代码第一次执行到 Strings.isNullOrEmpty(ret) 时，JVM 实际做的事情：

1. 加载 Strings 类：JVM 需要 com.google.common.base.Strings。类加载器按 BOOT-INF/lib/ 的文件名顺序扫描：
    - google-collections 里没有 Strings → 跳过。
    - guava 里有 Strings → 加载它（来自 guava）。
2. 执行 Strings.isNullOrEmpty 的字节码：这个方法内部会调用 Platform.stringIsNullOrEmpty（guava 27 的实现）。
3. 此时 JVM 才需要加载 Platform 类：因为要调用它的方法。
4. 类加载器再次按文件名顺序扫描 BOOT-INF/lib/：
    第一个包含 com/google/common/base/Platform.class 的 jar 是 google-collections-1.0-rc2.jar（因为它字母序在 guava 前面）→ 加载这个 Platform 类。
5. JVM 在已加载的 Platform 类里找 stringIsNullOrEmpty 方法 → 没找到（google-collections 的 Platform 是远古版本，没有这个方法）→ 抛出 NoSuchMethodError。

注意：这里 Strings 类确实是从 guava 加载的（跟编译时一样），但 Platform 类是从 google-collections 加载的（因为 google-collections 里也有 Platform，而且排在前面）。这就是冲突的根源：同一个包 com.google.common.base 下的两个类，分别来自两个不同的 jar。

疑问：为啥执行guava的 Platform.stringIsNullOrEmpty不直接调用guava自己的Platform方法，而是再次扫描，guava里面不应该也有import 自己的这个类吗？

JVM 的类加载器不是“从同一个 jar 里找配套类”，而是“拿着全类名去全局 classpath 里按顺序找，找到谁就是谁”。比如：
在 Strings.java 源码里看到：
```
package com.google.common.base;
import com.google.common.base.Platform; // 这个 import
```
这个 import 的作用仅仅是告诉 编译器：“下面我写 Platform 的时候，你帮我展开成 com.google.common.base.Platform”。它只是一个编译期语法糖，让你可以少写包名。

到了运行时，字节码里根本没有 import 这个概念。编译后的 Strings.class 文件里，对 Platform 的引用已经变成了完整的全限定名 com.google.common.base.Platform。JVM 执行时，只认这个全限定名，完全不知道、也不关心 Strings 和 Platform 在源码里是不是同一个包、是不是同一个 jar。
当 Strings.isNullOrEmpty() 执行到需要调用 Platform.stringIsNullOrEmpty() 时，JVM 需要做的是：加载 com.google.common.base.Platform 这个类。

它怎么加载？委托给当前类的类加载器（你的 Spring Boot 应用里，是 LaunchedURLClassLoader）。这个加载器内部维护了一个 URL 列表（就是 BOOT-INF/lib/ 下所有 jar 的地址），然后做一件事：

拿着 com/google/common/base/Platform.class 这个路径，按 URL 列表的顺序，逐个 jar 去查，找到第一个匹配的类文件，就加载它。

它不会说：“哦，Strings 是从 guava-27.0-jre.jar 里加载的，那 Platform 也应该去这个 jar 里找。”

它也不会说：“这两个类包名一样，应该在一起。”

它更不会说：“同一个 jar 里的类应该优先互相引用。”

类加载器完全没有这种“就近原则”或“同源原则”。它的逻辑就是：全局扫描，先到先得。

因为 JVM 在加载 Platform 的时候，根本不知道 Strings 是从 guava 来的。对类加载器来说，所有 jar 都是平等的，它只认类名。即使 Strings 和 Platform 在同一个 guava jar 里，类加载器也不会建立这种“关联关系”。

这就像你去图书馆借书：

你先借了《Strings 的故事》（这本书是从 A 书架拿的）。
然后你需要《Platform 的秘籍》，你告诉图书管理员“我要借《Platform 的秘籍》”。
管理员按书架编号从 1 号开始找，在 1 号书架上发现了这本书（虽然是盗版/旧版），就直接借给你了。
他不会说：“哦，你之前那本《Strings 的故事》是从 3 号书架拿的，那这本也应该去 3 号书架找。”——因为图书系统里，书是按书名检索的，不是按你之前借的书的位置。

修复：
```
方法一：
最直接就是不用google的这个Strings.isNullOrEmpty 改成!StringUtils.hasLength

方法二：
删掉 <dependency>com.google.collections:google-collections</dependency>

方法三：
声明保留，加 <scope>provided</scope> —— 编译时还在、打包时不进 BOOT-INF/lib

方法四：
可以直接从 fat jar 里摘掉那个嵌套 jar（fat jar 就是个 zip）：
cp test-job-engine.jar test-job-engine.jar.bak
zip -d test-job-engine.jar 'BOOT-INF/lib/google-collections-1.0-rc2.jar'
unzip -p test-job-engine.jar BOOT-INF/classpath.idx | grep -n google-collections   # 见下


```

### 为什么有时我在日志中只看到异常名”java.lang.NullPointerException”，却没有异常栈

示例的异常信息中，异常名、细节信息、路径三个元素都有，但是，由于JVM的优化，细节信息和路径可能会被省略。

这经常发生于服务器应用的日志中，由于相同异常已被打印多次，如果继续打印相同异常，JVM会省略掉细节信息和路径队列，向前翻阅即可找到完整的异常信息。

