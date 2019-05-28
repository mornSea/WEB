/*
var num = [4, 53, 45, 24, 45, 23, 345, 54, 345, 234, 46,234,23];

num.sort(compare);
console.log(num);

function compare(a, b){
	return a - b;
}

var num2 = num.slice(1, 4);
console.log("indexof 6", num.indexOf(6));



//迭代与归并
console.log("use every test is big then 6", num.every(function(item, index, array){return (item > 6); }));
 
console.log("use filter return big then 4", num.filter(function(item, index, array){return (item > 4); }));

console.log("use some num any one is bog then 2", num.some(function(item,index, array) { return (item > 10);}));

console.log("use map return any one times 3: ", num.map(function(item, index, array) {return (item * 2);}));

console.log("use foreach  to any one do smt", num.forEach(function(item, index, array) {return (item + 5);} ));


console.log("use reduce return then num sum", num.reduce(function(prev, cur, index, array){return prev + cur}));

console.log("use reduceRight return then num timessum", num.reduce(function(prev, cur, index, array){return prev * cur}));


var sd1 = new Date(Date.parse("May 13, 2019"));
console.log("parse(默认)", sd1);

var sd = new Date(Date.UTC(2019, 3, 26, 14, 28, 15));
console.log("UTC", sd);/

   
//RegExp   g全局  i(不g分大小c写  mop匹配多行D)  s所有元z字符s都要y用‘/’转义 ([{\^$|)?*+.]}

var pattern1 = /[bc]at/i;			//匹配第一个bat或者cat  不区分大小写
var pattern2 = new RegExp("[bc]at", "gim");	//与上同 但是全部查找
text = "sdgj;lsv;BaTljn;kCAtsdgklnv;batjkldvn;jkncAtgef";
var result1 = pattern1.exec(text);
var result2 = pattern2.exec(text);
console.log(result1);
console.log(result2);
*/

/* 
//函数
function sum (num1, num2) { return num1 + num2 };				//函数声明  会提升到文件顶
var sum = function (num1, num2) {return num1 + num2};			//函数表达式 执行到这一行才执行  更推荐声明
callsomefunction (sum, (10, 23));							 	//将函数作为参数传递

function returnsomefunction (propertyName){						//返回函数的函数
	return function(obj1, obj2){
		var value1 = obj1[propertyName];
		var value2 = obj2[propertyName];

		if (value1 < value2){
			return -1;
		}else if (value1 > value2){
			return 1;
		}else{
			return 0;
		}
	};
}

function factorial(num){											//利用函数的参数对象 和callee（指向拥有这参数的函数）来解除函数名耦合
	if(num <= 1){
		return 1;
	}else{
		return num * arguments.callee(num-1);
	}
}

var o = {};
window.color = "bule";
var o.color = "bule";
function saycolor (){console.log(this.color);}
//thisz指向函数当前环境 全局时this是window  
function inner(){console.log(arguments.callee.caller)};		//更松耦合  caller保存 调用当前函数的函数 的引用

function callsum(num1, num2){return sum.call(this, num1, num2)};
//函数的call 与 apply方法在特定的作用域里调用函数 即设置this的值 
//都是是第一个参数为this  call其余传给函数  apply其余是参数数组

function applysum(num1, num2){return sum.apply(this, [num1, num2])}
var objsaycolor = saycolor.bind(o);
objsaycolor();		//bind: 创函数实例 其this绑定在传给bind的值

 */

 /* 
//基本包装类型
var text = new string(" hello, world ! ");
console.log(text.concat("用concat连接字符串"))
console.log("用trim清除两侧空格", text.trim())
for (i=0; i<text.length; i++){
	console.log(text.charAt(i), "   ");			//返回指定位置字符
	console.log(text.chatCodeAt(i), " ");		//返回指定字符编码
}
 
//创新字符串方法 slice substr substring 参数为：开始位置，结束位置
console.log("slice 剪切", text.slice(3, 7));
console.log("用idexOf搜索o返回位置",  text.indecOf(o))
console.log("用toLowerCase  / toUpperCase大小写转换", text.toUpperCase());

//字符串操作
console.log("用match/search模式匹配", text.match(/orl/i));
console.log("用replace替换（regext/字符串， 字符串/函数）  全替换（全局regext， 要替换成的字符串）", text.replace(/o/g, "g"));
console.log("split分割为数组", text.split("o"));
console.log("localeCompare比较字符串 参数排在字母表前返回负数", text.localeCompara("rfd"));


//global  全局对象
console.log("url编码", encodURIComponent(text));
//math
console.log("math.random返回个0到1的随机数 乘以范围 外再用floor向下舍入整数", Math.floor(Math.random()*987));



//getter   setter  读取/写入对象的属性
var book ={
	_year: 2004,
	edition: 1
}
Object.defineProperty(			//必须通过这个方法定义访问器属性
	book, "year", {
		get: function(){
			return this._year;
		},
		set: function(){
			if(newValue > 2004){
				this._year = newValue;
				this.edition += newValue - 2004;
			}
		}
	}
);
book.year = 2005;
console.log(book);

 */

