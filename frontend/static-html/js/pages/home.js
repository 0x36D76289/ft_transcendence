import { navigate } from "../app.js";
import { i18n } from '../services/i18n.js';

export function render() {
	return `
		<div class="home-container">
			<button class="play-button">${i18n.t('home.play')}</button>
		</div>
	`;
}

export function init() {
	const playButton = document.querySelector(".play-button");
	playButton.addEventListener("click", () => {
		navigate("/game");
	});
}
