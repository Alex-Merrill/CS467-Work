/*
CS467 - Practical 04

In this practical, we are exploring the world of noise.

You will again create a "walker" that explores the canvas, but this time it
will use a noise field to guide its progress about the space.

*/

const NUM_ANTS = 7500;
const LIFE_SPAN = NUM_ANTS/40;
let noiseScale;
let resetButton;
let ants = [];


function setup() {
  createCanvas(700, 700);
  background(0);

  //sliders
  noiseScale = createSlider(0, .1, .01, .005);
  resetButton = createButton('Reset');
  noiseScale.position(20, height + 20);
  resetButton.position(180, height + 20);
  resetButton.mousePressed(resetCan);

  //creates ants
  for(let i = 0; i < NUM_ANTS; i++) {
      ants.push(new Ant());
  }

}

function draw() {

    for(let i = 0; i < NUM_ANTS; i++) {
        ants[i].update();
    }

}

class Ant {

    constructor() {
        this.position = createVector(random(0, width), random(0, height));
        this.life = random(0, LIFE_SPAN);
        this.deaths = 0;
    }

    update() {

        //creates direction of movement
        let noiseVal = noise(this.position.x*noiseScale.value(), this.position.y*noiseScale.value(), this.deaths);
        let rad = map(noiseVal, 0, 1, 0, 2*PI);
        let angleVect = p5.Vector.fromAngle(rad, 2);

        //determines color
        colorMode(HSB, 360, 100, 100, 1);
        stroke(0, 0 + this.deaths*10, 75, .05);

        //draws lines
        beginShape(LINES);
        vertex(this.position.x, this.position.y);
        this.position.add(angleVect);
        vertex(this.position.x, this.position.y);
        endShape();

        //slowly kills
        this.life--;

        //wraps around canvas if x/y coord goes beyond
        if(this.position.x < 0) {
            this.position.x = width;
        } else if(this.position.x > width) {
            this.position.x = 0;
        }
        if(this.position.y < 0) {
            this.position.y = height;
        } else if(this.position.y > height) {
            this.position.y = 0;
        }

        //kills and resurrects ant
        if(this.life <= 0) {
            this.position = createVector(random(0, width), random(0, height));
            this.life = random(0, LIFE_SPAN);
            this.deaths++;
        }

    }

}

function resetCan() {
    ants = [];
    for(let i = 0; i < NUM_ANTS; i++) {
        ants.push(new Ant());
    }
    clear();
    background(0);
}
