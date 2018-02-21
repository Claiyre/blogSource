---
title: 带你从Http转入Https的完整攻略（译）
date: 2017-08-24 17:00:38
tags: [Http, Https]
categories: HTTP 
---

>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>英文原文地址：
>如需转载，请在文章开头注明原文地址

现如今，由于隐私保护的原因，用户在网页上提供他们的个人信息时，往往会在网页上寻找有没有代表使用了Https协议的挂锁标志；Chrome和FireFox浏览器在没有使用Https提供表单的网页上明确标记了不安全标记，而这会影响到这个网页在搜索引擎上的优先级排序，通常也会对用户的隐私造成严重影响，这些都说明了Https是当下的必然趋势。此外，现在免费获取Https证书的方法多种多样，只要你愿意，把自己的网站转为使用Https就不是问题。

<!--more-->

对于没有经验的使用者来说，设置Https协议可能有点困难，它需要在不同的部分上完成许多步骤，也需要加密和服务器配置方面的专业知识，而且通常看起来十分复杂。
在这篇攻略中，我将讲解各个独立的部分和步骤，也将清楚地介绍配置Https的各个阶段。你应该会觉得这些不难，如果你的托管服务器提供商（hosting provider）也提供HTTPS证书，有可能你能轻松快速地在控制面板（control panel）上执行所有操作。
我已经在cPanel，Apache HTTP服务器的管理员（administrators），Linux和Unix上的Nginx以及Windows上的Internet Information Server中列出了共享托管计划的所有者的详细说明。
让我们先从基础知识开始吧！


## HTTP、HTTPS、HTTP/2、SSL、TLS：这些都是什么鬼？

标题中的首字母缩略词都是用于描述客户端和服务器之间的通信过程的，但这些往往被不熟悉内部知识的人搞混。
超文本传输协议（Hypertext Transfer Protocol，HTTP）是一种基本的通信协议，它要求客户端和服务器都必须实现才能在两者之间进行通信，它涵盖了请求、响应、会话、缓存、身份验证等等操作。HTTP协议和HTML（Hypertext Markup Language，超文本标记语言）是从1989年由Tim Berners-Lee及其在CERN的团队开始实现的。协议的第一个正式版本（HTTP 1.0）于1996年发布，不久之后又在1997年发布了目前广泛采用的版本（HTTP 1.1）。
协议以明文方式在浏览器和服务器之间传输信息，允许传输信息的网络查看传输的信息。这就带来了安全问题，也因此引入了HTTP Secure（HTTPS）协议，它允许客户端和服务器首先建立一个加密的通信信道，然后通过它传递明文HTTP消息，有效地保护他们免受窃听。
创建加密信道使用的协议是传输层安全协议（Transport Layer Security，TLS），以前叫做安全套接层（Secure Socket Layer ，SSL），SSL3.0就是被TLS1.0替代的，所以术语SSL和TLS通常可互换使用，它们的区别在于SSL是Netscape公司开发的协议，而TLS是IETF标准。在撰写本文时，所有版本的SSL（1.0,2.0,3.0）由于各种安全问题而被淘汰，并将在当前浏览器中产生警告，而TLS的三个版本（1.0,1.1,1.2）正在使用中，1.3还在草稿阶段。
因此，在1996、1997年左右，我们得到了目前互联网的稳定版本（HTTP 1.1，有或没有SSL和TLS），这仍然为今天的大多数网站提供着支持。以前，HTTP用于非敏感信息的传输（例如阅读新闻），而HTTPS用于敏感信息的传输（例如身份验证和电子商务）; 然而，对隐私的益发关注导致网络浏览器（如Google Chrome）现在将HTTP网站标记为“not private”，并将在未来对HTTP引入警告。
越来越多的网站正在采用的HTTP协议下一代版本HTTP/2增加了新功能（压缩，复用，优先级排序）以减少延迟并提高性能和安全性。
在HTTP版本1.1中，安全连接是可选项（这意味着HTTP和/或HTTPS是相互独立的），而在HTTP/2中它是强制性的。即使该标准并未在HTTP/2的定义中添加必须使用TLS，但大多数浏览器厂商还是表示他们只会用TLS实现对HTTP/2的支持。


## Https协议都提供了些什么？

一开始为什么要使用Https协议呢？主要是出于以下三个原因：
1. 保密性
这个协议保护了通信双方在互联网等公共传输环境下传输消息时不被其他方窃听。例如，不用HTTPS协议的话，Wi-Fi的主人可以在Wi-Fi的使用者在线购买时看到信用卡密码等私人信息。
2. 完整性
Https协议能确保信息完整不变地到达目的地。例如，我们的Wi-Fi使用者可以给我们阅读的网页添加额外的广告，也可以降低我们的图像的质量以节省带宽，或者是更改我们阅读的文章的内容，而HTTPS协议可确保网页无法被修改。
3. 身份验证
Https协议可以确保网站是从我们所期待的地方发来的。例如，当我们向服务器发送获取example.com网页的请求时，Wi-Fi的主人可以向浏览器返回一个假网页，而HTTPS协议可以确保example.com确实是网站example.com。一些证书甚至可以检查该网站运营者的法定身份，例如网站yourbank.com运营者是YourBank，Inc.

## 密码学基础简介

