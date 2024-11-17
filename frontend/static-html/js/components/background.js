export function initBackground() {
	const canvas = document.createElement("canvas");
	canvas.id = "animated-background";
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	let particles = [];
	let mouseParticle = { x: 0, y: 0, vx: 0, vy: 0, radius: 0 };

	const circleRadius = 1;
	const lineWidth = 0.1;

	function createParticles() {
		const numParticles = Math.floor((canvas.width * canvas.height) / 10000);
		particles = Array.from({ length: numParticles }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			vx: (Math.random() - 0.5) * 0.5,
			vy: (Math.random() - 0.5) * 0.5,
			radius: circleRadius
		}));
		particles.push(mouseParticle);
	}

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		createParticles();
	}

	window.addEventListener("resize", resizeCanvas);
	resizeCanvas();

	window.addEventListener("mousemove", (e) => {
		mouseParticle.x = e.clientX;
		mouseParticle.y = e.clientY;
	});

	function animate() {
		let color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles.forEach(p => {
			if (p !== mouseParticle) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
			}

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
			ctx.fillStyle = color;
			ctx.fill();

			particles.forEach(other => {
				const dx = other.x - p.x;
				const dy = other.y - p.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < 200) {
					ctx.lineWidth = lineWidth;
					ctx.strokeStyle = color;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(other.x, other.y);
					ctx.stroke();
				}
			});
		});
		requestAnimationFrame(animate);
	}

	animate();
}
