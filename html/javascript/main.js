'use strict'

// TODO: Power ups

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const width = 900;
const height = 500;
const grid = 25;

let body;
let xHead;
let yHead;
let direction;
let appleExists;
let apple;
let score;
let highscore;

let lastDir;
let lastMove;
let requestId = undefined;
let intervalID = undefined;

window.addEventListener('keydown', changeDirection);

function init() {
    preloadImages();
    initVariables();
    addChild(xHead, yHead);
    stopAnimation();
    startAnimation();
    document.getElementById('highscore').innerHTML = 'Highscore: ' + score.toString();
}

function preloadImages() {
    preloadImage('images/headleft.png');
    preloadImage('images/body.png');
    preloadImage('images/headdown.png');
    preloadImage('images/headup.png');
    preloadImage('images/headright.png');
}

function preloadImage(url) {
    let img=new Image();
    img.src=url;
}

function initVariables() {
    body = [];
    xHead = 100;
    yHead = 100;
    score = localStorage.getItem('highscore');
    if (score == null) score = 1;
    direction = undefined;
    appleExists = false;
    lastMove = undefined;
    lastDir = undefined;
}

function startAnimation() {
    let speed = getSpeed();
    intervalID = window.setInterval(draw, speed);
    requestId = requestAnimationFrame(draw);
}

function getSpeed() {
    let difficulty = getDifficulty();
    let speed = 0;
    switch(difficulty.value) {
        case 'easy':
            speed = 110;
            break;
        case 'medium':
            speed = 85;
            break;
        case 'hard':
            speed = 60;
            break;
        case 'expert':
            speed = 45;
            break;
    }

    return speed;
}

function getDifficulty() {
    let difficulty = document.getElementsByName('difficulty');
    for(let i = 0; i < difficulty.length; i++) {
        if (difficulty[i].checked) {
            return difficulty[i];
        }
    }
    return difficulty;
}

function stopAnimation() {
    window.clearInterval(intervalID);
    window.cancelAnimationFrame(requestId);
}


function changeDirection(event) {
    lastDir = direction;

    // down
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        direction = (lastDir !== 'up' || body.length === 1) ? 'down' : 'up';
        event.preventDefault();
    }
    // up
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        direction = (lastDir !== 'down' || body.length === 1) ? 'up' : 'down';
        event.preventDefault();
    }
    // left
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        direction = (lastDir !== 'right' || body.length === 1) ? 'left' : 'right';
        event.preventDefault();
    }

    // right
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        direction = (lastDir !== 'left' || body.length === 1) ? 'right' : 'left';
        event.preventDefault();
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawApple();
    drawSnake();
    checkApple();
    checkCollision();
}

function drawSnake() {
    if (direction === 'down') {
        moveDown();
    }
    // up
    if (direction === 'up') {
        moveUp();
    }
    // left
    if (direction === 'left') {
        moveLeft();
    }

    // right
    if (direction === 'right') {
        moveRight();
    }

    moveBody();
    drawBody();
}

function moveDown() {
    if (yHead < 500-grid) {
        if(lastMove !== 'up') {
            yHead += grid;
            lastMove = 'down';
        } else {
            moveUp();
        }
    } else {
        lost();
    }
}

function moveUp() {
    if (yHead - grid >= 0) {
        if (lastMove !== 'down') {
            yHead -= grid;
            lastMove = 'up';
        } else {
            moveDown();
        }
    } else {
        lost();
    }
}

function moveLeft() {
    if (xHead - grid >= 0) {
        if (lastMove !== 'right') {
            xHead -= grid;
            lastMove = 'left';
        } else {
            moveRight();
        }
    } else {
        lost();
    }
}

function moveRight() {
    if (xHead + grid + grid <= width) {
        if (lastMove !== 'left') {
            xHead += grid;
            lastMove = 'right';
        } else {
            moveLeft();
        }
    } else {
        lost();
    }
}

function addChild(x = undefined, y = undefined) {
    let imageChild = new Image();
    imageChild.src = 'images/body.png';
    let child = {'x': x, 'y': y, 'image': imageChild};
    body.push(child);
    setScore()
    setHighScore();
}

function drawBody() {
    body.forEach(function(entry) {
        if (entry === body[body.length-1]) {
            let image = new Image();
            if(direction === 'left') {
                if (lastMove !== 'right') {
                    image.src = 'images/headleft.png';
                } else {
                    image.src = 'images/headright.png';
                }
            } else if (direction === 'right') {
                if (lastMove !== 'left') {
                    image.src = 'images/headright.png';
                } else {
                    image.src = 'images/headleft.png';
                }
            } else if (direction === 'down') {
                if (lastMove !== 'up') {
                    image.src = 'images/headdown.png';
                } else {
                    image.src = 'images/headup.png';
                }
            } else {
                if (lastMove !== 'down') {
                    image.src = 'images/headup.png';
                } else {
                    image.src = 'images/headdown.png';
                }
            }
            ctx.drawImage(image, entry.x, entry.y);
        } else {
            ctx.drawImage(entry.image, entry.x, entry.y);
        }
    });
}

function moveBody() {
    let child = body.shift();
    child.x = xHead;
    child.y = yHead;
    body.push(child);
}

function drawApple() {
    if (!appleExists) {
        let x;
        let y;
        do {
            x = Math.floor(Math.random()*width/25)*25;
            y = Math.floor((Math.random()*height)/25)*25;
        } while(body.some(e => e.x === x) && body.some(e => e.y === y));

        createApple(x, y);
    }
    ctx.drawImage(apple.image, apple.x, apple.y);
}

function createApple(x, y) {
    let image = new Image();
    image.src = 'images/pcoin.png';
    apple = {'x': x, 'y': y, 'image': image};
    appleExists = true;
}

function checkApple() {
    if(body[body.length-1].x === apple.x && body[body.length-1].y === apple.y) {
        appleExists = false;
        for(let i = 0; i < 3; i++) {
            addChild();
        }
    }
}

function checkCollision() {
    let tempArray = body.slice(0, body.length-1);
    let temp = tempArray.filter(e => e.x === body[body.length-1].x && e.y === body[body.length-1].y
                                && e.x !== undefined && e.y !== undefined);
    if (temp.length > 0) {
        lost();
    }
}

function lost() {
    // TODO ausgabe
    init()
}

function setScore() {
    document.getElementById('score').innerHTML = 'Score: ' + (body.length).toString();
}

function setHighScore() {
    let highScore = document.getElementById('highscore');
    if (body.length > score) {
        score = body.length;
        highScore.innerHTML = 'Highscore: ' + score.toString();
        localStorage.setItem('highscore', score);
    }
}