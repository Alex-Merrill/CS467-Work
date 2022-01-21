let system;
let attract;
let smoke;
let attractStrength;
let gravityCheck;


function setup() {
    createCanvas(640, 480);
    colorMode(RGB, 255, 255, 255, 100);

    //create system
    system = new ParticleSystem(width/2, height);


    //create attractor strength slider
    attractStrength = createSlider(-2000, 2000, 0, 1);
    attractStrength.position(20, height + 30);

    //create attractor
    attract = new Attractor(attractStrength.value());

    //create gravity checkBox
    gravityCheck = createCheckbox('Gravity', false);
    gravityCheck.position(200, height + 30);
    gravityCheck.changed(gravityCheckEvent);

    //create smoke sprite
    smoke = createGraphics(25, 25);
    drawSmoke(smoke);
}

function draw() {
    background(0);

    //check to see if mouse is on canvas
    if(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        attract.position.x = mouseX;
        attract.position.y = mouseY;
    } else {
        attract.position.x = undefined;
        attract.position.y = undefined;
    }

    //add attractor force
    attract.strength = attractStrength.value();
    system.addForce(attract);

    //update and draw particleSystem
    system.update();
    system.draw();

    //remove attractor force
    system.removeForce();
}

function drawSmoke(g) {
    g.clear();
    for(let i = 0; i < g.width; i++) {
        for(let j = 0; j < g.height; j++) {
            let d = Math.sqrt(Math.pow(i - g.width/2, 2) + Math.pow(j - g.width/2, 2));
            d = constrain(d, 0, 16);
            g.stroke(140, 134, 132, 16 - d);
            g.point(i,j);
        }
    }

}

function gravityCheckEvent() {
    if(this.checked()) {
        system.addForce({name:'gravity',
            base: createVector(0,0.035),
            calc: function() {return this.base}
        });
    } else {
        system.removeForce();
    }
}

class ParticleSystem{

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.pool = [];
        this.forces = [];
    }

    addForce(force) {
        this.forces.push(force);
    }

    removeForce() {
        this.forces.pop();
    }

    update() {
        //creates new particles
        for(let i = 0; i < 30; i++) {

            //create new particle
            let particle;
            if(this.pool.length === 0) {
                particle = new Particle();
                this.particles.push(particle);
            } else {
                particle = this.pool.pop();
                particle.life = random(50, 200);
                particle.velocity.mult(0);
            }

            //set position
            particle.position.x = random(this.x-20, this.x+20);
            particle.position.y = this.y;

            //create force and apply
            const angle = random(250,290);
            const f = p5.Vector.fromAngle(radians(angle), random(1,3));
            particle.applyForce(f);

        }

        this.particles.forEach((particle)=>{
            if(particle.life > 0) {
                this.forces.forEach((force)=>{
                    particle.applyForce(force.calc(particle));
                });
                particle.update();
            } else {
                this.pool.push(particle);
            }
        });

    }

    draw() {
        this.particles.forEach((particle)=>{
            if(particle.life > 0) {
                particle.draw();
            }
        });
    }

}

class Particle{

    constructor() {
        this.position = createVector(0,0);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.life = random(50, 200);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.life--;
    }

    draw() {
        stroke(0, 0, 0);
        fill(255, 255, 255, this.life);
        image(smoke, this.position.x, this.position.y);
    }

}

class Attractor {

    constructor(strength) {
        this.strength = strength;
        this.position = createVector(0,0);
    }

    calc(particle) {
        let v = p5.Vector.sub(this.position, particle.position);
        let magSq = v.magSq();
        let vHat = v.normalize();

        let f;
        if(magSq == 0) {
            f = createVector(0,0);
        } else {
            f = vHat.mult((this.strength)/magSq);
        }

        return f;
    }

}
