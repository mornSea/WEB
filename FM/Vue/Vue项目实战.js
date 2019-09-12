// 基础
    //1.3 第一个应用    (html略， 只是vue要放body中， 最好在body之首)
        var app = new Vue({     //新建Vue实例
            el: '#root',        //根dom的CSS选择器  找到id为root的元素 设为应用的根
            data(){             //数据
                return {            
                    message: 'Hello, Vue',
                }
            },
        })

        app.$mount('#root');    //如果app没有用el选项， 可以在外面用$mount挂载DOM中
        //开发者工具：chrome的Vue。js devtools 方便看Vue应用运行情况 + Allow access to fileURL  = 监控本地文件  添加name选项 便于找具体应用  

    //用模板实现DOM动态性，
        //文本插值   数据绑定
        <div id="root">
            <p>{{ message }}</p>
        ///指令添加基本操作  （将input的值）双向数据绑定  
        <input v-model="message" />
        </div>



//makedown notebook
    //划分为三部分： （从左到右） 笔记列表+添加笔记按钮  笔记编辑器  预览板

    //开发历程：   （先实现基本的， 再一点点往上面添加库/效果/功能  （这是一个不断迭代的过程）） 
        //基本笔记编辑器：
            //先写下基础的html和vue应用
            //添加主功能区的主功能-笔记编辑区 并添加数据绑定（v-model） ；  
            //预览区： 添加效果库，并应用到另一个dom（computed） + 显示转换后（v-html）; 
            //保存笔记：监听改变（watch） + 保存数据（method + localStorageAPI） + 访问实例（this.content）
            //加载已保存： 生命周期钩子（created） / 数据中直接初始化  （data中三元赋值）

        //多条笔记：
            //笔记列表：
                //添加侧边栏 （其中有笔记列表 添加笔记按钮 重命名文本框 收藏笔记的开关）
                //先添加 aside元素 + 数组属性（data） 
                //再添加新建笔记方法: 靠一个拥有几个数据属性和一个添加笔记方法的对象(id+title+content+created+favorite + addNote())
                //添加点击事件（v-on）  + 绑定属性 （v-bind）
                //递归显示列表 （v-for）
            //选中笔记时： 
                //先添加属性（data） + 选择ID（methods） + 监听事件（v-on） = 知道选中那个了 ，然后
                //替换content： 返回匹配笔记（computed） + 模板中修改编辑器（v-module） + 返回三元赋值（computed）= 可以显示， 再
                //添加显示效果： 动态CSS类(v-bind) 
                //条件模板： 用动态模板决定哪些模板不应该出现（v-if）
                //保存笔记： 将数组对象转为字符串保存（localStorageAPI + JSON.stringify） + 添加新建笔记监听器（watch） + 初始化时加载笔记（data钩子） + 开启deep模式（watch中deep：true）
                //恢复上次打开的笔记： 保存并加载一个数据属性（watch + data）
            //工具栏：
                //重命名：将文本输入框和选中笔记的title绑定（v-module）
                //删除：  重命名框后加个button（v-on）+ 调用删除方法（methods）
                //收藏：  删除按钮前再加个按钮（v-on + 文本插值） + 点击调用方法反转favorite布尔值（methods）+ 用计算属性排序（computed） + 修改递归展出（v-for） + 修改笔记列表html添加icon + 动态显示图标（v-if）
            //状态栏：
                //用于显示一些信息（日期 / 字数 / 单词数 / 字符数）
                //日期过滤器： 用div和span显示变量（文本插值） + 引入库（momentjs） + 创建对象使用方法（moment(time).format()） + 创Vue过滤器返可读格式（Vue.flter） + 修改状态模板 
                //文本统计：   创建三个计算属性（computed中三个方法 + 正则表达式split） + 添加到span（文本插值）

//游戏 （略）
    //小结：
        //大型应用时 将前端逻辑划分为小的 独立的 可重用的组件
        //组件之间的通信方法： 用prop从父到子， 用自定义事件从子到父
        //用<transition>, <transition-group>特殊组件添加动画和过渡
        //可以在模板里操作SVG， 用<component>特殊组件可以动态显示组件

//高级项目
    //开发环境：vue-cli + babel + babel-polyfill + npm
        //安装@vue/cli-init  用vue-init webpack-simple projectname  创建 + 进入项目文件夹， npm instll
        //删除src/下所有内容， 添加main.js， 填写内容（引入vue + vue实例） +  npm run dev  运行
            render: h => h("div", "hello world")    //vue实例的渲染函数（选项）中， 显示包含文本的div
            //h是createElement的别名，三个参数（二三可选）： 元素类型（标签/组件）， 数据对象（属性/prop/事件监听）， 显示数据（文本/h创建其他元素数组、）
            render(h){  //如下渲染函数， 就是渲染了一个ul， 以及其中的几个子li
                return h('ul', {'class': 'movies'},[
                    h('li', {'class': 'movie'}, 'Star Wars'),
                    h('li', {'class': 'movie'}, 'Blade Runner'),    
                ])
            }
        //npm i -D babel-preset-vue   打开.babelrc文件， 并将vue预设添加{ "presets": [ ["env", {"modules": false}], "stage-3", "vue" ] }
        //npm i -D babel-polyfill  并在src/main.js 文件开始导入 import 'babel-polyfill' （为浏览器）
        //手动更新依赖的包： 先检查npm outdated， 再npm install； 或者直接自动更新： npm update； 且vue 和vue-template-compiler应始终版本相同
        //如果要投入生产（放服务器上）， 就使用npm run build ； 将webpack输出到的dist文件夹和项目根目录下的index.html上传即可 (由于包很多， 所以哪怕没引用多少也非常大)


    //单文件组件可以包含（同时）三种类型的根块： template / script / style ，   其中脚本的开头不是new Vue（{}）， 而是export default{}
    //<template lang="pug"> 并安装pug pug-loader   即可编译到html；     如果用JSX 可以在花括号内使用任何js表达式  有助于编写渲染函数
    //如果要在main中引入vue组件， 只要main。js头引入， 并在el下用展开运算符复制组件 ...componentName            
    //无论使用sass / less 都要安装这个库+加载器， 并在style根节点中 使用<style lang="sass">  
    //样式组件可以带域（scoped）将作用域限定在当前组件， 或使用类名称 以避免和其他部分冲突， 用lang可以指定为预处理语言（sass，less，stylus）
    //组件内的组件： 在父级组件中引入子组件 + 使用对象设置components:{}选项（其中键是将在模板中使用名称， 值是组件定义）代替data（）{return{}} 将一些组件暴露给模板， 
        // 如果用JSX，子组件头字母大写就行  + 可以直接通过子组件标签使用 (不用插值， 直接一个带v-for :key :components设置的键 的子组件就可以代替）


//支持中心（路由， fetch，vue插件， mixin）
    //安装和初始化同上面一样， 分为六个页面： 主页面， 公共F&Q， 登录， 工单， 发送新工单， 显示工单详情和对话
    //安装和引入vue-router， 并创建路由：
        //创建布局并导入：       创建AppLayout.vue中的template里，加入<router-view>标签， main.js里导入并渲染到根实例上 （el后 render: h => h(AppLayout)）
        //创建路由页面并导入：    如home.vue等几个页面组件， 并在router.js中导入 + 创建一个const的路由数组（routes）， 其中路由元素用对象表示， 每一个有path， name， component三个键值对
        const routes = [
            {path: '/', name: 'home', component: Home},
            {path:'/faq', name: 'faq', component: FAQ},
        ]babelrc    
        //创建路由器对象管理路由： 在router.js中，使用VueRouter（option对象）创建路由对象， 
        const router = new VueRouter({routes});     //用上面的routes数组对象为参数
        export default router                       //导出router为模块的默认导出值
        //加入路由选项：         在main.js中导入router， 在render后， 加入router,  
        //摆脱路由后面的#号：     通过在router.js使用H5的history.pushState API，  将创建路由对象改为(只支持IE9以上)：
        const router = new VueRouter({routes, mode: 'history'});
        //创建导航菜单并导入：    component/NavMenu.vue, 其中template里有对NavMenu标签，在AppLayout中导入，并用components选项暴露+添加到AppLayout模板
        //路由器链接：           使用<router-link>组件， 点击时路由改变（类似a）， 要配合:to prop使用， 如下， 将几个组件的路由添加到NavMenu中
        /* <router-link :to="/">Hoem</router-link>     //使用路径
        <router-link :to={name: faq}>FAQ</router-link> //使用name键值对*/
    
    //高级路由特性： 
        //添加组件Ticket.vue 通过ID显示工单的详细视图（标题，说明，日期，状态）
            //然后在要使用这个组件的其他文件中导入 Ticket， 设置导出对象（export default{}）中：components：{Ticket}，   data(){return{id: null}};  
            //再在模板中使用Ticket标签，并添加属性  v-if="id" :id="id" ;     
            //链接（工单）列表中，链接（工单）标题设为title，并当链接被点击时设置id属性为某具体（工单）的id值   <a @click="id = ticket._id">{{ticket.title}}</a>
        //动态路由： 做一个（工单）列表路由的子路由， 路径/ticket/<id> ; id是所显示（工单）的id， 
            //得益于vue-touterd动态路由匹配功能：可以用冒号将动态片段添加到路由路径中，然后每个片段暴露在路由params对象中， （路由中的替换）
            //router.js 中为/tickets添加子路由: 即引入Tickte 在routes加入一条 ticket
            //在Tickets组件列表中， 将标题元素的链接指向新路由  <router-link :to="{name:'ticket', params:{id: ticket._id}}">{{ticket.title}}</router-link>
            //将Ticket组件修改为使用计算属性 而不是prop使用ID：  computed:{id(){return $route.params.id}}  但是这样路由和组件就耦合了
            //再修改为 用prop将信息传递给组件（保留之前的prop）， 告诉vue-router用props属性将所有路由参数作为prop传递给它{path: ':id', /* ... */, props: true), 或将props修改为灵活的 props：route => ({id: route.parms.id})},
        //写一个NotFound.vue 作为未找到页面， 也在router.js引入， routes中用通配符*匹配所有不在routes的url： {path: *, component: NotFound}
        //对路由变化添加过渡动画， easy：使用AppLayout中 用过渡组件 包装路由器视图 router-view将被不同路由的不同组件取代 触发过渡 <transition name="fade" mode="out-in"><router-view /></transition>  
        //页面滚动： 路由器的history模式允许路由改变时管理页面滚动， 可以每次将位置重置为最高位置， 或在更改路由之前恢复用户的位置（浏览器中返回时有用）
            //传递一个scrollBehavior函数获取三个参数： to目标路由对象， from之前路由， savedPostion浏览器历史记录的条目自动保存的滚动位置 在路由改变之前每个新条目不会有这个值
            //返回的值可能是x：y的坐标轴 或 滚动到的html的元素选择器+可选的偏移量，  so 要在路由改变时移动到页面的顶部， 要：
            const router  =  new VueRouter({    //先设置vuerouter模式和使用scrollBehavior
                routes,
                mode: 'history',
                scrollBehavior(to, from, savedPostion){
                    return {x:0, y: 0}
                },
            })
            return {selector: 'h1'} //滚动到h1
            if(to.hash){            //检查路由是否有模仿浏览器行为的散列值：
                return {selector: to.hash}
            }
            return {x:0, y: 0};
            if(savedPostion){       //如果有滚动位置， 则恢复到滚动位置
                return savedPostion
            }
            if(to.hash){
                return{selector: to.hash}
            }
            return {x:0, y:0}

    //使用浏览器标准fetch API从服务器获取数据：
        //FAQ文件的script中添加预设的questions数组和error对象
        export default {data(){return {questions: [],   error: null}}}
        //通过v-for循环向模板添加问题和答案 + 错误提示(v-if="error")
        //通过promise方法使用fetch
        fetch(url).then(response => {
            if(response.ok){    //返回一个新的promise
                return response.json()
            } else {
                return Promise.reject('error')
            }
        }).then(result => {     //成功
            console.log('JSON:', result)
        }).catch(e => {         //失败
            console.error(e)
        })
        //组件创建后生成请求， 即在data后使用生命周期钩子， 里面使用fetch  
        new Vue ({el: '#app', data: {},     created(){/* 上面的fetch代码 */}, })
        //可以使用async和await重写fetch， 使其看起来像同步, 
        async created(){   
            try{   
                const response = await fetch('http://localhost:3000/questions')   
                if(response.ok){   
                    this.questions = await response.json()   
                }else{   
                    throw new Error('error')   
                }   
            } catch(e){   
                this.error = e   
            }   
        }   
        //改为适合在插件使用的方法
        export async function $fetch(url){
            const response = await fetch(`${baseUrl}${url}`)
            if(response.ok){
                const data = await response.json()
                return data
            }else{
                const error = new Error('error')
                throw error
            }
        }
    
    //创建一个vue插件， src/plugin/fetch.js, 将上面的fetch单独设置为可复用的插件， 插件对象都需要一个install方法，参数为Vue（构造函数）和可选的option
        let baseUrl;
        export default {
            install (Vue, options){
                console.log('Installed!');
                baseUrl = options.baseUrl;
                Vue.prototype.$fetch = $fetch
            }
        }
        //使用插件：    main.js中 
        import VueFetch from './plugin/fetch'
        Vue.use(VueFetch);
        //在FAQ组件中使用
        this.loading = true
        try {
            this.questions = await this.$fetch('questions')
        }
        catch(e){
            this.error = e
        }
        this.loading = false
    
    //使用mixin复用代码  （多个组件中复用组件定义 如计算属性 方法 监听器）：
        //一个新文件中， 导出一个带数据的定义, 下面的remoteDataLoading用于计算正在加载的请求量，
        export default{
            data(){
                return{
                    remoteDataLoading: 0
                }
            }
        }
        //FAQ组件中导入上面的文件， 然后默认导出对象中  mixins: [RemotData]， 这样就mixin合并到FAQ组件的定义中（但是data钩子调用两次）， 如有同名，mixin被覆盖
        //可以将一些共用的数据 方法放到mixin中， 也可以直接定义为函数对象 
        export default function(resources){return {data(){return{/* someData */}}}}
        //对应的在FAQ组件中， mixin的数组里 使用函数调用方式（如获取questions), 
        mixin: [RemoteData({questionList: 'questions'})]
        //然后为了mixin更智能， 可以在created钩子中自动调用它里面的方法  














































