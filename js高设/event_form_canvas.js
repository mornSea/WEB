//事件  
//要先注册监听器（事件处理程序）预定  事件从底向上冒泡 从顶向下捕获
/* <input type="button" value="click me"  onclick="alert('clicked')" >  */  //通过onclick特性将一些js代码作为值定义了监听器  
div.setAttrbute(onclick = "show"); function show(){alert("clicked")};       //监听器值为动作（一般为其他js部分中的函数） 
div.onclick = "alert(event.type)" /*alert(this.value)*/                     //js里每个元素都可以有事件处理程序属性  将其值赋值为一个函数名/函数/变量 ===》即为指定事件处理程序   同理 也可以将其赋值删除  div。onclick = null

 /*alert(this.value)*/                                                      //event变量直接访问（这个）事件对象（本身）    （函数内）的this.value为事件的目标元素  
function changThis(){                                                                 //扩展作用域（with）： 这个函数里可以像访问局部变量一样访问document和元素成员
    with (document){                                                        //这样事件处理程序要访问自己的属性就容易多了   onclick = “value” 也出元素的value
         with (this){                                                       //如当前元素是个表单 则作用域还包含访问父表单的入口   这样就要两层with中加一层with（this.form）{....    【就像闭包 n层嵌套】
            //元素属性值                                                     //这样下来的效果像数据绑定  可直接再标签中处理/显示数据  （onclick）点表格中一个按钮出来一个（计算过）的表单值
        }
    }
}

/*   onclick="try{func();}catch(ex){}";     */                              //用try-catch包装执行代码 避免函数未加载时点击报错

div.addEventListener("chick", function(){console.log(this.id);}, false);    //为一个div添加了个事件处理程序  可多次调用此函数添加多个事件处理  不同在于可控制什么时候调用处理程序（控制事件传播）  注意：addEventListener创的事件只能removeEventListener删
div.removeEventListener("click", function(){/* 无用 */}, false);            //addEventListener与removeEventListener接受三个参数（要处理的事件名， 处理程序函数， 是否在捕获阶段调用事件的布尔值）  最后一个参数如为false 则事件在冒泡阶段调用函数（大部分）  参数的函数除了同addEventListener 否则不会调用

div.onclick = function(event){                                              //触发事件时 浏览器会传入一个event事件对象到处理函数 它包含事件相关信息 包括currentTarget（正在处理事件的函数）， target（事件目标） type（被触发事件类型）等属性      
    console.log(event.currentTarget === this);                              //事件处理程序函数里currentTarget=this 如果直接把事件处理程序指定给目标元素 则target也等于this
    console.log(event.target === this);                                     //一旦事件执行完 event马上销毁
}

var handler = function(event){                                              //也可以通过event的type属性一个函数处理多个事件  
    switch(event.type){                                                     //这是点击出警告框 鼠标悬浮时改背景色/离开时恢复  
        case "click":
            alert("click");
            break;

        case "mouseover":
            event.target.style.backgroundColor = "red";
            break;

        case "mouseout":
            event.target.style.backgroundColor = "";
            break;   
    }
};
div.onclick = handler; div.onmouseover = handler; div.onmouseout = handler;

link.onclick = function(event){event.preventDerault();}                     //阻止了点击链接跳转  preventDerault()阻止特定事件的默认行为 只对cancelable为true的事件可用
div.onclick = function(event){event.stopPropagation();}                     //停止事件在DOM层次上的传播

var EventUtil/* 跨浏览器事件对象 */ = {                                       //跨浏览器事件对象（支持现代浏览器和IE的event）
    addHandler: function(event){
        return event ? event : window.event;
    },

    getTarget: function(event){
        if (event.preventDerault){
            event.preventDerault();
        }else{
            event.retuenValue = false;
        }
    },

    removeHandler: function(event){
        return event ? event : window.event;
    },
    
    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        }else{
            event.canclBubble = true;
        }
    }
};


