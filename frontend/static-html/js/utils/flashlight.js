
const HTML = `
<div class="flashlight"></div>
`

const CSS = `
.flashlight {
	position: absolute;
	width: 50px;
	height: 50px;
	background: rgba(255, 255, 255, 0.5);
	border-radius: 50%;
	pointer-events: none;
	transition: transform 0.1s, width 0.1s, height 0.1s;
	z-index: 2;
	transform: translate(-50%, -50%);
}

.flashlight.active {
	width: 40px;
	height: 40px;
}
`

export function flashlightEvent() {
	const flashlight = document.querySelector(".flashlight");

	document.addEventListener("mousemove", (event) => {
		flashlight.style.left = `${event.clientX}px`;
		flashlight.style.top = `${event.clientY}px`;
	});

	document.addEventListener("mousedown", (event) => {
		flashlight.classList.add("active");
	});
	document.addEventListener("mouseup", () => {
		flashlight.classList.remove("active");
	});
}

export function initflashlight() {
	return [HTML, CSS];
}

