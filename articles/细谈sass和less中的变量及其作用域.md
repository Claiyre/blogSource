---
title: 细谈sass和less中的变量及其作用域
date: 2017-02-23 12:55:30
tags: [less, sass]
categories: CSS
thumbnail: http://i1.piimg.com/567571/c2bdc6fce744ee3a.png
---


>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>博客园地址：[http://www.cnblogs.com/nuannuan7362/](http://www.cnblogs.com/nuannuan7362/)
>如需转载，请在文章开头注明原文地址


# 前言

众所周知，css是静态语言，虽功能强大，但用起来还是略微不爽，于是便有了动态样式语言，sass和less。动态样式语言的精髓就在于其有了变量，其中的诸多功能都是建立在变量之上的。因此，彻底弄懂sass和less中变量的异同之处，是学好它们的关键！
本文由浅至深，逐步展开介绍，并从大家所熟知的JS变量的角度，讲述sass和less变量作用域。

<!--more-->

# 正文

sass和less都允许使用变量，且对变量的类型没有限制，这一点和js极为相似，非常灵活。但两者的不同都有哪些呢？

### 变量标识符不同

sass中规定，以美元符号 ``$`` 开头的即表示变量，而less中以符号 ``@`` 开头表示变量。这点很容易理解，不再多说。

### 变量插值方式不同

在两种语言中，变量都可以以一定的方式插入到字符串中去，这个特性极为有用，但两种语言的插入方式不同，具体请看下例：

```
//sass 中

$direction: left;
.myPadding{
	padding-#{$direction}: 20px;                             
}

//less中

@direction: left;

.myPadding{
	padding-@{direction}: 20px;
}


//编译后的css代码是相同的，如下：

.myPadding{
	padding-left: 20px;
}
```

### 变量作用域

在sass **3.4.0**之前，sass可以说是没有局部变量和全局变量之分的，即后声明的同名变量总是会覆盖之前的同名变量，不管后声明的变量是位于何处。
此时，less和sass的变量作用域有很大的不同之处。先看一段熟悉的js代码：

```
//代码块A

var a = 1;
(function (){
	a = 5;
	alert(a);             //a = 5;
})();
alert(a);                 //a = 5;
```

由于闭包的作用，匿名函数内部可以引用到外部的变量a,因此上面的代码可以正常运行。再来看下面这个:

```
//代码块B

var a = 1;
(function (){
	var a = 5;
	alert(a);             //a = 5;
})();
alert(a);                 //a = 1;
```

了解js链式作用域的朋友一定秒懂了上面的代码。
在匿名函数的内部声明了一个局部变量，局部变量并不会影响全部变量，所以代码最后输出的仍然是1。

那么回到正题，sass 3.4.0之前 的变量设计思想是类似于**代码块A**的，即不带关键字``var``的局部变量声明，而less的思想类似**代码块B**，带关键字``var``的局部变量声明。

看到这，很多人估计就想开始吐槽sass不人性化的设计了，万一我一不小心声明了一个局部变量，它和某个全局变量同名了，那不岂不是要酿成大祸！
大家先别急着吐槽，人家sass这不是也改进了嘛~ 而且sass不仅改了，还附送了彩蛋 ``!global``

[sass官网](http://sass-lang.com/documentation/file.SASS_CHANGELOG.html)上 3.4.0版本的 **Backwards Incompatibilities – Must Read!** 中有这样一条：

> All variable assignments not at the top level of the document are now local by default. If there’s a global variable with the same name, it won’t be overwritten unless the !global flag is used. For example, $var: value !global will assign to $var globally. This behavior can be detected using feature-exists(global-variable-shadowing).

翻译过来便是：没有位于第一层（全局）的变量声明现在都被默认为是局部的。如果存在一个同名的全局变量，这个全局变量也不会被重写，除非同名的局部变量被声明时使用关键字``!default``。

举例说明：

```
$color: blue;
a{
	$color: red;
	color: $color;         //red
}
p{
	color: $color;         //blue
}

//但是，若使用 !global

span{
	$color: yellow !global;
	color: $color;               //yellow
}
div{
	color: $color;               //yellow
}

``` 

上面的代码没有什么实际意义，但作为例子，简洁明了便好。

有一点需要说明的是，sass 3.4.0 是在14年8月份发布的，但现在网上的关于sass变量的文章对作用域的说明，大多仍旧停留在3.4.0之前。希望大家能注意sass这个重要的改进，以免在开发过程中带来不便。在此也得出一个血泪教训，尽量看英文官方文档啊啊啊啊



# 结语 

sass和less两种动态样式语言的诞生，赋予了css更大的灵活性，在学习使用的过程中，一定要注意区分两者的不同，灵活运用。

参考：

- [http://www.w3cplus.com/preprocessor/sass-basic-variable.html](http://www.w3cplus.com/preprocessor/sass-basic-variable.html)
- [http://sass-lang.com/documentation/file.SASS_CHANGELOG.html](http://sass-lang.com/documentation/file.SASS_CHANGELOG.html)


以上仅我个人见解，如有错误之处，欢迎指正。如您觉得我的文章对您有帮助，请点击下方“推荐”，让更多的人看到。

