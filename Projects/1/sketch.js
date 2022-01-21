/*
Tartan Viewer
*/

//map color codes to RGB values
const colors = {
  LR: [232, 204, 184],
  R: [220, 0, 0],
  DR: [136, 0, 0],
  O: [236, 128, 72],
  DO: [190, 120, 50],
  LY: [248, 227, 140],
  Y: [255, 230, 0],
  DY: [208, 152, 0],
  LG: [134, 198, 124],
  G: [0, 100, 0],
  DG: [0, 56, 32],
  LB: [130, 207, 253],
  B: [56, 80, 200],
  DB: [0, 0, 72],
  LP: [196, 156, 216],
  P: [100, 0, 140],
  DP: [68, 0, 68],
  W: [255, 255, 255],
  LN: [224, 224, 224],
  N: [128, 128, 128],
  DN: [20, 40, 60],
  K: [16, 16, 16],
  LT: [176, 116, 48],
  T: [96, 56, 0],
  DT: [68, 24, 0]
};

const colorList = ["LR", "R", "DR", "O", "DO", "LY", "Y", "DY", "LG", "G", "DG", "LB",
                  "B", "DB", "LP", "P", "DP", "W", "LN", "N", "DN", "K", "LT", "T", "DT"];


function setup() {
  createCanvas(900, 900);

  const input = createInput();
  input.position(20, 950);

  const button = createButton('submit');
  button.position(input.x + input.width + 50, 950);
  button.mousePressed(()=> {handleInput(input.value())});
  noStroke();

}


function handleInput(threadString){
  //clears canvas
  clear();

  //parse input to seperate color codes and threadcounts
  var colorArray = threadString.split(' ');
  var threadCount = [];

  //got regular expression help from https://stackoverflow.com/questions/38110419/is-there-a-difference-between-d-and-d
  for(var i = 0; i < colorArray.length; i++ ){
    var match = colorArray[i].match(/(\d+)/);
    //invalid expression where no number is put next to color code
    if(match == null || match == NaN) {
      alert("Invalid threadcount. Please enter valid threadcount to continue. \nEg. B24 DR12 W4 B24 DR12 \nValid Color Codes: " + colorList);
      return;
    }
    threadCount[i] = parseInt(match[0]);
    colorArray[i] = colorArray[i].replace(/(\d+)/, '');
  }

  //invalid expression where colorcode is wrong
  for(var i = 0; i < colorArray.length; i++) {
    if(colors[colorArray[i]] == undefined) {
      alert("Invalid colorcode. Please enter valid threadcount to continue. \nEg. B24 DR12 W4 B24 DR12 \nValid Color Codes: " + colorList);
      return;
    }
  }

  alphaBlendTartan(threadCount, colorArray);

}


//Draws tartan from input using alpha blending
function alphaBlendTartan(threadCount, colorArray) {

  //gets pattern width to execute for loop on number of repititions
  var pWidth = 0;
  for(var i = 0; i < threadCount.length; i++) {
    pWidth += threadCount[i];
  }

  //draw vertical stripes
  var xspace = 0;
  let col;
  var it = 0;
  for(var j = 0; j < width; j += pWidth) {

    if(it%2 == 0) {
      for(var i = 0; i < colorArray.length; i++) {
        col = color(colors[colorArray[i]]);
        col.setAlpha(255);
        fill(col);
        rect(xspace, 0, threadCount[i]*2, height);
        xspace += threadCount[i]*2;
      }
    } else {
      for(var i = colorArray.length - 2; i > 0; i--) {
        col = color(colors[colorArray[i]]);
        col.setAlpha(255);
        fill(col);
        rect(xspace, 0, threadCount[i]*2, height);
        xspace += threadCount[i]*2;
      }
    }
    it++;

  }

  blendMode(BLEND);
  var yspace = 0;
  it = 0;
  for(var j = 0; j < height; j += pWidth) {

    if(it%2 == 0) {
      for(var i = 0; i < colorArray.length; i++) {
        col = color(colors[colorArray[i]]);
        col.setAlpha(127);
        fill(col);
        rect(0, yspace, width, threadCount[i]*2);
        yspace += threadCount[i]*2;
      }
    } else {
      for(var i = colorArray.length - 2; i > 0; i--) {
        col = color(colors[colorArray[i]]);
        col.setAlpha(127);
        fill(col);
        rect(0, yspace, width, threadCount[i]*2);
        yspace += threadCount[i]*2;
      }
    }
    it++

  }

}
