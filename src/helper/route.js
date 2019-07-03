const fs = require('fs');
const promisify = require('util').promisify;//promise异步
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// 路由判断
module.exports= async function(req,res,filePath){
	try{
		const stats = await stat(filePath);
        if(stats.isFile()){
        	res.statusCode = 200;
        	res.setHeader('Content-Type', 'text/plain');
    		fs.createReadStream(filePath).pipe(res);// stream数据流读取数据，不用readFile
    	}else if(stats.isDirectory()){
    		const files = await readdir(filePath);
    		res.statusCode = 200;
    		res.setHeader('Content-Type', 'text/plain');
    		res.end(files.join(','));
    	}
    }catch(ex){
		res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');// 响应头中设置文本类型
        res.end(`${filePath} is not a file or directory`);
	}
}