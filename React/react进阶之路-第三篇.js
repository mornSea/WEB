//router  react中万物皆组件  so router也是  
    //基础      单页应用：url变化导致页面变化 不向服务器发送请求 html还是同一个      一个应用只要一个Router实例 其他配置组件均为router子组件
        //安装(react-router-dom在浏览器使用 会自动安装react-router)  npm install react-router-dom  
        
        //常用两种路由器        BrowserRouter(使用H5的api实现前进后退): example.com/some/path       HashRouter（url的hash）: example.com/#/some/path        前者要在服务器中设置 使其可以处理同一个页面不同子url
        
        //路由配置： 每当有组件需要根据url决定是否需要渲染时， 就要创建一个Router
            //1.path 每个Router都要有一个path属性 使用BR时描述匹配url的pathname  使用HR时描述匹配utl的hash  
            //2.match url和Router匹配时， Router会创建个match对象作为props的属性传递给被渲染组件 它包含四个属性：(params参数-也可在path中 isEcact是否完全匹配的布尔值  path嵌套路由时使用  url网址的匹配部分）
            //3.Router渲染组件方式：（ component：这个属性中定义的=url匹配的组件会渲染     render：值为函数 内部返回要渲染的并传参      children是一个返回渲染组件的函数 不匹配时渲染null  ）     
            //4.Switch和exact  Switch：多个匹配但只渲染第一个匹配的时 把这些router包到一个Switch组件中       exact：url和router完全匹配时才渲染（类似标识符属性 无值）    这两个经常一起使用（第一个匹配并且是全匹配的才渲染）
            //5.嵌套路由  router渲染的组件中定义新的Router   

        //链接  Link是链接组件 定义了点击它时 页面该如何路由 如<li><Link to='/'>home</Link></li>  就是在dom/组件里加一对标签表示要导航到哪（to属性的值）  当to为类时 可以包含pathname search hash state四个属性  并可以配合histore.push/replace('/some')添加或者替换历史记录中的一条记录
