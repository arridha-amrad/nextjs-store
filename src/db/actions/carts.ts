'use server'

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_AMOUNT,
  CACHE_KEY_CARTS_COUNTER,
} from '@/cacheKey'
import { SafeActionError } from '@/lib/errors/SafeActionError'
import { authActionClient } from '@/lib/safeAction'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Database } from '../../../database.types'

/**
 *  TODO:
 *  if user doesn't have curr product in his cart, then create a new cart
 *  else update his cart, total += 1
 */

export const addToCart = authActionClient
  .schema(
    z.object({
      productId: zfd.text(z.string()),
    }),
  )
  .action(async ({ ctx: { supabase, user }, parsedInput: { productId } }) => {
    const { data, error } = await supabase
      .from('carts')
      .select('total')
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      throw new SafeActionError(error.message)
    }

    let message = ''

    if (data.length === 0) {
      const { error } = await supabase.from('carts').insert({
        product_id: productId,
        total: 1,
        user_id: user.id,
      })

      if (error) {
        throw new SafeActionError(error.message)
      }

      message = 'Your carts has been updated'
    } else {
      const { error } = await supabase
        .from('carts')
        .update({
          total: data[0].total + 1,
        })
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) {
        throw new SafeActionError(error.message)
      }

      message = 'New items added to your cart'
    }

    revalidateTag(CACHE_KEY_CARTS)
    revalidateTag(CACHE_KEY_CARTS_AMOUNT)
    revalidateTag(CACHE_KEY_CARTS_COUNTER)

    return message
  })

export const destroy = authActionClient
  .schema(
    z.object({
      cartId: z.number(),
    }),
  )
  .action(async ({ ctx: { supabase }, parsedInput: { cartId } }) => {
    const { error } = await supabase.from('carts').delete().eq('id', cartId)

    if (error) {
      throw new SafeActionError(error.message)
    }

    revalidateTag(CACHE_KEY_CARTS)
    revalidateTag(CACHE_KEY_CARTS_AMOUNT)
    revalidateTag(CACHE_KEY_CARTS_COUNTER)
  })

type UpdateProps = Database['public']['Tables']['carts']['Update']
export const updateCart = authActionClient
  .schema(z.custom<UpdateProps>())
  .action(async ({ parsedInput: data, ctx: { supabase } }) => {
    if (!data.id) {
      throw new SafeActionError('cart id is required')
    }
    const { error } = await supabase
      .from('carts')
      .update(data)
      .eq('id', data.id)

    if (error) {
      throw new SafeActionError(error.message)
    }

    revalidateTag(CACHE_KEY_CARTS)
    revalidateTag(CACHE_KEY_CARTS_AMOUNT)
  })
