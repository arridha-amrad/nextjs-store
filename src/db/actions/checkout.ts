'use server';

import {
  CACHE_KEY_CARTS,
  CACHE_KEY_CARTS_TOTAL_PRICE,
  CACHE_KEY_TRANSACTIONS,
} from '@/cacheKey';
import { Supabase } from '@/lib/supabase/Supabase';
import { revalidateTag } from 'next/cache';
import { v4 } from 'uuid';
import { Database } from '../../../database.types';
import { redirect } from 'next/navigation';

export const addToCart = async (productId: string) => {
  const sb = await Supabase.initServerClient();
  const { data: user } = await sb.auth.getUser();

  const { error } = await sb.from('carts').insert({
    product_id: productId,
    total: 1,
    user_id: user.user?.id ?? '',
  });

  if (error) {
    console.log(error);
    return false;
  }

  revalidateTag(CACHE_KEY_CARTS);
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE);
  return true;
};

export const deleteFromCart = async (cartId: number) => {
  const sb = await Supabase.initServerClient();
  const { error } = await sb.from('carts').delete().eq('id', cartId);
  if (error) {
    console.log(error);
  }
  revalidateTag(CACHE_KEY_CARTS);
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE);
};

type UpdateProps = Database['public']['Tables']['carts']['Update'];
export const updateCartItem = async (cartId: number, data: UpdateProps) => {
  const sb = await Supabase.initServerClient();
  const { error } = await sb.from('carts').update(data).eq('id', cartId);
  if (error) {
    console.log(error);
  }
  revalidateTag(CACHE_KEY_CARTS);
  revalidateTag(CACHE_KEY_CARTS_TOTAL_PRICE);
};

export const createOrder = async () => {
  const sb = await Supabase.initServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Create order from the carts of login user with isSelect is true

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
    .eq('is_select', true);

  if (errCarts) {
    console.log(errCarts);
  }

  if (!carts) return;

  const { error: errNewOrder, data } = await sb
    .from('orders')
    .insert({
      status: 'on progress',
      value: 0,
    })
    .select()
    .single();

  const { error } = await sb.from('orders_items').insert(
    carts.map((v) => ({
      user_id: v.user_id,
      product_id: v.product_id,
      total_items: v.total,
      order_id: data?.id ?? '',
    })),
  );

  if (error) {
    console.log(error);
  }

  const orderValue = carts.reduce((pv, cv) => {
    const value = cv.total * cv.products.price;
    return pv + value;
  }, 0);

  await sb
    .from('orders')
    .update({
      value: orderValue,
    })
    .eq('id', data?.id ?? '');

  if (errNewOrder) {
    console.log(errNewOrder);
  }

  await sb.from('carts').delete().eq('is_select', true).eq('user_id', user.id);

  // kurangkan stock produk
  for (const p of carts) {
    const { data } = await sb
      .from('products')
      .select('*')
      .eq('id', p.product_id)
      .single();
    if (data) {
      await sb.from('products').update({ stock: data.stock - p.total });
    }
  }

  revalidateTag(CACHE_KEY_TRANSACTIONS);
  redirect('/transactions');
};
