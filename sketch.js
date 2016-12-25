var bgr = 0;
var fl = 0;
var painting = [];
var thisStroke = [];
var isPainting = false;
function setup() {
	createCanvas(640,480);
}

function draw() {
	bgr = map(mouseX,0,height,0,255);
	background(bgr);
	
	fl = map(bgr,0,255,255,0); //inverts grayscale from 0-255 to 255-0
	fill(fl);
	ellipse(mouseX,height/2,40,40);
	
	noStroke();
	
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

function mousePressed() {
	thisStroke = [];
}
function mouseDragged() {
		thisStroke.push(createVector(mouseX,mouseY));
}

function mouseReleased() {
	painting.push(thisStroke);
	thisStroke = [];
}