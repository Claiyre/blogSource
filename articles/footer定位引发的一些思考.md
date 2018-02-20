---
title: footer定位引发的一些思考
tags: ['position', 'height: 100%']
categories: CSS
---

定位是一个极其常见的需求，用到的css属性也是很基础的，像position，height等。但前些天写博客主题，接连定位博客footer不成功，才意识到即便是这么简单的属性，其中也蕴含着‘大道理’。
当时自认为遇到了一些很奇怪的问题，查阅了相关资料后才发现其实是一些基本概念没弄清楚，比如：
- 相对高度的相对是根据谁来计算的？
- 怎么确定绝对定位元素的包含块？
- 绝对定位和相对定位元素的相对高度计算规则是否一样？相对最小高度（min-height）呢？
- 什么是 `initial containing block`, 初始包含块的大小怎么算？

ok，先抛开这些问题，回到定位footer。

为了便于叙述，我们把一个页面抽象为三部分，页面头部、页面底部和页面主体内容部分，下文中分别用header、footer和content来指代这三部分。

通常情况下，footer的高度是固定的，content的高度不固定。footer的定位通常有两个要求：

1. 当页面高度小于视图(viewport)高度时，footer在视图底部
2. 当页面高度大于视图高度时，footer在页面底部

考虑到以上，有两种思路
- footer使用绝对定位且`bottom: 0`，footer的包含块的高度 = max(视图高度，页面高度)
- 用一个额外的标签包含header和content，footer使用margin负值

### footer绝对定位
绝对定位的语法没啥可说的，其位置（top/bottom/left/right）是相对该元素的包含块来说的，所以定好位的关键是找准元素的包含块。

html结构如下
```html
<body>
  <div class="wrap">
    <div class="header">This is header</div>
    <div class="content">This is content</div>
    <div class="footer">This is footer</div>
  </div>
</body>
```

footer设置绝对定位
```CSS
.footer {
  position: absolute;
  height: 100px;
  bottom: 0;
  width: 100%;
  background: blue;
}
```

若只是这样，footer总是在视图底部，即便页面高度大于视图高度，并没有达到我们想到的效果。

为什么呢？

分析一下，绝对定位元素的位置是相对其包含块来说的，那么绝对定位元素的包含块是谁？

[w3.org 10.1节关于containing block的介绍：](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details)

> If the element has 'position: absolute', the containing block is established by the nearest ancestor with a 'position' of 'absolute', 'relative' or 'fixed', in the following way:

> In the case that the ancestor is an inline element, the containing block is the bounding box around the padding boxes of the first and the last inline boxes generated for that element. In CSS 2.1, if the inline element is split across multiple lines, the containing block is undefined.

> Otherwise, the containing block is formed by the padding edge of the ancestor.

> If there is no such ancestor, the containing block is the initial containing block.

简而言之，绝对定位元素的包含块是position为absolute/relative/fixed的最近的祖先元素，如果没有这样的祖先，那就是初始包含块。

[w3c对初始包含块的介绍: ](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details)

> The containing block in which the root element lives is a rectangle called the initial containing block. For continuous media, it has the dimensions of the viewport and is anchored at the canvas origin; it is the page area for paged media. 

根元素的包含块是初始包含块，对于`continuous media`来说，它的尺寸和视图尺寸一样大。

回到footer定位
可以发现footer现在的包含块就是初始包含块，所以footer会一直在视图底部。


包含块可以是任意祖先元素，若其高度要等于max(视图高度，页面高度)，footer的位置即可满足条件。

那就给footer找一个合适的祖先元素咯~

```CSS
html, body {
  height: 100%;
}
.wrap {
  position: relative;   /* 使wrap成为footer的包含块，也可以是absolute/fixed */
  min-height: 100%;     
  padding-bottom: 100px; /* 给footer留空间 */
  box-sizing: border-box;
}
```
[demo1](https://codepen.io/Claiyre/pen/xYWXde)

这里的关键是给把html和body的高度指定为100%，MDN上对相对`min-height`有这样的介绍：

> The percentage is calculated with respect to the height of the generated box's containing block. If the height of the containing block is not specified explicitly (i.e., it depends on content height), and this element is not absolutely positioned, the percentage value is treated as 0.

翻译过来就是相对高度是根据其包含块的高度计算的，若包含块的高度没有被明确指定，且该元素不是绝对定位元素，则这个相对高度被视作0

这里相对定位元素wrap的包含块是它的父元素body，若不指定body的高度，wrap的min-height就相当于0，若不指定html的高度为100%，html的默认高度是其content高度，当content的高度不足时，footer在wrap底部但不在视图底部。

但是在一些情况下，wrap和body之间有多个元素，即body并不是wrap的直接父元素，我们不便强制要求wrap的所有祖先元素都 `height: 100%`，这时该怎么办呢？

考虑绝对定位呀！

绝对定位元素的包含块，不总是其父元素，利用这点。

```CSS
.wrap {
  position: absolute;
  min-height: 100%;
  padding-bottom: 100px;
  box-sizing: border-box;
  width: 100%;
}
```
[demo2](https://codepen.io/Claiyre/pen/ZrxXrq)

这样wrap的包含块就变成了初始包含块，其高度是视图高度，所以wrap的最小高度就是视图高度咯！
完成~

### 添加额外标签
第二种思路是把除footer外的其他部分用一个父元素包裹起来，形成这样的结构

```html
<body>
  <div class="container">
    <div class="header">This is header</div>
    <div class="content">This is content</div>
  </div>
  <div class="footer">This is footer</div>
</body>
```
css样式

```css
html, body{
  height: 100%;
}
.container {
  min-height: 100%;
  box-sizing: border-box;
  padding: 100px;       /* footer的高度 */
}
.footer {
  height: 100px;
  margin-top: 100px;
  background: blue;
}
```

这种方法给header和content添加了一个额外的标签，语义化结构不如第一种好，但易于理解。
