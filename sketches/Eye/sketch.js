const CAN = 800;
const CELL_SIZE = 50;
let alphaSlider;
let startPicker;
let endPicker;
let offscreen;
let y;
let x;
let iter;
let track;

//set up canvas, sliders, pickers, and iterators
function setup() {
    createCanvas(CAN, CAN);
    offscreen = createGraphics(CAN/2, CAN);
    iterSlider = createSlider(0, 200, 10, 1);
    alphaSlider = createSlider(0, 255, 60, 1);
    startPicker = createColorPicker('red');
    endPicker = createColorPicker('blue');
    iterSlider.position(100, CAN + 20);
    alphaSlider.position(100, CAN + 50);
    startPicker.position(100, CAN + 75);
    endPicker.position(150, CAN + 75);
    x = 0;
    y = 0;
    track = 0;

}

//draw loop
function draw() {
    background(0);

    //keep track of direction
    iter = iterSlider.value();
    if(x > offscreen.width-iter && y > offscreen.height-iter) {
        track++;
    } else if(x < 0 && y < 0) {
        track++;
    }

    //reverse direction when reach end of cycle
    if(track%2 == 0) {
        x += iter;
        y += iter;
    } else {
        x -= iter;
        y -= iter;
    }

    //map cycle position to [0,1] for lerp
    let xMap = map(x, 0, offscreen.width*2, 0, 1);

    //fill in offscreen
    drawShape(offscreen, x, y, xMap);

    //paste image on left side and mirror on right side
    imageMode(CORNER);
    image(offscreen, 0, 0);
    translate(width, 0);
    scale(-1.0, 1.0);
    image(offscreen, 0, 0);


}

//fills in graphic
function drawShape(g, x, y, xMap) {
    //clear graphic for each iteration
    g.clear();

    //create color
    colorMode(RGB, 255, 255, 255, 255);
    blendMode(BLEND);
    let col = lerpColor(startPicker.color(), endPicker.color(), xMap);
    col.setAlpha(alphaSlider.value());

    //y-axis lines

    //top to bottom
    for(let i = 0; i < g.height; i++) {
        //g.stroke(x/4, 100, 100, 80);
        g.stroke(col);
        g.line(0, i, g.width, y);
    }

    //bottom to top
    for(let i = g.height; i > 0; i--) {
        //g.stroke(x/4, 100, 100, 80);
        g.stroke(col);
        g.line(0, i, g.width, g.height-y);
    }

    //x-axis lines

    //top move out
    for(let i = g.height; i > 0; i--) {
        //g.stroke(x/4, 100, 100, 80);
        g.stroke(col);
        g.line(i, 0, g.width-x/2, g.height/2);
    }

    //bottom move out
    for(let i = g.height; i > 0; i--) {
        //g.stroke(x/4, 100, 100, 80);
        g.stroke(col);
        g.line(i, g.height, g.width-x/2, g.height/2);
    }


}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}
