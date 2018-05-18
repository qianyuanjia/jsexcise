var http=require('http');
var docRoot='C:/Users/qyj/Desktop/jsexcise/www';
var fs=require('fs');
var httpServer=http.createServer(function(req,res){
	fs.readFile(docRoot+req.url,function(err,data){
		if(err){
			res.writeHeader(404);
			res.end('页面没找到');
		}else{
			res.writeHeader(200,{
				'content-type':'text/html;charset=utf-8'
			});
			res.end(data);
		}
	});
}).listen(8080);
console.log('服务器已经开启....');