//事件类型{on-}： UI（交互）  焦点  鼠标/滚轮 文本 键盘  合成（输入字符） 变动底层（DOM变化） 变动名称   
    //UI：load， unload（框架/嵌入内容卸载）， abort（停止下载）， error（js出错时在window上触发）， select（选择文本框里的字符）， resize， scroll（滚动滚动条）
    //焦点 :     blur(失去焦点)， focus（得到焦点），  这两个不冒泡 以及还有focusin/out两个冒泡的
    //鼠标/滚轮： click  dblclick（双击） mousedown/up（按下/松开鼠标键），mousemove， mouseover/out（鼠标悬浮于离开）， mouseennter/leave（鼠标首次进入/移出元素区域），   
                //鼠标点击事件发生顺序：（mouse->down->up->click->down->up->click->dblclick   sheift/ctrl/alt/windows（-Key）键都有对应属性（布尔值）可以修饰鼠标行为  形成键鼠快捷操作
                //鼠标滚轮滚动页面时 触发mousewheel事件， 包含鼠标信息外还包含wheelDelta属性 滚动值为（+-）120倍数  配合event.clientX/Y算出来的鼠标坐标 可知用户鼠标移动数据
    //文本 键盘 : keydown（按键，不放为重复触发）， keypewss（字符版的keydown）， keyup（释放）， textInput（插入显示前触发 便于拦截与处理）  每个键有自己的键码event.charCode  
                //DOM3后用key/char取代charCode  key的值就是这个字符 非字符时为键名  二chrome/safari支持keyIdentifier是Unicode化的键字符  DOM3还有textInput： 只有在编辑区按下字符键才触发
    //合成（输入字符）：通过IME支持 输入键盘上没有的字符 （composeition-） start /end， updata（输入字段中插入）
    //变动底层（DOM变化）：（DOM-） SubtreeModified（任何变化/事件），NodeInserted/Removeed（插入/移除节点后）（还有NodeInsertedIntoDocument/RemoveedFromDocument代表可能通过子树插入/移除）， AttrMidified（特性修改）， CharacterDataMoidified（文本节点值改变）
    //HTML5 ：  contextmenu（上下文菜单 类似Windows图标右键 它是冒泡的 so可以给document一个  一般顺序：添加 => 去浏览器默认行为 => 根据获取鼠标位置确定放置ul菜单的位置 => 设置visibility为visible可视 => document加click隐藏菜单）
                //beforeunload（卸载前） DOMContentLoaded（全加载并DOM树准备好） pageshow/hide（前进/后退页时缓存到内存以加快加载速度 每次回上/下一个页面时触发）
    //设备事件： （针对手机平板） 苹果的orientationchange（改变横/纵向 值为朝向：90<, 0^, -90> ）  
                //Deviceorientation（根据加速计告知散文移动方向 值（范围在+-360）：alpha是绕z轴旋转时的y轴度数差 beta是绕x轴旋转时的z轴度数差 famma是绕y轴旋转时的z轴度数差）   还有devicmotion事件告知什么时候移动
                //火狐的MozOrientation类似上面 不过直接返回一个+-1范围的x / y / z 轴值    除z静止是1 其他静止均为0    左/右倾斜时x变大/小  其他同理
    //触摸与手势： （touch-）start/move/end （有了一个手指之后新加入触摸的也触发） 每个Touch对象包含 target触摸节点目标 identifier触摸唯一ID clientX/Y视口坐标  pageX/Y页面坐标  screenX/Y屏幕坐标   
                            //还有三个跟踪触摸属性：touchs targetsTouchs changgeTouchs 包含touch对象数组 不过touched时无touch对象 要用changeTouchs集合     一次内部发生顺序： touchstart 》mouseover 》mousemove 》mousedownw 》mouseup 》click 》 touch
                //（gestures-） start/change/end （必须要两个手指都触摸到事件接受容器才触发 同触摸一样 包含触摸+鼠标属性 还有 rotation旋转角度 scale两手指距离变化  ）
               

