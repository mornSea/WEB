//高级技巧
    //高级函数
        //安全检测  由于有时有多个全局对象 这时typeof， instanceof操作符不准确 此时做安全检查（类型） 应：
        console.log(Object.prototype.toString.call(value));         //任何值上调用Object.toString() 会返回格式字符串  每个类内部有class属性 类名决定字符串中值
        var isNativeJSON = window.JSON && Object.prototype.toString.call(JSON) == "[object JSON]";  //JSON检查

        //作用域安全检查 用new Object时构造函数this指向新创建的对象实例 但如果忘了用new  。。。。
            //so 构造函数里加入检查
            function Person (name, age, job){
                if(this instanceof Person){
                    this.name = name; this.age = age; this.job = job;
                }else {
                    return new Person(name, age, job);
                }
            }
            //或者构造函数窃取结合使用原型链或者寄生组合
            function Reactangle(width, height){
                Person.call(this);
                this.width = width; this.height = height;
            }
            Reactangle.prototype = new Person();
        
        //惰性载入函数  经常用跨浏览器之类的检查  有大量if / switch  但其实不用每次都做重复检查  可以第一次后直接把函数变成合适的操作  有两种方式：
            //函数在调用时修改自身  （覆盖）
            function createXHR(){
                if (typeof XMLHttpRequest != "undefined"){
                    createXHR = function (){
                        return new createXHR();
                    };
                } else if (typeof ActiveXObject != "undefined"){
                    createXHR = function(){
                        //...
                        return new ActiveXObject(arguments.callee.activeXString);
                    };                
                }else{
                    createXHR = function(){
                        throw new Error("No XHR object available");
                    };
                }
                return createXHR();
            }
            //用函数表达式 赋值声明时指定   这样第一次也不用损失性能
            var createXHR = (function (){
                if(typeof XMLHttpRequest != "undefined"){
                    return function(){
                        return new XMLHttpRequest();
                    };
                }else if(typeof ActiveXObject != "undefined") {
                    return function (){
                        //...
                        return new ActiveXObject(arguments.callee.activeXString);
                    };
                }else {
                    return function(){
                        throw new Error("No XHR object available");
                    };
                }
            })();

        //函数绑定  在特定的this环境中指定参数调用另一个函数 常和回调 事件处理函数一起用   这样将函数作为变量传递时 还能保留执行环境   一般可用闭包 但多个闭包就是灾难 so
        function bind(fn, context){                                 //接收一个函数和一个环境
            return function(){
                return fn.apply(context, arguments);
            };
        }
        EventUtil.addHandler(div, "click", bind(someObject.Click, someObject));     //这样可以直接把对象/类里面的方法用作事件处理
        //html5 定义了个bind（） 为所有函数的方法  使用：        
        EventUtil.addHandler(div, "click", someObject.Click.bind(someObject));      //即在对象的方法上调用 参数：环境

        //函数柯里化  创建已设置好一到多个参数的函数  使用闭包返回一个函数  函数调用时，返回的函数还要设置一些传入的参数
            //常用柯里（curry）化函数
            function curry(fn){
                var args = Array.prototype.slice.call(arguments, 1);        //获取第一参数后参数
                return function(){
                    var innerArgs = Array.prototype.slice.call(arguments);  //同上 保存
                    var finalArge = args.concat(innerArgs);                 //组合上步数组
                    return fn.apply(null, finalArge);                       //调用apple 默认null环境  即当前？
                };
            }
            function add(num1, num2){return num1 + num2;} 
            var curriedAdd = curry(add, 5, 12);                             //也可少传入一个参数  调用时在传入curriedAdd
            console.log(curriedAdd());
            
            //由此可以得到更复杂的bind（）:   
            function bind(fn, context){                                     //由于要接收一个函数 一个对象  so 加个参数
                var args = Array.prototype.slicce.call(arguments, 2);       //并且 从第三个参数开始
                return function(){
                    var innerArgs = Array.prototype.slice.call(arguments);  
                    var finalArge = args.concat(innerArgs);                 
                    return fn.apply(context, finalArge);                    //同样由于要在object里用返回的函数  so 将context设置为环境  （apply第一个参数）
                };                                                          
            }
            EventUtil.addHandler(div, "click", bind(someObject.Click, someObject, "hello"));       //使用自定义柯里化bind （假设对象里的方法返回参数值）
            EventUtil.addHandler(div, "click", someObject.Click.bind(someObject, "hello"));      //html5的bind也支持柯里化  只要this后再传入一个参数（对象中方法参数）即可


    //防篡改对象  拿前面的Person对象举例
        Object.preventExtensions(Person);//防扩展  可用Object.isExtensible（）检查
        Object.seal(Person);             //密封（不可扩展 同时不可删  可修改）但[[Writeable]]可写
        Object.freeze(Person);           //冻结 (密封+Writeable为false) 但仍可定义[[set]]

    //高级定时器   js进程时间线（毫秒）： 0-250页面初始化  250-550空闲  550-800一些事件 。。。   
            //除了主js进程外  还有一个进程队列 等待下一次空闲时间执行 js里所有代码都需要等待    
            //定时器工作方式：特定时间后 将代码插入  如果队列中没其他东西要执行（如事件） 则这段代码执行
            let btn  = document.getElementById("my-btn");
            btn.onclick = function(){                               //事件处理器设置一个250毫秒后调用的定时器 
                setTimeout(function(){                              //定时器里点击元素后 1添加事件处理器（onclick）到队列  2事件处理器执行后（250毫秒后） 3定时器里面的代码才加入队列准备执行    4 最早也要300毫秒后定时器里的代码才执行  
                    document.getElementById("message").style.visibility = "visibility";
                }, 250);                                            //指定的时间不是执行多久 而是 多久后加入队列
                //...
            }                                                       //这样设置一个定时器可以保证定时器里代码执行前至少有一个进程间隔

            //重复的定时器： 为避免多个定时器发生同时跳过间隔连续运行的状况  使用链式定时器
            setTimeout(function(){
                //some conde
                setTimeout(arguments.callee, interval);             //arguments.callee用于获取对当前执行的函数的引用 并为其设置另外一个定时器  这样在前一个定时器完成前 不会插入新定时器代码
            }, interval);
        
        //Yielding Processes   用定时器解决过长/过深嵌套的函数调用 或大量的loop   带来的浏览器kill js  或询问用户    超过50毫秒就应分块
            //代码必须同步？ +  必须按顺序？     如果都是no  可以用定时器分割循环 （数组分块） 每次一小块的处理  
            function chunk(array, process, context){                        //参数： 数组，  处理数组的函数，  运行的环境
                setTimeout(function(){
                        var item = array.shift();                           //取出array（数组）里下一个块 并在context（环境）用process（函数）中处理
                        process.call(context, item);

                        if(array.length > 0){                               //如还有条目 设置下一个定时器  并通过argument。callee调用同一个匿名函数
                            setTimeout(arguments.callee, 100);
                        }
                    },  1024);                                              //实际应用中 由于多核 + 并行  所以并不是一秒运行一次
            }
            //使用：
            let data = [12, 35, 345, 356, 467, 875, 352, 45756, 2344, 2456, 8358, 134, 4, 5234, 45];
            function consoleValue(item){
                console.log(item);
            }
            chunk(data, consoleValue);                                      //不传作用域 即为函数调用时所在作用域 （全局）

        //函数节流 (节省计算资源) ：   有些计算比其他的昂贵的多 比如DOM操作比DOM交互要更多内存和CPU时间  尤其有n多层CSS样式时  这时改变上面元素的高度会导致大量运算  如果时改变浏览器大小时（resize）还会连续触发       上面只要超过50毫秒  这里只要是周期性的  都应该用节流
            //思想： 一些代码不能没有间断的连续重复运行 第一次调用函数 创建一个定时器以指定时间后运行代码 第二次调用函数时 清除前一次的定时器并另外设置一个（替换）   目的：只有在执行函数的请求停止了一段时间后才执行    如resize时每过100毫秒才从新计算反而更流畅
        function throttle(method, context){                                 //参数： 要执行的函数 作用域
            clearTimeout(method.tID);                                       //清除tID
            method.tID = setTimeout(function(){                             //添加tID  巧妙的通过设置定时器为执行函数的tID属性存储在执行函数对象中    保证了这个函数运行结束后tID还有   可便于下一次检查和删/建
                method.call(context);
            }, 100);
        }
        //例子 改变size：
        function resizeDiv(){
            var div = document.getElementById("my-div");
            div.style.heigt = div.offsetWidth + "px";                       //要求高同宽  so要计算一堆改了大小后的CSS  又是高度 回流：页面其他下面部分要来来回回计算CSS（在resize后）
        }
        window.onresize = function(){
            throttle(resizeDiv);                                            //虽然throttle只运行一次 但配合事件触发  每次resize时都运行
        }
    //自定义事件： 观察者（事件处理代码）订阅事件观察主体（DOM）  观察者知道主体 并能注册事件的回调函数（事件处理器）               由此实现触发  监听 分离
        //EventTarget有单独类型 handlers用于存储事件处理程序 含有三个方法： 
            //addHandler（事件类型  处理函数）注册事件：检查handlers是否有 如无则加入          
            //fire（含type的对象）触发：给event设置target 查找并调用对应对应事件类型的处理程序 给出target         
            //removeHandler（事件类型  处理函数）删除事件：在handlers找  如找到用break结束  再用splice（）将其从队列里删除
    function EventTarget(){
        this.handlers = {};
    }
    EventTarget.prototype = {
        constructor: EventTarget,
        addHandler: function(type, handler){
            if(typeof  history.handlers[type] == "undefined"){
                this.handlers[type] = [];
            }

            this.handlers[type].push(handler);
        },
        fire : function(event){
            if(!event.target){
                event.target = this;
            }
            if(this.handlers[event.type] instanceof Array){
                var handlers = this.handlers[event.type];
                for(var i=0, len=handlers.length; i<len; i++){
                    handlers[i](event);
                }
            }
        },
        removeHandler : function(type, handler){
            if(this,handlers[type] instanceof Array){
                var handlers = this.handlers[type];
                for(var i=0, len=handlers.length; i<len; i++){
                    if(handlers[i] === handler){
                        break;
                    }
                }
                handlers.splice(i, 1);
            }
        }
    };
    //使用
    function handleMessage(){
        console.dir(event.message);
    }
    var target = new EventTarget();
    target.addHandler("message", handleMessage);
    target.fire({type: "message", message: "Hello world"});
    target.removeHandler("message", handleMessage);
    target.fire({type: "message", message: "Hello world"});         //再次  因为没有处理程序
    //自定义拖放  并应用到自定义事件： 创建绝对定位元素 用鼠标移动  设置onmousemove事件 将元素的left和top改变为event。clientX/Y px   释放时删除这个处理器       再计算元素左上角和鼠标差值    添加自定义事件（拖动的开始 / 进行 / 结束）  并设置公共接口dragdrop。enable/disable    分别是添加/删除这三种自定义事件



