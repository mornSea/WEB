//一、工作原理：    
    /* 
    React：
        将UI拆解为组件： 并且每个组件只负责一件事 
        交互式UI ：每个组件里有内部状态， 逻辑， 事件处理器   根据状态改变 重新渲染视图
        两种类型的数据‘模型’： 属性（静态数据， 绝大部分使用这种） || 状态（动态， 只有修改组件自身特性时使用）
    React Native:
        原生代码与js通过桥接层进行交互 这个过程是个异步 批量 串行的

        原生（  事件 ==》收集数据并向js传递         ||||||         处理命令 ==》  更行UI       ）
        
        桥              |                                               ↑
        接              |                                               |
        层              ↓                                               |

        js （        处理事件                       ===》            调用原生方法             ）


        运行过程：
            启动 加载js打包文件， 专用打包工具会像webpack一样把代码和依赖全打包为单个文件
            同时 React Native加载原生模块  一旦有一个加载完就在桥接层注册， 桥接层确认 应用知道此模块可使用
            启动js虚拟机 即运行js的环境  

            加载json配置文件 （里面包含模块数组， 常量导出模块， 模块的方法） js读取它 并在执行环境里创建对象
            执行js打包文件 创建shadow视图来渲染应用的布局 （负责计算布局的独立线程叫shadow队列） shadow队列包flexbox的属性转换为绝对位置/大小
            同时创建原生视图渲染应用        结合原生视图和shadow  将应用渲染到屏幕上
     */




