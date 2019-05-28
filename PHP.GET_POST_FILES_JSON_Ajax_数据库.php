<!--PHP的超全局变量 ($_) 是通过网络协议 就像在本地文件系统同个文件夹下一样 获取/发送文件与信息   变量用$开头作为声明  超全局变量用$_开头-->

<?   
    //$_FILES是个多维数组， 第一维是表单的input的name（如“file”） 后面的可以是name， type， size， tmp_name, error
    /* 
    $_FILES["file"]["name"] - 被上传文件的名称
    $_FILES["file"]["type"] - 被上传文件的类型
    $_FILES["file"]["size"] - 被上传文件的大小，以字节计
    $_FILES["file"]["tmp_name"] - 存储在服务器的文件的临时副本的名称
    $_FILES["file"]["error"] - 由文件上传导致的错误代码
    */
    //例子：假如限制图片格式并限制大小20k (还可限制非重复 数量)  逻辑：检查格式和大小 ，不合格则报错，（如果连接没有报错，先打印要上传的文件信息， （然后检查对应服务器里是否已经有了 有则跳过并显示 没有则保存到upload中以上传的文件名为名） 
    if ((($_FILES["file"]["type"] == "image/gif")
        ||  ($_FILES["file"]["type"] == "image/jpeg")
        ||  ($_FILES["file"]["type"] == "image/pjpeg"))
        &   ($_FILES["file"]["size"] < 20000))
        {
            if($_FILES["file"]["error"] > 0)
            {
                echo "retun code: ". $_FILES["file"]["error"] . "<br />";
            }
            else 
            {
                echo "upload : " . $_FILES["file"]["name"] . "<br />";
                echo "Type: " . $_FILES["file"]["type"] . "<br />";
                echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
                echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";
                
                if(file_exists("upload/".$_FILES["file"]["name"]))
                {
                    echo $_FILES["file"]["name"]. "already exists";
                }
                else
                {
                    move_uploaded_file($_FILES["file"]["tmp_name"], "upload/".$_FILES["file"]["name"]);
                    echo "stored in : "."upload/".$_FILES["file"]["name"];
                }
            }
        }
        else
        {
            echo "invalid file";
        }
?>


<!-- 
PHP $_POST 广泛用于收集提交 method="post" 的 HTML 表单后的表单数据。$_POST 也常用于传递变量。
。当用户点击提交按钮来提交数据后，表单数据会发送到 <form> 标签的 action 属性中指定的文件。
在本例中，我们指定文件本身来处理表单数据。然后，我们可以使用超全局变量 $_POST 来收集输入字段的值
 -->
<html>
<body>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
Name: <input type="text" name="fname">
<input type="submit">
</form>

<? 
$name = $_POST['fname'];    //主要注意POST用form里要提取的单元的name提取对应的value
echo $name; 
?>
</body>
</html>






<a href="test_get.php?subject=PHP&web=W3school.com.cn">测试 $GET</a>

<?   //test_get.php
//$_GET 也可用于收集提交 HTML 表单 (method="get") 之后的表单数据。$_GET 也可以收集 URL 中的发送的数据。 */
echo "在 " . $_GET['web'] . " 学习 " . $_GET['subject'];    //GET里是用url传过来的key作为数组的key使用
?>





<!-- PHP有json_encode() json_decode两个函数 前者编码 后者解码 参数只接受utf-8 -->
<?
$arr = array("a"=>1, 'b'=>2, c=>3, 'd'=>4);
echo json_encode($arr);
/* 结果为
　{"a":1,"b":2,"c":3,"d":4,"e":5}
 */

$obj->body = 'another post';     $obj->id = 21;
echo json_decode($obj);
//结果： （'body':"another post", "id" : 21）       索引数组（indexed array）转为数组格式【】，关联数组（associative array）转为对象格式{}。
    
    //如果你需要将"索引数组"强制转化成"对象"，可以这样写
json_encode( (object)$arr ); 　/* or */　 json_encode ( $arr, JSON_FORCE_OBJECT ); 