EventUtil.addHandler(div, "click", function(event){                         //获取浏览器里鼠标位置
    event = EventUtil.getEvent(event);
    alert("鼠标在浏览器中位置： "+ event.clientX + ", " + event.clientY);
})

EventUtil.addHandler(document, "click", function(event){                        //用事件委托避免太多事件处理程序 在DOM树高层上添加一个事件处理程序  
    event = EventUtil.getEvent(event);                                          //用冒泡捕获让它被子节点继承  再用switch配合id 
    var target = EventUtil.getTarget(event);                                    //所有的事件处理程序可以用一个事件代理  还可以抽象为单独文件复用（钩子的思想？） 
    switch (target.id){
        case "id1":
            //...
        case "id2":
            //...
        //。。。
    }

})

var ve = document.createEvent("UIEvents")                                       //模拟事件 在document上用createEvent（）创建   参数为事件类型字符串， 
ve.initUIEvents("click", true, true, document.defaultView);                     //返回的对象用对应事件字符串如 initUIEvent（）创事件信息   参数（事件类型字符串如“click”，  冒泡？布尔值，  可取消？布尔值， 视图document.defaultView）     

document.unbind()                                                               //最好在移除页面前 删除所有事件处理器   可以用jQuery的unbind  或者自己定义/删除事件代理（也可用钩子 放在事件代理里）



//form 表单             get到from元素  在js里这是个HTMLForm-Element类型   HTML的特性全有为属性   还有 elements（控件集合） enctype（编码类型）
var fm1 = document.forms[0]; var fm2 = document.forms["input"];                 //除了get  通过document可直接用对象的数/key值获取
fm1.target = "terest.top";   fm2.method="POST";  fm2.submit(); fm1.submit();    //js控制提交 （发送， 方式， 域名窗口） 
form.reset();                                                                   //重置 可用preventDefault（event）来阻止重置

var textbox = document.forms[0].elements["textbox1"];  /* textbox.select(); */  //input textatea都支持select（） 选择文本框里所有文本 并将焦点放里面     select（）选择文本时会触发select事件

function getSelectText (textbox){                                               //跨浏览器取选择文本   （调用函数前要创建一个范围） 再将文本提取出来
    if(typeof textbox.selectionStart == "number"){                              //用selectionStart/End  即选择文本的头/尾 偏移量  （数值）    传入substring提取子字符串
        return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
    }else if(document.selection) {                                              //兼容IE
        return document.selection.createRange().text;
    }
}

textbox.value = "hello world";
textbox.setSelectionRange(0, 3);                                                  //所有文本框都有一个setSelectionRange（）选择部分文本，  参数为开始的索引， 结束后一个的索引  像substring   如果传入（0， textbox.value.length）则是全部选择

