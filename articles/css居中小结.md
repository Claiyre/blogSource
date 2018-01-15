---
title: css居中小结
date: 2016-12-09 22:04:55
tags: -css -定位
categories: CSS
thumbnail: http://i1.piimg.com/567571/ba2e23dd64ecb4ac.png
---

>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>如需转载，请在文章开头注明原文地址
>不为繁华易匠心

从css入门就开始接触，无所不在的，一直备受争议的居中问题。
css居中分为水平居中和垂直居中，水平居中方式也较为常见和统一，垂直居中的方法就千奇百怪了。本文是我积累的若干css居中的方法，先后讨论了块级元素的和行内元素的垂直居中和水平居中，特此记录下来与大家分享。如有叙述不当的地方，还望指出。o(*￣▽￣*)ブ
<!--more-->
***
**本文以下代码中 .outer是父元素的类名，.inner块级代表子元素,span代表行内子元素。**

## 水平居中
### 1. 行内元素的水平居中
直接设置其父元素
```
.ourter{
text-align: center;
}
```
![](http://p1.bpimg.com/567571/6d8f89e5e10fe43f.png)
不管有几个行内元素，一行代码即可搞定，so easy~
### 2. 块级元素的水平居中
也非常简单呐
设置该块级元素
```
div{
margin: 0 auto;                                                  
}
```
![](http://p1.bpimg.com/567571/11942f248ca97113.png)

**但是！但是！如果该元素的position为absolute的话，该方法会失效。**
我是这样理解的：margin为auto即相当于外边距的值是自动的，相对的，所以在绝对定位下将失效。不过还是可以将其margin设为具体数值滴。
## 垂直居中
有很多关于垂直居中tricks,博主在这里只介绍一些比较简单常用的
如果对高度没有要求的哈
### 1. 行内元素的垂直居中
1）如果对父元素的高度没有具体的要求的话，将父元素的padding-top padding-bottom设置为相同的值即可。
```
.outer{
padding-top: 60px;
padidng-bottom: 60px;                                                       
width：300px;
height: auto; /*注意：此时父元素的height不能是具体数值*/
}
```
 2）如果要求父元素的高度为具体数值时，且确保行内元素不会换行时，可以设置line-height等于父元素的高度

```
.outer{
width: 300px;
height: 200px;
line-height: 200px;                                                  
/*text-align: center; */                                    
}
```
此时，即可实现行内元素的垂直居中。若把最后一行加上，即可同时实现水平和垂直居中。
**但是！！！一定要确保不会换行，也就是只有一行。**
 3）在保持父元素具体数值宽度不变且有不止一行时，可以使用一点小tricks,比如
```
.outer{
text-align: center;                                                              
height: 200px;
width: 300px;
}
.outer::before{
content: " ";
height: 100%;
width: 1%;
display: inline-block;
vertical-align: middle;
}
/*html代码如下*/
<div id="outer">
    <span>span1</span>
    <span>span2</span>                                                
</div>
```
但是，注意：因为vertical-align是指**行内元素的基线相对于该元素所在行的基线的垂直对齐方式**，所以该方法只对行内元素有效
效果：
![](http://i1.piimg.com/567571/fc2b131eeefad29a.png)

### 2. 块级元素的垂直居中

1）如果已知子元素的高度，可以这样
```
.outer{
position: relative;                                                       
}
.inner{
height：50px;
width:50px;
position: absolute;
top: 50%;
margin-top: -25px;  /*该元素高度的一半*/                                  
}
```
**注意子元素和父元素的position，切记父元素的position是relative**

![](http://p1.bpimg.com/567571/6d32f20decdd1d04.png)
2）如果不知道子元素的高度，可以利用css的transform属性，对1）进行小改动，如下：
```
.outer{
position: relative;                                                         
}
.inner{
width:50px;
position: absolute;
top: 50%;
transform: translateY(-50%);                                                    
}
```
3）但以上两种方式对于有多个块级子元素的情况就不适用了，比如，这样的情况
![](http://i1.piimg.com/567571/1495e37bb76013be.png)
这时我们可以用一个div把所有子元素包裹起来，变成一个子元素，然后就可以继续使用上面的方法了。

**最最后！上面的所有方法都是在不使用flex的前提下的才使用的！解决居中问题最爽的当然是flex布局啦，O(∩_∩)O~~ **
什么？！还不会使用flex布局？赶紧点下面~

[flex布局学习总结](https://claiyre.github.io/2016/11/26/fle%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93/)
使用flex，管它是行内元素还是块级元素，管它有几个元素，统统搞定！
举个栗子！
实现多个块级元素的垂直加水平居中
```
.outer{
display: flex;
justify-content: center;                                                              
align-items: center;
flex: 0 0 auto;
/* flex-direction: column;  */
}
```
效果图如下:
![](http://p1.bqimg.com/567571/e6bb0c95009a9515.png)

如果加上最后一行，则竖直排列子元素，即：

![](http://p1.bqimg.com/567571/612652c9872724c0.png)
 
是不是很简便腻~O(∩_∩)O哈！