//离线应用 & 客户端存储     不要留隐私数据在这
    //离线：
    if ( navigator.onLine) {                                    //离线检测   除了这个H5还有on/offline事件  联网 断网时触发
        //使用离线数据
     } else{
        //连接服务器 更新数据
    }
    //应用缓存  使用appcache是从浏览器缓存分出来的一块  要使用 得要用个描述文件：列出要保存的文件List  一般保存为offline.manifest  内容：
   /*  CACHE MANIFEST 
    #Comment

    file.js
    file.css
    //...
    //然后 在html里使用：(注意 MIME类型必须是text/cache-manifest)
    <html manifest="/offline.manifest">
    */
    //应用缓存有对应的API：    applicationCache对象 
        //有个status属性 key值：0无缓存 1闲置 2更新 3下载 4更新完 5废弃  
        //还拥有事件： chcking查找更新  error   noupdata无变化      downloading      progress下载时不断触发      updateready下载好并可通过swapCache（）触发         cache应用缓存完整
    applicationCache.update();                                      //手工干预
    EventUtil.addHandler(applicationCache, "updateready", function(){
        applicationCache.swapCache();
    })

    //IE5用户缓存：
    /*     <div style="behavior:url(#default#userData)" id="dataSrore"></div> */ //通过CSS在一个元素上指定userData行为   每个域名数据上限1m
    
    var dataStore = document.getElementById("dataStore");
    dataStore.setAttribute("name", "nichlas");
    dataStore.setAttribute("book", "js");                           //setAttribte保存键值对  
    dataStore.save("bookinfo");                                     //保存  参数为数据空间名   保存操作结果前还可以 removeAttribute（）删除   load（）获取信息

    //WEB存储
        //Storage类型（存储字符串  大小在2.5m） 提供的通用属性/方法： clear（）清除所有  getItem(name)  key(index)  removeItem(name)  setItem（name，value）有则修改无则新建    length显示有多少键值对 IE8的remainingSpace显示还可以使用的字节数
        //sessionSrorage对象   是Storage的子类  只支持到浏览器关闭  如果浏览器打开自动恢复也有
        sessionStorage.setItem("name", "username"); 
        sessionStorage.book = "js";                                 //可用方法或者属性 保存/读取键值对 
        
        //globalStorage 长期保存 跨会话存储  要指定哪些域名可以访问 
        globalStorage["bing.com"].name = "somename";                //如果先不能确定域名 可以用localtion.host
        var name = globalStorage["bing.com"].name;                  //同上 不过要在不同storage名后用方括号中指定域名
        
        //localStorage  h5之后支持 取代上一种 不过不用设置域名 默认必须由同一个域名+协议+端口 才可访问localStorage对象       使用方法同sesstionStorage     （等同[localtion.host]  所以可以设置函数 对不支持h5的浏览器这种localtion）    

    //IndexedDB数据库  但不同浏览器的前缀不一样    IE：ms-    Firefox：moz-   Chrome：webkit-  下面只用默认 + webkit
    let indexedDB = window.indexedDB || webkitIndexedDB;
    let request, database;
    request = indexedDB.open("admin");                              //打开（数据库名 ）    无则创
    request.onerror = function(event){
        console.log(event.target.errorCode);                        //添加onerror事件处理器    每次操作数据库时都应设置onerror  onsucces检查
    };
    request.onsuccess = function(event){                            //..  onsussess......    将返回的数据库实例保存

        database = event.target.result;
        console.dir(database);                           
    };
        //错误码： 1意外无法归类 2操作不合法 3未发现要操作的数据库 4违反数据库约束 5数据不瞒足事务 6操作不合法 7试图重用已完成  8请求中断  9只读下写  10超时
    if(database.Version != "1.0"){                                  //检查并设置版本号
        requst = database.setVsersion("1.0");  
        request.onsuccess = function(event){
            console.log(database.name, database.Version);
        };
    }

    let user = {username: "007", firstName: "james", laseName: "Bond", password: "foo"};           //username必须全局唯一  大部分用这个键访问数据
    let store = database.createObjectStore("users", {KeyPath: "username"});        //创建对象存储空间（js对象， {js对象中属性}） 第一个参数是已有对象（像表）   传入的第二个参数 属性作为存储空间的键来用            对象存储空间像“表”  其中的对象像“表中记录”

    //用add（）插入新值      put（）修改现有的值  值： 键值对
    //初始化对象存储空间：（假设users里保存一批用户对象  每个都像上面的user）：
    var i = 0,  len = users.length;
    while(i < len){
        store.add(users[i++]);
    }
    
    //添加onerror/success的初始化：
    let i=0, request, requests=[], len=users.length;                
    while(i < len){                                                 //while 好于  for  每次只要检查一次
        request = store.add(users[i++]);
        resqust.onerror = function(event){
            //...
        };
        request.onsuccess = function(event){
            //...
        };
        requests.push(request);                                     
    }

    //事务之前；let a, db, store, i = 0,  len = users.length;   a = indexedDB.open("admin");   a.onsuccess = function(event){db = event.target.result};    db.setVsersion("1.0");      store = db.createObjectStore("table", {KeyPath: "keyname"});   //  while(i < len){ store.add(users[i++]); }
    //事务： 
        //通过db。transaction（）创建  用于读取/修改数据  空参数时是读取调用它的库中的对象  一般传入一或多个对象存储空间 只加载这些   多个时 传入字符串数组
        let transaction = db.transaction();                             //读库
        let transaction = db.transaction("user");                       //读user对象存储空间
        let transaction = db.transaction(["user", "anotherStore"]);     //读 。。。。。。。。和另一个
        
        //上面都是只读  要修改就要在transaction创建时加入第二个参数：IDBTransaction对象的一个属性(如webkit要加前缀webkit-) ：READ_WRITE读写  VERSION_CHANGE修改  READ_ONLY只读
        let IDBTransaction = window.IDBTransaction || window.wegkitIDBTransaction;
        let transaction = db.transaction("user", IDBTransaction.READ_WRITE);
        
        //得到事务的索引后  使用它的ObjectStore（“储存空间”）方法   可以访问储存空间  
        //使用得到的事务实例/事件： add(),  key(), get(key),  delete(key),  clear()删除所有   都会返回一个新的请求对象     一个事务可以完成任意多的请求      还有onerror / oncomplate事件 代表整个事务取消/完成
        let requset = db.transaction("users").objectStore("users").get("007");          //链式调用  取得db数据库实例的 users的储存空间事务后  读取users储存空间 获取其中键为007的元素      （键在createObjectStore（）时设置）  
        auton(requset);
        
        function auton(request){
            request.onerror = function(event){
                console.log("事务取消");
                console.log(event.target.errorCode)
            };                                                                              //每次事务都定义事件 可以设置为一个函数autoON 自动添加  这样autoON（request）;
            request.oncomplate = function(){
                console.log("down!");
            };
            request.onsuccess = function(){
                console.log("down!");
            };
            
        };

        //游标 即通过已知的键检索多个对象   是指向结果集的指针  对象存储空间上调用openCursor（）创建  返回一个请求对象  （实例）  
        //通过onsuccess的event。target。result   得到存储空间的下一个对象  如果结果集 数量 > 1  属性里保存IDBCursor实例 拥有属性： direction表示移动方向 0为指向下一个 1为下一个不重复 2前一项   key：对象的key     value 实际的对象 primaryKey键： 对象键/索引键
        let store = db.transaction("users").objectStore("users");
        let request = store.openCursor();                               //传入第二参数（第一是null） 控制游标移动方向 默认next 还可以是  IDBCursor.PREV 
        resqust.onsuccess = function(event){
            var cursor = event.target.result;
            if(cursor){                                                 //不好用 设计的太复杂（使用 内容）  功能却少  略
                console.log("key : " + cursor.key + ", value: " + JSON.stringify(cursor.value));
            }
        };

        //键范围  类似 python[:]的复杂版  用（会带前缀的）IDBKeyRange实例表示（要访问的）键的范围   
            //四种定义键范围的方式 only（key）只取键，  上/下界：lower/upperBound（key）表示从key开始直到最后 / 从头开始直到key，如果传入第二个参数true表示跳过key那个       bound(key, key)上界下界：设置范围的开始与结束     第三/四参数为跳过上界/下界那个？
        var range = IDBKeyRange.bound("007", "ace", true, true);        // 定义一个 从007到ace的范围  但是不包括这两个 
        resqust = store.openCursor(range);                              //范围传给openCrsor（）  返回范围游标
        resqust.onsuccess = function(event){
            let cursor = event.target.result;
            if(result){
                console.log(cursor.key, JSON.stringify(cursor.value));
                cursor.continue();                                      //移动到下一项
            }else{
                console.log("done");   
            }
        };

        //索引   用对象存储空间的creatIndex（）方法     参数：索引名， 索引属性名， 索引是否唯一？
        let store = db.transaction("users").objectStore("users");
        let index = store.createIndex("username", "username", {unique: false});
        let index = store.index("username");                            //与上面相同  获得一个已有的 名为username的索引
        let request = index.openCursor();                               //索引上使用opencursor 创建新的游标 除了event。result。key是索引而非主键
        let request = index.openKeyCursor();                            //同上 只是游标返回每条记录主键 且 event.result.value保存主键 而非整个对象
        let request = index.get("007");                                 //索引中取得一个对象  返回一个请求
        let request = index.getKey("007");                              //.............主键         event。result。value是用户ID
        anton(requst);

            //IDBIndex对象的属性（索引的）： name， unique，   KeyPath：传入createIndex（）的属性路径    objectStore索引的对象存储空间
            //组合来用 知道存储的对象建立哪些索引：
            let store = db.transaction("users").objectStore("users");
            let indexName = store.indexName, index, i = 0, len = indexNames.length;
            while(i < len){
                index = store.index(indexNames[i++]);
                console.log("indexName" + index.name + ", Keypath: " + index.KeyPath + ", unnique：" index.unique);
            }

            //deleteIndex(索引名) 在对象存储空间上调用  不会影响对象存储空间的数据  so 不用回调
            let store = db.transaction("users").objectStore("users");
            store.deleteIndex("username");

    //并发问题  怕浏览器其他数据库同时在操作 刚打开数据库时   用事件检查 如果有同一来源的另一标签页调用setVersion()时 会触发   关闭数据库
    database.onversionchange = function(){
        database.close();
    }


