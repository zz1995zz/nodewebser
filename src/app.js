const http = require('http');//http服务
const chalk = require('chalk');//设置命令行字体样式(node启动有效，supervisor启动无效)
const path = require('path');
const route = require('./helper/route');
const conf = require('./config/defaultConfig');//参数配置文件
const openUrl = require('./helper/openUrl');

class Server {
	constructor(config) {
		this.conf = Object.assign({}, conf, config);
	}

	start() {
		const server = http.createServer((req, res) => {
    		const filePath = path.join(this.conf.root,req.url)// path.join拼接路径片段  req.url请求路径
    		//1.根据路径判断是文件还是文件目录(stat获取文件信息)
    		route(req,res,filePath,this.conf);
		});
		server.listen(this.conf.port, this.conf.hostname, () => {
			const addr = `http://${this.conf.hostname}:${this.conf.port}/`;
   			console.info(`Server running at ${chalk.green(addr)}`);
   			openUrl(addr);//自动打开页面
		});
	}
}

module.exports = Server;