//由于PHP有namespace 私有 等；  所有转换为json时， 除对象公开变量（public），其他东西（常量、私有变量、方法等等）都遗失了。     通常情况下，json_decode()总是返回一个PHP对象，而不是数组
?>

<?
//用Ajax实现动态查找/搜索 （即打一个子出一堆提示的那种）   检查文本元素字符数 如果改变 发送带值url到php   检查xmlhttp对象 有返回时用响应文本填充
$q = $_GET["q"];            //例子是找用户名 如果有头一两个匹配的字母就显示 添加一个随机数，以防服务器使用缓存的文件

if(strlen($q) >0){
    $hint="";               //假设所有姓名数据都保存在$a
    for($i=0; $i<count($a); $i++){  //找与js匹配的名字： 转小写 看本地中每一个相同长度的字符串 是否等于 js的  （这是姓名/同名检查  由于js来的只是一个用户名 所以只要检查一次它 与本地所有的）  如果是搜索 就是直接数据库找所有这个字符串开头的项
        if(strtolower($q)==strtolower(substr($a[$i], 0, strlen($q)))){
            if($hint==""){
                $hint = $a[$i];                 //空数组则直接加
            }else{
                $hint = $hint.", ".$a[$i];      //之前有则加个逗号  继续加在字符串后面
            }
        }
    }
}
if($hint == ""){            //检查结果
    $response = "no suggestion";
}else{
    $response = $hint;
}
echo $response;             //返回结果 注意 如果用户没有打开这个网页/Ajax  是以Xml的格式返回的
?>




<!-- Ajax 数据库实例    类似上例 但是用数据库 查下拉列表里内容的参数 添加一个随机数，以防服务器使用缓存的文件-->


<?
/* PHP里数据库常用操作：

(mysql_  操作库有专门函数)
 Connect 连接  
 Close 关闭连接

(mysql_query() 中用的查询SQL语句  一起用)
 Create 创建  (DATABASE  /   TABLE)
 Select 选择库  （也有mysql_select_db();）
 Where 条件
 Select 选择库
 Update 上传
 Order By 排序
 Delete 删除
(除此之外，还有SET, GET, AND, OR, NOT, BETWEEN, FirstName, FORM,   ，，，，)
Select a User:  Peter Griffin Lois Griffin Joseph Swanson Glenn Quagmire 
 */
$q = $_GET["q"];
$con = mysql_connect("localhost", "peter", 'abc123');       //连接数据库  连接方式/url是本地， name ， password
if(!$con){
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("ajax_demo", $con);                         //选择数据库Ajax-demo（通过登陆的mysql连接对象）
$sql = "SELECT * FORM user WHERE id = '".$q"'    ";         //选择 所有（*） user表里  id为查询字符的  （查询字符可能为字符串  带多个关键字 和&）
$result = $mysql_query($sql);                               //正式执行查询 并将结果保存为reslt

echo "<table border='1'>            
    <tr>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Age</th>
        <th>Hometown</th>
        <th>Job</th>
    </tr>";                                                 //打印html表单的列 即各种属性名
//$数据库返回的结果表中的行 每行共同包含的列（属性）可看为 都是一个基类ROW的实例 都拥有一些空属性 有些有值 有些没有 
while($row = mysql_fetch_array($result)) {                  //通过loop检查并打印 数据库返回的结果表中的行 是否在（数组化）的数据库返回结果里 即打印每一行中loop指定属性的值
    echo "<tr>";
    echo "<td>" . $row['FirstName'] . "</td>";
    echo "<td>" . $row['LastName'] . "</td>";
    echo "<td>" . $row['Age'] . "</td>";
    echo "<td>" . $row['Hometown'] . "</td>";
    echo "<td>" . $row['Job'] . "</td>";
    echo "</tr>";
    };
    echo "</table>";
    mysql_close($con);

//如果想以xml返回查到的数据：
echo '<?xml version="1.0" encoding="ISO-8859-1"?>
<person>'; 
//如上例，不过 while 循环输出的是自定义xml标签  如直接以属性列为标签名   
//并在js里要再设置一个函数 用responseXML（）函数  定义接收xml数据的变量  并从xml取回数据 放在正确的span元素里  可操作性更高
echo "</person>";
?>