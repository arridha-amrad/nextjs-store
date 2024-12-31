import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';
import ProductItem from './Item';

const fetchProducts = async (cookie: ReadonlyRequestCookies) => {
  const sb = createClient(cookie);
  const { data, error } = await sb.from('products').select(`*,
        product_photo(
            *
        )    
    `);
  if (error) {
    console.log(error);
  }
  return data;
};

const getProductFromCache = unstable_cache(fetchProducts);

async function Products() {
  const cookie = await cookies();
  const products = await getProductFromCache(cookie);

  if (!products) {
    return (
      <div>
        <h1>Something went wrong</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-6 gap-x-4 gap-y-20">
      {products.map((p) => (
        <ProductItem product={p} key={p.id} />
      ))}
    </div>
  );
}

export default Products;
