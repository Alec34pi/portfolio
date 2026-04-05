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


const colors = ['#FF4500', '#FF6B00', '#FFD700', '#FF8C00', '#c8a84b', '#FF1800'];

function resizeCanvas() {
  w = progressCanvas.width  = progressCanvas.offsetWidth;
  h = progressCanvas.height = progressCanvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();



const progressInterval = setInterval(() => {
  progress += Math.random() * 5;
  if (progress > 95) progress = 95;
  progressFill.style.width = `${progress}%`;
}, 200);

function loadSpline() {
  return new Promise(resolve => setTimeout(resolve, 4000));
}

loadSpline().then(() => {
  clearInterval(dotInterval);
  clearInterval(progressInterval);
  progressFill.style.width = '100%';

  const loader = document.getElementById('loading-screen');
  const site   = document.getElementById('site-content');
  loader.style.opacity = '0';
  site.style.opacity   = '1';
  setTimeout(() => loader.style.display = 'none', 1000);
});