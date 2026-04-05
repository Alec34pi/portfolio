const dots = document.getElementById('dots');
let dotCount = 1;

const dotInterval = setInterval(() => {
  dotCount = (dotCount % 3) + 1;
  dots.textContent = '.'.repeat(dotCount);
}, 500);

const progressFill = document.getElementById('progress-fill');
let progress = 0;

const progressCanvas = document.getElementById('particle-progress');
const ctx = progressCanvas.getContext('2d');
let w, h, particles = [];

const colors = ['#FF4500', '#FF6B00', '#FFD700', '#FF8C00', '#c8a84b', '#FF1800'];

function resizeCanvas() {
  w = progressCanvas.width  = progressCanvas.offsetWidth;
  h = progressCanvas.height = progressCanvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = Math.random() * -2 - 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = 1;
    this.life = 0;
    this.maxLife = Math.random() * 50 + 50;
    this.escaping = false;
  }

  update() {
    if (!this.escaping && Math.random() < 0.02) {
      this.escaping = true;
      this.speedX += (Math.random() - 0.5) * 1;
      this.speedY -= Math.random() * 2;
    }
    this.x += this.speedX + Math.sin(this.life * 0.1) * 0.3;
    this.y += this.speedY;
    if (this.escaping) this.size *= 0.97;
    this.opacity -= 1 / this.maxLife;
    this.life++;
    if (this.life >= this.maxLife || this.opacity <= 0 || this.y + this.size < 0) this.reset();
  }

  reset() {
    this.x = Math.random() * (progress / 100) * w;
    this.y = h / 2 + (Math.random() - 0.5) * h * 0.3;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = Math.random() * -2 - 1;
    this.opacity = 1; this.life = 0;
    this.maxLife = Math.random() * 50 + 50;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.escaping = false;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function addParticles(count, limitX) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * limitX;
    const y = h / 2 + (Math.random() - 0.5) * h * 0.3;
    particles.push(new Particle(x, y));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  for (let p of particles) { p.update(); p.draw(); }
  requestAnimationFrame(animateParticles);
}
animateParticles();

const progressInterval = setInterval(() => {
  progress += Math.random() * 5;
  if (progress > 95) progress = 95;
  progressFill.style.width = `${progress}%`;
  addParticles(5, (progress / 100) * w);
}, 200);

function loadSpline() {
  return new Promise(resolve => setTimeout(resolve, 4000));
}

loadSpline().then(() => {
  clearInterval(dotInterval);
  clearInterval(progressInterval);
  progressFill.style.width = '100%';
  addParticles(50, w);

  const loader = document.getElementById('loading-screen');
  const site   = document.getElementById('site-content');
  loader.style.opacity = '0';
  site.style.opacity   = '1';
  setTimeout(() => loader.style.display = 'none', 1000);
});