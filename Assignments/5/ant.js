/**
* This function returns a collection of cells representing a cellular
* automata
*
* @param {int} cellSize the display size of a cell
*/
function ant(cellSize, paintedH){


    /**
    * This class represents a single cell of the CA
    */
    class Cell{
        constructor(i, j, state, ant, antD){ // i,j is the location of the cell in the 2D array
            this.i = i;
            this.j = j;
            this.state = state;
            this.next = state;
            this.ant = ant;
            this.antD = antD;
        }

        update(collection){ // collection will be the collection of all cells

            let nStates = []; //stores neighbors in order: left to right, top to bottom
            let len = collection.length;
            let len1 = collection[0].length;

            //gets neighbors
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    let x = (((this.i+i) % len) + len) % len;
                    let y = (((this.j+j) % len1) + len1) % len1;
                    nStates.push(collection[x][y].state);
                }
            }
            //gets rid of state of this cell
            nStates.splice(4, 1);

            //changes next state based on rules
            if(this.ant) {
                this.ant = false;
                if(this.state === 0) {
                    this.next = 1;
                    if(this.antD === 'left') {
                        collection[this.i][this.j-1].ant = true;
                        collection[this.i][this.j-1].antD = 'up';
                    } else if(this.antD === 'right') {
                        collection[this.i][this.j+1].ant = true;
                        collection[this.i][this.j+1].antD = 'down';
                    } else if(this.antD === 'up') {
                        collection[this.i+1][this.j].ant = true;
                        collection[this.i+1][this.j].antD = 'right';
                    } else if(this.antD === 'down') {
                        collection[this.i-1][this.j].ant = true;
                        collection[this.i-1][this.j].antD = 'left';
                    }
                    this.antD = 'none';
                } else {
                    this.next = 0;
                    if(this.antD === 'left') {
                        collection[this.i][this.j+1].ant = true;
                        collection[this.i][this.j+1].antD = 'down';
                    } else if(this.antD === 'right') {
                        collection[this.i][this.j-1].ant = true;
                        collection[this.i][this.j-1].antD = 'up';
                    } else if(this.antD === 'up') {
                        collection[this.i-1][this.j].ant = true;
                        collection[this.i-1][this.j].antD = 'left';
                    } else if(this.antD === 'down') {
                        collection[this.i+1][this.j].ant = true;
                        collection[this.i+1][this.j].antD = 'right';
                    }
                    this.antD = 'none'
                }
            } else {
                this.next = this.state;
            }

        }

        display(){
            if(this.state === 0) {
                fill(255);
            } else {
                fill(0)
            }
            rect(this.i*cellSize, this.j*cellSize, cellSize, cellSize);
            this.state = this.next;
        }

    }

    // assemble the cells into a 2D array
    const cells = Array(floor(width / cellSize));
    for (let i = 0; i < cells.length; i++){
        cells[i] = Array(floor(height/cellSize));
        for (let j = 0; j < cells[i].length; j++){
            let state = 0;
            let ant;
            if(i === floor(cells.length/2) && j === floor(cells[i].length/2)) {
                ant = true;
                antD = 'left';
            } else {
                ant = false;
                antD = 'none';
            }
            cells[i][j] = new Cell(i, j, state, ant, antD);
        }
    }

    return cells;

}

// Make this CA available
// it will show up in the options as 'Game of Life'
CA_COLLECTION.set("Langton's Ant", ant);
