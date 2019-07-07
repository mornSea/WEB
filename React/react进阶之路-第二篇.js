//进阶
    //深入理解组件
        //1。组件state
            //1.1 设计合适的state       要任何UI改变都可以从state反应出 + state所有状态都用于反应UI变化（且无需要计算的中间状态）
                //购物车state错误示范： {purchaseList: [], totalCost: 0}
                //正确示范：  state呈现的状态集分两类数据： 渲染组件使用的数据来源 / 组件展现的判断依据
                class Hello extends React.Component{
                    constructor(props){
                        super(props);
                        this.state={user:'react', display: true}
                    }

                    render(){
                        return (
                            <div>
                                {this.state.display 
                                    ?<h1>Hello, {this.state.user}</h1>
                                    : null
                                }
                            </div>
                        );          
                    }
                }

                //可以用this.{属性名} = 定义一个class属性，是挂载到this下的变量  state，props都是组件的属性   
                //如时钟的计时器要每一秒更新一次组件的state，计时器变量不适合定义到组件state（不代表组件UI状态） 而适合在组件新创建一个普通属性
                class Hello extends React.Component{
                    constructor(props){
                        super(props);
                        this.timer = null;                                      //新建普通属性变量
                        this.state = {date: new Date()}                         //对象 值是初始化过可用于渲染
                        this.updateDate = this.updateDate.bind(this);
                    }

                    componentDidMount(){
                        this.timer = setInterval(this.updateDate, 1000)         //每一秒调用一次this。updateDate
                    }

                    componentWillUnmount(){                                     //销毁组件前把时间函数手动清除
                        clearInterval(this.timer);
                    }

                    updateDate(){                                               //每一秒被调用一次  设置组件状态对象中date的值为新系统时间
                        this.setState({date: new Date()});
                    }

                    render(){
                        return (                                                //将组件状态对象date（的值）转换为字符串
                            <div>
                                <h2>Time is gone</h2>
                                <h1>{this.state.date.toString()}</h1>
                            </div>
                        )
                    }
                }


                //正确修改state：  
                    //state不能直接修改（否则不触发render）而要用setState()    
                    //state的更新是异步的所以react会合并多次操作 可能导致多次操作变一次   可以使用另一个接收函数为参数的setState   
                    this.setState(              //参数箭头函数（前一个状态preStae， 当前最新属性props）
                        (preState, props) => ({
                            counter: preState.quantity + 1;
                        }
                    )
                    //state的更新是个合并的过程  so 修改组件状态时只要传入发生改变的state就行
                    this.state = {title: 'React', content: 'React is an onderful JS library'}
                    this.setState({title: 'Reactjs'});            //修改title只要把titlechuanru
            
                //state不可变对象： （出于 便于调试不用担心对象被修改导致错误 + 性能 的考虑） 分三种： 
                    //基本类型的状态可以直接赋新值    
                    this.setState({count: 1, title: 'React', success: true})
                    
                    //数组类型状态可以用ES6的preState concat/slice/filter/map返回修改后的新数组 
                    this.setState(preState => ({
                        books: preState.books.concat(['React Guide']);
                    }))  
                    
                    //普通对象类型状态使用Object.assgin  / 对象扩展语法   避免直接修改原对象
                    this.setState(preState => ({    //Object.assgin
                        owner: Object.assign({}, preState.owner, {name: 'jason'});
                    }))
                    this.setState(preState => ({    //对象扩展语法(...)
                        owner: {...preState.owner, name: 'jason'};
                    }))

                //1.2 组件和服务器通信      提交数据由UI事件触发 在监听事件的回调中执行向服务器提交数据的逻辑   先说更复杂的获取数据：又根据不同生命周期划分
                    //组件挂载阶段通信   组件挂载+DOM已渲染 最适合调用服务器API
                    //UserListContainer.js   从服务器获取用户列表
                    class UserListContainer extends React.Component{
                        //...
                        componentDidMount(){        //也可以在 componentWillMount 中  但componentDidMount更好
                            var that = this;
                            fetch('/path/to/user-api')
                                .then(function(response){
                                    response.json()
                                        .then(function(data){
                                            that.setState({users: data})
                                        });
                                });
                        }
                    }

                    //组件更新阶段通信    如更新评论/点赞等， 假设在获取用户列表时还要一个参数category（来自props） 好根据职业筛选
                    class UserListContainer extends React.Component{
                        //...
                        componentWillReceiveProps(nextProps){
                            if(nextProps.category !== this.props.category){
                                fetch('/path/to/user-api?category=' + nextProps.category)
                                    .then(function(response){
                                        response.json()
                                            .then(function(data){
                                                that.setState({users: data})
                                            });
                                    });
                            }
                        }
                    }


                //组件间通信           基本都通过props
                    //父子间通信  一般都是由父组件传递数据给子组件  
                    //父组件
                    class UserList extends React.Component{
                        render(){
                            return (
                                <div>
                                    <ul className="user-list">
                                        {this.props.users.map(function(user){
                                            return (
                                                <li key={user.id}>
                                                    <span>{user.name}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )
                        }
                    }
                    
                    //子组件
                    import UserList from './UserList'
                    class UserListContainer extends React.Component{
                        constructor(props){
                            super(props);
                            this.state = {users: []}
                        }

                        componentDidMount(){
                            let that = this;
                            fetch('/path/to/user-api')
                                .then(function(response){
                                    response.json()
                                        .then(function(data){
                                            that.setState({users: data})
                                        });
                                });
                        }

                        render(){
                            return(
                                /* 通过props传递users */
                                <UserList users={this.state.users} />
                            )
                        }
                    }

                    //子组件需要向父组件通信时  父组件通过子组件props 传递子组件一个回调，子组件要改变父组件数据时 调用这个回调
                    //UserList新增 添加新用户功能
                    class UserList extends extends React.Component{
                        constructor(peops){
                            super(props);
                            this.state= {newUser: ''};
                            this.handleChange = this.handleChange.bind(this);
                            this.handleClick = this.handleChange.bind(this);
                        }

                        handleChange(e){
                            this.setState({newUser: e.target.value});
                        }

                        handleClick(){      //通过props调用父组件的方法 AddUser 添加新用户
                            if(this.state.newUser && this.state.newUser.length > 0){
                                this.props.onAddUser(this.state.newUser);
                            }
                        }

                        render(){
                            return(
                                <div>
                                    <ul className="user-list">
                                        {this.props.users.map(function(user){
                                            return(
                                                <li key={user.id}>
                                                    <span>{user.name}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <input onChangge={this.handleChange} value={this.state.newUser} />
                                    <button onClick={this.handleClick}>新增</button>
                                </div>
                            )
                        }
                    }

                    //onAddUser在UserListContainer的实现
                    import UserList from './UserList'
                    class UserListContainer extends React.Component{
                        constructor(props){
                            super(props);
                            this.state={user: []}
                            this.handleAddUser = this.handleAddUser.bind(this)
                        }

                        componentDidMount(){        //申请获取用户数据并更新状态
                            let that = this;
                            fetch('path/to/user-api')
                                .then(function(response){
                                    response.json()
                                        .then(function(data){
                                            that.setState({users: data})
                                        });
                                });
                        }

                        handleAddUser(user){        //新增用户
                            let that = this;
                            fetch('/path/to/save-user-api', {
                                method: 'POST',
                                body: JSON.stringify({'username': user})
                            })
                                .then(function(response){
                                    response.json()
                                        .then(function(newUser){        //将服务器返回的新用户添加到state
                                            that.setState((preState) => ({
                                                users: preState.users.concat([newUser])     /* 用concat连接之前的用户数组和新的用户数组 返回新数组 */
                                            }))
                                        });
                                });
                        }

                        render(){
                            return (                
                                /* 通过props传递 users 和 handleAddUser方法   虽然在代码中没有明确写出 props  但是在这个父组件的构造方法中
                                定义了users和绑定了方法  并在子组件中通过props（继承？）使用users 和 挂载此方法的事件   以此达成父子组件通信*/
                                <UserList users={this.state.users}  onAddUser={this.handleAddUser} />
                            );
                        }
                    }
                    //子组件通过调用props。onAddUser方法将待新增用户传递给父组件的handleAddUser方法执行保存 成功后父组件更新状态users 将最新的用户列表传递给子组件  通信桥梁是通过props传递的数据和回调


                    //兄弟组件通信（包含不统一级别）    要通过状态提升 即将共享的状态保存到最近的共同父组件    （类似DOM事件的冒泡和下传）
                    //UserListContainer 添加子组件UserDetail（详情） 此时 userList 和 UserDetail是兄弟组件  在UserList点击一个用户时UserDetail要及时显示详情 so 把选中用户的currentUser保存到UserListContainer
                    //UserList.js
                    class UserList extends React.Component{
                        constructor(props){
                            super(props);
                            this.state = {newUser: ''};
                            this.handleChange = this.handleChange.bind(this);
                            this.handleClick = this.handleClick.bind(this);
                        }

                        handleChange(e){
                            this.setState({newUser: e.target.value});
                        }

                        handleClick(){          //props调用父组件方法添加用户
                            if(this.state.newUser && this.state.newUser.length > 0){
                                this.props.onAddUser(this.state.newUser);
                            }
                        }

                        handleUserClick(userId){        //通过props调用父组件方法 设置选中的用户
                            this.props.onSetCurrentUser(userId);
                        }

                        render(){
                            return(
                                <div>
                                    <ul className="user-list">
                                        {this.props.users.map((user) => {
                                            return (
                                                <li key={user.id} 
                                                    /* 使用不同样式显示当前用户 */
                                                    className={(this.props.currentUserId === user.id) ? "current" : ""} 
                                                    onClick={this.handleUserClick.bind(this, user.id)}>
                                                       <span>{user.name}</span> 
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <input onChangge={this.handleChange} value={this.state.newUser} />
                                    <button onClick={this.handleClick} >新增</button>
                                </div>
                            )
                        }
                    }

                    //UserDetail.js         没有状态 用函数组件实现
                    function UserDetail(props){
                        return(
                            <div>
                                {props.currentUser 
                                    ?(
                                    <div>用户姓名： {props.currentUser.name}</div>
                                    <div>用户年龄： {props.currentUser.age}</div>
                                    <div>用户联系方式： {props.currentUser.phone}</div>
                                    <div>用户地址： {props.currentUser.address}</div>
                                    )
                                    : ''
                                }
                            </div>
                        )
                    }

                    //UserListContainer.js
                    import UserList from './UserList'
                    import UserDetail from  './UserDetail'

                    class UserListContainer extends React.Component{
                        constructor(props){
                            super(props);
                            this.state = {users: [], currentUserId: null}
                            this.handleAddUser = this.handleAddUser.bind(this);
                            this.handleSetCurrentUser = this.handleSetCurrentUser.bind(this);       
                        }

                        componentDidMount(){
                            let that = this;
                            fetch('/path/to/user-api')
                                .then(function(response){
                                    response.json()
                                        .then(function(data){
                                            that.setState({users: data})
                                        });
                                });
                        }

                        handleAddUser(user){        //添加新返回用户到旧用户列表中
                            let that = this;
                            fetch('/path/to/save-user-api', {
                                method: 'POST',
                                body: JSON.stringify({'username': user})
                            })
                                .then(function(response){
                                    response.json()
                                        .then(function(newUser){
                                            that.setState((preState) => {
                                                ({ users: preState.users.concat([newUser]) })
                                            })
                                        });
                                });
                        }

                        handleSetCurrentUser(userId){       //设置当前选中的用户
                            this.setState({currentUserId: userId});
                        }

                        render(){               //根据currentUserId筛选出当前用户对象
                            const filterUsers = this.state.users.filter((user) => {
                                user.id === this.state.currentUserId
                            });
                            const currentUser = filterUsers.length>0 ? filterUsers[0] : null;

                            return(             //UserListContainer通过UserList的props 将（修改currentUserId的回调）传给它 
                                <UserList  
                                    users={this.state.users}
                                    currentUserId={this.state.currentUserId}
                                    onAddUser={this.handleAddUser}
                                    onSetCurrentUser={this.handleSetCurrentUser}
                                />
                                <UserDetail currentUser={currentUser} />
                            );
                        }
                    }
                    //UserListContainer新增状态currentUserId标识当前选中用户（UserList UserDetail都要用）提升到共同父组件  被传递了修改id的回调的 UserList可以在自身内部修改currentUserId 

                    //Context  不用太多层级的传递  让任意层级的子组件可以获取父组件的状态和方法     创建方法：组件上增加getChildContext方法 返回context对象 在组件的childContextTypes属性上定义context对象属性的类型  （但不是所有组件都提供context功能）
                    //UserListContainer.js
                    class UserListContainer extends React.Component{
                        //...
                        getChildContext(){      //创建context对象  包含onAddUser方法
                            return {onAddUser: this.handleAddUser};
                        }

                        handleAddUser(user){    //新增用户
                            this.setState((preState) => {
                                users:preState.users.concat([{'id':'c', 'name':'cc'}])
                            })
                        }

                        render(){
                            const filterUsers = this.state.users.filter((user) => {
                                user.id = this.state.currentUserId
                            });
                            const currentUser = filterUsers.length>0 ? filterUsers[0] : null;
                            return(
                                <UserList
                                    users={this.state.users}
                                    currentUserId={this.state.currentUserId}
                                    onSetCurrentUser={this.handleSetCurrentUser} 
                                />
                                <UserDetail currentUser={currentUser} />
                            );
                        }
                    }
                    
                    UserListContainer.childContextTypes = {         //声明context属性的类型
                        onAddUser: propTypes.func   
                    };

            //ref 
                //在DOM上使用 接收回调为值 组件挂载/卸载时 回调调用（挂载时接收dom为参数， 卸载接收null为参数）          
                render(){return( <input ref={(input) => {this.textInput = input;}}/> )}   
                //组件上使用 回调接收参数为组件实例  提供可以在组件外（如父组件）操作组件的方法  并且只能为类组件定义ref属性 函数组件可以用ref引用其他dom/组件
                render(){return( <AutoFocusTextInput ref={(input) => {this.inputInstance = input}} />  )}   
                //父组件访问子组件上的dom  (假设子组件Children上有个带ref参数的input)
                render(){return( <Children inputRef={ el => {this.inputElement = el}}/> )}   




    //虚拟DOM  性能优化
        //虚拟DOM  使用js对象描述dom 通过这层抽象提高dom操作效率
        {       //描述一个 classname=“foo” 的div 中 h1标题 HelloReact 
            type: 'div',
            props: {
                className: 'foo',
                children: {
                    type: 'h1',
                    props: {
                        children: 'HelloReact'
                    }
                }
            }
        }

            //Diff 算法     每次属性/状态更新 都会返回一个新的虚拟dom对象  比较两次DOM结构（树）找出变化部分更新    正常情况比较两个树要O（n^3）  react可以用O（n）速度完成  
                /* 秘诀是通过两个假设：
                        1.两个元素的类型不同时  生成两颗不同的树
                        2.如果有key  key对应的元素在多次render过程是否发生变化

                        具体时从根节点开始比较 据根节点类型执行不同操作（递归到子树）：
                            1.根节点不同类型（极少见）  直接全拆重建  dom销毁和插入新的  组件调用卸载函数和挂载函数， 虚拟DOM树整体更新到真实的DOM树
                            2.根节点相同DOM  比较属性  更新发生变化的属性
                            3.根节点相同组件  执行更新 同步变化的属性到虚拟的dom树
                */

        //性能优化      
            //使用生产环境版本的库    如不使用create-react-app  而是在webpack配置项包含以下插件配置
            plugins: {
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production')
                    }
                }),
                new UglifyJSPlugin(),
                //...
            }

            //避免不必要组件渲染  如父组件的render会再调用子组件的render 但是子组件可能没有变化  可以用 shouldComponentUpdate （）生命周期方法 返回false   停止更新
            class MyComponent extends React.Component{
                shouldComponentUpdate(nextProps, nextState){
                    if(nextProps.item === this.props.item){     //===比较对象引用 不是特精确 （不同引用内容可相同）  更好做法：遍历对象每一层分别比较属性 但是性能延迟又上去了
                        return false;
                    }
                    return true;
                }
                //...
            }

            //使用key 




    //高阶组件   参数/返回值都可以是组件 的组件  其本质也是一个函数   用来操作props/通过ref访问组件实例/组件状态提升/其他元素包装组件
        //MyComponent.js    要从LocalStoreage获取数据 渲染到页面 并其他组件也要从LocalStoreage获取同样的数据（使用高阶组件避免每个组件写一遍componentWillMount）
        import React, {Component} from 'react';
        function withPersistentData(WrappedComponent){      //高阶组件
            return class extends Component{                 //返回一个组件  组件中用生命周期函数挂载时获取数据并设置为state
                componentWillMount(){
                    let data = localStorage.getItem('data');
                    this.setState({data});
                }

                render(){           //通过{...this.props} 把传递给当前组件的属性 继续传递给被包装的组件
                    return <WrappedComponent data={this.state.data} {...this.props} />
                }
            }
        }

        class MyComponent extends Component{  //这个组件是上个高阶组件的参数 被返回出来时 已经包含了data和自带其他属性
            render(){
                return <div>{this.props.data}</div>
            }
        }

        const MyComponentWithPresistentData = withPersistentData(MyComponent);      //调用高阶组件(函数)

        //高阶组件除了使用组件为函数 还可以获取key值对应的数据， 通过HOC函数传递参数  HOC(...params)(WrappedComponent)    
        import React, {Component} from 'react';
        function withPersistentData = (key) => (WrappedComponent) =>  {     //HOC  
            return class extends Component{                 
                componentWillMount(){
                    let data = localStorage.getItem('data');
                    this.setState({data});
                }

                render(){           
                    return <WrappedComponent data={this.state.data} {...this.props} />
                }
            }
        }

        class MyComponent extends Component{  
            render(){
                return <div>{this.props.data}</div>
            }
        }

        const MyComponent1WithPresistentData = withPersistentData('data');      //获取key=“data”的数据
        const MyComponent2WithPresistentData = withPersistentData('name');      //获取key=“name”的数据
        
        //这种大量出现在第三方库 如Redux
        connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)      
        //redux 的connect  第一个参数从全局store取出要的state 并转化为当前组件的props  通过第二参数把当前组件用到的redux的action creators以props传递给当前组件
        const ConnextedComponentA = connect(mapStateToProps, mapDispatchToProps)(ComponentA);       //组件A连接到React        返回值也是一个高阶组件

        /*高阶组件注意事项：  
        把被包装组件的显示名称包到高阶组件显示名称中   
        不要在组件的render /生命周期函数中使用  
        由于新返回的组件不包含静态方法 要手动复制才能使用被包装组件的静态方法 
        Refs不会被传递给被包装组件 可以自定义属性 值为函数 传递被包装组件的Ref   
        可以把高阶组件放到一个父组件中执行 结果传递给子组件 逻辑中DOM/UI相关放父组件 否则放高阶组件   */