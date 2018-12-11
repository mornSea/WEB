/*

//module：  与打包
export default () => 1;  //a.js
export default () => 2;	//b.js
import a from './a';  import b from './b'; console.info(a(), b());    //c.js
babel modules -d modules-target  //在node中 把三个文件编译es5模式
browserify modules-target/c.js > out.js   //在node中打包 输出out。js

*/



//解构赋值(容器与容器之间自动解开并且智能的赋值)     展开spread & 收敛Rest 符(...)    模板template（用反双引号`` 作为限定符定义模板， 用$(模板变量名)来引用并且前后用 .  拼接字符串  不用 +）     symbol（引用唯一值时用 参数是一个字符串 变成id， 进而声明一个私有属性/方法）       map & set（更加强大的 值唯一数组 与 多维对象 可遍历）



//Generator（封装了内部状态的状态机函数）  Iterator（遍历器接口）
 
/*

function* Fibonacci() {     //function 后面的* 声明这是一个generator函数
	let v1 = 0;
	let v2 = 1;
	while(true) {
		// let c = v1;		v1 = v2;	v2 = c + v2;    //普通写法

		[v1, v2] = [v2, v1 + v2];  //解构赋值
		let reset = yield v1;    //yield声明 内部不同状态节点
		if (reset) {
			v1 = 0; 
			v2 = 0;
		}	
	}
}


let squence = fibonacci();
 
console.log('call1', squence.next());   //call1， {value: 1, done: false}  
//{}中前者表示yield（每一次迭代）后面变量的值  down表示当前状态机是否已经迭代到一个结束的s状态值
console.log('call2', squence.next().value);
console.log('call3', squence.next().value);
console.log('call4', squence.next().value);
console.log('call5', squence.next().value);
console.log('call6', squence.next().value);
console.log('call7', squence.next().value);
console.log('call8', squence.next().value);
console.log('call9', squence.next().value);
console.log('call10', squence.next(true).value);   //  赋值给reset   重置
console.log('call11', squence.next().value);
console.log('call12', squence.next().value);
console.log('call13', squence.next().value);
console.log('call14', squence.next().value);

*/




 //  iterator 还为  for ...of  提供接口 


/*

function makeIterator(array) {
	var nextIndex = 0; 
	return {
		next: function(){
			return nextIndex < array.length ?
			{value: array[nextIndex++], done: false}:
			{value: undefined, done: true};
		}
	};
}

var it = makeIterator(['a', 'b', 'c']);   //it是一个遍历对象  g本质是u一个指针对象

console.log(it.next());  //{value: 'a', done: false}
console.log(it.next());  //{value: 'b', done: false}
console.log(it.next());  //{value: 'c', done: false}
console.log(it.next());  //{value: 'undefined', done: true}


*/



/*
//for ...of
let conter = 0;
const obj = {
	a: 1;
	b: 2；
	[symbol.iterator]: () => ({    //ES6规定只要有symbol.iterator属性 就是可遍历的
		next : () => ({
			value: 1;
			done: conter++ > 3
		})
	});
};  //so obj是一个可遍历的数据结构

for[let j of obj]{
	console.info('obj', j)
}


*/
 
//generator 除了是一个状态机  还是一个遍历器生成函数：
class   oddDouble (
	constructor(list){
		this.list = list;   //让参数list 变成实例的属性
	)
	*[symbol.iterator](){
		for(let item of this.list){
			yield item % 2 ? item * 2 : item;    //对list里面的奇数*2 偶数不变  
		}

	}
}

let ret = [];
for [let i of new oddDouble([1, 2, 3, 4, 5, 6])]{
	ret.push(i);
}

class.info(ret);
