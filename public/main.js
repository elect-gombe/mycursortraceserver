'use strict';
enchant();

var userid;

var clickcount = 0;
var mypreviouscount;
window.onload = function(){
    var game = new Core(320, 320);
    var socket = io();
    var status = new Label("wait for connection");
    var obake = new Sprite(32, 32);
    var background = new Sprite(game.width,game.height);
    var background_upper = new Sprite(game.width,game.height);
    var surface = new Surface(game.width,game.height);
    
    socket.on('userinfo', function(dat){
	console.log(dat);
	userid = dat.user;
	status.text = "wait for another player.";
    });
    socket.on('inform-timing', function(){
	mypreviouscount = clickcount;
	socket.emit('inform-count',{
	    count:clickcount
	});
    });
    socket.on('are-you-ready',function(data){
	console.log(data);
	if(data > 3*5){
	    status.text = "are you ready?";
	}else{
	    status.text = ""+(data/5+1)>>0;
	}
	clickcount = 0;
	if(obake.destiX != 100){
	    obake.y = 0;
	    obake.x = 100;
	    obake.destiX = 100;
	}
    });
    socket.on('count',function(dat){
	if(obake.destiX < 0){
	    status.text = "you lose";
	}else if(obake.destiX > 200){
	    status.text = "you win";
	}else{
	    status.text = "start! click more!";
	    console.log(dat);
	    obake.destiX = 100-(dat.data - mypreviouscount)*5;
	}
    });
    socket.on('AFK',function(){
	status.text = "opponent:AFK";
    });
    
    game.fps = 30;
    game.preload("chara.png");
    game.preload("ocean.jpg");
    game.onload = function(){
	socket.emit('userready');
        obake.image = game.assets["chara.png"];
        background.image = game.assets["ocean.jpg"];
	
	surface.context.lineWidth = 5;
	surface.context.strokeStyle = "#FFFF22";
        surface.context.beginPath();
	surface.context.moveTo(116,180);
        surface.context.lineTo(116,250);
        surface.context.closePath();
        surface.context.stroke();

	surface.context.strokeStyle = "#FF2222";
        surface.context.beginPath();
	surface.context.moveTo(16,180);

        surface.context.lineTo(16,250);
        surface.context.closePath();
        surface.context.stroke();

	surface.context.strokeStyle = "#FFFFFF";
        surface.context.beginPath();
	surface.context.moveTo(216,180);

        surface.context.lineTo(216,250);
        surface.context.closePath();
        surface.context.stroke();

	background_upper.image=surface;

        obake.x = 100;
        obake.y = 0;
	obake.destiX = 100;
	obake.destiY = 200;
        obake.frame = 5;
	obake.phase = 0;
	status.font = "24px 'Consolas', 'Monaco', 'ＭＳ ゴシック'"
	status.color = "white";
	game.rootScene.addChild(background);
	game.rootScene.addChild(background_upper);
        game.rootScene.addChild(obake);
	game.rootScene.addChild(status);

	obake.addEventListener("enterframe", function(){
	    var dir = Math.atan2(this.destiX-obake.x,this.destiY-obake.y)/(Math.PI/2)+2+0.5;
	    //	    console.log(obake.x+" "+obake.y+" "+obake.destiX+" "+obake.destiY);
	    this.x += ((this.destiX-this.x)*0.1);
	    this.y += ((this.destiY-this.y)*0.1);
	    this.phase = (dir>>0)%4;
	    switch(this.phase){
	    case 0:
		this.phase = 3;
		break;
	    case 1:
		this.phase = 1;
		break;
	    case 2:
		this.phase = 0;
		break;
	    case 3:
		this.phase = 2;
		break;
	    }
	    //console.log(this.phase);
	    this.frame = this.age / 3 % 3 + this.phase*3;
        });
    };
    this.addEventListener("touchstart", function(e){
	clickcount++;
	console.log("clicked"+clickcount);
    });
    this.addEventListener("click", function(e){
	clickcount++;
	console.log("clicked"+clickcount);
    });
    // 		    //console.log("x:"+e.x+"\ny:"+e.y);
    // 	obake.destiX = e.x/game.scale;
    // 	obake.destiY = e.y/game.scale;
    // });
    game.start();
};
