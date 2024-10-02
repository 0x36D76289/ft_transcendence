const HTML = `
<div class="blur-circle"></div>
`;

const CSS = `
.blur-circle {
	position: absolute;
	background-color: hsl(0, 100%, 50%, 0.5);
	border-radius: 50%;
	filter: blur(10rem);
	z-index: -2;
}
`;

export function createBlurCircle() {
	const circle = document.querySelector(".blur-circle");

	const size = 1000;
	circle.style.width = `${size}px`;
	circle.style.height = `${size}px`;

	let posX = Math.random() * (window.innerWidth - size);
	let posY = Math.random() * (window.innerHeight - size);
	let speedX = 0.9;
	let speedY = 0.9;

	function updatePosition() {
		posX += speedX;
		posY += speedY;

		if (posX <= 0 || posX + size >= window.innerWidth) {
			speedX *= -1;
		}
		if (posY <= 0 || posY + size >= window.innerHeight) {
			speedY *= -1;
		}

		circle.style.left = `${posX}px`;
		circle.style.top = `${posY}px`;

		requestAnimationFrame(updatePosition);
	}

	function handleResize() {
		posX = Math.min(posX, window.innerWidth - size);
		posY = Math.min(posY, window.innerHeight - size);
	}

	window.addEventListener('resize', handleResize);

	updatePosition();
}

export function initBlurCicle() {
	return [HTML, CSS];
}
