//单例  
    //介绍： 一个类只能有一个实例  多次实例化该类 也只返回第一次实例化的实例对象 可以减少内存 避免全局中函数和变量冲突
    //简单例子：
        let timeTool = {                
            name: '处理时间工具库',     
            getISODate: function(){},   
            getUTCDate: function(){}
        }
        //对象字面量   全局只暴露了timeTool对象 
        //不同于其他语言必须要用类实例化 js创建对象方式灵活  
        //let const不允许重复声明的特性 确保timeTool不会被覆盖

    //惰性单例      如果对象复杂且有私有变量/方法 要用构造函数方法实例化对象 + 立即执行函数
        let timeTool = (function(){
            let _instance = null;       //实例对象
            function init(){            //构造函数 用于实例化对象
                //私有变量
                let now = new Date();

                //公有熟悉和方法
                this.name = '处理时间工具库';
                this.getISODate = function(){
                    return now.toISOString();
                }
                this.getUTCDate = function(){
                    return now.toUTCString();
                }
            }
            return function(){
                if(!_instance){
                    _instance = new init();
                }
                return _instance;
            }
        })()
        //这个timeTool是一个函数，  立即执行函数返回的是匿名函数用于判断实例是否创建
        //只有当调用timeTool（）时进行实例的实例化 即不在js加载时就进行实例化创建 而是需要时
        //再次调用 返回的永远是第一次实例化后的实例对象

    //应用场景 
        //一：命名空间 解决全局变量冲突 即向上面一样 只暴露对象名
        //二 管理模块 如库可能有多种功能 如Ajax DOM 事件，，可以用单例模式管理库中各个模块
        var devA = (function(){     //假设这是其中一个开发人员负责的部分
            //Ajax
            var ajax = {
                get: function(api, obj){
                    console.log('ajax get调用')
                },
                post: function(api, obj){}
            }
            //DOM
            var dom = {
                get: function(){},
                creatr: function(){}
            },
            //event
            var event = {
                add: function(){},
                remove: function(){}
            },
            
            return {
                ajax: ajax,
                dom: dom,
                event: event
            } 
        })();

    //es6中的单例
        //使用class和constructor创建对象  如建个Apple类
        class Apple{
            constructor(name, creator, products){
                this.name = name;
                this.creator = creator;
                this.products = products;
            }
        }
        let appleCompany = new Apple(   //实例化apple类
            '苹果公司', 
            '乔布斯', 
            ['iphone', 'iMac', 'ipad', 'ipod']
        );
        //用单例改写
        class SingletonApple{
            constructor(name, creator, products){
                //首次使用构造器实例
                if(!SingletonApple.instance){
                    this.name = name;
                    this.creator = creator;
                    this.products = products;
                    //将this挂载到SingletonApple类的instance属性上
                    SingletonApple.instance = this;     
                }
                return SingletonApple.instance;
            }
        }
        let appleCompany = new SingletonApple(
            '苹果公司',
            '乔布斯',
            ['iphone', 'iMac', 'ipad', 'ipod']
        );
        let appleCompany = new SingletonApple(
            '苹果公司',
            'gump',
            ['iphone', 'iMac', 'ipad', 'ipod']
        );

        //es6 静态方法优化代码  使用static
        class SingletonApple{
            //constructor中只包需含实例化所需的代码 
            constructor(name, creator, products){
                this.name = name;
                this.creator = creator;
                this.products = products;
            }
            //判断是否实例化的逻辑放入静态方法  并调用静态方法获取实例
            static getInstance(name, creator, products){
                if(!this.instance){
                    this.instance = new SingletonApple(name, creator, products);
                }
                return this.instance;
            }
        }

    //单例实战  
        //登录弹框  （只有一个登录框  登陆按钮后返回的永远是一个登录框的实例）
            //顶部导航的登录按钮注册点击事件 》 创建遮罩层和登录弹框 》 创建好后插入页面 》登录框关闭按钮注册事件 》 
            //登录框添加校验 》 登录框的确定按钮注册事件（发Ajax） 这几步和单例关系不大 所以直接省略
            
            /* 添加导航栏html代码：
            <nav class = "top-bar" > 
            <div class = "top-bar_left" > LTH BLOG < /div>    
            <div class="top-bar_right">      
                <div class="login-btn">登陆</div > 
                < div class = "signin-btn" > 注册 < /div>    
            </div > 
            */

            //es6语法创建Login类
            class Login{
                constructor(){
                    this.init();
                }
                init(){     //可视化方法 (包括创建元素，添加样式， 添加模板字符串， 插入元素， 注册事件，)
                    let mask = document.createElement('div');
                    mask.classList.add('mask-layer');
                    mask.innerHTML = `
                        <div class="login-wrapper">
                            <div class="login-title">
                                <div class="title-text">登录框</div>
                                <div  class="close-btn">×</div>
                            </div>
                            <div class="username-input user-input">
                                <span class="login-text">用户名：</span>
                                <input type="text" />
                            </div>
                            <div class="pwd-inputuser-input">
                                <span class="login-text">密码：</span>
                                <input type="password" />
                            </div>
                            <div class="btn-wrapper">
                                <button class="confrim=btn">确定</button>
                                <button class="clear-btn">清空</button>
                            </div>
                        </div>
                    `;
                    document.body.insertBefore(mask, document.body.childNodes[0]);      //插入元素
                    Login.addCloseLoginEvent();     //注册关闭登录框事件 
                }

                static getLoginDom(cls){            //静态方法 获取元素
                    return document.querySelector(cls);     //这个querySelector方法返回文档中匹配指定css选择器的元素
                }

                static addCloseLoginEvent(){        //静态方法注册关闭登录框事件
                    this.getLoginDom('.close-btn')
                            .addEventListener('click', ()=>{
                            //给遮罩层添加style 用于隐藏  而不是删除和再新建  节省内存 提高性能
                            this.getLoginDom('.mask-layer').style = "display: none";
                    })
                }
                
                static getInstance(){       //获取实例
                    if(!this.instance){getLoginDom
                        this.instance = new Login();getLoginDom
                    }else{      //移除遮罩层style
                        this.getLoginDom('.mask-layer').removeAttribute('style');
                    }
                    return this.instance;
                }
            }
            //登录按钮添加点击事件
            Login.getLoginDom('.login-btn').addEventListener('click', () => {
                Login.getInstance();
            })



