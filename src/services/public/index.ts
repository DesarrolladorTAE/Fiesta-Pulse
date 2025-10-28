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

/** Detalle público por tienda/producto (normalizado)
 *  Laravel: Route::get('{storeId}/products/{productId}', publicProductDetailsById)
 */
export async function getPublicProductDetails(
  storeId: number | string,
  productId: number | string
): Promise<PublicProduct | null> {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products/${productId}`);
  const prod = (data?.product ?? data ?? null) as PublicProduct | null;
  return prod ? normalizeProduct(prod) : null;
}
