let canvas;
let ctx;
let ballX = 50;
let ballSpeedX = 10;
let ballY = 50;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100
const PADDLE_THICKNESS = 10;

function calculateMouse(e){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX -rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt){
    if(showWinScreen){
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    let fps = 30;
    setInterval(function callBoth(){
        moveAll();
        drawAll();
    }, 1000/fps)

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', function(e){
        let mousePos = calculateMouse(e);
        paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
    })
}

function ballReset(){
    if (player1Score >= WINNING_SCORE || 
        player2Score >= WINNING_SCORE){
            showWinScreen = true;
        }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement(){
    if (paddle2Y+PADDLE_HEIGHT/2 < ballY -35){
        paddle2Y += 5;
    } else if (paddle2Y+PADDLE_HEIGHT > ballY +35){
        paddle2Y -=5;
    }
}

function moveAll(){
    if(showWinScreen){
        return;
    }
    
    computerMovement()


    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX > canvas.width){
        if(ballY > paddle2Y && 
            ballY < paddle2Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX

                let deltaY = ballY
                    -(paddle2Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++; // Must be before ballReset()
                ballReset();
            }
    }
    if(ballX < 0){
        if(ballY > paddle1Y && 
            ballY < paddle1Y + PADDLE_HEIGHT){
                ballSpeedX = -ballSpeedX

                let deltaY = ballY
                    -(paddle1Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player2Score++; // Must be before ballReset()
                ballReset();
            }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
    // if(ballY > paddle2Y+PADDLE_HEIGHT/2){
    //     paddle2Y+=6;
    // }
    // if (ballY < paddle2Y+PADDLE_HEIGHT/2){
    //     paddle2Y -=6;
    // }
}

function drawNet(){
    for(let i=0; i<canvas.height; i+=40){
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

function drawAll(){
    // Blanks out screen with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showWinScreen){
        ctx.fillStyle = 'white';
        console.log(player1Score, ' 2: ', player2Score);
        if(player1Score >= WINNING_SCORE){
            ctx.fillText('Left Player Won!!', 350, 300)
        } else if(player2Score >= WINNING_SCORE){
            ctx.fillText('Right Player Won!!', 350, 300)
        }
        ctx.fillText('Click to Continue', 350, 500)
        return;
    }

    drawNet();

    // This is the left paddle
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');
    // This is the right paddle
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white')
    // Draws the ball
    colorCircle(ballX, ballY, 10, 'magenta');

    ctx.fillText(player1Score, 100,100, 60);
    ctx.fillText(player2Score, 600, 100);

}

function colorCircle(centerX, centerY, radius, drawColor){
    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    ctx.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
    ctx.fillStyle = drawColor;
    ctx.fillRect(leftX,topY,width, height)

}