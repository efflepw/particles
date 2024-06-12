const PARTICLES_AMOUNT = 500;
const DISTANCE_PER_FRAME = 0.25;

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1200;

const DOT_SIZE = 2;

window.onload = () => {
  const particles = Array.from({ length: PARTICLES_AMOUNT }, () => ({
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
  }));
  const particlesAngle = Array.from({ length: PARTICLES_AMOUNT }, () => ({
    alpha: Math.random() * Math.PI * 2,
  }));

  const canvas = document.getElementById("canvas");

  if (!canvas) return;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  // const rect = canvas.getBoundingClientRect();

  ctx.fillStyle = "#ffea75";

  const updateParticlesPosition = () => {
    for (let i = 0; i < PARTICLES_AMOUNT; i++) {
      particles[i].x += Math.cos(particlesAngle[i].alpha) * DISTANCE_PER_FRAME;
      particles[i].y += Math.sin(particlesAngle[i].alpha) * DISTANCE_PER_FRAME;

      if (particles[i].x < 0) particles[i].x = CANVAS_WIDTH;
      if (particles[i].x > CANVAS_WIDTH) particles[i].x = 0;
      if (particles[i].y < 0) particles[i].y = CANVAS_HEIGHT;
      if (particles[i].y > CANVAS_HEIGHT) particles[i].y = 0;

      if (Math.random() > 0.8) {
        particlesAngle[i].alpha += Math.random() * 0.2 - 0.1;
      }
    }
  };

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    updateParticlesPosition();
    for (let i = 0; i < PARTICLES_AMOUNT; i++) {
      ctx.fillRect(particles[i].x, particles[i].y, DOT_SIZE, DOT_SIZE);
    }
    requestAnimationFrame(animate);
  }

  animate();
};
