'use strict'

// TODO: Leaderboard, Power ups

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const width = 900;
const height = 500;

let xPlayer;
let yPlayer;
const speed = 25;
let direction = undefined;
let lastDir = undefined;
let appleExists = false;
let apple;
let score = 0;

let body = [];
let requestId = undefined;
let intervalID = undefined;

function init() {
    body = [];
    xPlayer = 100;
    yPlayer = 100;
    direction = undefined;
    appleExists = false;

    addChild(xPlayer, yPlayer);
    stopAnimation();
    startAnimation();
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
            speed = 80;
            break;
        case 'medium':
            speed = 65;
            break;
        case 'hard':
            speed = 45;
            break;
        case 'expert':
            speed = 35;
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

window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    lastDir = direction;

    // down
    if (event.key === 'ArrowDown') {
        direction = (lastDir !== 'up' || body.length === 1) ? 'down' : 'up';
        event.preventDefault();
    }
    // up
    if (event.key === 'ArrowUp') {
        direction = (lastDir !== 'down' || body.length === 1) ? 'up' : 'down';
        event.preventDefault();
    }
    // left
    if (event.key === 'ArrowLeft') {
        direction = (lastDir !== 'right' || body.length === 1) ? 'left' : 'right';
        event.preventDefault();
    }

    // right
    if (event.key === 'ArrowRight') {
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
        if (yPlayer < 500-speed) {
            yPlayer += speed;
        } else {
            lost();
        }
    }
    // up
    if (direction === 'up') {
        if (yPlayer - speed >= 0) {
            yPlayer -= speed;
        } else {
            lost();
        }
    }
    // left
    if (direction === 'left') {
        if (xPlayer - speed >= 0) {
            xPlayer -= speed;
        } else {
            lost();
        }
    }

    // right
    if (direction === 'right') {
        if (xPlayer + speed + speed <= width) {
            xPlayer += speed;
        } else {
            lost();
        }
    }

    moveBody();
    drawBody();
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
        ctx.drawImage(entry.image, entry.x, entry.y);
    });
}

function moveBody() {
    let child = body.shift();
    child.x = xPlayer;
    child.y = yPlayer;
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
        addChild();
    }
}

function checkCollision() {
    let tempArray = body.slice(0, body.length-1);
    let temp = tempArray.filter(e => e.x === body[body.length-1].x && e.y === body[body.length-1].y);
    if (temp.length > 0) {
        lost();
    }
}

function lost() {
    console.log('lost');
    init()
}

function setScore() {
    document.getElementById('score').innerHTML = 'Score: ' + (body.length-1).toString();
}

function setHighScore() {
    let highScore = document.getElementById('highscore');
    if (body.length-1 > score) {
        score = body.length-1;
        highScore.innerHTML = 'Highscore: ' + score.toString();
    }
}