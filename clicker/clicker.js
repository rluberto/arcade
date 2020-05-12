//Assign a variable for the canvas and game drawing methods
const canvas = document.getElementById("pongCanvas");
const game = canvas.getContext("2d");
//Assign a variable for the welcome screen and game over screen
const welcome = document.getElementById("welcome");
const gameOverC = document.getElementById("gameOver");

var backgroundMusic = true;
var audioElement0 = document.createElement('audio');
var refre = 0;
var refreThresh = 600;
var updates = 0;

//Initialize the game
function init(){
    musicBox();
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
    clearCanvas();
    if(fallObjects.length == 0){ //Initially generate blocks
        generateFallBlocks();
    }
    if(refre % refreThresh == 0){ //If refe divided by refreThresh is evenly divible, add more blocks
        generateFallBlocks();
        refre = 0;
        if(refreThresh > 100){
            refreThresh -= 20;
        }
        updates++;
    }
    generateFall();
    refre++;
    console.log(refre);
}

//Play the games background audio
function musicBox(){
    var numFiles = 8;
    audioElement0.setAttribute('src', "music/" + Math.floor(Math.random() * numFiles + 1) + ".mp3");
    audioElement0.setAttribute('autoplay', 'autoplay');
    audioElement0.addEventListener('ended', function() {
        audioElement0.currentTime = 0;
        audioElement0.setAttribute('src', "music/" + Math.floor(Math.random() * numFiles + 1) + ".mp3");
        audioElement0.play();
    }, false);
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
var fallBlock = function(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.updatePosition = function () {
        y += speed;
        createRect(x, y, size, size, "black");
    };
}

//Update the position of each falling block object in the array
function generateFall(){
    for(i=0; i<fallObjects.length; i++){
        fallObjects[i].updatePosition();
    }
}

function generateFallBlocks(){
    for(x=0; x<updates; x++){
        var xPos = Math.floor(Math.random() * 580);
        var yPosMult = 0 - Math.floor(Math.random() * 10 * updates);
        fallObjects[fallObjects.length] = new fallBlock(xPos, yPosMult, 20, 0.3);
        fallObjects[fallObjects.length - 1].updatePosition();
        console.log(fallObjects);
    }
}

//If the mouse is clicked
function mouseClick(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - (canvas.offsetTop - 200);
  var coords = "X coords: " + x  + ", Y coords: " + y + " ";
  alert(coords);
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
    canvas.style.opacity = 0;
    gameOverC.style.opacity = 0;
    gameOverC.style.display = "block";
    setTimeout(function(){
        gameOverC.style.opacity = 1;
        canvas.style.display = "none";
        document.getElementById("gameScore").innerHTML = "Score: " + iteration;
    }, 1000);
}