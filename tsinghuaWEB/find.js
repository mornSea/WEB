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

