//函数化编程特效： 不可变数据， 函数像变量一样传递/修改/嵌套，  尾递归优化          常用技术： map&reduce 对集合进行相同操作/定义操作得一值，  popline：把一个个函数放一起如同放在一个数组里 数据传给数组 经过一个个函数        recursing递归：简化代码/问题，      curring：把函数分解为多个并封装每层函数都返回一个函数去接收下一个参数（bind）       高阶函数：操作函数的函数    
    //匿名函数 表示一块代码块
    function map(array, func){
        var res = [];
        for (var i = 0, len = array.length; i < len; i++){
            res.push(func(array[i]));
        }
        console.log(res);
    }
    var map = map([1, 3, 5, 6, 9], function(n){
        return n += (n % 3);
    });

    //柯里化 接收多个参数的函数变成只接收一个参数的 并返回结果
    function adder(num){
        return  function(x){
            return num + x;
        }
    }
    let add5 = adder(5);
    let add6 = adder(6);
    console.log(add5(1));
    console.log(add6(1));

    //高阶函数 以函数为参数/返回结果的函数    如map的参数已经做了一次抽象  map进行的是第二层抽象  高阶的阶应理解为抽象的层次
    function map(array, func){
        var res = [];
        for (var i = 0, len = array.length; i < len; i++){
            res.push(func(array[i]));
        }
        console.log(res);
    }
    var mapped = map([1, 3, 5, 6, 9], function(n){
        return n += (n % 3);
    });
    console.log(mapped);

    var  mapped2 = map(["one", "two", "three", "four"], function(item){
        return "("+item+")";
    });
    console.log(mapped2);

    //js中的求和
    function sum(){
        let res =0;
        for (let i=0, len=arguments.length; i<len; i++){
            res +=parseInt(arguments[i]);
        }
        return res;
    }
    console.log(sum(1, 3, 4, 34, 5));


    //递归
    function factorial(n){                                              
        if(n == 1){
            return 1
        }else{
            return factorial(n-1) * n;
        }
    }
    console.log(factorial(16));

    //闭包
    function outter(){
        let n = 0;
        return function(){                                              //匿名函数中包含对otter的局部变量n的引用  so 当outter返回时 n的值被保留 不会被垃圾回收 下次调用时在前值上加  而如果有个o2=outter的话 又是一个新实例
            console.log(n++);
        }
    }
    let o1 = outter();
    o1();
    o1();
    o1();
    o1();
    o1();
    o1();

    //jQuery闭包
    let con = $("div#con");
    setTimeout(function(){
        con.css({background: "gray"});                                  //由于在setTimeout里调用con， so con 留在函数里  setTimeout返回后 con仍未释放 因为con引用了全局作用域的con
    }, 2000);

    //循环中用闭包
    var outter = [],   array = ["one", "two", "three", "four"];
    function clouseTest(array, outter){
        for (var i=0, len=array.length; i<len; i++){
            var x = {no:i, text:array[i]};
            x.invoke = function(no){
                return function(){
                    console.log(no);
                }
            }(i);
            outter.push(x);
        }
        console.log(outter);
    }
    clouseTest(array, outter);


    //如lisp一样 jQuery返回的对象本质是个List 可以对这个对象使用map / reduce / filter等函数  进行函数操作， 柯里化  大大降低编程复杂度
    //控制页面刷新
    function updata(itme){                                              //柯里化函数 将传入的参数作为选择器的id 并更新这个div的内容
        return function(text){
            $("div#"+item).html(text);
        }
    }
    function refresh(url, callback){                                    //参数（服务器url， 回调）  当服务器成功返回时 调用这个函数
        var params = {
            type: "echo",
            data: ""
        };
        $.ajax({
            type:"post",
            url: url,
            cache: false,
            async: true,
            dataType: "json",
            data: params,
            success : function(data, status){
                callback(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }                                                                  //通过异步方式更新content1， 2， 3，
    refresh("action.do/op=1", updata("content1"));
    refresh("action.do/op=2", updata("content2"));
    refresh("action.do/op=3", updata("content3"));



//nodejs 与 events
    //REPL就是当通过node.exe启动之后开辟的一块内存空间（不同于浏览器），在这块内容空间里面就可以解释执行我们的js代码  终端中输入了 node abc.js 做的事情就是，将abc.js中写好的js的逻辑代码扔在启动好的node的内容空间中去运行
    
    //分别介绍几大模块用法：
        //http 服务器 网络
        var http = require("http");
        var server = http.createServer();       //用获取到的核心模块的对象 创建服务器对象        
        server.on("request", function(req, res){    //用服务器对象监听浏览器请求  并处理（请求 处理 响应）
            res.end("welcome");                     //浏览器打开http：//http://127.0.0.1:8080/
        });
        server.listen(8080, '127.0.0.1', function(){    //开启web服务 开始监听
            console.log("开启服务器成功");
        });

        //url  获取/解析url
        const url = require("url");
        var testURL = 'http://127.0.0.1:8080/login?username=terest&pwd=123';
        var urlvalue = url.parse(testURL, true);
        console.log(urlvalue);      //用url的parse分解查询字符串  如果第二参数是true 就把查询字符串解析为js对象

        //queryString  将GET/POST传递过来的参数进行解析
        const queryString = require("querystring");
        const paramsObj = queryString.parse(testURL);      //GET POST不同   GET放在路径后面 ？后跟键值对 最大2K      POST放在请求体里 键值对的方式 最大2M

        //fs&path  读取文件 获取路径
        var path = require('paht');
        var fs = require('fs');
        //path.join(__dirname, "language.js");      //join（）多个参数组合成一个 path      _dirname代表当前所在的文件夹路径    第二个字符串参数是要读取的文件夹下的文件名  path。join会自动判断路径 并加上/

        fs.readFile("language.js", 'utf-8', function(err, data){ //读取文件 参数：filename（必选），表示要读取的文件名,  encoding（可选  默认二进制），表示文件的字符编码。  callback 是回调函数，用于接收文件的内容
            if(err){
                console.error(err);
            }else{
                console.log(data);
            }
        });  

        /*
        在commonjs（官方自带）中导入模块用 require
        在commonjs中在模块中导出给外面的js使用 使用module.exports
        如果是自定义模块，在导入自定义模块的时候，得把路径写完整
        require导入的东西，就是别的文件modulu.exports导出的东西 
        */

    //Express框架 ：对HTTP封装，用来简化我们网络功能那一块（GET， POST， Router， 静态资源）
        //安装express 创一文件夹 写入：
        const express = require('express');
        const app = express();
        app.get('/', (req, res) => res.send("hello world"));    //调用方法名改为POST（）  即为用POST
        app.listen(3000, ()=>console.log("example app listening in port 3000 !"))

        app.all('./secret', function(req, res, next){       //特殊的路由方法，app.all()用于在路径上为所有 HTTP请求方法加载中间件函数
            console.log("accessong the sectet section ...");
            next();
        });

        app.get('/some/about.text', function(req, res){               //此路径匹配 /some  请求about.text
            res.send("about.text");
        });

        app.get('/ab*cd', function(req, res){               //根据正则表达式匹配路径 （所有ab开头 cd结尾的）
            res.send('ab*cd');
        });

        app.get('/users/:userId/books/:boolId', (req, res) => res.send("req,params"));      //
        app.get('/example/a', function(req, res, next) {        //可以提供多个回调函数，其行为类似于中间件来处理请求(路径 / 路由)
            res.send("a");
            next();
            //...
        });
        
        app.route('/book')         //创建路径路径的可链路径处理程序app.route()。由于路径是在单个位置指定的，因此创建模块化路由很有帮助，同时减少冗余和拼写错误。
        .get((req, res) => res.send("get a random book"))
        .post((req, res) => res.send("add a book"))
        .put((req, res) => res.send("update the book"));

        
        const manRouter = require(path.join(__dirname,"man/manRouter.js"));      //导入路由文件
        app.use('/man',manRouter);                                          //在入口文件中使用
        app.use(express.static(path.join(__dirname,'statics')));        //在我们入口文件中设置静态资源的根目录  注意点:一定要在路由处理之前设置
    
    //深入浅出Node.js
        $.get('/api', {  success: onSuccess,    error: onError,  complete: onComplete  });      //普通的Ajax调用
        $.get('/api') .success(onSuccess) .error(onError) .complete(onComplete);    //这使得即使不调用success()、error()等方法，Ajax也会执行，这样的调用方式比预先传入回调让人觉得舒适一些。在原始的API中，一个事件只能处理一个回调，而通过Deferred对象，可以对事件加入任意的业务处理逻辑

        function createServer() {  function app(req, res){  //创建了HTTP服务器的request事件处理函数 
            app.handle(req, res); 
        }
        utils.merge(app, proto);  
        utils.merge(app, EventEmitter.prototype);
        app.route = '/';  app.stack = [];
        for (var i = 0; i < arguments.length; ++i) {    app.use(arguments[i]);
        }  return app;
        };         

        //stack属性是这个服务器内部维护的中间件队列。通过调用use()方法我们可以将中间件放进队列中。下面的代码为use()方法的重要部分：
        app.use = function(route, fn){  // some code
        this.stack.push({ route: route, handle: fn });　
        return this;};

        //监听函数的实现如下：
        app.listen = function(){
            var server = http.createServer(this);  return server.listen.apply(server, arguments);
        };                                            
        //最终回到app.handle()方法，每一个监听到的网络请求都将从这里开始处理。该方法的代码如下：
        app.handle = function(req, res, out) {  // some code
            next();};

        //next（） 原理十分简单，取出队列中的中间件并执行，同时传入当前方法以实现递归调用，达到持续触发的目的：
        function next(err) {  // some code
        // next callback  
        layer = stack[index++];　
        layer.handle(req, res, next);}
        //命令行中查看垃圾回收日志  （主要是在启动时添加--trace_gc参数）  最后保存在gc。log文件
        /* node --trace_gc -e "var a = [];for (var i = 0; i < 1000000; i++) a.push(new Array(100));" > gc.log   */  

        var foo = function () {var local = {};};    //用作用域触发垃圾回收
        process.memoryUsage();                       //node命令行里调用 可以查看node内存使用情况。     结果如 { rss: 13852672,  heapTotal: 6131200,  heapUsed: 2757120 }  rss是resident set size的缩写，即进程的常驻内存部分。进程的内存总共有几部分，一部分是rss，其余部分在交换区（swap）或者文件系统（filesystem）中。除了rss外，heapTotal和heapUsed对应的是V8的堆内存信息。heapTotal是堆中总共申请的内存量，heapUsed表示目前堆中使用中的内存量。这3个值的单位都是字节
        //JavaScript开发者通常喜欢用对象的键值对来缓存东西，但这与严格意义上的缓存又有着区别，严格意义的缓存有着完善的过期策略，而普通对象的键值对并没有。      目前比较好的解决方案是采用进程外的缓存，进程自身不存储状态。外部的缓存软件有着良好的缓存过期淘汰策略以及自有的内存管理

        //创建一个TCP服务器端来接受网络请求，代码如下：
        var net = require('net');var server = net.createServer(function (socket) {
            // 新的连接  
            socket.on('data', function (data) {socket.write("你好");  });
            socket.on('end', function () {console.log('连接断开');});  
            socket.write("欢迎光临《深入浅出Node.js》示例：\n");
                });
        server.listen(8124, function () {console.log('server bound');});
        /*
        我们通过net.createServer(listener)即可创建一个TCP服务器，
        listener是连接事件connection的侦听器，也可以采用如下的方式进行侦听：
        var server = net.createServer();
        server.on('connection', function (socket) {  // 新的连接
        });server.listen(8124);
        我们可以利用Telnet工具作为客户端对刚才创建的简单服务器进行会话交流，相关代码如下所示：$ telnet 127.0.0.1 8124
        Trying 127.0.0.1...Connected to localhost.
        Escape character is '^]'.欢迎光临《深入浅出Node.js》示例：
        hi你好
        除了端口外，同样我们也可以对Domain Socket进行监听，代码如下：server.listen('/tmp/echo.sock');   
        */

        //实现HTTP服务器
        var http = require('http');
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});  
            res.end('Hello World\n');
        }).listen(1337, '127.0.0.1');
        console.log('Server running at http://127.0.0.1:1337/');

        //自行构造代理对象，代码如下：   （代理服务器是介于浏览器和Web服务器之间的一台服务器，有了它之后，浏览器不是直接到Web服务器去取回网页而是向代理服务器发出请求，Request信号会先送到代理服务器，由代理服务器来取回浏览器所需要的信息并传送给你的浏览器。） 
        var agent = new http.Agent({ maxSockets: 10});
        var options = {  hostname: '127.0.0.1',
            port: 1334,  path: '/',
            method: 'GET',  agent: agent
        };

        //WebSocket在客户端的应用示例：     （浏览器与服务器端创建WebSocket协议请求，在请求完成后连接打开，每50毫秒向服务器端发送一次数据，同时可以通过onmessage()方法接收服务器端传来的数据。这行为与TCP客户端十分相似，相较于HTTP，它能够双向通信。）
        var socket = new WebSocket('ws://127.0.0.1:12010/updates');
        socket.onopen = function () {
        setInterval(function() {    if (socket.bufferedAmount == 0)
            socket.send(getUpdateData());  }, 50);
        };
        socket.onmessage = function (event) {
        // TODO：event.data
        };

        //我们的应用可能无限地复杂，但是只要最终结果返回一个下面的函数作为参数，传递给createServer()方法作为request事件的侦听器就可以了  （创建HTTP服务器连接的时候 在request事件前 就调用了ServerResponse对象）
        (req, res) => {
            res.writeHead(200, {'Content-Type':'text/plain'})
            res.end();
        }
        //后面还有 网络协议命令（PUT DELETE）， session， json， cookie， 文件上传下载， 路由， 中间件， 页面渲染， 模板， 文件系统， 多进程， 测试，，，，，之后单独作一文件
    
    //node Event Loop   （主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环））
        //用户事件会通过 指定回调函数 进入任务队列  回调函数会被主线程挂起来 像异步任务必须指定回调      一般它是FIFO的 但是如果有定时器 主线程要检查执行时间 只有到了规定的时间 才返回哪些事件到主线程
        //主线程运行时 产生堆（heap）和栈（stack） 栈里的是一些API调用， 它们在任务队列（queue）里添加各种事件 只要栈中代码执行完 主线程就去读取任务队列 再依次执行那些事件对应的回调 
            //例子： （同步）总是在读取任务队列（异步任务）前执行：
            var req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = function(){};
            req.onerror = function(){};
            req.send();                 //这是以一个异步任务， 即它指定的回调部分（onload / onerror）在send的前/后无所谓， 总是要执行完它们 才去读取任务队列

        //定时器： 如果定时器将时间设置为0 同样的任务它还是比代码中排在它后面的晚出来
            //因为定时器时间0的含义是 指定任务在主线程最早可以得到的空闲执行 即在任务队列尾巴添加一个事件 因此要等到同步任务 队列任务都处理完 才执行    （当前的代码在执行栈）
            //html规定setTimeout最小默认事件是4 毫秒 如果设置的低于这个值 会自动增加  而DOM级别的变动一般要起码16毫秒   
            setTimeout(function(){console.log(0);}, 0);
            console.log(1);
            console.log(33**33);

        //node的eventLoop：
            //V8引擎解析JavaScript脚本。解析后的代码，调用Node API。libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。V8引擎再将结果返回给用户
            //Node.js还提供了另外两个与"任务队列"有关的方法：process.nextTick和setImmediate。它们可以帮助我们加深对"任务队列"的理解。：
                //process.nextTick方法可以在当前"执行栈"的尾添加任务 指定的任务总是发生在所有异步任务之前。setImmediate方法则是在"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。
                //由于peocess。nextTick方法指定回调， 总是在当前的尾部触发 所以A B都比setTimeout先  so 只要有peocess。nextTick的语句 都在当前栈执行 而不是加到任务队列  
                
                //执行顺序：  普通的代码(按先后) =》 peocess.nextTick =>  setTiemout  / setlmmediate
                console.log("out1");
                process.nextTick(function A(){
                    console.log(0);
                    process.nextTick(function B(){
                        console.log(1);
                    });
                })
                setTimeout(function timeout(){
                    console.log("TIMEOUT FIRED");
                });
                console.log("out2");

                //setlmmedite  不确定和setTimeout那个先  多个process.nextTick语句总是在当前"执行栈"一次执行完，多个setImmediate可能则需要多次loop才能执行完。
                console.log(0);                
                setImmediate(function A(){
                    console.log(1);
                    setImmediate(function B(){console.log(2)});
                });
                setTimeout(function timeout(){
                    console.log("timeout Fired");
                }, 0);
                console.log(4);

                //多个process.nextTick语句总是在当前"执行栈"一次执行完，多个setImmediate可能则需要多次loop才能执行完 setImmediate方法的原因，否则像下面这样的递归调用process.nextTick，将会没完没了，主线程根本不会去读取"事件队列"！
                peocess.nextTick(function foo(){            //报错：peocess is not defined
                    peocess.nextTick(foo);                  //死循环  不要这样调用                
                });
                setImmediate(function foo(){          
                    setImmediate(foo);                  //也是死循环 还不会报错 不要这样调用                
                });
            

