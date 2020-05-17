

const NUM_CREATURES = 2;
let life = [];

//p5.js setup function
function setup() {
    createCanvas(700, 700);
    colorMode(HSB, 360, 100, 100, 1);


    //creates ALife
    for(let i = 0; i < NUM_CREATURES; i++) {
        //genes are formatted like: [# of cells, size, hue];
        let genes = [1, floor(random(5, 11)), floor(random(0, 360))];
        let position = createVector(floor(random(width*(1/3), width*(2/3))), floor(random(height*(1/3), height*(2/3))))
        life.push(new ALife(genes, position));
    }



}

//p5.js draw function
function draw() {
    background(255);

}

class ALife {

    constructor(genes, position) {
        this.genes = genes;
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.position = position;
        this.score = this.genes[0]*this.genes[1];
        this.maxSpeed = 1;
        this.maxForce = .1;
    }

    //reproduces by reproducing with closest creature
    reproduce(life) {
        //puts all creatures within 100px into closest
        let closest = [];
        for(let aLife of life) {
            if(aLife != this) {
                if(p5.Vector.dist(this.position, aLife.position) < 100) {
                    closest.push(aLife);
                }
            }
        }

        //gets creature with highest fitness score from closest
        let maxI = 0;
        let maxScore = 0;
        for(let i = 0; i < closest.length; i++) {
            if(closest[i].score > maxScore) {
                maxI = i;
                maxScore = closest[i].score;
            }
        }
        let parent = closest[maxI];

        //returns child ALife
        if(parent != null && random(1) < .005) {
            let newGenes = [];
            newGenes[0] = this.genes[0] + parent.genes[0];
            newGenes[0] = constrain(newGenes[0], 1, 10);
            newGenes[1] = (this.genes[1] + parent.genes[1])/2;
            if(this.score > parent.score) {
                newGenes[2] = this.genes[2];
            } else {
                newGenes[2] = parent.genes[2];
            }
            let midX = (this.position.x + parent.position.x)/2;
            let midY = (this.position.y + parent.position.y)/2;
            let position = createVector(midX, midY);
            console.log("reproduced");
            return new ALife(newGenes, position);
        } else {
            return null;
        }
    }

    //applies force on ALife
    applyForce(force){
        this.acceleration.add(force);
    }

    //wander function to allow creatures to move around at random
    wander() {
        let heading = this.velocity.heading();
        let randAng = random(heading - PI/10, heading + PI/10);
        let newVel = p5.Vector.fromAngle(randAng);
        newVel.mult(this.maxSpeed);

        let steerForce = p5.Vector.sub(newVel, this.velocity);
        steerForce.limit(this.maxForce);
        this.applyForce(steerForce);
    }

    update(){
        //updates velocity, position, and acceleration
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        //wraps around if ALife reaches edge
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

    draw() {

    }

}
