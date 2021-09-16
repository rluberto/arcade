//Assign a variable for the canvas and game drawing methods
const canvas = document.getElementById("pongCanvas");
const game = canvas.getContext("2d");
//Assign a variable for the welcome screen and game over screen
const welcome = document.getElementById("welcome");
const gameOverC = document.getElementById("gameOver");

var backgroundMusic = true;
var audioElement0 = document.createElement('audio');
var audioElement1 = document.createElement('audio');

var refre = 0;
var refreThresh = 100;
var updates = 0;
var score = 0;
var gameIsOver = 0;

//Initialize the game
function init(){
    musicBox();
    audioElement0.volume = 0.05;
    audioElement1.volume = 0.05;
    document.getElementById("musicTogg").style.display = "inline-block";
    canvas.style.display = "block"; //Get rid of the welcome screen and get the game canvas ready to fade in
    canvas.style.opacity = 0;
    welcome.style.opacity = 0;
    gameOverC.style.opacity = 0;
    setTimeout(function(){
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
    if(gameIsOver == 0){
        clearCanvas();
        if(fallObjects.length == 0){ //Initially generate blocks
            generateFallBlocks();
        }
        if(refre % refreThresh == 0){ //If refe divided by refreThresh is evenly divible, add more blocks
            generateFallBlocks();
            refre = 0;
            if(updates > 10){
                refreThresh = 200;
            }
            updates++;
        }
        generateFall();
        refre++;
        for(i=0; i<fallObjects.length; i++){
            fallObjects[i].checkGameOver();
        }
        createText("Score: " + score, 10, 30, "blue");
    }
}

//Play the games background audio
function musicBox(track){
    var numFiles = 8;
    audioElement0.setAttribute('src', "music/" + Math.floor(Math.random() * numFiles + 1) + ".mp3");
    if(track){
        audioElement0.setAttribute('src', track);
    }
    audioElement0.setAttribute('autoplay', 'autoplay');
    audioElement0.addEventListener('ended', function() {
        audioElement0.currentTime = 0;
        audioElement0.setAttribute('src', "music/" + Math.floor(Math.random() * numFiles + 1) + ".mp3");
        if(track){
            audioElement0.setAttribute('src', track);
        }
        audioElement0.play();
    }, false);
}

//Play the games background audio
function sfxBox(track){
    audioElement1.setAttribute('src', track);
    audioElement1.play();
}

//Toggles the background music on and off
function toggleMusic(){
    if(backgroundMusic){
        backgroundMusic = false;
        audioElement0.pause();
        document.getElementById("musicTogg").style.background = "grey";
    }
    else{
        backgroundMusic = true;
        audioElement0.play();
        document.getElementById("musicTogg").style.background = "";
    }
}

//Create an array to store all of the falling blocks
var fallObjects = [];

//Create an object for all of the falling blocks
var fallBlock = function(x, y, size, speed, enemy) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.visible = 1;
    this.enemy = enemy;
    this.updatePosition = function () {
        y += speed;
        if(this.visible == 1){
            if(this.enemy == 0){
                createRect(x, y, size, size, "black");
            }
            else{
                createRect(x, y, size, size, "red");
            }
        }
    };
    this.checkClickDelete = function(mX, mY){
        if(mX >= x && mX <= x+size && mY >= y && mY <= y+size){
            if(this.enemy == 0){
                this.visible = 0;
                score++;
                sfxBox('music/point.mp3');
            }
            else{
                this.visible = 0;
                sfxBox('music/buzz.mp3');
                score -= 10;
            }
        }
    }
    this.checkGameOver = function(){
        if(this.visible ==  1 && y > 400 && this.enemy == 0){
            gameOver();
        }
    }
}

//Update the position of each falling block object in the array
function generateFall(){
    for(i=0; i<fallObjects.length; i++){
        fallObjects[i].updatePosition();
    }
}

function generateFallBlocks(){
    var amountToAdd = 0;
    if(updates <= 6){
        amountToAdd = updates;
    }
    else{
        amountToAdd = updates/2;
    }
    for(x=0; x<amountToAdd; x++){
        var xPos = Math.floor(Math.random() * 580);
        var yPosMult = 0 - Math.floor(Math.random() * 10 * updates);
        var isEnemy = 0;
        if(x > 3 && x == amountToAdd - 1){
            isEnemy = 1;
        }
        fallObjects[fallObjects.length] = new fallBlock(xPos, yPosMult, 20, 0.4, isEnemy);
        fallObjects[fallObjects.length - 1].updatePosition();
    }
}

function deleteFallBlock(x, y, i){
    for(i=0; i<fallObjects.length; i++){
        fallObjects[i].checkClickDelete(x, y);
    }
}

//If the mouse is clicked
function mouseClick(event){
    var x = event.pageX - (canvas.offsetLeft + 3);
    var y = (event.pageY - (canvas.offsetTop - 203)) - 3;
    deleteFallBlock(x, y);
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

//End the game
function gameOver(){
    gameLoop = clearInterval();
    gameIsOver = 1;
    canvas.style.opacity = 0;
    gameOverC.style.opacity = 0;
    gameOverC.style.display = "block";
    musicBox('music/gameOver.mp3');
    setTimeout(function(){
        gameOverC.style.opacity = 1;
        canvas.style.display = "none";
        document.getElementById("gameScore").innerHTML = "Score: " + score;
    }, 1000);
}
