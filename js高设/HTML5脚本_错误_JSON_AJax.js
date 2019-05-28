//HTML5 
    //1跨文档消息传递 即不同域的页面/iframe间传递信息（XDM）
    var iframeWindow = document.getElementById("myframe").contentWincow;
    iframeWindow.postMessage("A sevret", "https://terest.top");                     // postMessage是XDM核心函数 参数（消息， “接受方的域”）  即myframe要求接受方那个文档（myframe）必须来自terest      接到xdm消息后 会触发window的message事件， 以异步形式 触发message事件  传递给onmessage事件处理程序  参数（postMessage的消息， 发送文档的域， 发送文档的window的代理）
    processMessage(event.data);                                                     //处理接收到的信息
    event.source.postMessage("received! ", "http://bing.cn");                       //回信  （可选）

    //拖放   拖动时发生： dragstart 》darg 》dargend    放置时： dargenter 》dragover 》dragleave/drop
        //标签里 拖动目标用draggable=“true”  ondragstart=“drag（event）” 设置可拖动 被拖动目标也是设置ondrop / dropover = “drop/allowdrop（event）”  js里再设置事件处理器函数
{/* <img src="smile.gif" draggable="false" alt="smiley face" />   <div draggable="true"></div>   */}        

    //设置放置目标        
var droptraget = document.getElementById("droptarget");
EvetnUtil.addHandler(droptaarget, "dragover", function(event){
    EvetnUtil.prevetntDefault(event);
});
EvetnUtil.addHandler(droptaarget, "dragenter", function(event){
    EvetnUtil.prevetntDefault(event);
});

        //dataTransfer  拖放时的数据交换对象：
        //setData(数据类型， 值) 保存值   getData(数据类型) 取得setdata存的值   一般为text/URL  url同下  只是类型不同
event.dataTransfer.setData("text", "some text");
var text = event.dataTransfer.getData("text");
    
    //在HTML5 视频播放器里添加动态播放时间
setInterval(function(){
    curtime.innerHTML = player.currentTime;
}, 250);

    //历史状态管理  history对象   pushState()  popstate()  replaceState()
history.pushState({name: "Nicholas"}, "Nicholas' page", "nicholas.html");           //不改变页面时改变url  参数为状态对象， 新状态标题， （可选）相对url；    运行这个函数 新的状态信息加入历史状态栈

EvetnUtil.addHandler(window, "popstate", function(event){
    var state = evetn.state;
    if(state){
        proessState(state);                                                         //点击前进/后退时触发的事件  此事件有个state属性 包含着当初传给pushState第一个参数（状态对象）  得到此对象后 要把页面重置为状态对象中 数据表示的状态 如果是浏览器空白页  则state=null  
    }
});

history.replaceState({name: "Greg"}, "Greg's page");                                //更新当前状态   参数同pushState




//错误处理与调试
    //try-catch
function testTryCatchFinally(){                                     //try-catch最好只用于处理不了的错误 如大项目中
    try{                                                            //执行可能会报错的语句
        return 2;
    } catch(error){                                                 //如果报错 执行
        return 1;
    } finally{                                                      // （可选）不管是否报错 都执行
        return 0;
    }
}

function errorKing(){                                               //错误类型：
    try {
        somefunction();
    } catch(error){                                                 //注意 一定要有个参数（条件）  可直接是error基类
        if(error instanceof RangeError){
            console.log("数值超出范围");
        } else if (error instanceof ReferenceError){
            console.log("找不到对象 or 访问不存在变量");
        } else if (error instanceof TypeError){                     //最常见  经常由传给函数的参数没检查 导致形参 实参类型不一致
            console.log("变量中保存意外类型 or 访问不存在方法");
        } else if (error instanceof URIError){
            console.log("使用encodeURI（） / decodeURI（） 时URI格式不正确");
        } else if (error instanceof EvalError){
            console.log("使用eval（）错误");
        } else if (error instanceof SyntaxError){
            console.log("使用eval（）时传入语法错误的js字符串");
        } else {
            console.log("error 各错误基类型");
        }
    }
}
errorKing();


throw new EvalError("something bad happened");                      //可以throw随便一个值 让它抛错  此时代码会停止运行 直到有try-catch捕获抛的值 才继续   任何类型的Error类都是可抛的   但是IE只有在Error对象才显示自定义信息


