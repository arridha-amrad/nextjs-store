'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_TOTAL_PRICE,
  CACHE_KEY_PRODUCTS,
  CACHE_KEY_PRODUCTS_ON_SALES,
  CACHE_KEY_TRANSACTIONS,
} from '@/cacheKey'
import { Supabase } from '@/lib/supabase/Supabase'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '../../../database.types'

export const addToCart = async (productId: string) => {
  const sb = await Supabase.initServerClient()
  const {
    data: { user },
  } = await sb.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // if user doesn't have curr product in his cart -> create new one
  // else update his cart -> total + 1
  const { data: carts } = await sb
    .from('carts')
    .select('total')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (carts) {
    const { error } = await sb
      .from('carts')
      .update({
        total: carts.total + 1,
      })
      .eq('user_id', user.id)
      .eq('product_id', productId)
    if (error) {
      console.log(error)
      return error.message
    }
  } else {
    const { error } = await sb.from('carts').insert({
      product_id: productId,
      total: 1,
      user_id: user.id,
    })
    if (error) {
      console.log(error)
      return error.message
    }
  }

  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
  return 'Your carts has been updated'
}

export const deleteFromCart = async (cartId: number) => {
  const sb = await Supabase.initServerClient()
  const { error } = await sb.from('carts').delete().eq('id', cartId)
  if (error) {
    console.log(error)
  }
  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
}

type UpdateProps = Database['public']['Tables']['carts']['Update']
export const updateCartItem = async (cartId: number, data: UpdateProps) => {
  const sb = await Supabase.initServerClient()
  const { error } = await sb.from('carts').update(data).eq('id', cartId)
  if (error) {
    console.log(error)
  }
  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
}

export const createOrder = async () => {
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
    .from('orders')
    .insert({
      status: 'on progress',
      value: 0,
    })
    .select()
    .single()

  // 3. create order_items based on carts
  const { error } = await sb.from('orders_items').insert(
    carts.map((v) => ({
      user_id: v.user_id,
      product_id: v.product_id,
      total_items: v.total,
      order_id: data?.id ?? '',
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
    .from('orders')
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

  return 'Your request order has been placed successfully'
}
