import Cart from '@/components/ShopCart';
import { ContextCartProvider } from '@/components/ShopCart/Context';
import { getCartsFromCache } from '@/db/queries/carts';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookie = await cookies();
  const result = await getCartsFromCache(cookie);
  return (
    <ContextCartProvider>
      <Cart data={result} />
    </ContextCartProvider>
  );
}
