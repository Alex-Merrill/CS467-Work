let cnv;
let isRandom = false;
let checkbox;
let flowers = [];

function setup() {
    cnv = createCanvas(600, 600);
    angleMode(DEGREES);
    blendMode(SCREEN);
    colorMode(HSB, 360, 100, 100, 1);
    background(0);

    cnv.mousePressed(addFlower);

    checkbox = createCheckbox("Random Generation");
    checkbox.position(10, height+10);
    checkbox.changed(checkChange);

    if(isRandom) {
        for(let i = 0; i < 50; i++) {
            let x = random(0, width);
            let y = random(0, height);
            flowers.push(new Flower(x, y));
        }
    }
}

//draw loop
function draw() {

    for(let flower of flowers) {
        flower.draw();
    }

    if(frameCount % 45 === 0 && isRandom) {
        for(let i = 0; i < 50; i++) {
            let x = random(0, width);
            let y = random(0, height);
            flowers.push(new Flower(x, y));
        }
    }
}

//adds flower to flowers[]
function addFlower() {
    flowers.push(new Flower(mouseX, mouseY));
}

function checkChange() {
    if(this.checked()) {
        isRandom = true;
        resetCan();
    } else {
        isRandom = false;
        resetCan();
    }
}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('flowers', 'png');
    } else if(key === 'd') {
        for(let i = 0; i < 50; i++) {
            let x = random(0, width);
            let y = random(0, height);
            flowers.push(new Flower(x, y));
        }
    } else if(key === 'r') {
        resetCan();
    }
}

function resetCan() {
    frameCount = 0;
    flowers = [];
    if(isRandom) {
        for(let i = 0; i < 50; i++) {
            let x = random(0, width);
            let y = random(0, height);
            flowers.push(new Flower(x, y));
        }
    }
    clear();
    background(0);
}

class Flower {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.iter = 0;
        this.c = 2.5;

    }

    draw() {
        //get coords and color
        let a = this.iter*137.5;
        let r = this.c*sqrt(this.iter);
        let x = r*cos(a);
        let y = r*sin(a)
        let col = color(a%360, 100, 100, 1);
        let rad = map(r, 0, 100, 1, 7);

        //draw flower
        push();
            translate(this.x, this.y);
            noStroke();
            fill(col);
            circle(x, y, rad);
        pop();

        //update iter;
        this.iter++;
    }

}
