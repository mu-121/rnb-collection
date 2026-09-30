import { getApiBase } from "@/lib/api";
import type { Product, ProductBadge } from "@/data/products";
import type { Collection } from "@/data/collections";
import type { ProductDetail } from "@/data/productDetails";

export const NEW_ARRIVALS_LIMIT = 9;
export const BEST_SELLERS_LIMIT = 6;

export type ApiProductImage = {
  url: string;
  alt?: string;
};

export type ApiProductVariation = {
  name: string;
  options: string[];
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  description?: string;
  category: string;
  collection?: string;
  images?: ApiProductImage[];
  badge?: string | null;
  material?: string;
  care?: string;
  warranty?: string;
  stock?: number;
  status?: string;
  variations?: ApiProductVariation[];
  sizes?: string[];
  createdAt?: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status?: string;
  parentId?: string | null;
  parentName?: string | null;
  childNames?: string[];
  productCount?: number;
};

export type CatalogCard = Product & {
  categoryName: string;
  categorySlug: string;
};

type CatalogListResponse = ApiProduct[] | { items?: ApiProduct[] };

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    query.set(key, String(value));
  }
  const encoded = query.toString();
  return encoded ? `?${encoded}` : "";
}

async function catalogGet<T>(path: string): Promise<T> {
  const url = `${getApiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    data?: T;
    message?: string;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Unable to load catalog");
  }

  return (payload.data ?? payload) as T;
}

function imageUrls(product: ApiProduct): string[] {
  return (product.images || [])
    .map((image) => image.url)
    .filter((url): url is string => Boolean(url));
}

export function mapBadge(raw: string | null | undefined): ProductBadge | "" {
  if (!raw) return "";
  const value = raw.trim();
  if (!value) return "";
  if (/best/i.test(value)) return "Best seller";
  if (/new/i.test(value)) return "New";
  return value as ProductBadge;
}

export function toCardProduct(
  product: ApiProduct,
  categorySlug = "",
): CatalogCard {
  const urls = imageUrls(product);
  const primary = urls[0] || "/Images/logo.svg";
  const hover = urls[1] || primary;
  const selling = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const compare = product.salePrice && product.salePrice > 0 ? product.price : product.price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: selling,
    compareAtPrice: compare,
    badge: mapBadge(product.badge),
    category: "new-arrivals",
    image: primary,
    hoverImage: hover,
    categoryName: product.category,
    categorySlug,
  };
}

export function toProductDetail(
  product: ApiProduct,
  categorySlug = "",
): ProductDetail {
  const urls = imageUrls(product);
  const card = toCardProduct(product, categorySlug);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    wearLabel: product.collection || product.category || "Shop",
    badge: card.badge,
    price: card.price,
    compareAtPrice: card.compareAtPrice,
    description: product.description || "",
    material: product.material || "See product description",
    care: product.care || "Follow the care label",
    warranty: product.warranty || "Quality guarantee included",
    orderHref: "/contact",
    gallery: urls.length ? urls : [card.image],
    variations: product.variations || [],
    sizes: product.sizes || [],
    stock: product.stock ?? 0,
  };
}

function asProductList(data: CatalogListResponse): ApiProduct[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export async function fetchActiveProducts(options: {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
} = {}): Promise<ApiProduct[]> {
  const data = await catalogGet<CatalogListResponse>(
    `/products${queryString({
      status: "active",
      category: options.category,
      search: options.search,
      limit: options.limit ?? 100,
      page: options.page ?? 1,
      sort: "-createdAt",
    })}`,
  );
  return asProductList(data).filter((product) => product.status === "active");
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const product = await catalogGet<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
    if (!product || product.status !== "active") return null;
    return product;
  } catch {
    return null;
  }
}

export async function fetchActiveCategories(): Promise<ApiCategory[]> {
  try {
    const data = await catalogGet<ApiCategory[] | { items?: ApiCategory[] }>("/categories");
    const items = Array.isArray(data) ? data : data.items || [];
    return items.filter((category) => category.status !== "inactive");
  } catch {
    return [];
  }
}

export async function fetchShopCatalog(categoryName?: string) {
  const [allCategories, products] = await Promise.all([
    fetchActiveCategories(),
    fetchActiveProducts({ category: categoryName, limit: 100 }),
  ]);
  const categories = allCategories.filter((category) => !category.parentId);
  const slugByName = new Map(allCategories.map((category) => [category.name, category.slug]));
  return {
    categories,
    products: products.map((product) =>
      toCardProduct(product, slugByName.get(product.category) || ""),
    ),
  };
}

export function pickNewArrivals(products: ApiProduct[]): CatalogCard[] {
  const tagged = products.filter((product) => /new/i.test(product.badge || ""));
  const source = tagged.length ? tagged : products;
  return source.slice(0, NEW_ARRIVALS_LIMIT).map((product) => toCardProduct(product));
}

export function pickBestSellers(products: ApiProduct[]): CatalogCard[] {
  const tagged = products.filter((product) => /best/i.test(product.badge || ""));
  const source = tagged.length ? tagged : [...products].reverse();
  return source.slice(0, BEST_SELLERS_LIMIT).map((product) => toCardProduct(product));
}

export function collectionsFromCatalog(
  categories: ApiCategory[],
  products: ApiProduct[],
): Collection[] {
  const topLevel = categories.filter((category) => !category.parentId);
  
  const collections = topLevel.map((category) => {
    const names = new Set([category.name, ...(category.childNames || [])]);
    const inCategory = products.filter((product) => names.has(product.category));
    
    if (inCategory.length === 0) return null;

    const prices = inCategory.map((product) =>
      product.salePrice && product.salePrice > 0 ? product.salePrice : product.price,
    );
    const images = inCategory.flatMap((product) => imageUrls(product));
    const uniqueImages = [...new Set(images)].slice(0, 5);
    const slides = uniqueImages.length ? uniqueImages : ["/Images/logo.svg"];

    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      title: category.description || category.name,
      description:
        category.description ||
        `Shop the ${category.name} collection from RNB Collections.`,
      priceFrom: prices.length ? Math.min(...prices) : 0,
      priceTo: prices.length ? Math.max(...prices) : 0,
      badge: "New",
      images: slides,
    };
  });

  return collections.filter((c): c is Collection => c !== null).slice(0, 3);
}