//工厂   
    //介绍 不暴露对象具体逻辑 把逻辑封装到一个函数里 这个函数就是一个工厂  （抽象：通过n个特征抽取出一个复杂的具体食物）
    //简单工厂/静态工厂  由一个工厂对象决定创建某一种（经常是同一类）对象类的实例 （对应到实际：根据用户等级渲染 根据权限实例化用户 ）
        let UserFactory = function(role){
            function SuperAdmin(){
                this.name = "超级管理员",
                this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
            }

            function Admin() {
                this.name = "管理员", 
                this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
            }

            function NormalUser(){
                this.name = '普通用户',
                this.viewPage = ['首页', '通讯录', '发现页']
            }

            switch (role){
                case 'superAdmin':
                    return new SuperAdmin();
                    break;
                case 'admin':
                    return new Admin();
                    break;
                case 'user':
                    return new NormalUser();
                    break;
                default: 
                throw new Error('参数错误')
            }
        }
        let superAdmin = UserFactory('superAdmin');

        //因为这三个函数里面的结构很相似， 可以再优化一下
        let UserFactory = function(role){
            function User(opt){
                this.name = opt.name;
                this.viewPage = opt.viewPage;
        }
        switch(role){
            case 'superAdmin':
                    return new User({
                        name: '超级管理员',
                        viewPage: ['首页', '通讯录', '发现页', '应用数据', '权限管理']
                    });
                    break;
                case 'admin':
                    return new User({
                        name: '管理员',
                        viewPage: ['首页', '通讯录', '发现页', '应用数据']
                    });
                    break;
                case 'user':
                    return new User({
                        name: '普通用户',
                        viewPage: ['首页', '通讯录', '发现页']
                    });
                    break;
                default:
                    throw new Error('参数错误, 可选参数:superAdmin、admin、user')
            }
        }
        let superAdmin = UserFactory('superAdmin');
        
    //简单工厂的优点在于只要知道一个正确的参数就可以获取到需要的对象， 但是每次增加新的构造函数还要修改 数量一多 函数巨大；只适合创建逻辑简单 数量少的
    // so 引入工厂方法： 实例化对象的工厂类， 只负责实力化这一件事
    let UserFactory = function(role){       //工厂方法函数： 安全模式创建对象
        if(this instanceof UserFactory){    //必须要实例化UserFactory函数才能进行其他的实例化
            var s =  new this[role]();
            return s;                       
        } else {        //安全模式：有的话返回一个立即执行的对象 没有的话先返回一个工厂方法（自己）的实例  避免外部忘记用new
            return new UserFactory(role);
        }
    } 

    UserFactory.prototype = {       //工厂方法的原型中 设置所有对象的构造函数
        SuperAdmin: function(){
            this.name = "超级管理员", 
            this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
        },
        Admin: function () {
            this.name = "管理员", 
            this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
        },
        NormalUser: function () {
            this.name = '普通用户', 
            this.viewPage = ['首页', '通讯录', '发现页']
        }
    }
    let superAdmin = UserFactory('UsperAdimin'); //...
    //添加到方法的原型中就解决了每次添加构造函数要修改代码的问题， 现在只要调用原型就可以添加：
    UserFactory.prototype = {;                       
        VipUser: function(){
            this.name="付费用户", 
            this.viewPage = ['首页', '通讯录', '发现页', 'VIP页']
        }
    }

    //抽象工厂模式      不是直接生成实例，而是生成类蔟  (如用户来自wechat， weibo 就是不同的类蔟)
        //类簇一般用父类定义， 并在父类中定义一些抽象方法， 再通过抽象工厂让子类继承父类
        //抽象工厂就是让子类继承父类的方法， 但它是只声明而不能使用的， js也没有对应的abstract关键字 通过在类的方法中抛出错误的方法模拟
        let WechatUser = function(){}
        WechatUser.prototype = {
            getName: function(){
                return new Error('抽象方法不能调用');
            }
        }
        //实现帐号管理的抽象工厂方法：
        let AccountAbstractFactory = function(subType, superType){
            //如抽象工厂中是否有该抽象类  则让子类继承父类
            if(typeof AccountAbstractFactory[superType]==='function'){   
                //缓存父类
                function F(){};
                //继承父类属性和方法 （父类的原型为 参数的实例化）
                F.prototype = new AccountAbstractFactory[superType]();
                //将子类的constructor指向子类
                subType.constructor = subType;
                //子类原型继承父类
                subType.prototype = new F();
            } else {
                throw new Error ('抽象类不存在');
            }
        }

        //设有微信，qq， 微博等类蔟， 如微信用户的抽象类：
        //每个抽象类作为方法（内声明type）添加到抽象工厂方法，
        AccountAbstractFactory.WechatUser = function(){
            this.type = 'wechat';
        }
        // 并再在抽象类的原型（抽象工厂）加入报错的方法 
        AccountAbstractFactory.WechatUser.prototype = {
            getName: function(){
                return new Error('抽象方法不可用')
            }
        }
        //AccountAbstractFactory作为一个抽象工厂方法， 在参数中传递子类和父类，在方法内实现子类对父类的继承；再通过点语法添加抽象类
        

        //(微信)抽象类的普通用户子类  
        function UserOfWechat(name){
            this.name = name;
            this.viewPage = ['首页', '通讯录', '发现页'];
        }
        //抽象工厂实现WechatUser类的继承
        AccountAbstractFactory(UserOfWechat, 'WechatUser');
        //子类中重写抽象方法
        UserOfWechat.prototype.getName = function(){
            return this.name;
        }

        //实例化微信用户 (可以多几种抽象类 每种都有用户子类， 并每种用户都多实例化几个)
        let WechatUserA = new UserOfWechat('小李');
        console.log(wechatUserA.getName(), wechatUserA.type);   //微信小李 wechat

        //ES6重写简单工厂：  使用class代替构造函数创建对象， 用static将简单工厂封装到User类的静态方法中：
        class User{
            constructor(opt){
                this.name =opt.name;
                this.viewPage = opt.viewPage;
            }
            static getInstance(role){
                switch(role){
                    case 'superAdmin':
                        return new User({
                            name: '超级管理员',
                            viewPage: ['首页', '通讯录', '发现页', '应用数据', '权限管理']
                        });
                        break;
                    case 'Admin':
                        return new User({
                            name: '管理员',
                            viewPage: ['首页', '通讯录', '发现页', '应用数据']
                        });
                        break;
                    case 'user':
                        return new User({
                            name: '普通用户',
                            viewPage: ['首页', '通讯录', '发现页']
                        });
                        break;
                    default:
                        throw new Error('参数错误， 可选参数： superAdmin， admin， user');
                }
            }
        }
        let superAdmin = User.getInstance('superAdmin');

        //ES6重写工厂方法 （将创建对象的工作推迟到子类中 核心类变抽象类） 用new.target模拟抽象类 并指向被new执行的构造函数
        class User{
            constructor(name='', viewPage=[]){//通过new生成实例时自动调用  且类必有
                if(new.target === USer){    //new.target返回一个指向构造方法/函数的引用
                    throw new Error('抽象类不能实例化');
                }
                this.name=name;
                this.viewPage = viewPage;
            }
        }
        class UserFactory extends USer{
            constructor(name, viewPage){
                super(name, viewPage)       //子类在构造器方法中继承父类的this
            }
            create(role){
                switch(role){
                    case 'superAdmin':
                 return new UserFactory('超级管理员', ['首页', '通讯录', '发现页', '应用数据', '权限管理']);
                 break;
             case 'admin':
                 return new UserFactory('普通用户', ['首页', '通讯录', '发现页']);
                 break;
             case 'user':
                 return new UserFactory('普通用户', ['首页', '通讯录', '发现页']);
                 break;
             default:
                 throw new Error('参数错误, 可选参数:superAdmin、admin、user')
                }
            }
        }
        let UserFactory = new UserFactory();
        let superAdmin = UserFactory.create('superAdmin');

        //Es6 重写抽象工厂模式  同样使用new.target模仿抽象类，用继承方式创建子类类蔟，getAbstractUserFactor返回指定类蔟 
        class USer{
            constructor(type){
                if(new.target === User){
                    throw new Error('抽象类不能实例化')
                }
                this.type = type;
            }
        }
        class UserOfWechat extends User{
            constructor(name){
                super('wechat');
                this.name = name;
                this.viewPage = ['首页', '通讯录', '发现页']
            }
        }
        //。。。
        function getAbstractUserFactory(type){
            switch(type){
                case 'wechat':
                    return UserOfWechat;
                    break;
                case 'qq':
                    return UserOfQq;
                    break;
                case 'weibo':
                    return UserOfWeibo;
                    break;
                default:
                throw new Error('参数错误, 可选参数:superAdmin、admin、user')
            }
        }
        let WechatUserClass = getAbstractUserFactory('wechat');
        let WechatUser = new WechatUserClass('小李');

        //工厂模式实战   最常用简单工厂  只有超大项目才用其他两种
            //vue + vue-router 项目中， 将所有路由写到router/index.js， 如： 
            //index.js  导入库和各页面组件 并将各组件添加到routers数组
            import Vue from 'vue'
            import Router from 'vue-router'
            import Login from '../components/Login.vue'
            import SuperAdmin from '../components/SuperAdmin.vue'
            import NormalAdmin from '../components/Admin.vue'
            import User from '../components/User.vue'
            import NotFound404 from '../components/404.vue'
            Vue.use(Router);
            export default new Router({
                routes: [
                //重定向到登录页 
                {
                    path: '/',
                    redirect: '/login'
                }, 
                //登陆页 
                {
                    path: '/login',
                    name: 'Login',
                    component: Login
                }, 
                //超级管理员页面 
                {
                    path: '/super-admin',
                    name: 'SuperAdmin',
                    component: SuperAdmin
                }, 
                //普通管理员页面 
                {
                    path: '/normal-admin',
                    name: 'NormalAdmin',
                    component: NormalAdmin
                }, 
                //普通用户页面 
                {
                    path: '/user',
                    name: 'User',
                    component: User
                }, 
                //404 页面 
                {
                    path: '*',
                    name: 'NotFound404',
                    component: NotFound404
                }]
            })          

            //到权限管理页面要根据权限的跳转， 通过router的addRoutes给予用户对应路由权限
                //index.js中 跟改为只提供/login一个路由页面
                import Vue from 'vue';
                import Router from 'vue-router';
                import Login from '../components/Login.vue';
                Vue.use(Router);
                export default new Router({
                    routes:[
                        {
                            path: '/',
                            redirect: '/login'
                        },
                        {
                            path: '/login',
                            name: 'Login',
                            component: Login
                        }
                    ]
                })

                //新建router/routerFactory.js  导出routerFactory简单工厂函数， 据用户权限提供路由权限
                import SuperAdmin from '../components/SuperAdmin.vue';
                import NormalAdmin from '../components/Admin.vue';
                import User from '../components/User.vue'
                import NotFound404 from '../components/404.vue';
                let AllRoute = [
                    //超级管理员页面 
                    {
                        path: '/super-admin',
                        name: 'SuperAdmin',
                        component: SuperAdmin
                    }, 
                    //普通管理员页面 
                    {
                        path: '/normal-admin',
                        name: 'NormalAdmin',
                        component: NormalAdmin
                    }, 
                    //普通用户页面 
                    {
                        path: '/user',
                        name: 'User',
                        component: User
                    },
                    // 404 页面 
                    {
                        path: '*',
                        name: 'NotFound404',
                        component: NotFound404
                    }
                ]
                let fouterFactor = (role) => {
                    switch(role){
                        case 'superAdmin':
                            return {
                                name: 'SuperAdmin', route: AllRoute
                            };
                            break;
                        case 'normalAdmin':
                                return {
                                    name: 'NormalAdmin', route: AllRoute.splice(1)
                                }
                                break;
                            case 'user':
                                return {
                                    name: 'User', route: AllRoute.splice(2)
                                }
                               break;
                            default:
                                throw new Error('参数错误! 可选参数: superAdmin, normalAdmin, user')
                    }
                }
                export {routerFactory};
                
                //login.vue  登录页导入该方法， 请求登录接口后根据权限加载路由
                import {routerFactory} from '../router/routerFactory.js';
                export default{
                    methods: {
                        //...
                        userLogin(){
                            /* 请求登陆接口,
                            获取用户权限,
                            根据权限调用this.getRoute方法.. */
                        },
                        getRoute(role){ 
                            //根据权限调用routerFactory 
                            let routerObj = routerFactory(role);
                            //给vue-router添加该权限所拥有的路由页面 
                            this.$router.addRoutes(routerObj.router);
                            //跳转到相应页面
                            this.$router.push({
                                name: routerObj.name
                            })
                        }
                    }
                };
                //在实际项目中， 因为使用this.$router.addRoutes方法添加的路由刷新后不保存，会导致路由无法访问。通常本地加密保存用户信息， 在刷新后获取本地权限并解密， 根据权限重新添加路由。