//最佳实践
    /*
    可维护代码： 可理解， 直观， 可适应（数据上的变化不要求完全重写）， 可扩展（核心功能）， 可调试
        1 可读性： 每个函数/ 大段代码有个描述任务的注释，  复杂算法有解释，  hack/不同方法原因注释
        2 命名： 变量为名词，   函数/方法以动词开始 如果返回布尔值应以is-开头，   应都合乎逻辑
        3 变量类型透明： （1）通过初始化指定 如 var found=false， count=-1， name=“”， obj=null；  （2）匈牙利民命：如webgl里变量  变量前加一个表示类型的小写字母，名第一个字母大写   （3）类型注释 即在初始化赋值 等号前用注释写类型

    松散耦合：
        1 解耦html & js： html是数据 js是行为  so 用html属性分配事件处理程序 内联代码都是过于精密的耦合       也要避免在js里创建大量HTML   用js插入数据时不要直接insert  要先在页面里包含并隐藏标记+页面渲染好后用js显示/Ajax     
        2 解耦合 CSS & js：  尽量不要在js里直接更改样式值 这样在浏览器里看不到这个样式  不好调试  应只是修改CSS类   IE里也不要在CSS里用expression（）表达式嵌入js
        3 解耦合 应用逻辑 & 事件处理器：  为方便调试与复用  不要在事件处理器里使用太多应用逻辑  应把逻辑抽离为函数/模块  事件处理器从事件中抽离出信息 信息传入方法中

    编程实践： 
        1 尊重对象所有权： 如果不负责创建 维护某个对象 就不要修改它
        2 避免全局变量： 尽量用let  和  函数内声明
        3 避免与null比较：  应该检查精确类型
        4 使用常量： 用const 或者 创Constants对象里全大写属性 作为常量    为方便调试和复用 可把Constants对象放单独的js / json文件里      应抽取的值： 重复值 用户界面字符串（便于国际化） url（应用一个公共地方存放所有url）  任何可能会改的值

    性能：
        1 作用域：
            （1）避免全局查找：  （尤其loop中）应将对象或其属性存在本地的变量 避免每次遍历全局查找dom / 对象的属性
            （2）便面使用with：  会增加作用域链长度  使用局部变量达到同样效果  如 with（document。bodu） 等同 let body = document。body
            
        2 选择正确方法：
            （1）避免不必要属性查找：  使用变量和数组比访问对象更有效率  多次使用的属性存于局部变量
            （2）优化循环： 减值迭代（i--）  简化终止条件（如obj。length保存）  简化循环体（有无可移出去的密集计算）  使用后测试循环（用do{循环体}-while（条件）可以避免第一次计算）    
            （3）展开循环（如次数确定 不使用循环而使用多次函数效率更高，  如数组长相同 对每个元素调用process（）比循环更优）
            （4）避免双重解释： 不要使用eval（）/Function（）/setTimeout（）时传入一条字符串语句   即不要让js解释一遍
            （5）other：原生方法更快       switch比if-else if-else更快      用位运算代替布尔/算数运算

        3 最小化语句数  语句越多 速度越慢
            （1）多个变量同时声明  用逗号分割，  
            （2）插入迭代值  应使用let name = value[i++]  代替 let name = value【i】； i++
            （3）使用数组/对象时应用一句语句直接赋值和初始化（对象用字面量） 而非创建个空的  一个个加  如 var value = 【1， 2， 3】；      var obj = {1：a， 4：34， df：ec}；
        
        4 优化DOM交互
            （1）DOM应创建好后一次性添加  当给appendChild（）传入文档片段时  只有它的子节点添加到项目 片段本身不添加
            （2）innerHTML也是 一次性调用
            （3）在尽可能高的的层次使用 事件代理
            （4）注意HTMLCollection  访问时性能受到巨大影响  只有使用了getElementByTagName（）/获取了元素的ChildNodes/attribute属性/ 访问forms images时才要返回
    
    部署：
        1构建过程：  
            （1）避免使用一个文件存储所有js  每个对象/自定义类型分别放值单独文件里  并尽量使用少量的js文件 因为通过《script》引入js文件是阻塞操作 一旦下载后开始运行会停止其他所有下载
            （2）使用自动化构建工具 可以获取目录里所有文件 合并为一个文件 使用xml/json  设置几个目录：  输出（。/js） 源文件（。/dev/src）  合并的目标（里面包含了生成的文件的路径/文件名， 以及使用的js所在路径/文件名） 
            （3）验证 使用JSLint 或其他工具
            （4）压缩  使用YUI  去空格 注释 简化名称



    
    */
    


