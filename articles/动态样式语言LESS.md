---
title: 动态样式语言LESS
date: 2017-02-17 10:56:12
tags: [css, less]
categories: CSS
thumbnail: http://i1.piimg.com/567571/1e0a283aff257474.jpg
---


>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>博客园地址：[http://www.cnblogs.com/nuannuan7362/](http://www.cnblogs.com/nuannuan7362/)
>如需转载，请在文章开头注明原文地址


# 前言

less作为css语言的扩展，赋予了css动态语言的特性，如：变量，继承，运算，函数等。如果你原本就是程序员，你一定会非常喜爱less，它可以帮你节省很多重复工作，可以让你像编写一门动态语言一样地编写css。
本文总结了less的相关语法和使用方式，可供查阅和入门使用。

<!--more-->

# 正文

## 语法

### 变量
less允许使用变量，可以将一个多次用到的值设为一个变量。less中没有类型限制，以符号**@**标识变量，在声明或使用变量时再变量名前添加符号@即可

```
@bg-color: #fff;
@base-font-size: 16px;

//使用

.body{
	background-color: @bg-color;
	font-size: @base-font-size;
}
```

多数情况下，我们是将这个**变量**当做一个**常量**来使用；less中变量也只能被定义一次这一点使之更像常量。

### 混合
将需要用到多次的全局css样式集成为一个css类，在其他类中可以直接引用这个集成类，这个过程称为混合。
实例：

```
.base-border{
	border: 2px solid #0c6dc7;
	border-radius: 6px;
}

.img-top{
	width: 150px;
	height: 150px;
	.base-border
}
.img-bottom{
	width: 200px;
	height: 150px;
	.base-border
}
```

上面的会被解析为

```
.img-top{
	width: 150px;
	height: 150px;
	border: 2px solid #0c6dc7;
	border-radius: 6px;
}
.img-bottom{
	width: 200px;
	height: 150px;
	border: 2px solid #0c6dc7;
	border-radius: 6px;
}
```

个人认为混合与传统OO语言的继承颇为相似，子类继承父类的特征的同时，也可以添加自己专有的特征。

### 带参数的混合

在使用混合时，less允许给父类传入参数，参数使我们可以更加灵活地运用混合
比如，可以稍微改动上面的``.base-border``类
```
.base-border(@radius){
	border: 2px solid #0c6dc7;
	border-radius: @radius;
}

//使用
.img-top{
	width: 150px;
	height: 150px;
	.base-border(10px);
}
.img-bottom{
	width: 200px;
	height: 150px;
	.base-border(15px);
}
```
还可以设置参数的默认值，多个参数用逗号隔开：

```
.base-border(@color: #0c6dc7,@radius: 6px){
	border: 2px solid @color;
	border-radius: @radius;
}

//使用
.img-top{
	width: 150px;
	height: 150px;
	.base-border;  //默认是颜色#0c6dc7，半径6px
}
.img-bottom{
	width: 200px;
	height: 150px;
	.base-border(#ff0000,15px);
}
```
在一个带参数的类中，我们可以通过``@arguments``来获取传进来的所有参数，可以整体作为某个属性的值。

### 嵌套规则

嵌套规则基于html的文档结构，可以减少我们对一些css选择器的使用，使代码更易懂，更简洁。
例如，我们需要设置这样的样式：

```
.parent{
	background-color: #ff0000;
}

.parent .child{
	height: 200px;
	width: 200px;
}
.parent.ancestor{
	border: 2px solid #000;
}
```

用less可以这样嵌套，文档结构更加明显：

```
.parent{
	background-color: #ff0000;
	.child{
		height: 200px;
		width: 200px;
	}
	&.ancestor{
		border: 2px solid #000;
	}
}
```

符号``&``,表示“and”，也可以理解为父级选择器。

### 颜色函数

less提供了多个颜色运算的函数，非常方便

| 函数 | 功能 | 
| :--------: | :--------: |
| lighten(@color,10%) | 返回一个比``@color``亮10%的颜色 |
| darken(@color,10%) | 返回一个比``@color``暗10%的颜色 | 
| saturate(@color,10%) | 返回一个比``@color``饱和度高10%的颜色 |
| desaturate(@color,10%) | 返回一个比``@color``饱和度低10%的颜色 |
| fadein(@color,10%) | 返回一个比``@color``透明度低10%的颜色，透明度低，颜色更深 |
| fadeout(@color,10%) | 返回一个比``@color``透明度高10%的颜色，透明度高，颜色更浅 |
| fade(@color,90%) | 返回一个透明度为0.9的颜色，等于fadeout(@color,10%) |
| spin(@color,10) | 返回颜色的hue值比``@color``大10度 |
| spin(@color,-10) | 返回颜色的hue值比``@color``小10度 |
| mix(@color-1,@color-2) | 返回``@color-1``和``@color-2``混合后的颜色 |

这些颜色运算函数会先将颜色转化为HSL色彩空间，然后在通道级别运算

### math函数

less还提供了几个math函数，用来处理数字

| 函数 | 功能 | 
| :--------: | :--------: |
| ceil(@number) | 向上取整 |
| floor(@number) | 向下取整 |
| round(@number) | 四舍五入 |

### 匹配模式

less匹配即判断是否满足条件，相当于switch或if-else if的用法，弥补了less不支持switchh和if的缺憾。
实例用法：

```
.special-border(top,@color){      // 匹配top 1
	border-top: 2px solid @color;
	border-top-left-radius: 10px;
	border-top-right-radius: 20px;
}
.special-border(bottom,@color){      // 匹配bottom 2
	border-bottom: 2px solid @color;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 10px;
}
.special-border(@_,@color){ //匹配所有  3
	border-right: 2px solid @color;
	border-left: 2px solid @color;
}

.content{
	.special-border(bottom, #73d79c);
	height: 200px;
	width: 200px;
}

```

上述代码中``.content``类匹配了2和3

### 导引
导引是对参数是否满足一定条件的匹配，不是对参数值得匹配。搭配when语句使用。

```
.class(@a) when(@a > 10){ ... }

.class(@a) when(iscolor(@a)){ ... }

.class(@this-media) when(@this-media = mobile){ ... }

.class(@a) when(@a){ ... } //仅当@a = true 时才可匹配

```

注意，在导引后的when语句中，若是只有单独的值，则除布尔值``true``以外的任何值都被视作假

### 导入

在文件开头通过关键字``@import``导入其他样式文件

```
@import "style.less"
@import "style"

@import "style.css"
```
以``.less``为后缀的文件的后缀名带不带均可
另： less不会处理``.css``的文件


### 变量作用域

less中的变量作用域和其他语言类似，首先会从本地查找变量或者混合模块，如果没找到的话会去父级作用域中查找，直到找到为止.

### 注释
两种注释方法，应注意其区别：

```
/*这是注释，编译为css后不会被滤掉*/

//这也是注释，编译为css后会被滤掉

```

## 使用

less可以在客户端使用，也可以在服务端使用

### 客户端使用

  1. 在html头部引入你的``.less``样式文件
  2. 在html头部引入``less.js``文件

上述引入文件的顺序不可颠倒

### 服务器端使用

  1. 先安装，最简便的方法是通过npm包管理器安装

```
$ npm install less

// 或安装最新稳定版本的 LESS
 $ npm install less@latest  
```

2. 在文件头部通过require引入less即可使用

### 在命令行中手动将less编译为css文件

```
$ lessc styles.less > styles.css
```

# 结语

less并未减弱css的任何强大之处，在任何时候都可以回退至原始css，同时让习惯动态语言的程序员可以更方便地编写less。与其功能类似的有sass，两者各有优点，都值得一学。


