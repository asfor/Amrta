var config = {
	route: 'RESTful',				// 路由模式: 有 "MVC" 和 "RESTful" 两种
	defaultController: 'index',		// MVC模式下的默认控制器
	defaultAction: 'default',		// MVC模式下的默认方法
	max_MB: 1,						// 上传文件限制大小, 单位MB
	sessionExpires: 10,				// session过期时间, 单位分钟
	staticType: ['js',				// 支持的静态文件类型
				 'css',
				 'jpg',
				 'jpeg',
				 'png',
				 'bmp',
				 'gif',
				 'ico']
};

module.exports = config;