import Products from '@/components/Products'
import { getProductsOnSales } from '@/db/queries/product'
import { cookies } from 'next/headers'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>
}) {
  const cookie = await cookies()
  const { search } = await searchParams
  const [products] = await Promise.all([
    getProductsOnSales(cookie, search as string | undefined),
  ])

  return <Products products={products} />
}
