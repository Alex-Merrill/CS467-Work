let cookies = 0;
let cps = 0;
let clickCookies = 1;
let clickMade = 0;
let mult = 1;
let cursors = 0;
let grandmas = 0;
let farms = 0;
let mines = 0;
let banks = 0;
let cRate = .5;
let gRate = 5;
let fRate = 25;
let mRate = 150;
let bRate = 1000;
let cPrice = 10;
let gPrice = 100;
let fPrice = 1000;
let mPrice = 10000;
let bPrice = 75000;
const UPGRADES = ['click1', 'click2', 'click3', 'click4', 'click5',
                  'curs1', 'curs2', 'curs3', 'curs4', 'curs5',
                  'g1', 'g2', 'g3', 'g4', 'g5',
                  'f1', 'f2', 'f3', 'f4', 'f5',
                  'm1', 'm2', 'm3', 'm4', 'm5',
                  'b1', 'b2', 'b3', 'b4', 'b5',
                  'mult1', 'mult2', 'mult3', 'mult4', 'mult5'];
const UPGRADESINC = [.05, .1, .25, .45, .75,
                     .5, 2, 3, 10, 15,
                     5, 10, 20, 40, 70,
                     10, 25, 40, 50, 75,
                     50, 100, 100, 150, 200,
                     500, 750, 1000, 1750, 5000,
                     .05, .01, .25, .5, 1];
const UPGRADESCOSTS = [250, 10000, 100000, 750000, 10000000,
                      25, 50, 100, 150, 250,
                      25, 50, 100, 150, 250,
                      25, 50, 100, 150, 250,
                      25, 50, 100, 150, 250,
                      25, 50, 100, 150, 250,
                      1000, 5000, 50000, 250000, 1000000];
const UPGRADESPRICE = [5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000,
                       5000, 50000, 500000, 1000000, 10000000];
let upgradeObjs = [];
let availUpgrades = [];
let imgs = [];

//NOTES:
//change art
//make producers that can be bought white, and the others redish tint
//add falling cookies on left side use simple objects
//change black outlines to wood
//add milk
//add picture of cursor, gma, etc. in the buy bars
//add hover menu with cps and maybe other stats for cursor, gma, etc. in buy bars
//do the same ^ but for upgrades



function preload() {
    imgs.push(loadImage('cookie.png'));
    imgs.push(loadImage('cursor.png'));
    imgs.push(loadImage('grandma.png'));
    imgs.push(loadImage('farm.png'));
    imgs.push(loadImage('mine.png'));
    imgs.push(loadImage('bank.png'));
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    colorMode(HSB, 360, 100, 100, 1);

    //create upgrades
    for(let i = 0; i < UPGRADES.length; i++) {
        upgradeObjs.push(new Upgrade(UPGRADES[i], UPGRADESINC[i], UPGRADESCOSTS[i], UPGRADESPRICE[i]));
    }
}

function draw() {
    background(0);

    uiStuff();
    checkUpgrades();
    //calc new cookies
    cookies += cps/30;

}

//updates CPS
function updateCPS() {
    cps = cursors*cRate + grandmas*gRate + farms*fRate + mines*mRate + banks*bRate;
    cps *= mult;
}

//checks for available upgrades and adds them to availUpgrades
function checkUpgrades() {
    for(let upgrade of upgradeObjs) {
        upgrade.checkUpgrade();
        if(upgrade.avail && !upgrade.applied && !upgrade.added) {
            upgrade.added = true;
            availUpgrades.push(upgrade);
        }
    }
    for(let i = 0; i < availUpgrades.length; i++) {
        if(availUpgrades[i].applied) {
            availUpgrades.splice(i, 1);
        }
    }
}

//handles mouse clicks
function mouseClicked() {
    //checks for cookie click
    let pos = createVector(width/8, height*(3/7));
    let mPos = createVector(mouseX, mouseY);
    let d = p5.Vector.sub(pos, mPos);
    if(d.magSq() < 10000) {
        cookies += clickCookies;
        clickMade += clickCookies
    }

    //checks if producer is clicked
    if(mPos.x > width*(4/5)+15 && mPos.x <  width-15 && mPos.y > 272 && mPos.y < 272 + 77){
        addProducer('cursors');
    } else if(mPos.x > width*(4/5)+15 && mPos.x < width-15 && mPos.y > 364 && mPos.y < 364 + 77){
        addProducer('grandmas');
    } else if(mPos.x > width*(4/5)+15 && mPos.x < width-15 && mPos.y > 456 && mPos.y < 456 + 77){
        addProducer('farms');
    } else if(mPos.x > width*(4/5)+15 && mPos.x < width-15 && mPos.y > 548 && mPos.y < 548 + 77){
        addProducer('mines');
    } else if(mPos.x > width*(4/5)+15 && mPos.x < width-15 && mPos.y > 640 && mPos.y < 640 + 77){
        addProducer('banks');
    }

    //checks if upgrade is clicked
    for(let upgrade of availUpgrades) {
        if(mPos.x > upgrade.pos.x && mPos.x < upgrade.pos.x + 42 && mPos.y > upgrade.pos.y && mPos.y < upgrade.pos.y+42) {
            upgrade.apply();
        }
    }


}

