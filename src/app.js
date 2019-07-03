const http = require('http');//http服务
const chalk = require('chalk');//设置命令行字体样式(node启动有效，supervisor启动无效)
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;//promise异步
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const route = require('./helper/route');
const conf = require('./config/defaultConfig');//参数配置文件

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root,req.url)// path.join拼接路径片段  req.url请求路径
    //1.根据路径判断是文件还是文件目录(stat获取文件信息)
    route(req,res,filePath);

    
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}/`;
    console.info(`Server running at ${chalk.green(addr)}`);
});