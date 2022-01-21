/*
This is a sketch featuring many creatures walking around the canvas.
*/

const NUM_CREATURES = 100;

//let position;
let creatures = [];

function setup() {

    createCanvas(700, 700);
    background(0);
    colorMode(HSB, 360, 1, 1, 1);
    //position = createVector(width/2, height/2);
    for(let i = 0; i < 100; i ++) {
        let creature = {
            color: color(random(20, 60), 1, 1, 1),
            position: createVector(width/2, height/2),
            next: null,
        };
        creatures.push(creature);
    }

}

function draw() {

    //Creates offset, creates next point, draws fat loine
    for(let i = 0; i < NUM_CREATURES; i++) {

        //creates offset and new point
        let offset = p5.Vector.random2D();
        offset.mult(5);
        creatures[i]["next"] = p5.Vector.add(creatures[i]["position"], offset);

        //puts down line with blur
        stroke(creatures[i]["color"]);
        strokeWeight(5);
        line(creatures[i]["position"].x, creatures[i]["position"].y, creatures[i]["next"].x, creatures[i]["next"].y);

    }

    //blur canvas
    filter(BLUR, 2);

    //creates skinny line, sets position to next point
    for(let i = 0; i < NUM_CREATURES; i++) {

        strokeWeight(1);
        stroke(creatures[i]["color"]);
        line(creatures[i]["position"].x, creatures[i]["position"].y, creatures[i]["next"].x, creatures[i]["next"].y);
        creatures[i]["position"] = creatures[i]["next"];

    }


}