function process(value){                                            //由于所有浏览器报错不但不同 而且只是告诉出错部分 而非具体类型  所以 可以自定义错误提示可以帮助调试 + 适合IE
    if(!(values instanceof Array)){
        throw new Error("process(): Argument must be an arrray !");
    }
    values.sort();
    for (var i=0, len=values.length; i < len; i++){
        if(values[i] > 100){
            return values[i];
        }
    }
    return -1;
}

window.onerror = function(message, url, line){                      //阻止浏览器默认报错
    alert(message);
    return false;                                                   //主要在return false
}


    //常见错误

        //1 类型转换错误  建议使用(全等) === 和 ！== 避免类型转换      流控制语句里只用布尔值比较
console.log(5 === "5"); /*false*/   console.log(1 !== true);  /* ture */

if (str1){/* ... */};                                              //流控制语句在判断时会把条件中的值转为布尔值   尤其if语句  so应该换成值为布尔的比较语句
if (typeof str3 == "string"){/* ... */}

        //2 数据类型错误  常见于没有传值时没有检查  且检查不应只是检查null/undefined    基本类型用typeof  对象用instanceof
function getQuerystring(url){ if ( typeof url == "string") { /* 。。。 */}}             //检查参数
function reverseSort(values){ if(values instanceof Array){ /* ... */}}                  //面向公众的API每项参数必须检查类型

        //3 通信错误  常由于查询的字符串没有用encodeURIComponent()转码  
function addQueryStringArg(url, name, value){                       //定义处理查询字符串的函数(转换)  参数为 url 参数名  参数值
    if ( typeof url == "string") {
        if(url.indexOf("?") == -1){
            url += "?";                                                 //如果没有问号 加一个
        } else {
            url += "&";                                                 //如果没有连号 加一个
        }
        url += encodeURIComponent(name) + "="  + encodeURIComponent(value);
        return url;
    }
}
let url = "http://pet9.000webhostapp.com/q"
let newUrl = addQueryStringArg(url, "", "Csdn&zhihu$Douban&Guoke&博客园");
console.log(newUrl);

        //致命错误  （程序无法运行 影响用户主要操作 导致连带错误）  比如一系列初始化的loop中有一个出错 程序暂停  用try-catch把致命错误变成非致命的
let mods = [1, 3, 5];
for (var i=0, len=mods.length; i<len; i++){
    try{
        mods[i].init();
    } catch(ex){
        console.log("nonfatal","loop " + i +  "  Module init failed:"  
                    + ex.message);                                      //只要是用try-catch  就应该把错误记录在日志中  参数：错误严重程度， 错误提示+具体信息
    }
}
function logError(sev, msg){
    var img = new Image();                                              //由于所有浏览器都支持Image对象 
    img.src = "log.php?sev=" + encodeURIComponent(sev) +
             "&msg=" + encodeURIComponent(msg);                         //用src + url传参避免跨域限制 避免库函数引发Ajax不可用
}


        //(跨浏览器)向控制台写入消息
function log(message){
    if(typeof console == "object"){
        console.log(message);
    } else if (typeof opera  == "object"){
        opera.postError(message);
    } else if(typeof java == "object" && typeof java.lang == "object"){
        java.lang.System.out.println(message);
    }
}

function sum(num1, num2){
    log("Entering sum(), arguments are " + num1 + ", " + num2);
    log("Before calculation");
    let result = num1 + num2;
    log("after calclation");
    log("exiting sum()");
    log (result);
}
sum(1, 3);

    //IE 错误   常见操作节点时 js修改其祖先节点 / 还没加载完时修改     （在页面的script元素里）
document.body.insertBefore(document.createElement("div"),
                            document.body.firstChild);              //为body添加一个绝对定位在页面上的覆盖层
document.body.appendChild(document.createElement("div"));           //或者 把script从包含元素中移除 直接作为body的子元素



//JSON
    //有简单值 数组 对象 以及后两种嵌套  
/* [{"title": "professional javascript", "anthores" : ["Notification", "zakas"]}, {"anme":"nico", }, ] */
    //JSON对象有两个方法 ： stringify(js对象) 把对象序列化为字符串(即所有key变字符串)    parse（json） 把json字符串解析为原生js对象

