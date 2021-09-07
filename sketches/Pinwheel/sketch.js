const CAN = 750;
const CELL_SIZE = 50;
let offscreen;
let speed = 0;
let inc;




function setup() {
    createCanvas(CAN, CAN);
    offscreen = createGraphics(CELL_SIZE*2, CELL_SIZE*2);
    speedSlider = createSlider(0, .5, .05, .001);
    speedSlider.position(100, CAN + 25);
    alphaSlider = createSlider(0, 255, 40, 1);
    alphaSlider.position(100, CAN + 50);


}

//maybe use x position to do alpha blending

function draw() {
    background(20, 95, 217);

    let xc = 50+ 50*sin(speed);
    let yc = 50 + 50*cos(speed);
    speed += speedSlider.value();

    drawShape(offscreen, xc, yc);

    for(let x = offscreen.width*.35; x < width; x += offscreen.width/1.5) {
        for(let y = offscreen.height-185; y < height; y += offscreen.height/1.5) {
            imageMode(CENTER);
            image(offscreen, x, y);
        }
    }

}

function drawShape(g, xc, yc) {
    g.clear();

    let colEditX = map(xc, 0, 50, 0, 255);
    let colEditY = map(yc, 0, 50, 0, 255);

    blendMode(BLEND);

    //TOP LEFT
    for(let i = 0; i < g.width/4; i++) {
        g.stroke(colEditX, colEditY, 30, alphaSlider.value());
        g.line(0 + i, 0, xc, yc);
    }

    for(let i = 0; i < g.width/4; i++) {
        g.stroke(colEditX, colEditY, 30, alphaSlider.value());
        g.line(0, 0 + i, xc, yc);
    }

    //BOTTOM RIGHT
    for(let i = 0; i < g.width/4; i++) {
        g.stroke(colEditX, colEditY, 30, alphaSlider.value());
        g.line(g.width, g.height - i, xc, yc);
    }

    for(let i = 0; i < g.width/4; i++) {
        g.stroke(colEditX, colEditY, 30, alphaSlider.value());
        g.line(g.width - i, g.height, xc, yc);
    }



}

function keyTyped() {
    if(key === 's') {
        saveCanvas('wires', 'png');
    }
}
