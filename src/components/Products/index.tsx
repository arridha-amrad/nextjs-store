import { ProductsOnSales } from '@/db/queries/product'
import ProductItem from './Item'

type Props = {
  products: ProductsOnSales[]
}

async function Products({ products }: Props) {
  return (
    <div className="grid lg:grid-cols-6 grid-cols-4 gap-x-4 gap-y-20">
      {products.map((p) => (
        <ProductItem product={p} key={p.id} />
      ))}
    </div>
  )
}

export default Products