//建造者                 
    //工厂模式都是属于创建型的， 但建的东西不同 简单的只适合建单一对象， 工厂适合将创建实力放到子类进行， 抽象工厂生产类蔟而不是实例，灵活使用简单工厂其实就能解决大部分问题。
        //介绍： 将一个复杂对象的构建层与其表示层相互分离， 同样的构建过程可采用不同的表示,特点是分步(链式调用)构建一个复杂的对象， 最后调用build方法来生成最终对象
                //es6的建造者模式：建造一个书记对象返回  关键在于类中后面每个方法改变一个this属性并返回this  这成为链式调用的关键
                    class BookBuilder{
                        constructor(){
                            this.name = '';
                            this.author = '';
                            this.price = 0;
                            this.category = '';
                        }
                        withName(name){
                            this.name = name;
                            return this;
                        }
                        withAuthor(author){
                            this.author = author;
                            return this;
                        }
                        withPrice(price){
                            this.price = price;
                            return this;
                        }
                        withCategory(category){
                            this.category = category;
                            return this;
                        }

                        build(){
                            return {
                                name: this.name,
                                author: this.author,
                                price: this.price,
                                category: this.category
                            }
                        }
                    }
                    const book = new BookBuilder()  //调用 通过js的链式调用
                        .withName('CS50')
                        .withAuthor('daiwe')
                        .withPrice(0)
                        .withCategory('compute sencience')
                        .build();

                    //简化withxxx的写法：
                    class BookBuilder{
                        constructor(){
                            this.name = '';
                            this.author = '';
                            this.price = 0;
                            this.category = '';
                            Object.keys(this).forEach(key => {      //所有建造方法withxxx在调用建造方法中完成   对每个对象内部数组的元素： 
                                const withName = `with${key.substring(0,1).toUpperCase()}${key.substring(1)}`;  //建造withxxx方法的名字 
                                this[withName] = value => { //将this里方法名赋值为一个匿名箭头函数
                                    this[key] = value;      //将这个属性的值赋值为参数 并返回
                                    return this;
                                }
                            })
                        }
                        build(){        // 先将this对象中不是方法的属性复制出来， 再将所有的合并到一起为一个对象， 返回这个对象
                            const keysNoWithers = Object.keys(this).filter(key => typeof this[key] !== 'function');
                            return keysNoWithers.reduce((returnValue, key) => {
                                return {
                                    ...returnValue,     //...合并对象语法
                                    key: this[key]
                                }
                            }, {})
                        }
                    }
                    const book = new BookBuilder()
                        .withName('CS50')
                        .withAuthor('daiwe')
                        .withPrice(0)
                        .withCategory('CS')
                        .build();
                    
                    //有了上面这个简写方法， 创建多个建造者类变得非常容易   (就是通过class把那块复杂的代码继承)
                    class BaseBuilder {     //父类
                        init(){
                            Object.keys(this).forEach(key => {
                                const withName = `with${key.substring(0, 1).toUpperCase()}${key.substring(1)}`;
                                this[withName] = value => {
                                    this[key] = value;
                                    return this;
                                }
                            })
                        }
                        build(){
                            const keysNoWithers = Object.keys(this).filter(key => typeof this[key] !== 'function');
                            return keysNoWithers.reduce((returnValue, key) => {
                                return {
                                    ...returnValue,
                                    [key]: this[key]
                                }
                            }, {})
                        }
                    }
                    class BookBuilder extends BaseBuilder{  //子类1: 书籍建造者类
                        constructor(){
                            super();
                            this.name = '';
                            this.author = '';
                            this.price = 0;
                            this.category = '';
                            super.init();
                        }
                    }
                    class printHouseBuilder extends BaseBuilder {//子类2: 印刷厂建造者类
                        constructor(){
                            super();
                            this.name = '';
                            this.location = '';
                            this.quality = '';
                            super.init();
                        }
                    }
                    //。。。  调用同上， 略
                //不同与工厂方法的创建过程不得而知， 而建造者更关心对象的创建过程， 通过ES6的import和export可以灵活的导入/出， 建造者模式只适合极复杂的对象， 如没有，使用对象字面量/工厂

