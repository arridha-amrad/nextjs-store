import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_COUNTER,
  CACHE_KEY_CARTS_TOTAL_PRICE,
} from '@/cacheKey'
import { createClient } from '@/lib/supabase/server'
import { getAuthUserAndClient } from '@/lib/utils'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getCountItemsFromCache = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const { supabase, user } = await getAuthUserAndClient(cookie)
    const { count } = await supabase
      .from('carts')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id ?? '')
    return count ?? 0
  },
  [CACHE_KEY_CARTS_COUNTER],
  { tags: [CACHE_KEY_CARTS_COUNTER] },
)

export const getCartsFromCache = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const sb = createClient(cookie)
    const { data } = await sb.auth.getUser()
    const result = await sb
      .from('carts')
      .select(
        `*,
          products (
            name,id,price,
            product_photos (
              url
            )
          )
        `,
        { count: 'exact' },
      )
      .eq('user_id', data.user?.id ?? '')
      .order('created_at', { ascending: false })

    return result
  },
  [CACHE_KEY_CARTS],
  {
    tags: [CACHE_KEY_CARTS],
  },
)

export type TCarts = Awaited<ReturnType<typeof getCartsFromCache>>

export const calculateCartTotalPrice = async (
  cookie: ReadonlyRequestCookies,
) => {
  const sb = createClient(cookie)
  const { data } = await sb.auth.getUser()

  const { data: carts, error } = await sb
    .from('carts')
    .select(
      `*,
      products(
        price
      )
      `,
    )
    .eq('user_id', data.user?.id ?? '')
    .eq('is_select', true)

  if (error) {
    console.log(error)
  }

  let total = 0
  if (carts) {
    for (const c of carts) {
      const totalPrice = c.total * c.products.price
      total += totalPrice
    }
  }
  return total
}

export const getCartTotalPriceFromCache = unstable_cache(
  calculateCartTotalPrice,
  [CACHE_KEY_CARTS_TOTAL_PRICE],
  {
    tags: [CACHE_KEY_CARTS_TOTAL_PRICE],
  },
)
