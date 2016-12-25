var bgr = 0;
var fl = 0;
var painting = [];
var thisStroke = [];
var isPainting = false;
var doubleClickMS = 0;
var doubleClick = false;


function setup() {
	createCanvas(640,480);
}

function draw() {
	background(255);
	noStroke();
	
	drawBackground();
	drawPainting();
	drawEllipseCollision();
}




// ####################
// #### BACKGROUND ####
// ####################
drawBackground = function () {
	bgr = map(mouseX,0,height,0,255);
	background(bgr);
	
	fl = map(bgr,0,255,255,0); //inverts grayscale from 0-255 to 255-0
	fill(fl);
	ellipse(mouseX,height/2,40,40);
}

// ##################
// #### PAINTING ####
// ##################
drawPainting = function () {
	//fills in all previous strokes
	painting.forEach(function (stroke) {
		stroke.forEach (function (point) {
			fl = map(stroke[0].x,0,height,255,0); // color of the fill is based on where the stroke started, i.e. stroke[0])
			fill(fl);
			ellipse(point.x,point.y,40,40);
		});
	});

	//fills in current stroke because it is not yet in paiting variable
	thisStroke.forEach (function (point) {
		fl = map(thisStroke[0].x,0,height,255,0); // color of the fill is based on where the stroke started, i.e. stroke[0])
		fill(fl);
		ellipse(point.x,point.y,40,40);
	});
}
//requires mousepressed and released due to setting the current stroke
mousePressed = function() {
	doubleClick = (floor(millis()-doubleClickMS) <= 500?true:false);
	doubleClickMS = millis();
	
	if (doubleClick) painting = [];
	thisStroke = [];
}
mouseDragged = function() {
	thisStroke.push(createVector(mouseX,mouseY));
}
mouseReleased = function() {
	if (thisStroke.length > 1) painting.push(thisStroke);
	thisStroke = [];
}

// #############################
// #### COLLISION DETECTING ####
// #############################
drawEllipseCollision = function() {
	//collision detection on a circle
	var circle = { r: 25, x: 100, y: 100 }
	var distX = mouseX - circle.x;
	var distY = mouseY - circle.y;
	var distance = sqrt( (distX*distX) + (distY*distY) );
	
	if (distance < circle.r) fill(255,0,255); else fill(255,255,0);
	ellipse(circle.x,circle.y,circle.r*2,circle.r*2);
}
