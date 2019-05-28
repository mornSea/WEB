//1,创建Flutter app                           打开命令提示符，进入一个自己想新建flutter项目的文件夹下，输入：flutter create myflutter  执行完毕后，会在文件夹下生成一个myflutter文件
  //1.1 lib/main.dart     输出“hello world”
  import 'package:flutter/material.dart';

  void main() => runApp(new MyApp());             //单行函数  方法简写

  Class MyApp extends StatelessWidget{            //继承了StatelessWidget  使得它本身也成为一个widget（flutter里 大多数都是widget  包括对齐alignment，填充padding，布局layout）
    @override
    Widget build (BuildContext context){          ////widget的主要工作是提供一个build（）方法描述如何根据其他较低级别的widget来显示自己 
      return new materialApp(                     //这个materialApp是执行的  代表一种设计语言 （Material widgets）
        title: 'Welcome to Flutter',
        home: new Scaffold(                       //Scaffold 是 material library提供的一个widget 提供了默认的导航栏， 标题， 包含主屏幕widget树的body属性 
          appBar: new AppBar(
            title : new Text('Welcome to Flutter'),   
          ),  
          body: new Center(                       //body的widget树包含一个Center widget（居中元素），  Center widget又包含一个Text子widget， 这样Center widget可以将其子widget树对齐到屏幕中心
            child: new Text ('hello world'),
          ),
        ),
      );
    }
  }

//2 使用外部包   使用pub.dartlang.org 上的English_words软件包
  //2.1 flutter的assets资源（图片， package，，，）在pubspec.yaml中将这个包添加到依赖项：
    //pubspec.yaml
    dependencies:
      flutter:
        sdk: flutter

        cupertino_icons: ^0.1.0
        English_words: ^3.1.0               //添加这一行

    //2.2  在Android Studio不编辑器视图里查看pubspec时， 点击右上角的package get   这样就将依赖包安装到项目
    flutter packages get

    //2.3  lib.main.dart   引入这个包（在引入material.daer后）
    import 'package: flutter/material.dart';
    import 'package: english_words/english_words.dart';

    //2.4 使用这个包（动态）生成文本代替字符串“hello world”
      //新的  lib/main.dart
      import 'package:flutter/material.dart';
      import 'package:english_words/english_words.dart';        //new package

      void main() => runApp(new MyApp());

      class MyApp extends StatelessWidget {
        @override
        Widget build(BuildContext context) {                    //单词对是在 build 方法内部生成的。每次MaterialApp需要渲染时或者在Flutter Inspector中切换平台时 build 都会运行.

          final wordPair = new WordPair.random();               //添加一行  产生新随机数  用于在词库里找单词
          return new MaterialApp(
            title: 'Welcome to Flutter',
            home: new Scaffold(
              appBar: new AppBar(
                title: new Text('Welcome to Flutter'),
              ),
              body: new Center(
                //child: new Text('Hello World'),
                child: new Text(wordPair.asPascalCase),         //child 的值改为new Text（随机数.asPacalCase）即随机数找单词    现在 每次热重载/保存项目  都会切换单词  
              ),
            ),
          );
        }
      }

