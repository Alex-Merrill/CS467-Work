/*
CS467 - Practical 02

This sketch is an exploration of repetition. When finished, it will draw a web of lines across the canvas which follow the mouse.

*/

const can = 700;
const CELL_SIZE = 50;
let offscreen;


function setup() {
  createCanvas(can, can);
  offscreen = createGraphics(CELL_SIZE*2, CELL_SIZE*2);
  numLineSlider = createSlider(4, 50, 20, 1);
  numLineSlider.position(100, can + 20);
  alphaSlider = createSlider(0, 255, 40, 1);
  alphaSlider.position(100, can + 40);

}

function draw() {
  background(0);

  gMouseX = map(mouseX, 0, width, 0, CELL_SIZE*2);
  gMouseY = map(mouseY, 0, height, 0, CELL_SIZE*2);

  drawShape(offscreen, gMouseX, gMouseY);

  for(let x = CELL_SIZE; x < width; x += CELL_SIZE) {
    for(let y = CELL_SIZE; y < height; y += CELL_SIZE) {
      imageMode(CENTER);
      image(offscreen, x, y);
    }
  }

}

function drawShape(g, gMouseX, gMouseY) {
  g.clear();

  let numLines = numLineSlider.value();
  let offset = g.width/numLines;

  //g.strokeWeight(10);
  g.stroke(255,255,255,alphaSlider.value());

  for(let i = 0; i < g.width; i += offset) {
    g.line(0, 0 + i, gMouseX, gMouseY);
    g.line(0 + i, 0, gMouseX, gMouseY);
    g.line(g.width, 0 + i, gMouseX, gMouseY);
    g.line(0 + i, g.height, gMouseX, gMouseY);
  }

}

function keyTyped() {
  console.log(key);
  if(key === 's') {
    saveCanvas('wires', 'png');
  }
}
