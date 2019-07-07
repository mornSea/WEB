//全局安装（install -g） webpack，    npm init；   
//设置 dist（静态资源） src（代码文件） page.html(设置加载打包后的文件)  webpack.config.js(配置文件 其中一个对象 包含打包入口文件 打包出的文件的路径和文件名)  
//src下有两个js文件 可以都是空函数， 一个引用另一个 如默认的入口文件是index.js  他引用了tar。js     

//新手教程
    //创建一个目录，npm init，然后 在本地安装 webpack，接着安装 webpack-cli（此工具用于在命令行 中运行webpack） npm install webapck webpack-cli --save-dev
    //目录结构： 根目录下添加一个index。html，  新建src 添加一个index。js   调整package.json  以确保包是私有的; 并移除main入口  防止意外发布代码（用"private"：true  替换main：入口文件）
    //有时《script》标签之间包含隐式依赖， 如index。js文件执行之前 依赖于页面中引入的另一个包， 此时要调整一下目录结构
        //将源代码（src）从分发代码（dist）中分离：“源”代码是用于书写和编辑的代码。“分发”代码是构建过程产生的代码最小化和优化后的“输出”目录，最终将在浏览器中加载;  
        //将index.html剪切到dist下，  要在index。js中打包lodash依赖 需要先在本地安装library 如：  npm install --save lodash  （如果是开发环境 用--save-dev）
        //脚本中import lodash;    index对应的script也改为一个src="main.js" 即调用之后打包在dist的js
        //index.html这里显式要求lodash必须存在， 绑定为 _ , 没有全局作用域, 因为通过声明模块需要的依赖，webpack可以优化出一个以正常顺序执行的bundle 或者通过执行npx webpack 输出main.js
        //执行 npx webpack，会将我们的脚本作为入口起点，然后 输出 为 main.js。Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（./node_modules/.bin/webpack）


//资源管理
    //使用配置文件。这比在终端(terminal)中手动输入大量命令要高效的多，所以让我们创建一个取代以上使用 CLI 选项方式的配置文件 根目录下webpack.config.js
    //通过新配置文件再次执行构建：npx webpack --config webpack.config.js
    // package.json 添加一个 npm 脚本(npm script)现在，可以使用 npm run build 命令，来替代我们之前使用的 npx 命令。注意，使用 npm 的 scripts，我们可以像npx那样通过模块名引用本地安装的npm包。

    //webpack 最出色的功能之一就是，除了 JavaScript，还可以通过 loader 引入任何其他类型的文件 如要加入css 就先npm install --save-dev style-loader css-loader 
    //并修改webpack配置文件， 添加module类 里面有test用正则表达式限定类型， use制定用什么加载器

    //用 file-loader，我们可以轻松地将这些内容混合到 CSS 中：npm install --save-dev file-loader; 并在webpack.config.js的module的rules中加入一个新对象, 
    //先将图加入到src下， 再修改index.js(import图 并加入到dom元素中), css中加入图为背景; 当你import MyImage from './my-image.png'该图像将被处理并添加到output目录，并且 MyImage 变量将包含该图处理后的最终url(hash)
    //file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。  更新wepack.config.js, index.js style.css,  css中你可以通过一个 @font-face 声明引入
    //可以加载的有用资源还有数据，如 JSON 文件，CSV、TSV 和 XML。类似于 NodeJS，JSON 支持实际上是内置的，也就是说 import Data from './data.json' 默认将正常运行。要导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
    //又是添加文件到src， 改webpack.config.js, index.js,        


//管理输出
    //随着应用程序增长，并且一旦开始对文件名使用哈希(hash)]并输出多个 bundle，手动地对 index.html 文件进行管理，一切就会变得困难起来 -》 再用个插件
    //先把index.html的head中新添加一个script； 并添加新添加在head的那一个到配置文件的入口 多个不同名字的入口文件在ernty中以键值对的方式存储 并在出口值使用[name].bundle.js 生成入口中key对应的出口文件名
    //如果我们更改了我们的一个入口起点的名称，甚至添加了一个新的名称，会发生什么？生成的包将被重命名在一个构建中，但是我们的index.html文件仍然会引用旧的名字。我们用 HtmlWebpackPlugin 来解决这个问题: 
    //在webpack配置文件中导入并在入口和出口之间加入plugins数组 这样每次它都重新生成index.html 和对应的js ; 避免了index和webpack不一致的问题 在每次构建前(用插件clean-webpack-plugin)清理自动/dist,只会生成用到的文件。
    //安装clean-webpack-plugin后 webpack配置文件引入+plugins数组中加在HtmlWebpackPlugin之前， 实现每次构建新文件之前自动清理
    //但是这个插件更新了api  要const {CleanWebpackPlugin} = require('clean-webpack-plugin');引入 并直接new CleanWebpackPlugin()使用;
    

