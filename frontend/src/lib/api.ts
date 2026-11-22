import type { Product, ProductListParams, ProductListResponse } from "./types";

export function getBaseUrl(): string {
  // SSR uses the private network URL when available; browser code must use
  // the public URL baked into the Next.js build.
  const url = typeof window === "undefined"
    ? process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("An API URL is not configured");
  return url.endsWith("/") ? url : `${url}/`;
}

function resolveUrl(path: string): string {
  const relativePath = path.replace(/^\/+/, "");
  return new URL(relativePath, getBaseUrl()).toString();
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    ...init,
    credentials: "include",
    cache: init.cache ?? "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | string[] | null | undefined>,
): Promise<T> {
  // Strip leading slash from path so it is treated as relative to the full
  // base URL (including its /api/v1 prefix) rather than replacing it.
  const relativePath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(relativePath, getBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }
  return response.json() as Promise<T>;
}

export function getProducts(params?: ProductListParams): Promise<ProductListResponse> {
  return apiGet<ProductListResponse>("/products", params as Record<string, string | number | boolean | string[] | null | undefined>);
}

export function getProduct(category: string, id: number): Promise<Product> {
  return apiGet<Product>(`/products/${category}/${id}`);
}

export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
