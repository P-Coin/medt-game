'use strict'

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
let appleExists = false;
let apple;

let body = [];
let lastX;
let lastY;


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
}

window.addEventListener('keydown', changeDirection);

requestAnimationFrame(draw);
window.setInterval(draw, 50);

function changeDirection(event) {
    // down
    if (event.key === 'ArrowDown') {
        direction = 'down';
    }
    // up
    if (event.key === 'ArrowUp') {
        direction = 'up';
    }
    // left
    if (event.key === 'ArrowLeft') {
        direction = 'left'
    }

    // right
    if (event.key === 'ArrowRight') {
        direction = 'right';
    }

}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawSnake();
    drawApple();
    checkApple();
    checkCollision();
}


function drawSnake() {
    if (direction === 'down') {
        if (yPlayer < 500-gridHeight) {
            if (!body.filter(e => body.filter(k => k !== e && e.x === k.x && e.y === yPlayer + speed || console.log("k:", k," e:", e)))) {

                yPlayer += speed;
            }
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