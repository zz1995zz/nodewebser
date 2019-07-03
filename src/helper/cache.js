const {cache} = require('../config/defaultConfig');

function refreshRes(stats,res){
	const {maxAge,expires,cacheControl,lastModified,etag} = cache;
	//判断本地是否失效expires,cacheControl
	//绝对时间
	if(expires){
		res.setHeader('Expires',new Date(Date.now()+maxAge*1000).toUTCString());
	}
	// 相对时间
	if(cacheControl){
		res.setHeader('Cache-Control',`public,max-age=${maxAge}`);
	}

	// 服务器检验lastModified,etag
	//时间校验
	if(lastModified){
		res.setHeader('Last-Modified',stats.mtime.toUTCString());
	}
	// 用哈希等标识检验
	if(etag){//生成etag的方法有很多
		res.setHeader('Etag',`${stats.size}-${stats.mtime}`);
	}
}

module.exports = function isFresh(stats,req,res){
	refreshRes(stats,res);

	const lastModified = req.headers['if-modified-since'];
	const etag = req.headers['if-none-match'];
    
    //需要发送请求
	if(!lastModified && !etag){
		return false;
	}
	if(lastModified && lastModified !== res.getHeader('Last-Modified')){
		return false;
	}
	if(etag && etag !== res.getHeader('Etag')){
		return false;
	}

	// 使用缓存
	return true;

}