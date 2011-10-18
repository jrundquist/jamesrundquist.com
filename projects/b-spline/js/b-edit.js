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

function deepCopy(obj) {
  if (typeof obj == 'object') {
    if (obj instanceof Array) {
      var l = obj.length;
      var r = new Array(l);
      for (var i = 0; i < l; i++) {
        r[i] = deepCopy(obj[i]);
      }
      return r;
    } else {
      var r = {};
      r.prototype = obj.prototype;
      for (var k in obj) {
        r[k] = deepCopy(obj[k]);
      }
      return r;
    }
  }
  return obj;
}

// 
// jQuery(function ($) {
// 	

	stepSize = $("#step").val() / 100;
	lines = Array();
	drawlines = Array();
	
	function Point(x,y){
		this.x = x;
		this.y = y;
		this.color = '#0ff';
	}
	
	Point.prototype.draw = function(ctx){
		ctx.save();
		
		ctx.strokeStyle = '#000';
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}
		

	function Curve(points, width, color, step, instantDraw){
		this.points = points;
		this.endPt = 3;
		this.strokeStyle = color==undefined?'#000':color;
		this.lineWidth = width==undefined?1:width;
		this.t = 0;
		this.step = step==undefined?.01:step;
		this.instant = instantDraw!=undefined?instantDraw:false;
		this.done = false;
	}
	Curve.prototype.set = function(){
		this.done = false;
		this.endPt = 3;
		this.t = 0;
	}
	
	Curve.prototype.update = function(ctx){
		if (this.t > 1) {
			if( this.endPt == this.points.length-1 ){
				this.done=true;return;
			}else{
				this.endPt++;
				this.t = 0;
			}
		}
		i = this.endPt;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		var ax = ( - this.points[i-3].x + 3 * this.points[i-2].x - 3 * this.points[i-1].x + this.points[i].x) / 6;
		var ay = ( - this.points[i-3].y + 3 * this.points[i-2].y - 3 * this.points[i-1].y + this.points[i].y) / 6;
		var bx = (this.points[i-3].x - 2 * this.points[i-2].x + this.points[i-1].x) / 2;
		var by = (this.points[i-3].y - 2 * this.points[i-2].y + this.points[i-1].y) / 2;
		var cx = ( - this.points[i-3].x + this.points[i-1].x) / 2;
		var cy = ( - this.points[i-3].y + this.points[i-1].y) / 2;
		var dx = (this.points[i-3].x + 4 * this.points[i-2].x + this.points[i-1].x) / 6;
		var dy = (this.points[i-3].y + 4 * this.points[i-2].y + this.points[i-1].y) / 6;
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
		if ( this.instant ){this.update(ctx);}
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
		
		// Canvas functions 
		$(canvas).mousemove(function(event){
			$this = $(this);
			if ( $this.data('tracking')==true && $this.data('trackingPoint') != null){
				$this.data('trackingPoint').x = event.offsetX;
				$this.data('trackingPoint').y = event.offsetY;
				draw();
			}else{
				bestP = null;
				bestD = Infinity;
				for(l in lines){
					for(p in lines[l].points){
						d = Math.sqrt( Math.pow(event.offsetX - lines[l].points[p].x, 2) + Math.pow(event.offsetY - lines[l].points[p].y, 2) );
						if ( d <= 5 && d < bestD ){
							console.log(p, d, bestD);
							bestD = d;
							bestP = lines[l].points[p];
							bestL = lines[l];
						}
					}
				}
				if ( bestP != null ){
					$this.data('trackingLine',bestL);
					$this.data('trackingPoint',bestP);
					console.log($this.data('trackingPoint'));
				}
			}
		}).mousedown(function(event){
			$(this).data('tracking', true);
			
			for (l in lines){
				for (p in lines[l].points){
					lines[l].points[p].color = '#0aa';
				}
			}
			if ( $(this).data('trackingLine') ){
				for (p in $(this).data('trackingLine').points){
					$(this).data('trackingLine').points[p].color="#0ff";
				}
			}
		}).mouseup(function(event){
			$(this).data('tracking', false);
		});
		
				
		
		// J
		points0 = Array();
		points0.push(new Point(772, 397));
		points0.push(new Point(329, 415));
		points0.push(new Point(870, 121));
		points0.push(new Point(532, 425));
		points0.push(new Point(353, 542));
		points0.push(new Point(247, 626));

		lines.push(new Curve(points0, 4, '#fff', 0.09, false));
		
		// ames
		points1 = Array();
		points1.push(new Point(365, 309));
		points1.push(new Point(628, 431));
		points1.push(new Point(678, 393));
		points1.push(new Point(693, 422));
		points1.push(new Point(759, 416));
		points1.push(new Point(845, 387));

		lines.push(new Curve(points1, 4, '#fff', 0.09, false));
		
		// | of |2
		points2 = Array();
		points2.push(new Point(965, 117));
		points2.push(new Point(915, 268));
		points2.push(new Point(849, 374));
		points2.push(new Point(775, 447));
		points2.push(new Point(777, 445));

		lines.push(new Curve(points2, 4, '#fff', 0.23, false));
		
		// 2
		points3 = Array();
		points3.push(new Point(806, 205));
		points3.push(new Point(786, 282));
		points3.push(new Point(1120, 168));
		points3.push(new Point(1017, 333));
		points3.push(new Point(786, 402));
		points3.push(new Point(926, 462));
		points3.push(new Point(1309, 405));

		lines.push(new Curve(points3, 4, '#fff', 0.11, false));

		points4 = Array();
		points4.push(new Point(888, 417));
		points4.push(new Point(946, 415));
		points4.push(new Point(1015, 391));
		points4.push(new Point(980, 422));
		points4.push(new Point(1046, 389));
		points4.push(new Point(1033, 417));
		points4.push(new Point(1114, 398));
		points4.push(new Point(1067, 415));
		points4.push(new Point(1168, 412));
		points4.push(new Point(1399, 313));
		points4.push(new Point(988, 359));
		points4.push(new Point(1404, 392));
		points4.push(new Point(1444, 360));

		lines.push(new Curve(points4, 4, '#fff', 0.15, false));


		draw();
		
	}
	
	function draw(){
		drawlines = Array();
		drawlines = deepCopy(lines);
		undraw();
		
		for( l in lines ){
			for ( p in lines[l].points ){
				p = lines[l].points[p];
				if ( p instanceof Point ){
					p.draw(ctx);
				}
			}
		}
		showPoints();
		updateLines();
	}

	function undraw(){
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#ccc';
		ctx.moveTo(0,0);
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fill();
	}
	
	function updateLines(){
		if ( drawlines[0] !== undefined ){
			drawlines[0].update(ctx);
			if ( drawlines[0].done ) drawlines.shift();
			requestAnimFrame(updateLines);
		}
	}
	

	/// Show points in txt
	
	function showPoints(){
		$txtArea = $('#points');
		out = "";
		for(l in lines){
			out = out + "points"+l+" = Array();\n";
			for (p in lines[l].points){
				out = out + "points"+l+".push(new Point("+lines[l].points[p].x+", "+lines[l].points[p].y+"));\n";
			}
			out = out + "\n" + "lines.push(new Curve(points"+l+", 4, '#fff', "+stepSize+", "+($('#fluid').is(':checked')?'true':'false')+"));\n";
			out = out + "\n";
		}
		$txtArea.val(out);
	}

	// Buttons
	$('#add-pt').click(function(){
		lines[lines.length-1].points.push(new Point(window.innerWidth / 2, window.innerHeight / 2));
		draw();
		
	});
	
	$('#add-spline').click(function(){
		p = Array();
		p.push(new Point(window.innerWidth / 2 - 15, window.innerHeight / 2));
		p.push(new Point(window.innerWidth / 2 - 10, window.innerHeight / 2));
		p.push(new Point(window.innerWidth / 2 - 5, window.innerHeight / 2));
		p.push(new Point(window.innerWidth / 2, window.innerHeight / 2));
		lines.push(new Curve(p, 4, '#fff', stepSize, $('#fluid').is(':checked')));
		$('#add-pt').click();
		draw();
		
	});
	
	
	// Slider
	$('#step').change(function(){
		stepSize = $(this).val()/100;
		for(l in lines){
			lines[l].step = stepSize;
		}
		showPoints();
		draw();
	});

	
	$('#fluid').change(function(){
		instant = $(this).is(':checked');
		for(l in lines){
			lines[l].instant = !instant;
		}
		showPoints();
		draw();
	});
	
	
	// Error functions
	function fatalError(id){
		$obj = $('#'+id);
		console.log($obj);
		text = $obj!==undefined?$obj.html():'<div id="error">An unexpected error has occured</div>';
		$("body").empty().addClass('error').append(text);
	}
// 
// 
// });