//adds producer if enough Cookies
//recalculates cps
function addProducer(type) {
    //adds 1 to type
    if(type === 'cursors' && cookies >= cPrice) {
        cursors++;
        cookies -= cPrice;
        cPrice += cPrice*.15;
    } else if(type === 'grandmas' && cookies >= gPrice) {
        grandmas++
        cookies -= gPrice;
        gPrice += gPrice*.15;
    } else if(type === 'farms' && cookies >= fPrice) {
        farms++;
        cookies -= fPrice;
        fPrice += fPrice*.15;
    } else if(type === 'mines' && cookies >= mPrice) {
        mines++;
        cookies -= mPrice;
        mPrice += mPrice*.15;
    } else if(type === 'banks' && cookies >= bPrice) {
        banks++;
        cookies -= bPrice;
        bPrice += bPrice*.15;
    }

    updateCPS();
}

//draws the ui
function uiStuff() {
    noStroke();
    //draws producers panel
    producersPanel();

    //draws cookie panel
    cookiePanel();

    //draws store ui
    storeUI();

}

//draws in producers panel
function producersPanel() {
    //title background
    fill(201, 100, 65);
    rect((width/4)+15, 15, width*(11/20)-15, 100);

    //title
    fill(0);
    textFont('Georgia', 20);
    textStyle(BOLD);
    text('Scuffed Cookie Clicker', (width/4) - 90 + (width*(11/40)), 105/2 + 20);

    //creates producer rects
    fill(255);
    for(let i = 130; i < height; i += 120.5) {
        rect((width/4)+15, i, width*(11/20)-15, 105);
    }

    //draws circles to represent producers
    drawProducers('cursors');
    drawProducers('grandmas');
    drawProducers('farms');
    drawProducers('mines');
    drawProducers('banks');

}

//draws producers
//takes parameter type equal to type of producer
function drawProducers(type) {
    let num;
    let offset;
    let img;
    //get type and offset
    if(type === 'cursors') {
        num = cursors;
        offset = 150;
        img = imgs[1];
    } else if(type === 'grandmas') {
        num = grandmas;
        offset = 270.5;
        img = imgs[2];
    } else if(type === 'farms') {
        num = farms;
        offset = 391;
        img = imgs[3];
    } else if(type === 'mines') {
        num = mines;
        offset = 511.5;
        img = imgs[4];
    } else if(type === 'banks') {
        num = banks;
        offset = 632;
        img = imgs[5];
    }

    //print number owned if grater than 59 producers
    if(num > 59) {
        fill(0);
        text(num, 570+(width/4)+30, offset+70);
    }

    img.resize(25, 25);
    //draw producers
    let numBalls = floor((width*(11/20)-50)/30)+1;
    let row = 0;
    let col = 0;
    for(let j = 1; j <= min(num, 59); j++) {
        image(img, (width/4)+40 + col, row+offset);
        col += 30;
        if(j != 0 && j%20 === 0) {
            row += 30;
            col = 0;
        }
    }

}

//draws cookie panel
function cookiePanel() {
    //cookie background
    fill(201, 63, 100);
    rect(15, 15, (width/4)-15, height-30);

    //draws cookie count
    let tempCookies = floor(cookies);
    let digits = tempCookies.toString().match(/\d/g).length - 1;
    fill('red');
    textSize(20);
    text("Cookies:", width/8 - 34, height*(1/7)-20);
    textSize(18);
    text(tempCookies, width/8 - digits*4.8, height*(1/7));

    //draws cps count
    let tempCPS = floor(cps);
    digits = tempCPS.toString().match(/\d/g).length - 1;
    fill('black');
    textSize(14);
    text("CPS:", width/8 - 9, height*(1/7)+20);
    textSize(12);
    text(tempCPS, 2 + width/8 - digits*4, height*(1/7)+35);

    //draws cookie
    let pos = createVector(width/8, height*(3/7));
    let mPos = createVector(mouseX, mouseY);
    let d = p5.Vector.sub(pos, mPos);
    let r;
    if(d.magSq() < 10000) {
        tint(255, .75);
        r = 180;
    } else {
        tint(255, 1);
        r = 200;
    }
    //circle(pos.x, pos.y, r);
    imgs[0].resize(r,r);
    imageMode(CENTER);
    image(imgs[0], pos.x, pos.y);
}

