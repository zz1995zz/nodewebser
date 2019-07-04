const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;//promise异步
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const artTemplate = require('art-template');//模板引擎
// const conf = require('../config/defaultConfig');//参数配置文件
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

// 编译模板  注意：服务端只支持标准语法！！！
const tplPath = path.join(__dirname,'../template/dir.tpl');//模板路径
const source = fs.readFileSync(tplPath);//用同步是因为只有模板读取完了才可能进行下面的操作
const render = artTemplate.compile(source.toString());//编译模板返回一个渲染函数

// 路由判断
module.exports= async function(req,res,filePath,conf){//变成cli工具后，用户自己配置参数，所以不能用固定的conf
	try{
		const stats = await stat(filePath);
        if(stats.isFile()){
        	const mimeType = mime(filePath);
        	res.setHeader('Content-Type', mimeType);

            //4.使用缓存
            if(isFresh(stats,req,res)){
                res.statusCode = 304;
                res.end();
                return;
            }

            // 3.范围请求
            let rs;
            const {code,start,end} = range(stats.size,req,res);
            if(code==200){
                 res.statusCode = 200;
                 rs = fs.createReadStream(filePath);// stream数据流读取数据，不用readFile
            }else {
                res.statusCode = 206;
                 rs = fs.createReadStream(filePath,{start,end});
            }
           
    		
    	    //2.压缩文件
            if(filePath.match(conf.compress)){
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        }else if(stats.isDirectory()){
    		const files = await readdir(filePath);
    		res.statusCode = 200;
    		res.setHeader('Content-Type', 'text/html');
    		const dir = path.relative(conf.root,filePath);//文件相对启动文件的相对路径
    		const data = {
    			title:path.basename(filePath),
    			dir:dir ? `/${dir}` : '',
    			files: files.map((file) => {
    				return {
    					file,
    					icon:mime(file)
    				}
    			})
    		};
    		res.end(render(data));//渲染模板
    	}
    }catch(ex){
		res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');// 响应头中设置文本类型
        res.end(`${filePath} is not a file or directory \n ${ex.toString()}`);
	}
}