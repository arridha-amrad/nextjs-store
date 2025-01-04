import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCachedProducts } from '@/db/queries/product'
import { cookies } from 'next/headers'
import Link from 'next/link'
import AlertDialogDeleteProduct from './alertDialog/DeleteProduct'
import { rupiahFormatter } from '@/lib/utils'

async function TableProducts() {
  const cookie = await cookies()
  const products = await getCachedProducts(cookie)
  return (
    <Table>
      <TableCaption>A list of your ready stock products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-fit">No.</TableHead>
          <TableHead className="">Product's Name</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={product.id}>
            <TableCell className="">{i + 1}</TableCell>
            <TableCell className="max-w-sm">{product.name}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{rupiahFormatter.format(product.price)}</TableCell>
            <TableCell className="text-right space-x-4">
              <Link href={`/admin/products/${product.id}`}>Edit</Link>
              <AlertDialogDeleteProduct id={product.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableProducts
