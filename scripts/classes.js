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
	this.dmg = 100;

	this.currentXSpeed;
	this.currentYSpeed;

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
			// this.currentYSpeed = this.speedY;
			// this.currentXSpeed = this.speedX;
			this.x += this.speedX;
			this.y += this.speedY;	
		}
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

		if (this.dx != null && this.speedX > this.dx) {
			this.speedX = this.dx;
		}
		if (this.dy != null && this.speedY > this.dy) {
			this.speedY = this.dy;
		}
		setTimeout(() => {
			this.targeting = true;
			let data = getDistanceAndAngleAndDxDy(this.target.x, this.target.y, this.x, this.y)
			this.angle = data.angle;
			this.x += data.dx;
			this.y += data.dy;
		}, 500);


		if (this.isAlive == false) {
			let AllGameObjects = gameObjects.objects[2];
			if (AllGameObjects != null && running == true) {
				var minLength = 6000;
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
			let AllGameObjects = gameObjects.objects[2];
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

			// let angle = (this.angle - 90) / 180 * Math.PI;  // compensate angle -90°, conv. to rad
			// let angle = this.angle / 180 * Math.PI;  // compensate angle -90°, conv. to rad
			// this.x += Math.cos(angle) *3;          // move ship
			// this.y += Math.sin(angle) *3;
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



function BulletsWithUpgrade(width, height, x, y, action, target){
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
	this.dmg = 50;

	this.currentXSpeed;
	this.currentYSpeed;

	this.img = new Image();
	this.img.src = bulletImage;
	this.img.onload = () => {
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	};

	this.update = function(){
		action(this);
		// if (this.targeting == false) { 
			// this.currentYSpeed = this.speedY;
			// this.currentXSpeed = this.speedX;
			this.x += this.speedX;
			this.y += this.speedY;	
		// }
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

		// this.targeting = true;
		// let data = getDistanceAndAngleAndDxDy(this.target.x, this.target.y, this.x, this.y)
		// this.angle = data.angle;
		// this.x += data.dx;
		// this.y += data.dy;


		// if (this.target.isAlive == false) {
		// 	let AllGameObjects = gameObjects.objects[2];
		// 	if (AllGameObjects != null && running == true) {
		// 		var minLength = 10000000;
		// 		var minObj = null;
		// 		origX = this.x;
		// 		origY = this.y;
		// 		AllGameObjects.forEach((element, index) => {
		// 			if(Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2) < minLength){
		// 				minObj = element;
		// 				minLength = Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2);
		// 			 }
		// 		});
		// 		AllGameObjects.forEach((element, index) => {
		// 			if(element == minObj){
		// 				this.target = element
		// 			}else{ // the rest of objects
		// 			}
		// 		});
		// 	}

		// }

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


function upgradeObjectForMissiles(width, height, color, x, y, action){
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
	this.img = new Image();
	this.img.src = upgradeImgMissiles;
	this.img.onload = () => {
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	};

	this.update = function(){
		action(this);
		this.x += this.speedX;
		this.y += this.speedY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

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


function upgradeObjectForBullets(width, height, color, x, y, action){
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
	this.img = new Image();
	this.img.src = upgradeImgBullets;
	this.img.onload = () => {
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	};

	this.update = function(){
		action(this);
		this.x += this.speedX;
		this.y += this.speedY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

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


function blocksEnemies(width, height, color, x, y, action, blockType){
	this.width = width;
	this.height = height;
	this.color = color;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.action = action;
	this.isAlive=true;
	this.angle;
	this.blockType=blockType;
	this.crazySpeedX=0;
	this.crazySpeedY=2;
	this.crazyTypeSpeeds;
	this.hp = 100;
	this.img = new Image();
	this.img.src = bombImg;
	this.img.onload = () => {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};

	if (this.isAlive == true) {
		this.crazyTypeSpeeds = setInterval(() => {
			this.crazySpeedX=Math.floor(Math.random() * (3 - -2 + 1) + -2);
			this.crazySpeedY=Math.floor(Math.random() * (3 - -2 + 1) + -2);
		}, 2000);
	}else{
		clearInterval(this.crazyTypeSpeeds);
	}


	this.update = function(){
		action(this);
		if (this.blockType == "crazy") {
			this.x += this.crazySpeedX;
			this.y += this.crazySpeedY;
		}else {
			this.x += this.speedX;
			this.y += this.speedY;
		}
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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


function playerComponent(width, height, color, x, y, action){
	this.width = width;
	this.height = height;
	this.color = color;
	this.x = x;
	this.speedX = 0;
	this.speedY = 0;
	this.y = y;
	this.action = action;
	// this.isAlive=true;
	this.angle;
	
	this.img = new Image();
	this.img.src = planeImg;
	this.img.onload = () => {
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	};


	this.update = function(){
		action(this);
		this.x += this.speedX;
		this.y += this.speedY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.save();
		roundedImage(ctx, this.x, this.y, this.width, this.height, 20);
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();


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