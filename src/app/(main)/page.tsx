import Products from '@/components/Products'
import { getProductsOnSalesFromCache } from '@/db/queries/product'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const [products] = await Promise.all([getProductsOnSalesFromCache(cookie)])

  return <Products products={products} />
}
