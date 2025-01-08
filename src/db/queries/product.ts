import {
  CACHE_KEY_PRODUCT,
  CACHE_KEY_PRODUCTS,
  CACHE_KEY_PRODUCTS_ON_SALES,
} from '@/cacheKey'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getProductsOnSalesFromCache = unstable_cache(
  async (cookie: ReadonlyRequestCookies, searchKey?: string) => {
    const sb = createClient(cookie)
    const { data, error } = await sb
      .from('products')
      .select(
        `*,
        product_photos(
          url
        )    
      `,
      )
      .order('created_at', { ascending: false })
      .ilike('name', `%${searchKey ?? ''}%`)
    if (error) {
      console.log(error)
    }
    return data ?? []
  },
  [CACHE_KEY_PRODUCTS_ON_SALES],
  { tags: [CACHE_KEY_PRODUCTS_ON_SALES] },
)

export type ProductsOnSales = Awaited<
  ReturnType<typeof getProductsOnSalesFromCache>
>[number]

const fetchProducts = async (cookie: ReadonlyRequestCookies) => {
  const supabase = createClient(cookie)
  const { data } = await supabase.from('products').select('*')
  return data
}

export const getCachedProducts = unstable_cache(
  fetchProducts,
  [CACHE_KEY_PRODUCTS],
  {
    tags: [CACHE_KEY_PRODUCTS],
  },
)

const fetchProduct = async (
  productId: string,
  cookie: ReadonlyRequestCookies,
) => {
  const supabase = createClient(cookie)
  const { data } = await supabase
    .from('products')
    .select(
      `*, 
    product_photos (
        url
    ),
    product_categories (
        categories (
            name
        )
    )
    `,
    )
    .eq('id', productId)
    .single()

  return data
}

export const getProductCache = unstable_cache(
  fetchProduct,
  [CACHE_KEY_PRODUCT],
  {
    tags: [CACHE_KEY_PRODUCT],
  },
)
