## 原理

你的一些DNS记录（主要是CNAME）被你开启了zone delegation：

https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc771640(v=ws.11)?redirectedfrom=MSDN

**出现的场景**

假设你为一个全球企业工作，example.com 是其主域名。因为是21世纪，所以一个重要的任务就是创建和维护在线电商平台。

有很多流行的e-commence云供应商 (e.g. Shopify, BigCommerce, Magento, Yokart, Big Kartel)，所以你也是采用了某家的服务，在上面设立了网店. 当年创建和配置好后,e-commerce供应商会分配给你类似这个域名给你的网店:

exampleshop.someecommerceplatform.com

在分享和推广该域名的时候,这个看起来并不太好,所以你想要它展示你自己的品牌,比如

shop.example.com

想要达到这个目的,你有两种配置方式:

1.  301/302 http 跳转可以帮客户从shop.example.com跳转到exampleshop.someecommerceplatform.com .这个方法不太有吸引力,因为会彻底替换掉用户浏览器导航的url地址
2. 配置一个CNAME DNS记录，将DNS解析直接委托给e-commerce供应商，这种方式下，地址栏的url不会改变（当然不是所有供应商都提供这个cname方法）

既然CNAME方式比较好一些，所以你可能就选择了这种方式

快进到一年以后，贵公司的e-commerce成果惨不忍睹，业绩未达标。运营主管指示你将e-commerce站点下线进行整顿。

为了节省资金，你取消了公司订阅的第三方e-commerce平台提供商。所以现在就产生了潜在的子域名接管风险：你很容易忘记去更新或删除掉DNS zone文件中的CNAME记录。

底线是，如果你不删除掉CNAME记录，任何人都去你之前那家e-ecommerce供应商上注册一个店铺，然后接管你的 shop.example.com。

这种场景可能对你来说是未曾听说过的,实际上,子域名接管确实是刚刚出现不久的威胁, 川普的某网站被黑就是一个例子:

http://www.networkworld.com/article/3171732/security/iraqi-hacker-took-credit-for-hijacking-subdomain-and-defacing-trump-site.html



当然这个威胁并不限于e-commerce供应商,还包括很多大型云商产业.

很多CNAME记录都是指向Amazon AWS或Microsoft Azure。当达到某些特定条件，子域名接管是很容易的。



举例Amazon Cloudfront：

https://aws.amazon.com/cloudfront/

这个是CDN服务，主要是为了分发托管在Amazon Cloudfront Edge服务器上的静态文件：

https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html

创建一个新的distribution后，AWS会生成一个随机的域名，如：

d2erlblaho6777.cloudfront.net 

你可以通过该域名访问你分发的文件，随机生成的子域名可能看起来是很好的针对子域名接管的防御，但实际上，对于CloudFront确并非如此。

问题在于，这并非是1对1的匹配，对于每一个distribution并非都有独立的IPV4地址。CloudFront使用m:n匹配，这意味着这些域名实际上是匹配到更小的CloudFront Edge servers集合上(想一下A记录)，所以这实际上就是一种virtual hosting，CloudFront内部使用一种mapping table来将上面的distribution 域名匹配实际的distribution 内容。如果你很熟悉virtual hosting，你可以说CNAME记录不是那么直接的，web服务器使用HTTP Host header字段来决定它需要服务那个域名。如果你想要使用 

static.example.com

作为子域名替换上面的自动分配的子域名，需要配置一个CNAME记录指向自动分配的域名：

```
static.example.com.    600  IN  CNAME  d2erlblaho6777.cloudfront.net.
```

但是，如果你直接使用

static.example.com

CloudFront服务器会在HTTP Host header看到它，所以CloudFront不能将其跟服务器上任何distribution匹配起来，因为这个域名并不在CloudFront内部的mapping table中！这就是为啥CloudFront需要你提供CNAME记录：

如果关联这个CNAME的distribution删除了，攻击者可以很简单的通过生成一个新的distribution，设置CNAME，CloudFront的匹配规则会帮攻击者做剩下的事情。





## 升级/风险

子域名接管被认为是高级别的安全威胁，归结为被怀有恶意的他人注册域名并企图控制一个或多个子域名。这呈现出一个有意思的攻击向量，甚至会导致一些其他高级别的安全风险，比如在Arne Swinnen的bug bounty report中解释的认证绕过：

