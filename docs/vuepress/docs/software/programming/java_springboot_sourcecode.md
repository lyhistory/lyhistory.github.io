---
sidebar: auto
footer: MIT Licensed | Copyright © 2018-LIU YUE

---

[回目录](/docs/software)  《spring boot 源码解析》

## keyword:

BeanDefinition配置信息

=》BeanDefinitionReader=>BeanDefinition

=>BeanFactoryPostProcessor

=>BeanFactory：反射实例化 Construction ctor=Class.getConstruction(); TestObj obj=ctor.newInstance();

=>BeanPostProcessor

=>初始化 设置属性，解决依赖



org.springframework.beans.factory.support.DefaultListableBeanFactory

/** Map of bean definition objects, keyed by bean name */
	private final Map<String, BeanDefinition> beanDefinitionMap

/** Map from dependency type to corresponding autowired value */

resolvableDependencies



容器：

GenericApplicationContext extends AbstractApplicationContext 

getEnvironment 环境参数 配置文件信息
getBeanFactory  beansMap



工厂：

DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory(<<DefaultSingletonBeanRegistry)

implements ConfigurableListableBeanFactory




整理思路：

初始化上下文和工厂，

读取配置文件信息，放入

读取bean信息，实例化bean，初始化bean，设置bean属性包括其依赖的自动装配；



starter

```
@SpringBootApplication(scanBasePackages = { "com.lyhistory.mybatis.springboot.mybatis_starter"})
public class StarterMain {
	public static void main(String[] args) {
		SpringApplication.run(StarterMain.class, args);
	}
}
```

## 调用SpringApp构造方法

PrimarySource: StarterMain.class

```java
public SpringApplication(Class<?>... primarySources) {
    this(null, primarySources);
}
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    setInitializers((Collection) getSpringFactoriesInstances(
        ApplicationContextInitializer.class));
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

### spring.fatories=>ApplicationContextInitializer

首先重要的一步是加载配置信息： org.springframework.context.ApplicationContextInitializer

```
setInitializers((Collection) getSpringFactoriesInstances(
				ApplicationContextInitializer.class));
```

层层调用

```
Set<String> names = new LinkedHashSet<>(
				SpringFactoriesLoader.loadFactoryNames(type, classLoader));
```

这个SpringFactoriesLoader.loadFactoryNames方法很重要，后面还会出现，都是从META-INF/spring.factories里面加载信息！

比如后面AutoConfigurationImportSelector就会读取EnableAutoConfiguration

### deduceMainApplicationClass

通过main方法判断主程序



## 调用run方法

```java
public ConfigurableApplicationContext run(String... args) {
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
    configureHeadlessProperty();
    SpringApplicationRunListeners listeners = getRunListeners(args);
    listeners.starting();
    try {
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(
            args);
        ConfigurableEnvironment environment = prepareEnvironment(listeners,
                                                                 applicationArguments);
        configureIgnoreBeanInfo(environment);
        Banner printedBanner = printBanner(environment);
        context = createApplicationContext();
        exceptionReporters = getSpringFactoriesInstances(
            SpringBootExceptionReporter.class,
            new Class[] { ConfigurableApplicationContext.class }, context);
        prepareContext(context, environment, listeners, applicationArguments,
                       printedBanner);
        refreshContext(context);
        afterRefresh(context, applicationArguments);
        stopWatch.stop();
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass)
                .logStarted(getApplicationLog(), stopWatch);
        }
        listeners.started(context);
        callRunners(context, applicationArguments);
    }
    catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, listeners);
        throw new IllegalStateException(ex);
    }

    try {
        listeners.running(context);
    }
    catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, null);
        throw new IllegalStateException(ex);
    }
    return context;
}

```

两个东西比较重要ConfigurableApplicationContext和	SpringApplicationRunListeners

### prepareEnvironment

发布事件publish EVENT: ApplicationEnvironmentPreparedEvent

EnvironmentPostProcessor

接收事件org.springframework.boot.context.config.ConfigFileApplicationListener: onApplicationEvent

```java
for (EnvironmentPostProcessor postProcessor : postProcessors) {
    postProcessor.postProcessEnvironment(event.getEnvironment(),
                                         event.getSpringApplication());
}
```

调用所有实现了org.springframework.boot.env.EnvironmentPostProcessor接口的postProcessEnvironment方法

主要是往env.getPropertySources()塞数据

后面还有个地方会往enve的这个propertySources塞数据，就是ConfigurationClassParser.doProcessConfigurationClass的“第一步”

### createApplicationContext

(ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass)

contextClass是org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext

最终调用org.springframework.boot.web.servlet.context.AnnotationConfigUtils的registerAnnotationConfigProcessors方法，注册一堆初始的beanDefinition到this.beanFactory.registerBeanDefinition

CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME=org.springframework.context.annotation.internalConfigurationAnnotationProcessor

AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME=org.springframework.context.annotation.internalAutowiredAnnotationProcessor

REQUIRED_ANNOTATION_PROCESSOR_BEAN_NAME=org.springframework.context.annotation.internalRequiredAnnotationProcessor

COMMON_ANNOTATION_PROCESSOR_BEAN_NAME=org.springframework.context.annotation.internalCommonAnnotationProcessor

EVENT_LISTENER_PROCESSOR_BEAN_NAME=org.springframework.context.event.internalEventListenerProcessor

EVENT_LISTENER_FACTORY_BEAN_NAME=org.springframework.context.event.internalEventListenerFactory

### prepareContext

将入口主类注册到beanFactory的beanDefinitionMap

// Load the sources

load(context, sources.toArray(new Object[0]));

org.springframework.boot.BeanDefinitionLoader

```java
if (source instanceof Class<?>) {
    return load((Class<?>) source);
}
=>
    if (isComponent(source)) {
        this.annotatedReader.register(source);
        return 1;
    }
