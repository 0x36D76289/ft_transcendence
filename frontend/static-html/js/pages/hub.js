import { loadPage, navigate } from '../spa.js';
import { initSidebar, sidebarEvent } from '../utils/sidebar.js';
import { backgroundEvent, initBackground } from '../utils/background.js';

const HTML = `
<div class="main-content">
	<button class="play-btn"><h1>Play</h1></button>
</div>
`;

const CSS = `
.main-content {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	height: 100vh;
	margin: 0;

	.play-btn {
		backdrop-filter: blur(128px);
		border-radius: 64px;
		padding: var(--padding-xxl);
		border: none;
		z-index: 0;
		transition: background-color var(--transition), transform var(--transition);
		background-color: var(--colora);
		user-select: none;

		button {
			font-family: var(--ff);
			font-size: 1rem;
			padding: var(--padding-xs) var(--padding-s);
			border: none;
			border-radius: 4px;
			background-color: var(--colora);
			color: var(--gray10);
			transition: transform var(--transition);
			transform: scale(1.3);

			&:active {
				transform: scale(1.2);
			}
		}

		&:hover {
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}
	}
}
`;

export function hub() {
	const [sidebarHTML, sidebarCSS] = initSidebar();
	const [backgroundHTML, backgroundCSS] = initBackground();

	const loadHTML = `
	${sidebarHTML}
	${backgroundHTML}
	${HTML}
	`
	const loadCSS = `
	${sidebarCSS}
	${backgroundCSS}
	${CSS}
	`

	loadPage(loadHTML, loadCSS);
	backgroundEvent();
	sidebarEvent();

	document.querySelector(".play-btn").addEventListener("click", async (event) => {
		navigate("/pong");
	});
}
