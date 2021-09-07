
let collection = [];
let particles = [];

function setup() {
    createCanvas(700, 700);

    for(let i = 0; i < 3; i ++) {
        collection.push(new Robot(random(0, width), random(0, height)));
    }
}

function draw() {
    background(139, 217, 195);

    //update and draw bots, add any particle systems to particles on collision
    for(let bot of collection) {
        bot.seek(collection);
        particles = particles.concat(particles, bot.detectCollision(collection));
        bot.update();
        bot.draw();
    }

    //draw particles
    for(let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if(particles[i].dead) {
            particles.splice(i, 1);
        }
    }

    //delete extra particles
    if (particles.length > 10) {
        particles = [];
    }

}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}


//mandelbrot robot class
class Robot {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.maxSpeed = 3;
        this.maxForce = .1;
        this.maxIter = 50;
        //this.color = color(col);

        //creates mandelbrot set in an image to draw
        this.image = createImage(400, 200);
        this.image.loadPixels();
        for(let x = 0; x < this.image.width; x++) {
            for(let y = 0; y < this.image.height; y++) {
                let a = map(x, 0, this.image.width, -1.5, 1.5);
                let b = map(y, 0, this.image.height, -1.5, 1.5);

                let num = 0;;
                let ca = a;
                let cb = b;

                while(num < this.maxIter) {
                    let a2 = a*a - b*b;
                    let b2 = 2*a*b;
                    a = a2 + ca;
                    b = b2 + cb;

                    if(abs(a+b) > 16) {
                        break;
                    }
                    num++;
                }

                let bright = map(num, 0, this.maxIter, 0, 1);
                bright = map(sqrt(bright), 0, 1, 0, 255);
                //let bright;
                if(num === this.maxIter) {
                    bright = color(0);
                    //bright.setAlpha(0);
                } else if(bright < 150 && bright > 20){
                    bright = color(255);
                    bright.setAlpha(0);
                }
                this.image.set(x, y, bright);


            }
        }
        this.image.updatePixels();

    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        if (this.position.x > width){
            this.position.x -= width;
        }
        if (this.position.x < 0){
            this.position.x += width;
        }

        if (this.position.y > height){
            this.position.y -= height;
        }
        if (this.position.y < 0){
            this.position.y += height;
        }
    }

    detectCollision(collection) {
        let forces = [];
        let deeseParts = [];
        for(let bot of collection) {
            if(bot != this) {
                let d = p5.Vector.sub(this.position, bot.position);
                if(d.magSq() < 2000) {
                    let collPoint;
                    let half = p5.Vector.div(d, 2);
                    if(this.position.x > bot.position.x) {
                        collPoint = p5.Vector.sub(this.position, half);
                    } else {
                        collPoint = p5.Vector.add(this.position, half);
                    }
                    deeseParts.push(new ParticleSystem(collPoint.x, collPoint.y));
                    d.normalize();
                    d.mult(10);
                    forces.push(d);
                }
            }
        }

        for(let force of forces) {
            this.applyForce(force);
        }

        return deeseParts;

    }

    seek(collection) {
        let minV;
        let minD = 10000000;
        //finds  closest bot
        for(let bot of collection) {
            if(bot != this) {
                let d = p5.Vector.sub(bot.position, this.position);
                if(d.magSq() < minD) {
                    minV = d;
                }
            }
        }

        //creates velocity and force
        minV.normalize();
        minV.mult(this.maxSpeed);
        let steerForce = p5.Vector.sub(minV, this.velocity);
        steerForce.limit(this.maxForce);
        this.applyForce(steerForce);

    }

    draw() {
        push();
        translate(this.position.x, this.position.y+30);
        rotate(PI/2);
        imageMode(CENTER);
        image(this.image, 0, 0)
        pop();
    }

}

//particle class
class Particle{

    constructor(x, y) {
        this.position = createVector(x,y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.life = floor(random(50, 100));
        this.col;
        if(random(1) > .5) {
            this.col = color('red');
        } else {
            this.col = color('orange');
        }
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
        push();
        translate(this.position.x, this.position.y);
        noStroke();
        fill(this.col);
        circle(0,0, 2);
        pop();
    }

}

//particle system class
class ParticleSystem{

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.pool = [];
        this.dead = false;
    }

    update() {
        //creates new particles
        if(this.pool.length === 0) {
            for(let i = 0; i < 10; i++) {
                let rx = random(this.x - 5, this.x + 5);
                let ry = random(this.y - 5, this.y + 5);
                let particle = new Particle(rx, ry);
                this.particles.push(particle);

                //create force and apply
                const angle = random(0,360);
                const f = p5.Vector.fromAngle(radians(angle), random(2,3));
                particle.applyForce(f);

            }
        }

        this.particles.forEach((particle)=>{
            if(particle.life > 0) {
                particle.update();
            } else {
                this.pool.push(particle);
            }
        });

        if(this.particles.length === this.pool.length) {
            this.dead = true;
        }

    }

    draw() {
        this.particles.forEach((particle)=>{
            if(particle.life > 0) {
                particle.draw();
            }
        });
    }

}
