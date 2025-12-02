// assets/js/snow.js
(function () {
  let activo = true;        // estado inicial (nieve activa)
  let canvas, ctx;
  let width, height;
  let flakes = [];
  let animationId;
  const FLAKES_COUNT = 140;

  // Crear canvas en el DOM
  function createCanvas() {
    canvas = document.createElement("canvas");
    canvas.id = "snow-canvas";
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9998",
    });
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");
    resizeCanvas();
    createFlakes();
  }

  function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createFlakes() {
    flakes = Array.from({ length: FLAKES_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 2,                 // tamaño
      d: Math.random() * 0.3 + 0.3,             // velocidad caída
      angle: Math.random() * Math.PI * 2,       // ángulo actual
      spin: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1),
      type: Math.random() < 0.4 ? "snowflake" : "circle",
    }));
  }

  function drawSnowflakeShape(f) {
    const size = f.r * 4;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.angle);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(180, 210, 255, 0.95)";

    // 6 brazos
    for (let i = 0; i < 6; i++) {
      ctx.rotate((Math.PI * 2) / 6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size);

      const branch = size * 0.35;
      const y = -size * 0.6;

      ctx.moveTo(0, y);
      ctx.lineTo(-branch, y - branch * 0.4);
      ctx.moveTo(0, y);
      ctx.lineTo(branch, y - branch * 0.4);

      ctx.stroke();
    }

    ctx.restore();
  }

  function updateFlakes() {
    flakes.forEach((f) => {
      f.y += f.d;
      f.x += Math.sin(f.y * 0.01) * 0.4;
      f.angle += f.spin;

      if (f.y > height + 20) {
        f.y = -10;
        f.x = Math.random() * width;
      }
      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
    });
  }

  function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.shadowColor = "rgba(130, 160, 210, 0.9)";
    ctx.shadowBlur = 6;

    flakes.forEach((f) => {
      if (f.type === "circle") {
        ctx.beginPath();
        ctx.fillStyle = "rgba(200, 225, 255, 0.95)";
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(150, 180, 230, 0.9)";
        drawSnowflakeShape(f);
      }
    });

    updateFlakes();
    animationId = requestAnimationFrame(draw);
  }

  // Botón flotante 🎄
  function createToggleButton() {
    const btn = document.createElement("button");
    btn.id = "christmas-toggle";
    btn.className = "christmas-button christmas-active";
    btn.title = "Desactivar Navidad";
    btn.textContent = "🎄";

    btn.addEventListener("click", () => {
      activo = !activo;

      if (activo) {
        btn.classList.add("christmas-active");
        btn.title = "Desactivar Navidad";
        if (!canvas) {
          createCanvas();
          draw();
        } else {
          canvas.style.display = "block";
          draw();
        }
      } else {
        btn.classList.remove("christmas-active");
        btn.title = "Activar Navidad";
        if (canvas) {
          canvas.style.display = "none";
        }
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      }
    });

    document.body.appendChild(btn);
  }

  // Init cuando cargue el DOM
  document.addEventListener("DOMContentLoaded", () => {
    createCanvas();
    createToggleButton();
    window.addEventListener("resize", resizeCanvas);
    draw();
  });
})();
