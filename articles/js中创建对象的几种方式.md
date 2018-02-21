---
title: js中创建对象的几种方式
date: 2017-02-05 17:01:39
tags: JavaScript
categories: JavaScript
thumbnail: http://p1.bpimg.com/567571/8005d114e2ce3f4c.jpg
---

>博客原文地址：[Claiyre的个人博客 https://claiyre.github.io/](https://claiyre.github.io/)
>博客园地址：[http://www.cnblogs.com/nuannuan7362/](http://www.cnblogs.com/nuannuan7362/)
>如需转载，请在文章开头注明原文地址
>士不可以不弘毅，任重而道远。



# 前言
不管是哪门语言，千变万化不离其宗，深入理解其本质，方能应用自如。对应到js，闭包，原型，函数，对象等是需要花费大功夫思考、理解的。本文穿插了js原型和函数的相关知识，讨论了批量创建对象的几种方式以及它们的优缺点。
<!--more-->

# 正文

说起创建对象，最容易想到的便是通过对象字面量方式直接定义一个对象吧，但这种方式只能创建少量，单独且相互间无联系的对象。若要批量创建对象，该如何？

### 工厂模式

工厂模式非常直观，将创建对象的过程抽象为一个函数，用函数封装以特定接口创建对象的细节。如下所示：
```
function createStudent(name,sex,grade){						
	var o = new Object();
	o.name = name;
	o.sex = sex;
	o.grade = grade;

	o.sayName = function(){
		console.log(this.name);
	}
	return o;
}
var s1 = createStudent('Claiyre','famale',1);
```

通俗地讲，工厂模式就是将创建对象的语句放在一个函数里，通过传入参数来创建特定对象，最后返回创建的对象。
**工厂模式虽然可以创建多个相似的对象，但却不能解决对象标识的问题，即怎样知道一个对象的类型**。构造函数模式应运而生。

### 构造函数模式

构造函数模式是java语言创建对象的通用方式。两种语言用构造函数创建对象的方式略有不同，注意区别。
在JavaScript中没有类的概念，函数即为一等公民，因此，不必显式声明某个类，直接创建构造函数即可，类的方法和属性在构造函数中（或原型对象上）处理。构造函数模式的示例代码如下：
```
function Student(name,sex,grade){				
	this.name = name;
	this.sex = sex;
	this.grade = grade;
	this.sayName = function(){
		console.log(this.name);
	}
}
var s2 = new Student('孙悟空'，'male',2);
```
细心的朋友一定发现了构造函数的函数名首字母是大写的，而普通函数首字母则是小写，这是众多OO语言约定俗成的规定，虽然大多数情况下不大写也不会报错，但是为了代码的规范性和可读性，还是应该将构造函数的首字母大写，与普通函数区别开。
与工厂模式相比，用构造模式创建对象有以下几点不同：

  - 没有显示地创建对象
  - 直接将属性和方法赋给this对象
  - 没有return语句

此外，还应注意到要创建Student的实例，必须要使用new操作符，创建的实例对象将有一个constructor（构造器）属性，指向Person构造函数。调用构造函数创建对象经过了以下几个过程：

  - 创建一个新对象
  - 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）
  - 执行构造函数中的代码
  - 返回新对象（不需要显式返回）

构造函数虽好用，但也不是没有缺点。使用构造函数的主要问题是：**每个方法都要在每个实例上创建一遍**。在ECMAScript中，函数即对象，因此每定义一个函数，也就是实例化了一个对象。下面的例子证明了这个缺点。

```
var s3 = new Student('唐僧','male',3);                   
var s4 = new Student('白骨精','female',4);
s3.sayName();
s4.sayName();
console.log(s3.sayName == s4.sayName);
```

运行结果：
![](http://p1.bpimg.com/567571/3359b736833b0818.png)

也就是说通过构造函数实例化的多个对象的方法，是多个不同的方法，但它们内部的代码以及实现的功能是相同的，这就造成了一定的资源浪费。
幸运的是，这个问题可以用原型模式来解决。

### 原型模式

js中，每个函数都有一个`prototype`属性，它是一个指针，指向一个对象，叫做原型对象，原型对象包含了**可以由特定类型的所有实例对象共享的属性和方法**。此外，这个对象有一个与生自来的属性`constructor`，指向创建对象的构造方法。
使用原型模式可以让所有的实例共享原型对象中的属性和方法，也就是说，不必再构造函数中定义对象实例的信息。用代码表示如下：

```
function Student_1(){

}
Student_1.prototype.name = 'Claiyre';
Student_1.prototype.sex = 'female';
Student_1.prototype.class = 5;
Student_1.prototype.sayName = function (){
	console.log(this.name);
}

var s5 = new Student_1();                              
s5.sayName();    //Claiyre
var s6 = new Student_1();
s6.sayName();    //Claiyre
```
一张图胜过千言万语，下图清楚地阐释了各个对象和原型对象间的关系：
![](http://p1.bpimg.com/567571/1538bfc566a89b93.png)

了解过原型后，可以继续在实例对象上增添属性或方法：

```
s6.name = 'John';                             
s6.sayName();       //John
```

当要读取某个对象的属性时，都会执行一次搜索，搜索首先从对象实例本身开始，如果在实例中找到了这个属性，则搜索结束，返回实例属性的值；若实例上没有找到，则继续向对象的原型对象延伸，搜索对象的原型对象，若在原型对象上找到了，则返回原型上相应属性的值，若没有找到，则返回`undefined`。因此，实例对象属性会覆盖原型对象上的同名属性，所以上面第二行代码输出的是John。

  - `Object.getPrototypeOf(object)`方法返回参数对象的原型对象。
  - `Object.keys(object)`方法返回对象上课枚举的实例属性。

原型中的所有属性都是被所有实例所共享的，这种共享对于函数来说非常合适，对于包含基本值的属性也说的过去（实例属性会覆盖原型同名属性），但对于那些包含引用类型的属性，可有大麻烦了

```
Student_1.prototype.friends = ['aa','bb'];              

console.log('s6的朋友' + s6.friends);
s5.friends.push('cc');
console.log('s5的朋友' + s5.friends);
console.log('s6的朋友' + s6.friends);
```

运行结果：
![](http://i1.piimg.com/567571/a81173a51ef0b9d4.png)

问题来了，我们只想改变s5的朋友列表，但由于原型模式的共享本质，s6的朋友列表也随之改变了。
因此，很少单独使用原型模式。

### 组合使用构造函数和原型模式

构造函数模式用于定义实例属性，原型模式则用于定义方法和共享的属性。这种混合模式不仅支持向构造函数传入参数，还最大限度地节约了内存，可谓是集两模式之长。示例代码如下：

```
function Student(name,sex,grade){					
	this.name = name;
	this.sex = sex;
	this.grade = grade;
}

Student.prototype.sayName = function(){
		console.log(this.name);
}
Student.prototype.school = 'Joooh school';
```
### 其他模式

除了以上几种常见的模式外，批量创建对象的方式还有

  - 动态原型模式：仅在第一次调用构造函数时，将方法赋给原型对象的相应属性，其他示例的处理方式同构造函数模式
  - 寄生构造函数模式：仅仅封装创建对象的代码，然后再返回新创建的对象，仍使用`new`操作符调用
  - 稳妥构造函数模式：没有公共属性，只有私有变量和方法，以及一些`get/set`方法，用以处理私有变量。

# 结语

每种模式都有各自的优缺点，具体要使用哪种，还需结合实际场景，深入理解，灵活运用。
