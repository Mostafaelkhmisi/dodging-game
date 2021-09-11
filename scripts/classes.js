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
			this.currentYSpeed = this.speedY;
			this.currentXSpeed = this.speedX;
			this.x += this.speedX;
			this.y += this.speedY;	
		}
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

		setTimeout(() => {
			this.targeting = true;
			let data = getDistanceAndAngleAndDxDy(this.target.x, this.target.y, this.x, this.y)
			this.angle = data.angle;
			this.x += data.dx;
			this.y += data.dy;
		}, 500);

		if (this.isAlive == false) {
			let AllGameObjects = gameObjects.objects[1];
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

			// let angle = (this.angle) / 180 * Math.PI;  // compensate angle -90°, conv. to rad
			// this.x += 50 * Math.cos(angle);          // move ship
			// this.y += 50 * Math.sin(angle);
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