
为什么要用shiro，我的理解这个轮子造的比较好，登录和权限授权是大部分应用最基本的功能，也是最容易出问题和重复性的工作，
shiro将这部分模块化，采用依赖注入的模式，让用户可以比较容易自定义数据源、登录验证逻辑、权限逻辑等内容；

另外采用shiro也比较容易实现CAS-SSO([Central Authentication Service - Single signon](https://en.wikipedia.org/wiki/Central_Authentication_Service))，
当然shiro并没有out-of-box的SSO方案，之前是有[shiro-cas集成支持](http://shiro.apache.org/cas.html)，现在是已经迁移到[pac4j security library for Shiro: OAuth, CAS, SAML, OpenID Connect, LDAP, JWT](https://github.com/bujiio/buji-pac4j)

Apache Shiro is a powerful and flexible open-source security framework that cleanly handles 
+ **authentication**, 
+ **authorization**, 
+ **enterprise session management** [Use a Session API in any environment, even without web or EJB containers.] 
+ **cryptography**.

Apache shiro http://shiro.apache.org/

## 1.key concepts

![architecture](/docs/docs_image/software/buildingblock/shiro01_p1.png)

### 1.1 关键模块
+ Subject(org.apache.shiro.subject.Subject)):
	a security-specific ‘view’ of an application user, currently executing user -- a person/a 3rd-party service/daemon account/cron job;
	bond to SecurityManager
+ SecurityManager(org.apache.shiro.mgt.SecurityManager):
	'umbrella' object that coordinates its internal security components;
	behinde the scenes when you interact with a subject, does all the heavy lifting for any 'Subject' operation;
+ Realms(org.apache.shiro.realm.Realm):
	a security-specific DAO
	bridge/connector between shiro(SecurityManager) and your application's security data;
	out-of-the-box Realms: directories(LDAP),relational databases(JDBC),text config(INI,properties)
+ Authenticator (org.apache.shiro.authc.Authenticator):
	executing and reacting to authentication(login) attempts by users;
	coordinate the Realms;
+ Authorizer(org.apache.shiro.authz.Authorizer)
	coordinate with multiple back-end data sources to access role and permission information;
+ SessionManager (org.apache.shiro.session.mgt.SessionManager)
	SessionDAO allow any datasource to be used to persist sessions
+ CacheManager (org.apache.shiro.cache.CacheManager)
	chaing has always been a first-clss architectural feature to improve performance while using these data sources;
+ Cryptography (org.apache.shiro.crypto.*)

> To simplify configuration and enable flexible configuration/pluggability, Shiro’s implementations are all highly modular in design - 
> so modular in fact, that the SecurityManager implementation (and its class-hierarchy) does not do much at all. 
> **Instead, the SecurityManager implementations mostly act as a lightweight ‘container’ component**, delegating almost all behavior to nested/wrapped components. 
> This ‘wrapper’ design is reflected in the detailed architecture diagram above.
> The SessionManager knows how to create and manage user Session lifecycles to provide a robust Session experience for users in all environments. 
> This is a unique feature in the world of security frameworks - 
> **Shiro has the ability to natively manage user Sessions in any environment, even if there is no Web/Servlet or EJB container available. 
> **By default, Shiro will use an existing session mechanism if available, (e.g. Servlet Container), but if there isn’t one, such as in a standalone application or non-web environment, 
> **it will use its built-in enterprise session management to offer the same programming experience. The SessionDAO exists to allow any datasource to be used to persist sessions.
> https://shiro.apache.org/architecture.html

简言之，从Dependency Injection的角度来看，SecurityManager扮演的角色就是容器或者根节点或家长管家类；
	
另一些关键词：

+ Principal：
	any identifying attribute of an application user (Subject). An ‘identifying attribute’ can be anything that makes sense to your application - 
	**a username, a surname, a given name, a social security number, a user ID, etc.**
+ Credential：
	a piece of information that verifies the identity of a user/Subject. One (or more) credentials are submitted along with Principal(s) during an authentication attempt to verify that the user/Subject submitting them is actually the associated user；
	Credentials are usually very secret things that only a particular user/Subject would know, such as：
	**a password or a PGP key or biometric attribute or similar mechanism.**
+ Role:
	In many applications it is a nebulous concept at best that people use to implicitly define security policies. 
	Shiro prefers to interpret a Role as simply a **named collection of Permissions**. 
	
	**Implicit Roles:** Most people use roles as an implicit construct: where your application implies a set of behaviors (i.e. permissions) based on a role name only. With implicit roles, there is nothing at the software level that says “role X is allowed to perform behavior A, B and C”. Behavior is implied by a name alone.

	**Explicit Roles:** An explicit role however is essentially a named collection of actual permission statements. In this form, the application (and Shiro) knows exactly what it means to have a particular role or not. Because it is known the exact behavior that can be performed or not, there is no guessing or implying what a particular role can or can not do.
	
+ Resources： 就是后端服务，比如/user/list, /user/create,总之是这些资源的crud
	
	**Resource-based Access control:**Be sure to read Les Hazlewood's article, [The New RBAC: Resource-Based Access Control](https://stormpath.com/blog/new-rbac-resource-based-access-control), which covers in-depth the benefits of using permissions and explicit roles (and their positive impact on source code) instead of the older implicit role approach.
	
+ Permissions:
	Permission statements reflect behavior (actions associated with resource types) only. They do not reflect who is able to perform such behavior.

### 1.2 authentication / login
关于subject.login也就是shiro这部分登录逻辑：
https://shiro.apache.org/authentication.html#Authentication-sequence

![authentication](/docs/docs_image/software/buildingblock/shiro01_p2.png)

Step 1: Application code invokes the **Subject.login** method, passing in the constructed AuthenticationToken instance representing the end-user’s principals and credentials.

Step 2: The Subject instance, typically a DelegatingSubject (or a subclass) delegates to the application’s SecurityManager by calling **securityManager.login(token)**, where the actual authentication work begins.

Step 3: The SecurityManager, being a basic ‘umbrella’ component, receives the token and simply delegates to its internal Authenticator instance by calling **authenticator.authenticate(token)**. This is almost always a ModularRealmAuthenticator instance, which supports coordinating one or more Realm instances during authentication. The ModularRealmAuthenticator essentially provides a PAM-style paradigm for Apache Shiro (where each Realm is a ‘module’ in PAM terminology).

Step 4: 

a) If more than one Realm is configured for the application, the ModularRealmAuthenticator instance will initiate a multi-Realm authentication attempt utilizing its configured AuthenticationStrategy. Before, during and after the Realms are invoked for authentication, the AuthenticationStrategy will be called to allow it to react to each Realm’s results. We will cover AuthenticationStrategies soon.

b) If only a single Realm is configured, it is called directly - there is no need for an AuthenticationStrategy in a single-Realm application.

