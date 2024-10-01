
const CSS = `
.broken-pixel {
	position: absolute;
	width: 16px;
	height: 16px;
	background-color: brown;
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
`

export function breakPixel(x, y) {
	const pixel = document.createElement('div');
	pixel.classList.add('broken-pixel');
	pixel.style.top = `${y}px`;
	pixel.style.left = `${x}px`;
	document.body.appendChild(pixel);

	setTimeout(() => {
		pixel.remove();
	}, 6000);
}

export function pixelBreakerEvent() {
	document.addEventListener("mousedown", (event) => {
		breakPixel(event.clientX, event.clientY);
	});
}

export function initPixelBreaker() {
	return [``, CSS];
}
