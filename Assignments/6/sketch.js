/*
  CS467 - Assignment Six: Social Distancing

  @name Alex Merrill

*/

const NUM_AGENTS = 20;
let agents = [];

let bee;
let flower1;
let flower2;
let flower3;
let flower4;
let flower5;

function preload() {
    flower1 = loadImage('flower1.png');
    flower2 = loadImage('flower2.png');
    flower3 = loadImage('flower3.png');
    flower4 = loadImage('flower4.png');
    flower5 = loadImage('flower5.png');
    bee = loadImage('bee.png');
}

function setup() {
    createCanvas(800, 800);
    ellipseMode(CENTER);

    //creates agents
    for(let i = 0; i < NUM_AGENTS; i++) {
        let x = random(0, width);
        let y = random(0, height);
        agents.push(new Agent(x, y));
    }

}

function draw() {
    background(255);

    //draw flowers
    drawFlowers();

    for(let agent of agents) {
        agent.applyBehavior(agents, "", "", 150, 100, 50, "", "", true);
        //agent.applyBehavior(agents, createVector(mouseX, mouseY), "", "", "", "", 500, "");
        agent.applyBehavior(agents, createVector(100, 100), "", "", "", "", 100, "", false);
        agent.applyBehavior(agents, createVector(700, 700), "", "", "", "", 100, "", false);
        agent.applyBehavior(agents, createVector(100, 700), "", "", "", "", 100, "", false);
        agent.applyBehavior(agents, createVector(700, 100), "", "", "", "", 100, "", false);
        agent.applyBehavior(agents, createVector(400, 400), "", "", "", "", 100, "", false);
        agent.update();
        agent.draw();
    }

}

//draws flowers
function drawFlowers() {
    push();
    imageMode(CENTER);
    translate(100, 100);
    image(flower1, 0, 0, 100, 100);
    pop();

    push();
    imageMode(CENTER);
    translate(700, 700);
    image(flower2, 0, 0, 150, 250);
    pop();

    push();
    imageMode(CENTER);
    translate(100, 700);
    image(flower3, 0, 0);
    pop();

    push();
    imageMode(CENTER);
    translate(700, 100);
    image(flower4, 0, 0, 150, 200);
    pop();

    push();
    imageMode(CENTER);
    translate(400, 400);
    image(flower5, 0, 0);
    pop();
}

class Agent{

    constructor(x, y){
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.maxSpeed = 3;
        this.maxForce = .1;
    }

    //applies force on bird
    applyForce(force){
        this.acceleration.add(force);
    }

    applyBehavior(agents, sT, fT, d, c, a, s, f, wanDer) {
        //applies behaviors
        let dist = createVector(0, 0);
        let coh = createVector(0, 0);
        let al = createVector(0, 0);
        let sek = createVector(0, 0);
        let fle = createVector(0, 0);
        let wan = createVector(0, 0);
        if(d != "") {
            dist = this.distance(agents, d);
        }
        if(c != "") {
            coh = this.cohesion(agents, c);
        }
        if(a != "") {
            al = this.align(agents, a);
        }
        if(s != "") {
            sek = this.seek(sT, s);
        }
        if(f != "") {
            fle = this.flee(fT, f);
        }
        if(wanDer) {
            wan = this.wander();
        }

        //manipulates behavior forces
        dist.mult(1.5);
        coh.mult(.75);
        al.mult(1);
        sek.mult(1.5);
        fle.mult(1);
        wan.mult(1);

        this.applyForce(dist);
        this.applyForce(coh);
        this.applyForce(al);
        this.applyForce(sek);
        this.applyForce(fle);
        this.applyForce(wan);

    }

    //maints dist between birds
    distance(agents, dist) {
        let sum = createVector(0, 0);
        let count = 0;
        for(let agent of agents) {
            let d = p5.Vector.dist(this.position, agent.position);
            if(d > 0 && d < dist) {
                let desired = p5.Vector.sub(this.position, agent.position);
                desired.normalize();
                desired.div(d);
                sum.add(desired);
                count++;
            }
        }

        if(count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steerForce = p5.Vector.sub(sum, this.velocity);
            steerForce.limit(this.maxForce);
            return steerForce;
        } else {
            return createVector(0, 0);
        }
    }

    //if birds get within certain distance, they become attracted to eachother
    cohesion(agents, dist) {
        let sum = createVector(0, 0);
        let count = 0;
        for(let agent of agents) {
            let d = p5.Vector.dist(this.position, agent.position);
            if(d > 0 && d < dist) {
                sum.add(agent.position);
                count++;
            }
        }

        //gets avg position and applys force
        if(count > 0) {
            sum.div(count);
            return this.seek(sum, dist);
        } else {
            return createVector(0, 0);
        }
    }

    //aligns birds within dist
    align(agents, dist) {
        let sum = createVector(0,0);
        let count = 0;
        for(let agent of agents) {
            let d = p5.Vector.dist(this.position, agent.position);
            if(d > 0 && d < dist) {
                sum.add(agent.velocity);
                count++;
            }
        }

        if(count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);

            let steerForce = p5.Vector.sub(sum, this.velocity);
            steerForce.limit(this.maxForce);
            return steerForce;
        } else {
            return createVector(0, 0);
        }
    }

    //applies random force to birds to simulate wandering
    wander() {
        //create random force in direction of heading give or take 30 deg
        //apply force
        let heading = this.velocity.heading();
        let randAng = random(heading - PI/10, heading + PI/10);
        let newVel = p5.Vector.fromAngle(randAng);
        newVel.mult(this.maxSpeed);

        let steerForce = p5.Vector.sub(newVel, this.velocity);
        steerForce.limit(this.maxForce);
        return steerForce;
    }

    //bird becomes attracted to target
    seek(target, dist) {
        //gets distance of target and agent
        let d = p5.Vector.dist(target, this.position);
        if(d > 0 && d < dist) {
            //checks if wraparound is better path
            let desired = p5.Vector.sub(target, this.position);
            if(abs(desired.x) > width/2) {
                if(desired.x >= 0) {
                    desired.x -= width;
                } else {
                    desired.x += width;
                }
            }
            if(abs(desired.y) > height/2) {
                if(desired.y >= 0) {
                    desired.y -= height;
                } else {
                    desired.y += height;
                }
            }
            //slows agent if closer than 100
            desired.normalize();
            d = map(d, 0, 200, 0, this.maxSpeed);
            d = constrain(d, 0, this.maxSpeed);
            desired.mult(d);
            //creates proper force
            let steerForce = p5.Vector.sub(desired, this.velocity);
            steerForce.limit(this.maxForce);
            return steerForce;
        } else {
            return createVector(0, 0);
        }
    }

    //bird stays away from target if within dist
    flee(target, dist) {
        //gets distance of target and agent
        let desired = p5.Vector.sub(this.position, target);
        //returns if agent is not within 100 of target
        let d = p5.Vector.dist(this.position, target);
        if(d > dist) {
            return;
        }
        desired.normalize();
        d = map(d, 0, dist, this.maxSpeed, this.maxSpeed/2);
        d = constrain(d, this.maxSpeed/2, this.maxSpeed);
        desired.mult(d);
        //creates proper force
        let steerForce = p5.Vector.sub(desired, this.velocity);
        steerForce.limit(this.maxForce);
        return steerForce;
    }

    update(){
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

    draw(){
        stroke(0);
        fill(200);
        push();
        imageMode(CENTER);
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading()+PI*(6/5));
        image(bee, 0, 0, 75, 75);
        pop();
    }

}
