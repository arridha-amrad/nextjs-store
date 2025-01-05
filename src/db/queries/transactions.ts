import { CACHE_KEY_TRANSACTIONS_ADMIN } from '@/cacheKey'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getTransactionForAdminCache = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const supabase = createClient(cookie)

    const { data, error } = await supabase
      .from('transactions')
      .select('value, status, invoice, created_at')
    if (error) {
      console.log(error)
    }

    return data
  },
  [CACHE_KEY_TRANSACTIONS_ADMIN],
  {
    tags: [CACHE_KEY_TRANSACTIONS_ADMIN],
  },
)

export type TransactionTable = {
  value: number
  status: 'on progress' | 'confirmed' | 'shipping' | 'arrived'
  invoice: string | null
  created_at: string
}
