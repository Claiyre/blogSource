---
title: JavaScript函数学习总结(一)---函数定义
date: 2016-12-03 12:02:39
tags: JavaScript
categories: 学习总结
thumbnail: http://p1.bpimg.com/567571/59034b879f3464aa.png
---
在许多传统的OO语言中，对象可以包含数据，还可拥有方法，也就是属于该对象的函数。但在JavaScript中，函数也被认为是一个对象，一个Function对象，因此函数被称为JavaScript的`一级公民`（ first-class objects）！
<!--more-->
>博客原文地址：[Claiyre的个人博客](https://claiyre.github.io/)
>如需转载，请在文章开头注明原文地址

### 普通函数定义与初始化  
1.通过构造器Function
我们知道，JavaScript中Array，Date等基本类型的声明是通过其对应的构造器（关键字）来声明的。如

```
var arr1 = new Array();   #声明一个空数组
var date1 = new Date();   #声明一个时间对象，获取当前时间
```
与定义其他基本对象类型如Array，Date一样，JavaScript的函数是通过关键字Function来定义并初始化的
```
 new Function([arg1],[arg2](,[arg3,...]),functionBody);
```

举个栗子

```
var f1 = new Function('name','age','console.log("hello," + name);console.log("You are " + age)');
f1("Claiyre",20);

```
当然，除了这种‘吃力不讨好’的定义方法外，你还有其他更简洁的方法来定义一个函数！

2.通过函数声明（function statement）
语法：
```
function name([arg1,[,arg2,[...argn]]]) {
   functionBody;
 }
```
 name是指定的函数名，arg是函数的参数，可以为任意多个（当然，不能超过可以表示的范围），functionBody为函数体。
栗子如下
```
function sayHi (name,age){
       console.log("hello," + name);
       console.log("you are " + age);
 }
```
3.通过函数表达式（function expression)
语法

```
   function [name]([arg1,[,arg2,[...argn]]]) {
       console.log("hello," + name);
       console.log("you are " + age);
   }
```

4.总结
   * 方式2和方式3拥有几乎相同的语法，极其相似。但聪明的你一定发现了它们的不同之处了对不对O(∩_∩)O——函数表达式定义一个函数时可以省略函数名，从而创建一个匿名函数或一个立即执行函数(IIFE)。
   * 相比于方式2和方式3，方式1用Function构造器声明函数的方式更为低效，因为后者生成的对象是在函数被创建时解析的，前者是和其他代码一起解析的。
   * 通过函数调用的方式调用Function 的构造函数（不用new关键字）跟方式1是一样的
   * 使用Function构造器，并不会在创建它的上下文(Context)中创建闭包，所以它们只能访问自身局部变量和全局变量，相当于它们总是在全局作用域中被创建的，即便实际并不是！

```
myName = 'outer';
var person = {
                myName: 'inner',
                sayHi: new Function('like','console.log("I am "+ myName + "!I like " + like)')
            };
 person.sayHi("banana");
```
结果如下：
![](http://p1.bpimg.com/567571/e00ccdd2bd6a618c.png)

### generator（生成器）函数的定义
generator是ES6标准引入的新的数据类型，旨在利用生成器函数返回一个对象，该对象遵守迭代器协议，而generator的环境(context)在每次执行后都会被保存，以便迭代器对象再次使用，每次迭代就相当于生成一个新的函数，这也是命名为generator（函数生成器）的缘故吧。迭代器协议是ES6标准引入的新协议之一，具体参见 [the iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)

与普通函数类似，generator函数也有三种定义方式，但与普通函数稍有不同，具体如下
1. 通过GeneratorFunction构造器
``` 
    new GeneratorFunction ([arg1[, arg2[, ...argN]],] functionBody)
```
2. 通过function* 声明（function* statement）
```
    function* name([param[, param[, ... param]]]) {
         statements
     }
```
3. 通过function*表达式（function* expression）
```
    function* [name]([param1[, param2[, ..., paramN]]]) {
       statements
    }
```
调用一个生成器函数并不会立即执行它的主体，而是返回一个与该函数对应的迭代器对象，当调用这个迭代器对象的**next()**方法时，生成器函数的主体才会被执行，直到遇见第一个 **yield表达式**

#### 纸上谈兵终觉浅，我们来看一个例子

```
function* idMaker(){
  var index = 0;
  while(index < 3)
    yield index++;
}

var gen = idMaker();   // 此时并没有执行idmaker的主体

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // undefined
```
即可用**yield**指定要返回的值，也可用 **yield\*** 委派另一个generator函数对象  

如下
    
```
function* generatorOne(index){                                                 
   yield index;
   yield* generatorTwo(index);
   yield index+10;
}

 function* generatorTwo(index){
   yield index+1;
   yield index+2;
   yield index+3;
}

var ge = generatorOne(10);                                                                
console.log(ge.next());   
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
console.log(ge.next());
```
运行结果如下：
![](http://p1.bpimg.com/567571/0b42a32b3df47f38.png)

我们可以看到**ge.next()**返回了一个对象，该对象有两个属性，value是其返回的值，done代表迭代器是否迭代到了尽头

generator就像是一个不用占用任何全局变量就可以记住执行状态的函数，它的好处当然不只是上面例子那样简单，关于优点和用处，个人认为廖雪峰老师写的已相当不错，参见[generator](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/00143450083887673122b45a4414333ac366c3c935125e7000)  

### 箭头函数的定义

ES6标准有一个深受广大程序猿喜爱的新属性，那就是箭头函数。它的定义就是用一个箭头。其具体语法如下
```
let add = x => x+1 ;
add(10);   //11
```
是不是很简便呢？

当然如果有多个参数的话，需要给所有参数加上括号
```
let add = (x,y) => x+y ;
add(5,6);
```
以此类推，如果函数体有多条语句的话，也应该给函数体加上**{}**
此外，箭头函数的另一个特殊之处是它的this总是指向词法作用域，不能被改变,比如：
```
var myName = "outer";
var person = {
    myName:"inner",
    age:20
};
var sayHi= ()=>console.log(this.myName);
sayHi();                                  //outer
sayHi.call(person);                       //outer
``` 

参考资料：
[MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)