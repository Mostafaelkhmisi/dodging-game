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

function triangleImage(ctx, x, y, width, height) {
	ctx.beginPath();
	ctx.moveTo(x , y+height-5);
	ctx.lineTo(x + width, y+height-5);
	ctx.lineTo(x + width / 2, y);
	ctx.closePath();
}