https://hackerone.com/reports/172137



## 案例

\+ Subdomain takeover report for vince.co

http://hackerone.com/reports/32825

\+ Subdomain takeover report for greenhouse.io

https://hackerone.com/reports/38007

\+ Subdomain takeover report for uber.com

https://hackerone.com/reports/175070



子域名接管-案例 USA.gov https://blog.sweepatic.com/usa-secured-by-sweepatic/

子域名接管-案例 通过recon接管Facebook的子域名 https://sudhanshur705.medium.com/how-recon-helped-me-to-to-find-a-facebook-domain-takeover-58163de0e7d5

## 防御

企业通常在日常工作中不会审计他们的DNS配置，实际上，企业也缺乏标准的流程去添加、更改或移除他们DNS zone file的设置。甚至记录DNS记录变化都不常实施。所以你知道这里有多少空间需要改进了。

预防子域名接管的第一步就是妥善的监控和分析DNS记录，其中很重要的就是开展 subdomain enumeration

建立并维护你的动态digital footprint包括所有dns配置改动是预防此类问题的核心。

## POC

github上面有不少工具提供子域名接管验证：

\+ aquatone：https://github.com/michenriksen/aquatone

\+ SubOver：https://github.com/Ice3man543/SubOver

\+ subjack：https://github.com/haccer/subjack



虽然这些工具提供了关于子域名接管很好的启发，由于很多不同云商的限制，经常还是会出现false positive的结果，下面会给每个domain都提供一个手工的验证脚本，不同类型域名的命名规范如下：

```
sub.example.com.    600  IN  CNAME  anotherdomain.com.
```

sub.example.com.叫做source domain name，anotherdomain.com.叫做canonical domain name



### Amazon S3

Amazon S3 是一个基于桶子概念的存储服务，桶子是存储的逻辑单元，当你创建了桶子之后，一个独立的子域名就会为其产生，是不是听起来很熟悉？

Amazon S3 遵循基本上跟CloudFront的virtual hosting一样的概念，你可以读一下S3的 virtual hosting：

https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html

这里我只想指出一点，S3桶子也许可以配置为网站托管服务来托管静态内容，如果canonical domain名字里含有网站，S3桶子就是作为网站托管服务。我怀疑非网站和网站配置的桶子是被不同的load balancer来handle处理的，所以他们不可以互相替换，唯一的不同是在桶子创建的时候，如有必要需要设置正确的网站标志。

验证方法：

CNAME记录需要类似：`sub.example.com  60  IN   CNAME sub.example.s3.amazonaws.net`

我使用如下正则表达式来测试正确的canonical name：

```

# {bucketname}.s3.amazonaws.com
^[a-z0-9\.\-]{0,63}\.?s3.amazonaws\.com$

# {bucketname}.s3-website(.|-){region}.amazonaws.com (+ possible China region)
^[a-z0-9\.\-]{3,63}\.s3-website[\.-](eu|ap|us|ca|sa|cn)-\w{2,14}-\d{1,2}\.amazonaws.com(\.cn)?$

# {bucketname}.s3(.|-){region}.amazonaws.com
^[a-z0-9\.\-]{3,63}\.s3[\.-](eu|ap|us|ca|sa)-\w{2,14}-\d{1,2}\.amazonaws.com$

# {bucketname}.s3.dualstack.{region}.amazonaws.com
^[a-z0-9\.\-]{3,63}\.s3.dualstack\.(eu|ap|us|ca|sa)-\w{2,14}-\d{1,2}\.amazonaws.com$
```

验证子域名接管是否存在，使用httpie执行：

```
http -b GET http://{SOURCE DOMAIN NAME} | grep -E -q '<Code>NoSuchBucket</Code>|<li>Code: NoSuchBucket</li>' && echo "Subdomain takeover may be possible" || echo "Subdomain takeover is not possible"
```

开始接管：

（首先你要注册一个AWS账号）

