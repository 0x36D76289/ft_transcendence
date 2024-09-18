import { navigate } from "../spa.js";
import { createButton } from "../components/button.js";

const games = [
	{
		name: "Pong",
		image: "../../assets/icons/dark/game/pong.svg",
		route: "/pong",
	},
	{
		name: "Pacman",
		image: "../../assets/icons/dark/game/pacman.svg",
		route: "/pacman",
	},
];

export function createGameCard(game) {
	const card = document.createElement("div");
	card.className =
		"cursor-pointer transform transition-transform hover:scale-105 hover:rotate-2 hover:translate-y-1 bg-white rounded-lg shadow-lg overflow-hidden w-full aspect-square md:aspect-auto";

	const imageContainer = document.createElement("div");
	imageContainer.className = "relative w-full h-0 pb-full md:pb-0"; // Pour garder un aspect carré
	const image = document.createElement("img");
	image.src = game.image;
	image.className = "absolute top-0 left-0 object-cover w-full h-full";
	imageContainer.appendChild(image);

	card.appendChild(imageContainer);

	const name = document.createElement("p");
	name.textContent = game.name;
	name.className = "p-4 text-xl font-semibold text-center";
	card.appendChild(name);

	return card;
}

function renderHTML(username) {
	const app = document.getElementById("app");
	app.innerHTML = "";

	const homeButton = createButton("home-button", "Home", () => {
		navigate("/");
	});

	app.appendChild(homeButton);

	if (username) {
		const usernameDisplay = createButton("username-display", username, () => {
			navigate("/account");
		});

		app.appendChild(usernameDisplay);
	}

	const container = document.createElement("div");
	container.className = "container mx-auto p-4";

	const heading = document.createElement("h1");
	heading.className = "text-3xl font-bold mb-6 text-center";
	heading.textContent = "Choose a Game";

	const grid = document.createElement("div");
	grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center";

	games.forEach((game) => {
		const card = createGameCard(game);
		card.onclick = () => navigate(game.route);
		grid.appendChild(card);
	});

	container.appendChild(heading);
	container.appendChild(grid);
	app.appendChild(container);
}

function renderCSS() {
	const style = document.createElement("style");
	style.textContent = `
    .home-button {
      position: absolute;
      left: 1rem;
      top: 1rem;
    }

    .username-display {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: var(--font-size);
      color: var(--text-color);
      background-color: transparent;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .transform {
      transform: scale(1);
    }

    .transition-transform {
      transition: transform 0.3s ease, rotate 0.3s ease, translate 0.3s ease;
    }

    .hover\\:scale-105:hover {
      transform: scale(1.05);
    }

    .hover\\:rotate-2:hover {
      rotate: 2deg;
    }

    .hover\\:translate-y-1:hover {
      transform: translateY(-0.25rem);
    }

    .bg-white {
      background-color: white;
    }

    .rounded-lg {
      border-radius: 0.5rem;
    }

    .shadow-lg {
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }

    .overflow-hidden {
      overflow: hidden;
    }

    .w-full {
      width: 100%;
    }

    .aspect-square {
      aspect-ratio: 1 / 1;
    }

    .p-4 {
      padding: 1rem;
    }

    .text-xl {
      font-size: 1.25rem;
    }

    .font-semibold {
      font-weight: 600;
    }

    .text-center {
      text-align: center;
    }

    .text-3xl {
      font-size: 1.875rem;
    }

    .font-bold {
      font-weight: 700;
    }

    .mb-6 {
      margin-bottom: 1.5rem;
    }

    .grid {
      display: grid;
    }

    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .md\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .gap-6 {
      gap: 1.5rem;
    }

    .relative {
      position: relative;
    }

    .absolute {
      position: absolute;
    }

    .top-0 {
      top: 0;
    }

    .left-0 {
      left: 0;
    }

    .object-cover {
      object-fit: cover;
    }

    .aspect-auto {
      aspect-ratio: auto;
    }

    .pb-full {
      padding-bottom: 100%;
    }

    .md\\:pb-0 {
      padding-bottom: 0;
    }
  `;
	document.head.appendChild(style);
}

export function renderPlay() {
	let username = localStorage.getItem("username");
	renderHTML(username);
	renderCSS();
}