保密性，完整性和身份验证不是HTTPS的特定概念：它们是密码学的核心概念，我们再来深入了解一下。
### 保密性
保密性可以保护信息免受未经授权的第三方阅读，意味着对隐私信息的保护程度。该过程通常是将称为明文的信息的可读（或可听、可见）形式转换成有噪声干扰的，不可读的密文，这个过程称为加密。将不可读的密文转回可读明文的逆过程称为解密。有许多密码学函数（或算法）可用来加密和解密信息。
为了让双方能够沟通，他们应该就两件事情达成一致：
1、他们将使用哪种算法（密码函数）？
2、选定了算法后，他们将用什么作为这个算法的关键参数（例如密码、密钥）
有两种主要的加密方式：
1、对称加密算法
双方共享一个相同的不公开的密钥。
2、非对称加密算法
密钥分为私钥（不公开的）和公钥（公开的），私钥只有一方拥有。非对称加密算法是公钥基础设施（PKI）的基础。
对称加密算法需要双方都有一个共享的密钥，发送方用密钥将信息加密，而接收方用相同的方法和密钥进行解密还原得到信息（见下图）。这种算法的问题在于双方要想安全地传输信息，就必须先传输密钥，而密钥的安全传输无法通过将密钥加密来实现，就需要有一种新的安全传输方法。
![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxds00lbj30fe04x0t9.jpg)

非对称加密算法可以来解决这个问题-这种算法是基于公钥和私钥的，使用公钥进行加密，使用对应的私钥进行解密。
那么它是如何工作的呢？让我们假设有两方需要进行通信– Alice和Bob。他们都有一对钥匙：私钥和公钥。私钥只有他们各自的所有者才知道; 任何人都可以使用公钥。
如果Alice想向Bob发消息，她将获取Bob的公钥，用公钥加密明文后向他发送密文，然后Bob可以使用自己的私钥进行解密。
同样地，如果Bob想向Alice发消息，她将获取Alice的公钥，用公钥加密明文后向他发送密文，然后Alice可以使用自己的私钥进行解密。如下图所示

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxe7xoshj30fe06x0ub.jpg)

我们什么时候使用对称加密算法，什么时候使用非对称加密算法呢？非对称加密算法通常用于客户端和服务器之间交换密钥。在现实生活中一般不需要进行双向非对称通信-这是足够的，如果一方当事人（我们只是把它称为一个服务器，为简单起见）有密钥的集合，所以它可以接受的加密消息。它真正保护信息的安全性只有一个方向 - 从客户端到服务器，因为用公钥加密的信息只能使用私钥解密; 因此，只有服务器可以解密它。另一个方向不受保护 - 使用服务器的私钥加密的信息可以由任何人的公钥解密。
那一般什么时候使用对称加密算法，什么时候使用非对称加密算法呢？非对称加密算法通常用于客户端和服务器之间交换密钥。现实生活中一般不需要使用非对称加密算法进行
然后使用对称加密算法来保护通信中的实际数据，因为它比非对称加密快得多。双方（客户端和服务器）有了先前交换的密钥，就能够对信息进行加密和解密，而且只有他们能够进行。
这就是为什么握手的第一个非对称部分也被称为密钥交换，而实际通信中用于加密的算法才被真正称为加密算法。
### 完整性

HTTPS解决的另一个问题是数据的完整性：（1）信息是否全部成功获得，（2）是否被转接中的某人修改。为了确保信息完整成功传输，HTTPS使用了消息摘要算法。（译者注：这种算法基本思路是计算每条消息的消息认证码，如果传输后消息的消息认证码与传输前相同，则可认为消息在传输过程中没有被改变）。计算消息的消息认证码（MAC）是哈希算法，在获得消息认证码（可以理解为消息的标签）的过程中，哈希算法有以下几个重要特征：
1、更改消息一定会改变消息认证码
2、两个不同的消息一定会生成不同的标签
3、无法从消息认证码还原为消息本身。


### 身份验证

什么是身份验证？
公钥基础设施在现实中的应用存在一个问题：双方无法知道对方的真实身份—双方在物理上是分开的。为了证明另一方的身份，需要引入一个双方都信任的第三方:证书颁发机构（certificate authority，CA）。证书颁发机构负责颁发证书，证书包括以下内容：声明域名“example.com”（这个域名代表唯一标识符）与公钥“XXX”相关联；在某些情况下（例如，具有EV和OV证书—见下文），CA还将检查哪家公司控制该域名；此证书由哪家证书颁发机构认证；该认证有效时间区间是什么。所有这些信息都录入一个叫做HTTPS证书的文档里。打个比方，就像一个政府机构（代表所有人都信任的第三方）向一个人发出ID或护照（代表证书），那么这个ID的所有者就会得到信任政府的人的信任（假设ID不是假的，当然这种假设不在这个例子的讨论范围之内）。
证书颁发机构（CA）是有公信力去颁发证书的机构，Windows，MacOS，ios和Android等操作系统和Firefox等浏览器都有自己认为可信的证书颁发机构列表，您可以用一下方法查看您的浏览器或操作系统信任哪些证书颁发机构：
1、Firefox：“选项”→“高级”→“证书”→“查看证书”→“权限”
2、Windows：“控制面板”→“Internet选项”→“内容” - “证书”→“受信任的根证书颁发机构/中级认证机构”
3、Mac：“应用程序”→“实用程序”→“钥匙串访问”。在“类别”下选择“证书”
如果证书在可信证书列表里或证书已经被可信任的一方认证过了，那么浏览器或操作系统会检查并认为证书是可信任的，这种信任的传递机制被称为信任链：

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxflcwvdj30fe07kq3u.jpg)

