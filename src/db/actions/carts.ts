'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_COUNTER,
  CACHE_KEY_CARTS_TOTAL_PRICE,
} from '@/cacheKey'
import { Supabase } from '@/lib/supabase/Supabase'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '../../../database.types'

export const create = async (productId: string) => {
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

  let message = ''
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
    message = 'New items added to your cart'
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
    message = 'Your carts has been updated'
  }

  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
  revalidateTag(CACHE_KEY_CARTS_COUNTER)

  return message
}

export const destroy = async (cartId: number) => {
  const sb = await Supabase.initServerClient()
  const { error } = await sb.from('carts').delete().eq('id', cartId)
  if (error) {
    console.log(error)
  }
  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
  revalidateTag(CACHE_KEY_CARTS_COUNTER)
}

type UpdateProps = Database['public']['Tables']['carts']['Update']
export const update = async (cartId: number, data: UpdateProps) => {
  const sb = await Supabase.initServerClient()
  const { error } = await sb.from('carts').update(data).eq('id', cartId)
  if (error) {
    console.log(error)
  }
  revalidateTag(CACHE_KEY_CARTS)
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE)
}
