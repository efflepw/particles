const PARTICLES_AMOUNT = 500;
const DISTANCE_PER_FRAME = 0.15;
const DISTANCE_ACCELERATOR = 0.05;

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1200;

const DOT_SIZE = 2;

const DISTANCE_TO_MOUSE = 100;

window.onload = () => {
  const particles = Array.from({ length: PARTICLES_AMOUNT }, () => ({
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
  }));
  const particlesAngle = Array.from({ length: PARTICLES_AMOUNT }, () => ({
    alpha: Math.random() * Math.PI * 2,
    speed: DISTANCE_PER_FRAME + Math.random() * 0.1,
    maxFloatingSpeed: DISTANCE_PER_FRAME + Math.random() * 0.4 - 0.2,
  }));
  const mouse = { x: 0, y: 0 };

  const canvas = document.getElementById("canvas");

  if (!canvas) return;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  ctx.fillStyle = "#d959f9";

  const updateParticlesPosition = () => {
    for (let i = 0; i < PARTICLES_AMOUNT; i++) {
      particles[i].x +=
        Math.cos(particlesAngle[i].alpha) * particlesAngle[i].speed;
      particles[i].y +=
        Math.sin(particlesAngle[i].alpha) * particlesAngle[i].speed;

      if (particles[i].x < 0) particles[i].x = CANVAS_WIDTH;
      if (particles[i].x > CANVAS_WIDTH) particles[i].x = 0;
      if (particles[i].y < 0) particles[i].y = CANVAS_HEIGHT;
      if (particles[i].y > CANVAS_HEIGHT) particles[i].y = 0;

      const distanceToMouse = Math.sqrt(
        Math.pow(mouse.x - particles[i].x, 2) +
          Math.pow(mouse.y - particles[i].y, 2)
      );

      if (distanceToMouse < DISTANCE_TO_MOUSE) {
        const angle = Math.atan2(
          particles[i].y - mouse.y,
          particles[i].x - mouse.x
        );

        particlesAngle[i].alpha = angle;
        particlesAngle[i].speed += DISTANCE_ACCELERATOR;
      } else if (Math.random() > 0.8) {
        particlesAngle[i].alpha += Math.random() * 0.2 - 0.1;
      } else if (particlesAngle[i].speed > particlesAngle[i].maxFloatingSpeed) {
        particlesAngle[i].speed -= DISTANCE_ACCELERATOR;
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    updateParticlesPosition();
    for (let i = 0; i < PARTICLES_AMOUNT; i++) {
      ctx.fillRect(particles[i].x, particles[i].y, DOT_SIZE, DOT_SIZE);
    }
    requestAnimationFrame(animate);
  };

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  document.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  });

  animate();
};
