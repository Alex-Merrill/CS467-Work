/*
  CS467 - Assignment Seven: Ecosystem

  @name Alex Merrill

*/

/*
    NOTES:
    -maybe set x,y coords in setup, and send them to ALife. Do this so you can send a parent
    position or maybe some sort of avg to child so balls aren't moving around everywhere.
    -Maybe scrap this and do something abstract, this is not gonna look good
    -This essentially an engine that can have types of similar creature,
    maybe you can do a transformation from a circle to different creatures
    depending on how good its fitscore is, so they branch off of eachother.
    -in line with^, have them all start in the middle and wander around.
        -maybe if there is x number of creatures in the area they can start reproducing
        -maybe narrow possible mutations to a range near its current value

*/

//global variables
const POPULATION = 5;
const TYPES = ["M", "P", "R"];
const TYPE_LOC = [150, 450, 750];
const M_IDEAL = [60, 45, 27, 50];
const P_IDEAL = [83, 38, 71, 75];
const O_IDEAL = [96, 83, 50, 100];
const MUTATION_RATE = .005;

let mountain;
let plateau;
let river;
let pool;
let crabM;
let crabP;
let crabR;

//p5 preload function to load in images
function preload() {
    mountain = loadImage('mountain.jpg');
    plateau = loadImage('plateau.jpg')
    river = loadImage('river.png');
    crabM = loadImage('crabM.png');
    crabP = loadImage('crabP.png');
    crabR = loadImage('crabR.png');
}


//p5 setup function
function setup() {
    createCanvas(600, 900);
    colorMode(HSB, 360, 100, 100, 1);
    frameRate(5);

    //create and initialize pool
    pool = Array(POPULATION);

    for(let i = 0; i < pool.length; i++) {
        //genes are formatted like: [H, S, B, Size]
        let genes = [floor(random(360)), floor(random(101)), floor(random(101)), floor(random(50, 100))];
        let type = random(TYPES);
        pool[i] = new ALife(genes, type);
    }

}


//p5 draw function
function draw() {
    background(255);

    //draws scenery
    drawScenery();

    //evolution
    evaluate(pool);
    const breedingPool = createBreedingPool(pool);
    pool = breed(breedingPool);


}

function drawScenery() {
    image(plateau, 0, 300, width, 300);
    image(mountain, 0, 0, width, 300);
    image(river, 0, 600, width, 300);
}

//creates fitness score for each ALife
//draws ALife
function evaluate(pool){

    // evaluate (draw each square and see how close it is)
    for(let creature of pool) {

        //calculate fitness score
        let fitScore = calcDist(creature);
        fitScore = 390 - fitScore;
        fitScore = map(fitScore, 0, 390, 0, 1);
        fitScore = pow(fitScore, 2);
        creature.score = fitScore;


        //draw creature
        creature.draw();

    }

}

//Calculates fitness score
function calcDist(creature) {
    let score;
    if(creature.type === "M") {
        let a = pow(creature.genes[0] - M_IDEAL[0], 2);
        let b = pow(creature.genes[1] - M_IDEAL[1], 2);
        let c = pow(creature.genes[2] - M_IDEAL[2], 2);
        let d = pow(creature.genes[3] - M_IDEAL[3], 2);
        score = sqrt(a + b + c + d);
    } else if(creature.type === "P") {
        let a = pow(creature.genes[0] - P_IDEAL[0], 2);
        let b = pow(creature.genes[1] - P_IDEAL[1], 2);
        let c = pow(creature.genes[2] - P_IDEAL[2], 2);
        let d = pow(creature.genes[3] - P_IDEAL[3], 2);
        score = sqrt(a + b + c + d);
    } else {
        let a = pow(creature.genes[0] - O_IDEAL[0], 2);
        let b = pow(creature.genes[1] - O_IDEAL[1], 2);
        let c = pow(creature.genes[2] - O_IDEAL[2], 2);
        let d = pow(creature.genes[3] - O_IDEAL[3], 2);
        score = sqrt(a + b + c + d);
    }

    return score;
}

//creates a breeding pool using fitness scores of ALife in pool
function createBreedingPool(pool){

    let breedingPool = [];

    //fill the breeding pool
    for(let i = 0; i < pool.length; i++) {

        let fitScore = floor(pool[i].score*100);
        for(let j = 0; j < fitScore; j++) {
            breedingPool.push(pool[i]);
        }
    }

    return breedingPool;
}

//uses breeding pool to breed ALife
//returns new pool which forms next generation
function breed(breedingPool){
    const newPool = Array(POPULATION);

    //fill in the new pool
    for(let i = 0; i < newPool.length; i++) {
        let p1 = random(breedingPool);
        let p2 = random(breedingPool);
        let child = p1.crossover(p2);
        child.mutate(MUTATION_RATE);
        newPool[i] = child;
    }

    return newPool;
}

//ALife class defines ALife
class ALife {

    constructor(genes, type, ) {
        this.genes = genes;
        this.type = type;
        let x;// = random(width);
        let y;// = random(height);
        if(type === "M") {
            x = random(width);
            y = random(75, 200);
        } else if(type === "P") {
            x = random(width);
            y = random(425, 550);
        } else {
            x = random(width);
            y = random(800, 875);
        }
        this.position = createVector(x, y);
        this.score = undefined;
    }

    //reproduction between this ALife and another, parent2
    crossover(parent2){
        let cGenes = Array(this.genes.length);
        let mid = floor(random(this.genes.length));
        for(let i = 0; i < this.genes.length; i++) {
            if(i < mid) {
                cGenes[i] = this.genes[i];
            } else {
                cGenes[i] = parent2.genes[i];
            }
        }

        return new ALife(cGenes, this.type);
    }

    //mutates genome
    mutate(mutationRate){
        //H
        let mutation = floor(random(360));
        let ran = random(1);
        if(ran < mutationRate) {
            this.genes[0] = mutation;
        }

        //S
        mutation = floor(random(101));
        ran = random(1);
        if(ran < mutationRate) {
            this.genes[1] = mutation;
        }

        //B
        mutation = floor(random(101));
        ran = random(1);
        if(ran < mutationRate) {
            this.genes[2] = mutation;
        }

        //Size
        mutation = floor(random(50, 100));
        ran = random(1);
        if(ran < mutationRate) {
            this.genes[3] = mutation;
        }

    }

    draw() {
        // push();
        // translate(this.position.x, this.position.y);
        // fill(this.genes[0], this.genes[1], this.genes[2]);
        // circle(0, 0, this.genes[3]);
        // pop();

        push();
        translate(this.position.x, this.position.y);
        imageMode(CENTER);
        if(this.type === 'M') {
            image(crabM, 0, 0, this.genes[3], this.genes[3]*.75);
        } else if(this.type === 'P') {
            image(crabP, 0, 0, this.genes[3], this.genes[3]*.75);
        } else {
            image(crabR, 0, 0, this.genes[3], this.genes[3]*.75);
        }
        pop();

    }


}
