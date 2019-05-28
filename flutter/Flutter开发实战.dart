//一、Dart语言和Flutter基础
  //dart语言
  /* 
  基本类型：
    用var定义变量   支持闭包
    number类型为int和double  没有float  Java的long对应int
    只有bool类型可以用if判断  像js中的 var g = ‘null’； if（g）{}  不合法
    switch支持String类型
  
  变量：
    不需要setter/getter  所有基础类型/类都继承自Object 默认值NULL， 自带getter/setter  但final const只有getter
    数值作为字符串使用时 要显示指定 int i=0; print('aaa' + i);不行， 要 print('aaa' + i.toSting());
    数组等于列表  var list=[] 和 List list = new List() 相同
  
  方法：
    ??, ??=是操作符    AA ?? "999" 表示如果 AA 为空，返回999；  而 AA ??= "999" 表示如果AA为空，AA赋值成999
    方法可以设置默认参数和指定名称  getDetail(String userName, reposName, {branch = "master"}){}  如branch不设置 默认是master
    不像java 没有public private  默认公开 前加下划线表示私有  还有@protected注解
    dart里很多构造函数， 默认构造方法一个 Model.empty()方法创建一个空参数的类  变量初始化值时 只要通过this.name在构造 方法中指定即可：
  */
    Class ModelA{
      String name;
      string tag;

      //默认构造方法： 赋值给name和tag
      ModelA(this.name, this.tag);

      //返回一个空的ModelA
      ModelA.empty();

      //返回一个设置了name的ModelA
      ModelA.forName(this.name);
    }


  //flutter基础
    /* 
    里面的setState很有React Native的既视感， 也是通过state跨帧实现管理数据状态的
    Fluter中一切皆Widget呈现  通过build方法返回Widget  像React Native中通过render函数返回要渲染的component
    支持async / await 像ES7 异步也像ES6的promise 只是Flutter中返回的是Future对象  通过then().then().  流式操作
     */
    //模拟等2秒 返回ok
    request() asyc{
      await Future.delayed(Duration(seconds: 1));
      return 'ok';
    }
    //将ok改为ok from request
    doSomeThing() async{
      String data = await request();
      data = 'ok from request';
      return data;
    }
    //打印结果
    renderSome(){
      doSomeThing().then((value){
        paint(value);
      });
    }

  //Widget :
    /* 
    Flutter 中，一切的显示都是 Widget 。Widget 是一切的基础，作为响应式的渲染，属于 MVVM 的实现机制。
    我们通过修改数据 再用setState设置数据  Flutter会通过绑定的数据更新Widget  
    所有要做的只是实现Widget界面 并和数据绑定起来

    Widget分有状态和没有两种， Flutter每个状态都是一帧  没有状态就是保持在那一帧  
    有状态的Widget当数据更新时 会绘制新的Widget  State实现了数据在跨帧中的同步保存
    当代码框里输入 stl 的时候，可以自动弹出创建无状态控件的模板选项，而输入 stf 的时，就会弹出创建有状态 Widget 的模板选项。
     */

    //无状态 StatelessWidget   实现：
      /* 
      通过继承StatelessWidget  build方法返回一个布局好的控件 
      Widget 和 Widget 之间通过child： 进行嵌套， 
      有的Widget只能有一个child 如Container  有的Widget有多个child 即children    
      */
      // Container Widget 嵌套了 Text Widget。
      import 'packge: flutter/material.dart';

      class DEMOWidget extends StatelessWidget{
        final String text;

        //数据可以通过构造方法传递进来
        DEMOWidget(this.text);

        @override
        Widget build(BuildContext context){
          //这里返回需要的组件    这里末尾有无逗号 对格式化代码是不一样的
          return Container(
            //白色背景
            color: Color.white,
            //？？ 表示如果text为空  返回后面的内容
            child: Text(text ?? ''not found DMEO),
          );
        }
      }

    //有状态 StatefulWidget
      /* 
      要创建管理的主要是State 通过State的build方法去构建控件  
      在State中可以动态改变数据  setState后 改变的数据会触发Widget重新构建刷新
      State生命周期： initState初始化  didChangeDependencies初始化后调用 此时可获取其他State   dispose销毁
      我们需要的只是在 build 中堆积布局，然后把数据添加到 Widget 中，最后通过 setState 改变数据，从而实现画面变化。
       */
      //是通过延两秒之后，让文本显示
      import 'dart:async';
      import 'package:flutter/material.dart';

      Class DemoStateWidget extends StatefulWidget{
        final String text;
        //构造方法传值
        DemoStateWidget(this.text);

        //主要用于创建State
        @override
        _DemoStateWidgetState createState () => _DemoStateWidgetState(text);
      }

      Class _DemoStateWidgetState extends State<DemoStateWidget>{
        String text;
        _DemoStateWidgetState(this.text);
        @override
        void initState(){
          sueer.initState();    //初始化
          new Future.delayed(const Duration(seconds:1), (){   //定时2秒
            setState(() {
              text = "这就改变了值"；
            })；
          })；
        }

        @override
        void dipose(){
          super.dispose();
        }

        @override
        void didChangeDependencies(){     //初始化后当State类变化时调用
          super.didChangeDependencies();
        }

        @override
        Widget build(BuildContext context){
          return Container(
            child: Text(text ?? '这就是有状态DEMO'),
          );
        }
      }

    //Fulutter 布局               常用有 Container、Padding、Center、Flex、Stack、Row、Column、ListView
    /* 
    Container（默认布局）
    只有一个子 Widget。默认充满，包含了padding、margin、color、宽高、decoration 等配置。

    Padding
    只有一个子 Widget。只用于设置Padding，常用于嵌套child，给child设置padding。

    Center
    只有一个子 Widget。只用于居中显示，常用于嵌套child，给child设置居中。

    Stack
    可以有多个子 Widget。 子Widget堆叠在一起。

    Column
    可以有多个子 Widget。垂直布局。

    Row
    可以有多个子 Widget。水平布局。

    Expanded
    只有一个子 Widget。在  Column 和  Row 中充满。

    ListView
    可以有多个子 Widget的列表。
    */
    ///返回一个居中带图标和文本的Item
      _getBottomItem(IconData icon, String text) {
        ///充满 Row 横向的布局
        return new Expanded(
          flex: 1,
          ///居中显示
          child: new Center(
            ///横向布局
            child: new Row(
              ///主轴居中,即是横向居中
              mainAxisAlignment: MainAxisAlignment.center,
              ///大小按照最大充满
              mainAxisSize : MainAxisSize.max,
              ///竖向也居中
              crossAxisAlignment : CrossAxisAlignment.center,
              children: <Widget>[
                ///一个图标，大小16.0，灰色
                new Icon(
                  icon,
                  size: 16.0,
                  color: Colors.grey,
                ),
                ///间隔
                new Padding(padding: new EdgeInsets.only(left:5.0)),
                ///显示文本
                new Text(
                  text,
                  //设置字体样式：颜色灰色，字体大小14.0
                  style: new TextStyle(color: Colors.grey, fontSize: 14.0),
                  //超过的省略为...显示
                  overflow: TextOverflow.ellipsis,
                  //最长一行
                  maxLines: 1,
                ),
              ],
            ),
          ),
        );
      }

      //把上方的方法，放到新的布局里
      @override
        Widget build(BuildContext context) {
          return new Container(
            ///卡片包装
            child: new Card(
                ///增加点击效果
                child: new FlatButton(
                    onPressed: (){print("点击了哦");},
                    child: new Padding(
                      padding: new EdgeInsets.only(left: 0.0, top: 10.0, right: 10.0, bottom: 10.0),
                      child: new Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          ///文本描述
                          new Container(
                              child: new Text(
                                "这是一点描述",
                                style: TextStyle(
                                  color: Color(GSYColors.subTextColor),
                                  fontSize: 14.0,
                                ),
                                ///最长三行，超过 ... 显示
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                              ),
                              margin: new EdgeInsets.only(top: 6.0, bottom: 2.0),
                              alignment: Alignment.topLeft),
                          new Padding(padding: EdgeInsets.all(10.0)),

                          ///三个平均分配的横向图标文字
                          new Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              _getBottomItem(Icons.star, "1000"),
                              _getBottomItem(Icons.link, "1000"),
                              _getBottomItem(Icons.subject, "1000"),
                            ],
                          ),
                        ],
                      ),
                    ))),
          );
        }




    //Flutter页面                 常见的有 MaterialApp、Scaffold、Appbar、Text、Image、FlatButton
    /* 
    MaterialApp
      一般作为APP顶层的主页入口，可配置主题，多语言，路由等

      Scaffold
      一般用户页面的承载Widget，包含appbar、snackbar、drawer等material design的设定。

      Appbar
      一般用于Scaffold的appbar ，内有标题，二级页面返回按键等，当然不止这些，tabbar等也会需要它 。

      Text
      显示文本，几乎都会用到，主要是通过style设置TextStyle来设置字体样式等。

      RichText
      富文本，通过设置TextSpan，可以拼接出富文本场景。

      TextField
      文本输入框 ：new TextField(controller: //文本控制器, obscureText: "hint文本");

      Image
      图片加载: new FadeInImage.assetNetwork( placeholder: "预览图", fit: BoxFit.fitWidth, image: "url");

      FlatButton
      按键点击: new FlatButton(onPressed: () {},child: new Container());
       */

      /* 实现一个简单完整的页面试试：

      首先我们创建一个StatefulWidget：DemoPage。
      然后在 _DemoPageState中，通过build创建了一个Scaffold。
      Scaffold内包含了一个AppBar和一个ListView。
      AppBar类似标题了区域，其中设置了 title为 Text Widget。
      body是ListView,返回了20个之前我们创建过的 DemoItem Widget。
      */
      import 'package:flutter/material.dart';
      import 'package:gsy_github_app_flutter/test/DemoItem.dart';

      class DemoPage extends StatefulWidget {
        @override
        _DemoPageState createState() => _DemoPageState();
      }

      class _DemoPageState extends State<DemoPage> {
        @override
        Widget build(BuildContext context) {
          ///一个页面的开始
          ///如果是新页面，会自带返回按键
          return new Scaffold(
            ///背景样式
            backgroundColor: Colors.blue,
            ///标题栏，当然不仅仅是标题栏
            appBar: new AppBar(
              ///这个title是一个Widget
              title: new Text("Title"),
            ),
            ///正式的页面开始
            ///一个ListView，20个Item
            body: new ListView.builder(
              itemBuilder: (context, index) {
                return new DemoItem();
              },
              itemCount: 20,
            ),
          );
        }
      }
      /// 最后我们创建一个StatelessWidget作为入口文件，
      ///实现一个MaterialApp将上方的DemoPage设置为home页面，通过main入口执行页面。
      import 'package:flutter/material.dart';
      import 'package:gsy_github_app_flutter/test/DemoPage.dart';

      void main() {
        runApp(new DemoApp());
      }

      class DemoApp extends StatelessWidget {
        DemoApp({Key key}) : super(key: key);

        @override
        Widget build(BuildContext context) {
          return new MaterialApp(home: DemoPage());
        }
      }



