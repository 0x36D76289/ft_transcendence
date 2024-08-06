import { initializeSettings } from './settings.js';
import { Chat } from './chat.js';
import { Pong } from './game/game.js';

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('gameCanvas');
	const chat = new Chat();
	chat.initializeChat();
	let game = null;

	const gameSettings = {
		ballSpeed: 4,
		maxGameTime: 5 // in seconds
	};

	document.getElementById('playBtn').addEventListener('click', () => {
		if (game) {
			game.stop();
		}
		game = new Pong(canvas, gameSettings, chat);
		document.getElementById('gameContainer').style.display = 'flex';
		document.getElementById('playBtn').style.display = 'none';
		game.start();
	});

	document.getElementById('homeBtn').addEventListener('click', () => {
		if (game) {
			game.stop();
		}
		document.getElementById('gameContainer').style.display = 'none';
		document.getElementById('playBtn').style.display = 'block';
	});

	window.addEventListener('settingschanged', () => {
		if (game) {
			game.updateStyles();
		}
	});

	initializeSettings();
});
