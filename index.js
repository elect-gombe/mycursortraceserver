const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var p = 0;
var i = 0;
var count = 5*5;
var timerid;
io.on('connection',
      function(socket){
	  socket.on('userready',
		    function(data){
			socket.userid = i++;
			if(i==2){
				timerid = setInterval(function(){
				    if(count > 0){
					count--;
					io.emit('are-you-ready',count);
				    }else{
					io.emit('inform-timing');
				    }
				}, 150);
			}
			else{
			    socket.emit('userinfo',
					{
					    data:data,user:socket.userid
					}
				       );
			    onuser = true;
			}
		    });
	  socket.on('inform-count',
		    function(data){
			console.log(data);console.log(socket.userid);
			socket.broadcast.emit('count',{
			    user:socket.userid,
			    data:data.count
			});
		    });
	  socket.on('disconnect',function(){
	      io.emit("AFK");
	      console.log("disconnected");
	      count = 5*7;
	      i--;
	      clearInterval(timerid);
	  });
      });
      
      
http.listen(port, '192.168.0.5', () => console.log('listening on port ' + port));
