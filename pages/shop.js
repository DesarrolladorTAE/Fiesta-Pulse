"use client";
import { useEffect, useMemo, useState } from "react";
import PageBanner from "@/components/PageBanner";
import Layout from "@/layout";
import Link from "next/link";
import { getPublicCategories, getPublicProducts } from "../src/services/public/index";

const STORE_ID = 16; // 👈 set the store ID you want

// Helpers
function shuffle(arr = []) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr = [], n = 1) {
  return shuffle(arr).slice(0, n);
}

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [catQuery, setCatQuery] = useState(""); // category search
  const [activeCatId, setActiveCatId] = useState(null);
  const [sort, setSort] = useState("default"); // default | new | old | high | low
  const [view, setView] = useState("grid"); // grid | list

  // Client-side pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

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

  // Filtered products (search + category + sorting)
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
      case "new":
        // Prefer created_at when available; fallback to id desc
        data.sort((a, b) => {
          const ad = a?.created_at ? new Date(a.created_at).getTime() : 0;
          const bd = b?.created_at ? new Date(b.created_at).getTime() : 0;
          if (ad !== 0 || bd !== 0) return bd - ad;
          return (Number(b?.id) || 0) - (Number(a?.id) || 0);
        });
        break;
      case "old":
        data.sort((a, b) => {
          const ad = a?.created_at ? new Date(a.created_at).getTime() : 0;
          const bd = b?.created_at ? new Date(b.created_at).getTime() : 0;
          if (ad !== 0 || bd !== 0) return ad - bd;
          return (Number(a?.id) || 0) - (Number(b?.id) || 0);
        });
        break;
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

  // Pagination slice
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageSafe = Math.min(page, lastPage);
  const sliceStart = (pageSafe - 1) * PER_PAGE;
  const sliceEnd = sliceStart + PER_PAGE;
  const pageItems = filtered.slice(sliceStart, sliceEnd);

  const handleSortChange = (val) => {
    const map = {
      default: "default",
      New: "new",
      old: "old",
      "hight-to-low": "high",
      "low-to-high": "low",
    };
    setSort(map[val] || "default");
    setPage(1);
  };

  // Category search + limit to 10 random
  const visibleCategories = useMemo(() => {
    const base = categories || [];
    const filteredCats = catQuery.trim()
      ? base.filter((c) =>
          String(c.name || "").toLowerCase().includes(catQuery.trim().toLowerCase())
        )
      : base;
    const limited = pickRandom(filteredCats, Math.min(10, filteredCats.length));
    return limited;
  }, [categories, catQuery]);

  // Popular tags: 5 random category names
  const popularTags = useMemo(() => {
    const names = (categories || []).map((c) => c.name).filter(Boolean);
    return pickRandom(names, Math.min(5, names.length));
  }, [categories]);

  // Best Seller: 3 most recent products
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
            <ul className="grid-list">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView("grid");
                  }}
                >
                  <i className="fal fa-border-all" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView("list");
                  }}
                >
                  <i className="far fa-list" />
                </a>
              </li>
            </ul>
          </div>

          <div className="row gap-60">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="shop-sidebar rmb-75">
                {/* Search */}
                <div className="widget widget-search wow fadeInUp delay-0-2s">
                  <form onSubmit={(e) => e.preventDefault()} action="#" className="default-search-form">
                    <input
                      type="text"
                      placeholder="Search products"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      required
                    />
                    <button type="submit" className="searchbutton far fa-search" />
                  </form>
                </div>

                {/* Categories with search + random 10 */}
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
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCatId(null);
                          setPage(1);
                        }}
                      >
                        All
                      </a>{" "}
                      <span>({products.length})</span>
                    </li>
                    {visibleCategories.map((c) => (
                      <li key={c.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveCatId(c.id);
                            setPage(1);
                          }}
                          className={activeCatId === c.id ? "active" : ""}
                        >
                          {c.name}
                        </a>{" "}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Seller = 3 most recent */}
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
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                              <i className="fas fa-star" />
                            </div>
                            <h5>
                              <Link legacyBehavior href="#">
                                {p.name}
                              </Link>
                            </h5>
                            <span className="price">${Number(p.price ?? 0).toFixed(2)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Popular Tags = 5 random category names */}
                <div className="widget widget-tag-cloud wow fadeInUp delay-0-2s">
                  <h5 className="widget-title">Popular Categories</h5>
                  <div className="tag-coulds">
                    {popularTags.length === 0 && <span>No tags</span>}
                    {popularTags.map((t, i) => (
                      <Link key={t + i} legacyBehavior href="#">
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="col-lg-9">
              <div className={`row ${view === "grid" ? "" : "d-none"}`}>
                {loading && <div className="col-12"><p>Loading products…</p></div>}
                {!loading && pageItems.length === 0 && <div className="col-12"><p>No results.</p></div>}

                {pageItems.map((p) => {
                  const img = Array.isArray(p.image) ? p.image[0] : null;
                  const price = Number(p.price ?? 0);
                  const hasDiscount = !!p.discount && Number(p.discount) > 0;
                  const finalPrice = hasDiscount ? Math.max(0, price - Number(p.discount)) : price;

                  return (
                    <div key={p.id} className="col-lg-4 col-sm-6">
                      <div className="product-item wow fadeInUp delay-0-2s">
                        <div className="image">
                          <img src={img || "/assets/images/logos/logo-one.png"} alt="Product" />
                          <div className="social-style-two">
                            <a href="#"><i className="far fa-shopping-cart" /></a>
                            <a href="#"><i className="far fa-heart" /></a>
                            <a href="#"><i className="far fa-eye" /></a>
                          </div>
                        </div>
                        <div className="content">
                          <div className="title-price">
                            <h5>
                              <Link legacyBehavior href="#">
                                {p.name}
                              </Link>
                            </h5>
                            <div className="price">
                              {hasDiscount ? (
                                <>
                                  <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: 8 }}>
                                    {price.toFixed(2)}
                                  </span>
                                  <span>${finalPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                <>{finalPrice.toFixed(2)}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {view === "list" && (
                <div className="row">
                  <div className="col-12">
                    {pageItems.map((p) => {
                      const img = Array.isArray(p.image) ? p.image[0] : null;
                      const price = Number(p.price ?? 0);
                      return (
                        <div key={p.id} className="product-item d-flex align-items-center mb-20 wow fadeInUp delay-0-2s">
                          <div className="image" style={{ maxWidth: 120, marginRight: 16 }}>
                            <img src={img || "/assets/images/shop/product1.jpg"} alt="Product" />
                          </div>
                          <div className="content" style={{ flex: 1 }}>
                            <div className="title-price d-flex justify-content-between">
                              <h5 style={{ marginRight: 16 }}>{p.name}</h5>
                              <div className="price">${price.toFixed(2)}</div>
                            </div>
                            <p className="mb-0" style={{ opacity: 0.8 }}>{p.shortDescription || ""}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              <ul className="pagination flex-wrap wow fadeInUp delay-0-2s">
                <li className={`page-item ${pageSafe <= 1 ? "disabled" : ""}`}>
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.max(1, pageSafe - 1));
                    }}
                  >
                    <i className="fas fa-chevron-left" />
                  </a>
                </li>
                {Array.from({ length: lastPage }).slice(0, 5).map((_, idx) => {
                  const n = idx + 1;
                  return (
                    <li key={n} className={`page-item ${pageSafe === n ? "active" : ""}`}>
                      <a
                        className="page-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                      >
                        {String(n).padStart(2, "0")}
                      </a>
                    </li>
                  );
                })}
                <li className={`page-item ${pageSafe >= lastPage ? "disabled" : ""}`}>
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.min(lastPage, pageSafe + 1));
                    }}
                  >
                    <i className="fas fa-chevron-right" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