//draws store panel
function storeUI() {
    //store background
    fill(201, 63, 100);
    rect(width*(4/5)+15, 15, width*(1/5)-30, 100);
    rect(width*(4/5)+15, 120, width*(1/5)-30, 137);

    //title
    fill(0);
    textFont('Georgia', 20);
    textStyle(BOLD);
    text('Store', width*(4/5)+width*(1/10) - 25, 75);

    //Upgrades title
    fill(0);
    textFont('Georgia', 14);
    textStyle(BOLD);
    text('Upgrades', width*(4/5)+width*(1/10) - 30, 110);

    //creates purchase rects
    for(let i = 272; i < height; i += 92) {
        if(mouseX > width*(4/5)+15 && mouseX < width-15 && mouseY > i && mouseY < i+77){
            fill(75);
        } else {
            fill(255);
        }
        rect(width*(4/5)+15, i, width*(1/5)-30, 77)
    }

    //displays Upgrades
    displayUpgrades();

    //draws producer name and cost
    drawCostOwned();
}

//displays availUpgrades
function displayUpgrades() {
    let offset = 123;
    let row = 0;
    let col = 0;
    for(let i = 1; i <= min(12, availUpgrades.length); i++) {
        availUpgrades[i-1].display(width*(4/5) + 27 + col, offset + row);
        col += 45;
        if(i != 0 && i%4 === 0) {
            row += 45;
            col = 0;
        }
    }
}

//draws producer name and cost
function drawCostOwned() {
    fill(237, 98, 100);
    textSize(20);
    text('Cursor', width*(4/5)+25, 318);
    image(imgs[0], width*(4/5)+108, 312, 15, 15);
    fill(0);
    text(floor(cPrice), width*(4/5)+118, 318);
    textSize(12);
    text('Owned: ' + cursors, width*(4/5)+25, 335);

    fill(237, 98, 100);
    textSize(20);
    text('Grandma', width*(4/5)+25, 408);
    image(imgs[0], width*(4/5)+133, 403, 15, 15);
    fill(0);
    text(floor(gPrice), width*(4/5)+142, 408);
    textSize(12);
    text('Owned: ' + grandmas, width*(4/5)+25, 425);

    fill(237, 98, 100);
    textSize(20);
    text('Farm', width*(4/5)+25, 500);
    image(imgs[0], width*(4/5)+92, 495, 15, 15);
    fill(0);
    text(floor(fPrice), width*(4/5)+102, 500);
    textSize(12);
    text('Owned: ' + farms, width*(4/5)+25, 517);

    fill(237, 98, 100);
    textSize(20);
    text('Mine', width*(4/5)+25, 592);
    image(imgs[0], width*(4/5)+90, 587, 15, 15);
    fill(0);
    text(floor(mPrice), width*(4/5)+100, 592);
    textSize(12);
    text('Owned: ' + mines, width*(4/5)+25, 609);

    fill(237, 98, 100);
    textSize(20);
    text('Bank', width*(4/5)+25, 690);
    image(imgs[0], width*(4/5)+90, 685, 15, 15);
    fill(0);
    text(floor(bPrice), width*(4/5)+100, 690);
    textSize(12);
    text('Owned: ' + banks, width*(4/5)+25, 707);
}

//upgrade class
class Upgrade {

    constructor(type, inc, cost, price) {
        this.type = type.substring(0, type.length-1);
        this.statInc = inc;
        this.cost = cost;
        this.price = price;
        this.avail = false;
        this.applied = false;
        this.added = false;
        this.pos = createVector(0,0);
    }

    apply() {
        if(cookies >= this.price) {
            if(this.type === 'click') {
                clickCookies += this.statInc*cps;
            } else if(this.type === 'curs') {
                cRate += this.statInc;
            } else if(this.type === 'g') {
                gRate += this.statInc;
            } else if(this.type === 'f') {
                fRate += this.statInc;
            } else if(this.type === 'm') {
                mRate += this.statInc;
            } else if(this.type === 'b') {
                bRate += this.statInc;
            } else if(this.type === 'mult') {
                mult += this.statInc;
            }
            this.applied = true;
            updateCPS();
        }
    }

    checkUpgrade() {
        if(this.type === 'click') {
            this.avail = clickMade >= this.cost;
        } else if(this.type === 'curs') {
            this.avail = cursors >= this.cost;
        } else if(this.type === 'g') {
            this.avail = grandmas >= this.cost;
        } else if(this.type === 'f') {
            this.avail = farms >= this.cost ;
        } else if(this.type === 'm') {
            this.avail = mines >= this.cost;
        } else if(this.type === 'b') {
            this.avail = banks >= this.cost;
        } else if(this.type === 'mult') {
            this.avail = cps >= this.cost;
        }
    }

    display(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        push();
        translate(x,y);
        if(mouseX > x && mouseX < x+42 && mouseY > y && mouseY < y+42) {
            fill(75);
        } else {
            fill(255);
        }
        rect(0,0,42,42);
        textSize(12);
        fill(0);
        text(this.type, 7, 20);
        textSize(8);
        fill(0);
        text(this.price, 0, 30);
        pop();
    }

}
