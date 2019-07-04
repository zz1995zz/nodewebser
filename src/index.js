const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
	.usage('anyWhere [options]')//用法格式
	.option('p',{
		alias : 'port',//别名
		describe : '端口号',//描述
		default : 3000//默认值
	})
	.option('h',{
		alias : 'hostname',
		describe : 'host',
		default : '127.0.0.1'
	})
	.option('d',{
		alias : 'root',
		describe : 'root path',
		default : process.cwd()
	})
	.version()
	.alias('v','version')
	.help()
	.argv;
	
// 使用用户配置的参数启动http服务
const server = new Server(argv);
server.start();