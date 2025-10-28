"use client";
import { useEffect, useState } from "react";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
function renderStars(rating) {
  const v = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return Array.from({ length: 5 }).map((_, i) => (
    <i key={i} className={`fas fa-star${i < v ? "" : "-o"}`} style={{ marginRight: 2 }} />
  ));
}

/** Detecta tipo de descuento y devuelve final + porcentaje */
function computeDiscount(price, discount) {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  if (p <= 0 || d <= 0) return { final: p, pct: 0, type: "none" };

  if (d > 0 && d <= 1) {
    const final = Math.max(0, p * (1 - d));
    return { final, pct: Math.round(d * 100), type: "fraction" };
  }
  if (d > 1 && d <= 100 && Number.isInteger(d)) {
    const final = Math.max(0, p * (1 - d / 100));
    return { final, pct: Math.round(d), type: "percent" };
  }
  const final = Math.max(0, p - d);
  const pct = Math.round((d / p) * 100);
  return { final, pct, type: "absolute" };
}

export default function ProductQuickViewModal({
  open, onClose, product, onAddToCart, onPayNow,
}) {
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQty(1);
      setActiveIndex(0);
    }
  }, [open]);

  if (!open || !product) return null;

  /** Quita nulos/duplicados y asegura https */
  function sanitizeImages(arr) {
    const urls = (Array.isArray(arr) ? arr : [])
      .map((u) => String(u || "").trim())
      .filter((u) => /^https?:\/\//i.test(u));
    const seen = new Set();
    const unique = [];
    for (const u of urls) {
      const key = u.toLowerCase();
      if (!seen.has(key)) { seen.add(key); unique.push(u); }
    }
    return unique.length ? unique : ["/assets/images/logos/logo-one.png"];
  }

  const images = sanitizeImages(
    Array.isArray(product.image) ? product.image : product.images
  );

  const price = Number(product?.price ?? 0);
  const { final, pct: discountPct } = computeDiscount(price, product?.discount);
  const hasDiscount = discountPct > 0;

  const categories =
    Array.isArray(product.category) && product.category.length
      ? product.category
      : Array.isArray(product.categories)
      ? product.categories.map((c) => c?.name).filter(Boolean)
      : [];

  // EN: Descriptions
  const descShort =
    product?.shortDescription ??
    product?.description ??
    "No description available.";
  const descLong =
    product?.fullDescription ??
    product?.longDescription ??
    "No additional details provided.";

  const variations = Array.isArray(product.variations) ? product.variations : [];
  const hasVariations = variations.length > 0;
  const rating = Number(product?.rating) || 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,.35)",
        display: "grid",
        placeItems: "center",
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1024px, 96vw)",
          maxHeight: "95vh",             // ⬅️ alto máximo en móviles
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.28)",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          position: "relative",
        }}
      >
        {/* Badges */}
        {product.new ? (
          <span style={{position:"absolute",left:16,top:16,background:"#111",color:"#fff",padding:"4px 10px",borderRadius:10,fontSize:12,letterSpacing:.4,zIndex:3}}>
            NEW
          </span>
        ) : null}
        {hasDiscount ? (
          <span style={{position:"absolute",right:16,top:16,background:"#e63946",color:"#fff",padding:"4px 10px",borderRadius:10,fontSize:12,fontWeight:700,zIndex:3}}>
            -{discountPct}%
          </span>
        ) : null}

        {/* GALLERY */}
        <div className="pqv-media">
          <div className="pqv-thumb">
            <img
              src={images[activeIndex]}
              alt={product?.name || "Product"}
              loading="lazy"
              decoding="async"
            />
            {images.length > 1 && (
              <>
                <button
                  className="pqv-nav pqv-prev"
                  onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  className="pqv-nav pqv-next"
                  onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="pqv-thumbs">
              <div className="pqv-thumbs-track">
                {images.map((src, i) => {
                  const isGif = /\.gif(\?|$)/i.test(src);
                  return (
                    <button
                      key={src + i}
                      className={`pqv-thumb-btn ${i === activeIndex ? "active" : ""}`}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Image ${i + 1}`}
                      title={isGif ? "Animated GIF" : "Image"}
                    >
                      <img src={src} alt="" loading="lazy" decoding="async" />
                      {isGif && <span className="pqv-gif-badge">GIF</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* INFO (scrollable en móviles) */}
        <div className="pqv-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
            <h3 style={{ margin: 0 }}>{product?.name}</h3>
            <button onClick={onClose} aria-label="Close" className="pqv-close">
              <i className="far fa-times" />
            </button>
          </div>

          <div className="ratting" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {renderStars(rating)} <small style={{ opacity: .7 }}>{rating}/5</small>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
            {hasDiscount && <span style={{ textDecoration: "line-through", opacity: .6 }}>{money(price)}</span>}
            <strong style={{ fontSize: 24 }}>{money(final)}</strong>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
            {product.sku ? <span style={{ fontSize: 13, opacity: .8 }}>SKU: <strong>{product.sku}</strong></span> : null}
            {categories.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {categories.map((c, i) => (
                  <span key={(c?.id || c) + "-" + i} style={{ fontSize: 12, background: "#f3f4f6", padding: "4px 8px", borderRadius: 999 }}>
                    {c?.name || c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description (short) */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Description</div>
            <div style={{ fontSize: 14, opacity: .9, lineHeight: 1.55 }}>{descShort}</div>
          </div>

          {/* More details (long) */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>More details</div>
            <div style={{ fontSize: 13.5, opacity: .9, lineHeight: 1.55 }}>
              {descLong}
            </div>
          </div>

          {/* Stock / Variations */}
          {!hasVariations && Number.isFinite(Number(product?.stock)) && (
            <div style={{ fontSize: 13, opacity: .8 }}>Stock: <strong>{product.stock}</strong></div>
          )}
          {hasVariations && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Available options</div>
              <div style={{ display: "grid", gap: 8 }}>
                {variations.map((v) => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span style={{ background: "#eef2ff", color: "#1e3a8a", padding: "4px 8px", borderRadius: 999 }}>
                      {v.name || "Variant"}
                    </span>
                    {Array.isArray(v.sizes) && v.sizes.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {v.sizes.map((s) => (
                          <span key={s.id} style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: 999 }}>
                            {s.name}{typeof s.stock === "number" ? ` · stock ${s.stock}` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qty + CTAs */}
          <div className="pqv-qty-row">
            <span>Quantity</span>

            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
              className="pqv-btn-minor"
            >-</button>

            <input
              className="qty-box"
              type="number"
              min={1}
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />

            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase"
              className="pqv-btn-minor"
            >+</button>
          </div>

          <div className="pqv-cta">
            <button onClick={() => onAddToCart(product, qty)} className="theme-btn style-two">Add to cart</button>
            <button onClick={() => onPayNow(product, qty)} className="theme-btn">Pay now</button>
          </div>
        </div>
      </div>

      {/* Estilos globales del modal */}

    </div>
  );
}
