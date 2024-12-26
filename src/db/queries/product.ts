import { CACHE_KEY_PRODUCTS } from "@/cacheKey";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const fetchProducts = async (cookie: ReadonlyRequestCookies) => {
  const supabase = createClient(cookie);
  const { data } = await supabase.from("products").select("*");
  return data;
};

export const getCachedProducts = unstable_cache(
  fetchProducts,
  [CACHE_KEY_PRODUCTS],
  {
    tags: [CACHE_KEY_PRODUCTS],
  }
);
