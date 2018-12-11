                     /*原型链继承  通过让子类的原型是父类的一个实列（与基于通过原型构造对象）*/

/*
function SuperType(){
	this.colors = ['red', 'blue', 'geen'];
}
SuperType.prototype.getSuperValue = function(){
	return this.prototype;
}
function SubType(){	
}
//继承：
SubType.prototype = new SuperType();
//添加子类方法（在这里是重写）：
SubType.prototype.getSuperValue = function(){
	return false;
}
var instance1 = new SubType();
var instance2 = new SubType();
instance1.colors.push('black');
console.info(instance1.colors);
console.info(instance1.getSuperValue());
//var instance2 = new SubType();
console.info(instance2.colors);
console.info(instance2.getSuperValue());
*/

          /*基于构造函数    通过call或者apply改变作用域*/

/*
function SuperType(){
	this.colors = ['red', 'blue', 'green'];
} 
function SubType(){
	SuperType.call(this);
}

var instance1 = new SubType();
//var instance2 = new SubType();
instance1.colors.push('black');
console.info(instance1.colors);
var instance2 = new SubType();
console.info(instance2.colors);

console.info(instance1.hasOwnProperty('colors'), instance2.hasOwnProperty('colors'));

*/


                   /*组合式继承   原型共享方法  构造函数定义私有变量（及方法）*/

function SuperType(name){
	this.name = name;
	this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function (){
	console.info(this.name);
};
function SubType(name, age){
	SuperType.call(this);
	this.age = age;
}
//SubType.prototype = new SuperType();

function f(){};
f.prototype = SuperType.prootype;
SubType.prototype = new f();
/*subtype已经通过构造函数继承了supertype（包括属性） ，
没有必要/冗余再实列一个supertype赋值给subtype的原型（原型链继承） 
通过中间再加一层： subtype原型链继承到的是一个  
其原型继承了supertype原型的公函数（没有代码的函数）  
避免把父类的属性无谓的添加到子类的原型*/


SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function (){
	console.info(this.age);
};

var instance1 = new SubType("nicholas", 29);
instance1.colors.push('black');
console.info(instance1.colors);
instance1.sayName();
instance1.sayAge();


var instance2 = new SubType("greg", 27);
console.info(instance2.colors);
instance2.sayName();
instance2.sayAge();
console.info(instance1.hasOwnProperty('colors'), instance2.hasOwnProperty('colors'));





