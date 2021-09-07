const GRAVF = -10;
const SPAWN = 40;
let system;
let i;



function setup() {
    createCanvas(600,600);
    colorMode(HSB, 360, 100, 100);
    frameRate(30);
    noFill();
    i = 0;
    let grav = new GravHole(0, 0, GRAVF);

    system = new DiscSystem(0, 0, grav);

}

function draw() {
    background(0);
    translate(width/2, height/2);
    rotate(i/30);
    system.update(i);
    system.draw();
    i++;
}

class DiscSystem{

    constructor(x, y, grav) {
        this.x = x;
        this.y = y;
        this.discs = [];
        this.pool = [];
        this.grav = grav;
    }

    update(i) {

        //create new disc
        if(i%3 == 0) {
            let disc;
            if(this.pool.length === 0) {
                let col = color(random(190, 360), 100, 100);
                disc = new Disc(col);
                this.discs.push(disc);
            } else {
                disc = this.pool.pop();
                disc.life = 75;
                disc.r = 2;
                disc.velocity.mult(0);
            }

            //set position
            disc.position.x = random(this.x-SPAWN, this.x+SPAWN);
            disc.position.y = random(this.y-SPAWN, this.y+SPAWN);;

            //create force and apply
            const angle = random(0,360);
            const f = p5.Vector.fromAngle(radians(angle), random(.5,2));
            disc.applyForce(f);
        }

        this.discs.forEach((disc)=>{
            if(disc.life > 0) {
                disc.applyForce(this.grav.calc(disc));
                disc.update();
            } else {
                this.pool.push(disc);
            }
        });

    }

    draw() {
        this.discs.forEach((disc)=>{
            if(disc.life > 0) {
                disc.draw();
            }
        });
    }

}

class Disc{

    constructor(color) {
        this.position = createVector(0,0);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.col = color;
        this.r = 1;
        this.life = 75;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.r += .1;
        this.life--;

    }

    draw() {
        stroke(this.col);
        circle(this.position.x, this.position.y, this.r*2);
    }

}

class GravHole {

    constructor(x, y, grav) {
        this.position = createVector(x,y);
        this.grav = grav;
    }

    calc(disc) {
        let v = p5.Vector.sub(this.position, disc.position);
        let magSq = v.magSq();
        let vHat = v.normalize();

        let f;
        if(magSq == 0) {
            f = createVector(0,0);
        } else {
            f = vHat.mult((this.grav)/magSq);
        }

        return f;
    }

}