//3 添加一个 有状态的部件（Stateful widget）
  //stteless widgets是不可变的 即属性不可变 所有值都是最终的 而Stateful widgets的状态可能在widget生命周期变化 
    //实现一个stateful widget至少要两个类：  一个Stateful类 一个State类 前者本身不变， 但后者在widget中始终存在
    //3.1  main.tart  添加有状态的randomWords widget （可以在MyApp外任何地方用） 它唯一的目的是创建State类
    Class RandomWords extends StatefulWidget{             //RandomWords继承自用于创建State类的Statefulwidget   所以RandomWords是个State类（的实例？）
      @override
      createState () => new  RandomWordsState();
    }

    //3.2  添加RandomWordsState类  （这一次大部分代码在这个类里）  该类持有RandomWords widget的状态  
    //这个类将保持随用户滚动而无限增长的单词对  以及用户碰到喜欢的单词对时 点击心形♥ 将它们从列表添加/删除 
    Class RandomWordsState  extends State<RandomWords>{   //RandomWordsState  又继承自RandomWords （State）
    }

    //3.3  RandomWordsState类中添加build方法     （通过将生成成对的代码从MyApp 移动到RandomWordsState来生成单词对）
    @override
    Widget build(BuildContext context){
      final wordPair  = new WordPair.random();
      return nre Text(WordPair.asPascalCase);
    }

    class MyApp extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
          //final wordPair = new WordPair.random();     // 删除  因为生成随机数在新的类里

        return new MaterialApp(
          title: 'Welcome to Flutter',
          home: new Scaffold(
            appBar: new AppBar(
              title: new Text('Welcome to Flutter'),
            ),
            body: new Center(
              //child: new Text(wordPair.asPascalCase),
              child: new RandomWords(),               //把返回的内容 改为直接 返回一个新的RandomWords实例
            ),
          ),
        );
      }
    }
  //这样还只是像上次一样 每次热重载/保存应用时显示一个单词对
  //4 创建一个无限滚动的ListView    通过ListView的Builder工厂构造函数建立一个懒加载列表视图
    //4.1向RandomWordsState类添加一个_suggetstions 列表保存建议的单词对   添加一个_biggerFont变量增大字体  （下划线会将这个变量变私有）
    Calss RandomWordsState extends State<RandomWords>{
      final _suggestions = <WordPair>[];
      final _biggerFont = const TextStyle(fontSize: 18.0);
      //...
    }

    //4.2 向RandomWordsState类添加_buildSuggestions()函数 用于构建显示建议单词对的ListView
    //ListView类提供了一个builder属性  itemBuilder值是一个匿名回调函数  参数（BuildContext， 迭代器i）  
    //迭代器从0开始， 每调用一次该函数， i+1， 对于每个建议的单词都会执行一次  即无限增长
    Class RandomWordsState extends State<RandomWords>{
      //...
      Widget _buildSuggestions(){
        return new ListView.builder(
          padding: const EdgeInsets.all(16.0),
          itemBuilder: (context, i){
            if(i.isOdd) return new Divder();
            final index = 1 ~/2;
            if(index >= _suggestions.length){
              _suggestions.addAll(generateWordPairs().take(10));
            }
            return _buildRow(_suggestions[index]);
          }
        );
      }
    }

    //4.3 对每一个单词对 _buildSuggestions 调用一次_buildRow 这个函数在ListTile中显示每个新词对  生成显示行
    //RandomWordsState添加一个_buildRow函数
    Class RandomWordsState  extends State<RandomWords>{
      //...
      Widget _buildRow(WordPair pair){
        return new ListTile(
          title: new Text(
            pair.asPascalCase,
            style: _biggerFont,
          )
        )
      }
    }

    //4.4 更新RandomWorksState的build方法以是以使用 _buildSuggestions() 而不是直接调用单词生成库  重写为：
    Class RandomWordsState extends State<RandomWord>{
      //...
      Widget build(BuildContext context){
        return new Scaffold(
          appBar: new AppBar(
            title: new Text('Startup Name Genrator'),
          ),
          body: _buildSuggestions(),
        );
      }
      //...
    }

    //4.5 更新MyApp的build方法  从MyApp中删除Scaffold和App bar的实例  这些全由RandomWordState管理 使得用户在下一步从一个屏幕导航到另一个屏幕时， 可以轻易改导航栏的路由名称 
    Class MyApp extends StatelessWidget{
      @override
      Widget build(BuildContext context){
        return new MaterialApp(
          title: 'Startup Name Generator',
          home: new RandomWords(),
        );
      }
    }

//添加交互   每行添加一个可点击的心形  点击时  添加/移除收藏夹
  //5.1  添加一个_saved  Set(集合) 到RandomWordsState  里面存储用户喜欢的单词  （Set中不允许重复单词  所以比list合适）
  Class RandomWordsState extends State<RandomWords>{
    final _suggestions = <WordPair>[];
    final _saved = new Set<WordPair>();
    final _biggerFont = const TextStyle(fontSize: 18.0);
    //...
  }

  //5.2  在_buildRow方法添加alreadySaved 检查单词有没有添加到收藏夹
  Widget _buildRow(WordPair pair){
    final alreadySaved = _saved.contains(pair);
  }


  //5.3 同时在_buildRow（）中添加一个心形图标到ListView 以启用收藏功能  
  Widget _buildRow(WordPair pair){
    final alreadySaved = _saved.contains(pair);
    return new ListTile(
      title: new Text(
        pair.asPascalCase,
        style: _biggerFont,
      ),
      trailing: new Icon(           //通过三元赋值定义心形图标icon 和颜色
        alreadySaved ? Icons.favorite : Icons.favorite_border,
        color : alreadySaved ? Colors.red : null,
      ),
    );
  }

  //5.4  重新启动应用。你现在可以在每一行看到心形❤️图标️

  //5.5  在_buildRow中让图标可以点击   被点击时 函数调用setState（）通知框架状态已经改变
  Widget _buildRow(WordPair pair) {
  final alreadySaved = _saved.contains(pair);
  return new ListTile(
    title: new Text(
      pair.asPascalCase,
      style: _biggerFont,
    ),
    trailing: new Icon(
      alreadySaved ? Icons.favorite : Icons.favorite_border,
      color: alreadySaved ? Colors.red : null,
    ),  

    onTap: (){        //添加这个改变状态的方法给onTap事件
      setState(){
        if(alreadySaved){
          _saved.remove(pair);
        } else {
          _saved.add(pair);
          }
        }
      }
    );
  }

