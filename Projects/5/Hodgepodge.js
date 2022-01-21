/**
* This function returns a collection of cells representing a cellular
* automata
*
* @param {int} cellSize the display size of a cell
*/
function hodge(cellSize, paintedH){


    /**
    * This class represents a single cell of the CA
    */
    class Cell{
        constructor(i, j, state){ // i,j is the location of the cell in the 2D array
            this.i = i;
            this.j = j;
            this.state = state;
            this.next = state;
            this.N = 200;
            this.k1 = 3;
            this.k2 = 3;
            this.g = 28;
        }

        update(collection){ // collection will be the collection of all cells
            //stores neighbors in order: left to right, top to bottom
            let nStates = [];
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

            //counts up ill and infected neighbors
            //sums states of neighbors and this cell
            let ill = 0;
            let infected = 0;
            let sum = 0;
            for (let n of nStates) {
                if(n > 0 && n < this.N) {
                    infected++;
                } else if(n === this.N) {
                    ill++;
                }
                sum += n;
            }
            sum += this.state;

            //changes next state based on rules
            if(this.state === 0) {
                this.next = floor(infected/this.k1) + floor(ill/this.k2);
            } else if(this.state === this.N) {
                this.next = 0;
            } else {
                this.next = min(this.N, floor(sum/(ill+infected+1)) + this.g);
            }

        }

        display(){
            let stateR = map(this.state, 0, this.N, 0, 255);
            let stateG = map(this.state, this.N, 0, 0, 40);
            let stateB = map(this.state, this.N, 0, 0, 40);
            fill(stateR, stateG, stateB);
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
                state = floor(random(100));
            } else {
                state = 0;
            }
            cells[i][j] = new Cell(i, j, state);
        }
    }

    return cells;

}

// Make this CA available
// it will show up in the options as 'Game of Life'
CA_COLLECTION.set('Hodgepodge', hodge);
