const vect = p5.Vector;

const NUM_CIRCS = 400;
const NCET = 100;

let circDensity;
let resetB;
let alphaSlider;
let input;
let img;
let circs = [];
let validCoords = [];
let doneGrowing = false;


//do with user input image

function setup() {
    createCanvas(800, 400);
    frameRate(200);
    colorMode(HSB, 360, 100, 100, 1);

    input = createFileInput(handleImg);
    input.position(20, height+20);

    resetB = createButton("Reset");
    resetB.position(20, height + 85);
    resetB.mousePressed(resetDraw);

    circDensity = createSlider(1, 30, 20, 1);
    circDensity.position(20, height+45);

    alphaSlider = createSlider(0, 1, .5, .05);
    alphaSlider.position(20, height + 65);


    // //get valid coords for circle
    // for(let i = 0; i < TWO_PI*10; i += PI/180) {
    //     let ra = 15*i;
    //     let rb = 20*i;
    //     let x1 = ra*cos(i) + width/2;
    //     let y1 = ra*sin(i) + height/2;
    //     let x2 = rb*cos(i) + width/2;
    //     let y2 = rb*sin(i) + height/2;
    //     let arr = [createVector(x1, y1), createVector(x2, y2)];
    //     validCoords.push(arr);
    // }

}

function draw() {
    clear();


    if(circs.length > 0) {
        if(!doneGrowing) {
            doneGrowing = true;
            //draws circles
            for(let circ of circs) {
                circ.draw();
                if(circ.growing) {
                    //if(circ.checkEdges()) {
                        for(circ1 of circs) {
                            if(circ != circ1) {
                                circ.checkCirc(circ1);
                            }
                        }
                    //}
                }
                if(circ.growing) {
                    circ.grow();
                    doneGrowing = false;
                }
            }
        } else {
            for(let circ of circs) {
                circ.draw();
            }
        }

        //puts picture on right side
        let aspect = img.width/img.height;
        if(aspect >= 1) {
            fill(255);
            noStroke();
            rect(0, 0, width, (height-img.height)/2);
            rect(0, height - (height-img.height)/2, width, (height-img.height)/2);
            image(img, width/2, (height-img.height)/2);
        } else {
            fill(255);
            noStroke();
            rect(0, 0, ((width/2)-img.width)/2, height);
            rect(img.width+ ((width/2)-img.width)/2, 0, ((width/2)-img.width)/2, height);
            image(img, width/2 + ((width/2)-img.width)/2, 0);
        }
    }

    // if(img) {
    //     let rate = 0;
    //     for(let i = 0; i < circDensity.value(); i++) {
    //         let newCirc = createCircle();
    //         if(newCirc != null) {
    //             circs.push(newCirc);
    //             rate++;
    //         }
    //     }
    //     if(rate < 1) {
    //         console.log("done");
    //         noLoop();
    //     }
    // }


}

//create random circle not inside another circle
function createCircle(pos, col) {

    // let rIndex = floor(random(0, validCoords.length));
    // let minMax = validCoords[rIndex];
    // let min = minMax[0];
    // let max = minMax[1];
    // let x = random(min.x, max.x);
    // let y = random(min.y, max.y);

    let r = 2;
    let create = true;

    for(let circ of circs) {
        let d = dist(pos.x, pos.y, circ.pos.x, circ.pos.y);
        if(d < r + circ.r + 1){
            create = false;
            break;
        }
    }

    if(create) {
        return new Circle(pos, r, col);
    } else {
        return null;
    }

}

function handleImg(file) {
    clear();
    circs = [];
    doneGrowing = false;
    if (file.type === 'image') {
        img = loadImage(file.data, data=>{
            img = data;

            let aR = img.width/img.height;
            if(aR >= 1) {
                img.resize(width/2, 0);
            } else {
                img.resize(0, height);
            }

            let offset = createVector(0,0);
            if(aR >= 1) {
                offset.x = 5;
                offset.y = (height-img.height)/2;
            } else {
                offset.x = ((width/2)-img.width)/2;
                offset.y = 5;
            }

            for(let x = 0; x < img.width; x += circDensity.value()) {
                for(let y = 0; y < img.height; y += circDensity.value()) {
                    let col = getColor(img, x, y);
                    let pos = createVector(x, y);
                    pos.add(offset);
                    circs.push(createCircle(pos, col));
                }
            }
        });
    } else {
        img = null;
    }
    loop();
}

//gets color of pixel at point in image
function getColor(image, i, j) {
    let pix = image.get(i,j).toString();
    pix = pix.substring(0, pix.length - 4);
    pix = "rgb(" + pix + ")";
    let col = color(pix);
    col.setAlpha(alphaSlider.value());
    return col;
}

function resetDraw() {
    clear();
    circs = [];
    doneGrowing = false;

    let aR = img.width/img.height;
    let offset = createVector(0,0);
    if(aR >= 1) {
        offset.y = (height-img.height)/2;
    } else {
        offset.x = ((width/2)-img.width)/2;
    }

    for(let x = 0; x < img.width; x += circDensity.value()) {
        for(let y = 0; y < img.height; y += circDensity.value()) {
            let col = getColor(img, x, y);
            let pos = createVector(x, y);
            pos.add(offset);
            circs.push(createCircle(pos, col));
        }
    }

    loop();
}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}

class Circle {

    constructor(pos, r, col = color(0, 100, 100)) {
        this.pos = pos;
        this.r = r;
        this.col = col;
        this.growing = true;
    }

    grow() {
        this.r += .5;
    }

    checkEdges() {
        let bool = !(this.pos.x - this.r < 0 || this.pos.x + this.r > width || this.pos.y - this.r < 0 || this.pos.y + this.r > height);
        if(!bool){
            this.growing = bool;
        }
        return bool;
    }

    checkCirc(circ) {
        let d = dist(this.pos.x, this.pos.y, circ.pos.x, circ.pos.y);
        if(d < this.r + circ.r - this.r/2){
            this.growing = false;
            return false;
        } else {
            return true;
        }
    }

    draw() {
        push();
        translate(this.pos);
        //noFill();
        this.col.setAlpha(1);
        strokeWeight(1);
        stroke(this.col);
        this.col.setAlpha(alphaSlider.value());
        fill(this.col);
        circle(0, 0, this.r*2);
        pop();
    }


}
