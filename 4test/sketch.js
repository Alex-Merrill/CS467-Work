//module aliases
let Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Constraint = Matter.Constraint;

let engine;
let world;
let boundaries = [];
let pedestal;
let ball;
let pins = [];


function setup() {
    createCanvas(800, 400);

    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    //ground
    boundaries.push(new Boundary(0, height/2, 10, height, PI));


    //sides
    boundaries.push(new Boundary(width/2, height, width, 10, 0));
    boundaries.push(new Boundary(width/2, 0, width, 10, 0));

    //create bowling ball
    let r = 20
    ball = new Ball(r+40, height-80, r);

    pedestal = Bodies.rectangle(r+40, height-20, 20, 20);
    World.add(world, pedestal);

    // for(let i = 0; i < 4; i++) {
    //     for(let j = 0; j < 4-i; j++) {
    //         let pin = new Ball()
    //     }
    // }


}

function draw() {
    background(255);
    for(let i = 0; i < boundaries.length; i++) {
        boundaries[i].draw();
    }
    rectMode(CENTER);
    fill(0);
    rect(pedestal.position.x, pedestal.position.y, 20, 20);
    ball.draw();

}

class Pins {

    constructor() {

    }

}


class Ball{

    constructor(x, y, r) {
        let options = {
            friction: .001,
            restitution: 1
        }
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }

    draw() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        strokeWeight(1);
        stroke(255);
        fill(127);
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
