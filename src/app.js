const http = require('http');//http服务
const chalk = require('chalk');//设置命令行字体样式(node启动有效，supervisor启动无效)
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConfig');//参数配置文件

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root,req.url)// path.join拼接路径片段  req.url请求路径
    
    //1.根据路径判断是文件还是文件目录(stat获取文件信息)
    fs.stat(filePath,(err,stats) => {
    	if(err){
    		res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');// 响应头中设置文本类型
            res.end(`${filePath} is not a file or directory`);
            return;
    	}

    	if(stats.isFile()){
    		res.statusCode = 200;
    		res.setHeader('Content-Type', 'text/plain');
    		fs.createReadStream(filePath).pipe(res);// stream数据流读取数据，不用readFile
    	}else if(stats.isDirectory()){
    		fs.readdir(filePath,(err,files) => {//读取文件目录
    			res.statusCode = 200;
    		    res.setHeader('Content-Type', 'text/plain');
    		    res.end(files.join(','));

    		})
    	}
    });

    
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}/`;
    console.info(`Server running at ${chalk.green(addr)}`);
});