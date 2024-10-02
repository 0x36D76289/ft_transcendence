
const HTML = `
<div class="background-video">
	<video autoplay muted loop id="video-background">
		<source src="./assets/videos/background.mp4" type="video/mp4">
		Your browser does not support the video tag.
	</video>
</div>
`

const CSS = `
.background-video {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	z-index: -2;
	user-select: none;
}

.background-video video {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 100vw;
	height: 100vh;
	transform: translate(-50%, -50%);
	object-fit: cover;
	pointer-events: none;
}
`

export function initBackground() {
	return [HTML, CSS];
}
