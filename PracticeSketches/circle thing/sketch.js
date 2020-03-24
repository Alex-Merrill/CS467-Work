const can = 600;
const numCirc = 65;

function setup() {
  createCanvas(can, can);
  noLoop();
  noStroke();
}

function draw() {
    background(0);
    colorMode(HSB, 360, 100, 100, 1);

    let x;
    let y;
    let r;
    let hue;
    let sat;
    let bright;
    let a;
    for(let i = 0; i < numCirc; i++) {
        x = random(0, width);
        y = random(0, height);
        r = random(70, can/3);
        hue = random(100, 250);
        sat = random(30, 70);
        bright = random(0, 100);
        a = random(.1, .7);
        fill(hue, sat, bright, a);
        circle(x, y, r);

    }

}
