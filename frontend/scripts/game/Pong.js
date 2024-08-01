import { Paddle } from './Paddle.js';
import { Ball } from './Ball.js';

export class Pong {
	constructor(canvas, settings) {
		// Initialize the game
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.settings = settings;
		this.paddle1 = new Paddle(20, 250, 10, 100, this.settings.paddleSpeed, true);
		this.paddle2 = new Paddle(770, 250, 10, 100, this.settings.paddleSpeed, false);
		this.ball = new Ball(400, 300, 10, this.settings.ballSpeed);
		this.player1Score = 0;
		this.player2Score = 0;
		this.winner = null;
		this.isRunning = false;
		this.startTime = null;
		this.elapsedTime = 0;

		// Bind the event listeners
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	start() {
		this.isRunning = true;
		this.startTime = Date.now();
		console.log(this.settings);
		this.gameLoop();
		this.addChatMessage("Game started. Good luck!");
		console.log("Game started. Good luck!");
	}

	update() {
		if (!this.isRunning || this.isPaused) return;

		// Update the game objects
		this.paddle1.update(this.ball);
		this.paddle2.update(this.ball);
		this.ball.update(this.paddle1, this.paddle2);

		// Check if the ball has gone out of bounds
		if (this.ball.x - this.ball.radius < 0) {
			this.player2Score += 1;
			this.ball.reset(this.canvas);
			this.addChatMessage(`Player 2 scored! Current score: ${this.player1Score} - ${this.player2Score}`);
		}

		if (this.ball.x + this.ball.radius > this.canvas.width) {
			this.player1Score += 1;
			this.ball.reset(this.canvas);
			this.addChatMessage(`Player 1 scored! Current score: ${this.player1Score} - ${this.player2Score}`);
		}

		// Check if the game has ended
		this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);

		if (this.elapsedTime >= this.settings.maxGameTime) {
			this.stop();
		}
	}

	draw() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.paddle1.draw(this.ctx);
		this.paddle2.draw(this.ctx);
		this.ball.draw(this.ctx);

		// Draw the score
		this.ctx.fillStyle = "white";
		this.ctx.font = "24px Monocraft";
		this.ctx.textAlign = "center";
		this.ctx.fillText(`${this.player1Score} - ${this.player2Score}`, this.canvas.width / 2, 30);

		// Draw the timer
		const remainingTime = Math.max(0, this.settings.maxGameTime - this.elapsedTime);
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		this.ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, this.canvas.width / 2, 60);
	}

	stop = () => {
		this.isRunning = false;
		this.endGame();
	}

	pause = () => {
		this.isPaused = true;
	}

	surrender = () => {
		if (this.winner) return;
		winner = "Player 2";
	}

	gameLoop() {
		if (!this.isRunning) return;

		if (this.isPaused) {
			requestAnimationFrame(() => this.gameLoop());
			return;
		}

		this.update();
		this.draw();

		requestAnimationFrame(() => this.gameLoop());
	}

	handleMouseMove(event) {
		const rect = this.canvas.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;
		this.paddle1.moveToY(mouseY);
	}

	handleKeyDown(event) {
		if (event.key === 'ArrowUp') {
			this.paddle1.y = Math.max(0, this.paddle1.y - this.paddle1.speed);
		} else if (event.key === 'ArrowDown') {
			this.paddle1.y = Math.min(600 - this.paddle1.height, this.paddle1.y + this.paddle1.speed);
		}
	}

	addChatMessage(message) {
		const chatOutput = document.getElementById('chatOutput');
		const messageElement = document.createElement('p');
		const timestamp = new Date().toLocaleTimeString();

		messageElement.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
		chatOutput.appendChild(messageElement);
		chatOutput.scrollTop = chatOutput.scrollHeight;
	}

	endGame() {
		let message;
		this.winner = this.player1Score > this.player2Score ? "Player 1" : "Player 2";
		if (this.player1Score === this.player2Score) {
			message = "It's a tie!";
		} else if (this.player1Score > this.player2Score) {
			message = `You wins with a score of ${this.player1Score} - ${this.player2Score}!`;
		}
		else {
			message = `Player 2 wins with a score of ${this.player2Score} - ${this.player1Score}!`;
		}

		this.addChatMessage(message);
		// Ici, vous pourriez ajouter un appel à une fonction pour envoyer les statistiques au backend
		// this.sendStatsToBackend();
	}

	// Cette fonction serait utilisée pour envoyer les statistiques au backend
	// sendStatsToBackend() {
	//     const stats = {
	//         player1Score: this.player1Score,
	//         player2Score: this.player2Score,
	//         gameTime: this.elapsedTime
	//     };
	//     // Utilisez fetch ou une autre méthode pour envoyer les données au backend
	//     // fetch('/api/game-stats', {
	//     //     method: 'POST',
	//     //     headers: {
	//     //         'Content-Type': 'application/json',
	//     //     },
	//     //     body: JSON.stringify(stats),
	//     // });
	// }
}