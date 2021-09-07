
const blockW = 22;
let green;
let pink;
let darkGreen;
let angle;


function setup() {
    createCanvas(600,600, WEBGL);
    colorMode(RGB, 255, 255, 255, 1);
    angleMode(RADIANS);
    noStroke();

    green = color(156, 255, 191, 1);
    pink = color(238, 112, 255, 1);
    darkGreen = color(47, 77, 58, .1);
    angle = 0;

}

function draw() {
    background(115, 165, 245);
    ortho(-500, 500, -500, 500, -5000, 5000);

    //green light
    directionalLight(green, -1, 0, -1);
    //pink light
    directionalLight(pink, 0, 1, -1);
    //dark green light
    directionalLight(darkGreen, 1, -1, -1);

    rotateX(-PI/4);
    rotateY(PI/4);

    let offset;
    for(let j = 0; j < width*(4/5); j += blockW) {
        for(let i = 0; i < width*(4/5); i += blockW) {
            let d = dist(i, j, width*(2/5), width*(2/5));
            offset = map(d, 0, 300, -4, 4);
            let h = map(sin(angle+offset), -1, 1, 80, 300);
            push();
                translate(i-width*(2/5), 0, j-width*(2/5));
                ambientMaterial(255, 255, 255);
                box(blockW, h, blockW);
            pop();
        }
    }
    angle+=PI/100;
}