//适配器        (用好map rotEach reduce fliter ’let i in sbs')
    //介绍： 将类的接口转换为客户希望的， 使原来不兼容的的类可以一起工作 （接口转换器）
    //ES6的适配器模式： 适配器只适合三种情况的适配： 库 / 参数 / 数据
        //库适配
            //比如网站要接入数据分析网站的代码统计用户信息， 如这个埋点接口格式 和使用实例如下
            _htm.push(['_trackEvent', category, action, opt_label, opt_value]);
            index.html_hmt.push(['_trackEvent', 'web', 'page_enter', 'position', 'index.html']);
            //如果接入了几十甚至更多个页面里， 然后数据采集平台更换， 新的api如下：
            SafeArray.track(eventName, {attrName: value});
            //可以不用将几十个页面的埋点更改， 只要写一个适配器可以完成所有埋点事件的迁移：
                //app.js
                let _hmt = {
                    push: (arr){
                        const [eventName, attrName, value] = [...arr.splice(2)];
                        let attrObj = {[attrName]: value};
                        sa.track(eventName, attrObj);
                    }
                }
            
            //通过分析两个接口， 发现新的只要三参数， eventName对应action， attrName对应opt_label, value对应opt_value; 用前一个api的全局变量做适配器， push方法取得这需要的三个参数并调用sa.track即可
       
        //参数适配
            //有的情况下， 一个方法可能要传入多个参数， 如果大于3, 建议封装为一个对象， 如
            let arr = {         //String代表参数类型， 前面加个问号表示可选
                brand: String,
                os: String,
                carrier: ? String,
                language: ? String,
                network: ? String
            }

            class SDK {
                phoneStatus(config){        //默认值 
                    let defaultConfig = {
                        brand: null,
                        os: null,
                        carrier: 'china-mobile',
                        language: 'zh',
                        network: 'wifi' 
                    }
                    for (let i in config){  //对于每一个参数， 有用新加入的， 没有用默认的 
                        defaultConfig[i] = config[i] || defaultConfig[i];
                    }
                    //do some thing
                }
            }

        //数据适配  
            //最常见， 用于解决前后端数据依赖， 因为前端一些框架的数据有固定的格式，要对后端的数据格式进行适配）
            //例如网页中有一个使用Echarts折线图对网站每周的uv， 通常后端返回的数据格式如下所示：
                [{
                    "day": "周一",
                    "uv": 6300
                }, {
                    "day": "周二",
                    "uv": 7100
                }, {
                    "day": "周三",
                    "uv": 4300
                }, {
                    "day": "周四",
                    "uv": 3300
                }, {
                    "day": "周五",
                    "uv": 8300
                }, {
                    "day": "周六",
                    "uv": 9300
                }, {
                    "day": "周日",
                    "uv": 11300
                }]
            //但是Echarts需要的x轴的数据格式和坐标点的数据是长下面这样的:

                /*x轴的数据*/     ["周二", "周二", "周三", "周四","周五", "周六","周日"] 
                /*坐标点的数据*/   [6300,  7100,   4300,  3300,  8300,  9300,  11300] 

            //使用适配器将后端返回的数据做适配：    (使用好map rotEach reduce fliter ’let i in sbs')
            function echartXAxisAdapter(res){   /*x轴的数据*/
                return res.map(item => item.day);
            }
            function echartDataAdapter(res){    /*坐标点的数据*/
                return res.map(item => item.uv);
            }

        //适配器模式本质上是一个亡羊补牢的模式， 它解决的是现存的两个接口之间不兼容的问题， 你不应该在软件的初期开发阶段就使用该模式； 如果在设计之初我们就能够统筹的规划好接口的一致性， 那么适配器就应该尽量减少使用。




