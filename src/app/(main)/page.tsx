import Products from '@/components/Products'
import { getProductsOnSalesFromCache } from '@/db/queries/product'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const [products] = await Promise.all([getProductsOnSalesFromCache(cookie)])

  console.log({ products })

  // return (
  //   <div>
  //     <p>Products</p>
  //   </div>
  // )

  return <Products products={products} />
}