//6 导航到新页面  添加一个显示收藏内容的新页面（路由route）  
//导航器是一个栈， push推入一个路由是更新  pop弹出栈是返回前一个路由
  //6.1   RandomWordsState的build方法中为AppBar添加一个列表图标  点击时 包含收藏夹的新路由页面入栈显示
  class RandomWordsState extends State<RandomWords> {
    //...
    @override
    Widget build(BuildContext context) {
      return new Scaffold(
        appBar: new AppBar(
          title: new Text('Startup Name Generator'),
          //某些widget属性需要单个widget（child）， 其他一些属性如action 要一组widgets（children）  用方括号表示
          actions:  <Widger>[         //图标按钮 及按下事件的对应方法: _pushSaved   
            new IconButton(icon:new Icon(Icons.list), onParessed: _pushSaved),
          ], 
        ),
        body: _buildSuggestions(),
      );
    }
    //...
  }

  //6.2  向RandomWordsState类加入按钮事件对应的方法  (空方法)
  Class RandomWordsState extends State<RandomWords>{
    //...
    void _pushSaved(){

    }
  }

  //6.3 新页面的内容在MaterialPageRoute的builder属性中构建   builder是个匿名函数
  //添加Navigator.push调用  使路由入栈  (只推入到导航管理器器的栈 Navigator)
  void _pushSaved(){
    Navigator.of(context).push(
    );
  }

  //6.4 添加MaterialPageRoute 及 builder ： 添加生成ListTile行的代码
  //ListTile的divideTiles（）方法在每个ListTile之间添加一个像素的分割线  该divided变量持有最终的列表项
  void _pushSaved(){
    Navigator.of(context).push(     //添加到一个新 MaterialPageRoute
      new MaterialPageRoute(
        builder: (context){
          final tiles = _saved.map(
            (pair){
              return new ListTile(
                title: new Text(
                  pair.asPascalCase,
                  style: _biggerFont,
                ),
              );
            },
          );
          final divded = ListTile
            .divideTiles(
              context: context,
              tiles: tiles,
            )
            .tiList();
        },
      ),
    );
  }

  //6.5  builder返回一个Scaffold， 其中包含名为Saved Suggestions的新路由的应用栏， 
  //新路由的body由包含ListTiles行的ListView组成  每行之间通过一个分割线分隔
  void _pushSaved() {
    Navigator.of(context).push(
      new MaterialPageRoute(
        builder: (context) {
          final tiles = _saved.map(
            (pair) {
              return new ListTile(
                title: new Text(
                  pair.asPascalCase,
                  style: _biggerFont,
                ),
              );
            },
          );
          final divided = ListTile
            .divideTiles(
              context: context,
              tiles: tiles,
            )
            .toList();

          return new Scaffold(      //添加 Scaffold(appBar('SS'), body(ListView))
            appBar: new AppBar(
              title: new Text('Saved Suggestions'),
            ),
            body: new ListView(children: divided),
          );
        },
      ),
    );
  }

  //6.6 在新路由页面中显示收藏的内容。 导航器会在应用栏中添加一个“返回”按钮。不必显式实现Navigator.pop


//7 使用主题更改UI
  //配置ThemeData类轻松更改主体 如盖为白色
  class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
      return new MaterialApp(
        title: 'Startup Name Generator',

        theme: new ThemeData(       //添加主体类ThemeData  通过其中primaryColor：指定  Color中的white
          primaryColor: Colors.white,
        ),
        home: new RandomWords(),
      );
    }
  }  

  //7.2  Material library中的 Colors类提供了许多可以使用的颜色常量， 简单地尝试下
  //完。