//开发： 错误跟踪提示&&自动编译+自动更新浏览器 
    //为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码 (webpack配置文件中的module。exports里添加devtool: 'inline-source-map') 这样console里的报错有文件名和行号
    //每次更改完 都要手动npm run build？ 这也可以自动化， 使用观察模式，（package.json中第一关对象添加"watch":"webpack --watch"） 只要依赖图中任一文件更改， 就自动重新编译 （挂后台）
    //每次更改完 还要手动再刷新浏览器？ 使用webpack-dev-server 这是个mini服务器  可以实时重新加载 先下载，在webpack配置文件中moudle.exports加入 devServer: {contentBase: './dist'}, 即加载哪里, 
        //再package中的scripts中加入"start": "webpack-dev-server --open", 这样运行npm start， 浏览器自动加载页面， 如文件修改， 自动编译且更新 (localhost:8080)
        //如果想实现更多自定义需求的话 下载express webpacl-dev-middleware;（服务器中间件） webpack配置文件output加入 publicPath：‘/’，  项目根目录加入server。js服务器脚本，package.js的start下加入"server": "node server.js", 然后可以npm run server  (localhost://3000)
        
//模块热替换  （运行时更新模块 不用刷新）
    //HMR插件(内置)+webpack-dev-server：   
        //webpack配置文件中引入webpack ， 从入口起点删除print。js（它正在被index。js使用）； devServer中加入hot：true ; plugins列表中加入 new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()   
        //在index。js 中加入逻辑 if（module.hot）{module.hot.accept(带console的回调)}  以便当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块
        // 在print。js  修改console.log的内容为'Updating print.js...‘
        //开发server（本地服务器）时 要将dev server作为创建选项的第二个参数 new WebpackDevServer(compiler, options) ；还要修改webpack配置对象， 包含HMR入口起点 可以在dev.server.js中使用webpack-dev-server中的addDevServerEntrypoints方法来实现
        //由于webpack4删除了CommonsChunkPlugin方法， so要修改为const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); +（与entry/plugins同级的）  optimization: { splitChunks: { cacheGroups: { commons: { name: "commons", chunks: "initial", minChunks: 2 } } } },
        //为了让事件处理器与HMR正常工作，我们需要使用 module.hot.accept 更新绑定到新的 printMe 函数上： 把component()赋值给一个变量， 然后dom操作这个变量 + if（module。hot）中printMe()替换为dom删除这个变量 并重新赋值和添加
        //用HMR修改样式表  类似之前的导入css （index引入+cssloader+配置文件中的module的rules中加入类型和loader） 略
 
//tree shaking  移除未引用代码  
    //假设index.js引用一个math。js文件， 并只使用其中一个函数， 这样输出的代码自动过滤掉没被引用的
    //在webpack配置文件中， module.exports对象的最后加入 mode：“production”  会压缩代码

