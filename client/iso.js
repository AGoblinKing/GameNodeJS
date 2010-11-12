var map = Array([1,0,0,0,1,1],[1,0,0,1,1,1],[0,0,1,1,1,0],[1,1,1,1,1,1],[1,0,0,0,1,1],[1,0,0,1,1,1],[0,0,1,1,1,0],[1,1,1,1,1,1]);
var tileDict = Array("water.png","land.png","swamp.png");
var tileImg = new Array();
var loaded = 0;
var loadTimer;
var ymouse;
var xmouse;
var mapX = 100;
var mapY = 10;
 
function loadImg(){
	for(var i=0;i<tileDict.length;i++){
		tileImg[i] = new Image();
		tileImg[i].src = tileDict[i];
		tileImg[i].onload = function(){
			loaded++;
		}
	}
}
 
function loadAll(){
	if(loaded == tileDict.length){
		clearInterval(loadTimer);
		loadTimer = setInterval(gameUpdate,100);
	}
}
 
 
function gameUpdate(){
	ctx.clearRect(0,0,310,200)
	drawMap();
}
 
 
function mouseCheck(e){
		var x = e.pageX;
		var y = e.pageY;
		ymouse=(2*(y-canvas.offsetTop-mapY)-x+canvas.offsetLeft+mapX)/2;
		xmouse=x+ymouse-mapX-25-canvas.offsetLeft
 		ymouse=Math.round(ymouse/25);
		xmouse=Math.round(xmouse/25);
		document.title = "tileY:" + ymouse + " | tileX:" + xmouse;
}
 
 
function drawMap(){
var tileH = 25;
var tileW = 50;
		for(i=0;i<map.length;i++){
				for(j=0;j<map[i].length;j++){
					var drawTile= map[i][j];
					var xpos = (i-j)*tileH + mapX;
					var ypos = (i+j)*tileH/2+ mapY;
					ctx.drawImage(tileImg[drawTile],xpos,ypos);
					if(i == xmouse && j == ymouse){
											  ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
											  ctx.beginPath();
											  ctx.moveTo(xpos, ypos+12.5);
											  ctx.lineTo(xpos+25, ypos);
											  ctx.lineTo(xpos+50, ypos+12.5);
											  ctx.lineTo(xpos+25, ypos+25);
											  ctx.fill();
											 
						}
				}
		}
}
 
function mouseClick(e){
	map[xmouse][ymouse] = 2;
}
 
 
function init(){
	canvas = document.getElementById('main')
	ctx = canvas.getContext('2d');
	loadImg();
	loadTimer = setInterval(loadAll,100);
	canvas.addEventListener("mousemove", mouseCheck, false);
	canvas.addEventListener("mousedown", mouseClick, false);
}