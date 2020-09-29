const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const tryAgain = document.querySelector(".try-again");
const successDiv = document.querySelector(".successDiv");
const failureDiv = document.querySelector(".failureDiv");
const failure = document.getElementById("failure");
const success = document.getElementById("success");
const background = new Image();
background.src = "images/background.jpg";
const life = new Image();
life.src = "images/life.png";
const pongWidth = 150;
const pong = {
    x: canvas.width / 2 - pongWidth / 2,
    y: 555,
    height: 40,
    width: pongWidth,
    score: 0,
    life: 3,
    maxScore: 24
}
const ball = {
    x: canvas.width / 2,
    y: 537,
    radius: 15,
    speed: 6,
    dx: 5 * (Math.random() * 2 - 1),
    dy: -5
}

let bricks = [];
const brick = {
    width: 100,
    height: 30,
    row: 8,
    column: 3,
    leftMargin: 30,
    topMargin: 120,
    meanHorizontalGap: 20,
    meanVerticalGap: 20
}


// Creating Bricks
function createBricks() {
    for (var r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (var c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: brick.leftMargin + r * (brick.meanHorizontalGap + brick.width),
                y: brick.topMargin + c * (brick.meanVerticalGap + brick.height),
                status: "alive"
            }
        }
    }
}

//Check for Collision between the ball and the brick
function checkBallBrickCollision() {
    for (var r = 0; r < brick.row; r++) {
        for (var c = 0; c < brick.column; c++) {
            if (bricks[r][c].status == "alive") {
                if ((ball.x + ball.radius) > bricks[r][c].x &&
                    (ball.x - ball.radius) < (bricks[r][c].x + brick.width) &&
                    (ball.y + ball.radius) > bricks[r][c].y &&
                    (ball.y - ball.radius) < (bricks[r][c].y + brick.height)) {
                    bricks[r][c].status = "dead"
                    ball.dy = -ball.dy;
                    pong.score++;
                }
            }
        }
    }
}

// Draw the bricks which are the game Obstacles
function drawBricks() {
    for (var r = 0; r < brick.row; r++) {
        for (var c = 0; c < brick.column; c++) {
            if (bricks[r][c].status === "alive") {
                context.fillStyle = '#ee046c';
                context.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
}

// Draw the neccessary components of the game
function draw() {
    drawPong();
    drawGameBall();
    drawBricks();
}

// Draw the pong of the player 
function drawPong() {
    context.beginPath();
    context.lineWidth = 5;
    context.fillStyle = '#050505';
    context.strokeStyle = 'white';
    context.fillRect(pong.x, pong.y, pong.width, pong.height);
    context.strokeRect(pong.x, pong.y, pong.width, pong.height);
    context.stroke();
}

// Draw the Game Ball
function drawGameBall() {
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, Math.PI / 180 * 0, Math.PI / 180 * 2, true);
    context.fillStyle = 'red';
    context.fill();
    context.stroke();
}

//Reset the position of the ball after player misses the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = 537;
    ball.dx = 5 * (Math.random() * 2 - 1);
    ball.dy = -5;
    pong.x = canvas.width / 2 - pongWidth / 2;
    pong.y = 555;
}

// Move Ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Check for Collision with the Wall
    if (ball.x - ball.radius < 0 || (ball.x + ball.radius) > canvas.width) {
        ball.dx = -ball.dx;
    } else if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.radius > canvas.height) {
        resetBall();
        pong.life--;
    }
}

// Check for Collision of Ball with the Pong
function pongBallCollision() {
    if (ball.x >= pong.x &&
        ball.x <= (pong.x + pong.width) &&
        (ball.y + ball.radius) > pong.y &&
        (ball.y + ball.radius) < (pong.y + pong.height)) {
        let collidePoint = (ball.x - (pong.x + pong.width / 2)) / (pong.width / 2);
        let angle = collidePoint * Math.PI / 3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -(ball.speed * Math.cos(angle));
    }
}

//Print Score and Life
function printScoreAndLife() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.drawImage(life, 850, 15, 50, 70);
    context.font = '90px Gamja Flower';
    context.fillStyle = 'black';
    context.fillText(pong.life, 910, 70);
    context.font = '50px Gamja Flower';
    context.fillText("SCORE:", 10, 70);
    context.fillText(pong.score, 150, 70);
}

// Main Game Loop
function createGameArea() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    printScoreAndLife();
    if (pong.life > 0 && pong.score < pong.maxScore) {
        draw();
        moveBall();
        pongBallCollision();
        checkBallBrickCollision();
        requestAnimationFrame(createGameArea);
    } else if (pong.score === pong.maxScore) {
        success.innerHTML = "Congradulations";
        successDiv.classList.remove("hide");
    } else {
        failure.innerHTML = "You Lost";
        failureDiv.classList.remove("hide");
    }
}
createBricks();
createGameArea();

// Move the Pong
function pongMove(dir) {
    pong.x += dir;
    // Move within the canvas limits
    if (pong.x < 0 || pong.x > (canvas.width - pong.width)) {
        pong.x -= dir;
    }
}

// Restart Game
function restartGame() {
    location.reload();
}

// Give controls to the Pong
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        pongMove(-10);
    } else if (event.keyCode === 39) {
        pongMove(10);
    }
});