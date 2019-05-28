function auton(request){
            request.onerror = function(){
                console.log("事务取消");
            };                                                                              //每次事务都定义事件 可以设置为一个函数autoON 自动添加  这样autoON（request）;
            request.oncomplate = function(){
                console.log("down!");
            };
        };
        auton("hi");




