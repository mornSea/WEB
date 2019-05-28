function errorKing() {
    try {
        somefunction();
    }
    catch (error){
        if (error instanceof RangeError) {
            console.log("数值超出范围");
        }
        else if (error instanceof ReferenceError) {
            console.log("找不到对象 or 访问不存在变量");
        }
        else if (error instanceof TypeError) { //最常见  经常由传给函数的参数没检查 导致形参 实参类型不一致
            console.log("变量中保存意外类型 or 访问不存在方法");
        }
        else if (error instanceof URIError) {
            console.log("使用encodeURI（） / decodeURI（） 时URI格式不正确");
        }
        else if (error instanceof EvalError) {
            console.log("使用eval（）错误");
        }
        else if (error instanceof SyntaxError) {
            console.log("使用eval（）时传入语法错误的js字符串");
        }
        else {
            console.log("error 各错误基类型");
        }
    }
}
errorKing();
