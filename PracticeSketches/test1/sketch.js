let shatters = [];
let iterator;
let test;
let crackSound;


//
//
//
// MAKE COLOR BASED ON SOMETHING, PLAY WITH LOOK, ADD TO NEW1
//
//
//

function preload() {
    crackSound = loadSound('sound.mp3');
    console.log(crackSound);
}

function setup() {
    createCanvas(600,600);
    background(184, 219, 230);
    colorMode(HSB, 360, 100, 100, 1);
    imageMode(CENTER);
    soundFormats('mp3');
    angleMode(DEGREES);
    frameRate(1);
    test = 1;
    iterator = 0;

    //creates shatters
    for(let x = 0; x < 5; x++) {
        for(let y = 0; y < 5; y++) {
            let v = map(x, 0, 4, 100, 400);
            let m = map(y, 0, 4, .75, 1);
            let m1 = map(m, .75, 1, 100, 400);
            let f = v+m1;
            let colMap = map(v, 50, 450, 300, 360);
            let col = color(360, 100, 100);
            shatters.push(new Shatter(x*110+75, y*110+75, f, col, crackSound));
        }
    }

    // for(let i = 0; i < 20; i++) {
    //     let x = random(0+20, width-20);
    //     let y = random(0+20, height-20);
    //     let v = random(100, 400);
    //     let m = random(.75, 1);
    //     let f = m*v;
    //     let colMap = map(f, 100, 400, 300, 360);
    //     let col = color(360, 100, 100);
    //     shatters.push(new Shatter(x, y, f, col));
    // }


}

function draw() {
    fill(10);
    circle(100,100,100);
    shatters[iterator].create();
    iterator++;
}

class Shatter {

    constructor(x, y, f, col = color(0, 2, 42), sound) {
        this.gW = 150;
        this.gH = 150;
        this.g = createGraphics(this.gW, this.gH);
        this.g.clear();
        this.cracks = [];
        this.x = x;
        this.y = y;
        this.f = f;
        this.col = col;
        let numCracks = map(this.f, 200, 800, 15, 20);
        let life = map(this.f, 200, 800, 7, 10);
        for(let i = 0; i < numCracks; i++) {
            this.cracks.push(new Crack(this.g, this.gW/2, this.gH/2, this.f, this.col, life));
        }
        this.new = true;
        this.hasLife = true;
        this.sound = sound;
    }


    create() {
        //create impact
        if(this.new) {
            let col = this.col;
            let alpha = map(this.f, 200, 800, .03, .05);
            this.g.push();
            this.g.translate(this.gW/2, this.gH/2);
            col.setAlpha(alpha);
            this.g.stroke(col);
            this.g.strokeWeight(4);
            this.g.fill(col);
            this.g.rotate(random(0, 360));
            let o = pow(this.f/200, 1.75);
            this.g.quad(-7-o, -5-o, 5+o, -5-o, 5+o, 7+o, -3-o, 3+o);
            this.g.pop();
            this.new = false;
        }


        while(this.hasLife) {
            this.update();

        }

        image(this.g, this.x, this.y);


    }

    update() {
        //update cracks
        this.hasLife = false;
        for(let i = 0; i < this.cracks.length; i++) {
            //updates
            this.cracks[i].update();
            //makes new branch
            let pos = this.cracks[i].position;
            let life = this.cracks[i].life;
            let d = this.cracks[i].direction;
            if(life > 0 && random(0,life) > 5) {
                this.cracks.push(new Crack(this.g, pos.x, pos.y, this.f, this.col, life/4, d));
            }
            //keeps track of life of all cracks
            if(this.cracks[i].life > 0) {
                this.hasLife = true;
            }
        }
    }

}

class Crack {

    constructor(g, x, y, f, col, life = map(f, 100, 400, 7, 10), d = random(0, 360)) {
        this.g = g;
        this.position = createVector(x, y);
        this.direction = d;
        this.life = life;
        this.f = f;
        this.col = col;
    }

    update() {
        //only draws if crack has life
        if(this.life > 0) {
            //creates direction and length of movement based on mass
            let rDeg = random(this.direction-.75, this.direction+.75);
            let length = map(this.f, 200, 800, 3, 8);
            let angleVect = p5.Vector.fromAngle(rDeg, length);

            //determines alpha value based on velocity of impact
            let alpha = map(this.f, 200, 800, .04, .1);
            this.col.setAlpha(alpha);
            this.g.stroke(this.col);
            this.g.strokeWeight(1);

            //draws crack
            this.g.beginShape(LINES);
            this.g.vertex(this.position.x, this.position.y);
            this.position.add(angleVect);
            this.g.vertex(this.position.x, this.position.y);
            this.g.endShape();

            //slowly kills
            this.life--;
        }
    }

}
