const canvas = document.getElementById('canvas');
const backgroundVideo = document.getElementById('backgroundVideo');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
backgroundVideo.height = window.innerHeight

let bombImg = "./images/bomb.png";
let planeImg = "./images/GL.png";
let shotImg = "./images/test-image-3.jpg";
let upgradeImg = "./images/upgradePic.jpg";

// function to make give images border-radius
function roundedImage(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function triangleImage(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.moveTo(x , y+height-5);
	ctx.lineTo(x + width, y+height-5);
	ctx.lineTo(x + width / 2, y);
	ctx.closePath();
}


// const ctx = canvas.getContext('2d');

let player;
let theShot = null;
let gameLife;
let running = false;
let initial = true;
let blockSpeed = 2;
let speed = 5;
let alive = true;
let diff;
let score;
let num;
let progress;
let upgradeObj;
let upgrades=0;
let currentUpgrades=0;
let planeX;
let planeY;


let AllUpgrades=[];


let overlay = document.getElementById("overlay")

let inputSize = {
	width : document.getElementById("width"),
	height : document.getElementById("height"),
}

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
	player = new component(30,30,"red",gameArea.canvas.width/2-5,gameArea.canvas.height/2-5,function(c){
		if(isKeyDown("shift")){
			speed = 2;
		}
		else{
			speed = 5;
		}
		
		if(isKeyDown("w")){
			c.y -= speed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
			planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
		}
		if(isKeyDown("s")){
			c.y += speed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
			planeY = clamp(0,gameArea.canvas.height-c.height,c.y);
		}
		if(isKeyDown("d")){
			c.x += speed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
			planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
		}
		if(isKeyDown("a")){
			c.x -= speed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
			planeX = clamp(0,gameArea.canvas.width-c.width,c.x);
		}


	}, "image");
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
			upgradeObj = new component(30,30,"green",x,y,function(c){
				if(c.isTouching(player)){
					upgrades += 1;
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

			scoreboard.level.innerText = num;

		}
		else{
			diff += .5;
			progress += diff;
		}
	}
	if(progress >= 100){
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

function spawnObject(){
	side = Math.trunc(Math.random() * 4); // this random linked with the bottom cases to show the blocks randomly
	x=0;
	y=0;
	speedX = 0;
	speedY = 0;

	switch(side){
		case 0:
			x = -20;
			y = Math.trunc(Math.random() * gameArea.canvas.height-20);
			speedX = blockSpeed;
			break;  // Left Side Blocks 
		case 2:
			x = gameArea.canvas.width;
			y = Math.trunc(Math.random() * gameArea.canvas.height-20);
			speedX = -1 * blockSpeed;
			break; // right Side Blocks 
		case 1:
			x = Math.trunc(Math.random() * gameArea.canvas.width-20);
			y = -20;
			speedY = blockSpeed;
			break;  // top Side Blocks 
		case 3:
			x = Math.trunc(Math.random() * gameArea.canvas.width-20);
			y = gameArea.canvas.height;
			speedY = -1 * blockSpeed;
			break; // bottom Side Blocks 
	}

	obj = new component(40,40,"green",x,y,function(c){

		if(c.isTouching(player)){

			AllUpgrades.forEach(element => {
				clearInterval(element);
			});
			alive = false;
			running = false;
			overlay.style.display = "flex";
			console.log("Game finished with a score of: "+score);

		}
		if (theShot != null) {
			if(c.isTouching(theShot) && theShot.isAlive){
				animateParticules(c.x, c.y);  // the explotion animation with x and y
				theShot.isAlive = false; // to destroy the shot too
				console.log("bomb Destroyed");
				gameObjects.remove(c);
			}
		}

		if(!c.isOnScreen()){
			gameObjects.remove(c);
		}
	}, "blocks");
	obj.speedX = speedX;
	obj.speedY = speedY;



	gameObjects.add(obj,1);
}

function component(width, height, color, x, y, action, type){
	this.width = width;
	this.height = height;
	this.color = color;
	this.x = x;
	this.speedX = 0;
	this.speedY = 0;
	this.y = y;
	this.action = action;
	this.isAlive=true;
	
	if (type == "image") {
		this.img = new Image();
		this.img.src = planeImg;
		this.img.onload = () => {
			ctx.save();
			roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();

		};
	}else if (type == "blocks"){
		this.img = new Image();
		this.img.src = bombImg;
		this.img.onload = () => {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		};
	}else if (type == "Shot"){
		this.img = new Image();
		this.img.src = shotImg;
		this.img.onload = () => {
			ctx.save();
			triangleImage(ctx, this.x, this.y, this.width, this.height);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();
		};
	}else if(type == "upgradeObj"){
		this.img = new Image();
		this.img.src = upgradeImg;
		this.img.onload = () => {
			ctx.save();
			roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();
		};
	}

	this.update = function(){
		action(this);
		this.x += this.speedX;
		this.y += this.speedY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		if (type == "image"){
			ctx.save();
			roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();

		}else if (type == "blocks"){
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}else if (type == "Shot"){
			ctx.save();
			triangleImage(ctx, this.x, this.y, this.width, this.height);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();
		}else if (type == "upgradeObj"){
			ctx.save();
			roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();
		}

	}
	this.isTouching = function(other){
		let yes = true;
		if(other.x + other.width -5 < this.x || this.x + this.width -5 < other.x){
			yes = false;
		}
		if(other.y + other.height -5 < this.y || this.y + this.height -5 < other.y){
			yes = false;
		}
		return yes;
	}

	this.isOnScreen = function(){
		if(this.x + this.width > 0 || this.x < gameArea.canvas.width){
			return true;
		}
		if(this.y + this.height > 0 || this.y < gameArea.canvas.height){
			return true;
		}
		return false;
	}
	this.update();
}

let gameObjects = {
	objects : {},
	add : function(obj, layer){
		if(layer in gameObjects.objects){
			gameObjects.objects[layer].push(obj);
		}
		else{
			gameObjects.objects[layer] = new Array();
			gameObjects.objects[layer].push(obj);
		}
	},
	remove : function(obj){
		for(let layer in gameObjects.objects){
			let i = gameObjects.objects[layer].indexOf(obj)
			if(i != -1){
				gameObjects.objects[layer].splice(i,1);
			}
		}
	},
	clear : function(){
		gameObjects.objects = {};
	},
	update : function(){
		let highest = 0;
		for(let layer in gameObjects.objects){
			if(highest < layer){
				highest = layer;
			}
		}
		for(let layer = 0; layer <= highest; layer++){
			if(layer in gameObjects.objects){
				for(let i = 0; i < gameObjects.objects[layer].length; i++){
					gameObjects.objects[layer][i].update();
				}
			}
		}
	},
}

let gameArea = {
	canvas : document.getElementById("canvas"),
	start : function(){
		this.context = this.canvas.getContext("2d");
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
}

function updateGameArea() {
	if(running){
		gameLife += 1;
		gameArea.clear();
		gameUpdate();
		gameObjects.update();
	}
}

function clamp(low, high, test) {
	if(test < low){
		return low;
	}
	if(test > high){
		return high;
	}
	return test;
}

//Button event handlers
function reset(){
	gameObjects.clear();
	gameArea.clear();
	init();
	alive = true;
}

function start(){
	AllUpgrades.forEach(element => {
		clearInterval(element);
	});
	gameObjects.clear(); //  RESET GAME AND START AGAIN
	gameObjects.objects={};	

	gameArea.clear();
	upgrades=0;
	currentUpgrades=0;
	init();
	alive = true;
	running = true;

	overlay.style.display = "none";
}

function stop(){
	running = false;
}

function resize(){
	gameArea.canvas.width = inputSize.width.value;
	gameArea.canvas.height = inputSize.height.value;
	reset();
}



