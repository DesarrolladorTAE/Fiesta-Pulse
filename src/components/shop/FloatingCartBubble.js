"use client";
import { useMemo, useState } from "react";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function FloatingCartBubble({
  items,
  onRemove,
  onQty,
  onCheckout,
}) {
  const [open, setOpen] = useState(false);

  const { count, total } = useMemo(() => {
    const c = (items || []).reduce((a, b) => a + (b.qty || 1), 0);
    const t = (items || []).reduce((a, b) => a + Number(b.price || 0) * (b.qty || 1), 0);
    return { count: c, total: t };
  }, [items]);

  return (
    <>
      {/* Floating button */}

<button
  className="fab-cart"
  aria-label="Cart"
  onClick={() => setOpen(v => !v)}
  style={{
    position: "fixed",
    /* right: 16,        <- quítalo (lo mueve el CSS)  */
    /* bottom: 16,       <- quítalo (lo mueve el CSS)  */
    zIndex: 1000,
    border: "none",
    borderRadius: "999px",
    padding: "12px 16px",
    background: "#111",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
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
          <strong>Your cart</strong>
          <span style={{ opacity: 0.75 }}>
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>

        <div style={{ padding: 12, overflow: "auto", maxHeight: "44vh" }}>
          {(items || []).length === 0 && (
            <p style={{ margin: 8, opacity: 0.7 }}>Your cart is empty.</p>
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
                src={it.image || "/assets/images/logos/logo-one.png"}
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
                  title={it.name}
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
                    onClick={() => onQty(it.id, Math.max(1, (it.qty || 1) - 1))}
                    aria-label="Decrease quantity"
                    style={{
                      border: "1px solid #ddd",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#fafafa",
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
                      onQty(it.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    style={{
                      width: 48,
                      height: 28,
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#fff",
                      fontWeight: 700,
                    }}
                  />
                  <button
                    onClick={() => onQty(it.id, (it.qty || 1) + 1)}
                    aria-label="Increase quantity"
                    style={{
                      border: "1px solid #ddd",
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#fafafa",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => onRemove(it.id)}
                aria-label="Remove from cart"
                style={{ border: "none", background: "transparent", color: "#d00", padding: 6 }}
              >
                <i className="far fa-trash-alt" />
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #eee" }}>
          <div
            style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
          >
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button
            disabled={(items || []).length === 0}
            onClick={onCheckout}
            style={{
              width: "100%",
              height: 44,
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              opacity: (items || []).length === 0 ? 0.6 : 1,
              cursor: (items || []).length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Pay now
          </button>
        </div>
      </div>

      {/* Hard override so the qty number never disappears (beats your global CSS) */}
      <style jsx global>{`
        .cart-qty-input {
          color: #111 !important;
          -webkit-text-fill-color: #111 !important; /* Safari/Chrome */
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