//博客地图：使用ｖｕｅｘ集中管理状态，　用ｖｕｅ－ｇｏｏｇｌｅｍａｐ将谷歌地图集成到应用，　渲染函数＋ＪＳＸ，　函数组件（轻量　快速）
    //获取谷歌认证与使用ｖｕｅｘ
        //安装与准备:  
            //npm i --save vue-router babel-polufill; npm i --save-dev stylus stylus-loader babel-preset-vue;　npm i -S moment(日期)；  babelrc里＂stage-3＂后加入"vue"
            //src　下编写main.js，　引入各种包，　创建ｖｕｅ实例，　和用一个过滤器做过滤器函数，　 过滤所有ｋｅｙ为输入参数ｋｅｙ的，　
            //使用VueFetch将3000设置为ｂａｓｅＵｒｌ，　将Ｖｕｅ根实例放到函数(函数组件？)中，并继承App.vue + 将渲染函数替换为ｒｏｕｔｅｒ
            //如同ｍａｒｋｄｏｗｎ一样，src/filter.js　创建一个日期过滤器，　使用ｍｏｍｅｎｔ包中的format格式化方法
            //在$ｆｅｔｃｈ插件中移除对ｓｔａｔｅ．ｊｓ的引用，　并删除４０３状态码对应的处理，　
        //路由配置：　　由登录，主页面，４０４，三个主要页面组成
            //src/components，　新建ＮｏｔＦｏｕｎｄ.vue(在路由最后　匹配所有), App.vue, GeoBlog.vue  
            //添加对应的Login.vue，添加sign with google按钮，　绑定点击事件到(组件下的)openGoogle-Signin方法；　
            // src/router.js　包含home，login，404三个路由, 被main.js引入

        //使用Ｖｕｅｘ状态管理(过多的功能和组件，其中很多又要共享数据时使用，只使用store这一集中数据源)
            //介绍：　state存储状态的响应试数据对象  getter类似store的计算属性  mutation改变状态的函数  action调用异步ＡＰＩ，之后用ｍｕｔａｔｉｏｎ改变数据
            //例子：－Ｓ按照vuex，　创建store文件夹添加index.js:
            import Vue from 'vue'
            import Vuex, { mapGetters, mapActions } from 'vuex'
            Vue.use(Vuex)                   //使用ｖｕｅｘ

            const store = new Vuex.store({  //创建ｓｔｏｒｅ
                //TODO选项
            })
            
            export default store            //像之前导出路由器一样导出

            import store from './store'     //导入store到main.js

            new Vue({                       //为了在应用中生效，　要像注入路由器一样注入它
                ...App,
                el: "#app",
                router,
                store
            })

            this.$store                     //本应用下所有组件都可以用$store这个属性访问

            //state是唯一数据源，　（store组成部分）,　 只读，　只能通过mutation修改
            const store = new Vuex.stoer({  //添加ｓｔａｔｅ函数，　它只返回一个对象　
                state(){
                    return {                //初始化ｕｓｅｒ这个属性    (用组件读取状态）
                        user: null
                    }
                }
            })

            const store = new Vuex.Store({
                state(){/* ... */},
                mutations: {                //创建mutation:　
                    user: (state, user) => {//类型为'user'，对应的（匿名）处理函数负责更新state中的用户
                        state.user = user
                    },
                },
            })

            store.commit('user', userData)  //触发mutation的词叫提交（commit）, 通过store触发对应于某个具体类型mutation

            const store = new Vuex.Store({  //使用严格模式，避免在ｍｕｔａｔｉｏｎ中使用异步，　（有则抛错）
                strict: true,
                // ...
            })

            const store = new Vuex.Store({
                //...
                getters: {
                    user: state =>state.user
                }
            })


            const store = new Vuex.Store({            //为了方便调试，生产环境中可以设置为严格模式， 避免mutation异步调用
                strict: true,    //调试用，         另外 可以在vue的浏览器调试工具中-vuex选项卡里， 看到所有状态的修改记录，可选择回退（TimeTravel时间旅行）
                /* 。。。 */
            })
            this.$store.state.user = userData           //这样就可以直接修改 会报错因为没有在mutation里修改
              
             


            /* 使用vue */
            <template>                      {/* AppMenu.vue, 展示用户信息　和按钮   */}       
             <div class="app-menu">
                    <div class="hender" >
                        <i class="material-icons">place</i>
                        GeoBlog
                    </div>
                </div>
                <div class="user">
                    <div class="info" v-if="userPicture">
                        <img :src="userPicture" />
                        <span class="username">
                            {{ user.profile.displayName }}
                        </span>
                    </div>
                </div>
                <a @click="centerOnUser">
                    <i class="material-icons">My_location</i>
                </a>
                <a @click="logout"> 
                    <i class="material-icons">power_settings_new</i>
                </a>
            </template>
            <script>
                export deault{
                    computed: {
                        user(){             //ｕｓｅｒ对象将接收ｇｏｏｇｌｅ返回的ｐｒｏｆｉｌｌ属性，　包含用户姓名和头像
                            return this.$store.state.user
                        },
                        userPicture(){
                            return null //TODO
                        },
                    },
                    methods: {
                        centerOnUser(){
                            //TODO
                        },
                        logout(){
                            //TODO
                            if(!this.user){
                                const userData = {
                                    profill : {
                                        displayName: "Mr Cat",
                                    },
                                }
                                this.$store.commit('user', userData)
                            } else {
                                this.$store.commit('user', null)
                            }
                        },d
                    },
                }
            </script>

            ＜template>     {/* GeoBlog.vue组件中使用AppMenu.vue */}   
                <div class="geo-blog">
                    <AppMenu />     {/* 地图和内容 */}
                </div>
            </template>
            <script>
                import AppMenu from './AppMenu.vue'
                export default{
                    components: {
                        AppMenu,
                    },
                }
            </script>
            //使用getter计算和返回数据  （类似store的计算属性）
            const store = new Vuex.Store({
                //...
                getters: {                          //getters里面的都是getter， 用key为getter名， 如user getter
                    user: state => state.user,      //这是一个返回state中用户的getter
                    userPicture: () => null         //为之后谷歌的图片数据做准备
                },
            })
             
                //配合在Appmenu.vue中， 使用getter之前获取状态的方法， 使用userPictue
            user(){
                return this.$store.getters.user,
            },
            userPicture(){
                return this.$store.getters.userPicture,
            },
            

            //用action操作store：   action并不直接修改状态， 而是提交mutation， 还可以异步； 
            //类似mutation， 声明由类型和处理函数构成， 处理函数不能直接调用， 要用store.dispath()分发一个action类型
            //action的处理函数接受两个参数： context：提供commit dispatch state getters，  payload：dispatch分发时带上的参数
            const store = new Vuex.Store({      //创建两个action， 类型分别为login和logout  （就是函数名）
                //...
                actions: {                      //所以action除了是要在actions里的函数， 参数是context payload等方法，并在函数体内使用？  然后在组件中用dispatch（action名字）的方法调用？ 
                    login({commit}){            
                        const userData = {
                            profile: {
                                displayName: "Mr Cat",
                            },
                        }
                        commit('user', userData)
                    },
                    logout({commit}){
                        commit('user', null)
                    },
                }
            })
                //AppMenu.vue中 在按钮事件处理函数中 加上测试代码(使用action登录)
            methods: {              //类似getter， 组件中， 总是应该用getter 和 action， 而不是mutation 
                centerOnUser(){     //action =》 逻辑的抽象 of VUEX
                    //TODO
                    this.$store.dispatch('login')
                },
                logout(){
                    this.$store.dispatch('logout')
                },
            }
            
            //辅助函数， 在组件中只应该使用getter计算属性 action方法， 以及 供添加到组件的辅助方法 mapGetter mapAction， 
            //这些函数帮我们生成这两种， 所以不用每次this.$store.getters/dispathc, 
            //参数可以是类型的数组：每个元素对应组件中的同名数据， 或  对象：key是组件数据的别名， 值是类型， 
            mapGetters(['a', 'b'])      //第一种， 等价于：
            {
                a() {return this.$store.getters.a},
                b() {return this.$store.getters.b},
            }
            mapGetters({x: 'a', y: 'b'})//第二种， 等价于：
            {
                x(){return this.$store.getters.a}
                y(){return this.$store.getters.b}
            }
                //在AppMenu.vue中使用辅助函数, （修改）实现与之前action getter一样的功能
            import {mapGetters, mapAction} from 'vuex'
            export default{             //注意 在组件中使用时， 这两个辅助方法 要前面加个类型 computed/mehtods
                computed: mapGetters([
                    'user',
                    'userPicture',
                ]),
                methods: mapActions({
                    centerOnUser: 'login',
                    logout: 'logout',
                }),
            }
        
        //添加用户系统， 以便用户通过google帐号登录/退出
            //google开发者面板配置新项目：
            /*  打开console.developers.google.com， 选择项目中创建新项目， 命名，选中
                进入API和服务库， 点击社交下方的Google+API， 进入页面后 点击启用（获取Google+用户数据） 
                进入API和服务库， 选择OAuth 填写表单，与向用户显示的产品名，
                选中凭据，点击创建凭据， 选中OAuth客户端ID, 类型为网页，
                输入url， 输入http://localhost:3000, 回车， 再接着输入/auth/google/callback, 回车进入服务器特殊路由 最后再按创建
                将包含客户端ID和密钥的凭证复制/下载， 有这个可以看到用户登录信息， 不能给项目之外的人
                下载API服务端代码（书项目chapter6-full/server）， 解压到Vue app下， 使用npm install 安装服务器依赖
                用下载的凭证来配置  export GOOGLE_CLIENT_ID=XXX,  export GOOGLE_CLIENT_SERVER=XXX, 如果是windows， 将export改为set， 每次新终端启动服务器时 都要重新配置
                npm run start  
            */
            // 登录按钮   
                //登录逻辑： 打开google登录页的弹框，先载入nodejs服务器的一个路由； 重定向google授权页面 登录成功后； 弹框再重定向到nodejs， 在自动关闭前发送消息到主页面 
                //在Login.vue中找到openGoogleSignin方法， 添加打开 /auth/google路由弹框的逻辑， 这会重定义到google
                openGoogleSignin(){
                    const url = 'http://localhost:3000/auth/google'         
                    const name = 'google_login'
                    const specs = 'width=500, height=500'
                    window.open(url, name, specs)
                },
                //检查google返回的数据
                handleMessage({data, origin}){
                    if(origin !=='http://localhost:3000'){      //代表我们的node服务器端口
                        return
                    }
                    if(data === 'success'){
                        this.login
                    }
                },
                //获取用户数据准备， 要分发类型为login的action
                import {mapActions} from 'vuex'
                export default{
                    methods: {
                        ...mapActions([
                            'login',
                        ]),
                        //...
                    },
                }
                //使用mounted生命周期钩子 监听window
                mounted(){
                    window.addEventListener('message', this.handleMessage)
                }
                //销毁时移除监听器
                beforeDestroy(){
                    window.removeEventListener('message', this.handleMessage)
                }
            //store中的用户，   实现action中login/logout， 并添加打开时加载用户会话 并显示头像等功能
                //实现login action，（需要导入$fetch）
                async login({commit}){
                    try{
                        const user = await $fetch('user')       //登录主要靠fetch（通过凭证）请求到数据
                        commit('user', user)
                        if(user){       //重定向到对应路由 or 首页
                            router.replace(router.currentRoute.params.wantedRoute || {name: 'home'})
                        }
                    } catch (e){
                        console.warn(e)
                    }
                },
                //logout，  即向服务器发出logout请求， 如路由为私有， 则跳转到登录
                logout({commit}){
                    commit('user', null)
                    $fetch('logout')
                    if(router.currentRoute.matched.some(r => r.meta.private)){  //检查路由， 根据之前router。js配置， 用户在home时跳转到登录
                        router.replace({name: 'login', params: {
                            wantedRoute: router.currentRoute.fullPath,
                        } })
                    }
                }.
                //植入导航守卫， 进行路由适配， 用户登录后才能进入私有路由
                import store from  './store'
                router.beforeEach((to, from, next) => {
                    console.log('to', to.name)
                    const user = store.getters.user
                    if(to.matched.some(r => r.meta.private) && !user){
                        next({
                            name: 'login',
                            params: {
                                wantedRoute: to.fullPath,
                            },
                        })
                        return 
                    }
                    if(to.matched.some(r => r.meta.guest) && user){
                        next({name: 'home'})
                        return
                    }
                    next()
                })
                //调整fetch插件，  以对应新的应用需求
                import store from '../store'
                }else if(response.status === 403){  //如会话过期要求重新登录
                    store.dispatch('logout')
                }
                //启动时检查用户会话， 使用init action  用它分发一个login action， 但最终可能有分发多个action
                actions: {
                    async init ({dispatch}){
                        await dispatch('login')
                    },
                    //...
                },
                    //main.js 分发init action 并等待完成
                async function main(){              //现在 不用返回登录界面就可以通过Google登录并刷新页面
                    await store.dispatch('init')
                    new Vue({
                        ...App,
                        el: '#app',
                        touter,
                        store,
                    })
                }
                main()
                //用户头像  userPicture getter, 它会返回Google个人资料中photos数组的第一个元素
                userPicture:(state, getters) => {
                    const user = getters user
                    if(user){
                        const photos = user.profill.photos
                        if(photos.length !=0){
                            return photos[0].value      //可能是一个url  或者把图片64位编码到返回数据， 或者是图片的字节数组， 但是dataurl每次都要重新缓存
                        }
                    }
                }
            //同步store和路由
            npm i -S vuex-router-sync               //路由集成到store
            import {async} from 'vuex-router-sync'  //导入main。js的sync方法
            sync (store, router)                    //可以使用store.router获取当前路由， 并可以时间旅行调试


    //嵌入地图（安装　添加，　链接）
        //安装vue-googlemaps， 在google开发者面板中， 在API和服务 库， 单击地图下的Google Maps Javascript API， 点击启动， 然后到凭证选项卡创建新的API密钥
        //主文件main.js中， 使用密钥启动googlemaps：
        import VueGoogleMaps from 'vue-googlemaps'
        Vue.vue(VueGoogleMaps, {
            load: {
                apiKey: '刚才获取的密钥',
                libraries: ['places'],              //指明加载googlemaps的places库，有助展示地址信息
            },
        })

        //App.vue  添加库的样式文件
        <style lang="stylus">
            @import '~vue-googlemaps/dist/vue-googlemaps.css'
            @import '../styles/main'
        </style>

        //创建BlogMap.vue 以添加地图（并设置center和zoom属性）
        <template>
            <div class="blog-map">
                <googlemaps-map  
                    :center="center" 
                    :zoom="zoom" 
                    :options="mapOptions" 
                    @update:center="setCenter" 
                    @update:zoom="setZoom" 
                />
            </div>
        </template>
        <script>
            export default {
                data(){
                    return {
                        center: {           //设置初始化坐标？
                            lat: 48.8538302,
                            lng: 2.2982161,
                        },
                        zoom: 15,
                    }
                },
                computed: {
                    mapOptions(){
                        return {
                            fullscreenControl: false,
                        }
                    },
                },
                methods: {
                    setCenter(value){
                        this.center = value,
                    },
                    setZoom(value){
                        this.zoom = value
                    },
                },
            }
        </script>

        //将其添加到GeoBlog。vue中
        <template>
            <div class="geo-blog">
                <AppMenu />
                <div class="panes">
                    <BlogMap />
                    {/* 其他内容 */}
                </div>
            </div>
        </template>

        //将BlogMap连接到store：
            //1, Vuex模块， 创建maps模块（以及之后会创建posts评论模块）
                // store/maps.js  导出默认模块定义，包括地图的state
                export default{
                    namespaced: true,               //告诉Vuex在该模块的所有getter， mutation， action前添加maps/， 还会在模块内的commit和dispatch调用中添加它们
                    state(){
                        return {
                            center {
                                lat: 48.8538302,
                                lng: 2.2982161,
                            },
                            zoom: 15,
                        }
                    },
                }
                //为了将模块添加到store， 在store/index.js modules选项添加她
                import maps from './maps'
                const store = new Vuex.Store({
                    //...
                    modules: {
                        maps,
                    },
                })
                //添加getter：
                getters: {
                    center: state => state.center,
                    zoom: zoom => state.zoom,
                },
                //几种使用方式(加上命名空间)
                this.$store.getters['maps/center']

                mapGetters({
                    center: 'maps/center'
                })
                
                ...mapGetters('maps', [             //指定命名空间
                    'center',
                ])

                import {createNamespacedHelpers} from vuex
                const {mapGetters} = createNamespacedHelpers('maps')
                export default{                     //使用createNamespacedHelpers方法生成基于命名空间的辅助函数
                    computed: mapGetters([
                        'center'
                    ])
                }
                //访问全局元素 在命名空间模块的getter中访问到根状态和根getter（所有getter）
                someGetter: (state, getters, rootState, rootGetter) => {/* ... */}
                myAction ({dispatch,commit, getters, rootGetter}){      //使用rotGetter访问上下文， commit/dispatch使用{root：true}访问root下
                    getters.a,      // maps/a
                    rootGetter.a    // a
                    commit('someMutation')  //maps/someMutation
                    commit('someMutation', null, {root: true})  // someMutation 
                    dispatch('someAction')  //maps/someAction
                    dispatch('someAction', null, {root: true})  // someAction
                }
            
            //BlogMap模块和组件： 绑定maps组件
                // maps.vue中添加center和zoom 两个mutation
                mutations: {
                    center(state, vaule){
                        state.center = value
                    },
                    zoom(state, value){
                        state.zoom = value
                    },
                },
                //设置提交mutation的action
                actions: {
                    setCenter({commit}, value){
                        commit('center', vulue)
                    },
                    setZoom({commit}, value){
                        commit('zoom', vulue)
                    },
                }
                // BlogMap.vue 使用辅助函数映射getter和action, 之后就可以用vuex stoer管理地图状态
                import {createNamespacedHelpers} from 'vuex'
                const {
                    mapGetters,
                    mapActions,
                } = createNamespacedHelpers('maps')
                export default{
                    computed: {
                        ...mapGetters([
                            'center',
                            'zoom',
                        ]),
                        mapOptions(){
                            //...
                        },
                    },
                    methods: mapActions([
                        'setCenter',
                        'setZoom'
                    ]),
                }

            //用户位置 （添加用户位置指示符， 存入store）
                //1, 地图组件中添加googlemaps-user-position组件
                <googlemaps-map  
                ...
                >
                    {/* 用户位置 组件 */}
                    <googlemap-user-position @update:position="setUserPosition" />
                </googlemaps-map>
                //2, maps.vue 添加userPosition信息
                state(){
                    return {
                        //...
                        userPosition: null,
                    }
                },
                getters: {
                    //...
                    userPosition: state => state.userPosition,
                },
                mutations: {
                    //...
                    userPosition(state, value){
                        state.userPosition = value
                    },
                },
                actions: {
                    //...
                    setUserPosition({commit}, value){
                        commit('userPosition', value)
                    },
                }
                //3, 通过辅助函数将setUserPosition action 映射到BlogMap组件中
                /*  略  */

                //将用户放居中位置
                    //1, maps。vue重建centerOnUser action：
                    async centerOnUser({dispatch, getters}){
                        const position = getters.userPosition
                        if(position){               //在获取位置时 用setCenter方法和位置 修改用户在中心 （通过@update：center指令）
                            dispatch('setCenter', position)
                        }
                    },
                    //2, 修改setUserPosition action
                    setUserPosition({dispatch, commit, getters}, value){
                        const position = getters.userPosition
                        commit('userPosition', vulue)
                        if(!position){              //设置初始化地图时， 以用户位置设置为中心
                            dispatch('centerOnUser')
                        }
                    }
                    //根据工具栏中的’center on user‘ 按钮，在appMenu组件替换centerOnUser action映射
                    methods: mapActions({
                        logout: 'logout',
                        centerOnUser: 'map/centerOnUser',
                    }),

    //博客与评论（ｓｔｏｒｅ中的评论板块，　渲染函数和ＪＳＸ，　创建篇博客，　获取博客列表，　选中博客）
        //设计&构思：
            //创建博客， 每个博客有位置信息和可选的google地图地址ID, 还会记载地图可见区域内的所有博客， 每个博客显示为一个带自定义图标的标记，
            //点击标记会出现博客和评论列表， 点击其他位置会创建一篇博客并将草稿实时保存在store中， 并在右侧有草稿表单
        //store中添加博客模块（命名空间为posts的Vuex模块）
            //  store/post.js
            export default{
                namespaced: true,
                state(){
                    return {
                        draft: null,                //博客草稿
                        mapBounds: null,            //上一次请求的地图范围， 用于禁止重复请求
                        posts: [],                  //当前地图范围内的博客
                        selectedPostId: null,       //当前选中的博客ID
                    }
                },
            }
            //添加getter
            getters: {
                draft: state => state.draft,
                posts: state => state.posts,
                selectedPostId: state.posts.find(p => p._id ===state.selectedPostId),   //mongodb中 博客id字段为_id
                currentPost: (state, getters) => state.draft || getters.selectedPostId, //草稿优先选中的博客
            },
            //添加mutation （同时修改了posts和mapBounds， 以保证数据的一致）
            mutations: {                            //mutation = 更新状态？
                addPost(state, value){              //加入博客列表
                    state.posts.push(value)
                },
                draft(state, value){                //将值保存为state的draft （第一次写这张草稿）
                    state.draft = value
                },
                posts(state, {posts, mapBounds}){   //将对应新的值更新到state里？ post与地图范围有关，so一起更新 
                    state.posts = posts,
                    state.mapBounds = mapBounds
                }
                selectedPostId(state, value){       //too
                    state.selectedPostId = value
                }
                updateDraft(state, value){          //不同与上面的是： 可以将多个可迭代的的属性值覆盖  （修改草稿）
                    Object.assign(state.draft, value)   
                }
            }
            // store/index.js  将上面这些添加到store，（同maps） 
            import posts from './posts'
            const store = new Vuex.Store({
                //...
                modules: {
                    maps,
                    posts,
                },
            })

        // 渲染函数 & JSX （不同于模板）
            //1, Vue中会将模板编译为render函数， 即所有的视图组件最后都是js， 渲染函数构成虚拟DOM树， 并显示在真正的DOM中
                //大多数时候使用模板就可以了， 但是有时需要用js完整编程能力， 可以在组件中使用render函数而不是指定一个模板, 返回要渲染的东西 如
            export default{
                props: ['message'],
                render(createElement){              //要使用createElement函数构建元素（DOM 或Vue组件），
                    return createElement(
                        'p'，                       //元素 or 组件
                        {class: 'content'},         //数据对象
                        this.message,               //子节点 or 文字内容
、                    )
                },
            }
                // createElement(经常写作h)的参数为element（HTML 组件ID 定义组件的对象）， data（数据对象 如CSS类 prop 事件）， children（文本 或createElement创建的子节点数组）， 后两种可选
                //刚才的渲染函数将实现和以下模板相同的功能：
            <template>
                <p class='content'> {{ message }} </p>
            </template>
            //动态模板： 可以使用渲染函数达到操控模板的目的，如
            Vue.component('my-title', {
                props: ['level'],
                render(h){
                    return h(
                        `h${this.level}`,           //标签名  通过反引号的 模板字符串写法
                        this.$slots.default,        //默认插槽内容
                    )
                }
            })
            <my-list level="2"> Hello </my-list>
                //刚才的渲染函数将实现和以下模板相同的功能：
            <template>
                <h1 v-if='level === 1'>
                    <slot></slot>
                </h1>
                <h2 v-if="level === 2">
                    <slot></slot>
                </h2>
                {/* 一直往下直到h6... */}
            </template>
            //数据对象： 可选的数据对象将数据传值给createElement， 可以使用与传统模板中的v-bind： class相同的方式指定CSS类， 或者添加事件监听器
            {                                       //这个数据对象的例子中， 包含大部分使用的特性
                'class': {          //和v-bind一样的API   'class'也可换成style        
                    foo: true,
                    bar: false,
                }，
                attrs： {           //普通html属性
                    id: 'foo'
                },
                props: {            //插件prop
                    myProp: 'bar'
                },
                domProps: {         //DOM属性
                    innerHTML: 'baz'
                },
                on: {               //事件处理函数嵌套在on下， 但是不支持v-on： keyup.enter这种修饰符， 可以在处理函数中手动检查键值名
                    click: this.clickHandler
                },
                nativeOn: {         //仅组件可用 监听原生事件， （通过vm.$emit发出的不行）
                    cilck: this.nativeClickHandler
                },
                directives: [       //自定义指令， 但不能设置oldValue字段， 因为Vue会自动追踪它
                    {
                        name: 'my-custom-directive',
                        value: '2',
                        expression: '1 + 1', 
                        arg: 'foo',
                        modifiers: {
                            bar: true
                        }
                    }
                ],
                slot: 'name-of-slot'，  //插槽名， 在当前组件是另一组件的组件时使用
                key: 'myKey',       //其他特殊的首层属性
                ref: 'myRef'
            }
                //可以基于这些实现 当标题级别小于某值时， 添加一个CSS类
            Vue.component('my-title', {
                props: ['level'],
                render(h){
                    return h{
                        `h${this.level}`,           //标签
                        {                           //数据对象
                            'class': {
                                'important-title': title.level <= 3,
                            },
                        },
                        this.$slots.default,        //默认插槽内容
                    }
                }
            })
                //或者添加一个点击实践的监听器  会调用组件内的方法
            Vue.component('my-itle', {
                props: ['level'],
                render(h){
                    return h(
                        `h${this.level}`,
                        {
                            on: {
                                click: this.clickHandler
                            },
                        },
                        this.$slots.default,
                    )
                },
                methods: {
                    clickHandler(event){
                        console.log('you clickecd')
                    },
                },
            })
                //虚拟DOM： Vue为了避免大量的DOM操作而引起不必要的延时 性能浪费， 只创建虚拟DOM树， 并在实际与虚拟的DOM树之间， 维持差异表， 更新同步只同步有改变的

            //2, JSX： 为了在render中编写更类似html形式的代码， 像xml的js扩展， 配合Babel使用 
            export default{
                props: ['message'],
                render(h){                          //渲染函数中， return后可以像html一样编码
                    return <p class="contant">
                        {this.message}
                    </p>
                },
            }
                //babel-preset-vue的babel-plugin-transfrom-vue-jsx插件负责将jsx转换为h函数中使用的js代码，（这也是为什么要在render中将createElement替换为h的原因）
             export default{
                props: ['message'],
                render(h){
                    return h('p', {class: 'contant'}, this.message)
                },
            }   
            //3, 使用JSX写博客内容结构:
                //新建src/components/content文件夹， 
                //创建BlogContent.vue 代表右侧边栏
                //LocationInfo.vue 地图上有地点被选中时， 显示地点和名字， 它又包括三个子组件（情况）：
                    //NoContent.vue  没有地点被选中时， 显示点击地图
                    //CreatePost。vue  有博客草稿时， 显示一个表格
                    //PostContent。vue  有博客被选中时， 显示内容及评论

                //1,在content目录用空模板创建这些组件 （？）
                <template></template>
                //2, 创建带命名空间的辅助函数
                <script>
                    import {createNamespacedHelpers} from 'vuex'
                    const {                         //posts模块: 如 将mapGetters重命名为postsGetters  以避免重名冲突
                        mapGetters: postsGetters,
                        mapActions: postsActions,
                    }   = createNamespacedHelpers('posts')
                </script>
                //3, 添加组件定义
                export default{
                    computed: {
                        ...postGetters([            //草稿 / 内容
                            'draft',
                            'currentPost',
                        ]),
                        cssCalss(){                 //实现根据条件 显示不同样式
                            return [
                                'blog-content',
                                {                   //当没有草稿和博客时， 使用has-content 这个CSS类在手机上隐藏面板-变全屏
                                    'has-content': this.currentPost,
                                },
                           ]
                        },
                    },
                }
                //4, 使用JSX编写渲染函数 （标签大小写很重要，小写会认为是createElement函数的字符串参数，大写则是认为是一个变量，  使用这个特性可以动态的选择要显示的组件， 得益于Component变量 ）
                    //导入四个子组件 略  
                render(h){                          //实现根据条件 选择使用哪个子组件
                    let Content
                    if(!this.currentPost){          //如果没有记录/内容
                        Content = NoContent
                    } else if(this.draft){          //有草稿
                        Content = CreatePost
                    } else {
                        Content = PostContent
                    }
                }
                
                return <div class={this.cssClass}>
                    <LocationInfo />
                    <Content />
                </div>
                //5, JSX 重写GeoBlog.vue， 并添加BlogConent组件
                <script>
                    import AppMenu from './AppMenu.vue'
                    import BlogMap from './BlogMap.vue'
                    import BlogContent from './content/BlogContent.vue'

                    export default{
                        render (h){
                            return <div class="geo-blog">
                                <AppMenu />
                                <div class="panes">
                                    <BlogMap />
                                    <BlogContent />
                                </div>
                            </div>
                        }
                    }
                </script>

            //4, NoContent组件  只是显示一个提示
            <template>
                <div class="no-content">
                    <i class="material-icons">explore</i>
                    <div class="hint">Click on the map to add a post</div>
                </div>
            </template>

        //创建一篇博客： 点击地图上没有标记的地点时， 会创建一篇博客草稿， 在右侧面板编辑， 点击Create， 会将博客发到服务器 将数据添加到博客列表
            //添加操作博客草稿的 Action： 在posts命名空间用几个Action实现草稿的创建 点击检查 更新 清空
            actions: {
                clearDraft({commit}){              //通过将草稿赋值为null 进行清空
                    commit('draft', null)
                },
                createDraft({commit}){              //给草稿赋值为默认草稿对象 实现创建草稿
                    commit('draft', {
                        title: '',
                        content: '',
                        position: null,
                        placeId: null,
                    })
                },  
                updateDraft({dispatch, commit, getters}, draft){            //覆盖草稿对象 实现更新
                    commit('updateDraft', draft)
                }

                setDraftLocation({dispatch, getters}, {position, placeId}){ //点击地图时， 先检查store有没有草稿 没有就保存一个 并保存这个新草稿的地点信息， 实现点击-检查-创建草稿-保存
                    if(!getters.draft){
                        dispatch('createDraft')
                    }
                    dispatch('updateDraft', {
                        position,
                        placeId,
                    })
                }
            }
            //2, 修改BlogMap， 集成到Vuex Store
                //1，BlogMap。vue添加posts命名空间块的Vuex辅助函数， 重命名之前在maps模块中定义的辅助函数
                const {                             //Vuex地图   maps模块
                    mapGetters: mapsGetters,
                    mapAction: mapsActions,
                } = createNamespacedHelpers('maps')
                const {                             //posts博客 评论模块
                    mapGetters: postGetters,
                    mapActions: postsActions,
                } = createNamespacedHelpers('posts')
                //2, 添加draft getter
                computed: {
                    ...mapsGetters([
                        'center',
                        'zoom',
                    ]),
                    ...postGetters([
                        'draft',
                    ]),
                    //...
                },
                //3, 添加setDraftLoction action
                methods: {
                    ...mapActions([
                        'setCenter',
                        'setUserPosition',
                        'setZoom',
                    ]),
                    ...postsActions([
                        'setDraftLocation',
                    ]),
                },
                //2-1, 点击处理函数  点击地图 创建新博客
                    //1, 地图添加click处理函数  设置为onMapClick
                    <googlemaps-map 
                        //。。。
                        @update: click="onMapClick"
                    />
                    //2, 实现上面使用的方法， 也是添加分发setDraftLocation action的方法， 
                    onMapClick(event){                  //使用Google地图返回的latLng/placeId 位置和地址ID
                        this.setDraftLocation({
                            position: event.latLng,
                            placeId: event.placeId
                        })
                    },
                //2-2, 草稿位置添加透明标记  （使用googlemaps-marker组件） 使用从draft getter获得的信息在googlemaps-map组件添加新标记
                {/* 点击地图 创建新博客时 创建标记 */}
                <googlemaps-marker 
                    v-if="draft"
                    :clickable="false"
                    :label="{
                        color="write",
                        fontfamily: "Material Icons",
                        text: 'add_circle',
                    }"
                    :opacity=".65"
                    :position="draft.position"
                    :z-index="6"
                />

            //3, 博客表单  CreatePost.vue  显示一个表单让用户填写博客具体信息， 如标题 内容 类型标签，，，
                //1, 创建简单表单模板
                <template>
                    <form 
                        class="create-post"
                        @submit.prevent="handleSubmit"
                    >
                        <input 
                            name="title"
                            v-model="title"
                            placeholder="Title"
                            required
                        />
                        <textarea 
                            name="content"
                            v-model="content"
                            placeholder="Content"
                            required
                        />
                        <div class="actions">
                            <button 
                                type="button"
                                class="secondary"
                                @click="clearDraft"
                            >
                                <i class="material-icons">delete</i>
                                Discard
                            </button>
                            <button 
                                type="submit"
                                :disable="!formValid"
                            >
                                <i class="material-icons">save</i>
                                Post
                            </button>
                        </div>                
                    </form>
                </template>
                //2, 添加posts模块Vuex辅助函数
                <script>
                    import {createNamespacedHelpers} from 'vuex'
                    const {                         //posts模块
                        mapGetters: postsGetters,
                        mapActions: postsActions,
                    } = createNamespacedHelpers('posts')
                </script>
                //3, 添加必要的getter和方法
                export default{
                    computed: {
                        ...postGetters([
                            'draft',
                        ]),
                    },,
                    methods: {
                        ...postsActions([
                            'createPost',
                            'clearDraft',
                            'updateDraft',
                        ]),
                    }
                }
                //4, 添加几个计算属性（包含getter/setter两种计算属性 可以读/修改数据， 对应Vuex的getter/action） 
                title: {
                    get(){
                        return this.draft.title
                    },
                    set(value){
                        this.updateDraft({
                            ...this.draft,
                            title: value,
                        })
                    },
                },
                content: {
                    get(){
                        return this.draft.content
                    },
                    set(value){
                        this.updateDraft({
                            ...this.draft,
                            content.value
                        })
                    },
                },
                formValid(){                        //用v-model指令将其绑定到表单输入框（？）
                    return this.title && this.content
                }
                //5, 添加hansleSubmit方法发送即将创建的createPost action
                handleSubmit(){                     //通过检查前面绑定的指令被调用 判断什么时候发送这个action
                    if(this.formValid){
                        this.CreatePost(this.draft)
                    }
                }，
            
            //4, 实现请求： 用action把新建的博客发送到服务器
                //1, props模块中 引入之前工单项目中创建的$fetch插件， 并新建createPost action
                async createPost({commit, dispatch}, draft){        //准备数据  发送POST数据请求  清空草稿 并取回新增的博客对象 并设置这个为选中
                    const data = {                  //需要获取的表单列表
                        ...draft,
                        position: draft.position.toJSON(),  
                    }
                    const result = await $fetch('posts/new', {      //发送请求
                        method: 'POST',
                        body: JSON.stringify(data),
                    })
                    dispatch('clearDraft')          //清空草稿
                    commit('addPost', result)       //更新博客列表
                    dispatch('selectPost', result._id)              //设置这个 新博客 为选中
                },
                //2, 创建上面最后一步 selectPost， 用于根据id选中博客
                async selectedPost({commit}, id){
                    commit('selectedPostId', id)
                    //todo  获取评论等博客详情
                }

        //获取博客列表  （从服务器获取 并显示到地图）
            //1,添加action， 当用户缩放/平移都会导致地图区域变化， 都要从新获取列表（等一段时间内没有变化后）， 
                //1,posts.js  为防止异步导致更新不正确 顶部声明唯一标识符（计数器ID）， 以便在新请求发送时终止原来的请求， 
                let fetchPostsUid = 0
                //2, 添加fetchPosts Action， 当地图区域发生了改变，获取博客列表， （以及一个额外的force参数） 
                async fetchPostsUid({commit, state}, {mapBounds, force}){
                    let oldBounds = state.mapBounds
                    if(force || !oldBounds || !oldBounds.equals(mapBounds)){
                        const requestId  = ++fetchPostsUid  //请求ID赋值为计数器ID+1， 二者相等 便于后面检查 （也许获取的函数会对两个中的一个进行修改）

                        //发送请求  （根据获取东北 西南 两个方向的值 并编码为URI格式后 发送值）
                        const ne = mapBounds.getNorthEast()
                        const sw = mapBounds.getSouthWest()
                        const query = `posts ne=${
                            encodeURIComponent(ne.toUrlValue())
                        } & sw=${
                            encodeURIComponent(sw.toUrlValue())
                        }`
                        const posts = await $fetch(query)

                        if(requestId === fetchPostsUid){    //检测到发送了另一个请求，（本来按上面+1 应该requestId大， 只有已经调用过） 则终止操作   
                            commit('posts', {
                                posts, 
                                mapBounds,
                            })
                        }
                    }
                },
                //1-2， 分发action 添加setBounds 在用户平移/缩放时 被分发posts中的fetchPosts
                    //1, 使用{root：true}用无命名空间的方式分发action以这种方式使用posts模块
                    setBounds({dispatch}, value){
                        dispatch('posts/fetchPosts', {
                            mapBounds: value,
                        },{
                            root: true,
                        })
                    },
                    //2, 在BlogMap。vue用辅助函数映射setBounds， 略
                    //并添加一个ref属性map和一个idle事件监听器在地图上
                    <googlemaps-map 
                        ref="map"
                        //略去中间属性...
                        @idle="onIdle"
                    />
                    //添加对应OnIdle方法分发setBounds 同时传递地图区域
                    onIdle(){
                        this.setBounds(this.$refs.map.getBounds())
                    }

            //2, 显示标记  更新后 再次使用googlemaps-marker遍历博客列表 显示对应博客的标记
            //（首先映射posts和currentPost getter， selectPost action到正确的辅助函数(略)， 然后在googlemaps-map组件内添加便利）
            <googlemaps-marker 
                v-for="post of posts"
                //略去中间属性
                @click="selectPost(post._id)"
            />
            
            //3,登录和退出      登录：重新获取博客列表并选中上次最后选中的博客， 退出：与登录相反 将博客列表和选中都清空
                //登出
                    //1,  Vuex/posts 添加 logout action， 用于清空列表
                    logout({commit}){
                        commit('posts', {
                            posts: [],
                            mapBounds: null,
                        })
                    },
                    //2, store/index.js 调用logout
                    logout({commit, dispatch}){
                        commit('user', null)
                        $fetch('logout')
                        //...
                        dispatch('posts/logout')
                    }
                    //3, 可以将上面一步优化 posts命名空间子模块的logout定义为一个根action， 这样logout分发时， logou和posts/logout都可以被调用
                    //在post的logout中使用这种对象表示法  (只有logout的调用不再有命名空间， 内部的state getter 提交 分发都是有的)
                    logout: {
                        handle({commit}){           //logout调用handle函数
                            commit('posts', {
                                posts: [],
                                mapBounds: null,
                            })
                        },
                        root: true,
                    },
                    //4, 移除store/index。js 中后面加的这句
                    dispatch('posts/logout')

                //登录      登录成功 分发无名空间的logged-in action
                    //1, posts模块， 使用新对象表示法添加logged-in
                    'logged-in': {
                        handle({dispatch, state}){
                            if(state.mapBounds){
                                dispatch('fetchPosts', {
                                    mapBounds: state.mapBounds,
                                    force: true,
                                })
                            }
                            if(state.selectedPostId){
                                dispatch('selectPost', state.selectedPostId)
                            }
                        },
                        root: true,
                    },
                    //2, 授权成功 store/index。js login分发这个新的logged-in
                    if(user){
                        //...
                        dispatch(logged-in)
                    }


        //选中博客： 创建组件展示博客内容及评论  博客详情对象=（博客对象+作者信息+评论列表+每个评论的作者信息）
            //1, 博客详情， 先修改vuex的posts模块
                //1-1：博客的选中和发送 （vuex/posts）
                    //1,state添加selectedPostDetails数据属性， 并添加对应的getrt 和mutation 
                    state(){
                        return {
                            //...
                            selectedPostDetails: null,      //获取选中博客的详情
                        }
                    },
                    getters： {
                        //。。。
                        selectedPostDetails: state => state.selectedPostDetails,
                    },
                    mutations: {
                        selectedPostDetails(state, value){
                            state.selectedPostDetails = value
                        },
                    },
                    //2, selectedPost中, 发送请求到服务器的/post/<id> 路由获取博客详情
                    async selectedPost({commit}, id){
                        commit(selectedPostDetails, null)
                        commit('selectPostId', id),
                        const details = await $fetch(`posts/${id}`)
                        commit('selectedPostDetails', details)
                    }
                    //3, 创建一个新的unselectPost action
                    unselectPost({commit}){         //没有被选中， 则赋值为null（？）
                        commit('selectPostId', null)
                    }
                //1-2： 博客内容组件  用PostConent。vue实现
                    //1, content/PostContent.vue 模板初始化为
                    <template>
                        <div class="post-content">
                            <template v-if="details">
                                <div class="title" >
                                    <img src="details.author.profile.photos[0].value" />        {/* 作者头像 */}
                                    <span>
                                        <span>
                                            {{ details.titles }}        {/* 标题 title */}
                                        </span>
                                        <span class="info">
                                            <span class="name">
                                                {{ details.author.profile.displayName }}        {/* 作者名 */}
                                            </span>
                                            <span class="date">
                                                {{ details.date }}      {/* 创作时间/最后修改时间 */}           
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="content">
                                    {{ details.content }}               {/* 博客内容 */}
                                </div>
                                <!-- TODO评论 -->                       {/* 评论列表 */}
                                <div class="actions">                   {/* 工具栏 */}
                                    <button 
                                        type="button"
                                        class="icon-button secondary"
                                        @click="unselectPost"
                                    >
                                        <i class="material-icons">close</i>
                                    </button>
                                    <!--TODO 编写评论 -->

                                </div>
                            </template>
                            <div class="loading-animation" v-else>      {/* 加载动画 */}
                                <div></div>
                            </div>
                        </div>
                    </template>
                    //2, 接着写脚本区域， 添加posts的details getter和nunselectPost action
                    <script>
                        import {createNamespacedHelpers} from 'vuex'
                        const {                     //posts
                            mapGetters： postsGetters，
                            mapAction: postsActions,
                        } = createNamespacedHelpers('posts')

                        export default{
                            computed: {
                                ...postGetters({
                                    details: 'selectedPostDetails',
                                }),
                            },
                            methods: {
                                ...postsActions([
                                    'unselectPost',
                                ]),
                            },
                        }
                    </script>
                
                //2, 信息位置和作用域插槽：在右侧边栏上方显示当前博客的位置信息  由vue-googlemaps使用作用域插槽
                    //2-1： 用作用域插槽将值传给父组件  组件中声明的<slot>可以传值给嵌入插槽的视图
                    <template>
                        <div class="search">
                            <slot />
                        </div>
                    </template>
                    <script>
                        export default{
                            computed: {
                                result(){
                                    return /.../
                                },
                            },
                        }
                    </script>
                        //这样通过插槽将属性传递给外部视图， 如：
                    <slot :result="results" />
                        //使用该组件时， 可以通过使用slot-scope属性获取作用域内所有数据
                    <Search>
                        <template slot-scopt="props">                   {/* 只有一个子组件可以不用template */}
                            <div>{{ props.result.length }}results</div>         {/* 搜索结果的数量 */}
                        </template>
                    </Search>
                        //和循环搭配使用时， slot非常有用,  （如有三条数据 将有三个div显示结果）
                    <slot v-for="r of results" :result="r" />
                        //使用时， 插槽的内容将多次生成 并传递给当前的元素  
                    <Search>
                        <div slot-scope="props" class="result"> {{ props.result.label }} </div>
                    </Search>
                
                    //2-2：实现组件  用作用域插槽展示博客位置信息
                        //1, components/content/PlaceDetails.vue  展示地点名字和详细地址
                        <script>
                            export default{
                                props: {
                                    name: String,
                                    address: String,
                                },
                                render(h){
                                    return <div class="details">
                                        <div class="name">
                                            <i class="material-icons"> place </i>
                                            {{ this.name }}
                                        </div>
                                        <div class="address">
                                            {{ this.address }}
                                        </div>
                                    </div>
                                },
                            }
                        </script>
                        //2,  实现LocationInfo.vue组件 - 模板部分， 所有数据获取都在作用域插槽中完成 
                        //博客存储placeId ？ googlemaps-place-details : googlemaps-geocoder, 即没有则找到与博客位置相关度最高的地址
                        <template>
                            {/* 详细地址：   外面组件判断+处理数据 里面使用之前实现的初始化模板组件 */}
                            <div class="locations-info" v-if="currentPost">
                                <googlemaps-place-details         
                                    v-if="currentPost.placeId"
                                    :request="{
                                        placeId: currentPost.placeId
                                    }"
                                >
                                    <PlaceDetails 
                                        slot-scope="props"
                                        v-if="props.result"
                                        :name="props.results.name"
                                        :address="props.results.formatted_address"
                                    />
                                </googlemaps-place-details>
                                
                                {/* 仅地点（没有博客？）： 外面继续判断剩余部分+处理数据 ，里面调用一样的组件 但是传入显示的数据不同 */}         
                                <googlemaps-geocode 
                                    v-else
                                    :request="{
                                        location: currentPost.position,
                                    }"
                                >
                                    <PlaceDetails 
                                        v-if="props.reuslts"
                                        :name="props.results[1].PlaceDetails.name"
                                        :address="props.results[0].formatted_address"
                                    />

                                </googlemaps-geocode>

                            </div>
                        </template>
                        //3, 脚本部分 映射posts模块的currentPost getter， 同时导入刚才创建的PlaceDetails组件
                        <script>
                            import PlaceDetails from './PlaceDetails.vue'
                            import { createNamespacedHelpers } from 'vuex'
                            const {                 //posts
                                mapGetters: postGetters,
                            } = createNamespacedHelpers('posts')
                            export default{
                                components: {
                                    PlaceDetails,
                                },
                                computed: postsGetters({
                                    'currentPost',
                                }),
                            }
                        </script>

                //3, 评论（函数式组件）
                    //3-1： 为评论修改store
                        //1, posts模块中，新增一个添加评论的mutation
                        addComment(state, {post, comment}){
                            post.comment.push(comment)
                        }
                        //2, 同样新增sendCommet action， 用来发送请求到 服务器的 /posts/<id>/comment路由， 将结果添加到选中的博客
                        async sendComment({commit, rootGetters}, {post, comment}){
                            const user = rootGetters.user       //由于命名空间不同， 使用全局rootGetters获取用户数据
                            commit ('addComment', {             //调用上一步写的addComment 参数中有post网络方法，comment对象
                                post, 
                                comment: {
                                    ...comment,
                                    date: new Date(),
                                    user_id: user._id,
                                    author: user,
                                },
                            })
                            
                            await $fetch(`posts/${post._id}/comment`, {     //使用POST获取评论数据， 并将数据json解析
                                method: 'POST',
                                body: JSON.stringify(comment),
                            })
                        },

                    //3-2： 函数式组件： 在Vue中， 每个组件都要做一些设置， 如数据响应 生命周期， 
                    //而函数式组件更轻量，没有this和状态，速度快而内存少， 如大量评论这种 大量 文本 无交互和变化的， 非常适合
                    //怎么写函数式组件： 组件定义对象中添加 functional：true, 后跟render（）
                    //因为没有this， render获取到一套新的上下文参数（prop, 事件监听器， 子内容， 插槽， 其他）， 声明prop不是必须的， 它们同样传递给context.data
                    export default{
                        functional：true,
                        render (h, {props: children}){      
                            return h(`h$(props.level)`, children)
                        },
                    }
                        //也可以模板的functional 代替functional： true：
                        <template functional>
                            <div>{{ props.message }}</div>
                        </template>
                        
                    //1,PostContent.vue 同级新建Comment.vue
                    <script>
                        import {data} from '../../filters'
                        export default{
                            functional: true,       //函数式组件
                            render(h, {props}){
                                const {comment} = props     //从props获取comment（评论）
                                return <div class="comment">        {/* 先获取用户图片 */}
                                    <img 
                                        class="avatar" 
                                        src={comment.author.profile.photos[0].value} 
                                    />
                                    <div class="message">
                                        <div class="info">          {/* 然后用三段span分别展示 姓名 发表时间 内容 */}
                                            <span class="name">
                                                { comment.author.profile.displayName }
                                            </span>
                                            <span class="date">
                                                { date(comment.date) }
                                            </span>
                                            <span class="conent">
                                                { comment.content }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }
                        }
                    </script>

                    //2, 回到PostContent组件， 在面板中间补上评论列表， 面板底部添加评论（表单）
                    <div class="comments">
                        <Comment 
                            v-for="{comment index} of details.comments"
                            :key+"index"
                            :comment="comment"
                        />
                    </div>
                    <div class="actions">
                        {/* 。。。 */}
                        <input 
                            v-model="commentContent"
                            placeholder="type a comment"
                            @keyup.enter="submitComment"
                        />
                    </div>
                    <button
                        type="button"
                        class="icons-button"
                        @click="submitComment"
                        :disabled="!commentFormVaild"
                    >
                        <i class="material-icons">send</i>
                    </button>

                    //3, 引入Comment组件， 添加上面使用的commentContent数据属性， commentFormVaild计算属性， sendComment action， submitComment方法
                    import Comment form './Comment.vue'
                    export default {
                        components: {
                            Comment,                //导入被使用的组件
                        }
                        data(){
                            return {
                                commentContent: '', //用来作为足见中被赋值用的data属性
                            }
                        },
                        computed: {
                            ...postGetters({        //前面显示博客详情用
                                details: 'selectedPostDetails',
                            }),
                            commentFormVaild(){     //返回评论
                                return this.commentContent
                            },
                        },
                        methods: {
                            ...postsActions([       //导入action（？）
                                'sendComment',
                                'unselectPost',
                            ]),
                            async submitComment(){  //如果返回评论， 就发送评论（博客详情（？）， 评论的内容）， 并将评论数据清空
                                if(this.commentFormVaild){
                                    this.sendComment({
                                        post: this.details,
                                        comment: {
                                            content: this.commentContent,
                                        },
                                    })
                                    this.commentContent = '',
                                }
                            },
                        },
                    }

















            



