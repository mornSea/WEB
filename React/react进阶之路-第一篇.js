//React简介  
    //React特点： 1）声明式的视图层 采用JSX语法  2）简单的更新流程 只要定义状态/数据发生改变都会自动渲染  3）灵活的渲染实现，通过虚拟DOM（即js对象）   4)高效的DOM操作 因为操作虚拟DOM对象更方便

    //ES6语法： let, const;  =>;  ``;   解构赋值（按一定模式从数组/对象中提取值 赋值给变量）;   ...变量名(rest参数  多余参数);     ...(扩展运算符， rest参数的逆运算)；  class extends;  import  export
       
    //开发环境， node.js  npm/cnpm   webpack  babel  ESlint   IDE    Create React APP(脚手架)

    //第一个React APP:
           npm install -g  create-react-app    //下载脚手架及配套包

        create-react-app my-app                 //创建一个新应用(文件夹)  下面node_modules是安装的依赖模块 package.json定义项目基本信息  public下的index.html是应用的入口页面  src下是项目源代码  

        cd my-app; npm start                    //运行应用    然后可以在浏览器打开http://localhost:3030   可以访问应用

        //编辑my-app/src/app.js     因为入口文件index。js导入了App。js  将它的render方法修改如下： 
        render() {
            return (
                <div className="App">
                    <div className="App-header">
                        <img src={logo}  className="App-logo" alt="logo" />
                        <h1>Welcome to React</h1>
                    </div>
                    <p className="App-intro">
                        Hello World!
                    </p>
                </div>
            );
        }