```

org.springframework.context.annotation.AnnotatedBeanDefinitionReader:

register=>registerBean=>doRegisterBean

=>beanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, this.registry);

=> org.springframework.context.support.AnnotationConfigServletWebServerApplicationContext(GenericApplicationContext):

registerBeanDefinition=>this.beanFactory.registerBeanDefinition 跟前面一样！

到此为止将主类StarterMain加载到容器，可以在beanDefinitionMap中看到

### refreshContext 进入spring之refresh十三步

```java
private void refreshContext(ConfigurableApplicationContext context) {
	refresh(context);
	if (this.registerShutdownHook) {
		try {
			context.registerShutdownHook();
		}
		catch (AccessControlException ex) {
			// Not allowed in some environments.
		}
	}
}
protected void refresh(ApplicationContext applicationContext) {
	Assert.isInstanceOf(AbstractApplicationContext.class, applicationContext);
	((AbstractApplicationContext) applicationContext).refresh();
}
```

关键：((AbstractApplicationContext) applicationContext).refresh(); 注意下面调用super：从springboot进入到spring！！！ 

=>org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext  extends GenericWebApplicationContext
		implements ConfigurableWebServerApplicationContext 

```
@Override
public final void refresh() throws BeansException, IllegalStateException {
	try {
		super.refresh();
	}
	catch (RuntimeException ex) {
		stopAndReleaseWebServer();
		throw ex;
	}
}
```

进入了：

org.springframework.context.support.AbstractApplicationContext extends DefaultResourceLoader
		implements ConfigurableApplicationContext

```java
@Override
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // Prepare this context for refreshing.
        prepareRefresh();
        // Tell the subclass to refresh the internal bean factory.
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        // Prepare the bean factory for use in this context.
        prepareBeanFactory(beanFactory);
        try {
            // Allows post-processing of the bean factory in context subclasses.
            postProcessBeanFactory(beanFactory);

            // Invoke factory processors registered as beans in the context.
            invokeBeanFactoryPostProcessors(beanFactory);

            // Register bean processors that intercept bean creation.
            registerBeanPostProcessors(beanFactory);

            // Initialize message source for this context.
            initMessageSource();

            // Initialize event multicaster for this context.
            initApplicationEventMulticaster();

            // Initialize other special beans in specific context subclasses.
            onRefresh();

            // Check for listener beans and register them.
            registerListeners();

            // Instantiate all remaining (non-lazy-init) singletons.
            finishBeanFactoryInitialization(beanFactory);

            // Last step: publish corresponding event.
            finishRefresh();
        }

        catch (BeansException ex) {
        }

        finally {
            // Reset common introspection caches in Spring's core, since we
            // might not ever need metadata for singleton beans anymore...
            resetCommonCaches();
        }
    }
}
```

#### 第三步 prepareBeanFactory

将环境Environment和system相关的信息放入工厂的manualSingletonNames（local beans）

![](/docs/docs_image/software/java/spring/java_springboot_beanfactory01.png)

#### 第四步 postProcessBeanFactory

此时可以看一下现在beanFactory里面的beanDefinitionMap有什么

除了几个internal的Processor处理程序的bean和一个EventListener工厂的bean外，我们的主程序也作为bean存储其中；

![](/docs/docs_image/software/java/spring/java_springboot_beanfactory02.png)

看类型很明显，我们的主程序是Generic Bean类型，其他的都是Root Bean类型

beanDefinitionMap::

```java
{org.springframework.context.annotation.internalConfigurationAnnotationProcessor=Root bean: class [org.springframework.context.annotation.ConfigurationClassPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.event.internalEventListenerFactory=Root bean: class [org.springframework.context.event.DefaultEventListenerFactory];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.event.internalEventListenerProcessor=Root bean: class [org.springframework.context.event.EventListenerMethodProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.annotation.internalAutowiredAnnotationProcessor=Root bean: class [org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.annotation.internalCommonAnnotationProcessor=Root bean: class [org.springframework.context.annotation.CommonAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, starterMain=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null}
```

在进入下一步之前我们猜测，现在beanDefinitionMap还只有我们定义的一个主程序bean，接下来的思路应该是由主程序入手，递归出主程序扫描范围内的所有bean，如@Config，@Bean，@Controller，@Service，@Component等等，但是其他引入的starter中的bean呢，比如Mybatis的@Mapper，接下来我们看springboot读取这些bean信息的思路；

#### 第五步：invokeBeanFactoryPostProcessors:

```java
protected void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory) {
		PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(beanFactory, getBeanFactoryPostProcessors());

		// Detect a LoadTimeWeaver and prepare for weaving, if found in the meantime
		// (e.g. through an @Bean method registered by ConfigurationClassPostProcessor)
		if (beanFactory.getTempClassLoader() == null && beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
			beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
			beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
		}
	}
```

org.springframework.context.support.PostProcessorRegistrationDelegate

```java
public static void invokeBeanFactoryPostProcessors(
    ConfigurableListableBeanFactory beanFactory, List<BeanFactoryPostProcessor> beanFactoryPostProcessors) {
    
    for (BeanFactoryPostProcessor postProcessor : beanFactoryPostProcessors) {
        if (postProcessor instanceof BeanDefinitionRegistryPostProcessor) {
            BeanDefinitionRegistryPostProcessor registryProcessor =
                (BeanDefinitionRegistryPostProcessor) postProcessor;
            registryProcessor.postProcessBeanDefinitionRegistry(registry);
            registryProcessors.add(registryProcessor);
        }
        else {
            regularPostProcessors.add(postProcessor);
        }
    }

```

参数beanFactoryPostProcessors

[org.springframework.boot.context.ConfigurationWarningsApplicationContextInitializer$ConfigurationWarningsPostProcessor, org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer$CachingMetadataReaderFactoryPostProcessor, org.springframework.boot.context.config.ConfigFileApplicationListener$PropertySourceOrderingPostProcessor]

##### 首先registryProcessor.postProcessBeanDefinitionRegistry：

org.springframework.boot.autoconfigure.internalCachingMetadataReaderFactory

不重要

##### First: invokeBeanDefinitionRegistryPostProcessors

然后重要的来了：

```java
// First, invoke the BeanDefinitionRegistryPostProcessors that implement PriorityOrdered.
String[] postProcessorNames =
    beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
返回：[org.springframework.context.annotation.internalConfigurationAnnotationProcessor]，这就是前面prepare的
CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME=org.springframework.context.annotation.internalConfigurationAnnotationProcessor，参考AnnotationConfigUtils

接着就是根据这个internalConfigurationAnnotationProcessor从beanFactory中根据这个所谓的post processor name取出一个BeanDefinitionRegistryPostProcessor的实例，添加到当前的currentRegistryProcessors里面
for (String ppName : postProcessorNames) {
    if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
        currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
        processedBeans.add(ppName);
    }
}
sortPostProcessors(currentRegistryProcessors, beanFactory);
registryProcessors.addAll(currentRegistryProcessors);
//根据前面更新的currentRegistryProcessors，里面包含一个BeanDefinitionRegistryPostProcessor实例，调用该post processor
invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
//清空当前的currentRegistryProcessors
currentRegistryProcessors.clear();

```

下面开始分析 invokeBeanDefinitionRegistryPostProcessors调用过程

=>org.springframework.context.annotation.ConfigurationClassPostProcessor（这个名字比较明显Configuration相关）:

postProcessBeanDefinitionRegistry=>processConfigBeanDefinitions

```java
/**
	 * Build and validate a configuration model based on the registry of
	 * {@link Configuration} classes.
	 */
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {

    // Parse each @Configuration class
    ConfigurationClassParser parser = new ConfigurationClassParser(
        this.metadataReaderFactory, this.problemReporter, this.environment,
        this.resourceLoader, this.componentScanBeanNameGenerator, registry);

    Set<BeanDefinitionHolder> candidates = new LinkedHashSet<>(configCandidates);
    Set<ConfigurationClass> alreadyParsed = new HashSet<>(configCandidates.size());
    do {
        parser.parse(candidates);
        parser.validate();

        Set<ConfigurationClass> configClasses = new LinkedHashSet<>(parser.getConfigurationClasses());
        configClasses.removeAll(alreadyParsed);

        // Read the model and create bean definitions based on its content
        if (this.reader == null) {
            this.reader = new ConfigurationClassBeanDefinitionReader(
                registry, this.sourceExtractor, this.resourceLoader, this.environment,
                this.importBeanNameGenerator, parser.getImportRegistry());
        }
        this.reader.loadBeanDefinitions(configClasses);
        alreadyParsed.addAll(configClasses);

        candidates.clear();
        if (registry.getBeanDefinitionCount() > candidateNames.length) {
            String[] newCandidateNames = registry.getBeanDefinitionNames();
            Set<String> oldCandidateNames = new HashSet<>(Arrays.asList(candidateNames));
            Set<String> alreadyParsedClasses = new HashSet<>();
            for (ConfigurationClass configurationClass : alreadyParsed) {
                alreadyParsedClasses.add(configurationClass.getMetadata().getClassName());
            }
            for (String candidateName : newCandidateNames) {
                if (!oldCandidateNames.contains(candidateName)) {
                    BeanDefinition bd = registry.getBeanDefinition(candidateName);
                    if (ConfigurationClassUtils.checkConfigurationClassCandidate(bd, this.metadataReaderFactory) &&
                        !alreadyParsedClasses.contains(bd.getBeanClassName())) {
                        candidates.add(new BeanDefinitionHolder(bd, candidateName));
                    }
                }
            }
            candidateNames = newCandidateNames;
        }
    }
    while (!candidates.isEmpty());

    // Register the ImportRegistry as a bean in order to support ImportAware @Configuration classes
    if (sbr != null && !sbr.containsSingleton(IMPORT_REGISTRY_BEAN_NAME)) {
        sbr.registerSingleton(IMPORT_REGISTRY_BEAN_NAME, parser.getImportRegistry());
    }

    if (this.metadataReaderFactory instanceof CachingMetadataReaderFactory) {
        // Clear cache in externally provided MetadataReaderFactory; this is a no-op
        // for a shared cache since it'll be cleared by the ApplicationContext.
        ((CachingMetadataReaderFactory) this.metadataReaderFactory).clearCache();
    }
}

```

###### 1.首先是parser.parse过程

=>org.springframework.context.annotation.ConfigurationClassParser:

注意这个类有个很重要的成员变量：

private final Map<ConfigurationClass, ConfigurationClass> configurationClasses = new LinkedHashMap<>();

后面所有解析出来的Bean的beanname和完整包名都会放里面

parse()

```JAVA
public void parse(Set<BeanDefinitionHolder> configCandidates) {
    this.deferredImportSelectors = new LinkedList<>();

    for (BeanDefinitionHolder holder : configCandidates) {
        BeanDefinition bd = holder.getBeanDefinition();
        try {
            if (bd instanceof AnnotatedBeanDefinition) {
                parse(((AnnotatedBeanDefinition) bd).getMetadata(), holder.getBeanName());
            }
            else if (bd instanceof AbstractBeanDefinition && ((AbstractBeanDefinition) bd).hasBeanClass()) {
                parse(((AbstractBeanDefinition) bd).getBeanClass(), holder.getBeanName());
            }
            else {
                parse(bd.getBeanClassName(), holder.getBeanName());
            }
        }
        catch (BeanDefinitionStoreException ex) {
            throw ex;
        }
        catch (Throwable ex) {
            throw new BeanDefinitionStoreException(
                "Failed to parse configuration class [" + bd.getBeanClassName() + "]", ex);
        }
    }

    processDeferredImportSelectors();
}
```

上面方法分为两大步：



###### 第一步 parse 解析AnnotatedBeanDefinition



调用到doProcessConfigurationClass这里是重点：



从主类开始递归！

// Process any @PropertySource annotations

前面说了prepareEnvironment可以往env.propertySource加载配置信息，这里也有一个修改点！（但是我暂时不知道怎么用的）

// Process any @ComponentScan annotations

=>org.springframework.context.annotation.ComponentScanAnnotationParser: parse

=>org.springframework.context.annotation.ClassPathBeanDefinitionScanner:

doScan=>registerBeanDefinition=>BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, registry);=>org.springframework.beans.factory.support.DefaultListableBeanFactory: registerBeanDefinition

```
if(hasBeanCreationStarted()){
this.beanDefinitionMap.put(beanName, beanDefinition);
}
```



// Process any @Import annotations

// Process any @ImportResource annotations

// Process individual @Bean methods

上面的各个步骤里都会调用processConfigurationClass这个方法，这个方法最终是将bean的信息写入到前面说的重要的成员变量configurationClasses

这一步做完之后，正常推理configurationClasses应该扫描到了根据主类获取的各个自定义bean，验证一下

![](/docs/docs_image/software/java/spring/java_springboot_enableautoconfiguration01.png)

```
{ConfigurationClass: beanName 'myBatisConfiguration', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class]=ConfigurationClass: beanName 'myBatisConfiguration', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class],
 ConfigurationClass: beanName 'myBatisMapperScannerConfig', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class]=ConfigurationClass: beanName 'myBatisMapperScannerConfig', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class],
 ConfigurationClass: beanName 'testController', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestController.class]=ConfigurationClass: beanName 'testController', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestController.class],
 ConfigurationClass: beanName 'testService', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestService.class]=ConfigurationClass: beanName 'testService', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestService.class],
 ConfigurationClass: beanName 'starterMain', com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain=ConfigurationClass: beanName 'starterMain', com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain}
