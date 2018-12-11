//                关于 Event 的：  loop 执行顺序  /  Emitter   /  创建   /   进阶知识
//loop顺序： FIFO 先进先出    如要方法立即执行或者异步调用：
setTimeout(() => {}, 0);     //正常
setlmmediate();              //更快
process.nextTick();          //最快



//EventEmitter: 绝大多数类库基类都是它
//可以触发一个事件 对其进行监听 并且响应回调函数：
const EE = require('events');
const myE = new myE()   //应该为const myE = new EE ？
myE.on('event', (a, b) => {    //on 用来监听
	console.log(a, b, this);
	//prints: a b {}

});
myeE emit('event', 'a', 'b');  //emit用来触发





//c创建Event：
const EE = reqire('events');
class myE extend  EventEmitter{}

const mye = myE();
mye.on('event', () => {
	console.log('on event ocurred');
});
mye.emit(/event/);




//只执行/监听一次：
serve.once('commction', (streom) => {     //once： 只执行一次
	console.log('ah, we hava our first user!');
});

//改变插入顺序： （把上面的once改成下面的）
prependListener（。。。）  //最i前添加
prepent（。。。）     //在最前面加入这个只一次的调用

//删除：  (与DOM里面的同名)
emitter.removeListener(eventNAME,listener);
emitter.removeAIIListeners([eventName]);

//设置最大阈（监听器）值：  默认10， 防止内存泄漏  
emitter.setMaxListeners(n);


