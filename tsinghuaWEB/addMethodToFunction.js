Function.prototype.method = function(name, func){    //函数在js中是对象， 可以给Function。prototype添加方法使其方法对所有函数可用
	this.prototype[name] = func;
	return this;
}
