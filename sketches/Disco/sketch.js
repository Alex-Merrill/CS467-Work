let r;
let positions = [];
colors = [];
let iterator;

function setup() {
    createCanvas(400, 400);
    colorMode(HSB, 360, 100, 100, 1);
    noStroke();
    background(194, 20, 90);
    iterator = 0;
    r = 2;


    for(let i = 0; i < 20; i++) {
        positions.push(createVector(random(0+20, width-20), random(0+20, height-20)));
    }

    for(let i = 0; i < 20; i++) {
        colors.push(color(random(0,360), 100, 100));
    }

}

function draw() {


    if(iterator < positions.length) {
        let col = colors[iterator];
        col.setAlpha(.1);
        fill(col);
        circle(positions[iterator].x, positions[iterator].y, r);
    }


    r += 20;

    if(frameCount%45 == 0) {
        iterator++;
        r = 2;
    }
}