//二、第一个react native应用
    /* 
    JSX（js语法扩展）：
        react里 在render方法里用jsx代替js函数， 看似xml 但是编码更方便   
        它包括标签名， 特性， 子元素    除非被引号包围，否则花括号里的值是封闭的js表达式

        <div prop="someText">children</div>;            //有引号的标签语言，，，，，，
                ↓ 编译为js 后  ↓ 
        React.reacteElement("div", {prop: "someText"}, "children");

    细谈属性/状态：
        属性 是父组件向子组件传递数据的方式： 为子组件指定属性并赋值后 子组件通过this.peops.propName的方式访问这些值但是子组件无权直接修改属性（组件属性基本不可变）

        状态 是表示应用/组件的状态  是可变和私有的  也可以自己修改  通过组件内部的setState（）修改
    */
        //例子：       为一个自定义组件 传递title属性并渲染  
            <Header title="hello wotld !" /> 

            //组件可根据this.props.title访问title属性
            Class Header extends Component {            //类header   继承（extends）自    组件类（component）
                render(){
                    return (
                        <view>
                            <Text>{this.props.title}</Text>
                        </view>
                    );
                }
            }

            //添加一个事件 如输入/网络请求  以使用组件的状态  完成一个简单的计数器
            Class Counter extend Component {            //一个计数器类  （一个组件  可以是单页/应用  或者只是某个部分）
                constructor(props){
                    super(props);
                    this.state = {                      //初始化count  因为是唯一个状态 so直接赋值为this.state
                        count: 0
                    };
                }
                componentDidMount(){                    //生命周期方法： componentDidMount即所有组件都挂载后（即render（）执行后）  执行
                    setInterval(() => {                 //隔多久执行一次的时间函数
                        this.setState({
                            count: this.state.count + 1 
                        })
                    }, 1000);                           //即每一秒加一     这样状态改变 调用render（） 重新渲染UI
                }
                render(){
                    return (                            //只返回一个包含（值为this.props.count的Text组件）的viwe组件   即只重新渲染数字
                        <view>
                            <Text>{this.props.count}</Text>
                        </view>
                    );
                }
            }

    /*
    生命周期：
            componentWillMount：        首次渲染前调用   
            componentDidMount：         首次渲染后调用   发起网络请求/更新状态  常用于集成其他js框架和异步函数
            componentWillReactiveProps：属性改变调用（首次初始化不算）   
            shouldComponentUpdate：     判断是否执行render 默认true  如果想更新状态/属性不渲染组件 在方法中返回false   
            componentWillUpdate：       重新渲染前调用   
            componentDidUpdate：        重新渲染后调用   
            componentWillUnmount：      组件卸载前调用   
    */        
    //样式（没有CSS 用js的StyleSheet对象声明）：
        var styles = StyleSheet.create({        //这个StyleSheet.creat（）不是必要的  但是用了它 参数值不可见 不可改   样式要写在尾部可避免多次创建
            background: {
                backgroundColor: '#333333',
            },
            active: {
                borderWidth: 2,
                borderColor: '#00ffee',
            },
        });
    
        //所有核心组件都接收一个样式属性 和 一组样式：
        <Text style={styles.active} /> 
        <View style={[style.active, style.background]} />       //如数组里有同名  靠右的优先级高 

        //flexbox 有三个主要属性：
        /*  direction： 按水平/垂直方向排列  又叫主轴方向
            justify-content:  根据主轴方向对页面对齐 有五种值：
                flex-start/end：        全对齐主轴开始 / 结束位置
                center：                主轴居中
                space-between/around：  等间距 / 前后（浏览器框）相邻（其他组件）都有空间   
            align-items: 副轴(垂直主轴)上对齐  有四值：
                flex-start/end：        对齐副轴起始 / 结束位置
                center：                副轴上居中
                stretch：               拉伸元素尺寸来填满副轴长度
        */

    //触摸事件： 通过TouchableHighlight / TouchableOpacity 两个抽象实现的组件实现  它们包装视图 提供视觉反馈  另一个组件TouchableWidthoutFeedback也可以 但是不提供视觉反馈
    //被点击时  调用_onPressButton函数，  （像事件处理器）
    <TouchableHighlight onPress="this.onPressButton">                              
        <Text>Press me</Text>
    </TouchableHighlight>

    //网络   通过网络的腻子脚本库（polyfill）与服务器交互  有三种方法： fetch发起http请求 / WebSocket全双工通信 / XHR 即Ajax
        //最普遍的是fetch：  (GET)
        fetch('https://httpbin.org/get')                //fetch返回一个Promise
            .then((response) => response.json())        //解析为json
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.warn(error);
            });
            //fetch使用  ES7 的async / await特性：
            Class MyCoMponent extends React.Component{
                //...
                async getData(){
                    try{
                        let response = await fetch('https://httpbin.org/get');
                        let responseJson = await response.json();
                    } catch (error){
                        //...
                        console.error(error);
                    }
                }
                //..
            }


    //深度链接   使用linking组件   手机浏览器中url打开应用
        //有时帮用户通过用户身份验证 （使用OAuth开放授权协议）    第一次/重新安装app时登陆后会返回令牌给应用，  每次访问服务器都会带上这个令牌（cookie ？）
        //首先得到一个注册应用的客户端ID和密钥  登陆时把用户重定义到验证页面 并在url参数中附带客户端ID 及重定义url
        //一旦用户登陆成功， 服务器会带用户到指定的重定向url（比如是这个页面自己的登陆/绑定成功显示页）  并带上令牌，   
        //此时深度链接可以让重定义url直接打开应用   （先检测  如果有安装， 一般会询问是否打开xxx）  通过统一资源定位符指向应用内具体位置 而非只是打开url
        
        //android   在manifest文件添加intent filter过滤器
        <intent-filter android:label="@string/filter_title_viewgizmos">
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <!--接受以http://www.example.com/gizmos  开头的url-->
            <data android:scheme="http" 
                  android:host="www.example.com"
                  android:pathPrefix="/dizmos" />           <!--必须要以/开头-->
            <data android:scheme="example"
                  android:host="gizmos" />
        </intent-filter> 

        //IOS 要编辑AppDelegate.m文件  当应用通过外部的url启动时 可以使用Linking组件获取url并处理
        componentDidMount(){
            var url = Linking.getInitialURL().then((url) => {
                if(url){
                    console.log('initial url is :' + url);
                }
            }).catch(err => console.error('An error occurred ', err));
        }

    //动画   内置两套动画系统： LayoutAnimation（全局 对下一次渲染过程的所有变化应用） / Animated（拥有丰富的选项 应用在特定组件上）
    Class SampleApp extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                fadeAnim : new Animated.Value(0),                   //声明并初始化新状态 fadeAnim/2
                fadeAnim2: new Animated.Value(0)
            };
        }

        componentDidMount(){                                        //首次渲染后才开始定义这些
            Animated.timing(this.state.fadeAnim, {                  //像计时器一样的timing（）函数   定义一段事件的动画  传入动画值，最终值， 时长， 延期，，，，，
                toValue: 1,
                duration: 1000
            }).start();
            Animated.timing(this.state.fadeAnim2, {
                toValue: 1,
                delay: 1000,
                duration: 1000
            }).start();
        }

        render(){
            return {                            //return的都是View组件包围的（ 将fadeAnim状态附加到Animate.Text的不透明度 -字体淡入 ）
                <View style={style.container}>
                    <Animate.Text style={styles.welcome, {opacity: this.state.fadeAnim}}>
                        Welcome to the react native !
                    </Animated.Text>
                    <Animate.Text style={styles.welcome, {opacity: this.state.fadeAnim}}>
                        Im felling lucky..
                    </Animated.Text>
                </View>
            }

        }
    }

    //调试与热模块重载
        //手机上的chrome有远程js选项  运行你写的js 并用手机chrome上的调试工具调试代码 可以在代码里用console打印值调试 
        //0.22版本 facebook的热模块重载是指运行状态下 注入编辑过的文件避免状态丢失

    //应用监控：
        //性能监控器  提供一个面板 遮罩在应用界面上， 显示性能相关数据  
            //RAM：进程使用内存   JSC：js核心堆内存大小   Views拥有及显示的视图数  UI：主线程帧率  Javascript：js线程帧率  
            //如js线程帧率出现明显的下跌 代表js运行很慢 这时要用Systrace 工具   /   CPU分析器 
            //Systrace 在代码里添加代码标记 获取性能数据



    //动手  
        //先用npm安装react-native-cli， 通过react-native init movies初始化一个新项目
       //实例应用： 
            //自动生成的代码：导入要继承的类， 还有要使用的通用组件， 库
            import React, { Component } from 'react';
            import{
                AppRegistry,
                StyleSheet,
                Text,
                View
            }   form 'react-native';

            //用import导入组件的例子：
            Class movies extends Comment{
                render() {
                    return (
                        <View style={styles.contaniner}>
                            <Text style={styles.welcome}>
                                welcome to readct Native
                            </Text>
                            <Text style={styles.instructions}>
                                To get started, edit index.ios.js
                            </Text>
                            <Text style={styles.instructions}>
                                Press cmd+r to reload , {'\n'}
                                cmd+d or shake for dev menu
                            </Text>
                        </View>
                    );
                }
            }
            //创建样式表对象  即在styleSheet。create里传入一个json  里面是css语句/类   返回的就是样式表对象
            const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContnt: 'center',
                    alignItem: 'center',
                    backgroundColor: '#F5FcFF',
                },
                welcome: {
                    fontSize: 20,
                    textAlign: 'center',
                    margin: '10',
                },
                instructions: {
                    textAlign: 'center',
                    color: '#333333',
                    matginBottom: 6
                },
            });
            //（注册）AppRegistry为react-native提供js代码入口  （把movies组件暴露给应用原生系统）
            AppRegistry.registerComponent('movies', () => movies);




        //开始编写：
            //一开始只有一个路由， 指向搜索界面 （即主路由）    用Navigator搭建路由
            //reactnative的导航基于栈， 完整的路由历史存储为数组， 导航到新的路由时， 这个路由被推入数组， 返回时再弹出， 
            
            //index.ios.js
            import React, { Component } from 'react';
            import{
                AppRegistry,
                Navigator,
            }   form 'react-native';

            import Main from './components/main'
            Class movies extends Comment{
                renderScene(route, navigator) {                                             //根据指定的路由渲染对应的界面
                    if(route.id === 'Main')                                                 //判断路由id是否为Mian  如是 返回Main组件
                    return <Main navigator={navigator} />;
                }

                render(){
                    return (
                        <
                            Navigator style={{flex: 1}}
                            initialRoute={{id: 'Main', title: 'Search Movies'}}
                        >            //用navigator的 initialRoute属性 设置主路由
                    );
                }
            }
            AppRegistry.registerComponent('movies', ()  => movies);

            //再独立的components目录下的 单独Mian组件文件  mian.xxx   类似于小程序的主界面
            import React, {Component} from 'react';
            import {
                StyleSheet,
                Text,
                View,
            } from 'react-native';

            export default class main extends Component{
                render(){
                    return (
                        <View style={styles.contaniner}>
                            <Text style={styles.welcome}>
                                welcome to react native
                            </Text>
                        </View>
                    );
                }
            }
            const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContnt: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F5FCFF'
                },
                welcome :{
                    fontSize: 24,
                    textAlign: 'center',
                    margin: 10
                }
            });

            //添加两个组件 TextInput搜索框  ListView渲染结果列表  （现在先放在一个文件里  之后 每个组件以单独文件存放）
            export degault calss main extends Comment{
                constructor(props){                     //在构造函数中实例化ListView。DataSource 传入包含两个元素的数组为参数， 
                    super(props);
                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => re !== r2});
                    this.state = {                      //并创造状态
                        dataSource: ds.cloneWithRows(['first item', 'second item']),
                    }
                }

                renderRow(row){                         //这个方法用于渲染视图每一行： 可被根据数据数量  迭代生成子组件
                    return (
                        <View style={styles.listItem}>
                            <Text>{ row }</Text>
                        </View>
                    )
                }

                render(){
                    return(                             //声明ListView  并将状态dataSource赋值给它          也声明TextInput组件 指定样式 基本占位文字
                        <View style={styles.container}>
                            <TextInput                  
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}} 
                                onChangeText={(Text) => this.setState({ text })}                            //当搜索框发生变化时 这个事件调用里面的匿名方法（调用setState函数）
                                placeholder='Enter search keyword' 
                            />

                            <ListView       
                                dataSource={this.state.dataSource} 
                                renderRow={this.renderRow}
                            />
                        </View>
                    );
                }
            }

            const styles = StyleSheet.create({
                container:{
                    flex: 1, 
                    justifyContnt: 'center', 
                    backgroundColor: '#f5fcff', 
                    marginTop: 35
                },
                listItem: {
                    margin: 10
                }
            });

            //与服务器后端通信
            import React,{Comment} from 'react';
            import{
                StyleSheet,
                Text,
                View,
                ListView,
                TextInput,
                Image
            } from 'react-native';
            import {debounce} from 'lodash';

            export default class main extends Component{
                constructor (props){
                    super(props);
                    const ds = new ListView.dataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.state  = {
                        dataSource: ds.cloneWithRows([])
                    }
                    this.searchMovies = this.searchMovies.bind(this);
                }
                    
                searchMovies = debounce(text => {                           //查询API的方法  本身也是调用了时间循环函数 （每半秒）
                    fetch('http://www.omdapi.com/?s=' + text)               //输入文本时 （每半秒）  直接调用API获取匹配的电影 （发起get 字符串放查询字符位置）                      
                        .then((response) => respoonse.json())               //前面的： 获取返回json，  解析， 
                        .then((responseData) => {
                            if('Search' in responseData) {                  //解析后的回应json里找search键值对  打印出来， 判断是否是之前的搜索参数
                                console.log(responseData.Search);
                                const ds = new ListView.dataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                                this.setState({                             //设置状态 datasource的值为  用数组替换的 搜索键值对  （列表）
                                    dataSource: ds.cloneWithRows(responseData.Search)
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }, 500);                                                    //这里使用了第三方库lodash  从中导出debounce  一般都将搜索之类的回调放在节流函数debounce里 避免回调的频繁触发  设置时间 像setTiameout一样                                       

                renderRow(row){                         
                    return (
                        <View style={styles.listItem}>
                            <Image sourve={{url: row.Poster}} style={styles.poster} />
                            <View style={{flex: 1}}>
                                <Text style={styles.title}>{ row.title }</Text>
                                <Text style={tyles.subHeading}>{ row.Type } - { row.Year }</Text>
                            </View>
                        </View>
                    )
                }

                render(){
                    return(
                        <View style={styles.container}>
                             <TextInput                  
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}} 
                                onChangeText={this.searchMovies}                            //这一行改变了  把查询字符串的方法绑定到onChangeMovies属性上
                                placeholder='Enter search keyword' 
                            />

                            <ListView       
                                dataSource={this.state.dataSource} 
                                renderRow={this.renderRow}
                            />
                        </View>
                        </View>
                    );
                }
            }

            const styles = StyleSheet.create({
                container:{
                    flex: 1, 
                    justifyContnt: 'center', 
                    backgroundColor: '#f5fcff', 
                    marginTop: 35
                },
                listItem: {
                    flexDirection: 'row',
                    alignItems: 'center', 
                    margin: 10
                },
                poster: {
                    height: 75,
                    width: 50
                },
                title: {
                    margin: 5,
                    fontSize: 15
                },
                subHeading: {
                    margin: 5,
                    fontSize: 12
                }
            });

            //添加动画              将列表每行内容抽离成独特的组件 命名ListItem 用它替换主组件的renderRow函数， 
            renderRow(row, sId, Rid){
                return (<listItem row={row} delay={Rid * 50} />)            //添加两个属性： row包含该行的实际数据  delay控制每行动画延迟发生
            }
                //ListItem组件代码
                import React, {Component} from 'react';
                import {
                    StyleSheet,
                    Text,
                    View,
                    Image,
                    Animated
                } from 'react-native';

                export default class listitem extends Component{
                    constructor(props){
                        super(props);
                        this.state = {
                            slideAnim: new Animated.Value(100)              //新状态
                        }
                    }

                    componentDidMount(){                                    //组件挂载后， Animated。Timing先延迟组件属性中指定的时间
                        Animated.timing(this.state.slideAnim, {
                            toValue: 1,
                            duration: 500,                                  //在500毫秒里 将slideAnim的值从100 （上面新状态定义的值） 逐渐减少至0
                            delay: this.props.delay
                        }).start();
                    }

                    render(){                                               //render里声明Animated.View组件  把slideAnim的值赋给marginLeft样式   即渲染时每个ListItem组件的marginLeft从100到0  即连续从右到左划入
                        return(
                            <Animated.View style={{matginLeft:this.state.slideAnim, flexDirection:'row', alignItems:'center'}}>         
                                <Image source={{uri: this.props.row.Poster}} style={styles.poster} />
                                <View style={{flex: 1}}>
                                    <Text style={styles.title}> { this.props.row.Title } </Text>
                                    <Text style={styles.subHeading}>
                                        {this.props.row.Type} - {this.props.row.Year}
                                    </Text>
                                </View>
                            </Animated.View>
                        )
                    }
                }

                const styles = StyleSheet.create({
                    poster: {
                        height: 75,
                        width: 50,
                    },
                    title: {
                        margin: 5,
                        fontSize: 15
                    },
                    subHeading: {
                        margin: 5,
                        fontSize: 12
                    }
                });


            //Android上的做法：  把代码改名为index.android.js 在目录下运行react-native run-android  / 直接在安卓上运行
            //添加原生模块 ：Android / IOS  但这样就没法像上面一样兼容  但可以用跨浏览器浏览器技术：检查并选择模块  例如android的用snackbar组件  IOS就弹个框：
            var {Platform} = React;
            //...
            showMessage(){
                if(Platform.OS === 'IOS'){
                    //提示框
                } else{
                    //自定义的Android snackbar模块
                }
            }

            var styles = StyleSheet.create({
                container: {
                    flex: 1,
                    ...Platform.select({                                    //样式上也是 Platform。select方法接受一个对象参数 根据Platform.OS属性值 返回与当前平台对应的值
                        ios: {
                            backgroundColor: 'lightred', 
                        },
                        android: {
                            backgroundColor: 'lightbule', 
                        },
                    }),
                },
            });

            var Component = Platform.select({                               //根据platform。OS的值  （平台）    返回对应平台的组件
                    ios: () => require('ComponentIOS'),
                    android : () => require('ComponentAndroid'),
            })();
            <Component />;

            //部署
                //打包后 在AppDelegate.m  / MainActivity.java 里加入几行代码注释 便于在本地模拟器中运行  (加上前面的两斜杠)：
                // jdCodeLocation = 
                // [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];

                //IOS  有了Apple开发者账号  用XCode构建及发布  也可以用TestFlight分发IOS应用测试beta版本
                //Android Google开发者账号  对apk文件进行签名 ： 先用keytool生成签名密钥， 复制到android/app目录下， 配置build。gradle使用签名密钥生成APK文件   提交给play store
                signingConfigs{
                    release{
                        storeFile File(RELEASE_STORE_FILE)
                        storePassword RELEASE_STORE_PASSWORD
                        keyAlias RELEASE_KEY_ALIAS
                        keyPassword REKEASE_KEY_PASSWORD
                    }
                }
                buildTypes {
                    release{
                        signingConfig signingConfigs.release
                    }
                }

                //CodePush：这个插件可以让应用的js代码及图片发布到CodePush服务器的  保持同步， 更新应用里打包的js/静态文件， 这样修改了js后 CodePush会自动下载js/静态资源更新  而不用在应用商店下载 （保持了WEB的高效更新）

    //二、原生组件    模块只是一些类 作为UI和原生功能的代理层   原生的组件管理器只是一些方法的集合  设置/改变js组件属性/值时调用  这就是原生层的入口
        //原生组件由两部分组成： ViewManager  实际的UI组件
                //Viewmanager负责在原生层与UI交互，每个原生组件都归一个视图管理器(单例模式)
                Class CustomViewManager extends SimpleViewManager<CustomView> {
                    @Override
                    public String getName();            //返回组件名  在js被引用

                    @Override
                    protected CustomViewInstance (ThemedReactContext context);          //在js层挂React组件时创建customView实例

                    @ReactProp(neme = 'someProp')
                    public void setSomeProp(CustomView customViewInstance, @Nullable String value);         //react组件包含初始值/新值时被调用  参数为实列和属性值
                }
                
                //自定义UI类 CustomView （只要继承）：
                Class CustomView extends View{
                    //...
                }
    