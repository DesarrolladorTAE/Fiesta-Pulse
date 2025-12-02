// src/pages/_app.js
import JeenaHead from "@/src/layout/JeenaHead";
import Preloader from "@/src/layout/Preloader";
import "@/styles/globals.css";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 🔒 Evita SSR del AlertProvider (y de su ToastViewport/portales)
const AlertProvider = dynamic(
  () =>
    import("@/src/components/alerts/AlertProvider").then(
      (m) => m.AlertProvider
    ),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      {loading && <Preloader />}
      <JeenaHead />

      {/* ✅ Toda la app dentro del AlertProvider (solo cliente) */}
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>

      {/* 🌨️ NIEVE GLOBAL CON BOTÓN VERDE CUANDO ESTÁ ACTIVA */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
              flakes = Array.from({ length: FLAKES_COUNT }).map(function () {
                return {
                  x: Math.random() * width,
                  y: Math.random() * height,
                  r: Math.random() * 2 + 2,                 // tamaño
                  d: Math.random() * 0.3 + 0.3,             // velocidad caída
                  angle: Math.random() * Math.PI * 2,       // ángulo actual
                  spin: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1),
                  type: Math.random() < 0.4 ? "snowflake" : "circle",
                };
              });
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
              flakes.forEach(function (f) {
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

              flakes.forEach(function (f) {
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
              btn.title = "Desactivar Navidad";
              btn.textContent = "🎄";

              // Estilos base
              btn.style.position = "fixed";
              btn.style.right = "20px";
              btn.style.bottom = "20px";
              btn.style.width = "44px";
              btn.style.height = "44px";
              btn.style.borderRadius = "50%";
              btn.style.border = "none";
              btn.style.cursor = "pointer";
              btn.style.zIndex = "9999";
              btn.style.fontSize = "22px";
              btn.style.color = "white";
              btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
              btn.style.transition = "all 0.25s ease";

              // Estado inicial: ACTIVO (verde)
              btn.style.background = "linear-gradient(135deg,#00d67a,#00a85a)";
              btn.style.opacity = "1";

              btn.addEventListener("click", function () {
                activo = !activo;

                if (activo) {
                  btn.title = "Desactivar Navidad";
                  btn.style.background = "linear-gradient(135deg,#00d67a,#00a85a)";
                  btn.style.opacity = "1";

                  if (!canvas) {
                    createCanvas();
                    draw();
                  } else {
                    canvas.style.display = "block";
                    draw();
                  }
                } else {
                  btn.title = "Activar Navidad";
                  btn.style.background = "linear-gradient(135deg,#555555,#222222)";
                  btn.style.opacity = "0.85";

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
            if (typeof document !== "undefined") {
              document.addEventListener("DOMContentLoaded", function () {
                createCanvas();
                createToggleButton();
                window.addEventListener("resize", resizeCanvas);
                draw();
              });
            }
          })();
        `,
        }}
      />
    </Fragment>
  );
}
