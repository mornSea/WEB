//learn typescript from  "Seitching to Angular 2"
			//npm install typescript ;  tsc hello.ts ; (out file hello.js)   node hello.js;   (or translate + run)  npm install -t ts-node ;  ts-node hello.ts
			//context-demo.ts   the  => function pointer to the out context
			function MyComponent() {
		    	var _this = this;
			    this.age = 42;
			    setTimeout(function () {
    		    	_this.age += 1;
  			      console.log(_this.age);
  				 }, 100);
			}
			new MyComponent();


			//sample-classes.ts    ts need 定义 _name
			class Human{
				static totalPeople = 0;
				_name;
				constructor(name){
					this._name = name;
					Human.totalPeople += 1;
				}

				get name(){
					return this._name;
				}

				set name(val){
					this._name = val;
				}

				talk(){
					return `hi,  {this.name}`;
				}
			}

			class Develloper extends Human{
				_languages;
				constructor(name, languages){
					super(name);
					this._languages = languages;
				}
				get languages(){
					return this._languages;
				}
				talk(){
					return `${super.talk()} And I know ${this.languages.join(',')}. `;
				}
			}

			var hunman = new Human("foobar");
			var dev = new Develloper("bar", ["javascript"]);
			console.log(dev.talk());

			//nonenumerable.ts
			class Person{
				@nonenumerable
				get kidCount(){
					return 42;
				}
			}

			function nonenumerable(target, name, descriptor){
				descriptor.enumerable = false;
				return  descriptor; 
			}

			var person = new Person();
			for(let prop in person){
				console.log(prop);
			}


			//alias 
			import {boostrap as initializa} from "somewhere";

			//





			//app.js   a module
			import {square} from './math';
			export function main() {
				console.log(square(2));
			}
			//init.js	add appmodule  and use main 
			System.import('./app')
				.then(app =>{
					app.main();
				})
				.catch(err => {
					console.log('terrible error happened', error);
				});


		//use the staic point
			//定义 the  类型
			let foo: number = 42;		
			foo = "42"				//error can't change 类型
			
			//any		root of all 类型 ,  so it can change
			let foo: any;
			foo = {};  foo = '43'; foo+=42;		//no error
			console.log(foo);					//"43, 42"

			/*	类型 of ts:
					Number, String, Boolean, Void, Null, Un定义ined, Enum
					Function, class, interface, array, tuple, function, constructor
					pinyin(zuhe, fangxin)
			 */

			//Enum:   some value  who have name
			enum STATES {
				CONNECTING,
				CONNECTED,
				DISCONNCTING,
				WAITING,
				DISCONNECTED
			};					//equal to this js:
			var STATES;
			(function (STATES){
				STATES[STATES["CONNECTING"] = 0] = "CONNECTING";
				STATES[STATES["CONNECTED"] = 1] = "CONNECTED";
				STATES[STATES["DISCONNECTING"] = 2] = "DISCONNECTING";
				STATES[STATES["WAITING"] = 3] = "WAITING";
				STATES[STATES["DISCONNECTED"] = 4] = "DISCONNECTED";
				})(STATES || (STATES = {}));
			//use enum:
			if(this.state === STATES.CONNECTING){
				console.log('the system is connecting');
			}

			//Array
			let primes: number[] = [];		//number array
			primes.push(2);
			primes.push(3);

			let randomItems: any[] = [];	//any array
			randomItems.push(1);
			randomItems.push("foo");
			randomItems.push([]);
			randomItems.push({});

			randomItems[1] === "foo";		
			randomItems[0] === "bar";
			

			//Function		a set of all function;   ts change the  value of  return / arguments
			let variable: (arg1: type1, arg2: type2, arg3: type3, /*...*/, argn: typen)		//if you want send a function to a variable, do this
			let isPrime: (n: number) => boolean = n => {
				//body
			};

			function isPrime(n: number): boolean{			//function 定义
				//body
			}

			let math  = {									//function Literal
				squareRoot(n: number) : number {
					//...
				},
			};
	
			let person = {				//void function: no't  return value
				_name: null,
				setName(name: string):	void {
					this._name = name
				}
			};



			//Class
			class Human {			//定义 class
				static totalPeople = 0;
				_name: string,
				constructor(name){
					this._name = name;			//this _name is stroge 类型
					Human.totalPeople += 1;
				}
				get name(){
					return this._name;
				}
				set name(val){
					this._name = val;
				}
				talk(){
					return `hi  I am ${this.name}`;
				}
			}		//use the class

			let human = new Human('foo');
			console.log(human._name);


			//  symbol  with see	(public, private, portected)
			class Human{
				static totalPeople = 0;
				private _name: string;
			}
			

			class Human{
				constructor(private name: string){}
			}	
										//equal to :
			var Human = (function() {
				function Human(name){
					this.name = name;
				}
				return name;
			})();


			//interface
			interface Accoutable {		//定义 a interface  
					accountNumber: string;			//in interface can 定义 any other value
				getIncome(): number;
			}

			class Firm implements Accoutable {		//check the class have the interface
				getIncome(): number {
					//...
				}
			}

