<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{title}}</title>
	<style>
		a {
			display: block;
			font-size: 30px;
		}
	</style>
</head>
<body>
	<!-- 服务端只支持标准语法！！！ -->
	{{each files}}
    	<a href="{{dir+'/'+$value}}">{{$value}}</a>
    {{/each}}
</body>
</html>