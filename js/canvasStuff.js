// shim layer with setTimeout fallback
 window.requestAnimFrame = (function(){
   return  window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
           };
 })();


jQuery(function ($) {

	function Point(x,y){
		this.x = x;
		this.y = y;
	}

	function Curve(points, width, color, step){
		this.points = points;
		this.strokeStyle = color==undefined?'#000':color;
		this.lineWidth = width==undefined?1:width;
		this.t = 0;
		this.step = step==undefined?.01:step;
		this.done = false;
	}
	Curve.prototype.update = function(ctx){
		if (this.t > 1) {this.done=true;return;}
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		var ax = ( - this.points[0].x + 3 * this.points[1].x - 3 * this.points[2].x + this.points[3].x) / 6;
		var ay = ( - this.points[0].y + 3 * this.points[1].y - 3 * this.points[2].y + this.points[3].y) / 6;
		var bx = (this.points[0].x - 2 * this.points[1].x + this.points[2].x) / 2;
		var by = (this.points[0].y - 2 * this.points[1].y + this.points[2].y) / 2;
		var cx = ( - this.points[0].x + this.points[2].x) / 2;
		var cy = ( - this.points[0].y + this.points[2].y) / 2;
		var dx = (this.points[0].x + 4 * this.points[1].x + this.points[2].x) / 6;
		var dy = (this.points[0].y + 4 * this.points[1].y + this.points[2].y) / 6;
		ctx.moveTo(
		ax * Math.pow(this.t, 3) + bx * Math.pow(this.t, 2) + cx * this.t + dx,
		ay * Math.pow(this.t, 3) + by * Math.pow(this.t, 2) + cy * this.t + dy
		);
		ctx.lineTo(
		ax * Math.pow(this.t + this.step, 3) + bx * Math.pow(this.t + this.step, 2) + cx * (this.t + this.step) + dx,
		ay * Math.pow(this.t + this.step, 3) + by * Math.pow(this.t + this.step, 2) + cy * (this.t + this.step) + dy
		);
		ctx.stroke();
		ctx.restore();
		this.t += this.step;
	}
	
		
	if ( !Modernizr.canvas ){
		fatalError('error-msg-compatable');
		return;
	}else{
		
		canvas = document.createElement("canvas");
		canvas.id = "draw-canvas";
		canvas.width = window.innerWidth;
		canvas.height = window.innerWidth;
		ctx = canvas.getContext('2d');
		$('#container').append(canvas).css({'position':'absolute','top':'0','left':'0'});
		console.log(ctx);
		
		
		lines = Array();
		
		circles = Array();
		circles2 = Array();
		
		circles.push(new Point(100,100));
		circles.push(new Point(0,100));
		circles.push(new Point(500,50));
		circles.push(new Point(800,300));
		
		
		circles2.push(circles[1]);
		circles2.push(circles[2]);
		circles2.push(circles[3]);
		circles2.push(new Point(100,600));
		
		
		undraw();
		lines.push(new Curve(circles, 4, '#f00', .03));
		lines.push(new Curve(circles2, 4, '#00f', .03));
		
		update();
		
	}
	
	
	
	
	function update(){
		if ( lines[0] !== undefined ){
			lines[0].update(ctx);
			if ( lines[0].done ) lines.shift();
			requestAnimFrame(update);
		}
	}
	
	function undraw(){
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#fff';
		ctx.moveTo(0,0);
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fill();
	}
	



	// Error functions
	function fatalError(id){
		$obj = $('#'+id);
		console.log($obj);
		text = $obj!==undefined?$obj.html():'<div id="error">An unexpected error has occured</div>';
		$("body").empty().addClass('error').append(text);
	}


});
