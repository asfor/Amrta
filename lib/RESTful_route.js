/*!
 * amrta
 * Copyright (c) 2016 Shi Yutao. All rights reserved.
 * MIT Licensed
 */

// Module dependencies.

var config = require('../config');
var url = require('url');

// Module variable.

var routes = {all: []};	// 路由对象
var globalMid = 0;		// 全局中间件数量

/**
 * 注册全局路由
 * 
 * @param {String} path 需要匹配的路径
 * @public
 */

exports.use = function(path) {
	if(typeof path !== 'string') {
		// 注册全局中间件
		globalMid += arguments.length;
		Array.prototype.unshift.call(arguments, path);
		path = '/*';
	}

	var route = pathRegexp(path);
	routes.all.push({
		path: route.regexp,
		keys: route.keys,
		actions: Array.prototype.slice.call(arguments, 1)
	});
};

// 分别为 config.methods 设置的各个请求方法添加路由对象和注册路由的方法

config.methods.forEach(function(method) {
	routes[method] = [];
	(function(method) {
		exports[method] = function(path) {
			var route = pathRegexp(path);
			routes[method].push({
				path: route.regexp,
				keys: route.keys,
				actions: Array.prototype.slice.call(arguments, 1)
			});
		};
	})(method);
});

/**
 * 路由分发
 * 
 * @param {Object} req
 * @param {Object} res
 * @public
 */

exports.handle = function(req, res) {
	var path = url.parse(req.url).pathname;
	var method = req.method.toLowerCase();
	var actions = match(path, method);

	// 处理逻辑
	if(actions.length === globalMid) {
		res.writeHead(404, 'Not Found');
		res.end();
	} else {
		excute(actions);
	}

	/**
	 * 路由匹配
	 * 
	 * @param {String} path 需要匹配的路径
	 * @param {String} method 请求方式
	 * @return {Array} 需要执行的中间件数组
	 * @private
	 */

	function match(path, method) {
		var actions = [];

		['all', method].forEach(function(method) {
			// 在全局路由对象和请求方式对应的路由对象上寻找需要执行的中间件
			routes[method].forEach(function(route) {
				var result = route.path.exec(path);
				if(result) {
					var params = {};

					for(var i = 0; i < route.keys.length; i++)
						params[route.keys[i]] = result[i + 1];

					req.params = params;
					actions = actions.concat(route.actions);
				}
			});
		});

		return actions;
	}

	/**
	 * 启动执行中间件数组
	 * 
	 * @param {Array} actions 要执行的中间件数组
	 * @private
	 */
	function execute(actions) {
		(function() {
			if(actions.length)
				(actions.shift())(req, res, arguments.callee);
		})();
	}
};

/**
 * 注册路由解析
 * 
 * @param {String} path 需要匹配的路径
 * @return {Object} 一个路由对象, regexp属性为路径匹配的正则表达式, keys属性为该路径所挂载的参数键名数组
 * @private
 */

function pathRegexp(path) {
	var keys = [];

	path = path
		.replace(/\/\(/g, '(?:/')
		.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
			keys.push(key);
			slash = slash || '';
			return ''
				+ (optional ? '' : slash)
				+ '(?:'
				+ (optional ? slash : '')
				+ (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
				+ (optional || '')
				+ (star ? '(/*)?' : '');
		})
		.replace(/([\/.])/g, '\\$1')
		.replace(/\*/g, '(.*)');

	return {
		keys: keys,
		regexp: new RegExp('^' + path + '$')
	};
}