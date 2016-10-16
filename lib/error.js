/*!
 * amrta
 * Copyright (c) 2016 Shi Yutao. All rights reserved.
 * MIT Licensed
 */

// Module variable.

var dispatcher = {404: (req, res) => {	// 错误调度对象
	res.writeHead(404, 'Not Found');
	res.end('Not Found');
}};

module.exports = exports = error;

/**
 * 为res对象挂载error方法
 * 
 * @param {Object} req
 * @param {Object} res
 * @public
 */

function error(req, res) {
	res.error = handle.bind({req: req, res: res});
}

/**
 * 错误注册函数
 * 
 * 对同一个错误进行注册会覆盖掉前面注册的内容
 * 
 * @param {Number} status 错误状态码
 * @param {Function} callback 错误回调函数
 * @public
 */

exports.regist = (status, callback) => {
	dispatcher[status] = callback;
};

/**
 * 错误流程处理
 * 
 * @param {Number} status 错误状态码
 * @private
 */

function handle(status) {
	var statusHandle = dispatcher[status] || unregisteredHandle;
	statusHandle(this.req, this.res);
};

/**
 * 未注册错误处理
 * 
 * @param {Object} req
 * @param {Object} res
 * @public
 */

function unregisteredHandle(req, res) {
	res.writeHead(500, 'Internal Server Error');
	res.end('Internal Server Error');
	throw new ReferenceError('The error status is not registered.');
}
