const http = require('http');//http服务
const chalk = require('chalk');//设置命令行字体样式(node启动有效，supervisor启动无效)
const conf = require('./config/defaultConfig');//参数配置文件

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // 响应头中设置文本类型
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>')
  res.write('<body>')
  res.write('webserver')
  res.write('</body>')
  res.write('</html>')
  res.end('success');
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}/`;
    console.info(`Server running at ${chalk.green(addr)}`);
});