//jQuery
    //外链式使用： <script  src="./jqyery-3.2.1.min.js"></script>    或者使用cdn<script src="http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
    //特点： 链式编程 （在一个语句里不断通过一个对象的 操作-返回对象 而可以用一个 . 无限连着操作）  比promise好一点
    $("#box")                               //找到id名为box的标签
        .find("div.icon")                   //在它下面下找到class为icon的div
        .removeClass("Rotation")            //移出该div的Rotation类名
        .stop()                             //停止该元素上正在执行的动画 
        .animate({"opacity":"1"},"fast");   //添加动画效果,改变透明度
                               
    //jQuery：通过$()方法得到的对象是jQuery  不同于DOM对象：它是一个DOM的集合， 像个数组， 互相的方法/属性不同
    let boxjQuery = $("#box"),    boxDOM = document.getElementById("box");
    let boxDOMnew = get(boxjQuery),   boxjQuery = $(boxDOM);       //互相转换

    //jQuery的选择器： = CSS选择器   除了常见的还有 :empty选空文本 :even选所有奇数  :hidden  :input所有input/textarea/select/button  :enable可用的  :fiel上传域

    //常用方法：
    echo();     index();    $.noConlict()                       //解决多库共存
    Attr();     removeattr();   prompt();   removeProp();       //html属性
    css();  addClass(); removeClass();  toggleClass();          //CSS设置
    offest();   CaretPosition();    scrillTop();    scrollLeft();   htight();   innerHeight();  outerHeight(); innerWidth();    outerWidth();   //位置与尺寸
    html(); text(); val();                                      //文本与HTML

    //节点操作：
    $("<div></div>");   //创建jquery节点
    append();   appendTo(); prepend();  prependTo();    after();    Before();       //插入节点
    empty();    //删除节点对象 包括所有子节点
    clone(true/false);    //复制节点  深度复制 传参数false不会复制事件   ture则复制
    
    //jQuery事件  
    //名称就是去掉on的事件  如click  mouseenter  blur  keyup
    on();   off();  trigger();  //事件注册
    delegate(); undelegate();   //事件委托

    //jQuery 动画
    show();     hide();     //显示和隐藏
    slideDown();    slideUp();  slideToogle();  //滑动显示
    fadeIn();   fadeOut();  fadeTo();   fadeToggle();   //淡入淡出

        //自定义jQuery动画：
        animate(p, [s], [e], [fn]);     //参数： 1。一组包含作为动画属性和终止的样式属性和其值的几个  2执行动画的毫秒数 可以为数值/（"slow"/"normal"/"fast"）   3动画速度 默认swing 可选：linear     4，回调 动画执行完后执行 

        //停止和延时：
        stop(); //可传入2参数（是否清空动画队列？  是否把动画队列里的正在执行的动画变成最终效果） 默认都是false  最好在使用动画前都用stop（）
        delay();    //推迟动画 参数为毫秒数

    //Ajax：   jquery.ajax(url,[settings]);
    $.ajax({
        type: "GET",
        url: "page.php",
        dataType:'json',
        data: {id:1001},//也可以是字符串链接"id=1001"，建议用对象
        success: function(data){
            console.log("返回的数据: " + data );
        }
    });


    //实例
        //1返回顶部
        /* <div class="divT hide" onclick="ReturnTop();"><strong>返回顶部</strong></div> */
        window.onscroll = function () {
            var current = $(window).scrollTop();
            if (current > 180){
                $(".divT").removeClass("hide");
            }else {
                $(".divT").addClass("hide");
            }
        };

        function ReturnTop() {
            $(window).scrollTop(0);
        }

        //2左侧菜单
        /*  <div class="title" onclick="Show(this);">菜单一 /二 /三</div> */
        function Show(self) {
            $(self).next().removeClass("hide").parent().siblings().children(".con").addClass("hide");
        }

        //菜单切换
        /* 
        <div class="tab_outer">
          <ul class="menu">
              <li xxx="c1" class="current" onclick="Tab(this);">菜单一</li>
              <li xxx="c2" onclick="Tab(this);">菜单二</li>
              <li xxx="c3" onclick="Tab(this);">菜单三</li>
          </ul>
          <div class="content">
              <div id="c1">内容一</div>
              <div id="c2" class="hide">内容二</div>
              <div id="c3" class="hide">内容三</div>
          </div>
        */
       function Tab(self) {
        $(self).addClass("current").siblings().removeClass("current");
        var x = "#" + $(self).attr("xxx");
        $(x).removeClass("hide").siblings().addClass("hide");
    }
    
    //滚动菜单
    /* 
    <div class="pg-body">
    <div id="menu" class="menu">
            <ul>
                <li menu="funcOne">第一章</li>
                <li menu="funcTwo">第二章</li>
                <li menu="funcStree">第三章</li>
            </ul>
        </div>
        <div id="content" class="content">
            <div class="item" con="funcOne">床前明月管</div>
            <div class="item" con="funcTwo">疑是地上霜</div>
            <div class="item" con="funcStree" style="height: 100px">我是郭德纲</div>
        </div>
    </div>
    */
   window.onscroll = function () {
    var onTop = $(window).scrollTop();
    if (onTop >= 48){
        $("#menu").addClass("fixed");
    }else {
        $("#menu").removeClass("fixed");
    }

    var flag = false;
    $(".item").each(function () {
        var topH = $(this).offset().top;
        var HH = $(this).height() + topH;
        var wH = $(window).height();

        if ((wH + onTop) == HH){
            $("ul .active").removeClass("active");
            $("li:last").addClass("active");
            flag = true;
            return
        }
        if (flag){
            return
        }

        var menuCon = $(this).attr("con");
        if ((topH < onTop) && (onTop < HH)){
            $("ul [menu='" + menuCon +"']").addClass("active");
        }else {
            $("ul [menu='" + menuCon +"']").removeClass("active");
            }
        })
        }

    //商品图片 放大镜
    /* 
    <div  class="outer">
            <div  class="small-box">
                <div  class="mark"></div>
                <div  class="float-box" ></div>
                <img width="350" height="350" src="../../css/1.jpg">
            </div>
            <div class="big-box">
                <img width="900px" height="900px" src="../../css/1.jpg" >
            </div>
        </div>
    */
    $(function(){
        $(".mark").mouseover(function () {
            $(".float-box").css("display","block");
            $(".big-box").css("display","block");
        });

        $(".mark").mouseout(function () {
            $(".float-box").css("display","none");
            $(".big-box").css("display","none");
        });



        $(".mark").mousemove(function (e) {

            var _event = e || window.event;  //兼容多个浏览器的event参数模式

            var float_box_width  = $(".float-box")[0].offsetWidth;
            var float_box_height = $(".float-box")[0].offsetHeight;//175,175


            var float_box_width_half  =  float_box_width / 2;
            var float_box_height_half =  float_box_height/ 2;//87.5,87.5


            var small_box_width  =  $(".outer")[0].offsetWidth;
            var small_box_height =  $(".outer")[0].offsetHeight;//360,360


            var mouse_left = _event.clientX   - float_box_width_half;
            var mouse_top = _event.clientY  - float_box_height_half;


            if (mouse_left < 0) {
                mouse_left = 0;
            } else if (mouse_left > small_box_width - float_box_width) {
                mouse_left = small_box_width - float_box_width;
            }
            if (mouse_top < 0) {
                mouse_top = 0;
            } else if (mouse_top > small_box_height - float_box_height) {
                mouse_top = small_box_height - float_box_height;
            }

            $(".float-box").css("left",mouse_left + "px");
            $(".float-box").css("top",mouse_top + "px");
            
            
            var percentX = ($(".big-box img")[0].offsetWidth - $(".big-box")[0].offsetWidth) / (small_box_width - float_box_width);
            var percentY = ($(".big-box img")[0].offsetHeight - $(".big-box")[0].offsetHeight) / (small_box_height - float_box_height);
            console.log($(".big-box img")[0].offsetWidth,$(".big-box")[0].offsetWidth,small_box_width,float_box_width)
            console.log(percentX,percentY)
            $(".big-box img").css("left",-percentX * mouse_left + "px");
            $(".big-box img").css("top",-percentY * mouse_top + "px")

        })
    })







    

    //动态对话框
    $(function () {
        $("tr:even").css("background-color","#f5f5f5");
    });
    function Edit(ths) {
        $(".shade,.modal").removeClass("hide");
        prevList = $(ths).prevAll();
        prevList.each(function () {
            var text = $(this).text();
            var target = $(this).attr("target");
            $("#"+target).val(text);
        });
    }
    function HideModal() {
        $(".shade,.modal").addClass("hide");
        $(".modal").find("input[type='text']").val("");
        Addd = false;
    }
    function SubmitForm() {
        var flag = Detection();

        try {
                if (Addd && flag){
                $("tbody").append($("tr").last().clone());
                $(".modal").find("input[type='text']").each(function () {
                    var value = $(this).val();
                    var name = $(this).attr("name");
                    ($("tr").last().children()).each(function () {
                        if ($(this).attr("target") == name){
                            $(this).text(value);
                            return
                        }
                            }
                    )});
                Addd = false;
                HideModal();
                return false;
            }
        }catch (e){}


        if (flag){
            $(".modal").find("input[type='text']").each(function () {
                var value = $(this).val();
                var name = $(this).attr("name");
                $(prevList).each(function () {
                    if ($(this).attr("target") == name){
                        $(this).text(value);
                        return
                    }
                        }
                )});
                $(".modal,.shade").addClass("hide");
                HideModal();
            }
        return flag;
        }

    
    function Detection() {
        var flag = true;
        $(".modal").find("input[type='text']").each(function () {
            var value = $(this).val();
            if (value.length == 0){
                $(this).next().next().css("visibility","visible").text("亲，不能为空");
                flag = false;
                return false;
            }else {
                $(this).next().next().css("visibility","hidden").text("");
            }

            if ($(this).attr('name') == "host"){
                var r = /(\.com)$/;
                if (r.test(value) == false){
                    $(this).next().next().css("visibility","visible").text("主机名必须以.com结尾");
                    flag = false;
                    return false;
            }
            }else if ($(this).attr('name') == "ip"){
                var r2 = /^(([0-2]?[0-9][0-9]?)\.){3}([0-2]?[0-9][0-9]?)$/;
                if (r2.test(value) == false){
                    $(this).next().next().css("visibility","visible").text("ip 地址格式有误");
                    flag = false;
                    return false;
                }
            }else if ($(this).attr('name') == "port"){
                var r3 = /^([0-9]{1,5})$/;
                if ((r3.test(value) == false) || (value > 65535)){
                    $(this).next().next().css("visibility","visible").text("端口必须为0-65535");
                    flag = false;
                    return false;
                }
            }else {
                $(this).next().next().css("visibility","hidden").text("");
            }
    });
    return flag;
    }

    function Add() {
        Addd = true;
        $(".shade,.modal").removeClass("hide");
    }

    //编辑框
    /*
            监听是否已经按下control键
            */
            window.globalCtrlKeyPress = false;

            window.onkeydown = function(event){
                if(event && event.keyCode == 17){
                    window.globalCtrlKeyPress = true;
                }
            };
            window.onkeyup = function(event){
                if(event && event.keyCode == 17){
                    window.globalCtrlKeyPress = false;
                }
            };

            /*
            按下Control，联动表格中正在编辑的select
            */
            function MultiSelect(ths){
                if(window.globalCtrlKeyPress){
                    var index = $(ths).parent().index();
                    var value = $(ths).val();
                    $(ths).parent().parent().nextAll().find("td input[type='checkbox']:checked").each(function(){
                        $(this).parent().parent().children().eq(index).children().val(value);
                    });
                }
            }
        

    $(function(){
        BindSingleCheck('#edit_mode', '#tb1');
    });

    function BindSingleCheck(mode, tb){

        $(tb).find(':checkbox').bind('click', function(){
            var $tr = $(this).parent().parent();
            if($(mode).hasClass('editing')){
                if($(this).prop('checked')){
                    RowIntoEdit($tr);
                }else{
                    RowOutEdit($tr);
                }
            }
        });
    }

    function CreateSelect(attrs,csses,option_dict,item_key,item_value,current_val){
        var sel= document.createElement('select');
        $.each(attrs,function(k,v){
            $(sel).attr(k,v);
        });
        $.each(csses,function(k,v){
            $(sel).css(k,v);
        });
        $.each(option_dict,function(k,v){
            var opt1=document.createElement('option');
            var sel_text = v[item_value];
            var sel_value = v[item_key];

            if(sel_value==current_val){
                $(opt1).text(sel_text).attr('value', sel_value).attr('text', sel_text).attr('selected',true).appendTo($(sel));
            }else{
                $(opt1).text(sel_text).attr('value', sel_value).attr('text', sel_text).appendTo($(sel));
            }
        });
        return sel;
    }

    STATUS = [
        {'id': 1, 'value': "在线"},
        {'id': 2, 'value': "下线"}
    ];

    BUSINESS = [
        {'id': 1, 'value': "车上会"},
        {'id': 2, 'value': "二手车"}
    ];

    function RowIntoEdit($tr){
        $tr.children().each(function(){
            if($(this).attr('edit') == "true"){
                if($(this).attr('edit-type') == "select"){
                    var select_val = $(this).attr('sel-val');
                    var global_key = $(this).attr('global-key');
                    var selelct_tag = CreateSelect({"onchange": "MultiSelect(this);"}, {}, window[global_key], 'id', 'value', select_val);
                    $(this).html(selelct_tag);
                }else{
                    var orgin_value = $(this).text();
                    var temp = "<input value='"+ orgin_value+"' />";
                    $(this).html(temp);
                }

            }
        });
    }

    function RowOutEdit($tr){
        $tr.children().each(function(){
            if($(this).attr('edit') == "true"){
                if($(this).attr('edit-type') == "select"){
                    var new_val = $(this).children(':first').val();
                    var new_text = $(this).children(':first').find("option[value='"+new_val+"']").text();
                    $(this).attr('sel-val', new_val);
                    $(this).text(new_text);
                }else{
                    var orgin_value = $(this).children().first().val();
                    $(this).text(orgin_value);
                }

            }
        });
    }

    function CheckAll(mode, tb){
        if($(mode).hasClass('editing')){

            $(tb).children().each(function(){

                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){

                }else{
                    check_box.prop('checked',true);

                    RowIntoEdit(tr);
                }
            });

        }else{

            $(tb).find(':checkbox').prop('checked', true);
        }
    }

    function CheckReverse(mode, tb){

        if($(mode).hasClass('editing')){

            $(tb).children().each(function(){
                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){
                    check_box.prop('checked',false);
                    RowOutEdit(tr);
                }else{
                    check_box.prop('checked',true);
                    RowIntoEdit(tr);
                }
            });


        }else{
            
            $(tb).children().each(function(){
                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){
                    check_box.prop('checked',false);
                }else{
                    check_box.prop('checked',true);
                }
            });
        }
    }

    function CheckCancel(mode, tb){
        if($(mode).hasClass('editing')){
            $(tb).children().each(function(){
                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){
                    check_box.prop('checked',false);
                    RowOutEdit(tr);

                }else{

                }
            });

        }else{
            $(tb).find(':checkbox').prop('checked', false);
        }
    }

    function EditMode(ths, tb){
        if($(ths).hasClass('editing')){
            $(ths).removeClass('editing');
            $(tb).children().each(function(){
                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){
                    RowOutEdit(tr);
                }else{

                }
            });

        }else{

            $(ths).addClass('editing');
            $(tb).children().each(function(){
                var tr = $(this);
                var check_box = tr.children().first().find(':checkbox');
                if(check_box.prop('checked')){
                    RowIntoEdit(tr);
                }else{

                }
            });

        }
    }


    //商城菜单
    $(function () {
        Change("#all_menu_catagory","#nav_all_menu","#nav_all_content")
    });

    function Change(menuF,menuS,menuT) {
        $(menuF).bind({
            "mouseover":function () {
            $(menuS).parent().removeClass("hide");
        },"mouseout":function () {
            $(menuS).parent().addClass("hide");
        }
        });

        $(menuS).children().bind({
            "mouseover":function () {
                $(menuS).parent().removeClass("hide");
                var $item = $(menuT).find('[float-id="' +　$(this).attr("float-content") + '"]');
                $item.removeClass("hide").siblings().addClass("hide");
            },
            "mouseout":function () {
                $(menuS).parent().addClass("hide");
                $(menuT).parent().addClass("hide");
            }
        });
        
        $(menuT).children().bind({
            "mouseover":function () {
                $(menuS).parent().removeClass("hide");
                $(this).removeClass("hide");
            },
            "mouseout":function () {
                $(menuS).parent().addClass("hide");
                $(this).addClass("hide");
            }
        })
    }

    //轮播图
    $(function(){
        var size=$(".img li").size();
        for (var i= 1;i<=size;i++){
            var li="<li>"+i+"</li>";
            $(".num").append(li);
        }
        $(".num li").eq(0).addClass("active");


        $(".num li").mouseover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var index=$(this).index();
        i=index;
        $(".img li").eq(index).fadeIn(1000).siblings().fadeOut(1000);
        });


    i=0;
    var t=setInterval(move,1500);

    function move(){
        i++;
        if(i==size){
            i=0;
        }
        $(".num li").eq(i).addClass("active").siblings().removeClass("active");
        $(".img li").eq(i).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
    }

    function moveL(){
        i--;
        if(i==-1){
            i=size-1;
        }
        $(".num li").eq(i).addClass("active").siblings().removeClass("active");
        $(".img li").eq(i).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
    }

    $(".out").hover(function(){
        clearInterval(t);
    },function(){
        t=setInterval(move,1500);
    });

    $(".out .right").click(function(){
        move()
    });
    $(".out .left").click(function(){
    moveL()
    })

    });


    //使用扩展
    jQuery.fn.extend({
        check: function() {
        return this.each(function() { this.checked = true; });
        },
        uncheck: function() {
        return this.each(function() { this.checked = false; });
        }
    });
    
    $("input[type=checkbox]").check();
    $("input[type=radio]").uncheck();
    //or
    jQuery.extend({
        min: function(a, b) { return a < b ? a : b; },    //三元运算
        max: function(a, b) { return a > b ? a : b; }
    });
    
    jQuery.min(2,3);     //2
    jQuery.max(4,5);    //5