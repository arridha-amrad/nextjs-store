import FormEditProduct from "@/components/forms/product/Edit";
import { getProductCache } from "@/db/queries/product";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const cookie = await cookies();
  const productId = (await params).productId;
  const product = await getProductCache(productId, cookie);

  if (product === null) redirect("/products");
  const {
    description,
    name,
    price,
    product_category,
    product_photo,
    stock,
    id,
  } = product;

  return (
    <main className="py-4 px-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Edit Product</h1>
      </div>
      <FormEditProduct
        props={{
          id,
          categories: product_category.map((v) => v.categories.name),
          description: description,
          name,
          photos: product_photo.map((v) => v.url),
          price,
          stock,
        }}
      />
    </main>
  );
}

export default Page;
