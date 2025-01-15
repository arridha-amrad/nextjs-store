'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_AMOUNT,
  CACHE_KEY_CARTS_COUNTER,
  CACHE_KEY_CUSTOMER_TRANSACTIONS,
  CACHE_KEY_PRODUCTS_ON_CUSTOMER,
  CACHE_KEY_TRANSACTIONS_ADMIN,
} from '@/cacheKey'
import { SafeActionError } from '@/lib/errors/SafeActionError'
import { authActionClient } from '@/lib/safeAction'
import { generateInvoice } from '@/lib/utils'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { Database } from '../../../database.types'

export const createTransaction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { supabase, user } }) => {
    const { error } = await supabase.rpc('create_transaction', {
      auth_user_id: user.id,
      new_invoice: generateInvoice(),
    })

    if (error) {
      throw new SafeActionError(error.message)
    }

    revalidateTag(CACHE_KEY_CARTS)
    revalidateTag(CACHE_KEY_CARTS_AMOUNT)
    revalidateTag(CACHE_KEY_PRODUCTS_ON_CUSTOMER)
    revalidateTag(CACHE_KEY_CARTS_COUNTER)
    revalidateTag(CACHE_KEY_CUSTOMER_TRANSACTIONS)

    return 'Your request order has been placed successfully'
  })

type UpdateProps = Database['public']['Tables']['transactions']['Update']
export const updateTransaction = authActionClient
  .schema(
    z.object({
      data: z.custom<UpdateProps>(),
    }),
  )
  .action(async ({ parsedInput: { data }, ctx: { supabase } }) => {
    const invoice = data.invoice

    if (!invoice) {
      throw new SafeActionError(
        'Please include transaction invoice to perform update',
      )
    }

    const { error } = await supabase
      .from('transactions')
      .update(data)
      .eq('invoice', invoice)

    if (error) {
      throw new SafeActionError(error.message)
    }

    revalidateTag(CACHE_KEY_TRANSACTIONS_ADMIN)
  })
