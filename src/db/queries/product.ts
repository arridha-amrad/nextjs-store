import {
  CACHE_KEY_PRODUCT,
  CACHE_KEY_PRODUCTS,
  CACHE_KEY_PRODUCTS_ON_SALES,
} from '@/cacheKey'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getProductsForCustomer = unstable_cache(
  async (cookie: ReadonlyRequestCookies, searchKey?: string) => {
    const sb = createClient(cookie)
    const query = sb.from('products').select(
      `*,
        product_photos(
          url
        )    
      `,
    )
    if (searchKey) {
      query.ilike('name', `%${searchKey}%`)
    }
    query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) {
      console.log(error)
    }
    return data ?? []
  },
  [CACHE_KEY_PRODUCTS_ON_SALES],
  { tags: [CACHE_KEY_PRODUCTS_ON_SALES] },
)

// for admin
export const getProductsForAdmin = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const supabase = createClient(cookie)
    const { data } = await supabase.from('products').select('*')
    return data
  },
  [CACHE_KEY_PRODUCTS],
  {
    tags: [CACHE_KEY_PRODUCTS],
  },
)

export const getProductForAdmin = unstable_cache(
  async (productId: string, cookie: ReadonlyRequestCookies) => {
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
  },
  [CACHE_KEY_PRODUCT],
  {
    tags: [CACHE_KEY_PRODUCT],
  },
)
