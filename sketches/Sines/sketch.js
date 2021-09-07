let step = 0;
let up = true;



///MAKE IT WEBGL AND MAKE ROWS/COLS


function setup() {
    createCanvas(600, 600);
    colorMode(HSB, 360, 100, 100, 1);
    noFill();
    //noLoop();

}

function draw() {
    background(0);

    //draw waves
    push();
        translate(240/2, height*(3/5));
        stroke(255);
        for(let p = 1/2; p < 7; p ++) {
            let x = floor(p)*7.5;
            let xOff = map(p, .5, 9.5, 1, .63);
            beginShape();
                for(let i = 0; i < TWO_PI; i+= PI/180) {
                    let y = sin(i*p)*(step) - floor(p)*5.5;
                    let col = color(360, 0, 100, .2);
                    stroke(col);
                    vertex(x,y);
                    x += xOff;
                }
            endShape();
        }
    pop();

    //animate cycle
    if(step > 20) {
        up = false;
    }
    if(step < -20) {
        up = true;
    }

    if(up) {
        step += .6;
    } else {
        step -= .6;
    }

}



//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}
