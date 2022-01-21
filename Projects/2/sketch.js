/*
Image Mosaic
*/

const CELL_SIZE = 50;
let img;
let patchW;
let patchH;
let sx;
let sy;
let press;
let pressX;
let pressY;



function setup() {

    createCanvas(1200, 600);
    background(50);
    input = createFileInput(handleImg);
    button = createButton("Reroll");
    input.position(20, height+20);
    button.position(20, height + 40);
    button.mousePressed(reroll);
    patchW = 0;
    patchH = 0;
    sx = 0;
    sy = 0;
    press = false;
    stroke(0);
    strokeWeight(5);
    noLoop();
    noFill();

}

function draw(){
    //clears canvas and sets background
    clear();
    background(150);

    //puts original picture on right side in native aspect ratio
    if(img) {

        let aspect = img.width/img.height;
        if(aspect >= 1) {
            image(img, width/2, (height - (width/2)/aspect)/2, width/2, (width/2)/aspect);
        } else {
            image(img, width/2 + ((width/2) - (height*aspect))/2, 0, (height)*aspect, height);
        }

    }


    //puts down image tiles on left size
    if(img) {
        //determines whether to draw tiles randomly or from selection
        if(press === false) {

            //puts down tiles randomly
            drawTiles(sx, sy, patchW, patchH);

        } else {

            //puts down tiles from selection
            let aspect = img.width/img.height;
            if(aspect >= 1) {
                if(pressX >= width/2 && pressX <= width && pressY >= (height - (width/2)/aspect)/2 && pressY <= height - (height - (width/2)/aspect)/2 ) {

                    if(mouseX >= width/2 && mouseX <= width && mouseY >= (height - (width/2)/aspect)/2 && mouseY <= height - (height - (width/2)/aspect)/2) {
                        let sWidth = mouseX - pressX;
                        let sHeight = mouseY - pressY;
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - width/2)/(width/2))*img.width, ((mouseX - width/2)/(width/2))*img.width);
                        let newY = min(((pressY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height, ((mouseY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height);
                        let newW = abs((sWidth/(width/2))*img.width);
                        let newH = abs(sHeight/((height)/aspect)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX > width/2 && mouseY < (height - (width/2)/aspect)/2) {// x > and y <
                        let sWidth = min(mouseX - pressX, width - pressX);
                        let sHeight = max(mouseY - pressY, (height - (width/2)/aspect)/2 - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - width/2)/(width/2))*img.width, ((mouseX - width/2)/(width/2))*img.width);
                        let newY = max(0, (mouseY - (height - (width/2)/aspect)/2)/(height/aspect)*img.height);
                        let newW = abs((sWidth/(width/2))*img.width);
                        let newH = abs(sHeight/((height)/aspect)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX > width/2 && mouseY >= (height - (width/2)/aspect)/2) {//x > and y >
                        let sWidth = min(mouseX - pressX, width - pressX);
                        let sHeight = min(mouseY - pressY, height - pressY - (height - (width/2)/aspect)/2);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - width/2)/(width/2))*img.width, ((mouseX - width/2)/(width/2))*img.width);
                        let newY = min(((pressY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height, ((mouseY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height);
                        let newW = abs((sWidth/(width/2))*img.width);
                        let newH = abs(sHeight/((height)/aspect)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX <= width/2 && mouseY < (height - (width/2)/aspect)/2) {//x < and y <
                        let sWidth = max(mouseX - pressX, width/2 - pressX);
                        let sHeight = max(mouseY - pressY, (height - (width/2)/aspect)/2 - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = max(0, ((mouseX - width/2)/(width/2))*img.width);
                        let newY = max(0, (mouseY - (height - (width/2)/aspect)/2)/(height/aspect)*img.height);
                        let newW = abs((sWidth/(width/2))*img.width);
                        let newH = abs(sHeight/((height)/aspect)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX <= width/2 && mouseY >= (height - (width/2)/aspect)/2) {//x < and y >
                        let sWidth = max(mouseX - pressX, width/2 - pressX);
                        let sHeight = min(mouseY - pressY, height - pressY - (height - (width/2)/aspect)/2);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = max(0, ((mouseX - width/2)/(width/2))*img.width);
                        let newY = min(((pressY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height, ((mouseY - (height - (width/2)/aspect)/2)/(height/aspect))*img.height);
                        let newW = abs((sWidth/(width/2))*img.width);
                        let newH = abs(sHeight/((height)/aspect)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    }


                }
            } else {
                if(pressX >= width/2 + ((width/2) - (height*aspect))/2 && pressX <= width - ((width/2) - (height*aspect))/2 && pressY >= 0 && pressY <= height) {

                    let rightW = (width/2)*aspect;
                    if(mouseX >= width/2 + (width/2 - height*aspect)/2 && mouseX <= width - (width/2 - height*aspect)/2 && mouseY >= 0 && mouseY <= height) {
                        let sWidth = mouseX - pressX;
                        let sHeight = mouseY - pressY;
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width, ((mouseX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width);
                        let newY = min(((pressY)/(height))*img.height, ((mouseY)/(height))*img.height);
                        let newW = abs((sWidth/(rightW))*img.width);
                        let newH = abs(sHeight/(height)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX > width/2 + (width/2 - height*aspect)/2 && mouseY < 0) {// x > and y <
                        let sWidth = min(mouseX - pressX, width - pressX - (width/2 - height*aspect)/2);
                        let sHeight = max(mouseY - pressY, 0 - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width, ((mouseX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width);
                        let newY = max(0, ((mouseY)/(height))*img.height);
                        let newW = abs((sWidth/(rightW))*img.width);
                        let newH = abs(sHeight/(height)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX > width/2 + (width/2 - height*aspect)/2 && mouseY >= 0) {//x > and y >
                        let sWidth = min(mouseX - pressX, width - pressX - (width/2 - height*aspect)/2);
                        let sHeight = min(mouseY - pressY, height - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = min(((pressX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width, ((mouseX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width);
                        let newY = min(((pressY)/(height))*img.height, ((mouseY)/(height))*img.height);
                        let newW = abs((sWidth/(rightW))*img.width);
                        let newH = abs(sHeight/(height)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX <= width/2 + (width/2 - height*aspect)/2 && mouseY < 0) {//x < and y <
                        let sWidth = max(mouseX - pressX, width/2 + (width/2 - height*aspect)/2 - pressX);
                        let sHeight = max(mouseY - pressY, 0 - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = max(0, ((mouseX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width);
                        let newY = max(0, ((mouseY)/(height))*img.height);
                        let newW = abs((sWidth/(rightW))*img.width);
                        let newH = abs(sHeight/(height)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    } else if(mouseX <= width/2 + (width/2 - height*aspect)/2 && mouseY >= 0) {//x < and y >
                        let sWidth = max(mouseX - pressX, width/2 + (width/2 - height*aspect)/2 - pressX);
                        let sHeight = min(mouseY - pressY, height - pressY);
                        rect(pressX, pressY, sWidth, sHeight);
                        let newX = max(0, ((mouseX - (width/2 + ((width/2) - (height*aspect))/2))/rightW)*img.width);
                        let newY = min( ((pressY)/(height))*img.height , ((mouseY)/(height))*img.height);
                        let newW = abs((sWidth/(rightW))*img.width);
                        let newH = abs(sHeight/(height)*img.height);
                        drawTiles(newX, newY, newW, newH);
                    }

                }
            }

        }
    }

}



function handleImg(file) {

    if (file.type === 'image') {
        img = loadImage(file.data, data=>{
            img = data;
            patchW = random(0, img.width);
            patchH = random(0, img.height);
            sx = random(0, img.width-patchW);
            sy = random(0, img.height-patchH);
            redraw();
        });
    } else {
        img = null;
    }

}

function drawTiles(px, py, picW, picH){

    if(picW === 0 || picH === 0) {

    } else {
        for(let i = 0; i < width/2; i += CELL_SIZE) {
            for(let j = 0; j < height; j += CELL_SIZE) {
                image(img, i, j, CELL_SIZE, CELL_SIZE, px, py, picW, picH);
            }
        }
    }

}

function reroll() {
    patchW = random(0, img.width);
    patchH = random(0, img.height);
    sx = random(0, img.width-patchW);
    sy = random(0, img.height-patchH);
    redraw();
}

function mousePressed(event) {
    press = true;
    pressX = event.clientX - 8;
    pressY = event.clientY - 8;
    loop();
}

function mouseReleased() {
    press = false;
    noLoop();
}

function keyTyped() {
  console.log(key);
  if(key === 's') {
    saveCanvas('wires', 'png');
  }
}