//代理 
    //介绍： 为避免直接引用， 为其他对象 提供一种代理 以控制对这个对象的访问， 在两个对象之间起到中介的作用
    //代理可以体现两个原则： 单一职责（不同职责都分到对象中， 原对象上进行了功能的衍射又不影响原对象）  开放-封闭（代理随时可以去掉没， 而不用修改代码， 适合各种不停迭代的产品）

    //ES6的代理模式：   提供了Proxy构造函数， 可以轻松使用代理模式：
        var proxy = new Proxy(target, handler);
            //Proxy构造函数传入两参数， target代表要代理的对象， handler对象用来设置对所代理的对象的行为

    //前端常用三种场景代理： 缓存 / 验证  / 私有属性

        //缓存代理 将一些开销大的方法运算结果缓存， 再调用时， 如果参数一致， 就直接返回缓存中的结果 （动态规划）， 如计算四十以上的斐波那契：
            const getFib = (number) => {
                if(number <= 2 ){
                    return 1;
                }else {
                    return getFib(number - 1) + getFib(number - 2);
                }
            };
            //创建缓存代理的工厂函数
            const getCacheProxy = (fn, cache=new Map()) => {    //用Map做缓存保存单独的数据 避免重复保存
                return  new Proxy(fn, {
                    apply(target, context, args){
                        const argsString = args.join(' ');      //将参数‘数字’合并到一个字符串 （数组） 中间间隔空格
                        if(cache.has(argsString)){  //如果有缓存 直接返回缓存
                            console.log(`输出${args}的缓存结果： ${cache.get(argsString)}`);
                            return  cache.get(argsString);
                        }
                        const result = fn(...args);             //将参数都传入getFib
                        cache.set(argsString, result);          //设置将计算的结果和参数存入cache为新数组
                        return result;
                    }
                })
            }
            const getFibProxy = getCacheProxy(getFib);
            getFibProxy(40);
            getFibProxy(40);    //第二次调用时， 直接返回缓存

        //验证代理   
            //Proxy构造函数第二参数中的set方法， 可以很方便的验证向一个对象的传值  也可将其特性用于表单
            //设有一个登录表格， 有两个属性 account  password， 每个属性有一个简单和其属性名对应的验证方法
            const userForm = {
                account(value){     //account只能为中文
                    const re = /^[\u4e00-\u9fa5]^/;
                    return {
                        valid: re.test(value),
                        error: '"account" ia only allowed to be Chinese'
                    }
                },
                password(value){     //密码长度应大于六个字符
                    return {
                        vaild: value.length >= 6,
                        error: '"password" should more than 6 character'
                    }
                }
            }

            //实现Proxy表单验证器
            const getValidateProxy = (target, validators) => {  //用于生成代理对象（userFormProxy）， 根据validators的验证规则进行校验
                return new Proxy(target, {
                    _validators: validators,
                    set(target, prop, value){
                        if(value === ''){       //值为空， 报错并返回false
                            console.error(`"${prop}"is not allowed to be empty`);
                            return target[prop] = false;
                        }
                        const validResult = this._validators[prop](value);  //将validResult保存为来验证的值（？） 
                        if(validResult.valid){  //根据验证结果处理 通过则映射到原对象  
                            return Reflect.set(target, prop, value);
                        }else{                  //否则报错并置空值返回false
                            console.error(`${validResult.error}`);
                            return target[prop] = false;
                        }
                    }
                })
            }
            const userFormProxy = getValidateProxy(userForm, validators);
            userFormProxy.account = '123';
            userFormProxy.password ='he';

        //私有属性  
            //一般都是通过函数作用域中变量实现， 但是影响了可读性，  私有属性是以_下划线开头的， 利用proxy构造函数第二参数的方法可以实现对_开头属性的访问限制
            function getPrivateProps(obj, filterFunc){  //第一参数是被代理对象， 第二参数是过滤访问属性的函数，用于限制对下划线开头属性的访问
                return new Proxy(obj, { //下面重写了get set has getOwnPropertyDescriptor等方法 都是先通过过滤器把私有属性去掉；（通过Reflct映射）
                    get(obj, prop){
                        if(!filterFunc(prop)) {
                            let value = Reflect.get(obj, prop);
                            if(typeof value === 'function'){    //如果访问的是对象方法 要将this指向被代理对象
                                value = value.bind(obj);
                            }
                            return value;
                        }
                    },
                    set(obj, prop, value){
                        if(filterFunc(prop)){
                            throw new TypeError(`Can't set property "${prop}"`);
                        }
                        return Reflect.set(obj, prop, value);
                    },
                    has(obj, prop){
                        return filterFunc(prop) ? false : Reflect.has(obj, prop);
                    },
                    ownKeys(obj){
                        return Reflect.ownKeys(obj).filter(prop => !filterFunc(prop));
                    },
                    getOwnPropertyDescriptor(obj, prop){
                        return filterFunc(prop) ? undefined : Reflect.getOwnPropertyDescriptor(obj, prop);
                    }
                });
            }
            function propFilter(prop){  //过滤器  返回布尔值（是否不包含下划线）
                return prop.indexOf('_') === 0;
            }
            //重写的方法， 原方法作用都是去限制属性私有化， 而如在get中，要注意 判断如果访问的是对象方法 要将this指向被代理对象
            //getPrivateProps调用方法， 并验证其代理提供的访问控制的能力。
            const myObj = {             //设置一个初始的对象 
                public: 'hello',
                _private: 'secret',
                method: function(){
                    console.log(this._private);
                }
            },
            myProxy = getPrivateProps(myObj, propFilter);
            console.log(JSON.stringify(myProxy));   //{"public", "method"}
            for (let prop in myProxy){
                console.log(prop);                  //public， method， method
            }
            myProxy._private = 1;                   //uncaught TypeError: Can 't set property "_private"

            //业务开发时应注意使用场景， 不要在编写对象时就预先猜测是否要用代理模式， 只有当对象功能太复杂/访问受到限制时 才考虑用代理
            

