
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
			theShot = new component(40,40,"green",planeX,planeY,function(c){
				// if(c.isTouching(obj)){
				// 	gameObjects.remove(c);
				// 	console.log("destroyeddd an obj");
				// }
				if(!c.isOnScreen()){
					gameObjects.remove(c);
				}
			}, "Shot");
			theShot.speedX = speedX;
			theShot.speedY = speedY;
			gameObjects.add(theShot,1);
		}, 2000);
		upgrades+=1
	}

	//  Upgrade Two
	if (upgrades == 3) {
		//after Taking the upgrade will fire a missle
			let directions = [-3,-2,-1,1,2,3]
			x = planeX;
			y = planeY;
			speedY = directions[Math.floor(Math.random() * directions.length)];						
			speedX = directions[Math.floor(Math.random() * directions.length)];
			theShot = new component(40,40,"green",planeX,planeY,function(c){
				// if(c.isTouching(obj)){
				// 	gameObjects.remove(c);
				// 	console.log("destroyeddd an obj");
				// }
				if(!c.isOnScreen()){
					gameObjects.remove(c);
				}
			}, "Shot");
			theShot.speedX = speedX;
			theShot.speedY = speedY;
			gameObjects.add(theShot,1);
	
			upgrades+=1
		}
        
}, 1000);