//服务器渲染 国际化 测试 部署：
    //项目设置 vue init webpack-simple e-shop（现在改为vue-init webpack-simple projectname）； cd e-shop; npm install; npm insall -S babel-polyfill axios vue-router vuex vuex-touter-sync; npm i -D stylus stylus-loader  json-server (后端服务器用)
        //上面的json-server会暴露一个简单的REST API并使用db.json保存数据
        //并在package.json中添加一个db脚本 "db": "json-server --watch db.json",   npm run db 就可以监听db.json的内容， 默认端口3000/items
    //使用PostCss自动为Css添加前缀， 它在vue-load中， 先npm i -D autoprefixer, 激活PostCSS需要在项目根目录下添加postcss.js告知它要使用autoprefixer
    module.exports = {
        plugins: [
            require('autoprefixer'),
        ],
    }
    //使用ESLint提升代码质量和风格： 它提供了一系列可开关的lint规则，还可以通过添加插件添加更多规则 (书中使用eslint-plugin-vue)
        //npm i -D eslint-config-standard eslint-plugin-vue@bate ; npm i -D eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard ; npm i -D babel-eslint
        //创建.eslintrc.js 并写入配置
        module.exports = {
            root: true, //仅使用本配置
            parser: 'vue-eslint-parser',    //文本解析器
            parserOptions: {    //对js使用babel-eslint, 使用import/export语法
                'parser': 'babel-selint',
                'ecmaVersion': 2017,
                'sourceType': 'module'
            },
            env: {      //全局环境对象
                browser: true,
                es6: true
            },
            extends: [
                'standard',
                'plugin:vue/recommended',
            ],
        }
        //自定义规则
        rules: {
            'no-use-before-define': 'off',      //禁用了no- 规则，避免用展开符时出错
            'comma-dangle': ['error', 'always-multiline'],  //强制在所有数组和对象后加逗号
        },
        //package.json 添加eslint配置：
        "eslint": "eslint --ext .js, .jsx, .vue src  --fix",       //处理脚本的类型和范围, 并用fix对简单错误自动修复
        //vue标准eslint看不懂， 如在创建实例前加入一行： //eslint-disable-next-line no-new
        //webpack中使用ESLint， npm i -D eslint-loader freiendly-errors-webpack-plugin
            //编辑webpack.config.js
            module:{
                rules: [
                    {
                        test: /\.(jsx?|vue)$/,
                        loader: 'eslint-loader',
                        enforce: 'pre',
                    }
                ]
            }
            //再在其中添加友好的错误提示包
            const freiendlyErrors = require('friendlu-errors-webpack-plugin')//配置文件顶
            }else{          //配置文件底
                module.exports.plugins = (module.exports.plugins || [])
                    .cancat([
                        new freiendlyErrors(),
                    ])
            }
        //eslint中添加jest 针对组件，速度快+可以退化,  npm i -D jest vue-test-utils vue-jest jest-serializer-vue vue-server-randerer  ;  npm i -D babel-jest babel-plugin-dynamic-import-node
            //配置jest：（jest.config.js）
            module.exports = {
                ransform: {
                    '.+\\.jsx?$': '<rootDir>//node_modules/babel-jest',
                    '.+\\.vue$': '<rootDir>/node_modules/vue-jest',
                },
                snapshotSerializers: [
                    '<rotDir>/node_modules/jest-serializer-vue',
                ],
                mapCoverage: true,
            }
            //jest 配置支持babel （上面的后面加入）
            {
                "presets": [
                    ["env", {"modules": false}],
                    "stage-3"
                ],
                "env":{
                    "test":{
                        "plugins":[
                            "transform-es2015-modules-commonjs",
                            "dynamic-import-node"
                        ]
                    }
                }
            }
            //开始测试： 为了使所有地方都默认支持jest， 需要调用测试文件.test.js /.spec.js 文件前名与要测试的文件同名， 放置在src/components
                //1, 导入组件和shallow方法： 
                import BaseButton from './BaseButton.vue';  import {shallow} from 'vue-test-utils'
                //2， 用describe函数 创建测试套件
                descript ('BaseButton', () => {/* 测试 */})
                //3, 测试套件内， 用test函数添加单元测试
                descript ('BaseButton', () => {
                    test('click event', () => {/* 测试代码 */})
                })
                //4， 组件外创建包装对象， 它提供用于测试这个组件的函数
                const wrapper = shallow(BaseButton)
                //5, 模拟点击
                wrapper.trigger('click')
                //6, 用jest的expect方法检测是否触发了这个事件
                expect(wrapper.emitted().click).toBeTruthy()
                //7, package.json中添加一行用于运行jest
                "jest": "jest"
                //8, 使用npm run 命令， 开始测试
                npm run fest
            //消除运行jest后关键字的提示， 修改.eslintrc.js
            env: {
                browser: true,
                es6: true,
                jest: true,
            }
            //jest快照：每次运行时 保存并比较的字符串，可以使用vue-server-renderer保存组件的html渲染， 主要是使用其中的createRenderer：
            import {createRenderer} from 'vue-server-renderer'  //测试启动时， 实例化一个渲染器实例， 通过shallow函数包装组件并渲染到一个字符串，与之前比较
            //更新快照：package.json中ｊｅｓｔ后加入　"jest:update": "jest --updateSanpshot", 然后　　npm run jest:update

        //国际化和代码拆分： npm -i -S vue-i18n, 使用这包可以在appFooter加入一个链接，前往用户选择语言的新页面，可翻译任何页面，但一般只翻译这个链接和新页面即可，原理是创建一个带翻译后消息的i18n对象注入ｖｕｅ应用
            //准备工作：
                //1, src/plugins.js中导入　并使用
                import VueI18n from 'vue-i18n';    /* ... */  vue.use(VueI18n)
                //2, 项目下新建ｉ１８ｎ文件夹，　下载的翻译js文件放在ｉ１８ｎ／lｏｃａｌｅｓ／下，如英语是i18n/locales/en.js
                //3, 新建ｉｎｄｅｘ．ｊｓ　列出支持的语言
                export default ['en', 'fr', 'es', 'de'] 
                //4, src/utils下建ｉ１８ｎ．ｊｓ　导入ｉ１８ｎ库和语言列表
                //5, package.js中修改babel-preset-stage-3, 以使用２版本配合ｂａｂｅｌ解析动态导入:
                "babel-preset-stage-3":"^6.24.1"
                //6, npm install
                //7, 编辑根目录下的.babelrc, 将ｓｔａｇｅ－３　　改为　ｓｔａｇｅ－２
                //8, 配合版本２，　　npm install --save-dev babel-preset-stage-2
                
            //(1)动态导入的代码拆分：  主要是通过ｉｍｐｏｒｔ动态导入（即代码拆分）ｌｏｃａｌｅ参数指定翻译文件，　将路径作为接受参数并返回一个Ｐｒｏｍｉｓｅ，　　
                //ｉ１８ｎ　是用ｖｕｅ－ｉ１８ｎ的ＶｕｅＩ１８构造函数创建，　我们只要传入ｌｏｃａｌｅ参数, createI18n函数：
                export async function createI18n (locale){
                    const {default: localeMessages} = await;
                    import(`../../i18n/locales/${locale}`)
                    const messages = {
                        [locale]: localeMessages,
                    } 

                    const i18n = new VueI18n({
                        locale, 
                        messages,
                    })
                    return i18n
                }
                //用ｐｒｏｍｉｓｅ代替ａｗａｉｔ／ａｓｙｎｃ：
                export function createI18n(locale){
                    return import(`../../i18n/locales/${locale}`)
                        .then(module => {
                            const localeMessages = module.default
                            //...
                        })
                }
            //(2)自动加载用户区域设置：  使用ｎａｖｉｇａｔｏｒ．ｌａｎｇｕａｇｅ获取区域码，　区域码在ｌａｎｇｓ列表内？　区域码　：　默认ｅｎ
                //１，getAutoLang　函数获取用户区域码
                export function getAutoLang(){
                    let result = window.navigator.userLanguage || window.navigator.language
                    if(result){
                        result = result.substr(0, 2)
                    }
                    if(langs.indexOf(result) === -1){
                        return 'en'
                    } else {
                        return result
                    }
                }
                //2, src/main.js  导入新工具函数
                import {createI18n, getAutoLang} from './utils/i18n'
                //3, 修改ｍａｉｎ函数，　实现获取区域码＞创建并返回ｉ１８ｎ＞注入Ｖｕｅ根实例
                async function main(){
                    const locale = getAutoLang()
                    const i18n = await createI18n(locale)  //如果ｃｒｅａｔｅＩ１８ｎ前不用ａｗｉｔ就返回Ｐｒｏｍｉｓｅ
                    await StorageEvent.dispatch('init')
                  new Vue({
                      el: "#app",
                      router,
                      store,
                      i18n,
                      ...App
                  })
                }
            //(3)更改语言页面：  添加改变语言的页面　设置路由
                //1, src/router.js 导入ＰａｇｅＬｏｃａｌｅ组件
                import PageLocale from './components/PageLocale.vue'
                import { sync } from 'glob';
                //2, 在ｒｏｕｔｅｓ数组的通用符（也是最后一个路由前加入ｌｏｃａｌｅ）
                {path: './locale', name: 'locale', component: PageLocale}
                //3, AppFooter.vue组件中，　将路由链接加入模板
                <div v-if="$route.name !== 'locale'">
                    <router-link :to="{anme: 'locale'}">
                        {{ $t('change-lang') }}
                    </router-link>

                </div>


        //服务端渲染： 便于ＳＥＯ，　没有搜索引擎会索引一个异步ｊｓ应用，　也速度更快
            //（１）通用的结构：
                //1, src/router.js中，　将创建路由器的方法包装到一个ｃｒｅａｔｅＲｏｕｔｅｒ函数，　并导出
                export function createRouter(){
                    const router = new VueRouter({
                        routes,
                        mode: 'history',
                        scrollBehavior(to, from, savedPostion){
                            //...
                        },
                    })
                    return router
                }
                //2, Vuex Store也一样，　ｓｃｒ/store/index.js　　代码包装到新导出的ｃｒｅａｔｅＳｔｏｒｅ函数
                export function createStore(){
                    const store = new Vuex.Store({
                        strict: process.env.NODE_ENV !== 'production',
                        //...
                        modules: {
                            cart,
                            item,
                            items,
                            ui,
                        },
                    })
                    return store
                }
                //3, 将ｓｒｃ／ｍａｉｎ．js 重命名为ａｐｐ．ｊｓ，　创建路由器　ｓｔｏｒｅ　Vued根实例的通用文件，　将ｍａｉｎ函数改为一个接受context返回创建物的函数并导出　
                export async function createApp (context){  //跳过导入createRouter和crateStore
                    const router = createRouter()
                    const store =  createStore()
                    sync(store, router)
                    const i18n = await createI18n(context.locale)
                    await store.dispatch('init')
                  const app = new Vue({                     //移除没有用的ｅｌ
                      router,
                      store,
                      i18n,
                      ...App,
                  })
                  return {
                      app,
                      router,
                      store,
                  }
                }
                //客户端入口：　　新建ｓｒｃ／ｅｎｔｒｙ－ｃｌｉｅｎｔ．ｊｓ，获取语言码　调用createApp挂载到页面；  并修改ｗｅｂｐａｃｋ．ｃｏｎｆｉｇ．ｊｓ的入口路径为这个

                    import {createApp} from  './app'
                    import {getAutoLang} from './utils/i18n'
                    const locale = getAutoLang()
                    createApp({
                        locale,
                    }).then(({app}) => {
                        app.$mount('#app')
                    })
                //服务端入口：　新建ｓｒｃ／ｅｎｔｅｒ－ｓｅｒｖｅｒ．ｊｓ　导出函数从ＨＴＴＰ服务器接受ｃｏｎｔｅｘｔ，返回ｐｒｏｍｉｓｅ并通过Ｖｕｅ进行解析, (向ｃｏｎｔｅｘｔ传入ｕｒｌ设置当前路由)
                import {createApp} from './app'
                import { resolve } from 'url';
                import { create } from 'domain';
