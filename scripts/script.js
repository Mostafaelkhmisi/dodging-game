const canvas = document.getElementById('canvas');
// const backgroundVideo = document.getElementById('backgroundVideo');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// backgroundVideo.height = window.innerHeight

let bombImg = "./images/bomb.png";
let planeImg = "./images/GL.png";
let shotImg = "./images/test-image-3.jpg";
let upgradeImg = "./images/upgradePic.jpg";

let initialPositionX = gameArea.canvas.width/2-5;
let initialPositionY = gameArea.canvas.height/2-5;

const cc = canvas.getContext('2d');

let player;
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
let upgradeObj;
let upgrades=0;
let currentUpgrades=0;
let planeX = initialPositionX;
let planeY = initialPositionY;

let ShotsFired=0;
let Shots = [];

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
let initialShotsSpeedTimer = 4000;
let shotsSpeedTimer=initialShotsSpeedTimer;
let currentShotsSpeedTimer=0;

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
	player = new component(30,30,"red",initialPositionX,initialPositionY,function(c){

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


	}, "player");
	gameObjects.add(player,2);
	player.update();

}

function gameUpdate(){
	if(gameLife % 10 == 0){
		if(diff >= 90){ // to calculate how fast to level up
			diff = 20;
			num += 1;


			side = Math.trunc(Math.random() * 4); // this random linked with the bottom cases to show the blocks randomly
			x=0;
			y=0;
			speedX = 0;
			speedY = 0;
			switch(side){
				case 0:
					x = -20;
					y = Math.trunc(Math.random() * gameArea.canvas.height-20);
					speedX = blockSpeed+1;
					break;  // Left Side Blocks 
				case 2:
					x = gameArea.canvas.width;
					y = Math.trunc(Math.random() * gameArea.canvas.height-20);
					speedX = -2 * blockSpeed;
					break; // right Side Blocks 
				case 1:
					x = Math.trunc(Math.random() * gameArea.canvas.width-20);
					y = -20;
					speedY = blockSpeed+1;
					break;  // top Side Blocks 
				case 3:
					x = Math.trunc(Math.random() * gameArea.canvas.width-20);
					y = gameArea.canvas.height;
					speedY = -2 * blockSpeed;
					break; // bottom Side Blocks 
			}
			if (shotsSpeedTimer > 500) {
				upgradeObj = new component(30,30,"green",x,y,function(c){
					if(c.isTouching(player)){
						upgrades += 1;
						shotsSpeedTimer = shotsSpeedTimer-shotsSpeedTimer*0.1;
						// shotsSpeedTimer = shotsSpeedTimer-shotsSpeedTimer*0.5;
						gameObjects.remove(c);
						console.log("Upgrade Level"+upgrades);
					}
					if(!c.isOnScreen()){
						gameObjects.remove(c);
					}
				}, "upgradeObj");
				upgradeObj.speedX = speedX;
				upgradeObj.speedY = speedY;
				gameObjects.add(upgradeObj,4);
			}

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
	setTimeout(() => {
		upgrades=1;
	currentUpgrades=1;	
	}, 2000);

	planeX=initialPositionX;
	planeY=initialPositionY;
	Shots=[];
	ShotsFired=0;
	shotsSpeedTimer=initialShotsSpeedTimer;
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

