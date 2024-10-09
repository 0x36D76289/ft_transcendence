const HTML = `
<div id="pixelBreaker"></div>
`;

const CSS = `
#pixelBreaker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.pixel {
  position: absolute;
  background-color: var(--colora);
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
`;

class Pixel {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.el = document.createElement('div');
    this.el.classList.add('pixel');
    this.el.style.width = `${size}px`;
    this.el.style.height = `${size}px`;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.targetX = x;
    this.targetY = y;
  }

  setPosition(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.el.style.transform = `translate(${x - this.x}px, ${y - this.y}px)`;
  }

  reset() {
    this.el.style.transform = 'translate(0, 0)';
  }
}

let pixels = [];
const pixelSize = 10;
let isBreaking = false;

function createPixels() {
  const container = document.getElementById('pixelBreaker');
  container.innerHTML = '';
  pixels = [];

  const cols = Math.ceil(window.innerWidth / pixelSize);
  const rows = Math.ceil(window.innerHeight / pixelSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pixel = new Pixel(x * pixelSize, y * pixelSize, pixelSize);
      container.appendChild(pixel.el);
      pixels.push(pixel);
    }
  }
}

function breakPixels(centerX, centerY) {
  if (isBreaking) return;
  isBreaking = true;

  pixels.forEach(pixel => {
    const dx = pixel.x - centerX;
    const dy = pixel.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.max(window.innerWidth, window.innerHeight);
    const factor = Math.min(1, distance / maxDistance);

    const angle = Math.atan2(dy, dx);
    const targetDistance = factor * maxDistance * 0.5;
    const targetX = centerX + Math.cos(angle) * targetDistance;
    const targetY = centerY + Math.sin(angle) * targetDistance;

    pixel.setPosition(targetX, targetY);
  });

  setTimeout(() => {
    pixels.forEach(pixel => pixel.reset());
    isBreaking = false;
  }, 1000);
}

export function initPixelBreaker() {
  return [HTML, CSS];
}

export function pixelBreakerEvent() {
  createPixels();

  window.addEventListener('resize', createPixels);

  document.addEventListener('click', (e) => {
    breakPixels(e.clientX, e.clientY);
  });
}