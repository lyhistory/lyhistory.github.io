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

### refreshContext 进入spring

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

#### invokeBeanFactoryPostProcessors:

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



###### 2.然后是读取BeanDefinition

org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader: loadBeanDefinitions

```java
public void loadBeanDefinitions(Set<ConfigurationClass> configurationModel) {
    TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator();
    for (ConfigurationClass configClass : configurationModel) {
        loadBeanDefinitionsForConfigurationClass(configClass, trackedConditionEvaluator);
    }
}
```



比如beanName=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration

configClass.getImportBeanDefinitionRegistrars()：

key=org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration$AutoConfiguredMapperScannerRegistrar@2b4d4327

values=org.springframework.core.type.classreading.AnnotationMetadataReadingVisitor@49232c6f

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



TODO:

#Next Last

## 实例化

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

​	

BeanFactory （固定模板）

VS

FactoryBean 生产唯一固定的复杂对象 （参考OpenFeign实现接口getobject getobjecttype isSingleton）

