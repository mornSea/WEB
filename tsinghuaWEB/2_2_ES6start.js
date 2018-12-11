//环境搭建：  node + npm + babel（新标准 to 旧标准转译器）
//对新特性的支持： shim（基于已有的功能/库封装API） polyfill（基本相同  但是更加贴近标准）





/*

//babel用法：
() => {}

object.assign({}, {});   //对对象进行扩展  添加新属性

bash中用 babel  此文件名.js  -o   新文件名.js     会编译一个新文件在同一个文件夹里面 第五行变成  (function() {});


在.babelrc里面有2行  presets： ['es2015']   还有一行是注释了的plugins     这个表示要不要编译l内置的api


*/



/*

//let:  不用函数(产生闭包)  可以直接在块级作用域{}声明变量

{
	let a = 1;
	var b = 2;
}

console.info(a);   //外面无法访问块级作用域的值
console.info(b);  //但是var可以  因为有y提升？



//因此  闭包有了新方法

//旧:
var a = [];
for (var i = 0; i < 10; i++){
	a[i] = function(){
		console.log(i)	
	};
}
a[6]();     //out 10


新：
var a = [];
for (let i = 0; i < 10; i++){
	a[i]= function() {
		console.log(i);
	};

}
a[6]();    //out : 6







//let没有变量提升
console.log(a);
let a = 1;
consoel.log(b);
var b = 2;





//const 与 let 区别：  const 声明常量  let 可以改变但是不可以重复声明
function  f() {
	{
		let a;
		{
			const a = 'ok';   //right
			const a = 'error';    //eror
		}
		a = 'ok1'; // ok
		let a = 'ok2' //error
	}
}

*/




//   =>
//函数表达式写法：  不能替换函数声明  它没有n名字
(function(a){return a * 2;});

(a) => {return a * 2;}   // 用 => 代替function

(a) => a * 2     //直接返回值 去{}

a => a * 2      //单参数 去（）


//=>返回对象:
 
const funcObj = name => {name, age: 27}; //error   因为无法判断{}是对象还是函数的界定符  

const funcObj = anme => ({name, age: 27});  //right



//=>设置默认参数值：  (g圆括号里面赋值)
const  addfunc (a = 1, b = 2) => a + b;
console.info(addfunc);



//=》  b不能用于在构造函数：
const  a = () => {};
new a();   //error   不能实例化




//关于this：
const  obj = {
	a: () => {
		console.info(this.c);  //error  => 里面的this是在定义时决定 即按顺序 到这行代码
		}, 
	b: function() {
		console.info(this.c);  // right  function的this是在调用时决定  即下面的obj.b()
	},
	b(){
		console.info(this.c);   //right  是上面的简写版
	},
	c: 123;
};

obj.a();
obj.b();


//about this another case: ）（s在构造函数里面用=》）

function constructorobj(){
	this.c = 234;
	this.obj = {
		a: () => {
			console.info(this);
			console.info(this.c);  ///234
	//与上面一个例子i一样  =》 里面this。c指向代码中i定义的外部作用域的this。c function指向提升后的this。c  （块级作用域l内的） 
		}, 
	b() {
		console.info(this);
		console.info(this.c);    //123  
	}, 
	c: 123;
	};
	this.obj.a();
	this.obj.b();
}
new  constructorobj();    //



//  this 3  case
const b = function () {
	this.c = 123;
	this.a = () => {
		console.info(this.c);  //123
	};
	this.b = function(){
		
		console.info(this.c);   //123
	};

	setTimeout(this.a, 1000);   //123
	setTimeout(this.b, 1000);	//undefind  
	//定时器里面的回调函数指向全局作用域  对于普通函数全局作用域里面没有this。c  而这时=》指向的还是定义时是作用域前面的this。c so。。。
};

let B = new b();
B.a();
B.b();

















































