
var canvas 		= document.getElementById('example');
var ctx 			= canvas.getContext('2d');
var screen		= [0,1600,0,900];
var clock		= 4; 
var absMass		= 0;
var gravityMod	= 0.8;
var resist		= 0.955;
var scale		= 0.01;
var maxMass		= 1*document.getElementById("maxmass").value+1;
var antigrav		= 1*document.getElementById("antigrav").value+1;
var count		= 1*document.getElementById("count").value+1;
//var target		= [1500-(1500-20)*Math.random(), 850-(850-20)*Math.random()];
var colors = ["red", "green", "blue", "white", "pink", "orange", "violet", "yellow", "gray", "brown"];
var 	objs = new Array();
  //objs.push( [50, 	50, 	10, 		5, 		1, 		1, 		2,		1] );
	//			0:X		1:Y		2:Mass		3:Vx	4:Vy	5:Ax	6:Ay	7:Col

// Шлейф за объектом
var discrPath	= 1;
var dPath		= 1;
var pathLength 	= 200;
var userPath 	= new Array( pathLength )
var pathPoint 	= 0;

// Создание объектов 
for(var i=0; i<count; i++) {
	var x = 1500-(1500-20)*Math.random();
	var y = 850-(850-20)*Math.random();
	var m = maxMass-(maxMass-5)*Math.random()-antigrav;
	var c = Math.round(9-9*Math.random());
	objs.push([x, y, m, 0, 0, 0, 0, c]);
	absMass += i*1.4+10;
}
objs[count-1][2] = 7;
// Сброс пути до позиции объекта
for(var i=0; i<pathLength; i++)
	userPath[i] = [objs[count-1][0], objs[count-1][1]];
	
// Изменение шлейфа
function redrawPath() {
	if(dPath % discrPath != 0) {dPath++; return}
	else dPath = 1;
	pathPoint++;
	if(pathPoint == pathLength)	pathPoint = 0;
	userPath[ pathPoint ] = [objs[count-1][0], objs[count-1][1]];
}
function redraw( R ) {

	ctx.beginPath();
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,1600,900);
	ctx.closePath();


	// Рисуем объекты
	for(var i=0; i<objs.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = colors[objs[i][7]];
		ctx.arc(objs[i][0], objs[i][1], objs[i][2]+antigrav+2, 0, 2*Math.PI, true);
		ctx.fill();
	}
	// Рисуем путь
	ctx.fillStyle = colors[objs[count-1][7]];
	for(var i=0; i<pathLength; i++) {
		ctx.beginPath();
		ctx.arc(userPath[i][0], userPath[i][1], 2, 0, 2*Math.PI, true);
		ctx.fill();
	}
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 5;
//	ctx.arc(target[0], target[1], 25, 0, 2*Math.PI, true);
	ctx.fill();
	ctx.stroke();
/*	// Отрисовка центра масс
	ctx.beginPath();
	ctx.fillStyle = "blue";
	ctx.lineWidth = 4;
	ctx.strokeStyle = "yellow";
	ctx.arc(R[0], R[1], 5, 0, 2*Math.PI, true);
	ctx.fill();
	ctx.stroke();
	
	console.log(objs.length);
*/	
}
function worldCalculate() {
/*	// R - радиус-вектор центра масс
	var R = [0,0];
	for(var i=0; i<objs.length; i++)
	{
		R[0] += objs[i][0]*objs[i][2];
		R[1] += objs[i][1]*objs[i][2];
	}
	R[0] = R[0] / absMass;
	R[1] = R[1] / absMass;
*/	
	// Нахождение векторов ускорений и скоростей
	for(var i=0; i<objs.length; i++)
	{
		for(var j=0; j<objs.length; j++)
		{
			if(i == j || i <count-1) continue;
			var rad 		= Math.pow( objs[j][0]-objs[i][0], 2 ) + Math.pow( objs[j][1]-objs[i][1], 2 );
			var force 	= objs[i][2] * objs[j][2] / rad * scale * gravityMod;
			objs[i][5] += force * ( objs[j][0]-objs[i][0] );
			objs[i][6] += force * ( objs[j][1]-objs[i][1] );
		}
		objs[i][5] *= resist;
		objs[i][6] *= resist;		
		objs[i][3] *= resist;
		objs[i][4] *= resist;		
		objs[i][3] += objs[i][5];
		objs[i][4] += objs[i][6];


	}
	// Нахождение перемещений
	for(var i=0; i<objs.length; i++)
	{
		objs[i][0] += objs[i][3];
		objs[i][1] += objs[i][4];
		if(objs[i][0] < 20 || objs[i][0] > 1500) 	{ objs[i][3] *= -1; objs[i][5] *= -1; }
		if(objs[i][1] < 20 || objs[i][1] > 850) 	{ objs[i][4] *= -1; objs[i][6] *= -1; }
		//if( Math.abs(objs[count-1][0] - target[0]) <= 25 && Math.abs(objs[count-1][1] - target[1]) <= 25) {alert("Ты победил!"); window.location = self.location;}
	}
	// Нахождение столкновений
	for(var i=0; i<objs.length; i++)
		for(var j=0; j<objs.length; j++)
		{
			if(i == j) continue;
			//if( Math.abs( objs[i][0] - objs[j][0] ) <= ( objs[i][2] + objs[j][2] -5) ) {objs[i][5] *= -1.1; objs[j][5] *= -1.1;} 
			//if( Math.abs( objs[i][1] - objs[j][1] ) <= ( objs[i][2] + objs[j][2] -5) ) {objs[i][6] *= -1.1; objs[j][6] *= -1.1;} 
			
			//if( Math.abs( objs[i][0] - objs[j][0] ) <= ( objs[i][2] + objs[j][2]-20) ) {objs.splice(i,1);} 
			//if( Math.abs( objs[i][1] - objs[j][1] ) <= ( objs[i][2] + objs[j][2]-20) ) {objs.splice(i,1);} 
		}
	
	
	// Вызов рисования
	redrawPath();
	redraw( );	
	//console.log(R[0]+" "+R[1]);
	
}

function renderrer() {
  requestAnimationFrame(renderrer);
  worldCalculate();
}
function mainstart() {
	document.getElementById("startmenu").hidden = true;
	renderrer();
	worldCalculate();
}
var speed = 0.2;
window.onkeyup = function(e) {
	console.log(e.keyCode);
	switch(e.keyCode) {
		case 37:  objs[count-1][5]-=speed; break;																			// Влево
		case 38:  objs[count-1][6]-=speed; break;																			// Вверх
		case 39:  objs[count-1][5]+=speed; break;																			// Вправо
		case 40:  objs[count-1][6]+=speed; break;																			// Вниз
	}
}