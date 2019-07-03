module.exports = (totalSize,req,res) => {
	const range = req.headers['range'];
	if(!range){
		return {
			code : 200
		}
	}

	const size = range.match(/bytes=(\d*)-(\d*)/);
	const end = size[2] ? parseInt(size[2]) : totalSize - 1;
	const start = size[1] ? parseInt(size[1]) : totalSize - end;

    //当客户端请求错误的时候，都返回200，响应全部返回
	if(start > end || end > totalSize || start < 0 ){
		return {
			code : 200
		}
	}


	// 范围请求
	res.setHeader('Aceept-Range','bytes');
	res.setHeader('Content-Range',`bytes ${start}-${end}/${totalSize}`);
	res.setHeader('Content-Lenght',end-start);
	
	return {
		code : 206,//返回部分内容
		start,
		end
	}
}