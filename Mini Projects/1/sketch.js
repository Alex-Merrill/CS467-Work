/*
This sketch should show two color bands, each interpolating from one color to another across the canvas. The top should be in the RGB color space and the bottom in HSB.
*/

//let divisions;
let startColor;
let endColor;
let divisionSlider;
let startPicker;
let endPicker;

function setup() {
  createCanvas(800, 800);
  divisionSlider = createSlider(2, 200, 100, 1);
  divisionSlider.position(100, height + 20);
  startPicker = createColorPicker('red');
  endPicker = createColorPicker('blue');
  startPicker.position(110, height + 50);
  endPicker.position(165, height + 50);
  noStroke();

}

function draw() {
  background(255);

  colorMode(RGB);

  var div = divisionSlider.value();

  var size = width/div;

  for(var i = 0; i < div; i++) {
    let col = lerpColor(startPicker.color(), endPicker.color(), i/(div-1));
    fill(col);
    rect(size*i, 200, size, 100);
  }

  colorMode(HSB);

  for(var i = 0; i < div; i++) {
    let col = lerpColor(startPicker.color(), endPicker.color(), i/(div-1));
    fill(col);
    rect(size*i, 400, size, 100);
  }

}
