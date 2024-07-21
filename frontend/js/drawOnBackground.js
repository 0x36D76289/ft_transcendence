document.addEventListener('DOMContentLoaded', function () {
	const body = document.body;
	const spotlight = document.getElementById('spotlight');
	let isDrawing = false;

	document.addEventListener('mousemove', function (e) {
		if (isDrawing) {
			const dot = document.createElement('div');
			dot.classList.add('dot');

			const spotlightSize = spotlight.offsetWidth;
			const dotSize = spotlightSize / 2; // Calculate the size of the dot

			dot.style.backgroundColor = getComputedStyle(body).getPropertyValue('--line-color');
			dot.style.left = `${e.pageX - dotSize}px`; // Subtract half of the dot size from the x-coordinate
			dot.style.top = `${e.pageY - dotSize}px`; // Subtract half of the dot size from the y-coordinate

			dot.style.width = `${spotlightSize}px`;
			dot.style.height = `${spotlightSize}px`;
			body.appendChild(dot);
		}
	});

	document.addEventListener('mousedown', function () {
		isDrawing = true;
	});

	document.addEventListener('mouseup', function () {
		isDrawing = false;
	});

	document.addEventListener('auxclick', function (e) {
		if (e.button === 1) {
			const dots = document.querySelectorAll('.dot');
			dots.forEach(dot => dot.remove());
		}
	});
});