这种机制使得我们自己可以添加其他没有被认证过的证书颁发机构，当我们想用自己签名的证书时这种机制就派上用场了（一会会讨论这种情况）。
大多数情况仅要求客户端知道服务器的身份即可，比如说网购用户需要知道自己访问的网站是否来源于淘宝，所以只有网站需要证书，而有的情况要求客户端和服务器都应该向对方表明自己的身份，比如说电子政务系统，这意味着双方都应该向对方发送证书以证明自己的身份，这种情况不在本文的讨论范围之内。
HTTPS证书的类型
HTTPS证书有很多种，它们可以按照以下标准进行分类：
#### 按身份验证（IDENTITY VALIDATION）的类型分类
1. 域验证（Domain validated，DV）
这是最常见的一种证书，DV证书负责验证域是和一个特定公钥匹配的，浏览器与服务器建立安全连接，并显示一个锁着的挂锁标志，点击挂锁标志将显示“本网站不提供所有权信息”。这种验证仅要求网站拥有域，DV证书只能确保这确实是该域对应的公钥，浏览器不显示域背后的法律实体。DV证书通常很便宜（每年10美元），甚至是免费的。
2. 扩展验证（Extended validation，EV）
EV证书可以验证网站背后的法律实体，这是最可靠的证书类型，它是在CA检查了域背后的法律实体后才颁发的，CA会采用以下方法进行检查：
检查实体是否控制着域，例如DV证书
检查政府业务记录，以确保法律实体确实注册了
检查独立的业务目录
打一个核实电话
检查证书中的所有域名（EV证书显式禁止通配符）
除了锁着的挂锁标志，EV证书还会在URL之前显示经过验证的法律实体（通常是注册公司）的名称。某些设备（如iOS Safari）仅显示经过验证的法律实体，完全不显示URL。单击标记将显示法律实体的相关详细信息，如名称、街道地址等，费用在每年150到300美元之间。
3. 组织验证（Organization validated，OV）
像EV一样，OV证书会验证网站背后的法律实体，但与EV不同的是，OV证书不会在浏览器界面中显示经过验证的法定实体的名称，也就是说OV具有较高的验证要求但却不会向用户展示较高的验证要求带来的优势，因此，OV证书不太受欢迎。OV证书的价格在每年40到100美元之间。
#### 按域覆盖的数量（NUMBER OF DOMAINS COVERED）分类
在以前，HTTPS证书通常只在CN域中包含一个域，后来为了允许一个证书适用于多个域，HTTPS证书加入了“主题替代名称”（subject alternative name，SAN）字段。近来，所有HTTPS证书都被创建为一样的：即使那些只包含一个域的证书也会把该域的SAN（以及该域的www版本的SAN）添加进证书。然而，由于历史原因，许多证书的供应商仍然出售单域和多域HTTPS证书。
1. 单域证书
这是最常见的一种证书类型，对域名和域名的www版本都有效。
2. 多域证书（UCC / SAN）
这种类型的证书也称为统一通信证书（Unified Communications Certificate ，UCC）或主题备用名称（Subject Alternative Names ，SAN），可以适用于多个域（有数量的上限）。它不限于单个域，您可以混合不同的域和子域，证书本身价格通常包括3到5个域，但您可以花费额外的费用来包括更多的域。建议将这种证书用于相互关联的网站，因为客户端在检查网站时的证书将会看到主域和其他域。
3. 通配符
这种类型的证书可以覆盖主域和不受限制的子域，比如说它可以覆盖example.com,www.example.com,mail.example.com,ftp.example.com等等。它的限制是它只适用于主域的子域。

## 配置

简要概括起来，HTTPS的四个部分需要加密：
1、初始密钥交换：用非对称加密算法（包括私钥和公钥）加密
2、身份验证（证书颁发机构颁发的HTTPS证书）：用非对称加密算法（包括私钥和公钥）加密
3、实际意义上的新息加密：用对称加密算法加密
4、信息的摘要：用哈希算法加密
每部分都使用一组密钥大小不同的常用加密算法（其中一些已被弃用）进行加密。客户端和服务器在握手时协商他们将使用哪些算法 - 从大约十几个公钥算法（密钥交换算法）中选择一个，十几个对称密钥（信息加密）算法中选择一个，再从三种消息摘要（哈希）算法中选择一个，这些算法可以选取数百种组合。
例如，设置ECDHE-RSA-AES256-GCM-SHA384意味着使用椭圆曲线Diffie-Hellman（Elliptic Curve Diffie-Hellman Ephemeral，ECDHE）密钥交换算法来交换密钥，CA使用Rivest-Shamir-Adleman（RSA）算法签署了证书; 对称消息加密将使用256位密钥和GCM模式的Advanced Encryption Standard（AES）加密算法; 并使用SHA安全散列算法生成384位消息摘要来验证消息的完整性。（有一个综合的算法组合列表。）
也就是说，加密算法有一定的选择空间。

### 加密算法组合

在决定使用怎样的加密算法组合时要兼顾兼容性和安全性：与旧浏览器的兼容性需要服务器支持较旧的加密算法，然而，许多较旧的密码算法后来被认为是不安全的。
OpenSSL以加密强度的顺序列出了支持的组合（见上文），其中最安全的位于顶部，底部最弱。以这种方式设计，因为在客户端和服务器之间的初始握手期间，要使用的组合被协商，直到发现由双方支持的匹配。首先尝试最安全的组合是有道理的，只有在没有其他方式的情况下才逐渐降低安全性。
Mozilla SSL配置生成器是一个非常有用和强烈推荐的资源，建议在服务器上启用什么加密方法，稍后我们将使用实际的服务器配置。

### 关键的密钥

椭圆曲线密码学（ECC）证书比RSA证书更快，使用更少的CPU，这对移动客户端尤为重要。然而，一些服务，如亚马逊，CloudFront和Heroku，在撰写本文时还没有支持ECC证书。
一般我们认为256位的ECC密钥就足够了。
Rivest Shamir Adleman（RSA）证书较慢，但与更多种类较旧的服务器兼容。RSA密钥较大，因此2048位RSA密钥在保证安全的情况下是最小的。4096位以上的RSA证书可能会损害性能 - 他们也可能被一个2048位的中介机构签署，破坏了大部分额外的安全性！
您可能已经注意到上述声明的流动性和缺少任何数字 - 这是因为一台服务器上的重负载不在另一台服务器上。确定对性能的影响的最佳方法是通过您的真实网站和真实访问者来监控服务器上的负载。即使这样会随着时间的推移而改变。


## 配置步骤

### 步骤综述

