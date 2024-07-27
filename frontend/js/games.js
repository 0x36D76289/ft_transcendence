class PongGame {
	constructor() {
		this.canvas = document.getElementById('pongCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 600;
		this.canvas.height = 400;

		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.ballSpeedX = 5;
		this.ballSpeedY = 5;
		this.ballRadius = 10;

		this.paddle1Y = this.canvas.height / 2 - 50;
		this.paddle2Y = this.canvas.height / 2 - 50;
		this.paddleWidth = 10;
		this.paddleHeight = 100;

		this.player1Score = 0;
		this.player2Score = 0;

		this.ws = new WebSocket('ws://' + window.location.host + '/game');
		this.ws.onmessage = this.handleMessage.bind(this);

		document.addEventListener('keydown', this.handleKeyPress.bind(this));
	}

	start() {
		this.gameLoop();
	}

	gameLoop() {
		this.update();
		this.draw();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	update() {
		this.ballX += this.ballSpeedX;
		this.ballY += this.ballSpeedY;

		if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvas.height) {
			this.ballSpeedY = -this.ballSpeedY;
		}

		if (this.ballX - this.ballRadius < this.paddleWidth &&
			this.ballY > this.paddle1Y &&
			this.ballY < this.paddle1Y + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}

		if (this.ballX + this.ballRadius > this.canvas.width - this.paddleWidth &&
			this.ballY > this.paddle2Y &&
			this.ballY < this.paddle2Y + this.paddleHeight) {
			this.ballSpeedX = -this.ballSpeedX;
		}

		if (this.ballX < 0) {
			this.player2Score++;
			this.resetBall();
		} else if (this.ballX > this.canvas.width) {
			this.player1Score++;
			this.resetBall();
		}

		this.ws.send(JSON.stringify({
			type: 'gameState',
			ballX: this.ballX,
			ballY: this.ballY,
			paddle1Y: this.paddle1Y,
			paddle2Y: this.paddle2Y,
			player1Score: this.player1Score,
			player2Score: this.player2Score
		}));
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = '#000';
		this.ctx.beginPath();
		this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
		this.ctx.fill();

		this.ctx.fillRect(0, this.paddle1Y, this.paddleWidth, this.paddleHeight);
		this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.paddle2Y, this.paddleWidth, this.paddleHeight);

		document.getElementById('player1Score').textContent = this.player1Score;
		document.getElementById('player2Score').textContent = this.player2Score;
	}

	resetBall() {
		this.ballX = this.canvas.width / 2;
		this.ballY = this.canvas.height / 2;
		this.ballSpeedX = -this.ballSpeedX;
		this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
	}

	handleKeyPress(e) {
		switch (e.key) {
			case 'w':
				this.paddle1Y = Math.max(0, this.paddle1Y - 20);
				break;
			case 's':
				this.paddle1Y = Math.min(this.canvas.height - this.paddleHeight, this.paddle1Y + 20);
				break;
			case 'ArrowUp':
				this.paddle2Y = Math.max(0, this.paddle2Y - 20);
				break;
			case 'ArrowDown':
				this.paddle2Y = Math.min(this.canvas.height - this.paddleHeight, this.paddle2Y + 20);
				break;
		}
	}

	handleMessage(event) {
		const data = JSON.parse(event.data);
		if (data.type === 'gameState') {
			this.ballX = data.ballX;
			this.ballY = data.ballY;
			this.paddle1Y = data.paddle1Y;
			this.paddle2Y = data.paddle2Y;
			this.player1Score = data.player1Score;
			this.player2Score = data.player2Score;
		}
	}
}

const game = new PongGame();
game.start();