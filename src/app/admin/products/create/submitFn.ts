import { createClient } from "@/lib/supabase/client";
import { TCreateProduct } from "./definition";
import { v4 } from "uuid";

export const submitCreateProductForm = async (
  state: TCreateProduct,
  photos: FileList
) => {
  const sb = createClient();
  const { categories, description, name, price, stock } = state;
  const arrCategories = categories.split(", ");

  try {
    // 1. insert the categories
    const { data: d, error: err } = await sb
      .from("categories")
      .select("*")
      .in("name", arrCategories);
    if (err) throw err;
    if (d === null) return;

    // 2. since every category is unique. insert same category will throw err
    const registeredCategories = d.map((v) => v.name);
    // 2.1. filter the categories we re going to insert against the already registered categories
    const categoriesToInsert = [];
    for (const cat of arrCategories) {
      if (!registeredCategories.includes(cat)) {
        categoriesToInsert.push(cat);
      }
    }

    // 3. insert the categories
    const { data: d2, error: err2 } = await sb
      .from("categories")
      .insert(categoriesToInsert.map((v) => ({ name: v })))
      .select("id");
    if (err2) throw err2;
    if (!d2) return;

    // 4. insert the product
    const { data: d3, error: err3 } = await sb
      .from("products")
      .insert({
        description,
        name,
        price,
        stock,
      })
      .select();
    if (err3) throw err3;
    if (d3 === null) return;

    // 5. tie each product with a category
    await sb.from("product_category").insert(
      [...d2, ...d].map((v) => ({
        product_id: d3[0].id,
        category_id: v.id,
      }))
    );

    // 6. upload the product photo
    const photo_products: string[] = [];
    for (const photo of photos) {
      const photoId = v4();
      const fileType = photo.type.split("/")[1];
      const { data: d4, error: err4 } = await sb.storage
        .from("products")
        .upload(`${d3[0].id}/${photoId}.${fileType}`, photo);
      if (err4) throw err4;
      if (d4 === null) return;
      photo_products.push(d4.path);
    }

    // 7. tie each photo with its productId
    await sb.from("product_photo").insert(
      photo_products.map((v) => ({
        url: v,
        product_id: d3[0].id,
      }))
    );

    return "New product added successfully";
  } catch (error: any) {
    throw error.message;
  }
};
