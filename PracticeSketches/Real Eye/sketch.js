let n = 0;
let nS = 0;
let up = true;

function setup() {
    createCanvas(500,500);
    background(0);
    colorMode(HSB, 360, 100, 100, 1);
    //noLoop();
    offScale = createSlider(0, 20, 0, .01);
    offScale.position(20, height + 20);
}

function draw() {
    //background(0);
    //let colVal = map(noiseVal, 0, 1, 0, 255);



    push();
        translate(width/2, height/2);
        strokeWeight(1);
        noFill();
        beginShape();
        for(let j = 0; j < TWO_PI; j += PI/180) {
            let xOff = cos(j);
            let yOff = sin(j);
            let r = noise(xOff*nS, yOff*nS);
            let col = map(r, 0, 1, 0, 360);
            r = map(r, 0, 1, 10, 250);
            x = r * cos(j);
            y = r * sin(j);
            stroke(col, 100, 100, .1);
            vertex(x, y);
        }
        endShape();
    pop();


    if(nS >= 2) {
        up = false;
    }
    if(nS <= 0) {
        up = true;
    }

    if(up) {
        if(nS > .5) {
            nS += .05
        } else if(nS < .0001) {
            nS += .00002
        } else {
            nS += .003
        }
    } else {
        if(nS > .5) {
            nS -= .05
        } else if(nS < .0001) {
            nS -= .00002
        } else {
            nS -= .003
        }
    }

}

function mouseReleased() {
    console.log("here");
    background(0);
    redraw();
}