import { S_IFDIR } from 'constants';
import { get } from 'http';
                export default context => {
                    return new Promise(async (resolve, reject) => {
                        const {app, router, store} = await createApp(context)
                        router.push(context.url)
                        //TODO  获取与预加载匹配的组件　然后resolve(app)
                    })
                }
            //(2)状态管理　　要渲染应用之前就从相关组件中获取数据，　添加新的ａｓｙｎｃＤａｔａ自定义选项到组件中，ＳＳＲ时就可以调用
                //1, PageHome.vue　加入函数，　会分发ｉｔｅｍ　ｓｔｏｒｅ模块的ｆｅｔｃｈＩｔｅｎｓ　ａｃｔｉｏｎ
                asycData({store}){
                    return sotre.dispatch('items/fetchItems')
                }
                //2, PageStoreItem.vue　通过服务器发送的路由ｉｄ参数调用ｉｔｅｍ　Ｓｔｏｒｅ模块的ｆｅｔｃｈＳｔｏｒｅＩｔｅｍＤｅｔａｉｌｓ　ａｃｔｉｏｎ
                asyncData ({store, router}){
                    return store.dispatch('item/fetchStoreItemDetails', {
                        id: router.params.id
                    })
                }
                //3, entry-server.js 通过ｒｏｕｔｅｒ．ｇｅｔＭａｔｃｈｅｄＣｏｍｐｏｎｅｎｔｓ（）获取与当前组件匹配的组件列表
                export default context => {
                    return new Promise(async (resolve, reject) => {
                        const {app, router, store} = await createApp(context)
                        router.push(context.url)
                        router.onReady(() => {  //新加入 等待组件加载方案
                            const matchedComponents = router.getMatchedComponents() 
                            //TODO  预加载数据　然后resolve(app)      
                        }, reject)
                    })
                }
                //4，　继续　传入ｓｔoｒｅ和路由，　完成后通过ｃｏｎｔｅｘｔ．ｓｔａｔｅ　＝　ｓｔｏｒｅ．ｓｔａｔｅ将Ｖｕｅｘ　ｓｔｏｒｅ的ｓｔａｔｅ发回渲染器，　使用Ｐｒｏｍｉｓｅ．ａｌｌ（ａｒｒａｙ）等待所有的ａｓｙｎｃＤａｔａ调用
                router.onReady(() => {
                    const matchedComponents = router.getMatchedComponents() 
                    Promise.all(matchedComponents.map(component => {
                        if(CompositionEvent.asycData){
                            return component.asycData({
                                store,
                                route: router.currentRoute,
                            })
                        }
                    })).then(() => {    
                        context.state = store.state     //发回ｓｔｏｒｅ的ｓｔａｔｅ
                        resolve(app)                    //将应用返回给渲染器
                    }).catch(reject)                    //发生错误　拒绝返回给渲染器ｐｒｏｍｉｓｅ
                }, reject)
                //客户端还原Ｖｕｅｘ　ｓｔａｔｅ，　　它会在服务器被ｈｔｍｌ的＿＿ＩＮＩＴＩＡＬ＿ＳＴＡＴＥ＿＿变量序列化，　可用这一点　可以挂载前设置ｓｔａｔｅ；　编辑ｅｎｔｒｙ－ｃｌｉｅｎｔ．ｊｓ　挂载前应调用ｓｔｏｒｅ．ｒｅｐｌａｃｅＳｔａｔｅ（）
                createApp({
                    locale,
                }).then(({app, store}) => {
                    if(window.__INITIAL_STATE__){
                        store.replaceState(window.__INITIAL_STATE__)
                    }
                    app.$mount('#app')
                })
            //(3)webpakc配置　　服务器和客户端共用一个配置文件，　各自进行扩展
                //1, npm i -D webpack-merge webpack-node-externals
                //2, 项目根目录下建立ｗｅｂｐａｃｋ文件夹，　将ｗｅｂｐａｃｋ．ｃｏｎｆｉｇ．ｊｓ移动到里面, 重命名为ｃｏｍｍｏｎ．ｊｓ
                //3, 配置文件中移除ｅｎｔｒｙ选项
                //4, 修改ｏｕｔｐｕｔ选项为正确文件夹和更好的块名：
                output: {
                    path: path.resolve(__dirname, '../dist'),
                    pulicPath: '/dist',
                    filename: '[name].[chunkhash].js'
                }
                // 客户端配置：　ｃｏｍｍｏｎ．ｊｓ旁边新建ｃｌｉｅｎｔ．ｊｓ
                const webpack = require('webpack')
                const merge = require('webpack-merge')
                const common = require('./common')
                const VueSSRClientPlugin = requite('vue-server-renderer/client-plugin')
                module.exports = merge(common, {
                    entry: './src/entry-client',
                    plugins: [
                        new webpack.optimize.CommonsChunkPlugin({
                            name: 'manifest',
                            minChunks: Infinity,
                        }),
                        new VueSSRClientPlugin(),       //生成客户端构建清单文件　　以ｊｓｏｎ格式传给渲染器，以此知道更多客户端信息，还可以将脚本标签和关键ＣＳＳ注入ＨＴＭＬ
                    ],
                })
                // 服务端配置，　新建ｓｅｒｖｅｒ．ｊｓ　　扩展基础配置
                const merge = require('webpack-merge')
                const commin = require('./common')
                const nodeExternals = require('webpack-node-externals')
                const VueSSRClientPlugin = require('vue-server-renderer/server-plugin')
                module.exports = merge(common, {
                    entry: './src/entry-server',
                    target: 'node',
                    devtool: 'source-map',
                    output: {
                        libraryTarget: 'commonjs2',
                    },
                    externals: nodeExternals({      //对ｎｏｄｅ－ｍｏｄｕｌｅｓ跳过ｗｅｂｐａｃｋ处理，　从ｎｏ＿ｍｏｄｕｌｅ中强行引入ＣＳＳ
                        whitelist: /\.css$/,
                    }),
                    plugins: [                      //生成服务器ｂｕｎｄｌｅ文件
                        new VueSSRClientPlugin(),
                    ]
                })
            //(4)服务端设置：　先安装虚拟文件／监听／中间件　npm i -D memofy-fs chokidar webpack-dev-middleware webpack-hot-middleware，　再根目录下创建index.template.html,  复制index.html到里面，body内换为：
            <!--vue-ssr-outlet-->       //特殊标记　会被服务器渲染后的标记替换
            //(5)express服务器
                //1, 　npm i -S express reify　　　后者便于在ｎｏｄｅ内部使用ｉｍｐｏｒｔ／ｅｘｐｏｒｔ语法
                //2, 下载课件中chapter7-download的server.js创建http服务器，　
                //创建并更新渲染器：　ｓｅｒｖｅｒ.js中，使用下面代码替换ＴＯＤＯ ｄｅｖｌｏｐｍｅｎｔ
                const setupDevServer = require('./server.dev')
                    readyPromise = setupDevServer({
                        server,
                        templatepath,
                        onUpdate: (bundle, options) => {        //从新创建ｂｕｎｄｌｅ渲染器
                            renderer = createBundleRenderer(bundle, {
                                renInNewContext: false,
                                ...options,
                            })
                        },
                    })
                //渲染Ｖｕｅ应用，　ｓｅｒｖｅｒ．ｊｓ替换　ＴＯＤＯ　ｒｅｎｄｅｒ
                const context = {
                    url: req.url,
                    locale: req.acceptsLanguages(langs) || 'en',    //浏览器发送的语言列表
                }
                renderer.renderToString(context, (err, html) => {
                    if(err){        //渲染页面错误　或重定向
                        res.status(500).send('500 | Internal Server Error')
                        console.error(`error during render: ${req.url}`)
                        console.error(err.stack)
                    }
                    res.send(html)
                })
            //(6)运行ＳＳＲ应用:  修改ｄｅｖ脚本，　使运行ｅｘｐｒｅｓｓ脚本而不是ｗｅｂｐａｃｋ－ｄｅｖ－ｓｅｒｖｅｒ：
            "dev" : "node server"
                //非必须请求：
                    //1,  PageHome.vue  只请求尚未拥有的数据：
                    mounted(){
                        if(!this.items.length){
                            this.fetchItems()
                        }
                    },
                    //2, 　ＰａｇｅＳｔｏｒｅＩｔｅｍ.vue  只在没有对应数据的请求的情况请求商品的的详情和评价
                    fetchData(){
                        if(!this.details || this.details.id == this.id){
                            this.fetchStoreItemDetails({
                                id: this.id,
                            })
                        }
                    } 
        //生产环境构建：
            //（１）, 配置
                //1, 样式提取到ＣＳＳ:
                    //安装依赖　npm i -D extract-text-webpack-plugin
                    //webpack/common.js 添加一个新的变量：
                    const isProd = process.env.NODE_ENV === 'production'
                    //修改ｖｕｅ－ｌｏａｄｅｒ规则，　生产环境下使用ＣＳＳ提取并忽略空格跳行
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            extractCSS: isProd,
                            preserveWhitespace: false,
                        },
                    },
                    //ExtractTextPlugin ModuleConcatenationPlugin添加到文件底部，　用于生产环境的插件列表：
                    if(ifProd){
                        module.exports.devtool = '#source-map'
                        module.exports.plugin = (module.exports.plugins || [])
                            .concat([
                                //...
                                new webpack.optimize.moduleConcatenationPlugin(),
                                new ExtractTextPlugin({
                                    filename: 'common.[chunckhash].css',
                                }),
                            ])
                    } else {
                        //...
                    }
                //2, express服务器生产环境    server.js的ＴＯＤＯ　ｐｒｏｄｕｃｔｉｏｎ替换为：
                const template = fs.readFileSync(templatepath, 'utf-8')
                const bundle = require('./dist/vue-ssr-server-bundle.json')
                const clientManifest = require('./dist/vue-ssr-client-manifest.json')  
                renderer = createBundleRenderer(bundle, {
                    runInNewContext: false,
                    template,
                    clientManifest,
                })
            //( 2 ), 新ＮＰＭ脚本　　　安装ｒｉｍｒａｆ，每次构建前递归删除ｄｉｓｔ下的所有文件夹和文件　　npm i -D rimraf
                //为客户端ｂｕｎｄｌｅ和服务器ｂｕｎｄｌｅ各安装一个ｂｕｉｌｄ脚本(设置ＮＯＤＥ＿ＥＮＶ环境变量设置为ｐｒｏｄｕｃｔｉｏｎ，　并对相应的ｗｅｂｐａｃｋ配置文件运行ｗｅｂｐａｃｋ命令)：
                "build:client": "cross-env NODE_ENV=production webpack --progress --hide-modules --config webpack/client.js",
                "build:server": "cross-env NODE_ENV=production webpack --progress --hide-modules --config webpack/server.js",
                //新建ｂｕｉｌｄ脚本，　用来清空ｄｉｓｔ文件夹　并运行上面两个脚本：
                "build": "rimraf dist && npm run build:client && npm run build:server",
                //添加ｓｔａｒｔ脚本，　以生产模式运行ｅｘｐｒｅｓｓ服务器
                "start": "cross-env NODE_ENV=production node server",
                //最后　ｎｐｍ　ｒｕｎ　ｂｕｉｌｄ 构建　＋　　ｎｐｍ　ｓｔａｒｔ　启动ｅｘｐｒｅｓｓ服务器