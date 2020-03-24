const can = 600;
let angle = 0;

function setup() {
  createCanvas(can, can);
  //noLoop();
}

function draw() {

  background(255);
  push();
  //changes origin to middle
  translate(width/2, height/2);
  //rotates everything within push above and last pop
  rotate(angle);
  //creates one arm
  push();
  rotate(-PI/4);
  rect(0,0,150,25);
  translate(150, 0);
  rotate(PI/4);
  rect(0,0,150,25);
  pop();
  //flips canvas and creates other arm
  push();
  scale(-1,1);
  rotate(-PI/4);
  rect(0,0,150,25);
  translate(150, 0);
  rotate(PI/4);
  rect(0,0,150,25);
  pop();
  pop();
  angle += .01;
  rect(0,0,50,50);
}
