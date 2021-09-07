function setup() {
    createCanvas(800, 800);
}

function draw() {
    background(0);
    colorMode(RGB, 255, 255, 255, 1);



    for(var x = 0; x <= 32; x++) {
        for(var y = 0; y <= 32; y++) {
            circle(x*5, y*5, 10);
            
        }
    }



    var tempj = 32;
    for(var i = 32; i >= 0; i--){
        for(var j = 0; j <= 32-tempj; j++){

            circle(i*5, j*5, 10);

        }
        tempj--;
    }

    for(var a = 0; a <= 32; a++){

        circle(800-a*27, a*27, 60);

    }

    fill(0,0,0);
    triangle(100, 100, 100, 550, 550, 100);

    fill(255,30,30, 0.75);
    triangle(700, 700, 700, 250, 250, 700);

    fill(255,30,30, 0.75);
    circle(225, 225, 150);

    fill(0,0,0);
    circle(575, 575, 150);

    fill(255,255,255);




}
