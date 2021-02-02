nio basics refer to 《nio_epoll》

https://blog.csdn.net/twypx/article/details/84543518

SimpleChannelInboundHandler https://blog.csdn.net/linuu/article/details/51307060

## concepts

### Channel：
这并不是Netty专有的概念，Java NIO里也有。可以看作是入站或者出战数据的载体，有各种基本的read、write、connect、bind等方法，相当于传统IO的Socket，需要关注一下ServerChannel，ServerChannel负责创建子Channel，子Channel具体去执行一些具体accept之后的读写操作。项目中用的NioSocketChannel和NioServerSocketChannel。

### EventLoop和EventLoopGroup：
Netty的核心抽象，channel的整个生命周期都是通过EventLoop去处理。EventLoop相当于对Thread的封装，一个EventLoop里面拥有一个永远都不会改变的Thread，同时任务的提交只需要通过EventLoop就可执行；而EventLoopGroup负责为每个Channel分配一个EventLoop/

### ChannelFuture：
Netty是非阻塞式IO non-blocking io。

### ChannelHandler和ChannelPipeline：
开发人员主要关注的也可能是唯一需要关注的两个组件，用来管理数据流以及执行应用程序处理逻辑。

**ChannelInboundHandler和ChannelOutboundHandler:**
两个常见的ChannelHandler适配器，前者管理入站的数据和操作，后者管理出站的数据和操作，谨记：入站顺序执行，出站逆序执行。

**ChannelPipeline：**
一个拦截流经某个channel的入站和出站时间的ChannelHandle实例链，每一个Channel刚被创建就会被分配一个ChannelPipeline，永久不可更改。

**ChannelHandlerContext：**
ChannelHandle和ChannelPipeline中间管理的纽带，每一个ChannelHandler分配一个ChannelHandlerContext用来跟其他Handler作交互。

### ByteBuf：
网络数据的基本单位是字节，Java NIO使用的ByteBuffer作为字节容器，而Netty使用ByteBuf替代ByteBuffer作为数据容器进行读写。

### BootStrap：
将各种组件拼图进行组装，ServerBootstrap用来引导服务端，Bootstrap用来引导客户端。ServerBootstrap的Group一般会放入两个EventLoopGroup，需要结合Channel去理解，ServerChannel会有子Channel，那为了处理这个Channel，你需要为每一个子Channel分配一个EventLoop，第二个EventLoopGroup是为了让子Channel去共享一个EventLoop，避免额外的线程创建以及上下文切换。

### ByteToMessageDecoder和MessageToByteEncoder：
编解码器的解码器和编码器，MessageToByteEncoder继承了ChannelOutboundHandlerAdapter接口，ByteToMessageDecoder继承了ChannelInboundHandlerAdapter接口。解码器是将字节解码为消息；编码器是将消息编码成字节。

# 
1.序列化和编码都是把 Java 对象封装成二进制数据的过程，这两者有什么区别和联系？
序列化是把内容变成计算机可传输的资源，而编码则是让程序认识这份资源。

2.与服务端启动相比，客户端启动的引导类少了哪些方法，为什么不需要这些方法？
服务端：需要两个线程组，NioServerSocketChannel线程模型，可以设置childHandle
客户端：一个线程组，NioSocketChannel线程模型，只可以设置handler

3.ChannelPipeline执行顺序？
（1）InboundHandler顺序执行，OutboundHandler逆序执行
（2）InboundHandler之间传递数据，通过ctx.fireChannelRead(msg)
（3）InboundHandler通过ctx.write(msg)，则会传递到outboundHandler
（4) 使用ctx.write(msg)传递消息，Inbound需要放在结尾，在Outbound之后，不然outboundhandler会不执行；但是使用channel.write(msg)、pipline.write(msg)情况会不一致，都会执行，那是因为channel和pipline会贯穿整个流。
（5) outBound和Inbound谁先执行，针对客户端和服务端而言，客户端是发起请求再接受数据，先outbound(写)再inbound（读），服务端则相反。

