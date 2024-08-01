import { Pong } from './game/Pong.js';

document.addEventListener('DOMContentLoaded', () => {
	const playBtn = document.getElementById('playBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	const settings = document.getElementById('settings');
	const saveSettingsBtn = document.getElementById('saveSettingsBtn');
	const gameContainer = document.getElementById('gameContainer');
	const homeBtn = document.getElementById('homeBtn');

	// Game settings
	const fontSizeRange = document.getElementById('fontSizeRange');
	const fontSizeValue = document.getElementById('fontSizeValue');
	const bgColorSelect = document.getElementById('bgColorSelect');

	const canvas = document.getElementById('gameCanvas');
	const gameSettings = {
		ballSpeed: 4,     // ball speed
		paddleSpeed: 8,   // paddle speed
		maxGameTime: 5    // in seconds (3 minutes)
	};

	let game;

	// Initialiser la taille de police à partir du curseur
	const initialFontSize = fontSizeRange.value;
	document.documentElement.style.setProperty('--font-size-default', `${initialFontSize}px`);
	fontSizeValue.textContent = `${initialFontSize}px`;

	playBtn.addEventListener('click', () => {
		// Create a new Pong instance and start the game
		game = new Pong(canvas, gameSettings);
		gameContainer.style.display = 'flex';
		playBtn.style.display = 'none';

		game.start();
	});

	settingsBtn.addEventListener('click', () => {
		settings.style.display = settings.style.display === 'block' ? 'none' : 'block';
	});

	// Écouter les changements sur le curseur de taille de police
	fontSizeRange.addEventListener('input', (event) => {
		const newSize = event.target.value;
		document.documentElement.style.setProperty('--font-size-default', `${newSize}px`);
		fontSizeValue.textContent = `${newSize}px`;
	});

	saveSettingsBtn.addEventListener('click', () => {
		const selectedFontSize = fontSizeRange.value;
		const selectedBgColor = bgColorSelect.value;

		document.documentElement.style.setProperty('--font-size-default', `${selectedFontSize}px`);
		document.documentElement.style.setProperty('--background-color', selectedBgColor);

		settings.style.display = 'none';
	});

	const chatInput = document.getElementById('chatInput');

	chatInput.addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			const message = chatInput.value;

			if (message.trim() !== '') {
				// Ajouter le message au chat du jeu
				if (game && typeof game.addChatMessage === 'function') {
					game.addChatMessage(`You: ${message}`);
				}
				chatInput.value = '';
			}
		}
	});

	homeBtn.addEventListener('click', () => {
		gameContainer.style.display = 'none';
		playBtn.style.display = 'block';
	});

	// Game buttons
	const restartBtn = document.getElementById('restartBtn');
	const surrenderBtn = document.getElementById('surrenderBtn');
	const gameStatusBtn = document.getElementById('gameStatusBtn');

	// Game buttons event listeners
	surrenderBtn.addEventListener('click', () => {
		if (game) {
			game.surrenderBtn();
		}
	});

	gameStatusBtn.addEventListener('click', () => {
		if (!game || game.winner) return;

		if (game.isPaused) {
			game.isPaused = false;
			gameStatusBtn.textContent = 'Pause';
		} else {
			game.isPaused = true;
			gameStatusBtn.textContent = 'Resume';
		}
	});

	restartBtn.addEventListener('click', () => {
		// Stop the current game
		if (game) {
			game.stop();
		}

		// Start a new game
		game = new Pong(canvas, gameSettings);
		game.start();
	});
});
