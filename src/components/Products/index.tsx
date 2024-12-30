import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { Card } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';

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

  const IMAGE_BASE_URL =
    'https://fzsbsdqssixryyzeanoc.supabase.co/storage/v1/object/public/products';

  return (
    <div className="container mx-auto grid grid-cols-6 gap-x-4 gap-y-20">
      {products.map((p) => (
        <Card
          className="overflow-hidden group flex flex-col relative"
          key={p.id}
        >
          <div className="overflow-hidden">
            <Image
              width={500}
              height={500}
              alt="product-photo"
              src={`${IMAGE_BASE_URL}/${p.product_photo[0].url}`}
            />
          </div>
          <div className="px-4 py-2 flex-1">
            <h1 className="line-clamp-2 text-sm text-muted-foreground">
              {p.name}
            </h1>
            <h2 className="text-xl font-bold leading-loose">$ {p.price}</h2>
          </div>
          <div className="bottom-0 absolute group-hover:opacity-0 opacity-100 left-0 py-2 px-4">
            <p className="text-sm text-muted-foreground">5 Sold</p>
          </div>
          <Button
            className="w-full opacity-0 group-hover:opacity-100 ease-linear duration-150 transition-opacity relative select-none cursor-pointer"
            variant="secondary"
            size="sm"
          >
            <ShoppingCart />
            Add To Cart
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default Products;
