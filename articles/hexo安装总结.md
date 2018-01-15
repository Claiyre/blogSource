---
title: hexo安装总结
date: 2016-11-28 15:45:51
tags: hexo
categories: 安装教程
thumbnail: http://p1.bqimg.com/567571/e41298d7ea741d85.png
---
不知为何，每次装一个新的东西时，总是历经坎坷，总要遇到比别人更多的bug,付出更多的努力，就记录下这次遇到的坑吧，希望可以帮助后来的小伙伴！
<!--more-->
>博客原文地址：[Claiyre的个人博客](https://claiyre.github.io/)
>如需转载，请在文章开头注明原文地址


hexo真心是一个不错的东西呢，安装简单（然而对博主来说并不是这样，伤心脸），主题样式简洁优雅，还有多种选择。
###  流程如下
1.  安装nodejs
2.  安装gitBash
3.  在github上创建一个**你的github名称.github.io  **的仓库（一定要把“你的github名称”换成你的github名称啊）
4.  安装hexo
```
$ npm install -g hexo
```
建议在gitBash中进行命令行操作，windows自带的cmd容易报错
5.  初始化
```
$ cd <你指定存放hexo的目录>
$ hexo init <你指定存放hexo的目录>
```
6.  安装相关插件
	参见[hexo github](https://github.com/hexojs/hexo/wiki/Migrating-from-2.x-to-3.0#install-hexo-cli)

7.  生成静态页面
```
$ hexo generate
```
8.  本地启动
```
$ hexo server
```
默认在4000端口 在浏览器输入http://localhost:4000/即可看到你博客未来的样子啦！有木有很鸡冻？！
9.  发布
找到hexo根目录下的_config.yml文件，找到下面的deploy: 并更改为
```
deploy:
  type: git
  repo: https://github.com/Claiyre/Claiyre.github.io.git  # 3中创建的仓库的地址
  branch: master
```
**注意冒号后面有一个半角空格**
好啦，接下来打开这个仓库得页面，点击左上那个绿色的按钮。
对！没错！放心点吧！就是那个“GH Pages”！
好啦，看到了你的新博客了是吧（如果你真的只是做了以上9步就看到了的话，我一定会嫉妒你的，啊啊啊）

上面是大致安装流程，想看具体的话，点这
[点我！点我！](https://xdlrt.github.io/tags/hexo%E6%95%99%E7%A8%8B/)
[这里，这里！](http://ibruce.info/2013/11/22/hexo-your-blog/)

下面的是博主自己遇到的问题，以上两篇文章未提及或者提及的方法不适用于博主的

###  常见问题及解决方案
#### 4000端口被占用
给hexo指定其他端口（比如5000）
```
hexo server -p 5000
```
至于怎么查看端口被占用——百度知道

#### 多说评论不能正常显示或出错
shortname不是你登录多说的那个名字！不是登录多说的那个名字！不是！
如果你只是想在别人的博客下评论的话，随便选个快捷方式登录多说即可，但是！但是！如果你要给自己的博客添加多说的话
1.登录网页版多说，点击右上角多说图标，进入多说主页
2.点击“我要安装”按钮，如下图
![](http://i1.piimg.com/567571/7ad876daf73acf93.png)
3.填写相关信息
箭头所指处应该填写的是你的shortname,也就是你的域名
![](http://i1.piimg.com/567571/2453d4d518fa7973.png)

#### 其他错误
如果还碰到了其他奇怪的错误，务必检查_config.yml文件中每个冒号后面是否有一个**半角空格**

暂时想到的就这么多（啊啊啊，明明记得有好多的呀）

###  其他
####  主题
默认主题有点丑？没关系，随着不断地发展壮大，hexo已经有好多个不同风格的主题了！萝卜白菜，各有所爱。快去选个自己喜欢的主题吧！每个主题都有配置说明文档，按照上面配置就好了。
[hexo主题](https://github.com/hexojs/hexo/wiki/Themes)
有精力的小伙伴也可以自己写一个主题放github上为开源做贡献嘛
####  图床
为了方便博客的迁移和速度，图床是必须得，博主强烈推荐[七牛](http://yotuku.cn/),真心灰常灰常好用啊
####  markdown语法
不熟悉markdown编写的小伙伴可以[点这里](http://www.appinn.com/markdown/basic.html),非常详细的介绍


叙述不当之处还望您不吝赐教