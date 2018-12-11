                       //NodeBase    事件循环 Event Loop     REPL     命令行 CLI 

/*

NodeBase包括：
js的除浏览器外全部lib
C/C++  与 js 的绑定， V8， libEio（fs， http）， libEv（eventLoop： 不断的 通过在事件堆栈添event让一个进程的不同任务如网络 DOM file timesetout完成后触发callback）

*/




/*

//REPL
a = 1； //1 是一个赋值表达式
var b = 2； //undefined  是一个声明语法  没有返回值
c = _;  //下划线 = 上条语句的值
.help  //like man of bash
.exit  //exit



//CLI
mkdir  newWorkName;  
cd newWorkName;
npm init;  //npm会问怎么配置应用？ 
name：（默认文件夹名）； 
varsion（版本号， 默认1.0.0）； 
description： test application；  
入口文件entry point：index.js； 
其他略过，，，，
author：同name；
license： ISO；


//这些最后会变成package.json里面的内容

*/


/*

process.argv.forEach((val, index, arr) => {
	console.info(index + ':' + val);
});     //返回运行这个程序时后面的参数  1nodejs位置 2执行的文件位置  3其他参数（空格分隔）。。。。

*/


var util = require('util');   //用这个类库解决等待时的空行
//or
process.argv.slice(2).forEach((val, index, arr) => {

	if (val.indexOf('help') > -1){
		console.info(`you cn use followinf commonds:
		entring: direcity output your input data`);   //反单引号（模板）里面的内容会完整还原 
		return;
	}
	if(val.indexOf('entering') >= 1){    //用户输入了这个参数之后  进入到了一个不停返回输入文本的阶段
		process.stdin.resume()；        //等待用户输入
		process.stdin.setEncoding('utf-8');   //设置按什么编码接受（标准）输入
		
		process.stdin.on('data', function(text) {   //对data进行监听  ：
			//console.info('enterings: ',text);     //返回用户输入
			console.info('enterings: ',util.inspect(text));     //用util返回用户输入  没有空行
			if(text.indexOf('exit') > -1) {    //也要设置推出选项
				console.info('bye!');        
				process.exit();   
			}
		});
	}
});



//全局运行：  在pockage.json的后面改preferGlobal: ...  与  'bin': (''), 为:
'preferGlobal' : true;
'bin': {
	'ponggong': 'index.js'       //在全局中 以pongpong运行这个index脚本
}

//在文件头加上运行路径（node）：
#!/usr/bin/env node



