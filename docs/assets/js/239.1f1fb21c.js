(window.webpackJsonp=window.webpackJsonp||[]).push([[239],{689:function(e,t,a){"use strict";a.r(t);var n=a(65),c=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[e._v("捕获到异常时，往往需要进行一些处理。比较简单直接的方式就是打印异常栈轨迹Stack Trace。说起栈轨迹，可能很多人和我一样，第一反应就是printStackTrace()方法。其实除了这个方法，还有一些别的内容也是和栈轨迹有关的。")]),e._v(" "),a("h2",{attrs:{id:"exception-error"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#exception-error"}},[e._v("#")]),e._v(" Exception & Error")]),e._v(" "),a("ul",[a("li",[e._v("检查性异常：最具代表的检查性异常是用户错误或问题引起的异常，这是程序员无法预见的。例如要打开一个不存在文件时，一个异常就发生了，这些异常在编译时不能被简单地忽略。")]),e._v(" "),a("li",[e._v("运行时异常： 运行时异常是可能被程序员避免的异常。与检查性异常相反，运行时异常可以在编译时被忽略。")]),e._v(" "),a("li",[e._v("错误： 错误不是异常，而是脱离程序员控制的问题。错误在代码中通常被忽略。例如，当栈溢出时，一个错误就发生了，它们在编译也检查不到的。")])]),e._v(" "),a("p",[e._v("Throwable\n|\n|\n+---Exception.\n|    |\n|    |\n|    +--- IOException\n|    |     |\n|    |     + FileNotFoundException\n|    |\n|    +--- RuntimeException\n|         |\n|         + NullPointerException\n|"),a("br"),e._v("\n+---Error\n|"),a("br"),e._v("\n+ OutOfMemoryError\n|\n|\n+ IOError")]),e._v(" "),a("h2",{attrs:{id:"stacktrace"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#stacktrace"}},[e._v("#")]),e._v(" StackTrace")]),e._v(" "),a("ol",[a("li",[e._v("异常栈以FILO的顺序打印，位于打印内容最下方的异常最早被抛出，逐渐导致上方异常被抛出。位于打印内容最上方的异常最晚被抛出，且没有再被捕获。从上到下数，第i+1个异常是第i个异常被抛出的原因cause，以“Caused by”开头。")]),e._v(" "),a("li",[e._v("异常栈中每个异常都由异常名+细节信息+路径组成。异常名从行首开始（或紧随”Caused by”），紧接着是细节信息（为增强可读性，需要提供恰当的细节信息），从下一行开始，跳过一个制表符，就是路径中的一个位置，一行一个位置。")]),e._v(" "),a("li",[e._v("路径以FIFO的顺序打印，位于打印内容最上方的位置最早被该异常经过，逐层向外抛出。最早经过的位置即是异常被抛出的位置，逆向debug时可从此处开始；后续位置一般是方法调用的入口，JVM捕获异常时可以从方法栈中得到。对于cause，其可打印的路径截止到被包装进下一个异常之前，之后打印“… X more”，表示cause作为被包装异常，在这之后还逐层向外经过了6个位置，但这些位置与包装异常的路径重复，所以在此处省略，而在包装异常的路径中打印。“… X more”的信息不重要，可以忽略。")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public class Throwable implements Serializable {\n    /**\n     * Prints this throwable and its backtrace to the\n     * standard error stream. This method prints a stack trace for this\n     * {@code Throwable} object on the error output stream that is\n     * the value of the field {@code System.err}. The first line of\n     * output contains the result of the {@link #toString()} method for\n     * this object.  Remaining lines represent data previously recorded by\n     * the method {@link #fillInStackTrace()}. The format of this\n     * information depends on the implementation, but the following\n     * example may be regarded as typical:\n     * <blockquote><pre>\n     * java.lang.NullPointerException\n     *         at MyClass.mash(MyClass.java:9)\n     *         at MyClass.crunch(MyClass.java:6)\n     *         at MyClass.main(MyClass.java:3)\n     * </pre></blockquote>\n     * This example was produced by running the program:\n     * <pre>\n     * class MyClass {\n     *     public static void main(String[] args) {\n     *         crunch(null);\n     *     }\n     *     static void crunch(int[] a) {\n     *         mash(a);\n     *     }\n     *     static void mash(int[] b) {\n     *         System.out.println(b[0]);\n     *     }\n     * }\n     * </pre>\n     * The backtrace for a throwable with an initialized, non-null cause\n     * should generally include the backtrace for the cause.  The format\n     * of this information depends on the implementation, but the following\n     * example may be regarded as typical:\n     * <pre>\n     * HighLevelException: MidLevelException: LowLevelException\n     *         at Junk.a(Junk.java:13)\n     *         at Junk.main(Junk.java:4)\n     * Caused by: MidLevelException: LowLevelException\n     *         at Junk.c(Junk.java:23)\n     *         at Junk.b(Junk.java:17)\n     *         at Junk.a(Junk.java:11)\n     *         ... 1 more\n     * Caused by: LowLevelException\n     *         at Junk.e(Junk.java:30)\n     *         at Junk.d(Junk.java:27)\n     *         at Junk.c(Junk.java:21)\n     *         ... 3 more\n     * </pre>\n     * Note the presence of lines containing the characters {@code "..."}.\n     * These lines indicate that the remainder of the stack trace for this\n     * exception matches the indicated number of frames from the bottom of the\n     * stack trace of the exception that was caused by this exception (the\n     * "enclosing" exception).  This shorthand can greatly reduce the length\n     * of the output in the common case where a wrapped exception is thrown\n     * from same method as the "causative exception" is caught.  The above\n     * example was produced by running the program:\n     * <pre>\n     * public class Junk {\n     *     public static void main(String args[]) {\n     *         try {\n     *             a();\n     *         } catch(HighLevelException e) {\n     *             e.printStackTrace();\n     *         }\n     *     }\n     *     static void a() throws HighLevelException {\n     *         try {\n     *             b();\n     *         } catch(MidLevelException e) {\n     *             throw new HighLevelException(e);\n     *         }\n     *     }\n     *     static void b() throws MidLevelException {\n     *         c();\n     *     }\n     *     static void c() throws MidLevelException {\n     *         try {\n     *             d();\n     *         } catch(LowLevelException e) {\n     *             throw new MidLevelException(e);\n     *         }\n     *     }\n     *     static void d() throws LowLevelException {\n     *        e();\n     *     }\n     *     static void e() throws LowLevelException {\n     *         throw new LowLevelException();\n     *     }\n     * }\n     *\n     * class HighLevelException extends Exception {\n     *     HighLevelException(Throwable cause) { super(cause); }\n     * }\n     *\n     * class MidLevelException extends Exception {\n     *     MidLevelException(Throwable cause)  { super(cause); }\n     * }\n     *\n     * class LowLevelException extends Exception {\n     * }\n     * </pre>\n     * As of release 7, the platform supports the notion of\n     * <i>suppressed exceptions</i> (in conjunction with the {@code\n     * try}-with-resources statement). Any exceptions that were\n     * suppressed in order to deliver an exception are printed out\n     * beneath the stack trace.  The format of this information\n     * depends on the implementation, but the following example may be\n     * regarded as typical:\n     *\n     * <pre>\n     * Exception in thread "main" java.lang.Exception: Something happened\n     *  at Foo.bar(Foo.java:10)\n     *  at Foo.main(Foo.java:5)\n     *  Suppressed: Resource$CloseFailException: Resource ID = 0\n     *          at Resource.close(Resource.java:26)\n     *          at Foo.bar(Foo.java:9)\n     *          ... 1 more\n     * </pre>\n     * Note that the "... n more" notation is used on suppressed exceptions\n     * just at it is used on causes. Unlike causes, suppressed exceptions are\n     * indented beyond their "containing exceptions."\n     *\n     * <p>An exception can have both a cause and one or more suppressed\n     * exceptions:\n     * <pre>\n     * Exception in thread "main" java.lang.Exception: Main block\n     *  at Foo3.main(Foo3.java:7)\n     *  Suppressed: Resource$CloseFailException: Resource ID = 2\n     *          at Resource.close(Resource.java:26)\n     *          at Foo3.main(Foo3.java:5)\n     *  Suppressed: Resource$CloseFailException: Resource ID = 1\n     *          at Resource.close(Resource.java:26)\n     *          at Foo3.main(Foo3.java:5)\n     * Caused by: java.lang.Exception: I did it\n     *  at Foo3.main(Foo3.java:8)\n     * </pre>\n     * Likewise, a suppressed exception can have a cause:\n     * <pre>\n     * Exception in thread "main" java.lang.Exception: Main block\n     *  at Foo4.main(Foo4.java:6)\n     *  Suppressed: Resource2$CloseFailException: Resource ID = 1\n     *          at Resource2.close(Resource2.java:20)\n     *          at Foo4.main(Foo4.java:5)\n     *  Caused by: java.lang.Exception: Rats, you caught me\n     *          at Resource2$CloseFailException.&lt;init&gt;(Resource2.java:45)\n     *          ... 2 more\n     * </pre>\n     */\n    public void printStackTrace() {\n        printStackTrace(System.err);\n    }\n\n')])])]),a("h3",{attrs:{id:"如何在异常类中添加成员变量"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#如何在异常类中添加成员变量"}},[e._v("#")]),e._v(" 如何在异常类中添加成员变量")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('...\n    public void printStackTrace() {\n        printStackTrace(System.err);\n    }\n...\n    public void printStackTrace(PrintStream s) {\n        printStackTrace(new WrappedPrintStream(s));\n    }\n...\n    private void printStackTrace(PrintStreamOrWriter s) {\n        // Guard against malicious overrides of Throwable.equals by\n        // using a Set with identity equality semantics.\n        Set<Throwable> dejaVu =\n            Collections.newSetFromMap(new IdentityHashMap<Throwable, Boolean>());\n        dejaVu.add(this);\n        synchronized (s.lock()) {\n            // Print our stack trace\n            s.println(this);\n            StackTraceElement[] trace = getOurStackTrace();\n            for (StackTraceElement traceElement : trace)\n                s.println("\\tat " + traceElement);\n            // Print suppressed exceptions, if any\n            for (Throwable se : getSuppressed())\n                se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION, "\\t", dejaVu);\n            // Print cause, if any\n            Throwable ourCause = getCause();\n            if (ourCause != null)\n                ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, "", dejaVu);\n        }\n    }\n...\n')])])]),a("p",[e._v("打印异常名和细节信息的代码为：")]),e._v(" "),a("p",[e._v("s.println(this);")]),e._v(" "),a("p",[e._v("JVM在运行期通过动态绑定实现this引用上的多态调用。继续追踪的话，最终会调用this实例的toString()方法。所有异常的最低公共祖先类是Throwable类，它提供了默认的toString()实现，大部分常见的异常类都没有覆写这个实现，我们自定义的异常也可以直接继承这个实现：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('...\n    public String toString() {\n        String s = getClass().getName();\n        String message = getLocalizedMessage();\n        return (message != null) ? (s + ": " + message) : s;\n    }\n...\n    public String getLocalizedMessage() {\n        return getMessage();\n    }\n...\n    public String getMessage() {\n        return detailMessage;\n    }\n...\n')])])]),a("p",[e._v("显然，默认实现的打印格式就是示例的异常信息格式：异常名（全限定名）+细节信息。detailMessage由用户创建异常时设置，因此，如果有自定义的成员变量，我们通常在toString()方法中插入这个变量。参考com.sun.javaws.exceptions包中的BadFieldException，看看它如何插入自定义的成员变量field和value：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public String toString() {\n  return this.getValue().equals("https")?"BadFieldException[ " + this.getRealMessage() + "]":"BadFieldException[ " + this.getField() + "," + this.getValue() + "]";\n}\n')])])]),a("p",[e._v("严格的说，BadFieldException的toString中并没有直接插入field成员变量。不过这不影响我们理解，感兴趣的读者可自行翻阅源码。")]),e._v(" "),a("h2",{attrs:{id:"printstacktrace"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#printstacktrace"}},[e._v("#")]),e._v(" printStackTrace()")]),e._v(" "),a("h3",{attrs:{id:"显示调用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#显示调用"}},[e._v("#")]),e._v(" 显示调用")]),e._v(" "),a("p",[e._v("首先需要明确，这个方法并不是来自于Exception类。Exception类本身除了定义了几个构造器之外，所有的方法都是从其父类继承过来的。而和异常相关的方法都是从java.lang.Throwable类继承过来的。而printStackTrace()就是其中一个。")]),e._v(" "),a("p",[e._v("这个方法会将Throwable对象的栈轨迹信息打印到标准错误输出流上。输出的大体样子如下：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("java.lang.NullPointerException\n         at MyClass.mash(MyClass.java:9)\n         at MyClass.crunch(MyClass.java:6)\n         at MyClass.main(MyClass.java:3)\n")])])]),a("p",[e._v("输出的第一行是toString()方法的输出，后面几行的内容都是之前通过fillInStackTrace()方法保存的内容。\n下面看一个例子：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public class TestPrintStackTrace {\n    public static void f() throws Exception{\n        throw new Exception("出问题啦！");\n    }\n    public static void g() throws Exception{\n        f();\n    }\n    public static void main(String[] args) {\n        try {\n            g();\n        }catch(Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:6)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:10)\n')])])]),a("p",[e._v("在这个例子中，在方法f()中抛出异常，方法g()中调用方法f()，在main方法中捕获异常，并且打印栈轨迹信息。因此，输出依次展示了f—>g—>main的过程。")]),e._v(" "),a("h3",{attrs:{id:"隐式调用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#隐式调用"}},[e._v("#")]),e._v(" 隐式调用")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('package com.lyhistory.java;\n\n\nclass SelfException extends RuntimeException {\n    SelfException() {\n    }\n    SelfException(String msg) {\n        super(msg);\n    }\n}\n\npublic class TestPrintStackTrace {\n    public static void main(String[] args) {\n        firstMethod();\n    }\n    public static void firstMethod() {\n        secondMethod();\n    }\n    public static void secondMethod() {\n        thirdMethod();\n    }\n    public static void thirdMethod() {\n        throw new SelfException("自定义异常信息");\n    }\n}\n输出：\nException in thread "main" com.lyhistory.java.SelfException: 自定义异常信息\n\tat com.lyhistory.java.TestPrintStackTrace.thirdMethod(TestPrintStackTrace.java:23)\n\tat com.lyhistory.java.TestPrintStackTrace.secondMethod(TestPrintStackTrace.java:20)\n\tat com.lyhistory.java.TestPrintStackTrace.firstMethod(TestPrintStackTrace.java:17)\n\tat com.lyhistory.java.TestPrintStackTrace.main(TestPrintStackTrace.java:14)\n\n调用：    \nThread [main] (Suspended)\t\n\tThreadGroup.uncaughtException(Thread, Throwable) line: 1058\t\n\tThreadGroup.uncaughtException(Thread, Throwable) line: 1052\t\n\tThread.dispatchUncaughtException(Throwable) line: 1959\t\n\npublic void uncaughtException(Thread t, Throwable e) {\n        if (parent != null) {\n            parent.uncaughtException(t, e);\n        } else {\n            Thread.UncaughtExceptionHandler ueh =\n                Thread.getDefaultUncaughtExceptionHandler();\n            if (ueh != null) {\n                ueh.uncaughtException(t, e);\n            } else if (!(e instanceof ThreadDeath)) {\n                System.err.print("Exception in thread \\""\n                                 + t.getName() + "\\" ");\n                e.printStackTrace(System.err);\n            }\n        }\n    }\n')])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('\npublic class ThreadExceptionTest implements Runnable {\n    public void run() {\n        firstMethod();\n    }\n    public void firstMethod() {\n        secondMethod();\n    }\n    public void secondMethod() {\n        int a = 5;\n        int b = 0;\n        int c = a / b;\n    }\n    public static void main(String[] args) {\n        new Thread(new ThreadExceptionTest()).start();\n    }\n}\n\n\nException in thread "Thread-0" java.lang.ArithmeticException: / by zero\n            at Test.ThreadExceptionTest.secondMethod(ThreadExceptionTest.java:14)\n            at Test.ThreadExceptionTest.firstMethod(ThreadExceptionTest.java:8)\n            at Test.ThreadExceptionTest.run(ThreadExceptionTest.java:4)\n            at java.lang.Thread.run(Unknown Source)\n')])])]),a("h2",{attrs:{id:"_2-getstacktrace-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-getstacktrace-方法"}},[e._v("#")]),e._v(" 2.getStackTrace()方法")]),e._v(" "),a("p",[e._v("这个方法提供了对printStackTrace()方法所打印信息的编程访问。它会返回一个栈轨迹元素的数组。以上面的输出为例，输出的第2-4行每一行的内容对应一个栈轨迹元素。将这些栈轨迹元素保存在一个数组中。每个元素对应栈的一个栈帧。数组的第一个元素保存的是栈顶元素，也就是上面的f。最后一个元素保存的栈底元素。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public class TestPrintStackTrace {\n    public static void f() throws Exception{\n        throw new Exception("出问题啦！");\n    }\n    public static void g() throws Exception{\n        f();\n    }\n    public static void main(String[] args) {\n        try {\n            g();\n        }catch(Exception e) {\n            e.printStackTrace();\n            System.out.println("------------------------------");\n            for(StackTraceElement elem : e.getStackTrace()) {\n                System.out.println(elem);\n            }\n        }\n    }\n}\n\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:6)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:10)\nTestPrintStackTrace.f(TestPrintStackTrace.java:3)\nTestPrintStackTrace.g(TestPrintStackTrace.java:6)\nTestPrintStackTrace.main(TestPrintStackTrace.java:10)\n\n')])])]),a("p",[e._v("这样的输出和printStackTrace()的输出基本上是一样的")]),e._v(" "),a("h2",{attrs:{id:"_3-fillinstacktrace"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-fillinstacktrace"}},[e._v("#")]),e._v(" 3.fillInStackTrace()")]),e._v(" "),a("p",[e._v("要说清楚这个方法，首先要讲一下捕获异常之后重新抛出的问题。在catch代码块中捕获到异常，打印栈轨迹，又重新throw出去。在上一级的方法调用中，再捕获这个异常并且打印出栈轨迹信息。这两个栈轨迹信息会一样吗？我们看一下代码：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public class TestPrintStackTrace {\n    public static void f() throws Exception{\n        throw new Exception("出问题啦！");\n    }\n    public static void g() throws Exception{\n        try {\n            f();\n        }catch(Exception e) {\n            e.printStackTrace();\n            throw e;\n        }\n         \n    }\n    public static void main(String[] args) {\n        try {\n            g();\n        }catch(Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:16)\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:16)\n')])])]),a("p",[e._v("在main方法中捕获的异常，是在g()方法中抛出的，按理说这两个打印栈轨迹的信息应该不同，第二次打印的信息应该没有关于f的信息。但是事实上，两次打印栈轨迹信息是一样的。")]),e._v(" "),a("p",[e._v("也就是说，捕获到异常又立即抛出，在上级方法调用中再次捕获这个异常，打印的栈轨迹信息是一样的。原因在于没有将当前线程当前状态下的轨迹栈的状态保存进Throwabe中。现在我们引入fillInStackTrace()方法。这个方法刚好做的就是这样的保存工作。我们看一下这个方法的原型：\npublic Throwable fillInStackTrace()")]),e._v(" "),a("p",[e._v("这个方法是有返回值的。返回的是保存了当前栈轨迹信息的Throwable对象。我们看看使用fillInStackTrace()方法处理后，打印的栈轨迹信息有什么不同，代码如下：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('public class TestPrintStackTrace {\n    public static void f() throws Exception{\n        throw new Exception("出问题啦！");\n    }\n    public static void g() throws Exception{\n        try {\n            f();\n        }catch(Exception e) {\n            e.printStackTrace();\n            //不要忘了强制类型转换\n            throw (Exception)e.fillInStackTrace();\n        }\n         \n    }\n    public static void main(String[] args) {\n        try {\n            g();\n        }catch(Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.f(TestPrintStackTrace.java:3)\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:7)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:17)\njava.lang.Exception: 出问题啦！\n    at TestPrintStackTrace.g(TestPrintStackTrace.java:11)\n    at TestPrintStackTrace.main(TestPrintStackTrace.java:17)\n')])])]),a("p",[e._v("我们看到，在main方法中打印栈轨迹已经没有了f相关的信息了")]),e._v(" "),a("h2",{attrs:{id:"caused-by"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#caused-by"}},[e._v("#")]),e._v(" CAUSED BY")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('package com.msh.demo.exceptionStack;\nimport java.io.IOException;\n/**\n * Created by monkeysayhi on 2017/10/1.\n */\npublic class Test {\n  private void fun1() throws IOException {\n    throw new IOException("level 1 exception");\n  }\n  private void fun2() {\n    try {\n      fun1();\n    } catch (IOException e) {\n        throw new RuntimeException("level 2 exception", e);\n    }\n  }\n  public static void main(String[] args) {\n    try {\n      new Test().fun2();\n    } catch (Exception e) {\n      e.printStackTrace();\n    }\n  }\n}\n\njava.lang.RuntimeException: level 2 exception\n\tat com.msh.demo.exceptionStack.Test.fun2(Test.java:17)\n\tat com.msh.demo.exceptionStack.Test.main(Test.java:24)\n\tat sun.reflect.NativeMethodAccessorIm猴子pl.invoke0(Native Method)\n\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.intellij.rt.execution.application.AppMain.main(AppMain.java:147)\nCaused by: java.io.IOException: level 1 exception\n\tat com.msh.demo.exceptionStack.Test.fun1(Test.java:10)\n\tat com.msh.demo.exceptionStack.Test.fun2(Test.java:15)\n\t... 6 more\n')])])]),a("p",[e._v("根据上述异常信息，异常抛出过程中的事件顺序是：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("在Test.java的第10行，抛出了一个IOExceotion(“level 1 exception”) e1\n异常e1被逐层向外抛出，直到在Test.java的第15行被捕获\n在Test.java的第17行，根据捕获的异常e1，抛出了一个RuntimeException(“level 2 exception”， e1) e2\n异常e2被逐层向外抛出，直到在Test.java的第24行被捕获\n后续没有其他异常信息，经过必要的框架后，由程序自动或用户主动调用了e2.printStackTrace()方法\n")])])]),a("h2",{attrs:{id:"线程栈分析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#线程栈分析"}},[e._v("#")]),e._v(" 线程栈分析")]),e._v(" "),a("p",[e._v("程堆栈也称线程调用堆栈，是虚拟机中线程（包括锁）状态的一个瞬间状态的快照，即系统在某一个时刻所有线程的运行状态，包括每一个线程的调用堆栈，锁的持有情况。虽然不同的虚拟机打印出来的格式有些不同，但是线程堆栈的信息都包含：")]),e._v(" "),a("p",[e._v("1、线程名字，id，线程的数量等。")]),e._v(" "),a("p",[e._v("2、线程的运行状态，锁的状态（锁被哪个线程持有，哪个线程在等待锁等）")]),e._v(" "),a("p",[e._v("3、调用堆栈（即函数的调用层次关系）调用堆栈包含完整的类名，所执行的方法，源代码的行数。")]),e._v(" "),a("p",[e._v("Jstack是常用的排查工具，它能输出在某一个时间，Java进程中所有线程的状态，很多时候这些状态信息能给我们的排查工作带来有用的线索。 Jstack的输出中，Java线程状态主要是以下几种：")]),e._v(" "),a("p",[e._v("1、BLOCKED 线程在等待monitor锁(synchronized关键字)")]),e._v(" "),a("p",[e._v("2、TIMED_WAITING 线程在等待唤醒，但设置了时限")]),e._v(" "),a("p",[e._v("3、WAITING 线程在无限等待唤醒")]),e._v(" "),a("p",[e._v("4、RUNNABLE 线程运行中或I/O等待")]),e._v(" "),a("h2",{attrs:{id:"troubleshoot"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#troubleshoot"}},[e._v("#")]),e._v(" TROUBLESHOOT")]),e._v(" "),a("p",[e._v("为什么有时我在日志中只看到异常名”java.lang.NullPointerException”，却没有异常栈")]),e._v(" "),a("p",[e._v("示例的异常信息中，异常名、细节信息、路径三个元素都有，但是，由于JVM的优化，细节信息和路径可能会被省略。")]),e._v(" "),a("p",[e._v("这经常发生于服务器应用的日志中，由于相同异常已被打印多次，如果继续打印相同异常，JVM会省略掉细节信息和路径队列，向前翻阅即可找到完整的异常信息。")])])}),[],!1,null,null,null);t.default=c.exports}}]);