//二、快速开发
  //基础控件
    //实现页面的组合： Scaffold + AppBar + Tabbar + TabbarView / PageView  (PageView 更好)

    //Tabbar 
      //State
      class _GSYTabBarState extends State<GSYTabBarWidget> with SingleTickerProviderStateMixin{
        //..
        @override 
        void initState(){
          super.initState();
          ///初始化时创建控制器
          ///通过 with SingleTickerProviderStateMixin 实现动画效果。
          _tabController = new TabController(vsync: this, length: _tabItems.length);
        }

        @override
        void dispose(){
          //页面销毁时，销毁控制器
          _tabController.dispose();
          super.dispose();
        }

        @override
        Widget build(BuildContext context){
          //底部TABar模式
          return new Scaffold(
            //设置底部滑出drawer
            floatingActionButton: _floatingActionButton,
            //标题栏
            appBar: new AppBar(
              backgroundColor: _backgroundColor,
              title: _title,
            ),
            //界面主体， PageView 用于承载Tab对应的页面
            body: new PageView(
              //控制器 （必须） 与tabBar的控制器同步
              controller: _pageController,
              //每一个tab对应的页面主体  是一个List《Widget》
              children: _tabViews,
              onPageChenged: (index){
                //页面触摸作用 滑动回调  用于同步tab选中状态
                _tabController.animateTo(index);
              },
            ),
            //底部导航栏  即tab栏
            bottomNavigationBar: nwe Material(
              color: _backgroundColor,
              //Tabbar控件
              child: new TabBar(
                //必须有的控制器  与pageView的控制器同步
                controller: _tabController,
                //每一个tab item 是一个List<Widget>
                tabs: _tabItems,
                //tab底部选中条颜色
                indicatorColor: _indicatorColor,
              ),
            )
          );
        }
      }
      上代码所示，这是一个 底部 TabBar 的页面的效果。TabBar 和 PageView 之间通过 _pageController 和 _tabController 实现 Tab 和页面的同步
      通过 SingleTickerProviderStateMixin 实现 Tab 的动画切换效果 (ps 如果有需要多个嵌套动画效果，你可能需要TickerProviderStateMixin)。 从代码中我们可以看到：

      手动左右滑动 PageView 时，通过 onPageChanged 回调调用 _tabController.animateTo(index); 同步TabBar状态。

      _tabItems 中，监听每个 TabBarItem 的点击，通过 _pageController 实现PageView的状态同步。

        而上面代码还缺少了 TabBarItem 的点击，因为这块被放到了外部实现。当然你也可以直接在内部封装好控件，直接传递配置数据显示，这个可以根据个人需要封装。

        外部调用代码如下：每个 Tabbar 点击时，通过pageController.jumpTo 跳转页面，每个页面需要跳转坐标为：当前屏幕大小乘以索引 index 。

        class _TabBarBottomPageWidgetState  extends State<_TabBarBottomPageWidget>{
          final PageController pageController = new PageController();
          final List<String> tab - ["动态", "趋势", "我的"];

          //渲染底部Tab
          _renderTab(){
            List<Widget> list = new List();
            for (int i=0; i<tab.length; i++){
              list.add(new FlatButton(onPressed: (){
                ///每个 Tabbar 点击时，通过jumpTo 跳转页面
      	        ///每个页面需要跳转坐标为：当前屏幕大小 * 索引index。
                topPageControl.jumpTo(MdiaQuery
                  .of(context)
                  .size
                  .width * i
                  );
              }, child:new Text(
                tab[i],
                maxLines: 1,
              )));
            }
            return list;
          }

          //渲染Tab 对应页面
          _renderPage(){
            return [
              new TabBarPageFirst(),
              nwe TabBarPageSecond(),
              new TabBarPageThree(),
            ];
          }

          @override
          Widget build(BuildContext context){
            //带 Scaffold 的Tabbar页面
            return new GSYTabBarWidget(
              type: GSYTabBarWidget.BOTTOM_TAB,
              //渲染Tab
              tabItems: _renderTab(),
              //渲染页面
              tabViews: _renderPage(),
              topPageControl: pageController,
              backgroundColor: Colors.black45,
              indicatorColor: Colors.white,
              title: new Text("GSYGithubFlutter")
            );
          }
        } 

        如果到此结束，你会发现页面点击切换时，StatefulWidget 的子页面每次都会重新调用initState。
        这肯定不是我们想要的，所以这时你就需要AutomaticKeepAliveClientMixin 。

        每个 Tab 对应的 StatefulWidget 的 State ，需要通过with AutomaticKeepAliveClientMixin ，
        然后重写 @override bool get wantKeepAlive => true; ，就可以实不重新构建的效果了

        //顶部tab  与底部tab的区别： 底部的tab 在Scaffold的bottomNavigationBar 而顶部的是在AppBar 的bottom 即标题栏下
        // 同时我们在顶部 TabBar 增加 isScrollable: true 属性，实现常见的顶部Tab的效果
        return new Scaffold(
          //设置侧边滑出drawer
          drawer: _drawer,
          //悬浮按键
          floatingActionButton: _floatingActionButton,
          //标题栏
          appBar: new AppBar (
            backgroundColor: _backgroundColor,
            title: _title,
            //Tabbar控件
            bottom: new TabBar(
              //顶部时 TabBar可以滑动（模式）
              isScrollable: true,
              //必须有的控制器  与pageView的控制器同步
              controller: _tabController,
              //每一个tab item 都是一个List <Widget>
              tabs: _tabItems,
              //tab底部选中条颜色
              indicatorColor: _indicatorColor,
            ),
          ),
          //页面主体 PageView  用于承载Tab对应的页面
          body: nwe PageView(
            //必须要有的控制器  与tabBar的控制器同步
            controller: _pageController,
            //每一个tab 对应的页面主体 是一个List《Widget》
            children: _tabViews,
            //页面触摸作用 滑动回调  用于同步tab选中状态
            onPageChanged: (index){
              _tabController.animateTo(index);
            },
          ),
        );
        /*在 TabBar 页面中，一般还会出现：父页面需要控制 PageView 中子页的需求。
        这时候就需要用到GlobalKey了。比如 GlobalKey<PageOneState> stateOne = new GlobalKey<PageOneState>(); ，
        通过 globalKey.currentState 对象，你就可以调用到 PageOneState 中的公开方法。这里需要注意 GlobalKey 需要全局唯一，一般可以在build 方法创建*/

        //2上下刷新列表     flutter提供了 RefreshIndicator 下拉刷新组件， 而我们给ListViwe添加ScrollController滑动监听， 最后加上一个Item作为loading显示
        class ——GSYPullLoadWidgetState extends State<——GSYPullLoadWidgetState>{
          ///...
          final ScrollController  _scrollController = new ScrollController();

          @override 
          void initState(){
            //增加滑动监听
            _scrollController.addListener((){
              //判断到底？ 触发加载更多回调
              if(_scrollController.position.pixels == _scrollController.posotion.maxScrollExtent){
                if(this.onLoadMore != null  && this.control.needLoadMore){
                  this.onLoadMore();
                }
              }
            });
            super.initState();
          }

          //根据配置状态返回实际列表数量  可添加其他处理如多个头部 /空页面 /显示加载更多？
          _getListCount(){
            //是否需要头部
            if(control.needHeader){
              //如果要  Item0的Widget作为ListView的头   列表数大于0时因为头部和底部的更多选项， 需要对列表数据总数加2
              return (control.dataList.length > 2) ? control.dataList.length+2 : control.dataList.length+1;
            } else {
              //不要头部 在没有数据时  固定返回数量1用于空页面显示
              if (control.dataList.length == 0){
                return 1;
              }
              //如果有数据 因加载更多选项  要对列表数据总数量+1
              return (control.dataList.length > 0) ? control.dataList.length +1 : control.dataList.length;
            }
          }
          //根据配置状态返回实际列表渲染Item
          _getItem(int index){
            if(!control.needHeader && index == control.dataList.length && control.dataList.length != 0){//不要头，并不为0，index等于数据长，加载更多Item（index从0始）
              return _buildProgressIndicator();
            } else if(control.needHeader && index == _getListCount()-1 && control.dataList.length !=0){//要头， 不为0， index=数据长-1， 渲染更多Item   （index从0始） 
              return _buildProgressIndicator();
            } else if (!control.needHeader && control.dataList.length == 0){//不要头 数据为0  渲染空页面
              return _buildEmpty();
            } else { //回调外部正常渲染Item   也可根据需要直接返回相对位置的index
              return itemBuilder(context, index);
            }
          }

          @override
          Widget build(BuildContext context){
            return new RefreshIndicator(
              //全局键GlobalKey  用户外部获取RefreshIndicator的State  做显示刷新， 
              key : refreshKey,
              //下拉刷新触发， 返回一个Future
              onRefresh: onRefresh,
              child: new ListView.builder(
                //保持ListView任何情况下可滚动， 解决在RefreshIndicator的兼容问题
                physics: const AlwaysScrollableScrollPhysics(),
                //根据状态返回子控件
                itemBuilder: (context, index){
                  return _getItem(index);
                },
                //根据状态返回数量
                itemCount: _getListCount(),
                //滑动监听
                controller: _scrollController,
              ),
            );
          }

            //空页面
            idget _buildEmpth(){
              ///...
            }

            //上拉加载更多
            Widget _buildProgressIndicator(){
              ///...
            }
          }
        

        //3 loading框  (使用库 实现更多效果)
          //上拉加载更多
            Widget _buildProgressIndicator(){
              //是否需要显示上加载更多的loading
              Widget bottomWidget = (control.needLoadMore) ? new Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
                //loading框
                new SpinkitRotatingCircle(color: Color(0XFF24292E)),
                new Container(width: 5.0,),
                //加载中文文本
                new Text(
                  "加载中。。。",
                  style: TextStyle(
                    color: Color(0xFF121917),
                    fontSize: 14.0,
                    fontWeight: fontWeight.bold,
                  ),
                )
              ])  
              //不需要加载
              : new Container();
            return new Padding(
              padding: const EdgeInsets.all(20.0),
              child: new Center(
                child: bottomWidget,
              ),
            );
            }
          
        //4 矢量图标库 引入ttf字体库实现 （pubspec.yaml添加字体库支持 + IconData指向字体库名引用 / 内置Icons对象） 通过Icon控件， 加载对应的IconDate
          //pubspec.yaml
          fonts：
            -family: wxcIconFont
            fonts:
            -asset: static/font/iconfont.
          //使用内置Icons
          new Tab(
            child: new Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[new Icon(Icons.list, size:16.0), new Text("趋势")],
            ),
          ),
          //使用iconfont
          new Tab(
            child: new Colum(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[new Icon(IconData(0xe6d0, fontFamily: "wxcIconFont"), size:16.0), new Text("我的")],
            ),
          )
        //5路由跳转  通过Navigator实现   分带不带参数， 默认MaterialApp路由表跳转， 参数的则通过页面的构造方法传递
          //无路由
          Navigator.pushNamed(contxt, routeName);
          //跳转并替换 （如登陆页跳主页）
          Navigator.pushReplacementNamed(context, routeName);
          //跳转并关闭之前所有路由
          Navigator.pushNamedAndRemoveUntil(context, '/calendar', ModalRoute.withName('/'));
          //带参数的跳转 并监听返回
          Navigator.push(context, new MaterialPageRoute(builder: (context) => new NotifyPage()))
              .then((res){
                //获取返回处理
              });
          //Navigator 的 push 返回的是一个 Future(页面返回时被调用), 可以通过 Navigator 的 pop 时返回参数，之后在 Future 中可以的监听中处理页面的返回结果。





