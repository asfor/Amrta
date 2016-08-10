/*!
 * amrta
 * Copyright (c) 2016 Shi Yutao. All rights reserved.
 * MIT Licensed
 */

'use strict';

var config = require('../config.js');
var route = require('./' + config.route + '_route');
var view = require('./view');

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * 创建一个Amrta应用
 * 
 * @return {Function}
 * @api public
 */

function createApplication() {
	var app = function(req, res) {
		view(res);
		app.handle(req, res);
	};

	app.use = route.use;

	if(config.route === 'RESTful') {
		['get', 'post', 'put', 'delete'].forEach(function(method) {
			app[method] = route[method];
		});
	}

	if(config.route === 'MVC')
		app.setCtrlPath = route.setCtrlPath;

	app.setViewPath = view.setPath;
	app.handle = route.handle;
	return app;
}

// 附加功能挂载
exports.route = route;
exports.body = require('./body');
exports.fileRes = require('./fileRes');
exports.cookie = require('./cookie');
exports.session = require('./session');
exports.WebSocket = require('./webSocket');