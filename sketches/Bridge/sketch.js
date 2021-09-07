//module aliases
let Engine = Matter.Engine,
    //Render = ,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;

let engine;
let world;
let constraints = [];
let boundaries = [];
let boxes = [];
let circles = [];


function setup() {
  createCanvas(400, 400);

  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);

  //ground
  boundaries.push(new Boundary(width/2, height, width, 10, 0));
  //slopes
  // boundaries.push(new Boundary(width/2-width*.2, height/3, width*.8, 10, .3));
  // boundaries.push(new Boundary(width/2+width*.2, height*(2/3), width*.8, 10, -.3));
  //sides
  // boundaries.push(new Boundary(0, height/2, 10, height, PI));
  // boundaries.push(new Boundary(width, height/2, 10, height, PI));

  let prev = null;
  let bridgeHeight = 200;
  for(let i = 0; i <= 16; i++) {
      let p;
      if(i === 0) {
          let options = {
              friction: 0.00001,
              restitution: 1,
              isStatic: true
          }
          p = new Circle(0, bridgeHeight, 10, options);
          console.log(p.body.position.x);
          circles.push(p);
      } else if(i === 16) {
          let options = {
              friction: 0.00001,
              restitution: 1,
              isStatic: true
          }

          p = new Circle(400, bridgeHeight, 10, options);
          console.log(p.body.position.x);
          circles.push(p);
      } else {
          let options = {
              friction: 0.00001,
              restitution: 1,
              isStatic: false
          }
          p = new Circle(i*25, bridgeHeight, 10, options);
          circles.push(p);
      }


      if(prev) {
          let options = {
              bodyA: p.body,
              bodyB: prev.body,
              length: 20,
              stiffness: .08
          }

          let constraint = Constraint.create(options);
          constraints.push(constraint);
          World.add(world, constraint);
      }

      prev = p;
  }




}

function draw() {
    background(50);

    //draw boundaries
    for(let i = 0; i < boundaries.length; i++) {
        boundaries[i].draw();
    }

    //draw boxes
    for(let i = 0; i < boxes.length; i++) {
        boxes[i].draw();
    }

    //draw circles
    for(let i = 0; i < circles.length; i++) {
        circles[i].draw();
    }


    //draw constraints
    for(let i = 0; i < constraints.length; i++) {
        console.log(constraints[i]);
        let bodyA = constraints[i].bodyA;
        let bodyB = constraints[i].bodyB;
        strokeWeight(2);
        stroke(255, 0, 0);
        line(bodyA.position.x, bodyA.position.y, bodyB.position.x, bodyB.position.y);
    }

}

function mouseClicked() {
    let options = {
        restitution: 1
    }
    circles.push(new Circle(mouseX, mouseY, 20, options));
    //boxes.push(new Box(mouseX, mouseY, random(10, 50), random(10, 50)));
}

class Box{

    constructor(x, y, w, h) {
        let options = {
            friction: 0.001,
            restitution: .7
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
        strokeWeight(1);
        stroke(255);
        fill(127);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();

    }

    isOffScreen() {
        let pos = this.body.position;
        return pos.y > height+10 || pos.y < 0-10 || pos.x > width+10 || pos.x < 0-10;
    }

    removeFromWorld() {
        World.remove(world, this.body);
    }

}

class Circle{

    constructor(x, y, r, options) {
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

    isOffScreen() {
        let pos = this.body.position;
        return pos.y > height+10 || pos.y < 0-10 || pos.x > width+10 || pos.x < 0-10;
    }

    removeFromWorld() {
        World.remove(world, this.body);
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