`			//interface extends
			interface Individual extends Accoutable, Human {
				ssn: string;
			}

			//lot interface  (if class is set of that interface )
			class Person implements Human, Accoutable{
				age: number;
				name: string;
				accountNumber: string;
				getIncome(): number{
					//...
				}
			}

			//decorator ts装饰器  可以装饰函数和参数
			class Http {
				//...
			}
			class GitHubApi {
				constuctor(@Inject(Http) http){
					//...
				}
			}

			//用类型参数写泛型代码   实现二分搜索树
			class Node{		//正常js版本
				value: any;
				left: Node
				right: Node;
			}
			class BinarySearchTree {
				private root Node;
				insert (any: value): void{/*...*/}
				remove (any: value): void{/*...*/}
				exists (any: value): boolean{/*...*/}
				inorder (callback): {(value:any)}: void{/*...*/}
			}

			class Node<T>{	//泛型
				value: T;
				left: Node;
				right: Node;
			}
			let numberNode = new Node<number>();
			let stringNode = new Node<string>();
			numberNode.right = new Node<number>();	//赋值这个子节点的类型=“number类型的节点” 赋值数字/字符串都错
			numgerNode.left = stringNode;			
					
			//Generic  泛型  它的典型用法是定义一种可以操作一组类型的函数
			function identity<T>(arg: T){		//返回接受的参数
				return arg;
			}

			//用基础语法 允许声明某些类型的子类， （使用特殊属性的实例） 这些类型应该是类型参数
			interface Comparable {
				compare(a: Comparable) :number;
			}
			function sort<T extends Comparable>(arr: Comparaable[]):Comparable[]{	
				//实现上面接口的类 接口中方法必须实现，调用它，根据返回值表示目标对象和参数中对象哪个大 
				//...
			}

			class Paik<T, V>{			//多重泛型
				key: K;
				value: V;
			}
			let paik = new Paik<string, number>();
			paik.key = "foo";
			apik.value = 42;

			//类型推断   直接赋值不需要注解   (不赋值就是any)
			let answer = 43; 	//number
			let x = ["42", 42];	//array
			let y = [32, null, 453];	//number[]

			//上下文类型推断
			document.body.addEventListener("mousedown", e=> {
				e.foo(); 	//error  推断出它的类型是mousedown
			}, false);

			//外部类型定义   有外部类型的库  不用给所有用的js库/框架定义  npm install  -g typing  
			var DOM = {		//假设这是一个js的类库
				selectElements: function(selector){
					//...
				},
				hide: function(element){
					//...
				},
				show: function (element){
					//...
				}
			};

			var DOM = {		//ts
				selectElements: function(selector: string):HTMLElement[]{
					return [];
				},
				hide: function(element: HTMLElement): void{
					element.hidden = true;
				},
				show: function (element: HTMLElement): void{
					element.hidden = false;
				}
			};

			interface LibraryInterface {   	//类库的接口
				selectElements(selector: string):HTMLElement[] 
				hide(element: HTMLElement): void
				show(element: HTMLElement): void
			}

				//dom.ts.d			//定义一个后缀为ts.d的文件  输入
			interface DOMLibraryInterface {
				selectElements(selector: string):HTMLElement[] 
				hide(element: HTMLElement): void
				show(element: HTMLElement): void
			}								//定义了一个接口 并把变量DOM类型声明为这个接口
			declare var DOM: DOMLibraryInterface;

				//ng.js		最后， 在需要用这个类库的代码里包含外部类型定义文件
				///reference path="dom.d.ts" />