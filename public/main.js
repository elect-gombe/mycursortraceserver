'use strict';
enchant();

var bear = new Sprite(32, 32);
var otherSprite = new Array(3);

window.onload = function(){
    var game = new Core(320, 320);
    var socket = io();
    socket.on('drawing', function(dat){
	bear.destiX = dat.x;
	bear.destiY = dat.y;
    });
    
    game.fps = 30;
    game.preload("chara.png");
    game.onload = function(){
        bear.image = game.assets["chara.png"];
        bear.x = 0;
        bear.y = 0;
	bear.destiX = 0;
	bear.destiY = 0;
        bear.frame = 5;
	bear.phase = 0;
        game.rootScene.addChild(bear);

	bear.addEventListener("enterframe", function(){
	    var dir = Math.atan2(this.destiX-bear.x,this.destiY-bear.y)/(Math.PI/2)+2+0.5;
//	    console.log(bear.x+" "+bear.y+" "+bear.destiX+" "+bear.destiY);
	    this.x += ((this.destiX-this.x)*0.3);
	    this.y += ((this.destiY-this.y)*0.3);
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
	    setTimeout(()=> socket.emit('drawing', {
		x: this.destiX,
		y: this.destiY,
	    }),10);
        });
    };
    this.addEventListener("mousedown", function(e){
	//console.log("x:"+e.x+"\ny:"+e.y);
	bear.destiX = e.x/game.scale;
	bear.destiY = e.y/game.scale;
    });
    this.addEventListener("mousemove",function(e){
	bear.destiX = e.x/game.scale;
	bear.destiY = e.y/game.scale;
    });
    game.start();
};

// (function() {
//   canvas.addEventListener('mousedown', onMouseDown, false);
//   canvas.addEventListener('mouseup', onMouseUp, false);
//   canvas.addEventListener('mouseout', onMouseUp, false);
//   canvas.addEventListener('mousemove', throttle(onMouseMove, 1), false);

//   for (var i = 0; i < colors.length; i++){
//     colors[i].addEventListener('click', onColorUpdate, false);
//   }

//   function drawLine(x0, y0, x1, y1, color, emit){
//     context.beginPath();
//     context.moveTo(x0, y0);
//     context.lineTo(x1, y1);
//     context.strokeStyle = color;
//     context.lineWidth = 2;
//     context.stroke();
//     context.closePath();

//     if (!emit) { return; }
//     var w = canvas.width;
//     var h = canvas.height;

//     socket.emit('drawing', {
//       x0: x0 / w,
//       y0: y0 / h,
//       x1: x1 / w,
//       y1: y1 / h,
//       color: color
//     });
//   }

//   function onMouseDown(e){
//     drawing = true;
//     current.x = e.clientX;
//     current.y = e.clientY;
//   }

//   function onMouseUp(e){
//     if (!drawing) { return; }
//     drawing = false;
//     drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
//   }

//   function onMouseMove(e){
//     if (!drawing) { return; }
//     drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
//     current.x = e.clientX;
//     current.y = e.clientY;
//   }

//   function onColorUpdate(e){
//     current.color = e.target.className.split(' ')[1];
//   }

//   // limit the number of events per second
//   function throttle(callback, delay) {
//     var previousCall = new Date().getTime();
//     return function() {
//       var time = new Date().getTime();

//       if ((time - previousCall) >= delay) {
//         previousCall = time;
//         callback.apply(null, arguments);
//       }
//     };
//   }

//   function onDrawingEvent(data){
//     var w = canvas.width;
//     var h = canvas.height;
//     drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
//   }

//   // make the canvas fill its parent
//   function onResize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//   }

// })();
