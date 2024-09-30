import { loadPage } from '../spa.js';

const HTML = `
<div class="main-content">
	<button><h1>Play</h1></button>
</div>
`

const CSS = `
button {
	font-family: var(--ff);
	font-size: 1rem;
	padding: var(--padding-xs) var(--padding-s);
	border: none;
	border-radius: 4px;
	cursor: pointer;
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