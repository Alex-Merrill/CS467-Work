
let noiseScale;
let level;
let speedSlider;

function setup() {
    frameRate(24);
    createCanvas(700, 700);
    noStroke();
    blendMode(MULTIPLY);

    speedSlider = createSlider(0, .0005, .0001, .00001);
    speedSlider.position(0, height + 20)

    noiseScale = 0;
    level = 0;


}

function draw() {
    clear();
    background(255);

    //creates circles
    colorMode(HSB, 360, 100, 100, 1);
    for(let i = 25; i < width; i += 50) {
        for(let j = 25; j < height; j += 50) {
            let noiseVal = noise(i*noiseScale, j*noiseScale, level);
            let r = map(noiseVal, 0, 1, 15, 100);
            let hue = map(noiseVal, 0, 1, 0, 360);
            fill(hue, min(hue, 100), min(hue, 100), .5);
            circle(i,j,r);
        }
    }

    //moves animation forward
    noiseScale += speedSlider.value();
    if(noiseScale >= 1) {
        noiseScale = 0;
        level+= 100;
    }

}

//save function
function keyTyped() {
    if(key === 's') {
        saveCanvas('eye', 'png');
    }
}