EventUtil.addHandler(textbox, "keypress", function(event){                        //输入过滤 ： 结合按键/文本事件 和 正则对象 可实现对输入文本的操作   
    //event， target，charCode 要调用EU的get同名函数 略，，，
    if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !event.ctrlKey){
        EventUtil.preventDerault(event);                                          //只允许输入0-9的数字  以及ctrl剪切复制  不符合的取消控件默认操作  （显示 / 发送）
}

function getClipboardText (event){                                                //剪切板事件   copy/cut/paset 即复制/剪切/黏贴  这三个事件还各有前带before 即再发生这些事件前  
    console.log( event.getClipboardTextData.getData("text"));                            //要访问粘贴板数据 用clipboardData对象 （现代浏览器里是event的属性  IE中是window的属性） 
    return event.getClipboardTextData.setData("text/plain",  "some text");        //clipboardData对象有三个方法 get/set/clearData getData参数是类型 （plain(url)/text）    setData参数是类型和要传入的值
}

document.getElementById(input).setAttribute(required);                            //input必填 在HTML5里添加了一些约束验证API （标签属性）：required必填 type添加了Email和url两个检查类型   novaildate禁用验证
/* <input pattern="\d+"> */     document.forms[0],checkValidity();                //patterm用一个正则表达式值匹配文本框 (例子里是只用数字)，    还可以给表单的根元素上用checkValidity检擦是否全部是有效字段 （填了）
return selectbox.options[0].text,  selectbox.options[0].value  ;                  //选择框可以用options对象（集合 包含所有选项）  来选择子元素（像数组） 并根据文本/值返回

//表单序列化： 用表单的type 将name和value按序列结构化   
//思想：
    //创空数组 》for循环中（每个表单字段 并存在field变量）》
    // 》switch检查type 分类处理：》select元素：遍历每个选项 选中时在数组加入值 》按钮跳过 》
    // 》input/textarea和file分别处理 》单选按钮/复选框 检查checked 如果是false则退出switch  是true则将name：value加入数组 》
    // 》继续执行default，检查下一个字段》循环结束后 用join格式化整个字符串（用&分隔表单字段）》再用serialize（）之类的用GET将字符串输出 （又叫 查询字符串格式）
function serialize(form){
    var parts = [];
    field = null,
    ile,
    j,
    optLen,
    option,
    optionValue;

    for (i=0, len=form.elements.lenght; i<len; i++){
    field = form.elements[i];
    switch(field.type){
        case "select-one" :
            case "select-multiple" :
            if (field.name.length){
                for (i=0, optLen = field.options.length; j < onpLen; j++){
                    option = field.options[j];
                    if(option.selected){
                        optValue = "";
                        if (option.hasAttribute){
                            optValue = (option.hasAttribute("value") ? option.value : option.text);
                        } else{
                            optValue = (option.attributes['value'].specified ? option.value : option.text);
                        }
                        parts.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(optValue));
                    }
                }
            }
            break;
        case undefined:     //字段集
        case "file":        //文件输入
        case "submit" :     //提交按钮
        case "reset" :      //重置按钮
        case "button" :     //自定义按钮
            break;

        case "radio" :      //单选按钮
        case "checkbox" :   //复选框
            if (!field.checked){
                break;      
            } 

        default :           //默认操作   不包含没有名字的表单字段
            if(field.name.lenght){
                parts.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(field.Value)
            }
        }
    }
    return parts.join("&");
}

//富文本： 再一个iframe框架里 设置designMode 这个里面的元素可以编辑  如果designMode值为on 这个子文档可以编辑 插入符号 变粗 横线，，，，     或者也可以直接把元素加入contenteditable属性  用document.execCommand()操作富文本 三个参数（命令， false， 命令的值（字符串））   命令常用有：backcolor背景色  fontname/size/color字体名/大小/色 indent缩进



//canvas    在html里添加canvas标签  设置宽与高
{/* <canvas  id="canvas"></canvas>
<img src="./卢浮星夜.jpg"  id="卢浮星夜"   style="display: none">  */}
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");                         //获取2d上下文
cvs.width = window.innerWidth;                          //设置长宽  
cvs.height = window.innerHeight;

//1 IMG
imgType = cvs.toDataURL("image/jpg");                   //用canvas对象的 toDataURL（） 可以把渲染的图像导出 参数为图片格式
var img = document.createElement("img");               //canvas图像
img.src = imgType;
document.body.appendChild(img);
img.style.display = "none";
                                                        
var image = document.getElementById("卢浮星夜");            //外部图片和img  
image.onload = "ctx.drawImage(image)";                     //上下文对象的绘图方法  参数（有图的img元素， 开始绘制的起点x值， y值）  


