const canvas = document.getElementById('canvas');
// const backgroundVideo = document.getElementById('backgroundVideo');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// backgroundVideo.height = window.innerHeight

let bombImg = "./images/bomb.png";
let planeImg = "./images/GL.png";
let shotImg = "./images/bulletImage.png"; 
let upgradeImgMissiles = "./images/upgradePic.jpg";
let upgradeImgBullets = "./images/champ 4.png";
let bulletImage = "./images/champ 5.png";

let initialPositionX = gameArea.canvas.width/2-5;
let initialPositionY = gameArea.canvas.height/2-5;

const cc = canvas.getContext('2d');

let player;
let upgradeObjForBullet;
let upgradeObjForMissile;

let gameLife;
let running = false;
let initial = true;
let blockSpeed = 2;
let speed = 0;
let maxSpeed = 5;
let alive = true;
let diff;
let score;
let num;
let progress;
let planeX = initialPositionX;
let planeY = initialPositionY;

let MissilesFired=0;
let BulletsFired=0;
let Missiles = [];
let Bullets = [];

let wSpeed=0;
let aSpeed=0;
let sSpeed=0;
let dSpeed=0;


// let keyPressed=false;
let wKeyPressed=false;
let sKeyPressed=false;
let aKeyPressed=false;
let dKeyPressed=false;

let AllUpgrades=[];
let initialMissilesSpeedTimer = 4000;
let missislesSpeedTimer=initialMissilesSpeedTimer;

let initialBulletsSpeedTimer = 2000;
let bulletsSpeedTimer=initialBulletsSpeedTimer;

let bulletUpgrades=0;
let currentBulletsUpgrades=null;
let missilesUpgrades=0;
let currentMissilesUpgrades=null;
let currentWeapon = "Bullets";


let overlay = document.getElementById("overlay")

let scoreboard = {
	score : document.getElementById("score"),
	level : document.getElementById("level"),
}

function startGame(){
	gameArea.start();
	init();
}


function init(){
	gameLife = 0;
	score = 0;
	diff = 20;
	num = 1;
	progress = 0;
	scoreboard.score.innerText = score;
	scoreboard.level.innerText = num;
	player = new playerComponent(30,30,"red",initialPositionX,initialPositionY,function(c){

		// for speed bugs going more than or less than the speed limit
		if (dSpeed > 5) {dSpeed = 5}
		if (dSpeed < 0) {dSpeed = 0}

		if (aSpeed > 5) {aSpeed = 5}
		if (aSpeed < 0) {aSpeed = 0}

		if (sSpeed > 5) {sSpeed = 5}
		if (sSpeed < 0) {sSpeed = 0}

		if (wSpeed > 5) {wSpeed = 5}
		if (wSpeed < 0) {wSpeed = 0}

		// to maintain the Acceleration after pressing the btn for awhile
		if (wKeyPressed == false) {
			if (wSpeed != 0) {
				wSpeed-=0.25;
				c.y -= wSpeed;
				c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
				planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
			}
		}
		if (aKeyPressed == false) {
			if (aSpeed != 0) {
				aSpeed-=0.25
				c.x -= aSpeed;
				c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
				planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
			}
		}
		if (sKeyPressed == false) {
			if (sSpeed != 0) {
				sSpeed-=0.25
				c.y += sSpeed;
				c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
				planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
			}
		}
		if (dKeyPressed == false) {
			if (dSpeed != 0) {
				dSpeed-=0.25
				c.x += dSpeed;
				c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
				planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
			}
		}

		// Move Action Buttons
		if(isKeyDown("w")){
			if (wSpeed != 5) {wSpeed+=0.25} // acceleration speed

			wKeyPressed = true;
			c.y -= wSpeed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
			planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
		}else{wKeyPressed = false;}

		if(isKeyDown("s")){
			if (sSpeed != 5) {sSpeed+=0.25} // acceleration speed

			sKeyPressed = true
			c.y += sSpeed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
			planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
		}else{sKeyPressed = false;}

		if(isKeyDown("d")){
			if (dSpeed != 5) {dSpeed+=0.25} // acceleration speed

			dKeyPressed = true
			c.x += dSpeed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
			planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
		}else{dKeyPressed = false;}

		if(isKeyDown("a")){
			if (aSpeed != 5) {aSpeed+=0.25} // acceleration speed

			aKeyPressed = true
			c.x -= aSpeed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
			planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
		}else{aKeyPressed = false;}


	});
	gameObjects.add(player,1);
	player.update();

}

function gameUpdate(){
	if(gameLife % 10 == 0){
		if(diff >= 90){ // to calculate how fast to level up
			diff = 20;
			num += 1;
			
			spawnUpgradeForMissiles();
			spawnUpgradeForBullets();

			scoreboard.level.innerText = num;

		}
		else{
			diff += .5;
			progress += diff;
		}
	}
	if(progress >= 100){ //  Increasing the number slows the objects spawn timer
		for(let i = 0; i < num; i++){
			spawnObject();
			// spawnUpgradeForBullets();
		}
		progress = 0;
	}
	if(gameLife % 10 == 0){
		score += 1; // to increase the score by how much every sec
		scoreboard.score.innerText = score;
	}
}


//Button event handlers

function start(){
	AllUpgrades.forEach(element => {
		clearInterval(element);
	});
	gameObjects.clear(); //  RESET GAME AND START AGAIN
	gameObjects.objects={};	

	gameArea.clear();
	planeX=initialPositionX;
	planeY=initialPositionY;
	Missiles=[];
	Bullets=[];
	MissilesFired=0;
	BulletsFired=0;

	missislesSpeedTimer=initialMissilesSpeedTimer;
	bulletsSpeedTimer=initialBulletsSpeedTimer;

	bulletUpgrades=0;
	missilesUpgrades=0;
	currentBulletsUpgrades=null;
	currentMissilesUpgrades=null;
	currentWeapon = "Missiles";
	// currentWeapon = "Bullets";
	init();
	alive = true;
	running = true;

	overlay.style.display = "none";
}

function reset(){
	gameObjects.clear();
	gameArea.clear();
	init();
	alive = true;
}

function stop(){
	running = false;
}