Step 5: Each configured Realm is consulted to see if it supports the submitted AuthenticationToken. If so, the supporting **Realm’s getAuthenticationInfo method** will be invoked with the submitted token. The getAuthenticationInfo method effectively represents a single authentication attempt for that particular Realm. We will cover the Realm authentication behavior shortly.

### 1.3 authoization / access control
https://shiro.apache.org/authorization.html

![authoization](/docs/docs_image/software/buildingblock/shiro01_p3.png)

Step 1: Application or framework code invokes any of the **Subject hasRole*, checkRole*, isPermitted*, or checkPermission* method** variants, passing in whatever permission or role representation is required.

Step 2: The Subject instance, typically a DelegatingSubject (or a subclass) delegates to the application’s SecurityManager by **calling the securityManager’s nearly identical respective hasRole*, checkRole*, isPermitted*, or checkPermission* method** variants (the securityManager implements the org.apache.shiro.authz.Authorizer interface, which defines all Subject-specific authorization methods).

Step 3: The SecurityManager, being a basic ‘umbrella’ component, relays/delegates to its internal org.apache.shiro.authz.Authorizer instance by **calling the authorizer’s respective hasRole*, checkRole*, isPermitted*, or checkPermission* method**. The authorizer instance is by default a ModularRealmAuthorizer instance, which supports coordinating one or more Realm instances during any authorization operation.

Step 4: Each configured Realm is checked to see if it implements the same Authorizer interface. If so, the **Realm’s own respective hasRole*, checkRole*, isPermitted*, or checkPermission* method** is called.

授权方法：
+ 基于角色 **role-based security**
+ 基于权限 **permission-based security**

## 2.实例代码剖析