要获取HTTPS证书，请按以下步骤进行：
1、创建私钥-公钥对，并准备证书签名请求（ Certificate Signing Request，CSR），包括法定组织的信息和公钥。
2、联系认证机构，并根据CSR请求HTTPS证书。
3、获取签名的HTTPS证书并将其安装在您的Web服务器上。
这个步骤中需要用到一组包含公钥基础设施（PKI）的不同组件的文件：私钥，公钥，CSR和签名的HTTPS证书。然而，不同的组织用使用不同的名称（和文件扩展名）来识别同一个东西，让事情变得更复杂了。
首先，有两种流行的存储信息的格式--DER和PEM。第一个（DER）是二进制的，第二个（PEM）是一个base64编码（文本）DER文件。默认情况下，Windows直接使用DER格式，开源世界（Linux和UNIX）使用PEM格式。有一些工具（OpenSSL）负责在他们之间转换。
我们将在下面的步骤中作为示例使用的文件如下：
1、example.com.key
这个PEM格式的文件包含私钥。扩展名.key不是标准要求，所以有些可能使用它作为扩展名，有些可能用其他的扩展名，这个文件只能由系统超级用户进行保护和访问。
2、example.com.pub
这个PEM格式的文件包含公钥。因为可以从私有密钥生成公钥，所以实际上你并不需要这个文件（它从来没有显示出来），这里列出来只是为了便于说明。
3、example.com.csr
这是证书签名请求，是一个包含组织信息和服务器的公钥的PEM格式的文件，应该把它发送到颁发HTTPS证书的证书颁发机构。
4、example.com.crt
此HTTPS证书由证书颁发机构签署。它是一个PEM格式的文件，包括服务器的公钥，组织信息，CA签名，有效时间的区间等。扩展名.crt不是标准要求， 其他常见的扩展包括.cert和.cer。
文件名（和扩展名）不是标准要求， 他们可以是你喜欢的任何东西。我选择了这个命名约定，因为我认为它具有说明性，可以更明显地说明哪个组件具有什么功能。只要在整个过程中引用命令行中相应的密钥证书文件和服务器配置文件，您就可以使用任何您喜欢的命名法则。
私钥是具有一定长度的随机生成的字符串（我们将使用2048位），它看起来像这样子的：

```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAm+036O2PlUQbKbSSs2ik6O6TYy6+Zsas5oAk3GioGLl1RW9N
i8kagqdnD69Et29m1vl5OIPsBoW3OWb1aBW5e3J0x9prXI1W/fpvuP9NmrHBUN4E
S17VliRpfVH3aHfPC8rKpv3GvHYOcfOmMN+HfBZlUeKJKs6c5WmSVdnZB0R4UAWu
Q30aHEBVqtrhgHqYDBokVe0/H4wmwZEIQTINWniCOFR5UphJf5nP8ljGbmPxNTnf
b/iHS/chjcjF7TGMG36e7EBoQijZEUQs5IBCeVefOnFLK5jLx+BC//X+FNzByDil
Tt+l28I/3ZN1ujhak73YFbWjjLR2tjtp+LQgNQIDAQABAoIBAEAO2KVM02wTKsWb
dZlXKEi5mrtofLhkbqvTgVE7fbOKnW8FJuqCl+2NMH31F1n03l765p4dNF4JmRhv
/+ne4vCgOPHR/cFsH4z/0d5CpHMlC7JZQ5JjR4QDOYNOpUG51smVamPoZjkOlyih
XGk/q72CxeU6F/gKIdLt6Dx03wBosIq9IAE8LwdMnioeuj18qaVg195OMeIOriIn
tpWP4eFya5rTpIFfIdHdIxyXsd6hF/LrRc9BMWTY1/uOLrpYjTf7chbdNaxhwH7k
buvKxBvCvmXmd6v/AeQQAXbUkdSnbTKDaB9B7IlUTcDJyPBJXvFS1IzzjN6vV+06
XBwHx5ECgYEAyRZLzwnA3bw8Ep9mDw8JHDQoGuQkFEMLqRdRRoZ+hxnBD9V9M0T6
HRiUFOizEVoXxf6zPtHm/T7cRD8AFqB+pA/Nv0ug6KpwUjA4Aihf5ADp0gem0DNw
YlVkCA6Bu7c9IUlE0hwF7RLB7YrryJVJit9AymmUTUUHCQTWW2yBhC8CgYEAxoHS
HGXthin5owOTNPwLwPfU2o7SybkDBKyW69uTi0KxAl3610DjyA/cV2mxIcFlPv1y
HualGd9eNoeCMBy/AUtjzI0K77yeRpjj321rj6k8c8bYWPHH539SiBXLWTY/WQ0w
pxfT3d/Z4QMh5d6p+p5f3UIrXESYQd+fAaG5tNsCgYEAksTdTB4YUT9EsWr6eN9G
jPlclFQUKV3OMvq77bfYvg8EJORz32nnDDmWS7SUjoOtemwutBlMeWbaKk25aMp3
5JNMXuV6apeMJ9Dd8GU7qBUqlIvVK31/96XPvzmnYzWZPqRVwO2HPcRFG3YcJmkg
JmZQyexJvCQ3wFNxiYUm+y0CgYBXQSMhFnCUg4jWbbDcHlnwRT+LnjHrN2arPE3O
eKLfGL6DotmqmjxFaStaRPv2MXMWgAMUsB8sQzG/WEsSaOBQaloAxJJlFIyhzXyE
bi1UZXhMD8BzQDu1dxLI/IN4wE6SDykumVuocEfuDxlsWDZxEgJjWD2E/iXK9seG
yRa+9wKBgEydVz+C1ECLI/dOWb20UC9nGQ+2dMa+3dsmvFwSJJatQv9NGaDUdxmU
hRVzWgogZ8dZ9oH8IY3U0owNRfO65VGe0sN00sQtMoweEQi0SN0J6FePiVCnl7pf
lvYBaemLrW2YI2B7zk5fTm6ng9BW/B1KfrH9Vm5wLQBchAN8Pjbu
-----END RSA PRIVATE KEY-----

```

