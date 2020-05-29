'use strict'

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const width = 900;
const height = 500;

let xPlayer;
let yPlayer;
const playerWidth = 80;
const playerHeight = 80;
let imagePlayer;
const speed = 7;


function init() {
    xPlayer = 200;
    yPlayer = 200;

    // Image initialization
    imagePlayer = new Image();
    imagePlayer.onload = function () {
        ctx.drawImage(imagePlayer, xPlayer, yPlayer);
    }
    imagePlayer.src = 'images/Pcoin3.png';

}

window.addEventListener("keydown", movePlayer)

function movePlayer(event) {
    ctx.clearRect(0, 0, 900, 500);
    // down
    if (event.key === "ArrowDown") {
        if (yPlayer < 500-playerHeight) {
            yPlayer += speed;
        } else {
            yPlayer = 500 - playerHeight;
        }
    }
    // up
    if (event.key === "ArrowUp") {
        if (yPlayer - speed > 0) {
            yPlayer -= speed;
        } else {
            yPlayer = 0;
        }
    }
    // left
    if (event.key === "ArrowLeft") {
        if (xPlayer - speed > 0) {
            xPlayer -= speed;
        } else {
            xPlayer = 0;
        }
    }

    // right
    if (event.key === "ArrowRight") {
        if (xPlayer + playerWidth + speed < width) {
            xPlayer += speed;
        } else {
            xPlayer = width-playerWidth;
        }
    }

    ctx.drawImage(imagePlayer, xPlayer, yPlayer);
}