```

1. 进入S3面板 https://s3.console.aws.amazon.com/s3/
2. 点击创建桶子
3. 设置桶子名字为你准备接管的目标域名
4. 多次的点击 Next 直到结束
5. 打开创建好的桶子
6. 点击是上传
7. 选择POC文件（html或txt都行），建议不要用index.html命名，可以使用不带后缀的poc
8. 在Permissions页签下选择 Grant public read access to this object(s)
9. 上传之后，选择该文件并且点击More，选择 Change metadata
10. 点击 Add metadata，选择反应该文件类型的 Content-type和value，比如如果是HTML，选择 text/html，等等。
11. (Optional) 如果桶子配置为站点
1）切换到 Properties tab
2）点击 Static website hosting
3）选择 Use this bucket to host a website
4）作为索引，选择你所上传的文件
5）点击保存
```

如果没有任何错误，恭喜，接管成功！如果你上传的是poc，那么访问链接为

http://sub.example.com/poc



### GitHub Pages

GitHub通过GitHub Pages提供免费的托管服务，这种网站一般是作为项目文档，技术博客或开源项目的一些支持网页。除了默认的×.github.io子域名，GitHub页面支持自定义域名。

验证方法：

CNAME记录需要类似：`sub.example.com  60  IN   CNAME subexamplecom.github.io`

我使用如下正则表达式来测试正确的canonical name：

`^[a-z0-9\.\-]{0,70}\.?github\.io$`

验证子域名接管是否存在，使用httpie执行：

```

http -b GET http://{SOURCE DOMAIN NAME} | grep -F -q "<strong>There isn't a GitHub Pages site here.</strong>" && echo "Subdomain takeover may be possible" || echo "Subdomain takeover is not possible"
```

开始接管：

（首先你要注册一个GitHub账号）

```

1. 进入创建repository页面
2. 设置Repository名字为canonical域名（如 {something}.github.io）
3. 点击创建repository
4. 将内容通过git推送到这个repo
5. 切换到 Settings页签
6. 在GitHub Pages 部分选择master分支作为source
7. 保存
8. 设置自定义域名Custom domain为要接管的域名
9. 保存
```

### Heroku

Heroku 是流行的PasS平台及服务供应商，其有类似其他云商的virtual hosting 概念：不同的 *.herokudns.com 子域名对应着相同的 A 记录集合。跟其他供应商一样，HTTP Host对正确的域名解析domain resolution很重要，还有一种方法是上传自定义域名的certificate（Github Pages不支持，所以你不能使用自定义域名的HTTPS）

验证方法：

CNAME记录需要类似：`sub.example.com  60  IN   CNAME subexamplecom.herokudns.com`

我使用如下正则表达式来测试正确的canonical name：

`^[a-z0-9\.\-]{2,70}\.herokudns\.com$`

验证子域名接管是否存在，使用httpie执行：

`http -b GET http://{SOURCE DOMAIN NAME} | grep -F -q "//www.herokucdn.com/error-pages/no-such-app.html" && echo "Subdomain takeover may be possible" || echo "Subdomain takeover is not possible"`

开始接管：

（首先你要注册一个Heroku 账号）

```

1. 打开新建 Heroku app.
2. 选择name 和 region (对接管无影响).
3. 通过git推送POC应用到 Heroku，Deploy 页签有介绍步骤

4. 切换到Settings页面
5. 滚动到 Domains and certificates
6. 点击 Add domain
7. 提供你要接管的域名，点击保存，生效需要一些时间
```

### Readme.io

Readme.io 是个托管文档的服务，当然跟前面一样，他们也允许custom domain。

验证方法：

CNAME记录需要类似：`sub.example.com  60  IN   CNAME subexamplecom.readme.io`

我使用如下正则表达式来测试正确的canonical name：`^[a-z0-9\.\-]{2,70}\.readme\.io$`

验证子域名接管是否存在，使用httpie执行：

```
http -b GET http://{SOURCE DOMAIN NAME} | grep -F -q "Project doesnt exist... yet!" && echo "Subdomain takeover may be possible" || echo "Subdomain takeover is not possible"
```

开始接管：

（首先你要注册一个Readme.io账号）

```

1. 进入dashboard.
2. 设置项目名字和子域名，这里的子域名不需要跟你要接管的域名一致
3. 在左侧边栏，选择General Settings -> Custom Domain，这里设置为你要接管的子域名

4. 保存
```

