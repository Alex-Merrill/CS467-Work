let cnv;
let damp = .97;
let prev;
let curr;

let rInp;
let rv;
let gInp;
let gv;
let bInp;
let bv;

function setup() {
    cnv = createCanvas(600, 600);
    pixelDensity(1);
    cnv.mousePressed(ripple);

    //setup rgb inputs
    rInp = createInput(75);
    rInp.input(rInput);
    rInp.position(30, height + 10);
    rInp.size(40);
    rv = parseFloat(rInp.value());
    gInp = createInput(75);
    gInp.input(gInput);
    gInp.position(110, height + 10);
    gInp.size(40);
    gv = parseFloat(gInp.value());
    bInp = createInput(75);
    bInp.input(bInput);
    bInp.position(190, height + 10);
    bInp.size(40);
    bv = parseFloat(bInp.value());

    //make prev and curr arrays filled with 0s
    prev = make2DArr(width, height);
    curr = make2DArr(width, height);
}

//draw loop 156, 211, 219
function draw() {
    background(0);

    if(frameCount%25 === 0) {
        randomRipples();
    }


    loadPixels();
    for(let x = 1; x < curr.length-1; x++) {
        for(let y = 1; y < curr[0].length-1; y++) {
            //calculates pixel color at x,y
            curr[x][y] = ((prev[x-1][y] + prev[x+1][y] + prev[x][y-1] + prev[x][y+1])/2) - curr[x][y];
            curr[x][y] = curr[x][y]*damp;
            let r = curr[x][y]*rv;
            let g = curr[x][y]*gv;
            let b = curr[x][y]*bv;

            //sets the pixel at x,y to color at curr[x][y]
            index = (x + y*curr.length)*4;
            pixels[index] = r;
            pixels[index+1] = g;
            pixels[index+2] = b;
        }
    }
    updatePixels();

    //swaps arrays
    let arr = prev;
    prev = curr;
    curr = arr;
}

//adds ripple
function ripple() {
    prev[mouseX][mouseY] = 75;
}

//makes 2d array filled with 0s
function make2DArr(cols, rows) {
    let arr = [];
    for(let i = 0; i < cols; i++) {
        arr.push(new Array(rows));
    }

    for(let x = 0; x < cols; x++) {
        for(let y = 0; y < rows; y++){
            arr[x][y] = 0;
        }
    }

    return arr;
}

//keypress function
function keyTyped() {
    if(key === 'r') {
        resetCan();
    }
}

//resets canvas and curr/prev arrays
function resetCan() {
    clear();
    curr = make2DArr(width, height);
    prev = make2DArr(width, height);
    background(0);
}

function randomRipples() {
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            if(random(1) < .000005) {
                prev[x][y] = 75;
            }
        }
    }
}

function rInput() {
    rv = parseFloat(this.value());
}

function gInput() {
    gv = parseFloat(this.value());
}

function bInput() {
    bv = parseFloat(this.value());
}
