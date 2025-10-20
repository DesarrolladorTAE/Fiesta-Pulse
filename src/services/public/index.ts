import axiosClientPublic from "../../config/axiosClientPublic";



/** Categorías públicas por tienda (ID) */
export async function getPublicCategories(storeId) {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/categories`);
  // Esperado: { ok: true, store_id, categories: [{id,name}] }
  return data?.categories ?? [];
}

/** Productos públicos por tienda (ID) */
export async function getPublicProducts(storeId) {
  const { data } = await axiosClientPublic.get(`/public/stores/${storeId}/products`);
  // Puede llegar como { ok:true, products:[...] } o como arreglo directo
  return Array.isArray(data) ? data : (data?.products ?? []);
}
