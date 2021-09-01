

setInterval(() => {
	
	//  Upgrade One
	if (upgrades == 1) {
	//after Taking the upgrade will fire a missle
		let directions = [-3,-2,-1,1,2,3]
		x = planeX;
		y = planeY;

		AllUpgrades[upgrades] = setInterval(() => {
			speedY = directions[Math.floor(Math.random() * directions.length)];
			speedX = directions[Math.floor(Math.random() * directions.length)];
			let angle = Math.atan2(speedY,  speedX) + 1.6;
			ShotsFired++
			Shots[ShotsFired] = new component(40,40,"cyan",planeX,planeY,function(c){

				if(!c.isOnScreen()){
					gameObjects.remove(c);
					c.isAlive=false
				}

				if(c.isAlive==false){
					gameObjects.remove(c);
				}

				if(!running){
					gameObjects.remove(c);
					Shots[ShotsFired].isAlive=false
					console.log("removed missle cuz game isnt running")
				}

			}, "Shot");
			Shots[ShotsFired].angle = angle;
			Shots[ShotsFired].speedX = speedX;
			Shots[ShotsFired].speedY = speedY;
			gameObjects.add(Shots[ShotsFired],3);
		}, 2000);
		upgrades+=1
	}

	//  Upgrade Two
	// if (upgrades == 3) {
	// 	//after Taking the upgrade will fire a missle
	// 		let directions = [-3,-2,-1,1,2,3]
	// 		x = planeX;
	// 		y = planeY;
	// 		speedY = directions[Math.floor(Math.random() * directions.length)];						
	// 		speedX = directions[Math.floor(Math.random() * directions.length)];
	// 		theShot = new component(40,40,"green",planeX,planeY,function(c){
	// 			// if(c.isTouching(obj)){
	// 			// 	gameObjects.remove(c);
	// 			// 	console.log("destroyeddd an obj");
	// 			// }
	// 			if(!c.isOnScreen()){
	// 				gameObjects.remove(c);
	// 			}
	// 			if(!running){
	// 				gameObjects.remove(c);
	// 				console.log("removed missle cuz game isnt running")
	// 			}
	// 		}, "Shot");
	// 		theShot.speedX = speedX;
	// 		theShot.speedY = speedY;
	// 		gameObjects.add(theShot,3);
	
	// 		upgrades+=1
	// 	}
        
}, 1000);