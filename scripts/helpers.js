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


function spawnObject(){
	let speedX = 0;
	let speedY = 0;
	let x = Math.trunc(Math.random() * gameArea.canvas.width-20);
	let y = -20;
	speedY = blockSpeed+1;

	obj = new blocksEnemies(40,40,"green",x,y,function(c){
		
		if(c.isTouching(player)){

			AllUpgrades.forEach(element => {
				clearInterval(element);
			});
			alive = false;
			running = false;
			overlay.style.display = "flex";
			console.log("Game finished with a score of: "+score);

		}

		if (Missiles != null) {
			Missiles.forEach(element => {
				if(c.isTouching(element) && element.isAlive){
					element.isAlive = false; // to destroy the shot
					c.hp = c.hp - 100;
				}
			});
		}

		if (Bullets != null) {
			Bullets.forEach(element => {
				if(c.isTouching(element) && element.isAlive){
					element.isAlive = false; // to destroy the shot
					c.hp = c.hp - 50;
				}
			});
		}

		if (c.hp <= 0) {
			animateParticules(c.x, c.y);  // the explotion animation with x and y
			c.isAlive = false;
			console.log("bomb Destroyed");
			gameObjects.remove(c);
		}

		if(!c.isOnScreen()){
			gameObjects.remove(c);
		}
	});
	obj.speedX = speedX;
	obj.speedY = speedY;


	gameObjects.add(obj,2);
}

function spawnDetectingShot(){

	if (running == true && currentWeapon == "Missiles") {
		//  Upgrade Two
		//after Taking the upgrade will fire a missle
		let directions = [-3,-2,-1,1,2,3]

		if (missilesUpgrades != currentMissilesUpgrades) {
			clearInterval(randomShotsUpgrade);
			randomShotsUpgrade = setInterval(() => {
				//  This generates random number from directions variable to make it come out of a random place
				speedY = directions[Math.floor(Math.random() * directions.length)];
				speedX = directions[Math.floor(Math.random() * directions.length)];
				let angle = Math.atan2(speedY,  speedX) + 1.6;
				MissilesFired++
	
				Missiles[MissilesFired] = new randomShotsWithObjectDetection(40,40,planeX,planeY,function(c){
	
					if(!c.isOnScreen()){
						gameObjects.remove(c);
						c.isAlive=false
					}
	
					if(c.isAlive==false){
						gameObjects.remove(c);
					}
					if(!running && Missiles[MissilesFired] != undefined){
						gameObjects.remove(c);
						Missiles[MissilesFired].isAlive=false
						console.log("removed missle cuz game isnt running")
					}
	
				}, closestObject);
				
				Missiles[MissilesFired].speedX = speedX;
				Missiles[MissilesFired].speedY = speedY;
				Missiles[MissilesFired].angle = angle;
				gameObjects.add(Missiles[MissilesFired],4);

			}, shotsSpeedTimer);
			currentMissilesUpgrades = missilesUpgrades

		}

	// }
	}else{
		clearInterval(randomShotsUpgrade)
	}
}


function spawnBullets(){

	if (running == true && currentWeapon == "Bullets") {
		//  Upgrade Two
		//after Taking the upgrade will fire a missle
		// let directions = [-3,-2,-1,1,2,3]

		if (bulletUpgrades != currentBulletsUpgrades) {
			clearInterval(randomBulletsUpgrade);
			randomBulletsUpgrade = setInterval(() => {
				//  This generates random number from directions variable to make it come out of a random place
				// speedY = directions[Math.floor(Math.random() * directions.length)];
				// speedX = directions[Math.floor(Math.random() * directions.length)];
				speedY = -3;
				speedX = 0;
				let angle = Math.atan2(speedY,  speedX) + 1.6;
				BulletsFired++
	
				Bullets[BulletsFired] = new BulletsWithUpgrade(40,40,planeX,planeY,function(c){
	
					if(!c.isOnScreen()){
						gameObjects.remove(c);
						c.isAlive=false
					}
	
					if(c.isAlive==false){
						gameObjects.remove(c);
					}
					if(!running && Bullets[BulletsFired] != undefined){
						gameObjects.remove(c);
						Bullets[BulletsFired].isAlive=false
						console.log("removed missle cuz game isnt running")
					}
	
				}, closestObject);
				
				Bullets[BulletsFired].speedX = speedX;
				Bullets[BulletsFired].speedY = speedY;
				Bullets[BulletsFired].angle = angle;
				gameObjects.add(Bullets[BulletsFired],5);

			}, bulletsSpeedTimer);
			currentBulletsUpgrades = bulletUpgrades

		}

	// }
	}else{
		clearInterval(randomBulletsUpgrade)
	}
}



function spawnUpgradeForMissiles() {
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
		upgradeObjectForMissile = new upgradeObjectForMissiles(30,30,"green",x,y,function(c){
			if(c.isTouching(player)){
				missilesUpgrades += 1;
				currentWeapon = "Missiles";
				shotsSpeedTimer = shotsSpeedTimer-shotsSpeedTimer*0.1;
				// shotsSpeedTimer = shotsSpeedTimer-shotsSpeedTimer*0.5;
				gameObjects.remove(c);
				console.log("Missiles Upgrade Level"+missilesUpgrades);
			}
			if(!c.isOnScreen()){
				gameObjects.remove(c);
			}
		}, "upgradeObj");
		upgradeObjectForMissile.speedX = speedX;
		upgradeObjectForMissile.speedY = speedY;
		gameObjects.add(upgradeObjectForMissile,3);
	}
}


function spawnUpgradeForBullets() {
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
	if (bulletsSpeedTimer > 500) {
		upgradeObjForBullets = new upgradeObjectForBullets(30,30,"green",x,y,function(c){
			if(c.isTouching(player)){
				bulletUpgrades += 1;
				currentWeapon = "Bullets";
				bulletsSpeedTimer = bulletsSpeedTimer-bulletsSpeedTimer*0.1;
				// bulletsSpeedTimer = bulletsSpeedTimer-bulletsSpeedTimer*0.5;
				gameObjects.remove(c);
				console.log("Bullet Upgrade Level"+bulletUpgrades);
			}
			if(!c.isOnScreen()){
				gameObjects.remove(c);
			}
		}, "upgradeObj");
		upgradeObjForBullets.speedX = speedX;
		upgradeObjForBullets.speedY = speedY;
		gameObjects.add(upgradeObjForBullets,3);
	}
}

function getDistanceAndAngleAndDxDy(targetX, targetY, thisX, thisY) {
	origX = targetX;
	origY = targetY;
	//get the distance between the mouse and the ball on both axes
	let dx = (origX - thisX) * .125;
	let dy = (origY - thisY) * .125;
	//calculate the distance this would move ...
	distance = Math.sqrt(dx*dx + dy*dy);
	//... and cap it at 3px
	if(distance > 3){
		dx *= 3/distance;
		dy *= 3/distance;
	}
	return {
		distance: distance,
		angle:  Math.atan2(dy,  dx) + 1.6,
		dx:dx,
		dy:dy 
	  }
}
