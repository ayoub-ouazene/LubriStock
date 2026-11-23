import { apiAdminFetch } from "./adminAuth";
export type CacheCategory = "engine" | "transmission";
export type CacheRecord = { category: CacheCategory; id:number; brand:string; model:string; start_year:number; end_year:number; engine?:string|null; fuel_type?:string|null; gearbox?:string|null; transmission_type?:string|null; viscosity?:string|null; capacity_liters?:string|null; oem:string };
export type CachePayload = Omit<CacheRecord,"id">;
export async function listCache(p:{category?:CacheCategory;q?:string;page?:number;page_size?:number}) { const s=new URLSearchParams(); Object.entries(p).forEach(([k,v])=>v!==undefined&&v!==""&&s.set(k,String(v))); return apiAdminFetch<{items:CacheRecord[];total:number;page:number;page_size:number;has_next:boolean}>(`/admin/cache?${s}`); }
export async function getCache(c:CacheCategory,id:number){return apiAdminFetch<CacheRecord>(`/admin/cache/${c}/${id}`)}
export async function createCache(p:CachePayload){return apiAdminFetch<CacheRecord>("/admin/cache",{method:"POST",body:JSON.stringify(p)})}
export async function updateCache(c:CacheCategory,id:number,p:Partial<CachePayload>){return apiAdminFetch<CacheRecord>(`/admin/cache/${c}/${id}`,{method:"PATCH",body:JSON.stringify(p)})}
export async function deleteCache(c:CacheCategory,id:number){return apiAdminFetch<void>(`/admin/cache/${c}/${id}`,{method:"DELETE"})}