### 2.1 基于shiro-spring-boot-web-starter简单demo分析
```
<dependency>
	<groupId>org.apache.shiro</groupId>
	<artifactId>shiro-spring-boot-web-starter</artifactId>
	<version>${shiro.version}</version>
</dependency>
```
#### 2.1.1 Realm注入

好了 我们从头看下这个Realm是如何注入的，刚开始我从jar里面找到了很多注入的地方加了断点，
但是报错“not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)” 所以就只好具体分析，找到一些疑似调用到的方法再下断点拦截看调用栈;

![](/docs/docs_image/software/buildingblock/shiro02_p1.png)
![](/docs/docs_image/software/buildingblock/shiro02_p2.png)

先是创建了Realm的bean，(刚开始我还以为是注入到图1中的DefaultWebSecurityManager)，实际是注入到图2的ShiroWebAutoConfiguration：
```
 @Bean
    @ConditionalOnMissingBean
    @Override
    protected SessionsSecurityManager securityManager(List<Realm> realms) {
        return super.securityManager(realms);
    }
```
这里插入说明下原因，对spring bean装配或者injection不熟悉的人，可能不了解实际上spring可以将单个的bean自动装配到集合里面如List/Set/Map，
The Spring container can injects the individual beans into one collection，并且可以加@Order(Value=1)注解来排序；

其实最简单的思路，因为pom是依赖shiro-spring-boot-web-starter，自然是找到这个ShiroWebAutoConfiguration，然后两层继承自AbstractShiroConfiguration，

![](/docs/docs_image/software/buildingblock/shiro02_p3.png)
因为org.apache.shiro.mgt.SessionsSecurityManager终极是继承自AuthorizingSecurityManager，又继承自AuthenticatingSecurityManager ，
又继承自RealmSecurityManager,（有点意思，session内容依赖于权限，权限依赖于是否登录，是否登录依赖于数据源），
securityManager.setRealms(realms)之后会调用afterRealmsSet(),由于afterRealmsSet()是父类的继承方法，所以又是常见的template pattern，
AuthenticatingSecurityManager和AuthorizingSecurityManager内的afterRealmsSet()方法内部再调用其子类型的方法，
所以最终是将Realm通过AuthenticatingSecurityManager传递给了这个默认的认证器ModularRealmAuthenticator，
通过AuthorizingSecurityManager传递给了默认的授权器ModularRealmAuthorizer; 


#### 2.1.2 请求拦截和登录过程

![](/docs/docs_image/software/buildingblock/shiro02_p4.png)

先要注册一下拦截/login,这是我们自己提供的ShiroFilterChainDefinition：
```
@Bean
public ShiroFilterChainDefinition shiroFilterChainDefinition() {
	DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
	chainDefinition.addPathDefinition("/login.html", "authc"); // need to accept POSTs from the login form
	chainDefinition.addPathDefinition("/logout", "logout");
	return chainDefinition;
}
```
刚开始我以为这个bean会覆盖shiro-spring下面的AbstractShiroWebConfiguration里面的：
```
/**
 * @since 1.4.0
 */
public class AbstractShiroWebConfiguration extends AbstractShiroConfiguration {
...
	protected ShiroFilterChainDefinition shiroFilterChainDefinition() {
		DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
		chainDefinition.addPathDefinition("/**", "authc");
		return chainDefinition;
	}
```

实际上并没有用到，而还是被一开始的ShiroWebAutoConfiguration用

```
 @Bean
@ConditionalOnMissingBean
@Override
protected ShiroFilterChainDefinition shiroFilterChainDefinition() {
	return super.shiroFilterChainDefinition();
}
```

另外上图左下角实际上是tomcat-catalina的ApplicationFilterChain，应该是在前面注册filter的时候shiro会最终注册给内置的tomcat，然后tomcat抓取到之后，再回调给shiro，
可以看到右侧最终调用到了shiro-web的org.apache.shiro.web.servlet.AbstractShiroFilter，
然后可以看到这个doFilterInternal方法体内给每一个web请求的thread生成一个subject，并且绑定一个单例的SecurityManager（关于绑定bind，是将其放入当前所在thread的一个ThreadLocal Map里面，值得学习研究下）；

至于这个securityManager的set过程，图中没有给出来，大致是ShiroFilter去setSecurityManager，然后从env.getWebSecurityManager()：

