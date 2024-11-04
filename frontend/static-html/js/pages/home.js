import { navigate } from "../app.js";

export function render() {
	return `
		<div class="home-container">
			<button class="play-button">Play</button>
		</div>
	`;
}

export function init() {
	const playButton = document.querySelector(".play-button");
	playButton.addEventListener("click", () => {
		navigate("/game");
	});
}
