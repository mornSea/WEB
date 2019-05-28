//window对象 浏览器窗口/全局  nodejs 用golgal   但窗口属性全无
let a = 1;
delete a;
console.log(a);
delete window.a;
console.log(a);     //全局的变量用window可删

    //用innerWidth/innerHeight属性判断 窗口大小 尺寸 
var wid = window.innerWidth;
var hei = window.innerHeight;
if (typeof wid != "number"){
    console.log(window.innerHeight, window.innerWidth);
}else{
    console.log("没有窗口");
}
    //导航  打开/改变窗口
let url = "https://bing.com/";
wind = window.open(url);           //导航到新页面 默认为浏览器点击链接效果（new tap）  其余参数为框架/窗口，  最大化，宽， 高， 左，右，拖动，，，，  用close（）关窗口
wind.resizeTo(500, 500);   wind.moveTo(100, 100);//该窗口大小 移动位置

//location： document+window  包含：hash（url）  host/-name（服务器）  href   pathname   port（端口号）  protocol（协议） search（查询字符串）
function getQueryStringArgs(){
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),      //查询url的问号  并保存 值 ：空 
        args = {},                                                                  
        items = qs.length ? qs.split("&"):[],                                       //查询字符串长 保存 split用”&“分割数组 ：空
        item = null, 
        name = null,
        value = null,
        i = 0,
        len = items.length;

    for (i=0; i<len; i++){  
        item = items[i],split("=");                                                  //对于每个a=b  用sqlit分割”=“                                                       
        name = decodeURIComponent(item[0]);                                          //分割出来的分别转码 赋值
        value = decodeURIComponent(item[1]);

        if (name.length){                                                            //先检查有无名  再赋值到对象
            //args[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);       //一次性赋值
            args[name] = value;
        }
    }
    return args;
}
    //navigator检擦浏览器 客户端   screen反显示器像素值  history历史记录  所有系统浏览器都在window里有

//DOM           node（document（element））一层层继承属性与方法
    //每个节点都有个childNodes属性 其中保存一个nodeList对象  所有变化反应到nodeList   （还有parent first last next previous 等node关系）
var nodeArr = Array.prototype.slice.call(somenode.childNodes, 0);       //用array的方法把其转换为数组 
var newnode = somenode.appendChild(newNode);                            //向子节点列表尾部添加节点   如传入已有节点 则移动位置       insertBefore（新， 目标位置前节点） replaceChild替换  removeChild移除（位置）
somenode.cloneNode();                                                   //通过传入参数 true/false  深浅克隆节点/及子节点树  但不复制被调用/事件 js
document.title="hi"; let url = document.url;                            //document对象类似window
var title = document.getElementById("title");                           //还有（getElements）ByTagName  ByName
let form = document.forms;                                              //document特殊集合 还有 anchors带name的链接 images links
document.write("<strong>" + (new Date()).toString() + "</stong>");      //document写入（HTML为字符串 中间可为js变量） 其他IO方法：writeln（换行）， open（）， close（）  都是一个字符串参数
if (element.tagName.toLowerCase() == "div"){dosomething};               //elemen元素有id name itle lang className等属性 
someclass = somenode.getAttrbute(class);                                //获取某节点全部样式   还有setAttrbute removeAttrbute等特性操作
document.createElement("div");                                          //创建元素 参数为字符串标签（及其属性 内容） 还可以为js css部分添加（外部）代码： 向srcipt.text / style.styleSheet.cssText添加
setTimeout(somefunction, 1000);                                         //间隔1秒（1000毫秒）执行somefunction    setInterval（）自动重复

var divs= document.getElementsByTagName("div"), i, div;                 //NodeList,NameNodeList, HTMLCollection三个集合都是动态的 发生变化时更新 都是访问DOM文档实时运行的查询
for (i=0; i<divs.length; i++){                                          //无限重复  因为每次循环后divs.length也会++  应改为用拷贝
//for (i=0, var len=divs.length; i<len; i++){  
    div = document.createElement("div");
    document.body.appendChild(div);
}

