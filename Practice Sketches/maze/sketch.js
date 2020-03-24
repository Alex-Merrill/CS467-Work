const DIV = 30;

function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
    background(0);
    stroke(255);
    randomSeed(100);

    const size = width/DIV;
    for(let x = 0; x < width; x += size) {
        for(let y = 0; y < height; y += size) {
            if(random() > 0.5) {
                line(x, y, x+size, y+size);

            } else {
                line(x, y+size, x+size, y);
            }
        }
    }

}
