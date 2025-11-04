import axiosClientPublic from "../../config/axiosClientPublic";

/* ========= Globals ========= */
declare global {
  interface Window {
    paypal?: any;
  }
}

/* ========= Tipos ========= */
export type PublicCategory = {
  id: number | string;
  name: string;
};

export type PublicProduct = {
  id: number | string;
  sku?: string | null;
  name: string;
  price?: number | string | null;
  discount?: number | string | null;
  offerEnd?: string | null;
  new?: boolean;
  rating?: number | null;
  saleCount?: number | null;

  // BACKEND puede mandar cualquiera de estas combinaciones:
  image?: string[]; // ← usaremos SIEMPRE esta en el UI tras normalizar
  images?: string[];

  category?: string[]; // ← usaremos SIEMPRE esta en el UI tras normalizar
  categories?: { id: number | string; name: string }[];

  shortDescription?: string | null;
  fullDescription?: string | null;
  description?: string | null;

  stock?: number | null;
  created_at?: string;
  updated_at?: string;

  // Para no romper si llegan más props
  [k: string]: any;
};

export type PayPalMode = "sandbox" | "live";

export type PayPalSdkCreds = {
  ok: boolean;
  mode: PayPalMode;
  client_id: string;
  currency: string; // ej. "MXN" o "USD"
  brand: string;
};

/** Ítems que enviamos a PayPal y aprovechamos para pasar IDs del producto al backend */
export type PayPalLineItem = {
  name: string;
  quantity: string; // "1", "2", ...
  unit_amount: { value: number; currency_code: string };
  // Extras para que el backend reconstruya la venta:
  product_id?: number;
  variation_size_id?: number | null;
  unit_price?: number; // redundante a unit_amount.value, pero útil para tu POS
};

/** Datos de cliente que se guardarán en la pivote paypal_sales */
export type PayPalCustomer = {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: any; // { street, ext, int, neighborhood, city, state, zip, country }
  order_note?: string;
  terms_accepted?: boolean;
  [k: string]: any;
};

export type CreatePayPalOrderPayload = {
  amount: number;
  currency?: string;
  reference_id?: string;
  items?: PayPalLineItem[];
  customer?: PayPalCustomer;
  shipping_preference?: "NO_SHIPPING" | "GET_FROM_FILE" | "SET_PROVIDED_ADDRESS";
  return_url?: string;
  cancel_url?: string;
};

export type CreatePayPalOrderResp = {
  ok: boolean;
  order_id: string;
  status: string;
  approval_url?: string;
};

export type CapturePayPalResp = {
  ok: boolean;
  capture?: any;
  sale?: any;
  paypal_sale?: any;
  status?: string;
  message?: string;
};

/* ========= Helpers ========= */
function toNumber(n: unknown, def = 0): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : def;
}

/** Normaliza el shape del producto venga de listado o detalle */
export function normalizeProduct(raw: PublicProduct = {} as PublicProduct): PublicProduct {
  const imageArr: string[] = Array.isArray(raw.image)
    ? raw.image
    : Array.isArray(raw.images)
    ? raw.images
    : [];

  // categorías → nombres
  const categoryArr: string[] = Array.isArray(raw.category)
    ? raw.category
    : Array.isArray(raw.categories)
    ? (raw.categories
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean) as string[])
    : [];

  const shortDesc =
    (raw as any).shortDescription ??
    (raw as any).short_description ??
    null;

  const fullDesc =
    (raw as any).fullDescription ??
    (raw as any).full_description ??
    (raw as any).description ??
    null;

  return {
    ...raw,
    image: imageArr,       // ← UI siempre puede leer p.image[0]
    category: categoryArr, // ← UI siempre puede filtrar por nombre
    shortDescription: shortDesc,
    description: fullDesc, // ← fallback unificado
    price: toNumber(raw.price, 0),
    discount: toNumber(raw.discount, 0),
  };
}

/* ========= Endpoints públicos ========= */

export async function getPublicCategories(storeId: number | string): Promise<PublicCategory[]> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/categories`);
  return (data?.categories ?? []) as PublicCategory[];
}

export async function getPublicProducts(storeId: number | string): Promise<PublicProduct[]> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products`);
  const arr = Array.isArray(data) ? data : (data?.products ?? []);
  return (arr as PublicProduct[]).map(normalizeProduct);
}