```



###### 第二步 processDeferredImportSelectors

```java
for (DeferredImportSelectorGrouping grouping : groupings.values()) {
    grouping.getImports().forEach(entry -> {
        ConfigurationClass configurationClass = configurationClasses.get(entry.getMetadata());
        try {
            processImports(configurationClass, asSourceClass(configurationClass),
                           asSourceClasses(entry.getImportClassName()), false);
        }
此处groupings只有一个：
{class org.springframework.boot.autoconfigure.AutoConfigurationImportSelector$AutoConfigurationGroup
    =
    org.springframework.context.annotation.ConfigurationClassParser$DeferredImportSelectorGrouping@22ebccb9}
```

所以通过grouping.getImports()

```java
/**
		 * Return the imports defined by the group.
		 * @return each import with its associated configuration class
		 */
public Iterable<Group.Entry> getImports() {
    for (DeferredImportSelectorHolder deferredImport : this.deferredImports) {
        this.group.process(deferredImport.getConfigurationClass().getMetadata(),
                           deferredImport.getImportSelector());
    }
    return this.group.selectImports();
}
```

org.springframework.boot.autoconfigure.AutoConfigurationImportSelector: 

process=>selectImports （这个是2.0旧版本，新版本2.1.4是 getAutoConfigurationEntry 不同版本）

先看下这个方法的最终返回值

![](/docs/docs_image/software/java/spring/java_springboot_enableautoconfiguration02.png)

```
[org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration
, org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration
, org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration
, org.springframework.boot.autoconfigure.context.MessageSourceAutoConfiguration
, org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration
, org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration
, org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration
, org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration
, org.springframework.boot.autoconfigure.info.ProjectInfoAutoConfiguration
, org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration
, org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
, org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration
, org.springframework.boot.autoconfigure.jdbc.JndiDataSourceAutoConfiguration
, org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration
, org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration
, org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration
, org.springframework.boot.autoconfigure.task.TaskSchedulingAutoConfiguration
, org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration
, org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration
, org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration
, org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration
, org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
, org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration
, org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration
, org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration]
```



=>总之都是会调用getCandidateConfigurations

````java
/**
	 * Return the auto-configuration class names that should be considered. By default
	 * this method will load candidates using {@link SpringFactoriesLoader} with
	 * {@link #getSpringFactoriesLoaderFactoryClass()}.
	 * @param metadata the source metadata
	 * @param attributes the {@link #getAttributes(AnnotationMetadata) annotation
	 * attributes}
	 * @return a list of candidate configurations
	 */
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata,
                                                  AnnotationAttributes attributes) {
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
        getSpringFactoriesLoaderFactoryClass(), getBeanClassLoader());
    Assert.notEmpty(configurations,
                    "No auto configuration classes found in META-INF/spring.factories. If you "
                    + "are using a custom packaging, make sure that file is correct.");
    return configurations;
}
protected Class<?> getSpringFactoriesLoaderFactoryClass() {
    return EnableAutoConfiguration.class;
}
````

终于藏不住了，看到了熟悉的SpringFactoriesLoader.loadFactoryNames，这里去加载所有META-INF/spring.factories里面的EnableAutoConfiguration

加载结果会排除重复和无效的以及排序后，如图：

![](/docs/docs_image/software/java/spring/java_springboot_enableautoconfiguration03.png)

可以看到顺序已经重排了！

到这里，grouping.getImports()就完成了，接下来就是foreach处理了

```java
grouping.getImports().forEach(entry -> {
    ConfigurationClass configurationClass = configurationClasses.get(entry.getMetadata());
    try {
        processImports(configurationClass, asSourceClass(configurationClass),
                       asSourceClasses(entry.getImportClassName()), false);
    }
```

下面拿Mybatis的例子来解析

=>processImports

```java
else {
    // Candidate class not an ImportSelector or ImportBeanDefinitionRegistrar ->
    // process it as an @Configuration class
    this.importStack.registerImport(
        currentSourceClass.getMetadata(), candidate.getMetadata().getClassName());
    processConfigurationClass(candidate.asConfigClass(configClass));
}
```



processConfigurationClass

=>shouldSkip：检查其依赖条件是否满足，比如mybatis DataSource依赖于两个条件

 @ConditionalOnProperty(
/*    */    prefix = "spring.datasource",
/*    */    name = {"is-dynamic-datasource"},
/*    */    havingValue = "true",
/*    */    matchIfMissing = false
/*    */ )
/*    */ @Conditional({cn.hutool.db.sql.Condition.class})

condition.matches(this.context, metadata)

=>org.springframework.boot.autoconfigure.condition.SpringBootCondition:matches

```ConditionOutcome outcome = getMatchOutcome(context, metadata);```

因为是两个条件，所以两个循环，第一次是

org.springframework.boot.autoconfigure.condition.OnPropertyCondition: getMatchOutcome

```java
@Override
public ConditionOutcome getMatchOutcome(ConditionContext context,
                                        AnnotatedTypeMetadata metadata) {
    List<AnnotationAttributes> allAnnotationAttributes = annotationAttributesFromMultiValueMap(
        metadata.getAllAnnotationAttributes(
            ConditionalOnProperty.class.getName()));
    List<ConditionMessage> noMatch = new ArrayList<>();
    List<ConditionMessage> match = new ArrayList<>();
    for (AnnotationAttributes annotationAttributes : allAnnotationAttributes) {
        ConditionOutcome outcome = determineOutcome(annotationAttributes,
                                                    context.getEnvironment());
        (outcome.isMatch() ? match : noMatch).add(outcome.getConditionMessage());
    }
    if (!noMatch.isEmpty()) {
        return ConditionOutcome.noMatch(ConditionMessage.of(noMatch));
    }
    return ConditionOutcome.match(ConditionMessage.of(match));
}
```

核心就是context.getEnvironment()，很清楚的从前面准备好的env propertySources中获取相关属性值，看是否有设置；

然后第二个cn.hutool.db.sql.Condition有点神奇，没有搞懂，直接是new ConditionOutcome(true, “启动动态数据源”)，满足返回；

总之，条件检测成功！

检查完后神奇的调用doProcessConfigurationClass，注意我们说第一步的parse就会调到这里，这次是解析EnableAutoConfiguration

，当然这里也没有什么好解析的

注意，我们前面说了doProcessConfigurationClass的各个步骤会调用rocessConfigurationClass这个方法，这个方法最终是将bean的信息写入到前面说的重要的成员变量configurationClasses

这步结束，再来看下configurationClasses的值，debug技巧就是在在parser.validate上面打断点，等parser.parse也就是上面的第一步和第二步全部结束

parser.parse(candidates);
parser.validate();

可以看到第一步和第二步的所有bean都已经在里面了



![](/docs/docs_image/software/java/spring/java_springboot_enableautoconfiguration04.png)

可以看到configClasses里面放满了

第一步从主类注解扫描到的所有@Controller @Service @Bean等以及springboot自带的一些内部bean，

+

第二步从每个springboot starter的META-INF/spring.fatories中加载的类信息，详细内容：

```
{ConfigurationClass: beanName 'myBatisConfiguration', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class]=ConfigurationClass: beanName 'myBatisConfiguration', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class]
, ConfigurationClass: beanName 'myBatisMapperScannerConfig', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class]=ConfigurationClass: beanName 'myBatisMapperScannerConfig', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class]
, ConfigurationClass: beanName 'testController', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestController.class]=ConfigurationClass: beanName 'testController', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestController.class]
, ConfigurationClass: beanName 'testService', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestService.class]=ConfigurationClass: beanName 'testService', class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/TestService.class]
, ConfigurationClass: beanName 'starterMain', com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain=ConfigurationClass: beanName 'starterMain', com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/context/PropertyPlaceholderAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/context/PropertyPlaceholderAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/websocket/servlet/WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/websocket/servlet/WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/websocket/servlet/WebSocketServletAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/websocket/servlet/WebSocketServletAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryConfiguration$EmbeddedTomcat.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryConfiguration$EmbeddedTomcat.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/task/TaskExecutionAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/task/TaskExecutionAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/validation/ValidationAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/validation/ValidationAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceConfiguration$Hikari.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceConfiguration$Hikari.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceJmxConfiguration$Hikari.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceJmxConfiguration$Hikari.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceJmxConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceJmxConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceAutoConfiguration$PooledDataSourceConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceAutoConfiguration$PooledDataSourceConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/metadata/DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/metadata/DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/metadata/DataSourcePoolMetadataProvidersConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/metadata/DataSourcePoolMetadataProvidersConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceInitializerInvoker.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceInitializerInvoker.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceInitializationConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceInitializationConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisLanguageDriverAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisLanguageDriverAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration$MapperScannerRegistrarNotFoundConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration$MapperScannerRegistrarNotFoundConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/admin/SpringApplicationAdminJmxAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/admin/SpringApplicationAdminJmxAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/GenericCacheConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/GenericCacheConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/SimpleCacheConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/SimpleCacheConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/NoOpCacheConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/NoOpCacheConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/CacheAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/cache/CacheAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/context/ConfigurationPropertiesAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/context/ConfigurationPropertiesAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/dao/PersistenceExceptionTranslationAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/dao/PersistenceExceptionTranslationAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$ParameterNamesModuleConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$ParameterNamesModuleConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/JacksonHttpMessageConvertersConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/JacksonHttpMessageConvertersConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$LoggingCodecConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$LoggingCodecConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$JacksonCodecConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$JacksonCodecConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/info/ProjectInfoAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/info/ProjectInfoAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/task/TaskSchedulingAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/task/TaskSchedulingAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceTransactionManagerAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceTransactionManagerAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$EnableTransactionManagementConfiguration$CglibAutoProxyConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$EnableTransactionManagementConfiguration$CglibAutoProxyConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$EnableTransactionManagementConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$EnableTransactionManagementConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$TransactionTemplateConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$TransactionTemplateConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/client/RestTemplateAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/client/RestTemplateAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/HttpEncodingAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/HttpEncodingAutoConfiguration.class]
, ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/MultipartAutoConfiguration.class]=ConfigurationClass: beanName 'null', class path resource [org/springframework/boot/autoconfigure/web/servlet/MultipartAutoConfiguration.class]}
```



到此处，再看看beanDefinitionMap，~~不出所料，依然不会变，因为前面只是初步解析准备工作，还没有开始读取beanDefinition~~

从主程序读取的bean Controller Service都已经在里面了，但是上面第二步拿到的那些Starter的AutoEnableConfiguration还没有进来，还需要继续

![](/docs/docs_image/software/java/spring/java_springboot_beanfactory03.png)

```
{myBatisMapperScannerConfig=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.MyBatisMapperScannerConfig];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\MyBatisMapperScannerConfig.class], org.springframework.context.annotation.internalConfigurationAnnotationProcessor=Root bean: class [org.springframework.context.annotation.ConfigurationClassPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.event.internalEventListenerFactory=Root bean: class [org.springframework.context.event.DefaultEventListenerFactory];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.event.internalEventListenerProcessor=Root bean: class [org.springframework.context.event.EventListenerMethodProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, testController=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.TestController];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\TestController.class], org.springframework.context.annotation.internalAutowiredAnnotationProcessor=Root bean: class [org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.internalCachingMetadataReaderFactory=Generic bean: class [org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer$SharedMetadataReaderFactoryBean];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.annotation.internalCommonAnnotationProcessor=Root bean: class [org.springframework.context.annotation.CommonAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, testService=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.TestService];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\TestService.class], starterMain=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, myBatisConfiguration=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.MyBatisConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\MyBatisConfiguration.class]}
```



###### 2.继续加载Starter的BeanDefinition

org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader: loadBeanDefinitions

```java
public void loadBeanDefinitions(Set<ConfigurationClass> configurationModel) {
    TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator();
    for (ConfigurationClass configClass : configurationModel) {
        loadBeanDefinitionsForConfigurationClass(configClass, trackedConditionEvaluator);
    }
}
```

这个地方有点意思，我们拿Mybatis举例，有两种不同的方式：

###### Mybatis 用法一，自定义@Bean(name = "MapperScannerConfigurer")

```

