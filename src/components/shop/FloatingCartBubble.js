"use client";
import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "7445002399";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

/* ===========================
   MENSAJE WHATSAPP
   =========================== */
function buildWhatsAppMessage(items, total) {
  const lines = [];

  lines.push("*Solicitud de agenda - Lavandería Premium*");
  lines.push("");
  lines.push(
    "Hola, quiero agendar una visita para llevar mis prendas y confirmar disponibilidad."
  );
  lines.push("");

  if (!items || items.length === 0) {
    lines.push("*Detalle:* (sin productos/servicios seleccionados)");
  } else {
    lines.push("*Detalle:*");
    items.forEach((it, idx) => {
      const qty = it.qty || 1;
      const price = Number(it.price || 0);
      const subtotal = price * qty;

      lines.push(
        `${idx + 1}. ${it.name}  x${qty}  -  ${money(price)}  (Sub: ${money(
          subtotal
        )})`
      );
    });
  }

  lines.push("");
  lines.push(`*Total estimado:* ${money(total)}`);
  lines.push("");
  lines.push(
    "¿Me confirmas si tienen disponibilidad hoy o mañana y el horario recomendado?"
  );
  lines.push("Gracias.");

  return lines.join("\n");
}

/* ===========================
   MODAL PEQUEÑO DE ÉXITO
   =========================== */
function SuccessMiniModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw, 360px)",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 18px 60px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 14,
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src="/assets/images/logos/lol.png"
            alt="Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              objectFit: "contain",
              background: "#f6f6f6",
              padding: 6,
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900 }}>Listo</div>
            {/* <div style={{ fontSize: 13, opacity: 0.75 }}>
              Mensaje preparado para WhatsApp
            </div> */}
          </div>
        </div>

        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            Haz hecho tu peticion para agendar tu visita, solo preciona en:  <b>Enviar</b>  para comenzar para
            agendar tu visita.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FloatingCartBubble({
  items,
  onRemove,
  onQty,
  onClear, // ✅ opcional: si lo pasas, limpiamos carrito tras abrir WhatsApp
}) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const { count, total } = useMemo(() => {
    const c = (items || []).reduce((a, b) => a + (b.qty || 1), 0);
    const t = (items || []).reduce(
      (a, b) => a + Number(b.price || 0) * (b.qty || 1),
      0
    );
    return { count: c, total: t };
  }, [items]);

  const handleWhatsApp = () => {
    if (!items || items.length === 0) return;

    const msg = buildWhatsAppMessage(items, total);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      msg
    )}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.open(url, isMobile ? "_self" : "_blank", "noopener,noreferrer");

    // ✅ abrir modal de éxito
    setSuccessOpen(true);

    // ✅ limpiar carrito si nos mandan onClear
    onClear?.();

    setOpen(false);
  };

  return (
    <>
      {/* Modal éxito */}
      <SuccessMiniModal open={successOpen} onClose={() => setSuccessOpen(false)} />

      {/* Floating button */}
      <button
        className="fab-cart"
        aria-label="Carrito"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          zIndex: 1000,
          border: "none",
          borderRadius: "999px",
          padding: "12px 16px",
          background: "#0b3d91", // 🔵 Azul oscuro elegante
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,.25)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <i className="far fa-shopping-cart" />
        <span style={{ fontWeight: 700 }}>{count}</span>
      </button>

      {/* Slide-up panel */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: open ? "calc(var(--fab-bottom) + 60px)" : "-1000px",
          transition: "bottom .25s ease",
          zIndex: 999,
          width: "min(92vw, 360px)",
          maxHeight: "65vh",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 16px 40px rgba(0,0,0,.22)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 14,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>Mi Carrito</strong>
          <span style={{ opacity: 0.75 }}>
            {count} {count === 1 ? "Producto" : "Productos"}
          </span>
        </div>

        <div style={{ padding: 12, overflow: "auto", maxHeight: "44vh" }}>
          {(items || []).length === 0 && (
            <p style={{ margin: 8, opacity: 0.7 }}>Tu carrito está vacío.</p>
          )}

          {(items || []).map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "8px 4px",
              }}
            >
              <img
                src={it.image || "/assets/images/logos/lol2.png"}
                alt={it.name}
                style={{
                  width: 56,
                  height: 56,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #eee",
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {it.name}
                </div>

                <div style={{ fontSize: 13, opacity: 0.7 }}>{money(it.price)}</div>

                {/* Qty */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <button
                    onClick={() => onQty?.(it.id, Math.max(1, (it.qty || 1) - 1))}
                    aria-label="Disminuir cantidad"
                    style={{
                      border: "1px solid #ddd",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#fafafa",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>

                  <input
                    className="cart-qty-input"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={it.qty || 1}
                    onChange={(e) =>
                      onQty?.(it.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    style={{
                      width: 108,
                      height: 28,
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#fff",
                      fontWeight: 700,
                    }}
                  />

                  <button
                    onClick={() => onQty?.(it.id, (it.qty || 1) + 1)}
                    aria-label="Aumentar cantidad"
                    style={{
                      border: "1px solid #ddd",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#fafafa",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => onRemove?.(it.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#d00",
                  cursor: "pointer",
                  padding: 6,
                }}
                aria-label="Eliminar"
              >
                <i className="far fa-trash-alt" />
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #eee" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>

          <button
            disabled={(items || []).length === 0}
            onClick={handleWhatsApp}
            style={{
              width: "100%",
              height: 44,
              background: "#25D366",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              opacity: (items || []).length === 0 ? 0.6 : 1,
              cursor: (items || []).length === 0 ? "not-allowed" : "pointer",
            }}
          >
            AGENDAR POR WHATSAPP
          </button>
        </div>
      </div>

      {/* Hard override so the qty number never disappears */}
      <style jsx global>{`
        .cart-qty-input {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important;
          background: #fff !important;
          text-indent: 0 !important;
          caret-color: #111 !important;
        }
        .cart-qty-input {
          -moz-appearance: textfield;
        }
        .cart-qty-input::-webkit-outer-spin-button,
        .cart-qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </>
  );
}