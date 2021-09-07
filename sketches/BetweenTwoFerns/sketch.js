let ferns = [];

function setup() {
    createCanvas(600, 600);
    angleMode(DEGREES);
    blendMode(SCREEN);
    colorMode(HSB, 360, 100, 100, 1);
    background(0);

    ferns.push(new Fern(450, 500));
    ferns.push(new Fern(150, 500));

}

//draw loop
function draw() {

    for (var i = 0; i < 100; i++) {
        for(let fern of ferns) {
            fern.draw();
        }
    }

    if(frameCount > 30*20) {
        noLoop();
    }

}



//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('Fractal', 'png');
    } else if(key === 'r') {
        resetCan();
    }
}

function resetCan() {

    clear();
    background(0);
}

class Fern {

    constructor(x, y) {
        this.Ox = x;
        this.Oy = y;
        this.x = 0;
        this.y = 0;

    }

    draw() {
        let x = map(this.x, -4, 4, -200, 200);
        let y = map(this.y, -4, 4, height, 0);
        //console.log(x, y);
        push();
            translate(this.Ox, this.Oy);
            stroke(140, 89, 37);
            point(x, y);
        pop();

        let next;
        let rand = random(1);
        if(rand < .01) {
            next = this.f1();
            // console.log("1");
        } else if(rand < .86) {
            next = this.f2();
            // console.log("2");
        } else if(rand < .93) {
            next = this.f3();
            // console.log("3");
        } else {
            next = this.f4();
            // console.log("4");
        }

        this.x = next[0];
        this.y = next[1];

    }

    f1() {
        let next = [];
        let nx = 0;
        let ny = .16*this.y;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f2() {
        let next = [];
        let nx = .85*this.x + .04*this.y;
        let ny = -.04*this.x + .85*this.y + 1.6;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f3() {
        let next = [];
        let nx = .2*this.x + -.26*this.y;
        let ny = .23*this.x + .22*this.y + 1.6;
        next.push(nx);
        next.push(ny);
        return next;
    }

    f4() {
        let nx = -.15*this.x + .28*this.y;
        let ny = .26*this.x + .24*this.y + .044;
        let next = [];
        next.push(nx);
        next.push(ny);
        return next;
    }

}
