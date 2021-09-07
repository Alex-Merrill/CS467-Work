let offScale;
let resetB;
let nS = 0;
let up = true;

function setup() {
    createCanvas(500,500);
    background(0);
    colorMode(HSB, 360, 100, 100, 1);

    offScale = createSlider(0, 1, 0, .01);
    offScale.position(20, height + 20);

    resetB = createButton('Reset');
    resetB.mousePressed(reset);
    resetB.position(20, height + 40);
}

function draw() {
    //background(0);

    push();
        translate(width/2, height/2);
        strokeWeight(1);
        noFill();
        beginShape();
            for(let j = 0; j < TWO_PI; j += PI/180) {
                let xOff = cos(j) + offScale.value();
                let yOff = sin(j) + offScale.value();
                let r = noise(xOff*nS, yOff*nS);
                let col = map(r, .15, .8, 0, 360);
                r = map(r, .15, .8, 2, 275);
                let x = r * cos(j);
                let y = r * sin(j);
                stroke(col, 100, 100, .1);
                vertex(x, y);
            }
        endShape();
    pop();


    if(nS >= PI) {
        up = false;
    }
    if(nS <= 0) {
        up = true;
    }

    if(up) {
        nS += PI/180
    } else {
        nS -= PI/180
    }

    if(frameCount >= 720) {
        reset(false);
    }

}

function mouseReleased() {
    reset(false);
}

function reset(newS = true) {
    frameCount = 0;
    nS = 0;
    if(newS) {
        noiseSeed(random(0, 10000));
    }
    background(0);
    redraw();
}