//新API
    /* 
    1 requestAnimationFrame（）  创建动画循环：
        （function(){
            function draw(timestamp){
                var drawStart = (timestamp || Date.now()),              //计算两次重绘的时间间隔
                    diff = drawStart - startTime;                       //diff 确定下一次的绘制时间
                
                start = drawStart;                                      //再把startTime重写为这一次的绘制时间
                requestAnimationFrame(draw);                            //重绘
            }
            var requestAnimationFrame = window.requestAnimationFrame ||
                                        window.mozrequestAnimationFrame ||
                                        window.webkitrequestAnimationFrame ||
                                        window.msrequestAnimationFrame ||,
                startTiem = window.mozAnimationStartTime || Date.now();
            
            requstAnimationFrame(draw);
        }）();
    
    
    2 page cisibility API  用以确定页面是否被隐藏/覆盖  如果是 一些功能可以停下来
        document.hidden 布尔值 表示页面是否隐藏
        document.cisibilityStart    有四个值 分别表示 最小化 在前台标签页  已隐藏但用户可见预览 页面在屏幕外渲染
        visibilitychange事件  文档的可见否发生变化时  触发
        例子：
            function handleVisibilityChange(){
                var output = document.getElemantById("output"),
                    msg;
                
                if (document.hidden || document.msHidden || doctment.webkitHidden){
                    msg = "page is now hiddne" + (new Date()) + "<br>;
                }else{
                    mast = "page is noe visble" + (new Date（）) + "<br>" 
                }

                output.innerHTML += msg;
            }
            //为两个事件都加上事件处理器
            EventUtil.addHandler(document, "msvisibilitychange", handleVisibilityChange);            
            EventUtil.addHandler(document, "webkitvisibilitychange", handleVisibilityChange);
    
    3 Geolocation 地理定位
            通过navigator对象  它有三个方法： 
                （1）getCurrenPosition（成功回调函数， 失败回调函数， 选项对象） 后2参数可选      触发请求用户同意使用地理位置的对话框  成功回调函数会有两个属性：
                        coords对象： 包含于位置有关的信息： latitude（十进制纬度）   longitude（十进制经度）  这两时最常用的  accuracy（经纬度的精度 以米计算）       有些浏览器还有altitude（海拔高 米单位）     altitudeAccuracy（海拔精度）    heading（指南针的方向 0表示正北）   speed（速度  米单位）
                （2）watchPosition监控    是getCurrenPosition的定时版  并返回一个数值标识符
                （3）clearWatch（上面返回的数值标识符）  可以取消监控操作 
                    例子：  
                        //navigator.gelocation.getCurrentPosition(fucntion(position){                        
                        var watchid = navigator.gelocation.watchPosition(fucntion(position){
                            drawMapCenteredAt(position.coords.latirude, positions.coords.longitude);
                        },function(error){
                            //...
                        });
                        clearWatch(watchid);

    4 File API：  
        （1） h5在dom里为文件输入元素添加files集合 其中包含一组file对象  每个file对象含有属性：name， type，  size， lastModifiedDate（上次修改时间） 
        （2）FileReader类型： 读取文件的xhr对象  有progress（每50毫秒触发 类似获取xhr一样的信息）， error， load      
            并提供几个方法： 
                readAsText(file, encoding)以纯文本读取
                readAsDataURL（fiel）读取文件 以数据url形式存在result属性
                readAsBinaryString（file）读取文件 以字符串存在result
                readAsArrayBuffer（file） 读取文件并将一个保存内容的bufferArray保存于result
        （3）File对象还支持slice（开始字节数， 要读取的字节数）方法 各个浏览器前缀不同， 用于读取文件的一部分内容             Blob类型有size type属性  也支持slice（）但要三个参数  第一个为文件
        （4）对象URL  引用保存在fiel/blob里的数据的url  
            例子：
                let url = window.URL.createObjectURL(files[0]);
                output.innerHTML = "<img src=\""+url+"\" >";
        （5）读取拖拽的文件  let files = event.dataTransfer.files;
        （6）CHR 上传文件 (定义一个函数 里面有这些语句 并在拖拽事件上绑定)   let data = new FormData();      data.append("file" + i, files[i]);      xhr.send(data);

    5 WEB计时   用window.performance对象 对页面所有度量信息包含     performance.navigation属性：导航相关    performance.timing属性：时间戳
    
    6 WEB Worker 让js 在后台运行   worker通过message和error事件与页面沟通来自worker的数据在event.data   建议使用时要用onerror
        排序例子：
            let data = [23, 4, 233, 9, 0, 3, 34, 2, 54, 45, 23, 42, 23, 34, 45],
                worker = new Woeker("quicksort.js");                //实例化worker: 下载并运行  
            
                                                 //停止worker
            worker.onmessage = function(event){
                var data = event.data;
                //对排序后数据操作...
            }；
            workter.postMessage(data);                              //异步给worker 排序（可以传送任何json值/普通值）

            worker.onerror = function(evetn){
                console.log(event.filename, event.message);
            }；

            //worker里 （是精简化的js）  
            self.onmeddage = function(event){
                var data = data;                                   //this  self引用worker自身   但与页面中创建的不是一个
                //处理数据...                                       //如排序 加密解密 图像处理（一个个像素的那种）  worker适合处理这种消耗事件的事情   不会阻塞用户界面 
                data.sort(function(a, b){
                    return a-b;
                });
                self.postMessage(data);
            };
            importScript("file1.js", "file2.js");                   //可以向worker添加其他脚本  从参数后往前下载  按前向后执行 （全下载后执行）
            woeker.terminate();                                     //关闭worker

    
未来发展（ex6, other）
            形参中赋默认值， const固定值， let块级作用域， ...扩展参数， yield生成器（运行到yield返回一系列值中一个）  配合使用next()（继续/下一个）， 解构赋值（let [name:somename, age:17] = person）, 
            数组领悟（python数组解析）： array = [value for each (variable in values) condition];  for each循环里每个值， 保存在variable里  如果符合condition条件 则放到结果数组里  
            代理对象/函数 （proxy。create/-Funcion（）用于表示接口），  映射与集合（只有一个键值对），  weakmap（告知对象是否以及解除引用）， structType（更多类型化数值类型 如int8）， ArrayTypt（经这个类型建造的数值 限制数组值类型）
            类 Class（语法糖 覆盖在构造函数和基于原型的方法/类型上 例子：Class Person{constructor（数据属性）  方法} ）  私有成员（Class里构造函数中用private声明/方法里用private（this).key=value）
            getter / setter(class里构造函数中用来读取/设置私有成员的公开API)     extends（继承  class employee extends Person{construct（）{//...}, //...} )        module MyModel{}（模块 类似类 但可包含类 默认私有 要公开成员 要在成员前加 export 属性/方法，    导出：import （成员名1， 2）from MyModule / 或者直接使用：myMoundle.成员函数（参数）； ）   
              

    */