package com.lyhistory.mybatis.springboot.mybatis_starter;

@Configuration
@AutoConfigureAfter(MyBatisConfiguration.class)
public class MyBatisMapperScannerConfig {

	@Bean(name = "MapperScannerConfigurer")
	public MapperScannerConfigurer mapperScannerConfigurer() {
		MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
		mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
		mapperScannerConfigurer.setBasePackage("com.lyhistory.mybatis.springboot.mybatis_starter");
		return mapperScannerConfigurer;
	}
}
```



循环开始，前面的是主程序扫的bean，比如我自定义的com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class和com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class等等

MyBatisConfiguration的这些方法的@bean都加到beanDefinitionMap

```
loadBeanDefinitionsForBeanMethod(beanMethod);
```

```java
package com.lyhistory.mybatis.springboot.mybatis_starter;

@Configuration
public class MyBatisConfiguration { 
	@Value("${spring.datasource.driverClassName}")
    private String jdbcDriverClassName;
	
	@Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String jdbcUsername;

    @Value("${spring.datasource.password}")
    private String jdbcPassword;
    
	@Bean(name = "dataSource",destroyMethod = "close")
    public DataSource dataSource() {
    	DruidDataSource datasource = new DruidDataSource();
    	datasource.setDriverClassName(jdbcDriverClassName);
    	datasource.setUrl(jdbcUrl);
    	datasource.setUsername(jdbcUsername);
    	datasource.setPassword(jdbcPassword);
    	datasource.setMaxActive(20);
    	datasource.setMinIdle(5);
        return datasource;
    }
	
