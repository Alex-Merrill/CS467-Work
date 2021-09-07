//module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint;

const BALL_R = 20;
let toggle;
let ballStart;
let engine;
let world;
let boundaries = [];
let balls = [];
let pins;
let pedestal;


function setup() {
    createCanvas(800,400);
    colorMode(HSB, 360, 100, 100, 1);

    //create toggle for normal v. conceptual view
    //true = normal view
    //false = conceptual view
    toggle = true;

    //creates engine and sets world
    engine = Engine.create();
    world = engine.world;

    //sides
    boundaries.push(new Boundary(0, height/2, 10, height, PI));
    boundaries.push(new Boundary(width, height/2, 10, height, PI));


    //bottom and top
    boundaries.push(new Boundary(width/2, height, width, 10, 0));
    boundaries.push(new Boundary(width/2, 0, width, 10, 0));

    //create bowling ball
    ballStart = createVector(60, 335);
    let col = color(10, 98, 61);
    balls.push(new Ball(ballStart.x, ballStart.y, BALL_R, col));

    //create pedestal
    let options = {
        isStatic: true
    };
    pedestal = Bodies.rectangle(60, height-25, 20, 40, options);
    World.add(world, pedestal);

    //create pins
    pins = new Pins(400, 370, 5, 5);

}

function draw() {
    background(217, 15, 100);

    //update engine
    Engine.update(engine);

    //actual view
    if(toggle){
        //draw Boundaries
        for(let i = 0; i < boundaries.length; i++) {
            boundaries[i].draw();
        }

        //draws pedestal
        rectMode(CENTER);
        fill(128, 97, 40);
        rect(pedestal.position.x, pedestal.position.y, 20, 40);
    }

    //update and draw balls and pins
    balls.forEach((ball) => {
        ball.update();
        if(toggle) {
            ball.draw();
        }
    });
    pins.update();
    pins.draw(toggle);


    //adds ball once previous one is shot and would not be overlapped
    let ballB = balls[balls.length-1].body;
    let d = dist(ballStart.x, ballStart.y, ballB.position.x, ballB.position.y);
    if(d > 21) {
        let col = color(10, 98, 61);
        balls.push(new Ball(ballStart.x, ballStart.y, BALL_R, col));
    }

}

function mousePressed() {
    let ball = balls[balls.length-1];
    let mouseV = createVector(mouseX, mouseY);
    let vect = p5.Vector.sub(mouseV, ballStart);
    vect.normalize();
    let fVect = vect.div(8);
    Matter.Body.applyForce(ball.body, ball.body.position, {x: fVect.x, y: fVect.y});
}

function keyTyped() {
    if(key === 's') {
        let ball = balls[balls.length-1];
        let rDeg = random(319.75, 320.5);
        let force = random(.1, .15);
        let fVect = p5.Vector.fromAngle(rDeg, force);
        Matter.Body.applyForce(ball.body, ball.body.position, {x: fVect.x, y: fVect.y});
    } else if(key === 'r') {
        restart();
    } else if(key === 'v') {
        toggle = !toggle;
    }
}

function restart() {
    //resets balls
    for(let ball of balls) {
        World.remove(world, ball.body);
    }
    balls = [];
    ballStart = createVector(60, 335);
    let col = color(10, 98, 61);
    balls.push(new Ball(ballStart.x, ballStart.y, BALL_R, col));

    //resets pins
    for(let pin of pins.pins) {
        World.remove(world, pin.body);
    }
    pins = new Pins(400, 370, 5, 5);
}

class Pins {

    constructor(x, y, rows, bRow) {
        this.pins = [];
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.bRow = bRow;
        this.pW = 25;
        this.pH = 60;

        let startX = this.x - (bRow*this.pW)/2 + this.pW/2;
        let startY = this.y;
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.bRow-row; col++) {
                let x1 = startX + row*this.pW/2 + col*this.pW;
                let y1 = startY - row*this.pH;
                let nPin = new Pin(x1, y1, this.pW, this.pH);
                this.pins.push(nPin);
            }
        }
    }

    update() {
        this.pins.forEach((pin) => {
            pin.update();
        });
    }

    draw(toggle) {
        this.pins.forEach((pin) => {
            if(toggle) {
                pin.drawA();
            } else {
                pin.drawB();
            }
        });
    }

}

class Pin {

    constructor(x, y, w, h) {
        this.oPos = createVector(x, y);
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        let options = {
            restitution: .75,
            friction: .025
        };
        this.body = Bodies.rectangle(this.pos.x, this.pos.y, this.w, this.h, options);
        World.add(world, this.body);
        this.angle = this.body.angle;
        this.hit = false;
    }

    update() {
        this.pos = this.body.position;
        this.angle = this.body.angle;
    }

    drawA() {
        push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);
            stroke(255);
            fill(217, 100, 43);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h);
        pop();
    }

    drawB() {
        let vel = createVector(this.body.velocity.x, this.body.velocity.y);
        vel = vel.magSq();
        push();
        translate(this.oPos.x, this.oPos.y);
        rotate(this.angle);
        strokeWeight(1);
        noFill();
        beginShape();
        for(let j = 0; j < TWO_PI; j += PI/180) {
            let xOff = cos(j);
            let yOff = sin(j);
            let r = noise(xOff*vel, yOff*vel);
            let col = map(r, .15, .8, 0, 360);
            r = map(r, .15, .8, 10, 15);
            let x = r * cos(j);
            let y = r * sin(j);
            stroke(col, 100, 100, 1);
            vertex(x, y);
        }
        endShape();
        pop();
    }

}

class Ball{

    constructor(x, y, r, col) {
        let options = {
            friction: .001,
            restitution: 1
        }
        this.r = r;
        this.col = col;
        this.pos = createVector(x, y);
        this.body = Bodies.circle(this.pos.x, this.pos.y, r, options);
        this.angle = this.body.angle;
        World.add(world, this.body);
    }

    update() {
        this.pos = this.body.position;
        this.angle = this.body.angle;
    }

    draw() {
        push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);
            noStroke();
            fill(this.col);
            circle(0, 0, this.r*2);
        pop();

    }

}

class Boundary {

    constructor(x, y, w, h, a) {
        let options = {
            friction: 0,
            angle: a,
            isStatic: true
        }
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    draw() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        noStroke();
        fill(0);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();

    }
}
