'use server';

import { CACHE_KEY_CARTS } from '@/cacheKey';
import { Supabase } from '@/lib/supabase/Supabase';
import { revalidateTag } from 'next/cache';

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
  return true;
};
