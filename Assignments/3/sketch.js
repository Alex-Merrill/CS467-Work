/*
CS467 - Assignment Three: Markov Image Generation

@name Alex Merrill

*/

let drawSelector;
let drawType;
let img;
let imgColors;
let pixelStack;
let pixelVisit;
let pixelsDrawn;
let totalPixels;
let shuffleSelector;
let shuffleStatus;

//setup
function setup() {
    createCanvas(400, 400);
    background(255);
    colorMode(RGB, 255, 255, 255, 255);

    //creates image input button
    input  = createFileInput(handleFile);
    input.position(20, height + 85);

    //creates drawtype selector
    drawSelector = createSelect();
    drawSelector.position(20, height + 105);
    drawSelector.option('Stack');
    drawSelector.option('Queue');
    drawSelector.changed(drawSelectionChanged);
    drawType = 'Stack';

    //creates shuffle selector
    shuffleSelector = createSelect();
    shuffleSelector.position(20, height + 125);
    shuffleSelector.option('Shuffle');
    shuffleSelector.option("Don't shuffle");
    shuffleSelector.changed(shuffleSelectionChanged);
    shuffleStatus = true;

    //creates 2D array for storying visited status of pixels
    pixelVisit = [];
    for(let i = 0; i < width; i++) {
        pixelVisit.push(new Array(height));
    }

    totalPixels = width*height;
    noLoop();
}


//Draws
function draw() {
    if(img) {
        //Selects random (x,y) coordinate and random color from markov chain to start drawing
        if(pixelsDrawn === 0) {
            getStartingPoint();
        }

        //draws pixels
        let iterator = 0;
        while(pixelStack.length != 0) {

            //sets pixel color
            if(drawType === 'Stack') {
                currentPixel = pixelStack.pop();
            } else {
                currentPixel = pixelStack.shift();
            }
            let currX = currentPixel.pos[0];
            let currY = currentPixel.pos[1];
            let possibleColors = imgColors.get(currentPixel.col);
            let currCol = color(currentPixel.col);
            set(currX, currY, currCol);

            //increases iterator and pixelsDrawn
            iterator++;
            pixelsDrawn++;

            //visits neighbors and pushes their record onto pixelStack
            let neighborsRecord = [];
            if(currY > 0 && !pixelVisit[currX][currY - 1]) { //top
                let pixelRecord = visitNeighbor(currX, currY - 1, possibleColors);
                neighborsRecord.push(pixelRecord);
            }
            if(currX > 0 && !pixelVisit[currX - 1][currY]) { //left
                let pixelRecord = visitNeighbor(currX - 1, currY, possibleColors);
                neighborsRecord.push(pixelRecord);
            }
            if(currX + 1 < width && !pixelVisit[currX + 1][currY]) { //right
                let pixelRecord = visitNeighbor(currX + 1, currY, possibleColors);
                neighborsRecord.push(pixelRecord);
            }
            if(currY + 1 < height && !pixelVisit[currX][currY + 1]) { //bottom
                let pixelRecord = visitNeighbor(currX, currY + 1, possibleColors);
                neighborsRecord.push(pixelRecord);
            }

            //Decides whether to shuffle neighborsRecord array and adds to pixelStack
            if(shuffleStatus) {
                shuffle(neighborsRecord, true);
            }
            pixelStack = pixelStack.concat(neighborsRecord);

            if(iterator >= 200) {
                break;
            }

        } //while loop ends

        //updates the pixels with their new color
        updatePixels();

        //decides to continue drawing or not.
        if(pixelsDrawn >= totalPixels) {
            noLoop();
        }
    }
}

/**
* This handles the image file submitted by the user.
*
* @param {file} file The file returned from the file input control
*/
function handleFile(file) {
    markovChain = null; // clear the data
    if (file.type === 'image') {

        loadImage(file.data, imgData=>{
            // to speed up computation, we shrink the image proportionally so the width is 400 pixels
            imgData.resize(400,0);
            img = imgData;
            imgColors = new Map();
            for(let i = 0; i < img.width; i++) {
                for(let j = 0; j < img.height; j++) {
                    //get color of current pixel
                    let colorStr = getColor(i, j);

                    //get color of neighbor pixels
                    let colorArr = [];
                    if(j-1 >= 0) {
                        let top = getColor(i, j-1);
                        colorArr.push(top);
                    }
                    if(i-1 >= 0) {
                        let left = getColor(i-1, j);
                        colorArr.push(left);
                    }
                    if(i+1 < img.width) {
                        let right = getColor(i+1, j);
                        colorArr.push(right);
                    }
                    if(j+1 < img.height) {
                        let bottom = getColor(i, j+1);
                        colorArr.push(bottom);
                    }

                    //check to see if color is already in imgColors
                    if(imgColors.get(colorStr) == undefined) {
                        imgColors.set(colorStr, colorArr);
                    } else {
                        let prevColors = imgColors.get(colorStr);
                        let totalColors = prevColors.concat(colorArr);
                        imgColors.set(colorStr, totalColors);
                    }
                }
            }

            //sets up canvas and values
            setImage();

            //draws
            loop();
        })
    }
}

//creates a record of a random pixel with a random color from markov chain
//as a starting point
function getStartingPoint() {
    let firstVisitX = Math.floor(random(0, width));
    let firstVisitY = Math.floor(random(0, height));
    let mapIndex = 0;
    let randomIndex = Math.floor(random(0, imgColors.size));
    let firstColor;
    for(let value of imgColors.values()) {
        if(mapIndex === randomIndex) {

            //gets random color from markov chain
            let valueIndex = Math.floor(random(0, value.length-1));
            firstColor = value[valueIndex];

            //marks pixel as visited and pushes pixelRecord onto pixelStack
            pixelVisit[firstVisitX][firstVisitY] = true;
            let pixelRecord = {
                pos: [firstVisitX, firstVisitY],
                col: firstColor
            };
            pixelStack.push(pixelRecord);

            break;
        }
        mapIndex++;
    }
}

//visits pixel and creates record with position and color from markov chain
//returns record of visited pixel
function visitNeighbor(currX, currY, possibleColors) {
    pixelVisit[currX][currY] = true;
    let randomColorIndex = Math.floor(random(0, possibleColors.length - 1));
    let newCol = possibleColors[randomColorIndex];
    let pixelRecord = {
        pos: [currX, currY],
        col: newCol
    };
    return pixelRecord;
}

//gets color of pixel
//returns color of pixel as str in format rgb("color code")
function getColor(i, j) {
    let pix = img.get(i,j).toString();
    pix = pix.substring(0, pix.length - 4);
    pix = "rgb(" + pix + ")";
    return pix;
}

//sets the canvas and global variables; loops draw
function setImage() {

    //resets pixelVisit
    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {
            pixelVisit[i][j] = false;
            set(i,j,color('white'));
        }
    }

    //sets pixelStack and pixelsDrawn
    pixelStack = [];
    pixelsDrawn = 0;

    //starts loop again
    loop();

}

//changes drawType of selctor is changed
function drawSelectionChanged() {
    drawType = drawSelector.value();
    setImage();
}

//changes shuffle if selector is changed
function shuffleSelectionChanged() {
    if(shuffleSelector.value() === 'Shuffle') {
        shuffleStatus = true;
    } else {
        shuffleStatus = false;
    }
    setImage();
}

//saves image when 's' key is pressed
function keyTyped() {
  if(key === 's') {
    saveCanvas('pollock', 'png');
  }
  if(key === 'r') {
      setImage();
  }
}
