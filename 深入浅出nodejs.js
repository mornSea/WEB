//基础
    //异步      主要解决方案有如下3种： 事件发布/订阅模式， Promise/Deferred模式， 流程控制库
        //第一种事件监听器模式是一种广泛用于异步编程的模式，是回调函数的事件化，又称发布/订阅模式。Node自身提供的events模块  订阅事件就是一个高阶函数的应用。事件发布/订阅模式可以实现一个事件与多个回调函数的关联，这些回调函数又称为事件侦听器。通过emit()发布事件后，消息会立即传递给当前事件的所有侦听器执行。
        emitter.on("event1", function(message){ //订阅
            console.log(message);
        });
        emitter.emit("event1", "i ammessage!");     //发布
        //事件侦听器模式也是一种钩子（hook）机制，利用钩子导出内部数据或状态给外部的调用者。
        $.get('/api', {success: onSuccess, error:onError, complete: onComplete});       //普通Ajax

        $.get('./api')                     //promise/deferred模式 用promise回调
            .success(onSuccess) 
            .error(onError)                 //即使不调用success()、error()等方法，Ajax也会执行
            .complete(onComplete);

        //async也提供了一个方法用于处理异步调用的限制：parallelLimit()  , 与parallel()类似，但多了一个用于限制并发数量的参数，使得任务只能同时并发一定数量，而不是无限制并发。
        //如下是async的示例代码：
        async.parallelLimit([function(callback){
            fs.readFile('file1.txt', 'utf-8', callback);
        }, function(callback){
            fs.readFile('file2.text', 'utf-8', callback);
        }], 1, function(err, results){
            //TODO
        });
       
        
    //尾触发 与 中间件：
        //需要手工调用才能持续执行后续调用的，我们将此类方法叫做尾触发，常见的关键词是next。事实上，尾触发目前应用最多的地方是Connect的中间件 （使用了尾触发的机制）。   
        function (req, res, next){          
            //中间件： 每个中间件传递请求对象、响应对象和尾触发函数，通过队列形成一个处理流
        }
     
    
    //connect核心实现：
    function createServer() {               //res,req ： 请求对象和响应对象
        function app(req, res){  //创建了HTTP服务器的request事件处理函数 
            app.handle(req, res); 
        }
        utils.merge(app, proto);  //merge（）：合并
        utils.merge(app, EventEmitter.prototype);
        app.route = '/';  
        app.stack = [];             //stack属性是这个服务器内部维护的中间件队列。
        for (var i = 0; i < arguments.length; ++i) {
            app.use(arguments[i]);  //use（）：将中间件放进队列中
        }  
        return app;
    };         

        //通过调用use()方法我们可以将中间件放进队列中。下面的代码为use()方法的重要部分：
        app.use = function(route, fn){  
            // some code
            this.stack.push({ route: route, handle: fn });　
            return this;
        };

        //监听函数 实现如下：
        app.listen = function(){
            var server = http.createServer(this);  
            return server.listen.apply(server, arguments);
        };                                            
        //最终回到app.handle()方法，每一个监听到的网络请求都将从这里开始处理。该方法的代码如下：
        app.handle = function(req, res, out) {
            // some code
            next();
        };

        //next（） 原理十分简单，取出队列中的中间件并执行，同时传入当前方法以实现递归调用，达到持续触发的目的：
        function next(err) {  
            // some code
            // next callback  
            layer = stack[index++];　
            layer.handle(req, res, next);
        };




    //垃圾回收 内存占用
        //命令行中查看垃圾回收日志  （主要是在启动时添加--trace_gc参数）  最后保存在gc。log文件
        /* node --trace_gc -e "var a = [];for (var i = 0; i < 1000000; i++) a.push(new Array(100));" > gc.log   */  
        var foo = function () {var local = {};};    //用作用域触发垃圾回收  老生代的对象要用delete关键字 或者赋值为undefined / null  解除引用 后者更好
        process.memoryUsage();                       //node命令行里调用 可以查看node内存使用情况。     结果如 { rss: 13852672,  heapTotal: 6131200,  heapUsed: 2757120 }  rss是resident set size的缩写，即进程的常驻内存部分。进程的内存总共有几部分，一部分是rss，其余部分在交换区（swap）或者文件系统（filesystem）中。除了rss外，heapTotal和heapUsed对应的是V8的堆内存信息。heapTotal是堆中总共申请的内存量，heapUsed表示目前堆中使用中的内存量。这3个值的单位都是字节
        
        //JavaScript开发者通常喜欢用对象的键值对来缓存东西，但这与严格意义上的缓存又有着区别，严格意义的缓存有着完善的过期策略，而普通对象的键值对并没有。      目前比较好的解决方案是采用进程外的缓存，进程自身不存储状态。外部的缓存软件有着良好的缓存过期淘汰策略以及自有的内存管理
        //一个模块limitablemap，它可以实现对键值数量的限制(小应用场景使用)。下面是其实现：（记录键在数组中，一旦超过数量，就以先进先出的方式进行淘汰）
        var LimitableMap = function (limit){    //定义对象 ，数组， 大小常量
            this.limit = limit || 10;
            this.map = {};
            this.keys = [];
        };

        var hasOwnProperty = Object.prototype.hasOwnProperty;     //变成对象通用方法
        LimitableMap.prototype.set = function(key, value){        //1检查是否有数组/对象，有则2再检查是否已经到上限了 也到上限了则把对象里（最早加入数组的元素=最早加入的key）对应的键值对删除 再把键加入键数组+键值加入对象， 没有到上限则直接把键加入键数组+键值加入对象，  没有则直接加入键值对到对象   
            var map = this.map;
            var keys = this.keys;
            if(!hasOwnProperty.call(map, key)){
                if(keys.length === this.limit){
                    var firstKey = keys.shift();
                    delete map[firstKey];
                }
                keys.push(key);
            }
            map[key] = value;
        };

        LimitableMap.prototype.get = function(key){     //返回对应值
            return this.map[key];
        };
        module.exports = LimitableMap;




    //创建一个TCP服务器端来接受网络请求，代码如下：
        var net = require('net');
        var server = net.createServer(function (socket) {
            // 新的连接  
            socket.on('data', function (data) {socket.write("你好");  });
            socket.write("欢迎光临《深入浅出Node.js》示例：\n");
            socket.on('end', function () {console.log('连接断开');});  
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
        var socket = new http.WebSocket('ws://127.0.0.1:12010/updates');
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
//网络协议命令：    PUT代表新建一个资源，POST表示要更新一个资源，GET表示查看一个资源，而DELETE表示删除一个资源。
    //比如 根据请求方法决定响应行为：       （请求方法存于报文第一行第一个单词 通常大写）
    function (req, res){
        switch(req.method){
            case 'POST':
                update(req, res);
                break;
            case 'DELETE':
                remove(req, res);
                break;
            case 'PUT':
                create(req, res);
                break;
            case 'GET':
            default:
                get(req, res);
        }
    };
    //或者用钩子  将上面代码保存为对象  如：
        {"POST": update(req, res)},

    //静态文件服务器  根据路径进行查找硬盘 并返回
    function (req, res){
        var pathname = url.parse(req.url).pathname;     //HTTP。Parser将其解析为req。url
        fs.readFile(path.join(ROOT, pathname)),         //注意 这里用逗号 而非分号 代表这句没有执行完 不会垃圾回收  而是先挂在这
        function (err, file){
            if(err){
                res.write(404);
                res.end("找不到文件");
                return;
            }
            res.writeHead(200);
            res.end(file);
        }
    };
    
    //根据路径选择控制器  预设路径为控制器和行为的组合， 无需额外配置路由  
    //如/controller/action/a/b/c这里的controller会对应到一个控制器，
    //action对应到控制器的行为，剩余的值会作为参数进行一些别的判断。
    function (req, res){
        var pathname = url.parse(req.url).pathname;
        var paths = pathname.split('/');
        var controller = paths[1] || 'index';
        var action = paths[2] ||'index';
        var args = paths.slice(3);
        
        if(handlse[controller] && handles[controller][action]){
            handles[controller][action].apply(null, [req, res].concat(args));
        } else {
            res.writeHead(500);
            res.end('找不到响应控制器');
        }
    }
        //这样我们的业务部分可以只关心具体的业务实现，如下所示：
        handles.index = {};
        handles.index.index = function(req, res, foo, bar){
            res.writeHead(200);
            res.end(foo);
        };
    
        //Node提供了querystring模块用于处理url这部分数据，如下所示：
        var url = require('url');
        var queryString = require('querystring');
        var query = queryString.parse(url.parse(req.url).query);
        //更简洁的方法是给url.parse()传递第二个参数
        var  query = url.parse(req.url, true).query;
        //它会将url后的查询字符串解析为一个json对象  
        //在业务调用之前 中间件/框架会将查询字符串转换 挂载在请求对象上供业务使用
        function (req, res){            //就是上面的简洁方法  
            req.query = url.parse(req.url, true).query;
            handle(req, res);
        }
        //但如果查询字符串的键出现多次 那么值会是一个数组  如：foo=bar&foo=baz  转换结果:  foo: ['bar', 'baz']
        //业务的判断一定要检查值是数组还是字符串，否则可能出现TypeError




//网络协议命令（PUT DELETE）




//cookie  
    //分为：1服务器发送至浏览器  2浏览器保存  3每次浏览器向服务器发送
    //如果在域名的根节点设置Cookie，几乎所有子路径下的请求都会带上这些Cookie，这些Cookie在某些情况下是有用的，但是在有些情况下是完全无用的。其中以静态文件最为典型，
    //我们可以通过curl工具构造这个字段，(或者用npm下载request包  / curl。js)如下所示：
    curl -v -H "Cookie: foo=bar; baz=val" "http://127.0.0.1:1337/path?foo=bar&foo=baz"        //bash 命令行语句 
    
    //HTTP_Parser会将所有的报文字段解析到req.headers上，那么Cookie就是req.headers.cookie。
    //根据规范中的定义，Cookie值的格式是key=value; key2=value2形式的，
    //如果我们需要Cookie，解析它也十分容易，如下所示：
    var parseCookie = function (cookie) {
        var cookies = {};
        if (!cookie){
            return cookies;
        }
        var list = cookie.split(';');
        for (var i=0, len=list.length; i<len; i++){
            var pair = list[i].split('=');
            cookies[pair[0].trim()] = pair[1];
        }
        return cookies;
    };




//session
    //Session的数据只保留在服务器端，也无须每次传递。如何将每个客户和服务器中的数据一一对应起来？ 
    //第一种：基于Cookie来实现用户和数据的映射：Session的有效期通常较短，如果在20分钟内客户端和服务器端没有交互产生，服务器端就将数据删除。
        //约定一个键值作为Session的口令，这个值可以随意约定，比如Connect默认采用connect_uid，Tomcat会采用jsessionid等。一旦服务器检查到用户请求Cookie中没有携带该值，它就会为之生成一个值，这个值是唯一且不重复的值，并设定超时时间。
    var sessions = {};
    var key = 'session_id';
    var EXPIRES = 20 * 60 * 1000;           //time
    var generate = function(){
        var session = {};
        session.id = (new Date()).getTime() + Math.random();
        session.cookie = {
            expire: (new Date()).getTime() + EXPIRES
        };
        sessions[session.id] = session;
        return session;
    };
    //每个请求到来时，检查Cookie中的口令与服务器端的数据，如果过期，就重新生成，如下所示：
    function (req, res) {
        var id = req.cookies[key];
        if(!id){
            req.session = generate();               //generate 生成
        } else{
            var session = sessions[id];
            if(session){
                if(session.cookie.expire > (new Date()).getTime()) {
                    session.cookie.expire = (new Date()).getTime() + EXPIRES;
                    req.session = session;
                } else {        //超时了，删除旧的数据，并重新生成
                    delete sessions[id];
                    req.session = generate();
                }
            } else {            //如果session过期或口令不对，重新生成session
                req.session = generate();
            }
        }
        handle(req, res);
    }
    //当然仅仅重新生成Session还不足以完成整个流程，还需要在响应给客户端时设置新的值，以便下次请求时能够对应服务器端的数据。
    //这里我们hack响应对象的writeHead()方法，在它的内部注入设置Cookie的逻辑，如下所示：
    var writeHead = res.writeHead;
    res.writeHead = function(){
        var cookies = res.getHeader('Set-Cookie');
        var session = serialize(key, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };
    //session前后端对应完成了。判断和设置session，来维护用户与服务器端的关系(使用实例)，
    //这样在session中保存的数据比直接在Cookie中保存数据要安全得多。  如下所示：
    var handle = function(req, res){
        if(!req.session.isVisit) {
            req.session.isVisit = true;
            res.writeHead(200);
            res.end('欢迎第一次来到动物园 ^—^');
        } else {
            res.writeHead(200);
            res.end('动物园再次欢迎你 ^—^');
        }
    };

    //第二种：通过查询字符串来实现浏览器端和服务器端数据的对应它的值  
        //原理是检查请求的查询字符串，如果没有值，会先生成新的带值的URL  （客户端）：
    var getURL = function(_url, key, value){
        var obj = url.parse(_url, true);
        obj.query = value;
        return url.format(obj);
    };
    //然后形成跳转，让客户端重新发起请求，（服务器端）如下所示：
    function (req, res){
        var redirect = function(url){
            res.setHeader('Location', url);
            res.writeHead(200);
            res.end();
        };
        var id = req.query[key];
        if(!id){
            var session = generate();                       
            redirect(getURL(req.utl, key, session.id));     //redirect 重新寄送
        }else {
            var session = sessions[id];
            if(session){
                if(session.cookie.expire > (new Date()).getTime()) {           // 更新超时时间        
                    session.cookie.expire = (new Date()).getTime() + EXPIRES;
                    req.session = session;
                    handle(req, res);
                } else {        // 超时了，删除旧的数据，并重新生成
                    delete sessions[id];
                    var session = generate();
                    redirect(getURL(req,url, key, session.id));
                }
            } else {            //如果session过期或口令不对，重新生成session
                var session = generate();
                redirect(getURL(req.url, key, session.id));
            }
        }
    }




//从缓存提高性能
    // 添加Expires 或Cache-Control 到报文头中。  ·配置 ETags。   ·让Ajax 可缓存


//文件上传
    //通过报头的Transfer-Encoding或Content-Length即可判断请求中是否带有内容，如下所示：
    var hasBody = function(req){
        return  'transfer-encoding' in req.headers || 'content-length' in req.headers;
    };
    //在HTTP_Parser解析报头结束后，报文内容部分会通过data事件触发，我们只需以流的方式处理即可，如下所示：
    function (req, res){
        if(hasBody(req)){
            var buffers = [];
            req.on('data', function(chunk){     //检测到key为数据时  保存数据块
                buffers.push(chunk);
            });
            req.on('end', function(){
                req.rawBody = Buffer.concat(buffers).toString();        //检测到结束时  用fs的Buffer。concat把数据块变成一个数据缓冲区  并用toString变成字符
                handle(req, res);
            });
        } else {
            handle(req, res);
        }
    }



//路由 与 中间件         （见connect的核心实现部分）
    /*
    路由：
        在MVC模式流行起来之前，根据文件路径执行动态脚本也是基本的路由方式，
        它的处理原理是Web服务器根据URL路径找到对应的文件，如/index.asp或/index.php。
        Web服务器根据文件名后缀去寻找脚本的解析器，并传入HTTP请求的上下文。

        MVC模型的主要思想是将业务逻辑按职责分离，主要分为以下几种。
        模型    （Model）， 数据相关的操作和封装。
        视图    （View），  视图的渲染。    
        控制器  （Controller）一组行为的集合。


        这是目前最为经典的分层模式（如图8-3所示），大致而言，它的工作模式如下：
        路由解析，根据URL寻找到对应的控制器（和行为）。
        行为调用相关的模型，进行数据操作。
        数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端。
    */





//中间件  
    /* 
    中间件：
        中间件的含义借指了（操作系统/编程语言里）这种封装底层细节，为上层提供更方便服务的意义
        中间件的行为比较类似Java中过滤器（filter）的工作原理，就是在进入具体的业务处理之前，先让过滤器处理。
        从HTTP请求到具体业务逻辑之间，其实有很多的细节要处理。Node的http模块提供了应用层协议网络的封装，
        对具体业务并没有支持，在业务逻辑之下，必须有开发框架对业务提供支持。这里我们通过中间件的形式搭建开发框架，这个开发框架用来组织各个中间件。
        对于Web应用的各种基础功能，我们通过中间件来完成，每个中间件处理掉相对简单的逻辑，最终汇成强大的基础框架。
        由于中间件就是前述的那些基本功能，所以它的上下文也就是请求对象和响应对象：req和res。有一点区别的是，由于Node异步的原因，
        我们需要提供一种机制，在当前中间件处理完成后，通知下一个中间件执行。
        这里我们采用Connect的设计，通过尾触发的方式实现。一个基本的中间件会是如下的形式：
    */
        var middleware = function(req, res. next){
            //TODO something  （）
            next();
        }




//页面渲染
    /* 
    不管是通过MVC还是通过RESTful路由，开发者或者是调用了数据库，或者是进行了文件操作，或者是处理了内存，这时我们终于来到了响应客户端的部分了。
    这里的“页面渲染”是个狭义的标题，我们其实响应的可能是一个HTML网页，也可能是CSS、JS文件，或者是其他多媒体文件。
    页面渲染是一种内置的功能。但对于Node来说，它并没有这样的内置功能，在本节的介绍中，
    你会看到正是因为标准功能的缺失，我们可以更贴近底层，发展出更多更好的渲染技术
    
    Content-Type字段的值是不同的。如可form的enctype指定： enctype=“multiparty/form-data”
    浏览器正是通过不同的Content-Type的值来决定采用不同的渲染方式，这个值我们简称为MIME值。 定义网络文件的类型/网页的编码
    
    需求中并不要求客户端去打开它，只需弹出并下载它即可。
    为了满足这种需求， Content-Disposition 字段应声登场
    */




//响应json
    //为了快捷地响应JSON数据，我们也可以如下这样进行封装：
    res.json = function(json){
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(json));
    };
    //响应跳转:当我们的URL因为某些问题（譬如权限限制）不能处理当前请求，
    //需要将用户跳转到别的URL时，我们也可以封装出一个快捷的方法实现跳转，如下：
    res.redirect = function(url){
        res.setHeader('Location', url);
        res.writeHead(302);
        res.end('Redirect to ', + url);
    };


 

//模板
    //模板是带有特殊标签的HTML片段，通过与数据的渲染，将数据填充到这些特殊标签中，
    //最后生成普通的带数据的HTML片段。通常我们将渲染方法设计为render()，参数就是模板路径和数据，如下所示：
    res.render = function(view, data){
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        var html = render(view, data);          //实际渲染  node里数据自然首选json
        res.end(html);
    };

    /* 
    模板技术虽然多种多样，但它的实质就是将模板文件和数据通过模板引擎生成最终的HTML代码。形成模板技术的也就如下4个要素。
    模板语言。包含模板语言的模板文件。拥有动态数据的数据对象。模板引擎。 
    模板技术并不是什么神秘的技术，它干的实际上是拼接字符串这样很底层的活
    
    假设我们的模板是如下这样的，<%=%>就是我们制定的模板标签（选择这个标签主要因为ASP和JSP都采用它做标签，相对熟悉）：
    Hello <%= username%>如果我们的数据是{username: "JacksonTian"}，那么我们期望的结果就是Hello JacksonTian。
    具体实现的过程是模板分为Hello和<%= username%>两个部分，前者为普通字符串，后者是表达式。
    表达式需要继续处理，与数据关联后成为一个变量值，最终将字符串与变量值连成最终的字符串。
    
    通过render()方法实现一个简单的模板引擎。这个模板引擎会将Hello <%= username%>转换为"Hello " + obj.username。该过程进行以下几个步骤。
    语法分解。提取出普通字符串和表达式，这个过程通常用正则表达式匹配出来，<%=%>的正则表达式为/<%=([\s\S]+?)%>/g。
    处理表达式。将标签表达式转换成普通的语言表达式。生成待执行的语句。
    与数据一起执行，生成最终字符串。知晓了流程，模板函数就可以轻松愉快地开工了，如下所示：
    */
    var render = function(str, data){                   // 模板技术 就是替换特殊标签的技术    参数 （模板，数据）
        var tpl = str.replace(/<%=([\s\S]+?)%>/g,       //新建tpl变量， 是模板的字符串移位  并用正则表达式 匹配的内容（key）会被第二个参数的返回值（value）替换
            function(match, code){                      //字符串移位的回调：返回新的子字符串  其中将字符串变成obj对象的属性
                return " '+obj."  + code +  "+ '";          
        });                                             //模板编译 ： tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
        tpl = "var tpl = '" + tpl + "'\n return tpl;";  //再将替换后的字符串 变成赋值自己并返回的代码字符串 
        
        var complie = new Function('obj', tpl);        //返回函数对象， 函数名是obj， 代码是上一步的代码字符串  
        return complie(data);                          //即将原始的模板字符串转换成一个函数对象 function(obj){ var tpl = 'Hello ' + obj.username + '.';      return tpl}
    };
    //使用
    var tpl = 'Hello <%= username %>';
    console.log(render(tpl, {username: 'Jackson Tian'}));

    //模板编译 时  生成的中间函数只与模板字符串有关 与具体数据无关
    //如果每次编译时都生成这个函数 会浪费cpu时间， 通常采用模板预编译
    //将上面代码拆解为两个方法；
    var complie = function(str){
        var tpl = str.replace(/<%=([\s\S]+?)%>/g,
            function(match, code){
                return "'+obj." + code + "+ '";
            });
            tpl = "var tpl = '" + tpl + "; \n return tpl;";
        return new Function('obj, escape', tpl);
    };

    var render = function(complie, data){
        return complie(data);
    };
    //预编译缓存模板编译后的结果，实际应用中就可以实现一次编译，多次执行


    //还可以使用with得到便利：  (普通字符串就直接输出，变量code的值则是obj[code])
    var complie = function(str, data){
        var tpl = str.replace(/<%=([\s\S]+?)%>/g,       //因此，在模板技术的使用中，不要忘记转义，尤其是与输入有关的变量一定要转义。
            function(match, code){
                return "' + " + code + "+ '";
            });
            tpl = "tpl = '" + tpl + "'";
            tpl = 'var tpl = "   ";\n with(obj){'+ tpl +'};\n return tpl;';
            return new Function('obj', tpl);
    };

    //添加逻辑 （没有等号） 使得模板可以控制页面渲染：
    /*
     <% if (user) {%>
        <h2><%= user.name %></h2>
    <% } else { %>
        <h2>匿名用户</h2>
    <% } %> 
    */
    //要编译成的函数：
    function(obj, escape){
        var tpl = "";
        with(obj){
            if(user){
                tpl += "<h2>" + escape(user.name) + "</h2>";
            } else {
                tpl += "<h2>匿名用户</h2>";
            }
        }
        return tpl;
    }

    //模板引擎拼接字符串的原理还是通过正则表达式进行匹配替换，如下所示：
    var complie =function(str){            //连环调用
        var tpl = str.replace(/\n/g, '\\n')             //替换 换行符
            .replace(/<%=([\s\S]+?)%>/g, function(match, code){
                return "' +escape(" + code + ") +'";    //转义
            })
            
            .replace(/<%=([\s\S]+?)%>/g, function(match, code){
                return "' + " + code + " +'";           //正常输出
            })
            
            .replace(/<%([\s\S]+?)%>/g, function(match, code){
                return "';\n" + code + "\n tpl += '"    //可执行代码
            })
            
            .replace(/\'\n/g, '\'')

            .replace(/\n\'/gm, '\'');

        tpl = "tpl = '" + tpl + "';";                   
        tpl = tpl.replace(/''/g, '\'\\n\'');            //转换空行
        tpl = 'var tpl = "";\n with(obj || {}) {\n' + tpl + '\n}\n return tpl;';
        return new Function('obj', 'escape', tpl);
    };

    //EJS中，它的变量不是obj，而是locals，这里的值与模板引擎中的with语句有关。
    //此外，实现了执行表达式的模板引擎还能进行循环，如下所示：
    var tpl = [
        '<% for (var i=0, len=items.length; i<len; i++) {%>',
            '<% var item = items[i]; %>',
            '<p><%= i+1 %>, <%= item.name %></p>',
        '<% } %>'
    ].join('\n');
    
    render(
        complie(tpl),
        {items: [{name: 'terest'}, {name: '晨海'}]}
    );




//文件系统
    //将complied（）和 render（）的编译替换 + HTTP响应对象 = 集成文件系统  用以响应客户端
    app.get('/path', function(req, res){
        fs.readFile('file/path', 'urf8', function(err, text){
            if(err){
                res.writeHead(500, {'Content-Type' : 'text/html'});
                res.end('模板文件错误');
                return ;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = render(complie(text), data);
            res.end(html);
        });
    });

    //缺点： 每次请求 反复读模板 + 编译     so 我们需要一个简洁 高效的render（）  
    var cache = {};                         //由于使用了缓存 除了第一次 后面都不会反复读取和编译
    var VIEW_FOLDER = '/path/to/wwwroot/views';
    res.render = function(viewname, data){
        if(!cache[viewname]){
            var text;
            try {
                text = fs.readFileSync( path.join(VIEW_FOLDER, viewname), 'utf8');
            } catch (e) {
                res.writeHead(500, {'Content-Type' : 'text/html'});
                res.end('模板文件错误');
                return;
            }
            cache[viewname] = complie(text);
        }
        var complied = cache[viewname];
        res.writeHead(200, {'Content-Type': 'text/html'});
        var html = complied(data);
        res.end(html);
    };

    //调用
    app.get('/path', function(req, res){
        res.render('viewname', {});
    });

    //子模板 ： （可重用）嵌套在别的模板中  用include关键字来实现模板的嵌套
        //母模板：
        {/*
        <ul>
            <% users.forEach(function(user) { %> 
                <% include user/show %>    
            <% }) %>
        </ul>
        //子模板
        <li>
            <%= user.name %>    
        </li>
        //效果相当:
        <ul>  
            <% users.forEach(function(user){ %>
                <li><%=user.name%></li>  
             <% }) %>
        </ul> 
        */}

        //子模板关键还是先将include语句进行替换 再整体性编译：
        var files = {};
        var preComplie = function(str){
            var replaced = str.replace(/<%\S+(include.*)\s+%>/g,
            function(match, code){
                var partial = code.split(/\s/)[1];
                if(!files[partial]){
                    files[partial] = fs.readFileSync(paht.join(VIEW_FOLDER, partial), 'utf8');
                }
                return files[partial];
            });
            if(str.match(/<%\s+(include.*)\s+%>/)){     //多重嵌套 继续替换
                return preComplie(replaced);            //递归
            } else {
                return replaced;
            }
        };

        //改造complie()  
            //模板技术必须支持布局视图，布局模板只有一份，渲染视图时，指定好布局视图就可以了
            res.render('viewname', {
                layout: 'layout.html',
                users: []
            });
            //对于布局模板文件，设计将<%- body %>部分替换为子模板
            var renderLayout = function(str, viewname) {
                return str.replace(/<%-\s*body\s*%>/g, 
                    function(match, code){
                        if(!cache[viewname]){
                            cache[viewname] = fs.readFileSync(  fs.join(VIEW_FOLDER, viewname), 'utf8');
                        }
                        return cache[viewname];
                    });
            };


        //最终集成进res。render（）  
        res.render = function(viewname, data){
            var layout = data.layout;
            if(layout){
                if(!cache[layout]){
                    try{
                        cache[layout] = fs.readFileSync(path.join(VIEW_FOLDER, layout), 'utf8');
                        res.writeHead(500, {'Content-Type' : 'text/html'});
                        res.end('布局文件错误');
                        return ;
                    }
                }
            }
            
            var layoutContent = cache[layout] || '<%-body%>';
            var replaced;
            try {
                replaced = renderLayout(layoutContent, viewname);
            } catch(e){
                res.writeHead(500, {'Content-Type': 'text.html'});
                res.end('模板文件错误');
                return;
            }

            //将模板和布局文件名做key缓存
            var key = viewname + ':' + (layout || '');
            if(!cache[key]){        //编译模板
                cache[key] = cache(replaced);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = cache[key](data);
            res.end(html);
        }
        //模板引擎的继续优化方法： 缓存模板文件， 缓存模板文件编译后的函数




//多进程 
    //Node采用单线程避免了不必要的内存开销和上下文切换开销。
    //如PHP的健壮性是由它给每个请求都建立独立的上下文来实现的。
    //但是对于Node来说，所有请求的上下文都是统一的
    //Node提供了child_process模块，并且也提供了child_process.fork()函数供我们实现进程的复制。以充分利用多核

        //worker.js       通过node worker.js启动它，将会侦听1到1000之间的一个随机端口
        
        var http = require('http');
        var num = Math.round((1 + Math.random()) *1000);
        console.log('listening：http://127.0.0.1:' + num + ' ');
        http.createServer (function(req, res){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello, world\n');
        })
            .listen(num, '127.0.0.1');
        
        //master.js         通过node master.js启动它
        var fork = require('child_process').fork;
        var  cpus = require('os').cpus();
        for (var i=0, len=cpus.length; i<len; i++){     //会根据当前机器上的CPU数量复制出对应Node进程数
            //fork('./worker.js');
             fork (console.log('now we have '+ (i+1) + ' process'));    
        };

        //child_process模块给予Node可以随意创建子进程（child_process）的能力。它提供了4个方法用于创建子进程。
        //spawn()   启动个子进程来执行命令
        //exec()    前者升级 可用回调得知子进程状况
        //execFile()前者的 执行指定文件版
        //fork()    像第一种 但是它的子进程只要指定要执行的js文件模块

            //exec/execFiel（） 可以创建时指定timeout属性 设置超时时间 超过就kill
            //如果用execFile执行文件 要在首行写：
            #!/usr/bin/env Node         //Unix  Linux

        //在前端浏览器中， js主线程与UI渲染共用同一个线程。两者互相阻塞。(同一时间只能执行一个)
        //为避免长时间js导致ui停滞  可使用HTML5的webworker在后台运行
        var worker = new Worker('worker.js');
        worker.onmessage = function(event){
            document.getElementById('result')
                .textContent = event.data;
        };
        //worker.js
        var n = 1;
        search: while(ture){
            n+= 1;
            for (var i=2, len=Math.sqrt(n); i<len; i+=1)
                if(n % 1 == 0)  continue search;
                postMessage(n);                         
        }
        //主线程与工作线程之间通过onmessage()和postMessage()进行通信，
        //子进程对象则由send()方法实现主进程向子进程发送数据，message事件实现收听子进程发来的数据

        //Node中：          通过IPC通道，父子进程之间才能通过message和send()传递消息
            //parent.js
            var cp = require('child_process');
            var n = cp.fork(__dirname + '/sub.js');
            n.on('message', function(m){
                console.log('PARENT got message:', m);
            });
            n.send({hello: 'world'});
            //sub.js
            process.on('message', function(m){
                console.log('CHILD got meddage: ', m);
            });
            process.send({foo: 'bar'});
        
            /* 将多个进程监听同一个端口:
            
            通常的做法是让每个进程监听不同的端口，其中主进程监听主端口（如80），
            主进程对外接收所有的网络请求，再将这些请求分别代理到不同的端口的进程上。
            注	代理服务器是介于浏览器和Web服务器之间的一台服务器，有了它之后，
            浏览器不是直接到Web服务器去取回网页而是向代理服务器发出请求，
            Request信号会先送到代理服务器，由代理服务器来取回浏览器所需要的信息并传送给你的浏览器。
            
            通过代理，可以避免端口不能重复监听的问题，甚至可以在代理进程上做适当的负载均衡，
            使得每个子进程可以较为均衡地执行任务。由于进程每接收到一个连接，将会用掉一个文件描述符，
            因此代理方案中客户端连接到代理进程，代理进程连接到工作进程的过程需要用掉两个文件描述符。
            操作系统的文件描述符是有限的，代理方案浪费掉一倍数量的文件描述符的做法影响了系统的扩展能力。
            为了解决上述这样的问题，Node在版本v0.5.9引入了进程间发送句柄的功能。
            send()方法除了能通过IPC发送数据外，还能发送句柄，第二个可选参数就是句柄，如下所示：
            */ 
            child.send(message, [sendHandle])
            /*
            那什么是句柄？句柄是一种可以用来标识资源的引用，它的内部包含了指向对象的文件描述符。
            比如句柄可以用来标识一个服务器端socket对象、一个客户端socket对象、一个UDP套接字、一个管道等。
            发送句柄意味着什么？在前一个问题中，我们可以去掉代理这种方案，使主进程接收到socket请求后，
            将这个socket直接发送给工作进程，而不是重新与工作进程之间建立新的socket连接来转发数据。
            注	这样一来，所有的请求都是由子进程处理了。多个子进程可以同时监听相同端口， 
                        
            除了message事件外，Node还有如下这些事件：
            error：当子进程无法被复制创建、无法被杀死、无法发送消息时会触发。
            exit：子进程退出时触发该事件，
                子进程如果是正常退出，这个事件的第一个参数为退出码，否则为null。
                如果进程是通过kill()方法被杀死的，会得到第二个参数，它表示杀死进程时的信号。
            close：在子进程的标准输入输出流中止时触发该事件，参数与exit相同。
            disconnect：在父进程或子进程中调用 disconnect()方法时触发该事件，在调用该方法时将关闭监听IPC通道。
            suicide(自杀）: 工作进程在得知要退出时，向主进程发送一个自杀信号，
                然后才停止接收新的连接，当所有连接断开后才退出。
                主进程在接收到自杀信号后，立即创建新的工作进程服务
            
            工作进程不能无限制地被重启，如果启动的过程中就发生了错误，
            或者启动后接到连接就收到错误，会导致工作进程被频繁重启，
            这种频繁重启不属于捕捉异常的情况，不符合预期的设置，极有可能是程序编写的错误。
            为了消除这种无意义的重启，在满足一定规则的限制下，不应当反复重启。
            比如在单位时间内规定只能重启多少次，超过限制就触发giveup事件，
            告知放弃重启工作进程这个重要事件。*/
        
        //使用Cluster模块   (child_process和net模块的组合应用)
            //创建node进程集群  （像进程段落开头）
            //cluster.js
            var cluster = require('cluster');
            cluster.setupMaster({               //而不是使用cluster.fork()  主进程和工作进程从代码上完全剥离 不受NODE_UNIQUE_ID影响
                exec: 'worker.js'
            });
            var cpus = require('os').cpus();
            for (var i=0, len=cpus.length; i<len; i++){
                cluster.fork();
            }




//测试
    /* 编写可测试代码有以下几个原则可以遵循。
    1，单一职责：如果一段代码承担的职责越多，编写单元测试就要造更多的输入数据，
        然后推测它的输出。比如，一段代码中既包含数据库的连接，也包含查询，
        那么为它编写测试用例就要同时关注数据库连接和数据库查询。
        较好的方式是将这两种职责进行解耦分离，变成两个单一职责的方法，
        分别测试数据库连接和数据库查询。
    2，接口抽象：通过对程序代码进行接口抽象后，我们可以针对接口进行测试，
        而具体代码实现的变化不影响为接口编写的单元测试。
    3，层次分离。层次分离实际上是单一职责的一种实现。在MVC结构的应用中，
        就是典型的层次分离模型，如果不分离各个层次，无法想象这个代码该如何切入测试。
        通过分层之后，可以逐层测试，逐层保证。
    
    Node中assert模块，以及很多主要模块都调用了它。何谓断言？
    在程序设计中，断言（assertion）是一种放在程序中的一阶逻辑（
        如一个结果为真或是假的逻辑判断式），目的是为了标示程序开发者预期的结果
        ——当程序运行到断言的位置时，对应的断言应该为真。若断言不为真，程序会中止运行，
        并出现错误信息。一言以蔽之，断言用于检查程序在运行时是否满足期望。
    
    如下代码是assert模块的工作方式： */

    var assert = require('assert');
    assert.equal(Math.max(1, 100), 100);
    console.log('when you see me, meaning the exam is thought');        

    /* 一旦assert.equal()不满足期望，将会抛出AssertionError异常，
    整个程序将会停止执行。没有对输出结果做任何断言检查的代码，
    都不是测试代码。没有测试代码的代码，都是不可信赖的代码。

    在断言规范中，我们定义了以下几种检测方法。 
    ok()：            判断结果是否为真。
    equal()：         判断实际值与期望值是否相等。
    notEqual()：      判断实际值与期望值是否不相等。
    deepEqual()：     判断实际值与期望值是否深度相等（对象或数组的元素是否相等）。
    notDeepEqual()：  判断实际值与期望值是否不深度相等。
    strictEqual()：   判断实际值与期望值是否严格相等（相当于===）。
    notStrictEqual()：判断实际值与期望值是否不严格相等（相当于!==）。
    throws()：        判断代码块是否抛出异常。
    除此之外，Node的assert模块还扩充了如下两个断言方法。 
    doesNotThrow()：  判断代码块是否没有抛出异常。
    ifError()：       判断实际值是否为一个假值（null、undefined、0、''、false），如果实际值为真值，将会抛出异常。*/

    /* 测试用例的不同组织方式称为测试风格，
    现今流行的单元测试风格主要有TDD（测试驱动开发）和BDD（行为驱动开发）两种，
    关注点不同: TDD关注所有功能是否被正确实现，每一个功能都具备对应的测试用例；
                BDD关注整体行为是否符合预期，适合自顶向下的设计方式。
    表达方式不同:TDD的表述方式偏向于功能说明书的风格；
                BDD的表述方式更接近于自然语言的习惯。 
                
                
    BDD 对测试用例的组织主要采用describe和it进行组织。
    describe可以描述多层级的结构，具体到测试用例时，用it。
    另外，它还提供before、after、beforeEach和afterEach这4个钩子方法，
    用于协助describe中测试用例的准备、安装、卸载和回收等工作。
    before和after分别在进入和退出describe时触发执行，
    beforeEach和afterEach则分别在escribe中每一个测试用例（it）
    执行前和执行后触发执行。
    
    TDD 对测试用例的组织主要采用suite和test完成。
    suite也可以实现多层级描述，测试用例用test。
    它提供的钩子函数仅包含setup和teardown，
    对应BDD中的before和after。*/
    
    //BDD:
    describe('Array', function(){
        before(function(){
            //...
        });
        describe('#indexOf()', function(){
            it('should return -1 when not present',
            function(){
                [1, 3, 5, 7, 11, 13, 17, 23].indexOf(14).should.equal(-1);

            });
        });
    });

    //TDD:
    suite('Array', function(){
        setup(function(){
            //...
        });
        suite('#indexOf()',
        function(){
            TextTrackList('should return -1 when not present',
            function(){
                assert.equal(-1, [1, 2, 3].indexOf(4));
            });
        });
    });

    //fs的readFile测试：
    if('fs.readFile should be ok', function(done){
        fs.readFile('file_path', 'utf-8', function(err, data){
            should.not.exist(err);
            done();
        });
    });


    //mocha模块 给所有涉及异步的测试用例添加了超时限制，如果一个用例的执行时间超过了预期时间，将会记录下一个超时错误，然后执行下一个测试
    //rewire模块提供了一种巧妙的方式实现对私有方法的访问。rewire的调用方式与require十分类似。
        //测试私有方法：
        var limit = function(num){
            return num < 0 ? 0 : num;
        };
        it('limit should return success', function(){
            var lib = rewire('../lib/index.js');
            var litmit = lib._get_('limit');
            litmit(10).should.be.equal(10);
        });

        //rewire的诀窍在引入文件时，像require一样对原始文件做了一定的手脚。 除了添加头尾包装：
        (function(exports, require, module, __filename, __dirname){/* ... */})        
        //还注入了：
        (function(exports, require, module, __filename, __dirname){
            var method = function(){};
            exports.__set__ = function(name, value){
                eval(name "=" value.toString());
            };
            exports.__get__ = function(name){
                return eval(name);
            };
        });
        /* 每一个被rewire引入的模块都有 __set__() 和 __get__()方法。
        它巧妙地利用了闭包，在eval()执行时，实现对模块内-
        局部变量的访问，从而可以将局部变量导出给测试用例调用执行。*/        


//项目工程化
    //基准测试要统计的就是在多少时间内执行了多少次某个方法, 比如分别调用1 000 000次

    //benchmark （基准检测）
    //suite来组织每组测试，在测试套件中调用 add()来添加被测试的代码 还有on（） 和 run（）
    var Benchmark = require('benchmark');
    var suite =new Benchmark.Suite();
    var arr = [0, 1, 3, 7, 11, 17];

    suite.add('nativeMap', function(){
        return arr.map(callback);
    })
        .add('customMap', function(){
            var ret = [];
            for (var i=0, len=arr.length; i<len; i++){
                ret.push(callback(arr[i]));
            }
            return ret;
        })
        .on('cycle', function(event){
            console.log(String(event.target));
        })
        .on('complate', function(){
            console.log(
                        'fastest is ' + 
                        this.filter('fastest') 
                        .pluck('name')
            );
        })
        .run();



    /* 所谓的工程化，可以理解为项目的组织能力。体现在文件上，就是文件的组织能力。
    对于不同类型的项目，其组织方式也有所不同。除此之外，还应当有能够将整个项目串联起来的灵魂性文件。
    
    $ tree -L 2
    .├── History.md // 项目改动历史
    ├── INSTALL.md // 安装说明
    ├── Makefile // Makefile文件
    ├── benchmark // 基准测试
    ├── controllers // 控制器
    ├── lib // 没有模块化的文件目录
    ├── middlewares // 中间件
    ├── package.json // 包描述文件，项目依赖项配置等
    ├── proxy // 数据代理目录，类似MVC中的M
    ├── test // 测试目录
    ├── tools // 工具目录
    ├── views // 视图目录
    ├── routes.js // 路由注册表
    ├── dispatch.js // 多进程管理
    ├── README.md // 项目说明文件
    ├── assets // 静态文件目录
    ├── assets.json // 静态文件与CDN路径的映射文件
    ├── bin // 可执行脚本
    ├── config // 配置目录
    ├── logs // 日志目录
    └── app.js // 工作进程
    注	在实际的目录中，还存在node_modules这样一个目录，
    但这个目录通常不用加入到版本控制中。在部署项目时，
    我们通过npm install命令安装package.json中配置的依赖文件时，会自动生成这个目录
    
    想真正能用上源代码，还需要一定的操作，这些操作主要有：
    合并静态文件、压缩文件大小、打包应用、编译模块等。
    而构建工具就是完成此类需求的。将常用操作通过构建工具配置起来后，后续只要简单的命令就能完成大部分工作了。
    
    Makefile
    以下为经典的3行构建代码：
    $ ./configure
    $ make
    $ make install
    在这3行代码中，有两行命令跟Makefile有关。
    在Web应用中，通常也会在Makefile文件中编写一些构建任务来帮助项目提升效率，
    比如静态文件的合并编译、应用打包、运行测试、清理目录、扫描代码等
    注	基本上全部都只需要一个make命令，然后自动化配置。
    
    Grunt用Node写成，Grunt的核心插件以grunt-contrib-开头，在NPM包管理平台上可以找到和查看。
    Grunt提供了3个模块分别用于运行时、初始化和命令行：
    grunt、grunt-init、grunt-cli。
    后面两个模块都可以作为命令行工具使用，安装时带-g即可。
    如同make命令一样，Grunt也会在项目目录中提供一个Gruntfile.js文件。
    类似于Makefile文件的任务配置，在目录下执行grunt命令会去读取该文件，然后解析、执行任务。
    
    编码规范的统一一般有几种实现方式，一种是文档式的约定，一种是代码提交时的强制检查。前者靠自觉，后者靠工具。
    在JSLint和JSHint工具的帮助下，现在已经能够很好地配置规则了。
    
    　

    部署流程
    
    实际的项目需求中，有两个点需要验证，一是功能的正确性，一是与数据相关的检查。
    
    普通测试环境：stage，预发布环境：pre-release，实际生产环境：product
    
    为了能让进程持续执行，我们可能会用到nohup和&以不挂断进程的方式执行：
    nohup node app.js &     //*nix

    停止进程和重启进程。手工管理的方式会显得烦琐，
    为此，我们需要一个脚本来实现应用的启动、停止和重启等操作。
    bash脚本的内容通过与Web应用以约定的方式来实现。
    这里所说的约定，其实就是要解决进程ID不容易查找的问题。
    如果没有约定，我们需要ps来查找对应的进程，然后调用kill命令杀死进程
    $ ps aux | grep nodejacksontian  //假设ID为3614
    kill 3614     //然后再将对应的Node进程杀掉
    
    这里所谓的约定是：
    （1）主进程在启动时将进程ID写入到一个pid文件中，
        这个文件可以存放在一个约定的路径下，如应用的run/app.pid。
    （2）脚本在停止或重启应用时通过kill给进程发送SIGTERM信号，
        而进程收到该信号时删除app.pid文件，同时退出进程*/  

    var fs = require('fs');
    var path = require('path');
    var pidfile = path.join(__dirname, 'run/app.pid');
    fs.writeFileSync(pidfile, process.pid);

    process.on('SIGTERM', function(){
        if(fs.existsSync(pidfile)){
            fs.unlinkSync(pidfile);
        }
        process.exit(0);
    });

    /* 性能
    
    提升性能的方法。对于Web应用而言，最直接有效的莫过于
    动静分离、多进程架构、分布式，
    其中涉及的几个拆分原则如下:

    做专一的事, 让擅长的工具做擅长的事情, 将模型简化, 将风险分离
    除此之外，缓存也能带来很大的性能提升。
    
    将图片、脚本、样式表和多媒体等静态文件都引导到专业的静态文件服务器上，
    让Node只处理动态请求即可。这个过程可以用Nginx或者专业的CDN来处理
    
    尽管同步I/O在CPU等待时浪费的时间较为严重，但是在缓存的帮助下，
    却能够消减同步I/O带来的时间浪费。但不管是同步I/O还是异步I/O，
    避免不必要的计算这条原则如果遵循得较好，性能提升是显著的。
    如今，Redis或Memcached几乎是Web应用的标准配置。如果你的产品需要应对巨大的流量，
    启用缓存并应用好它，是系统性能瓶颈的关键。
    
    另一个较为重要的分离是读写分离，这主要针对数据库而言。
    就任意数据库而言，读取的速度远远高于写入的速度。
    而某些数据库在写入时为了保证数据一致性，会进行锁表操作，这同时会影响到读取的速度。
    某些系统为了提升性能，通常会进行数据库的读写分离，将数据库进行主从设计，
    这样读数据操作不再受到写入的影响，降低了性能的影响。


    日志
    
    与其遇见bug修复它，不如建立健全的排查和跟踪机制 .(纠错本)
    而日志就是实现这种机制的关键。在健全的系统中，完善的日志记录最能够还原问题现场。
    通过记录日志来定位问题是一种成本较小的方式
    
    中间件框架Connect在其众多中间件中提供了一个日志中间件，
    通过它可以将关键数据按一定格式输出到日志文件中。 
    
    Node中提供的console对象就简单地实现了这几种划分，具体如下所示。 
    console.log：普通日志。console.info：普通信息。
    console.warn：警告信息。console.error：错误信息。
    console模块在具体实现时，
    log与info方法都将信息输出给标准输出process.stdout，
    warn与error方法则将信息输出到标准错误process.stderr，
    而info和error分别是log和warn的别名
    
    console对象上具有一个Console属性，它是console对象的构造函数。
    借助这个构造函数，我们可以实现自己的日志对象。
    
    */

    // 记录访问日志
        //node
        var app = connect();
        /*这里记录的数据有remote-addr和response-time等，这些数据已经足够用来帮助分析
        Web应用的用户分布情况、服务器端的响应时间、响应状态和客户端类型等。
        这些数据属于运营数据，能反过来帮助改进和提升网站。*/
        connect.logger.format(
            'home', 
        ' :remote-addr :response-time - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :res[content-length]'
        );
        app.use(connect.logger({
            format: 'home',
            stream: fs.createWriteStream(__dirname +  '/logs/access.log')
        }));

        //console
        Console.prototype.log = function(){//标准输出 info
            this._stdout.wrire(     util.format.apply(      this, arguments) + '\n');
        };
        Console.prototype.info = Console.prototype.log;

        Condole.prototype.warn = function(){//标准错误 error
            this._stderr.wrire(     util.format.apply(      this, arguments) + '\n');
        };
        Console.prototype.error = Console.prototype.warn;

        //日志对象
        var fs = require('fs');
        var info = fs.createWriteStream(        //创建写入流
            logdir + '/info.log', {
                flags: 'a',
                mode: '0666'
            }
        );
        var error = fs.createWriteStream(
            logdir + '/error.log', {
                flags: 'a',
                mode: 'o666'
            }
        );
        //用console的Console构造函数构造新的console对象logger  包含info error两个方法
        var logger = new console.Console(info, error);  

        //调用API  日志内容就能各自写入到对应的文件中
        logger.info('hello, world !');
        logger.error('segment fault');
