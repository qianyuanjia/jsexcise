var http=require('http');
var fs=require('fs');
var docRoot='C:/Users/qyj/Desktop/jsexcise/websocket';
var httpServer=http.createServer(function(req,res){
	fs.readFile(docRoot+req.url,function(err,data){
		if(err){
			res.writeHeader(404,{
				'content-type':'text/html;charset=utf-8'
			});
			res.end('你请求的页面不存在！');
		}else{
			res.writeHeader(200,{
				'content-type':'text/html;charset=utf-8'
			});
			res.end(data);
		}
		console.log('有人访问了nodejs服务器');
	});
}).listen(8080);
console.log('http服务器已经运行在8080端口');

var io=require('socket.io')(httpServer);
io.on('connection',function(socket){
	console.log('有人连接了socket');
	socket.emit('welcome','欢迎您访问！');
	socket.on('intro',function(data){
		socket.broadcast.emit('otherintro',data);
	});
	
});

