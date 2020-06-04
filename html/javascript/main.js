'use strict'

// TODO: Leaderboards, Powerups, Difficulty

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const width = 900;
const height = 500;

let xPlayer;
let yPlayer;
const gridWidth = 25;
const gridHeight = 25;
let imagePlayer;
const speed = 25;
let direction = undefined;
let lastDir = undefined;
let appleExists = false;
let apple;


let body = [];
let lastX;
let lastY;
let requestId = undefined;
let intervalID = undefined;

function init() {
    body = [];
    xPlayer = 100;
    yPlayer = 100;
    direction = undefined;
    appleExists = false;

    imagePlayer = new Image();
    imagePlayer.src = 'images/body.png';
    let child = {'x': xPlayer, 'y': yPlayer, 'image': imagePlayer};
    body.push(child);
    window.clearInterval(intervalID);
    window.cancelAnimationFrame(requestId);
    let speed = 50;
    intervalID = window.setInterval(draw, speed);
    requestId = requestAnimationFrame(draw);
}

window.addEventListener('keydown', changeDirection);


function changeDirection(event) {
    lastDir = direction;
    // down
    if (event.key === 'ArrowDown') {
        direction = (lastDir !== 'up' || body.length === 1) ? 'down' : 'up';
    }
    // up
    if (event.key === 'ArrowUp') {
        direction = (lastDir !== 'down' || body.length === 1) ? 'up' : 'down';
    }
    // left
    if (event.key === 'ArrowLeft') {
        direction = (lastDir !== 'right' || body.length === 1) ? 'left' : 'right';
    }

    // right
    if (event.key === 'ArrowRight') {
        direction = (lastDir !== 'left' || body.length === 1) ? 'right' : 'left';
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
        if (yPlayer < 500-gridHeight) {
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
        if (xPlayer + gridWidth + speed <= width) {
            xPlayer += speed;
        } else {
            lost();
        }
    }

    moveBody();
    drawBody();
}

function addChild() {
    let imageChild = new Image();
    imageChild.src = 'images/body.png';
    let child = {'x': lastX, 'y': lastY, 'image': imageChild, };
    body.push(child);
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

        let image = new Image();
        image.src = 'images/pcoin.png';
        apple = {'x': x, 'y': y, 'image': image};
        appleExists = true;
    }

    ctx.drawImage(apple.image, apple.x, apple.y);
}

function checkApple() {
    if(body[body.length-1].x === apple.x && body[body.length-1].y === apple.y) {
        appleExists = false;
        addChild();
    }
}

function checkCollision() {
    if (body.filter(e => body.filter(k => e.x === k.x && e.y === k.y).length >= 2).length >= 2) {
        lost();
    }

}

function lost() {
    console.log('lost');
    init()
}