export async function getPublicProductDetails(
  storeId: number | string,
  productId: number | string
): Promise<PublicProduct | null> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products/${productId}`);
  const prod = (data?.product ?? data ?? null) as PublicProduct | null;
  return prod ? normalizeProduct(prod) : null;
}

/* ========= PayPal público (BYO) ========= */

export async function getPayPalSdkCredentials(storeId: number | string): Promise<PayPalSdkCreds> {
  const { data } = await axiosClientPublic.get(`/public/paypal/${storeId}/sdk-credentials`);
  return data as PayPalSdkCreds;
}

/**
 * Crea una orden en tu backend (que a su vez llama PayPal)
 * payload.items permite llevar product_id/variation_size_id para que tu backend cree la venta.
 */
export async function createPayPalOrder(
  storeId: number | string,
  payload: CreatePayPalOrderPayload
): Promise<CreatePayPalOrderResp> {
  const { data } = await axiosClientPublic.post(`/public/paypal/${storeId}/order`, payload);
  return data as CreatePayPalOrderResp;
}

/** Captura la orden (tu backend hace la captura PayPal y registra la venta en tu POS) */
export async function capturePayPalOrder(
  storeId: number | string,
  orderId: string
): Promise<CapturePayPalResp> {
  const { data } = await axiosClientPublic.post(`/public/paypal/${storeId}/capture`, { order_id: orderId });
  return data as CapturePayPalResp;
}

/** ======= Loader PayPal (recarga si cambia clientId/currency) ======= */
let paypalSdkPromise: Promise<void> | null = null;
let _loadedClientId: string | null = null;
let _loadedCurrency: string | null = null;

function unloadPayPalSdk(): void {
  const scripts = Array.from(document.querySelectorAll('script[src*="paypal.com/sdk/js"]'));
  scripts.forEach((s) => s.parentElement?.removeChild(s));
  if (typeof window !== "undefined" && window.paypal) {
    delete window.paypal;
  }
  paypalSdkPromise = null;
  _loadedClientId = null;
  _loadedCurrency = null;
}

/**
 * Carga el SDK con el clientId y la currency dados.
 * Nota: el entorno (sandbox/live) lo determina el clientId, no un parámetro extra.
 */
export function loadPayPalSdk({ clientId, currency }: { clientId: string; currency: string }): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const needReload =
    !_loadedClientId ||
    !_loadedCurrency ||
    _loadedClientId !== clientId ||
    _loadedCurrency !== currency ||
    !window.paypal;

  if (!needReload && paypalSdkPromise) return paypalSdkPromise;

  if (needReload) unloadPayPalSdk();

  paypalSdkPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src =
      `https://www.paypal.com/sdk/js` +
      `?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}` +
      `&intent=capture&components=buttons`;
    s.async = true;
    s.onload = () => {
      _loadedClientId = clientId;
      _loadedCurrency = currency;
      resolve();
    };
    s.onerror = () => reject(new Error("PayPal SDK failed to load"));
    document.head.appendChild(s);
  });

  return paypalSdkPromise;
}

/**
 * Helper de conveniencia:
 * - Pide las credenciales al backend (que ya sabe si es sandbox o live)
 * - Carga el SDK con esas credenciales
 * - Permite forzar moneda distinta (p.ej. USD), si lo deseas
 */
export async function ensurePayPalSdkForStore(
  storeId: number | string,
  opts: { forceCurrency?: string } = {}
): Promise<{ clientId: string; currency: string; mode: PayPalMode; brand?: string }> {
  const creds = await getPayPalSdkCredentials(storeId);
  // Si quieres forzar otra moneda en el front (ej. USD), úsala aquí:
  const currency = (opts.forceCurrency || creds.currency || "MXN").toUpperCase();
  await loadPayPalSdk({ clientId: creds.client_id, currency });
  return { clientId: creds.client_id, currency, mode: creds.mode, brand: creds.brand };
}

/* ========= Helper de ejemplo (opcional) ========= */
export async function createSingleItemOrderUSD(
  storeId: number | string,
  amount: number,
  memo: string
): Promise<CreatePayPalOrderResp> {
  const currency = "USD";
  return createPayPalOrder(storeId, {
    amount,
    currency,
    reference_id: `ORD-${Date.now()}`,
    items: [
      {
        name: memo || "Orden",
        quantity: "1",
        unit_amount: { value: Number(amount.toFixed(2)), currency_code: currency },
      },
    ],
    shipping_preference: "NO_SHIPPING",
  });
}
