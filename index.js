const THEMES = {
  PALETTE_1: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  PALETTE_2: ["#f4f1de", "#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"],
  PALETTE_3: ["#fff"],
  PALETTE_4: ["#FEFFD2", "#FFEEA9", "#FFBF78", "#FF7D29"],
  PALETTE_5: ["#a67c00", "#bf9b30", "#ffbf00", "#ffcf40", "#ffdc73"],
  PALETTE_6: ["#c4c4fd", "#ffec9c", "#6a71a5", "#35336b", "#091e36"],
};

const MOUSE_MODES = {
  REPULSION: "repulsion",
  ATTRACTION: "attraction",
  OFF: "off",
};

const CONFIG = {
  PARTICLES_AMOUNT: 200,
  SPEED: 0.2,
  SPEED_DELTA: 0.1,
  ANGLE_DELTA: 0.05,
  FLOAT_SPEED_DELTA: 0.3,
  DISTANCE_ACCELERATOR: 0.01,
  DISTANCE_SLOW: 0.005,
  SPEED_CAP: 1.8,
  CANVAS_WIDTH: 1728,
  CANVAS_HEIGHT: 897,
  DOT_SIZE: 2,
  ARC_SIZE: 3,
  INTERACTION_DISTANCE: 100,
  PALETTE: THEMES.PALETTE_6,
  MOUSE_MODE: MOUSE_MODES.OFF,
  ENABLE_WAVES: true,
};

const WAVES_CONFIG = {
  COUNT: 10,
  BASE_SPEED: 0.5,
  SIZE: 50,
  SPEED_DELTA: 0.4,
  ANGLE_DELTA: 0.1,
};

const MOUSE_INITIAL_STATE = {
  x: -1 * CONFIG.INTERACTION_DISTANCE,
  y: -1 * CONFIG.INTERACTION_DISTANCE,
  prevX: -1 * CONFIG.INTERACTION_DISTANCE,
  prevY: -1 * CONFIG.INTERACTION_DISTANCE,
  angle: 0,
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
  const waves = createWaves();

  const mouse = MOUSE_INITIAL_STATE;

  if (CONFIG.MOUSE_MODE !== MOUSE_MODES.OFF) {
    document.addEventListener("mousemove", (e) =>
      updateMousePosition(e, rect, canvas, mouse)
    );
  }

  animate(ctx, particles, waves, mouse);
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * CONFIG.PALETTE.length);

  return CONFIG.PALETTE[randomIndex];
};

const createParticles = () =>
  Array.from({ length: CONFIG.PARTICLES_AMOUNT }, () => ({
    x: Math.random() * CONFIG.CANVAS_WIDTH,
    y: Math.random() * CONFIG.CANVAS_HEIGHT,
    angle: Math.random() * Math.PI * 2,
    speed: CONFIG.SPEED + Math.random() * 0.1,
    maxFloatingSpeed:
      CONFIG.SPEED + (Math.random() - 0.5) * CONFIG.FLOAT_SPEED_DELTA,
    color: getRandomColor(),
  }));

const createWaves = () =>
  Array.from({ length: WAVES_CONFIG.COUNT }, () => ({
    x: Math.random() * CONFIG.CANVAS_WIDTH,
    y: Math.random() * CONFIG.CANVAS_HEIGHT,
    angle: Math.random() * Math.PI * 2,
    speed: WAVES_CONFIG.BASE_SPEED + Math.random() * WAVES_CONFIG.SPEED_DELTA,
  }));

const updateMousePosition = (e, rect, canvas, mouse) => {
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  mouse.prevX = mouse.x;
  mouse.prevY = mouse.y;

  mouse.x = (e.clientX - rect.left) * scaleX;
  mouse.y = (e.clientY - rect.top) * scaleY;

  if (mouse.x !== mouse.prevX && mouse.y !== mouse.prevY) {
    mouse.angle = Math.atan2(mouse.y - mouse.prevY, mouse.x - mouse.prevX);
  }
};

const waveRepulsion = (particle, wave) => {
  const distanceToWave = calculateDistance(particle, wave);

  if (distanceToWave < CONFIG.INTERACTION_DISTANCE) {
    const angle = Math.atan2(particle.y - wave.y, particle.x - wave.x);

    particle.angle = angle;
    particle.speed = particle.speed + CONFIG.DISTANCE_ACCELERATOR;

    return true;
  }

  return false;
};

const waveAttraction = (particle, wave, size) => {
  const distanceToWave = calculateDistance(particle, wave);

  if (distanceToWave < size) {
    const angleDelta = Math.sign(wave.angle - particle.angle) * 0.05;

    particle.angle += angleDelta;
    particle.speed = Math.min(
      particle.speed + CONFIG.DISTANCE_ACCELERATOR,
      CONFIG.SPEED_CAP
    );

    return true;
  }

  return false;
};

const interactWithMouse = (particle, mouse) => {
  switch (CONFIG.MOUSE_MODE) {
    case MOUSE_MODES.REPULSION:
      return waveRepulsion(particle, mouse);
    case MOUSE_MODES.ATTRACTION:
      return waveAttraction(particle, mouse, CONFIG.INTERACTION_DISTANCE);
    default:
      return false;
  }
};

const interactWithWaves = (particle, waves) => {
  let interacted = false;

  waves.forEach((wave) => {
    interacted =
      interacted || waveAttraction(particle, wave, WAVES_CONFIG.SIZE);
  });

  return interacted;
};

const updateParticlesPosition = (particles, waves, mouse) => {
  particles.forEach((particle) => {
    let interacted = false;

    if (CONFIG.MOUSE_MODE !== MOUSE_MODES.OFF) {
      interacted = interactWithMouse(particle, mouse);
    }

    if (CONFIG.ENABLE_WAVES) {
      interacted = interacted || interactWithWaves(particle, waves);
    }

    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed;

    particle.angle += CONFIG.ANGLE_DELTA * (Math.random() - 0.5);

    if (!interacted && particle.speed > particle.maxFloatingSpeed) {
      particle.speed -= CONFIG.DISTANCE_SLOW;
    }

    wrapAroundCanvas(particle);
  });
};

const updateWavesPosition = (waves) => {
  waves.forEach((wave) => {
    wave.x += Math.cos(wave.angle) * wave.speed;
    wave.y += Math.sin(wave.angle) * wave.speed;

    wave.angle += WAVES_CONFIG.ANGLE_DELTA * (Math.random() - 0.5);

    wrapAroundCanvas(wave);
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

const renderParticlesRect = (ctx, particles) => {
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, CONFIG.DOT_SIZE, CONFIG.DOT_SIZE);
  });
};

const renderParticlesArc = (ctx, particles) => {
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.arc(particle.x, particle.y, CONFIG.ARC_SIZE, 0, Math.PI * 2);
    ctx.shadowBlur = 10;
    ctx.shadowColor = particle.color;
    ctx.fill();
  });
};

const animate = (ctx, particles, waves, mouse) => {
  ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  updateWavesPosition(waves);
  updateParticlesPosition(particles, waves, mouse);

  // renderParticlesRect(ctx, particles);
  renderParticlesArc(ctx, particles);

  requestAnimationFrame(() => animate(ctx, particles, waves, mouse));
};
