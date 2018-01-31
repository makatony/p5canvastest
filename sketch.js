var bgr = 0;
var fl = 0;

var painting = [];
var thisStroke = [];
var isPainting = false;

var ellipseCollisionObj = {
  r: 25,
  x: 150,
  y: 50
};

function setup() {
  createCanvas(640, 480);

  setupSpringCircle();
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


// ############################
// #### UTIL: MOUSE EVENTS ####
// ############################

var doubleClickMS = 0;
var isDoubleClick = false;
var isMouseDrag = false;
mouseListeners = [];
var mousePressed = function() {
  this.isDoubleClick = (floor(millis() - doubleClickMS) <= 500 ? true : false); //for some reason this.isDoubleClick is passed to the functions without problems
  doubleClickMS = millis(); //resets doubleclick timer

  mouseEventCallHandlers('mousePressed', args);
  this.isMouseDrag = false;
};
var mouseClicked = function() {
  mouseEventCallHandlers('mouseClicked', args);
  this.isMouseDrag = false;
};
var mouseReleased = function() {
  mouseEventCallHandlers('mouseReleased', args);
  this.isMouseDrag = false;
};
var mouseDragged = function() {
  this.isMouseDrag = true;
  mouseEventCallHandlers('mouseDragged', args);
};
var mouseEventCallHandlers = function(type, args) {
  mouseListeners.forEach(function(elt) {
    if (elt.type == type) elt.fn.apply(this, args);
  });
};





// ####################
// #### BACKGROUND ####
// ####################
setupSpringCircle = function() {
  springStrength = 0.025;
  springDrag = 0.85;

  springTarget = 0;
  springVel = 0;
  springPos = 0; //x position of circle
};

drawBackground = function() {
  springTarget = mouseX;

  var springForce = springTarget - springPos; // if current position of circle relative to mouseX is great, the force is strong as well

  springForce *= springStrength; //scaling force (force will be going down by 90% on each draw)
  springVel *= springDrag; // scaling velocity (velocity will go down by 25% due to drag on each frame)

  springVel += springForce;

  springPos += springVel; // velocity might make the x position overshoot the mousex








  bgr = map(springPos, 0, height, 0, 255);
  background(bgr);

  fl = map(bgr, 0, 255, 255, 0); //inverts grayscale from 0-255 to 255-0
  fill(fl);




  ellipse(springPos, height / 2, 40, 40);
};


// ##################
// #### PAINTING ####
// ##################
drawPainting = function() {
  //fills in all previous strokes
  painting.forEach(function(stroke) {
    stroke.forEach(function(point) {
      fl = map(stroke[0].x, 0, height, 255, 0); // color of the fill is based on where the stroke started, i.e. stroke[0])
      fill(fl);
      ellipse(point.x, point.y, 40, 40);
    });
  });

  //fills in current stroke because it is not yet in paiting variable
  thisStroke.forEach(function(point) {
    fl = map(thisStroke[0].x, 0, height, 255, 0); // color of the fill is based on where the stroke started, i.e. stroke[0])
    fill(fl);
    ellipse(point.x, point.y, 40, 40);
  });
};
//requires mousepressed and released due to setting the current stroke

mouseListeners.push({
  type: 'mousePressed',
  fn: function() {
    if (this.isDoubleClick) painting = [];
    thisStroke = [];
  }
});
mouseListeners.push({
  type: 'mouseDragged',
  fn: function() {
    thisStroke.push(createVector(mouseX, mouseY));
  }
});
mouseListeners.push({
  type: 'mouseReleased',
  fn: function() {
    if (thisStroke.length > 1) painting.push(thisStroke);
    thisStroke = [];
  }
});



// #############################
// #### COLLISION DETECTING ####
// #############################
drawEllipseCollision = function() {
  //collision detection on a circle
  var circle = ellipseCollisionObj;
  var distX = mouseX - circle.x;
  var distY = mouseY - circle.y;
  var distance = sqrt((distX * distX) + (distY * distY));

  if (distance < circle.r) fill(255, 0, 255);
  else fill(255, 255, 0);
  ellipse(circle.x, circle.y, circle.r * 2);
};



// #######################
// #### BOUNCING BALL ####
// #######################
setupBouncingBalls = function(amount) {
  bouncingBalls = [];
  amount = amount || 2;
  for (var i = 0; i < amount; i++) {
    var newBall = new BouncingBall({
      r: 15
    });
    console.log(newBall.getConstructorName());

    bouncingBalls.push(newBall);
  }
};
mouseListeners.push({
  type: 'mouseReleased',
  fn: function() {
    if (!this.isMouseDrag && !this.isDoubleClick)
      setTimeout(function() {
        if (millis() - doubleClickMS > 100) bouncingBalls.push(new BouncingBall({
          r: 15,
          pos: {
            x: mouseX,
            y: mouseY
          }
        }));
      }, 100);
  }
});
drawBouncingBalls = function() {
  for (var i = 0; i < bouncingBalls.length; i++) {
    bouncingBalls[i].update();
    bouncingBalls[i].show();
  }
};

function BouncingBall(ball) { //difference between this and returning ballobj is that this is of constructor=BouncingBall and ballobj is of constructor=object
  this.r = ball.r || 10;
  this.pos = ball.pos || {};
  this.pos = {
    x: this.pos.x || random(0, width),
    y: this.pos.y || random(0, height)
  };
  this.xspeed = ball.xspeed || random(-4, 4);
  this.yspeed = ball.yspeed || random(-4, 4);

  this.getConstructorName = function() {
    return this.constructor.name;
  };

  this.update = function() { //adds the draw function to this BouncingBall object

    if (this.pos.x + this.r >= width) {
      this.xspeed = -Math.abs(this.xspeed);
    } // negative = go left
    else if (this.pos.x - this.r <= 0) {
      this.xspeed = Math.abs(this.xspeed);
    } // positive = go right.
    this.pos.x = this.pos.x + this.xspeed; //updates the position based on 'speed' that is positive or negative

    if (this.pos.y + this.r >= height) {
      this.yspeed = -Math.abs(this.yspeed);
    } // negative = go left
    else if (this.pos.y - this.r <= 0) {
      this.yspeed = Math.abs(this.yspeed);
    } // positive = go right.
    this.pos.y = this.pos.y + this.yspeed; //updates the position based on 'speed' that is positive or negative
  };

  this.show = function() {
    fill(0, 255, 255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  };

  return this; // optional
}




// ############################
// #### SPINNING RECTANGLE ####
// ############################
drawSpinningRectangle = function() {
  fill(0, 125, 255);
  push(); //required such that translate applies only to the rectancle. Try once without push/pop!
  translate(300, 50); //translates the origin to 300,300
  rotate(p5.Vector.random2D().heading());
  rectMode(CENTER);
  rect(0, 0, 50, 10);
  pop();
};