//生产环境构建 （区别于开发环境）  目标变成更小的bundle 更轻的source map  建议为每个环境写独立的webpack配置文件
    //安装webpack-merge  将webpack.config.js 分为webpack- common / dev / prod .js 三个文件：
        //common设置entry output， 引入开发/生产共用的插件， 
        //dev 添加devtool（source map） devServer
        //prod 引入UglifyJSPlugin 
        //使用 merge() 很容易地包含我们在 dev 和 prod 中的常见配置
    
    //NPM   在package.json中把scripts对象重新指向到新配置（用键值对中值为 插件 --config 配置文件名  的方式指定） 如将 npm start 定义为开发环境脚本，并在其中使用webpack-dev-server，将 npm run build 定义为生产环境脚本
    //Minification 除了UglifyJSPlugin也可以试试 BabelMinifyWebpackPlugin  ClosureCompilerPlugin等压缩插件， 只要确保新插件也会按照 tree shake 指南中所陈述的，具有删除未引用代码(dead code)的能力足矣～
    //source map  适合生产环境，   如将inline-source-map切换到source map 只要在webpack。prod。js的merge（）中，加入devtool: 'source-map', 并在plugins列表中替换为new UglifyJSPlugin({sourceMap: true})
        //避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
    
    //指定环境  有些库需要关联process.env.NODE_ENV环境变量，  通过使用webpack内置的DefinePlugin为所有的依赖定义此变量： prod中开头引入webpack  + merge()中末尾加入 new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})    console.log('looks like we are in development mode')
    //要注意，任何位于 /src 的本地代码都可以关联到 process.env.NODE_ENV 环境变量, so在index.js加入检查： if(process.env.NODE_ENV != 'production'){cosole.log('')};
    
    //加载用 ExtractTextPlugin 将 CSS 分离成单独的文件， disable选项结合--env标记 允许开发中进行内联加载 用于热模块替换和构建速度
    //CLI替代   --optimize-minimize 标记将在后台引用 UglifyJSPlugin。和以上描述的 DefinePlugin 实例相同，--define process.env.NODE_ENV="'production'" 也会做同样的事情。并且，webpack -p 将自动地调用上述这些标记，从而调用需要引入的插件。


    
//代码分离   把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级； 有三种方法： 入口entry手动分离/用commonschunkplugin去重和分离/用模块内联函数分离代码
    //1. 入口起点  要手动配置很多 如分离一个模块，要先有两个js文件，在webpack配置文件上用[name].bundle.js的方式产出  如有重复 会带到各个bundle， 不灵活 不能拆分核心逻辑
    //2CommonsChunlPlugin可以将公共的依赖模块提取到已有的入口chunk / 或者提取到一个新的chunk， 
        //webpack配置文件头 引入webpack自己， plugin里 加入new webpack.optimize.CommonsChunkPlugin({name: 'common'})  name是指定公共bundle的名称
    //3.动态导入： 用import（）语法+require.ensure   (使用第一种内部要使用promiss 记得要用一个polyfill库支持老浏览器)
        // 在webpack中只用在output中加入chunkFilename: '[name].bundle.js',  在src/xx.js中用动态导入来分离chunk,  return （import的模块.then), 如promiss中加入dom进行修改并返回； 用这个函数.then(组件 => 某dom.操作(组件))  
        //通过async函数简化代码：在函数名前加async的函数中，dom和模块都分别用var const的变量保存，然后返回修改后的dom;  然后一样用这个函数.then(组件 => 某dom.操作(组件))  
    //bundle分析 检查模块  可以使用官方的analyze  或者社区其他工具 如（webpack-） chart cisualizer bundle-analyzer  


//懒加载   先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载
    //增加一个交互，当用户点击按钮 等到第一次交互的时候再加载那个代码块（用事件加载print.js）。为此，把lodash放到主代码块中， 
    //当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，（var print = module.default; print();）因为它才是promise被处理后返回的实际的module对象。

//缓存  通过命中缓存，以降低网络流量，使网站加载速度更快，然而，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本  ；怎么确保 webpack 编译生成的文件能够被客户端缓存，而在文件内容变化后，能够请求到新的文件？
    //输出文件的名字： 用 output.filename 进行文件名替换， 如[hash]， 更好的是[chunkhash]即包含与chunk相关的hash
        //如配置文件中， plugins里 new HtmlWebpackPlugin({title: 'Cache'}) + output里filename：[name].[chunkhash].js

    //提取模板  除了将模块分离到单独的文件中，CommonsChunkPlugin 有一个较少有人知道的功能是，能够在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中：
        //webpack配置文件中引入webpack， 并在plugins中加入 new webpack.optimize.CommonsChunkPlugin({name: 'manifest'})
        
        //将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法, 因为它们少改动
        //可以通过使用新的entry入口（main:'./src/index.js', vendor: ['lodash']） 和 额外配置一个CommonsChunkPlugin的实例(plugins列表中 new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),) 来实现  

//处理模板文件   把模板文件当作一个字符串 / 当作已经编译好的模板处理函数：
    //官网list-of-loaders部分的templating页有详细介绍各种loader  比如html / dom / rlot








