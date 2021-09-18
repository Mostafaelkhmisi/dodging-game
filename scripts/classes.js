
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
	this.rocketSpeed = 0.5;
	this.curveDone=false;


////////
	// this.ball = {x:planeX,y:planeY,speed:0.1,t:0};
	// this.points = [
	// 	{x:planeX,y:planeY},
	// 	{x:this.ball.x+30,y:this.ball.y+30},
	// 	{x:this.ball.x+60,y:this.ball.y+60},
	// 	{x:this.ball.x+60,y:this.ball.y-30}
	// ]
/////////


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



// if (this.curveDone == false) {
// 	ctx = gameArea.context;
// 	ctx.save();
// 	triangleImage(ctx, this.ball.x, this.ball.y, this.width, this.height, this.angle)
// 	ctx.clip();
// 	ctx.drawImage(this.img, this.ball.x, this.ball.y, this.width, this.height);
// 	ctx.restore();

// 	this.angel = Math.atan2(this.ball.y, this.ball.x) + 1.6,
// 	setTimeout(() => {
// 		this.targeting = true;
// 		let [p0, p1, p2, p3] = this.points;
// 		//Calculate the coefficients based on where the ball currently is in the animation
// 		let cx = 3 * (p1.x - p0.x);
// 		let bx = 3 * (p2.x - p1.x) - cx;
// 		let ax = p3.x - p0.x - cx - bx;
	
// 		let cy = 3 * (p1.y - p0.y);
// 		let by = 3 * (p2.y - p1.y) - cy;
// 		let ay = p3.y - p0.y - cy -by;
	
// 		let t = this.ball.t;
	
// 		//Increment t value by speed
// 		this.ball.t += 0.01;
// 		//Calculate new X & Y positions of ball
// 		let xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
// 		let yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;
	
// 		if(this.ball.t > 1){
// 			this.ball.t=1;
// 			this.curveDone = true;
// 		}
	
// 		//We draw the ball to the canvas in the new location
// 		this.ball.x = xt;
// 		this.ball.y = yt;
// 		this.x = xt;
// 		this.y= yt;

// 	}, 500);

// }

// if (this.curveDone == true) {
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
		ctx.clip();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();

		// setTimeout(() => {
			this.targeting = true;
			let data = getDistanceAndAngleAndDxDy(this.target.x, this.target.y, this.x, this.y, this.rocketSpeed)
			this.angle = data.angle;
			this.x += data.dx;
			this.y += data.dy;
			this.rocketSpeed += 0.1;
		// }, 500);
	// }

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
			this.x += this.speedX;
			this.y += this.speedY;	
		ctx = gameArea.context;
		ctx.save();
		triangleImage(ctx, this.x, this.y, this.width, this.height, this.angle)
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