let test = {a: [1, 3, 5, 3], "23":34, 34: 23, string: {str:"some'string'how to stringify?"}};
/* 
let jsonText = JSON.stringify(test);
console.log(jsonText);
let jsonTextParse = JSON.parse(jsonText);
console.dir(jsonTextParse);
  */

        //JSON.stringify()有两个额外可选第二参数 过滤器（数组 / 函数）， 数组内的字符串'键'对应的键值对才返回   回调函数（键， 值）函数中return的值返回
        //JSON.stringify()有个额外可选第三参数 是否缩进压缩(默认压缩成一行) 如是数值代表每个缩进级别的空格数 也可是一段字符串用以代替缩进  使用时 若不想同时使用第二参数  可在第二参数位置传入null
 let jsonText1 = JSON.stringify(test, ["a", "23"]);
 console.log(jsonText1);
 let jsonText2 = JSON.stringify(test, function (key, value){
            switch(key){
            case "a":
                return  value.append(0);
            case "23":
                return 5000;
            case "string":
                return value;
            }
    });
 console.log(jsonText2);
let jsonText3 = JSON.stringify(test, null, 4);
console.log(jsonText3);
let jsonText4 = JSON.stringify(test, null, "--");
console.log(jsonText4);

    //另还有以键值对的方式给json中的对象添加toJson（）方法，只返回toJson（）里return的值， 作为函数过滤器的补充 这样使用JSON.stringify()时， 但此键值对方法应该在顶级对象(第一个括号里）中 
    //序列化对象的顺序： 检查toJson并获取其返回的值1 如果有第二参数把toJson返回的值传入得返回值2   对返回值2的每个值进行相同的序列化  如有第三个参数再对序列化后的值进行格式化
let text1 = {a: [1, 3, 5, 3], "23":34, 34: 23,    releasDate: new Date(2022, 2, 22), string: {str:"some'string'how to stringify?"}, toJSON: function(){return this.string;}};
let jsonText5 = JSON.stringify(text1);
console.log(jsonText5);

    //JSON.parse() 也有个回调的第二参数：还原函数reviver  类似stringify的过滤函数  也收取（键， 值）参数， 返回一个值，   在日期字符串转换为Data对象时经常用到
let text2 = {a: [1, 3, 5, 3], "23":34, 34: 23,    releaseDate: new Date(2022, 2, 22), string: {str:"some'string'how to stringify?"}};
let jsonText6 = JSON.stringify(text2);
let jsonTextParse = JSON.parse(jsonText6, function(key, value){
    if (key == "release"){
        return new Date(value);
    } else {
        return value;
    }
});
console.dir(jsonTextParse);
  


//Ajax   远程脚本 用于客户端浏览器与服务器（两台机器）间通信    用XMLHttpRequest对象 也叫XHR
    //IE7+ 现代浏览器创建XHR
let xhr = new XMLHttpRequest();
    //xhr 用法： 首先使用open（请求类型如GET/POST， URL, 异步否？布尔值）   其中url如不是绝对路径则是相对当前网页路径
xhr.open("get", "savaUrlData.php", false);                              //可以在open里 再加入name， password  但为了安全 这个不要用Get  也不要在open中输入
    //          再用send(数据) 发送请求
xhr.send(null);
    //上面的请求是同步的  js会等到服务器响应才继续执行  收到响应后 响应的数据会自动填充XHR对象的属性：
        //responseText 主体返回的文本/文件  responseXML XML文档   status HTTP状态  statusText HTTP状态说明
