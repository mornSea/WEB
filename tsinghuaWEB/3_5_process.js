process.on( 'exit', (code) => {console.log(`$code`)});   //监听退出事件  不能在回调函数里面放异步方法

process.on(/uncaughtException/, (err) => {,,,});   ///捕获异常  同步的内容还是会停下来报错  但是异步的会继续执行

process.kill(process.pid, 'SIGHUP');    //监听“-HUP”  杀（子）进程， 或者让其给自己发， 即自杀信号  

child.process.exec()    //创建一个子进程（其中有Node的单线程） 除了exec还有 execSync  execFile execFileSync  spawni几个方法  内用回调
//  其他可以设置超市kill的时间  但是spawn不可以
child.process.forc()   //这个是nodenl内创建， 上面的都是在node外面创子进程   除了forc  spawn用Stream接口 其他都是BUffer接口  内用回调

process.on('message', msg => {process.send('received' + msg);}); //message监听与send()发送信息  message事件还有ipostMessage（） 
//Node模块用fork创子进程  i子进程用IPC和父进程通信s  但是I/O不是共享的     n另外send（）j还可以发送句柄 （标识资源的引用描述符）

//还可以将子进程监听不同（子）端口 如8001， 8002，，，， 而主进程（一个程序）发展管理子进程的生产/复制/kill/发送信息及任务 ， 并且监听主端口如80， 主进程对外接收所有网络请求， 并分发（代理）到不同端口进程上， 子进程变成了代理服务器（由代理服务器取回客户端需要的信息并且发送）实现了多进程-多子进程- 单线程运行  充分利用了cpu与网络， 每个（甚至多个？）主进程及一群子进程监听一个窗口
 
//有了send（句柄）之后 ， 就可以不用重新与工作子进程建立新的socket链接 ， 而是可以将这个客户端发来的socket直接发给工作子进程



