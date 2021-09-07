let trees = [];
function setup() {
    createCanvas(600, 600);
    angleMode(DEGREES);
    //blendMode(SCREEN);
    colorMode(HSB, 360, 100, 100, 1);
    background(0);

    trees.push(new Tree(0, height/2));
    //ferns.push(new Fern(150, 500));

}

//draw loop
function draw() {

    for (var i = 0; i < 100; i++) {
        for(let tree of trees) {
            tree.draw();
        }
    }

    if(frameCount > 30*20) {
        noLoop();
    }

}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('flowers', 'png');
    } else if(key === 'r') {
        resetCan();
    }
}

function resetCan() {

    clear();
    background(0);
}

class Tree {

    constructor(x, y) {
        this.Ox = x;
        this.Oy = y;
        this.x = 0;
        this.y = 0;

    }

    draw() {
        let x = map(this.x, -.25, .25, 0, width);
        let y = map(this.y, -.25, .25, height, 0);
        console.log(this.x, this.y);
        push();
            translate(this.Ox, this.Oy);
            stroke(140, 89, 37);
            point(x, y);
        pop();

        let next;
        let rand = random(1);
        if(rand < .05) {
            next = this.f1();
        } else if(rand < .46) {
            next = this.f2();
        } else if(rand < .87) {
            next = this.f3();
        } else {
            next = this.f4();
        }

        this.x = next[0];
        this.y = next[1];

    }

    f1() {
        let next = [];
        let nx = 0;
        let ny = .5*this.y;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f2() {
        let next = [];
        let nx = .42*this.x + -.42*this.y;
        let ny = .42*this.x + .42*this.y + .2;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f3() {
        let next = [];
        let nx = .42*this.x + .42*this.y;
        let ny = -.42*this.x + .42*this.y + .2;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f4() {
        let nx = .1*this.x;
        let ny = .1*this.y + .2;
        let next = [];
        next.push(nx);
        next.push(ny);
        return next;
    }

}
