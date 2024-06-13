const THEMES = {
  PALETTE_1: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  PALETTE_2: ["#f4f1de", "#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"],
};

const CONFIG = {
  PARTICLES_AMOUNT: 1000,
  SPEED: 0.2,
  FLOAT_SPEED_DELTA: 0.3,
  DISTANCE_ACCELERATOR: 0.05,
  DISTANCE_SLOW: 0.01,
  CANVAS_WIDTH: 1728,
  CANVAS_HEIGHT: 897,
  DOT_SIZE: 2,
  DISTANCE_TO_MOUSE: 100,
  PALETTE: THEMES.PALETTE_1,
};

window.onload = () => {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = CONFIG.PARTICLE_COLOR;

  const particles = createParticles();
  const mouse = { x: -200, y: -200 };

  document.addEventListener("mousemove", (e) =>
    updateMousePosition(e, rect, canvas, mouse)
  );
  animate(ctx, particles, mouse);
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * CONFIG.PALETTE.length);

  return CONFIG.PALETTE[randomIndex];
};

const createParticles = () =>
  Array.from({ length: CONFIG.PARTICLES_AMOUNT }, () => ({
    x: Math.random() * CONFIG.CANVAS_WIDTH,
    y: Math.random() * CONFIG.CANVAS_HEIGHT,
    alpha: Math.random() * Math.PI * 2,
    speed: CONFIG.SPEED + Math.random() * 0.1,
    maxFloatingSpeed:
      CONFIG.SPEED + (Math.random() - 0.5) * CONFIG.FLOAT_SPEED_DELTA,
    color: getRandomColor(),
  }));

const updateMousePosition = (e, rect, canvas, mouse) => {
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouse.x = (e.clientX - rect.left) * scaleX;
  mouse.y = (e.clientY - rect.top) * scaleY;
};

const updateParticlesPosition = (particles, mouse) => {
  particles.forEach((particle, i) => {
    particle.x += Math.cos(particles[i].alpha) * particles[i].speed;
    particle.y += Math.sin(particles[i].alpha) * particles[i].speed;

    wrapAroundCanvas(particle);

    const distanceToMouse = calculateDistance(particle, mouse);
    if (distanceToMouse < CONFIG.DISTANCE_TO_MOUSE) {
      const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
      particles[i].alpha = angle;
      particles[i].speed += CONFIG.DISTANCE_ACCELERATOR;
    } else if (Math.random() > 0.8) {
      particles[i].alpha += Math.random() * 0.2 - 0.1;
    } else if (particles[i].speed > particles[i].maxFloatingSpeed) {
      particles[i].speed -= CONFIG.DISTANCE_SLOW;
    }
  });
};

const wrapAroundCanvas = (particle) => {
  if (particle.x < 0) particle.x = CONFIG.CANVAS_WIDTH;
  if (particle.x > CONFIG.CANVAS_WIDTH) particle.x = 0;
  if (particle.y < 0) particle.y = CONFIG.CANVAS_HEIGHT;
  if (particle.y > CONFIG.CANVAS_HEIGHT) particle.y = 0;
};

const calculateDistance = (p1, p2) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const animate = (ctx, particles, mouse) => {
  ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
  updateParticlesPosition(particles, mouse);
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, CONFIG.DOT_SIZE, CONFIG.DOT_SIZE);
  });
  requestAnimationFrame(() => animate(ctx, particles, mouse));
};
