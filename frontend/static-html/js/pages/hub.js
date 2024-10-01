import { loadPage } from '../spa.js';

const HTML = `
<div class="main-content">
	<button class="play-btn"><h1>Play</h1></button>
</div>
`

const CSS = `
button {
	font-family: var(--ff);
	font-size: 1rem;
	padding: var(--padding-xs) var(--padding-s);
	border: none;
	border-radius: 4px;
	background-color: var(--color-primary);
	color: var(--gray10);
	transition: transform var(--transition);
}

.main-content {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	height: 100vh;
	margin: 0;

	.play-btn {
		backdrop-filter: blur(32px);
		border-radius: 12px;
		padding: var(--padding-m);
		border: none;
		/* cursor: pointer; */
		z-index: 0;
		transition: background-color var(--transition), transform var(--transition);
	}

	.play-btn:hover {
		transform: scale(1.05);
	}

	.play-btn:active {
		transform: scale(0.95);
	}
}

button:hover {
	transform: scale(1.3);
}

button:active {
	transform: scale(1.2);
}
`

export function hub() {
  loadPage(HTML, CSS);
}