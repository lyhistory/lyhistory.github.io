druid

spring boot druid starter: druid-spring-boot-starter

如果直接使用druid是不会自动装配的，要自己写好配置类

```

@Configuration
public class DruidConfig {

    /*
       将自定义的 Druid数据源添加到容器中，不再让 Spring Boot 自动创建
       绑定全局配置文件中的 druid 数据源属性到 com.alibaba.druid.pool.DruidDataSource从而让它们生效
       @ConfigurationProperties(prefix = "spring.datasource")：作用就是将 全局配置文件中
       前缀为 spring.datasource的属性值注入到 com.alibaba.druid.pool.DruidDataSource 的同名参数中
     */
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druidDataSource() {
        return new DruidDataSource();
    }

}


spring.datasource.url=jdbc:mysql://XXXXX:3306/clear?useCursorFetch=true&defaultFetchSize=100&rewriteBatchedStatements=true&useServerPrepStmts=false&cachePrepStmts=true&useCompression=true&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&connectionCollation=utf8_general_ci&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.username=test_dbuser
spring.datasource.password=PASSWORD
spring.datasource.initialSize=10
spring.datasource.minIdle=100
spring.datasource.maxActive=500
spring.datasource.maxWait=60000
spring.datasource.timeBetweenEvictionRunsMillis=60000
spring.datasource.minEvictableIdleTimeMillis=300000
spring.datasource.maxPoolPreparedStatementPerConnectionSize=500

OR

@ConfigurationProperties(prefix = "spring.datasource.druid")
public class DruidProperties {
    private int initialSize = 0;
    private int maxActive = 8;
    private int minIdle = 0;
    private long maxWait = -1;
    private long timeBetweenEvictionRunsMillis = 60 * 1000L;
    private long minEvictableIdleTimeMillis = 1000L * 60L * 30L;
    private long maxEvictableIdleTimeMillis = 1000L * 60L * 60L * 7;
    private String validationQuery;
    private int validationQueryTimeout = -1;
    private boolean testOnBorrow = false;
    private boolean testOnReturn = false;
    private boolean testWhileIdle = true;
    private boolean poolPreparedStatements = false;
    private int maxOpenPreparedStatements = -1;
    private boolean sharePreparedStatements = false;
    private Properties connectionProperties;
    private String filters = "stat,wall";
    private int maxPoolPreparedStatementPerConnectionSize = 20;
    private boolean  useGlobalDataSourceStat = true;
    .....
 }
 spring:
  ##Druid DataSource数据库访问配置
  datasource:
    is-dynamic-datasource: true
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://XXXXX/?characterEncoding=utf-8&autoReconnect=true&useSSL=false&serverTimezone=UTC
    username: test_dbuser
    password: PASSWORD
    driver-class-name: com.mysql.cj.jdbc.Driver
    druid:
      #连接池配置
      #初始化时建立物理连接的个数
      initialSize: 1
      #最小连接池数量
      minIdle: 0
      #最大连接池数量
      maxActive: 5
      #获取连接时最大等待时间，单位毫秒。配置了maxWait之后，缺省启用公平锁，并发效率会有所下降，
      #如果需要可以通过配置useUnfairLock属性为true使用非公平锁。
      maxWait: 60000
      #配置相隔多久进行一次检测(检测可以关闭的空闲连接),此处设置为1分钟检测一次。
      timeBetweenEvictionRunsMillis: 60000
      #一个连接在池中最小生存的时间(ms),此处设置为半小时。
      minEvictableIdleTimeMillis: 1800000
      #一个连接在池中最大生存的时间(ms),此处设置为7天。
      maxEvictableIdleTimeMillis: 25200000
      #用来检测连接是否有效的sql; 如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会启作用。
      validationQuery: SELECT 1 FROM DUAL
      #检测连接是否有效的超时时间,默认-1(单位:秒).
      validationQueryTimeout: 5
      #建议配置为true，不影响性能，并且保证安全性，申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，
      #执行validationQuery检测连接是否有效。
      testWhileIdle: true
      #申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。
      testOnBorrow: false
      #归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能
      testOnReturn: false
      #是否缓存preparedStatement，也就是PSCache;PSCache对支持游标的数据库性能提升巨大，比如说oracle;
      #在mysql5.5以下的版本中没有PSCache功能，建议关闭掉。
      poolPreparedStatements: true
      #打开PSCache，并且指定每个连接上PSCache的大小
      maxPoolPreparedStatementPerConnectionSize: 20
      sharePreparedStatements: false
      # 通过connectProperties属性来打开mergeSql功能；慢SQL记录
      #connectionProperties: druid.stat.mergeSql=true;druid.stat.logSlowSql=true;druid.stat.slowSqlMillis=5000
      # 配置监控统计拦截的filters，去掉后监控界面sql无法统计，'wall'用于防火墙
      filters: stat,wall,log4j2
      #要启用PSCache，必须配置大于0，当大于0时，poolPreparedStatements自动触发修改为true。
      #在Druid中，不会存在Oracle下PSCache占用内存过多的问题，可以把这个数值配置大一些，比如说100
      #此处默认为-1
      maxOpenPreparedStatements: 10
      #合并多个DruidDataSource的监控数据
      useGlobalDataSourceStat: true
```



https://segmentfault.com/a/1190000039005979