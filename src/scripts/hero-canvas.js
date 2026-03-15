/**
 * Hero Canvas Animation - Font Showcase Site
 * Creates an interactive particle network animation
 */

export function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let isActive = true;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    particles = [];
    const count = Math.min(30, Math.floor(canvas.offsetWidth / 40));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function getColorValues() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      particle: isDark ? '138, 143, 152' : '115, 115, 115',
      line: isDark ? '255, 255, 255' : '0, 0, 0'
    };
  }

  function draw() {
    if (!isActive) return;

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const colors = getColorValues();

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / 150) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      const dx = particles[i].x - mouseX;
      const dy = particles[i].y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${colors.line}, ${(1 - distance / 200) * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Draw particles
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors.particle}, ${particle.opacity})`;
      ctx.fill();

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around
      if (particle.x < 0) particle.x = canvas.offsetWidth;
      if (particle.x > canvas.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.offsetHeight;
      if (particle.y > canvas.offsetHeight) particle.y = 0;
    }

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    createParticles();
    draw();
  }

  function stop() {
    isActive = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  // Event listeners
  window.addEventListener('resize', () => {
    stop();
    start();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      isActive = true;
      start();
    }
  });

  // Start animation
  start();
}

// Export for use in main.js
export default initHeroCanvas;
