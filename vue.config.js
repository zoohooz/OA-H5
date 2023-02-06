		//vue.config.js
const TransformPages = require('uni-read-pages')
const {
	webpack
} = new TransformPages()

const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}
 
module.exports = {
	devServer : {
	    https : false,
	    port : 8080,
	    proxy : {
	        "/api" : {
	            target: "http://139.159.156.116:8080", //目标接口域名
	            changeOrigin : true, //是否跨域
	            secure : false, // 设置支持https协议的代理
	            pathRewrite : {
	                "^/api" : ""
	            }
	        }
	    }
		},
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true)
			}),
		]
	},
}
