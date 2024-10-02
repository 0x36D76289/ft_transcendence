const CSS = `
.broken-pixel {
	position: absolute;
	width: 16px;
	height: 16px;
	background-color: white;
	animation: breakPixel 5s ease-in-out forwards;
	z-index: -1;
}

@keyframes breakPixel {
	0% {
		opacity: 1;
		transform: scale(1);
	}

	100% {
		opacity: 0;
		transform: scale(0.5);
	}
}
`;

const GRID_SIZE = 16; 
const brokenPixels = new Set();
const MAX_PIXELS = 500;
let lastPixelTime = 0;
const PIXEL_DELAY = 10;

export function breakPixel(x, y) {
	const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE;
	const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE;
	const pixelKey = `${gridX},${gridY}`;

	if (brokenPixels.has(pixelKey)) {
		return;
	}

	if (brokenPixels.size >= MAX_PIXELS) {
		const firstPixelKey = brokenPixels.values().next().value;
		brokenPixels.delete(firstPixelKey);
		document.querySelector(`[data-key="${firstPixelKey}"]`)?.remove();
	}

	brokenPixels.add(pixelKey);

	const pixel = document.createElement('div');
	pixel.classList.add('broken-pixel');
	pixel.style.top = `${gridY}px`;
	pixel.style.left = `${gridX}px`;
	pixel.setAttribute('data-key', pixelKey);

	document.body.appendChild(pixel);

	setTimeout(() => {
		pixel.remove();
		brokenPixels.delete(pixelKey);
	}, 6000);
}

export function pixelBreakerEvent() {
	let isMouseDown = false;

	document.addEventListener("mousedown", (event) => {
		isMouseDown = true;
		breakPixel(event.clientX, event.clientY);
	});

	document.addEventListener("mousemove", (event) => {
		// Ajouter un délai pour limiter la fréquence des pixels
		if (isMouseDown) {
			const currentTime = Date.now();
			if (currentTime - lastPixelTime > PIXEL_DELAY) {
				breakPixel(event.clientX, event.clientY);
				lastPixelTime = currentTime;
			}
		}
	});

	document.addEventListener("mouseup", () => {
		isMouseDown = false;
	});
}

export function initPixelBreaker() {
	return [``, CSS];
}