4.三种最常见的ChannelHandle的子类型
a. 基于 ByteToMessageDecoder，我们可以实现自定义解码，而不用关心 ByteBuf 的强转和 解码结果的传递。
b. 基于 SimpleChannelInboundHandler，这主要针对的最常见的一种情况，你去接收一种(泛型)解码信息，然后对数据应用业务逻辑然后继续传下去。我们可以实现每一种指令的处理，通过泛型不再需要强转，不再有冗长乏味的 if else 逻辑，不需要手动传递对象。
c. 基于 MessageToByteEncoder，我们可以实现自定义编码，而不用关心 ByteBuf 的创建，不用每次向对端写 Java 对象都进行一次编码。

5.Netty关于拆包粘包理论与解决方案？本次使用的是LengthFieldBasedFrameDecoder。
a.固定长度的拆包器 FixedLengthFrameDecoder
如果你的应用层协议非常简单，每个数据包的长度都是固定的，比如 100，那么只需要把这个拆包器加到 pipeline 中，Netty 会把一个个长度为 100 的数据包 (ByteBuf) 传递到下一个 channelHandler。
b.行拆包器 LineBasedFrameDecoder
从字面意思来看，发送端发送数据包的时候，每个数据包之间以换行符作为分隔，接收端通过 LineBasedFrameDecoder 将粘过的 ByteBuf 拆分成一个个完整的应用层数据包。
c.分隔符拆包器 DelimiterBasedFrameDecoder
DelimiterBasedFrameDecoder 是行拆包器的通用版本，只不过我们可以自定义分隔符。
d.基于长度域拆包器 LengthFieldBasedFrameDecoder
最后一种拆包器是最通用的一种拆包器，只要你的自定义协议中包含长度域字段，均可以使用这个拆包器来实现应用层拆包。由于上面三种拆包器比较简单，读者可以自行写出 demo，接下来，我们就结合我们小册的自定义协议，来学习一下如何使用基于长度域的拆包器来拆解我们的数据包。

from https://www.unclewang.info/learn/java/822/

https://juejin.im/post/5c6d7640f265da2de80f5e9c#heading-4



## 案例

### 基于http的websocket

使用SimpleChannelInboundHandler，并使用netty提供的FullHttpRequest直接处理http，所以不需要处理拆包粘包问题

> 官方文档：

> *如果对于单条HTTP消息你不想处理多个消息对象*，*你可以传入**HttpObjectAggregator 到pipline中*。*HttpObjectAggregator 会将多个消息对象转变**为单个FullHttpRequest 或者*FullHttpResponse

https://www.cnblogs.com/xuwujing/p/7782704.html

websocket是基于http1.1的，自然此时netty需要handle http request

https://www.huaweicloud.com/articles/bb663e7adeb28738a452e98025e0b6f2.html

```
class HttpServerHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
  private final PojoEndpointServer pojoEndpointServer;
  private static ByteBuf faviconByteBuf = null; private final ServerEndpointConfig config;
  private static ByteBuf notFoundByteBuf = null;
  private static ByteBuf badRequestByteBuf = null;
  private static ByteBuf forbiddenByteBuf = null;
  private static ByteBuf internalServerErrorByteBuf = null;
```



### 基于TCP的rpc

当然rpc也可以基于http实现，我们这里是说基于tcp的rpc：

同样是使用SimpleChannelInboundHandler，但不再使用netty提供的FullHttpRequest，而是接收默认的TCP消息，所以需要handle 自定义的rpc request，因为是TCP，所以需要处理拆包粘包

使用netty实现高性能rpc https://www.cnblogs.com/jietang/p/5615681.html



```
public class RpcRequest {
	private String requestId;
	private String className;
	private String methodName;
	private Class<?>[] parameterTypes;
	private Object[] parameters;
}
public class RpcServerHandler extends SimpleChannelInboundHandler<RpcRequest>{ //由于是过滤了RpcRequest类型的inbound，所以其他类型的inbound会忽略，比如heartBeat
	
	private static final Logger logger = LoggerFactory.getLogger(RpcServerHandler.class);
	
	private final Map<String, Object> handlerMap;
	
	public RpcServerHandler(Map<String, Object> handlerMap) {
		this.handlerMap = handlerMap;
	}
	private Object handle(RpcRequest request) throws Throwable{
	
```

### 同时支持HTTP和TCP

自定义扩展 ChannelInboundHandlerAdapter

https://my.oschina.net/succy/blog/4724766