```
public class ShiroFilter extends AbstractShiroFilter {

    /**
     * Configures this instance based on the existing {@link org.apache.shiro.web.env.WebEnvironment} instance
     * available to the currently accessible {@link #getServletContext() servletContext}.
     *
     * @see org.apache.shiro.web.env.EnvironmentLoaderListener
     * @since 1.2
     */
    @Override
    public void init() throws Exception {
        WebEnvironment env = WebUtils.getRequiredWebEnvironment(getServletContext());

        setSecurityManager(env.getWebSecurityManager());

        FilterChainResolver resolver = env.getFilterChainResolver();
        if (resolver != null) {
            setFilterChainResolver(resolver);
        }
    }
}
```
再往前找到
```
public class AbstractShiroWebFilterConfiguration {

    @Autowired
    protected SecurityManager securityManager;

    @Autowired
    protected ShiroFilterChainDefinition shiroFilterChainDefinition;

    @Value("#{ @environment['shiro.loginUrl'] ?: '/login.jsp' }")
    protected String loginUrl;

    @Value("#{ @environment['shiro.successUrl'] ?: '/' }")
    protected String successUrl;

    @Value("#{ @environment['shiro.unauthorizedUrl'] ?: null }")
    protected String unauthorizedUrl;

    protected ShiroFilterFactoryBean shiroFilterFactoryBean() {
        ShiroFilterFactoryBean filterFactoryBean = new ShiroFilterFactoryBean();

        filterFactoryBean.setLoginUrl(loginUrl);
        filterFactoryBean.setSuccessUrl(successUrl);
        filterFactoryBean.setUnauthorizedUrl(unauthorizedUrl);

        filterFactoryBean.setSecurityManager(securityManager);
        filterFactoryBean.setFilterChainDefinitionMap(shiroFilterChainDefinition.getFilterChainMap());

        return filterFactoryBean;
   
```
所以这里用autowired就是最前面的那个ShiroWebAutoConfiguration的SessionsSecurityManager这个bean；

所以上图右下角的截图是错误的，至于这个getSecurityManager何时调用我估计应该是非常规的用bean的方式注册的SecurityManager，具体等有时间再研究：
~~注意getSecurityManager的第三行是找开发者主动set的全局静态的SecurityManager，不推荐这种方式，具体参见文档或者vm static线程安全的文档，
第一行是去找下面那个Application级别的单例bean（说错了，不是bean，是第一步Realm注入里面提到的创建好的一个单例）；~~

接着看下图，回到拦截的post请求，请求中的form是被层层委托到DelegatingSubject：

![](/docs/docs_image/software/buildingblock/shiro02_p5.png)

看到没，这里是去找SecurityManager，然后跟进其命名空间找到默认的实现 login，这是一个线程安全的singleton实例，可以看到多线程调用这个login没有用到任何公共资源，资源都在传入的上下文参数中，
SecurityManager被设计成一个dispatcher并不参与太多实现，都是交给其他的组件来处理，所以根据authenticate流程：

继续看下调用的这个authenticate(token)具体是如何工作的：

Authenticator是一个interface，其实就是找到前面注入提到的现ModularRealmAuthenticator，如果不知道也可以这样找：在同级package找到AbstractAuthenticator，
authenticate(AuthenticationToken token) 标准的template pattern，然后找到其一个默认实现ModularRealmAuthenticator；

从我们自定义实例化的这个Realm里面找getAuthenticationInfo也是template pattern，一层层的，getAuthenticationInfo调doGetAuthenticationInfo直到调默认的简单DAO-SimpleAccountRealm的getUser；

补充一句，在定义Realm bean的时候我们用了
```realm.setUserDefinitions("joe.coder=password,user\n" + "jill.coder=password,admin");```
这就相当于初始化了”内存数据库”，具体代码很简单不再分析；
然后关于多线程安全的问题，这个简单的Realm自然是用了读写锁；

至此剖析完成

### 2.2 基于shiro-spring实例分析

#### 2.2.1 config配置解析

![](/docs/docs_image/software/buildingblock/shiro03_p1.png)

#### 2.2.2 注入自定义realm

![](/docs/docs_image/software/buildingblock/shiro03_p2.png)

可以看到虽然这个CustomRealm extends AuthorizingRealm，但是实际上SecurityManager用来做authenticate和authorize，所以这里这个AuthorizingRealm让人误解，
当然看其具体实现的两个方法也会很清楚doGetAuthenticationInfo和doGetAuthorizationInfo


