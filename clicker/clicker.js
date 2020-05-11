//Assign a variable for the canvas and game drawing methods
const canvas = document.getElementById("pongCanvas");
const game = canvas.getContext("2d");
//Assign a variable for the welcome screen and game over screen
const welcome = document.getElementById("welcome");
const gameOverC = document.getElementById("gameOver");

//Initialize the dynamic coordinates for the game elements
let paddleX = 250;
let ballX = 300;
let ballY = 200;
let ballXChange = 0;
let ballYChange = 1;
let iteration = 0;

//Initialize the game
function init(){
    canvas.style.display = "block"; //Get rid of the welcome screen and get the game canvas ready to fade in
    canvas.style.opacity = 0;
    welcome.style.opacity = 0;
    gameOverC.style.opacity = 0;
    setTimeout(function(){
        createRect(paddleX, 380, 100, 20, "black"); //Create the paddle in the initial position
        createCircle(ballX, ballY, 10, "blue"); //Create the ball in the initial position
        canvas.style.opacity = 1; //Fade in the game screen and fully remove the inviisble welcome screen
        welcome.style.display = "none";
        gameOverC.style.display = "none";
    }, 1000);
    setTimeout(function() {
        let gameLoop = setInterval(refreshCanvas, 1000/50); //Loop the game by refreshing the canvas 50 times per second
    }, 2000);
}

//Refresh the canvas
function refreshCanvas(){
    clearCanvas();
    updateBall();
    createRect(paddleX, 380, 100, 20, "black");
    createText("Speed: " + Math.abs(ballYChange), 10, 30, "black");
    createText("Score: " + iteration, 10, 60, "black");
}

//Updates the position of the ball automatically
function updateBall(){
    if(ballY >= 370 && ballY < 371 && ballX >= paddleX && ballX <= paddleX+100){ //If the ball hits the paddle change directions
        ballYChange = 0 - ballYChange;
        ballXChange = Math.floor(Math.random() * 4) - (Math.random() + 1 * 2);
        while(ballXChange == 1){
            ballXChange = Math.floor(Math.random() * 4) - (Math.random() + 1 * 2);
        }
        iterationCheck();
    }
    if(ballY < 10){ //If the ball hits the top change directions
        ballYChange = 0 - ballYChange;
    }
    if(ballX > 590 || ballX < 10){ //If the ball hits the sides of the canvas
        ballXChange = 0 - ballXChange;
    }
    if(ballY > 410){ //If the ball hits the bottom of the canvas end the game
        gameOver();
    }
    ballX += ballXChange; //Update the ball position by adding the assigned speed
    ballY += ballYChange;
    createCircle(ballX, ballY, 10, "blue");
}

//Handles the scoring aspect of the game
function iterationCheck(){
    iteration++; //Add 1 to the score
    if(iteration % 2 == 0){ //If the score is evenly divided by 2, increase the speed by .5
        if(ballYChange > 0){
            ballYChange = ballYChange + .5;
        }
        else{
            ballYChange = ballYChange - .5;
        }
    }
}

//Creates a rectangle
function createRect(x, y, w, h, color){
    game.fillStyle = color;
    game.fillRect(x, y, w, h);
}

//Creates a circle
function createCircle(x, y, r, color){
    game.fillStyle = color;
    game.beginPath();
    game.arc(x, y, r, 0, Math.PI*2, false);
    game.closePath();
    game.fill();
}

//Creates text
function createText(text, x, y, color){
    game.fillStyle = color;
    game.font = "20px Arial";
    game.fillText(text, x, y);
}

//Create the white overlay
function clearCanvas(){
    createRect(0, 0, 600, 400, "white");
}

document.onkeydown = function(event){
    if(event.keyCode == 37 && paddleX > 0){ //If the left key is pressed and not out of bounde
        paddleX-=10;
    }
    if(event.keyCode == 39 && paddleX < 500){ //If the right key is pressed and not out of bounds
        paddleX+=10;
    }
}

//End the game
function gameOver(){
    gameLoop = clearInterval();
    ballXChange = 0;
    ballYChange = 0;
    canvas.style.opacity = 0;
    gameOverC.style.opacity = 0;
    gameOverC.style.display = "block";
    setTimeout(function(){
        gameOverC.style.opacity = 1;
        canvas.style.display = "none";
        document.getElementById("gameScore").innerHTML = "Score: " + iteration;
    }, 1000);
}