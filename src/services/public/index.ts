import axiosClientPublic from "../../config/axiosClientPublic";

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
  // - image: string[]
  // - images: string[]
  image?: string[];     // ← usaremos SIEMPRE esta en el UI tras normalizar
  images?: string[];

  // - category: string[]
  // - categories: { id: number|string, name: string }[]
  category?: string[];  // ← usaremos SIEMPRE esta en el UI tras normalizar
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
    ? raw.categories
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean) as string[]
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
    image: imageArr,             // ← UI siempre puede leer p.image[0]
    category: categoryArr,       // ← UI siempre puede filtrar por nombre
    shortDescription: shortDesc,
    description: fullDesc,       // ← fallback unificado
    price: toNumber(raw.price, 0),
    discount: toNumber(raw.discount, 0),
  };
}

/* ========= Endpoints ========= */

/** Categorías públicas por tienda (ID) */
export async function getPublicCategories(storeId: number | string): Promise<PublicCategory[]> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/categories`);
  return (data?.categories ?? []) as PublicCategory[];
}

/** Productos públicos por tienda (ID) (normalizados) */
export async function getPublicProducts(storeId: number | string): Promise<PublicProduct[]> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products`);
  const arr = Array.isArray(data) ? data : (data?.products ?? []);
  return (arr as PublicProduct[]).map(normalizeProduct);
}

/** Detalle público por tienda/producto (normalizado) */
export async function getPublicProductDetails(
  storeId: number | string,
  productId: number | string
): Promise<PublicProduct | null> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products/${productId}`);
  const prod = (data?.product ?? data ?? null) as PublicProduct | null;
  return prod ? normalizeProduct(prod) : null;
}

/* ========= PayPal público (BYO) ========= */
export type PayPalSdkCreds = {
  ok: boolean;
  mode: "sandbox" | "live";
  client_id: string;
  currency: string;   // ej. "MXN" o "USD"
  brand: string;
};

export async function getPayPalSdkCredentials(storeId: number | string): Promise<PayPalSdkCreds> {
  const { data } = await axiosClientPublic.get(`/public/paypal/${storeId}/sdk-credentials`);
  return data as PayPalSdkCreds;
}

export async function createPayPalOrder(
  storeId: number | string,
  payload: {
    amount: number;
    currency?: string; // p.ej. "USD" para cobrar en dólares
    reference_id?: string;
    items?: Array<{ name: string; quantity: string; unit_amount: { value: number; currency_code: string } }>;
    customer?: any;
    shipping_preference?: "NO_SHIPPING" | "GET_FROM_FILE" | "SET_PROVIDED_ADDRESS";
    return_url?: string;
    cancel_url?: string;
  }
): Promise<{ ok: boolean; order_id: string; status: string; approval_url?: string }> {
  const { data } = await axiosClientPublic.post(`/public/paypal/${storeId}/order`, payload);
  return data;
}

export async function capturePayPalOrder(
  storeId: number | string,
  orderId: string
): Promise<{ ok: boolean; capture: any }> {
  const { data } = await axiosClientPublic.post(`/public/paypal/${storeId}/capture`, { order_id: orderId });
  return data;
}

/** ======= Loader PayPal (recarga si cambia clientId/currency) ======= */
let paypalSdkPromise: Promise<void> | null = null;
let _loadedClientId: string | null = null;
let _loadedCurrency: string | null = null;

function unloadPayPalSdk() {
  const scripts = Array.from(document.querySelectorAll('script[src*="paypal.com/sdk/js"]'));
  scripts.forEach((s) => s.parentElement?.removeChild(s));
  // @ts-ignore
  if (window.paypal) {
    // @ts-ignore
    delete window.paypal;
  }
  paypalSdkPromise = null;
  _loadedClientId = null;
  _loadedCurrency = null;
}

export function loadPayPalSdk({ clientId, currency }: { clientId: string; currency: string }) {
  if (typeof window === "undefined") return Promise.resolve();

  const needReload =
    !_loadedClientId ||
    !_loadedCurrency ||
    _loadedClientId !== clientId ||
    _loadedCurrency !== currency ||
    // @ts-ignore
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

/* ========= Helpers para NÓMINAS (USD listo) ========= */
/**
 * Crea una orden de PayPal en USD para nómina, con concepto descriptivo.
 * - amount: número en USD (2 decimales)
 * - memo: texto para identificar el pago (aparece en el item.name)
 */
export async function createNominaOrderUSD(
  storeId: number | string,
  amount: number,
  memo: string
) {
  const currency = "USD";
  return createPayPalOrder(storeId, {
    amount,
    currency,
    reference_id: `NOM-${Date.now()}`,
    items: [
      {
        name: memo || "Pago de nómina",
        quantity: "1",
        unit_amount: { value: Number(amount.toFixed(2)), currency_code: currency },
      },
    ],
    shipping_preference: "NO_SHIPPING",
  });
}

/**
 * Inicializa el SDK de PayPal para nómina en USD (pásale el client_id LIVE que uses para nóminas).
 * Si prefieres obtenerlo del backend por store, usa getPayPalSdkCredentials y toma client_id.
 */
export async function initNominaPayPalUSD(clientId: string) {
  await loadPayPalSdk({ clientId, currency: "USD" });
}