//三、数据模块
    //1 网络请求  Dio封装了数据转换/拦截器/请求返回，，  通过对Dio的简单封装即可快速实现网络请求
    //创建网络请求对象
    Dio dio = new Dio();
    Response response;
    try{  //发起请求 （url/数据/Map或FormData / options要额外配置超时 头部 请求类型 数据响应类型 host）
      response = awiat dio.request(url, data: params, options:options)
    } on DioError catch (e){
      //http错误是通过DioError的catch返回的一个对象
      //。。。
    }

    //2 json序列化  json实际收到时变成了map  要再格式化一次，  so 有了插件json_serializable
    dependencies:
      # Your other regular dependencies needHeader
      json_annotation ^0.2.2

    dev_dependencies:
      # Your other dev_dependencies here
      build_runner: ^0.7.6
      json_serializable: ^0.3.2

    //创建你的实体 Model 之后，继承 Object 、然后通过 @JsonSerializable() 标记类名。
    //通过 with _$TemplateSerializerMixin，将 fromJson 方法委托到 Template.g.dart 的实现中。 其中 *.g.dart、_$* SerializerMixin、_$*FromJson 这三个的引入， 和 Model 所在的 dart 的文件名与 Model 类名有关，具体可见代码注释和后面图片。
    //最后通过 flutter packages pub run build_runner build 编译自动生成转化对象。（个人习惯完成后手动编译）
    //import 'package:json_annotation/json_annotation.dart';

    ///关联文件、允许Template访问 Template.g.dart 中的私有方法
    ///Template.g.dart 是通过命令生成的文件。名称为 xx.g.dart，其中 xx 为当前 dart 文件名称
    ///Template.g.dart中创建了抽象类_$TemplateSerializerMixin，实现了_$TemplateFromJson方法
    //part 'Template.g.dart';

    @JsonEstializable();    //标志class需要先实现json序列化功能

    //如‘xx.g.dart’文件中 默认会根据当前类名如AA  生成 _AASerializerMixin
    class Template extends Object with _$TemplateSerializerMixin{
      String name;
      int id;

      //通过jsonKey重新定义参数名
      @JsonKey(name: "push_id")
      int pushId;

      Template(this.name, this.id, this.pushId);

      //'xx.g.dart'文件中，默认还会根据当前类名如 AA 生成 _$AAeFromJson方法
      factory Template.fromJson(Map<String, dynamic> json) => _$TemplateFromJson(json);
    //now 可以通过 Template.fromJson 和toJson 方法对实体与map进行转化，再结合json.decode 和 json.encode，现在可以愉悦的在string 、map、实体间相互转化了。
    }

    part of 'Template.dart';
    Template _$TemplateFromJson(Map<String, dynamic> json) => new Template(
      json['name'] as String, json['id'] as int, json['push_id'] as int
    );

    abstract class _$TemplateSerializerMixin{
      String get name;
      int get id;
      int get pushId;
      Map<String, dynamic> toJson() => 
        <String, dynamic>{'name': name, 'id':id, 'push_id': push_id};
    }

  //3, Redux State   Flutter_redux 的使用:引入了 action、reducer、store 概念 (action定义数据变化请求， reducer根据action产生新状态， store存/管State 监听action并将其分配reducer 再根据后者执行结果更新state)
    //先创一个 State 存储需要保存的对象，而关键代码在于 UserReducer。
    class GSYState {  //全局Redux store对象，  保存store数据   
      //用户信息
      User userInfo;
      //构造方法
      GSYState({this.userInfo});
    }

    //通过Reduce创建用于store的Reducer
    GSYState appReducer(GSYState state, action){
      return GSYState(
        //通过UserReducer将GSYState内的userInfo 和 action关联再一起
        userInfo: UserReducer(state.userInfo, action),
      );
    }

    //实现Reducer： 通过 TypedReducer 将 reducer 的处理逻辑与定义的 Action 绑定，最后通过 combineReducers 返回 Reducer<State> 对象应用于上方 Store 中。
      //redux的combineReducers： 又通过 TypedReducer 将 UpdateUserAction 与 reducers 关联起来
      final UserReducer = combineReducers<User>([
        TypedReducer<User, UpdateUserAction>(_updateLoaded),
      ]);

      //UpdateUserAction收到一个请求 -》 调用_updateLoaded -> 接收一个新的userInfo， 并返回
      User _updateLoaded(User user, action){
        user = action.userInfo;
        return user;
      }

      //定一个UpdateUserAction， 用于发起userInfo的改变 通过上面的TypedReducer绑定
      class UpdateUserAction{
        final User userInfo；
        UpdateUserAction(this.userInfo);
      }

  //在Flutter里引入store， 通过StoreProvider 将创建的store引入到Flutter
  void main(){
    runApp(new FlutterReduxApp());
  }
  class FlutterReduxApp extends StatelessWidget{
    //创建Store 引用GSYState中的appReducer创建的Reducer      initialState初始化State
    final store = new Store<GSYState>(appReducer, initialState: new GSYState(userInfo: User.empth()));

    FlutterReduxApp({Key Key}) : super(key: key);

    @override
    Widget build(BuildContext context){
      //通过StoreProvider 应用 store
      return new StoreProvider(
        store: store,
        child: new MaterialApp(
          home: DemoUserStorePage(),
        ),
      );
    }
  }

  //通过 StoreConnector 将State 绑定到 Widget；  通过 StoreProvider.of 可以获取 state 对象；   通过 dispatch 一个 Action 可以更新State。
  class DemoUserStorePage extends StatelessWidget{
    @override
    Widget build(BuildContext context){
      //StoreConnector关联GSYState中的User
      return new StoreConnector<GSYState, User>(
        //通过converter将GSYState的userInfo返回
        converter: (store) => store.state.userInfo,
        //在userInfo中返回实际渲染的控件
        builder: (context, userInfo){
          return new Text(
            userInfo.name,
            style: Theme.of(context).textTheme.display1,
          );
        },
      );
    }
  }
  //...

  //通过StoreProvider.of(context) 可以任意位置访问到state的数据
  StoreProvider.of(context).state.userInfo;

  //通过dispatch UpdateUserAction 可以更新State
  StoreProvider.of(context).dispatch(new UpdateUserAction(newUserInfo));

  //4.数据库
    /*使用sqllite语法， 通过定义 Provider 操作数据库：
    在 Provider 中定义表名与数据库字段常量，用于创建表与字段操作；
    提供数据库与数据实体之间的映射，比如数据库对象与User对象之间的转化；
    在调用 Provider 时才先判断表是否创建，然后再返回数据库对象进行用户查询。
    如果结合网络请求，通过闭包实现，在需要数据库时先返回数据库，然后通过 next 方法将网络请求的方法返回，最后外部可以通过调用next方法再执行网络请求。*/

    UserDao.getUserInfo(userName, needDb:true)
        .then((res){
          //数据库结果
          if(res != null && res.result){
            setState(() {
              userInfo = res.data;
            });
          }
          return res.next;
        })
        .then((res){
          //网络结果
          if(res != null && res.result){
            setState(() {
              userInfo = res.data;
            });
          }
        });




  //四、其他功能
    //1， 返回按键监听  WillPopScope：页面要被pop时触发的回调 如嵌套可以监听安卓返回键  
    class HomePage extends StatelessWidget{
      //单击提示退出
      Future<bool> _dialogExitApp(BuildContext context){
        return showDialog(
          context: context,
          builder: (context) => new AlertDialog(
            content: new Text("是否退出"),
            actions: <Widget>[
              new FlatButton(onPressed: () => Navigator.of(context).pop(false), child: new Text("取消")),
              new FlatButton (
                onPressed: (){
                  Navigator.of(context).pop(true);
                },
                child: new Text("确定")
              )
            ],
          )
        );
      }

      //这个Widget是你应用的根
      @override
      Widget build(BuildContext context){
        return WillPopScope(
          onWillPop: (){
            //如果返回 return new Future.value(false); popped就不会触发，反之true触发，    还可以通过showDialog弹出确定框，在返回时通过Navigator.of(context).pop(true);决定是否退出
            return _dialogExiatApp(context);
          },
          child: new Container(),
        );
      }
    }

    //2, 前后台监听   WidgetsBindingObserver包含控件的生命周期通知， 其中didChanggeAppLifecyleState可以前后台监听
    class _HomePageState extends State<HomePage> with WidgetsBindingObserver{
      //重写Widgets Binding Observer中的didChanggeAppLifecyleState
      @override
      void didChanggeAppLifecyleState(AppLifecycleState state){
        //通过state判断App前后台切换
        if(state == AppLifecycleState.resumed){
          //...
        }
      }

      @override
      Widget build(BuildContexxt context){
        return new Container();
      }
    }

    //3, 键盘焦点处理  （如收起键盘）  使用GestureDetector + FocusScope
    class _LoginPageState extends State<LoginPage>{
      @override
      Widget build(BuildContext context){
        //定义触摸层
        return new GestureDetector(
          //透明也响应处理
          behavior: HiTestBehavior.translucent,
          onTap: (){
            //触摸收起键盘
            FocusScope.of(context).requestFocus(new FocusNode());
          },
          child: new Container(),
        );
      }
    }

    //4, 启动页   
    //IOS 的在ios/Runner/Assets.xcassets/LaunchImage.imageset 下， 有Contents.json 文件和启动图片，   将自己的启动页放在这个目录下， 并修改Contents.json
    //Android 的在android/app/src/main/res/drawable/launch_background.xml  其中已经有写好的启动页， <itme> <bitmap>部分被屏蔽   只需要打开这个屏蔽，并且将你启动图修改为launch_image并放置到各个 mipmap 文件夹即可，记得各个文件夹下提供相对于大小尺寸的文件。
