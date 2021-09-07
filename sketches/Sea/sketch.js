function setup() {
    createCanvas(800, 800);
}

function draw() {
    background(0);




    for(var x = 0; x <= 32; x++) {
        for(var y = 0; y <= 32; y++) {

            circle(x*25, y*25, 50);

        }
    }



    var tempj = 32;
    for(var i = 32; i >= 0; i--){
        for(var j = 0; j <= 32-tempj; j++){

            circle(i*25, j*25, 50);

        }
        tempj--;
    }

    for(var a = 0; a <= 32; a++){

        square(800-a*27, a*27, 50);

    }


}
