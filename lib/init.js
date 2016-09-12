/*!
 * amrta
 * Copyright (c) 2016 Shi Yutao. All rights reserved.
 * MIT Licensed
 */

// Module dependencies.

var http = require('http');
var config = require('../config.js');
var route = require('./' + config.route + '_route');
var view = require('./view');
var staticFile = require('./staticFile');

module.exports = init;

/**
 * 初始化应用
 * 
 * @param {Function} app 应用实例
 * @public
 */
function init(app) {
	app.use = route.use;

	if(config.route === 'RESTful') {
		config.methods.forEach(function(method) {
			app[method] = route[method];
		});

		Object.getOwnPropertyNames(config.staticType).forEach(function(type) {
			app.get('/*\.' + type, staticFile.handle);
		});
	}

	if(config.route === 'MVC')
		app.setCtrlPath = route.setCtrlPath;

	app.listen = function(port, callback) {
		return http.createServer(app).listen(port, callback);
	};
	app.setViewPath = view.setPath;
	app.setStaticPath = staticFile.setPath;
	app.handle = route.handle;
};