//2 矩形;
ctx.strokeStyle = "lightblue";
ctx.fillStyle = "rgba(75, 175, 175, .7"; ctx.fillRect(50, 80, 240, 500); //fillStyle设置填充颜色  并用fillRect（）绘制
ctx.fillStyle = "rgba(0, 100, 140, 0.4)"; ctx.fillRect(160, 220, 340, 650);
ctx.clearRect(170, 240, 50, 150);                       //用清除矩形函数在canvas里清空一小块

//3绘制几何图形 - 时钟
ctx.beginPath();                                        //绘制路径前要调用beginPath（）  
ctx.arc(100, 100, 99, 0, 2 * Math.PI, false );          //以圆心画弧线   参数为（圆心的X， Y值， 半径， 开始角度， 结束角度（2*PI）， 是否逆时针 ）  以及还有arcTo（x1, y1, x2, y2, 半径） 用于从上一点绘制到下一点
ctx.moveTo(194, 100);                                   //类似绘图时 鼠标松开  移动位置  参数为x， y值
ctx.lineTo(100, 15);                                    //从上一点绘制一条直线 直到x， y
ctx.moveTo(100, 100);
ctx.lineTo(35, 100);
ctx.stroke();                                           //描边路径  即开始绘制

ctx.font = "bold 17px Arial";                           //绘制字体  CSS一样设置字体属性  最后用fillText绘制
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText(12, 105, 20);              

ctx.translate(100, 100);                                //用translate改原点（0， 0）的值到（x，y）   
ctx.rotate(1);                                          //绕原点旋转 参数（角度）
ctx.scale(2, -1);                                       //缩放 参数（scaleX， scaleY），在x方向上乘以scaleX， y方向乘以scaldY
ctx.transform(1, 0.5, -0.5, 1, 30, 10);                 //在上一个变换矩阵上乘以新的矩阵  即修改变换矩阵    还有一个setTransform（相同）， 即重置变换矩阵为默认 再执行变换
ctx.moveTo(0, 0);                                       
ctx.lineTo(0, -85);
ctx.moveTo(0,0);
ctx.lineTo(-65, 0);  
ctx.stroke();                     

//4渐变色
var gradient = ctx.createLinearGradient(400, 40, 580, 300);     //创渐变色对象， 像矩形一样输入两个点的x y  返回一个渐变色对象的实例
gradient.addColorStop(0, "#eee");                               //给实例添加样式（色标位置， 色值）  色标位置是一个从0到1的数值  即表示从开始的颜色到结束的颜色  
gradient.addColorStop(1, "#757575");
ctx.rotate(45);                                                 //为显示不呆板  旋转  并只渲染部分区域（下面绘制时）
ctx.globalAlpha = 0.5;                                          //修改全局透明度
ctx.globalCompositionOperation = "destiantion-over";            //设置合成操作  destiantion-over（默认值）表示后绘制图形位于上方

ctx.fillStyle = gradient;                                       //赋值给fillStyle 
ctx.fillRect(400, 40, 580, 300);                                //绘制矩形  位置应该符合或在渐变色范围里


//5操作图像数据（灰阶过滤器 即变黑白）    注意 只有在图像并非来自他域时才可操作图像数据
/*
 var imageData = ctx.getImageData(10, 5, 50, 50);               //用getImageData（x1, y1, x2, y2）从两个点的矩形里取得图像数据
var data = imageData.data,                                      //上一步返回的对象有宽 高 data几个属性  data是一个数组 保存每一个像素的色值， 每个像素用四个值保存（红， 绿， 蓝， 透明度）  每个值在0-255之间 
    red=data[0], 
    green = data[1],
    blue = data[2], 
    alpha = data[3];
*/

var imageData, data, i, len, acerage, red, green, blue, alpha;
imageData = ctx.getImageData(0, 0, image.width, image.height);
daata = imageData;

