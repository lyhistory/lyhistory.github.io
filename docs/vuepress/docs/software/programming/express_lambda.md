
## Anonymous function

In computer programming, an anonymous function (function literal, lambda abstraction, lambda function, lambda expression or block) is a function definition that is not bound to an identifier. Anonymous functions are often arguments being passed to higher-order functions or used for constructing the result of a higher-order function that needs to return a function.[1] If the function is only used once, or a limited number of times, an anonymous function may be syntactically lighter than using a named function. Anonymous functions are ubiquitous in functional programming languages and other languages with first-class functions, where they fulfil the same role for the function type as literals do for other data types.

在面向对象中高级语言也逐渐支持lambda，不过只有在面向过程编程中才是一等公民

## capturing lambdas vs non-capturing Lambda 捕获和非捕获的表达式

Lambdas are said to be "capturing" if they access a non-static variable or object that was defined outside of the lambda body. For example, this lambda captures the variablex:

int x = 5; return y -> x + y;


In order for this lambda declaration to be valid, the variables it captures must be "effectively final". So, either they must be marked with thefinalmodifier, or they must not be modified after they're assigned.

Whether a lambda is capturing or not has implications for performance. A non-capturing lambda is generally going to be more efficient than a capturing one. Although this is not defined in any specifications (as far as I know), and you shouldn't count on it for a program's correctness, a non-capturing lambda only needs to be evaluated once. From then on, it will return an identical instance. Capturing lambdas need to be evaluated every time they're encountered, and currently that performs much like instantiating a new instance of an anonymous class.

### 例子 Disruptor ringbuffer Publishing events using lambdas
```
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.examples.longevent.LongEvent;
import com.lmax.disruptor.util.DaemonThreadFactory;
import java.nio.ByteBuffer;

public class LongEventMain
{
    public static void main(String[] args) throws Exception
    {
        int bufferSize = 1024; 

        Disruptor<LongEvent> disruptor = 
                new Disruptor<>(LongEvent::new, bufferSize, DaemonThreadFactory.INSTANCE);

        disruptor.handleEventsWith((event, sequence, endOfBatch) ->
                System.out.println("Event: " + event)); 
        disruptor.start(); 


        RingBuffer<LongEvent> ringBuffer = disruptor.getRingBuffer(); 
        ByteBuffer bb = ByteBuffer.allocate(8);
        for (long l = 0; true; l++)
        {
            bb.putLong(0, l);
            ringBuffer.publishEvent((event, sequence, buffer) -> event.set(buffer.getLong(0)), bb);
            Thread.sleep(1000);
        }
    }
}
```

Notice that the lambda used for publishEvent() only refers to the parameters that are passed in.

If we were to instead write that code as:

Example of a capturing lambda
```
ByteBuffer bb = ByteBuffer.allocate(8);
for (long l = 0; true; l++)
{
    bb.putLong(0, l);
    ringBuffer.publishEvent((event, sequence) -> event.set(bb.getLong(0)));
    Thread.sleep(1000);
}
```
This would create a capturing lambda, meaning that it would need to instantiate an object to hold the ByteBuffer bb variable as it passes the lambda through to the publishEvent() call. This will create additional (unnecessary) garbage, so the call that passes the argument through to the lambda should be preferred if low GC pressure is a requirement.

从上面的代码我们可以看到在一个lambda函数里引用到了外部变量bb。那么实际上在虚拟机翻译的时候，首先会在lambda所代表的内部类里生成一个引用，这个引用在内部类构造的时候引用了外面的变量bb（lambda表达式其实就是一个匿名内部类）。类似于以下代码:

```
String bb;
Functional a = new Functional(){
    private final String bb = InnerClass.this.bb;
    @Override
    public void test(){
        System.out.printf(bb);
    }
};

```
也就是说在内部类里我们多了一个bb的引用副本，那么在循环的时候，循环多少次就会多几个不必要的bb引用副本。这也是为什么disruptor文档说 This will create additional (unnecessary) garbage

解决方式就是在lambda的外部类增加一个静态方法，类似于：
```
public static void translate(LongEvent event, long sequence, ByteBuffer buffer)
{
    event.set(buffer.getLong(0));
}
public static void main(String[] args) throws Exception
{
    ByteBuffer bb = ByteBuffer.allocate(8);
    for(long l = 0; true; l++){
        bb.putLong(0, l);
        ringBuffer.publishEvent(LongEventMain::translate, bb);
        Thread.sleep(1000);
    }
}
```