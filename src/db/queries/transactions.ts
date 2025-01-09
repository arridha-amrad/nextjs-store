import {
  CACHE_KEY_CUSTOMER_TRANSACTIONS,
  CACHE_KEY_TRANSACTIONS_ADMIN,
} from '@/cacheKey'
import { Transaction, TransactionStatus } from '@/lib/definitions/transaction'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getCustomerTransactions = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const supabase = createClient(cookie)
    const { data, error } = await supabase
      .from('customer_transactions')
      .select()
      .returns<Transaction[]>()
    if (error) {
      console.log(error)
    }
    return data ?? []
  },
  [CACHE_KEY_CUSTOMER_TRANSACTIONS],
  {
    tags: [CACHE_KEY_CUSTOMER_TRANSACTIONS],
  },
)

export type TransactionAdminFilter = {
  invoice?: string
  page?: number
  status?: TransactionStatus
}

export const getTransactionForAdmin = unstable_cache(
  async (cookie: ReadonlyRequestCookies, filter?: TransactionAdminFilter) => {
    const supabase = createClient(cookie)

    const currPage = filter?.page ?? 1
    const postPerPage = 5

    const query = supabase
      .from('transactions')
      .select('value, status, invoice, created_at', {
        count: 'exact',
        head: false,
      })

    if (filter?.invoice) {
      query.eq('invoice', filter.invoice)
    }

    if (filter?.status) {
      query.eq('status', filter.status)
    }

    query.range((currPage - 1) * postPerPage, currPage * postPerPage - 1)
    query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.log(error)
    }

    const totalPages = count ? Math.ceil(count / postPerPage) : 0

    return {
      data,
      count,
      totalPages,
    }
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
