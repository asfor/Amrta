/*!
 * amrta
 * Copyright (c) 2016 Shi Yutao. All rights reserved.
 * MIT Licensed
 */

// Module dependencies.

var config = require('../config.js');
var route = require('./' + config.route + '_route');
var view = require('./view');
var staticFile = require('./staticFile');

module.exports = init;

function init(app) {
	app.use = route.use;

	if(config.route === 'RESTful') {
		['get', 'post', 'put', 'delete'].forEach(function(method) {
			app[method] = route[method];
		});

		config.staticType.forEach(function(type) {
			app.get('/*\.' + type, staticFile.handle);
		});
	}

	if(config.route === 'MVC')
		app.setCtrlPath = route.setCtrlPath;

	app.setViewPath = view.setPath;
	app.setStaticPath = staticFile.setPath;
	app.handle = route.handle;
};
