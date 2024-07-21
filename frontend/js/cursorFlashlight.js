document.addEventListener('DOMContentLoaded', function () {
	const spotlight = document.getElementById('spotlight');
	const slider = document.getElementById('flashlightSize');

	document.addEventListener('mousemove', function (e) {
		spotlight.style.left = `${e.pageX - spotlight.offsetWidth / 2}px`;
		spotlight.style.top = `${e.pageY - spotlight.offsetHeight / 2}px`;
	});

	slider.addEventListener('input', function () {
		const size = slider.value;
		spotlight.style.width = `${size}px`;
		spotlight.style.height = `${size}px`;
	});
});
