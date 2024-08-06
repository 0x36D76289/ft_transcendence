export class Paddle {
	constructor(x, y, width, height, isPlayer) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = 8;
		this.isPlayer = isPlayer;
		this.savedY = null;
		this.useSavedPosition = false;
		this.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
	}

	moveToY(targetY) {
		if (this.useSavedPosition) {
			this.y = this.savedY;
		} else {
			this.y = Math.max(0, Math.min(600 - this.height, targetY - this.height / 2));
		}
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
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	reset() {
		this.y = 300 - this.height / 2;
		this.savedY = null;
		this.useSavedPosition = false;
	}

	savePosition() {
		this.savedY = this.y;
		this.useSavedPosition = true;
	}
}