	@Bean(name = {"sqlSessionFactory"})
	@ConditionalOnMissingBean(name = {"sqlSessionFactory"})
	public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
			
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setTypeAliasesPackage("com.lyhistory.mybatis.table");
		sqlSessionFactoryBean.setConfigLocation(new ClassPathResource("mybatis/config/mybatis-config.xml"));
		sqlSessionFactoryBean.setMapperLocations(
				(new PathMatchingResourcePatternResolver()).getResources("classpath*:mybatis/mapping/*_starter.xml"));
		return sqlSessionFactoryBean.getObject();
	}
}


```

继续循环，还会处理一个比较特殊的bean，就是主程序！！

om.lyhistory.mybatis.springboot.mybatis_starter.StarterMain

注意，它会触发这个方法

```
loadBeanDefinitionsFromRegistrars(configClass.getImportBeanDefinitionRegistrars());
```

configClass.getImportBeanDefinitionRegistrars()：获取到

key=org.springframework.boot.autoconfigure.AutoConfigurationPackages$Registrar@10b9db7b

values=org.springframework.core.type.StandardAnnotationMetadata@2b62442c

```
private void loadBeanDefinitionsFromRegistrars(Map<ImportBeanDefinitionRegistrar, AnnotationMetadata> registrars) {
    registrars.forEach((registrar, metadata) ->
                       registrar.registerBeanDefinitions(metadata, this.registry));
}
```

这个registrar就是org.springframework.boot.autoconfigure.AutoConfigurationPackages，进入到其静态内部类Registrar的registerBeanDefinitions方法，最终往beanFactory里面的beanDefinitionMap注册org.springframework.boot.autoconfigure.AutoConfigurationPackages

。。。。

继续循环其他的starter注册的EnableAutoConfiguration的配置bean， 比如org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration.class

beanName=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

```
if (configClass.isImported()) {
			registerBeanDefinitionForImportedConfigurationClass(configClass);
            }
