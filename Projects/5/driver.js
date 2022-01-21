
const CA_COLLECTION = new Map(); // a collection of available CAs

let rule;
let cellSize; // the size of a displayed cell
let cells; // the current CA
let start = false;
let freq;
let painted = false;

function setup() {
    createCanvas(640, 480);

    //cellsize input
    makeCellSizeOpt();
    //rule option
    makeRuleOpt();
    //start automata button
    makeStartButton();
    //paint values
    makePaintingOpt();
    //stroke option
    makeStrokeOpt();
    //frequency stuff
    makeFrequency();

    //starting automata
    cells = CA_COLLECTION.get(rule.value())(cellSize, false);

}

function draw() {
    background(255);
    if(start) {
        for(let f = 0; f < freq; f++) {
            for (let i = 0; i < cells.length; i++){
                for (let j = 0; j < cells[i].length; j++){
                    cells[i][j].update(cells);
                }
            }
        }

        for (let i = 0; i < cells.length; i++){
            for (let j = 0; j < cells[i].length; j++){
                cells[i][j].display();
            }
        }
    } else {
        for (let i = 0; i < cells.length; i++){
            for (let j = 0; j < cells[i].length; j++){
                cells[i][j].display();
            }
        }
    }
}

//mouseDragged for painting
function mouseDragged() {
    if(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height && painted){
        let x = floor(mouseX/cellSize);
        let y = floor(mouseY/cellSize);
        if(rule.value() === "Game of Life" || rule.value() === "Game Of Life B36/S23" || rule.value() === "Langton's Ant") {
            if(cells[x][y].state === 0) {
                cells[x][y].state = 1;
                cells[x][y].next = 1;
            } else {
                cells[x][y].state = 0;
                cells[x][y].next = 0;
            }
        } else {
            if(cells[x][y].state < cells[x][y].N) {
                cells[x][y].state += 20;
                cells[x][y].next += 20;
            } else {
                cells[x][y].state = 0;
                cells[x][y].next = 0;
            }

        }
    }
}

//mousePressed for finer painting
function mousePressed() {
    if(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height && painted){
        let x = floor(mouseX/cellSize);
        let y = floor(mouseY/cellSize);
        if(rule.value() === "Game of Life" || rule.value() === "Game Of Life B36/S23" || rule.value() === "Langton's Ant") {
            if(cells[x][y].state === 0) {
                cells[x][y].state = 1;
                cells[x][y].next = 1;
            } else {
                cells[x][y].state = 0;
                cells[x][y].next = 0;
            }
        } else {
            if(cells[x][y].state < cells[x][y].N) {
                cells[x][y].state += 20;
                cells[x][y].next += 20;
            } else {
                cells[x][y].state = 0;
                cells[x][y].next = 0;
            }

        }
    }
}

//make cell size option stuff
function makeCellSizeOpt() {
    const cellSizeLabel = createSpan('Cell Size');
    cellSizeLabel.position(20, height+70);
    const cellSizeInp = createInput(5);
    cellSizeInp.position(90, height+70);
    cellSizeInp.size(20);
    cellSize = parseInt(cellSizeInp.value());
    cellSizeInp.input(()=>{
        cellSize = parseInt(cellSizeInp.value());
    });
}

//make rule option stuff
function makeRuleOpt() {
    const ruleLabel = createSpan('Rule set');
    ruleLabel.position(20, height+20);
    rule = createSelect();
    rule.position(80, height + 20);
    CA_COLLECTION.forEach((_, name)=>{
        rule.option(name);
    });
    rule.changed(()=>{
        clear();
        if(!painted) {
            const name = rule.value();
            const generator = CA_COLLECTION.get(name);
            cells = generator(cellSize, false);
        } else {
            const name = rule.value();
            const generator = CA_COLLECTION.get(name);
            cells = generator(cellSize, true);
        }
        start = false;
    });
}

//frequency input stuff
function makeFrequency() {
    const freqLabel = createSpan('Draw Frequency');
    freqLabel.position(20, height+95);
    const freqLabel1 = createSpan('GET WORKING');
    freqLabel1.position(160, height+95);
    const freqInp = createInput(1);
    freqInp.position(135, height+95);
    freqInp.size(20);
    freq = parseInt(freqInp.value());
    freqInp.input(()=>{
        freq = parseInt(freqInp.value());
    });
}

//stroke option stuff
function makeStrokeOpt() {
    const strokeLabel = createSpan('Stroke Option');
    strokeLabel.position(20, height+45);
    const strokes = createSelect();
    strokes.position(120, height+45);
    strokes.option("stroke");
    strokes.option("noStroke");
    strokes.changed(()=>{
        if(strokes.value() === 'stroke'){
            stroke(0);
        } else {
            noStroke();
        }
    });
}

//make start button stuff
function makeStartButton() {
    const startB = createButton('Start Automata');
    startB.position(width*(7/8), height+20);
    startB.mousePressed(()=>{
        console.log(painted);
        if(!painted) {
            const name = rule.value();
            const generator = CA_COLLECTION.get(name);
            cells = generator(cellSize, false);
        }
        start = true;
        painted = false;
    });
}

//make paintbutton stuff
function makePaintingOpt() {
    const paintB = createButton('Paint Cells');
    paintB.position(width*(6/8), height+20);
    paintB.mousePressed(()=>{
        clear();
        const name = rule.value();
        const generator = CA_COLLECTION.get(name);
        cells = generator(cellSize, true);
        start = false;
        painted = true;
    });
}
