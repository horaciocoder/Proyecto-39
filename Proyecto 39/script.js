var canvas;
var canvasColor = 255;
var bgColor;

var ground, groundImg, invisibleGround;

var trex, trexRun, trexDie;

var obstacles;

var obsImg1, obsImg2, obsImg3, obsImg4, obsImg5, obsImg6;

var score;

var checkPointAudio, dieSound, jumpSound;

var gameState;

var dieS;

var endButton, endImg;

var cloudImg;
var clouds;
function preload() {
    groundImg = loadImage("images/ground2.png");
    trexRun = loadAnimation("images/trex1.png", "images/trex3.png", "images/trex4.png");
    trexDie = loadAnimation("images/trex_collided.png");
    obsImg1 = loadImage("images/obstacle1.png");
    obsImg2 = loadImage("images/obstacle2.png");
    obsImg3 = loadImage("images/obstacle3.png");
    obsImg4 = loadImage("images/obstacle4.png");
    obsImg5 = loadImage("images/obstacle5.png");
    obsImg6 = loadImage("images/obstacle6.png");

    checkPointAudio = loadSound("audio/checkPoint.mp3");
    dieSound = loadSound("audio/die.mp3");
    jumpSound = loadSound("audio/jump.mp3");

    endImg = loadImage("images/restart.png");

    cloudImg = loadImage("images/cloud.png");
}
function setup() {
    canvas = createCanvas(displayWidth - 50, displayHeight - 170);
    ground = createSprite(displayWidth / 2, displayHeight * (3/4), displayWidth, displayHeight / 5);
    ground.addImage("ground", groundImg);
    trex = createSprite(displayWidth / 4, displayHeight * (2/3), displayWidth / 15, displayWidth / 15);
    trex.addAnimation("running", trexRun);
    trex.setAnimation("running");
    invisibleGround = createSprite(displayWidth / 2, displayHeight * (3/4), displayWidth, 10);
    invisibleGround.y += 4.5;
    invisibleGround.visible = false;
    obstacles = [];
    clouds = [];
    gameState = 1;
    dieS = true;
    endButton = createSprite(displayWidth / 2, displayHeight * (1/4), 10, 10);
    endButton.addImage("retry", endImg);
    endButton.scale = 1.5;
    endButton.visible = false;
}
function draw() {
    background(canvasColor);
    if (canvasColor === 0) {
        bgColor = "black";
    }
    else if (canvasColor === 255) {
        bgColor = "white";
    }
    if (gameState === 1) {
    camera.position.x = camera.position.x + 10;
    if (camera.position.x % 68 === 10) {
        ground.x = camera.position.x;
        invisibleGround.x = ground.position.x;
    }
    trex.velocityX = 10;
    if (keyDown("space") && trex.y > 520) {
        Jump(20);
    }
    Gravity(9.81);
    if (frameCount % 40 === 0) {
        generateObstacle();
    }
    getScore();
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].isTouching(trex)) {
            console.log("Game Over");
            var obs = obstacles[i];
            gameState = 0;
        }
        if (obstacles[i].x < trex.x - (camera.position.x / 4)) {
            var obs = obstacles[i];
            obstacles.splice(i, i + 1);
            obs.destroy();
        }
    }
    if (score % 100 === 0) {
        checkPointAudio.play();
    }
    if (score % 1000 === 0) {
        if (canvasColor === 0) {
            canvasColor = 255;
        }
        else if (canvasColor === 255) {
            canvasColor = 0;
        }
    }
    console.log(camera.position.x);
}
else if (gameState === 0) {
    if (!dieS === false) {
        dieSound.play();
    }
    dieS = false;
    trex.velocityX = 0;
    trex.velocityY = 0;
    trex.addAnimation("running", trexDie);
    trex.setAnimation("running");
    for (let i = 0; i < obstacles.length; i++) {
        var obs = obstacles[i];
        obs.velocityX = 0;
    }
    for (let i = 0; i < clouds.length; i++) {
        var cl = clouds[i];
        cl.velocityX = 0;
    }
    endButton.x = camera.position.x;
    endButton.visible = true;
    if (mousePressedOver(endButton)) {
    canvasColor = 255;
    endButton.visible = false;
    for (let i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];
    obs.destroy();
    if (i === obstacles.length) {
        obstacles = [];
    }
    }
    for (let i = 0; i < clouds.length; i++) {
        var cl = clouds[i];
        cl.destroy();
        if (i === clouds.length) {
            clouds = [];
        }
        }
    score = 0;
    frameCount = 0;
    trex.addAnimation("running", trexRun);
    trex.setAnimation("running");
    dieS = true;
    gameState = 1;
    }
}
    textSize(15);
    text(score, camera.position.x + displayWidth / 3, 100);
    trex.collide(invisibleGround);
    drawSprites();
    document.body.setAttribute("style", "background-color: " + bgColor);
}
function Jump(Intensity) {
    if (trex.y > 520) {
        jumpSound.play();
    }
    trex.velocityY = -Intensity;
}
function Gravity(amount) {
    amount /= 10;
    trex.velocityY = trex.velocityY + amount;
}
function getRandom(min, max) {
    return Math.round(Math.floor(Math.random() * max) + min);
}
function generateObstacle() {
    var rand = getRandom(1, 6);
    var img;
    switch (rand) {
        case 1:
            img = obsImg1;
        break;
        case 2:
            img = obsImg2;
        break;
        case 3:
            img = obsImg3;
        break;
        case 4:
            img = obsImg4;
        break;
        case 5:
            img = obsImg5;
        break;
        case 6:
            img = obsImg6;
        break;
        default:
            img = obsImg1;
        break;
    }
    let obs = createSprite(camera.position.x * 2, displayHeight * (3/4), displayWidth / 15, displayWidth / 15);
    obs.y -= 40;
    obs.velocityX = -10;
    obs.scale = 1.2;
    obs.depth = trex.depth;
    trex.depth++;
    obs.addImage("obs", img);
    obstacles.push(obs);

    var cloud = createSprite(camera.position.x * 2 + getRandom(-500, 500), displayHeight * (1/4), displayWidth / 20, displayWidth / 20);
    cloud.velocityX = -10;
    cloud.depth = trex.depth;
    trex.depth++;
    cloud.addImage("cloud", cloudImg);
    clouds.push(cloud);
}
function getScore() {
    score = Math.round(frameCount);
}