:15i
//实战  实现BBS的登陆 帖子列表 帖子详情  三个页面
        //后台api  分登陆 帖子 评论 三类：   登陆：/user/login 为了简化预先创建好三个用户      帖子： /post 使用RESTful API实现获取/修改/添加     评论： /comment 获取/新增帖子评论  
            //util/url.js               api全封装到这个文件
            const postListFilter = {            //获取帖子列表的过滤条件
                fields: ["id", "title", "author", "vote", "updateAt"],
                limit: 10,
                order: "updateAt DESC",
                include: "authorPointer",
                includefilter: {user: {fields: ["id", "username"]}}
            };

            const postByIdFilter = id => ({     //获取帖子详情的过滤条件
                fields: ["id", "title", "author", "vote", "updateAt", "content"],
                where: {id: id},
                include: "authorPointer",
                includefilter: {user: {fields: ["id", "username"]}}
            });

            const postByIdFilter = postId => ({ //获取评论列表的过滤条件
                fields: ["id", "author", "updateAt", "content"],
                where: {post: postId},
                limit: 20,
                order: "updateAt DESC",
                include: "authorPointer",
                includefilter: {user: {fields: ["id", "username"]}}
            });
            
            function encodeFilter(filter){
                return encodeURIComponent(JSON.stringify(filter));
            }
            
            export default{                     //这个对象包含项目中要的所有api
                login: () => "/user/login",     //登陆
                getPostList: () => `/post?filter=${encodeFilter(postListFilter)}`,      //获取帖子列表
                getPostById: () => `/post?filter=${encodeFilter(postByIdFilter(id))}`,  //获取帖子详情
                createPost:  () => "/post",     //新建帖子列表
                updatePost:  () => `/post/${id}`,                                       //修改帖子
                getCommentList: postId => `/comment?filter=${encodeFilter(getCommentListFilter(postId))}`,  //获取评论列表
                createComment: () => "/comment" //新建评论
            }

            //util/request.js    用H5的fetch接口调用API 根据http的get/post/put定义了三个对应的方法
            function get(url){
                return fetch(url, {
                    method: "GET",
                    headers: headers,
                })
                    .then(response => {
                        return handleResponse(url, response);
                    })
                        .catch(err => {
                            console.error(`Request  failed . url = ${url}. Message = ${err}`);
                            return {error: {message: "request filed"}};
                        })
            }

            function post(url, data){
                return fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data),
                })
                    .then(response => {
                        ertuen handleResponse(url, response);
                    })
                        .catch(err => {
                            console.error(`Request failed . url=${url}. Message=${err}`);
                            return{error: {message: "Request failed"}};
                        })
            }

            function put(url, data){
                return fetch(url, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(data)  
                })
                    .then(response => {
                        return handleResponse(url, response);
                    })
                        .catch(err => {
                            console.error(`Request failed . url=${url}. Message=${err}`);
                            return{error: {message: "Request failed"}};
                        })
            }


            function handleResponse(url, response){
                if(response.status < 500){
                    return response.json();
                } else {
                    console.error(`Request failed . url=${url} . message=${response.statusText}`);
                    return {error : {message: "rquest failed due to server error"}};
                }
            }

            export {get, post, put}
            //作者使用APIClod的API 要用代理服务器解决跨域问题， so， 在项目的package。json配置proxy属性， 用其转入到最终地址 "proxy": "https://d.apicloud.com/mcm/api"


        //路由设计： 
            //1. 定义路由名称  登陆页/login   帖子页/posts  详情页/posts/:id
            //2. 组织route结构   posts 和 / 都通向首页  并且有两个层级的路由
                //第一层级的路由        注意只有第一个“/” 首页是必须完全匹配的 避免其他路径都匹配到根路径
                <Router>
                    <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login"  component={Login} />
                    <Route path="/posts"  component={Home} />
                    </Switch>
                </Router>

                //第二层路由  第一层并没有渲染  真正渲染在第二层路由（components/Home组件）   定义帖子和详情页的路由 并用Router的render属性渲染
                class Home extends Component{
                    //....
                    render(){
                        const {match, location} = this.props;
                        const {username} = this.state;
                        return (
                            <div>
                                <Header 
                                    username={username} 
                                    onLogout={this.handleLogout}
                                    location={location}
                                />
                            

                            {/*  帖子列表路由配置  */}
                            <Route 
                                path={match.url}
                                exact 
                                render={props => <PostList username={username} {...props} />}
                            />



                            {/* 帖子详情列表路由配置 */}
                            <Router 
                                path={`${match.url}/:id`}
                                render={props => <Post username={username} {...props} /> }
                            />
                            </div>
                        );
                    }
                }

            //登陆页
                //提供一个form表单
                render(){                       //from 保存跳转到登陆页之前的那个页面的路径 用于登陆后返回
                    const {form} =this.props.location.state || {from: {pathname: "/"}};
                    const {redirectToReferrer} = this.state;
                    
                    if(redirectToReferrer){      //登陆成功后 redirectToReferrer变成true， 使用Redirect组件重定向页面
                        return <Redirect to={from} />;
                    }

                    return (
                        <form className="login" onSubmit={this.handleSubmit}>
                            <div>
                                <label>
                                    用户名： 
                                    <input 
                                        name="username"
                                        type="text"
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    密码：
                                    <input 
                                        name="password"
                                        type="paddword"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </label>
                            </div>
                            <input type="submit" value="登陆" />
                        </form>
                    );
                }
                        //点“登陆” =》 api验证 =》 成功 =》 用户信息存到sessionStorage =》 其他页面根据sessionStorage判断有无登陆

                //登陆逻辑（核心函数）
                    handleSubmit(e){
                        e.preventDefault();
                        const username = this.states.username;
                        const password = this.state.password;
                        if(username.length === 0 || password.length===0){
                            alert("用户名或密码不能为空")；
                            return;
                        }
                        const params = {username, password};
                        post (url.login(), params)
                            .then(data => {
                                if(data.error){
                                    alert(data.error.message || "login failed");
                                }else{          //先保存登陆信息到sessionStorage   登陆成功后设置redirectToReferrer为true
                                    sessionStorage.serItem("userId", data.userId);
                                    sessionStorage.setItem("username", username);

                                    this.setState({
                                        redirectToReferrer: true
                                    });
                                }
                            });
                    }
                 //登陆成功后 再次render时， 会悬案React Router的Redirect组件， 这个组件用于页面的重定向 重定向到登陆前一个页面或者首页
                 //component/Login.js   
                 import React, {Component} from "react";
                 import {Redirect} from "react-router-dom";
                 import {post} from "../utils/request";
                 import url from "../utils/url";
                 import "./Login.css";  
                 
                 class Login extends Component{
                     constructor(props){
                         super(props);
                         this.state = {
                             username: "",
                             password: "",
                             redirectToReferrer: false              //是否重定向到之前页面  先默认false
                         };
                         this.handleChange = this.handleChange.bind(this);
                         this.handleSubmit = this.handleSubmit.bind(this);
                     }

                     handleChange(e){           //用以处理用户名 密码的变化
                        if(e.target.name==="username"){
                            this.setState({
                                username: e.target.value
                            });
                        }else if(e.target.name==="password"){
                            this.setState({
                                password: e.target.value
                            });
                        }else{
                                                //do nothing
                        }
                     }

                     handleSubmit(e){           //前面的核心函数， 用来提交表单
                        e.preventDefault();
                        const username = this.states.username;
                        const password = this.state.password;
                        if(username.length === 0 || password.length===0){
                            alert("用户名或密码不能为空");
                            return;
                        }
                        const params = {username, password};
                        post (url.login(), params)
                            .then(data => {
                                if(data.error){
                                    alert(data.error.message || "login failed");
                                }else{          //先保存登陆信息到sessionStorage   登陆成功后设置redirectToReferrer为true
                                    sessionStorage.serItem("userId", data.userId);
                                    sessionStorage.setItem("username", username);

                                    this.setState({
                                        redirectToReferrer: true
                                    });
                                }
                            });
                    }

                    render(){                       //前面个用于显示登陆表格的render()        from 保存跳转到登陆页之前的那个页面的路径 用于登陆后返回
                        const {form} =this.props.location.state || {from: {pathname: "/"}};
                        const {redirectToReferrer} = this.state;
                        
                        if(redirectToReferrer){      //登陆成功后 redirectToReferrer变成true， 使用Redirect组件重定向页面
                            return <Redirect to={from} />;
                        }
    
                        return (
                            <form className="login" onSubmit={this.handleSubmit}>
                                <div>
                                    <label>
                                        用户名： 
                                        <input 
                                            name="username"
                                            type="text"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        密码：
                                        <input 
                                            name="password"
                                            type="paddword"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </label>
                                </div>
                                <input type="submit" value="登陆" />
                            </form>
                        );
                    }
                 }
                 export default Login;
            
            //帖子列表页     分为几个组件 Header导航栏   PostList（PostEditor编辑区， PostsView帖子列表区（PostItem一个个单独的帖子））      (划分组件容易过大或过小 一般一个组件只负责一个功能 如果几个功能都没有复用的需求+简单->也可以放一起)
                //Hander.js  包含两个Link  分别导航到首页和登陆
                    import React, {Component} from "react";
                    import {Link} from "react-touter-dom";
                    import "./Header.css"

                    class Header extends Component{
                        render(){
                            return (
                                <div className="header">
                                    <div className="nav">
                                        <span className="left-link">
                                            <Link to="/">首页</Link>
                                        </span>
                                        {/* 已登录 ？ 用户名 ： 登陆按钮 */}
                                        {username && username.length >0
                                         ? (
                                            <span className="user">
                                                你好呀： {username}&nbsp
                                                <button onClick={onLogout}>注销</button>
                                            </span>
                                        ) : (
                                            <span className="right-link">
                                                {/* 通过state属性保存当前网页地址(location)  导航到登陆页的Link的to属性的值是一个对象 */}
                                                <Link to={{pathname: "/login", state: {from: location}}}>
                                                    登陆
                                                </Link>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    }
                    export default Header;

                //PostList.js     负责获取列表， 保存新建帖子， 控制PostEditor的显示/隐藏      它的state包含两个属性posts，newPost 保存列表数据/判断是否在建新帖 
                import React, {Component} from "react";
                import {Link}from "react-router-dom";
                import PostsView from "./PostsView";
                import PostEditor from "./PostEditor";
                import {get, post} from "../utils/request";
                import url from "../utils/url";
                import "./PostList.css";

                class PostList extends Component{
                    constructor(props){
                        super(props);
                        this.state={posts: [], newPost: false};
                        this.handleCancel = this.handleCancel.bind(this);
                        this.handleSave = this.handleSave.bind(this);
                        this.handleNewPost = this.handleNewPost.bind(this);
                        this.refreshPostList = this.refreshPostList.bind(this);
                    }

                    componentDidMount(){        //挂载时调用获取数据的函数
                        this.refreshPostList();
                    }

                    refreshPostList(){          //获取帖子列表
                        get(url.getPostList())
                            .then(data => {     //调用后台api获取数据并设置到state
                                if(!data.error){
                                    this.setState({
                                        posts: data,
                                        newPost: false
                                    });
                                }
                            });
                    }

                    handleSave(data){           //保存帖子    帖子对象包括（用户信息， 点赞数，帖子标题，帖子内容）
                        const postData = {...data, author:this.props.userId, vote:0};
                        post(url.createPost(), postData)        //用post把数据发送到服务器
                            .then(data => {
                                if(!data.error){//保存成功  刷新列表
                                    this.refreshPostList();
                                }
                            });
                    }

                    handleCancel(){             //取消新建帖子
                        this.setState({
                            newPost: false
                        });
                    }

                    handleNewPost(){            //新建帖子
                        this.setState({
                            newPost: true
                        });
                    }

                    render(){
                        const {userId} = this.props;
                        return (
                            <div className="postList">
                                <div>
                                    <h2>帖子列表</h2>
                                    {/* 登陆 ？ 显示发帖按钮 ： null */}
                                    {userId ? <button onClick={this.handleNewPost}>发帖</button> : null}
                                </div>
                                    {/* 正在新建 ？ 渲染PostEditor ：null */}
                                    {this.state.newPost ? (
                                        <PostEditor onSave={this.handleSave} onCancel={this.handleCancel} />
                                    ) : null}
                                    <PostsView posts={this.state.posts} />
                            </div>
                        );
                    }                    
                }

                //PostEditor.js      编辑帖子 在帖子列表/详情页 用于发布/修改    由一个input和一个textarea组成       它只负责界面逻辑 保存数据通过调用父组件的回调      
                import React, {Component} from "react";
                import "./PostEditor.css";

                class  PostEditor extends Component{
                    constructor(props){
                        super(props);
                        const {post} = this.props;
                        this.state = {
                            title: (post && post.title) || "",
                            content: (post && post.content) || ""
                        };
                        this.handleCancelClick = this.handleCancelClick.bind(this);
                        this.handleSaveClick = this.handleSaveClick.bind(this);
                        this.handleChange = this.handleChange.bind(this);
                    }

                    handleChange(e){            //处理帖子的编辑信息
                        const name = e.target.name;
                        if(name === "title"){
                            this.setState({
                                title: e.target.value
                            });
                        }else if(name === "content"){
                            this.setState({
                                content: e.target.value
                            });
                        }else{
                                                //do nothing
                        }
                    }

                    handleCancelClick(){        //取消帖子的编辑
                        this.props.onCancel();
                    }

                    handleSaveClick(){          //保存帖子
                        const data={
                            title: this.state.title,
                            content: this.state.content;
                        };
                        this.props.onSave(data);//调用父组件回调执行真正的保存
                    }

                    render(){
                        return (
                            <div className="postEditor">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="标题"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                                <textarea 
                                    name="content"
                                    placeholder="写些什么"
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                />
                                <button onClick={this.handleCancelClick}>取消</button>
                                <button onClick={this.handleSaveClick}>保存</button>
                            </div>
                        );
                    }
                }
                export default PostEditor;

                
                //PostsView.js           显示帖子列表 渲染PostItem时 每个item外面套一个Link 这样点击就会到这个帖子的详情页   （一个容器 可以设置外边距 以免item在外面显示/触发Link）
                import React, {Component} from "react";
                import {Link} from "react-router-dom";
                import PostItem from "./PostItem";

                class PostsView extends Component{
                    render(){
                        const {posts} = this.props
                        return (
                            <ul>
                                {posts.map(item => (
                                /* 使用Link组件包裹每个PostItem */
                                <Link key={item.key} to={`/posts/${item.id}`}>
                                    <PostItem post={item} /> 
                                </Link>    
                                ))}
                            </ul>
                        );
                    }
                }
                export default PostsView;

                //PostItem.js                   //没有逻辑 只负责渲染列表每一项的无状态函数组件   (取消点赞功能)
                import React  from "react";
                import {getFormatDate} from "../utils/date";
                import "./PostItem.css";
                import like from "../images/like.png";

                function PostItem (props){
                    const {post} = posts;
                    return (
                        <li className="PostItem">
                            <div className="title">{post.title}</div>
                            <div>
                                创建人： <span>{post.author.username}</span>
                            </div>
                            <div>
                                创建时间： <span>{post.author.date}</span>
                            </div>
                            <div className="like">
                                <span>
                                    <img alt="vote" src={like} /> 
                                </span>
                                <span>{post.vote}</span>
                            </div>
                        </li>
                    );
                }
                export default PostItem;




            //帖子详情页        有两种状态（浏览/编辑）   分为Header， Post取/改/创/展（  PostEditor， CommentList评论区（  CommentsView评论编辑 ））    其中Header PostEditor已经实现            
                //components/Post.js            (类似详情页的PostView)  不同于PostView在于获取/保存评论  同步修改的新帖子
                import React, {Component} from "react";
                import PostEditor from "./PostEditor";
                import PostView from "./PostView";
                import CommentList from "./CommentList";
                import {get, put, post} from "../utils/request";
                import url from "../utils/url";
                import "./Post.css";

                class Post extends Component{
                    constructor(props){
                        super(props);
                        this.state = {
                            post: null,
                            comments: [],
                            editing: false
                        };
                        this.handleEditClick = this.handleEditClick.bind(this);
                        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
                        this.handlePostSave = this.handlePostSave.bind(this);
                        this.handlePostCancl = this.handlePostCancl.bind(this);
                        this.refreshComments = this.refreshComments.bind(this);
                        this.refreshpost = this.refreshpost.bind(this);
                    }

                    componentDidMount(){        //挂载时获取帖子详情和评论
                        this.refreshComments();
                        this.refreshpost();
                    }

                    refreshPost(){              //获取帖子详情
                        const postId = this.props.match.params.id;
                        get(url.getPostById(postId))
                            .then(data => {
                                if(!data.error && data.length === 1){
                                    this.setState({
                                        post: data[0]
                                    });
                                } 
                            });
                    }

                    refreshComments(){          //获取评论列表
                        const postId = this.props.match.params.id;
                        get(url.getCommentList(postId))
                            .then(data => {
                                if(!data.error){
                                    this.setState({
                                        comments:data
                                    });
                                }
                            });
                    }

                    handleEditClick(){          //让帖子处于编辑状态
                        this.setState({
                            editing: true
                        });
                    }

                    handlePostSave(data){       //保存帖子
                        const id = this.props.match.params.id;
                        this.savePost(id, data);
                    }

                    handlePostCancl(){          //取消编辑
                        this.setState({
                            editing: false
                        });
                    }

                    handleCommentSubmit(content){               //提交新的评论
                        const postId = this.props.match.params.id;
                        const comment = {
                            author: this.props.userId,
                            post: postId,
                            content: content
                        };
                        this.saveComment(comment);
                    }

                    saveComment(comment){       //保存新评论到服务器  并更新
                        post(url.createComment(), comment)
                            .then(data => {
                                if(!data.error){
                                    this.refreshComments();
                                }
                            });
                    }

                    savePost(id, post){         //同步贴子的修改到服务器
                        put(url.updatePost(id), post)
                            .then(data => {
                                if(!data.error){                    //因返回的帖子只有author的id  so 额外把完整的author信息合并到帖子对象   
                                    const newPost ={...data, author: this.state.post.author};
                                    this.setState({
                                        post: newPost,
                                        editing: false
                                    });
                                }
                            });
                    }

                    render(){
                        const {post, comments, editing} = this.state;
                        const {userId} = this.props;
                        if(!post){
                            return null;
                        }
                        const editable = userId === post.author.id;
                        return(
                            <div className="post">
                                {editing ?(
                                    <PostEditor 
                                        post={post}
                                        onSave = {this.handlePostSave}
                                        onCancel = {this.handleCancel}
                                    />
                                ):(
                                    /* PostView负责展示某一个帖子 */
                                    <PostView 
                                        post={post}
                                        editable={editable}
                                        onEditClick={this.handleEditClick}
                                    />
                                )}
                                <CommentList 
                                    comments={comments}
                                    editable={Boolean(UseraId)}
                                    onSubmit={this.handleCommentSubmit}
                                />
                            </div>
                        );
                    }
                }
                export default Post;

                //components/CommentList.js         通过CommentView显示评论列表和发表评论  只负责UI逻辑 调用Post的handleCommentSubmit方法保存到服务器
                import React, {Component} from "react";
                import CommentsView from "./CommentsView";
                import {getFormatDate} from "../utils/date";
                import "./CommentList.css";

                class CommentList extends Component{
                    constructor(props){
                        super(props);
                        this.state = {value: ""};
                        this.handleChange = this.handleChange.bind(this);
                        this.handleClick = this.handleClick.bind(this);
                    }

                    handleChange(e){            //处理新评论内容的变化
                        this.setState({
                            value: e.target.value
                        });
                    }

                    handleClick(e){             //保存新评论
                        const content = this.state.value;
                        if(content.length > 0){
                            this.props.onSubmit(this.state.value);
                            this.setState({
                                value: ""
                            });
                        }else{
                            aleart("评论内容不能为空");
                        }
                    }

                    render(){
                        const {comments, editable} = this.props;
                        return (
                            <div className="commentList">
                                <div className="title">评论</div>
                                {/* 只有登陆才能评论 */}
                                {editable ? (
                                    <div className="editor">
                                        <textarea 
                                            placeholder="说说你的看法"
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                        />
                                        <button onClick={this.handleClick} >提交</button>
                                    </div>
                                ) : null}
                                <CommentsView comments={comments} />
                            </div>
                        );
                    }
                }
                export default CommentsList;


                //components/CommentsView.js        显示评论列表的组件   相当于item
                import React, {Component} from "react";
                import {getFormatDate} from "../utils/date";
                import "./CommentsView";
                
                class CommetsView extends Component{
                    render(){
                        const {comments} = this.props;
                        return (
                            <ul className="commentsView">
                                {comments.map(item => {
                                    return (
                                        <li key={item.id}>
                                            <div>{item.content}</div>
                                            <div className="sub">
                                                <span>{item.author.username}</span>
                                                <span>•</span>
                                                <span>{getFormatDate(item.updatedAt)}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }
                }
                export default CommentsView;

            //代码分片      项目根路径下使用npm run build时 将使用webpack将src下所有js/css 分别打包为一个统一的文件 （js加载+先运行=慢）  最好访问那个页面时 只加载这个页面要用的（切片 按需加载）
                //create-react-app支持通过动态 import()方式实现代码分片   接收模块路径作为参数 返回promise对象 这个对象的值就是待导入的模块对象
                //moduleA.js       
                const moduleA = "Hello";
                export {moduleA};
                //App.js                        //将moduleA。js 和它依赖的模块单独打包到一个chunk文件 点击按钮时才加载
                import React, {Component} from 'react';
                class App extends Component{
                    handleClick = () => {       //使用import动态导入moduluA.js
                        import ('./moduleA')
                            .then(({moduleA}) => {
                                //使用moduleA
                            })
                            .catch(err => {
                                //处理错误
                            });
                    };

                    render(){
                        return (
                            <div>
                                <button onClick={this.handleClick}>加载moduleA</button>
                            </div>
                        );
                    }
                }
                export default App;

                //使用react router时， 会根据路由信息将项目代码分片 每个路由依赖的代码分别打包为一个chunk 用个函数统一处理：
                import React, {Component} from "react";
                export default function asyncComponent(importComponent){        //importComponent是使用了import（）的函数    so这个是高级函数
                    class asyncComponent extends  Component{
                        constructor(props){
                            super(props);
                            this.state = {component: null}; //动态加载的组件
                        };

                        componentDidMount(){
                            importComponent()               //触发动态导入模块
                                .then((mod) => {
                                    this.setState({         //同时兼容ES6和CommonJS模块
                                        component: mod.default ? mod.default : mod
                                    });
                                });
                        }

                        render(){               //渲染动态加载的组件
                            const C = this.state.component;
                            return C ? <C {...this.props} /> : mod
                        }
                    }
                    return asyncComponent;
                }

                //App.js      只有当路由匹配时 相应组件才导入  用asyncComponent改造原先的项目  删除用静态导入的Login和Home组件 改为用asyncComponent动态导入
                import React, {Component} from "react";
                import {BrowserRouter as Router, Router, Switch} from "react-router-dom";
                import asyncComponent from "./asyncComponent";
                const AsyncHome = asyncComponent(() => import("./componets/Home"));     //导入组件 创建代码分片
                const AsyncLogin = asyncComponent(() => import("./componets/Login"));

                class App extends Component{
                    render(){
                        return(
                            <Router>
                                <Switch>
                                <Route exact path="/" component={AsyncHome} />
                                <Route path="/login"  component={AsyncLogin} />
                                <Route path="/posts"  component={AsyncHome} />
                                </Switch>
                            </Router>
                        );
                    }
                }
                export default App;

                //Home.js       同上   
                const AsyncPost = asyncComponent(() => import("./Post"));
                const AsyncPostList = asyncComponent(() => import("./PostList"));
                
                class Home extends Component{
                    //...
                    render(){
                        const {match, location} = this.props;
                        const {username} = this.state;
                        return (
                            <div>
                                <Header 
                                    username={username}
                                    onLogout={this.handleLogout}
                                    location={location}
                                />
                                <Route
                                    path={match.url}
                                    exact
                                    render={props => <AsyncPostList username={username} {...props} />}
                                />
                                <Route 
                                    path={`${match.url}/:id`}
                                    render={props => <AsyncPost username={username} {...props} />}
                                />
                            </div>
                        );
                    }
                }

                //现在运行 npm run build 会生成一个main.js 和四个chunk.js （一个import（）的调用产生一个）  




//redux     单页应用越开越复杂 要管理的状态页越来越多 （服务器数据， 本地数据， UI状态数据，，，）  Redux就是用来帮助管理状态的
    //基础
        //假设这是一个todo应用的状态（类）      一个list里每个对象分别代表一个任务 有描述和完成否两个属性， 除了list还有一个属性visibilityFilter的值用来过滤哪些可以显示
        {
            todos: [{
                text: 'learn react',
                completed: false
            }, {
                text: 'learn Angular',
                completed: false
            }, {
                text: 'learn Vue',
                completed: false
            }],
            visibilityFilter: 'SHOW_COMPLETED'
        }

        //要修改状态时 必须发一个action， 用来描述引用要如何修改   如要添加一个任务时 可发送：  (必须包括type      type代表action的类型)
        {type: 'ADD_TODO',  text:'learn WXxcx'}
        //显示所有任务
        {type: 'SET_VISIBILITY_FILTER', filter:'SHOW_ALL'}
        //type的字段什么都可以 具体看reducer怎么解析action（reducer是一个函数，收action为参，返一个新state）  定义一个管理应用全局的reducer：
        function todoApp(state={}, action){
            switch(action.type){
                case SET_VISIBILITY:
                    //return new state
                case ADD:
                    //return new state
                case TOGGLE:
                    //return new state
                default:
                    return state
            }
        }
        //这样todoApp每次返回都是最初定义的应用状态结构 {todos:[...], visibility:...}

        //三大原则：
            //1. 唯一数据源  一个应用只维护一个全局状态对象 存储在Redux的store中， 便于集中状态管理
            //2.保持应用状态只读  即不能直接修改 只能通过发action 便于有序管理
            //3.状态修改通过纯函数完成  actiot表明修改意图 reducer必须纯函数 即不能直接改原状态对象， 而是创建一个新状态对象返回  便于撤销和稳定

    //主要组成:             action reducer store   
        //action是信息的载体，它是一个包含type的对象 是store唯一的信息来源    把action发给store必须通过store的dispatch方法  通过action creator创建 它能返回一个action    如添加任务的action creator
        //acrions.js
        export const ADD = 'ADD'
        export const TOGGLE ='TOGGLE'
        export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

        export const visibilityFilters = {      //筛选显示条件
            SHOW_ALL: "SHOW_ALL",
            SHOW_COMPLETED: "SHOW_COMPLETED",
            SHOW_ACTIVE: "SHOW_ACTIVE"
        }
        
        export function addTodo(text){          //新增任务
            return {
                type: ADD,
                text
            }
        }
        
        export function toggleTodo(index){      //修改任务状态 index是任务在todos的索引
            return {
                type: TOGGLE,
                index
            }
        }

        export function  setVisibilityFilter(filter){           //筛选当前显示的任务
            return {
                type: SET_VISIBILITY_FILTER,
                filter
            }
        }

        //reducer  根据action做响应 决定如何修改state  在编写reducer之前应设计好state 如之前设计的{todos:[{text:'', completed:ture},],visibility:'SHOW_ALL' }   
            //先根据函数的参数 输出 写出一个函数签名    (preciousState, action) => newState
            //基本reducer  除了初始化返回一个state外什么都不做
            import {visibilityFilters} from './actions'
            const initialState = {
                todos: [],
                visibilityFilter: visibilityFilters.SHOW_ALL
            }
            
            function  todoApp{state={}, action}{      //主reducer  调用另外两个reducer
                return {
                    todos: todos(state.todos, action)
                    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
                }
            }

            function todos(state=[], action){           //处理todo任务的操作
                switch (action.type){
                    case 'ADD':
                        return state.concat([{text: action , completed: false }])
                    case 'TOGGLE':
                        return state.map(
                            (todo, index) => {
                                action.index === index 
                                    ? {...todo, completed: !todo.completed}     //toggle是修改任务状态 so直接复制为相反布尔值
                                    : todo
                            }
                        )
                     default:
                         return state
                }
            }

            function visibilityFilter(state="SHOW_ALL", action){                //处理可显示状态的reducer
                switch (action.type){
                    case SET_VISIBILITY_FILTER:
                        return action.filter
                    default:
                        return state
                }
            }
            
                //另可用combineReducers 将reducer合并
                /* import {combinReducers} from 'redux'
                const todoApp = combinReducers({todos, visibilityFilter}) */

        //store负责：保存应用状态，通过方法getState()访问应用状态， 通过dispatch（action）发送更新页面意图， 通过subscribe（listener）注册监听函数， 监听应用状态变化       
        //store是 redux中一个对象， 连接action和reducer  一个应用唯一的一个store        通过createStore(reducer)创建  还可设置应用的初始状态 如下
        import  {createStore} from 'redux'
        import todoApp from './reducers'
            
        let store = createStore(todoApp, initialState);         //如果无initialState参数  只是创建store  类似创建不同reducer时 todos参数state默认值为空数组， visibilityFliter参数默认值为ALL 
            
        const state = store.getState();                         //store创建完（并都设置好默认值 构成初始状态后）通过getState函数获取state

        function addTodo(text){             //定义action
            return {type: 'ADD', text}
        }
        store.dispatch(addTodo('learn Vue'))    //发送action    当todoApp这个reducer完成addTodo这个action时， 应用状态会更新

        let unsubscribe = store.subscribe(() => {               //通过subscribe方法向store注册一个监听函数， 好知道什么时候更新状态完成 
            console.log(store.getState())                       //可在监听函数其中定义一些完成更新时的操作  如获取状态并打印到console
        })

            /* Redux数据流 的过程：
                1.调用store。dispatch（action）  action是描述发生了什么的对象， 这个调用可以在任何地方
                2.store调用reducer（当前状态， action）   用来计算下一个（应用）状态
                3.根reducer把多个子reducer返回结果组合成最终的应用状态 如使用combineReducers合并reducer action会传递给每一个reducer处理 zireducer结果再合并
                4.store保存根reducer返回的完整状态， 此时状态更新完成 适合调用stote的getState方法获取最新状态 然后更新UI 
            */

        
        //react中使用Redux :   npm安装react-redux  分下类：展示组件负责UI渲染， 容器组件负责应用逻辑的处理(请求，处理数据，数据传递给展示组件， 修改数据方法)，   然后用connect把react组件和Redux的store相连
        //将store和组件连接  创建一个空的容器组件(尚无逻辑)      
        import {connect} from 'react-redux'
        import TodoList from './TodoList'
        const VisibleTodoList = connect()(TodoList);

        //为VisibleTodoList添加两个参数 实现： store中获取状态 + 组件状态变化同步到store  
        import {connect} from 'react-redux'
        import TodoList from './TodoList'
        const VisibleTodoList = connect(        //添加两个react-redux自带的函数为参数 实现store获取/同步功能：
            mapStateToProps,                    //从全局应用状态state中取出所需数据 映射到展示组件的props
            mapDispatchToProps                  //把需要用到的action映射到组件的props

        )(TodoList);

        //假设VisibleTodoList要根据state的todos和visibilityFilter过滤出传递给TodoList的任务数据
        function getVisibleTodos(todos, filter){
            switch(filter){
                case 'SHOW_ALL':
                    return todos
                case 'SHOW_COMPLETED':
                    return todos.filter(t => t.completed)
                case 'SHOW_ACTIVE':
                    return todos.filter(t => !t.completed)
            }
        }

        //mapStateToProps     将状态转换为props    每当store的state更新 mapStateToProps会重新执行
        function mapStateToProps (state){
            return {
                todos: getVisibleTodos(state.todos, state.visibilityFilter)
            }
        }

        
        //容器组件依赖mapDispatchToProps 发送action 更新state （store的dispatch作为参数）
        function toggleTodo(id){                //据id返回一个action
            return {type: 'TOGGLE_TODO', id}
        }

        function mapDispatchToProps(dispatch){  //调用dispatch  发送action 更新state
            return {
                onTodoClick: function(id){
                    dispatch(toggleTodo(id))
                }
            }
        }

        //容器组件如何获取到redux的store？  react-redux提供了一个Provider组件  它接收一个store属性 保存到context，传递给子组件      
        class Provider extends Component{
            getChildContext(){
                return {
                    store: this.props.store
                };
            }

            render(){
                return this.props.children;
            }
        }

        Provider.childContextTypes = {
            store: React.PropTypes.object
        }

        //所以一般以它为根元素  任何层的组件可从它这获取store :
        import {createStore} from 'redux'
        import {Provider} from 'react-redux'
        import todoApp from './reducers'
        import App from './components/App'

        let store = createStore(todoApp);
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
        )



    //中间件和异步   如Node。js的web框架Express 一个请求要经过几个（管道一样）中间件的处理后 才到达业务逻辑代码层
        //Redux的中间件：   action（请求） reducer(业务逻辑)  
        //可以用中间层为action添加一些通用功能  如日志/异常
        let next = store.dispatch;
        store.dispatch = function dispatchAngLog(action){
            console.log('dispatching', action);
            let result = next(action);
            console.log('next state', store.getState());
            return result;
        }

        //一般直接引用现成的中间件  如给store加上日志
        import {applyMiddleware, createStore} from 'redux'
        import logger from 'redux-logger'
        import reducer from './reducers'
        const store = createStore(
            reducer,
            applyMiddleware(logger)
        );

        //实现applyMiddleware
        import compose from './compose'
        export default function applyMiddleware(...middlewares){
            return (createStore) => (...args) => {
                const store = createStore(...args)
                let dispatch = store.dispatch   
                let chain = []                  //接收到的中间件都放这个数组里  

                const middlewareAPI = {         //中间件API： （每一个中间件都接收）包含getState和dispatch的参数对象
                    getState: store.getState,                       //简化getState
                    dispatch:    (...args) => dispatch(...args)     //将简化命名后的dispatch变成包装所有参数的
                }

                chain = middlewares.map(middleware => middleware(middlewareAPI))        //中间件列表= 对参数middlewares的map中的每一个传入上面的 middlewareAPI对象
                dispatch = compose(...chain)(store.dispatch)                            //定义：执行compose(中间件列表),并返回匿名函数执行dispatch 的加强版的dispatch     
                                                                                        //compose是个工具函数 compose（f,g,h) 等于(...args)=>f(g(h(args)))
                return {
                    ...store,
                    dispatch
                }
            }
        }
        
        //异步操作          redux处理异步也要中间件的帮助  如常用的redux-thunk
        import {createStore, applyMiddleware} from 'redux';
        import thunk from 'redux-thunk';
        import reducer from './reducers';

        const store = createStore(
            reducer,
            applyMiddleware(thunk)
        );

        function getData(url){                  //获取数据的异步action
            return fetch (url)
                .then(
                    response => response.json(),
                    error => console.log('An error occured', error)
                )
                .then(json => {
                    dispatch({type: 'RECEIVE_DATA', data: json})
                })
        }

        //发送这个action：
        store.dispatch(getData("http://bing.com"));

        //一般实际项目里会使用三个store  分别表示请求的 开始/成功/失败
        {type: 'FETCH_DATA_REQUEST'} 
        {type: 'FETCH_DATA_SUCCESS', data:{...}} 
        {type: 'FETCH_DATA_ FAILURE', error: 'Oops'} 

        //根据这个改写异步函数：
        import {createStore, applyMiddleware} from 'redux';
        import thunk from 'redux-thunk';
        import reducer from './reducers';

        const store = createStore(
            reducer,
            applyMiddleware(thunk)
        );

        function getData(url){                  //获取数据的异步action
            return function (dispatch) {
                dispatch({type: 'FETCH-DATA-REQUEST'});
                return fetch(url)
                    .then(
                        response => response.json(),
                        error => {
                            console.log('An error occured', error);
                            dispatch({type: 'FETCH_DATA_FAILURE', error});
                        }
                    )
                    .then(json => {
                        dispatch({type: 'FETCH_DATA_SUCCESS', data: json});
                    })
            }
        }

            //这样可以根据请求所需阶段显示不同效果


        //redux 项目：
            //项目结构划分:        Ducker 将相关联的reducer， action types， action creators写到一个文件里， 这样相同的依赖都在一个文件  无论那个组件需要只要引入这一个文件就可以
            //widget.js
                //Actions
                const LOAD   = 'widget/LOAD';
                const CREATE = 'widget/CREATE';
                const UPDATE = 'widget/UPDATE';
                const REMOVE = 'widget/REMOVE';

                const initialState = {
                    widget: null,
                    isLoading: false,
                }

                //Reducer
                export default function reducer(state=initialState, action={}){
                    switch (action.type){
                        case LOAD:
                            //TODO
                        case CREATE:
                            //TODO
                        case UPDATE:
                            //TODO 
                        case REMOVE:
                            //TODO
                        default: return state;
                    }
                }

                //Action Creators
                export function loadWidget(){
                    return {type: LOAD};
                }
                export function createWidget(){
                    return {type: CREATE, widget};
                }
                export function updateWidget(){
                    return {type: UPDATE, widget};
                }
                export function removeWidget(){
                    return {type: REMOVE, widget};
                }

                /* 这样 整体的目录结构如下：
                    components/ （通用组件）
                    containers/
                    feature1/
                        components/（feature专用组件）
                        index.js    (feature专用容器) 
                    redux/
                        index.js    (combineReducers)
                        module1.js  (reducer， action types， action creators)
                        module2.js  (reducer， action types， action creators)
                    index.js
                        */

            //合理设计state    要把state看成数据库  每一部分状态看成表  里面的键值对就是字段
                /* 三个原则：
                    数据（状态）按领域分类在不同的表（子状态）中， 不同的表（子状态）中的数据不能重复 
                    （state以键值对存储数据）表的每一列都依赖表的主键（key或者Id作为索引 其他字段都依赖索引）
                    除了主键 其他列（state字段）之间不能有相关性（互不依赖）  （不能保存可通过state已有字段计算而来的数据）*/

                //重新设计的state  分为三个子state： posts，comments，users (在一个state对象中) 主键是id（应为电脑随机hash值）
                posts: { 
                    byId: {                                     //根据主键Id 快捷查询
                        59f5cb: {
                            id: 'n59f5cb',
                            title: 'react',
                            vote: 8,
                            updatedAt: '2017-10-29T12:36:56.333z',
                            author: '59e6f'
                        },
                        59f590: {
                            id: 'n59f590',
                            title: 'vue',
                            vote: 112,
                            updatedAt: '2017-10-29T15:33:16.335z',
                            author: '5d9e0'
                        }
                        //...
                    },
                    allIds: ['n59f5cb', 'n59f590', /*...*/]     //用来存有序id的List  维护数据有序性
                }

                users: {                        //不用关注作者的顺序  只要以作者的id为key的键值对
                    59e5d: {
                        id: 'u59u5d',
                        username: 'tom'
                    },
                    59e6f: {
                        id: 'u59e6f',
                        username: 'steve'
                    }
                }

                comments: {                     //评论和帖子的关系 通过byPost属性存储帖子id作为key 所有评论id为值
                    buPost： {
                        59f5c: {
                            "59f1a", "59f17", //...
                        }, 
                        //...
                    },
                    byId: {
                        59f1a: {
                            id: '59f1a',
                            content: 'react',
                            updateAt: '2017-10-26T08:49:03.235z',
                            author: '59e5d'
                        },
                        59f17:{
                            id: '59f17',
                            conten: 'Vue',
                            updateAt: '2017-10-16T03:39:04.355z',
                            author: '59e6f27'
                        },
                        //...
                    }
                }

                    //再在这三个后面添加 登陆api认证，用户， ui三个子状态
                    app:{
                        reuestQuantity: 0,      //api请求数
                        error: null             //全局错误信息
                    },
                    auth: {                     //用户信息
                        userId: null,
                        userName: null
                    }
                    ui: {
                        addDidlogOpen: false,   //新添帖子对话框的显示状态
                        editDialogOpen: false   //编辑帖子对话框的显示状态
                    }

                //模块设计          根据state的结构 拆分为七个模块： app, auth, posts, comments, users, ui, index  (即前面的六个 加上一个index)
                    //app.js        标记api请求 全局错误信息的设置
                    const initialState = {
                        requestQuantity: 0,
                        error: null
                    };

                    export const types = {      //action状态  包括开始发送 请求结束 设置错误信息 删除错误信息
                        START_REQUEST: "APP/START_REQUEST",
                        FINISH_REQUEST: "APP/FINISH_REQUEST",
                        SET_ERROR: "APP/SET_ERROR",
                        REMOVE_ERROR: "APP/REMOVE_ERROR"
                    };

                    export const actions = {    //action creators
                        startRequest: () => ({
                            type: types.START_REQUEST
                        }),
                        finishRequest: () = ({
                            type: types.FINISH_REQUEST
                        }),
                        setError: () => ({
                            type: types.SET_ERROR,
                            error
                        })，
                        removeError: () => ({
                            type: types.REMOVE_ERROR
                        })
                    };

                    const reducer = (state = initialState, action) => {
                        switch(action.type){
                            case types.START_REQUEST:
                                return {...state, requestQuantity: state.requestQuantity + 1};  //每个接收api请求开始的action rQ +1
                            case types.finishRequest:
                                return {...state, requestQuantity: state.requestQuantity - 1};  //每个接收api请求开始的action rQ -1
                            case types.SET_ERROR:
                                return {...state, error: action.error};
                            case types.REMOVE_ERROR:
                                return {...state, error: null};
                            default: 
                                return state;
                        }
                    };
                    export default reducer;
                    
                    //auth.js       登陆和注销
                    import {post} from "../../utils/request";
                    import url from "../../utils/url";
                    import {actions as appActions} from "./app";

                    const initialState = {
                        userId: null,
                        username: null
                    };

                    export const types ={
                        LOGIN: "AUTH/LOGIN",
                        LOGOUT: "AUTH/LOGOUT"
                    };

                    export const actions = {                //action creators
                        login: (username, password) => {    //异步action 执行登陆验证
                            return dispatch => {            //每个api请求前后返送app模块对应的action 
                                dispatch(appActions.startRequest());
                                const params = {username, password};
                                return post(url.login(), params)
                                    .then(data => {
                                        dispatch(appActions.finishRequest());
                                        if(!data.error){
                                            dispatch(actions.setLoginInfo(data.userId, username));
                                        }else{
                                            dispatch(appActions.setError(data.error));
                                        }
                                    });
                            },

                            logout: () => ({
                                type.types.LOGOUT
                            }),

                            setLoginInfo: (userId, username) => ({
                                type: types.LOGIN,
                                userId: userId,
                                username: username
                            })
                         };  

                        const reducer = (state=initialState, action) => {
                            switch(action.type){
                                case types.LOGIN:
                                    return {...state, userId: action.userId, uasename: action.username};
                                case types.LOGOUT:
                                    return {...state, userId: null, username: null};
                                default: 
                                    return state;
                            }
                        };

                        export default reducer;   

                    //posts.js      帖子相关状态管理
                    export cosnt types = {      //状态有新建 修改 获取帖子列表 获取帖子详情
                        CREATE_POST: "POSTS/CREATE_POST",
                        UPDATE_POST: "POSTS/UPDATE_POST",
                        FETCH_ALL_POSTS: "POSTS/FETCH_ALL_POSTS",
                        FRTCH_POST: "POSTS/FETCH_POST"
                    };  

                    export const actions = {
                        fetchAllPosts: () => {      //获取帖子咧列表
                            return (dispatch, getState) => {
                                if(shouldFetchAllPosts(getState())){
                                    dispatch(appActions.startRequest());
                                    return get(url.getPostList())
                                        .then(data => {
                                            dispatch(appActions.finishRequest());
                                            if(!data.error){
                                                const {posts, postsIds, authors} = convertPostToPlain(data);
                                                dispatch(fetchAllPostsSuccess(posts, postsIds, authors));
                                            }else{
                                                dispatch(appActions.setError(data.error));
                                            }
                                        });
                                }
                            };
                        },
                    }
                
                        fetchPost: id => {              //获取帖子详情
                            return (dispatch, getState) => {
                                if(shouldFetchAllPosts(id, getState())){
                                    dispatch(appActions.startRequest());
                                    return get(url.getPostById(id))
                                        .then(data => {
                                            dispatch(appActions.finishRequest());
                                        if(!data.error && data.length === 1){
                                            const{post, author} = convertSinglePostToPlain(data[0]);
                                            dispatch(fetchPostSuccess(post, author));
                                        }else{
                                            dispatch(appActions.setError(data.error));
                                        }
                                        });
                                }
                            };
                        },

                        createPost: (title, content) => {   //新建帖子
                            return (dispatch, getState) => {
                                const state = getState();
                                const author = state.auth.suerId;
                                const params = {
                                    author,
                                    title,
                                    content,
                                    vote: 0
                                };
                                dispatch(appActions.startRequest());
                                return post(url.createPost(), params)
                                    .then(data => {
                                        dispatch(appActions.finishRequest());
                                        if(!data.error){
                                            dispatch(createPostSuccess(data));
                                        }else{
                                            dispatch(appActions.setError(data.error));
                                        }
                                    });
                            };
                        },

                        updatePost: (id, post) => {
                            return dispatch => {
                                dispatch(appActions.startRequest());
                                return put(url.updatePost(id), post)
                                    .then(data => {
                                        dispatch(appActions.finishRequest());
                                        if(!data.error){
                                            dispatch(updatePostSuccess(data));
                                        }else{
                                            dispatch(appActions.setError(data.error));
                                        }
                                    });
                            };
                        };

                        const fetchAllPostsSuccess = (posts, postIds, authors) => ({        //获取帖子列表成功
                            type: types.FETCH_ALL_POSTS,
                            posts,
                            postIds,
                            user: authors
                        });

                        const fetchPostSuccess = (post, author) => ({            //获取帖子详情成功
                            type: types.FETCH_POST,
                            post,
                            user: author
                        });

                        const createPostSuccess = post => ({            //创建帖子成功
                            type: types.CREATE_POST,
                            post: post
                        });

                        const updatePostSuccess = post => ({    //更新帖子成功
                            type: types.UPDATE_POST,
                            post: post
                        });

                        const allIds = (state = initialState,allIds, action) => {   //reducrs
                            switch(action.type){
                                case types.FETCH_ALL_POSTS:
                                    return action.postIds;
                                case types.CREATE_POST:
                                    return [action.post.id, ...state];
                                default: 
                                    return state;
                            }
                        };

                        const byId = (stte = initialState.byId, action) => {
                            switch(action.type){
                                case types.FETCH_ALL_POSTS:
                                    return action.posts;
                                case types.FETCH_POST:
                                    //nothing
                                case types.CREATE_POST:
                                    //nothing
                                case types.UPDATE_POST:
                                    return {...state, [action.post.id]: action.post};
                                default: 
                                    return state;
                            }
                        };

                        const reducer = combineReducers({
                            allIds, byId
                        });

                        export default reducer;

                    //comments.js   获取和创建评论  类似posts   只给出主要逻辑代码
                    const initialState = {
                        byPost: {},
                        byId: {}
                    };

                    export const types = {
                        FETCH_COMMENTS: "COMMENTS/FETCH_COMMENTS",
                        CREATE_COMMENT: "COMMENTS/CREATE_COMMENT"
                    };

                    export const actions = {    //获取评论列表
                        fetchComments: postId => {
                            return (dispatch, getState) => {
                                if(shouldFetchCommetns(postId, getState())){
                                    dispatch(appActions.finishRequest());
                                    return get(url.getCommentList(postId))
                                        .then(data => {
                                            dispatch(appActions.finishRequest());
                                            if(!data.error){
                                                const{commetns, commentIds, users} = convertToPlainStructure(data);
                                                dispatch(fetchCommentsSuccess(postId, commentIds, comments, users));
                                            }else{
                                                dispatch(appActions.setError(data.error));
                                            }
                                        });
                                }
                            };
                        },
                        
                    

                        createComment: comment => { //新建评论
                            return dispatch => {
                                dispatch(appActions.startRequest());
                                return post(url.createComment(), comment)
                                    .then(data => {
                                        dispatch(appActions.finishRequest());
                                        if(!data.error){
                                            dispatch(createCommentSuccess(data.post, data));
                                        }else{
                                            dispatch(appActions.setError(data.error))
                                        }
                                    }); 
                            };
                        },

                        const fetchCommentsSuccess = (postId, commentIds, comments, users) => { //获取评论列表成功
                            type: types.FETCH_COMMENTS,
                            postId, 
                            commentIds,
                            comments,
                            users
                        };

                        const createCommentSuccess = (postId, comment) => ({    //新建评论成功
                            type: types.CREATE_COMMENT,
                            postId, 
                            comment
                        });

                        const byPost = (state = initialState.byPost, cation) => {       //reducers
                            switch (action.type){
                                case types.FETCH_COMMENTS:
                                    return {...state, [action.postId]: action.commentIds};
                                case types.CREATE_COMMENT:
                                    return {
                                        ...state,
                                        [action.postId]: [action.commetn.id, ...state[action.postId]]
                                    }
                                default:
                                    return state;
                            }
                        };

                        const byId = (state =initialState.byId, action) => {
                            switch (action.type){
                                case types.FETCH_COMMENTS:
                                    return {...state, [action.comment.id]: action.comment};
                                case types.CREATE_COMMENT:
                                    return {...state, [action.comment.id]: action.comment};
                                default:
                                    return state;
                            }
                        };

                        const reducer = combineReducers({
                            byPost,
                            byId
                        });
                        
                        export default reducer;
                    
                    
                    //users.js      维护用户信息   不需要定义actiontype ，action creators  它相应的action都来自posts comments
                    import { types as commentTypes } from "./comments";
                    import  { types as postType } from "./posts";

                    const initialState = {};
                    const reducer = (state=initialState, action) => {
                        switch(action.type){        //获取帖子、评论的列表时， 更新列表数据库中包含的作者信息
                            case commentTypes.FETCH_REMAKES:
                            case posstTypes.FETCH_ALL_POSTS:
                                return {...state, ...action.users};
                            case postTypes.FETCH_POST: //获取帖子详情时， 只更新当前帖子的作者
                                return {...state, [action.user.id]: action.user};
                            default: 
                                return state;
                        }
                    };
                    export default reducer;

                    
                    //ui.js         帖子对话框状态
                    import {types as postTypes} from "./posts";
                    
                    const initialState ={
                        addDialogOpen: false,
                        editDialogOpen: false
                    };

                    export const types = {
                        OPEN_ADD_DIALOG: "UI/OPEN_ADD_DIALOG",      //打开新建帖子状态
                        CLOSE_ADD_DIALOG: "UI/CLOSE_ADD_DIALOG",    //关闭新建帖子状态
                        OPEN——EDIT_DIALOG: "UI/OPEN_EDIT_DIALOG",   //打开编辑帖子状态
                        CLOSE_EDIT_DIALOG: "UI/CLOSE_EDIT_DIALOG",  //关闭编辑帖子状态
                    }

                    export const actions = {    //打开新建帖子的编辑框
                        openAddDialog: () => ({
                            type: types.OPEN_ADD_DIALOG
                        }),
                        closeAddDialog: () => ({
                            type: types.CLOSE_ADD_DIALOG
                        }),
                        openEditDialog: () => ({
                            type: types.OPEN_Edit_DIALOG
                        }),
                        CLOSE_EDIT_Dialog: () => ({
                            type: types.CLOSE_EDIT_DIALOG
                        }),
                    };
                    
                    const reducer = (state = initialState, action) => {
                        switch (action.type){
                            case types.OPEN_ADD_DIALOG:
                                return {...state, addDialogOpen: true};
                            case types.CLOSE_ADD_DIALOG:
                            case postTypes.CREATE_POST:
                                return {...state, addDialogOpen: false};
                            case types.OPEN_EDIT_DIALOG_DIALOG:
                                return {...state, editDialog: true};
                            case types.CLOSE_EDIT_Dialog_DIALOG:
                            case types.postTypes.UPDATE_POST:
                                return {...state, editDialogOpen: false};
                   			default:
										return state;
						}
                    };

					export default reducer;

                    //index.js      Redux的根模块 将其他模块的reducer合并为一个根reducer					
					import {combinReducers} from "redux";
					import app from "./app";
					import auth from "./auth";
					import ui from "./ui";
					import comments from "./comments";
					import posts from "./posts";
					import users from "./users";

					const rootReducer = combinReducers({		
						app,
						auth,
						ui,
						posts,
						comments,
						users
					});
					export default rootReducer;

					//containers/PostList/index.js   		   
					const getPostList = state => {
						return state.posts.allIds.map(id => {
							return state.posts.byId[id];
						});
					};

					const  mapStateToProps = state => {
						return {
							user: state.auth,
							posts: getPostList(state),
							isAddDialogOpen: state.ui.addDialogOpen
						};
					};

					//redux/modules/auth.js
					export const getLoggedUser = state => state.auth;

					//redux/modules/ui.js
					export const isAddDialogOpen = state => {
						return state.ui.addDialogOpen;
					};

					//redux/modules/index.js
					import {getPostIds, getPostById} from "./posts";
					import {getUserById} form "./users";

					export const getPostListWithAuthors = state => {
						const postIds = getPostIds(state);
						return postIds.map(id => {
							const post = getPostById(state, id);
							return {...post, author: getUserById(state, post.author)};
						});
					};

					//containers/PostList/index.js
					import {getLoggedUser} from "../../redux/modules/auth";
					import {isAddDialogOpen} from  "../../redux/modules/ui";
					import {getPostListWithAuthors} from "../../redux/modules";

					const mapStateToProps = (state, props) => {
						return {
							user: getLoggedUser(state),
							posts: getPostListWithAuthors(state),
							isAddDialogOpen: isAddDialogOpen(state)
						};
					};

					//containers/PostList/index.js
					import {bindActionCreators} from "redux";
					import {actions as postActions} from "../../redux/modules/posts";
					import {actions as uiActions} from "../../redux/modules/ui";

					const mapDispatchToProps = dispatch => {
						return {
							...bindActionCreators(postActions, dispatch),
							...bindActionCreators(uiActions, dispatch)
						};
					};

					//containers/PostList/index.js
					import  {connect} from "react-redux";
					
					//index.js
					import React from "react";
					import ReactDOM from "react-dom";
					import {Provider} from "react-redux";
					import configureStore from "./redux/configureStore";
					import App from "./containers/App";

					const store - configureStore();
					ReactDOM.render(				//add store by Provider
						<Provider store={store}>
							<App />	
						</Provider>,
						document.getElementById("root")
					);

					//it Done !!!


            

//mobx  	
	//modle:	action -> state ->views	
	//pass
