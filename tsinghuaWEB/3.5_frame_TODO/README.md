工程目录： 
   TODO
	|
	|-node_modules    放要用的第三方库
	|-public    编译后访问的静态资源  如这里的index.js  就是入口js文件
		|-index.js
	|-static    代码编写中的静态资源 -开发中前端的目录 
		|-app    业务代码 
			|-...
		|-framework    框架代码
			|-index.js    解析模板	
			|-Observer.js    用于对数据改变进行劫持
	|-views    后端的模板文件 
		|-index.ejs     用于渲染页面
		|-...
	|-.babelrc    babel的配置文件
	|-.gitgnone  项目里面哪些文件夹/文件是不希望提交到git仓库的
	|-app.js	用node开始服务器开启时执行的入口文件
	|-packfe.json	npm初始化项目时，包含开发/调试/运行时依赖的第三方库 ， 以及运行时要调用的scr脚本有哪些 	
	|-README.md




其中package.json里script中的build把编译前的资源编译成编译后资源, 
"build": "babel static -d output && browserify output/app/index,js > public/index.js && rm -rf output"

做了三件事：
babel static -d output   用babel把开发中的静态资源备份到文件夹output  （好转化成本地js能执行的脚本）

browserify output/app/index,js > public/index.js        模块管理工具browserify把零散文件通过output/app/index,js这个入口
														以及模块与库相互引用的关系去打包成一个单独的文件 public/index.js
														包含所有业务代码和库的代码  还可以进一步压缩和混淆

rm -rf output	之前的临时文件夹output删除掉