切记要保持私钥的私密性！也就是说你需要严格规定它的权限是600（只有root用户才能进行读写），不能将它开放给其他任何用户。
和私钥对应的是公钥，看起来像是这样的：

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm+036O2PlUQbKbSSs2ik
6O6TYy6+Zsas5oAk3GioGLl1RW9Ni8kagqdnD69Et29m1vl5OIPsBoW3OWb1aBW5
e3J0x9prXI1W/fpvuP9NmrHBUN4ES17VliRpfVH3aHfPC8rKpv3GvHYOcfOmMN+H
fBZlUeKJKs6c5WmSVdnZB0R4UAWuQ30aHEBVqtrhgHqYDBokVe0/H4wmwZEIQTIN
WniCOFR5UphJf5nP8ljGbmPxNTnfb/iHS/chjcjF7TGMG36e7EBoQijZEUQs5IBC
eVefOnFLK5jLx+BC//X+FNzByDilTt+l28I/3ZN1ujhak73YFbWjjLR2tjtp+LQg
NQIDAQAB
-----END PUBLIC KEY-----

```
证书签名请求看起来像是这样的：

```
-----BEGIN CERTIFICATE REQUEST-----
MIICzjCCAbYCAQAwgYgxFDASBgNVBAMMC2V4YW1wbGUuY29tMQswCQYDVQQLDAJJ
VDEPMA0GA1UECAwGTG9uZG9uMRIwEAYDVQQKDAlBQ01FIEluYy4xIDAeBgkqhkiG
9w0BCQEWEWFkbWluQGV4YW1wbGUuY29tMQswCQYDVQQGEwJHQjEPMA0GA1UEBwwG
TG9uZG9uMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm+036O2PlUQb
KbSSs2ik6O6TYy6+Zsas5oAk3GioGLl1RW9Ni8kagqdnD69Et29m1vl5OIPsBoW3
OWb1aBW5e3J0x9prXI1W/fpvuP9NmrHBUN4ES17VliRpfVH3aHfPC8rKpv3GvHYO
cfOmMN+HfBZlUeKJKs6c5WmSVdnZB0R4UAWuQ30aHEBVqtrhgHqYDBokVe0/H4wm
wZEIQTINWniCOFR5UphJf5nP8ljGbmPxNTnfb/iHS/chjcjF7TGMG36e7EBoQijZ
EUQs5IBCeVefOnFLK5jLx+BC//X+FNzByDilTt+l28I/3ZN1ujhak73YFbWjjLR2
tjtp+LQgNQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAGIQVhXfuWdINNfceNPm
CkAGv4yzpx88L34bhO1Dw4PYWnoS2f7ItuQA5zNk9EJhjkwK8gYspK7mPkvHDbFa
Um7lPSWsm3gjd3pU7dIaHxQ+0AW9lOw5ukiBlO4t3qgt+jTVZ3EhMbR0jDSyjTrY
kTgfuqQrGOQSmLb5XviEtCcN0rseWib3fKIl8DM69JiA2AALxyk7DCkS1BqLNChT
pnbgvtlUhc4yFXNCtwPGskXIvLsCn2LRy+qdsPM776kDLgD36hK0Wu14Lpsoa/p+
ZRuwKqTjdaV23o2aUMULyCRuITlghEEkRdJsaXadHXtNd5I5vDJOAAt46PIXcyEZ
aQY=
-----END CERTIFICATE REQUEST-----

```

这个特定的CSR包含服务器的公钥和有关组织ACME Inc.的详细信息，该组织位于英国伦敦，并拥有该域名example.com。
最后，签名的HTTPS证书如下所示：

```
-----BEGIN CERTIFICATE-----
MIIDjjCCAnYCCQCJdR6v1+W5RzANBgkqhkiG9w0BAQUFADCBiDEUMBIGA1UEAwwL
ZXhhbXBsZS5jb20xCzAJBgNVBAsMAklUMQ8wDQYDVQQIDAZMb25kb24xEjAQBgNV
BAoMCUFDTUUgSW5jLjEgMB4GCSqGSIb3DQEJARYRYWRtaW5AZXhhbXBsZS5jb20x
CzAJBgNVBAYTAkdCMQ8wDQYDVQQHDAZMb25kb24wHhcNMTYwNDE5MTAzMjI1WhcN
MTcwNDE5MTAzMjI1WjCBiDEUMBIGA1UEAwwLZXhhbXBsZS5jb20xCzAJBgNVBAsM
AklUMQ8wDQYDVQQIDAZMb25kb24xEjAQBgNVBAoMCUFDTUUgSW5jLjEgMB4GCSqG
SIb3DQEJARYRYWRtaW5AZXhhbXBsZS5jb20xCzAJBgNVBAYTAkdCMQ8wDQYDVQQH
DAZMb25kb24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCb7Tfo7Y+V
RBsptJKzaKTo7pNjLr5mxqzmgCTcaKgYuXVFb02LyRqCp2cPr0S3b2bW+Xk4g+wG
hbc5ZvVoFbl7cnTH2mtcjVb9+m+4/02ascFQ3gRLXtWWJGl9Ufdod88Lysqm/ca8
dg5x86Yw34d8FmVR4okqzpzlaZJV2dkHRHhQBa5DfRocQFWq2uGAepgMGiRV7T8f
jCbBkQhBMg1aeII4VHlSmEl/mc/yWMZuY/E1Od9v+IdL9yGNyMXtMYwbfp7sQGhC
KNkRRCzkgEJ5V586cUsrmMvH4EL/9f4U3MHIOKVO36Xbwj/dk3W6OFqTvdgVtaOM
tHa2O2n4tCA1AgMBAAEwDQYJKoZIhvcNAQEFBQADggEBABwwkE7wX5gmZMRYugSS
7peSx83Oac1ikLnUDMMOU8WmqxaLTTZQeuoq5W23xWQWgcTtfjP9vfV50jFzXwat
5Ch3OQUS53d06hX5EiVrmTyDgybPVlfbq5147MBEC0ePGxG6uV+Ed+oUYX4OM/bB
XiFa4z7eamG+Md2d/A1cB54R3LH6vECLuyJrF0+sCGJJAGumJGhjcOdpvUVt5gvD
FIgT9B04VJnaBatEgWbn9x50EP4j41PNFGx/A0CCLgbTs8kZCdhE4QFMxU9T+T9t
rXgaspIi7RA4xkSE7x7B8NbvSlgP79/qUe80Z7d8Oolva6dTZduByr0CejdfhLhi
mNU=
-----END CERTIFICATE-----