//装饰器            （实现@autobind、 @debounce、 @deprecate）
    //介绍： 向一个对象添加新功能， 但是却不破坏其结构 称为装饰器（Decorator pattern）， 是作为现有的类的一个包装（wrapper）
    //ESnext有一个提案： @开头函数对ES6中的class及其属性/方法进行修饰， 现在要使用， 要配合babel+webpack
    /* 
        //npm安装依赖:
        npm install babel-core babel-loader babel-plugin-transform-decorators babel-plugin-transform-decorators-legacy babel-preset-env
        //配置.babelrc文件 
        {
            "presets": ["env"],
            "plugins": ["transform-decorators-legacy"]
        }
        // 在webpack.config.js中添加babel - loader
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }],
        }
        //VSCode 要在项目根目录下添加以下tsconfig.json文件来组织ts报错。

        {
            "compilerOptions": {
                "experimentalDecorators": true,
                "allowJs": true,
                "lib": ["es6"],
            }
        }
    */

    //@autobind实现this指向原对象  （this很容易丢， 如过解构赋值的方式提取出来类的this指向undefined）
    function autobind(target, key, descriptor){
        var fn = descriptor.value;
        var configurable = descriptor.configurable;
        var enumerable = descriptor.enumerable;
        return {    //返回descriptor
            configurable: configurable,
            enumerable: enumerable,
            get: function get(){    //绑定this
                var boundFn = fn.bind(this);    
                Object.defineProperty(this, key, {  //用defineProperty重新定义该方法
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: boundFn, //将value定义为通过bind绑定后的函数boundFn， 以此实现了this永远指向实例
                })  
                return boundFn;
            }
        }
    }
    class Person{   //加上装饰并调用
        @autobind getPerson(){
            return this;
        }
    }
    let person = new Person();
    let {getPerson} = person;
    console.log(getPerson() === person);    //true

    //@ebounce 实现防抖函数， 即resize/scroll事件，操作DOM/实时Ajax 等触发结束后再作出响应
    function debounce(timeout){
        const instanceMap = new Map();  //在map中将实例化对象作为key  
        return function (target, key, descriptor){
            return Object.assign({}, descriptor, {
                value: function value(){
                    claearTimeout(instanceMap.get(this));   //清除延时器
                    instanceMap.set(this, setTimeout(() => {//设置延时器
                        descriptor.value.apply(this, arguments);    //调用该方法
                        instanceMap.set(this, null);        //先将延时器设置为null （默认值）
                    }, timeout));
                }
            })
        }
    }
    class Editor {  //调用 测试 装饰器
        constructor(){
            this.content = '';
        }
        @debounce(500);
        updateContent(content){
            console.log(content);
            this.content = content;     //后面还有一些消耗性能的操作
        }
    }
        const editor1 = new Editor();
        editor1.updateContent(1);
        setTimeout(() => {
            editor1.updateContent(2);
        }, 400);

        const editor2 = new Editor();
        editor2.updateContent(3);
        setTimeout(() => {
            editor2.updateContent(4);
        }, 600);    
        //打印结果: 1 3 2 4

        //接着实现一个接受数字类型timeout参数的debounce函数
        function debounce(timeout){
            const instanceMap = new Map();  //Map数据结构去实现实例化对象和延时器的映射
            return function(target, key, descriptor){
                return Object.assign({}, descriptor, {
                    value: function value(){
                        clearTimeout(instanceMap.get(this));
                        instanceMap.set(this, setTimeout(() => {
                            descriptor.value.apply(this, arguments);
                            instanceMap.set(this, null);
                        }, tiemout));
                    }
                })
            }
        }
        //再测试：
        class Editor {
            constructor() {
                this.content = '';
            }
            @debounce(500);
            updateContent(content) {
                console.log(content);
                this.content = content;
            }
        }
        const editor1 = new Editor();
        editor1.updateContent(1);
        setTimeout(() => {
            editor1.updateContent(2);
        }, 400);
        const editor2 = new Editor();
        editor2.updateContent(3);
        setTimeout(() => {
            editor2.updateContent(4);
        }, 600);
        //打印结果： 3 2 4
        //上面调用了4次updateContent方法， 打印结果为3 2 4。 1 由于在400ms内被重复调用而没有被打印， 这符合我们的参数为500的预期。

    //@deprecate 实现警告提示，各种库的警告在下个版本弃用 通过在要抛出警告的方法前添加装饰器 比专门到处添加代码好
    function deprecate(deprecatedObj){  //也可以扩展成为日志装饰器@log
        return function (target,key, descriptor){   //deprecate函数接受一个对象参数， 包含info警告 url网址
            const deprecatedInfo = deprecatedObj.info;
            const deprecatedUrl = deprecatedObj.url;
            const txt = `DEPRECATION ${target.constructor.name}#${key}:${deprecatedInfo}. ${deprecatedUrl ? 'See' + deprecatedUrl + 'for more detail' : ''}`;
            return Object.assign({}, descriptor, {
                value: function value(){    //打印警告信息
                    console.warn(txt);
                    descriptor.value.apply(this, arguments);
                }
            })
        }
    }

        //添加并测试装饰器
        class MyLib{
            @deprecate({
                info: 'the methods will be depreacted in next version',
                url : 'http://www.bing.com',
            })
            deprecateMethod(txt){
                console.log(txt)
            }
        }
        const lib = new MyLib();
        lib.deprecateMethod('调用了一个要在下个版本中被移除的方法');