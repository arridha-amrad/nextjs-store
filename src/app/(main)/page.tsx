import Products from '@/components/Products'
import { getProductsOnSalesFromCache } from '@/db/queries/product'
import { cookies } from 'next/headers'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const cookie = await cookies()

  const { search } = await searchParams

  const [products] = await Promise.all([
    getProductsOnSalesFromCache(cookie, search as string | undefined),
  ])

  await new Promise((res) => setTimeout(res, 3000))

  return <Products products={products} />
}
