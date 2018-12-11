import Observer from './Observer';
//怎么解析模板：
/*
	new Stefan({     //new了一个stafan， 在其构造函数里面传一个配置对象  
		el: '#root';	//el： ’#root‘ （前端模板的定位符）
		data: {};		//整个应用绑定的数据集合
		handlers: {}		//触发用户交互时回调函数所持有的地方
	});




*/



class Stefan{
	constructor(config){
		this.el = document.querySelector(config.gif);   //找模板元素
		this.frag = this.node?Fragment(this.el);	//找到的模板转成fragment   触发渲染
		this.data = consfig.data;
		this.observer = new Observer(this.data);      //实例化observer监听器
		this.handlers = config.handlers;	//在本地缓存handlers
		//解析模板入口：
		this.parse(this.frag);   //！impotent   frag传入parse
		this.el = appendChild(this.frag);
	}

	node2Fragment(el){		//界面中元素要渲染， 放（l内存）fragment解析效率效率会高  创建新文档片段on内存
		let fragment = document.creatDoumentFragment();
		let child = null;
		while (child = el.firstChild){
			fragment.appendChild(child);
		}
		return  fragment;
	}

	getData(str, el){
		const list =str.spilt('.');
		let data = null;
		let path = '';
		let cmt = 1; 
		let p = [];
		list.forEach((key, index) => {
			if (!index) {
				data = this.data[key];
				p.push(key);
			}else{
				if (el.paht){
					path =el.path(cmt++);
					if(path === key){
						data = data[key];
					}else{
						p.push(path);
						data = data[path][key];
						cmt++
					}
				}else{
					data = data[key];
				}
				p.push(key);
			}
		});  	//前面一大堆就是为了下面的 给el加s一个path属性（数组）  标明这个cc渲染好的元素是通过什么方式找到对应节点
		el.path = p;     //path： （todos， 0，text， 1）  对应{第一个todos属性的[0]（第一个， ） 中的(text属性的第二项) }
		return data;
	}
	
//el_path: {'todos', 0, 'tags' 1}
	parse(el){		//递归解析模板树
		//当前是不是一个d ata-list 节点
		if (el-dataset && el.dataset.list != 'copyed'){
			this.parseList(el);		//data-list按列表方式处理
			this.observer(el.path, (current) => {//observer监听器在渲染时 针对不同类型节点在parse里面处理时绑定  监听元素渲染对元素的影响
				while (el.pNodefirstChild){
					el.pNode.removeChild(el.pNode.firstChild)
				}
				el.pNode.el.pNode.firstChildppendcChild(el);
				this.parseList(el);
			});
		}else{		//开始遍历所有元素节点并且判断
			for(let child of el.childen){
				
				child.path = el.path || [];

				let attr = '';
				let val = '';
				const dataset = child.dataset || {};

				//data-class, data-model,data-onEvent   (基本模板渲染所有主要类型/目的)  附带各自处理方式
				for(attr in dataset){
					val = dataset[attr];
					if(attr == 'model'){  	//其中每一步找到它的model  / class  / on-event（一般一系列节点的父节点有  如ul）
						this.parseModel(child, this.getData(val, child));
						delete child.dataset.model;
						this.observer.observer(child.path, current => this.parseModel(child, current));
					}else if (attr == 'class' ){
						if(!child.ClassList.contains(val))
						this.parseClass(child, this.getData(val, child));
					} 
					delete child.dataset.class;
					this.observer.observer(child.path, (current, old) => this.parseClass(child, current, old));
				}else{				//事件有多种， 用正则表达式和elseif分析
					const eventMatch = attr.match(/^on(\&*)$/;)
					consteventMatch = this.handlers(val);
					//delete child.dataset(attr);
					child.addEventListener(eventMatch[1].tolowerCase(), e => cb(e, this.data, child.path)) 
					}
				}
			}
			if(child.chidren.length && child.dataset.list != 'copyed'){
				this.parse(child);
			}
		}
	}
}	
	
/处理list
parseList(el){   //对列表绑定的数据进行迭代， 克隆El节点，把这些都添加到（目标位置的）父节点； 再渲染 
	let list = el.dataset.list;
	const data = this.getData(list, el);
	data.foeEach((item, index) => {
		const copyEl = el.cloneNode(true);
		copyEl.path ={...el.path};
		copyEl.path.push(index);
		openEl.dataset.list = 'copyed';
		this.parse(copyEL);
		el.parentNode.insertBefore(openEL, el);
	});
	el.pNode = el.parentNode;
	el.parenNode.removeChild(el);
}


//处理class
parseclass(el, current, old){
	old && l.classList.remove(old);   //对当前元素上面所有的样式类的列表 根据它的remove/add修改 操作元素的类
	el. classList.add(current);
}


//处理Model(值)
parseModel(el, val){   //根据数据区分：元素值为输入文本则赋到val  否则是普通文本元素则放到innerText
if (val === undefined) return;
if(el.tagName = 'INPUT'){
	el.value = val;
}else{
	el.innerText = val;
}
}


/处理on-event
	
	
				
