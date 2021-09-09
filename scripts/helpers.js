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

function triangleImage(ctx, x, y, width, height, angle) {
	ctx.translate(x + (width / 2), y + (height/2));
	ctx.rotate(angle);
	ctx.translate(-x - (width / 2), -y - (height/2));

	ctx.beginPath();
	ctx.moveTo(x , y+height-5);
	ctx.lineTo(x + width, y+height-5);
	ctx.lineTo(x + width / 2, y);
	ctx.closePath();
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
	this.angle;
	
	if (type == "player") {
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
		if (type == "player"){
			ctx.save();
			roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
			ctx.clip();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.restore();

		}else if (type == "blocks"){
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

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



function randomShotsWithObjectDetection(width, height, x, y, action, target){
	this.width = width;
	this.height = height;
	this.x = x;
	this.speedX = 0;
	this.speedY = 0;
	this.y = y;
	this.action = action;
	this.isAlive=true;
	this.angle;
	this.target = target;
	this.targeting = false;
	this.dx;
	this.dy;

	this.img = new Image();
	this.img.src = shotImg;
	this.img.onload = () => {
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	};

	this.update = function(){
		action(this);
		if (this.targeting == false) {
			this.x += this.speedX;
			this.y += this.speedY;	
		}
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

		// setTimeout(() => {

			this.targeting = true;
			origX = this.target.x;
			origY = this.target.y;
			this.dx = (origX - this.x) * .125;
			this.dy = (origY - this.y) * .125;
			//calculate the distance this would move ...
			distance = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
			//... and cap it at 5px
			if(distance > 3){
				this.dx *= 3/distance;
				this.dy *= 3/distance;
			}
			
			let angle = Math.atan2(this.dy,  this.dx) + 1.6;
	
			this.angle = angle;
			this.x += this.dx;
			this.y += this.dy;
		// }, 500);

		if (this.isAlive == false) {
			let AllGameObjects = gameObjects.objects[1];
			if (AllGameObjects != null && running == true) {
				var minLength = 8000;
				var minObj = [];
				origX = this.x;
				origY = this.y;
				AllGameObjects.forEach((element, index) => {
					if(Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2) < minLength){
						minObj.push(element);
						minLength = Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2);
					 }
				});
				AllGameObjects.forEach((element1, index) => {
					minObj.forEach(element2 => {
						if(element1 == element2){
							animateParticules(element2.x, element2.y);
							element2.isAlive=false
							gameObjects.remove(element2);
							closestObject = element2
						}else{ // the rest of objects
						}
					});

				});
			}
		}

		if (this.target.isAlive == false) {
			let AllGameObjects = gameObjects.objects[1];
			if (AllGameObjects != null && running == true) {
				var minLength = 10000000;
				var minObj = null;
				origX = this.x;
				origY = this.y;
				AllGameObjects.forEach((element, index) => {
					if(Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2) < minLength){
						minObj = element;
						minLength = Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2);
					 }
				});
				AllGameObjects.forEach((element, index) => {
					if(element == minObj){
						this.target = element
					}else{ // the rest of objects
					}
				});
			}

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


function updateGameArea() {
	if(running){
		gameLife += 1;
		gameArea.clear();
		gameUpdate();
		gameObjects.update();
	}
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



function clamp(low, high, test) {
	if(test < low){
		return low;
	}
	if(test > high){
		return high;
	}
	return test;
}