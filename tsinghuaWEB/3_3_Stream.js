//Stream(流) 读取一部分 -> 处理  -> 再读取下一部分 -> ......   最大效率利用内存/cache与cpu
//Stream 类型： Readable（向获取）读取；      Writable（向输出）写入；     Duplex双工流（可读可写）；     Tansform双工流（修改）；

/*

// Readable：
const Readable = require('stream').Readable;
const iterator = function(string){    //es6 遍历器对象
	let cnt = string.length;
	return{
		next: function(){    //遍历器对象条件 next（）在每一次 迭代时返回一个对象 
			if (con--  > 0){
				return {
					value: string[cnt], 
					done: false			}
			};
		}
		return {done: true};
	}
}{'stefan'};

class ToReadable extend Readable{
	constuctor(iterator){
		super();
		this.iterator = iterator;
	}
	_read() {     //每一次迭代的回调函数
		const res = this.iterator.next();  //每次迭代中遍历器返回的对象
		if(res.done){   //每一次遍历器迭代读一个值后检查是不是已经结束
			return this.push(null);    //结束_read迭代  一定要有这个‘null’  ，不然后面的end不会触发
		}
		setTimeout{() => {
			this.push(res.value = '\n');    //设置输出等待时间 并且加入换行符
		}, 1000}
	}
}
const readable = new ToReadable(iterator);
readable.on('data', data => process.stdout.write(date));    //像stdout（）
readable.on('end', () => console.info('Donw'));

*/


/*

//writable：
const Writable = require('steam').Writable;
const writable = Writable();//cnst
//const writable = Writable((objectMode: true));

writable._write = function (chunk, encoding, next) {   
//chunk是个流 即每次写入内容的二进制数据（buffer）  next是个指针（函数 ）   不断指向下个要write的内容的地址
	//console.info(chunk);
	process.stdout.write(chunk.tostring()/.touperCase());
	process.nextTick(next);  //最快方式写入 迭代
}
writable.on('finish', () => process,stdout.write('DONE'));

writable.write('stefan' + '/n');
writable.write('is' + '/n');
writable.write('a' + '/n');
writable.write('code + ''/n');

writable.end();  //告知writable已经写入  触发打印 ‘DONE’

*/



/*

//Duplex:
let Duplex = require('stream').Duplex;
let duplex = Duplex();
let teacher = 'stefan'.split('');  //字符串分隔成数组

wduplex._read = function() {
	if (teacher.length){
		this.push(teacher.shift());   //每次迭代传进来一个
	}else{
		this.push(null);
	}
}
duplex._write = function(buf, enc, next){
	process.stdout('write $(buf.tiString()) \n');
	next();
}

duplex.on('data' data => console.log('read', data.tostring()));   //上面read的push会触发这里的监听并且打印出来

duplex.write('I');
duplex.write('love');
duplex.write('node');

duplex.end()

*/






/*

//transform： 读取 + 修改 + 打印
const Transform = require('stream').Transform;
class Love extends Transform{  //定义LOVE类  是基于Trnsfrom的接口的
	_transform(buf, enc, next) {
		this.push('I love S(buf.toString())\n');    //把传进来的值前面都加上一句，然后推到本地块级作用域中
		next();
	}
}
var transform = new Love(3);    //继承？
transform.on('data', data => process.stdout.write(data));    //监听与打印
transform.write("js");    //写入-> _transform读取并且push -> 上面监听并且打印
transform.write("node");
transform.write("terest");
transform.end()



*/



/*
//http  servre：
const http = require('http');
const server = http.createServer((req, res) => {   //req监听客户端发给服务器的信息  res是服务器发送给客户端操控的对象
	let body = '';
	req.setEncoding('utf8');
	req.on('data', (chuck) => {     //当服务器接收到信息时， 触发data， 汇总到body
		body += chunk; 
	});/
	req.on('end', () => {   
		try{
			const data = JSON.parse(body);  //把body变成一个js中的（静态）值
			res.write(typeof data);     //并且求它的类型 x输出给客户端
			res.end();
		}catch (er){
			res.statusCode = 400;
			return res.end(`error: $(er.message)`);
		}
	});
});

server.listen(1337);   //监听端口：1337  （客户端一般是80）


*/













