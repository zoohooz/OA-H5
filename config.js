// 应用全局配置
if (process.env.NODE_ENV === 'development') {
	//开发环境
	ENV_CONFIG = require('.env.dev.js');
} else {
	//生产环境
	ENV_CONFIG = require('.env.prod.js');
}
//给环境变量process.uniEnv赋值
if (ENV_CONFIG) {
	process.uniEnv = {};
	for (let key in ENV_CONFIG) {
		process.uniEnv[key] = ENV_CONFIG[key];
	}
}
module.exports = {
  baseUrl: ENV_CONFIG?.baseUrl,//'http://139.159.156.116:9099',
  // 应用信息
  appInfo: {
    // 应用名称
    name: "app",
    // 应用版本
    version: "1.0.0",
    // 应用logo
    logo: "/static/ycsz.png",
    // 官方网站
    site_url: "http://ruoyi.vip",
    // 政策协议
    agreements: [{
        title: "隐私政策",
        url: "https://ruoyi.vip/protocol.html"
      },
      {
        title: "用户服务协议",
        url: "https://ruoyi.vip/protocol.html"
      }
    ]
  }
}
