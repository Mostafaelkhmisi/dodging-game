let closestObject =[];

let targetObject=[];
let missleDirection=[];

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
			Shots[ShotsFired] = new randomShotsWithObjectDetection(40,40,"cyan",planeX,planeY,function(c){

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




		targetObject[ShotsFired] = closestObject;

		setTimeout(() => {
			missleDirection[ShotsFired] = setInterval(() => {
				origX = targetObject[ShotsFired].x;
				origY = targetObject[ShotsFired].y;
				dx = (origX - Shots[ShotsFired].x) * .125;
				dy = (origY - Shots[ShotsFired].y) * .125;
				console.log(dx,dy)
				//calculate the distance this would move ...
				distance = Math.sqrt(dx*dx + dy*dy);
				//... and cap it at 5px
				if(distance > 5){
					dx *= 3/distance;
					dy *= 3/distance;
				}

				// console.log(dx, dy)
				speedY = dx[Math.floor(Math.random() * dx.length)];
				speedX = dy[Math.floor(Math.random() * dy.length)];
				let angle = Math.atan2(dy,  dx) + 1.6;

				Shots[ShotsFired].angle = angle;
				Shots[ShotsFired].speedX = dx;
				Shots[ShotsFired].speedY = dy;
			}, 100);
		}, 1000);

			
			Shots[ShotsFired].speedX += speedX;
			Shots[ShotsFired].speedY += speedY;
			Shots[ShotsFired].angle = angle;
			gameObjects.add(Shots[ShotsFired],3);
		}, 2000);
		upgrades+=1
	}




	
	// //  Upgrade One
	// if (upgrades == 1) {
	// //after Taking the upgrade will fire a missle
	// 	let directions = [-3,-2,-1,1,2,3]
	// 	x = planeX;
	// 	y = planeY;

	// 	AllUpgrades[upgrades] = setInterval(() => {
	// 		speedY = directions[Math.floor(Math.random() * directions.length)];
	// 		speedX = directions[Math.floor(Math.random() * directions.length)];
	// 		let angle = Math.atan2(speedY,  speedX) + 1.6;
	// 		ShotsFired++
	// 		Shots[ShotsFired] = new component(40,40,"cyan",planeX,planeY,function(c){

	// 			if(!c.isOnScreen()){
	// 				gameObjects.remove(c);
	// 				c.isAlive=false
	// 			}

	// 			if(c.isAlive==false){
	// 				gameObjects.remove(c);
	// 			}

	// 			if(!running){
	// 				gameObjects.remove(c);
	// 				Shots[ShotsFired].isAlive=false
	// 				console.log("removed missle cuz game isnt running")
	// 			}

	// 		}, "Shot");
	// 		Shots[ShotsFired].angle = angle;
	// 		Shots[ShotsFired].speedX = speedX;
	// 		Shots[ShotsFired].speedY = speedY;
	// 		gameObjects.add(Shots[ShotsFired],3);
	// 	}, 2000);
	// 	upgrades+=1
	// }
        
}, 1000);


setInterval(() => {
	let AllGameObjects = gameObjects.objects[1];
	if (AllGameObjects != null && running == true) {
		var minLength = 10000000;
		var minObj = null;
		origX = planeX;
		origY = planeY;
		AllGameObjects.forEach((element, index) => {
			if(Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2) < minLength){
				minObj = element;
				minLength = Math.pow(element.x - origX,2) + Math.pow(element.y - origY,2);
			 }
		});
		AllGameObjects.forEach((element, index) => {
			if(element == minObj){
				// gameObjects.remove(element);
				closestObject = element
			}else{ // the rest of objects
			}
		});
	}
}, 50);


