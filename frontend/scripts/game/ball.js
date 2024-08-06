export class Ball {
	constructor(x, y, radius, speed) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.dx = speed;
		this.dy = speed;
		this.savedX = null;
		this.savedY = null;
		this.useSavedPosition = false;
		this.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
	}

	update(paddle1, paddle2) {
		if (this.useSavedPosition) {
			this.x = this.savedX;
			this.y = this.savedY;
		} else {
			this.x += this.dx;
			this.y += this.dy;
		}

		if (this.y - this.radius < 0 || this.y + this.radius > 600) {
			this.dy = -this.dy;
		}

		if (this.collidesWith(paddle1) || this.collidesWith(paddle2)) {
			this.dx = -this.dx;
		}
	}

	collidesWith(paddle) {
		return (
			this.x - this.radius < paddle.x + paddle.width &&
			this.x + this.radius > paddle.x &&
			this.y + this.radius > paddle.y &&
			this.y - this.radius < paddle.y + paddle.height
		);
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}

	reset(canvas) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.dx = Math.random() > 0.5 ? this.speed : -this.speed;
		this.dy = Math.random() > 0.5 ? this.speed : -this.speed;
		this.savedX = null;
		this.savedY = null;
		this.useSavedPosition = false;
		console.log('reset ball');
	}

	savePosition() {
		this.savedX = this.x;
		this.savedY = this.y;
		this.useSavedPosition = true;
		console.log('saved position');
	}
}