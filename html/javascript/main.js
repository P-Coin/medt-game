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
let direction = 'up';


function init() {
    xPlayer = 101;
    yPlayer = 101;

    // Image initialization
    imagePlayer = new Image();
    imagePlayer.onload = function () {
        ctx.drawImage(imagePlayer, xPlayer, yPlayer);
    }
    imagePlayer.src = 'images/player.png';

}

window.addEventListener("keydown", changeDirection)

requestAnimationFrame(draw);
window.setInterval(draw, 150);

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
}

function draw() {
    ctx.clearRect(0, 0, width, 500);
    drawGrid();
    drawSnake();
    ctx.drawImage(imagePlayer, xPlayer, yPlayer);
}

function drawGrid() {
    for(let i = 0; i < 36; i++) {
        ctx.beginPath();
        ctx.moveTo(i*25, 0);
        ctx.lineTo(i*25, height);
        ctx.stroke();
    }
    for(let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i*25);
        ctx.lineTo(width, i*25);
        ctx.stroke();
    }
}


function drawSnake() {
    if (direction === "down") {
        if (yPlayer < 500-gridHeight) {
            yPlayer += speed;
        } else {
            yPlayer = 500 - gridHeight + 1;
        }
    }
    // up
    if (direction === "up") {
        if (yPlayer - speed > 0) {
            yPlayer -= speed;
        } else {
            yPlayer = 1;
        }
    }
    // left
    if (direction === 'left') {
        if (xPlayer - speed > 0) {
            xPlayer -= speed;
        } else {
            xPlayer = 1;
        }
    }

    // right
    if (direction === 'right') {
        if (xPlayer + gridWidth + speed < width) {
            xPlayer += speed;
        } else {
            xPlayer = width-gridWidth+1;
        }
    }
}