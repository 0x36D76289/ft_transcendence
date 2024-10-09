const HTML = `
<div class="blur-circle-container">
	<div class="blur-circle blur-circle-1"></div>
	<div class="blur-circle blur-circle-2"></div>
</div>
`;

const CSS = `
.blur-circle-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: -1;
}

.blur-circle {
	position: absolute;
	border-radius: 50%;
	filter: blur(100px);
	opacity: 0.6;
	transition: transform 1s linear;
}

.blur-circle-1 {
	width: 300px;
	height: 300px;
	background-color: var(--colora);
	top: 10%;
	left: 20%;
}

.blur-circle-2 {
	width: 400px;
	height: 400px;
	background-color: var(--colora2);
	top: 50%;
	left: 70%;
}
`;


export function initBlurCircle() {
	return [HTML, CSS];
}
