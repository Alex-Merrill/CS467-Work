
const MAX_BALLS = 300;
const MIN_BALLS = 10
let resetButton;
let bHoleF;
let nBalls;
let objSystem;
let xMouse;
let yMouse;


function setup() {
    cnv = createCanvas(800,800);
    frameRate(30);
    colorMode(HSB, 360, 100, 100, 1);

    //create blackhole slider
    bHoleF = createSlider(0, 400, 200, 2);
    bHoleF.position(20, height+95);

    //create number of balls slider
    nBalls = createSlider(MIN_BALLS, MAX_BALLS, 100, 1);
    nBalls.position(20, height+115);

    //create reset button
    resetButton = createButton('Reset');
    resetButton.position(20, height+140);
    resetButton.mousePressed(clearSystem);

    //forces
    let grav = createVector(0, 0);
    let wind = createVector(0, 0);
    let ballForces = [];
    for(let i = 0; i < MAX_BALLS; i++) {
        ballForces.push(createVector(random(-.2,.2), random(-.2,.2)));
    }

    //create System
    objSystem = new System(new Array(), new Array());
    let offset = 50;
    for(let i = 1; i <= MAX_BALLS; i++) {
        let ballForce = ballForces[i-1];
        let randomR = Math.floor(random(15, 40));
        let randomX = Math.floor(random(0+randomR+offset, width-randomR-offset));
        let randomY = Math.floor(random(0+randomR+offset, height-randomR-offset));
        let randomCol = color(Math.floor(random(150,200)), 100, 100, 1);
        let randomStroke = color(Math.floor(random(150,200)), 100, 100, 1);
        let randomWeight = Math.floor(random(2,15));

        let ball = new Ball(randomX, randomY, randomR, randomCol, randomStroke, randomWeight, ballForce);

        objSystem.addObject(ball);
    }

    objSystem.addForce(grav);
    objSystem.addForce(wind);

}

function draw() {
    background(300, 100, 100, 1);
    if(mouseIsPressed && xMouse > 0 && xMouse < width && yMouse > 0 && yMouse < height) {
        objSystem.addBlackHole(xMouse, yMouse);
    }
    objSystem.update(nBalls);
    objSystem.draw(nBalls);

}

class System {

    constructor(){
        this.objects = [];
        this.forces = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    addForce(force) {
        this.forces.push(force);
    }

    addBlackHole(xMouse, yMouse) {
        this.objects.forEach((obj)=>{
            obj.applyBlackHole(xMouse, yMouse);
        });
    }

    removeBlackHole() {
        this.objects.forEach((obj)=>{
            obj.removeBlackHole();
        });
    }

    update() {
        let i = 0;
        this.objects.forEach((obj)=>{
            if(i < nBalls.value()) {
                this.forces.forEach((force)=>{
                    obj.applyForce(force);
                });
                obj.update();
            }
            i++;

        });

    }

    draw() {
        let i = 0;
        this.objects.forEach((obj)=>{
            if(i < nBalls.value()) {
                obj.draw();
            }
            i++;
        });
    }

}

class Ball {

    constructor(x, y, r, color, stroke, strokeWeight, force) {
        this.radius = r;
        this.mass = r/10;
        this.color = color;
        this.stroke = stroke;
        this.strokeWeight = strokeWeight;
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.velocity.limit(10);
        this.acceleration = createVector(0,0);
        this.blackHole = createVector(0,0);
        this.force = force;
    }

    applyForce(force) {
        this.acceleration.add(this.force);
        this.acceleration.add(p5.Vector.div(force, this.mass));
        this.acceleration.add(this.blackHole);

    }

    applyBlackHole(xMouse, yMouse) {
        let mouseV = createVector(xMouse, yMouse);
        let v = p5.Vector.sub(mouseV, this.position);

        let magSq = v.magSq();
        magSq = constrain(magSq, 25, width);
        let vHat = v.normalize();

        let f = vHat.mult((bHoleF.value())/magSq);

        this.blackHole = f;
    }

    removeBlackHole() {
        this.blackHole = createVector(0,0);
        this.acceleration.mult(0);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);



        if(this.position.x - this.radius - this.strokeWeight/2 < 0) {
            this.position.x = 0 + this.radius + this.strokeWeight/2;
            this.velocity.x *= -.9;
            //this.applyForce(createVector(-this.acceleration.x,0));
        }

        if(this.position.y - this.radius - this.strokeWeight/2 < 0 ) {
            this.position.y = 0 + this.radius + this.strokeWeight/2;
            this.velocity.y *= -.9;
            //this.applyForce(createVector(0,-this.acceleration.y));
        }
        if(this.position.x + this.radius + this.strokeWeight/2 > width) {
            this.position.x = width - this.radius - this.strokeWeight/2;
            this.velocity.x *= -.9;
            //this.applyForce(createVector(-this.acceleration.x,0));
        }

        if(this.position.y + this.radius + this.strokeWeight/2 > height ) {
            this.position.y = height - this.radius - this.strokeWeight/2;
            this.velocity.y *= -.9;
            //this.applyForce(createVector(0,-this.acceleration.y));
        }

        this.acceleration.mult(0);

    }

    draw() {
        fill(this.color);
        strokeWeight(this.strokeWeight);
        stroke(this.stroke);
        circle(this.position.x, this.position.y, this.radius*2);
        //filter(BLUR);
    }

}

function mouseDragged(event) {

    xMouse = event.x - 8;
    yMouse = event.y - 8;


}

function mouseReleased() {
    if(xMouse > 0 && xMouse < width && yMouse > 0 && yMouse < height) {
        xMouse = 0;
        yMouse = 0;

        objSystem.removeBlackHole();
    }
}

function clearSystem() {

    //forces
    let grav = createVector(0,0);
    let wind = createVector(.001, -.001);
    let ballForces = [];
    for(let i = 0; i < MAX_BALLS; i++) {
        ballForces.push(createVector(random(-.5,.5), random(-.5,.5)));
    }

    //create System
    objSystem = new System(new Array(), new Array());
    let offset = 50;
    for(let i = 1; i <= MAX_BALLS; i++) {
        let ballForce = ballForces[i-1];
        let randomR = Math.floor(random(15, 40));
        let randomX = Math.floor(random(0+randomR+offset, width-randomR-offset));
        let randomY = Math.floor(random(0+randomR+offset, height-randomR-offset));
        let randomCol = color(Math.floor(random(150,200)), 100, 100, 1);
        let randomStroke = color(Math.floor(random(150,200)), 100, 100, 1);
        let randomWeight = Math.floor(random(2,15));

        let ball = new Ball(randomX, randomY, randomR, randomCol, randomStroke, randomWeight, ballForce);

        objSystem.addObject(ball);
    }

    objSystem.addForce(grav);
    objSystem.addForce(wind);
}
