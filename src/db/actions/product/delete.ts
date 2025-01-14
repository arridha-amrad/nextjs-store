'use server'

import {
  CACHE_KEY_PRODUCT_ON_ADMIN,
  CACHE_KEY_PRODUCTS_ON_ADMIN,
  CACHE_KEY_PRODUCTS_ON_CUSTOMER,
} from '@/cacheKey'
import { Supabase } from '@/lib/supabase/Supabase'
import { revalidateTag } from 'next/cache'

export const removeProduct = async (id: string) => {
  const supabase = await Supabase.initServerClient()
  // performing delete product followed by deleting the photos related to it
  // 1. get the photos url
  const { data: d1 } = await supabase
    .from('product_photos')
    .delete()
    .eq('product_id', id)
    .select()

  if (d1 !== null) {
    // 2. delete photos from storage
    await supabase.storage.from('products').remove(d1.map((v) => v.url))
    // 3. delete the product record
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return error.message

    revalidateTag(CACHE_KEY_PRODUCTS_ON_ADMIN)
    revalidateTag(CACHE_KEY_PRODUCT_ON_ADMIN)
    revalidateTag(CACHE_KEY_PRODUCTS_ON_CUSTOMER)
    return 'Product delete'
  }
}

export const removeProductPhoto = async (
  productId: string,
  filePath: string,
) => {
  const supabase = await Supabase.initServerClient()
  const { error: ppErr } = await supabase
    .from('product_photos')
    .delete()
    .eq('product_id', productId)
    .eq('url', filePath)
  if (ppErr) {
    console.log(ppErr)
    return false
  }
  const { error } = await supabase.storage.from('products').remove([filePath])
  if (error) {
    console.log(error)
    return false
  }
  revalidateTag(CACHE_KEY_PRODUCTS_ON_ADMIN)
  revalidateTag(CACHE_KEY_PRODUCT_ON_ADMIN)
  return true
}