if(xhr.readyState == 4){
    if((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
        console.log(xhr.responseText)
    }  else {
        console.log("http error :" + xhr.status);
    }
}
        //xhr对象的readyState属性表示请求/响应的阶段 从0（未初始化）到4（完成）  每次改变状态都触发readystatechange事件  so可以用事件处理检查状态 再进行状态码
xhr.onreadystatechange = function(){                                    //onreadystatechange必须定义再open（）之前
    if(xhr.readyState == 4){
            if((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
            console.log(xhr.responseText)
        }  else {
            console.log("http error :" + xhr.status);
        }
    }
};
xhr.open("get", "savaUrlData.php", false);
xhr.send(null);


    //在open和send之间可以进行一些操作 如设置http头和请求， 表单序列化类型， 超时， MIME， 进度， progress  以及跨域
xhr.open("get", "savaUrlData.php", false);                 
        //用setRequestHead（头部字段键， 值）设置hppt头部信息
    xhr.setRequestHeader("MyHader", "MyValue");
        //GET 向url添加查询字符串参数的函数  
    function addUrlParam(url, name, value){
        url += (url.indexOf("?") == -1 ? "?" : "&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        return url;
    }
        //POST 用xhr模仿表单提交(通过修改http头 和serialize()序列化表单)  注意open里要是post请求
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var form = document.getElementById("user-info");
    xhr.send(serialize(form));
            //对应的php  取得提交数据   /* <?php     Header("Content-Type: text/plain");    echo <<< EOF    Name : {$_POST['user-name']}    Email : {$_POST['user-email']}    EOF;    ?> */

            //XMLHttpRequest 2  
        //FormData对象  用于自动序列化 和添加数据
    let data = new FormData();      data.append("name", "nicholas");    //添加数据
    let form = document.getElementById("user-info");
    xhr.send(new FormData(form));                                       //序列化表单
    
        //timeout 超时属性 等待响应多少毫秒后停止  触发事件处理函数
    xhr.timeout = 1024;
    xhr.ontimeout = function(){
    };

        //overrideMimeType(类型) 修改MIME类型：
    xhr.overrideMimeType("text/xml");

        //进度事件  包括： load完整数据 loadstart/end通信开始与结束  error  abort调用abort（）时  progress接收响应期间不断触发
        xhr.onload = function(){/* 。。。 */ };                             //用xhr的onload代替onreadystatechange
        xhr.onprogress = function(event) {                                  //progress有三个属性： 
            let divStatus = document.getElementById("status");              //lengthComputable进度信息可用？  position已接受字节数  totalSize预期字节数   
            if (event.lengthComputable){                                    //根据这三个信息可创建进度指示器
                divStatus.innerHTML = "received" + evetn.position + "of" + event.totalSize + "bytes";
            }
        };
        xhr.abort();                                                        //中止请求

        //跨域   
            //IE8的XDomainRequest是同步跨域版的xhr  不支持异步  用绝对路径可跨域
            //现代浏览器的XMLHttpRequest对象只要是输入绝对路径都支持跨域 但是有几点不同： 不能自定义头部， 不能收发cookie， getAllResponseHeaders()失效
        xhr.open("get", "http://www.somewhere.com/page/", true);        //跨域时间长 用异步
            
            //图像ping  通常用于响应图片或者204响应 不能得到具体文字数值数据 但配合监听load/error  可以判断响应时间
        let img = new Image(); 
        img.onload = img.onerror =  function(){console.log("Done")}; 
        img.src="http://www.bing.com/img/some.jpg"; 
            
            //JSONP 包在函数中调用的json  函数在请求中显式被调用    （通过动态<script>调用）   但难以判断失败 也有安全上的隐患
        function handleResponse(response){                              //查询并显示地理位置  ip
            alert("you're at IP address " + response.ip + ", which is in " + response.city + ", " + response.region_name );
        }
        var script = document.createElement("script");
        script.scr = "http://greegeoip.net/json/?callback=handleResponse";
        document.body.insertBefore(script, body.body.firstChild);
            
            //Comet  xhr + setTimeout（）= 长轮询   /  页面生命周期只有一次的HTTP流  服务器连接打开 周期性的发送一些数据   通过监听readstate=3 用respoonseText属性保存数据 + 调整计时器 + progress回调
        received = 0;
        onreadystatechange = function(){
            let result;
            if(xhr.readyState ==3){                                 //获取最新数据并跳转计数器
                result = xhr.responseText.substring(received);
                received += result.length；    
                progress(result);                                   //调用progress回调
            } else if (xhr.readyState == 4){
                finidhed(xhr.responseText);
            }    
        }
        
        //服务器发送事件：  
            //SSE API 用EventSource对象 用法类似xhr  创建对象时传入入口     
            let source = new EventSource("myevent.php");
            source.onmessage = function(event){
                let data = event.data;
                // 处理数据。。。
            }
            source.close();
            //事件流 通过持久HTTP发送  mime类型为text/event-stream  响应格式为文本  每项数据都带有前缀data ：  
        
        //Web Sockets  在单独持久连接上提供全双工 双向通信  取得服务器响应后 协议换为webSocket  wss：//   这也需要服务器支持  
        let socket = new WebSocket("ws://www.bing.com/server.php"); //必须绝对路径入口
        socket.send("hello world");                                 //只能纯文本
        let message = {                                             //但是可以把数据序列化为一个json字符串 发送
            time : new Date(),
            text : "hello",
            clientId: "asdfp8734rew"
        }
        socket.send(JSON.stringify(message));
        socket.onmessage =function(event){                          //服务器发来信息时， websocket触发message事件 返回的数据在event。data里 可保存下来
            let data = evetn.data;
            // 处理数据。。。
        }
xhr.send(null);
    //最后为了安全  用Ajax时应配合使用SSL / 算法计算的验证码   而不要尝试POST， Url检查， cookie