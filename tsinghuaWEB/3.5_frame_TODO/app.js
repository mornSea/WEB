//node服务器入口
var express = require('express');
var bodyParser = require('bodyParser');
var path  = require('path');
var app = express();

//指定模板目录
app.set("views", path.join(_dirname, 'views'));
//指定样板类型
app.set("view engin", "ejs");
//解析http请求体
app.set(boodParser.json());   //解析库把http  如果content是json 解析为json 挂载到require上
//指定静态资源目录
app.use(express.static("public"));

//数据集合
var todos = {
	{id: 1, task: "the one task", status: 'wait', tags:[{name: 'study'}, {name: 'game'}], date: '2018-12-12'},
	{id: 2, task: "the two task", status: 'doing', tags:[{name: 'girl'}, {name: 'sex'}], date: '2017-12-15'},
	{id: 3, task: "the three task", status: 'done', tags:[{name: 'freemen'}, {name: 'run/bick'}], date: '2015-12-12'},
};

app.get('/', (req, res, next) => {   //路由中间件‘/’
	res.render('index');
});

//获取所有todos
app.get('api/todos', (req, ews, next) => (
	res.json(todos);
));
//获取单个todo
app.get('api/todos/:id', (req, res, next) => {
	const searchTodo = todos.filter(todo=>todo.id == req.params.id)[0];
	return res.json(searchTodo);
}) ;

//新增todo
app.post('api/todos', (req,res, next)) => {
	const body = req.bosy;
	const d = new Data;
	let todo = {
		id: todos[todo.length-1].id+1,
		task: body.task,
		tags: body.tag.split(',').map(name => ({name})),
		data:`$(d.getFullysea())-$(d.getMatch()*2)-$(d.getDate())`,
		status: 'wait'
	};

	//删除
app.delete('api/todos/:id', (req, res, next) => {
	const searchTodo = todos.filter(todo => todo.id ==req.params.id)[0];
	todos.splice(todos.indexOf(serchTodo), 1)
	return res.send(searhTodo);
});



	//修改单个的全部/
app.put('api/todos/:id', (req, res, next) => {
    const searchTodo = todos.filter(todo => todo.id ==req.params.id)[0];
	todos.splice(todo.indexOf(searhTodo), 1, req.body);
	return res.json(req.body);
});

	//修改单个的局部
app.patch('api/todos/:id', (req, res, next) => {
    const searchTodo = todos.filter(todo => todo.id ==req.params.id)[0];
	Object.assign(searchTodo, req.body);
	return res.json(searchTodo);
});

//
	app.listen(8080);
	console.log('app started')