for(i=0, len=data.length; i<len; i+=4){                        //获取图像数据
    red = data[i];
    green = data[i+1];
    blue = data[i+2];
    alpha = data[i+3];

    average = Math.floor((red + green + blue) / 3);            //rgb平均值  并以此设置颜色值 
    data[i] = average;
    data[i+1] = average;
    data[i+2] = average;
}
imageData.data = data;                                          //结果写回
ctx.putImageData(imageData, 0, 0);                              //用putImageData显示

//6 动画特效
         /*  var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 32;
          
          var canvas = document.getElementById('Mycanvas');
          canvas.width = WIDTH,
          canvas.height = HEIGHT;
          var context = canvas.getContext('2d');
          context.strokeStyle = 'rgba(0,0,0,0.2)',        */              
          context.strokeWidth = 1,
          context.fillStyle = 'rgba(0,0,0,0.1)';
          var circleArr = [];
      function Line (x, y, _x, _y, o) {
              this.beginX = x,
              this.beginY = y,
              this.closeX = _x,
              this.closeY = _y,
              this.o = o;
          }
        function Circle (x, y, r, moveX, moveY) {
              this.x = x,
              this.y = y,
              this.r = r,
              this.moveX = moveX,
              this.moveY = moveY;
          }
         function num (max, _min) {
              var min = arguments[1] || 0;
              return Math.floor(Math.random()*(max-min+1)+min);
          }
         function drawCricle (cxt, x, y, r, moveX, moveY) {
              var circle = new Circle(x, y, r, moveX, moveY)
              cxt.beginPath()
              cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
              cxt.closePath()
              cxt.fill();
              return circle;
          }
          function drawLine (cxt, x, y, _x, _y, o) {
              var line = new Line(x, y, _x, _y, o)
              cxt.beginPath()
              cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
              cxt.moveTo(line.beginX, line.beginY)
              cxt.lineTo(line.closeX, line.closeY)
              cxt.closePath()
              cxt.stroke();
          }
         
          function init () {
              circleArr = [];
              for (var i = 0; i < POINT; i++) {
                  circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10)/40, num(10, -10)/40));
              }
              draw();
          }
          function draw () {
              context.clearRect(0,0,canvas.width, canvas.height);
              for (var i = 0; i < POINT; i++) {
                  drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
              }
              for (var i = 0; i < POINT; i++) {
                  for (var j = 0; j < POINT; j++) {
                      if (i + j < POINT) {
                          var A = Math.abs(circleArr[i+j].x - circleArr[i].x),
                              B = Math.abs(circleArr[i+j].y - circleArr[i].y);
                          var lineLength = Math.sqrt(A*A + B*B);
                          var C = 1/lineLength*7-0.009;
                          var lineOpacity = C > 0.03 ? 0.03 : C;
                          if (lineOpacity > 0) {
                              drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
                          }
                      }
                  }
              }
          }

          window.onload = function () {
              init();
              setInterval(function () {
                  for (var i = 0; i < POINT; i++) {                     //在setInterval里做计算 赋值 边缘检查/处理  （对每个   圆心）  
                      var cir = circleArr[i];
                      cir.x += cir.moveX;
                      cir.y += cir.moveY;
                      if (cir.x > WIDTH) cir.x = 0;
                      else if (cir.x < 0) cir.x = WIDTH;
                      if (cir.y > HEIGHT) cir.y = 0;
                      else if (cir.y < 0) cir.y = HEIGHT;
                      
                  }
                  draw();
              }, 16);
          }
//cpu有进一半的计算都在strokeStyle上了  被包在drawline里   而占面积非常大的circle只占了一点内存
     


//WEBGL
if(drawing.getContext){                                                 //测试是否支持webgl上下文
    try{
        gl = drawing.getContext("experimental-webgl");
    } catch(ex){
        //nothing
    }
    if(gl){
        //use webgl
    }else{
        alert("webgl conext could not be cewated")
    }
}


gl.clearColor(0, 0, 0, 1);                                              //清屏 为黑色
gl.clear(gl.COLOR_BUFFER_BIT);                                          //再用之前定义在缓冲区的颜色填充对应区域


