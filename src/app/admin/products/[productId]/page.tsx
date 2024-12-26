import { CACHE_KEY_PRODUCT } from "@/cacheKey";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import FormEditProduct from "../../../../features/product/edit/FormEditProduct";
import { redirect } from "next/navigation";

const fetchProduct = async (
  productId: string,
  cookie: ReadonlyRequestCookies
) => {
  const supabase = createClient(cookie);
  const { data } = await supabase
    .from("products")
    .select(
      `*, 
    product_photo (
        url
    ),
    product_category (
        categories (
            name
        )
    )
    `
    )
    .eq("id", productId)
    .single();
  return data;
};

const getProductCache = unstable_cache(fetchProduct, [CACHE_KEY_PRODUCT], {
  tags: [CACHE_KEY_PRODUCT],
});

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
          categories: product_category.map((v) => v.categories.name).join(", "),
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