```

是经过前面parse的第二步从META-INF/spring.factories import进来的，还不在beanDefinitionMap中，所以需要往beanFactory注册一下，当然跟前面一样，其class内部的方法bean也需要注册，略过，重点说后面一步

```
loadBeanDefinitionsFromRegistrars(configClass.getImportBeanDefinitionRegistrars());
```

configClass.getImportBeanDefinitionRegistrars()：获取到：

key1:org.springframework.boot.context.properties.EnableConfigurationPropertiesImportSelector$ConfigurationPropertiesBeanRegistrar@1e63ec0b

value1:org.springframework.core.type.classreading.AnnotationMetadataReadingVisitor@160ac7fb, className=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

key2:org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessorRegistrar@3b956878

value2:org.springframework.core.type.classreading.AnnotationMetadataReadingVisitor@160ac7fb

org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

这种方式到这里不会发生什么



###### Mybatis 用法二：不自定义MapperScannerConfigurer

configClass.getImportBeanDefinitionRegistrars()：获取到：

key=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration$AutoConfiguredMapperScannerRegistrar@2b4d4327

values=org.springframework.core.type.classreading.AnnotationMetadataReadingVisitor@49232c6f

className=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration$MapperScannerRegistrarNotFoundConfiguration

可以看到这里有个MapperScannerRegistrarNotFoundConfiguration，这里没有自定义@Bean(name = "MapperScannerConfigurer")，所以就会用这个MapperScannerRegistrarNotFoundConfiguration来触发Mybatis的扫描工作 ，而前面第一种方式相当于将这里的Mybatis Auto Scanner覆写了，所以也很容易理解

至于为什么，可以研究一下前面第二步递归解析的时候调用的org.springframework.context.annotation.ConfigurationClass

初步猜测，springboot有地方可以让mybatis去检查是否主类或者其他包下定义了MapperScannerConfigurer这个bean，如果没有则启用MapperScannerRegistrarNotFoundConfiguration

```java
public void addImportBeanDefinitionRegistrar(ImportBeanDefinitionRegistrar registrar, AnnotationMetadata importingClassMetadata) {
    this.importBeanDefinitionRegistrars.put(registrar, importingClassMetadata);
}
```



接着说

```java
private void loadBeanDefinitionsFromRegistrars(Map<ImportBeanDefinitionRegistrar, AnnotationMetadata> registrars) {
    registrars.forEach((registrar, metadata) ->
                       registrar.registerBeanDefinitions(metadata, this.registry));
}
```

此处rigistrar就是加了@Configuration标注的org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

进入到MyBatis！可以看到Mybatis开始扫描Mapper

```java
@Override
public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

    logger.debug("Searching for mappers annotated with @Mapper");

    ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);

    try {
        if (this.resourceLoader != null) {
            scanner.setResourceLoader(this.resourceLoader);
        }

        List<String> packages = AutoConfigurationPackages.get(this.beanFactory);
        if (logger.isDebugEnabled()) {
            for (String pkg : packages) {
                logger.debug("Using auto-configuration base package '{}'", pkg);
            }
        }

        scanner.setAnnotationClass(Mapper.class);
        scanner.registerFilters();
        scanner.doScan(StringUtils.toStringArray(packages));
    } catch (IllegalStateException ex) {
        logger.debug("Could not determine auto-configuration package, automatic mapper scanning disabled.", ex);
    }
}
```

上面很明显，这种方式@Mapper会被立即扫描进来，

但是上面第一种方式结束后@Mapper不会被扫描进来，（第一种方式还需要后面的Finally那一步操作才可以扫描到！）

我这里只放了第一种方式的截图：

beanDefinitionMap，org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration也进来了

![](/docs/docs_image/software/java/spring/java_springboot_beanfactory04.png)

```
{defaultServletHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=defaultServletHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, applicationTaskExecutor=Root bean: class [null];
 scope=; abstract=false; lazyInit=true; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration; factoryMethodName=applicationTaskExecutor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/task/TaskExecutionAutoConfiguration.class], persistenceExceptionTranslationPostProcessor=Root bean: class [org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=persistenceExceptionTranslationPostProcessor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/dao/PersistenceExceptionTranslationAutoConfiguration.class], characterEncodingFilter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration; factoryMethodName=characterEncodingFilter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/HttpEncodingAutoConfiguration.class], myBatisMapperScannerConfig=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.MyBatisMapperScannerConfig];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\MyBatisMapperScannerConfig.class], org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, sqlSessionFactory=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=myBatisConfiguration; factoryMethodName=sqlSessionFactory; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class], preserveErrorControllerTargetClassPostProcessor=Root bean: class [org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=preserveErrorControllerTargetClassPostProcessor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class], org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, jdbcTemplate=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration; factoryMethodName=jdbcTemplate; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration.class], org.springframework.context.annotation.internalConfigurationAnnotationProcessor=Root bean: class [org.springframework.context.annotation.ConfigurationClassPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, propertySourcesPlaceholderConfigurer=Root bean: class [org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=propertySourcesPlaceholderConfigurer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/context/PropertyPlaceholderAutoConfiguration.class], org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$EnableTransactionManagementConfiguration$CglibAutoProxyConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$EnableTransactionManagementConfiguration$CglibAutoProxyConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, faviconRequestHandler=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration; factoryMethodName=faviconRequestHandler; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration.class], beanNameViewResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration; factoryMethodName=beanNameViewResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration.class], loggingCodecCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$LoggingCodecConfiguration; factoryMethodName=loggingCodecCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$LoggingCodecConfiguration.class], viewResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter; factoryMethodName=viewResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class], methodValidationPostProcessor=Root bean: class [org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=methodValidationPostProcessor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/validation/ValidationAutoConfiguration.class], stringHttpMessageConverter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration; factoryMethodName=stringHttpMessageConverter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration.class], org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, tomcatServletWebServerFactoryCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration; factoryMethodName=tomcatServletWebServerFactoryCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryAutoConfiguration.class], org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, server-org.springframework.boot.autoconfigure.web.ServerProperties=Generic bean: class [org.springframework.boot.autoconfigure.web.ServerProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, messageConverters=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration; factoryMethodName=messageConverters; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/http/HttpMessageConvertersAutoConfiguration.class], jsonComponentModule=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration; factoryMethodName=jsonComponentModule; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration.class], dataSourceInitializerPostProcessor=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, websocketServletWebServerCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration; factoryMethodName=websocketServletWebServerCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/websocket/servlet/WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration.class], org.springframework.context.event.internalEventListenerFactory=Root bean: class [org.springframework.context.event.DefaultEventListenerFactory];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mappingJackson2HttpMessageConverter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.http.JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration; factoryMethodName=mappingJackson2HttpMessageConverter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/http/JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration.class], mbeanExporter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration; factoryMethodName=mbeanExporter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.class], mbeanServer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration; factoryMethodName=mbeanServer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.class], servletWebServerFactoryCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration; factoryMethodName=servletWebServerFactoryCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryAutoConfiguration.class], mvcUrlPathHelper=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcUrlPathHelper; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], transactionTemplate=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$TransactionTemplateConfiguration; factoryMethodName=transactionTemplate; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration$TransactionTemplateConfiguration.class], webServerFactoryCustomizerBeanPostProcessor=Root bean: class [org.springframework.boot.web.server.WebServerFactoryCustomizerBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration=Generic bean: class [org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mybatis-org.mybatis.spring.boot.autoconfigure.MybatisProperties=Generic bean: class [org.mybatis.spring.boot.autoconfigure.MybatisProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration$StringHttpMessageConverterConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, standardJacksonObjectMapperBuilderCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration; factoryMethodName=standardJacksonObjectMapperBuilderCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$Jackson2ObjectMapperBuilderCustomizerConfiguration.class], taskSchedulerBuilder=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.task.TaskSchedulingAutoConfiguration; factoryMethodName=taskSchedulerBuilder; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/task/TaskSchedulingAutoConfiguration.class], org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, transactionInterceptor=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration; factoryMethodName=transactionInterceptor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, jacksonCodecCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$JacksonCodecConfiguration; factoryMethodName=jacksonCodecCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/http/codec/CodecsAutoConfiguration$JacksonCodecConfiguration.class], conventionErrorViewResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration; factoryMethodName=conventionErrorViewResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.event.internalEventListenerProcessor=Root bean: class [org.springframework.context.event.EventListenerMethodProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, spring.mvc-org.springframework.boot.autoconfigure.web.servlet.WebMvcProperties=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, localeCharsetMappingsCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration; factoryMethodName=localeCharsetMappingsCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/HttpEncodingAutoConfiguration.class], formContentFilter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration; factoryMethodName=formContentFilter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class], multipartConfigElement=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration; factoryMethodName=multipartConfigElement; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/MultipartAutoConfiguration.class], MapperScannerConfigurer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=myBatisMapperScannerConfig; factoryMethodName=mapperScannerConfigurer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisMapperScannerConfig.class], requestContextFilter=Root bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=requestContextFilter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class], testController=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.TestController];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\TestController.class], defaultViewResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter; factoryMethodName=defaultViewResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class], org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$EnableTransactionManagementConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$EnableTransactionManagementConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, jacksonObjectMapperBuilder=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration; factoryMethodName=jacksonObjectMapperBuilder; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperBuilderConfiguration.class], spring.task.scheduling-org.springframework.boot.autoconfigure.task.TaskSchedulingProperties=Generic bean: class [org.springframework.boot.autoconfigure.task.TaskSchedulingProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$LoggingCodecConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$LoggingCodecConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, restTemplateBuilder=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration; factoryMethodName=restTemplateBuilder; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/client/RestTemplateAutoConfiguration.class], multipartResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.MultipartAutoConfiguration; factoryMethodName=multipartResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/MultipartAutoConfiguration.class], requestMappingHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=requestMappingHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.springframework.aop.config.internalAutoProxyCreator=Root bean: class [org.springframework.aop.framework.autoproxy.InfrastructureAdvisorAutoProxyCreator];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$JdbcTemplateConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, requestMappingHandlerAdapter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=requestMappingHandlerAdapter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], spring.transaction-org.springframework.boot.autoconfigure.transaction.TransactionProperties=Generic bean: class [org.springframework.boot.autoconfigure.transaction.TransactionProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcHandlerMappingIntrospector=Root bean: class [null];
 scope=; abstract=false; lazyInit=true; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcHandlerMappingIntrospector; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], springApplicationAdminRegistrar=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration; factoryMethodName=springApplicationAdminRegistrar; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/admin/SpringApplicationAdminJmxAutoConfiguration.class], org.springframework.boot.autoconfigure.condition.BeanTypeRegistry=Generic bean: class [org.springframework.boot.autoconfigure.condition.BeanTypeRegistry];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, spring.info-org.springframework.boot.autoconfigure.info.ProjectInfoProperties=Generic bean: class [org.springframework.boot.autoconfigure.info.ProjectInfoProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.annotation.internalAutowiredAnnotationProcessor=Root bean: class [org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, spring.resources-org.springframework.boot.autoconfigure.web.ResourceProperties=Generic bean: class [org.springframework.boot.autoconfigure.web.ResourceProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.context.properties.ConfigurationBeanFactoryMetadata=Generic bean: class [org.springframework.boot.context.properties.ConfigurationBeanFactoryMetadata];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.internalCachingMetadataReaderFactory=Generic bean: class [org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer$SharedMetadataReaderFactoryBean];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$ParameterNamesModuleConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$ParameterNamesModuleConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcContentNegotiationManager=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcContentNegotiationManager; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], objectNamingStrategy=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration; factoryMethodName=objectNamingStrategy; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.class], org.springframework.boot.autoconfigure.task.TaskSchedulingAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.task.TaskSchedulingAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, errorAttributes=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration; factoryMethodName=errorAttributes; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class], httpRequestHandlerAdapter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=httpRequestHandlerAdapter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], beanNameHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=beanNameHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], spring.servlet.multipart-org.springframework.boot.autoconfigure.web.servlet.MultipartProperties=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.MultipartProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.info.ProjectInfoAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.info.ProjectInfoAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.context.annotation.internalCommonAnnotationProcessor=Root bean: class [org.springframework.context.annotation.CommonAnnotationBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryConfiguration$EmbeddedTomcat=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryConfiguration$EmbeddedTomcat];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, resourceHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=resourceHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], simpleControllerHandlerAdapter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=simpleControllerHandlerAdapter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], spring.http-org.springframework.boot.autoconfigure.http.HttpProperties=Generic bean: class [org.springframework.boot.autoconfigure.http.HttpProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration=Generic bean: class [org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, testService=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.TestService];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\TestService.class], org.springframework.transaction.config.internalTransactionAdvisor=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration; factoryMethodName=transactionAdvisor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class], parameterNamesModule=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$ParameterNamesModuleConfiguration; factoryMethodName=parameterNamesModule; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$ParameterNamesModuleConfiguration.class], org.springframework.boot.autoconfigure.jdbc.DataSourceInitializationConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceInitializationConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerInvoker=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerInvoker];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.client.RestTemplateAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, hiddenHttpMethodFilter=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration; factoryMethodName=hiddenHttpMethodFilter; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration.class], org.springframework.transaction.config.internalTransactionalEventListenerFactory=Root bean: class [org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=transactionalEventListenerFactory; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcValidator=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcValidator; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.websocket.servlet.WebSocketServletAutoConfiguration$TomcatWebSocketConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcResourceUrlProvider=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcResourceUrlProvider; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], spring.task.execution-org.springframework.boot.autoconfigure.task.TaskExecutionProperties=Generic bean: class [org.springframework.boot.autoconfigure.task.TaskExecutionProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, viewControllerHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=viewControllerHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, dispatcherServlet=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletConfiguration; factoryMethodName=dispatcherServlet; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletConfiguration.class], org.springframework.boot.autoconfigure.AutoConfigurationPackages=Generic bean: class [org.springframework.boot.autoconfigure.AutoConfigurationPackages$BasePackages];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessor=Generic bean: class [org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, hikariPoolDataSourceMetadataProvider=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration; factoryMethodName=hikariPoolDataSourceMetadataProvider; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jdbc/metadata/DataSourcePoolMetadataProvidersConfiguration$HikariPoolDataSourceMetadataProviderConfiguration.class], spring.jdbc-org.springframework.boot.autoconfigure.jdbc.JdbcProperties=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.JdbcProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, transactionAttributeSource=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.transaction.annotation.ProxyTransactionManagementConfiguration; factoryMethodName=transactionAttributeSource; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/transaction/annotation/ProxyTransactionManagementConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, transactionManager=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration; factoryMethodName=transactionManager; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jdbc/DataSourceTransactionManagerAutoConfiguration$DataSourceTransactionManagerConfiguration.class], errorPageRegistrarBeanPostProcessor=Root bean: class [org.springframework.boot.web.server.ErrorPageRegistrarBeanPostProcessor];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, errorPageCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration; factoryMethodName=errorPageCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class], mvcConversionService=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcConversionService; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$DefaultErrorViewResolverConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, starterMain=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.StarterMain];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, tomcatWebServerFactoryCustomizer=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration; factoryMethodName=tomcatWebServerFactoryCustomizer; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/embedded/EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration.class], faviconHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration; factoryMethodName=faviconHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter$FaviconConfiguration.class], org.springframework.boot.autoconfigure.http.JacksonHttpMessageConvertersConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.JacksonHttpMessageConvertersConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcPathMatcher=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcPathMatcher; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], handlerExceptionResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=handlerExceptionResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], basicErrorController=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration; factoryMethodName=basicErrorController; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration.class], org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, dispatcherServletRegistration=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration; factoryMethodName=dispatcherServletRegistration; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/DispatcherServletAutoConfiguration$DispatcherServletRegistrationConfiguration.class], dataSource=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=myBatisConfiguration; factoryMethodName=dataSource; initMethodName=null; destroyMethodName=close; defined in class path resource [com/lyhistory/mybatis/springboot/mybatis_starter/MyBatisConfiguration.class], org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$JacksonCodecConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.codec.CodecsAutoConfiguration$JacksonCodecConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, tomcatServletWebServerFactory=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryConfiguration$EmbeddedTomcat; factoryMethodName=tomcatServletWebServerFactory; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/ServletWebServerFactoryConfiguration$EmbeddedTomcat.class], org.springframework.boot.autoconfigure.http.JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.http.JacksonHttpMessageConvertersConfiguration$MappingJackson2HttpMessageConverterConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, spring.jackson-org.springframework.boot.autoconfigure.jackson.JacksonProperties=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, error=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration; factoryMethodName=defaultErrorView; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/error/ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration.class], org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, spring.datasource-org.springframework.boot.autoconfigure.jdbc.DataSourceProperties=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.DataSourceProperties];
 scope=; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, namedParameterJdbcTemplate=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration; factoryMethodName=namedParameterJdbcTemplate; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jdbc/JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration.class], org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration$WhitelabelErrorViewConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration$DispatcherServletConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$TransactionTemplateConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration$TransactionTemplateConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, mvcViewResolver=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcViewResolver; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], defaultValidator=Root bean: class [org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=null; factoryMethodName=defaultValidator; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/validation/ValidationAutoConfiguration.class], welcomePageHandlerMapping=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter; factoryMethodName=welcomePageHandlerMapping; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$WebMvcAutoConfigurationAdapter.class], mvcUriComponentsContributor=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration$EnableWebMvcConfiguration; factoryMethodName=mvcUriComponentsContributor; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/web/servlet/WebMvcAutoConfiguration$EnableWebMvcConfiguration.class], org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration=Generic bean: class [org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, jacksonObjectMapper=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=true; factoryBeanName=org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration$JacksonObjectMapperConfiguration; factoryMethodName=jacksonObjectMapper; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/jackson/JacksonAutoConfiguration$JacksonObjectMapperConfiguration.class], org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration=Generic bean: class [org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration$NamedParameterJdbcTemplateConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null, myBatisConfiguration=Generic bean: class [com.lyhistory.mybatis.springboot.mybatis_starter.MyBatisConfiguration];
 scope=singleton; abstract=false; lazyInit=false; autowireMode=0; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=null; factoryMethodName=null; initMethodName=null; destroyMethodName=null; defined in file [C:\Workspace\Repository\learn_coding\java\Components\mybatis-demo\hello-mybatis\target\classes\com\lyhistory\mybatis\springboot\mybatis_starter\MyBatisConfiguration.class], taskExecutorBuilder=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration; factoryMethodName=taskExecutorBuilder; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/task/TaskExecutionAutoConfiguration.class], platformTransactionManagerCustomizers=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration; factoryMethodName=platformTransactionManagerCustomizers; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/springframework/boot/autoconfigure/transaction/TransactionAutoConfiguration.class], sqlSessionTemplate=Root bean: class [null];
 scope=; abstract=false; lazyInit=false; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration; factoryMethodName=sqlSessionTemplate; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [org/mybatis/spring/boot/autoconfigure/MybatisAutoConfiguration.class]}
