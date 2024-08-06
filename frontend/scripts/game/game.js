import { Paddle } from './paddle.js';
import { Ball } from './ball.js';

export class Pong {
	constructor(canvas, settings, chat) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.settings = settings;
		this.chat = chat;
		this.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

		this.paddle1 = new Paddle(20, 250, 10, 100, true);
		this.paddle2 = new Paddle(770, 250, 10, 100, false);
		this.ball = new Ball(400, 300, 10, this.settings.ballSpeed);

		this.player1Score = 0;
		this.player2Score = 0;
		this.winner = null;
		this.isRunning = false;
		this.isPaused = false;
		this.startTime = null;
		this.elapsedTime = 0;

		this.updateStyles();
		this.bindEventListeners();
	}

	bindEventListeners() {
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		document.getElementById('surrenderBtn').addEventListener('click', this.surrender.bind(this));
		document.getElementById('gameStatusBtn').addEventListener('click', this.togglePause.bind(this));
		document.getElementById('restartBtn').addEventListener('click', this.restart.bind(this));
		window.addEventListener('resize', this.updateStyles.bind(this));
	}

	start() {
		this.isRunning = true;
		document.getElementById('surrenderBtn').style.display = 'block';
		document.getElementById('gameStatusBtn').style.display = 'block';
		document.getElementById('restartBtn').style.display = 'none';
		this.startTime = Date.now();
		this.gameLoop();
		this.chat.addChatMessage("Game started. Good luck!");
	}

	stop() {
		this.isRunning = false;
		this.draw();
		this.endGame();
	}


	updateStyles() {
		const root = document.documentElement;
		this.fontSize = parseInt(getComputedStyle(root).getPropertyValue('--font-size-default'));
		this.color = getComputedStyle(root).getPropertyValue('--text-color').trim();
		this.backgroundColor = getComputedStyle(root).getPropertyValue('--background-color').trim();

		// Update paddle and ball colors
		this.paddle1.color = this.color;
		this.paddle2.color = this.color;
		this.ball.color = this.color;

		// Redraw the game if it's running
		this.draw();
	}

	update() {
		if (!this.isRunning || this.isPaused) return;

		this.paddle1.update(this.ball);
		this.paddle2.update(this.ball);
		this.ball.update(this.paddle1, this.paddle2);

		if (this.ball.x - this.ball.radius < 0) {
			this.player2Score += 1;
			this.ball.reset(this.canvas);
			this.chat.addChatMessage(`Player 2 scored! Current score: ${this.player1Score} - ${this.player2Score}`);
		}

		if (this.ball.x + this.ball.radius > this.canvas.width) {
			this.player1Score += 1;
			this.ball.reset(this.canvas);
			this.chat.addChatMessage(`Player 1 scored! Current score: ${this.player1Score} - ${this.player2Score}`);
		}

		this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);

		if (this.elapsedTime >= this.settings.maxGameTime) {
			this.stop();
		}
	}

	draw() {
		// Clear the canvas
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw game objects
		this.paddle1.draw(this.ctx);
		this.paddle2.draw(this.ctx);
		this.ball.draw(this.ctx);

		// Draw scores and time
		this.ctx.fillStyle = this.color;
		this.ctx.font = `${this.fontSize}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family')}`;
		this.ctx.textAlign = "center";
		this.ctx.fillText(`${this.player1Score} - ${this.player2Score}`, this.canvas.width / 2, 30);

		const remainingTime = Math.max(0, this.settings.maxGameTime - this.elapsedTime);
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		this.ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, this.canvas.width / 2, 60);

		// If the game is not running and lose, draw a "Game Over" message
		if (!this.isRunning) {
			this.ctx.fillStyle = this.color;
			this.ctx.font = `${this.fontSize * 2}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-family')}`;

			if (this.winner === "Player 1") {
				this.ctx.fillText(`${this.winner} wins!`, this.canvas.width / 2, this.canvas.height / 2);
			} else if (this.winner === "Player 2") {
				this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);
			} else {
				this.ctx.fillText("It's a tie!", this.canvas.width / 2, this.canvas.height / 2);
			}
		}
	}

	gameLoop() {
		if (!this.isRunning) return;

		this.update();
		this.draw();

		requestAnimationFrame(() => this.gameLoop());
	}

	handleMouseMove(event) {
		const rect = this.canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		this.paddle1.moveToY(mouseY);
	}

	togglePause() {
		this.isPaused = !this.isPaused;
		this.chat.addChatMessage(this.isPaused ? "Game paused" : "Game resumed");
	}

	surrender() {
		if (this.winner) return;
		this.winner = "Player 2";
		this.stop();
	}

	restart() {
		this.player1Score = 0;
		this.player2Score = 0;
		this.winner = null;
		this.elapsedTime = 0;
		this.startTime = Date.now();
		this.ball.reset(this.canvas);
		this.isRunning = true;
		this.isPaused = false;
		this.chat.addChatMessage("Game restarted. Good luck!");
		this.start();
	}

	endGame() {
		this.isRunning = false;

		let message;
		if (!this.winner) {
			this.winner = this.player1Score > this.player2Score ? "Player 1" : "Player 2";
			if (this.player1Score === this.player2Score) {
				message = "It's a tie!";
				this.winner = null;
			} else {
				message = `${this.winner} wins with a score of ${Math.max(this.player1Score, this.player2Score)} - ${Math.min(this.player1Score, this.player2Score)}!`;
			}
		} else {
			message = `${this.winner} wins by surrender!`;
		}

		this.paddle1.savePosition();
		this.paddle2.savePosition();
		this.ball.savePosition();

		this.chat.addChatMessage(message);

		document.getElementById('surrenderBtn').style.display = 'none';
		document.getElementById('gameStatusBtn').style.display = 'none';
		document.getElementById('restartBtn').style.display = 'block';
	}
}