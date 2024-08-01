export class Paddle {
	constructor(x, y, width, height, speed, isPlayer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.isPlayer = isPlayer;
	}

	moveToY(targetY) {
		this.y = Math.max(0, Math.min(600 - this.height, targetY - this.height / 2));
	}

	update(ball) {
		if (!this.isPlayer) {
			const paddleCenter = this.y + this.height / 2;

			if (ball.y < paddleCenter - 10) {
				this.y = Math.max(0, this.y - this.speed);
			} else if (ball.y > paddleCenter + 10) {
				this.y = Math.min(600 - this.height, this.y + this.speed);
			}
		}
	}

	draw(ctx) {
		ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.beginPath();
		ctx.arc(this.x + this.width / 2, this.y, this.width / 2, 0, Math.PI, true);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x + this.width / 2, this.y + this.height, this.width / 2, 0, Math.PI, false);
		ctx.fill();
	}
}