```



##### Next:

```java
// Next, invoke the BeanDefinitionRegistryPostProcessors that implement Ordered.
postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
for (String ppName : postProcessorNames) {
    if (!processedBeans.contains(ppName) && beanFactory.isTypeMatch(ppName, Ordered.class)) {
        currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
        processedBeans.add(ppName);
    }
}
sortPostProcessors(currentRegistryProcessors, beanFactory);
registryProcessors.addAll(currentRegistryProcessors);
invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
currentRegistryProcessors.clear();

```

此时，postProcessor有两个，多了一个MapperScannerConfigurer

[org.springframework.context.annotation.internalConfigurationAnnotationProcessor, MapperScannerConfigurer]

上面的if判断不会通过，因为internalConfigurationAnnotationProcessor已经在上面一步处理过了，所以包含在processedBeans里面，而MapperScannerConfigurer虽然没有处理过，但不是类型不符合Ordered

##### Finally

```java
// Finally, invoke all other BeanDefinitionRegistryPostProcessors until no further ones appear.
boolean reiterate = true;
while (reiterate) {
    reiterate = false;
    postProcessorNames = beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
    for (String ppName : postProcessorNames) {
        if (!processedBeans.contains(ppName)) {
            currentRegistryProcessors.add(beanFactory.getBean(ppName, BeanDefinitionRegistryPostProcessor.class));
            processedBeans.add(ppName);
            reiterate = true;
        }
    }
    sortPostProcessors(currentRegistryProcessors, beanFactory);
    registryProcessors.addAll(currentRegistryProcessors);
    invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
    currentRegistryProcessors.clear();
}
```

通过if判断，终于轮到MapperScannerConfigurer起作用了，首先beanFactory.getBean实例化MapperScannerConfigurer

开始invoke，

org.mybatis.spring.mapper.MapperScannerConfigurer mplements BeanDefinitionRegistryPostProcessor, InitializingBean, ApplicationContextAware, BeanNameAware {

```java
 @Override
  public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
    if (this.processPropertyPlaceHolders) {
      processPropertyPlaceHolders();
    }

    ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
    scanner.setAddToConfig(this.addToConfig);
    scanner.setAnnotationClass(this.annotationClass);
    scanner.setMarkerInterface(this.markerInterface);
    scanner.setSqlSessionFactory(this.sqlSessionFactory);
    scanner.setSqlSessionTemplate(this.sqlSessionTemplate);
    scanner.setSqlSessionFactoryBeanName(this.sqlSessionFactoryBeanName);
    scanner.setSqlSessionTemplateBeanName(this.sqlSessionTemplateBeanName);
    scanner.setResourceLoader(this.applicationContext);
    scanner.setBeanNameGenerator(this.nameGenerator);
    scanner.setMapperFactoryBeanClass(this.mapperFactoryBeanClass);
    if (StringUtils.hasText(lazyInitialization)) {
      scanner.setLazyInitialization(Boolean.valueOf(lazyInitialization));
    }
    scanner.registerFilters();
    scanner.scan(
        StringUtils.tokenizeToStringArray(this.basePackage, ConfigurableApplicationContext.CONFIG_LOCATION_DELIMITERS));
  }
