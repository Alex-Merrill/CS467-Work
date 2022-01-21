const CELL_SIZE=5; // the size of a Cell on the screen

let rule = "90";
let cells = [];
let offset = 0;


function setup() {
    createCanvas(640, 480);

    //rule input and method called on input update
    const ruleInput = createInput(rule);
    ruleInput.position(20, height + 20);
    ruleInput.input(()=>{
        rule = parseInt(ruleInput.value());
        cells = [];
        for(let i = 0; i < width/CELL_SIZE; i++) {
            if(i === (width/CELL_SIZE)/2) {
                cells.push(new Cell(i, 1));
            } else {
                cells.push(new Cell(i, 0));
            }
        }
        offset = 0;
        loop();
    });

    //initialize cells
    for(let i = 0; i < width/CELL_SIZE; i++) {
        if(i === floor((width/CELL_SIZE)/2)) {
            cells.push(new Cell(i, 1));
        } else {
            cells.push(new Cell(i, 0));
        }
    }

}

//updates and draws cells
function draw() {
    for(let cell of cells) {
        cell.update(cells);
    }

    translate(0, offset);
    for(let cell of cells) {
        cell.draw();
    }

    offset += CELL_SIZE;
    if(offset > height) {
        noLoop();
    }
}

//cell class containing update and draw methods
//constructor takes position and initial state
class Cell {

    constructor(i, state) {
        this.i = i;
        this.state = state;
        this.next = 0;
    }

    update(cells) {

        //get neighbors and pattern and set state
        let right, left;
        if(this.i === 0) {
            left = cells[cells.length-1].state;
            right = cells[this.i+1].state;
        } else if(this.i === cells.length-1) {
            left = cells[this.i-1].state;
            right = cells[0].state;
        } else {
            left = cells[this.i-1].state;
            right = cells[this.i+1].state;
        }

        let pattern = left*4 + this.state*2 + right;

        this.next = (rule>>pattern) & 1;

    }

    draw() {
        if(this.state == 0) {
            fill(255);
        } else {
            fill(0);
        }
        rect(this.i*CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
        this.state = this.next;
    }

}
