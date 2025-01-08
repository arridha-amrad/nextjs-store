'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_COUNTER,
  CACHE_KEY_CARTS_TOTAL_PRICE,
  CACHE_KEY_CUSTOMER_TRANSACTIONS,
  CACHE_KEY_PRODUCTS_ON_SALES,
} from '@/cacheKey'
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
    return redirect('/login')
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
  const { data: newTransaction, error: errNewOrder } = await sb
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
      transaction_id: newTransaction?.id ?? '',
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
    .eq('id', newTransaction?.id ?? '')

  if (errNewOrder) {
    console.log(errNewOrder)
    return errNewOrder.message
  }

  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
  revalidateTag(CACHE_KEY_PRODUCTS_ON_SALES)
  revalidateTag(CACHE_KEY_CARTS_COUNTER)
  revalidateTag(CACHE_KEY_CUSTOMER_TRANSACTIONS)

  return 'Your request order has been placed successfully'
}
