const LIFE_SPAN = 7500/40;

let numThings;
let img;
let capture;
let noiseScale;
let alphaSlider;
let startButton;
let selector;
let particles;
let ants;

//
//Create a particle emiter that goes across the screen
//
//



function preload() {
    img = loadImage('star.jpg');
}

function setup() {
  createCanvas(640, 480);
  colorMode(RGB, 255, 255, 255, 1);
  background(127);

  //capture = createCapture(VIDEO);
  //capture.position(700, 200);
  //capture.hide();

  noiseScale = createSlider(0, .1, .01, .005);
  noiseScale.position(20, height + 20);

  alphaSlider = createSlider(0, 1, .05, .01);
  alphaSlider.position(20, height + 40);

  radSlider = createSlider(1, 20, 10, 1);
  radSlider.position(20, height + 60);

  startButton = createButton('Start');
  startButton.position(180, height + 20);
  startButton.mousePressed(start);

  selector = createSelect();
  selector.position(240, height + 20);
  selector.option('Ants');
  selector.option('Brush');
  selector.changed(start);


  img.resize(640, 480);
  start();

}

function draw() {
    //background(255);
    //capture.loadPixels();

    if(img) {
        if(selector.value() === 'Ants') {
            for(let ant of ants) {
                ant.update();
            }
        } else {
            for(let particle of particles) {
                particle.update();
                particle.draw();
            }
        }
    }

}

function start() {
    clear();
    ants = [];
    particles = [];
    if(img) {
        if(selector.selected() ==- 'Ants') {
            numThings = 7500;
        } else {
            numThings = 200;
        }
        for(let i = 0; i < numThings; i++) {
            if(selector.selected() === 'Ants') {
                ants.push(new Ant(img, alphaSlider.value()));
            } else {
                particles.push(new Particle(img, 320, 240, radSlider.value(), alphaSlider.value(), 10));
            }
        }
    }
}

class Particle {

    constructor(g, x, y, r, a, speed) {
        this.g = g;
        this.pos = createVector(x, y);
        this.r = r;
        this.col = color(0,0,0);
        this.alpha = a;
        this.speed = speed;
    }

    update() {
        let rad = random(0, TWO_PI);
        let angleVect = p5.Vector.fromAngle(rad, this.speed);
        this.pos.add(angleVect);
    }

    draw() {
        this.col = color(this.g.get(this.pos.x, this.pos.y));
        this.col.setAlpha(this.alpha);
        push();
            translate(this.pos);
            noStroke();
            fill(this.col);
            circle(0, 0, this.r*2);

        pop();
    }

}

class Ant {

    constructor(g, a) {
        this.g = g;
        this.position = createVector(random(0, width), random(0, height));
        this.life = random(0, LIFE_SPAN);
        this.deaths = 0;
        this.alpha = a;
    }

    update() {

        //creates direction of movement
        let noiseVal = noise(this.position.x*noiseScale.value(), this.position.y*noiseScale.value(), this.deaths);
        let rad = map(noiseVal, 0, 1, 0, TWO_PI);
        let angleVect = p5.Vector.fromAngle(rad, 2);

        //determines color
        let col = color(this.g.get(this.position.x, this.position.y));
        col.setAlpha(this.alpha);
        stroke(col);

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
