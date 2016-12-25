var bgr = 0;
var fl = 0;

var painting = [];
var thisStroke = [];
var isPainting = false;
var doubleClickMS = 0;
var doubleClick = false;

var ellipseCollisionObj = { r: 25, x: 150, y: 50 };

function setup() {
	createCanvas(640,480);
	
	setupBouncingBalls(2);
}

function draw() {
	background(255);
	noStroke();
	
	drawBackground();
	drawPainting();
	drawEllipseCollision();
	drawBouncingBalls();
	drawSpinningRectangle();
	
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
	var circle = ellipseCollisionObj;
	var distX = mouseX - circle.x;
	var distY = mouseY - circle.y;
	var distance = sqrt( (distX*distX) + (distY*distY) );
	
	if (distance < circle.r) fill(255,0,255); else fill(255,255,0);
	ellipse(circle.x,circle.y,circle.r*2);
}



// #######################
// #### BOUNCING BALL ####
// #######################
setupBouncingBalls = function(amount) {
	bouncingBalls = [];
	var amount = amount||2;
	for (var i = 0; i < amount; i++) {
		var ballProperties = { r: 15, pos: { x: random(0,width), y: random(0,height)}, xspeed:random(-4,4), yspeed:random(-4,4) };
		var newBall = new BouncingBall(ballProperties);
		console.log(newBall.getConstructorName());
		
		bouncingBalls.push(newBall);
		}
	
}
drawBouncingBalls = function() {
	for (var i = 0; i < bouncingBalls.length; i++) {
		bouncingBalls[i].update();
		bouncingBalls[i].show();
	}
}
function BouncingBall(ball) { //difference between this and returning ballobj is that this is of constructor=BouncingBall and ballobj is of constructor=object
	this.r = ball.r||10;
	this.pos = ball.pos||{};
	this.pos = { x: this.pos.x||10, y: this.pos.y||10 };
	this.xspeed = ball.xspeed||4;
	this.yspeed = ball.yspeed||1;
		
	this.getConstructorName = function() { return this.constructor.name };
	
	this.update = function () { //adds the draw function to this BouncingBall object

		if (this.pos.x + this.r >= width) { this.xspeed = -Math.abs(this.xspeed); } // negative = go left
		else if (this.pos.x - this.r <= 0) { this.xspeed = Math.abs(this.xspeed); } // positive = go right. 
		this.pos.x = this.pos.x + this.xspeed; //updates the position based on "speed" that is positive or negative

		if (this.pos.y + this.r >= height) { this.yspeed = -Math.abs(this.yspeed); } // negative = go left
		else if (this.pos.y - this.r <= 0) { this.yspeed = Math.abs(this.yspeed); } // positive = go right.
		this.pos.y = this.pos.y + this.yspeed; //updates the position based on "speed" that is positive or negative
	};
	
	this.show = function() {
		fill(0,255,255);
		ellipse(this.pos.x,this.pos.y,this.r*2)
	}

	return this; // optional
}


// ############################
// #### SPINNING RECTANGLE ####
// ############################
drawSpinningRectangle = function() {
	fill(0,125,255);
	push(); //required such that translate applies only to the rectancle. Try once without push/pop!
	translate(300,50); //translates the origin to 300,300
	rotate(p5.Vector.random2D().heading());
	rectMode(CENTER);
	rect(0,0,50,10);
	pop();
}