#### 2.2.2 authenticate/login 

![](/docs/docs_image/software/buildingblock/shiro03_p3.png)

跟前面filter不同，这里并没有用默认的ShiroFilterChainDefinition的url拦截，而是依赖spring-boot-starter-data-rest从而实现了一个简单的rest api，
自定义的LoginController就包含了验证码 登录等url map，并且通过extends ShiroFilterFactoryBean，定义了一堆可以不登录就可以访问的url（不然访问默认需要登录就会401无权限，不信可以实验默认的登录url http://localhost/login，返回一定是401未登录），
所以这里定义了登录url为/sso/login

补充说明：
	anon:: accessible by all 'anon'ymous users

登录逻辑：

验证码就不说了，看/sso/login对应的login():
```
login(@RequestBody LoginRequest loginInfo, HttpServletRequest request, HttpServletResponse response) {
    Subject subject = SecurityUtils.getSubject();
    int httpStatus = 0;
    
    try {
      if (!StringUtils.hasText(loginInfo.getTerminal()))
      {
        loginInfo.setTerminal(TerminalEnum.WEB.getTerminalType());
      }
      if (!StringUtils.hasText(loginInfo.getUserType())) {
        loginInfo.setUserType("default");
      }
      if (!StringUtils.hasText(loginInfo.getLoginType())) {
        loginInfo.setLoginType(LoginTypeEnum.USERPASSWORD.getLoginType());
      }
      TerminalLoginToken token = new TerminalLoginToken(loginInfo.getUserName(), loginInfo.getPassword());
      token.setTerminal(loginInfo.getTerminal());
      token.setUserType(loginInfo.getUserType());
      token.setVerifyCode(loginInfo.getVerifyCode());
      token.setOs(loginInfo.getOs());
      token.setClientVersion(loginInfo.getClientVersion());
      token.setLoginType(loginInfo.getLoginType());
      token.setFederalID(loginInfo.getFederalID());
      token.setFederalCode(loginInfo.getFederalCode());
      subject.login(token);
      
      SSOUser ssoUser = (SSOUser)subject.getPrincipal();
      Session session = subject.getSession();
      TerminalEnum terminalType = TerminalEnum.get(loginInfo.getTerminal());
      if (TerminalEnum.ANDROID.equals(terminalType) || TerminalEnum.IOS.equals(terminalType)) {
        response.setHeader("CUSTOM-Token", (String)session.getId());
      }

      
      session.setAttribute("terminal", terminalType);
      session.setAttribute("LoginSessionUser", ssoUser);
      this.logger.debug("LOGIN SUCCESS:{}", Boolean.valueOf(SecurityUtils.getSubject().isAuthenticated()));
```
根据收到的postdata {"userName": "test", "password": "111", "verifyCode": "111"} 构造出LoginToken，然后调用subject.login,

这个subject就是shiro-core里面的org.apache.shiro.subject.support.DelegatingSubject，这里就继续走标准的shiro authentication流程，
继续调用Subject subject = securityManager.login(this, token);
=>调用org.apache.shiro.mgt.DefaultWebSeurityManager的info = authenticate(token);
=>org.apache.shiro.mgt.AuthenticatingSecurityManager this.authenticator.authenticate(token);
=>ModularRealmAuthenticator=>org.apache.shiro.authc.AbstractAuthenticator的info = doAuthenticate(token);=>ModularRealmAuthenticator doAuthenticate
```
if (realms.size() == 1) {
	return doSingleRealmAuthentication(realms.iterator().next(), authenticationToken);
} else {
	return doMultiRealmAuthentication(realms, authenticationToken);
}
```
=>AuthenticationInfo info = realm.getAuthenticationInfo(token);
=>CustomRealm=>org.apache.shiro.realm.AuthenticatingRealm getAuthenticationInfo
```
 AuthenticationInfo info = getCachedAuthenticationInfo(token);
        if (info == null) {
            //otherwise not cached, perform the lookup:
            info = doGetAuthenticationInfo(token);
            log.debug("Looked up AuthenticationInfo [{}] from doGetAuthenticationInfo", info);
            if (token != null && info != null) {
                cacheAuthenticationInfoIfPossible(token, info);
            }
        } else {
            log.debug("Using cached authentication info [{}] to perform credentials matching.", info);
        }

        if (info != null) {
            assertCredentialsMatch(token, info);
        } else {
            log.debug("No AuthenticationInfo found for submitted AuthenticationToken [{}].  Returning null.", token);
        }
```
其中

