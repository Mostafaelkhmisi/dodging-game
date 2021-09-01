


class Projectile {
	constructor(x , y, radius, width, height, color, velocity, img){
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.img = new Image();
		this.img.src = img;
	}

	draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		// cc.drawImage(this.img, this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.color
		ctx.fill(); 
	}

	update(){
		this.x = this.x + this.velocity
		this.y = this.y + this.velocity
	}

}




const projectile = new Projectile(planeX, planeY, 5, 30, 30, "red", { x:1, y:1}, shotImg)
function animatee() {
	requestAnimationFrame(animatee);
	projectile.draw();
	projectile.update();
	console.log("ss")
}

// setTimeout(() => {
// 	animatee();
	
// }, 5000);

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

			// let angle = Math.atan2(speedY - y, speedX - x)

			// let angleX = Math.cos(angle);
			// let angleY = Math.sin(angle);

			// console.log(angleX, angleY, "second")
			theShot = new component(40,40,"cyan",planeX,planeY,function(c){
				if(!c.isOnScreen()){
					gameObjects.remove(c);
					c.isAlive=false
				}

				if(c.isAlive==false){
					gameObjects.remove(c);
				}

				if(!running){
					gameObjects.remove(c);
					theShot.isAlive=false
					console.log("removed missle cuz game isnt running")
				}

			}, "Shot");
			theShot.speedX = speedX;
			theShot.speedY = speedY;
			gameObjects.add(theShot,3);
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
				if(!running){
					gameObjects.remove(c);
					console.log("removed missle cuz game isnt running")
				}
			}, "Shot");
			theShot.speedX = speedX;
			theShot.speedY = speedY;
			gameObjects.add(theShot,3);
	
			upgrades+=1
		}
        
}, 1000);