gl.viewport(0, 0, drawing.width, drawing.height);                       //确定webgl视口 参数（x， y坐标， 宽， 高）
function canvas2webgl(){                                                //坐标转换
    var rect = event.target.getBoundingClientRect();                    //获得canvas距屏幕边距
    var x = event.clientX;
    var y = evetn.clientY;
    
    x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);        //通过canvas.width/2 canvas.height/2得到canvas中心点  即webgl零点     
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);     //用((x - rect.left) - canvas.width/2)和(canvas.height / 2 - (y - rect.top))  将原点移动到canvas中间
                                                                        //x， y再除以canvas长宽的一半  以适应webgl坐标从-1 到 1
}


        //buffer
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.5, 1]), gl.STATIC_DRAW);      //如果要用drawElements  最后一个参数要用gl.ELEMENT_ARRAY_BUFFER
gl.deleteBuffer();

        //GLSL
var vertexGlsl /*定点着色器*/= "                                                 
attribute vec2 aVertexPosition;                                         //attribute是包含x， y坐标的数组  
void main(){
    gl_Position = vec4 (aVertexPosition, 0.0, 1.0);                     //用四个坐标（四元素数组）填补缺失坐标 使2D变3D  
}
"

var fragmentGlsl = "
uniform vec4 uColor;                                                    //绘图时使用的颜色
void main(){
    gl_FragColor = uColor;
}
"
        //编译与运行
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexGlsl);
fl.compileShader(vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmetnGlsl);
fl.compileShader(fragmetnShader);


var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);


        //传入值
var uColor = gl.getUniformLocation(program, "uColor");
gl.uniform4fv(uColor, [0, 0, 0, 1]);
        //获取值在本地存储的位置， 启用它 创建指针指向gl。bindBuffer指定的缓冲区并保存到aVertexPostion
var aVertexPosition = fl.getAttribLocaltion(program, "aVertexPosition");
gl.enableVertexAttribArray(aVertexPosition);
gl.vertexAttribPointer(aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

        //绘图  用gl.drawArrays(数组缓冲区) / gl.drawElements(元素数组缓冲区)
        //第一参数都是一个常量 表示要绘制的形状  包括（gl.）：POINT, LINES一对对线, LINE_LOOP连起来, LINE_STRIP同前但最后与第一个不连, TRIANGLES三角，TRIANGLES_STRIP将前一个三角后2点与新点连, TRIANGLES_FAN三角扇
var vertices = new Float32Array([0, 1, 1, -1, -1, -1]),
    buffer = gl.createBuffer(),
    vertexSetSize = 2,
    vertexSetCount = vertices.lenght/vertexSetSize,
    uColor , aVertexPosition;

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

uColor = gl.getUniformLocation(program, buffer);
gl.uniform4fv(uColor， [0, 0, 0, 1]);

aVertexPosition = gl.getAttribLocaltion(program, "aVertexPosition");
gl.enableVertexAttribArray(aVertexPosition);
gl.vertexAttribPointer(aVertexPosition, vertexSetSize, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLSE, 0, vertexSetCount);


        //纹理  Img object    gl.createTexture()
var image = new Image(), 
    texture;
image.src = "smile.gif";
image.onload = function (){
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FILP_Y_WEBGL, true);

    gl.textImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.textparamenteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEARSET);
    gl.textparamenteri(gl.TEXTURE_2D, TEXTURE_MIN_FILTER, gl.NEARSET);

    gl.bindTexture(gl.TEXTURE_2D, null);                            //清除
}


        //读取像素    readPixels() 参数：x， y， 宽， 高， 图像格式， 数据类型， 类型化数组
var pixels = new Uint8Array(25*25)；
gl.readPixels(0, 0, 25, 25, gl.RGBA, gl.UNSIGNED_BYTE, pixels);




