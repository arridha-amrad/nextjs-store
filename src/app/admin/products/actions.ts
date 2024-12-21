"use server";

import { CACHE_KEY_PRODUCTS } from "@/cacheKey";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const removeProduct = async (id: string) => {
  const cookie = await cookies();
  const supabase = createClient(cookie);
  // performing delete product followed by deleting the photos related to it
  // 1. get the photos url
  const { data: d1 } = await supabase
    .from("product_photo")
    .delete()
    .eq("product_id", id)
    .select();

  if (d1 !== null) {
    // 2. delete photos from storage
    await supabase.storage.from("products").remove(d1.map((v) => v.url));
    // 3. delete the product record
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return error.message;

    revalidateTag(CACHE_KEY_PRODUCTS);
    return "Product delete";
  }
};