```

终于将我们自定义的mybatis的@Mapper加载进来了

![](/docs/docs_image/software/java/spring/java_springboot_beanfactory05.png)



TODO:

#Next Last

实例化

org.springframework.beans.factory.support.AbstractBeanFactory

doGetBean

org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory

createBean

doCreateBean

populateBean()	开始找autowired dependencies

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor

postProcessPropertyValues

​	metadata.inject(bean, beanName, pvs);

org.springframework.beans.factory.annotation.InjectionMetadata

inject

​	element.inject(target, beanName, pvs);

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor

inject

​	beanFactory.resolveDependency(desc, beanName, autowiredBeanNames, typeConverter);

org.springframework.beans.factory.support.DefaultListableBeanFactory

resolveDependency

​	doResolveDependency(descriptor, requestingBeanName, autowiredBeanNames, typeConverter)



org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor

​	postProcessPropertyValues

​	inject



#### 第六步 registerBeanPostProcessors



#### 第十一步 finishBeanFactoryInitialization



#### 第十二步 finishRefresh



#### 第十三步 resetCommonCaches

​	

BeanFactory （固定模板）

VS

FactoryBean 生产唯一固定的复杂对象 （参考OpenFeign实现接口getobject getobjecttype isSingleton）





## More example

类似前面分析的mybatis，redis connector也有类似的，通过下面代码的注释，可以看到，类似mybatis的RegistrarNotFound，当我们没有自定义RedisConnectionFactory的时候，spring 会帮我们注册一个默认的即下面的LettuceConnectionFactory，严格说其实不是spring帮我们，而是 spring boot starter --- spring-boot-starter-data-redis，其制定的标准接口，默认选用Lettuce实现

```java

@Configuration
@ComponentScan("com.lyhistory.redis")
//@EnableRedisRepositories(basePackages = "com.lyhistory.redis.repo")
@PropertySource("classpath:application.properties")
public class RedisConfig {
    
    @Autowired
    private ClusterConfigurationProperties clusterProperties;
    
    @Bean
    RedisClusterConfiguration redisConfiguration() {
        RedisClusterConfiguration redisClusterConfiguration = new RedisClusterConfiguration(clusterProperties.getNodes());
        redisClusterConfiguration.setMaxRedirects(clusterProperties.getMaxRedirects());

        return redisClusterConfiguration;
    }
    /*
    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        return new JedisConnectionFactory();
    }
    */
   
    @Bean
    LettuceConnectionFactory redisConnectionFactory(RedisClusterConfiguration redisConfiguration) {

        GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
        poolConfig.setMaxIdle(-1);
        poolConfig.setMinIdle(10);
        poolConfig.setMaxWaitMillis(3000);
        poolConfig.setMaxTotal(200);

        LettucePoolingClientConfiguration lettucePoolingClientConfiguration = LettucePoolingClientConfiguration.builder()
                .commandTimeout(Duration.ofSeconds(10))
                .shutdownTimeout(Duration.ZERO)
                .poolConfig(poolConfig)
                .build();

        return new LettuceConnectionFactory(redisConfiguration, lettucePoolingClientConfiguration);
    }
    
    
    // 我对spring boot的启动过程run方法进行了debug
    // 执行完 AbstractApplicationContext.refresh() => finishBeanFactoryInitialization(beanFactory);
    // 查看 beanFactory.beanDefinitionMap，会看到
    // redisConnectionFactory=Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=redisConfig; factoryMethodName=redisConnectionFactory; initMethodName=null; destroyMethodName=(inferred); defined in class path resource [com/lyhistory/redis/RedisConfig.class
    // 可以明确的看到这个redisConnectionFactory也就是子类LettuceConnectionFactory 就是上面定义的bean，路径是我们自定义的该类 [com/lyhistory/redis/RedisConfig.class]
    //
    // 如果将前面的bean注释掉，再debug
    // 会看到
    // redisConnectionFactory=Root bean: class [null]; scope=; abstract=false; lazyInit=null; autowireMode=3; dependencyCheck=0; autowireCandidate=true; primary=false; factoryBeanName=org.springframework.boot.autoconfigure.data.redis.LettuceConnectionConfiguration; factoryMethodName=redisConnectionFactory; initMethodName=null; destroyMethodName=(inferred); 
    // 路径变成了 [org/springframework/boot/autoconfigure/data/redis/LettuceConnectionConfiguration.class],
    @Bean
    public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory connectionFactory){//(RedisConnectionFactory connectionFactory) {// LettuceConnectionFactory implements RedisConnectionFactory
        
        final RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer(Object.class);
        template.setValueSerializer(fastJsonRedisSerializer);
        //template.setValueSerializer(new GenericToStringSerializer<Object>(Object.class));
        return template;
    }
   
}
```

前面想复杂了，实际比较简单

在 spring-boot-autoconfigure的 org.springframework.boot.autoconfigure.data.redis; 看到很简单的 ConditionalOnMissingBean，

就是说当没有找到用户自定义的这些connectionFactory就会默认创建，可见，用户自定义的优先级肯定是比较高的，应该是在前面的程序启动过程中加载bean的时候优先加载的，而后才是加载第三方定义的这些默认的bean

```java
@Configuration
@ConditionalOnClass(RedisClient.class)
class LettuceConnectionConfiguration extends RedisConnectionConfiguration {
    。。。。。。。。。。。。。
@Bean
	@ConditionalOnMissingBean(RedisConnectionFactory.class)
	public LettuceConnectionFactory redisConnectionFactory(
			ClientResources clientResources) throws UnknownHostException {
		LettuceClientConfiguration clientConfig = getLettuceClientConfiguration(
				clientResources, this.properties.getLettuce().getPool());
		return createLettuceConnectionFactory(clientConfig);
	}

	private LettuceConnectionFactory createLettuceConnectionFactory(
			LettuceClientConfiguration clientConfiguration) {
		if (getSentinelConfig() != null) {
			return new LettuceConnectionFactory(getSentinelConfig(), clientConfiguration);
		}
		if (getClusterConfiguration() != null) {
			return new LettuceConnectionFactory(getClusterConfiguration(),
					clientConfiguration);
		}
		return new LettuceConnectionFactory(getStandaloneConfig(), clientConfiguration);
	}
    。。。。。。。。。。。。。
```

## performance

7min到40s：SpringBoot启动优化实践
https://juejin.cn/post/7181342523728592955

refer:
具体解析可以参考 https://www.javatt.com/p/19819

<disqus/>