// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

let player;
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
		
		if(isKeyDown("w") || isKeyDown("up")){
			c.y -= speed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
		}
		if(isKeyDown("s") || isKeyDown("down")){
			c.y += speed;
			c.y = clamp(0,gameArea.canvas.height-c.height,c.y);
		}
		if(isKeyDown("d") || isKeyDown("right")){
			c.x += speed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
		}
		if(isKeyDown("a") || isKeyDown("left")){
			c.x -= speed;
			c.x = clamp(0,gameArea.canvas.width-c.width,c.x);
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
	// side = 3
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
	obj = new component(20,20,"green",x,y,function(c){
		if(c.isTouching(player)){
			alive = false;
			running = false;
			console.log("Game finished with a score of: "+score);
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
	
	if (type == "image") {
		this.img = new Image();
		this.img.src = "./style/giphy.gif";
		this.img.onload = () => {
			// ctx.clearRect(0, 0, this.width, this.height);
			ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
		};
	}

	this.update = function(){
		action(this);
		this.x += this.speedX;
		this.y += this.speedY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		if (type == "image") {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
		}else{
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
		


	}
	this.isTouching = function(other){
		let yes = true;
		if(other.x + other.width < this.x || this.x + this.width < other.x){
			yes = false;
		}
		if(other.y + other.height < this.y || this.y + this.height < other.y){
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
	if(alive){
		running = true;
	}
}

function stop(){
	running = false;
}

function resize(){
	gameArea.canvas.width = inputSize.width.value;
	gameArea.canvas.height = inputSize.height.value;
	reset();
}
