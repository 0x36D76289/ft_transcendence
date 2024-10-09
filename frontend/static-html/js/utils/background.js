const HTML = `
<canvas id="backgroundCanvas"></canvas>
`;

const CSS = `
#backgroundCanvas {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	background-color: black;
}
`;

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = Math.random() * 5 + 1;
		this.speedX = Math.random() * 3 - 1.5;
		this.speedY = Math.random() * 3 - 1.5;
		this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
	}

	update(mouseX, mouseY) {
		this.x += this.speedX;
		this.y += this.speedY;

		const dx = mouseX - this.x;
		const dy = mouseY - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < 100) {
			const angle = Math.atan2(dy, dx);
			const force = (100 - distance) / 100;
			this.speedX -= Math.cos(angle) * force * 0.2;
			this.speedY -= Math.sin(angle) * force * 0.2;
		}

		if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
		if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}

export function initBackground() {
	return [HTML, CSS];
}

export function eventBackground() {
	const canvas = document.getElementById('backgroundCanvas');
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let particles = [];
	const particleCount = 100;

	for (let i = 0; i < particleCount; i++) {
		particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
	}

	let mouseX = 0;
	let mouseY = 0;

	canvas.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach((particle) => {
			particle.update(mouseX, mouseY);
			particle.draw(ctx);
		});

		requestAnimationFrame(animate);
	}

	animate();

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
}