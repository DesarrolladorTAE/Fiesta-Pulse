"use client";
import { useEffect, useMemo, useState } from "react";
import PageBanner from "@/components/PageBanner";
import Layout from "@/layout";
import Link from "next/link";

import FloatingCartBubble from "@/components/shop/FloatingCartBubble";
import ProductQuickViewModal from "@/components/shop/ProductQuickViewModal";

import {
  getPublicCategories,
  getPublicProducts,
  getPublicProductDetails,
} from "../src/services/public/index";

const STORE_ID = 115;
const PER_PAGE = 12;
const CART_KEY = `public_cart_${STORE_ID}`;

/* ==== Helpers ==== */
function computeDiscount(price, discount) {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  if (d <= 0 || p <= 0) return { final: p, pct: 0, type: "none" };
  if (d > 0 && d <= 1) return { final: Math.max(0, p * (1 - d)), pct: Math.round(d * 100), type: "fraction" };
  if (d > 1 && d <= 100 && Number.isInteger(d)) return { final: Math.max(0, p * (1 - d / 100)), pct: Math.round(d), type: "percent" };
  const final = Math.max(0, p - d);
  const pct = Math.round((d / p) * 100);
  return { final, pct, type: "absolute" };
}
function shuffle(arr = []) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickRandom(arr = [], n = 1) { return shuffle(arr).slice(0, n); }
function money(n) { return `$${Number(n ?? 0).toFixed(2)}`; }

