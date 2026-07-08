```
Extensibility Mechanisms (扩展机制)
   ├── Hook (React Hooks, WordPress Hooks, Shutdown Hooks)
   ├── Callback & Event Loop (Node.js, Browser)
   ├── Interceptor & Filter (Servlet Filter, Spring Interceptor)
   └── AOP (Aspect-Oriented Programming) 
```

## Hook
Hook = 钩子。就是在系统执行的某个特定节点，留一个"挂钩"，让你能把自定义代码挂上去执行，而不用修改系统本身的源码。
这就是著名的好莱坞原则：Don't call us, we'll call you.（控制反转）

1. 系统定义了一个"时机"（渲染后、启动时、收到请求时、事件发生）
2. 系统定义了"接口"（函数签名、URL 格式）
3. 你提供"实现"（你的代码、你的处理函数）
4. 系统在那个时机自动调用你的实现
   
Hook 就是编程界的"插座"。

系统说："我在这里留了个插座（hook point），你插头（你的代码）想什么时候插都行，插上了我就给你供电（调用你的代码）。"

React Hook = 组件里的插座

WordPress Hook = PHP 执行流的插座

Java Hook = JVM 生命周期的插座

Webhook = 互联网上的插座

### 1. React Hook — 函数组件的"外挂"

本质：让无状态的函数组件"钩入" React 的内部系统，获得状态、生命周期等能力。
```
function Counter() {
  const [count, setCount] = useState(0);  // 钩住 React 的状态管理
  
  useEffect(() => {                         // 钩住渲染后的生命周期
    document.title = `Clicked ${count} times`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
为什么叫 Hook：你"钩"住了 React 的渲染循环。React 在渲染你的组件时，会调用你的函数，而在函数执行过程中，useState和 useEffect把你想要的逻辑"挂"到了 React 内部对应的机制上。

常见 React Hooks：

useState— 钩住状态存储

useEffect— 钩住副作用（渲染后、销毁前）

useContext— 钩住上下文

useRef— 钩住持久化引用

### 2. WordPress Hook — 插件系统的基石

本质：WordPress 在执行流程中预埋了成百上千个"钩子点"，插件通过挂载函数来修改行为或内容。
```
// 挂载到 'init' 这个钩子点
add_action('init', 'register_my_post_type');

// 挂载到 'the_content' 过滤器，修改文章内容
add_filter('the_content', 'insert_ads_between_paragraphs');
```

WordPress 把 Hook 分成两类：

Action（动作钩子）：在某个时刻执行你的函数（比如 init、wp_head）

Filter（过滤器钩子）：接收一些数据，让你的函数修改后再返回（比如 the_content）

为什么叫 Hook：你的插件代码"挂"在了 WP 核心的执行链路上，WP 核心在特定时机"勾"住你注册的回调函数并执行。

替代说法：​ Actions & Filters, Plugin API, Callback registration, Extension point

### 3. Java Hook — 生命周期的"挂钩点"

Java 里的 Hook 比较泛，通常指几种不同的东西：

3a. JVM Shutdown Hook（最经典的"Hook"）
```
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    System.out.println("JVM 正在关闭，清理资源...");
}));
```
JVM 在即将退出时，会自动调用你挂上去的线程。

3b. Spring 生命周期回调
```
@Component
public class MyBean {
    @PostConstruct
    public void init() { }        // 初始化钩子
    
    @PreDestroy
    public void cleanup() { }     // 销毁钩子
}
```

3c. Servlet Filter / Spring Interceptor
```
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, ...) {
        // 在 Controller 执行前"钩入"
        return true;
    }
}
```
为什么叫 Hook：在 JVM 或框架的生命周期特定节点，预留了接口让你插入逻辑。

替代说法：​ Lifecycle callback, Callback, Listener, Interceptor, Shutdown hook

4. Webhook — 跨系统的"电话通知"

本质：不是代码层面的钩子，而是架构层面的钩子。当系统 A 发生某件事时，自动向系统 B 的一个 URL 发送 HTTP POST 请求。
```
GitHub (系统A)                    你的服务器 (系统B)
  |                                    |
  |  push 代码                          |
  |----------------------------------->|  POST /webhook/github
  |                                    |  触发 CI/CD 构建
  |  200 OK                            |
  |<-----------------------------------|

// GitHub 发给你的 HTTP POST body
{
  "action": "push",
  "repository": { "name": "my-app" },
  "sender": { "login": "alice" }
}
```

为什么叫 Hook：你把你的服务"挂"在了别人的事件系统上。别人发生了什么事，主动"勾"一下你的 URL 通知你。

跟前面三种的本质区别：

React/WordPress/Java Hook → 进程内的控制反转（同一个程序里，框架调用你的代码）

Webhook → 跨进程/跨网络的控制反转（不同系统之间，通过 HTTP 回调）

替代说法：​ HTTP callback, Reverse API, Event notification, Push notification (for APIs), Callback URL




## [AOP](/software/highlevel/core_concepts_extensibility_aop.md)
