// game.js
export function render() {
	return `
			<div class="game-container">
					<div class="game-ui">
							<div class="settings-panel" style="display: none;">
									<h2>Options</h2>
									<div class="setting">
											<label>Vitesse de la balle:</label>
											<input type="range" id="ballSpeed" min="2" max="8" value="4">
									</div>
									<div class="setting">
											<label>Taille des raquettes:</label>
											<input type="range" id="paddleSize" min="40" max="100" value="60">
									</div>
									<div class="setting">
											<label>Points pour gagner:</label>
											<input type="number" id="winScore" min="3" max="15" value="5">
									</div>
									<button id="applySettings">Appliquer</button>
							</div>
							<canvas id="pongCanvas" width="800" height="400"></canvas>
							<div id="pauseMenu" style="display: none;">
									<h2>PAUSE</h2>
									<button id="resumeBtn">Reprendre</button>
									<button id="settingsBtn">Options</button>
									<button id="restartBtn">Recommencer</button>
							</div>
							<div id="winScreen" style="display: none;">
									<h2 id="winMessage"></h2>
									<button id="newGameBtn">Nouvelle Partie</button>
							</div>
					</div>
			</div>
	`;
}

export function init() {
	const canvas = document.getElementById('pongCanvas');
	const ctx = canvas.getContext('2d');

	// Configuration du jeu
	const config = {
		paddleHeight: 60,
		paddleWidth: 10,
		ballSize: 8,
		paddleSpeed: 5,
		ballSpeed: 4,
		winScore: 5,
		particles: []
	};

	// État du jeu
	const gameState = {
		player1: {
			y: canvas.height / 2 - config.paddleHeight / 2,
			score: 0
		},
		player2: {
			y: canvas.height / 2 - config.paddleHeight / 2,
			score: 0
		},
		ball: {
			x: canvas.width / 2,
			y: canvas.height / 2,
			dx: config.ballSpeed,
			dy: config.ballSpeed
		},
		keys: {
			w: false,
			s: false,
			ArrowUp: false,
			ArrowDown: false,
			Escape: false
		},
		isPaused: false,
		isSettingsOpen: false,
		gameOver: false
	};

	// Gestion des particules
	class Particle {
		constructor(x, y, color) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.size = Math.random() * 3 + 2;
			this.speedX = Math.random() * 6 - 3;
			this.speedY = Math.random() * 6 - 3;
			this.life = 1;
			this.decay = Math.random() * 0.02 + 0.02;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			this.life -= this.decay;
			this.size = Math.max(0, this.size - 0.1);
		}

		draw(ctx) {
			ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Gestion des événements
	document.addEventListener('keydown', (e) => {
		if (e.key in gameState.keys) {
			gameState.keys[e.key] = true;
			if (e.key === 'Escape') {
				togglePause();
			}
		}
	});

	document.addEventListener('keyup', (e) => {
		if (e.key in gameState.keys) {
			gameState.keys[e.key] = false;
		}
	});

	// Gestion du menu pause
	const pauseMenu = document.getElementById('pauseMenu');
	const settingsPanel = document.querySelector('.settings-panel');
	const winScreen = document.getElementById('winScreen');

	document.getElementById('resumeBtn').addEventListener('click', togglePause);
	document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
	document.getElementById('restartBtn').addEventListener('click', restartGame);
	document.getElementById('newGameBtn').addEventListener('click', restartGame);
	document.getElementById('applySettings').addEventListener('click', applySettings);

	function togglePause() {
		if (!gameState.gameOver) {
			gameState.isPaused = !gameState.isPaused;
			pauseMenu.style.display = gameState.isPaused ? 'flex' : 'none';
			settingsPanel.style.display = 'none';
			gameState.isSettingsOpen = false;
		}
	}

	function toggleSettings() {
		gameState.isSettingsOpen = !gameState.isSettingsOpen;
		settingsPanel.style.display = gameState.isSettingsOpen ? 'block' : 'none';
		pauseMenu.style.display = gameState.isSettingsOpen ? 'none' : 'flex';
	}

	function applySettings() {
		config.ballSpeed = parseInt(document.getElementById('ballSpeed').value);
		config.paddleHeight = parseInt(document.getElementById('paddleSize').value);
		config.winScore = parseInt(document.getElementById('winScore').value);
		toggleSettings();
	}

	function restartGame() {
		gameState.player1.score = 0;
		gameState.player2.score = 0;
		gameState.gameOver = false;
		gameState.isPaused = false;
		pauseMenu.style.display = 'none';
		winScreen.style.display = 'none';
		resetBall();
	}

	function drawParticles() {
		config.particles.forEach((particle, index) => {
			particle.update();
			particle.draw(ctx);
			if (particle.life <= 0) {
				config.particles.splice(index, 1);
			}
		});
	}

	// Fonction de dessin
	function draw() {
		// Effacer le canvas
		ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Dessiner les particules
		drawParticles();

		// Dessiner la ligne centrale
		ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.stroke();
		ctx.setLineDash([]);

		// Dessiner les scores
		ctx.font = '32px Arial';
		ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
		ctx.fillText(gameState.player1.score, canvas.width / 4, 50);
		ctx.fillText(gameState.player2.score, 3 * canvas.width / 4, 50);

		// Dessiner les raquettes avec effet de brillance
		const gradient = ctx.createLinearGradient(0, 0, config.paddleWidth, 0);
		gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--text-primary'));
		gradient.addColorStop(0.5, getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'));
		gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--text-primary'));
		ctx.fillStyle = gradient;

		// Raquette gauche (Player 1)
		ctx.fillRect(0, gameState.player1.y, config.paddleWidth, config.paddleHeight);
		// Raquette droite (Player 2)
		ctx.fillRect(
			canvas.width - config.paddleWidth,
			gameState.player2.y,
			config.paddleWidth,
			config.paddleHeight
		);

		// Dessiner la balle avec effet de lueur
		ctx.shadowBlur = 15;
		ctx.shadowColor = 'white';
		ctx.beginPath();
		ctx.arc(gameState.ball.x, gameState.ball.y, config.ballSize, 0, Math.PI * 2);
		ctx.fill();
		ctx.shadowBlur = 0;
	}

	// Mettre à jour la position des raquettes
	function updatePaddles() {
		if (gameState.keys.w && gameState.player1.y > 0) {
			gameState.player1.y -= config.paddleSpeed;
		}
		if (gameState.keys.s && gameState.player1.y < canvas.height - config.paddleHeight) {
			gameState.player1.y += config.paddleSpeed;
		}

		if (gameState.keys.ArrowUp && gameState.player2.y > 0) {
			gameState.player2.y -= config.paddleSpeed;
		}
		if (gameState.keys.ArrowDown && gameState.player2.y < canvas.height - config.paddleHeight) {
			gameState.player2.y += config.paddleSpeed;
		}
	}

	// Vérifier les collisions
	function checkCollisions() {
		// Collisions avec les murs (haut/bas)
		if (gameState.ball.y <= 0 || gameState.ball.y >= canvas.height) {
			gameState.ball.dy *= -1;
		}

		// Collision avec les raquettes
		const paddleLeft = {
			x: config.paddleWidth,
			y: gameState.player1.y,
			height: config.paddleHeight
		};

		const paddleRight = {
			x: canvas.width - config.paddleWidth,
			y: gameState.player2.y,
			height: config.paddleHeight
		};

		if (gameState.ball.x <= paddleLeft.x &&
			gameState.ball.y >= paddleLeft.y &&
			gameState.ball.y <= paddleLeft.y + paddleLeft.height) {
			gameState.ball.dx *= -1;
			gameState.ball.x = paddleLeft.x;
		}

		if (gameState.ball.x >= paddleRight.x &&
			gameState.ball.y >= paddleRight.y &&
			gameState.ball.y <= paddleRight.y + paddleRight.height) {
			gameState.ball.dx *= -1;
			gameState.ball.x = paddleRight.x;
		}

		// Marquer les points
		if (gameState.ball.x <= 0) {
			gameState.player2.score++;
			checkWin();
			resetBall();
		} else if (gameState.ball.x >= canvas.width) {
			gameState.player1.score++;
			checkWin();
			resetBall();
		}
	}

	function checkWin() {
		if (gameState.player1.score >= config.winScore) {
			endGame("Joueur 1 gagne!");
		} else if (gameState.player2.score >= config.winScore) {
			endGame("Joueur 2 gagne!");
		}
	}

	function endGame(message) {
		gameState.gameOver = true;
		document.getElementById('winMessage').textContent = message;
		winScreen.style.display = 'flex';
	}

	// Réinitialiser la balle
	function resetBall() {
		gameState.ball.x = canvas.width / 2;
		gameState.ball.y = canvas.height / 2;
		gameState.ball.dx = config.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
		gameState.ball.dy = config.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
	}

	// Mise à jour de la balle
	function updateBall() {
		gameState.ball.x += gameState.ball.dx;
		gameState.ball.y += gameState.ball.dy;
	}

	// Boucle de jeu principale
	function gameLoop() {
		if (!gameState.isPaused && !gameState.gameOver) {
			updatePaddles();
			updateBall();
			checkCollisions();
		}
		draw();
		requestAnimationFrame(gameLoop);
	}

	// Démarrer le jeu
	gameLoop();
}