```

上面的这些部分要连接起来并且应该能相互匹配。最终连接起来生成的证书仅仅是起说明作用 - 这也就是为什么被叫做自签名证书，因为它不是被权威的认证机构签名的。
下面的配置步骤将以cPanel，Linux，FreeBSD和Windows的实际步骤进行说明。这是一个通用的过程，适用于各种证书。

### 第一步：创建私钥和证书签名请求

在以下示例中，我们将使用2048位的RSA证书，因为它们具有广泛的兼容性。如果您的服务器提供商支持ECC的话（例如，如果你不使用Heroku或AWS），那你可能更喜欢使用ECC。下面我们按照不同的环境来讲解如何进行这一步。

#### CPanel 

1、登录至服务器的CPanel
2、向下滚动到“security”部分，点击“SSL/TLS.”

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxt5oe9uj30fe04jq3e.jpg)

3、你现在处于“SSL / TLS Maneger”的主界面。单击“Private Keys（KEY）”创建一个新的私钥。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxtje8tij30fe094aer.jpg)

4、你会转到下面这个页面，在“Key size”框中选择2048 bit，点击“Generate”。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxtx185aj30fe0p0q7e.jpg)

5、然后新的私钥就产生了，你会看到确认界面

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxuer1xhj30fe0dngru.jpg)

6、如果你返回“private keys”界面，你会看到你的新密钥被列出来了

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxutdt01j30fe0extf5.jpg)

7、返回 “SSL/TLS Manager”主界面. 点击“Certificate Signing Requests (CSR)” 来创建一个新的证书请求。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxvcf3uej30fe09478w.jpg)

8、您现在将看到“Generate Service Request”表单。选择先前创建的私钥并填写表格，回答所有问题（他们将在您的签名证书中公开），特别注意“Domains”部分，该部分应与你请求HTTPS证书的域名完全相符。仅包含顶级域（example.com）; CA通常也会添加www子域（即www.example.com）。完成后，单击“Generate”按钮。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxvrf06jj30b40pvdkx.jpg)

9、然后新的CSR就生成啦，你会看到一个确认页面

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxw5mc7kj30d40pvgti.jpg)

10、如果你回到“Certificate Signing Request”页面，你将看到你的新的CSR列表：

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuxwk3skcj30fe06576s.jpg)

#### Linux，Free BSD

1、首先确认你已经安装好了openssl，可以在终端中输入以下命令来确认：

```
openssl version
```

如果输入命令后啥都没有显示，那就根据你的系统选择下面的命令来安装openssl：

```
Debian, Ubuntu and clones
sudo apt-get install openssl
Red Hat, CentOS and clones
sudo yum install openssl
FreeBSD
make -C /usr/ports/security/openssl install clean
```

2、接下来，使用下面这个命令生成私钥和CSR：
```
openssl req -newkey rsa:2048 -nodes -keyout example.com.key -out example.com.csr
```

然后私钥就生成啦，你需要回答一些问题以生成CSR

```
Generating a 2048 bit RSA private key
........................+++
................................................................+++
writing new private key to 'example.com.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter ‘.', the field will be left blank.

```
正确回答所有问题（他们将在您的签名证书中公开），特别注意“Common Name”部分（例如server FQDN or YOUR name），该部分应与你请求HTTPS证书的域名完全相符。仅包含顶级域（example.com）; CA通常也会添加www子域（即www.example.com）。

```
Country Name (2 letter code) [AU]:GB
State or Province Name (full name) [Some-State]:London
Locality Name (eg, city) []:London
Organization Name (eg, company) [Internet Widgits Pty Ltd]:ACME Inc.
Organizational Unit Name (eg, section) []:IT
Common Name (e.g. server FQDN or YOUR name) []:example.com
Email Address []:admin@example.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:

```

#### windows系统上的INTERNET INFORMATION SERVER (IIS) 

1、打开“开始”→“管理工具”→“INTERNET INFORMATION SERVER（IIS）”。单击服务器名称。双击中间那一栏的“Server Certificates”：

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy0trsxkj30fe0dp0wq.jpg)

2、单击右边那一栏的“Create Certificate Request”

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy1avywcj30fe0dptb0.jpg)

3、输入您的组织的详细信息，特别注意“Common Name”，这应该和您的域名相匹配。点击“Next”。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy1no4fpj30fe0bo75q.jpg)

4、保留默认的“Cryptographic Service Provider.”，将“Bit length”设置为2048，点击“Next”

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy24bu45j30fe0botab.jpg)

5、浏览一个地方来存储CSR，点击“Finish”

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy2j8lsjj30fe0boab1.jpg)

### 第二步：获得HTTPS证书

为了获得您的网站证书，首先从HTTPS证书提供商处购买所选类型（DV，OV，EV，单站点，多站点，通配符 - 见上文）的HTTPS证书信用证。这一步完成后，你要提供CSR，你选择的域名需要的费用会从刚刚购买的信用额度中扣除。你需要提供（即粘贴在一个字段中或上传）整个CSR文本，包括-----BEGIN CERTIFICATE REQUEST----- 和 -----END CERTIFICATE REQUEST----- 这两行。如果您想要获得EV或OV证书，就需要提供请求这个证书的法律实体，你也就可能会被要求提供其他文件，以确认你代表该公司。然后，证书注册商将验证您的请求（和任何辅助支持文件）并签发签名的HTTPS证书。下面将分别讲解从HTTPS注册商处获取证书和自己对证书签名的步骤。

#### 获取HTTPS证书步骤

你的托管服务器提供商或HTTPS注册商可能有不同的产品和注册流程，但通用的过程应该类似。
1、查找HTTPS证书供应商。
2、选择一种类型的证书（DV，OV，EV，单站点，多站点，通配符），然后单击“添加到购物车”，指定首选付款方式并完成付款。
3、为您的域名激活新的HTTPS证书。您可以粘贴或上传证书签名请求。系统将从CSR中提取证书详细信息。
4、你需要选择“域控制验证”的方法 - 无论是通过电子邮件，上传HTML文件（基于HTTP）或将TXT记录添加到域区域文件（基于DNS）。按照您选择的DCV方法的说明进行验证。
5、等待几分钟，直到执行验证并发出HTTPS证书。下载签名的HTTPS证书。

#### 自签名证书的步骤

你也可以自己签署证书，而不是从证书颁发机构处获得，如果是为了测试的话这样做很有效，因为它的加密方式与其他任何证书一样好，但不会被浏览器所信任，这将导致安全警告 – 你可以声明自己是任何你想声明的，但不会被受信任的第三方验证。如果用户信任网站，他们可以在浏览器中添加一个异常，这样会把证书存储起来并标为信任以供其以后访问。
上述示例证书是自签名证书，您可以将其用于域名example.com，这个证书会在其有效期内工作。
您可以在具有OpenSSL的任何平台上用下面这个命令创建自签名证书：
openssl x509 -signkey example.com.key -in example.com.csr -req -days 365 -out example.com.crt
获得证书以后，你必须把它安装在你的服务器上，如果您使用来自同一托管服务器提供商的HTTPS注册服务（许多托管服务提供商也销售HTTPS证书），则可能会有一个自动的过程来安装并启用您新获得的网站的HTTPS证书。如果您在其他地方托管您的网站，则需要下载证书并配置您的服务器才能使用。

### 第三步：为你的网站安装HTTPS证书

####  CPanel

1、返回“SSL/TLS Manager”主界面，点击“Certificates (CRT)”来打包新证书。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy5pxkp3j30fe094aga.jpg)

2、然后会转到“Paste, Upload or Generate” 页面，把从HTTPS注册商收到的证书的内容粘贴过来，或者使用 “Browse” 按钮上传。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy689kznj308b0pv41e.jpg)

3、粘贴HTTPS证书的内容时会进行解析，然后将纯文本值提供给你进行确认。查看内容，然后单击“Save Certificate”按钮。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy7f0n4bj30fe0kodko.jpg)

4、新的HTTPS证书会被保存，您将得到一个确认页面：

5、如果你回到“Certificates (CRT)”主页面，你会发现上面列出了你的新的HTTPS证书：

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy8d8m4ij30fe06egne.jpg)

6、返回“SSL/TLS Manager”主界面，点击“Install and Manage SSL for your website (HTTPS)”来给你的网站分配一个新的证书。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy8uo41pj30fe094n2n.jpg)

7、你会看到“Install an SSL Website”表单。点击 “Browse Certificates”按钮然后选择你的HTTPS证书。从你的下拉单中选择你的网站域名（如果它没有被自动选出来的话）,然后检查 “Certificate”和“Private Key”区域都被填好了。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuy95psrqj30fe0yqqic.jpg)

8、测试一下看看能不能访问https://www.example.com了，如果一切正常的话你可能会希望把所有的HTTP都转为HTTPS，在Apache web server下只需要这样做就可以了：在网站的根目录下创建文件.htaccess, 并把以下几行代码粘贴进去：

```
RewriteEngine On

RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

