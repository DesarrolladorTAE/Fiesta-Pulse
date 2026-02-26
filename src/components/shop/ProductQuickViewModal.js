"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";

/* ===== helpers ===== */
function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
function renderStars(rating) {
  const v = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Box
          key={i}
          component="i"
          className={`fas fa-star${i < v ? "" : "-o"}`}
          sx={{ color: i < v ? "warning.main" : "text.disabled" }}
        />
      ))}
      <Typography variant="body2" color="text.secondary">
        {v}/5
      </Typography>
    </Stack>
  );
}
function computeDiscount(price, discount) {
  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  if (p <= 0 || d <= 0) return { final: p, pct: 0 };
  if (d > 0 && d <= 1) return { final: Math.max(0, p * (1 - d)), pct: Math.round(d * 100) };
  if (d > 1 && d <= 100 && Number.isInteger(d))
    return { final: Math.max(0, p * (1 - d / 100)), pct: Math.round(d) };
  const final = Math.max(0, p - d);
  return { final, pct: Math.round((d / p) * 100) };
}
function sanitizeImages(arr) {
  const urls = (Array.isArray(arr) ? arr : [])
    .map((u) => String(u || "").trim())
    .filter((u) => /^https?:\/\//i.test(u));
  const seen = new Set();
  const unique = [];
  for (const u of urls) {
    const key = u.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(u);
    }
  }
  return unique.length ? unique : ["/assets/images/logos/lol2.png"];
}

/* ===== component ===== */
export default function ProductQuickViewModal({
  open,
  onClose,
  product,
  onAddToCart,
  onPayNow,
}) {
  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const fullScreen = useMediaQuery("(max-width:900px)");

  // reset al abrir
  useEffect(() => {
    if (open) {
      setQty(1);
      setActiveIndex(0);
    }
  }, [open]);

  const images = useMemo(() => {
    const list = Array.isArray(product?.image) ? product?.image : product?.images;
    return sanitizeImages(list);
  }, [product]);

  const price = Number(product?.price ?? 0);
  const { final, pct: discountPct } = computeDiscount(price, product?.discount);
  const hasDiscount = discountPct > 0;

  const categories =
    Array.isArray(product?.category) && product?.category.length
      ? product?.category
      : Array.isArray(product?.categories)
        ? product?.categories.map((c) => c?.name).filter(Boolean)
        : [];

  const descShort = product?.shortDescription ?? product?.description ?? "";
  const descLong = product?.fullDescription ?? product?.longDescription ?? "";
  const rating = Number(product?.rating) || 0;

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, md: 3 },
          overflow: "hidden",
          height: { xs: "96vh", md: "95vh" },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {!product ? (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">Cargando…</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
              gap: 0,
              height: "100%",
              minHeight: 0, // permite que la columna derecha haga overflow
            }}
          >
            {/* LEFT: media */}
            {/* LEFT: media (desktop: la imagen ocupa todo el alto disponible) */}
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.50",
                display: "grid",
                gridTemplateRows: { xs: "auto auto", md: "1fr auto" }, // ← imagen llena, thumbs abajo
                gap: 1.5,
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative" }}>
                {product?.new && (
                  <Chip
                    label="NUEVO"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "grey.900",
                      color: "#fff",
                      fontWeight: 700,
                      zIndex: 2,
                    }}
                  />
                )}
                {hasDiscount && (
                  <Chip
                    label={`-${discountPct}%`}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                  />
                )}

                {/* Contenedor principal de la imagen: ahora llena el 1fr */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    height: { xs: 300, md: "100%" },        // ← llena la fila 1fr
                    minHeight: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={images[activeIndex]}
                    alt={product?.name || "Product"}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",                     // ← usa "cover" para ocupar todo el espacio
                      // si NO quieres recorte, cambia a: objectFit: "contain"
                    }}
                  />

                  {images.length > 1 && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setActiveIndex((i) => (i - 1 + images.length) % images.length)
                        }
                        sx={{
                          position: "absolute",
                          left: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          bgcolor: "rgba(255,255,255,.9)",
                        }}
                      >
                        <ArrowBackIosNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          bgcolor: "rgba(255,255,255,.9)",
                        }}
                      >
                        <ArrowForwardIosIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>

              {/* Thumbs en la fila auto (no afectan el alto de la imagen) */}
              {images.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    pb: 0.5,
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 999 },
                  }}
                >
                  {images.map((src, i) => (
                    <IconButton
                      key={`${src}-${i}`}
                      onClick={() => setActiveIndex(i)}
                      sx={{
                        p: 0,
                        borderRadius: 1.5,
                        width: 64,
                        height: 64,
                        border: "2px solid",
                        borderColor: i === activeIndex ? "error.main" : "transparent",
                        overflow: "hidden",
                        flex: "0 0 auto",
                      }}
                    >
                      <Box component="img" src={src} alt="" sx={{ width: 1, height: 1, objectFit: "cover" }} />
                    </IconButton>
                  ))}
                </Box>
              )}
            </Box>


            {/* RIGHT: info (body con scroll + footer sticky) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                p: { xs: 2, md: 2.25 },
              }}
            >
              {/* Header sticky */}
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  bgcolor: "background.paper",
                  zIndex: 2,
                  pb: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" fontWeight={800} sx={{ mr: 2 }}>
                  {product?.name}
                </Typography>
                <IconButton onClick={onClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Body: el único que scrollea */}
              <Stack
                spacing={1.25}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  pr: 1,
                  pt: 1.25,
                  pb: 2,
                }}
              >
                {renderStars(rating)}

                <Stack direction="row" spacing={1} alignItems="baseline">
                  {hasDiscount && (
                    <Typography color="text.disabled" sx={{ textDecoration: "line-through" }}>
                      {money(price)}
                    </Typography>
                  )}
                  <Typography variant="h6" fontWeight={800}>
                    {money(final)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {product?.sku && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`SKU: ${product.sku}`}
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {categories.map((c, i) => (
                    <Chip
                      key={`${c?.id || c}-${i}`}
                      size="small"
                      label={c?.name || c}
                      sx={{ borderRadius: 999 }}
                    />
                  ))}
                </Stack>

                {(product?.shortDescription || product?.description) && (
                  <Box>
                    <Typography fontWeight={700} mb={0.5}>
                      Descripción
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {descShort}
                    </Typography>
                  </Box>
                )}

                {(product?.fullDescription || product?.longDescription) && (
                  <Box>
                    <Typography fontWeight={700} mb={0.5}>
                      Mas Detalles
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {descLong}
                    </Typography>
                  </Box>
                )}


              </Stack>

              {/* Footer sticky */}
              <Box
                sx={{
                  pt: 1,
                  pb: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  position: "sticky",
                  bottom: 0,
                  zIndex: 3,
                }}
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 70 }}>
                      Unidades
                    </Typography>

                    <IconButton
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                      type="number"
                      inputProps={{ min: 1, inputMode: "numeric", style: { textAlign: "center" } }}
                      sx={{ width: 110 }}
                      size="small"
                    />

                    <IconButton
                      onClick={() => setQty((q) => q + 1)}
                      size="small"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 0.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => onAddToCart(product, qty)}
                      sx={{ height: 44, borderRadius: 2, fontWeight: 700, bgcolor: "grey.100" }}
                    >
                      + Agregar al Carrito
                    </Button>


                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
