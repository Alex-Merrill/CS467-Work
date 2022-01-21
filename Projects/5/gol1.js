/**
* This function returns a collection of cells representing a cellular
* automata
*
*/
function gol1(cellSize, paintedH){


    /**
    * This class represents a single cell of the CA
    */
    class Cell{
        constructor(i, j, state){ // i,j is the location of the cell in the 2D array
            this.i = i;
            this.j = j;
            this.state = state;
            this.next = state;
            this.streak = 0;
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

            let neighbors = 0;
            for (let n of nStates) {
                neighbors += n;
            }

            //changes next state based on rules
            if(this.state === 1 && neighbors < 2) {
                this.next = 0;
            } else if(this.state === 1 && neighbors > 3) {
                this.next = 0;
            } else if(this.state === 0 && neighbors === 3) {
                this.next = 1;
            } else if(this.state === 0 && neighbors === 6) {
                this.next = 1;
            } else {
                this.next = this.state;
            }

            if(this.state === 1 && this.next === 1 && this.streak <= 255) {
                this.streak += 2;
            } else if(this.state === 1 && this.next === 0) {
                this.streak = 0;
            }


        }

        display(){
            if(this.state === 0) {
                fill(255);
            } else {
                fill(0+this.streak, 0, 0);
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
            let state;
            if(!paintedH) {
                state = floor(random(2));
            } else {
                state = 0;
            }
            cells[i][j] = new Cell(i, j, state);
        }
    }

    return cells;

}

// Make this CA available
// it will show up in the options as 'Game of Life B36/S23'
CA_COLLECTION.set('Game Of Life B36/S23', gol1);
