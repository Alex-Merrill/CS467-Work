//module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Events = Matter.Events;

let toggle;
let engine;
let world;
let crackSound;
let boundaries = [];
let glass;
const ROCK_R = 18;
let rocks = [];
let shatters = [];
let endCount;
let prevFC;

function preload() {
    crackSound = loadSound('sound.mp3');
}

//
//
//
//Delete engline.run(engine from setup (line37), put Engine.update(engine) in draw();
//MAKE GLASS BREAKING ANIMATION
//
//
//

function setup() {
    createCanvas(650,400);
    colorMode(HSB, 360, 100, 100, 1);
    angleMode(DEGREES);
    imageMode(CENTER);
    frameRate(30);
    noStroke();

    engine = Engine.create();
    world = engine.world;


    //ground
    boundaries.push(new Boundary(width/2, height, width, 10, 0));

    //stands
    boundaries.push(new Boundary(width*(5/6), height*(1/12), 20, height*(1/6), 0));
    boundaries.push(new Boundary(width*(5/6), height*(11/12), 20, height*(1/6), 0));

    //glass
    glass = new Glass(width*(5/6), height/2, 10, height*(2/3), 0);
    
    //rock
    rocks.push(new Rock(47, 360, ROCK_R));

    endCount = 30*23;
    toggle = true;
}



function draw() {
    //updates Engine
    Engine.update(engine);

    //sets background depending on view
    if(toggle){
        background(255);
    } else {
        background(194, 20, 90);
    }

    //resets simulation after 20 rocks
    if(frameCount <= endCount) {
        //updates cannonballs
        for(let i = 0; i < rocks.length; i++) {
            if(!rocks[i].shot) {
                let rDeg = random(319.75, 320.1);
                let force = random(.07, .085);
                let fVect = p5.Vector.fromAngle(rDeg, force);
                Matter.Body.applyForce(rocks[i].body, rocks[i].pos, {x: fVect.x, y: fVect.y});
                rocks[i].shoot();
                rocks[i].update();
                if(toggle) {
                    rocks[i].draw();
                }
            } else {
                rocks[i].update();
                if(toggle) {
                    rocks[i].draw();
                } else if(rocks[i].hit && !rocks[i].shattered) {
                    let x = random(135, 515);
                    let y = map(rocks[i].collPoint.y, height*(1/6), height*(5/6), 0, height);
                    let f = map(rocks[i].collSpd, 10, 20, 200, 800);
                    let colMap = map(f, 200, 800, 290, 360);
                    let col = color(colMap, 100, 100);
                    shatters.push(new Shatter(x, y, f, col, crackSound));
                    rocks[i].shattered = true;
                }
            }
        }

        //draws shatters if in conceptual view
        if(!toggle) {
            for(let i = 0; i < shatters.length; i++) {
                    shatters[i].create();
            }
        }

        //draws sides of glass if in conceptual view
        if(!toggle) {
            fill(255);
            rect(0, 0, 125, height);
            rect(525, 0, 125, height);
        }

        //draws floor, glass, stand, and cannon or conceptual glass
        if(toggle) {
            for(let i = 0; i < boundaries.length; i++) {
                boundaries[i].draw();
            }
            glass.draw();
            drawCannon();
        }

        //new rock every second
        if(frameCount%30 == 0 && rocks.length < 20) {
            rocks.push(new Rock(47, 360, ROCK_R));
        }

    } else {
            for(let rock of rocks) {
                World.remove(world, rock.body);
            }
            rocks = [];
            shatters = [];
            frameCount = 0;
    }

}


function drawCannon() {
    fill(50);
    rect(30, 360, 30, height/4);
    circle(45, 360, 50);
    circle(150, 320, 50);
    stroke(0);
    curve(20, 315, 25, 320, 30, 340, 30, 350);
    noStroke();
    stroke(52, 82, 100);
    line(24, 318, 23, 308);
    line(24, 318, 28, 311);
    line(24, 318, 32, 318);
    line(24, 318, 19, 311);
    line(24, 318, 16, 318);
    line(24, 318, 23, 328);
    line(24, 318, 28, 325);
    line(24, 318, 18, 325);
    noStroke();
    quad(45, 335, 50, 383, 155, 343, 150, 295);
}

function keyTyped() {
    if(key === "v") {
        toggle = !toggle;
        clear();
        for(let rock of rocks) {
            World.remove(world, rock.body);
        }
        rocks = [];
        shatters = [];
        redraw();
    }
}

class Rock{

