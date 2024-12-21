import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AlertDialogDeleteProduct from "./AlertDialogDeleteProduct";
import { unstable_cache } from "next/cache";
import { CACHE_KEY_PRODUCTS } from "@/cacheKey";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

const fetchProducts = async (cookie: ReadonlyRequestCookies) => {
  const supabase = createClient(cookie);
  const { data } = await supabase.from("products").select("*");
  return data;
};
const getCachedProducts = unstable_cache(fetchProducts, [CACHE_KEY_PRODUCTS], {
  tags: [CACHE_KEY_PRODUCTS],
});

async function TableProducts() {
  const cookie = await cookies();
  const products = await getCachedProducts(cookie);
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
            <TableCell className="">{product.name}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell className="text-right space-x-4">
              <Link href={`/admin/products/${product.id}`}>Edit</Link>
              <AlertDialogDeleteProduct id={product.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableProducts;
