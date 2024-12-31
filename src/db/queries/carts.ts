import { CACHE_KEY_CARTS } from '@/cacheKey';
import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const fetchMyCarts = async (cookie: ReadonlyRequestCookies) => {
  const sb = createClient(cookie);
  const { data } = await sb.auth.getUser();
  const result = await sb
    .from('carts')
    .select(
      `*,
        products (
          name,id,price,
          product_photo (
            url
          )
        )
      `,
      { count: 'exact' },
    )
    .eq('user_id', data.user?.id ?? '');

  return result;
};

export const getCartsFromCache = unstable_cache(
  fetchMyCarts,
  [CACHE_KEY_CARTS],
  {
    tags: [CACHE_KEY_CARTS],
  },
);
export type TCarts = Awaited<ReturnType<typeof fetchMyCarts>>;
