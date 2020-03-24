const can = 700;

function setup() {
  createCanvas(can, can);
  noLoop();
}

function draw() {
  
  background(0);
  
  var space = 25;
  var numR = can/space; 
  
  for(var i = 0; i < numR; i ++) {  
    fill(255);
    rect(i*space, 0, 1+i, height);
  }
  blendMode(DIFFERENCE);
  
  circle(can/2,can/2, can/1.5);
  
}