//React基础
    //JSX  
        //jsx语法： 用来描述（组件）UI的语法          类似js中变量赋值为一据/段标签     使用的标签类型分DOM类（标签首字母小写）和组件类（标签首字母大写）
        const element= <h1>Helleworld</h1>;         //DOM
        const element = <Helleworld /> ;            //组件
        const element = (                           //一段标签用括号
            <div>
                <Helleworld />                      {/*两类标签也可以互相嵌套*/}
            </div>;                                 //最后都要加分号 
        )

        //JS表达式      JSX里用js的方式：将标签中js表达式（单句 表达式 不能多句语句）用花括号包起来（像Vue中的指令），  主要用于标签属性赋值 和 定义子组件
        const element = <MyComponent foo={1+2} />
        const todos = ['item1', 'item2', 'item3'];
        const elemetn = (                           //注意jsx里的js 由于只能是表达式  so 不可以标签里用分号连用表达式   也不可以用if else witch等逻辑控制语句  
            <ul>
                {todos.map(message => <Item key={message + foo} message={message} />)}
            </ul>
        )
        let complete;                               //但是可以用三目运算和和逻辑运算符号替代 逻辑控制语句
        const element = (
            <div>
                {complete ? <CompletedList /> : null}
                {complete && <CompletedList />}
            </div>
        )
        
        //标签属性      DOM支持原属性 但是要改名 如class该为className  onclick改为onClick(事件做了封装 全用驼峰命名)       如是组件类型 可自定义属性名

        //注释          {/* jsx里中这样注释 */}

        //jsx不是必须的  其实所有jsx都会变成 React.createElement(component, props, ...children)

    //组件
        //定义： 将UI拆分成独立可复用的模块   可以用继承自React.Component并定义render方法的类 或者 使用函数来定义
            //PostList.js           使用类定义的PostList组件
            import React, { Component } from "react";
            class PostList extends Component{
                render(){
                     (
                        <div>
                            帖子列表：
                            <ul>
                                <li>ng</li>
                                <li>Vue</li>
                                <li>React</li>
                            </ul>
                        </div>
                    );                          //return 后要有分号
                }
            }
            export default PostList;            //但是仍无法显示 要用React.render()将PostList挂载到页面的DOM节点上

            //index.js
            import React from "react";
            import ReactDOM from "react-dom";   //负责虚拟DOM 到浏览器DOM 的转换
            import PostList from "./PostList";
            ReactDOM.render(<PostList />, document.getElementById("root"));

        //props     对于一些重复的子元素 封装子组件Item 在组件中嵌套调用，   数据仍在PostList   用组件的props属性 把数据传输给子组件Item   props是一个简单结构的对象，包含的属性=组件（作为JSX标签使用）的属性组成
            <User name='react' age='4' address='america' />                 //user组件的声明
            props = {                               //User组件的props结构
                name: 'react',
                age: '4',
                address: 'america'
            }

            //PostItem.js   PostList的子组件
            import React, { Component } from "react";
            class PostItem extends Component{
                render(){
                    const {title, author, date} = this.props;
                    return(
                        <li>
                            <div>{ title }</div>
                            <div>创建人<span>{ author }</span></div>
                            <div>创建时间<span>{ date }</span></div>
                        </li>
                    );
                }
            }
            export default PostItem;

            //PostList.js
            import React, { Component } from "react";
            import PostItem from "./PostItem"

            const data = [                          //假设有常量存储数据
                {title:"ng", author:"A", date:"2017-09-01 10:12"},
                {title:"Vue", author:"B", date:"2017-09-01 10:13"},
                {title:"React", author:"C", date:"2017-09-01 10:14"},

            ];

            class PostList extends Component{
                render(){
                    return (
                        <div>
                            帖子列表：
                            <ul>                    {/* 使用嵌套子组件 */}
                                {data.map(item =>   <PostItem title={item.title} author={item.author} date={item.date} />  )}
                            </ul>
                        </div>
                    );               
                }
            }
            
        //组件的state：  State是组件内部的状态， 反应到UI   组件的构造方法constructor通过this.state定义初始化状态 调用this.setState方法改变状态  随后UI改变
            //PostItem.js           通过State添加点赞的逻辑
            import React, { Component } from "react";
            class PostItem extends Component{   //点赞时的状态类   
                constructor(props){
                    super(props);               //constructor中一定要调用super（）   即调用了React.Component这个class 的constructor方法  完成React组件的初始化
                    this.state = {              //用this.state定义了组件的状态
                        vote: 0
                    };
                }
            }

            handleClick(){                      //点赞逻辑  （事件处理器）
                let vote = this.state.vote;
                vote++;
                this.setState({
                    vote: vote
                });
            }

            render(){
                const {title, author, date} = this.props;
                    return(
                        <li>
                            <div>{ title }</div>
                            <div>创建人<span>{ author }</span></div>
                            <div>创建时间<span>{ date }</span></div>
                            <div>
                                <button         /* 点击事件的响应函数， 会调用this.state更新组件的点赞数*/
                                    onClick={() => {
                                        this.handleClick();
                                    }}
                                    点赞        /* button按钮中的字 */
                                ></button>
                                &nbsp;
                                <span>          {/* 点赞的状态 */}
                                    { this.state.vote }
                                </span>
                            </div>
                        </li>
                    );
            }

        //有状态组件和无状态组件：          有些组件是不需要内部状态变化的（比如PostList）  定义无状态组件除了class 还可以使用函数（组件）
            //函数组件接收props作为参数  返回代表这个组件UI的react元素结构  （props返结构）   so 无状态的组件应首选函数组件
            function Welcome(props){
                 <h1> Hello, {props.name}</h1>;
            }

        //重新设计PostList和PistItem     因为帖子数据会变化 会导致帖子列表数据的变化  + 每个PistList都保持一个vote状态 除此之外其他信息都在PostList 也不合理
            //PostList.js
            import React , { Component } from "react";
            import PostItem from "./PostItem";

            class PostList extends Component{
                constructor(props){
                    super(props);
                    this.state = {              //帖子列表数据定义为PostList组件的一个状态
                        posts: []
                    };
                    this.timer = null;          //定时器
                    this.handlevote = this.handlevote.bind(this);           //手动绑定方法thisd的指向
                }

                componentDidMount(){            //用setTimeOut模拟异步从服务器获取数据
                    this.timer = setTimeOut (() => {                        //componentDidMount生命周期方法中设置延时， 模拟从服务器获取数据
                        this.setState({         //将这些属性合并为一个post对象， 通过props传递给PostItem
                            posts: [
                                {id: 1, title:"react", author:"A", date:"2017-9-1", vote: 0}
                                {id: 2, title:"ng", author:"B", date:"2017-12-1", vote: 1}
                                {id: 3, title:"vue", author:"V", date:"2018-9-1", vote: 4}
                            ]
                        });
                    }, 1000);
                }

                componentWillUnmount(){         //清除定时器
                    if(this.timer){
                        clearTimeout(this.timer);
                    }
                }

                handleVote(id){                 //处理点赞逻辑，并将该方法通过props传递给PostItem
                    //据id过滤，找待修改vote的帖子， 返回新的posts对象
                    const posts = this.state.posts.mat(item => {
                        const newItem = item.id === id ? {...item, vote: ++item.vote} : item;
                        return newItem
                    });
                    
                    //使用新的posts对象设置state
                    this.setState({
                        posts
                    });
                }

                render(){
                    return (
                        <div>
                            帖子列表：
                            <ul>
                                {this.state.posts.map(item =>
                                    <PostItem
                                        post = {item} 
                                        onVote = {this.handleVoet}
                                    />
                                    )}
                            </ul>
                        </div>
                    );
                }
            }

            export default PostList;


            //PostItem.js
            import React from "react";
            function PostItem(Props){           //函数组件（无状态）   据PostList传的post属性改变UI   发生点赞时，调用props.onVote方法将点赞逻辑交给PostList中的handleVote
                const handleClick = ()=>{
                    props.onVote(props.post.id);
                };
                const {post} =props;
                return(
                    <li>
                        <div>{post.title}</div>
                        <div>创建人： <span>{post.author}</span></div>    
                        <div>创建时间： <span>{post.date}</span></div>
                        <div>
                            <button onClick={handleClick}>点赞</button>
                            &nbsp;    <span>{post.vote}</span>   
                        </div>    
                    </li>
                );
            }
            export default PostItem;   

            //这样一来， postitem只关注怎么展示帖子， 数据来源与处理，点赞逻辑全交给有状态的组件postlist


            //属性效验&默认属性  （props 的接口）
                //react有PropType对象， 效验组件属性的类型   （类型：String， Number， Boolen， Function， Object， Array， Symbol， ELement(react元素)，Node（可渲染： 数，字，react元素 及组成的数组））
                import propTypes from  'prop-types';
                class PostItem extends React.Component{
                    //...
                }
                PostItem.propTypes = {          //通过定义一个对象（key是组件属性的名， value是这个属性对应的类型）
                    post: PropTypes.object,
                    onVote: PropTypes.func
                };

                //使用propTypes.object/array  效验时， 对里面的结构/元素类型还是不清除，  so最好使用PropType.shape/arrayOf
                style: propTypes.shape({
                    color: PropTypes.string,
                    fontsize: PropTypes.number
                }),
                sequence: PropTypes.arrayOf(PropTypes.number)

                //如果属性是组件的必须属性，调用isRequired   （PostItem的post onVote都是必须属性）
                PostItem.propTypes = {
                    post : PropTypes.shape({
                        id: PropTypes.number,
                        title: PropTypes.string,
                        author: PropTypes.string,
                        date: PropTypes,string,
                        vote: PropTypes.number
                    }).isRequired,
                    onVote: PropTypes.func.isRequired
                }

                //组件属性默认值  (defaultProps：默认参数)
                function Welcome(props){
                    return <h1 className='foo'> Hello, {props.name}</h1>;
                }
                Welcome.defaultProps = {
                    name: 'Stranger'
                };

            //组件样式：  外部css文件可以通过html页面（所有组件可用）或者当作模块引入（单组件可用）     css属性名驼峰式命名
                //内联css即直接写在js文件的return中作为一个js类  要两个大括号{{//css}}  一个表示是js表达式，一个表示这表达式是个类    
                //style.css
                body{
                    margin: 0;
                    padding: 0;
                    font-family: sans-ServiceUIFrameContext;
                }
                ul{ list-style: none; }
                h2{ text-align: center}

                //PostList.css
                .container {
                    width: 900; 
                    margin: 20px  autho;
                }

                //PostItem.css
                .item{
                    border-top: 1px solid grey;
                    padding: 15px;
                    font-size: 14px;
                    color: grey;
                    line-height: 21px;
                }
                .title{
                    font-size: 16px;
                    font-weight: BeforeUnloadEvent;
                    line-height: 24px;
                    color: #009a61;
                }
                .like{
                    width: 100%;
                    height: 20px;
                }
                .like img{
                    width: 20px;
                    height: 20px;
                }
                .like span{
                    width: 20px;
                    height: 20px;
                    vertical-align: middle;
                    display: table-HTMLTableCellElement;
                }

                //其中style.css放public目录下   PostList.css 和 PostItem.css放src文件夹下  create-react-app将public下的可在html中直接引用   而两个模块配套css是以模块方式导入

                //点赞按钮的图标  作为模块导入
                //PostList.js
                import React from "react";
                import "./PostItem.css";
                import like from "./images/like-default.png";           //引入图标

                function PostItem(props){
                    const handleClick = ()=>{
                        peops.onVote(props.post.id);
                    };

                    const {post} = props;
                    return (
                        <li className="item">
                            <div className="title">
                                {post.title}
                            </div>
                            <div>
                                创建人： <span>{post.author}</span>
                            </div>
                            <div>
                                创建时间： <span>{post.date}</span>
                            </div>
                            <div  className="like">
                                <span> <image src={like}  onClick={handleClick} /> </span>
                                <span>{post.vote}</span>
                            </div>
                        </li>
                    );
                }
                export default PostItem;

            //组件和元素  元素是js对象，这个对象通过DOM/组件描述界面  jsx是用来创建元素的    组件是一个class/function， 接收属性返回react元素，   组件是由n个元素组成的
                //Button是一个组件
                class Button extends React.Component {
                    render(){
                        return (<button>OK</button>);
                    }
                }
                
                //jsx中使用Button， button是一个代表组件Button的元素
                const button = <Button />;

                //组件page中使用元素button
                class Page extends React.Component {
                    render(){
                        return(
                            <div>
                                {button}
                            </div>
                        );
                    }
                }

                //上面的写法等同于：
                class Page extends React.Component{
                    render(){
                        return (
                            <div>
                                <Button />
                            </div>
                        );
                    }
                }

            //组件生命周期 ：
                /* 
                挂载
                    1.constructor   即es6  class构造方法 可以初始化组件state 绑定事件处理方法     可以从父组件传入属性对象 作为构造函数接收的props参数（先调用super(props)才能保证props被传入）
                    2.componentWillMount  挂载前调用 只调用这一次   很少用  
                    3.render  定义组件 唯一必要方法，根据props和state返回一个React元素（通常由JSX定义），  它返回一个UI的描述， 由React负责渲染为DOM    且render为纯函数， 不能在其中调用this.setState
                    4.componentDidMount 组件挂载到DOM后调用， 只调用这一次   依赖DOM的操作可以放到这个方法中， 还可以向服务器请求数据   调用this.setState引起组件重新渲染

                更新
                    1.componentWillReceiveProps(nextProps)  props引起组件更新时被调用， 参数nextProps是父组件传给这个组件的新props  并与当前this.props比较确定是否重新渲染等逻辑 不要在此时调用setState
                    2.shouldComponentUpdate(nextProps, nextState) 决定组件是否继续执行更新， 返回true继续，返回false后面的更新方法不会被调用  和现在的state props比较，可由此减少不必要渲染 不要调用setState
                    3.componentWillUpdate(nextProps, nextState)  render调用前执行， 可在此执行一些更新前执行的工作， 一般少用  不要在此时调用setState
                    4.componentDidUpdate(prevProps. prevState)  组件更新后调用， 操作更新后DOM的地方， 两个参数表示更新前的props state
                 
                卸载
                    1.componentWillUnmount  卸载前调用， 执行一些清理工作（如定时器，componentDidMount手动创建的DOM，，，）  避免内存泄漏    （函数组件没有生命周期）
                */

            //列表和keys
                //一般在组件中渲染列表数据（props）是非常常见的， react使用key属性标注列表中每个元素， 数据变化是通过key知道哪个发生变化并更新
                    //使用列表数据id为key  如帖子id为PostItem的key
                    //... 
                    render(){
                        return(
                            <div className="container">
                                <h2>帖子列表</h2>
                                <ul>
                                    {this.state.posts.map(item =>  
                                        {/*id赋值给key 作为唯一标识*/}
                                        <PostItem 
                                            key ={item.id}
                                            post = {item}
                                            onVote = {this.handlevote}
                                        />
                                        
                                        )}
                                </ul>
                            </div>
                        );
                    }

                    //如果没有id  也可以用元素在列表中的位置索引index作为key值   但是重排时索引页会变化
                    //...
                    {this.state.posts.map((item, index) =>
                        <PostItem 
                            key = {index} 
                            post = {item}
                            onVote = {this.handlevote}
                        />
                        )}

                //事件处理   事件命名要用驼峰， 响应函数对象形式赋值给事件属性   react的事件是合成事件，在react是用事件对象的preventDefault而非事件函数返回false阻止默认行为
                <button onClick={clickButton}>
                    Click
                </button>      
                    //事件处理函数的三种写法：
                    //1.箭头函数：
                    class MyComponent extends React.Component{
                        constructor(props) {
                            super(props);
                            this.state = {number: 0};
                        }

                        render(){       //因为箭头函数中的this指向函数定义时的对象 即总是指向当前组件的实例对象     这种逻辑写在事件大括号只适合事件和逻辑都不多时
                            return(
                                <button onClick={(event) => {console.log(this.state.number);}}>
                                    Click
                                </button>
                            );
                        }
                    }

                    //1.2逻辑封装为组件的一个方法  箭头函数中调用
                    class MyComponent extends React.Component {
                        constructor(props){
                            suprt(props);
                            this.state= {number: 0};
                        }

                        handleClick(evetn){
                            const number = ++this.state.number;
                            this.setState({
                                number: Number
                            });
                        }

                        render(){               //直接在render中为元素事件定义事件函数，每次render调用时都会重新创建  带来性能开销 
                            return (
                                <div>
                                    <div>{this.state.number}</div>
                                    <button onClick={(event) => {this.handleClick(event);}}>
                                        Click
                                    </button>
                                </div>
                            );
                        }
                    }

                    //使用组件方法： 将组件的方法赋值给元素的事件属性 并在类的构造函数中 将这个方法的this绑定到当前对象
                    class MyComponent extends React.Component{
                        constructor(props){
                            super(props);
                            this.state = {number:0};
                            this.handleClick = this.handleClick.bind(this);         //一个尚可  多个事件函数绑定非常繁琐
                        }

                        handleClick(event){     
                            const number = ++this.state.number;
                            this.setState({
                                number: Number
                            });
                        }

                        render(){
                            return(
                                <div>
                                    <div>{this.state.number}</div>
                                    <button onClick={this.handleClick}>
                                    {/* 另一种写法，每次render会创建一个新函数  但可帮处理函数传递额外参数： 
                                    <botton onClick={this.handleClick.bind(this)}> Click </botton>  */}
                                        Click
                                    </button>
                                </div>
                            );
                        }
                    }
 
                    //3.属性初始化语法      ES7的property initializers会自动为class中定义的方法绑定this
                    class MyComponent extends React.Component{
                        constructor(props){
                            suprt(props);
                            this.state = {number: 0};
                        }

                        handleClick = (event)=>{    //ES7的属性初始化语法  也是使用了箭头函数
                                const number = ++this.state.number;
                                this.setState({
                                    number: number
                                });
                            }

                            render(){
                                <div>
                                return(
                                    <div>{this.state.number}</div>
                                    <button onClick={this.handleClick}>
                                        Click 
                                    </button>
                                </div> 
                                );
                            }
                        }
                    
                    //表单     react的表单元素自身维护一些状态（即值由react管理），   其中有些如input根据用户输入改变显示  而不是从组件状态中获取  这种叫非受控组件
                        //受控组件：
                            //1.文本框（input/textarea）     通过表单元素value设置表单元素的值  通过onChange监听值的变化  变化同步到组件的state
                            class LoginForm extends React.Component{
                                constructor(props){
                                    super(props);
                                    this.state = {name: '', password: ''};
                                    this.handleChange = this.handleChange.bind(this);
                                    this.handleSubmit = this.handleSubmit.bind(this);
                                }

                                handleChange(event){        //监听用户名 密码 这两个input值的变化
                                    const target = event.target;
                                    this.setState({[target.name]: target.value});       //  通过分别指定input不同的name属性，用同一个函数即可处理不同input的值变化 （根据元素name属性区分事件来源） 
                                }

                                handleSubmit(event){        //表单提交的响应函数
                                    console.log("login successfully");
                                    event.preventDefault();
                                }

                                render(){
                                    return(
                                        <form onSubmit={this.handleSubmit}>
                                            <lable>
                                                用户名：
                                                {/* 通过value设置input显示内容 通过onChange监听value变化 */}
                                                <input type="text" name="name" value={this.state.password} onChange={this.handleChange} />
                                            </lable>
                                            <lable>
                                                密码：
                                                <input type="password" name="password" value={this.state.password}  onChange={this.handleChange} />
                                            </lable>
                                            <input type="submit" value="登陆" />
                                        </form>
                                    );          //   更改 =》 onChange =》 变化同步到state  =》 新state触发重新渲染  
                                }
                            }

                            //2. 列表     在selected上定义value属性定义哪个option被选中 （只要修改selected）
                            class ReactStackForm extends React.Component{
                                constructor(props){
                                    super(props);
                                    this.state = {value: 'mobx'};
                                    this.handleChange = this.handleChange.bind(this);
                                    this.handleSubmit = this.handleSubmit.bind(this);
                                }

                                handleChange(event){        //监听下拉列表变化
                                    this.setState({value: event.target.value});
                                }

                                handleSubmit(event){        //表单提交响应
                                    alert("you picked " + this.state.value);
                                    event.preventDefault();
                                }

                                render(){
                                    return(
                                        <form onSubmit={this.handleSubmit} >
                                            <lable>
                                                pick on library:
                                                {/* 被选中 = selected的value属性 */}
                                                <select value={this.state.value} onChange={this.handleChange}>
                                                    <option value="react"></option>
                                                    <option value="redux"></option>
                                                    <option value="MobX"></option>
                                                </select>
                                            </lable>
                                            <input type="submit" value="Submit" />
                                        </form>
                                    )
                                }
                            }

                            //3. 单/复选框   复选框为checkbox类型的input  单选框为radio类型input  它们的值不变 改变的是checked状态
                            class ReactStackForm extends React.Component{
                                constructor(props){
                                    super(props);
                                    this.state = {react: false, redux: false, mobox: false};
                                    this.handleChange = this.handleChange.bind(this);
                                    this.handleSubmit = this.handleSubmit.bind(this);
                                }

                                handleChange(event){        //监听复选框变化  设置checked状态   同上（根据元素name属性区分事件来源）
                                    this.setState({ [event.target.name]: event.target.checked });       
                                }

                                handleSubmit(event){        //表单提交响应
                                    event.preventDefault();
                                }

                                render(){
                                    return(
                                        <form onSubmit={this.handleSubmit}>
                                            {/* 三个复选框  点击一个后它checked的值被hanldeChange改变为state*/}
                                            <label>
                                                React
                                                <input 
                                                    type="checkbox" 
                                                    name="react" 
                                                    vlaue="react" 
                                                    checked="this.state.react" 
                                                    onChange={this.handleChange} 
                                                />
                                            </label>
                                            <label>
                                                Redux
                                                <input 
                                                    type="checkbox" 
                                                    name="redux" 
                                                    vlaue="redux" 
                                                    checked="this.state.redux" 
                                                    onChange={this.handleChange} 
                                                />
                                            </label>
                                            <label>
                                                MobX
                                                <input 
                                                    type="checkbox" 
                                                    name="mobx" 
                                                    vlaue="mobix" 
                                                    checked="this.state.mobox" 
                                                    onChange={this.handleChange} 
                                                />
                                            </label>
                                            <input type="submit" value="Submit" />
                                        </form>
                                    )
                                }
                            }


                            //PostItem.js     通过这些表单知识修改 
                            class PostItem extends Component{
                                constructor(props){
                                    super(props);
                                    this.state = {editing: false, post: props.post};
                                    this.handleVote = this.handleVote.bind(this);
                                    this.handleEditPost = this.handleEditPost.bind(this);
                                    this.handleTitleChange = this.handleTitleChange.bind(this);
                                }

                                componentWillReceiveProps(nextProps){           //父组件更新post后  更新postItem的state
                                    if(this.props.post != nextProps.post){
                                        this.setState({post: nextProps.post});
                                    }
                                }

                                handleVote(){                                   //点赞逻辑
                                    this.props.onVote(this.props.post.id);
                                }

                                handleEditPost(){                               //保存/编辑  （按钮点击后）逻辑
                                    const editing = this.state.editing;
                                    if(editing){                                //编辑中， 调用父组件传递的onSave保存
                                        this.props.onSave({
                                            ...this.state.post,
                                            date: this.getFormateDate()
                                        });
                                    }
                                    this.setState({
                                        editing: !editing
                                    });
                                }

                                handleTitleChange(event){                       //处理标题textarea变化
                                    const newPost = {...this.state.post, title: event.target.value};
                                    this.setState({ post: newPost });
                                }

                                getFormateDate(){
                                    //...
                                }
                                
                                render() {
                                    const {post} = this.state;
                                    return (
                                        <li className="item">
                                            <div className="title">
                                                {this.state.editing  
                                                    ?<form>
                                                        <textarea value={post.title} onChange={this.handleTitleChange} />
                                                    </form>
                                                    : post.title
                                                }
                                            </div>

                                            <div>
                                                创建人： <span>{post.author}</span>
                                            </div>
                                            <div>
                                                创建时间： <span>{post.date}</span>
                                            </div>
                                            <div className="like">
                                                <span> <img alt="vote" src={like} onClick={this.handleVote} /> </span>
                                                <span>{post.vote}</span>
                                            </div>

                                            <div>
                                                <button onClick={this.handleEditPost} >
                                                    {this.state.editing ? "保存"  : "编辑"}
                                                </button>
                                            </div>
                                        </li>
                                    );          //点击“编辑” 帖子标题使用textarea展示， 可以编辑，  点“保存” 用onSave调用父组件handleSave 将更新后的post保存到PostList的State
                                }
                            }

                            //PostList.js
                            class PostList extends Component{
                                //...

                                handleSave(post){                               //保存帖子
                                    const posts = this.state.posts.map(item => {//根据目前item的id 和子组件传递上来的post的id 过滤出要更新的id
                                        const newItem = item.id===post.id?post:item;
                                        return newItem;
                                    })
                                    this.setState({posts});
                                }

                                render(){
                                    return(
                                        <div className="container">
                                            <h2>帖子列表</h2>
                                            <ul>
                                                {this.state.posts.map(item => 
                                                    <PostItem 
                                                        key={item.id} 
                                                        post={item}
                                                        onVote={this.handleVote} 
                                                        onSave={this.handleSave}
                                                    /> 
                                                )}
                                            </ul>
                                        </div>
                                    )
                                }
                            }

                        
                        //非受控组件        （不用给每个表单元素定义onChange 并更改同步到state）  使用react特殊属性ref获取元素的值（通过引用DOM/组件的实例）
                        class SimpleForm extends Component{
                            constructor(props) {
                                super(props);
                                this.handleSubmit = this.handleSubmit.bind(this);
                            }

                            handleSubmit(evetn){                //通过this.input获取input元素值
                                alert("the title you submitted was " + this.input.value);
                                event.preventDefault();
                            }

                            render(){
                                return(
                                    <form onSubmit={this.handleSubmit}>
                                        <lable>
                                            title: {/* ref将this.input指向当前的input元素   这样 handleSubmit 中this.input.value就是input元素的value*/}
                                            <input type="text" ref={(input) => this.input = input} />
                                        </lable>
                                        <input type="submit" value="Submit" />
                                    </form>
                                );                              //非受控组件通常要设置默认值 但由于无法控制表单元素的value so不好设置 定义了值也无法确保正确性
                            }
                        }

                            //使用defaultValue指定默认值：          (配套的还有defaultChecked 用于单/复选框)
                            render(){
                                return(
                                    <form onSubmit={this.handleSubmit}>
                                        <lable>
                                            title:
                                            <input 
                                                defaultValue="something" 
                                                type="text" 
                                                ref={(input) => this.input=input} 
                                            />
                                        </lable>
                                    </form>
                                )
                            }