/* 
//object  用组合 构造函数+原型模式创建对象
function Person(name, age, job){
	this.name = name;
	this.age = age;
	this.job = job;
	this.friends = ["sby", "art"];
}
Person.prototype = {
	constructor : Person,					//constructorg构造函数
	sayName: function(){
		console.log(this.name);
	}
}
var person1 = new Person("nic", 29, "cxy");
var person2 = new Person("gre", 27, "gcs");
person1.friends.push("cen");
console.log(person1);
console.log(person2);
 */

//组合继承 /寄生组合式
function SuperType(name){
	this.name = name;
	this.colors = ["bule", "dark"];
}
SuperType.prototype.sayName = function () {
	console.log(this.name);
};
function SubType(name, age){			//继承属性
	SuperType.call(this, name);
	this.age = age;
}
/*  //继承方法：
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
	console.log(this.age);
}

var instance1 = new SubType("nic", 29);
instance1.colors.push("black");
console.log(instance1.colors);
instance1.sayName();
instance1.sayAge();

var instance2 = new SubType("fgic", 23);
instance1.colors.push("green");
console.log(instance1.colors);
instance1.sayName();
instance1.sayAge(); */

 
//寄生组合式   基本同上   改善组合继承中（继承方法时）要调用两次超类型构造函数 + 调用子类型构造函数时重写    

function inheritprototype(subType, superType){			//原型链（混成）继承函数
	var prototype = Object(superType.prototype);		//创建对象
	prototype.constructor = subType;					//增强对象
	subType.prototype = prototype;						//指定对象
}
inheritprototype(SubType, SuperType);  

SubType.prototype.sayAge = function(){
	console.log(this.age);
}

var instance = new SubType('asdfg', 23);
instance.sayName();
instance.sayAge();

//函数表达式  （匿名函数  拉姆达函数）
var sayHi, condition;
if(condition){
	sayHi = function(){
		console.log("hi");
	}
}else{
	sayHi = function(){
		console.log("yo");
	};
}
sayHi();


//闭包  （常在一个函数里创建另一个函数）访问另一个函数作用域中变量(整个变量对象)  不同与函数内匿名函数  
/* 
function createFunction(){			//反例  
	var result = new Array;

	for (var i=0; i < 10; i++){
		result[i] = function(){
			console.log(i);				//因为闭包保存整个变量对象 因为每个闭包函数的作用域链都保存外部函数活动对象 引用同一个i（时间上） so都返回10
		}
	}
}
createFunction();
 */
function createFunction(){		
	var result = new Array;
	for (var i=0; i < 10; i++){
		result[i] = function(num){
			return function(){
				return num;				//定义个匿名函数 将立即执行的结果赋值给数组 
			};							//调用匿名函数时穿入i  对应参数num  由于参数按值传递（i->num）
		}(i);							//又在匿名函数里再建个访问num的闭包 这样result数组的每个函数都有自己num变量的副本（）
	}									//js里 函数作用域不是在执行的地方 而是在定义的地方
}
createFunction();

		//闭包中的this
var name = "window";

var object = {
	name: "obj",
	gatName: function(){
		var that = this;
		return function(){
			return that.anme;
		};
	}
};
console.log(object.gatName()());	//()(): 创建并立即调用函数  不会在内存中留下对函数的引用
//还可以用闭包实现私有变量（即函数内变量）： 闭包实现公有方法  用构造函数/原型模式制造特权方法（访问私有变量）



































