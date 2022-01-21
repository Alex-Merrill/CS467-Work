const NUM_AGENTS = 20;
let agents = [];


function setup() {
    createCanvas(700, 700);
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

    for(let agent of agents) {
        agent.distance(agents);
        agent.seek(createVector(mouseX, mouseY));
        agent.flee(createVector(width/2, height/2));
        agent.update();
        agent.draw();
    }
    rect(mouseX, mouseY, 5, 5);
    fill(82, 82, 82, 127);
    circle(mouseX, mouseY, 200);
    circle(width/2, height/2, 200);

}


class Agent{

    constructor(x, y){
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.maxSpeed = 3;
        this.maxForce = .1;
    }

    applyForce(force){
        this.acceleration.add(force);
    }

    distance(agents) {
        let closeAgents = [];
        let forces = [];
        for(let agent of agents) {
            if(agent != this) {
                let desired = p5.Vector.sub(this.position, agent.position);
                if(desired.magSq() < 1000) {
                    desired.normalize();
                    desired.mult(this.maxSpeed);
                    let steerForce = p5.Vector.sub(desired, this.velocity);
                    steerForce.limit(this.maxForce+.1);
                    this.applyForce(steerForce);
                }
            }
        }
    }

    seek(target) {
        //gets distance of target and agent
        let desired = p5.Vector.sub(target, this.position);
        //checks if wraparound is better path
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
        let d = desired.magSq();
        desired.normalize();
        d = map(d, 0, 10000, 0, this.maxSpeed);
        d = constrain(d, 0, this.maxSpeed);
        desired.mult(d);
        //creates proper force
        let steerForce = p5.Vector.sub(desired, this.velocity);
        steerForce.limit(this.maxForce);
        this.applyForce(steerForce);

    }

    flee(target) {
        //gets distance of target and agent
        let desired = p5.Vector.sub(this.position, target);
        //returns if agent is not within 100 of target
        let d = desired.magSq();
        if(d > 10000) {
            return;
        }
        desired.normalize();
        d = map(d, 0, 10000, 0, this.maxSpeed);
        d = constrain(d, 0, this.maxSpeed);
        desired.mult(d);
        //creates proper force
        let steerForce = p5.Vector.sub(desired, this.velocity);
        steerForce.limit(this.maxForce+.1); //adds .1 so they don't go through the middle or bounce harshly
        this.applyForce(steerForce);
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
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(-10, -5, -10, 5, 0, 0);
        pop();
    }

}