```
如果这个文件已经存在了，那么就把后两行代码粘贴进去就好了，粘贴的位置就在第一行代码的后面。

#### LINUX FREEBSD

1、首先，将生成的私钥（example.com.key），证书签名请求（example.com.csr）和有效的HTTPS证书（example.com.crt）放在正确的位置上：

```
Debian, Ubuntu and clones, FreeBSD
cp example.com.crt /etc/ssl/certs/
cp example.com.key /etc/ssl/private/
cp example.com.csr /etc/ssl/private/
Red Hat, CentOS and clones
cp example.com.crt /etc/pki/tls/certs/
cp example.com.key /etc/pki/tls/private/
cp example.com.csr /etc/pki/tls/private/
restorecon -RvF /etc/pki
```

2、这些文件的权限应该归root用户所有，需要用下面的命令将权限设置为600.

```
Debian, Ubuntu and clones
chown -R root. /etc/ssl/certs /etc/ssl/private
chmod -R 0600 /etc/ssl/certs /etc/ssl/private
Red Hat, CentOS and clones
chown -R root. /etc/pki/tls/certs /etc/pki/tls/private
chmod -R 0600 /etc/pki/tls/certs /etc/pki/tls/private
FreeBSD
chown -R root:wheel /etc/ssl/certs /etc/ssl/private
chmod -R 0600 /etc/ssl/certs /etc/ssl/private
```

3、下面分APACHE和NGINX两种服务器讲解这一步
① APACHE
要激活你的网站的HTTPS协议，你应该按一下步骤进行：
首先确定mod_ssl安装在你的服务器上，接着将接收的HTTPS证书（.crt）文件上传到您的服务器，最后编辑Apache服务器配置文件。
第一步是检查mod_ssl文件，根据不同的操作系统尝试执行以下命令，一定有一个是可以用的：
```
apache2 -M | grep ssl
```

或
```
httpd -M | grep ssl
```

如果mod_ssl文件成功安装了，你应该能看到以下信息：

```
ssl_module (shared)
Syntax OK
```

或者类似的消息
如果mod_ssl不存在或未启用，按以下步骤执行命令：

```
Debian, Ubuntu and clones
sudo a2enmod ssl
sudo service apache2 restart
Red Hat, CentOS and clones
sudo yum install mod_ssl
sudo service httpd restart
FreeBSD (选中SSL选项)
make -C /usr/ports/www/apache24 config install clean
apachectl restart
```

第二步是编辑Apache配置文件（httpd.conf）：

```
Debian，Ubuntu
/etc/apache2/apache2.conf
Redhat，CentOS
/etc/httpd/conf/httpd.conf
FreeBSD的
/usr/local/etc/apache2x/httpd.conf
```

这个文件内容见附录httpd.conf.txt，文件使用前面提到的Mozilla SSL配置生成器（https://mozilla.github.io/server-side-tls/ssl-config-generator/）生成的，检查它以获取最新的配置，记得要编辑证书和私钥的路径，提供的配置是根据中间的设置生成的：读取每个设置的限制条件和支持的浏览器配置，以确定哪个最适合你的情况。
一些对生成代码的修改是为了让网站从HTTP重定向到HTTPS和从非www重定向到www域（出于提高搜索引擎排名的目的）。
② NGINX
编辑NGINX配置文件（nginx.conf）：
Debian, Ubuntu, Red Hat, CentOS
/etc/nginx/nginx.conf
FreeBSD的
/usr/local/etc/nginx/nginx.conf
这个文件内容见附录nginx.conf.txt，文件使用前面提到的Mozilla SSL配置生成器（https://mozilla.github.io/server-side-tls/ssl-config-generator/）生成的，检查它以获取最新的配置，记得要编辑证书和私钥的路径，提供的配置是根据中间的设置生成的：读取每个设置的限制条件和支持的浏览器配置，以确定哪个最适合你的情况。
生成器自动生成用于处理从HTTP到HTTPS的重定向的代码，并直接启用HTTP / 2！

####  windows系统上的INTERNET INFORMATION SERVER (IIS)

1、打开“开始”→“管理工具”→“INTERNET INFORMATION SERVER（IIS）”。单击服务器名称。双击中间那一栏的“Server Certificates”：

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuydbir08j30fe0dp0wq.jpg)

2、在右边那一栏栏中点击“Complete Certificate Request”。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuydorbwsj30fe0dp40z.jpg)

3、选择你从CA获得的签名证书文件（example.com.crt）。在“Friendly name”这一栏中输入一些名称，以便稍后区分证书。将新证书存储在“Personal” certificate store (IIS 8+)中。点击“OK”。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuye3yr34j30fe0boq4c.jpg)


4、如果一切正常，您应该看到证书列在“Server Certificates” 下。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuyek2ejmj30fe0bw0v1.jpg)

5、点开服务器名称。在“sites”下，选择要为其分配HTTPS证书的网站。从右侧那一列中单击“Bindings”

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuyf0tm55j30fe0bwado.jpg)

6、在“Site bindings”窗口, 点击“Add”按钮。

![](https://ws1.sinaimg.cn/large/005S1Vjily1fiuyfdff0mj30fe090dg7.jpg)

7、在新窗口中做如下选择：
“Type”: “https”
“IP address”: “All Unassigned”
“Port”: “443”
在“SSL Certificate”这一栏, 通过选刚刚设定的friendly name来选择安装好的HTTPS证书，点击“OK.”按钮

8、你现在应该已经为此网站安装好了HTTP和HTTPS。

#### MIXED-CONTENT警告

您可能会在地址栏旁边收到一个警告信号，并显示一条消息，如“连接不安全！本页的部分内容不安全（如图像）。”，这并不意味着您的安装是错误的，只需确保无论是本地的还是远程服务器上的所有资源（图像，样式表，脚本等）的链接，都不能以http://为起始即可，应该使用相对于根（/images/image.png，/styles/style.css等等）或相对于当前文档（../images/image.png）的路径指向所有资源，或者它们应该是以https://开头的完整的URL，例如
```
<script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>。
```

这些提示可以消除MIXED-CONTENT警告，您的浏览器应显示封闭的挂锁，而不会有感叹号。
#### 测试您的服务器
配置好服务器并在网站上使HTTPS运行后，我强烈建议你使用Qualys SSL Server测试检查其安全配置。这将对您的网站进行扫描，包括对其配置的全面评估，可能的弱点和建议。按照这方面的建议，进一步改善您的服务器的安全配置。
#### 续订
您的证书在一段时间内有效，通常为一年。不要等到最后一刻才更新，您的注册商将在更新日期接近时开始发送电子邮件。当您第一次收到提醒时，请尽快发出新的证书，该过程几乎相同：创建新的证书签名请求，获取新的HTTPS证书，并将其安装在您的服务器上。证书的有效期将在签字时开始运行，将在当前证书到期后一年内启动设置。因此，您的旧证书和新证书都将有效，旧证书到期后的一年时间也将有效。在重叠期间，您将能够确保在旧的证书过期之前新证书也能正常工作。
#### 撤销
如果你的服务器遭到入侵，或者您认为有人可能获取了你的私钥，则应立即撤销当前的HTTPS证书。不同的注册商有不同的过程，但通常是在注册商的特殊数据库中将受到损害的证书标记为不活动，然后发出新的HTTPS证书。当然，尽快撤销目前的证书，这样没有人可以冒充你，只有在调查和解决了安全漏洞的原因之后才能获得新的证书。详细内容请向您的注册服务商寻求帮助。

## 预告
如果你想获取免费的DV证书，请关注我的下一篇翻译：讲解Let’s Encrypt 和Cloudflare的使用。