**a. doGetAuthenticationInfo 最终是回到自定义的CustomRealm的doGetAuthenticationInfo**
	
	```
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		TerminalLoginToken terminalToken = (TerminalLoginToken) token;
		if (TerminalEnum.get(terminalToken.getTerminal()) == null) {
			throw new AuthenticationException("非法的登录终端:" + terminalToken.getTerminal());
		} else {
			CustomAclDefinition custAclDef = UserContextUtil.getCustomAclDefinition(terminalToken.getUserType());
			SSOUser user = UserContextUtil.getUserService().getUserInfo(custAclDef, terminalToken.getUsername(),
					terminalToken.getFederalID(), terminalToken.getLoginType());
			if (user == null) {
				throw new AuthenticationException("用户名或者密码错误");
			} else {
				user.setUserType(terminalToken.getUserType());
				user.setTerminal(terminalToken.getTerminal());
				user.setOs(terminalToken.getOs());
				user.setClientVersion(terminalToken.getClientVersion());
				user.setLoginType(terminalToken.getLoginType());
				user.setFederalID(terminalToken.getFederalID());
				return new SimpleAuthenticationInfo(user, user.getPassword(), new SimpleByteSource(user.getPwdSalt()),
						"customRealm");
			}
		}
	}
	```
	UserContextUtil.getUserService().getUserInfo就是我们自定义的DAO,
	这一步获取db保存的用户info（主要是encrypted password，一般数据库不会保存明文密码，都是通过md5或者是其他哈希算法算出一个哈希值，而且为了防止撞库或者彩虹表，还会加盐）；
	

**b. assertCredentialsMatch 最终调用回我们重写的**

	```
	public class CommonCredentialsMatcher implements CredentialsMatcher {
		static {
		   credentialsMatcherMap.put(SSOAlgorithmType.SHA256, new HashedCredentialsMatcher("SHA-256"));
		   credentialsMatcherMap.put(SSOAlgorithmType.MD5, new HashedCredentialsMatcher("MD5"));
		}
		public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {

			return credentialsMatcher.doCredentialsMatch(token, info);
		}
	```
	代码中是调用shiro提供的哈希值比较工具，从token根据密码明文+盐+哈希方法算出哈希值，然后数据库中取出的哈希值

createSubject：resolvePrincipals

#### 2.2.3 授权

Performing authorization in Shiro can be done in 3 ways:

+ Programmatically - You can perform authorization checks in your java code with structures like if and else blocks.
+ JDK annotations - You can attach an authorization annotation to your Java methods
+ JSP/GSP TagLibs - You can control JSP or GSP page output based on roles and permissions

首先授权一般还涉及到UI的渲染，比如有什么菜单的权限，什么按钮的权限，没有则不应显示，这个问题如何解决需要考虑到这个项目的具体实现，大概两类：

一类是前后端放一起，比如MVC模式，浏览器需要请求后端的Controller来获取view和model，这种情况可以在Controller中

另一类是前后端分离 这个很简单，只要登录后给前端返回一个权限列表即可；

只是前端通过渲染或者js“挡住”是不行的，用户仍然可以发起他没有权限的请求，所以后端也应该有相关验证；
后端验证有两种方式，一种是直接用shiro提供的基于角色和基于权限的授权方式；一种是完全不依赖shiro，只是让shiro处理登录动作，权限完全自主控制

**第一种方式：**

直接参考前面标准的authorization流程

**第二种方式：**

login之后通过springFramework的ApplicationContext publish一个UserLogonEvent，
```
@Autowired
private ApplicationContext context;
public HttpResponse login(UserInfo user){
 .....
 login logic
 .....
 UserLogonEvent event = new UserLogonEvent();
 event.setUserId(userid)
 appliactionContext.publish(event) 
}

```

登录后，缓存权限

```
@Autowired
CacheManager cacheManager；
@EventListener
@Async
public void cacheUserPermission(UserLogonEvent event) {
	Cache cache=.getCache("customRealm.authorizationCache")；
	cache.put(event.getUserid(), getUserRolePermissionFromDB())
```

前端请求到后面统统去缓存查权限；


---

ref:

[Shiro 免密登录](https://my.oschina.net/u/2419190/blog/1560577)