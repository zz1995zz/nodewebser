const {createGzip,createDeflate} = require('zlib');

// 压缩文件
module.exports = (rs,req,res) => {
	const acceptEncodeing = req.headers['accept-encoding'];//Accept-Encoding从请求头获取浏览器支持的压缩方式
	if(!acceptEncodeing || !acceptEncodeing.match(/\b(gzip|deflate)\b/)){
		return rs;
	}else if(acceptEncodeing.match(/\bgzip\b/)){
		res.setHeader('Content-Encoding','gzip');//设置响应头Content-Encoding压缩方式
		return rs.pipe(createGzip());
	}else if(acceptEncodeing.match(/\bdeflate\b/)){
		res.setHeader('Content-Encoding','default');
		return rs.pipe(createDeflate());
	}
}


