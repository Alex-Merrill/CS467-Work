const CAN_W = 632;
const CAN_H = 632;
const DIAM_W = 70;
const DIAM_H = 100;
const SPACE = 35;
let rows;
let cols;


function setup() {
    createCanvas(CAN_W, CAN_H);

    cols = CAN_H/DIAM_H;
    rows = CAN_W/DIAM_W;
    noStroke();

}

function draw() {
    background(0);

    drawShape();

}


function drawShape() {
    let sodd = 0;
    let jodd = 0;
    for(let j = 0; j < cols + 1; j++) {

        for(let s = 0; s < rows; s += 1.5) {

            if(sodd % 2 == 0) {
                fill(89, 126, 135, 255);
                quad(s*DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2,
                    s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H,
                    s*DIAM_W + DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2,
                    s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H+DIAM_H);
                fill(115, 86, 106, 255);
                quad(/*top left*/s*DIAM_W - DIAM_W/2 - DIAM_W/2, j*DIAM_H,
                    /* top right */s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H,
                    /* bottom right */s*DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2,
                    /* bottom left */s*DIAM_W - DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2);

            }
            else {
                fill(89, 126, 135, 255);
                quad(s*DIAM_W - DIAM_W/2, j*DIAM_H,
                    s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H - DIAM_H/2,
                    s*DIAM_W + DIAM_W - DIAM_W/2, j*DIAM_H,
                    s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H+DIAM_H/2);
                    fill(115, 86, 106, 255);
                    quad(/*top left*/s*DIAM_W - DIAM_W/2 - DIAM_W/2, j*DIAM_H + DIAM_H/2,
                        /* top right */s*DIAM_W + DIAM_W/2 - DIAM_W/2, j*DIAM_H + DIAM_H/2,
                        /* bottom right */s*DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2 + DIAM_H/2,
                        /* bottom left */s*DIAM_W - DIAM_W - DIAM_W/2, j*DIAM_H + DIAM_H/2 + DIAM_H/2);
            }
            sodd++;

        }
    }

}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}
