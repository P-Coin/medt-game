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

let body = [];
let lastX;
let lastY;


function init() {
    xPlayer = 100;
    yPlayer = 100;

    // Image initialization
    imagePlayer = new Image();
    imagePlayer.onload = function () {
        ctx.drawImage(imagePlayer, xPlayer, yPlayer);
    }
    imagePlayer.src = 'images/head.png';

}

window.addEventListener("keydown", changeDirection)

requestAnimationFrame(draw);
window.setInterval(draw, 250);

function changeDirection(event) {
    // down
    if (event.key === "ArrowDown") {
        direction = 'down';
    }
    // up
    if (event.key === "ArrowUp") {
        direction = 'up';
    }
    // left
    if (event.key === "ArrowLeft") {
        direction = 'left'
    }

    // right
    if (event.key === "ArrowRight") {
        direction = 'right';
    }

    if (event.key === " ") {
        addChildren();
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawSnake();
    ctx.drawImage(imagePlayer, xPlayer, yPlayer);
}


function drawSnake() {
    if (direction === "down") {
        if (yPlayer < 500-gridHeight) {
            yPlayer += speed;
        } else {
            yPlayer = 500 - gridHeight;
        }
    }
    // up
    if (direction === "up") {
        if (yPlayer - speed > 0) {
            yPlayer -= speed;
        } else {
            yPlayer = 0;
        }
    }
    // left
    if (direction === 'left') {
        if (xPlayer - speed > 0) {
            xPlayer -= speed;
        } else {
            xPlayer = 0;
        }
    }

    // right
    if (direction === 'right') {
        if (xPlayer + gridWidth + speed < width) {
            xPlayer += speed;
        } else {
            xPlayer = width-gridWidth;
        }
    }

    body.forEach(drawBody);
}

function addChildren() {
    let imageChild = new Image();
    imageChild.src = 'images/body.png';
    let child = {'x': lastX, 'y': lastY, 'image': imageChild};
    body.push(child);
}

function drawBody(entry) {
    ctx.drawImage(entry.image, entry.x, entry.y);
    let child = body.pop();
    lastX = child.x;
    lastY = child.y;
    child.x = xPlayer;
    child.y = yPlayer;
    body.unshift(child);
}

