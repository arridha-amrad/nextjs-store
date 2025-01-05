'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_COUNTER,
  CACHE_KEY_CARTS_TOTAL_PRICE,
  CACHE_KEY_PRODUCTS_ON_SALES,
  CACHE_KEY_TRANSACTIONS,
  CACHE_KEY_TRANSACTIONS_ADMIN,
} from '@/cacheKey'
import { TransactionStatus } from '@/lib/definitions/transaction'
import { Supabase } from '@/lib/supabase/Supabase'
import { generateInvoice } from '@/lib/utils'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export const create = async () => {
  const sb = await Supabase.initServerClient()
  const {
    data: { user },
  } = await sb.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. get items from carts
  // with user_id = curr login user
  // and is_selected is true
  const { data: carts, error: errCarts } = await sb
    .from('carts')
    .select(
      `*,
        products(
          price
        )
        `,
    )
    .eq('user_id', user.id)
    .eq('is_select', true)

  if (errCarts) {
    console.log(errCarts)
    return errCarts.message
  }
  if (!carts) return

  // 2. create new order
  const { error: errNewOrder, data } = await sb
    .from('transactions')
    .insert({
      status: 'on progress',
      value: 0,
      user_id: user.id,
      invoice: generateInvoice(),
    })
    .select()
    .single()

  // 3. create order_items based on carts
  const { error } = await sb.from('orders').insert(
    carts.map((v) => ({
      product_id: v.product_id,
      total_items: v.total,
      transaction_id: data?.id ?? '',
      user_id: user.id,
    })),
  )

  if (error) {
    console.log(error)
    return error.message
  }

  // 4. calculate order value
  const orderValue = carts.reduce((pv, cv) => {
    const value = cv.total * cv.products.price
    return pv + value
  }, 0)

  // 5. update order value from orders table
  await sb
    .from('transactions')
    .update({
      value: orderValue,
    })
    .eq('id', data?.id ?? '')

  if (errNewOrder) {
    console.log(errNewOrder)
    return errNewOrder.message
  }

  // 6. delete ordered items from carts
  await sb.from('carts').delete().eq('is_select', true).eq('user_id', user.id)

  // 7. subtract product stock
  for (const p of carts) {
    const { data } = await sb
      .from('products')
      .select('*')
      .eq('id', p.product_id)
      .single()
    if (data) {
      await sb
        .from('products')
        .update({ stock: data.stock - p.total })
        .eq('id', p.product_id)
    }
  }

  revalidateTag(CACHE_KEY_TRANSACTIONS)
  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
  revalidateTag(CACHE_KEY_PRODUCTS_ON_SALES)
  revalidateTag(CACHE_KEY_CARTS_COUNTER)

  return 'Your request order has been placed successfully'
}

export const updateTransactionStatus = async (
  invoice: string,
  status: TransactionStatus,
) => {
  const supabase = await Supabase.initServerClient()
  await supabase
    .from('transactions')
    .update({
      status,
    })
    .eq('invoice', invoice)

  revalidateTag(CACHE_KEY_TRANSACTIONS_ADMIN)
}
