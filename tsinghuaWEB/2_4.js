//异步编程：
//严格模式： "use strict";

/*

//callback 回调g函数
const  fs = require('fs');
const path = require('path');

function getLargstFile(dir, cb){  //目的是return目录最大文件的文件名

	fs.reddir(dir,(er, files) => {  //fs。reddir：读取目录所有文件 异步
		let conter = files.length;
		set stats = [];

		file.forEach((file, index) => {

			fs.stat(path.join(dir, file), (er, stat) => {    //fs。stat：读取每个文件状态  异步
				stats[index] = stat;
				if (--counter == 0){  //检查并行是否都完成
					var largest = stats
						.filter(stat => stat.isFile())   //用filter过滤掉文件夹   
						.reduce((prev,next) => prev.size > next.size ? prev : next);    //reduce：获取最大文下标
					cb(files[stats.indexOf(largest)]);   ////根据下标freturn文件名
				}
	
			})	
		})
	
	});

}

getLargstFile('.', console.log);

*/



		//Promise：表示一异步操作  有三状态:
		//（pending进行{有then接受两callback为参数,前者为成功时调用， 后者是失败时调用}返回一个新pending实例，  
		//resolved完成{}  
		//rejected失败）
/*
		
var p = new Promise ((resolve, reject) => {
	resolve(1);
});

p.then(ret => ret+1, error => {});    //初始化让ret=1， 每次返回新的promise解构  作为下一轮的参数传递下去。。。。。。这叫 链式调用
	.then(ret => ret + 1)
	.then(ret => ret + 1)
	.then(ret => ret + 1)
	.then(ret => ret + 1)
	.then(ret => console.info(ret));    //6

*/


/*


//之前的寻找最大文件可以这么写：  两个工具函数（读取文件名列表/文件状态）和主函数都用Promise  这样主函数里面可以一路用then   简洁 
function readDir(path){

	return new Promise((resove, reject) => {
	
		fs.readdir(path, (er, files) => {		
			if (er){
				reject(er);
			}else{
				resoved(files);
			}
		});
	});
}



function fsStat(path) {
	return new Promise({resolve, reject} => {
		fs.stat(path, (er, stat) => {
			if(er){
				reject(er);
			}else{
				resolve(stat);
			}
		});
	});
}




function getLargestFile(dir){
	let files;

	return readDir(dir);  //调用readDir 返回第一个Promise
		.then(fs => {      //返回文件列表
			let ps = [];    //构造一个数组ps
			files = fs;
			fs.forEach(file => {
				ps.push(fsStat(file));		//把所有fsStatt(file)结果  即一堆Promise 放到ps数组里面
			});
			return Promise.all(ps);   //Promose.all(0 即所有promise都执行完以后才 继续往下面x执行
		
		})
		.then(stats => {      //statss上面的所有文件状态列表， 在返回的Promise结果中； 
			let largest = stats
				.filter(stat => stat.isFile())   //将stat做filter 返回一个确定是文件的（列表）Promise
				.reduce((prev, next) => prev.size > next.size ? prev : next);     //再i将其reduce逐个比大小  返最大的（元素）Promise
			return files[stats.indexOf(largest)];	
		});
}

getLargestFile('.').then(ret => console.info(ret));   //将文件所在目录作为参数调用主函数 然后显示ret： （return g返回值简写） 

*/



/*


//generator 如何辅助编程：
//上面的主函数可以写成：

//不够好的方法
function* getLargestFile(dir){
	let files = yield readDir(dir);

	let ps = [];
	files.forEach(file => {
		ps.push(fsStat(file));
	});

	let stats = yield Promise.all(ps);

	let largest = stats
		.filter(stat => stat.isFile())
		.reduce((prev, next) => prev.size > next.size ? prev : next);
		
	return files[stats.indexOf(largest)];
}

let g = getLargestFile('.');

g.next().value.then(file => {
	g.next(files).value.then(stats => {
		console.info(g.next(stats));
	})
});    


//更好的方法：
function run(g){
	return new Promise{(resolve, reject) => {
		function next(data) {            //递归的调用next（）  next可以判断（遍历完成 ？ 显示结果 ： 继续递归调用next）
			var result = g.next(data);
			if(result.done){
				return resolve(result.value);
			}
			result.value.then(function(data){
				next(data);
			});
		}
		next();
	}};
}

run(getLargestFile('.')).then(ret => console.info(ret));

*/





//async   &   await:
//主函数：  和generator语法区别  function*  --》  async function    用await替代yield
async function getLargestFile(dir){
	let files = await readDir(dir);   //await后面要是一个Promise对象  不然会转换v成一个立即resolve的Promise对象

	let ps = [];

	files.forEach(file => {
		ps.push(fsStat(file));
	});

	let stats = awit Promise.all(ps);

	let largesst = stats
		.filter(stat => stat.isFile())
		.reduce((prev, next) => prev.size > next.size ? prev : next);

    return files[stats.indexOf(largest)];
}

getLargestFile('.').then(ret => console.info(ret));
//asunc带有自动化机制 不用写个run 也会跑到最后