/* ==== Hook de carrito local ==== */
function useLocalCart(storageKey) {
  const [items, setItems] = useState([]);

  // Cargar al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw));
    } catch { }
  }, [storageKey]);

  // Guardar (ligero debounce)
  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(items || [])); } catch { }
    }, 80);
    return () => clearTimeout(id);
  }, [items, storageKey]);

  const add = (product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: (clone[i].qty || 1) + qty };
        return clone;
      }
      return [...prev, { ...product, qty }];
    });
  };
  const remove = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const setQty = (id, qty) =>
    setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);

  return { items, add, remove, setQty, clear };
}

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [catQuery, setCatQuery] = useState("");
  const [activeCatId, setActiveCatId] = useState(null);
  const [sort, setSort] = useState("default");
  const [view] = useState("grid");
  const [page, setPage] = useState(1);

  // ✅ Carrito LOCAL con persistencia
  const { items: cart, add, remove, setQty } = useLocalCart(CART_KEY);

  // Modal
  const [modalProduct, setModalProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          getPublicCategories(STORE_ID),
          getPublicProducts(STORE_ID),
        ]);
        if (cancel) return;
        setCategories(cats || []);
        setProducts(prods || []);
      } catch (e) {
        console.error("Public catalog load error:", e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Filtros + orden
  const filtered = useMemo(() => {
    let data = [...products];

    if (activeCatId) {
      data = data.filter((p) => {
        if (!Array.isArray(p.category)) return false;
        const cat = categories.find((c) => c.id === activeCatId);
        const catName = (cat?.name || "").toLowerCase();
        return catName ? p.category.some((n) => String(n).toLowerCase() === catName) : false;
      });
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter(
        (p) =>
          String(p.name || "").toLowerCase().includes(q) ||
          String(p.sku || "").toLowerCase().includes(q) ||
          String(p.shortDescription || "").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "new": {
        const byDate = (x) => x?.created_at ? new Date(x.created_at).getTime() : 0;
        data.sort((a, b) => (byDate(b) || Number(b?.id) || 0) - (byDate(a) || Number(a?.id) || 0));
        break;
      }
      case "old": {
        const byDate = (x) => x?.created_at ? new Date(x.created_at).getTime() : 0;
        data.sort((a, b) => (byDate(a) || Number(a?.id) || 0) - (byDate(b) || Number(b?.id) || 0));
        break;
      }
      case "high":
        data.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
        break;
      case "low":
        data.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
        break;
      default:
        break;
    }
    return data;
  }, [products, query, activeCatId, sort, categories]);

  // Paginación
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageSafe = Math.min(page, lastPage);
  const sliceStart = (pageSafe - 1) * PER_PAGE;
  const sliceEnd = sliceStart + PER_PAGE;
  const pageItems = filtered.slice(sliceStart, sliceEnd);

  const handleSortChange = (val) => {
    const map = { default: "default", New: "new", old: "old", "hight-to-low": "high", "low-to-high": "low" };
    setSort(map[val] || "default");
    setPage(1);
  };

  // Categorías visibles
  const visibleCategories = useMemo(() => {
    const base = categories || [];
    const filteredCats = catQuery.trim()
      ? base.filter((c) => String(c.name || "").toLowerCase().includes(catQuery.trim().toLowerCase()))
      : base;
    return pickRandom(filteredCats, Math.min(10, filteredCats.length));
  }, [categories, catQuery]);

  const popularTags = useMemo(() => {
    const names = (categories || []).map((c) => c.name).filter(Boolean);
    return pickRandom(names, Math.min(5, names.length));
  }, [categories]);

  const bestSellers = useMemo(() => {
    const copy = [...products];
    copy.sort((a, b) => {
      const ad = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const bd = b?.created_at ? new Date(b.created_at).getTime() : 0;
      if (ad !== 0 || bd !== 0) return bd - ad;
      return (Number(b?.id) || 0) - (Number(a?.id) || 0);
    });
    return copy.slice(0, 3);
  }, [products]);

  /* ------- Cart actions (LOCAL) ------- */
  const addToCart = (p, qty = 1) => {
    const img = Array.isArray(p.image) ? p.image[0] : (p.image || null);
    const price =
      Number(p.discount) > 0 ? Math.max(0, Number(p.price) - Number(p.discount)) : Number(p.price || 0);
    add({ id: p.id, name: p.name, price, image: img }, qty);
  };
  const removeFromCart = (id) => remove(id);
  const changeQty = (id, qty) => setQty(id, qty);
  const goCheckout = () => {
    window.location.href = `/checkout?store=${STORE_ID}`;
  };

  /* ------- Modal actions ------- */
  const openQuickView = async (p) => {
    try {
      const detail = await getPublicProductDetails(STORE_ID, p.id);
      setModalProduct(detail || p);
    } catch {
      setModalProduct(p);
    } finally {
      setModalOpen(true);
    }
  };


  return (
    <Layout>
      <PageBanner pageName={"Shop"} />

      <section className="shop-page-area py-130 rpy-100">
        <div className="container">
          {/* Top controls */}
          <div className="shop-shorter rel z-3 mb-45 wow fadeInUp delay-0-2s">
            <a className="filter-part" href="#" onClick={(e) => e.preventDefault()}>
              <i className="fal fa-bars" />
              <span>Show Filters</span>
            </a>
            <div className="sort-text">
              {loading ? "Loading…" : `Showing ${Math.min(total, sliceEnd)} of ${total} results`}
            </div>
            <div className="products-dropdown">
              <select defaultValue="default" onChange={(e) => handleSortChange(e.target.value)}>
                <option value="default">Default Sorting</option>
                <option value="New">Sort by Newness</option>
                <option value="old">Sort by Oldest</option>
                <option value="hight-to-low">High To Low</option>
                <option value="low-to-high">Low To High</option>
              </select>
            </div>
          </div>

          <div className="row gap-60">
            {/* ====== MOBILE FILTERS (primero) ====== */}
            <div className="col-12 d-lg-none">
              <div className="mobile-filters card p-3 mb-3">
                <div className="mb-2">
                  <label className="form-label" style={{ fontWeight: 600 }}>Search products</label>
                  <div className="d-flex gap-2">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Name, SKU or keywords"
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    />
                    {query && (
                      <button className="btn btn-outline-secondary" onClick={() => setQuery("")}>
                        <i className="far fa-times" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label" style={{ fontWeight: 600 }}>Search categories</label>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Type to filter…"
                    value={catQuery}
                    onChange={(e) => setCatQuery(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-wrap gap-8 mt-2">
                  <button
                    className={`btn btn-sm ${activeCatId === null ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => { setActiveCatId(null); setPage(1); }}
                  >
                    All ({products.length})
                  </button>
                  {visibleCategories.map((c) => (
                    <button
                      key={c.id}
                      className={`btn btn-sm ${activeCatId === c.id ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => { setActiveCatId(c.id); setPage(1); }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ====== SIDEBAR (solo desktop) ====== */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="shop-sidebar rmb-75">
                {/* Search */}
                <div className="widget widget-search wow fadeInUp delay-0-2s">
                  <form onSubmit={(e) => e.preventDefault()} action="#" className="default-search-form">
                    <input
                      type="text"
                      placeholder="Search products"
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                      required
                    />
                    <button type="submit" className="searchbutton far fa-search" />
                  </form>
                </div>

                {/* Categories */}
                <div className="widget widget-category wow fadeInUp delay-0-4s">
                  <h5 className="widget-title">Category</h5>

                  <div className="default-search-form" style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Search categories"
                      value={catQuery}
                      onChange={(e) => setCatQuery(e.target.value)}
                    />
                  </div>

                  <ul>
                    <li>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveCatId(null); setPage(1); }}>
                        All
                      </a>{" "}
                      <span>({products.length})</span>
                    </li>
                    {visibleCategories.map((c) => (
                      <li key={c.id}>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); setActiveCatId(c.id); setPage(1); }}
                          className={activeCatId === c.id ? "active" : ""}
                        >
                          {c.name}
                        </a>{" "}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Seller */}
                <div className="widget widget-products wow fadeInUp delay-0-2s">
                  <h5 className="widget-title">Best Products</h5>
                  <ul>
                    {bestSellers.map((p, i) => {
                      const img = Array.isArray(p.image) ? p.image[0] : null;
                      return (
                        <li key={String(p.id) + "-best-" + i}>
                          <div className="image">
                            <img src={img || "/assets/images/logos/logo-one.png"} alt="Product" />
                          </div>
                          <div className="content">
                            <div className="ratting">
                              <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                              <i className="fas fa-star" /><i className="fas fa-star" />
                            </div>
                            <h5>{p.name}</h5>
                            <span className="price">{money(p.price)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Popular Tags */}
                <div className="widget widget-tag-cloud wow fadeInUp delay-0-2s">
                  <h5 className="widget-title">Popular Categories</h5>
                  <div className="tag-coulds">
                    {popularTags.length === 0 && <span>No tags</span>}
                    {popularTags.map((t, i) => (
                      <Link key={t + i} legacyBehavior href="#">{t}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ====== PRODUCTS ====== */}
            <div className="col-lg-9">
              <div className={`row ${view === "grid" ? "" : "d-none"}`}>
                {loading && <div className="col-12"><p>Loading products…</p></div>}
                {!loading && pageItems.length === 0 && <div className="col-12"><p>No results.</p></div>}

                {pageItems.map((p) => {
                  const img = Array.isArray(p.image) ? p.image[0] : null;
                  const price = Number(p.price ?? 0);
                  const { final: finalPrice, pct: discountPct } = computeDiscount(price, p.discount);
                  const hasDiscount = discountPct > 0;

                  return (
                    <div key={p.id} className="col-lg-4 col-sm-6">
                      <div className="product-item wow fadeInUp delay-0-2s" style={{ position: "relative", overflow: "hidden" }}>
                        <div className="image" style={{ position: "relative", zIndex: 1 }}>
                          {p.new ? (
                            <span
                              style={{
                                position: "absolute", left: 10, top: 10, background: "#111", color: "#fff",
                                padding: "4px 8px", borderRadius: 8, fontSize: 12, letterSpacing: 0.4, zIndex: 5
                              }}
                            >
                              NEW
                            </span>
                          ) : null}

                          {hasDiscount ? (
                            <span
                              style={{
                                position: "absolute", right: 10, top: 10, background: "#e63946", color: "#fff",
                                padding: "4px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700, zIndex: 5
                              }}
                            >
                              -{discountPct}%
                            </span>
                          ) : null}

                          {/* Imagen unificada */}
                          <div className="product-thumb">
                            <img
                              src={img || "/assets/images/logos/logo-one.png"}
                              alt={p.name}
                              loading="lazy"
                            />
                          </div>

                          <div className="social-style-two">
                            <a href="#" title="Agregar al carrito" onClick={(e) => { e.preventDefault(); addToCart(p, 1); }}>
                              <i className="far fa-shopping-cart" />
                            </a>
                            <a href="#" title="Vista rápida" onClick={(e) => { e.preventDefault(); openQuickView(p); }}>
                              <i className="far fa-eye" />
                            </a>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="content" style={{ padding: "8px 4px" }}>
                          <div className="ratting" style={{ marginTop: 6 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i key={i} className={`fas fa-star${i < Math.round(Number(p.rating) || 0) ? "" : "-o"}`} />
                            ))}
                          </div>

                          <div className="title-price">
                            <h5><Link legacyBehavior href="#">{p.name}</Link></h5>
                            <div className="price no-dollar">
                              {hasDiscount ? (
                                <>
                                  <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: 8 }}>
                                    {money(price)}
                                  </span>
                                  <span>{money(finalPrice)}</span>
                                </>
                              ) : (
                                <>{money(finalPrice)}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <ul className="pagination flex-wrap wow fadeInUp delay-0-2s">
                <li className={`page-item ${pageSafe <= 1 ? "disabled" : ""}`}>
                  <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(Math.max(1, pageSafe - 1)); }}>
                    <i className="fas fa-chevron-left" />
                  </a>
                </li>
                {Array.from({ length: lastPage }).slice(0, 5).map((_, idx) => {
                  const n = idx + 1;
                  return (
                    <li key={n} className={`page-item ${pageSafe === n ? "active" : ""}`}>
                      <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(n); }}>
                        {String(n).padStart(2, "0")}
                      </a>
                    </li>
                  );
                })}
                <li className={`page-item ${pageSafe >= lastPage ? "disabled" : ""}`}>
                  <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(Math.min(lastPage, pageSafe + 1)); }}>
                    <i className="fas fa-chevron-right" />
                  </a>
                </li>
              </ul>

              {/* ====== EXTRA WIDGETS al final SOLO en móvil ====== */}
              <div className="d-lg-none mt-4">
                {/* Best Products (móvil) */}
                <div className="widget widget-products wow fadeInUp delay-0-2s mb-4">
                  <h5 className="widget-title">Best Products</h5>
                  <ul>
                    {bestSellers.map((p, i) => {
                      const img = Array.isArray(p.image) ? p.image[0] : null;
                      return (
                        <li key={String(p.id) + "-best-m-" + i}>
                          <div className="image">
                            <img src={img || "/assets/images/logos/logo-one.png"} alt="Product" />
                          </div>
                          <div className="content">
                            <div className="ratting">
                              <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                              <i className="fas fa-star" /><i className="fas fa-star" />
                            </div>
                            <h5>{p.name}</h5>
                            <span className="price">{money(p.price)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Popular Categories (móvil) */}
                <div className="widget widget-tag-cloud wow fadeInUp delay-0-2s">
                  <h5 className="widget-title">Popular Categories</h5>
                  <div className="tag-coulds">
                    {popularTags.length === 0 && <span>No tags</span>}
                    {popularTags.map((t, i) => (
                      <Link key={t + "-m-" + i} legacyBehavior href="#">{t}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Burbuja flotante del carrito (LOCAL) */}
        <FloatingCartBubble
          items={cart}
          onRemove={removeFromCart}
          onQty={changeQty}
          onCheckout={goCheckout}
        />

        {/* Modal de vista rápida */}
        <ProductQuickViewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={modalProduct}
          onAddToCart={(p, qty) => { addToCart(p, qty); setModalOpen(false); }}
          onPayNow={(p, qty) => { addToCart(p, qty); setModalOpen(false); goCheckout(); }}
        />
      </section>

      <style jsx global>{`
        .price.no-dollar::before { content: none !important; }
        .product-badge { font-family: sans-serif; font-weight: 600; text-transform: uppercase; }
        .product-thumb { width: 100%; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 6px; background: #fff; }
        .product-thumb > img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mobile-filters .btn { margin: 4px 6px 0 0; }
        .gap-8 { gap: 8px; }
      `}</style>
    </Layout>
  );
}