let heightLight = document.querySelector("高亮");                       //返回符合css的首个元素   querySelectorAll返回全部符合的数组  参数字符串如CSS的选择器   也可用HTML5的getElementByClassName（）

var i, len, child=element.firstElementChild;                            
while(child!=element.lastElement.child){                                //元素遍历  
    processChild(child);                                                //遍历子元素
    child = child.nextElementSibling;                                   //指向后一个同辈元素nextElementSibling
}
    //HTML5
div.classList.add("userlogin");                                         //getElementByClassName（）外 还有这个classList操作样式， 包含add, remove, contains(确定有无)， toggle(有则删 无则加)     
document.getElementsByClassName("search").focus();                      //焦点
div.innerHTML="hello<br/>";                                             //innerHTML直接赋值字符串  插入值与元素    外部插入html要用window.toStaticHTML()  去除 html源码中的js，事件
div.outerHTML = "<p>"+ table.outerHTML +"</p>";                         //用p取代原div 在读模式下outerHTML返回调用它的元素树 写模式下创元素树并替换             删除（带事件/引用其他js对象）的子树时  会带来性能问题应用赋值为null  或者统一以减少次数
document.forms[q].scrollIntoView();                                     //滚动窗口/容器 调用的元素就出现 参数无或者true为窗口顶与元素顶齐  false则是全部出现在窗口          其他滚动方法：scrollIntoViewIfNeeded（） 不可见时滚动至可见  scrollByLines（）指定滚动行高  scrollByPages（）指定滚动高  前2者用于容器 后2者用于元素

//  DOM2/3
function getElementLeft(element){                                       //求元素在页面的偏移量  用offsetLeft/offsetTop 和其包含元素的offsetParent的相同元素一直加到根元素
    let actualLeft = element.offsetLeft;                                //这是left的 top的同   cllientWidth/clientHeight属性返回元素包括内边距的大小   通过CSS的overflow可得滚动元素的：scroll- width/height/top/left 前2为总高宽  后2为隐藏的
    let current = element.offsetParent;                                 //包含元素的引用    

    while(current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

var filter = function(node){                                            //一个只显示p元素的迭代器  用document.createNodeIterator()创建迭代器的实例 接受参数（起点， 访问哪些节点的“代码”， 节点过滤器对象 实体引用false）
    return node.tagName.toLowerCase() == "p" ?                          //这里选择所有的p元素
        NodeFilter.FILTER_ACCEPT :
        NodeFilter.FILTER_SKIP;
};                                                                      //NodeFilter.SHOW_ELEMENT：显示节点
var iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT,filter, false);

div.innerHTML = "<p id=\"p1\"><b>hi</b></p>";
var range1 = document.createRange(); range2 = document.createRange(); p1 = document.getElementById("p1");
range1.selectNode(p1); range2.selectNodeContents(p1);                   //创建range对象（范围）， 并以不同方法选择元素 前者只包含元素内子树  后者包含元素           新创建的range对象只能关联创建它的文档
var fragment = range2.extractContents();  range1.deleteContents();      //操作范围  都是移除，前者返回范围的片段文档(提取出)， 后者直接删   detach（）可解除引用 垃圾回收
var fragment = fange2.clongContants(); p1.parentNode.appendChild(fragment);  //克隆并插入  还有clongRange()复制范围
span.style.backgroundColor="red";  range1.surroundContents(span);       //环绕范围插入  会给范围里添加一个背景色（给范围加上CSS/js）  会执行：提取范围   插入元素  提取的再插入（刚插入的新元素）里
range1.collapse(true);                                                 //折叠范围（到开始位置） （不可选中？） 



document.write("<h2 id='a'></h2>");                                     //结合DOM常用操作  创建一个动态时钟（创建+获取元素 时间延迟 插入(局部刷新) 设置样式）
setInterval(dateal, 1000);  
var point = document.getElementById("a");  
point.style.cssText="font-size: 120%; color: #757575;  text-align:center; padding: 60px;";  
function dateal(){ 
    point.innerHTML=(new Date().toString());
}

