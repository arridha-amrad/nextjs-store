import FormEditProduct from '@/components/forms/product/Edit'
import { getProductForAdmin } from '@/db/queries/product'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const cookie = await cookies()
  const productId = (await params).productId
  const product = await getProductForAdmin(productId, cookie)

  if (product === null) redirect('/products')
  const {
    description,
    name,
    price,
    product_categories,
    product_photos,
    stock,
    id,
  } = product

  return (
    <main className="">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Edit Product</h1>
      </div>
      <FormEditProduct
        props={{
          id,
          categories: product_categories.map((v) => v.categories.name),
          description: description,
          name,
          photos: product_photos.map((v) => v.url),
          price,
          stock,
        }}
      />
    </main>
  )
}

export default Page