    constructor(x, y, r) {
        let options = {
            mass: r/20,
            friction: .00001,
            restitution: .2
        }
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        this.pos = createVector(x,y);
        this.angle = this.body.angle;
        World.add(world, this.body);
        this.shot = false;
        this.hit = false;
        this.collSpd;
        this.collPoint;
        this.shattered = false;
    }

    draw() {
        this.pos = this.body.position;
        this.angle = this.body.angle;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        strokeWeight(1);
        stroke(255);
        fill(20);
        circle(0, 0, this.r*2);
        pop();

    }

    update() {
        this.pos = this.body.position;
        this.angle = this.body.angle;


        if(this.pos.x + this.r >= 530) {
            this.collision()
        }

    }

    collision() {
        if(!this.hit) {
            this.collSpd = max(10, this.body.speed);
            this.collPoint = this.pos;
        }
        this.hit = true;
    }

    shoot() {
        this.shot = true;
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

class Glass {

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
        this.life = 20;
    }

    draw() {
        let pos = this.body.position;
        let angle = this.body.angle;

        if(this.life > 0) {
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            noStroke();
            fill(194, 20, 90);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h);
            pop();
        } else {
            //PUT IN CRACK STUFF HERE
        }


    }
}

class Shatter {

    constructor(x, y, f, col = color(0, 2, 42), sound) {
        this.gW = 150;
        this.gH = 150;
        this.g = createGraphics(this.gW, this.gH);
        //this.g.clear();
        this.cracks = [];
        this.x = x;
        this.y = y;
        this.f = f;
        this.col = col;
        let numCracks = map(this.f, 200, 800, 15, 20);
        let life = map(this.f, 200, 800, 7, 10);
        for(let i = 0; i < numCracks; i++) {
            this.cracks.push(new Crack(this.g, this.gW/2, this.gH/2, this.f, this.col, life));
        }
        this.sound = sound;
        this.new = true;
        this.hasLife = true;
        this.drawn = false;
    }


    create() {

        while(this.hasLife === true) {
            this.update();

        }

        //create impact and play sound
        if(this.new === true) {
            let col = this.col;
            let alpha = map(this.f, 200, 800, .03, .05);
            this.g.push();
            this.g.translate(this.gW/2, this.gH/2);
            col.setAlpha(alpha);
            this.g.stroke(col);
            this.g.strokeWeight(4);
            this.g.fill(col);
            this.g.rotate(random(0, 360));
            let o = pow(this.f/200, 1.75);
            this.g.quad(-7-o, -5-o, 5+o, -5-o, 5+o, 7+o, -3-o, 3+o);
            this.g.pop();

            let vol = map(this.f, 200, 800, .1, 1);
            this.sound.setVolume(vol);
            this.sound.play();


            this.new = false;
        }

        image(this.g, this.x, this.y);
        this.drawn = true;


    }

    update() {
        //update cracks
        this.hasLife = false;
        for(let i = 0; i < this.cracks.length; i++) {
            //updates
            this.cracks[i].update();
            //makes new branch
            let pos = this.cracks[i].position;
            let life = this.cracks[i].life;
            let d = this.cracks[i].direction;
            if(life > 0 && random(0,life) > 2) {
                this.cracks.push(new Crack(this.g, pos.x, pos.y, this.f, this.col, life/4, d));
            }
            //keeps track of life of all cracks
            if(this.cracks[i].life > 0) {
                this.hasLife = true;
            }
        }
    }

}

class Crack {

    constructor(g, x, y, f, col, life = map(f, 100, 400, 7, 10), d = random(0, 360)) {
        this.g = g;
        this.position = createVector(x, y);
        this.direction = d;
        this.life = life;
        this.f = f;
        this.col = col;
    }

    update() {
        //only draws if crack has life
        if(this.life > 0) {
            //creates direction and length of movement based on mass
            let rDeg = random(this.direction-.75, this.direction+.75);
            let length = map(this.f, 200, 800, 3, 8);
            let angleVect = p5.Vector.fromAngle(rDeg, length);

            //determines alpha value based on velocity of impact
            let alpha = map(this.f, 200, 800, .04, .1);
            this.col.setAlpha(alpha);
            this.g.stroke(this.col);
            this.g.strokeWeight(1);

            //draws crack
            this.g.beginShape(LINES);
            this.g.vertex(this.position.x, this.position.y);
            this.position.add(angleVect);
            this.g.vertex(this.position.x, this.position.y);
            this.g.endShape();

            //slowly kills
            this.life--;
        }
    }

}
