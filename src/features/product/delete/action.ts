"use server";

import { CACHE_KEY_PRODUCTS } from "@/cacheKey";
import { Supabase } from "@/lib/supabase/Supabase";
import { revalidateTag } from "next/cache";

export const removeProduct = async (id: string) => {
  const supabase = await Supabase.initServerClient();
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
