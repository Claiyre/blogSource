---
title: JavaScript对象的深浅复制
date: 2017-03-29 21:43:10
tags: JavaScript
thumbnail: http://i2.muimg.com/567571/d5492541e11770e4.png
categories: JavaScript
---

>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>博客园地址：[http://www.cnblogs.com/nuannuan7362/](http://www.cnblogs.com/nuannuan7362/)
>如需转载，请在文章开头注明原文地址



# 前言

从层次上来看，对象的复制可以简单地分为浅复制和深复制，顾名思义，浅复制是指只复制一层对象的属性，不会复制对象中的对象的属性，对象的深复制会复制对象中层层嵌套的对象的属性。
在复制对象时，除了要复制对象的属性外，还要兼顾到是否保留了对象的constructor属性，是否对每一种数据类型（JavaScript常见的数据类型有String，Number，Boolean,Data,RegExp,Array,Funtion,Object）都实现正确的复制。项目中，我们可以根据实际情况，决定需要实现什么样程度的复制。
本文是我在复制对象方面的一些心得总结，由浅复制到深复制，由只复制简单属性到复制Function，RegExp等复杂属性，层层递进。如有陈述不当之处，烦请指出，不胜感激。

<!--more-->

# 正文

### 浅复制

浅复制只会依次复制对象的每一个属性，不会对这些属性进行递归复制。下面是一个简单的浅复制实现。

```
//对象浅复制                                                           
function shadowCopy(obj){
		if(typeof obj !== 'object' || obj === null)  return obj ;

        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }
```

仔细观察，不难发现上述方法的缺陷：
  1.不能正确实现数组的浅复制
  2.复制操作丢失了对象的constructor属性

好，我们现在已经发现了问题所在，只需针对性地解决，一个还算完美的浅复制对象的方法就诞生了！

```
//对象浅复制
    function shadowCopy(obj){
            if(typeof obj !== 'object' || obj === null)  return obj ;
            var newObj;

            //保留对象的constructor属性
            if(obj.constructor === Array){
                newObj = [];
            } else {
                newObj = {};
                newObj.constructor = obj.constructor;
            }

            for(var prop in obj){
                if(obj.hasOwnProperty(prop)){
                    newObj[prop] = obj[prop];
                }
            }
            return newObj;
        }
```

浏览器中测试一下：

```
	var arr1 = [0,1,2];
    console.log(arr1);
    console.log(shadowCopy(arr1));
    
    var arr2 = [0,1,2,[3,4,5]],
        arr2Copy = shadowCopy(arr2);
    console.log(arr2);
    console.log(arr2Copy);
    arr2Copy[3][0] = 6;
    console.log(arr2[3][0]);  //6
```

![](http://i4.buimg.com/567571/577c9855b9bf0430.png)

Good! 可以正确实现数组复制和并且保留constructor了，但细心的你一定发现了，浅复制后的对象的 `arr2Copy[3]` 和 `arr2[3]` 指向的是一个对象，改变其中一个，同时也会改变另一个。我们想要实现的是 **复制**，但这并不是复制呀！
这是浅复制的一个弊端所在，接下让我们看看深复制是怎样解决这个问题的。

### 深复制

深复制需要层层递归，复制对象的所有属性，包括对象属性的属性的属性....(晕~)
如果只是需要简单地复制对象的属性，而不用考虑它的constructor，也不用考虑函数，正则，Data等特殊数据类型，那这里有一个深复制的小trick，两行代码即可：

```
function deepCopy(obj){
    if(typeof obj !== 'object' || obj === null)  return obj ;
	var str = JSON.stringify(obj);

	return JSON.parse(str);
}
```

大多数情况下，上面的就可以满足要求了，但一些时候，我们需要把函数，正则等特殊数据类型也考虑在内，或者当前环境不支持JSON时，上面的方法也就不适用了。这时，我们可以通过递归来实现对象的深层复制，如下：

```
function deepCopy(obj){
    if(typeof obj !== 'object' || obj === null)  return obj ;
    var newObj;

    //保留对象的constructor属性
    if(obj.constructor === Array){
        newObj = [];
    } else {
        newObj = {};
        newObj.constructor = obj.constructor;
    }

    for(var prop in obj){
        if(typeof obj[prop] === 'object'){
            if(obj[prop].constructor === RegExp ||obj[prop].constructor === Date){
                newObj[prop] = obj[prop];
            } else {
                //递归
                newObj[prop] = deepCopy(obj[prop]);
            }
        } else {
            newObj[prop] = obj[prop];
        }
    }
    return newObj;
}
```
先用上面的例子测试：

![](http://i1.piimg.com/567571/e86a7c0b5191a6b1.png)

棒！可以正确实现多维数组的**复制**，再看是否能实现函数和正则的复制：

```
function Person(name){
    this.name = name;
    this.age = age;
    this.search = new RegExp(name);
    this.say = function(){
        console.log(this.name + "今年" + this.age + "岁了");
    }
}
var p1 = new Person("Claiyre",20),
    p2 = deepCopy(p1);

console.log(p1);
console.log(p2);

p2.age = 22;
p1.say();
p2.say();

```

![](http://i2.muimg.com/567571/2b2b14b3ad818535.png)

圆满完成！！

稍加整理，我们就可以得到一个较为通用的js对象复制函数：

```
function deepCopy(obj){
    if(typeof obj !== 'object' || obj === null)  return obj ;

    var newObj = obj.constructor === Array ? []:{};
    newObj.constructor = obj.constructor;

    if(window.JSON){
        //若需要考虑特殊的数据类型，如正则，函数等，把这个if去掉直接进入else内容即可
        newObj = JSON.parse(JSON.stringify(obj));
    } else {
        for(var prop in obj){
            if(obj[prop].constructor === RegExp ||obj[prop].constructor === Date){
                newObj[prop] = obj[prop];
            } else if(typeof obj[prop] === 'object'){
                //递归
                newObj[prop] = deepCopy(obj[prop]);
            } else {
                newObj[prop] = obj[prop];
            }
        }
    } 
    return newObj;
}

```


# 结语

面向对象的编程语言，其核心是对象，因此深入了解对象的相关操作，纵向比较异同，对学习过程是极有好处的。