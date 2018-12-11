//                              FileSystem  = fs

const fs = require('fs');

fs.readdir('.', (err, files)=> {   //最常用法1： 获取文件夹/子文件夹
	console.log(fils);
});
//都是异步方式调用  所以要把回调函数作为参数传进来  （比如在函数的调用参数第二个， 以一个箭头/匿名函数方式）
fs.stat('./find.js', (rr, stat) => {      //最常用法2： 获取文件的具体信息
	console.log(stat);
});


//同步阻塞方式： 就是调用fs的方法名后面加一个Sync 作为同步阻塞方法
console.info(fs.readdirSync('.'));
console.info(fs.statSync('./find.js'));


//以流的方式：   （pipe像管道？ 传递信息？）  
let readable = fs.creatReadStream('./src.txt');
let writable = fs.creatWriteStream('./target.txt');

readable.pipe(writeable);   //相当于把src里面的l内容复制到了target




/*

const reg = process.argv[2];   //正则表达式
const path = process.argv[3];    //目标所在文件夹

if (!reg || !path){
    console.info('error!');
	    return;
		}

		const fs = require('fs');
		const join = require('path').join;

		function findSync(reg, spath) {    //同步 好塑造一些回调
		    let results = [];
			    function find(path) {      //回调函数是递归的
				        var files = fs.readdirSync(path);   //1 读取一个文件夹
						        files.forEach (file => {
								            let fpath = join(path, file);
											            let stat = fs.statSync(path);

														            if (stat.isDirectory() | find(fpath));    //2如果是一个子文件夹则继续递归
																	            if (stat.isFile() && reg.test(file) | results.push(fpath));  //3如果o有文件b判断文件名是不是满足正则表达式 如果是push进结果
																				        })
																						    }
																							    find(spath);   //2.1继续进入子文件夹
																								    return results;      //3返回结果
																									}


																									console.info(findSync(new RegExp(reg), path));

*/












